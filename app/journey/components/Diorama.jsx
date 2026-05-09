'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Rails from './Rails.jsx';
import Sleepers from './Sleepers.jsx';
import Train from './Train.jsx';
import AutoFitOrtho from './AutoFitOrtho.jsx';
import useScrollProgress from './useScrollProgress.js';
import {
  JOURNEY_VIEWPORTS,
  TRAIN_X_START,
  TRAIN_X_END,
} from './scenes.js';

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smoothstep = (t) => t * t * (3 - 2 * t);

// World-Y offset for the rails + sleepers + train group. Pushes the
// track + train down so they sit in the lower portion of the frame
// while the upper area reads as sky.
const GROUND_Y_OFFSET = -8;

export default function Diorama() {
  const scrollT = useScrollProgress();
  const trainGroup = useRef(null);

  useFrame(() => {
    if (!trainGroup.current || typeof window === 'undefined') return;
    // Continuous progress across the FULL runway — one smooth glide,
    // no per-viewport reset.
    const totalSpan = Math.max(1, JOURNEY_VIEWPORTS - 1);
    const total = clamp01(scrollT / totalSpan);
    const eased = smoothstep(total);
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
