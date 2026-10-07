import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Bot, 
  FileCheck2, 
  CreditCard,
  ShieldCheck, 
  Layers,
  Tv,
  Pencil,
  CheckCircle2,
  PhoneCall,
  QrCode,
  Award,
  BookMarked,
  FileText,
  UserCheck,
  LogIn,
  Check,
  Zap,
  GraduationCap,
  Users
} from 'lucide-react';
import { MemberProfile } from '../types';
import kidsEduIntroImg from '../assets/images/kids_edu_intro_1790768991812.jpg';

interface HeroSectionProps {
  currentUser?: MemberProfile | null;
  onOpenStudyModal: (planId: string) => void;
  onOpenVideoModal: () => void;
  onOpenTracingModal: () => void;
  onOpenHomeworkModal: () => void;
  onOpenPlansModal: () => void;
  onOpenAiTeacherModal: () => void;
  onClaimPass: () => void;
  onOpenNurseryWorkbook?: () => void;
  onOpenIdCardModal?: () => void;
  onOpenLoginModal?: () => void;
  onOpenResumeBuilder?: () => void;
  onOpenRegistration?: (planId?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onOpenStudyModal,
  onOpenVideoModal,
  onOpenTracingModal,
  onOpenHomeworkModal,
  onOpenPlansModal,
  onOpenAiTeacherModal,
  onClaimPass,
  onOpenNurseryWorkbook,
  onOpenIdCardModal,
  onOpenLoginModal,
  onOpenResumeBuilder,
  onOpenRegistration
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'primary' | 'secondary' | 'career'>('all');

  // Slow-moving, relaxed live registration ticker (changes every 9 seconds calmly)
  const liveRegistrations = [
    { name: 'राहुल वर्मा', city: 'पटना (बिहार)', plan: 'Plan 01', action: 'पंजीकृत व सक्रिय', time: 'अभी-अभी' },
    { name: 'प्रिया शर्मा', city: 'जयपुर (राजस्थान)', plan: 'Class 10 NCERT', action: 'डिजिटल किट प्राप्त', time: '3 मिनट पहले' },
    { name: 'अमित पटेल', city: 'अहमदाबाद (गुजरात)', plan: 'Plan 02', action: 'बायोडाटा बिल्डर अनलॉक्ड', time: '5 मिनट पहले' },
    { name: 'नेहा सिंह', city: 'वाराणसी (उत्तर प्रदेश)', plan: 'Plan 03', action: 'छात्र पास सत्यापित', time: '7 मिनट पहले' },
    { name: 'रोहित कुमार', city: 'रांची (झारखंड)', plan: 'Plan 01 Pass', action: 'सफलतापूर्वक जुड़ा', time: '9 मिनट पहले' },
    { name: 'खुशी कुमारी', city: 'मुजफ्फरपुर (बिहार)', plan: 'नर्सरी A-Z किट', action: '26 पेज वर्कबुक सक्रिय', time: '12 मिनट पहले' }
  ];

  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    // Calibrated to 9000ms (9 seconds) for a calm, slow, non-rushed reading speed
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveRegistrations.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [liveRegistrations.length]);

  const currentTicker = liveRegistrations[tickerIndex];

