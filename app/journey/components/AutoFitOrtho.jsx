'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

// Fits the orthographic camera so a `targetWidth` x `targetHeight`
// rectangle (world units) is visible. Re-runs on every canvas resize
// so the diorama stays correctly framed across desktop, tablet, and
// mobile orientations.
//
// On tall (portrait/mobile) canvases the auto-fit is width-bound,
// which means the visible vertical world span far exceeds the
// designed `targetHeight`. Without compensation, the train ends up
// floating in the middle of the canvas with empty sky above and
// below. We translate the camera UP along the world Y axis by half
// the excess world-height so the train (which sits near `groundY`)
// stays anchored near the bottom of the visible area on every
// aspect ratio.
// Camera placement constants. Camera always sits at (0, +Y_OFF, +Z_OFF)
// relative to its lookAt target, preserving the original isometric
// elevation across every viewport.
const Y_OFF = 22;
const Z_OFF = 36;
// Foreshortening factor: a 1-unit move in world +Y projects to only
// `ISO_COS` units along the canvas's vertical axis, because the camera
// is tilted. Without this factor the bottom-anchor math overshoots
// (the train ends up floating in the upper half of the canvas).
const ISO_COS = Z_OFF / Math.sqrt(Y_OFF * Y_OFF + Z_OFF * Z_OFF);

export default function AutoFitOrtho({
  targetWidth = 50,
  targetHeight = 26,
  padding = 0.97,
  // World-Y of the train/track group. The camera aims so this line
  // sits near the bottom of the visible canvas, regardless of the
  // viewport aspect.
  groundY = -14.8,
  // Breathing room (in world-Y units) between the train/track and
  // the canvas bottom edge. ~1 world-Y unit = ~22px on desktop, just
  // enough for the rails + sleepers to show a visible strip below
  // the train without leaving an empty sky band above.
  bottomMargin = 1,
}) {
  const camera = useThree((s) => s.camera);
  const sizeW = useThree((s) => s.size.width);
  const sizeH = useThree((s) => s.size.height);

  const needsUpdate = useRef(true);

  useEffect(() => {
    needsUpdate.current = true;
  }, [camera, sizeW, sizeH, targetWidth, targetHeight, padding, groundY, bottomMargin]);

  useFrame(() => {
    if (!needsUpdate.current) return;
    if (!camera.isOrthographicCamera) return;
    if (sizeW < 100 || sizeH < 100) return;

    const zoom = Math.min(
      (sizeW / targetWidth) * padding,
      (sizeH / targetHeight) * padding
    );
    camera.zoom = zoom;

    // Visible canvas height projected back into world-Y units. Need
    // to divide by ISO_COS because the camera's tilt means a vertical
    // canvas pixel covers more than one camera-space Y unit of world.
    const visibleWorldY = sizeH / (zoom * ISO_COS);
    // Anchor groundY at the bottom of the canvas (with a small margin),
    // and shift the camera up by the same amount so the iso angle
    // stays fixed.
    const targetY = groundY + visibleWorldY / 2 - bottomMargin;
    camera.position.set(0, targetY + Y_OFF, Z_OFF);
    camera.lookAt(0, targetY, 0);
    camera.updateProjectionMatrix();

    needsUpdate.current = false;
  });

  return null;
}
