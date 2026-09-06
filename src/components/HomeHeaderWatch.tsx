import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles, ShieldCheck, MapPin } from 'lucide-react';

export const HomeHeaderWatch: React.FC = () => {
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
  const dayOfMonth = time.getDate();

  // Angular calculations (Center: 120, 120)
  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const day24Deg = (hours * 15) + (minutes * 0.25);

  const digitalTimeStr = time.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const [timeDigits, ampm] = digitalTimeStr.split(' ');

  const hindiDateStr = time.toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const englishDateStr = time.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Dynamic greeting based on hour
  let greeting = 'नमस्ते (Welcome to IOIS)';
  let greetingIcon = '🇮🇳';
  if (hours >= 4 && hours < 12) {
    greeting = 'शुभ प्रभात (Good Morning)';
    greetingIcon = '🌅';
  } else if (hours >= 12 && hours < 17) {
    greeting = 'शुभ दोपहर (Good Afternoon)';
    greetingIcon = '☀️';
  } else if (hours >= 17 && hours < 21) {
    greeting = 'शुभ संध्या (Good Evening)';
    greetingIcon = '🌆';
  } else {
    greeting = 'शुभ रात्रि (Good Night)';
    greetingIcon = '🌙';
  }

  // 12 Main Hour Indices (Centered on 120, 120 with radius 78)
  const numbers = [
    { num: '12', angle: 0 },
    { num: '1', angle: 30 },
    { num: '2', angle: 60 },
    { num: '3', angle: 90 },
    { num: '4', angle: 120 },
    { num: '5', angle: 150 },
    { num: '6', angle: 180 },
    { num: '7', angle: 210 },
    { num: '8', angle: 240 },
    { num: '9', angle: 270 },
    { num: '10', angle: 300 },
    { num: '11', angle: 330 },
  ];

  // 60 Minute Ticks around Dial (Radius 96 to 90)
  const minuteTicks = Array.from({ length: 60 }).map((_, i) => {
    const isHour = i % 5 === 0;
    const angle = i * 6;
    const r1 = 96;
    const r2 = isHour ? 86 : 91;
    const rad = (angle - 90) * (Math.PI / 180);
    const x1 = 120 + r1 * Math.cos(rad);
    const y1 = 120 + r1 * Math.sin(rad);
    const x2 = 120 + r2 * Math.cos(rad);
    const y2 = 120 + r2 * Math.sin(rad);
    return { x1, y1, x2, y2, isHour, angle };
  });

  // 60 Fluted Bezel Facets
  const flutedFacets = Array.from({ length: 60 }).map((_, i) => {
    const angle = i * 6;
    const r1 = 115;
    const r2 = 104;
    const rad = (angle - 90) * (Math.PI / 180);
    const x1 = 120 + r1 * Math.cos(rad);
    const y1 = 120 + r1 * Math.sin(rad);
    const x2 = 120 + r2 * Math.cos(rad);
    const y2 = 120 + r2 * Math.sin(rad);
    return { x1, y1, x2, y2, angle };
  });

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Background radial soft aura */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Luxury Analog Chronometer & Live Date Info */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 w-full lg:w-auto">
          
          {/* Custom Crafted Circular Luxury IOIS Watch */}
          <div className="relative flex flex-col items-center flex-shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 relative drop-shadow-[0_12px_30px_rgba(0,0,0,0.9)]">
              <svg
                viewBox="0 0 240 240"
                className="w-full h-full select-none"
              >
                <defs>
                  {/* Luxury 24K Gold Fluted Bezel Gradient */}
                  <linearGradient id="goldFluted" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF1B8" />
                    <stop offset="20%" stopColor="#DFBA58" />
                    <stop offset="40%" stopColor="#8C6510" />
                    <stop offset="60%" stopColor="#FFF5C2" />
                    <stop offset="80%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#7A5600" />
                  </linearGradient>

                  {/* Brushed Platinum Ring */}
                  <linearGradient id="platinumRing" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="30%" stopColor="#94A3B8" />
                    <stop offset="70%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#1E293B" />
                  </linearGradient>

                  {/* Obsidian Sunburst Dial Face */}
                  <radialGradient id="sunburstDial" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="45%" stopColor="#0F172A" />
                    <stop offset="85%" stopColor="#020617" />
                    <stop offset="100%" stopColor="#000000" />
                  </radialGradient>

                  {/* Indian Tricolor Ring */}
                  <linearGradient id="tricolorAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF9933" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#138808" />
                  </linearGradient>

                  {/* Subdial Background Gradient */}
                  <radialGradient id="subdialBg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#020617" />
                  </radialGradient>

                  {/* Hand Drop Shadow */}
                  <filter id="luxuryHandShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.9" />
                  </filter>
                </defs>

                {/* 1. Outer Case Fluted Solid Base */}
                <circle
                  cx="120"
                  cy="120"
                  r="115"
                  fill="url(#goldFluted)"
                  stroke="#5A3E00"
                  strokeWidth="1.5"
                />

                {/* 2. Fluted Bezel Micro-Grooves (60 Facets) */}
                {flutedFacets.map((facet, idx) => (
                  <line
                    key={idx}
                    x1={facet.x1}
                    y1={facet.y1}
                    x2={facet.x2}
                    y2={facet.y2}
                    stroke={idx % 2 === 0 ? '#FFF5C2' : '#7A5600'}
                    strokeWidth="1.2"
                    opacity="0.85"
                  />
                ))}

                {/* 3. Inner Platinum Trim Ring */}
                <circle
                  cx="120"
                  cy="120"
                  r="103"
                  fill="none"
                  stroke="url(#platinumRing)"
                  strokeWidth="2.5"
                />

                {/* 4. Tricolor Subtle Glory Ring */}
                <circle
                  cx="120"
                  cy="120"
                  r="100"
                  fill="none"
                  stroke="url(#tricolorAccent)"
                  strokeWidth="1.5"
                  opacity="0.85"
                />

                {/* 5. Deep Obsidian Sunburst Dial */}
                <circle
                  cx="120"
                  cy="120"
                  r="98"
                  fill="url(#sunburstDial)"
                />

                {/* Guilloche Concentric Texture Rings */}
                <circle cx="120" cy="120" r="76" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="1.5 3" opacity="0.4" />
                <circle cx="120" cy="120" r="54" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="1.5 3" opacity="0.3" />

                {/* 6. Subdial: 24-Hr Day/Night Register (at Left / 9 o'clock) */}
                <g transform="translate(84, 120)">
                  <circle cx="0" cy="0" r="17" fill="url(#subdialBg)" stroke="#D4AF37" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="14" fill="none" stroke="#334155" strokeWidth="0.4" strokeDasharray="1 2" />
                  {/* Sun / Moon Mini Graphic */}
                  <text x="0" y="-6" textAnchor="middle" fontSize="4.5" fill="#FBBF24" fontWeight="bold">☀️ 24H</text>
                  <text x="0" y="10" textAnchor="middle" fontSize="4" fill="#38BDF8" fontWeight="bold">🌙 IST</text>
                  {/* 24H Subdial Hand */}
                  <g transform={`rotate(${day24Deg} 0 0)`}>
                    <line x1="0" y1="0" x2="0" y2="-11" stroke="#FDE047" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="1.8" fill="#D4AF37" />
                  </g>
                </g>

                {/* 7. Subdial: Seconds Register (at Bottom / 6 o'clock) */}
                <g transform="translate(120, 154)">
                  <circle cx="0" cy="0" r="16" fill="url(#subdialBg)" stroke="#D4AF37" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="13" fill="none" stroke="#334155" strokeWidth="0.4" strokeDasharray="1 2" />
                  <text x="0" y="-6" textAnchor="middle" fontSize="3.5" fill="#94A3B8" fontWeight="bold">60</text>
                  <text x="0" y="8" textAnchor="middle" fontSize="3.5" fill="#94A3B8" fontWeight="bold">30</text>
                  {/* Sub-seconds hand */}
                  <g transform={`rotate(${secDeg} 0 0)`}>
                    <line x1="0" y1="2" x2="0" y2="-10" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="1.5" fill="#EF4444" />
                  </g>
                </g>

                {/* 8. 60 Minute & 12 Hour Ticks */}
                {minuteTicks.map((tick, idx) => (
                  <line
                    key={idx}
                    x1={tick.x1}
                    y1={tick.y1}
                    x2={tick.x2}
                    y2={tick.y2}
                    stroke={tick.isHour ? '#FFD700' : '#64748B'}
                    strokeWidth={tick.isHour ? '2.2' : '0.8'}
                    strokeLinecap="round"
                    opacity={tick.isHour ? '1' : '0.5'}
                  />
                ))}

                {/* 9. Upright Luxury 3D Hour Numbers (All 12 Numbers: 1 through 12) */}
                {numbers.map((item) => {
                  const rad = (item.angle - 90) * (Math.PI / 180);
                  const radius = 79;
                  const x = 120 + radius * Math.cos(rad);
                  const y = 120 + radius * Math.sin(rad) + 4.5;
                  const isCardinal = item.num === '12' || item.num === '3' || item.num === '6' || item.num === '9';
                  return (
                    <g key={item.num}>
                      {isCardinal && (
                        <circle
                          cx={x}
                          cy={y - 4}
                          r="9.5"
                          fill="#020617"
                          stroke="#F59E0B"
                          strokeWidth="1.2"
                          className="drop-shadow-md"
                        />
                      )}
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isCardinal ? '#FFD700' : '#F1F5F9'}
                        fontSize={isCardinal ? '13' : '11'}
                        fontWeight="900"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        className="drop-shadow-[0_1px_3px_rgba(0,0,0,1)]"
                      >
                        {item.num}
                      </text>
                    </g>
                  );
                })}

                {/* 10. PROMINENT "IOIS INDIA" BRANDING INSIGNIA (Under 12) */}
                <g transform="translate(120, 68)">
                  <path
                    d="M-6 -6 L0 -10 L6 -6 L4 0 L-4 0 Z"
                    fill="#F59E0B"
                  />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fill="#FFD700"
                    fontSize="11"
                    fontWeight="900"
                    fontFamily="serif"
                    letterSpacing="1.5"
                  >
                    IOIS INDIA
                  </text>
                  <text
                    x="0"
                    y="12"
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="4.5"
                    fontWeight="800"
                    letterSpacing="1"
                  >
                    CHRONOMETER • 100M
                  </text>
                </g>

                {/* 11. Date Magnifier Cyclops Window at 3 o'clock */}
                <g transform="translate(142, 112)">
                  <rect
                    x="0"
                    y="0"
                    width="17"
                    height="15"
                    rx="3"
                    fill="#020617"
                    stroke="#D4AF37"
                    strokeWidth="1.2"
                  />
                  <rect
                    x="1"
                    y="1"
                    width="15"
                    height="13"
                    rx="2"
                    fill="#0F172A"
                  />
                  <text
                    x="8.5"
                    y="10.5"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="8.5"
                    fontWeight="900"
                    fontFamily="monospace"
                  >
                    {dayOfMonth}
                  </text>
                </g>

                {/* 12. Faceted Gold Hour Hand */}
                <g
                  transform={`rotate(${hourDeg} 120 120)`}
                  filter="url(#luxuryHandShadow)"
                >
                  <polygon
                    points="117,120 120,66 123,120 121.5,134 118.5,134"
                    fill="url(#goldFluted)"
                    stroke="#5A3E00"
                    strokeWidth="0.8"
                  />
                  <line x1="120" y1="72" x2="120" y2="112" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* 13. Luminous Steel Minute Hand */}
                <g
                  transform={`rotate(${minDeg} 120 120)`}
                  filter="url(#luxuryHandShadow)"
                >
                  <polygon
                    points="117.5,120 120,38 122.5,120 121,138 119,138"
                    fill="#E2E8F0"
                    stroke="#475569"
                    strokeWidth="0.8"
                  />
                  <line x1="120" y1="44" x2="120" y2="112" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* 14. Sweeping Crimson-Red Second Needle */}
                <g
                  transform={`rotate(${secDeg} 120 120)`}
                  filter="url(#luxuryHandShadow)"
                >
                  <line x1="120" y1="140" x2="120" y2="28" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
                  <polygon points="120,22 118,30 122,30" fill="#EF4444" />
                  <circle cx="120" cy="132" r="3.5" fill="#FFD700" stroke="#EF4444" strokeWidth="1" />
                </g>

                {/* 15. Center Gold Cap & Jewel */}
                <circle cx="120" cy="120" r="5" fill="url(#goldFluted)" stroke="#5A3E00" strokeWidth="0.8" />
                <circle cx="120" cy="120" r="2" fill="#EF4444" />

                {/* 16. Sapphire Glass Highlight Glare */}
                <path
                  d="M 45 95 Q 120 45 195 95 Q 120 75 45 95 Z"
                  fill="#FFFFFF"
                  opacity="0.12"
                  pointerEvents="none"
                />
              </svg>
            </div>

            <div className="mt-1 text-center">
              <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
                ● LIVE IST 2026
              </span>
            </div>
          </div>

          {/* Time & Date Display Text */}
          <div className="text-center sm:text-left space-y-1.5 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xl sm:text-2xl">{greetingIcon}</span>
              <span className="text-xs sm:text-sm font-black text-amber-300">
                {greeting}
              </span>
            </div>

            <div className="flex items-baseline justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-mono drop-shadow-md">
                {timeDigits}
              </span>
              <span className="text-base sm:text-lg font-black text-amber-400 uppercase tracking-wider">
                {ampm} <span className="text-xs text-slate-400 font-bold">IST</span>
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 space-y-0.5">
              <div className="font-semibold text-slate-200 flex items-center justify-center sm:justify-start gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{hindiDateStr}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>भारतीय मानक समय (IST +5:30) • राष्ट्रीय पोर्टल</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Smart Platform Highlights & Quick Status Badges */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-stretch justify-center gap-2.5 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
          
          <div className="flex items-center gap-3 p-2.5 bg-slate-900/90 rounded-2xl border border-amber-500/30 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">इंस्टेंट पेआउट 2026</p>
              <p className="text-xs font-black text-amber-300">50% से 70% तुरंत UPI पेआउट</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 bg-slate-900/90 rounded-2xl border border-emerald-500/30 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">डिजिटल सुरक्षा व सहायता</p>
              <p className="text-xs font-black text-emerald-300">100% वेरिफाइड 24x7 हेल्पलाइन</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
