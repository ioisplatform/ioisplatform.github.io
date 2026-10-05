import { PlanDetail, IOISService } from '../types';

export const ioisMasterPlans: PlanDetail[] = [
  {
    id: 'plan-01',
    planNumber: 1,
    name: 'Bal Vikas Access',
    subtitle: 'Verification Pass & Basic Learning',
    tagline: 'डिजिटल शुरुआत मात्र ₹10 में',
    category: 'starter',
    price: 10,
    incentive: 7,
    payoutPercent: 70,
    badge: '70% PAYOUT',
    colorScheme: {
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-600',
      badgeText: 'text-white',
      accent: 'text-emerald-700',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    features: [
      'Class 1-5 NCERT Digital PDFs (हिंदी व अंग्रेजी माध्यम)',
      'Interactive Worksheets & Activity Sheets',
      'Official System Verification Pass & Digital Membership ID',
      'Instant Payout ₹7 directly on each referral (70%)',
      'Access to IOIS Basic Student Community'
    ],
    kyaMilega: [
      {
        title: 'Class 1-5 NCERT डिजिटल पाठ्यपुस्तकें',
        description: 'कक्षा 1 से 5 तक के बच्चों के लिए सभी विषयों की स्पष्ट डिजिटल PDF किताबें एवं अभ्यास पत्र।',
        icon: 'BookOpen'
      },
      {
        title: 'इंटरैक्टिव वर्कशीट और एक्टिविटी शीट्स',
        description: 'गणित, भाषा, ड्राइंग और सामान्य ज्ञान के लिए प्रिंट करने योग्य और मोबाइल फ्रेंडली वर्कशीट्स।',
        icon: 'FileText'
      },
      {
        title: 'आधिकारिक सिस्टम वेरिफिकेशन पास',
        description: 'IOIS नेटवर्क में ऑथेंटिकेटेड सदस्य के रूप में एक्टिवेशन पास और शेयर करने योग्य लिंक।',
        icon: 'BadgeCheck'
      }
    ],
    kiseJaruratHai: [
      {
        target: 'प्राथमिक कक्षा (Class 1-5) के विद्यार्थी व माता-पिता',
        why: 'जिन्हें घर पर बच्चों को बेहतर पढ़ाई सामग्री और डिजिटल अभ्यास कराना है।'
      },
      {
        target: 'शुरुआती युवा व ट्यूशन शिक्षक',
        why: 'जो बिना किसी जोखिम मात्र ₹10 से ऑनलाइन सिस्टम सीखकर रोजाना ₹100-₹500 की पॉकेट मनी कमाना चाहते हैं।'
      }
    ],
    successStory: {
      title: 'अमित की शुरुआत',
      person: 'अमित कुमार (कक्षा 12 छात्र, मुजफ्फरपुर)',
      story: 'अमित ने सिर्फ ₹10 से शुरुआत की। उसने अपने मोहल्ले के 100 स्कूली बच्चों को डिजिटल नोट्स शेयर किए और ₹700 तुरंत कमाए। आज वह अपने छोटे खर्चे खुद उठा रहा है।',
      earnings: '₹700 तुरंत इंसेंटिव (100 रेफरल)'
    }
  },
  {
    id: 'plan-02',
    planNumber: 2,
    name: 'Youth Skill Access',
    subtitle: 'Job Tools & AI Prompts',
    tagline: 'युवाओं के लिए जॉब और आधुनिक AI स्किल्स',
    category: 'starter',
    price: 49,
    incentive: 34,
    payoutPercent: 70,
    badge: '70% PAYOUT',
    colorScheme: {
      bg: 'bg-blue-50/60',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-600',
      badgeText: 'text-white',
      accent: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    features: [
      'Pro Resume / CV Templates (ATS Friendly Word & Canva)',
      'Curated AI Prompt Engineering Guide (ChatGPT & Gemini)',
      'Job Application Letter Formats & Email Etiquette',
      'Instant Payout ₹34 directly on each referral (70%)',
      'Interview Preparation Checklist & Top 50 Questions'
    ],
    kyaMilega: [
      {
        title: 'प्रोफेशनल ATS-फ्रेंडली रिज्यूम टेम्प्लेट्स',
        description: 'कंपनियों और सरकारी फॉर्म्स में शॉर्टलिस्ट होने वाले आधुनिक CV/Resume के एडिटेबल फॉर्मेट्स।',
        icon: 'FileCheck'
      },
      {
        title: 'AI प्रॉम्प्ट इंजीनियरिंग मास्टर गाइड',
        description: 'ChatGPT, Gemini और Claude से असाइनमेंट, कोडिंग व कंटेंट लिखवाने के 200+ सिद्ध प्रॉम्प्ट्स।',
        icon: 'Sparkles'
      },
      {
        title: 'जॉब एप्लीकेशन व कवर लेटर ड्राफ्ट्स',
        description: 'अलग-अलग इंडस्ट्रीज (IT, सेल्स, टीचिंग, ऑफिस) के लिए रेडी-टू-सेंड ईमेल और लेटर टेम्प्लेट्स।',
        icon: 'Mail'
      }
    ],
    kiseJaruratHai: [
      {
        target: 'कॉलेज छात्र, फ्रेशर्स और नौकरी तलाश रहे युवा',
        why: 'जिन्हें कॉर्पोरेट स्टैंडर्ड रिज्यूम और एआई टूल्स की मदद से तेजी से जॉब हासिल करनी है।'
      },
      {
        target: 'डिजिटल फ्रीलांसर्स व सोशल मीडिया एक्टिविस्ट',
        why: 'जिन्हें अपने दोस्तों को स्किल अपग्रेड कराने पर प्रति व्यक्ति ₹34 का 70% इंसेंटिव चाहिए।'
      }
    ],
    successStory: {
      title: 'प्रिया का स्किल नेटवर्क',
      person: 'प्रिया सिंह (BCA स्टूडेंट, भोपाल)',
      story: 'प्रिया ने अपने 10 सहपाठियों को प्रोफेशनल CV बनाने में मदद की। उसने उसी दिन ₹340 तुरंत कमाए और अपनी पहली डिजिटल टीम तैयार की।',
      earnings: '₹340 एक ही दिन में (10 रेफरल)'
    }
  },
  {
    id: 'plan-03',
    planNumber: 3,
    name: 'Career & Job Access',
    subtitle: 'Academic Mastery & Career Guide',
    tagline: 'माध्यमिक शिक्षा और संपूर्ण करियर काउंसलिंग',
    category: 'career',
    price: 99,
    incentive: 64,
    payoutPercent: 65,
    badge: '65% PAYOUT',
    colorScheme: {
      bg: 'bg-indigo-50/60',
      border: 'border-indigo-200',
      badgeBg: 'bg-indigo-600',
      badgeText: 'text-white',
      accent: 'text-indigo-700',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    },
    features: [
      'Class 6-12 Complete Digital Books & Solutions',
      'Career Roadmap & Stream Selection Guide (Arts, Commerce, Science)',
      'Soft Skills & Communication Modules in Hindi',
      'Instant Payout ₹64 directly on each referral (65%)',
      'Board Exam Preparation Strategy & Mind Maps'
    ],
    kyaMilega: [
      {
        title: 'कक्षा 6 से 12 की संपूर्ण डिजिटल पुस्तकें व हल',
        description: 'गणित, विज्ञान, सामाजिक विज्ञान और अंग्रेजी के सभी अध्यायों के चरणबद्ध हल और नोट्स।',
        icon: 'GraduationCap'
      },
      {
        title: 'करियर रोडमैप और स्ट्रीम चयन गाइड',
        description: '10वीं और 12वीं के बाद सही विषय, डिप्लोमा, प्रवेश परीक्षा और कॉलेज चुनने का वैज्ञानिक मार्गदर्शन।',
        icon: 'Compass'
      },
      {
        title: 'सॉफ्ट स्किल्स और इंग्लिश कम्युनिकेशन कोर्स',
        description: 'इंटरव्यू, ग्रुप डिस्कशन और पब्लिक स्पीकिंग के लिए व्यावहारिक ऑडियो-वीडियो मॉड्यूल्स।',
        icon: 'MessageSquare'
      }
    ],
    kiseJaruratHai: [
      {
        target: 'हाई स्कूल एवं इंटरमीडिएट (6th-12th) के छात्र',
        why: 'जिन्हें महंगी कोचिंग के बिना घर पर उच्च गुणवत्ता वाली पढ़ाई सामग्री और मार्गदर्शन चाहिए।'
      },
      {
        target: 'होम ट्यूटर्स और कोचिंग संचालक',
        why: 'जो अपने विद्यार्थियों को समृद्ध नोट्स देकर साथ ही हर शेयरिंग पर ₹64 का निश्चित लाभ कमाना चाहते हैं।'
      }
    ],
    successStory: {
      title: 'राहुल का करियर काउंसिलिंग मॉडल',
      person: 'राहुल मिश्रा (ट्यूशन टीचर, गोरखपुर)',
      story: 'राहुल ने 20 ट्यूशन छात्रों को स्टडी मटेरियल और करियर काउंसिलिंग दी। ₹1280 का मुनाफा सीधे उसके बैंक खाते में तुरंत आया।',
      earnings: '₹1,280 सीधा बैंक ट्रांसफर (20 छात्र)'
    }
  },
  {
    id: 'plan-04',
    planNumber: 4,
    name: 'Family VIP Access',
    subtitle: 'Safety, Health & Parents Hub',
    tagline: 'पारिवारिक स्वास्थ्य, साइबर सुरक्षा व स्मार्ट पेरेंटिंग',
    category: 'career',
    price: 199,
    incentive: 119,
    payoutPercent: 60,
    badge: '60% PAYOUT',
    colorScheme: {
      bg: 'bg-rose-50/60',
      border: 'border-rose-200',
      badgeBg: 'bg-rose-600',
      badgeText: 'text-white',
      accent: 'text-rose-700',
      button: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    features: [
      'Parents Digital Parenting & Screen Control Kit',
      'Family Health, Yoga & Daily Routine Guides',
      'Cyber Safety & Financial Fraud Prevention Tool',
      'Instant Payout ₹119 directly on each referral (60%)',
      'Emergency Helpline Directory & Medical First-Aid Kit'
    ],
    kyaMilega: [
      {
        title: 'स्मार्ट पेरेंटिंग व स्क्रीन कंट्रोल किट',
        description: 'बच्चों को मोबाइल और गेमिंग की लत से बचाने के तरीके, स्क्रीन टाइम लॉक और पॉजिटिव हैबिट्स गाइड।',
        icon: 'Shield'
      },
      {
        title: 'फैमिली हेल्थ, योग और दिनचर्या चार्ट',
        description: 'बीपी, शुगर, वजन नियंत्रण, आयुर्वेदिक घरेलू नुस्खे और पूरे परिवार के लिए दैनिक योग आसन।',
        icon: 'Heart'
      },
      {
        title: 'साइबर सेफ्टी और वित्तीय धोखाधड़ी रोकथाम गाइड',
        description: 'UPI फ्रॉड, फर्जी कॉल, फिशिंग लिंक और ऑनलाइन ठगी से बैंक खाते सुरक्षित रखने की पूर्ण हैंडबुक।',
        icon: 'Lock'
      }
    ],
    kiseJaruratHai: [
      {
        target: 'जागरूक अभिभावक और गृहणियां',
        why: 'जो परिवार के स्वास्थ्य, बच्चों के भविष्य और आर्थिक सुरक्षा को सुरक्षित बनाना चाहते हैं।'
      },
      {
        target: 'सोसाइटी वेलफेयर सदस्य और सोशल वर्कर्स',
        why: 'जिन्हें आस-पड़ोस के परिवारों को जागरूक करते हुए ₹119 प्रति फैमिली का बड़ा इंसेंटिव प्राप्त करना है।'
      }
    ],
    successStory: {
      title: 'श्रीमती शर्मा की फैमिली अवेयरनेस',
      person: 'श्रीमती अनीता शर्मा (गृहणी व वेलफेयर लीडर, जयपुर)',
      story: 'श्रीमती शर्मा ने अपनी सोसाइटी के 5 परिवारों को डिजिटल सुरक्षा और पेरेंटिंग किट के बारे में बताया और ₹595 तुरंत इंसेंटिव कमाया।',
      earnings: '₹595 तुरंत इंसेंटिव (5 परिवार)'
    }
  },
  {
    id: 'plan-05',
    planNumber: 5,
    name: 'Student & Exam Access',
    subtitle: 'Competitive Exam Preparation',
    tagline: 'सरकारी नौकरी परीक्षाओं की अचूक तैयारी',
    category: 'career',
    price: 299,
    incentive: 179,
    payoutPercent: 60,
    badge: '60% PAYOUT',
    isPopular: true,
    colorScheme: {
      bg: 'bg-amber-50/60',
      border: 'border-amber-200',
      badgeBg: 'bg-amber-600',
      badgeText: 'text-white',
      accent: 'text-amber-700',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    features: [
      'Competitive Exam Notes (SSC, Railway, Banking, Police, State Exams)',
      'Daily Current Affairs & Static GK Compendium',
      'Elite Telegram Study Circle & Doubt Clearing Access',
      'Previous 10 Years Solved Papers & Speed Test Formulas',
      'Instant Payout ₹179 directly on each referral (60%)'
    ],
    kyaMilega: [
      {
        title: 'प्रतियोगी परीक्षा प्रीमियम नोट्स',
        description: 'SSC CGL/CHSL, रेलवे NTPC, बैंक PO/क्लर्क, यूपी/बिहार पुलिस कांस्टेबल के विषयवार टॉपर्स नोट्स।',
        icon: 'Award'
      },
      {
        title: 'दैनिक करंट अफेयर्स और स्टेटिक GK संग्रह',
        description: 'रोजाना के परीक्षा-उपयोगी करंट अफेयर्स कैप्सूल, मासिक ई-बुक और महत्वपूर्ण GK ट्रिक्स।',
        icon: 'Calendar'
      },
      {
        title: 'एलिट स्टडी ग्रुप व डाउट क्लीयरिंग कम्युनिटी',
        description: 'समान लक्ष्य वाले गंभीर प्रतियोगियों के साथ डिस्कशन और मेंटर्स द्वारा प्रश्नों के त्वरित समाधान।',
        icon: 'Users'
      }
    ],
    kiseJaruratHai: [
      {
        target: 'सरकारी नौकरी के गंभीर अभ्यर्थी (Aspirants)',
        why: 'जिन्हें बिना लाखों खर्च किए बेस्ट टॉपर्स नोट्स, पिछले वर्षों के हल और टेस्ट चाहिए।'
      },
      {
        target: 'लाइब्रेरी व स्टडी क्लब के विद्यार्थी',
        why: 'जो अपने स्टडी ग्रुप में साथियों को जोड़कर प्रति सदस्य ₹179 का इंसेंटिव पाकर अपनी पढ़ाई का खर्च खुद उठाते हैं।'
      }
    ],
    successStory: {
      title: 'विकास का स्टडी क्लब',
      person: 'विकास यादव (प्रतियोगी छात्र, प्रयागराज)',
      story: 'विकास ने अपने स्टडी ग्रुप के 10 साथियों को नोट्स दिलाए और ₹1,790 कमाए। अब वह अपनी कोचिंग फीस और किताबों का खर्च खुद निकालता है।',
      earnings: '₹1,790 सीधा बैंक लाभ (10 छात्र)'
    }
  },
  {
    id: 'plan-06',
    planNumber: 6,
    name: 'Agency Reseller Access',
    subtitle: 'Digital Business & Automation',
    tagline: 'डिजिटल एजेंसी, ऑटोमेशन और रीसेलिंग बिजनेस',
    category: 'master',
    price: 499,
    incentive: 274,
    payoutPercent: 55,
    badge: '55% PAYOUT',
    colorScheme: {
      bg: 'bg-purple-50/60',
      border: 'border-purple-200',
      badgeBg: 'bg-purple-600',
      badgeText: 'text-white',
      accent: 'text-purple-700',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
    features: [
      'Digital Reselling License & Master Branding Kit',
      'WhatsApp Automation Scripts & Message Templates',
      'High-Converting Landing Page Frameworks & Ad Creatives',
      'Instant Payout ₹274 directly on each referral (55%)',
      'Weekly Marketing Strategy Webinar Access'
    ],
    kyaMilega: [
      {
        title: 'डिजिटल रीसेलिंग लाइसेंस व ब्रांडिंग किट',
        description: 'IOIS उत्पादों को अपने नाम और ब्रांड के साथ रीसेल करने का पूर्ण कमर्शियल अधिकार और पोस्टर्स।',
        icon: 'Briefcase'
      },
      {
        title: 'व्हाट्सएप ऑटोमेशन स्क्रिप्ट्स व चैट बॉट फनल्स',
        description: 'ग्राहकों को ऑटोमेटिक रिप्लाई भेजने, लीड्स जनरेट करने और ब्रॉडकास्ट करने के प्रमाणित संदेश प्रारूप।',
        icon: 'Send'
      },
      {
        title: 'हाई-कन्वर्टिंग लैंडिंग पेज और सोशल मीडिया क्रिएटिव्स',
        description: 'फेसबुक, इंस्टाग्राम और यूट्यूब पर प्रचार करने के लिए उच्च रिस्पॉन्स वाले बैनर और टेम्पलेट्स।',
        icon: 'Layout'
      }
    ],
    kiseJaruratHai: [
      {
        target: 'डिजिटल क्रिएटर्स, साइबर कैफे संचालक और रीसेलर्स',
        why: 'जो घर बैठे या अपनी दुकान से एक पूर्ण ऑटोमेटेड डिजिटल उत्पाद एजेंसी चलाना चाहते हैं।'
      },
      {
        target: 'बिजनेस लीडर्स व मार्केटिंग प्रोफेशनल्स',
        why: 'जिन्हें प्रति रीसेल ₹274 का मोटा इंसेंटिव और अपनी टीम को ऑटोमेशन टूल्स से लैस करना है।'
      }
    ],
    successStory: {
      title: 'राज का डिजिटल एजेंसी मॉडल',
      person: 'राज किशोर (साइबर कैफे ओनर, पटना)',
      story: 'राज ने एजेंसी रीसेलर हब से अपना डिजिटल काम शुरू किया। उसने पहले महीने में 20 से अधिक रीसेलिंग की और ₹5,480 का सीधा मुनाफा हासिल किया।',
      earnings: '₹5,480 सीधा मुनाफा (20 रीसेलिंग)'
    }
  },
  {
    id: 'plan-07',
    planNumber: 7,
    name: 'Lifetime Master Access',
    subtitle: 'All 6 Plans + Lifetime VIP Mentorship',
    tagline: 'IOIS का सर्वोच्च और सबसे संपूर्ण लाइफटाइम प्लान',
    category: 'master',
    price: 999,
    incentive: 499,
    payoutPercent: 50,
    badge: '50% INSTANT PAYOUT (₹499/Referral)',
    isSupreme: true,
    colorScheme: {
      bg: 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-600/10',
      border: 'border-amber-400',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-600',
      badgeText: 'text-white',
      accent: 'text-amber-800',
      button: 'bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30',
    },
    features: [
      '✓ All 6 Lower Plans Complete Unlocked Access (Plan 01 से Plan 06 सब कुछ शामिल)',
      '✓ Lifetime Free Access to Future Courses & Upgrades (आजीवन कोई अतिरिक्त चार्ज नहीं)',
      '✓ VIP Direct Admin Mentorship & Master Leader Group Access',
      '✓ Highest Tier ₹499 Instant Payout Protocol (50% Direct on every referral)',
      '✓ Master Reseller License & Automated Income Machine Protocol',
      '✓ Verified IOIS Master Golden Smart ID Card with Priority Verification'
    ],
    kyaMilega: [
      {
        title: 'सभी 6 निचले प्लान्स का 100% अनलॉक्ड एक्सेस',
        description: 'NCERT नोट्स, AI प्रॉम्प्ट्स, क्लास 6-12, फैमिली किट, प्रतियोगी परीक्षा नोट्स और एजेंसी किट सब कुछ एक साथ!',
        icon: 'Layers'
      },
      {
        title: 'आजीवन निशुल्क अपडेट्स और भविष्य के कोर्सेज',
        description: 'भविष्य में IOIS पोर्टल पर आने वाले सभी नए डिजिटल कोर्सेज, टूल्स और फाइल्स का आजीवन बिना किसी शुल्क के एक्सेस।',
        icon: 'Infinity'
      },
      {
        title: 'वीआईपी डायरेक्ट एडमिन मेंटरशिप व लीडर ग्रुप',
        description: 'IOIS के संस्थापक और मुख्य तकनीकी दल के साथ प्राइवेट टेलीग्राम और कॉल मीटिंग्स में सीधा मार्गदर्शन।',
        icon: 'Crown'
      },
      {
        title: 'सर्वोच्च इंसेंटिव ₹499 प्रति सदस्य',
        description: 'प्लेटफॉर्म का सबसे बड़ा सीधा पेआउट—मात्र 10 रेफरल पर ₹4,990 और 20 रेफरल पर ₹9,980 की तत्काल आमदनी।',
        icon: 'Zap'
      }
    ],
    kiseJaruratHai: [
      {
        target: 'विजनरी कम्युनिटी लीडर्स और संगठन निर्माता',
        why: 'जो पूरा साम्राज्य बनाना चाहते हैं और अपने नेटवर्क को सशक्त करते हुए सबसे बड़ा ₹499 इंसेंटिव पाना चाहते हैं।'
      },
      {
        target: 'गंभीर डिजिटल उद्यमी (Digital Entrepreneurs)',
        why: 'जिन्हें बार-बार छोटे प्लान्स खरीदने के बजाय एक बार में सम्पूर्ण समाधान, आजीवन अपडेट्स और टॉप-टियर लाभ चाहिए।'
      }
    ],
    successStory: {
      title: 'संजय का मास्टर साम्राज्य (The Sanjay Model)',
      person: 'संजय वर्मा (सीनियर कम्युनिटी लीडर, लखनऊ)',
      story: 'संजय ने मास्टर प्लान एक्टिवेट किया। उसने अपने नेटवर्क में मात्र 20 विजनरी साथियों को जोड़ा और तुरंत ₹9,980 कमाए। आज उसका पूरा नेटवर्क ऑटोमेशन पर रन कर रहा है और वह डिजिटल आजादी का आनंद ले रहा है।',
      earnings: '₹9,980 तुरंत इंसेंटिव (20 मास्टर सदस्य)'
    }
  }
];

export const ioisServicesList: IOISService[] = [
  {
    id: 'rtps-land',
    nameHindi: 'RTPS व जमीन सेवाएं',
    nameEnglish: 'RTPS & Land Records',
    category: 'government',
    icon: 'Landmark',
    description: 'जाति, आय, निवास प्रमाण पत्र, भू-अभिलेख, खतियान, दाखिल-खारिज व राशन कार्ड स्थिति जांचें।',
    actionText: 'पोर्टल खोलें',
    badge: 'लोकप्रिय',
    urlOrType: 'https://serviceonline.bihar.gov.in/'
  },
  {
    id: 'seven-plans',
    nameHindi: '7 मास्टर प्लांस',
    nameEnglish: '7 Master Plans',
    category: 'tools',
    icon: 'Sparkles',
    description: '₹10 से ₹999 तक के आधिकारिक शिक्षा व इंसेंटिव प्लांस—50% से 70% तक इंस्टेंट पेआउट।',
    actionText: 'प्लांस देखें',
    badge: '70% पेआउट',
    urlOrType: 'internal-plans'
  },
  {
    id: 'student-portal',
    nameHindi: 'विद्यार्थी पोर्टल (नोट्स व PDF)',
    nameEnglish: 'Student Study Hub',
    category: 'education',
    icon: 'GraduationCap',
    description: 'NCERT पुस्तकें, समाधान, प्रतियोगी परीक्षा नोट्स, फॉर्मूला शीट्स और दैनिक करंट अफेयर्स।',
    actionText: 'स्टडी सामग्री खोलें',
    badge: 'निःशुल्क',
    urlOrType: 'internal-notes'
  },
  {
    id: 'income-calculator',
    nameHindi: 'इंसेंटिव व आमदनी कैलकुलेटर',
    nameEnglish: 'Earnings Calculator',
    category: 'tools',
    icon: 'Calculator',
    description: 'देखें कि कितने लोगों को शेयर करने पर आपकी कितनी तुरंत आमदनी बनेगी।',
    actionText: 'हिसाब लगाएं',
    urlOrType: 'internal-calc'
  },
  {
    id: 'live-weather',
    nameHindi: 'लाइव मौसम व वर्षा पूर्वानुमान',
    nameEnglish: 'Live Weather',
    category: 'utility',
    icon: 'CloudSun',
    description: 'अपने जिले का वर्तमान तापमान, बारिश की संभावना और 7 दिनों का मौसम पूर्वानुमान।',
    actionText: 'मौसम देखें',
    urlOrType: 'internal-weather'
  },
  {
    id: 'live-tv',
    nameHindi: 'लाइव टीवी व समाचार',
    nameEnglish: 'Live News & TV',
    category: 'entertainment',
    icon: 'Tv',
    description: 'डीडी नेशनल, दूरदर्शन किसान, संसद टीवी और प्रमुख राष्ट्रीय समाचार चैनल।',
    actionText: 'लाइव देखें',
    badge: 'लाइव',
    urlOrType: 'internal-tv'
  },
  {
    id: 'id-card',
    nameHindi: 'डिजिटल ID कार्ड',
    nameEnglish: 'Digital Membership ID',
    category: 'tools',
    icon: 'CreditCard',
    description: 'अपना आधिकारिक IOIS मेंबरशिप स्मार्ट कार्ड देखें, डाउनलोड करें और शेयर करें।',
    actionText: 'कार्ड देखें',
    badge: 'स्मार्ट पास',
    urlOrType: 'internal-idcard'
  },
  {
    id: 'panchang',
    nameHindi: 'दैनिक पंचांग व शुभ मुहूर्त',
    nameEnglish: 'Daily Panchang',
    category: 'utility',
    icon: 'CalendarDays',
    description: 'सूर्योदय, सूर्यास्त, राहुकाल, चौघड़िया, तिथि, नक्षत्र और शुभ मुहूर्त की दैनिक जानकारी।',
    actionText: 'पंचांग देखें',
    urlOrType: 'internal-panchang'
  },
  {
    id: 'mandi-bhav',
    nameHindi: 'मंडी भाव (कृषि उपज दरें)',
    nameEnglish: 'Mandi Rates',
    category: 'utility',
    icon: 'TrendingUp',
    description: 'गेहूं, धान, मक्का, सरसों, चना व सब्जियों की प्रमुख कृषि उपज मंडियों के ताजा भाव।',
    actionText: 'भाव जानें',
    urlOrType: 'internal-mandi'
  },
  {
    id: 'job-alerts',
    nameHindi: 'सरकारी जॉब अलर्ट्स (Sarkari)',
    nameEnglish: 'Job & Vacancy Alerts',
    category: 'government',
    icon: 'Briefcase',
    description: 'नवीनतम सरकारी भर्तियां, एडमिट कार्ड, परीक्षा तिथियां और परिणाम की सबसे तेज अपडेट।',
    actionText: 'नौकरियां देखें',
    badge: 'अपडेटेड',
    urlOrType: 'internal-jobs'
  },
  {
    id: 'gov-portals',
    nameHindi: 'प्रमुख सरकारी वेबसाइट्स',
    nameEnglish: 'Government Portals Direct',
    category: 'government',
    icon: 'Globe2',
    description: 'आधार UIDAI, पैन NSDL, वोटर कार्ड NVSP, ई-श्रम और पीएम किसान के सीधे लिंक्स।',
    actionText: 'पोर्टल्स देखें',
    urlOrType: 'internal-gov'
  },
  {
    id: 'chat-fun',
    nameHindi: 'मनोरंजन, पहेलियां व चैट',
    nameEnglish: 'Entertainment & Community',
    category: 'entertainment',
    icon: 'Smile',
    description: 'ज्ञानवर्धक पहेलियां, क्विज, प्रेरणादायक उद्धरण और सदस्य कम्युनिटी डिस्कशन।',
    actionText: 'शुरू करें',
    urlOrType: 'internal-fun'
  },
  {
    id: 'ai-sahayak',
    nameHindi: 'IOIS AI सहायता (Sahayak)',
    nameEnglish: 'Ask IOIS AI',
    category: 'tools',
    icon: 'Bot',
    description: 'प्लान चयन, नियमों, इंसेंटिव ट्रांसफर और सहायता से जुड़े किसी भी सवाल का तुरंत उत्तर पाएं।',
    actionText: 'AI से पूछें',
    badge: 'AI 24x7',
    urlOrType: 'internal-ai'
  },
  {
    id: 'helpline',
    nameHindi: 'आधिकारिक हेल्पलाइन व संपर्क',
    nameEnglish: 'Support Helpline',
    category: 'utility',
    icon: 'PhoneCall',
    description: 'व्हाट्सएप सपोर्ट, ईमेल हेल्पडेस्क और टेलीग्राम चैनल से त्वरित सहायता प्राप्त करें।',
    actionText: 'सपोर्ट संपर्क',
    urlOrType: 'internal-help'
  },
  {
    id: 'share-portal',
    nameHindi: 'शेयर व इनवाइट मित्र',
    nameEnglish: 'Share & Referral Invite',
    category: 'tools',
    icon: 'Share2',
    description: 'अपना पर्सनल रेफरल लिंक व्हाट्सएप और सोशल मीडिया पर एक क्लिक में साझा करें।',
    actionText: 'शेयर करें',
    urlOrType: 'internal-share'
  },
  {
    id: 'login-register',
    nameHindi: 'सदस्य लॉगिन व पंजीकरण',
    nameEnglish: 'Member Login & Register',
    category: 'tools',
    icon: 'UserCheck',
    description: 'नए सदस्य के रूप में जुड़ें या अपने मौजूदा रजिस्टर्ड मोबाइल से डैशबोर्ड में लॉगिन करें।',
    actionText: 'लॉगिन / रजिस्टर',
    urlOrType: 'internal-register'
  },
  {
    id: 'smart-verification',
    nameHindi: 'स्मार्ट पास सत्यापन (Verify ID)',
    nameEnglish: 'Verify Member ID',
    category: 'government',
    icon: 'ShieldCheck',
    description: 'किसी भी सदस्य का IOIS आईडी कोड दर्ज करके उसकी सत्यता और एक्टिव प्लान जांचें।',
    actionText: 'सत्यापित करें',
    urlOrType: 'internal-verify'
  }
];

export const aiKnowledgeBase = [
  {
    keywords: ['best', 'kaun', 'kaun sa', 'konsa', 'achha', 'chahiye', 'kounsa', 'best plan'],
    response: `IOIS में आपकी आवश्यकता के अनुसार 3 बेहतरीन श्रेणियां हैं:
1. **यदि आप पहली बार ऑनलाइन शुरुआत कर रहे हैं:** तो **PLAN 01 (₹10 - Bal Vikas)** या **PLAN 02 (₹49 - Youth Skill)** से शुरुआत करें। इसमें 70% इंसेंटिव मिलता है।
2. **यदि आप छात्र या प्रतियोगी अभ्यर्थी हैं:** तो **PLAN 05 (₹299 - Student Elite)** सबसे लोकप्रिय है, जिसमें SSC/Railway/Police के टॉप नोट्स और ₹179 प्रति रेफरल मिलता है।
3. **यदि आप अधिकतम कमाई और पूरा सिस्टम चाहते हैं:** तो **PLAN 07 (₹999 - Supreme Master)** लें। इसमें सभी 6 प्लान्स अनलॉक हैं और प्रति रेफरल ₹499 (50%) का सीधा लाभ है!`
  },
  {
    keywords: ['10', 'bal vikas', 'dus', 'das', 'plan 1', 'plan 01'],
    response: `**PLAN 01 (Bal Vikas Access - ₹10):**
• **लागत:** मात्र ₹10
• **इंसेंटिव:** ₹7 प्रति रेफरल (70% पेआउट!)
• **क्या मिलेगा:** Class 1-5 NCERT डिजिटल PDF नोट्स, एक्टिविटी शीट्स, और ऑफिशियल वेरिफिकेशन पास।
• **किसके लिए:** स्कूली बच्चों, प्राथमिक शिक्षकों और बिना जोखिम ऑनलाइन सिस्टम सीखने वाले हर भारतीय के लिए।
• **कमाई का उदाहरण:** अमित ने 100 बच्चों को नोट्स शेयर करके ₹700 तुरंत कमाए!`
  },
  {
    keywords: ['999', 'master', 'supreme', 'lifetime', 'plan 7', 'plan 07'],
    response: `**PLAN 07 (Supreme Master Lifetime Access - ₹999):**
• **लागत:** ₹999 (एकमुश्त लाइफटाइम लाइसेंस)
• **इंसेंटिव:** ₹499 प्रति रेफरल (50% इंस्टेंट पेआउट!)
• **क्या मिलेगा:**
  1. सभी 6 निचले प्लान्स (₹10, ₹49, ₹99, ₹199, ₹299, ₹499) का पूर्ण एक्सेस।
  2. भविष्य के सभी कोर्सेज और अपडेट्स आजीवन मुफ्त।
  3. वीआईपी डायरेक्ट एडमिन मेंटरशिप और मास्टर लीडर ग्रुप।
  4. मास्टर रीसेलर लाइसेंस।
• **कमाई का उदाहरण:** संजय वर्मा ने मात्र 20 साथियों को जोड़कर ₹9,980 सीधे कमाए!`
  },
  {
    keywords: ['incentive', 'paisa', 'kamai', 'earning', 'account', 'bank', 'transfer', 'kab'],
    response: `**IOIS इंसेंटिव सिस्टम कैसे काम करता है?**
• जब भी कोई आपके रेफरल लिंक से कोई भी प्लान एक्टिवेट करता है, उसका 50% से 70% हिस्सा तुरंत आपके डैशबोर्ड में इंसेंटिव के रूप में क्रेडिट हो जाता है।
• इसे आप सीधे अपने UPI (PhonePe, Google Pay, Paytm) या बैंक खाते में ट्रांसफर कर सकते हैं।
• कोई हिडन चार्ज या कट नहीं है। यह पूर्णतः पारदर्शी और डिजिटल इंडिया समर्थित मॉडल है।`
  },
  {
    keywords: ['rtps', 'zamin', 'jamin', 'bihar', 'caste', 'income', 'niwas', 'dakhil'],
    response: `**RTPS व जमीन सेवाएं:**
IOIS पोर्टल से आप सीधे बिहार एवं केंद्रीय RTPS सेवाओं का उपयोग कर सकते हैं:
1. जाति, आय, निवास प्रमाण पत्र आवेदन व डाउनलोड
2. अपनी जमीन का खतियान व दाखिल-खारिज स्थिति
3. राशन कार्ड लिस्ट में नाम देखना
यह सेवा सभी सदस्यों के लिए 100% निशुल्क सुलभ है।`
  }
];

export { planCurriculumsData, getCurriculumForPlan } from './planCurriculumsData';
