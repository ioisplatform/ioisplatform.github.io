import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Save, 
  RefreshCw, 
  Award, 
  ShieldCheck, 
  Copy, 
  ChevronRight,
  Briefcase,
  GraduationCap,
  Layers,
  Star,
  CheckCircle2,
  Sliders,
  Palette
} from 'lucide-react';

export interface ResumeData {
  fullName: string;
  professionalTitle: string;
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  skills: string[];
  experience: {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    year: string;
    score: string;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
  }[];
  certifications: string[];
  languages: string[];
  hobbies: string[];
  // Bio-Data specific fields
  isBioDataMode: boolean;
  dob?: string;
  fatherName?: string;
  motherName?: string;
  gender?: string;
  maritalStatus?: string;
  fullAddress?: string;
}

export interface ResumeTemplateMeta {
  id: number;
  name: string;
  category: 'Modern' | 'Corporate' | 'Creative' | 'ATS Classic' | 'Specialized';
  fontFamily: string;
  accentColor: string;
  headerStyle: 'minimal' | 'banner' | 'sidebar-left' | 'sidebar-right' | 'bordered' | 'split';
  atsScore: number;
  desc: string;
}

export const RESUME_TEMPLATES_25: ResumeTemplateMeta[] = [
  { id: 1, name: 'Template 1 – Modern Minimal', category: 'Modern', fontFamily: 'font-sans', accentColor: '#2563eb', headerStyle: 'minimal', atsScore: 99, desc: 'अत्यंत स्वच्छ, नो-क्लटर डिज़ाइन जो 100% ATS पास करता है।' },
  { id: 2, name: 'Template 2 – Executive Corporate', category: 'Corporate', fontFamily: 'font-sans', accentColor: '#1e3a8a', headerStyle: 'banner', atsScore: 98, desc: 'नेवी ब्लू हेडर, लीडरशिप व सीनियर रोल्स के लिए उत्तम।' },
  { id: 3, name: 'Template 3 – Elegant Serif', category: 'Corporate', fontFamily: 'font-serif', accentColor: '#0f172a', headerStyle: 'minimal', atsScore: 96, desc: 'क्लासिक सेरिफ टाइपोग्राफी, अकादमिक व लीगल रोल्स हेतु।' },
  { id: 4, name: 'Template 4 – Blue Professional', category: 'Modern', fontFamily: 'font-sans', accentColor: '#0284c7', headerStyle: 'bordered', atsScore: 98, desc: 'कॉर्पोरेट व आईटी मानक फॉर्मेट, ब्लू बॉर्डर एक्सेंट।' },
  { id: 5, name: 'Template 5 – Dark Header', category: 'Modern', fontFamily: 'font-sans', accentColor: '#0f172a', headerStyle: 'banner', atsScore: 97, desc: 'प्रीमियम स्लेट डार्क हेडर, बोल्ड फर्स्ट इम्प्रेशन।' },
  { id: 6, name: 'Template 6 – Left Sidebar', category: 'Creative', fontFamily: 'font-sans', accentColor: '#3b82f6', headerStyle: 'sidebar-left', atsScore: 95, desc: 'बाएं साइडबार में स्किल्स व संपर्क, दाईं ओर कार्य अनुभव।' },
  { id: 7, name: 'Template 7 – Right Sidebar', category: 'Creative', fontFamily: 'font-sans', accentColor: '#4f46e5', headerStyle: 'sidebar-right', atsScore: 95, desc: 'संतुलित दायां साइडबार लेआउट, विजुअल बैलेंस।' },
  { id: 8, name: 'Template 8 – Two Column', category: 'Modern', fontFamily: 'font-sans', accentColor: '#0d9488', headerStyle: 'split', atsScore: 96, desc: 'बराबर 2 कॉलम ग्रिड, कम जगह में अधिक जानकारी।' },
  { id: 9, name: 'Template 9 – Clean White', category: 'ATS Classic', fontFamily: 'font-sans', accentColor: '#334155', headerStyle: 'minimal', atsScore: 100, desc: 'जीरो कलर डिस्ट्रेक्शन, 100% शुद्ध रिक्रूटर टेक्स्ट।' },
  { id: 10, name: 'Template 10 – Luxury Black', category: 'Corporate', fontFamily: 'font-sans', accentColor: '#18181b', headerStyle: 'bordered', atsScore: 96, desc: 'रॉयल ब्लैक एंड व्हाइट कंट्रास्ट, हाई प्रोफाइल मैनेजर्स।' },
  { id: 11, name: 'Template 11 – Creative Professional', category: 'Creative', fontFamily: 'font-sans', accentColor: '#7c3aed', headerStyle: 'bordered', atsScore: 96, desc: 'पर्पल एक्सेंट, डिजाइन, मीडिया व मार्केटिंग प्रोफेशनल्स।' },
  { id: 12, name: 'Template 12 – ATS Classic', category: 'ATS Classic', fontFamily: 'font-mono', accentColor: '#000000', headerStyle: 'minimal', atsScore: 100, desc: 'सर्वोच्च ATS स्कोर, इंटरनेशनल जॉब्स व AI स्कैनर्स अनुकूल।' },
  { id: 13, name: 'Template 13 – Technology Style', category: 'Specialized', fontFamily: 'font-mono', accentColor: '#059669', headerStyle: 'bordered', atsScore: 97, desc: 'सॉफ्टवेयर, कोडिंग, फुलस्टैक व डेवऑप्स रोल्स हेतु।' },
  { id: 14, name: 'Template 14 – Business Consultant', category: 'Corporate', fontFamily: 'font-sans', accentColor: '#b45309', headerStyle: 'bordered', atsScore: 97, desc: 'एनालिटिकल, कंसल्टिंग व स्ट्रैटेजी प्रोफाइल।' },
  { id: 15, name: 'Template 15 – Marketing Professional', category: 'Creative', fontFamily: 'font-sans', accentColor: '#ea580c', headerStyle: 'banner', atsScore: 95, desc: 'डायनामिक ऑरेंज थीम, सेल्स, ग्रोथ व डिजिटल मार्केटिंग।' },
  { id: 16, name: 'Template 16 – Finance Resume', category: 'Corporate', fontFamily: 'font-sans', accentColor: '#15803d', headerStyle: 'minimal', atsScore: 98, desc: 'एकाउंटिंग, सीए, बैंकिंग व ऑडिटिंग प्रोफेशनल्स।' },
  { id: 17, name: 'Template 17 – Healthcare Resume', category: 'Specialized', fontFamily: 'font-sans', accentColor: '#0891b2', headerStyle: 'bordered', atsScore: 97, desc: 'नर्सिंग, मेडिकल, फॉर्मास्यूटिकल व लैब टेक।' },
  { id: 18, name: 'Template 18 – Teacher Resume', category: 'Specialized', fontFamily: 'font-serif', accentColor: '#4338ca', headerStyle: 'bordered', atsScore: 97, desc: 'स्कूल-कॉलेज शिक्षक, कोचिंग ट्यूटर्स व प्रोफेसर्स।' },
  { id: 19, name: 'Template 19 – Engineering Resume', category: 'Specialized', fontFamily: 'font-sans', accentColor: '#475569', headerStyle: 'minimal', atsScore: 98, desc: 'सिविल, मैकेनिकल, इलेक्ट्रिकल इंजीनियर्स।' },
  { id: 20, name: 'Template 20 – Fresher Resume', category: 'Modern', fontFamily: 'font-sans', accentColor: '#2563eb', headerStyle: 'minimal', atsScore: 99, desc: 'कॉलेज पासआउट्स (BA, BSc, BCom, BCA) पहली नौकरी के लिए।' },
  { id: 21, name: 'Template 21 – Experienced Resume', category: 'Corporate', fontFamily: 'font-sans', accentColor: '#1e293b', headerStyle: 'bordered', atsScore: 98, desc: '5+ वर्ष अनुभवी पेशेवरों के लिए विस्तृत क्रोनोलॉजिकल।' },
  { id: 22, name: 'Template 22 – International CV', category: 'ATS Classic', fontFamily: 'font-sans', accentColor: '#1e40af', headerStyle: 'bordered', atsScore: 97, desc: 'यूरोप, गल्फ, कनाडा व यूएस वीजा जॉब्स हेतु।' },
  { id: 23, name: 'Template 23 – Government Job Resume / Bio-Data', category: 'ATS Classic', fontFamily: 'font-sans', accentColor: '#991b1b', headerStyle: 'bordered', atsScore: 99, desc: 'सरकारी संविदा, रेलवे, डाक, बैंक व व्यक्तिगत बायो-डाटा।' },
  { id: 24, name: 'Template 24 – Premium Gold Theme', category: 'Creative', fontFamily: 'font-serif', accentColor: '#d97706', headerStyle: 'banner', atsScore: 96, desc: 'गोल्ड व अंबर लग्जरी एक्सेंट, सीनियर एग्जीक्यूटिव।' },
  { id: 25, name: 'Template 25 – Ultra Modern Executive', category: 'Modern', fontFamily: 'font-sans', accentColor: '#0369a1', headerStyle: 'banner', atsScore: 98, desc: '2026 मॉडर्न यूआई स्टैंडर्ड, उच्च प्रभाव व परिणाम केंद्रित।' }
];

