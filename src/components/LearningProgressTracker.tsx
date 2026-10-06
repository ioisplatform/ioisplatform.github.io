import React, { useState, useEffect, useMemo } from 'react';
import { MemberProfile } from '../types';
import { ioisMasterPlans } from '../data/ioisPlansData';
import { 
  ALL_PLAN_LESSONS, 
  DEFAULT_STARTER_COMPLETED_LESSONS, 
  calculateAllPlansProgress, 
  generateProgressVelocityTimeline,
  PlanLessonItem,
  PlanProgressStats
} from '../data/planLessonsData';
import { updateMemberProfile, canUserAccessPlanKit } from '../services/userService';
import { soundEffects } from '../utils/soundEffects';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Circle, 
  Award, 
  Flame, 
  BookOpen, 
  Tv, 
  Check, 
  Clock, 
  Sparkles, 
  RotateCcw, 
  CheckCheck,
  ChevronRight,
  ShieldCheck,
  Lock,
  Layers,
  ArrowUpRight,
  Zap,
  Target,
  FileText
} from 'lucide-react';

interface LearningProgressTrackerProps {
  currentUser: MemberProfile;
  onOpenStudyModal: (planId: string) => void;
  onOpenVideoModal?: () => void;
  onProfileUpdated?: (updated: MemberProfile) => void;
}

