# Portfolio — Project Checklist

> Living to-do for saurabhjadhav.in. Check items off as they ship.
> Priority: **P0** = high impact / broken · **P1** = important · **P2** = polish.
> Last updated: 2026-05-22

---

## ✅ Done

- [x] Fix About portrait 404 (`.png` → `.webp`) — broken image + console error _(Best Practices)_
- [x] Fix `aria-prohibited-attr` — experience logos given `role="img"` _(Accessibility)_
- [x] Rewrite `README.md` (was create-next-app boilerplate)
- [x] Update `CLAUDE.md` to current project state
- [x] Rebuild footer — nav + social + back-to-top + "Konkan line" signature
- [x] Upgrade "Currently" — Open-to / Now-building / freshness stamp / real hobbies (games, horror narration, football, cricket, guitar)
- [x] Replace default Vercel/Next favicon with brand "SJ" icon (`app/icon.svg`, theme-aware); remove leftover create-next-app svgs
- [x] Build **Story section** — 8-beat origin narrative + sticky video scrollytelling (`lib/story.ts`, `components/sections/story.tsx`); awaiting real video file

---

## Content & credibility — P0

- [x] **Testimonials section** built with SAMPLE data (`lib/testimonials.ts`) — replace placeholders with real LinkedIn recommendations
- [x] **Real headshot** — added
- [x] **Résumé PDF** — already added
- [x] ~~Test credentials for CinematicTale~~ — N/A, open to all, users can log in and explore
- [x] ~~GitHub repo for OpenClaw~~ — N/A, hosted on Hostinger (no public repo); LinkedIn proof video already linked
- [x] ~~Before/after AI proof artifact~~ — dropped
- [ ] **Replace placeholder testimonials** with real quotes once collected
- [ ] **GitHub repo links** for projects that *do* have public source (CinematicTale / Elite Mindset Forge, if applicable)

## /journey page — P0 / P1

- [~] **Stations render no content** — Story (01) + Projects (03) now built; Platform (00) still bg-image only
- [x] **Story station** — scene-video player + train gate (holds until story finishes); add scenes via `storyScenes.js`
- [x] **Projects station** — real tiles from `lib/projects.ts` (CinematicTale + Elite); add slugs in `ProjectsStation.jsx`
- [x] **Journey theme-aware** — Contact/Skills/Projects overlays + dotted backdrop now use design tokens (light + dark), fixing the dark ResumeForm-on-light bug
- [x] **Journey resume** → same gated `ResumeForm` as landing; phone → 9021337133; availability → "available anywhere"; fixed GitHub handle
- [x] **Socials site-wide** — added X / YouTube / Instagram (footer, contact, journey, JSON-LD `sameAs`) + icon set (`social-icons.tsx`) on landing footer + contact
- [x] **Replace fake placeholder projects** — Projects station now uses real `lib/projects.ts` data (scenes.js panel data now unused/dead)
- [ ] **Replace fake placeholder projects** in `scenes.js` with real ones (`lib/projects.ts`)
- [ ] **Skills station has zero AI** — add Gemini / Claude API / multi-agent / RAG / Supabase·pgvector
- [ ] **Fix Contact links** (`ContactStation.jsx`): GitHub handle, Twitter/X, résumé path, public phone, "frontend developer" undersell
- [ ] **Add "← back to Portfolio"** link (SiteNav is hidden on /journey)
- [ ] Add **Experience / Livlong** station
- [ ] **Mobile** device pass (3D canvas + overlays + autoplay)
- [ ] Diorama scenery — platforms / props (optional)
- [ ] **Delete dead code**: `Hoarding.jsx` + `panels/PanelIntro|Journey|Projects|Hobbies|Terminus.jsx` once content rewired

## Performance / technical — P1

- [x] ~~Disable Vercel toolbar on production~~ — N/A, only loads for the logged-in owner (Lighthouse saw it while authenticated); real visitors never download it
- [ ] **Total byte weight ~5.6 MB** — hero frame sequence; only real remaining perf item. Already mitigated by adaptive lite-frames + eager-8 / idle-rest loading. Optional: trim frame count or re-compress
- [x] Convert About `<img>` → `next/image` (confirmed only raw `<img>` in repo)
- [x] Source maps (`productionBrowserSourceMaps`) + legacy-JS polyfills (modern `browserslist`)

## SEO — P1 (Lighthouse 100, verify)

- [ ] **www vs apex redirect** behaviour (was debugging `/work/openclaw`)
- [ ] Confirm **`SoftwareApplication` JSON-LD** emitted per `/work/[slug]`
- [ ] **Re-run Lighthouse** after aria + 404 fixes (confirm A11y / Best-Practices ~100)

## Repo hygiene — P2

- [ ] **`.idea/` not gitignored**
- [ ] `scenes.js` placeholder data cleanup
- [ ] **Grow `/writing`** — add 2–3 posts beyond the OpenClaw one
- [ ] Verify Press section LinkedIn URNs render

## Nice-to-have — P2

- [ ] Custom **analytics events** on key CTAs (résumé download, email click)
- [ ] **RSS feed** for `/writing`
- [ ] Horror-story **channel link** (once revealed — "Currently" line is ready)

---

## Suggested order

1. Journey stations + real data (most visibly unfinished)
2. Testimonials + GitHub links + résumé verify (credibility)
3. Disable Vercel toolbar on prod + re-run Lighthouse (quick win)
4. `.idea` gitignore + dead-code cleanup (fast hygiene)
