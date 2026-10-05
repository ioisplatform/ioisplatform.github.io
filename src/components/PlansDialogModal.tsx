import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ArrowRight, 
  BookOpen, 
  Bot, 
  ShieldCheck, 
  Crown, 
  Layers, 
  Download 
} from 'lucide-react';
import { ioisMasterPlans } from '../data/ioisPlansData';

interface PlansDialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanStudy: (planId: string) => void;
  onSelectPlanJoin: (planId: string) => void;
}

export const PlansDialogModal: React.FC<PlansDialogModalProps> = ({
  isOpen,
  onClose,
  onSelectPlanStudy,
  onSelectPlanJoin
}) => {
  const [selectedPlanTab, setSelectedPlanTab] = useState<string>('plan-01');

  if (!isOpen) return null;

  const currentPlan = ioisMasterPlans.find(p => p.id === selectedPlanTab) || ioisMasterPlans[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-slate-200 text-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        
        {/* Tricolor Ribbon on top of Dialog */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white via-blue-800 to-emerald-600" />

        {/* Dialog Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-[#1e3a8a] to-blue-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37] text-slate-950 flex items-center justify-center font-black text-xl shadow">
              📚
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[#f3e5ab] text-[10px] font-black uppercase tracking-wider">
                <Crown className="w-3 h-3 text-[#d4af37]" />
                <span>IOIS 7 मास्टर अध्ययन योजनाएं (Dialog Box)</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                कक्षा 1 से 12 एवं संपूर्ण डिजिटल कौशल कैटलॉग
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7 Plan Tabs Selector Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2 overflow-x-auto shrink-0 text-xs font-bold">
          {ioisMasterPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanTab(plan.id)}
              className={`px-3 py-2 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                selectedPlanTab === plan.id
                  ? 'bg-[#1e3a8a] text-white font-black shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>{plan.id === 'plan-01' ? 'Plan 01 (@ ₹10)' : `Plan 0${plan.planNumber} (₹${plan.price})`}</span>
            </button>
          ))}
        </div>

        {/* Dialog Body Workspace */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-[#f8fafc]">
          
          {/* Main Selected Plan Details Banner */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 font-black text-xs">
                  PLAN 0{currentPlan.planNumber}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {currentPlan.subtitle}
                </span>
              </div>
              <h4 className="text-xl font-black text-[#0f172a]">
                {currentPlan.name}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                {currentPlan.tagline}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center shrink-0 w-full md:w-auto">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">वेरिफिकेशन शुल्क</span>
              <span className="text-2xl font-black text-[#1e3a8a]">
                ₹{currentPlan.price}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                लाइफटाइम एक्सेस
              </span>
            </div>
          </div>

          {/* Core Feature Points */}
          <div className="space-y-2">
            <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              इस अध्ययन योजना में क्या-क्या शामिल है:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentPlan.features.map((feat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Transparency Note */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
            <span>
              यह ₹10 पास स्पैमर्स व बॉट्स को दूर रखकर केवल गंभीर छात्रों को डिजिटल शिक्षा प्रदान करने के लिए अधिकृत है।
            </span>
          </div>

        </div>

        {/* Dialog Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              onSelectPlanStudy(currentPlan.id);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1e3a8a] font-bold text-xs border border-slate-300 flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#1e3a8a]" />
            <span>इस प्लान का स्टडी मटेरियल देखें (Dialog)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectPlanJoin(currentPlan.id);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#d4af37] to-amber-600 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all"
          >
            <span>यह प्लान अनलॉक करें (₹{currentPlan.price})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
