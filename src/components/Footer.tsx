import React from 'react';
import { OFFICIAL_TELEGRAM_URL, OFFICIAL_WHATSAPP_URL } from '../data/plansData';
import { PageType, UserProfile } from '../types';
import { 
  Send, 
  MessageSquare, 
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
  onOpenLogin,
  onOpenRegister,
  onOpenDashboard,
  onOpenIdCard,
  onOpenSponsorCard,
}) => {
  const cleanSponsorId = sponsorId ? sponsorId.trim().toUpperCase() : '';
  const hasSponsor = Boolean(cleanSponsorId);
  const isLoggedIn = Boolean(currentUser);

  return (
    <footer id="main-footer" className="bg-slate-950 border-t-2 border-slate-900 pt-10 pb-28 sm:pb-32 text-center text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 space-y-8 max-w-7xl">
        
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
            ) : (
              <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>बिना स्पॉन्सर विज़िटर (डायरेक्ट मोड)</span>
              </span>
            )}
          </div>

          {/* STATE 1: LOGGED IN USER */}
          {isLoggedIn && currentUser && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-300">
                <span>नमस्ते <strong className="text-amber-400">{currentUser.fullName}</strong>! आपके सभी सदस्य विकल्प अनलॉक हैं:</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  🔓 डाउनलोड व डैशबोर्ड सक्रिय
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>मेरा डैशबोर्ड खोलें</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenIdCard}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-blue-500/50 text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>डिजिटल ID कार्ड (🔓 डाउनलोड)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.('plans')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>7 मास्टर प्लान्स</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.('contact')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>सपोर्ट टिकट दर्ज करें</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: VISITOR WITH SPONSOR LINK */}
          {!isLoggedIn && hasSponsor && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-300">
                <span>आप स्पॉन्सर कोड <strong className="text-amber-400 font-mono">{cleanSponsorId}</strong> के रेफरल लिंक से आए हैं:</span>
                <span className="text-[10px] text-amber-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30">
                  🔒 गोपनीयता सुरक्षित प्रिव्यू
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onOpenRegister?.(1, cleanSponsorId)}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>इस स्पॉन्सर के साथ तुरंत रजिस्ट्रेशन करें</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenSponsorCard}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-amber-500/50 text-amber-300 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>स्पॉन्सर का ID कार्ड देखें (🔒 मास्क्ड)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLogin?.('login')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>मौजूदा सदस्य लॉगिन</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: VISITOR WITHOUT SPONSOR LINK */}
          {!isLoggedIn && !hasSponsor && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-slate-300">
                <span>आप बिना किसी स्पॉन्सर रेफरल लिंक के सीधे मुख्य पोर्टल पर आए हैं:</span>
                <span className="text-[10px] text-rose-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-rose-500/30">
                  🔒 स्पॉन्सर कोड अनुपलब्ध
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onOpenRegister?.(1)}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>डायरेक्ट आधिकारिक सिस्टम रजिस्ट्रेशन</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLogin?.('login')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>सदस्य लॉगिन</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenIdCard}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-700 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>आईडी कार्ड स्टूडियो (🔒 डाउनलोड केवल सदस्यों हेतु)</span>
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
            className="text-emerald-400 hover:text-emerald-300 transition cursor-pointer px-2 py-1 flex items-center gap-1 font-black"
          >
            <UserPlus className="w-3.5 h-3.5" />
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

        {/* Social / Helpline Links */}
        <div className="flex justify-center items-center gap-6 sm:gap-10">
          <a
            href={OFFICIAL_TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 hover:text-sky-300 hover:scale-110 hover:border-sky-500/50 transition shadow-lg"
            title="Official Telegram"
          >
            <Send className="w-4 h-4" />
          </a>
          <a
            href={OFFICIAL_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-green-400 hover:text-green-300 hover:scale-110 hover:border-green-500/50 transition shadow-lg"
            title="Official WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
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