  return (
    <div className="bg-[#f8fafc] text-slate-900 selection:bg-amber-400 selection:text-slate-950 border-b border-slate-200">
      
      {/* ============================================================= */}
      {/* 🏛️ IOIS INDIA APP STYLE DASHBOARD HERO SECTION */}
      {/* ============================================================= */}
      <section className="py-5 sm:py-8 relative overflow-hidden">
        
        {/* Soft Background Postal Tint */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/35 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/35 rounded-full blur-3xl pointer-events-none -ml-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          
          {/* ============================================================= */}
          {/* 1. TOP STUDENT ACCOUNT / GREETING BAR (IOIS INDIA Top Bar) */}
          {/* ============================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs w-full max-w-full overflow-hidden">
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#991b1b] to-[#1e3a8a] text-white flex items-center justify-center font-black text-base shadow-xs border border-amber-300/40 shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {currentUser ? `नमस्ते, ${currentUser.name}!` : 'नमस्ते, प्रिय विद्यार्थी!'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {currentUser ? 'खाता सक्रिय' : 'पोर्टल लाइव'}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                  {currentUser 
                    ? `रोल: ${currentUser.rollNumber || currentUser.memberId} • प्लान: ${currentUser.planName || 'Plan 01'}` 
                    : 'कक्षा 1 से 12 एवं 7 मास्टर योजनाएं'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <a 
                href="https://api.whatsapp.com/send?phone=918877490845" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5 border border-emerald-200 transition-colors shadow-2xs text-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>हेल्पलाइन: +91 8877490845</span>
              </a>

              {currentUser && (
                <button
                  onClick={onOpenIdCardModal}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#991b1b]" />
                  <span>आईडी कार्ड</span>
                </button>
              )}
            </div>
          </div>

          {/* ============================================================= */}
          {/* 🔴 SLOW-MOVING LIVE REGISTRATION UPDATES TICKER (धीमी गति में रन) */}
          {/* ============================================================= */}
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl px-3 sm:px-4 py-2 flex items-center justify-between text-xs text-slate-800 shadow-2xs overflow-hidden w-full max-w-full">
            <div className="flex items-center gap-2 overflow-hidden min-w-0 w-full">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#991b1b] text-white font-black text-[10px] uppercase shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
                लाइव
              </span>
              
              <div className="transition-all duration-700 ease-in-out truncate font-medium text-[11px] sm:text-xs min-w-0 flex-1">
                <strong className="text-slate-900">{currentTicker.name}</strong> ({currentTicker.city}) ने{' '}
                <span className="text-[#991b1b] font-bold">{currentTicker.plan}</span> में {currentTicker.action} किया।{' '}
                <span className="text-slate-500 font-mono text-[10px] ml-1">({currentTicker.time})</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0 ml-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>सत्यापित लाइव एडमिशन</span>
            </div>
          </div>

          {/* ============================================================= */}
          {/* 2. VIRTUAL STUDENT SMART PASS CARD (IOIS INDIA Pass Card) */}
          {/* ============================================================= */}
          {/* NOTICE: EXACTLY ONE PROMINENT CLAIM/ACTIVE ACTION. ZERO DUPLICATES! */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#991b1b] via-[#1e3a8a] to-[#0f172a] p-1 border-2 border-amber-400/50 shadow-xl text-white w-full max-w-full">
            <div className="rounded-[22px] overflow-hidden bg-[#0f172a]/95 relative p-4 sm:p-6 lg:p-8">
              
              {/* Subtle background glow */}
              <div className="absolute top-0 right-1/4 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
                
                {/* Left 7 Cols: Pass Info & Value */}
                <div className="lg:col-span-7 space-y-4">
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xs">
                      IOIS INDIA Student Smart Pass
                    </span>
                    <span className="text-xs text-amber-200 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>कक्षा 1 से 12 लाइफटाइम अध्ययन पहुंच</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                    डिजिटल छात्र सेवा केंद्र — <span className="text-amber-300 underline decoration-amber-400/60 decoration-wavy decoration-2">सभी अध्ययन सामग्री एक ही क्लिक में!</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                    नर्सरी से 5वीं के लिए सचित्र वर्णमाला (26 पेज मुद्रण योग्य A4 वर्कबुक), बोलने वाला AI शिक्षक, डिजिटल अक्षर स्लेट; तथा कक्षा 6 से 12 तक के लिए NCERT संपूर्ण नोट्स, 3D वीडियो कक्षाएं एवं दैनिक गृहकार्य जांच।
                  </p>

                  {/* ONLY ONE OFFICIAL ACTION BUTTON IN HEADER/HERO (NO DUPLICATES) */}
                  <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center gap-3">
                    {currentUser ? (
                      <button
                        onClick={onOpenIdCardModal}
                        className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:brightness-110 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 border border-emerald-300 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-300" />
                        <span>आपका छात्र पास सक्रिय है (आईडी कार्ड देखें)</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                    ) : (
                      <button
                        onClick={onClaimPass}
                        className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 border border-amber-200 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>सत्यापित छात्र पास प्राप्त करें (@ मात्र ₹10)</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </button>
                    )}

                    {onOpenNurseryWorkbook && (
                      <button
                        onClick={onOpenNurseryWorkbook}
                        className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/25 shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        <span className="text-base">🔤</span>
                        <span>A-Z नर्सरी वर्कबुक (26 पेज)</span>
                      </button>
                    )}
                  </div>

                  {/* Key Assurance Indicators */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>100% स्पैम व बॉट मुक्त</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-amber-300 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>NCERT पाठ्यक्रम अनुमोदित</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-blue-300 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>आधिकारिक छात्र ID कार्ड शामिल</span>
                    </div>
                  </div>

                </div>

                {/* Right 5 Cols: Visual Pass Card Graphics */}
                <div className="lg:col-span-5">
                  <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden bg-gradient-to-br from-[#991b1b] via-[#1e3a8a] to-[#0f172a] p-5 border border-white/20 shadow-2xl space-y-4 text-white">
                    
                    {/* Card Top Strip */}
                    <div className="flex items-center justify-between border-b border-white/15 pb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow">
                          IOIS
                        </div>
                        <div>
                          <span className="text-xs font-black text-white block leading-tight">
                            DIGITAL STUDENT PASS
                          </span>
                          <span className="text-[10px] text-amber-300 font-semibold">
                            {currentUser ? `Verified Member: ${currentUser.name}` : 'IOIS INDIA Verified Student Pass'}
                          </span>
                        </div>
                      </div>
                      <QrCode className="w-7 h-7 text-amber-300 opacity-90" />
                    </div>

                    {/* Card Body - Simulated Chip & Details */}
                    <div className="space-y-3">
                      <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-amber-300 to-amber-500 shadow-inner border border-amber-200" />
                      
                      <div className="font-mono text-xs sm:text-sm tracking-widest text-amber-200 font-bold">
                        {currentUser ? `IOIS • ${currentUser.rollNumber} • PASS` : 'IOIS • 2026 • PASS • VERIFIED'}
                      </div>

                      <div className="flex justify-between items-end text-[11px] pt-1">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase">प्रकार (Tier)</span>
                          <span className="font-bold text-white">Class 1-12 NCERT Kit</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[9px] uppercase">वैधता (Validity)</span>
                          <span className="font-bold text-emerald-400">आजीवन (Lifetime)</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Preview Visual Thumb */}
                    <div className="rounded-xl overflow-hidden h-24 relative border border-white/15">
                      <img 
                        src={kidsEduIntroImg} 
                        alt="IOIS Study Platform" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] font-bold text-amber-200">
                          सचित्र ई-बुक्स, वीडियो लेक्चर्स व डिजिटल स्लेट
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ============================================================= */}
          {/* 3. 📱 IOIS INDIA QUICK STUDENT SERVICES CIRCULAR ICON GRID */}
          {/* ============================================================= */}
          <div className="space-y-4 pt-2">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#991b1b] shadow-xs" />
                <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                  त्वरित छात्र सेवाएं (IOIS INDIA Quick Services)
                </h3>
              </div>

              {/* Service Filter Segments */}
              <div className="inline-flex p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs text-xs font-bold overflow-x-auto">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-[#991b1b] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  सभी सेवाएं (All)
                </button>
                <button
                  onClick={() => setActiveCategory('primary')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeCategory === 'primary'
                      ? 'bg-[#991b1b] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  नर्सरी-5वीं (Kids)
                </button>
                <button
                  onClick={() => setActiveCategory('secondary')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeCategory === 'secondary'
                      ? 'bg-[#991b1b] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  कक्षा 6-12 (NCERT)
                </button>
                <button
                  onClick={() => setActiveCategory('career')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeCategory === 'career'
                      ? 'bg-[#991b1b] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  कौशल व टूल्स
                </button>
              </div>
            </div>

            {/* 12 Core IOIS INDIA Circular Icon Service Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              
              {/* 1. NCERT Study Notes */}
              {(activeCategory === 'all' || activeCategory === 'secondary') && (
                <button
                  onClick={() => onOpenStudyModal('plan-01')}
                  className="p-3.5 rounded-3xl bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block group-hover:text-blue-700 transition-colors">
                      NCERT नोट्स
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      कक्षा 1-12 ई-बुक्स
                    </span>
                  </div>
                </button>
              )}

              {/* 2. Nursery A-Z Workbook */}
              {(activeCategory === 'all' || activeCategory === 'primary') && (
                <button
                  onClick={() => {
                    if (onOpenNurseryWorkbook) onOpenNurseryWorkbook();
                    else onOpenStudyModal('plan-01');
                  }}
                  className="p-3.5 rounded-3xl bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
                    🔤
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block group-hover:text-amber-800 transition-colors">
                      नर्सरी A-Z किट
                    </span>
                    <span className="text-[10px] text-[#991b1b] font-bold block mt-0.5">
                      26 पेज A4 मुद्रण
                    </span>
                  </div>
                </button>
              )}

              {/* 3. 3D Video Classes */}
              {(activeCategory === 'all' || activeCategory === 'secondary' || activeCategory === 'primary') && (
                <button
                  onClick={onOpenVideoModal}
                  className="p-3.5 rounded-3xl bg-white hover:bg-red-50/70 border border-slate-200 hover:border-red-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block group-hover:text-red-700 transition-colors">
                      वीडियो कक्षाएं
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      HD वीडियो पाठ
                    </span>
                  </div>
                </button>
              )}

              {/* 4. Digital Tracing Slate */}
              {(activeCategory === 'all' || activeCategory === 'primary') && (
                <button
                  onClick={onOpenTracingModal}
                  className="p-3.5 rounded-3xl bg-white hover:bg-purple-50/70 border border-slate-200 hover:border-purple-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-violet-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Pencil className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block group-hover:text-purple-700 transition-colors">
                      डिजिटल स्लेट
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      अक्षर व संख्या ट्रेसिंग
                    </span>
                  </div>
                </button>
              )}

              {/* 5. Daily Homework System */}
              {(activeCategory === 'all' || activeCategory === 'secondary' || activeCategory === 'primary') && (
                <button
                  onClick={onOpenHomeworkModal}
                  className="p-3.5 rounded-3xl bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block group-hover:text-emerald-700 transition-colors">
                      दैनिक गृहकार्य
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      जांच व स्टार रेटिंग
                    </span>
                  </div>
                </button>
              )}

              {/* 6. Smart Student ID Card */}
              {(activeCategory === 'all' || activeCategory === 'career') && (
                <button
                  onClick={onOpenIdCardModal}
                  className="p-3.5 rounded-3xl bg-white hover:bg-cyan-50/70 border border-slate-200 hover:border-cyan-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block group-hover:text-cyan-700 transition-colors">
                      छात्र ID कार्ड
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      डिजिटल पहचान पत्र
                    </span>
                  </div>
                </button>
              )}

              {/* 7. 24x7 AI Teacher */}
              {(activeCategory === 'all' || activeCategory === 'primary' || activeCategory === 'secondary') && (
                <button
                  onClick={onOpenAiTeacherModal}
                  className="p-3.5 rounded-3xl bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block group-hover:text-indigo-700 transition-colors">
                      AI शिक्षक
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      24x7 संशय समाधान
                    </span>
                  </div>
                </button>
              )}

              {/* 8. BioData / CV Builder */}
              {(activeCategory === 'all' || activeCategory === 'career') && (
                <button
                  onClick={() => {
                    if (onOpenResumeBuilder) onOpenResumeBuilder();
                    else onOpenStudyModal('plan-02');
                  }}
                  className="p-3.5 rounded-3xl bg-white hover:bg-teal-50/70 border border-slate-200 hover:border-teal-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block group-hover:text-teal-700 transition-colors">
                      बायोडाटा / CV
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      20+ ATS टेम्पलेट्स
                    </span>
                  </div>
                </button>
              )}

              {/* 9. 7 Master Study Plans */}
              {(activeCategory === 'all' || activeCategory === 'secondary' || activeCategory === 'career') && (
                <button
                  onClick={onOpenPlansModal}
                  className="p-3.5 rounded-3xl bg-white hover:bg-rose-50/70 border border-slate-200 hover:border-rose-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#991b1b] to-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block group-hover:text-[#991b1b] transition-colors">
                      7 योजनाएं
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      मास्टर पाठ्यक्रम किट
                    </span>
                  </div>
                </button>
              )}

              {/* 10. Student Leaderboard */}
              {(activeCategory === 'all' || activeCategory === 'secondary' || activeCategory === 'primary') && (
                <a
                  href="#leaderboard"
                  className="p-3.5 rounded-3xl bg-white hover:bg-orange-50/70 border border-slate-200 hover:border-orange-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block group-hover:text-orange-700 transition-colors">
                      लीडरबोर्ड
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      मेधावी छात्र व स्टार्स
                    </span>
                  </div>
                </a>
              )}

              {/* 11. WhatsApp Helpline */}
              {(activeCategory === 'all' || activeCategory === 'career' || activeCategory === 'primary') && (
                <a
                  href="https://api.whatsapp.com/send?phone=918877490845"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-3xl bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-green-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block group-hover:text-emerald-700 transition-colors">
                      हेल्पलाइन सपोर्ट
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      24x7 WhatsApp
                    </span>
                  </div>
                </a>
              )}

              {/* 12. Digital Student ID Card Service */}
              <button
                onClick={onOpenIdCardModal}
                className="p-3.5 rounded-3xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-400 transition-all flex flex-col items-center text-center space-y-2 group shadow-2xs hover:shadow-md cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1e3a8a] to-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <CreditCard className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <span className="font-black text-xs text-slate-900 block group-hover:text-blue-800 transition-colors">
                    डिजिटल छात्र ID कार्ड
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                    पहचान पत्र देखें
                  </span>
                </div>
              </button>

            </div>
          </div>

          {/* ============================================================= */}
          {/* 4. 3 CORE SERVICE PILLARS (Clean Card Style) */}
          {/* ============================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* CARD 1: AI-Driven Tools */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-blue-400 transition-all">
              <div className="space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl">
                  🤖
                </div>
                <h4 className="font-black text-sm text-slate-900">
                  AI-संचालित शिक्षण मार्गदर्शन
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  24x7 ऑनलाइन AI टीचर सपोर्ट। छात्र बोलकर या लिखकर गणित, विज्ञान और भाषा के संशय तुरंत हल कर सकते हैं।
                </p>
              </div>

              <button
                onClick={onOpenAiTeacherModal}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>AI शिक्षक से पूछें →</span>
              </button>
            </div>

            {/* CARD 2: Complete NCERT Package */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-amber-400 transition-all">
              <div className="space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl">
                  📚
                </div>
                <h4 className="font-black text-sm text-slate-900">
                  कक्षा 1 से 12 एवं बाल विकास किट
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  नर्सरी से 5वीं के लिए सचित्र वर्णमाला व 4-लाइन स्लेट, तथा 6वीं से 12वीं के लिए NCERT अध्याय नोट्स व वीडियो लेक्चर्स।
                </p>
              </div>

              <button
                onClick={() => onOpenStudyModal('plan-01')}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>स्टडी किट देखें →</span>
              </button>
            </div>

            {/* CARD 3: Skill & Practical Education */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-emerald-400 transition-all">
              <div className="space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
                  🎓
                </div>
                <h4 className="font-black text-sm text-slate-900">
                  प्रायोगिक ज्ञान व छात्र प्रमाणन
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  दैनिक जीवन में गणित, समय, मुद्रा ज्ञान, व्यावहारिक प्रोजेक्ट्स एवं आधिकारिक डिजिटल छात्र पहचान पत्र।
                </p>
              </div>

              <button
                onClick={onOpenPlansModal}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>7 योजनाएं विस्तार से →</span>
              </button>
            </div>

          </div>

          {/* ============================================================= */}
          {/* 5. 🛡️ OFFICIAL VERIFICATION GUARANTEE BANNER */}
          {/* ============================================================= */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-[#991b1b] flex items-center justify-center shrink-0 border border-red-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <strong className="text-slate-900 block font-bold text-xs sm:text-sm">
                  100% प्रामाणिक व स्पैम-मुक्त विद्यार्थी सुरक्षा नीति
                </strong>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                  यह ₹10 किसी कमर्शियल सेवा की फीस नहीं, बल्कि बॉट्स व फेक खातों से सुरक्षा हेतु एकमुश्त <strong>Account Verification Charge</strong> है, जिससे छात्र को आजीवन अध्ययन पोर्टल व आईडी कार्ड प्राप्त होता है।
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenStudyModal('plan-01')}
              className="px-4 py-2.5 rounded-xl bg-[#991b1b] hover:bg-red-800 text-white font-bold transition-colors shrink-0 text-xs shadow-xs cursor-pointer"
            >
              मुफ्त डेमो नोट्स देखें
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
