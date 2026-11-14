import { UserProfile, HelpTicket, KnowledgeItem, AdminPrivateMessage } from '../types';
import { PLANS } from '../data/plansData';
import { db } from '../lib/firebase';
import {
  idbGet,
  idbSet,
  idbRemove,
  safeLocalStorageGet,
  safeLocalStorageRemove,
  safeLocalStorageSet,
  stripOversizedDataUrls,
} from '../utils/safeStorage';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  deleteDoc,
  onSnapshot,
  query,
  where,
  limit 
} from 'firebase/firestore';

const STORAGE_USERS_KEY = 'iois_database_users_v2';
const STORAGE_USERS_VAULT_KEY = 'iois_database_users_vault_v1';
const STORAGE_ARCHIVE_VAULT_KEY = 'iois_archived_users_vault_v1';
const STORAGE_FIRESTORE_QUOTA_KEY = 'iois_firestore_quota_until';
const STORAGE_CURRENT_USER_KEY = 'iois_current_session_user';
const STORAGE_ADMIN_SESSION_KEY = 'iois_admin_session_active';
const STORAGE_TICKETS_KEY = 'iois_help_tickets_v2';
const STORAGE_KNOWLEDGE_KEY = 'iois_ai_knowledge_v2';
const STORAGE_UNANSWERED_KEY = 'iois_ai_unanswered_v2';
const STORAGE_INTERVIEWS_KEY = 'iois_interviews_v2';
const STORAGE_PRIVATE_MESSAGES_KEY = 'iois_private_chat_messages_v2';
const STORAGE_DEVICE_SESSION_TOKEN_KEY = 'iois_device_session_token';

// NEVER include member database keys in evict list so user data is never wiped on quota pressure
const BULKY_EVICT_KEYS = [
  STORAGE_INTERVIEWS_KEY,
  STORAGE_UNANSWERED_KEY,
  'iois_social_messages_local_v1',
];

let memoryUsers: UserProfile[] | null = null;
let memoryArchivedUsers: UserProfile[] = [];
let memoryCurrentUser: UserProfile | null | undefined = undefined;
let memoryTickets: HelpTicket[] | null = null;
let idbHydrationPromise: Promise<void> | null = null;
let lastClientFirestoreFetchAt = 0;

export const isFirestoreInQuotaCooldown = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const raw = safeLocalStorageGet(STORAGE_FIRESTORE_QUOTA_KEY);
    if (!raw) return false;
    const until = Number(raw);
    return Number.isFinite(until) && Date.now() < until;
  } catch {
    return false;
  }
};

export const markFirestoreQuotaExhausted = (err?: any): boolean => {
  const msg = String(err?.message || err?.code || err || '').toLowerCase();
  if (
    msg.includes('resource-exhausted') ||
    msg.includes('quota') ||
    msg.includes('exceeded') ||
    msg.includes('429')
  ) {
    if (typeof window !== 'undefined') {
      safeLocalStorageSet(STORAGE_FIRESTORE_QUOTA_KEY, String(Date.now() + 10 * 60 * 1000));
    }
    return true;
  }
  return false;
};

export const getDeviceSessionToken = (): string => {
  if (typeof window === 'undefined') return '';
  return safeLocalStorageGet(STORAGE_DEVICE_SESSION_TOKEN_KEY) || '';
};

export const setDeviceSessionToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  if (token) {
    safeLocalStorageSet(STORAGE_DEVICE_SESSION_TOKEN_KEY, token, {
      evictKeysOnQuota: BULKY_EVICT_KEYS,
    });
  } else {
    safeLocalStorageRemove(STORAGE_DEVICE_SESSION_TOKEN_KEY);
  }
};

export const clearDeviceSessionToken = (): void => {
  if (typeof window === 'undefined') return;
  safeLocalStorageRemove(STORAGE_DEVICE_SESSION_TOKEN_KEY);
};

export const getDeviceFingerprintLabel = (): string => {
  if (typeof navigator === 'undefined') return 'Unknown Device';
  const ua = navigator.userAgent || '';
  let os = 'Desktop / Web';
  if (/Android/i.test(ua)) os = 'Android Mobile';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iPhone / iOS';
  else if (/Windows/i.test(ua)) os = 'Windows PC';
  else if (/Mac/i.test(ua)) os = 'MacBook / macOS';
  else if (/Linux/i.test(ua)) os = 'Linux Device';

  let browser = 'Browser';
  if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';

  return `${os} (${browser})`;
};

const createClientSessionToken = (): string => {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
};

// All demo/mock preview users removed per system requirements
export const DEMO_USER_IDS = ['IOIS999RK01', 'IOIS49PS01', 'IOIS10AM01', 'IOIS99KV01', 'IOIS999SM01'];
const INITIAL_DEMO_USERS: UserProfile[] = [];

export const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "k-balvikas",
    question: "बाल विकास क्या है? (What is IOIS Bal Vikas Platform?)",
    answer: "IOIS बाल विकास (ioisplatform.github.io/balvikas) बच्चों की संपूर्ण प्रारंभिक शिक्षा और डिजिटल विकास का मंच है:\n1. 700+ पृष्ठों की सम्पूर्ण डिजिटल पुस्तक (अ से ज्ञ वर्णमाला, बारहखड़ी, शब्द ज्ञान, चित्रावली)।\n2. चिंटू AI लाइव कार्टून शिक्षक: बोलने व समझाने वाला इंटरएक्टिव शिक्षक जो बच्चों को खेल-खेल में सिखाता है।\n3. 3D मानव शरीर रचना: आँख, कान, नाक, दिल, मस्तिष्क और फेफड़ों के 3D मॉडल व आवाज़।\n4. A to Z व अ-ज्ञ पेंसिल ट्रेसिंग: डिजिटल स्लेट पर अक्षर लिखना सीखने की सुविधा।\n5. गणित (1 से 100 गिनती, पहाड़े 1-20, जोड़, घटाव)।\n6. गुड इंग्लिश व फ़ोनिक्स (Phonics ध्वनि विज्ञान)।\n7. यह संपूर्ण किट IOIS के Plan 01 (मात्र ₹10) में लाइफटाइम उपलब्ध है और इसपर ₹7 इंस्टेंट पेआउट मिलता है।",
    category: "Bal Vikas",
    createdAt: "2026-08-20T10:00:00Z",
    hits: 150
  },
  {
    id: "k-chintu-ai",
    question: "चिंटू AI शिक्षक कौन है? (Who is Chintu AI Teacher?)",
    answer: "चिंटू IOIS बाल विकास का प्यारा AI लाइव शिक्षक है। यह बच्चों को बोलकर वर्णमाला, पहाड़े, अंग्रेजी फ़ोनिक्स और 3D शरीर के अंग सिखाता है। चिंटू का पढ़ाई का सूत्र है: पहले चित्र देखो, आवाज़ सुनो, और फिर 3 बार लिखकर अभ्यास करो!",
    category: "Bal Vikas",
    createdAt: "2026-08-20T10:00:00Z",
    hits: 140
  },
  {
    id: "k-register",
    question: "रजिस्ट्रेशन कैसे करें? (How to register in IOIS?)",
    answer: "रजिस्ट्रेशन की प्रक्रिया अत्यंत सरल है:\n1. होमपेज या शीर्ष मेन्यू से 'नया सदस्य रजिस्ट्रेशन' (Registration) पर क्लिक करें।\n2. अपना नाम, मोबाइल नंबर, ईमेल और सुरक्षित पासवर्ड दर्ज करें।\n3. 7 में से अपना उपयुक्त प्लान चुनें (Plan 01 ₹10 से Plan 07 ₹999 तक)।\n4. आधिकारिक UPI ID: 8877490845@spicepay (Vikas Kumar) पर भुगतान करें।\n5. 12-अंकों का UTR नंबर दर्ज करें और पेमेंट स्क्रीनशॉट अपलोड करें।\n6. 'पंजीकरण पूर्ण करें' बटन दबाएं। 5 मिनट के भीतर एडमिन द्वारा वेरिफिकेशन पूरा हो जाएगा और आपका 256-Bit एन्क्रिप्टेड User ID एक्टिवेट हो जाएगा।",
    category: "Registration",
    createdAt: "2026-08-20T10:00:00Z",
    hits: 45
  },
  {
    id: "k-plans",
    question: "IOIS के 7 प्लान्स और इंसेंटिव क्या हैं?",
    answer: "IOIS में 7 मुख्य प्लान्स उपलब्ध हैं:\n\n1. Plan 01: Bal Vikas Access (₹10) -> ₹7 इंस्टेंट पेआउट प्रति रेफरल (70% पेआउट)\n2. Plan 02: Youth Skill Access (₹49) -> ₹34 इंस्टेंट पेआउट प्रति रेफरल (70% पेआउट)\n3. Plan 03: Career & Job Access (₹99) -> ₹64 इंस्टेंट पेआउट प्रति रेफरल (65% पेआउट)\n4. Plan 04: Family VIP Access (₹199) -> ₹119 इंस्टेंट पेआउट प्रति रेफरल (60% पेआउट)\n5. Plan 05: Student Elite Access (₹299) -> ₹179 इंस्टेंट पेआउट प्रति रेफरल (60% पेआउट)\n6. Plan 06: Agency Reseller Hub (₹499) -> ₹274 इंस्टेंट पेआउट प्रति रेफरल (55% पेआउट)\n7. Plan 07: Master Lifetime Access (₹999) -> ₹499 इंस्टेंट पेआउट प्रति रेफरल (50% पेआउट)\n\nहर प्लान में NCERT बुक्स, करियर नोट्स, CV टेम्प्लेट्स और डिजिटल लर्निंग किट शामिल हैं!",
    category: "Plans",
    createdAt: "2026-08-20T10:00:00Z",
    hits: 88
  },
  {
    id: "k-payout",
    question: "पेआउट कैसे और कब प्राप्त होता है?",
    answer: "IOIS में स्मार्ट इंस्टेंट पेआउट प्रोटोकॉल है:\n• जैसे ही आपके रेफरल लिंक या User ID से कोई नया सदस्य किसी भी प्लान में जुड़ता है और एडमिन द्वारा वेरिफाई होता है, उसका इंसेंटिव (₹7 से ₹499) तुरंत आपके रजिस्टर्ड UPI ID (PhonePe, Google Pay, Paytm) में भेज दिया जाता है।\n• कोई न्यूनतम निकासी सीमा नहीं है (0 Minimum Threshold) और कोई छिपा हुआ शुल्क नहीं काटा जाता।",
    category: "Payout",
    createdAt: "2026-08-20T10:00:00Z",
    hits: 62
  },
  {
    id: "k-idcard",
    question: "आधिकारिक डिजिटल ID कार्ड कैसे देखें या डाउनलोड करें?",
    answer: "डिजिटल ID कार्ड प्राप्त करने की विधि:\n1. शीर्ष मेन्यू या डैशबोर्ड से 'डिजिटल ID कार्ड' (ID Card Generator) विकल्प खोलें।\n2. यहाँ आपका 256-Bit एन्क्रिप्टेड स्मार्ट डिजिटल पहचान पत्र (आगे और पीछे का भाग) लाइव दिखेगा।\n3. 'HD PNG डाउनलोड' बटन पर क्लिक करें।\n4. आप सीधे 'कार्ड प्रिंट करें' बटन दबाकर इसे तुरंत लेमिनेशन साइज में प्रिंट भी कर सकते हैं।",
    category: "ID Card",
    createdAt: "2026-08-20T10:00:00Z",
    hits: 51
  },
  {
    id: "k-assessment",
    question: "15-सवाल कौशल साक्षात्कार (Interview Assessment) क्या है?",
    answer: "15-सवाल कौशल मूल्यांकन एक इंटरएक्टिव ऑनलाइन टेस्ट है:\n• यह आपके डिजिटल ज्ञान, लक्ष्य और उपलब्ध समय का विश्लेषण करता है।\n• टेस्ट पूरा होते ही आपका कुल स्कोर (Points) और आपके लिए सर्वश्रेष्ठ IOIS प्लान की सिफारिश की जाती है।\n• इसकी पूरी रिपोर्ट ऑटोमैटिकली एडमिन के पास सुरक्षित हो जाती है।",
    category: "Interview",
    createdAt: "2026-08-20T10:00:00Z",
    hits: 34
  },
  {
    id: "k-rtps-caste-income",
    question: "जाति, आय और निवास प्रमाण पत्र कैसे और कहाँ से बनता है? क्या-क्या डॉक्यूमेंट लगेगा?",
    answer: "जाति, आय व निवास प्रमाण पत्र ServicePlus RTPS पोर्टल (serviceonline.bihar.gov.in) या अपने राज्य के e-District पोर्टल से 100% मुफ्त बनता है:\n• आवश्यक दस्तावेज: आवेदक का आधार कार्ड (जिसमें नाम व पिता का नाम सही हो), पासपोर्ट साइज फोटो और स्व-घोषणा पत्र।\n• समय सीमा: 10 से 14 कार्य दिवस।\n• कैसे बनता है: पोर्टल पर सामान्य प्रशासन विभाग -> अंचल स्तर (RO/CO) चुनें, फॉर्म भरें, आधार कार्ड अपलोड करें और सबमिट करें। बनने के बाद 'Download Certificate' से डिजिटल साइन वाला PDF घर बैठे डाउनलोड हो जाता है।",
    category: "RTPS",
    createdAt: "2026-08-24T10:00:00Z",
    hits: 73
  },
  {
    id: "k-jamin-dakhil-kharij",
    question: "जमीन का दाखिल खारिज (Mutation) और परिमार्जन कैसे होता है?",
    answer: "जमीन दाखिल-खारिज और परिमार्जन बिहार भूमि पोर्टल (biharbhumi.bihar.gov.in) से होता है:\n• दाखिल खारिज (नामांतरण): जमीन की रजिस्टर्ड केवाला (Sale Deed) की PDF, विक्रेता की अद्यतन लगान रसीद और क्रेता-विक्रेता का आधार कार्ड लगता है। सरकारी फीस ₹0 (मुफ्त) है और 35 कार्य दिवसों में शुद्धि पत्र जारी होता है।\n• परिमार्जन पोर्टल: डिजिटल जमाबंदी में गलत नाम, छूटे हुए खाता/खेसरा या रकबा सुधार के लिए पुरानी रसीद, खतियान व स्व-घोषणा पत्र लगाकर ऑनलाइन आवेदन किया जाता है।\n• LPC (Land Possession Certificate): बैंक कृषि ऋण व सरकारी योजनाओं के लिए ऑनलाइन LPC अप्लाई किया जाता है।",
    category: "Land Reforms",
    createdAt: "2026-08-24T10:00:00Z",
    hits: 95
  },
  {
    id: "k-instant-pan-aadhaar",
    question: "10 मिनट में फ्री Instant e-PAN कार्ड कैसे बनाएं?",
    answer: "इनकम टैक्स ई-फाइलिंग पोर्टल (eportal.incometax.gov.in) के 'Instant e-PAN' विकल्प से बिना 1 रुपया खर्च किए 10 मिनट में नया डिजिटल पैन कार्ड बन जाता है:\n• शर्त: आधार कार्ड में मोबाइल नंबर लिंक होना चाहिए और पहले से कोई पैन कार्ड न बना हो।\n• प्रक्रिया: आधार नंबर डालें -> मोबाइल पर आया OTP दर्ज करें -> e-KYC विवरण स्वीकार करें -> सबमिट करें। 10 मिनट में e-PAN PDF डाउनलोड हो जाएगा।",
    category: "Aadhaar & PAN",
    createdAt: "2026-08-24T10:00:00Z",
    hits: 58
  },
  {
    id: "k-pension-scholarship",
    question: "वृद्धावस्था/विधवा पेंशन और छात्रवृत्ति (Scholarship) के लिए क्या करना होगा?",
    answer: "सरकारी पेंशन व छात्रवृत्ति के नियम:\n• वृद्धावस्था पेंशन (60+ वर्ष): SSPMIS पोर्टल पर आधार, बैंक पासबुक (DBT/NPCI लिंक्ड) और निवास प्रमाण पत्र से अप्लाई होता है। हर महीने ₹400-₹1000 खाते में आते हैं।\n• छात्रवृत्ति (Post-Matric): PMS पोर्टल (pmsonline.bihar.gov.in) पर 10वीं मार्कशीट, कॉलेज बोनाफाइड सर्टिफिकेट, फीस रसीद, जाति, आय व निवास अपलोड कर आवेदन होता है।\n• कन्या उत्थान: 12वीं पास छात्राओं को ₹25,000 और ग्रेजुएशन पास को ₹50,000 Medhasoft पोर्टल से सीधे खाते में मिलते हैं।",
    category: "Pensions & Scholarships",
    createdAt: "2026-08-24T10:00:00Z",
    hits: 81
  },
  {
    id: "k-capital-of-india",
    question: "भारत की राजधानी क्या है? (Capital of India)",
    answer: "भारत की राजधानी नई दिल्ली (New Delhi) है।\n• आधिकारिक नाम: राष्ट्रीय राजधानी क्षेत्र दिल्ली (NCT of Delhi)\n• उद्घाटन: 13 फरवरी 1931 को आधिकारिक तौर पर उद्घाटन हुआ।\n• प्रमुख केंद्र: राष्ट्रपति भवन, नया संसद भवन, इंडिया गेट और सुप्रीम कोर्ट।\n• प्रमुख राज्यों की राजधानियाँ: बिहार की राजधानी पटना, उत्तर प्रदेश की लखनऊ, महाराष्ट्र की मुंबई, राजस्थान की जयपुर है।",
    category: "General Knowledge",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 120
  },
  {
    id: "k-capital-of-bihar",
    question: "बिहार की राजधानी क्या है? (Capital of Bihar)",
    answer: "बिहार की राजधानी पटना (Patna) है।\n• ऐतिहासिक नाम: पाटलिपुत्र (Patliputra)।\n• महत्व: गंगा नदी के तट पर स्थित प्राचीन और ऐतिहासिक नगर।\n• प्रमुख स्थल: गोलघर, पटना साहिब गुरुद्वारा, बिहार संग्रहालय, तख्त श्री हरिमंदिर जी।",
    category: "General Knowledge",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 90
  },
  {
    id: "k-cm-bihar",
    question: "बिहार के मुख्यमंत्री कौन हैं? (Chief Minister of Bihar)",
    answer: "बिहार के वर्तमान मुख्यमंत्री श्री नीतीश कुमार (Shri Nitish Kumar) हैं।\n• उप-मुख्यमंत्री: श्री सम्राट चौधरी और श्री विजय कुमार सिन्हा।\n• राज्यपाल: श्री राजेंद्र विश्वनाथ आर्लेकर।",
    category: "General Knowledge",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 95
  },
  {
    id: "k-pm-india",
    question: "भारत के प्रधानमंत्री कौन हैं? (Prime Minister of India)",
    answer: "भारत के वर्तमान प्रधानमंत्री श्री नरेंद्र मोदी (Shri Narendra Modi) हैं।\n• वे 26 मई 2014 से लगातार भारत के प्रधानमंत्री हैं।\n• भारत के प्रथम प्रधानमंत्री पंडित जवाहरलाल नेहरू थे।",
    category: "General Knowledge",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 110
  },
  {
    id: "k-president-india",
    question: "भारत के राष्ट्रपति कौन हैं? (President of India)",
    answer: "भारत की वर्तमान राष्ट्रपति माननीया श्रीमती द्रौपदी मुर्मू (Smt. Droupadi Murmu) हैं।\n• वे भारत की 15वीं राष्ट्रपति हैं और देश की प्रथम आदिवासी महिला राष्ट्रपति हैं।\n• भारत के प्रथम राष्ट्रपति डॉ. राजेंद्र प्रसाद थे।",
    category: "General Knowledge",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 105
  },
  {
    id: "k-godavari-river",
    question: "गोदावरी नदी का उद्गम कहाँ से होता है?",
    answer: "गोदावरी नदी का उद्गम महाराष्ट्र के नासिक जिले में स्थित त्र्यंबकेश्वर (Trimbakeshwar / ब्रह्मगिरि पर्वत) से होता है।\n• उपनाम: इसे 'दक्षिण गंगा' या 'वृद्ध गंगा' भी कहा जाता है।\n• लंबाई व मुहाना: 1,465 किमी लंबी यह नदी बंगाल की खाड़ी में गिरती है। यह भारत की दूसरी सबसे लंबी नदी है।",
    category: "General Knowledge",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 85
  },
  {
    id: "k-photosynthesis",
    question: "प्रकाश संश्लेषण क्या है? (What is Photosynthesis?)",
    answer: "प्रकाश संश्लेषण (Photosynthesis) वह रासायनिक प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश, कार्बन डाइऑक्साइड (CO2) और जल (H2O) की सहायता से अपना भोजन (ग्लूकोज) बनाते हैं और ऑक्सीजन (O2) गैस मुक्त करते हैं।\n• समीकरण: 6CO2 + 6H2O + सूर्य का प्रकाश -> C6H12O6 + 6O2\n• यह पौधों की पत्तियों में मौजूद क्लोरोफिल (हरित लवक) में संपन्न होता है।",
    category: "Science",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 90
  },
  {
    id: "k-student-study-portal",
    question: "विद्यार्थी शिक्षा पोर्टल (Student Study Portal) और नोट्स कहाँ मिलेंगे?",
    answer: "IOIS विद्यार्थी शिक्षा व अध्ययन केंद्र:\n• होमपेज या मेन्यू में 'विद्यार्थी शिक्षा व करियर' (Student Study Portal) बटन पर क्लिक करें।\n• यहाँ Class 1 से 12 और ग्रेजुएशन के सभी विषयों के NCERT नोट्स, गणित के सभी फॉर्मूला (Math Formula Sheets) और बोनाफाइड सर्टिफिकेट टेम्प्लेट्स 100% मुफ्त में उपलब्ध हैं।",
    category: "Education",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 110
  },
  {
    id: "k-contact-official",
    question: "IOIS का आधिकारिक संपर्क और पेमेंट विवरण क्या है?",
    answer: "IOIS आधिकारिक संपर्क:\n• आधिकारिक UPI ID: 8877490845@spicepay (लाभार्थी: Vikas Kumar)\n• व्हाट्सएप सपोर्ट: +91 8877490845\n• टेलीग्राम चैनल: @ioisplatform\n• ईमेल: ioisplatform@gmail.com\n• सपोर्ट समय: 24x7 ऑल इंडिया हेल्पडेस्क",
    category: "Contact",
    createdAt: "2026-08-24T10:00:00Z",
    hits: 49
  }
];

