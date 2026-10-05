import { MemberProfile, ActiveSession } from '../types';
import { db } from './firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';

const USERS_STORAGE_KEY = 'iois_registered_members_v4';
const CURRENT_USER_KEY = 'iois_current_active_session_v4';
const ADMIN_SESSION_KEY = 'iois_admin_active_session_v4';

// -------------------------------------------------------------
// LOCALSTORAGE CACHE HELPERS
// -------------------------------------------------------------
export const getStoredMembers = (): MemberProfile[] => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveMembersLocally = (members: MemberProfile[]) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.warn('Failed to save members to localStorage:', e);
  }
};

// -------------------------------------------------------------
// UNIQUE, NON-EDITABLE STUDENT USER ID / ROLL NUMBER GENERATOR
// Formula: IOIS + [Plan Tag: 10] + [Initials: RK for Rahul Kumar / राहुल कुमार] + [Serial: 01 for first member]
// e.g. IOIS10RK01 (IOIS + 10 Plan + RK Rahul Kumar + 01 First Member of Plan 10)
// -------------------------------------------------------------
const devanagariToLatin: Record<string, string> = {
  'अ': 'A', 'आ': 'A', 'इ': 'I', 'ई': 'I', 'उ': 'U', 'ऊ': 'U', 'ऋ': 'R', 'ए': 'E', 'ऐ': 'A', 'ओ': 'O', 'औ': 'A',
  'क': 'K', 'ख': 'K', 'ग': 'G', 'घ': 'G', 'ङ': 'N',
  'च': 'C', 'छ': 'C', 'ज': 'J', 'झ': 'J', 'ञ': 'N',
  'ट': 'T', 'ठ': 'T', 'ड': 'D', 'ढ': 'D', 'ण': 'N',
  'त': 'T', 'थ': 'T', 'द': 'D', 'ध': 'D', 'न': 'N',
  'प': 'P', 'फ': 'P', 'ब': 'B', 'भ': 'B', 'म': 'M',
  'य': 'Y', 'र': 'R', 'ल': 'L', 'व': 'V', 'श': 'S', 'ष': 'S', 'स': 'S', 'ह': 'H'
};

const getFirstCharLatin = (word: string): string => {
  if (!word) return '';
  const first = word[0];
  if (/[A-Za-z]/.test(first)) return first.toUpperCase();
  if (devanagariToLatin[first]) return devanagariToLatin[first];
  return '';
};

export const extractNameInitials = (name: string): string => {
  if (!name || !name.trim()) return 'RK';
  const clean = name.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  
  if (words.length >= 2) {
    const c1 = getFirstCharLatin(words[0]) || 'R';
    const c2 = getFirstCharLatin(words[1]) || 'K';
    return `${c1}${c2}`;
  } else if (words.length === 1) {
    const word = words[0];
    const c1 = getFirstCharLatin(word) || 'R';
    // If English word has 2+ characters
    if (word.length >= 2 && /[A-Za-z]/.test(word[1])) {
      return `${c1}${word[1].toUpperCase()}`;
    }
    // If Devanagari word has 2nd character
    if (word.length >= 2 && devanagariToLatin[word[1]]) {
      return `${c1}${devanagariToLatin[word[1]]}`;
    }
    return `${c1}K`;
  }
  return 'RK';
};

