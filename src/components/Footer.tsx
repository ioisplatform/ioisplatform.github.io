import React from 'react';
import { OFFICIAL_TELEGRAM_URL, OFFICIAL_EMAIL } from '../data/plansData';
import { PageType, UserProfile } from '../types';
import { 
  Send, 
  Mail,
  ShieldCheck, 
  Lock, 
  Unlock, 
  FileText, 
  AlertTriangle, 
  PhoneCall, 
  UserPlus, 
  LogIn, 
  CreditCard, 
  LayoutDashboard, 
  Share2, 
  Crown, 
  HelpCircle,
  Users
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: PageType) => void;
  currentUser?: UserProfile | null;
  sponsorId?: string;
  currentPage?: PageType;
  onOpenLogin?: (mode?: 'login' | 'forgot_password' | 'forgot_user_id') => void;
  onOpenRegister?: (planId?: number, sponsorId?: string) => void;
  onOpenDashboard?: () => void;
  onOpenIdCard?: () => void;
  onOpenSponsorCard?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate,
  currentUser,
  sponsorId = '',
  currentPage,
  onOpenLogin,
  onOpenRegister,
  onOpenDashboard,
  onOpenIdCard,
  onOpenSponsorCard,
}) => {
  const cleanSponsorId = sponsorId ? sponsorId.trim().toUpperCase() : '';
  const hasSponsor = Boolean(cleanSponsorId);
  const isLoggedIn = Boolean(currentUser);

  // Compact streamlined footer for admin console so all admin options remain clear
  if (currentPage === 'admin') {
    return (
      <footer id="main-footer" className="bg-slate-950 border-t border-slate-900 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 IOIS Official Admin Console. All rights reserved.</span>
          <div className="flex items-center gap-3 text-[11px]">
            <button onClick={() => onNavigate?.('home')} className="hover:text-amber-400 cursor-pointer">मुख्य होम</button>
            <span>•</span>
            <button onClick={() => onNavigate?.('privacy-policy')} className="hover:text-amber-400 cursor-pointer">गोपनीयता नीति</button>
            <span>•</span>
            <button onClick={() => onNavigate?.('terms')} className="hover:text-amber-400 cursor-pointer">नियम व शर्तें</button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer id="main-footer" className="bg-slate-950 border-t-2 border-slate-900 pt-8 pb-24 sm:pb-28 text-center text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 space-y-6 max-w-7xl">
        
        {/* ========================================================================= */}
        {/* OFFICIAL LOCKED OPTIONS HUB (TAILORED FOR 3 USER STATES)                  */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 shadow-2xl text-left space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  आधिकारिक लॉक्ड ऑप्शंस हब (Official Locked Options)
                </h3>
                <p className="text-[11px] text-slate-400">
                  आपकी लॉगिन स्थिति व स्पॉन्सर लिंक अनुसार सुरक्षित एक्सेस
                </p>
              </div>
            </div>

            {/* Dynamic Status Pill */}
            {isLoggedIn ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span>सत्यापित सदस्य: {currentUser?.userId}</span>
              </span>
            ) : hasSponsor ? (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>स्पॉन्सर लिंक: {cleanSponsorId}</span>
              </span>
            ) : null}
          </div>

          {/* STATE 1: LOGGED IN USER */}
          {isLoggedIn && currentUser && (
            <div className="space-y-3">
              <div className="text-xs text-slate-300">
                <span>नमस्ते <strong className="text-amber-400">{currentUser.fullName}</strong>! आपके सभी सदस्य विकल्प सक्रिय हैं:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="btn-3d-rainbow-special px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  <div className="w-5 h-5 rounded-md logo-3d-box-rainbow flex items-center justify-center shrink-0">
                    <LayoutDashboard className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-black font-black">मेरा डैशबोर्ड</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenIdCard}
                  className="btn-3d-rainbow px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  <div className="w-5 h-5 rounded-md logo-3d-box-rainbow flex items-center justify-center shrink-0">
                    <CreditCard className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-black font-black">डिजिटल ID कार्ड</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.('plans')}
                  className="btn-3d-rainbow px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  <div className="w-5 h-5 rounded-md logo-3d-box-rainbow flex items-center justify-center shrink-0">
                    <Crown className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-black font-black">7 मास्टर प्लान्स</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.('contact')}
                  className="btn-3d-dark px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:scale-[1.02] active:scale-95 border-amber-500/50"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-300 font-black">सपोर्ट टिकट</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: VISITOR WITH SPONSOR LINK */}
          {!isLoggedIn && hasSponsor && (
            <div className="space-y-3">
              <div className="text-xs text-slate-300">
                <span>आप स्पॉन्सर कोड <strong className="text-amber-400 font-mono">{cleanSponsorId}</strong> के रेफरल लिंक से आए हैं:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenRegister?.(1, cleanSponsorId)}
                  className="btn-3d-rainbow-special px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  <div className="w-5 h-5 rounded-md logo-3d-box-rainbow flex items-center justify-center shrink-0">
                    <UserPlus className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-black font-black">इस स्पॉन्सर संग रजिस्ट्रेशन</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenSponsorCard}
                  className="btn-3d-rainbow px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  <div className="w-5 h-5 rounded-md logo-3d-box-rainbow flex items-center justify-center shrink-0">
                    <CreditCard className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-black font-black">स्पॉन्सर ID कार्ड (मास्क्ड)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLogin?.('login')}
                  className="btn-3d-rainbow px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  <LogIn className="w-4 h-4 text-black shrink-0" />
                  <span className="text-black font-black">सदस्य लॉगिन</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: VISITOR WITHOUT SPONSOR LINK */}
          {!isLoggedIn && !hasSponsor && (
            <div className="space-y-3">
              <div className="text-xs text-slate-300">
                <span>आप बिना किसी स्पॉन्सर रेफरल लिंक के सीधे मुख्य पोर्टल पर आए हैं:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenRegister?.(1)}
                  className="btn-3d-rainbow-special px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  <div className="w-5 h-5 rounded-md logo-3d-box-rainbow flex items-center justify-center shrink-0">
                    <UserPlus className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-black font-black">डायरेक्ट सिस्टम रजिस्ट्रेशन</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLogin?.('login')}
                  className="btn-3d-rainbow px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  <LogIn className="w-4 h-4 text-black shrink-0" />
                  <span className="text-black font-black">सदस्य लॉगिन</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenIdCard}
                  className="btn-3d-rainbow px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  <div className="w-5 h-5 rounded-md logo-3d-box-rainbow flex items-center justify-center shrink-0">
                    <CreditCard className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-black font-black">आईडी कार्ड स्टूडियो</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AdSense Legal & Policy Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold border-b border-slate-900 pb-6">
          <button
            onClick={() => onNavigate?.('home')}
            className="hover:text-amber-300 transition cursor-pointer px-2 py-1"
          >
            होम
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <button
            onClick={() => onNavigate?.('plans')}
            className="hover:text-amber-300 transition cursor-pointer px-2 py-1"
          >
            7 मास्टर प्लान
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <button
            onClick={() => onNavigate?.('register')}
            className="text-amber-400 hover:text-amber-300 transition cursor-pointer px-2 py-1 flex items-center gap-1 font-black"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>रजिस्ट्रेशन / Join Now</span>
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <button
            onClick={() => onNavigate?.('privacy-policy')}
            className="hover:text-amber-300 transition cursor-pointer px-2 py-1 flex items-center gap-1"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span>गोपनीयता नीति (Privacy Policy)</span>
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <button
            onClick={() => onNavigate?.('terms')}
            className="hover:text-amber-300 transition cursor-pointer px-2 py-1 flex items-center gap-1"
          >
            <FileText className="w-3 h-3 text-amber-400" />
            <span>नियम व शर्तें (Terms)</span>
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <button
            onClick={() => onNavigate?.('disclaimer')}
            className="hover:text-amber-300 transition cursor-pointer px-2 py-1 flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>अस्वीकरण (Disclaimer)</span>
          </button>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <button
            onClick={() => onNavigate?.('contact')}
            className="hover:text-amber-300 transition cursor-pointer px-2 py-1 flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3 text-amber-400" />
            <span>हेल्पलाइन व संपर्क</span>
          </button>
        </div>

        {/* Social / Helpline Links - Premium 3D Rainbow VIP Design with Perfect Sizing */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5">
          <a
            href={OFFICIAL_TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-rainbow-special w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition cursor-pointer select-none group touch-manipulation active:scale-95"
            title="🎧【『NEW USER HELPLINE』】 24x7 Telegram Official Support"
          >
            <div className="w-7 h-7 rounded-xl logo-3d-box-rainbow flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition">
              <Send className="w-4 h-4 text-black drop-shadow" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-black tracking-wide">
                  🎧 NEW USER HELPLINE (Telegram)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping shrink-0" />
              </div>
              <span className="text-[10px] text-slate-900 font-extrabold tracking-tight">
                24x7 आधिकारिक सहायता केंद्र व तुरंत समाधान
              </span>
            </div>
          </a>

          <a
            href={`mailto:${OFFICIAL_EMAIL}`}
            className="btn-3d-rainbow w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl flex items-center justify-center gap-2.5 transition shadow-lg text-xs font-black cursor-pointer group select-none active:scale-95"
            title="Email: newuserhelpline@gmail.com"
          >
            <div className="w-6 h-6 rounded-lg logo-3d-box-rainbow flex items-center justify-center shrink-0">
              <Mail className="w-3.5 h-3.5 text-black group-hover:scale-110 transition" />
            </div>
            <span className="font-mono text-black font-black">{OFFICIAL_EMAIL}</span>
          </a>
        </div>

        {/* Branding & Mission Statement */}
        <div className="space-y-2">
          <p className="gold-metallic-text text-xl sm:text-2xl font-black uppercase tracking-[0.3em] sm:tracking-[0.4em]">
            IOIS PLATFORM
          </p>
          <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-widest font-bold">
            Indian Online Income Supporting System
          </p>
          <p className="text-slate-500 text-xs max-w-xl mx-auto pt-1">
            डिजिटल शिक्षा, आत्मनिर्भर भारत और पारदर्शी इंस्टेंट इंसेंटिव सपोर्ट प्रणाली।
          </p>
        </div>

        {/* Copyright & Disclaimer Note */}
        <div className="border-t border-slate-900/80 pt-6 text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>© 2026 IOIS National Infrastructure Project. All Rights Reserved.</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1 text-slate-500">
            <span>Made with precision for Digital India & Google AdSense Compliance</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
