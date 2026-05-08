'use client';

import { useThree } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';

// Fits the orthographic camera so a `targetWidth` x `targetHeight`
// rectangle (world units) is visible at mount. Runs ONCE on initial
// mount only — never re-fits on resize or pinch. This way:
//   - Browser pinch/zoom scales the canvas naturally (no fight)
//   - Window resize keeps R3F's default world-to-pixel ratio behaviour
// If the user wants to refit after a real resize, refresh.
//
// Diorama dimensions for fit calculation (centred on world origin):
//   horizontal world extent ≈ 48 (curve x: -24..+24)
//   vertical screen extent  ≈ 22 (track ±9.7 + train height projection)
// Train top adds ~2.7 units of cam-Y above z=-24 — must be in target.
export default function AutoFitOrtho({
  targetWidth = 50,
  targetHeight = 26,
  padding = 0.97,
}) {
  const camera = useThree((s) => s.camera);
  const sizeW = useThree((s) => s.size.width);
  const sizeH = useThree((s) => s.size.height);
  const fittedRef = useRef(false);

  useLayoutEffect(() => {
    if (fittedRef.current) return;
    if (!camera.isOrthographicCamera) return;
    // Wait for a real canvas size — initial flex/layout settle can
    // briefly report tiny or zero dimensions.
    if (sizeW < 100 || sizeH < 100) return;

    const zoom = Math.min(
      (sizeW / targetWidth) * padding,
      (sizeH / targetHeight) * padding
    );
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
    fittedRef.current = true;
  }, [camera, sizeW, sizeH, targetWidth, targetHeight, padding]);

  return null;
}
