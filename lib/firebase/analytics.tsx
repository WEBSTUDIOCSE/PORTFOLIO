"use client";

import { useEffect } from "react";
import { getFirebaseApp } from "./app";

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

// Idle-callback type — `requestIdleCallback` lives on Window but
// isn't in lib.dom on every TS lib version.
type IdleWindow = Window & {
  requestIdleCallback?: (
    cb: () => void,
    opts?: { timeout?: number },
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

export function FirebaseAnalytics() {
  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const boot = async () => {
      if (cancelled) return;
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

    // Defer Analytics until the main thread is idle so it doesn't
    // contend with hero canvas decode + scroll handler setup on
    // first paint. requestIdleCallback fires after layout/paint
    // have settled; the 5s timeout caps the wait so analytics
    // still fires on heavily-loaded pages.
    const w = window as IdleWindow;
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(boot, { timeout: 5000 });
    } else {
      // Safari < 16.4 still ships without requestIdleCallback.
      // Use a generous setTimeout so analytics still fires post-hydration.
      timeoutId = setTimeout(boot, 2500);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && w.cancelIdleCallback) {
        w.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
