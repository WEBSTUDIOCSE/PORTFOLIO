// Scene configuration. Add a new entry to SCENES to add a new
// screen — the page automatically grows by one viewport per scene
// and the train passes through them in order on scroll.
//
// Optional per-scene `station` block — pulls in a GLB landmark
// that sits in the diorama only while this scene is the active one:
//   url       — GLB path (run through sceneAsset() for cache-bust)
//   scale     — uniform scale applied to the loaded model
//   position  — [x, y, z] world placement
//   rotationY — rotation around Y in radians (e.g. -Math.PI / 2)

import { sceneAsset } from './glb.js';

export const SCENES = [
  {
    id: 'origin',
    title: 'The Origin',
    topImage: '/assets/scene1_top.png?v=1',
    topAspect: 4.03,            // 1024 / 254
    bottomImage: '/assets/scene1_bottom.png?v=1',
    bottomAspect: 4.06,         // 2080 / 512
    bottomCropTop: 0.20,        // beige padding at top of source PNG
  },
  {
    id: 'coast',
    title: 'The Coast',
    topImage: '/assets/scene2_top.png?v=1',
    topAspect: 1.832,           // 1024 / 559 — narrower (16:9 source)
    bottomImage: '/assets/scene2_bottom.png?v=1',
    bottomAspect: 1.792,        // 2752 / 1536
    bottomCropTop: 0,
  },
  {
    // Scene 3 — Origin Station. Station fills section A; a sandy
    // ground card covers section C; story board overlay sits on
    // top of the ground card.
    id: 'origin-station',
    title: 'The Origin Station',
    bottomColor: '#d4c4a8',     // sandy concrete tone for section C
    station: {
      url: sceneAsset('/models/station_origin.glb'),
      hideMeshes: [
        'Background_Ground',
        'Track_Ballast',
        'Rail_',
        'Sleeper_',
      ],
      targetWidth: 60,
      // Pulled forward from -7 to -4 so the station's base sits
      // closer to the rails, closing the visible sky gap between
      // the train and the platform foundation.
      position: [0, 0, -4],
      rotationY: 0,
    },
    storyBoard: {
      title: 'The Origin',
      body: 'Where every long journey begins — a small station, a curious mind, the hum of an engine pulling out of the platform for the very first time.',
    },
  },
];

// Train motion. The train enters at the extreme left edge of the
// frame (engine rear off-screen) and travels rightward as the user
// scrolls. Leaves room past the start for a future coach to be
// pulled in behind the engine. Smoothstep easing in Diorama softens
// arrival/departure pacing.
export const TRAIN_X_START = -30;
export const TRAIN_X_END   = +20;

// Top backdrop card (vertical, face-camera). The plane width per
// scene = TOP_CARD_HEIGHT × scene.topAspect, computed in Diorama.
// Position Y is tuned so the plane's bottom edge projects to
// cam_Y ≈ 0.65 (just at the back-rail top — no gap, no overlap).
export const TOP_CARD_HEIGHT = 14.89;
export const TOP_CARD_POSITION = [0, 2.67, -10];

// Bottom backdrop card (horizontal "ground" past the front rail).
export const BOTTOM_CARD_DEPTH    = 22;
export const BOTTOM_CARD_Z_NEAR   = 1.5;     // top edge just past front rail
export const BOTTOM_CARD_Z_CENTER = BOTTOM_CARD_Z_NEAR + BOTTOM_CARD_DEPTH / 2;