export const generateUniqueStudentId = (
  name: string = 'राहुल कुमार',
  planId: string = 'plan-01',
  allMembers?: MemberProfile[]
): string => {
  const planTagMap: Record<string, string> = {
    'plan-01': '10',
    '1': '10',
    '01': '10',
    'plan-1': '10',
    '10': '10',
    'plan-02': '49',
    '2': '49',
    '02': '49',
    'plan-2': '49',
    '49': '49',
    'plan-03': '99',
    '3': '99',
    '03': '99',
    'plan-3': '99',
    '99': '99',
    'plan-04': '199',
    '4': '199',
    '04': '199',
    'plan-4': '199',
    '199': '199',
    'plan-05': '299',
    '5': '299',
    '05': '299',
    'plan-5': '299',
    '299': '299',
    'plan-06': '499',
    '6': '499',
    '06': '499',
    'plan-6': '499',
    '499': '499',
    'plan-07': '999',
    '7': '999',
    '07': '999',
    'plan-7': '999',
    '999': '999',
  };
  const planTag = planTagMap[planId] || '10';
  const initials = extractNameInitials(name);

  const members = allMembers || getStoredMembers();
  
  // Count existing members enrolled in this specific plan
  const planMembers = members.filter(m => m.planId === planId);
  let seq = planMembers.length + 1;
  let seqStr = seq < 10 ? `0${seq}` : `${seq}`;
  let candidate = `IOIS${planTag}${initials}${seqStr}`;

  // Ensure absolute uniqueness across all members in system
  while (members.some(m => m.memberId === candidate || m.rollNumber === candidate)) {
    seq++;
    seqStr = seq < 10 ? `0${seq}` : `${seq}`;
    candidate = `IOIS${planTag}${initials}${seqStr}`;
  }

  return candidate;
};

// Alias for backward compatibility across existing calls
export const generatePlanRollNumber = (
  planId: string, 
  currentTotal: number = 0,
  allMembers?: MemberProfile[],
  name: string = 'Student'
): string => {
  return generateUniqueStudentId(name, planId, allMembers);
};

// -------------------------------------------------------------
// FIRESTORE SYNC & PERSISTENCE
// -------------------------------------------------------------

// Save or Update user in Firestore
export const syncUserToFirestore = async (user: MemberProfile): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', user.memberId);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Firestore write warning (running in offline/cached mode):', err);
    return false;
  }
};

// Fetch all users from Firestore (Merges with local cache)
export const fetchAllMembersFromFirestore = async (): Promise<MemberProfile[]> => {
  const localList = getStoredMembers();
  try {
    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);
    
    if (snapshot.empty) {
      return localList;
    }

    const firestoreUsers: MemberProfile[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as MemberProfile;
      firestoreUsers.push(data);
    });

    // Merge and deduplicate by memberId
    const mergedMap = new Map<string, MemberProfile>();
    localList.forEach(u => mergedMap.set(u.memberId, u));
    firestoreUsers.forEach(u => mergedMap.set(u.memberId, u));

    const finalMembers = Array.from(mergedMap.values());
    saveMembersLocally(finalMembers);
    return finalMembers;
  } catch (err) {
    console.warn('Firestore fetch warning (fallback to local cache):', err);
    return localList;
  }
};

// -------------------------------------------------------------
// REGISTRATION (STEP-BY-STEP SECURE WITH NON-EDITABLE ROLL NUMBER)
// -------------------------------------------------------------
export interface RegisterInput {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  address?: string; // Full Address (House / Village / City / District / State / PIN)
  grade?: string;
  planId: string;
  planName: string;
  amountPaid: number;
  paymentRef?: string;
  sponsorName?: string;
  sponsorId?: string;
  withdrawalUpi?: string; // UPI ID or Bank account details
  paymentScreenshotUrl?: string;
  paymentAddressProofUrl?: string;
  password?: string;
  avatarUrl?: string;
  customQrUrl?: string;
  customQrImage?: string;
}

