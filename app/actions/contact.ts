"use server";

import "server-only";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email/resend";
import {
  contactSchema,
  type ContactField,
} from "@/lib/validation/forms";

// Server Action's only job now is to email me when someone submits
// the contact form. The Firestore write happens client-side via the
// Web SDK (see ContactForm) — Firestore Rules enforce shape +
// validation, so we don't need the Admin SDK.
//
// Why keep the Server Action at all? Because emailing requires the
// Resend API key, which IS a real secret. The key has to live in a
// server-only environment.

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fields?: Partial<Record<ContactField, string>>;
    };

export async function notifyContact(
  formData: FormData,
): Promise<ContactResult> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return { ok: false, error: `Too many requests. Try again in ${limit.retryAfter}s.` };
  }

  const honeypot = formData.get("company_url");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    // Silent success — bot doesn't get told it was caught.
    return { ok: true };
  }

  // Re-validate on the server (defense in depth — client can be
  // tampered with; Firestore Rules + this Zod parse catch it).
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

  // Email is best-effort. Firestore already has the record (written
  // client-side), so if Resend hiccups, the lead isn't lost.
  try {
    await sendContactEmail({ name, email, message });
  } catch (err) {
    console.error("[contact] email send failed:", err);
    return { ok: false, error: "Failed to send email notification. Please try again later." };
  }

  return { ok: true };
}
