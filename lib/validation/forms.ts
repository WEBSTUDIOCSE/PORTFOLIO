// Zod schemas for form inputs. Single source of truth for shape +
// constraints — used by both the client (for inline error messages)
// and the server (as the only thing we trust after the network).
//
// HONEYPOT NOTE: the optional `company_url` field is a hidden form
// input. Real users never see it; bots fill every input they find.
// Server-side, any non-empty value silently rejects the submission.

import { z } from "zod";

// ─── Contact form ─────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Required")
    .max(100, "Keep it under 100 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("That doesn't look like an email")
    .max(200),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a bit more (at least 10 characters)")
    .max(5000, "That's a lot — try keeping it under 5000 characters"),
  company_url: z.string().max(0).optional(), // honeypot — must be empty
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = "name" | "email" | "message";
