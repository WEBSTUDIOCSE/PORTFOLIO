'use client';

import {
  TRACK_LENGTH,
  RAIL_GAUGE,
  RAIL_RADIUS,
  RAIL_HEIGHT_OFFSET,
} from './track.js';

const HALF_GAUGE = RAIL_GAUGE / 2;

// Two parallel rust-brown cylinders running along the world X axis.
// Cylinder default axis is Y, so rotate Z by 90° to lay them flat.
export default function Rails() {
  return (
    <group>
      {[-HALF_GAUGE, +HALF_GAUGE].map((z, i) => (
        <mesh
          key={i}
          position={[0, RAIL_HEIGHT_OFFSET, z]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry
            args={[RAIL_RADIUS, RAIL_RADIUS, TRACK_LENGTH, 16]}
          />
          <meshStandardMaterial
            color="#7a3a1a"
            roughness={0.75}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
