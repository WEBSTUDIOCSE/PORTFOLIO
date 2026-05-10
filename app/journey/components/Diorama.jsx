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

// Critical-damped spring constants for the train's X position.
// Stiffness sets how quickly the train chases its target; damping
// sets how smoothly it settles. Tuned for "butter smooth": train
// glides into position with no bounce and no jitter, even on fast
// scroll. Critical damping ≈ 2 * sqrt(stiffness) ≈ 17.9, so 19
// gives a touch of overdamping (zero overshoot, silkier arrival).
const SPRING_STIFFNESS = 80;
const SPRING_DAMPING = 19;
// Frame-time clamp — protects spring math from instability when the
// browser drops a long frame (tab backgrounded, etc.). 33ms = 30fps.
const MAX_DT = 1 / 30;

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
  // Spring-driven X position. `currentX` is the painted position,
  // `velocityX` is its current rate of change. The spring resolves
  // each frame to chase `targetX` (the scroll-derived ideal).
  const currentX = useRef(0);
  const velocityX = useRef(0);
  // Active segment index from the previous frame; used to detect
  // boundary crossings and snap the train (invisibly).
  const lastIdx = useRef(-1);
  // Scroll-direction tracking for the engine flip.
  const lastScrollY = useRef(0);
  const facing = useRef(0); // 0 = forward (+X), Math.PI = reverse (-X)
  const camera = useThree((s) => s.camera);
  const sizeW = useThree((s) => s.size.width);

  useFrame((_, delta) => {
    if (!trainGroup.current || typeof window === 'undefined') return;
    if (!camera || !sizeW || !camera.zoom) return;

    const scrollY = window.scrollY;
    const t = scrollY / window.innerHeight;
    const total = Math.max(1, STATIONS.length - 1);
    const idx = Math.min(total - 1, Math.max(0, Math.floor(t)));
    const localProgress = clamp01(t - idx);

    const halfCanvas = sizeW / camera.zoom / 2;
    const [xStart, xEnd] = computeSegmentEndpoints(idx, total, halfCanvas);
    const targetX = lerp(xStart, xEnd, localProgress);

    // Boundary crossing → snap currentX to the new segment's target
    // and zero the velocity so the spring doesn't carry inertia from
    // the previous segment into the new one. Both off-canvas endpoints
    // sit beyond the visible frame so the cut isn't seen on screen.
    if (idx !== lastIdx.current) {
      currentX.current = targetX;
      velocityX.current = 0;
      lastIdx.current = idx;
    }

    // Engine direction flip on scroll-direction change.
    const dy = scrollY - lastScrollY.current;
    if (Math.abs(dy) > 0.5) {
      const newFacing = dy < 0 ? Math.PI : 0;
      if (newFacing !== facing.current) {
        facing.current = newFacing;
        trainGroup.current.rotation.y = newFacing;
      }
    }
    lastScrollY.current = scrollY;

    // Critical-damped spring integration. Force = stiffness × offset
    // − damping × velocity. Slightly overdamped so the train glides
    // to a stop with no overshoot. dt clamped to MAX_DT so a single
    // dropped frame can't blow up the integration.
    const dt = Math.min(delta, MAX_DT);
    const offset = targetX - currentX.current;
    const accel = SPRING_STIFFNESS * offset - SPRING_DAMPING * velocityX.current;
    velocityX.current += accel * dt;
    currentX.current += velocityX.current * dt;
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

      {/* Camera fit + dynamic vertical aim. AutoFitOrtho sets both
          camera.position and lookAt each resize so the train is
          anchored near the bottom of the canvas on every aspect.
          No OrbitControls — input is reserved for scrolling. */}
      <AutoFitOrtho groundY={GROUND_Y_OFFSET} />
    </>
  );
}
