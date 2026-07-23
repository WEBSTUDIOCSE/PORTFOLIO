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
    slug: "building-cinematictale-production-lessons",
    title: "Building CinematicTale: Lessons from Shipping a Production AI SaaS",
    excerpt:
      "Four incidents from running an AI SaaS with real users and real money — a missing Firestore argument, a two-currency pricing model, a CSP header silently blocking analytics, and why a green commit isn't a live fix.",
    date: "2026-07-23T12:00:00",
    readTime: "6 min read",
    tags: ["AI", "Production", "SaaS"],
    published: true,
    body: [
      "CinematicTale (cinematictale.com) turns a one-sentence prompt into a fully illustrated storybook, comic, or short AI video — powered by Google Gemini for text, Imagen 4 for illustrations, and Veo 3 for video. I built and operate the whole stack: a Next.js 16 App Router frontend, a Firebase backend, and a Razorpay-based subscription economy, run across fully isolated UAT and production environments.",
      "The interesting part of building a product like this isn't the demo — it's everything that breaks once real users, real money, and real infrastructure enter the picture. A few of those moments taught me more than the initial build did.",
      "## The bug that returned an empty page with no error",
      "Weeks after launch, the Explore gallery and individual story pages started silently returning empty — no error, no stack trace, just nothing. The obvious suspects (Firestore security rules, environment variables, a bad deploy) all checked out clean. The actual cause turned out to be a single missing argument: `getFirestore(app)` needs an explicit `'default'` database ID on some project/region configurations, or it fails with a bare, unhelpful `5 NOT_FOUND` error that gets swallowed by an outer try/catch. The fix was one line — `getFirestore(app, 'default')` — but finding it meant reproducing production locally with real credentials and reading raw server logs, because every layer above that point was designed to fail gracefully and hide exactly the information I needed.",
      "The lesson that stuck: a `.catch(() => [])` that keeps your UI from crashing is also a `.catch()` that can hide a real infrastructure bug behind an innocent-looking empty state. Fail loud in development, fail quiet in production — but log the loud version somewhere you'll actually see it.",
      "## Pricing a product across two currencies and two economies",
      "Adding INR pricing alongside USD wasn't a matter of multiplying by an exchange rate. The AI generation costs (Gemini, Imagen, Veo) are billed in USD regardless of what currency the customer pays in, so every regional price has to be checked against real unit economics, not just converted. Working through the actual numbers — cost per credit, margin per plan, and specifically the video generation tier, where a naive INR price would have made every video clip a guaranteed loss — turned pricing from a marketing decision into an engineering constraint.",
      "The pattern that emerged: currency is a checkout-time concern (Razorpay Plans are immutable, currency-scoped objects with no shared pricing across them), but margin is a product-design concern that has to be solved before a single price is typed into a dashboard.",
      "## The three-domain bug hiding behind one console error",
      "Firebase Analytics reported nothing in Realtime, despite the SDK being correctly wired and deployed. The browser console eventually surfaced the real cause: a Content-Security-Policy header — added months earlier for legitimate XSS protection — didn't whitelist Google's analytics collection domains, so every event was silently blocked as a policy violation. No error reached the application code; the browser just declined to make the request. Underneath that was a second, independent bug: the Firebase project's actual GA4 measurement ID no longer matched what was hardcoded in the environment config, a drift that had happened invisibly at some point after initial setup.",
      "Two unrelated bugs, both invisible unless you specifically go looking in the browser console rather than the application logs — a good reminder that \"the code is correct\" and \"the browser will actually run it\" are separate claims, especially once security headers, ad blockers, and third-party script loaders enter the picture.",
      "## Shipping isn't done until the deploy is confirmed",
      "More than once, a fix that was correct, tested, committed, and pushed still wasn't live — because \"pushed to a branch\" and \"deployed to production\" turned out to be two different facts that needed independently verifying. The habit that saved the most time: after any fix, curl the actual production response — the real HTTP headers, the real HTML, the real JS bundle — rather than trusting that a green commit means a resolved issue. Git tells you what you intended to ship. Only the live server tells you what's actually running.",
      "## What this project is, mechanically",
      "Frontend: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4. AI: Google Gemini for text, Imagen 4 for images, and Veo 3 for video, behind a single-provider adapter layer with circuit breakers and rate limiting. Backend: Firebase (Auth, Firestore, Storage) across fully isolated UAT and production projects. Payments: Razorpay subscriptions plus one-time credit top-ups, dual currency (USD/INR), a webhook-driven credit ledger built on atomic Firestore transactions. Ops: Vercel hosting, Vercel Analytics and Firebase Analytics (GA4), Firestore composite indexes managed through the Firebase CLI.",
      "The product itself is the visible part. The real engineering was in the parts nobody sees until they break: the database call that needs one extra argument, the pricing model that has to survive contact with real API bills, the security header that quietly disables the feature it wasn't trying to touch, and the deploy pipeline that has to be checked, not assumed.",
    ],
  },
  {
    slug: "building-this-site-and-its-assistant",
    title: "Building this site — and the assistant living in the corner of it",
    excerpt:
      "A tour of how saurabhjadhav.in is put together: the stack, the content-as-data model, and the GLM-backed chat widget that actually knows what's in my resume.",
    date: "2026-07-23",
    readTime: "7 min read",
    tags: ["Architecture", "Next.js", "AI"],
    published: true,
    body: [
      "This site is two experiences wearing one domain. The homepage is a scroll-driven editorial landing page. `/journey` is a curated 3D toy-railway diorama — a stylised locomotive gliding through five stations of my career. Both are Next.js 16, both share the same content layer, and as of this year, both are reachable from a chat widget that can actually answer questions about me.",
      "## The stack, briefly",
      "Next.js 16 App Router with React Server Components, React 19, Tailwind CSS v4 using its `@theme inline` token system rather than a config file. Firebase (Firestore + Storage + Admin SDK) for anything that needs to persist. Resend for transactional email. Zod for every form and API boundary. Three.js + React Three Fiber for `/journey`, kept strictly out of the homepage's bundle.",
      "The animated hero is its own small essay — a 119-frame WebP sequence drawn to a canvas and scrubbed by scroll position, chosen specifically because swapping an `<img src>` on every scroll tick produces a visible flicker on slower devices. I wrote that one up separately; the short version is that `drawImage()` is atomic and `src=` is not.",
      "## Content as data, not a CMS",
      "Projects, work experience, and writing all live as typed arrays — `lib/projects.ts`, `lib/experience.ts`, `lib/writing.ts` (yes, this post is data describing itself). No headless CMS, no database round-trip for content that changes maybe once a month. Each file is the single source of truth for its domain, consumed by the relevant page components directly.",
      "That decision paid for itself in a way I didn't originally plan for: when I built the chat widget, the knowledge base was just \"import the same three files and compile them into a system prompt.\" No separate content pipeline, no keeping two sources in sync. The bot knows exactly what the site says, because it's reading the same array.",
      "## Why a chatbot, and why not a form",
      "The site used to have a floating mascot that nudged visitors toward `/journey`. It was charming and did exactly one thing. I replaced it with a widget that can answer real questions — \"what's Saurabh's experience with Next.js,\" \"how do I reach him,\" \"what's his best project\" — grounded in the actual site content and a live resume, not a canned FAQ.",
      "The one constraint that shaped everything downstream: it runs on a free-tier LLM API (Zhipu AI's GLM), which means a shared quota across every visitor to the site. A single bot or a slow news day of traffic can exhaust a free tier that isn't rate-limited properly. Most of the design below exists because of that one constraint.",
      "## Streaming without a Server Action",
      "The obvious Next.js instinct is to reach for a Server Action. I didn't, because Server Actions use React's action-encoding protocol — they're not a plain `fetch()`, so a `fetch`-based streaming client fights the framework instead of using it. A Route Handler (`app/api/chat/route.ts`) returning a streamed `Response` is the idiomatic path: plain `fetch()` in, a `ReadableStream` of UTF-8 text-deltas out, no client-side SSE parsing needed.",
      "Server-side, the handler re-emits GLM's own SSE stream as plain text chunks, so the browser just appends bytes as they arrive. No AI SDK, no extra dependency — GLM's API is OpenAI-compatible, so it's a raw `fetch` in both directions.",
      "## The resume problem",
      "The resume is a PDF that gets re-uploaded independently of code deploys — it needed to be readable without requiring a redeploy every time it changed, but also without hitting Firebase Storage on every single chat message. The answer is a module-scoped cache with a one-hour TTL: fetch and parse (via `unpdf`, not `pdf-parse` — the latter does a synchronous `fs.readFileSync` against a bundled fixture at import time, a known footgun under serverless bundling) on first request, serve from memory until the hour is up, then refresh transparently on the next request after that.",
      "Concurrent requests during a cache miss coalesce onto a single in-flight fetch rather than each firing their own — otherwise a burst of traffic right as the cache expires would trigger a thundering herd against Storage.",
      "## Guardrails as an actual written contract",
      "The system prompt isn't just \"be helpful.\" It's a short spec: what's in scope (me, my work, my resume — nothing else), how to handle being asked if it's a bot (answer honestly, stay warm about it), what to do when it doesn't know something (say so, don't invent), and explicit instructions to treat the reference material as data rather than instructions — which matters because a resume is user-uploaded-ish content that a prompt-injection attempt could theoretically hide text inside.",
      "There's also a formatting contract most people wouldn't think to write down: the chat UI renders a small, deliberate subset of markdown (bold, dash-lists) and nothing else. Early on the model would occasionally reach for headings or backticks the UI doesn't understand, which just showed up as literal asterisks and hash marks in the bubble. The fix wasn't a rendering hack — it was telling the model exactly what's safe to use.",
      "## Two ways to run out of quota, two rate limiters",
      "Per-IP throttling stops one visitor from hammering the endpoint, but it doesn't protect the shared free-tier budget from ordinary aggregate traffic across every visitor — and it can't, because Vercel runs multiple serverless instances with no shared memory between them. An in-memory counter on one instance knows nothing about the requests landing on another.",
      "The actual protection is a Firestore transaction against a day-keyed document — every visitor's request increments the same counter, and a new UTC date is automatically a fresh document, so there's no cron job resetting anything. The two limiters answer different questions: \"is this one visitor going too fast\" and \"has the whole site used its daily budget,\" and you need both.",
      "## Ephemeral by design",
      "Nothing about a conversation's content is stored server-side, anywhere. Messages live in the browser tab's state for the session and vanish on refresh. That wasn't the default I'd have picked for debugging convenience, but it was the right call for a widget that might see people asking candid questions about a stranger's career — there's no reason to be the system holding onto that.",
      "## What actually broke, twice",
      "The free-tier model name I'd guessed at launch (a plausible-looking placeholder) simply didn't exist on the account — the API said so plainly once I had a real key to test against. The model that did work turned out to be a reasoning model: left to its defaults, it spent its entire token budget on internal chain-of-thought and never reached an actual answer. The fix was a single request field disabling the reasoning phase — but finding that took reading the actual streamed output chunk by chunk, not just the docs.",
      "Second: closing the chat panel mid-response — tab closed, navigation, or just a fast click — left the server still trying to write to a stream nobody was reading, throwing the same error into the logs on every subsequent chunk. `ReadableStream` has a `cancel()` hook for exactly this; the fix was routing the upstream GLM reader through it so a disconnect actually stops the read loop instead of failing silently, repeatedly, into a log file.",
      "Neither bug was visible in a quick manual test. Both showed up only once I stopped treating \"it returned 200 once\" as proof of correctness and started reading server logs after every change.",
    ],
  },
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
