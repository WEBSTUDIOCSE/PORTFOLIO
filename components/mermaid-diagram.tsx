"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "@/lib/theme";

// Renders a Mermaid diagram from a text string. The mermaid library
// (~700KB) is dynamic-imported on mount so it never lands in the
// initial JS bundle — only project detail pages that actually have
// a diagram pay the cost, and only after the page is interactive.
//
// Re-renders on theme change so the diagram tracks light/dark. Per
// mermaid docs, the way to swap themes is `mermaid.initialize({ theme })`
// followed by re-running `.render()` on the source — the rendered
// SVG has baked-in colors and isn't theme-reactive on its own.
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
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
  }, [chart, id, resolvedTheme]);

  return (
    <figure className="overflow-x-auto rounded-xl border border-border bg-card p-4 sm:p-6">
      <div
        ref={containerRef}
        role="img"
        aria-label="Architecture diagram"
        className="mermaid-container flex justify-center [&_svg]:max-w-full [&_svg]:!h-auto"
      />
      {error && (
        <p className="mt-3 font-mono text-xs text-destructive">
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
