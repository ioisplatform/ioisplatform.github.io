import React, { useState } from 'react';
import { PLANS, OFFICIAL_TELEGRAM_URL } from '../data/plansData';
import { Plan, UserProfile } from '../types';
import { IoisExplainerGuideModal } from './IoisExplainerGuideModal';
import { 
  Check, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  BookOpen, 
  Crown, 
  UserPlus, 
  ShieldCheck, 
  Scale, 
  Layers, 
  Award, 
  ChevronRight,
  X,
  SlidersHorizontal,
  TrendingUp,
  Percent,
  Users,
  Lightbulb,
  CheckCircle2,
  FileText,
  Briefcase,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface PlansGridProps {
  currentUser?: UserProfile | null;
  onAskAI: (question: string) => void;
  onSelectPlanForRegister?: (planId: number) => void;
  onOpenSponsorAddMember?: (planId?: number) => void;
}

export const PlansGrid: React.FC<PlansGridProps> = ({
  currentUser,
  onAskAI,
  onSelectPlanForRegister,
  onOpenSponsorAddMember,
}) => {
  const [filter, setFilter] = useState<'all' | 'starter' | 'pro' | 'master'>('all');
  const [isExplainerModalOpen, setIsExplainerModalOpen] = useState<boolean>(false);
  
  // Plan Comparison Feature States
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [comparePlanAId, setComparePlanAId] = useState<number>(1);
  const [comparePlanBId, setComparePlanBId] = useState<number>(7);

  // Selected Plan Modal for Full Deep Dive
  const [selectedPlanDetail, setSelectedPlanDetail] = useState<Plan | null>(null);

  const filteredPlans = PLANS.filter((plan) => {
    if (filter === 'starter') return plan.id <= 2;
    if (filter === 'pro') return plan.id >= 3 && plan.id <= 5;
    if (filter === 'master') return plan.id >= 6;
    return true;
  });

  const planA = PLANS.find((p) => p.id === comparePlanAId) || PLANS[0];
  const planB = PLANS.find((p) => p.id === comparePlanBId) || PLANS[6];

  const handleStartCompare = (planId: number) => {
    setComparePlanAId(planId);
    if (planId === 7) {
      setComparePlanBId(1);
    } else {
      setComparePlanBId(7);
    }
    setShowComparison(true);
    setTimeout(() => {
      document.getElementById('plan-comparison-tool')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="plans" className="space-y-8 sm:space-y-12 w-full">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-4xl mx-auto px-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>स्वदेशी डिजिटल स्वावलंबन नेटवर्क</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="gold-metallic-text text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
            IOIS 7 Dynamic Master Plans
          </h2>

          {/* Prominent "IOIS क्या है? (Full Introduction)" Pop-Up Button */}
          <button
            type="button"
            onClick={() => setIsExplainerModalOpen(true)}
            className="btn-3d-pulse-hover relative inline-flex items-center gap-2.5 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_30px_rgba(245,158,11,0.55)] border-2 border-white/80 transition-all transform hover:scale-105 active:scale-95 cursor-pointer group"
            title="IOIS क्या है? सम्पूर्ण परिचय व गाइड पॉपअप खोलें"
          >
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <BookOpen className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="tracking-wide">IOIS क्या है? (Full Introduction व सम्पूर्ण गाइड)</span>
            <span className="bg-slate-950 text-amber-300 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full ml-1 border border-amber-400/60 shadow-sm shrink-0">
              पॉपअप खोलें ⚡
            </span>
          </button>
        </div>

        <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-3xl mx-auto">
          हर योजना एक नया अवसर है। प्रत्येक प्लान में उच्च-गुणवत्ता वाली डिजिटल सामग्री, प्रमाणित लाभ, लक्षित वर्ग और वास्तविक व्यावहारिक उदाहरण शामिल हैं। अपनी आवश्यकता अनुसार प्लान चुनें और 50% से 70% तक त्वरित पेआउट प्राप्त करें।
        </p>

        {/* Action Controls: Filter Buttons & Plan Comparison Launcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {/* Quick Explainer Pop-up Launcher Button */}
          <button
            type="button"
            onClick={() => setIsExplainerModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 border shadow-sm bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/60 hover:bg-amber-500/30"
            title="IOIS क्या है? पूरा विवरण देखें"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>IOIS सम्पूर्ण परिचय</span>
          </button>

          {[
            { key: 'all', label: 'सभी 7 प्लान (Full Overview)' },
            { key: 'starter', label: 'शुरुआती प्लान (₹10 - ₹49)' },
            { key: 'pro', label: 'करियर व छात्र (₹99 - ₹299)' },
            { key: 'master', label: 'मास्टर प्लान (₹499 - ₹999)' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                filter === item.key
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Dedicated Compare Plans Toggle Button */}
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 border shadow-sm ${
              showComparison
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-300'
                : 'bg-slate-900 text-sky-400 border-sky-500/40 hover:bg-slate-850 hover:text-sky-300'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{showComparison ? 'तुलना टूल छुपाएं' : 'दो प्लान की तुलना करें (Compare)'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE PLAN COMPARISON FEATURE (SIDE-BY-SIDE DIFFERENCE MATRIX)     */}
      {/* ========================================================================= */}
      {showComparison && (
        <div id="plan-comparison-tool" className="p-4 sm:p-7 rounded-3xl bg-slate-900/95 border-2 border-sky-500/50 shadow-2xl backdrop-blur-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                  <span>प्लान तुलना विश्लेषक (Side-by-Side Comparison Tool)</span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold">लाइव अंतर</span>
                </h3>
                <p className="text-xs text-slate-400">
                  किन्हीं दो योजनाओं का चयन करें और उनके फीचर्स, लाभ, लक्षित वर्ग व पेआउट की तुलना करें।
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowComparison(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer self-end sm:self-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Side by Side Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Plan A Column */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">प्लान (A) चुनें:</span>
                <select
                  value={comparePlanAId}
                  onChange={(e) => setComparePlanAId(Number(e.target.value))}
                  className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400"
                >
                  {PLANS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code}: {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <h4 className="text-xl font-black text-white">{planA.name}</h4>
                  <p className="text-xs text-slate-400">{planA.tagline}</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">शुल्क / कीमत</span>
                    <span className="text-2xl font-black text-amber-400">₹{planA.price}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 block font-semibold">सीधा पेआउट ({planA.percentage}%)</span>
                    <span className="text-2xl font-black text-emerald-400">₹{planA.instantPayout}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <span className="text-[11px] font-bold text-amber-300 block">✨ मुख्य फीचर्स (Features):</span>
                  {planA.resources.map((res, i) => (
                    <div key={i} className="flex items-start gap-1.5 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px]">{res}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-sky-400 block font-bold mb-0.5">🎯 लक्षित वर्ग (Target Audience):</strong>
                  {planA.recommendedFor}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-amber-400 block font-bold mb-0.5">💡 व्यावहारिक उदाहरण (Practical Example):</strong>
                  <span className="italic">{planA.storyDescription}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (currentUser && onOpenSponsorAddMember) onOpenSponsorAddMember(planA.id);
                  else onSelectPlanForRegister?.(planA.id);
                }}
                className="w-full py-3 rounded-xl btn-gold-gradient text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {currentUser ? `अपने स्पॉन्सर से जोड़ें (${planA.code} ₹${planA.price})` : `${planA.code} से जुड़ें (₹${planA.price})`}
                </span>
              </button>
            </div>

            {/* Plan B Column */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">प्लान (B) चुनें:</span>
                <select
                  value={comparePlanBId}
                  onChange={(e) => setComparePlanBId(Number(e.target.value))}
                  className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-sky-400"
                >
                  {PLANS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code}: {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <h4 className="text-xl font-black text-white">{planB.name}</h4>
                  <p className="text-xs text-slate-400">{planB.tagline}</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">शुल्क / कीमत</span>
                    <span className="text-2xl font-black text-sky-400">₹{planB.price}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 block font-semibold">सीधा पेआउट ({planB.percentage}%)</span>
                    <span className="text-2xl font-black text-emerald-400">₹{planB.instantPayout}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <span className="text-[11px] font-bold text-sky-300 block">✨ मुख्य फीचर्स (Features):</span>
                  {planB.resources.map((res, i) => (
                    <div key={i} className="flex items-start gap-1.5 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px]">{res}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-sky-400 block font-bold mb-0.5">🎯 लक्षित वर्ग (Target Audience):</strong>
                  {planB.recommendedFor}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-amber-400 block font-bold mb-0.5">💡 व्यावहारिक उदाहरण (Practical Example):</strong>
                  <span className="italic">{planB.storyDescription}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (currentUser && onOpenSponsorAddMember) onOpenSponsorAddMember(planB.id);
                  else onSelectPlanForRegister?.(planB.id);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {currentUser ? `अपने स्पॉन्सर से जोड़ें (${planB.code} ₹${planB.price})` : `${planB.code} से जुड़ें (₹${planB.price})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7 MASTER PLANS GRID (DETAILED BREAKDOWN: FEATURES, BENEFITS, AUDIENCE, EXAMPLES) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full items-stretch">
        {filteredPlans.map((plan) => {
          const isMasterTier = plan.id === 7;

          return (
            <div
              key={plan.id}
              id={`plan-card-${plan.id}`}
              className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 border-2 ${
                isMasterTier 
                  ? 'bg-gradient-to-br from-amber-950/70 via-slate-900 to-black border-amber-400 shadow-[0_0_35px_rgba(212,175,55,0.25)] sm:col-span-2 lg:col-span-3'
                  : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50 hover:shadow-xl'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-wider text-amber-400 uppercase bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      {plan.code}
                    </span>
                    {isMasterTier && (
                      <span className="text-[10px] bg-gradient-to-r from-amber-400 to-yellow-300 text-black px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                        ★ सर्वोच्च लाइफटाइम टियर
                      </span>
                    )}
                  </div>

                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-black">
                    {plan.percentage}% पेआउट (₹{plan.instantPayout})
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5 font-medium">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price & Payout Box */}
                <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 grid grid-cols-2 gap-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">एक्टिवेशन फीस</span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-400">
                      ₹{plan.price}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">एकमुश्त लाइफटाइम</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-emerald-400 block font-semibold uppercase">तुरंत पेआउट</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                      ₹{plan.instantPayout}
                    </span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">प्रति सदस्य ({plan.percentage}%)</span>
                  </div>
                </div>

                {/* 1. FEATURES BREAKDOWN (संसाधन व सामग्री) */}
                <div className="space-y-1.5 bg-slate-950/60 p-3 sm:p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>शामिल फीचर्स व संसाधन (Features):</span>
                  </span>
                  <div className="space-y-1 pt-1">
                    {plan.resources.map((res, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11.5px] leading-snug">{res}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. TARGET AUDIENCE (लक्षित वर्ग) */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <strong className="text-sky-400 flex items-center gap-1.5 font-bold mb-1">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>लक्षित वर्ग (Target Audience):</span>
                  </strong>
                  <span className="text-slate-300 text-[11.5px] leading-relaxed block">
                    {plan.recommendedFor}
                  </span>
                </div>

                {/* 3. PRACTICAL REAL-WORLD EXAMPLE (व्यावहारिक उपयोग का उदाहरण) */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs space-y-1">
                  <strong className="text-amber-400 flex items-center gap-1.5 font-bold">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>व्यावहारिक उदाहरण ({plan.storyTitle}):</span>
                  </strong>
                  <p className="text-slate-300 text-[11.5px] italic leading-relaxed">
                    "{plan.storyDescription}"
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="space-y-2 pt-4 border-t border-slate-800/80 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser && onOpenSponsorAddMember) onOpenSponsorAddMember(plan.id);
                    else onSelectPlanForRegister?.(plan.id);
                  }}
                  className="btn-gold-gradient text-xs w-full py-3 tracking-wider justify-center cursor-pointer shadow-md flex items-center gap-1.5 font-black uppercase transition active:scale-98"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>
                    {currentUser ? `अपने स्पॉन्सर से जोड़ें @ ₹${plan.price}` : `सक्रिय करें / Join Now @ ₹${plan.price}`}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartCompare(plan.id)}
                    className="py-2 rounded-lg text-xs font-bold text-sky-300 hover:text-white bg-slate-950/80 hover:bg-slate-900 border border-sky-500/30 transition flex items-center justify-center gap-1 cursor-pointer"
                    title="दूसरे प्लान से तुलना करें"
                  >
                    <Scale className="w-3.5 h-3.5 text-sky-400" />
                    <span>तुलना करें</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAskAI(`${plan.code} (${plan.name} - ₹${plan.price}) के बारे में विस्तृत विवरण, इसके फीचर्स, लाभ और कमाई की संभावना विस्तार से बताएं।`)}
                    className="py-2 rounded-lg text-xs font-bold text-amber-300 hover:text-amber-200 bg-slate-950/80 hover:bg-slate-900 border border-amber-500/30 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI से पूछें</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dedicated IOIS Full Introduction & Guide Pop-up Modal */}
      <IoisExplainerGuideModal
        isOpen={isExplainerModalOpen}
        onClose={() => setIsExplainerModalOpen(false)}
        currentUser={currentUser}
        onSelectPlanForRegister={(planId) => {
          setIsExplainerModalOpen(false);
          if (currentUser && onOpenSponsorAddMember) onOpenSponsorAddMember(planId);
          else if (onSelectPlanForRegister) onSelectPlanForRegister(planId);
        }}
        onNavigateToPlans={() => {
          setIsExplainerModalOpen(false);
          document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenRegister={() => {
          setIsExplainerModalOpen(false);
          if (currentUser && onOpenSponsorAddMember) onOpenSponsorAddMember(1);
          else if (onSelectPlanForRegister) onSelectPlanForRegister(1);
        }}
        onOpenSponsorAddMember={onOpenSponsorAddMember}
      />
    </section>
  );
};
