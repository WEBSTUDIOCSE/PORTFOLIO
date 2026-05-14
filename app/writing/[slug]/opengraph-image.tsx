import { ImageResponse } from "next/og";
import { PUBLISHED_POSTS, POSTS } from "@/lib/writing";

// Per-post OG image. Visually mirrors the editorial card style used
// elsewhere on the site, with the post title as the visual anchor
// and metadata (date · readTime · tags) along the bottom rail.
//
// Satori supports flex only — no grid, no media queries.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#efe8d8";
const PAPER = "#f7efd9";
const INK = "#2a1a14";
const INK_SOFT = "#5a4435";
const MAROON = "#7a1f2b";
const BRASS = "#b88c3f";

export function generateImageMetadata() {
  return PUBLISHED_POSTS.map((p) => ({
    id: p.slug,
    alt: `${p.title} — Saurabh Jadhav`,
    contentType: "image/png",
    size,
  }));
}

type Params = { params: Promise<{ slug: string }> };

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function Image({ params }: Params) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);

  const title = post?.title ?? "Writing";
  const excerpt = post?.excerpt ?? "";
  const date = post?.date ? formatDate(post.date) : "";
  const readTime = post?.readTime ?? "";
  const tags = post?.tags ?? [];

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
        {/* Top — kicker */}
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
            Writing · Saurabh Jadhav
          </div>
        </div>

        {/* Title + excerpt */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: INK,
            }}
          >
            {title}
          </div>
          {excerpt && (
            <div
              style={{
                fontSize: 26,
                color: INK_SOFT,
                lineHeight: 1.35,
                maxWidth: 980,
                fontFamily: "sans-serif",
              }}
            >
              {excerpt.length > 190 ? excerpt.slice(0, 188) + "…" : excerpt}
            </div>
          )}
        </div>

        {/* Footer — date + tags */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
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
              fontSize: 16,
              color: INK_SOFT,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontFamily: "monospace",
              display: "flex",
              gap: 14,
            }}
          >
            {[date, readTime, ...tags].filter(Boolean).join("  ·  ")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
