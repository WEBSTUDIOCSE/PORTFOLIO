'use client';

import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Rails from './Rails.jsx';
import Sleepers from './Sleepers.jsx';
import Train from './Train.jsx';
import Station from './Station.jsx';
import StoryBoard from './StoryBoard.jsx';
import CardBackdrop from './CardBackdrop.jsx';
import AutoFitOrtho from './AutoFitOrtho.jsx';
import {
  SCENES,
  TRAIN_X_START,
  TRAIN_X_END,
  TOP_CARD_HEIGHT,
  TOP_CARD_POSITION,
  BOTTOM_CARD_DEPTH,
  BOTTOM_CARD_Z_CENTER,
} from './scenes.js';

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
// Smoothstep — soft acceleration/deceleration at scene boundaries
// for a more natural train arrival/departure feel.
const smoothstep = (t) => t * t * (3 - 2 * t);

// Hook: tracks continuous scroll progress in viewport units.
// 0 at top of page, 1 at end of scene 0, 2 at end of scene 1, etc.
// We derive both the integer scene index and the in-scene progress
// from this so card crossfades and train motion stay in sync.
function useScrollProgress() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      setT(window.scrollY / window.innerHeight);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return t;
}

// Crossfade window. The next scene fades in over the last ~30% of the
// current scene's scroll and reaches full opacity slightly BEFORE the
// integer scene index actually flips at progress=1.0 — so the underlying
// React swap happens while the next scene is already drawn opaque on top,
// making the swap invisible.
const FADE_START = 0.65;
const FADE_END   = 0.95;
function computeFadeT(sceneProgress) {
  if (sceneProgress <= FADE_START) return 0;
  if (sceneProgress >= FADE_END) return 1;
  const u = (sceneProgress - FADE_START) / (FADE_END - FADE_START);
  return u * u * (3 - 2 * u);
}

// Plane sizes are CONSTANT across all scenes — derived from scene 1's
// natural fit (4:1 panoramic + 20% top crop on the village). Scenes
// whose images have a different aspect get cover-fit cropped inside
// CardBackdrop so the planes always fill the screen consistently.
const SCENE1_TOP_ASPECT = 4.03;
const SCENE1_BOTTOM_EFFECTIVE_ASPECT = 4.06 / 0.80;   // = 5.075 after cropTop=0.20
const TOP_W    = 14.89 * SCENE1_TOP_ASPECT;            // = 60.0
const BOTTOM_W = SCENE1_BOTTOM_EFFECTIVE_ASPECT * 22 * 0.594;  // = 66.3

