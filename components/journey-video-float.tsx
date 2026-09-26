"use client";

import { useEffect, useState } from "react";
import { STORY_SCENES } from "@/app/journey/components/storyScenes.js";

const JOURNEY_SECTION_ID = "journey-video-section";

type JourneyVideoFloatProps = {
  hasStarted: boolean;
  muted: boolean;
  onTogglePlay: () => void;
  onToggleSound: () => void;
  playing: boolean;
};

export default function JourneyVideoFloat({
  hasStarted,
  muted,
  onTogglePlay,
  onToggleSound,
  playing,
}: JourneyVideoFloatProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const section = document.getElementById(JOURNEY_SECTION_ID);
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const viewFullStory = () => {
    const section = document.getElementById(JOURNEY_SECTION_ID);
    if (!section) return;

    section.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <aside
      aria-label="Journey preview"
      className={`fixed bottom-[5.25rem] left-3 z-30 block w-[min(17rem,calc(100vw-5rem))] origin-bottom-left transition-[opacity,transform] duration-300 sm:bottom-5 sm:left-5 sm:w-[min(21rem,calc(100vw-2.5rem))] ${
        hidden
          ? "pointer-events-none translate-y-3 scale-95 opacity-0"
          : "translate-y-0 scale-100 opacity-100"
      } motion-reduce:transition-none`}
    >
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#171713]/95 shadow-[0_14px_40px_rgba(0,0,0,0.32)] ring-1 ring-black/10 backdrop-blur-xl">
        <div className="flex gap-2.5 p-2.5 sm:gap-3 sm:p-3">
          <div className="relative aspect-[16/10] h-auto w-[5rem] shrink-0 overflow-hidden rounded-xl bg-[#0d0d0b] sm:w-28">
            <video
              src={STORY_SCENES[0].src}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="Journey video preview"
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
            <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/45 px-1.5 py-0.5 text-[7px] font-medium uppercase tracking-[0.13em] text-white/85 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d9ad57]" aria-hidden="true" />
              Preview
            </span>
            {hasStarted && playing && (
              <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 text-[8px] font-medium uppercase tracking-[0.14em] text-white/80">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d9ad57]" aria-hidden="true" />
                Playing
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 py-0.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d9ad57]" aria-hidden="true" />
              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-[#d9ad57]">
                The Journey
              </p>
            </div>
            <p className="mt-1 font-display text-base leading-[1.06] tracking-[-0.02em] text-[#f4f1ea] sm:truncate sm:text-[1.05rem]">
              The work is only half the story.
            </p>
            <button
              type="button"
              onClick={viewFullStory}
              className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#f4f1ea]/65 transition-colors hover:text-[#d9ad57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171713]"
            >
              <span className="sm:hidden">View story</span>
              <span className="hidden sm:inline">View full story</span>
              <span aria-hidden="true" className="text-sm leading-none">↘</span>
            </button>
          </div>
        </div>

        {hasStarted && (
          <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-black/10 px-2.5 py-2 sm:px-3">
            <span className="hidden min-w-0 truncate text-[9px] font-medium uppercase tracking-[0.16em] text-white/45 sm:inline">
              {playing ? "Now playing" : "Story paused"}
            </span>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                aria-label={playing ? "Pause Journey" : "Play Journey"}
                aria-pressed={playing}
                onClick={onTogglePlay}
                className="rounded-full bg-[#f4f1ea] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[#171713] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047] motion-reduce:transition-none"
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                aria-label={muted ? "Turn Journey sound on" : "Mute Journey sound"}
                aria-pressed={!muted}
                onClick={onToggleSound}
                className="rounded-full border border-white/20 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.1em] text-white/70 transition-colors hover:border-[#d9ad57] hover:text-[#d9ad57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047]"
              >
                {muted ? "Sound on" : "Sound off"}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
