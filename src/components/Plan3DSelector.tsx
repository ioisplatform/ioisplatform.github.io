import React from 'react';
import { PLANS } from '../data/plansData';
import { 
  Crown, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  Zap, 
  Briefcase, 
  Award, 
  Check, 
  Percent,
  CheckCircle2
} from 'lucide-react';

interface Plan3DSelectorProps {
  selectedPlanId: number;
  onSelectPlan: (planId: number) => void;
  compact?: boolean;
}

const PLAN_THEMES: Record<number, {
  color: string;
  gradient: string;
  bgActive: string;
  borderActive: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  textColor: string;
  priceClass: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}> = {
  1: {
    color: '#f97316',
    gradient: 'from-amber-600 via-orange-500 to-amber-700',
    bgActive: 'bg-gradient-to-br from-orange-950/90 via-slate-950 to-amber-950/80',
    borderActive: 'border-orange-400 ring-2 ring-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.35)]',
    iconBg: 'radial-gradient(circle at 35% 30%, #fff 0%, #fed7aa 40%, #f97316 75%, #9a3412 100%)',
    iconColor: 'text-amber-950',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    textColor: 'text-orange-400',
    priceClass: 'text-orange-300',
    icon: GraduationCap,
    tag: 'एंट्री पास',
  },
  2: {
    color: '#38bdf8',
    gradient: 'from-sky-500 via-cyan-500 to-blue-600',
    bgActive: 'bg-gradient-to-br from-sky-950/90 via-slate-950 to-cyan-950/80',
    borderActive: 'border-sky-400 ring-2 ring-sky-500/50 shadow-[0_0_20px_rgba(56,189,248,0.35)]',
    iconBg: 'radial-gradient(circle at 35% 30%, #fff 0%, #bae6fd 40%, #38bdf8 75%, #0369a1 100%)',
    iconColor: 'text-sky-950',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    textColor: 'text-sky-400',
    priceClass: 'text-sky-300',
    icon: Zap,
    tag: 'युवा स्किल',
  },
  3: {
    color: '#818cf8',
    gradient: 'from-indigo-500 via-blue-500 to-indigo-700',
    bgActive: 'bg-gradient-to-br from-indigo-950/90 via-slate-950 to-blue-950/80',
    borderActive: 'border-indigo-400 ring-2 ring-indigo-500/50 shadow-[0_0_20px_rgba(129,140,248,0.35)]',
    iconBg: 'radial-gradient(circle at 35% 30%, #fff 0%, #c7d2fe 40%, #818cf8 75%, #3730a3 100%)',
    iconColor: 'text-indigo-950',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    textColor: 'text-indigo-400',
    priceClass: 'text-indigo-300',
    icon: Sparkles,
    tag: 'जॉब व करियर',
  },
  4: {
    color: '#34d399',
    gradient: 'from-emerald-500 via-green-500 to-teal-700',
    bgActive: 'bg-gradient-to-br from-emerald-950/90 via-slate-950 to-teal-950/80',
    borderActive: 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-[0_0_20px_rgba(52,211,153,0.35)]',
    iconBg: 'radial-gradient(circle at 35% 30%, #fff 0%, #a7f3d0 40%, #34d399 75%, #065f46 100%)',
    iconColor: 'text-emerald-950',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    textColor: 'text-emerald-400',
    priceClass: 'text-emerald-300',
    icon: ShieldCheck,
    tag: 'फैमिली VIP',
  },
  5: {
    color: '#c084fc',
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-700',
    bgActive: 'bg-gradient-to-br from-purple-950/90 via-slate-950 to-violet-950/80',
    borderActive: 'border-purple-400 ring-2 ring-purple-500/50 shadow-[0_0_20px_rgba(192,132,252,0.35)]',
    iconBg: 'radial-gradient(circle at 35% 30%, #fff 0%, #e9d5ff 40%, #c084fc 75%, #6b21a8 100%)',
    iconColor: 'text-purple-950',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    textColor: 'text-purple-400',
    priceClass: 'text-purple-300',
    icon: Award,
    tag: 'एलीट नोट्स',
  },
  6: {
    color: '#fbbf24',
    gradient: 'from-amber-500 via-yellow-500 to-amber-700',
    bgActive: 'bg-gradient-to-br from-amber-950/90 via-slate-950 to-yellow-950/80',
    borderActive: 'border-amber-400 ring-2 ring-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.35)]',
    iconBg: 'radial-gradient(circle at 35% 30%, #fff 0%, #fef08a 40%, #fbbf24 75%, #854d0e 100%)',
    iconColor: 'text-amber-950',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    textColor: 'text-amber-400',
    priceClass: 'text-amber-300',
    icon: Briefcase,
    tag: 'एजेंसी हब',
  },
  7: {
    color: '#f43f5e',
    gradient: 'from-rose-500 via-amber-400 via-emerald-400 to-indigo-500',
    bgActive: 'bg-gradient-to-br from-amber-950/90 via-slate-950 to-rose-950/80',
    borderActive: 'border-amber-400 ring-2 ring-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.5)]',
    iconBg: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #fef08a 35%, #eab308 70%, #854d0e 100%)',
    iconColor: 'text-slate-950',
    badgeBg: 'bg-gradient-to-r from-amber-500/25 to-rose-500/25 text-amber-300 border-amber-400/50',
    textColor: 'text-amber-300',
    priceClass: 'text-amber-300',
    icon: Crown,
    tag: '👑 सुप्रीम मास्टर',
  },
};

