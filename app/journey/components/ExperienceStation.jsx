'use client';

// Experience station overlay — work history pulled from the single
// source of truth in lib/experience.ts (shared with the landing
// <Experience /> section). Theme-aware via design tokens, same
// fixed-overlay + crossfade pattern as the other station overlays.

import { ROLES } from '@/lib/experience';

function RoleCard({ r }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10 font-display text-lg font-semibold text-primary">
          {r.company.charAt(0)}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-foreground">
              {r.company}
            </h3>
            {r.current ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Now
              </span>
            ) : null}
          </div>
          <p className="truncate text-sm text-foreground">
            {r.role}
            {r.subRole ? (
              <span className="text-muted-foreground"> · {r.subRole}</span>
            ) : null}
          </p>
        </div>
      </div>

      {/* Meta */}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {r.dates} · {r.duration}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{r.location}</p>

      {/* Headline bullet */}
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {r.bullets[0]}
      </p>

      {/* Stack */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {r.stack.slice(0, 5).map((s) => (
          <span
            key={s}
            className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ExperienceStation({ scrollT, index }) {
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
      <div className="relative z-10 flex h-full w-full items-start justify-center overflow-y-auto px-4 py-6 sm:items-center sm:px-6">
        <div className="mx-auto w-full max-w-4xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.3em] text-primary">
              अनुभव · Experience
            </p>
            <h2 className="mb-2 text-2xl font-light tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Where I&apos;ve worked.
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              From Android internships to leading a Next.js platform — built
              end-to-end, in production.
            </p>
          </div>

          {/* Role cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {ROLES.map((r) => (
              <RoleCard key={r.company} r={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
