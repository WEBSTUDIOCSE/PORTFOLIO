'use client';

import * as THREE from 'three';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useIsMounted } from '@/lib/use-is-mounted';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { Loader, useGLTF } from '@react-three/drei';
import Diorama from './components/Diorama.jsx';
import RouteMap from './components/RouteMap.jsx';
import ContactStation from './components/ContactStation.jsx';
import SkillsStation from './components/SkillsStation.jsx';
import ProjectsStation from './components/ProjectsStation.jsx';
import ExperienceStation from './components/ExperienceStation.jsx';
import StoryStation from './components/StoryStation.jsx';
import GameIntro from './components/GameIntro.jsx';
import useScrollProgress from './components/useScrollProgress.js';
import { GLB_PATH, DRACO_DECODER_PATH } from './components/glb.js';
import { STATIONS } from './components/scenes.js';

const CONTACT_IDX = STATIONS.findIndex((s) => s.id === 'contact');
const SKILLS_IDX = STATIONS.findIndex((s) => s.id === 'skills');
const STORY_IDX = STATIONS.findIndex((s) => s.id === 'story');
const PROJECTS_IDX = STATIONS.findIndex((s) => s.id === 'projects');
const EXPERIENCE_IDX = STATIONS.findIndex((s) => s.id === 'experience');

useGLTF.preload(GLB_PATH, DRACO_DECODER_PATH);

// Autoplay timing (ms). Move = travel between adjacent stations
// at a constant slow scroll velocity (no easing — trains cruise,
// they don't sprint through the middle). Pause = "halt" at each
// station so the user can read the panel.
const AUTOPLAY_MOVE_MS = 8000;
const AUTOPLAY_PAUSE_MS = 5000;

