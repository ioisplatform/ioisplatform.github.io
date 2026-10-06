export interface PlanLessonItem {
  id: string;
  planId: string;
  lessonNumber: number;
  titleHindi: string;
  titleEnglish: string;
  subject: string;
  estimatedMinutes: number;
  type: 'reading' | 'practice' | 'video' | 'worksheet' | 'quiz';
  description: string;
  difficulty: 'बुनियादी' | 'मध्यम' | 'उन्नत';
  badge?: string;
}

export const ALL_PLAN_LESSONS: Record<string, PlanLessonItem[]> = {
  'plan-01': [
    {
      id: 'p1-l1',
      planId: 'plan-01',
      lessonNumber: 1,
      titleHindi: 'NCERT रिमझिम हिंदी: अ से ज्ञ वर्णमाला व मनोहर पोथी',
      titleEnglish: 'Hindi Varnamala, Swar, Vyanjan & Phonetics',
      subject: 'हिंदी भाषा',
      estimatedMinutes: 20,
      type: 'reading',
      description: 'सचित्र अ से अनार, क से कबूतर, मात्रा ज्ञान एवं प्रारंभिक सुलेख अभ्यास।',
      difficulty: 'बुनियादी'
    },
    {
      id: 'p1-l2',
      planId: 'plan-01',
      lessonNumber: 2,
      titleHindi: 'Good English Marigold: A to Z Phonics व 4-लाइन ट्रेसिंग',
      titleEnglish: 'English Phonics, 4-Line Copybook & 100 Sight Words',
      subject: 'अंग्रेजी',
      estimatedMinutes: 25,
      type: 'worksheet',
      description: 'कैपिटल व स्मॉल लेटर्स (Aa to Zz), 4-लाइन ट्रेसिंग व सचित्र दैनिक शब्दावली।',
      difficulty: 'बुनियादी'
    },
    {
      id: 'p1-l3',
      planId: 'plan-01',
      lessonNumber: 3,
      titleHindi: 'गणित का जादू: 1 से 100 तक गिनती व 2 से 20 पहाड़ा चार्ट',
      titleEnglish: 'Numbers 1-100 & Mathematical Tables 2 to 20',
      subject: 'प्रारंभिक गणित',
      estimatedMinutes: 30,
      type: 'practice',
      description: 'सचित्र गिनती, वास्तविक जीवन के उदाहरणों के साथ 2 से 20 तक संपूर्ण पहाड़ा।',
      difficulty: 'बुनियादी'
    },
    {
      id: 'p1-l4',
      planId: 'plan-01',
      lessonNumber: 4,
      titleHindi: 'पर्यावरण अध्ययन (Looking Around EVS): प्रकृति, पेड़-पौधे व ऋतुएँ',
      titleEnglish: 'Environmental Studies, Nature & Seasons',
      subject: 'EVS पर्यावरण',
      estimatedMinutes: 20,
      type: 'reading',
      description: 'मौसम, दैनिक परिवेश, पशु-पक्षी और स्वच्छता की बुनियादी आदतें।',
      difficulty: 'बुनियादी'
    },
    {
      id: 'p1-l5',
      planId: 'plan-01',
      lessonNumber: 5,
      titleHindi: 'इंटरैक्टिव गणित प्रयोगशाला: सचित्र जोड़ ➕ व घटाव ➖ अभ्यास',
      titleEnglish: 'Interactive Math Lab: Visual Addition & Subtraction',
      subject: 'गणित लैब',
      estimatedMinutes: 25,
      type: 'quiz',
      description: 'सचित्र वस्तु समूहों को गिनकर जोड़ना और घटाना, हासिल के प्रश्न।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p1-l6',
      planId: 'plan-01',
      lessonNumber: 6,
      titleHindi: 'बाल विकास 500+ A4 प्रिंटेबल वर्कशीट्स व एक्टिविटी शीट्स',
      titleEnglish: '500+ Printable A4 Activity Worksheets & Coloring',
      subject: 'वर्कशीट्स',
      estimatedMinutes: 35,
      type: 'worksheet',
      description: 'NEP 2020 NCF-FS मानक अनुसार घर पर प्रिंट करने योग्य अभ्यास पत्र।',
      difficulty: 'बुनियादी'
    },
    {
      id: 'p1-l7',
      planId: 'plan-01',
      lessonNumber: 7,
      titleHindi: 'बाल विकास साप्ताहिक मौखिक मूल्यांकन व प्रमाण पत्र योग्यता',
      titleEnglish: 'Weekly Oral Assessment & Completion Badge',
      subject: 'मूल्यांकन',
      estimatedMinutes: 15,
      type: 'quiz',
      description: 'कक्षा 1-5 के संपूर्ण मूल पाठ्यक्रम का मौखिक व वस्तुनिष्ठ परीक्षण।',
      difficulty: 'मध्यम'
    }
  ],

  'plan-02': [
    {
      id: 'p2-l1',
      planId: 'plan-02',
      lessonNumber: 1,
      titleHindi: 'ATS-फ्रेंडली प्रोफेशनल बायोडाटा एवं CV डिजाइनिंग',
      titleEnglish: 'ATS-Compliant Resume & Modern CV Templates',
      subject: 'करियर टूल्स',
      estimatedMinutes: 35,
      type: 'worksheet',
      description: 'कॉर्पोरेट और सरकारी नौकरियों के लिए शॉर्टलिस्ट होने वाले आधुनिक बायोडाटा फॉर्मेट्स।',
      difficulty: 'बुनियादी'
    },
    {
      id: 'p2-l2',
      planId: 'plan-02',
      lessonNumber: 2,
      titleHindi: 'AI प्रॉम्प्ट इंजीनियरिंग मास्टरक्लास (ChatGPT, Gemini व Claude)',
      titleEnglish: 'Generative AI Prompt Engineering Guide',
      subject: 'AI स्किल्स',
      estimatedMinutes: 40,
      type: 'practice',
      description: 'असाइनमेंट, ईमेल ड्राफ्टिंग, कोडिंग व रिसर्च हेतु 200+ सिद्ध AI प्रॉम्ट्स।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p2-l3',
      planId: 'plan-02',
      lessonNumber: 3,
      titleHindi: 'आधिकारिक जॉब आवेदन पत्र एवं कवर लेटर फॉर्मेट्स',
      titleEnglish: 'Job Application Letters & Professional Cover Letters',
      subject: 'ड्राफ्टिंग',
      estimatedMinutes: 25,
      type: 'reading',
      description: 'फॉर्मल लेटर राइटिंग, लीव एप्लीकेशन और रिक्रूटर को भेजने योग्य संदेश।',
      difficulty: 'बुनियादी'
    },
    {
      id: 'p2-l4',
      planId: 'plan-02',
      lessonNumber: 4,
      titleHindi: 'कॉर्पोरेट ईमेल शिष्टाचार व डिजिटल संचार कौशल',
      titleEnglish: 'Corporate Email Etiquette & Digital Communication',
      subject: 'कम्युनिकेशन',
      estimatedMinutes: 25,
      type: 'video',
      description: 'To, Cc, Bcc का सही उपयोग, प्रोफेशनल टोन, फॉलो-अप संदेश और मीटिंग शिष्टाचार।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p2-l5',
      planId: 'plan-02',
      lessonNumber: 5,
      titleHindi: 'शीर्ष 50 नौकरी साक्षात्कार प्रश्न एवं प्रभावशाली उत्तर',
      titleEnglish: 'Top 50 Job Interview Questions & Behavioral Answers',
      subject: 'इंटरव्यू',
      estimatedMinutes: 45,
      type: 'quiz',
      description: 'Tell me about yourself, Strengths & Weaknesses और HR राउंड मॉक प्रैक्टिस।',
      difficulty: 'उन्नत'
    },
    {
      id: 'p2-l6',
      planId: 'plan-02',
      lessonNumber: 6,
      titleHindi: 'लिंक्डइन प्रोफाइल ऑप्टिमाइजेशन एवं ऑनलाइन नेटवर्किंग',
      titleEnglish: 'LinkedIn Profile Building & Career Networking',
      subject: 'नेटवर्किंग',
      estimatedMinutes: 30,
      type: 'practice',
      description: 'हेडलाइन, अबाउट सेक्शन, स्किल एंडोर्समेंट व सीधे रिक्रूटर्स से संपर्क।',
      difficulty: 'मध्यम'
    }
  ],

  'plan-03': [
    {
      id: 'p3-l1',
      planId: 'plan-03',
      lessonNumber: 1,
      titleHindi: 'डिजिलॉकर (DigiLocker) आधिकारिक खाता निर्माण एवं दस्तावेज फेचिंग',
      titleEnglish: 'DigiLocker Setup, Certificate Verification & Storage',
      subject: 'ई-गवर्नेंस',
      estimatedMinutes: 20,
      type: 'practice',
      description: 'आधार से डिजिलॉकर लिंक करना, 10वीं/12वीं मार्कशीट और ड्राइविंग लाइसेंस जोड़ना।',
      difficulty: 'बुनियादी'
    },
    {
      id: 'p3-l2',
      planId: 'plan-03',
      lessonNumber: 2,
      titleHindi: 'पीएम किसान, आयुष्मान भारत व स्वास्थ्य कार्ड आवेदन प्रक्रिया',
      titleEnglish: 'PM Kisan & Ayushman Bharat Health Card Portals',
      subject: 'सरकारी योजनाएं',
      estimatedMinutes: 30,
      type: 'reading',
      description: '₹5 लाख का मुफ्त इलाज कार्ड, ई-केवाईसी प्रक्रिया और पात्रता सूची जांच।',
      difficulty: 'बुनियादी'
    },
    {
      id: 'p3-l3',
      planId: 'plan-03',
      lessonNumber: 3,
      titleHindi: 'तत्काल ई-पैन कार्ड (Instant E-PAN) व आधार पैन लिंकिंग',
      titleEnglish: 'Instant E-PAN Card Generation & Aadhaar Linking',
      subject: 'वित्तीय पहचान',
      estimatedMinutes: 25,
      type: 'video',
      description: 'इनकम टैक्स पोर्टल से मात्र 10 मिनट में डिजिटल पैन कार्ड प्राप्त करना।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p3-l4',
      planId: 'plan-03',
      lessonNumber: 4,
      titleHindi: 'राज्य ई-डिस्ट्रिक्ट पोर्टल: आय, जाति एवं निवास प्रमाण पत्र',
      titleEnglish: 'State E-District: Income, Caste & Domicile Certificates',
      subject: 'नागरिक सेवाएं',
      estimatedMinutes: 35,
      type: 'worksheet',
      description: 'RTPS / ई-डिस्ट्रिक्ट पोर्टल पर ऑनलाइन आवेदन, शपथ पत्र और डाउनलोडिंग।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p3-l5',
      planId: 'plan-03',
      lessonNumber: 5,
      titleHindi: 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) छात्रवृत्ति आवेदन गाइड',
      titleEnglish: 'National Scholarship Portal (NSP) Step-by-Step Guide',
      subject: 'छात्रवृत्ति',
      estimatedMinutes: 30,
      type: 'reading',
      description: 'प्री-मैट्रिक, पोस्ट-मैट्रिक और मेरिट-कम-मीन्स स्कॉलरशिप के आवश्यक दस्तावेज।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p3-l6',
      planId: 'plan-03',
      lessonNumber: 6,
      titleHindi: 'मतदाता पहचान पत्र (Voter ID) ऑनलाइन पंजीकरण व सुधार',
      titleEnglish: 'Voter ID Online Registration & Voter Helpline NVSP',
      subject: 'नागरिक अधिकार',
      estimatedMinutes: 20,
      type: 'practice',
      description: 'फॉर्म 6 (नया नाम), फॉर्म 8 (सुधार/स्थानांतरण) और डिजिटल वोटर कार्ड डाउनलोड।',
      difficulty: 'बुनियादी'
    }
  ],

  'plan-04': [
    {
      id: 'p4-l1',
      planId: 'plan-04',
      lessonNumber: 1,
      titleHindi: 'कंप्यूटर सिस्टम आर्किटेक्चर, सीपीयू (ALU/CU) एवं विंडोज ओएस',
      titleEnglish: 'Computer Architecture, CPU Fundamentals & Windows OS',
      subject: 'हार्डवेयर व ओएस',
      estimatedMinutes: 30,
      type: 'video',
      description: 'इनपुट/आउटपुट डिवाइस, मेमोरी (RAM/ROM/Cache), फाइल मैनेजमेंट और शॉर्टकट्स।',
      difficulty: 'बुनियादी'
    },
    {
      id: 'p4-l2',
      planId: 'plan-04',
      lessonNumber: 2,
      titleHindi: 'MS Word 2024: आधिकारिक ड्राफ्टिंग, टेबल डिजाइनिंग व मेल मर्ज',
      titleEnglish: 'MS Word 2024: Official Documents, Tables & Mail Merge',
      subject: 'वर्ड प्रोसेसिंग',
      estimatedMinutes: 35,
      type: 'practice',
      description: 'पेज लेआउट, हेडर-फूटर, मेल मर्ज से एक साथ 100+ पत्र बनाना, वॉटरमार्क।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p4-l3',
      planId: 'plan-04',
      lessonNumber: 3,
      titleHindi: 'MS Excel Advanced: VLOOKUP, XLOOKUP, Pivot Tables व IF सूत्र',
      titleEnglish: 'MS Excel Advanced: Lookup Formulas, Pivot Tables & Data Analysis',
      subject: 'डेटा एनालिटिक्स',
      estimatedMinutes: 45,
      type: 'practice',
      description: 'सैलरी शीट, मार्कशीट गणना, SUMIFS, COUNTIFS और ऑटोमेटेड डैशबोर्ड चार्ट्स।',
      difficulty: 'उन्नत'
    },
    {
      id: 'p4-l4',
      planId: 'plan-04',
      lessonNumber: 4,
      titleHindi: 'MS PowerPoint: व्यावसायिक प्रेजेंटेशन, स्लाइड मास्टर व एनिमेशन',
      titleEnglish: 'MS PowerPoint: Executive Decks, Slide Master & Animations',
      subject: 'प्रेजेंटेशन',
      estimatedMinutes: 25,
      type: 'worksheet',
      description: 'थीम कंसिस्टेंसी, स्लाइड शो शॉर्टकट्स (F5/Shift+F5) और विजुअल ग्राफिक्स।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p4-l5',
      planId: 'plan-04',
      lessonNumber: 5,
      titleHindi: 'Tally Prime लेखांकन के 3 स्वर्णिम नियम व कंपनी/लेजर निर्माण',
      titleEnglish: 'Tally Prime Fundamentals: Golden Rules, Company & Ledgers',
      subject: 'अकाउंटिंग',
      estimatedMinutes: 40,
      type: 'video',
      description: 'Personal, Real, Nominal खाते, चार्ट ऑफ एकाउंट्स एवं Alt+G मास्टर सर्च।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p4-l6',
      planId: 'plan-04',
      lessonNumber: 6,
      titleHindi: 'Tally Prime F4 से F9 तक सभी वाउचर प्रविष्टियाँ व खतौनी',
      titleEnglish: 'Voucher Entries F4 (Contra) to F9 (Purchase) in Tally Prime',
      subject: 'वाउचर एंट्री',
      estimatedMinutes: 45,
      type: 'practice',
      description: 'Contra, Payment, Receipt, Journal, Sales और Purchase वाउचर पोस्टिंग।',
      difficulty: 'उन्नत'
    },
    {
      id: 'p4-l7',
      planId: 'plan-04',
      lessonNumber: 7,
      titleHindi: 'GST बिलिंग: CGST, SGST, IGST इनवॉइस एवं E-Way Bill',
      titleEnglish: 'GST Billing Invoicing, Intra-State vs Inter-State Tax',
      subject: 'टैक्सेशन',
      estimatedMinutes: 35,
      type: 'practice',
      description: 'टैक्स इनवॉइस निर्माण, HSN कोड, इनपुट टैक्स क्रेडिट (ITC) की अवधारणा।',
      difficulty: 'उन्नत'
    },
    {
      id: 'p4-l8',
      planId: 'plan-04',
      lessonNumber: 8,
      titleHindi: 'अंतिम वित्तीय विवरण: ट्रायल बैलेंस, बैलेंस शीट एवं P&L विश्लेषण',
      titleEnglish: 'Financial Statements: Trial Balance, Balance Sheet & Profit/Loss',
      subject: 'वित्तीय विश्लेषण',
      estimatedMinutes: 40,
      type: 'quiz',
      description: 'Assets = Capital + Liabilities समीकरण, GSTR-1/3B रिकॉन्सिलिएशन।',
      difficulty: 'उन्नत'
    }
  ],

  'plan-05': [
    {
      id: 'p5-l1',
      planId: 'plan-05',
      lessonNumber: 1,
      titleHindi: 'भौतिकी: किरण प्रकाशिकी, दर्पण सूत्र, अपवर्तन एवं लेंस समीकरण',
      titleEnglish: 'Physics: Ray Optics, Mirror Equation & Lens Formulas',
      subject: 'Physics भौतिकी',
      estimatedMinutes: 45,
      type: 'reading',
      description: '1/f = 1/v - 1/u, स्नेल का नियम (Snell Law), पूर्ण आंतरिक परावर्तन (TIR)।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p5-l2',
      planId: 'plan-05',
      lessonNumber: 2,
      titleHindi: 'भौतिकी: स्थिर वैद्युतिकी, कूलॉम का नियम व विद्युत धारा (ओम नियम)',
      titleEnglish: 'Physics: Electrostatics, Coulomb Law, Resistance & Circuits',
      subject: 'Physics भौतिकी',
      estimatedMinutes: 40,
      type: 'video',
      description: 'F = kq1q2/r², विभव, धारिता, किर्चॉफ के नियम और व्हीटस्टोन ब्रिज।',
      difficulty: 'उन्नत'
    },
    {
      id: 'p5-l3',
      planId: 'plan-05',
      lessonNumber: 3,
      titleHindi: 'रसायन विज्ञान: रासायनिक अभिक्रिया संतुलन, अम्ल, क्षार व लवण',
      titleEnglish: 'Chemistry: Chemical Reactions, Redox & pH Equilibrium',
      subject: 'Chemistry रसायन',
      estimatedMinutes: 35,
      type: 'practice',
      description: 'रेडॉक्स अभिक्रियाएं, ऑक्सीकरण संख्या, pH मान एवं उदासीनीकरण।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p5-l4',
      planId: 'plan-05',
      lessonNumber: 4,
      titleHindi: 'कार्बनिक रसायन: हाइड्रोकार्बन, कार्यात्मक समूह व अभिक्रिया क्रियाविधि',
      titleEnglish: 'Organic Chemistry: Hydrocarbons, Isomerism & Reaction Mechanisms',
      subject: 'Chemistry रसायन',
      estimatedMinutes: 50,
      type: 'reading',
      description: 'IUPAC नामकरण, एल्केन/एल्कीन/एल्काइन, SN1 vs SN2 न्यूक्लियोफिलिक प्रतिस्थापन।',
      difficulty: 'उन्नत'
    },
    {
      id: 'p5-l5',
      planId: 'plan-05',
      lessonNumber: 5,
      titleHindi: 'जीव विज्ञान (NEET): कोशिका चक्र, विभाजन, प्रकाश संश्लेषण व पोषण',
      titleEnglish: 'Biology (NEET): Cell Cycle, Mitosis, Meiosis & Photosynthesis',
      subject: 'Biology जीवविज्ञान',
      estimatedMinutes: 45,
      type: 'reading',
      description: 'केल्विन चक्र (C3/C4), पादप हॉर्मोन, माइटोकॉन्ड्रिया व एटीपी ऊर्जा उत्पादन।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p5-l6',
      planId: 'plan-05',
      lessonNumber: 6,
      titleHindi: 'जीव विज्ञान (NEET): मानव शरीर क्रिया विज्ञान (पाचन, श्वसन, परिसंचरण)',
      titleEnglish: 'Biology (NEET): Human Physiology (Digestion, Blood & Excretion)',
      subject: 'Biology जीवविज्ञान',
      estimatedMinutes: 45,
      type: 'video',
      description: 'आहार नाल, एंजाइम्स, हृदय चक्र (Cardiac Cycle), नेफ्रॉन एवं उत्सर्जन।',
      difficulty: 'उन्नत'
    },
    {
      id: 'p5-l7',
      planId: 'plan-05',
      lessonNumber: 7,
      titleHindi: 'गणित (JEE Mains): त्रिकोणमितीय सर्वसमिकाएँ, ऊंचाई व द्विघात समीकरण',
      titleEnglish: 'Mathematics: Trigonometry, Quadratic Equations & AP/GP',
      subject: 'Math गणित',
      estimatedMinutes: 40,
      type: 'practice',
      description: 'sin²θ+cos²θ=1, श्रीधराचार्य सूत्र, समांतर व गुणोत्तर श्रेणियां।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p5-l8',
      planId: 'plan-05',
      lessonNumber: 8,
      titleHindi: 'गणित (JEE Mains): अवकलन (Calculus), समाकलन एवं प्रायिकता',
      titleEnglish: 'Mathematics: Differentiation, Integration & Probability',
      subject: 'Math गणित',
      estimatedMinutes: 50,
      type: 'quiz',
      description: 'सीमा (Limits), सततता, निश्चित समाकलन एवं बेयस प्रमेय प्रायिकता।',
      difficulty: 'उन्नत'
    }
  ],

  'plan-06': [
    {
      id: 'p6-l1',
      planId: 'plan-06',
      lessonNumber: 1,
      titleHindi: 'फार्मास्युटिकल एनालिसिस: एसिड-बेस व रेडॉक्स टाइट्रेशन विधियाँ',
      titleEnglish: 'Pharmaceutical Analysis: Acid-Base & Redox Titrations',
      subject: 'Analysis एनालिसिस',
      estimatedMinutes: 40,
      type: 'reading',
      description: 'प्राइमरी स्टैंडर्ड्स, इंडिकेटर्स चयन, वॉल्यूमेट्रिक गणना व शुद्धता परीक्षण।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p6-l2',
      planId: 'plan-06',
      lessonNumber: 2,
      titleHindi: 'फार्माकोलॉजी: केंद्रीय तंत्रिका तंत्र (CNS) व न्यूरोट्रांसमीटर्स',
      titleEnglish: 'Pharmacology: Central Nervous System (CNS) & Neurotransmitters',
      subject: 'Pharmacology',
      estimatedMinutes: 45,
      type: 'video',
      description: 'सेडेटिव्स, हिप्नोटिक्स, एंटी-एपिलेप्टिक दवाएं, डोपामाइन व गाबा (GABA) रिसेप्टर्स।',
      difficulty: 'उन्नत'
    },
    {
      id: 'p6-l3',
      planId: 'plan-06',
      lessonNumber: 3,
      titleHindi: 'फार्माकोग्नोसी: औषधीय पौधे, एल्कलॉइड्स, ग्लाइकोसाइड्स एवं वोलेटाइल ऑयल',
      titleEnglish: 'Pharmacognosy: Herbal Drugs, Extraction & Active Constituents',
      subject: 'Pharmacognosy',
      estimatedMinutes: 35,
      type: 'reading',
      description: 'तुलसी, नीम, अश्वगंधा, डिजिटलिस, सर्पगंधा का निष्कर्षण एवं औषधीय उपयोग।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p6-l4',
      planId: 'plan-06',
      lessonNumber: 4,
      titleHindi: 'फार्मास्युटिक्स: डोसेज फॉर्म्स, सिरप, इमल्शन व टैबलेट फॉर्मूलेशन',
      titleEnglish: 'Pharmaceutics: Dosage Forms, Emulsions & Tablet Compaction',
      subject: 'Pharmaceutics',
      estimatedMinutes: 40,
      type: 'practice',
      description: 'टैबलेट कोटिंग, डिस्टिलेशन, स्टेबिलिटी टेस्टिंग एवं एसेप्टिक पैकेजिंग।',
      difficulty: 'उन्नत'
    },
    {
      id: 'p6-l5',
      planId: 'plan-06',
      lessonNumber: 5,
      titleHindi: 'हॉस्पिटल एवं क्लीनिकल फार्मेसी: प्रिस्क्रिप्शन एनालिसिस व ADR मॉनिटरिंग',
      titleEnglish: 'Clinical Pharmacy: Prescription Auditing & Adverse Drug Reactions',
      subject: 'Clinical Pharmacy',
      estimatedMinutes: 35,
      type: 'worksheet',
      description: 'दवा इंटरैक्शन, डोजेज कैलकुलेशन (पीडियाट्रिक डोज) और मरीज परामर्श।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p6-l6',
      planId: 'plan-06',
      lessonNumber: 6,
      titleHindi: 'ड्रग रेगुलेटरी अफेयर्स (CDSCO/FDA), फार्मेसी एक्ट व शेड्यूल H/X',
      titleEnglish: 'Drug Regulatory Affairs, Pharmacy Act & Schedule Guidelines',
      subject: 'फार्मेसी कानून',
      estimatedMinutes: 30,
      type: 'quiz',
      description: 'ड्रग्स एंड कॉस्मेटिक्स एक्ट 1940, नारकोटिक ड्रग्स नियम व लाइसेंसिंग प्रक्रिया।',
      difficulty: 'उन्नत'
    }
  ],

  'plan-07': [
    {
      id: 'p7-l1',
      planId: 'plan-07',
      lessonNumber: 1,
      titleHindi: 'राष्ट्रीय पाठ्यचर्या रूपरेखा (NCF) सम्पूर्ण बुनियादी अध्ययन फ्रेमवर्क',
      titleEnglish: 'National Curriculum Framework: Holistic K-12 Foundation',
      subject: 'मास्टर फाउंडेशन',
      estimatedMinutes: 35,
      type: 'reading',
      description: 'कक्षा 1 से 12 तक के मुख्य वैचारिक सूत्रों का समग्र सारांश एवं अध्ययन योजना।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p7-l2',
      planId: 'plan-07',
      lessonNumber: 2,
      titleHindi: 'फुल-स्टैक डिजिटल ऑफिस ऑटोमेशन व एडवांस अकाउंटिंग सिस्टम',
      titleEnglish: 'Full-Stack Digital Office Suite & Accounting Automation',
      subject: 'कंप्यूटर व IT',
      estimatedMinutes: 45,
      type: 'practice',
      description: 'वर्ड, एक्सेल, पावरपॉइंट और टैली प्राइम का संयुक्त व्यावसायिक उपयोग।',
      difficulty: 'उन्नत'
    },
    {
      id: 'p7-l3',
      planId: 'plan-07',
      lessonNumber: 3,
      titleHindi: 'वरिष्ठ प्रतियोगी परीक्षा रणनीति (NEET / JEE / स्टेट बोर्ड्स टॉपर रोडमैप)',
      titleEnglish: 'Competitive Exam Mastery Blueprint (NEET/JEE/Board Excellence)',
      subject: 'प्रतियोगी परीक्षा',
      estimatedMinutes: 40,
      type: 'video',
      description: 'समय प्रबंधन, 95%+ बोर्ड रणनीति, नेगेटिव मार्किंग से बचाव व रिवीजन शेड्यूल।',
      difficulty: 'उन्नत'
    },
    {
      id: 'p7-l4',
      planId: 'plan-07',
      lessonNumber: 4,
      titleHindi: 'करियर एवं रोजगार संवर्धन ब्लूप्रिंट: जॉब इंटरव्यू व स्वरोजगार',
      titleEnglish: 'Career Acceleration, Self-Employment & Freelancing Blueprint',
      subject: 'करियर विकास',
      estimatedMinutes: 35,
      type: 'worksheet',
      description: 'ऑनलाइन डिजिटल सर्विसेज, लोकल सीएससी/कंप्यूटर सेंटर शुरू करने की गाइड।',
      difficulty: 'मध्यम'
    },
    {
      id: 'p7-l5',
      planId: 'plan-07',
      lessonNumber: 5,
      titleHindi: 'वित्तीय साक्षरता, बैंकिंग, आयकर एवं पारिवारिक बजट प्रबंधन',
      titleEnglish: 'Financial Literacy, Taxation, UPI Safety & Family Budgeting',
      subject: 'वित्तीय ज्ञान',
      estimatedMinutes: 30,
      type: 'reading',
      description: 'बचत, निवेश (PPF/FD), साइबर फ्रॉड से बचाव (1930 हेल्पलाइन) व टैक्स बेसिक्स।',
      difficulty: 'बुनियादी'
    },
    {
      id: 'p7-l6',
      planId: 'plan-07',
      lessonNumber: 6,
      titleHindi: 'IOIS लाइफटाइम मास्टर सर्टिफिकेशन एवं पूर्णता परीक्षा',
      titleEnglish: 'IOIS Lifetime Master Assessment & Honors Certification',
      subject: 'मास्टर मूल्यांकन',
      estimatedMinutes: 50,
      type: 'quiz',
      description: 'सभी 7 योजनाओं के प्रमुख कौशलों का 50 प्रश्नों का व्यापक सर्टिफिकेशन टेस्ट।',
      difficulty: 'उन्नत'
    }
  ]
};

