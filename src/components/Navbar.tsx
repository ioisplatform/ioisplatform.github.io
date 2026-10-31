import React, { useState } from 'react';
import { UserProfile, PageType } from '../types';
import { 
  ShieldCheck, 
  Lock,
  Sparkles, 
  Share2, 
  Check, 
  User, 
  LogIn, 
  LogOut, 
  ShieldAlert, 
  CreditCard,
  UserPlus,
  Home,
  Crown,
  Calculator,
  GraduationCap,
  Menu,
  X,
  CloudSun,
  Tv,
  Film,
  Scale,
  Building2,
  Briefcase,
  Clock,
  FileText,
  HelpCircle,
  PhoneCall,
  Compass,
  Grid,
  Sun,
  Moon,
  Palette,
  ChevronRight
} from 'lucide-react';
import { IoisServicesDrawerModal } from './IoisServicesDrawerModal';

interface NavbarProps {
  currentUser: UserProfile | null;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenChat: () => void;
  onOpenLogin: () => void;
  onOpenRegister?: () => void;
  onOpenDashboard?: () => void;
  onOpenIdCard?: () => void;
  onLogout: () => void;
  currentMode?: 'dark' | 'light';
  onToggleMode?: () => void;
  onOpenThemeModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentUser,
  currentPage,
  onNavigate,
  onOpenChat, 
  onOpenLogin,
  onOpenRegister,
  onOpenDashboard,
  onOpenIdCard,
  onLogout,
  currentMode = 'dark',
  onToggleMode,
  onOpenThemeModal,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [servicesModalOpen, setServicesModalOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleShareOrCopy = async () => {
    const liveUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'IOIS Platform - Indian Online Income Supporting System',
          text: 'IOIS प्लेटफॉर्म पर 7 मास्टर प्लांस, RTPS व जमीन सुधार, विद्यार्थी शिक्षा पोर्टल, लाइव मौसम व डिजिटल ID कार्ड देखें:',
          url: liveUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNavClick = (page: PageType, hashId?: string) => {
    setMenuOpen(false);
    setServicesModalOpen(false);
    if (page === 'register' && onOpenRegister) {
      onOpenRegister();
      return;
    }
    if (page === 'dashboard' && onOpenDashboard) {
      onOpenDashboard();
      return;
    }
    if (page === 'idcard' && onOpenIdCard) {
      onOpenIdCard();
      return;
    }
    onNavigate(page);
    if (hashId) {
      setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const primaryNavItems = [
    { id: 'home' as PageType, label: 'होम', icon: Home },
    { id: 'plans' as PageType, label: '7 प्लान्स', icon: Crown },
    { id: 'rtps-services' as PageType, label: 'RTPS व जमीन', icon: FileText },
    { id: 'student-study' as PageType, label: 'विद्यार्थी पोर्टल', icon: GraduationCap },
    { id: 'idcard' as PageType, label: 'ID कार्ड', icon: CreditCard },
  ];

  const allServicesQuickList = [
    { id: 'home' as PageType, label: 'मुख्य होम पेज', desc: 'परिचय व सेवाएं', icon: Home, color: 'text-amber-400' },
    { id: 'plans' as PageType, label: '7 मास्टर प्लान्स', desc: '₹10 से ₹999 आय', icon: Crown, color: 'text-yellow-400' },
    { id: 'rtps-services' as PageType, label: 'RTPS व जमीन सुधार', desc: 'जाति, आय, दाखिल खारिज', icon: FileText, color: 'text-emerald-400' },
    { id: 'student-study' as PageType, label: 'विद्यार्थी शिक्षा पोर्टल', desc: 'NCERT नोट्स व कंप्यूटर', icon: GraduationCap, color: 'text-violet-400' },
    { id: 'idcard' as PageType, label: 'डिजिटल ID कार्ड', desc: '256-Bit स्मार्ट पहचान', icon: CreditCard, color: 'text-blue-400' },
    { id: 'calculator' as PageType, label: 'अर्निंग कैलकुलेटर', desc: '50%-70% पेआउट सिमुलेटर', icon: Calculator, color: 'text-purple-400' },
    { id: 'weather' as PageType, label: 'लाइव मौसम अलर्ट', desc: '7-दिवसीय पूर्वानुमान', icon: CloudSun, color: 'text-sky-400' },
    { id: 'news' as PageType, label: 'लाइव टीवी व समाचार', desc: '24x7 समाचार व ई-अखबार', icon: Tv, color: 'text-red-400' },
    { id: 'entertainment' as PageType, label: 'मनोरंजन व AI टूल्स', desc: 'नो Ads वीडियो व चैट', icon: Film, color: 'text-pink-400' },
    { id: 'panchang-rashifal' as PageType, label: 'पंचांग व राशिफल', desc: 'शुभ मुहूर्त व 12 राशियां', icon: Clock, color: 'text-orange-400' },
    { id: 'mandi-market' as PageType, label: 'कृषि मंडी व गोल्ड रेट', desc: 'फसल भाव व 24K सोना', icon: Scale, color: 'text-amber-300' },
    { id: 'govt-schemes' as PageType, label: 'सरकारी योजना डायरेक्टरी', desc: 'नागरिक कानून व कल्याण', icon: Building2, color: 'text-teal-400' },
    { id: 'jobs' as PageType, label: 'नौकरी व करियर अलर्ट', desc: 'सरकारी व प्राइवेट भर्तियां', icon: Briefcase, color: 'text-indigo-400' },
    { id: 'utilities' as PageType, label: 'वैदिक घड़ी व टीवी मोड', desc: 'स्मार्ट डिस्प्ले', icon: Clock, color: 'text-cyan-400' },
    { id: 'parents' as PageType, label: 'अभिभावक सत्यापन', desc: 'बाल सुरक्षा व मार्गदर्शन', icon: ShieldCheck, color: 'text-emerald-300' },
    { id: 'assessment' as PageType, label: 'कैरियर असेसमेंट टेस्ट', desc: '2 मिनट का टेस्ट', icon: Sparkles, color: 'text-yellow-300' },
    { id: 'admin' as PageType, label: 'एडमिन पैनल', desc: 'सत्यापन व अप्रूवल', icon: ShieldAlert, color: 'text-rose-400' },
    { id: 'contact' as PageType, label: 'हेल्पलाइन व अक्सर प्रश्न', desc: '24x7 सहायता व FAQ', icon: PhoneCall, color: 'text-amber-400' },
  ];

  return (
    <>
      {/* ================= MAIN LOCKED HEADER BAR (PERMANENT STICKY LOCK) ================= */}
      <header id="main-header" className="bg-slate-950/98 backdrop-blur-2xl border-b-2 border-amber-500/40 py-2 px-2 sm:px-4 md:px-6 sticky top-0 z-50 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.85)] w-full max-w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 flex-nowrap">
          
          {/* 1. Brand Logo & Title */}
          <div 
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none shrink-0" 
            onClick={() => handleNavClick('home')}
            title="मुख्य होम पेज पर जाएं"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-amber-400 bg-gradient-to-tr from-amber-500 via-yellow-400 to-green-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] sm:text-[10px] font-black text-amber-400 leading-none">IOIS</span>
                <span className="text-[6px] text-green-400 font-bold leading-none mt-0.5">INDIA</span>
              </div>
            </div>
            <div className="shrink-0 flex flex-col justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <h1 className="tiranga-text text-xs sm:text-base md:text-lg font-black tracking-tight leading-tight whitespace-nowrap">
                  IOIS PLATFORM
                </h1>
                <span className="hidden sm:inline-flex bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[8px] font-bold px-1.5 py-0.2 rounded-full items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                  <span>OFFICIAL</span>
                </span>
                <span className="hidden md:inline-flex bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[8px] font-bold px-1.5 py-0.2 rounded-full items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5 text-amber-400" />
                  <span>LOCKED HEADER</span>
                </span>
              </div>
              <p className="gold-metallic-text text-[7px] xs:text-[7.5px] sm:text-[8px] md:text-[9px] uppercase tracking-wider font-black leading-none mt-0.5 whitespace-nowrap">
                INDIAN ONLINE INCOME SUPPORTING SYSTEM
              </p>
            </div>
          </div>

          {/* 2. Desktop Quick Nav: Only shown on extra wide screens (2xl: >=1536px) so it never forces buttons off screen */}
          <nav className="hidden 2xl:flex items-center gap-1 text-xs font-bold text-slate-300 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 shrink-0">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. Right Action Controls: Always fits 100% within screen bounds */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Dark / Light Mode Toggle Button (Compact) */}
            {onToggleMode && (
              <button
                onClick={onToggleMode}
                className="p-1.5 sm:p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0"
                title={currentMode === 'dark' ? "लाइट मोड पर स्विच करें" : "डार्क मोड पर स्विच करें"}
                aria-label="Toggle dark/light mode"
              >
                {currentMode === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                )}
              </button>
            )}

            {/* AI Assistant Quick Pill Button */}
            <button
              id="nav-ai-chat-btn"
              onClick={onOpenChat}
              className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 hover:from-amber-500/25 hover:to-yellow-500/25 border border-amber-500/50 hover:border-amber-400 text-amber-300 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-black shadow-sm transition cursor-pointer shrink-0"
              title="चिंटू AI से सवाल पूछें"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span className="hidden xs:inline">Ask AI</span>
            </button>

            {/* User Session / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`border px-2 sm:px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                    currentPage === 'dashboard'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300'
                  }`}
                  title="यूज़र डैशबोर्ड खोलें"
                >
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-amber-400 shrink-0">
                    <img src={currentUser.photoUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                  </div>
                  <span className="max-w-[50px] sm:max-w-[80px] md:max-w-[100px] truncate">{currentUser.fullName}</span>
                </button>

                <button
                  onClick={onLogout}
                  title="लॉगआउट करें"
                  className="p-1.5 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-xl border border-slate-800 transition cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  id="nav-login-btn"
                  onClick={onOpenLogin}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 px-2 sm:px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>लॉगिन</span>
                </button>

                <button
                  id="nav-register-btn"
                  onClick={() => handleNavClick('register')}
                  className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 px-2 sm:px-3 py-1.5 rounded-xl font-black text-xs shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">ज्वाइन</span>
                </button>
              </div>
            )}

            {/* 4. MASTER MENU ICON BUTTON (ALWAYS VISIBLE & UNIFIED ON BOTH PC & MOBILE) */}
            <button
              id="master-nav-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1.5 border shadow-md shrink-0 ${
                menuOpen
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/25'
                  : 'bg-gradient-to-r from-slate-900 to-slate-850 hover:bg-slate-800 text-amber-300 border-amber-500/50 hover:border-amber-400'
              }`}
              title="सभी 17+ सेवाएं व मेन्यू विकल्प खोलें"
              aria-label="Toggle Navigation Menu"
            >
              {menuOpen ? (
                <X className="w-4 h-4 text-slate-950" />
              ) : (
                <Menu className="w-4 h-4 text-amber-400" />
              )}
              <span className="font-black">मेनू</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                menuOpen ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
              }`}>
                17+
              </span>
            </button>

