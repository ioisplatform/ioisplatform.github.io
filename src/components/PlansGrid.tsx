import React, { useState } from 'react';
import { PLANS, OFFICIAL_TELEGRAM_URL } from '../data/plansData';
import { Plan } from '../types';
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
  Percent
} from 'lucide-react';

interface PlansGridProps {
  onAskAI: (question: string) => void;
  onSelectPlanForRegister?: (planId: number) => void;
}

export const PlansGrid: React.FC<PlansGridProps> = ({ onAskAI, onSelectPlanForRegister }) => {
  const [filter, setFilter] = useState<'all' | 'starter' | 'pro' | 'master'>('all');
  
  // Plan Comparison Feature States
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [comparePlanAId, setComparePlanAId] = useState<number>(1);
  const [comparePlanBId, setComparePlanBId] = useState<number>(7);

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
    // Auto-select plan 7 as baseline if comparing any other plan, else plan 1
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
      <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto px-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>स्वदेशी डिजिटल स्वावलंबन नेटवर्क</span>
        </div>
        <h2 className="gold-metallic-text text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
          IOIS 7 Dynamic Master Plans
        </h2>
        <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
          हर योजना एक नई संभावना है। अपनी आवश्यकता और लक्ष्य के अनुसार सही प्लान का चयन करें, इन-ऐप सीधे एक्टिवेट करें और डिजिटल कौशल के साथ 50% से 70% तक त्वरित इंसेंटिव प्राप्त करें।
        </p>

        {/* Action Controls: Filter Pills & Plan Comparison Launcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { key: 'all', label: 'सभी 7 प्लान' },
            { key: 'starter', label: 'शुरुआती प्लान (₹10 - ₹49)' },
            { key: 'pro', label: 'करियर व छात्र (₹99 - ₹299)' },
            { key: 'master', label: 'मास्टर प्लान (₹499 - ₹999)' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as any)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
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
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1.5 border shadow-sm ${
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
                  किन्हीं दो योजनाओं का चयन करें और उनके लाभ, इंसेंटिव, डिजिटल किट व रिटर्न की तुलना करें।
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

          {/* Selectors for Plan A and Plan B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-amber-400 block">पहला प्लान चुनें (Plan A):</label>
              <select
                value={comparePlanAId}
                onChange={(e) => setComparePlanAId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-white font-bold rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 cursor-pointer"
              >
                {PLANS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code}: {p.name} (₹{p.price}) • {p.percentage}% पेआउट
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-sky-400 block">दूसरा प्लान चुनें (Plan B):</label>
              <select
                value={comparePlanBId}
                onChange={(e) => setComparePlanBId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-white font-bold rounded-xl px-3 py-2 text-xs outline-none focus:border-sky-400 cursor-pointer"
              >
                {PLANS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code}: {p.name} (₹{p.price}) • {p.percentage}% पेआउट
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Side by Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
            
            {/* PLAN A COLUMN */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border-2 border-amber-500/40 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">{planA.code}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    {planA.percentage}% पेआउट
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-black text-white">{planA.name}</h4>
                  <p className="text-xs text-slate-400">{planA.tagline}</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">लागत / मूल्य</span>
                    <span className="text-2xl font-black text-amber-400">₹{planA.price}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 block font-semibold">सीधा पेआउट / रेफरल</span>
                    <span className="text-2xl font-black text-emerald-400">₹{planA.instantPayout}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <span className="text-[11px] font-bold text-slate-400 block">शामिल डिजिटल सामग्री व किट:</span>
                  {planA.resources.map((res, i) => (
                    <div key={i} className="flex items-start gap-1.5 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px]">{res}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-amber-400 block font-bold mb-0.5">किसके लिए उपयुक्त:</strong>
                  {planA.recommendedFor}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPlanForRegister?.(planA.id)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>{planA.code} से जुड़ें (₹{planA.price})</span>
              </button>
            </div>

            {/* PLAN B COLUMN */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border-2 border-sky-500/40 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-black text-sky-400 uppercase tracking-wider">{planB.code}</span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold">
                    {planB.percentage}% पेआउट
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-black text-white">{planB.name}</h4>
                  <p className="text-xs text-slate-400">{planB.tagline}</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">लागत / मूल्य</span>
                    <span className="text-2xl font-black text-sky-400">₹{planB.price}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 block font-semibold">सीधा पेआउट / रेफरल</span>
                    <span className="text-2xl font-black text-emerald-400">₹{planB.instantPayout}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <span className="text-[11px] font-bold text-slate-400 block">शामिल डिजिटल सामग्री व किट:</span>
                  {planB.resources.map((res, i) => (
                    <div key={i} className="flex items-start gap-1.5 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px]">{res}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-sky-400 block font-bold mb-0.5">किसके लिए उपयुक्त:</strong>
                  {planB.recommendedFor}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPlanForRegister?.(planB.id)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>{planB.code} से जुड़ें (₹{planB.price})</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7 MASTER PLANS GRID (CONSISTENT HEIGHT & OPTIMIZED MOBILE SPACING)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full items-stretch">
        {filteredPlans.map((plan) => {
          const isMasterTier = plan.id === 7;

          // MASTER PLAN 07 - HIGHLIGHTED FULL SPAN
          if (isMasterTier) {
            return (
              <div
                key={plan.id}
                id={`plan-card-${plan.id}`}
                className="col-span-1 sm:col-span-2 lg:col-span-4 rounded-3xl p-4 sm:p-8 md:p-10 bg-gradient-to-br from-amber-950/70 via-slate-900 to-black border-2 border-amber-400 shadow-[0_0_50px_rgba(212,175,55,0.25)] relative overflow-hidden flex flex-col justify-between space-y-6 sm:space-y-8"
              >
                <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-4 sm:space-y-6 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                        <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-black stroke-[2.5]" />
                      </div>
                      <div>
                        <span className="text-amber-400 text-[10px] sm:text-xs font-black tracking-widest uppercase block">
                          SUPREME MASTER ALL-IN-ONE
                        </span>
                        <h3 className="text-xl sm:text-3xl font-black text-white">
                          {plan.code}: {plan.name}
                        </h3>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-black px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-md">
                      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black" />
                      <span>{plan.percentage}% INSTANT PAYOUT (₹{plan.instantPayout}/Referral)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                    <div className="text-4xl sm:text-6xl font-black text-amber-400">
                      ₹{plan.price}
                    </div>
                    <span className="text-slate-400 text-xs sm:text-sm">
                      (आजीवन एकमुश्त निवेश / Lifetime License)
                    </span>
                  </div>

                  <p className="text-slate-200 text-xs sm:text-base leading-relaxed max-w-4xl">
                    {plan.description}
                  </p>

                  {/* Instant Payout Callout */}
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-green-500/15 border-2 border-green-400/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <span className="text-[11px] sm:text-xs text-green-300 font-bold uppercase block">
                        प्रत्येक मास्टर रेफरल पर सीधा इंसेंटिव (Instant Payout)
                      </span>
                      <div className="text-xl sm:text-3xl font-black text-green-400">
                        ₹{plan.instantPayout} प्रति सदस्य ({plan.percentage}%)
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs text-slate-300 font-semibold bg-slate-900/80 px-3 py-1.5 rounded-xl border border-green-500/30">
                      ✓ सभी 6 प्लान्स शामिल
                    </span>
                  </div>

                  {/* Included Resources */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-slate-200 pt-1">
                    {plan.resources.map((res, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 shrink-0" />
                        <span className="text-xs">{res}</span>
                      </div>
                    ))}
                  </div>

                  {/* Success Story */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border-l-4 border-amber-400 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-amber-400 font-bold block mb-1">
                      {plan.storyTitle} ({plan.storyPerson}):
                    </strong>
                    <p className="italic">{plan.storyDescription}</p>
                  </div>
                </div>

                {/* Master Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
                  <button
                    onClick={() => onSelectPlanForRegister?.(plan.id)}
                    className="btn-gold-gradient w-full sm:w-2/3 py-3.5 sm:py-5 text-base sm:text-xl tracking-wider cursor-pointer shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>रजिस्ट्रेशन / Join Now @ ₹{plan.price} (UNLOCK ALL)</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                  </button>

                  <button
                    onClick={() => onAskAI(`मास्टर प्लान 07 (₹999) से मुझे क्या-क्या लाभ मिलेंगे और ₹499 का इंस्टेंट पेआउट कैसे मिलता है?`)}
                    className="w-full sm:w-1/3 py-3 sm:py-4 rounded-full text-xs font-bold text-amber-300 bg-slate-900 border border-amber-500/40 hover:border-amber-400 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>AI से मास्टर प्लान की जानकारी लें</span>
                  </button>
                </div>
              </div>
            );
          }

          // Regular Tier Cards (Plan 01 to Plan 06) with CONSISTENT HEIGHT & OPTIMIZED MOBILE PADDING
          return (
            <div
              key={plan.id}
              id={`plan-card-${plan.id}`}
              className="glass-card-premium border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl h-full space-y-4"
            >
              {/* Card Top Section */}
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* Badge & Code */}
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-black tracking-wider text-amber-400 uppercase">
                      {plan.code}
                    </span>
                    <span className="text-[10px] bg-green-500/20 text-green-300 border border-green-500/40 px-2 py-0.5 rounded-full font-bold">
                      {plan.percentage}% PAYOUT
                    </span>
                  </div>

                  {/* Plan Title & Tagline */}
                  <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price & Payout Box */}
                <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1.5 my-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-400 text-xs">एक्टिवेशन शुल्क:</span>
                    <span className="text-2xl font-black text-amber-400">
                      ₹{plan.price}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-slate-800 pt-1.5">
                    <span className="text-[11px] text-green-300 font-semibold">इंसेंटिव (प्रति रेफरल):</span>
                    <span className="text-base font-black text-green-400 font-mono">
                      ₹{plan.instantPayout}
                    </span>
                  </div>
                </div>

                {/* Mini Features List */}
                <div className="space-y-1.5 text-xs text-slate-300 min-h-[72px]">
                  {plan.resources.slice(0, 3).map((res, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] line-clamp-1">{res}</span>
                    </div>
                  ))}
                </div>

                {/* Story Snippet */}
                <div className="p-2.5 bg-slate-950/70 border border-amber-500/20 rounded-xl text-[10.5px] text-slate-300 italic leading-relaxed min-h-[64px] flex flex-col justify-center">
                  <div>
                    <span className="text-amber-400 font-bold block not-italic text-[10px]">
                      {plan.storyTitle}:
                    </span>
                    <span className="line-clamp-2">{plan.storyDescription}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions (Always Anchored at Bottom) */}
              <div className="space-y-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectPlanForRegister?.(plan.id)}
                  className="btn-gold-gradient text-xs w-full py-2.5 tracking-wider justify-center cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>रजिस्ट्रेशन / Join Now @ ₹{plan.price}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStartCompare(plan.id)}
                    className="py-1.5 rounded-lg text-[10px] font-bold text-sky-300 hover:text-white bg-slate-950/70 hover:bg-slate-900 border border-sky-500/30 transition flex items-center justify-center gap-1 cursor-pointer"
                    title="इस प्लान की दूसरे प्लान से तुलना करें"
                  >
                    <Scale className="w-3 h-3 text-sky-400" />
                    <span>तुलना करें</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAskAI(`${plan.code} (${plan.name} - ₹${plan.price}) के बारे में विस्तृत विवरण और कमाई की संभावना बताएं।`)}
                    className="py-1.5 rounded-lg text-[10px] font-bold text-slate-400 hover:text-amber-300 bg-slate-950/70 hover:bg-slate-900 border border-slate-800 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>AI से पूछें</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
