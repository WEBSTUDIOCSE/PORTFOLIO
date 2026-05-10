"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const TOTAL_FRAMES = 120;
const framePath = (n: number) =>
  `/assets/saurabh/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;

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

  // Preload every frame via the raw browser image cache so the
  // scroll-scrub never waits on the network. Next.js Image would
  // re-optimise each one — wrong tool for this job.
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      const onDone = () => {
        if (cancelled) return;
        count += 1;
        setLoadedCount(count);
        if (count === TOTAL_FRAMES) {
          setAllLoaded(true);
          setTimeout(() => setReveal(true), 80);
        }
      };
      img.onload = onDone;
      img.onerror = onDone;
      img.src = framePath(i);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // Imperative scroll handler — mutates DOM nodes via refs so the
  // 60Hz update path doesn't trigger React reconciliation. Keeps
  // the scrub buttery on the lower-end machines.
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

      const frame = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.round(p * (TOTAL_FRAMES - 1)) + 1),
      );
      if (imgRef.current) {
        const next = framePath(frame);
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

  const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <section
      ref={sectionRef}
      style={{ height: "400vh" }}
      className="relative bg-black"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        {/* Loading overlay */}
        <div
          className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black transition-opacity duration-700 ${
            reveal ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-200/70">
            Preparing experience
          </p>
          <div className="h-0.5 w-48 overflow-hidden bg-white/10">
            <div
              className="h-full bg-amber-300/70 transition-[width] duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs tabular-nums text-white/40">{pct}%</p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={framePath(1)}
          alt=""
          aria-hidden="true"
          className={`h-full w-auto object-contain transition-opacity duration-[800ms] ${
            reveal ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Beat 1 — eyebrow hello (0-15%) */}
        <div
          ref={beat1Ref}
          className="absolute inset-x-0 top-[14%] z-10 flex justify-center px-6"
          style={{ opacity: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200/70 sm:text-sm">
            नमस्कार · Hello
          </p>
        </div>

        {/* Beat 2 — headline (15-35%) */}
        <div
          ref={beat2Ref}
          className="absolute inset-x-0 top-[20%] z-10 flex flex-col items-center gap-3 px-6 text-center"
          style={{ opacity: 0 }}
        >
          <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl">
            Frontend Developer
          </h1>
          <p className="text-base text-white/60 sm:text-lg">
            Based in Maharashtra
          </p>
        </div>

        {/* Beat 3 — orbital skill tags (30-55%) */}
        <div ref={beat3Ref} className="absolute inset-0 z-10" style={{ opacity: 0 }}>
          <SkillTag className="absolute left-[8%] top-[18%] sm:left-[12%]">
            React
          </SkillTag>
          <SkillTag className="absolute right-[8%] top-[26%] sm:right-[12%]">
            Next.js
          </SkillTag>
          <SkillTag className="absolute left-[6%] top-[58%] sm:left-[10%]">
            TypeScript
          </SkillTag>
          <SkillTag className="absolute right-[6%] top-[64%] sm:right-[10%]">
            Tailwind
          </SkillTag>
          <SkillTag className="absolute bottom-[18%] left-[15%] sm:left-[20%]">
            JavaScript
          </SkillTag>
          <SkillTag className="absolute bottom-[14%] right-[15%] sm:right-[20%]">
            Framer Motion
          </SkillTag>
        </div>

        {/* Beat 4 — shipped (50-75%) */}
        <div
          ref={beat4Ref}
          className="absolute inset-x-0 top-[24%] z-10 flex flex-col items-center gap-3 px-6 text-center"
          style={{ opacity: 0 }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-200/70 sm:text-xs">
            Things I&apos;ve shipped
          </p>
          <h2 className="text-2xl font-light tracking-tight text-white sm:text-3xl md:text-4xl">
            12 projects · 1k+ downloads · 4 years
          </h2>
        </div>

        {/* Beat 5 — final reveal (85-100%) */}
        <div
          ref={beat5Ref}
          className="absolute inset-x-0 top-[26%] z-10 flex flex-col items-center gap-8 px-6 text-center"
          style={{ opacity: 0 }}
        >
          <h2 className="text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl">
            I&apos;m Saurabh.
          </h2>
          <Link
            href="/journey"
            className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-500/20 px-6 py-3 text-sm text-amber-100 backdrop-blur-md transition-colors hover:bg-amber-500/30 sm:text-base"
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
      className={`rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm sm:text-sm ${
        className ?? ""
      }`}
    >
      {children}
    </span>
  );
}