// Helper to sanitize undefined values before writing to Firestore
const sanitizeForFirestore = (obj: any): any => {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      clean[key] = sanitizeForFirestore(val);
    }
  }
  return clean;
};

// Prepare a user record so Firestore 1MB document limit NEVER drops a member record
const prepareUserForFirestore = (user: UserProfile): any => {
  const clean = sanitizeForFirestore(user);
  try {
    const serialized = JSON.stringify(clean);
    if (serialized.length <= 850_000) return clean;
    const trimmed = { ...clean };
    if (
      typeof trimmed.paymentScreenshotUrl === 'string' &&
      trimmed.paymentScreenshotUrl.startsWith('data:') &&
      trimmed.paymentScreenshotUrl.length > 250_000
    ) {
      trimmed.paymentScreenshotUrl = '';
    }
    if (
      typeof trimmed.photoUrl === 'string' &&
      trimmed.photoUrl.startsWith('data:') &&
      trimmed.photoUrl.length > 250_000
    ) {
      trimmed.photoUrl = '';
    }
    return trimmed;
  } catch {
    return clean;
  }
};

// Merge multiple user lists non-destructively (never erase non-empty fields or lose existing members)
export const mergeUserLists = (...lists: (UserProfile[] | undefined | null)[]): UserProfile[] => {
  const map = new Map<string, UserProfile>();

  for (const list of lists) {
    if (!list || !Array.isArray(list)) continue;
    for (const u of list) {
      if (!u || !u.userId || u.isArchived) continue;
      const key = u.userId.trim().toUpperCase();
      const existing = map.get(key);

      if (!existing) {
        map.set(key, { ...u, userId: key });
      } else {
        const merged: any = { ...existing };
        for (const [k, val] of Object.entries(u)) {
          if (val !== undefined && val !== null && val !== '') {
            merged[k] = val;
          }
        }

        const isApproved = existing.paymentStatus === 'approved' || u.paymentStatus === 'approved';
        merged.userId = existing.userId || key;
        merged.paymentStatus = isApproved ? 'approved' : (u.paymentStatus || existing.paymentStatus);
        merged.photoUrl = u.photoUrl || existing.photoUrl;
        merged.paymentScreenshotUrl = u.paymentScreenshotUrl || existing.paymentScreenshotUrl;
        merged.password = (u.password && u.password.trim()) ? u.password : existing.password;
        merged.verifiedAt = u.verifiedAt || existing.verifiedAt;
        merged.rejectionReason = u.rejectionReason || existing.rejectionReason;
        merged.registrationFormData =
          existing.registrationFormData || u.registrationFormData
            ? { ...(existing.registrationFormData || {}), ...(u.registrationFormData || {}) }
            : undefined;
        merged.friends = Array.from(new Set([...(existing.friends || []), ...(u.friends || [])]));
        merged.profileLikes = Array.from(new Set([...(existing.profileLikes || []), ...(u.profileLikes || [])]));
        merged.profileViews = Math.max(Number(existing.profileViews || 0), Number(u.profileViews || 0));

        if (Array.isArray(existing.editHistory) || Array.isArray(u.editHistory)) {
          const hist = [...(u.editHistory || []), ...(existing.editHistory || [])];
          const seen = new Set<string>();
          merged.editHistory = hist
            .filter((item) => {
              const sig = `${item.field}|${item.timestamp}|${item.newValue}`;
              if (seen.has(sig)) return false;
              seen.add(sig);
              return true;
            })
            .slice(0, 100);
        }

        map.set(key, merged as UserProfile);
      }
    }
  }

  return Array.from(map.values());
};

/**
 * FIRESTORE SYNC & PERSISTENCE HELPERS
 */
export const syncUserToFirestore = async (user: UserProfile): Promise<void> => {
  try {
    if (!db || !user.userId || isFirestoreInQuotaCooldown()) return;
    const userRef = doc(db, 'users', user.userId.trim().toUpperCase());
    const cleanData = prepareUserForFirestore(user);
    await setDoc(userRef, cleanData, { merge: true });
  } catch (e) {
    markFirestoreQuotaExhausted(e);
    console.warn('Firestore syncUser warning:', e);
  }
};

export const deleteUserFromFirestore = async (userId: string): Promise<void> => {
  try {
    if (!db || !userId || isFirestoreInQuotaCooldown()) return;
    // Soft-archive in Firestore so member record is NEVER permanently wiped
    await setDoc(
      doc(db, 'users', userId.trim().toUpperCase()),
      { isArchived: true, archivedAt: new Date().toISOString() },
      { merge: true }
    );
  } catch (e) {
    markFirestoreQuotaExhausted(e);
    console.warn('Firestore archiveUser warning:', e);
  }
};

export const subscribeToFirestoreUsers = (onUpdate: (users: UserProfile[]) => void) => {
  try {
    if (!db || isFirestoreInQuotaCooldown()) return () => {};
    const usersCol = collection(db, 'users');
    return onSnapshot(usersCol, (snapshot) => {
      const liveUsers: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        const u = docSnap.data() as UserProfile;
        if (u && u.userId && !u.isArchived) {
          liveUsers.push(u);
        }
      });
      if (liveUsers.length > 0) {
        const currentLocal = getAllUsers();
        const merged = mergeUserLists(currentLocal, liveUsers, INITIAL_DEMO_USERS);
        saveUsers(merged);
        onUpdate(merged);
      }
    }, (error) => {
      markFirestoreQuotaExhausted(error);
      console.warn('Firestore users snapshot error:', error);
    });
  } catch (e) {
    console.warn('Failed to subscribe to firestore users:', e);
    return () => {};
  }
};

export const syncTicketToFirestore = async (ticket: HelpTicket): Promise<void> => {
  try {
    if (!db || !ticket.id || isFirestoreInQuotaCooldown()) return;
    const ticketRef = doc(db, 'tickets', ticket.id);
    const cleanData = sanitizeForFirestore(ticket);
    await setDoc(ticketRef, cleanData, { merge: true });
  } catch (e) {
    markFirestoreQuotaExhausted(e);
    console.warn('Firestore syncTicket warning:', e);
  }
};

export const subscribeToFirestoreTickets = (onUpdate: (tickets: HelpTicket[]) => void) => {
  try {
    if (!db || isFirestoreInQuotaCooldown()) return () => {};
    const col = collection(db, 'tickets');
    return onSnapshot(col, (snapshot) => {
      const liveTickets: HelpTicket[] = [];
      snapshot.forEach((docSnap) => {
        const t = docSnap.data() as HelpTicket;
        if (t && t.id) liveTickets.push(t);
      });
      if (liveTickets.length > 0) {
        saveTicketsLocally(liveTickets);
        onUpdate(liveTickets);
      }
    }, (error) => {
      markFirestoreQuotaExhausted(error);
      console.warn('Firestore tickets snapshot error:', error);
    });
  } catch (e) {
    console.warn('Failed to subscribe to firestore tickets:', e);
    return () => {};
  }
};

/**
 * AI BOT KNOWLEDGE BASE PERSISTENCE (Firestore)
 */
export const syncKnowledgeToFirestore = async (item: KnowledgeItem): Promise<void> => {
  try {
    if (!db || !item.id || isFirestoreInQuotaCooldown()) return;
    const ref = doc(db, 'ai_knowledge', item.id);
    await setDoc(ref, sanitizeForFirestore(item), { merge: true });
  } catch (e) {
    markFirestoreQuotaExhausted(e);
    console.warn('Firestore syncKnowledge warning:', e);
  }
};

export const deleteKnowledgeFromFirestore = async (id: string): Promise<void> => {
  try {
    if (!db || !id || isFirestoreInQuotaCooldown()) return;
    await deleteDoc(doc(db, 'ai_knowledge', id));
  } catch (e) {
    markFirestoreQuotaExhausted(e);
    console.warn('Firestore deleteKnowledge warning:', e);
  }
};

export const subscribeToFirestoreKnowledge = (onUpdate: (items: KnowledgeItem[]) => void) => {
  try {
    if (!db || isFirestoreInQuotaCooldown()) return () => {};
    const col = collection(db, 'ai_knowledge');
    return onSnapshot(col, (snapshot) => {
      const liveItems: KnowledgeItem[] = [];
      snapshot.forEach((docSnap) => {
        const k = docSnap.data() as KnowledgeItem;
        if (k && k.id) liveItems.push(k);
      });
      if (liveItems.length > 0) {
        if (typeof window !== 'undefined') {
          void idbSet(STORAGE_KNOWLEDGE_KEY, liveItems);
          safeLocalStorageSet(STORAGE_KNOWLEDGE_KEY, JSON.stringify(liveItems), {
            maxBytes: 600_000,
          });
        }
        onUpdate(liveItems);
      }
    }, (error) => {
      markFirestoreQuotaExhausted(error);
      console.warn('Firestore knowledge snapshot error:', error);
    });
  } catch (e) {
    console.warn('Failed to subscribe to firestore knowledge:', e);
    return () => {};
  }
};

export const fetchKnowledgeFromFirestore = async (): Promise<KnowledgeItem[]> => {
  // 1. Prefer server API FIRST so visitors never burn Firestore read quota
  try {
    const res = await fetch('/api/ai/knowledge');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.knowledge) && data.knowledge.length > 0) {
        if (typeof window !== 'undefined') {
          void idbSet(STORAGE_KNOWLEDGE_KEY, data.knowledge);
          safeLocalStorageSet(STORAGE_KNOWLEDGE_KEY, JSON.stringify(data.knowledge), {
            maxBytes: 600_000,
          });
        }
        return data.knowledge;
      }
    }
  } catch {}

  // 2. Fallback to Firestore only if server failed and quota is not in cooldown
  try {
    if (db && !isFirestoreInQuotaCooldown()) {
      const col = collection(db, 'ai_knowledge');
      const snap = await getDocs(col);
      const items: KnowledgeItem[] = [];
      snap.forEach((d) => {
        const data = d.data() as KnowledgeItem;
        if (data && data.id) items.push(data);
      });
      if (items.length > 0) {
        if (typeof window !== 'undefined') {
          void idbSet(STORAGE_KNOWLEDGE_KEY, items);
          safeLocalStorageSet(STORAGE_KNOWLEDGE_KEY, JSON.stringify(items), {
            maxBytes: 600_000,
          });
        }
        return items;
      }
    }
  } catch (e) {
    markFirestoreQuotaExhausted(e);
    console.warn('Direct firestore knowledge read warning:', e);
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KNOWLEDGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
  }

  return INITIAL_KNOWLEDGE;
};

