import React, { useState } from 'react';
import { PLANS, OFFICIAL_FORM_URL } from '../data/plansData';
import { TickerSpeed } from '../types';
import { Play, Pause, ChevronRight } from 'lucide-react';

interface TickerBarProps {
  onOpenRegister?: (planId?: number) => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({ onOpenRegister }) => {
  // Announcements run continuously by default
  const [speed, setSpeed] = useState<TickerSpeed>('slow');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const getTrackClass = () => {
    if (speed === 'paused' || isHovered) {
      return 'ticker-track-slow ticker-paused';
    }
    if (speed === 'slow') return 'ticker-track-slow';
    if (speed === 'normal') return 'ticker-track-normal';
    if (speed === 'fast') return 'ticker-track-fast';
    return 'ticker-track-slow';
  };

  return (
    <>
      {/* ================= FIXED LOCKED ANNOUNCEMENT TICKER (ZERO PAGE SCROLL) ================= */}
      <div 
        id="live-news-ticker-container" 
        className="bg-black/98 border-b-2 border-amber-500/80 fixed top-[50px] sm:top-[58px] left-0 right-0 z-40 shadow-2xl select-none w-full backdrop-blur-xl"
      >
        {/* Top Announcement Bar Header */}
        <div className="flex items-center justify-between px-2 sm:px-4 py-1.5 bg-slate-950/90 border-b border-slate-800 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-black text-amber-400 tracking-wider uppercase text-[10px] sm:text-xs whitespace-nowrap">
              📢 आधिकारिक घोषणा (OFFICIAL ANNOUNCEMENTS)
            </span>
            <span className="hidden md:inline text-slate-500">| गति नियंत्रित करें:</span>
          </div>

          {/* Speed Controls (Pause/Play & Slow/Normal/Fast) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="ticker-pause-btn"
              type="button"
              onClick={() => setSpeed(speed === 'paused' ? 'slow' : 'paused')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border transition cursor-pointer ${
                speed === 'paused' || isHovered
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="रोकें या शुरू करें"
            >
              {speed === 'paused' ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              <span>{speed === 'paused' ? 'प्ले' : 'पॉज़'}</span>
            </button>

            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-[10px]">
              <button
                type="button"
                onClick={() => setSpeed('slow')}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  speed === 'slow' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                धीमी
              </button>
              <button
                type="button"
                onClick={() => setSpeed('normal')}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  speed === 'normal' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                सामान्य
              </button>
              <button
                type="button"
                onClick={() => setSpeed('fast')}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  speed === 'fast' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                तेज
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Continuously Running Announcement Marquee Track (Smooth Continuous Loop) */}
        {/* ========================================================================= */}
        <div
          className="overflow-hidden py-2.5 bg-black"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={getTrackClass()}>
            {/* Loop 1 */}
            {PLANS.map((plan) => (
              <div
                key={`ticker-1-${plan.id}`}
                className="inline-flex items-center px-6 sm:px-10 shrink-0 font-black text-xs sm:text-sm"
              >
                <span className="tiranga-text font-black tracking-wide">
                  {plan.code}: {plan.name} - ₹{plan.price} {plan.id === 1 ? 'Verification Pass' : plan.tagline} ➔ ₹{plan.instantPayout} Instant Payout per Referral ({plan.percentage}%)
                </span>
                {onOpenRegister ? (
                  <button
                    type="button"
                    onClick={() => onOpenRegister(plan.id)}
                    className="ml-3 bg-green-600 hover:bg-green-500 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-[0_0_12px_rgba(22,163,74,0.6)] border border-white/40 tracking-wider inline-flex items-center gap-1 transition transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>JOIN NOW</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                ) : (
                  <a
                    href={OFFICIAL_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 bg-green-600 hover:bg-green-500 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-[0_0_12px_rgba(22,163,74,0.6)] border border-white/40 tracking-wider inline-flex items-center gap-1 transition transform hover:scale-105 active:scale-95"
                  >
                    <span>JOIN NOW</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </a>
                )}
                <span className="mx-6 text-amber-500/60 font-black">•</span>
              </div>
            ))}

            {/* Loop 2 for Seamless Infinite Running */}
            {PLANS.map((plan) => (
              <div
                key={`ticker-2-${plan.id}`}
                className="inline-flex items-center px-6 sm:px-10 shrink-0 font-black text-xs sm:text-sm"
              >
                <span className="tiranga-text font-black tracking-wide">
                  {plan.code}: {plan.name} - ₹{plan.price} {plan.id === 1 ? 'Verification Pass' : plan.tagline} ➔ ₹{plan.instantPayout} Instant Payout per Referral ({plan.percentage}%)
                </span>
                {onOpenRegister ? (
                  <button
                    type="button"
                    onClick={() => onOpenRegister(plan.id)}
                    className="ml-3 bg-green-600 hover:bg-green-500 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-[0_0_12px_rgba(22,163,74,0.6)] border border-white/40 tracking-wider inline-flex items-center gap-1 transition transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>JOIN NOW</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                ) : (
                  <a
                    href={OFFICIAL_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 bg-green-600 hover:bg-green-500 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-[0_0_12px_rgba(22,163,74,0.6)] border border-white/40 tracking-wider inline-flex items-center gap-1 transition transform hover:scale-105 active:scale-95"
                  >
                    <span>JOIN NOW</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                  </a>
                )}
                <span className="mx-6 text-amber-500/60 font-black">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer div to account for fixed ticker height so page content never overlaps */}
      <div className="h-[60px] sm:h-[66px] w-full shrink-0 select-none pointer-events-none" aria-hidden="true" />
    </>
  );
};