export const registerStudentToDatabase = async (
  input: RegisterInput
): Promise<{ success: boolean; member?: MemberProfile; message: string }> => {
  // Fast local check first (0ms), fall back to Firestore if local cache is empty
  let allMembers = getStoredMembers();
  if (!allMembers.length) {
    try {
      allMembers = await Promise.race([
        fetchAllMembersFromFirestore(),
        new Promise<MemberProfile[]>((resolve) => setTimeout(() => resolve([]), 1200))
      ]);
    } catch {
      allMembers = getStoredMembers();
    }
  }

  // Validate Clean Phone (10 digits)
  const cleanPhone = input.phone.trim().replace(/\D/g, '').slice(-10);
  if (cleanPhone.length < 10) {
    return {
      success: false,
      message: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।'
    };
  }

  // Duplicate Check 1: Mobile Number
  const phoneExists = allMembers.some(
    m => m.phone.replace(/\D/g, '').slice(-10) === cleanPhone
  );
  if (phoneExists) {
    return {
      success: false,
      message: 'यह मोबाइल नंबर पहले से पंजीकृत है! कृपया इस नंबर से लॉगिन करें या Forgot User ID/Password का उपयोग करें।'
    };
  }

  // Duplicate Check 2: Email Address (Strict Unique Email)
  const cleanEmail = input.email?.trim().toLowerCase();
  if (cleanEmail) {
    const emailExists = allMembers.some(
      m => m.email && m.email.trim().toLowerCase() === cleanEmail
    );
    if (emailExists) {
      return {
        success: false,
        message: 'यह ईमेल आईडी पहले से किसी अन्य खाते में पंजीकृत है! कृपया भिन्न ईमेल का उपयोग करें।'
      };
    }
  }

  // Generate Non-editable, Permanent Unique Student ID / Roll Number
  // Format: IOIS + Plan (10) + Initials (RK) + Serial (01) -> e.g. IOIS10RK01
  const rollNumber = generateUniqueStudentId(input.name, input.planId, allMembers);
  
  // Unique Member ID
  const memberId = rollNumber;
  const now = new Date();
  const joinedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

  // Build Authorized Accessible Plans
  // Plan 07 unlocks all 7 plans; others unlock their registered plan
  const accessiblePlans = input.planId === 'plan-07' 
    ? ['plan-01', 'plan-02', 'plan-03', 'plan-04', 'plan-05', 'plan-06', 'plan-07']
    : [input.planId];

  // STRICT SECURITY: Status starts as 'Pending' until Admin verifies Payment Screenshot & UTR!
  const newStudent: MemberProfile = {
    name: input.name.trim(),
    phone: cleanPhone,
    email: cleanEmail || '',
    city: input.city?.trim() || 'बिहार',
    state: input.state?.trim() || 'भारत',
    address: input.address?.trim() || '',
    grade: input.grade || 'Primary / General',
    memberId: memberId,
    rollNumber: rollNumber, // STRICTLY NON-EDITABLE & SYMBOL-FREE (e.g. IOIS10RK01)
    planId: input.planId,
    planName: input.planName,
    amountPaid: input.amountPaid,
    paymentRef: input.paymentRef?.trim() || '',
    sponsorName: input.sponsorName?.trim() || '',
    sponsorId: input.sponsorId?.trim() || '',
    withdrawalUpi: input.withdrawalUpi?.trim() || '',
    paymentScreenshotUrl: input.paymentScreenshotUrl || '',
    paymentAddressProofUrl: input.paymentAddressProofUrl || '',
    joinedDate: joinedDate,
    status: 'Pending', // STRICT SECURITY: Must be verified by Admin before dashboard/kit access!
    role: 'student',
    accessiblePlans: accessiblePlans,
    password: input.password || 'iois12345',
    avatarUrl: input.avatarUrl || '',
    customQrUrl: input.customQrUrl || '',
    customQrImage: input.customQrImage || ''
  };

  // 1. Save Locally
  const updatedList = [newStudent, ...allMembers];
  saveMembersLocally(updatedList);

  // 2. Persist to Firestore Database in background without blocking UI
  syncUserToFirestore(newStudent).catch(err => {
    console.warn('Background Firestore sync queued:', err);
  });

  return {
    success: true,
    member: newStudent,
    message: `पंजीकरण सफल! आपका User ID: ${rollNumber} दर्ज हो गया है। एडमिन द्वारा पेमेंट सत्यापन के बाद खाता सक्रिय होगा।`
  };
};

