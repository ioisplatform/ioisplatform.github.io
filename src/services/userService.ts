import { UserProfile, HelpTicket, KnowledgeItem } from '../types';
import { PLANS } from '../data/plansData';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  deleteDoc,
  onSnapshot 
} from 'firebase/firestore';

const STORAGE_USERS_KEY = 'iois_database_users_v2';
const STORAGE_CURRENT_USER_KEY = 'iois_current_session_user';
const STORAGE_ADMIN_SESSION_KEY = 'iois_admin_session_active';
const STORAGE_TICKETS_KEY = 'iois_help_tickets_v2';
const STORAGE_KNOWLEDGE_KEY = 'iois_ai_knowledge_v2';
const STORAGE_UNANSWERED_KEY = 'iois_ai_unanswered_v2';
const STORAGE_INTERVIEWS_KEY = 'iois_interviews_v2';

// Initial seed demo users
const INITIAL_DEMO_USERS: UserProfile[] = [
  {
    userId: 'IOIS999RK01',
    fullName: 'राहुल कुमार',
    mobileNumber: '+91 9876543210',
    email: 'rahul.kumar@example.com',
    selectedPlanId: 7,
    role: 'Supreme Master Partner',
    password: 'password123',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    paymentScreenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    paymentUtr: 'UTR20268877490845',
    paymentStatus: 'approved',
    createdAt: '2026-08-20T10:30:00Z',
    verifiedAt: '2026-08-20T11:00:00Z',
    address: 'Patna, Bihar',
    payoutUpi: 'rahul@upi',
  },
  {
    userId: 'IOIS49PS01',
    fullName: 'प्रिया शर्मा',
    mobileNumber: '+91 9811223344',
    email: 'priya.sharma@example.com',
    selectedPlanId: 2,
    role: 'Active Digital Learner',
    password: 'password123',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    paymentScreenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    paymentUtr: 'UTR202699112233',
    paymentStatus: 'pending',
    createdAt: '2026-08-23T08:15:00Z',
    address: 'Indore, MP',
    payoutUpi: 'priya@okhdfcbank',
  }
];

