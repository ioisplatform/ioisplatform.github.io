// ============================================================================
// IOIS INDIA - ADMIN ACTIVITY LOGS & AUDIT TRAIL SERVICE
// Records chronological administrative actions for oversight, compliance & security
// ============================================================================

import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebaseConfig';

export type ActivityActionType =
  | 'settings_update'
  | 'helpline_update'
  | 'address_update'
  | 'contact_widget_toggle'
  | 'poster_added'
  | 'poster_removed'
  | 'poster_toggled'
  | 'service_added'
  | 'service_removed'
  | 'service_restored'
  | 'password_update'
  | 'password_reset_all'
  | 'master_key_update'
  | 'student_verify'
  | 'student_delete'
  | 'student_kit_update'
  | 'student_manual_add'
  | 'admin_login'
  | 'settings_reset';

export type ActivityCategory = 'settings' | 'promotions' | 'services' | 'security' | 'students';
export type ActivitySeverity = 'info' | 'success' | 'warning' | 'alert';

export interface AdminActivityLog {
  id: string;
  actionType: ActivityActionType;
  title: string;
  description: string;
  category: ActivityCategory;
  severity: ActivitySeverity;
  timestamp: string; // ISO 8601 string
  adminUser: string;
  details?: Record<string, any>;
  ipOrDevice?: string;
}

const STORAGE_KEY = 'iois_admin_activity_logs_v1';
const LOGS_EVENT = 'iois_admin_logs_updated';

// Seed starter audit logs for immediate realistic oversight
export const INITIAL_ACTIVITY_LOGS: AdminActivityLog[] = [
  {
    id: 'log-seed-01',
    actionType: 'admin_login',
    title: 'मास्टर एडमिन सफल लॉगिन (Admin Session Authenticated)',
    description: 'अधिकृत मास्टर पासवर्ड द्वारा एडमिन कंट्रोल कंसोल में सुरक्षित प्रवेश दर्ज किया गया।',
    category: 'security',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    adminUser: 'मुख्य एडमिन (Master Admin)',
    ipOrDevice: 'Web Console • Chrome / Desktop'
  },
  {
    id: 'log-seed-02',
    actionType: 'helpline_update',
    title: 'हेल्पलाइन एवं सपोर्ट संपर्क सत्यापित (Helpline Verified)',
    description: 'आधिकारिक हेल्पलाइन नंबर +91 8877490845 व व्हाट्सएप सपोर्ट चैनल सक्रिय किए गए।',
    category: 'settings',
    severity: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    adminUser: 'मुख्य एडमिन (Master Admin)',
    ipOrDevice: 'Web Console • Verified Admin Session'
  },
  {
    id: 'log-seed-03',
    actionType: 'poster_added',
    title: 'प्रमोशनल पोस्टर सक्रिय: सम्पूर्ण अध्ययन किट 2026',
    description: 'होमपेज हेतु नया प्रमोशनल बैनर "सम्पूर्ण अध्ययन किट 2026 - लाइफटाइम एक्सेस" जोड़ा गया।',
    category: 'promotions',
    severity: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 mins ago
    adminUser: 'मुख्य एडमिन (Master Admin)'
  },
  {
    id: 'log-seed-04',
    actionType: 'service_added',
    title: 'वेबसाइट जनसेवा सूची अद्यतन (Services Configured)',
    description: '7 मास्टर प्लांस, RTPS व जमीन सेवाएं एवं छात्र पोर्टल सेवाएं वेबसाइट पर लाइव की गईं।',
    category: 'services',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    adminUser: 'मुख्य एडमिन (Master Admin)'
  },
  {
    id: 'log-seed-05',
    actionType: 'password_update',
    title: 'प्लान 01 बाल विकास सुरक्षा पासवर्ड सुरक्षित',
    description: 'बाल विकास अध्ययन किट एक्सेस हेतु सुरक्षा की-वर्ड सत्यापित एवं लोड किया गया।',
    category: 'security',
    severity: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    adminUser: 'सिस्टम सुरक्षा प्रबंधक'
  }
];

// Read logs from localStorage
export const getActivityLogs = (): AdminActivityLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading activity logs:', err);
  }
  return INITIAL_ACTIVITY_LOGS;
};

// Log a new admin activity
export const logAdminActivity = (
  entry: Omit<AdminActivityLog, 'id' | 'timestamp'>
): AdminActivityLog => {
  const currentLogs = getActivityLogs();
  const newLog: AdminActivityLog = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    adminUser: entry.adminUser || 'मुख्य एडमिन (Master Admin)',
    ipOrDevice: entry.ipOrDevice || 'Web Console • Secure Admin'
  };

  // Keep latest 150 entries in storage to prevent memory overflow
  const updatedLogs = [newLog, ...currentLogs].slice(0, 150);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    window.dispatchEvent(new CustomEvent(LOGS_EVENT, { detail: updatedLogs }));
  } catch (err) {
    console.warn('Error persisting activity log to localStorage:', err);
  }

  // Also silently push to Firestore if available
  try {
    if (db) {
      const colRef = collection(db, 'admin_activity_logs');
      addDoc(colRef, newLog).catch(() => {
        // Silent catch for offline or guest access
      });
    }
  } catch {
    // ignore
  }

  return newLog;
};

// Clear all logs
export const clearActivityLogs = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent(LOGS_EVENT, { detail: [] }));
  } catch (err) {
    console.warn('Error clearing activity logs:', err);
  }
};

// Reset logs to initial seeds
export const resetActivityLogs = (): AdminActivityLog[] => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACTIVITY_LOGS));
    window.dispatchEvent(new CustomEvent(LOGS_EVENT, { detail: INITIAL_ACTIVITY_LOGS }));
  } catch (err) {
    console.warn('Error resetting activity logs:', err);
  }
  return INITIAL_ACTIVITY_LOGS;
};

// Subscribe to log updates
export const subscribeToActivityLogs = (
  callback: (logs: AdminActivityLog[]) => void
): (() => void) => {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<AdminActivityLog[]>;
    callback(custom.detail || getActivityLogs());
  };
  window.addEventListener(LOGS_EVENT, handler);
  return () => window.removeEventListener(LOGS_EVENT, handler);
};

// Export logs as JSON file download
export const exportLogsAsJson = (): void => {
  const logs = getActivityLogs();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `IOIS_Admin_Activity_Logs_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// Export logs as CSV file download
export const exportLogsAsCsv = (): void => {
  const logs = getActivityLogs();
  const headers = ['ID', 'Date_Time', 'Category', 'Action_Type', 'Severity', 'Admin_User', 'Title', 'Description'];
  const rows = logs.map(l => [
    `"${l.id}"`,
    `"${new Date(l.timestamp).toLocaleString('hi-IN')}"`,
    `"${l.category}"`,
    `"${l.actionType}"`,
    `"${l.severity}"`,
    `"${l.adminUser}"`,
    `"${l.title.replace(/"/g, '""')}"`,
    `"${l.description.replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `IOIS_Admin_Activity_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// Format friendly relative time in Hindi / English
export const formatRelativeTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'अभी-अभी (Just now)';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} मिनट पहले (${diffMinutes}m ago)`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} घंटे पहले (${diffHours}h ago)`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} दिन पहले (${diffDays}d ago)`;
    return date.toLocaleDateString('hi-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return timestamp;
  }
};
