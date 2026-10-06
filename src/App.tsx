import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ClassSelectionGrid } from './components/ClassSelectionGrid';
import { KidsLearningCorner } from './components/KidsLearningCorner';
import { MembershipPlansSection } from './components/MembershipPlansSection';
import { StudentLeaderboardWidget } from './components/StudentLeaderboardWidget';
import { StudentMainDashboardView } from './components/StudentMainDashboardView';
import { Footer } from './components/Footer';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { PromotionalPosterBanner } from './components/PromotionalPosterBanner';
import { useSiteSettings } from './hooks/useSiteSettings';
import { ioisMasterPlans } from './data/ioisPlansData';
import { PlanDetail, MemberProfile } from './types';
import { 
  getCurrentSessionUser, 
  setCurrentSessionUser 
} from './services/userService';

// Lazy-loaded modal & heavy components for code splitting & lightweight initial bundle
const LoginModal = lazy(() => import('./components/LoginModal'));
const RegistrationModal = lazy(() => import('./components/RegistrationModal'));
const UserDashboardModal = lazy(() => import('./components/UserDashboardModal'));
const IdCardModal = lazy(() => import('./components/IdCardModal').then(m => ({ default: m.IdCardModal })));
const AdminPanelModal = lazy(() => import('./components/AdminPanelModal').then(m => ({ default: m.AdminPanelModal })));
const StudyResourceViewerModal = lazy(() => import('./components/StudyResourceViewerModal').then(m => ({ default: m.StudyResourceViewerModal })));
const NurseryAlphabetWorkbook = lazy(() => import('./components/NurseryAlphabetWorkbook').then(m => ({ default: m.NurseryAlphabetWorkbook })));
const PlansDialogModal = lazy(() => import('./components/PlansDialogModal').then(m => ({ default: m.PlansDialogModal })));
const VideoModalDialog = lazy(() => import('./components/VideoModalDialog').then(m => ({ default: m.VideoModalDialog })));
const TracingModalDialog = lazy(() => import('./components/TracingModalDialog').then(m => ({ default: m.TracingModalDialog })));
const HomeworkModalDialog = lazy(() => import('./components/HomeworkModalDialog').then(m => ({ default: m.HomeworkModalDialog })));
const KidsAiTeacherZone = lazy(() => import('./components/KidsAiTeacherZone').then(m => ({ default: m.KidsAiTeacherZone })));
const AiAssistantModal = lazy(() => import('./components/AiAssistantModal').then(m => ({ default: m.AiAssistantModal })));
const StudentPlanHubPage = lazy(() => import('./components/StudentPlanHubPage').then(m => ({ default: m.StudentPlanHubPage })));

// Lightweight non-blocking loading spinner fallback for lazy components
const ModalLoadingFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
    <div className="bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 border border-slate-200">
      <div className="w-5 h-5 border-2 border-[#991b1b] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold text-slate-800">लोड हो रहा है...</span>
    </div>
  </div>
);

