import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight, Tag } from 'lucide-react';

interface PromotionalPosterBannerProps {
  onSelectPlan?: (planId: string) => void;
  onOpenStudyModal?: (planId: string) => void;
}

export const PromotionalPosterBanner: React.FC<PromotionalPosterBannerProps> = ({
  onSelectPlan,
  onOpenStudyModal
}) => {
  const siteSettings = useSiteSettings();
  const activePosters = (siteSettings.promotionalPosters || []).filter(p => p.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 6 seconds if multiple active posters
  useEffect(() => {
    if (activePosters.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activePosters.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activePosters.length]);

  if (activePosters.length === 0) {
    return null;
  }

  const currentPoster = activePosters[currentIndex] || activePosters[0];

  const handleAction = () => {
    if (currentPoster.targetPlanId && onSelectPlan) {
      onSelectPlan(currentPoster.targetPlanId);
    } else if (currentPoster.targetLink && currentPoster.targetLink.startsWith('#')) {
      const el = document.getElementById(currentPoster.targetLink.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (currentPoster.targetLink && currentPoster.targetLink.startsWith('http')) {
      window.open(currentPoster.targetLink, '_blank');
    } else if (onSelectPlan) {
      onSelectPlan('plan-01');
    }
  };

  return (
    <div className="w-full my-6">
      <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-amber-400/40 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white">
        
        {/* Background Image with Ambient Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentPoster.imageUrl}
            alt={currentPoster.title}
            className="w-full h-full object-cover object-center opacity-30 filter blur-xs transform scale-105 transition-all duration-1000"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 min-h-[220px]">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>{currentPoster.badge || '★ विशेष ऑफर'}</span>
              </span>
              <span className="text-[11px] text-amber-300 font-bold hidden sm:inline">
                IOIS आधिकारिक प्रमोशनल पोस्टर
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              {currentPoster.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {currentPoster.subtitle}
            </p>

            <div className="pt-2">
              <button
                onClick={handleAction}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
              >
                <span>{currentPoster.buttonText || 'अभी लाभ उठाएं'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Preview Card / Thumbnail */}
          <div className="hidden lg:block w-72 h-44 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl shrink-0 group relative">
            <img
              src={currentPoster.imageUrl}
              alt={currentPoster.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] font-bold text-amber-300 truncate">
                {currentPoster.title}
              </span>
            </div>
          </div>

        </div>

        {/* Carousel controls if more than 1 poster */}
        {activePosters.length > 1 && (
          <div className="relative z-10 px-6 pb-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
            <div className="flex items-center gap-1.5">
              {activePosters.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex(prev => (prev - 1 + activePosters.length) % activePosters.length)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="पिछला पोस्टर"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentIndex(prev => (prev + 1) % activePosters.length)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="अगला पोस्टर"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
