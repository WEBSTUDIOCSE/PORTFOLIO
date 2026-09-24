# Portfolio GPT Playbook

Read this file before making changes to the portfolio. It is the operating
contract for keeping `saurabhjadhav.in` accurate, polished, fast, indexable,
and aligned with the latest KnownIn information.

The `/journey` experience is intentionally out of scope unless the user
explicitly asks for it.

## Source of truth

Use sources in this order:

1. The connected KnownIn project and its latest approved profile, project,
   experience, writing, and asset information.
2. The repository data layer, especially `lib/projects.ts`,
   `lib/experience.ts`, `lib/writing.ts`, `lib/seo.ts`, and `lib/chat/`.
3. The linked GitHub repository and its current branch history.
4. The deployed site, Search Console, and other connected product tools.
5. Official web research when a current external fact is required.

Never invent a project metric, client, technology, date, role, URL, or result.
If KnownIn and the repository disagree, identify the conflict and use the newer
verified source rather than silently guessing.

## Refresh tools on every task

Do not rely on a cached tool list or an earlier conversation. At the start of
every task:

1. Discover the currently available MCP, app, browser, GitHub, KnownIn,
   Search Console, Lighthouse/PageSpeed, and web tools. Search for newly
   available relevant tools before saying a capability is unavailable.
2. Open the connected KnownIn project and fetch the latest relevant records.
   Prefer structured project/profile data and linked GitHub sources over prose
   memory. If the connector is unavailable in the current session, say so and
   continue using the repository without fabricating a connection.
3. Inspect the current branch, working tree, recent commits, package versions,
   and relevant files. Preserve unrelated user changes.
4. Read applicable guidance in `node_modules/next/dist/docs/` and the local
   `.agents/skills/` guidance for frontend design, Next.js, and React/Vercel
   performance.
5. Refresh time-sensitive facts from their current source instead of trusting
   stale values.

## KnownIn-to-portfolio update map

When KnownIn changes, update every affected consumer, not only the visible card:

- Project facts and links: `lib/projects.ts`.
- Home project list: `components/sections/selected-work.tsx`.
- Project detail, related navigation, metadata, and JSON-LD:
  `app/work/[slug]/page.tsx` and its route assets.
- Chat answers: `lib/chat/knowledge-base.ts` and the source data it compiles.
- Search discovery: `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`, and
  relevant metadata/schema.
- Social previews: route `opengraph-image.tsx` files when identity or summary
  changes.
- Visual assets: verify files exist under `public/`, with appropriate loading,
  dimensions, and cache policy.

Keep one canonical fact in the data layer and derive UI, chat, metadata, and
structured data from it where practical. Do not duplicate facts with subtly
different wording across routes.

## Engineering rules

### Next.js 16

- Use the App Router and Server Components by default.
- Add `'use client'` only at the smallest interactive boundary.
- Follow the installed Next.js docs; do not assume older APIs.
- Treat `params`, `searchParams`, `cookies()`, and `headers()` according to
  the installed version's async API rules.
- Use `generateMetadata`, file-based metadata, `notFound`, route handlers,
  Server Actions, and error boundaries in their intended locations.
- Do not use `next/dynamic({ ssr: false })` from a Server Component. Use a
  client mount gate for browser-only experiences.
- Prefer `next/image` for content images, with correct `sizes`, priority only
  for true above-the-fold LCP media, and meaningful alt text.
- Keep fonts on `next/font`; do not add render-blocking font or script hacks.
- Keep secrets server-only. Never expose API keys or private KnownIn data.

### React and performance

- Eliminate waterfalls with parallel fetching (`Promise.all`) and Suspense
  where it improves streaming.
- Dynamically import heavy non-critical libraries and defer analytics or
  optional work that can wait until after the critical path.
- Use refs for high-frequency transient values such as scroll animation state;
  avoid React state updates on every animation frame.
- Keep effect dependencies precise and clean up observers, listeners, and raf
  loops.
- Avoid barrel imports and broad client bundles. Minimize data passed to client
  components.
- Preserve stable keys, semantic HTML, keyboard access, visible focus,
  reduced-motion behavior, and useful loading/error/empty states.
- Protect LCP, INP, CLS, total blocking time, image weight, JavaScript weight,
  and layout stability before adding visual effects.

### Visual design

- Maintain the considered editorial direction: distinctive typography,
  deliberate contrast, tactile grid/pattern details, and restrained motion.
- Do not introduce generic dashboards, purple-gradient AI styling, default
  Inter/Roboto typography, or arbitrary component-library surfaces.
- Preserve existing hero and `/journey` behavior unless explicitly asked to
  change them. Scope visual rollbacks to the requested section.

## SEO and indexing gate

For any content or route change, verify as applicable:

- Canonical URL, title, and description.
- Open Graph/Twitter preview metadata.
- Valid, escaped JSON-LD connected to the canonical Person/WebSite entities.
- Sitemap inclusion or intentional exclusion.
- Coherent `robots.txt`, `llms.txt`, internal links, and breadcrumbs.
- No accidental redirects, duplicate URLs, broken links, or orphaned pages.
- Search Console inspection or re-submission only after the deployed URL has
  the change. Local changes are not indexed changes.

## Verification gate

Before handoff:

1. Run focused ESLint on changed files.
2. Run `npm run build` for route, metadata, type, or bundling changes.
3. Run `git diff --check`.
4. Test affected UI at desktop and narrow/mobile widths.
5. Check keyboard navigation, focus states, reduced motion, and semantics.
6. Use Lighthouse/PageSpeed when performance or indexing is part of the task;
   report measured results, not guesses.
7. Run full lint when practical and separate pre-existing `/journey` failures
   from new failures.

Never deploy, push, submit forms, request indexing, or make an external write
unless the user explicitly asks for it in the current task.

## Change discipline

- Inspect before editing and use the smallest coherent patch.
- Do not reset, checkout over, delete, or overwrite unrelated user work.
- Do not modify `/journey` for a portfolio task unless requested.
- Do not silently change locked architecture decisions in `CLAUDE.md`.
- When routes, data ownership, architecture, or deployment behavior changes,
  update this playbook and the relevant project documentation.
- Final handoff must list changes, verification, blockers, and any external
  action still required from the user.

## Current project anchors

- Production: `https://saurabhjadhav.in`
- GitHub: `https://github.com/WEBSTUDIOCSE/PORTFOLIO`
- Production branch: `main`
- Core project data: `lib/projects.ts`
- Home entry: `app/page.tsx`
- Project detail route: `app/work/[slug]/page.tsx`
- Chat route: `app/api/chat/route.ts`
- Performance/config: `next.config.ts`, `app/layout.tsx`, `app/globals.css`
