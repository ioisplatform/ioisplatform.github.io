import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Tv, 
  ListVideo,
  BookOpen,
  Volume2,
  RefreshCw,
  Clock,
  Layers,
  Award,
  Laptop,
  Calculator,
  Keyboard,
  Image as ImageIcon,
  HelpCircle,
  X,
  RotateCcw,
  Check,
  Copy,
  ChevronRight,
  Flame,
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface VideoClassesAndLabsHubProps {
  initialTab?: 'ncert' | 'neet_jee' | 'adca' | 'tally' | 'mcq' | 'typing' | 'figures';
  onClose?: () => void;
}

export interface VideoLessonItem {
  id: string;
  category: 'ncert' | 'neet_jee' | 'adca' | 'tally';
  classOrLevel: string;
  subject: string;
  title: string;
  duration: string;
  youtubeId: string;
  description: string;
  keyPoints: string[];
  notesSnippet?: string;
}

export const ALL_STUDY_VIDEOS: VideoLessonItem[] = [
  // -------------------------------------------------------------
  // 1. NCERT CLASSES 1 TO 12 VIDEO LECTURES
  // -------------------------------------------------------------
  {
    id: 'nursery-phonics-abc',
    category: 'ncert',
    classOrLevel: 'कक्षा 1-2 / नर्सरी',
    subject: 'English Phonics & Alphabet',
    title: 'A to Z Phonics & Word Formation Chart',
    duration: '12:30 मिनट',
    youtubeId: 'ezmsrB59mj8',
    description: 'A for Apple से Z for Zebra तक शुद्ध फोनेटिक्स उच्चारण, लयबद्ध बालगीत और सचित्र ज्ञान।',
    keyPoints: [
      '26 अंग्रेजी अक्षरों का सही फोनेटिक उच्चारण (/æ/, /b/, /k/)',
      'दृष्टि शब्द (Sight words): The, Is, In, And, That',
      'सचित्र व मनोरंजक एनिमेटेड बाल पाठ'
    ],
    notesSnippet: 'A = Apple, B = Ball, C = Cat, D = Dog. Phonics Sound: A sounds like "ऐ", B sounds like "ब", C sounds like "क"।'
  },
  {
    id: 'hindi-varnamala-kids',
    category: 'ncert',
    classOrLevel: 'कक्षा 1-3',
    subject: 'हिंदी वर्णमाला',
    title: 'स्वर (अ से अः) एवं व्यंजन (क से ज्ञ) सचित्र गान',
    duration: '15:45 मिनट',
    youtubeId: 'jYF6522c00M',
    description: '11 स्वर, 2 अयोगवाह और 36 व्यंजनों का शुद्ध देवनागरी उच्चारण एवं सचित्र शब्द-रचना।',
    keyPoints: [
      'अ से अनार, आ से आम, इ से इमली, ई से ईख का लयबद्ध पाठ',
      'क से कबूतर से ज्ञ से ज्ञानी तक व्यंजन पहचान',
      'सुलेख एवं बाल विकास आधारशिला'
    ],
    notesSnippet: 'स्वर: अ, आ, इ, ई, उ, ऊ, ऋ, ए, ऐ, ओ, औ, अं, अः। व्यंजन: क, ख, ग, घ, ङ... संयुक्त: क्ष, त्र, ज्ञ।'
  },
  {
    id: 'math-tables-counting',
    category: 'ncert',
    classOrLevel: 'कक्षा 2-5',
    subject: 'प्रारंभिक गणित',
    title: '1 से 100 गिनती एवं 2 से 20 सचित्र पहाड़ा ट्रिक्स',
    duration: '18:20 मिनट',
    youtubeId: 'xXmZ7F7f26c',
    description: 'उंगलियों पर पहाड़ा याद करने की वैदिक विधि, सचित्र जोड़-घटाव और दैनिक जीवन में अनुप्रयोग।',
    keyPoints: [
      '2 से 20 तक पहाड़ा बिना रटे याद करने की ट्रिक',
      'सचित्र जोड़ (+) और घटाव (-) के व्यावहारिक सवाल',
      'घड़ी में समय देखना और भारतीय मुद्रा (रुपये-पैसे)'
    ],
    notesSnippet: 'पहाड़ा ट्रिक: 9 का पहाड़ा उंगलियों पर — जिस अंक से गुणा करना है उस उंगली को मोड़ें, बायीं उंगलियां दहाई और दायीं उंगलियां इकाई!'
  },
  {
    id: 'class6-science-nutrition',
    category: 'ncert',
    classOrLevel: 'कक्षा 6-8',
    subject: 'NCERT विज्ञान',
    title: 'पादपों एवं जंतुओं में पोषण तथा पाचन तंत्र (Science One-Shot)',
    duration: '24:15 मिनट',
    youtubeId: 'M2_w37cI90c',
    description: 'प्रकाश संश्लेषण (Photosynthesis), स्वपोषी vs विषमपोषी, मानव पाचन तंत्र और आहार नाल के कार्य।',
    keyPoints: [
      'प्रकाश संश्लेषण समीकरण: 6CO₂ + 12H₂O + सूर्य प्रकाश + क्लोरोफिल → C₆H₁₂O₆ + 6O₂ + 6H₂O',
      'अमाशय में HCl अम्ल और पेप्सिन एंजाइम का कार्य',
      'छोटी आंत में विली (Villi) द्वारा भोजन का अवशोषण'
    ],
    notesSnippet: 'भोजन के 5 मुख्य घटक: कार्बोहाइड्रेट (ऊर्जा), वसा (अधिक ऊर्जा), प्रोटीन (शरीर निर्माण), विटामिन व खनिज (सुरक्षा), जल व रुक्षांश।'
  },
  {
    id: 'class10-science-board',
    category: 'ncert',
    classOrLevel: 'कक्षा 10 बोर्ड',
    subject: 'विज्ञान (Chemistry & Physics)',
    title: 'रासायनिक अभिक्रियाएँ, प्रकाश का परावर्तन व विद्युत (Board Special)',
    duration: '42:50 मिनट',
    youtubeId: 'hKqR9c9Jq7g',
    description: '10वीं बोर्ड परीक्षा 95%+ रणनीति: रासायनिक समीकरण संतुलन, ओम का नियम (V = IR) और लेंस सूत्र।',
    keyPoints: [
      'संयोजन, वियोजन, विस्थापन और रेडॉक्स (Redox) अभिक्रियाएँ',
      'दर्पण सूत्र: 1/f = 1/v + 1/u | लेंस सूत्र: 1/f = 1/v - 1/u',
      'विद्युत प्रतिरोध (R = ρ L / A) एवं जूल का तापन नियम (H = I²Rt)'
    ],
    notesSnippet: 'बोर्ड सुपर ट्रिक: अवतल दर्पण हमेशा वास्तविक व उल्टा प्रतिबिम्ब बनाता है (केवल जब वस्तु P व F के बीच हो तब आभासी व सीधा बनता है)।'
  },
  {
    id: 'class10-math-trigo',
    category: 'ncert',
    classOrLevel: 'कक्षा 10 बोर्ड',
    subject: 'गणित (Mathematics)',
    title: 'त्रिकोणमिति का परिचय, ऊंचाई व दूरी और द्विघात समीकरण',
    duration: '38:10 मिनट',
    youtubeId: 'h21_hCgO_iU',
    description: 'त्रिकोणमितीय सर्वसमिकाएं (sin²θ + cos²θ = 1), कोण सारणी 0°-90° और श्रीधराचार्य सूत्र।',
    keyPoints: [
      'sin θ = लम्ब/कर्ण, cos θ = आधार/कर्ण, tan θ = लम्ब/आधार (लाल/कका)',
      '1 + tan²θ = sec²θ एवं 1 + cot²θ = cosec²θ',
      'श्रीधराचार्य सूत्र: x = [-b ± √(b² - 4ac)] / (2a)'
    ],
    notesSnippet: 'त्रिकोणमिति ट्रिक: कोण सारणी हेतु 0, 1, 2, 3, 4 लिखकर 4 से भाग दें और वर्गमूल निकालें — 0, 1/2, 1/√2, √3/2, 1 (sin के मान)!'
  },
  {
    id: 'class12-physics-optics',
    category: 'ncert',
    classOrLevel: 'कक्षा 11-12 सीनियर',
    subject: 'भौतिकी (Physics)',
    title: 'किरण प्रकाशिकी, तरंग प्रकाशिकी एवं स्थिर विद्युतकी (Optics & Electrostatics)',
    duration: '45:30 मिनट',
    youtubeId: 'mQ9_x9K00oA',
    description: 'लेंस निर्माता सूत्र (Lens Maker Formula), हाइगेंस का तरंग सिद्धांत और कूलॉम का नियम।',
    keyPoints: [
      'लेंस निर्माता सूत्र: 1/f = (μ - 1)(1/R1 - 1/R2) — जल में डुबोने पर फोकस दूरी 4 गुना बढ़ जाती है',
      'कूलॉम नियम: F = k (q1 q2) / r² (जहाँ k = 9 × 10⁹ N m²/C²)',
      'गॉस की प्रमेय: Φ = q_enclosed / ε₀'
    ],
    notesSnippet: 'NCERT लाइन: यदि कांच के उत्तल लेंस को समान अपवर्तनांक (μ = 1.5) वाले द्रव में डुबोएं तो यह समतल कांच की पट्टी की तरह व्यवहार करेगा और f = ∞ होगा।'
  },

  // -------------------------------------------------------------
  // 2. NEET & JEE MAINS MASTER VIDEO MASTERCLASSES
  // -------------------------------------------------------------
  {
    id: 'neet-bio-genetics',
    category: 'neet_jee',
    classOrLevel: 'NEET-UG Target',
    subject: 'जीवविज्ञान (Biology 360/360)',
    title: 'वंशागति का आणविक आधार & मेंडलीय आनुवंशिकी (High-Yield NCERT Line)',
    duration: '50:15 मिनट',
    youtubeId: 'q11Y1h1Yk30',
    description: 'DNA संरचना (वाट्सन-क्रिक), मेसल्सन-स्टाल का भारी नाइट्रोजन ¹⁵N प्रयोग, लैक-ऑपेरॉन और जेनेटिक कोड।',
    keyPoints: [
      'DNA की दोहरी कुंडली: 3.4 nm प्रति पिच, 10 क्षार युग्म प्रति घुमाव (0.34 nm दूरी)',
      'मेसल्सन-स्टाल प्रयोग: ¹⁵N भारी समस्थानिक था, कोई रेडियोधर्मी नहीं था!',
      'AUG प्रारंभिक प्रकूट (Start Codon) है जो मेथियोनीन को कोड करता है'
    ],
    notesSnippet: 'NTA ट्रैप अलर्ट: हर्षे-चेस ने रेडियोधर्मी ³²P व ³⁵S का उपयोग किया, जबकि मेसल्सन-स्टाल ने गैर-रेडियोधर्मी भारी नाइट्रोजन ¹⁵N का उपयोग CsCl घनत्व प्रवणता में किया!'
  },
  {
    id: 'neet-chem-organic',
    category: 'neet_jee',
    classOrLevel: 'NEET & JEE Main',
    subject: 'कार्बनिक रसायन (Organic GOC)',
    title: 'GOC कार्बोकैटायन स्थायित्व, अनुनाद व नेम रिएक्शंस (Organic Masterclass)',
    duration: '48:40 मिनट',
    youtubeId: 'L6r0C6v1_kI',
    description: 'अतिसंयुग्मन (Hyperconjugation), प्रेरणिक प्रभाव (+I/-I), नाभिकस्नेही प्रतिस्थापन (SN1 vs SN2) और महत्वपूर्ण नेम रिएक्शंस।',
    keyPoints: [
      'कार्बोकैटायन स्थायित्व: 3° (9 α-H) > 2° (6 α-H) > 1° (3 α-H) > CH₃⁺',
      'SN1 दो पदों में होती है (कार्बोकैटायन मध्यवर्ती, 3° > 2° > 1°, रेसिमीकरण)',
      'SN2 एक पद में होती है (संक्रमण अवस्था, वाल्डेन प्रतिलोमन, 1° > 2° > 3°)'
    ],
    notesSnippet: 'सुपर ट्रिक: SN2 में भीड़भाड़ (Steric Hindrance) दुश्मन है, इसलिए प्राथमिक (1°) अल्काइल हैलाइड सबसे तेज प्रतिक्रिया देता है!'
  },
  {
    id: 'jee-math-calculus',
    category: 'neet_jee',
    classOrLevel: 'JEE Mains & Advanced',
    subject: 'गणित (Calculus & Coordinate)',
    title: 'सीमा, अवकलज, निश्चित समाकलन एवं लघुगणकीय ट्रिक्स (Calculus One-Shot)',
    duration: '55:20 मिनट',
    youtubeId: 'mP91k0cLa_w',
    description: 'L-Hopital नियम, लेबनिज नियम (Leibniz Integral Rule), वक्रों से घिरा क्षेत्रफल और शॉर्टकट ट्रिक्स।',
    keyPoints: [
      'मानक सीमा: lim (x → 0) (sin x / x) = 1 (रेडियन में), यदि डिग्री में हो तो π/180',
      'निश्चित समाकलन गुणधर्म: ∫ (0 to a) f(x) dx = ∫ (0 to a) f(a - x) dx (King Rule)',
      'लेबनिज अवकलन: d/dx [∫ (u(x) to v(x)) f(t) dt] = f(v) v\' - f(u) u\''
    ],
    notesSnippet: 'JEE Main शॉर्टकट: परवलय y² = 4ax और रेखा y = mx से घिरे क्षेत्र का क्षेत्रफल = 8 a² / (3 m³) वर्ग इकाई।'
  },

  // -------------------------------------------------------------
  // 3. ADCA (ADVANCED DIPLOMA IN COMPUTER APPLICATIONS) COURSE
  // -------------------------------------------------------------
  {
    id: 'adca-comp-fundamentals',
    category: 'adca',
    classOrLevel: 'ADCA मॉड्यूल 01',
    subject: 'Computer Fundamentals & OS',
    title: 'कंप्यूटर आर्किटेक्चर, मेमोरी, हार्डवेयर, सॉफ्टवेयर एवं Windows 11',
    duration: '35:40 मिनट',
    youtubeId: 'Z1BCujX3pw8',
    description: 'CPU संरचना (ALU + CU + Registers), प्राथमिक मेमोरी (RAM vs ROM), इनपुट/आउटपुट डिवाइसेज एवं ऑपरेटिंग सिस्टम।',
    keyPoints: [
      'वॉन न्यूमैन आर्किटेक्चर (Von Neumann Computer Architecture)',
      'RAM (अस्थायी/Volatile) vs ROM (स्थायी/Non-volatile)',
      'बाइनरी सिस्टम: 1 Byte = 8 Bits, 1 KB = 1024 Bytes, 1 MB = 1024 KB, 1 GB = 1024 MB'
    ],
    notesSnippet: 'ADCA सार: ऑपरेटिंग सिस्टम हार्डवेयर और यूजर के बीच इंटरफेस है। Windows, Linux, macOS सिस्टम सॉफ्टवेयर हैं; MS Office, Tally एप्लीकेशन सॉफ्टवेयर हैं।'
  },
  {
    id: 'adca-ms-word',
    category: 'adca',
    classOrLevel: 'ADCA मॉड्यूल 02',
    subject: 'MS Word 2024 Practical',
    title: 'वर्ड प्रोसेसिंग, टेबल डिजाइनिंग, मेल मर्ज एवं पेज लेआउट मास्टरक्लास',
    duration: '32:15 मिनट',
    youtubeId: 'kX_4NqL01p8',
    description: 'दस्तावेज़ निर्माण, फॉन्ट स्टाइलिंग, हेडर/फूटर, मेल मर्ज (Mail Merge) और आधिकारिक ड्राफ्टिंग।',
    keyPoints: [
      'आवश्यक शॉर्टकट्स: Ctrl+A (Select All), Ctrl+C (Copy), Ctrl+V (Paste), Ctrl+Z (Undo), Ctrl+Y (Redo)',
      'मेल मर्ज द्वारा 1 क्लिक में 100+ लोगों के लिए व्यक्तिगत आमंत्रण / प्रमाण पत्र तैयार करना',
      'टेबल्स, वॉटरमार्क, पेज बॉर्डर और पीडीएफ एक्सपोर्ट'
    ],
    notesSnippet: 'प्रैक्टिकल शॉर्टकट: Ctrl+Shift+> (Font Size Increase), Ctrl+E (Center Align), Ctrl+J (Justify Align), F7 (Spelling and Grammar Check)।'
  },
  {
    id: 'adca-ms-excel-pro',
    category: 'adca',
    classOrLevel: 'ADCA मॉड्यूल 03',
    subject: 'MS Excel Advanced Formulas',
    title: 'VLOOKUP, XLOOKUP, Pivot Tables, IF/AND एवं ऑटोमेशन चार्ट्स',
    duration: '44:20 मिनट',
    youtubeId: 'Vl0H-qTclOg',
    description: 'डेटा विश्लेषण, सैलरी शीट, मार्कशीट निर्माण, पिवट टेबल (Pivot Table) और एडवांस्ड एक्सेल फॉर्मूले।',
    keyPoints: [
      'VLOOKUP सूत्र: =VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
      'तार्किक फॉर्मूले: =IF(C2>=33, "PASS", "FAIL") और =SUMIFS / COUNTIFS',
      'पिवट टेबल द्वारा लाखों रो के डेटा का 2 सेकंड में सारांश तैयार करना'
    ],
    notesSnippet: 'एक्सेल प्रो टिप: सेल को लॉक करने के लिए F4 दबाकर Absolute Reference ($A$1) बनाएं ताकि सूत्र ड्रैग करने पर सेल संदर्भ न बदले!'
  },
  {
    id: 'adca-powerpoint-internet',
    category: 'adca',
    classOrLevel: 'ADCA मॉड्यूल 04',
    subject: 'MS PowerPoint & Internet',
    title: 'व्यावसायिक प्रेजेंटेशन, एनिमेशन, नेटवर्किंग, ईमेल एवं साइबर सुरक्षा',
    duration: '28:10 मिनट',
    youtubeId: '_30W9vK90L4',
    description: 'स्लाइड डिजाइन, कस्टम एनिमेशन, स्लाइड शो (F5), इंटरनेट प्रोटोकॉल (IP, DNS, HTTP/S) और साइबर फ्रॉड से सुरक्षा।',
    keyPoints: [
      'स्लाइड मास्टर द्वारा सभी स्लाइड्स पर एक समान लोगो व थीम लागू करना',
      'ईमेल शिष्टाचार: To, Cc (Carbon Copy), Bcc (Blind Carbon Copy) का सही उपयोग',
      'साइबर सुरक्षा: 1930 राष्ट्रीय साइबर हेल्पलाइन, फिशिंग और 2FA टू-फैक्टर ऑथेंटिकेशन'
    ],
    notesSnippet: 'पावरपॉइंट शॉर्टकट: F5 (Start Slideshow from beginning), Shift+F5 (Start from current slide), B (Black Screen during show), W (White screen)।'
  },

  // -------------------------------------------------------------
  // 4. TALLY PRIME & GST ACCOUNTING MASTERCLASS
  // -------------------------------------------------------------
  {
    id: 'tally-prime-basics',
    category: 'tally',
    classOrLevel: 'Tally Prime मॉड्यूल 01',
    subject: 'Tally Prime Fundamentals',
    title: 'लेखांकन के स्वर्णिम नियम, कंपनी निर्माण, ग्रुप व लेजर क्रिएशन',
    duration: '38:40 मिनट',
    youtubeId: 'Z1BCujX3pw8',
    description: 'Double Entry System, Personal/Real/Nominal Rules, Company Creation in Tally Prime, Chart of Accounts.',
    keyPoints: [
      'लेखांकन के 3 गोल्डन नियम: 1. Personal: पाने वाले को डेबिट, देने वाले को क्रेडिट | 2. Real: जो वस्तु व्यापार में आए डेबिट, जाए क्रेडिट | 3. Nominal: सभी व्यय व हानियां डेबिट, सभी आय व लाभ क्रेडिट',
      'Tally Prime में कंपनी निर्माण (Alt+F3), वित्तीय वर्ष (1 अप्रैल से 31 मार्च)',
      'लेजर निर्माण (Create > Ledgers): Capital A/c under Capital, Bank under Bank A/c, Ram under Sundry Debtors'
    ],
    notesSnippet: 'Tally Prime शॉर्टकट कुंजी: F1 (Help), F2 (Date), F3 (Select Company), Alt+G (Go To Master Search Bar), Esc (Back/Exit)।'
  },
  {
    id: 'tally-voucher-gst',
    category: 'tally',
    classOrLevel: 'Tally Prime मॉड्यूल 02',
    subject: 'Voucher Entry & GST Billing',
    title: 'F4 से F9 तक सभी वाउचर प्रविष्टियाँ, CGST, SGST, IGST एवं E-Way Bill',
    duration: '46:15 मिनट',
    youtubeId: 'kX_4NqL01p8',
    description: 'Contra (F4), Payment (F5), Receipt (F6), Journal (F7), Sales (F8), Purchase (F9) और GST इनवॉइस निर्माण।',
    keyPoints: [
      'F4 Contra: बैंक व कैश के बीच लेन-देन (जैसे बैंक में नकद जमा: Bank Dr, Cash Cr)',
      'F8 Sales & F9 Purchase: स्टॉक आइटम के साथ टैक्स इनवॉइस (Tax Invoice) तैयार करना',
      'राज्य के अंदर बिक्री (Intra-state) पर CGST + SGST; राज्य से बाहर (Inter-state) पर केवल IGST'
    ],
    notesSnippet: 'जीएसटी नियम: यदि माल बिहार से बिहार में बिका तो 9% CGST + 9% SGST लगेगा (कुल 18%)। यदि बिहार से उत्तर प्रदेश बिका तो पूरा 18% IGST लगेगा!'
  },
  {
    id: 'tally-balance-sheet-reports',
    category: 'tally',
    classOrLevel: 'Tally Prime मॉड्यूल 03',
    subject: 'Financial Reports & Tax Audit',
    title: 'बैलेंस शीट, लाभ-हानि खाता (P&L), ट्रायल बैलेंस एवं GSTR-1/3B फाइलिंग',
    duration: '34:50 मिनट',
    youtubeId: 'Vl0H-qTclOg',
    description: 'Balance Sheet, Profit and Loss Account, Day Book, Stock Summary एवं GST रिटर्न का विस्तृत विश्लेषण।',
    keyPoints: [
      'Balance Sheet = Assets (संपत्तियां) vs Liabilities (दायित्व)',
      'GSTR-1 (बाहरी बिक्री का विवरण) और GSTR-3B (मासिक टैक्स भुगतान समरी)',
      'Tally Prime से सीधे GST पोर्टल पर JSON फाइल एक्सपोर्ट करना'
    ],
    notesSnippet: 'फाइनेंशियल फॉर्मूला: Net Profit = Gross Profit - Operating Expenses. Assets = Capital + Liabilities (हमेशा दोनों पक्ष बराबर होते हैं)।'
  }
];

