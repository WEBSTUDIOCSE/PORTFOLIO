// Press / "On LinkedIn" — text-only social-proof section.
//
// Why no iframes here:
//   LinkedIn's embed iframe is ~1 MB of JS + HTML and 1100-1700px
//   tall per post. Three of them on the homepage = blocked LCP,
//   broken mobile layout, third-party tracking cookies on first
//   paint. We instead link out to the posts and let /work/[slug]
//   detail pages embed the full iframe in context (deferred).
//
// Reads from lib/projects.ts — only renders projects that have
// linkedinPostUrn set. Order matches the PROJECTS array.

import Link from "next/link";
import { PROJECTS } from "@/lib/projects";

const POSTS = PROJECTS.filter((p) => p.linkedinPostUrn);

const linkedinPostUrl = (urn: string) =>
  `https://www.linkedin.com/feed/update/${urn}/`;

export default function Press() {
  if (POSTS.length === 0) return null;

  return (
    <section
      id="press"
      className="border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-2xl">
          <p className="font-hand text-2xl text-primary">on linkedin</p>
          <h2 className="mt-1 font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Posts that traveled.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Launch posts and project announcements. Numbers below are
            launch-day reach — click any to read on LinkedIn.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              href={linkedinPostUrl(p.linkedinPostUrn!)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-lg border border-border bg-card p-5 text-card-foreground transition-colors hover:border-primary/40"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {p.number}
              </p>
              <h3 className="mt-2 font-display text-lg font-light leading-snug tracking-tight text-foreground">
                {p.title.split(" — ")[0]} launch
              </h3>
              {p.linkedinImpressions && (
                <p className="mt-2 font-display text-xl font-medium tracking-tight text-primary">
                  {p.linkedinImpressions}
                </p>
              )}
              <p className="mt-auto flex items-center gap-1.5 pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground group-hover:text-primary">
                Read on LinkedIn
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Full post embeds live on the project detail pages (coming soon).
        </p>
      </div>
    </section>
  );
}
