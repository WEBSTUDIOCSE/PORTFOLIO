'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import Rails from './Rails.jsx';
import Sleepers from './Sleepers.jsx';
import Train from './Train.jsx';
import AutoFitOrtho from './AutoFitOrtho.jsx';
import { STATIONS } from './scenes.js';

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (x) => Math.max(0, Math.min(1, x));

// World-Y offset for the rails + sleepers + train group. The Canvas
// stops at the route-map's top (via `bottom: var(--routemap-h)`).
// -15.5 sits the rails just above the dock — train wheels visible,
// sky-blue gap reduced to ~5px, reads as "flush" without clipping.
const GROUND_Y_OFFSET = -14.8;

// World-X half-length of the train mesh (engine + coach combined).
// Used to position segment endpoints fully OFF-canvas so the snap
// at viewport boundaries isn't visible to the user.
const TRAIN_HALF_LENGTH = 14;

// Train motion model
// ──────────────────
// One scroll viewport = one station-to-next-station segment.
// Within a segment the train moves linearly L→R across the canvas;
// reaching the right edge coincides with the next station activating
// on the route map.
//
// Middle segments use endpoints fully off-canvas (canvas-half +
// train-half) so the per-segment snap at boundaries happens with
// the train already invisible — no visible "rewind" motion.
//
// Segment 0 (Platform → Story) starts with the train at canvas-LEFT
// (its leftmost edge sitting on the left of the canvas) so the train
// is visible on initial page load and "pulls out" to the right as
// the user scrolls.
//
// The last segment (… → Contact) ends mirror-image of segment 0's
// start — the train parked at canvas-RIGHT (its rightmost edge on
// the right of the canvas) — so the journey terminates with the
// train visibly arrived at the final platform.
function computeSegmentEndpoints(idx, total, halfCanvas) {
  const off = halfCanvas + TRAIN_HALF_LENGTH;
  const leftEdge = -halfCanvas + TRAIN_HALF_LENGTH;  // train left edge → canvas left
  const rightEdge = +halfCanvas - TRAIN_HALF_LENGTH; // train right edge → canvas right
  const xStart = idx === 0 ? leftEdge : -off;
  const xEnd = idx === total - 1 ? rightEdge : +off;
  return [xStart, xEnd];
}

export default function Diorama() {
  const trainGroup = useRef(null);
  // Smoothed scrollY value the train reads. Mouse wheels often
  // deliver 100px jumps per notch; smoothing the *input* over a few
  // frames evens out those chunks so the train glides between
  // notches the same way it glides during programmatic autoplay.
  const smoothScrollY = useRef(
    typeof window !== 'undefined' ? window.scrollY : 0
  );
  // Scroll-direction tracking for the engine flip.
  const lastScrollY = useRef(0);
  const facing = useRef(0); // 0 = forward (+X), Math.PI = reverse (-X)
  const camera = useThree((s) => s.camera);
  const sizeW = useThree((s) => s.size.width);

  useFrame((_, delta) => {
    if (!trainGroup.current || typeof window === 'undefined') return;
    if (!camera || !sizeW || !camera.zoom) return;

    // Exponential smoothing of scroll position. Time constant ≈ 67ms
    // (4 frames at 60fps) — fast enough that the eye doesn't read
    // any lag, slow enough to round off the wheel-notch step pattern
    // that makes raw scrollY look chunky.
    const rawScrollY = window.scrollY;
    const smoothing = 1 - Math.exp(-delta * 15);
    smoothScrollY.current += (rawScrollY - smoothScrollY.current) * smoothing;

    const t = smoothScrollY.current / window.innerHeight;
    const total = Math.max(1, STATIONS.length - 1);
    const idx = Math.min(total - 1, Math.max(0, Math.floor(t)));
    const localProgress = clamp01(t - idx);

    const halfCanvas = sizeW / camera.zoom / 2;
    const [xStart, xEnd] = computeSegmentEndpoints(idx, total, halfCanvas);
    const targetX = lerp(xStart, xEnd, localProgress);

    // Engine direction flip — uses raw scrollY so the flip reacts to
    // user input immediately, not after the smoothing settles.
    const dy = rawScrollY - lastScrollY.current;
    if (Math.abs(dy) > 0.5) {
      const newFacing = dy < 0 ? Math.PI : 0;
      if (newFacing !== facing.current) {
        facing.current = newFacing;
        trainGroup.current.rotation.y = newFacing;
      }
    }
    lastScrollY.current = rawScrollY;

    trainGroup.current.position.x = targetX;
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

      {/* Camera fit + dynamic vertical aim. AutoFitOrtho sets both
          camera.position and lookAt each resize so the train is
          anchored near the bottom of the canvas on every aspect.
          No OrbitControls — input is reserved for scrolling. */}
      <AutoFitOrtho groundY={GROUND_Y_OFFSET} />
    </>
  );
}
