import React from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { 
  ShieldCheck, 
  Bot, 
  PhoneCall, 
  Mail, 
  Sparkles, 
  ArrowUp,
  BookOpen,
  Tv,
  Pencil,
  FileCheck2,
  CreditCard,
  GraduationCap,
  Store,
  Send,
  MessageCircle,
  Crown,
  Layers,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onOpenAiModal: () => void;
  onOpenIdCardModal: () => void;
  onOpenRegistration: () => void;
  onOpenStudyModal: (planId: string) => void;
  onOpenPlansModal: () => void;
  onOpenVideoModal: () => void;
  onOpenTracingModal: () => void;
  onOpenHomeworkModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToTop,
  onOpenAiModal,
  onOpenIdCardModal,
  onOpenRegistration,
  onOpenStudyModal,
  onOpenPlansModal,
  onOpenVideoModal,
  onOpenTracingModal,
  onOpenHomeworkModal
}) => {
  const siteSettings = useSiteSettings();
  const cleanPhone = siteSettings.helplineWhatsapp.replace(/\D/g, '') || '918877490845';

  return (
    <footer className="bg-[#0f172a] text-slate-300 text-xs border-t-2 border-slate-800">
      
      {/* 🇮🇳 Tricolor Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white via-blue-800 to-emerald-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Trust Details (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-[#1e3a8a] border border-[#d4af37] flex items-center justify-center font-black text-white text-base shadow-md">
                <GraduationCap className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-tight flex items-center gap-1.5">
                  <span>IOIS STUDENT PORTAL</span>
                </span>
                <p className="text-[11px] text-[#f3e5ab] font-medium leading-none">
                  Indian Online Income Supporting System • डिजिटल शिक्षा मंच
                </p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              भारत के सभी विद्यार्थियों के लिए समर्पित ऑल-डिवाइस फ्रेंडली शिक्षा मंच। नर्सरी से 5वीं के लिए सचित्र वर्णमाला व ट्रेसिंग पैड, तथा कक्षा 6 से 12 तक के NCERT नोट्स, वीडियो लेक्चर्स व दैनिक गृहकार्य।
            </p>

            {/* IOIS India Authorized Center & Head Office Address Box */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 max-w-sm">
              <div className="flex items-center gap-2 text-[#f3e5ab] font-bold text-xs">
                <Store className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{siteSettings.organizationName || 'अधिकृत केंद्र: IOIS India'}</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-snug flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  {siteSettings.headOfficeAddress}, {siteSettings.city}, {siteSettings.state} - {siteSettings.pincode}
                </span>
              </div>
              {siteSettings.googleMapsUrl && (
                <a
                  href={siteSettings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 inline-flex"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>गूगल मैप्स पर देखें</span>
                </a>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-1 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% सुरक्षित • स्पैम-फ्री • केवल गंभीर छात्रों हेतु अधिकृत</span>
            </div>
          </div>

          {/* 7 Plans Links (Opens Dialog Box) */}
          <div className="space-y-3">
            <span className="font-extrabold text-[#f3e5ab] text-xs uppercase tracking-wider block">
              7 अध्ययन योजनाएं
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onOpenStudyModal('plan-01')} className="hover:text-[#d4af37] transition-colors text-left">
                  Plan 01: Bal Vikas Access
                </button>
              </li>
              <li>
                <button onClick={() => onOpenStudyModal('plan-02')} className="hover:text-[#d4af37] transition-colors text-left">
                  Plan 02: Youth Skill Access
                </button>
              </li>
              <li>
                <button onClick={() => onOpenStudyModal('plan-03')} className="hover:text-[#d4af37] transition-colors text-left">
                  Plan 03: Career & Job Access
                </button>
              </li>
              <li>
                <button onClick={() => onOpenStudyModal('plan-04')} className="hover:text-[#d4af37] transition-colors text-left">
                  Plan 04: Family VIP Access
                </button>
              </li>
              <li>
                <button onClick={() => onOpenStudyModal('plan-05')} className="hover:text-[#d4af37] transition-colors text-left">
                  Plan 05: Student & Exam Access
                </button>
              </li>
              <li>
                <button onClick={() => onOpenStudyModal('plan-06')} className="hover:text-[#d4af37] transition-colors text-left">
                  Plan 06: Agency Reseller Access
                </button>
              </li>
              <li>
                <button onClick={() => onOpenStudyModal('plan-07')} className="text-[#d4af37] font-bold hover:text-amber-200 transition-colors text-left">
                  Plan 07: Lifetime Master Access
                </button>
              </li>
              <li className="pt-1">
                <button onClick={onOpenPlansModal} className="text-blue-400 font-bold hover:underline">
                  सब 7 योजनाएं डायलॉग में देखें →
                </button>
              </li>
            </ul>
          </div>

          {/* Study Tools (Every button opens a Dialog Box) */}
          <div className="space-y-3">
            <span className="font-extrabold text-[#f3e5ab] text-xs uppercase tracking-wider block">
              छात्र शिक्षण टूल्स
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onOpenStudyModal('plan-01')} className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>सचित्र NCERT स्टडी नोट्स</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenVideoModal} className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-red-400" />
                  <span>IOIS आधिकारिक वीडियो कक्षाएं</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenTracingModal} className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5 text-purple-400" />
                  <span>डिजिटल अक्षर ट्रेसिंग पैड</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenHomeworkModal} className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>दैनिक गृहकार्य (Homework)</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenIdCardModal} className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>डिजिटल छात्र ID कार्ड</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Official Support Channels (Bold & Prominent) */}
          <div className="space-y-3">
            <span className="font-extrabold text-white text-xs uppercase tracking-wider block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ऑफिशियल सपोर्ट (Support)</span>
            </span>

            <div className="space-y-3 text-xs bg-slate-900 p-4 rounded-2xl border border-slate-800">
              
              {/* WhatsApp */}
              <a 
                href={`https://api.whatsapp.com/send?phone=${cleanPhone}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-2.5 text-white hover:text-emerald-400 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">WhatsApp:</span>
                  <span className="font-black text-sm text-white tracking-wide group-hover:text-emerald-400">
                    {siteSettings.helplineWhatsapp}
                  </span>
                </div>
              </a>

              {/* Call Helpline */}
              <a 
                href={`tel:${cleanPhone}`} 
                className="flex items-center space-x-2.5 text-white hover:text-blue-400 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">हेल्पलाइन कॉल:</span>
                  <span className="font-black text-sm text-white tracking-wide group-hover:text-blue-400 font-mono">
                    {siteSettings.helplinePhone}
                  </span>
                </div>
              </a>

              {/* Email */}
              <a 
                href={`mailto:${siteSettings.helplineEmail}`} 
                className="flex items-center space-x-2.5 text-white hover:text-[#d4af37] transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-600/30 border border-amber-500/50 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Official Email:</span>
                  <span className="font-bold text-xs text-white group-hover:text-[#d4af37]">
                    {siteSettings.helplineEmail}
                  </span>
                </div>
              </a>

              {/* Telegram Channel */}
              {siteSettings.telegramChannel && (
                <a 
                  href={siteSettings.telegramChannel} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-2.5 text-white hover:text-blue-400 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Telegram Channel:</span>
                    <span className="font-bold text-xs text-[#f3e5ab] group-hover:text-blue-400 font-mono">
                      @ioisplatform
                    </span>
                  </div>
                </a>
              )}

              {/* Working Hours */}
              {siteSettings.helplineHours && (
                <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{siteSettings.helplineHours}</span>
                </div>
              )}

            </div>

            <div className="pt-1">
              <button
                onClick={onOpenAiModal}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-[#f3e5ab] border border-blue-700 text-xs font-black transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Bot className="w-4 h-4 text-[#d4af37]" />
                <span>24x7 AI स्टूडेंट सलाहकार डायलॉग</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} IOIS Platform • IOIS India. समस्त अधिकार सुरक्षित।</p>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={onScrollToTop} 
              className="hover:text-[#d4af37] transition-colors flex items-center space-x-1"
            >
              <span>ऊपर जाएं</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
