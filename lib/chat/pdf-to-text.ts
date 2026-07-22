import "server-only";

// Thin wrapper around unpdf (not pdf-parse — pdf-parse runs debug
// code at import time that does a synchronous fs.readFileSync
// against a bundled test fixture, which is a well-known footgun
// under serverless bundling). unpdf ships PDF.js repackaged for
// edge/serverless with no Node-native fs dependency at import time.
import { extractText, getDocumentProxy } from "unpdf";

export async function pdfBufferToText(buffer: ArrayBuffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  // Collapse trailing whitespace before newlines (PDF text extraction
  // commonly leaves these) without touching intentional blank lines.
  return text.replace(/[ \t]+\n/g, "\n").trim();
}
