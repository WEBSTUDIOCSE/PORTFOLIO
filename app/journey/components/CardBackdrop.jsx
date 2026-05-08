'use client';

import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// A "pop-up book" card — a flat plane carrying an image, tilted to
// face the locked orthographic camera at [0, 28, 38] looking at
// [0, 0, 0]. Used for the mountain backdrop above the train and the
// village backdrop below.
//
// Props:
//   url       — texture path (with cache-busting query if needed)
//   position  — [x, y, z] in world space
//   width     — plane width in world units
//   height    — plane "height" — local Y dimension. For face-camera
//               cards this is screen height; for horizontal cards
//               this is depth in Z. Match the image aspect to avoid
//               stretching.
//   rotationX — plane tilt around X. Default -0.633 rad faces the
//               camera (vertical card). -Math.PI/2 lies flat
//               (horizontal "ground" card with top-down image).
//   cropTop   — fraction (0..1) of the image to skip from the top.
//               Useful when the source PNG has padding/sky at top.

const DEFAULT_ROTATION_X = -0.633;     // ≈ -atan2(0.591, 0.806) — face camera

export default function CardBackdrop({
  url,
  position,
  width,
  height,
  rotationX = DEFAULT_ROTATION_X,
  cropTop = 0,
}) {
  const texture = useTexture(url);
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;

  // Skip the top `cropTop` of the texture by sampling only v ∈ [0, 1−cropTop].
  // Each card has its own URL so this doesn't affect any other texture.
  if (cropTop > 0) {
    texture.repeat.set(1, 1 - cropTop);
    texture.offset.set(0, 0);
  }

  return (
    <mesh
      position={position}
      rotation-x={rotationX}
      renderOrder={-1}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        depthWrite={false}
        depthTest={false}
        transparent={false}
      />
    </mesh>
  );
}
