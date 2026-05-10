'use client';

import * as THREE from 'three';
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, useGLTF } from '@react-three/drei';
import Diorama from './components/Diorama.jsx';
import RouteMap from './components/RouteMap.jsx';
import useScrollProgress from './components/useScrollProgress.js';
import { GLB_PATH, DRACO_DECODER_PATH } from './components/glb.js';
import { STATIONS } from './components/scenes.js';

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
  // Per-viewport progress with the same smoothstep easing as the
  // 3D train. The mini-train marker on the route-map glides between
  // the active station's medallion and the next one, in lockstep
  // with the actual train's L→R sweep within the viewport.
  const localT = Math.min(1, Math.max(0, scrollT - activeIdx));
  const eased = localT * localT * (3 - 2 * localT);
  const fromP = STATIONS[activeIdx]?.p ?? 0;
  const toP =
    STATIONS[Math.min(STATIONS.length - 1, activeIdx + 1)]?.p ?? 1;
  const progress = fromP + (toP - fromP) * eased;

  if (!mounted) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#bfd8e8] text-[#2a241c] text-xs tracking-[0.2em] uppercase font-mono">
        Loading the diorama
      </div>
    );
  }

  return (
    <>
      {/* Wrapper takes the fixed positioning. r3f's <Canvas> injects
          width: 100%; height: 100% on its own wrapper div, which
          would override any bottom/inset positioning we put on
          Canvas directly. So we constrain the wrapper instead and
          let the Canvas fill it. */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 'var(--routemap-h, 160px)',
          background: '#bfd8e8',
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
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          style={{ background: '#bfd8e8' }}
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
