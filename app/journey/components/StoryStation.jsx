'use client';

// Story station overlay — a full-screen video takeover that plays
// STORY_SCENES back-to-back as ONE continuous film when the train
// arrives at the story stop. No pagination/slider chrome: scenes
// auto-advance on `ended`; after the last one it calls onComplete(),
// which lifts the train gate (logic in JourneyClient).
//
// Audio is on by default (scenes may be narrated). If the browser
// blocks autoplay-with-sound, a centred play button appears.

import { useCallback, useEffect, useRef, useState } from 'react';
import { STORY_SCENES } from './storyScenes.js';

export default function StoryStation({ scrollT, index, complete, onComplete }) {
  const opacity = Math.max(0, 1 - Math.abs(scrollT - index));
  const active = opacity > 0.5;

  const [sceneIdx, setSceneIdx] = useState(0);
  const [paused, setPaused] = useState(true);
  const videoRef = useRef(null);

  // Drive playback from the active state + current scene.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active && !complete) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {}); // autoplay-with-sound may be blocked; play button covers it
    } else {
      v.pause();
    }
  }, [active, complete, sceneIdx]);

  const handleEnded = useCallback(() => {
    setSceneIdx((i) => {
      if (i < STORY_SCENES.length - 1) return i + 1;
      onComplete?.();
      return i;
    });
  }, [onComplete]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  };

  const scene = STORY_SCENES[sceneIdx];

  return (
    <section
      className="overflow-hidden bg-black"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        // Fill the area ABOVE the train: stop just above the route-map
        // so the video sits flush over the track/train, no cream gap.
        bottom: 'var(--routemap-h, 96px)',
        zIndex: 10,
        opacity,
        pointerEvents: active ? 'auto' : 'none',
      }}
      aria-hidden={!active}
    >
      {/* Full-bleed continuous film */}
      <video
        key={sceneIdx}
        ref={videoRef}
        src={scene?.src}
        onEnded={handleEnded}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Play button — shows when paused (incl. blocked autoplay). */}
      {paused && active && !complete && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play story"
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-3xl text-slate-900 shadow-lg">
            ▶
          </span>
        </button>
      )}

      {/* Caption (optional), bottom-center over a gradient scrim. */}
      {scene?.caption ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 to-transparent px-6 pb-10 pt-20 text-center">
          <p className="mx-auto max-w-2xl text-base text-white/90 sm:text-lg">
            {scene.caption}
          </p>
        </div>
      ) : null}

      {/* Skip (while playing) / continue hint (when done) */}
      {complete ? (
        <p className="absolute inset-x-0 bottom-8 z-10 text-center text-[11px] uppercase tracking-[0.25em] text-white/80">
          The journey continues…
        </p>
      ) : (
        <button
          type="button"
          onClick={() => onComplete?.()}
          className="absolute right-5 top-5 z-10 rounded-full bg-black/40 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
        >
          Skip story →
        </button>
      )}
    </section>
  );
}
