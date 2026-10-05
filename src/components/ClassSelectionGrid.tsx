import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Pencil, 
  Tv, 
  Bot, 
  Award, 
  CheckCircle2, 
  GraduationCap, 
  Zap,
  Briefcase
} from 'lucide-react';

interface ClassSelectionGridProps {
  onOpenStudyPage: (planId: string) => void;
  onOpenAiTeacher: (initialPrompt?: string) => void;
  onScrollToPlans: () => void;
}

export const ClassSelectionGrid: React.FC<ClassSelectionGridProps> = ({
  onOpenStudyPage,
  onOpenAiTeacher,
  onScrollToPlans
}) => {
  return (
    <section id="class-grid" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>स्मार्ट स्टूडेंट डैशबोर्ड • अपनी कक्षा चुनें</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            अपनी कक्षा या कोर्स चुनें और <span className="text-orange-600">तुरंत पढ़ाई शुरू करें</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600">
            मोबाइल पर अंगूठे से सिर्फ 1-क्लिक करें — आपकी कक्षा के अनुसार सचित्र नोट्स, वीडियो कक्षाएं, डिजिटल ट्रेसिंग और गृहकार्य तुरंत उपलब्ध होंगे।
          </p>
        </div>

        {/* 4 COLORFUL TOUCH-FRIENDLY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          
          {/* CARD 1: 🧒 नर्सरी से कक्षा 6 (Funny Questions & Colorful Drawing Pad) */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-b from-amber-50 via-rose-50/60 to-white border-2 border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            
            <div className="space-y-3.5">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
                  फाउंडेशन (Class 1-6)
                </span>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🎨
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-rose-700 transition-colors">
                  कक्षा 1 से 6: फनी प्रश्न व ड्राइंग
                </h3>
                <p className="text-xs font-bold text-rose-600 mt-0.5">
                  Kids Fun Learning & Drawing Pad
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                चिंटू बंदर और गप्पू खरगोश की मजेदार पहेलियां, चटकदार रंगीन कार्ड्स और उंगली से स्क्रीन पर रंग भरने का ड्राइंग पैड। (कोई बोरिंग ब्लैक-एंड-व्हाइट नहीं!)
              </p>

              <ul className="space-y-1.5 text-xs text-slate-700 pt-1 font-semibold">
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-600">✓</span>
                  <span><strong>रंगीन ड्राइंग पैड:</strong> 12 चटक रंग व कार्टून आउटलाइन्स</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-600">✓</span>
                  <span><strong>फनी शॉर्ट प्रश्न:</strong> चिंटू बंदर का पहेली ज़ोन</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-600">✓</span>
                  <span><strong>सचित्र वर्णमाला:</strong> क से कबूतर, A for Apple</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 space-y-2">
              <button
                onClick={() => onOpenStudyPage('plan-01')}
                className="w-full py-3 px-3 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>फनी प्रश्न व ड्राइंग शुरू करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAiTeacher('छोटे बच्चों के लिए मनोरंजक खेल और चित्र कैसे बनाएं?')}
                className="w-full py-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-900 text-center flex items-center justify-center gap-1"
              >
                <Bot className="w-3.5 h-3.5 text-amber-600" />
                <span>AI टीचर से पूछें</span>
              </button>
            </div>

          </div>

          {/* CARD 2: 🎯 कक्षा 7 से 12 (NEET & JEE Mains Most Probability Bank) */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-b from-blue-50 via-indigo-50/60 to-white border-2 border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-xs">
                  NEET & JEE (Class 7-12)
                </span>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🎯
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                  कक्षा 7 से 12: NEET / JEE
                </h3>
                <p className="text-xs font-bold text-blue-700 mt-0.5">
                  High-Probability NCERT Line Decoder
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Google के शॉर्टकट्स को अलविदा कहें! NCERT की हर एक लाइन से तैयार 95%+ संभावित प्रश्न, NTA ट्रैप अलर्ट और शॉर्टकट एलिमिनेशन ट्रिक्स।
              </p>

              <ul className="space-y-1.5 text-xs text-slate-700 pt-1 font-semibold">
                <li className="flex items-center gap-1.5">
                  <span className="text-blue-600">✓</span>
                  <span><strong>95%+ प्रोबेबिलिटी:</strong> NEET & JEE Mains संभावित प्रश्न</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-blue-600">✓</span>
                  <span><strong>लाइन-दर-लाइन NCERT:</strong> बिना किसी शॉर्टकट के उत्तर</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-blue-600">✓</span>
                  <span><strong>PYQ फ्रीक्वेंसी:</strong> पिछले 5 वर्षों के रिपीट प्रश्न</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 space-y-2">
              <button
                onClick={() => onOpenStudyPage('plan-03')}
                className="w-full py-3 px-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>🎯 Competition Ready मॉक खोलें</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenStudyPage('plan-03')}
                className="w-full py-1.5 text-[11px] font-bold text-blue-800 hover:text-blue-900 text-center flex items-center justify-center gap-1"
              >
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>10वीं/12वीं बोर्ड स्पेशल</span>
              </button>
            </div>

          </div>

          {/* CARD 3: 💊 बी.फार्मा 4th सेमेस्टर (B.Pharm Sem 4 PCI Platform) */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-b from-teal-50 via-cyan-50/60 to-white border-2 border-teal-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-600 text-white shadow-xs">
                  बी.फार्मा (PCI Sem-4)
                </span>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  💊
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                  फार्मेसी 4th सेमेस्टर
                </h3>
                <p className="text-xs font-bold text-teal-700 mt-0.5">
                  B.Pharm All 5 Subjects & GPAT
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                PCI के 5 मुख्य विषय (BP401T से BP405T): मेडिसिनल केमिस्ट्री-1, फिजिकल फार्मास्यूटिक्स-2, फार्माकोलॉजी-1, फार्माकोग्नोसी-1 व POC-3 के नोट्स व प्रश्न।
              </p>

              <ul className="space-y-1.5 text-xs text-slate-700 pt-1 font-semibold">
                <li className="flex items-center gap-1.5">
                  <span className="text-teal-600">✓</span>
                  <span><strong>10 व 5 अंक निबंध:</strong> SAR व Drug Synthesis</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-teal-600">✓</span>
                  <span><strong>2-अंक परिभाषाएं:</strong> शॉर्ट मेमोरी ट्रिक्स</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-teal-600">✓</span>
                  <span><strong>GPAT प्रश्न बैंक:</strong> NIPER व ड्रग इंस्पेक्टर स्पेशल</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 space-y-2">
              <button
                onClick={() => onOpenStudyPage('plan-01')}
                className="w-full py-3 px-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>फार्मेसी 4th Sem शुरू करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAiTeacher('B.Pharm 4th semester medicinal chemistry SAR or synthesis help')}
                className="w-full py-1.5 text-[11px] font-bold text-teal-800 hover:text-teal-900 text-center flex items-center justify-center gap-1"
              >
                <Bot className="w-3.5 h-3.5 text-teal-600" />
                <span>फार्मेसी AI गाइड</span>
              </button>
            </div>

          </div>

          {/* CARD 4: 🚀 करियर और जॉब गाइडेंस (Career Access) */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-b from-purple-50 via-fuchsia-50/50 to-white border-2 border-purple-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-600 text-white shadow-xs">
                  कौशल व रोजगार
                </span>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🚀
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                  करियर व जॉब गाइडेंस
                </h3>
                <p className="text-xs font-bold text-purple-700 mt-0.5">
                  Career Access & Modern IT Skills
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                कंप्यूटर बेसिक, टाइपिंग, स्पोकन इंग्लिश, रिज्यूम मेकिंग, प्रतियोगी परीक्षा (SSC, Railway, Police) एवं डिजिटल सरकारी सेवाओं की संपूर्ण ट्रेनिंग।
              </p>

              <ul className="space-y-1.5 text-xs text-slate-700 pt-1 font-semibold">
                <li className="flex items-center gap-1.5">
                  <span className="text-purple-600">✓</span>
                  <span><strong>कंप्यूटर व AI टूल्स:</strong> बेसिक से एडवांस</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-purple-600">✓</span>
                  <span><strong>प्रतियोगी परीक्षा:</strong> GK/GS व रीजनिंग ट्रिक्स</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-purple-600">✓</span>
                  <span><strong>करियर गाइडेंस:</strong> ATS रिज्यूम व इंटरव्यू</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 space-y-2">
              <button
                onClick={() => onOpenStudyPage('plan-02')}
                className="w-full py-3 px-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>करियर स्किल्स शुरू करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToPlans}
                className="w-full py-1.5 text-[11px] font-bold text-purple-800 hover:text-purple-900 text-center flex items-center justify-center gap-1"
              >
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                <span>सभी प्लान्स देखें</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
