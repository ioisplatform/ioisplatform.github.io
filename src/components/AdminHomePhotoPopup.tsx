import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { HomePopupPhoto, getStoredHomePopupPhotos } from '../data/homePopupData';
import { PageType } from '../types';

interface AdminHomePhotoPopupProps {
  onNavigate: (page: PageType) => void;
  onOpenRegister?: (planId?: number) => void;
  onOpenIdCard?: () => void;
  forceShowForPreview?: boolean;
}

export const AdminHomePhotoPopup: React.FC<AdminHomePhotoPopupProps> = ({
  onNavigate,
  onOpenRegister,
  onOpenIdCard,
  forceShowForPreview = false,
}) => {
  const [photos, setPhotos] = useState<HomePopupPhoto[]>(() => getStoredHomePopupPhotos());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Sync photos when admin updates them
  useEffect(() => {
    const handleUpdate = () => {
      const updated = getStoredHomePopupPhotos();
      setPhotos(updated);
      if (updated.length === 0) {
        setIsOpen(false);
      }
    };

    window.addEventListener('iois_home_popups_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('iois_home_popups_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Check if photos exist on mount; show popup with smooth zoom effect
  useEffect(() => {
    if (forceShowForPreview) {
      setIsOpen(true);
      setTimeout(() => setIsAnimating(true), 50);
      return;
    }

    if (photos.length > 0) {
      // Check if user dismissed it in this browser session
      const dismissed = sessionStorage.getItem('iois_admin_photo_popup_dismissed');
      if (!dismissed) {
        // Trigger popup with slight delay for page paint
        const timer = setTimeout(() => {
          setIsOpen(true);
          setTimeout(() => setIsAnimating(true), 60);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [photos.length, forceShowForPreview]);

  // If no photos or closed, render nothing
  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];
  if (!currentPhoto || !currentPhoto.imageUrl) return null;

  const handleClose = () => {
    // Zoom out effect
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      sessionStorage.setItem('iois_admin_photo_popup_dismissed', 'true');
    }, 280);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleCtaClick = () => {
    handleClose();
    if (currentPhoto.actionType === 'register') {
      if (onOpenRegister) onOpenRegister(currentPhoto.actionPlanId || 1);
      else onNavigate('register');
    } else if (currentPhoto.actionType === 'plans') {
      onNavigate('plans');
    } else if (currentPhoto.actionType === 'idcard') {
      if (onOpenIdCard) onOpenIdCard();
      else onNavigate('idcard');
    } else if (currentPhoto.actionType === 'rtps-services') {
      onNavigate('rtps-services');
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      {/* 
        Container dynamically adapts to photo size.
        Uses smooth zoom-in / zoom-out scale effect (`scale-100` vs `scale-75`).
      */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-w-[94vw] sm:max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all duration-300 transform ${
          isAnimating 
            ? 'scale-100 translate-y-0 opacity-100' 
            : 'scale-75 translate-y-4 opacity-0'
        }`}
        style={{
          backgroundColor: 'var(--card-bg, #0f172a)',
          color: 'var(--text-primary, #ffffff)',
        }}
      >
        {/* Top Header Controls Bar */}
        <div 
          className="flex items-center justify-between px-3 py-2 border-b transition-colors z-10 shrink-0"
          style={{
            backgroundColor: 'var(--surface-bg, #020617)',
            borderColor: 'var(--btn-border, #334155)',
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-amber-300 truncate">
              {currentPhoto.title || 'IOIS आधिकारिक विशेष सूचना'}
            </span>
            {photos.length > 1 && (
              <span className="text-[9px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono shrink-0">
                {currentIndex + 1}/{photos.length}
              </span>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-md shrink-0"
            title="पॉपअप बंद करें (Close)"
            aria-label="Close Popup"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Dynamic Photo Container - Scales naturally to the image dimensions without distortion */}
        <div className="relative overflow-hidden flex items-center justify-center bg-black/40 min-h-[180px] max-h-[70vh]">
          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title || 'IOIS घोषणा'}
            className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded-b-none select-none"
            loading="eager"
          />

          {/* Next / Prev Controls (Shown when multiple photos exist) */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-amber-400/60 shadow-lg active:scale-90 transition cursor-pointer"
                title="पिछली फोटो"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-amber-400/60 shadow-lg active:scale-90 transition cursor-pointer"
                title="अगली फोटो"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Slider Dots at bottom edge of image */}
          {photos.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-6 bg-amber-400 shadow-md' 
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  title={`फोटो ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Details & Optional Action Button */}
        {(currentPhoto.description || currentPhoto.actionType !== 'none') && (
          <div 
            className="p-3 sm:p-4 border-t space-y-2 shrink-0 transition-colors"
            style={{
              backgroundColor: 'var(--surface-bg, #020617)',
              borderColor: 'var(--btn-border, #334155)',
            }}
          >
            {currentPhoto.description && (
              <p className="text-[11px] sm:text-xs leading-relaxed opacity-90 line-clamp-2" style={{ color: 'var(--text-secondary, #cbd5e1)' }}>
                {currentPhoto.description}
              </p>
            )}

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-1.5 rounded-xl text-[10.5px] sm:text-xs font-bold border transition cursor-pointer hover:bg-slate-800"
                style={{
                  borderColor: 'var(--btn-border, #475569)',
                  color: 'var(--text-secondary, #94a3b8)',
                }}
              >
                बंद करें
              </button>

              {currentPhoto.actionType && currentPhoto.actionType !== 'none' && (
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="btn-3d-rainbow-special px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black text-black shadow-md flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
                  <span>{currentPhoto.actionText || 'अभी देखें'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
