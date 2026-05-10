'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { RAIL_HEIGHT_OFFSET, RAIL_RADIUS } from './track.js';
import { GLB_PATH, DRACO_DECODER_PATH } from './glb.js';

const TRAIN_SCALE = 0.65;

// Top-level group / mesh names that belong to the track and ground
// infrastructure (rails, sleepers, ballast, fasteners) — must NOT be
// pulled into the train assembly. Our own Rails.jsx + Sleepers.jsx
// renders the static track separately.
const TRACK_NAME = /^(track|sleeper_|ballast|background_ground|rail(head|foot|web|tie)_|fastener_)/i;

// Locomotive + coach(es). Pulls every top-level group out of the GLB
// EXCEPT the track infrastructure, combines them into a single
// assembly, scales/centers/grounds it so the lowest wheel sits on
// the rail surface. Handles arbitrary train compositions (engine
// alone, engine + coach, engine + multiple coaches).
export default function Train() {
  const gltf = useGLTF(GLB_PATH, DRACO_DECODER_PATH);

  const train = useMemo(() => {
    const assembly = new THREE.Group();

    gltf.scene.children.forEach((child) => {
      if (!TRACK_NAME.test(child.name || '')) {
        assembly.add(child.clone(true));
      }
    });

    if (assembly.children.length === 0) {
      console.error('[Train] No non-track top-level groups in GLB');
      return null;
    }

    assembly.scale.setScalar(TRAIN_SCALE);
    assembly.updateMatrixWorld(true);

    // If the assembly's long axis is Z (instead of X), rotate -90°
    // around Y so the body lines up along the X-axis track.
    let bbox = new THREE.Box3().setFromObject(assembly);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    if (size.z > size.x) {
      assembly.rotation.y = -Math.PI / 2;
      assembly.updateMatrixWorld(true);
      bbox = new THREE.Box3().setFromObject(assembly);
    }

    // Recentre on world origin (X and Z).
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    assembly.position.x -= center.x;
    assembly.position.z -= center.z;

    // Lift so the lowest visible point lands on the rail surface.
    assembly.updateMatrixWorld(true);
    bbox = new THREE.Box3().setFromObject(assembly);
    const targetY = RAIL_HEIGHT_OFFSET + RAIL_RADIUS;
    assembly.position.y += targetY - bbox.min.y;

    assembly.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    return assembly;
  }, [gltf]);

  if (!train) return null;
  return <primitive object={train} />;
}
