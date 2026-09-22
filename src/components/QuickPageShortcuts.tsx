import React from 'react';
import { PageType } from '../types';
import { 
  Home, 
  Crown, 
  UserPlus, 
  CreditCard, 
  GraduationCap, 
  FileText, 
  ArrowUp, 
  Sparkles, 
  Grid,
  ChevronRight,
  Compass,
  ArrowLeft
} from 'lucide-react';

interface QuickPageShortcutsProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenAiChat?: () => void;
  onOpenServicesModal?: () => void;
  onOpenRegister?: () => void;
  onOpenIdCard?: () => void;
}

export const QuickPageShortcuts: React.FC<QuickPageShortcutsProps> = ({
  currentPage,
  onNavigate,
  onOpenAiChat,
  onOpenServicesModal,
  onOpenRegister,
  onOpenIdCard,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: PageType) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="mt-10 pt-6 border-t border-slate-800 space-y-4">
      {/* Clean Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">
              त्वरित सेवाएं एवं नेविगेशन
            </h3>
            <p className="text-xs text-slate-400">
              सेवाओं को डायलॉग बॉक्स या सीधे एक्सेस में खोलें
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI सहायता</span>
            </button>
          )}

          <button
            onClick={scrollToTop}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            title="पेज के शीर्ष पर जाएं"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>शीर्ष पर जाएं</span>
          </button>
        </div>
      </div>

      {/* Primary Action Button: Open All Services in Clean Dialog Box */}
      {onOpenServicesModal && (
        <button
          onClick={onOpenServicesModal}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border-2 border-amber-400/50 hover:border-amber-400 text-white transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shadow-lg group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow">
              <Grid className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm sm:text-base font-black text-amber-300 group-hover:text-amber-200 transition">
                सभी 17+ सेवाएं देखें (डायलॉग बॉक्स मेन्यू)
              </h4>
              <p className="text-xs text-slate-300">
                RTPS, 7 प्लांस, विद्यार्थी नोट्स, मौसम, टीवी, पंचांग व अन्य सभी सेवाएं
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-400/30 shrink-0">
            <span>डायलॉग खोलें</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </button>
      )}

      {/* Quick Access Tiles - Clean Grid with No Text Overlapping */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {/* 1. Home */}
        <button
          onClick={() => handleNavigate('home')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
            currentPage === 'home'
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
              : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 text-slate-200 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <Home className="w-4 h-4 text-amber-400" />
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </div>
          <span className="text-xs font-bold truncate">मुख्य होम पेज</span>
        </button>

        {/* 2. 7 Plans */}
        <button
          onClick={() => handleNavigate('plans')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
            currentPage === 'plans'
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
              : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 text-slate-200 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <Crown className="w-4 h-4 text-amber-400" />
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </div>
          <span className="text-xs font-bold truncate">7 मास्टर प्लांस</span>
        </button>

        {/* 3. RTPS Services */}
        <button
          onClick={() => handleNavigate('rtps-services')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
            currentPage === 'rtps-services'
              ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black shadow-md'
              : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 text-slate-200 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <FileText className="w-4 h-4 text-emerald-400" />
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </div>
          <span className="text-xs font-bold truncate">RTPS व जमीन</span>
        </button>

        {/* 4. Student Study */}
        <button
          onClick={() => handleNavigate('student-study')}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
            currentPage === 'student-study'
              ? 'bg-violet-400 text-slate-950 border-violet-300 font-black shadow-md'
              : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 text-slate-200 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <GraduationCap className="w-4 h-4 text-violet-400" />
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </div>
          <span className="text-xs font-bold truncate">विद्यार्थी पोर्टल</span>
        </button>

        {/* 5. Registration Dialog */}
        <button
          onClick={() => {
            if (onOpenRegister) onOpenRegister();
            else handleNavigate('register');
          }}
          className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-left transition flex flex-col justify-between space-y-2 cursor-pointer shadow"
        >
          <div className="flex items-center justify-between">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span className="text-[9px] font-black uppercase bg-emerald-500/20 px-1.5 py-0.5 rounded">डायलॉग</span>
          </div>
          <span className="text-xs font-bold text-white truncate">ज्वाइन / रजिस्टर</span>
        </button>

        {/* 6. ID Card Dialog */}
        <button
          onClick={() => {
            if (onOpenIdCard) onOpenIdCard();
            else handleNavigate('idcard');
          }}
          className="p-3 rounded-xl border border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 text-left transition flex flex-col justify-between space-y-2 cursor-pointer shadow"
        >
          <div className="flex items-center justify-between">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span className="text-[9px] font-black uppercase bg-blue-500/20 px-1.5 py-0.5 rounded">डायलॉग</span>
          </div>
          <span className="text-xs font-bold text-white truncate">डिजिटल ID कार्ड</span>
        </button>
      </div>

      {/* Return to Home button */}
      {currentPage !== 'home' && (
        <div className="text-center pt-2">
          <button
            onClick={() => handleNavigate('home')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 hover:border-amber-400 font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider shadow transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>मुख्य होम पेज पर वापस लौटें</span>
          </button>
        </div>
      )}
    </section>
  );
};
