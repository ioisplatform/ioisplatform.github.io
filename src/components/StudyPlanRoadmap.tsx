import React, { useState, useMemo, useEffect } from 'react';
import { PlanDetail, MemberProfile } from '../types';
import { ALL_PLAN_LESSONS, PlanLessonItem } from '../data/planLessonsData';
import { soundEffects } from '../utils/soundEffects';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Tv, 
  Award, 
  CheckCheck, 
  Search, 
  Filter, 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  Target, 
  RotateCcw,
  Zap,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';

interface StudyPlanRoadmapProps {
  plan: PlanDetail;
  currentUser: MemberProfile | null;
  onNavigateToTopic?: (lesson: PlanLessonItem) => void;
  onOpenVideo?: () => void;
}

export interface RoadmapStage {
  stageNumber: number;
  titleHindi: string;
  titleEnglish: string;
  description: string;
  badge: string;
  lessons: PlanLessonItem[];
}

export const StudyPlanRoadmap: React.FC<StudyPlanRoadmapProps> = ({
  plan,
  currentUser,
  onNavigateToTopic,
  onOpenVideo
}) => {
  // Storage key for keeping track of roadmap completed steps
  const storageKey = `iois_roadmap_progress_${currentUser?.rollNumber || currentUser?.phone || 'guest'}_${plan.id}`;

  // Get lessons for this plan
  const planLessons = ALL_PLAN_LESSONS[plan.id] || ALL_PLAN_LESSONS['plan-01'] || [];

  // Local state for completed steps
  const [completedStepIds, setCompletedStepIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
      // Fallback from currentUser completedLessons if available
      if (currentUser?.completedLessons && currentUser.completedLessons[plan.id]) {
        return currentUser.completedLessons[plan.id];
      }
    } catch {
      // ignore
    }
    // Default starter completion for good UX
    return planLessons.slice(0, 2).map(l => l.id);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [selectedLesson, setSelectedLesson] = useState<PlanLessonItem | null>(planLessons[0] || null);
  const [celebrationToast, setCelebrationToast] = useState<string | null>(null);

  // Group lessons into 3 or 4 progressive stages
  const stages: RoadmapStage[] = useMemo(() => {
    const total = planLessons.length;
    if (total === 0) return [];

    const stageSize = Math.max(2, Math.ceil(total / 3));
    const s1 = planLessons.slice(0, stageSize);
    const s2 = planLessons.slice(stageSize, stageSize * 2);
    const s3 = planLessons.slice(stageSize * 2);

    return [
      {
        stageNumber: 1,
        titleHindi: 'चरण 1: आधारभूत नींव एवं संकल्पनाएं',
        titleEnglish: 'Stage 1: Foundation & Core Fundamentals',
        description: 'मूलभूत सिद्धांतों की समझ, शब्दावली और प्राथमिक अध्ययन टूल्स की तैयारी।',
        badge: 'नींव (Foundation)',
        lessons: s1
      },
      {
        stageNumber: 2,
        titleHindi: 'चरण 2: मुख्य अवधारणाएं एवं विषय ज्ञान',
        titleEnglish: 'Stage 2: Core Subject Concepts & Mastery',
        description: 'गहन अध्ययन, विस्तृत उदाहरण, द्विभाषी नोट्स एवं विषयवार अवधारणाएं।',
        badge: 'मुख्य ज्ञान (Core)',
        lessons: s2
      },
      ...(s3.length > 0 ? [{
        stageNumber: 3,
        titleHindi: 'चरण 3: प्रायोगिक अभ्यास, वर्कशीट्स एवं टेस्ट',
        titleEnglish: 'Stage 3: Practical Lab, Worksheets & Exam Sprint',
        description: 'वास्तविक जीवन में अनुप्रयोग, दैनिक अभ्यास प्रश्न, गति ट्रिक्स एवं प्रमाणन।',
        badge: 'मास्टरी (Mastery)',
        lessons: s3
      }] : [])
    ];
  }, [planLessons]);

  // Statistics
  const totalLessons = planLessons.length;
  const completedCount = completedStepIds.filter(id => planLessons.some(l => l.id === id)).length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const remainingCount = Math.max(0, totalLessons - completedCount);
  const totalMinutesRemaining = planLessons
    .filter(l => !completedStepIds.includes(l.id))
    .reduce((acc, curr) => acc + (curr.estimatedMinutes || 20), 0);

  // Toggle step completion
  const handleToggleStep = (lessonId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isDone = completedStepIds.includes(lessonId);
    let updated: string[];

    if (isDone) {
      updated = completedStepIds.filter(id => id !== lessonId);
    } else {
      updated = [...completedStepIds, lessonId];
      // Audio cue & feedback
      soundEffects.playSuccess();
      const currentLesson = planLessons.find(l => l.id === lessonId);
      setCelebrationToast(`शाबाश! आपने "${currentLesson?.titleHindi || 'विषय'}" सफलतापूर्वक पूर्ण किया! 🎉`);
      setTimeout(() => setCelebrationToast(null), 3500);
    }

    setCompletedStepIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Mark all completed
  const handleMarkAllComplete = () => {
    const allIds = planLessons.map(l => l.id);
    setCompletedStepIds(allIds);
    try {
      localStorage.setItem(storageKey, JSON.stringify(allIds));
    } catch {
      // ignore
    }
    soundEffects.playCelebration();
    setCelebrationToast('अद्भुत! आपने पूरे रोडमैप के सभी चरण पूर्ण कर लिए हैं! 🏆');
    setTimeout(() => setCelebrationToast(null), 4000);
  };

  // Reset roadmap progress
  const handleResetProgress = () => {
    if (window.confirm('क्या आप इस रोडमैप की प्रगति को रीसेट करना चाहते हैं?')) {
      setCompletedStepIds([]);
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
      setCelebrationToast('रोडमैप प्रगति रीसेट कर दी गई है।');
      setTimeout(() => setCelebrationToast(null), 2500);
    }
  };

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    return planLessons.filter(lesson => {
      const matchesSearch = 
        lesson.titleHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isDone = completedStepIds.includes(lesson.id);
      const matchesStatus = 
        filterStatus === 'all' ? true :
        filterStatus === 'completed' ? isDone : !isDone;

      return matchesSearch && matchesStatus;
    });
  }, [planLessons, searchQuery, filterStatus, completedStepIds]);

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Toast Notification */}
      {celebrationToast && (
        <div className="sticky top-2 z-30 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 border border-emerald-400">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>{celebrationToast}</span>
          </div>
          <button onClick={() => setCelebrationToast(null)} className="text-white hover:text-amber-200 font-black">✕</button>
        </div>
      )}

      {/* ROADMAP HERO PROGRESS BANNER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border-2 border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                🗺️ इंटरैक्टिव लर्निंग रोडमैप (Step-by-Step Path)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PLAN 0{plan.planNumber} • {plan.name}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              विषयवार अध्ययन पथ एवं चरणबद्ध प्रगति ट्रैकर
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              प्रत्येक चरण को क्रमबद्ध रूप से पूरा करें। किसी भी विषय पर क्लिक करके सीधे डिजिटल रीडर में अध्ययन करें या अपनी प्रगति दर्ज करें।
            </p>
          </div>

          {/* Real-time Percentage & Circular Progress Gauge */}
          <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-indigo-500/20 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-700 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-sm font-black text-white">{percentage}%</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{completedCount} / {totalLessons} चरण पूर्ण</span>
              </div>
              <div className="text-[11px] text-slate-400">
                शेष समय: ~{totalMinutesRemaining} मिनट
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={handleMarkAllComplete}
                  className="px-2 py-0.5 rounded-md bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition-colors"
                >
                  सब पूर्ण करें
                </button>
                <button
                  onClick={handleResetProgress}
                  className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="रीसेट करें"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Global Progress Line Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 transition-all duration-700 rounded-full"
              style={{ width: `${Math.max(4, percentage)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
            <span>आरंभ: चरण 01 (शुरुआती बिंदु)</span>
            <span className="font-bold text-amber-300">
              {percentage === 100 ? '🎉 संपूर्ण पाठ्यक्रम पूरा!' : `${remainingCount} चरण शेष`}
            </span>
            <span>अंतिम लक्ष्य: 100% निपुणता</span>
          </div>
        </div>

      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="विषय या टॉपिक का नाम खोजें..."
            className="w-full bg-transparent text-white placeholder-slate-500 outline-none font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">✕</button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden sm:inline">स्थिति:</span>
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                filterStatus === 'all' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              सभी ({planLessons.length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                filterStatus === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              पूर्ण ({completedCount})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                filterStatus === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              शेष ({remainingCount})
            </button>
          </div>
        </div>
      </div>

      {/* ROADMAP STAGES & TOPICS TIMELINE */}
      <div className="space-y-8 relative">
        
        {stages.map((stage, stageIdx) => {
          const stageLessons = stage.lessons.filter(l => 
            filteredLessons.some(fl => fl.id === l.id)
          );

          if (stageLessons.length === 0 && (searchQuery || filterStatus !== 'all')) {
            return null;
          }

          const stageCompleted = stage.lessons.filter(l => completedStepIds.includes(l.id)).length;
          const stagePercent = stage.lessons.length > 0 
            ? Math.round((stageCompleted / stage.lessons.length) * 100) 
            : 0;

          return (
            <div key={stage.stageNumber} className="relative space-y-4">
              
              {/* STAGE MILESTONE HEADER CARD */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base shadow-inner ${
                    stagePercent === 100 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white'
                  }`}>
                    {stagePercent === 100 ? '✓' : `0${stage.stageNumber}`}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                        {stage.badge}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                        {stageCompleted} / {stage.lessons.length} पूर्ण
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm sm:text-base text-white">
                      {stage.titleHindi}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-28 sm:w-36 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${stagePercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300 w-9 text-right font-mono">
                    {stagePercent}%
                  </span>
                </div>
              </div>

              {/* TIMELINE STEPS LIST */}
              <div className="space-y-3 relative pl-6 sm:pl-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-orange-500 before:via-indigo-500 before:to-emerald-500">
                
                {stageLessons.map((lesson, idx) => {
                  const isDone = completedStepIds.includes(lesson.id);
                  const isSelected = selectedLesson?.id === lesson.id;

                  return (
                    <div 
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`relative p-4 rounded-2xl transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-slate-800/95 border-orange-500 shadow-lg scale-[1.01]' 
                          : isDone
                            ? 'bg-slate-900/80 border-emerald-500/30 hover:border-emerald-500/60'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      
                      {/* Timeline Node Icon Indicator */}
                      <div 
                        onClick={(e) => handleToggleStep(lesson.id, e)}
                        className={`absolute -left-[30px] sm:-left-[38px] top-4.5 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                          isDone 
                            ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20' 
                            : 'bg-slate-800 text-slate-400 hover:text-white border-2 border-slate-600 hover:border-orange-500'
                        }`}
                        title={isDone ? 'पूर्ण (क्लिक कर अनमार्क करें)' : 'मार्क करें पूर्ण'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 fill-slate-950 text-emerald-400" />
                        ) : (
                          <span className="text-[10px] font-black">{lesson.lessonNumber}</span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold border border-slate-700">
                              स्टेप #{lesson.lessonNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                              {lesson.subject}
                            </span>
                            <span className="text-slate-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{lesson.estimatedMinutes} मिनट</span>
                            </span>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                              lesson.difficulty === 'उन्नत' 
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : lesson.difficulty === 'मध्यम'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {lesson.difficulty}
                            </span>
                            {isDone && (
                              <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px] border border-emerald-500/30 flex items-center gap-1">
                                <CheckCheck className="w-3 h-3" />
                                <span>अध्ययन पूर्ण</span>
                              </span>
                            )}
                          </div>

                          <h5 className={`font-extrabold text-sm sm:text-base leading-snug ${
                            isDone ? 'text-slate-200 line-through decoration-emerald-500/60 decoration-2' : 'text-white'
                          }`}>
                            {lesson.titleHindi}
                          </h5>

                          <p className="text-xs text-slate-400 line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>

                        {/* Action buttons on card */}
                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onNavigateToTopic) onNavigateToTopic(lesson);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>पढ़ें</span>
                          </button>

                          <button
                            onClick={(e) => handleToggleStep(lesson.id, e)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                              isDone
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                            }`}
                          >
                            {isDone ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Circle className="w-3.5 h-3.5" />}
                            <span>{isDone ? 'पूर्ण' : 'मार्क करें'}</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>
          );
        })}

      </div>

      {/* SELECTED LESSON QUICK DETAIL MODAL / DRAWER */}
      {selectedLesson && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-orange-400 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-orange-400" />
              <span>सक्रिय टॉपिक विवरण: स्टेप #{selectedLesson.lessonNumber}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              अवधि: ~{selectedLesson.estimatedMinutes} मिनट
            </span>
          </div>

          <h4 className="text-base font-black text-white">
            {selectedLesson.titleHindi}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedLesson.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                if (onNavigateToTopic) onNavigateToTopic(selectedLesson);
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <BookOpen className="w-4 h-4" />
              <span>डिजिटल रीडर में अध्याय खोलें →</span>
            </button>

            {onOpenVideo && (
              <button
                onClick={onOpenVideo}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                <Tv className="w-4 h-4 text-red-400" />
                <span>संबंधित वीडियो क्लास देखें</span>
              </button>
            )}

            <button
              onClick={() => handleToggleStep(selectedLesson.id)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 ${
                completedStepIds.includes(selectedLesson.id)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 border border-emerald-500/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completedStepIds.includes(selectedLesson.id) ? 'पूर्ण (Uncheck)' : 'इस चरण को पूर्ण चिह्नित करें'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
