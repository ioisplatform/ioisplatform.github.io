import React, { useState } from 'react';
import { UserProfile, PageType } from '../types';
import { 
  ShieldCheck, 
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
  ChevronDown,
  Grid
} from 'lucide-react';
import { IoisServicesDrawerModal } from './IoisServicesDrawerModal';

interface NavbarProps {
  currentUser: UserProfile | null;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenChat: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentUser,
  currentPage,
  onNavigate,
  onOpenChat, 
  onOpenLogin,
  onLogout,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [servicesModalOpen, setServicesModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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
    onNavigate(page);
    setMobileMenuOpen(false);
    setServicesModalOpen(false);
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
    { id: 'rtps-services' as PageType, label: 'RTPS व जमीन', icon: FileText },
    { id: 'plans' as PageType, label: '7 मास्टर प्लान', icon: Crown },
    { id: 'student-study' as PageType, label: 'विद्यार्थी पोर्टल', icon: GraduationCap },
    { id: 'calculator' as PageType, label: 'कैलकुलेटर', icon: Calculator },
    { id: 'entertainment' as PageType, label: 'मनोरंजन व चैट', icon: Film },
    { id: 'weather' as PageType, label: 'लाइव मौसम', icon: CloudSun },
    { id: 'news' as PageType, label: 'लाइव टीवी', icon: Tv },
    { id: 'idcard' as PageType, label: 'ID कार्ड', icon: CreditCard },
  ];

  return (
    <>
      <header id="main-header" className="bg-slate-950/95 backdrop-blur-xl border-b border-amber-500/20 py-3 px-4 sm:px-6 sticky top-0 z-40 transition-all">
        <div className="container mx-auto flex items-center justify-between gap-3">
          
          {/* Brand / Logo (Always connects back to Home Page) */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => handleNavClick('home')}
            title="मुख्य होम पेज पर जाएं"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-amber-400 bg-gradient-to-tr from-amber-500 via-yellow-400 to-green-500 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] sm:text-[11px] font-black text-amber-400 leading-none">IOIS</span>
                <span className="text-[7px] text-green-400 font-bold leading-none mt-0.5">INDIA</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="tiranga-text text-lg sm:text-xl font-black tracking-tight">IOIS PLATFORM</h1>
                <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>OFFICIAL PORTAL</span>
                </span>
              </div>
              <p className="gold-metallic-text text-[8px] sm:text-[9px] uppercase tracking-widest font-semibold">
                Indian Online Income Supporting System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-300 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
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

            {/* Special All Services Modal Trigger Button */}
            <button
              onClick={() => setServicesModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl font-black transition cursor-pointer bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 hover:text-white hover:bg-amber-500/30 flex items-center gap-1.5 border border-amber-500/40 shadow-sm"
              title="सभी IOIS सेवाओं का मेन्यू खोलें"
            >
              <Grid className="w-3.5 h-3.5 text-amber-400" />
              <span>IOIS सेवाएं (17+)</span>
            </button>
          </nav>

          {/* Right Side Buttons: Share, Admin, User Login/Dashboard, AI, Corner Menu */}
          <div className="flex items-center gap-2">
            
            {/* Corner All Services Button for Quick Access */}
            <button
              onClick={() => setServicesModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 border border-amber-500/50 hover:border-amber-400 text-amber-300 px-3 py-1.5 rounded-full text-xs font-black transition cursor-pointer shadow-md"
              title="सभी 17+ IOIS सेवाएं"
            >
              <Grid className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">IOIS सेवाएं</span>
            </button>

            {/* Share Button */}
            <button
              id="nav-share-btn"
              onClick={handleShareOrCopy}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer"
              title="लिंक कॉपी या शेयर करें"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden lg:inline">{copied ? 'कॉपी!' : 'शेयर'}</span>
            </button>

            {/* User Session / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`border px-3.5 py-1.5 rounded-full font-black text-xs flex items-center gap-1.5 transition cursor-pointer ${
                    currentPage === 'dashboard'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300'
                  }`}
                  title="यूजर डैशबोर्ड खोलें"
                >
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-amber-400 shrink-0">
                    <img src={currentUser.photoUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                  </div>
                  <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentUser.fullName}</span>
                </button>

                <button
                  onClick={onLogout}
                  title="लॉगआउट करें"
                  className="p-1.5 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-full border border-slate-800 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="nav-login-btn"
                  onClick={onOpenLogin}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>लॉगिन</span>
                </button>

                <button
                  id="nav-register-btn"
                  onClick={() => handleNavClick('register')}
                  className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 px-3.5 py-1.5 rounded-full font-black text-xs shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>रजिस्ट्रेशन / Join Now</span>
                </button>
              </div>
            )}

            {/* AI Chat Button */}
            <button
              id="nav-ai-chat-btn"
              onClick={onOpenChat}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 hover:border-amber-400 text-amber-300 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold shadow-md transition cursor-pointer"
              title="Ask AI Chatbot"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">AI</span>
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 bg-slate-900 text-slate-300 hover:text-white rounded-xl border border-slate-800 cursor-pointer"
              title="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-slate-800/80 space-y-3 bg-slate-950/98 p-4 rounded-3xl border border-slate-800 max-h-[80vh] overflow-y-auto shadow-2xl">
            
            {/* Primary All Services Big Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setServicesModalOpen(true);
              }}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-slate-950 font-black text-xs flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                <span>सभी 17+ IOIS सेवाएं व पेज (Open All Services)</span>
              </div>
              <span>→</span>
            </button>

            <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 px-2 pt-1">
              त्वरित नेविगेशन (Quick Links):
            </div>

            <div className="grid grid-cols-2 gap-2">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`p-2.5 rounded-xl text-left text-xs font-bold transition flex items-center gap-2 border ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNavClick('admin')}
                className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>एडमिन पैनल</span>
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>हेल्पलाइन / FAQ</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global IOIS Services Modal (Opened via corner button or menu) */}
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
