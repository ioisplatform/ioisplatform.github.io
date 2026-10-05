import React, { useState } from 'react';
import { 
  Briefcase, 
  Share2, 
  MessageCircle, 
  Award, 
  Copy, 
  Check, 
  TrendingUp, 
  CheckCircle2, 
  FileCheck, 
  DollarSign, 
  Sparkles,
  Layers
} from 'lucide-react';

export const Plan06AgencySuite: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'license' | 'whatsapp' | 'ads' | 'blueprint' | 'quiz'>('license');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // WhatsApp Scripts
  const waScripts = [
    {
      id: 'wa1',
      title: '1. स्वागत संदेश (Welcome & Curiosity Hook)',
      text: `नमस्ते जी! 🙏\n\nIOIS डिजिटल एजुकेशन एवं करियर पोर्टल में आपका हार्दिक स्वागत है।\n\nयहाँ आपको NCERT कक्षा 1 से 12 तक की सम्पूर्ण डिजिटल बुक्स, ATS रिज्यूम, प्रतियोगी परीक्षा नोट्स और 70% तक इंस्टेंट पेआउट कार्यपुस्तिका उपलब्ध होती है।\n\nक्या आप विद्यार्थी हैं, अभिभावक हैं या घर बैठे आमदनी की तलाश में हैं? कृपया 1, 2 या 3 लिखकर उत्तर दें।`
    },
    {
      id: 'wa2',
      title: '2. प्लान 01 (₹10 बाल विकास) प्रेजेंटेशन स्क्रिप्ट',
      text: `बच्चों के उज्ज्वल भविष्य के लिए भारत का सबसे बड़ा डिजिटल पैकेज!\n\n📚 NCERT कक्षा 1 से 5 सम्पूर्ण ई-बुक्स + 2 से 20 तक पहाड़ा + वर्णमाला + फोनिक्स + 500+ अभ्यास प्रश्न।\n\n💰 शुल्क: मात्र ₹10 (एक कप चाय से भी कम!)\n⚡ तुरंत एक्टिवेट करें और ₹7.00 प्रति रेफरल डायरेक्ट कमीशन पाएं।\n\nलिंक: [आपका रेफरल लिंक यहाँ डालें]`
    },
    {
      id: 'wa3',
      title: '3. फॉलो-अप संदेश (Follow-Up on Enquiry)',
      text: `नमस्ते! आपने IOIS डिजिटल किट के बारे में जानकारी माँगी थी। आज 50+ नए सदस्यों ने अपना आईडी एक्टिवेट किया है।\n\nयदि आपके मन में कोई शंका है तो बेझिझक पूछें। हम आपकी पूरी मदद के लिए तत्पर हैं! 😊`
    }
  ];

  // Ad Creatives
  const adCreatives = [
    {
      id: 'ad1',
      platform: 'Instagram / Facebook Ad Copy',
      hook: '🚨 क्या आप भी अपने स्मार्टफोन का उपयोग केवल रील्स देखने में कर रहे हैं?',
      body: 'IOIS नेशनल डिजिटल एजुकेशन नेटवर्क से जुड़कर सीखें डिजिटल स्किल्स और कमाएं प्रतिदिन ₹500 से ₹2000 तक सीधा बैंक खाते में।\n\n✅ 70% तक डायरेक्ट पेआउट\n✅ मात्र ₹10 से शुरुआत\n✅ कोई छिपे हुए चार्जेस नहीं\n✅ 100% भारत सरकार के मानकों के अनुरूप शैक्षिक किट।',
      cta: 'बायो में दिए गए लिंक पर अभी क्लिक करें!'
    },
    {
      id: 'ad2',
      platform: 'YouTube Shorts / Reels 30-Sec Script',
      hook: '[कैमरे के सामने उत्साह से] कॉलेज की पढ़ाई के साथ जेबखर्च कैसे निकालें?',
      body: 'दोस्तों, सिर्फ ₹10 या ₹25 में IOIS के स्टडी मॉड्यूल्स लेकर आप ATS फ्रेंडली रिज्यूम, AI प्रॉम्ट्स और NCERT नोट्स पा सकते हैं, और अपने दोस्तों को रेफर करके 70% तक कमीशन तुरंत पा सकते हैं!',
      cta: 'स्क्रीन पर दिख रहे नंबर पर तुरंत WhatsApp करें!'
    }
  ];

  // Agency quiz
  const quizList = [
    {
      q: 'IOIS प्लान 06 (एजेंसी रीसेलर हब) में प्रति रेफरल डायरेक्ट इंसेंटिव कितना मिलता है?',
      options: ['₹100', '₹350 (70% डायरेक्ट पेआउट)', '₹50', '₹200'],
      correct: 1,
      explain: 'प्लान 06 (₹500 शुल्क) पर 70% यानी ₹350 प्रति डायरेक्ट रेफरल तत्काल प्राप्त होता है।'
    },
    {
      q: 'डिजिटल रीसेलिंग में सबसे प्रभावी कन्वर्जन टूल कौन-सा है?',
      options: ['बिना पूछे स्पैम ईमेल भेजना', 'WhatsApp ऑटोमेशन एवं त्वरित समाधान', 'महीने में एक बार पोस्ट करना', 'सिर्फ फोन कॉल करना'],
      correct: 1,
      explain: 'WhatsApp बिजनेस ऑटोमेशन और त्वरित जवाब देने से ग्राहक का विश्वास और कन्वर्जन दर 3 गुना बढ़ जाती है।'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-slate-900 border border-purple-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-400 border border-purple-500/30">
                PLAN 06 • ₹500 AUTHORIZED SUITE
              </span>
              <span className="text-xs text-slate-400 font-mono">Agency & Franchise Master Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Agency Reseller Hub: Commercial License, WhatsApp Scripts & Ad Vault
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              डिजिटल रीसेलिंग का संपूर्ण कमर्शियल लाइसेंस। 7 ऑटोमेटेड व्हाट्सएप फनल, हाई-सीटीआर विज्ञापन कॉपी और ₹2,000/दिन की कमाई का व्यावहारिक ब्लूप्रिंट।
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">प्लान इंसेंटिव</span>
            <div className="text-2xl font-black text-purple-400 font-mono">₹350.00 / Ref</div>
            <span className="text-[10px] text-emerald-400 font-bold">70% डायरेक्ट पेआउट</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveSubTab('license')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'license' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>कमर्शियल रीसेलर लाइसेंस</span>
        </button>

        <button
          onClick={() => setActiveSubTab('whatsapp')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'whatsapp' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp ऑटोमेशन स्क्रिप्ट्स</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ads')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'ads' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>विज्ञापन व सोशल मीडिया कॉपी</span>
        </button>

        <button
          onClick={() => setActiveSubTab('blueprint')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'blueprint' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>₹2000/दिन कमाई ब्लूप्रिंट</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'quiz' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>एजेंसी टेस्ट</span>
        </button>
      </div>

      {/* SUB-TAB 1: LICENSE */}
      {activeSubTab === 'license' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% AUTHORIZED COMMERCIAL LICENSE
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                IOIS अधिकृत डिजिटल रीसेलर पार्टनर सर्टिफिकेट
              </h3>
            </div>
            <button
              onClick={() => copyToClipboard(`IOIS COMMERCIAL RESELLER LICENSE\nLicensee: Authorized Digital Partner\nStatus: Active & Verified\nPermitted: Plan 01 to Plan 06 Distribution\nPayout Structure: Up to 70% Instant Payout\nIssuer: IOIS National Digital Education Network\nHelpline: +91 8877490845`, 'lic')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
            >
              {copiedId === 'lic' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'lic' ? 'लाइसेंस कॉपी हुआ!' : 'लाइसेंस टेक्स्ट कॉपी करें'}</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-purple-500/40 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-400 text-purple-300 mx-auto flex items-center justify-center font-black text-2xl">
              ★
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-white">COMMERCIAL RESELLER RIGHTS (PLR/MRR)</h4>
              <p className="text-xs text-slate-300 max-w-xl mx-auto">
                यह प्रमाणित किया जाता है कि इस प्लान के सक्रिय सदस्य को IOIS डिजिटल शैक्षिक सामग्री, ई-बुक्स और टूल्स को पूरे भारत में अधिकृत रूप से पुनर्विक्रय (Resell) करने का पूर्ण अधिकार प्राप्त है।
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              ✓ VERIFIED PARTNER LICENSE #IOIS-AG-2026
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WHATSAPP SCRIPTS */}
      {activeSubTab === 'whatsapp' && (
        <div className="space-y-4 animate-in fade-in">
          {waScripts.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-sm text-purple-400">{item.title}</h4>
                <button
                  onClick={() => copyToClipboard(item.text, item.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'कॉपी हुआ!' : 'स्क्रिप्ट कॉपी करें'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900/90 rounded-xl font-sans text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {item.text}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: AD CREATIVES */}
      {activeSubTab === 'ads' && (
        <div className="space-y-4 animate-in fade-in">
          {adCreatives.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold">
                  {item.platform}
                </span>
                <button
                  onClick={() => copyToClipboard(`${item.hook}\n\n${item.body}\n\n${item.cta}`, item.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'कॉपी हुआ!' : 'विज्ञापन कॉपी करें'}</span>
                </button>
              </div>
              <p className="text-xs font-extrabold text-white">{item.hook}</p>
              <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {item.body}
              </div>
              <p className="text-xs text-amber-400 font-bold">CTA: {item.cta}</p>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 4: ₹2000/DAY BLUEPRINT */}
      {activeSubTab === 'blueprint' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 animate-in fade-in">
          <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3">
            📈 स्थानीय साइबर कैफे, कोचिंग एवं कॉलेज नेटवर्किंग से दैनिक ₹2000 कमाने का 3-चरणीय मॉडल
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-purple-400 font-bold block text-sm">कदम 1: 5 साइबर कैफे से संपर्क</span>
              <p className="text-slate-300">
                स्थानीय साइबर कैफे ऑपरेटर को बताएं कि वे अपने पास फॉर्म भरवाने आने वाले युवाओं को ₹25 में ATS रिज्यूम और ₹10 में NCERT किट दे सकते हैं।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block text-sm">कदम 2: दैनिक 6 रीसेलर बनाना</span>
              <p className="text-slate-300">
                यदि आपके रेफरल से प्रतिदिन केवल 6 सदस्य प्लान 06 (₹500) लेते हैं, तो 6 × ₹350 = ₹2,100 आपकी दैनिक सीधी कमाई होती है।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold block text-sm">कदम 3: 100% तुरंत बैंक ट्रांसफर</span>
              <p className="text-slate-300">
                कमाई का पैसा सीधे आपके बैंक खाते या UPI में तत्काल ट्रांसफर हो जाता है, जिससे नकदी प्रवाह बना रहता है।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: QUIZ */}
      {activeSubTab === 'quiz' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white">
              एजेंसी रीसेलिंग एवं मार्केटिंग क्विज
            </h3>
            {quizSubmitted && (
              <span className="px-3.5 py-1.5 rounded-full font-black text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
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
                      style = 'bg-purple-600/30 border-purple-500 text-purple-200';
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
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg"
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
