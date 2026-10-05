import React, { useState } from 'react';
import { PlanDetail } from '../types';
import { 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  HelpCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Zap, 
  Crown,
  BookOpen,
  FileCheck,
  GraduationCap,
  Shield,
  Briefcase,
  Layers,
  Heart,
  Calendar,
  Users,
  Send,
  Layout,
  Infinity,
  Lock,
  Mail,
  FileText,
  BadgeCheck,
  Compass,
  MessageSquare,
  Tv,
  Pencil,
  FileCheck2
} from 'lucide-react';

interface PlanCardProps {
  plan: PlanDetail;
  onJoinPlan: (plan: PlanDetail) => void;
  onAskAi: (planName: string) => void;
  onOpenStudyWorkPage?: (plan: PlanDetail) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onJoinPlan,
  onAskAi,
  onOpenStudyWorkPage
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getDynamicIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'FileText': return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'BadgeCheck': return <BadgeCheck className="w-4 h-4 text-emerald-600" />;
      case 'FileCheck': return <FileCheck className="w-4 h-4 text-blue-600" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-blue-600" />;
      case 'Mail': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case 'Compass': return <Compass className="w-4 h-4 text-indigo-600" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      case 'Shield': return <Shield className="w-4 h-4 text-rose-600" />;
      case 'Heart': return <Heart className="w-4 h-4 text-rose-600" />;
      case 'Lock': return <Lock className="w-4 h-4 text-rose-600" />;
      case 'Award': return <Award className="w-4 h-4 text-amber-600" />;
      case 'Calendar': return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'Users': return <Users className="w-4 h-4 text-amber-600" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'Send': return <Send className="w-4 h-4 text-purple-600" />;
      case 'Layout': return <Layout className="w-4 h-4 text-purple-600" />;
      case 'Layers': return <Layers className="w-4 h-4 text-orange-600" />;
      case 'Infinity': return <Infinity className="w-4 h-4 text-orange-600" />;
      case 'Crown': return <Crown className="w-4 h-4 text-orange-600" />;
      default: return <Zap className="w-4 h-4 text-orange-600" />;
    }
  };

  const isSupreme = plan.isSupreme;

  const targetGradeMap: Record<number, string> = {
    1: 'कक्षा 1-5 (NCERT Primary Foundation)',
    2: 'कक्षा 6-8 (Middle School + AI)',
    3: 'कक्षा 9-10 (Secondary & Spoken English)',
    4: 'कक्षा 11-12 (Senior & Practical GK)',
    5: '10वीं / 12वीं बोर्ड परीक्षा तैयारी',
    6: 'डिजिटल स्किल्स, टूल्स व कोडिंग',
    7: 'ऑल-इन-वन संपूर्ण 1 से 6 मास्टर किट'
  };

  return (
    <div 
      className={`rounded-3xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isSupreme 
          ? 'bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-white border-2 border-amber-500 shadow-xl shadow-orange-500/10 md:col-span-2 lg:col-span-3' 
          : 'bg-white border border-slate-200 hover:border-orange-300 hover:shadow-xl shadow-sm'
      }`}
    >
      {/* Top Banner Ribbon for Supreme or Popular */}
      {isSupreme ? (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white py-1.5 px-4 text-center text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm">
          <Crown className="w-4 h-4 text-yellow-300 animate-bounce" />
          <span>SUPREME MASTER ALL-IN-ONE • सम्पूर्ण 1 से 6 क्लास व स्किल का मास्टर एक्सेस</span>
          <Crown className="w-4 h-4 text-yellow-300 animate-bounce" />
        </div>
      ) : plan.isPopular ? (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-1 px-3 text-center text-[11px] font-bold tracking-wider uppercase">
          ⭐ सर्वाधिक लोकप्रिय अध्ययन योजना (MOST POPULAR)
        </div>
      ) : null}

      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        
        {/* Header Segment */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black tracking-wide uppercase bg-slate-900 text-white font-mono">
              PLAN 0{plan.planNumber}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase ${
              isSupreme 
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow'
                : `${plan.colorScheme.badgeBg} ${plan.colorScheme.badgeText}`
            }`}>
              {plan.badge}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {plan.name}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
            {plan.subtitle}
          </p>
          <p className="text-xs text-orange-700 font-medium mt-1">
            {plan.tagline}
          </p>

          {/* Student Info Box */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                लक्षित कक्षा व स्तर:
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-blue-900 block mt-0.5">
                {targetGradeMap[plan.planNumber] || 'विद्यार्थी एवं युवा'}
              </span>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                अध्ययन शुल्क:
              </span>
              <span className="text-lg sm:text-xl font-black text-slate-900 font-mono block">
                ₹{plan.price}
              </span>
            </div>
          </div>
        </div>

        {/* Student Feature Quick Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-orange-600" />
            <span>सचित्र नोट्स</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
            <Tv className="w-3 h-3 text-red-600" />
            <span>वीडियो कक्षा</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <FileCheck2 className="w-3 h-3 text-emerald-600" />
            <span>दैनिक होमवर्क</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
            <Pencil className="w-3 h-3 text-purple-600" />
            <span>ट्रेसिंग पैड</span>
          </span>
        </div>

        {/* Core Features Bullet Points */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            पाठ्यक्रम की मुख्य विशेषताएं:
          </span>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {plan.features.slice(0, 4).map((feat, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Detailed Breakdown Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors"
          >
            <span>{showDetails ? 'विस्तृत विषय सूची छुपाएं' : 'देखें: विषय व अध्ययन सामग्री का विवरण'}</span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="mt-3 space-y-4 pt-2 text-xs animate-in fade-in duration-200">
              
              {/* क्या मिलेगा */}
              <div className="space-y-2">
                <span className="font-extrabold text-blue-900 block uppercase tracking-wide">
                  🎁 शामिल विषय व अध्ययन सामग्री:
                </span>
                <div className="space-y-2">
                  {plan.kyaMilega.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                      <div className="p-1 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5">
                        {getDynamicIcon(item.icon)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{item?.title || ''}</span>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* किसे जरूरत है */}
              <div className="space-y-1.5">
                <span className="font-extrabold text-purple-900 block uppercase tracking-wide">
                  🎯 लक्षित विद्यार्थी (Target Audience):
                </span>
                <ul className="space-y-1 text-slate-700">
                  {plan.kiseJaruratHai.map((elig, idx) => (
                    <li key={idx} className="p-2 rounded-xl bg-purple-50/50 border border-purple-100">
                      <span className="font-bold text-purple-950">{elig.target}: </span>
                      <span className="text-slate-600">{elig.why}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          {onOpenStudyWorkPage && (
            <button
              onClick={() => onOpenStudyWorkPage(plan)}
              className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 hover:from-slate-800 hover:to-blue-900 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] shadow-md"
            >
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>👉 संपूर्ण स्टडी हब खोलें (नोट्स • वीडियो • होमवर्क • ट्रेसिंग)</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onJoinPlan(plan)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm ${
                isSupreme 
                  ? 'bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              <span>विद्यार्थी नामांकन</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onAskAi(`${plan.name} के पाठ्यक्रम के बारे में बताएं`)}
              className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI ट्यूटर से पूछें</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
