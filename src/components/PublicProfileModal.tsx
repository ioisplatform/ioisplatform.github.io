import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { UserProfile, FriendRequest, ProfileVisitLog } from '../types';
import { PLANS } from '../data/plansData';
import { getProfileFrameById } from '../data/profileFramesData';
import { findUserById, getShortSponsorUrl } from '../services/userService';
import {
  recordProfileVisitAsync,
  toggleProfileLikeAsync,
  handleFriendActionAsync,
  fetchSocialBootstrapAsync,
} from '../services/socialChatService';
import {
  X,
  Eye,
  Heart,
  UserPlus,
  UserCheck,
  UserMinus,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Share2,
  Check,
  Clock,
  Sparkles,
  Users,
  Maximize2,
  Download,
} from 'lucide-react';

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=85';

interface PublicProfileModalProps {
  isOpen: boolean;
  targetUserOrHandle: UserProfile | string | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onStartChat?: (targetUser: UserProfile) => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  isOpen,
  targetUserOrHandle,
  currentUser,
  onClose,
  onStartChat,
}) => {
  const [targetUser, setTargetUser] = useState<UserProfile | null>(null);
  const [viewsCount, setViewsCount] = useState<number>(0);
  const [recentVisitors, setRecentVisitors] = useState<ProfileVisitLog[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);
  const [isVisitorsPopupOpen, setIsVisitorsPopupOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(FALLBACK_AVATAR);

  useEffect(() => {
    if (!isOpen || !targetUserOrHandle) return;
    let active = true;

    const resolved =
      typeof targetUserOrHandle === 'string'
        ? findUserById(targetUserOrHandle) || null
        : targetUserOrHandle;

    if (resolved) {
      setTargetUser(resolved);
      setImgSrc(resolved.photoUrl?.trim() || FALLBACK_AVATAR);
      setViewsCount(resolved.profileViews || 0);
      setLikes(Array.isArray(resolved.profileLikes) ? resolved.profileLikes : []);
    }

    const loadDetails = async () => {
      const uid =
        typeof targetUserOrHandle === 'string'
          ? resolved?.userId || targetUserOrHandle
          : targetUserOrHandle.userId;
      if (!uid) return;

      try {
        const boot = await fetchSocialBootstrapAsync(currentUser?.userId || uid);
        if (!active) return;
        const freshTarget = boot.directory.find(
          (u) =>
            u.userId?.toUpperCase() === uid.toUpperCase() ||
            (u.username && u.username.toLowerCase() === uid.toLowerCase().replace(/^@/, ''))
        );
        if (freshTarget) {
          setTargetUser(freshTarget);
          setImgSrc(freshTarget.photoUrl?.trim() || FALLBACK_AVATAR);
          setViewsCount(freshTarget.profileViews || 0);
          setLikes(Array.isArray(freshTarget.profileLikes) ? freshTarget.profileLikes : []);
        }
        setFriendRequests(boot.friendRequests || []);
        if (freshTarget && currentUser?.userId?.toUpperCase() === freshTarget.userId?.toUpperCase()) {
          setRecentVisitors(boot.visitLogs || []);
        }

        const targetId = freshTarget?.userId || resolved?.userId || uid;
        const visitRes = await recordProfileVisitAsync(targetId, currentUser);
        if (active && typeof visitRes.profileViews === 'number') {
          setViewsCount(visitRes.profileViews);
        }
        if (active && visitRes.recentVisitors) {
          setRecentVisitors(visitRes.recentVisitors);
        }
      } catch {}
    };

    loadDetails();
    return () => {
      active = false;
    };
  }, [isOpen, targetUserOrHandle, currentUser?.userId]);

  if (!isOpen || !targetUser) return null;

  const isOwnProfile = currentUser?.userId?.toUpperCase() === targetUser.userId.toUpperCase();
  const frame = getProfileFrameById(targetUser.profileFrameId);
  const plan = PLANS.find((p) => p.id === targetUser.selectedPlanId) || PLANS[0];
  const likedByMe = currentUser ? likes.includes(currentUser.userId.toUpperCase()) : false;

  // Friendship status between currentUser and targetUser
  const myId = currentUser?.userId?.toUpperCase() || '';
  const targetId = targetUser.userId.toUpperCase();
  const rel = currentUser
    ? friendRequests.find(
        (r) =>
          (r.fromUserId?.toUpperCase() === myId && r.toUserId?.toUpperCase() === targetId) ||
          (r.fromUserId?.toUpperCase() === targetId && r.toUserId?.toUpperCase() === myId)
      )
    : undefined;

  const isFriend =
    rel?.status === 'accepted' ||
    (targetUser.friends || []).some((f) => f.toUpperCase() === myId);
  const sentPending = rel?.status === 'pending' && rel.fromUserId?.toUpperCase() === myId;
  const receivedPending = rel?.status === 'pending' && rel.toUserId?.toUpperCase() === myId;

  const handleLike = async () => {
    if (!currentUser) return;
    setActionBusy(true);
    const res = await toggleProfileLikeAsync(targetUser.userId, currentUser.userId);
    setLikes(res.profileLikes);
    setActionBusy(false);
  };

  const handleFriend = async (action: 'send' | 'accept' | 'reject' | 'cancel' | 'unfriend') => {
    if (!currentUser) return;
    setActionBusy(true);
    const res = await handleFriendActionAsync(action, currentUser, targetUser.userId);
    if (res.success && res.friendRequests) {
      setFriendRequests(res.friendRequests);
    }
    setActionBusy(false);
  };

  const handleCopyProfileLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ioisplatform.github.io';
    const handle = targetUser.username ? `@${targetUser.username}` : targetUser.userId;
    const link = `${origin}/?u=${encodeURIComponent(handle.replace(/^@/, ''))}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  return (
    <div
      className="fixed inset-0 z-[1060] bg-slate-950/88 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-2xl sm:rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-2xl overflow-hidden my-auto max-h-[93dvh] flex flex-col">
        {/* Cover Banner */}
        <div
          className="relative h-24 sm:h-32 bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-600 shrink-0"
          style={
            targetUser.coverUrl
              ? { backgroundImage: `url(${targetUser.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/85 hover:bg-red-600 text-white flex items-center justify-center border border-white/25 cursor-pointer transition z-20 shadow-md"
            aria-label="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/85 border border-cyan-400/40 text-[10px] font-black text-cyan-200 flex items-center gap-1 z-20 shadow">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>IOIS CHAT & HELP PROFILE</span>
          </div>
          {targetUser.paymentStatus === 'approved' && (
            <div className="absolute bottom-2.5 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[10px] font-black text-emerald-200 flex items-center gap-1 backdrop-blur-sm z-10">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>VERIFIED MEMBER</span>
            </div>
          )}
        </div>

        {/* Clean Profile Body (Zero Clipping) */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-950/75 border border-slate-800/90 shadow-lg relative z-10">
            <div className="flex flex-col xs:flex-row sm:flex-row items-center gap-3.5 sm:gap-4 min-w-0 text-center xs:text-left sm:text-left">
              {/* Crystal-Clear Profile Avatar with Full Unobstructed 3D/4D/8D/16D Frame */}
              <div
                onClick={() => setIsPhotoLightboxOpen(true)}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 p-2 rounded-full cursor-pointer group ${frame.cssClass || frame.effectClass}`}
                title={`${frame.nameHi} (${frame.dimension}) — पूरा फोटो देखने के लिए क्लिक करें`}
              >
                <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900 shadow-xl">
                  <img
                    src={imgSrc}
                    alt={targetUser.fullName}
                    onError={() => {
                      if (imgSrc !== FALLBACK_AVATAR) setImgSrc(FALLBACK_AVATAR);
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {frame.badgeIcon && (
                  <span
                    className="absolute -bottom-0.5 -left-0.5 z-20 w-7 h-7 rounded-full bg-slate-950/95 border-2 border-amber-400 text-xs flex items-center justify-center shadow-lg pointer-events-none"
                    title={frame.badgeLabel || frame.name}
                  >
                    {frame.badgeIcon}
                  </span>
                )}
                <span
                  className={`absolute -top-0.5 -right-0.5 z-20 px-1.5 py-0.5 rounded-full text-[9px] font-black border shadow-lg pointer-events-none ${
                    frame.dimension === '16D'
                      ? 'bg-gradient-to-r from-fuchsia-500 via-amber-400 to-cyan-400 text-slate-950 border-white'
                      : frame.dimension === '8D'
                      ? 'bg-cyan-400 text-slate-950 border-cyan-100'
                      : frame.dimension === '4D'
                      ? 'bg-amber-400 text-slate-950 border-amber-100'
                      : 'bg-slate-800 text-amber-300 border-amber-500/50'
                  }`}
                >
                  {frame.dimension}
                </span>
                <span
                  className="absolute bottom-0 right-0 z-20 w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-slate-950 flex items-center justify-center shadow-lg transition group-hover:scale-110"
                  title="पूरा फोटो देखें"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-center xs:justify-start sm:justify-start gap-1.5">
                  <h2 className="text-base sm:text-xl font-black text-white truncate max-w-full">
                    {targetUser.fullName}
                  </h2>
                  {targetUser.paymentStatus === 'approved' && (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs font-bold text-cyan-300 font-mono truncate">
                  {targetUser.username ? `@${targetUser.username} • ` : ''}
                  {targetUser.userId}
                </p>
                <div className="flex flex-wrap items-center justify-center xs:justify-start sm:justify-start gap-1.5 pt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-400/40 text-[10.5px] font-bold text-indigo-200">
                    {plan.name} • {frame.nameHi}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPhotoLightboxOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-[10.5px] font-black text-amber-300 cursor-pointer transition"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>पूरा फोटो देखें</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyProfileLink}
              className="self-center sm:self-end px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600/80 text-xs font-bold text-slate-100 flex items-center gap-1.5 cursor-pointer shrink-0 transition shadow-sm"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-300" />}
              <span>{copiedLink ? 'लिंक कॉपी हुआ' : 'प्रोफाइल शेयर'}</span>
            </button>
          </div>

          {/* Bio & Location */}
          {(targetUser.bio || targetUser.state || targetUser.district) && (
            <div className="rounded-xl bg-slate-800/70 border border-slate-700/80 p-3 space-y-1.5">
              {targetUser.bio && (
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{targetUser.bio}</p>
              )}
              {(targetUser.district || targetUser.state) && (
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>
                    {[targetUser.district, targetUser.state].filter(Boolean).join(', ')}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Profile Views, Likes & Friends Stats Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-300 font-black text-sm sm:text-base">
                <Eye className="w-4 h-4 shrink-0" />
                <span>{viewsCount}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">प्रोफाइल विज़िट</p>
            </div>
            <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-rose-400 font-black text-sm sm:text-base">
                <Heart className={`w-4 h-4 shrink-0 ${likedByMe ? 'fill-rose-500' : ''}`} />
                <span>{likes.length}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">प्रोफाइल लाइक्स</p>
            </div>
            <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-black text-sm sm:text-base">
                <Users className="w-4 h-4 shrink-0" />
                <span>{targetUser.friends?.length || 0}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">मित्र (Friends)</p>
            </div>
          </div>

          {/* Interactive Actions for Logged-In Visitors */}
          {currentUser && !isOwnProfile && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Like Button */}
              <button
                type="button"
                disabled={actionBusy}
                onClick={handleLike}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                  likedByMe
                    ? 'bg-rose-600/25 border-rose-500 text-rose-200'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedByMe ? 'fill-rose-500 text-rose-400' : ''}`} />
                <span>{likedByMe ? 'Liked ✓' : 'Like करें'}</span>
              </button>

              {/* Friend Request Button */}
              {isFriend ? (
                <button
                  type="button"
                  disabled={actionBusy}
                  onClick={() => handleFriend('unfriend')}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-emerald-600/20 hover:bg-rose-600/25 border border-emerald-500/50 hover:border-rose-500/60 text-emerald-200 hover:text-rose-200 transition cursor-pointer"
                >
                  <UserMinus className="w-4 h-4" />
                  <span>मित्र हैं (हटाएं)</span>
                </button>
              ) : receivedPending ? (
                <button
                  type="button"
                  disabled={actionBusy}
                  onClick={() => handleFriend('accept')}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>रिक्वेस्ट स्वीकारें</span>
                </button>
              ) : sentPending ? (
                <button
                  type="button"
                  disabled={actionBusy}
                  onClick={() => handleFriend('cancel')}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-amber-600/25 border border-amber-500/50 text-amber-200 transition cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>रिक्वेस्ट भेजी गई (रद्द)</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={actionBusy}
                  onClick={() => handleFriend('send')}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Friend</span>
                </button>
              )}

              {/* Direct Chat Trigger */}
              {onStartChat && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartChat(targetUser);
                  }}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>मैसेज भेजें</span>
                </button>
              )}
            </div>
          )}

          {/* Clean Popup Trigger for Own Profile Visitors List */}
          {isOwnProfile && (
            <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="min-w-0">
                <h3 className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  <span>प्रोफाइल विज़िटर्स ({viewsCount} कुल विज़िट)</span>
                </h3>
                <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                  स्पॉन्सर लिंक: <span className="text-cyan-300 select-all">{getShortSponsorUrl(targetUser)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsVisitorsPopupOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition shadow"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>विज़िटर्स पॉपअप खोलें ({recentVisitors.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Complete Full-Size Profile Photo Viewer Lightbox Popup */}
      {isPhotoLightboxOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[1200] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
            onClick={() => setIsPhotoLightboxOpen(false)}
          >
            <div
              className="w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-amber-400/60 shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-white truncate">{targetUser.fullName} — पूरा प्रोफाइल फोटो</h4>
                  <p className="text-[11px] text-amber-300 font-mono">
                    {targetUser.username ? `@${targetUser.username} • ` : ''}
                    {targetUser.userId}
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

              <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[70dvh]">
                <img
                  src={imgSrc}
                  alt={targetUser.fullName}
                  onError={() => {
                    if (imgSrc !== FALLBACK_AVATAR) setImgSrc(FALLBACK_AVATAR);
                  }}
                  className="max-w-full max-h-[62dvh] w-auto h-auto object-contain rounded-2xl border-2 border-amber-400/50 shadow-2xl"
                />
              </div>

              <div className="px-4 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-300 truncate">
                  फ्रेम: <strong className="text-amber-300">{frame.nameHi}</strong>
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={imgSrc}
                    download={`${targetUser.userId}-photo.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs inline-flex items-center gap-1"
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

      {/* Visitors List Popup */}
      {isVisitorsPopupOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[1200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
            onClick={() => setIsVisitorsPopupOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-slate-900 border-2 border-cyan-500/50 shadow-2xl overflow-hidden flex flex-col max-h-[82dvh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                <h4 className="text-sm font-black text-cyan-300 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>आपकी प्रोफाइल किसने देखी ({viewsCount} कुल विज़िट)</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsVisitorsPopupOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto space-y-2 custom-scrollbar">
                {recentVisitors.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    अभी कोई नया विज़िटर दर्ज नहीं है। अपना @username या प्रोफाइल लिंक शेयर करें!
                  </p>
                ) : (
                  recentVisitors.slice(0, 25).map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between gap-2 text-xs bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl"
                    >
                      <span className="font-bold text-slate-100 truncate">
                        {v.visitorName || v.visitorUserId}
                        {v.visitorUsername ? ` (@${v.visitorUsername})` : ''}
                      </span>
                      <span className="text-slate-400 shrink-0 text-[10px]">
                        {new Date(v.visitedAt).toLocaleString('hi-IN', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
