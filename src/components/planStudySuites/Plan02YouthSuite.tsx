import React, { useState } from 'react';
import { ResumeBioDataBuilder } from '../ResumeBioDataBuilder';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  HelpCircle, 
  Briefcase, 
  Send, 
  Award, 
  Search, 
  CheckCircle2, 
  Volume2, 
  ChevronRight,
  TrendingUp,
  Download,
  Terminal,
  Bookmark
} from 'lucide-react';

export const Plan02YouthSuite: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'builder' | 'resume' | 'prompts' | 'letters' | 'hrQuestions' | 'quiz'>('builder');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [promptSearch, setPromptSearch] = useState('');
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('all');
  const [selectedResumeIndustry, setSelectedResumeIndustry] = useState<'fresher' | 'it' | 'sales' | 'office'>('fresher');

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

  // 1. Resume blueprints
  const resumeTemplates = {
    fresher: {
      title: 'Graduate / College Fresher ATS Blueprint',
      idealFor: 'B.A / B.Sc / B.Com / BCA पास फ्रेशर्स जो पहली जॉब तलाश रहे हैं',
      content: `[FULL NAME]
City, State | +91 9876543210 | email@example.com | LinkedIn: linkedin.com/in/profile

CAREER OBJECTIVE
Enthusiastic and detail-oriented graduate with strong analytical and communication skills seeking an entry-level position at [Target Company]. Eager to apply digital literacy, problem-solving, and team collaboration to contribute to company growth.

EDUCATION
• Bachelor of Science / Commerce / Arts | [College Name], [Year] | Aggregate: 78%
• Higher Secondary Certificate (10+2) | [School Name], [Year] | Percentage: 82%

TECHNICAL & PROFESSIONAL SKILLS
• Computer Skills: MS Office (Excel, Word, PowerPoint), Google Workspace
• Digital Tools: Fast Typing (35+ WPM), Basic AI Prompting (ChatGPT, Gemini)
• Soft Skills: Clear Verbal & Written Communication, Time Management, Teamwork

PROJECTS & ACADEMIC ACHIEVEMENTS
• Digital Project: Conducted 2-week local market survey on digital payments and prepared statistical report in Excel.
• College Event Coordinator: Managed registration and logistics for annual inter-college youth festival with 500+ participants.

LANGUAGES
• Hindi (Fluent - Read/Write/Speak)
• English (Professional Working Proficiency)`
    },
    it: {
      title: 'IT & Software Developer ATS Blueprint',
      idealFor: 'Frontend, Fullstack, Python, React डेवलपर्स व टेक प्रोफेशनल्स',
      content: `[FULL NAME]
Bengaluru, India | +91 9876543210 | developer@email.com | GitHub: github.com/username | Portfolio: devportfolio.com

PROFESSIONAL SUMMARY
Results-driven Full Stack Developer with 1+ year of hands-on experience building scalable web applications using React, TypeScript, Node.js, and REST APIs. Strong foundation in Data Structures, responsive UI design, and cloud deployments.

CORE COMPETENCIES
• Languages & Frameworks: JavaScript (ES6+), TypeScript, React.js, Node.js, Express, Tailwind CSS
• Databases: PostgreSQL, MongoDB, Firebase Firestore
• Tools & Version Control: Git, GitHub, Docker, Postman, Linux CLI
• Soft Skills: Agile/Scrum Methodologies, Problem Solving, Code Review

WORK EXPERIENCE / KEY PROJECTS
Full Stack Web Application - E-Commerce Platform
• Developed responsive frontend in React & Tailwind CSS reducing bounce rate by 24%.
• Designed RESTful backend API in Node.js handling 10,000+ mock transactions.
• Integrated secure payment gateway sandbox and OAuth2 authentication.

EDUCATION
• B.Tech in Computer Science / BCA | [University Name], 2024 | CGPA: 8.4/10`
    },
    sales: {
      title: 'Sales, Marketing & BD Associate Blueprint',
      idealFor: 'सेल्स एग्जीक्यूटिव, फील्ड सेल्स, टेलीकॉलर एवं बिजनेस डेवलपमेंट',
      content: `[FULL NAME]
New Delhi, India | +91 9876543210 | sales.pro@email.com | LinkedIn: linkedin.com/in/salesprofile

EXECUTIVE SUMMARY
Dynamic and target-oriented Sales & Business Development Associate with proven expertise in lead generation, client negotiation, and consultative selling. Achieved 120% of monthly sales targets consistently.

AREAS OF EXPERTISE
• B2B & B2C Direct Sales, Client Relationship Management (CRM)
• Tele-calling & Cold Outreach, WhatsApp Automation Funnels
• High-Impact Product Demos & Objection Handling
• Revenue Growth & Post-Sales Account Retention

PROFESSIONAL EXPERIENCE
Business Development Associate | [Previous Company Name] | 2023 - Present
• Generated 60+ qualified warm leads monthly through digital campaigns and telephone outreach.
• Converted 28 high-value commercial accounts generating ₹8.5 Lakhs quarterly revenue.
• Reduced client onboarding friction by drafting simplified onboarding guides.

EDUCATION
• Bachelor of Business Administration (BBA) / B.Com | [College Name], 2023`
    },
    office: {
      title: 'Office Admin & Data Entry Specialist Blueprint',
      idealFor: 'ऑफिस असिस्टेंट, कंप्यूटर ऑपरेटर, डाटा एंट्री एवं बिलिंग एग्जीक्यूटिव',
      content: `[FULL NAME]
Patna, Bihar | +91 9876543210 | admin.specialist@email.com

OBJECTIVE
Organized and detail-oriented Office Administrator with 40+ WPM typing speed and advanced MS Excel certification. Looking to maintain flawless data records and optimize office administrative workflows at [Company Name].

CORE COMPETENCIES
• Advanced MS Excel: VLOOKUP, Pivot Tables, Conditional Formatting, Data Validation
• Data Entry Accuracy: 99.8% precision with 42 Words Per Minute typing speed
• Office Inventory, Invoice Billing, GST e-Way Bill generation
• Vendor Coordination and Official Correspondence Drafting

EXPERIENCE & CERTIFICATIONS
• Advance Diploma in Computer Applications (ADCA) - 1 Year Certified
• Data Operator Intern | [Local Business/Office], 6 Months
  - Handled daily cashbook entries, stock registers, and vendor payments.
  - Digitized 3,000+ historical paper files into structured Excel databases.`
    }
  };

  // 2. Curated AI Prompts
  const aiPrompts = [
    {
      id: 'p1',
      category: 'career',
      title: 'ATS Resume Keyword Optimization Prompt',
      prompt: 'Act as a Senior HR Recruiter at a top tech company. Analyze my resume text below against this target job description: [PASTE JOB DESCRIPTION]. Identify missing industry keywords, recommend 5 strong bullet points with action verbs and quantifiable metrics, and estimate my current ATS match percentage. Here is my resume: [PASTE RESUME].'
    },
    {
      id: 'p2',
      category: 'career',
      title: 'Tough Interview Simulator (Roleplay)',
      prompt: 'Act as a strict hiring manager interviewing me for the position of [JOB ROLE]. Ask me 1 challenging question at a time. Wait for my response. After each answer, provide honest constructive feedback with a score out of 10 and suggest a better STAR-method response before asking the next question. Begin by asking the first question.'
    },
    {
      id: 'p3',
      category: 'email',
      title: 'Cold Email to Hiring Manager (80% Open Rate)',
      prompt: 'Write a concise, professional 120-word cold outreach email to the Head of [DEPARTMENT] at [COMPANY NAME]. Highlight my enthusiasm for their recent work on [PROJECT/TOPIC], mention my key strength in [YOUR MAIN SKILL], and politely request a brief 10-minute informational coffee chat. Keep the tone respectful, confident, and without corporate jargon.'
    },
    {
      id: 'p4',
      category: 'email',
      title: 'Follow-Up Email After Job Interview (5 Days Later)',
      prompt: 'Draft a polite and impactful follow-up email to send 5 days after completing my job interview for [POSITION]. Express gratitude for their time, briefly reiterate one key idea we discussed regarding [TOPIC DISCUSSED], and inquire about the expected next steps in the hiring timeline.'
    },
    {
      id: 'p5',
      category: 'tech',
      title: 'Code Explainer & Bug Fixer',
      prompt: 'Analyze this code snippet: [PASTE CODE]. Explain line-by-line what this function does in simple plain Hindi/English. Identify any edge cases, security vulnerabilities, or performance bottlenecks, and provide the refactored optimal version with comments.'
    },
    {
      id: 'p6',
      category: 'business',
      title: 'WhatsApp High-Converting Sales Script',
      prompt: 'Generate a 5-step conversational WhatsApp sales funnel script for selling an educational kit priced at ₹[PRICE]. Include: Step 1 (Polite greeting & curiosity hook), Step 2 (Addressing core pain point), Step 3 (Presenting solution & social proof), Step 4 (Limited time offer & CTA), Step 5 (Objection handling if they say "soch kar bataunga").'
    }
  ];

  // 3. Top HR Questions with STAR answers
  const hrQuestions = [
    {
      q: '1. Tell me about yourself. (अपने बारे में बताएं)',
      formula: 'Present (वर्तमान स्थिति) → Past (पिछला अनुभव या शिक्षा) → Future (इस कंपनी में क्या करना चाहते हैं)',
      modelAnswer: '"Thank you for this opportunity. I am a graduate in [Degree] with a strong foundation in [Skill 1] and [Skill 2]. During my academics, I led a project where I [Key Achievement]. What excites me about your company is your focus on [Company Quality], and I am eager to apply my analytical skills and dedication to deliver measurable value to your team."',
      hindiTip: 'इस प्रश्न में अपने परिवार का इतिहास न बताएं; केवल अपनी शिक्षा, मुख्य कौशल, पिछली उपलब्धि और इस नौकरी के प्रति अपने उत्साह को 90 सेकंड में रखें।'
    },
    {
      q: '2. What is your greatest weakness? (आपकी सबसे बड़ी कमजोरी क्या है?)',
      formula: 'Real Non-Fatal Weakness + Active Steps you are taking to improve it',
      modelAnswer: '"In the past, I sometimes struggled with delegating tasks because I wanted everything to be 100% perfect. However, I realized this creates bottlenecks. Recently, I started using Trello and calendar checklists to set clear milestones, which has drastically improved my delegation and team trust."',
      hindiTip: 'कभी यह न कहें कि "मुझमें कोई कमजोरी नहीं है" या "मैं बहुत ज्यादा काम करता हूँ"। एक वास्तविक सीखने वाली बात बताएं जिसे आप सुधार रहे हैं।'
    },
    {
      q: '3. Why should we hire you over other candidates? (हम आपको क्यों चुनें?)',
      formula: 'Unique intersection of Hard Skills + Work Ethic + Company Mission Alignment',
      modelAnswer: '"While many candidates may possess the required technical skills, what sets me apart is my relentless learning agility and ownership mindset. In my past role/project, I proactively learned [Tool/Skill] in 2 weeks to solve a critical deadline issue. I bring that exact problem-solving drive to this position."',
      hindiTip: 'अन्य उम्मीदवारों की बुराई न करें; अपनी लगन, तेजी से सीखने की क्षमता और जिम्मेदारी लेने की आदत पर जोर दें।'
    },
    {
      q: '4. Where do you see yourself in 5 years? (5 साल बाद आप खुद को कहाँ देखते हैं?)',
      formula: 'Domain Mastery → Leadership / Mentorship → Measurable Impact',
      modelAnswer: '"In the next 5 years, I see myself growing into a subject matter expert in [Domain]. I aim to take on increased responsibilities, lead impactful client projects, and mentor junior teammates while driving continuous innovation for the organization."',
      hindiTip: 'यह न कहें कि "मैं आपकी कुर्सी पर बैठना चाहता हूँ"। संगठन के साथ अपने दीर्घकालिक विकास और निष्ठा को दर्शाएं।'
    }
  ];

  // 4. Quiz Questions
  const quizList = [
    {
      q: 'ATS (Applicant Tracking System) रिज्यूम में कौन-सी चीज सबसे महत्वपूर्ण है?',
      options: ['रंग-बिरंगे ग्राफिक्स और फोटो', 'जॉब डिस्क्रिप्शन से मेल खाते सही कीवर्ड्स व साधारण फॉन्ट', '5 पन्नों का लंबा बायोडाटा', 'कर्सिव फॉन्ट्स और टेबल्स'],
      correct: 1,
      explain: 'ATS सॉफ्टवेयर टेक्स्ट-बेस्ड कीवर्ड्स और सरल 1-कॉलम लेआउट को सबसे आसानी से स्कैन करता है।'
    },
    {
      q: 'STAR इंटरव्यू तकनीक में "A" का क्या अर्थ होता है?',
      options: ['Attitude (रवैया)', 'Action (आपने क्या कदम उठाया)', 'Accuracy (सटीकता)', 'Award (पुरस्कार)'],
      correct: 1,
      explain: 'STAR का अर्थ Situation, Task, Action और Result होता है।'
    },
    {
      q: 'AI Prompt लिखते समय बेहतर उत्तर पाने के लिए सबसे जरूरी क्या है?',
      options: ['केवल 2 शब्द लिखना', 'Role (भूमिका), Context (संदर्भ) और Output Format स्पष्ट देना', 'कैपिटल अक्षरों में चिल्लाना', 'बिना निर्देश केवल सवाल पूछना'],
      correct: 1,
      explain: 'जितना स्पष्ट संदर्भ और आउटपुट निर्देश देंगे, AI उतना सटीक और उपयोगी उत्तर देगा।'
    }
  ];

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    quizList.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  const filteredPrompts = aiPrompts.filter(p => {
    const matchesCat = selectedPromptCategory === 'all' || p.category === selectedPromptCategory;
    const matchesSearch = p.title.toLowerCase().includes(promptSearch.toLowerCase()) || 
                          p.prompt.toLowerCase().includes(promptSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-950/60 to-slate-900 border border-blue-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PLAN 02 • ₹25 AUTHORIZED SUITE
              </span>
              <span className="text-xs text-slate-400 font-mono">100% Practical Youth Career Kit</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Youth Skill Access: ATS Resume, AI Prompts & Interview Vault
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              कॉलेज छात्रों एवं जॉब सीकर्स के लिए आधुनिक करियर किट। कॉर्पोरेट स्टैंडर्ड बायोडाटा, 200+ AI प्रॉम्ट्स और इंटरव्यू में सफलता के फॉर्मूले।
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">प्लान इंसेंटिव</span>
            <div className="text-2xl font-black text-blue-400 font-mono">₹17.50 / Ref</div>
            <span className="text-[10px] text-emerald-400 font-bold">70% डायरेक्ट पेआउट</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveSubTab('builder')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black transition-all ${
            activeSubTab === 'builder' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md scale-102' : 'text-amber-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>25 ATS रिज्यूम व बायो-डाटा बिल्डर (Live Builder)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('resume')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'resume' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>क्विक ब्लूप्रिंट्स</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prompts')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'prompts' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>200+ AI मास्टर प्रॉम्ट्स</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hrQuestions')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'hrQuestions' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Top 50 HR इंटरव्यू उत्तर</span>
        </button>

        <button
          onClick={() => setActiveSubTab('letters')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'letters' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>ईमेल व जॉब लेटर्स</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'quiz' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>जॉब रेडीनेस टेस्ट</span>
        </button>
      </div>

      {/* SUB-TAB 0: 25 ATS RESUME & BIO-DATA INTERACTIVE BUILDER */}
      {activeSubTab === 'builder' && (
        <div className="animate-in fade-in">
          <ResumeBioDataBuilder />
        </div>
      )}

      {/* SUB-TAB 1: ATS RESUME BLUEPRINTS */}
      {activeSubTab === 'resume' && (
        <div className="space-y-5 animate-in fade-in">
          
          {/* Industry selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {(['fresher', 'it', 'sales', 'office'] as const).map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedResumeIndustry(ind)}
                className={`p-3 rounded-2xl border text-left font-bold transition-all ${
                  selectedResumeIndustry === ind 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="block text-sm text-white capitalize">{ind === 'fresher' ? '🎓 कॉलेज फ्रेशर' : ind === 'it' ? '💻 IT / डेवलपर' : ind === 'sales' ? '📈 सेल्स व मार्केटिंग' : '📑 ऑफिस एडमिन'}</span>
                <span className="text-[10px] text-slate-400 mt-1 block">1-क्लिक ATS लेआउट</span>
              </button>
            ))}
          </div>

          {/* Resume Viewer Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase">
                  ATS Score: 95/100 (Single-Column Standard)
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {resumeTemplates[selectedResumeIndustry].title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  उपयुक्त: {resumeTemplates[selectedResumeIndustry].idealFor}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(resumeTemplates[selectedResumeIndustry].content, 'resume')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  {copiedId === 'resume' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId === 'resume' ? 'कॉपी हो गया!' : 'पूर्ण बायोडाटा कॉपी करें'}</span>
                </button>
              </div>
            </div>

            {/* Resume Content Box */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[450px] overflow-y-auto">
              {resumeTemplates[selectedResumeIndustry].content}
            </div>

            {/* ATS Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block">✓ 1-Column Layout:</span>
                <p className="text-slate-400 text-[11px]">कोई भी जटिल टेबल्स या आइकन्स नहीं, जिससे ATS सॉफ्टवेयर 100% टेक्स्ट पढ़ सकता है।</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="text-blue-400 font-bold block">✓ Action Verbs:</span>
                <p className="text-slate-400 text-[11px]">Developed, Managed, Analyzed, Generated जैसे कॉर्पोरेट एक्शन वर्ड्स शामिल हैं।</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block">✓ Measurable Metrics:</span>
                <p className="text-slate-400 text-[11px]">प्रतिशत (%), संख्या और सटीक उपलब्धियों के साथ बायोडाटा तुरंत शॉर्टलिस्ट होता है।</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: 200+ AI PROMPTS */}
      {activeSubTab === 'prompts' && (
        <div className="space-y-4 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={promptSearch}
                onChange={(e) => setPromptSearch(e.target.value)}
                placeholder="प्रॉम्ट खोजें (उदा: Resume, Email)..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
              {['all', 'career', 'email', 'tech', 'business'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPromptCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors ${
                    selectedPromptCategory === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'सभी प्रॉम्ट्स' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrompts.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">ChatGPT / Gemini Ready</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white">
                    {p.title}
                  </h4>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
                    {p.prompt}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                  <span className="text-[11px] text-slate-400">1-क्लिक कॉपी करके AI में पेस्ट करें</span>
                  <button
                    onClick={() => copyToClipboard(p.prompt, p.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold flex items-center gap-1 transition-colors"
                  >
                    {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === p.id ? 'कॉपी हुआ!' : 'प्रॉम्ट कॉपी करें'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUB-TAB 3: TOP 50 HR QUESTIONS */}
      {activeSubTab === 'hrQuestions' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">
              🎙️ कॉर्पोरेट इंटरव्यू में पूछे जाने वाले 50 सबसे महत्वपूर्ण प्रश्न (STAR विधि समाधान सहित)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold">
              STAR Method
            </span>
          </div>

          <div className="space-y-3">
            {hrQuestions.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-white">
                      {item.q}
                    </h4>
                    <span className="text-[11px] font-mono text-amber-400 mt-0.5 block">
                      📌 उत्तर का फॉर्मूला: {item.formula}
                    </span>
                  </div>

                  <button
                    onClick={() => speakText(item.modelAnswer)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 shrink-0 border border-slate-800"
                    title="आदर्श उत्तर सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed italic">
                  {item.modelAnswer}
                </div>

                <div className="p-2.5 bg-blue-950/30 rounded-lg border border-blue-500/20 text-[11px] text-blue-300">
                  <strong>💡 महत्वपूर्ण हिंदी टिप:</strong> {item.hindiTip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: JOB LETTERS & EMAILS */}
      {activeSubTab === 'letters' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  1. Cold Outreach Email to HR (इंटरव्यू कॉल प्राप्त करने हेतु)
                </h4>
                <p className="text-xs text-slate-400">सीधे कंपनी के HR को भेजने के लिए प्रमाणित ईमेल ड्राफ्ट</p>
              </div>
              <button
                onClick={() => copyToClipboard(`Subject: Application for [Job Role] - [Your Full Name]\n\nDear [Hiring Manager Name / HR Team],\n\nI hope this email finds you well.\n\nI am writing to express my strong interest in the [Job Role] position at [Company Name]. With my educational background in [Your Degree] and practical skills in [Skill 1, Skill 2, Skill 3], I am confident in my ability to add immediate value to your team.\n\nAttached is my resume for your review. I would welcome the opportunity to discuss how my skill set aligns with your ongoing goals.\n\nThank you for your time and consideration.\n\nWarm regards,\n[Your Name]\n[Your Phone Number]\n[LinkedIn Profile URL]`, 'cold-email')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow"
              >
                {copiedId === 'cold-email' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'cold-email' ? 'कॉपी हुआ!' : 'ईमेल कॉपी करें'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
{`Subject: Application for [Job Role] - [Your Full Name]

Dear [Hiring Manager Name / HR Team],

I hope this email finds you well.

I am writing to express my strong interest in the [Job Role] position at [Company Name]. With my educational background in [Your Degree] and practical skills in [Skill 1, Skill 2, Skill 3], I am confident in my ability to add immediate value to your team.

Attached is my resume for your review. I would welcome the opportunity to discuss how my skill set aligns with your ongoing goals.

Thank you for your time and consideration.

Warm regards,
[Your Name]
[Your Phone Number]
[LinkedIn Profile URL]`}
            </pre>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: JOB READINESS QUIZ */}
      {activeSubTab === 'quiz' && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white">
                जॉब रेडीनेस एवं करियर असेसमेंट टेस्ट
              </h3>
              <p className="text-xs text-slate-400">
                कॉर्पोरेट स्टैंडर्ड ज्ञान का परीक्षण करें और अपना तैयारी स्तर जानें।
              </p>
            </div>
            {quizSubmitted && (
              <span className="px-3.5 py-1.5 rounded-full font-black text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                स्कोर: {calculateScore()} / {quizList.length}
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
                      style = 'bg-blue-600/30 border-blue-500 text-blue-200';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectAnswer(qIdx, oIdx)}
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
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg"
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