export const Plan3DSelector: React.FC<Plan3DSelectorProps> = ({
  selectedPlanId,
  onSelectPlan,
  compact = false,
}) => {
  return (
    <div className="space-y-3 w-full">
      {/* Header Label with 3D Status */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg logo-3d-box flex items-center justify-center shrink-0">
            <Crown className="w-3 h-3 text-slate-950" />
          </div>
          <span className="font-black text-white uppercase tracking-wider text-[11px] sm:text-xs">
            IOIS 7 मास्टर प्लान्स (3D चयन करें):
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
          50% से 70% इंस्टेंट पेआउट
        </span>
      </div>

      {/* Grid of 3D Cards - Responsive Screen Fitting for All Devices */}
      <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-7' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-1.5 sm:gap-2.5 w-full`}>
        {PLANS.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const theme = PLAN_THEMES[plan.id] || PLAN_THEMES[1];
          const IconComponent = theme.icon;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan.id)}
              className={`card-3d-plan text-left p-2 sm:p-2.5 md:p-3 rounded-2xl border transition-all duration-150 relative flex flex-col justify-between group min-w-0 ${
                plan.id === 7 ? 'col-span-2 sm:col-span-1' : ''
              } ${
                isSelected
                  ? `${theme.bgActive} ${theme.borderActive}`
                  : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
              style={{
                boxShadow: isSelected 
                  ? `0 4px 0 ${theme.color}33, 0 8px 20px rgba(0,0,0,0.6)` 
                  : '0 2px 0 rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.3)',
              }}
            >
              {/* Top Row: 3D Logo Icon & Selected Checkmark */}
              <div className="flex items-start justify-between gap-1 mb-1.5 min-w-0 w-full">
                <div 
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105 group-active:scale-95"
                  style={{
                    background: theme.iconBg,
                    border: '1.5px solid rgba(255,255,255,0.9)',
                    borderBottom: `2.5px solid ${theme.color}`,
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.9), 0 2px 5px rgba(0,0,0,0.35)',
                  }}
                >
                  <IconComponent className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme.iconColor} drop-shadow`} />
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  {isSelected ? (
                    <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md shrink-0">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className={`text-[7.5px] sm:text-[8.5px] font-black uppercase px-1 sm:px-1.5 py-0.5 rounded-md border shrink-0 ${theme.badgeBg}`}>
                      {theme.tag}
                    </span>
                  )}
                </div>
              </div>

              {/* Middle: 3D Plan Name with Embossed Styling */}
              <div className="space-y-0.5 min-w-0 my-0.5 w-full">
                <div className="flex items-center gap-1">
                  <span className={`text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider ${theme.textColor}`}>
                    {plan.code}
                  </span>
                  {plan.id === 7 && (
                    <span className="hidden xs:inline text-[7.5px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold sm:hidden">
                      VIP
                    </span>
                  )}
                </div>
                <h4 className="text-[11px] sm:text-xs font-black text-white truncate leading-tight group-hover:text-amber-200 transition">
                  {plan.name}
                </h4>
              </div>

              {/* Bottom: 3D Tactile Price & Payout Pill */}
              <div className="mt-2 pt-1.5 sm:pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 min-w-0 w-full">
                <div className="flex items-baseline gap-0.5 font-mono shrink-0">
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold">₹</span>
                  <span className={`text-sm sm:text-base font-black leading-none ${theme.priceClass}`}>
                    {plan.price}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[8px] sm:text-[9px] font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1 sm:px-1.5 py-0.5 rounded block whitespace-nowrap">
                    {plan.percentage}% Payout
                  </span>
                </div>
              </div>

              {/* Active Selection Bottom Accent Light */}
              {isSelected && (
                <div 
                  className="absolute bottom-0 left-3 right-3 h-1 rounded-t-full bg-gradient-to-r"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Plan Summary Banner */}
      {(() => {
        const cur = PLANS.find((p) => p.id === selectedPlanId) || PLANS[0];
        const theme = PLAN_THEMES[cur.id] || PLAN_THEMES[1];
        return (
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/90 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">चयनित सदस्यता: </span>
                <strong className="text-white">{cur.code}: {cur.name}</strong>
                <span className="text-amber-400 font-mono font-bold ml-1.5">(₹{cur.price})</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-[11px] font-black text-emerald-400">
                प्रत्येक रेफरल पर ₹{cur.instantPayout} ({cur.percentage}%) तुरंत
              </span>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