export const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
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
    answer: "IOIS में 7 मुख्य प्लान्स उपलब्ध हैं:\n\n1. **Plan 01: Bal Vikas Access (₹10)** -> ₹7 इंस्टेंट पेआउट प्रति रेफरल (70% पेआउट)\n2. **Plan 02: Youth Skill Access (₹49)** -> ₹34 इंस्टेंट पेआउट प्रति रेफरल (70% पेआउट)\n3. **Plan 03: Career & Job Access (₹99)** -> ₹64 इंस्टेंट पेआउट प्रति रेफरल (65% पेआउट)\n4. **Plan 04: Family VIP Access (₹199)** -> ₹119 इंस्टेंट पेआउट प्रति रेफरल (60% पेआउट)\n5. **Plan 05: Student Elite Access (₹299)** -> ₹179 इंस्टेंट पेआउट प्रति रेफरल (60% पेआउट)\n6. **Plan 06: Agency Reseller Hub (₹499)** -> ₹274 इंस्टेंट पेआउट प्रति रेफरल (55% पेआउट)\n7. **Plan 07: Master Lifetime Access (₹999)** -> ₹499 इंस्टेंट पेआउट प्रति रेफरल (50% पेआउट)\n\nहर प्लान में NCERT बुक्स, करियर नोट्स, CV टेम्प्लेट्स और डिजिटल लर्निंग किट शामिल हैं!",
    category: "Plans",
    createdAt: "2026-08-20T10:00:00Z",
    hits: 88
  },
  {
    id: "k-payout",
    question: "पेआउट कैसे और कब प्राप्त होता है?",
    answer: "IOIS में **स्मार्ट इंस्टेंट पेआउट प्रोटोकॉल** है:\n• जैसे ही आपके रेफरल लिंक या User ID से कोई नया सदस्य किसी भी प्लान में जुड़ता है और एडमिन द्वारा वेरिफाई होता है, उसका इंसेंटिव (₹7 से ₹499) तुरंत आपके रजिस्टर्ड UPI ID (PhonePe, Google Pay, Paytm) में भेज दिया जाता है।\n• कोई न्यूनतम निकासी सीमा नहीं है (0 Minimum Threshold) और कोई छिपा हुआ शुल्क नहीं काटा जाता।",
    category: "Payout",
    createdAt: "2026-08-20T10:00:00Z",
    hits: 62
  },
  {
    id: "k-idcard",
    question: "आधिकारिक डिजिटल ID कार्ड कैसे देखें या डाउनलोड करें?",
    answer: "डिजिटल ID कार्ड प्राप्त करने की विधि:\n1. शीर्ष मेन्यू या डैशबोर्ड से **'डिजिटल ID कार्ड' (ID Card Generator)** विकल्प खोलें।\n2. यहाँ आपका 256-Bit एन्क्रिप्टेड स्मार्ट डिजिटल पहचान पत्र (आगे और पीछे का भाग) लाइव दिखेगा।\n3. **'HD PNG डाउनलोड'** बटन पर क्लिक करें।\n4. आप सीधे **'कार्ड प्रिंट करें'** बटन दबाकर इसे तुरंत लेमिनेशन साइज में प्रिंट भी कर सकते हैं।",
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
    "question": "जाति, आय और निवास प्रमाण पत्र कैसे और कहाँ से बनता है? क्या-क्या डॉक्यूमेंट लगेगा?",
    answer: "जाति, आय व निवास प्रमाण पत्र ServicePlus RTPS पोर्टल (serviceonline.bihar.gov.in) या अपने राज्य के e-District पोर्टल से 100% मुफ्त बनता है:\n• **आवश्यक दस्तावेज:** आवेदक का आधार कार्ड (जिसमें नाम व पिता का नाम सही हो), पासपोर्ट साइज फोटो और स्व-घोषणा पत्र।\n• **समय सीमा:** 10 से 14 कार्य दिवस।\n• **कैसे बनता है:** पोर्टल पर सामान्य प्रशासन विभाग -> अंचल स्तर (RO/CO) चुनें, फॉर्म भरें, आधार कार्ड अपलोड करें और सबमिट करें। बनने के बाद 'Download Certificate' से डिजिटल साइन वाला PDF घर बैठे डाउनलोड हो जाता है।",
    category: "RTPS",
    createdAt: "2026-08-24T10:00:00Z",
    hits: 73
  },
  {
    id: "k-jamin-dakhil-kharij",
    question: "जमीन का दाखिल खारिज (Mutation) और परिमार्जन कैसे होता है?",
    answer: "जमीन दाखिल-खारिज और परिमार्जन बिहार भूमि पोर्टल (biharbhumi.bihar.gov.in) से होता है:\n• **दाखिल खारिज (नामांतरण):** जमीन की रजिस्टर्ड केवाला (Sale Deed) की PDF, विक्रेता की अद्यतन लगान रसीद और क्रेता-विक्रेता का आधार कार्ड लगता है। सरकारी फीस ₹0 (मुफ्त) है और 35 कार्य दिवसों में शुद्धि पत्र जारी होता है।\n• **परिमार्जन पोर्टल:** डिजिटल जमाबंदी में गलत नाम, छूटे हुए खाता/खेसरा या रकबा सुधार के लिए पुरानी रसीद, खतियान व स्व-घोषणा पत्र लगाकर ऑनलाइन आवेदन किया जाता है।\n• **LPC (Land Possession Certificate):** बैंक कृषि ऋण व सरकारी योजनाओं के लिए ऑनलाइन LPC अप्लाई किया जाता है।",
    category: "Land Reforms",
    createdAt: "2026-08-24T10:00:00Z",
    hits: 95
  },
  {
    id: "k-instant-pan-aadhaar",
    question: "10 मिनट में फ्री Instant e-PAN कार्ड कैसे बनाएं?",
    answer: "इनकम टैक्स ई-फाइलिंग पोर्टल (eportal.incometax.gov.in) के 'Instant e-PAN' विकल्प से बिना 1 रुपया खर्च किए 10 मिनट में नया डिजिटल पैन कार्ड बन जाता है:\n• **शर्त:** आधार कार्ड में मोबाइल नंबर लिंक होना चाहिए और पहले से कोई पैन कार्ड न बना हो।\n• **प्रक्रिया:** आधार नंबर डालें -> मोबाइल पर आया OTP दर्ज करें -> e-KYC विवरण स्वीकार करें -> सबमिट करें। 10 मिनट में e-PAN PDF डाउनलोड हो जाएगा।",
    category: "Aadhaar & PAN",
    createdAt: "2026-08-24T10:00:00Z",
    hits: 58
  },
  {
    id: "k-pension-scholarship",
    question: "वृद्धावस्था/विधवा पेंशन और छात्रवृत्ति (Scholarship) के लिए क्या करना होगा?",
    answer: "सरकारी पेंशन व छात्रवृत्ति के नियम:\n• **वृद्धावस्था पेंशन (60+ वर्ष):** SSPMIS पोर्टल पर आधार, बैंक पासबुक (DBT/NPCI लिंक्ड) और निवास प्रमाण पत्र से अप्लाई होता है। हर महीने ₹400-₹1000 खाते में आते हैं।\n• **छात्रवृत्ति (Post-Matric):** PMS पोर्टल (pmsonline.bihar.gov.in) पर 10वीं मार्कशीट, कॉलेज बोनाफाइड सर्टिफिकेट, फीस रसीद, जाति, आय व निवास अपलोड कर आवेदन होता है।\n• **कन्या उत्थान:** 12वीं पास छात्राओं को ₹25,000 और ग्रेजुएशन पास को ₹50,000 Medhasoft पोर्टल से सीधे खाते में मिलते हैं।",
    category: "Pensions & Scholarships",
    createdAt: "2026-08-24T10:00:00Z",
    hits: 81
  },
  {
    id: "k-capital-of-india",
    question: "भारत की राजधानी क्या है? (Capital of India)",
    answer: "🇮🇳 **भारत की राजधानी: नई दिल्ली (New Delhi)**\n• **उद्घाटन:** 13 फरवरी 1931 को नई दिल्ली आधिकारिक रूप से राजधानी बनी।\n• **प्रमुख प्रशासनिक केंद्र:** राष्ट्रपति भवन, नया संसद भवन, इंडिया गेट और सुप्रीम कोर्ट।\n• **प्रमुख राज्यों की राजधानियाँ:** बिहार -> पटना, उत्तर प्रदेश -> लखनऊ, महाराष्ट्र -> मुंबई, पश्चिम बंगाल -> कोलकाता।",
    category: "General Knowledge",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 120
  },
  {
    id: "k-capital-of-bihar",
    question: "बिहार की राजधानी क्या है? (Capital of Bihar)",
    answer: "🏛️ **बिहार की राजधानी: पटना (Patna)**\n• **ऐतिहासिक नाम:** पाटलिपुत्र (Patliputra)।\n• **महत्व:** गंगा नदी के तट पर स्थित प्राचीन और ऐतिहासिक नगर।\n• **प्रमुख स्थल:** गोलघर, पटना साहिब गुरुद्वारा, बिहार संग्रहालय, तख्त श्री हरिमंदिर जी।",
    category: "General Knowledge",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 90
  },
  {
    id: "k-godavari-river",
    question: "गोदावरी नदी का उद्गम कहाँ से होता है?",
    answer: "🌊 **गोदावरी नदी का उद्गम:**\n• **उद्गम स्थल:** महाराष्ट्र के नासिक जिले में स्थित **त्र्यंबकेश्वर (Trimbakeshwar / ब्रह्मगिरि पर्वत)** से होता है।\n• **उपनाम:** इसे 'दक्षिण गंगा' या 'वृद्ध गंगा' भी कहा जाता है।\n• **लंबाई व मुहाना:** 1,465 किमी लंबी यह नदी बंगाल की खाड़ी (आंध्र प्रदेश) में गिरती है।",
    category: "General Knowledge",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 85
  },
  {
    id: "k-student-study-portal",
    question: "विद्यार्थी शिक्षा पोर्टल (Student Study Portal) और नोट्स कहाँ मिलेंगे?",
    answer: "📚 **IOIS विद्यार्थी शिक्षा व अध्ययन केंद्र:**\n• होमपेज या मेन्यू में **'विद्यार्थी शिक्षा व करियर'** (Student Study Portal) बटन पर क्लिक करें।\n• यहाँ Class 1 से 12 और ग्रेजुएशन के सभी विषयों के NCERT नोट्स, गणित के सभी फॉर्मूला (Math Formula Sheets) और बोनाफाइड सर्टिफिकेट टेम्प्लेट्स 100% मुफ्त में उपलब्ध हैं।",
    category: "Education",
    createdAt: "2026-08-25T00:00:00Z",
    hits: 110
  },
  {
    id: "k-contact-official",
    question: "IOIS का आधिकारिक संपर्क और पेमेंट विवरण क्या है?",
    answer: "IOIS आधिकारिक संपर्क:\n• **आधिकारिक UPI ID:** 8877490845@spicepay (लाभार्थी: Vikas Kumar)\n• **व्हाट्सएप सपोर्ट:** +91 8877490845\n• **टेलीग्राम चैनल:** @ioisplatform\n• **ईमेल:** ioisplatform@gmail.com\n• **सपोर्ट समय:** 24x7 ऑल इंडिया हेल्पडेस्क",
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

// Merge multiple user lists without losing any existing users or pending/approved records
export const mergeUserLists = (...lists: (UserProfile[] | undefined | null)[]): UserProfile[] => {
  const map = new Map<string, UserProfile>();

  for (const list of lists) {
    if (!list || !Array.isArray(list)) continue;
    for (const u of list) {
      if (!u || !u.userId) continue;
      const key = u.userId.trim().toUpperCase();
      const existing = map.get(key);

      if (!existing) {
        map.set(key, { ...u });
      } else {
        // Keep approved status and newest fields
        const isApproved = existing.paymentStatus === 'approved' || u.paymentStatus === 'approved';
        const merged: UserProfile = {
          ...existing,
          ...u,
          paymentStatus: isApproved ? 'approved' : (u.paymentStatus || existing.paymentStatus),
          photoUrl: u.photoUrl || existing.photoUrl,
          paymentScreenshotUrl: u.paymentScreenshotUrl || existing.paymentScreenshotUrl,
          verifiedAt: u.verifiedAt || existing.verifiedAt,
          rejectionReason: u.rejectionReason || existing.rejectionReason,
        };
        map.set(key, merged);
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
    if (!db || !user.userId) return;
    const userRef = doc(db, 'users', user.userId.trim().toUpperCase());
    const cleanData = sanitizeForFirestore(user);
    await setDoc(userRef, cleanData, { merge: true });
  } catch (e) {
    console.warn('Firestore syncUser warning:', e);
  }
};

export const deleteUserFromFirestore = async (userId: string): Promise<void> => {
  try {
    if (!db || !userId) return;
    await deleteDoc(doc(db, 'users', userId.trim().toUpperCase()));
  } catch (e) {
    console.warn('Firestore deleteUser warning:', e);
  }
};

export const subscribeToFirestoreUsers = (onUpdate: (users: UserProfile[]) => void) => {
  try {
    if (!db) return () => {};
    const usersCol = collection(db, 'users');
    return onSnapshot(usersCol, (snapshot) => {
      const liveUsers: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        const u = docSnap.data() as UserProfile;
        if (u && u.userId) {
          liveUsers.push(u);
        }
      });
      if (liveUsers.length > 0) {
        const currentLocal = getAllUsers();
        const merged = mergeUserLists(liveUsers, currentLocal, INITIAL_DEMO_USERS);
        saveUsers(merged);
        onUpdate(merged);
      }
    }, (error) => {
      console.warn('Firestore users snapshot error:', error);
    });
  } catch (e) {
    console.warn('Failed to subscribe to firestore users:', e);
    return () => {};
  }
};

export const syncTicketToFirestore = async (ticket: HelpTicket): Promise<void> => {
  try {
    if (!db || !ticket.id) return;
    const ticketRef = doc(db, 'tickets', ticket.id);
    const cleanData = sanitizeForFirestore(ticket);
    await setDoc(ticketRef, cleanData, { merge: true });
  } catch (e) {
    console.warn('Firestore syncTicket warning:', e);
  }
};

export const subscribeToFirestoreTickets = (onUpdate: (tickets: HelpTicket[]) => void) => {
  try {
    if (!db) return () => {};
    const col = collection(db, 'tickets');
    return onSnapshot(col, (snapshot) => {
      const liveTickets: HelpTicket[] = [];
      snapshot.forEach((docSnap) => {
        const t = docSnap.data() as HelpTicket;
        if (t && t.id) liveTickets.push(t);
      });
      if (liveTickets.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(liveTickets));
        }
        onUpdate(liveTickets);
      }
    }, (error) => {
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
    if (!db || !item.id) return;
    const ref = doc(db, 'ai_knowledge', item.id);
    await setDoc(ref, sanitizeForFirestore(item), { merge: true });
  } catch (e) {
    console.warn('Firestore syncKnowledge warning:', e);
  }
};

export const deleteKnowledgeFromFirestore = async (id: string): Promise<void> => {
  try {
    if (!db || !id) return;
    await deleteDoc(doc(db, 'ai_knowledge', id));
  } catch (e) {
    console.warn('Firestore deleteKnowledge warning:', e);
  }
};

export const subscribeToFirestoreKnowledge = (onUpdate: (items: KnowledgeItem[]) => void) => {
  try {
    if (!db) return () => {};
    const col = collection(db, 'ai_knowledge');
    return onSnapshot(col, (snapshot) => {
      const liveItems: KnowledgeItem[] = [];
      snapshot.forEach((docSnap) => {
        const k = docSnap.data() as KnowledgeItem;
        if (k && k.id) liveItems.push(k);
      });
      if (liveItems.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KNOWLEDGE_KEY, JSON.stringify(liveItems));
        }
        onUpdate(liveItems);
      }
    }, (error) => {
      console.warn('Firestore knowledge snapshot error:', error);
    });
  } catch (e) {
    console.warn('Failed to subscribe to firestore knowledge:', e);
    return () => {};
  }
};

