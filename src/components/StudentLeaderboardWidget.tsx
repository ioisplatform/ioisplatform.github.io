import React from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  GraduationCap, 
  ShieldCheck, 
  Tv, 
  Pencil, 
  FileCheck2,
  PhoneCall,
  Clock
} from 'lucide-react';
import { MemberProfile } from '../types';

interface StudentLeaderboardWidgetProps {
  currentUser?: MemberProfile | null;
  onOpenStudyPage?: (planId: string) => void;
  onJoinPlan?: (planId: string) => void;
}

export const StudentLeaderboardWidget: React.FC<StudentLeaderboardWidgetProps> = ({
  currentUser,
  onOpenStudyPage,
  onJoinPlan
}) => {
  const academicFeatures = [
    {
      title: 'NCERT पाठ्यक्रम पूर्ण कवरेज',
      desc: 'कक्षा 1 से 12 तक के गणित, विज्ञान, हिंदी, सामाजिक विज्ञान व अंग्रेजी के सभी अध्याय हल व सचित्र नोट्स।',
      icon: <BookOpen className="w-5 h-5 text-blue-700" />,
      badge: 'CBSE / State Boards'
    },
    {
      title: 'IOIS दृश्य वीडियो लेक्चर्स',
      desc: 'कठिन विषयों को सरलता से समझने के लिए 3D व एनिमेशन आधारित संवादात्मक वीडियो पाठ।',
      icon: <Tv className="w-5 h-5 text-red-600" />,
      badge: 'Visual Learning'
    },
    {
      title: 'डिजिटल ट्रेसिंग व हस्तलेखन अभ्यास',
      desc: 'अक्षर, संख्या व वैज्ञानिक डायग्राम्स को स्क्रीन पर पेंसिल चलाकर बार-बार अभ्यास करने की आधुनिक तकनीक।',
      icon: <Pencil className="w-5 h-5 text-purple-600" />,
      badge: 'Interactive Tracing'
    },
    {
      title: 'दैनिक गृहकार्य व तुरंत मूल्यांकन',
      desc: 'प्रत्येक पाठ के बाद वस्तुनिष्ठ अभ्यास प्रश्न और उनका तुरंत समाधान व व्याख्यात्मक उत्तर।',
      icon: <FileCheck2 className="w-5 h-5 text-emerald-600" />,
      badge: 'Daily Assessment'
    }
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: ACADEMIC STANDARDS & PILLARS (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-[#1e3a8a] text-xs font-black uppercase flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-[#1e3a8a]" />
                <span>शैक्षणिक उत्कृष्टता मानक (Academic Learning Standards)</span>
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              कक्षा 1 से 12 तक के विद्यार्थियों के लिए प्रामाणिक डिजिटल शिक्षा
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              IOIS पोर्टल केवल वास्तविक NCERT अध्ययन सामग्री, इंटरएक्टिव वीडियो कक्षाएं और डिजिटल गृहकार्य जांच प्रणाली प्रदान करता है ताकि प्रत्येक छात्र अपनी कक्षा में श्रेष्ठ प्रदर्शन कर सके:
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {academicFeatures.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-50 text-[#1e3a8a] border border-blue-200">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: OFFICIAL STUDENT SUPPORT & VERIFICATION (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-950 text-white border-2 border-blue-500/30 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% प्रामाणिक व सुरक्षित</span>
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold">हेल्पलाइन: 8877490845</span>
              </div>

              <div>
                <h4 className="text-lg font-black text-white">
                  आधिकारिक छात्र सहायता एवं सत्यापन केंद्र
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  सभी विद्यार्थियों का पंजीकरण, शुल्क सत्यापन और रोल नंबर आवंटन सीधे आधिकारिक डेटाबेस द्वारा नियंत्रित होता है। किसी भी सहायता के लिए संपर्क करें:
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>व्हाट्सएप व कॉल: <strong>+91 8877490845</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>कार्य समय: प्रातः 09:00 AM से सायं 07:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>सत्यापित पहचान पत्र (ID Card) व रोल नंबर तुरंत उपलब्ध</span>
                </div>
              </div>

              {currentUser ? (
                <button
                  onClick={() => onOpenStudyPage && onOpenStudyPage(currentUser.planId || 'plan-01')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-[#d4af37] to-amber-600 hover:brightness-105 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102"
                >
                  <BookOpen className="w-4 h-4 text-slate-950" />
                  <span>अपना अध्ययन हब खोलें ({currentUser.name})</span>
                </button>
              ) : (
                <button
                  onClick={() => onJoinPlan && onJoinPlan('plan-01')}
                  className="w-full py-3 px-4 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>विद्यार्थी पंजीकरण फॉर्म खोलें (@ ₹10)</span>
                </button>
              )}

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>डिजिटल इंडिया एवं NCERT पाठ्यचर्या आधारित अधिकृत पोर्टल</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