/**
 * AI BOT UNANSWERED QUESTIONS PERSISTENCE (Firestore)
 */
export const syncUnansweredToFirestore = async (item: { id: string; question: string; askedAt: string; status: string }): Promise<void> => {
  try {
    if (!db || !item.id) return;
    const ref = doc(db, 'ai_unanswered', item.id);
    await setDoc(ref, sanitizeForFirestore(item), { merge: true });
  } catch (e) {
    console.warn('Firestore syncUnanswered warning:', e);
  }
};

export const deleteUnansweredFromFirestore = async (id: string): Promise<void> => {
  try {
    if (!db || !id) return;
    await deleteDoc(doc(db, 'ai_unanswered', id));
  } catch (e) {
    console.warn('Firestore deleteUnanswered warning:', e);
  }
};

export const subscribeToFirestoreUnanswered = (onUpdate: (items: any[]) => void) => {
  try {
    if (!db) return () => {};
    const col = collection(db, 'ai_unanswered');
    return onSnapshot(col, (snapshot) => {
      const live: any[] = [];
      snapshot.forEach((docSnap) => {
        const u = docSnap.data();
        if (u && u.id) live.push(u);
      });
      if (typeof window !== 'undefined') {
        void idbSet(STORAGE_UNANSWERED_KEY, live);
        safeLocalStorageSet(STORAGE_UNANSWERED_KEY, JSON.stringify(live), {
          maxBytes: 400_000,
        });
      }
      onUpdate(live);
    }, (error) => {
      console.warn('Firestore unanswered snapshot error:', error);
    });
  } catch (e) {
    return () => {};
  }
};

/**
 * 15-QUESTION INTERVIEWS PERSISTENCE (Firestore)
 */
export const syncInterviewToFirestore = async (record: any): Promise<void> => {
  try {
    if (!db || !record.id) return;
    const ref = doc(db, 'interviews', record.id);
    await setDoc(ref, sanitizeForFirestore(record), { merge: true });
  } catch (e) {
    console.warn('Firestore syncInterview warning:', e);
  }
};

export const subscribeToFirestoreInterviews = (onUpdate: (records: any[]) => void) => {
  try {
    if (!db) return () => {};
    const col = collection(db, 'interviews');
    return onSnapshot(col, (snapshot) => {
      const live: any[] = [];
      snapshot.forEach((docSnap) => {
        const item = docSnap.data();
        if (item && item.id) live.push(item);
      });
      if (live.length > 0) {
        if (typeof window !== 'undefined') {
          void idbSet(STORAGE_INTERVIEWS_KEY, live);
          safeLocalStorageSet(STORAGE_INTERVIEWS_KEY, JSON.stringify(live), {
            maxBytes: 400_000,
          });
        }
        onUpdate(live);
      }
    }, (error) => {
      console.warn('Firestore interviews snapshot error:', error);
    });
  } catch (e) {
    return () => {};
  }
};


/**
 * Generate Custom Format User ID:
 * Format: IOIS + [Plan Price] + [Initials of Name & Surname] + [Member Counter per plan]
 * Example: For Rahul Kumar selecting ₹10 Plan: IOIS10RK01
 */
export const generateCustomIOISUserId = (
  fullName: string,
  planPrice: number,
  existingUsers: UserProfile[]
): string => {
  const cleanName = fullName.trim().toUpperCase().replace(/[^A-Z\s]/g, '');
  const parts = cleanName.split(/\s+/).filter(Boolean);
  
  let initials = "XX";
  if (parts.length >= 2) {
    initials = (parts[0][0] || 'X') + (parts[parts.length - 1][0] || 'X');
  } else if (parts.length === 1 && parts[0].length >= 2) {
    initials = parts[0].substring(0, 2);
  } else if (parts.length === 1) {
    initials = parts[0][0] + "X";
  }

  const samePlanUsers = existingUsers.filter((u) => {
    const plan = PLANS.find((p) => p.id === u.selectedPlanId);
    return plan && plan.price === planPrice;
  });

  const nextCounter = samePlanUsers.length + 1;
  const counterStr = nextCounter < 10 ? `0${nextCounter}` : `${nextCounter}`;

  let finalId = `IOIS${planPrice}${initials}${counterStr}`;
  let counter = nextCounter;
  while (existingUsers.some((u) => u.userId.toUpperCase() === finalId.toUpperCase())) {
    counter++;
    const pad = counter < 10 ? `0${counter}` : `${counter}`;
    finalId = `IOIS${planPrice}${initials}${pad}`;
  }

  return finalId;
};

const hydrateUsersFromIdb = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (idbHydrationPromise) return idbHydrationPromise;

  idbHydrationPromise = (async () => {
    try {
      const [idbUsers, vaultUsers, archivedUsers, idbCur, idbTix] = await Promise.all([
        idbGet<UserProfile[]>(STORAGE_USERS_KEY),
        idbGet<UserProfile[]>(STORAGE_USERS_VAULT_KEY),
        idbGet<UserProfile[]>(STORAGE_ARCHIVE_VAULT_KEY),
        idbGet<UserProfile>(STORAGE_CURRENT_USER_KEY),
        idbGet<HelpTicket[]>(STORAGE_TICKETS_KEY),
      ]);

      if (Array.isArray(archivedUsers) && archivedUsers.length > 0) {
        memoryArchivedUsers = archivedUsers;
      }
      const archivedIds = new Set(
        memoryArchivedUsers.map((u) => u?.userId?.trim().toUpperCase()).filter(Boolean)
      );

      const combinedIdb = mergeUserLists(
        Array.isArray(vaultUsers) ? vaultUsers : [],
        Array.isArray(idbUsers) ? idbUsers : []
      ).filter(
        (u: UserProfile) =>
          u &&
          u.userId &&
          !u.isArchived &&
          !archivedIds.has(u.userId.trim().toUpperCase()) &&
          !DEMO_USER_IDS.includes(u.userId.trim().toUpperCase())
      );

      if (combinedIdb.length > 0) {
        memoryUsers = mergeUserLists(combinedIdb, memoryUsers || [], INITIAL_DEMO_USERS);
      }

      if (idbCur && idbCur.userId) {
        if (!memoryCurrentUser) {
          memoryCurrentUser = idbCur;
        } else if (memoryCurrentUser.userId?.toUpperCase() === idbCur.userId.toUpperCase()) {
          memoryCurrentUser = {
            ...idbCur,
            ...memoryCurrentUser,
            photoUrl: memoryCurrentUser.photoUrl || idbCur.photoUrl,
            paymentScreenshotUrl: memoryCurrentUser.paymentScreenshotUrl || idbCur.paymentScreenshotUrl,
          };
        }
      }

      if (Array.isArray(idbTix) && idbTix.length > 0 && !memoryTickets) {
        memoryTickets = idbTix;
      }
    } catch {
      // Non-fatal IndexedDB hydration fallback
    }
  })();

  return idbHydrationPromise;
};

if (typeof window !== 'undefined') {
  void hydrateUsersFromIdb();
}

export const getAllUsers = (): UserProfile[] => {
  if (typeof window === 'undefined') return INITIAL_DEMO_USERS;
  if (memoryUsers !== null) {
    return memoryUsers;
  }
  try {
    const raw = safeLocalStorageGet(STORAGE_USERS_KEY);
    if (!raw) {
      return INITIAL_DEMO_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const cleanUsers = parsed.filter(
        (u: UserProfile) => u && u.userId && !DEMO_USER_IDS.includes(u.userId.trim().toUpperCase())
      );
      memoryUsers = cleanUsers;
      return cleanUsers;
    }
    return INITIAL_DEMO_USERS;
  } catch {
    return INITIAL_DEMO_USERS;
  }
};

export const OFFICIAL_ROOT_SPONSOR_ID = 'IOIS999VK01';
export const OFFICIAL_ROOT_SPONSOR_NAME = 'Vikas Kumar (Master Founder & Root Sponsor)';

export const OFFICIAL_ROOT_SPONSOR_USER: UserProfile = {
  userId: OFFICIAL_ROOT_SPONSOR_ID,
  fullName: 'Vikas Kumar',
  mobileNumber: '8877490845',
  email: 'newuserhelpline@gmail.com',
  selectedPlanId: 7,
  role: 'Founder & Master Sponsor',
  password: '',
  paymentStatus: 'approved',
  createdAt: '2026-01-01T00:00:00.000Z',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  payoutUpi: '8877490845@spicepay',
  state: 'बिहार (IN)',
  address: 'Patna, Bihar, India',
  telegramUsername: 'NEWUSERHELPLINE',
};

// Legacy / ACC India Partner Sponsor Link Support (SWACCDK01)
export const ACC_LEGACY_SPONSOR_ID = 'SWACCDK01';
export const ACC_LEGACY_SPONSOR_NAME = 'D. Kumar (ACC India Senior Partner Sponsor)';

export const ACC_LEGACY_SPONSOR_USER: UserProfile = {
  userId: ACC_LEGACY_SPONSOR_ID,
  fullName: 'D. Kumar',
  mobileNumber: '8877490845',
  email: 'newuserhelpline@gmail.com',
  selectedPlanId: 7,
  role: 'Senior Verified Sponsor',
  password: '',
  paymentStatus: 'approved',
  createdAt: '2026-01-01T00:00:00.000Z',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  payoutUpi: '8877490845@spicepay',
  state: 'बिहार (IN)',
  address: 'Patna, Bihar, India',
  telegramUsername: 'NEWUSERHELPLINE',
};

export const findUserById = (userId?: string | null): UserProfile | undefined => {
  if (!userId) return undefined;
  const cleanId = userId.trim().toUpperCase();
  const cleanLower = userId.trim().toLowerCase().replace(/^@/, '');
  if (cleanId === OFFICIAL_ROOT_SPONSOR_ID || cleanLower === 'vikaskumar' || cleanLower === 'vikas01') {
    return OFFICIAL_ROOT_SPONSOR_USER;
  }
  if (cleanId === ACC_LEGACY_SPONSOR_ID) {
    return ACC_LEGACY_SPONSOR_USER;
  }
  const all = getAllUsers();
  return all.find((u) => {
    if (!u) return false;
    const uidMatch = u.userId?.trim().toUpperCase() === cleanId;
    const unameMatch = u.username && u.username.trim().toLowerCase().replace(/^@/, '') === cleanLower;
    return uidMatch || unameMatch;
  });
};

export const getSponsorUserAsync = async (sponsorId?: string | null): Promise<UserProfile | null> => {
  if (!sponsorId || !sponsorId.trim()) return null;
  const cleanId = sponsorId.trim().toUpperCase();
  const cleanLower = sponsorId.trim().toLowerCase().replace(/^@/, '');
  if (cleanId === OFFICIAL_ROOT_SPONSOR_ID || cleanLower === 'vikaskumar' || cleanLower === 'vikas01') {
    return OFFICIAL_ROOT_SPONSOR_USER;
  }
  if (cleanId === ACC_LEGACY_SPONSOR_ID) {
    return ACC_LEGACY_SPONSOR_USER;
  }
  const localMatch = findUserById(cleanId);
  if (localMatch) return localMatch;

  if (db && !isFirestoreInQuotaCooldown()) {
    try {
      const snap = await getDoc(doc(db, 'users', cleanId));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (e) {
      markFirestoreQuotaExhausted(e);
    }
  }

  try {
    const res = await fetch(`/api/users/profile/${encodeURIComponent(cleanId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.userId) return data;
    }
  } catch {}

  // If searched by username, also query server validate-sponsor
  try {
    const res = await fetch(`/api/users/validate-sponsor?sponsorId=${encodeURIComponent(sponsorId.trim())}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.isValid && data.sponsorId) {
        const resolved = findUserById(data.sponsorId);
        if (resolved) return resolved;
      }
    }
  } catch {}

  return null;
};

export const saveUsers = (users: UserProfile[], options?: { allowShrink?: boolean }): void => {
  if (typeof window === 'undefined') return;

  const archivedIds = new Set(
    memoryArchivedUsers.map((u) => u?.userId?.trim().toUpperCase()).filter(Boolean)
  );

  const incomingClean = Array.isArray(users)
    ? users.filter(
        (u) =>
          u &&
          u.userId &&
          !u.isArchived &&
          !archivedIds.has(u.userId.trim().toUpperCase()) &&
          !DEMO_USER_IDS.includes(u.userId.trim().toUpperCase())
      )
    : [];

  // ANTI-WIPE GUARD: Never drop existing members in memory unless explicitly requested via allowShrink
  const cleanUsers =
    !options?.allowShrink && memoryUsers && memoryUsers.length > 0
      ? mergeUserLists(memoryUsers, incomingClean).filter(
          (u) => !u.isArchived && !archivedIds.has(u.userId.trim().toUpperCase())
        )
      : incomingClean;

  // 1. Always preserve full user records (including photos & screenshots) in memory + dual IndexedDB vaults
  memoryUsers = cleanUsers;
  void idbSet(STORAGE_USERS_KEY, cleanUsers);
  void idbSet(STORAGE_USERS_VAULT_KEY, cleanUsers);

  // 2. Write a quota-safe snapshot to localStorage (never wipe member list on overflow)
  try {
    const fullSerialized = JSON.stringify(cleanUsers);
    if (fullSerialized.length <= 900_000) {
      if (safeLocalStorageSet(STORAGE_USERS_KEY, fullSerialized, { evictKeysOnQuota: BULKY_EVICT_KEYS })) {
        return;
      }
    }

    // Fallback 1: strip large inline data URLs in localStorage ONLY (memoryUsers & IndexedDB retain full photos)
    const compactUsers = cleanUsers.map((u) => stripOversizedDataUrls(u, 4096));
    const compactSerialized = JSON.stringify(compactUsers);
    if (compactSerialized.length <= 900_000) {
      if (safeLocalStorageSet(STORAGE_USERS_KEY, compactSerialized, { evictKeysOnQuota: BULKY_EVICT_KEYS })) {
        return;
      }
    }

    // Fallback 2: keep full member metadata in localStorage (all core member fields, zero photos)
    const metaUsers = cleanUsers.map((u) => ({
      userId: u.userId,
      username: u.username,
      fullName: u.fullName,
      mobileNumber: u.mobileNumber,
      email: u.email,
      sponsorId: u.sponsorId,
      selectedPlanId: u.selectedPlanId,
      paymentUtr: u.paymentUtr,
      payoutUpi: u.payoutUpi,
      paymentStatus: u.paymentStatus,
      createdAt: u.createdAt,
      verifiedAt: u.verifiedAt,
      role: u.role,
      address: u.address,
      state: u.state,
      district: u.district,
    }));
    safeLocalStorageSet(STORAGE_USERS_KEY, JSON.stringify(metaUsers), {
      evictKeysOnQuota: BULKY_EVICT_KEYS,
    });
  } catch {
    // Non-fatal: IndexedDB vault still holds 100% complete user records
  }
};

/**
 * Strict Full Name Validator:
 * - Minimum 3 characters, max 60.
 * - Must be authentic name characters (Hindi/Devanagari, English letters, spaces, dot, apostrophe).
 * - Reject numbers, symbols, random keyboard smash.
 */
export const validateFullName = (name?: string): { isValid: boolean; cleanName: string; error?: string } => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, cleanName: '', error: 'पूरा नाम दर्ज करना अनिवार्य है।' };
  }
  const clean = name.trim().replace(/\s+/g, ' ');
  if (clean.length < 3) {
    return { isValid: false, cleanName: clean, error: 'पूरा नाम कम से कम 3 अक्षरों का होना चाहिए।' };
  }
  if (clean.length > 60) {
    return { isValid: false, cleanName: clean, error: 'नाम 60 अक्षरों से अधिक नहीं हो सकता।' };
  }
  // Allow Unicode Devanagari (\u0900-\u097F) and Latin letters, spaces, dots, and hyphens/apostrophes
  const validNameRegex = /^[\u0900-\u097Fa-zA-Z\s\.\'\-]+$/;
  if (!validNameRegex.test(clean)) {
    return { 
      isValid: false, 
      cleanName: clean, 
      error: 'कृपया केवल वैध अक्षरों वाला वास्तविक नाम दर्ज करें (संख्याएं या विशेष प्रतीक स्वीकार्य नहीं हैं)।' 
    };
  }
  // Disallow repetitive single character spam like 'aaaa', 'xxxx'
  if (/^(.)\1{3,}$/i.test(clean.replace(/\s/g, ''))) {
    return {
      isValid: false,
      cleanName: clean,
      error: 'अमान्य नाम! कृपया अपना वास्तविक पूरा नाम दर्ज करें।'
    };
  }

  return { isValid: true, cleanName: clean };
};

