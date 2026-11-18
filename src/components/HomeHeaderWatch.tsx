import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Coins,
  BookOpen,
  UserCheck,
  X,
  CheckCircle2,
  Clock,
  Calendar,
  LogIn,
  LayoutDashboard,
  UserPlus,
  Crown,
  CreditCard,
  GraduationCap,
  FileText,
  MessageCircle,
  Briefcase,
  Building2,
  CloudSun,
  Tv,
  Sun,
  MoonStar,
  Scale,
  Image as ImageIcon,
  PhoneCall,
  Calculator,
  Compass,
  Film,
  Bot,
} from 'lucide-react';
import { PageType, UserProfile } from '../types';
import { scrollAppToTop } from '../utils/scrollUtils';

type SystemTopicKey = 'overview' | 'plans' | 'benefits' | 'safety';

interface SystemTopicDetail {
  key: SystemTopicKey;
  shortLabel: string;
  compactLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  accentClass: string;
  points: string[];
  highlight: string;
}

const IOIS_SYSTEM_TOPICS: SystemTopicDetail[] = [
  {
    key: 'overview',
    shortLabel: 'IOIS क्या है?',
    compactLabel: 'IOIS क्या है?',
    title: 'IOIS INDIA — संपूर्ण डिजिटल स्वावलंबन व शिक्षा प्रणाली',
    subtitle: 'एक ही पोर्टल पर डिजिटल पहचान, शिक्षा, सरकारी सेवा मार्गदर्शन और वैध रेफरल आय।',
    badge: 'संपूर्ण परिचय',
    accentClass: 'border-amber-400/60 bg-amber-500/15 text-amber-200',
    points: [
      'मात्र ₹10 से ₹999 के वन-टाइम पैक में लाइफटाइम सदस्यता (कोई मासिक या छिपा शुल्क नहीं)।',
      'जुड़ते ही तुरंत आपका सत्यापित 3D डिजिटल ID कार्ड और पर्सनल रेफरल लिंक सक्रिय हो जाता है।',
      'सदस्य छात्रों व नागरिकों को NCERT नोट्स, RTPS सरकारी योजना गाइड और 24x7 सपोर्ट मिलता है।',
    ],
    highlight: '100% पारदर्शी, स्वदेशी और मोबाइल-फ्रेंडली डिजिटल सिस्टम',
  },
  {
    key: 'plans',
    shortLabel: '7 प्लांस • 70%',
    compactLabel: '70% प्लांस',
    title: '7 मास्टर प्लांस (₹10 से ₹999) — 50% से 70% तुरंत UPI पेआउट',
    subtitle: 'छोटी बचत से बड़ी शुरुआत — हर सत्यापित रेफरल पर सीधा आपके UPI में कमाई।',
    badge: 'आय व प्लांस',
    accentClass: 'border-emerald-400/60 bg-emerald-500/15 text-emerald-200',
    points: [
      'Plan 01 (₹10), Plan 02 (₹29), Plan 03 (₹49), Plan 04 (₹99), Plan 05 (₹199), Plan 06 (₹499), Plan 07 (₹999)।',
      'स्पॉन्सर रेफरल पर प्लान के अनुसार 50% से 70% तक सीधा दैनिक प्रोत्साहन (UPI/बैंक पेआउट)।',
      'सदस्य डैशबोर्ड में लाइव कमाई, टीम नेटवर्क, और पेआउट हिस्ट्री रियल-टाइम दिखती है।',
    ],
    highlight: 'फालतू खर्च रोकें • मात्र ₹10 से आत्मनिर्भर शुरुआत करें',
  },
  {
    key: 'benefits',
    shortLabel: 'ID • NCERT',
    compactLabel: 'ID•NCERT',
    title: 'डिजिटल ID कार्ड, Class 1–12 NCERT नोट्स व RTPS सरकारी सेवाएं',
    subtitle: 'विद्यार्थियों, युवाओं और परिवारों के लिए एक साथ शिक्षा + पहचान + योजना सहायता।',
    badge: 'सुविधाएं व सेवाएं',
    accentClass: 'border-sky-400/60 bg-sky-500/15 text-sky-200',
    points: [
      '3D ग्लो फ्रेम वाला प्रीमियम डिजिटल ID कार्ड QR वेरिफिकेशन व पब्लिक प्रोफाइल लिंक के साथ।',
      'Class 1 से 12 तक हिंदी व अंग्रेजी माध्यम NCERT अध्ययन सामग्री व छात्र टूल्स निःशुल्क।',
      'जाति, आय, निवास (RTPS), राशन, पैन, आयुष्मान व सरकारी योजनाओं की सटीक गाइड व लाइव पंचांग।',
    ],
    highlight: 'एक क्लिक में डाउनलोड, प्रिंट व प्रोफाइल शेयर करने योग्य सुविधाएं',
  },
  {
    key: 'safety',
    shortLabel: 'जुड़ें • सुरक्षा',
    compactLabel: 'जुड़ें • सुरक्षा',
    title: 'कैसे जुड़ें? (1 मिनट प्रक्रिया) व 100% डेटा सुरक्षा गारंटी',
    subtitle: 'किसी भी मोबाइल या कंप्यूटर से लॉगिन करें — आपका डेटा कभी डिलीट या गायब नहीं होता।',
    badge: 'सुरक्षा व सहायता',
    accentClass: 'border-purple-400/60 bg-purple-500/15 text-purple-200',
    points: [
      'रजिस्टर बटन दबाएं, अपना नाम, मोबाइल, स्पॉन्सर ID व पसंदीदा प्लान चुनें और UPI पेमेंट करें।',
      'एडमिन वेरिफिकेशन होते ही आपका खाता, ID कार्ड और डैशबोर्ड तुरंत चालू हो जाता है।',
      'मल्टी-डिवाइस क्लाउड सिंक व 24x7 हेल्प चैट (सपोर्ट टिकट) हर सदस्य के लिए उपलब्ध है।',
    ],
    highlight: 'हर डिवाइस पर समान अनुभव • पूर्ण सुरक्षित क्लाउड डेटा बैकअप',
  },
];

