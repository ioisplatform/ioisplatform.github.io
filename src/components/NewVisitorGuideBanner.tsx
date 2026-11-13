import React, { useState } from 'react';
import { 
  UserPlus, 
  LogIn, 
  Crown, 
  CreditCard, 
  Wallet, 
  HelpCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  BookOpen,
  X,
  Compass,
  FileText
} from 'lucide-react';
import { PageType, UserProfile } from '../types';

interface NewVisitorGuideBannerProps {
  currentUser?: UserProfile | null;
  onNavigate: (page: PageType) => void;
  onOpenRegister?: (planId?: number) => void;
  onOpenLogin: () => void;
  onOpenIdCard?: () => void;
  onSelectPlanForRegister?: (planId: number) => void;
}

export const NewVisitorGuideBanner: React.FC<NewVisitorGuideBannerProps> = ({
  currentUser,
  onNavigate,
  onOpenRegister,
  onOpenLogin,
  onOpenIdCard,
  onSelectPlanForRegister
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isPhotoGuideModalOpen, setIsPhotoGuideModalOpen] = useState<boolean>(false);
  const [activePhotoStep, setActivePhotoStep] = useState<number>(1);

  if (currentUser) return null;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP WELCOME NEW VISITOR HEADER BANNER                                  */}
      {/* ========================================================================= */}
      <section 
        id="new-visitor-welcome-header" 
        className="w-full relative overflow-hidden rounded-3xl border-2 border-amber-400 bg-gradient-to-br from-amber-950/90 via-slate-950 to-black shadow-[0_0_40px_rgba(245,158,11,0.25)] select-none"
      >
        {/* Glow ambient spots */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Main Banner Header Strip */}
        <div className="p-4 sm:p-6 md:p-8 relative z-10 space-y-4 sm:space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-amber-500/30 pb-4">
            <div className="space-y-1.5">
              {/* Eyebrow with Animated Hand Gesture Indicator */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[10.5px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  <span className="text-sm animate-bounce">👋</span>
                  <span>पहली बार आए हैं? (New Visitor)</span>
                </span>
                
                {/* Live Animated Pointing Direction Badge */}
                <div className="inline-flex items-center gap-1 bg-red-500/20 border border-red-500/50 text-red-300 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black animate-pulse">
                  <span className="text-xs">👉</span>
                  <span>यहाँ से शुरू करें</span>
                  <span className="text-xs">👈</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span>क्या आप नए हैं?</span>
                <span className="gold-metallic-text">IOIS संपूर्ण गाइड</span>
                <span className="text-[11px] sm:text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-lg">
                  2 मिनट में सब समझें ⚡
                </span>
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                यदि आपको किसी मित्र ने लिंक भेजा है और समझ नहीं आ रहा, तो नीचे 3-स्टेप सचित्र गाइड देखें — <strong>रजिस्ट्रेशन कैसे करना है</strong>, <strong>लॉगिन कैसे करना है</strong> और <strong>हर रेफरल पर 50% से 70% तुरंत पैसा कैसे कमाना है</strong>, सब कुछ एकदम आसान शब्दों में समझें।
              </p>
            </div>

            {/* Toggle / Quick Action Buttons */}
            <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0 pt-1 md:pt-0">
              <button
                type="button"
                onClick={() => setIsPhotoGuideModalOpen(true)}
                className="btn-3d-rainbow-special px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-black text-black flex items-center justify-center gap-1.5 shadow-lg transition active:scale-95 cursor-pointer flex-1 md:flex-initial"
                title="फोटो गाइड पॉप-अप खोलें"
              >
                <span className="text-base">📸</span>
                <span>सचित्र फोटो गाइड</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700 transition cursor-pointer shrink-0"
                title={isExpanded ? "गाइड समेटें" : "गाइड विस्तार से देखें"}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. THREE ILLUSTRATED STEP CARDS (REGISTRATION, LOGIN, EARNING MONEY)      */}
          {/* ========================================================================= */}
          {isExpanded && (
            <div className="space-y-4 animate-fadeIn">
              {/* Directional Flow Header with Pointer Emoji Indicators */}
              <div className="flex items-center justify-between text-xs font-black text-amber-300 bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/30">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">👇</span>
                  <span>आसान 3-चरण प्रक्रिया (Easy 3-Step Process)</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                  <span>1️⃣ प्लान चुनें ➔ 2️⃣ रजिस्टर करें ➔ 3️⃣ 50%-70% पेआउट कमाएं</span>
                </span>
              </div>

              {/* 3 Step Visual Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4.5">
                
                {/* STEP 1: REGISTRATION KAISE KARE */}
                <div className="rounded-2xl p-4 sm:p-5 bg-slate-950/90 border-2 border-amber-400/60 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-amber-400 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                          1
                        </span>
                        <h3 className="text-base font-black text-white">
                          रजिस्ट्रेशन कैसे करें?
                        </h3>
                      </div>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        चरण 1
                      </span>
                    </div>

                    {/* Step Visual Mockup Box */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <UserPlus className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>3 आसान कदम:</span>
                      </div>
                      <ul className="space-y-1.5 text-[11.5px] text-slate-300">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>प्लान चुनें:</strong> ₹10 से ₹999 में से अपनी पसंद का प्लान चुनें।</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>विवरण भरें:</strong> अपना नाम, मोबाइल नंबर व पासवर्ड दर्ज करें।</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>UPI UTR डालें:</strong> QR कोड पर पेमेंट कर 12-अंकों का UTR नंबर डालें।</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Pulsing Animated Pointing Arrow Button */}
                  <div className="pt-2">
                    <div className="flex items-center justify-center gap-1.5 text-amber-300 text-[11px] sm:text-xs font-black mb-1 animate-pulse">
                      <span>👇 यहाँ क्लिक करके रजिस्ट्रेशन करें 👇</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenRegister) onOpenRegister();
                        else onNavigate('register');
                      }}
                      className="btn-gold-gradient w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-xl cursor-pointer transition active:scale-95 min-h-[44px] text-slate-950"
                    >
                      <UserPlus className="w-4 h-4 shrink-0 text-slate-950" />
                      <span>रजिस्ट्रेशन फॉर्म खोलें 👉</span>
                    </button>
                  </div>
                </div>

                {/* STEP 2: LOGIN & DIGITAL ID CARD */}
                <div className="rounded-2xl p-4 sm:p-5 bg-slate-950/90 border-2 border-sky-400/60 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-sky-400 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                          2
                        </span>
                        <h3 className="text-base font-black text-white">
                          लॉगिन व ID कार्ड
                        </h3>
                      </div>
                      <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold">
                        चरण 2
                      </span>
                    </div>

                    {/* Step Visual Mockup Box */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-sky-300 font-bold">
                        <CreditCard className="w-4 h-4 text-sky-400 shrink-0" />
                        <span>लॉगिन और स्मार्ट कार्ड:</span>
                      </div>
                      <ul className="space-y-1.5 text-[11.5px] text-slate-300">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>User ID से लॉगिन:</strong> अपनी User ID और पासवर्ड से तुरंत लॉगिन करें।</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>स्मार्ट ID कार्ड:</strong> 256-बिट सुरक्षित मेंबर कार्ड HD में डाउनलोड करें।</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>3D लाइव प्रोफाइल फ्रेम:</strong> अपनी पसंद का 3D प्रोफाइल फ्रेम लगाएं।</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Pulsing Animated Pointing Arrow Button */}
                  <div className="pt-2">
                    <div className="flex items-center justify-center gap-1.5 text-sky-300 text-[11px] sm:text-xs font-black mb-1 animate-pulse">
                      <span>👇 यहाँ क्लिक करके लॉगिन करें 👇</span>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenLogin}
                      className="btn-3d-silver w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-xl cursor-pointer transition active:scale-95 text-slate-950 min-h-[44px]"
                    >
                      <LogIn className="w-4 h-4 shrink-0 text-slate-950" />
                      <span>सदस्य लॉगिन खोलें 👉</span>
                    </button>
                  </div>
                </div>

                {/* STEP 3: PAISA KAISE KAMAYE (50%-70% INSTANT PAYOUT) */}
                <div className="rounded-2xl p-4 sm:p-5 bg-slate-950/90 border-2 border-emerald-400/60 shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-emerald-400 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                          3
                        </span>
                        <h3 className="text-base font-black text-white">
                          पैसा कैसे कमाएं?
                        </h3>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        50%-70% पेआउट
                      </span>
                    </div>

                    {/* Step Visual Mockup Box */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-emerald-300 font-bold">
                        <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>तुरंत पेआउट सिस्टम:</span>
                      </div>
                      <ul className="space-y-1.5 text-[11.5px] text-slate-300">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>रेफरल लिंक शेयर करें:</strong> अपना व्यक्तिगत QR कोड दोस्तों को भेजें।</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>तुरंत सीधा कमीशन:</strong> हर एक्टिवेशन पर ₹7 से ₹499 तुरंत प्राप्त करें।</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>0% कटौती विथड्रॉल:</strong> न्यूनतम ₹100 पर सीधे अपने UPI/बैंक में ट्रांसफर।</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Pulsing Animated Pointing Arrow Button */}
                  <div className="pt-2">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-300 text-[11px] sm:text-xs font-black mb-1 animate-pulse">
                      <span>👇 यहाँ क्लिक करके 7 प्लान देखें 👇</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('plans')}
                      className="btn-3d-rainbow-special w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-xl cursor-pointer transition active:scale-95 text-black min-h-[44px]"
                    >
                      <Crown className="w-4 h-4 shrink-0 text-black" />
                      <span>7 मास्टर प्लान्स देखें 👉</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Direction Pointer Footer Banner */}
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-emerald-500/15 border border-amber-400/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl animate-bounce">👆</span>
                  <span className="text-slate-200 font-bold">
                    ऊपर दिए गए बटनों पर क्लिक करें और बिना किसी झिझक के अपनी शुरुआत करें!
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold hidden sm:inline">लाइव सहायता चाहिए?</span>
                  <a
                    href="https://t.me/newuserhelpline"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold flex items-center gap-1 hover:bg-sky-500/30 transition cursor-pointer"
                  >
                    <span>हेल्पलाइन (Telegram)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STEP-BY-STEP PHOTO GUIDE MODAL POPUP (सचित्र फोटो गाइड)                 */}
      {/* ========================================================================= */}
      {isPhotoGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border-2 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-md">
                  📸
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-black text-white">
                    IOIS सचित्र फोटो गाइड (Step-by-Step Visual Walkthrough)
                  </h3>
                  <p className="text-xs text-slate-400">
                    नए उपयोगकर्ताओं के लिए सम्पूर्ण सरल सचित्र मार्गदर्शिका
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPhotoGuideModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Navigation Tabs (Mobile-Perfect 3-Column Grid) */}
            <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/80 p-1.5 sm:p-2 gap-1 sm:gap-2">
              {[
                { step: 1, label: '1. रजिस्ट्रेशन', desc: 'फॉर्म भरना' },
                { step: 2, label: '2. लॉगिन व ID', desc: 'कार्ड डाउनलोड' },
                { step: 3, label: '3. 50-70% आय', desc: 'तुरंत पेआउट' }
              ].map((tab) => (
                <button
                  key={tab.step}
                  type="button"
                  onClick={() => setActivePhotoStep(tab.step)}
                  className={`p-1.5 sm:p-2.5 rounded-xl text-center border transition cursor-pointer active:scale-95 flex flex-col justify-center items-center min-w-0 ${
                    activePhotoStep === tab.step
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-[10px] sm:text-xs font-black break-words leading-tight text-center">{tab.label}</span>
                  <span className={`block text-[8.5px] sm:text-[10px] break-words leading-tight mt-0.5 text-center ${activePhotoStep === tab.step ? 'text-slate-950 font-bold' : 'text-slate-400'}`}>
                    {tab.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Modal Body: Active Step Visual Card */}
            <div className="p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-slate-200 text-xs sm:text-sm">
              {activePhotoStep === 1 && (
                <div className="space-y-3.5 sm:space-y-4 animate-fadeIn">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                    <span className="text-amber-400 text-[11px] font-black uppercase tracking-wider block">
                      चरण 1: रजिस्ट्रेशन कैसे करें?
                    </span>
                    <h4 className="text-sm sm:text-lg font-black text-white">
                      केवल 3 आसान चरणों में रजिस्ट्रेशन पूर्ण करें:
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      1. सबसे पहले 7 में से कोई एक प्लान चुनें (जैसे ₹10 या ₹999 मास्टर प्लान)।<br/>
                      2. अपना नाम, 10-अंकों का मोबाइल नंबर और एक आसान पासवर्ड भरें।<br/>
                      3. दिए गए आधिकारिक QR कोड पर पेमेंट करें और 12-अंकों का UPI UTR नंबर सबमिट करें।
                    </p>
                  </div>

                  {/* Illustrated Diagram Mockup */}
                  <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <span className="text-xs font-bold text-amber-300 block">
                      📷 रजिस्ट्रेशन फॉर्म दृश्य (Mockup Screen):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xl sm:text-2xl block mb-0.5">💎</span>
                        <strong className="text-white block text-xs">1. प्लान चयन</strong>
                        <span className="text-slate-400 text-[10.5px]">₹10 से ₹999 में से चयन</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xl sm:text-2xl block mb-0.5">📝</span>
                        <strong className="text-white block text-xs">2. फॉर्म विवरण</strong>
                        <span className="text-slate-400 text-[10.5px]">नाम, मोबाइल, पासवर्ड</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xl sm:text-2xl block mb-0.5">💳</span>
                        <strong className="text-white block text-xs">3. UTR सबमिट</strong>
                        <span className="text-slate-400 text-[10.5px]">12-अंकों का UPI नंबर</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPhotoGuideModalOpen(false);
                      if (onOpenRegister) onOpenRegister();
                      else onNavigate('register');
                    }}
                    className="btn-gold-gradient w-full py-3 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-xl active:scale-95 text-slate-950 min-h-[44px]"
                  >
                    <UserPlus className="w-4 h-4 shrink-0 text-slate-950" />
                    <span>रजिस्ट्रेशन फॉर्म खोलें 👉</span>
                  </button>
                </div>
              )}

              {activePhotoStep === 2 && (
                <div className="space-y-3.5 sm:space-y-4 animate-fadeIn">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-1.5">
                    <span className="text-sky-400 text-[11px] font-black uppercase tracking-wider block">
                      चरण 2: लॉगिन कैसे करें व डिजिटल ID कार्ड कैसे पाएं?
                    </span>
                    <h4 className="text-sm sm:text-lg font-black text-white">
                      User ID व पासवर्ड से लॉगिन करें और स्मार्ट ID कार्ड पाएं:
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      1. रजिस्ट्रेशन के तुरंत बाद आपको आपकी यूनिक User ID (जैसे IOIS...) प्राप्त होती है।<br/>
                      2. 'सदस्य लॉगिन' बटन दबाएं, अपनी User ID और पासवर्ड डालकर लॉगिन करें।<br/>
                      3. डैशबोर्ड में 'डिजिटल ID कार्ड' पर क्लिक कर अपना 256-बिट सुरक्षित HD कार्ड डाउनलोड करें या प्रिंट करें!
                    </p>
                  </div>

                  {/* Illustrated Diagram Mockup */}
                  <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <span className="text-xs font-bold text-sky-300 block">
                      📷 डिजिटल ID कार्ड दृश्य (Smart Digital ID Card):
                    </span>
                    <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black text-amber-400 uppercase">OFFICIAL MEMBER CARD</span>
                        <div className="text-sm sm:text-base font-black text-white">256-Bit सुरक्षित QR वेरिफिकेशन</div>
                        <p className="text-[10.5px] text-slate-400">लैंडस्केप व पोर्ट्रेट दोनों फॉर्मेट्स में प्रिंट करने योग्य</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xl shadow-md shrink-0">
                        🪪
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPhotoGuideModalOpen(false);
                      onOpenLogin();
                    }}
                    className="btn-3d-silver w-full py-3 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-xl text-slate-950 active:scale-95 min-h-[44px]"
                  >
                    <LogIn className="w-4 h-4 shrink-0 text-slate-950" />
                    <span>सदस्य लॉगिन खोलें 👉</span>
                  </button>
                </div>
              )}

              {activePhotoStep === 3 && (
                <div className="space-y-3.5 sm:space-y-4 animate-fadeIn">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                    <span className="text-emerald-400 text-[11px] font-black uppercase tracking-wider block">
                      चरण 3: हर रेफरल पर 50% से 70% तुरंत पैसा कैसे कमाएं?
                    </span>
                    <h4 className="text-sm sm:text-lg font-black text-white">
                      पारदर्शी 50%-70% तुरंत पेआउट और विथड्रॉल सिस्टम:
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      1. डैशबोर्ड में जाकर अपना स्पॉन्सर आईडी और व्यक्तिगत रेफरल लिंक कॉपी करें।<br/>
                      2. पोस्टर स्टूडियो से अपना दुकान/CSC बैनर बनाकर WhatsApp स्टेटस और सोशल मीडिया पर शेयर करें।<br/>
                      3. जब भी कोई सदस्य आपके लिंक से जुड़ता है, आपको प्लान अनुसार <strong>₹7 से ₹499 सीधा पेआउट</strong> तुरंत मिलता है।<br/>
                      4. न्यूनतम ₹100 पर 24 घंटे में सीधे आपके UPI या बैंक खाते में 0% कटौती के साथ विथड्रॉल!
                    </p>
                  </div>

                  {/* Payout Breakdown Table */}
                  <div className="p-2.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-1.5">प्लान</th>
                          <th className="py-1.5">शुल्क</th>
                          <th className="py-1.5 text-emerald-400">सीधा पेआउट</th>
                          <th className="py-1.5">प्रतिशत</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-bold text-[11px]">
                        <tr><td className="py-1.5 text-amber-400">Plan 01</td><td>₹10</td><td className="text-emerald-400">₹7</td><td>70%</td></tr>
                        <tr><td className="py-1.5 text-sky-400">Plan 02</td><td>₹49</td><td className="text-emerald-400">₹34</td><td>70%</td></tr>
                        <tr><td className="py-1.5 text-indigo-400">Plan 03</td><td>₹99</td><td className="text-emerald-400">₹64</td><td>65%</td></tr>
                        <tr><td className="py-1.5 text-emerald-400">Plan 04</td><td>₹199</td><td className="text-emerald-400">₹119</td><td>60%</td></tr>
                        <tr><td className="py-1.5 text-purple-400">Plan 05</td><td>₹299</td><td className="text-emerald-400">₹179</td><td>60%</td></tr>
                        <tr><td className="py-1.5 text-yellow-400">Plan 06</td><td>₹499</td><td className="text-emerald-400">₹274</td><td>55%</td></tr>
                        <tr className="bg-amber-500/10"><td className="py-1.5 text-amber-300">Plan 07 (Master)</td><td className="text-white">₹999</td><td className="text-emerald-400">₹499</td><td className="text-amber-300 font-black">50%</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPhotoGuideModalOpen(false);
                      onNavigate('plans');
                    }}
                    className="btn-3d-rainbow-special w-full py-3 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-xl text-black active:scale-95 min-h-[44px]"
                  >
                    <Crown className="w-4 h-4 shrink-0 text-black" />
                    <span>7 मास्टर प्लान्स देखें 👉</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                चरण {activePhotoStep} / 3
              </span>
              <div className="flex items-center gap-2">
                {activePhotoStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setActivePhotoStep(activePhotoStep - 1)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    पिछला
                  </button>
                )}
                {activePhotoStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setActivePhotoStep(activePhotoStep + 1)}
                    className="btn-gold-gradient px-4 py-1.5 rounded-lg text-xs font-black cursor-pointer shadow-md"
                  >
                    अगला चरण 👉
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsPhotoGuideModalOpen(false)}
                    className="btn-gold-gradient px-4 py-1.5 rounded-lg text-xs font-black cursor-pointer shadow-md"
                  >
                    समझ गए (Close) ✓
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
