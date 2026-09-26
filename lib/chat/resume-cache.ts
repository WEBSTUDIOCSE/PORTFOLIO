import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

// The local resume PDF is parsed once per server instance and refreshed on
// a TTL, so the chat and the download link share one source of truth.
//
// Module-scoped, so the cache lives for the lifetime of one
// serverless instance — cold starts just refetch, which is fine.

import { pdfBufferToText } from "./pdf-to-text";

const TTL_MS = 60 * 60 * 1000; // 1 hour
const LOCAL_RESUME_PATH = path.join(
  process.cwd(),
  "public",
  "resume",
  "saurabh-jadhav-resume.pdf",
);

let cache: { text: string; fetchedAt: number } | null = null;
// Coalesces concurrent refreshes (e.g. several chat requests landing
// on a cold cache at once) into a single fetch+parse.
let pending: Promise<string> | null = null;

async function fetchAndParseResume(): Promise<string> {
  const localFile = await readFile(LOCAL_RESUME_PATH);
  const localBuffer = localFile.buffer.slice(
    localFile.byteOffset,
    localFile.byteOffset + localFile.byteLength,
  ) as ArrayBuffer;
  return pdfBufferToText(localBuffer);
}

/**
 * Returns the resume's extracted text, refreshing it in the
 * background once the TTL has elapsed. Never throws — on any
 * failure (missing file or PDF parse error) it logs
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
