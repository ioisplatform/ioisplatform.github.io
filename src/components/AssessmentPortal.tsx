import React, { useState } from 'react';
import { ASSESSMENT_QUESTIONS, PLANS } from '../data/plansData';
import { syncInterviewToFirestore } from '../services/userService';
import { 
  CheckCircle2, 
  Brain, 
  Sparkles, 
  Crown, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight,
  Send,
  User,
  Phone,
  Award
} from 'lucide-react';

interface AssessmentPortalProps {
  onAskAI: (query: string) => void;
  onNavigateToRegister?: (planId: number) => void;
}

export const AssessmentPortal: React.FC<AssessmentPortalProps> = ({ onAskAI, onNavigateToRegister }) => {
  const [candidateName, setCandidateName] = useState<string>('');
  const [candidateMobile, setCandidateMobile] = useState<string>('');
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [lastSelectedOption, setLastSelectedOption] = useState<number | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const currentQ = ASSESSMENT_QUESTIONS[currentStep];

  const handleStart = () => {
    setHasStarted(true);
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsCompleted(false);
    setLastSelectedOption(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    setLastSelectedOption(optionIndex);
    const updatedAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentStep + 1 < totalQuestions) {
        setCurrentStep(currentStep + 1);
        setLastSelectedOption(null);
      } else {
        setIsCompleted(true);
        // Automatically send interview report to Telegram
        sendInterviewReport(updatedAnswers);
      }
    }, 320);
  };

  // Calculate recommendation based on answers
  const calculateResult = (answers = selectedAnswers) => {
    let totalScore = 0;
    let highPlanHintCount = 0;

    answers.forEach((ansIdx, qIdx) => {
      const q = ASSESSMENT_QUESTIONS[qIdx];
      if (q && q.options[ansIdx]) {
        totalScore += q.options[ansIdx].score;
        if ((q.options[ansIdx].planHint || 0) >= 6) {
          highPlanHintCount++;
        }
      }
    });

    let recPlan = PLANS[0];
    if (totalScore >= 320 || highPlanHintCount >= 4) {
      recPlan = PLANS[6]; // Plan 07 Master (₹999)
    } else if (totalScore >= 260) {
      recPlan = PLANS[5]; // Plan 06 Agency (₹499)
    } else if (totalScore >= 200) {
      recPlan = PLANS[4]; // Plan 05 Student Elite (₹299)
    } else if (totalScore >= 140) {
      recPlan = PLANS[2]; // Plan 03 Career (₹99)
    } else if (totalScore >= 90) {
      recPlan = PLANS[1]; // Plan 02 Youth Skill (₹49)
    } else {
      recPlan = PLANS[0]; // Plan 01 Bal Vikas (₹10)
    }

    return { recPlan, totalScore };
  };

  const { recPlan: recommendedPlan, totalScore } = calculateResult();
  const progressPercent = Math.round(((currentStep) / totalQuestions) * 100);

  const sendInterviewReport = async (answers: number[]) => {
    try {
      setIsSubmittingReport(true);
      const { recPlan, totalScore } = calculateResult(answers);
      const answerDetails = answers.map((ansIdx, qIdx) => {
        const q = ASSESSMENT_QUESTIONS[qIdx];
        const opt = q?.options[ansIdx];
        return {
          questionId: q?.id || qIdx + 1,
          question: q?.question || '',
          answerText: opt?.text || '',
          score: opt?.score || 0
        };
      });

      const interviewData = {
        id: `int-${Date.now()}`,
        candidateName: candidateName.trim() || 'नया आगंतुक (Guest User)',
        candidateMobile: candidateMobile.trim() || 'उपलब्ध नहीं',
        totalScore,
        recommendedPlanId: recPlan.id,
        recommendedPlanName: `Plan 0${recPlan.id}: ${recPlan.name} (₹${recPlan.price})`,
        answers: answerDetails,
        completedAt: new Date().toISOString()
      };

      // 1. Sync to permanent Firestore database
      await syncInterviewToFirestore(interviewData);

      // 2. Post to server
      await fetch('/api/interview/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interviewData)
      });
    } catch (e) {
      console.warn('Failed to send interview report:', e);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleReset = () => {
    setHasStarted(false);
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsCompleted(false);
    setLastSelectedOption(null);
  };

  return (
    <section id="interview-portal" className="glass-card-premium border-2 border-amber-500/35 p-6 sm:p-10 relative overflow-hidden">
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
          <Brain className="w-3.5 h-3.5 text-amber-400" />
          <span>15-सवाल स्मार्ट कौशल साक्षात्कार (Assessment Interview)</span>
        </div>
        <h2 className="gold-metallic-text text-2xl sm:text-4xl md:text-5xl uppercase tracking-wide">
          Digital Skill & Career Assessment
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          यह 15 प्रश्नों का व्यावहारिक साक्षात्कार आपके लक्ष्य, समय व प्राथमिकताओं का विश्लेषण करके आपको सबसे सटीक डिजिटल दिशा और उपयुक्त प्लान की अनुशंसा करेगा।
        </p>
      </div>

      <div className="max-w-3xl mx-auto min-h-[440px] flex flex-col justify-center">
        {/* State 1: Intro / Not Started */}
        {!hasStarted && !isCompleted && (
          <div id="interview-intro" className="text-center py-6 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/50 flex items-center justify-center shadow-lg">
              <Brain className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-white text-2xl sm:text-3xl font-black">
                आपकी डिजिटल प्राथमिकताओं का सरल विश्लेषण
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                कोई भी कठिन परीक्षा नहीं है। अपनी वास्तविक रुचि और समय के अनुसार प्रत्येक सवाल का सबसे सही विकल्प चुनें।
              </p>
            </div>

            {/* Candidate Details (Optional) */}
            <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">
                  आपका शुभ नाम (Optional):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="उदा. राहुल कुमार"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">
                  मोबाइल नंबर (Optional):
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={candidateMobile}
                    onChange={(e) => setCandidateMobile(e.target.value)}
                    placeholder="उदा. 9876543210"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="start-interview-btn"
                onClick={handleStart}
                className="btn-gold-gradient text-base sm:text-lg px-8 sm:px-10 py-4 shadow-xl cursor-pointer inline-flex items-center gap-2"
              >
                <span>साक्षात्कार शुरू करें (Start Assessment)</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* State 2: Active Questions */}
        {hasStarted && !isCompleted && currentQ && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-amber-400">प्रश्न {currentStep + 1} / {totalQuestions}</span>
                <span className="text-slate-400">{progressPercent}% पूर्ण</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-green-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-amber-500/30 space-y-3">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">
                सवाल {currentStep + 1}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {currentQ.question}
              </h3>
              {currentQ.subtitle && (
                <p className="text-slate-400 text-xs italic">
                  {currentQ.subtitle}
                </p>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isChosen = lastSelectedOption === optIdx;
                return (
                  <button
                    key={optIdx}
                    id={`opt-btn-q${currentStep}-o${optIdx}`}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                      isChosen
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 transform scale-[1.01]'
                        : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/60 hover:bg-slate-800/80 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center font-black text-xs shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm sm:text-base font-bold leading-relaxed">
                        {opt.text}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* State 3: Final Completion & Recommendation */}
        {isCompleted && (
          <div id="final-welcome" className="space-y-8 animate-fadeIn">
            {/* Congratulatory Result Card */}
            <div className="text-center p-8 sm:p-12 bg-slate-900/90 border-2 border-green-500/60 rounded-[36px] shadow-[0_0_80px_rgba(34,197,94,0.15)] space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center text-green-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-green-400 text-2xl sm:text-4xl font-black">
                बधाई हो {candidateName ? candidateName : ''}! आपका साक्षात्कार पूर्ण हुआ!
              </h3>

              <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                आपके 15 प्रश्नों के उत्तरों (अंक: <strong>{totalScore}</strong>) का विश्लेषण करके सिस्टम ने आपके लिए सबसे अनुकूल मार्गदर्शन व प्लान तैयार किया है।
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <span className="bg-slate-950 px-4 py-2 rounded-full border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>ASSESSMENT VERIFIED</span>
                </span>
                <span className="bg-slate-950 px-4 py-2 rounded-full border border-green-500/40 text-green-300 font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                  <span>SCORE: {totalScore} POINTS</span>
                </span>
              </div>
            </div>

            {/* Custom Recommended Plan Showcase */}
            <div className="glass-card-premium border-2 border-amber-500 bg-gradient-to-br from-black via-slate-900 to-black p-6 sm:p-10 text-center space-y-6 relative overflow-hidden">
              <div className="inline-block gold-metallic-text text-xs font-black uppercase tracking-widest">
                YOUR RECOMMENDED PATHWAY
              </div>

              <h4 className="text-3xl sm:text-4xl font-black text-white">
                {recommendedPlan.code}: {recommendedPlan.name}
              </h4>

              <div className="text-4xl sm:text-5xl font-black text-amber-400">
                ₹{recommendedPlan.price}
              </div>

              <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
                {recommendedPlan.description}
              </p>

              {/* Instant Payout Highlight */}
              <div className="p-5 rounded-2xl bg-green-500/10 border-2 border-green-500/40 max-w-md mx-auto space-y-1">
                <span className="text-xs text-green-300 font-bold uppercase block">
                  प्रत्येक रेफरल पर आपका इंसेंटिव (Instant Payout)
                </span>
                <div className="text-3xl font-black text-green-400">
                  ₹{recommendedPlan.instantPayout} ({recommendedPlan.percentage}%)
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {onNavigateToRegister && (
                  <button
                    onClick={() => onNavigateToRegister(recommendedPlan.id)}
                    className="btn-gold-gradient w-full sm:w-auto px-8 py-4 text-sm tracking-wider cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>इस प्लान से तुरंत रजिस्ट्रेशन / Join Now करें</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-4 rounded-full text-xs font-bold text-slate-300 bg-slate-900 border border-slate-700 hover:border-amber-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>पुनः साक्षात्कार दें</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
