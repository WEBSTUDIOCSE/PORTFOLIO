// Request schema for POST /api/chat. Validated server-side even
// though the widget already keeps inputs in range client-side —
// same defense-in-depth stance as lib/validation/forms.ts.

import { z } from "zod";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

export const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Say something first")
    .max(1000, "Keep it under 1000 characters"),
  // Client sends at most its last 6 turns — capped again here so a
  // crafted request can't force an oversized system-prompt payload.
  history: z.array(chatMessageSchema).max(6).default([]),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