export const fetchKnowledgeFromFirestore = async (): Promise<KnowledgeItem[]> => {
  try {
    if (db) {
      const col = collection(db, 'ai_knowledge');
      const snap = await getDocs(col);
      const items: KnowledgeItem[] = [];
      snap.forEach((d) => {
        const data = d.data() as KnowledgeItem;
        if (data && data.id) items.push(data);
      });
      if (items.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KNOWLEDGE_KEY, JSON.stringify(items));
        }
        return items;
      }
    }
  } catch (e) {
    console.warn('Direct firestore knowledge read warning:', e);
  }

  // Fallback to server or local
  try {
    const res = await fetch('/api/ai/knowledge');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.knowledge) && data.knowledge.length > 0) {
        return data.knowledge;
      }
    }
  } catch (e) {
    // ignore
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
        localStorage.setItem(STORAGE_UNANSWERED_KEY, JSON.stringify(live));
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
          localStorage.setItem(STORAGE_INTERVIEWS_KEY, JSON.stringify(live));
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

export const getAllUsers = (): UserProfile[] => {
  if (typeof window === 'undefined') return INITIAL_DEMO_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_USERS;
  } catch (e) {
    return INITIAL_DEMO_USERS;
  }
};

export const saveUsers = (users: UserProfile[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage', e);
  }
};

