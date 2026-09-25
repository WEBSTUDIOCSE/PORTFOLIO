"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// The hero uses the 105 sequential frames from the transparent Flow export.
const FRAME_COUNT = 105;
const ALL_FRAMES: number[] = Array.from({ length: FRAME_COUNT }, (_, i) => i + 1);

// Desktop gets every scroll slot; mobile uses every other slot to halve
// bandwidth and decode cost.
const DESKTOP_FRAMES = ALL_FRAMES;
const MOBILE_FRAMES = ALL_FRAMES.filter((_, i) => i % 2 === 0);

// Adaptive quality serving — two folders of the same 105 frames:
//
//   /assets/saurabh-rotation-transparent/       1920×1080 transparent frames
//   /assets/saurabh-rotation-transparent-lite/   960×540 mobile frames
//
// Default is the hi-res set. Lite kicks in when ANY of:
//   1. `navigator.connection.saveData === true`   (user opted into Data Saver)
//   2. `effectiveType` is "slow-2g", "2g", or "3g"
//   3. Viewport width < 640px                     (mobile — small screen
//      can't resolve hi-res pixels anyway, so the perceptual difference
//      is zero while the bandwidth difference is 3-4×)
//
// Network Information API is well-supported on Chromium browsers
// (the majority of mobile traffic in India). Safari doesn't expose
// `navigator.connection` — those users default to the hi-res set,
// which on iOS is generally fine because Apple's networking is
// optimized and most users are on wifi or 4G+ LTE.
type FrameDir =
  | "saurabh-rotation-transparent"
  | "saurabh-rotation-transparent-lite";

const HI = "saurabh-rotation-transparent" as const;
const LITE = "saurabh-rotation-transparent-lite" as const;

type NetworkConn = {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  saveData?: boolean;
};

function pickFrameDir(): FrameDir {
  if (typeof window === "undefined") return HI;
  if (window.matchMedia("(max-width: 640px)").matches) return LITE;
  const conn = (navigator as Navigator & { connection?: NetworkConn })
    .connection;
  if (!conn) return HI;
  if (conn.saveData) return LITE;
  if (conn.effectiveType && conn.effectiveType !== "4g") return LITE;
  return HI;
}