/**
 * Strict Mobile Number Validator:
 * - Exactly 10 digits.
 * - Must start with 6, 7, 8, or 9 (Indian Mobile Standard).
 * - Reject repetitive dummy numbers: 0000000000, 1111111111, 9999999999, etc.
 * - Reject sequential dummy numbers: 1234567890, 9876543210, etc.
 */
export const validateMobileNumber = (mobile?: string): { isValid: boolean; cleanDigits: string; error?: string } => {
  if (!mobile || typeof mobile !== 'string') {
    return { isValid: false, cleanDigits: '', error: 'मोबाइल नंबर दर्ज करना अनिवार्य है।' };
  }
  const cleanDigits = mobile.replace(/\D/g, '');
  if (cleanDigits.length !== 10) {
    return { 
      isValid: false, 
      cleanDigits, 
      error: 'मोबाइल नंबर ठीक 10 अंकों का होना चाहिए (बिना +91 या 0 लगाए)।' 
    };
  }
  if (!/^[6-9]\d{9}$/.test(cleanDigits)) {
    return { 
      isValid: false, 
      cleanDigits, 
      error: 'कृपया 6, 7, 8 या 9 से शुरू होने वाला 10-अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें।' 
    };
  }

  // Reject repetitive numbers: 0000000000, 1111111111, etc.
  if (/^(\d)\1{9}$/.test(cleanDigits)) {
    return { 
      isValid: false, 
      cleanDigits, 
      error: 'अमान्य मोबाइल नंबर! एक ही अंक बार-बार दर्ज किया गया फर्जी या रैंडम नंबर स्वीकार्य नहीं है।' 
    };
  }

  // Reject sequential fake patterns
  const sequentialPatterns = [
    '1234567890', '0123456789', '9876543210', '0987654321',
    '2345678901', '8765432109'
  ];
  if (sequentialPatterns.includes(cleanDigits)) {
    return { 
      isValid: false, 
      cleanDigits, 
      error: 'अमान्य मोबाइल नंबर! क्रमिक (Sequential) फर्जी नंबर स्वीकार्य नहीं है। कृपया अपना असली नंबर दर्ज करें।' 
    };
  }

  return { isValid: true, cleanDigits };
};

/**
 * Strict Email Address Validator:
 * - Valid RFC email syntax with valid domain extension (min 2 chars).
 * - Reject fake random patterns like test@test, abc@xyz, asdf@asdf.
 */
export const validateEmailAddress = (email?: string): { isValid: boolean; cleanEmail: string; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, cleanEmail: '', error: 'ईमेल आईडी दर्ज करना अनिवार्य है।' };
  }
  const clean = email.trim().toLowerCase();
  if (clean.length < 5 || clean.length > 100) {
    return { isValid: false, cleanEmail: clean, error: 'कृपया एक वैध ईमेल आईडी दर्ज करें।' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
  if (!emailRegex.test(clean)) {
    return { 
      isValid: false, 
      cleanEmail: clean, 
      error: 'कृपया सही फॉर्मेट वाली वैध ईमेल आईडी दर्ज करें (उदा. yourname@gmail.com)।' 
    };
  }

  // Reject fake domains and placeholder test emails
  const [userPart, domainPart] = clean.split('@');
  if (!domainPart || !domainPart.includes('.')) {
    return { isValid: false, cleanEmail: clean, error: 'ईमेल का डोमेन अमान्य है।' };
  }

  const fakePatterns = ['test@test.com', 'abc@xyz.com', 'asdf@asdf.com', 'fake@fake.com', 'dummy@dummy.com'];
  if (fakePatterns.includes(clean)) {
    return { 
      isValid: false, 
      cleanEmail: clean, 
      error: 'फर्जी या डमी ईमेल आईडी स्वीकार्य नहीं है। कृपया अपनी वास्तविक सक्रिय ईमेल दर्ज करें।' 
    };
  }

  // Reject all same character user
  if (/^(\w)\1{4,}$/.test(userPart)) {
    return { isValid: false, cleanEmail: clean, error: 'अमान्य ईमेल आईडी! कृपया अपनी वास्तविक ईमेल दर्ज करें।' };
  }

  return { isValid: true, cleanEmail: clean };
};

/**
 * Strict Sponsor ID Verification:
 * Checks whether the sponsor ID actually exists in:
 * 1. Master Root Sponsor: IOIS999VK01 (Vikas Kumar)
 * 2. Local registered user cache
 * 3. Cloud Firestore users collection
 * 4. Server API (/api/users/validate-sponsor)
 * 
 * UNDER NO CIRCUMSTANCES will a random or non-existent Sponsor ID be allowed.
 */
export const validateSponsorIdAsync = async (
  sponsorId?: string,
  localUsers?: UserProfile[]
): Promise<{ isValid: boolean; sponsorName?: string; sponsorId?: string; error?: string }> => {
  if (!sponsorId || typeof sponsorId !== 'string' || !sponsorId.trim()) {
    return {
      isValid: false,
      error: 'स्पॉन्सर ID दर्ज करना अनिवार्य है। यदि आपके पास कोई स्पॉन्सर नहीं है तो आधिकारिक डिफ़ॉल्ट ID "IOIS999VK01" का उपयोग करें।',
    };
  }

  const clean = sponsorId.trim().toUpperCase();
  const cleanLower = sponsorId.trim().toLowerCase().replace(/^@/, '');

  // 1. Root Master Sponsor Check
  if (clean === OFFICIAL_ROOT_SPONSOR_ID || cleanLower === 'vikaskumar' || cleanLower === 'vikas01') {
    return {
      isValid: true,
      sponsorId: OFFICIAL_ROOT_SPONSOR_ID,
      sponsorName: OFFICIAL_ROOT_SPONSOR_NAME,
    };
  }
  if (clean === ACC_LEGACY_SPONSOR_ID) {
    return {
      isValid: true,
      sponsorId: ACC_LEGACY_SPONSOR_ID,
      sponsorName: ACC_LEGACY_SPONSOR_NAME,
    };
  }

  // 2. Local Users Cache Check (By User ID or Username)
  const users = localUsers || getAllUsers();
  const localMatch = users.find((u) => {
    if (!u) return false;
    const uidMatch = u.userId && u.userId.trim().toUpperCase() === clean;
    const unameMatch = u.username && u.username.trim().toLowerCase().replace(/^@/, '') === cleanLower;
    return uidMatch || unameMatch;
  });
  if (localMatch) {
    return {
      isValid: true,
      sponsorId: localMatch.userId,
      sponsorName: localMatch.fullName || 'सत्यापित सदस्य',
    };
  }

  // 3. Firestore Cloud Check (Direct document lookup)
  if (db) {
    try {
      const docRef = doc(db, 'users', clean);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        return {
          isValid: true,
          sponsorId: data.userId || clean,
          sponsorName: data.fullName || 'सत्यापित सदस्य',
        };
      }
    } catch (e) {
      console.warn('Firestore sponsor check note:', e);
    }
  }

  // 4. Server API Check
  try {
    const res = await fetch(`/api/users/validate-sponsor?sponsorId=${encodeURIComponent(clean)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.isValid) {
        return {
          isValid: true,
          sponsorId: data.sponsorId || clean,
          sponsorName: data.sponsorName || 'सत्यापित सदस्य',
        };
      }
    }
  } catch (e) {
    console.warn('Server sponsor check note:', e);
  }

  // 5. If not found in any source -> Strictly Invalid Random Sponsor ID!
  return {
    isValid: false,
    error: `अमान्य स्पॉन्सर ID "${clean}"! यह स्पॉन्सर सिस्टम में मौजूद नहीं है। कोई भी रैंडम स्पॉन्सर ID स्वीकार्य नहीं है। कृपया सही स्पॉन्सर ID दर्ज करें या डिफ़ॉल्ट "${OFFICIAL_ROOT_SPONSOR_ID}" का उपयोग करें।`,
  };
};

export const maskMobile = (mob?: string): string => {
  if (!mob) return '';
  const digits = mob.replace(/\D/g, '');
  if (digits.length < 4) return '******';
  const last4 = digits.slice(-4);
  return `+91 ******${last4}`;
};

export const maskEmail = (email?: string): string => {
  if (!email || !email.includes('@')) return '';
  const [user, domain] = email.split('@');
  const visible = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
  const [domainName, ...domainExt] = (domain || '').split('.');
  const maskedDom = domainName && domainName.length > 2 ? `${domainName[0]}***${domainName[domainName.length - 1]}` : `${domainName || '***'}`;
  return `${visible}@${maskedDom}.${domainExt.join('.')}`;
};

export const maskName = (name?: string): string => {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((w) => (w.length > 1 ? `${w[0]}${'*'.repeat(Math.min(w.length - 1, 4))}` : w))
    .join(' ');
};

export const maskUpi = (upi?: string): string => {
  if (!upi || !upi.includes('@')) return '';
  const [handle, bank] = upi.split('@');
  const visible = handle.length > 3 ? `${handle.slice(0, 2)}****${handle.slice(-2)}` : `${handle[0] || '*'}***`;
  return `${visible}@${bank || 'upi'}`;
};

export interface DuplicateCheckResult {
  exists: boolean;
  matchedBy?: 'mobile' | 'email' | 'both';
  maskedMobile?: string;
  maskedEmail?: string;
  error?: string;
}

export interface IdentityVerificationParams {
  identifier: string;
  fullName: string;
  email: string;
  address?: string;
  sponsorId?: string;
}

export interface IdentityVerificationResult {
  success: boolean;
  verificationToken?: string;
  userId?: string;
  maskedName?: string;
  maskedMobile?: string;
  message?: string;
  error?: string;
}

/**
 * Checks if a mobile number or email is already registered across local cache, Firestore, or server.
 * Strictly returns MASKED details only to protect privacy and prevent reconnaissance.
 */
export const checkUserAlreadyExists = async (
  mobile?: string,
  email?: string,
  excludeUserId?: string
): Promise<DuplicateCheckResult> => {
  const cleanMobile = (mobile || '').trim();
  const mobileDigits = cleanMobile.replace(/\D/g, '');
  const cleanEmail = (email || '').trim().toLowerCase();

  // 1. Check local users first
  const localUsers = getAllUsers();
  for (const u of localUsers) {
    if (!u || !u.userId) continue;
    if (excludeUserId && u.userId.toUpperCase() === excludeUserId.toUpperCase()) continue;

    const uDigits = (u.mobileNumber || '').replace(/\D/g, '');
    const mobileMatch = mobileDigits.length >= 10 && uDigits.endsWith(mobileDigits.slice(-10));
    const emailMatch = cleanEmail.length > 3 && u.email && u.email.trim().toLowerCase() === cleanEmail;

    if (mobileMatch || emailMatch) {
      return {
        exists: true,
        matchedBy: mobileMatch && emailMatch ? 'both' : mobileMatch ? 'mobile' : 'email',
        maskedMobile: maskMobile(u.mobileNumber),
        maskedEmail: maskEmail(u.email),
      };
    }
  }

  // 2. Check Server API with fast 1500ms timeout
  try {
    const params = new URLSearchParams();
    if (mobileDigits.length >= 10) params.append('mobile', mobileDigits);
    if (cleanEmail.length > 3) params.append('email', cleanEmail);
    if (excludeUserId) params.append('excludeUserId', excludeUserId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`/api/users/check-duplicate?${params.toString()}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.exists) {
        return {
          exists: true,
          matchedBy: data.matchedBy || 'mobile',
          maskedMobile: data.maskedMobile,
          maskedEmail: data.maskedEmail,
        };
      }
    }
  } catch {
    // ignore network err
  }

  // 3. Fast Targeted Firestore query (only when not in quota cooldown)
  if (db && !isFirestoreInQuotaCooldown() && (mobileDigits.length >= 10 || cleanEmail.length > 3)) {
    try {
      const col = collection(db, 'users');
      const timeoutPromise = new Promise<DuplicateCheckResult>((resolve) => setTimeout(() => resolve({ exists: false }), 1800));
      const queryPromise = (async (): Promise<DuplicateCheckResult> => {
        if (mobileDigits.length >= 10) {
          const q = query(col, where('mobileNumber', '==', mobileDigits.slice(-10)), limit(1));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const u = snap.docs[0].data() as UserProfile;
            return {
              exists: true,
              matchedBy: 'mobile',
              maskedMobile: maskMobile(u.mobileNumber),
              maskedEmail: maskEmail(u.email),
            };
          }
        }
        return { exists: false };
      })();

      const fastResult = await Promise.race([queryPromise, timeoutPromise]);
      if (fastResult.exists) return fastResult;
    } catch (e) {
      markFirestoreQuotaExhausted(e);
    }
  }

  return { exists: false };
};

/**
 * Multi-point real identity verification without OTP or external links
 */
export const verifyUserIdentityAsync = async (
  params: IdentityVerificationParams
): Promise<IdentityVerificationResult> => {
  const { identifier, fullName, email, address, sponsorId } = params;
  if (!identifier?.trim() || !fullName?.trim() || !email?.trim()) {
    return {
      success: false,
      error: 'User ID या मोबाइल, पूरा नाम और पंजीकृत ईमेल तीनों विवरण दर्ज करना अनिवार्य है।',
    };
  }

  try {
    const res = await fetch('/api/users/verify-identity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, fullName, email, address, sponsorId }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        verificationToken: data.verificationToken,
        userId: data.userId,
        maskedName: data.maskedName,
        maskedMobile: data.maskedMobile,
        message: data.message,
      };
    } else if (res.status === 401 || res.status === 404 || res.status === 400) {
      return {
        success: false,
        error: data.error || 'पहचान सत्यापन असफल: दर्ज किया गया नाम, ईमेल या विवरण इस खाते के रिकॉर्ड से मेल नहीं खाता।',
      };
    }
  } catch (e) {
    // offline / fallback to local storage
  }

  // Local fallback verification
  const cleanInput = identifier.trim().toLowerCase();
  const inputDigits = cleanInput.replace(/\D/g, '');
  const cleanName = fullName.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();
  const cleanAddress = (address || '').trim().toLowerCase();
  const cleanSponsor = (sponsorId || '').trim().toLowerCase();

  const users = getAllUsers();
  const user = users.find((u) => {
    if (!u) return false;
    const uidMatch = (u.userId || '').toLowerCase() === cleanInput;
    const uDigits = (u.mobileNumber || '').replace(/\D/g, '');
    const mobMatch = inputDigits.length >= 10 && uDigits.endsWith(inputDigits.slice(-10));
    return uidMatch || mobMatch;
  });

  if (!user) {
    return {
      success: false,
      error: 'पहचान सत्यापन असफल: इस User ID या मोबाइल नंबर से कोई पंजीकृत सदस्य खाता नहीं मिला।',
    };
  }

  const uName = (user.fullName || '').trim().toLowerCase();
  const uEmail = (user.email || '').trim().toLowerCase();
  const uAddress = (user.address || '').trim().toLowerCase();
  const uSponsor = (user.sponsorId || '').trim().toLowerCase();

  const nameMatch = uName === cleanName || uName.includes(cleanName) || cleanName.includes(uName);
  const emailMatch = uEmail === cleanEmail;
  const addressMatch = !cleanAddress || !uAddress || uAddress.includes(cleanAddress) || cleanAddress.includes(uAddress);
  const sponsorMatch = !cleanSponsor || !uSponsor || uSponsor === cleanSponsor;

  if (!nameMatch || !emailMatch || !addressMatch || !sponsorMatch) {
    return {
      success: false,
      error: 'पहचान सत्यापन असफल: दर्ज किया गया नाम, ईमेल या पता इस खाते के आधिकारिक रिकॉर्ड से मेल नहीं खाता। अनधिकृत पासवर्ड बदलाव रोकने हेतु अनुमति नहीं दी गई।',
    };
  }

  const localToken = `local_rst_${Date.now()}_${Date.now().toString(36)}`;
  return {
    success: true,
    verificationToken: localToken,
    userId: user.userId,
    maskedName: maskName(user.fullName),
    maskedMobile: maskMobile(user.mobileNumber),
    message: 'पहचान सत्यापन सफल! अब आप नया सुरक्षित पासवर्ड सेट कर सकते हैं।',
  };
};