          </div>
        </div>

        {/* ================= UNIFIED UNIVERSAL NAVIGATION MENU (PC & MOBILE) ================= */}
        {menuOpen && (
          <div className="mt-2 pt-3 border-t border-slate-800 space-y-3 bg-slate-950/98 backdrop-blur-2xl p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-amber-500/40 max-h-[82vh] overflow-y-auto shadow-[0_25px_80px_rgba(0,0,0,0.9)] animate-fadeIn">
            
            {/* Top Bar inside Menu: Share, Theme Color, 17+ Full Drawer, Close */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setServicesModalOpen(true);
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition"
              >
                <Grid className="w-3.5 h-3.5 text-amber-400" />
                <span>17+ खोज डायरेक्टरी</span>
              </button>

              <button
                onClick={handleShareOrCopy}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? 'लिंक कॉपी हो गया!' : 'शेयर पोर्टल'}</span>
              </button>

              {onOpenThemeModal && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenThemeModal();
                  }}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>थीम रंग चुनें</span>
                </button>
              )}

              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>मेन्यू बंद करें</span>
              </button>
            </div>

            {/* User Session Banner inside Menu */}
            {currentUser ? (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 shadow-md">
                    <img src={currentUser.photoUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">सक्रिय सदस्य</span>
                      <span className="text-[10px] bg-slate-950 font-mono text-slate-300 px-1.5 py-0.2 rounded border border-slate-800">
                        {currentUser.userId}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white">{currentUser.fullName}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-sm"
                  >
                    मेरा डैशबोर्ड खोलें →
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-red-950 text-red-300 border border-slate-800 text-xs font-bold transition"
                  >
                    लॉगआउट
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-black text-white">IOIS सदस्य पोर्टल में प्रवेश करें</h4>
                  <p className="text-[11px] text-slate-400">नया खाता बनाएं या अपने रजिस्टर्ड User ID / पासवर्ड से लॉगिन करें।</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition"
                  >
                    लॉगिन
                  </button>
                  <button
                    onClick={() => handleNavClick('register')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-xs font-black shadow-md transition hover:scale-105"
                  >
                    नया रजिस्ट्रेशन (Join)
                  </button>
                </div>
              </div>
            )}

            {/* Section Header */}
            <div className="flex items-center justify-between px-1 pt-1 border-b border-slate-800 pb-1.5">
              <span className="text-[11px] uppercase font-black tracking-wider text-amber-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>सभी IOIS सेवाएं व पोर्टल (1-Click Access)</span>
              </span>
              <span className="text-[10px] text-slate-400">स्क्रीन से बाहर कोई बटन नहीं जाएगा</span>
            </div>

            {/* Grid of All Services: Responsive 2 cols on phone, 3 on tablet, 4 on PC */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5">
              {allServicesQuickList.map((srv) => {
                const Icon = srv.icon;
                const isActive = currentPage === srv.id;
                return (
                  <button
                    key={srv.id}
                    onClick={() => handleNavClick(srv.id)}
                    className={`p-2.5 sm:p-3 rounded-2xl text-left transition flex items-start gap-2.5 border cursor-pointer group ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-bold'
                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-amber-500/40 text-slate-200'
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl shrink-0 transition group-hover:scale-110 ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-950 border border-slate-800'
                    }`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : srv.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black truncate block ${isActive ? 'text-slate-950' : 'text-white'}`}>
                          {srv.label}
                        </span>
                        <ChevronRight className={`w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100 transition ${
                          isActive ? 'text-slate-950' : 'text-amber-400'
                        }`} />
                      </div>
                      <span className={`text-[10px] truncate block mt-0.5 ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                        {srv.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Row inside Menu */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[11px] text-slate-300">24x7 एक्टिव व सत्यापित सिस्टम</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="text-red-400 hover:text-red-300 text-xs font-bold underline cursor-pointer"
                >
                  एडमिन पैनल
                </button>
                <span>•</span>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="text-amber-400 hover:text-amber-300 text-xs font-bold underline cursor-pointer"
                >
                  हेल्पलाइन व अक्सर प्रश्न
                </button>
              </div>
            </div>

          </div>
        )}
      </header>

      {/* Global IOIS Services Modal (Deep Search & Categories) */}
      <IoisServicesDrawerModal
        isOpen={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onOpenAiChat={() => {
          setServicesModalOpen(false);
          onOpenChat();
        }}
      />
    </>
  );
};
