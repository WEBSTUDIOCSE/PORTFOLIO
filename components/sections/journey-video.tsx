"use client";

import { useEffect, useRef, useState } from "react";
import { STORY_SCENES } from "@/app/journey/components/storyScenes.js";

export default function JourneyVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [sectionVisible, setSectionVisible] = useState(true);
  const [floatingDismissed, setFloatingDismissed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const scene = STORY_SCENES[sceneIdx];
  const showFloatingPlayer = playing && !sectionVisible && !floatingDismissed;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.intersectionRatio > 0.2),
      { threshold: [0, 0.2] },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncFullscreen = () => {
      setFullscreen(document.fullscreenElement === videoRef.current);
    };

    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!playing) return;

    // Keep the story videos out of the initial page payload. Load the
    // current scene only after the visitor explicitly presses Play.
    if (video.readyState === HTMLMediaElement.HAVE_NOTHING) video.load();

    const playScene = () => {
      void video.play().catch(() => setPlaying(false));
    };

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      playScene();
      return;
    }

    video.addEventListener("canplay", playScene, { once: true });
    return () => video.removeEventListener("canplay", playScene);
  }, [sceneIdx, playing]);

  const togglePreview = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
      return;
    }

    setFloatingDismissed(false);
    setPlaying(true);
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (videoRef.current) videoRef.current.muted = nextMuted;
  };

  const closeFloatingPlayer = () => {
    videoRef.current?.pause();
    setPlaying(false);
    setFloatingDismissed(true);
  };

  const toggleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await video.requestFullscreen();
      }
    } catch {
      // Fullscreen can be denied by browser policy; playback remains usable.
    }
  };

  const handleEnded = () => {
    if (sceneIdx < STORY_SCENES.length - 1) {
      setSceneIdx((current) => current + 1);
      return;
    }

    setPlaying(false);
    setSceneIdx(0);
  };

  return (
    <section
      ref={sectionRef}
      id="journey-video-section"
      aria-labelledby="journey-video-title"
      className="relative overflow-hidden bg-[#171713] px-5 py-20 text-[#f4f1ea] sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.24em] text-[#d9ad57]">
              the journey
            </p>
            <h2
              id="journey-video-title"
              className="max-w-3xl font-display text-4xl font-light leading-[0.98] tracking-[-0.04em] sm:text-6xl"
            >
              The work is only half the story.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#f4f1ea]/60 lg:justify-self-end">
            Watch the complete story here—from the first frame to the final
            scene, without leaving the homepage.
          </p>
        </div>

        <div className="group relative aspect-[16/8] min-h-[19rem] overflow-hidden rounded-[2rem] border border-white/15 bg-[#0d0d0b] shadow-2xl shadow-black/30 sm:min-h-[26rem]">
          <video
            ref={videoRef}
            src={scene.src}
            muted={muted}
            playsInline
            preload="none"
            onEnded={handleEnded}
            aria-label={`Journey scene ${sceneIdx + 1} of ${STORY_SCENES.length}`}
            className={
              showFloatingPlayer
                ? "fixed bottom-4 left-4 z-[60] aspect-video h-auto w-[calc(100vw-2rem)] rounded-2xl border border-white/20 object-cover opacity-95 shadow-2xl shadow-black/50 sm:bottom-6 sm:left-6 sm:w-[min(26rem,calc(100vw-3rem))] motion-reduce:transition-none"
                : "absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
            }
          />
          <div
            className={`absolute inset-0 bg-[linear-gradient(90deg,rgba(13,13,11,.72),rgba(13,13,11,.08)_65%,rgba(13,13,11,.3)),linear-gradient(0deg,rgba(13,13,11,.8),transparent_55%)] transition-opacity duration-300 motion-reduce:transition-none ${
              showFloatingPlayer ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          />

          <div
            className={`absolute left-6 top-6 flex items-center gap-2 transition-opacity duration-300 motion-reduce:transition-none ${
              showFloatingPlayer ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <button
              type="button"
              aria-label={playing ? "Pause Journey" : "Play Journey"}
              aria-pressed={playing}
              onClick={togglePreview}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-[#f4f1ea] text-[#171713] shadow-xl transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171713] motion-reduce:transition-none"
            >
              <span aria-hidden="true" className="text-lg">
                {playing ? "Ⅱ" : "▶"}
              </span>
            </button>
            <button
              type="button"
              aria-label={muted ? "Turn Journey sound on" : "Mute Journey sound"}
              aria-pressed={!muted}
              onClick={toggleSound}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-sm text-white backdrop-blur-sm transition-colors hover:border-[#d9ad57] hover:text-[#d9ad57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047]"
            >
              <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
            </button>
            <button
              type="button"
              aria-label={fullscreen ? "Exit Journey fullscreen" : "Open Journey fullscreen"}
              aria-pressed={fullscreen}
              onClick={toggleFullscreen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-sm text-white backdrop-blur-sm transition-colors hover:border-[#d9ad57] hover:text-[#d9ad57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047]"
            >
              <span aria-hidden="true">⛶</span>
            </button>
          </div>

          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-2xl tracking-tight sm:text-3xl">The Journey</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/55">
                Scene {String(sceneIdx + 1).padStart(2, "0")} / {String(STORY_SCENES.length).padStart(2, "0")}
              </p>
            </div>
            <span className="hidden rounded-full border border-white/20 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/60 sm:inline-flex">
              Sound {muted ? "off" : "on"}
            </span>
          </div>
        </div>
      </div>

      {showFloatingPlayer && (
        <aside
          aria-label="Floating Journey player"
          className="pointer-events-none fixed bottom-4 left-4 z-[61] aspect-video w-[calc(100vw-2rem)] sm:bottom-6 sm:left-6 sm:w-[min(26rem,calc(100vw-3rem))]"
        >
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex items-start justify-between gap-3 rounded-b-2xl bg-[#0d0d0b]/90 px-3 py-2.5 text-[#f4f1ea] backdrop-blur-md sm:px-4">
            <div className="min-w-0">
              <p className="truncate font-display text-sm leading-tight sm:text-base">
                The Journey
              </p>
              <p className="mt-1 max-w-[13rem] font-display text-xs leading-tight text-white/75 sm:text-sm">
                The work is only half the story.
              </p>
              <p className="mt-0.5 font-sans text-[9px] uppercase tracking-[0.16em] text-white/55">
                Scene {String(sceneIdx + 1).padStart(2, "0")} / {String(STORY_SCENES.length).padStart(2, "0")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                aria-label={playing ? "Pause Journey" : "Play Journey"}
                aria-pressed={playing}
                onClick={togglePreview}
                className="rounded-full border border-white/20 bg-[#f4f1ea] px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#171713] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047] motion-reduce:transition-none"
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                aria-label={muted ? "Turn Journey sound on" : "Mute Journey sound"}
                aria-pressed={!muted}
                onClick={toggleSound}
                className="rounded-full border border-white/20 px-2.5 py-1.5 font-sans text-[10px] uppercase tracking-[0.12em] text-white/75 transition-colors hover:border-[#d9ad57] hover:text-[#d9ad57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047]"
              >
                {muted ? "Sound off" : "Sound on"}
              </button>
              <button
                type="button"
                aria-label={fullscreen ? "Exit Journey fullscreen" : "Open Journey fullscreen"}
                aria-pressed={fullscreen}
                onClick={toggleFullscreen}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm text-white/75 transition-colors hover:border-[#d9ad57] hover:text-[#d9ad57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047]"
              >
                <span aria-hidden="true">⛶</span>
              </button>
              <button
                type="button"
                aria-label="Close floating Journey player"
                onClick={closeFloatingPlayer}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-sm text-white/75 transition-colors hover:border-[#d9ad57] hover:text-[#d9ad57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde047]"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </section>
  );
}
