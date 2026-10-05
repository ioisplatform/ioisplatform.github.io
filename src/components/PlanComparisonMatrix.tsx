import React, { useState } from 'react';
import { ioisMasterPlans } from '../data/ioisPlansData';
import { PlanDetail } from '../types';
import { Check, Sparkles, ArrowRight, ShieldCheck, BookOpen, Tv, Pencil, FileCheck2 } from 'lucide-react';

interface PlanComparisonMatrixProps {
  onJoinPlan: (plan: PlanDetail) => void;
  onAskAi: (prompt: string) => void;
  onOpenStudyPage: (planId: string) => void;
}

export const PlanComparisonMatrix: React.FC<PlanComparisonMatrixProps> = ({
  onJoinPlan,
  onAskAi,
  onOpenStudyPage
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlans = ioisMasterPlans.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section id="comparison" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            पाठ्यक्रम तुलना तालिका (Curriculum Comparison)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            किस योजना में क्या विषय और अध्ययन सुविधाएं मिलेंगी?
          </h2>
          <p className="text-sm text-slate-600">
            कक्षा 1 से 12 तक के विद्यार्थियों के लिए सभी 7 योजनाओं का पाठ्यक्रम, वीडियो कक्षाएं, और डिजिटल टूल्स का संपूर्ण विश्लेषण।
          </p>

          <div className="pt-2">
            <input
              type="text"
              placeholder="खोजें: NCERT, हिंदी, गणित, कंप्यूटर, English, बोर्ड परीक्षा..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md mx-auto px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Master Comparison Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            
            <thead className="bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5 sm:p-4">योजना का नाम व नंबर</th>
                <th className="p-3.5 sm:p-4">लक्षित कक्षा व स्तर</th>
                <th className="p-3.5 sm:p-4 min-w-[220px]">शामिल विषय व नोट्स</th>
                <th className="p-3.5 sm:p-4 min-w-[200px]">इंटरएक्टिव छात्र सुविधाएं</th>
                <th className="p-3.5 sm:p-4 text-center">स्टडी हब</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredPlans.map((plan) => {
                const isSupreme = plan.isSupreme;
                return (
                  <tr 
                    key={plan.id}
                    className={`transition-colors hover:bg-slate-50 ${
                      isSupreme ? 'bg-amber-50/50 font-semibold' : ''
                    }`}
                  >
                    {/* Plan Name */}
                    <td className="p-3.5 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-100 text-orange-800 font-mono">
                          P0{plan.planNumber}
                        </span>
                        <div>
                          <span className="font-extrabold text-slate-900 block">
                            {plan.name}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {plan.subtitle}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Target Grade */}
                    <td className="p-3.5 sm:p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 inline-block">
                        {plan.planNumber === 1 && 'कक्षा 1-5 (NCERT Primary)'}
                        {plan.planNumber === 2 && 'कक्षा 6-8 (Middle + Computer)'}
                        {plan.planNumber === 3 && 'कक्षा 9-10 (Secondary + English)'}
                        {plan.planNumber === 4 && 'कक्षा 11-12 (Senior + GK)'}
                        {plan.planNumber === 5 && '10वीं / 12वीं बोर्ड परीक्षा'}
                        {plan.planNumber === 6 && 'डिजिटल स्किल्स व कोडिंग'}
                        {plan.planNumber === 7 && 'ऑल-इन-वन संपूर्ण किट'}
                      </span>
                    </td>

                    {/* क्या मिलेगा / विषय */}
                    <td className="p-3.5 sm:p-4">
                      <ul className="space-y-1 text-slate-700 text-xs">
                        {plan.kyaMilega.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                            <span><strong>{item?.title || ''}:</strong> {item?.description || ''}</span>
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* छात्र सुविधाएं */}
                    <td className="p-3.5 sm:p-4">
                      <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                        <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800">📖 सचित्र नोट्स</span>
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-800">🎥 वीडियो कक्षा</span>
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800">🎨 ट्रेसिंग पैड</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">📝 दैनिक होमवर्क</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="p-3.5 sm:p-4 text-center">
                      <button
                        onClick={() => onOpenStudyPage(plan.id)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-black transition-all shadow-sm whitespace-nowrap ${
                          isSupreme 
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white' 
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        स्टडी हब खोलें →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

        {/* Verification Guarantee Footer */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>100% छात्र केंद्रित शिक्षा:</strong> सभी योजनाओं में NCERT आधारित डिजिटल नोट्स, बोलकर सुनने की ऑडियो सुविधा, वीडियो लेक्चर्स, लाइव अक्षर ट्रेसिंग पैड और शिक्षक गृहकार्य चेकिंग सम्मिलित है।
            </span>
          </div>
          <button
            onClick={() => onAskAi('कक्षा और विषय के अनुसार मुझे कौन सा प्लान चुनना चाहिए?')}
            className="text-purple-700 font-bold hover:underline flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            AI ट्यूटर से सलाह लें
          </button>
        </div>

      </div>
    </section>
  );
};
