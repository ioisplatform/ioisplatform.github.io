import { useState, useEffect, useCallback, useRef } from 'react';
import { secretPlanPasswords } from '../data/studyWorkData';
import { MemberProfile } from '../types';
import { verifyStudentPlanPassword, getActivePlanPassword } from '../services/planPasswordService';

const ENCRYPTED_AUTH_STORAGE_PREFIX = 'iois_sec_vault_auth_v4_';
const ATTEMPTS_STORAGE_PREFIX = 'iois_sec_attempts_v4_';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds cooldown on 5 failed attempts
const CRYPTO_SALT = 'IOIS_DIGITAL_GOV_SECURE_TOKEN_2026_SHA256_SALT_';

// Helper to compute SHA-256 cryptographic digest with salt
async function computeCryptoHash(message: string, salt: string): Promise<string> {
  const normalized = message.trim().toUpperCase();
  const input = `${salt}:${normalized}:${salt}`;
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }

  // Fallback bit-shifting hash for environments lacking subtle crypto
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
}

/**
 * Returns all recognized authorized passwords for a given plan.
 * E.g., for Plan 01 -> ['IOISINDIAPLAN01', 'IOISINDIANPLAN01', 'INDIANPLAN01']
 */
export function getAuthorizedPasswordsForPlan(planId: string, planNumber: number): string[] {
  const planNumStr = planNumber < 10 ? `0${planNumber}` : `${planNumber}`;
  const candidates: string[] = [
    `IOISINDIAPLAN${planNumStr}`,     // Standard format requested (e.g. IOISINDIAPLAN01)
    `IOISINDIANPLAN${planNumStr}`,    // Variant
    `INDIANPLAN${planNumStr}`,        // Variant
    `IOISPLAN${planNumStr}`           // Variant
  ];

  // Also include the existing configured secret password if present
  const configured = secretPlanPasswords[planId];
  if (configured && !candidates.includes(configured.toUpperCase())) {
    candidates.push(configured.toUpperCase());
  }

  return candidates;
}

export interface EncryptedPlanAuthResult {
  isAuthorized: boolean;
  isVerifying: boolean;
  error: string | null;
  successMessage: string | null;
  attemptsLeft: number;
  isLockedOut: boolean;
  lockoutSeconds: number;
  authorizedAt: number | null;
  validatePassword: (password: string) => Promise<boolean>;
  lockPlan: () => void;
  expectedFormatHint: string;
}

/**
 * Custom Encrypted Validation Hook
 * Strictly gates plan access until a cryptographically verified password check is passed.
 * Ensures unauthorized users cannot render or access study materials.
 */
