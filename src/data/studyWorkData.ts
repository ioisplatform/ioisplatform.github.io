import { StudyWorkModule } from '../types';

export const secretPlanPasswords: Record<string, string> = {
  'plan-01': 'IOISINDIAPLAN01',
  'plan-02': 'INDIANPLAN02',
  'plan-03': 'IOISINDIANPLAN03',
  'plan-04': 'FVAPLAN03',
  'plan-05': 'IOISSEAPLAN05',
  'plan-06': 'ARHIOISPLAN06',
  'plan-07': 'IOISFULLLMAPLAN07',
};

export const studyWorkModules: Record<string, StudyWorkModule> = {
  'plan-01': {
    planId: 'plan-01',
    planNumber: 1,
    planName: 'Bal Vikas Access',
    headerTagline: 'Class 1-5 NCERT डिजिटल अध्ययन एवं प्रारंभिक स्वावलंबन किट',
    overviewHindi: 'बाल विकास एक्सेस योजना प्राथमिक कक्षाओं (1st से 5th) के छात्रों, अभिभावकों और शुरुआती सदस्यों के लिए तैयार की गई है। इसमें सभी बुनियादी NCERT अध्ययन सामग्री, इंटरैक्टिव वर्कशीट्स, और प्राथमिक रेफरल प्रणाली शामिल है।',
    primaryResources: [
      {
        id: 'bv-01',
        title: 'Class 1-5 NCERT डिजिटल पुस्तकें एवं समाधान (PDF बंडल)',
        category: 'पाठ्यपुस्तकें',
        type: 'pdf',
        description: 'कक्षा 1 से 5 तक के सभी विषयों (हिंदी, गणित, अंग्रेजी, पर्यावरण अध्ययन) की उच्च गुणवत्ता वाली मुद्रण योग्य डिजिटल पुस्तकें।',
        fileSize: '48.2 MB',
        actionLabel: 'डाउनलोड / अध्ययन करें'
      },
      {
        id: 'bv-02',
        title: 'हिंदी वर्णमाला एवं सुलेख अभ्यास पुस्तिका (मनोहर पोथी)',
        category: 'कार्यपुस्तिका',
        type: 'guide',
        description: 'स्वर (अ से अः), व्यंजन (क से ज्ञ) और मात्राओं के साथ सुंदर लिखावट अभ्यास वर्कशीट्स।',
        fileSize: '18.5 MB',
        actionLabel: 'अभ्यास शीट खोलें'
      },
      {
        id: 'bv-03',
        title: 'Good English A to Z Phonics & 4-Line Tracing Sheets',
        category: 'अंग्रेजी',
        type: 'template',
        description: 'छोटे और बड़े अक्षरों (Aa to Zz) का 4-लाइन कॉपीबुक ट्रेसिंग अभ्यास एवं 100 बुनियादी शब्द।',
        fileSize: '15.4 MB',
        actionLabel: 'ट्रेसिंग शीट देखें'
      },
      {
        id: 'bv-04',
        title: 'खेल-खेल में गणित: 1 से 100 गिनती व 2 से 20 पहाड़ा चार्ट',
        category: 'गणित',
        type: 'tool',
        description: 'सचित्र जोड़, घटाव, और पहाड़ा सारणी चार्ट जिसे घर में प्रिंट करके दीवार पर लगाया जा सकता है।',
        fileSize: '12.1 MB',
        actionLabel: 'मैथ चार्ट डाउनलोड'
      },
      {
        id: 'bv-05',
        title: 'आधिकारिक सिस्टम वेरिफिकेशन पास (Digital Pass Verification)',
        category: 'प्रमाणपत्र',
        type: 'guide',
        description: 'IOIS नेटवर्क में ₹10 योजना का आधिकारिक डिजिटल एक्टिवेशन पास और कम्युनिटी एक्सेस टोकन।',
        fileSize: '2.5 MB',
        actionLabel: 'पास सत्यापित करें'
      }
    ],
    workTasks: [
      {
        id: 'task-bv-1',
        title: 'टास्क 1: स्थानीय 5 स्कूली बच्चों या अभिभावकों को स्टडी नोट्स शेयर करें',
        instruction: 'अपने मोहल्ले या WhatsApp ग्रुप में Class 1-5 नोट्स शेयर करें। प्रति एक्टिवेशन ₹7 (70%) तुरंत पेआउट प्राप्त करें।',
        incentiveBonus: '₹35 संभावित आय',
        status: 'pending'
      },
      {
        id: 'task-bv-2',
        title: 'टास्क 2: स्थानीय ट्यूशन शिक्षकों को प्राथमिक अभ्यास किट दिखाएं',
        instruction: 'ट्यूशन शिक्षकों को वर्कशीट्स दिखाएं और उन्हें IOIS डिजिटल नेटवर्क से जोड़ें।',
        incentiveBonus: '₹70 संभावित आय (10 छात्र)',
        status: 'pending'
      },
      {
        id: 'task-bv-3',
        title: 'टास्क 3: अपना डिजिटल ID कार्ड WhatsApp स्टेटस पर लगाएं',
        instruction: 'अपना IOIS स्मार्ट ID कार्ड डाउनलोड करके स्टेटस पर शेयर करें ताकि नए साथी आपके रेफरल से जुड़ सकें।',
        status: 'pending'
      }
    ],
    communityNotice: '📢 बाल विकास कम्युनिटी हेल्पडेस्क: किसी भी अध्ययन सामग्री या पेआउट सहायता हेतु आधिकारिक हेल्पलाइन +91 8877490845 पर संपर्क करें।'
  },

  'plan-02': {
    planId: 'plan-02',
    planNumber: 2,
    planName: 'Youth Skill Access',
    headerTagline: 'प्रोफेशनल बायोडाटा, आधुनिक AI प्रॉम्ट्स और साक्षात्कार तैयारी',
    overviewHindi: 'युवा कौशल विकास योजना कॉलेज छात्रों, जॉब सीकर्स और फ्रेशर्स के लिए बनाई गई है। इसमें कॉर्पोरेट स्टैंडर्ड ATS-फ्रेंडली रिज्यूम टेम्प्लेट्स, 200+ AI प्रॉम्ट्स और जॉब लेटर ड्राफ्ट्स शामिल हैं।',
    primaryResources: [
      {
        id: 'ys-01',
        title: 'ATS-Friendly Pro Resume & CV Templates (Word & Canva)',
        category: 'जॉब टूल्स',
        type: 'template',
        description: 'मल्टीनेशनल कंपनियों और सरकारी फॉर्म्स में शॉर्टलिस्ट होने वाले 12 आधुनिक एडिटेबल रिज्यूम प्रारूप।',
        fileSize: '24.8 MB',
        actionLabel: 'टेम्प्लेट्स डाउनलोड'
      },
      {
        id: 'ys-02',
        title: '200+ Curated AI Prompt Engineering Master Guide',
        category: 'AI स्किल्स',
        type: 'guide',
        description: 'ChatGPT, Gemini और Claude से कोडिंग, असाइनमेंट, ईमेल ड्राफ्टिंग और कंटेंट लिखवाने के सिद्ध प्रॉम्ट्स।',
        fileSize: '14.2 MB',
        actionLabel: 'प्रॉम्ट्स ई-बुक खोलें'
      },
      {
        id: 'ys-03',
        title: 'Job Application Letter & Professional Email Formats',
        category: 'करियर',
        type: 'template',
        description: 'विभिन्न पदों (IT, सेल्स, टीचिंग, ऑफिस एडमिन) के लिए रेडी-टू-सेंड ईमेल और कवर लेटर टेम्प्लेट्स।',
        fileSize: '8.6 MB',
        actionLabel: 'फॉर्मेट्स कॉपी करें'
      },
      {
        id: 'ys-04',
        title: 'Interview Preparation Checklist & Top 50 HR Questions',
        category: 'इंटरव्यू',
        type: 'guide',
        description: 'साक्षात्कार में बार-बार पूछे जाने वाले 50 महत्वपूर्ण प्रश्नों के आदर्श हिंदी व अंग्रेजी उत्तर।',
        fileSize: '11.3 MB',
        actionLabel: 'गाइड पढ़ें'
      }
    ],
    workTasks: [
      {
        id: 'task-ys-1',
        title: 'टास्क 1: अपना खुद का ATS-फ्रेंडली रिज्यूम तैयार करें',
        instruction: 'दिए गए टेम्प्लेट में अपनी जानकारी भरें और एक उच्च-गुणवत्ता वाला PDF बायोडाटा तैयार करें।',
        status: 'pending'
      },
      {
        id: 'task-ys-2',
        title: 'टास्क 2: अपने 5 कॉलेज सहपाठियों को प्रोफेशनल CV किट प्रदान करें',
        instruction: 'साथियों को स्किल अपग्रेड कराएं और प्रति रेफरल ₹34 (70%) का सीधा इंसेंटिव बैंक में पाएं।',
        incentiveBonus: '₹170 संभावित आय',
        status: 'pending'
      },
      {
        id: 'task-ys-3',
        title: 'टास्क 3: AI प्रॉम्ट्स का उपयोग करके एक पेशेवर कवर लेटर ड्राफ्ट करें',
        instruction: 'ChatGPT या Gemini में प्रॉम्ट डालकर अपनी लक्षित नौकरी के लिए परफेक्ट एप्लीकेशन तैयार करें।',
        status: 'pending'
      }
    ],
    communityNotice: '📢 यूथ स्किल नेटवर्क: हर सप्ताह नए AI प्रॉम्ट्स और करियर अवसर इस डैशबोर्ड में स्वतः अपडेट होते हैं।'
  },

  'plan-03': {
    planId: 'plan-03',
    planNumber: 3,
    planName: 'Career & Job Access',
    headerTagline: 'कक्षा 6-12 संपूर्ण अध्ययन किट, करियर रोडमैप व सॉफ्ट स्किल्स',
    overviewHindi: 'करियर एवं जॉब एक्सेस योजना माध्यमिक और उच्चतर माध्यमिक (6th से 12th) के विद्यार्थियों, अभिभावकों और ट्यूटर्स के लिए एक संपूर्ण शैक्षणिक संकलन है।',
    primaryResources: [
      {
        id: 'cj-01',
        title: 'Class 6-12 Complete NCERT Books & Chapter Solutions',
        category: 'अकादमिक',
        type: 'pdf',
        description: 'कक्षा 6 से 12 तक विज्ञान, गणित, सामाजिक विज्ञान और वाणिज्य के सभी विषयों के विस्तृत नोट्स।',
        fileSize: '95.6 MB',
        actionLabel: 'नोट्स लाइब्रेरी खोलें'
      },
      {
        id: 'cj-02',
        title: '10वीं व 12वीं के बाद सम्पूर्ण करियर रोडमैप गाइड',
        category: 'काउंसलिंग',
        type: 'guide',
        description: 'Science (PCM/PCB), Commerce, Arts, ITI, Polytechnic और Defense के वैज्ञानिक करियर विकल्प।',
        fileSize: '22.4 MB',
        actionLabel: 'रोडमैप गाइड देखें'
      },
      {
        id: 'cj-03',
        title: 'Soft Skills & Hindi-English Communication Modules',
        category: 'कम्युनिकेशन',
        type: 'guide',
        description: 'आत्मविश्वास से बात करने, ग्रुप डिस्कशन और पब्लिक स्पीकिंग के व्यावहारिक ऑडियो-टेक्स्ट मॉड्यूल्स।',
        fileSize: '18.1 MB',
        actionLabel: 'मॉड्यूल प्रारंभ करें'
      },
      {
        id: 'cj-04',
        title: 'Board Exam Preparation Strategy & Mind Maps',
        category: 'परीक्षा रणनीति',
        type: 'template',
        description: 'बोर्ड परीक्षा में 90%+ अंक लाने के लिए रिविजन माइंड मैप्स और टाइम-टेबल टेम्प्लेट्स।',
        fileSize: '16.7 MB',
        actionLabel: 'माइंड मैप्स डाउनलोड'
      }
    ],
    workTasks: [
      {
        id: 'task-cj-1',
        title: 'टास्क 1: अपनी कक्षा के लिए उपयुक्त स्टडी नोट्स डाउनलोड व अध्ययन करें',
        instruction: 'अपने संबंधित विषय के महत्वपूर्ण अध्याय नोट्स को डाउनलोड कर रिविजन शुरू करें।',
        status: 'pending'
      },
      {
        id: 'task-cj-2',
        title: 'टास्क 2: ट्यूशन या स्कूल के 10 साथियों को नोट्स व करियर गाइड उपलब्ध कराएं',
        instruction: 'साथियों को स्टडी पैकेज शेयर करें और प्रति सदस्य ₹64 (65%) का निश्चित लाभ अपने खाते में पाएं।',
        incentiveBonus: '₹640 संभावित आय',
        status: 'pending'
      },
      {
        id: 'task-cj-3',
        title: 'टास्क 3: करियर रोडमैप का अध्ययन कर अपने भविष्य के 3 मुख्य लक्ष्य तय करें',
        instruction: 'रोडमैप गाइड के आधार पर उच्च शिक्षा या प्रतियोगी परीक्षा का लक्ष्य निर्धारित करें।',
        status: 'pending'
      }
    ],
    communityNotice: '📢 करियर हेल्पडेस्क: बोर्ड परीक्षाओं के मॉडल पेपर परीक्षा से 30 दिन पूर्व उपलब्ध करा दिए जाएंगे।'
  },

  'plan-04': {
    planId: 'plan-04',
    planNumber: 4,
    planName: 'Family VIP Access',
    headerTagline: 'स्मार्ट पेरेंटिंग, पारिवारिक स्वास्थ्य एवं साइबर फ्रॉड सुरक्षा हब',
    overviewHindi: 'फैमिली वीआईपी एक्सेस योजना जागरूक अभिभावकों, गृहणियों और समाज कल्याण कार्यकर्ताओं के लिए बनाई गई है ताकि परिवार को डिजिटल व वित्तीय रूप से सुरक्षित रखा जा सके।',
    primaryResources: [
      {
        id: 'fv-01',
        title: 'Parents Digital Parenting & Screen Control Kit',
        category: 'पेरेंटिंग',
        type: 'guide',
        description: 'बच्चों को मोबाइल और गेमिंग की लत से बचाने के तरीके, स्क्रीन टाइम लॉक सेटिंग्स और सकारात्मक आदतें।',
        fileSize: '16.8 MB',
        actionLabel: 'पेरेंटिंग किट खोलें'
      },
      {
        id: 'fv-02',
        title: 'Family Health, Yoga & Daily Routine Guides',
        category: 'स्वास्थ्य',
        type: 'guide',
        description: 'बीपी, शुगर, वजन नियंत्रण, घरेलू आयुर्वेदिक नुस्खे और पूरे परिवार के लिए दैनिक योग आसन चार्ट।',
        fileSize: '21.5 MB',
        actionLabel: 'हेल्थ गाइड देखें'
      },
      {
        id: 'fv-03',
        title: 'Cyber Safety & Financial Fraud Prevention Tool',
        category: 'सुरक्षा',
        type: 'tool',
        description: 'UPI फ्रॉड, फर्जी कॉल, फिशिंग लिंक और ऑनलाइन ठगी से बैंक खाते सुरक्षित रखने की 100% सुरक्षा हैंडबुक।',
        fileSize: '14.0 MB',
        actionLabel: 'सुरक्षा टूलकिट खोलें'
      },
      {
        id: 'fv-04',
        title: 'Emergency Helpline Directory & Medical First-Aid Guide',
        category: 'इमरजेंसी',
        type: 'template',
        description: 'राष्ट्रीय हेल्पलाइन नंबर्स, प्राथमिक चिकित्सा (CPR, जलना, चोट) और आवश्यक दवाओं की चेकलिस्ट।',
        fileSize: '9.2 MB',
        actionLabel: 'डायरेक्टरी डाउनलोड'
      }
    ],
    workTasks: [
      {
        id: 'task-fv-1',
        title: 'टास्क 1: अपने घरेलू उपकरणों में पेरेंटल कंट्रोल और पिन सुरक्षा सक्रिय करें',
        instruction: 'गाइड के अनुसार बच्चों के फोन पर स्क्रीन टाइम सीमा और सेफ सर्च ऑन करें।',
        status: 'pending'
      },
      {
        id: 'task-fv-2',
        title: 'टास्क 2: सोसाइटी या आस-पड़ोस के 5 परिवारों को डिजिटल फ्रॉड से जागरूक करें',
        instruction: 'परिवारों को साइबर सुरक्षा किट से अवगत कराएं और प्रति फैमिली ₹119 (60%) का इंसेंटिव पाएं।',
        incentiveBonus: '₹595 संभावित आय',
        status: 'pending'
      },
      {
        id: 'task-fv-3',
        title: 'टास्क 3: बुजुर्गों के फोन पर आपातकालीन संपर्क व फ्रॉड ब्लॉकर सेट करें',
        instruction: 'अभिभावकों के फोन पर 1930 साइबर हेल्पलाइन और आवश्यक सुरक्षा सेटिंग्स लागू करें।',
        status: 'pending'
      }
    ],
    communityNotice: '📢 परिवार कल्याण सूचना: किसी भी ऑनलाइन फ्रॉड की स्थिति में तुरंत राष्ट्रीय हेल्पलाइन 1930 पर रिपोर्ट करें।'
  },

  'plan-05': {
    planId: 'plan-05',
    planNumber: 5,
    planName: 'Student Elite Access',
    headerTagline: 'SSC, रेलवे, बैंकिंग व पुलिस परीक्षाओं की प्रीमियम टॉपर्स तैयारी',
    overviewHindi: 'स्टूडेंट एलीट एक्सेस योजना प्रतियोगी परीक्षाओं की तैयारी कर रहे गंभीर अभ्यर्थियों के लिए समर्पित है। इसमें टॉपर्स नोट्स, करंट अफेयर्स, और पिछले 10 वर्षों के हल प्रश्न-पत्र शामिल हैं।',
    primaryResources: [
      {
        id: 'se-01',
        title: 'SSC, Railway, Banking & Police Toppers Comprehensive Notes',
        category: 'प्रतियोगी परीक्षा',
        type: 'pdf',
        description: 'सामान्य अध्ययन (GS), इतिहास, भूगोल, राजव्यवस्था, विज्ञान, तर्कशक्ति (Reasoning) व गणित के टॉपर्स नोट्स।',
        fileSize: '120.4 MB',
        actionLabel: 'टॉपर्स नोट्स डाउनलोड'
      },
      {
        id: 'se-02',
        title: 'Daily Current Affairs & Static GK Compendium (2025-2026)',
        category: 'करंट अफेयर्स',
        type: 'guide',
        description: 'परीक्षा-उपयोगी दैनिक करंट अफेयर्स कैप्सूल, मासिक ई-बुक और महत्वपूर्ण स्टैटिक GK ट्रिक्स।',
        fileSize: '32.1 MB',
        actionLabel: 'GK संग्रह खोलें'
      },
      {
        id: 'se-03',
        title: 'Previous 10 Years Solved Papers & Speed Math Formulas',
        category: 'सॉल्वड पेपर्स',
        type: 'template',
        description: 'विगत वर्षों के प्रश्नपत्रों के चरणबद्ध हल, समय प्रबंधन रणनीति और शॉर्टकट गणितीय फॉर्मूले।',
        fileSize: '45.7 MB',
        actionLabel: 'पेपर्स डाउनलोड'
      },
      {
        id: 'se-04',
        title: 'Elite Telegram Study Circle & Doubt Clearing Portal',
        category: 'कम्युनिटी',
        type: 'tool',
        description: 'समान लक्ष्य वाले गंभीर प्रतियोगियों के साथ डिस्कशन और मेंटर्स द्वारा प्रश्नों के त्वरित समाधान का लिंक।',
        fileSize: '1.2 MB',
        actionLabel: 'स्टडी ग्रुप में जुड़ें'
      }
    ],
    workTasks: [
      {
        id: 'task-se-1',
        title: 'टास्क 1: दैनिक 30 प्रश्नों का स्पीड टेस्ट हल करें और समय नोट करें',
        instruction: 'शॉर्टकट फॉर्मूला शीट का उपयोग कर गणित और रीजनिंग के प्रश्नों को न्यूनतम समय में हल करें।',
        status: 'pending'
      },
      {
        id: 'task-se-2',
        title: 'टास्क 2: अपने स्टडी सर्कल/लाइब्रेरी के 10 साथियों को नोट्स दिलाएं',
        instruction: 'अपने साथियों को उच्च कोटि सामग्री उपलब्ध कराएं और प्रति सदस्य ₹179 (60%) का सीधा लाभ पाएं।',
        incentiveBonus: '₹1,790 संभावित आय',
        status: 'pending'
      },
      {
        id: 'task-se-3',
        title: 'टास्क 3: मासिक करंट अफेयर्स का एक संक्षिप्त रिविजन नोट्स बनाएं',
        instruction: 'महत्वपूर्ण राष्ट्रीय व अंतर्राष्ट्रीय नियुक्तियों और पुरस्कारों की एक सूची तैयार करें।',
        status: 'pending'
      }
    ],
    communityNotice: '📢 एलीट स्टूडेंट नोटिस: टेलीग्राम ग्रुप में हर रविवार को लाइव मॉक टेस्ट आयोजित किया जाता है।'
  },

  'plan-06': {
    planId: 'plan-06',
    planNumber: 6,
    planName: 'Agency Reseller Hub',
    headerTagline: 'डिजिटल रीसेलिंग, ऑटोमेशन टूल्स और माइक्रो-एजेंसी बिजनेस किट',
    overviewHindi: 'एजेंसी रीसेलर हब डिजिटल क्रिएटर्स, साइबर कैफे संचालकों और फ्रीलांसर्स के लिए तैयार किया गया है। इसमें व्हाट्सएप ऑटोमेशन, लैंडिंग पेज और रीसेलिंग लाइसेंस शामिल हैं।',
    primaryResources: [
      {
        id: 'ar-01',
        title: 'Digital Reselling Commercial License & Master Branding Kit',
        category: 'लाइसेंस',
        type: 'guide',
        description: 'IOIS उत्पादों को अपने नाम और ब्रांड के साथ रीसेल करने का पूर्ण कमर्शियल अधिकार व पोस्टर्स।',
        fileSize: '35.4 MB',
        actionLabel: 'लाइसेंस किट डाउनलोड'
      },
      {
        id: 'ar-02',
        title: 'WhatsApp Automation Scripts & Chatbot Funnels',
        category: 'ऑटोमेशन',
        type: 'tool',
        description: 'ग्राहकों को ऑटोमेटिक रिप्लाई भेजने, लीड्स जनरेट करने और ब्रॉडकास्ट करने के प्रमाणित संदेश प्रारूप।',
        fileSize: '18.2 MB',
        actionLabel: 'स्क्रिप्ट्स कॉपी करें'
      },
      {
        id: 'ar-03',
        title: 'High-Converting Landing Page Frameworks & Ad Creatives',
        category: 'मार्केटिंग',
        type: 'template',
        description: 'फेसबुक, इंस्टाग्राम और यूट्यूब पर प्रचार करने के लिए उच्च रिस्पॉन्स वाले बैनर और टेम्पलेट्स।',
        fileSize: '42.9 MB',
        actionLabel: 'क्रिएटिव्स बंडल खोलें'
      },
      {
        id: 'ar-04',
        title: 'Weekly Marketing Strategy Webinar Vault & Video Guides',
        category: 'ट्रेनिंग',
        type: 'video',
        description: 'डिजिटल उत्पाद बेचने, क्लाइंट हैंडलिंग और प्रति दिन ₹2,000+ कमाने के व्यावहारिक वीडियो लेसन्स।',
        fileSize: '65.0 MB',
        actionLabel: 'ट्रेनिंग वीडियोज देखें'
      }
    ],
    workTasks: [
      {
        id: 'task-ar-1',
        title: 'टास्क 1: अपना WhatsApp Business ऑटो-रेस्पॉन्डर सक्रिय करें',
        instruction: 'प्रदान की गई स्क्रिप्ट को अपने ऑटो-मैसेज में जोड़ें ताकि इंक्वायरी आने पर तुरंत उत्तर जा सके।',
        status: 'pending'
      },
      {
        id: 'task-ar-2',
        title: 'टास्क 2: स्थानीय 20 साइबर कैफे या फ्रीलांसर्स को रीसेलर पैकेज दें',
        instruction: 'डिजिटल प्रोडक्ट्स की रीसेलिंग करें और प्रति सदस्य ₹274 (55%) का सीधा एजेंसी मुनाफा कमाएं।',
        incentiveBonus: '₹5,480 संभावित मुनाफा',
        status: 'pending'
      },
      {
        id: 'task-ar-3',
        title: 'टास्क 3: सोशल मीडिया पर अपना पहला ब्रांडेड पोस्टर शेयर करें',
        instruction: 'क्रिएटिव्स बंडल से एक पोस्टर कस्टमाइज करें और व्हाट्सएप स्टेटस/फेसबुक पर शेयर करें।',
        status: 'pending'
      }
    ],
    communityNotice: '📢 एजेंसी पार्टनर अलर्ट: नए विज्ञापन क्रिएटिव्स हर माह की पहली तारीख को अपडेट किए जाते हैं।'
  },

  'plan-07': {
    planId: 'plan-07',
    planNumber: 7,
    planName: 'Lifetime Master Access',
    headerTagline: 'IOIS का सर्वोच्च ऑल-इन-वन लाइफटाइम मास्टर साम्राज्य (Plan 01 से 06 सब अनलॉक)',
    overviewHindi: 'लाइफटाइम मास्टर एक्सेस IOIS का सर्वोच्च और सबसे संपूर्ण प्लान है। इसमें पिछले सभी 6 प्लान्स का 100% अनलॉक्ड एक्सेस, आजीवन मुफ्त अपडेट्स, वीआईपी डायरेक्ट एडमिन मेंटरशिप और सबसे बड़ा ₹499 का तत्काल पेआउट मिलता है।',
    primaryResources: [
      {
        id: 'ma-01',
        title: '✓ ALL 6 LOWER PLANS COMPLETE UNLOCKED ACCESS BUNDLE',
        category: 'सुप्रीम बंडल',
        type: 'guide',
        description: 'Plan 01 से Plan 06 तक की सभी सामग्री (NCERT, AI प्रॉम्ट्स, क्लास 6-12, फैमिली किट, प्रतियोगी परीक्षा, एजेंसी) एक ही स्थान पर पूर्णतः अनलॉक्ड!',
        fileSize: '350.0 MB',
        actionLabel: 'सम्पूर्ण मास्टर वॉल्ट खोलें'
      },
      {
        id: 'ma-02',
        title: 'Lifetime Free Access to Future Courses & AI Tool Upgrades',
        category: 'आजीवन लाभ',
        type: 'tool',
        description: 'भविष्य में IOIS पोर्टल पर आने वाले सभी नए डिजिटल कोर्सेज, टूल्स और फाइल्स का आजीवन बिना किसी शुल्क के एक्सेस।',
        fileSize: 'आजीवन',
        actionLabel: 'आजीवन पास एक्टिव'
      },
      {
        id: 'ma-03',
        title: 'VIP Direct Admin Mentorship & Master Leader Group Channel',
        category: 'मेंटरशिप',
        type: 'tool',
        description: 'IOIS के संस्थापक और मुख्य तकनीकी दल के साथ प्राइवेट टेलीग्राम और कॉल मीटिंग्स में सीधा मार्गदर्शन लिंक।',
        fileSize: 'VIP Access',
        actionLabel: 'प्राइवेट वीआईपी ग्रुप लिंक'
      },
      {
        id: 'ma-04',
        title: 'Highest Tier ₹499 Instant Payout Protocol & Machine Setup',
        category: 'सर्वोच्च आय',
        type: 'template',
        description: 'प्लेटफॉर्म का सबसे बड़ा सीधा पेआउट—मात्र 10 रेफरल पर ₹4,990 और 20 रेफरल पर ₹9,980 की तत्काल आमदनी का पूर्ण ब्लूप्रिंट।',
        fileSize: '15.5 MB',
        actionLabel: 'पेआउट मशीन प्रोटोकॉल'
      },
      {
        id: 'ma-05',
        title: 'Verified IOIS Master Golden Smart ID Card with Priority Seal',
        category: 'गोल्डन कार्ड',
        type: 'guide',
        description: 'रॉयल गोल्ड बॉर्डर्स, वीआईपी मोहर और प्राथमिकता सत्यापन युक्त सर्वोच्च मास्टर आईडी पास।',
        fileSize: '3.8 MB',
        actionLabel: 'गोल्डन कार्ड डाउनलोड'
      }
    ],
    workTasks: [
      {
        id: 'task-ma-1',
        title: 'टास्क 1: वीआईपी मास्टर लीडर टेलीग्राम चैनल में शामिल हों',
        instruction: 'डायरेक्ट एडमिन चैनल से जुड़ें और अपनी डिजिटल स्वावलंबन टीम का गठन शुरू करें।',
        status: 'pending'
      },
      {
        id: 'task-ma-2',
        title: 'टास्क 2: अपने नेटवर्क में 20 विजनरी साथियों को मास्टर प्लान से जोड़ें',
        instruction: 'संजय वर्मा मॉडल लागू करें: 20 साथियों को जोड़कर ₹9,980 का त्वरित पेआउट सीधा बैंक खाते में पाएं।',
        incentiveBonus: '₹9,980 सीधा बैंक ट्रांसफर',
        status: 'pending'
      },
      {
        id: 'task-ma-3',
        title: 'टास्क 3: अपनी टीम के सदस्यों को निचले प्लान्स के लिए गाइड करें',
        instruction: 'मास्टर रीसेलर राइट्स का उपयोग कर अपने पूरे नेटवर्क को ऑटोमेशन पर रन कराएं।',
        status: 'pending'
      }
    ],
    communityNotice: '👑 सुप्रीम मास्टर काउंसिल: आप सीधे कोर एडमिन पैनल के वीआईपी ग्रुप से जुड़े हैं। किसी भी विशेष समस्या या बड़े पेआउट पर एडमिन से सीधा संपर्क उपलब्ध है।'
  }
};
