import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserProfile, HelpTicket } from '../types';
import { PLANS, OFFICIAL_TELEGRAM_URL, OFFICIAL_EMAIL } from '../data/plansData';
import {
  getDownlineStats,
  getAllUsers,
  fetchUsersFromServer,
  createHelpTicket,
  getHelpTickets,
  fetchTicketsFromServer,
  updateUserProfile,
  checkUsernameAvailableAsync,
} from '../services/userService';
import { SmartFileUpload } from './SmartFileUpload';
import { ProfileEditSection } from './ProfileEditSection';
import { StudentReferralHub } from './StudentReferralHub';
import { MarketingToolsSection } from './MarketingToolsSection';
import { IDCardGenerator } from './IDCardGenerator';
import { PromotionalPosterStudio } from './PromotionalPosterStudio';
import { PrivateChatMessenger } from './PrivateChatMessenger';
import { IoisChatHelpHub } from './IoisChatHelpHub';
import { NotificationModal } from './NotificationModal';
import { AdminHomePhotoPopup } from './AdminHomePhotoPopup';
import { PROFILE_FRAMES, getProfileFrameById } from '../data/profileFramesData';
import { getUserUnreadCount, markChatMessagesAsRead } from '../services/notificationService';
import { fetchSocialBootstrapAsync, getSocialUnreadCache } from '../services/socialChatService';
import {
  User,
  CreditCard,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Send,
  LogOut,
  MessageSquare,
  Sparkles,
  Mail,
  Share2,
  Users,
  Image as ImageIcon,
  Crown,
  Copy,
  Check,
  Wallet,
  Camera,
  BadgeCheck,
  MessageCircle,
  X,
  Loader2,
  Globe,
  Bell,
  Edit3,
  Palette,
  Eye,
  Heart,
  UserPlus,
  Maximize2,
  Download,
  TrendingUp,
  Rocket,
  ArrowUpRight,
} from 'lucide-react';

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=85';

type FeaturePopupKey =
  | 'referral'
  | 'iois_chat'
  | 'idcard'
  | 'chat'
  | 'posters'
  | 'marketing'
  | 'profile'
  | 'support';

