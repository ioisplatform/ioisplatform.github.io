import React, { useState } from 'react';
import { 
  BookOpen, 
  Compass, 
  MessageSquare, 
  Award, 
  Copy, 
  Check, 
  Volume2, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  GraduationCap,
  Layers,
  ArrowRight,
  Flame
} from 'lucide-react';
import { CompetitionReadyPracticeZone } from '../CompetitionReadyPracticeZone';

export const Plan03CareerSuite: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ncert' | 'careerPaths' | 'softSkills' | 'boardStrategy' | 'quiz' | 'competition'>('ncert');
  const [selectedSubject, setSelectedSubject] = useState<'science' | 'math' | 'social' | 'english'>('science');
  const [selectedStream, setSelectedStream] = useState<'science' | 'commerce' | 'arts' | 'defense'>('science');
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

  // NCERT Class 6-12 Subject summaries
  const subjectNotes = {
    science: [
      {
        topic: '1. प्रकाश - परावर्तन तथा अपवर्तन (Light - Reflection & Refraction)',
        cls: 'Class 10 Physics',
        points: [
          'दर्पण सूत्र (Mirror Formula): 1/f = 1/v + 1/u (जहाँ f = फोकस दूरी, v = प्रतिबिम्ब दूरी, u = वस्तु दूरी)',
          'लेंस सूत्र (Lens Formula): 1/f = 1/v - 1/u',
          'स्नेल का नियम (Snell\'s Law): sin(i) / sin(r) = n (अपवर्तनांक / Refractive Index)',
          'आवर्धन (Magnification): m = -v/u (दर्पण हेतु) और m = v/u (लेंस हेतु)'
        ]
      },
      {
        topic: '2. रासायनिक अभिक्रियाएँ एवं समीकरण (Chemical Reactions)',
        cls: 'Class 10 Chemistry',
        points: [
          'संयोजन अभिक्रिया (Combination): 2Mg + O₂ → 2MgO (मैग्नीशियम रिबन का दहन)',
          'अपघटन अभिक्रिया (Decomposition): 2FeSO₄ → Fe₂O₃ + SO₂ + SO₃ (ऊष्मा द्वारा विघटन)',
          'विस्थापन अभिक्रिया (Displacement): Fe + CuSO₄ → FeSO₄ + Cu (लोहा तांबे को विस्थापित करता है)',
          'ऑक्सीकरण एवं अपचयन (Redox): जिस पदार्थ में ऑक्सीजन की वृद्धि हो वह ऑक्सीकृत होता है।'
        ]
      },
      {
        topic: '3. जैव प्रक्रम: श्वसन, पोषण व परिसंचरण (Life Processes)',
        cls: 'Class 10 Biology',
        points: [
          'प्रकाश संश्लेषण समीकरण: 6CO₂ + 12H₂O + सूर्य का प्रकाश + क्लोरोफिल → C₆H₁₂O₆ + 6O₂ + 6H₂O',
          'मानव हृदय: 4 कोष्ठक (2 अलिंद + 2 निलय)। महाधमनी शुद्ध रक्त पूरे शरीर में ले जाती है।',
          'वृक्क (Kidney): उत्सर्जन इकाई नेफ्रॉन (Nephron) होती है जो रक्त से यूरिया को छानती है।'
        ]
      }
    ],
    math: [
      {
        topic: '1. द्विघात समीकरण एवं विविक्तकर (Quadratic Equations)',
        cls: 'Class 10 Mathematics',
        points: [
          'मानक रूप: ax² + bx + c = 0 (जहाँ a ≠ 0)',
          'श्रीधराचार्य सूत्र: x = [-b ± √(b² - 4ac)] / (2a)',
          'विविक्तकर (Discriminant D = b² - 4ac): यदि D > 0 तो दो भिन्न वास्तविक मूल, D = 0 तो दो बराबर मूल, D < 0 तो कोई वास्तविक मूल नहीं।'
        ]
      },
      {
        topic: '2. त्रिकोणमिति के सर्वसमिकाएं (Trigonometry Identities)',
        cls: 'Class 10 & 11 Math',
        points: [
          'मूलभूत सूत्र: sin²θ + cos²θ = 1',
          '1 + tan²θ = sec²θ एवं 1 + cot²θ = cosec²θ',
          'मान: sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1, sin 90° = 1'
        ]
      }
    ],
    social: [
      {
        topic: '1. भारत में राष्ट्रवाद का उदय (Rise of Indian Nationalism)',
        cls: 'Class 10 History',
        points: [
          '1915: महात्मा गांधी का दक्षिण अफ्रीका से भारत आगमन।',
          '1919: रौलेट एक्ट एवं 13 अप्रैल 1919 का जलियांवाला बाग हत्याकांड।',
          '1920-22: असहयोग आंदोलन (चौरी-चौरा घटना के बाद वापस लिया गया)।',
          '1930: दांडी मार्च एवं सविनय अवज्ञा आंदोलन (नमक सत्याग्रह)।',
          '1942: भारत छोड़ो आंदोलन (करो या मरो का नारा)।'
        ]
      },
      {
        topic: '2. भारतीय संविधान एवं लोकतंत्र (Constitution & Rights)',
        cls: 'Class 9-10 Civics',
        points: [
          'संविधान सभा के अध्यक्ष: डॉ. राजेंद्र प्रसाद | प्रारूप समिति अध्यक्ष: डॉ. भीमराव आंबेडकर।',
          'संविधान लागू: 26 जनवरी 1950 (गणतंत्र दिवस)। कुल समय: 2 वर्ष 11 माह 18 दिन।',
          '6 मौलिक अधिकार: समानता, स्वतंत्रता, शोषण के विरुद्ध, धार्मिक स्वतंत्रता, संस्कृति व शिक्षा, संवैधानिक उपचार (अनुच्छेद 32)।'
        ]
      }
    ],
    english: [
      {
        topic: 'Active & Passive Voice + Direct & Indirect Speech',
        cls: 'Class 9-12 English Grammar',
        points: [
          'Active: "He writes a letter." → Passive: "A letter is written by him."',
          'Active: "She cooked food." → Passive: "Food was cooked by her."',
          'Direct: He said, "I am busy today." → Indirect: He said that he was busy that day.',
          'Rule: Universal Truths never change tense (Teacher said, "The earth revolves around the sun").'
        ]
      }
    ]
  };

  // Career roadmaps
  const careerRoadmaps = {
    science: {
      title: 'Science Stream (PCM & PCB) Future Scope',
      branches: [
        {
          name: '1. Engineering (PCM): JEE Main & Advanced',
          roles: 'Software Engineer, Data Scientist, Civil/Mechanical Engineer, Aerospace',
          exams: 'JEE Main, BITSAT, State Engineering CETs',
          package: '₹6 LPA to ₹25+ LPA'
        },
        {
          name: '2. Medical & Health Sciences (PCB): NEET-UG',
          roles: 'MBBS Doctor, BDS Dentist, BAMS/BHMS, Pharmacy (B.Pharm), Nursing',
          exams: 'NEET-UG, AIIMS Nursing',
          package: '₹8 LPA to ₹30+ LPA'
        },
        {
          name: '3. Pure Sciences & Research (B.Sc / M.Sc)',
          roles: 'ISRO / DRDO Scientist, Professor, Food Technologist, Bio-technologist',
          exams: 'IISER Aptitude Test, CUET-UG, JAM',
          package: '₹5 LPA to ₹18 LPA'
        }
      ]
    },
    commerce: {
      title: 'Commerce & Business Stream (With/Without Math)',
      branches: [
        {
          name: '1. Chartered Accountancy (CA) & Company Secretary (CS)',
          roles: 'Auditor, Tax Consultant, Chief Financial Officer (CFO), Corporate Advisor',
          exams: 'ICAI CA Foundation, ICSI CS Executive',
          package: '₹9 LPA to ₹35+ LPA'
        },
        {
          name: '2. Banking, Finance & Investment (B.Com / BBA / IPMAT)',
          roles: 'Investment Banker, Equity Analyst, Bank PO (IBPS/SBI), Risk Manager',
          exams: 'IIM Indore IPMAT, CUET-UG (SRCC/DU), IBPS PO',
          package: '₹6 LPA to ₹22 LPA'
        }
      ]
    },
    arts: {
      title: 'Arts & Humanities Stream',
      branches: [
        {
          name: '1. Civil Services & Public Administration (UPSC CSE)',
          roles: 'IAS, IPS, IFS, State PCS Officers, Policy Analysts',
          exams: 'UPSC Civil Services Examination (Preliminary + Mains + Interview)',
          package: 'Govt. Grade-A Pay Scale + Perks & National Pride'
        },
        {
          name: '2. Law & Judiciary (CLAT / AILET)',
          roles: 'Corporate Lawyer, High Court Advocate, Legal Advisor, Judicial Magistrate',
          exams: 'CLAT (Common Law Admission Test for National Law Universities)',
          package: '₹7 LPA to ₹24+ LPA'
        }
      ]
    },
    defense: {
      title: 'Defense Forces & Uniform Services',
      branches: [
        {
          name: '1. National Defence Academy (NDA)',
          roles: 'Lieutenant in Indian Army, Flying Officer in Air Force, Sub-Lieutenant in Navy',
          exams: 'NDA & NA Exam conducted by UPSC (After 12th, Age: 16.5 - 19.5)',
          package: 'Prestige, ₹56,100 starting basic + MSP + National Honor'
        },
        {
          name: '2. Technical Entry Scheme (TES) & Agniveer',
          roles: 'Indian Army Technical Corps, Agniveer Scheme entries',
          exams: 'Army TES (Direct 12th PCM 60%+), Agniveer Bharti',
          package: 'Permanent Commission / Seva Nidhi Package'
        }
      ]
    }
  };

  // Spoken English & Soft Skills
  const softSkillsModules = [
    {
      day: 'Day 1-5: दैनिक अभिवादन एवं आत्मपरिचय',
      hindi: 'दूसरों से मिलते समय आत्मविश्वास के साथ बोलना',
      sentences: [
        { eng: 'Good morning, how are you doing today?', hin: 'नमस्ते, आज आप कैसे हैं?' },
        { eng: 'It is a pleasure to meet you.', hin: 'आपसे मिलकर बहुत प्रसन्नता हुई।' },
        { eng: 'Could you please repeat that? I didn\'t catch it.', hin: 'क्या आप कृपया दोबारा दोहरा सकते हैं?' }
      ]
    },
    {
      day: 'Day 6-10: किसी से सहायता माँगना एवं धन्यवाद देना',
      hindi: 'शिष्टाचार और विनम्रता से बात करना',
      sentences: [
        { eng: 'Could you please lend me a hand with this?', hin: 'क्या आप इसमें मेरी थोड़ी मदद कर सकते हैं?' },
        { eng: 'I really appreciate your timely help.', hin: 'आपके समय पर की गई मदद की मैं बहुत कद्र करता हूँ।' },
        { eng: 'Excuse me, could you tell me the way to the station?', hin: 'माफ कीजिए, क्या आप मुझे स्टेशन का रास्ता बता सकते हैं?' }
      ]
    }
  ];

  // Quiz questions
  const quizList = [
    {
      q: 'उत्तल लेंस (Convex Lens) की फोकस दूरी (f) हमेशा किस चिह्न की होती है?',
      options: ['ऋणात्मक (Negative)', 'धनात्मक (Positive)', 'शून्य (Zero)', 'अनंत (Infinite)'],
      correct: 1,
      explain: 'उत्तल लेंस की फोकस दूरी हमेशा धनात्मक (+) ली जाती है।'
    },
    {
      q: 'NDA (National Defence Academy) परीक्षा किस संस्था द्वारा आयोजित की जाती है?',
      options: ['CBSE', 'UPSC', 'NTA', 'SSC'],
      correct: 1,
      explain: 'NDA परीक्षा का आयोजन संघ लोक सेवा आयोग (UPSC) द्वारा वर्ष में दो बार किया जाता है।'
    },
    {
      q: 'भारतीय संविधान में प्रारूप समिति (Drafting Committee) के अध्यक्ष कौन थे?',
      options: ['महात्मा गांधी', 'डॉ. भीमराव आंबेडकर', 'पंडित जवाहरलाल नेहरू', 'सरदार वल्लभभाई पटेल'],
      correct: 1,
      explain: 'डॉ. भीमराव आंबेडकर संविधान प्रारूप समिति के अध्यक्ष थे।'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-teal-950/60 to-slate-900 border border-emerald-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PLAN 03 • ₹50 AUTHORIZED SUITE
              </span>
              <span className="text-xs text-slate-400 font-mono">Class 6-12 & Career Kit</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Career & Job Access: Class 6-12 NCERT, Career Roadmaps & Soft Skills
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              कक्षा 6 से 12 तक के विद्यार्थियों एवं अभिभावकों के लिए सम्पूर्ण शैक्षणिक किट। विज्ञान, गणित, बोर्ड परीक्षा ट्रिक्स और 10वीं-12वीं बाद करियर रोडमैप।
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">प्लान इंसेंटिव</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">₹35.00 / Ref</div>
            <span className="text-[10px] text-emerald-400 font-bold">70% डायरेक्ट पेआउट</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveSubTab('ncert')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'ncert' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Class 6-12 NCERT नोट्स</span>
        </button>

        <button
          onClick={() => setActiveSubTab('careerPaths')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'careerPaths' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>10वीं/12वीं बाद करियर रोडमैप</span>
        </button>

        <button
          onClick={() => setActiveSubTab('softSkills')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'softSkills' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>अंग्रेजी बोलना व सॉफ्ट स्किल्स</span>
        </button>

        <button
          onClick={() => setActiveSubTab('boardStrategy')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'boardStrategy' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>बोर्ड परीक्षा 90%+ रणनीति</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'quiz' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>अकादमिक टेस्ट</span>
        </button>

        <button
          onClick={() => setActiveSubTab('competition')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black transition-all ${
            activeSubTab === 'competition'
              ? 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white shadow-lg ring-2 ring-orange-400/40'
              : 'text-amber-400 hover:text-white hover:bg-slate-900 border border-amber-500/30'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
          <span>🎯 Competition Ready (NEET/JEE 7-12)</span>
        </button>
      </div>

      {/* SUB-TAB 1: NCERT 6-12 QUICK NOTES */}
      {activeSubTab === 'ncert' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Quick Competition Callout Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-950 to-indigo-950 border border-orange-500/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-orange-600/30 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 fill-orange-400 animate-pulse" />
              </span>
              <div>
                <strong className="text-white font-black block text-sm">कक्षा 7 से 12 NEET & JEE Mains रैंडमाइज्ड मॉक प्रैक्टिस</strong>
                <span className="text-slate-300">हर बार नया प्रश्न पत्र, NTA मार्किंग (+4 / -1), टाइमर व लाइन-दर-लाइन NCERT सच।</span>
              </div>
            </div>
            <button
              onClick={() => setActiveSubTab('competition')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black shadow flex items-center gap-1.5 transition-all"
            >
              <span>🎯 Competition Ready खोलें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
            {(['science', 'math', 'social', 'english'] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 rounded-xl font-bold capitalize transition-all ${
                  selectedSubject === sub 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                {sub === 'science' ? '🔬 विज्ञान (Science)' : sub === 'math' ? '📐 गणित (Mathematics)' : sub === 'social' ? '🌍 सामाजिक विज्ञान (SST)' : '📖 अंग्रेजी व्याकरण'}
              </button>
            ))}
          </div>

          {/* Notes display */}
          <div className="space-y-3">
            {subjectNotes[selectedSubject].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    {item.topic}
                  </h4>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    {item.cls}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  {item.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                      <p className="leading-relaxed font-mono">{pt}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => copyToClipboard(item.points.join('\n'), `note-${idx}`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1"
                  >
                    {copiedId === `note-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === `note-${idx}` ? 'कॉपी हुआ!' : 'नोट्स कॉपी करें'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CAREER ROADMAPS */}
      {activeSubTab === 'careerPaths' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Stream Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {(['science', 'commerce', 'arts', 'defense'] as const).map((stream) => (
              <button
                key={stream}
                onClick={() => setSelectedStream(stream)}
                className={`p-3 rounded-2xl border text-left font-bold transition-all ${
                  selectedStream === stream 
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="block text-sm text-white capitalize">{stream === 'science' ? '🔬 साइंस (PCM/PCB)' : stream === 'commerce' ? '📊 कॉमर्स व बैंकिंग' : stream === 'arts' ? '🏛️ आर्ट्स व सिविल सेवा' : '🎖️ डिफेन्स व वर्दी सेवा'}</span>
                <span className="text-[10px] text-slate-400 mt-1 block">रोडमैप व प्रवेश परीक्षा</span>
              </button>
            ))}
          </div>

          {/* Stream details */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
            <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3">
              {careerRoadmaps[selectedStream].title}
            </h3>

            <div className="space-y-4">
              {careerRoadmaps[selectedStream].branches.map((b, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="font-extrabold text-sm text-emerald-400">
                    {b.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-950 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">लक्ष्य पद (Roles):</span>
                      <strong className="text-slate-200">{b.roles}</strong>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">प्रवेश परीक्षा (Exams):</span>
                      <strong className="text-amber-400">{b.exams}</strong>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">संभावित सैलरी / पे-स्केल:</span>
                      <strong className="text-emerald-400">{b.package}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SOFT SKILLS & ENGLISH FLUENCY */}
      {activeSubTab === 'softSkills' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">
              🗣️ 30-Day Spoken English Daily Practice Cards (हिंदी से अंग्रेजी बोलना सीखें)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
              Daily Practice
            </span>
          </div>

          <div className="space-y-3">
            {softSkillsModules.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="border-b border-slate-800/80 pb-2">
                  <h4 className="font-extrabold text-sm text-white">{m.day}</h4>
                  <p className="text-xs text-slate-400">{m.hindi}</p>
                </div>

                <div className="space-y-2">
                  {m.sentences.map((s, sIdx) => (
                    <div key={sIdx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <strong className="text-white block font-sans text-sm">{s.eng}</strong>
                        <span className="text-slate-400 text-xs mt-0.5 block">{s.hin}</span>
                      </div>
                      <button
                        onClick={() => speakText(s.eng)}
                        className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 shrink-0"
                        title="उच्चारण सुनें"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: BOARD EXAM STRATEGY */}
      {activeSubTab === 'boardStrategy' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 animate-in fade-in">
          <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3">
            🎯 बोर्ड परीक्षा 90%+ अंक स्कोरिंग फॉर्मूला व 3 घंटे टाइम-मैनेजमेंट
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold block text-sm">1. प्रथम 15 मिनट (पठन काल)</span>
              <p className="text-slate-300">
                पूरा प्रश्नपत्र ध्यान से पढ़ें। जिन प्रश्नों के उत्तर सबसे सटीक याद हैं, उन पर पेंसिल से टिक करें। कभी भी कठिन प्रश्न से पेपर शुरू न करें।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block text-sm">2. 2 घंटे 30 मिनट (उत्तर लेखन)</span>
              <p className="text-slate-300">
                स्पष्ट हस्तलेखन, मुख्य शब्दों (Keywords) को अंडरलाइन करें और विज्ञान में चित्र व गणित में फॉर्मूला बॉक्स जरूर बनाएं।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-blue-400 font-bold block text-sm">3. अंतिम 15 मिनट (रिवीजन काल)</span>
              <p className="text-slate-300">
                प्रत्येक उत्तर की प्रश्न संख्या जांचें। गणित में गणना की री-चेकिंग और रोल नंबर सुनिश्चित करें।
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
              कक्षा 6-12 अकादमिक एवं सामान्य ज्ञान टेस्ट
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
                      style = 'bg-emerald-600/30 border-emerald-500 text-emerald-200';
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
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg"
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

      {/* SUB-TAB 6: 🎯 COMPETITION READY (CLASSES 7-12 NEET/JEE PRACTICE ZONE) */}
      {activeSubTab === 'competition' && (
        <div className="space-y-4 animate-in fade-in">
          <CompetitionReadyPracticeZone initialClass={11} />
        </div>
      )}

    </div>
  );
};
