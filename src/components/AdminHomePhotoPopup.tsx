import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  PartyPopper,
  Gift,
  Maximize2,
  Minimize2,
  Share2,
  Calendar,
  Clock,
} from 'lucide-react';
import {
  HomePopupPhoto,
  getStoredHomePopupPhotos,
  fetchHomePopupPhotosFromServer,
} from '../data/homePopupData';
import { toLocalIsoDateKey } from '../data/homeSliderData';
import { generateRealTimeFestivalPopups } from '../services/festivalPanchangService';
import { PageType, UserProfile } from '../types';

interface AdminHomePhotoPopupProps {
  currentUser?: UserProfile | null;
  onNavigate: (page: PageType) => void;
  onOpenRegister?: (planId?: number) => void;
  onOpenSponsorAddMember?: (planId?: number) => void;
  onOpenIdCard?: () => void;
  forceShowForPreview?: boolean;
  focusPhotoId?: string | null;
  onPreviewClosed?: () => void;
  location?: 'home' | 'dashboard' | 'global' | 'preview';
  suppressAutoOpen?: boolean;
}

const DISMISS_STORAGE_PREFIX = 'iois_admin_photo_popup_dismissed_v3_';

export const AdminHomePhotoPopup = ({
  currentUser,
  onNavigate,
  onOpenRegister,
  onOpenSponsorAddMember,
  onOpenIdCard,
  forceShowForPreview = false,
  focusPhotoId = null,
  onPreviewClosed,
  location = 'home',
  suppressAutoOpen = false,
}: AdminHomePhotoPopupProps) => {
  const popupLocation: 'home' | 'dashboard' | 'global' | 'preview' = location;
  const [adminPhotos, setAdminPhotos] = useState<HomePopupPhoto[]>(() =>
    getStoredHomePopupPhotos(popupLocation)
  );
  const [dateKey, setDateKey] = useState<string>(() => toLocalIsoDateKey(new Date()));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isFullPictureMode, setIsFullPictureMode] = useState<boolean>(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Sync admin popups & midnight date changes in real time
  useEffect(() => {
    let mounted = true;
    const sync = () => {
      if (!mounted) return;
      const updated = getStoredHomePopupPhotos(popupLocation);
      setAdminPhotos(updated);
      setBrokenImages({});
      if (focusPhotoId) {
        const idx = updated.findIndex((p) => p.id === focusPhotoId);
        setCurrentIndex(idx >= 0 ? idx : 0);
      }
    };

    sync();
    void fetchHomePopupPhotosFromServer().then(() => {
      sync();
    });

    const dateTimer = setInterval(() => {
      const nextKey = toLocalIsoDateKey(new Date());
      if (nextKey !== dateKey) {
        setDateKey(nextKey);
      }
    }, 60_000);

    window.addEventListener('iois_home_popups_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      mounted = false;
      clearInterval(dateTimer);
      window.removeEventListener('iois_home_popups_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, [popupLocation, focusPhotoId, dateKey]);

  // Build effective full-picture popup slides:
  // 1) Non-expired Admin popups configured for this view.
  // 2) Real-Time Active Today + Upcoming IOIS INDIA Festival Greeting Banners (on 'home' / 'preview').
  // Passed festivals NEVER appear!
  const effectivePhotos: HomePopupPhoto[] = useMemo(() => {
    if (popupLocation === 'preview') {
      if (adminPhotos.length > 0) return adminPhotos;
      return generateRealTimeFestivalPopups(new Date());
    }

    if (popupLocation === 'global' || popupLocation === 'dashboard') {
      // Outside Home showcase, respect Admin-targeted popups strictly
      return adminPhotos;
    }

    // Home location: Show active Admin popups + real-time Live & Upcoming IOIS INDIA Festival Greeting Banners
    const realTimeFestivals = generateRealTimeFestivalPopups(new Date());
    if (adminPhotos.length === 0) {
      return realTimeFestivals;
    }

    // Put active Admin popups first, followed by current/upcoming festival banners (deduplicated by festivalId)
    const adminFestivalIds = new Set(
      adminPhotos.map((p) => (p.festivalId || '').toLowerCase()).filter(Boolean)
    );
    const additionalFestivals = realTimeFestivals.filter(
      (f) => !f.festivalId || !adminFestivalIds.has(f.festivalId.toLowerCase())
    );
    return [...adminPhotos, ...additionalFestivals];
  }, [adminPhotos, popupLocation, dateKey]);

  const contentSignature = useMemo(() => {
    if (effectivePhotos.length === 0) return '';
    return effectivePhotos
      .map((p) => {
        const imgLen = p.imageUrl ? p.imageUrl.length : 0;
        return `${p.id}:${p.updatedAt || ''}:${dateKey}:${imgLen}`;
      })
      .join('|');
  }, [effectivePhotos, dateKey]);

  // Auto-open popup with spring entrance animation
  useEffect(() => {
    if (forceShowForPreview) {
      if (effectivePhotos.length > 0) {
        if (focusPhotoId) {
          const idx = effectivePhotos.findIndex((p) => p.id === focusPhotoId);
          if (idx >= 0) setCurrentIndex(idx);
        } else {
          setCurrentIndex(0);
        }
        setIsOpen(true);
        const animTimer = setTimeout(() => setIsAnimating(true), 40);
        return () => clearTimeout(animTimer);
      }
      return;
    }

    if (suppressAutoOpen) {
      return;
    }

    if (effectivePhotos.length === 0) {
      setIsOpen(false);
      setIsAnimating(false);
      return;
    }

    const dismissKey = `${DISMISS_STORAGE_PREFIX}${popupLocation}`;
    try {
      const dismissedSig = sessionStorage.getItem(dismissKey);
      if (dismissedSig && dismissedSig === contentSignature) {
        return;
      }
    } catch {}

    const timer = setTimeout(() => {
      setCurrentIndex(0);
      setIsOpen(true);
      setTimeout(() => setIsAnimating(true), 50);
    }, popupLocation === 'dashboard' ? 400 : 600);

    return () => clearTimeout(timer);
  }, [effectivePhotos, contentSignature, forceShowForPreview, focusPhotoId, popupLocation, suppressAutoOpen]);

  if (!isOpen || effectivePhotos.length === 0 || typeof document === 'undefined') {
    return null;
  }

  const safeIndex = currentIndex < effectivePhotos.length ? currentIndex : 0;
  const currentPhoto = effectivePhotos[safeIndex];
  if (!currentPhoto) return null;

  const hasCelebration = currentPhoto.celebrationEffect !== false;
  const hasVisibleImage = Boolean(currentPhoto.imageUrl?.trim() && !brokenImages[currentPhoto.id]);
  const isUpcoming = Boolean(currentPhoto.isUpcoming);

  const handleClose = () => {
    setIsFullPictureMode(false);
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      if (!forceShowForPreview) {
        try {
          sessionStorage.setItem(`${DISMISS_STORAGE_PREFIX}${popupLocation}`, contentSignature);
        } catch {}
      }
      onPreviewClosed?.();
    }, 220);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % effectivePhotos.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + effectivePhotos.length) % effectivePhotos.length);
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const headline = currentPhoto.celebrationHeadline || currentPhoto.title;
    const text = `*IOIS INDIA की ओर से हार्दिक बधाई एवं शुभकामनाएं*\n\n*${headline}*\n${currentPhoto.dateLabel ? `📅 ${currentPhoto.dateLabel}\n` : ''}${currentPhoto.shubhMuhurat ? `⏰ शुभ मुहूर्त: ${currentPhoto.shubhMuhurat}\n` : ''}\n${currentPhoto.description || ''}\n\n👉 अभी देखें: ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCtaClick = () => {
    handleClose();
    if (currentPhoto.actionType === 'register') {
      if (currentUser && onOpenSponsorAddMember) {
        onOpenSponsorAddMember(currentPhoto.actionPlanId || 1);
      } else if (onOpenRegister) {
        onOpenRegister(currentPhoto.actionPlanId || 1);
      } else {
        onNavigate('register');
      }
    } else if (currentPhoto.actionType === 'plans') {
      onNavigate('plans');
    } else if (currentPhoto.actionType === 'idcard') {
      if (onOpenIdCard) onOpenIdCard();
      else onNavigate('idcard');
    } else if (currentPhoto.actionType === 'rtps-services') {
      onNavigate('rtps-services');
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 z-[1160] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Full-Picture Edge-to-Edge Lightbox View */}
      {isFullPictureMode && hasVisibleImage ? (
        <div
          className="relative w-full h-full max-w-6xl max-h-[96vh] flex flex-col bg-slate-950 border-2 border-amber-400/75 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-950 flex items-center justify-between gap-2 shrink-0">
            <div className="min-w-0">
              <span className="block text-[10px] font-black uppercase tracking-wider">
                IOIS INDIA • 100% सम्पूर्ण बैनर दृश्य
              </span>
              <span className="block text-xs sm:text-sm font-black truncate">
                {currentPhoto.title}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsFullPictureMode(false)}
                className="min-h-[40px] px-3 rounded-xl bg-slate-950 text-amber-300 text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
                <span>वापस कार्ड</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="min-h-[40px] min-w-[40px] rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center cursor-pointer"
                aria-label="Close Popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-black flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.title}
              className="w-full h-full max-h-[78vh] object-contain select-none"
            />
            {effectivePhotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/90 text-white border border-amber-400/60 flex items-center justify-center cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/90 text-white border border-amber-400/60 flex items-center justify-center cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Complete Responsive Celebration & Festival Banner Popup Card */
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative z-10 w-full max-w-[96vw] sm:max-w-xl md:max-w-3xl max-h-[93vh] flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden border-2 transition-all duration-300 transform ${
            hasCelebration
              ? 'border-amber-400 shadow-[0_0_55px_rgba(245,158,11,0.45)]'
              : 'border-amber-500/70 shadow-2xl'
          } ${
            isAnimating
              ? 'scale-100 translate-y-0 opacity-100'
              : 'scale-90 translate-y-4 opacity-0'
          } bg-slate-950 text-white`}
        >
          {/* Top Official IOIS INDIA Greeting Banner Ribbon */}
          <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-950 px-3 sm:px-5 py-2 flex items-center justify-between gap-2 shrink-0 shadow-md">
            <div className="flex items-center gap-2 min-w-0">
              <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 shrink-0" />
              <span className="text-[11px] sm:text-xs font-black tracking-wide truncate">
                IOIS INDIA परिवार की ओर से हार्दिक बधाई एवं शुभकामनाएं
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {effectivePhotos.length > 1 && (
                <span className="text-[10px] sm:text-xs font-mono font-black bg-slate-950/15 px-2 py-0.5 rounded-md">
                  {safeIndex + 1} / {effectivePhotos.length}
                </span>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="min-h-[36px] min-w-[36px] rounded-full bg-slate-950 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer"
                title="बंद करें (Close)"
                aria-label="Close Popup"
              >
                <X className="w-4 h-4 stroke-[2.75]" />
              </button>
            </div>
          </div>

          {/* Scrollable Body: Festival Selector + 100% Uncropped Full Picture + Greeting Details */}
          <div className="overflow-y-auto custom-scrollbar flex-1 bg-slate-950">
            {/* Switcher tabs when multiple Current + Upcoming festivals exist */}
            {effectivePhotos.length > 1 && (
              <div className="px-3 sm:px-4 py-2 bg-slate-900/95 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
                {effectivePhotos.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`min-h-[34px] px-3 py-1 rounded-lg text-[11px] font-bold shrink-0 transition cursor-pointer border ${
                      safeIndex === idx
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                        : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-amber-500/60'
                    }`}
                  >
                    {item.festivalName
                      ? item.isUpcoming
                        ? `आगामी: ${item.festivalName}`
                        : `आज लाइव: ${item.festivalName}`
                      : item.title.slice(0, 22)}
                  </button>
                ))}
              </div>
            )}

            {/* Full Picture Showcase Area - Zero Cropping (Shows Entire Edge-to-Edge Picture) */}
            {hasVisibleImage ? (
              <div className={`relative bg-gradient-to-b ${currentPhoto.themeGradient || 'from-amber-950/35 via-slate-950 to-slate-950'} p-2 sm:p-3 border-b border-slate-800`}>
                <div
                  onClick={() => setIsFullPictureMode(true)}
                  className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-amber-500/40 shadow-2xl cursor-pointer group"
                  title="पूरे स्क्रीन में ज़ूम करके देखें"
                >
                  <img
                    src={currentPhoto.imageUrl}
                    alt={currentPhoto.title || 'IOIS INDIA पर्व बैनर'}
                    onError={() =>
                      setBrokenImages((prev) => ({ ...prev, [currentPhoto.id]: true }))
                    }
                    className="w-full h-auto max-h-[58vh] object-contain mx-auto block select-none"
                    loading="eager"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFullPictureMode(true);
                    }}
                    className="absolute top-2.5 right-2.5 bg-slate-950/90 hover:bg-slate-900 text-amber-300 border border-amber-400/60 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>पूरा फोटो ज़ूम</span>
                  </button>

                  {/* Left/Right Banner Navigation Arrows */}
                  {effectivePhotos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/85 hover:bg-black text-white flex items-center justify-center border border-amber-400/60 shadow-lg active:scale-90 transition cursor-pointer"
                        title="पिछला बैनर"
                        aria-label="Previous Banner"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/85 hover:bg-black text-white flex items-center justify-center border border-amber-400/60 shadow-lg active:scale-90 transition cursor-pointer"
                        title="अगला बैनर"
                        aria-label="Next Banner"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Live Date & Upcoming Status Strip */}
                {(currentPhoto.dateLabel || currentPhoto.shubhMuhurat) && (
                  <div className="mt-2.5 px-2 flex items-center justify-between gap-2 flex-wrap text-xs">
                    {currentPhoto.dateLabel && (
                      <span className={`font-black flex items-center gap-1.5 ${
                        isUpcoming ? 'text-sky-300' : 'text-emerald-300'
                      }`}>
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{currentPhoto.dateLabel}</span>
                      </span>
                    )}
                    {currentPhoto.shubhMuhurat && (
                      <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[260px] sm:max-w-none">{currentPhoto.shubhMuhurat.split('|')[0].trim()}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className={`p-6 sm:p-8 text-center bg-gradient-to-br ${currentPhoto.themeGradient || 'from-amber-600/25 via-rose-950/35 to-slate-950'} border-b border-amber-500/30 space-y-2`}>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                  <Gift className="w-7 h-7" />
                </div>
                <h4 className="text-base sm:text-xl font-black text-amber-200 leading-snug">
                  {currentPhoto.celebrationHeadline || currentPhoto.title}
                </h4>
              </div>
            )}

            {/* Official IOIS INDIA Congratulatory Banner Details */}
            <div className="p-3.5 sm:p-5 space-y-3 bg-gradient-to-b from-slate-950 to-slate-900/95">
              {currentPhoto.celebrationHeadline && (
                <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-orange-500/15 border border-amber-400/50 text-center space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                    IOIS INDIA की ओर से विशेष बधाई संदेश
                  </span>
                  <h4 className="text-sm sm:text-lg font-black text-amber-100 leading-snug">
                    {currentPhoto.celebrationHeadline}
                  </h4>
                </div>
              )}

              {currentPhoto.description && (
                <p className="text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-line break-words text-center sm:text-left">
                  {currentPhoto.description}
                </p>
              )}
            </div>
          </div>

          {/* Footer Action Bar (44px+ touch targets) */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 hover:bg-red-950 border border-slate-700 hover:border-red-500 text-slate-200 hover:text-red-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>बंद करें</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/50 text-emerald-300 transition cursor-pointer flex items-center gap-1.5"
                title="WhatsApp पर बधाई बैनर शेयर करें"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp बधाई भेजें</span>
                <span className="sm:hidden">शेयर</span>
              </button>
            </div>

            {currentPhoto.actionType && currentPhoto.actionType !== 'none' && (
              <button
                type="button"
                onClick={handleCtaClick}
                className="min-h-[44px] btn-3d-rainbow-special px-4 py-2 rounded-xl text-xs font-black text-black shadow-md flex items-center gap-1.5 active:scale-95 transition cursor-pointer ml-auto"
              >
                <Sparkles className="w-4 h-4 text-black shrink-0" />
                <span>
                  {currentUser && currentPhoto.actionType === 'register'
                    ? 'अपने स्पॉन्सर से जोड़ें'
                    : currentPhoto.actionText || 'अभी देखें'}
                </span>
                <ArrowRight className="w-4 h-4 text-black shrink-0" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
};