// -------------------------------------------------------------
// STUDENT LOGIN & AUTHENTICATION (MULTI-DEVICE LIVE SYNC)
// -------------------------------------------------------------
export const authenticateStudent = async (
  identifier: string,
  pass: string
): Promise<{ success: boolean; member?: MemberProfile; message: string; isPending?: boolean }> => {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPhone = identifier.replace(/\D/g, '').slice(-10);

  // 1. FAST LOCAL CHECK (0ms): Check local storage cache first
  let members = getStoredMembers();
  let matched = members.find(m => {
    const matchRoll = m.rollNumber && m.rollNumber.toLowerCase() === cleanId;
    const matchMemberId = m.memberId && m.memberId.toLowerCase() === cleanId;
    const matchPhone = cleanPhone.length === 10 && m.phone.replace(/\D/g, '').slice(-10) === cleanPhone;
    const matchEmail = m.email && m.email.toLowerCase() === cleanId;
    return matchRoll || matchMemberId || matchPhone || matchEmail;
  });

  // 2. If not found in local cache, query Firestore with 1.2s timeout
  if (!matched) {
    try {
      const freshMembers = await Promise.race([
        fetchAllMembersFromFirestore(),
        new Promise<MemberProfile[]>((resolve) => setTimeout(() => resolve([]), 1200))
      ]);
      if (freshMembers.length) {
        members = freshMembers;
        matched = members.find(m => {
          const matchRoll = m.rollNumber && m.rollNumber.toLowerCase() === cleanId;
          const matchMemberId = m.memberId && m.memberId.toLowerCase() === cleanId;
          const matchPhone = cleanPhone.length === 10 && m.phone.replace(/\D/g, '').slice(-10) === cleanPhone;
          const matchEmail = m.email && m.email.toLowerCase() === cleanId;
          return matchRoll || matchMemberId || matchPhone || matchEmail;
        });
      }
    } catch {
      // Offline fallback
    }
  }

  if (!matched) {
    return {
      success: false,
      message: 'विद्यार्थी खाता नहीं मिला! कृपया अपना User ID (उदा. IOIS10RK01), पंजीकृत मोबाइल नंबर या ईमेल सही दर्ज करें।'
    };
  }

  // Password check (if set)
  if (matched.password && matched.password !== pass) {
    return {
      success: false,
      message: 'गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें या "Forgot Password" पर क्लिक करें।'
    };
  }

  // STRICT VERIFICATION GATE:
  // If account is Pending Admin Verification
  if (matched.status === 'Pending') {
    return {
      success: false,
      isPending: true,
      member: matched,
      message: `खाता सत्यापन लंबित (Pending Admin Verification): प्रिय ${matched.name}, आपका पेमेंट स्क्रीनशॉट व UTR एडमिन सत्यापन के लिए कतार में है। एडमिन द्वारा वेरीफाई होते ही आपका डैशबोर्ड सक्रिय हो जाएगा।`
    };
  }

  if (matched.status === 'Rejected') {
    return {
      success: false,
      message: 'खाता अस्वीकृत (Account Rejected): आपका पेमेंट स्क्रीनशॉट या UTR अमान्य पाया गया है। कृपया आधिकारिक हेल्पलाइन +918877490845 पर संपर्क करें।'
    };
  }

  // Verified or Active -> Grant Access and register device session
  const activeUser = await registerOrUpdateDeviceSession(matched);

  return {
    success: true,
    member: activeUser,
    message: `स्वागत है, ${activeUser.name}! आपका User ID ${activeUser.rollNumber} सत्यापित हुआ।`
  };
};