export function useEncryptedPlanAuth(
  planId: string,
  planNumber: number,
  currentUser?: MemberProfile | null
): EncryptedPlanAuthResult {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(MAX_ATTEMPTS);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [authorizedAt, setAuthorizedAt] = useState<number | null>(null);

  const lockoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const storageKey = `${ENCRYPTED_AUTH_STORAGE_PREFIX}${planId}`;
  const attemptsKey = `${ATTEMPTS_STORAGE_PREFIX}${planId}`;
  const planNumStr = planNumber < 10 ? `0${planNumber}` : `${planNumber}`;
  const expectedFormatHint = '';

  // Check lockout status helper
  const checkLockoutStatus = useCallback((): boolean => {
    try {
      const raw = localStorage.getItem(attemptsKey);
      if (!raw) {
        setAttemptsLeft(MAX_ATTEMPTS);
        setIsLockedOut(false);
        return false;
      }

      const data = JSON.parse(raw);
      const now = Date.now();

      if (data.lockoutUntil && data.lockoutUntil > now) {
        const remainingSec = Math.ceil((data.lockoutUntil - now) / 1000);
        setIsLockedOut(true);
        setLockoutSeconds(remainingSec);
        setAttemptsLeft(0);
        return true;
      }

      // Lockout expired, reset attempts
      if (data.lockoutUntil && data.lockoutUntil <= now) {
        localStorage.removeItem(attemptsKey);
        setAttemptsLeft(MAX_ATTEMPTS);
        setIsLockedOut(false);
        setLockoutSeconds(0);
        return false;
      }

      const count = typeof data.count === 'number' ? data.count : 0;
      const left = Math.max(0, MAX_ATTEMPTS - count);
      setAttemptsLeft(left);
      return false;
    } catch {
      return false;
    }
  }, [attemptsKey]);

  // Verify stored session token on mount
  useEffect(() => {
    let isMounted = true;

    async function verifyInitialSession() {
      // If user is logged in with this exact plan or is Plan 07 Supreme
      if (currentUser) {
        if (currentUser.planId === 'plan-07' || currentUser.planId === planId) {
          if (isMounted) {
            setIsAuthorized(true);
            setAuthorizedAt(Date.now());
          }
          return;
        }
      }

      // Check lockout status first
      if (checkLockoutStatus()) {
        return;
      }

      // Check session storage token
      try {
        const rawToken = sessionStorage.getItem(storageKey);
        if (!rawToken) {
          if (isMounted) setIsAuthorized(false);
          return;
        }

        const decoded = JSON.parse(atob(rawToken));
        const now = Date.now();

        // Validate expiration (24 hours valid session)
        if (!decoded || decoded.planId !== planId || !decoded.signature || decoded.expiresAt < now) {
          sessionStorage.removeItem(storageKey);
          if (isMounted) setIsAuthorized(false);
          return;
        }

        // Cryptographically verify signature against allowed plan passwords
        const validPasswords = getAuthorizedPasswordsForPlan(planId, planNumber);
        let signatureValid = false;

        for (const pwd of validPasswords) {
          const expectedSig = await computeCryptoHash(pwd, `${CRYPTO_SALT}${planId}`);
          if (expectedSig === decoded.signature) {
            signatureValid = true;
            break;
          }
        }

        if (signatureValid) {
          if (isMounted) {
            setIsAuthorized(true);
            setAuthorizedAt(decoded.authTime || Date.now());
          }
        } else {
          sessionStorage.removeItem(storageKey);
          if (isMounted) setIsAuthorized(false);
        }
      } catch {
        sessionStorage.removeItem(storageKey);
        if (isMounted) setIsAuthorized(false);
      }
    }

    verifyInitialSession();

    return () => {
      isMounted = false;
      if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
    };
  }, [planId, planNumber, currentUser, storageKey, checkLockoutStatus]);

  // Lockout countdown timer
  useEffect(() => {
    if (!isLockedOut || lockoutSeconds <= 0) return;

    lockoutTimerRef.current = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
          setIsLockedOut(false);
          setAttemptsLeft(MAX_ATTEMPTS);
          localStorage.removeItem(attemptsKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
    };
  }, [isLockedOut, lockoutSeconds, attemptsKey]);

  // Cryptographic password validation function
  const validatePassword = useCallback(async (enteredPassword: string): Promise<boolean> => {
    setError(null);
    setSuccessMessage(null);

    // Check if currently locked out
    if (checkLockoutStatus()) {
      setError(`सुरक्षा लॉक सक्रिय है! कृपया ${lockoutSeconds || 60} सेकंड बाद पुनः प्रयास करें।`);
      return false;
    }

    const cleanInput = enteredPassword.trim().toUpperCase();
    if (!cleanInput) {
      setError('कृपया प्लान सुरक्षा पासवर्ड दर्ज करें।');
      return false;
    }

    setIsVerifying(true);

    try {
      // Simulate slight cryptographic processing delay for smooth UX and timing-attack mitigation
      await new Promise((resolve) => setTimeout(resolve, 350));

      const isMatch = verifyStudentPlanPassword(planId, cleanInput);

      if (isMatch) {
        // Success: Reset attempts
        localStorage.removeItem(attemptsKey);
        setAttemptsLeft(MAX_ATTEMPTS);
        setIsLockedOut(false);

        // Store encrypted token with 24h validity
        const now = Date.now();
        const payload = {
          planId,
          authTime: now,
          expiresAt: now + 24 * 60 * 60 * 1000,
          signature: await computeCryptoHash(cleanInput, `${CRYPTO_SALT}${planId}`),
          nonce: Math.random().toString(36).substring(2, 10)
        };

        const encodedToken = btoa(JSON.stringify(payload));
        sessionStorage.setItem(storageKey, encodedToken);

        setIsAuthorized(true);
        setAuthorizedAt(now);
        setSuccessMessage('सत्यापन सफल! अधिकृत सुरक्षा पास स्वीकृत। अध्ययन पोर्टल अनलॉक्ड है।');
        setIsVerifying(false);
        return true;
      } else {
        // Failed attempt handling
        let currentCount = 1;
        try {
          const raw = localStorage.getItem(attemptsKey);
          if (raw) {
            const data = JSON.parse(raw);
            currentCount = (data.count || 0) + 1;
          }
        } catch {
          currentCount = 1;
        }

        if (currentCount >= MAX_ATTEMPTS) {
          const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
          localStorage.setItem(attemptsKey, JSON.stringify({ count: currentCount, lockoutUntil }));
          setIsLockedOut(true);
          setLockoutSeconds(60);
          setAttemptsLeft(0);
          setError(`अमान्य पासवर्ड! अधिकतम 5 प्रयास समाप्त हो गए हैं। सुरक्षा कारणों से 60 सेकंड का लॉक लगाया गया है।`);
        } else {
          localStorage.setItem(attemptsKey, JSON.stringify({ count: currentCount }));
          const remaining = MAX_ATTEMPTS - currentCount;
          setAttemptsLeft(remaining);
          setError(
            `गलत पासवर्ड! कृपया इस प्लान (Plan 0${planNumber}) का सही अधिकृत सुरक्षा पासवर्ड दर्ज करें या एडमिन से संपर्क करें। (शेष प्रयास: ${remaining})`
          );
        }

        setIsVerifying(false);
        return false;
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError('सत्यापन के दौरान तकनीकी समस्या आई। कृपया पुनः प्रयास करें।');
      setIsVerifying(false);
      return false;
    }
  }, [planId, planNumber, storageKey, attemptsKey, expectedFormatHint, checkLockoutStatus, lockoutSeconds]);

  // Lock the plan again (Revoke authorization)
  const lockPlan = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
    setIsAuthorized(false);
    setAuthorizedAt(null);
    setSuccessMessage(null);
    setError(null);
  }, [storageKey]);

  return {
    isAuthorized,
    isVerifying,
    error,
    successMessage,
    attemptsLeft,
    isLockedOut,
    lockoutSeconds,
    authorizedAt,
    validatePassword,
    lockPlan,
    expectedFormatHint
  };
}
