import React, { useState } from 'react';
import { UserProfile, PageType } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  Check, 
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
  PhoneCall,
  Compass,
  Grid,
  Sun,
  Moon,
  Palette,
  ChevronRight,
  Bell
} from 'lucide-react';
import { IoisServicesDrawerModal } from './IoisServicesDrawerModal';
import { MultiHeaderPopupNav } from './MultiHeaderPopupNav';

interface NavbarProps {
  currentUser: UserProfile | null;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenChat: () => void;
  onOpenLogin: () => void;
  onOpenRegister?: () => void;
  onOpenDashboard?: () => void;
  onOpenIdCard?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
  onLogout: () => void;
  currentMode?: 'dark' | 'light';
  onToggleMode?: () => void;
  onOpenThemeModal?: () => void;
  onOpenReferralModal?: () => void;
  onOpenPopupPage?: (page: PageType) => void;
  onOpenFestivalModal?: () => void;
  onOpenRashifalModal?: () => void;
  onOpenPhotoCompressor?: () => void;
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
  onOpenAdminLogin,
  onOpenNotifications,
  unreadCount = 0,
  onLogout,
  currentMode = 'dark',
  onToggleMode,
  onOpenThemeModal,
  onOpenReferralModal,
  onOpenPopupPage,
  onOpenFestivalModal,
  onOpenRashifalModal,
  onOpenPhotoCompressor,
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
      {/* ================= MAIN LOCKED HEADER BAR (PERFECT RESPONSIVE 2-TIER MOBILE ARCHITECTURE) ================= */}
      <header id="main-header" className="bg-slate-950/98 backdrop-blur-md border-b-2 border-amber-500/50 py-1.5 sm:py-2 px-2 sm:px-4 w-full relative transition-all shadow-[0_4px_24px_rgba(0,0,0,0.9)] max-w-full overflow-hidden select-none">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-1.5 sm:gap-2">
          