// -------------------------------------------------------------
// FORGOT USER ID & PASSWORD RECOVERY ENGINE
// Matches Registered Mobile + Email against Database
// -------------------------------------------------------------
export const recoverUserCredentials = async (
  phoneInput: string,
  emailInput: string
): Promise<{ success: boolean; member?: MemberProfile; message: string }> => {
  let members = await fetchAllMembersFromFirestore();
  if (!members.length) {
    members = getStoredMembers();
  }

  const cleanPhone = phoneInput.replace(/\D/g, '').slice(-10);
  const cleanEmail = emailInput.trim().toLowerCase();

  if (cleanPhone.length < 10) {
    return {
      success: false,
      message: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।'
    };
  }

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: 'कृपया मान्य पंजीकृत ईमेल आईडी दर्ज करें।'
    };
  }

  // Match registered mobile AND email
  const matched = members.find(m => {
    const pMatch = m.phone.replace(/\D/g, '').slice(-10) === cleanPhone;
    const eMatch = m.email && m.email.trim().toLowerCase() === cleanEmail;
    return pMatch && eMatch;
  });

  if (!matched) {
    return {
      success: false,
      message: 'दिए गए मोबाइल नंबर और ईमेल से मेल खाता कोई खाता नहीं मिला! कृपया विवरण जांचें।'
    };
  }

  return {
    success: true,
    member: matched,
    message: `खाता मिल गया! आपका User ID: ${matched.rollNumber || matched.memberId} है।`
  };
};

// Reset Password after recovery match
export const resetUserPassword = async (
  memberId: string,
  newPass: string
): Promise<{ success: boolean; message: string }> => {
  if (!newPass || newPass.length < 8) {
    return {
      success: false,
      message: 'नया पासवर्ड कम से कम 8 अक्षरों का होना अनिवार्य है।'
    };
  }

  const members = getStoredMembers();
  const index = members.findIndex(m => m.memberId === memberId || m.rollNumber === memberId);
  if (index === -1) {
    return {
      success: false,
      message: 'खाता अपडेट नहीं हो सका।'
    };
  }

  members[index].password = newPass;
  saveMembersLocally(members);

  try {
    const userRef = doc(db, 'users', memberId);
    await updateDoc(userRef, {
      password: newPass,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Firestore password reset offline fallback:', e);
  }

  return {
    success: true,
    message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।'
  };
};

// -------------------------------------------------------------
// LIVE MULTI-DEVICE SESSION REFRESH
// Refreshes local user session from Firestore
// -------------------------------------------------------------
export const syncCurrentSessionWithFirestore = async (): Promise<MemberProfile | null> => {
  const current = getCurrentSessionUser();
  if (!current) return null;

  try {
    const userRef = doc(db, 'users', current.memberId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const freshData = snap.data() as MemberProfile;
      setCurrentSessionUser(freshData);
      return freshData;
    }
  } catch (err) {
    console.warn('Live multi-device sync fallback to cache:', err);
  }
  return current;
};

// -------------------------------------------------------------
// ACCESS PERMISSION & ENTITLEMENT ENGINE
// User cannot view kit without login; user can only view their paid kit!
// -------------------------------------------------------------
export const canUserAccessPlanKit = (
  user: MemberProfile | null,
  planId: string
): { hasAccess: boolean; reason: 'not_logged_in' | 'plan_mismatch' | 'payment_pending' | 'granted' } => {
  // 1. Without login, access is strictly blocked
  if (!user) {
    return {
      hasAccess: false,
      reason: 'not_logged_in'
    };
  }

  // 2. Admin has universal access
  if (user.role === 'admin' || (user.status === 'Active' && user.email === 'ioisplatform@gmail.com')) {
    return {
      hasAccess: true,
      reason: 'granted'
    };
  }

  // 3. Payment pending or rejected check
  if (user.status === 'Pending' || user.status === 'Rejected') {
    return {
      hasAccess: false,
      reason: 'payment_pending'
    };
  }

  // 4. Supreme Master Plan (plan-07) unlocks everything
  if (user.planId === 'plan-07') {
    return {
      hasAccess: true,
      reason: 'granted'
    };
  }

  // 5. Check if user's accessiblePlans array contains the requested planId
  if (user.accessiblePlans && user.accessiblePlans.includes(planId)) {
    return {
      hasAccess: true,
      reason: 'granted'
    };
  }

  // 6. Check if registered plan matches
  if (user.planId === planId) {
    return {
      hasAccess: true,
      reason: 'granted'
    };
  }

  // Otherwise, blocked due to plan mismatch
  return {
    hasAccess: false,
    reason: 'plan_mismatch'
  };
};

// -------------------------------------------------------------
// CURRENT ACTIVE SESSION MANAGEMENT
// -------------------------------------------------------------
export const getCurrentSessionUser = (): MemberProfile | null => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCurrentSessionUser = (user: MemberProfile | null) => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.warn('Session write error:', e);
  }
};

