"use server";

import "server-only";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { sendResumeRequestEmail } from "@/lib/email/resend";
import {
  resumeRequestSchema,
  type ResumeField,
} from "@/lib/validation/forms";

// Server Action's only job now is to email me when someone requests
// the resume. The Firestore write happens client-side via the Web
// SDK (see ResumeForm) — rules in firestore.rules enforce shape +
// validation server-side, so we don't need the Admin SDK.
//
// Why keep the Server Action at all? Because emailing requires the
// Resend API key, which IS a real secret (unlike the Firebase web
// config). The key has to live in a server-only environment.

export type ResumeResult =
  | { ok: true; downloadUrl: string }
  | {
      ok: false;
      error: string;
      fields?: Partial<Record<ResumeField, string>>;
    };

const RESUME_URL =
  process.env.NEXT_PUBLIC_RESUME_URL ?? "/resume.pdf";

export async function notifyResumeRequest(
  formData: FormData,
): Promise<ResumeResult> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return { ok: false, error: `Too many requests. Try again in ${limit.retryAfter}s.` };
  }

  const honeypot = formData.get("company_url");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    // Silent success — bot doesn't get told it was caught.
    return { ok: true, downloadUrl: RESUME_URL };
  }

  // Re-validate on the server (defense in depth — client can be
  // tampered with, but Firestore rules + this Zod parse catch it).
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

  // Email send is best-effort. Firestore already has the record
  // (written client-side), so if Resend hiccups, the lead isn't lost.
  try {
    await sendResumeRequestEmail({ name, email, role, company });
  } catch (err) {
    console.error("[resume] email send failed:", err);
    return { ok: false, error: "Failed to send email notification. Please try again later." };
  }

  return { ok: true, downloadUrl: RESUME_URL };
}
