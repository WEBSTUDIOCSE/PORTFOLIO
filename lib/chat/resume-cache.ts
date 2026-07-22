import "server-only";

// The resume PDF is re-uploaded to Firebase Storage by an external
// script, independent of code deploys — this cache re-fetches and
// re-parses it on a TTL so a new upload shows up without a redeploy,
// without re-parsing the PDF on every single chat message.
//
// Module-scoped, so the cache lives for the lifetime of one
// serverless instance — cold starts just refetch, which is fine.

import { pdfBufferToText } from "./pdf-to-text";

const TTL_MS = 60 * 60 * 1000; // 1 hour

let cache: { text: string; fetchedAt: number } | null = null;
// Coalesces concurrent refreshes (e.g. several chat requests landing
// on a cold cache at once) into a single fetch+parse.
let pending: Promise<string> | null = null;

async function fetchAndParseResume(): Promise<string> {
  // NEXT_PUBLIC_RESUME_URL is a public Firebase Storage URL (same var
  // the Footer/journey ContactStation download links already use).
  // Its "falls back to /resume.pdf" convention there is a *client*
  // href — that only resolves against the browser's current origin,
  // which doesn't exist server-side, so this module requires the
  // real absolute URL and degrades gracefully (not a hard crash) if
  // it's unset, same as any other fetch failure below.
  const url = process.env.NEXT_PUBLIC_RESUME_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_RESUME_URL is not set — cannot fetch resume server-side.");
  }
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Resume fetch failed: ${res.status} ${res.statusText}`);
  }
  return pdfBufferToText(await res.arrayBuffer());
}

/**
 * Returns the resume's extracted text, refreshing it in the
 * background once the TTL has elapsed. Never throws — on any
 * failure (missing env var, network error, PDF parse error) it logs
 * and serves whatever's cached (stale is better than nothing), or an
 * empty string on a cold cache with no prior success, so the bot can
 * still answer from the rest of the knowledge base.
 */
export async function getResumeText(): Promise<string> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < TTL_MS) return cache.text;

  if (!pending) {
    pending = fetchAndParseResume()
      .then((text) => {
        cache = { text, fetchedAt: Date.now() };
        return text;
      })
      .catch((err) => {
        console.error("[chat] resume fetch/parse failed:", err);
        return cache?.text ?? "";
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}
