import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { TickerBar } from './components/TickerBar';
import { HomePageDashboard } from './components/HomePageDashboard';
import { PageHeader } from './components/PageHeader';
import { LiveClockPanchang } from './components/LiveClockPanchang';
import { QuickPageShortcuts } from './components/QuickPageShortcuts';
import { Footer } from './components/Footer';
import { AIChatBot } from './components/AIChatBot';
import { ThemeSelectorModal } from './components/ThemeSelector';
import { 
  ThemeMode, 
  ThemePreset, 
  getSavedThemeMode, 
  getSavedThemePreset, 
  applyThemeToDocument 
} from './services/themeService';

// Direct High-Speed Static Imports for 0ms Instant Page Loads & Popups
import { RtpsJaminServicesPage } from './components/RtpsJaminServicesPage';
import { WeatherPage } from './components/WeatherPage';
import { LiveNewsPage } from './components/LiveNewsPage';
import { EntertainmentChatPage } from './components/EntertainmentChatPage';
import { PanchangRashifalPage } from './components/PanchangRashifalPage';
import { MandiMarketPage } from './components/MandiMarketPage';
import { GovtSchemesPage } from './components/GovtSchemesPage';
import { JobAlertsPage } from './components/JobAlertsPage';
import { PlansGrid } from './components/PlansGrid';
import { PayoutCalculator } from './components/PayoutCalculator';
import { ParentsPortal } from './components/ParentsPortal';
import { StudentStudyPage } from './components/StudentStudyPage';
import { IDCardGenerator } from './components/IDCardGenerator';
import { RegistrationPortal } from './components/RegistrationPortal';
import { UserDashboard } from './components/UserDashboard';
import { AdminPanel } from './components/AdminPanel';
import { AssessmentPortal } from './components/AssessmentPortal';
import { LegalPolicyPages } from './components/LegalPolicyPages';
import { ContactFaq } from './components/ContactFaq';
import { PagePopupModal } from './components/PagePopupModal';

import { AuthModal } from './components/AuthModal';
import { RegistrationModal } from './components/RegistrationModal';
import { DashboardModal } from './components/DashboardModal';
import { IdCardModal } from './components/IdCardModal';
import { SponsorCardModal } from './components/SponsorCardModal';
import { IoisServicesDrawerModal } from './components/IoisServicesDrawerModal';
import { LockedFooterDock } from './components/LockedFooterDock';
import { Plan, UserProfile, PageType } from './types';
import { 
  getCurrentUser, 
  logoutUser, 
  fetchUsersFromServer, 
  setCurrentUser as persistCurrentUser, 
  findUserById,
  getSponsorUserAsync,
  validateSponsorIdAsync,
  OFFICIAL_ROOT_SPONSOR_ID,
  OFFICIAL_ROOT_SPONSOR_USER
} from './services/userService';
import { Sparkles, ArrowLeft, Home, Crown, FileText, GraduationCap, CreditCard, LayoutDashboard, UserPlus } from 'lucide-react';

const PageFallbackLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[350px] p-6 text-center space-y-4 animate-fadeIn">
    <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    <div className="text-amber-400 font-bold text-xs sm:text-sm tracking-wide">पेज लोड हो रहा है, कृपया प्रतीक्षा करें...</div>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedPlanForRegister, setSelectedPlanForRegister] = useState<number>(1);
  const [popupPage, setPopupPage] = useState<PageType | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInitialQuery, setChatInitialQuery] = useState<string>('');

  // Theme Customization & Light/Dark Mode State
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getSavedThemeMode());
  const [themePreset, setThemePreset] = useState<ThemePreset>(() => getSavedThemePreset());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  useEffect(() => {
    applyThemeToDocument(themeMode, themePreset);
  }, [themeMode, themePreset]);

  const handleToggleMode = () => {
    setThemeMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      applyThemeToDocument(next, themePreset);
      return next;
    });
  };

  const handlePresetChange = (preset: ThemePreset) => {
    setThemePreset(preset);
    applyThemeToDocument(themeMode, preset);
  };

  // User Authentication & Session State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'forgot_user_id' | 'forgot_password'>('login');
  const [authModalPrefill, setAuthModalPrefill] = useState<{ identifier?: string; mobile?: string; userId?: string }>({});

  // Dedicated Dialog Box Popups (Registration, Dashboard, ID Card, Services)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState<boolean>(false);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState<boolean>(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState<boolean>(false);

  // Sponsor Referral Visitor State & Modal
  const [sponsorReferralId, setSponsorReferralId] = useState<string>('');
  const [sponsorUser, setSponsorUser] = useState<UserProfile | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState<boolean>(false);

  // Detect ?ref= or ?sponsor= on mount to show sponsor ID card with strict privacy
  useEffect(() => {
    let isMounted = true;
    const checkUrlSponsor = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('sponsor') || params.get('ref') || params.get('sponsorId');
        if (!ref) return;

        const cleanRef = ref.trim().toUpperCase();
        // Strict async lookup against Root Sponsor, local database, and cloud Firestore
        const realSponsor = await getSponsorUserAsync(cleanRef);
        if (!isMounted) return;

        if (realSponsor) {
          // Authentic registered sponsor found
          setSponsorReferralId(realSponsor.userId);
          setSponsorUser(realSponsor);
          setIsSponsorModalOpen(true);
        } else {
          // Strictly reject random/fake IDs: default to official root sponsor without fake cards
          setSponsorReferralId(OFFICIAL_ROOT_SPONSOR_ID);
          setSponsorUser(OFFICIAL_ROOT_SPONSOR_USER);
        }
      } catch {
        // ignore
      }
    };

    checkUrlSponsor();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fast Non-Blocking Deferred Sync with backend (Prioritizes 0-delay instant initial page paint)
  useEffect(() => {
    let isMounted = true;
    const sync = async () => {
      try {
        const freshUsers = await fetchUsersFromServer();
        if (isMounted && currentUser) {
          const found = freshUsers.find((u) => u.userId.toUpperCase() === currentUser.userId.toUpperCase());
          if (found) {
            setCurrentUser(found);
            persistCurrentUser(found);
          }
        }
      } catch (e) {
        // Non-blocking fallback
      }
    };
    
    // First sync after 1.2s so initial load happens instantly without any network wait
    const initialTimer = setTimeout(sync, 1200);
    const interval = setInterval(sync, 25000);
    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [currentUser?.userId]);

  const navigateTo = (page: PageType) => {
    if (page === 'home') {
      setCurrentPage('home');
      setPopupPage(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'register') {
      handleOpenRegister();
    } else if (page === 'dashboard') {
      handleOpenDashboard();
    } else if (page === 'idcard') {
      handleOpenIdCard();
    } else {
      // Instantly open page in modal popup window over current view (0ms delay)
      setPopupPage(page);
    }
  };

  const handleOpenChatWithQuery = (query: string) => {
    setChatInitialQuery(query);
    setIsChatOpen(true);
  };

  const handleOpenLogin = (
    mode: 'login' | 'forgot_user_id' | 'forgot_password' = 'login',
    prefill?: { identifier?: string; mobile?: string; userId?: string }
  ) => {
    setAuthModalInitialMode(mode);
    setAuthModalPrefill(prefill || {});
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = (planId?: number) => {
    if (planId) setSelectedPlanForRegister(planId);
    setIsRegisterModalOpen(true);
  };

  const handleOpenRegisterWithSponsor = (sponsorId: string) => {
    setSponsorReferralId(sponsorId);
    setSelectedPlanForRegister(1);
    setIsRegisterModalOpen(true);
  };

  const handleOpenDashboard = () => {
    if (!currentUser) {
      handleOpenLogin('login');
      return;
    }
    setIsDashboardModalOpen(true);
  };

  const handleOpenIdCard = () => {
    setIsIdCardModalOpen(true);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setIsDashboardModalOpen(false);
    navigateTo('home');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    // Open the member dashboard dialog box window directly!
    setIsDashboardModalOpen(true);
  };

  const handleRegisterSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsRegisterModalOpen(false);
    // Open the member dashboard dialog box window directly!
    setIsDashboardModalOpen(true);
  };

  const handleSelectPlanForRegister = (planId: number) => {
    setSelectedPlanForRegister(planId);
    setIsRegisterModalOpen(true);
  };

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors duration-300 selection:bg-amber-500 selection:text-black"
      style={{
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-primary)',
      }}
    >
      {/* 1. Header & Navigation (Always connects to home and all pages) */}
      <Navbar
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenChat={() => {
          setChatInitialQuery('');
          setIsChatOpen(true);
        }}
        onOpenServices={() => setIsServicesModalOpen(true)}
        onOpenLogin={() => handleOpenLogin('login')}
        onOpenRegister={() => handleOpenRegister()}
        onOpenDashboard={handleOpenDashboard}
        onOpenIdCard={handleOpenIdCard}
        onLogout={handleLogout}
        currentMode={themeMode}
        onToggleMode={handleToggleMode}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* 2. Controlled Live News & Instant Payout Ticker */}
      <TickerBar onOpenRegister={(planId) => handleSelectPlanForRegister(planId || 1)} />

      {/* 2.5 Active Verified Sponsor Invitation Bar (ACC India / SWACCDK01 Style) */}
      {sponsorUser && sponsorReferralId && !currentUser && (
        <div className="bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 border-y border-amber-500/40 py-2.5 px-3 text-xs text-white shadow-lg sticky top-16 z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                🤝 सत्यापित स्पॉन्सर आमंत्रण
              </span>
              <span className="text-slate-300">
                आमंत्रितकर्ता: <strong className="text-white font-bold">{sponsorUser.fullName}</strong>
              </span>
              <span className="font-mono text-amber-300 bg-slate-900 px-2 py-0.5 rounded-md border border-amber-500/40 font-bold tracking-wider">
                Sponsor ID: {sponsorReferralId}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => handleOpenRegisterWithSponsor(sponsorReferralId)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-[11px] uppercase transition cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>इस स्पॉन्सर से रजिस्टर करें →</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSponsorModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/50 text-amber-300 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
              >
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>मास्क्ड ID कार्ड देखें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Dynamic Content Area based on Current Page - Full width & responsive */}
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-10 space-y-6 sm:space-y-12 flex-1 pb-36 sm:pb-16">
        <Suspense fallback={<PageFallbackLoader />}>
        
        {/* ================= PAGE 1: HOME PAGE (Central Dashboard with all section buttons) ================= */}
        {currentPage === 'home' && (
          <div className="space-y-12">
            {/* If logged in, show quick dashboard notice */}
            {currentUser && (
              <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-400 shrink-0">
                    <img src={currentUser.photoUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs text-amber-400 font-bold block">सक्रिय लॉगिन सत्र (Active Member):</span>
                    <h3 className="text-base sm:text-lg font-black text-white">{currentUser.fullName} ({currentUser.userId})</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenDashboard}
                    className="btn-3d-gold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-slate-950 font-black text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>मेरा डैशबोर्ड</span>
                  </button>
                  <button
                    onClick={handleOpenIdCard}
                    className="btn-3d-silver px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-slate-950 text-xs font-black cursor-pointer flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>ID कार्ड</span>
                  </button>
                </div>
              </div>
            )}

            {/* Central Navigation Hub with Live Dual Clocks, Guided Purpose Welcome & Complete IOIS Overview */}
            <HomePageDashboard
              onNavigate={navigateTo}
              onOpenLogin={() => handleOpenLogin('login')}
              onOpenRegister={handleOpenRegister}
              onOpenDashboard={handleOpenDashboard}
              onOpenIdCard={handleOpenIdCard}
              onOpenAiChat={() => {
                setChatInitialQuery('');
                setIsChatOpen(true);
              }}
              onSelectPlanForRegister={handleSelectPlanForRegister}
            />
          </div>
        )}

        {/* ================= PAGE 2: 7 MASTER PLANS PAGE ================= */}
        {currentPage === 'plans' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="plans"
              onNavigate={navigateTo}
              title="7 मास्टर प्लांस (IOIS 7 Master Plans)"
              subtitle="₹10 से ₹999 तक के सभी आधिकारिक प्लांस, 50% से 70% इंसेंटिव व डिजिटल संसाधन"
            />
            <PlansGrid
              onAskAI={handleOpenChatWithQuery}
              onSelectPlanForRegister={handleSelectPlanForRegister}
            />
          </div>
        )}

        {/* ================= PAGE 3: REGISTRATION PAGE ================= */}
        {currentPage === 'register' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="register"
              onNavigate={navigateTo}
              title="नया सदस्य रजिस्ट्रेशन (Member Registration)"
              subtitle="3 आसान चरणों में पंजीकरण पूर्ण करें और तुरंत डिजिटल ID कार्ड प्राप्त करें"
            />
            <RegistrationPortal
              onRegisterSuccess={handleRegisterSuccess}
              onOpenLogin={handleOpenLogin}
              preSelectedPlanId={selectedPlanForRegister}
              initialSponsorId={sponsorReferralId}
            />
          </div>
        )}

        {/* ================= PAGE 4: DIGITAL ID CARD PAGE ================= */}
        {currentPage === 'idcard' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="idcard"
              onNavigate={navigateTo}
              title="वेरिफाइड डिजिटल ID कार्ड जनरेटर (Digital ID Card)"
              subtitle="256-Bit एन्क्रिप्टेड स्मार्ट डिजिटल पहचान पत्र, आगे-पीछे का प्रिव्यू व HD PNG डाउनलोड"
            />
            <IDCardGenerator
              currentUser={currentUser}
              onOpenRegister={() => handleOpenRegister()}
            />
          </div>
        )}

        {/* ================= PAGE 5: PAYOUT CALCULATOR PAGE ================= */}
        {currentPage === 'calculator' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="calculator"
              onNavigate={navigateTo}
              title="इंसेंटिव व अर्निंग कैलकुलेटर (Payout Calculator)"
              subtitle="योजना अनुसार 50% से 70% दैनिक, साप्ताहिक व मासिक रेफरल आय का लाइव सिमुलेटर"
            />
            <PayoutCalculator />
          </div>
        )}

        {/* ================= PAGE 6: ASSESSMENT & INTERVIEW TEST PAGE ================= */}
        {currentPage === 'assessment' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="assessment"
              onNavigate={navigateTo}
              title="कैरियर व प्लान असेसमेंट टेस्ट (Interview & Assessment)"
              subtitle="2 मिनट का इंटरएक्टिव टेस्ट जो आपकी रुचि व लक्ष्य के अनुसार सही प्लान सुझाए"
            />
            <AssessmentPortal onAskAI={handleOpenChatWithQuery} />
          </div>
        )}

        {/* ================= PAGE 7: PARENTS PORTAL PAGE ================= */}
        {currentPage === 'parents' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="parents"
              onNavigate={navigateTo}
              title="अभिभावक सुरक्षा व सत्यापन (Parents Portal)"
              subtitle="100% सुरक्षित डिजिटल वातावरण, NCERT पाठ्यक्रम व बाल सुरक्षा नीतियां"
            />
            <ParentsPortal />
          </div>
        )}

        {/* ================= PAGE 7.2: STUDENT STUDY & CAREER PORTAL ================= */}
        {(currentPage === 'study' || currentPage === 'student-study') && (
          <div className="space-y-8">
            <PageHeader
              currentPage={currentPage}
              onNavigate={navigateTo}
              title="विद्यार्थी शिक्षा व करियर हब (Student Study & Career Portal)"
              subtitle="Class 1-12 & BA/BSc/BCom NCERT नोट्स, ADCA कंप्यूटर कोर्स, बोनाफाइड सर्टिफिकेट व संपूर्ण करियर गाइड"
            />
            <StudentStudyPage
              onNavigate={navigateTo}
              onOpenAiChatWithQuery={handleOpenChatWithQuery}
            />
          </div>
        )}

        {/* ================= PAGE 7.5: RTPS & JAMIN SUDHAR & SCHEMES PAGE ================= */}
        {currentPage === 'rtps-services' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="rtps-services"
              onNavigate={navigateTo}
              title="RTPS, जमीन सुधार, आधार-पैन व मुफ्त सरकारी योजनाएं (Citizen Services Guide)"
              subtitle="जाति, आय, निवास, दाखिल खारिज, परिमार्जन, LPC, instant e-PAN, पेंशन व छात्रवृत्ति के आवश्यक दस्तावेज, आवेदन विधि व सत्यापन प्रक्रिया"
            />
            <RtpsJaminServicesPage />
          </div>
        )}

        {/* ================= PAGE 8: LIVE WEATHER PAGE ================= */}
        {currentPage === 'weather' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="weather"
              onNavigate={navigateTo}
              title="लाइव मौसम, वर्षा अलर्ट व 7-दिवसीय पूर्वानुमान (Live Weather)"
              subtitle="सटीक शहरवार तापमान, बादलों की स्थिति, बारिश एनिमेशन व आधिकारिक मौसम अलर्ट"
            />
            <WeatherPage />
          </div>
        )}

        {/* ================= PAGE 9: LIVE NEWS & E-PAPER PAGE ================= */}
        {currentPage === 'news' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="news"
              onNavigate={navigateTo}
              title="लाइव 24x7 टीवी चैनल्स व ई-अखबार डायरेक्टरी (Live News & E-Papers)"
              subtitle="देश-दुनिया की ताजा खबरें, 6 प्रमुख टीवी लाइव स्ट्रीम व डिजिटल समाचार पत्र"
            />
            <LiveNewsPage
              onNavigate={navigateTo}
              onOpenRegister={handleOpenRegister}
              onOpenAiChat={() => setIsChatOpen(true)}
            />
          </div>
        )}

        {/* ================= PAGE 9.5: ENTERTAINMENT, CHAT & AI TOOLS HUB ================= */}
        {(currentPage === 'entertainment' || currentPage === 'entertainment-chat') && (
          <div className="space-y-8">
            <PageHeader
              currentPage={currentPage}
              onNavigate={navigateTo}
              title="मनोरंजन, कम्युनिटी लाइव चैट व फ्री AI टूल्स हब (Entertainment & Chat Hub)"
              subtitle="बिना Ads के वीडियो व प्लेलिस्ट प्लेयर, सदस्यों के साथ फोटो/वॉइस/वीडियो चैट और गूगल सर्च व ChatGPT एआई टूल्स"
            />
            <EntertainmentChatPage
              currentUser={currentUser}
              onOpenLogin={() => handleOpenLogin('login')}
              onNavigateToPlans={() => navigateTo('plans')}
            />
          </div>
        )}

        {/* ================= PAGE 10: PANCHANG & RASHIFAL PAGE ================= */}
        {currentPage === 'panchang-rashifal' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="panchang-rashifal"
              onNavigate={navigateTo}
              title="लाइव घड़ी, दैनिक पंचांग व 12 राशि भविष्य (Panchang & Daily Horoscope)"
              subtitle="सटीक भारतीय वैदिक पंचांग, शुभ मुहूर्त, राहु काल व 12 राशियों का लकी कलर व नंबर"
            />
            <PanchangRashifalPage />
          </div>
        )}

        {/* ================= PAGE 11: MANDI & BULLION MARKET PAGE ================= */}
        {currentPage === 'mandi-market' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="mandi-market"
              onNavigate={navigateTo}
              title="लाइव कृषि मंडी भाव, सोना-चांदी व स्मार्ट डील्स (Mandi & Bullion)"
              subtitle="फसलों के दैनिक मंडी भाव, 10 प्रमुख शहरों के 24K/22K गोल्ड रेट व आज क्या सस्ता क्या महंगा"
            />
            <MandiMarketPage />
          </div>
        )}

        {/* ================= PAGE 12: GOVT SCHEMES & WEBSITES PAGE ================= */}
        {currentPage === 'govt-schemes' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="govt-schemes"
              onNavigate={navigateTo}
              title="सरकारी योजनाएं, आवश्यक वेबसाइट्स व नागरिक कानून (Govt Directory)"
              subtitle="आधार, पैन, राशन, भूलेख, PF, आयुष्मान की पूरी जानकारी व इस्तेमाल का आसान तरीका"
            />
            <GovtSchemesPage />
          </div>
        )}

        {/* ================= PAGE 13: LIVE JOBS & CAREERS PAGE ================= */}
        {currentPage === 'jobs' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="jobs"
              onNavigate={navigateTo}
              title="लाइव सरकारी व प्राइवेट नौकरी अलर्ट (Jobs & Careers)"
              subtitle="SSC, रेलवे, बैंक, पुलिस की नई भर्तियां और IOIS में वर्क-फ्रॉम-होम डिजिटल इनकम के अवसर"
            />
            <JobAlertsPage onOpenRegister={() => handleOpenRegister()} />
          </div>
        )}

        {/* ================= PAGE 14: LIVE UTILITIES PAGE ================= */}
        {currentPage === 'utilities' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="utilities"
              onNavigate={navigateTo}
              title="लाइव घड़ी, पंचांग व स्मार्ट टीवी डिस्प्ले (Utilities)"
              subtitle="सटीक भारतीय पंचांग, डिजिटल एनालॉग क्लॉक व टीवी डिस्प्ले मोड"
            />
            <LiveClockPanchang />
          </div>
        )}

        {/* ================= PAGE 9: ADMIN APPROVAL PANEL PAGE ================= */}
        {currentPage === 'admin' && (
          <div className="space-y-4">
            <AdminPanel
              onUserStatusChange={() => {
                const current = getCurrentUser();
                if (current) setCurrentUser(current);
              }}
            />
          </div>
        )}

        {/* ================= PAGE 10: USER DASHBOARD PAGE ================= */}
        {currentPage === 'dashboard' && (
          <div className="space-y-8">
            {currentUser && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-400">सुपर फास्ट एक्सेस</span>
                  <h4 className="text-sm font-black text-white">क्विक डैशबोर्ड पॉप-अप विंडो</h4>
                  <p className="text-xs text-slate-300">सीधे पॉप-अप में प्रोफाइल, ID कार्ड व सपोर्ट टिकट तेजी से मैनेज करें।</p>
                </div>
                <button
                  onClick={handleOpenDashboard}
                  className="shrink-0 px-4 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 hover:scale-105 transition cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>डैशबोर्ड तुरंत खोलें</span>
                </button>
              </div>
            )}
            <PageHeader
              currentPage="dashboard"
              onNavigate={navigateTo}
              title="सदस्य प्रोफाइल व डैशबोर्ड (Member Dashboard)"
              subtitle="अपनी प्रोफाइल एडिट करें, वेरिफिकेशन स्टेटस देखें व सपोर्ट टिकट बनाएं"
            />
            {currentUser ? (
              <UserDashboard
                user={currentUser}
                onUserUpdated={(updated) => setCurrentUser(updated)}
                onLogout={handleLogout}
                onScrollToCard={() => handleOpenIdCard()}
              />
            ) : (
              <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
                <p className="text-slate-300">डैशबोर्ड देखने के लिए कृपया लॉगिन करें या नया खाता रजिस्टर करें।</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleOpenLogin('login')}
                    className="px-6 py-2.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition cursor-pointer"
                  >
                    लॉगिन करें
                  </button>
                  <button
                    onClick={() => handleOpenRegister()}
                    className="px-6 py-2.5 rounded-full bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
                  >
                    नया रजिस्ट्रेशन
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= PAGE 11: CONTACT & FAQ PAGE ================= */}
        {currentPage === 'contact' && (
          <div className="space-y-8">
            <PageHeader
              currentPage="contact"
              onNavigate={navigateTo}
              title="आधिकारिक संपर्क व अक्सर पूछे जाने वाले प्रश्न (Help & FAQs)"
              subtitle="🎧【『𝗡𝗘𝗪 𝗨𝗦𝗘𝗥 𝗛𝗘𝗟𝗣𝗟𝗜𝗡𝗘』】Telegram व Email सपोर्ट (newuserhelpline@gmail.com)"
            />
            <ContactFaq onAskAI={handleOpenChatWithQuery} />
          </div>
        )}

        {/* ================= PAGE 12: GOOGLE ADSENSE LEGAL POLICIES ================= */}
        {(currentPage === 'privacy-policy' || currentPage === 'terms' || currentPage === 'disclaimer') && (
          <LegalPolicyPages
            initialTab={currentPage}
            onNavigate={navigateTo}
          />
        )}

        {/* ================= STANDARD BOTTOM SHORTCUTS BAR FOR ALL SUB-PAGES ================= */}
        {currentPage !== 'home' && (
          <QuickPageShortcuts
            currentPage={currentPage}
            onNavigate={navigateTo}
            onOpenAiChat={() => {
              setChatInitialQuery('');
              setIsChatOpen(true);
            }}
            onOpenServicesModal={() => setIsServicesModalOpen(true)}
            onOpenRegister={handleOpenRegister}
            onOpenIdCard={handleOpenIdCard}
          />
        )}
        </Suspense>
      </main>

      {/* 4. Official Footer with AdSense Compliance Navigation & Locked Options Hub */}
      <Footer 
        currentPage={currentPage}
        onNavigate={navigateTo}
        currentUser={currentUser}
        sponsorId={sponsorReferralId}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenDashboard={handleOpenDashboard}
        onOpenIdCard={handleOpenIdCard}
        onOpenSponsorCard={() => setIsSponsorModalOpen(true)}
      />

      {/* 5. Fixed Locked Bottom Options Dock Bar (Active on Mobile, Tablet & PC) */}
      <LockedFooterDock
        currentUser={currentUser}
        sponsorId={sponsorReferralId}
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenDashboard={handleOpenDashboard}
        onOpenIdCard={handleOpenIdCard}
        onOpenSponsorCard={() => setIsSponsorModalOpen(true)}
        onSetSponsorId={(newSponsorId) => {
          setSponsorReferralId(newSponsorId);
          const matched = findUserById(newSponsorId);
          if (matched) {
            setSponsorUser(matched);
          } else {
            setSponsorUser({
              userId: newSponsorId,
              fullName: 'IOIS Verified Member',
              mobileNumber: '+91 9876543210',
              email: 'member@iois.org.in',
              selectedPlanId: 7,
              role: 'Official Verified Member',
              photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              paymentStatus: 'approved',
              createdAt: new Date().toISOString(),
              privacySettings: {
                showFullName: false,
                showMobile: false,
                showEmail: false,
                showPhoto: false,
                showLocation: false,
              },
            });
          }
        }}
      />

      {/* 6. Floating AI Chatbot Launcher Button - Positioned safely above dock with full clearance */}
      <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setChatInitialQuery('आज कौन सा दिन व तारीख है?');
            setIsChatOpen(true);
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-lg backdrop-blur-md transition transform hover:scale-105 cursor-pointer"
          style={{
            backgroundColor: themeMode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)',
            borderColor: 'rgba(245, 158, 11, 0.4)',
            color: themeMode === 'light' ? '#0f172a' : '#f8fafc',
          }}
          title="आज का दिन तुरंत पूछें"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>📅 आज का दिन पूछें</span>
        </button>

        <button
          id="floating-ai-chat-launcher"
          onClick={() => {
            setChatInitialQuery('');
            setIsChatOpen(true);
          }}
          className="relative bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-3.5 sm:px-4 py-2.5 sm:py-3.5 rounded-full font-black text-xs sm:text-sm shadow-[0_10px_35px_rgba(212,175,55,0.45)] flex items-center gap-1.5 sm:gap-2 transition transform hover:scale-108 active:scale-95 cursor-pointer border-2 border-white/50 group"
          title="Open Live AI Assistant (चिंटू AI)"
        >
          <Sparkles className="w-4 h-4 text-black animate-spin" style={{ animationDuration: '4s' }} />
          <span>Ask IOIS AI</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      {/* 7. Live AI Chatbot Modal / Drawer */}
      <AIChatBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialQuery={chatInitialQuery}
        onNavigate={navigateTo}
        onOpenLogin={handleOpenLogin}
        onSelectPlanForRegister={handleSelectPlanForRegister}
        currentUser={currentUser}
      />

      {/* 8. Auth Modal (Login / Forgot ID / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsAuthModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        initialMode={authModalInitialMode}
        initialIdentifier={authModalPrefill.identifier}
        initialMobile={authModalPrefill.mobile}
        initialUserId={authModalPrefill.userId}
      />

      {/* 9. Dedicated Registration Pop-Up Dialog Box Modal */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onOpenLogin={(mode, prefill) => {
          setIsRegisterModalOpen(false);
          handleOpenLogin(mode || 'login', prefill);
        }}
        initialPlanId={selectedPlanForRegister}
        initialSponsorId={sponsorReferralId}
      />

      {/* 9.5 Dedicated Sponsor Privacy-Protected ID Card Visitor Modal */}
      <SponsorCardModal
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
        sponsorUser={sponsorUser}
        sponsorId={sponsorReferralId}
        onOpenRegisterWithSponsor={handleOpenRegisterWithSponsor}
        currentUser={currentUser}
      />

      {/* 10. Dedicated Member Dashboard Pop-Up Dialog Box Modal */}
      <DashboardModal
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
        user={currentUser}
        onUserUpdated={(updated) => setCurrentUser(updated)}
        onLogout={handleLogout}
        onOpenLogin={() => {
          setIsDashboardModalOpen(false);
          handleOpenLogin('login');
        }}
      />

      {/* 11. Dedicated Digital ID Card Pop-Up Dialog Box Modal */}
      <IdCardModal
        isOpen={isIdCardModalOpen}
        onClose={() => setIsIdCardModalOpen(false)}
        user={currentUser}
        onOpenRegister={() => {
          setIsIdCardModalOpen(false);
          handleOpenRegister();
        }}
        onOpenLogin={() => {
          setIsIdCardModalOpen(false);
          handleOpenLogin('login');
        }}
      />

      {/* 12. All IOIS Services & Portals Drawer Dialog Modal */}
      <IoisServicesDrawerModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenAiChat={() => {
          setIsServicesModalOpen(false);
          setChatInitialQuery('');
          setIsChatOpen(true);
        }}
      />

      {/* 13. Dedicated Theme Customization & Light/Dark Mode Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentMode={themeMode}
        currentPreset={themePreset}
        onModeChange={(mode) => {
          setThemeMode(mode);
          applyThemeToDocument(mode, themePreset);
        }}
        onPresetChange={handlePresetChange}
      />

      {/* 14. Dedicated Universal Instant Page Popup Window (0ms Delay) */}
      {popupPage && (
        <PagePopupModal
          page={popupPage}
          onClose={() => setPopupPage(null)}
          currentUser={currentUser}
          onOpenLogin={(mode) => {
            setPopupPage(null);
            handleOpenLogin(mode);
          }}
          onOpenRegister={(planId, sponsorId) => {
            setPopupPage(null);
            if (sponsorId) setSponsorReferralId(sponsorId);
            handleOpenRegister(planId);
          }}
          onOpenDashboard={() => {
            setPopupPage(null);
            handleOpenDashboard();
          }}
          onOpenIdCard={() => {
            setPopupPage(null);
            handleOpenIdCard();
          }}
          onOpenAiChat={() => {
            setPopupPage(null);
            setChatInitialQuery('');
            setIsChatOpen(true);
          }}
          onSelectPlanForRegister={(planId) => {
            setPopupPage(null);
            handleSelectPlanForRegister(planId);
          }}
          sponsorReferralId={sponsorReferralId}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
}
