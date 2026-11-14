import React, { useState, useEffect } from 'react';
import { UserProfile, PageType } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
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
  Bell,
  Gauge,
  Play,
  Pause,
  Image as ImageIcon,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
import { MultiHeaderPopupNav } from './MultiHeaderPopupNav';
import { scrollAppToTop } from '../utils/scrollUtils';

interface NavbarProps {
  currentUser: UserProfile | null;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenChat: () => void;
  onOpenServices?: () => void;
  onOpenLogin: () => void;
  onOpenRegister?: () => void;
  onOpenSponsorAddMember?: (planId?: number) => void;
  onOpenSocialChatHub?: () => void;
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
  onOpenServices,
  onOpenLogin,
  onOpenRegister,
  onOpenSponsorAddMember,
  onOpenSocialChatHub,
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
  // "More" Modal state for all 17+ platform popup options
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);

  // Ticker running speed state: default to calm 'slow' (90s) for comfortable reading
  const [tickerSpeed, setTickerSpeed] = useState<'normal' | 'slow' | 'fast' | 'paused'>('slow');

  const tickerDuration = {
    slow: '90s',
    normal: '58s',
    fast: '32s',
    paused: '0s',
  }[tickerSpeed];

  const cycleTickerSpeed = () => {
    if (tickerSpeed === 'slow') setTickerSpeed('normal');
    else if (tickerSpeed === 'normal') setTickerSpeed('fast');
    else if (tickerSpeed === 'fast') setTickerSpeed('paused');
    else setTickerSpeed('slow');
  };

  const speedLabel = {
    normal: 'गति: सामान्य',
    slow: 'गति: धीमी',
    fast: 'गति: तेज़',
    paused: 'गति: रुकी',
  }[tickerSpeed];

  const handleNavOrPopup = (page: PageType) => {
    setIsMoreMenuOpen(false);
    if (onOpenPopupPage && page !== 'home') {
      onOpenPopupPage(page);
    } else {
      onNavigate(page);
      scrollAppToTop();
    }
  };

  // Full list of 17+ services inside "More" Popup
  const allServicesList = [
    {
      id: 'chat-help' as PageType,
      label: 'IOIS CHAT & HELP',
      desc: 'सदस्य चैट, ग्रुप, फोटो-वीडियो व प्रोफाइल',
      icon: MessageCircle,
      color: 'text-emerald-400',
      badge: 'लाइव सोशल',
      action: () => {
        setIsMoreMenuOpen(false);
        if (onOpenSocialChatHub) onOpenSocialChatHub();
        else handleNavOrPopup('chat-help');
      }
    },
    {
      id: 'panchang-rashifal' as PageType,
      label: 'पंचांग व मुहूर्त',
      desc: 'शुभ मुहूर्त, तिथि व चौघड़िया',
      icon: Clock,
      color: 'text-amber-400',
      badge: 'लाइव',
      action: () => {
        setIsMoreMenuOpen(false);
        if (onOpenFestivalModal) onOpenFestivalModal();
        else handleNavOrPopup('panchang-rashifal');
      }
    },
    {
      id: 'panchang-rashifal' as PageType,
      label: 'दैनिक 12 राशिफल',
      desc: 'आज का भविष्यफल व शुभ अंक',
      icon: Sparkles,
      color: 'text-purple-400',
      badge: '12 राशियां',
      action: () => {
        setIsMoreMenuOpen(false);
        if (onOpenRashifalModal) onOpenRashifalModal();
        else handleNavOrPopup('panchang-rashifal');
      }
    },
    {
      id: 'weather' as PageType,
      label: 'लाइव मौसम',
      desc: 'IMD रडार, तापमान व 7 दिन अलर्ट',
      icon: CloudSun,
      color: 'text-sky-400',
      badge: 'रडार',
      action: () => handleNavOrPopup('weather')
    },
    {
      id: 'jobs' as PageType,
      label: 'जॉब अलर्ट्स',
      desc: 'सरकारी व प्राइवेट भर्तियां',
      icon: Briefcase,
      color: 'text-emerald-400',
      badge: 'नई भर्तियां',
      action: () => handleNavOrPopup('jobs')
    },
    {
      id: 'plans' as PageType,
      label: '7 मास्टर प्लान',
      desc: '₹10 से ₹999 में 70% तक आय',
      icon: Crown,
      color: 'text-yellow-400',
      badge: '70% आय',
      action: () => handleNavOrPopup('plans')
    },
    {
      id: 'assessment' as PageType,
      label: 'करियर गाइड',
      desc: 'कौशल असेसमेंट व साक्षात्कार',
      icon: Compass,
      color: 'text-blue-400',
      badge: '2 मिनट टेस्ट',
      action: () => handleNavOrPopup('assessment')
    },
    {
      id: 'rtps-services' as PageType,
      label: 'सरकारी सेवा (RTPS)',
      desc: 'जाति, आय, निवास व जमीन रसीद',
      icon: FileText,
      color: 'text-teal-400',
      badge: 'नागरिक सेवा',
      action: () => handleNavOrPopup('rtps-services')
    },
    {
      id: 'student-study' as PageType,
      label: 'स्टडी व क्विज',
      desc: 'Class 1-12 NCERT नोट्स व सूत्र',
      icon: GraduationCap,
      color: 'text-indigo-400',
      badge: '100% फ्री',
      action: () => handleNavOrPopup('student-study')
    },
    {
      id: 'photo-compressor' as PageType,
      label: 'फोटो कंप्रेसर',
      desc: '20KB/50KB RTPS व नौकरी फॉर्म',
      icon: ImageIcon,
      color: 'text-pink-400',
      badge: '20-50KB',
      action: () => {
        setIsMoreMenuOpen(false);
        if (onOpenPhotoCompressor) onOpenPhotoCompressor();
        else handleNavOrPopup('photo-compressor');
      }
    },
    {
      id: 'parents' as PageType,
      label: 'अभिभावक सुरक्षा गाइड',
      desc: 'बाल सुरक्षा व डिजिटल मार्गदर्शन',
      icon: ShieldCheck,
      color: 'text-emerald-300',
      badge: 'सुरक्षा',
      action: () => handleNavOrPopup('parents')
    },
    {
      id: 'contact' as PageType,
      label: 'संपर्क केंद्र',
      desc: '24x7 हेल्पलाइन, FAQ व सपोर्ट',
      icon: PhoneCall,
      color: 'text-amber-300',
      badge: '24x7 Help',
      action: () => handleNavOrPopup('contact')
    },
    {
      id: 'idcard' as PageType,
      label: 'डिजिटल ID कार्ड',
      desc: '256-Bit स्मार्ट पहचान पत्र HD',
      icon: CreditCard,
      color: 'text-cyan-400',
      badge: 'स्मार्ट कार्ड',
      action: () => {
        setIsMoreMenuOpen(false);
        if (onOpenIdCard) onOpenIdCard();
        else handleNavOrPopup('idcard');
      }
    },
    {
      id: 'calculator' as PageType,
      label: 'अर्निंग कैलकुलेटर',
      desc: '50%-70% पेआउट लाइव सिमुलेटर',
      icon: Calculator,
      color: 'text-purple-400',
      badge: 'सिमुलेटर',
      action: () => handleNavOrPopup('calculator')
    },
    {
      id: 'news' as PageType,
      label: 'लाइव न्यूज़ व ई-अखबार',
      desc: '24x7 टीवी चैनल व राष्ट्रीय समाचार',
      icon: Tv,
      color: 'text-rose-400',
      badge: '24x7 Stream',
      action: () => handleNavOrPopup('news')
    },
    {
      id: 'mandi-market' as PageType,
      label: 'कृषि मंडी व गोल्ड रेट',
      desc: 'फसल भाव व 24K सोना-चांदी',
      icon: Scale,
      color: 'text-amber-400',
      badge: 'मंडी भाव',
      action: () => handleNavOrPopup('mandi-market')
    },
    {
      id: 'govt-schemes' as PageType,
      label: 'सरकारी योजना डायरेक्टरी',
      desc: 'आयुष्मान, PM किसान व कल्याण योजनाएं',
      icon: Building2,
      color: 'text-blue-400',
      badge: 'योजनाएं',
      action: () => handleNavOrPopup('govt-schemes')
    },
  ];

  return (
    <>
      {/* ================= ONLY 1 CLEAN HEADER AS REQUESTED (PERMANENTLY LOCKED TOP) ================= */}
      <header 
        id="main-header"
        className="relative shrink-0 w-full backdrop-blur-md border-b-2 transition-colors duration-200 select-none shadow-lg z-30"
        style={{
          backgroundColor: 'var(--surface-bg, #020617)',
          borderColor: 'var(--btn-border, #334155)',
          color: 'var(--text-primary, #ffffff)',
        }}
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col">
          
          {/* ================= LINE 1: RUNNING ANNOUNCEMENT TICKER + CORNER SPEED CONTROL BUTTON ================= */}
          <div 
            className="w-full border-b flex items-center justify-between px-2 sm:px-4 py-1 text-[10px] sm:text-[11px] overflow-hidden"
            style={{
              backgroundColor: 'var(--card-bg, #0f172a)',
              borderColor: 'var(--btn-border, #1e293b)',
            }}
          >
            {/* Running Announcement Text (Smooth Infinite Marquee Animation) */}
            <div className="flex-1 overflow-hidden relative mr-2 select-none">
              <div 
                className={`whitespace-nowrap flex items-center gap-6 font-bold ${
                  tickerSpeed === 'paused' ? '' : 'animate-marquee'
                }`}
                style={{
                  animationDuration: tickerDuration,
                  animationPlayState: tickerSpeed === 'paused' ? 'paused' : 'running',
                }}
              >
                {/* Track Set 1 */}
                <div className="flex items-center gap-6 shrink-0">
                  <span className="text-amber-300 flex items-center gap-1.5 shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>IOIS डिजिटल पोर्टल 2026: 7 मास्टर प्लान्स (₹10 से ₹999) में 50% से 70% तुरंत दैनिक इंसेंटिव</span>
                  </span>
                  <span className="text-slate-400 shrink-0">•</span>
                  <span className="text-emerald-300 shrink-0">
                    🛡️ 256-Bit एन्क्रिप्टेड वेरिफाइड डिजिटल ID कार्ड तुरंत जनरेट करें
                  </span>
                  <span className="text-slate-400 shrink-0">•</span>
                  <span className="text-sky-300 shrink-0">
                    🌤️ लाइव पंचांग, शुभ मुहूर्त, दैनिक 12 राशिफल, मौसम व RTPS नागरिक सेवाएं 24x7 उपलब्ध!
                  </span>
                  <span className="text-slate-400 shrink-0">•</span>
                  <span className="text-amber-200 shrink-0">
                    ⚡ पारदर्शी व सुरक्षित — 0% कटौती, सीधा आपके UPI खाते में दैनिक भुगतान!
                  </span>
                  <span className="text-slate-400 shrink-0">•</span>
                </div>

                {/* Track Set 2 (Seamless Infinite Running Loop) */}
                <div className="flex items-center gap-6 shrink-0" aria-hidden="true">
                  <span className="text-amber-300 flex items-center gap-1.5 shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>IOIS डिजिटल पोर्टल 2026: 7 मास्टर प्लान्स (₹10 से ₹999) में 50% से 70% तुरंत दैनिक इंसेंटिव</span>
                  </span>
                  <span className="text-slate-400 shrink-0">•</span>
                  <span className="text-emerald-300 shrink-0">
                    🛡️ 256-Bit एन्क्रिप्टेड वेरिफाइड डिजिटल ID कार्ड तुरंत जनरेट करें
                  </span>
                  <span className="text-slate-400 shrink-0">•</span>
                  <span className="text-sky-300 shrink-0">
                    🌤️ लाइव पंचांग, शुभ मुहूर्त, दैनिक 12 राशिफल, मौसम व RTPS नागरिक सेवाएं 24x7 उपलब्ध!
                  </span>
                  <span className="text-slate-400 shrink-0">•</span>
                  <span className="text-amber-200 shrink-0">
                    ⚡ पारदर्शी व सुरक्षित — 0% कटौती, सीधा आपके UPI खाते में दैनिक भुगतान!
                  </span>
                  <span className="text-slate-400 shrink-0">•</span>
                </div>
              </div>
            </div>

            {/* Corner Gati Control Button (गति कंट्रोल) */}
            <button
              type="button"
              onClick={cycleTickerSpeed}
              className="shrink-0 px-2 py-0.5 rounded-lg border flex items-center gap-1 text-[9.5px] sm:text-[10px] font-black transition cursor-pointer active:scale-95 shadow-sm"
              style={{
                backgroundColor: 'var(--btn-surface, #1e293b)',
                borderColor: 'var(--btn-border, #475569)',
                color: tickerSpeed === 'paused' ? '#ef4444' : 'var(--primary-accent, #f59e0b)',
              }}
              title="सूचना चलने की गति बदलें या रोकें"
              aria-label="Speed Control"
            >
              {tickerSpeed === 'paused' ? (
                <Play className="w-2.5 h-2.5 text-emerald-400" />
              ) : (
                <Gauge className="w-2.5 h-2.5 text-amber-400" />
              )}
              <span className="whitespace-nowrap font-bold">{speedLabel}</span>
            </button>
          </div>

          {/* ================= LINE 2 & 3: PLATFORM NAME & 3 MAIN BUTTONS + MORE BUTTON ================= */}
          <div className="px-2.5 sm:px-4 py-2 sm:py-2.5 flex flex-col gap-2">
            
            {/* LINE 2: Platform Name + Theme & Utility Controls */}
            <div className="flex items-center justify-between gap-2">
              
              {/* Platform Brand Title */}
              <div 
                className="flex items-center gap-2 cursor-pointer select-none min-w-0"
                onClick={() => {
                  onNavigate('home');
                  scrollAppToTop();
                }}
                title="मुख्य होम पेज पर जाएं"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl logo-3d-box p-0.5 shadow-md flex items-center justify-center shrink-0 border border-amber-400/80">
                  <div className="w-full h-full rounded-lg bg-slate-950 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] sm:text-[10px] font-black text-amber-400 leading-none">IOIS</span>
                    <span className="text-[6px] text-green-400 font-bold leading-none mt-0.5">INDIA</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h1 className="text-xs sm:text-base md:text-lg font-black tracking-tight leading-none whitespace-nowrap">
                      <span className="text-amber-400">IOIS</span>{' '}
                      <span style={{ color: 'var(--text-primary, #ffffff)' }}>DIGITAL PORTAL</span>
                    </h1>
                    <span className="inline-flex bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[7px] sm:text-[8px] font-black px-1.5 py-0.2 rounded-full items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      <span>VERIFIED</span>
                    </span>
                  </div>
                  <p className="text-[7.5px] sm:text-[8.5px] uppercase tracking-wider font-extrabold leading-none mt-0.5 whitespace-nowrap text-amber-300">
                    <span className="sm:hidden">भारतीय ऑनलाइन आय सहयोग प्रणाली</span>
                    <span className="hidden sm:inline">INDIAN ONLINE INCOME SUPPORTING SYSTEM</span>
                  </p>
                </div>
              </div>

              {/* Utility Icons: Dark/Light Mode + 3D Palette + Help Chat (Neat & Compact) */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {onToggleMode && (
                  <button
                    type="button"
                    onClick={onToggleMode}
                    className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-400 text-slate-200 transition cursor-pointer flex items-center justify-center shrink-0 active:scale-90"
                    title={currentMode === 'dark' ? "लाइट मोड" : "डार्क मोड"}
                  >
                    {currentMode === 'dark' ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                  </button>
                )}

                {onOpenThemeModal && (
                  <button
                    type="button"
                    onClick={onOpenThemeModal}
                    className="btn-3d-palette h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-xl flex items-center justify-center shrink-0 cursor-pointer shadow-md active:scale-90"
                    title="थीम रंग बदलें"
                  >
                    <Palette className="w-3.5 h-3.5 text-black" />
                  </button>
                )}

                {/* IOIS Help Chat Button */}
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="btn-3d-rainbow h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-xl flex items-center justify-center shrink-0 cursor-pointer shadow-md active:scale-90 text-black font-black"
                  title="IOIS हेल्प चैट खोलें"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
                </button>

                {onOpenNotifications && (
                  <button
                    type="button"
                    onClick={onOpenNotifications}
                    className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-xl bg-slate-900 border border-slate-700/80 text-amber-400 flex items-center justify-center shrink-0 cursor-pointer active:scale-90 relative"
                    title="सूचनाएं"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* ================= LINE 3: EXACTLY 3 MAIN BUTTONS (ADMIN, LOGIN, JOIN NOW) + MORE BUTTON ================= */}
            {/* Auto-adjusts cleanly on any screen width with zero clipping or text overflow */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full pt-1">
              
              {/* BUTTON 1: ADMIN (कंट्रोल पैनल / एडमिन लॉगिन) */}
              <button
                id="header-btn-admin"
                type="button"
                onClick={onOpenAdminLogin || (() => onNavigate('admin'))}
                className="btn-3d-ruby h-9 min-h-[36px] px-1.5 sm:px-3 rounded-xl font-black text-[10px] sm:text-xs transition cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 text-white truncate"
                title="एडमिन कंट्रोल पैनल"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate">Admin</span>
              </button>

              {/* BUTTON 2: LOGIN (सदस्य लॉगिन / डैशबोर्ड) */}
              {currentUser ? (
                <button
                  id="header-btn-dashboard"
                  type="button"
                  onClick={onOpenDashboard || (() => onNavigate('dashboard'))}
                  className="btn-3d-gold h-9 min-h-[36px] px-1.5 sm:px-3 rounded-xl font-black text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition cursor-pointer shadow-md active:scale-95 text-slate-950 truncate"
                  title="मेरा डैशबोर्ड खोलें"
                >
                  <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-slate-950 shrink-0">
                    <img
                      src={currentUser.photoUrl?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="truncate">डैशबोर्ड</span>
                </button>
              ) : (
                <button
                  id="header-btn-login"
                  type="button"
                  onClick={onOpenLogin}
                  className="btn-3d-silver h-9 min-h-[36px] px-1.5 sm:px-3 rounded-xl font-black text-[10px] sm:text-xs transition cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 text-slate-950 truncate"
                  title="सदस्य लॉगिन करें"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                  <span className="truncate">Login</span>
                </button>
              )}

              {/* BUTTON 3: JOIN NOW (GUEST ONLY) OR SPONSOR ADD MEMBER (LOGGED IN) */}
              {currentUser ? (
                <button
                  id="header-btn-sponsor-add"
                  type="button"
                  onClick={() => {
                    if (onOpenSponsorAddMember) onOpenSponsorAddMember(1);
                    else if (onOpenSocialChatHub) onOpenSocialChatHub();
                  }}
                  className="btn-3d-rainbow-special h-9 min-h-[36px] px-1.5 sm:px-3 rounded-xl font-black text-[10px] sm:text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-black truncate"
                  title="अपने स्पॉन्सर ID से नया सदस्य जोड़ें"
                >
                  <UserPlus className="w-3.5 h-3.5 text-black shrink-0" />
                  <span className="truncate">सदस्य जोड़ें</span>
                </button>
              ) : (
                <button
                  id="header-btn-join"
                  type="button"
                  onClick={() => {
                    if (onOpenRegister) onOpenRegister();
                    else onNavigate('register');
                  }}
                  className="btn-3d-rainbow-special h-9 min-h-[36px] px-1.5 sm:px-3 rounded-xl font-black text-[10px] sm:text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-black truncate"
                  title="नया सदस्य रजिस्ट्रेशन करें (Join Now)"
                >
                  <UserPlus className="w-3.5 h-3.5 text-black shrink-0" />
                  <span className="truncate">Join Now</span>
                </button>
              )}

              {/* BUTTON 4: MORE BUTTON (और देखें / सभी 17+ सेवाएं व पॉपअप) */}
              <button
                id="header-btn-more"
                type="button"
                onClick={() => setIsMoreMenuOpen(true)}
                className="btn-3d-dark h-9 min-h-[36px] px-1.5 sm:px-3 rounded-xl font-black text-[10px] sm:text-xs transition cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 text-amber-300 border-amber-500/60 truncate"
                title="सभी 17+ सेवाएं व पॉपअप खोलें"
              >
                <Grid className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">More...</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* ================= MORE (और देखें) FULL SERVICE POPUP MODAL ================= */}
      {/* Clicking any button here opens its corresponding POPUP window as requested */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl sm:rounded-3xl border-2 border-amber-400/80 shadow-2xl overflow-hidden"
            style={{
              backgroundColor: 'var(--card-bg, #0f172a)',
              color: 'var(--text-primary, #ffffff)',
            }}
          >
            {/* Modal Header */}
            <div 
              className="px-4 py-3 border-b flex items-center justify-between shrink-0"
              style={{
                backgroundColor: 'var(--surface-bg, #020617)',
                borderColor: 'var(--btn-border, #334155)',
              }}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white">
                    IOIS 17+ डिजिटल सेवाएं व पॉपअप डायरेक्टरी
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    किसी भी सेवा पर क्लिक करें, उसका लाइव पॉपअप तुरंत खुल जाएगा
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
                title="बंद करें"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Scrollable with generous gaps between buttons */}
            <div className="p-3 sm:p-5 overflow-y-auto space-y-4">
              
              {/* Top Quick Actions Banner */}
              <div 
                className="p-3 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                style={{
                  backgroundColor: 'var(--surface-bg, #020617)',
                  borderColor: 'var(--btn-border, #1e293b)'
                }}
              >
                <div className="space-y-0.5">
                  <span className="text-[9.5px] uppercase font-black text-amber-400 tracking-wider">
                    ⚡ त्वरित शॉर्टकट
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-white">
                    मुख्य पोर्टल क्रियाएं
                  </h4>
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                  {currentUser ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          if (onOpenSponsorAddMember) onOpenSponsorAddMember(1);
                        }}
                        className="btn-3d-rainbow-special px-3 py-1.5 rounded-xl text-xs font-black text-black cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-black" />
                        <span>अपने स्पॉन्सर से जोड़ें</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          if (onOpenSocialChatHub) onOpenSocialChatHub();
                          else handleNavOrPopup('chat-help');
                        }}
                        className="btn-3d-gold px-3 py-1.5 rounded-xl text-xs font-black text-slate-950 cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-slate-950" />
                        <span>IOIS CHAT & HELP</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          if (onOpenRegister) onOpenRegister();
                          else onNavigate('register');
                        }}
                        className="btn-3d-rainbow-special px-3 py-1.5 rounded-xl text-xs font-black text-black cursor-pointer shadow-sm active:scale-95"
                      >
                        नया रजिस्ट्रेशन
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          onOpenLogin();
                        }}
                        className="btn-3d-silver px-3 py-1.5 rounded-xl text-xs font-black text-slate-950 cursor-pointer shadow-sm active:scale-95"
                      >
                        सदस्य लॉगिन
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenChat();
                    }}
                    className="btn-3d-rainbow px-3 py-1.5 rounded-xl text-xs font-black text-black cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-black" />
                    <span>IOIS AI चैट</span>
                  </button>
                </div>
              </div>

              {/* 3 Categorized Headers (वैदिक, शिक्षा, नागरिक) */}
              <div className="pt-1">
                <MultiHeaderPopupNav
                  variant="menu"
                  onOpenPopupPage={(page) => {
                    setIsMoreMenuOpen(false);
                    if (onOpenPopupPage) onOpenPopupPage(page);
                    else onNavigate(page);
                  }}
                  onOpenFestivalModal={() => {
                    setIsMoreMenuOpen(false);
                    if (onOpenFestivalModal) onOpenFestivalModal();
                    else handleNavOrPopup('panchang-rashifal');
                  }}
                  onOpenRashifalModal={() => {
                    setIsMoreMenuOpen(false);
                    if (onOpenRashifalModal) onOpenRashifalModal();
                    else handleNavOrPopup('panchang-rashifal');
                  }}
                  onOpenPhotoCompressor={() => {
                    setIsMoreMenuOpen(false);
                    if (onOpenPhotoCompressor) onOpenPhotoCompressor();
                    else handleNavOrPopup('photo-compressor');
                  }}
                />
              </div>

              {/* Grid of All Services: Clean 2 cols on mobile, 3 on tablet, 4 on desktop */}
              {/* Spacing between buttons is generous (gap-2.5 sm:gap-3) to avoid miss-clicks */}
              <div className="pt-2 border-t border-slate-800">
                <div className="text-[10px] sm:text-[11px] uppercase font-black text-amber-400 mb-2 flex items-center justify-between">
                  <span>सभी 17+ IOIS सेवाएं (1-Click Popup Result):</span>
                  <span className="text-slate-400 font-normal">पॉपअप विंडो में खुलेंगी</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                  {allServicesList.map((srv, idx) => {
                    const Icon = srv.icon;
                    return (
                      <button
                        key={`${srv.id}-${idx}`}
                        type="button"
                        onClick={srv.action}
                        className="p-3 rounded-2xl text-left transition flex items-center gap-3 border cursor-pointer group active:scale-98 touch-manipulation select-none"
                        style={{
                          backgroundColor: 'var(--surface-bg, #020617)',
                          borderColor: 'var(--btn-border, #334155)',
                        }}
                      >
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 group-hover:scale-110 transition">
                          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${srv.color}`} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs sm:text-sm font-black text-white truncate">
                              {srv.label}
                            </span>
                            <span className="text-[8.5px] px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-300 border border-slate-700 font-bold shrink-0">
                              {srv.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {srv.desc}
                          </p>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0 transition" />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div 
              className="px-4 py-2.5 border-t flex items-center justify-between text-xs shrink-0"
              style={{
                backgroundColor: 'var(--surface-bg, #020617)',
                borderColor: 'var(--btn-border, #334155)',
              }}
            >
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>सभी सेवाएं सत्यापित व 24x7 एक्टिव</span>
              </div>

              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(false)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                बंद करें
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
