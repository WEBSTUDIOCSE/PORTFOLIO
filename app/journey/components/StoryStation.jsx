'use client';

// Story station overlay — a full-screen video takeover that plays
// STORY_SCENES back-to-back as ONE continuous film when the train
// arrives at the story stop. After the last scene it calls onComplete(),
// which lifts the train gate (logic in JourneyClient).
//
// iOS gap fix: every scene's <video> stays MOUNTED (not remounted per
// scene) and scenes crossfade by opacity. Remounting created a fresh
// <video> that paints black for a beat on iOS Safari between scenes.
// Persisting them + opacity crossfade removes that black flash. Only
// the current + next scene preload to keep memory/bandwidth sane.
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
  const videoRefs = useRef([]);

  // Play the active scene; pause (and rewind) the others.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === sceneIdx && active && !complete) {
        const p = v.play();
        if (p && p.catch) p.catch(() => {}); // autoplay-with-sound may be blocked
      } else {
        v.pause();
        if (i !== sceneIdx) {
          try {
            v.currentTime = 0;
          } catch {
            /* not seekable yet — ignore */
          }
        }
      }
    });
  }, [sceneIdx, active, complete]);

  const handleEnded = useCallback(
    (i) => {
      if (i !== sceneIdx) return; // only the active scene advances
      if (sceneIdx < STORY_SCENES.length - 1) {
        setSceneIdx(sceneIdx + 1);
      } else {
        onComplete?.();
      }
    },
    [sceneIdx, onComplete],
  );

  const togglePlay = () => {
    const v = videoRefs.current[sceneIdx];
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
        // Fill the area above the route-map dock.
        bottom: 'var(--routemap-h, 96px)',
        zIndex: 10,
        opacity,
        pointerEvents: active ? 'auto' : 'none',
      }}
      aria-hidden={!active}
    >
      {/* All scenes mounted; only the active one is opaque + playing. */}
      {STORY_SCENES.map((s, i) => (
        <video
          key={i}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          src={s.src}
          onEnded={() => handleEnded(i)}
          onPlay={() => {
            if (i === sceneIdx) setPaused(false);
          }}
          onPause={() => {
            if (i === sceneIdx) setPaused(true);
          }}
          playsInline
          preload={i === sceneIdx || i === sceneIdx + 1 ? 'auto' : 'none'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            i === sceneIdx ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: i === sceneIdx ? 2 : 1 }}
        />
      ))}

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
