import type { Metadata } from "next";
import Link from "next/link";

// not-found.js convention per Next.js docs:
//   node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md
//
// Rendered when a route doesn't match or when notFound() is thrown.
// Returns HTTP 404 for non-streamed responses, which keeps Google
// from indexing broken URLs.
//
// Theme follows the rest of the site — Konkan railway journey
// metaphor. "Wrong stop" rather than the generic "Page not found."

export const metadata: Metadata = {
  title: "Wrong stop — Saurabh Jadhav",
  description: "This page isn't on the line. Let's get you back on the main route.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-background px-6 text-foreground sm:px-10">
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Eyebrow */}
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          404 · route not found
        </p>

        {/* Bilingual greeting in the same pattern as Hero / About */}
        <p className="mt-8 flex items-baseline justify-center gap-2 text-primary sm:gap-3">
          <span className="font-deva text-xl sm:text-2xl">मार्ग चुकला</span>
          <span className="text-muted-foreground">·</span>
          <span className="font-greet text-4xl sm:text-5xl">Wrong stop</span>
        </p>

        {/* Headline */}
        <h1 className="mt-6 font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl md:text-6xl">
          This page isn&rsquo;t on the line.
        </h1>

        {/* Body */}
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          Looks like the train doesn&rsquo;t stop here. Either the URL took
          a wrong turn or this page hasn&rsquo;t been built yet.
        </p>

        {/* Track-style decorative rule — two parallel lines like rails */}
        <div
          aria-hidden
          className="mx-auto mt-10 flex w-32 flex-col gap-[3px]"
        >
          <span className="block h-px w-full bg-primary/40" />
          <span className="block h-px w-full bg-primary/40" />
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <span aria-hidden>←</span>
            Back to the platform
          </Link>
          <Link
            href="/journey"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-card-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            Take the journey
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Signature */}
        <p className="mt-12 font-hand text-2xl text-primary">
          — Saurabh
        </p>
      </div>
    </main>
  );
}
