"use client";

import { useState } from "react";
import Link from "next/link";
import { FEATURED_PROJECTS, type Project } from "@/lib/projects";

// Selected Work — editorial project index.
//
// Below `lg`: full-detail stacked rows (unchanged from the original
// design) — hover doesn't exist on touch, so every row shows its own
// title, one-liner, stack chips and metric inline.
//
// At `lg` and up: a two-column "index + specimen plate" layout,
// borrowed structurally from a bold agency-site pattern but rendered
// in this site's own editorial language (Fraunces, hairline rule,
// mono meta) rather than its high-contrast poster palette. The left
// column is a plain title index; hovering/focusing a title swaps the
// right column's plate — a single live preview instead of ten static
// cards, so the reel reads as one considered specimen at a time.
//
// Section backdrop: the same black (#151515) + dotted-grid treatment
// as the reference site's dark sections (see `.dotted-grid-inverse`
// in app/globals.css, added for the since-removed Studio section and
// reused here), full-bleed and min-h-screen like the other
// DEVSTUDIOLABS-pattern sections on this page. Only the section's own
// background changed — the index/plate/rows inside still use the
// theme's semantic tokens (bg-card, border-border, text-foreground),
// which already read as near-black-on-near-black elevation, so they
// don't need re-deriving for this specific shade.

// Titles in lib/projects.ts read "Name — descriptor". The index
// shows the name huge and the descriptor as a serif deck below it.
function splitTitle(title: string): [string, string | null] {
  const [name, ...rest] = title.split(" — ");
  return [name, rest.length > 0 ? rest.join(" — ") : null];
}

export default function SelectedWork() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="dotted-grid-inverse relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-[#151515] px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <header className="mb-14 max-w-2xl" data-reveal>
          <p className="font-hand text-2xl text-primary">selected work</p>
          <h2
            id="work-heading"
            className="mt-1 font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl"
          >
            What I&rsquo;ve built.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Autonomous multi-agent systems, a live AI SaaS, and
            self-running content platforms — designed, built, and
            shipped end to end by one engineer.
          </p>
          <span
            aria-hidden
            data-fx-line
            className="mt-6 block h-px w-24 bg-primary/60"
          />
        </header>

        {/* Mobile / tablet — stacked full-detail rows */}
        <div className="lg:hidden" data-reveal-stagger>
          {FEATURED_PROJECTS.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </div>

        {/* Desktop — interactive title index + live preview plate */}
        <div className="hidden lg:block">
          <InteractiveIndex projects={FEATURED_PROJECTS} />
        </div>
      </div>
    </section>
  );
}

function InteractiveIndex({ projects }: { projects: Project[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = projects[activeIdx];

  return (
    <div className="grid grid-cols-12 items-start gap-10 xl:gap-16" data-reveal>
      <nav aria-label="Selected work index" className="col-span-5">
        <ol className="m-0 list-none p-0">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <ProjectListRow
                project={p}
                index={i}
                isActive={i === activeIdx}
                onActivate={() => setActiveIdx(i)}
              />
            </li>
          ))}
        </ol>
      </nav>

      <div className="sticky top-28 col-span-7">
        <ProjectPlate project={active} index={activeIdx} />
      </div>
    </div>
  );
}

