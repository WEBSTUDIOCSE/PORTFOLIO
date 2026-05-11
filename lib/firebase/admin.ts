import "server-only";
// ─────────────────────────────────────────────────────────────
// Firebase Admin SDK (server-only).
//
// SECURITY POSTURE:
//   • This module is poisoned with `server-only` — Next.js will
//     fail the build if it's imported from a client component.
//   • The service-account credential lives in
//     FIREBASE_SERVICE_ACCOUNT_KEY_B64 (NEVER prefixed
//     NEXT_PUBLIC_), so it's never inlined into client bundles.
//   • Admin SDK bypasses Firestore Security Rules. That's by
//     design — our rules stay deny-all to block direct client
//     writes; trusted server-side writes go through this module.
//
// Reference: https://firebase.google.com/docs/admin/setup
// ─────────────────────────────────────────────────────────────

import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function readServiceAccount(): ServiceAccount {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64;
  if (!b64) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_KEY_B64. Generate a key from " +
        "Firebase Console → Settings → Service Accounts and store the " +
        "base64-encoded JSON in .env.local.",
    );
  }
  try {
    const json = Buffer.from(b64, "base64").toString("utf8");
    return JSON.parse(json) as ServiceAccount;
  } catch (err) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY_B64 is not valid base64-encoded JSON. " +
        `Original error: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

// Singleton across Next.js HMR / RSC + Edge runtime calls.
function adminApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];
  return initializeApp({
    credential: cert(readServiceAccount()),
  });
}

export function adminDb() {
  return getFirestore(adminApp());
}
