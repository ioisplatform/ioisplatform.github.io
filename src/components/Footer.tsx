import React from 'react';
import { OFFICIAL_TELEGRAM_URL, OFFICIAL_WHATSAPP_URL } from '../data/plansData';
import { PageType } from '../types';
import { Send, MessageSquare, ShieldCheck, Lock, FileText, AlertTriangle, PhoneCall, UserPlus } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="main-footer" className="bg-slate-950 border-t border-slate-900 py-10 sm:py-14 text-center text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 space-y-8">
        
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