export interface HomeHeaderWatchProps {
  currentUser?: UserProfile | null;
  onNavigate?: (page: PageType) => void;
  onOpenLogin?: () => void;
  onOpenRegister?: (planId?: number) => void;
  onOpenSponsorAddMember?: (planId?: number) => void;
  onOpenChatHelp?: () => void;
  onOpenDashboard?: () => void;
  onOpenIdCard?: () => void;
  onOpenFestivalModal?: () => void;
  onOpenRashifalModal?: () => void;
  onOpenPhotoCompressor?: () => void;
  onOpenAiChat?: () => void;
}

interface SJewelButton {
  id: string;
  cx: number;
  cy: number;
  label: string;
  desc: string;
  icon: React.ReactNode;
  ringTone: string;
  onClick: () => void;
}

const WATCH_HOUR_NUMBERS = [
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

const WATCH_MINUTE_TICKS = Array.from({ length: 60 }).map((_, i) => {
  const isHour = i % 5 === 0;
  const angle = i * 6;
  const r1 = 96;
  const r2 = isHour ? 86 : 91;
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x1: 120 + r1 * Math.cos(rad),
    y1: 120 + r1 * Math.sin(rad),
    x2: 120 + r2 * Math.cos(rad),
    y2: 120 + r2 * Math.sin(rad),
    isHour,
  };
});

const WATCH_FLUTED_FACETS = Array.from({ length: 60 }).map((_, i) => {
  const angle = i * 6;
  const r1 = 115;
  const r2 = 104;
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x1: 120 + r1 * Math.cos(rad),
    y1: 120 + r1 * Math.sin(rad),
    x2: 120 + r2 * Math.cos(rad),
    y2: 120 + r2 * Math.sin(rad),
  };
});