export const LearningProgressTracker: React.FC<LearningProgressTrackerProps> = ({
  currentUser,
  onOpenStudyModal,
  onOpenVideoModal,
  onProfileUpdated
}) => {
  // Storage key specific to student
  const storageKey = `iois_learning_progress_${currentUser.rollNumber || currentUser.memberId || currentUser.phone}`;

  // State: completed lessons per plan (Record<planId, string[]>)
  const [completedLessons, setCompletedLessons] = useState<Record<string, string[]>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
      if (currentUser.completedLessons && Object.keys(currentUser.completedLessons).length > 0) {
        return currentUser.completedLessons;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STARTER_COMPLETED_LESSONS;
  });

  // Selected plan for detailed lesson inspection
  const [selectedPlanId, setSelectedPlanId] = useState<string>(currentUser.planId || 'plan-01');

  // Chart view mode: 'line' | 'bar'
  const [chartMode, setChartMode] = useState<'line' | 'bar'>('line');

  // Line chart metric: 'cumulative' | 'daily'
  const [lineChartType, setLineChartType] = useState<'cumulative' | 'daily'>('cumulative');

  // Hovered data point on line chart
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Success celebration notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate statistics
  const progressStats = useMemo(() => {
    return calculateAllPlansProgress(completedLessons);
  }, [completedLessons]);

  // Timeline points for velocity chart
  const timelinePoints = useMemo(() => {
    return generateProgressVelocityTimeline(progressStats.totalCompleted);
  }, [progressStats.totalCompleted]);

  // Save to localStorage and push to profile
  const persistProgress = (newRecord: Record<string, string[]>) => {
    setCompletedLessons(newRecord);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newRecord));
    } catch {
      // ignore storage quota error
    }

    // Also persist into backend user profile
    if (currentUser.memberId) {
      const res = updateMemberProfile({
        memberId: currentUser.memberId,
        completedLessons: newRecord
      });
      if (res.success && res.member && onProfileUpdated) {
        onProfileUpdated(res.member);
      }
    }
  };

  // Toggle single lesson completion
  const handleToggleLesson = (planId: string, lessonId: string) => {
    const currentList = completedLessons[planId] || [];
    const isAlreadyDone = currentList.includes(lessonId);
    let updatedList: string[];

    if (isAlreadyDone) {
      updatedList = currentList.filter(id => id !== lessonId);
      soundEffects.playBoing();
    } else {
      updatedList = [...currentList, lessonId];
      soundEffects.playSuccess();
      
      const lessonObj = ALL_PLAN_LESSONS[planId]?.find(l => l.id === lessonId);
      const planObj = ioisMasterPlans.find(p => p.id === planId);
      showToast(`✓ पाठ पूर्ण: ${lessonObj?.titleHindi || 'अध्याय'} (${planObj?.name || ''})`);
    }

    const newRecord = {
      ...completedLessons,
      [planId]: updatedList
    };

    persistProgress(newRecord);
  };

  // Mark all lessons in a plan as complete
  const handleMarkPlanComplete = (planId: string) => {
    const allLessonIds = (ALL_PLAN_LESSONS[planId] || []).map(l => l.id);
    const newRecord = {
      ...completedLessons,
      [planId]: allLessonIds
    };
    persistProgress(newRecord);
    soundEffects.playCelebration();
    const planObj = ioisMasterPlans.find(p => p.id === planId);
    showToast(`🎉 बधाई! ${planObj?.name || 'पाठ्यक्रम'} के सभी पाठ 100% पूर्ण हुए!`);
  };

  // Reset plan lessons
  const handleResetPlanLessons = (planId: string) => {
    const newRecord = {
      ...completedLessons,
      [planId]: []
    };
    persistProgress(newRecord);
    soundEffects.playBoing();
    showToast(`प्रगति रीसेट की गई।`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Current selected plan metadata & lessons
  const currentPlan = ioisMasterPlans.find(p => p.id === selectedPlanId) || ioisMasterPlans[0];
  const currentPlanLessons = ALL_PLAN_LESSONS[selectedPlanId] || [];
  const currentPlanStats = progressStats.planStats[selectedPlanId] || {
    planId: selectedPlanId,
    planNumber: 1,
    total: currentPlanLessons.length,
    completed: 0,
    percent: 0,
    remaining: currentPlanLessons.length
  };

  // SVG Chart Dimensions
  const chartWidth = 640;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  // Max value for line chart scaling
  const maxMetricValue = useMemo(() => {
    if (lineChartType === 'cumulative') {
      const maxVal = Math.max(...timelinePoints.map(p => Math.max(p.cumulativeCount, p.targetCount)), 10);
      return Math.ceil(maxVal / 5) * 5;
    } else {
      const maxVal = Math.max(...timelinePoints.map(p => p.dailyCount), 5);
      return Math.ceil(maxVal / 2) * 2;
    }
  }, [timelinePoints, lineChartType]);

  // Compute SVG Points
  const chartPoints = useMemo(() => {
    const stepX = innerWidth / (timelinePoints.length - 1);
    return timelinePoints.map((point, i) => {
      const x = paddingX + i * stepX;
      const yValue = lineChartType === 'cumulative' ? point.cumulativeCount : point.dailyCount;
      const y = paddingY + innerHeight - (yValue / maxMetricValue) * innerHeight;
      const targetY = paddingY + innerHeight - (point.targetCount / maxMetricValue) * innerHeight;
      return { x, y, targetY, point };
    });
  }, [timelinePoints, lineChartType, innerWidth, innerHeight, maxMetricValue]);

  // Build SVG Path (Smooth curve)
  const linePathD = useMemo(() => {
    if (chartPoints.length === 0) return '';
    let d = `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    for (let i = 1; i < chartPoints.length; i++) {
      const prev = chartPoints[i - 1];
      const curr = chartPoints[i];
      const midX = (prev.x + curr.x) / 2;
      d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [chartPoints]);

  // Area under line path for gradient fill
  const areaPathD = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const lastX = chartPoints[chartPoints.length - 1].x;
    const firstX = chartPoints[0].x;
    const bottomY = paddingY + innerHeight;
    return `${linePathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePathD, chartPoints, innerHeight]);

  // Target benchmark line path
  const targetPathD = useMemo(() => {
    if (chartPoints.length === 0 || lineChartType !== 'cumulative') return '';
    let d = `M ${chartPoints[0].x} ${chartPoints[0].targetY}`;
    for (let i = 1; i < chartPoints.length; i++) {
      d += ` L ${chartPoints[i].x} ${chartPoints[i].targetY}`;
    }
    return d;
  }, [chartPoints, lineChartType]);

  return (
    <div className="space-y-6">

      {/* TOAST CELEBRATION NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-400 font-bold text-xs sm:text-sm animate-in fade-in slide-in-from-bottom duration-300">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. EXECUTIVE SUMMARY & PROGRESS METRICS */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/80 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-[#1e3a8a] font-bold">IOIS National Digital Education</span>
              <span aria-hidden="true">·</span>
              <span>लाइफटाइम अध्ययन प्रोग्रेस ट्रैकर 2026</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-bold">सक्रिय रोल नं: {currentUser.rollNumber}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              शिक्षण प्रगति एवं पाठ पूर्णता विश्लेषण (Learning Progress)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              आपके सभी 7 अध्ययन पैकेजों के पाठों की प्रगति का वास्तविक डेटा। प्रत्येक पाठ को पूरा करके चेकलिस्ट में मार्क करें और अपना लर्निंग ग्राफ देखें।
            </p>
          </div>

          {/* Overall Progress Dial / Percentage Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-amber-50/40 border border-blue-200 shrink-0 shadow-xs">
            {/* Circular Progress Gauge */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#1e3a8a] transition-all duration-700 ease-out"
                  strokeDasharray={`${progressStats.overallPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-black text-[#1e3a8a]">{progressStats.overallPercent}%</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase">पूर्ण</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>5 दिन एक्टिव स्ट्रीक</span>
              </div>
              <div className="text-xs text-slate-600">
                कुल पूर्ण: <strong className="text-slate-900 font-mono text-sm">{progressStats.totalCompleted}</strong> / {progressStats.totalLessons} पाठ
              </div>
              <div className="text-[11px] font-semibold text-emerald-700">
                {progressStats.overallPercent >= 75 
                  ? '🏆 मास्टर सर्टिफिकेशन योग्य' 
                  : progressStats.overallPercent >= 50 
                    ? '🚀 मध्य पड़ाव पार (50%+)' 
                    : '🌱 निरंतर प्रगति पथ पर'}
              </div>
            </div>

          </div>

        </div>

        {/* 4 Essential Summary Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-200/80">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block mb-0.5">कुल अध्ययन पाठ</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              {progressStats.totalLessons} <span className="text-xs font-sans font-medium text-slate-500">अध्याय</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">7 मास्टर योजनाओं में</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">सफलतापूर्वक पूर्ण</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-900 font-mono">
              {progressStats.totalCompleted} <span className="text-xs font-sans font-medium text-emerald-700">पाठ</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">सत्यापित अध्ययन कार्य</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
            <span className="text-[11px] font-bold text-blue-800 block mb-0.5">सक्रिय नामांकित पैकेज</span>
            <div className="text-xl sm:text-2xl font-black text-blue-900 font-mono">
              Plan 0{currentPlan.planNumber}
            </div>
            <span className="text-[10px] text-blue-700 font-medium truncate block">{currentPlan.name}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 block mb-0.5">शेष पाठ (Pending)</span>
            <div className="text-xl sm:text-2xl font-black text-amber-900 font-mono">
              {progressStats.totalLessons - progressStats.totalCompleted} <span className="text-xs font-sans font-medium text-amber-700">पाठ</span>
            </div>
            <span className="text-[10px] text-amber-700 font-medium">आगामी लक्ष्य हेतु</span>
          </div>

        </div>
      </div>

      {/* 2. DATA VISUALIZATION SECTION: CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: INTERACTIVE VELOCITY & COMPLETION CHART (7 COLS) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border-2 border-slate-200/80 shadow-md space-y-4 flex flex-col justify-between">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#1e3a8a]" />
                <h3 className="font-black text-slate-900 text-base">
                  लर्निंग वेलोसिटी एवं प्रोग्रेस कर्व (Learning Velocity)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                साप्ताहिक प्रगति एवं निर्धारित लक्ष्य गति का तुलनात्मक रेखा चित्र।
              </p>
            </div>

            {/* Chart Mode Controls */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setLineChartType('cumulative')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  lineChartType === 'cumulative'
                    ? 'bg-white text-[#1e3a8a] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                संचयी वक्र (Cumulative)
              </button>
              <button
                type="button"
                onClick={() => setLineChartType('daily')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  lineChartType === 'daily'
                    ? 'bg-white text-[#1e3a8a] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                दैनिक गति (Daily)
              </button>
            </div>
          </div>

          {/* SVG Line / Spline Chart */}
          <div className="relative bg-gradient-to-b from-blue-50/30 via-slate-50/50 to-white rounded-2xl p-2 border border-slate-200/70 overflow-hidden">
            
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 sm:h-64 select-none font-sans"
            >
              <defs>
                <linearGradient id="progressLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingY + innerHeight * (1 - ratio);
                const valueLabel = Math.round(maxMetricValue * ratio);
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray={ratio === 0 ? '0' : '4 4'}
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {valueLabel}
                    </text>
                  </g>
                );
              })}

              {/* Target Benchmark Line (for cumulative mode) */}
              {lineChartType === 'cumulative' && targetPathD && (
                <path
                  d={targetPathD}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
              )}

              {/* Area Under Curve */}
              <path
                d={areaPathD}
                fill="url(#progressLineGrad)"
              />

              {/* Main Line Stroke */}
              <path
                d={linePathD}
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points / Interactive Dots */}
              {chartPoints.map((pt, idx) => {
                const isHovered = hoveredPointIndex === idx;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  >
                    {/* Invisible Hit Area */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="16"
                      fill="transparent"
                    />

                    {/* Outer halo when hovered */}
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="10"
                        fill="#bfdbfe"
                        opacity="0.6"
                      />
                    )}

                    {/* Point Circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? "6" : "4.5"}
                      fill="#ffffff"
                      stroke="#1e3a8a"
                      strokeWidth="3"
                    />

                    {/* X-axis Day Labels */}
                    <text
                      x={pt.x}
                      y={chartHeight - 10}
                      fill={isHovered ? "#1e3a8a" : "#64748b"}
                      fontSize="10"
                      fontWeight={isHovered ? "900" : "600"}
                      textAnchor="middle"
                    >
                      {pt.point.dayShort}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Card */}
            {hoveredPointIndex !== null && chartPoints[hoveredPointIndex] && (
              <div 
                className="absolute z-10 pointer-events-none p-2.5 rounded-xl bg-slate-900 text-white shadow-xl text-xs space-y-1 transform -translate-x-1/2 -translate-y-full border border-slate-700"
                style={{
                  left: `${(chartPoints[hoveredPointIndex].x / chartWidth) * 100}%`,
                  top: `${(chartPoints[hoveredPointIndex].y / chartHeight) * 100}%`,
                  marginTop: '-12px'
                }}
              >
                <div className="font-bold text-amber-400">
                  {chartPoints[hoveredPointIndex].point.dayLabel}
                </div>
                <div className="text-[11px] text-slate-200">
                  {lineChartType === 'cumulative' ? (
                    <>संचयी पाठ: <strong className="text-white font-mono">{chartPoints[hoveredPointIndex].point.cumulativeCount}</strong> / {progressStats.totalLessons}</>
                  ) : (
                    <>दिन के पूर्ण पाठ: <strong className="text-white font-mono">{chartPoints[hoveredPointIndex].point.dailyCount}</strong></>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Chart Legend & Insights */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#1e3a8a]"></span>
                <span className="font-bold text-slate-800">वास्तविक पूर्णता</span>
              </div>
              {lineChartType === 'cumulative' && (
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-500"></span>
                  <span className="text-amber-800 font-medium">अनुशंसित गति (Pace)</span>
                </div>
              )}
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              टिप: किसी भी दिन के बिंदु पर कर्सर ले जाकर आंकड़े देखें।
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: COMPARATIVE PROGRESS BARS PER STUDY PLAN (5 COLS) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border-2 border-slate-200/80 shadow-md space-y-4 flex flex-col justify-between">
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#1e3a8a]" />
                <h3 className="font-black text-slate-900 text-base">
                  पैकेजवार प्रगति बार (Progress by Plan)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                प्रत्येक अध्ययन योजना की वास्तविक पूर्णता दर।
              </p>
            </div>
            
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              7 Plans
            </span>
          </div>

          {/* List of 7 Plans Progress Bars */}
          <div className="space-y-3.5 divide-y divide-slate-100">
            {ioisMasterPlans.map((plan) => {
              const stat = progressStats.planStats[plan.id] || {
                planId: plan.id,
                planNumber: plan.planNumber,
                total: 6,
                completed: 0,
                percent: 0,
                remaining: 6
              };
              const isSelected = selectedPlanId === plan.id;
              const isUserEnrolled = currentUser.planId === plan.id;
              const hasAccess = canUserAccessPlanKit(currentUser, plan.id);

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`pt-3 first:pt-0 cursor-pointer rounded-2xl p-2.5 transition-all ${
                    isSelected 
                      ? 'bg-blue-50/70 border border-blue-200' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-black text-[10px] ${
                        stat.percent === 100 
                          ? 'bg-emerald-600 text-white' 
                          : isSelected 
                            ? 'bg-[#1e3a8a] text-white' 
                            : 'bg-slate-200 text-slate-700'
                      }`}>
                        {plan.planNumber}
                      </span>
                      <strong className={`font-bold ${isSelected ? 'text-[#1e3a8a]' : 'text-slate-900'}`}>
                        {plan.name}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[11px] font-bold text-slate-600">
                        {stat.completed}/{stat.total}
                      </span>
                      <span className={`text-xs font-black ${
                        stat.percent >= 80 ? 'text-emerald-700' : stat.percent >= 40 ? 'text-blue-700' : 'text-slate-600'
                      }`}>
                        {stat.percent}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Segmented Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stat.percent === 100
                          ? 'bg-emerald-500'
                          : plan.planNumber === 1
                            ? 'bg-emerald-600'
                            : plan.planNumber === 2
                              ? 'bg-blue-600'
                              : plan.planNumber === 3
                                ? 'bg-indigo-600'
                                : plan.planNumber === 4
                                  ? 'bg-purple-600'
                                  : plan.planNumber === 5
                                    ? 'bg-cyan-600'
                                    : plan.planNumber === 6
                                      ? 'bg-rose-600'
                                      : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.max(4, stat.percent)}%` }}
                    />
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                    <span>{plan.tagline}</span>
                    <span>
                      {isUserEnrolled ? (
                        <span className="text-emerald-700 font-bold">✓ आपका पैकेज</span>
                      ) : hasAccess ? (
                        <span className="text-blue-700 font-medium">अधिकृत</span>
                      ) : (
                        <span>मास्टर एक्सेस</span>
                      )}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between">
            <span className="font-medium">चयनित पैकेज: <strong>Plan 0{currentPlan.planNumber} ({currentPlan.name})</strong></span>
            <button
              onClick={() => onOpenStudyModal(selectedPlanId)}
              className="text-xs font-bold text-[#1e3a8a] hover:underline flex items-center gap-1"
            >
              <span>किट खोलें</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* 3. INTERACTIVE LESSON CHECKLIST FOR SELECTED PLAN */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200/80 shadow-md space-y-6">
        
        {/* Checklist Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="text-[#1e3a8a]">प्लान 0{currentPlan.planNumber}</span>
              <span aria-hidden="true">·</span>
              <span>{currentPlan.category.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-bold">{currentPlanStats.completed} में से {currentPlanStats.total} पूर्ण</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {currentPlan.name}: विस्तृत पाठ सूची एवं अध्ययन कार्य (Curriculum Lessons)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              प्रत्येक पाठ का अध्ययन पूरा करने के बाद टिक बॉक्स पर क्लिक करें। आपकी प्रगति स्वतः सुरक्षित होगी।
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleMarkPlanComplete(selectedPlanId)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>सभी पूरे करें</span>
            </button>

            <button
              type="button"
              onClick={() => handleResetPlanLessons(selectedPlanId)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
              title="रीसेट करें"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>रीसेट</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenStudyModal(selectedPlanId)}
              className="px-4 py-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>स्टडी किट खोलें</span>
            </button>
          </div>
        </div>

        {/* Plan Switcher Tabs (Functional interactive button controls) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {ioisMasterPlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const stat = progressStats.planStats[plan.id];
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>Plan 0{plan.planNumber}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {stat?.percent || 0}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Lesson Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPlanLessons.map((lesson) => {
            const isCompleted = (completedLessons[selectedPlanId] || []).includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => handleToggleLesson(selectedPlanId, lesson.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                  isCompleted
                    ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                }`}
              >
                {/* Checkbox Icon */}
                <button
                  type="button"
                  aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 text-transparent hover:border-blue-600'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>

                {/* Lesson Info */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      पाठ {lesson.lessonNumber} · {lesson.subject}
                    </span>
                    <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                      isCompleted ? 'text-emerald-700 font-bold' : 'text-slate-500'
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span>{lesson.estimatedMinutes} मिनट</span>
                    </span>
                  </div>

                  <h4 className={`text-sm font-black leading-snug ${
                    isCompleted ? 'text-emerald-950 line-through decoration-emerald-600/50' : 'text-slate-900'
                  }`}>
                    {lesson.titleHindi}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400 font-medium">
                      {lesson.titleEnglish}
                    </span>
                    <span className={`font-bold ${
                      lesson.difficulty === 'बुनियादी' 
                        ? 'text-blue-700' 
                        : lesson.difficulty === 'मध्यम' 
                          ? 'text-amber-700' 
                          : 'text-purple-700'
                    }`}>
                      {lesson.difficulty}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Helper Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              प्रगति का बैकअप आपके डिवाइस व IOIS छात्र प्रोफाइल पर निरंतर स्वतः सिंक होता रहता है।
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenVideoModal && (
              <button
                type="button"
                onClick={onOpenVideoModal}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-800 flex items-center gap-1 shadow-2xs"
              >
                <Tv className="w-3.5 h-3.5 text-blue-600" />
                <span>संबंधित वीडियो क्लास</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenStudyModal(selectedPlanId)}
              className="px-3 py-1.5 rounded-xl bg-[#1e3a8a] text-white hover:bg-blue-900 font-bold flex items-center gap-1 shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>अभ्यास शीट खोलें</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
