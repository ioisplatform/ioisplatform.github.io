import React, { useState } from 'react';
import { PlanDetail } from '../types';
import { ioisMasterPlans } from '../data/ioisPlansData';
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Tv, 
  Pencil, 
  FileCheck2, 
  ShieldCheck, 
  Crown,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface MembershipPlansSectionProps {
  currentUser?: any;
  onJoinPlan?: (planId: string) => void;
  onSelectPlan?: (plan: any) => void;
  onOpenStudyPage: (planId: string) => void;
  onOpenAiAdvisor?: () => void;
}

export const MembershipPlansSection: React.FC<MembershipPlansSectionProps> = ({
  currentUser,
  onJoinPlan,
  onSelectPlan,
  onOpenStudyPage,
  onOpenAiAdvisor
}) => {
  const [showAllPlans, setShowAllPlans] = useState(false);

  const handleJoin = (planId: string) => {
    if (onJoinPlan) {
      onJoinPlan(planId);
    } else if (onSelectPlan) {
      onSelectPlan({ id: planId });
    }
  };

  // The 3 core featured plans requested specifically by the user
  const corePlans = [
    ioisMasterPlans.find(p => p.id === 'plan-02') || ioisMasterPlans[1], // Youth Skill ₹49
    ioisMasterPlans.find(p => p.id === 'plan-03') || ioisMasterPlans[2], // Career Access ₹99
    ioisMasterPlans.find(p => p.id === 'plan-04') || ioisMasterPlans[3], // Family VIP ₹199
  ];

  const displayedPlans = showAllPlans ? ioisMasterPlans : corePlans;

  return (
    <section id="plans" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-900 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-orange-600" />
            <span>पारदर्शी व किफायती सदस्यता योजनाएं (Student Plans)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            प्लेटफॉर्म के पैकेजेस और प्लांस — <span className="text-orange-600">किफायती व संपूर्ण शिक्षा</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            प्रत्येक छात्र के बजट के अनुसार मात्र ₹10 से ₹199 में संपूर्ण सचित्र नोट्स, वीडियो लेक्चर्स, लाइव ट्रेसिंग पैड व दैनिक गृहकार्य प्रणाली। कोई भी गुप्त शुल्क नहीं!
          </p>

          {/* Toggle between Core 3 Plans & All 7 Plans */}
          <div className="inline-flex p-1 bg-slate-200/80 rounded-2xl text-xs font-bold mt-2">
            <button
              onClick={() => setShowAllPlans(false)}
              className={`px-4 py-2 rounded-xl transition-all ${
                !showAllPlans 
                  ? 'bg-white text-orange-600 shadow-sm font-black' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मुख्य 3 छात्र प्लांस (₹49, ₹99, ₹199)
            </button>
            <button
              onClick={() => setShowAllPlans(true)}
              className={`px-4 py-2 rounded-xl transition-all ${
                showAllPlans 
                  ? 'bg-white text-orange-600 shadow-sm font-black' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              सभी 7 अध्ययन योजनाएं (₹10 से ₹999)
            </button>
          </div>
        </div>

        {/* 3 CLEAN COLUMNS ON DESKTOP / STACK ON MOBILE */}
        <div className={`grid grid-cols-1 ${showAllPlans ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3'} gap-6 sm:gap-8 items-stretch`}>
          {displayedPlans.map((plan) => {
            const isPopular = plan.id === 'plan-03' || plan.isPopular;
            const isSupreme = plan.isSupreme;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-lg ${
                  isPopular
                    ? 'bg-gradient-to-b from-orange-50/70 via-white to-orange-50/40 border-2 border-orange-500 shadow-orange-500/10 ring-4 ring-orange-500/15'
                    : isSupreme
                    ? 'bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 border-2 border-amber-400 shadow-amber-500/10 ring-2 ring-amber-400/20'
                    : 'bg-white border-2 border-slate-200 hover:border-slate-300'
                }`}
              >
                
                {/* Popular Pill Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[11px] font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>⭐ सर्वाधिक लोकप्रिय (Class 9-10)</span>
                  </div>
                )}

                {isSupreme && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 text-[11px] font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-md flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" />
                    <span>👑 ऑल-इन-वन लाइफटाइम</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Header & Target */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white font-mono">
                      PLAN 0{plan.planNumber}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {plan.subtitle}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block font-semibold">शुल्क (One-time)</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900">
                          ₹{plan.price}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">/ पूर्ण कोर्स</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        सत्यापित पास
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-1">आजीवन एक्सेस</span>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-wide block">
                      पैकेज में क्या मिलेगा:
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="pt-6 space-y-2.5">
                  <button
                    onClick={() => handleJoin(plan.id)}
                    className={`w-full py-3.5 px-4 font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      isPopular
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-orange-600/30 hover:scale-105'
                        : isSupreme
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-amber-500/30 hover:scale-105'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Join Now (₹{plan.price})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenStudyPage(plan.id)}
                    className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                    <span>स्टडी सामग्री देखें →</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Help note */}
        <div className="mt-10 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                क्या आप तय नहीं कर पा रहे कि कौन सा प्लान चुनें?
              </h4>
              <p className="text-[11px] text-slate-500">
                हमारे 24x7 AI स्टूडेंट सलाहकार से अपनी कक्षा या विषय बताकर सही प्लान जानें।
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAiAdvisor}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shrink-0 shadow transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI से सलाह लें</span>
          </button>
        </div>

      </div>
    </section>
  );
};
