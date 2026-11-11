export interface HomePopupPhoto {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  actionType: 'plans' | 'register' | 'idcard' | 'rtps-services' | 'none';
  actionText: string;
  actionPlanId?: number;
  active: boolean;
  order: number;
  createdAt?: string;
  aspectRatio?: string;
}

const STORAGE_HOME_POPUPS_KEY = 'iois_admin_home_popups_v1';

/**
 * Returns stored admin popup photos.
 * Defaults to EMPTY array [] so if the admin has not uploaded any photos,
 * NO popup appears on the home page as requested ("agar mai photo upload na karu to koi popup na aaye").
 */
export const getStoredHomePopupPhotos = (): HomePopupPhoto[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_HOME_POPUPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is HomePopupPhoto => Boolean(item && typeof item === 'object' && item.imageUrl && item.active));
    }
    return [];
  } catch {
    return [];
  }
};

/**
 * Returns ALL admin popup photo slots (including inactive) for admin management.
 */
export const getAllAdminPopupPhotos = (): HomePopupPhoto[] => {
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
};

/**
 * Save updated list of admin popup photos (max 7) and dispatch sync event.
 */
export const saveAdminPopupPhotos = (photos: HomePopupPhoto[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_HOME_POPUPS_KEY, JSON.stringify(photos.slice(0, 7)));
    window.dispatchEvent(new Event('iois_home_popups_updated'));
  } catch (err) {
    console.error('Failed to save home popup photos:', err);
  }
};
