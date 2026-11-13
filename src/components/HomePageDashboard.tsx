import React, { useState } from 'react';
import { PageType, UserProfile } from '../types';
import { 
  Crown, 
  UserPlus, 
  CreditCard, 
  ShieldCheck, 
  Sparkles,
  ArrowRight, 
  CheckCircle2, 
  LogIn,
  BookOpen,
  LayoutDashboard,
  MessageCircle
} from 'lucide-react';
import { HomeHeaderWatch } from './HomeHeaderWatch';
import { PlansGrid } from './PlansGrid';
import { IoisExplainerGuideModal } from './IoisExplainerGuideModal';
import { AdminHomePhotoPopup } from './AdminHomePhotoPopup';

interface HomePageDashboardProps {
  currentUser?: UserProfile | null;
  onNavigate: (page: PageType) => void;
  onOpenLogin: () => void;
  onOpenAiChat: () => void;
  onOpenRegister?: (planId?: number) => void;
  onOpenSponsorAddMember?: (planId?: number) => void;
  onOpenChatHelp?: () => void;
  onOpenDashboard?: () => void;
  onOpenIdCard?: () => void;
  onSelectPlanForRegister?: (planId: number) => void;
  onOpenFestivalWelcome?: () => void;
  onOpenPopupPage?: (page: PageType) => void;
  onOpenFestivalModal?: () => void;
  onOpenRashifalModal?: () => void;
  onOpenPhotoCompressor?: () => void;
}

