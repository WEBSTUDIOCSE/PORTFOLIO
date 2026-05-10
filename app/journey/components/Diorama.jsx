'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Rails from './Rails.jsx';
import Sleepers from './Sleepers.jsx';
import Train from './Train.jsx';
import AutoFitOrtho from './AutoFitOrtho.jsx';
import {
  STATIONS,
  TRAIN_X_START,
  TRAIN_X_END,
} from './scenes.js';

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smoothstep = (t) => t * t * (3 - 2 * t);

// World-Y offset for the rails + sleepers + train group. The Canvas
// stops at the route-map's top (via `bottom: var(--routemap-h)`).
// -15.5 sits the rails just above the dock — train wheels visible,
// sky-blue gap reduced to ~5px, reads as "flush" without clipping.
const GROUND_Y_OFFSET = -14.8;

export default function Diorama() {
  const trainGroup = useRef(null);

  useFrame(() => {
    if (!trainGroup.current || typeof window === 'undefined') return;
    // PER-VIEWPORT motion — each viewport of scroll is one station's
    // screen-traversal. Train moves L→R inside the current viewport
    // and SNAPS back to X_START at the boundary so the next station's
    // sweep starts clean from the left.
    const t = window.scrollY / window.innerHeight;
    const idx = Math.min(
      STATIONS.length - 1,
      Math.max(0, Math.floor(t))
    );
    const localProgress = clamp01(t - idx);
    const eased = smoothstep(localProgress);
    trainGroup.current.position.x = lerp(TRAIN_X_START, TRAIN_X_END, eased);
  });

  return (
    <>
      <color attach="background" args={['#bfd8e8']} />

      {/* Lighting — warm key + cool fill + soft ambient/hemisphere
          for proper 3D form on the train body. No shadows being
          cast (no receiver), so shadow setup is omitted. */}
      <ambientLight intensity={0.22} />
      <hemisphereLight args={[0xfff5e0, 0xb8a98a, 0.55]} />
      <directionalLight
        position={[18, 28, 14]}
        intensity={1.4}
        color={0xfff0d0}
      />
      <directionalLight
        position={[-12, 10, -8]}
        intensity={0.32}
        color={0xc8d8e8}
      />

      {/* Ground layer — track + sleepers + train shift together so
          they sit in the lower portion of the frame. No shadow plane:
          the shadow-catcher created a visible horizontal band above
          the train at the iso camera angle. */}
      <group position={[0, GROUND_Y_OFFSET, 0]}>
        <Rails />
        <Sleepers />

        <group ref={trainGroup}>
          <Train />
        </group>
      </group>

      <AutoFitOrtho />

      {/* Rotation enabled — pan + zoom still locked. The diorama
          can be tumbled with click-drag for any angle. */}
      <OrbitControls
        target={[0, 0, 0]}
        enableRotate={true}
        enablePan={false}
        enableZoom={false}
      />
    </>
  );
}
