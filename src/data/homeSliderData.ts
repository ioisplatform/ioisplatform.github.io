import smartSavingsImg from '../assets/images/smart_savings_growth_1794240843133.jpg';
import missionImg from '../assets/images/national_youth_mission_1794240929346.jpg';
import { getAuthHeaders } from '../services/userService';

export interface HomeSliderItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  category: 'savings' | 'festival' | 'plan' | 'mission';
  description: string;
  festivalName?: string;
  festivalId?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  isUpcoming?: boolean;
  daysRemaining?: number;
  bgGradient: string;
  badgeText: string;
  badgeColor: string;
  iconName: 'Sparkles' | 'Coins' | 'Flame' | 'Sun' | 'Heart' | 'GraduationCap' | 'ShieldCheck';
  ctaText: string;
  ctaAction: 'plans' | 'register' | 'idcard' | 'rtps-services';
  ctaPlanId?: number;
  highlightText: string;
  imageUrl: string;
  active: boolean;
  order: number;
}

// Legacy static Nov 2026 festival IDs that must always be superseded by real-time festival engine
const LEGACY_STATIC_FESTIVAL_IDS = new Set([
  'slide-02-dhanteras',
  'slide-03-diwali',
  'slide-04-govardhan',
  'slide-05-bhaidooj',
  'slide-06-chhath',
]);

