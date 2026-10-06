import { useState, useEffect } from 'react';
import { getSiteSettings, subscribeToSiteSettings, SiteSettings } from '../services/siteSettingsService';

export const useSiteSettings = (): SiteSettings => {
  const [settings, setSettings] = useState<SiteSettings>(() => getSiteSettings());

  useEffect(() => {
    // Sync initial state
    setSettings(getSiteSettings());

    // Subscribe to live changes when Admin updates any setting
    const unsubscribe = subscribeToSiteSettings((newSettings) => {
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  return settings;
};
