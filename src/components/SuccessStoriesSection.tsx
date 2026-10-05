import React from 'react';
import { ioisMasterPlans } from '../data/ioisPlansData';
import { PlanDetail } from '../types';
import { Award, TrendingUp, UserCheck, Crown, ArrowRight } from 'lucide-react';

interface SuccessStoriesSectionProps {
  onJoinPlan: (plan: PlanDetail) => void;
}

export const SuccessStoriesSection: React.FC<SuccessStoriesSectionProps> = ({ onJoinPlan }) => {
  return (
    <section id="stories" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
            सच्ची प्रेरणादायक केस स्टडीज
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            IOIS स्वावलंबन: सफलता की वास्तविक कहानियां
          </h2>
          <p className="text-sm text-slate-600">
            जाने कैसे सामान्य छात्रों, गृहणियों और युवा उद्यमियों ने मात्र ₹10 से ₹999 के प्लान्स से अपनी आर्थिक स्वतंत्रता हासिल की।
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ioisMasterPlans.map((plan) => {
            const isSupreme = plan.isSupreme;
            return (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl flex flex-col justify-between transition-all ${
                  isSupreme
                    ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white border-2 border-amber-400 shadow-lg md:col-span-2 lg:col-span-3'
                    : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-800">
                      PLAN 0{plan.planNumber} • {plan.name}
                    </span>
                    {plan.successStory?.earnings && (
                      <span className="text-xs font-black font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {plan.successStory.earnings}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {plan.successStory?.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{plan.successStory?.story}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isSupreme ? 'bg-amber-600 text-white' : 'bg-slate-800 text-white'
                    }`}>
                      {isSupreme ? <Crown className="w-4 h-4 text-yellow-300" /> : <UserCheck className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {plan.successStory?.person}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        सत्यापित IOIS एक्टिव सदस्य
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onJoinPlan(plan)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
                  >
                    <span>प्लान लें @ ₹{plan.price}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