export function toLocalIsoDateKey(date: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
    const y = parts.find((p) => p.type === 'year')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const d = parts.find((p) => p.type === 'day')?.value;
    if (y && m && d) return `${y}-${m}-${d}`;
  } catch {}
  // Exact IST (UTC+05:30) arithmetic fallback
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const d = String(ist.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Authoritative cutoff dates (YYYY-MM-DD IST) for catalog festivals so saved/legacy items auto-expire even without explicit endDate
export const CATALOG_FESTIVAL_CUTOFFS: Record<string, string> = {
  'dhanteras-2026': '2026-11-06',
  'diwali-2026': '2026-11-08',
  'govardhan-2026': '2026-11-10',
  'bhaidooj-2026': '2026-11-12',
  'chhath-2026': '2026-11-16',
  'tulsi-vivah-2026': '2026-11-21',
  'dev-deepawali-2026': '2026-11-25',
  'gita-jayanti-2026': '2026-12-20',
  'winter-festive-2026': '2026-12-26',
  'newyear-2027': '2027-01-02',
  'makar-sankranti-2027': '2027-01-15',
  'republic-day-2027': '2027-01-26',
  'vasant-panchami-2027': '2027-02-12',
  'mahashivaratri-2027': '2027-03-07',
  'holi-2027': '2027-03-23',
  'navratri-ramnavami-2027': '2027-04-16',
  'independence-day-2027': '2027-08-16',
  'diwali-2027': '2027-11-04',
};

const PAST_2026_FESTIVAL_KEYWORD_CUTOFFS: Array<{ cutoff: string; pattern: RegExp }> = [
  { cutoff: '2026-11-06', pattern: /(धनतेरस|dhanteras)/i },
  { cutoff: '2026-11-08', pattern: /(दीपावली|दिवाली|diwali|deepawali)/i },
  { cutoff: '2026-11-10', pattern: /(गोवर्धन|अन्नकूट|govardhan|annakoot)/i },
  { cutoff: '2026-11-12', pattern: /(भाई दूज|भैया दूज|bhaidooj|bhai dooj)/i },
  { cutoff: '2026-11-16', pattern: /(छठ|छठी मैया|chhath|nahay-khay|sandhya arghya|usha arghya)/i },
];

export function hasExpiredFestivalSignature(
  item: {
    id?: string;
    festivalId?: string;
    festivalName?: string;
    title?: string;
    subtitle?: string;
    celebrationHeadline?: string;
    tag?: string;
    badgeText?: string;
    startDate?: string;
    endDate?: string;
  },
  todayKey: string
): boolean {
  const hasFutureExplicitEnd = Boolean(
    item.endDate && /^\d{4}-\d{2}-\d{2}$/.test(item.endDate) && item.endDate >= todayKey
  );
  if (item.endDate && /^\d{4}-\d{2}-\d{2}$/.test(item.endDate) && item.endDate < todayKey) {
    return true;
  }
  if (item.festivalId && CATALOG_FESTIVAL_CUTOFFS[item.festivalId] && CATALOG_FESTIVAL_CUTOFFS[item.festivalId] < todayKey) {
    return true;
  }
  // If explicit future endDate exists (e.g., Diwali 2027), honor that explicit schedule
  if (hasFutureExplicitEnd) {
    return false;
  }
  // Otherwise, auto-expire legacy/template items referencing already-ended 2026 festivals
  const searchable = `${item.id || ''} ${item.festivalName || ''} ${item.title || ''} ${item.subtitle || ''} ${item.celebrationHeadline || ''} ${item.tag || ''} ${item.badgeText || ''}`;
  for (const rule of PAST_2026_FESTIVAL_KEYWORD_CUTOFFS) {
    if (todayKey > rule.cutoff && rule.pattern.test(searchable)) {
      return true;
    }
  }
  return false;
}

export function isSliderItemExpired(item: Partial<HomeSliderItem> | null | undefined, now: Date = new Date()): boolean {
  if (!item || typeof item !== 'object') return true;
  if (item.id && LEGACY_STATIC_FESTIVAL_IDS.has(item.id)) return true;
  if (item.id && item.id.startsWith('dynamic-festive-')) return true;

  const todayKey = toLocalIsoDateKey(now);
  if (item.startDate && /^\d{4}-\d{2}-\d{2}$/.test(item.startDate) && item.startDate > todayKey && !item.isUpcoming) {
    return true;
  }
  return hasExpiredFestivalSignature(item, todayKey);
}

// Evergreen IOIS India Mission & Savings Sliders (Festivals are injected dynamically in real time)
export const INITIAL_SLIDES: HomeSliderItem[] = [
  {
    id: 'slide-01-smart-savings',
    title: 'लोग यहाँ-वहाँ फालतू खर्चा करते हैं — IOIS INDIA में सही उपयोग से स्वावलंबी बनें!',
    subtitle: 'मात्र ₹10 से ₹49 की छोटी सी बचत से शुरू करें अपना सुरक्षित डिजिटल भविष्य।',
    tag: 'समझदार बचत व आत्मनिर्भर भारत',
    category: 'savings',
    description: 'बाजार के अनावश्यक खर्चों को रोकें। IOIS INDIA में एक बार मात्र ₹10 से ₹49 लगाकर आपको मिलता है डिजिटल ID कार्ड, NCERT नोट्स, सरकारी योजना गाइड और प्रत्येक रेफरल पर 50% से 70% तुरंत UPI पेआउट।',
    bgGradient: 'from-amber-600/30 via-slate-950 to-emerald-600/30',
    badgeText: 'स्मार्ट बचत से सीधी कमाई',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    iconName: 'Coins',
    ctaText: 'मात्र ₹10 से शुरुआत करें (Plan 01)',
    ctaAction: 'register',
    ctaPlanId: 1,
    highlightText: '50% से 70% दैनिक इंसेंटिव',
    imageUrl: smartSavingsImg,
    active: true,
    order: 10
  },
  {
    id: 'slide-07-mission',
    title: 'IOIS INDIA राष्ट्रीय युवा व छात्र स्वावलंबन मिशन 2026-27',
    subtitle: 'Class 1 से 12 तक NCERT नोट्स, सरकारी RTPS सेवाएं व सीधा 50% से 70% पेआउट।',
    tag: 'विकसित भारत स्वावलंबन मिशन',
    category: 'mission',
    description: 'बिना किसी धोखाधड़ी या मासिक शुल्क के देश का सबसे विश्वसनीय डिजिटल सहयोग प्लेटफॉर्म। एक क्लिक में अपना ID कार्ड पाएं और सुरक्षित रूप से अपनी आय शुरू करें।',
    bgGradient: 'from-blue-600/30 via-slate-950 to-amber-600/30',
    badgeText: '100% पारदर्शी व सुरक्षित',
    badgeColor: 'bg-blue-500/25 text-sky-300 border-blue-400',
    iconName: 'ShieldCheck',
    ctaText: 'अभी सदस्य बनें',
    ctaAction: 'register',
    ctaPlanId: 1,
    highlightText: 'डिजिटल भारत का आधार',
    imageUrl: missionImg,
    active: true,
    order: 20
  }
];

export const DEFAULT_HOME_SLIDERS: HomeSliderItem[] = INITIAL_SLIDES;

const STORAGE_SLIDERS_KEY = 'iois_home_sliders_v5';
const IDB_NAME = 'iois_media_store_v1';
const IDB_STORE = 'kv_store';

let memorySliders: HomeSliderItem[] | null = null;

function openSliderDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSetSliders(slides: HomeSliderItem[]): Promise<void> {
  try {
    const db = await openSliderDb();
    if (!db) return;
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(slides, STORAGE_SLIDERS_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {}
}

async function idbGetSliders(): Promise<HomeSliderItem[] | null> {
  try {
    const db = await openSliderDb();
    if (!db) return null;
    return await new Promise<HomeSliderItem[] | null>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(STORAGE_SLIDERS_KEY);
      req.onsuccess = () => resolve((req.result as HomeSliderItem[]) ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

function normalizeSliderItem(item: any, idx: number): HomeSliderItem {
  const fallback = INITIAL_SLIDES.find((s) => s && s.id === item.id);
  return {
    id: item.id || `slide-custom-${idx + 1}`,
    title: item.title || fallback?.title || '',
    subtitle: item.subtitle || fallback?.subtitle || '',
    tag: item.tag || item.badge || fallback?.tag || 'IOIS INDIA विशेष बैनर',
    category: item.category || fallback?.category || 'mission',
    description: item.description || item.subtitle || fallback?.description || '',
    festivalName: item.festivalName || fallback?.festivalName,
    festivalId: item.festivalId,
    startDate: item.startDate,
    endDate: item.endDate,
    isUpcoming: Boolean(item.isUpcoming),
    daysRemaining: typeof item.daysRemaining === 'number' ? item.daysRemaining : undefined,
    bgGradient: item.bgGradient || fallback?.bgGradient || 'from-amber-600/30 via-slate-950 to-emerald-600/30',
    badgeText: item.badgeText || item.badge || fallback?.badgeText || 'IOIS INDIA अपडेट',
    badgeColor: item.badgeColor || fallback?.badgeColor || 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    iconName: item.iconName || fallback?.iconName || 'Sparkles',
    ctaText: item.ctaText || fallback?.ctaText || 'अभी देखें',
    ctaAction: item.ctaAction || fallback?.ctaAction || 'plans',
    ctaPlanId: item.ctaPlanId ?? fallback?.ctaPlanId,
    highlightText: item.highlightText || fallback?.highlightText || 'IOIS डिजिटल मिशन',
    imageUrl: item.imageUrl || fallback?.imageUrl || '',
    active: typeof item.active === 'boolean' ? item.active : (typeof item.isActive === 'boolean' ? item.isActive : true),
    order: typeof item.order === 'number' ? item.order : idx + 1,
  };
}

function sanitizeStoredSliders(rawList: any[]): HomeSliderItem[] {
  const now = new Date();
  const valid = rawList
    .filter((item): item is HomeSliderItem => Boolean(item && typeof item === 'object'))
    .filter((item) => !isSliderItemExpired(item, now))
    .map((item, idx) => normalizeSliderItem(item, idx));
  return valid.length > 0 ? valid : INITIAL_SLIDES;
}

function trySafeSliderLocalStorage(slides: HomeSliderItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(slides);
    if (serialized.length > 1_500_000) {
      localStorage.removeItem(STORAGE_SLIDERS_KEY);
      return;
    }
    localStorage.setItem(STORAGE_SLIDERS_KEY, serialized);
  } catch {
    try {
      localStorage.removeItem(STORAGE_SLIDERS_KEY);
    } catch {}
  }
}

export const getStoredSliders = (): HomeSliderItem[] => {
  if (typeof window === 'undefined') return INITIAL_SLIDES;
  if (memorySliders !== null && memorySliders.length > 0) {
    const cleanMem = sanitizeStoredSliders(memorySliders);
    memorySliders = cleanMem;
    return cleanMem;
  }
  try {
    // Purge legacy v4 slider cache so stale past festival slides are immediately removed
    try {
      localStorage.removeItem('iois_home_sliders_v4');
    } catch {}
    const raw = localStorage.getItem(STORAGE_SLIDERS_KEY);
    if (!raw) {
      trySafeSliderLocalStorage(INITIAL_SLIDES);
      memorySliders = INITIAL_SLIDES;
      return INITIAL_SLIDES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const sanitized = sanitizeStoredSliders(parsed);
      memorySliders = sanitized;
      if (sanitized.length !== parsed.length) {
        trySafeSliderLocalStorage(sanitized);
      }
      return sanitized;
    }
    return INITIAL_SLIDES;
  } catch {
    return INITIAL_SLIDES;
  }
};

export const fetchStoredSlidersFromServer = async (): Promise<HomeSliderItem[]> => {
  if (typeof window === 'undefined') return INITIAL_SLIDES;
  try {
    const res = await fetch('/api/home-sliders', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.slides) && data.slides.length > 0) {
        const sanitized = sanitizeStoredSliders(data.slides);
        memorySliders = sanitized;
        await idbSetSliders(sanitized);
        trySafeSliderLocalStorage(sanitized);
        window.dispatchEvent(new Event('iois_sliders_updated'));
        return sanitized;
      }
    }
  } catch {}

  const idb = await idbGetSliders();
  if (Array.isArray(idb) && idb.length > 0) {
    const sanitized = sanitizeStoredSliders(idb);
    memorySliders = sanitized;
    if (sanitized.length !== idb.length) {
      await idbSetSliders(sanitized);
      trySafeSliderLocalStorage(sanitized);
    }
    window.dispatchEvent(new Event('iois_sliders_updated'));
    return sanitized;
  }

  return getStoredSliders();
};

export const saveStoredSlidersAsync = async (slides: HomeSliderItem[]): Promise<void> => {
  if (typeof window === 'undefined') return;
  const now = new Date();
  const normalized = slides
    .filter((s) => s && typeof s === 'object' && !isSliderItemExpired(s, now))
    .map((s, idx) => normalizeSliderItem(s, idx));
  memorySliders = normalized;
  trySafeSliderLocalStorage(normalized);
  window.dispatchEvent(new Event('iois_sliders_updated'));
  await idbSetSliders(normalized);
  try {
    await fetch('/api/home-sliders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(true) },
      body: JSON.stringify({ slides: normalized }),
    });
  } catch {}
};

export const saveStoredSliders = (slides: HomeSliderItem[]): void => {
  void saveStoredSlidersAsync(slides);
};

