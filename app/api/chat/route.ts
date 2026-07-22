import "server-only";
import { headers } from "next/headers";
import { chatRateLimit } from "@/lib/rate-limit";
import { checkAndIncrementDailyCap } from "@/lib/chat/daily-cap";
import { chatRequestSchema } from "@/lib/chat/schema";
import { getResumeText } from "@/lib/chat/resume-cache";
import { buildSystemPrompt } from "@/lib/chat/knowledge-base";
import { streamGLMChatCompletion } from "@/lib/chat/glm-client";

// Route Handler, not a Server Action — Server Actions use React's
// action-encoding protocol, not a plain fetch, so a fetch-based
// streaming client would be fighting that protocol instead of just
// reading a ReadableStream off a normal Response. This is the
// idiomatic way to stream tokens to a fetch() client.
export const runtime = "nodejs"; // firebase-admin needs Node, not edge
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for") ?? "unknown";

  // Per-IP check first — cheapest possible rejection, no Firestore
  // round-trip for an obviously-throttled caller.
  const ipLimit = chatRateLimit.check(ip);
  if (!ipLimit.ok) {
    return jsonError(
      429,
      `Too many messages — try again in ${ipLimit.retryAfter}s.`,
      { "Retry-After": String(ipLimit.retryAfter) },
    );
  }

  // Global daily cap next — still cheap (one Firestore transaction)
  // relative to a GLM call, checked before we do any real work.
  // Deliberately fails CLOSED: if the Admin SDK can't be reached
  // (missing/invalid FIREBASE_SERVICE_ACCOUNT_KEY_B64, network blip),
  // we can't confirm the shared daily budget hasn't already been
  // exhausted, so the safe default is to block rather than silently
  // let the free-tier quota go unguarded.
  let cap: { ok: boolean; remaining: number };
  try {
    cap = await checkAndIncrementDailyCap();
  } catch (err) {
    console.error("[chat] daily-cap check failed (Admin SDK/Firestore misconfigured?):", err);
    return jsonError(
      503,
      "Chat is temporarily unavailable (configuration issue). Please use the email/socials in the footer instead.",
    );
  }
  if (!cap.ok) {
    return jsonError(
      429,
      "I've hit my daily chat budget — please try again tomorrow, or use the email/socials in the footer.",
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Malformed request body.");
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Invalid request.");
  }

  const { message, history } = parsed.data;
  const resumeText = await getResumeText(); // degrades to "" on failure, never throws

  const messages = [
    { role: "system" as const, content: buildSystemPrompt(resumeText) },
    ...history,
    { role: "user" as const, content: message },
  ];

  try {
    const stream = await streamGLMChatCompletion({ messages });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err) {
    console.error("[chat] GLM call failed:", err);
    return jsonError(
      502,
      "The assistant is unavailable right now. Please try again shortly.",
    );
  }
}

function jsonError(
  status: number,
  error: string,
  extraHeaders?: Record<string, string>,
) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}
