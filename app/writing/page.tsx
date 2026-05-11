import type { Metadata } from "next";
import Link from "next/link";
import { PUBLISHED_POSTS } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing — Saurabh Jadhav",
  description:
    "Short technical posts on multi-agent AI systems, web performance, and the Next.js 16 migration.",
};

export default function WritingIndexPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-28 sm:px-10 sm:pt-32">
        {/* Header */}
        <header className="mb-16">
          <p className="font-hand text-2xl text-primary">writing</p>
          <h1 className="mt-1 font-display text-5xl font-light tracking-tight sm:text-6xl">
            Things I&rsquo;ve written.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Notes from shipping AI agents, scroll-driven UIs, and a few
            things I learned the slow way.
          </p>
        </header>

        {/* Posts list */}
        <div className="space-y-8">
          {PUBLISHED_POSTS.map((post) => (
            <article
              key={post.slug}
              className="border-b border-border pb-8 last:border-b-0"
            >
              <Link href={`/writing/${post.slug}`} className="group block">
                <div className="flex flex-wrap items-baseline gap-3">
                  <time
                    dateTime={post.date}
                    className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
                  >
                    {formatDate(post.date)}
                  </time>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    · {post.readTime}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-light leading-tight tracking-tight text-foreground group-hover:text-primary sm:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
