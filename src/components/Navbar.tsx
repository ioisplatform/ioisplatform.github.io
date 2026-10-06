import React, { useState } from 'react';
import { MemberProfile } from '../types';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { 
  Menu, 
  X, 
  CreditCard, 
  BookOpen, 
  Share2, 
  UserCheck, 
  Bot, 
  Pencil,
  Tv,
  LogOut,
  GraduationCap,
  FileCheck2,
  Layers,
  PhoneCall,
  ShieldCheck,
  LogIn
} from 'lucide-react';

interface NavbarProps {
  currentUser: MemberProfile | null;
  onOpenAiModal: (initialPrompt?: string) => void;
  onOpenRegistrationModal: (planId?: string) => void;
  onOpenLoginModal: () => void;
  onOpenDashboardModal: () => void;
  onOpenIdCardModal: () => void;
  onOpenStudyModal: (planId: string) => void;
  onOpenVideoModal: () => void;
  onOpenTracingModal: () => void;
  onOpenHomeworkModal: () => void;
  onOpenPlansModal: () => void;
  onOpenNurseryWorkbook?: () => void;
  onOpenAdminModal?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAiModal,
  onOpenRegistrationModal,
  onOpenLoginModal,
  onOpenDashboardModal,
  onOpenIdCardModal,
  onOpenStudyModal,
  onOpenVideoModal,
  onOpenTracingModal,
  onOpenHomeworkModal,
  onOpenPlansModal,
  onOpenNurseryWorkbook,
  onOpenAdminModal,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const siteSettings = useSiteSettings();
  const cleanPhone = siteSettings.helplineWhatsapp.replace(/\D/g, '') || '918877490845';