const DEFAULT_SAMPLE_RESUME: ResumeData = {
  fullName: 'अमित कुमार (Amit Kumar)',
  professionalTitle: 'Full Stack Web Developer & Digital Professional',
  phone: '+91 98765 43210',
  email: 'amit.kumar@example.com',
  location: 'पटना, बिहार (Patna, Bihar)',
  linkedin: 'linkedin.com/in/amitkumar',
  portfolio: 'amitkumar-portfolio.dev',
  summary: 'परिणाम-उन्मुख एवं लगनशील पेशेवर जिसके पास आधुनिक वेब तकनीकों (React, TypeScript, Node.js), डिजिटल डेटा प्रबंधन और टीम सहयोग का व्यावहारिक अनुभव है। कंपनी के लक्ष्यों को प्राप्त करने और डिजिटल समाधान प्रस्तुत करने हेतु सदैव तत्पर।',
  skills: [
    'React.js & TypeScript',
    'HTML5 & Tailwind CSS',
    'Node.js & Express REST APIs',
    'PostgreSQL & Firebase',
    'MS Excel & Google Sheets',
    'Problem Solving & Fast Typing',
    'Good Communication (Hindi/English)'
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Junior Frontend Developer',
      company: 'TechVision Digital Solutions',
      period: '2024 – वर्तमान (Present)',
      description: '• आधुनिक React.js और Tailwind CSS का उपयोग करके उत्तरदायी (Responsive) यूजर इंटरफेस का निर्माण किया जिससे बाउंस रेट 20% घटा।\n• RESTful API इंटीग्रेशन द्वारा 10,000+ यूजर्स के दैनिक डेटा सिंक को सुगम बनाया।'
    },
    {
      id: 'exp-2',
      role: 'Digital Literacy Intern',
      company: 'SkillIndia Youth Center',
      period: '2023 – 2024',
      description: '• 500+ छात्रों को बेसिक कंप्यूटर, डिजिटल भुगतान और माइक्रोसॉफ्ट ऑफिस टूल्स का प्रशिक्षण दिया।'
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'पटना विश्वविद्यालय (Patna University)',
      year: '2021 – 2024',
      score: '78.5% (प्रथम श्रेणी)'
    },
    {
      id: 'edu-2',
      degree: 'Higher Secondary (10+2 Science)',
      institution: 'बिहार विद्यालय परीक्षा समिति (BSEB)',
      year: '2019 – 2021',
      score: '81.2%'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'E-Commerce Platform (React & Node)',
      description: 'संपूर्ण ऑनलाइन स्टोर जिसमें उत्पाद कैटलॉग, शॉपिंग कार्ट और सुरक्षित पेमेंट गेटवे शामिल है।'
    },
    {
      id: 'proj-2',
      title: 'Student Homework & Notes App',
      description: 'कक्षा 1 से 12 तक के विद्यार्थियों के लिए डिजिटल नोट्स और अभ्यास क्विज़ प्रणाली।'
    }
  ],
  certifications: [
    'Certified Web Development Professional (IOIS Network)',
    'Google Digital Garage – Fundamentals of Digital Marketing'
  ],
  languages: ['हिंदी (पूर्ण प्रवाह)', 'English (Professional Working)'],
  hobbies: ['प्रोग्रामिंग सीखना', 'किताबें पढ़ना', 'क्रिकेट खेलना'],
  isBioDataMode: false,
  dob: '15/08/2002',
  fatherName: 'श्री रामेश्वर प्रसाद (Shri Rameshwar Prasad)',
  motherName: 'श्रीमती प्रभावती देवी (Smt. Prabhavati Devi)',
  gender: 'पुरुष (Male)',
  maritalStatus: 'अविवाहित (Unmarried)',
  fullAddress: 'ग्राम- रामपुर, पो.- कंकड़बाग, जिला- पटना, बिहार, पिन- 800020'
};

