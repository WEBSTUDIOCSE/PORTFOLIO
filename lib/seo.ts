// Shared SEO constants — single source of truth for site origin and
// the schema.org @id values that link nested structured data back to
// the root Person/WebSite entities.
//
// Why @id matters: when a /work/[slug] page's SoftwareApplication
// schema references `author: { "@id": PERSON_ID }`, Google treats it
// as the SAME person declared in the root layout's Person schema —
// not a duplicate, and the knowledge graph picks up that Saurabh
// authored every project. Without @id, each page would re-declare
// Person and engines could (and sometimes do) deduplicate them
// imperfectly. See https://schema.org/docs/datamodel.html#identifiers

export const SITE_URL = "https://saurabhjadhav.in";

export const SITE_NAME = "Saurabh Jadhav";
export const SITE_TITLE = `${SITE_NAME} — Full Stack & AI Engineer`;
export const SITE_DESCRIPTION =
  "Saurabh Jadhav is a Full Stack & AI Engineer in Mumbai building production Next.js products, multi-agent AI systems, and autonomous content platforms.";
export const SITE_OG_IMAGE = `${SITE_URL}/opengraph-image`;
export const SITE_OG_IMAGE_ALT =
  "Saurabh Jadhav — Full Stack & AI Engineer building production web and AI systems";
export const SITE_KEYWORDS = [
  "Saurabh Jadhav",
  "Full Stack Engineer Mumbai",
  "AI Engineer India",
  "Next.js developer",
  "React developer",
  "TypeScript developer",
  "multi-agent AI systems",
  "generative AI products",
  "system design portfolio",
  "Firebase developer",
  "web performance",
  "production SaaS",
];

/** @id fragment for the canonical Person node declared in app/layout.tsx. */
export const PERSON_ID = `${SITE_URL}/#person`;

/** @id fragment for the WebSite node (declared alongside Person in layout). */
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * XSS-safe JSON-LD stringification. JSON.stringify can emit literal
 * `</script>` inside string fields; replacing `<` with the Unicode
 * escape `<` neutralises any HTML-injection within the payload.
 * Use the returned string as the `dangerouslySetInnerHTML.__html`
 * value of a native `<script type="application/ld+json">`.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
