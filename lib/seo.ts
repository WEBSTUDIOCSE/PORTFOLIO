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
