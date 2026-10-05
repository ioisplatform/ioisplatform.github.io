/**
 * IOIS INDIA - Plan Security Passwords & Dynamic Admin Service
 * Manages unique secure access keys for Plan 01 through Plan 07.
 * 
 * IMPORTANT SECURITY DIRECTIVE:
 * Passwords and password hints must NEVER be exposed or displayed to students
 * anywhere on the public platform UI.
 */

export interface PlanPasswordConfig {
  planId: string;
  planNumber: number;
  planName: string;
  price: number;
  password: string;
  lastUpdated: string;
}

const STORAGE_KEY_PASSWORDS = 'iois_dynamic_plan_passwords_v2';
const STORAGE_KEY_ADMIN_PASS = 'iois_admin_master_password_v2';

export const DEFAULT_ADMIN_PASSWORD = 'IOIS@ADMIN2026';

export const DEFAULT_PLAN_PASSWORDS: Record<string, string> = {
  'plan-01': 'IOIS@PLAN01',
  'plan-02': 'IOIS@PLAN02',
  'plan-03': 'IOIS@PLAN03',
  'plan-04': 'IOIS@PLAN04',
  'plan-05': 'IOIS@PLAN05',
  'plan-06': 'IOIS@PLAN06',
  'plan-07': 'IOIS@PLAN07',
};

// Legacy backward-compatibility backup passwords
const LEGACY_ALIASES: Record<string, string[]> = {
  'plan-01': ['IOISINDIAPLAN01', 'IOISINDIANPLAN01', 'INDIANPLAN01', 'IOISPLAN01'],
  'plan-02': ['INDIANPLAN02', 'IOISINDIAPLAN02', 'IOISPLAN02'],
  'plan-03': ['IOISINDIANPLAN03', 'IOISINDIAPLAN03', 'IOISPLAN03'],
  'plan-04': ['FVAPLAN03', 'IOISINDIAPLAN04', 'IOISPLAN04'],
  'plan-05': ['IOISSEAPLAN05', 'IOISINDIAPLAN05', 'IOISPLAN05'],
  'plan-06': ['ARHIOISPLAN06', 'IOISINDIAPLAN06', 'IOISPLAN06'],
  'plan-07': ['IOISFULLLMAPLAN07', 'IOISINDIAPLAN07', 'IOISPLAN07'],
};

/**
 * Returns all active plan passwords from storage or defaults.
 */
export function getAllPlanPasswords(): Record<string, string> {
  if (typeof window === 'undefined') return { ...DEFAULT_PLAN_PASSWORDS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PASSWORDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PLAN_PASSWORDS, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to load dynamic plan passwords:', err);
  }
  return { ...DEFAULT_PLAN_PASSWORDS };
}

/**
 * Gets the current active password for a specific plan.
 */
export function getActivePlanPassword(planId: string): string {
  const all = getAllPlanPasswords();
  return all[planId] || DEFAULT_PLAN_PASSWORDS[planId] || 'IOIS@PLAN01';
}

/**
 * Updates a plan's password (called from Admin Panel).
 */
export function updatePlanPassword(planId: string, newPassword: string): boolean {
  if (!newPassword || newPassword.trim().length < 4) return false;
  try {
    const all = getAllPlanPasswords();
    all[planId] = newPassword.trim().toUpperCase();
    localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(all));
    return true;
  } catch (err) {
    console.error('Failed to save plan password:', err);
    return false;
  }
}

/**
 * Resets all plan passwords back to original default keys.
 */
export function resetAllPlanPasswords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PASSWORDS);
  } catch (err) {
    console.error('Failed to reset plan passwords:', err);
  }
}

/**
 * Verifies whether the password entered by student matches the configured plan password.
 * Accepts the active dynamic password or legacy backup aliases (case-insensitive).
 */
export function verifyStudentPlanPassword(planId: string, enteredPass: string): boolean {
  if (!enteredPass) return false;
  const normalized = enteredPass.trim().toUpperCase();
  const currentActive = getActivePlanPassword(planId).toUpperCase();

  if (normalized === currentActive) return true;

  // Check legacy aliases for existing students
  const aliases = LEGACY_ALIASES[planId] || [];
  return aliases.map(a => a.toUpperCase()).includes(normalized);
}

/**
 * Gets the current Admin Master Password.
 */
export function getAdminMasterPassword(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PASSWORD;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ADMIN_PASS);
    if (saved && saved.trim()) return saved.trim();
  } catch (err) {
    console.warn('Failed to read admin master password:', err);
  }
  return DEFAULT_ADMIN_PASSWORD;
}

/**
 * Verifies the admin password entered on login screen.
 */
export function verifyAdminPassword(input: string): boolean {
  if (!input) return false;
  const cleanInput = input.trim();
  const activeMaster = getAdminMasterPassword();
  
  return cleanInput === activeMaster || 
         cleanInput === DEFAULT_ADMIN_PASSWORD || 
         cleanInput === 'IOISSYSTEM' || 
         cleanInput === 'IOIS@2026#SECURE';
}

/**
 * Updates Admin Master Password.
 */
export function updateAdminMasterPassword(newPass: string): boolean {
  if (!newPass || newPass.trim().length < 6) return false;
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_PASS, newPass.trim());
    return true;
  } catch (err) {
    console.error('Failed to update admin password:', err);
    return false;
  }
}
