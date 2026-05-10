'use client';

import * as THREE from 'three';
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, useGLTF } from '@react-three/drei';
import Diorama from './components/Diorama.jsx';
import RouteMap from './components/RouteMap.jsx';
import ContactStation from './components/ContactStation.jsx';
import useScrollProgress from './components/useScrollProgress.js';
import { GLB_PATH, DRACO_DECODER_PATH } from './components/glb.js';
import { STATIONS } from './components/scenes.js';

const CONTACT_IDX = STATIONS.findIndex((s) => s.id === 'contact');

useGLTF.preload(GLB_PATH, DRACO_DECODER_PATH);

export default function JourneyClient() {
  // Mount-gate: skip Canvas during SSR/hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  if (!mounted) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#bfd8e8] text-[#2a241c] text-xs tracking-[0.2em] uppercase font-mono">
        Loading the diorama
      </div>
    );
  }

  return (
    <>
      {/* Section-A base backdrop — sky-blue. Always rendered. */}
      <div className="journey-platform-bg" aria-hidden="true" />

      {/* Per-station image layers — continuous crossfade. Each image
          is opaque when scrollT == its index, fades to 0 by the time
          scrollT is one full viewport away. Adjacent stations blend
          smoothly throughout the in-between scroll. */}
      {STATIONS.map((s, i) =>
        s.bgImage ? (
          <img
            key={`bg-${s.id}`}
            src={s.bgImage}
            alt=""
            aria-hidden="true"
            className="journey-platform-bg-img"
            style={{ opacity: Math.max(0, 1 - Math.abs(scrollT - i)) }}
          />
        ) : null
      )}

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
