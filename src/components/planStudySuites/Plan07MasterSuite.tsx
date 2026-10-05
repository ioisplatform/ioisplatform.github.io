import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Copy, 
  Check, 
  Layers, 
  Download, 
  PhoneCall, 
  Star,
  Users,
  CheckCircle2
} from 'lucide-react';

export const Plan07MasterSuite: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'supreme' | 'payout' | 'leadership' | 'goldenId' | 'quiz'>('supreme');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Plan 01-06 summary cards
  const allPlansSummary = [
    { num: '01', name: 'Bal Vikas Access (₹10)', items: 'NCERT Class 1-5, 2-20 Tables, Varnamala, Phonics & 500+ Practice Worksheets' },
    { num: '02', name: 'Youth Skill Access (₹25)', items: 'ATS Pro Resume Builder (6 Blueprints), 200+ AI Prompts Vault, STAR HR Q&A' },
    { num: '03', name: 'Career & Job Access (₹50)', items: 'Class 6-12 NCERT Quick Notes, 10th/12th Career Compass, Spoken English Lab' },
    { num: '04', name: 'Family VIP Access (₹100)', items: 'Digital Parenting, 1930 Cyber Fraud Shield, Surya Namaskar & Emergency Directory' },
    { num: '05', name: 'Student Elite Access (₹200)', items: 'SSC/Railway/Police GS Vault, Speed Math 50 Tricks, Reasoning & Live Mocks' },
    { num: '06', name: 'Agency Reseller Hub (₹500)', items: 'Commercial Reselling License, WhatsApp Business Funnels, High-CTR Ad Copy Vault' }
  ];

  // Quiz
  const quizList = [
    {
      q: 'IOIS प्लान 07 (लाइफटाइम मास्टर एक्सेस) में प्रति रेफरल डायरेक्ट इंसेंटिव कितना प्राप्त होता है?',
      options: ['₹200', '₹350', '₹499.50 (50% उच्चतम टियर पेआउट)', '₹100'],
      correct: 2,
      explain: 'प्लान 07 (₹999) में प्रति रेफरल ₹499.50 (₹499 फ्लैट) का उच्चतम डायरेक्ट पेआउट तत्काल बैंक में ट्रांसफर होता है।'
    },
    {
      q: 'संजय वर्मा 20-सदस्यीय मॉडल के अनुसार 20 डायरेक्ट रेफरल पर कुल कितनी तत्काल आमदनी होती है?',
      options: ['₹5,000', '₹9,980 (20 × ₹499)', '₹2,500', '₹15,000'],
      correct: 1,
      explain: '20 सदस्यों को प्लान 07 से जोड़ने पर 20 × ₹499 = ₹9,980 की शुद्ध नकद आमदनी होती है।'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 via-yellow-950/70 to-slate-900 border-2 border-amber-500/50 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1 shadow">
                <Crown className="w-3.5 h-3.5" /> SUPREME PLAN 07 • ₹999 LIFETIME
              </span>
              <span className="text-xs text-amber-200/90 font-mono">All-in-One Master Franchise Vault</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Lifetime Master Access: Complete 7-Plan Unlocked & ₹499 Highest Tier Payout
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl leading-relaxed">
              प्लान 01 से लेकर 06 तक की सम्पूर्ण 100% डिजिटल अध्ययन सामग्री, डायरेक्ट एडमिन मेंटरशिप, ₹499 प्रति रेफरल उच्चतम पेआउट और अधिकृत गोल्डन स्मार्ट आईडी।
            </p>
          </div>

          <div className="p-4 bg-slate-950/90 rounded-2xl border border-amber-500/40 text-center shrink-0">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">सर्वोच्च डायरेक्ट इंसेंटिव</span>
            <div className="text-3xl font-black text-amber-400 font-mono">₹499.00 / Ref</div>
            <span className="text-[10px] text-emerald-400 font-bold">50% उच्चतम टियर पेआउट</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveSubTab('supreme')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'supreme' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>सम्पूर्ण 6 प्लान्स एक्सेस</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payout')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'payout' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>₹499 पेआउट मॉडल (₹9,980 आय)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leadership')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'leadership' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>VIP एडमिन मेंटरशिप</span>
        </button>

        <button
          onClick={() => setActiveSubTab('goldenId')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'goldenId' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>गोल्डन स्मार्ट आईडी प्रमाणन</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'quiz' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>मास्टर लीडरशिप टेस्ट</span>
        </button>
      </div>

      {/* SUB-TAB 1: SUPREME ALL-IN-ONE */}
      {activeSubTab === 'supreme' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-center justify-between">
            <span>👑 बधाई हो! प्लान 07 सक्रिय होने पर आपको नीचे दिए गए सभी 6 प्लान्स का 100% एक्सेस आजीवन प्राप्त है।</span>
            <span className="font-mono font-bold text-amber-400">ALL 6 PLANS UNLOCKED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allPlansSummary.map((p) => (
              <div key={p.num} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                    PLAN {p.num}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">✓ 100% आजीवन अनलॉक</span>
                </div>
                <h4 className="font-extrabold text-sm text-white">{p.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{p.items}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ₹499 PAYOUT MODEL */}
      {activeSubTab === 'payout' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 animate-in fade-in">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-white">
                💰 संजय वर्मा 20-सदस्यीय मास्टर लीडरशिप मॉडल
              </h3>
              <p className="text-xs text-slate-400">
                प्रत्येक डायरेक्ट सदस्य से ₹499 की सीधी कमाई का गणितीय विश्लेषण
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(`IOIS SUPREME PAYOUT MODEL\n1 Direct Member = ₹499\n5 Members = ₹2,495\n10 Members = ₹4,990\n20 Members = ₹9,980\n50 Members = ₹24,950\nInstant Bank/UPI Transfer within 60 minutes!`, 'payout-calc')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1 shadow"
            >
              {copiedId === 'payout-calc' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'payout-calc' ? 'कॉपी हुआ!' : 'मॉडल कॉपी करें'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">5 सदस्य</span>
              <div className="text-xl font-black text-amber-400 font-mono">₹2,495</div>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">10 सदस्य</span>
              <div className="text-xl font-black text-amber-400 font-mono">₹4,990</div>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-amber-500/40 space-y-1 bg-amber-500/10">
              <span className="text-xs text-amber-300 font-bold">20 सदस्य (संजय वर्मा मॉडल)</span>
              <div className="text-2xl font-black text-amber-400 font-mono">₹9,980</div>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">50 सदस्य</span>
              <div className="text-xl font-black text-emerald-400 font-mono">₹24,950</div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LEADERSHIP */}
      {activeSubTab === 'leadership' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in">
          <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3">
            👑 VIP डायरेक्ट एडमिन मेंटरशिप एवं जिला समन्वय प्रोटोकॉल
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <strong className="text-amber-400 block text-sm">1. डायरेक्ट WhatsApp हॉटलाइन</strong>
              <p>प्लान 07 के सदस्यों को मुख्य डेवलपर एवं एडमिन टीम से सीधा संपर्क प्राप्त होता है (+91 8877490845)। किसी भी भुगतान या सहायता का तत्काल 15 मिनट में समाधान किया जाता है।</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <strong className="text-emerald-400 block text-sm">2. जिला समन्वयक (District Coordinator) प्राथमिकता</strong>
              <p>अपने जिले में IOIS डिजिटल कैंप और ई-लर्निंग कार्यशाला आयोजित करने के लिए आधिकारिक मुहर, बैनर डिजाइन और प्रचार सामग्री निशुल्क प्रदान की जाती है।</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: GOLDEN ID */}
      {activeSubTab === 'goldenId' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 animate-in fade-in">
          <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-slate-950 shadow-2xl space-y-4 border-4 border-yellow-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Crown className="w-5 h-5 text-slate-950" />
                <span className="font-black text-xs tracking-wider">IOIS MASTER FRANCHISE</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-mono text-[10px] font-black">
                GOLDEN TIER
              </span>
            </div>

            <div className="space-y-1 py-2 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-950 text-amber-400 mx-auto flex items-center justify-center font-black text-2xl border-2 border-white shadow">
                ★
              </div>
              <h4 className="text-lg font-black tracking-tight">AUTHORIZED DISTRICT PARTNER</h4>
              <p className="text-xs font-bold text-slate-900">National Digital Education & Employment Mission</p>
            </div>

            <div className="pt-2 border-t border-slate-950/20 flex items-center justify-between text-[11px] font-bold">
              <span>वैधता: आजीवन (Lifetime)</span>
              <span className="font-mono">ID: IOIS-GOLD-MASTER</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: QUIZ */}
      {activeSubTab === 'quiz' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white">
              मास्टर लीडरशिप एवं फ्रैंचाइज़ी क्विज
            </h3>
            {quizSubmitted && (
              <span className="px-3.5 py-1.5 rounded-full font-black text-xs bg-amber-400 text-slate-950">
                स्कोर: {Object.keys(quizAnswers).filter(k => quizAnswers[Number(k)] === quizList[Number(k)].correct).length} / {quizList.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {quizList.map((qItem, qIdx) => (
              <div key={qIdx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <strong className="text-sm text-white block">
                  {qIdx + 1}. {qItem.q}
                </strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {qItem.options.map((opt, oIdx) => {
                    const isSelected = quizAnswers[qIdx] === oIdx;
                    const isCorrect = qItem.correct === oIdx;
                    let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                    if (quizSubmitted) {
                      if (isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-300';
                      else if (isSelected && !isCorrect) style = 'bg-rose-950/60 border-rose-500 text-rose-300';
                    } else if (isSelected) {
                      style = 'bg-amber-500/30 border-amber-400 text-amber-200';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={quizSubmitted}
                        onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                        className={`p-3 rounded-xl border text-left font-medium transition-all ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    💡 <strong>व्याख्या:</strong> {qItem.explain}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {!quizSubmitted ? (
              <button
                onClick={() => setQuizSubmitted(true)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg"
              >
                उत्तर सबमिट करें व स्कोर देखें
              </button>
            ) : (
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
              >
                पुनः टेस्ट दें (Reset Quiz)
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
