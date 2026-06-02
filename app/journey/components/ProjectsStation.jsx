'use client';

// Projects station overlay — tiles for shipped work, pulled from the
// single source of truth in lib/projects.ts (no duplicated data).
// Restyled for a cinematic, glassmorphic "game menu" aesthetic.

import Link from 'next/link';
import { PROJECTS } from '@/lib/projects';

const SHOW_SLUGS = ['cinematictale', 'elite-mindset-forge'];

const TILES = SHOW_SLUGS.map((slug) =>
  PROJECTS.find((p) => p.slug === slug)
).filter(Boolean);

function Tile({ p }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/30 hover:bg-black/60 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
      {/* Decorative corner accent */}
      <div className="absolute left-0 top-0 h-8 w-8 -translate-x-4 -translate-y-4 rotate-45 bg-white/10 transition-transform duration-500 group-hover:bg-white/20" />

      <div className="flex items-center justify-between gap-3 relative z-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          {p.number}
        </span>
        {p.metric ? (
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
            {p.metric}
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-xl font-medium leading-snug text-white/95 relative z-10">
        {p.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70 relative z-10">
        {p.oneLiner}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 relative z-10">
        {p.stack.slice(0, 5).map((s) => (
          <span
            key={s}
            className="rounded-sm border border-white/5 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/60"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 relative z-10 pt-2">
        {p.href ? (
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
          >
            Launch Live ↗
          </a>
        ) : null}
        <Link
          href={`/work/${p.slug}`}
          className="group/link inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/60 transition-colors hover:text-white"
        >
          View Data <span className="transition-transform group-hover/link:translate-x-1">→</span>
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
        // Match the layout exactly so it stops above the dock
        bottom: 'calc(var(--routemap-h, 96px))',
        zIndex: 10,
        opacity,
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
      aria-hidden={opacity < 0.5}
    >
      {/* Changed: removed sm:items-center to fix top-clipping on tall content,
          added pt-24 pb-32 for padding so it's scrollable and looks good. */}
      <div className="relative z-10 flex h-full w-full items-start justify-center overflow-y-auto px-4 pt-16 pb-32 sm:px-6 sm:pt-24 sm:pb-40">
        <div className="mx-auto w-full max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
                SYSTEM LOG · 04
              </p>
              <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
                Deployed <span className="font-medium italic">Assets</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/60 text-center sm:text-right font-mono text-[11px] uppercase tracking-wider">
              Live products, built end-to-end. Design to production.
            </p>
          </div>

          {/* Tiles */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {TILES.map((p) => (
              <Tile key={p.slug} p={p} />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <Link 
              href="/work"
              className="inline-block border border-white/20 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 transition-all hover:bg-white hover:text-black"
            >
              Access Complete Database →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
