import React, { useState, useEffect, useRef } from 'react';
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
  Award,
  Crown
} from 'lucide-react';
import { HomeSliderItem, getStoredSliders } from '../data/homeSliderData';
import { PageType } from '../types';

interface FestiveHomeSliderProps {
  onNavigate: (page: PageType) => void;
  onOpenRegister?: (planId?: number) => void;
}

export const FestiveHomeSlider: React.FC<FestiveHomeSliderProps> = ({
  onNavigate,
  onOpenRegister
}) => {
  const [slides, setSlides] = useState<HomeSliderItem[]>(() => {
    return getStoredSliders().filter(s => s.active);
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync when sliders are updated from Admin Panel
  useEffect(() => {
    const handleUpdate = () => {
      setSlides(getStoredSliders().filter(s => s.active));
    };
    window.addEventListener('iois_sliders_updated', handleUpdate);
    return () => window.removeEventListener('iois_sliders_updated', handleUpdate);
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
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
      case 'Coins': return <Coins className="w-5 h-5 text-amber-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Sun': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'Heart': return <Heart className="w-5 h-5 text-pink-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-violet-400" />;
      default: return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div 
      className="relative w-full rounded-2xl sm:rounded-3xl border-2 border-amber-500/50 shadow-2xl overflow-hidden bg-slate-950 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Background Gradient & Ambient Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.bgGradient} opacity-90 transition-all duration-700 pointer-events-none`} />
      
      {/* Festive Background Watermark Motif */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none overflow-hidden">
        {currentSlide.category === 'festival' ? (
          <Flame className="w-64 h-64 text-amber-300 transform rotate-12 scale-125" />
        ) : (
          <Coins className="w-64 h-64 text-emerald-300 transform -rotate-12 scale-125" />
        )}
      </div>

      {/* Main Content Card - Guaranteed 100% Full View On All Screen Sizes */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[220px] sm:min-h-[260px] md:min-h-[290px] gap-4">
        
        {/* Top Meta Header: Badge + Slide Indicators + Pause/Play */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border shadow-md ${currentSlide.badgeColor}`}>
              {getSlideIcon(currentSlide.iconName)}
              <span>{currentSlide.tag}</span>
            </span>
            <span className="bg-slate-950/80 text-amber-300 border border-amber-500/40 text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
              {currentSlide.badgeText}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
              {currentIndex + 1} / {slides.length}
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title={isPaused ? "ऑटो स्लाइड शुरू करें" : "रोकें"}
            >
              {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Center Title & Rich Narrative */}
        <div className="space-y-2 max-w-3xl">
          <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
            {currentSlide.title}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-amber-200/95 leading-relaxed drop-shadow">
            {currentSlide.subtitle}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3">
            {currentSlide.description}
          </p>
        </div>

        {/* Bottom CTA & Direct Plan Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-emerald-400 font-black">
            <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
            <span>{currentSlide.highlightText}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCtaClick}
              className="btn-3d-rainbow-special w-full sm:w-auto px-5 py-2 sm:py-2.5 rounded-xl text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer touch-manipulation"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-white flex items-center justify-center transition shadow-xl z-20 cursor-pointer active:scale-90"
        title="पिछला पोस्टर / स्लाइड"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-white flex items-center justify-center transition shadow-xl z-20 cursor-pointer active:scale-90"
        title="अगला पोस्टर / स्लाइड"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === idx 
                ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' 
                : 'w-1.5 bg-slate-600 hover:bg-slate-400'
            }`}
            title={`स्लाइड ${idx + 1}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
};
