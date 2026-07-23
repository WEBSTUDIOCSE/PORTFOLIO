'use client';

// TEMPORARY SIMPLIFICATION (2026-07-23): the full 3D diorama (Canvas,
// Diorama, Train, RouteMap, GameIntro, per-station overlays — all
// still present under ./components/) was causing enough main-thread
// contention that the story videos stuttered. Rather than debug the
// render cost right now, /journey is temporarily just the story video
// reel — plays through once, then returns to "/" — with no
// train/scroll/station chrome at all. The original components are
// untouched and unimported here — swapping this file's contents back
// to render <Diorama> etc. is a full revert, not a rebuild.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMounted } from '@/lib/use-is-mounted';
import { STORY_SCENES } from './components/storyScenes.js';

export default function JourneyClient() {
  const mounted = useIsMounted();
  const router = useRouter();
  const [sceneIdx, setSceneIdx] = useState(0);
  const [paused, setPaused] = useState(true);
  const videoRefs = useRef([]);

  // Play the active scene; pause the others.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === sceneIdx) {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, [sceneIdx]);

  // After the last scene finishes, send the visitor back home instead
  // of looping — this reel is a one-shot watch, not an ambient loop.
  const handleEnded = useCallback(
    (i) => {
      if (i !== sceneIdx) return;
      if (sceneIdx < STORY_SCENES.length - 1) {
        setSceneIdx(sceneIdx + 1);
      } else {
        router.push('/');
      }
    },
    [sceneIdx, router],
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

  if (!mounted) {
    return <div className="fixed inset-0 bg-black" />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* All scenes mounted; only the active one is opaque + playing —
          keeps iOS Safari from painting a black flash between scenes. */}
      {STORY_SCENES.map((s, i) => {
        const shouldPreload = i <= sceneIdx + 2 ? 'auto' : 'none';
        return (
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
            preload={shouldPreload}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              i === sceneIdx ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ zIndex: i === sceneIdx ? 2 : 1 }}
          />
        );
      })}

      {/* Play button — shows when paused (incl. blocked autoplay). */}
      {paused && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-3xl text-slate-900 shadow-lg">
            ▶
          </span>
        </button>
      )}
    </div>
  );
}
