import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HeartPulse, 
  Smartphone, 
  PhoneCall, 
  Award, 
  AlertTriangle, 
  Check, 
  Copy, 
  Volume2, 
  Lock, 
  Eye, 
  Zap, 
  Sparkles,
  LifeBuoy
} from 'lucide-react';

export const Plan04FamilySuite: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'cyber' | 'parenting' | 'health' | 'emergency' | 'quiz'>('cyber');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // 1. Cyber fraud prevention guide
  const cyberScams = [
    {
      title: '1. "डिजिटल अरेस्ट" (Digital Arrest) फर्जी पुलिस कॉल',
      modu: 'स्कैमर्स CBI/पुलिस बनकर वीडियो कॉल करते हैं और कहते हैं कि आपके नाम से गैर-कानूनी पार्सल मिला है।',
      prevention: '🚨 कानूनन कोई भी जांच एजेंसी वीडियो कॉल पर "डिजिटल अरेस्ट" नहीं कर सकती। तुरंत फोन काटें और 1930 पर रिपोर्ट करें।'
    },
    {
      title: '2. फर्जी APK फाइल (बिजली बिल / कूरियर डिलीवरी / शादी का कार्ड)',
      modu: 'WhatsApp पर ".apk" नाम की फाइल भेजते हैं जिसे इंस्टॉल करते ही मोबाइल का सारा OTP और बैंक डेटा चोरी हो जाता है।',
      prevention: '❌ कभी भी अनजान WhatsApp नंबर से भेजी गई .APK फाइल डाउनलोड न करें। केवल Google Play Store से ही ऐप इंस्टॉल करें।'
    },
    {
      title: '3. गलत UPI पेमेंट / फर्जी स्क्रीनशॉट',
      modu: 'दुकानदार या व्यक्ति को फर्जी UPI स्क्रीनशॉट दिखाते हैं या कहते हैं "गलती से ₹5,000 चले गए, वापस भेज दो"।',
      prevention: '✅ केवल स्क्रीनशॉट पर भरोसा न करें; हमेशा अपने बैंक SMS या बैंक ऐप में बैलेंस चेक करके ही पुष्टि करें।'
    },
    {
      title: '4. पार्ट-टाइम जॉब / यूट्यूब वीडियो लाइक स्कैम',
      modu: 'टेलीग्राम पर "घर बैठे वीडियो लाइक करें और ₹3,000 कमाएं" का लालच देकर पहले ₹500 देते हैं, फिर लाखों जमा करवा लेते हैं।',
      prevention: '🛑 कोई भी वास्तविक कंपनी पैसा कमाने के लिए आपसे अग्रिम पैसा (Security Deposit) नहीं माँगती।'
    }
  ];

  // 2. Surya Namaskar 12 Steps
  const suryaNamaskarSteps = [
    { step: 1, name: 'प्रणामासन (Pranamasana)', mantra: 'ॐ मित्राय नमः', benefit: 'मन की शांति और तंत्रिका तंत्र का संतुलन' },
    { step: 2, name: 'हस्तउत्तानासन (Hastauttanasana)', mantra: 'ॐ रवये नमः', benefit: 'रीढ़ की हड्डी और फेफड़ों का विस्तार' },
    { step: 3, name: 'पादहस्तासन (Padahastasana)', mantra: 'ॐ सूर्याय नमः', benefit: 'पाचन तंत्र को सक्रिय करना और जांघों को लचीला बनाना' },
    { step: 4, name: 'अश्व संचालानासन (Ashwa Sanchalanasana)', mantra: 'ॐ भानवे नमः', benefit: 'पैरों की मांसपेशियों और रीढ़ को मजबूती' },
    { step: 5, name: 'दंडासन (Dandasana)', mantra: 'ॐ खगाय नमः', benefit: 'कंधे, छाती और कोर मसल्स का सुदृढ़ीकरण' },
    { step: 6, name: 'अष्टांग नमस्कार (Ashtanga Namaskara)', mantra: 'ॐ पूष्णे नमः', benefit: 'हृदय और रीढ़ के सभी जोड़ों का व्यायाम' }
  ];

  // 3. Emergency Directory
  const emergencyNumbers = [
    { title: 'राष्ट्रीय आपातकालीन एकीकृत सेवा', number: '112', purpose: 'पुलिस, फायर, एम्बुलेंस सब एक साथ' },
    { title: 'राष्ट्रीय साइबर अपराध हेल्पलाइन', number: '1930', purpose: 'वित्तीय ऑनलाइन धोखाधड़ी के 2 घंटे में रिपोर्ट' },
    { title: 'राष्ट्रीय एम्बुलेंस सेवा', number: '108', purpose: 'चिकित्सीय आपातकाल एवं दुर्घटना सहायता' },
    { title: 'महिला हेल्पलाइन (Women Helpline)', number: '1090 / 181', purpose: 'महिला सुरक्षा एवं घरेलू हिंसा सुरक्षा' },
    { title: 'चाइल्ड हेल्पलाइन (Childline)', number: '1098', purpose: 'बच्चों की सुरक्षा, गुमशुदगी व बाल श्रम रोकथाम' },
    { title: 'वरिष्ठ नागरिक हेल्पलाइन', number: '14567', purpose: 'बुजुर्गों की चिकित्सा व सुरक्षा सहायता' }
  ];

  // Quiz
  const quizList = [
    {
      q: 'यदि किसी के बैंक खाते से ऑनलाइन फ्रॉड हो जाए, तो तुरंत किस राष्ट्रीय नंबर पर कॉल करना चाहिए?',
      options: ['100', '1930 (Cyber Helpline)', '1098', '139'],
      correct: 1,
      explain: '1930 राष्ट्रीय साइबर वित्तीय धोखाधड़ी हेल्पलाइन है जो 2 घंटे के भीतर बैंक खाते को फ्रीज कर सकती है।'
    },
    {
      q: 'बच्चों के मोबाइल में स्क्रीन समय नियंत्रित करने के लिए Google का कौन-सा आधिकारिक टूल उपलब्ध है?',
      options: ['Google Maps', 'Google Family Link', 'Google Drive', 'Google Pay'],
      correct: 1,
      explain: 'Google Family Link से माता-पिता बच्चों के स्क्रीन समय, ऐप उपयोग और सुरक्षित ब्राउजिंग को नियंत्रित कर सकते हैं।'
    },
    {
      q: 'CPR (Cardiopulmonary Resuscitation) में छाती दबाने (Chest Compressions) की प्रति मिनट दर कितनी होनी चाहिए?',
      options: ['30-40 बार', '100 से 120 बार प्रति मिनट', '200 बार', '10 बार'],
      correct: 1,
      explain: 'आदर्श हैंड्स-ओनली सीपीआर दर 100 से 120 कम्प्रेशन प्रति मिनट होती है।'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/70 via-orange-950/60 to-slate-900 border border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PLAN 04 • ₹100 AUTHORIZED SUITE
              </span>
              <span className="text-xs text-slate-400 font-mono">Family Protection & Wellness</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Family VIP Access: Digital Parenting, Cyber Fraud Shield & Health
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              परिवार के संपूर्ण स्वास्थ्य, बच्चों की डिजिटल सुरक्षा, 1930 साइबर ठगी रोकथाम और आपातकालीन चिकित्सा की व्यापक हैंडबुक।
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">प्लान इंसेंटिव</span>
            <div className="text-2xl font-black text-amber-400 font-mono">₹70.00 / Ref</div>
            <span className="text-[10px] text-emerald-400 font-bold">70% डायरेक्ट पेआउट</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveSubTab('cyber')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'cyber' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>साइबर सुरक्षा व 1930 टूल</span>
        </button>

        <button
          onClick={() => setActiveSubTab('parenting')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'parenting' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>स्मार्ट पेरेंटिंग व स्क्रीन लॉक</span>
        </button>

        <button
          onClick={() => setActiveSubTab('health')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'health' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>पारिवारिक स्वास्थ्य व योग</span>
        </button>

        <button
          onClick={() => setActiveSubTab('emergency')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'emergency' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>आपातकालीन हेल्पलाइन</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'quiz' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>सुरक्षा क्विज</span>
        </button>
      </div>

      {/* SUB-TAB 1: CYBER SAFETY */}
      {activeSubTab === 'cyber' && (
        <div className="space-y-4 animate-in fade-in">
          {/* 1930 Golden Hour Alert */}
          <div className="p-5 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500 text-white">
                गोल्डन आवर नियम (Golden Hour Rule)
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                ऑनलाइन वित्तीय धोखाधड़ी होते ही तुरंत 1930 पर कॉल करें!
              </h3>
              <p className="text-xs text-rose-200">
                धोखाधड़ी के 2 घंटे के भीतर 1930 पर कॉल करने से बैंक तुरंत अपराधी का खाता फ्रीज कर देता है और आपका 100% धन वापस मिल सकता है।
              </p>
            </div>
            <a
              href="tel:1930"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shrink-0 shadow-lg flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>कॉल 1930 (Helpline)</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cyberScams.map((scam, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="font-extrabold text-sm text-amber-400">
                  {scam.title}
                </h4>
                <p className="text-xs text-slate-300">
                  <strong>तरीका:</strong> {scam.modu}
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-emerald-300 font-sans leading-relaxed">
                  {scam.prevention}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DIGITAL PARENTING */}
      {activeSubTab === 'parenting' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 animate-in fade-in">
          <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3">
            📱 बच्चों को मोबाइल की लत से बचाने के 5 व्यावहारिक सूत्र
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold block text-sm">1. Google Family Link सेट करें</span>
              <p className="text-slate-300">
                बच्चे के फोन में दैनिक 1 घंटे की सीमा तय करें। रात 9 बजे के बाद फोन स्वतः लॉक हो जाएगा।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block text-sm">2. नो-स्क्रीन डाइनिंग नियम</span>
              <p className="text-slate-300">
                भोजन करते समय परिवार का कोई भी सदस्य मोबाइल फोन न छुए। आमने-सामने बातचीत की संस्कृति बनाएं।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-blue-400 font-bold block text-sm">3. 10 रचनात्मक विकल्प</span>
              <p className="text-slate-300">
                चित्रकला, मिट्टी के खिलौने, कैरम, शतरंज और कहानियों की पुस्तकें पढ़ने के लिए प्रेरित करें।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: HEALTH & SURYA NAMASKAR */}
      {activeSubTab === 'health' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">
              🧘 12 सूर्य नमस्कार चरण (मंत्र एवं स्वास्थ्य लाभ)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold">
              Ayurveda & Yoga
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {suryaNamaskarSteps.map((s) => (
              <div key={s.step} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                    {s.step}
                  </span>
                  <span className="font-mono text-emerald-400 text-[11px] font-bold">{s.mantra}</span>
                </div>
                <strong className="text-white block font-sans text-sm">{s.name}</strong>
                <p className="text-slate-400 text-[11px]">{s.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: EMERGENCY HELPLINES */}
      {activeSubTab === 'emergency' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {emergencyNumbers.map((em, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 block">{em.purpose}</span>
                  <h4 className="font-extrabold text-white text-sm">{em.title}</h4>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-2xl font-black text-rose-400 font-mono">{em.number}</span>
                  <a
                    href={`tel:${em.number}`}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>कॉल करें</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: QUIZ */}
      {activeSubTab === 'quiz' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white">
              पारिवारिक सुरक्षा एवं साइबर जागरूकता क्विज
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
                      style = 'bg-amber-600/30 border-amber-500 text-amber-200';
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
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-lg"
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