// -------------------------------------------------------------
// USER PROFILE UPDATE (USER CAN EDIT ALL DETAILS EXCEPT USER ID)
// User ID & Plan are permanent / non-editable
// -------------------------------------------------------------
export const updateStudentProfile = async (
  memberId: string,
  updates: Partial<MemberProfile>
): Promise<MemberProfile | null> => {
  const members = getStoredMembers();
  const idx = members.findIndex(m => m.memberId === memberId || m.rollNumber === memberId);
  if (idx === -1) return null;

  // Protect non-editable fields!
  // USER APNE ID CARD PAR USER ID KE ALWA SAB EDIT KAR SAKE
  const protectedFields = ['memberId', 'rollNumber', 'planId', 'amountPaid'];
  const sanitizedUpdates: Partial<MemberProfile> = {};
  
  for (const key of Object.keys(updates) as (keyof MemberProfile)[]) {
    if (!protectedFields.includes(key)) {
      (sanitizedUpdates as any)[key] = updates[key];
    }
  }

  const updatedUser: MemberProfile = {
    ...members[idx],
    ...sanitizedUpdates
  };

  members[idx] = updatedUser;
  saveMembersLocally(members);

  // Sync to Firestore
  try {
    await syncUserToFirestore(updatedUser);
  } catch (err) {
    console.warn('Firestore update warning:', err);
  }

  // If current session is this user, update active session
  const current = getCurrentSessionUser();
  if (current && (current.memberId === memberId || current.rollNumber === memberId)) {
    setCurrentSessionUser(updatedUser);
  }

  return updatedUser;
};

// -------------------------------------------------------------
// MULTI-DEVICE SESSION & CONNECTED DEVICES MANAGEMENT
// -------------------------------------------------------------
const DEVICE_CLIENT_ID_KEY = 'iois_device_client_id_v1';

export const getLocalDeviceId = (): string => {
  try {
    let id = localStorage.getItem(DEVICE_CLIENT_ID_KEY);
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(DEVICE_CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return 'dev_unknown_session';
  }
};

export const detectClientDeviceInfo = (city?: string, state?: string): ActiveSession => {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const currentId = getLocalDeviceId();

  let os = 'Unknown OS';
  if (/android/i.test(ua)) os = 'Android';
  else if (/ipad|iphone|ipod/i.test(ua)) os = 'iOS';
  else if (/windows nt/i.test(ua)) os = 'Windows PC';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Chrome';
  if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/chrome|crios/i.test(ua) && !/edge|edg/i.test(ua)) browser = 'Google Chrome';
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Apple Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';

  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/ipad|tablet/i.test(ua)) deviceType = 'tablet';
  else if (/mobile|android|iphone/i.test(ua)) deviceType = 'mobile';

  const deviceName = `${browser} on ${os}`;
  const location = city && state ? `${city}, ${state}` : 'वर्तमान डिवाइस (भारत)';

  const now = new Date();
  const timeStr = now.toLocaleDateString('hi-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return {
    id: currentId,
    deviceName,
    deviceType,
    browser,
    os,
    location,
    loginTime: timeStr,
    lastActive: 'अभी सक्रिय (Active Now)',
    isCurrent: true
  };
};

