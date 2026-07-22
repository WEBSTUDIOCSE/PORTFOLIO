import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS, PUBLISHED_POSTS } from "@/lib/writing";
import { PERSON_ID, SITE_URL, jsonLd } from "@/lib/seo";

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

  const title = `${post.title} — Saurabh Jadhav`;
  const url = `${SITE_URL}/writing/${slug}`;
  return {
    title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: post.excerpt,
      siteName: "Saurabh Jadhav",
      locale: "en_IN",
      publishedTime: post.date,
      authors: ["Saurabh Jadhav"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.excerpt,
      creator: "@saurabhjadhav",
    },
    // ISO date string → makes Google's freshness signal pick this
    // post up as a dated article instead of an evergreen page.
    other: {
      "article:published_time": post.date,
    },
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

  const url = `${SITE_URL}/writing/${post.slug}`;
  const image = `${url}/opengraph-image`;
  // BlogPosting is the most specific schema for short technical
  // posts. `author` references the root Person via @id so Google
  // doesn't create a duplicate Person node for every blog page.
  // `wordCount` is approximate — joining body paragraphs and
  // splitting on whitespace is enough for the freshness signal
  // Google uses for ranking long-form content.
  const wordCount = post.body.join(" ").split(/\s+/).filter(Boolean).length;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.excerpt,
    url,
    image,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    keywords: post.tags.join(", "),
    inLanguage: "en-IN",
    wordCount,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Writing",
        item: `${SITE_URL}/writing`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <main className="theme-light-sand bg-background text-foreground">
      {/* Page-scoped JSON-LD — BlogPosting + BreadcrumbList. Both
          reference the root Person node via @id rather than
          duplicating identity fields. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
      />

      {/* Back link */}
      <div className="mx-auto max-w-2xl px-6 pb-4 pt-28 sm:px-10 sm:pt-32">
        <Link
          href="/writing"
          className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-primary"
        >
          ← All writing
        </Link>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-2xl px-6 pb-12 sm:px-10">
        <div className="flex flex-wrap items-baseline gap-3">
          <time
            dateTime={post.date}
            className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
          >
            {formatDate(post.date)}
          </time>
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
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
              className="rounded-full border border-border bg-muted px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
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
        <p className="mt-12 font-sans italic text-2xl text-primary">— Saurabh</p>
      </article>

      {/* Prev / Next */}
      <nav className="border-t border-border bg-background px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-2xl items-stretch justify-between gap-4">
          {prev ? (
            <Link
              href={`/writing/${prev.slug}`}
              className="group flex flex-col gap-1 text-left"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
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
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
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
