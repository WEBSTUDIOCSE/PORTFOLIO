"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme";
import ThemeToggle from "@/components/theme-toggle";

// Actual file numbers on disk — frame 60 is missing, so we skip it.
// 119 frames total: 1..59 and 61..120.
const FRAME_NUMBERS: number[] = Array.from({ length: 119 }, (_, i) =>
  i < 59 ? i + 1 : i + 2,
);
const FRAME_COUNT = FRAME_NUMBERS.length;

const framePath = (n: number) =>
  `/assets/saurabh/ezgif-frame-${String(n).padStart(3, "0")}.png`;

// Trapezoid window: 0 outside [a, d], ramps up over [a, b],
// holds at 1 over [b, c], ramps down over [c, d].
function band(p: number, a: number, b: number, c: number, d: number) {
  if (p <= a || p >= d) return 0;
  if (p < b) return (p - a) / (b - a);
  if (p > c) return 1 - (p - c) / (d - c);
  return 1;
}

export default function CharacterScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const beat3Ref = useRef<HTMLDivElement>(null);
  const beat4Ref = useRef<HTMLDivElement>(null);
  const beat5Ref = useRef<HTMLDivElement>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // next-themes returns undefined for resolvedTheme on first render
  // (SSR can't know). Gate any theme-dependent rendering on `mounted`.
  const { resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  // Preload every frame via the raw browser image cache so the
  // scroll-scrub never waits on the network.
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    for (const n of FRAME_NUMBERS) {
      const img = new window.Image();
      const onDone = () => {
        if (cancelled) return;
        count += 1;
        setLoadedCount(count);
        if (count === FRAME_COUNT) {
          setAllLoaded(true);
          setTimeout(() => setReveal(true), 80);
        }
      };
      img.onload = onDone;
      img.onerror = onDone;
      img.src = framePath(n);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // Imperative scroll handler — mutates DOM nodes via refs so the
  // 60Hz update path doesn't trigger React reconciliation.
  useEffect(() => {
    if (!allLoaded) return;
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;

      const idx = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1))),
      );
      if (imgRef.current) {
        const next = framePath(FRAME_NUMBERS[idx]);
        if (!imgRef.current.src.endsWith(next)) {
          imgRef.current.src = next;
        }
      }

      const o1 = band(p, 0, 0.02, 0.1, 0.15);
      const o2 = band(p, 0.15, 0.2, 0.3, 0.35);
      const o3 = band(p, 0.3, 0.37, 0.5, 0.55);
      const o4 = band(p, 0.5, 0.55, 0.7, 0.75);
      const o5 = band(p, 0.85, 0.92, 1.0, 1.01);

      if (beat1Ref.current) beat1Ref.current.style.opacity = String(o1);
      if (beat2Ref.current) beat2Ref.current.style.opacity = String(o2);
      if (beat3Ref.current) beat3Ref.current.style.opacity = String(o3);
      if (beat4Ref.current) beat4Ref.current.style.opacity = String(o4);
      if (beat5Ref.current) beat5Ref.current.style.opacity = String(o5);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [allLoaded]);

  const pct = Math.round((loadedCount / FRAME_COUNT) * 100);

  return (
    <section
      ref={sectionRef}
      style={{ height: "400vh" }}
      className="relative bg-background"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-background">
        {/* TL;DR overlay — always visible, including during the loading
            screen (z-40, above the z-30 overlay). This is the
            "recruiter sees you in <1s" layer: SSR-rendered plain text
            so a 7-second-scan visitor gets name + role + location
            even before the 119 frames preload. */}
        <header className="absolute left-6 top-6 z-40 max-w-[60%] sm:left-10 sm:top-8">
          <h1 className="font-display text-lg font-medium leading-tight tracking-tight text-foreground sm:text-xl">
            Saurabh Jadhav
          </h1>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
            Frontend &amp; AI Engineer · Mumbai
          </p>
        </header>

        {/* Mode toggle — pill above the character. Reads/writes global theme. */}
        <ThemeToggle className="absolute right-6 top-6 z-40 sm:right-10 sm:top-8" />

        {/* Loading overlay */}
        <div
          className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-background transition-opacity duration-700 ${
            reveal ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <p className="font-hand text-base text-primary">
            Preparing experience
          </p>
          <div className="h-0.5 w-48 overflow-hidden bg-foreground/10">
            <div
              className="h-full bg-primary transition-[width] duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs tabular-nums text-muted-foreground">{pct}%</p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={framePath(FRAME_NUMBERS[0])}
          alt=""
          aria-hidden="true"
          // mix-blend-mode in light mode hides the dark anti-aliased
          // fringe baked into PNGs exported from a black-bg source.
          // In dark mode the fringe is invisible against the bg, so we
          // keep normal blending to preserve skin tone fidelity. Before
          // mount, resolvedTheme is unknown — default to normal so the
          // SSR-rendered server HTML matches the first client render.
          style={mounted ? { mixBlendMode: isDark ? "normal" : "multiply" } : undefined}
          className={`h-full w-auto object-contain transition-opacity duration-[800ms] ${
            reveal ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Beat 1 — greeting eyebrow (0-15%). Devanagari in font-deva
            (Tiro), English greeting in font-greet (Dancing Script) —
            the Apple-hello flowing-cursive moment. */}
        <div
          ref={beat1Ref}
          className="absolute inset-x-0 top-[18%] z-20 flex justify-center px-6"
          style={{ opacity: 0 }}
        >
          <p className="flex items-baseline gap-2 text-primary sm:gap-3">
            <span className="font-deva text-base sm:text-lg">नमस्कार</span>
            <span className="text-muted-foreground">·</span>
            <span className="font-greet text-3xl sm:text-4xl">Hello</span>
          </p>
        </div>

        {/* Beat 2 — headline (15-35%) */}
        <div
          ref={beat2Ref}
          className="absolute inset-x-0 top-[20%] z-10 flex flex-col items-center gap-3 px-6 text-center"
          style={{ opacity: 0 }}
        >
          <h1 className="font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Frontend &amp; AI Engineer
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            3+ years · Mumbai
          </p>
        </div>

        {/* Beat 3 — orbital skill tags (30-55%) */}
        <div ref={beat3Ref} className="absolute inset-0 z-10" style={{ opacity: 0 }}>
          <SkillTag className="absolute left-[8%] top-[18%] sm:left-[12%]">
            Next.js 16
          </SkillTag>
          <SkillTag className="absolute right-[8%] top-[26%] sm:right-[12%]">
            React 19
          </SkillTag>
          <SkillTag className="absolute left-[6%] top-[58%] sm:left-[10%]">
            TypeScript
          </SkillTag>
          <SkillTag className="absolute right-[6%] top-[64%] sm:right-[10%]">
            Firebase
          </SkillTag>
          <SkillTag className="absolute bottom-[18%] left-[15%] sm:left-[20%]">
            Tailwind v4
          </SkillTag>
          <SkillTag className="absolute bottom-[14%] right-[15%] sm:right-[20%]">
            Multi-agent AI
          </SkillTag>
        </div>

        {/* Beat 4 — shipped (50-75%). Eyebrow uses font-hand for the
            personal "things I've shipped" voice. */}
        <div
          ref={beat4Ref}
          className="absolute inset-x-0 top-[24%] z-10 flex flex-col items-center gap-3 px-6 text-center"
          style={{ opacity: 0 }}
        >
          <p className="font-hand text-xl text-primary sm:text-2xl">
            the pitch
          </p>
          <h2 className="font-display text-2xl font-light tracking-tight text-foreground sm:text-3xl md:text-4xl">
            I build systems that replace headcount.
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
            One developer. Infinite leverage.
          </p>
        </div>

        {/* Beat 5 — final reveal (85-100%) */}
        <div
          ref={beat5Ref}
          className="absolute inset-x-0 top-[26%] z-10 flex flex-col items-center gap-8 px-6 text-center"
          style={{ opacity: 0 }}
        >
          <h2 className="font-display text-5xl font-light tracking-tight text-foreground sm:text-6xl md:text-7xl">
            I&apos;m Saurabh.
          </h2>
          <Link
            href="/journey"
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-6 py-3 text-sm text-primary backdrop-blur-md transition-colors hover:bg-primary/25 sm:text-base"
          >
            Take the Journey →
          </Link>
        </div>
      </div>
    </section>
  );
}

function SkillTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`rounded-full border border-border bg-foreground/5 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm sm:text-sm ${
        className ?? ""
      }`}
    >
      {children}
    </span>
  );
}
