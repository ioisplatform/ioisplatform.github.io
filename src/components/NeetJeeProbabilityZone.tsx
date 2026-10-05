import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Award, 
  Clock, 
  ChevronRight, 
  HelpCircle, 
  RotateCcw,
  ShieldCheck,
  Check,
  Flame,
  BrainCircuit,
  Filter
} from 'lucide-react';
import { NCERT_QUESTIONS_DATA, NCERTQuestionItem } from '../data/ncertLineByLineQuestionsData';
import { soundEffects } from '../utils/soundEffects';

export const NeetJeeProbabilityZone: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | 'all'>(12);
  const [selectedExam, setSelectedExam] = useState<'All' | 'NEET' | 'JEE Mains'>('All');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showTruthCard, setShowTruthCard] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(0);

  // Filter questions for 7th to 12th
  const filteredQuestions = useMemo(() => {
    return NCERT_QUESTIONS_DATA.filter((q) => {
      if (q.classNumber < 7) return false;
      if (selectedClass !== 'all' && q.classNumber !== selectedClass) return false;
      if (selectedExam !== 'All') {
        if (selectedExam === 'NEET' && q.examTarget !== 'NEET' && q.examTarget !== 'All') return false;
        if (selectedExam === 'JEE Mains' && q.examTarget !== 'JEE Mains' && q.examTarget !== 'All') return false;
      }
      return true;
    });
  }, [selectedClass, selectedExam]);

  const handleSelectOption = (questionId: string, optionIdx: number, correctIdx: number) => {
    if (userAnswers[questionId] !== undefined) return; // already answered

    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    setSolvedCount(c => c + 1);

    if (optionIdx === correctIdx) {
      setScore(s => s + 4); // +4 for NEET/JEE marking
      soundEffects.playSuccess();
    } else {
      setScore(s => Math.max(0, s - 1)); // -1 negative marking
      soundEffects.playTryAgain();
    }

    // Auto reveal truth card
    setShowTruthCard(prev => ({ ...prev, [questionId]: true }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowTruthCard({});
    setScore(0);
    setSolvedCount(0);
    soundEffects.playBoing();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: NEET & JEE Mains High-Yield Zone */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 border-2 border-blue-500/40 shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span>कक्षा 7 से 12 • NEET & JEE Mains मोस्ट प्रोबेबिलिटी प्रश्न बैंक</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              NCERT लाइन-दर-लाइन डिकोडर & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">संभावित प्रश्न पत्र</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Google हमेशा शॉर्टकट करता है, पर परीक्षा में NCERT की हर एक पंक्ति से प्रश्न बनते हैं! यहाँ पाएं 95%+ संभावना वाले प्रश्न, NTA ट्रैप अलर्ट, और बिना किसी शॉर्टकट के सम्पूर्ण प्रमाणिक उत्तर।
            </p>
          </div>

          {/* Real-time Scorecard */}
          <div className="flex items-center gap-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-blue-500/30 shadow-xl">
            <div className="text-center px-3 border-r border-slate-700">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">कुल अंक (Marks)</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">+{score}</span>
              <span className="text-[10px] text-slate-400 block">(+4 / -1 Marking)</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">हल किए प्रश्न</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{solvedCount} / {filteredQuestions.length}</span>
              <button
                onClick={handleReset}
                className="mt-1 text-[11px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 mx-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>रीसेट करें</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs: Class (7-12) & Exam Filter */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Class Selector (7 to 12) */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black text-slate-800 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>कक्षा चुनें:</span>
          </span>
          {[
            { val: 'all', label: 'सभी (7-12)' },
            { val: 7, label: '7th' },
            { val: 8, label: '8th' },
            { val: 9, label: '9th' },
            { val: 10, label: '10th' },
            { val: 11, label: '11th' },
            { val: 12, label: '12th' }
          ].map(cls => (
            <button
              key={String(cls.val)}
              onClick={() => setSelectedClass(cls.val as number | 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedClass === cls.val
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cls.label}
            </button>
          ))}
        </div>

        {/* Exam Focus Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-800">लक्ष्य परीक्षा:</span>
          {(['All', 'NEET', 'JEE Mains'] as const).map(exam => (
            <button
              key={exam}
              onClick={() => setSelectedExam(exam)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedExam === exam
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {exam === 'All' ? '⚡ All Targets' : exam === 'NEET' ? '🩺 NEET-UG' : '🚀 JEE Mains'}
            </button>
          ))}
        </div>

      </div>

      {/* QUESTION CARDS LIST */}
      <div className="space-y-6">
        {filteredQuestions.map((q, qIndex) => {
          const isAnswered = userAnswers[q.id] !== undefined;
          const selectedOption = userAnswers[q.id];
          const isCorrect = selectedOption === q.correctIndex;
          const showTruth = showTruthCard[q.id];

          return (
            <div
              key={q.id}
              className="rounded-3xl p-6 sm:p-7 bg-white border-2 border-slate-200 hover:border-blue-400 shadow-lg transition-all space-y-5"
            >
              
              {/* Question Header & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-200">
                    कक्षा {q.classNumber} • {q.subject}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    अध्याय {q.chapterNumber}: {q.chapterTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {q.neetJeeProbability && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 shadow-sm">
                      <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      <span>{q.neetJeeProbability}</span>
                    </span>
                  )}
                  {q.pyqFrequency && (
                    <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      PYQ: {q.pyqFrequency}
                    </span>
                  )}
                </div>
              </div>

              {/* Short & Punchy Question Prompt */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow">
                    Q{qIndex + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {q.shortQuestion}
                  </h3>
                </div>
              </div>

              {/* 4 Multiple Choice Options (Interactive OMR) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt, optIdx) => {
                  let btnStyle = 'bg-slate-50 hover:bg-blue-50 text-slate-800 border-slate-200';
                  let icon = <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">{String.fromCharCode(65 + optIdx)}</span>;

                  if (isAnswered) {
                    if (optIdx === q.correctIndex) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-400';
                      icon = <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />;
                    } else if (optIdx === selectedOption) {
                      btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-400';
                      icon = <XCircle className="w-6 h-6 text-rose-600 shrink-0" />;
                    } else {
                      btnStyle = 'opacity-50 bg-slate-50 border-slate-200 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                      className={`p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 active:scale-98 ${btnStyle}`}
                    >
                      {icon}
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Toggle Truth Button */}
              {isAnswered && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowTruthCard(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                    className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{showTruth ? 'व्याख्या छिपाएं' : 'NCERT लाइन-दर-लाइन सम्पूर्ण प्रमाण देखें ▼'}</span>
                  </button>
                </div>
              )}

              {/* DETAILED NCERT LINE-BY-LINE DECODER CARD */}
              {showTruth && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white space-y-4 border border-blue-500/40 shadow-inner animate-in fade-in duration-200">
                  
                  {/* Status Banner */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> बिल्कुल सही उत्तर (+4 अंक)
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> गलत उत्तर (-1 अंक) • सही विकल्प: {String.fromCharCode(65 + q.correctIndex)}
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-amber-300 font-mono font-bold">
                      {q.ncertBookTitle}
                    </span>
                  </div>

                  {/* 1. Exact NCERT Line Citation */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 space-y-1">
                    <span className="text-[11px] font-black uppercase text-amber-400 block tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> NCERT की वास्तविक पंक्ति (Exact Textbook Line):
                    </span>
                    <p className="text-xs sm:text-sm text-amber-100 font-serif italic leading-relaxed">
                      {q.ncertExactLine}
                    </p>
                  </div>

                  {/* 2. Google Shortcut Trap Alert vs Complete Truth */}
                  {q.googleShortcutTrap && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                      <span className="text-[11px] font-black uppercase text-rose-400 block tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> सावधान: गूगल का शॉर्टकट बनाम NCERT का सम्पूर्ण सत्य:
                      </span>
                      <p className="text-xs text-rose-200 leading-relaxed font-medium">
                        {q.googleShortcutTrap}
                      </p>
                    </div>
                  )}

                  {/* 3. Complete Line Explanation */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wider block">
                      गहन संकल्पनात्मक व्याख्या (Comprehensive Explanation):
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {q.lineExplanation}
                    </p>
                  </div>

                  {/* 4. Super Trick / 30-Sec Hack */}
                  {q.superTrick && (
                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-black text-emerald-300">{q.superTrick}</span>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
