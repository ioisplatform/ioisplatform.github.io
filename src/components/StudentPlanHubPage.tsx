import React, { useState, useMemo, useEffect } from 'react';
import { PlanDetail, MemberProfile, CurriculumPage, PlanCurriculum } from '../types';
import { getCurriculumForPlan, ioisMasterPlans } from '../data/ioisPlansData';
import { studyWorkModules } from '../data/studyWorkData';
import { InteractiveTracingPad } from './InteractiveTracingPad';
import { StudentVideoLessonPlayer } from './StudentVideoLessonPlayer';
import { StudentHomeworkSystem } from './StudentHomeworkSystem';
import { 
  ArrowLeft, 
  BookOpen, 
  Tv, 
  FileCheck2, 
  Pencil, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Download, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Share2, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Copy,
  Printer,
  Crown,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  Clock,
  Layers,
  Star
} from 'lucide-react';

interface StudentPlanHubPageProps {
  plan: PlanDetail;
  currentUser: MemberProfile | null;
  onBack: () => void;
  onSwitchPlan: (planId: string) => void;
  onOpenRegistration: (planId: string) => void;
  onOpenLogin: () => void;
}

export const StudentPlanHubPage: React.FC<StudentPlanHubPageProps> = ({
  plan,
  currentUser,
  onBack,
  onSwitchPlan,
  onOpenRegistration,
  onOpenLogin
}) => {
  // Active Tab
  const [activeTab, setActiveTab] = useState<'notes' | 'video' | 'exercise' | 'homework' | 'tracing' | 'progress'>('notes');

  // Curriculum Data
  const curriculum: PlanCurriculum = useMemo(() => {
    return getCurriculumForPlan(plan.id);
  }, [plan.id]);

  const moduleData = studyWorkModules[plan.id] || studyWorkModules['plan-01'];

  // Notes Viewer State
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [fontSizeClass, setFontSizeClass] = useState<'text-xs' | 'text-sm' | 'text-base'>('text-sm');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  // Exercise Quiz State
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Tracking Progress State
  const [notesReadCount, setNotesReadCount] = useState<number>(() => {
    try {
      const v = localStorage.getItem(`iois_notes_read_${plan.id}`);
      return v ? parseInt(v, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [videosWatchedCount, setVideosWatchedCount] = useState<number>(() => {
    try {
      const v = localStorage.getItem(`iois_video_watched_${plan.id}`);
      return v ? parseInt(v, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [tracingDone, setTracingDone] = useState<boolean>(false);
  const [homeworkDoneCount, setHomeworkDoneCount] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Reset page index on subject or plan change
  useEffect(() => {
    setCurrentPageIndex(0);
    setSelectedSubject('all');
    stopSpeaking();
  }, [plan.id]);

  // Filtered curriculum pages
  const filteredPages = useMemo(() => {
    if (selectedSubject === 'all') {
      return curriculum.curriculumPages;
    }
    return curriculum.curriculumPages.filter(p => p.subject === selectedSubject);
  }, [curriculum, selectedSubject]);

  const activePage: CurriculumPage | undefined = filteredPages[currentPageIndex] || filteredPages[0] || (curriculum.curriculumPages && curriculum.curriculumPages[0]);

  // Text to Speech
  const toggleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Next / Prev Page
  const handleNextPage = () => {
    stopSpeaking();
    if (currentPageIndex < filteredPages.length - 1) {
      const nextIdx = currentPageIndex + 1;
      setCurrentPageIndex(nextIdx);
      if (nextIdx + 1 > notesReadCount) {
        setNotesReadCount(nextIdx + 1);
        try {
          localStorage.setItem(`iois_notes_read_${plan.id}`, String(nextIdx + 1));
        } catch (e) {
          console.error(e);
        }
      }
      window.scrollTo({ top: 220, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    stopSpeaking();
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      window.scrollTo({ top: 220, behavior: 'smooth' });
    }
  };

  // Download notes
  const handleDownloadNotes = () => {
    if (!activePage) return;
    const content = `IOIS DIGITAL EDUCATION NETWORK\nPLAN 0${plan.planNumber} - ${plan.name}\nविषय: ${activePage.subject} | स्तर: ${activePage.gradeOrLevel}\nशीर्षक: ${activePage.titleHindi} (${activePage.titleEnglish})\n\n[1] अवधारणा (Concept):\n${activePage.conceptOverview.hindi}\n${activePage.conceptOverview.english}\n\n[2] महत्वपूर्ण नियम एवं सूत्र:\n${activePage.keyFactsAndRules.join('\n• ')}\n\n[3] व्यावहारिक उदाहरण:\n${(activePage.realWorldExamples || []).map(e => `• ${e?.title || ''}: ${e?.description || ''} (अनुप्रयोग: ${e?.practicalApplication || ''})`).join('\n')}\n\nछात्र: ${currentUser ? currentUser.name : 'IOIS Student'}\nतारीख: ${new Date().toLocaleDateString('hi-IN')}\nhttps://ioisplatform.github.io/`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IOIS_${plan.id}_Page${activePage.pageNumber}_Notes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy share link
  const handleSharePlan = () => {
    const shareUrl = `https://ioisplatform.github.io/?plan=${plan.id}${currentUser ? `&ref=${currentUser.memberId}` : ''}`;
    if (navigator.share) {
      navigator.share({
        title: `${plan.name} - IOIS Study Hub`,
        text: `कक्षा व कौशल के लिए उत्कृष्ट अध्ययन पोर्टल: ${plan.name}`,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // All MCQs from this plan
  const allTasks = useMemo(() => {
    const list: { pageNum: number; task: any }[] = [];
    curriculum.curriculumPages.forEach(p => {
      p.assessmentTasks.forEach(t => {
        list.push({ pageNum: p.pageNumber, task: t });
      });
    });
    return list;
  }, [curriculum]);

  const correctAnswersCount = useMemo(() => {
    let count = 0;
    allTasks.forEach(({ task }) => {
      if (task.correctAnswer && userAnswers[task.id] === task.correctAnswer) {
        count++;
      }
    });
    return count;
  }, [allTasks, userAnswers]);

  // Overall Completion Calculation
  const progressPercent = useMemo(() => {
    const notesP = Math.min(100, Math.round((notesReadCount / curriculum.curriculumPages.length) * 100));
    const videoP = videosWatchedCount > 0 ? 100 : 0;
    const exerciseP = quizSubmitted ? Math.min(100, Math.round((correctAnswersCount / Math.max(1, allTasks.length)) * 100)) : (Object.keys(userAnswers).length > 0 ? 50 : 0);
    const homeworkP = homeworkDoneCount > 0 ? 100 : 0;
    const tracingP = tracingDone ? 100 : 0;

    return Math.round((notesP * 0.3) + (videoP * 0.2) + (exerciseP * 0.2) + (homeworkP * 0.15) + (tracingP * 0.15));
  }, [notesReadCount, curriculum.curriculumPages.length, videosWatchedCount, quizSubmitted, correctAnswersCount, allTasks.length, userAnswers, homeworkDoneCount, tracingDone]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pb-16">
      
      {/* 1. TOP NAVIGATION & PLAN SWITCHER BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        
        {/* Main Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
              title="होम पेज पर वापस जाएं"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">होम पेज</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-600 text-white font-mono">
                  PLAN 0{plan.planNumber}
                </span>
                <span className="text-xs sm:text-sm font-black text-white truncate max-w-[200px] sm:max-w-md">
                  {plan.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {plan.subtitle} • {curriculum.targetAudience}
              </p>
            </div>
          </div>

          {/* Right Actions: Student Info & Share */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="font-extrabold text-white block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">{currentUser.memberId}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenLogin}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
                >
                  लॉगिन
                </button>
                <button
                  onClick={() => onOpenRegistration(plan.id)}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow transition-colors"
                >
                  खाता बनाएं
                </button>
              </div>
            )}

            <button
              onClick={handleSharePlan}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
              title="शेयर करें"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-300" />}
            </button>
          </div>

        </div>

        {/* 7 Plans Horizontal Quick-Switcher Bar */}
        <div className="bg-slate-900 border-t border-slate-800/80 px-3 sm:px-6 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            7 प्लान्स:
          </span>
          {ioisMasterPlans.map((p) => {
            const isSelected = p.id === plan.id;
            return (
              <button
                key={p.id}
                onClick={() => onSwitchPlan(p.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md ring-2 ring-orange-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>P0{p.planNumber}</span>
                <span>•</span>
                <span>{p.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-80">(₹{p.price})</span>
              </button>
            );
          })}
        </div>

      </header>

      {/* 2. SUB-HERO BANNER FOR CURRENT PLAN */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 py-6 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% संपूर्ण स्टूडेंट किट
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {curriculum.subjectsAvailable.length} विषय सम्मिलित
              </span>
              {plan.isSupreme && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> ऑल-इन-वन सुप्रीम
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {plan.name}: डिजिटल अध्ययन एवं अभ्यास पोर्टल
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {curriculum.overviewSummary}
            </p>
          </div>

          {/* Quick Progress Badge */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0 text-center space-y-1 sm:w-56">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              आपकी अध्ययन प्रगति (Progress)
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {progressPercent}%
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block pt-1">
              नोट्स, वीडियो, होमवर्क व ट्रेसिंग
            </span>
          </div>

        </div>
      </section>

      {/* 3. MAIN NAVIGATION TABS (6 KEY SYSTEMS) */}
      <section className="sticky top-[102px] z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-2.5">
            
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'notes'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>1. परफेक्ट स्टडी नोट्स ({curriculum.curriculumPages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'video'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4 text-red-300" />
              <span>2. वीडियो कक्षाएं (Flow Video)</span>
            </button>

            <button
              onClick={() => setActiveTab('exercise')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'exercise'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-blue-300" />
              <span>3. अभ्यास व टेस्ट ({allTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('homework')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'homework'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-300" />
              <span>4. गृहकार्य (Homework)</span>
            </button>

            <button
              onClick={() => setActiveTab('tracing')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'tracing'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Pencil className="w-4 h-4 text-purple-300" />
              <span>5. अक्षर व ड्राइंग ट्रेसिंग</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'progress'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>6. प्रोग्रेस व सर्टिफिकेट</span>
            </button>

          </div>
        </div>
      </section>

      {/* 4. MAIN CONTENT AREA BASED ON TAB */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        
        {/* ========================================================================= */}
        {/* TAB 1: PERFECT STUDY NOTES (पेज-दर-पेज विस्तृत अध्ययन नोट्स) */}
        {/* ========================================================================= */}
        {activeTab === 'notes' && activePage && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Subject Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 mr-1">विषय:</span>
                <button
                  onClick={() => {
                    setSelectedSubject('all');
                    setCurrentPageIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSubject === 'all'
                      ? 'bg-orange-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  सभी विषय ({curriculum.curriculumPages.length} पेज)
                </button>
                {curriculum.subjectsAvailable.map(sub => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedSubject(sub);
                      setCurrentPageIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedSubject === sub
                        ? 'bg-orange-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Font Size & Speech Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                  <button
                    onClick={() => setFontSizeClass('text-xs')}
                    className={`px-2 py-1 text-xs rounded-lg ${fontSizeClass === 'text-xs' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSizeClass('text-sm')}
                    className={`px-2 py-1 text-xs rounded-lg ${fontSizeClass === 'text-sm' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSizeClass('text-base')}
                    className={`px-2 py-1 text-xs rounded-lg ${fontSizeClass === 'text-base' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    A+
                  </button>
                </div>

                <button
                  onClick={() => toggleSpeech(`${activePage.titleHindi}. ${activePage.conceptOverview.hindi}`)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isSpeaking 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                  title="ऑडियो में सुनें"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-orange-400" />}
                  <span>{isSpeaking ? 'रोकें' : 'बोलकर सुनें'}</span>
                </button>
              </div>
            </div>

            {/* Note Card */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 sm:p-8 space-y-6 shadow-xl">
              
              {/* Note Header & Page Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-orange-600 text-white font-mono">
                      PAGE 0{activePage.pageNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {activePage.subject}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {activePage.gradeOrLevel}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {activePage.titleHindi}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {activePage.titleEnglish}
                  </p>
                </div>

                {/* Page Navigation & Download */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                    title="पिछला पेज"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-300 px-2">
                    {currentPageIndex + 1} / {filteredPages.length}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPageIndex === filteredPages.length - 1}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white"
                    title="अगला पेज"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleDownloadNotes}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700 ml-1"
                    title="इस पेज के नोट्स डाउनलोड करें"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">डाउनलोड</span>
                  </button>
                </div>
              </div>

              {/* Visual Graphic & Concept Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Visual Image */}
                <div className="space-y-2">
                  <div className="aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-md">
                    <img
                      src={activePage.imageUrl}
                      alt={activePage.titleHindi}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-sm p-2 rounded-xl text-[10px] text-slate-300 text-center font-medium">
                      सचित्र व्यावहारिक निरूपण
                    </div>
                  </div>
                </div>

                {/* Concept Hindi & English */}
                <div className="md:col-span-2 space-y-4">
                  
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <h3 className="font-black text-xs text-orange-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>मूल अवधारणा (Core Concept - Hindi):</span>
                    </h3>
                    <p className={`text-slate-200 leading-relaxed font-sans ${fontSizeClass}`}>
                      {activePage.conceptOverview.hindi}
                    </p>
                  </div>

                  <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                    <h3 className="font-black text-xs text-blue-400 uppercase tracking-wide">
                      English Explanation & Context:
                    </h3>
                    <p className={`text-slate-300 leading-relaxed font-sans ${fontSizeClass}`}>
                      {activePage.conceptOverview.english}
                    </p>
                  </div>

                </div>

              </div>

              {/* Key Rules & Facts */}
              <div className="space-y-3 pt-2">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>मुख्य नियम, तथ्य एवं सूत्र (Key Rules & Facts)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePage.keyFactsAndRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-lg bg-orange-600/20 text-orange-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real World Applications Cards */}
              <div className="space-y-3 pt-2">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>दैनिक जीवन के व्यावहारिक उदाहरण (Real-World Examples)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activePage.realWorldExamples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-black text-emerald-400 block">
                          {ex?.title || ''}
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {ex.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                        💡 <strong>उपयोग:</strong> {ex.practicalApplication}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vocabulary / Formula Cards if present */}
              {activePage.vocabularyOrFormulas && activePage.vocabularyOrFormulas.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>महत्वपूर्ण शब्दावली एवं सूत्र (Vocabulary / Formula Bank)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {activePage.vocabularyOrFormulas.map((vf, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1"
                      >
                        <span className="font-black text-xs text-purple-300 block font-mono">
                          {vf.term}
                        </span>
                        <p className="text-[11px] text-slate-300">
                          {vf.definition}
                        </p>
                        <div className="text-[10px] text-emerald-400 font-mono pt-1">
                          उदा: {vf.example}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Pagination */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPageIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>पिछला पेज</span>
                </button>

                <span className="text-xs font-mono font-bold text-slate-400">
                  पेज {activePage.pageNumber} / {filteredPages.length}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPageIndex === filteredPages.length - 1}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center gap-1.5 shadow"
                >
                  <span>अगला पेज</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: VIDEO CLASSES (IOIS आधिकारिक वीडियो कक्षाएं) */}
        {/* ========================================================================= */}
        {activeTab === 'video' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <StudentVideoLessonPlayer
              planId={plan.id}
              planNumber={plan.planNumber}
              planName={plan.name}
              onVideoWatched={() => {
                setVideosWatchedCount(prev => prev + 1);
                localStorage.setItem(`iois_video_watched_${plan.id}`, String(videosWatchedCount + 1));
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EXERCISES & QUIZZES (अभ्यास एवं क्विज़ सिस्टम) */}
        {/* ========================================================================= */}
        {activeTab === 'exercise' && (
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 sm:p-8 space-y-6 animate-in fade-in duration-200 shadow-xl">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white font-mono">
                  PLAN 0{plan.planNumber} • टेस्ट ज़ोन
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  इंटरएक्टिव अभ्यास एवं क्विज़ (Self Assessment)
                </h3>
                <p className="text-xs text-slate-400">
                  प्रश्नों के सही विकल्प चुनें और तत्काल अपने उत्तर की जांच करें
                </p>
              </div>

              {quizSubmitted && (
                <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-2xl flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold">आपका स्कोर</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {correctAnswersCount} / {allTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setUserAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                    title="पुनः टेस्ट दें"
                  >
                    <RotateCcw className="w-4 h-4 text-orange-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {allTasks.map(({ pageNum, task }, qIdx) => {
                const selected = userAnswers[task.id];
                const isCorrect = selected && selected === task.correctAnswer;
                const isWrong = selected && selected !== task.correctAnswer;

                return (
                  <div
                    key={task.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-orange-400 font-mono">
                        प्रश्न {qIdx + 1} (Page {pageNum})
                      </span>
                      {selected && (
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                          isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isCorrect ? '✓ सही उत्तर' : '✗ गलत उत्तर'}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {task.question}
                    </h4>

                    {/* Options if MCQ */}
                    {task.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {task.options.map((opt: string) => {
                          const isOptionSelected = selected === opt;
                          const isThisCorrect = quizSubmitted && opt === task.correctAnswer;

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                if (quizSubmitted) return;
                                setUserAnswers(prev => ({ ...prev, [task.id]: opt }));
                              }}
                              className={`p-3 rounded-xl text-xs sm:text-sm text-left font-medium border transition-all flex items-center justify-between ${
                                isThisCorrect
                                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                                  : isOptionSelected && isWrong && quizSubmitted
                                  ? 'bg-red-950/80 border-red-500 text-red-200'
                                  : isOptionSelected
                                  ? 'bg-orange-600/30 border-orange-500 text-white font-bold ring-1 ring-orange-500'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <span>{opt}</span>
                              {isOptionSelected && <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 ml-2" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanation */}
                    {quizSubmitted && task.explanation && (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                        💡 <strong>व्याख्या:</strong> {task.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Bottom */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                कुल प्रश्न: {allTasks.length} | उत्तर दिए: {Object.keys(userAnswers).length}
              </span>

              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-transform hover:scale-105"
                >
                  उत्तर जांचें व परिणाम देखें (Submit Quiz)
                </button>
              ) : (
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-bold border border-slate-700 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4 text-orange-400" />
                  <span>दोबारा हल करें (Retake)</span>
                </button>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: HOMEWORK SYSTEM (दैनिक गृहकार्य चेकिंग सिस्टम) */}
        {/* ========================================================================= */}
        {activeTab === 'homework' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <StudentHomeworkSystem
              planId={plan.id}
              planNumber={plan.planNumber}
              planName={plan.name}
              onHomeworkCompleted={() => {
                setHomeworkDoneCount(prev => prev + 1);
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TRACING & HANDWRITING CANVAS (अक्षर व चित्र ट्रेसिंग पैड) */}
        {/* ========================================================================= */}
        {activeTab === 'tracing' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <InteractiveTracingPad
              planId={plan.id}
              planNumber={plan.planNumber}
              onTracingCompleted={() => {
                setTracingDone(true);
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: PROGRESS & CERTIFICATE (प्रोग्रेस ट्रैकिंग व डिजिटल सर्टिफिकेट) */}
        {/* ========================================================================= */}
        {activeTab === 'progress' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Scorecard */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 sm:p-8 space-y-6 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    आधिकारिक छात्र रिपोर्ट कार्ड
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {currentUser ? currentUser.name : 'विद्यार्थी'} - {plan.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentUser ? `User ID: ${currentUser.memberId}` : 'पंजीकृत छात्र पोर्टल'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black text-emerald-400 font-mono">
                    {progressPercent}%
                  </span>
                  <span className="text-xs text-slate-400 block">कुल पाठ्यक्रम पूर्ण</span>
                </div>
              </div>

              {/* Progress Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <BookOpen className="w-5 h-5 text-orange-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 font-bold block">स्टडी नोट्स</span>
                  <span className="text-sm font-black text-white font-mono">{notesReadCount}/{curriculum.curriculumPages.length} पेज</span>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <Tv className="w-5 h-5 text-red-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 font-bold block">वीडियो क्लास</span>
                  <span className="text-sm font-black text-white font-mono">{videosWatchedCount > 0 ? '✓ पूर्ण' : 'लंबित'}</span>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <FileCheck2 className="w-5 h-5 text-blue-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 font-bold block">क्विज़ टेस्ट</span>
                  <span className="text-sm font-black text-white font-mono">{correctAnswersCount}/{allTasks.length}</span>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 font-bold block">गृहकार्य (HW)</span>
                  <span className="text-sm font-black text-white font-mono">{homeworkDoneCount > 0 ? '✓ सत्यापित' : '1 कार्य'}</span>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <Pencil className="w-5 h-5 text-purple-400 mx-auto" />
                  <span className="text-[10px] text-slate-400 font-bold block">ट्रेसिंग पैड</span>
                  <span className="text-sm font-black text-white font-mono">{tracingDone ? '✓ पूर्ण' : 'अभ्यास जारी'}</span>
                </div>

              </div>

            </div>

            {/* Official Certificate of Completion Box */}
            <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center space-y-4">
              
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
                  <Award className="w-8 h-8" />
                </div>
              </div>

              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                INDIAN ONLINE INSTITUTION SYSTEM (IOIS)
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                प्रमाण पत्र (Certificate of Educational Completion)
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                यह प्रमाणित किया जाता है कि <strong>{currentUser ? currentUser.name : 'विद्यार्थी'}</strong> ने IOIS 
                के अंतर्गत <strong>PLAN 0{plan.planNumber} ({plan.name})</strong> के सभी मॉड्यूल, वीडियो कक्षाएं, 
                अक्षर ट्रेसिंग एवं गृहकार्य सफलतापूर्वक पूर्ण किए हैं।
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-slate-400">
                <span>दिनांक: {new Date().toLocaleDateString('hi-IN')}</span>
                <span>•</span>
                <span>सत्यापन कोड: IOIS-CERT-{plan.planNumber}-{currentUser ? currentUser.memberId.slice(-4) : '2026'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">✓ अधिकृत एवं सत्यापित</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-xl text-xs sm:text-sm font-black shadow-lg transition-transform hover:scale-105"
                >
                  सर्टिफिकेट प्रिंट / सेव करें (Print Certificate)
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};
