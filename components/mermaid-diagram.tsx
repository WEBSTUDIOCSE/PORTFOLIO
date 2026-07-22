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
      setInView(true);
      return;
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
            useMaxWidth: true,
            padding: 16,
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
      className="overflow-x-auto rounded-xl border border-border bg-card p-4 sm:p-6"
    >
      <div
        ref={containerRef}
        role="img"
        aria-label="Architecture diagram"
        className="mermaid-container flex min-h-[200px] items-center justify-center [&_svg]:max-w-full [&_svg]:!h-auto"
      >
        {!inView && (
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Diagram · loads on scroll
          </span>
        )}
      </div>
      {error && (
        <p className="mt-3 font-sans text-xs text-destructive">
          Diagram render failed: {error}
        </p>
      )}
      {caption && (
        <figcaption className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