export const HomePageDashboard: React.FC<HomePageDashboardProps> = ({
  currentUser,
  onNavigate,
  onOpenLogin,
  onOpenAiChat,
  onOpenRegister,
  onOpenSponsorAddMember,
  onOpenChatHelp,
  onOpenDashboard,
  onOpenIdCard,
  onSelectPlanForRegister,
  onOpenFestivalWelcome,
  onOpenPopupPage,
  onOpenFestivalModal,
  onOpenRashifalModal,
  onOpenPhotoCompressor,
}) => {
  const [isExplainerModalOpen, setIsExplainerModalOpen] = useState<boolean>(false);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-6xl mx-auto px-1 sm:px-2">
      
      {/* 0. ADMIN 7-PHOTO POPUP SYSTEM: ONLY RENDERS ON HOME PAGE WHEN ADMIN HAS UPLOADED ACTIVE PHOTOS */}
      <AdminHomePhotoPopup
        currentUser={currentUser}
        onNavigate={onNavigate}
        onOpenRegister={onOpenRegister}
        onOpenSponsorAddMember={onOpenSponsorAddMember}
        onOpenIdCard={onOpenIdCard}
      />

      {/* 1. IOIS CLOCK & VEDIC DUAL TIME WATCH (DIRECTLY BELOW HEADER) */}
      <section className="w-full">
        <HomeHeaderWatch />
      </section>

      {/* 2. IOIS PLATFORM KE 7 MASTER PLANS (DIRECTLY BELOW CLOCK) */}
      {/* ₹10 to ₹999 with 50% to 70% instant daily incentives and instant selection for registration */}
      <section className="w-full">
        <PlansGrid
          currentUser={currentUser}
          onAskAI={(q) => onOpenAiChat()}
          onSelectPlanForRegister={onSelectPlanForRegister || onOpenRegister}
          onOpenSponsorAddMember={onOpenSponsorAddMember}
        />
      </section>

      {/* 2.5 IOIS AUR ISME KYA-KYA SHAMIL HAI - SHORT INTRODUCTION */}
      <section 
        className="w-full p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all shadow-lg text-left"
        style={{
          backgroundColor: 'var(--card-bg, #0f172a)',
          borderColor: 'var(--btn-border, #334155)',
          color: 'var(--text-primary, #ffffff)'
        }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  IOIS प्लेटफॉर्म में क्या-क्या शामिल है? (Short Introduction)
                </h3>
                <p className="text-[11px] text-slate-400">
                  मात्र ₹10 से ₹999 में लाइफटाइम एक्सेस व संपूर्ण डिजिटल सुविधाएं
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExplainerModalOpen(true)}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              विस्तार से पढ़ें ➔
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
            <div className="p-2.5 rounded-xl border flex items-start gap-2" style={{ backgroundColor: 'var(--surface-bg, #020617)', borderColor: 'var(--btn-border, #334155)' }}>
              <span className="text-amber-400 font-black text-sm">👑</span>
              <div>
                <strong className="block font-black text-white text-[11px] sm:text-xs">7 मास्टर प्लान्स</strong>
                <span className="text-[10px] text-slate-400">50% से 70% दैनिक इंसेंटिव (₹7 से ₹499 पेआउट)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border flex items-start gap-2" style={{ backgroundColor: 'var(--surface-bg, #020617)', borderColor: 'var(--btn-border, #334155)' }}>
              <span className="text-sky-400 font-black text-sm">🪪</span>
              <div>
                <strong className="block font-black text-white text-[11px] sm:text-xs">डिजिटल ID कार्ड</strong>
                <span className="text-[10px] text-slate-400">256-Bit एन्क्रिप्टेड स्मार्ट पहचान पत्र व QR सत्यापन</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border flex items-start gap-2" style={{ backgroundColor: 'var(--surface-bg, #020617)', borderColor: 'var(--btn-border, #334155)' }}>
              <span className="text-violet-400 font-black text-sm">📚</span>
              <div>
                <strong className="block font-black text-white text-[11px] sm:text-xs">विद्यार्थी शिक्षा हब</strong>
                <span className="text-[10px] text-slate-400">Class 1-12 NCERT नोट्स, सूत्र व कंप्यूटर कोर्स</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border flex items-start gap-2" style={{ backgroundColor: 'var(--surface-bg, #020617)', borderColor: 'var(--btn-border, #334155)' }}>
              <span className="text-emerald-400 font-black text-sm">🏛️</span>
              <div>
                <strong className="block font-black text-white text-[11px] sm:text-xs">RTPS व जमीन गाइड</strong>
                <span className="text-[10px] text-slate-400">जाति, आय, निवास, दाखिल-खारिज व e-PAN</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border flex items-start gap-2" style={{ backgroundColor: 'var(--surface-bg, #020617)', borderColor: 'var(--btn-border, #334155)' }}>
              <span className="text-pink-400 font-black text-sm">🖼️</span>
              <div>
                <strong className="block font-black text-white text-[11px] sm:text-xs">फोटो कंप्रेसर 20-50KB</strong>
                <span className="text-[10px] text-slate-400">ऑनलाइन फॉर्म हेतु फोटो व सिग्नेचर रिसाइज़र</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border flex items-start gap-2" style={{ backgroundColor: 'var(--surface-bg, #020617)', borderColor: 'var(--btn-border, #334155)' }}>
              <span className="text-yellow-400 font-black text-sm">🌤️</span>
              <div>
                <strong className="block font-black text-white text-[11px] sm:text-xs">पंचांग, राशिफल व मौसम</strong>
                <span className="text-[10px] text-slate-400">दैनिक 12 राशिफल, शुभ मुहूर्त व जॉब अलर्ट्स 24x7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 5-TO-10 SECOND VISITOR CLARITY CARD (WHAT IS IOIS & WHAT TO DO NEXT) */}
      <section 
        className="w-full p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all shadow-xl text-left"
        style={{
          backgroundColor: 'var(--card-bg, #0f172a)',
          borderColor: 'var(--btn-border, #334155)',
          color: 'var(--text-primary, #ffffff)'
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                ⚡ 5 सेकंड परिचय (Quick Overview)
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% पारदर्शी, सुरक्षित व आधिकारिक</span>
              </span>
            </div>

            <h2 className="text-base sm:text-xl font-black leading-snug">
              IOIS क्या है और आपको आगे क्या करना है?
            </h2>

            <p className="text-xs sm:text-sm leading-relaxed opacity-90" style={{ color: 'var(--text-secondary, #cbd5e1)' }}>
              <strong>भारतीय ऑनलाइन आय सहयोग प्रणाली</strong> — ₹10 से ₹999 में से अपना पसंदीदा प्लान चुनें, तुरंत 256-Bit डिजिटल ID कार्ड प्राप्त करें और प्रत्येक डायरेक्ट रेफरल पर <strong>50% से 70% तक त्वरित दैनिक इंसेंटिव</strong> सीधे अपने UPI खाते में पाएं।
            </p>

            {/* 3 Step Action Blueprint */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div 
                className="p-2 rounded-xl border flex items-center gap-2" 
                style={{ backgroundColor: 'var(--surface-bg, #020617)', borderColor: 'var(--btn-border, #334155)' }}
              >
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">1</span>
                <span><strong>1. प्लान चुनें:</strong> ₹10 से ₹999</span>
              </div>
              <div 
                className="p-2 rounded-xl border flex items-center gap-2" 
                style={{ backgroundColor: 'var(--surface-bg, #020617)', borderColor: 'var(--btn-border, #334155)' }}
              >
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">2</span>
                <span><strong>2. ID कार्ड पाएं:</strong> तुरंत जनरेट</span>
              </div>
              <div 
                className="p-2 rounded-xl border flex items-center gap-2" 
                style={{ backgroundColor: 'var(--surface-bg, #020617)', borderColor: 'var(--btn-border, #334155)' }}
              >
                <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">3</span>
                <span><strong>3. कमाई शुरू:</strong> 50%-70% आय</span>
              </div>
            </div>
          </div>

          {/* Quick Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => onOpenSponsorAddMember?.(1)}
                  className="btn-3d-rainbow-special px-5 py-2.5 rounded-xl font-black text-xs text-black shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-black" />
                  <span>नया सदस्य जोड़ें (My Sponsor)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenChatHelp ? onOpenChatHelp() : onNavigate('chat-help')}
                  className="btn-3d-gold px-5 py-2.5 rounded-xl font-black text-xs text-slate-950 shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-slate-950" />
                  <span>IOIS CHAT & HELP</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="btn-3d-silver px-5 py-2.5 rounded-xl font-black text-xs text-slate-950 shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-950" />
                  <span>मेरा डैशबोर्ड</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenRegister) onOpenRegister(1);
                    else onNavigate('register');
                  }}
                  className="btn-3d-rainbow-special px-5 py-2.5 rounded-xl font-black text-xs text-black shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-black" />
                  <span>नया रजिस्ट्रेशन (Join Now)</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="btn-3d-silver px-5 py-2.5 rounded-xl font-black text-xs text-slate-950 shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-950" />
                  <span>सदस्य लॉगिन (Login)</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsExplainerModalOpen(true)}
              className="px-4 py-2 rounded-xl text-[10.5px] font-bold border transition text-center hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: 'var(--btn-surface, #1e293b)',
                borderColor: 'var(--btn-border, #475569)',
                color: 'var(--primary-accent, #f59e0b)'
              }}
            >
              📖 2 मिनट में विस्तार से समझें ➔
            </button>
          </div>
        </div>
      </section>

      {/* Comprehensive IOIS Explainer Modal Popup */}
      <IoisExplainerGuideModal
        isOpen={isExplainerModalOpen}
        onClose={() => setIsExplainerModalOpen(false)}
        currentUser={currentUser}
        onSelectPlanForRegister={onSelectPlanForRegister}
        onNavigateToPlans={() => onNavigate('plans')}
        onOpenRegister={onOpenRegister}
        onOpenSponsorAddMember={onOpenSponsorAddMember}
      />

    </div>
  );
};