// Realistic starter lessons completed so the dashboard isn't bare zero
export const DEFAULT_STARTER_COMPLETED_LESSONS: Record<string, string[]> = {
  'plan-01': ['p1-l1', 'p1-l2', 'p1-l3', 'p1-l5'],
  'plan-02': ['p2-l1', 'p2-l2'],
  'plan-03': ['p3-l1'],
  'plan-04': ['p4-l1', 'p4-l2', 'p4-l3'],
  'plan-05': ['p5-l1', 'p5-l3'],
  'plan-06': ['p6-l1'],
  'plan-07': ['p7-l1', 'p7-l2']
};

export interface PlanProgressStats {
  planId: string;
  planNumber: number;
  total: number;
  completed: number;
  percent: number;
  remaining: number;
}

export function calculateAllPlansProgress(completedRecord: Record<string, string[]>): {
  totalLessons: number;
  totalCompleted: number;
  overallPercent: number;
  planStats: Record<string, PlanProgressStats>;
  sortedStats: PlanProgressStats[];
} {
  let totalLessons = 0;
  let totalCompleted = 0;
  const planStats: Record<string, PlanProgressStats> = {};
  const sortedStats: PlanProgressStats[] = [];

  const planIds = ['plan-01', 'plan-02', 'plan-03', 'plan-04', 'plan-05', 'plan-06', 'plan-07'];

  planIds.forEach((pid, idx) => {
    const lessons = ALL_PLAN_LESSONS[pid] || [];
    const completedList = completedRecord[pid] || [];
    const validCompleted = completedList.filter(id => lessons.some(l => l.id === id));
    const total = lessons.length;
    const completed = validCompleted.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    totalLessons += total;
    totalCompleted += completed;

    const stat: PlanProgressStats = {
      planId: pid,
      planNumber: idx + 1,
      total,
      completed,
      percent,
      remaining: Math.max(0, total - completed)
    };

    planStats[pid] = stat;
    sortedStats.push(stat);
  });

  const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return {
    totalLessons,
    totalCompleted,
    overallPercent,
    planStats,
    sortedStats
  };
}

