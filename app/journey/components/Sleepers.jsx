'use client';

import * as THREE from 'three';
import { useMemo, useLayoutEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { TRACK_LENGTH, SLEEPER_SPACING } from './track.js';
import { GLB_PATH, DRACO_DECODER_PATH } from './glb.js';

// One InstancedMesh of the GLB's first Sleeper_* mesh, repeated
// linearly along the X axis at SLEEPER_SPACING intervals.
export default function Sleepers() {
  const gltf = useGLTF(GLB_PATH, DRACO_DECODER_PATH);
  const ref = useRef(null);

  const { geometry, material, count } = useMemo(() => {
    const trackSection = gltf.scene.getObjectByName('TrackSection');
    if (!trackSection) {
      console.error('[Sleepers] "TrackSection" group not found in GLB');
      return { geometry: null, material: null, count: 0 };
    }

    const sleeperMeshes = [];
    trackSection.traverse((obj) => {
      if (obj.isMesh && obj.name.startsWith('Sleeper_')) {
        sleeperMeshes.push(obj);
      }
    });
    if (sleeperMeshes.length === 0) {
      console.error('[Sleepers] No "Sleeper_*" meshes inside TrackSection');
      return { geometry: null, material: null, count: 0 };
    }

    const proto = sleeperMeshes[0];
    const geom = proto.geometry.clone();
    proto.updateWorldMatrix(true, false);
    geom.applyMatrix4(proto.matrixWorld);

    // Orient sleeper so its long horizontal axis (gauge) lies along
    // world Z — perpendicular to our X-axis track.
    geom.computeBoundingBox();
    const size = new THREE.Vector3();
    geom.boundingBox.getSize(size);
    if (size.x > size.z) {
      geom.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 2));
      geom.computeBoundingBox();
    }

    // Recentre: bottom on Y=0, centred on X and Z
    const box = geom.boundingBox;
    const cx = (box.min.x + box.max.x) / 2;
    const cz = (box.min.z + box.max.z) / 2;
    geom.translate(-cx, -box.min.y, -cz);
    geom.computeVertexNormals();

    const mat = Array.isArray(proto.material) ? proto.material[0] : proto.material;
    const n = Math.max(2, Math.floor(TRACK_LENGTH / SLEEPER_SPACING) + 1);

    return { geometry: geom, material: mat, count: n };
  }, [gltf]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh || count === 0) return;

    const matrix = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const x = (t - 0.5) * TRACK_LENGTH;     // -TRACK_LENGTH/2 .. +TRACK_LENGTH/2
      matrix.makeTranslation(x, 0, 0);
      mesh.setMatrixAt(i, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere?.();
  }, [count]);

  if (!geometry || !material || count === 0) return null;

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, count]}
      castShadow
      receiveShadow
    />
  );
}
