"use client";

import { useEffect } from "react";
import { getFirebaseApp } from "./client";

// Firebase Analytics bootstrap.
//
// Analytics is browser-only — it depends on `window`, `navigator`,
// and IndexedDB. Calling getAnalytics() during SSR throws. The
// official pattern is:
//
//   1. Mount in a "use client" effect (post-hydration only).
//   2. Call isSupported() before init — handles older browsers,
//      private windows, environments without IndexedDB.
//   3. Dynamic import so the analytics chunk is split out of the
//      initial bundle (~30 KB saved on first paint).
//
// Reference: https://firebase.google.com/docs/analytics/get-started?platform=web

export function FirebaseAnalytics() {
  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        const { isSupported, getAnalytics } = await import(
          "firebase/analytics"
        );
        const ok = await isSupported();
        if (!ok || cancelled) return;
        getAnalytics(getFirebaseApp());
      } catch {
        // Analytics is best-effort — never crash the app for it.
      }
    };

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
