import React, { useState } from 'react';
import { PLANS, OFFICIAL_FORM_URL } from '../data/plansData';
import { TickerSpeed } from '../types';
import { Play, Pause, ChevronRight } from 'lucide-react';

interface TickerBarProps {
  onOpenRegister?: (planId?: number) => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({ onOpenRegister }) => {
  // Announcements run continuously by default with silky-smooth 60-120FPS GPU translation
  const [speed, setSpeed] = useState<TickerSpeed>('slow');

  const getSlideTrackClass = () => {
    let base = 'ticker-slide-track';
    if (speed === 'normal') base += ' ticker-slide-track-normal';
    if (speed === 'fast') base += ' ticker-slide-track-fast';
    return base;
  };

  const renderTickerItems = (loopKeyPrefix: string) => (
    <>
      {PLANS.map((plan) => (
        <div
          key={`${loopKeyPrefix}-${plan.id}`}
          className="inline-flex items-center px-4 sm:px-6 shrink-0 font-bold text-xs sm:text-sm whitespace-nowrap"
        >
          <span className="text-white font-bold tracking-wide">
            <span className="text-amber-400 font-black">{plan.code}: {plan.name}</span>
            {' '}— ₹{plan.price} {plan.id === 1 ? 'Verification Pass' : plan.tagline} ➔{' '}
            {/* Blazing High-Contrast 50%-70% Instant Payout Badge */}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-xs shadow-md mx-1 tracking-wide">
              ⚡ ₹{plan.instantPayout} ({plan.percentage}%) INSTANT PAYOUT
            </span>
          </span>
          {onOpenRegister ? (
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
    <>
      {/* ================= FIXED LOCKED ANNOUNCEMENT TICKER (ZERO PAGE SCROLL) ================= */}
      {/* Solid high-performance background (NO backdrop-filter) for stutter-free 60fps rendering */}
      <div 
        id="live-news-ticker-container" 
        className="bg-[#030712] border-b-2 border-amber-500/80 fixed top-[89px] md:top-[56px] left-0 right-0 z-40 shadow-2xl select-none w-full"
      >
        {/* Top Announcement Bar Header */}
        <div className="flex items-center justify-between px-2 sm:px-4 py-1 sm:py-1.5 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-300 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] shrink-0 animate-pulse" />
            <span className="font-black text-amber-400 tracking-wider uppercase text-[10px] sm:text-xs whitespace-nowrap truncate">
              📢 आधिकारिक घोषणा (OFFICIAL ANNOUNCEMENTS)
            </span>
            <span className="inline-flex bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 text-slate-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap shrink-0">
              ⚡ 50% से 70% सीधा पेआउट
            </span>
            <span className="hidden md:inline text-slate-500 shrink-0">| गति:</span>
          </div>

          {/* Speed Controls (Pause/Play & Slow/Normal/Fast) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              id="ticker-pause-btn"
              type="button"
              onClick={() => setSpeed(speed === 'paused' ? 'slow' : 'paused')}
              className={`px-2 py-0.5 sm:py-1 rounded-lg text-[10px] font-black flex items-center gap-1 border transition cursor-pointer active:scale-95 shadow-sm ${
                speed === 'paused'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="रोकें या शुरू करें"
            >
              {speed === 'paused' ? <Play className="w-3 h-3 text-slate-950" /> : <Pause className="w-3 h-3 text-amber-400" />}
              <span>{speed === 'paused' ? 'प्ले' : 'पॉज़'}</span>
            </button>

            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px]">
              <button
                type="button"
                onClick={() => setSpeed('slow')}
                className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                  speed === 'slow' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'text-slate-400 hover:text-white'
                }`}
              >
                धीमी
              </button>
              <button
                type="button"
                onClick={() => setSpeed('normal')}
                className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                  speed === 'normal' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'text-slate-400 hover:text-white'
                }`}
              >
                सामान्य
              </button>
              <button
                type="button"
                onClick={() => setSpeed('fast')}
                className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                  speed === 'fast' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'text-slate-400 hover:text-white'
                }`}
              >
                तेज
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Silky Smooth 60FPS Dual-Track Hardware-Accelerated Marquee Container      */}
        {/* ========================================================================= */}
        <div
          className={`ticker-wrapper overflow-hidden py-2 bg-[#020617] select-none flex ${
            speed === 'paused' ? 'ticker-paused' : ''
          }`}
        >
          {/* Track 1 */}
          <div className={getSlideTrackClass()}>
            {renderTickerItems('track1')}
          </div>

          {/* Track 2 (Duplicate for Seamless Infinite Marquee) */}
          <div className={getSlideTrackClass()} aria-hidden="true">
            {renderTickerItems('track2')}
          </div>
        </div>
      </div>

      {/* Spacer div to account for fixed header + ticker height so page content never overlaps */}
      <div className="h-[152px] md:h-[118px] w-full shrink-0 select-none pointer-events-none" aria-hidden="true" />
    </>
  );
};
