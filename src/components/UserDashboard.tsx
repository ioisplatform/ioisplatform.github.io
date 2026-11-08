import React, { useState, useEffect } from 'react';
import { UserProfile, HelpTicket } from '../types';
import { PLANS, OFFICIAL_TELEGRAM_URL, OFFICIAL_EMAIL } from '../data/plansData';
import { 
  getDownlineStats, 
  getAllUsers,
  createHelpTicket, 
  getHelpTickets, 
  logoutUser,
  updateUserProfile,
  checkUsernameAvailableAsync,
  getShortSponsorUrl
} from '../services/userService';
import { SmartFileUpload } from './SmartFileUpload';
import { ProfileEditSection } from './ProfileEditSection';
import { StudentReferralHub } from './StudentReferralHub';
import { MarketingToolsSection } from './MarketingToolsSection';
import { IDCardGenerator } from './IDCardGenerator';
import { PromotionalPosterStudio } from './PromotionalPosterStudio';
import { PrivateChatMessenger } from './PrivateChatMessenger';
import { NotificationModal } from './NotificationModal';
import { PROFILE_FRAMES, getProfileFrameById, ProfileFrame } from '../data/profileFramesData';
import { getUserUnreadCount, markChatMessagesAsRead } from '../services/notificationService';
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
  ExternalLink,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  Share2,
  Users,
  Image as ImageIcon,
  Crown,
  Copy,
  Check,
  Wallet,
  ArrowRight,
  Camera,
  BadgeCheck,
  MessageCircle,
  X,
  Loader2,
  Globe,
  Bell,
  Award,
  Edit3,
  Palette
} from 'lucide-react';

