import React, { useState } from 'react';
import { ioisMasterPlans } from '../data/ioisPlansData';
import { Calculator, TrendingUp, Sparkles, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

export const IncomeCalculator: React.FC<{ onJoinPlan: (planId: string) => void }> = ({ onJoinPlan }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-07');
  const [referralCount, setReferralCount] = useState<number>(20);

  const currentPlan = ioisMasterPlans.find(p => p.id === selectedPlanId) || ioisMasterPlans[6];

  const totalEarnings = referralCount * currentPlan.incentive;
  const netProfit = totalEarnings - currentPlan.price;
  const roi = Math.round((netProfit / currentPlan.price) * 100);

  const quickCounts = [5, 10, 20, 50, 100, 200];

  return (
    <section id="calculator" className="py-12 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            पारदर्शी वित्तीय अनुमान
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            IOIS इंसेंटिव व आमदनी कैलकुलेटर
          </h2>
          <p className="text-sm text-slate-300">
            देखें कि अपनी पसंद का प्लान चुनने और अपने दोस्तों को डिजिटल स्वावलंबन से जोड़ने पर आपकी कितनी कमाई होगी।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Controls */}
          <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-6">
            
            {/* Step 1: Select Plan */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                1. अपना प्लान चुनें:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ioisMasterPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPlanId === plan.id
                        ? 'bg-orange-600 border-orange-400 text-white shadow-lg'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-[10px] font-mono block opacity-80">P0{plan.planNumber}</span>
                    <span className="text-xs font-bold block truncate">{plan.name}</span>
                    <span className="text-xs font-extrabold text-amber-300 block">₹{plan.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Referrals Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  2. सम्भावित रेफरल संख्या:
                </label>
                <span className="text-lg font-black text-orange-400 font-mono">
                  {referralCount} सदस्य
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="250"
                value={referralCount}
                onChange={(e) => setReferralCount(parseInt(e.target.value) || 1)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                {quickCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => setReferralCount(count)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                      referralCount === count
                        ? 'bg-orange-500 text-white border-orange-400'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {count} सदस्य
                  </button>
                ))}
              </div>
            </div>

            {/* Rate Explanation */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">{currentPlan.name} (Plan 0{currentPlan.planNumber})</span>
                <p className="text-slate-400 mt-0.5">प्रति रेफरल इंसेंटिव: ₹{currentPlan.incentive} ({currentPlan.payoutPercent}%)</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {currentPlan.payoutPercent}% पेआउट
              </span>
            </div>

          </div>

          {/* Right Result Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-orange-500/50 rounded-2xl p-6 shadow-2xl relative">
            
            <div className="text-center pb-6 border-b border-slate-700">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                कुल अनुमानित इंसेंटिव आमदनी
              </span>
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 font-mono mt-1">
                ₹{totalEarnings.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-emerald-400 font-semibold block mt-1">
                ✓ 100% सीधा बैंक / UPI ट्रांसफर
              </span>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-300">
                <span>प्लान एक्टिवेशन लागत:</span>
                <span className="font-mono font-bold text-white">₹{currentPlan.price}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>रेफरल संख्या:</span>
                <span className="font-mono font-bold text-orange-400">{referralCount} साथी</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>प्रति रेफरल कमाई:</span>
                <span className="font-mono font-bold text-emerald-400">₹{currentPlan.incentive}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700 text-sm font-bold text-white">
                <span>शुद्ध बचत व लाभ (Net Profit):</span>
                <span className="font-mono text-emerald-400 font-extrabold">₹{netProfit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>रिटर्न ऑन इन्वेस्टमेंट (ROI):</span>
                <span className="font-mono text-amber-400 font-bold">+{roi}%</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onJoinPlan(currentPlan.id)}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02]"
              >
                <span>यह प्लान एक्टिवेट करें @ ₹{currentPlan.price}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
