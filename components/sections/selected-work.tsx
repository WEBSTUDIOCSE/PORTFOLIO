import Link from "next/link";
import {
  FEATURED_PROJECTS,
  getProjectLinks,
  type Project,
} from "@/lib/projects";

function splitTitle(title: string): [string, string | null] {
  const [name, ...rest] = title.split(" — ");
  return [name, rest.length > 0 ? rest.join(" — ") : null];
}

export default function SelectedWork() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="bg-[#f4ece2] px-6 py-24 text-[#1a1a1a] sm:px-10 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 grid gap-8 lg:mb-20 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div data-reveal>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#1a1a1a]/60">
              Selected work · {FEATURED_PROJECTS.length} systems
            </p>
            <span
              aria-hidden
              data-fx-line
              className="mt-6 block h-px w-24 bg-[#1a1a1a]/30"
            />
          </div>
          <div data-reveal>
            <h2
              id="work-heading"
              className="max-w-4xl font-display text-balance text-5xl font-light leading-[0.95] tracking-[-0.04em] text-[#1a1a1a] sm:text-6xl lg:text-8xl"
            >
              What I’ve built.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#1a1a1a]/70 sm:text-lg">
              Identity infrastructure, self-hosted agent systems, and AI
              products — designed, built, and shipped end to end by one
              engineer.
            </p>
          </div>
        </header>

        <div
          data-reveal-stagger
          className="grid gap-4 md:grid-cols-2"
        >
          {FEATURED_PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              wide={index === 0 || index === FEATURED_PROJECTS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  wide,
}: {
  project: Project;
  index: number;
  wide: boolean;
}) {
  const [name, descriptor] = splitTitle(project.title);
  const projectLinks = getProjectLinks(project);
  const lead = index === 0;
  const light = !lead;
  const surface = light
    ? "border-[#1a1a1a]/10 bg-[#fffaf1] text-[#1a1a1a]"
    : "border-[#1a1a1a] bg-[#1a1a1a] text-[#f4f1ea]";
  const muted = light ? "text-[#1a1a1a]/60" : "text-[#f4f1ea]/60";
  const subtleBorder = light
    ? "border-[#1a1a1a]/15"
    : "border-[#f4f1ea]/20";

  return (
    <article
      className={`group relative flex min-h-[28rem] flex-col overflow-hidden rounded-[1.75rem] border p-6 shadow-[0_18px_50px_rgba(26,26,26,0.06)] transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8 lg:p-10 ${surface} ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <div
        className={`flex flex-1 flex-col gap-10 ${
          wide ? "md:grid md:grid-cols-[1.15fr_0.85fr] md:gap-12" : ""
        }`}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <p className={`font-sans text-[10px] uppercase tracking-[0.3em] ${muted}`}>
              {project.number} · {project.year}
            </p>
            {project.status && (
              <span className={`rounded-full border px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.16em] ${subtleBorder} ${muted}`}>
                {project.status}
              </span>
            )}
          </div>

          <div className="mt-auto pt-16 md:pt-20">
            <p className={`mb-4 font-display text-3xl font-light ${muted}`}>
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="max-w-3xl font-display text-balance text-4xl font-light leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              {name}
            </h3>
            {descriptor && (
              <p className={`mt-3 font-display text-lg font-light sm:text-xl ${muted}`}>
                {descriptor}
              </p>
            )}
            <p className={`mt-5 max-w-2xl text-sm leading-relaxed sm:text-base ${muted}`}>
              {project.oneLiner}
            </p>
          </div>
        </div>

        <div className={`flex flex-col justify-between gap-8 ${wide ? "md:border-l md:pl-10" : ""} ${subtleBorder}`}>
          <div>
            {project.metric && (
              <p className="max-w-sm font-display text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                {project.metric}
              </p>
            )}
            {project.highlight && (
              <p className={`mt-4 font-sans text-sm italic ${muted}`}>
                {project.highlight}
              </p>
            )}
          </div>

          <div>
            <p className={`mb-3 font-sans text-[10px] uppercase tracking-[0.25em] ${muted}`}>
              Built with
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 7).map((stackItem) => (
                <span
                  key={stackItem}
                  className={`rounded-full border px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] ${subtleBorder} ${muted}`}
                >
                  {stackItem}
                </span>
              ))}
              {project.stack.length > 7 && (
                <span className={`rounded-full border border-dashed px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] ${subtleBorder} ${muted}`}>
                  +{project.stack.length - 7} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-5 ${subtleBorder}`}>
        <div className="relative z-10 flex flex-wrap gap-2">
          {projectLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full border px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.12em] transition-colors hover:border-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 ${subtleBorder} ${muted}`}
            >
              {link.label} <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
        <Link
          href={`/work/${project.slug}`}
          className="relative z-10 inline-flex items-center gap-2 rounded-full bg-[#d9ad57] px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Read case study <span aria-hidden>↗</span>
        </Link>
      </div>
    </article>
  );
}
