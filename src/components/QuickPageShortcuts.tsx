import React from 'react';
import { PageType } from '../types';
import { 
  Home, 
  Crown, 
  UserPlus, 
  CreditCard, 
  Calculator, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  ShieldAlert, 
  PhoneCall, 
  CloudSun,
  Tv,
  Film,
  Scale,
  Building2,
  Briefcase,
  FileText,
  ArrowUp,
  Sparkles,
  ChevronRight,
  Compass
} from 'lucide-react';

interface QuickPageShortcutsProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenAiChat?: () => void;
}

export const QuickPageShortcuts: React.FC<QuickPageShortcutsProps> = ({
  currentPage,
  onNavigate,
  onOpenAiChat,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: PageType) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allShortcuts = [
    {
      id: 'home' as PageType,
      label: 'मुख्य होम पेज',
      desc: 'सभी सेवाओं का केंद्रीय डैशबोर्ड',
      icon: Home,
      category: 'Main',
      btnColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-500/20 border-amber-400',
    },
    {
      id: 'rtps-services' as PageType,
      label: 'RTPS व जमीन सुधार',
      desc: 'जाति, आय, दाखिल खारिज, LPC व पेंशन',
      icon: FileText,
      category: 'Govt',
      btnColor: 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/50 text-emerald-300 hover:text-white',
    },
    {
      id: 'plans' as PageType,
      label: '7 मास्टर प्लांस',
      desc: '₹10 से ₹999 तक के सभी प्लांस',
      icon: Crown,
      category: 'Income',
      btnColor: 'bg-amber-950/80 hover:bg-amber-900 border-amber-500/50 text-amber-300 hover:text-white',
    },
    {
      id: 'register' as PageType,
      label: 'रजिस्ट्रेशन / Join Now',
      desc: 'डायरेक्ट इन-ऐप सदस्य खाता व डिजिटल ID',
      icon: UserPlus,
      category: 'Income',
      btnColor: 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/50 text-emerald-300 hover:text-white',
    },
    {
      id: 'idcard' as PageType,
      label: 'डिजिटल ID कार्ड',
      desc: 'स्मार्ट कार्ड प्रिव्यू व डाउनलोड',
      icon: CreditCard,
      category: 'Income',
      btnColor: 'bg-yellow-950/80 hover:bg-yellow-900 border-yellow-500/50 text-yellow-300 hover:text-white',
    },
    {
      id: 'weather' as PageType,
      label: 'लाइव मौसम अलर्ट',
      desc: 'शहरवार तापमान व वर्षा रिपोर्ट',
      icon: CloudSun,
      category: 'Daily',
      btnColor: 'bg-sky-950/80 hover:bg-sky-900 border-sky-500/50 text-sky-300 hover:text-white',
    },
    {
      id: 'news' as PageType,
      label: 'लाइव टीवी व न्यूज़',
      desc: '24x7 समाचार व डिजिटल ई-अखबार',
      icon: Tv,
      category: 'Daily',
      btnColor: 'bg-rose-950/80 hover:bg-rose-900 border-rose-500/50 text-rose-300 hover:text-white',
    },
    {
      id: 'entertainment' as PageType,
      label: '🎬 मनोरंजन व चैट',
      desc: 'बिना Ads वीडियो, लाइव चैट व फ्री AI टूल्स',
      icon: Film,
      category: 'Daily',
      btnColor: 'bg-pink-950/80 hover:bg-pink-900 border-pink-500/50 text-pink-300 hover:text-white font-bold',
    },
    {
      id: 'panchang-rashifal' as PageType,
      label: 'पंचांग व 12 राशिफल',
      desc: 'शुभ मुहूर्त, राहु काल व भाग्य फल',
      icon: Clock,
      category: 'Daily',
      btnColor: 'bg-orange-950/80 hover:bg-orange-900 border-orange-500/50 text-orange-300 hover:text-white',
    },
    {
      id: 'mandi-market' as PageType,
      label: 'मंडी भाव व सोना',
      desc: 'फसल दाम व 24K/22K गोल्ड रेट',
      icon: Scale,
      category: 'Daily',
      btnColor: 'bg-teal-950/80 hover:bg-teal-900 border-teal-500/50 text-teal-300 hover:text-white',
    },
    {
      id: 'govt-schemes' as PageType,
      label: 'सरकारी डायरेक्टरी',
      desc: 'आधार, पैन, राशन व आयुष्मान लिंक',
      icon: Building2,
      category: 'Govt',
      btnColor: 'bg-indigo-950/80 hover:bg-indigo-900 border-indigo-500/50 text-indigo-300 hover:text-white',
    },
    {
      id: 'jobs' as PageType,
      label: 'लाइव जॉब अलर्ट्स',
      desc: 'सरकारी व प्राइवेट भर्तियां',
      icon: Briefcase,
      category: 'Help',
      btnColor: 'bg-yellow-950/80 hover:bg-yellow-900 border-yellow-500/50 text-yellow-300 hover:text-white',
    },
    {
      id: 'calculator' as PageType,
      label: 'इंसेंटिव कैलकुलेटर',
      desc: '70% दैनिक व मासिक आय अनुमान',
      icon: Calculator,
      category: 'Income',
      btnColor: 'bg-green-950/80 hover:bg-green-900 border-green-500/50 text-green-300 hover:text-white',
    },
    {
      id: 'assessment' as PageType,
      label: 'कैरियर असेसमेंट',
      desc: '15-सवाल स्मार्ट टेस्ट',
      icon: GraduationCap,
      category: 'Income',
      btnColor: 'bg-cyan-950/80 hover:bg-cyan-900 border-cyan-500/50 text-cyan-300 hover:text-white',
    },
    {
      id: 'parents' as PageType,
      label: 'अभिभावक पोर्टल',
      desc: '100% चाइल्ड सेफ वातावरण व नीतियां',
      icon: ShieldCheck,
      category: 'Help',
      btnColor: 'bg-indigo-950/80 hover:bg-indigo-900 border-indigo-500/50 text-indigo-300 hover:text-white',
    },
    {
      id: 'contact' as PageType,
      label: '24x7 हेल्पलाइन व FAQ',
      desc: 'WhatsApp व Telegram सपोर्ट',
      icon: PhoneCall,
      category: 'Help',
      btnColor: 'bg-amber-950/80 hover:bg-amber-900 border-amber-500/50 text-amber-300 hover:text-white',
    },
    {
      id: 'admin' as PageType,
      label: 'एडमिन वेरिफिकेशन',
      desc: 'मास्टर पिन से लॉगिन व अप्रूवल',
      icon: ShieldAlert,
      category: 'Help',
      btnColor: 'bg-red-950/80 hover:bg-red-900 border-red-500/50 text-red-300 hover:text-white',
    },
  ];

  return (
    <section className="mt-14 pt-8 border-t-2 border-slate-800/80 space-y-6">
      {/* Header bar with Compass Icon */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex-shrink-0">
            <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
              <Compass className="w-6 h-6 text-amber-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                1-क्लिक क्विक शॉर्टकट
              </span>
              <span className="text-xs text-slate-400">
                • किसी भी अन्य पेज पर सीधे जाएं
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
              अगला क्या देखना चाहते हैं? (Quick Jump to Any Service)
            </h3>
          </div>
        </div>

        {/* Top Scroll & AI Guide Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI से पूछें</span>
            </button>
          )}

          <button
            onClick={scrollToTop}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            title="पेज के सबसे ऊपर जाएं"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>ऊपर जाएं (Top)</span>
          </button>
        </div>
      </div>

      {/* Grid of Short Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {allShortcuts.map((item) => {
          const Icon = item.icon;
          const isCurrent = currentPage === item.id;

          if (isCurrent) {
            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-400 text-amber-300 flex flex-col justify-between space-y-2 opacity-90 cursor-default relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                    वर्तमान पेज
                  </span>
                </div>
                <div>
                  <div className="text-xs font-black text-white">{item.label}</div>
                  <div className="text-[10px] text-amber-200/80 truncate mt-0.5">{item.desc}</div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`p-3.5 rounded-2xl border transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 text-left flex flex-col justify-between space-y-2.5 cursor-pointer shadow-md group ${item.btnColor}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-8 h-8 rounded-xl bg-slate-950/60 flex items-center justify-center group-hover:scale-110 transition">
                  <Icon className="w-4 h-4" />
                </div>
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
              </div>
              <div className="w-full">
                <div className="text-xs font-black text-white group-hover:text-amber-300 transition line-clamp-1">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-400 group-hover:text-slate-200 transition line-clamp-1 mt-0.5">
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Home Page Sticky Pill Bar */}
      {currentPage !== 'home' && (
        <div className="text-center pt-2">
          <button
            onClick={() => handleNavigate('home')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black px-6 py-3 rounded-full text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[2.5]" />
            <span>← मुख्य होम पेज पर वापस लौटें (Back to Home)</span>
          </button>
        </div>
      )}
    </section>
  );
};
