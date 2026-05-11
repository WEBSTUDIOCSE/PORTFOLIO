// Writing — short technical posts. Used by /writing index and
// /writing/[slug] detail pages.
//
// Posts are seeded here in plain TS (strings). When the list grows
// past ~10 entries, migrate to MDX files under content/writing/ and
// keep this file as the index loader.

export type Post = {
  slug: string;
  title: string;
  /** Sub-title / one-line hook. */
  excerpt: string;
  /** ISO date string. Used for ordering. */
  date: string;
  /** Read-time estimate, e.g. "5 min read". */
  readTime: string;
  /** Tags shown on the card + filterable later. */
  tags: string[];
  /** Body as an array of paragraphs (plain text). Heading lines start
   *  with "## " and render as h2. */
  body: string[];
  /** Whether to surface on the /writing index. Drafts stay false. */
  published?: boolean;
};

export const POSTS: Post[] = [
  {
    slug: "openclaw-15-agents",
    title: "Designing OpenClaw: 15 agents, 3 agencies, one COO",
    excerpt:
      "How I replaced a 5-person team with a multi-agent system running on my VPS — and what the architecture taught me about narrow scope.",
    date: "2025-12-15",
    readTime: "6 min read",
    tags: ["AI", "Architecture", "Multi-agent"],
    published: true,
    body: [
      "Most multi-agent systems I've seen on Twitter share one fatal trait: they try to be smart. The agent reasons about what to do, then does it. The result is a fragile chain — one wrong reasoning step and the entire pipeline derails.",
      "OpenClaw goes the other way. Every agent is a specialist with a small, well-defined job. The Coder writes code. The Git agent commits and pushes. The Deploy agent runs the Vercel CLI. None of them know what the others do. They share state through Firebase, not through prompts.",
      "## The three agencies",
      "I split the work along the boundaries where a real org would: Dev (Shuri as CEO), LinkedIn (Natasha), and Creative (Maya). Each agency has its own CEO and its own sub-agents. Above them sits Jarvis, the COO — the single point of contact.",
      "When you give Jarvis a task, Jarvis decides which agency it belongs to. Inside that agency, the CEO routes to sub-agents. The CEO knows the agency's playbook; the sub-agents know nothing outside their narrow role.",
      "This sounds bureaucratic. It is bureaucratic. That's the point — bureaucracy is what keeps a system reliable when no one in it can think the whole thing through.",
      "## Specialisation beats reasoning",
      "Early on I tried building one big \"product engineer\" agent that handled everything from code to deploy. It worked in demos and failed in production within hours. The problem: when you let an agent reason across domains, every domain becomes a place it can hallucinate.",
      "Narrowing the scope to \"only write valid TypeScript for this exact file\" or \"only commit with this exact message format\" cut hallucinations sharply. The agents are dumber. The system is smarter.",
      "## Shared state, not shared prompts",
      "The other unlock was state. Most multi-agent demos pass context via prompts — Agent A's output becomes Agent B's input. That's how you get drift: by step 5 the context has accumulated five rounds of paraphrasing.",
      "OpenClaw agents read and write to Firebase. They share state, not narrative. Each agent looks at the same source of truth and contributes its slice. The COO arbitrates conflicts.",
      "It's not glamorous. It's not even particularly clever. But it ran a launch campaign that hit 841 impressions without me touching the keyboard, so I'll take it.",
    ],
  },
  {
    slug: "canvas-scroll-hero",
    title: "Why I rebuilt my portfolio hero as a canvas",
    excerpt:
      "The story of a flicker, a 119-frame WebP sequence, and learning the hard way that <img> src-swapping is not how Apple does it.",
    date: "2025-11-30",
    readTime: "4 min read",
    tags: ["Performance", "Web", "Animation"],
    published: true,
    body: [
      "If you've seen Apple's iPhone product pages, you know the scroll-driven animation where the device rotates as you scroll. I wanted that for my landing hero — a smooth head-turn synced to scroll position, 119 frames, no jank.",
      "Version 1 was naive: one `<img>` element, swap `src` every scroll tick. It worked... ish. On desktop, mostly smooth. On mobile, every other scroll produced a brief blank frame. Flicker.",
      "## What's actually happening",
      "When you change an `<img>`'s `src`, the browser doesn't atomically swap pixels. It enters a state where the new image is being loaded (even from cache) and decoded. Between the old paint and the new one, there's a window — sometimes a few milliseconds, sometimes longer — where the element renders nothing.",
      "On a slow Android, that window stretches. On a fast Mac, you barely notice. But the inconsistency is the problem — it can't be the right answer.",
      "## The canvas trick",
      "Apple's solution is what I copied: render to a `<canvas>` element, and draw pre-loaded `HTMLImageElement`s via `ctx.drawImage()`. The key property: drawImage is synchronous with the next paint. There is no in-between state.",
      "Preload all the frames into an array of Image objects. On scroll, compute the target index, call drawImage with that image, done. No src-swapping, no flicker, no decode timing weirdness.",
      "## The DPR detail",
      "One thing the tutorials skip: device pixel ratio. If you set `canvas.width = 800` on a retina screen, the canvas internally has 800 pixels but stretches across 1600 device pixels — blurry.",
      "The fix: set `canvas.width = cssWidth * dpr`, then `ctx.scale(dpr, dpr)` so all your drawing math stays in CSS pixels. Cap DPR at 2 — beyond that is just bandwidth waste with no visible difference.",
      "## What I'd do differently",
      "Convert source frames to WebP from the start. I had 75MB of PNG before I converted to WebP and saved 6×. Don't ship 800KB-per-frame PNGs in 2026.",
    ],
  },
  {
    slug: "nextjs-16-migration",
    title: "Migrating Livlong to Next.js 16: the 45% LCP win",
    excerpt:
      "What changed when we moved livlong.com from a tangled Remix/Svelte/legacy mix to Next.js 16 — and what didn't.",
    date: "2025-10-20",
    readTime: "5 min read",
    tags: ["Next.js", "Performance", "Migration"],
    published: true,
    body: [
      "livlong.com had four front-end modules when I joined. Two on Remix, one on Svelte, and a legacy module on something I'd rather not name. Each module had its own auth, its own component library, its own deploy pipeline.",
      "We migrated all four to Next.js 16 with React Router v7 as the routing layer for some internal flows. The headline number was a ~45% LCP improvement. The actual win was structural.",
      "## What Next.js 16 brings that mattered to us",
      "App Router with React Server Components. Most of our pages don't need client interactivity above the fold — they're mostly content. Moving the hero, headers, and product cards to RSC dropped the client bundle for first-load pages by a measurable amount.",
      "Turbopack for dev. The 4× faster HMR is the kind of thing you only appreciate after a week. Then you appreciate it every minute.",
      "Built-in font optimisation via `next/font`. We were loading 6 Google Fonts via CSS imports before. Self-hosted, subset, and preloaded automatically saved a request waterfall.",
      "## The LCP win wasn't from Next.js alone",
      "Honest disclosure: the 45% LCP improvement came from THREE changes shipped together:",
      "First, we moved the hero image from a CSS background to a properly sized `next/image` with `priority` and `sizes`. That alone was probably 60% of the win.",
      "Second, RSC moved a chunk of layout work to the server, so the first paint didn't wait for the client bundle.",
      "Third, font optimisation killed a 200ms blocking script.",
      "Don't credit a framework for a number that came from getting the basics right. The framework made it easier; the work was still the work.",
      "## What I'd flag to anyone migrating",
      "App Router is genuinely different. Read the relevant section of the docs before each file change. \"It looks like Pages Router but with `app/` instead of `pages/`\" is the road to a six-month rewrite.",
      "Server Components compose differently. A client component cannot import a server component as a child — it can only receive one as a `children` prop. Sounds obvious; gets you twice a week.",
      "Test the build, not just the dev server. App Router does things at build time that dev mode hides. We had three pages that worked in dev and 404'd in production. Always `npm run build` before you push.",
    ],
  },
];

export const PUBLISHED_POSTS = POSTS.filter((p) => p.published).sort(
  (a, b) => (a.date < b.date ? 1 : -1),
);
