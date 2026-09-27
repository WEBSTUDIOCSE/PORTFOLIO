"use client";

// About — short bio with the "why". Moved to AFTER Experience — "show
// the work and the history first, then the person" — recruiters who
// reached this point already like what they saw and now want context.
//
// Uses the editorial portrait prepared for the About section.
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
      className="theme-light-sand flex min-h-[100svh] items-center border-t border-border bg-background px-6 py-14 sm:px-10 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6 sm:mb-14">
          <div data-reveal>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              About / the builder behind the systems
            </p>
            <span aria-hidden data-fx-line className="mt-5 block h-px w-24 bg-primary/70" />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-right">
            Product thinking, engineering depth, and a bias toward shipping useful things.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-20">
          {/* Portrait */}
          <div
            className="relative flex flex-col items-center lg:items-start"
            data-reveal
          >
            <div className="relative w-full max-w-[24rem] rounded-[2rem] bg-[#1a1a1a] p-3 shadow-[0_24px_60px_rgba(26,26,26,0.18)] sm:p-4">
              {/* Dashed brass orbit — slow spin, pauses for
                  reduced-motion via the global guard. */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[1.35rem] bg-[#eaf3f4]">
                <Image
                  src="/assets/saurabh-about-card.png"
                  alt="Portrait of Saurabh Jadhav in a black hoodie"
                  fill
                  sizes="(min-width: 1024px) 28rem, (min-width: 640px) 20rem, calc(100vw - 3rem)"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101010]/80 via-[#101010]/10 to-transparent px-5 pb-5 pt-16 text-[#f4f1ea]">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#d9ad57]">
                    Saurabh Jadhav
                  </p>
                  <p className="mt-1 font-display text-xl leading-tight">
                    Full Stack + AI Engineer
                  </p>
                </div>
              </div>
            </div>
            <p className="font-sans italic mt-6 text-3xl text-primary">
              — Saurabh
            </p>
          </div>

          {/* Bio */}
          <div className="min-w-0">
            <div data-reveal>
              <p className="flex items-baseline gap-2 text-primary">
                <span className="font-deva text-base sm:text-lg">नमस्कार</span>
                <span className="text-muted-foreground">·</span>
                <span className="font-display text-3xl sm:text-4xl">About</span>
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-balance text-4xl font-light leading-[0.96] tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl">
                I build the systems behind the experience.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Full-stack products, AI workflows, and interfaces that make complex infrastructure feel calm and useful.
              </p>
            </div>

            <div
              ref={bioRef}
              className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-foreground sm:text-lg"
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
              className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 sm:grid-cols-3"
              data-reveal-stagger
            >
              <MetaItem label="Based" value="Mumbai · Thane" />
              <MetaItem label="Timezone" value="GMT +5:30" />
              <MetaItem label="Open to" value="Senior Full Stack + AI roles" />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3" data-reveal-stagger>
              <Signal label="Ships" value="Web + AI products" />
              <Signal label="Thinks in" value="Systems + surfaces" />
              <Signal label="Strength" value="End-to-end ownership" />
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

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4">
      <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-lg leading-tight text-foreground">
        {value}
      </p>
    </div>
  );
}
