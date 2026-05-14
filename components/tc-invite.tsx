"use client";

import { useEffect, useRef, useState } from "react";
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
// Asset: /assets/tc-wave.webm — AI-generated TTE on loop, background
// removed via Picsart. VP9 + alpha channel for transparency over the
// page. Muted + playsInline + autoplay are required for mobile
// autoplay; loop keeps the wave continuous.
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

  useEffect(() => {
    if (dismissed) return;
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

  // Pause the video while off-screen — saves decode cycles on
  // long-scroll pages. The video is decorative so play state
  // doesn't matter for accessibility.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (visible && !dismissed) {
      v.play().catch(() => {
        // Autoplay blocked. The static first frame still reads as
        // a TC waving — graceful degradation.
      });
    } else {
      v.pause();
    }
  }, [visible, dismissed]);

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
          {/* `mix-blend-mode: screen` blends the pure black background
              of the video into whatever's behind — on light bg, black
              pixels become white-ish (invisible); on dark bg, they
              stay dark and match the page. The TC's mid-tones survive
              well; the dark uniform fades slightly on light theme but
              still reads as a silhouette. This is the practical fix
              because Picsart's "background remover" only painted the
              bg solid black instead of actually adding an alpha
              channel — and libvpx-vp9 won't encode VP9-with-alpha on
              Windows ffmpeg builds, so there's no clean codec-level
              path. drop-shadow removed because shadow on a rectangular
              video element gives away the bounding box. */}
          {/* Lazy-mount the <video src>: the 1.76 MB webm only starts
              fetching once `visible` flips to true (user scrolled past
              hero). Before then, the video element renders empty with
              preload="none" so initial mobile payload stays light.
              The `play()` effect above kicks in the moment src lands. */}
          <video
            ref={videoRef}
            src={visible ? "/assets/tc-wave.webm" : undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            style={{ mixBlendMode: "screen" }}
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
