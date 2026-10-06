import React, { useState } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { PhoneCall, MessageCircle, X, ChevronUp, Headphones, Sparkles } from 'lucide-react';

export const FloatingContactWidget: React.FC = () => {
  const siteSettings = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);

  // If admin turned off floating contact widget, return null
  if (!siteSettings.floatingContactWidgetEnabled) {
    return null;
  }

  const cleanPhone = siteSettings.helplineWhatsapp.replace(/\D/g, '') || '918877490845';
  const encodedMsg = encodeURIComponent(siteSettings.whatsappDirectMessage || 'नमस्ते IOIS टीम! मुझे अध्ययन किट व पंजीकरण सहायता चाहिए।');

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans">
      
      {/* Expanded Quick Contact Speed Dial */}
      {isOpen && (
        <div className="mb-3 bg-white rounded-3xl p-4 shadow-2xl border-2 border-emerald-500/40 w-72 animate-in fade-in slide-in-from-bottom-3 space-y-3 text-slate-800">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-xs text-slate-900 leading-none">
                  IOIS छात्र हेल्पलाइन
                </h4>
                <span className="text-[10px] text-emerald-600 font-bold">24x7 सहायता सक्रिय</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 leading-snug">
            {siteSettings.helplineHours || 'सोमवार से शनिवार: सुबह 9:00 से रात 8:00 तक'}
          </p>

          <div className="space-y-2 pt-1">
            {/* WhatsApp Button */}
            <a
              href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-between shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>व्हाट्सएप पर बात करें</span>
              </div>
              <span className="text-[10px] font-mono opacity-80 group-hover:opacity-100">तुरंत</span>
            </a>

            {/* Direct Phone Call Button */}
            <a
              href={`tel:${cleanPhone}`}
              className="w-full py-2.5 px-3 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-xs transition-colors flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                <span>सीधा कॉल करें</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">{siteSettings.helplinePhone}</span>
            </a>
          </div>

          <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-100">
            आधिकारिक ईमेल: {siteSettings.helplineEmail}
          </div>

        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-xl ring-4 ring-emerald-500/20 transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105"
        title="सहायता व हेल्पलाइन"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <>
            <div className="relative">
              <PhoneCall className="w-4 h-4 text-amber-300 animate-bounce" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <span>{siteSettings.contactButtonText || 'हेल्पलाइन सहायता'}</span>
          </>
        )}
      </button>

    </div>
  );
};
