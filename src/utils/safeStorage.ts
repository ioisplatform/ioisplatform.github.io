const IDB_NAME = 'iois_media_store_v1';
const IDB_STORE = 'kv_store';

function openStorageDb(): Promise<IDBDatabase | null> {
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

export async function idbGet<T = any>(key: string): Promise<T | null> {
  try {
    const db = await openStorageDb();
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

export async function idbSet(key: string, value: any): Promise<void> {
  try {
    const db = await openStorageDb();
    if (!db) return;
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // IndexedDB non-fatal fallback
  }
}

export async function idbRemove(key: string): Promise<void> {
  try {
    const db = await openStorageDb();
    if (!db) return;
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // ignore
  }
}

export function safeLocalStorageGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeLocalStorageRemove(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export interface SafeStorageSetOptions {
  maxBytes?: number;
  evictKeysOnQuota?: string[];
}

/**
 * Writes to localStorage without ever throwing QuotaExceededError or logging console errors.
 * Optionally evicts specified secondary cache keys and retries once before gracefully skipping.
 */
export function safeLocalStorageSet(
  key: string,
  value: string,
  options: SafeStorageSetOptions = {}
): boolean {
  if (typeof window === 'undefined') return false;
  const { maxBytes, evictKeysOnQuota = [] } = options;

  if (typeof maxBytes === 'number' && value.length > maxBytes) {
    return false;
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    // Try clearing bulky/stale cache keys and retry once
    if (evictKeysOnQuota.length > 0) {
      for (const evictKey of evictKeysOnQuota) {
        if (evictKey && evictKey !== key) {
          try {
            localStorage.removeItem(evictKey);
          } catch {}
        }
      }
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

/**
 * Creates a shallow clone with large inline data URLs removed so compact metadata
 * fits safely within localStorage quota while full media lives in memory & IndexedDB.
 */
export function stripOversizedDataUrls<T extends Record<string, any>>(
  item: T,
  maxDataUrlLength = 4096
): T {
  if (!item || typeof item !== 'object') return item;
  const clone: Record<string, any> = { ...item };
  for (const [k, v] of Object.entries(clone)) {
    if (typeof v === 'string' && v.startsWith('data:') && v.length > maxDataUrlLength) {
      clone[k] = '';
    }
  }
  return clone as T;
}
