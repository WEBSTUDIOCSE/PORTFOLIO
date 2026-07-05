import { ImageResponse } from "next/og";

// Static OG image for the homepage. Next.js renders this at build
// time and wires the og:image / twitter:image meta tags automatically.
// Satori (the engine behind ImageResponse) supports only a subset of
// CSS — flexbox layout, no grid, no @media queries.

export const alt =
  "Saurabh Jadhav — Full Stack & AI Engineer. I build systems that replace headcount.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette mirrors :root in app/globals.css.
const CREAM = "#efe8d8";
const PAPER = "#f7efd9";
const INK = "#2a1a14";
const INK_SOFT = "#5a4435";
const MAROON = "#7a1f2b";
const BRASS = "#b88c3f";

export default async function Image() {
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
        {/* Top stripe — brass + maroon accent line */}
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
            Portfolio · 2026
          </div>
        </div>

        {/* Headline block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 44,
              color: MAROON,
              fontStyle: "italic",
              fontFamily: "serif",
            }}
          >
            hello.
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 8,
            }}
          >
            <div
              style={{
                fontSize: 108,
                lineHeight: 1,
                letterSpacing: -2,
                color: INK,
              }}
            >
              Saurabh Jadhav
            </div>
            <div
              style={{
                fontSize: 32,
                color: INK_SOFT,
                marginTop: 14,
                fontFamily: "sans-serif",
              }}
            >
              Full Stack &amp; AI Engineer · Mumbai
            </div>
          </div>
        </div>

        {/* Tagline block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontSize: 38,
              color: MAROON,
              maxWidth: 900,
              lineHeight: 1.2,
            }}
          >
            I build systems that replace headcount.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                fontSize: 16,
                color: INK_SOFT,
                letterSpacing: 6,
                textTransform: "uppercase",
                fontFamily: "monospace",
              }}
            >
              One developer · Infinite leverage
            </div>
            <div
              style={{
                width: 60,
                height: 2,
                backgroundColor: BRASS,
              }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