interface UserDashboardProps {
  user: UserProfile;
  onUserUpdated: (updated: UserProfile) => void;
  onLogout: () => void;
  onScrollToCard: () => void;
  onOpenSponsorAddMember?: (planId?: number) => void;
  onOpenPublicProfile?: (userOrHandle: UserProfile | string) => void;
  initialDashboardTab?: FeaturePopupKey;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onUserUpdated,
  onLogout,
  onOpenSponsorAddMember,
  onOpenPublicProfile,
  initialDashboardTab,
}) => {
  const [activeFeaturePopup, setActiveFeaturePopup] = useState<FeaturePopupKey | null>(() => {
    if (initialDashboardTab && initialDashboardTab !== 'referral') {
      return initialDashboardTab;
    }
    return null;
  });

  useEffect(() => {
    if (initialDashboardTab && initialDashboardTab !== 'referral') {
      setActiveFeaturePopup(initialDashboardTab);
    }
  }, [initialDashboardTab]);

  const [socialTargetThreadId, setSocialTargetThreadId] = useState<string>('');
  const [socialTargetUserId, setSocialTargetUserId] = useState<string>('');
  const [socialUnreadCache, setSocialUnreadCache] = useState(() => getSocialUnreadCache(user.userId));
  const [profileViewsLive, setProfileViewsLive] = useState<number>(user.profileViews || 0);
  const [profileLikesCount, setProfileLikesCount] = useState<number>(user.profileLikes?.length || 0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedShortLink, setCopiedShortLink] = useState<boolean>(false);
  const [dashboardNotice, setDashboardNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Avatar display state with fallback
  const [avatarImgSrc, setAvatarImgSrc] = useState<string>(user.photoUrl?.trim() || FALLBACK_AVATAR);
  useEffect(() => {
    setAvatarImgSrc(user.photoUrl?.trim() || FALLBACK_AVATAR);
  }, [user.photoUrl]);

  // 3D Live Profile Frame State
  const [activeFrameId, setActiveFrameId] = useState<string>(() => {
    try {
      return localStorage.getItem(`iois_user_frame_${user.userId}`) || user.profileFrameId || 'iois-spinning-orbit-rainbow';
    } catch {
      return user.profileFrameId || 'iois-spinning-orbit-rainbow';
    }
  });

  useEffect(() => {
    if (user.profileFrameId) {
      setActiveFrameId(user.profileFrameId);
    }
  }, [user.profileFrameId]);

  const [isFrameModalOpen, setIsFrameModalOpen] = useState<boolean>(false);
  const [frameCategoryFilter, setFrameCategoryFilter] = useState<'all' | 'orbit' | 'plan' | 'festive' | 'gemstone'>('all');

  // Complete Photo Lightbox & Photo Changer Popups
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [photoError, setPhotoError] = useState<string>('');
  const [isSavingPhoto, setIsSavingPhoto] = useState<boolean>(false);

  // Username Editor Popup
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState<boolean>(false);
  const [newUsernameInput, setNewUsernameInput] = useState<string>(user.username || '');
  const [usernameError, setUsernameError] = useState<string>('');
  const [usernameSuccess, setUsernameSuccess] = useState<string>('');
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  // Notification Modal State
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [userUnreadCount, setUserUnreadCount] = useState<number>(() => getUserUnreadCount(user.userId));

  // Live Stats & Server Sync
  const [stats, setStats] = useState(() => getDownlineStats(user.userId));

  useEffect(() => {
    let mounted = true;
    const syncDownlines = async () => {
      try {
        const localUsers = getAllUsers();
        if (mounted) setStats(getDownlineStats(user.userId, localUsers));
        const liveUsers = await fetchUsersFromServer();
        if (mounted && Array.isArray(liveUsers) && liveUsers.length > 0) {
          setStats(getDownlineStats(user.userId, liveUsers));
        }
      } catch {}
    };
    syncDownlines();
    return () => {
      mounted = false;
    };
  }, [user.userId]);

  useEffect(() => {
    const updateUnread = () => {
      setUserUnreadCount(getUserUnreadCount(user.userId));
      setSocialUnreadCache(getSocialUnreadCache(user.userId));
    };
    const refreshSocial = async () => {
      try {
        const boot = await fetchSocialBootstrapAsync(user.userId);
        const me = boot.directory.find((u) => u.userId?.toUpperCase() === user.userId?.toUpperCase());
        if (me) {
          setProfileViewsLive(me.profileViews || 0);
          setProfileLikesCount(me.profileLikes?.length || 0);
        }
        updateUnread();
      } catch {}
    };
    updateUnread();
    refreshSocial();
    window.addEventListener('iois_notifications_updated', updateUnread);
    window.addEventListener('storage', updateUnread);
    const interval = setInterval(refreshSocial, 7000);
    return () => {
      window.removeEventListener('iois_notifications_updated', updateUnread);
      window.removeEventListener('storage', updateUnread);
      clearInterval(interval);
    };
  }, [user.userId]);

  const showTempNotice = (type: 'success' | 'error', text: string) => {
    setDashboardNotice({ type, text });
    setTimeout(() => setDashboardNotice(null), 4000);
  };

  const handleSelectFrame = (frameId: string) => {
    setActiveFrameId(frameId);
    try {
      localStorage.setItem(`iois_user_frame_${user.userId}`, frameId);
      const updated = updateUserProfile({ ...user, profileFrameId: frameId });
      onUserUpdated(updated);
      window.dispatchEvent(new Event('iois_user_frame_updated'));
      showTempNotice('success', '✅ नया 3D लाइव प्रोफाइल फ्रेम लागू हो गया है!');
    } catch (err: any) {
      showTempNotice('error', err?.message || 'फ्रेम सेव करने में त्रुटि आई।');
    }
  };

  const [withdrawals] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(`iois_withdrawals_${user.userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const totalWithdrawn = withdrawals
    .filter((w: any) => w.status !== 'rejected')
    .reduce((sum: number, w: any) => sum + (Number(w.amount) || 0), 0);
  const availableBalance = Math.max(0, stats.totalEarningsApproved - totalWithdrawn);

  const selectedPlan = PLANS.find((p) => p.id === user.selectedPlanId) || PLANS[0];
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ioisplatform.github.io';
  const usernameLink = user.username
    ? `${origin}/?s=${encodeURIComponent(user.username)}`
    : `${origin}/?s=${encodeURIComponent(user.userId)}`;
  const userIdLink = `${origin}/?s=${encodeURIComponent(user.userId)}`;
  const activeReferralUrl = user.username ? usernameLink : userIdLink;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(activeReferralUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {}
  };

  const handleCopyShortLink = async () => {
    try {
      await navigator.clipboard.writeText(activeReferralUrl);
      setCopiedShortLink(true);
      setTimeout(() => setCopiedShortLink(false), 2200);
    } catch {}
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(user.userId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    } catch {}
  };

  const handleShareWhatsApp = () => {
    const sponsorTag = user.username ? `@${user.username} (ID: ${user.userId})` : user.userId;
    const text = `🇮🇳 *भारतीय ऑनलाइन शिक्षा एवं स्वावलंबन मिशन (IOIS)* 📚\n\nनमस्ते! मैंने IOIS डिजिटल एजुकेशन मिशन ज्वाइन किया है। यहाँ मात्र ₹10 से ₹999 में NCERT डिजिटल नोट्स, 700+ पेज किट व डिजिटल ID कार्ड मिलता है।\n\n👉 *मेरी शॉर्ट स्पॉन्सर लिंक से अभी जुड़ें:*\n${activeReferralUrl}\n\n🏷️ *Sponsor:* ${sponsorTag}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    const text = `🇮🇳 भारतीय ऑनलाइन शिक्षा एवं स्वावलंबन मिशन (IOIS) 📚\nमेरे आधिकारिक स्पॉन्सर कोड से जुड़ें: ${
      user.username ? `@${user.username}` : user.userId
    }`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(activeReferralUrl)}&text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleUsernameInputChange = async (val: string) => {
    const clean = val.toLowerCase().trim().replace(/^@/, '');
    setNewUsernameInput(clean);
    setUsernameError('');
    setUsernameSuccess('');

    if (!clean) {
      setIsUsernameAvailable(null);
      return;
    }
    if (clean.length < 3) {
      setUsernameError('Username कम से कम 3 अक्षरों का होना चाहिए।');
      setIsUsernameAvailable(false);
      return;
    }
    if (!/^[a-z0-9_]+$/.test(clean)) {
      setUsernameError('केवल छोटे अंग्रेजी अक्षर (a-z), अंक (0-9) और अंडरस्कोर (_) मान्य हैं।');
      setIsUsernameAvailable(false);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const res = await checkUsernameAvailableAsync(clean, user.userId);
      setIsUsernameAvailable(res.available);
      if (!res.available) {
        setUsernameError(res.message);
      }
    } catch {
      setUsernameError('यूजरनेम जाँचने में समस्या आई, पुनः प्रयास करें।');
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!newUsernameInput || isUsernameAvailable === false) return;
    const clean = newUsernameInput.toLowerCase().trim().replace(/^@/, '');
    try {
      const updated = updateUserProfile({ ...user, username: clean });
      onUserUpdated(updated);
      setUsernameSuccess('✅ आपका नया @Username सफलतापूर्वक सेव हो गया!');
      setTimeout(() => {
        setIsUsernameModalOpen(false);
        setUsernameSuccess('');
      }, 1200);
    } catch (err: any) {
      setUsernameError(err?.message || 'यूजरनेम सेव करने में त्रुटि आई।');
    }
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setPhotoError('कृपया 3MB से कम आकार की फोटो चुनें।');
      return;
    }
    setPhotoError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomPhotoUrl(reader.result);
      }
    };
    reader.onerror = () => setPhotoError('फोटो पढ़ने में त्रुटि आई, कृपया दूसरी फोटो चुनें।');
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async (photoUrlToSave: string) => {
    if (!photoUrlToSave) return;
    setIsSavingPhoto(true);
    setPhotoError('');
    try {
      const updated = updateUserProfile({ ...user, photoUrl: photoUrlToSave });
      onUserUpdated(updated);
      setAvatarImgSrc(photoUrlToSave);
      setCustomPhotoUrl('');
      setIsPhotoModalOpen(false);
      showTempNotice('success', '✅ प्रोफाइल फोटो सफलतापूर्वक अपडेट हो गई!');
    } catch (err: any) {
      setPhotoError(err?.message || 'फोटो सेव करते समय समस्या आई।');
    } finally {
      setIsSavingPhoto(false);
    }
  };

  // Support Tickets State
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketDesc, setTicketDesc] = useState<string>('');
  const [ticketAttachment, setTicketAttachment] = useState<string>('');
  const [ticketDriveLink, setTicketDriveLink] = useState<string>('');
  const [ticketSuccess, setTicketSuccess] = useState<string>('');
  const [myTickets, setMyTickets] = useState<HelpTicket[]>(() => {
    return getHelpTickets().filter((t) => t.userId === user.userId);
  });

  useEffect(() => {
    if (activeFeaturePopup === 'support') {
      fetchTicketsFromServer()
        .then((all) => setMyTickets(all.filter((t) => t.userId === user.userId)))
        .catch(() => setMyTickets(getHelpTickets().filter((t) => t.userId === user.userId)));
    }
  }, [activeFeaturePopup, user.userId]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;

    createHelpTicket({
      userId: user.userId,
      userName: user.fullName,
      userMobile: user.mobileNumber,
      subject: ticketSubject.trim(),
      description: ticketDesc.trim(),
      attachmentUrl: ticketAttachment || undefined,
      googleDriveAttachmentLink: ticketDriveLink.trim() || undefined,
    });

    setTicketSubject('');
    setTicketDesc('');
    setTicketAttachment('');
    setTicketDriveLink('');
    setTicketSuccess('आपकी शिकायत / प्रश्न आधिकारिक टीम तक पहुँच गया है! हम जल्द ही संपर्क करेंगे।');
    setMyTickets(getHelpTickets().filter((t) => t.userId === user.userId));
    setTimeout(() => setTicketSuccess(''), 5000);
  };

  const activeFrame = getProfileFrameById(activeFrameId);
  const totalSocialBadge = socialUnreadCache.totalUnreadCount + socialUnreadCache.pendingFriendRequestsCount;

  const POPUP_META: Record<FeaturePopupKey, { title: string; subtitle: string }> = {
    referral: {
      title: '📊 कमाई, टीम नेटवर्क व विथड्रॉल (Earnings & Team)',
      subtitle: 'अपनी डायरेक्ट/टोटल टीम, रेफरल QR और वॉलेट विथड्रॉल मैनेज करें',
    },
    iois_chat: {
      title: '💬 IOIS CHAT & HELP (सोशल व ग्रुप चैट)',
      subtitle: 'दोस्तों से चैट करें, ग्रुप बनाएं, फोटो/वीडियो व लिंक शेयर करें',
    },
    idcard: {
      title: '🪪 आधिकारिक डिजिटल ID कार्ड (Digital ID Card)',
      subtitle: '3D फ्रेम के साथ अपना वेरिफाइड डिजिटल ID कार्ड देखें और HD डाउनलोड करें',
    },
    chat: {
      title: '🛡️ एडमिन प्राइवेट चैट (Direct Admin Support)',
      subtitle: 'IOIS आधिकारिक सहायता टीम से सीधी एन्क्रिप्टेड बातचीत करें',
    },
    posters: {
      title: '🎨 प्रमोशनल पोस्टर स्टूडियो (Poster Studio)',
      subtitle: 'अपने फोटो व स्पॉन्सर ID के साथ कस्टम प्रमोशन पोस्टर बनाएं',
    },
    marketing: {
      title: '🚀 मार्केटिंग किट व रेफरल टूल्स (Marketing Kit)',
      subtitle: 'तैयार विज्ञापन संदेश, शेयर लिंक और डायनामिक QR प्राप्त करें',
    },
    profile: {
      title: '✏️ प्रोफाइल, पासवर्ड व प्राइवेसी एडिट (Edit Profile)',
      subtitle: 'व्यक्तिगत विवरण, पेआउट UPI, पासवर्ड व प्राइवेसी सेटिंग्स अपडेट करें',
    },
    support: {
      title: '🎫 सहायता केंद्र व सपोर्ट टिकट (Support & Tickets)',
      subtitle: 'नई समस्या दर्ज करें या पुराने टिकट पर एडमिन का उत्तर देखें',
    },
  };

  const renderPopupModalBody = () => {
    if (!activeFeaturePopup) return null;
    switch (activeFeaturePopup) {
      case 'referral':
        return (
          <StudentReferralHub
            user={user}
            onOpenIdCard={() => setActiveFeaturePopup('idcard')}
          />
        );
      case 'idcard':
        return <IDCardGenerator currentUser={user} isModalMode={true} />;
      case 'iois_chat':
        return (
          <IoisChatHelpHub
            currentUser={user}
            initialThreadId={socialTargetThreadId || undefined}
            initialTargetUserId={socialTargetUserId || undefined}
            onOpenPublicProfile={onOpenPublicProfile}
            embedded={true}
          />
        );
      case 'chat':
        return (
          <PrivateChatMessenger
            userId={user.userId}
            targetUserName={user.fullName}
            currentRole="user"
          />
        );
      case 'posters':
        return <PromotionalPosterStudio user={user} />;
      case 'marketing':
        return <MarketingToolsSection user={user} />;
      case 'profile':
        return (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-200">
                फोटो या 3D फ्रेम तुरंत बदलना चाहते हैं?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>फोटो बदलें</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFrameModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3D फ्रेम्स</span>
                </button>
              </div>
            </div>
            <ProfileEditSection user={user} onUserUpdated={onUserUpdated} />
          </div>
        );
      case 'support':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setActiveFeaturePopup('chat')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-blue-950 border-2 border-sky-400/60 hover:border-sky-300 transition flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-emerald-400 uppercase block">⚡ फास्ट रिस्पांस</span>
                  <div className="text-white font-black text-xs sm:text-sm truncate">प्राइवेट चैट (Admin)</div>
                  <span className="text-[11px] text-sky-300">सीधे चैट खोलें →</span>
                </div>
              </button>

              <a
                href={OFFICIAL_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 hover:border-sky-400 transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-sky-300 uppercase block">टेलीग्राम हेल्पलाइन</span>
                  <div className="text-white font-black text-xs sm:text-sm truncate">New User Helpline</div>
                  <span className="text-[11px] text-sky-400 font-mono">t.me/newuserhelpline</span>
                </div>
              </a>

              <a
                href={`mailto:${OFFICIAL_EMAIL}`}
                className="p-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 hover:border-amber-400 transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-amber-300 uppercase block">ईमेल सपोर्ट</span>
                  <div className="text-white font-black text-xs sm:text-sm">Contact Support</div>
                  <span className="text-[11px] text-amber-300 font-mono truncate block">{OFFICIAL_EMAIL}</span>
                </div>
              </a>
            </div>

            {ticketSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ticketSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-black text-white">सीधा इन-ऐप सपोर्ट टिकट दर्ज करें:</h4>
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  विषय (Subject) <span className="text-red-400">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="उदा. पेमेंट अप्रूवल / विथड्रॉल स्थिति / आईडी कार्ड डाउनलोड"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  समस्या का पूरा विवरण <span className="text-red-400">*</span>:
                </label>
                <textarea
                  required
                  rows={3}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="कृपया अपनी समस्या का संपूर्ण विवरण यहाँ लिखें..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl p-3 outline-none resize-none"
                />
              </div>

              <SmartFileUpload
                label="समस्या का स्क्रीनशॉट (वैकल्पिक)"
                sublabel="25MB तक सीधे अपलोड या Drive Link"
                fileValue={ticketAttachment}
                driveLinkValue={ticketDriveLink}
                onFileChange={setTicketAttachment}
                onDriveLinkChange={setTicketDriveLink}
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition"
              >
                <Send className="w-4 h-4" />
                <span>टिकट सबमिट करें (SUBMIT TICKET)</span>
              </button>
            </form>

            {myTickets.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>आपके पूर्व टिकट व एडमिन जवाब ({myTickets.length}):</span>
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                  {myTickets.map((t) => (
                    <div key={t.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white truncate">{t.subject}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                            t.status === 'resolved'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {t.status === 'resolved' ? 'हल (RESOLVED)' : 'प्रक्रियाधीन'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{t.description}</p>
                      {t.adminReply && (
                        <div className="p-2.5 bg-slate-900 border border-emerald-500/40 rounded-xl text-emerald-300 text-[11px]">
                          <strong className="block text-[10px] text-amber-400 font-bold">आधिकारिक एडमिन उत्तर:</strong>
                          {t.adminReply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="user-dashboard-section" className="scroll-mt-24 space-y-5 animate-fadeIn">
      {/* Admin Celebration & Photo Popup on Dashboard (only shows when configured for dashboard or real-time festival) */}
      <AdminHomePhotoPopup
        currentUser={user}
        location="dashboard"
        onNavigate={(page) => {
          if (page === 'idcard') setActiveFeaturePopup('idcard');
          else if (page === 'plans' || page === 'register') setActiveFeaturePopup('referral');
        }}
        onOpenSponsorAddMember={onOpenSponsorAddMember}
        onOpenIdCard={() => setActiveFeaturePopup('idcard')}
      />

      {/* Inline Status Notice */}
      {dashboardNotice && (
        <div
          className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 ${
            dashboardNotice.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          <span>{dashboardNotice.text}</span>
          <button type="button" onClick={() => setDashboardNotice(null)} className="cursor-pointer opacity-80 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CLEAN PROFILE HERO CARD (CLEAR UNOBSTRUCTED PHOTO + COMPLETE VIEW)     */}
      {/* ========================================================================= */}
      <div className="glass-card-gold p-4 sm:p-6 rounded-3xl border-2 border-amber-500/40 relative overflow-hidden shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          {/* Left: Crystal-Clear Avatar + Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 w-full md:w-auto text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 shrink-0">
              {/* Unobstructed Profile Photo with 3D Live Frame (Click for Full Lightbox) */}
              <div
                className={`relative p-2 rounded-full flex items-center justify-center cursor-pointer transition transform hover:scale-105 ${
                  activeFrame.cssClass || activeFrame.effectClass || 'frame-iois-spinning-orbit-rainbow'
                }`}
                onClick={() => setIsPhotoLightboxOpen(true)}
                title="पूरा फोटो साफ-साफ देखने के लिए क्लिक करें"
              >
                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900 shadow-2xl">
                  <img
                    src={avatarImgSrc}
                    alt={user.fullName}
                    onError={() => {
                      if (avatarImgSrc !== FALLBACK_AVATAR) setAvatarImgSrc(FALLBACK_AVATAR);
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Clean Photo Action Pills Below Avatar (Never Covers the Face) */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsPhotoLightboxOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 text-[10px] font-black flex items-center gap-1 cursor-pointer transition"
                  title="प्रोफाइल फोटो पूरा देखें"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>पूरा देखें</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoError('');
                    setIsPhotoModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black flex items-center gap-1 cursor-pointer transition"
                  title="प्रोफाइल फोटो बदलें"
                >
                  <Camera className="w-3 h-3" />
                  <span>बदलें</span>
                </button>
              </div>
            </div>

            {/* Identity Info */}
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-1.5">
                  <span className="truncate">{user.fullName}</span>
                  <BadgeCheck className="w-5 h-5 text-sky-400 fill-sky-400/20 shrink-0" />
                </h2>

                {user.paymentStatus === 'approved' ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10.5px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>VERIFIED</span>
                  </span>
                ) : user.paymentStatus === 'pending' ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10.5px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>समीक्षाधीन</span>
                  </span>
                ) : (
                  <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10.5px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <XCircle className="w-3 h-3 text-red-400" />
                    <span>पेमेंट रिजेक्ट</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setNewUsernameInput(user.username || '');
                    setUsernameError('');
                    setUsernameSuccess('');
                    setIsUsernameModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 bg-sky-950/80 hover:bg-sky-900 border border-sky-400/40 text-sky-300 px-2.5 py-1 rounded-xl font-mono font-bold cursor-pointer transition"
                  title="यूजरनेम पॉपअप में बदलें"
                >
                  <span>@{user.username || user.userId.toLowerCase()}</span>
                  <Edit3 className="w-3 h-3 text-amber-400" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="font-mono text-amber-300 font-bold bg-slate-950 hover:bg-slate-900 px-2.5 py-1 rounded-xl border border-amber-500/40 flex items-center gap-1 transition cursor-pointer text-[11px]"
                >
                  <span>ID: {user.userId}</span>
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                </button>

                <span className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-xl text-slate-200 font-bold text-[11px] flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>{selectedPlan.name} (₹{selectedPlan.price})</span>
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap text-[11px]">
                <span className="inline-flex items-center gap-1 bg-slate-900/90 border border-cyan-500/30 text-cyan-200 px-2.5 py-1 rounded-lg font-bold">
                  <Eye className="w-3 h-3 text-cyan-400" />
                  <span>{profileViewsLive} विज़िट</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-900/90 border border-rose-500/30 text-rose-200 px-2.5 py-1 rounded-lg font-bold">
                  <Heart className="w-3 h-3 text-rose-400" />
                  <span>{profileLikesCount} लाइक्स</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsFrameModalOpen(true)}
                  className="inline-flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-lg font-bold cursor-pointer transition"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>फ्रेम: {activeFrame.nameHi}</span>
                </button>
              </div>

              {/* Compact Sponsor Short Link */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap pt-0.5">
                <div className="inline-flex items-center gap-1.5 bg-slate-950/90 border border-amber-500/40 rounded-xl px-2.5 py-1 max-w-full">
                  <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-amber-300 font-mono text-[10.5px] font-bold truncate max-w-[190px] sm:max-w-xs">
                    {activeReferralUrl}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyShortLink}
                    className="p-0.5 hover:bg-slate-800 rounded text-amber-400 cursor-pointer shrink-0"
                    title="शॉर्ट लिंक कॉपी करें"
                  >
                    {copiedShortLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3 Clean Top Utility Popup Triggers */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsNotificationModalOpen(true)}
              className="btn-3d-ruby px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 text-white"
            >
              <Bell className="w-4 h-4 text-white animate-pulse" />
              <span>सूचनाएं</span>
              {(userUnreadCount + totalSocialBadge) > 0 && (
                <span className="bg-yellow-400 text-black text-[10px] font-black rounded-full px-1.5 py-0.2">
                  {userUnreadCount + totalSocialBadge}
                </span>
              )}
            </button>

            {onOpenPublicProfile && (
              <button
                type="button"
                onClick={() => onOpenPublicProfile(user)}
                className="btn-3d-platinum px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 text-indigo-950"
              >
                <Eye className="w-4 h-4 text-indigo-950" />
                <span>पब्लिक प्रोफाइल</span>
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* Live Unread Chat Alert Strip */}
        {(socialUnreadCache.unreadSummaries.length > 0 || socialUnreadCache.pendingFriendRequestsCount > 0) && (
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-cyan-950/75 via-slate-900 to-indigo-950/75 border border-cyan-500/40 flex flex-wrap items-center gap-2 relative z-10 text-xs">
            <span className="font-black text-amber-300 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span>नए संदेश अलर्ट:</span>
            </span>
            {socialUnreadCache.unreadSummaries.map((s) => (
              <button
                key={s.threadId}
                type="button"
                onClick={() => {
                  setSocialTargetThreadId(s.threadId);
                  setSocialTargetUserId(s.senderId);
                  setActiveFeaturePopup('iois_chat');
                }}
                className="px-2.5 py-1 rounded-xl bg-rose-600/25 hover:bg-rose-600/40 border border-rose-500/50 text-rose-100 font-bold text-[11px] cursor-pointer transition"
              >
                {s.groupName || s.senderName}: {s.unreadCount} नए — "{s.lastMessage}"
              </button>
            ))}
            {socialUnreadCache.pendingFriendRequestsCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveFeaturePopup('iois_chat')}
                className="px-2.5 py-1 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-100 font-bold text-[11px] cursor-pointer"
              >
                🤝 {socialUnreadCache.pendingFriendRequestsCount} फ्रेंड रिक्वेस्ट
              </button>
            )}
          </div>
        )}

        {/* Rejection Notice */}
        {user.paymentStatus === 'rejected' && (
          <div className="mt-4 p-3.5 bg-red-950/80 border-2 border-red-500/60 rounded-2xl text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-black text-red-300 block">एडमिन द्वारा रिजेक्शन का कारण:</span>
              <p>{user.rejectionReason || 'पेमेंट स्क्रीनशॉट या UTR स्पष्ट नहीं था। कृपया प्रोफाइल एडिट पॉपअप में जाकर सही विवरण अपलोड करें।'}</p>
              <button
                type="button"
                onClick={() => setActiveFeaturePopup('profile')}
                className="text-xs font-black text-amber-300 underline hover:text-white cursor-pointer"
              >
                प्रोफाइल व पेमेंट प्रूफ अपडेट करें →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. CLEAN 4 KPI SUMMARY CARDS                                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/40 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">1. सक्रिय प्लान</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <h4 className="text-base font-black text-white truncate">{selectedPlan.name}</h4>
            <div className="text-xl font-black text-amber-300 font-mono">₹{selectedPlan.price}</div>
          </div>
          <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
            <span className="text-slate-300">इंसेंटिव:</span>
            <span className="font-black text-emerald-400">{selectedPlan.percentage}% (₹{selectedPlan.instantPayout})</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950 border border-emerald-500/40 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">2. सत्यापन स्थिति</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <h4 className="text-base font-black text-white">
              {user.paymentStatus === 'approved' ? 'सत्यापित सदस्य' : user.paymentStatus === 'pending' ? 'समीक्षाधीन' : 'अमान्य पेमेंट'}
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
              {user.paymentStatus === 'approved' ? 'ID कार्ड व पेआउट सक्रिय है' : user.paymentStatus === 'pending' ? 'एडमिन टीम UTR जांच रही है' : 'कृपया सही UTR पुनः भेजें'}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px]">
            <span className="text-slate-300">सुरक्षा:</span>
            <span className="font-bold text-emerald-400">256-Bit SSL</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-sky-500/15 via-slate-900 to-slate-950 border border-sky-500/40 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-400">3. वॉलेट व कमाई</span>
            <Wallet className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-slate-300">उपलब्ध बैलेंस:</span>
            <div className="text-xl font-black text-sky-300 font-mono">₹{availableBalance}</div>
          </div>
          <div className="mt-2 pt-2 border-t border-sky-500/20 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">कुल कमाई: ₹{stats.totalEarningsApproved}</span>
            <button
              type="button"
              onClick={() => setActiveFeaturePopup('referral')}
              className="text-amber-400 font-black hover:underline cursor-pointer"
            >
              पैसे निकालें →
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-500/15 via-slate-900 to-slate-950 border border-purple-500/40 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-400">4. टीम व स्पॉन्सर कोड</span>
            <Share2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-base font-black text-amber-300 font-mono tracking-wider truncate">{user.userId}</div>
            <p className="text-[11px] text-slate-300">
              डायरेक्ट: <strong className="text-white">{stats.directCount}</strong> • कुल टीम: <strong className="text-white">{stats.totalDownlinesCount}</strong>
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-purple-500/20 flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10.5px] flex items-center gap-1 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink ? 'कॉपी हुआ' : 'लिंक कॉपी'}</span>
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10.5px] cursor-pointer"
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={handleShareTelegram}
              className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 cursor-pointer"
              title="Telegram पर शेयर करें"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CLEAN POPUP BUTTON GRID (EVERY OPTION OPENS ITS DEDICATED POPUP)       */}
      {/* ========================================================================= */}
      <div className="glass-card-gold p-4 sm:p-6 rounded-3xl border border-amber-500/35 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>डैशबोर्ड के सभी विकल्प (1-क्लिक पॉप-अप मेनू)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              जिस विकल्प पर क्लिक करेंगे, उसका समर्पित साफ-सुथरा पॉप-अप तुरंत खुल जाएगा — कोई स्क्रीन क्लटर नहीं।
            </p>
          </div>
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
            Clean Popup Mode
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* 1. Earnings, Team & Withdrawal Popup */}
          <button
            type="button"
            onClick={() => setActiveFeaturePopup('referral')}
            className="group p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 hover:from-amber-500/30 border-2 border-amber-500/45 hover:border-amber-400 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                <TrendingUp className="w-4 h-4" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-amber-400 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">कमाई, टीम व विथड्रॉल</div>
              <div className="text-[10.5px] text-amber-300/90 mt-0.5">QR, डाउनलाइन व पैसे निकालें</div>
            </div>
          </button>

          {/* 2. IOIS CHAT & HELP Popup */}
          <button
            type="button"
            onClick={() => setActiveFeaturePopup('iois_chat')}
            className="group relative p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-indigo-950/60 hover:from-cyan-500/30 border-2 border-cyan-500/45 hover:border-cyan-400 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
          >
            {totalSocialBadge > 0 && (
              <span className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce shadow">
                {totalSocialBadge} New
              </span>
            )}
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center shadow">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">IOIS CHAT & HELP</div>
              <div className="text-[10.5px] text-cyan-300/90 mt-0.5">चैट, ग्रुप, फोटो व फ्रेंड्स</div>
            </div>
          </button>

          {/* 3. Digital ID Card Popup */}
          <button
            type="button"
            onClick={() => setActiveFeaturePopup('idcard')}
            className="group p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-950 hover:from-indigo-500/30 border-2 border-indigo-400/45 hover:border-indigo-300 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-indigo-400 text-slate-950 flex items-center justify-center shadow">
                <CreditCard className="w-4 h-4" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-indigo-300 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">डिजिटल ID कार्ड</div>
              <div className="text-[10.5px] text-indigo-200/90 mt-0.5">आगे-पीछे देखें व HD सेव करें</div>
            </div>
          </button>

          {/* 4. 3D Profile Frames Popup */}
          <button
            type="button"
            onClick={() => setIsFrameModalOpen(true)}
            className="group p-3.5 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 via-slate-900 to-slate-950 hover:from-fuchsia-500/30 border-2 border-fuchsia-400/45 hover:border-fuchsia-300 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-fuchsia-400 text-slate-950 flex items-center justify-center shadow">
                <Palette className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-black bg-fuchsia-500/25 text-fuchsia-200 px-2 py-0.5 rounded-full border border-fuchsia-400/40">
                {PROFILE_FRAMES.length}+
              </span>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">3D प्रोफाइल फ्रेम</div>
              <div className="text-[10.5px] text-fuchsia-200/90 mt-0.5">घूमते हुए VIP लाइव फ्रेम्स</div>
            </div>
          </button>

          {/* 5. Full Photo View & Photo Updater Popup */}
          <button
            type="button"
            onClick={() => setIsPhotoLightboxOpen(true)}
            className="group p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-950 hover:from-emerald-500/30 border-2 border-emerald-500/45 hover:border-emerald-400 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center shadow">
                <Maximize2 className="w-4 h-4" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-emerald-300 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">पूरा फोटो देखें</div>
              <div className="text-[10.5px] text-emerald-200/90 mt-0.5">साफ पूरा फोटो व गैलरी अपडेट</div>
            </div>
          </button>

          {/* 6. Edit Profile & Privacy Popup */}
          <button
            type="button"
            onClick={() => setActiveFeaturePopup('profile')}
            className="group p-3.5 rounded-2xl bg-gradient-to-br from-slate-700/40 via-slate-900 to-slate-950 hover:from-slate-700/60 border-2 border-slate-600 hover:border-amber-400 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-slate-200 text-slate-950 flex items-center justify-center shadow">
                <Edit3 className="w-4 h-4" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-300 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">प्रोफाइल व प्राइवेसी एडिट</div>
              <div className="text-[10.5px] text-slate-300 mt-0.5">नाम, UPI, UTR व पासवर्ड बदलें</div>
            </div>
          </button>

          {/* 7. Sponsor Add Member Popup */}
          {onOpenSponsorAddMember && (
            <button
              type="button"
              onClick={() => onOpenSponsorAddMember()}
              className="group p-3.5 rounded-2xl bg-gradient-to-br from-yellow-500/20 via-slate-900 to-orange-950/40 hover:from-yellow-500/30 border-2 border-yellow-400/50 hover:border-yellow-300 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center shadow">
                  <UserPlus className="w-4 h-4" />
                </span>
                <ArrowUpRight className="w-4 h-4 text-yellow-300 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-white">+ नया सदस्य जोड़ें</div>
                <div className="text-[10.5px] text-yellow-200/90 mt-0.5">अपने स्पॉन्सर से जॉइन कराएं</div>
              </div>
            </button>
          )}

          {/* 8. Admin Private Chat Popup */}
          <button
            type="button"
            onClick={() => {
              setActiveFeaturePopup('chat');
              markChatMessagesAsRead(user.userId, 'user');
              setUserUnreadCount(0);
            }}
            className="group relative p-3.5 rounded-2xl bg-gradient-to-br from-sky-500/20 via-slate-900 to-blue-950/50 hover:from-sky-500/30 border-2 border-sky-500/45 hover:border-sky-300 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
          >
            {userUnreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow">
                {userUnreadCount}
              </span>
            )}
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-sky-400 text-slate-950 flex items-center justify-center shadow">
                <MessageCircle className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">एडमिन प्राइवेट चैट</div>
              <div className="text-[10.5px] text-sky-200/90 mt-0.5">सीधी 1-on-1 एडमिन सहायता</div>
            </div>
          </button>

          {/* 9. Poster Studio Popup */}
          <button
            type="button"
            onClick={() => setActiveFeaturePopup('posters')}
            className="group p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/20 via-slate-900 to-slate-950 hover:from-purple-500/30 border-2 border-purple-400/45 hover:border-purple-300 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-purple-400 text-slate-950 flex items-center justify-center shadow">
                <ImageIcon className="w-4 h-4" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-purple-300 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">पोस्टर स्टूडियो</div>
              <div className="text-[10.5px] text-purple-200/90 mt-0.5">आपके नाम-फोटो के HD पोस्टर</div>
            </div>
          </button>

          {/* 10. Marketing Kit Popup */}
          <button
            type="button"
            onClick={() => setActiveFeaturePopup('marketing')}
            className="group p-3.5 rounded-2xl bg-gradient-to-br from-teal-500/20 via-slate-900 to-slate-950 hover:from-teal-500/30 border-2 border-teal-400/45 hover:border-teal-300 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-teal-400 text-slate-950 flex items-center justify-center shadow">
                <Rocket className="w-4 h-4" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-teal-300 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">मार्केटिंग किट व QR</div>
              <div className="text-[10.5px] text-teal-200/90 mt-0.5">रेडीमेड प्रचार टेम्पलेट्स</div>
            </div>
          </button>

          {/* 11. Support Tickets Popup */}
          <button
            type="button"
            onClick={() => setActiveFeaturePopup('support')}
            className="group p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/20 via-slate-900 to-slate-950 hover:from-rose-500/30 border-2 border-rose-400/45 hover:border-rose-300 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl bg-rose-400 text-slate-950 flex items-center justify-center shadow">
                <HelpCircle className="w-4 h-4" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-rose-300 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">सपोर्ट टिकट व हेल्प</div>
              <div className="text-[10.5px] text-rose-200/90 mt-0.5">शिकायत दर्ज व जवाब देखें</div>
            </div>
          </button>

          {/* 12. Public Profile Popup */}
          {onOpenPublicProfile && (
            <button
              type="button"
              onClick={() => onOpenPublicProfile(user)}
              className="group p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/20 via-slate-900 to-slate-950 hover:from-blue-500/30 border-2 border-blue-400/45 hover:border-blue-300 text-left transition cursor-pointer shadow-lg flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-blue-400 text-slate-950 flex items-center justify-center shadow">
                  <Eye className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-black text-blue-200 bg-blue-500/20 px-2 py-0.5 rounded-full">
                  {profileViewsLive} विज़िट
                </span>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-white">पब्लिक प्रोफाइल प्रीव्यू</div>
                <div className="text-[10.5px] text-blue-200/90 mt-0.5">विज़िटर्स व लाइक्स देखें</div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PORTAL 1: DEDICATED FEATURE POPUP DIALOG (CLEAN, NO NESTED GLITCH)        */}
      {/* ========================================================================= */}
      {activeFeaturePopup &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[1100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-1.5 sm:p-4 animate-fadeIn"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="w-full max-w-5xl max-h-[93dvh] bg-slate-950 border-2 border-amber-500/50 rounded-2xl sm:rounded-3xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900 flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-amber-300 truncate">
                    {POPUP_META[activeFeaturePopup].title}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {POPUP_META[activeFeaturePopup].subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveFeaturePopup(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white text-xs font-black flex items-center gap-1.5 border border-slate-700 cursor-pointer shrink-0 transition"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">बंद करें</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 custom-scrollbar">
                {renderPopupModalBody()}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* PORTAL 2: COMPLETE FULL-SIZE PHOTO VIEWER LIGHTBOX                        */}
      {/* ========================================================================= */}
      {isPhotoLightboxOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[1180] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
            onClick={() => setIsPhotoLightboxOpen(false)}
          >
            <div
              className="w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-amber-400/60 shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-white truncate">{user.fullName} — पूरा प्रोफाइल फोटो</h4>
                  <p className="text-[11px] text-amber-300 font-mono">
                    {user.username ? `@${user.username} • ` : ''}
                    {user.userId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPhotoLightboxOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[68dvh]">
                <img
                  src={avatarImgSrc}
                  alt={user.fullName}
                  onError={() => {
                    if (avatarImgSrc !== FALLBACK_AVATAR) setAvatarImgSrc(FALLBACK_AVATAR);
                  }}
                  className="max-w-full max-h-[60dvh] w-auto h-auto object-contain rounded-2xl border-2 border-amber-400/50 shadow-2xl"
                />
              </div>

              <div className="px-4 py-3 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPhotoLightboxOpen(false);
                    setIsPhotoModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>फोटो बदलें</span>
                </button>
                <div className="flex items-center gap-2">
                  <a
                    href={avatarImgSrc}
                    download={`${user.userId}-photo.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs inline-flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>सेव करें</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsPhotoLightboxOpen(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                  >
                    बंद करें
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* PORTAL 3: USERNAME EDITOR POPUP                                           */}
      {/* ========================================================================= */}
      {isUsernameModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[1180] bg-slate-950/88 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
            onClick={() => setIsUsernameModalOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-3xl bg-slate-900 border-2 border-sky-400/50 p-5 space-y-4 shadow-2xl text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sky-300 font-black text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>@Username बनाएं या बदलें</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUsernameModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                यह यूजरनेम आपके पब्लिक प्रोफाइल व स्पॉन्सर लिंक (<span className="font-mono text-amber-300">/?s=username</span>) में दिखाई देगा।
              </p>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400 font-mono font-bold">@</span>
                <input
                  type="text"
                  value={newUsernameInput}
                  onChange={(e) => handleUsernameInputChange(e.target.value)}
                  placeholder="उदा. rohit_kumar, vikas01"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-sky-400 text-white rounded-xl pl-8 pr-10 py-2.5 text-xs font-mono outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isCheckingUsername ? (
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                  ) : isUsernameAvailable === true ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isUsernameAvailable === false ? (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  ) : null}
                </div>
              </div>

              {usernameError && (
                <p className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{usernameError}</span>
                </p>
              )}
              {usernameSuccess && (
                <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{usernameSuccess}</span>
                </p>
              )}
              {isUsernameAvailable === true && !usernameSuccess && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>बधाई हो! यह Username उपलब्ध है।</span>
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsUsernameModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={handleSaveUsername}
                  disabled={!newUsernameInput || isUsernameAvailable === false || isCheckingUsername}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-xs rounded-xl disabled:opacity-50 cursor-pointer transition shadow-md"
                >
                  सेव करें
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* PORTAL 4: PROFILE PHOTO CHANGER POPUP                                     */}
      {/* ========================================================================= */}
      {isPhotoModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[1180] bg-slate-950/88 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
            onClick={() => setIsPhotoModalOpen(false)}
          >
            <div
              className="glass-card-gold p-5 sm:p-6 rounded-3xl border-2 border-amber-500/50 max-w-md w-full space-y-4 shadow-2xl text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>प्रोफाइल फोटो अपडेट करें</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-300 hover:text-white bg-slate-800 hover:bg-red-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-amber-400 shadow-xl bg-slate-950">
                  <img
                    src={customPhotoUrl || avatarImgSrc}
                    alt="Preview"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_AVATAR;
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="text-[11px] text-slate-400">साफ लाइव फोटो प्रीव्यू</span>
              </div>

              {photoError && (
                <div className="p-2.5 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs font-bold">
                  {photoError}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  डिवाइस से नई फोटो अपलोड करें (Gallery / Camera):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-amber-400 file:text-slate-950 hover:file:bg-amber-300 file:cursor-pointer bg-slate-900 border border-slate-700 rounded-xl p-2"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-bold">या तैयार अवतार चुनें:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                  ].map((presetUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomPhotoUrl(presetUrl)}
                      className="w-full aspect-square rounded-xl overflow-hidden border-2 border-slate-700 hover:border-amber-400 transition cursor-pointer"
                    >
                      <img src={presetUrl} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePhoto(customPhotoUrl || avatarImgSrc)}
                  disabled={isSavingPhoto}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black hover:from-amber-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSavingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>फोटो सेव करें</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* PORTAL 5: 3D LIVE PROFILE FRAME PICKER POPUP                              */}
      {/* ========================================================================= */}
      {isFrameModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[1180] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
            role="dialog"
            aria-modal="true"
            onClick={() => setIsFrameModalOpen(false)}
          >
            <div
              className="relative w-full max-w-4xl max-h-[90dvh] bg-slate-950 border-2 border-amber-500/60 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 border-b border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 flex items-center justify-between shrink-0">
                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/40">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>{PROFILE_FRAMES.length}+ 3D LIVE HD PROFILE FRAMES</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-white">
                    अपनी प्रोफाइल के लिए 3D लाइव फ्रेम चुनें
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFrameModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-900 hover:bg-red-600 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 custom-scrollbar">
                {[
                  { id: 'all', label: `सभी फ्रेम्स (${PROFILE_FRAMES.length})` },
                  { id: 'orbit', label: '🌀 3D स्पिनिंग ऑर्बिट' },
                  { id: 'plan', label: '👑 7 मास्टर प्लान' },
                  { id: 'festive', label: '🪔 दीवाली, छठ, धनतेरस' },
                  { id: 'gemstone', label: '💎 जेमस्टोन VIP' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFrameCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                      frameCategoryFilter === cat.id
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                        : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-5 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 custom-scrollbar">
                {PROFILE_FRAMES.filter((f) => {
                  if (frameCategoryFilter === 'all') return true;
                  if (frameCategoryFilter === 'orbit') return f.id.includes('orbit');
                  if (frameCategoryFilter === 'plan') return f.id.includes('plan');
                  if (frameCategoryFilter === 'festive')
                    return ['dhanteras', 'diwali', 'govardhan', 'bhaidooj', 'chhath', 'navratri', 'eid', 'holi', 'republic'].some((k) =>
                      f.id.includes(k)
                    );
                  if (frameCategoryFilter === 'gemstone')
                    return ['sapphire', 'emerald', 'ruby', 'amethyst', 'obsidian', 'cyberpunk', 'prism', 'supernova'].some((k) =>
                      f.id.includes(k)
                    );
                  return true;
                }).map((frame) => {
                  const isSelected = activeFrameId === frame.id;
                  return (
                    <div
                      key={frame.id}
                      onClick={() => handleSelectFrame(frame.id)}
                      className={`relative p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center text-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/40'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5 shadow z-20">
                          <Check className="w-2.5 h-2.5" />
                          <span>सक्रिय</span>
                        </span>
                      )}

                      <div className="pt-2">
                        <div className={`p-2 rounded-full flex items-center justify-center ${frame.cssClass || frame.effectClass}`}>
                          <div className="relative z-10 w-14 h-14 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-950 shadow-inner">
                            <img
                              src={avatarImgSrc}
                              alt={frame.name}
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_AVATAR;
                              }}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="w-full space-y-0.5">
                        <h4 className="text-xs font-black text-white truncate">{frame.name}</h4>
                        <p className="text-[10px] text-amber-300 font-bold truncate">{frame.nameHi}</p>
                        <span className="inline-block text-[9px] bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 mt-1">
                          {frame.tier}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectFrame(frame.id);
                        }}
                        className={`w-full py-1.5 rounded-xl text-[11px] font-black transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-slate-950 hover:bg-amber-500/20 text-slate-200 border border-slate-800'
                        }`}
                      >
                        {isSelected ? 'सक्रिय है' : 'फ्रेम लगाएं'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
                <span className="text-[11px]">चुना गया फ्रेम डैशबोर्ड व डिजिटल ID कार्ड दोनों पर तुरंत लागू होगा।</span>
                <button
                  type="button"
                  onClick={() => setIsFrameModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black cursor-pointer shadow"
                >
                  पूर्ण हुआ (Done)
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* PORTAL 6: 3D NOTIFICATION MODAL                                           */}
      {/* ========================================================================= */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        role="user"
        userId={user.userId}
        userName={user.fullName}
        onOpenChat={() => {
          setActiveFeaturePopup('chat');
          markChatMessagesAsRead(user.userId, 'user');
          setUserUnreadCount(0);
        }}
        onOpenSocialChat={(threadId, senderId) => {
          if (threadId) setSocialTargetThreadId(threadId);
          if (senderId) setSocialTargetUserId(senderId);
          setActiveFeaturePopup('iois_chat');
        }}
      />
    </section>
  );
};