/**
 * Resets password ONLY after identity verification has succeeded
 */
export const resetPasswordWithTokenAsync = async (
  userId: string,
  verificationToken: string,
  newPassword: string,
  confirmPassword?: string,
  fallbackIdentity?: { fullName: string; email: string }
): Promise<{ success: boolean; message?: string; error?: string }> => {
  if (!userId || !newPassword) {
    return { success: false, error: 'User ID और नया पासवर्ड अनिवार्य हैं।' };
  }
  if (newPassword.length < 4) {
    return { success: false, error: 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' };
  }
  if (confirmPassword && newPassword !== confirmPassword) {
    return { success: false, error: 'पासवर्ड और कन्फर्म पासवर्ड आपस में मेल नहीं खाते।' };
  }

  try {
    const res = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, verificationToken, newPassword, confirmPassword, fallbackIdentity }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      // Also update local cache for smooth offline and seamless login
      const users = getAllUsers();
      const idx = users.findIndex((u) => u.userId.toUpperCase() === userId.toUpperCase());
      if (idx !== -1) {
        users[idx].password = newPassword;
        saveUsers(users);
      }
      return { success: true, message: data.message || 'पासवर्ड सफलतापूर्वक बदल दिया गया है!' };
    } else if (res.status === 403 || res.status === 401 || res.status === 400 || res.status === 404) {
      return { success: false, error: data.error || 'सत्यापन अमान्य है।' };
    }
  } catch (e) {
    // server unreachable fallback
  }

  // Local fallback
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.userId.toUpperCase() === userId.toUpperCase());
  if (idx === -1) {
    return { success: false, error: 'उपयोगकर्ता खाता नहीं मिला।' };
  }

  users[idx].password = newPassword;
  saveUsers(users);
  return {
    success: true,
    message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।',
  };
};

/**
 * Secure recovery of User ID: requires BOTH matching mobile AND email
 */
export const secureRecoverUserIdAsync = async (
  mobile: string,
  email: string,
  fullName?: string
): Promise<{ success: boolean; userId?: string; maskedName?: string; error?: string }> => {
  if (!mobile?.trim() || !email?.trim()) {
    return {
      success: false,
      error: 'सुरक्षा कारणों से User ID प्राप्त करने के लिए पंजीकृत मोबाइल नंबर और ईमेल दोनों अनिवार्य हैं।',
    };
  }

  try {
    const res = await fetch('/api/users/recover-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, email, fullName }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        userId: data.userId,
        maskedName: data.maskedName,
      };
    } else {
      return {
        success: false,
        error: data.error || 'इस मोबाइल नंबर और ईमेल से कोई खाता नहीं मिला।',
      };
    }
  } catch (e) {
    // Local fallback
  }

  const cleanDigits = mobile.replace(/\D/g, '');
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = (fullName || '').trim().toLowerCase();
  const users = getAllUsers();

  const user = users.find((u) => {
    if (!u) return false;
    const uDigits = (u.mobileNumber || '').replace(/\D/g, '');
    const mobMatch = cleanDigits.length >= 10 && uDigits.endsWith(cleanDigits.slice(-10));
    const emailMatch = u.email && u.email.trim().toLowerCase() === cleanEmail;
    const nameMatch = !cleanName || (u.fullName || '').trim().toLowerCase().includes(cleanName);
    return mobMatch && emailMatch && nameMatch;
  });

  if (!user) {
    return {
      success: false,
      error: 'दर्ज किया गया मोबाइल नंबर और ईमेल किसी पंजीकृत खाते से मेल नहीं खाते।',
    };
  }

  return {
    success: true,
    userId: user.userId,
    maskedName: maskName(user.fullName),
  };
};

/**
 * Helper to detect if any merged user has richer non-empty details or missing IDs vs server copy
 */
const serverNeedsSelfHealSync = (merged: UserProfile[], serverUsers: UserProfile[]): boolean => {
  if (merged.length > serverUsers.length) return true;
  const serverMap = new Map<string, UserProfile>();
  for (const su of serverUsers) {
    if (su?.userId) serverMap.set(su.userId.trim().toUpperCase(), su);
  }
  for (const m of merged) {
    const key = m.userId?.trim().toUpperCase();
    if (!key) continue;
    const s = serverMap.get(key);
    if (!s) return true;
    if (!s.mobileNumber && m.mobileNumber) return true;
    if (!s.paymentUtr && m.paymentUtr) return true;
    if (!s.payoutUpi && m.payoutUpi) return true;
    if (!s.registrationFormData && m.registrationFormData) return true;
    if (m.paymentStatus === 'approved' && s.paymentStatus !== 'approved') return true;
  }
  return false;
};

/**
 * Fetch all users from Server + Firestore (quota-aware) + IndexedDB Vault and merge without data loss
 * Includes bidirectional auto-heal sync so neither live server nor browser loses member records.
 */
export const fetchUsersFromServer = async (
  options?: { skipFirestore?: boolean; forceCloud?: boolean }
): Promise<UserProfile[]> => {
  await hydrateUsersFromIdb();
  const localUsers = getAllUsers();
  const firestoreUsers: UserProfile[] = [];
  let serverUsers: UserProfile[] = [];
  let firestoreSucceededCleanly = false;

  // 1. FAST PATH: Fetch from backend server with 5000ms timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('/api/users', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.users)) {
        serverUsers = data.users;
      }
    }
  } catch (err) {
    console.warn('Server users fetch note, falling back to local/cloud cache:', err);
  }

  // 2. Quota-protected Firestore read (skipped during polling or 3-min cache window unless forced/sparse server)
  const shouldQueryFirestore =
    Boolean(db) &&
    !options?.skipFirestore &&
    !isFirestoreInQuotaCooldown() &&
    (options?.forceCloud ||
      serverUsers.length <= 1 ||
      Date.now() - lastClientFirestoreFetchAt > 180_000);

  if (shouldQueryFirestore && db) {
    try {
      const col = collection(db, 'users');
      let timedOut = false;
      const timeoutPromise = new Promise<void>((resolve) =>
        setTimeout(() => {
          timedOut = true;
          resolve();
        }, 6000)
      );
      const fetchPromise = (async () => {
        const snap = await getDocs(col);
        snap.forEach((d) => {
          const u = d.data() as UserProfile;
          if (u && u.userId) firestoreUsers.push(u);
        });
        lastClientFirestoreFetchAt = Date.now();
        firestoreSucceededCleanly = true;
      })();
      await Promise.race([fetchPromise, timeoutPromise]);
      if (timedOut) {
        console.warn('Firestore fetch timeout after 6000ms');
      }
    } catch (e) {
      markFirestoreQuotaExhausted(e);
      console.warn('Firestore background users sync note:', e);
    }
  }

  // Respect explicit archive markers if any came back from Firestore
  const firestoreArchived = firestoreUsers.filter((u) => u.isArchived);
  if (firestoreArchived.length > 0) {
    const nextArchMap = new Map<string, UserProfile>();
    for (const a of [...memoryArchivedUsers, ...firestoreArchived]) {
      if (a?.userId) nextArchMap.set(a.userId.trim().toUpperCase(), a);
    }
    memoryArchivedUsers = Array.from(nextArchMap.values());
    void idbSet(STORAGE_ARCHIVE_VAULT_KEY, memoryArchivedUsers);
  }
  const archivedIds = new Set(
    memoryArchivedUsers.map((u) => u?.userId?.trim().toUpperCase()).filter(Boolean)
  );

  // Merge non-destructively (local -> server -> firestore so non-empty fields accumulate)
  const allMerged = mergeUserLists(
    localUsers,
    serverUsers,
    firestoreUsers.filter((u) => !u.isArchived),
    INITIAL_DEMO_USERS
  ).filter((u) => !archivedIds.has(u.userId.trim().toUpperCase()));

  saveUsers(allMerged);

  // 3. Bidirectional Auto-Heal: Push client/cloud records back up to server disk if server was missing anything
  if (allMerged.length > 0 && serverNeedsSelfHealSync(allMerged, serverUsers)) {
    fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: allMerged }),
    }).catch(() => {});
  }

  // 4. Backfill any server/local users missing in Firestore (only if Firestore read succeeded cleanly)
  if (firestoreSucceededCleanly && !isFirestoreInQuotaCooldown()) {
    const fsIds = new Set(firestoreUsers.map((u) => u.userId?.trim().toUpperCase()));
    const missingInCloud = allMerged.filter((u) => !fsIds.has(u.userId?.trim().toUpperCase()));
    for (const m of missingInCloud.slice(0, 15)) {
      void syncUserToFirestore(m);
    }
  }

  return allMerged;
};

export const registerNewUserAsync = async (
  data: Omit<UserProfile, 'userId' | 'paymentStatus' | 'createdAt'>
): Promise<UserProfile> => {
  await hydrateUsersFromIdb();

  // 1. Strict Full Name Validation (No random characters or numbers)
  const nameCheck = validateFullName(data.fullName);
  if (!nameCheck.isValid) {
    throw new Error(nameCheck.error || 'कृपया अपना वास्तविक पूरा नाम दर्ज करें।');
  }

  // 2. Strict Mobile Number Validation (10-digit Indian valid mobile only, no repetitive/sequential fake numbers)
  const mobileCheck = validateMobileNumber(data.mobileNumber);
  if (!mobileCheck.isValid) {
    throw new Error(mobileCheck.error || 'कृपया 10-अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें।');
  }

  // 3. Strict Email Validation (Valid RFC format)
  if (data.email) {
    const emailCheck = validateEmailAddress(data.email);
    if (!emailCheck.isValid) {
      throw new Error(emailCheck.error || 'कृपया एक वैध ईमेल आईडी दर्ज करें।');
    }
  }

  // 4. Strict Sponsor ID Verification (Random non-existent sponsor IDs are strictly prohibited)
  const currentUsers = getAllUsers();
  const sponsorCheck = await validateSponsorIdAsync(data.sponsorId, currentUsers);
  if (!sponsorCheck.isValid) {
    throw new Error(sponsorCheck.error || 'अमान्य स्पॉन्सर ID! कोई भी रैंडम स्पॉन्सर ID स्वीकार्य नहीं है।');
  }

  // 5. Strict Duplicate Check before creating any account (Masked privacy preserved)
  const dupCheck = await checkUserAlreadyExists(mobileCheck.cleanDigits, data.email);
  if (dupCheck.exists) {
    const matchedLabel = dupCheck.matchedBy === 'both' ? 'मोबाइल नंबर और ईमेल' : dupCheck.matchedBy === 'mobile' ? 'मोबाइल नंबर' : 'ईमेल';
    const err: any = new Error(
      `यह ${matchedLabel} पहले से पंजीकृत है। डेटा सुरक्षा नीति के अनुसार केवल एक ही वैध खाता अनुमत है। कृपया सीधे लॉगिन करें अथवा पहचान सत्यापित कर पासवर्ड रीसेट करें।`
    );
    err.alreadyExists = true;
    err.matchedBy = dupCheck.matchedBy;
    err.maskedMobile = dupCheck.maskedMobile;
    err.maskedEmail = dupCheck.maskedEmail;
    throw err;
  }

  // 6. Fetch fresh users to ensure absolute unique User ID
  const plan = PLANS.find((p) => p.id === data.selectedPlanId) || PLANS[0];
  const userId = generateCustomIOISUserId(nameCheck.cleanName, plan.price, currentUsers);
  
  const newUser: UserProfile = {
    ...data,
    fullName: nameCheck.cleanName,
    mobileNumber: mobileCheck.cleanDigits,
    email: data.email ? data.email.trim().toLowerCase() : `${mobileCheck.cleanDigits}@iois.in`,
    sponsorId: sponsorCheck.sponsorId || OFFICIAL_ROOT_SPONSOR_ID,
    userId,
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
  };

  // 3. Contact backend server with 4000ms timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const serverRes = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (serverRes.status === 409) {
      const serverData = await serverRes.json();
      const err: any = new Error(serverData.error || 'खाता पहले से मौजूद है।');
      err.alreadyExists = true;
      err.matchedBy = serverData.matchedBy || 'mobile';
      err.maskedMobile = serverData.maskedMobile || dupCheck.maskedMobile;
      err.maskedEmail = serverData.maskedEmail || dupCheck.maskedEmail;
      throw err;
    }
  } catch (err: any) {
    if (err.alreadyExists) throw err;
    console.warn('Server registration endpoint note:', err);
  }

  // 4. Save immediately to local device vault & active session
  const updatedList = mergeUserLists(currentUsers, [newUser], INITIAL_DEMO_USERS);
  saveUsers(updatedList);
  setCurrentUser(newUser);

  // 5. Cloud Firestore persistence (await up to 2500ms so registration does not drop on fast tab close)
  await Promise.race([
    syncUserToFirestore(newUser),
    new Promise<void>((resolve) => setTimeout(resolve, 2500)),
  ]).catch(() => {});

  return newUser;
};

export const GITHUB_PLATFORM_URL = 'https://ioisplatform.github.io';

export const sanitizeUpiId = (upi?: string): string => {
  if (!upi) return '';
  const trimmed = upi.trim();
  // If garbage, multi-line, HTML, or entire webpage was pasted
  if (
    trimmed.length > 45 ||
    trimmed.includes('\n') ||
    trimmed.includes('\r') ||
    trimmed.includes(' ') ||
    trimmed.includes('<') ||
    trimmed.includes('http') ||
    trimmed.includes('/')
  ) {
    const match = trimmed.match(/[a-zA-Z0-9.\-_]{2,35}@[a-zA-Z]{2,20}/);
    return match ? match[0] : '';
  }
  return trimmed;
};

export const getGitHubReferralLink = (userId: string): string => {
  return `${GITHUB_PLATFORM_URL}/?ref=${encodeURIComponent((userId || '').trim().toUpperCase())}`;
};

export const registerNewUser = (data: Omit<UserProfile, 'userId' | 'paymentStatus' | 'createdAt'>): UserProfile => {
  const users = getAllUsers();

  // 1. Strict Name Validation
  const nameCheck = validateFullName(data.fullName);
  if (!nameCheck.isValid) {
    throw new Error(nameCheck.error || 'कृपया अपना वास्तविक पूरा नाम दर्ज करें।');
  }

  // 2. Strict Mobile Validation
  const mobileCheck = validateMobileNumber(data.mobileNumber);
  if (!mobileCheck.isValid) {
    throw new Error(mobileCheck.error || 'कृपया 10-अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें।');
  }

  // 3. Strict Email Validation
  if (data.email) {
    const emailCheck = validateEmailAddress(data.email);
    if (!emailCheck.isValid) {
      throw new Error(emailCheck.error || 'कृपया एक वैध ईमेल आईडी दर्ज करें।');
    }
  }

  // 4. Strict Sponsor ID Validation
  const cleanSponsor = (data.sponsorId || '').trim().toUpperCase();
  const isMasterSponsor = cleanSponsor === OFFICIAL_ROOT_SPONSOR_ID;
  const isExistingSponsor = users.some((u) => u.userId && u.userId.trim().toUpperCase() === cleanSponsor);
  if (!isMasterSponsor && !isExistingSponsor) {
    throw new Error(
      `अमान्य स्पॉन्सर ID! "${cleanSponsor || 'खाली'}" सिस्टम में मौजूद नहीं है। कोई भी रैंडम स्पॉन्सर ID स्वीकार्य नहीं है।`
    );
  }

  const cleanPayoutUpi = sanitizeUpiId(data.payoutUpi);
  const sanitizedData = {
    ...data,
    fullName: nameCheck.cleanName,
    mobileNumber: mobileCheck.cleanDigits,
    email: data.email ? data.email.trim().toLowerCase() : `${mobileCheck.cleanDigits}@iois.in`,
    sponsorId: cleanSponsor || OFFICIAL_ROOT_SPONSOR_ID,
    payoutUpi: cleanPayoutUpi,
  };

  // Check duplicate synchronously in local cache
  const cleanDigits = sanitizedData.mobileNumber;
  const cleanEmail = sanitizedData.email;
  const existing = users.find((u) => {
    if (!u) return false;
    const uDigits = (u.mobileNumber || '').replace(/\D/g, '');
    const mobileMatch = cleanDigits.length >= 10 && uDigits.endsWith(cleanDigits.slice(-10));
    const emailMatch = cleanEmail.length > 3 && u.email && u.email.trim().toLowerCase() === cleanEmail;
    return mobileMatch || emailMatch;
  });

  if (existing) {
    const err: any = new Error('यह मोबाइल नंबर या ईमेल पहले से पंजीकृत है।');
    err.alreadyExists = true;
    err.existingUser = existing;
    throw err;
  }

  const plan = PLANS.find((p) => p.id === sanitizedData.selectedPlanId) || PLANS[0];
  const userId = generateCustomIOISUserId(sanitizedData.fullName, plan.price, users);
  
  const newUser: UserProfile = {
    ...sanitizedData,
    userId,
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
  };

  const updated = mergeUserLists([newUser], users, INITIAL_DEMO_USERS);
  saveUsers(updated);
  setCurrentUser(newUser);

  // Firestore Cloud Sync (PERMANENT)
  syncUserToFirestore(newUser);

  // Background server sync
  fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  }).catch((e) => console.warn('Background register sync note:', e));

  return newUser;
};

