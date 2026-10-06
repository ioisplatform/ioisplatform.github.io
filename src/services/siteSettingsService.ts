// ============================================================================
// IOIS INDIA - CENTRALIZED DYNAMIC SITE SETTINGS SERVICE
// Provides full admin control over:
// 1. System Helpline & Support channels
// 2. Head Office Address & Location
// 3. Contact Buttons & Floating Contact Widget
// 4. Promotional Posters & Announcement Ticker (Add, Remove, Toggle)
// 5. Dynamic Services Management (Add & Remove)
// ============================================================================

export interface PromotionalPoster {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  targetLink?: string;
  targetPlanId?: string;
  buttonText: string;
  isActive: boolean;
  order: number;
}

export interface DynamicServiceItem {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  category: 'govt' | 'career' | 'study' | 'tools' | 'finance' | 'general';
  description: string;
  iconName: string;
  badge?: string;
  urlOrType: string;
  isPopular?: boolean;
  isCustom?: boolean;
}

export interface SiteSettings {
  // 1. System Helpline & Support
  helplinePhone: string;
  helplineWhatsapp: string;
  helplineEmail: string;
  helplineHours: string;
  helplineNoticeBanner: string;
  emergencyHotline?: string;

  // 2. Address & Location
  organizationName: string;
  headOfficeAddress: string;
  branchAddress?: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsUrl: string;

  // 3. Contact Button & Widgets
  contactButtonText: string;
  contactButtonEnabled: boolean;
  floatingContactWidgetEnabled: boolean;
  whatsappDirectMessage: string;
  callButtonText: string;
  telegramChannel: string;
  telegramBot: string;

  // 4. Promotional Posters & Announcement Ticker
  promotionalPosters: PromotionalPoster[];
  announcementTickerText: string;
  announcementTickerEnabled: boolean;

  // 5. Dynamic Services (Add / Remove)
  customServices: DynamicServiceItem[];
  removedServiceIds: string[];
}

export const DEFAULT_PROMOTIONAL_POSTERS: PromotionalPoster[] = [
  {
    id: 'poster-01',
    title: 'सम्पूर्ण अध्ययन किट 2026 - लाइफटाइम एक्सेस',
    subtitle: 'कक्षा 1 से 12 तक NCERT द्विभाषी नोट्स, वीडियो कक्षाएं, 70% पेआउट इंसेंटिव',
    badge: '★ स्पेशल ऑफर 2026',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    targetLink: '#plans',
    targetPlanId: 'plan-01',
    buttonText: 'मात्र ₹10 में एक्टिव करें',
    isActive: true,
    order: 1
  },
  {
    id: 'poster-02',
    title: 'युवा कौशल एवं डिजिटल उद्यमिता मास्टर पैकेज',
    subtitle: 'कंप्यूटर साक्षरता, रिज्यूमे बिल्डर, Tally प्राइम एवं सरकारी परीक्षा गाइड',
    badge: '🚀 कैरियर बूस्टर',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    targetLink: '#plans',
    targetPlanId: 'plan-02',
    buttonText: 'प्लान 02 जॉइन करें (₹25)',
    isActive: true,
    order: 2
  },
  {
    id: 'poster-03',
    title: 'नीट (NEET) एवं जेईई (JEE) फाउंडेशन टेस्ट सीरीज',
    subtitle: 'कक्षा 7 से 12वीं हेतु फिजिक्स, केमिस्ट्री, मैथ्स और बायोलॉजी स्पीड ट्रिक्स',
    badge: '🎯 100% परीक्षा उपयोगी',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    targetLink: '#plans',
    targetPlanId: 'plan-03',
    buttonText: 'कंपटीशन ज़ोन देखें (₹50)',
    isActive: true,
    order: 3
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  // 1. Helpline
  helplinePhone: '+91 8877490845',
  helplineWhatsapp: '+91 8877490845',
  helplineEmail: 'ioisplatform@gmail.com',
  helplineHours: 'सोमवार से शनिवार: सुबह 9:00 बजे से शाम 8:00 बजे तक',
  helplineNoticeBanner: '🇮🇳 भारत का आधिकारिक डिजिटल शिक्षा एवं कौशल मंच • अधिकृत 24x7 हेल्पलाइन सक्रिय',
  emergencyHotline: '+91 8877490845',

  // 2. Address
  organizationName: 'IOIS National Digital Education & Skill Network (IOIS India)',
  headOfficeAddress: 'IOIS डिजिटल भवन, निकट गांधी मैदान, डाकबंगला चौराहा',
  branchAddress: 'विकास मार्ग, नई दिल्ली 110092',
  city: 'पटना (Patna)',
  state: 'बिहार (Bihar)',
  pincode: '800001',
  googleMapsUrl: 'https://maps.google.com/?q=Patna+Bihar',

  // 3. Contact Buttons
  contactButtonText: 'सहायता व संपर्क करें',
  contactButtonEnabled: true,
  floatingContactWidgetEnabled: true,
  whatsappDirectMessage: 'नमस्ते IOIS टीम! मुझे अध्ययन किट व पंजीकरण के संबंध में जानकारी चाहिए।',
  callButtonText: 'सीधा कॉल करें',
  telegramChannel: 'https://t.me/ioisplatform',
  telegramBot: 'https://t.me/iois_admin_notification_bot',

  // 4. Promotional Posters & Ticker
  promotionalPosters: DEFAULT_PROMOTIONAL_POSTERS,
  announcementTickerText: '🎉 विशेष सूचना: बाल विकास (Plan 01) से लेकर मास्टर किट (Plan 07) तक 70% तत्काल पेआउट सुविधा लाइव है! किसी भी तकनीकी सहायता के लिए हमारी हेल्पलाइन +91 8877490845 पर संपर्क करें।',
  announcementTickerEnabled: true,

  // 5. Dynamic Services
  customServices: [],
  removedServiceIds: []
};

const STORAGE_KEY = 'iois_master_site_settings_v1';
const SETTINGS_EVENT = 'iois_settings_changed';

// Retrieve settings from localStorage or return defaults
export const getSiteSettings = (): SiteSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        promotionalPosters: parsed.promotionalPosters?.length ? parsed.promotionalPosters : DEFAULT_SITE_SETTINGS.promotionalPosters,
        customServices: parsed.customServices || [],
        removedServiceIds: parsed.removedServiceIds || []
      };
    }
  } catch (err) {
    console.warn('Error reading site settings:', err);
  }
  return DEFAULT_SITE_SETTINGS;
};