export default function JourneyClient() {
  // Mount-gate: skip Canvas during SSR/hydration.
  const mounted = useIsMounted();

  // globals.css sets `html { scroll-behavior: smooth }` so anchor
  // links elsewhere on the site feel polished. Here it actively hurts:
  // a wheel notch becomes a ~150ms browser-animated scroll, which then
  // collides with Diorama's own 67ms exponential smoothing. The two
  // systems overshoot each other and the train reads as "shaking" on
  // manual scroll while autoplay (which sets `scrollBehavior = 'auto'`)
  // stays glassy-smooth. Disable browser smoothing for the whole
  // /journey session and restore on unmount.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);

  const scrollT = useScrollProgress();
  const activeIdx = Math.min(
    STATIONS.length - 1,
    Math.max(0, Math.floor(scrollT))
  );
  // CONTINUOUS, LINEAR global progress for the route-map marker.
  // Stations sit at evenly-spaced p values (0, 0.25, 0.5, 0.75, 1.0),
  // so a linear map from scrollT means the marker lands exactly on
  // medallion N at the same instant `activeIdx` becomes N — bg
  // crossfade and marker arrival stay in lockstep.
  const total = Math.max(1, STATIONS.length - 1);
  const progress = Math.min(1, Math.max(0, scrollT / total));

  // Story gate: the train is held at the story station until every
  // story scene has finished playing. `storyComplete` flips once
  // StoryStation reports done; the ref lets the rAF autoplay loop read
  // the latest value without re-subscribing.
  const [storyComplete, setStoryComplete] = useState(false);
  const storyCompleteRef = useRef(false);
  useEffect(() => {
    storyCompleteRef.current = storyComplete;
  }, [storyComplete]);

  // Autoplay: train auto-advances through stations with a short halt
  // at each. Any user-initiated scroll cancels playback.
  const [isPlaying, setIsPlaying] = useState(false);
  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  // Hold the train at the story station until the story finishes:
  // clamp manual scroll so it can't pass the story stop. Route-map
  // jumps and prev/next also get snapped back here. Lifts once done.
  useEffect(() => {
    if (storyComplete || STORY_IDX < 0) return;
    const clamp = () => {
      const gateY = STORY_IDX * window.innerHeight;
      if (window.scrollY > gateY + 1) {
        window.scrollTo({ top: gateY, left: 0 });
      }
    };
    window.addEventListener('scroll', clamp, { passive: true });
    clamp();
    return () => window.removeEventListener('scroll', clamp);
  }, [storyComplete]);

  // When the story finishes, the train pulls out on its own: resume
  // autoplay so it cruises on to the next station. (Any user
  // wheel/touch still cancels it, handing control back.)
  useEffect(() => {
    if (!storyComplete) return;
    const t = setTimeout(() => setIsPlaying(true), 700);
    return () => clearTimeout(t);
  }, [storyComplete]);

  useEffect(() => {
    if (!isPlaying) return;
    const TOTAL = STATIONS.length - 1;

    // The site's globals.css sets `html { scroll-behavior: smooth }`
    // for nice manual scroll. During autoplay we set scrollY 60 times
    // per second, and CSS-smooth-scroll tries to animate each call —
    // every new call interrupts the previous animation, producing the
    // "wait then skip" pulse. Switch to auto for the autoplay session
    // and restore on stop.
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    let rafId;

    // Determine starting position. If the user is already at the end,
    // restart from the beginning so play actually shows progress.
    let startT = window.scrollY / window.innerHeight;
    let fromIdx = Math.floor(startT);
    if (fromIdx >= TOTAL) {
      fromIdx = 0;
      window.scrollTo({ top: 0, left: 0 });
      startT = 0;
    }
    let toIdx = fromIdx + 1;

    // Always start in MOVING phase — the user just pressed play, so
    // the train should pull out immediately. If they were mid-viewport,
    // fast-forward the timer so the animation continues from the
    // current scroll position rather than snapping back.
    let phase = 'moving';
    const localT = Math.max(0, startT - fromIdx);
    let phaseStart = performance.now() - localT * AUTOPLAY_MOVE_MS;

    const tick = (now) => {
      const elapsed = now - phaseStart;

      if (phase === 'moving') {
        // Linear interpolation — constant scroll velocity through the
        // segment. No smoothstep here: it created a slow-fast-slow
        // pulse per segment that read as the train "skipping" through
        // the middle. Real trains cruise at steady speed.
        const t = Math.min(1, elapsed / AUTOPLAY_MOVE_MS);
        const targetT = fromIdx + (toIdx - fromIdx) * t;

        // Story gate: stop autoplay exactly at the story station until
        // the story has finished. The StoryStation overlay plays on its
        // own; the user (or a future auto-resume) continues afterwards.
        if (
          STORY_IDX >= 0 &&
          !storyCompleteRef.current &&
          targetT >= STORY_IDX
        ) {
          window.scrollTo({ top: STORY_IDX * window.innerHeight, left: 0 });
          setIsPlaying(false);
          return;
        }

        window.scrollTo({ top: targetT * window.innerHeight, left: 0 });

        if (t >= 1) {
          if (toIdx >= TOTAL) {
            // Reached the final station — stop playback.
            setIsPlaying(false);
            return;
          }
          phase = 'pausing';
          phaseStart = now;
        }
      } else {
        if (elapsed >= AUTOPLAY_PAUSE_MS) {
          fromIdx = toIdx;
          toIdx = fromIdx + 1;
          phase = 'moving';
          phaseStart = now;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    // User-initiated scroll cancels autoplay so the play button
    // doesn't fight the user.
    const cancel = () => setIsPlaying(false);
    const onKey = (e) => {
      if (
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(
          e.key
        )
      ) {
        cancel();
      }
    };
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchmove', cancel, { passive: true });
    window.addEventListener('keydown', onKey);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      html.style.scrollBehavior = prevBehavior;
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchmove', cancel);
      window.removeEventListener('keydown', onKey);
    };
  }, [isPlaying]);

  if (!mounted) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background text-foreground text-xs tracking-[0.2em] uppercase font-mono">
        Loading the diorama
      </div>
    );
  }

  return (
    <>
      {/* Section-A base backdrop — sky-blue. Always rendered. */}
      <div className="journey-platform-bg" aria-hidden="true" />

      {/* Cinematic Game Intro for Station 0 */}
      <GameIntro scrollT={scrollT} index={0} />

      {/* Per-station image layers — continuous crossfade. Each image
          is opaque when scrollT == its index, fades to 0 by the time
          scrollT is one full viewport away. Adjacent stations blend
          smoothly throughout the in-between scroll.

          next/image with fill auto-serves AVIF/WebP at responsive
          widths via Vercel's image optimization, cutting per-image
          payload from ~250 KB down to ~80–120 KB on mobile. The
          first station's image is the LCP candidate, so it gets
          `priority` for the <link rel=preload>. */}
      {STATIONS.map((s, i) =>
        s.bgImage ? (
          <div
            key={`bg-${s.id}`}
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-0 w-full"
            style={{
              height: 'calc(100vh - var(--routemap-h, 96px))',
              opacity: Math.max(0, 1 - Math.abs(scrollT - i)),
            }}
          >
            <Image
              src={s.bgImage}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              style={{ objectFit: 'cover', objectPosition: 'center bottom' }}
            />
          </div>
        ) : null
      )}

      {/* Dotted-grid bg behind the train at Skills/Contact stations,
          matching the SkillsStation/ContactStation panel backdrop so
          the strip behind the train doesn't pop as sky-blue. */}
      {[EXPERIENCE_IDX, SKILLS_IDX, PROJECTS_IDX, CONTACT_IDX].map((idx) => (
        <div
          key={`stationbg-${idx}`}
          className="journey-platform-bg journey-platform-bg-dotted"
          style={{ opacity: Math.max(0, 1 - Math.abs(scrollT - idx)) }}
          aria-hidden="true"
        />
      ))}

      {/* Wrapper takes the fixed positioning. r3f's <Canvas> injects
          width: 100%; height: 100% on its own wrapper div, which
          would override any bottom/inset positioning we put on
          Canvas directly. So we constrain the wrapper instead and
          let the Canvas fill it. Transparent so the platform image
          behind it shows through. */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 'var(--routemap-h, 96px)',
          touchAction: 'pan-y pinch-zoom',
          zIndex: 1,
        }}
      >
        <Canvas
          shadows
          orthographic
          camera={{ position: [0, 22, 36], zoom: 30, near: 0.1, far: 200 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <Suspense fallback={null}>
            <Diorama />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll runway — one viewport per station. The fixed Canvas
          above stays put; the train glides smoothly across all
          viewports as one continuous arc. */}
      <main aria-hidden>
        {STATIONS.map((s) => (
          <section key={s.id} className="h-screen" />
        ))}
      </main>

      {/* Story station overlay — plays the story scene videos when the
          train arrives, and holds the train here (via the gate effect
          + autoplay guard above) until every scene has finished. */}
      <StoryStation
        scrollT={scrollT}
        index={STORY_IDX}
        complete={storyComplete}
        onComplete={() => setStoryComplete(true)}
      />

      {/* Experience station overlay — work history (lib/experience.ts). */}
      <ExperienceStation scrollT={scrollT} index={EXPERIENCE_IDX} />

      {/* Skills station overlay — three-column stack list with
          dotted backdrop. Fades in around scrollT = SKILLS_IDX. */}
      <SkillsStation scrollT={scrollT} index={SKILLS_IDX} />

      {/* Projects station overlay — tiles for shipped work. */}
      <ProjectsStation scrollT={scrollT} index={PROJECTS_IDX} />

      {/* Contact station — final-stop overlay. Self-contained banner
          + headline + actions. Fades in alongside the bg crossfade
          curve as the user scrolls into the last viewport. */}
      <ContactStation scrollT={scrollT} index={CONTACT_IDX} />

      {/* Bottom route-map (station cards) — fixed bottom dock.
          Top hoarding (Section A) is temporarily disabled while we
          align Section B (train track) and Section C (route map). */}
      <RouteMap
        stations={STATIONS}
        activeIdx={activeIdx}
        progress={progress}
        scrollT={scrollT}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
      />

      <Loader
        containerStyles={{ background: '#bfd8e8' }}
        innerStyles={{ background: 'rgba(255,255,255,0.4)' }}
        barStyles={{ background: '#2a241c' }}
        dataStyles={{
          color: '#2a241c',
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '0.2em',
        }}
      />
    </>
  );
}