// -------------------------------------------------------------
// MCQ PRACTICE TESTS DATA
// -------------------------------------------------------------
export interface HubMCQQuestion {
  id: string;
  category: 'ncert' | 'neet' | 'jee' | 'adca' | 'tally';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const HUB_MCQ_BANK: HubMCQQuestion[] = [
  {
    id: 'mcq-ncert-1',
    category: 'ncert',
    question: 'मानव शरीर में भोजन का अंतिम पाचन एवं पोषक तत्वों का अवशोषण कहाँ होता है?',
    options: ['आमाशय (Stomach)', 'छोटी आंत (Small Intestine - क्षुद्रांत्र)', 'बड़ी आंत (Large Intestine)', 'यकृत (Liver)'],
    correctIndex: 1,
    explanation: 'छोटी आंत (लगभग 7.5 मीटर लंबी) में भोजन का पूर्ण पाचन होता है और इसकी दीवारों पर मौजूद रसांकुर (Villi) पोषक तत्वों को रक्त में अवशोषित करते हैं।'
  },
  {
    id: 'mcq-ncert-2',
    category: 'ncert',
    question: 'उत्तल लेंस की फोकस दूरी (f) हमेशा किस चिह्न की होती है और इसकी क्षमता (Power) का मात्रक क्या है?',
    options: ['धनात्मक (+) और डायोप्टर (D)', 'ऋणात्मक (-) और मीटर', 'शून्य और जूल', 'धनात्मक और वाट'],
    correctIndex: 0,
    explanation: 'उत्तल लेंस की फोकस दूरी धनात्मक (+) होती है और लेंस की क्षमता P = 1/f (मीटर में), जिसका SI मात्रक डायोप्टर (Dioptre, D) है।'
  },
  {
    id: 'mcq-neet-1',
    category: 'neet',
    question: 'मेसल्सन और स्टाल ने DNA की अर्धसंरक्षी प्रतिकृति सिद्ध करने के लिए किस भारी समस्थानिक का प्रयोग किया था?',
    options: ['¹⁵N (भारी नाइट्रोजन समस्थानिक जो रेडियोधर्मी नहीं है)', '³²P रेडियोधर्मी समस्थानिक', '¹⁴C समस्थानिक', '³⁵S सल्फर समस्थानिक'],
    correctIndex: 0,
    explanation: 'मेसल्सन-स्टाल ने ¹⁵NH4Cl का उपयोग किया। यह रेडियोधर्मी नहीं बल्कि केवल भारी समस्थानिक था जिसे CsCl घनत्व प्रवणता द्वारा अलग किया गया।'
  },
  {
    id: 'mcq-jee-1',
    category: 'jee',
    question: 'मानक सीमा lim (x → 0) (sin x / x) का मान 1 होता है जब कोण x किसमें मापा गया हो?',
    options: ['रेडियन में (यदि डिग्री में हो तो मान π/180 होगा)', 'डिग्री में हमेशा', 'ग्रेड में', 'किसी भी मात्रक में'],
    correctIndex: 0,
    explanation: 'कैलकुलस के प्रमेय के अनुसार x का मान रेडियन में होना अनिवार्य है। यदि x डिग्री में हो तो उत्तर π/180 होता है!'
  },
  {
    id: 'mcq-adca-1',
    category: 'adca',
    question: 'कंप्यूटर का मस्तिष्क किसे कहा जाता है और 1 Megabyte (MB) में कितने Kilobytes (KB) होते हैं?',
    options: ['CPU (Central Processing Unit); और 1024 KB', 'RAM; और 1000 KB', 'Hard Disk; और 100 KB', 'Monitor; और 1024 Bytes'],
    correctIndex: 0,
    explanation: 'CPU कंप्यूटर का मस्तिष्क है। बाइनरी मेमोरी माप: 1 Byte = 8 Bits, 1 KB = 1024 Bytes, 1 MB = 1024 KB, 1 GB = 1024 MB।'
  },
  {
    id: 'mcq-adca-2',
    category: 'adca',
    question: 'MS Word में सभी टेक्स्ट को एक साथ सेलेक्ट करने तथा MS Excel में सेल को लॉक (Absolute Reference) करने की शॉर्टकट कुंजी क्या है?',
    options: ['Ctrl + A; और F4', 'Ctrl + S; और F2', 'Ctrl + X; और F5', 'Ctrl + P; और F12'],
    correctIndex: 0,
    explanation: 'Ctrl+A से सम्पूर्ण डॉक्यूमेंट सेलेक्ट होता है, और एक्सेल में सूत्र में F4 दबाने से सेल एड्रेस $A$1 लॉक हो जाता है।'
  },
  {
    id: 'mcq-tally-1',
    category: 'tally',
    question: 'Tally Prime में बैंक में नकद राशि जमा करने या बैंक से नकद निकालने के लिए किस वाउचर कुंजी का उपयोग किया जाता है?',
    options: ['F4 (Contra Voucher)', 'F5 (Payment Voucher)', 'F6 (Receipt Voucher)', 'F8 (Sales Voucher)'],
    correctIndex: 0,
    explanation: 'Contra (F4) का उपयोग केवल Cash और Bank के आपसी लेन-देन के लिए होता है। अन्य किसी पार्टी या खर्च के लिए इसका प्रयोग नहीं होता।'
  },
  {
    id: 'mcq-tally-2',
    category: 'tally',
    question: 'लेखांकन के गोल्डन नियमानुसार "नाममात्र खाता (Nominal Account)" का क्या नियम है?',
    options: ['सभी खर्चों व हानियों को Debit करो, सभी आय व लाभों को Credit करो', 'पाने वाले को डेबिट करो, देने वाले को क्रेडिट', 'जो वस्तु आए डेबिट, जाए क्रेडिट', 'कोई नियम नहीं'],
    correctIndex: 0,
    explanation: 'Nominal Account Rule: Debit all expenses & losses, Credit all incomes & gains (उदा. वेतन, किराया, ब्याज)।'
  }
];

// -------------------------------------------------------------
// EDUCATIONAL FIGURES & DIAGRAMS
// -------------------------------------------------------------
export interface EducationalFigureItem {
  id: string;
  category: 'science' | 'computer' | 'tally';
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  svgIllustration: React.ReactNode;
  keyLabels: { label: string; desc: string }[];
}

export const EDUCATIONAL_FIGURES: EducationalFigureItem[] = [
  {
    id: 'fig-human-heart',
    category: 'science',
    title: 'मानव हृदय एवं दोहरा परिसंचरण (Human Heart)',
    subtitle: '4 कोष्ठक (Chambers) एवं फुफ्फुस धमनी-शिरा कार्यप्रणाली',
    badge: 'कक्षा 10 व NEET अति-महत्वपूर्ण',
    description: 'मानव हृदय चार कोष्ठकों में बंटा होता है: दायां आलिंद, दायां निलय, बायां आलिंद, बायां निलय। बायां भाग शुद्ध (ऑक्सीजनित) रक्त तथा दायां भाग अशुद्ध रक्त संभालता है।',
    svgIllustration: (
      <svg viewBox="0 0 400 280" className="w-full h-56 bg-slate-900 rounded-2xl p-2">
        <defs>
          <linearGradient id="pureBlood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="impureBlood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        {/* Heart Outer Body */}
        <path d="M 200,60 C 130,10 60,70 90,150 C 120,210 200,260 200,260 C 200,260 280,210 310,150 C 340,70 270,10 200,60 Z" fill="#475569" stroke="#94a3b8" strokeWidth="4" />
        
        {/* Right Heart (Deoxygenated - Blue) */}
        <path d="M 200,60 C 140,20 80,70 100,140 C 120,190 196,240 196,240 L 196,65 Z" fill="url(#impureBlood)" opacity="0.9" />
        
        {/* Left Heart (Oxygenated - Red) */}
        <path d="M 204,65 L 204,240 C 204,240 280,190 300,140 C 320,70 260,20 204,60 Z" fill="url(#pureBlood)" opacity="0.9" />
        
        {/* Septum (विभाजक भित्ति) */}
        <line x1="200" y1="55" x2="200" y2="250" stroke="#facc15" strokeWidth="4" strokeDasharray="4 2" />
        
        {/* Labels on SVG */}
        <text x="140" y="100" fill="#ffffff" fontSize="12" fontWeight="bold">दायां आलिंद (RA)</text>
        <text x="135" y="180" fill="#ffffff" fontSize="12" fontWeight="bold">दायां निलय (RV)</text>
        <text x="215" y="100" fill="#ffffff" fontSize="12" fontWeight="bold">बायां आलिंद (LA)</text>
        <text x="215" y="180" fill="#ffffff" fontSize="12" fontWeight="bold">बायां निलय (LV)</text>
        <text x="200" y="275" fill="#fde047" fontSize="11" textAnchor="middle" fontWeight="bold">सेप्टम (विभाजक दीवार - रक्त को मिलने से रोकती है)</text>
      </svg>
    ),
    keyLabels: [
      { label: 'बायां निलय (LV)', desc: 'इसकी दीवारें सबसे मोटी होती हैं क्योंकि यह पूरे शरीर में महाधमनी (Aorta) द्वारा शुद्ध रक्त पंप करता है।' },
      { label: 'फुफ्फुस धमनी (Pulmonary Artery)', desc: 'एकमात्र धमनी जो विऑक्सीजनित (अशुद्ध) रक्त को फेफड़ों तक ले जाती है।' },
      { label: 'कपाट (Tricuspid & Bicuspid Valves)', desc: 'निलय से रक्त को वापस आलिंद में लौटने से रोकते हैं (एकदिशीय प्रवाह)।' }
    ]
  },
  {
    id: 'fig-computer-architecture',
    category: 'computer',
    title: 'कंप्यूटर वॉन न्यूमैन आर्किटेक्चर (Computer CPU Architecture)',
    subtitle: 'Input Device → Central Processing Unit (ALU + CU + Registers) → Output Device',
    badge: 'ADCA एवं BCA फाउंडेशन',
    description: 'कंप्यूटर का मूल कार्य चक्र: इनपुट लेना (IPO Cycle), सीपीयू द्वारा गणना व नियंत्रण, मेमोरी में भंडारण और मॉनिटर/प्रिंटर पर परिणाम प्रदर्शित करना।',
    svgIllustration: (
      <svg viewBox="0 0 400 260" className="w-full h-56 bg-slate-900 rounded-2xl p-2 font-sans">
        {/* Input Unit */}
        <rect x="20" y="90" width="80" height="70" rx="10" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2" />
        <text x="60" y="125" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">इनपुट यूनिट</text>
        <text x="60" y="142" fill="#bfdbfe" fontSize="9" textAnchor="middle">कीबोर्ड, माउस</text>

        {/* Arrow to CPU */}
        <line x1="100" y1="125" x2="135" y2="125" stroke="#facc15" strokeWidth="3" markerEnd="url(#arrow)" />

        {/* CPU Outer Box */}
        <rect x="140" y="30" width="160" height="190" rx="12" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
        <text x="220" y="55" fill="#f59e0b" fontSize="13" fontWeight="900" textAnchor="middle">CPU (मस्तिष्क)</text>

        {/* CU */}
        <rect x="155" y="70" width="130" height="35" rx="6" fill="#8b5cf6" />
        <text x="220" y="92" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Control Unit (CU)</text>

        {/* ALU */}
        <rect x="155" y="115" width="130" height="35" rx="6" fill="#10b981" />
        <text x="220" y="137" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">ALU (अंकगणित/तर्क)</text>

        {/* Primary Memory */}
        <rect x="155" y="160" width="130" height="40" rx="6" fill="#0284c7" />
        <text x="220" y="180" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Registers & Cache</text>
        <text x="220" y="194" fill="#bae6fd" fontSize="9" textAnchor="middle">RAM / प्राथमिक मेमोरी</text>

        {/* Arrow to Output */}
        <line x1="300" y1="125" x2="335" y2="125" stroke="#facc15" strokeWidth="3" />

        {/* Output Unit */}
        <rect x="340" y="90" width="80" height="70" rx="10" fill="#ec4899" stroke="#f472b6" strokeWidth="2" />
        <text x="380" y="125" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">आउटपुट</text>
        <text x="380" y="142" fill="#fce7f3" fontSize="9" textAnchor="middle">मॉनिटर, प्रिंटर</text>
      </svg>
    ),
    keyLabels: [
      { label: 'ALU (Arithmetic Logic Unit)', desc: 'जोड़, घटाव, गुणा, भाग और तार्किक तुलना (>, <, ==) निष्पादित करता है।' },
      { label: 'CU (Control Unit)', desc: 'समस्त हार्डवेयर घटकों, डेटा प्रवाह और निर्देशों के क्रियान्वयन को नियंत्रित करता है।' },
      { label: 'Registers & Cache Memory', desc: 'CPU की सबसे तेज आंतरिक मेमोरी जो निष्पादित होने वाले निर्देशों को तात्कालिक रखती है।' }
    ]
  },
  {
    id: 'fig-tally-accounting-cycle',
    category: 'tally',
    title: 'Tally Prime दोहरा प्रविष्टि चक्र (Double Entry Accounting Flowchart)',
    subtitle: 'ट्रांजैक्शन → वाउचर प्रविष्टि (F4-F9) → लेजर → ट्रायल बैलेंस → बैलेंस शीट',
    badge: 'Tally Prime & GST अधिकृत',
    description: 'किसी भी व्यावसायिक लेन-देन का अंतिम लक्ष्य बैलेंस शीट तैयार करना होता है। Tally Prime में सिर्फ वाउचर डालने पर बाकी रिपोर्ट स्वतः तैयार हो जाती हैं।',
    svgIllustration: (
      <svg viewBox="0 0 400 240" className="w-full h-56 bg-slate-900 rounded-2xl p-2 font-sans">
        {/* Step 1: Transaction */}
        <circle cx="60" cy="70" r="35" fill="#f97316" stroke="#ffedd5" strokeWidth="2" />
        <text x="60" y="68" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">लेन-देन</text>
        <text x="60" y="82" fill="#ffedd5" fontSize="8" textAnchor="middle">(Transaction)</text>

        {/* Step 2: Voucher Entry */}
        <rect x="130" y="45" width="100" height="50" rx="8" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2" />
        <text x="180" y="68" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">वाउचर एंट्री</text>
        <text x="180" y="84" fill="#dbeafe" fontSize="9" textAnchor="middle">F4, F5, F8, F9</text>

        {/* Step 3: Ledger & Daybook */}
        <rect x="270" y="45" width="100" height="50" rx="8" fill="#10b981" stroke="#a7f3d0" strokeWidth="2" />
        <text x="320" y="68" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">लेजर खतौनी</text>
        <text x="320" y="84" fill="#d1fae5" fontSize="9" textAnchor="middle">सवतः पोस्टिंग</text>

        {/* Step 4: Trial Balance */}
        <rect x="270" y="145" width="100" height="50" rx="8" fill="#8b5cf6" stroke="#ddd6fe" strokeWidth="2" />
        <text x="320" y="168" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">ट्रायल बैलेंस</text>
        <text x="320" y="184" fill="#ede9fe" fontSize="9" textAnchor="middle">Dr = Cr जांच</text>

        {/* Step 5: Balance Sheet & P&L */}
        <rect x="100" y="145" width="130" height="50" rx="10" fill="#dc2626" stroke="#fca5a5" strokeWidth="3" />
        <text x="165" y="168" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle">बैलेंस शीट & P&L</text>
        <text x="165" y="184" fill="#fee2e2" fontSize="9" textAnchor="middle">अंतिम वित्तीय रिपोर्ट</text>

        {/* Connecting Arrows */}
        <line x1="95" y1="70" x2="125" y2="70" stroke="#facc15" strokeWidth="2" />
        <line x1="230" y1="70" x2="265" y2="70" stroke="#facc15" strokeWidth="2" />
        <line x1="320" y1="95" x2="320" y2="140" stroke="#facc15" strokeWidth="2" />
        <line x1="265" y1="170" x2="235" y2="170" stroke="#facc15" strokeWidth="2" />
      </svg>
    ),
    keyLabels: [
      { label: 'वाउचर प्रविष्टि (Voucher Entry)', desc: 'Tally Prime का प्रारंभिक बिंदु जहाँ बिल, रसीद, इनवॉइस दर्ज की जाती है।' },
      { label: 'ट्रायल बैलेंस (Trial Balance)', desc: 'सभी डेबिट और क्रेडिट शेषों की सूची जो गणितीय शुद्धता प्रमाणित करती है।' },
      { label: 'बैलेंस शीट (Balance Sheet)', desc: 'व्यापार की कुल संपत्तियों (Assets) और देनदारियों (Liabilities) का वित्तीय दर्पण।' }
    ]
  }
];

// -------------------------------------------------------------
// TYPING PRACTICE PASSAGES
// -------------------------------------------------------------
const TYPING_PASSAGES = {
  english: [
    "Digital education in India is transforming the future of young learners. Through accessible NCERT line-by-line notes, competitive practice papers, and computer training in MS Office and Tally Prime, students from every town and village can achieve top ranks in NEET, JEE Mains, and board examinations with dedication.",
    "Computer literacy is the most essential skill in modern workplaces. Learning Advanced Excel formulas like VLOOKUP and Pivot Tables enables professionals to analyze large datasets quickly and accurately. Coupled with Tally Prime for GST invoicing, it unlocks promising career opportunities.",
    "Self reliance and consistent hard work are the keys to extraordinary achievement. When students read each textbook concept thoroughly instead of relying on shortcuts, they build strong foundational knowledge that serves them for a lifetime in higher education."
  ],
  hindi: [
    "डिजिटल शिक्षा भारत के प्रत्येक विद्यार्थी को आत्मनिर्भर बनाने का सशक्त माध्यम है। कक्षा एक से बारहवीं तक की एनसीईआरटी पाठ्यपुस्तकों का अध्ययन, नीट और जेईई मेन्स के अभ्यास प्रश्न, तथा कंप्यूटर व टैली प्राइम का व्यावहारिक ज्ञान विद्यार्थियों के उज्ज्वल भविष्य की नींव रखता है।",
    "कंप्यूटर एवं सूचना प्रौद्योगिकी का ज्ञान आज के युग में अनिवार्य है। एमएस वर्ड में दस्तावेज निर्माण, एक्सेल में गणना एवं टैली प्राइम में जीएसटी बिलिंग सीखकर युवा स्वरोजगार और सरकारी सेवाओं में सफलता प्राप्त कर सकते हैं।",
    "सफलता का कोई शॉर्टकट नहीं होता। जब विद्यार्थी किसी विषय की गहराई को समझकर निरंतर अभ्यास करते हैं, तो वे परीक्षा में सर्वोच्च अंक प्राप्त करने के साथ-साथ जीवन के हर क्षेत्र में विजय प्राप्त करते हैं।"
  ]
};

export const VideoClassesAndLabsHub: React.FC<VideoClassesAndLabsHubProps> = ({
  initialTab = 'ncert',
  onClose
}) => {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'ncert' | 'neet_jee' | 'adca' | 'tally' | 'mcq' | 'typing' | 'figures'>(initialTab);
  
  // Selected Video Player
  const [selectedVideo, setSelectedVideo] = useState<VideoLessonItem>(ALL_STUDY_VIDEOS[0]);
  const [videoFilterCategory, setVideoFilterCategory] = useState<'all' | '1-5' | '6-8' | '9-10' | '11-12'>('all');

  // MCQ Test State
  const [mcqCategory, setMcqCategory] = useState<'all' | 'ncert' | 'neet' | 'jee' | 'adca' | 'tally'>('all');
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState<Record<string, number>>({});
  const [mcqSubmitted, setMcqSubmitted] = useState<boolean>(false);

  // Typing Test State
  const [typingLang, setTypingLang] = useState<'english' | 'hindi'>('english');
  const [typingPassageIndex, setTypingPassageIndex] = useState<number>(0);
  const [typingInput, setTypingInput] = useState<string>('');
  const [typingTimeLeft, setTypingTimeLeft] = useState<number>(60);
  const [typingDuration, setTypingDuration] = useState<number>(60);
  const [isTypingActive, setIsTypingActive] = useState<boolean>(false);
  const [isTypingCompleted, setIsTypingCompleted] = useState<boolean>(false);
  const typingTimerRef = useRef<any>(null);

  // Filter study videos
  const filteredVideos = ALL_STUDY_VIDEOS.filter((v) => {
    if (activeTab === 'ncert' && v.category !== 'ncert') return false;
    if (activeTab === 'neet_jee' && v.category !== 'neet_jee') return false;
    if (activeTab === 'adca' && v.category !== 'adca') return false;
    if (activeTab === 'tally' && v.category !== 'tally') return false;

    if (activeTab === 'ncert' && videoFilterCategory !== 'all') {
      if (videoFilterCategory === '1-5' && !v.classOrLevel.includes('1-2') && !v.classOrLevel.includes('1-3') && !v.classOrLevel.includes('2-5')) return false;
      if (videoFilterCategory === '6-8' && !v.classOrLevel.includes('6-8')) return false;
      if (videoFilterCategory === '9-10' && !v.classOrLevel.includes('10')) return false;
      if (videoFilterCategory === '11-12' && !v.classOrLevel.includes('11-12')) return false;
    }

    return true;
  });

  // Current typing target passage
  const currentPassage = TYPING_PASSAGES[typingLang][typingPassageIndex % TYPING_PASSAGES[typingLang].length];

  // Typing Timer Logic
  useEffect(() => {
    if (isTypingActive && typingTimeLeft > 0) {
      typingTimerRef.current = setInterval(() => {
        setTypingTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(typingTimerRef.current);
            setIsTypingActive(false);
            setIsTypingCompleted(true);
            soundEffects.playCelebration();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(typingTimerRef.current);
    }
    return () => clearInterval(typingTimerRef.current);
  }, [isTypingActive, typingTimeLeft]);

  // Handle typing input
  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!isTypingActive && !isTypingCompleted && val.length > 0) {
      setIsTypingActive(true);
    }
    setTypingInput(val);

    // Auto complete if target fully matched
    if (val.trim() === currentPassage.trim()) {
      setIsTypingActive(false);
      setIsTypingCompleted(true);
      soundEffects.playCelebration();
    }
  };

  const handleResetTyping = () => {
    setIsTypingActive(false);
    setIsTypingCompleted(false);
    setTypingTimeLeft(typingDuration);
    setTypingInput('');
    soundEffects.playBoing();
  };

  // Calculate Typing Stats
  const calculateTypingStats = () => {
    const typedWords = typingInput.trim().split(/\s+/).filter(Boolean).length;
    const timeSpentSecs = typingDuration - typingTimeLeft;
    const timeSpentMins = Math.max(0.1, timeSpentSecs / 60);
    const rawWpm = Math.round(typedWords / timeSpentMins);

    let correctChars = 0;
    const minLen = Math.min(typingInput.length, currentPassage.length);
    for (let i = 0; i < minLen; i++) {
      if (typingInput[i] === currentPassage[i]) {
        correctChars++;
      }
    }
    const accuracy = typingInput.length > 0 ? Math.round((correctChars / typingInput.length) * 100) : 100;
    const netWpm = Math.max(0, Math.round(rawWpm * (accuracy / 100)));

    return { rawWpm, netWpm, accuracy, correctChars, totalTyped: typingInput.length };
  };

  const typingStats = calculateTypingStats();

  // MCQ Stats
  const filteredMcqs = HUB_MCQ_BANK.filter((m) => mcqCategory === 'all' || m.category === mcqCategory);

  const calculateMcqScore = () => {
    let score = 0;
    filteredMcqs.forEach((m) => {
      if (selectedMcqAnswers[m.id] === m.correctIndex) {
        score += 4;
      }
    });
    return {
      score,
      maxScore: filteredMcqs.length * 4,
      totalQuestions: filteredMcqs.length,
      attempted: Object.keys(selectedMcqAnswers).length
    };
  };

  const mcqScore = calculateMcqScore();

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      
      {/* 1. TOP HERO BANNER: OFFICIAL VIDEO CLASS & INTERACTIVE LABS */}
      <div className="rounded-3xl p-5 sm:p-7 bg-gradient-to-r from-red-900 via-slate-950 to-indigo-950 text-white border-2 border-red-500/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-400/30 text-xs font-black uppercase tracking-wider">
              <Tv className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>IOIS Official Digital Video Classroom & Interactive Labs 2026</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              सम्पूर्ण वीडियो कक्षाएं, ADCA, Tally, MCQ व टाइपिंग लैब
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              1 से 12वीं NCERT, NEET & JEE Mains वीडियो लेक्चर्स, ADCA कंप्यूटर डिप्लोमा नोट्स, Tally Prime + GST एकाउंटिंग, इंटरैक्टिव MCQ टेस्ट, हिंदी/अंग्रेजी टाइपिंग लैब व सचित्र आरेख।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center shrink-0">
              <span className="text-[10px] text-red-200 uppercase font-black block">अध्ययन किट</span>
              <div className="text-xl font-black text-amber-400">2026 Edition</div>
              <span className="text-[9px] text-emerald-400 font-bold">100% Unlocked</span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HUB NAVIGATION TABS */}
      <div className="p-2 rounded-2xl bg-white border-2 border-slate-200 shadow-sm flex flex-wrap items-center gap-1.5 text-xs font-bold">
        