export const updateUserProfile = (updatedProfile: UserProfile): UserProfile => {
  const users = getAllUsers();

  // Prevent duplicate mobile or email across other users (exclude current user)
  const cleanDigits = (updatedProfile.mobileNumber || '').replace(/\D/g, '');
  const cleanEmail = (updatedProfile.email || '').trim().toLowerCase();
  const conflict = users.find((u) => {
    if (!u || u.userId.toUpperCase() === updatedProfile.userId.toUpperCase()) return false;
    const uDigits = (u.mobileNumber || '').replace(/\D/g, '');
    const mobileMatch = cleanDigits.length >= 10 && uDigits.endsWith(cleanDigits.slice(-10));
    const emailMatch = cleanEmail.length > 3 && u.email && u.email.trim().toLowerCase() === cleanEmail;
    return mobileMatch || emailMatch;
  });

  if (conflict) {
    throw new Error('यह मोबाइल नंबर या ईमेल किसी अन्य सदस्य के खाते में पहले से पंजीकृत है। कृपया अपना सही विवरण दर्ज करें।');
  }

  // Prevent duplicate username across other users
  if (updatedProfile.username && updatedProfile.username.trim()) {
    const cleanUname = updatedProfile.username.trim().toLowerCase().replace(/^@/, '');
    const unameConflict = users.find((u) => {
      if (!u || u.userId.toUpperCase() === updatedProfile.userId.toUpperCase()) return false;
      return (
        (u.username && u.username.trim().toLowerCase().replace(/^@/, '') === cleanUname) ||
        (u.userId && u.userId.trim().toLowerCase() === cleanUname)
      );
    });
    if (unameConflict) {
      throw new Error(`❌ यूजरनेम "@${cleanUname}" पहले से किसी अन्य सदस्य द्वारा उपयोग में है। कृपया कोई दूसरा यूजरनेम चुनें।`);
    }
  }

  const sanitizedUpi = sanitizeUpiId(updatedProfile.payoutUpi);
  const index = users.findIndex((u) => u.userId.toUpperCase() === updatedProfile.userId.toUpperCase());
  
  // Track Audit Changes
  const existingUser = index !== -1 ? users[index] : null;
  const newLogs: Array<{ field: string; fieldLabelHi: string; oldValue?: string; newValue?: string; timestamp: string }> = [];
  const now = new Date().toISOString();

  if (existingUser) {
    const fieldMap: Array<{ key: keyof UserProfile; label: string }> = [
      { key: 'username', label: 'यूजरनेम (@username)' },
      { key: 'fullName', label: 'सदस्य का पूरा नाम' },
      { key: 'password', label: 'लॉगिन पासवर्ड' },
      { key: 'payoutUpi', label: 'पेआउट UPI आईडी' },
      { key: 'mobileNumber', label: 'मोबाइल नंबर' },
      { key: 'email', label: 'ईमेल पता' },
      { key: 'address', label: 'स्थायी पता' },
      { key: 'state', label: 'राज्य' },
      { key: 'district', label: 'जिला' },
      { key: 'pincode', label: 'पिनकोड' },
      { key: 'fatherOrHusbandName', label: 'पिता/पति का नाम' },
      { key: 'dob', label: 'जन्मतिथि' },
      { key: 'gender', label: 'जेंडर' },
      { key: 'qualification', label: 'शैक्षणिक योग्यता' },
      { key: 'photoUrl', label: 'प्रोफाइल फोटो' },
      { key: 'paymentUtr', label: 'UTR नंबर' },
      { key: 'paymentScreenshotUrl', label: 'पेमेंट स्क्रीनशॉट' },
      { key: 'emergencyContact', label: 'आपातकालीन संपर्क' },
    ];

    fieldMap.forEach(({ key, label }) => {
      const oldVal = (existingUser[key] as string) || '';
      const newVal = (updatedProfile[key] as string) || '';
      if (oldVal !== newVal && (oldVal || newVal)) {
        newLogs.push({
          field: String(key),
          fieldLabelHi: label,
          oldValue: oldVal || '(रिक्त)',
          newValue: newVal || '(रिक्त)',
          timestamp: now,
        });
      }
    });
  }

  const existingLogs = existingUser?.editHistory || [];
  const combinedLogs = [...newLogs, ...existingLogs].slice(0, 50); // Keep last 50 edits

  let finalizedUser: UserProfile;
  if (index !== -1) {
    finalizedUser = {
      ...users[index],
      ...updatedProfile,
      payoutUpi: sanitizedUpi,
      userId: users[index].userId, // Strictly immutable User ID
      editHistory: combinedLogs,
    };
    users[index] = finalizedUser;
  } else {
    finalizedUser = {
      ...updatedProfile,
      payoutUpi: sanitizedUpi,
      userId: updatedProfile.userId.trim().toUpperCase(),
      editHistory: combinedLogs,
    };
    users.push(finalizedUser);
  }

  saveUsers(users);
  
  // Update active session if this is the logged in user
  const current = getCurrentUser();
  if (!current || current.userId.toUpperCase() === finalizedUser.userId.toUpperCase()) {
    setCurrentUser(finalizedUser);
  }

  // Sync with Firestore and server
  syncUserToFirestore(finalizedUser).catch(() => {});
  fetch(`/api/users/${encodeURIComponent(finalizedUser.userId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(finalizedUser),
  }).catch((e) => console.warn('Background update sync note:', e));

  return finalizedUser;
};

/**
 * ========================================================
 * DOWNLINE & REFERRAL GENEALOGY HELPERS
 * ========================================================
 */
export interface DownlineMemberInfo {
  user: UserProfile;
  planName: string;
  planPrice: number;
  instantPayout: number;
  level: number;
  directSponsorId?: string;
  directSponsorName?: string;
}

export interface DownlineStats {
  directCount: number;
  totalDownlinesCount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalEarningsApproved: number;
  potentialEarningsPending: number;
}

export const getDirectDownlines = (sponsorId: string, allUsers?: UserProfile[]): UserProfile[] => {
  const users = allUsers || getAllUsers();
  const cleanId = (sponsorId || '').trim().toUpperCase();
  if (!cleanId) return [];
  return users.filter((u) => u && u.sponsorId && u.sponsorId.trim().toUpperCase() === cleanId);
};

export const getAllDownlinesRecursive = (
  rootUserId: string,
  allUsers?: UserProfile[],
  maxDepth = 5
): DownlineMemberInfo[] => {
  const users = allUsers || getAllUsers();
  const cleanRootId = (rootUserId || '').trim().toUpperCase();
  if (!cleanRootId) return [];

  const userMap = new Map<string, UserProfile>();
  users.forEach((u) => {
    if (u && u.userId) userMap.set(u.userId.trim().toUpperCase(), u);
  });

  const results: DownlineMemberInfo[] = [];
  const visited = new Set<string>();

  const traverse = (currentSponsorId: string, currentLevel: number) => {
    if (currentLevel > maxDepth) return;
    const sponsorUser = userMap.get(currentSponsorId);

    const directs = users.filter(
      (u) => u && u.sponsorId && u.sponsorId.trim().toUpperCase() === currentSponsorId
    );

    for (const child of directs) {
      const childId = child.userId.trim().toUpperCase();
      if (visited.has(childId)) continue; // prevent cycle
      visited.add(childId);

      const plan = PLANS.find((p) => p.id === child.selectedPlanId) || PLANS[0];
      results.push({
        user: child,
        planName: plan.name,
        planPrice: plan.price,
        instantPayout: plan.instantPayout,
        level: currentLevel,
        directSponsorId: currentSponsorId,
        directSponsorName: sponsorUser?.fullName || currentSponsorId,
      });

      traverse(childId, currentLevel + 1);
    }
  };

  traverse(cleanRootId, 1);
  return results;
};

export const getDownlineStats = (userId: string, allUsers?: UserProfile[]): DownlineStats => {
  const downlines = getAllDownlinesRecursive(userId, allUsers);
  const directList = getDirectDownlines(userId, allUsers);

  let approvedCount = 0;
  let pendingCount = 0;
  let rejectedCount = 0;
  let totalEarningsApproved = 0;
  let potentialEarningsPending = 0;

  downlines.forEach((item) => {
    if (item.user.paymentStatus === 'approved') {
      approvedCount++;
      // Full instant payout for level 1 directs, bonus for deeper levels
      if (item.level === 1) {
        totalEarningsApproved += item.instantPayout;
      } else {
        totalEarningsApproved += Math.round(item.instantPayout * 0.2); // 20% team bonus
      }
    } else if (item.user.paymentStatus === 'pending') {
      pendingCount++;
      if (item.level === 1) {
        potentialEarningsPending += item.instantPayout;
      }
    } else {
      rejectedCount++;
    }
  });

  return {
    directCount: directList.length,
    totalDownlinesCount: downlines.length,
    approvedCount,
    pendingCount,
    rejectedCount,
    totalEarningsApproved,
    potentialEarningsPending,
  };
};

/**
 * Flexible cross-device user login with Server + Firestore verification + strict password & single-device session rotation
 */
export const loginUserAsync = async (
  identifier: string, 
  password?: string
): Promise<{ success: boolean; user?: UserProfile; sessionToken?: string; error?: string }> => {
  const cleanId = identifier.trim();
  if (!cleanId) {
    return { success: false, error: 'कृपया अपना User ID, @Username, मोबाइल नंबर या ईमेल दर्ज करें।' };
  }

  const cleanLower = cleanId.toLowerCase().replace(/^@/, '');
  const cleanUpper = cleanId.toUpperCase();
  const digits = cleanId.replace(/\D/g, '');
  const deviceInfo = getDeviceFingerprintLabel();

  let matchedUser: UserProfile | null = null;
  let issuedToken = '';

  // 1. Try Server API Login FIRST so single-device sessionToken rotates reliably on server & notifies old device
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: cleanId, password: password || '', deviceInfo }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (res.ok && data.success && data.user) {
      matchedUser = data.user;
      issuedToken = data.sessionToken || data.user.activeSessionToken || createClientSessionToken();
    } else if (res.status === 401) {
      return { success: false, error: data.error || 'दर्ज किया गया पासवर्ड गलत है।' };
    }
  } catch {
    // Fallback to Firestore / local cache if server endpoint unreachable
  }

  // 2. Targeted Firestore query fallback (only when not in quota cooldown)
  if (!matchedUser && db && !isFirestoreInQuotaCooldown()) {
    try {
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
      const firestorePromise = (async (): Promise<UserProfile | null> => {
        if (cleanId.length >= 4 && !cleanId.startsWith('@')) {
          const docRef = doc(db, 'users', cleanUpper);
          const snap = await getDoc(docRef);
          if (snap.exists()) return snap.data() as UserProfile;
        }
        if (digits.length >= 10) {
          const col = collection(db, 'users');
          const q = query(col, where('mobileNumber', '==', digits.slice(-10)), limit(1));
          const snap = await getDocs(q);
          if (!snap.empty) return snap.docs[0].data() as UserProfile;
        }
        const col = collection(db, 'users');
        const qUname = query(col, where('username', '==', cleanLower), limit(1));
        const snapU = await getDocs(qUname);
        if (!snapU.empty) return snapU.docs[0].data() as UserProfile;
        return null;
      })();

      matchedUser = await Promise.race([firestorePromise, timeoutPromise]);
    } catch (e) {
      markFirestoreQuotaExhausted(e);
    }
  }

  // 3. Local device cache fallback
  if (!matchedUser) {
    const users = getAllUsers();
    matchedUser = users.find(
      (u) =>
        u.userId?.toLowerCase() === cleanLower ||
        (u.username && u.username.toLowerCase().replace(/^@/, '') === cleanLower) ||
        (digits.length >= 10 && (u.mobileNumber || '').replace(/\D/g, '').endsWith(digits.slice(-10))) ||
        (u.email && u.email.toLowerCase() === cleanLower)
    ) || null;
  }

  if (!matchedUser) {
    return { success: false, error: 'यह User ID, Username या मोबाइल नंबर पंजीकृत नहीं मिला।' };
  }

  // Strict Password Verification whenever account has a password
  if (matchedUser.password && matchedUser.password.trim() !== '') {
    if (!password || matchedUser.password !== password) {
      return { success: false, error: 'दर्ज किया गया पासवर्ड गलत है। कृपया सही पासवर्ड डालें।' };
    }
  }

  // Ensure sessionToken is set and synced to Firestore for real-time cross-device invalidation
  if (!issuedToken) {
    issuedToken = createClientSessionToken();
  }
  const updatedUser: UserProfile = {
    ...matchedUser,
    activeSessionToken: issuedToken,
    lastLoginDevice: matchedUser.lastLoginDevice || deviceInfo,
    lastLoginAt: matchedUser.lastLoginAt || new Date().toISOString(),
  };

  setDeviceSessionToken(issuedToken);
  const all = getAllUsers();
  const merged = mergeUserLists([updatedUser], all, INITIAL_DEMO_USERS);
  saveUsers(merged);
  setCurrentUser(updatedUser);

  // Sync updated activeSessionToken to Firestore so old devices receive instant logout signal
  syncUserToFirestore(updatedUser).catch(() => {});

  return { success: true, user: updatedUser, sessionToken: issuedToken };
};

export const loginUser = (identifier: string, password?: string): UserProfile | null => {
  const users = getAllUsers();
  const cleanId = identifier.trim().toLowerCase().replace(/^@/, '');
  const cleanDigits = identifier.replace(/\D/g, '');
  
  const user = users.find(
    (u) => 
      u.userId?.toLowerCase() === cleanId || 
      (u.username && u.username.toLowerCase().replace(/^@/, '') === cleanId) ||
      (cleanDigits.length >= 10 && (u.mobileNumber || '').replace(/\D/g, '').endsWith(cleanDigits.slice(-10))) ||
      (u.email && u.email.toLowerCase() === cleanId)
  );

  if (!user) return null;

  if (user.password && user.password.trim() !== '' && user.password !== (password || '')) {
    return null;
  }

  const token = getDeviceSessionToken() || createClientSessionToken();
  setDeviceSessionToken(token);
  const updatedUser: UserProfile = { ...user, activeSessionToken: token };
  setCurrentUser(updatedUser);
  return updatedUser;
};

export const getCurrentUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    let user: UserProfile | null = null;
    if (memoryCurrentUser !== undefined) {
      user = memoryCurrentUser;
    } else {
      const raw = safeLocalStorageGet(STORAGE_CURRENT_USER_KEY);
      if (raw) {
        user = JSON.parse(raw) as UserProfile;
        memoryCurrentUser = user;
      } else {
        memoryCurrentUser = null;
      }
    }

    if (user) {
      // Enrich missing photoUrl/paymentScreenshotUrl from full memoryUsers if localStorage held a compact session copy
      if ((!user.photoUrl || !user.paymentScreenshotUrl) && memoryUsers && memoryUsers.length > 0) {
        const fullMatch = memoryUsers.find((u) => u.userId?.toUpperCase() === user!.userId?.toUpperCase());
        if (fullMatch) {
          user = {
            ...user,
            photoUrl: user.photoUrl || fullMatch.photoUrl,
            paymentScreenshotUrl: user.paymentScreenshotUrl || fullMatch.paymentScreenshotUrl,
          };
          memoryCurrentUser = user;
        }
      }
      if (user.payoutUpi) {
        user = { ...user, payoutUpi: sanitizeUpiId(user.payoutUpi) };
      }
    }
    return user;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: UserProfile | null): void => {
  if (typeof window === 'undefined') return;
  memoryCurrentUser = user;
  if (!user) {
    safeLocalStorageRemove(STORAGE_CURRENT_USER_KEY);
    void idbRemove(STORAGE_CURRENT_USER_KEY);
    return;
  }

  // Always save full user record to IndexedDB
  void idbSet(STORAGE_CURRENT_USER_KEY, user);

  try {
    const serialized = JSON.stringify(user);
    if (
      serialized.length <= 1_200_000 &&
      safeLocalStorageSet(STORAGE_CURRENT_USER_KEY, serialized, {
        evictKeysOnQuota: BULKY_EVICT_KEYS,
      })
    ) {
      return;
    }

    // Fallback 1: omit large paymentScreenshotUrl in localStorage session copy (rarely needed in active session header)
    const withoutReceipt: UserProfile = {
      ...user,
      paymentScreenshotUrl:
        user.paymentScreenshotUrl && user.paymentScreenshotUrl.startsWith('data:') && user.paymentScreenshotUrl.length > 4096
          ? ''
          : user.paymentScreenshotUrl,
    };
    const withoutReceiptJson = JSON.stringify(withoutReceipt);
    if (
      withoutReceiptJson.length <= 1_200_000 &&
      safeLocalStorageSet(STORAGE_CURRENT_USER_KEY, withoutReceiptJson, {
        evictKeysOnQuota: BULKY_EVICT_KEYS,
      })
    ) {
      return;
    }

    // Fallback 2: strip any huge inline data URLs in localStorage session copy while memoryCurrentUser & IDB retain them
    const compactUser = stripOversizedDataUrls(user, 4096);
    safeLocalStorageSet(STORAGE_CURRENT_USER_KEY, JSON.stringify(compactUser), {
      evictKeysOnQuota: BULKY_EVICT_KEYS,
    });
  } catch {
    // memoryCurrentUser & IndexedDB still hold the active user safely
  }
};

export const logoutUser = (): void => {
  setCurrentUser(null);
  clearDeviceSessionToken();
};

export interface SessionValidityResult {
  valid: boolean;
  newDevice?: string;
  newLoginAt?: string;
}

export const checkActiveSessionAsync = async (userId: string): Promise<SessionValidityResult> => {
  const localToken = getDeviceSessionToken();
  if (!userId || !localToken) return { valid: true };
  const cleanId = userId.trim().toUpperCase();

  try {
    const res = await fetch('/api/users/session-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: cleanId, sessionToken: localToken }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.valid === false) {
        return {
          valid: false,
          newDevice: data.newDevice || 'अन्य नया डिवाइस',
          newLoginAt: data.newLoginAt,
        };
      }
    }
  } catch {
    // Fallback to Firestore
  }

  if (db && !isFirestoreInQuotaCooldown()) {
    try {
      const snap = await getDoc(doc(db, 'users', cleanId));
      if (snap.exists()) {
        const d = snap.data() as UserProfile;
        if (d.activeSessionToken && d.activeSessionToken !== localToken) {
          return {
            valid: false,
            newDevice: d.lastLoginDevice || 'अन्य नया डिवाइस',
            newLoginAt: d.lastLoginAt,
          };
        }
      }
    } catch (e) {
      markFirestoreQuotaExhausted(e);
    }
  }

  return { valid: true };
};

export const subscribeToSessionValidity = (
  userId: string,
  onKickedOut: (info: { newDevice?: string; newLoginAt?: string }) => void
): (() => void) => {
  if (!userId) return () => {};
  const cleanId = userId.trim().toUpperCase();
  let kicked = false;
  let unsubscribeSnap = () => {};

  const triggerKick = (info: { newDevice?: string; newLoginAt?: string }) => {
    if (kicked) return;
    kicked = true;
    onKickedOut(info);
  };

  if (db && !isFirestoreInQuotaCooldown()) {
    try {
      unsubscribeSnap = onSnapshot(
        doc(db, 'users', cleanId),
        (snap) => {
          const localToken = getDeviceSessionToken();
          if (!snap.exists() || !localToken) return;
          const data = snap.data() as UserProfile;
          if (data?.activeSessionToken && data.activeSessionToken !== localToken) {
            triggerKick({
              newDevice: data.lastLoginDevice || 'नया डिवाइस',
              newLoginAt: data.lastLoginAt,
            });
          }
        },
        (err) => {
          markFirestoreQuotaExhausted(err);
        }
      );
    } catch {}
  }

  // Poll server session-check every 15s (zero Firestore reads; skip when tab hidden)
  const interval = setInterval(async () => {
    if (kicked || (typeof document !== 'undefined' && document.hidden)) return;
    const localToken = getDeviceSessionToken();
    if (!localToken) return;
    try {
      const res = await fetch('/api/users/session-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: cleanId, sessionToken: localToken }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.valid === false) {
          triggerKick({
            newDevice: data.newDevice || 'अन्य नया डिवाइस',
            newLoginAt: data.newLoginAt,
          });
        }
      }
    } catch {}
  }, 15000);

  return () => {
    unsubscribeSnap();
    clearInterval(interval);
  };
};

export interface SponsorAddMemberPayload {
  sponsorId: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  username?: string;
  tempPassword: string;
  selectedPlanId: number;
  role?: string;
  telegramUsername?: string;
  photoUrl?: string;
  googleDrivePhotoLink?: string;
  payoutUpi?: string;
  address?: string;
  paymentUtr?: string;
  paymentScreenshotUrl?: string;
  googleDrivePaymentLink?: string;
  paymentMode?: string;
}

/**
 * Allows a logged-in sponsor to register a new member under their sponsorId
 * WITHOUT logging out the sponsor and marking the new user with mustChangePassword=true
 */
export const registerMemberBySponsorAsync = async (
  payload: SponsorAddMemberPayload
): Promise<UserProfile> => {
  await hydrateUsersFromIdb();
  const nameCheck = validateFullName(payload.fullName);
  if (!nameCheck.isValid) {
    throw new Error(nameCheck.error || 'कृपया नया सदस्य का सही पूरा नाम दर्ज करें।');
  }
  const mobileCheck = validateMobileNumber(payload.mobileNumber);
  if (!mobileCheck.isValid) {
    throw new Error(mobileCheck.error || 'कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें।');
  }
  if (!payload.tempPassword || payload.tempPassword.trim().length < 4) {
    throw new Error('कृपया कम से कम 4 अक्षरों का शुरुआती अस्थायी पासवर्ड सेट करें।');
  }

  const cleanSponsorId = (payload.sponsorId || OFFICIAL_ROOT_SPONSOR_ID).trim().toUpperCase();
  const cleanEmail = payload.email?.trim().toLowerCase() || `${mobileCheck.cleanDigits}@iois.in`;
  const cleanUsername = payload.username?.trim().toLowerCase().replace(/^@/, '') || '';

  if (cleanUsername) {
    const unameRes = await checkUsernameAvailableAsync(cleanUsername);
    if (!unameRes.available) {
      throw new Error(unameRes.error || 'यह यूजरनेम उपलब्ध नहीं है।');
    }
  }

  const users = getAllUsers();
  const dup = users.find((u) => {
    const uDigits = (u.mobileNumber || '').replace(/\D/g, '');
    return (
      (mobileCheck.cleanDigits.length >= 10 && uDigits.endsWith(mobileCheck.cleanDigits.slice(-10))) ||
      (cleanEmail && u.email?.toLowerCase() === cleanEmail)
    );
  });
  if (dup) {
    throw new Error('यह मोबाइल नंबर या ईमेल पहले से किसी सदस्य के नाम पर पंजीकृत है।');
  }

  const plan = PLANS.find((p) => p.id === payload.selectedPlanId) || PLANS[0];
  const generatedUserId = generateCustomIOISUserId(nameCheck.cleanName, plan.price, users);

  const draftUser: UserProfile = {
    userId: generatedUserId,
    username: cleanUsername || undefined,
    fullName: nameCheck.cleanName,
    mobileNumber: mobileCheck.cleanDigits,
    email: cleanEmail,
    password: payload.tempPassword.trim(),
    mustChangePassword: true,
    registeredBySponsorId: cleanSponsorId,
    sponsorId: cleanSponsorId,
    selectedPlanId: plan.id,
    payoutUpi: sanitizeUpiId(payload.payoutUpi),
    address: payload.address?.trim() || '',
    telegramUsername: payload.telegramUsername?.trim() || undefined,
    paymentUtr: payload.paymentUtr?.trim() || '',
    paymentMode: payload.paymentMode || 'UPI',
    paymentScreenshotUrl: payload.paymentScreenshotUrl || '',
    googleDrivePaymentLink: payload.googleDrivePaymentLink?.trim() || undefined,
    role: payload.role?.trim() || 'Verified Elite Member',
    photoUrl:
      payload.photoUrl?.trim() ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    googleDrivePhotoLink: payload.googleDrivePhotoLink?.trim() || undefined,
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    privacySettings: {
      showFullName: true,
      showMobile: false,
      showEmail: false,
      showPhoto: true,
      showLocation: true,
    },
  };

  let createdUser = draftUser;
  try {
    const res = await fetch('/api/users/sponsor-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftUser),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'पंजीकरण सर्वर पर सहेजा नहीं जा सका।');
    }
    if (data.user) {
      createdUser = data.user;
    }
  } catch (err: any) {
    if (err?.message && (err.message.includes('पंजीकृत') || err.message.includes('यूजरनेम'))) {
      throw err;
    }
  }

  // Update local directory cache & Firestore WITHOUT changing getCurrentUser() or device session token
  const merged = mergeUserLists([createdUser], users, INITIAL_DEMO_USERS);
  saveUsers(merged);
  syncUserToFirestore(createdUser).catch(() => {});

  return createdUser;
};

/**
 * Forces newly sponsor-joined user to change password on first login and rotates session token
 * so the sponsor can NEVER log into the new member's account.
 */
export const forceUpdatePasswordAsync = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
  const cleanId = userId.trim().toUpperCase();
  if (!newPassword || newPassword.trim().length < 6) {
    return { success: false, error: 'नया पासवर्ड कम से कम 6 अक्षरों/अंकों का सुरक्षित होना चाहिए।' };
  }
  if (newPassword.trim() === currentPassword.trim()) {
    return { success: false, error: 'नया पासवर्ड पुराने अस्थायी पासवर्ड से अलग होना चाहिए।' };
  }

  let updatedUser: UserProfile | null = null;
  let newToken = createClientSessionToken();

  try {
    const res = await fetch('/api/users/force-password-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: cleanId,
        currentPassword,
        newPassword: newPassword.trim(),
        deviceInfo: getDeviceFingerprintLabel(),
      }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.user) {
      updatedUser = data.user;
      newToken = data.sessionToken || data.user.activeSessionToken || newToken;
    } else if (res.status === 401 || res.status === 400) {
      return { success: false, error: data.error || 'पासवर्ड अपडेट असफल रहा।' };
    }
  } catch {
    // Fallback below
  }

  const users = getAllUsers();
  const localCurrent = getCurrentUser();
  const baseUser = updatedUser || users.find((u) => u.userId?.toUpperCase() === cleanId) || localCurrent;
  if (!baseUser) {
    return { success: false, error: 'सदस्य खाता नहीं मिला।' };
  }

  if (!updatedUser && baseUser.password && baseUser.password !== currentPassword) {
    return { success: false, error: 'पुराना पासवर्ड मेल नहीं खा रहा है।' };
  }

  const finalized: UserProfile = {
    ...baseUser,
    password: newPassword.trim(),
    mustChangePassword: false,
    activeSessionToken: newToken,
    lastLoginDevice: getDeviceFingerprintLabel(),
    lastLoginAt: new Date().toISOString(),
  };

  setDeviceSessionToken(newToken);
  saveUsers(mergeUserLists([finalized], users, INITIAL_DEMO_USERS));
  setCurrentUser(finalized);
  syncUserToFirestore(finalized).catch(() => {});

  return { success: true, user: finalized };
};

export const findUserByMobile = (mobile: string): UserProfile | null => {
  const users = getAllUsers();
  const digits = mobile.replace(/\D/g, '');
  if (digits.length < 10) return null;
  return users.find((u) => u.mobileNumber.replace(/\D/g, '').endsWith(digits.slice(-10))) || null;
};

export const findUserByEmail = (email: string): UserProfile | null => {
  const users = getAllUsers();
  const clean = email.trim().toLowerCase();
  return users.find((u) => u.email.trim().toLowerCase() === clean) || null;
};

// Admin Auth and Status Updates
export const isAdminLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  return safeLocalStorageGet(STORAGE_ADMIN_SESSION_KEY) === 'true';
};

export const setAdminSession = (active: boolean): void => {
  if (typeof window === 'undefined') return;
  if (active) {
    safeLocalStorageSet(STORAGE_ADMIN_SESSION_KEY, 'true', {
      evictKeysOnQuota: BULKY_EVICT_KEYS,
    });
  } else {
    safeLocalStorageRemove(STORAGE_ADMIN_SESSION_KEY);
  }
};

export const setPaymentStatus = (
  userId: string, 
  status: 'approved' | 'rejected', 
  reason?: string
): void => {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.userId.toUpperCase() === userId.toUpperCase());
  if (index !== -1) {
    users[index].paymentStatus = status;
    if (status === 'approved') {
      users[index].verifiedAt = new Date().toISOString();
      users[index].rejectionReason = undefined;
    } else {
      users[index].rejectionReason = reason || 'Payment screenshot or UTR invalid';
    }
    saveUsers(users);

    const current = getCurrentUser();
    if (current && current.userId.toUpperCase() === userId.toUpperCase()) {
      setCurrentUser(users[index]);
    }

    // Call Firestore and server to persist status change permanently
    syncUserToFirestore(users[index]);
    fetch(`/api/users/${encodeURIComponent(userId)}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason }),
    }).catch((e) => console.warn('Background status sync note:', e));
  }
};

