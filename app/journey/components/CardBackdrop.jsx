'use client';

import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// A "pop-up book" image card. Tilted to face the locked orthographic
// camera (default) or laid flat as a horizontal ground card.
//
// Cover-fit logic — when imageAspect doesn't match the plane's screen
// aspect, the texture is centred and cropped (NOT stretched) so the
// plane is always fully filled and the image's natural proportions
// are preserved. Combined with cropTop (skip an optional padding
// strip at the top of the source image).
//
// Props:
//   url         — texture path
//   position    — [x, y, z] in world space
//   width       — plane width in world units
//   height      — plane height (local Y) in world units
//   imageAspect — source image's natural aspect ratio (W:H)
//   rotationX   — plane tilt around X. -0.633 (default) faces camera;
//                 -Math.PI/2 lies flat (horizontal ground card).
//   cropTop     — fraction (0..1) of source image to skip from the
//                 top (e.g. 0.20 to skip beige padding).

const DEFAULT_ROTATION_X = -0.633;

// Camera-up Z component for our locked camera at [0, 28, 38].
// Used to convert horizontal-plane local Y to projected screen Y.
const CAM_UP_Z = 0.594;

function computeTextureTransform({ planeAspect, imageAspect, cropTop }) {
  // Default: no transform
  let repeatX = 1, repeatY = 1, offsetX = 0, offsetY = 0;
  if (!imageAspect || imageAspect <= 0) {
    return { repeatX, repeatY, offsetX, offsetY };
  }

  // Apply cropTop first — limits visible V range to [0, 1 - cropTop]
  const visibleVStart = 0;
  const visibleVSize = Math.max(0.001, 1 - cropTop);
  // Effective aspect of the visible portion (taller after cropTop)
  const visibleAspect = imageAspect / visibleVSize;

  if (planeAspect > visibleAspect) {
    // Plane wider than image — letter-box vertically, take centre
    const cropFactor = visibleAspect / planeAspect;
    const newSize = visibleVSize * cropFactor;
    repeatY = newSize;
    offsetY = visibleVStart + (visibleVSize - newSize) / 2;
  } else if (planeAspect < visibleAspect) {
    // Plane narrower than image — pillar-box horizontally, centred
    repeatX = planeAspect / visibleAspect;
    offsetX = (1 - repeatX) / 2;
    repeatY = visibleVSize;
    offsetY = visibleVStart;
  } else {
    // Exact match
    repeatY = visibleVSize;
    offsetY = visibleVStart;
  }
  return { repeatX, repeatY, offsetX, offsetY };
}

export default function CardBackdrop({
  url,
  position,
  width,
  height,
  imageAspect,
  rotationX = DEFAULT_ROTATION_X,
  cropTop = 0,
  opacity = 1,
  renderOrder = -2,
}) {
  const texture = useTexture(url);
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;

  // Effective screen aspect of the plane. For face-camera tilt, the
  // plane projects 1:1 (W/H). For horizontal tilt (-π/2), local Y is
  // foreshortened by cam-up-Z (0.594).
  const isHorizontal = Math.abs(rotationX - (-Math.PI / 2)) < 0.1;
  const planeAspect = isHorizontal
    ? width / (height * CAM_UP_Z)
    : width / height;

  const { repeatX, repeatY, offsetX, offsetY } = computeTextureTransform({
    planeAspect,
    imageAspect,
    cropTop,
  });
  texture.repeat.set(repeatX, repeatY);
  texture.offset.set(offsetX, offsetY);

  return (
    <mesh position={position} rotation-x={rotationX} renderOrder={renderOrder}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        depthWrite={false}
        depthTest={false}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}
