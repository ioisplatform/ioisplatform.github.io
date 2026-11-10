import React, { useEffect } from 'react';
import { PageType, UserProfile } from '../types';
import { 
  X, 
  Crown, 
  FileText, 
  GraduationCap, 
  CreditCard, 
  CloudSun, 
  Tv, 
  Film, 
  Scale, 
  Building2, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  PhoneCall, 
  Sparkles, 
  Calculator,
  UserPlus,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';

import { RtpsJaminServicesPage } from './RtpsJaminServicesPage';
import { WeatherPage } from './WeatherPage';
import { LiveNewsPage } from './LiveNewsPage';
import { EntertainmentChatPage } from './EntertainmentChatPage';
import { PanchangRashifalPage } from './PanchangRashifalPage';
import { MandiMarketPage } from './MandiMarketPage';
import { GovtSchemesPage } from './GovtSchemesPage';
import { JobAlertsPage } from './JobAlertsPage';
import { PlansGrid } from './PlansGrid';
import { PayoutCalculator } from './PayoutCalculator';
import { ParentsPortal } from './ParentsPortal';
import { StudentStudyPage } from './StudentStudyPage';
import { IDCardGenerator } from './IDCardGenerator';
import { RegistrationPortal } from './RegistrationPortal';
import { UserDashboard } from './UserDashboard';
import { AdminPanel } from './AdminPanel';
import { AssessmentPortal } from './AssessmentPortal';
import { LegalPolicyPages } from './LegalPolicyPages';
import { ContactFaq } from './ContactFaq';
import { PhotoCompressorTool } from './PhotoCompressorModal';

interface PagePopupModalProps {
  page: PageType;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenLogin: (mode?: 'login' | 'forgot_password' | 'forgot_user_id') => void;
  onOpenRegister: (planId?: number, sponsorId?: string) => void;
  onOpenDashboard: () => void;
  onOpenIdCard: () => void;
  onOpenAiChat: () => void;
  onSelectPlanForRegister: (planId: number) => void;
  sponsorReferralId?: string;
  onRegisterSuccess: (user: UserProfile) => void;
}

export const PagePopupModal: React.FC<PagePopupModalProps> = ({
  page,
  onClose,
  currentUser,
  onOpenLogin,
  onOpenRegister,
  onOpenDashboard,
  onOpenIdCard,
  onOpenAiChat,
  onSelectPlanForRegister,
  sponsorReferralId,
  onRegisterSuccess
}) => {
  // Lock body scroll when popup is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Page Header Details based on requested page
  const getPageInfo = () => {
    switch (page) {
      case 'plans':
        return { title: '7 मास्टर प्लांस (IOIS 7 Master Plans)', subtitle: '₹10 से ₹999 तक के सभी प्लांस, 50% से 70% इंसेंटिव व अध्ययन संसाधन', icon: Crown, color: 'text-amber-400' };
      case 'rtps-services':
        return { title: 'RTPS व जमीन नागरिक सेवाएं (Land & Citizen Services)', subtitle: 'जाति, आय, निवास, जमीन दाखिल-खारिज, LPC व e-PAN डायरेक्ट आधिकारिक लिंक', icon: FileText, color: 'text-emerald-400' };
      case 'student-study':
        return { title: 'विद्यार्थी अध्ययन व NCERT पोर्टल (Student Study Hub)', subtitle: 'Class 1 से 12 तक NCERT नोट्स, फॉर्मूला शीट्स, बोनाफाइड सर्टिफिकेट व कंप्यूटर कोर्स', icon: GraduationCap, color: 'text-violet-400' };
      case 'idcard':
        return { title: 'डिजिटल ID कार्ड जनरेटर (Digital Smart ID Card)', subtitle: '256-Bit एन्क्रिप्टेड स्मार्ट पहचान पत्र, आगे-पीछे का प्रिव्यू व HD PNG डाउनलोड', icon: CreditCard, color: 'text-blue-400' };
      case 'calculator':
        return { title: 'इंसेंटिव व अर्निंग कैलकुलेटर (Payout Calculator)', subtitle: 'योजना अनुसार 50% से 70% दैनिक व मासिक रेफरल आय का लाइव सिमुलेटर', icon: Calculator, color: 'text-purple-400' };
      case 'weather':
        return { title: 'लाइव मौसम अलर्ट व 7-दिवसीय पूर्वानुमान (Live Weather)', subtitle: 'सटीक शहरवार तापमान, बादलों की स्थिति, वर्षा रडार व मौसम अलर्ट', icon: CloudSun, color: 'text-sky-400' };
      case 'news':
        return { title: 'लाइव 24x7 टीवी चैनल्स व ई-अखबार डायरेक्टरी (Live News & E-Papers)', subtitle: 'देश-दुनिया की ताजा खबरें, 6 प्रमुख टीवी लाइव स्ट्रीम व डिजिटल समाचार पत्र', icon: Tv, color: 'text-rose-500' };
      case 'entertainment':
      case 'entertainment-chat':
        return { title: 'मनोरंजन, लाइव चैट व फ्री AI टूल्स हब', subtitle: 'बिना Ads के वीडियो व प्लेलिस्ट प्लेयर, सदस्यों के साथ चैट और उपयोगी टूल्स', icon: Film, color: 'text-pink-400' };
      case 'panchang-rashifal':
        return { title: 'लाइव वैदिक घड़ी, दैनिक पंचांग व 12 राशि भविष्य', subtitle: 'सटीक भारतीय वैदिक पंचांग, शुभ मुहूर्त, राहु काल व 12 राशियों का लकी कलर व नंबर', icon: Clock, color: 'text-orange-400' };
      case 'mandi-market':
        return { title: 'कृषि उपज मंडी भाव व लाइव बुलियन मार्केट (Mandi & Bullion)', subtitle: 'प्रमुख फसलों के ताजा मंडी रेट और 22K/24K सोना व चांदी के लाइव भाव', icon: Scale, color: 'text-amber-400' };
      case 'govt-schemes':
        return { title: 'सरकारी योजनाएं व नागरिक कानून डायरेक्टरी (Govt Schemes)', subtitle: 'केंद्र व राज्य सरकार की प्रमुख कल्याणकारी योजनाएं, कानून अधिकार व डायरेक्ट लिंक्स', icon: Building2, color: 'text-teal-400' };
      case 'jobs':
        return { title: 'रोजगार समाचार, सरकारी व प्राइवेट जॉब अलर्ट (Job Alerts)', subtitle: 'नवीनतम सरकारी भर्तियां, एडमिट कार्ड, परीक्षा परिणाम व करियर मार्गदर्शन', icon: Briefcase, color: 'text-indigo-400' };
      case 'parents':
        return { title: 'अभिभावक सुरक्षा व सत्यापन (Parents Portal)', subtitle: '100% सुरक्षित डिजिटल वातावरण, NCERT पाठ्यक्रम व बाल सुरक्षा नीतियां', icon: ShieldCheck, color: 'text-emerald-400' };
      case 'assessment':
        return { title: 'कैरियर व प्लान असेसमेंट टेस्ट (Interview & Assessment)', subtitle: '2 मिनट का इंटरएक्टिव टेस्ट जो आपकी रुचि व लक्ष्य के अनुसार सही प्लान सुझाए', icon: Sparkles, color: 'text-yellow-400' };
      case 'admin':
        return { title: 'IOIS अधिकृत एडमिन कंसोल (Admin Panel)', subtitle: 'उपयोगकर्ता सत्यापन, पेआउट अप्रूवल, ऑडिट लॉग्स व सिस्टम सेटिंग्स', icon: ShieldAlert, color: 'text-red-400' };
      case 'contact':
        return { title: '24x7 हेल्पलाइन, सहायता व अक्सर पूछे जाने वाले सवाल (Contact & FAQ)', subtitle: 'आधिकारिक टेलीग्राम, ईमेल और समस्या समाधान', icon: PhoneCall, color: 'text-amber-400' };
      case 'privacy-policy':
      case 'terms':
      case 'disclaimer':
        return { title: 'नीति, नियम व अस्वीकरण (Legal & Policy Pages)', subtitle: 'Google AdSense, डिजिटल सुरक्षा व नागरिक अधिकारों का विवरण', icon: FileText, color: 'text-amber-300' };
      case 'register':
        return { title: 'नया सदस्य रजिस्ट्रेशन (Member Registration)', subtitle: '3 आसान चरणों में पंजीकरण पूर्ण करें और तुरंत डिजिटल ID कार्ड प्राप्त करें', icon: UserPlus, color: 'text-amber-400' };
      case 'photo-compressor':
        return { title: 'फोटो कंप्रेसर व रिसाइज़र (Smart Photo Resizer)', subtitle: 'सरकारी फॉर्म, RTPS व SSC हेतु 20KB, 50KB व 100KB में फोटो व सिग्नेचर कंप्रेस करें', icon: ImageIcon, color: 'text-pink-400' };
      default:
        return { title: 'IOIS डिजिटल सेवा', subtitle: 'आधिकारिक डिजिटल सेवा पोर्टल', icon: Sparkles, color: 'text-amber-400' };
    }
  };

  const info = getPageInfo();
  const Icon = info.icon;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="border-2 rounded-2xl sm:rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden transition-colors duration-200"
        style={{
          backgroundColor: 'var(--surface-bg)',
          borderColor: 'var(--btn-border)',
          color: 'var(--text-primary)',
        }}
      >
        
        {/* Sticky Popup Header with Icon, Title, and 3D Close Button */}
        <div 
          className="px-3.5 sm:px-6 py-3 sm:py-3.5 border-b flex items-center justify-between gap-3 shrink-0 transition-colors duration-200"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--btn-border)',
          }}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl logo-3d-box flex items-center justify-center shrink-0 border border-amber-400/80 shadow-md">
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${info.color}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base md:text-lg font-black truncate" style={{ color: 'var(--text-primary)' }}>
                  {info.title}
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase">
                  ● INSTANT ACTIVE
                </span>
              </div>
              <p className="text-[10px] sm:text-xs truncate hidden xs:block opacity-80" style={{ color: 'var(--text-secondary)' }}>
                {info.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Register / Action Button inside popup header */}
            {page !== 'register' && (
              <button
                type="button"
                onClick={() => onOpenRegister(1)}
                className="hidden md:flex btn-3d-gold px-3 py-1.5 rounded-xl text-xs font-black items-center gap-1.5 shadow cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>ज्वाइन करें</span>
              </button>
            )}

            {/* Instant 3D Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="btn-3d-silver px-3 py-1.5 rounded-xl text-xs font-black text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 touch-manipulation"
              title="यह विंडो बंद करें (Esc)"
            >
              <X className="w-4 h-4 text-black stroke-[3]" />
              <span className="font-black text-black">बंद करें</span>
            </button>
          </div>
        </div>

        {/* Scrollable Popup Content Body */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {page === 'plans' && (
            <PlansGrid
              onAskAI={onOpenAiChat}
              onSelectPlanForRegister={(planId) => {
                onClose();
                onSelectPlanForRegister(planId);
              }}
            />
          )}

          {page === 'rtps-services' && (
            <RtpsJaminServicesPage />
          )}

          {page === 'student-study' && (
            <StudentStudyPage onAskAI={onOpenAiChat} />
          )}

          {page === 'idcard' && (
            <IDCardGenerator
              currentUser={currentUser}
              onOpenRegister={() => {
                onClose();
                onOpenRegister();
              }}
            />
          )}

          {page === 'calculator' && (
            <PayoutCalculator />
          )}

          {page === 'weather' && (
            <WeatherPage />
          )}

          {page === 'news' && (
            <LiveNewsPage
              onNavigate={(targetPage) => {
                // Stay inside popup modal or route
              }}
              onOpenRegister={(planId) => {
                onClose();
                onOpenRegister(planId);
              }}
              onOpenAiChat={onOpenAiChat}
            />
          )}

          {(page === 'entertainment' || page === 'entertainment-chat') && (
            <EntertainmentChatPage
              currentUser={currentUser}
              onOpenLogin={() => {
                onClose();
                onOpenLogin('login');
              }}
              onNavigateToPlans={() => {
                // switch inside popup
              }}
            />
          )}

          {page === 'panchang-rashifal' && (
            <PanchangRashifalPage />
          )}

          {page === 'mandi-market' && (
            <MandiMarketPage />
          )}

          {page === 'govt-schemes' && (
            <GovtSchemesPage />
          )}

          {page === 'jobs' && (
            <JobAlertsPage />
          )}

          {page === 'parents' && (
            <ParentsPortal />
          )}

          {page === 'assessment' && (
            <AssessmentPortal onAskAI={onOpenAiChat} />
          )}

          {page === 'admin' && (
            <AdminPanel />
          )}

          {page === 'contact' && (
            <ContactFaq />
          )}

          {page === 'photo-compressor' && (
            <PhotoCompressorTool />
          )}

          {(page === 'privacy-policy' || page === 'terms' || page === 'disclaimer') && (
            <LegalPolicyPages activeTab={page} />
          )}

          {page === 'register' && (
            <RegistrationPortal
              onRegisterSuccess={(user) => {
                onClose();
                onRegisterSuccess(user);
              }}
              onOpenLogin={() => {
                onClose();
                onOpenLogin('login');
              }}
              initialSponsorId={sponsorReferralId}
            />
          )}
        </div>

        {/* Popup Footer Bar with Quick Tips */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IOIS इंस्टेंट विंडो • बिना पेज रीलोड के 0ms तुरंत एक्सेस</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white underline font-bold cursor-pointer"
          >
            विंडो बंद करें ✕
          </button>
        </div>

      </div>
    </div>
  );
};