/**
 * Fetch all users from Firestore + server + local cache and merge without data loss
 */
export const fetchUsersFromServer = async (): Promise<UserProfile[]> => {
  const localUsers = getAllUsers();
  const firestoreUsers: UserProfile[] = [];
  let serverUsers: UserProfile[] = [];

  // 1. Fetch from Firestore
  try {
    if (db) {
      const col = collection(db, 'users');
      const snap = await getDocs(col);
      snap.forEach((d) => {
        const u = d.data() as UserProfile;
        if (u && u.userId) firestoreUsers.push(u);
      });
    }
  } catch (e) {
    console.warn('Direct firestore users query warning:', e);
  }

  // 2. Fetch from backend server
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.users)) {
        serverUsers = data.users;
      }
    }
  } catch (err) {
    console.warn('Could not connect to server /api/users, using cached data.', err);
  }

  // Merge all data sources so old users and new users are all preserved
  const allMerged = mergeUserLists(firestoreUsers, serverUsers, localUsers, INITIAL_DEMO_USERS);
  saveUsers(allMerged);

  // Background self-healing sync: sync any server/local-only users to Firestore
  if (db && allMerged.length > 0) {
    setTimeout(() => {
      allMerged.forEach((u) => {
        if (!firestoreUsers.some((fu) => fu.userId.toUpperCase() === u.userId.toUpperCase())) {
          syncUserToFirestore(u).catch(() => {});
        }
      });
    }, 1000);
  }

  return allMerged;
};

