import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Calculator, 
  FileText, 
  Sparkles, 
  Search, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Award, 
  Compass, 
  Building2, 
  Landmark, 
  Atom, 
  Layers, 
  HelpCircle, 
  ArrowRight,
  BookMarked,
  Microscope,
  Cpu,
  Stethoscope,
  Briefcase,
  ShieldCheck,
  Scale,
  Monitor,
  CheckCircle2,
  UserCheck,
  User,
  Heart,
  Lightbulb,
  Zap,
  TrendingUp,
  FileSpreadsheet,
  Palette,
  Terminal,
  Send,
  Crown,
  Share2
} from 'lucide-react';
import { PageType } from '../types';

interface StudentStudyPageProps {
  onNavigate: (page: PageType) => void;
  onOpenAiChatWithQuery?: (query: string) => void;
}

export const StudentStudyPage: React.FC<StudentStudyPageProps> = ({
  onNavigate,
  onOpenAiChatWithQuery
}) => {
  const [activeTab, setActiveTab] = useState<
    'smart_interview' | 'adca_course' | 'gk_geography' | 'classes_notes' | 'formulas' | 'bonafide' | 'scholarships' | 'careers' | 'elibrary'
  >('smart_interview');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Smart Interview / Onboarding State for Student & Parent
  const [interviewRole, setInterviewRole] = useState<'student' | 'parent'>('student');
  const [interviewName, setInterviewName] = useState<string>('');
  const [interviewGrade, setInterviewGrade] = useState<string>('class_11_12');
  const [interviewGoal, setInterviewGoal] = useState<string>('computer_earning');
  const [interviewGenerated, setInterviewGenerated] = useState<boolean>(true);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAskAI = (question: string) => {
    if (onOpenAiChatWithQuery) {
      onOpenAiChatWithQuery(question);
    }
  };

  // Grade labels and details
  const gradeDetails: Record<string, { label: string; stream: string; focus: string; recommendedPlan: { id: number; name: string; price: number; incentive: number; reason: string } }> = {
    class_1_8: {
      label: 'कक्षा 1 से 8 (Primary & Middle)',
      stream: 'बुनियादी शिक्षा, गणित एवं विज्ञान नींव',
      focus: 'NCERT बुक्स, बेसिक कंप्यूटर ज्ञान, हिंदी व अंग्रेजी रीडिंग, सरल गणितीय सूत्र।',
      recommendedPlan: {
        id: 1,
        name: 'प्लान 1 - बेसिक सपोर्ट प्लान',
        price: 10,
        incentive: 7,
        reason: 'अत्यंत किफायती शुरुआत, डिजिटल साक्षरता व बेसिक अध्ययन सामग्री तक पूर्ण पहुंच।'
      }
    },
    class_9_10: {
      label: 'कक्षा 9वीं व 10वीं (मैट्रिक बोर्ड तैयारी)',
      stream: 'माध्यमिक शिक्षा (CBSE / State Boards)',
      focus: 'गणित-विज्ञान फॉर्मूला, सामाजिक विज्ञान नोट्स, त्रिकोणमिति, बोर्ड मॉडल पेपर और कंप्यूटर फंडामेंटल्स।',
      recommendedPlan: {
        id: 2,
        name: 'प्लान 2 - स्टूडेंट डिजिटल किट',
        price: 49,
        incentive: 34.30,
        reason: '10वीं बोर्ड नोट्स, फॉर्मूला शीट्स, 24x7 AI डाउट सॉल्वर व साथी विद्यार्थियों को शेयर कर दैनिक पॉकेट मनी कमाने की सुविधा।'
      }
    },
    class_11_12_sci: {
      label: 'कक्षा 11वीं-12वीं साइंस (PCM / PCB - JEE / NEET)',
      stream: 'साइंस (Physics, Chemistry, Math / Bio)',
      focus: 'NEET / JEE एंट्रेंस गाइड, कैलकुलस, ऑर्गेनिक केमिस्ट्री, बायोलॉजी डायग्राम्स और नेशनल स्कॉलरशिप (NSP)।',
      recommendedPlan: {
        id: 3,
        name: 'प्लान 3 - करियर ग्रोथ प्लान',
        price: 99,
        incentive: 69.30,
        reason: 'JEE/NEET एवं बोर्ड्स के लिए एडवांस्ड नोट्स, AI करियर रोडमैप्स व 70% इंसेंटिव से अपनी कोचिंग फीस खुद निकालने का अवसर।'
      }
    },
    class_11_12_arts_com: {
      label: 'कक्षा 11वीं-12वीं (Arts / Commerce)',
      stream: 'कॉमर्स व आर्ट्स (Accounts, Economics, History, Pol Sci)',
      focus: 'Tally Prime बेसिक्स, एकाउंटिंग प्रिंसिपल्स, भारतीय संविधान, अर्थव्यवस्था और CUET / बैंकिंग तैयारी।',
      recommendedPlan: {
        id: 3,
        name: 'प्लान 3 - करियर ग्रोथ प्लान',
        price: 99,
        incentive: 69.30,
        reason: 'कॉमर्स व आर्ट्स के बेहतरीन रिसोर्सेज, एकाउंटिंग नोट्स और डिजिटल रेफरल अर्निंग।'
      }
    },
    college_degree: {
      label: 'स्नातक / कॉलेज (B.A., B.Sc., B.Com., BCA, B.Tech)',
      stream: 'उच्च शिक्षा व वोकेशनल कोर्सेज',
      focus: 'सेमेस्टर नोट्स, बोनाफाइड सर्टिफिकेट (PMS/NSP), ADCA कंप्यूटर डिप्लोमा, सिविल सर्विस (UPSC/BPSC) व इंटर्नशिप।',
      recommendedPlan: {
        id: 4,
        name: 'प्लान 4 - स्किल मास्टर व वोकेशनल प्लान',
        price: 199,
        incentive: 139.30,
        reason: 'ADCA फुल कोर्स गाइड, Tally GST, बोनाफाइड जनरेटर व ₹139.30 प्रति सफल रेफरल से पढ़ाई के साथ आत्मनिर्भर आय।'
      }
    },
    job_aspirant: {
      label: 'प्रतियोगी परीक्षा / जॉब की तैयारी (SSC, Railway, Bank, Police)',
      stream: 'प्रतियोगी परीक्षा एवं रोजगार कौशल',
      focus: 'दैनिक करंट अफेयर्स, भारतीय भूगोल (नदियां/उद्गम), संविधान अनुच्छेद, रीजनिंग ट्रिक्स और वर्क-फ्रॉम-होम इनकम।',
      recommendedPlan: {
        id: 4,
        name: 'प्लान 4 - स्किल मास्टर व वोकेशनल प्लान',
        price: 199,
        incentive: 139.30,
        reason: 'प्रतियोगी परीक्षा स्टडी बंडल, ADCA सर्टिफिकेशन गाइड और 70% सीधा पारदर्शी इंसेंटिव।'
      }
    }
  };

  // Indian Geography & GK database
  const gkTopics = [
    {
      id: 'gk-godavari',
      title: 'गोदावरी नदी (Godavari River) - उद्गम, विस्तार व महत्व',
      category: 'भारतीय भूगोल (Indian Geography)',
      origin: 'त्र्यंबकेश्वर (Trimbakeshwar), नासिक जिला, महाराष्ट्र (ब्रह्मगिरि पर्वत)',
      length: '1,465 किमी (भारत की दूसरी सबसे लंबी नदी)',
      end: 'बंगाल की खाड़ी (आंध्र प्रदेश)',
      keyPoints: [
        'गोदावरी को "दक्षिण गंगा" (Ganges of the South) एवं "वृद्ध गंगा" कहा जाता है।',
        'यह प्रायद्वीपीय भारत (Peninsular India) की सबसे बड़ी नदी प्रणाली है।',
        'सहायक नदियाँ: प्राणहिता, इंद्रावती, मंजीरा, प्रवरा, पूर्णा, वैनगंगा और पेनगंगा।',
        'नासिक में गोदावरी के तट पर प्रसिद्ध कुंभ मेला आयोजित होता है।'
      ],
      aiPrompt: 'गोदावरी नदी का उद्गम स्थल, सहायक नदियां और भारत के भूगोल में इसका महत्व विस्तार से बताएं।'
    },
    {
      id: 'gk-ganga',
      title: 'गंगा नदी (Ganga River) - राष्ट्रीय नदी व उद्गम',
      category: 'भारतीय भूगोल (Indian Geography)',
      origin: 'गंगोत्री हिमनद (भागीरथी), उत्तरकाशी, उत्तराखंड',
      length: '2,525 किमी (भारत की सबसे लंबी नदी)',
      end: 'बंगाल की खाड़ी (सुंदरवन डेल्टा)',
      keyPoints: [
        'देवप्रयाग में भागीरथी और अलकनंदा के संगम से इसका नाम गंगा पड़ता है।',
        'वर्ष 2008 में भारत सरकार द्वारा इसे राष्ट्रीय नदी (National River) घोषित किया गया।',
        'सहायक नदियाँ: यमुना, घाघरा, गंडक, कोसी, सोन, रामगंगा।',
        'यह विश्व का सबसे बड़ा डेल्टा "सुंदरवन डेल्टा" बनाती है।'
      ],
      aiPrompt: 'गंगा नदी प्रणाली, पंच प्रयाग और सुंदरवन डेल्टा के बारे में विस्तृत नोट्स दें।'
    },
    {
      id: 'gk-narmada',
      title: 'नर्मदा नदी (Narmada River) - पश्चिम वाहिनी नदी',
      category: 'भारतीय भूगोल (Indian Geography)',
      origin: 'अमरकंटक पठार (Amarkantak), अनूपपुर जिला, मध्य प्रदेश',
      length: '1,312 किमी',
      end: 'खंभात की खाड़ी (अरब सागर), गुजरात',
      keyPoints: [
        'यह भ्रंश घाटी (Rift Valley) से होकर पश्चिम की ओर बहने वाली प्रमुख नदी है।',
        'जबलपुर (म.प्र.) के निकट भेड़ाघाट में प्रसिद्ध "धुआंधार जलप्रपात" बनाती है।',
        'सरदार सरोवर बांध इसी नदी पर स्थित है, जिसके पास स्टैच्यू ऑफ यूनिटी है।'
      ],
      aiPrompt: 'नर्मदा नदी भ्रंश घाटी से क्यों बहती है और इसका डेल्टा न बनाकर एश्चुअरी बनाने का क्या कारण है?'
    },
    {
      id: 'gk-constitution',
      title: 'भारतीय संविधान (Indian Constitution) - मुख्य तथ्य व अनुच्छेद',
      category: 'भारतीय राजव्यवस्था (Indian Polity)',
      origin: '26 नवंबर 1949 को अंगीकृत, 26 जनवरी 1950 को लागू',
      length: 'विश्व का सबसे लंबा लिखित संविधान (395 अनुच्छेद, 12 अनुसूचियां, 25 भाग)',
      end: 'डॉ. बी. आर. अम्बेडकर (प्रारूप समिति के अध्यक्ष / संविधान निर्माता)',
      keyPoints: [
        'मौलिक अधिकार (Fundamental Rights): अनुच्छेद 12 से 35 (भाग 3 - भारत का मैग्नाकार्टा)।',
        'मौलिक कर्तव्य (Fundamental Duties): अनुच्छेद 51A (42वें संशोधन 1976 द्वारा जोड़े गए)।',
        'नीति निर्देशक तत्व (DPSP): अनुच्छेद 36 से 51 (आयरलैंड के संविधान से प्रेरित)।',
        'अनुच्छेद 32 को डॉ. अम्बेडकर ने "संविधान की आत्मा और हृदय" कहा है।'
      ],
      aiPrompt: 'भारतीय संविधान के मुख्य अनुच्छेद, मौलिक अधिकार और मौलिक कर्तव्यों की पूरी सूची प्रदान करें।'
    },
    {
      id: 'gk-capitals',
      title: 'भारत के 28 राज्य, 8 केंद्रशासित प्रदेश और राजधानियां (India Capitals)',
      category: 'सामान्य ज्ञान (General Knowledge)',
      origin: 'भारत की राष्ट्रीय राजधानी: नई दिल्ली (New Delhi)',
      length: '28 राज्य + 8 केंद्रशासित प्रदेश (Union Territories)',
      end: 'राष्ट्रपति भवन, नई दिल्ली',
      keyPoints: [
        'बिहार: पटना | उत्तर प्रदेश: लखनऊ | मध्य प्रदेश: भोपाल | राजस्थान: जयपुर | महाराष्ट्र: मुंबई',
        'पश्चिम बंगाल: कोलकाता | तमिलनाडु: चेन्नई | कर्नाटक: बेंगलुरु | गुजरात: गांधीनगर | पंजाब/हरियाणा: चंडीगढ़',
        'असम: दिसपुर | ओडिशा: भुवनेश्वर | झारखंड: रांची | छत्तीसगढ़: रायपुर | केरल: तिरुवनंतपुरम',
        'लद्दाख: लेह | जम्मू और कश्मीर: श्रीनगर (ग्रीष्म) / जम्मू (शीत) | अंडमान निकोबार: पोर्ट ब्लेयर'
      ],
      aiPrompt: 'भारत के सभी 28 राज्यों और 8 केंद्र शासित प्रदेशों की राजधानियों और मुख्यमंत्रियों की सूची दें।'
    }
  ];

  // ADCA 6 Modules Data
  const adcaModules = [
    {
      id: 'mod1',
      title: 'मॉड्यूल 1: कंप्यूटर फंडामेंटल्स व ऑपरेटिंग सिस्टम (OS & Basics)',
      duration: 'माह 1 - 2',
      topics: [
        'कंप्यूटर का इतिहास, पीढ़ियां (Generations), CPU, RAM, ROM, मदरबोर्ड व हार्डवेयर आर्किटेक्चर।',
        'Windows 11 एवं Linux ऑपरेटिंग सिस्टम नेविगेशन, फाइल मैनेजमेंट, फोल्डर स्ट्रक्चर ও सेटिंग्स।',
        'हिंदी (KrutiDev/Mangal) एवं अंग्रेजी टाइपिंग स्पीड 30-40 WPM हासिल करने की वैज्ञानिक तकनीक।',
        'कीबोर्ड शॉर्टकट कीज (Ctrl+C, Ctrl+V, Win+D, Alt+Tab, आदि) और पेरिफेरल्स इंस्टॉलेशन।'
      ],
      practical: 'कंप्यूटर असेंबलिंग बेसिक्स, ऑपरेटिंग सिस्टम इंस्टॉलेशन व टाइपिंग टेस्ट पास करना।'
    },
    {
      id: 'mod2',
      title: 'मॉड्यूल 2: माइक्रोसॉफ्ट ऑफिस प्रो सूट (MS Word, Excel, PowerPoint & Access)',
      duration: 'माह 3 - 5',
      topics: [
        'MS Word 365: ऑफिशियल लेटर ड्राफ्टिंग, रिज्यूमे मेकिंग, मेल मर्ज (Mail Merge), टेबल व वाटरमार्क।',
        'MS Excel Pro: SUM, IF, VLOOKUP, HLOOKUP, XLOOKUP, INDEX-MATCH, पिवट टेबल्स, डेटा वैलिडेशन।',
        'ऑटोमेटेड सैलरी शीट, मार्कशीट, GST बिलिंग शीट व कंडीशनल फॉर्मेटिंग।',
        'MS PowerPoint: प्रोफेशनल बिजनेस प्रेजेंटेशन, एनिमेशन इफेक्ट्स, ट्रांजिशन व स्लाइड मास्टर।',
        'MS Access: डेटाबेस मैनेजमेंट, टेबल्स, क्वेरी, फॉर्म्स व रिपोर्ट्स जनरेशन।'
      ],
      practical: 'लाइव स्कूल मार्कशीट व कंपनी अटेंडेंस सैलरी रजिस्टर तैयार करना।'
    },
    {
      id: 'mod3',
      title: 'मॉड्यूल 3: वित्तीय लेखांकन व टैली प्राइम (Tally Prime 4.0 + GST Accounting)',
      duration: 'माह 6 - 7',
      topics: [
        'अकाउंटिंग के सुनहरे नियम (Golden Rules of Accounting - Real, Personal, Nominal)।',
        'Tally Prime 4.0 में कंपनी निर्माण, लेजर क्रिएशन, ग्रुप्स व स्टॉक आइटम मैनेजमेंट।',
        'वाउचर एंट्री: पेमेंट, रसीद, परचेज, सेल्स, कॉन्ट्रा व जर्नल वाउचर्स।',
        'GST इनवॉइसिंग (CGST, SGST, IGST), ई-वे बिल जनरेशन व टैक्स रिटर्न रिपोर्ट्स।',
        'प्रॉफिट एंड लॉस अकाउंट (P&L), बैलेंस शीट व ट्रायल बैलेंस का विस्तृत विश्लेषण।'
      ],
      practical: 'एक संपूर्ण रिटेल/होलसेल फर्म के 1 महीने के वास्तविक लेनदेन की टैली एंट्री।'
    },
    {
      id: 'mod4',
      title: 'मॉड्यूल 4: डेस्कटॉप पब्लिशिंग व ग्राफिक्स (Adobe Photoshop & Canva Pro)',
      duration: 'माह 8 - 9',
      topics: [
        'Adobe Photoshop 2026: टूल्स (Lasso, Pen Tool, Magic Wand), लेयर्स, मास्किंग व ब्लेंडिंग।',
        'पासपोर्ट साइज फोटो बनाना (8 फोटो 4x6 शीट पर), बैकग्राउंड रिमूव करना व कलर करेक्शन।',
        'विजिटिंग कार्ड, शादी कार्ड, बैनर, पोस्टर, स्कूल ID कार्ड व सर्टिफिकेट डिजाइनिंग।',
        'Canva Pro: सोशल मीडिया पोस्ट, यूट्यूब थंबनेल व डिजिटल विज्ञापन क्रिएशन।'
      ],
      practical: 'स्टूडेंट ID कार्ड व कोचिंग संस्थान का प्रोमोशनल फ्लेक्स बैनर तैयार करना।'
    },
    {
      id: 'mod5',
      title: 'मॉड्यूल 5: इंटरनेट, सरकारी ऑनलाइन पोर्टल व साइबर सुरक्षा (Cyber & Citizen Services)',
      duration: 'माह 10',
      topics: [
        'सरकारी ऑनलाइन फॉर्म भरना: SSC, Railway, BPSC, UPSC, पुलिस भर्ती फॉर्म व फोटो रिसाइजर।',
        'RTPS बिहार/UP पोर्टल: जाति, आय, निवास प्रमाण पत्र, दाखिल-खारिज, LPC व e-PAN अप्लाई।',
        'EPFO UAN क्लेम, आधार-पैन लिंकिंग, IRCTC तत्काल ट्रेन टिकट व फ्लाइट बुकिंग।',
        'साइबर फ्रॉड से बचाव, Two-Factor Authentication (2FA), सुरक्षित ऑनलाइन बैंकिंग व UPI।'
      ],
      practical: 'लाइव RTPS पोर्टल पर जाति/आय प्रमाण पत्र का डमी आवेदन व रसीद डाउनलोड।'
    },
    {
      id: 'mod6',
      title: 'मॉड्यूल 6: 2026 AI टूल्स, प्रॉम्प्ट इंजीनियरिंग व डिजिटल फ्रीलांसिंग',
      duration: 'माह 11 - 12',
      topics: [
        'ChatGPT एवं Google Gemini का ऑफिस कार्यों में उपयोग: स्वचालित ईमेल, रिपोर्ट व कंटेंट राइटिंग।',
        'एक्सेल फॉर्मूला व कोडिंग के लिए AI प्रॉम्प्ट्स बनाना और त्रुटियों को तुरंत ठीक करना।',
        'डिजिटल फ्रीलांसिंग: Fiverr, Upwork व लोकल दुकानों से डेटा एंट्री व डिजाइनिंग प्रोजेक्ट्स पाना।',
        'IOIS प्लेटफॉर्म पर 70% डिजिटल इंसेंटिव मॉडल से घर बैठे ₹15,000-₹30,000/माह कमाने की रणनीति।'
      ],
      practical: 'AI प्रॉम्प्ट्स से 10 सेकंड में प्रोफेशनल रिज्यूमे व प्रोजेक्ट रिपोर्ट तैयार करना।'
    }
  ];

  // Bonafide Certificate Templates
  const bonafideTemplates = [
    {
      id: 'bonafide-college',
      title: '🎓 कॉलेज/विश्वविद्यालय बोनाफाइड सर्टिफिकेट फॉर्मेट (Scholarship & PMS)',
      purpose: 'बिहार पोस्ट-मैट्रिक PMS, NSP नेशनल स्कॉलरशिप, बैंक एजुकेशन लोन व रेलवे पास हेतु',
      body: `BONAFIDE CERTIFICATE / संस्थान प्रमाण पत्र
(To be issued on Institution's Official Letterhead)

Ref. No.: ________________________                                Date: ____/____/2026

This is to certify that Mr./Ms. ____________________________________________________
Son/Daughter of Shri _______________________________________________________________
is a bonafide and regular student of this college/institute in Course: ___________________
Academic Session: 2025-2026, Year/Semester: ______________, Roll No: ________________
Registration / Enrollment Number: __________________________________________________

His/Her date of birth according to institution records is: ____/____/________.
He/She bears a good moral character and conducts himself/herself well.

This certificate is issued on the student's request for the purpose of applying for:
[ ] National Scholarship Portal (NSP)
[ ] Bihar Post Matric Scholarship (PMS)
[ ] Educational Loan / State Welfare Scheme

Total Fee Structure for Current Academic Year: ₹ ____________________

Authorized Signatory
Principal / Dean / Registrar
(Seal & Signature of Institution)`
    },
    {
      id: 'bonafide-application',
      title: '✍️ प्रिंसिपल को बोनाफाइड सर्टिफिकेट जारी करने हेतु आवेदन पत्र (Application Format)',
      purpose: 'कॉलेज या स्कूल में बोनाफाइड प्राप्त करने के लिए छात्र द्वारा लिखा जाने वाला प्रार्थना पत्र',
      body: `सेवा में,
श्रीमान प्रधानाचार्य महोदय / प्राचार्य जी,
[कॉलेज / विद्यालय का नाम लिखें]
[शहर / जिले का नाम, राज्य]

विषय: बोनाफाइड सर्टिफिकेट (Bonafide Certificate) निर्गत करने के संबंध में प्रार्थना पत्र।

महाशय,
सविनय निवेदन है कि मैं [अपना पूरा नाम लिखें], आपके महाविद्यालय में [कक्षा/कोर्स जैसे: B.A. Part-1 / B.Sc / 12th] का एक नियमित छात्र/छात्रा हूँ। मेरा रोल नंबर [____] तथा रजिस्ट्रेशन नंबर [____] है।

मुझे राज्य सरकार / केंद्र सरकार के [छात्रवृत्ति का नाम जैसे: Bihar Post Matric PMS / NSP Scholarship] हेतु ऑनलाइन आवेदन करना है, जिसके लिए कॉलेज द्वारा हस्ताक्षरित 'बोनाफाइड सर्टिफिकेट' संलग्न करना अनिवार्य है।

अतः आपसे नम्र निवेदन है कि मुझे उक्त छात्रवृत्ति हेतु बोनाफाइड सर्टिफिकेट प्रदान करने की कृपा करें। इसके लिए मैं सदैव आपका आभारी रहूँगा।

संलग्न दस्तावेज:
1. कॉलेज नामांकन रसीद (Admission Fee Receipt)
2. आधार कार्ड की छायाप्रति
3. पिछले वर्ष की अंकतालिका (Marksheet)

आपका आज्ञाकारी छात्र/छात्रा
नाम: ___________________________
कक्षा/सत्र: _______________________
रोल नंबर: ________________________
मोबाइल नंबर: _____________________
दिनांक: ____/____/2026`
    }
  ];

  // Mathematical & Science Formulas
  const formulasData = [
    {
      topic: 'बीजगणित (Algebra Formulas)',
      items: [
        { name: 'द्विपद वर्ग (Square Formulas)', formula: '(a + b)² = a² + 2ab + b²  |  (a - b)² = a² - 2ab + b²' },
        { name: 'वर्गों का अंतर (Difference of Squares)', formula: 'a² - b² = (a - b)(a + b)' },
        { name: 'द्विघात सूत्र (Quadratic Formula)', formula: 'ax² + bx + c = 0  =>  x = [-b ± √(b² - 4ac)] / (2a)' },
        { name: 'त्रिघात सूत्र (Cube Formulas)', formula: '(a + b)³ = a³ + b³ + 3ab(a + b)  |  a³ + b³ = (a + b)(a² - ab + b²)' }
      ]
    },
    {
      topic: 'त्रिकोणमिति (Trigonometry Formulas)',
      items: [
        { name: 'मूल सर्वसमिकाएँ (Basic Identities)', formula: 'sin²θ + cos²θ = 1  |  1 + tan²θ = sec²θ  |  1 + cot²θ = cosec²θ' },
        { name: 'अनुपात सूत्र (Ratio Definitions)', formula: 'tanθ = sinθ/cosθ  |  cotθ = cosθ/sinθ  |  secθ = 1/cosθ' },
        { name: 'द्विगुण कोण (Double Angle)', formula: 'sin(2θ) = 2sinθcosθ  |  cos(2θ) = cos²θ - sin²θ = 2cos²θ - 1 = 1 - 2sin²θ' },
        { name: 'मान सारणी (Values at 0°, 30°, 45°, 60°, 90°)', formula: 'sin(30°)=1/2, sin(45°)=1/√2, sin(60°)=√3/2, cos(60°)=1/2' }
      ]
    },
    {
      topic: 'क्षेत्रमिति व ज्यामिति (Mensuration Formulas)',
      items: [
        { name: 'वृत्त (Circle)', formula: 'क्षेत्रफल (Area) = πr²  |  परिधि (Circumference) = 2πr' },
        { name: 'बेलन (Cylinder)', formula: 'आयतन (Volume) = πr²h  |  वक्र पृष्ठ (CSA) = 2πrh  |  कुल पृष्ठ = 2πr(h + r)' },
        { name: 'शंकु (Cone)', formula: 'आयतन = (1/3)πr²h  |  वक्र पृष्ठ = πrl (जहाँ l = √(r² + h²))' },
        { name: 'गोला (Sphere)', formula: 'आयतन = (4/3)πr³  |  पृष्ठीय क्षेत्रफल = 4πr²' }
      ]
    },
    {
      topic: 'भौतिकी व रसायन (Physics & Chemistry Formulas)',
      items: [
        { name: 'न्यूटन के गति नियम (Newton Laws of Motion)', formula: 'v = u + at  |  s = ut + (1/2)at²  |  v² = u² + 2as  |  F = ma' },
        { name: 'कार्य व ऊर्जा (Work & Energy)', formula: 'कार्य (W) = F · d · cosθ  |  गतिज ऊर्जा (KE) = (1/2)mv²  |  PE = mgh' },
        { name: 'ओम का नियम (Ohm\'s Law)', formula: 'V = I · R  |  विद्युत शक्ति (P) = V · I = I²R = V²/R' },
        { name: 'आदर्श गैस समीकरण (Ideal Gas Equation)', formula: 'P · V = n · R · T (जहाँ R = 8.314 J/mol·K)' }
      ]
    }
  ];

  // Scholarship Programs
  const scholarships = [
    {
      name: 'नेशनल स्कॉलरशिप पोर्टल (NSP 2.0)',
      portal: 'scholarships.gov.in',
      eligibility: 'कक्षा 1 से 12वीं, कॉलेज, यूनिवर्सिटी एवं पोस्ट ग्रेजुएट छात्र (Pre-Matric, Post-Matric, Top Class)',
      amount: '₹5,000 से ₹50,000+ प्रति वर्ष',
      docs: 'आधार कार्ड, आय प्रमाण पत्र, जाति प्रमाण पत्र, बैंक पासबुक (Aadhaar NPCI लिंक्ड), बोनाफाइड सर्टिफिकेट।'
    },
    {
      name: 'बिहार पोस्ट मैट्रिक स्कॉलरशिप (PMS)',
      portal: 'pmsonline.bih.nic.in',
      eligibility: 'बिहार के SC, ST, BC एवं EBC वर्ग के छात्र जो 10वीं के बाद ITI, डिप्लोमा, B.A, B.Sc, B.Com, B.Tech, मेडिकल में अध्ययनरत हैं',
      amount: 'सरकारी फीस प्रतिपूर्ति (₹2,000 से ₹1,00,000+ तक)',
      docs: '10वीं मार्कशीट, अंतिम परीक्षा अंक पत्र, कॉलेज बोनाफाइड सर्टिफिकेट, फीस रसीद, जाति, आय व निवास।'
    },
    {
      name: 'मुख्यमंत्री कन्या उत्थान योजना (Medhasoft)',
      portal: 'medhasoft.bih.nic.in',
      eligibility: 'बिहार की सभी छात्राएं (10वीं फर्स्ट डिवीजन, 12वीं उत्तीर्ण अविवाहित कन्या व स्नातक उत्तीर्ण छात्राएं)',
      amount: '10वीं पास: ₹10,000 | 12वीं पास: ₹25,000 | स्नातक पास: ₹50,000',
      docs: 'अंक तालिका, आधार कार्ड, निवास प्रमाण पत्र, छात्रा का स्वयं का बैंक खाता।'
    },
    {
      name: 'AICTE प्रगति एवं सक्षम छात्रवृत्ति',
      portal: 'aicte-india.org',
      eligibility: 'AICTE मान्यता प्राप्त संस्थानों में B.Tech/Diploma करने वाली छात्राएं व दिव्यांग विद्यार्थी',
      amount: '₹50,000 प्रति वर्ष (ट्यूशन फीस व आकस्मिक खर्च)',
      docs: 'कॉलेज अलॉटमेंट लेटर, बोनाफाइड सर्टिफिकेट, पारिवारिक आय प्रमाण पत्र।'
    }
  ];

  // Career Roadmaps
  const careerRoadmaps = [
    {
      title: '🩺 डॉक्टर (Doctor / MBBS / BDS / BAMS)',
      icon: Stethoscope,
      color: 'from-emerald-600 to-teal-700',
      steps: [
        '10वीं उत्तीर्ण करने के बाद 11वीं-12वीं में अनिवार्य रूप से PCB (Physics, Chemistry, Biology) विषय चुनें।',
        'NTA द्वारा आयोजित NEET-UG प्रवेश परीक्षा में 720 अंकों में से उच्च स्कोर प्राप्त करें।',
        'MCC / राज्य काउंसलिंग द्वारा सरकारी मेडिकल कॉलेज में 5.5 वर्ष का MBBS कोर्स पूर्ण करें।',
        '1 वर्ष की अनिवार्य इंटर्नशिप के बाद NMC में डॉक्टर के रूप में पंजीकृत हों और MD/MS की तैयारी करें।'
      ]
    },
    {
      title: '💻 सॉफ्टवेयर इंजीनियर / टेक लीड (IIT JEE / B.Tech / AI)',
      icon: Cpu,
      color: 'from-blue-600 to-indigo-700',
      steps: [
        '10वीं के बाद 11वीं-12वीं में PCM (Physics, Chemistry, Mathematics) विषय लें।',
        'JEE Main एवं JEE Advanced परीक्षा उत्तीर्ण कर IITs, NITs या IIITs में Computer Science / AI शाखा में प्रवेश लें।',
        'डेटा स्ट्रक्चर्स, एल्गोरिदम (DSA), वेब डेवलपमेंट और AI/ML में दक्षता हासिल करें।',
        'इंटर्नशिप्स एवं कैंपस प्लेसमेंट द्वारा शीर्ष टेक कंपनियों में सॉफ्टवेयर इंजीनियर बनें।'
      ]
    },
    {
      title: '🏛️ सिविल सेवा / प्रशासनिक अधिकारी (IAS / IPS / BPSC / PCS)',
      icon: Landmark,
      color: 'from-amber-600 to-yellow-700',
      steps: [
        'किसी भी मान्यता प्राप्त विश्वविद्यालय से किसी भी विषय (Arts / Science / Commerce) में स्नातक (Graduation) पूरा करें।',
        'NCERT कक्षा 6 से 12वीं की किताबों का गहन अध्ययन करें और दैनिक समाचार पत्रों से Current Affairs तैयार करें।',
        'UPSC Civil Services परीक्षा के तीन चरण: 1. प्रारंभिक परीक्षा (Prelims), 2. मुख्य परीक्षा (Mains 9 पेपर्स), 3. साक्षात्कार (Interview) उत्तीर्ण करें।',
        'LBSNAA मसूरी में प्रशिक्षण प्राप्त कर देश के सर्वोच्च प्रशासनिक पदों पर सेवा दें।'
      ]
    },
    {
      title: '🎖️ रक्षा सेवा / सेना अधिकारी (NDA / CDS / Air Force / Navy)',
      icon: ShieldCheck,
      color: 'from-red-600 to-rose-700',
      steps: [
        '12वीं (PCM) उत्तीर्ण छात्र UPSC द्वारा आयोजित NDA (National Defence Academy) परीक्षा दे सकते हैं (आयु 16.5 - 19.5 वर्ष)।',
        'स्नातक (Graduation) के बाद CDS (Combined Defence Services) परीक्षा दें।',
        '5-दिवसीय SSB (Services Selection Board) इंटरव्यू एवं मेडिकल टेस्ट पास करें।',
        'NDA खड़कवासला या IMA देहरादून में सैन्य प्रशिक्षण प्राप्त कर लेफ्टिनेंट / फ्लाइंग ऑफिसर बनें।'
      ]
    }
  ];

  // Dynamic values based on interview selection
  const selectedGradeInfo = gradeDetails[interviewGrade] || gradeDetails.class_11_12_sci;

  return (
    <div id="student-study-hub" className="space-y-10 pb-16 animate-fade-in max-w-6xl mx-auto">
      
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 border border-amber-500/30 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 px-4 py-1.5 rounded-full text-amber-300 text-xs font-black uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>IOIS OFFICIAL STUDENT & PARENT EDUCATION HUB 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            📚 विद्यार्थी शिक्षा, <span className="tiranga-text">ADCA कंप्यूटर कोर्स</span> व करियर हब
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-4xl">
            कक्षा 1 से 12वीं, कॉलेज (BA, BSc, B.Com) व प्रतियोगी परीक्षा की तैयारी कर रहे छात्रों तथा अभिभावकों के लिए सम्पूर्ण डिजिटल केंद्र।
            यहाँ <strong>स्मार्ट इंटरव्यू व वेलकम गाइड</strong>, <strong>ADCA कंप्यूटर डिप्लोमा सिलेबस</strong>, <strong>NCERT बुक्स</strong>, 
            <strong> कॉलेज बोनाफाइड सर्टिफिकेट जनरेटर</strong> और <strong>70% इंसेंटिव से आत्मनिर्भर बनने की रणनीति</strong> उपलब्ध है।
          </p>

          {/* Quick AI Search bar for study / interview doubts */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-3xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="उदा. ADCA में क्या सिखाया जाता है, गोदावरी नदी का उद्गम, बोनाफाइड सर्टिफिकेट फॉर्मेट, 12वीं के बाद क्या करें..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/90 border border-slate-700 focus:border-amber-400 rounded-2xl text-white text-xs sm:text-sm focus:outline-none placeholder-slate-500 transition-all shadow-inner"
              />
            </div>
            <button
              onClick={() => {
                if (searchTerm.trim()) {
                  handleAskAI(searchTerm.trim());
                } else {
                  handleAskAI('नमस्ते! मुझे विद्यार्थी शिक्षा, ADCA कंप्यूटर कोर्स, 7 मास्टर प्लांस और बोनाफाइड सर्टिफिकेट के बारे में पूरी जानकारी दें।');
                }
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform hover:scale-[1.02] shrink-0"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
              <span>AI से तुरंत पूछें</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'smart_interview', label: '🎯 विद्यार्थी व अभिभावक इंटरव्यू', icon: UserCheck },
          { id: 'adca_course', label: '💻 ADCA कंप्यूटर मास्टर कोर्स', icon: Monitor },
          { id: 'gk_geography', label: '🌊 भारतीय भूगोल व GK', icon: Landmark },
          { id: 'bonafide', label: '📜 बोनाफाइड सर्टिफिकेट फॉर्मेट', icon: Award },
          { id: 'formulas', label: '📐 मैथ्स व साइंस फॉर्मूला', icon: Calculator },
          { id: 'scholarships', label: '🏛️ स्कॉलरशिप व PMS पोर्टल', icon: Building2 },
          { id: 'careers', label: '🎓 करियर रोडमैप (Doctor/IAS/Tech)', icon: Briefcase },
          { id: 'elibrary', label: '📖 फ्री NCERT व ई-लाइब्रेरी', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 font-black scale-105'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SMART INTERVIEW & WELCOME ROADMAP GENERATOR (REQUESTED BY USER) */}
      {/* ========================================================================= */}
      {activeTab === 'smart_interview' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top Interactive Questionnaire Box */}
          <div className="bg-slate-900/80 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase">
                  <UserCheck className="w-4 h-4" />
                  <span>2-MINUTE SMART ONBOARDING INTERVIEW</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white">
                  🎯 विद्यार्थी व अभिभावक साक्षात्कार (Student & Parent Guide)
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm">
                  अपनी वर्तमान स्थिति और लक्ष्य बताएं — IOIS सिस्टम तुरंत आपके लिए <strong>शाही स्वागत संदेश</strong>, <strong>अध्ययन रोडमैप</strong> और <strong>सर्वश्रेष्ठ IOIS प्लान</strong> सुझाएगा।
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setInterviewRole('student')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    interviewRole === 'student'
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>🎓 मैं विद्यार्थी हूँ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInterviewRole('parent')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    interviewRole === 'parent'
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>👨‍👩‍👧 मैं अभिभावक हूँ</span>
                </button>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Name Input */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <label className="font-bold text-slate-300 block">
                  1. {interviewRole === 'student' ? 'आपका शुभ नाम (Student Name):' : 'अभिभावक व बच्चे का नाम:'}
                </label>
                <input
                  type="text"
                  value={interviewName}
                  onChange={(e) => setInterviewName(e.target.value)}
                  placeholder={interviewRole === 'student' ? 'उदा. राहुल कुमार / प्रिया सिंह' : 'उदा. श्री राजेश शर्मा (पुत्र: अमित)'}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">नाम लिखने से स्वागत संदेश में आपका नाम पर्सनलाइज्ड रहेगा।</p>
              </div>

              {/* Class / Educational Status */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <label className="font-bold text-slate-300 block">
                  2. वर्तमान कक्षा या योग्यता (Current Grade):
                </label>
                <select
                  value={interviewGrade}
                  onChange={(e) => setInterviewGrade(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none"
                >
                  <option value="class_1_8">कक्षा 1 से 8 (Primary & Middle School)</option>
                  <option value="class_9_10">कक्षा 9वीं - 10वीं (Matric Board Preparation)</option>
                  <option value="class_11_12_sci">कक्षा 11वीं - 12वीं साइंस (PCM / PCB - JEE / NEET)</option>
                  <option value="class_11_12_arts_com">कक्षा 11वीं - 12वीं (Commerce / Arts / CUET)</option>
                  <option value="college_degree">कॉलेज स्नातक (B.A. / B.Sc. / B.Com / B.Tech / BCA)</option>
                  <option value="job_aspirant">प्रतियोगी परीक्षा (SSC, Bank, Railway, Police)</option>
                </select>
                <p className="text-[10px] text-slate-400">आपकी कक्षा के आधार पर विषय और नोट्स फिल्टर होंगे।</p>
              </div>

              {/* Primary Purpose on IOIS */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <label className="font-bold text-slate-300 block">
                  3. IOIS पर आने का मुख्य उद्देश्य (Goal):
                </label>
                <select
                  value={interviewGoal}
                  onChange={(e) => setInterviewGoal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none"
                >
                  <option value="computer_earning">💻 ADCA कंप्यूटर स्किल सीखना + 70% ऑनलाइन कमाई</option>
                  <option value="ncert_notes">📚 मुफ्त NCERT बुक्स, नोट्स व परीक्षा मॉडल पेपर</option>
                  <option value="career_guidance">🚀 डॉक्टर/इंजीनियर/IAS बनने का सही रास्ता चुनना</option>
                  <option value="bonafide_scholarship">🏛️ बोनाफाइड सर्टिफिकेट व छात्रवृत्ति (NSP/PMS) पाना</option>
                </select>
                <p className="text-[10px] text-slate-400">आपकी जरूरत के अनुसार सबसे सटीक गाइड मिलेगी।</p>
              </div>

            </div>

            {/* Generate Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInterviewGenerated(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition transform hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                <span>✨ मेरा पर्सनलाइज्ड वेलकम मैसेज व मास्टर गाइड अपडेट करें</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('adca_course')}
                className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-amber-400" />
                <span>सीधे ADCA कंप्यूटर सिलेबस देखें →</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC GENERATED ROADMAP & WELCOME CARD */}
          {interviewGenerated && (
            <div className="space-y-6 animate-fade-in">
              
              {/* 1. Custom Royal Welcome Message Card */}
              <div className="glass-card-gold p-6 sm:p-8 rounded-3xl border-2 border-amber-400/60 shadow-2xl relative overflow-hidden space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-2xl shadow-lg shrink-0">
                    👑
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                      OFFICIAL IOIS 2026 PERSONALIZED WELCOME
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      नमस्ते {interviewName ? interviewName : (interviewRole === 'student' ? 'प्रिय विद्यार्थी साथी' : 'आदरणीय अभिभावक महोदय')}! 🙏
                    </h3>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3">
                  <p>
                    <strong>भारतीय ऑनलाइन आय सहयोग प्रणाली (IOIS Digital Platform)</strong> के विद्यार्थी व शिक्षा पोर्टल पर आपका हार्दिक स्वागत और अभिनंदन है!
                  </p>
                  <p>
                    {interviewRole === 'student' ? (
                      <>
                        आपकी वर्तमान शैक्षिक स्थिति <strong>{selectedGradeInfo.label}</strong> के अनुसार, आज का समय केवल किताबी ज्ञान तक सीमित रहने का नहीं है, बल्कि डिजिटल और कंप्यूटर कौशल (ADCA, MS Office, AI Tools) में पारंगत होने का है। IOIS परिवार आपके उज्ज्वल भविष्य और करियर की संपूर्ण सफलता के लिए पूर्णतः समर्पित है।
                      </>
                    ) : (
                      <>
                        अभिभावक के रूप में अपने बच्चे के भविष्य के प्रति आपकी जागरूकता अत्यंत सराहनीय है। <strong>{selectedGradeInfo.label}</strong> के स्तर पर सही मार्गदर्शन, सुरक्षित डिजिटल वातावरण, उच्च गुणवत्ता वाले NCERT नोट्स और व्यावहारिक कंप्यूटर साक्षरता बच्चे के भविष्य की सबसे मजबूत नींव है।
                      </>
                    )}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-amber-300 font-bold">
                    <span>🌟 आपका चयन: {selectedGradeInfo.stream}</span>
                    <span>•</span>
                    <span>🎯 मुख्य फोकस: {selectedGradeInfo.focus}</span>
                  </div>
                </div>
              </div>

              {/* 2. Tailored Action Roadmap: What to Study & How to Move Forward */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Column 1: What to Study (क्या पढ़ना चाहिए) */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-violet-400">
                    <BookOpen className="w-5 h-5" />
                    <h4 className="font-black text-sm text-white">1. क्या पढ़ना चाहिए (Core Study Plan)</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <span><strong>NCERT का गहराई से अध्ययन:</strong> प्रतिदिन 2 घंटे मुख्य विषयों (Maths, Science/Accounts, Polity) के कॉन्सेप्ट क्लियर करें।</span>
                    </li>
                    <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <span><strong>GK व सामान्य अध्ययन:</strong> भारतीय भूगोल (नदियों के उद्गम जैसे गोदावरी, गंगा), संविधान व करंट अफेयर्स का दैनिक रिवीज़न करें।</span>
                    </li>
                    <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <span><strong>फॉर्मूला शीट्स:</strong> गणित और विज्ञान के सूत्रों को याद कर सप्ताह में एक बार सेल्फ-टेस्ट दें।</span>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Digital Skills & ADCA Computer Path */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Monitor className="w-5 h-5" />
                    <h4 className="font-black text-sm text-white">2. कंप्यूटर स्किल (ADCA Mastery)</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>MS Office 365:</strong> Word में रिज्यूमे/लेटर ड्राफ्टिंग और Excel में फॉर्मूला (VLOOKUP, IF) सीखें।</span>
                    </li>
                    <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Tally Prime + GST:</strong> एकाउंट्स और बिलिंग सीखकर किसी भी ऑफिस में ₹20,000+ की जॉब के योग्य बनें।</span>
                    </li>
                    <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>AI टूल्स का इस्तेमाल:</strong> ChatGPT व Gemini से नोट्स संक्षेप करना व ऑनलाइन काम करना सीखें।</span>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Self-Reliance & 70% Incentive */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <TrendingUp className="w-5 h-5" />
                    <h4 className="font-black text-sm text-white">3. आत्मनिर्भरता (70% Earning)</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>दैनिक पॉकेट मनी व फीस:</strong> IOIS के उपयोगी डिजिटल नोट्स अपने क्लासमेट्स को शेयर करें।</span>
                    </li>
                    <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>70% सीधा इंसेंटिव:</strong> प्रत्येक रेफरल पर 70% (₹34.30 से ₹699 तक) सीधे अपने बैंक/UPI में पाएं।</span>
                    </li>
                    <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>डिजिटल ID कार्ड:</strong> इन-ऐप रजिस्ट्रेशन के तुरंत बाद अपना वेरिफाइड स्मार्ट डिजिटल ID कार्ड प्राप्त करें।</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* 3. Which IOIS Plan is Best For You? (स्पष्ट सिफारिश) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-950 to-emerald-500/15 border-2 border-amber-400/50 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                      IOIS PLAN RECOMMENDATION FOR YOUR PROFILE
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      💡 आपके लिए IOIS का कौन सा प्लान सबसे बेस्ट है?
                    </h3>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow">
                    ⭐ अनुशंसित प्लान (Recommended)
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  
                  {/* Plan Details Card */}
                  <div className="lg:col-span-2 space-y-3 bg-slate-900/90 p-5 rounded-2xl border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-black text-amber-300">
                        👑 {selectedGradeInfo.recommendedPlan.name}
                      </h4>
                      <span className="text-xl font-black text-white">
                        ₹{selectedGradeInfo.recommendedPlan.price}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>यह प्लान क्यों बेस्ट है:</strong> {selectedGradeInfo.recommendedPlan.reason}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">सीधा 70% इंसेंटिव:</span>
                        <strong className="text-emerald-400 font-black text-sm">
                          ₹{selectedGradeInfo.recommendedPlan.incentive.toFixed(2)} / रेफर
                        </strong>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">अध्ययन व AI एक्सेस:</span>
                        <strong className="text-amber-300 font-black text-sm">
                          100% फुल एक्सेस
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action Button */}
                  <div className="space-y-3 text-center">
                    <button
                      onClick={() => onNavigate('register')}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-sm shadow-xl transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Crown className="w-5 h-5 text-slate-950" />
                      <span>अभी रजिस्टर करें (इस प्लान के साथ)</span>
                    </button>

                    <button
                      onClick={() => onNavigate('plans')}
                      className="text-xs text-slate-400 hover:text-amber-300 transition underline cursor-pointer"
                    >
                      सभी 7 मास्टर प्लांस की तुलना देखें →
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COMPLETE ADCA COMPUTER COURSE GUIDE (DETAILED SYLLABUS & ROADMAP) */}
      {/* ========================================================================= */}
      {activeTab === 'adca_course' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Header Description */}
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
              <Monitor className="w-4 h-4" />
              <span>ADVANCED DIPLOMA IN COMPUTER APPLICATIONS (ADCA 1-YEAR MASTER GUIDE)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              💻 ADCA कंप्यूटर कोर्स क्या है और इसे सीखने का पूरा प्रोसेस क्या है?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
              <strong>ADCA (Advanced Diploma in Computer Applications)</strong> भारत भर में मान्यता प्राप्त 1 वर्षीय (12 महीने) का सबसे लोकप्रिय व उपयोगी कंप्यूटर डिप्लोमा है। 
              इसे 10वीं या 12वीं के बाद कोई भी छात्र कर सकता है। इसे सीखने के बाद आप <strong>ऑफिस एग्जीक्यूटिव</strong>, <strong>डेटा एंट्री ऑपरेटर</strong>, <strong>अकाउंटेंट (Tally GST)</strong>, <strong>ग्राफिक डिजाइनर</strong>, या <strong>साइबर कैफे संचालक</strong> बनकर प्रति माह <strong>₹15,000 से ₹35,000+</strong> आसानी से कमा सकते हैं।
            </p>
          </div>

          {/* 5-Step Process to Learn ADCA */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>घर बैठे या संस्थान से ADCA सीखने का 5-चरणीय वैज्ञानिक प्रोसेस:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">1</span>
                <strong className="text-white block font-bold">थ्योरी + टाइपिंग</strong>
                <p className="text-[11px] text-slate-400">प्रतिदिन 30 मिनट हिंदी/इंग्लिश टाइपिंग व कंप्यूटर आर्किटेक्चर सीखें।</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">2</span>
                <strong className="text-white block font-bold">MS Office दक्षता</strong>
                <p className="text-[11px] text-slate-400">Word में पत्र/रिज्यूमे व Excel में ऑटोमेटेड सैलरी शीट्स बनाएं।</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">3</span>
                <strong className="text-white block font-bold">Tally व GST बिलिंग</strong>
                <p className="text-[11px] text-slate-400">टैली प्राइम में वास्तविक इनवॉइस, लेजर व बैलेंस शीट तैयार करें।</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">4</span>
                <strong className="text-white block font-bold">Photoshop & AI टूल्स</strong>
                <p className="text-[11px] text-slate-400">फोटो एडिटिंग, ID कार्ड डिजाइनिंग व AI प्रॉम्प्ट्स से काम स्पीड करें।</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">5</span>
                <strong className="text-white block font-bold">सर्टिफिकेशन व जॉब</strong>
                <p className="text-[11px] text-slate-400">प्रोजेक्ट पोर्टफोलियो बनाएं और सरकारी/प्राइवेट नौकरियों में अप्लाई करें।</p>
              </div>
            </div>
          </div>

          {/* 6 Comprehensive Modules Syllabus */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>ADCA संपूर्ण 6 मॉड्यूल्स विस्तृत पाठ्यक्रम (Complete 1-Year Syllabus)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adcaModules.map((mod) => (
                <div key={mod.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {mod.duration}
                      </span>
                      <span className="text-[11px] text-amber-400 font-bold">प्रैक्टिकल + थ्योरी</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                      {mod.title}
                    </h4>

                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {mod.topics.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-300">
                    <strong>🎯 मुख्य प्रैक्टिकल प्रोजेक्ट:</strong> {mod.practical}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job & Earning Opportunities with ADCA */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-amber-500/10 border border-emerald-500/30 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <span>ADCA पूरा करने के बाद करियर और कमाई के शीर्ष अवसर:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-white block font-bold">1. डेटा एंट्री व ऑफिस असिस्टेंट</strong>
                <p className="text-slate-400 text-[11px]">बैंक, स्कूल, हॉस्पिटल, कॉर्पोरेट ऑफिस में डॉक्यूमेंटेशन व MS Excel वर्क।</p>
                <span className="text-emerald-400 font-black text-[11px]">वेतन: ₹15,000 - ₹22,000/माह</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-white block font-bold">2. जूनियर अकाउंटेंट (Tally GST)</strong>
                <p className="text-slate-400 text-[11px]">दुकानों, फर्मों व कंपनियों के बिलिंग, वाउचर एंट्री, GST रिटर्न व लेजर मेंटेनेंस।</p>
                <span className="text-emerald-400 font-black text-[11px]">वेतन: ₹18,000 - ₹30,000/माह</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-white block font-bold">3. DTP व ग्राफिक डिजाइनर</strong>
                <p className="text-slate-400 text-[11px]">प्रिंटिंग प्रेस, बैनर डिजाइनिंग, शादी कार्ड, सोशल मीडिया पोस्टर व फोटो एडिटिंग।</p>
                <span className="text-emerald-400 font-black text-[11px]">वेतन: ₹20,000 - ₹35,000/माह</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-white block font-bold">4. अपना CSC / साइबर कैफे</strong>
                <p className="text-slate-400 text-[11px]">ऑनलाइन फॉर्म, RTPS जाति/आय/निवास, पैन कार्ड, तत्काल टिकट व मनी ट्रांसफर केंद्र।</p>
                <span className="text-amber-300 font-black text-[11px]">दैनिक आय: ₹1,000 - ₹3,000/दिन</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GK & INDIAN GEOGRAPHY (RIVERS, CAPITALS, CONSTITUTION) */}
      {/* ========================================================================= */}
      {activeTab === 'gk_geography' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Landmark className="w-6 h-6 text-amber-400" />
                <span>भारतीय भूगोल, नदियां, संविधान व सामान्य ज्ञान (General Knowledge)</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">गोदावरी, गंगा, नर्मदा का उद्गम, भारतीय संविधान के प्रमुख अनुच्छेद व राज्यों की राजधानियां।</p>
            </div>

            <button
              onClick={() => handleAskAI('भारत के भूगोल, प्रमुख नदियों और राजधानियों के बारे में सामान्य ज्ञान बताएं।')}
              className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI ज्ञान केंद्र से पूछें</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gkTopics.map((item) => (
              <div
                key={item.id}
                className="glass-card-premium p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {item.category}
                    </span>
                    <button
                      onClick={() => handleCopy(item.id, `${item.title}\nउद्गम: ${item.origin}\nलंबाई/विवरण: ${item.length}\n${item.keyPoints.join('\n')}`)}
                      className="text-xs text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 cursor-pointer flex items-center gap-1"
                      title="कॉपी करें"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <h3 className="text-lg font-black text-white leading-snug">{item.title}</h3>

                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    <p><strong className="text-amber-300">📍 उद्गम / केंद्र:</strong> {item.origin}</p>
                    <p><strong className="text-sky-300">📏 लंबाई / पैमाना:</strong> {item.length}</p>
                    <p><strong className="text-rose-300">🌊 मुहाना / विस्तार:</strong> {item.end}</p>
                  </div>

                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {item.keyPoints.map((pt, idx) => (
                      <li key={idx} className="leading-relaxed">{pt}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleAskAI(item.aiPrompt)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>इस विषय पर AI से और विस्तार से पूछें</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: BONAFIDE CERTIFICATE TEMPLATES (PMS & NSP SCHOLARSHIPS) */}
      {/* ========================================================================= */}
      {activeTab === 'bonafide' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-amber-500/30 space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span>बोनाफाइड सर्टिफिकेट (Bonafide Certificate) क्या है और क्यों आवश्यक है?</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              <strong>बोनाफाइड सर्टिफिकेट</strong> स्कूल, कॉलेज या विश्वविद्यालय द्वारा जारी किया जाने वाला आधिकारिक प्रमाण पत्र है 
              जो साबित करता है कि आप उस शिक्षण संस्थान के वास्तविक एवं नियमित छात्र हैं। 
              यह <strong>नेशनल स्कॉलरशिप पोर्टल (NSP)</strong>, <strong>बिहार पोस्ट-मैट्रिक छात्रवृत्ति (PMS)</strong>, 
              एजुकेशन लोन, सरकारी बस/ट्रेन रियायती पास, और पासपोर्ट/वीजा आवेदन के लिए अनिवार्य दस्तावेज है।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bonafideTemplates.map((item) => (
              <div key={item.id} className="glass-card-premium p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-amber-300 text-sm sm:text-base">{item.title}</h3>
                    <button
                      onClick={() => handleCopy(item.id, item.body)}
                      className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 hover:bg-amber-300 cursor-pointer shadow"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>कॉपी हो गया!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>फॉर्मेट कॉपी करें</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400"><strong>उपयोग:</strong> {item.purpose}</p>

                  <pre className="p-4 bg-slate-950 rounded-2xl text-[11px] text-slate-200 font-mono whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-80 overflow-y-auto select-all">
                    {item.body}
                  </pre>
                </div>

                <button
                  onClick={() => handleAskAI(`कृपया मुझे ${item.title} के बारे में और जानकारी दें और बताएं कि कॉलेज से इसे कैसे प्रमाणित कराया जाता है।`)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI से बोनाफाइड प्रक्रिया की सलाह लें</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MATH & SCIENCE FORMULA DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'formulas' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Calculator className="w-6 h-6 text-amber-400" />
                <span>गणित व विज्ञान के सभी आवश्यक फॉर्मूला शीट्स (Formula Sheets)</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">कक्षा 9वीं से 12वीं व प्रतियोगी परीक्षाओं के लिए बीजगणित, त्रिकोणमिति, क्षेत्रमिति व भौतिकी सूत्र।</p>
            </div>

            <button
              onClick={() => handleAskAI('कक्षा 10वीं, 11वीं और 12वीं के सभी महत्वपूर्ण गणितीय और भौतिकी सूत्र प्रदान करें।')}
              className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI फॉर्मूला सॉल्वर</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formulasData.map((sec, idx) => (
              <div key={idx} className="glass-card-premium p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-base sm:text-lg font-black text-amber-300 border-b border-slate-800 pb-2">
                  {sec.topic}
                </h3>
                <div className="space-y-3">
                  {sec.items.map((it, i) => (
                    <div key={i} className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">{it.name}</span>
                        <button
                          onClick={() => handleCopy(`f-${idx}-${i}`, it.formula)}
                          className="text-[11px] text-slate-400 hover:text-amber-400 cursor-pointer"
                        >
                          {copiedId === `f-${idx}-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="font-mono text-xs sm:text-sm text-emerald-300 font-bold bg-slate-900 p-2 rounded-xl border border-slate-800 overflow-x-auto">
                        {it.formula}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SCHOLARSHIPS DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'scholarships' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-amber-400" />
                <span>प्रमुख सरकारी छात्रवृत्ति (Scholarship) योजनाएं व आधिकारिक पोर्टल्स</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">NSP 2.0, बिहार PMS, कन्या उत्थान, AICTE प्रगति व अन्य योजनाओं की पात्रता व आवेदन विधि।</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scholarships.map((sch, i) => (
              <div key={i} className="glass-card-premium p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white">{sch.name}</h3>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                      {sch.portal}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-amber-300">पात्रता:</strong> {sch.eligibility}
                  </p>
                  <p className="text-xs text-emerald-300 font-bold">
                    💰 <strong>छात्रवृत्ति राशि:</strong> {sch.amount}
                  </p>
                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-200">आवश्यक दस्तावेज:</strong> {sch.docs}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleAskAI(`${sch.name} (पोर्टल: ${sch.portal}) के लिए ऑनलाइन आवेदन कैसे करें और बोनाफाइड सर्टिफिकेट कैसे लगाएं?`)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
                    <span>आवेदन गाइड AI से प्राप्त करें</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: CAREER ROADMAPS */}
      {/* ========================================================================= */}
      {activeTab === 'careers' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-amber-400" />
              <span>टॉप करियर रोडमैप्स (Doctor, Engineer, IAS, Defence)</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">10वीं और 12वीं के बाद सही विषय चयन और स्टेप-बाय-स्टेप चयन प्रक्रिया।</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerRoadmaps.map((career, i) => {
              const Icon = career.icon;
              return (
                <div key={i} className="glass-card-premium p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${career.color} text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white">{career.title}</h3>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {career.steps.map((st, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <p className="leading-relaxed">{st}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAskAI(`${career.title} की तैयारी के लिए सबसे अच्छी किताबें, समय सारणी और अध्ययन योजना बताएं।`)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>इस करियर के लिए AI से संपूर्ण तैयारी गाइड लें</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: FREE NCERT & NATIONAL E-LIBRARY */}
      {/* ========================================================================= */}
      {activeTab === 'elibrary' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-900/90 p-8 rounded-3xl border border-amber-500/30 space-y-4 text-center max-w-3xl mx-auto">
            <BookOpen className="w-10 h-10 text-amber-400 mx-auto" />
            <h2 className="text-2xl font-black text-white">
              📖 100% मुफ्त डिजिटल अध्ययन सामग्री व राष्ट्रीय ई-लाइब्रेरी
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              NCERT पाठ्यपुस्तकें, स्वयं (SWAYAM) IIT कोर्सेज, नेशनल डिजिटल लाइब्रेरी (NDLI), 
              एवं दीक्षा (DIKSHA) पोर्टल्स के माध्यम से कक्षा 1 से 12वीं एवं कॉलेज के सभी विषयों की पीडीएफ मुफ्त में उपलब्ध है।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
              {[
                { name: 'ePathshala (NCERT Textbooks)', url: 'https://epathshala.nic.in', desc: 'कक्षा 1 से 12वीं की सभी NCERT बुक्स हिंदी व इंग्लिश में' },
                { name: 'SWAYAM (Govt of India)', url: 'https://swayam.gov.in', desc: 'IITs/IIMs द्वारा 9वीं से पोस्ट ग्रेजुएशन तक के फ्री कोर्सेज' },
                { name: 'DIKSHA Portal', url: 'https://diksha.gov.in', desc: 'राज्य बोर्डों की डिजिटल पाठ्य सामग्री व वीडियो लेक्चर्स' },
                { name: 'National Digital Library (NDLI)', url: 'https://ndl.iitkgp.ac.in', desc: 'करोड़ों किताबें, शोध पत्र व प्रतियोगी परीक्षा सामग्री' }
              ].map((res, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-amber-300 hover:underline text-sm flex items-center gap-1"
                  >
                    <span>{res.name}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-xs text-slate-400">{res.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action / AI Help Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-black text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>IOIS 24x7 ऑल इंडिया स्मार्ट AI स्टडी गाइड</span>
          </h4>
          <p className="text-xs text-slate-400">
            गणित के सवाल, ADCA कोर्स डाउट्स, विज्ञान के नियम, इतिहास-भूगोल या छात्रवृत्ति फॉर्म भरने में कोई भी समस्या हो, तुरंत AI से पूछें।
          </p>
        </div>
        <button
          onClick={() => handleAskAI('नमस्ते! मुझे विद्यार्थी शिक्षा, ADCA कोर्स, 7 मास्टर प्लान और बोनाफाइड सर्टिफिकेट के बारे में मार्गदर्शन चाहिए।')}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
          <span>Ask IOIS AI Chatbot</span>
        </button>
      </div>

    </div>
  );
};
