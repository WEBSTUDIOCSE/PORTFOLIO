"use server";

import "server-only";
import { headers } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { sendResumeRequestEmail } from "@/lib/email/resend";
import {
  resumeRequestSchema,
  type ResumeField,
} from "@/lib/validation/forms";

// Same shape as ContactResult — but with the addition of
// `downloadUrl` on success so the client can reveal a download link.
// "Soft gating": the URL is just /resume.pdf (public asset). The
// gate is psychological/intent-capture, not access control.
export type ResumeResult =
  | { ok: true; downloadUrl: string }
  | {
      ok: false;
      error: string;
      fields?: Partial<Record<ResumeField, string>>;
    };

const RATE_LIMIT_MS = 60_000;
const COLLECTION = "resumeRequests";
const RESUME_URL = "/resume.pdf";

export async function requestResume(
  formData: FormData,
): Promise<ResumeResult> {
  const honeypot = formData.get("company_url");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    // Silent success — don't tell the bot we caught it. They also
    // don't get the download URL, but a real user never trips this.
    return { ok: true, downloadUrl: RESUME_URL };
  }

  const parsed = resumeRequestSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    company: formData.get("company"),
    company_url: honeypot,
  });
  if (!parsed.success) {
    const fields: Partial<Record<ResumeField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (
        (key === "name" ||
          key === "email" ||
          key === "role" ||
          key === "company") &&
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

  const { name, email, role, company } = parsed.data;

  let db;
  try {
    db = adminDb();
  } catch (err) {
    console.error("[resume] admin SDK init failed:", err);
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
        // Within rate limit — still let them download (their info
        // is already captured), just don't double-write or re-email.
        return { ok: true, downloadUrl: RESUME_URL };
      }
    }
  } catch (err) {
    console.error("[resume] rate limit check failed:", err);
  }

  const hdrs = await headers();
  const userAgent = hdrs.get("user-agent") ?? null;

  try {
    await db.collection(COLLECTION).add({
      name,
      email,
      role,
      company,
      userAgent,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("[resume] firestore write failed:", err);
    return {
      ok: false,
      error: "Something went wrong. Try again in a moment.",
    };
  }

  try {
    await sendResumeRequestEmail({ name, email, role, company });
  } catch (err) {
    console.error("[resume] email send failed:", err);
  }

  return { ok: true, downloadUrl: RESUME_URL };
}
