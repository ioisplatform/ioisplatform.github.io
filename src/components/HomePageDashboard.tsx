import React, { useState } from 'react';
import { PageType } from '../types';
import { 
  Crown, 
  UserPlus, 
  CreditCard, 
  Calculator, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  ShieldAlert, 
  PhoneCall, 
  ArrowRight, 
  Sparkles,
  Zap,
  Lock,
  ChevronRight,
  CloudSun,
  Tv,
  Scale,
  Building2,
  Briefcase,
  FileText,
  Search,
  CheckCircle2,
  Compass,
  BookOpen,
  Award,
  Globe,
  HelpCircle
} from 'lucide-react';
import { HomeHeaderWatch } from './HomeHeaderWatch';
import { InterviewPreparationSection } from './InterviewPreparationSection';

interface HomePageDashboardProps {
  onNavigate: (page: PageType) => void;
  onOpenLogin: () => void;
  onOpenAiChat: () => void;
  onSelectPlanForRegister?: (planId: number) => void;
}

export const HomePageDashboard: React.FC<HomePageDashboardProps> = ({
  onNavigate,
  onOpenLogin,
  onOpenAiChat,
  onSelectPlanForRegister,
}) => {
  const [chromeSearchQuery, setChromeSearchQuery] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = chromeSearchQuery.toLowerCase().trim();
    if (!q) return;

    if (q.includes('rtps') || q.includes('jamin') || q.includes('dakhil') || q.includes('lpc') || q.includes('caste') || q.includes('jati') || q.includes('niwas')) {
      onNavigate('rtps-services');
    } else if (q.includes('plan') || q.includes('7 master') || q.includes('income') || q.includes('70%') || q.includes('earning')) {
      onNavigate('plans');
    } else if (q.includes('student') || q.includes('study') || q.includes('ncert') || q.includes('notes') || q.includes('formula') || q.includes('scholarship')) {
      onNavigate('student-study');
    } else if (q.includes('interview') || q.includes('question') || q.includes('answer') || q.includes('hr') || q.includes('tips')) {
      const el = document.getElementById('interview-preparation-hub');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (q.includes('weather') || q.includes('mausam') || q.includes('rain')) {
      onNavigate('weather');
    } else if (q.includes('news') || q.includes('tv') || q.includes('khabar')) {
      onNavigate('news');
    } else if (q.includes('register') || q.includes('join') || q.includes('signup')) {
      onNavigate('register');
    } else if (q.includes('id') || q.includes('card')) {
      onNavigate('idcard');
    } else {
      // Open AI Chat with this query
      onOpenAiChat();
    }
  };

  const chromeQuickShortcuts = [
    {
      id: 'rtps-services' as PageType,
      title: 'RTPS व जमीन',
      sub: 'जाति, आय, दाखिल-खारिज',
      icon: FileText,
      color: 'from-emerald-500 to-teal-500',
      iconColor: 'text-emerald-400',
      badge: 'नागरिक सेवा',
    },
    {
      id: 'plans' as PageType,
      title: '7 मास्टर प्लांस',
      sub: '₹10 से ₹999, 70% आय',
      icon: Crown,
      color: 'from-amber-500 to-yellow-500',
      iconColor: 'text-amber-400',
      badge: '70% इंसेंटिव',
    },
    {
      id: 'student-study' as PageType,
      title: 'विद्यार्थी अध्ययन',
      sub: 'NCERT नोट्स, सूत्र व करियर',
      icon: GraduationCap,
      color: 'from-violet-500 to-purple-600',
      iconColor: 'text-violet-400',
      badge: '100% फ्री',
    },
    {
      id: 'idcard' as PageType,
      title: 'डिजिटल ID कार्ड',
      sub: 'स्मार्ट कार्ड व HD PNG',
      icon: CreditCard,
      color: 'from-blue-500 to-indigo-600',
      iconColor: 'text-blue-400',
      badge: '256-Bit Encrypted',
    },
    {
      id: 'weather' as PageType,
      title: 'लाइव मौसम अलर्ट',
      sub: 'तापमान व 7-दिन रडार',
      icon: CloudSun,
      color: 'from-sky-500 to-blue-500',
      iconColor: 'text-sky-400',
      badge: 'सैटेलाइट लाइव',
    },
    {
      id: 'news' as PageType,
      title: 'लाइव टीवी न्यूज़',
      sub: '24x7 टीवी व ई-अखबार',
      icon: Tv,
      color: 'from-red-500 to-rose-600',
      iconColor: 'text-red-400',
      badge: '24x7 Stream',
    },
    {
      id: 'register' as PageType,
      title: 'नया रजिस्ट्रेशन',
      sub: 'इन-ऐप प्रूफ अपलोड',
      icon: UserPlus,
      color: 'from-yellow-500 to-amber-600',
      iconColor: 'text-yellow-400',
      badge: 'डायरेक्ट फॉर्म',
    },
    {
      id: 'calculator' as PageType,
      title: 'अर्निंग कैलकुलेटर',
      sub: '70% दैनिक आय सिमुलेटर',
      icon: Calculator,
      color: 'from-purple-500 to-pink-600',
      iconColor: 'text-purple-400',
      badge: 'लाइव सिमुलेटर',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 max-w-6xl mx-auto">
      
      {/* 1. TOP HEADER WATCH (DIGITAL CLOCK + LUXURY ANALOG WATCH 1..12) */}
      <section className="space-y-2">
        <HomeHeaderWatch />
      </section>

      {/* 2. GOOGLE CHROME STYLE CLEAN SEARCH & WELCOME SURFACE */}
      <section className="space-y-8 text-center pt-2 sm:pt-4">
        
        {/* Centered Brand Title & Logo (Chrome Aesthetic) */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 p-1.5 px-4 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-black shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>IOIS 2026 OFFICIAL DIGITAL PLATFORM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            <span className="tiranga-text">IOIS DIGITAL</span> PORTAL
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            भारतीय ऑनलाइन आय सहयोग प्रणाली (Indian Online Income Supporting System) — स्वच्छ, सुरक्षित व 100% पारदर्शी डिजिटल मंच।
          </p>
        </div>

        {/* Clean Google Chrome Style Search / Ask Bar */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 rounded-full blur-md group-hover:blur-lg transition opacity-75" />
            
            <div className="relative flex items-center bg-slate-950 border-2 border-slate-700 hover:border-amber-400 focus-within:border-amber-400 rounded-full px-5 py-3.5 shadow-2xl transition">
              <Search className="w-5 h-5 text-amber-400 shrink-0 mr-3" />
              
              <input
                type="text"
                value={chromeSearchQuery}
                onChange={(e) => setChromeSearchQuery(e.target.value)}
                placeholder="IOIS सेवा, 7 प्लान, RTPS, इंटरव्यू प्रश्न या कोई भी सवाल सर्च करें..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />

              {chromeSearchQuery ? (
                <button
                  type="button"
                  onClick={() => setChromeSearchQuery('')}
                  className="text-slate-400 hover:text-white text-xs px-2"
                >
                  ✕
                </button>
              ) : null}

              <button
                type="submit"
                className="ml-2 px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>खोजें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Search Chips below bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-[11px] text-slate-400">
            <span className="font-bold text-slate-400">त्वरित सुझाव:</span>
            <button
              onClick={() => onNavigate('plans')}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 transition cursor-pointer"
            >
              👑 7 मास्टर प्लान्स
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('interview-preparation-hub');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition cursor-pointer"
            >
              🎯 इंटरव्यू प्रश्नोत्तरी
            </button>
            <button
              onClick={() => onNavigate('student-study')}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-violet-300 transition cursor-pointer"
            >
              📚 विद्यार्थी नोट्स
            </button>
            <button
              onClick={() => onNavigate('rtps-services')}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 transition cursor-pointer"
            >
              🏛️ RTPS व जमीन
            </button>
            <button
              onClick={() => onNavigate('weather')}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 transition cursor-pointer"
            >
              🌤️ लाइव मौसम
            </button>
          </div>
        </div>

        {/* 🌟 Registration / Join Now Hero Callout & Mandatory Warning */}
        <div className="max-w-4xl mx-auto p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 border-2 border-amber-400/50 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>नया सत्र 2026-27 | डायरेक्ट नामांकन चालू</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center justify-center md:justify-start gap-2">
                <span>🎯 IOIS रजिस्ट्रेशन / Join Now (7 मास्टर प्लांस)</span>
              </h3>
              <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
                ₹10 से ₹999 में से कोई भी प्लान चुनें, अपना डिजिटल ID कार्ड पाएं और हर रेफरल पर सीधा <strong>70% इंसेंटिव</strong> अपने खाते में प्राप्त करें।
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/40 text-[11px] text-amber-200 flex items-start gap-2 text-left">
                <span className="text-amber-400 font-bold shrink-0">⚠️ चेतावनी:</span>
                <span>रजिस्ट्रेशन करते समय अपना <strong>Payment Received UPI ID / पता</strong> सही-सही भरें और <strong>Sponsor ID</strong> (डिफ़ॉल्ट: <strong className="text-amber-400">IOIS999VK01</strong>) अवश्य दर्ज करें।</span>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={() => onNavigate('register')}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95 cursor-pointer border border-emerald-300"
              >
                <span>रजिस्ट्रेशन / Join Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chrome-Style Speed Dial Quick Shortcuts Grid (Minimalist, Clean) */}
        <div className="max-w-4xl mx-auto pt-2">
          <div className="text-left text-xs font-black text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
            <span>प्रमुख डिजिटल सेवाएं (Core Quick Shortcuts):</span>
            <span className="text-amber-400 font-bold">1-क्लिक एक्सेस</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {chromeQuickShortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all duration-200 cursor-pointer flex flex-col items-center text-center space-y-2 group shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} p-0.5 shadow-md flex items-center justify-center group-hover:scale-105 transition`}>
                    <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                  </div>
                  <div className="space-y-0.5 w-full">
                    <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">
                      {item.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </section>

      {/* 3. IOIS INTRODUCTION & CORE VALUES (परिचय व उद्देश्य) */}
      <section className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>ABOUT IOIS PLATFORM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              📖 IOIS क्या है और यह कैसे काम करता है?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              भारतीय ऑनलाइन आय सहयोग प्रणाली (IOIS) देश के युवाओं, विद्यार्थियों और परिवारों को डिजिटल आत्मनिर्भरता प्रदान करने वाला विश्वसनीय प्लेटफॉर्म है।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('plans')}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Crown className="w-4 h-4" />
              <span>7 मास्टर प्लांस देखें</span>
            </button>
          </div>
        </div>

        {/* 3 Core Pillars of IOIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-base border border-amber-500/30">
              70%
            </div>
            <h3 className="text-sm font-black text-white">1. सीधा 70% रेफरल इंसेंटिव</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              प्रत्येक सफल रेफरल पर आपको ₹7 से ₹699 तक सीधा 70% इंसेंटिव मिलता है। बिना किसी छिपे शुल्क के 100% पारदर्शी दैनिक भुगतान।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-black text-base border border-violet-500/30">
              📚
            </div>
            <h3 className="text-sm font-black text-white">2. विद्यार्थी शिक्षा व डिजिटल संसाधन</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Class 1 से 12 NCERT नोट्स, गणित सूत्र, बोनाफाइड सर्टिफिकेट व ई-बुक्स बंडल 100% निःशुल्क और आसानी से डाउनलोड करने योग्य।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-base border border-emerald-500/30">
              🏛️
            </div>
            <h3 className="text-sm font-black text-white">3. नागरिक सहायता व RTPS गाइड</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              जाति, आय, निवास, जमीन का दाखिल-खारिज, परिमार्जन, LPC, instant e-PAN और मौसम/समाचार के सटीक आधिकारिक लिंक।
            </p>
          </div>
        </div>

        {/* 3 Step Working Process */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-emerald-500/10 border border-amber-400/20 space-y-4">
          <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
            ⚡ केवल 3 चरणों में शुरुआत करें (How to Get Started):
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-white block font-bold">प्लान चुनें</strong>
                <span className="text-slate-400">₹10 से ₹999 में से अपनी सुविधा अनुसार 7 मास्टर प्लांस में से कोई एक चुनें।</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-white block font-bold">रजिस्टर करें</strong>
                <span className="text-slate-400">इन-ऐप फॉर्म भरें, पेमेंट प्रूफ अपलोड करें और तुरंत अपना डिजिटल ID कार्ड पाएं।</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-white block font-bold">शेयर करें व कमाएं</strong>
                <span className="text-slate-400">डिजिटल सामग्री साझा करें और हर नए सदस्य पर 70% इंसेंटिव अपने खाते में प्राप्त करें।</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERVIEW PREPARATION & QUESTIONS HUB (साक्षात्कार प्रश्न व उत्तर) */}
      <InterviewPreparationSection
        onNavigate={onNavigate}
        onOpenAiChat={onOpenAiChat}
      />

      {/* 5. CLEAN BOTTOM AI ASSISTANCE CALLOUT (NO GLITCHES / NO DUPLICATES) */}
      <section className="glass-card-gold p-6 sm:p-8 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>24x7 ऑल इंडिया हेल्पडेस्क व AI समाधान</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            क्या आपको किसी सेवा या प्लान के बारे में और जानना है?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm">
            हमारा IOIS AI चैटबॉट आपके किसी भी प्रश्न का हिंदी व सरल भाषा में तुरंत उत्तर देता है।
          </p>
        </div>

        <button
          onClick={onOpenAiChat}
          className="btn-gold-gradient px-6 py-3.5 text-xs sm:text-sm whitespace-nowrap cursor-pointer flex items-center gap-2 shadow-lg shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask IOIS AI Chatbot</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
