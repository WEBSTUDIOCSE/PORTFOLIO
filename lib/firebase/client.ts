// ─────────────────────────────────────────────────────────────
// Firebase client SDK initialization.
//
// SECURITY NOTE — the NEXT_PUBLIC_FIREBASE_* env vars below are
// PUBLIC by design. The "apiKey" is a project identifier that
// Firebase requires the client to send; it is not a secret and
// hiding it would not improve security. Firebase's security model
// is enforced server-side via:
//
//   1. Firestore Security Rules  (see firestore.rules at repo root)
//   2. Storage Security Rules    (see storage.rules at repo root)
//   3. Authentication state
//   4. App Check (optional, anti-abuse — not enabled here yet)
//
// LAZY INIT — config is read inside getFirebaseApp(), NOT at module
// load time. This way importing this file from a Server Component
// never throws (the import path is server-only during SSR even
// though the module is "client" semantically). The error only
// surfaces when something actually tries to USE Firebase.
//
// References:
//   • https://firebase.google.com/docs/projects/api-keys
//   • https://firebase.google.com/docs/web/setup
// ─────────────────────────────────────────────────────────────

import {
  initializeApp,
  getApps,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";

function readEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Firebase config error: env var "${name}" is missing. ` +
        `Add it to .env.local (see .env.example for the full list). ` +
        `If you just added it, restart \`npm run dev\` — env vars are read on startup.`,
    );
  }
  return v;
}

function buildConfig(): FirebaseOptions {
  return {
    apiKey: readEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    // measurementId is optional (Analytics only).
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

// Singleton — Next.js HMR + Server Components can call this multiple
// times during one request. getApps() returns the already-initialized
// app if present, avoiding the "duplicate-app" error.
export function getFirebaseApp(): FirebaseApp {
  const existing = getApps();
  if (existing.length > 0) return existing[0];
  return initializeApp(buildConfig());
}
