'use client';

// Projects station overlay — tiles for shipped work, pulled from the
// single source of truth in lib/projects.ts (no duplicated data).
// Same fixed-overlay + crossfade behaviour as Skills/Contact so the
// projects stop reads as a coherent "station".
//
// CURATION: SHOW_SLUGS picks which projects appear here (and their
// order). Add a slug — e.g. 'openclaw' — to surface another tile.

import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';

const SHOW_SLUGS = ['cinematictale', 'elite-mindset-forge'];

const TILES = SHOW_SLUGS.map((slug) =>
  PROJECTS.find((p) => p.slug === slug)
).filter(Boolean);

function Tile({ p }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {p.number}
        </span>
        {p.metric ? (
          <span className="truncate font-mono text-[10px] uppercase tracking-wide text-primary">
            {p.metric}
          </span>
        ) : null}
      </div>

      <h3 className="mt-2 text-base font-semibold leading-snug text-foreground sm:text-lg">
        {p.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {p.oneLiner}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.stack.slice(0, 5).map((s) => (
          <span
            key={s}
            className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 pt-1">
        {p.href ? (
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Visit live ↗
          </a>
        ) : null}
        <Link
          href={`/work/${p.slug}`}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Case study →
        </Link>
      </div>
    </div>
  );
}

export default function ProjectsStation({ scrollT, index }) {
  const opacity = Math.max(0, 1 - Math.abs(scrollT - index));

  return (
    <section
      className="overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 'calc(var(--routemap-h, 96px) + 110px)',
        zIndex: 10,
        opacity,
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
      aria-hidden={opacity < 0.5}
    >
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-4xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.3em] text-primary">
              कार्य · Projects
            </p>
            <h2 className="mb-2 text-2xl font-light tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Things I&apos;ve shipped.
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Live products, built end-to-end — design, code, and deploy.
            </p>
          </div>

          {/* Tiles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {TILES.map((p) => (
              <Tile key={p.slug} p={p} />
            ))}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-[11px] tracking-wide text-muted-foreground">
            More on the work page · saurabhjadhav.in/work
          </p>
        </div>
      </div>
    </section>
  );
}
