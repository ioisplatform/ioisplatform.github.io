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
  Maximize2, 
  X,
  Calendar,
  Gift
} from 'lucide-react';
import { HomeSliderItem, getStoredSliders } from '../data/homeSliderData';
import { generateFestiveSliderItem } from '../services/festivalPanchangService';
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
  // Helper to construct dynamic slides with current/upcoming festival banner at Position #1
  const buildActiveSlides = (): HomeSliderItem[] => {
    const dynamicSlide = generateFestiveSliderItem(new Date());
    const stored = getStoredSliders().filter(s => s.active);
    
    // Filter out duplicate static slides of the same festival so user doesn't see repeated banners
    const filtered = stored.filter(s => {
      if (s.festivalName && dynamicSlide.festivalName) {
        return s.festivalName.toLowerCase() !== dynamicSlide.festivalName.toLowerCase();
      }
      return s.id !== dynamicSlide.id;
    });

    return [dynamicSlide, ...filtered];
  };

  const [slides, setSlides] = useState<HomeSliderItem[]>(() => buildActiveSlides());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync when sliders are updated from Admin Panel or date changes
  useEffect(() => {
    const handleUpdate = () => {
      setSlides(buildActiveSlides());
    };
    window.addEventListener('iois_sliders_updated', handleUpdate);
    return () => window.removeEventListener('iois_sliders_updated', handleUpdate);
  }, []);

  // Auto slide every 5.5 seconds
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];
  const isFestivalSlide = currentSlide.category === 'festival' || currentSlide.id.startsWith('dynamic-festive');

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Touch Swipe Handlers for effortless mobile phone swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    if (deltaX > 40) {
      handleNext();
    } else if (deltaX < -40) {
      handlePrev();
    }
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
      case 'Coins': return <Coins className="w-4 h-4 text-amber-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Sun': return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'Heart': return <Heart className="w-4 h-4 text-pink-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-violet-400" />;
      default: return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div 
      className="relative w-full rounded-2xl sm:rounded-3xl border-2 border-amber-500/50 shadow-2xl overflow-hidden bg-slate-950 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Ambient Background Layer with Slide Image & Gradients */}
      {currentSlide.imageUrl ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src={currentSlide.imageUrl} 
            alt={currentSlide.title} 
            className="w-full h-full object-cover object-center opacity-25 filter blur-[2px] scale-105 transition-all duration-700" 
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.bgGradient} opacity-85 mix-blend-multiply`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/70" />
        </div>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.bgGradient} opacity-90 transition-all duration-700 pointer-events-none`} />
      )}

      {/* 2. Main Content Container - Non-overlapping Safe Margins (px-8 sm:px-11 md:px-14) */}
      <div className="relative z-10 px-8 sm:px-11 md:px-14 py-3.5 sm:py-5 flex flex-col justify-between min-h-[250px] gap-3">
        
        {/* Top Meta Header: Badges & Slide Controls */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border shadow-md ${currentSlide.badgeColor}`}>
              {getSlideIcon(currentSlide.iconName)}
              <span className="truncate max-w-[210px] sm:max-w-none">{currentSlide.tag}</span>
            </span>
            <span className="bg-slate-950/90 text-amber-300 border border-amber-500/50 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
              {currentSlide.badgeText}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded-md border border-amber-500/30">
              {currentIndex + 1} / {slides.length}
            </span>
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 hover:border-amber-400 transition cursor-pointer"
              title={isPaused ? "ऑटो स्लाइड शुरू करें" : "रोकें"}
              aria-label="Pause or Play Slider"
            >
              {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Responsive Content Body: Mobile Vertical Flow vs Desktop Split Layout */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-5 w-full">
          
          {/* Mobile Dedicated Image Card (< 768px): 100% COMPLETE PICTURE WITHOUT ANY CROPPING */}
          {currentSlide.imageUrl && (
            <div 
              onClick={() => setPreviewImage({ url: currentSlide.imageUrl, title: currentSlide.title })}
              className="block md:hidden w-full relative rounded-xl sm:rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-black cursor-pointer group/mobilepic"
              title="पूरा पोस्टर व फोटो देखने के लिए क्लिक करें"
            >
              <div className="w-full aspect-video max-h-[195px] sm:max-h-[250px] relative flex items-center justify-center bg-black overflow-hidden">
                <img 
                  src={currentSlide.imageUrl} 
                  alt={currentSlide.title} 
                  className="w-full h-full object-contain select-none"
                  loading="eager"
                />
                
                {/* Top tap-to-expand badge */}
                <div className="absolute top-2 right-2 bg-slate-950/90 text-amber-300 border border-amber-500/60 px-2 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1 shadow-lg backdrop-blur-sm">
                  <Maximize2 className="w-3 h-3 text-amber-400" />
                  <span>HD ज़ूम</span>
                </div>
              </div>

              {/* Clean bottom ribbon bar beneath the picture with ZERO overlay on top of the image */}
              <div className="px-2.5 py-1 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-amber-500/40 flex items-center justify-between text-[10px] font-black">
                <span className="text-amber-300 flex items-center gap-1 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                  <span className="truncate">{currentSlide.highlightText}</span>
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[8.5px] font-black shrink-0 ml-1">
                  100% सम्पूर्ण फोटो ✓
                </span>
              </div>
            </div>
          )}

          {/* Text Content Column: 100% COMPLETE - NO LINE CLAMP, NO HIDDEN TEXT */}
          <div className="flex-1 space-y-2 min-w-0">
            <h3 className="text-xs sm:text-base md:text-xl font-black text-white leading-tight sm:leading-snug break-words drop-shadow-md">
              {currentSlide.title}
            </h3>
            
            <p className="text-[10.5px] sm:text-xs md:text-sm font-bold text-amber-200 leading-snug break-words drop-shadow">
              {currentSlide.subtitle}
            </p>

            {/* If it's a Festival Slide: Show Bespoke Festive Greeting & Welcoming Box */}
            {isFestivalSlide ? (
              <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 rounded-xl p-2.5 sm:p-3 shadow-md space-y-1.5 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[9.5px] sm:text-[10.5px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <span>🎉</span>
                    <span>स्वागत व शुभकामना संदेश</span>
                  </span>
                  <span className="text-[9.5px] sm:text-[11px] font-bold text-amber-300">
                    ⏰ {currentSlide.highlightText}
                  </span>
                </div>
                <p className="text-[10.5px] sm:text-xs text-slate-100 font-medium leading-relaxed break-words">
                  {currentSlide.description}
                </p>
              </div>
            ) : (
              /* Regular description box for non-festival slides */
              <div className="bg-slate-950/70 p-2 sm:p-2.5 rounded-xl border border-slate-800/80 backdrop-blur-sm">
                <p className="text-[10px] sm:text-xs text-slate-200 leading-relaxed break-words">
                  {currentSlide.description}
                </p>
              </div>
            )}
          </div>

          {/* Desktop/Tablet Dedicated Image Frame (>= 768px): 100% COMPLETE PICTURE */}
          {currentSlide.imageUrl && (
            <div 
              onClick={() => setPreviewImage({ url: currentSlide.imageUrl, title: currentSlide.title })}
              className="hidden md:flex flex-col items-center shrink-0 w-72 lg:w-96 cursor-pointer group/deskpic"
              title="पूरी तस्वीर बड़ी स्क्रीन में देखें (Click for HD Fullscreen)"
            >
              <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-[0_8px_25px_rgba(245,158,11,0.25)] relative group-hover/deskpic:border-amber-300 transition-all bg-black flex items-center justify-center">
                <img 
                  src={currentSlide.imageUrl} 
                  alt={currentSlide.title} 
                  className="w-full h-full object-contain group-hover/deskpic:scale-[1.02] transition-transform duration-500 select-none" 
                  loading="eager"
                />
                
                {/* Full-view expand button indicator */}
                <div className="absolute top-2.5 right-2.5 bg-slate-950/85 hover:bg-slate-900 text-amber-300 border border-amber-500/50 px-2 py-1 rounded-xl shadow-lg transition opacity-90 group-hover/deskpic:opacity-100 flex items-center gap-1 text-[10px] font-bold">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>HD ज़ूम</span>
                </div>
              </div>
              
              <div className="mt-2 text-center w-full">
                <span className="inline-block bg-slate-950/90 text-amber-300 border border-amber-400/40 text-[10.5px] font-black px-3 py-0.5 rounded-full shadow-md">
                  ✨ {currentSlide.highlightText}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Bottom CTA & Live Action Row - 100% Responsive on Phone & PC */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/90">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-emerald-400 font-black">
            <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
            <span className="break-words">{currentSlide.highlightText}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {/* If Festival Slide: Render dedicated popup trigger button + plan button */}
            {isFestivalSlide ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenFestivalWelcome) onOpenFestivalWelcome();
                    else onNavigate('panchang-rashifal');
                  }}
                  className="btn-3d-gold px-3 sm:px-4 py-2 rounded-xl text-slate-950 font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer touch-manipulation text-center"
                  title="पावन पर्व का महत्व, कथा व शुभ मुहूर्त पॉपअप"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-950" />
                  <span>🎉 पर्व स्वागत व मुहूर्त (Popup)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="btn-3d-rainbow-special px-3.5 sm:px-5 py-2 rounded-xl text-black font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer touch-manipulation text-center"
                >
                  <Gift className="w-3.5 h-3.5 text-black" />
                  <span>विशेष पर्व प्लान्स देखें ➔</span>
                </button>
              </>
            ) : (
              /* Regular Slide Action Button */
              <button
                type="button"
                onClick={handleCtaClick}
                className="btn-3d-rainbow-special w-full sm:w-auto px-4 sm:px-6 py-2 rounded-xl text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer touch-manipulation text-center"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-black shrink-0" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Navigation Arrows - Accessible & Non-Overlapping on small phones */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-slate-200 hover:text-white flex items-center justify-center transition shadow-xl z-20 cursor-pointer active:scale-90"
        title="पिछला पोस्टर / स्लाइड"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-slate-200 hover:text-white flex items-center justify-center transition shadow-xl z-20 cursor-pointer active:scale-90"
        title="अगला पोस्टर / स्लाइड"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
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

      {/* Fullscreen HD Modal on tap/click */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-950 border-2 border-amber-500/70 rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs sm:text-base font-black text-amber-300 truncate max-w-[80%]">
                {previewImage.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black border border-slate-800">
              <img 
                src={previewImage.url} 
                alt={previewImage.title} 
                className="w-full h-auto max-h-[72vh] object-contain select-none"
              />
            </div>

            <div className="text-[11px] text-slate-400 font-bold flex items-center justify-between w-full px-1">
              <span className="text-amber-400 font-black">● 100% सम्पूर्ण ओरिजिनल HD दृश्य</span>
              <span className="text-slate-400">टैप करके बंद करें ✓</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
