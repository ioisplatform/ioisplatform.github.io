import React, { useState } from 'react';
import { PageType } from '../types';
import { 
  GraduationCap, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Briefcase, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  UserCheck, 
  ShieldCheck, 
  Search,
  MessageSquare,
  FileCheck
} from 'lucide-react';

interface InterviewPreparationSectionProps {
  onNavigate: (page: PageType) => void;
  onOpenAiChat?: () => void;
}

type InterviewCategory = 'hr' | 'govt' | 'digital' | 'banking' | 'tips';

interface QuestionItem {
  id: string;
  question: string;
  category: InterviewCategory;
  importance: 'उच्च (Most Asked)' | 'महत्वपूर्ण (Key)' | 'विशेष (Pro Tip)';
  answerHindi: string;
  englishTranslation?: string;
  goldenTip: string;
}

export const InterviewPreparationSection: React.FC<InterviewPreparationSectionProps> = ({
  onNavigate,
  onOpenAiChat,
}) => {
  const [activeTab, setActiveTab] = useState<InterviewCategory>('hr');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('q-hr-1');

  const questions: QuestionItem[] = [
    // 1. Common HR / Fresher Questions
    {
      id: 'q-hr-1',
      category: 'hr',
      question: '1. अपने बारे में बताइए? (Tell me about yourself)',
      importance: 'उच्च (Most Asked)',
      answerHindi: 'नमस्ते सर/मैडम, मेरा नाम [आपका नाम] है। मैं [शहर का नाम] का रहने वाला हूँ। मैंने [अपनी डिग्री/शिक्षा] पूरी की है। मुझे नई डिजिटल स्किल्स सीखने, टीम के साथ काम करने और समस्याओं का प्रभावी समाधान निकालने में गहरी रुचि है। मैंने हाल ही में [अपनी प्रमुख स्किल/प्रोजेक्ट] पर काम किया है। मैं इस अवसर के लिए बहुत उत्साहित हूँ क्योंकि मेरी क्षमताएं इस पद की आवश्यकताओं से मेल खाती हैं।',
      englishTranslation: 'Hello Sir/Madam, My name is [Your Name]. I am from [City]. I have completed [Your Degree/Qualification]. I have a strong passion for learning new digital skills, collaborating with teams, and solving practical problems. I look forward to contributing positively to your organization.',
      goldenTip: 'उत्तर 60 से 90 सेकंड का रखें। व्यक्तिगत पारिवारिक जानकारी से ज्यादा अपनी शिक्षा, अनुभव और योग्यताओं पर जोर दें।',
    },
    {
      id: 'q-hr-2',
      category: 'hr',
      question: '2. आपकी सबसे बड़ी ताकत (Strength) और कमजोरी (Weakness) क्या है?',
      importance: 'उच्च (Most Asked)',
      answerHindi: 'मेरी ताकत: मैं किसी भी नए काम को तुरंत सीखने, समय पर काम पूरा करने (Time Management) और विपरीत परिस्थितियों में भी सकारात्मक सोच बनाए रखने में सक्षम हूँ।\nमेरी कमजोरी: कभी-कभी जब तक काम बिल्कुल परफेक्ट न हो जाए, मुझे संतुष्टि नहीं मिलती। हालांकि अब मैं समय सीमा को प्राथमिकता देकर संतुलन बनाना सीख रहा हूँ।',
      englishTranslation: 'Strength: Quick learner, punctual, and adaptable under pressure.\nWeakness: Tendency towards perfectionism, but actively working on time-balancing.',
      goldenTip: 'कमजोरी ऐसी बताएं जो वास्तविक हो लेकिन जिसे आप सुधारने का प्रयास कर रहे हों (Positive twist)।',
    },
    {
      id: 'q-hr-3',
      category: 'hr',
      question: '3. हम आपको ही इस नौकरी के लिए क्यों चुनें? (Why should we hire you?)',
      importance: 'उच्च (Most Asked)',
      answerHindi: 'सर, इस पद के लिए आवश्यक स्किल्स जैसे लगन, समयबद्धता और निरंतर सीखने की भूख मेरे अंदर पूरी तरह है। मैं न केवल इस पद की जिम्मेदारियों को ईमानदारी से निभाऊंगा, बल्कि अपनी मेहनत और नवाचार से संगठन के लक्ष्यों को तेजी से हासिल करने में पूरा योगदान दूंगा।',
      englishTranslation: 'I possess the required skills, high dedication, and a growth mindset aligned with your company goals.',
      goldenTip: 'कंपनी की आवश्यकताओं को अपनी क्षमताओं से जोड़कर बताएं।',
    },
    {
      id: 'q-hr-4',
      category: 'hr',
      question: '4. अगले 5 वर्षों में आप खुद को कहाँ देखते हैं? (Where do you see yourself in 5 years?)',
      importance: 'महत्वपूर्ण (Key)',
      answerHindi: 'अगले 5 वर्षों में मैं अपनी कार्यकुशलता और नेतृत्व क्षमता को विकसित करके संगठन में एक जिम्मेदार और भरोसेमंद पद पर पहुंचना चाहता हूँ, जहाँ मैं नए सहयोगियों का मार्गदर्शन कर सकूँ और बड़े प्रोजेक्ट्स का नेतृत्व कर सकूँ।',
      goldenTip: 'यह दिखाता है कि आप लंबे समय तक टिकने वाले और विकासोन्मुख व्यक्ति हैं।',
    },

    // 2. Govt & Competitive Exam Interview Questions
    {
      id: 'q-govt-1',
      category: 'govt',
      question: '1. आप सरकारी सेवा में क्यों आना चाहते हैं? (Why Govt Service / Administration?)',
      importance: 'उच्च (Most Asked)',
      answerHindi: 'सरकारी सेवा समाज के अंतिम पंक्ति के व्यक्ति तक सीधे नीतिगत लाभ पहुंचाने और सकारात्मक सामाजिक परिवर्तन लाने का सबसे सशक्त माध्यम है। यहाँ मिलने वाला कार्य-दायरा, जनता की सेवा का अवसर और देश के विकास में सीधा योगदान मुझे पूरी निष्ठा से काम करने की प्रेरणा देता है।',
      goldenTip: 'वेतन या सुरक्षा से ज्यादा \'जनसेवा\' और \'नीति कार्यान्वयन\' पर फोकस करें।',
    },
    {
      id: 'q-govt-2',
      category: 'govt',
      question: '2. अगर आपको अपने गृह जिले या विपरीत परिस्थितियों वाले क्षेत्र में पोस्टिंग मिले तो कैसे संभालेंगे?',
      importance: 'महत्वपूर्ण (Key)',
      answerHindi: 'प्रशासनिक दायित्व में क्षेत्र कोई बाधा नहीं है। यदि गृह क्षेत्र मिला तो स्थानीय समस्याओं की गहरी समझ होने के कारण तुरंत समाधान निकाल सकूंगा, और यदि नया या चुनौतीपूर्ण क्षेत्र मिला तो वहाँ की प्राथमिकताओं को समझकर निष्पक्ष व पारदर्शी तरीके से काम करूंगा।',
      goldenTip: 'हर परिस्थिति के लिए अपनी अनुकूलन क्षमता (Adaptability) को रेखांकित करें।',
    },
    {
      id: 'q-govt-3',
      category: 'govt',
      question: '3. भारत की प्रशासनिक व्यवस्था में डिजिटल गवर्नेंस (RTPS, DBT, e-Office) की क्या भूमिका है?',
      importance: 'उच्च (Most Asked)',
      answerHindi: 'डिजिटल गवर्नेंस ने बिचौलियों को खत्म कर 100% पारदर्शिता स्थापित की है। प्रत्यक्ष लाभ अंतरण (DBT) से पैसा सीधे लाभार्थी के खाते में जाता है, और RTPS पोर्टल से जाति, आय, निवास व दाखिल-खारिज जैसी सेवाएं समयबद्ध सीमा के अंदर नागरिकों को घर बैठे मिल रही हैं।',
      goldenTip: 'सरकारी योजनाओं (जैसे DBT, RTPS, डिजिटल इंडिया) के वास्तविक उदाहरण दें।',
    },

    // 3. Digital Skills & WFH Interview Questions
    {
      id: 'q-digital-1',
      category: 'digital',
      question: '1. डिजिटल मार्केटिंग व सोशल मीडिया रेफरल में लीड कैसे जनरेट करते हैं?',
      importance: 'उच्च (Most Asked)',
      answerHindi: 'सटीक ऑडियंस की पहचान करके, उन्हें मूल्यवान व प्रामाणिक जानकारी (Value Content) प्रदान करके और उनकी समस्याओं का सीधा समाधान दिखाकर। सोशल मीडिया (WhatsApp, YouTube, Telegram) पर विश्वास और पारदर्शिता बनाकर अधिक से अधिक सक्रिय सदस्य जोड़े जा सकते हैं।',
      goldenTip: 'विश्वास और सत्यता को हमेशा डिजिटल प्रमोशन का आधार बताएं।',
    },
    {
      id: 'q-digital-2',
      category: 'digital',
      question: '2. वर्क-फ्रॉम-होम (WFH) में समय प्रबंधन (Time Management) कैसे बनाए रखते हैं?',
      importance: 'महत्वपूर्ण (Key)',
      answerHindi: 'दैनिक टू-डू लिस्ट (To-Do List) बनाकर, काम के निश्चित घंटे निर्धारित करके और ध्यान भटकाने वाली चीजों से दूर रहकर। नियमित प्रगति रिपोर्टिंग और लक्ष्य आधारित कार्य शैली से शत-प्रतिशत उत्पादकता सुनिश्चित होती है।',
      goldenTip: 'अनुशासन और डिजिटल टूल्स के उपयोग का उल्लेख करें।',
    },

    // 4. Banking & Corporate Questions
    {
      id: 'q-bank-1',
      category: 'banking',
      question: '1. किसी असंतुष्ट या नाराज ग्राहक (Angry Customer) को आप कैसे शांत करेंगे?',
      importance: 'उच्च (Most Asked)',
      answerHindi: 'सबसे पहले धैर्यपूर्वक और बिना टोके ग्राहक की पूरी बात सुनूंगा ताकि वे सम्मानित महसूस करें। फिर समस्या को समझकर तुरंत उचित समाधान या समय सीमा बताऊंगा और अंत में यह सुनिश्चित करूंगा कि उनकी समस्या का पूर्ण निवारण हुआ।',
      goldenTip: 'सहानुभूति (Empathy) और सक्रिय श्रवण (Active Listening) सबसे बड़ा गुण है।',
    },
    {
      id: 'q-bank-2',
      category: 'banking',
      question: '2. बैंकिंग व वित्तीय क्षेत्र में KYC और वित्तीय धोखाधड़ी से बचाव के क्या नियम हैं?',
      importance: 'महत्वपूर्ण (Key)',
      answerHindi: 'KYC (Know Your Customer) ग्राहक की वास्तविक पहचान सुनिश्चित करता है। धोखाधड़ी से बचाव के लिए OTP/पिन कभी साझा न करना, संदिग्ध लेनदेन की तुरंत रिपोर्टिंग और 2-फैक्टर ऑथेंटिकेशन का पालन अनिवार्य है।',
      goldenTip: 'सुरक्षा और गोपनीयता की अहमियत बताएं।',
    },

    // 5. Golden Interview Tips
    {
      id: 'q-tips-1',
      category: 'tips',
      question: '⭐ इंटरव्यू में सफल होने के 10 गोल्डन नियम (10 Golden Interview Rules)',
      importance: 'विशेष (Pro Tip)',
      answerHindi: `1. **आत्मविश्वास व मुस्कान:** कमरे में प्रवेश करते समय चेहरे पर विनम्र मुस्कान और सकारात्मक ऊर्जा रखें।\n2. **आई कॉन्टैक्ट (Eye Contact):** सभी इंटरव्यूअर्स के साथ सौम्य नजरें मिलाकर बात करें।\n3. **बॉडी लैंग्वेज:** सीधी मुद्रा में बैठें, हाथ मेज पर स्थिर रखें, पैर न हिलाएं।\n4. **स्पष्ट व सहज आवाज:** न ज्यादा धीमे बोलें और न ही चिल्लाकर। हर शब्द स्पष्ट होना चाहिए।\n5. **ईमानदारी:** जिस सवाल का उत्तर न आता हो, विनम्रता से कहें "क्षमा करें सर, मुझे इस विषय की अभी पूरी जानकारी नहीं है, मैं इसे अवश्य पढूंगा।" कभी झूठा तुक्का न लगाएं।\n6. **ड्रेस कोड:** साफ-सुथरे फॉर्मल कपड़े और फॉर्मल जूते पहनें।\n7. **रिज्यूमे की पूर्ण जानकारी:** अपने बायोडाटा में लिखी हर एक लाइन का कारण और विवरण आपको याद होना चाहिए।\n8. **कंपनी/संस्थान पर रिसर्च:** जाने से पहले संस्थान के काम और विजन की जानकारी अवश्य पढ़कर जाएं।\n9. **धैर्य:** इंटरव्यूअर की बात पूरी होने से पहले कभी बीच में न काटें।\n10. **धन्यवाद:** इंटरव्यू समाप्त होने पर सभी को धन्यवाद कहें।`,
      goldenTip: 'तैयारी ही सफलता की कुंजी है। दर्पण के सामने 3 बार अभ्यास करें।',
    },
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchesTab = activeTab === 'tips' ? q.category === 'tips' : q.category === activeTab;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesTab;
    return (
      q.question.toLowerCase().includes(query) ||
      q.answerHindi.toLowerCase().includes(query) ||
      q.goldenTip.toLowerCase().includes(query)
    );
  });

  return (
    <section id="interview-preparation-hub" className="space-y-8 bg-slate-900/60 border border-amber-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>IOIS INTERVIEW & CAREER PREPARATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            🎯 साक्षात्कार प्रश्नोत्तरी व सफलता गाइड (Interview Q&A)
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            नौकरी, सरकारी परीक्षा, बैंकिंग और डिजिटल करियर के लिए सबसे ज्यादा पूछे जाने वाले मॉडल प्रश्न, आदर्श उत्तर व 10 गोल्डन टिप्स।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('assessment')}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg"
          >
            <FileCheck className="w-4 h-4" />
            <span>15-सवाल असेसमेंट टेस्ट दें →</span>
          </button>
        </div>
      </div>

      {/* Search and Category Tabs */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="इंटरव्यू सवाल सर्च करें (उदा. Strengths, Weakness, Tell me)..."
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => { setActiveTab('hr'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'hr'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>HR व फ्रेशर्स प्रश्न (Common HR)</span>
          </button>

          <button
            onClick={() => { setActiveTab('govt'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'govt'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>सरकारी व प्रशासनिक परीक्षा (Govt/UPSC)</span>
          </button>

          <button
            onClick={() => { setActiveTab('digital'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'digital'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>डिजिटल स्किल व WFH (Digital/Online)</span>
          </button>

          <button
            onClick={() => { setActiveTab('banking'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'banking'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>बैंकिंग व कॉर्पोरेट (Banking/Client)</span>
          </button>

          <button
            onClick={() => { setActiveTab('tips'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'tips'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>10 गोल्डन टिप्स (10 Golden Rules)</span>
          </button>
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedId === q.id;
          return (
            <div
              key={q.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-950 border-amber-400/50 shadow-xl ring-1 ring-amber-400/20'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Question Click Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {q.importance}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                    {q.question}
                  </h3>
                </div>

                <div className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Answer Content */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                  {/* Hindi Answer */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="text-[11px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>आदर्श उत्तर (Best Recommended Hindi Answer):</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {q.answerHindi}
                    </p>
                  </div>

                  {/* English Translation if available */}
                  {q.englishTranslation && (
                    <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        English Expression Summary:
                      </div>
                      <p className="text-xs text-slate-300 italic">
                        "{q.englishTranslation}"
                      </p>
                    </div>
                  )}

                  {/* Golden Interview Tip */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-black text-amber-300 block">इंटरव्यू में ध्यान रखने योग्य गोल्डन टिप:</span>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {q.goldenTip}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ask AI Footer Assistance */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-black text-white">
            💡 किसी विशेष नौकरी या पद के लिए इंटरव्यू प्रश्न पूछना चाहते हैं?
          </h4>
          <p className="text-xs text-slate-300">
            हमारा 24x7 AI असिस्टेंट आपके बायोडाटा व लक्ष्य के अनुसार व्यक्तिगत इंटरव्यू अभ्यास कराता है।
          </p>
        </div>

        <button
          onClick={onOpenAiChat}
          className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-850 border border-amber-400 text-amber-300 text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 shadow-md"
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>AI से लाइव मॉक इंटरव्यू शुरू करें</span>
        </button>
      </div>
    </section>
  );
};
