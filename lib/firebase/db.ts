// Firestore Web SDK handle. Lives in its own module so the
// `firebase/firestore` chunk is only pulled when a component
// actually calls `getDb()` — keeping it out of the root layout's
// Analytics-loading chain. See `./app.ts` for the rationale.
//
// Used by client components to write to Firestore directly (e.g.
// form submissions). Reads/writes are gated by Firestore Security
// Rules at firestore.rules in the repo root. NO service-account /
// Admin SDK needed for this path.

import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "./app";

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
