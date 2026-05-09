'use client';

import { useThree } from '@react-three/fiber';
import { useLayoutEffect } from 'react';

// Fits the orthographic camera so a `targetWidth` x `targetHeight`
// rectangle (world units) is visible. Re-runs on every canvas resize
// so the diorama stays correctly framed across desktop, tablet, and
// mobile orientations — no manual refresh needed when the browser
// window changes size or the device rotates.
export default function AutoFitOrtho({
  targetWidth = 50,
  targetHeight = 26,
  padding = 0.97,
}) {
  const camera = useThree((s) => s.camera);
  const sizeW = useThree((s) => s.size.width);
  const sizeH = useThree((s) => s.size.height);

  useLayoutEffect(() => {
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
  }, [camera, sizeW, sizeH, targetWidth, targetHeight, padding]);

  return null;
}
