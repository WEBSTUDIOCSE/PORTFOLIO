# saurabhjadhav.in

Personal portfolio of **Saurabh Jadhav** — Frontend & AI Engineer, Mumbai.
Built with Next.js 16 and React 19, deployed on Vercel at
[saurabhjadhav.in](https://saurabhjadhav.in).

Two experiences in one site:

- **`/`** — a scroll-driven editorial landing page. The hero is a 119-frame
  image sequence scrubbed on a `<canvas>` as you scroll, with text beats that
  morph into the navbar. Below it: selected work, about, experience, press, now,
  and contact.
- **`/journey`** — a curated 3D toy-railway diorama. A stylised Indian Railways
  WAP-7 locomotive glides through five stations, each a chapter of the story.
  Orthographic, non-interactive (scroll / play, no free camera). Built with
  react-three-fiber + a Draco-compressed GLB.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (app router, RSC), React 19 |
| Styling | Tailwind CSS v4, design tokens + dark mode |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| Backend | Firebase (Firestore / Storage / Analytics), Resend (email), Server Actions |
| Validation | Zod |
| Diagrams | Mermaid (project pages) |
| Hosting | Vercel |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Firebase / Resend / GSC values
npm run dev                  # http://localhost:3000
```

Scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.

### Environment

`.env.local` (gitignored) — see `.env.example` for the full list:

- `NEXT_PUBLIC_FIREBASE_*` — Firebase client config (public by design)
- `FIREBASE_SERVICE_ACCOUNT_KEY_B64` — admin SDK service account, base64 (server-only)
- `RESEND_API_KEY`, `CONTACT_EMAIL_TO` — contact / resume email
- `NEXT_PUBLIC_RESUME_URL` — resume PDF URL (falls back to `/resume.pdf`)
- `NEXT_PUBLIC_GOOGLE_VERIFICATION` — Google Search Console token

## Project structure

```
app/            Routes — landing (page.tsx), /journey, /work/[slug], /writing, plus
                sitemap / robots / OG-image routes and Server Actions (app/actions/)
components/     site-nav, chat-widget, sections/ (home), forms/
lib/            projects.ts, writing.ts (content), seo.ts, theme.tsx,
                validation/, email/, firebase/
public/assets/  saurabh/ + saurabh-lite/ (hero frames), station backgrounds
public/models/  scene.glb (train + sleeper prototype, Draco-compressed)
scripts/        PowerShell deploy automation (see scripts/imp.txt)
```

## Deployment

| Branch | Target |
|---|---|
| `main` | Production — `https://saurabhjadhav.in` |
| `uat` | Staging — Vercel preview |
| `feature/*` | Local dev, branched from `uat` |

Deploys are automated by the PowerShell scripts in `scripts/`. Production deploys
amend the commit author for the Vercel team and force-push — see `scripts/imp.txt`
for the full workflow.

---

> Working on this codebase with Claude? Read [`CLAUDE.md`](./CLAUDE.md) first — it
> covers architecture, the load-bearing subsystems, and the locked design decisions
> (especially for `/journey`).
