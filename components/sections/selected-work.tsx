import Link from "next/link";
import {
  FEATURED_PROJECTS,
  getProjectLinks,
  type Project,
} from "@/lib/projects";

// Selected Work — simple static project stack.
//
// Previously this was a two-column "hover a title, swap a live
// preview plate" pattern. It kept fighting back: remount-triggered
// animation flicker, a fixed-height plate that still drifted between
// projects, absolute-positioned content just to pin things down. All
// of that complexity existed to support ONE thing — the swap — so
// removing the swap removes the whole bug category. Every project is
// just always visible now, one full-detail row after another, same
// layout at every breakpoint. Height is whatever the content needs;
// nothing is forced to fill the screen, so nothing can misfit it.
//
// Section backdrop: brand-sand (#f4ece2), matching the reference
// site's own equivalent section ("FROM THE LAB" / ProjectsSection.tsx)
// — plain sand, no dotted texture. Every color here is a literal hex
// (not the theme's dark-tuned semantic tokens, which assume a
// near-black background and would have no contrast on light sand).

// Titles in lib/projects.ts read "Name — descriptor". Rows show the
// name huge and the descriptor as a serif deck below it.
function splitTitle(title: string): [string, string | null] {
  const [name, ...rest] = title.split(" — ");
  return [name, rest.length > 0 ? rest.join(" — ") : null];
}

