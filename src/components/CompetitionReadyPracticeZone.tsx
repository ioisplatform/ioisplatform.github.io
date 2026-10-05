import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Flame, 
  Target, 
  Sparkles, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BookOpen, 
  Zap, 
  Award, 
  Printer, 
  Download, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  Bookmark, 
  Check, 
  Layers, 
  HelpCircle,
  Eye,
  Shuffle,
  ShieldCheck,
  Flag,
  BarChart3
} from 'lucide-react';
import { NCERT_QUESTIONS_DATA, NCERTQuestionItem } from '../data/ncertLineByLineQuestionsData';
import { soundEffects } from '../utils/soundEffects';

interface CompetitionReadyPracticeZoneProps {
  initialClass?: number;
}

interface RandomizedQuestion {
  originalItem: NCERTQuestionItem;
  displayQuestion: string;
  shuffledOptions: string[];
  correctShuffledIndex: number;
}

export const CompetitionReadyPracticeZone: React.FC<CompetitionReadyPracticeZoneProps> = ({
  initialClass = 11
}) => {
  // Config & Generator Filters
  const [selectedTarget, setSelectedTarget] = useState<'All' | 'NEET' | 'JEE Mains'>('All');
  const [classRange, setClassRange] = useState<'all' | '7-8' | '9-10' | '11-12' | 'single'>(
    initialClass <= 8 ? '7-8' : initialClass <= 10 ? '9-10' : '11-12'
  );
  const [singleClass, setSingleClass] = useState<number>(initialClass >= 7 ? initialClass : 11);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [examMode, setExamMode] = useState<'timed' | 'instant'>('timed');

  // Active Test State
  const [testQuestions, setTestQuestions] = useState<RandomizedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedForReview, setFlaggedForReview] = useState<Record<number, boolean>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [testStartTime, setTestStartTime] = useState<number>(Date.now());
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 mins default
  const [testSeed, setTestSeed] = useState<number>(1);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});

  // Filter eligible question bank for Classes 7 to 12
  const eligibleQuestions = useMemo(() => {
    return NCERT_QUESTIONS_DATA.filter((q) => {
      if (q.classNumber < 7) return false;

      // Class range filter
      if (classRange === '7-8' && (q.classNumber < 7 || q.classNumber > 8)) return false;
      if (classRange === '9-10' && (q.classNumber < 9 || q.classNumber > 10)) return false;
      if (classRange === '11-12' && (q.classNumber < 11 || q.classNumber > 12)) return false;
      if (classRange === 'single' && q.classNumber !== singleClass) return false;

      // Exam stream filter
      if (selectedTarget === 'NEET') {
        if (q.subject.includes('गणित') || q.examTarget === 'JEE Mains') {
          return false;
        }
        if (q.examTarget !== 'NEET' && q.examTarget !== 'All' && !q.subject.includes('जीवविज्ञान') && !q.subject.includes('रसायन') && !q.subject.includes('भौतिकी') && !q.subject.includes('विज्ञान')) {
          return false;
        }
      } else if (selectedTarget === 'JEE Mains') {
        if (q.subject.includes('जीवविज्ञान') || q.examTarget === 'NEET') {
          return false;
        }
        if (q.examTarget !== 'JEE Mains' && q.examTarget !== 'All' && !q.subject.includes('गणित') && !q.subject.includes('भौतिकी') && !q.subject.includes('रसायन') && !q.subject.includes('विज्ञान')) {
          return false;
        }
      }

      return true;
    });
  }, [classRange, singleClass, selectedTarget]);

  // Generator: Creates a fresh, randomized question set with shuffled options
  const generateRandomizedTest = () => {
    if (eligibleQuestions.length === 0) return;

    // 1. Shuffle eligible questions
    const shuffledBank = [...eligibleQuestions].sort(() => Math.random() - 0.5);
    const count = Math.min(questionCount, shuffledBank.length);
    const chosenRaw = shuffledBank.slice(0, count);

    // 2. Shuffle options for each question so correct answer isn't predictably 'A'
    const generated: RandomizedQuestion[] = chosenRaw.map((item) => {
      const correctText = item.options[item.correctIndex];
      const indexedOpts = item.options.map((opt, i) => ({ opt, isCorrect: i === item.correctIndex }));
      // Fisher-Yates shuffle
      const shuffled = [...indexedOpts].sort(() => Math.random() - 0.5);
      const newCorrectIdx = shuffled.findIndex((o) => o.isCorrect);

      return {
        originalItem: item,
        displayQuestion: item.shortQuestion,
        shuffledOptions: shuffled.map((o) => o.opt),
        correctShuffledIndex: newCorrectIdx >= 0 ? newCorrectIdx : 0
      };
    });

    setTestQuestions(generated);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedForReview({});
    setIsTestSubmitted(false);
    setRevealedExplanations({});
    setTestStartTime(Date.now());
    setTimeRemaining(count * 60); // 60s per question
    setTimerActive(true);
    setTestSeed(prev => prev + 1);
    soundEffects.playCelebration();
  };

  // Generate on initial mount
  useEffect(() => {
    generateRandomizedTest();
  }, [classRange, singleClass, selectedTarget, questionCount]);

  // Countdown timer effect
  useEffect(() => {
    if (examMode !== 'timed' || isTestSubmitted || !timerActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examMode, isTestSubmitted, timerActive]);

  // Handle option select
  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    if (isTestSubmitted && examMode === 'timed') return;

    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));

    if (examMode === 'instant') {
      const q = testQuestions[qIdx];
      if (optionIdx === q.correctShuffledIndex) {
        soundEffects.playSuccess();
      } else {
        soundEffects.playTryAgain();
      }
      setRevealedExplanations((prev) => ({ ...prev, [qIdx]: true }));
    } else {
      soundEffects.playBoing();
    }
  };

  const handleToggleReview = (qIdx: number) => {
    setFlaggedForReview((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }));
    soundEffects.playBoing();
  };

  const handleSubmitTest = () => {
    setIsTestSubmitted(true);
    setTimerActive(false);
    soundEffects.playCelebration();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Score calculation (+4 for correct, -1 for wrong, 0 for unattempted)
  const scoreStats = useMemo(() => {
    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    testQuestions.forEach((q, idx) => {
      const ans = selectedAnswers[idx];
      if (ans === undefined) {
        unattemptedCount++;
      } else if (ans === q.correctShuffledIndex) {
        correctCount++;
        totalScore += 4;
      } else {
        wrongCount++;
        totalScore -= 1;
      }
    });

    const maxScore = testQuestions.length * 4;
    const attemptedCount = correctCount + wrongCount;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const percentile = maxScore > 0 ? Math.min(99.9, Math.max(10, Math.round(((totalScore + testQuestions.length) / (maxScore + testQuestions.length)) * 100))) : 50;

    return {
      totalScore,
      maxScore,
      correctCount,
      wrongCount,
      unattemptedCount,
      attemptedCount,
      accuracy,
      percentile
    };
  }, [testQuestions, selectedAnswers]);

  // Format timer seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = testQuestions[currentIndex];

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* 1. TOP COMPETITION HEADER BANNER */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-red-950 via-slate-950 to-indigo-950 border-2 border-orange-500/50 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
              <span>कक्षा 7 से 12 • Competition Ready Practice Mode</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>NEET & JEE Mains</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                रैंडमाइज्ड मॉक पेपर जनरेटर
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              हर बार नया व ताजा प्रश्न पत्र! वास्तविक NTA परीक्षा जैसा टाइमर, नेगेटिव मार्किंग (+4 / -1), ऑप्शन शफलिंग और <strong>NCERT लाइन-दर-लाइन सम्पूर्ण प्रमाणिक व्याख्या</strong>।
            </p>
          </div>

          {/* Quick Generator Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={generateRandomizedTest}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-all"
            >
              <Shuffle className="w-4 h-4" />
              <span>नया रैंडम टेस्ट बनाएं</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. GENERATOR CONTROL & FILTER PANEL */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4 text-xs">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Target Exam Filter */}
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-300 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-orange-400" />
              <span>टारगेट परीक्षा:</span>
            </span>
            {(['All', 'NEET', 'JEE Mains'] as const).map((stream) => (
              <button
                key={stream}
                onClick={() => setSelectedTarget(stream)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedTarget === stream
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {stream === 'All' ? '⚡ ऑल-राउंडर (All)' : stream === 'NEET' ? '🩺 NEET-UG' : '🚀 JEE Mains'}
              </button>
            ))}
          </div>

          {/* Question Count Selector */}
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-300">प्रश्नों की संख्या:</span>
            {[5, 10, 15].map((cnt) => (
              <button
                key={cnt}
                onClick={() => setQuestionCount(cnt)}
                className={`px-3 py-1.5 rounded-xl font-black transition-all ${
                  questionCount === cnt
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cnt} प्रश्न {cnt === 5 ? '⚡ स्प्रिंट' : cnt === 10 ? '📝 स्टैंडर्ड' : '🏆 मेगा'}
              </button>
            ))}
          </div>

          {/* Practice Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-300">अभ्यास मोड:</span>
            <button
              onClick={() => setExamMode('timed')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                examMode === 'timed'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>टाइमर मॉक टेस्ट</span>
            </button>
            <button
              onClick={() => setExamMode('instant')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                examMode === 'instant'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>त्वरित उत्तर मोड</span>
            </button>
          </div>

        </div>

        {/* Class Range Bar */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-slate-300 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>कक्षा स्तर (Class Scope):</span>
            </span>
            
            <button
              onClick={() => setClassRange('all')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                classRange === 'all' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              सम्पूर्ण (Class 7-12)
            </button>

            <button
              onClick={() => setClassRange('7-8')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                classRange === '7-8' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              7वीं-8वीं (Foundation & Olympiad)
            </button>

            <button
              onClick={() => setClassRange('9-10')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                classRange === '9-10' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              9वीं-10वीं (Pre-Med & Pre-Eng)
            </button>

            <button
              onClick={() => setClassRange('11-12')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                classRange === '11-12' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              11वीं-12वीं (Target Senior NEET/JEE)
            </button>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 pl-1">कक्षा:</span>
              {[7, 8, 9, 10, 11, 12].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setClassRange('single');
                    setSingleClass(num);
                  }}
                  className={`w-6 h-6 rounded-lg text-[11px] font-black transition-all ${
                    classRange === 'single' && singleClass === num
                      ? 'bg-amber-400 text-slate-950 font-black shadow'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

          </div>

          <span className="text-slate-400 text-[11px]">
            उपलब्ध पूल: <strong className="text-amber-400 font-mono">{eligibleQuestions.length}</strong> उच्च-संभावित प्रश्न
          </span>
        </div>

      </div>

      {/* 3. TEST STATUS BAR: TIMER, LIVE SCORE, QUESTION PALETTE */}
      {testQuestions.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          
          {/* Question Index Indicator */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-200 font-black text-xs">
              प्रश्न {currentIndex + 1} / {testQuestions.length}
            </span>
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
              (NTA Marking: +4 सही, -1 गलत)
            </span>
          </div>

          {/* Real-time Timer or Mode Badge */}
          {examMode === 'timed' && !isTestSubmitted ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 font-mono font-black text-sm shadow">
              <Clock className="w-4 h-4 text-red-400 animate-spin" />
              <span>शेष समय: {formatTime(timeRemaining)}</span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold">
              {isTestSubmitted ? '✓ टेस्ट पूर्ण हुआ' : '⚡ त्वरित अभ्यास मोड'}
            </div>
          )}

          {/* Quick Finish / Submit Button */}
          {!isTestSubmitted && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleReview(currentIndex)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                  flaggedForReview[currentIndex]
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedForReview[currentIndex] ? 'चिह्नित (Flagged)' : 'रिव्यू के लिए मार्क करें'}</span>
              </button>

              <button
                onClick={handleSubmitTest}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs shadow-md active:scale-95 transition-all"
              >
                सबमिट करें & स्कोर देखें
              </button>
            </div>
          )}

        </div>
      )}

      {/* 4. PERFORMANCE REPORT CARD (Rendered after Submission) */}
      {isTestSubmitted && (
        <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border-2 border-emerald-500/50 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase">
                <Award className="w-3.5 h-3.5" />
                <span>NTA मॉक परीक्षा परिणाम (Competition Scorecard)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                आपका कुल स्कोर: <span className="text-amber-400 font-mono text-2xl sm:text-3xl">+{scoreStats.totalScore}</span> / {scoreStats.maxScore}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={generateRandomizedTest}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>नया टेस्ट शुरू करें</span>
              </button>
            </div>
          </div>

          {/* 4 Score Stats Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">सही उत्तर (+4)</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{scoreStats.correctCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">गलत उत्तर (-1)</span>
              <span className="text-2xl font-black text-rose-400 font-mono">{scoreStats.wrongCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">सटीकता दर (Accuracy)</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">{scoreStats.accuracy}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">अनुमानित पर्सेंटाइल</span>
              <span className="text-2xl font-black text-amber-300 font-mono">{scoreStats.percentile} %ile</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 italic">
            नीचे दिए गए प्रत्येक प्रश्न के उत्तर में <strong>NCERT की आधिकारिक लाइन, पृष्ठ संख्या व NTA ट्रैप अलर्ट</strong> की समीक्षा करें।
          </p>

        </div>
      )}

      {/* 5. QUESTION PALETTE STRIP (Interactive Bubble Navigation) */}
      {testQuestions.length > 0 && (
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 pl-1 shrink-0">प्रश्न सूची:</span>
          {testQuestions.map((_, pIdx) => {
            const isAnswered = selectedAnswers[pIdx] !== undefined;
            const isFlagged = flaggedForReview[pIdx];
            const isCurrent = pIdx === currentIndex;

            let bubbleColor = 'bg-slate-800 text-slate-300 border-slate-700';
            if (isTestSubmitted) {
              const isCorrect = selectedAnswers[pIdx] === testQuestions[pIdx].correctShuffledIndex;
              if (selectedAnswers[pIdx] === undefined) {
                bubbleColor = 'bg-slate-800 text-slate-500 border-slate-700';
              } else if (isCorrect) {
                bubbleColor = 'bg-emerald-600 text-white border-emerald-500';
              } else {
                bubbleColor = 'bg-rose-600 text-white border-rose-500';
              }
            } else {
              if (isFlagged) {
                bubbleColor = 'bg-amber-500 text-slate-950 border-amber-400 font-black';
              } else if (isAnswered) {
                bubbleColor = 'bg-blue-600 text-white border-blue-500';
              }
            }

            return (
              <button
                key={pIdx}
                onClick={() => setCurrentIndex(pIdx)}
                className={`w-8 h-8 rounded-xl font-bold text-xs shrink-0 border transition-all flex items-center justify-center ${bubbleColor} ${
                  isCurrent ? 'ring-2 ring-orange-400 scale-110 shadow-lg' : 'hover:scale-105'
                }`}
              >
                {pIdx + 1}
              </button>
            );
          })}
        </div>
      )}

      {/* 6. MAIN QUESTION DISPLAY CARD */}
      {currentQ && (
        <div className="rounded-3xl p-6 sm:p-7 bg-slate-900 border-2 border-slate-700 shadow-xl space-y-5 text-slate-100">
          
          {/* Card Header: Metadata & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/30">
                कक्षा {currentQ.originalItem.classNumber} • {currentQ.originalItem.subject}
              </span>
              <span className="text-xs font-bold text-slate-400">
                अध्याय {currentQ.originalItem.chapterNumber}: {currentQ.originalItem.chapterTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentQ.originalItem.neetJeeProbability && (
                <span className="px-3 py-0.5 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1 shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                  <span>{currentQ.originalItem.neetJeeProbability}</span>
                </span>
              )}
              {currentQ.originalItem.pyqFrequency && (
                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  PYQ: {currentQ.originalItem.pyqFrequency}
                </span>
              )}
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-600 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                Q{currentIndex + 1}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
                {currentQ.displayQuestion}
              </h3>
            </div>
          </div>

          {/* 4 Shuffled Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.shuffledOptions.map((opt, optIdx) => {
              const selectedOpt = selectedAnswers[currentIndex];
              const isSelected = selectedOpt === optIdx;
              const isCorrectAnswer = optIdx === currentQ.correctShuffledIndex;

              let btnStyle = 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800';
              let icon = <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">{String.fromCharCode(65 + optIdx)}</span>;

              if (isTestSubmitted || (examMode === 'instant' && selectedOpt !== undefined)) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/50 shadow-md';
                  icon = <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />;
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold ring-2 ring-rose-500/50 shadow-md';
                  icon = <XCircle className="w-6 h-6 text-rose-400 shrink-0" />;
                } else {
                  btnStyle = 'opacity-40 bg-slate-950 border-slate-800 text-slate-400';
                }
              } else if (isSelected) {
                btnStyle = 'bg-blue-950 border-blue-400 text-white ring-2 ring-blue-400/50 shadow-md';
                icon = <span className="w-6 h-6 rounded-lg bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0">✓</span>;
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentIndex, optIdx)}
                  className={`p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-center gap-3 active:scale-98 ${btnStyle}`}
                >
                  {icon}
                  <span className="flex-1 leading-relaxed font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls (Prev / Next) */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>पिछला प्रश्न</span>
            </button>

            <span className="text-xs text-slate-400 font-bold">
              {currentIndex + 1} / {testQuestions.length}
            </span>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(testQuestions.length - 1, prev + 1))}
              disabled={currentIndex === testQuestions.length - 1}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <span>अगला प्रश्न</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* NCERT Line-by-Line Decoder & Solution Card (Visible in instant mode or after submit) */}
          {(isTestSubmitted || (examMode === 'instant' && selectedAnswers[currentIndex] !== undefined)) && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-orange-500/40 space-y-4 animate-in fade-in duration-200">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-orange-400" />
                  <span>{currentQ.originalItem.ncertBookTitle}</span>
                </span>

                <span className="text-xs font-black">
                  {selectedAnswers[currentIndex] === currentQ.correctShuffledIndex ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> सही उत्तर (+4 अंक)
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> गलत उत्तर (-1 अंक) • सही उत्तर: {String.fromCharCode(65 + currentQ.correctShuffledIndex)}
                    </span>
                  )}
                </span>
              </div>

              {/* Exact NCERT Line Citation */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 space-y-1">
                <span className="text-[11px] font-black uppercase text-amber-400 block tracking-wider">
                  📖 NCERT की वास्तविक पंक्ति (Exact Textbook Line):
                </span>
                <p className="text-xs italic text-amber-100 font-serif leading-relaxed">
                  {currentQ.originalItem.ncertExactLine}
                </p>
              </div>

              {/* Google Shortcut Trap Warning */}
              {currentQ.originalItem.googleShortcutTrap && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                  <span className="text-[11px] font-black uppercase text-rose-400 block tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> गूगल का शॉर्टकट बनाम NCERT का संपूर्ण सच:
                  </span>
                  <p className="text-xs text-rose-200 leading-relaxed font-medium">
                    {currentQ.originalItem.googleShortcutTrap}
                  </p>
                </div>
              )}

              {/* Complete Line Explanation */}
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
                  गहन संकल्पनात्मक व्याख्या (Comprehensive Explanation):
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {currentQ.originalItem.lineExplanation}
                </p>
              </div>

              {/* Super Trick / Formula Shortcut */}
              {currentQ.originalItem.superTrick && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{currentQ.originalItem.superTrick}</span>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};
