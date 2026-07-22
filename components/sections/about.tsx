"use client";

// About — short bio with the "why". Moved to AFTER Experience — "show
// the work and the history first, then the person" — recruiters who
// reached this point already like what they saw and now want context.
//
// Uses an existing hero WebP frame as a placeholder portrait. Swap
// to a proper headshot later by replacing the src path.
//
// Bio paragraphs get a scroll-scrubbed "reading" reveal: each word
// starts dim and brightens to full opacity as the section scrolls
// through view, staggered so it reads like a wave following the
// reader down the page rather than a single fade-in. This is on top
// of (not instead of) the one-shot data-reveal-stagger entrance below
// — the paragraphs fade+slide up once as they enter view, then
// continue illuminating word-by-word as the user keeps scrolling.
//
// GSAP is dynamic-imported inside useEffect, mirroring the safety
// discipline in components/scroll-fx.tsx (never in the critical
// bundle; bails before importing anything for prefers-reduced-motion)
// rather than going through that shared component — splitting text
// into per-word spans and scrubbing their opacity is bespoke enough
// that it doesn't fit the shared data-attribute vocabulary there.

import Image from "next/image";
import { useEffect, useRef } from "react";

const BIO_PARAGRAPHS = [
  "Three years shipping production products end to end at Livlong 365, where I led the migration of livlong.com to Next.js 16 (~45% LCP improvement) and shipped 60+ reusable components across the insurance and wellness verticals.",
  "Outside work, the systems I build go further. OpenClaw is a 15-agent autonomous operations pipeline running on my VPS — zero human intervention after task input. CinematicTale is a live AI storytelling SaaS with face-swap and Razorpay subscriptions. Elite Mindset Forge writes, illustrates, and auto-publishes multilingual content across Instagram and Facebook, all of it AI-driven.",
  "I build systems that replace headcount. One developer. Infinite leverage.",
];

// Splits a sentence into word spans (for the reveal) interleaved with
// plain whitespace text nodes (so word-spacing stays exactly as
// written, no extra gaps introduced).
function splitWords(text: string) {
  return text.split(/(\s+)/).map((chunk, i) =>
    chunk.trim() === "" ? (
      chunk
    ) : (
      <span key={i} className="reveal-word">
        {chunk}
      </span>
    ),
  );
}

export default function About() {
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !bioRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const words = gsap.utils.toArray<HTMLElement>(".reveal-word", bioRef.current);
        gsap.set(words, { opacity: 0.28 });
        gsap.to(words, {
          opacity: 1,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: bioRef.current,
            start: "top 75%",
            end: "bottom 45%",
            scrub: 0.5,
          },
        });
      }, bioRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="about"
      className="theme-light-sand border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-16">
          {/* Portrait */}
          <div
            className="flex flex-col items-center md:col-span-2 md:items-start"
            data-reveal
          >
            <div className="relative">
              {/* Dashed brass orbit — slow spin, pauses for
                  reduced-motion via the global guard. */}
              <span
                aria-hidden
                className="fx-portrait-ring absolute -inset-3 rounded-full border border-dashed border-primary/40"
              />
              <div className="relative h-56 w-56 overflow-hidden rounded-full border border-border bg-muted sm:h-64 sm:w-64">
                <Image
                  src="/assets/saurabh/ezgif-frame-120.webp"
                  alt="Saurabh Jadhav"
                  fill
                  // `object-cover` crops the 16:9 source into a circle, so the
                  // effective render width is ~1.8× the box — declare a larger
                  // `sizes` (+ high quality) or it upscales and looks blurry.
                  sizes="512px"
                  className="object-cover"
                  style={{ objectPosition: "center 18%" }}
                />
              </div>
            </div>
            <p className="font-sans italic mt-6 text-3xl text-primary">
              — Saurabh
            </p>
          </div>

          {/* Bio */}
          <div className="md:col-span-3">
            <div data-reveal>
              <p className="flex items-baseline gap-2 text-primary">
                <span className="font-deva text-base sm:text-lg">नमस्कार</span>
                <span className="text-muted-foreground">·</span>
                <span className="font-display text-3xl sm:text-4xl">About</span>
              </p>
              <h2 className="mt-2 font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
                I&rsquo;m a Full Stack &amp; AI Engineer.
              </h2>
            </div>

            <div
              ref={bioRef}
              className="mt-6 space-y-4 text-base leading-relaxed text-foreground sm:text-lg"
              data-reveal-stagger
            >
              <p>{splitWords(BIO_PARAGRAPHS[0])}</p>
              <p>{splitWords(BIO_PARAGRAPHS[1])}</p>
              <p className="font-display text-lg text-primary sm:text-xl md:text-2xl">
                {splitWords(BIO_PARAGRAPHS[2])}
              </p>
            </div>

            {/* Meta row */}
            <div
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-6 sm:grid-cols-3"
              data-reveal-stagger
            >
              <MetaItem label="Based" value="Mumbai · Thane" />
              <MetaItem label="Timezone" value="GMT +5:30" />
              <MetaItem label="Open to" value="Senior Full Stack + AI roles" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}