// Save updated settings
export const saveSiteSettings = (newSettings: Partial<SiteSettings>): SiteSettings => {
  const current = getSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...newSettings
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: updated }));
  } catch (err) {
    console.warn('Error saving site settings:', err);
  }
  return updated;
};

// Reset to factory defaults
export const resetSiteSettings = (): SiteSettings => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: DEFAULT_SITE_SETTINGS }));
  } catch (err) {
    console.warn('Error resetting site settings:', err);
  }
  return DEFAULT_SITE_SETTINGS;
};

// Helper: Add promotional poster
export const addPromotionalPoster = (poster: Omit<PromotionalPoster, 'id' | 'order'>): PromotionalPoster => {
  const current = getSiteSettings();
  const newPoster: PromotionalPoster = {
    ...poster,
    id: `poster-${Date.now()}`,
    order: (current.promotionalPosters.length || 0) + 1
  };
  const updatedList = [newPoster, ...current.promotionalPosters];
  saveSiteSettings({ promotionalPosters: updatedList });
  return newPoster;
};

// Helper: Remove promotional poster
export const removePromotionalPoster = (posterId: string): void => {
  const current = getSiteSettings();
  const updatedList = current.promotionalPosters.filter(p => p.id !== posterId);
  saveSiteSettings({ promotionalPosters: updatedList });
};

// Helper: Toggle promotional poster
export const togglePromotionalPoster = (posterId: string, isActive: boolean): void => {
  const current = getSiteSettings();
  const updatedList = current.promotionalPosters.map(p => 
    p.id === posterId ? { ...p, isActive } : p
  );
  saveSiteSettings({ promotionalPosters: updatedList });
};

// Helper: Add custom service
export const addCustomService = (service: Omit<DynamicServiceItem, 'id'>): DynamicServiceItem => {
  const current = getSiteSettings();
  const newService: DynamicServiceItem = {
    ...service,
    id: `srv-custom-${Date.now()}`,
    isCustom: true
  };
  const updatedList = [...current.customServices, newService];
  saveSiteSettings({ customServices: updatedList });
  return newService;
};

// Helper: Remove / Delete service (works for custom or built-in service)
export const removeServiceById = (serviceId: string): void => {
  const current = getSiteSettings();
  const updatedCustom = current.customServices.filter(s => s.id !== serviceId);
  const updatedRemovedIds = Array.from(new Set([...current.removedServiceIds, serviceId]));
  saveSiteSettings({ 
    customServices: updatedCustom,
    removedServiceIds: updatedRemovedIds
  });
};

// Helper: Restore a removed service
export const restoreServiceById = (serviceId: string): void => {
  const current = getSiteSettings();
  const updatedRemovedIds = current.removedServiceIds.filter(id => id !== serviceId);
  saveSiteSettings({ removedServiceIds: updatedRemovedIds });
};

// Subscribe to settings change
export const subscribeToSiteSettings = (callback: (settings: SiteSettings) => void): (() => void) => {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<SiteSettings>;
    callback(customEvent.detail || getSiteSettings());
  };
  window.addEventListener(SETTINGS_EVENT, handler);
  return () => window.removeEventListener(SETTINGS_EVENT, handler);
};