export default function SelectedWork() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="bg-[#f4ece2] px-6 py-24 text-[#1a1a1a] sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <header className="mb-14 max-w-2xl" data-reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/70">
            selected work
          </p>
          <h2
            id="work-heading"
            className="mt-2 font-display text-balance text-4xl font-light tracking-tight text-[#1a1a1a] sm:text-5xl"
          >
            What I&rsquo;ve built.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#1a1a1a]/70 sm:text-base">
            Identity infrastructure, self-hosted agent systems, and AI
            products — designed, built, and shipped end to end by one
            engineer.
          </p>
          <span
            aria-hidden
            data-fx-line
            className="mt-6 block h-px w-24 bg-[#1a1a1a]/30"
          />
        </header>

        {/* Project stack — one full-detail row per project, always
            visible, same layout at every breakpoint. */}
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
  const projectLinks = getProjectLinks(project);

  return (
    <article className="group relative -mx-4 grid grid-cols-1 gap-x-8 gap-y-6 rounded-lg border-t border-[#1a1a1a]/15 px-4 py-10 transition-colors duration-300 hover:bg-white/50 sm:-mx-6 sm:px-6 md:grid-cols-12 md:py-14 last:border-b last:border-b-[#1a1a1a]/15">
      {/* Index + meta rail */}
      <div className="flex items-baseline gap-x-5 md:col-span-2 md:flex-col md:gap-y-3">
        <p
          aria-hidden
          className="font-display text-3xl font-light leading-none text-[#1a1a1a]/40 transition-colors duration-300 group-hover:text-[#1a1a1a] md:text-4xl"
        >
          {String(index + 1).padStart(2, "0")}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-4 md:flex-col md:gap-y-1.5">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#1a1a1a]/60">
            {project.number}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#1a1a1a]/60">
              {project.year}
            </p>
            {project.status && (
              <span className="rounded-full border border-[#1a1a1a]/20 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.16em] text-[#1a1a1a]/60">
                {project.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Title + story */}
      <div className="md:col-span-7">
        <h3 className="font-display text-balance text-4xl font-light leading-[1.05] tracking-tight text-[#1a1a1a] transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 sm:text-5xl">
          {name}
        </h3>
        {descriptor && (
          <p className="mt-2 font-display text-lg font-light text-[#1a1a1a]/60 sm:text-xl">
            {descriptor}
          </p>
        )}
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#1a1a1a]/70 sm:text-base">
          {project.oneLiner}
        </p>
        <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.18em] text-[#1a1a1a]/60">
          {project.role}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 6).map((s) => (
            <span
              key={s}
              className="rounded-full border border-[#1a1a1a]/20 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-[#1a1a1a]/70"
            >
              {s}
            </span>
          ))}
          {project.stack.length > 6 && (
            <span className="rounded-full border border-dashed border-[#1a1a1a]/20 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-[#1a1a1a]/70">
              +{project.stack.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Right rail — metric, annotation, cue */}
      <div className="flex flex-col gap-3 md:col-span-3 md:items-end md:text-right">
        <ProjectSignal slug={project.slug} number={project.number} />
        {projectLinks.length > 0 && (
          <div className="relative z-20 flex flex-wrap gap-1.5 md:justify-end">
            {projectLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#1a1a1a]/20 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-[#1a1a1a]/70 transition-colors hover:border-[#1a1a1a]/50 hover:text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4ece2]"
              >
                {link.label} <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        )}
        {project.metric && (
          project.href ? (
            // Real external link, above the stretched case-study
            // overlay (relative z-20 > the overlay's z-10) — clicking
            // the live-site metric goes to the actual site, not the
            // case study.
            <a
              href={project.href}
              target={project.href.startsWith("http") ? "_blank" : undefined}
              rel={
                project.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="relative z-20 rounded-sm font-display text-xl font-medium tracking-tight text-[#1a1a1a] underline decoration-[#1a1a1a]/30 underline-offset-4 transition-colors hover:text-[#1a1a1a]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4ece2] md:text-2xl"
            >
              {project.metric}
            </a>
          ) : (
            <p className="font-display text-xl font-medium tracking-tight text-[#1a1a1a] md:text-2xl">
              {project.metric}
            </p>
          )
        )}
        {project.highlight && (
          <p className="font-sans italic text-sm text-[#1a1a1a]/60">
            {project.highlight}
          </p>
        )}
        <p className="mt-auto flex items-center gap-1.5 pt-4 font-sans text-[11px] uppercase tracking-[0.18em] text-[#1a1a1a]/60 transition-colors group-hover:text-[#1a1a1a]">
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
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4ece2]"
        aria-label={`View project details for ${project.title}`}
      >
        <span className="sr-only">View project</span>
      </Link>
    </article>
  );
}

function ProjectSignal({
  slug,
  number,
}: {
  slug: string;
  number: string;
}) {
  const isKnownIn = slug === "knownin";
  const isCubicle = slug === "cubicle";
  const gradientId = `signal-gradient-${slug}`;

  return (
    <div
      aria-hidden
      className="relative hidden h-24 w-full max-w-[220px] overflow-hidden rounded-lg border border-[#1a1a1a]/15 bg-[#1a1a1a] text-[#f4ece2] transition-[border-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-[#1a1a1a]/35 md:flex"
    >
      <svg
        viewBox="0 0 220 96"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="220" y2="96">
            <stop stopColor={isKnownIn ? "#f3c969" : "#d7a5a5"} />
            <stop offset="1" stopColor={isCubicle ? "#7a1f2b" : "#8a6526"} />
          </linearGradient>
        </defs>

        {isKnownIn ? (
          <>
            <ellipse
              cx="110"
              cy="48"
              rx="73"
              ry="26"
              stroke={`url(#${gradientId})`}
              strokeOpacity="0.55"
            />
            <ellipse
              cx="110"
              cy="48"
              rx="40"
              ry="73"
              transform="rotate(62 110 48)"
              stroke={`url(#${gradientId})`}
              strokeOpacity="0.32"
            />
            <circle cx="110" cy="48" r="11" fill={`url(#${gradientId})`} />
            <circle cx="110" cy="48" r="4" fill="#1a1a1a" />
            <circle cx="45" cy="48" r="3" fill="#f4ece2" />
            <circle cx="175" cy="48" r="3" fill="#f4ece2" />
          </>
        ) : isCubicle ? (
          <>
            <path
              d="M39 65 82 31l47 31 49-29"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.5"
              strokeOpacity="0.75"
            />
            <path
              d="M82 31 84 76M129 62l2-42M178 33l-2 44"
              stroke="#f4ece2"
              strokeOpacity="0.18"
            />
            <circle cx="39" cy="65" r="7" fill="#f4ece2" fillOpacity="0.12" stroke="#f4ece2" strokeOpacity="0.5" />
            <circle cx="82" cy="31" r="7" fill={`url(#${gradientId})`} />
            <circle cx="129" cy="62" r="7" fill="#f4ece2" fillOpacity="0.12" stroke="#f4ece2" strokeOpacity="0.5" />
            <circle cx="178" cy="33" r="7" fill={`url(#${gradientId})`} />
            <circle cx="84" cy="76" r="4" fill="#f4ece2" fillOpacity="0.45" />
            <circle cx="131" cy="20" r="4" fill="#f4ece2" fillOpacity="0.45" />
            <circle cx="176" cy="77" r="4" fill="#f4ece2" fillOpacity="0.45" />
          </>
        ) : (
          <>
            <path
              d="M31 69h39V43h39v26h39V27h39"
              stroke={`url(#${gradientId})`}
              strokeWidth="2"
              strokeOpacity="0.8"
            />
            <rect x="31" y="26" width="39" height="17" rx="3" fill="#f4ece2" fillOpacity="0.1" />
            <rect x="109" y="26" width="39" height="17" rx="3" fill="#f4ece2" fillOpacity="0.1" />
            <rect x="148" y="69" width="39" height="17" rx="3" fill="#f4ece2" fillOpacity="0.1" />
          </>
        )}
      </svg>
      <span className="absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#f4ece2]/60">
        {number} / system signal
      </span>
    </div>
  );
}
