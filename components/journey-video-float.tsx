"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const JOURNEY_PREVIEW = "/assets/journey/story/scene1.mp4";

/**
 * Lightweight homepage invitation to the full Journey film.
 * The full eight-scene player stays isolated on /journey.
 */
export default function JourneyVideoFloat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = useState(false);

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const startPreview = () => {
    setExpanded(true);
    if (!prefersReducedMotion()) {
      void videoRef.current?.play().catch(() => {});
    }
  };

  const stopPreview = () => {
    setExpanded(false);
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  const togglePreview = () => {
    if (expanded) stopPreview();
    else startPreview();
  };

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      video?.pause();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6 ${
        expanded ? "w-[min(19rem,calc(100vw-2rem))]" : "w-24"
      }`}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-[#101010] shadow-2xl shadow-black/30 transition-[width,height,box-shadow] duration-300 motion-reduce:transition-none">
        <button
          type="button"
          aria-label="Preview Saurabh's journey"
          aria-expanded={expanded}
          onClick={togglePreview}
          onFocus={startPreview}
          className={`group relative block w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047] focus-visible:ring-inset ${
            expanded ? "h-44 sm:h-48" : "h-14"
          }`}
        >
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          >
            <source src={JOURNEY_PREVIEW} type="video/mp4" />
          </video>
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />
          <span className="relative flex h-full items-end justify-between gap-2 px-3 py-2.5 text-white">
            <span className="min-w-0">
              <span className="block truncate font-display text-sm leading-tight">
                The Journey
              </span>
              {expanded && (
                <span className="mt-0.5 block text-[9px] uppercase tracking-[0.18em] text-white/65">
                  Preview the film
                </span>
              )}
            </span>
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/90 text-xs text-black"
            >
              {expanded ? "×" : "▶"}
            </span>
          </span>
        </button>

        {expanded && (
          <Link
            href="/journey"
            className="flex items-center justify-between border-t border-white/15 px-3 py-2.5 text-[10px] uppercase tracking-[0.18em] text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047] focus-visible:ring-inset"
          >
            Watch full journey
            <span aria-hidden="true">↗</span>
          </Link>
        )}
      </div>
    </div>
  );
}
