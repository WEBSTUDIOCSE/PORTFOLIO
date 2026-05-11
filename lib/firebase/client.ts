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
// IMPORTANT — STATIC ENV ACCESS:
// Each `process.env.NEXT_PUBLIC_*` reference below MUST be a static
// dotted access. Next.js replaces these at build time by literal
// scanning of the source; dynamic access (process.env[name]) is not
// replaced and returns undefined on the client. Do NOT refactor
// these into a helper that takes the name as a variable.
//
// References:
//   • https://firebase.google.com/docs/projects/api-keys
//   • https://nextjs.org/docs/app/guides/environment-variables
// ─────────────────────────────────────────────────────────────

import {
  initializeApp,
  getApps,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

function missing(name: string): Error {
  return new Error(
    `Firebase config error: env var "${name}" is missing. ` +
      `Add it to .env.local (see .env.example for the full list). ` +
      `If you just added it, restart \`npm run dev\` — env vars are baked into the client bundle at startup.`,
  );
}

function buildConfig(): FirebaseOptions {
  // Each reference here is a STATIC dotted access — Next.js replaces
  // them with literal strings at build time. The local `const` lets
  // us validate after the replacement happens.
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  // measurementId is optional (Analytics only).
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (!apiKey) throw missing("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!authDomain) throw missing("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!projectId) throw missing("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!storageBucket) throw missing("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  if (!messagingSenderId)
    throw missing("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  if (!appId) throw missing("NEXT_PUBLIC_FIREBASE_APP_ID");

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
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

// Firestore Web SDK handle. Used by client components to write to
// Firestore directly (e.g. form submissions). Reads/writes are
// gated by Firestore Security Rules — see firestore.rules at the
// repo root. NO service account / admin SDK needed.
export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
