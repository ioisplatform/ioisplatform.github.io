import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Coins,
  Flame,
  Sun,
  Heart,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Play,
  Pause,
  Maximize2,
  X,
  Calendar,
  Clock,
} from 'lucide-react';
import {
  HomeSliderItem,
  getStoredSliders,
  fetchStoredSlidersFromServer,
  toLocalIsoDateKey,
  isSliderItemExpired,
  hasExpiredFestivalSignature,
} from '../data/homeSliderData';
import { generateRealTimeFestivalSliders } from '../services/festivalPanchangService';
import { PageType } from '../types';

interface FestiveHomeSliderProps {
  onNavigate: (page: PageType) => void;
  onOpenRegister?: (planId?: number) => void;
  onOpenFestivalWelcome?: () => void;
}

export const FestiveHomeSlider: React.FC<FestiveHomeSliderProps> = ({
  onNavigate,
  onOpenRegister,
  onOpenFestivalWelcome
}) => {
  const [dateKey, setDateKey] = useState<string>(() => toLocalIsoDateKey(new Date()));

  const buildActiveSlides = useCallback((): HomeSliderItem[] => {
    const now = new Date();
    const todayKey = toLocalIsoDateKey(now);
    const realTimeFestivalSlides = generateRealTimeFestivalSliders(now).filter(
      (s) => s.active && !hasExpiredFestivalSignature(s, todayKey)
    );
    const stored = getStoredSliders().filter(
      (s) => s.active && !isSliderItemExpired(s, now)
    );

    // Prevent duplicates with dynamically generated festival slides (by festivalId or festivalName)
    const dynamicFestKeys = new Set(
      realTimeFestivalSlides
        .flatMap((s) => [s.festivalId || '', s.festivalName || ''])
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean)
    );
    const filteredStored = stored.filter((s) => {
      const fId = (s.festivalId || '').trim().toLowerCase();
      const fName = (s.festivalName || '').trim().toLowerCase();
      if (s.category === 'festival' && ((fId && dynamicFestKeys.has(fId)) || (fName && dynamicFestKeys.has(fName)))) {
        return false;
      }
      return true;
    });

    return [...realTimeFestivalSlides, ...filteredStored];
  }, []);

  const [slides, setSlides] = useState<HomeSliderItem[]>(() => buildActiveSlides());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [previewSlide, setPreviewSlide] = useState<HomeSliderItem | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync on mount, server fetch, admin updates, AND automatic midnight date rollover
  useEffect(() => {
    const handleUpdate = () => {
      const next = buildActiveSlides();
      setSlides(next);
      setCurrentIndex((prev) => (prev >= next.length ? 0 : prev));
    };

    void fetchStoredSlidersFromServer().then(() => {
      handleUpdate();
    });

    const dateWatcher = setInterval(() => {
      const currentKey = toLocalIsoDateKey(new Date());
      if (currentKey !== dateKey) {
        setDateKey(currentKey);
        handleUpdate();
      }
    }, 60_000);

    window.addEventListener('iois_sliders_updated', handleUpdate);
    return () => {
      clearInterval(dateWatcher);
      window.removeEventListener('iois_sliders_updated', handleUpdate);
    };
  }, [buildActiveSlides, dateKey]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  if (slides.length === 0) return null;

  const safeIndex = currentIndex < slides.length ? currentIndex : 0;
  const currentSlide = slides[safeIndex] || slides[0];
  if (!currentSlide) return null;

  const isFestivalSlide = currentSlide.category === 'festival';
  const isUpcomingFestival = Boolean(currentSlide.isUpcoming);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    if (deltaX > 40) handleNext();
    else if (deltaX < -40) handlePrev();
    setTouchStartX(null);
  };

  const handleCtaClick = () => {
    if (currentSlide.ctaAction === 'register') {
      if (onOpenRegister) onOpenRegister(currentSlide.ctaPlanId || 1);
      else onNavigate('register');
    } else if (currentSlide.ctaAction === 'plans') {
      onNavigate('plans');
    } else if (currentSlide.ctaAction === 'idcard') {
      onNavigate('idcard');
    } else if (currentSlide.ctaAction === 'rtps-services') {
      onNavigate('rtps-services');
    } else {
      onNavigate('plans');
    }
  };

  const getSlideIcon = (name: string) => {
    switch (name) {
      case 'Coins': return <Coins className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'Flame': return <Flame className="w-4 h-4 text-orange-400 shrink-0" />;
      case 'Sun': return <Sun className="w-4 h-4 text-yellow-300 shrink-0" />;
      case 'Heart': return <Heart className="w-4 h-4 text-pink-400 shrink-0" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-violet-400 shrink-0" />;
      default: return <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />;
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl border border-amber-500/45 shadow-2xl overflow-hidden bg-slate-950 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Festival-Matched Ambient Backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.bgGradient || 'from-slate-900 to-slate-950'} transition-all duration-700 pointer-events-none`} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60 pointer-events-none" />

      {/* Top Official IOIS INDIA Festival Greeting Header Bar */}
      <div className="relative z-10 px-4 sm:px-6 py-2 bg-slate-950/80 border-b border-amber-500/30 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          {getSlideIcon(currentSlide.iconName)}
          <span className="text-[11px] sm:text-xs font-black tracking-wide text-amber-300 uppercase">
            {isFestivalSlide
              ? isUpcomingFestival
                ? 'IOIS INDIA आगामी पर्व व बधाई स्लाइडर'
                : 'IOIS INDIA लाइव पर्व व बधाई स्लाइडर'
              : 'IOIS INDIA विशेष अपडेट व मिशन स्लाइडर'}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className={`text-[11px] sm:text-xs font-bold truncate ${
            isFestivalSlide
              ? isUpcomingFestival
                ? 'text-sky-300'
                : 'text-emerald-300'
              : 'text-slate-300'
          }`}>
            {currentSlide.tag}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] font-mono font-bold text-slate-300">
            {safeIndex + 1} / {slides.length}
          </span>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="min-h-[36px] min-w-[36px] px-2 rounded-lg bg-slate-900/90 text-slate-200 hover:text-amber-300 border border-slate-700 hover:border-amber-400 transition flex items-center justify-center cursor-pointer"
            title={isPaused ? 'स्लाइडर चलाएं' : 'स्लाइडर रोकें'}
            aria-label={isPaused ? 'Play Slider' : 'Pause Slider'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Content Split Layout with Safe Arrow Gutters */}
      <div className="relative z-10 px-4 sm:px-11 md:px-14 py-4 sm:py-5 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 w-full">

          {/* Full Uncropped 16:9 Festival Artwork (Mobile Top / Desktop Right) */}
          {currentSlide.imageUrl && (
            <button
              type="button"
              onClick={() => setPreviewSlide(currentSlide)}
              className="w-full md:w-[340px] lg:w-[410px] md:order-2 shrink-0 rounded-2xl overflow-hidden border border-amber-400/50 bg-slate-950 shadow-[0_12px_32px_rgba(0,0,0,0.65)] hover:border-amber-300 transition-all cursor-pointer group/pic text-left"
              title="पूरी तस्वीर और IOIS INDIA बधाई बैनर बड़ा देखें"
            >
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.title}
                  className="w-full h-full object-contain group-hover/pic:scale-[1.02] transition-transform duration-500 select-none"
                  loading="eager"
                />
                <span className="absolute top-2 right-2 bg-slate-950/90 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md">
                  <Maximize2 className="w-3 h-3" />
                  <span>पूरी तस्वीर देखें</span>
                </span>
              </div>
              <div className="px-3 py-2 bg-slate-950 border-t border-amber-500/30 flex items-center justify-between gap-2 text-[11px]">
                <span className="font-bold text-amber-300 truncate">
                  {isFestivalSlide ? 'IOIS INDIA शुभ संदेश बैनर' : currentSlide.badgeText}
                </span>
                <span className="text-slate-400 font-medium shrink-0">
                  100% Full View
                </span>
              </div>
            </button>
          )}

          {/* Narrative & Festival Blessing Copy Column */}
          <div className="flex-1 md:order-1 space-y-2.5 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{currentSlide.highlightText}</span>
              </span>
            </div>

            <h3 className="text-base sm:text-xl md:text-2xl font-black text-white leading-snug break-words">
              {currentSlide.title}
            </h3>

            <p className="text-xs sm:text-sm font-semibold text-amber-200 leading-relaxed break-words">
              {currentSlide.subtitle}
            </p>

            <div className="bg-slate-950/75 border border-slate-800/90 rounded-xl p-3 sm:p-3.5 backdrop-blur-sm space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-bold text-amber-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{currentSlide.badgeText}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                {currentSlide.description}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Footer Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-800/90">
          {/* Quick Slide Tabs for Current + Upcoming Switch */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`min-h-[36px] px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                  safeIndex === idx
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-500/60 hover:text-white'
                }`}
              >
                {s.category === 'festival'
                  ? s.isUpcoming
                    ? `आगामी: ${(s.festivalName || s.tag).split(' ')[0]}`
                    : `लाइव: ${(s.festivalName || 'आज').split(' ')[0]}`
                  : s.category === 'savings'
                    ? 'स्मार्ट बचत'
                    : 'मिशन 2027'}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {isFestivalSlide && (
              <button
                type="button"
                onClick={() => {
                  if (onOpenFestivalWelcome) onOpenFestivalWelcome();
                  else onNavigate('panchang-rashifal');
                }}
                className="min-h-[44px] btn-3d-gold px-4 py-2 rounded-xl text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>शुभ मुहूर्त व पंचांग (Popup)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCtaClick}
              className="min-h-[44px] btn-3d-rainbow-special px-4 sm:px-5 py-2 rounded-xl text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4 text-black shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Side Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-amber-500/50 text-slate-200 hover:text-white items-center justify-center transition shadow-xl z-20 cursor-pointer active:scale-90"
            title="पिछला बैनर"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-amber-500/50 text-slate-200 hover:text-white items-center justify-center transition shadow-xl z-20 cursor-pointer active:scale-90"
            title="अगला बैनर"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Fullscreen Uncropped IOIS INDIA Greeting Banner Preview Lightbox */}
      {previewSlide && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[1180] flex items-center justify-center p-2 sm:p-5 bg-black/95 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewSlide(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-5xl w-full bg-slate-950 border-2 border-amber-500/75 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-950 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-wider opacity-85">
                  IOIS INDIA आधिकारिक बधाई एवं स्वागत बैनर
                </span>
                <h4 className="text-xs sm:text-base font-black truncate">
                  {previewSlide.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewSlide(null)}
                className="min-h-[44px] min-w-[44px] rounded-full bg-slate-950 text-white hover:bg-red-600 flex items-center justify-center transition cursor-pointer shrink-0"
                aria-label="Close Full View"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-black flex flex-col items-center justify-center gap-4">
              {previewSlide.imageUrl && (
                <img
                  src={previewSlide.imageUrl}
                  alt={previewSlide.title}
                  className="w-full h-auto max-h-[68vh] object-contain rounded-xl border border-amber-500/30 select-none"
                />
              )}
              <div className="w-full max-w-3xl bg-slate-900/90 border border-amber-500/30 rounded-2xl p-3.5 text-center space-y-1.5">
                <p className="text-xs sm:text-sm font-bold text-amber-200">
                  {previewSlide.highlightText}
                </p>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {previewSlide.description}
                </p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
