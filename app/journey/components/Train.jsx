'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { RAIL_HEIGHT_OFFSET, RAIL_RADIUS } from './track.js';
import { GLB_PATH, DRACO_DECODER_PATH } from './glb.js';

// Locomotive scaled to read as a model train (~13m long), placed at
// world origin with body running along the X axis. Wheels rest on
// the rail surface.
const TRAIN_SCALE = 0.65;

export default function Train() {
  const gltf = useGLTF(GLB_PATH, DRACO_DECODER_PATH);

  const locomotive = useMemo(() => {
    const source = gltf.scene.getObjectByName('Locomotive');
    if (!source) {
      console.error('[Train] "Locomotive" group not found in GLB');
      return null;
    }

    const loco = source.clone(true);
    loco.scale.setScalar(TRAIN_SCALE);
    loco.updateMatrixWorld(true);

    // If the model's long axis is Z (rather than X), rotate -90°
    // around Y so the body lines up with the world X-axis track.
    let bbox = new THREE.Box3().setFromObject(loco);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    if (size.z > size.x) {
      loco.rotation.y = -Math.PI / 2;
      loco.updateMatrixWorld(true);
      bbox = new THREE.Box3().setFromObject(loco);
    }

    // Recentre on origin horizontally
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    loco.position.x -= center.x;
    loco.position.z -= center.z;

    // Y-shift so wheels sit exactly on the rail surface
    const wheels = loco.getObjectByName('Wheels');
    if (wheels) {
      loco.updateMatrixWorld(true);
      const wheelBox = new THREE.Box3().setFromObject(wheels);
      const targetY = RAIL_HEIGHT_OFFSET + RAIL_RADIUS;
      loco.position.y += targetY - wheelBox.min.y;
    } else {
      console.warn('[Train] "Wheels" group not found — skipping Y-shift');
    }

    // Enable shadow casting / receiving on every mesh
    loco.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    return loco;
  }, [gltf]);

  if (!locomotive) return null;
  return <primitive object={locomotive} />;
}
