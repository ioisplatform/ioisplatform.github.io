import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TickerBar } from './components/TickerBar';
import { HomePageDashboard } from './components/HomePageDashboard';
import { PageHeader } from './components/PageHeader';
import { AssessmentPortal } from './components/AssessmentPortal';
import { LiveClockPanchang } from './components/LiveClockPanchang';
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
import { AuthModal } from './components/AuthModal';
import { ContactFaq } from './components/ContactFaq';
import { LegalPolicyPages } from './components/LegalPolicyPages';
import { QuickPageShortcuts } from './components/QuickPageShortcuts';
import { Footer } from './components/Footer';
import { AIChatBot } from './components/AIChatBot';
import { Plan, UserProfile, PageType } from './types';
import { getCurrentUser, logoutUser, fetchUsersFromServer, setCurrentUser as persistCurrentUser } from './services/userService';
import { Sparkles, ArrowLeft, Home, Crown, FileText, GraduationCap, CreditCard } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedPlanForRegister, setSelectedPlanForRegister] = useState<number>(1);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInitialQuery, setChatInitialQuery] = useState<string>('');

  // User Authentication & Session State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'forgot_user_id' | 'forgot_password'>('login');
  const [authModalPrefill, setAuthModalPrefill] = useState<{ identifier?: string; mobile?: string; userId?: string }>({});

  // Sync users with backend on launch and periodically check status updates
  useEffect(() => {
    const sync = async () => {
      const freshUsers = await fetchUsersFromServer();
      if (currentUser) {
        const found = freshUsers.find((u) => u.userId.toUpperCase() === currentUser.userId.toUpperCase());
        if (found) {
          setCurrentUser(found);
          persistCurrentUser(found);
        }
      }
    };
    sync();
    const interval = setInterval(sync, 15000);
    return () => clearInterval(interval);
  }, [currentUser?.userId]);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    navigateTo('home');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    navigateTo('dashboard');
  };

  const handleRegisterSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    navigateTo('dashboard');
  };

  const handleSelectPlanForRegister = (planId: number) => {
    setSelectedPlanForRegister(planId);
    navigateTo('register');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* 1. Header & Navigation (Always connects to home and all pages) */}
      <Navbar
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenChat={() => {
          setChatInitialQuery('');
          setIsChatOpen(true);
        }}
        onOpenLogin={() => handleOpenLogin('login')}
        onLogout={handleLogout}
      />

      {/* 2. Controlled Live News & Instant Payout Ticker */}
      <TickerBar />

      {/* 3. Main Dynamic Content Area based on Current Page - Full width & responsive */}
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-10 space-y-6 sm:space-y-12 flex-1 pb-20 sm:pb-8">
        
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
                    onClick={() => navigateTo('dashboard')}
                    className="px-5 py-2.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition cursor-pointer shadow-md"
                  >
                    सदस्य डैशबोर्ड खोलें →
                  </button>
                  <button
                    onClick={() => navigateTo('idcard')}
                    className="px-4 py-2.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                  >
                    ID कार्ड
                  </button>
                </div>
              </div>
            )}

            {/* Central Navigation Hub with Live Dual Clocks, Guided Purpose Welcome & Complete IOIS Overview */}
            <HomePageDashboard
              onNavigate={navigateTo}
              onOpenLogin={() => handleOpenLogin('login')}
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
              subtitle="₹10 से ₹999 तक के सभी आधिकारिक प्लांस, 70% इंसेंटिव व डिजिटल संसाधन"
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
              title="नया सदस्य रजिस्ट्रेशन (Official In-App Registration)"
              subtitle="डायरेक्ट इन-ऐप फॉर्म, 25MB+ पेमेंट प्रूफ अपलोड व ऑटो-जनरेटेड यूनिक User ID"
            />
            <RegistrationPortal
              onRegisterSuccess={handleRegisterSuccess}
              onOpenLogin={handleOpenLogin}
              preSelectedPlanId={selectedPlanForRegister}
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
              onOpenRegister={() => navigateTo('register')}
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
              subtitle="70% दैनिक, साप्ताहिक व मासिक रेफरल आय का लाइव सिमुलेटर"
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
            <LiveNewsPage />
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
            <JobAlertsPage onOpenRegister={() => navigateTo('register')} />
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
          <div className="space-y-8">
            <PageHeader
              currentPage="admin"
              onNavigate={navigateTo}
              title="आधिकारिक एडमिन पैनल (Admin Approval & Verification)"
              subtitle="सदस्य वेरिफिकेशन, पेमेंट प्रूफ अप्रूवल/रिजेक्शन व हेल्पडेस्क सपोर्ट"
            />
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
                onScrollToCard={() => navigateTo('idcard')}
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
                    onClick={() => navigateTo('register')}
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
              subtitle="24x7 WhatsApp, Telegram सपोर्ट व आपके सभी संशयों का त्वरित समाधान"
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
          />
        )}

      </main>

      {/* 4. Official Footer with AdSense Compliance Navigation */}
      <Footer onNavigate={navigateTo} />

      {/* 5. Mobile Bottom Quick Navigation Bar (1-Click access to top portals on phones) */}
      <nav 
        id="mobile-bottom-nav" 
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-amber-500/30 px-1 py-1.5 sm:hidden flex items-center justify-around shadow-[0_-5px_20px_rgba(0,0,0,0.8)]"
      >
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            currentPage === 'home' ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-bold">होम</span>
        </button>

        <button
          onClick={() => navigateTo('plans')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            currentPage === 'plans' ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] mt-0.5 font-bold">7 प्लान्स</span>
        </button>

        <button
          onClick={() => navigateTo('rtps-services')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            currentPage === 'rtps-services' ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] mt-0.5 font-bold">RTPS</span>
        </button>

        <button
          onClick={() => navigateTo('student-study')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            currentPage === 'student-study' || currentPage === 'study' ? 'text-violet-400 font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-violet-400" />
          <span className="text-[10px] mt-0.5 font-bold">पढ़ाई</span>
        </button>

        <button
          onClick={() => navigateTo('idcard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            currentPage === 'idcard' ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] mt-0.5 font-bold">ID कार्ड</span>
        </button>
      </nav>

      {/* 6. Floating AI Chatbot Launcher Button - Positioned above mobile bar on phones */}
      <button
        id="floating-ai-chat-launcher"
        onClick={() => {
          setChatInitialQuery('');
          setIsChatOpen(true);
        }}
        className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-40 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black px-3.5 sm:px-4 py-2.5 sm:py-3.5 rounded-full font-black text-xs sm:text-sm shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex items-center gap-1.5 sm:gap-2 transition transform hover:scale-108 active:scale-95 cursor-pointer border-2 border-white/40"
        title="Open Live AI Assistant"
      >
        <Sparkles className="w-4 h-4 text-black animate-spin" style={{ animationDuration: '4s' }} />
        <span>Ask IOIS AI</span>
      </button>

      {/* 7. Live AI Chatbot Modal / Drawer */}
      <AIChatBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialQuery={chatInitialQuery}
      />

      {/* 7. Auth Modal (Login / Forgot ID / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsAuthModalOpen(false);
          navigateTo('register');
        }}
        initialMode={authModalInitialMode}
        initialIdentifier={authModalPrefill.identifier}
        initialMobile={authModalPrefill.mobile}
        initialUserId={authModalPrefill.userId}
      />
    </div>
  );
}
