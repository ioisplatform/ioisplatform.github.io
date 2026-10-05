import React, { useState } from 'react';
import { 
  Award, 
  Zap, 
  Layers, 
  HelpCircle, 
  Sparkles, 
  Copy, 
  Check, 
  TrendingUp, 
  Search,
  BookOpen,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const Plan05EliteSuite: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'gs' | 'speedMath' | 'reasoning' | 'mockTest'>('gs');
  const [selectedGsTopic, setSelectedGsTopic] = useState<'polity' | 'history' | 'geography' | 'science'>('polity');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mock test state
  const [mockAnswers, setMockAnswers] = useState<Record<number, number>>({});
  const [mockSubmitted, setMockSubmitted] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // 1. GS Vault
  const gsVault = {
    polity: [
      {
        head: 'भारतीय संविधान: महत्वपूर्ण अनुच्छेद (Key Articles)',
        points: [
          'अनुच्छेद 14: विधि के समक्ष समता (Equality before Law)',
          'अनुच्छेद 17: अस्पृश्यता का अंत (Abolition of Untouchability)',
          'अनुच्छेद 21: प्राण एवं दैहिक स्वतंत्रता का अधिकार (Right to Life & Personal Liberty)',
          'अनुच्छेद 21A: 6 से 14 वर्ष के बच्चों के लिए अनिवार्य निःशुल्क शिक्षा (86वां संशोधन 2002)',
          'अनुच्छेद 32: संवैधानिक उपचारों का अधिकार (डॉ. आंबेडकर द्वारा संविधान की "आत्मा एवं हृदय")',
          'अनुच्छेद 368: संसद की संविधान संशोधन करने की शक्ति (दक्षिण अफ्रीका से लिया गया)'
        ]
      },
      {
        head: 'संविधान के प्रमुख स्रोत (Sources of Indian Constitution)',
        points: [
          'ब्रिटेन: संसदीय प्रणाली, एकल नागरिकता, विधि का शासन',
          'USA: मौलिक अधिकार, न्यायिक पुनरावलोकन, न्यायपालिका की स्वतंत्रता, राष्ट्रपति पर महाभियोग',
          'आयरलैंड: राज्य के नीति निदेशक तत्व (DPSP), राष्ट्रपति की निर्वाचन पद्धति',
          'कनाडा: सशक्त केंद्र के साथ संघीय व्यवस्था, अवशिष्ट शक्तियां'
        ]
      }
    ],
    history: [
      {
        head: 'आधुनिक भारत का स्वतंत्रता संग्राम (1885 - 1947 टाइमलाइन)',
        points: [
          '1885: भारतीय राष्ट्रीय कांग्रेस (INC) की स्थापना (ए.ओ. ह्यूम द्वारा, प्रथम अध्यक्ष डब्ल्यू.सी. बनर्जी)',
          '1905: बंगाल विभाजन (लॉर्ड कर्जन द्वारा) एवं स्वदेशी आंदोलन की शुरुआत',
          '1906: ढाका में मुस्लिम लीग की स्थापना (आगा खां व नवाब सलीमुल्लाह)',
          '1916: लखनऊ समझौता (कांग्रेस और मुस्लिम लीग के बीच) एवं होमरूल लीग (तिलक व एनी बेसेंट)',
          '1919: 13 अप्रैल - जलियांवाला बाग हत्याकांड (जनरल डायर के आदेश पर, पंजाब)',
          '1930: 12 मार्च - 6 अप्रैल - दांडी मार्च (नमक सत्याग्रह)',
          '1942: 8 अगस्त - भारत छोड़ो आंदोलन (गांधीजी द्वारा "करो या मरो" का आह्वान)'
        ]
      }
    ],
    geography: [
      {
        head: 'भारत की प्रमुख नदियाँ एवं जलप्रपात (Rivers & Falls)',
        points: [
          'गंगा नदी: भारत की सबसे लंबी नदी (2525 किमी)। उद्गम: गंगोत्री हिमनद (भागीरथी रूप में)।',
          'ब्रह्मपुत्र नदी: उद्गम: मानसरोवर झील (तिब्बत में त्सांगपो)। भारत में असम में प्रवेश पर देहांग।',
          'गोदावरी नदी: प्रायद्वीपीय भारत की सबसे लंबी नदी (1465 किमी), इसे "दक्षिण गंगा" या "वृद्ध गंगा" कहते हैं।',
          'नर्मदा एवं ताप्ती: पश्चिम की ओर बहने वाली नदियाँ जो डेल्टा नहीं बल्कि एस्चुअरी (ज्वारनदमुख) बनाती हैं।',
          'जोग जलप्रपात (गेरसोप्पा): कर्नाटक में शरावती नदी पर स्थित (भारत का प्रमुख जलप्रपात)।'
        ]
      }
    ],
    science: [
      {
        head: 'सामान्य विज्ञान महत्वपूर्ण तथ्य (General Science Top Formulas)',
        points: [
          'ध्वनि की चाल (Speed of Sound): ठोस > द्रव > गैस (निर्वात में ध्वनि गमन नहीं कर सकती)।',
          'विटामिन की कमी से होने वाले रोग: Vit A (रतौंधी), Vit B1 (बेरी-बेरी), Vit C (स्कर्वी), Vit D (रिकेट्स)।',
          'रक्त समूह (Blood Group): O- सर्वदाता (Universal Donor), AB+ सर्वग्राही (Universal Acceptor)।',
          'अम्ल व क्षार: लिटमस पेपर नीले को लाल करता है (अम्ल), लाल को नीला करता है (क्षार)। pH मान: शुद्ध जल = 7'
        ]
      }
    ]
  };

  // 2. Speed Math Tricks
  const speedMathTricks = [
    {
      title: 'ट्रिक 1: जिस संख्या के अंत में 5 हो, उसका वर्ग (Square in 2 Sec)',
      formula: 'संख्या n5² = [n × (n+1)] और अंत में 25',
      example: '35² = (3 × 4) और 25 = 1225 | 75² = (7 × 8) और 25 = 5625 | 105² = (10 × 11) और 25 = 11025'
    },
    {
      title: 'ट्रिक 2: 100 के निकटवर्ती संख्याओं का गुणा (Multiplication Near 100)',
      formula: '104 × 106 = (104 + 6 = 110) और (4 × 6 = 24) → उत्तर = 11024',
      example: '103 × 107 = (103 + 7 = 110) और (3 × 7 = 21) → उत्तर = 11021'
    },
    {
      title: 'ट्रिक 3: प्रतिशत से भिन्न सारणी (Fraction to Percentage Vault)',
      formula: 'प्रतियोगी परीक्षा में गणना तेज करने वाली टेबल',
      example: '1/2 = 50% | 1/3 = 33.33% | 1/4 = 25% | 1/5 = 20% | 1/6 = 16.66% | 1/7 = 14.28% | 1/8 = 12.5% | 1/9 = 11.11% | 1/12 = 8.33%'
    },
    {
      title: 'ट्रिक 4: 2 वर्ष के साधारण एवं चक्रवृद्धि ब्याज का अंतर (CI - SI Formula)',
      formula: 'अंतर (Difference D) = P × (R / 100)²',
      example: 'यदि मूलधन P = ₹10,000, दर R = 10%, तो 2 वर्ष का CI-SI अंतर = 10000 × (10/100)² = ₹100'
    }
  ];

  // 3. Mock Test Questions
  const mockQuestions = [
    {
      q: 'भारतीय संविधान के किस अनुच्छेद को डॉ. बी.आर. आंबेडकर ने "संविधान की आत्मा और हृदय" कहा था?',
      options: ['अनुच्छेद 19', 'अनुच्छेद 21', 'अनुच्छेद 32 (संवैधानिक उपचार)', 'अनुच्छेद 370'],
      correct: 2,
      explain: 'अनुच्छेद 32 के तहत सर्वोच्च न्यायालय मौलिक अधिकारों की रक्षा हेतु 5 प्रकार की रिट जारी करता है।'
    },
    {
      q: 'निम्नलिखित में से कौन-सी नदी अरब सागर में गिरती है और डेल्टा नहीं बनाती?',
      options: ['गंगा', 'गोदावरी', 'नर्मदा', 'महानदी'],
      correct: 2,
      explain: 'नर्मदा और ताप्ती भ्रंश घाटी से बहते हुए अरब सागर में गिरती हैं और एस्चुअरी बनाती हैं।'
    },
    {
      q: 'यदि किसी वस्तु का क्रय मूल्य ₹800 है और उसे ₹1000 में बेचा जाता है, तो लाभ प्रतिशत क्या होगा?',
      options: ['20%', '25%', '15%', '30%'],
      correct: 1,
      explain: 'लाभ = 1000 - 800 = ₹200। लाभ % = (200 / 800) × 100 = 25%।'
    },
    {
      q: 'EJOTY रीजनिंग ट्रिक में "T" का स्थानीय मान (Place Value) क्या होता है?',
      options: ['15', '18', '20', '22'],
      correct: 2,
      explain: 'E=5, J=10, O=15, T=20, Y=25।'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/70 via-red-950/60 to-slate-900 border border-rose-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                PLAN 05 • ₹200 AUTHORIZED SUITE
              </span>
              <span className="text-xs text-slate-400 font-mono">Govt. Exam Toppers Vault</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Student Elite Access: SSC, Railway, Banking & Police Toppers Vault
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              सामान्य अध्ययन (GS), स्पीड मैथ 50 शॉर्टकट ट्रिक्स, तर्कशक्ति मास्टरक्लास और लाइव मॉक टेस्ट का संकलन।
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">प्लान इंसेंटिव</span>
            <div className="text-2xl font-black text-rose-400 font-mono">₹140.00 / Ref</div>
            <span className="text-[10px] text-emerald-400 font-bold">70% डायरेक्ट पेआउट</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveSubTab('gs')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'gs' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>GS टॉपर्स नोट्स (Polity, History, Geo)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('speedMath')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'speedMath' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>स्पीड मैथ 50 शॉर्टकट ट्रिक्स</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reasoning')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'reasoning' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>रीजनिंग मास्टरक्लास</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mockTest')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'mockTest' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>लाइव मॉक टेस्ट</span>
        </button>
      </div>

      {/* SUB-TAB 1: GS VAULT */}
      {activeSubTab === 'gs' && (
        <div className="space-y-4 animate-in fade-in">
          {/* GS topic pills */}
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
            {(['polity', 'history', 'geography', 'science'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedGsTopic(t)}
                className={`px-4 py-2 rounded-xl font-bold capitalize transition-all ${
                  selectedGsTopic === t 
                    ? 'bg-rose-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                {t === 'polity' ? '📜 संविधान व राजव्यवस्था' : t === 'history' ? '⏳ आधुनिक भारत का इतिहास' : t === 'geography' ? '🌍 भारतीय भूगोल व नदियाँ' : '🔬 सामान्य विज्ञान'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {gsVault[selectedGsTopic].map((card, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    {card.head}
                  </h4>
                  <button
                    onClick={() => copyToClipboard(card.points.join('\n'), `gs-${idx}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
                  >
                    {copiedId === `gs-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === `gs-${idx}` ? 'कॉपी हुआ!' : 'कॉपी'}</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  {card.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                      <p className="leading-relaxed font-mono">{pt}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SPEED MATH */}
      {activeSubTab === 'speedMath' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {speedMathTricks.map((trick, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="font-extrabold text-sm text-amber-400">
                  {trick.title}
                </h4>
                <div className="p-2.5 bg-slate-900 rounded-xl font-mono text-xs text-rose-300">
                  <strong>फॉर्मूला:</strong> {trick.formula}
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-xl font-mono text-xs text-emerald-300">
                  <strong>उदाहरण:</strong> {trick.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REASONING */}
      {activeSubTab === 'reasoning' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in">
          <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3">
            🧠 कोडिंग-डिकोडिंग एवं विपरीत अक्षर मास्टर फॉर्मूला
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <strong className="text-emerald-400 block text-sm">1. EJOTY फॉर्मूला (5 के गुणज)</strong>
              <p className="text-slate-300">
                E = 5, J = 10, O = 15, T = 20, Y = 25<br />
                इससे किसी भी अक्षर का स्थान 2 सेकंड में ज्ञात किया जा सकता है। जैसे: S = T से 1 पहले = 19।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <strong className="text-amber-400 block text-sm">2. विपरीत अक्षर याद रखने की ट्रिक (Opposites)</strong>
              <p className="text-slate-300 font-mono">
                A-Z (Azad), B-Y (Boy), C-X (Crux), D-W (Dew), E-V (Evening), F-U (Fuel), G-T (GT Road), H-S (High School), I-R (Indian Railway), J-Q (Jungle Queen), K-P (Kurta Pajama), L-O (Love), M-N (Man).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MOCK TEST */}
      {activeSubTab === 'mockTest' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white">
              प्रतियोगी परीक्षा 4-विषय लाइव मॉक टेस्ट
            </h3>
            {mockSubmitted && (
              <span className="px-3.5 py-1.5 rounded-full font-black text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                स्कोर: {Object.keys(mockAnswers).filter(k => mockAnswers[Number(k)] === mockQuestions[Number(k)].correct).length} / {mockQuestions.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {mockQuestions.map((qItem, qIdx) => (
              <div key={qIdx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <strong className="text-sm text-white block">
                  {qIdx + 1}. {qItem.q}
                </strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {qItem.options.map((opt, oIdx) => {
                    const isSelected = mockAnswers[qIdx] === oIdx;
                    const isCorrect = qItem.correct === oIdx;
                    let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                    if (mockSubmitted) {
                      if (isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-300';
                      else if (isSelected && !isCorrect) style = 'bg-rose-950/60 border-rose-500 text-rose-300';
                    } else if (isSelected) {
                      style = 'bg-rose-600/30 border-rose-500 text-rose-200';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={mockSubmitted}
                        onClick={() => setMockAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                        className={`p-3 rounded-xl border text-left font-medium transition-all ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {mockSubmitted && (
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    💡 <strong>व्याख्या:</strong> {qItem.explain}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {!mockSubmitted ? (
              <button
                onClick={() => setMockSubmitted(true)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                उत्तर सबमिट करें व स्कोर देखें
              </button>
            ) : (
              <button
                onClick={() => {
                  setMockAnswers({});
                  setMockSubmitted(false);
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
