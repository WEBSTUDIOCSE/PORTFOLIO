"use client";

// "What I Build" — sticky-stacking layer cards, ported 1:1 (layout,
// type scale, sticky + scroll-scrubbed depth/veil effect) from a
// reference agency site's updated AvatarSection.tsx ("WHAT WE BUILD",
// D:\DEVSTUDIO\WEBSTUDIO\DEVELOPMENT\DEVSTUDIOLABS). "WE" → "I" since
// this is a solo portfolio, not a studio. The reference alternates
// black/sand cards; this site keeps full-black backgrounds to the
// hero only, so `layer.dark` now alternates white/sand instead.
//
// Content is Saurabh's own — four things his real project history
// (lib/projects.ts, lib/experience.ts) backs up, not a generic
// service menu. The four looping 3D clips are copied from the
// reference's public/3d/ as-is: Firebase (his actual backend) sits on
// Cloud & Automation, an abstract character stands in for "agents" on
// Multi-Agent AI Systems. The Svelte logo and Android robot are
// decorative stock-style motion clips from the reference, not literal
// claims — Saurabh doesn't build Svelte or Android apps — placed per
// explicit direction rather than by tech-match. Swap them for bespoke
// text-to-3D props (Tripo/Meshy — see the /journey scenery workflow in
// CLAUDE.md) whenever there's time.
//
// GSAP is dynamic-imported inside useEffect, mirroring the safety
// discipline in components/scroll-fx.tsx (never in the critical
// bundle; bails before importing anything for
// prefers-reduced-motion), rather than the reference's static
// top-level `useGSAP` import — this site has a hard Lighthouse-driven
// rule that GSAP never sits in the main bundle.

import { useEffect, useRef } from "react";

const LAYERS = [
  {
    title: "Full-Stack Web Apps",
    desc: "Production Next.js & React apps, Firebase-backed and deployed on Vercel — built and shipped solo to real users.",
    stack: ["Next.js", "React", "Firebase"],
    videoBase: "/3d/3D_Svelte_logo_rotating_202607031937",
    dark: true,
  },
  {
    title: "Multi-Agent AI Systems",
    desc: "Autonomous agent pipelines — LLM routing, shared state, and self-running dev/content workflows across a dozen-plus specialised agents.",
    stack: ["Claude Code", "Gemini", "Firebase"],
    videoBase: "/3d/Orange_square_character_rotating_202607031937",
    dark: false,
  },
  {
    title: "AI-Generated Media",
    desc: "Image, video, and voice generation pipelines — Gemini, fal.ai, and Veo wired into consistent, production-grade creative workflows.",
    stack: ["Gemini", "fal.ai", "Veo"],
    videoBase: "/3d/3D_Android_robot_rotating_202607031937",
    dark: true,
  },
  {
    title: "Cloud & Automation",
    desc: "Self-hosted infrastructure on lean VPS budgets, GitHub Actions → Vercel CI/CD, and scheduled automation that runs with zero human in the loop.",
    stack: ["Docker", "GitHub Actions", "Vercel"],
    videoBase: "/3d/Firebase_flame_logo_rotating_202607031937",
    dark: false,
  },
] as const;

export default function WhatWeBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Play the looping 3D clips only while the section is on screen.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const videos = Array.from(section.querySelectorAll<HTMLVideoElement>("video"));
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        videos.forEach((v) => {
          if (entry.isIntersecting && !reduceMotion) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.1 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Depth effect: as the next layer slides over, the covered one
  // recedes and dims. The stacking itself is pure CSS `sticky`; this
  // only adds polish, so reduced-motion users get the plain stack.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

        cards.slice(0, -1).forEach((card, i) => {
          const veil = card.querySelector<HTMLDivElement>(".layer-veil");

          gsap.timeline({
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              end: "top 15%",
              scrub: true,
            },
            defaults: { ease: "none" },
          })
            .to(card, { scale: 0.94, yPercent: -2, transformOrigin: "center top" }, 0)
            .to(veil, { opacity: 0.45 }, 0);
        });
      }, sectionRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="build"
      aria-labelledby="build-heading"
      className="dotted-grid relative w-full bg-[#fde047] px-6 py-24 text-[#1a1a1a] sm:px-10 md:py-32"
    >
      {/* Header */}
      <div className="mx-auto mb-16 w-full max-w-6xl md:mb-24">
        <p
          data-reveal="fade"
          className="mb-4 text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/70 md:text-base"
        >
          Core Expertise
        </p>
        <h2
          id="build-heading"
          data-reveal
          className="text-5xl font-bold leading-none tracking-tighter md:text-7xl lg:text-[100px]"
        >
          WHAT I BUILD
        </h2>
        <p
          data-reveal
          className="mt-6 max-w-2xl text-lg font-medium text-[#1a1a1a]/70 md:text-2xl"
        >
          From interface to infrastructure — every product I ship is
          assembled from four layers.
        </p>
      </div>

      {/* Layer stack */}
      <div className="mx-auto w-full max-w-6xl">
        {LAYERS.map((layer, idx) => (
          <div
            key={layer.title}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            style={{ top: `calc(4.5rem + ${idx * 1.5}rem)` }}
            className={`sticky mb-8 overflow-hidden rounded-[1.75rem] shadow-2xl will-change-transform md:mb-12 md:rounded-[2.5rem] ${
              layer.dark
                ? "bg-white text-[#1a1a1a]"
                : "bg-[#f4ece2] text-[#1a1a1a]"
            }`}
          >
            {/* Dimming veil, driven by GSAP as the next layer covers this one */}
            <div
              aria-hidden
              className="layer-veil pointer-events-none absolute inset-0 z-20 bg-black opacity-0"
            />

            <div className="grid min-h-[60vh] md:min-h-[70vh] md:grid-cols-2">
              {/* Text */}
              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14">
                <h3 className="mb-5 text-4xl font-bold leading-[1.02] tracking-tight md:text-5xl lg:text-6xl">
                  {layer.title}
                </h3>
                <p className="mb-8 max-w-md text-base font-medium leading-snug opacity-75 md:text-lg">
                  {layer.desc}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {layer.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[#1a1a1a]/25 px-4 py-1.5 text-sm font-semibold text-[#1a1a1a]/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3D clip — WebM/VP9 first (smaller, same quality), MP4/H.264
                  fallback for Safari. Decorative only, aria-hidden. */}
              <div className="relative min-h-[240px] bg-black md:min-h-0">
                <video
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={`${layer.videoBase}.webm`} type="video/webm" />
                  <source src={`${layer.videoBase}.mp4`} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
