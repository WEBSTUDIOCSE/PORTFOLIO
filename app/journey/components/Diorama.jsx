'use client';

import { OrbitControls } from '@react-three/drei';
import Rails from './Rails.jsx';
import Sleepers from './Sleepers.jsx';
import Train from './Train.jsx';
import CardBackdrop from './CardBackdrop.jsx';
import AutoFitOrtho from './AutoFitOrtho.jsx';

// Image aspect ratios — divide width by these to get the matching
// plane height in world units.
//   mountains_bg.png   1024×254  → 4.03:1
//   village_bg.png     2080×512  → 4.06:1
const MOUNTAINS_URL = '/assets/mountains_bg.png?v=3';
const VILLAGE_URL   = '/assets/village_bg.png?v=1';

// Mountains: vertical card behind the train, faces the camera.
const MOUNTAINS_W = 60;
const MOUNTAINS_H = MOUNTAINS_W / 4.03;

// Village: horizontal "ground" card lying flat in front of the train.
// The PNG has ~20% beige padding at the top — crop it via texture so
// only the village content fills the plane (avoids the white gap
// between the train and the village foreground).
//
// Effective image aspect after crop = 4.06 / (1 − 0.20) = 5.075.
// For matched screen aspect on a horizontal plane (cam_up.z = 0.594):
// plane_W = 5.075 × plane_D × 0.594 = 3.015 × plane_D.
const VILLAGE_CROP_TOP = 0.20;
const VILLAGE_D = 22;
const VILLAGE_W = 3.015 * VILLAGE_D;   // ≈ 66.3

export default function Diorama() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <hemisphereLight args={[0xfff5e0, 0xb8a98a, 0.7]} />
      <directionalLight
        position={[18, 28, 14]}
        intensity={1.5}
        color={0xfff0d0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-12, 10, -8]}
        intensity={0.35}
        color={0xc8d8e8}
      />

      {/* Top card — mountains above the train. Position Y = 2.7
          puts the card's bottom edge at cam_Y ≈ 0.65 — exactly at
          the back rail's top edge, so the mountains meet the track
          with no visible sky gap. The card's top edge clips ~4% of
          sky off the screen, which is acceptable (sky-blue blends
          with the canvas background). */}
      <CardBackdrop
        url={MOUNTAINS_URL}
        position={[0, 2.7, -10]}
        width={MOUNTAINS_W}
        height={MOUNTAINS_H}
      />

      {/* Bottom card — village laid FLAT. Top edge starts at world
          Z=1.5 (just past the front rail at Z=+0.84) so the village
          content begins clearly below the rails, with no overlap. */}
      <CardBackdrop
        url={VILLAGE_URL}
        position={[0, 0, 1.5 + VILLAGE_D / 2]}
        width={VILLAGE_W}
        height={VILLAGE_D}
        rotationX={-Math.PI / 2}
        cropTop={VILLAGE_CROP_TOP}
      />

      {/* Transparent shadow-catcher floor — train shadow falls on it,
          but the floor itself is invisible. */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.001} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial opacity={0.18} />
      </mesh>

      <Rails />
      <Sleepers />
      <Train />

      <AutoFitOrtho />

      <OrbitControls
        target={[0, 0, 0]}
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
      />
    </>
  );
}