          {/* ================= ROW 1: BRAND LOGO + 4 TACTILE 3D SQUIRCLE UTILITY BUTTONS ================= */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-3 flex-nowrap min-w-0 w-full">
            
            {/* 1. Brand Logo & Title */}
            <div 
              className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none shrink-0 min-w-0" 
              onClick={() => handleNavClick('home')}
              title="मुख्य होम पेज पर जाएं"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl logo-3d-box p-0.5 shadow-md flex items-center justify-center shrink-0 border border-amber-400/80">
                <div className="w-full h-full rounded-lg bg-slate-950 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] sm:text-[10px] font-black text-amber-400 leading-none">IOIS</span>
                  <span className="text-[6px] text-green-400 font-bold leading-none mt-0.5">INDIA</span>
                </div>
              </div>
              <div className="shrink-0 flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-1">
                  <h1 className="text-xs sm:text-sm md:text-base font-black tracking-tight leading-tight whitespace-nowrap">
                    <span className="text-amber-400">IOIS</span>{' '}
                    <span className="text-white">PORTAL</span>
                  </h1>
                  <span className="inline-flex bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[7px] sm:text-[7.5px] font-bold px-1 sm:px-1.5 py-0.2 rounded-full items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    <span>VERIFIED</span>
                  </span>
                </div>
                <p className="text-[7.5px] sm:text-[8.5px] uppercase tracking-wider font-extrabold leading-none mt-0.5 whitespace-nowrap text-amber-300">
                  <span className="sm:hidden">ऑनलाइन इनकम सपोर्ट सिस्टम</span>
                  <span className="hidden sm:inline">INDIAN ONLINE INCOME SUPPORTING SYSTEM</span>
                </p>
              </div>
            </div>

            {/* 2. Desktop Quick Nav: Only shown on extra wide screens (2xl: >=1536px) */}
            <nav className="hidden 2xl:flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-slate-900/80 p-0.5 rounded-xl border border-slate-800 shrink-0">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* 3. Right Action Controls: 100% VISIBLE ON BOTH MOBILE AND DESKTOP */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              
              {/* Dark / Light Mode Toggle Button */}
              {onToggleMode && (
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/90 hover:border-amber-400 text-slate-200 transition cursor-pointer flex items-center justify-center shrink-0 shadow-sm active:scale-90 touch-manipulation min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px]"
                  title={currentMode === 'dark' ? "लाइट मोड पर स्विच करें" : "डार्क मोड पर स्विच करें"}
                  aria-label="Toggle dark/light mode"
                >
                  {currentMode === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 drop-shadow" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 drop-shadow" />
                  )}
                </button>
              )}

              {/* 3D Theme Palette Change Button */}
              {onOpenThemeModal && (
                <button
                  id="nav-theme-color-btn"
                  type="button"
                  onClick={onOpenThemeModal}
                  className="btn-3d-palette h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer shadow-md active:scale-90 touch-manipulation min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px]"
                  title="थीम रंग बदलें (3D Color Palettes)"
                  aria-label="Change Color Theme"
                >
                  <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black drop-shadow" />
                </button>
              )}

              {/* AI Assistant Quick Button */}
              <button
                id="nav-ai-chat-btn"
                type="button"
                onClick={onOpenChat}
                className="btn-3d-rainbow h-8.5 w-8.5 sm:h-9 sm:w-9 md:h-9 md:w-auto md:px-2.5 rounded-xl text-xs font-black shadow-md transition active:scale-90 flex items-center justify-center gap-1 cursor-pointer shrink-0 touch-manipulation select-none min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px]"
                title="IOIS AI चैटबॉट से सवाल पूछें"
                aria-label="Ask IOIS AI"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black animate-pulse shrink-0 drop-shadow" />
                <span className="hidden md:inline font-black text-black tracking-wide leading-none">AI</span>
              </button>

              {/* 3D Notification Bell Button */}
              {onOpenNotifications && (
                <button
                  id="nav-notifications-btn"
                  type="button"
                  onClick={onOpenNotifications}
                  className="btn-3d-gold h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer shadow-md active:scale-90 touch-manipulation relative min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px]"
                  title="सूचनाएं व संदेश (Notifications)"
                  aria-label="View notifications"
                >
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 drop-shadow" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-white animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Desktop User Session / Login Button System (Hidden on mobile < md, shown on md:) */}
              {currentUser ? (
                <div className="hidden md:flex items-center gap-1.5 shrink-0">
                  {/* Control Panel Button for Quick Admin Access */}
                  <button
                    type="button"
                    onClick={onOpenAdminLogin || (() => handleNavClick('admin'))}
                    className="btn-3d-ruby h-9 px-2.5 rounded-xl font-black text-xs transition cursor-pointer shrink-0 shadow-md active:scale-95 touch-manipulation select-none flex items-center justify-center gap-1 text-white"
                    title="एडमिन कंट्रोल पैनल खोलें"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-white shrink-0 drop-shadow" />
                    <span className="text-white font-black">Control Panel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('dashboard')}
                    className={`btn-3d-gold h-9 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-md touch-manipulation select-none active:scale-95 ${
                      currentPage === 'dashboard' ? 'ring-2 ring-white' : ''
                    }`}
                    title="यूज़र डैशबोर्ड खोलें"
                  >
                    <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-950 shrink-0 shadow-inner">
                      <img src={currentUser.photoUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                    </div>
                    <span className="max-w-[85px] truncate text-slate-950 font-black leading-none">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                  </button>

                  {/* 3D Rainbow Special Effect Invite & Earn Button (Desktop) */}
                  <button
                    id="nav-invite-earn-btn-desktop"
                    type="button"
                    onClick={() => {
                      if (onOpenReferralModal) onOpenReferralModal();
                      else handleNavClick('dashboard');
                    }}
                    className="btn-3d-rainbow-special h-9 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-lg active:scale-95 text-black"
                    title="Invite & Earn: 50%-70% इंसेंटिव रेफरल प्रोग्राम व प्रचार पोस्टर स्टूडियो"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-black animate-spin shrink-0" style={{ animationDuration: '3s' }} />
                    <span className="font-black text-black tracking-wide leading-none">Invite & Earn</span>
                    <span className="text-[9px] bg-black text-amber-300 px-1 py-0.2 rounded font-black leading-none shrink-0">70%</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('idcard')}
                    className="btn-3d-platinum h-9 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition cursor-pointer shrink-0 shadow-md active:scale-95"
                    title="डिजिटल ID कार्ड खोलें"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-indigo-950" />
                    <span className="text-indigo-950 font-black">ID कार्ड</span>
                  </button>

                  <button
                    type="button"
                    onClick={onLogout}
                    title="लॉगआउट करें"
                    className="h-9 w-9 p-1 rounded-xl bg-slate-900 hover:bg-red-950 text-slate-300 hover:text-red-400 border border-slate-800 transition cursor-pointer shrink-0 shadow-sm active:scale-95 flex items-center justify-center"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-1.5 shrink-0">
                  {/* 3D Ruby VIP Control Panel Button (Placed Strictly BEFORE सदस्य लॉगिन) */}
                  <button
                    id="nav-control-panel-btn-desktop"
                    type="button"
                    onClick={onOpenAdminLogin || (() => handleNavClick('admin'))}
                    className="btn-3d-ruby h-9 px-3 rounded-xl font-black text-xs transition cursor-pointer shrink-0 shadow-md active:scale-95 touch-manipulation select-none flex items-center justify-center gap-1.5 text-white"
                    title="एडमिन कंट्रोल पैनल लॉगिन"
                  >
                    <ShieldAlert className="w-4 h-4 text-white shrink-0 drop-shadow" />
                    <span className="text-white font-black tracking-wide leading-none whitespace-nowrap">Control Panel</span>
                  </button>

                  {/* 3D Silver Login Button */}
                  <button
                    id="nav-login-btn-desktop"
                    type="button"
                    onClick={onOpenLogin}
                    className="btn-3d-silver h-9 px-3.5 rounded-xl font-black text-xs transition cursor-pointer shrink-0 shadow-md active:scale-95 touch-manipulation select-none flex items-center justify-center gap-1.5"
                    title="सदस्य लॉगिन करें"
                  >
                    <LogIn className="w-4 h-4 text-slate-950 shrink-0 drop-shadow" />
                    <span className="text-slate-950 font-black tracking-wide leading-none whitespace-nowrap">सदस्य लॉगिन</span>
                  </button>

                  {/* 3D Rainbow Join Button (Desktop) */}
                  <button
                    id="nav-register-btn-desktop"
                    type="button"
                    onClick={() => {
                      if (onOpenRegister) onOpenRegister();
                      else handleNavClick('register');
                    }}
                    className="btn-3d-rainbow-special h-9 px-4 rounded-xl font-black text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 touch-manipulation select-none text-black"
                    title="नया सदस्य रजिस्ट्रेशन करें (Join Now)"
                  >
                    <UserPlus className="w-4 h-4 text-black shrink-0 drop-shadow" />
                    <span className="text-black font-black tracking-wide leading-none whitespace-nowrap">ज्वाइन करें</span>
                  </button>
                </div>
              )}

              {/* 4. MASTER MENU ICON BUTTON - 3D RAINBOW SPECIAL (ALWAYS VISIBLE ON ALL SCREENS) */}
              <button
                id="master-nav-menu-btn"
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="btn-3d-rainbow-special h-8.5 w-8.5 sm:h-9 sm:w-9 md:h-9 md:w-auto md:px-3 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-lg shrink-0 touch-manipulation select-none active:scale-90 text-black min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px]"
                title="सभी 17+ सेवाएं व मेन्यू विकल्प खोलें"
                aria-label="Toggle Navigation Menu"
              >
                {menuOpen ? (
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black drop-shadow shrink-0 stroke-[3]" />
                ) : (
                  <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black drop-shadow shrink-0 stroke-[3]" />
                )}
                <span className="hidden md:inline font-black text-black tracking-wide leading-none">मेन्यू</span>
              </button>

            </div>
          </div>

          {/* ================= ROW 2: DEDICATED MOBILE ACTION BAR (< md SCREENS) ================= */}
          {/* Guarantees that Login, Join, Dashboard, and ID Card buttons are 100% visible, perfectly aligned, and touch-friendly */}
          <div className="flex md:hidden items-center gap-1.5 w-full pt-1.5 border-t border-slate-800/80">
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className={`btn-3d-gold flex-1 h-10 min-h-[40px] px-2 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md touch-manipulation select-none active:scale-95 min-w-0 ${
                    currentPage === 'dashboard' ? 'ring-2 ring-white' : ''
                  }`}
                  title="यूज़र डैशबोर्ड खोलें"
                >
                  <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-slate-950 shrink-0 shadow-inner">
                    <img src={currentUser.photoUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                  </div>
                  <span className="truncate text-slate-950 font-black leading-none">
                    डैशबोर्ड
                  </span>
                </button>

                {/* 3D Rainbow Special Effect Invite & Earn Button (Mobile) */}
                <button
                  id="nav-invite-earn-btn-mobile"
                  type="button"
                  onClick={() => {
                    if (onOpenReferralModal) onOpenReferralModal();
                    else handleNavClick('dashboard');
                  }}
                  className="btn-3d-rainbow-special h-10 min-h-[40px] px-2.5 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 transition cursor-pointer shadow-md active:scale-95 text-black shrink-0"
                  title="Invite & Earn: अपना रेफरल लिंक, QR कोड व पोस्टर शेयर करें"
                >
                  <Sparkles className="w-3 h-3 text-black shrink-0" />
                  <span className="font-black text-black leading-none whitespace-nowrap">Invite</span>
                  <span className="text-[8.5px] bg-black text-amber-300 px-1 py-0.2 rounded font-black leading-none">70%</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('idcard')}
                  className="btn-3d-platinum h-10 min-h-[40px] px-2.5 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 transition cursor-pointer shadow-md active:scale-95 shrink-0"
                  title="डिजिटल ID कार्ड खोलें"
                >
                  <CreditCard className="w-3 h-3 text-indigo-950 shrink-0" />
                  <span className="text-indigo-950 font-black leading-none">ID कार्ड</span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  title="लॉगआउट करें"
                  className="h-10 min-h-[40px] w-10 min-w-[40px] rounded-xl bg-slate-900 hover:bg-red-950 text-slate-300 hover:text-red-400 border border-slate-800 transition cursor-pointer shadow-sm active:scale-95 flex items-center justify-center shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                {/* 3D Ruby VIP Control Panel Button */}
                <button
                  id="nav-control-panel-btn-mobile"
                  type="button"
                  onClick={onOpenAdminLogin || (() => handleNavClick('admin'))}
                  className="btn-3d-ruby h-10 min-h-[40px] px-2.5 sm:px-3 rounded-xl font-black text-[11px] sm:text-xs transition cursor-pointer shadow-md active:scale-95 touch-manipulation select-none flex items-center justify-center gap-1 text-white shrink-0"
                  title="एडमिन कंट्रोल पैनल लॉगिन"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-white shrink-0 drop-shadow" />
                  <span className="text-white font-black tracking-wide leading-none whitespace-nowrap">Admin</span>
                </button>

                {/* 3D Silver Login Button */}
                <button
                  id="nav-login-btn-mobile"
                  type="button"
                  onClick={onOpenLogin}
                  className="btn-3d-silver flex-1 h-10 min-h-[40px] px-2.5 rounded-xl font-black text-[11.5px] sm:text-xs transition cursor-pointer shadow-md active:scale-95 touch-manipulation select-none flex items-center justify-center gap-1.5 min-w-0"
                  title="सदस्य लॉगिन करें"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-950 shrink-0 drop-shadow" />
                  <span className="text-slate-950 font-black tracking-wide leading-none whitespace-nowrap">
                    लॉगिन
                  </span>
                </button>

                {/* 3D Rainbow Join Button (Mobile) */}
                <button
                  id="nav-register-btn-mobile"
                  type="button"
                  onClick={() => {
                    if (onOpenRegister) onOpenRegister();
                    else handleNavClick('register');
                  }}
                  className="btn-3d-rainbow-special flex-1 h-10 min-h-[40px] px-3 rounded-xl font-black text-[11.5px] sm:text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation select-none text-black min-w-0"
                  title="नया सदस्य रजिस्ट्रेशन करें (Join Now)"
                >
                  <UserPlus className="w-3.5 h-3.5 text-black shrink-0 drop-shadow" />
                  <span className="text-black font-black tracking-wide leading-none whitespace-nowrap">
                    ज्वाइन करें
                  </span>
                </button>
              </>
            )}
          </div>

        </div>

        {/* ================= UNIFIED UNIVERSAL NAVIGATION MENU (PC & MOBILE) ================= */}
        {menuOpen && (
          <div 
            style={{ backgroundColor: '#000000' }}
            className="mt-2 pt-3 border-t border-slate-800 space-y-3 bg-black backdrop-blur-2xl p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-amber-500/40 max-h-[82vh] overflow-y-auto shadow-[0_25px_80px_rgba(0,0,0,0.95)] animate-fadeIn"
          >
            
            {/* Top Bar inside Menu: 17+ Full Drawer, Dark/Light Mode, 3D Theme Color, Share, Close */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setServicesModalOpen(true);
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] transition cursor-pointer"
              >
                <Grid className="w-3.5 h-3.5 text-amber-400" />
                <span>17+ खोज डायरेक्टरी</span>
              </button>

              {onToggleMode && (
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  title="लाइट व डार्क मोड बदलें"
                >
                  {currentMode === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>लाइट मोड</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>डार्क मोड</span>
                    </>
                  )}
                </button>
              )}

              {onOpenThemeModal && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenThemeModal();
                  }}
                  className="btn-3d-palette p-2 sm:p-2.5 rounded-xl text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
                  title="3D थीम रंग पैलेट बदलें"
                >
                  <Palette className="w-3.5 h-3.5 text-black drop-shadow" />
                  <span className="text-black font-black tracking-wide">3D थीम रंग</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleShareOrCopy}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? 'लिंक कॉपी!' : 'शेयर पोर्टल'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition col-span-2 sm:col-span-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>मेन्यू बंद</span>
              </button>
            </div>

            {/* 3 Categorized New Headers with 11 Instant Popup Windows (Mobile Screen Optimized) */}
            <div className="pt-2 border-t border-slate-800">
              <MultiHeaderPopupNav
                variant="menu"
                onOpenPopupPage={(targetPage) => {
                  setMenuOpen(false);
                  if (onOpenPopupPage) onOpenPopupPage(targetPage);
                  else handleNavClick(targetPage);
                }}
                onOpenFestivalModal={() => {
                  setMenuOpen(false);
                  if (onOpenFestivalModal) onOpenFestivalModal();
                  else handleNavClick('panchang-rashifal');
                }}
                onOpenRashifalModal={() => {
                  setMenuOpen(false);
                  if (onOpenRashifalModal) onOpenRashifalModal();
                  else handleNavClick('panchang-rashifal');
                }}
                onOpenPhotoCompressor={() => {
                  setMenuOpen(false);
                  if (onOpenPhotoCompressor) onOpenPhotoCompressor();
                  else if (onOpenPopupPage) onOpenPopupPage('photo-compressor');
                }}
              />
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

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      if (onOpenReferralModal) onOpenReferralModal();
                      else handleNavClick('dashboard');
                    }}
                    className="btn-3d-rainbow-special px-3 py-2 rounded-xl text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] transition cursor-pointer shrink-0"
                    title="रेफरल प्रोग्राम व प्रचार पोस्टर स्टूडियो खोलें"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
                    <span className="font-black text-black">Invite & Earn (रेफरल हब)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('dashboard')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-sm cursor-pointer"
                  >
                    मेरा डैशबोर्ड खोलें →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-red-950 text-red-300 border border-slate-800 text-xs font-bold transition cursor-pointer"
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
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition cursor-pointer"
                  >
                    लॉगिन
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('register')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-xs font-black shadow-md transition hover:scale-105 cursor-pointer"
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
              <span className="text-[10px] text-slate-400">सभी 17+ सेवाएं स्क्रीन में सुरक्षित</span>
            </div>

            {/* Grid of All Services: Responsive 2 cols on phone, 3 on tablet, 4 on PC */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5">
              {allServicesQuickList.map((srv) => {
                const Icon = srv.icon;
                const isActive = currentPage === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => handleNavClick(srv.id)}
                    className={`p-3 min-h-[52px] rounded-2xl text-left transition flex items-center gap-2.5 border cursor-pointer group active:scale-98 touch-manipulation select-none ${
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
                  type="button"
                  onClick={() => handleNavClick('admin')}
                  className="text-red-400 hover:text-red-300 text-xs font-bold underline cursor-pointer"
                >
                  एडमिन पैनल
                </button>
                <span>•</span>
                <button
                  type="button"
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