export const deleteUserAccount = async (userId: string): Promise<boolean> => {
  await hydrateUsersFromIdb();
  const cleanId = userId.trim().toUpperCase();
  const users = getAllUsers();
  const target = users.find((u) => u.userId?.toUpperCase() === cleanId);

  if (target) {
    const archivedEntry: UserProfile = {
      ...target,
      isArchived: true,
      archivedAt: new Date().toISOString(),
      archivedReason: 'Admin archive vault',
    };
    const nextArchMap = new Map<string, UserProfile>();
    for (const a of [...memoryArchivedUsers, archivedEntry]) {
      if (a?.userId) nextArchMap.set(a.userId.trim().toUpperCase(), a);
    }
    memoryArchivedUsers = Array.from(nextArchMap.values());
    void idbSet(STORAGE_ARCHIVE_VAULT_KEY, memoryArchivedUsers);
    void syncUserToFirestore(archivedEntry);
  }

  try {
    await fetch(`/api/users/${encodeURIComponent(cleanId)}`, { method: 'DELETE' });
  } catch (e) {
    console.warn('Archive user note:', e);
  }

  const remaining = users.filter((u) => u.userId.toUpperCase() !== cleanId);
  saveUsers(remaining, { allowShrink: true });
  return true;
};

const saveTicketsLocally = (tickets: HelpTicket[]): void => {
  if (typeof window === 'undefined') return;
  const clean = Array.isArray(tickets) ? tickets : [];
  memoryTickets = clean;
  void idbSet(STORAGE_TICKETS_KEY, clean);

  try {
    const serialized = JSON.stringify(clean);
    if (serialized.length <= 600_000 && safeLocalStorageSet(STORAGE_TICKETS_KEY, serialized)) {
      return;
    }
    const compact = clean.map((t) => stripOversizedDataUrls(t, 4096));
    const compactJson = JSON.stringify(compact);
    if (compactJson.length <= 600_000) {
      safeLocalStorageSet(STORAGE_TICKETS_KEY, compactJson);
    } else {
      safeLocalStorageRemove(STORAGE_TICKETS_KEY);
    }
  } catch {
    safeLocalStorageRemove(STORAGE_TICKETS_KEY);
  }
};

// Help & Support Tickets Engine
export const getHelpTickets = (): HelpTicket[] => {
  if (typeof window === 'undefined') return [];
  if (memoryTickets !== null) return memoryTickets;
  try {
    const raw = safeLocalStorageGet(STORAGE_TICKETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryTickets = parsed;
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
};

export const fetchTicketsFromServer = async (options?: { skipFirestore?: boolean }): Promise<HelpTicket[]> => {
  await hydrateUsersFromIdb();
  // Prefer server disk first so polling doesn't burn Firestore read quota
  try {
    const res = await fetch('/api/tickets');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.tickets)) {
        saveTicketsLocally(data.tickets);
        return data.tickets;
      }
    }
  } catch (e) {
    console.warn('Tickets fetch note:', e);
  }

  // Fallback to Firestore if server empty/unreachable and quota cooldown not active
  try {
    if (db && !options?.skipFirestore && !isFirestoreInQuotaCooldown()) {
      const col = collection(db, 'tickets');
      const snap = await getDocs(col);
      const firestoreTickets: HelpTicket[] = [];
      snap.forEach((d) => {
        const t = d.data() as HelpTicket;
        if (t && t.id) firestoreTickets.push(t);
      });
      if (firestoreTickets.length > 0) {
        saveTicketsLocally(firestoreTickets);
        return firestoreTickets;
      }
    }
  } catch (e) {
    markFirestoreQuotaExhausted(e);
    console.warn('Firestore tickets query note:', e);
  }

  return getHelpTickets();
};

