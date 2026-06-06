"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// TC (Ticket Checker) invite — a small Indian Railways TTE character
// who slides in from the right edge of the screen once the visitor
// has cleared the hero, waves "come, come" with a speech bubble,
// and routes to /journey on click.
//
// Why this exists: /journey is the long-form 3D portfolio story.
// A static "Take the Journey →" CTA in the hero converts a fraction
// of visitors who reach the bottom of the page. A character-driven
// invite — culturally specific (Indian Railways TTE), animated,
// surprising — turns the CTA into a moment of personality. The TC
// is the literal "gatekeeper" of every Indian train, so the metaphor
// is honest: he's inviting you onto the journey.
//
// Asset: /assets/tc-wave.webp — AI-generated TTE on loop. The source
// was a black-background webm; the solid black was keyed to a real
// alpha channel (ffmpeg colorkey) and re-encoded as an animated,
// transparent WebP. Rendered via <img> so it works on iOS Safari,
// which ignores mix-blend-mode on <video> (the old approach showed a
// black box on iPhones).
//
// Behavior:
// - Only mounts on / (home). The /journey page is the destination,
//   so showing the TC there would be silly.
// - Slides in after scrollY > 100vh, well past the hero so it
//   doesn't compete with the character-scroll animation.
// - Bottom-right fixed positioning, ~140px on desktop / 100px on
//   mobile. Speech bubble hides on mobile (too cramped) — the
//   character alone reads as an invite.
// - Dismissable via small × button. Dismissal stored in
//   sessionStorage so the TC returns on a new visit but not within
//   the same browse session — respects "I've seen it, move on".

const STORAGE_KEY = "tc-invite-dismissed";

export default function TCInvite() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Read dismissal flag on mount. We do this in an effect (not
  // useState initializer) because sessionStorage is window-only and
  // accessing it during SSR throws.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setDismissed(true);
      }
    } catch {
      // sessionStorage can throw in private-mode Safari etc.
      // Treat as "not dismissed", no harm done.
    }
  }, []);

  // Realtime colorkey processor for the webm video.
  // This lets us use the original clean video but strip out the
  // black background frame-by-frame, perfectly solving both the 
  // ghosting WebP issue and the iOS Safari mix-blend-mode issue!
  useEffect(() => {
    if (!visible || dismissed) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let raf = 0;
    let ctx = canvas.getContext("2d", { willReadFrequently: true });

    const loop = () => {
      if (video.paused || video.ended || !ctx) return;
      
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      
      // Ensure canvas strictly matches the video's aspect ratio to prevent vertical stretching
      if (vw && vh && (canvas.width !== vw || canvas.height !== vh)) {
        canvas.width = vw;
        canvas.height = vh;
      }
      
      if (vw && vh) {
        ctx.clearRect(0, 0, vw, vh);
        ctx.drawImage(video, 0, 0, vw, vh);
      }
      
      raf = requestAnimationFrame(loop);
    };

    const onPlay = () => {
      if (ctx) loop();
    };

    video.addEventListener("play", onPlay);
    video.play().catch(() => {});

    return () => {
      video.removeEventListener("play", onPlay);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [visible, dismissed]);

  useEffect(() => {
    if (dismissed) return null;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        // Reveal once the user has scrolled one full viewport past
        // the page top — they've committed to reading the page,
        // and the TC isn't competing with the hero canvas.
        setVisible(window.scrollY > window.innerHeight);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [dismissed]);

  if (dismissed) return null;

  const onDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore — fail open
    }
    setDismissed(true);
  };

  // Peek-from-corner design: on desktop the TC sits ~35% off the
  // right edge of the screen by default — only his torso + waving
  // arm visible. Hovering him slides him fully in AND fades in the
  // speech bubble + dismiss control. The "what's that peeking?"
  // moment is the actual invite — full reveal is the payoff.
  //
  // Mobile doesn't peek (touch has no hover, so no reveal is
  // possible). On phones the TC stays fully visible at the corner.
  return (
    <div
      className={`pointer-events-none fixed bottom-4 right-4 z-40 group flex items-end gap-2 transition-all duration-700 ease-out sm:bottom-6 sm:right-6 sm:gap-3 ${
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-[140%] opacity-0"
      }`}
    >
      {/* Speech bubble — desktop only, hover-only. Hidden in peek
          state so it doesn't appear disconnected from the off-screen
          character. Reappears with the character on hover. */}
      <div
        aria-hidden
        className="relative mb-6 hidden rounded-2xl border border-border bg-card px-4 py-2.5 opacity-0 shadow-lg shadow-foreground/[0.06] transition-opacity duration-300 md:block md:group-hover:opacity-100"
      >
        <span className="font-hand text-lg leading-tight text-foreground">
          चला! Come, come →
        </span>
        <span
          aria-hidden
          className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rotate-45 border-r border-t border-border bg-card"
        />
      </div>

      {/* Character wrapper — its OWN transform handles the peek-out /
          slide-in, separate from the outer container's scroll-reveal
          transform. The two compose: outer is 140% off-screen until
          scroll, then 0; inner is 35% peek by default, 0 on hover. */}
      <div className="pointer-events-auto relative transition-transform duration-500 ease-out md:translate-x-[35%] md:group-hover:translate-x-0">
        <Link
          href="/journey"
          aria-label="Take the journey — meet the Ticket Checker"
          // prefetch=false: the /journey chunk is ~256 KB of
          // three.js + r3f. Default Next.js Link auto-prefetches it
          // the moment this widget intersects the viewport, dragging
          // the entire 3D bundle onto every home-page session even
          // for visitors who never click. Visitors who DO click pay
          // a one-time fetch on navigation, which Next.js Loader UI
          // already handles. See /journey JourneyClient mount-gate.
          prefetch={false}
          className="block transition-transform duration-300 hover:scale-110 focus-visible:scale-110 focus-visible:outline-none"
        >
          {/* We replace the img with a hidden video and a visible canvas.
              The video plays the original clean webm, and the canvas
              dynamically keys out the black background. This works everywhere
              including iOS Safari without ghosting! */}
          {visible && (
            <video
              ref={videoRef}
              src="/assets/tc-wave.webm"
              loop
              muted
              playsInline
              crossOrigin="anonymous"
              className="hidden"
            />
          )}
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="h-24 w-24 object-contain sm:h-32 sm:w-32 md:h-36 md:w-36"
          />
        </Link>

        {/* Dismiss control — also hover-only on desktop so peek state
            stays clean. On mobile (no hover) it's always visible. */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-opacity hover:text-foreground md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path
              d="M2 2 L8 8 M8 2 L2 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