function ProjectListRow({
  project,
  index,
  isActive,
  onActivate,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const [name] = splitTitle(project.title);

  return (
    <Link
      href={`/work/${project.slug}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-current={isActive ? "true" : undefined}
      className="group relative flex items-baseline gap-4 border-t border-border py-7 pl-6 pr-2 transition-colors duration-300 first:border-t-0 last:border-b last:border-b-border hover:bg-card/40 focus-visible:bg-card/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        aria-hidden
        className={`absolute left-0 top-0 h-full w-[3px] origin-top bg-primary transition-transform duration-500 ease-out ${
          isActive ? "scale-y-100" : "scale-y-0"
        }`}
      />
      <span className="font-mono text-xs text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={`font-display text-2xl font-light tracking-tight transition-colors duration-300 xl:text-3xl 2xl:text-4xl ${
          isActive
            ? "text-foreground"
            : "text-muted-foreground/50 group-hover:text-muted-foreground/80"
        }`}
      >
        {name}
      </span>
      <span
        aria-hidden
        className={`ml-auto shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-primary transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        View →
      </span>
    </Link>
  );
}

function ProjectPlate({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [name, descriptor] = splitTitle(project.title);

  return (
    <Link
      href={`/work/${project.slug}`}
      aria-label={`View project details for ${project.title}`}
      className="project-plate-enter group relative block h-[36rem] max-h-[80vh] overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-primary/40 focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Ghost index number — specimen-plate motif, echoes the
          numbered rows without repeating them literally. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-6 select-none font-display text-[7rem] font-light leading-none text-foreground/[0.04] xl:-top-8 xl:text-[11rem]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Sketchbook annotation — absolutely positioned so its
          presence/absence never changes anything else (only OpenClaw
          has one right now). */}
      {project.highlight && (
        <p className="pointer-events-none absolute right-10 top-10 max-w-[9rem] rotate-2 text-right font-hand-note text-sm text-muted-foreground">
          {project.highlight}
        </p>
      )}

      {/* Every block below is pinned to a fixed offset from the top
          or bottom edge of the h-[36rem] box — nothing is sized by
          its neighbours' content, so switching between projects with
          very different amounts of text (a 5-item stack vs. a
          9-item stack, a one-line vs. a four-line pitch) can never
          change any element's position. line-clamp caps each text
          block so it can't grow past the room reserved for it. */}

      {/* Header — number/year + metric */}
      <div className="absolute inset-x-10 top-10 flex items-start justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {project.number} · {project.year}
        </p>
        {project.metric && (
          <p className="text-right font-display text-lg font-medium tracking-tight text-primary">
            {project.metric}
          </p>
        )}
      </div>

      {/* Title block — starts a fixed distance below the header */}
      <div className="absolute inset-x-10 top-24">
        <h3 className="line-clamp-2 font-display text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          {name}
        </h3>
        {descriptor && (
          <p className="mt-2 line-clamp-1 font-display text-lg font-light text-muted-foreground sm:text-xl">
            {descriptor}
          </p>
        )}
        <p className="mt-5 line-clamp-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          {project.oneLiner}
        </p>
      </div>

      {/* Stack chips — anchored a fixed distance above the footer,
          bounded to 2 rows regardless of how many technologies a
          project lists. */}
      <div className="absolute inset-x-10 bottom-28 flex max-h-[4.5rem] flex-wrap gap-1.5 overflow-hidden">
        {project.stack.slice(0, 6).map((s) => (
          <span
            key={s}
            className="rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
          >
            {s}
          </span>
        ))}
        {project.stack.length > 6 && (
          <span className="rounded-full border border-dashed border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            +{project.stack.length - 6} more
          </span>
        )}
      </div>

      {/* Footer — always glued to the bottom edge */}
      <div className="absolute inset-x-10 bottom-10 flex items-center justify-between border-t border-border pt-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {project.role}
        </p>
        <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-primary">
          Case study
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </p>
      </div>
    </Link>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [name, descriptor] = splitTitle(project.title);

  return (
    <article className="group relative -mx-4 grid grid-cols-1 gap-x-8 gap-y-6 rounded-lg border-t border-border px-4 py-10 transition-colors duration-300 hover:bg-card/50 sm:-mx-6 sm:px-6 md:grid-cols-12 md:py-14 last:border-b last:border-b-border">
      {/* Index + meta rail */}
      <div className="flex items-baseline gap-x-5 md:col-span-2 md:flex-col md:gap-y-3">
        <p
          aria-hidden
          className="font-display text-3xl font-light leading-none text-muted-foreground/50 transition-colors duration-300 group-hover:text-primary md:text-4xl"
        >
          {String(index + 1).padStart(2, "0")}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-4 md:flex-col md:gap-y-1.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {project.number}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {project.year}
          </p>
        </div>
      </div>

      {/* Title + story */}
      <div className="md:col-span-7">
        <h3 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-foreground transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 sm:text-5xl">
          {name}
        </h3>
        {descriptor && (
          <p className="mt-2 font-display text-lg font-light text-muted-foreground sm:text-xl">
            {descriptor}
          </p>
        )}
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {project.oneLiner}
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {project.role}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 6).map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              {s}
            </span>
          ))}
          {project.stack.length > 6 && (
            <span className="rounded-full border border-dashed border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              +{project.stack.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Right rail — metric, annotation, cue */}
      <div className="flex flex-col gap-3 md:col-span-3 md:items-end md:text-right">
        {project.metric && (
          <p className="font-display text-xl font-medium tracking-tight text-primary md:text-2xl">
            {project.metric}
          </p>
        )}
        {project.highlight && (
          <p className="font-hand-note text-sm text-muted-foreground">
            {project.highlight}
          </p>
        )}
        <p className="mt-auto flex items-center gap-1.5 pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-primary">
          Case study
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </p>
      </div>

      {/* Stretched link — the whole row is clickable; the sr-only
          label keeps screen readers from reading the row as one
          giant link name. */}
      <Link
        href={`/work/${project.slug}`}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`View project details for ${project.title}`}
      >
        <span className="sr-only">View project</span>
      </Link>
    </article>
  );
}
