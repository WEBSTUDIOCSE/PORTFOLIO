import Link from "next/link";
import { FEATURED_PROJECTS, type Project } from "@/lib/projects";

// Selected Work — the section recruiters spend the most time on.
// Per research, 4-6 projects in this format gets the highest
// callback rate. Each card surfaces:
//   - number (P-001) for scannability
//   - title in serif display
//   - one-liner with role + year
//   - tech stack chips
//   - METRIC callout (the recruiter-bait)
//   - optional handwritten annotation
//
// First card is featured/large so the layer-cake scan lands there.

export default function SelectedWork() {
  const [hero, ...rest] = FEATURED_PROJECTS;

  return (
    <section
      id="work"
      className="border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <header className="mb-12 max-w-2xl">
          <p className="font-hand text-2xl text-primary">selected work</p>
          <h2 className="mt-1 font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            What I&rsquo;ve built.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Six projects spanning founding-engineer SaaS work, mobile,
            realtime systems, edge ML, open source, and personal craft.
            Each links out to a deeper write-up or live demo.
          </p>
        </header>

        {/* Featured project (large) */}
        {hero && <FeaturedCard project={hero} />}

        {/* Remaining projects (grid) */}
        {rest.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {rest.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <CardShell project={project} variant="featured">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <ProjectNumber project={project} />
          <h3 className="mt-3 font-display text-3xl font-light leading-tight tracking-tight text-foreground sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-foreground">
            {project.oneLiner}
          </p>
          <ProjectMeta project={project} className="mt-4" />
        </div>
        <div className="flex flex-col gap-4 md:col-span-2 md:items-end md:justify-end md:text-right">
          {project.metric && <Metric value={project.metric} large />}
          <StackChips stack={project.stack} alignEnd />
          {project.highlight && (
            <p className="font-hand-note text-base text-muted-foreground">
              {project.highlight}
            </p>
          )}
        </div>
      </div>
    </CardShell>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <CardShell project={project}>
      <ProjectNumber project={project} />
      <h3 className="mt-2 font-display text-xl font-light leading-tight tracking-tight text-foreground sm:text-2xl">
        {project.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        {project.oneLiner}
      </p>
      <ProjectMeta project={project} className="mt-3" />
      {project.metric && (
        <div className="mt-4">
          <Metric value={project.metric} />
        </div>
      )}
      <StackChips stack={project.stack} className="mt-4" />
      {project.highlight && (
        <p className="font-hand-note mt-3 text-sm text-muted-foreground">
          {project.highlight}
        </p>
      )}
    </CardShell>
  );
}

function CardShell({
  project,
  children,
  variant = "default",
}: {
  project: Project;
  children: React.ReactNode;
  variant?: "default" | "featured";
}) {
  const padding =
    variant === "featured" ? "p-6 sm:p-10" : "p-5 sm:p-6";
  const cls = `group relative block rounded-lg border border-border bg-card text-card-foreground transition-colors hover:border-primary/40 ${padding}`;

  // Card uses the clickable block pattern: the actual <a> tag is inside 
  // the title, but a pseudo-element stretches it to cover the entire card.
  // This prevents screen readers from reading the entire card contents as a single link.
  return (
    <div className={cls}>
      {children}
      <Link 
        href={`/work/${project.slug}`} 
        className="absolute inset-0 z-10 rounded-lg"
        aria-label={`View project details for ${project.title}`}
      >
        <span className="sr-only">View project</span>
      </Link>
    </div>
  );
}

function ProjectNumber({ project }: { project: Project }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
      {project.number}
    </p>
  );
}

function ProjectMeta({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground ${className}`}
    >
      {project.role} · {project.year}
    </p>
  );
}

function Metric({ value, large = false }: { value: string; large?: boolean }) {
  return (
    <p
      className={
        large
          ? "font-display text-2xl font-medium tracking-tight text-primary sm:text-3xl"
          : "font-display text-lg font-medium tracking-tight text-primary"
      }
    >
      {value}
    </p>
  );
}

function StackChips({
  stack,
  className = "",
  alignEnd = false,
}: {
  stack: string[];
  className?: string;
  alignEnd?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap gap-1.5 ${
        alignEnd ? "md:justify-end" : ""
      } ${className}`}
    >
      {stack.map((s) => (
        <span
          key={s}
          className="rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