export const registerNewUserAsync = async (
  data: Omit<UserProfile, 'userId' | 'paymentStatus' | 'createdAt'>
): Promise<UserProfile> => {
  const currentUsers = getAllUsers();
  const plan = PLANS.find((p) => p.id === data.selectedPlanId) || PLANS[0];
  const userId = generateCustomIOISUserId(data.fullName, plan.price, currentUsers);
  
  const newUser: UserProfile = {
    ...data,
    userId,
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
  };

  // 1. Save immediately to local device cache & active session (instant UI responsiveness)
  const updatedList = mergeUserLists([newUser], currentUsers, INITIAL_DEMO_USERS);
  saveUsers(updatedList);
  setCurrentUser(newUser);

  // 2. Parallel cloud database & backend server persistence with non-blocking timeout
  const firestorePromise = syncUserToFirestore(newUser);
  const serverPromise = fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  }).catch((err) => {
    console.warn('Server registration endpoint note:', err);
  });

  try {
    // Wait at most 1000ms so the user is never stuck on 'खाता बनाया जा रहा है...'
    await Promise.race([
      Promise.all([firestorePromise, serverPromise]),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);
  } catch (e) {
    console.warn('Background sync race note:', e);
  }

  return newUser;
};

export const registerNewUser = (data: Omit<UserProfile, 'userId' | 'paymentStatus' | 'createdAt'>): UserProfile => {
  const users = getAllUsers();
  const plan = PLANS.find((p) => p.id === data.selectedPlanId) || PLANS[0];
  const userId = generateCustomIOISUserId(data.fullName, plan.price, users);
  
  const newUser: UserProfile = {
    ...data,
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
  const index = users.findIndex((u) => u.userId.toUpperCase() === updatedProfile.userId.toUpperCase());
  if (index !== -1) {
    users[index] = {
      ...updatedProfile,
      userId: users[index].userId, // Immutable
    };
    saveUsers(users);
    
    // Update active session if this is the logged in user
    const current = getCurrentUser();
    if (current && current.userId.toUpperCase() === updatedProfile.userId.toUpperCase()) {
      setCurrentUser(users[index]);
    }

    // Sync with Firestore and server
    syncUserToFirestore(users[index]);
    fetch(`/api/users/${encodeURIComponent(updatedProfile.userId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users[index]),
    }).catch((e) => console.warn('Background update sync note:', e));

    return users[index];
  }
  return updatedProfile;
};

/**
 * Flexible cross-device user login with Firestore + Server verification + local fallback
 */
export const loginUserAsync = async (
  identifier: string, 
  password?: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
  const cleanId = identifier.trim();
  if (!cleanId) {
    return { success: false, error: 'कृपया अपना User ID, मोबाइल नंबर या ईमेल दर्ज करें।' };
  }

  const cleanLower = cleanId.toLowerCase();
  const cleanUpper = cleanId.toUpperCase();
  const digits = cleanLower.replace(/\D/g, '');

  let matchedUser: UserProfile | null = null;

  // 1. Direct Firestore document lookup (Instant O(1) fetch if User ID)
  if (db && cleanId.length >= 4) {
    try {
      const docRef = doc(db, 'users', cleanUpper);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        matchedUser = snap.data() as UserProfile;
      }
    } catch (e) {
      console.warn('Direct Firestore doc get note:', e);
    }
  }

  // 2. Query Firestore collection if not found via direct ID
  if (!matchedUser && db) {
    try {
      const col = collection(db, 'users');
      const snap = await getDocs(col);
      snap.forEach((d) => {
        const u = d.data() as UserProfile;
        if (u && !matchedUser) {
          const uidMatch = u.userId && u.userId.toUpperCase() === cleanUpper;
          const uDigits = (u.mobileNumber || '').replace(/\D/g, '');
          const mobMatch = digits.length >= 10 && uDigits.endsWith(digits.slice(-10));
          const emailMatch = u.email && u.email.toLowerCase() === cleanLower;
          if (uidMatch || mobMatch || emailMatch) {
            matchedUser = u;
          }
        }
      });
    } catch (e) {
      console.warn('Direct firestore login check warning:', e);
    }
  }

  // 3. Try Server API Login (fetches from server database)
  if (!matchedUser) {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        matchedUser = data.user;
      } else if (res.status === 401) {
        return { success: false, error: data.error || 'दर्ज किया गया पासवर्ड गलत है।' };
      }
    } catch (err) {
      console.warn('Server login note:', err);
    }
  }

  // 4. Local cache fallback
  if (!matchedUser) {
    matchedUser = loginUser(identifier, password);
  }

  // If user is not found in any source
  if (!matchedUser) {
    return {
      success: false,
      error: 'यह User ID या मोबाइल नंबर पंजीकृत नहीं है। कृपया सही विवरण दर्ज करें या नया रजिस्ट्रेशन करें।',
    };
  }

  // Password verification if password is provided
  if (password && matchedUser.password && matchedUser.password !== password) {
    return { success: false, error: 'दर्ज किया गया पासवर्ड गलत है।' };
  }

  // Persist logged-in user to local cache & active session
  const all = getAllUsers();
  const merged = mergeUserLists([matchedUser], all, INITIAL_DEMO_USERS);
  saveUsers(merged);
  setCurrentUser(matchedUser);

  return { success: true, user: matchedUser };
};

export const loginUser = (identifier: string, password?: string): UserProfile | null => {
  const users = getAllUsers();
  const cleanId = identifier.trim().toLowerCase();
  const cleanDigits = cleanId.replace(/\D/g, '');
  
  const user = users.find(
    (u) => 
      u.userId.toLowerCase() === cleanId || 
      (cleanDigits.length >= 10 && u.mobileNumber.replace(/\D/g, '').endsWith(cleanDigits.slice(-10))) ||
      u.email.toLowerCase() === cleanId
  );

  if (!user) return null;

  if (user.password && password && user.password !== password) {
    return null;
  }

  setCurrentUser(user);
  return user;
};

export const getCurrentUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const setCurrentUser = (user: UserProfile | null): void => {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  } else {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
  }
};

export const logoutUser = (): void => {
  setCurrentUser(null);
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
  return localStorage.getItem(STORAGE_ADMIN_SESSION_KEY) === 'true';
};

export const setAdminSession = (active: boolean): void => {
  if (typeof window === 'undefined') return;
  if (active) {
    localStorage.setItem(STORAGE_ADMIN_SESSION_KEY, 'true');
  } else {
    localStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
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
  try {
    await deleteUserFromFirestore(userId);
    await fetch(`/api/users/${encodeURIComponent(userId)}`, { method: 'DELETE' });
  } catch (e) {
    console.warn('Delete user note:', e);
  }
  const users = getAllUsers().filter((u) => u.userId.toUpperCase() !== userId.toUpperCase());
  saveUsers(users);
  return true;
};

// Help & Support Tickets Engine
export const getHelpTickets = (): HelpTicket[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_TICKETS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const fetchTicketsFromServer = async (): Promise<HelpTicket[]> => {
  // Check Firestore first
  try {
    if (db) {
      const col = collection(db, 'tickets');
      const snap = await getDocs(col);
      const firestoreTickets: HelpTicket[] = [];
      snap.forEach((d) => {
        const t = d.data() as HelpTicket;
        if (t && t.id) firestoreTickets.push(t);
      });
      if (firestoreTickets.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(firestoreTickets));
        }
        return firestoreTickets;
      }
    }
  } catch (e) {
    console.warn('Firestore tickets query note:', e);
  }

  try {
    const res = await fetch('/api/tickets');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.tickets)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(data.tickets));
        }
        return data.tickets;
      }
    }
  } catch (e) {
    console.warn('Tickets fetch note:', e);
  }
  return getHelpTickets();
};

export const createHelpTicket = (ticket: Omit<HelpTicket, 'id' | 'createdAt' | 'status'>): HelpTicket => {
  const tickets = getHelpTickets();
  const newTicket: HelpTicket = {
    ...ticket,
    id: 'TICKET-' + Math.floor(100000 + Math.random() * 900000),
    createdAt: new Date().toISOString(),
    status: 'open',
  };
  tickets.unshift(newTicket);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(tickets));
  }

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
  const tickets = getHelpTickets();
  const index = tickets.findIndex((t) => t.id === ticketId);
  if (index !== -1) {
    tickets[index].adminReply = reply;
    tickets[index].status = status;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(tickets));
    }

    syncTicketToFirestore(tickets[index]);
    fetch(`/api/tickets/${encodeURIComponent(ticketId)}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminReply: reply, status }),
    }).catch((e) => console.warn('Background ticket reply note:', e));
  }
};
