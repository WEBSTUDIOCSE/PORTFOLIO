"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme";
import ThemeToggle from "@/components/theme-toggle";

// Source frame numbers — frame 60 is missing on disk, so we skip it.
// 119 frames total: 1..59 and 61..120.
const ALL_FRAMES: number[] = Array.from({ length: 119 }, (_, i) =>
  i < 59 ? i + 1 : i + 2,
);

// Desktop gets every frame (smoothest); mobile every-other (60
// frames, half the bandwidth and decode cost — still smooth).
const DESKTOP_FRAMES = ALL_FRAMES;
const MOBILE_FRAMES = ALL_FRAMES.filter((_, i) => i % 2 === 0);

const framePath = (n: number) =>
  `/assets/saurabh/ezgif-frame-${String(n).padStart(3, "0")}.webp`;

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const beat3Ref = useRef<HTMLDivElement>(null);
  const beat4Ref = useRef<HTMLDivElement>(null);
  const beat5Ref = useRef<HTMLDivElement>(null);

  const [frames, setFrames] = useState<number[]>(DESKTOP_FRAMES);
  const framesRef = useRef<number[]>(DESKTOP_FRAMES);
  framesRef.current = frames;

  // HTMLImageElement[] indexed by position in `frames`. null until
  // loaded. We draw whatever's loaded; targets without a loaded image
  // fall back to the nearest lower-index loaded frame (no blank).
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  // Last index drawn — avoid redundant draws when scroll target ===
  // currently visible frame.
  const drawnIdxRef = useRef<number>(-1);
  // Cross-effect bridge: the preload effect calls this when a new
  // frame loads so the scroll handler can redraw if the user is
  // currently sitting on (or past) that index.
  const requestDrawRef = useRef<(() => void) | null>(null);

  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  // Mobile detection — swap to smaller frame list on phones.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setFrames(mq.matches ? MOBILE_FRAMES : DESKTOP_FRAMES);
    const onChange = (e: MediaQueryListEvent) => {
      setFrames(e.matches ? MOBILE_FRAMES : DESKTOP_FRAMES);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Preload frames into HTMLImageElement objects. Each load fires
  // a redraw request — if the user is sitting on a target that just
  // became available, it pops in cleanly.
  useEffect(() => {
    let cancelled = false;
    imagesRef.current = new Array(frames.length).fill(null);
    drawnIdxRef.current = -1;

    const loadOne = (i: number) => {
      if (cancelled || i >= frames.length) return;
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        imagesRef.current[i] = img;
        requestDrawRef.current?.();
      };
      img.src = framePath(frames[i]);
    };

    // Eager-load the first 8 (covers ~first viewport of scroll).
    const eagerCount = 8;
    for (let i = 0; i < Math.min(eagerCount, frames.length); i++) {
      loadOne(i);
    }

    // Defer rest to idle time so the rest of the page paints first.
    const loadRest = () => {
      for (let i = eagerCount; i < frames.length; i++) loadOne(i);
    };
    type IdleWindow = Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout?: number },
      ) => number;
    };
    const w = window as IdleWindow;
    if (w.requestIdleCallback) {
      w.requestIdleCallback(loadRest, { timeout: 2000 });
    } else {
      setTimeout(loadRest, 800);
    }

    return () => {
      cancelled = true;
    };
  }, [frames]);

  // Canvas rendering + scroll handler. drawImage is atomic — there
  // is no blank frame between the previous and next paint, which
  // eliminates the flicker that <img src=...> swapping exhibits.
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cap DPR at 2 — beyond that is bandwidth waste with no visible
    // difference at this image size.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const sizeCanvas = () => {
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      if (cssWidth === 0 || cssHeight === 0) return;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Resizing wipes the canvas — force a redraw at the new size.
      drawnIdxRef.current = -1;
    };

    // Object-contain math: scale the image to fit inside the canvas
    // while preserving aspect ratio, centered.
    const draw = (targetIdx: number) => {
      // Clamp down to nearest loaded — never call drawImage with null.
      let idx = targetIdx;
      while (idx > 0 && !imagesRef.current[idx]) idx--;
      if (idx === drawnIdxRef.current) return;
      const img = imagesRef.current[idx];
      if (!img) return;

      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.min(cssW / iw, cssH / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cssW - dw) / 2;
      const dy = (cssH - dh) / 2;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.drawImage(img, dx, dy, dw, dh);
      drawnIdxRef.current = idx;
    };

    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      return total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const p = computeProgress();
      const fr = framesRef.current;
      const target = Math.max(
        0,
        Math.min(fr.length - 1, Math.round(p * (fr.length - 1))),
      );
      draw(target);

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
    const onResize = () => {
      sizeCanvas();
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    // Bridge for the preload effect.
    requestDrawRef.current = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    sizeCanvas();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      requestDrawRef.current = null;
    };
  }, [frames]);

  return (
    <section
      ref={sectionRef}
      style={{ height: "400vh" }}
      className="relative bg-background"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-background">
        {/* TL;DR overlay — name + role + location, always visible. */}
        <header className="absolute left-4 top-5 z-40 max-w-[52%] sm:left-10 sm:top-8 sm:max-w-[60%]">
          <h1 className="font-display text-base font-medium leading-tight tracking-tight text-foreground sm:text-xl">
            Saurabh Jadhav
          </h1>
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px] sm:tracking-[0.2em]">
            <span className="sm:hidden">FE &amp; AI · Mumbai</span>
            <span className="hidden sm:inline">Frontend &amp; AI Engineer · Mumbai</span>
          </p>
        </header>

        {/* Mode toggle — top-right. */}
        <ThemeToggle className="absolute right-4 top-5 z-40 sm:right-10 sm:top-8" />

        {/* Canvas — replaces <img>. drawImage is atomic with the
            paint, so no blank "in-between" frame during rapid scroll
            swap. mix-blend-mode in light theme hides the dark
            anti-aliased fringe baked into the source frames. */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={
            mounted ? { mixBlendMode: isDark ? "normal" : "multiply" } : undefined
          }
          className="absolute inset-0 h-full w-full"
        />

        {/* Beat 1 — greeting eyebrow */}
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

        {/* Beat 2 — headline */}
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

        {/* Beat 3 — orbital skill tags */}
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

        {/* Beat 4 — the pitch */}
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

        {/* Beat 5 — final reveal */}
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