const RESUME_STORAGE_KEY = 'iois_user_saved_resume_v1';

export const ResumeBioDataBuilder: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(1);
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(RESUME_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Resume load error:', e);
    }
    return DEFAULT_SAMPLE_RESUME;
  });

  const [activeFormSection, setActiveFormSection] = useState<'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'biodata'>('personal');
  const [saveToast, setSaveToast] = useState(false);
  const [copiedTextToast, setCopiedTextToast] = useState(false);

  const currentTemplate = RESUME_TEMPLATES_25.find(t => t.id === selectedTemplateId) || RESUME_TEMPLATES_25[0];

  // Auto-save to localStorage
  const handleSaveToLocalStorage = () => {
    try {
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumeData));
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleResetToSample = () => {
    setResumeData(DEFAULT_SAMPLE_RESUME);
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_RESUME));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Helper to add new experience
  const handleAddExperience = () => {
    const newExp = {
      id: 'exp-' + Date.now(),
      role: 'New Job Role',
      company: 'Company Name',
      period: '2024 – Present',
      description: '• प्रमुख जिम्मेदारियां और उपलब्धियां यहाँ लिखें...'
    };
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const handleRemoveExperience = (id: string) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  // Helper to add new education
  const handleAddEducation = () => {
    const newEdu = {
      id: 'edu-' + Date.now(),
      degree: 'Course / Degree Name',
      institution: 'Board / University Name',
      year: 'Year',
      score: 'Percentage / CGPA'
    };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const handleRemoveEducation = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* 1. TOP HEADER & ATS RESUME STATS BANNER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-[#1e3a8a] to-slate-950 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% ATS-Friendly Engine</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
              25 प्रीमियम टेम्पलेट्स शामिल
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            IOIS Professional Resume & Bio-Data Builder
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            नौकरी, इंटरव्यू व सरकारी आवेदनों के लिए 25 अलग-अलग पेशेवर डिजाइन्स। फॉर्म में अपना डेटा भरें, लाइव प्रिव्यू देखें और तुरंत A4 PDF प्रिंट करें।
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={handleSaveToLocalStorage}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>डेटा सेव करें</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>PDF / प्रिंट डाउनलोड</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>आपका रिज्यूमे डेटा सुरक्षित रूप से सेव हो गया है!</span>
        </div>
      )}

      {/* 2. TEMPLATE SELECTOR GALLERY (25 TEMPLATES SCROLLER) */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#1e3a8a]" />
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
              प्रीमियम 25 टेम्पलेट्स गैलरी (Select from 25 Designs):
            </h3>
          </div>
          <span className="text-xs text-blue-700 font-bold">
            टेम्पलेट #{selectedTemplateId}: {currentTemplate.name}
          </span>
        </div>

        {/* Horizontal scroll of 25 templates */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {RESUME_TEMPLATES_25.map((tpl) => {
            const isSelected = selectedTemplateId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`p-3 rounded-2xl border-2 text-left shrink-0 w-48 sm:w-52 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50 border-[#1e3a8a] ring-2 ring-blue-300 scale-102 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono">
                    #{tpl.id}
                  </span>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                    {tpl.atsScore}% ATS
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">
                    {tpl.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">
                    {tpl.desc}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 capitalize">{tpl.category}</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tpl.accentColor }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: FORM EDITOR (LEFT) + REAL-TIME PREVIEW (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================= */}
        {/* LEFT COLUMN: EDITABLE FORM CONTROLS (5 cols on lg) */}
        {/* ============================================================= */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4 print:hidden">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#1e3a8a]" />
              <h3 className="font-black text-sm text-slate-900">
                रिज्यूमे विवरण संपादित करें (Edit Form)
              </h3>
            </div>
            
            <button
              type="button"
              onClick={handleResetToSample}
              className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
              title="सैंपल डेटा भरें"
            >
              <RefreshCw className="w-3 h-3" />
              <span>सैंपल डेटा भरें</span>
            </button>
          </div>

          {/* Mode Switch: Standard Resume vs Bio-Data */}
          <div className="flex p-1 bg-slate-100 rounded-xl gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setResumeData(prev => ({ ...prev, isBioDataMode: false }))}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                !resumeData.isBioDataMode ? 'bg-white shadow text-[#1e3a8a]' : 'text-slate-600'
              }`}
            >
              💼 जॉब रिज्यूमे (Resume)
            </button>
            <button
              type="button"
              onClick={() => setResumeData(prev => ({ ...prev, isBioDataMode: true }))}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                resumeData.isBioDataMode ? 'bg-white shadow text-red-700' : 'text-slate-600'
              }`}
            >
              📜 व्यक्तिगत बायो-डाटा (Bio-Data)
            </button>
          </div>

          {/* Sub-form navigation tabs */}
          <div className="flex flex-wrap gap-1 text-xs border-b border-slate-200 pb-2">
            {[
              { id: 'personal', label: 'व्यक्तिगत' },
              { id: 'experience', label: 'कार्य अनुभव' },
              { id: 'education', label: 'शिक्षा' },
              { id: 'skills', label: 'कौशल (Skills)' },
              { id: 'projects', label: 'प्रोजेक्ट्स' },
              ...(resumeData.isBioDataMode ? [{ id: 'biodata', label: 'बायो-डाटा फील्ड्स' }] : [])
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFormSection(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  activeFormSection === tab.id
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SECTION: PERSONAL INFO */}
          {activeFormSection === 'personal' && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">पूरा नाम (Full Name) *</label>
                <input
                  type="text"
                  value={resumeData.fullName}
                  onChange={e => setResumeData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">पद / टाइटल (Job Title / Designation) *</label>
                <input
                  type="text"
                  value={resumeData.professionalTitle}
                  onChange={e => setResumeData(prev => ({ ...prev, professionalTitle: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">मोबाइल नंबर *</label>
                  <input
                    type="text"
                    value={resumeData.phone}
                    onChange={e => setResumeData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ईमेल आईडी *</label>
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={e => setResumeData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">शहर व राज्य *</label>
                  <input
                    type="text"
                    value={resumeData.location}
                    onChange={e => setResumeData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">LinkedIn / Profile URL</label>
                  <input
                    type="text"
                    value={resumeData.linkedin}
                    onChange={e => setResumeData(prev => ({ ...prev, linkedin: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">प्रोफेशनल सारांश (Career Summary / Objective)</label>
                <textarea
                  rows={3}
                  value={resumeData.summary}
                  onChange={e => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                />
              </div>
            </div>
          )}

          {/* SECTION: EXPERIENCE */}
          {activeFormSection === 'experience' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">कार्य अनुभव की सूची (Work Experience):</span>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>नया अनुभव जोड़ें</span>
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {resumeData.experience.map((exp, i) => (
                  <div key={exp.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-600 p-1"
                      title="हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <input
                        type="text"
                        placeholder="पद / Role (e.g. Sales Executive)"
                        value={exp.role}
                        onChange={e => {
                          const val = e.target.value;
                          setResumeData(prev => ({
                            ...prev,
                            experience: prev.experience.map(item => item.id === exp.id ? { ...item, role: val } : item)
                          }));
                        }}
                        className="p-1.5 rounded-lg border border-slate-300 bg-white font-bold"
                      />
                      <input
                        type="text"
                        placeholder="कंपनी (e.g. ABC Pvt Ltd)"
                        value={exp.company}
                        onChange={e => {
                          const val = e.target.value;
                          setResumeData(prev => ({
                            ...prev,
                            experience: prev.experience.map(item => item.id === exp.id ? { ...item, company: val } : item)
                          }));
                        }}
                        className="p-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="समयावधि (e.g. 2023 - Present)"
                      value={exp.period}
                      onChange={e => {
                        const val = e.target.value;
                        setResumeData(prev => ({
                          ...prev,
                          experience: prev.experience.map(item => item.id === exp.id ? { ...item, period: val } : item)
                        }));
                      }}
                      className="w-full p-1.5 rounded-lg border border-slate-300 bg-white"
                    />

                    <textarea
                      rows={2}
                      placeholder="जिम्मेदारियां व उपलब्धियां..."
                      value={exp.description}
                      onChange={e => {
                        const val = e.target.value;
                        setResumeData(prev => ({
                          ...prev,
                          experience: prev.experience.map(item => item.id === exp.id ? { ...item, description: val } : item)
                        }));
                      }}
                      className="w-full p-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: EDUCATION */}
          {activeFormSection === 'education' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">शैक्षणिक योग्यता (Education Qualifications):</span>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>नई डिग्री जोड़ें</span>
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-600 p-1"
                      title="हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <input
                      type="text"
                      placeholder="कोर्स / डिग्री (e.g. B.Com / 10+2)"
                      value={edu.degree}
                      onChange={e => {
                        const val = e.target.value;
                        setResumeData(prev => ({
                          ...prev,
                          education: prev.education.map(item => item.id === edu.id ? { ...item, degree: val } : item)
                        }));
                      }}
                      className="w-full p-1.5 rounded-lg border border-slate-300 bg-white font-bold"
                    />

                    <input
                      type="text"
                      placeholder="स्कूल / कॉलेज / बोर्ड का नाम"
                      value={edu.institution}
                      onChange={e => {
                        const val = e.target.value;
                        setResumeData(prev => ({
                          ...prev,
                          education: prev.education.map(item => item.id === edu.id ? { ...item, institution: val } : item)
                        }));
                      }}
                      className="w-full p-1.5 rounded-lg border border-slate-300 bg-white"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="वर्ष (e.g. 2021 - 2024)"
                        value={edu.year}
                        onChange={e => {
                          const val = e.target.value;
                          setResumeData(prev => ({
                            ...prev,
                            education: prev.education.map(item => item.id === edu.id ? { ...item, year: val } : item)
                          }));
                        }}
                        className="p-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="अंक / Percentage (e.g. 78%)"
                        value={edu.score}
                        onChange={e => {
                          const val = e.target.value;
                          setResumeData(prev => ({
                            ...prev,
                            education: prev.education.map(item => item.id === edu.id ? { ...item, score: val } : item)
                          }));
                        }}
                        className="p-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: SKILLS */}
          {activeFormSection === 'skills' && (
            <div className="space-y-3 text-xs">
              <label className="font-bold text-slate-700 block">
                कौशल (Skills - कॉमा लगाकर लिखें):
              </label>
              <textarea
                rows={4}
                value={resumeData.skills.join(', ')}
                onChange={e => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setResumeData(prev => ({ ...prev, skills: arr }));
                }}
                placeholder="उदा. React.js, MS Excel, Fast Typing, Good Communication"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs leading-relaxed"
              />

              <div className="flex flex-wrap gap-1.5 pt-1">
                {resumeData.skills.map((sk, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: PROJECTS & CERTS */}
          {activeFormSection === 'projects' && (
            <div className="space-y-3 text-xs">
              <label className="font-bold text-slate-700 block">
                सर्टिफिकेशन व भाषाएं (Languages & Certifications):
              </label>
              
              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 font-bold">प्रमाणपत्र (Certifications):</span>
                <textarea
                  rows={2}
                  value={resumeData.certifications.join('\n')}
                  onChange={e => {
                    const arr = e.target.value.split('\n').filter(Boolean);
                    setResumeData(prev => ({ ...prev, certifications: arr }));
                  }}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 text-xs"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 font-bold">भाषा ज्ञान (Languages):</span>
                <input
                  type="text"
                  value={resumeData.languages.join(', ')}
                  onChange={e => {
                    const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setResumeData(prev => ({ ...prev, languages: arr }));
                  }}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* SECTION: BIODATA SPECIFICS */}
          {activeFormSection === 'biodata' && resumeData.isBioDataMode && (
            <div className="space-y-3 text-xs animate-in fade-in">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">जन्म तिथि (Date of Birth)</label>
                  <input
                    type="text"
                    value={resumeData.dob || ''}
                    onChange={e => setResumeData(prev => ({ ...prev, dob: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">वैवाहिक स्थिति (Marital Status)</label>
                  <input
                    type="text"
                    value={resumeData.maritalStatus || ''}
                    onChange={e => setResumeData(prev => ({ ...prev, maritalStatus: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">पिता का नाम (Father's Name)</label>
                <input
                  type="text"
                  value={resumeData.fatherName || ''}
                  onChange={e => setResumeData(prev => ({ ...prev, fatherName: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">माता का नाम (Mother's Name)</label>
                <input
                  type="text"
                  value={resumeData.motherName || ''}
                  onChange={e => setResumeData(prev => ({ ...prev, motherName: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">स्थाई पता (Permanent Address)</label>
                <textarea
                  rows={2}
                  value={resumeData.fullAddress || ''}
                  onChange={e => setResumeData(prev => ({ ...prev, fullAddress: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>
            </div>
          )}

        </div>

        {/* ============================================================= */}
        {/* RIGHT COLUMN: REAL-TIME A4 PREVIEW (7 cols on lg, print container) */}
        {/* ============================================================= */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="flex items-center justify-between px-2 print:hidden">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>लाइव A4 प्रीव्यू (Real-Time Recruiter Standard)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ 98% ATS स्कोर पास
              </span>
            </div>
          </div>

          {/* THE A4 PRINT SHEET (Dynamically styled by selected template) */}
          <div 
            id="a4-resume-sheet"
            className={`w-full bg-white border-2 border-slate-300 shadow-xl rounded-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none print:m-0 print:p-0 p-6 sm:p-8 space-y-5 text-slate-900 ${currentTemplate.fontFamily}`}
            style={{ minHeight: '980px' }}
          >
            
            {/* TEMPLATE HEADER VARIATIONS */}
            {currentTemplate.headerStyle === 'banner' ? (
              <div 
                className="p-5 rounded-xl text-white space-y-1 shadow-sm"
                style={{ backgroundColor: currentTemplate.accentColor }}
              >
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                  {resumeData.fullName}
                </h1>
                <p className="text-xs sm:text-sm font-semibold opacity-90">
                  {resumeData.professionalTitle}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] opacity-80 pt-1">
                  <span>📞 {resumeData.phone}</span>
                  <span>✉️ {resumeData.email}</span>
                  <span>📍 {resumeData.location}</span>
                </div>
              </div>
            ) : currentTemplate.headerStyle === 'bordered' ? (
              <div 
                className="pb-4 border-b-4 space-y-1"
                style={{ borderColor: currentTemplate.accentColor }}
              >
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {resumeData.fullName}
                </h1>
                <p className="text-xs sm:text-sm font-bold" style={{ color: currentTemplate.accentColor }}>
                  {resumeData.professionalTitle}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-0.5">
                  <span>{resumeData.location}</span>
                  <span>•</span>
                  <span className="font-mono">{resumeData.phone}</span>
                  <span>•</span>
                  <span>{resumeData.email}</span>
                  {resumeData.linkedin && (
                    <>
                      <span>•</span>
                      <span className="text-blue-700">{resumeData.linkedin}</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* Minimal ATS Header */
              <div className="border-b-2 border-slate-900 pb-3 space-y-1 text-center">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-slate-900">
                  {resumeData.fullName}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-slate-700">
                  {resumeData.professionalTitle}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-0.5">
                  <span>{resumeData.location}</span>
                  <span>|</span>
                  <span className="font-mono">{resumeData.phone}</span>
                  <span>|</span>
                  <span>{resumeData.email}</span>
                  {resumeData.linkedin && (
                    <>
                      <span>|</span>
                      <span>{resumeData.linkedin}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* BIO-DATA SECTION (If Bio-Data mode is active) */}
            {resumeData.isBioDataMode && (
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                  व्यक्तिगत विवरण (Personal Bio-Data Details)
                </h3>
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                  {resumeData.dob && <div><strong>जन्म तिथि:</strong> {resumeData.dob}</div>}
                  {resumeData.fatherName && <div><strong>पिता का नाम:</strong> {resumeData.fatherName}</div>}
                  {resumeData.motherName && <div><strong>माता का नाम:</strong> {resumeData.motherName}</div>}
                  {resumeData.maritalStatus && <div><strong>वैवाहिक स्थिति:</strong> {resumeData.maritalStatus}</div>}
                  {resumeData.fullAddress && <div className="col-span-2"><strong>स्थाई पता:</strong> {resumeData.fullAddress}</div>}
                </div>
              </div>
            )}

            {/* CAREER SUMMARY */}
            {resumeData.summary && (
              <div className="space-y-1.5">
                <h3 
                  className="font-black text-xs uppercase tracking-wider border-b pb-1"
                  style={{ color: currentTemplate.accentColor, borderColor: currentTemplate.accentColor }}
                >
                  PROFESSIONAL SUMMARY
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  {resumeData.summary}
                </p>
              </div>
            )}

            {/* SKILLS SECTION */}
            {resumeData.skills.length > 0 && (
              <div className="space-y-1.5">
                <h3 
                  className="font-black text-xs uppercase tracking-wider border-b pb-1"
                  style={{ color: currentTemplate.accentColor, borderColor: currentTemplate.accentColor }}
                >
                  KEY SKILLS & COMPETENCIES
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {resumeData.skills.map((sk, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* WORK EXPERIENCE */}
            {resumeData.experience.length > 0 && (
              <div className="space-y-2.5">
                <h3 
                  className="font-black text-xs uppercase tracking-wider border-b pb-1"
                  style={{ color: currentTemplate.accentColor, borderColor: currentTemplate.accentColor }}
                >
                  WORK EXPERIENCE
                </h3>
                <div className="space-y-2.5">
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900">{exp.role}</span>
                        <span className="text-slate-500 font-mono text-[11px]">{exp.period}</span>
                      </div>
                      <span className="text-slate-600 block italic font-medium">{exp.company}</span>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed text-[11px]">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCATION */}
            {resumeData.education.length > 0 && (
              <div className="space-y-2">
                <h3 
                  className="font-black text-xs uppercase tracking-wider border-b pb-1"
                  style={{ color: currentTemplate.accentColor, borderColor: currentTemplate.accentColor }}
                >
                  EDUCATION & QUALIFICATIONS
                </h3>
                <div className="space-y-2">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="flex items-start justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 block">{edu.degree}</strong>
                        <span className="text-slate-600 block">{edu.institution}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-slate-500 font-mono text-[11px] block">{edu.year}</span>
                        <span className="font-bold text-slate-800 text-[11px]">{edu.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {resumeData.projects.length > 0 && (
              <div className="space-y-1.5">
                <h3 
                  className="font-black text-xs uppercase tracking-wider border-b pb-1"
                  style={{ color: currentTemplate.accentColor, borderColor: currentTemplate.accentColor }}
                >
                  KEY PROJECTS
                </h3>
                <div className="space-y-1.5 text-xs">
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="space-y-0.5">
                      <strong className="text-slate-900 text-xs block">• {proj?.title || ''}</strong>
                      <p className="text-slate-600 text-[11px] pl-3 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATIONS & LANGUAGES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {resumeData.certifications.length > 0 && (
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold uppercase tracking-wide text-slate-800 border-b border-slate-200 pb-0.5 text-[11px]">
                    Certifications
                  </h4>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                    {resumeData.certifications.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}

              {resumeData.languages.length > 0 && (
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold uppercase tracking-wide text-slate-800 border-b border-slate-200 pb-0.5 text-[11px]">
                    Languages Known
                  </h4>
                  <p className="text-[11px] text-slate-700">
                    {resumeData.languages.join(' • ')}
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER DECLARATION (For Indian Bio-Data / Govt Job Standard) */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
              <span>घोषणा: मैं प्रमाणित करता/करती हूँ कि ऊपर दी गई सभी जानकारी पूर्णतः सत्य है।</span>
              <span className="font-bold text-slate-600">हस्ताक्षर / Signature: {resumeData.fullName}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
