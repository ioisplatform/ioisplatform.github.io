export type PopupDisplayTarget = 'all' | 'home' | 'dashboard';

export interface HomePopupPhoto {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  celebrationHeadline?: string;
  celebrationEffect?: boolean;
  displayTargets?: PopupDisplayTarget[];
  actionType: 'plans' | 'register' | 'idcard' | 'rtps-services' | 'none';
  actionText: string;
  actionPlanId?: number;
  active: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  aspectRatio?: string;
}

const STORAGE_HOME_POPUPS_KEY = 'iois_admin_home_popups_v1';
const IDB_NAME = 'iois_media_store_v1';
const IDB_STORE = 'kv_store';

let memoryPopupPhotos: HomePopupPhoto[] | null = null;

function openMediaDb(): Promise<IDBDatabase | null> {
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

async function idbSet(key: string, value: any): Promise<void> {
  try {
    const db = await openMediaDb();
    if (!db) return;
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {}
}

async function idbGet<T = any>(key: string): Promise<T | null> {
  try {
    const db = await openMediaDb();
    if (!db) return null;
    return await new Promise<T | null>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export const isPopupSlotConfigured = (item: HomePopupPhoto | null | undefined): boolean => {
  if (!item || typeof item !== 'object' || !item.active) return false;
  const hasPhoto = Boolean(item.imageUrl && item.imageUrl.trim().length > 0);
  const hasHeadline = Boolean(item.celebrationHeadline && item.celebrationHeadline.trim().length > 0);
  const hasTitle = Boolean(item.title && item.title.trim().length > 0);
  const hasDesc = Boolean(item.description && item.description.trim().length > 0);
  return hasPhoto || hasHeadline || hasTitle || hasDesc;
};

export const matchesPopupTarget = (
  item: HomePopupPhoto,
  location?: 'home' | 'dashboard' | 'global' | 'preview'
): boolean => {
  if (!location || location === 'preview') return true;
  const targets = Array.isArray(item.displayTargets) && item.displayTargets.length > 0
    ? item.displayTargets
    : (['home', 'dashboard'] as PopupDisplayTarget[]);
  if (location === 'global') {
    return targets.includes('all');
  }
  return targets.includes('all') || targets.includes(location);
};

function readRawFromLocalStorage(): HomePopupPhoto[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_HOME_POPUPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is HomePopupPhoto => Boolean(item && typeof item === 'object'));
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Returns ALL admin popup photo/celebration slots (including inactive) for admin management.
 */
export const getAllAdminPopupPhotos = (): HomePopupPhoto[] => {
  if (typeof window === 'undefined') return [];
  if (memoryPopupPhotos !== null) {
    return memoryPopupPhotos;
  }
  const lsPhotos = readRawFromLocalStorage();
  memoryPopupPhotos = lsPhotos;
  return lsPhotos;
};

/**
 * Returns configured & active admin popup items.
 * Defaults to EMPTY array [] so if admin has not uploaded any photo OR set any popup message,
 * NO admin popup appears ("agar mai photo ya koi popup message set na karu to koi pop na aaye").
 */
export const getStoredHomePopupPhotos = (location?: 'home' | 'dashboard' | 'global' | 'preview'): HomePopupPhoto[] => {
  const all = getAllAdminPopupPhotos();
  return all.filter((item) => isPopupSlotConfigured(item) && matchesPopupTarget(item, location));
};

function trySafeLocalStorageSave(photos: HomePopupPhoto[]): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(photos);
    // Avoid exhausting browser 5MB localStorage limit (leave space for auth/users)
    if (serialized.length > 1_500_000) {
      try {
        localStorage.removeItem(STORAGE_HOME_POPUPS_KEY);
      } catch {}
      return;
    }
    localStorage.setItem(STORAGE_HOME_POPUPS_KEY, serialized);
  } catch {
    // On QuotaExceededError: clear stale popup key cleanly and rely on Memory + IndexedDB + Server
    try {
      localStorage.removeItem(STORAGE_HOME_POPUPS_KEY);
    } catch {}
  }
}

/**
 * Fetch latest popups from Server + IndexedDB and sync memory/listeners.
 */
export const fetchHomePopupPhotosFromServer = async (): Promise<HomePopupPhoto[]> => {
  if (typeof window === 'undefined') return [];
  try {
    const res = await fetch('/api/home-popups', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.photos)) {
        const clean = data.photos.filter((item: any): item is HomePopupPhoto => Boolean(item && typeof item === 'object')).slice(0, 7);
        if (clean.length > 0 || memoryPopupPhotos === null) {
          memoryPopupPhotos = clean;
          await idbSet(STORAGE_HOME_POPUPS_KEY, clean);
          trySafeLocalStorageSave(clean);
          window.dispatchEvent(new Event('iois_home_popups_updated'));
          return clean;
        }
      }
    }
  } catch {}

  const idbPhotos = await idbGet<HomePopupPhoto[]>(STORAGE_HOME_POPUPS_KEY);
  if (Array.isArray(idbPhotos)) {
    memoryPopupPhotos = idbPhotos;
    window.dispatchEvent(new Event('iois_home_popups_updated'));
    return idbPhotos;
  }

  return getAllAdminPopupPhotos();
};

export const clearPopupSessionDismissals = (): void => {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith('iois_admin_photo_popup_dismissed_')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch {}
};

/**
 * Save updated list of admin popup photos/messages (max 7) across Memory, IndexedDB,
 * safe localStorage, and Backend Server — never throws QuotaExceededError.
 */
export const saveAdminPopupPhotosAsync = async (photos: HomePopupPhoto[]): Promise<{ ok: boolean; error?: string }> => {
  if (typeof window === 'undefined') return { ok: true };
  const sliced = photos.slice(0, 7).map((p, idx) => ({
    ...p,
    order: idx + 1,
    updatedAt: new Date().toISOString(),
  }));

  memoryPopupPhotos = sliced;
  clearPopupSessionDismissals();
  trySafeLocalStorageSave(sliced);
  window.dispatchEvent(new Event('iois_home_popups_updated'));

  await idbSet(STORAGE_HOME_POPUPS_KEY, sliced);

  try {
    const res = await fetch('/api/home-popups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos: sliced }),
    });
    if (!res.ok) {
      return { ok: true }; // Already saved locally in memory + IndexedDB
    }
  } catch {
    // Still saved in memory + IndexedDB
  }

  return { ok: true };
};

export const saveAdminPopupPhotos = (photos: HomePopupPhoto[]): void => {
  void saveAdminPopupPhotosAsync(photos);
};