  const handleNavClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  const handleShare = () => {
    const text = "IOIS डिजिटल शिक्षा: 7 अध्ययन योजनाएं, सचित्र NCERT नोट्स, वीडियो कक्षाएं, डिजिटल अक्षर स्लेट व AI शिक्षक। पोर्टल: https://ioisplatform.github.io/student/";
    if (navigator.share) {
      navigator.share({ title: 'IOIS Student Portal', text: text, url: 'https://ioisplatform.github.io/student/' });
    } else {
      navigator.clipboard.writeText(text);
      alert('IOIS छात्र सेवा पोर्टल लिंक कॉपी हो गया!');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-xs text-slate-800">
      
      {/* 🇮🇳 IOIS INDIA National Postal Tricolor Band */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#991b1b] via-[#ea580c] via-white via-[#1e3a8a] to-[#15803d]" />
      
      {/* Top Banking-Style Announcement & Service Support Bar */}
      <div className="bg-[#991b1b] text-white text-xs py-1.5 px-3 sm:px-4 border-b border-red-950 overflow-hidden w-full max-w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-hidden w-full">
          <div className="flex items-center space-x-2 overflow-hidden min-w-0">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded tracking-wide uppercase shrink-0 shadow-xs">
              IOIS INDIA
            </span>
            <span className="truncate text-red-100 font-bold text-[11px] min-w-0">
              {siteSettings.helplineNoticeBanner || '🇮🇳 भारत का आधिकारिक डिजिटल शिक्षा मंच • कक्षा 1 से 12 एवं बाल विकास किट'}
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 shrink-0 text-[11px]">
            {siteSettings.contactButtonEnabled && (
              <a 
                href={`https://api.whatsapp.com/send?phone=${cleanPhone}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-200 hover:text-white font-bold flex items-center gap-1 transition-colors"
              >
                <PhoneCall className="w-3 h-3 text-amber-300" />
                <span>हेल्पलाइन: {siteSettings.helplinePhone}</span>
              </a>
            )}
            <span className="text-red-300">•</span>
            <button 
              onClick={handleShare}
              className="text-red-100 hover:text-white transition-colors flex items-center gap-1"
            >
              <Share2 className="w-3 h-3 text-amber-300" />
              <span>शेयर</span>
            </button>
            {onOpenAdminModal && (
              <>
                <span className="text-red-300">•</span>
                <button
                  onClick={onOpenAdminModal}
                  className="hover:text-amber-200 text-amber-300 font-bold transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-amber-300" />
                  <span>एडमिन</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo — IOIS INDIA Red & Navy Emblem */}
          <div 
            onClick={() => onOpenPlansModal()}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group min-w-0 shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#991b1b] to-[#1e3a8a] flex items-center justify-center font-black text-white text-base shadow-md group-hover:scale-105 transition-transform border border-amber-300/40 shrink-0">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-base sm:text-lg lg:text-xl tracking-tight text-slate-900 truncate">
                  IOIS INDIA <span className="text-[#991b1b]">शिक्षा केंद्र</span>
                </span>
                <span className="hidden md:inline-block bg-red-100 text-[#991b1b] text-[10px] font-black px-1.5 py-0.5 rounded border border-red-200 shrink-0">
                  सत्यापित
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold leading-none truncate hidden sm:block">
                National Digital Student Services
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links — IOIS INDIA Clear Services */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-bold text-slate-700">
            
            {/* 1. Plans */}
            <button
              onClick={onOpenPlansModal}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors flex items-center gap-1.5 font-bold"
            >
              <Layers className="w-3.5 h-3.5 text-[#991b1b]" />
              <span>7 योजनाएं</span>
            </button>

            {/* 2. Nursery A-Z Workbook */}
            {onOpenNurseryWorkbook && (
              <button
                onClick={onOpenNurseryWorkbook}
                className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 transition-all flex items-center gap-1.5 font-black border border-amber-200 shadow-2xs"
              >
                <span className="text-sm">🔤</span>
                <span>नर्सरी A-Z</span>
                <span className="bg-[#991b1b] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">26 P</span>
              </button>
            )}

            {/* 3. Study Notes & NCERT 1-12 Question Bank */}
            <button
              onClick={() => onOpenStudyModal(currentUser ? currentUser.planId : 'plan-01')}
              className="px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 transition-colors flex items-center gap-1.5 font-black border border-orange-200 shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-600" />
              <span>NCERT 1-12 प्रश्न बैंक</span>
            </button>

            {/* 3.1 B.Pharm 4th Semester Platform */}
            <button
              onClick={() => onOpenStudyModal('plan-01')}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 transition-colors flex items-center gap-1.5 font-black border border-indigo-200"
            >
              <span className="text-xs">💊</span>
              <span>फार्मेसी Sem-4</span>
            </button>

            {/* 4. Video Lessons */}
            <button
              onClick={onOpenVideoModal}
              className="px-3 py-2 rounded-xl hover:bg-red-50 text-slate-800 hover:text-red-700 transition-colors flex items-center gap-1.5 font-bold"
            >
              <Tv className="w-3.5 h-3.5 text-red-600" />
              <span>वीडियो कक्षाएं</span>
            </button>

            {/* 5. Tracing Pad */}
            <button
              onClick={onOpenTracingModal}
              className="px-3 py-2 rounded-xl hover:bg-purple-50 text-slate-800 hover:text-purple-700 transition-colors flex items-center gap-1.5 font-bold"
            >
              <Pencil className="w-3.5 h-3.5 text-purple-600" />
              <span>डिजिटल स्लेट</span>
            </button>

            {/* 6. Daily Homework */}
            <button
              onClick={onOpenHomeworkModal}
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 transition-colors flex items-center gap-1.5 font-bold"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>दैनिक गृहकार्य</span>
            </button>

            {/* 7. Student ID Card */}
            <button
              onClick={onOpenIdCardModal}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors flex items-center gap-1.5 font-bold"
            >
              <CreditCard className="w-3.5 h-3.5 text-slate-600" />
              <span>छात्र ID</span>
            </button>
          </nav>

          {/* Desktop Right Action Buttons (ONLY visible on Desktop lg: >=1024px) */}
          <div className="hidden lg:flex items-center space-x-2 shrink-0">
            {/* AI Tutor Assistant */}
            <button
              onClick={() => onOpenAiModal('छात्र के रूप में पढ़ाई की योजना बताएं')}
              className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4 text-purple-700" />
              <span>AI ट्यूटर</span>
            </button>

            {/* Auth / Dashboard Controls */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenDashboardModal}
                  className="px-4 py-2 rounded-xl bg-[#991b1b] text-white hover:bg-red-800 text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all border border-amber-300 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-amber-300" />
                  <span>छात्र डैशबोर्ड</span>
                </button>

                <button
                  onClick={onLogout}
                  title="लॉगआउट"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors border border-slate-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenRegistrationModal('plan-01')}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 text-xs font-black shadow-xs flex items-center space-x-1.5 transition-all border border-amber-300 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-950" />
                  <span>विद्यार्थी पंजीकरण</span>
                </button>

                <button
                  onClick={onOpenLoginModal}
                  className="px-3.5 py-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-black shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300" />
                  <span>विद्यार्थी लॉगिन</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Header Action & Menu Toggle (Clean, Non-Crowded, Never Cut Off) */}
          <div className="flex lg:hidden items-center space-x-1.5 sm:space-x-2 shrink-0">
            {!currentUser ? (
              <button
                onClick={onOpenLoginModal}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>लॉगिन</span>
              </button>
            ) : (
              <button
                onClick={onOpenDashboardModal}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#991b1b] text-white text-xs font-black shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>डैशबोर्ड</span>
              </button>
            )}

            {/* Menu Toggle Button (Proper Touch Target & High Visibility) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center justify-center focus:outline-none transition-colors shrink-0 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile IOIS INDIA Services Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-150">
          
          {/* Mobile Top Authentication & Identity Card */}
          {currentUser ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 border border-blue-200 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <span className="text-xs font-black text-slate-900 block truncate">
                    नमस्ते, {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    रोल: {currentUser.rollNumber || currentUser.memberId}
                  </span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                  सक्रिय किट
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick(onOpenDashboardModal)}
                  className="w-full py-2 px-2 bg-[#991b1b] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>डैशबोर्ड खोलें</span>
                </button>
                <button
                  onClick={() => handleNavClick(onLogout)}
                  className="w-full py-2 px-2 bg-white text-red-700 hover:bg-red-50 border border-red-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>लॉगआउट</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border border-amber-300 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#991b1b] flex items-center gap-1">
                  <span>🇮🇳</span>
                  <span>IOIS विद्यार्थी सेवा केंद्र</span>
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#991b1b] text-white">
                  कक्षा 1 से 12
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick(() => onOpenRegistrationModal('plan-01'))}
                  className="w-full py-2.5 px-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-xs border border-amber-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                  <span>नया पंजीकरण</span>
                </button>
                <button
                  onClick={() => handleNavClick(onOpenLoginModal)}
                  className="w-full py-2.5 px-2 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>छात्र लॉगिन</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Quick Service Grid (IOIS INDIA Tiles) */}
          <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-xs">
            {onOpenNurseryWorkbook && (
              <button
                onClick={() => handleNavClick(onOpenNurseryWorkbook)}
                className="col-span-2 p-2.5 rounded-xl bg-amber-50 text-amber-900 text-left border border-amber-200 flex items-center justify-between shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🔤</span>
                  <span className="font-black">नर्सरी A-Z वर्कबुक (26 Pages)</span>
                </div>
                <span className="bg-[#991b1b] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">A4 Print</span>
              </button>
            )}
            <button
              onClick={() => handleNavClick(onOpenPlansModal)}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left border border-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-100"
            >
              <Layers className="w-4 h-4 text-[#991b1b]" />
              <span>7 अध्ययन योजनाएं</span>
            </button>
            <button
              onClick={() => handleNavClick(() => onOpenStudyModal(currentUser ? currentUser.planId : 'plan-01'))}
              className="p-2.5 rounded-xl bg-orange-50 text-orange-950 text-left border border-orange-200 flex items-center gap-2 font-black cursor-pointer hover:bg-orange-100"
            >
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span>NCERT 1-12 प्रश्न बैंक</span>
            </button>
            <button
              onClick={() => handleNavClick(() => onOpenStudyModal('plan-01'))}
              className="p-2.5 rounded-xl bg-indigo-50 text-indigo-950 text-left border border-indigo-200 flex items-center gap-2 font-black cursor-pointer hover:bg-indigo-100"
            >
              <span className="text-base">💊</span>
              <span>फार्मेसी 4th Sem (PCI)</span>
            </button>
            <button
              onClick={() => handleNavClick(onOpenVideoModal)}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left border border-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-100"
            >
              <Tv className="w-4 h-4 text-red-600" />
              <span>वीडियो कक्षाएं</span>
            </button>
            <button
              onClick={() => handleNavClick(onOpenTracingModal)}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left border border-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-100"
            >
              <Pencil className="w-4 h-4 text-purple-600" />
              <span>डिजिटल स्लेट</span>
            </button>
            <button
              onClick={() => handleNavClick(onOpenHomeworkModal)}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left border border-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-100"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>दैनिक गृहकार्य</span>
            </button>
            <button
              onClick={() => handleNavClick(onOpenIdCardModal)}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-left border border-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-100"
            >
              <CreditCard className="w-4 h-4 text-slate-700" />
              <span>छात्र ID कार्ड</span>
            </button>
            <button
              onClick={() => handleNavClick(() => onOpenAiModal())}
              className="col-span-2 p-2.5 rounded-xl bg-purple-50 text-purple-900 text-left border border-purple-200 flex items-center gap-2 cursor-pointer hover:bg-purple-100"
            >
              <Bot className="w-4 h-4 text-purple-700" />
              <span>24x7 AI ट्यूटर से पूछें</span>
            </button>
          </div>

          {/* Quick Helpline in Drawer */}
          {siteSettings.contactButtonEnabled && (
            <div className="pt-2 border-t border-slate-200">
              <a
                href={`https://api.whatsapp.com/send?phone=${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>आधिकारिक हेल्पलाइन: {siteSettings.helplinePhone}</span>
              </a>
            </div>
          )}

        </div>
      )}

    </header>
  );
};
