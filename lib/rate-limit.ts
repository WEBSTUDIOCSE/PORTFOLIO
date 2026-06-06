const windowMs = 15 * 60 * 1000; // 15 minutes
const maxRequests = 5;           // 5 submissions per window

const hits = new Map<string, number[]>();

export function rateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter(t => now - t < windowMs);

  if (timestamps.length >= maxRequests) {
    const oldest = timestamps[0];
    return { ok: false, retryAfter: Math.ceil((oldest + windowMs - now) / 1000) };
  }

  timestamps.push(now);
  hits.set(ip, timestamps);
  return { ok: true };
}
