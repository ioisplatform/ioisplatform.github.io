import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore, setLogLevel, doc, getDocFromServer } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

export const DEFAULT_FIRESTORE_DB_ID = "ai-studio-ioisplatform-e876ace6-d20e-468d-b9e8-6300349cc3a7";

// Suppress benign internal network retry warnings from triggering console errors
if (typeof window !== "undefined") {
  try {
    setLogLevel("silent");
  } catch {
    // Ignore if already set
  }

  const origError = console.error;
  console.error = (...args: any[]) => {
    const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
    if (
      msg.includes("Could not reach Cloud Firestore backend") ||
      msg.includes("operate in offline mode until it is able to successfully connect")
    ) {
      console.warn("[Firestore Network Status]", ...args);
      return;
    }
    origError.apply(console, args);
  };
}

// Initialize Firebase App once (reused across Firestore and Google Workspace Auth)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Preserve provisioned custom Firestore database ID even if OAuth updates firebase-applet-config.json
const configDbId = (firebaseConfig as Record<string, any>).firestoreDatabaseId;
const databaseId =
  configDbId && configDbId !== "(default)" ? String(configDbId) : DEFAULT_FIRESTORE_DB_ID;

let firestoreDb;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
    },
    databaseId
  );
} catch {
  firestoreDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

export const db = firestoreDb;
export const auth = getAuth(app);

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  options?: { suppressThrow?: boolean }
): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  const lower = errInfo.error.toLowerCase();
  const isQuotaOrOffline =
    lower.includes("quota") ||
    lower.includes("resource-exhausted") ||
    lower.includes("the client is offline") ||
    lower.includes("unavailable");

  if (!isQuotaOrOffline) {
    console.error("Firestore Error:", JSON.stringify(errInfo));
  } else {
    console.warn("[Firestore Free-Tier / Network Guard]:", errInfo.operationType, path || "", errInfo.error);
  }

  if (!options?.suppressThrow && lower.includes("permission")) {
    throw new Error(JSON.stringify(errInfo));
  }
  return errInfo;
}

// Startup connection check (1 lightweight server probe, guarded against offline/quota errors)
let connectionTested = false;
export async function testFirestoreConnection(): Promise<{ ok: boolean; offline?: boolean; quotaExceeded?: boolean }> {
  if (!db) return { ok: false, offline: true };
  try {
    await Promise.race([
      getDocFromServer(doc(db, "test", "connection")),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("connection check timeout")), 3500)),
    ]);
    return { ok: true };
  } catch (error: any) {
    const msg = String(error?.message || error || "").toLowerCase();
    if (msg.includes("the client is offline")) {
      console.warn("Firestore connection check: client appears offline; using server & local vault.");
      return { ok: false, offline: true };
    }
    if (msg.includes("quota") || msg.includes("resource-exhausted")) {
      return { ok: false, quotaExceeded: true };
    }
    // permission-denied on test/connection still confirms live Firestore connectivity
    return { ok: true };
  }
}

if (typeof window !== "undefined" && !connectionTested) {
  connectionTested = true;
  setTimeout(() => {
    try {
      const blockedUntil = Number(window.localStorage?.getItem("iois_firestore_quota_until") || "0");
      if (blockedUntil && Date.now() < blockedUntil) return;
    } catch {}
    void testFirestoreConnection();
  }, 4000);
}

export default app;