        <button
          onClick={() => {
            setActiveTab('ncert');
            if (ALL_STUDY_VIDEOS.length > 0) setSelectedVideo(ALL_STUDY_VIDEOS[0]);
            soundEffects.playBoing();
          }}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'ncert'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>📖 NCERT 1 से 12वीं वीडियो</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('neet_jee');
            const neetVid = ALL_STUDY_VIDEOS.find(v => v.category === 'neet_jee');
            if (neetVid) setSelectedVideo(neetVid);
            soundEffects.playBoing();
          }}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'neet_jee'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span>🎯 NEET & JEE Mains मास्टरक्लास</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('adca');
            const adcaVid = ALL_STUDY_VIDEOS.find(v => v.category === 'adca');
            if (adcaVid) setSelectedVideo(adcaVid);
            soundEffects.playBoing();
          }}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'adca'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>💻 ADCA कम्प्यूटर्स सम्पूर्ण कोर्स</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('tally');
            const tallyVid = ALL_STUDY_VIDEOS.find(v => v.category === 'tally');
            if (tallyVid) setSelectedVideo(tallyVid);
            soundEffects.playBoing();
          }}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'tally'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>📊 Tally Prime + GST एकाउंटिंग</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('mcq');
            soundEffects.playBoing();
          }}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'mcq'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>📝 ऑनलाइन MCQ अभ्यास टेस्ट</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('typing');
            soundEffects.playBoing();
          }}
          className={`px-3.5 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'typing'
              ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 shadow-md ring-2 ring-amber-400'
              : 'text-amber-700 hover:bg-amber-50'
          }`}
        >
          <Keyboard className="w-4 h-4 text-amber-600" />
          <span>⌨️ हिंदी व इंग्लिश टाइपिंग लैब</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('figures');
            soundEffects.playBoing();
          }}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'figures'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>🖼️ सचित्र आरेख (Figures Gallery)</span>
        </button>

      </div>

      {/* 3. VIDEO LECTURES VIEW (For NCERT, NEET/JEE, ADCA, TALLY) */}
      {(activeTab === 'ncert' || activeTab === 'neet_jee' || activeTab === 'adca' || activeTab === 'tally') && (
        <div className="space-y-6">
          
          {/* Sub-Filter Bar for NCERT */}
          {activeTab === 'ncert' && (
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto">
              <span className="text-slate-500 pl-2 shrink-0">कक्षा स्तर:</span>
              {(['all', '1-5', '6-8', '9-10', '11-12'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setVideoFilterCategory(lvl)}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                    videoFilterCategory === lvl ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl === 'all' ? 'सभी कक्षाएं (1-12)' : lvl === '1-5' ? '1 से 5वीं (Primary)' : lvl === '6-8' ? '6 से 8वीं (Middle)' : lvl === '9-10' ? '9 से 10वीं (Board)' : '11 से 12वीं (Senior)'}
                </button>
              ))}
            </div>
          )}

          {/* Main Video Player & Playlist Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Active Video Player Embed & High-Yield Summary */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Responsive 16:9 Video Embed Container */}
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-300 shadow-xl">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1&autoplay=0`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Details Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 font-black text-[10px] uppercase">
                        {selectedVideo.classOrLevel}
                      </span>
                      <span className="font-bold text-slate-500">
                        {selectedVideo.subject}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                      {selectedVideo.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-slate-100 font-mono font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{selectedVideo.duration}</span>
                    </span>
                    <a
                      href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1 shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>YouTube पर खोलें</span>
                    </a>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed font-medium">
                  {selectedVideo.description}
                </p>

                {/* Key Points */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <strong className="font-black text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>इस वीडियो पाठ के मुख्य बिंदु (Key Learning Outcomes):</span>
                  </strong>
                  <ul className="space-y-1.5 text-slate-700 font-medium">
                    {selectedVideo.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Study Notes Snippet */}
                {selectedVideo.notesSnippet && (
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
                    <span className="text-[11px] font-black uppercase text-[#1e3a8a] block">
                      📝 त्वरित परीक्षा नोट्स (Quick Revision Note):
                    </span>
                    <p className="text-slate-800 leading-relaxed font-mono text-[11px] sm:text-xs">
                      {selectedVideo.notesSnippet}
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Right: Scrollable Playlist of Available Lessons */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                  <ListVideo className="w-4 h-4 text-red-600" />
                  <span>उपलब्ध वीडियो पाठ सूची ({filteredVideos.length})</span>
                </span>
                <span className="text-[11px] text-slate-500 font-bold">100% फ्री एक्सेस</span>
              </div>

              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                {filteredVideos.map((video) => {
                  const isCurrent = video.id === selectedVideo.id;
                  return (
                    <div
                      key={video.id}
                      onClick={() => {
                        setSelectedVideo(video);
                        soundEffects.playBoing();
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 text-xs ${
                        isCurrent
                          ? 'bg-red-50/80 border-red-500 shadow-md ring-2 ring-red-400/30'
                          : 'bg-white border-slate-200 hover:border-red-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isCurrent ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Play className="w-4 h-4 fill-current" />
                      </div>

                      <div className="min-w-0 space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-black text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                            {video.classOrLevel}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{video.duration}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 leading-snug line-clamp-2">
                          {video.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium block truncate">
                          {video.subject}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. ONLINE MCQ PRACTICE TEST LAB */}
      {activeTab === 'mcq' && (
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-6 text-xs">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                <span>ऑनलाइन वस्तुनिष्ठ परीक्षा (MCQ Practice Test Lab)</span>
              </h3>
              <p className="text-slate-600">
                NCERT 1-12, NEET, JEE, ADCA एवं Tally के वास्तविक परीक्षा पैटर्न आधारित प्रश्न (+4 अंक)।
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'ncert', 'neet', 'jee', 'adca', 'tally'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMcqCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all uppercase text-[11px] ${
                    mcqCategory === cat ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'सभी विषय' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Test Questions List */}
          <div className="space-y-5">
            {filteredMcqs.map((q, qIndex) => {
              const selectedOpt = selectedMcqAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-black text-[10px] uppercase">
                      प्रश्न {qIndex + 1} • {q.category.toUpperCase()}
                    </span>
                    {mcqSubmitted && (
                      <span className={`font-black text-xs ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isCorrect ? '✓ सही (+4)' : isAnswered ? '✕ गलत (-1)' : '○ अप्रयासित'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-relaxed">
                    {q.question}
                  </h4>

                  {/* 4 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      let btnCls = 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200';

                      if (mcqSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnCls = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                        } else if (isOptionSelected) {
                          btnCls = 'bg-rose-100 border-rose-500 text-rose-900';
                        } else {
                          btnCls = 'opacity-50 bg-white border-slate-200';
                        }
                      } else if (isOptionSelected) {
                        btnCls = 'bg-purple-100 border-purple-600 text-purple-950 font-bold ring-2 ring-purple-400';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            if (!mcqSubmitted) {
                              setSelectedMcqAnswers(prev => ({ ...prev, [q.id]: optIdx }));
                              soundEffects.playBoing();
                            }
                          }}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${btnCls}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Solution Explanation if Submitted */}
                  {mcqSubmitted && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                      <strong className="block font-bold">व्याख्या (Solution):</strong>
                      <p className="leading-relaxed font-medium">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div>
              {mcqSubmitted && (
                <div className="text-sm font-black text-slate-900">
                  कुल प्राप्तांक: <span className="text-purple-700 font-mono text-lg">{mcqScore.score}</span> / {mcqScore.maxScore} (प्रयासित: {mcqScore.attempted})
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!mcqSubmitted ? (
                <button
                  onClick={() => {
                    setMcqSubmitted(true);
                    soundEffects.playCelebration();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md active:scale-95 transition-all"
                >
                  उत्तर सबमिट करें व स्कोरकार्ड देखें
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedMcqAnswers({});
                    setMcqSubmitted(false);
                    soundEffects.playBoing();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>पुनः टेस्ट शुरू करें (Reset)</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 5. INTERACTIVE TYPING TEST LAB (ENGLISH & HINDI) */}
      {activeTab === 'typing' && (
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-6 text-xs">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] uppercase">
                <Keyboard className="w-3.5 h-3.5 text-amber-700" />
                <span>लाइव स्पीड टाइपिंग टेस्ट प्रयोगशाला</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                हिंदी एवं अंग्रेजी गति टाइपिंग टेस्ट (Speed Typing Test)
              </h3>
              <p className="text-slate-600">
                दिए गए पैराग्राफ को देखकर टाइप करें। रियल-टाइम WPM (शब्द प्रति मिनट), शुद्धता प्रतिशत व प्रमाण पत्र।
              </p>
            </div>

            {/* Controls: Language and Timer Duration */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Language Switch */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 font-bold">
                <button
                  onClick={() => {
                    setTypingLang('english');
                    handleResetTyping();
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    typingLang === 'english' ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English Typing
                </button>
                <button
                  onClick={() => {
                    setTypingLang('hindi');
                    handleResetTyping();
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    typingLang === 'hindi' ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  हिंदी टाइपिंग (देवनागरी)
                </button>
              </div>

              {/* Duration Switch */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 font-bold">
                {[60, 120, 300].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => {
                      setTypingDuration(dur);
                      setTypingTimeLeft(dur);
                      setIsTypingActive(false);
                      setIsTypingCompleted(false);
                      setTypingInput('');
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                      typingDuration === dur ? 'bg-[#1e3a8a] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {dur / 60} मिनट
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Typing Dashboard Gauge Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">शेष समय (Time Left)</span>
              <span className="text-2xl font-black font-mono text-amber-700">
                {Math.floor(typingTimeLeft / 60)}:{(typingTimeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">कुल गति (Gross WPM)</span>
              <span className="text-2xl font-black font-mono text-[#1e3a8a]">
                {typingStats.rawWpm} WPM
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">सटीकता (Accuracy %)</span>
              <span className="text-2xl font-black font-mono text-emerald-700">
                {typingStats.accuracy}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
              <span className="text-[10px] uppercase font-bold text-purple-800 block">शुद्ध गति (Net Speed)</span>
              <span className="text-2xl font-black font-mono text-purple-700">
                {typingStats.netWpm} WPM
              </span>
            </div>
          </div>

          {/* Target Passage Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-500 font-bold">
              <span>अभ्यास पैराग्राफ (Type the text below):</span>
              <button
                onClick={() => {
                  setTypingPassageIndex(prev => prev + 1);
                  handleResetTyping();
                }}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>दूसरा पैराग्राफ बदलें</span>
              </button>
            </div>
            
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-300 font-mono text-sm sm:text-base leading-relaxed text-slate-800 select-none">
              {currentPassage.split('').map((char, index) => {
                let charStyle = 'text-slate-800';
                if (index < typingInput.length) {
                  if (typingInput[index] === char) {
                    charStyle = 'bg-emerald-200 text-emerald-950 font-bold';
                  } else {
                    charStyle = 'bg-rose-200 text-rose-950 underline font-bold';
                  }
                } else if (index === typingInput.length) {
                  charStyle = 'border-b-2 border-blue-600 animate-pulse bg-blue-100 font-bold';
                }
                return (
                  <span key={index} className={charStyle}>
                    {char}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Typing Input Box */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">
              टाइपिंग प्रारंभ करने के लिए नीचे लिखना शुरू करें (Start typing here):
            </label>
            <textarea
              rows={4}
              value={typingInput}
              onChange={handleTypingChange}
              disabled={isTypingCompleted}
              placeholder={isTypingCompleted ? "टेस्ट समाप्त हो गया! नीचे अपना स्कोर देखें।" : "यहाँ तेजी से टाइप करें..."}
              className="w-full p-4 rounded-2xl border-2 border-blue-400 focus:border-[#1e3a8a] outline-none font-mono text-sm sm:text-base leading-relaxed bg-white shadow-inner resize-none disabled:bg-slate-100"
            />
          </div>

          {/* Controls & Result Card */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetTyping}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold flex items-center gap-1.5 shadow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>पुनः टाइपिंग टेस्ट दें (Reset)</span>
              </button>
            </div>

            {isTypingCompleted && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 flex items-center gap-4">
                <Award className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-black text-sm text-emerald-950">
                    बधाई! आपका टाइपिंग टेस्ट पूर्ण हुआ 🎉
                  </h4>
                  <p className="text-emerald-800 text-[11px]">
                    आपकी गति: <strong>{typingStats.netWpm} WPM</strong> • सटीकता: <strong>{typingStats.accuracy}%</strong> ({typingStats.netWpm >= 35 ? 'सरकारी व प्राइवेट नौकरी हेतु योग्य' : 'नियमित अभ्यास से गति और बढ़ाएं'})
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 6. EDUCATIONAL FIGURES & DIAGRAMS GALLERY */}
      {activeTab === 'figures' && (
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-6 text-xs">
          
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              <span>शैक्षणिक सचित्र आरेख एवं फ्लोचार्ट्स (Diagrams & Flowcharts)</span>
            </h3>
            <p className="text-slate-600">
              कक्षा 1-12 विज्ञान, कंप्यूटर आर्किटेक्चर एवं Tally Prime वाउचर प्रवाह के आधिकारिक 2D तकनीकी आरेख।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EDUCATIONAL_FIGURES.map((fig) => (
              <div
                key={fig.id}
                className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 hover:border-indigo-400 space-y-4 shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-black text-[10px] uppercase">
                      {fig.badge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">
                      {fig.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-base text-slate-900 leading-snug">
                      {fig.title}
                    </h4>
                    <p className="text-slate-500 text-[11px] font-medium mt-0.5">
                      {fig.subtitle}
                    </p>
                  </div>

                  {/* SVG Figure Diagram */}
                  <div className="overflow-hidden shadow-inner border border-slate-300 rounded-2xl">
                    {fig.svgIllustration}
                  </div>

                  <p className="text-slate-700 leading-relaxed font-medium pt-1">
                    {fig.description}
                  </p>
                </div>

                {/* Key Labels */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 pt-2">
                  <strong className="text-[11px] font-black uppercase text-indigo-900 block">
                    मुख्य अंग एवं कार्य (Key Diagram Labels):
                  </strong>
                  <ul className="space-y-1 text-slate-700 text-[11px]">
                    {fig.keyLabels.map((lbl, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-black">•</span>
                        <span><strong>{lbl.label}:</strong> {lbl.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
