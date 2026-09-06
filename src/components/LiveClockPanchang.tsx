import React, { useState, useEffect } from 'react';
import { Clock, Sun, Sparkles, Tv, Calendar } from 'lucide-react';

export const LiveClockPanchang: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  const digitalTimeStr = time.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const hindiDateStr = time.toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section id="live-utilities" className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* 1. Live System Analog & Digital Clock */}
      <div className="glass-card-premium text-center p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h3 className="gold-metallic-text font-black uppercase text-sm sm:text-base tracking-wider">
            Live System Clock
          </h3>
        </div>

        {/* Perfect Vector Circle IOIS INDIA Clock */}
        <div className="w-36 h-36 mx-auto relative drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
          <svg viewBox="0 0 200 200" className="w-full h-full select-none">
            <defs>
              <linearGradient id="pGoldBezel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFBA58" />
                <stop offset="25%" stopColor="#FFF2B2" />
                <stop offset="50%" stopColor="#B8860B" />
                <stop offset="75%" stopColor="#FFF6CC" />
                <stop offset="100%" stopColor="#8C6510" />
              </linearGradient>
              <linearGradient id="pSteelTrim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <radialGradient id="pDialBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="65%" stopColor="#050814" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
              <linearGradient id="pTricolorRim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF9933" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#138808" />
              </linearGradient>
            </defs>

            {/* Bezel */}
            <circle cx="100" cy="100" r="92" fill="url(#pGoldBezel)" stroke="#5e3a00" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="85" fill="none" stroke="url(#pSteelTrim)" strokeWidth="1" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="url(#pTricolorRim)" strokeWidth="1.5" opacity="0.8" />
            <circle cx="100" cy="100" r="80" fill="url(#pDialBg)" />

            {/* 12 Hour Numbers */}
            {[
              { num: '12', a: 0 }, { num: '1', a: 30 }, { num: '2', a: 60 },
              { num: '3', a: 90 }, { num: '4', a: 120 }, { num: '5', a: 150 },
              { num: '6', a: 180 }, { num: '7', a: 210 }, { num: '8', a: 240 },
              { num: '9', a: 270 }, { num: '10', a: 300 }, { num: '11', a: 330 }
            ].map(item => {
              const rad = (item.a - 90) * (Math.PI / 180);
              const x = 100 + 63 * Math.cos(rad);
              const y = 100 + 63 * Math.sin(rad) + 3.5;
              const isMain = item.num === '12' || item.num === '3' || item.num === '6' || item.num === '9';
              return (
                <text
                  key={item.num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isMain ? '#FEF08A' : '#E2E8F0'}
                  fontSize={isMain ? '12' : '10'}
                  fontWeight={isMain ? '900' : '700'}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {item.num}
                </text>
              );
            })}

            {/* IOIS INDIA Branding */}
            <g transform="translate(100, 54)">
              <path d="M-5 -6 L0 -9 L5 -6 L3 0 L-3 0 Z" fill="#F59E0B" />
              <text x="0" y="5" textAnchor="middle" fill="#FFD700" fontSize="9.5" fontWeight="900" fontFamily="serif" letterSpacing="1.2">
                IOIS INDIA
              </text>
              <text x="0" y="11.5" textAnchor="middle" fill="#94A3B8" fontSize="4" fontWeight="800" letterSpacing="0.8">
                CHRONOMETER 2026
              </text>
            </g>

            {/* Bottom Swavalamban Tag */}
            <g transform="translate(100, 140)">
              <text x="0" y="0" textAnchor="middle" fill="#38BDF8" fontSize="4.5" fontWeight="800" letterSpacing="1">
                SWAVALAMBAN
              </text>
              <text x="0" y="6" textAnchor="middle" fill="#4ADE80" fontSize="4" fontWeight="700" letterSpacing="0.5">
                IST • OFFICIAL
              </text>
            </g>

            {/* Hour Hand */}
            <g transform={`rotate(${hourDeg} 100 100)`}>
              <polygon points="97.5,100 100,55 102.5,100 101,110 99,110" fill="url(#pGoldBezel)" stroke="#5e3a00" strokeWidth="0.5" />
            </g>

            {/* Minute Hand */}
            <g transform={`rotate(${minDeg} 100 100)`}>
              <polygon points="98,100 100,32 102,100 101,114 99,114" fill="#E2E8F0" stroke="#475569" strokeWidth="0.5" />
            </g>

            {/* Second Hand */}
            <g transform={`rotate(${secDeg} 100 100)`}>
              <line x1="100" y1="118" x2="100" y2="24" stroke="#FF9933" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="100" cy="110" r="3.5" fill="#FF9933" />
            </g>

            {/* Center Cap */}
            <circle cx="100" cy="100" r="5" fill="url(#pGoldBezel)" stroke="#000" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="2.5" fill="#020617" />
            <circle cx="100" cy="100" r="1" fill="#FF9933" />
          </svg>
        </div>

        <div>
          <div id="live-digital-clock" className="text-3xl sm:text-4xl font-mono font-black text-white tracking-wider">
            {digitalTimeStr}
          </div>
          <div className="text-[11px] text-amber-400 mt-2 font-bold uppercase tracking-wide flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{hindiDateStr}</span>
          </div>
        </div>
      </div>

      {/* 2. Daily Panchang Card */}
      <div className="glass-card-premium p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-center gap-2 text-center">
          <Sun className="w-4 h-4 text-amber-400" />
          <h3 className="gold-metallic-text font-black uppercase text-sm sm:text-base tracking-wider">
            दैनिक पंचांग एवं शुभ मुहूर्त
          </h3>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-slate-200">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
            <span className="text-slate-400 font-medium">शुभ मुहूर्त:</span>
            <strong className="text-emerald-400 font-black">08:15 AM - 10:30 AM</strong>
          </div>
          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
            <span className="text-slate-400 font-medium">शुभ रंग:</span>
            <strong className="text-amber-400 font-black">पीला, केसरिया, सफेद</strong>
          </div>
          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
            <span className="text-slate-400 font-medium">आज का नक्षत्र:</span>
            <strong className="text-sky-300 font-black">पुष्य नक्षत्र (सफलता के लिए श्रेष्ठ)</strong>
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-amber-500/20 mt-4 text-xs text-slate-300 leading-relaxed space-y-1">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ज्योतिष एवं सफलता सूत्र:</span>
            </div>
            <p className="italic">
              आज डिजिटल स्किल और ज्ञान पर किया गया छोटा निवेश भविष्य में 100 गुना फल और आत्मनिर्भरता प्रदान करेगा।
            </p>
          </div>
        </div>
      </div>

      {/* 3. IOIS Smart TV Video Player */}
      <div className="glass-card-premium p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-center gap-2 text-center">
          <Tv className="w-4 h-4 text-amber-400" />
          <h3 className="gold-metallic-text font-black uppercase text-sm sm:text-base tracking-wider">
            IOIS SMART TV
          </h3>
        </div>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/0gYd3mIxksc"
            title="IOIS Official Training"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <p className="text-[11px] text-slate-400 text-center italic">
          आधिकारिक ट्यूटोरियल्स और लाइव सिस्टम ट्रेनिंग यहाँ देखें।
        </p>
      </div>
    </section>
  );
};
