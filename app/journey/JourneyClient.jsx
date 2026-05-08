'use client';

import * as THREE from 'three';
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, useGLTF, useTexture } from '@react-three/drei';
import Diorama from './components/Diorama.jsx';
import { GLB_PATH, DRACO_DECODER_PATH } from './components/glb.js';

useGLTF.preload(GLB_PATH, DRACO_DECODER_PATH);
useTexture.preload('/assets/mountains_bg.png?v=3');
useTexture.preload('/assets/village_bg.png?v=1');

export default function JourneyClient() {
  // Mount-gate: skip Canvas during SSR/hydration. Next.js 16 doesn't
  // allow next/dynamic({ ssr: false }) inside a Server Component, so
  // we gate at the client-component level instead.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#bfd8e8] text-[#2a241c] text-xs tracking-[0.2em] uppercase font-mono">
        Loading the diorama
      </div>
    );
  }

  return (
    <>
      <Canvas
        shadows
        orthographic
        camera={{ position: [0, 28, 38], zoom: 30, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{
          background: '#bfd8e8',
          position: 'fixed',
          inset: 0,
          touchAction: 'pan-y pinch-zoom',
        }}
      >
        <Suspense fallback={null}>
          <Diorama />
        </Suspense>
      </Canvas>

      <Loader
        containerStyles={{ background: '#bfd8e8' }}
        innerStyles={{ background: 'rgba(255,255,255,0.4)' }}
        barStyles={{ background: '#2a241c' }}
        dataStyles={{ color: '#2a241c', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.2em' }}
      />
    </>
  );
}