export default function App() {
  const siteSettings = useSiteSettings();

  // User session state
  const [currentUser, setCurrentUser] = useState<MemberProfile | null>(() => {
    return getCurrentSessionUser() || null;
  });

  // Dedicated Study Page state
  const [activeStudyPlanId, setActiveStudyPlanId] = useState<string | null>(null);

  // Dedicated Dialog Boxes (Modals) state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [selectedPlanForReg, setSelectedPlanForReg] = useState<string>('plan-01');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [kidsAiZoneOpen, setKidsAiZoneOpen] = useState(false);
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [tracingModalOpen, setTracingModalOpen] = useState(false);
  const [homeworkModalOpen, setHomeworkModalOpen] = useState(false);
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [nurseryWorkbookOpen, setNurseryWorkbookOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedStudyPlanId, setSelectedStudyPlanId] = useState<string>('plan-01');

  // Single Page View: Dashboard View vs Landing View
  const [isDashboardView, setIsDashboardView] = useState<boolean>(() => !!getCurrentSessionUser());

  // Auto-sync current user session
  useEffect(() => {
    const user = getCurrentSessionUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleOpenAi = (prompt?: string) => {
    setAiInitialPrompt(prompt);
    setAiModalOpen(true);
  };

  const handleOpenRegistration = (planId?: string) => {
    if (planId) setSelectedPlanForReg(planId);
    setRegistrationModalOpen(true);
  };

  const handleSuccessRegistration = (newProfile: MemberProfile) => {
    setCurrentUser(newProfile);
    setIsDashboardView(true);
    setRegistrationModalOpen(false);
    setIdCardModalOpen(true);
  };

  const handleSuccessLogin = (member: MemberProfile) => {
    setCurrentUser(member);
    setIsDashboardView(true);
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentSessionUser(null);
    setCurrentUser(null);
    setIsDashboardView(false);
    setDashboardModalOpen(false);
  };

  // Open Study Dialog
  const handleOpenStudyModal = (planId: string) => {
    setSelectedStudyPlanId(planId);
    setStudyModalOpen(true);
  };

  const handleOpenStudyPage = (planId: string) => {
    setActiveStudyPlanId(planId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId: string) => {
    if (activeStudyPlanId) {
      setActiveStudyPlanId(null);
    }
    setTimeout(() => {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 50);
  };

  const handleOpenIdCardModal = () => {
    if (currentUser) {
      setIdCardModalOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  // Find active plan object
  const activePlanObj: PlanDetail | undefined = activeStudyPlanId 
    ? ioisMasterPlans.find(p => p.id === activeStudyPlanId)
    : undefined;

  const currentStudyPlanObj: PlanDetail = ioisMasterPlans.find(p => p.id === selectedStudyPlanId) || ioisMasterPlans[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans antialiased overflow-x-hidden w-full max-w-full">
      
      {/* 1. Global Student Navbar (Professional Educational Blue & White) */}
      {!isDashboardView && (
        <Navbar
          currentUser={currentUser}
          onOpenAiModal={handleOpenAi}
          onOpenRegistrationModal={handleOpenRegistration}
          onOpenLoginModal={() => {
            if (currentUser) {
              setIsDashboardView(true);
            } else {
              setLoginModalOpen(true);
            }
          }}
          onOpenDashboardModal={() => setIsDashboardView(true)}
          onOpenIdCardModal={handleOpenIdCardModal}
          onOpenStudyModal={handleOpenStudyModal}
          onOpenVideoModal={() => setVideoModalOpen(true)}
          onOpenTracingModal={() => setTracingModalOpen(true)}
          onOpenHomeworkModal={() => setHomeworkModalOpen(true)}
          onOpenPlansModal={() => setPlansModalOpen(true)}
          onOpenNurseryWorkbook={() => setNurseryWorkbookOpen(true)}
          onOpenAdminModal={() => setAdminModalOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {/* Global Announcement Ticker (Managed by Admin Panel) */}
      {!isDashboardView && siteSettings.announcementTickerEnabled && siteSettings.announcementTickerText && (
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-slate-950 font-bold text-xs py-1.5 px-3 sm:px-4 shadow-sm flex items-center justify-between border-b border-orange-700 overflow-hidden w-full max-w-full">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2 overflow-hidden min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black uppercase shrink-0">
              📢 आधिकारिक सूचना
            </span>
            <span className="truncate text-slate-950 font-black text-[11px] sm:text-xs min-w-0">
              {siteSettings.announcementTickerText}
            </span>
          </div>
        </div>
      )}

      {/* CONDITIONAL VIEWS:
          1. Dedicated Full-screen Plan Study Hub (activePlanObj)
          2. Logged-in Student Main Dashboard View (isDashboardView && currentUser)
          3. Main Landing Homepage (Every button opens a Dialog Box)
      */}
      {activePlanObj ? (
        <Suspense fallback={<ModalLoadingFallback />}>
          <StudentPlanHubPage
            plan={activePlanObj}
            currentUser={currentUser}
            onBack={() => setActiveStudyPlanId(null)}
            onSwitchPlan={(newPlanId) => {
              setActiveStudyPlanId(newPlanId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRegistration={(pId) => handleOpenRegistration(pId)}
            onOpenLogin={() => setLoginModalOpen(true)}
          />
        </Suspense>
      ) : isDashboardView && currentUser ? (
        <StudentMainDashboardView
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenStudyModal={handleOpenStudyModal}
          onOpenIdCard={handleOpenIdCardModal}
          onViewHomepage={() => setIsDashboardView(false)}
          onProfileUpdated={(updated) => setCurrentUser(updated)}
          onOpenVideoModal={() => setVideoModalOpen(true)}
        />
      ) : (
        /* MAIN LANDING: Professional Trust & Educational Blue Theme */
        <main className="flex-1">
          {/* SECTION 1: HEADER & HERO SECTION (IOIS INDIA Platform Style) */}
          <HeroSection
            currentUser={currentUser}
            onOpenStudyModal={handleOpenStudyModal}
            onOpenVideoModal={() => setVideoModalOpen(true)}
            onOpenTracingModal={() => setTracingModalOpen(true)}
            onOpenHomeworkModal={() => setHomeworkModalOpen(true)}
            onOpenPlansModal={() => setPlansModalOpen(true)}
            onOpenAiTeacherModal={() => setKidsAiZoneOpen(true)}
            onClaimPass={() => handleOpenRegistration('plan-01')}
            onOpenNurseryWorkbook={() => setNurseryWorkbookOpen(true)}
            onOpenIdCardModal={handleOpenIdCardModal}
            onOpenLoginModal={() => {
              if (currentUser) {
                setIsDashboardView(true);
              } else {
                setLoginModalOpen(true);
              }
            }}
            onOpenResumeBuilder={() => setActiveStudyPlanId('plan-02')}
            onOpenRegistration={(pId) => handleOpenRegistration(pId || 'plan-01')}
          />

          {/* PROMOTIONAL POSTERS BANNER (Managed by Admin Panel) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PromotionalPosterBanner
              onSelectPlan={(pId) => handleOpenRegistration(pId)}
              onOpenStudyModal={handleOpenStudyModal}
            />
          </div>

          {/* SECTION 2: SMART STUDENT DASHBOARD / CLASS SELECTION GRID */}
          <ClassSelectionGrid
            onOpenStudyPage={(pId) => handleOpenStudyModal(pId)}
            onOpenAiTeacher={(prompt) => handleOpenAi(prompt)}
            onScrollToPlans={() => setPlansModalOpen(true)}
          />

          {/* SECTION 3: KIDS SPECIAL E-LEARNING & AI TEACHER CORNER */}
          <KidsLearningCorner
            onOpenStudyPage={(pId) => handleOpenStudyModal(pId)}
            onOpenAiTeacher={(prompt) => handleOpenAi(prompt)}
            onOpenKidsAiZone={() => setKidsAiZoneOpen(true)}
            onOpenNurseryWorkbook={() => setNurseryWorkbookOpen(true)}
          />

          {/* SECTION 4: MEMBERSHIP PLANS & PACKAGES SECTION */}
          <MembershipPlansSection
            currentUser={currentUser}
            onSelectPlan={(plan) => handleOpenRegistration(plan.id)}
            onOpenStudyPage={(pId) => handleOpenStudyModal(pId)}
          />

          {/* SECTION 4.1: STUDENT LEADERBOARD & REPUTATION */}
          <StudentLeaderboardWidget
            currentUser={currentUser}
            onOpenStudyPage={(pId) => handleOpenStudyModal(pId)}
          />
        </main>
      )}

      {/* SECTION 5: FOOTER (Landing View only) */}
      {!activePlanObj && !isDashboardView && (
        <Footer
          onScrollToTop={() => handleScrollToSection('top')}
          onOpenAiModal={() => handleOpenAi()}
          onOpenIdCardModal={handleOpenIdCardModal}
          onOpenRegistration={() => handleOpenRegistration('plan-01')}
          onOpenStudyModal={handleOpenStudyModal}
          onOpenPlansModal={() => setPlansModalOpen(true)}
          onOpenVideoModal={() => setVideoModalOpen(true)}
          onOpenTracingModal={() => setTracingModalOpen(true)}
          onOpenHomeworkModal={() => setHomeworkModalOpen(true)}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 🚀 CODE-SPLIT LAZY MODALS (Suspense & React.lazy for Fast Loading) */}
      {/* ------------------------------------------------------------- */}
      <Suspense fallback={<ModalLoadingFallback />}>
        {/* 1. Plans Dialog Box Modal */}
        {plansModalOpen && (
          <PlansDialogModal
            isOpen={plansModalOpen}
            onClose={() => setPlansModalOpen(false)}
            onSelectPlanStudy={(pId) => handleOpenStudyModal(pId)}
            onSelectPlanJoin={(pId) => handleOpenRegistration(pId)}
          />
        )}

        {/* 2. Video Lessons Player Dialog Box Modal */}
        {videoModalOpen && (
          <VideoModalDialog
            isOpen={videoModalOpen}
            onClose={() => setVideoModalOpen(false)}
            planId={selectedStudyPlanId}
          />
        )}

        {/* 3. Digital Tracing Pad Dialog Box Modal */}
        {tracingModalOpen && (
          <TracingModalDialog
            isOpen={tracingModalOpen}
            onClose={() => setTracingModalOpen(false)}
            planId={selectedStudyPlanId}
          />
        )}

        {/* 4. Daily Homework & Check Dialog Box Modal */}
        {homeworkModalOpen && (
          <HomeworkModalDialog
            isOpen={homeworkModalOpen}
            onClose={() => setHomeworkModalOpen(false)}
            planId={selectedStudyPlanId}
          />
        )}

        {/* 5. Complete Study Resource & NCERT Notes Viewer Dialog Box Modal */}
        {studyModalOpen && (
          <StudyResourceViewerModal
            isOpen={studyModalOpen}
            onClose={() => setStudyModalOpen(false)}
            resource={null}
            plan={currentStudyPlanObj}
            currentUser={currentUser}
            onOpenLogin={() => setLoginModalOpen(true)}
            onOpenRegistration={(pId) => handleOpenRegistration(pId)}
          />
        )}

        {/* 6. Dedicated Kids AI Teacher Zone Dialog Box Modal */}
        {kidsAiZoneOpen && (
          <KidsAiTeacherZone
            isOpen={kidsAiZoneOpen}
            onClose={() => setKidsAiZoneOpen(false)}
            onOpenStudyPage={(pId) => handleOpenStudyModal(pId)}
          />
        )}

        {/* 8. 24x7 AI Assistant Tutor Dialog Box Modal */}
        {aiModalOpen && (
          <AiAssistantModal
            isOpen={aiModalOpen}
            onClose={() => setAiModalOpen(false)}
            initialPrompt={aiInitialPrompt}
            onSelectPlanToJoin={(plan) => {
              setAiModalOpen(false);
              handleOpenRegistration(plan.id);
            }}
          />
        )}

        {/* 9. Registration & Account Verification Pass Dialog Box Modal */}
        {registrationModalOpen && (
          <RegistrationModal
            isOpen={registrationModalOpen}
            onClose={() => setRegistrationModalOpen(false)}
            initialPlanId={selectedPlanForReg}
            onSuccess={handleSuccessRegistration}
            onOpenLogin={() => {
              setRegistrationModalOpen(false);
              setLoginModalOpen(true);
            }}
          />
        )}

        {/* 10. Student Login Dialog Box Modal */}
        {loginModalOpen && (
          <LoginModal
            isOpen={loginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            onSuccess={handleSuccessLogin}
            onOpenRegister={() => {
              setLoginModalOpen(false);
              setRegistrationModalOpen(true);
            }}
          />
        )}

        {/* 11. Student Academic Dashboard Dialog Box Modal */}
        {dashboardModalOpen && currentUser && (
          <UserDashboardModal
            isOpen={dashboardModalOpen}
            onClose={() => setDashboardModalOpen(false)}
            currentUser={currentUser}
            onOpenStudyPage={(pId) => handleOpenStudyModal(pId)}
            onOpenIdCardModal={handleOpenIdCardModal}
            onLogout={handleLogout}
          />
        )}

        {/* 12. Smart Student ID Card Dialog Box Modal */}
        {idCardModalOpen && currentUser && (
          <IdCardModal
            isOpen={idCardModalOpen}
            onClose={() => setIdCardModalOpen(false)}
            currentUser={currentUser}
          />
        )}

        {/* 13. Secure Admin Panel Dialog Box Modal (Firebase Live DB & Kit Setup) */}
        {adminModalOpen && (
          <AdminPanelModal
            isOpen={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
            onUsersUpdated={() => {
              const u = getCurrentSessionUser();
              if (u) setCurrentUser(u);
            }}
          />
        )}

        {/* 14. IOIS Nursery Alphabet Series (A to Z) Educational Workbook Modal */}
        {nurseryWorkbookOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
            <NurseryAlphabetWorkbook onClose={() => setNurseryWorkbookOpen(false)} />
          </div>
        )}
      </Suspense>

      {/* Floating Speed-Dial Call & WhatsApp Contact Widget (Controlled by Admin) */}
      <FloatingContactWidget />

    </div>
  );
}
