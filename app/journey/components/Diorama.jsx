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
  // Damped X position the train chases each frame. Seed with X_START
  // so the first frame doesn't lerp out of mid-screen.
  const currentX = useRef(TRAIN_X_START);
  // Scroll-direction tracking. The train INSTANTLY flips 180° on
  // direction change (no rotation animation — the previous damped
  // spin felt like a teleport). Seeded to "down" so the engine starts
  // facing +X on first paint.
  const lastScrollY = useRef(0);
  const facing = useRef(0); // 0 = forward (+X), Math.PI = reverse (-X)

  useFrame((_, delta) => {
    if (!trainGroup.current || typeof window === 'undefined') return;
    // CONTINUOUS motion — train traverses X_START → X_END across the
    // entire scroll runway as one unbroken arc.
    const scrollY = window.scrollY;
    const total = Math.max(1, STATIONS.length - 1);
    const tGlobal = clamp01(scrollY / window.innerHeight / total);
    const eased = smoothstep(tGlobal);
    const targetX = lerp(TRAIN_X_START, TRAIN_X_END, eased);

    // Detect scroll-direction change and snap the engine to the new
    // direction. Threshold of 0.5px keeps micro-jitter from spinning.
    const dy = scrollY - lastScrollY.current;
    if (Math.abs(dy) > 0.5) {
      const newFacing = dy < 0 ? Math.PI : 0;
      if (newFacing !== facing.current) {
        facing.current = newFacing;
        trainGroup.current.rotation.y = newFacing;
      }
    }
    lastScrollY.current = scrollY;

    // Frame-rate-independent exponential damping. Higher coefficient
    // = snappier follow; lower = silkier but laggier. 8 keeps the
    // train tightly tied to scroll while filtering out micro-jitter.
    const smoothing = 1 - Math.exp(-delta * 8);
    currentX.current += (targetX - currentX.current) * smoothing;
    trainGroup.current.position.x = currentX.current;
  });

  return (
    <>
      {/* No <color attach="background"> — the canvas is transparent
          (alpha=true) so the .journey-platform-bg DOM image behind
          the Canvas shows through. */}

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
