import { ImageResponse } from "next/og";
import { PROJECTS } from "@/lib/projects";

// Per-project OG image. Next.js generates one at /work/[slug]/
// opengraph-image and auto-wires it to the OpenGraph + Twitter card
// meta tags for that route. When the link is shared on social or
// chat, the right project's card shows up instead of the generic
// homepage one.
//
// Satori (the engine behind ImageResponse) supports a CSS subset —
// flexbox only, no grid, no media queries. Layout mirrors the
// editorial palette used by app/opengraph-image.tsx so the site's
// social presence reads as one designed system.
//
// generateImageMetadata pre-computes the list of project slugs at
// build so Next.js can statically render one PNG per project.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#efe8d8";
const PAPER = "#f7efd9";
const INK = "#2a1a14";
const INK_SOFT = "#5a4435";
const MAROON = "#7a1f2b";
const BRASS = "#b88c3f";

export function generateImageMetadata() {
  return PROJECTS.map((p) => ({
    id: p.slug,
    alt: `${p.title} — Saurabh Jadhav`,
    contentType: "image/png",
    size,
  }));
}

type Params = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Params) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  // Fallback to a minimal card if the slug isn't found (shouldn't
  // happen because of generateImageMetadata above, but Next.js
  // requires this function to be defensive).
  const number = project?.number ?? "P-000";
  const title = project?.title?.split(" — ")[0] ?? "Project";
  const tagline = project?.oneLiner ?? "";
  const stack = project?.stack ?? [];
  const metric = project?.metric ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: CREAM,
          backgroundImage: `linear-gradient(135deg, ${CREAM} 0%, ${PAPER} 100%)`,
          padding: 80,
          color: INK,
          fontFamily: "serif",
        }}
      >
        {/* Top stripe */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 4,
              backgroundColor: MAROON,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              fontSize: 18,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: INK_SOFT,
              fontFamily: "monospace",
            }}
          >
            {number} · Work · Saurabh Jadhav
          </div>
        </div>

        {/* Title + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: INK,
            }}
          >
            {title}
          </div>
          {tagline && (
            <div
              style={{
                fontSize: 28,
                color: INK_SOFT,
                lineHeight: 1.3,
                maxWidth: 980,
                fontFamily: "sans-serif",
              }}
            >
              {tagline.length > 180 ? tagline.slice(0, 178) + "…" : tagline}
            </div>
          )}
        </div>

        {/* Footer — metric + stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {metric && (
            <div
              style={{
                fontSize: 22,
                color: MAROON,
                fontStyle: "italic",
                fontFamily: "serif",
              }}
            >
              {metric}
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 60,
                height: 2,
                backgroundColor: BRASS,
              }}
            />
            <div
              style={{
                fontSize: 14,
                color: INK_SOFT,
                letterSpacing: 4,
                textTransform: "uppercase",
                fontFamily: "monospace",
                display: "flex",
                gap: 12,
              }}
            >
              {stack.slice(0, 6).join("  ·  ")}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
