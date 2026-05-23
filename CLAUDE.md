@AGENTS.md

# saurabhjadhav.in — Portfolio

> **Read this file first.** It's the project-wide context: what the site is, how it's
> structured, the load-bearing subsystems, and the deploy workflow. The `/journey` 3D
> experience has its own deep-dive section near the bottom.

---

## What this is

The personal portfolio of **Saurabh Jadhav** — Frontend & AI Engineer, Mumbai. A
Next.js 16 / React 19 site at [saurabhjadhav.in](https://saurabhjadhav.in). Two distinct
experiences live side by side:

1. **The portfolio** (`/`) — a scroll-driven editorial landing page with a canvas-scrubbed
   hero, then work / about / experience / press / now / contact sections.
2. **`/journey`** — a curated 3D toy-railway diorama. A stylised Indian Railways **WAP-7
   locomotive** (`सौरभ जाधव / SAURABH JADHAV — SJ-01 PORTFOLIO EXPRESS`) glides through five
   stations, each a chapter of the career story. Reached from the home hero CTA and the
   floating Ticket-Checker widget.

**Aesthetic**: considered, editorial, hand-annotated. The journey leans painterly
miniature-diorama — Studio Ghibli meets architectural maquette, Konkan Railway at golden
hour.

---

## Tech Stack

- **Framework**: Next.js 16 (app router, RSC), React 19
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`), design tokens + dark mode in `app/globals.css`
- **Fonts**: 8 Google fonts via `next/font` (Geist, Geist Mono, Fraunces display, Tiro Devanagari, Caveat, Dancing Script, Permanent Marker, Architects Daughter)
- **3D** (`/journey` only): three.js `^0.184`, @react-three/fiber `^9.6`, @react-three/drei `^10.7`, Draco-compressed GLB
- **Backend**: Firebase (client + admin SDK) for Firestore/Storage/Analytics; Resend for transactional email; Server Actions for forms
- **Validation**: Zod `^4`
- **Diagrams**: Mermaid (dynamic-imported on `/work/[slug]`)
- **Hosting**: Vercel, production deploys from `main`
- **Language**: TypeScript everywhere except the `/journey` 3D components (`.jsx`)

---

## Site map

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Landing — section components in order |
| `/journey` | `app/journey/page.jsx` → `JourneyClient.jsx` | 3D diorama, full-bleed, no SiteNav |
| `/work/[slug]` | `app/work/[slug]/page.tsx` | Project detail; data from `lib/projects.ts`; Mermaid arch diagram |
| `/writing` + `/writing/[slug]` | `app/writing/…` | Short posts; data from `lib/writing.ts` |
| `/style-guide` | `app/style-guide/page.tsx` | Design-token / component reference |
| — | `app/opengraph-image.tsx`, `app/work|writing/[slug]/opengraph-image.tsx` | Dynamic OG images per route |
| — | `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx` | SEO + 404 |

Server Actions live in `app/actions/` (`contact.ts`, `resume.ts`).

---

## Architecture

```
app/
├── layout.tsx            Root: fonts, ThemeProvider, SiteNav, JSON-LD @graph, no-flash theme script, Firebase Analytics
├── page.tsx              Home — composes the section components below
├── globals.css           Tailwind v4 + design tokens + light/dark + `html { scroll-behavior: smooth }`
├── actions/              "use server" — contact + resume form handlers (Zod → Resend + Firestore)
├── work/[slug]/          Project detail pages + per-page OG image
├── writing/             Writing index + [slug] detail + per-page OG image
└── journey/              The 3D experience (see deep-dive below)

components/
├── site-nav.tsx          Floating pill nav. Hidden on /journey; on / it fades in mid hero-morph (~285vh)
├── theme-toggle.tsx      Light/dark toggle (state in lib/theme.tsx)
├── tc-invite.tsx         Floating Ticket-Checker widget → routes to /journey (home only)
├── mermaid-diagram.tsx   Client wrapper, dynamic-imports mermaid
├── sections/             Home page sections: character-scroll, selected-work, about,
│                         experience, press, currently, contact, footer
└── forms/                contact-form, resume-form (client; call the server actions)

lib/
├── projects.ts           Single source of truth for projects (+ detail-page fields, Mermaid source)
├── writing.ts            Posts (plain TS now; migrate to MDX past ~10 entries)
├── seo.ts                SITE_URL + schema.org @id constants + XSS-safe jsonLd()
├── theme.tsx             ThemeProvider + useTheme (localStorage 'sj-theme')
├── projects.ts/writing.ts feed both the home reels and the detail routes
├── validation/forms.ts   Zod schemas shared by client forms + server actions
├── email/resend.ts       Resend client + send helpers
└── firebase/             app.ts (client), admin.ts (server), db.ts, analytics.tsx

public/assets/
├── saurabh/              119 hero frames, 1920×1080 (~12 MB) — desktop / fast network
├── saurabh-lite/         same 119 frames, 960×540 (~3.5 MB) — mobile / data-saver
└── *_bg.jpg              journey station backgrounds
public/models/scene.glb   645 KB Draco GLB — train + sleeper prototype
```

---

## Load-bearing subsystems

### 1. Canvas-scrubbed hero — `components/sections/character-scroll.tsx`
The most intricate file in the repo. A **400vh** scroll section with a sticky 100vh child.
A **119-frame WebP image sequence** of Saurabh is drawn on a `<canvas>` (atomic `drawImage`,
no flicker) and scrubbed by scroll position. Five text "beats" fade in/out via a trapezoid
`band()` function. Beat 5 ("I'm Saurabh.") **morphs into the navbar brand** — it travels up
and shrinks inside the sticky-locked 276vh→300vh range while `SiteNav` crossfades in, so the
H2 appears to shrink into the nav pill. Adaptive serving: `pickFrameDir()` chooses
`saurabh/` vs `saurabh-lite/` from viewport width + Network Information API (`saveData`,
`effectiveType`); mobile also drops to every-other frame. Frames eager-load the first 8,
defer the rest to `requestIdleCallback`.

### 2. `/journey` 3D diorama — see the deep-dive section below.

### 3. SEO — `lib/seo.ts` + `app/layout.tsx`
A single JSON-LD `@graph` (Person + WebSite) is emitted in the root layout via a **native
`<script>`** (not `next/script` — JSON-LD isn't executed JS). `PERSON_ID` / `WEBSITE_ID`
`@id` fragments let `/work` and `/writing` pages reference the *same* Person node instead of
re-declaring it, giving Google one clean entity authoring many works. `jsonLd()` escapes `<`
to neutralise script-injection. Per-route dynamic OG images, `sitemap.ts`, `robots.ts`, and
Google Search Console verification (env-var token) round it out.

### 4. Theme — `lib/theme.tsx` + no-flash script in `layout.tsx`
Theme stored under `localStorage['sj-theme']`. An inline `beforeInteractive` script applies
the stored/system theme to `<html>` before first paint, so there's no flash of wrong theme.

### 5. Forms — `app/actions/*` + `components/forms/*` + Firebase + Resend
Client forms validate with the shared Zod schemas, then call Server Actions that re-validate,
write to Firestore, and send notification email via Resend. Firebase admin SDK is server-only
(`lib/firebase/admin.ts`, service-account key base64 in env).

### 6. Performance — `next.config.ts`
AVIF-first image formats; `optimizePackageImports` for `firebase`, `@react-three/drei`,
`mermaid` (fat barrels); long-cache headers for `/models/*` and the two hero frame folders.

---

## The `/journey` 3D experience

A curated, **non-interactive** scroll experience: the user scrubs the train (scroll / route-map
prev-next / play) but cannot rotate the camera. One strong creative direction, fully committed.

### Structure
```
app/journey/
├── page.jsx              Server entry, exports metadata
├── JourneyClient.jsx     "use client" — mount-gate, scroll progress, autoplay engine,
│                         fixed Canvas, station bg crossfade, RouteMap, overlays, Loader
└── components/
    ├── glb.js            GLB_PATH + DRACO_DECODER_PATH + GLB_VERSION (bump on .glb change)
    ├── scenes.js         STATIONS array (5 stops) + TOTAL_KM + TRAIN_X_START/END
    ├── track.js          Track curve points + RAIL/SLEEPER constants
    ├── curve.js / Rails.jsx / Sleepers.jsx   Procedural rails + curvature-aware sleepers
    ├── Train.jsx         Loads scene.glb → Locomotive group, scales 0.65
    ├── Diorama.jsx       Lights + shadow plane + train + rails + sleepers + AutoFit
    ├── AutoFitOrtho.jsx  Fit-once orthographic zoom
    ├── RouteMap.jsx      Fixed bottom dock — station medallions + progress marker + play button
    ├── SkillsStation.jsx / ContactStation.jsx   Full-overlay panels for stops 2 & 4
    ├── Hoarding.jsx      Top panel (currently disabled while aligning sections)
    └── panels/           PanelIntro / PanelJourney / PanelProjects / PanelHobbies / PanelTerminus
```

### How it scrolls (`JourneyClient.jsx`)
- A `<main>` of **one empty 100vh `<section>` per station** forms the scroll runway. The
  Canvas is `position: fixed` and stays put; only the train moves.
- `useScrollProgress()` returns `scrollT` (0 → N-1, fractional). `activeIdx = floor(scrollT)`;
  a linear `progress` (0..1) drives the route-map marker so marker arrival and bg crossfade
  stay in lockstep.
- **Station backgrounds** crossfade continuously: each `bgImage` is opaque at `scrollT == its
  index` and fades to 0 one viewport away. Stops 2 (Skills) and 4 (Contact) have no `bgImage`
  — they use dedicated full-overlay components with a dotted-grid backdrop instead.
- **Autoplay**: a rAF loop sets `scrollY` 60×/s, alternating MOVING (linear, 8 s between
  stations — trains cruise, no easing) and PAUSING (5 s halt to read the panel). Any user
  wheel/touch/arrow-key cancels it.

### Coordinate system
- **Y up**. Ground `Y=0`, rail surface `~Y=0.22`, train top `~Y=3` after 0.65 scale.
- **X** left→right. Train glides `TRAIN_X_START = -23` → `TRAIN_X_END = +18` across the scroll.
- Camera: orthographic, `position [0, 22, 36]`, `zoom 30`, looking at the origin. Camera and
  target both at X=0 so world-horizontal lines render screen-horizontal.
- Canvas GL: ACES filmic tone mapping, exposure 1.05, sRGB, alpha (transparent so the bg
  image shows through).

### Stations (`scenes.js`)
`platform (00)` → `story (01)` → `skills (02)` → `projects (03)` → `contact (04)`, at `p =
0, .25, .5, .75, 1.0`. Each carries name/Devanagari/km/platform/departure + a `panel`
descriptor consumed by the matching panel component.

---

## Locked decisions (don't revisit without discussion)

1. **Camera locked** — no orbit/pan/zoom on `/journey`. OrbitControls is in the tree but everything is `false`.
2. **Orthographic projection** — keeps the straight track visually straight; perspective added a "tilt" feel.
3. **Camera + target both at X=0** — preserves the screen-horizontal projection of world +X.
4. **Train scale 0.65** — reads as a model train inside a tabletop diorama.
5. **Procedural rails (TubeGeometry from curve)** — not the rigid GLB rails (they don't bend).
6. **Sleeper spacing curvature-aware** — inner-rail arc-length stays uniform if curves return.
7. **`scene.glb` provides train + sleeper prototype only** — its own track is ignored.
8. **`GLB_VERSION` is bumped manually** when `scene.glb` is replaced (cache-bust). Current = `'14'`.
9. **Branding is correct as-is** — `सौरभ जाधव / SAURABH JADHAV / SJ-01 PORTFOLIO EXPRESS`. Don't change.
10. **No `next/dynamic({ ssr: false })` in Server Components** — Next 16 rejects it. Mount-gate via `useState(mounted)` in `JourneyClient.jsx`.
11. **`scroll-behavior: smooth` is disabled on `/journey`** — it collided with both autoplay's per-frame `scrollTo` and Diorama's own smoothing, producing a "shake". Disabled for the session, restored on unmount.
12. **SiteNav is hidden on `/journey`** — the page is its own immersive context.

---

## Workflow & deployment

Branch strategy (see `scripts/imp.txt`):

| Branch | Target |
|---|---|
| `main` | Production → `https://saurabhjadhav.in` (Vercel `--prod`) |
| `uat` | Staging → Vercel preview URL |
| `feature/*` | Local dev, branched from `uat` |

PowerShell scripts in `scripts/` automate it:
- `new-feature.ps1` — start a feature branch off `uat`
- `merge-to-uat.ps1` / `push-to-uat.ps1` — deploy preview
- `deploy-to-production.ps1` / `push-to-main.ps1` — deploy prod

**Production deploys amend the commit author to `WEBSTUDIOCSE
<saurabhjadhav.webstudio@gmail.com>` and force-push** (Vercel team author requirement), then
restore the local author.

### Cache-busting `scene.glb`
1. Replace `public/models/scene.glb`.
2. Bump `GLB_VERSION` in `app/journey/components/glb.js`.
3. Commit + deploy.

### Adding journey scenery back (proven workflow)
1. Generate a single-prop GLB via text-to-3D (Tripo / Meshy).
2. Save to `public/models/landscape_exports/<name>.glb`.
3. Add to a `SCENERY_ASSETS` map in `glb.js`.
4. Place via a config-driven `ScatteredAsset` component (`placements` + `sizeMode`).
5. Bump `GLB_VERSION`. Reference sizes: train ≈ 13 m long / 3 m tall; palm 6 m, hill 7 m wide, house 4 m wide.

---

## Environment

Copy `.env.example` → `.env.local` (gitignored). Keys: Firebase client config
(`NEXT_PUBLIC_FIREBASE_*` — public by design), `FIREBASE_SERVICE_ACCOUNT_KEY_B64`
(server-only), `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `NEXT_PUBLIC_RESUME_URL`,
`NEXT_PUBLIC_GOOGLE_VERIFICATION`.

---

## References

- Source Blender files: `C:\Users\Saura\Documents\blender\train_miniature\`
- Domain: [saurabhjadhav.in](https://saurabhjadhav.in)
- Vercel project: `saurabh-jadhavs-projects-3933d523/portfolio`
- GitHub: `https://github.com/WEBSTUDIOCSE/PORTFOLIO`
- Owner: Saurabh Jadhav (Mumbai/Pune, India)
