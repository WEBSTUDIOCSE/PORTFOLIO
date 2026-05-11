import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS, PUBLISHED_POSTS } from "@/lib/writing";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PUBLISHED_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Saurabh Jadhav`,
    description: post.excerpt,
  };
}

export default async function WritingDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const idx = PUBLISHED_POSTS.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? PUBLISHED_POSTS[idx - 1] : null;
  const next =
    idx < PUBLISHED_POSTS.length - 1 ? PUBLISHED_POSTS[idx + 1] : null;

  return (
    <main className="bg-background text-foreground">
      {/* Back link */}
      <div className="mx-auto max-w-2xl px-6 pb-4 pt-28 sm:px-10 sm:pt-32">
        <Link
          href="/writing"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-primary"
        >
          ← All writing
        </Link>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-2xl px-6 pb-12 sm:px-10">
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
        <h1 className="mt-3 font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {post.excerpt}
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      {/* Body — paragraphs and headings */}
      <article className="mx-auto max-w-2xl px-6 pb-24 sm:px-10">
        <div className="space-y-5 text-base leading-relaxed text-foreground sm:text-lg sm:leading-relaxed">
          {post.body.map((line, i) =>
            line.startsWith("## ") ? (
              <h2
                key={i}
                className="mt-10 font-display text-2xl font-light tracking-tight text-foreground sm:text-3xl"
              >
                {line.slice(3)}
              </h2>
            ) : (
              <p key={i}>{line}</p>
            ),
          )}
        </div>

        {/* Sign-off */}
        <p className="mt-12 font-hand text-2xl text-primary">— Saurabh</p>
      </article>

      {/* Prev / Next */}
      <nav className="border-t border-border bg-background px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-2xl items-stretch justify-between gap-4">
          {prev ? (
            <Link
              href={`/writing/${prev.slug}`}
              className="group flex flex-col gap-1 text-left"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                ← Newer
              </span>
              <span className="font-display text-lg text-foreground group-hover:text-primary">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/writing/${next.slug}`}
              className="group flex flex-col gap-1 text-right"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Older →
              </span>
              <span className="font-display text-lg text-foreground group-hover:text-primary">
                {next.title}
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

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
