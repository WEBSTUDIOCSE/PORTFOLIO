import "server-only";

// Durable, cross-instance global usage cap for the shared GLM
// free-tier quota. Per-IP throttling (lib/rate-limit.ts) alone can't
// protect the aggregate quota — Vercel runs multiple serverless
// instances, and an in-memory counter doesn't add up across them.
// A Firestore transaction against a day-keyed document does: a new
// UTC date is a new doc starting at 0, so there's no cron/reset job
// to maintain.
//
// Written exclusively via the Admin SDK from this server-only
// module — see firestore.rules for the matching deny-all client rule.

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const DAILY_BUDGET = Number(process.env.CHAT_DAILY_BUDGET ?? 250);

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD
}

let warnedMissingCredential = false;

/**
 * Atomically checks and increments today's usage counter. Returns
 * `ok: false` once the daily budget is hit — the caller should stop
 * before spending a GLM call. Increments *before* the GLM call
 * (cheap Firestore read/write vs. an LLM call) — a rare GLM failure
 * after a successful increment still consumes one unit of budget,
 * which is an acceptable tradeoff over a refund-on-failure write at
 * this traffic scale.
 *
 * DEV-ONLY ESCAPE HATCH: if `FIREBASE_SERVICE_ACCOUNT_KEY_B64` is
 * simply unset (not configured yet, vs. configured-but-failing),
 * this skips the cap entirely rather than blocking every request —
 * lets the GLM integration be tested locally before the Admin SDK is
 * wired up. This is the ONLY case that's allowed to skip the guard;
 * any other failure (bad credential, Firestore down, permission
 * error) still throws and the caller (app/api/chat/route.ts) fails
 * CLOSED, same as before — we can't tell those cases apart from "cap
 * exceeded" so blocking is the safe default. Remove this branch once
 * a real service-account key is in place everywhere this runs.
 */
export async function checkAndIncrementDailyCap(): Promise<{
  ok: boolean;
  remaining: number;
}> {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64) {
    if (!warnedMissingCredential) {
      console.warn(
        "[chat] FIREBASE_SERVICE_ACCOUNT_KEY_B64 is not set — the global daily cap is NOT being enforced. Set this before relying on the cap in production.",
      );
      warnedMissingCredential = true;
    }
    return { ok: true, remaining: Infinity };
  }

  const ref = adminDb().collection("chatUsage").doc(todayKey());

  return adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count = snap.exists ? (snap.data()?.count ?? 0) : 0;

    if (count >= DAILY_BUDGET) {
      return { ok: false, remaining: 0 };
    }

    tx.set(
      ref,
      { count: count + 1, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    return { ok: true, remaining: DAILY_BUDGET - count - 1 };
  });
}