export const createHelpTicket = (ticket: Omit<HelpTicket, 'id' | 'createdAt' | 'status'>): HelpTicket => {
  const tickets = getHelpTickets();
  const newTicket: HelpTicket = {
    ...ticket,
    id: 'TICKET-' + (tickets.length + 1).toString().padStart(6, '0'),
    createdAt: new Date().toISOString(),
    status: 'open',
  };
  const updated = [newTicket, ...tickets];
  saveTicketsLocally(updated);

  // Firestore & Server sync
  syncTicketToFirestore(newTicket);
  fetch('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket),
  }).catch((e) => console.warn('Background ticket sync note:', e));

  return newTicket;
};

export const replyHelpTicket = (ticketId: string, reply: string, status: 'in_progress' | 'resolved' = 'resolved'): void => {
  const tickets = [...getHelpTickets()];
  const index = tickets.findIndex((t) => t.id === ticketId);
  if (index !== -1) {
    tickets[index] = {
      ...tickets[index],
      adminReply: reply,
      status,
    };
    saveTicketsLocally(tickets);

    syncTicketToFirestore(tickets[index]);
    fetch(`/api/tickets/${encodeURIComponent(ticketId)}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminReply: reply, status }),
    }).catch((e) => console.warn('Background ticket reply note:', e));
  }
};

// =========================================================================
// 1. Unique Username Validation & Short Sponsor Link Helpers
// =========================================================================

export const validateUsernameFormat = (username?: string): { isValid: boolean; cleanUsername: string; error?: string } => {
  if (!username || typeof username !== 'string' || !username.trim()) {
    return { isValid: false, cleanUsername: '', error: 'यूजरनेम दर्ज करना अनिवार्य है।' };
  }
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  if (clean.length < 3) {
    return { isValid: false, cleanUsername: clean, error: 'यूजरनेम कम से कम 3 अक्षरों का होना चाहिए।' };
  }
  if (clean.length > 20) {
    return { isValid: false, cleanUsername: clean, error: 'यूजरनेम 20 अक्षरों से अधिक नहीं हो सकता।' };
  }
  if (!/^[a-z0-9_]+$/.test(clean)) {
    return {
      isValid: false,
      cleanUsername: clean,
      error: 'यूजरनेम में केवल छोटे अंग्रेजी अक्षर (a-z), अंक (0-9) और अंडरस्कोर (_) का ही उपयोग करें।',
    };
  }
  const reserved = ['admin', 'root', 'support', 'iois', 'ioisplatform', 'official', 'acc', 'help', 'master', 'balvikas'];
  if (reserved.includes(clean)) {
    return {
      isValid: false,
      cleanUsername: clean,
      error: `यह यूजरनेम "@${clean}" आधिकारिक सिस्टम के लिए आरक्षित है। कृपया कोई दूसरा नाम चुनें।`,
    };
  }
  if (clean === 'iois999vk01' || clean === 'swaccdk01' || clean === 'vikaskumar') {
    return {
      isValid: false,
      cleanUsername: clean,
      error: `यह यूजरनेम "@${clean}" मास्टर स्पॉन्सर के लिए आरक्षित है।`,
    };
  }
  return { isValid: true, cleanUsername: clean };
};

export const checkUsernameAvailableAsync = async (
  username: string,
  excludeUserId?: string
): Promise<{ available: boolean; cleanUsername: string; error?: string; message?: string }> => {
  const format = validateUsernameFormat(username);
  if (!format.isValid) {
    return { available: false, cleanUsername: format.cleanUsername, error: format.error };
  }
  const clean = format.cleanUsername;

  // 1. Local Cache Check
  const users = getAllUsers();
  const excludeUpper = excludeUserId ? excludeUserId.trim().toUpperCase() : '';
  const localConflict = users.find((u) => {
    if (!u) return false;
    if (excludeUpper && u.userId?.toUpperCase() === excludeUpper) return false;
    const matchUname = u.username && u.username.toLowerCase().replace(/^@/, '') === clean;
    const matchUid = u.userId && u.userId.toLowerCase() === clean;
    return matchUname || matchUid;
  });

  if (localConflict) {
    return {
      available: false,
      cleanUsername: clean,
      error: `❌ यूजरनेम "@${clean}" पहले से किसी अन्य सदस्य द्वारा उपयोग में है। कृपया कोई दूसरा उपलब्ध यूजरनेम चुनें।`,
    };
  }

  // 2. Server API Check
  try {
    const res = await fetch(`/api/users/check-username?username=${encodeURIComponent(clean)}&excludeUserId=${encodeURIComponent(excludeUpper)}`);
    if (res.ok) {
      const data = await res.json();
      if (!data.available) {
        return {
          available: false,
          cleanUsername: clean,
          error: data.error || `❌ यूजरनेम "@${clean}" पहले से उपयोग में है।`,
        };
      }
    }
  } catch {}

  return {
    available: true,
    cleanUsername: clean,
    message: `✓ यूजरनेम "@${clean}" उपलब्ध है!`,
  };
};

export const getShortSponsorUrl = (user: { userId: string; username?: string }): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ioisplatform.github.io';
  const handle = (user.username && user.username.trim().replace(/^@/, '')) || user.userId;
  return `${origin}/?s=${encodeURIComponent(handle)}`;
};

// =========================================================================
// 2. Private Direct Messaging Service (Admin <-> User)
// =========================================================================

const memoryPrivateMessages = new Map<string, AdminPrivateMessage[]>();

export const getLocalPrivateChatMessages = (userId: string): AdminPrivateMessage[] => {
  if (typeof window === 'undefined') return [];
  const key = `${STORAGE_PRIVATE_MESSAGES_KEY}_${userId.toUpperCase()}`;
  const cached = memoryPrivateMessages.get(key);
  if (cached) return cached;
  try {
    const raw = safeLocalStorageGet(key);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      memoryPrivateMessages.set(key, parsed);
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
};

export const saveLocalPrivateChatMessages = (userId: string, msgs: AdminPrivateMessage[]): void => {
  if (typeof window === 'undefined') return;
  const key = `${STORAGE_PRIVATE_MESSAGES_KEY}_${userId.toUpperCase()}`;
  memoryPrivateMessages.set(key, msgs);
  void idbSet(key, msgs);
  try {
    const serialized = JSON.stringify(msgs);
    if (serialized.length <= 400_000 && safeLocalStorageSet(key, serialized)) {
      return;
    }
    const compact = msgs.map((m) => stripOversizedDataUrls(m, 4096));
    safeLocalStorageSet(key, JSON.stringify(compact), { maxBytes: 400_000 });
  } catch {}
};

export const fetchPrivateChatMessagesAsync = async (userId: string): Promise<AdminPrivateMessage[]> => {
  const cleanId = userId.trim().toUpperCase();
  const local = getLocalPrivateChatMessages(cleanId);

  // Firestore check
  if (db) {
    try {
      const col = collection(db, 'private_messages');
      const snap = await getDocs(col);
      const list: AdminPrivateMessage[] = [];
      snap.forEach((d) => {
        const m = d.data() as AdminPrivateMessage;
        if (m && m.userId && m.userId.toUpperCase() === cleanId) {
          list.push(m);
        }
      });
      if (list.length > 0) {
        list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        saveLocalPrivateChatMessages(cleanId, list);
        return list;
      }
    } catch {}
  }

  // Server API check
  try {
    const res = await fetch(`/api/messages/${encodeURIComponent(cleanId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.messages)) {
        saveLocalPrivateChatMessages(cleanId, data.messages);
        return data.messages;
      }
    }
  } catch {}

  return local;
};

export const sendPrivateChatMessageAsync = async (
  msg: Omit<AdminPrivateMessage, 'id' | 'createdAt'>
): Promise<AdminPrivateMessage> => {
  const cleanId = msg.userId.trim().toUpperCase();
  const newMsg: AdminPrivateMessage = {
    ...msg,
    id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: cleanId,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const existing = getLocalPrivateChatMessages(cleanId);
  const updated = [...existing, newMsg];
  saveLocalPrivateChatMessages(cleanId, updated);

  // Sync with Firestore
  if (db) {
    try {
      await setDoc(doc(db, 'private_messages', newMsg.id), newMsg);
    } catch (e) {
      console.warn('Firestore message sync note:', e);
    }
  }

  // Sync with Server API
  fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMsg),
  }).catch(() => {});

  return newMsg;
};

// =========================================================================
// 3. Admin Master User Profile Updater
// =========================================================================

export const adminUpdateUserProfileAsync = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  await hydrateUsersFromIdb();
  const cleanId = userId.trim().toUpperCase();
  const users = getAllUsers();
  const index = users.findIndex((u) => u.userId?.toUpperCase() === cleanId);
  if (index === -1) {
    throw new Error('उपयोगकर्ता नहीं मिला।');
  }

  const existing = users[index];
  const now = new Date().toISOString();
  const existingHistory = existing.editHistory || [];

  const fieldLabels: Record<string, string> = {
    fullName: 'सदस्य का पूरा नाम (Admin Edit)',
    password: 'लॉगिन पासवर्ड (Admin Reset)',
    mobileNumber: 'मोबाइल नंबर',
    email: 'ईमेल पता',
    selectedPlanId: 'चयनित प्लान',
    role: 'सदस्य पद / रोल',
    payoutUpi: 'पेआउट UPI',
    address: 'पता',
    paymentStatus: 'पेमेंट स्थिति',
    username: 'यूजरनेम (@username)',
  };

  const newLogs: any[] = [];
  Object.keys(updates).forEach((k) => {
    if (k !== 'editHistory' && k !== 'userId' && (updates as any)[k] !== undefined) {
      const oldV = String((existing as any)[k] || '');
      const newV = String((updates as any)[k] || '');
      if (oldV !== newV) {
        newLogs.push({
          field: k,
          fieldLabelHi: fieldLabels[k] || k,
          oldValue: oldV || '(खाली)',
          newValue: newV || '(खाली)',
          timestamp: now,
        });
      }
    }
  });

  const updatedUser: UserProfile = {
    ...existing,
    ...updates,
    userId: existing.userId,
    editHistory: [...newLogs, ...existingHistory].slice(0, 50),
  };

  users[index] = updatedUser;
  saveUsers(users);

  // Sanitized + quota-protected Firestore sync
  void syncUserToFirestore(updatedUser);

  // Server API sync
  fetch(`/api/admin/users/${encodeURIComponent(cleanId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }).catch(() => {});

  return updatedUser;
};

// =========================================================================
// 4. Admin Full Records, Archive Vault & Non-Destructive Backup Recovery APIs
// =========================================================================

export interface AdminBackupInfo {
  lastBackupAt?: string;
  activeCount: number;
  archivedCount: number;
  firestoreQuotaCooldown: boolean;
}

export const fetchAdminFullUsersAsync = async (
  adminPin = 'IOISSYSTEM'
): Promise<{ users: UserProfile[]; archivedUsers: UserProfile[]; backupInfo?: AdminBackupInfo }> => {
  await hydrateUsersFromIdb();
  const localUsers = getAllUsers();
  let serverFull: UserProfile[] = [];
  let serverArchived: UserProfile[] = [];
  let backupInfo: AdminBackupInfo | undefined;

  try {
    const res = await fetch('/api/admin/users-full', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminPin }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success) {
        serverFull = Array.isArray(data.users) ? data.users : [];
        serverArchived = Array.isArray(data.archivedUsers) ? data.archivedUsers : [];
        backupInfo = data.backupInfo;
      }
    }
  } catch {}

  const archivedMap = new Map<string, UserProfile>();
  for (const a of [...memoryArchivedUsers, ...serverArchived]) {
    if (a?.userId) archivedMap.set(a.userId.trim().toUpperCase(), a);
  }
  memoryArchivedUsers = Array.from(archivedMap.values());
  void idbSet(STORAGE_ARCHIVE_VAULT_KEY, memoryArchivedUsers);

  const archivedIds = new Set(memoryArchivedUsers.map((u) => u.userId.trim().toUpperCase()));
  const merged = mergeUserLists(localUsers, serverFull).filter(
    (u) => !archivedIds.has(u.userId.trim().toUpperCase())
  );

  saveUsers(merged);
  if (merged.length > serverFull.length) {
    fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: merged }),
    }).catch(() => {});
  }

  return { users: merged, archivedUsers: memoryArchivedUsers, backupInfo };
};

export const fetchArchivedUsersAsync = async (): Promise<UserProfile[]> => {
  await hydrateUsersFromIdb();
  try {
    const res = await fetch('/api/users/archive');
    if (res.ok) {
      const data = await res.json();
      if (data?.success && Array.isArray(data.archivedUsers)) {
        const archivedMap = new Map<string, UserProfile>();
        for (const a of [...memoryArchivedUsers, ...data.archivedUsers]) {
          if (a?.userId) archivedMap.set(a.userId.trim().toUpperCase(), a);
        }
        memoryArchivedUsers = Array.from(archivedMap.values());
        void idbSet(STORAGE_ARCHIVE_VAULT_KEY, memoryArchivedUsers);
      }
    }
  } catch {}
  return memoryArchivedUsers;
};

export const restoreArchivedUserAsync = async (userId: string): Promise<UserProfile | null> => {
  await hydrateUsersFromIdb();
  const cleanId = userId.trim().toUpperCase();
  let restored: UserProfile | null = null;

  try {
    const res = await fetch(`/api/users/restore/${encodeURIComponent(cleanId)}`, {
      method: 'POST',
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data.user) {
        restored = data.user;
      }
    }
  } catch {}

  if (!restored) {
    const target = memoryArchivedUsers.find((u) => u.userId?.toUpperCase() === cleanId);
    if (target) {
      restored = {
        ...target,
        isArchived: false,
        archivedAt: undefined,
        archivedReason: undefined,
      };
    }
  }

  if (restored) {
    memoryArchivedUsers = memoryArchivedUsers.filter((u) => u.userId?.toUpperCase() !== cleanId);
    void idbSet(STORAGE_ARCHIVE_VAULT_KEY, memoryArchivedUsers);
    const current = getAllUsers();
    const merged = mergeUserLists(current, [restored]);
    saveUsers(merged);
    void syncUserToFirestore(restored);
    fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: merged }),
    }).catch(() => {});
  }

  return restored;
};

export const triggerAdminCloudSyncAsync = async (
  adminPin = 'IOISSYSTEM'
): Promise<{ users: UserProfile[]; cloudError?: string }> => {
  await hydrateUsersFromIdb();
  let cloudError: string | undefined;
  try {
    const res = await fetch('/api/admin/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminPin }),
    });
    if (res.ok) {
      const data = await res.json();
      cloudError = data?.cloudError;
    }
  } catch {}

  const users = await fetchUsersFromServer({ forceCloud: true });
  return { users, cloudError };
};

export const importUsersBackupAsync = async (
  importedUsers: UserProfile[]
): Promise<{ totalMerged: number; importedCount: number }> => {
  await hydrateUsersFromIdb();
  const validIncoming = (Array.isArray(importedUsers) ? importedUsers : []).filter(
    (u) =>
      u &&
      typeof u === 'object' &&
      typeof u.userId === 'string' &&
      u.userId.trim().length >= 3 &&
      typeof u.fullName === 'string' &&
      u.fullName.trim().length >= 2 &&
      !DEMO_USER_IDS.includes(u.userId.trim().toUpperCase())
  ).map((u) => ({
    ...u,
    userId: u.userId.trim().toUpperCase(),
    isArchived: false,
  }));

  const current = getAllUsers();
  const merged = mergeUserLists(current, validIncoming);
  saveUsers(merged);

  try {
    await fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: merged }),
    });
  } catch {}

  for (const u of validIncoming.slice(0, 25)) {
    void syncUserToFirestore(u);
  }

  return { totalMerged: merged.length, importedCount: validIncoming.length };
};
