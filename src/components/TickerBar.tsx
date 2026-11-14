import React, { useState, useEffect, memo } from 'react';
import { PLANS, OFFICIAL_FORM_URL } from '../data/plansData';
import { TickerSpeed, UserProfile } from '../types';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  Sparkles, 
  Zap, 
  Layers, 
  ArrowRight,
  SlidersHorizontal,
  Eye
} from 'lucide-react';

interface TickerBarProps {
  currentUser?: UserProfile | null;
  onOpenRegister?: (planId?: number) => void;
  onOpenSponsorAddMember?: (planId?: number) => void;
}

export const TickerBar: React.FC<TickerBarProps> = memo(({ currentUser, onOpenRegister, onOpenSponsorAddMember }) => {
  // Mode: 'card' (Easy-to-Read Slide Mode - Default) vs 'marquee' (Continuous Scroll)
  const [viewMode, setViewMode] = useState<'card' | 'marquee'>('card');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<TickerSpeed>('slow');

  // Auto-advance slides in card mode every 7.5 seconds for comfortable reading
  useEffect(() => {
    if (viewMode !== 'card' || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % PLANS.length);
    }, 7500);

    return () => clearInterval(timer);
  }, [viewMode, isPaused]);

  const activePlan = PLANS[currentSlideIndex] || PLANS[0];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + PLANS.length) % PLANS.length);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % PLANS.length);
  };

  const getSpeedClass = () => {
    if (speed === 'normal') return 'ticker-continuous-track-normal';
    if (speed === 'fast') return 'ticker-continuous-track-fast';
    return '';
  };

  const renderMarqueeItems = (loopKeyPrefix: string) => (
    <>
      {PLANS.map((plan) => (
        <div
          key={`${loopKeyPrefix}-${plan.id}`}
          className="inline-flex items-center px-4 sm:px-6 shrink-0 font-bold text-xs sm:text-sm whitespace-nowrap"
        >
          <span className="text-white font-bold tracking-wide">
            <span className="text-amber-400 font-black">{plan.code}: {plan.name}</span>
            {' '}— ₹{plan.price} {plan.id === 1 ? 'Verification Pass' : plan.tagline} ➔{' '}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-xs shadow-md mx-1 tracking-wide">
              ⚡ ₹{plan.instantPayout} ({plan.percentage}%) INSTANT PAYOUT
            </span>
          </span>
          {currentUser ? (
            <button
              type="button"
              onClick={() => onOpenSponsorAddMember?.(plan.id)}
              className="ml-2.5 btn-3d-rainbow text-black font-black text-[10.5px] px-3 py-1 rounded-full border border-black/30 inline-flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-md select-none"
            >
              <span>सदस्य जोड़ें</span>
              <ChevronRight className="w-3 h-3 text-black stroke-[3]" />
            </button>
          ) : onOpenRegister ? (
            <button
              type="button"
              onClick={() => onOpenRegister(plan.id)}
              className="ml-2.5 btn-3d-rainbow text-black font-black text-[10.5px] px-3 py-1 rounded-full border border-black/30 inline-flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-md select-none"
            >
              <span>JOIN NOW</span>
              <ChevronRight className="w-3 h-3 text-black stroke-[3]" />
            </button>
          ) : (
            <a
              href={OFFICIAL_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2.5 btn-3d-rainbow text-black font-black text-[10.5px] px-3 py-1 rounded-full border border-black/30 inline-flex items-center gap-1 transition active:scale-95 shadow-md select-none"
            >
              <span>JOIN NOW</span>
              <ChevronRight className="w-3 h-3 text-black stroke-[3]" />
            </a>
          )}
          <span className="mx-4 sm:mx-6 text-amber-500/80 font-black text-sm">•</span>
        </div>
      ))}
    </>
  );

  return (
    <div 
      id="live-news-ticker-container" 
      className="bg-[#030712] border-t border-b border-amber-500/50 select-none w-full relative z-30"
    >
      {/* Top Control Bar */}
        <div className="flex items-center justify-between px-2.5 sm:px-4 py-1.5 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-300 gap-1.5 sm:gap-2">
          {/* Announcement Title Badge (Clean, No Ellipsis) */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] shrink-0 animate-pulse" />
            <span className="font-black text-amber-400 tracking-wide uppercase text-[11px] sm:text-xs whitespace-nowrap">
              📢 आधिकारिक घोषणा
            </span>
            <span className="hidden sm:inline-flex bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 text-slate-950 text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap shrink-0">
              ⚡ 50%-70% पेआउट
            </span>
          </div>

          {/* Controls: Prev/Next, Pause, and View Switcher */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* View Mode Toggle: Clean & Compact */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[9.5px] sm:text-[10px]">
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`px-1.5 sm:px-2 py-0.5 rounded-md font-black transition cursor-pointer flex items-center gap-0.5 ${
                  viewMode === 'card'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="पढ़ने में सबसे आसान - कार्ड मोड"
              >
                <span>कार्ड</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('marquee')}
                className={`px-1.5 sm:px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                  viewMode === 'marquee'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="स्क्रॉलिंग पट्टी"
              >
                <span>स्क्रॉल</span>
              </button>
            </div>

            {/* In Card Mode: Next & Prev Arrows + Counter + Pause */}
            {viewMode === 'card' ? (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="h-7 w-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-300 border border-slate-700 transition cursor-pointer active:scale-90 flex items-center justify-center shrink-0"
                  title="पिछली घोषणा"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <span className="text-[10px] font-black text-amber-300 font-mono px-1 shrink-0">
                  {currentSlideIndex + 1}/{PLANS.length}
                </span>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="h-7 w-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-300 border border-slate-700 transition cursor-pointer active:scale-90 flex items-center justify-center shrink-0"
                  title="अगली घोषणा"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className={`h-7 w-7 rounded-lg border transition cursor-pointer active:scale-90 flex items-center justify-center shrink-0 ${
                    isPaused 
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black' 
                      : 'bg-slate-900 text-slate-200 border-slate-700 hover:text-white'
                  }`}
                  title={isPaused ? "शुरू करें" : "रोक कर पढ़ें"}
                >
                  {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                </button>
              </div>
            ) : (
              /* In Marquee Mode: Pause/Play & Speed */
              <button
                type="button"
                onClick={() => setSpeed(speed === 'paused' ? 'slow' : 'paused')}
                className={`h-7 px-2 rounded-lg text-[10px] font-black flex items-center gap-1 border transition cursor-pointer active:scale-95 ${
                  speed === 'paused'
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-900 text-slate-200 border-slate-700 hover:text-white'
                }`}
              >
                {speed === 'paused' ? <Play className="w-3 h-3 text-slate-950" /> : <Pause className="w-3 h-3 text-amber-400" />}
                <span>{speed === 'paused' ? 'शुरू' : 'रोकें'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: EASY-TO-READ SLIDE CARD (HIGH CONTRAST & ZERO CUTOFF)             */}
        {/* ========================================================================= */}
        {viewMode === 'card' ? (
          <div 
            className="px-3 sm:px-6 py-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-2.5 transition-all duration-300 border-t border-slate-900"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
          >
            {/* Announcement Message Content (No Text Truncate on Mobile) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-md shrink-0">
                {activePlan.code}
              </span>

              <span className="text-xs sm:text-sm font-black text-white">
                <span className="text-amber-300">{activePlan.name}</span>
                <span className="text-slate-300 ml-1.5 font-bold">फीस ₹{activePlan.price}</span>
              </span>

              {/* Instant Payout Badge */}
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-xs font-black shrink-0">
                <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                <span>₹{activePlan.instantPayout} ({activePlan.percentage}%) तुरंत पेआउट</span>
              </span>
            </div>

            {/* Direct Action Button (Responsive Width) */}
            <div className="shrink-0 flex items-center justify-end w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  if (currentUser && onOpenSponsorAddMember) onOpenSponsorAddMember(activePlan.id);
                  else onOpenRegister?.(activePlan.id);
                }}
                className="btn-3d-rainbow-special w-full md:w-auto px-4 py-2 rounded-xl font-black text-xs text-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
              >
                <span>
                  {currentUser
                    ? `अपने स्पॉन्सर से जोड़ें (₹${activePlan.price})`
                    : `ज्वाइन करें (₹${activePlan.price})`}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-black stroke-[3]" />
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: CONTINUOUS HARDWARE MARQUEE TRACK (PAUSES ON TOUCH/HOVER)         */
          /* ========================================================================= */
          <div 
            className="ticker-viewport bg-[#020617] py-2 select-none hover:cursor-pointer"
            onMouseEnter={() => setSpeed('paused')}
            onMouseLeave={() => setSpeed('slow')}
            onTouchStart={() => setSpeed('paused')}
          >
            <div className={`ticker-continuous-track ${speed === 'paused' ? 'ticker-is-paused' : ''} ${getSpeedClass()}`}>
              <div className="flex shrink-0 items-center">
                {renderMarqueeItems('track1')}
              </div>
              <div className="flex shrink-0 items-center" aria-hidden="true">
                {renderMarqueeItems('track2')}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
