import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Volume2, 
  Pencil, 
  BookOpen, 
  ArrowRight, 
  Smile, 
  Music, 
  Star,
  CheckCircle2,
  Heart
} from 'lucide-react';

interface KidsLearningCornerProps {
  onOpenStudyPage: (planId: string) => void;
  onOpenAiTeacher: (initialPrompt?: string) => void;
  onOpenKidsAiZone: () => void;
  onOpenNurseryWorkbook?: () => void;
}

export const KidsLearningCorner: React.FC<KidsLearningCornerProps> = ({
  onOpenStudyPage,
  onOpenAiTeacher,
  onOpenKidsAiZone,
  onOpenNurseryWorkbook
}) => {
  const [playingAudioKey, setPlayingAudioKey] = useState<string | null>(null);

  const handleSpeak = (text: string, key: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      setPlayingAudioKey(key);
      utterance.onend = () => setPlayingAudioKey(null);
      utterance.onerror = () => setPlayingAudioKey(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingAudioKey(key);
      setTimeout(() => setPlayingAudioKey(null), 1500);
    }
  };

  const sampleAlphabets = [
    { hindi: 'अ', word: 'अनार', phonetic: 'A for Apple', icon: '🍎', color: 'from-red-400 to-rose-500' },
    { hindi: 'आ', word: 'आम', phonetic: 'B for Ball', icon: '🥭', color: 'from-amber-400 to-orange-500' },
    { hindi: 'इ', word: 'इमली', phonetic: 'C for Cat', icon: '🐱', color: 'from-emerald-400 to-green-500' },
    { hindi: 'क', word: 'कमल', phonetic: 'D for Dog', icon: '🪷', color: 'from-blue-400 to-indigo-500' },
    { hindi: 'ख', word: 'खरगोश', phonetic: 'E for Elephant', icon: '🐰', color: 'from-purple-400 to-fuchsia-500' },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-amber-100/40 border-b border-amber-200 relative overflow-hidden">
      
      {/* Playful Floating Shapes */}
      <div className="absolute top-4 left-6 text-2xl select-none opacity-30 animate-bounce">⭐</div>
      <div className="absolute top-12 right-10 text-3xl select-none opacity-30 animate-pulse">🎈</div>
      <div className="absolute bottom-6 left-12 text-3xl select-none opacity-30">🎨</div>
      <div className="absolute bottom-10 right-8 text-2xl select-none opacity-30 animate-bounce">🚀</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-200 text-amber-950 text-xs font-black uppercase tracking-wider shadow-sm">
            <span className="text-sm">🧒</span>
            <span>नर्सरी से 5वीं स्पेशल • ई-लर्निंग व फन कॉर्नर</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            छोटे बच्चों के लिए <span className="text-orange-600">एनिमेटेड ई-बुक्स</span> और AI टीचर
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            अभिभावकों के लिए एक संपूर्ण समाधान — रंग-बिरंगे चंचल कार्टून कैरेक्टर्स, बोलकर सुनाने वाली वर्णमाला, 1 से 100 गिनती, और स्क्रीन पर हाथ से लिखने का डिजिटल ट्रेसिंग पैड!
          </p>
        </div>

        {/* 4 INTERACTIVE KIDS LEARNING PREVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          
          {/* Card 1: सचित्र वर्णमाला व ABCD */}
          <div className="bg-white rounded-3xl p-5 border-2 border-orange-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                🔤
              </div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
                सचित्र वर्णमाला व ABCD
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                अ से अनार, क से कबूतर, A to Z फोनिक्स और शब्दों का सही उच्चारण।
              </p>

              {/* Mini Interactive Alphabet Pill Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {sampleAlphabets.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSpeak(`${item.hindi} से ${item.word}`, `alpha-${idx}`)}
                    className="p-1.5 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 text-xs font-bold text-slate-800 shrink-0 flex items-center gap-1 transition-transform hover:scale-105"
                    title="बोलकर सुनें"
                  >
                    <span>{item.icon}</span>
                    <span>{item.hindi}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (onOpenNurseryWorkbook) {
                  onOpenNurseryWorkbook();
                } else {
                  onOpenStudyPage('plan-01');
                }
              }}
              className="mt-4 w-full py-2.5 px-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all hover:scale-[1.02]"
            >
              <span>नर्सरी A-Z वर्कबुक खोलें (26 Pages)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: 1 से 100 गिनती व पहाड़ा */}
          <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                🔢
              </div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                1 से 100 गिनती व पहाड़ा
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                2 से 20 तक पहाड़ा (Tables), जोड़-घटाव के सरल खेल और दृश्य आरेख।
              </p>

              <div className="grid grid-cols-4 gap-1 text-center font-bold text-xs text-emerald-900">
                <span className="p-1 bg-emerald-50 rounded-lg">२ x २ = ४</span>
                <span className="p-1 bg-emerald-50 rounded-lg">२ x ३ = ६</span>
                <span className="p-1 bg-emerald-50 rounded-lg">२ x ४ = ८</span>
                <span className="p-1 bg-emerald-50 rounded-lg">२ x ५ = १०</span>
              </div>
            </div>

            <button
              onClick={() => onOpenStudyPage('plan-01')}
              className="mt-4 w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <span>गिनती व पहाड़ा चार्ट</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: डिजिटल अक्षर ट्रेसिंग पैड */}
          <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                ✍️
              </div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-purple-700 transition-colors">
                डिजिटल अक्षर ट्रेसिंग पैड
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                स्क्रीन पर हाथ की उंगली से अक्षर और चित्र बनाकर सुंदर लिखावट का अभ्यास।
              </p>

              <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-purple-600 shrink-0" />
                <span>पेंसिल रंग, रबर, गाइड लाइन व इमेज डाउनलोड सुविधा!</span>
              </div>
            </div>

            <button
              onClick={() => onOpenStudyPage('plan-01')}
              className="mt-4 w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <span>ट्रेसिंग पैड चालू करें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: चंचल कविताएं व नैतिक कहानियां */}
          <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                🐰
              </div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-rose-700 transition-colors">
                बाल कविताएं व कहानियां
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                'तितली उड़ी बस पर चढ़ी', 'मछली जल की रानी है' व प्रेरणादायक कहानियां।
              </p>

              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 flex items-center gap-2">
                <Music className="w-4 h-4 text-rose-600 shrink-0" />
                <span>ऑडियो प्लेबैक के साथ संगीत और लयबद्ध पाठ!</span>
              </div>
            </div>

            <button
              onClick={() => onOpenStudyPage('plan-01')}
              className="mt-4 w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <span>कविताएं पढ़ें व सुनें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* PROMINENT "TALK TO YOUR AI TEACHER" BANNER */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-2 border-purple-400/40 relative overflow-hidden">
          
          {/* Decorative Sparkle Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center space-x-4 text-center lg:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shrink-0">
                🤖
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>24x7 ऑनलाइन AI टीचर एक्टिव</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  "Talk to Your AI Teacher" — अपने एआई टीचर से बात करें
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
                  क्या किसी शब्द, कविता, पहाड़ा या होमवर्क का जवाब ढूंढने में मदद चाहिए? अपने डिजिटल एआई टीचर से सरल हिंदी में सवाल पूछें!
                </p>
              </div>
            </div>

            {/* Quick Interactive Prompt Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={onOpenKidsAiZone}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <Bot className="w-4 h-4 text-slate-950" />
                <span>एआई टीचर से बात करें (जादुई कहानी व क्विज)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={() => onOpenStudyPage('plan-01')}
                className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-colors"
              >
                प्लान 01 स्टडी हब
              </button>
            </div>

          </div>

          {/* Quick Click Prompts */}
          <div className="mt-5 pt-4 border-t border-purple-800/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-purple-300 font-semibold text-[11px]">त्वरित सवाल पूछें:</span>
            <button
              onClick={() => onOpenAiTeacher('अ से ज्ञ तक वर्णमाला का सही उच्चारण बताएं')}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-colors text-[11px]"
            >
              • वर्णमाला कैसे सीखें?
            </button>
            <button
              onClick={() => onOpenAiTeacher('डिजिटल अक्षर ट्रेसिंग पैड का उपयोग कैसे करें?')}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-colors text-[11px]"
            >
              • स्क्रीन पर लिखना कैसे सीखें?
            </button>
            <button
              onClick={() => onOpenAiTeacher('गृहकार्य (Homework) चेक कराने की क्या प्रक्रिया है?')}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-colors text-[11px]"
            >
              • होमवर्क कैसे चेक कराएं?
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};