interface UserDashboardProps {
  user: UserProfile;
  onUserUpdated: (updated: UserProfile) => void;
  onLogout: () => void;
  onScrollToCard: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onUserUpdated,
  onLogout,
  onScrollToCard,
}) => {
  const [activeTab, setActiveTab] = useState<'referral' | 'idcard' | 'chat' | 'posters' | 'marketing' | 'profile' | 'support'>('referral');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedShortLink, setCopiedShortLink] = useState<boolean>(false);

  // 35+ 3D Live Profile Frame State
  const [activeFrameId, setActiveFrameId] = useState<string>(() => {
    return localStorage.getItem(`iois_user_frame_${user.userId}`) || user.profileFrameId || 'iois-spinning-orbit-rainbow';
  });
  const [isFrameModalOpen, setIsFrameModalOpen] = useState<boolean>(false);
  const [frameCategoryFilter, setFrameCategoryFilter] = useState<'all' | 'orbit' | 'plan' | 'festive' | 'gemstone'>('all');

  // 3D Notification System State
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [userUnreadCount, setUserUnreadCount] = useState<number>(() => getUserUnreadCount(user.userId));

  useEffect(() => {
    const updateUnread = () => {
      setUserUnreadCount(getUserUnreadCount(user.userId));
    };
    updateUnread();
    window.addEventListener('iois_notifications_updated', updateUnread);
    window.addEventListener('storage', updateUnread);
    const interval = setInterval(updateUnread, 4000);
    return () => {
      window.removeEventListener('iois_notifications_updated', updateUnread);
      window.removeEventListener('storage', updateUnread);
      clearInterval(interval);
    };
  }, [user.userId]);

  const handleSelectFrame = (frameId: string) => {
    setActiveFrameId(frameId);
    try {
      localStorage.setItem(`iois_user_frame_${user.userId}`, frameId);
      const updated = { ...user, profileFrameId: frameId };
      updateUserProfile(updated);
      onUserUpdated(updated);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('iois_user_frame_updated'));
      }
    } catch {}
  };

  // Live Stats & Balance Calculation
  const [stats, setStats] = useState(() => getDownlineStats(user.userId));
  
  useEffect(() => {
    const all = getAllUsers();
    setStats(getDownlineStats(user.userId, all));
  }, [user.userId]);

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
  
  // Short and standard sponsor link management
  const [sponsorLinkMode, setSponsorLinkMode] = useState<'username' | 'userId'>(user.username ? 'username' : 'userId');
  const usernameLink = user.username ? `${origin}/?s=${encodeURIComponent(user.username)}` : `${origin}/?s=${encodeURIComponent(user.userId)}`;
  const userIdLink = `${origin}/?s=${encodeURIComponent(user.userId)}`;
  const classicReferralUrl = `${origin}/?sponsor=${encodeURIComponent(user.userId)}`;
  const activeReferralUrl = sponsorLinkMode === 'username' && user.username ? usernameLink : userIdLink;

  // Telegram-style Username Manager State
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  const [newUsernameInput, setNewUsernameInput] = useState<string>(user.username || '');
  const [usernameError, setUsernameError] = useState<string>('');
  const [usernameSuccess, setUsernameSuccess] = useState<string>('');
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  // Telegram-style Avatar Manager Modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [isSavingPhoto, setIsSavingPhoto] = useState<boolean>(false);

  const handleCopyLink = async (customUrl?: string) => {
    try {
      const urlToCopy = customUrl || activeReferralUrl;
      await navigator.clipboard.writeText(urlToCopy);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  const handleCopyShortLink = async () => {
    try {
      await navigator.clipboard.writeText(activeReferralUrl);
      setCopiedShortLink(true);
      setTimeout(() => setCopiedShortLink(false), 2500);
    } catch {}
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(user.userId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {}
  };

  const handleShareWhatsApp = () => {
    const sponsorTag = user.username ? `@${user.username} (ID: ${user.userId})` : user.userId;
    const text = `🇮🇳 *भारतीय ऑनलाइन शिक्षा एवं स्वावलंबन मिशन (IOIS)* 📚\n\nनमस्ते! मैंने IOIS डिजिटल एजुकेशन मिशन ज्वाइन किया है। यहाँ मात्र ₹10 से ₹999 में NCERT डिजिटल नोट्स, 700+ पेज किट व डिजिटल ID कार्ड मिलता है।\n\nसाथ ही प्रत्येक रेफरल पर 50% से 70% तक सीधा बैंक/UPI पेआउट प्राप्त होता है।\n\n👉 *मेरी शॉर्ट स्पॉन्सर लिंक से अभी 1-क्लिक में जुड़ें:*\n${activeReferralUrl}\n\n🏷️ *Sponsor:* ${sponsorTag}\n(रजिस्ट्रेशन में स्पॉन्सर कोड ऑटो-वेरिफाई रहेगा)`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = `🇮🇳 भारतीय ऑनलाइन शिक्षा एवं स्वावलंबन मिशन (IOIS) 📚\n\nमेरे आधिकारिक स्पॉन्सर कोड से जुड़ें: ${user.username ? `@${user.username}` : user.userId}\n👉 स्पॉन्सर लिंक: ${activeReferralUrl}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(activeReferralUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Username live check handler
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
    const res = await checkUsernameAvailableAsync(clean, user.userId);
    setIsCheckingUsername(false);
    setIsUsernameAvailable(res.available);
    if (!res.available) {
      setUsernameError(res.message);
    }
  };

  // Save new username
  const handleSaveUsername = async () => {
    if (!newUsernameInput || isUsernameAvailable === false) return;
    const clean = newUsernameInput.toLowerCase().trim().replace(/^@/, '');
    const updated = updateUserProfile({ ...user, username: clean });
    if (updated) {
      onUserUpdated(updated);
      setUsernameSuccess('✅ आपका नया Telegram-स्टाइल Username सफलतापूर्वक सेट हो गया!');
      setTimeout(() => {
        setIsEditingUsername(false);
        setUsernameSuccess('');
      }, 1500);
    }
  };

  // Avatar file upload handler
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('कृपया 3MB से कम आकार की फोटो चुनें।');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCustomPhotoUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save updated photo
  const handleSavePhoto = async (photoUrlToSave: string) => {
    if (!photoUrlToSave) return;
    setIsSavingPhoto(true);
    const updated = updateUserProfile({ ...user, photoUrl: photoUrlToSave });
    if (updated) {
      onUserUpdated(updated);
      setIsPhotoModalOpen(false);
    }
    setIsSavingPhoto(false);
  };

  // Help & Support Tickets
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketDesc, setTicketDesc] = useState<string>('');
  const [ticketAttachment, setTicketAttachment] = useState<string>('');
  const [ticketDriveLink, setTicketDriveLink] = useState<string>('');
  const [ticketSuccess, setTicketSuccess] = useState<string>('');
  const [myTickets, setMyTickets] = useState<HelpTicket[]>(() => {
    return getHelpTickets().filter((t) => t.userId === user.userId);
  });

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

  return (
    <section id="user-dashboard-section" className="scroll-mt-24 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. TELEGRAM-STYLE EXECUTIVE USER BANNER & PROFILE CARD                    */}
      {/* ========================================================================= */}
      <div className="glass-card-gold p-5 sm:p-7 rounded-3xl border-2 border-amber-500/40 relative overflow-hidden shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* User Info Column (Telegram App Look) */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            
            {/* Telegram Profile Avatar with 3D Live Animated Frame & Trigger Overlays */}
            <div className="relative shrink-0 group">
              {/* Active 3D Live Frame Container */}
              <div 
                className={`relative p-2.5 rounded-full flex items-center justify-center cursor-pointer transition transform hover:scale-105 ${
                  getProfileFrameById(activeFrameId)?.cssClass || 'frame-iois-spinning-orbit-rainbow'
                }`}
                onClick={() => setIsFrameModalOpen(true)}
                title="3D फ्रेम बदलने के लिए क्लिक करें"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-950 shadow-2xl relative z-10">
                  <img 
                    src={user.photoUrl} 
                    alt={user.fullName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                </div>
              </div>

              {/* Online Pulse Status */}
              <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-md z-20" title="🟢 ऑनलाइन सदस्य">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>

              {/* Change Avatar Button Overlay */}
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute -bottom-1 -left-1 p-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-slate-950 shadow-lg cursor-pointer transition transform active:scale-90 z-20"
                title="फोटो बदलें (Change Profile Photo)"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Change 3D Frame Button Overlay */}
              <button
                type="button"
                onClick={() => setIsFrameModalOpen(true)}
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-sky-400 hover:bg-sky-300 text-slate-950 border-2 border-slate-950 shadow-lg cursor-pointer transition transform active:scale-90 z-20 animate-pulse"
                title="35+ 3D लाइव फ्रेम चुनें (Change 3D Frame)"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
              </button>
            </div>

            {/* Profile Identity Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-1.5">
                  <span>{user.fullName}</span>
                  <BadgeCheck className="w-6 h-6 text-sky-400 fill-sky-400/20 shrink-0" title="सत्यापित प्रोफाइल (Verified Profile)" />
                </h2>

                {user.paymentStatus === 'approved' ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>VERIFIED</span>
                  </span>
                ) : user.paymentStatus === 'pending' ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>समीक्षाधीन</span>
                  </span>
                ) : (
                  <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] font-black px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>पेमेंट रिजेक्ट</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setIsFrameModalOpen(true)}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>3D Frame: {getProfileFrameById(activeFrameId)?.name || 'Rainbow Orbit'}</span>
                </button>
              </div>

              {/* Telegram Username & User ID Bar */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                
                {/* Username Pill with Edit Trigger */}
                <div className="inline-flex items-center gap-1.5 bg-sky-950/80 border border-sky-400/40 text-sky-300 px-3 py-1 rounded-xl shadow-inner font-mono font-bold">
                  <span>@{user.username || user.userId.toLowerCase()}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewUsernameInput(user.username || '');
                      setIsEditingUsername(true);
                    }}
                    className="ml-1 text-[10px] text-amber-400 hover:text-amber-200 underline cursor-pointer"
                    title="यूजरनेम बदलें"
                  >
                    बदलें
                  </button>
                </div>

                {/* User ID copy button */}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="font-mono text-amber-300 font-bold bg-slate-950 hover:bg-slate-900 px-2.5 py-1 rounded-xl border border-amber-500/40 flex items-center gap-1 transition cursor-pointer shadow-inner text-[11px]"
                  title="क्लिक करके ID कॉपी करें"
                >
                  <span>ID: {user.userId}</span>
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                </button>

                <span className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-xl text-slate-200 font-bold text-[11px] flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>{selectedPlan.name} (₹{selectedPlan.price})</span>
                </span>
              </div>

              {/* Short Sponsor Link Quick Box */}
              <div className="pt-1 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium">आपकी शॉर्ट स्पॉन्सर लिंक:</span>
                <div className="inline-flex items-center gap-1.5 bg-slate-950/90 border border-amber-500/40 rounded-xl px-2.5 py-1">
                  <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-amber-300 font-mono text-[11px] font-bold max-w-[210px] sm:max-w-none truncate">
                    {activeReferralUrl}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyShortLink}
                    className="p-1 hover:bg-slate-800 rounded text-amber-400 cursor-pointer"
                    title="शॉर्ट लिंक कॉपी करें"
                  >
                    {copiedShortLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Header Right Actions (3D Notification Bell + Frame + Edit Profile + Chat + ID Card) */}
          <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-2 w-full lg:w-auto flex-wrap">
            {/* 3D Notification Bell */}
            <button
              type="button"
              onClick={() => setIsNotificationModalOpen(true)}
              className="btn-3d-ruby px-3.5 py-2.5 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg active:scale-95 relative text-white"
              title="एडमिन द्वारा भेजे गए नए मैसेज व सूचनाएं"
            >
              <Bell className="w-4 h-4 text-white animate-pulse" />
              <span>सूचनाएं</span>
              {userUnreadCount > 0 && (
                <span className="bg-yellow-400 text-black text-[10px] font-black rounded-full px-1.5 py-0.2 shadow animate-bounce">
                  {userUnreadCount}
                </span>
              )}
            </button>

            {/* 3D Frame Picker Button */}
            <button
              type="button"
              onClick={() => setIsFrameModalOpen(true)}
              className="btn-3d-rainbow-special px-3.5 py-2.5 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg active:scale-95 text-black"
              title="35+ 3D लाइव एनिमेटेड प्रोफाइल फ्रेम चुनें"
            >
              <Sparkles className="w-4 h-4 text-black animate-spin" style={{ animationDuration: '4s' }} />
              <span>3D Frames ({PROFILE_FRAMES.length})</span>
            </button>

            {/* Edit Profile Button */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="btn-3d-silver px-3.5 py-2.5 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-95 text-slate-950"
              title="प्रोफाइल विवरण व पेमेंट UTR एडिट करें"
            >
              <Edit3 className="w-4 h-4 text-slate-950" />
              <span>Edit Profile</span>
            </button>

            {/* Private Chat Button */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('chat');
                markChatMessagesAsRead(user.userId, 'user');
                setUserUnreadCount(0);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs uppercase flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-sky-500/20 active:scale-95 relative"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Private Chat</span>
              {userUnreadCount > 0 && (
                <span className="bg-red-500 text-white text-[9.5px] font-black rounded-full px-1.5 py-0.2 shadow">
                  {userUnreadCount}
                </span>
              )}
            </button>

            {/* Digital ID Card Button */}
            <button
              type="button"
              onClick={() => setActiveTab('idcard')}
              className="btn-3d-platinum px-4 py-2.5 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-95"
            >
              <CreditCard className="w-4 h-4 text-indigo-950" />
              <span className="text-indigo-950 font-black">Digital ID</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
              title="डैशबोर्ड से सुरक्षित बाहर आएं"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* Telegram-style Inline Username Editor Modal / Drawer */}
        {isEditingUsername && (
          <div className="mt-5 p-4 sm:p-5 bg-slate-950/95 border-2 border-sky-400/50 rounded-2xl animate-fadeIn space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>अपना कस्टम Telegram-स्टाइल @Username बनाएं या बदलें</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditingUsername(false);
                  setUsernameError('');
                  setUsernameSuccess('');
                }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300">
              यह यूजरनेम आपके शॉर्ट स्पॉन्सर लिंक में दिखाई देगा (उदा. <span className="font-mono text-amber-300">/?s=username</span>)। 
              सिस्टम में कोई भी दो सदस्य एक जैसा यूजरनेम नहीं रख सकते।
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400 font-mono font-bold">@</span>
                <input
                  type="text"
                  value={newUsernameInput}
                  onChange={(e) => handleUsernameInputChange(e.target.value)}
                  placeholder="उदा. rohit_kumar, vikas01, rahul_sharma"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 text-white rounded-xl pl-8 pr-10 py-2.5 text-xs font-mono outline-none"
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

              <button
                type="button"
                onClick={handleSaveUsername}
                disabled={!newUsernameInput || isUsernameAvailable === false || isCheckingUsername}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-xs rounded-xl disabled:opacity-50 cursor-pointer transition shadow-md"
              >
                यूजरनेम सेव करें
              </button>
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
          </div>
        )}

        {/* Telegram Profile Photo Changer Modal */}
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-card-gold p-6 rounded-3xl border-2 border-amber-500/50 max-w-md w-full space-y-4 shadow-2xl animate-scaleUp">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>प्रोफाइल फोटो अपडेट करें (Telegram Style)</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current / Selected Preview */}
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-amber-400 shadow-xl bg-slate-950">
                  <img
                    src={customPhotoUrl || user.photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[11px] text-slate-400">फोटो प्रीव्यू</span>
              </div>

              {/* Option A: Upload from Gallery/Camera */}
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

              {/* Option B: Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-bold">या तैयार स्टूडेंट अवतार चुनें:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
                  ].map((presetUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomPhotoUrl(presetUrl)}
                      className="w-full aspect-square rounded-xl overflow-hidden border-2 border-slate-700 hover:border-amber-400 transition cursor-pointer"
                    >
                      <img src={presetUrl} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePhoto(customPhotoUrl || user.photoUrl)}
                  disabled={isSavingPhoto}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black hover:from-amber-300 shadow-md flex items-center justify-center gap-1.5"
                >
                  {isSavingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>फोटो सेव करें</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Notice if rejected */}
        {user.paymentStatus === 'rejected' && (
          <div className="mt-5 p-4 bg-red-950/80 border-2 border-red-500/60 rounded-2xl text-red-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-black text-red-300">एडमिन द्वारा रिजेक्शन का कारण:</span>
              <p>{user.rejectionReason || 'पेमेंट स्क्रीनशॉट या UTR स्पष्ट नहीं था। कृपया प्रोफाइल एडिट टैब में जाकर सही स्क्रीनशॉट व 12-अंकों का UTR नंबर अपलोड करें।'}</p>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="mt-2 text-xs font-black text-amber-300 underline hover:text-white cursor-pointer"
              >
                यहाँ क्लिक करके प्रोफाइल व पेमेंट प्रूफ अपडेट करें →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. 4 HIGH-IMPACT, INTUITIVE KPI CARDS (आसानी से समझने वाला लेआउट)          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Plan & Payout */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border-2 border-amber-500/40 p-5 shadow-xl hover:border-amber-400 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">1. सक्रिय प्लान</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <h4 className="text-lg font-black text-white">{selectedPlan.name}</h4>
            <div className="text-2xl font-black text-amber-300 font-mono">₹{selectedPlan.price}</div>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-300">रेफरल इंसेंटिव:</span>
            <span className="font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              {selectedPlan.percentage}% (₹{selectedPlan.instantPayout}/सफल)
            </span>
          </div>
        </div>

        {/* KPI 2: Verification Status */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950 border-2 border-emerald-500/40 p-5 shadow-xl hover:border-emerald-400 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">2. सत्यापन स्थिति</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <h4 className="text-lg font-black text-white">
              {user.paymentStatus === 'approved' ? 'सत्यापित सदस्य' : user.paymentStatus === 'pending' ? 'समीक्षाधीन' : 'अमान्य पेमेंट'}
            </h4>
            <p className="text-xs text-slate-300 leading-snug">
              {user.paymentStatus === 'approved' ? 'आईडी कार्ड व इंस्टेंट पेआउट पूर्णतः सक्रिय है' : user.paymentStatus === 'pending' ? 'एडमिन टीम UTR बैंक से मिला रही है' : 'कृपया सही UTR व स्क्रीनशॉट पुनः भेजें'}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-300">सुरक्षा मानक:</span>
            <span className="font-bold text-emerald-400">100% 256-Bit SSL</span>
          </div>
        </div>

        {/* KPI 3: Available Balance & Withdrawal */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/15 via-slate-900 to-slate-950 border-2 border-sky-500/40 p-5 shadow-xl hover:border-sky-400 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-400">3. वॉलेट व कमाई</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <span className="text-xs text-slate-300">उपलब्ध विथड्रॉल बैलेंस:</span>
            <div className="text-2xl font-black text-sky-300 font-mono">₹{availableBalance}</div>
          </div>
          <div className="mt-3 pt-3 border-t border-sky-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-400">कुल कमाई: ₹{stats.totalEarningsApproved}</span>
            <button
              type="button"
              onClick={() => setActiveTab('referral')}
              className="text-amber-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>पैसे निकालें →</span>
            </button>
          </div>
        </div>

        {/* KPI 4: Sponsor Referral Code & Link */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/15 via-slate-900 to-slate-950 border-2 border-purple-500/40 p-5 shadow-xl hover:border-purple-400 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-400">4. आपकी टीम व कोड</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="text-lg font-black text-amber-300 font-mono tracking-wider">{user.userId}</div>
            <p className="text-xs text-slate-300">डायरेक्ट: <strong className="text-white">{stats.directCount}</strong> | कुल टीम: <strong className="text-white">{stats.totalDownlinesCount}</strong></p>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-500/20 flex items-center justify-between gap-1.5 text-xs flex-wrap">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center gap-1 transition cursor-pointer shadow-sm active:scale-95"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'कॉपी हुआ!' : 'लिंक कॉपी'}</span>
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] flex items-center gap-1 transition cursor-pointer shadow-sm active:scale-95"
              title="WhatsApp पर स्पॉन्सर लिंक शेयर करें"
            >
              <Share2 className="w-3 h-3" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleShareTelegram}
              className="p-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 transition cursor-pointer"
              title="Telegram पर शेयर करें"
            >
              <Send className="w-3 h-3 text-sky-400" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK SHORTCUTS (सबसे उपयोगी बटन्स - FAST ACCESS)                         */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 bg-slate-900/90 border-2 border-amber-500/30 rounded-3xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold text-white">क्विक शॉर्टकट टूल्स:</span>
          <span className="text-slate-400 hidden md:inline">यहाँ से 1-क्लिक में अपने मुख्य कार्य करें</span>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'स्पॉन्सर लिंक कॉपी'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp शेयर</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('referral')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-sky-500/50 text-sky-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5 text-sky-400" />
            <span>विथड्रॉल / पैसे निकालें</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('idcard')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>ID कार्ड डाउनलोड</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('posters')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-purple-500/50 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>पोस्टर स्टूडियो</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DASHBOARD MODERN NAVIGATION TABS (ENGLISH LABELS & 1-CLICK ACCESS)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-1.5 bg-slate-950/95 rounded-2xl border-2 border-slate-800 shadow-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('referral')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'referral'
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 shrink-0" />
          <span>Dashboard & Earnings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('idcard')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'idcard'
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 shrink-0" />
          <span>Digital ID Card</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('chat');
            markChatMessagesAsRead(user.userId, 'user');
            setUserUnreadCount(0);
          }}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer relative ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-white font-black shadow-lg shadow-sky-500/25 scale-[1.02]'
              : 'text-sky-300 hover:text-white hover:bg-slate-900 border border-sky-500/30'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Private Chat</span>
          {userUnreadCount > 0 ? (
            <span className="bg-red-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.2 shadow animate-pulse">
              {userUnreadCount}
            </span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-1.5 right-1.5"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('posters')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'posters'
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 shrink-0" />
          <span>Poster Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('marketing')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'marketing'
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Marketing Kit</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          <span>Edit Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('support')}
          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1 ${
            activeTab === 'support'
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-400/25 scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Support Tickets</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: REFERRAL QR, PROMO COPY & DOWNLINE CHECKUP & WITHDRAWAL           */}
      {/* ========================================================================= */}
      {activeTab === 'referral' && (
        <div className="animate-fadeIn">
          <StudentReferralHub
            user={user}
            onOpenIdCard={() => setActiveTab('idcard')}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DIGITAL ID CARD STUDIO                                            */}
      {/* ========================================================================= */}
      {activeTab === 'idcard' && (
        <div className="space-y-4 animate-fadeIn">
          <IDCardGenerator
            currentUser={user}
            isModalMode={false}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRIVATE CHAT MESSENGER (DIRECT 1-ON-1 WITH ADMIN - TELEGRAM STYLE) */}
      {/* ========================================================================= */}
      {activeTab === 'chat' && (
        <div className="animate-fadeIn">
          <PrivateChatMessenger
            userId={user.userId}
            targetUserName={user.fullName}
            currentRole="user"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PROMOTIONAL POSTER STUDIO                                         */}
      {/* ========================================================================= */}
      {activeTab === 'posters' && (
        <div className="animate-fadeIn">
          <PromotionalPosterStudio user={user} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MARKETING TOOLS SUITE (TEMPLATES, BULK INVITE, DYNAMIC QR)        */}
      {/* ========================================================================= */}
      {activeTab === 'marketing' && (
        <div className="animate-fadeIn">
          <MarketingToolsSection user={user} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: 3D LIVE PROFILE FRAME STUDIO & MEMBER PROFILE SECTION              */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. 3D Live Profile Frame Interactive Studio Banner */}
          <div className="glass-card-gold p-5 sm:p-7 rounded-3xl border-2 border-amber-500/50 shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Studio Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/30 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                  <Sparkles className="w-6 h-6 animate-spin text-slate-950" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-1">
                    <span>40+ 3D LIVE HD PROFILE FRAMES</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span>👑 3D लाइव प्रोफाइल फ्रेम व अवतार स्टूडियो</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    यहाँ से अपनी प्रोफाइल फोटो और डिजिटल ID कार्ड के लिए लाइव 3D घूमते हुए आकर्षक फ्रेम चुनें।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>फ़ोटो बदलें</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('idcard')}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow transition active:scale-95"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>ID कार्ड पर देखें</span>
                </button>
              </div>
            </div>

            {/* Live Active Frame Showcase Center */}
            {(() => {
              const currentActiveFrame = getProfileFrameById(activeFrameId);
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 relative z-10">
                  {/* Left: Giant Live Preview */}
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="relative p-3 flex items-center justify-center">
                      <div className={`relative p-3 rounded-full flex items-center justify-center transition-all duration-300 ${currentActiveFrame?.cssClass || 'frame-iois-spinning-orbit-rainbow'}`}>
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900 shadow-2xl relative z-10">
                          <img
                            src={user.photoUrl}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-4 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-950 shadow-md z-20">
                        <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      सक्रिय 3D लाइव फ्रेम (Active)
                    </span>
                  </div>

                  {/* Middle: Active Frame Info */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                        {currentActiveFrame?.badgeIcon} {currentActiveFrame?.badgeLabel}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono">
                        टियर: <b className="text-amber-300 uppercase">{currentActiveFrame?.tier}</b>
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-white">
                      {currentActiveFrame?.nameHi} <span className="text-xs text-slate-400 font-normal">({currentActiveFrame?.name})</span>
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentActiveFrame?.description}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-300 font-medium">
                      <span>⚡ यह 3D फ्रेम आपके डैशबोर्ड अवतार और <b>डिजिटल ID कार्ड</b> दोनों पर लाइव लागू रहेगा।</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Frame Category Filter Pills */}
            <div className="space-y-3 relative z-10 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>3D लाइव फ्रेम चुनें (Choose from 40+ HD Frames):</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  कुल उपलब्ध: 40 फ्रेम
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {[
                  { id: 'all', label: 'सभी फ्रेम्स (40+)' },
                  { id: 'orbit', label: '🌀 3D चक्र व ऑर्बिट' },
                  { id: 'plan', label: '👑 VIP व 7-प्लान फ्रेम' },
                  { id: 'festive', label: '✨ फेस्टिव (दीवाली, छठ, धनतेरस)' },
                  { id: 'gemstone', label: '💎 जेमस्टोन (नीलम, पन्ना, रूबी)' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFrameCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      frameCategoryFilter === cat.id
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Frames Grid (40+ Live HD Frames) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {PROFILE_FRAMES.filter((f) => {
                  if (frameCategoryFilter === 'all') return true;
                  if (frameCategoryFilter === 'orbit') return f.id.includes('orbit');
                  if (frameCategoryFilter === 'plan') return f.id.includes('plan');
                  if (frameCategoryFilter === 'festive') return ['dhanteras', 'diwali', 'govardhan', 'bhaidooj', 'chhath', 'navratri', 'eid', 'holi', 'republic'].some(k => f.id.includes(k));
                  if (frameCategoryFilter === 'gemstone') return ['sapphire', 'emerald', 'ruby', 'amethyst', 'obsidian', 'cyberpunk', 'prism', 'supernova'].some(k => f.id.includes(k));
                  return true;
                }).map((frame) => {
                  const isSelected = activeFrameId === frame.id;
                  return (
                    <div
                      key={frame.id}
                      onClick={() => handleSelectFrame(frame.id)}
                      className={`p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center text-center space-y-2 relative group hover:scale-[1.03] ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Live Frame Preview with user photo */}
                      <div className="relative p-2 flex items-center justify-center">
                        <div className={`p-2 rounded-full flex items-center justify-center ${frame.cssClass}`}>
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900 shadow-md">
                            <img
                              src={user.photoUrl}
                              alt={frame.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Frame Details */}
                      <div className="space-y-0.5 w-full">
                        <h5 className="text-[11px] font-black text-white truncate">{frame.nameHi}</h5>
                        <p className="text-[9.5px] text-slate-400 truncate">{frame.name}</p>
                      </div>

                      {/* Tier Badge & Select Button */}
                      <div className="w-full pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFrame(frame.id);
                          }}
                          className={`w-full py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 shadow'
                              : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {isSelected ? '✓ सक्रिय (Active)' : 'लागू करें (Apply)'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Comprehensive Profile Details & Edit Section */}
          <div className="glass-card-gold p-6 sm:p-7 rounded-3xl border border-amber-500/30">
            <ProfileEditSection
              user={user}
              onUserUpdated={onUserUpdated}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: OFFICIAL HELPLINE & IN-APP TICKETS                                */}
      {/* ========================================================================= */}
      {activeTab === 'support' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 max-w-4xl mx-auto animate-fadeIn">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">OFFICIAL SUPPORT DESK</span>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-400" />
                <span>हेल्पलाइन व समस्या निवारण सहायता केंद्र</span>
              </h3>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              24x7 Verified Team
            </span>
          </div>

          {/* Quick Helpline Channel Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1-on-1 Private Chat with Admin */}
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className="p-4 rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-blue-950 border-2 border-sky-400/60 hover:border-sky-300 transition flex items-center gap-3.5 group shadow-lg text-left cursor-pointer active:scale-98"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase">⚡ फास्ट रिस्पांस</span>
                <div className="text-white font-black text-sm">प्राइवेट चैट (Admin)</div>
                <span className="text-xs text-sky-300">फोटो, वीडियो व लिंक भेजें →</span>
              </div>
            </button>

            {/* Telegram Helpline */}
            <a
              href={OFFICIAL_TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border-2 border-slate-700 hover:border-sky-400 transition flex items-center gap-3.5 group shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-sky-300 uppercase">टेलीग्राम हेल्पलाइन</span>
                <div className="text-white font-black text-sm">🎧 New User Helpline</div>
                <span className="text-xs text-sky-400 font-mono">t.me/newuserhelpline</span>
              </div>
            </a>

            {/* Email Helpline */}
            <a
              href={`mailto:${OFFICIAL_EMAIL}`}
              className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border-2 border-slate-700 hover:border-amber-400 transition flex items-center gap-3.5 group shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-300 uppercase">ईमेल सपोर्ट</span>
                <div className="text-white font-black text-sm">Contact Support</div>
                <span className="text-xs text-amber-300 font-mono truncate block max-w-[170px]">{OFFICIAL_EMAIL}</span>
              </div>
            </a>
          </div>

          {/* Ticket Form */}
          <div className="pt-2">
            <h4 className="text-sm font-black text-white mb-2">सीधा इन-ऐप सपोर्ट टिकट दर्ज करें:</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              यदि आपको पेआउट, आईडी कार्ड, यूटीआर सत्यापन या किसी अन्य फीचर में सहायता चाहिए, तो नीचे विवरण लिखें। एडमिन टीम 24 घंटे के भीतर टिकट का जवाब देगी।
            </p>

            {ticketSuccess && (
              <div className="mb-4 p-3.5 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ticketSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">विषय (Subject / Problem) <span className="text-red-400">*</span>:</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="उदा. पेमेंट अप्रूवल / विथड्रॉल स्थिति / आईडी कार्ड डाउनलोड"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2.5 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">समस्या का पूरा विवरण <span className="text-red-400">*</span>:</label>
                <textarea
                  required
                  rows={3}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="कृपया अपनी समस्या का संपूर्ण विवरण यहाँ लिखें..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl p-3 outline-none transition resize-none"
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                <Send className="w-4 h-4" />
                <span>टिकट सबमिट करें (SUBMIT TICKET)</span>
              </button>
            </form>
          </div>

          {/* User's Previous Tickets */}
          {myTickets.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>आपके पूर्व टिकट व एडमिन जवाब (Ticket History):</span>
              </h4>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {myTickets.map((t) => (
                  <div key={t.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{t.subject}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        t.status === 'resolved' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {t.status === 'resolved' ? 'हल किया गया (RESOLVED)' : 'प्रक्रियाधीन (OPEN)'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{t.description}</p>
                    {t.adminReply && (
                      <div className="p-3 bg-slate-900 border border-emerald-500/40 rounded-xl text-emerald-300 text-[11px]">
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
      )}

      {/* ========================================================================= */}
      {/* 3D NOTIFICATION SYSTEM MODAL (INSTANT USER NOTIFICATIONS & DIRECT REPLY)   */}
      {/* ========================================================================= */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        role="user"
        userId={user.userId}
        userName={user.fullName}
        onOpenChat={() => {
          setActiveTab('chat');
          markChatMessagesAsRead(user.userId, 'user');
          setUserUnreadCount(0);
        }}
      />

      {/* ========================================================================= */}
      {/* 35+ 3D LIVE HIGH-QUALITY PROFILE FRAME PICKER MODAL (40 FRAMES)            */}
      {/* ========================================================================= */}
      {isFrameModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border-2 border-amber-500/60 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/40">
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span>35+ 3D LIVE HD PROFILE FRAMES</span>
                </div>
                <h3 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                  <span>अपनी प्रोफाइल के लिए 3D लाइव फ्रेम चुनें</span>
                  <span className="text-xs bg-slate-900 text-amber-400 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
                    {PROFILE_FRAMES.length} फ्रेम्स
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  घूमता हुआ चक्र, 7 मास्टर प्लान, धनतेरस, दिवाली, छठ पूजा व लग्जरी जेमस्टोन इफेक्ट्स।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFrameModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition"
                title="बंद करें"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {[
                { id: 'all', label: `सभी फ्रेम्स (${PROFILE_FRAMES.length})` },
                { id: 'orbit', label: '🌀 3D लाइव स्पिनिंग ऑर्बिट' },
                { id: 'plan', label: '👑 7 मास्टर प्लान फ्रेम्स' },
                { id: 'festive', label: '🪔 धनतेरस, दिवाली, छठ' },
                { id: 'gemstone', label: '💎 लग्जरी जेमस्टोन VIP' },
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

            {/* Frames Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {PROFILE_FRAMES.filter((f) => {
                if (frameCategoryFilter === 'all') return true;
                if (frameCategoryFilter === 'orbit') return f.id.includes('orbit');
                if (frameCategoryFilter === 'plan') return f.id.includes('plan');
                if (frameCategoryFilter === 'festive') return ['dhanteras', 'diwali', 'govardhan', 'bhaidooj', 'chhath', 'navratri', 'eid', 'holi', 'republic'].some(k => f.id.includes(k));
                if (frameCategoryFilter === 'gemstone') return ['sapphire', 'emerald', 'ruby', 'amethyst', 'obsidian', 'cyberpunk', 'prism', 'supernova'].some(k => f.id.includes(k));
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
                    {/* Active Selected Badge */}
                    {isSelected && (
                      <span className="absolute top-2 right-2 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5 shadow">
                        <Check className="w-2.5 h-2.5" />
                        <span>सक्रिय</span>
                      </span>
                    )}

                    {/* Frame Live Preview Circle */}
                    <div className="pt-2">
                      <div className={`p-2 rounded-full flex items-center justify-center ${frame.cssClass}`}>
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-950 shadow-inner">
                          <img 
                            src={user.photoUrl} 
                            alt={frame.name}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Frame Details */}
                    <div className="w-full space-y-0.5">
                      <h4 className="text-xs font-black text-white truncate">{frame.name}</h4>
                      <p className="text-[10px] text-amber-300 font-bold truncate">{frame.nameHi}</p>
                      <span className="inline-block text-[9px] bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 mt-1">
                        {frame.tier}
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectFrame(frame.id);
                      }}
                      className={`w-full py-1.5 rounded-xl text-[11px] font-black transition ${
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

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span className="text-[11px]">
                चुना गया फ्रेम आपके यूजर डैशबोर्ड व डिजिटल प्रोफाइल पर तुरंत सक्रिय हो जाएगा।
              </span>
              <button
                type="button"
                onClick={() => setIsFrameModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black cursor-pointer shadow"
              >
                पूर्ण हुआ (Done)
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
