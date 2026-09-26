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
      className={`fixed bottom-4 left-4 z-30 block w-[min(18rem,calc(100vw-2rem))] origin-bottom-left transition-[opacity,transform] duration-300 sm:bottom-6 sm:left-6 ${
        hidden
          ? "pointer-events-none translate-y-3 scale-95 opacity-0"
          : "translate-y-0 scale-100 opacity-100"
      } motion-reduce:transition-none`}
    >
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-[#171713]/95 shadow-2xl shadow-black/35 backdrop-blur-md">
        <div className="flex gap-3 p-2.5">
          <div className="relative h-[4.5rem] w-24 shrink-0 overflow-hidden rounded-xl bg-[#0d0d0b] sm:h-20 sm:w-32">
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
            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.14em] text-white/80">
              Preview
            </span>
          </div>

          <div className="min-w-0 flex-1 py-0.5">
            <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-[#d9ad57]">
              The Journey
            </p>
            <p className="mt-1 font-display text-sm leading-tight text-[#f4f1ea]">
              The work is only half the story.
            </p>
            <button
              type="button"
              onClick={viewFullStory}
              className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#f4f1ea]/70 transition-colors hover:text-[#d9ad57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171713]"
            >
              View full story
              <span aria-hidden="true">↘</span>
            </button>
            {hasStarted && (
              <div className="mt-2 flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label={playing ? "Pause Journey" : "Play Journey"}
                  aria-pressed={playing}
                  onClick={onTogglePlay}
                  className="rounded-full border border-white/20 bg-[#f4f1ea] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#171713] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047] motion-reduce:transition-none"
                >
                  {playing ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  aria-label={muted ? "Turn Journey sound on" : "Mute Journey sound"}
                  aria-pressed={!muted}
                  onClick={onToggleSound}
                  className="rounded-full border border-white/20 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] text-white/75 transition-colors hover:border-[#d9ad57] hover:text-[#d9ad57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047]"
                >
                  {muted ? "Sound on" : "Sound off"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
