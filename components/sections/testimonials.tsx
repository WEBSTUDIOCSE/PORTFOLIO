// Testimonials — social proof. Quote cards with name / role / company,
// the third-party validation recruiters look for. Data (currently
// sample/placeholder) lives in lib/testimonials.ts — replace with real
// LinkedIn recommendations there; this component needs no changes.
//
// Placed after Experience/Press in the homepage flow: the reader has
// seen the work and the history, now hears others vouch for it.

import Link from "next/link";
import { FEATURED_TESTIMONIALS } from "@/lib/testimonials";

export default function Testimonials() {
  if (FEATURED_TESTIMONIALS.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-2xl">
          <p className="font-hand text-2xl text-primary">kind words</p>
          <h2 className="mt-1 font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
            People I&rsquo;ve built with.
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_TESTIMONIALS.map((t, i) => (
            <figure
              key={`${t.name}-${i}`}
              className="flex flex-col rounded-lg border border-border bg-card p-6 text-card-foreground"
            >
              {/* Quotation mark */}
              <span
                aria-hidden
                className="font-display text-4xl leading-none text-primary/40"
              >
                &ldquo;
              </span>

              <blockquote className="mt-2 flex-1 text-base leading-relaxed text-foreground">
                {t.quote}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                {/* Monogram avatar */}
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-foreground/5 font-display text-sm font-medium text-foreground"
                >
                  {t.name.trim().charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {t.href ? (
                      <Link
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-primary"
                      >
                        {t.name}
                      </Link>
                    ) : (
                      t.name
                    )}
                  </p>
                  <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t.role}
                    {t.company ? ` · ${t.company}` : ""}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
