// In-memory sliding-window rate limiter. Per-process/per-instance —
// resets on redeploy and isn't shared across serverless instances,
// which is fine for per-IP throttling (each limiter here is a second
// line of defense, not the sole guarantee — see lib/chat/daily-cap.ts
// for the durable, cross-instance global cap the chat endpoint also
// enforces).

export type RateLimitResult = { ok: boolean; retryAfter?: number };

function createRateLimiter(windowMs: number, maxRequests: number) {
  const hits = new Map<string, number[]>();

  return {
    check(ip: string): RateLimitResult {
      const now = Date.now();
      const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);

      if (timestamps.length >= maxRequests) {
        const oldest = timestamps[0];
        return { ok: false, retryAfter: Math.ceil((oldest + windowMs - now) / 1000) };
      }

      timestamps.push(now);
      hits.set(ip, timestamps);
      return { ok: true };
    },
  };
}

// Contact form — 5 submissions per 15 minutes per IP. Kept as a
// standalone function (not the .check() shape) since app/actions/
// contact.ts already calls it this way and there's no reason to
// touch a working call site.
const contactLimiter = createRateLimiter(15 * 60 * 1000, 5);
export function rateLimit(ip: string): RateLimitResult {
  return contactLimiter.check(ip);
}

// Chat widget — 8 messages per 10 minutes per IP. Tighter window than
// the contact form since a chat conversation is naturally many more
// requests than a single form submission, but still generous enough
// for a real back-and-forth without leaving room for abuse against
// the shared GLM free-tier quota (see lib/chat/daily-cap.ts for the
// global cap that backs this per-IP check up).
export const chatRateLimit = createRateLimiter(10 * 60 * 1000, 8);