export interface DailyActivityPoint {
  dayLabel: string;
  dayShort: string;
  dateStr: string;
  dailyCount: number;
  cumulativeCount: number;
  targetCount: number;
}

export function generateProgressVelocityTimeline(totalCompleted: number): DailyActivityPoint[] {
  // Generate a smooth, realistic 7-day velocity timeline leading up to the current completion count
  const days = [
    { label: 'सोमवार', short: 'सोम' },
    { label: 'मंगलवार', short: 'मंगल' },
    { label: 'बुधवार', short: 'बुध' },
    { label: 'गुरुवार', short: 'गुरु' },
    { label: 'शुक्रवार', short: 'शुक्र' },
    { label: 'शनिवार', short: 'शनि' },
    { label: 'आज (रविवार)', short: 'आज' }
  ];

  // Distribute totalCompleted across the 7 days
  const baseFraction = Math.max(1, Math.floor(totalCompleted / 7));
  const dailyDistribution = [
    Math.max(1, baseFraction - 1),
    Math.max(1, baseFraction),
    Math.max(1, baseFraction + 1),
    Math.max(0, baseFraction - 1),
    Math.max(2, baseFraction + 1),
    Math.max(2, baseFraction + 2),
    Math.max(1, baseFraction)
  ];

  // Adjust to sum up or scale close to totalCompleted
  let running = 0;
  return days.map((d, i) => {
    const daily = dailyDistribution[i];
    running = Math.min(totalCompleted, running + daily);
    if (i === days.length - 1) {
      running = totalCompleted;
    }
    const target = Math.round(((i + 1) / 7) * Math.max(totalCompleted, 20));
    return {
      dayLabel: d.label,
      dayShort: d.short,
      dateStr: `Day ${i + 1}`,
      dailyCount: daily,
      cumulativeCount: running,
      targetCount: target
    };
  });
}
