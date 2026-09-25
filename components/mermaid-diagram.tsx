"use client";

import { useEffect, useId, useRef, useState } from "react";

// Renders a Mermaid diagram from a text string. The mermaid library
// (~700KB) is dynamic-imported on mount so it never lands in the
// initial JS bundle — only project detail pages that actually have
// a diagram pay the cost, and only after the page is interactive.
//
// Every page that renders a diagram (/work/[slug]) is a light
// section now (.theme-light-sand — see app/globals.css), so this
// always initializes Mermaid's "default" (light) theme rather than
// reading site theme state: lib/theme.tsx's `resolvedTheme` is
// permanently "dark" (a holdover from the site's old dark-only
// commitment) and would otherwise render a dark diagram box on a
// light page.
//
// `useId` namespaces every diagram instance so multiple diagrams on
// the same page don't collide on Mermaid's internal SVG element IDs.

export default function MermaidDiagram({
  chart,
  caption,
}: {
  chart: string;
  caption?: string;
}) {
  const id = useId().replace(/:/g, "_");
  const figureRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  // `inView` gates the dynamic import. Mermaid is ~700 KB even
  // tree-shaken, and blocks the main thread ~600 ms while rendering
  // a flowchart. On a long project-detail page where the diagram
  // sits below Approach (often below the fold), there's no reason
  // to pay that cost during initial load — IntersectionObserver
  // flips this to true once the user scrolls within 200 px of the
  // figure, then the import + render fires.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = figureRef.current;
    if (!el) return;
    // SSR-safety: IntersectionObserver is browser-only.
    if (typeof IntersectionObserver === "undefined") {
      const fallback = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(fallback);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          flowchart: {
            curve: "basis",
            // Keep the map at a readable working width. The viewport below
            // handles horizontal scrolling on narrow screens instead of
            // compressing a systems diagram into illegible text.
            useMaxWidth: false,
            padding: 20,
          },
          themeVariables: {
            background: "#fffaf1",
            primaryColor: "#fffaf1",
            primaryTextColor: "#1a1a1a",
            primaryBorderColor: "#1a1a1a",
            lineColor: "#8a6526",
            secondaryColor: "#f4ece2",
            tertiaryColor: "#ead9b7",
            clusterBkg: "#f4ece2",
            clusterBorder: "#c7a96a",
            fontSize: "16px",
          },
          fontFamily: "var(--font-geist-sans)",
          securityLevel: "strict",
        });
        const { svg } = await mermaid.render(`m-${id}`, chart);
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        setError(null);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id, inView]);

  return (
    <figure
      ref={figureRef}
      aria-busy={!inView}
      className="overflow-hidden rounded-[1.75rem] border border-[#1a1a1a]/15 bg-[#fffaf1] shadow-[0_18px_50px_rgba(26,26,26,0.07)]"
    >
      <div className="flex items-start justify-between gap-4 border-b border-[#1a1a1a]/10 px-5 py-4 sm:px-7">
        <div>
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#8a6526]">
            System map
          </p>
          <h3 className="mt-1 font-display text-xl text-[#1a1a1a] sm:text-2xl">
            How the pieces connect
          </h3>
        </div>
        <span className="hidden shrink-0 pt-1 font-sans text-[10px] uppercase tracking-[0.16em] text-[#1a1a1a]/45 sm:block">
          ← read left to right
        </span>
      </div>

      <div
        className="overflow-x-auto overscroll-x-contain p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a6526] focus-visible:ring-inset sm:p-7"
        tabIndex={0}
        aria-label="Scrollable architecture diagram"
      >
        <div
          ref={containerRef}
          role="img"
          aria-label="Architecture diagram"
          className="mermaid-container flex min-h-[18rem] min-w-[720px] items-center justify-center [&_svg]:!h-auto [&_svg]:!max-w-none"
        >
          {!inView && (
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/45">
              Diagram · loads on scroll
            </span>
          )}
        </div>
      </div>
      {error && (
        <div role="alert" className="border-t border-[#8a6526]/20 bg-[#f4ece2] px-5 py-4 text-sm text-[#1a1a1a]/70 sm:px-7">
          <p className="font-medium text-[#1a1a1a]">
            This system map could not render in this browser.
          </p>
          <p className="mt-1 text-xs">
            The architecture summary below still describes the complete flow.
          </p>
        </div>
      )}
      {caption && (
        <figcaption className="border-t border-[#1a1a1a]/10 px-5 py-5 text-sm leading-relaxed text-[#1a1a1a]/65 sm:px-7">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
