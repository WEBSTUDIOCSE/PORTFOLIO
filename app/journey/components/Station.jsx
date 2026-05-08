'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { DRACO_DECODER_PATH } from './glb.js';

// Scene-specific landmark (typically a station). Loads the GLB
// at `url`, applies the transform from scenes.js, and re-grounds
// the model so its bottom sits exactly on Y=0 regardless of how
// the artist authored the origin.
//
// Sizing: pass `targetWidth` (preferred) to auto-fit to a world-X
// width — the GLB is scaled so the longer of its X/Z extents
// matches that width. Fall back to a manual `scale` for fine control.
//
// Shadows are enabled on every mesh so the station drops a shadow
// onto the diorama floor like the train does.

export default function Station({
  url,
  scale = 1,
  targetWidth,
  position = [0, 0, 0],
  rotationY = 0,
  hideMeshes = [],
}) {
  const gltf = useGLTF(url, DRACO_DECODER_PATH);

  const model = useMemo(() => {
    const root = gltf.scene.clone(true);
    root.rotation.y = rotationY;
    root.scale.setScalar(1);
    root.updateMatrixWorld(true);

    // Hide unwanted meshes FIRST. Some GLBs ship with a giant
    // baked-in ground plane or duplicate track geometry; hiding
    // them up-front means they don't dominate the bbox used for
    // auto-scaling.
    root.traverse((obj) => {
      if (obj.isMesh) {
        const shouldHide = hideMeshes.some((pat) =>
          obj.name?.toLowerCase().includes(pat.toLowerCase())
        );
        if (shouldHide) obj.visible = false;
      }
    });

    // Bounding box of VISIBLE geometry only. setFromObject ignores
    // mesh.visible, so we have to walk and union manually.
    const measureVisible = () => {
      const box = new THREE.Box3();
      root.traverse((obj) => {
        if (obj.isMesh && obj.visible) {
          box.union(new THREE.Box3().setFromObject(obj));
        }
      });
      return box;
    };

    // With `targetWidth`, fit the visible model's WORLD-X extent to
    // that width. Camera right vector is (1, 0, 0), so world-X is
    // exactly the on-screen horizontal axis.
    let effectiveScale = scale;
    if (targetWidth && targetWidth > 0) {
      const rawBox = measureVisible();
      const rawSize = new THREE.Vector3();
      rawBox.getSize(rawSize);
      if (rawSize.x > 0) effectiveScale = targetWidth / rawSize.x;
    }
    root.scale.setScalar(effectiveScale);
    root.updateMatrixWorld(true);

    // Re-ground using the visible bbox, so position.y is measured
    // from the lowest VISIBLE point — not from a hidden basement plate.
    const finalBox = measureVisible();
    root.position.set(
      position[0],
      position[1] - finalBox.min.y,
      position[2]
    );

    root.traverse((obj) => {
      if (obj.isMesh && obj.visible) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    return root;
  }, [
    gltf, scale, targetWidth,
    position[0], position[1], position[2],
    rotationY, hideMeshes.join(','),
  ]);

  return <primitive object={model} />;
}
