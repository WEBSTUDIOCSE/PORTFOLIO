// Single source of truth for project metadata.
// Used by <SelectedWork /> on the homepage and /work/[slug] detail
// pages. Livlong is intentionally not here — it's work experience,
// already covered in the Experience section. This list is reserved
// for personal projects + open source.

export type Project = {
  /** URL slug — /work/[slug] route. */
  slug: string;
  /** Mono badge, e.g. "P-001". */
  number: string;
  title: string;
  /** One-sentence value prop. */
  oneLiner: string;
  /** Your role on the project. */
  role: string;
  /** Year shipped. */
  year: string;
  /** Tech stack chips. */
  stack: string[];
  /** Recruiter-bait metric. */
  metric?: string;
  /** External link — live demo or repo. */
  href?: string;
  /** Optional sketchbook annotation (Architects Daughter font). */
  highlight?: string;
  /** Surface on the homepage SelectedWork reel. */
  featured?: boolean;
  /** LinkedIn post URN for the launch post. */
  linkedinPostUrn?: string;
  /** Reach metric for the LinkedIn launch post — used by Press section. */
  linkedinImpressions?: string;

  // ─── Detail-page fields (rendered on /work/[slug]) ───────
  /** The problem this project solves — one paragraph. */
  problem?: string;
  /** Approach / architecture — bullet points. */
  approach?: string[];
  /** Outcome / impact — bullet points with numbers where possible. */
  outcome?: string[];
  /** Lessons learned — bullet points. */
  lessons?: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "openclaw",
    number: "P-001",
    title: "OpenClaw — 15-agent autonomous system",
    oneLiner:
      "A multi-agent AI pipeline running on my VPS. Three agencies (Dev, LinkedIn, Creative) reporting to Jarvis the COO, zero human intervention after task input.",
    role: "Solo · architect & engineer",
    year: "2025",
    stack: ["Next.js", "TypeScript", "Firebase", "GLM-5", "Vercel"],
    metric: "15 agents · 3 agencies · 0 headcount",
    highlight: "← my favourite system",
    featured: true,
    linkedinPostUrn: "urn:li:ugcPost:7450077524145078272",
    linkedinImpressions: "841 launch-day impressions",
    problem:
      "Shipping software solo means context-switching between research, design, code, deploy, QA, content, marketing — every day. One person can't do all of it without dropping balls. I wanted a system that handled the entire pipeline so I could focus on the one thing that matters: deciding what to build next.",
    approach: [
      "Three specialised agencies, each with its own CEO: Shuri (Dev), Natasha (LinkedIn), Maya (Creative).",
      "One COO agent (Jarvis) above all three — the single point of contact. You give Jarvis a task; Jarvis routes it.",
      "Each agency has narrow-scope sub-agents (Coder, UI, Research, Git, Deploy, QA for Dev; Research, Content, PDF, Firebase for LinkedIn; Hero images, Short-form video, Voiceover for Creative).",
      "Shared state in Firebase — agents read and write to the same store rather than passing prompts. Keeps everyone coherent.",
      "Built on GLM-5 for cost, with hand-tuned prompts per role. The agents don't \"think\" generically — each one is a specialist with a small, well-defined job.",
    ],
    outcome: [
      "15 agents across 3 agencies — fully autonomous after task input.",
      "841 impressions on the launch announcement (LinkedIn).",
      "Running 24/7 on personal VPS, zero downtime since launch.",
      "Replaced what would otherwise be a 5-7 person team for a side project.",
    ],
    lessons: [
      "Specialisation beats generalisation. Narrow-scope agents with clear boundaries fail less than one big \"do everything\" model.",
      "Shared state > prompt-passing. The moment agents share a store, hallucinations drop sharply.",
      "One COO > round-robin routing. A single agent deciding who-does-what prevents infinite loops between peer agents.",
      "Brand-check is mandatory — Maya (Creative) has a brand-checker built in so every output passes a visual style filter before shipping.",
    ],
  },
  {
    slug: "cinematictale",
    number: "P-002",
    title: "CinematicTale — AI storytelling SaaS",
    oneLiner:
      "Users create characters, generate narratives, produce AI images via PuLID face-swap. Live and monetised — Razorpay subscriptions, Firebase auth, 7-phase launch playbook.",
    role: "Founder · solo engineer",
    year: "2025",
    stack: ["Next.js 16", "React 19", "Firebase", "Gemini", "fal.ai", "Razorpay"],
    metric: "Live · cinematictale.com",
    href: "https://cinematictale.com",
    featured: true,
    linkedinPostUrn: "urn:li:ugcPost:7449521566910062592",
    linkedinImpressions: "856 launch-day impressions",
    problem:
      "Generating AI imagery for stories has a fundamental coherence problem: every frame produces a different person. Without character consistency, you can generate \"a girl walking down a street\" twenty times and get twenty different girls. That's not storytelling — that's a slideshow.",
    approach: [
      "Use PuLID face-swap (fal.ai) as the core mechanism — generate the scene, then face-swap the consistent character in.",
      "Firebase Auth + Firestore as the backbone: characters, stories, generations all live in user-scoped documents.",
      "Multi-step generation: user defines character → writes story → system generates scenes one at a time with face conditioning.",
      "Razorpay subscription wired through Firebase — cancellation, upgrade, plan management all handled.",
      "7-phase marketing playbook from Day 0: Foundation → Organic → PH Launch → Creator Seeding → India Push → SEO → Paid.",
    ],
    outcome: [
      "Live and monetised at cinematictale.com.",
      "856 launch-day impressions on the announcement.",
      "Real users generating real stories with consistent characters.",
    ],
    lessons: [
      "Character consistency is the leap from \"AI image generator\" to \"AI storytelling.\" It's the entire product.",
      "Subscription requires bulletproof auth. Razorpay integration is straightforward; the hard part is handling the edge cases (cancellation mid-cycle, plan changes, payment failures).",
      "Marketing is a system, not an afterthought. The 7-phase playbook turned launch from \"hit publish and pray\" into a deliberate sequence.",
    ],
  },
  {
    slug: "elite-mindset-forge",
    number: "P-003",
    title: "Elite Mindset Forge — autonomous content platform",
    oneLiner:
      "Writes every quote, generates every image and video, auto-posts to Instagram + Facebook. Multilingual (English / Hindi / Marathi). Zero human in the loop.",
    role: "Solo · architect",
    year: "2025",
    stack: ["Next.js 16", "Gemini Pro", "Imagen", "Veo", "Firebase", "PWA"],
    metric: "856 launch-day impressions · 100% AI-generated",
    href: "https://elitemindsetforge.com",
    featured: true,
    problem:
      "Running an AI-content brand needs daily output to stay relevant. Manual posting kills the founder — you become an SMM employee for your own product. I wanted the brand to run itself.",
    approach: [
      "Full content pipeline: Gemini Pro writes quotes, Google Imagen generates static visuals, Google Veo creates short-form video, Kling AI handles variants.",
      "Auto-publishing to Instagram + Facebook via their respective APIs — OAuth handled once at setup, then it just runs.",
      "Multi-language (English / Hindi / Marathi) — Gemini handles the translations natively, no separate translator needed.",
      "PWA so the site is installable on mobile; Firebase FCM for real-time push notifications when new content drops.",
      "AdSense + GA4 for monetisation. Branch-based CI/CD: GitHub Actions → Vercel.",
      "Swipe-based quote gallery on the front-end, blog system with categories / SEO / favourites.",
    ],
    outcome: [
      "Live at elitemindsetforge.com. 100% of content is AI-generated.",
      "856 launch-day impressions on LinkedIn.",
      "Multi-language reach across three Indian languages — direct from Gemini, no manual translator.",
      "PWA installable and offline-capable.",
    ],
    lessons: [
      "Auto-publishing requires real OAuth — Instagram's Graph API has rate limits but is workable if you respect them.",
      "Multi-language AI translation is now table-stakes for India. Gemini handles Indian languages well enough to ship without human review for short content.",
      "AdSense + GA4 is a 30-minute setup that pays for the VPS forever. There's no reason to skip it.",
    ],
  },
  {
    slug: "konkan-diorama",
    number: "P-004",
    title: "Konkan diorama — this site",
    oneLiner:
      "The Saurabh Express. A scroll-driven 3D toy railway built with react-three-fiber. Five stations, one journey, lots of small details.",
    role: "Solo · personal",
    year: "2025",
    stack: ["Next.js 16", "three.js", "react-three-fiber"],
    metric: "60fps on laptop-class hardware",
    href: "/journey",
    highlight: "← scroll for the experience",
    featured: true,
    problem:
      "Most developer portfolios look identical: hero photo, project grid, contact form, send. I wanted mine to feel like a place — somewhere you'd remember, not somewhere you'd close.",
    approach: [
      "Built /journey as a scroll-driven 3D diorama — an Indian Railways WAP-7 locomotive moving along procedural rails.",
      "Five stations (Platform, Story, Skills, Projects, Contact) — each one a scroll viewport. Scroll position drives both the train motion and which station's content is active.",
      "Orthographic camera with an AutoFitOrtho helper so the scene fits the viewport on every aspect ratio.",
      "Konkan railway aesthetic — Studio Ghibli meets architectural maquette. Maroon enamel station signs, brass route-map medallions, golden-hour lighting.",
      "The character-scroll on the landing hero (this homepage) is a separate experiment — same scroll-driven craft, different medium (image sequence on canvas).",
    ],
    outcome: [
      "60fps on M-class laptops and modern Androids.",
      "~13MB GLB after gltf-transform optimisation.",
      "Unique among developer portfolios — recognisable as Konkan railway craft.",
    ],
    lessons: [
      "3D doesn't have to be heavy. Careful GLB optimisation, DRACO compression, and instanced meshes keep it under 13MB.",
      "Scroll-driven > play-button. Visitors don't realise it's 3D until they scroll, which removes the \"is this going to be slow?\" hesitation.",
      "The hero of a portfolio is a place, not a banner. Build somewhere people want to walk through.",
    ],
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
