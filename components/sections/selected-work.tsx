import Link from "next/link";
import { FEATURED_PROJECTS, type Project } from "@/lib/projects";

// Selected Work — editorial project index. Not cards: full-width
// hairline-ruled rows, the way a printed portfolio lists plates.
// Each row leads with an oversized Fraunces title (the project's
// short name), backed by the one-liner, stack chips, and the
// recruiter-bait metric on the right rail. The whole row is a door
// (stretched-link pattern) with a "Case study →" cue.
//
// Motion (via <ScrollFX/>): header fades up, rows stagger in, and
// on hover the title nudges right while the row picks up a subtle
// card-tone wash — quiet, editorial, no gimmicks.

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
      className="border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <header className="mb-14 max-w-2xl" data-reveal>
          <p className="font-hand text-2xl text-primary">selected work</p>
          <h2 className="mt-1 font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl">
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

        {/* Project index */}
        <div data-reveal-stagger>
          {FEATURED_PROJECTS.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
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
        className="absolute inset-0 z-10 rounded-lg"
        aria-label={`View project details for ${project.title}`}
      >
        <span className="sr-only">View project</span>
      </Link>
    </article>
  );
}
