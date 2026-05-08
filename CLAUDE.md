@AGENTS.md

# WAP-7 Journey Page — Project Context

> **Read this file first** before changing `/journey`. Architectural decisions, current state, and build plan.

---

## The Vision

`/journey` is a hero interactive 3D experience for [saurabhjadhav.in](https://saurabhjadhav.in). A miniature toy-railway diorama where a stylized Indian Railways **WAP-7 locomotive** (personalised as `सौरभ जाधव / SAURABH JADHAV — SJ-01 PORTFOLIO EXPRESS`) travels along a track. Each station along the journey reveals a chapter of the developer's career story.

**Aesthetic**: painterly miniature diorama — Studio Ghibli meets architectural maquette. Konkan Railway in golden hour.

**Interaction model**: curated, not interactive. The user scrubs the train (scroll / prev / next / play) but cannot rotate the camera. One strong creative direction, fully committed.

---

## Current State (minimal — 2026-05-08)

The scene has been **stripped to bare essentials** after several iterations of scenery experiments. Currently:

| Element | Status |
|---|---|
| **WAP-7 train** | Loaded from `scene.glb`, scaled 0.65×, sits at world origin (curve t=0.5), faces +X (screen right) |
| **Procedural rails** | Two rust-brown TubeGeometry tubes from `curve.js` |
| **Procedural sleepers** | InstancedMesh from `Sleeper_*` prototype in `scene.glb`, curvature-aware spacing (0.42m base) |
| **Track shape** | **Single straight line** along world +X axis (no curves, no switchback) |
| **Camera** | Orthographic, position `[0, 28, 38]`, target `[0, 0, 0]`, ~30° iso elevation |
| **Camera fit** | `AutoFitOrtho` — fits a 60×26 world rect to the canvas once on initial mount |
| **Lighting** | Ambient + hemisphere + warm key (with shadow casting) + cool fill |
| **Background** | Sky-blue canvas (`#bfd8e8`), transparent shadow-catcher floor so the train still casts a shadow |
| **Layout** | Single viewport, fixed canvas, no scroll spacer |

What's deliberately NOT in the scene right now:
- ~~Ground / grass / tufts~~
- ~~Landscape props (palms, hills, houses, paddy, well)~~
- ~~Switchback curve / U-turns~~
- ~~Two-screen extension~~
- ~~Scroll-driven camera~~
- ~~Story overlays / station markers / controls bar~~

These will come back in later sessions. The architecture for each was working at one point and is preserved in git history.

---

## Architecture

```
app/journey/
├── page.jsx                  Server entry, exports metadata
├── JourneyClient.jsx         "use client", mount-gate, fixed Canvas
└── components/
    ├── glb.js                GLB_PATH + DRACO_DECODER_PATH + GLB_VERSION
    ├── curve.js              Straight-track points + RAIL/SLEEPER constants
    ├── Train.jsx             Loads scene.glb → Locomotive group, scales 0.65, places at curve t=0.5
    ├── Rails.jsx             TubeGeometry rails (rust-brown, 800 segments × 12 radial)
    ├── Sleepers.jsx          InstancedMesh sleepers, curvature-aware spacing
    ├── Diorama.jsx           Lights + shadow plane + train + rails + sleepers + AutoFit + OrbitControls
    └── AutoFitOrtho.jsx      Fit-once-on-mount orthographic zoom

public/models/
└── scene.glb                 645 KB, Draco level 6, embeds Locomotive group + Sleeper_* prototype
```

### Coordinate system
- **Y is up** (three.js convention). Ground at `Y=0`, rail surface at `Y=0.22`, train top ~`Y=3` after 0.65 scale
- **X**: left→right. Track spans `X = -30 to +30`, train sits centred at `X=0`
- **Z**: forward/back. Track is at `Z=0`, train at `Z=0`
- Camera at `(0, 28, 38)` looking at `(0, 0, 0)`. Camera right = `(1, 0, 0)` exactly, so world-horizontal lines render screen-horizontal

---

## Locked Decisions (do not revisit without discussion)

1. **Camera locked** — no orbit, no pan, no zoom. OrbitControls is in the tree but everything is `false`
2. **Orthographic projection** — straight track stays visually straight; perspective convergence introduced "tilt" feel
3. **Camera and target both at X=0** — preserves the perfect screen-horizontal projection of world +X
4. **Train scale 0.65** — reads as a model train inside a tabletop diorama
5. **Procedural rails (TubeGeometry from curve)** — not the rigid GLB rails (those don't bend)
6. **Sleeper spacing curvature-aware** — straight track gives constant 0.42m; if curves return, inner-rail arc-length stays uniform
7. **`scene.glb` provides train + sleeper prototype only** — its own track is ignored
8. **`GLB_VERSION` must be bumped manually** when `scene.glb` is replaced (cache-busting). Current = `'6'`
9. **Branding is correct as-is** — `सौरभ जाधव / SAURABH JADHAV / SJ-01 PORTFOLIO EXPRESS`. Don't change
10. **No `next/dynamic({ ssr: false })` in Server Components** — Next 16 rejects. Mount-gate via `useState(mounted)` in `JourneyClient.jsx`

---

## Build Plan — Next Sessions

### Session 1 — Train animation
- Wire scroll OR play/pause buttons to drive train progress along the curve (0..1)
- Wheel rotation when train moves (`Wheel_B*_a*_*` meshes inside the GLB)

### Session 2 — Curves and stations (when ready)
- Re-introduce the switchback shape (5 stations at progress points along an S-curve)
- Story overlay panels at each station (Framer Motion DOM)

### Session 3 — Background and atmosphere
- Pick ONE direction:
  - AI-generated Konkan landscape image as a backdrop plane (parked plan)
  - OR procedural ground + scattered AI-generated GLB props (each prop generated separately and instanced)
- Match the directional light direction to whatever backdrop is chosen
- Add receive-shadow to the ground / backdrop

### Session 4 — Mobile + ship
- Vertical scroll cards, no 3D
- V1 landing page at `/`
- Performance pass: gltf-transform, preload on hover, Lighthouse audit
- Hook into `saurabhjadhav.in` deployment

---

## Workflow Conventions

### Cache-busting

When `scene.glb` is replaced:
1. Open [glb.js](app/journey/components/glb.js)
2. Bump `GLB_VERSION` (e.g. `'6'` → `'7'`)
3. Commit + deploy

### Adding scenery back

The proven workflow from earlier sessions:
1. Generate a single-prop GLB via text-to-3D (Tripo / Meshy / etc.)
2. Save to `public/models/landscape_exports/<name>.glb`
3. Add to a `SCENERY_ASSETS` map in `glb.js`
4. Use a `ScatteredAsset` component (config-driven `placements` + `sizeMode`) — pattern is documented in git history under `Landscape.jsx`
5. Bump `GLB_VERSION` and refresh

### Reference target sizes (for when scenery returns)

Train is the reference: ~13m long, ~3m tall in this diorama.
- A coconut palm at 6m tall reads as ~2× train height — correct silhouette
- A small hill at 7m wide reads as a landscape prop, not a feature
- A house at 4m wide reads as a small village dwelling

Pick `targetHeight` for tall narrow things, `maxFootprint` for wide flat things.

---

## Tech Stack

- **Framework**: Next.js 16 (app router), React 19
- **3D**: three.js `^0.184`, @react-three/fiber `^9.6`, @react-three/drei `^10.7`
- **Loaders**: drei `useGLTF` (auto-wires DRACOLoader when given a decoder path)
- **Hosting**: Vercel, deploy from `main`
- **Domain**: saurabhjadhav.in

---

## Branch / Deployment

- Active branch: `feature/journey`
- `main` = production = `https://saurabhjadhav.in`
- `uat` = staging = Vercel preview
- Scripts in `scripts/` automate deploys (see [scripts/imp.txt](scripts/imp.txt))

Production deploys amend the commit author to `WEBSTUDIOCSE <saurabhjadhav.webstudio@gmail.com>` and force-push (Vercel team author requirement).

---

## References

- Source Blender files: `C:\Users\Saura\Documents\blender\train_miniature\`
- Domain: [saurabhjadhav.in](https://saurabhjadhav.in)
- Vercel project: `saurabh-jadhavs-projects-3933d523/portfolio`
- Owner: Saurabh Jadhav (Mumbai/Pune, India)
