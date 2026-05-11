"use server";

import "server-only";
import { headers } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { sendContactEmail } from "@/lib/email/resend";
import {
  contactSchema,
  type ContactField,
} from "@/lib/validation/forms";

// Discriminated union — the client handles { ok: true } and
// { ok: false, ... } as exhaustive cases. `fields` carries per-field
// validation messages for inline rendering under each input.
export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fields?: Partial<Record<ContactField, string>>;
    };

const RATE_LIMIT_MS = 60_000; // 60s per email
const COLLECTION = "contactSubmissions";

export async function submitContact(
  formData: FormData,
): Promise<ContactResult> {
  // ── 1. Honeypot — silently succeed for bots ──────────────────
  const honeypot = formData.get("company_url");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    // Return success to avoid telling the bot we caught it.
    return { ok: true };
  }

  // ── 2. Validate with Zod ─────────────────────────────────────
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company_url: honeypot,
  });
  if (!parsed.success) {
    const fields: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (
        (key === "name" || key === "email" || key === "message") &&
        !fields[key]
      ) {
        fields[key] = issue.message;
      }
    }
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fields,
    };
  }

  const { name, email, message } = parsed.data;

  // ── 3. Rate limit — same email within 60s = reject ───────────
  let db;
  try {
    db = adminDb();
  } catch (err) {
    // Admin SDK misconfigured (missing env, bad key). Don't expose
    // details to the user but log loudly for the operator.
    console.error("[contact] admin SDK init failed:", err);
    return {
      ok: false,
      error: "We hit a glitch on our side. Try again in a moment.",
    };
  }

  try {
    const recent = await db
      .collection(COLLECTION)
      .where("email", "==", email)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();
    if (!recent.empty) {
      const last = recent.docs[0].data();
      const lastMs = last.createdAt?.toMillis?.() ?? 0;
      if (Date.now() - lastMs < RATE_LIMIT_MS) {
        return {
          ok: false,
          error: "Please wait a moment before sending another message.",
        };
      }
    }
  } catch (err) {
    // Rate-limit check failure shouldn't block submission — log and
    // continue. We'd rather receive a duplicate than reject a real one.
    console.error("[contact] rate limit check failed:", err);
  }

  // ── 4. Persist to Firestore (audit log) ──────────────────────
  const hdrs = await headers();
  const userAgent = hdrs.get("user-agent") ?? null;

  try {
    await db.collection(COLLECTION).add({
      name,
      email,
      message,
      userAgent,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("[contact] firestore write failed:", err);
    return {
      ok: false,
      error: "Something went wrong saving your message. Try again.",
    };
  }

  // ── 5. Send email (best-effort — submission is saved already) ─
  try {
    await sendContactEmail({ name, email, message });
  } catch (err) {
    // Email is the notification channel, not the source of truth.
    // The submission is in Firestore — operator can backfill if Resend
    // is down. Don't fail the user.
    console.error("[contact] email send failed:", err);
  }

  return { ok: true };
}
