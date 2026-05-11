import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS, type Project } from "@/lib/projects";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — Saurabh Jadhav`,
    description: project.oneLiner,
  };
}

export default async function WorkDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? PROJECTS[idx - 1] : null;
  const next = idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null;

  const linkedinUrl = project.linkedinPostUrn
    ? `https://www.linkedin.com/feed/update/${project.linkedinPostUrn}/`
    : null;

  return (
    <main className="bg-background text-foreground">
      {/* Back link */}
      <div className="mx-auto max-w-3xl px-6 pb-4 pt-28 sm:px-10 sm:pt-32">
        <Link
          href="/#work"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-primary"
        >
          ← All work
        </Link>
      </div>

      {/* Hero */}
      <header className="mx-auto max-w-3xl px-6 pb-16 sm:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
          {project.number} · {project.year}
        </p>
        <h1 className="mt-2 font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl md:text-6xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-foreground sm:text-xl">
          {project.oneLiner}
        </p>

        {/* Quick facts */}
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-6 sm:grid-cols-4">
          <Fact label="Role" value={project.role} />
          <Fact label="Year" value={project.year} />
          {project.metric && <Fact label="Outcome" value={project.metric} />}
          {project.href && (
            <Fact
              label="Live"
              value={
                <Link
                  href={project.href}
                  target={
                    project.href.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    project.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="text-primary hover:underline"
                >
                  Visit →
                </Link>
              }
            />
          )}
        </dl>

        {/* Stack chips */}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </header>

      {/* Problem · Approach · Outcome · Lessons */}
      <article className="mx-auto max-w-3xl space-y-16 px-6 pb-24 sm:px-10">
        {project.problem && (
          <Block kicker="The problem">
            <p className="text-lg leading-relaxed text-foreground sm:text-xl">
              {project.problem}
            </p>
          </Block>
        )}

        {project.approach && project.approach.length > 0 && (
          <Block kicker="Approach">
            <Bullets items={project.approach} />
          </Block>
        )}

        {project.outcome && project.outcome.length > 0 && (
          <Block kicker="Outcome">
            <Bullets items={project.outcome} />
          </Block>
        )}

        {project.lessons && project.lessons.length > 0 && (
          <Block kicker="Lessons learned">
            <Bullets items={project.lessons} />
          </Block>
        )}

        {/* LinkedIn post link (no iframe — performance) */}
        {linkedinUrl && (
          <Block kicker="On LinkedIn">
            <Link
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-2 rounded-lg border border-border bg-card px-5 py-4 text-card-foreground transition-colors hover:border-primary/40"
            >
              <span className="font-display text-lg">
                Read the launch post
              </span>
              {project.linkedinImpressions && (
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  · {project.linkedinImpressions}
                </span>
              )}
              <span aria-hidden className="text-primary">
                →
              </span>
            </Link>
          </Block>
        )}
      </article>

      {/* Prev / Next */}
      <nav className="border-t border-border bg-background px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-3xl items-stretch justify-between gap-4">
          {prev ? (
            <Link
              href={`/work/${prev.slug}`}
              className="group flex flex-col gap-1 text-left"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                ← Previous
              </span>
              <span className="font-display text-lg text-foreground group-hover:text-primary">
                {prev.title.split(" — ")[0]}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/work/${next.slug}`}
              className="group flex flex-col gap-1 text-right"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Next →
              </span>
              <span className="font-display text-lg text-foreground group-hover:text-primary">
                {next.title.split(" — ")[0]}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>
    </main>
  );
}

function Fact({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function Block({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="font-hand text-2xl text-primary">{kicker}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((b, i) => (
        <li
          key={i}
          className="flex gap-3 text-base leading-relaxed text-foreground sm:text-lg"
        >
          <span
            aria-hidden
            className="mt-2.5 inline-block h-1 w-1 shrink-0 rounded-full bg-primary"
          />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

// Type-export to keep generateStaticParams happy across Next versions.
export type { Project };