export const registerOrUpdateDeviceSession = async (user: MemberProfile): Promise<MemberProfile> => {
  const currentSession = detectClientDeviceInfo(user.city, user.state);
  const existingSessions = user.activeSessions || [];
  
  // Filter out this device if already present, mark others as not current
  const otherSessions = existingSessions
    .filter(s => s.id !== currentSession.id)
    .map(s => ({ ...s, isCurrent: false }));
  
  // Keep up to 4 devices (enforcing multi-device security limit of max 4 concurrent sessions)
  const updatedSessions: ActiveSession[] = [
    currentSession,
    ...otherSessions
  ].slice(0, 4);

  const updatedUser: MemberProfile = {
    ...user,
    activeSessions: updatedSessions
  };

  const members = getStoredMembers();
  const index = members.findIndex(m => m.memberId === user.memberId || m.rollNumber === user.rollNumber);
  if (index !== -1) {
    members[index] = updatedUser;
    saveMembersLocally(members);
  }
  setCurrentSessionUser(updatedUser);

  try {
    const userRef = doc(db, 'users', user.memberId);
    await updateDoc(userRef, {
      activeSessions: updatedSessions,
      lastActiveAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Device session Firestore sync offline fallback:', e);
  }

  return updatedUser;
};

export const getUserConnectedDevices = (user: MemberProfile): ActiveSession[] => {
  const currentDeviceId = getLocalDeviceId();
  let sessions = user.activeSessions || [];
  
  // If no sessions recorded yet, initialize with current device
  if (sessions.length === 0) {
    const defaultCur = detectClientDeviceInfo(user.city, user.state);
    sessions = [defaultCur];
  }

  return sessions.map(s => ({
    ...s,
    isCurrent: s.id === currentDeviceId
  }));
};

export const logoutDeviceSession = async (
  memberId: string, 
  sessionId: string
): Promise<{ success: boolean; isCurrentDevice: boolean; updatedUser?: MemberProfile }> => {
  const currentDeviceId = getLocalDeviceId();
  const isCurrentDevice = sessionId === currentDeviceId;

  const members = getStoredMembers();
  const index = members.findIndex(m => m.memberId === memberId || m.rollNumber === memberId);
  if (index === -1) return { success: false, isCurrentDevice };

  const user = members[index];
  const updatedSessions = (user.activeSessions || []).filter(s => s.id !== sessionId);

  const updatedUser: MemberProfile = {
    ...user,
    activeSessions: updatedSessions
  };

  members[index] = updatedUser;
  saveMembersLocally(members);

  if (isCurrentDevice) {
    setCurrentSessionUser(null);
  } else {
    setCurrentSessionUser(updatedUser);
  }

  try {
    const userRef = doc(db, 'users', user.memberId);
    await updateDoc(userRef, {
      activeSessions: updatedSessions,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Device logout Firestore fallback:', e);
  }

  return { success: true, isCurrentDevice, updatedUser };
};

export const logoutAllDevices = async (
  memberId: string
): Promise<{ success: boolean }> => {
  const members = getStoredMembers();
  const index = members.findIndex(m => m.memberId === memberId || m.rollNumber === memberId);
  
  if (index !== -1) {
    const user = members[index];
    const updatedUser: MemberProfile = {
      ...user,
      activeSessions: [],
      sessionRevokedAt: new Date().toISOString()
    };
    members[index] = updatedUser;
    saveMembersLocally(members);
  }

  // Clear current active session immediately
  setCurrentSessionUser(null);

  try {
    const userRef = doc(db, 'users', memberId);
    await updateDoc(userRef, {
      activeSessions: [],
      sessionRevokedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Logout all devices Firestore fallback:', e);
  }

  return { success: true };
};

// -------------------------------------------------------------
// ADMIN OPERATIONS (SECURE DATABASE OVERRIDES)
// Allows admin to change plan, update amount, toggle status, grant kit
// -------------------------------------------------------------
export const adminUpdateStudentKitAccess = async (
  memberId: string,
  newPlanId: string,
  newPlanName: string,
  newAmountPaid: number,
  newStatus: 'Pending' | 'Verified' | 'Active' | 'Rejected',
  customAccessiblePlans?: string[]
): Promise<boolean> => {
  const members = getStoredMembers();
  const index = members.findIndex(m => m.memberId === memberId);
  if (index === -1) return false;

  const user = members[index];
  
  // If user upgraded plan, generate updated roll number or keep roll number tied
  const updatedPlans = customAccessiblePlans || (
    newPlanId === 'plan-07' 
      ? ['plan-01', 'plan-02', 'plan-03', 'plan-04', 'plan-05', 'plan-06', 'plan-07']
      : [newPlanId]
  );

  const updatedUser: MemberProfile = {
    ...user,
    planId: newPlanId,
    planName: newPlanName,
    amountPaid: newAmountPaid,
    status: newStatus,
    accessiblePlans: updatedPlans
  };

  members[index] = updatedUser;
  saveMembersLocally(members);

  // If current session is this user, update session
  const cur = getCurrentSessionUser();
  if (cur && cur.memberId === memberId) {
    setCurrentSessionUser(updatedUser);
  }

  // Update in Firestore
  try {
    const userRef = doc(db, 'users', memberId);
    await updateDoc(userRef, {
      planId: newPlanId,
      planName: newPlanName,
      amountPaid: newAmountPaid,
      status: newStatus,
      accessiblePlans: updatedPlans,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (e) {
    console.warn('Firestore update fallback to local:', e);
    return true;
  }
};

// One-click quick verify and activate student (Admin action)
export const adminVerifyAndActivateStudent = async (
  memberId: string,
  approve: boolean
): Promise<{ success: boolean; newStatus: 'Active' | 'Rejected' }> => {
  const members = getStoredMembers();
  const index = members.findIndex(m => m.memberId === memberId || m.rollNumber === memberId);
  if (index === -1) return { success: false, newStatus: 'Rejected' };

  const targetStatus = approve ? 'Active' : 'Rejected';
  members[index].status = targetStatus;
  saveMembersLocally(members);

  const cur = getCurrentSessionUser();
  if (cur && (cur.memberId === memberId || cur.rollNumber === memberId)) {
    setCurrentSessionUser(members[index]);
  }

  try {
    const userRef = doc(db, 'users', members[index].memberId);
    await updateDoc(userRef, {
      status: targetStatus,
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Firestore verify update fallback to local:', err);
  }

  return { success: true, newStatus: targetStatus };
};

export const adminDeleteStudent = async (memberId: string): Promise<boolean> => {
  const members = getStoredMembers().filter(m => m.memberId !== memberId);
  saveMembersLocally(members);

  const cur = getCurrentSessionUser();
  if (cur && cur.memberId === memberId) {
    setCurrentSessionUser(null);
  }

  try {
    const userRef = doc(db, 'users', memberId);
    await deleteDoc(userRef);
  } catch (e) {
    console.warn('Firestore delete error:', e);
  }
  return true;
};

// Update personal student profile (Roll number and plan are non-editable!)
export const updateMemberProfile = (
  updates: Partial<MemberProfile> & { memberId: string }
): { success: boolean; member?: MemberProfile; message: string } => {
  const members = getStoredMembers();
  const index = members.findIndex(m => m.memberId === updates.memberId);
  if (index === -1) {
    return { success: false, message: 'सदस्य नहीं मिला।' };
  }

  const existing = members[index];
  // Roll number, planId, and amountPaid are non-editable by student
  const updatedUser: MemberProfile = {
    ...existing,
    name: updates.name ? updates.name.trim() : existing.name,
    phone: updates.phone ? updates.phone.trim() : existing.phone,
    email: updates.email !== undefined ? updates.email.trim() : existing.email,
    city: updates.city ? updates.city.trim() : existing.city,
    state: updates.state ? updates.state.trim() : existing.state,
    designation: updates.designation || existing.designation,
    address: updates.address !== undefined ? updates.address : existing.address,
    avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : existing.avatarUrl,
    customQrUrl: updates.customQrUrl !== undefined ? updates.customQrUrl : existing.customQrUrl,
    customQrImage: updates.customQrImage !== undefined ? updates.customQrImage : existing.customQrImage
  };

  members[index] = updatedUser;
  saveMembersLocally(members);
  setCurrentSessionUser(updatedUser);
  syncUserToFirestore(updatedUser).catch(e => console.warn('Sync warning:', e));

  return {
    success: true,
    member: updatedUser,
    message: 'प्रोफाइल सफलतापूर्वक अपडेट हो गई।'
  };
};
