import React, { useState } from 'react';
import { PLANS } from '../data/plansData';
import { Plan } from '../types';
import { 
  Sparkles, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Wallet, 
  GraduationCap, 
  Users, 
  Award,
  Zap,
  BookOpen,
  UserPlus
} from 'lucide-react';

interface OnboardingExplainerProps {
  onStartAssessment: () => void;
  onAskAI: (question: string) => void;
  onSelectPlan: (plan: Plan) => void;
  onSelectPlanForRegister?: (planId: number) => void;
}

export const OnboardingExplainer: React.FC<OnboardingExplainerProps> = ({
  onStartAssessment,
  onAskAI,
  onSelectPlan,
  onSelectPlanForRegister,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<number>(1);
  const [userQuickQuestion, setUserQuickQuestion] = useState<string>('');

  const activePlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[0];

  const handleQuickQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuickQuestion.trim()) return;
    onAskAI(userQuickQuestion);
    setUserQuickQuestion('');
  };

  return (
    <section id="about-iois" className="space-y-8">
      {/* 1. Core Platform Overview Banner */}
      <div className="glass-card-premium border-2 border-amber-500/40 p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>नए उपयोगकर्ताओं के लिए संपूर्ण गाइड</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            <span className="tiranga-text">IOIS प्लेटफॉर्म</span> क्या है और यह कैसे काम करता है?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed text-justify sm:text-center">
            <strong className="text-amber-400 font-bold">IOIS (Indian Online Income Supporting System)</strong> एक पारदर्शी डिजिटल लर्निंग एवं सपोर्टिंग इकोसिस्टम है। यहाँ छात्रों, युवाओं, अभिभावकों और डिजिटल उद्यमियों के लिए उच्च गुणवत्ता वाली ई-बुक्स, करियर गाइड, AI प्रॉम्ट्स और बिजनेस ऑटोमेशन टूल्स उपलब्ध हैं। जब आप उपयोगी सामग्री दूसरों के साथ साझा करते हैं, तो सिस्टम आपको <strong className="text-green-400 font-bold">50% से 70% तक का सीधा इंस्टेंट पेआउट</strong> प्रदान करता है।
          </p>

          {/* Quick Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-white">1. सीखें और आगे बढ़ें</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                NCERT नोट्स, कोडिंग, AI स्किल्स और बिजनेस टूल्स से खुद को डिजिटल रूप से सशक्त बनाएं।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-white">2. सीधा 70% इंसेंटिव</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                किसी तीसरे पक्ष या देर की झंझट नहीं। प्रति रेफरल ₹7 से लेकर ₹499 तक का त्वरित पेआउट।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-white">3. डिजिटल पहचान (ID Card)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                आधिकारिक डिजिटल मेंबर ID कार्ड, व्यक्तिगत पहचान और सुरक्षित डिजिटल डैशबोर्ड।
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartAssessment}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
            >
              <span>अपने लिए सही प्लान जानें (2-Min टेस्ट)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive 7 Plans Analysis Module */}
      <div className="glass-card-gold p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>7 मास्टर प्लांस का त्वरित विश्लेषण</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              अपनी रुचि या बजट के अनुसार प्लान एक्सप्लोर करें
            </h3>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlanId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  selectedPlanId === p.id
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                Plan 0{p.id} (₹{p.price})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Plan Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase">
                {activePlan.code}
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                {activePlan.name}
              </h4>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {activePlan.description}
            </p>

            {/* Resources list */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                प्लान में शामिल प्रमुख संसाधन:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                {activePlan.resources.map((res, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span>{res}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Instant Payout Card Box */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/30 text-center space-y-6">
            <div>
              <span className="text-xs text-slate-400 uppercase font-black tracking-widest block mb-1">
                एक्टिवेशन शुल्क (One Time)
              </span>
              <div className="text-5xl font-black text-amber-400">
                ₹{activePlan.price}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30">
              <span className="text-[11px] text-green-300 uppercase font-bold block mb-1">
                प्रत्येक सफल रेफरल पर आपको मिलेगा
              </span>
              <div className="text-3xl sm:text-4xl font-black text-green-400">
                ₹{activePlan.instantPayout}
              </div>
              <span className="text-[10px] text-green-200 mt-1 block">
                (तुरंत क्रेडिट - Instant Payout)
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => onSelectPlanForRegister?.(activePlan.id)}
                className="btn-gold-gradient w-full py-3.5 text-sm tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{activePlan.code} इन-ऐप रजिस्टर करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onAskAI(`${activePlan.name} (Plan ${activePlan.id}) के बारे में विस्तार से बताएं और इससे मैं कैसे कमाई शुरू करूँ?`)}
                className="w-full py-2.5 rounded-full text-xs font-bold text-amber-300 bg-slate-950 border border-amber-500/30 hover:border-amber-400 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>इस प्लान के बारे में AI से पूछें</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Direct Ask AI Prompt Section */}
      <div className="glass-card-premium p-6 sm:p-8 border-2 border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>मन में कोई भी सवाल है? सीधे पूछें</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white">
              IOIS AI असिस्टेंट से अपना प्रश्न पूछें
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              प्लान, पेआउट, रजिस्ट्रेशन, करियर सलाह या किसी भी सामान्य ज्ञान के सवाल का तुरंत सटीक व स्पष्ट उत्तर पाएं।
            </p>
          </div>

          <form onSubmit={handleQuickQuestionSubmit} className="w-full md:w-auto flex-1 max-w-md flex items-center gap-2">
            <input
              id="onboarding-quick-ai-input"
              type="text"
              value={userQuickQuestion}
              onChange={(e) => setUserQuickQuestion(e.target.value)}
              placeholder="उदा. प्लान 07 के क्या फायदे हैं? ₹499 कैसे मिलेगा?"
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-full px-4 py-3 text-xs text-white placeholder:text-slate-500 outline-none transition"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-black p-3 rounded-full font-black text-xs transition cursor-pointer flex items-center justify-center shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
