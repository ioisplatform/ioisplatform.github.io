import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Sparkles, ArrowRight, PartyPopper, Gift } from 'lucide-react';
import {
  HomePopupPhoto,
  getStoredHomePopupPhotos,
  fetchHomePopupPhotosFromServer,
} from '../data/homePopupData';
import { getFestivalForDate } from '../services/festivalPanchangService';
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

const DISMISS_STORAGE_PREFIX = 'iois_admin_photo_popup_dismissed_v2_';

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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Sync admin photos from server & live events
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
      } else {
        setCurrentIndex(0);
      }
    };

    sync();
    void fetchHomePopupPhotosFromServer().then(() => {
      sync();
    });

    window.addEventListener('iois_home_popups_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      mounted = false;
      window.removeEventListener('iois_home_popups_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, [popupLocation, focusPhotoId]);

  // Build effective popup slides:
  // 1) Admin configured popups take priority.
  // 2) If Admin hasn't configured any photo or message, ONLY show a popup when today is a REAL-TIME festival/celebration!
  const effectivePhotos: HomePopupPhoto[] = useMemo(() => {
    if (adminPhotos.length > 0) {
      return adminPhotos;
    }

    // Check real-time festival / celebration on current calendar date
    const todayFest = getFestivalForDate(new Date());
    if (todayFest && todayFest.id !== 'daily-vedic-divas') {
      return [
        {
          id: `realtime-fest-${todayFest.id}-${new Date().toDateString()}`,
          imageUrl: todayFest.imageUrl || '',
          title: todayFest.nameHindi,
          celebrationHeadline: `🎉 ${todayFest.nameHindi} की हार्दिक बधाई एवं शुभकामनाएं! 🎉`,
          description: todayFest.greetingsMessage || todayFest.tagline,
          celebrationEffect: true,
          displayTargets: ['all'],
          actionType: 'plans',
          actionText: 'विशेष पर्व ऑफर देखें',
          active: true,
          order: 1,
        },
      ];
    }

    return [];
  }, [adminPhotos]);

  // Signature changes whenever Admin updates/uploads a photo or edits text so visitors always see fresh popups
  const contentSignature = useMemo(() => {
    if (effectivePhotos.length === 0) return '';
    return effectivePhotos
      .map((p) => {
        const imgLen = p.imageUrl ? p.imageUrl.length : 0;
        const imgHead = p.imageUrl ? p.imageUrl.slice(-24) : '';
        return `${p.id}:${p.updatedAt || ''}:${p.title || ''}:${p.celebrationHeadline || ''}:${p.description || ''}:${imgLen}:${imgHead}`;
      })
      .join('|');
  }, [effectivePhotos]);

  // Auto trigger with smooth pop zoom-in effect
  useEffect(() => {
    if (forceShowForPreview) {
      if (effectivePhotos.length > 0) {
        if (focusPhotoId) {
          const idx = effectivePhotos.findIndex((p) => p.id === focusPhotoId);
          if (idx >= 0) setCurrentIndex(idx);
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
      setIsOpen(true);
      setTimeout(() => setIsAnimating(true), 50);
    }, popupLocation === 'dashboard' ? 400 : 650);

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

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      if (!forceShowForPreview) {
        try {
          sessionStorage.setItem(`${DISMISS_STORAGE_PREFIX}${popupLocation}`, contentSignature);
        } catch {}
      }
      onPreviewClosed?.();
    }, 260);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % effectivePhotos.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + effectivePhotos.length) % effectivePhotos.length);
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
      className={`fixed inset-0 z-[1160] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Congratulations & Celebration Animated Confetti Sparks */}
      {hasCelebration && isAnimating && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          {[
            { left: '8%', top: '14%', color: 'bg-amber-400', delay: '0s' },
            { left: '18%', top: '26%', color: 'bg-pink-400', delay: '0.2s' },
            { left: '32%', top: '10%', color: 'bg-emerald-400', delay: '0.4s' },
            { left: '52%', top: '8%', color: 'bg-yellow-300', delay: '0.1s' },
            { left: '72%', top: '15%', color: 'bg-cyan-400', delay: '0.35s' },
            { left: '88%', top: '22%', color: 'bg-rose-400', delay: '0.15s' },
            { left: '12%', top: '76%', color: 'bg-amber-300', delay: '0.3s' },
            { left: '84%', top: '78%', color: 'bg-violet-400', delay: '0.25s' },
          ].map((dot, idx) => (
            <span
              key={idx}
              style={{ left: dot.left, top: dot.top, animationDelay: dot.delay }}
              className={`absolute w-2.5 h-2.5 rounded-full ${dot.color} animate-ping opacity-75`}
            />
          ))}
        </div>
      )}

      {/* Auto-Sizing Pop Container with Smooth Spring Zoom-In / Zoom-Out */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 w-full max-w-[94vw] sm:max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden border-2 transition-all duration-300 transform ${
          hasCelebration
            ? 'border-amber-400 shadow-[0_0_55px_rgba(245,158,11,0.55)]'
            : 'border-amber-500/70 shadow-2xl'
        } ${
          isAnimating
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-75 translate-y-4 opacity-0'
        }`}
        style={{
          backgroundColor: 'var(--card-bg, #0f172a)',
          color: 'var(--text-primary, #ffffff)',
        }}
      >
        {/* Top Celebration Ribbon */}
        {hasCelebration && (
          <div className="bg-gradient-to-r from-amber-500 via-yellow-300 to-rose-500 text-slate-950 px-3 py-1.5 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-black tracking-wide shrink-0 shadow-md">
            <PartyPopper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 animate-bounce shrink-0" />
            <span className="truncate">
              🎊 हार्दिक बधाई व शुभकामनाएं • CELEBRATION SPECIAL 🎊
            </span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 animate-pulse shrink-0" />
          </div>
        )}

        {/* Top Header Controls Bar with Prominent Cut Button */}
        <div
          className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b transition-colors z-10 shrink-0"
          style={{
            backgroundColor: 'var(--surface-bg, #020617)',
            borderColor: 'var(--btn-border, #334155)',
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-sm font-black tracking-wide text-amber-300 truncate">
              {currentPhoto.title || currentPhoto.celebrationHeadline || 'IOIS विशेष शुभकामना व सूचना'}
            </span>
            {effectivePhotos.length > 1 && (
              <span className="text-[9.5px] bg-slate-900 text-slate-200 px-2 py-0.5 rounded-full border border-slate-700 font-mono shrink-0">
                {safeIndex + 1}/{effectivePhotos.length}
              </span>
            )}
          </div>

          {/* Cut (Close) Button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-lg border border-red-300/60 shrink-0"
            title="बंद करें (Cut / Close)"
            aria-label="Close Popup"
          >
            <X className="w-4 h-4 stroke-[2.75]" />
          </button>
        </div>

        {/* Body Scrollable Area */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {/* Dynamic Photo Container - Preserves Natural Photo Proportions */}
          {hasVisibleImage ? (
            <div className="relative overflow-hidden flex items-center justify-center bg-black/60 min-h-[180px] max-h-[60vh]">
              <img
                src={currentPhoto.imageUrl}
                alt={currentPhoto.title || 'IOIS उत्सव पॉपअप'}
                onError={() =>
                  setBrokenImages((prev) => ({ ...prev, [currentPhoto.id]: true }))
                }
                className="w-auto h-auto max-w-full max-h-[60vh] object-contain select-none"
                loading="eager"
              />

              {/* Next / Prev Controls when multiple popups exist */}
              {effectivePhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center border border-amber-400/60 shadow-lg active:scale-90 transition cursor-pointer"
                    title="पिछला"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center border border-amber-400/60 shadow-lg active:scale-90 transition cursor-pointer"
                    title="अगला"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {effectivePhotos.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
                  {effectivePhotos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        safeIndex === idx
                          ? 'w-6 bg-amber-400 shadow-md'
                          : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      title={`स्लाइड ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Rich Congratulations Hero when Admin sets message without photo */
            <div className="relative p-6 sm:p-8 text-center bg-gradient-to-br from-amber-600/25 via-rose-950/35 to-slate-950 border-b border-amber-500/30 space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                <Gift className="w-7 h-7" />
              </div>
              <h4 className="text-base sm:text-xl font-black text-amber-200 leading-snug">
                {currentPhoto.celebrationHeadline || currentPhoto.title}
              </h4>
            </div>
          )}

          {/* Celebration Headline + Details Banner */}
          {(currentPhoto.celebrationHeadline || currentPhoto.description) && (
            <div className="p-3.5 sm:p-5 space-y-2 bg-gradient-to-b from-slate-950/90 to-slate-900/95">
              {currentPhoto.celebrationHeadline && hasVisibleImage && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-400/50 text-center">
                  <p className="text-xs sm:text-base font-black text-amber-200 leading-snug">
                    {currentPhoto.celebrationHeadline}
                  </p>
                </div>
              )}
              {currentPhoto.description && (
                <p
                  className="text-xs sm:text-sm leading-relaxed text-center sm:text-left whitespace-pre-line break-words"
                  style={{ color: 'var(--text-secondary, #e2e8f0)' }}
                >
                  {currentPhoto.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Action & Cut Footer */}
        <div
          className="p-3 sm:p-4 border-t flex items-center justify-between gap-2 shrink-0 transition-colors"
          style={{
            backgroundColor: 'var(--surface-bg, #020617)',
            borderColor: 'var(--btn-border, #334155)',
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-slate-900 hover:bg-red-950 border border-slate-700 hover:border-red-500 text-slate-200 hover:text-red-200 transition cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>बंद करें (Cut)</span>
          </button>

          {currentPhoto.actionType && currentPhoto.actionType !== 'none' && (
            <button
              type="button"
              onClick={handleCtaClick}
              className="btn-3d-rainbow-special px-4 py-2 rounded-xl text-xs font-black text-black shadow-md flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
              <span>
                {currentUser && currentPhoto.actionType === 'register'
                  ? 'अपने स्पॉन्सर से जोड़ें'
                  : currentPhoto.actionText || 'अभी देखें'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