export default function Diorama() {
  const scrollT = useScrollProgress();
  const sceneIdx = Math.min(
    SCENES.length - 1,
    Math.max(0, Math.floor(scrollT))
  );
  const sceneProgress = clamp01(scrollT - sceneIdx);
  const scene = SCENES[sceneIdx];
  const isLast = sceneIdx === SCENES.length - 1;
  const nextScene = isLast ? null : SCENES[sceneIdx + 1];
  const fadeT = isLast ? 0 : computeFadeT(sceneProgress);
  const trainGroup = useRef(null);

  // Train glides between TRAIN_X_START and TRAIN_X_END as the user
  // scrolls through the current scene's viewport. Updated each frame
  // for smooth motion (not React state — no re-renders).
  useFrame(() => {
    if (!trainGroup.current || typeof window === 'undefined') return;
    const t = window.scrollY / window.innerHeight;
    const localProgress = clamp01(t - sceneIdx);
    const eased = smoothstep(localProgress);
    trainGroup.current.position.x = lerp(TRAIN_X_START, TRAIN_X_END, eased);
  });

  return (
    <>
      <color attach="background" args={['#bfd8e8']} />

      <ambientLight intensity={0.15} />
      <hemisphereLight args={[0xfff5e0, 0xb8a98a, 0.7]} />
      <directionalLight
        position={[18, 28, 14]}
        intensity={1.5}
        color={0xfff0d0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-12, 10, -8]}
        intensity={0.35}
        color={0xc8d8e8}
      />

      {/* Current scene cards — drawn at the base layer (renderOrder=-2).
          Cards are skipped entirely when a scene declares no image, so
          the Canvas's clear color shows through (useful for setup scenes
          where the 3D model is the focal element). */}
      {scene.topImage && (
        <CardBackdrop
          key={`top-${scene.id}`}
          url={scene.topImage}
          position={TOP_CARD_POSITION}
          width={TOP_W}
          height={TOP_CARD_HEIGHT}
          imageAspect={scene.topAspect}
          renderOrder={-2}
        />
      )}
      {scene.bottomImage && (
        <CardBackdrop
          key={`bot-${scene.id}`}
          url={scene.bottomImage}
          position={[0, 0, BOTTOM_CARD_Z_CENTER]}
          width={BOTTOM_W}
          height={BOTTOM_CARD_DEPTH}
          rotationX={-Math.PI / 2}
          imageAspect={scene.bottomAspect}
          cropTop={scene.bottomCropTop}
          renderOrder={-2}
        />
      )}

      {/* Solid-color ground for scenes that don't ship a bottom
          image (e.g. the station scene). Same plane geometry as
          the bottom card, but a flat material instead of a texture. */}
      {!scene.bottomImage && scene.bottomColor && (
        <mesh
          key={`bot-color-${scene.id}`}
          position={[0, 0, BOTTOM_CARD_Z_CENTER]}
          rotation-x={-Math.PI / 2}
          renderOrder={-2}
        >
          <planeGeometry args={[BOTTOM_W, BOTTOM_CARD_DEPTH]} />
          <meshBasicMaterial
            color={scene.bottomColor}
            toneMapped={false}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      )}

      {/* Next scene — fades in on top during the last 30% of scroll
          (renderOrder=-1 so it sits above the current scene cards). */}
      {nextScene && fadeT > 0 && nextScene.topImage && (
        <CardBackdrop
          key={`top-${nextScene.id}-next`}
          url={nextScene.topImage}
          position={TOP_CARD_POSITION}
          width={TOP_W}
          height={TOP_CARD_HEIGHT}
          imageAspect={nextScene.topAspect}
          opacity={fadeT}
          renderOrder={-1}
        />
      )}
      {nextScene && fadeT > 0 && nextScene.bottomImage && (
        <CardBackdrop
          key={`bot-${nextScene.id}-next`}
          url={nextScene.bottomImage}
          position={[0, 0, BOTTOM_CARD_Z_CENTER]}
          width={BOTTOM_W}
          height={BOTTOM_CARD_DEPTH}
          rotationX={-Math.PI / 2}
          imageAspect={nextScene.bottomAspect}
          cropTop={nextScene.bottomCropTop}
          opacity={fadeT}
          renderOrder={-1}
        />
      )}

      {/* Transparent shadow-catcher floor */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.001} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial opacity={0.18} />
      </mesh>

      <Rails />
      <Sleepers />

      {/* Per-scene station/landmark. Only rendered while the scene
          that declared it is the active one; transform comes from
          the scene's `station` block in scenes.js. */}
      {scene.station && (
        <Station
          key={`station-${scene.id}`}
          url={scene.station.url}
          scale={scene.station.scale}
          targetWidth={scene.station.targetWidth}
          hideMeshes={scene.station.hideMeshes}
          position={scene.station.position}
          rotationY={scene.station.rotationY}
        />
      )}

      {/* Per-scene story board (HTML overlay anchored in world
          space). Renders only when the scene defines a storyBoard
          block — title + body markdown text. */}
      {scene.storyBoard && (
        <StoryBoard
          key={`story-${scene.id}`}
          title={scene.storyBoard.title}
          body={scene.storyBoard.body}
        />
      )}

      {/* Train wrapped in a group so we can translate it without
          touching the locomotive's internal placement. */}
      <group ref={trainGroup}>
        <Train />
      </group>

      <AutoFitOrtho />

      <OrbitControls
        target={[0, 0, 0]}
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
      />
    </>
  );
}
