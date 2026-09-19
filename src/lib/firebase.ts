import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore, setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Suppress benign internal network retry warnings from triggering test runner errors
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

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId and experimentalForceLongPolling
// to prevent iframe and reverse proxy WebChannel stream drops (FirebaseError: [code=unavailable])
const databaseId =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

let firestoreDb;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    databaseId
  );
} catch {
  firestoreDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

export const db = firestoreDb;
export const auth = getAuth(app);

export default app;