const StaticODialLayers = React.memo(() => (
  <>
    <defs>
      <linearGradient id="goldFluted" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF5C8" />
        <stop offset="20%" stopColor="#E4BF5E" />
        <stop offset="40%" stopColor="#8C6510" />
        <stop offset="60%" stopColor="#FFF8D4" />
        <stop offset="80%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#7A5600" />
      </linearGradient>

      <linearGradient id="platinumRing" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="30%" stopColor="#94A3B8" />
        <stop offset="70%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>

      <radialGradient id="sunburstDial" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="45%" stopColor="#0F172A" />
        <stop offset="85%" stopColor="#020617" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>

      <linearGradient id="tricolorAccent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF9933" />
        <stop offset="50%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#138808" />
      </linearGradient>

      <radialGradient id="subdialBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#111C33" />
        <stop offset="100%" stopColor="#020617" />
      </radialGradient>

      <filter id="luxuryHandShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="1.5" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.9" />
      </filter>

      <filter id="goldenGlowText" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="0.9" floodColor="#F59E0B" floodOpacity="0.95" />
        <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="#D97706" floodOpacity="0.75" />
      </filter>

      <linearGradient id="royalCrownGold" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="25%" stopColor="#FDE047" />
        <stop offset="60%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>

    <circle cx="120" cy="120" r="115" fill="url(#goldFluted)" stroke="#5A3E00" strokeWidth="1.5" />

    {WATCH_FLUTED_FACETS.map((facet, idx) => (
      <line
        key={idx}
        x1={facet.x1}
        y1={facet.y1}
        x2={facet.x2}
        y2={facet.y2}
        stroke={idx % 2 === 0 ? '#FFF5C2' : '#7A5600'}
        strokeWidth="1.2"
        opacity="0.9"
      />
    ))}

    <circle cx="120" cy="120" r="103" fill="none" stroke="url(#platinumRing)" strokeWidth="2.5" />
    <circle cx="120" cy="120" r="100" fill="none" stroke="url(#tricolorAccent)" strokeWidth="1.6" opacity="0.92" />
    <circle cx="120" cy="120" r="98" fill="url(#sunburstDial)" />
    {/* Sapphire AR Blue-Champagne Edge Chamfer */}
    <circle cx="120" cy="120" r="97" fill="none" stroke="rgba(56,189,248,0.28)" strokeWidth="0.9" />

    {/* Guilloché Concentric Precision Rings */}
    <circle cx="120" cy="120" r="88" fill="none" stroke="#D4AF37" strokeWidth="0.45" opacity="0.34" />
    <circle cx="120" cy="120" r="76" fill="none" stroke="#475569" strokeWidth="0.6" strokeDasharray="1.5 3" opacity="0.45" />
    <circle cx="120" cy="120" r="54" fill="none" stroke="#475569" strokeWidth="0.5" strokeDasharray="1.5 3" opacity="0.35" />

    {WATCH_MINUTE_TICKS.map((tick, idx) => (
      <line
        key={idx}
        x1={tick.x1}
        y1={tick.y1}
        x2={tick.x2}
        y2={tick.y2}
        stroke={tick.isHour ? '#FFD700' : '#64748B'}
        strokeWidth={tick.isHour ? '2.2' : '0.8'}
        strokeLinecap="round"
        opacity={tick.isHour ? '1' : '0.55'}
      />
    ))}

    {WATCH_HOUR_NUMBERS.map((item) => {
      const rad = (item.angle - 90) * (Math.PI / 180);
      const radius = 79;
      const x = 120 + radius * Math.cos(rad);
      const y = 120 + radius * Math.sin(rad) + 4.5;
      const isCardinal = item.num === '12' || item.num === '3' || item.num === '6' || item.num === '9';
      return (
        <g key={item.num}>
          {isCardinal && (
            <circle cx={x} cy={y - 4} r="9.5" fill="#020617" stroke="#F59E0B" strokeWidth="1.2" />
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
          >
            {item.num}
          </text>
        </g>
      );
    })}

    {/* Static Royal Crown & IOIS INDIA Brand Text */}
    <g transform="translate(120, 68)">
      <g filter="url(#goldenGlowText)">
        <path
          d="M -11 -6 L -14 -16 L -7 -9.5 L 0 -19 L 7 -9.5 L 14 -16 L 11 -6 Z"
          fill="url(#royalCrownGold)"
          stroke="#FFE082"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <circle cx="-14" cy="-16" r="1.4" fill="#FFFBEB" stroke="#D97706" strokeWidth="0.5" />
        <circle cx="-7" cy="-9.5" r="1.2" fill="#FFFBEB" stroke="#D97706" strokeWidth="0.5" />
        <circle cx="0" cy="-19" r="1.8" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.6" />
        <circle cx="7" cy="-9.5" r="1.2" fill="#FFFBEB" stroke="#D97706" strokeWidth="0.5" />
        <circle cx="14" cy="-16" r="1.4" fill="#FFFBEB" stroke="#D97706" strokeWidth="0.5" />
        <rect x="-10" y="-6.2" width="20" height="2.2" rx="1" fill="url(#goldFluted)" stroke="#78350F" strokeWidth="0.5" />
      </g>

      <text
        x="0"
        y="6"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFD700"
        fontSize="9.2"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="1.6"
      >
        IOIS INDIA
      </text>
    </g>
  </>
));

const WatchChronometerStage = React.memo(({ letterSNode }: { letterSNode: React.ReactNode }) => {
  const [time, setTime] = useState<Date>(() => new Date());

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

  const hours12 = hours % 12 || 12;
  const hhStr = String(hours12).padStart(2, '0');
  const mmStr = String(minutes).padStart(2, '0');
  const ssStr = String(seconds).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const day24Deg = hours * 15 + minutes * 0.25;

  const monthShortEn = time.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const monthHindi = time.toLocaleDateString('hi-IN', { month: 'short' });
  const weekdayShortHi = time.toLocaleDateString('hi-IN', { weekday: 'short' });
  const yearStr = String(time.getFullYear());
  const dayPadded = String(dayOfMonth).padStart(2, '0');

  let greeting = 'नमस्ते • IOIS INDIA';
  let greetingIcon = '🇮🇳';
  if (hours >= 4 && hours < 12) {
    greeting = 'शुभ प्रभात';
    greetingIcon = '🌅';
  } else if (hours >= 12 && hours < 17) {
    greeting = 'शुभ दोपहर';
    greetingIcon = '☀️';
  } else if (hours >= 17 && hours < 21) {
    greeting = 'शुभ संध्या';
    greetingIcon = '🌆';
  } else {
    greeting = 'शुभ रात्रि';
    greetingIcon = '🌙';
  }

  return (
    <>
      {/* Top Unified Masthead — Precision Chronometer Header */}
      <div className="flex items-center justify-between gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-950/75 border border-amber-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-300/20 via-amber-500/15 to-slate-900 border border-amber-400/40 flex items-center justify-center text-xs sm:text-sm shrink-0 shadow-inner">
            {greetingIcon}
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10.5px] sm:text-xs font-black tracking-wide bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-200 bg-clip-text text-transparent truncate">
              {greeting}
            </span>
            <span aria-hidden="true" className="text-amber-500/50 text-[10px] hidden xs:inline">·</span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-300 truncate hidden xs:inline">
              IOIS INDIA लाइव क्रोनोमीटर
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700/70">
          <span className="text-[9.5px] sm:text-[11px] font-mono tabular-nums font-bold text-amber-200 tracking-wider">
            {hhStr}:{mmStr}:{ssStr} {ampm}
          </span>
          <span aria-hidden="true" className="text-slate-600 text-[10px]">|</span>
          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-300 tracking-wider">
            IST +5:30
          </span>
        </div>
      </div>

      {/* ========================================================================
          IDENTICAL CROSS-DEVICE HORIZONTAL MONUMENT:  [ I ]  [ O ]  [ I ]  [ S ]
          - Haute-Horology Smoked-Obsidian Exhibition Stage & 24K Gold Craftsmanship
      ========================================================================= */}
      <div className="relative my-0.5 py-3 sm:py-4 md:py-5 px-2 sm:px-4 rounded-xl sm:rounded-2xl bg-[radial-gradient(circle_at_50%_45%,rgba(245,158,11,0.16)_0%,rgba(15,23,42,0.88)_54%,rgba(2,6,23,0.98)_100%)] border border-amber-400/35 shadow-[inset_0_1px_0_rgba(255,245,200,0.2),inset_0_-18px_36px_rgba(0,0,0,0.72),0_14px_34px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Subtle Radial Stage Glow Behind Chronometer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 inset-y-1 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.2),rgba(16,185,129,0.08)_55%,transparent_75%)] blur-xl"
        />
        {/* Precision Architectural Watchmaker Backplate SVG (subtle concentric hairlines & cardinal ticks) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 260"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 w-full h-full opacity-30"
        >
          <defs>
            <linearGradient id="stageGoldLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(245,158,11,0)" />
              <stop offset="30%" stopColor="rgba(251,191,36,0.45)" />
              <stop offset="50%" stopColor="rgba(255,245,200,0.7)" />
              <stop offset="70%" stopColor="rgba(251,191,36,0.45)" />
              <stop offset="100%" stopColor="rgba(245,158,11,0)" />
            </linearGradient>
          </defs>
          <line x1="20" y1="24" x2="780" y2="24" stroke="url(#stageGoldLine)" strokeWidth="0.7" strokeDasharray="3 5" />
          <line x1="20" y1="236" x2="780" y2="236" stroke="url(#stageGoldLine)" strokeWidth="0.7" strokeDasharray="3 5" />
          <circle cx="348" cy="130" r="118" fill="none" stroke="rgba(251,191,36,0.28)" strokeWidth="0.8" strokeDasharray="2 6" />
          <circle cx="348" cy="130" r="142" fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="0.6" />
        </svg>

        <div className="relative z-10 mx-auto w-full max-w-[380px] sm:max-w-[560px] md:max-w-[680px] lg:max-w-[730px] grid grid-cols-[0.46fr_1.06fr_0.46fr_0.87fr] items-stretch gap-1.5 sm:gap-3 md:gap-4">
          {/* LETTER 1: "I" — DIGITAL CLOCK TOP-TO-BOTTOM INSIDE THE LETTER "I" */}
          <div
            className="relative flex flex-col items-center justify-between h-full select-none group"
            aria-label="Digital Clock inside letter I"
          >
            <div className="relative w-full h-5 sm:h-7 md:h-8 rounded-md sm:rounded-lg bg-gradient-to-b from-amber-100 via-amber-400 to-amber-700 border border-amber-200/95 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.85),inset_0_-1px_1px_rgba(120,53,15,0.6),0_5px_14px_rgba(245,158,11,0.38)] flex items-center justify-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 shrink-0 z-10">
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-amber-950/75 ring-1 ring-amber-100/50 hidden sm:block mr-auto" />
              <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-slate-950 shrink-0" />
              <span className="text-[7px] sm:text-[10px] md:text-xs font-black tracking-widest text-slate-950 uppercase truncate">
                TIME
              </span>
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-amber-950/75 ring-1 ring-amber-100/50 hidden sm:block ml-auto" />
            </div>

            <div className="relative w-[64%] sm:w-[60%] flex-1 -my-0.5 bg-gradient-to-b from-slate-900 via-[#030712] to-slate-900 border-x-2 border-amber-400/85 shadow-[inset_0_0_24px_rgba(0,0,0,0.95),inset_0_0_0_1px_rgba(251,191,36,0.28),0_0_18px_rgba(0,0,0,0.8)] flex flex-col items-center justify-evenly py-0.5 sm:py-1.5 px-0.5 text-center overflow-hidden">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-amber-400/[0.06]" />
              <div className="relative z-10 flex flex-col items-center leading-none">
                <span className="text-[5.5px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-widest">HR</span>
                <span className="text-[13px] sm:text-[22px] md:text-[27px] font-black font-mono tabular-nums text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.48)] leading-none">
                  {hhStr}
                </span>
              </div>
              <div className="relative z-10 w-4 sm:w-7 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-amber-300/90 to-transparent" />
              <div className="relative z-10 flex flex-col items-center leading-none">
                <span className="text-[5.5px] sm:text-[8px] font-bold text-amber-300/90 uppercase tracking-widest">MIN</span>
                <span className="text-[13px] sm:text-[22px] md:text-[27px] font-black font-mono tabular-nums text-amber-300 drop-shadow-[0_0_14px_rgba(245,158,11,0.65)] leading-none">
                  {mmStr}
                </span>
              </div>
              <div className="relative z-10 w-4 sm:w-7 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent" />
              <div className="relative z-10 flex flex-col items-center leading-none">
                <span className="text-[5.5px] sm:text-[8px] font-bold text-emerald-300/90 uppercase tracking-widest">SEC</span>
                <span className="text-[11px] sm:text-[18px] md:text-[22px] font-black font-mono tabular-nums text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] leading-none">
                  {ssStr}
                </span>
              </div>
            </div>

            <div className="relative w-full h-5 sm:h-7 md:h-8 rounded-md sm:rounded-lg bg-gradient-to-t from-amber-700 via-amber-500 to-amber-100 border border-amber-200/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(120,53,15,0.6),0_5px_14px_rgba(245,158,11,0.38)] flex items-center justify-center px-1.5 sm:px-2 shrink-0 z-10">
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-amber-950/75 ring-1 ring-amber-100/50 hidden sm:block mr-auto" />
              <span className="text-[7px] sm:text-[10px] md:text-xs font-black tracking-tight sm:tracking-wider text-slate-950 font-mono truncate">
                {ampm}•IST
              </span>
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-amber-950/75 ring-1 ring-amber-100/50 hidden sm:block ml-auto" />
            </div>
          </div>

          {/* LETTER 2: "O" — LUXURY CIRCULAR ANALOG CLOCK AS LETTER "O" */}
          <div className="relative flex items-center justify-center" aria-label="Analog Clock inside letter O">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[-2px] sm:right-[-4px] top-1/2 -translate-y-1/2 w-1.5 sm:w-2.5 h-5 sm:h-8 rounded-r-md bg-gradient-to-b from-amber-200 via-amber-500 to-amber-800 border border-amber-200/70 shadow-[0_0_8px_rgba(245,158,11,0.45)] z-0"
            />
            <div className="relative z-10 w-full aspect-square p-[3px] sm:p-1.5 rounded-full bg-gradient-to-b from-amber-300/25 via-slate-900/80 to-amber-600/25 border border-amber-300/35 shadow-[0_0_28px_rgba(245,158,11,0.22),0_14px_34px_rgba(0,0,0,0.95)]">
              <svg viewBox="0 0 240 240" className="w-full h-full select-none block">
                <StaticODialLayers />

                {/* 24-Hr Day/Night Subdial */}
                <g transform="translate(84, 120)">
                  <circle cx="0" cy="0" r="17" fill="url(#subdialBg)" stroke="#D4AF37" strokeWidth="0.9" />
                  <circle cx="0" cy="0" r="14" fill="none" stroke="#334155" strokeWidth="0.4" strokeDasharray="1 2" />
                  <text x="0" y="-6" textAnchor="middle" fontSize="4.5" fill="#FBBF24" fontWeight="bold">24H</text>
                  <text x="0" y="10" textAnchor="middle" fontSize="4" fill="#38BDF8" fontWeight="bold">IST</text>
                  <g transform={`rotate(${day24Deg} 0 0)`}>
                    <line x1="0" y1="0" x2="0" y2="-11" stroke="#FDE047" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="1.8" fill="#D4AF37" />
                  </g>
                </g>

                {/* Seconds Register */}
                <g transform="translate(120, 154)">
                  <circle cx="0" cy="0" r="16" fill="url(#subdialBg)" stroke="#D4AF37" strokeWidth="0.9" />
                  <circle cx="0" cy="0" r="13" fill="none" stroke="#334155" strokeWidth="0.4" strokeDasharray="1 2" />
                  <text x="0" y="-6" textAnchor="middle" fontSize="3.5" fill="#94A3B8" fontWeight="bold">60</text>
                  <text x="0" y="8" textAnchor="middle" fontSize="3.5" fill="#94A3B8" fontWeight="bold">30</text>
                  <g transform={`rotate(${secDeg} 0 0)`}>
                    <line x1="0" y1="2" x2="0" y2="-10" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="1.5" fill="#EF4444" />
                  </g>
                </g>

                <g transform="translate(120, 68)">
                  <text
                    x="0"
                    y="14"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#FDE047"
                    filter="url(#goldenGlowText)"
                    fontSize="4.8"
                    fontWeight="900"
                    fontFamily="monospace, system-ui, sans-serif"
                  >
                    {hhStr}:{mmStr} {ampm}
                  </text>
                </g>

                {/* 3 o'clock Date Window */}
                <g transform="translate(142, 112)">
                  <rect x="0" y="0" width="17" height="15" rx="3" fill="#020617" stroke="#D4AF37" strokeWidth="1.2" />
                  <rect x="1" y="1" width="15" height="13" rx="2" fill="#0F172A" />
                  <text x="8.5" y="10.5" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="900" fontFamily="monospace">
                    {dayOfMonth}
                  </text>
                </g>

                {/* Hour Hand */}
                <g transform={`rotate(${hourDeg} 120 120)`} filter="url(#luxuryHandShadow)">
                  <polygon points="117,120 120,66 123,120 121.5,134 118.5,134" fill="url(#goldFluted)" stroke="#5A3E00" strokeWidth="0.8" />
                  <line x1="120" y1="72" x2="120" y2="112" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* Minute Hand */}
                <g transform={`rotate(${minDeg} 120 120)`} filter="url(#luxuryHandShadow)">
                  <polygon points="117.5,120 120,38 122.5,120 121,138 119,138" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />
                  <line x1="120" y1="44" x2="120" y2="112" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Second Needle */}
                <g transform={`rotate(${secDeg} 120 120)`} filter="url(#luxuryHandShadow)">
                  <line x1="120" y1="140" x2="120" y2="28" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
                  <polygon points="120,22 118,30 122,30" fill="#EF4444" />
                  <circle cx="120" cy="132" r="3.5" fill="#FFD700" stroke="#EF4444" strokeWidth="1" />
                </g>

                <circle cx="120" cy="120" r="5" fill="url(#goldFluted)" stroke="#5A3E00" strokeWidth="0.8" />
                <circle cx="120" cy="120" r="2" fill="#EF4444" />
                <path d="M 45 95 Q 120 45 195 95 Q 120 75 45 95 Z" fill="#FFFFFF" opacity="0.16" pointerEvents="none" />
              </svg>
            </div>
          </div>

          {/* LETTER 3: "I" — VERTICAL DATE TOP-TO-BOTTOM INSIDE THE LETTER "I" */}
          <div className="relative flex flex-col items-center justify-between h-full select-none" aria-label="Vertical Date inside second letter I">
            <div className="relative w-full h-5 sm:h-7 md:h-8 rounded-md sm:rounded-lg bg-gradient-to-b from-emerald-100 via-emerald-500 to-teal-800 border border-amber-200/80 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.75),inset_0_-1px_1px_rgba(6,78,59,0.6),0_5px_14px_rgba(16,185,129,0.34)] flex items-center justify-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 shrink-0 z-10">
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-emerald-950/75 ring-1 ring-emerald-100/50 hidden sm:block mr-auto" />
              <Calendar className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-slate-950 shrink-0" />
              <span className="text-[7px] sm:text-[10px] md:text-xs font-black tracking-widest text-slate-950 uppercase truncate">DATE</span>
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-emerald-950/75 ring-1 ring-emerald-100/50 hidden sm:block ml-auto" />
            </div>

            <div className="relative w-[64%] sm:w-[60%] flex-1 -my-0.5 bg-gradient-to-b from-slate-900 via-[#02090c] to-slate-900 border-x-2 border-emerald-400/85 shadow-[inset_0_0_24px_rgba(0,0,0,0.95),inset_0_0_0_1px_rgba(52,211,153,0.28),0_0_18px_rgba(0,0,0,0.8)] flex flex-col items-center justify-evenly py-0.5 sm:py-1.5 px-0.5 text-center overflow-hidden">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-emerald-400/[0.06]" />
              <div className="relative z-10 flex flex-col items-center leading-none">
                <span className="text-[5.5px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-widest">DAY</span>
                <span className="text-[14px] sm:text-[24px] md:text-[29px] font-black font-mono tabular-nums text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.48)] leading-none">
                  {dayPadded}
                </span>
              </div>
              <div className="relative z-10 w-4 sm:w-7 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-emerald-300/90 to-transparent" />
              <div className="relative z-10 flex flex-col items-center leading-tight">
                <span className="text-[9.5px] sm:text-[15px] md:text-[17px] font-black text-amber-300 tracking-wide uppercase leading-none">
                  {monthShortEn}
                </span>
                <span className="text-[6.5px] sm:text-[9.5px] font-bold text-emerald-300 mt-0.5 leading-none">
                  {monthHindi}
                </span>
              </div>
              <div className="relative z-10 w-4 sm:w-7 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-amber-400/75 to-transparent" />
              <div className="relative z-10 flex flex-col items-center leading-none">
                <span className="text-[10px] sm:text-[16px] md:text-[20px] font-black font-mono tabular-nums text-slate-100 leading-none">
                  {yearStr}
                </span>
              </div>
            </div>

            <div className="relative w-full h-5 sm:h-7 md:h-8 rounded-md sm:rounded-lg bg-gradient-to-t from-teal-800 via-emerald-500 to-emerald-100 border border-amber-200/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),inset_0_-1px_1px_rgba(6,78,59,0.6),0_5px_14px_rgba(16,185,129,0.34)] flex items-center justify-center px-1.5 sm:px-2 shrink-0 z-10">
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-emerald-950/75 ring-1 ring-emerald-100/50 hidden sm:block mr-auto" />
              <span className="text-[7px] sm:text-[10px] md:text-xs font-black tracking-wide text-slate-950 truncate">
                {weekdayShortHi}
              </span>
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-emerald-950/75 ring-1 ring-emerald-100/50 hidden sm:block ml-auto" />
            </div>
          </div>

          {letterSNode}
        </div>

        {/* Subtle Exhibition Floor Reflection Line */}
        <div
          aria-hidden="true"
          className="pointer-events-none mx-auto mt-2.5 sm:mt-3 h-px w-4/5 bg-gradient-to-r from-transparent via-amber-400/45 to-transparent"
        />
      </div>
    </>
  );
});