function framePath(dir: FrameDir, n: number) {
  return `/assets/${dir}/ezgif-frame-${String(n).padStart(3, "0")}.webp`;
}

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
  // Beat 5 sub-parts so we can morph "I'm Saurabh." into the navbar:
  // the "I'm " prefix and "." suffix fade out, leaving "Saurabh"
  // intact while the whole container shrinks + slides up to where
  // the navbar's brand text sits.
  const beat5PrefixRef = useRef<HTMLSpanElement>(null);
  const beat5SuffixRef = useRef<HTMLSpanElement>(null);
  const beat5CtaRef = useRef<HTMLAnchorElement>(null);
  // TL;DR overlay (top-left name + role). Faded out near the end of
  // the hero scroll so it doesn't overlap with the SiteNav fading in.
  const tldrRef = useRef<HTMLElement>(null);

  const [frames, setFrames] = useState<number[]>(DESKTOP_FRAMES);
  const framesRef = useRef<number[]>(DESKTOP_FRAMES);
  useEffect(() => {
    framesRef.current = frames;
  }, [frames]);

  // Hi-res default; flipped to lite on mount if the visitor's network
  // / device profile asks for it. We start at HI because that's the
  // SSR-safe default — flickering one extra HTTP request on mount is
  // cheaper than rendering a low-res canvas momentarily.
  const [frameDir, setFrameDir] = useState<FrameDir>(HI);

  // HTMLImageElement[] indexed by position in `frames`. null until
  // loaded. We draw whatever's loaded; targets without a loaded image
  // fall back to the nearest lower-index loaded frame (no blank).
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  // Last index drawn — avoid redundant draws when scroll target ===
  // currently visible frame.
  // Keep the fractional scroll position so adjacent frames can be blended.
  const drawnPositionRef = useRef<number>(-1);
  // Cross-effect bridge: the preload effect calls this when a new
  // frame loads so the scroll handler can redraw if the user is
  // currently sitting on (or past) that index.
  const requestDrawRef = useRef<(() => void) | null>(null);
  // The scroll effect asks the preload effect for a small neighborhood
  // around the frame the visitor is moving toward. Keeping this as a ref
  // avoids restarting the scroll listener every time a frame arrives.
  const loadFrameRef = useRef<(targetIdx: number) => void>(() => undefined);

  // On mount, decide:
  //   1. Frame count   (mobile = every-other, desktop = all)
  //   2. Source folder (lite vs hi-res — see pickFrameDir comment)
  // Both can flip if the viewport resizes across the 640px boundary.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => {
      setFrames(mq.matches ? MOBILE_FRAMES : DESKTOP_FRAMES);
      setFrameDir(pickFrameDir());
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Preload frames into HTMLImageElement objects. Each load fires
  // a redraw request — if the user is sitting on a target that just
  // became available, it pops in cleanly.
  //
  // Only the first few frames are loaded on entry. The rest are fetched
  // around the current scroll target on demand. Loading all 119 frames
  // during idle made the homepage compete with the rest of the page for
  // bandwidth and image decode time, even when the visitor never scrolled.
  useEffect(() => {
    let cancelled = false;
    imagesRef.current = new Array(frames.length).fill(null);
    drawnPositionRef.current = -1;
    const pending = new Set<number>();

    const loadOne = (i: number) => {
      if (
        cancelled ||
        i < 0 ||
        i >= frames.length ||
        imagesRef.current[i] ||
        pending.has(i)
      ) {
        return;
      }
      pending.add(i);
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        pending.delete(i);
        if (cancelled) return;
        imagesRef.current[i] = img;
        requestDrawRef.current?.();
      };
      img.onerror = () => pending.delete(i);
      img.src = framePath(frameDir, frames[i]);
    };

    loadFrameRef.current = (targetIdx: number) => {
      // A wider decode window prevents a fast gesture from outrunning the
      // image requests and displaying the same fallback pose.
      const center = Math.round(targetIdx);
      const radius = 12;
      const start = Math.max(0, center - radius);
      const end = Math.min(frames.length - 1, center + radius);
      for (let i = start; i <= end; i++) loadOne(i);
    };

    // Eager-load the first 8 (covers ~first viewport of scroll).
    const eagerCount = 12;
    for (let i = 0; i < Math.min(eagerCount, frames.length); i++) {
      loadOne(i);
    }

    return () => {
      cancelled = true;
      loadFrameRef.current = () => undefined;
    };
  }, [frames, frameDir]);

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
      drawnPositionRef.current = -1;
    };

    // Fit math:
    // - Desktop (≥640px): object-contain, vertically centered — the
    //   character sits as a "tabletop" portrait with breathing room
    //   around it. Matches the considered/editorial feel of the rest
    //   of the page.
    // - Mobile (<640px): contain × 1.5, bottom-anchored. Tall narrow
    //   viewports are width-constrained by `baseScale`, which leaves a
    //   large empty vertical band above AND below the figure if
    //   centered — the figure reads as floating in a black void.
    //   Anchoring to the bottom (with a small margin so it isn't
    //   flush against the edge) grounds the portrait instead.
    const draw = (targetPosition: number) => {
      // Clamp down to nearest loaded — never call drawImage with null.
      const fromIdx = Math.floor(targetPosition);
      const toIdx = Math.min(framesRef.current.length - 1, fromIdx + 1);
      const findLoaded = (start: number, direction: -1 | 1) => {
        let idx = start;
        while (idx >= 0 && idx < imagesRef.current.length) {
          if (imagesRef.current[idx]) return idx;
          idx += direction;
        }
        return -1;
      };
      const fromLoadedIdx = findLoaded(fromIdx, -1);
      if (fromLoadedIdx < 0) return;
      const nextLoadedIdx = imagesRef.current[toIdx]
        ? toIdx
        : findLoaded(toIdx, 1);
      const toLoadedIdx = nextLoadedIdx < 0 ? fromLoadedIdx : nextLoadedIdx;
      const fromImg = imagesRef.current[fromLoadedIdx];
      const toImg = imagesRef.current[toLoadedIdx];
      if (!fromImg || !toImg) return;
      if (
        targetPosition === drawnPositionRef.current &&
        fromLoadedIdx === fromIdx &&
        toLoadedIdx === toIdx
      ) {
        return;
      }

      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const iw = fromImg.naturalWidth;
      const ih = fromImg.naturalHeight;
      const isMobile = cssW < 640;
      const baseScale = Math.min(cssW / iw, cssH / ih);
      const scale = isMobile ? baseScale * 1.5 : baseScale;
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cssW - dw) / 2;
      const dy = isMobile ? cssH - dh - cssH * 0.06 : (cssH - dh) / 2;

      const blend = targetPosition - fromIdx;
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.globalAlpha = 1 - (fromLoadedIdx === toLoadedIdx ? 0 : blend);
      ctx.drawImage(fromImg, dx, dy, dw, dh);
      if (toLoadedIdx !== fromLoadedIdx && blend > 0) {
        ctx.globalAlpha = blend;
        ctx.drawImage(toImg, dx, dy, dw, dh);
      }
      ctx.globalAlpha = 1;
      drawnPositionRef.current = targetPosition;
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
      const targetPosition = Math.max(
        0,
        Math.min(fr.length - 1, p * (fr.length - 1)),
      );
      loadFrameRef.current(Math.round(targetPosition));
      draw(targetPosition);

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

      // TL;DR fades OUT as scroll progresses past 75%, fully gone
      // by 88%. The SiteNav fades IN at ~80% (320vh of 400vh). They
      // crossfade across that window, so the brand name is never
      // visible in both places at once.
      const tldrOpacity =
        p < 0.75 ? 1 : p > 0.88 ? 0 : 1 - (p - 0.75) / 0.13;
      if (tldrRef.current) {
        tldrRef.current.style.opacity = String(tldrOpacity);
      }

      // Beat 5 "morph INTO the navbar".
      //
      // CRITICAL — TIMING: the hero section is 400vh tall with a
      // sticky child of 100vh. CSS sticky unsticks when the section
      // bottom reaches the sticky bottom, i.e. at scrollY = 300vh.
      // From 300vh onward, the sticky (and Beat 5 inside it) scroll
      // UP naturally with the page — adding extra upward motion on
      // top of any transform we apply. To avoid this stacking up,
      // we run the morph ENTIRELY inside the locked range:
      //
      //   exitP 0 at scrollY = 276vh (Beat 5 just fully faded in)
      //   exitP 1 at scrollY = 300vh (sticky still locked)
      //
      // Beat 5 must be opacity 0 by exitP = 1, otherwise it gets
      // dragged off-screen as the sticky unsticks past 300vh.
      //
      //   exitP 0.00 → 0.30   "Take the Journey →" CTA fades out
      //                       fast. The H2 starts traveling up,
      //                       all three words still visible.
      //   exitP 0.00 → 0.70   "I'm " prefix and "." suffix fade
      //                       out — they don't belong in the nav.
      //                       The word "Saurabh" stays solid.
      //   exitP 0.70 → 1.00   Container fully traveled (-28vh)
      //                       and shrunk to 0.18× (≈ nav text size).
      //                       The SiteNav fades in over this same
      //                       window, also showing "Saurabh" in
      //                       the same visual spot — the swap is
      //                       invisible because both render the
      //                       same word at the same place.
      //
      // Throughout the entire morph, the container opacity stays at
      // 1 (multiplied by o5 so the band-fade-in still works for
      // reverse scroll). Visibility is controlled per-part via the
      // refs below.
      const vh = window.innerHeight;
      const exitP = Math.max(
        0,
        Math.min(1, (window.scrollY - vh * 2.76) / (vh * 0.24)),
      );

      if (beat5Ref.current) {
        // Morph travels from the H2's home (top 26vh) up to where
        // the navbar's brand text sits (top ~4vh). 22vh of travel
        // plus a 1 → 0.15 scale collapse makes the big headline
        // visually shrink into the nav pill.
        //
        // Travel is ease-in (quadratic): slow start while user is
        // still reading, then accelerates into the dock. Combined
        // with the dockFade below, the text is barely visible by
        // the time it's near the nav — what the eye actually
        // perceives is the H2 launching upward and dissolving into
        // the navbar exactly as the nav pill materializes.
        const eased = exitP * exitP;
        const scale = 1 - eased * 0.85;          // 1 → 0.15
        const translateYvh = eased * -22;        // lands at top ~4vh = navbar row

        beat5Ref.current.style.transform = `translate3d(0, ${translateYvh}vh, 0) scale(${scale})`;
        beat5Ref.current.style.transformOrigin = "50% 0%";

        // Crossfade with the nav. Text is fully invisible by
        // exitP 0.85 (scrollY ≈ 296vh) — JUST before the sticky
        // unsticks at 300vh. If any opacity remained past 1.0,
        // the sticky's natural upward motion would drag a ghost
        // of the text past the top of the viewport.
        const dockFade =
          exitP < 0.4 ? 1 : exitP > 0.85 ? 0 : 1 - (exitP - 0.4) / 0.45;
        beat5Ref.current.style.opacity = String(o5 * dockFade);
      }

      // The navbar brand reads "I'm Saurabh" (no period), matching
      // the H2's "I'm Saurabh." minus the trailing dot. So during
      // the morph we keep "I'm " visible the whole way down — it's
      // part of the destination string — and only fade out the
      // period. To the eye, the full H2 string shrinks into the
      // nav, with the period dissolving along the way.
      const periodFade =
        exitP <= 0
          ? 1
          : exitP >= 0.5
            ? 0
            : 1 - exitP / 0.5;
      if (beat5SuffixRef.current) {
        beat5SuffixRef.current.style.opacity = String(periodFade);
      }

      // "Take the Journey →" CTA — disappears fast. The button isn't
      // part of the morph; it just clears the stage so the H2 can
      // travel cleanly.
      const ctaFade =
        exitP <= 0 ? 1 : exitP >= 0.25 ? 0 : 1 - exitP / 0.25;
      if (beat5CtaRef.current) {
        beat5CtaRef.current.style.opacity = String(ctaFade);
      }
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
      <div className="dotted-grid-inverse sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-background">
        {/* TL;DR overlay — name + role + location. Visible at hero
            start; fades out near the end of the scroll so the
            SiteNav (which fades IN at the same point) doesn't
            double-show the brand. Opacity driven imperatively in
            the scroll handler, same as the beats. */}
        <header
          ref={tldrRef}
          className="absolute left-4 top-5 z-40 max-w-[52%] sm:left-10 sm:top-8 sm:max-w-[60%]"
        >
          <h1 className="font-display text-base font-medium leading-tight tracking-tight text-foreground sm:text-xl">
            Saurabh Jadhav
          </h1>
          <p className="mt-0.5 font-sans text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px] sm:tracking-[0.2em]">
            <span className="sm:hidden">Full Stack &amp; AI · Mumbai</span>
            <span className="hidden sm:inline">Full Stack &amp; AI Engineer · Mumbai</span>
          </p>
        </header>

        {/* Canvas — replaces <img>. drawImage is atomic with the
            paint, so no blank "in-between" frame during rapid scroll
            swap. mix-blend-mode in light theme hides the dark
            anti-aliased fringe baked into the source frames. */}
        <span className="sr-only">Interactive 3D animated character responding to scroll position.</span>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full mix-blend-multiply dark:mix-blend-normal"
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
            <span className="font-display text-3xl sm:text-4xl">Hello</span>
          </p>
        </div>

        {/* Beat 2 — headline */}
        <div
          ref={beat2Ref}
          className="absolute inset-x-0 top-[20%] z-10 flex flex-col items-center gap-3 px-6 text-center"
          style={{ opacity: 0 }}
        >
          {/* h2, not h1 — the TL;DR overlay's "Saurabh Jadhav" above
              is the page's one canonical h1 (the name); this is a
              scroll-narrative tagline, not a second document-level
              heading. Two <h1>s on one page reads ambiguously to
              screen-reader users jumping to the page's main heading. */}
          <h2 className="font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Full Stack &amp; AI Engineer
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            3+ years · Mumbai
          </p>
        </div>

        {/* Beat 3 — orbital skill tags. Mobile values (unprefixed)
            cluster around the bottom-anchored portrait's actual
            silhouette (~59%–94% of viewport height, see the draw()
            fit math above); sm: restores the original wide desktop
            orbit tuned for the vertically-centered portrait there. */}
        <div ref={beat3Ref} className="absolute inset-0 z-10" style={{ opacity: 0 }}>
          <SkillTag className="absolute left-[4%] top-[50%] sm:left-[12%] sm:top-[18%]">
            Next.js 16
          </SkillTag>
          <SkillTag className="absolute right-[4%] top-[56%] sm:right-[12%] sm:top-[26%]">
            React 19
          </SkillTag>
          <SkillTag className="absolute left-[2%] top-[70%] sm:left-[10%] sm:top-[58%]">
            TypeScript
          </SkillTag>
          <SkillTag className="absolute right-[2%] top-[76%] sm:right-[10%] sm:top-[64%]">
            Firebase
          </SkillTag>
          <SkillTag className="absolute bottom-[10%] left-[8%] sm:bottom-[18%] sm:left-[20%]">
            Tailwind v4
          </SkillTag>
          <SkillTag className="absolute bottom-[18%] right-[8%] sm:bottom-[14%] sm:right-[20%]">
            Multi-agent AI
          </SkillTag>
        </div>

        {/* Beat 4 — the pitch */}
        <div
          ref={beat4Ref}
          className="absolute inset-x-0 top-[24%] z-10 flex flex-col items-center gap-3 px-6 text-center"
          style={{ opacity: 0 }}
        >
          <p className="font-sans text-xl text-primary sm:text-2xl">
            the pitch
          </p>
          <h2 className="font-display text-2xl font-light tracking-tight text-foreground sm:text-3xl md:text-4xl">
            I build systems that replace headcount.
          </h2>
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
            One developer. Infinite leverage.
          </p>
        </div>

        {/* Beat 5 — final reveal */}
        <div
          ref={beat5Ref}
          className="absolute inset-x-0 top-[26%] z-10 flex flex-col items-center gap-8 px-6 text-center"
          style={{ opacity: 0 }}
        >
          {/* Split into spans so only the "I'm " prefix + "." suffix
              fade during the morph — the word "Saurabh" stays solid
              all the way up to the navbar position. */}
          <h2 className="font-display text-5xl font-light tracking-tight text-foreground sm:text-6xl md:text-7xl">
            <span ref={beat5PrefixRef} className="inline-block">
              I&apos;m{" "}
            </span>
            Saurabh
            <span ref={beat5SuffixRef} className="inline-block">
              .
            </span>
          </h2>
          <Link
            ref={beat5CtaRef}
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