export const HomeHeaderWatch: React.FC<HomeHeaderWatchProps> = ({
  currentUser,
  onNavigate,
  onOpenLogin,
  onOpenRegister,
  onOpenSponsorAddMember,
  onOpenChatHelp,
  onOpenDashboard,
  onOpenIdCard,
  onOpenFestivalModal,
  onOpenRashifalModal,
  onOpenPhotoCompressor,
  onOpenAiChat,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<SystemTopicKey | null>(null);
  const [hoveredJewel, setHoveredJewel] = useState<SJewelButton | null>(null);

  const goPage = (page: PageType) => {
    onNavigate?.(page);
    scrollAppToTop();
  };

  const activeTopicDetail = selectedTopic
    ? IOIS_SYSTEM_TOPICS.find((t) => t.key === selectedTopic) || null
    : null;

  const getTopicIcon = (key: SystemTopicKey) => {
    switch (key) {
      case 'overview':
        return <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />;
      case 'plans':
        return <Coins className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-300 shrink-0" />;
      case 'benefits':
        return <BookOpen className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-sky-300 shrink-0" />;
      case 'safety':
        return <ShieldCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-purple-300 shrink-0" />;
    }
  };

  // 12 Luxury Icon-Only Jewel Buttons Strictly Embedded Along the Golden "S" Curve (viewBox 180x220)
  // Zero cramped text inside S, zero overflow outside the gold S rim, crisp anti-misclick separation
  const sJewelButtons: SJewelButton[] = [
    {
      id: 'auth',
      cx: 144,
      cy: 40,
      label: currentUser ? 'मेरा डैशबोर्ड' : 'सदस्य लॉगिन',
      desc: currentUser ? 'डैशबोर्ड, कमाई व टीम देखें' : 'अपने खाते में लॉगिन करें',
      icon: currentUser ? (
        <LayoutDashboard className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-amber-200" />
      ) : (
        <LogIn className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-amber-200" />
      ),
      ringTone:
        'border-amber-400/90 bg-gradient-to-b from-amber-500/30 via-slate-900 to-slate-950 hover:border-yellow-200 hover:bg-amber-500/45',
      onClick: () => {
        if (currentUser) {
          if (onOpenDashboard) onOpenDashboard();
          else goPage('dashboard');
        } else {
          if (onOpenLogin) onOpenLogin();
          else goPage('register');
        }
      },
    },
    {
      id: 'join',
      cx: 106,
      cy: 28,
      label: currentUser ? 'नया सदस्य जोड़ें' : 'नया रजिस्ट्रेशन',
      desc: currentUser ? 'अपने स्पॉन्सर ID से सदस्य जोड़ें' : 'नया खाता बनाकर तुरंत जुड़ें',
      icon: <UserPlus className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-emerald-300" />,
      ringTone:
        'border-emerald-400/90 bg-gradient-to-b from-emerald-500/30 via-slate-900 to-slate-950 hover:border-emerald-200 hover:bg-emerald-500/45',
      onClick: () => {
        if (currentUser) {
          onOpenSponsorAddMember?.(1);
        } else {
          if (onOpenRegister) onOpenRegister(1);
          else goPage('register');
        }
      },
    },
    {
      id: 'plans',
      cx: 65,
      cy: 30,
      label: '7 मास्टर प्लांस',
      desc: '₹10 से ₹999 • 50%–70% दैनिक आय',
      icon: <Crown className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-yellow-300" />,
      ringTone:
        'border-yellow-400/95 bg-gradient-to-b from-yellow-500/35 via-slate-900 to-slate-950 hover:border-white hover:bg-yellow-500/50',
      onClick: () => goPage('plans'),
    },
    {
      id: 'idcard',
      cx: 34,
      cy: 54,
      label: 'स्मार्ट ID कार्ड',
      desc: '256-Bit QR सत्यापित डिजिटल पहचान पत्र',
      icon: <CreditCard className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-sky-300" />,
      ringTone:
        'border-sky-400/90 bg-gradient-to-b from-sky-500/30 via-slate-900 to-slate-950 hover:border-sky-200 hover:bg-sky-500/45',
      onClick: () => {
        if (onOpenIdCard) onOpenIdCard();
        else goPage('idcard');
      },
    },
    {
      id: 'study',
      cx: 38,
      cy: 93,
      label: 'विद्यार्थी व NCERT',
      desc: 'Class 1–12 फ्री नोट्स, सूत्र व कोर्स',
      icon: <GraduationCap className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-violet-300" />,
      ringTone:
        'border-violet-400/90 bg-gradient-to-b from-violet-500/30 via-slate-900 to-slate-950 hover:border-violet-200 hover:bg-violet-500/45',
      onClick: () => goPage('student-study'),
    },
    {
      id: 'rtps',
      cx: 74,
      cy: 108,
      label: 'RTPS व जमीन सेवा',
      desc: 'जाति, आय, निवास, दाखिल-खारिज व PAN',
      icon: <FileText className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-teal-300" />,
      ringTone:
        'border-teal-400/90 bg-gradient-to-b from-teal-500/30 via-slate-900 to-slate-950 hover:border-teal-200 hover:bg-teal-500/45',
      onClick: () => goPage('rtps-services'),
    },
    {
      id: 'chat',
      cx: 112,
      cy: 118,
      label: 'IOIS CHAT & HELP',
      desc: 'लाइव सदस्य चैट, ग्रुप व सहायता केंद्र',
      icon: <MessageCircle className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-emerald-300" />,
      ringTone:
        'border-emerald-400/90 bg-gradient-to-b from-emerald-500/30 via-slate-900 to-slate-950 hover:border-emerald-200 hover:bg-emerald-500/45',
      onClick: () => {
        if (onOpenChatHelp) onOpenChatHelp();
        else goPage('chat-help');
      },
    },
    {
      id: 'jobs',
      cx: 145,
      cy: 140,
      label: 'जॉब अलर्ट्स',
      desc: 'SSC, रेलवे, बैंक व सरकारी भर्तियां',
      icon: <Briefcase className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-amber-300" />,
      ringTone:
        'border-amber-400/90 bg-gradient-to-b from-amber-500/30 via-slate-900 to-slate-950 hover:border-amber-200 hover:bg-amber-500/45',
      onClick: () => goPage('jobs'),
    },
    {
      id: 'weather',
      cx: 141,
      cy: 178,
      label: 'लाइव मौसम',
      desc: 'तापमान, वर्षा अलर्ट व रडार पूर्वानुमान',
      icon: <CloudSun className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-cyan-300" />,
      ringTone:
        'border-cyan-400/90 bg-gradient-to-b from-cyan-500/30 via-slate-900 to-slate-950 hover:border-cyan-200 hover:bg-cyan-500/45',
      onClick: () => goPage('weather'),
    },
    {
      id: 'news',
      cx: 105,
      cy: 192,
      label: 'लाइव टीवी न्यूज़',
      desc: '24x7 राष्ट्रीय न्यूज़ चैनल व ई-अखबार',
      icon: <Tv className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-rose-300" />,
      ringTone:
        'border-rose-400/90 bg-gradient-to-b from-rose-500/30 via-slate-900 to-slate-950 hover:border-rose-200 hover:bg-rose-500/45',
      onClick: () => goPage('news'),
    },
    {
      id: 'panchang',
      cx: 65,
      cy: 190,
      label: 'दैनिक पंचांग व पर्व',
      desc: 'शुभ मुहूर्त, तिथि व लाइव पर्व कैलेंडर',
      icon: <Sun className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-orange-300" />,
      ringTone:
        'border-orange-400/90 bg-gradient-to-b from-orange-500/30 via-slate-900 to-slate-950 hover:border-orange-200 hover:bg-orange-500/45',
      onClick: () => {
        if (onOpenFestivalModal) onOpenFestivalModal();
        else goPage('panchang-rashifal');
      },
    },
    {
      id: 'help',
      cx: 31,
      cy: 174,
      label: '24x7 हेल्पलाइन',
      desc: 'सपोर्ट टिकट, Telegram व त्वरित मदद',
      icon: <PhoneCall className="w-[10px] h-[10px] sm:w-4 sm:h-4 text-yellow-300" />,
      ringTone:
        'border-amber-400/95 bg-gradient-to-b from-amber-500/35 via-slate-900 to-slate-950 hover:border-white hover:bg-amber-500/50',
      onClick: () => goPage('contact'),
    },
  ];

  const letterSNode = React.useMemo(
    () => (
      <div
        className="relative flex items-center justify-center h-full select-none"
        aria-label="Important Platform Quick Icon Buttons inside luxury letter S"
      >
        <div className="relative w-full h-full drop-shadow-[0_14px_32px_rgba(0,0,0,0.96)]">
          {/* Multi-Layer 24K Gold + Platinum + Obsidian Sunburst "S" matching "I" and "O" */}
          <svg
            viewBox="0 0 180 220"
            preserveAspectRatio="none"
            className="w-full h-full pointer-events-none select-none block"
          >
            <defs>
              <linearGradient id="goldBezelS" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF5C8" />
                <stop offset="22%" stopColor="#E4BF5E" />
                <stop offset="45%" stopColor="#8C6510" />
                <stop offset="68%" stopColor="#FFF8D4" />
                <stop offset="85%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#7A5600" />
              </linearGradient>
              <linearGradient id="platinumRimS" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="35%" stopColor="#E2E8F0" />
                <stop offset="70%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
              <linearGradient id="obsidianTrackS" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#020617" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>

            {/* Outer Brushed 24K Gold Bezel */}
            <path
              d="M 144 40 C 118 24, 62 24, 38 48 C 24 64, 28 92, 62 104 L 118 118 C 150 128, 156 158, 140 176 C 116 198, 62 196, 32 176"
              fill="none"
              stroke="url(#goldBezelS)"
              strokeWidth="54"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Metallic Platinum Inner Bevel Rim */}
            <path
              d="M 144 40 C 118 24, 62 24, 38 48 C 24 64, 28 92, 62 104 L 118 118 C 150 128, 156 158, 140 176 C 116 198, 62 196, 32 176"
              fill="none"
              stroke="url(#platinumRimS)"
              strokeWidth="47"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Deep Obsidian Sunburst Track */}
            <path
              d="M 144 40 C 118 24, 62 24, 38 48 C 24 64, 28 92, 62 104 L 118 118 C 150 128, 156 158, 140 176 C 116 198, 62 196, 32 176"
              fill="none"
              stroke="url(#obsidianTrackS)"
              strokeWidth="43"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Fine Inner Watch-Dial Gold Filigree Trace */}
            <path
              d="M 144 40 C 118 24, 62 24, 38 48 C 24 64, 28 92, 62 104 L 118 118 C 150 128, 156 158, 140 176 C 116 198, 62 196, 32 176"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="3 4"
              strokeLinecap="round"
              opacity="0.52"
            />
          </svg>

          {/* 12 Circular Icon-Only Jewel Buttons Strictly Embedded Along Centerline of "S" */}
          {sJewelButtons.map((btn) => {
            const isHighlighted = hoveredJewel?.id === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                aria-label={btn.label}
                title={`${btn.label} — ${btn.desc}`}
                onClick={btn.onClick}
                onMouseEnter={() => setHoveredJewel(btn)}
                onMouseLeave={() => setHoveredJewel(null)}
                onFocus={() => setHoveredJewel(btn)}
                onBlur={() => setHoveredJewel(null)}
                style={{
                  left: `${(btn.cx / 180) * 100}%`,
                  top: `${(btn.cy / 220) * 100}%`,
                  width: `${(33.5 / 180) * 100}%`,
                  height: `${(33.5 / 220) * 100}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] sm:border-2 ring-1 ring-white/20 flex items-center justify-center transition-all duration-150 cursor-pointer hover:scale-115 active:scale-95 shadow-[inset_0_1px_2px_rgba(255,255,255,0.48),0_3px_9px_rgba(0,0,0,0.92)] touch-manipulation z-10 ${btn.ringTone} ${
                  isHighlighted
                    ? 'scale-120 ring-2 ring-amber-200 shadow-[0_0_16px_rgba(251,191,36,0.82)] z-20'
                    : ''
                }`}
              >
                {btn.icon}
              </button>
            );
          })}
        </div>
      </div>
    ),
    [currentUser?.userId, hoveredJewel?.id]
  );

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/45 rounded-2xl sm:rounded-3xl p-1.5 sm:p-4 md:p-5 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Subtle Ambient Aura */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Preserved Structural Wrapper (matches CSS selector path nth-of-type(3) > div:nth-of-type(1)) */}
      <div className="relative z-10 w-full flex flex-col gap-2 sm:gap-3">
        {/* Selected Target Container: Elevated Luxury Horological Stage */}
        <div className="relative w-full flex flex-col gap-2.5 sm:gap-3.5 rounded-xl sm:rounded-2xl bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.11)_0%,rgba(15,23,42,0.72)_48%,rgba(2,6,23,0.92)_100%)] border border-amber-400/25 p-2 sm:p-3.5 shadow-[inset_0_1px_0_rgba(255,241,184,0.16),0_14px_36px_rgba(0,0,0,0.55)]">
          {/* Precision Brushed-Gold Corner Hairlines */}
          <span aria-hidden="true" className="pointer-events-none absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-amber-400/50 rounded-tl" />
          <span aria-hidden="true" className="pointer-events-none absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-amber-400/50 rounded-tr" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-amber-400/35 rounded-bl" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-amber-400/35 rounded-br" />

          <WatchChronometerStage letterSNode={letterSNode} />

          {/* Live Hover Caption OR Executive Smoked-Glass Command Dock */}
          {activeTopicDetail ? (
            <div
              className={`mt-1 rounded-xl sm:rounded-2xl border p-3.5 sm:p-4.5 backdrop-blur-md animate-fadeIn space-y-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${activeTopicDetail.accentClass}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-90 block">
                    IOIS INDIA · {activeTopicDetail.badge}
                  </span>
                  <h4 className="text-xs sm:text-base font-black text-white leading-snug">
                    {activeTopicDetail.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-200 font-medium">
                    {activeTopicDetail.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTopic(null)}
                  className="min-h-[34px] min-w-[34px] rounded-full bg-slate-950/90 hover:bg-red-600 text-white border border-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
                  aria-label="बंद करें"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-100">
                {activeTopicDetail.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10.5px] sm:text-xs font-black text-amber-300 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{activeTopicDetail.highlight}</span>
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {IOIS_SYSTEM_TOPICS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setSelectedTopic(t.key)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                        selectedTopic === t.key
                          ? 'bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800'
                      }`}
                    >
                      {getTopicIcon(t.key)}
                      <span>{t.shortLabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 px-2.5 sm:px-3.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black/95 border border-amber-400/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_28px_rgba(0,0,0,0.5)] text-[10px] sm:text-xs">
              {/* Header Bar showing S-Legend Title or Active Hovered Symbol Description */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-500/15">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-400/35 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </span>
                  {hoveredJewel ? (
                    <span className="text-[10.5px] sm:text-xs font-bold text-amber-300 truncate">
                      {hoveredJewel.label} · <span className="text-slate-200 font-medium">{hoveredJewel.desc}</span>
                    </span>
                  ) : (
                    <span className="text-[10.5px] sm:text-xs font-black tracking-wide bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent truncate">
                      “S” कमांड ज्वेल बटन (क्लिक कर सीधे सेवा / पॉप-अप खोलें)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTopic('overview')}
                  className="shrink-0 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-yellow-500/15 hover:from-amber-400 hover:to-yellow-400 text-amber-200 hover:text-slate-950 border border-amber-400/45 font-black text-[9.5px] sm:text-[11px] transition-all duration-150 cursor-pointer whitespace-nowrap shadow-sm"
                >
                  पूरा सिस्टम समझें
                </button>
              </div>

              {/* 12 Matching Symbol + Name Buttons mirroring every Jewel inside "S" */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 sm:gap-2">
                {sJewelButtons.map((btn) => {
                  const isHighlighted = hoveredJewel?.id === btn.id;
                  return (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={btn.onClick}
                      onMouseEnter={() => setHoveredJewel(btn)}
                      onMouseLeave={() => setHoveredJewel(null)}
                      onFocus={() => setHoveredJewel(btn)}
                      onBlur={() => setHoveredJewel(null)}
                      title={btn.desc}
                      className={`group flex items-center gap-2 px-2 py-1.5 rounded-xl border text-left transition-all duration-150 cursor-pointer min-w-0 ${
                        isHighlighted
                          ? 'bg-gradient-to-b from-amber-500/25 to-amber-950/40 border-amber-300 ring-1 ring-amber-300/60 shadow-[0_0_16px_rgba(245,158,11,0.32)] -translate-y-0.5'
                          : 'bg-gradient-to-b from-slate-900/95 to-slate-950 hover:from-slate-800/95 hover:to-slate-950 border-slate-800/90 hover:border-amber-400/55 hover:-translate-y-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.28),0_2px_6px_rgba(0,0,0,0.65)] transition-transform duration-150 group-hover:scale-105 ${btn.ringTone}`}
                      >
                        {btn.icon}
                      </span>
                      <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-100 group-hover:text-amber-200 truncate">
                        {btn.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Compact Secondary Quick Tools Row — Cohesive Obsidian Micro-Dock */}
              <div className="flex items-center flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => goPage('govt-schemes')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-cyan-200 border border-slate-800 hover:border-cyan-400/50 font-semibold text-[9.5px] sm:text-[11px] flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <Building2 className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>सरकारी योजना</span>
                </button>
                <button
                  type="button"
                  onClick={() => goPage('mandi-market')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-emerald-200 border border-slate-800 hover:border-emerald-400/50 font-semibold text-[9.5px] sm:text-[11px] flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <Scale className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>मंडी•गोल्ड</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenRashifalModal) onOpenRashifalModal();
                    else goPage('panchang-rashifal');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-purple-200 border border-slate-800 hover:border-purple-400/50 font-semibold text-[9.5px] sm:text-[11px] flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <MoonStar className="w-3 h-3 text-purple-400 shrink-0" />
                  <span>12 राशिफल</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenPhotoCompressor) onOpenPhotoCompressor();
                    else goPage('photo-compressor');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-pink-200 border border-slate-800 hover:border-pink-400/50 font-semibold text-[9.5px] sm:text-[11px] flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <ImageIcon className="w-3 h-3 text-pink-400 shrink-0" />
                  <span>फोटो KB</span>
                </button>
                <button
                  type="button"
                  onClick={() => goPage('calculator')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-violet-200 border border-slate-800 hover:border-violet-400/50 font-semibold text-[9.5px] sm:text-[11px] flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <Calculator className="w-3 h-3 text-violet-400 shrink-0" />
                  <span>कैलकुलेटर</span>
                </button>
                <button
                  type="button"
                  onClick={() => goPage('assessment')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-orange-200 border border-slate-800 hover:border-orange-400/50 font-semibold text-[9.5px] sm:text-[11px] flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <Compass className="w-3 h-3 text-orange-400 shrink-0" />
                  <span>करियर टेस्ट</span>
                </button>
                <button
                  type="button"
                  onClick={() => goPage('entertainment')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-rose-200 border border-slate-800 hover:border-rose-400/50 font-semibold text-[9.5px] sm:text-[11px] flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <Film className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>मनोरंजन</span>
                </button>
                <button
                  type="button"
                  onClick={() => goPage('parents')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-indigo-200 border border-slate-800 hover:border-indigo-400/50 font-semibold text-[9.5px] sm:text-[11px] flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <ShieldCheck className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>अभिभावक</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAiChat?.()}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/15 hover:from-emerald-500/35 hover:to-teal-500/30 text-emerald-200 border border-emerald-400/45 font-bold text-[9.5px] sm:text-[11px] flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap"
                >
                  <Bot className="w-3 h-3 text-emerald-300 shrink-0" />
                  <span>AI सहायक</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
