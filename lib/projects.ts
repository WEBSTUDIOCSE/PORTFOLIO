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
  /**
   * LinkedIn launch posts. Array because a single project often gets
   * multiple posts (announcement, demo, follow-up). Each entry renders
   * as its own card on the detail page.
   */
  linkedinPosts?: Array<{
    urn: string;
    /** Optional label, e.g. "Launch post", "Workflow demo". */
    label?: string;
    /** Reach metric, e.g. "841 launch-day impressions". */
    impressions?: string;
  }>;

  // ─── Detail-page fields (rendered on /work/[slug]) ───────
  /** The problem this project solves — one paragraph. */
  problem?: string;
  /** Approach / architecture — bullet points. */
  approach?: string[];
  /** Outcome / impact — bullet points with numbers where possible. */
  outcome?: string[];
  /** Lessons learned — bullet points. */
  lessons?: string[];

  /**
   * Mermaid diagram source for the project's architecture. Rendered
   * by <MermaidDiagram /> on the detail page. Generated per-project
   * by running the architecture-diagram prompt in each repo's Claude
   * Code session, then pasting the resulting flowchart here.
   */
  diagram?: string;
  /** Caption that sits beneath the diagram. Plain text. */
  diagramCaption?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "openclaw",
    number: "P-001",
    title: "OpenClaw — 15-agent autonomous system",
    oneLiner:
      "A self-hosted AI agency on a $10/month VPS — 15 sub-agents across three agencies (Dev/Shuri, Creative/Maya, LinkedIn/Natasha) reporting to Jarvis the COO. One Telegram message kicks off a full product cycle: build → QA → deploy → post.",
    role: "Founder · solo engineer",
    year: "2025",
    stack: [
      "Hostinger KVM2 VPS",
      "Docker",
      "GLM-5",
      "Groq",
      "Gemini 2.5 Flash",
      "Claude Code",
      "Telegram Bot",
      "Firebase",
      "Vercel",
    ],
    metric: "15 agents · 3 agencies · 0 headcount",
    highlight: "← my favourite system",
    featured: true,
    linkedinPosts: [
      {
        urn: "urn:li:ugcPost:7449521566910062592",
        label: "Launch post",
        impressions: "856 launch-day impressions",
      },
      {
        urn: "urn:li:ugcPost:7450077524145078272",
        label: "Workflow demo",
        impressions: "841 launch-day impressions",
      },
    ],
    problem:
      "Building AI-powered products solo means orchestrating dozens of moving parts across research, design, code, deploy, QA, content, and marketing — every day. The existing SaaS multi-agent platforms lock you in, leak your data, or stack subscriptions. I wanted a self-hosted agency I owned end-to-end: cheap to run, fork-able, fully customisable. One Telegram message in, a shipped product out.",
    approach: [
      "Three-layer hierarchy on a $10/month Hostinger KVM2 VPS (Docker). Layer 1: Jarvis the COO. Layer 2: agency CEOs — Shuri (Dev), Maya (Creative), Natasha (LinkedIn). Layer 3: 15 specialised sub-agents.",
      "Jarvis runs a ReAct loop with persistent context in SOUL.md (identity / behaviour), USER.md (preferences), and MEMORY.md (running state). The single point of contact is a Telegram Bot — you message Jarvis, Jarvis routes.",
      "Routine routing decisions run on Groq's free tier (cheap + fast). Heavier models are invoked only on explicit request. Image and video agents always require user confirmation before firing.",
      "Dev Agency (Shuri): Coder uses GLM-5 via Claude Code for implementation; UI uses Gemini 2.5 Flash + Stitch MCP for Apple / Vercel / Stripe-grade design; Research uses a Tavily → Gemini → web_fetch fallback chain; Git, Deploy (Vercel CLI), and QA (build / TypeScript / secrets / .gitignore / package.json checks) are rule-based.",
      "Creative Agency (Maya): hero images, short-form video, voiceover. Brand-check filter sits at the output stage — every visual passes the brand style check before shipping.",
      "LinkedIn Agency (Natasha): a fully isolated pipeline — Research → Content → PDF Carousel → Firebase → Auto-post. Carousels render via headless Chromium at 1080×1350 with hand-written light/dark templates, then ship straight to LinkedIn.",
      "OpenClaw Skills — a CLI-loaded skill library — keeps every agent focused, structured, and on-brand across runs. No prompt drift between sessions.",
      "Shared state in Firebase, not prompt-passing. Agents read and write to the same store — the moment that became true, hallucinations dropped sharply.",
    ],
    outcome: [
      "15 agents across 3 agencies — fully autonomous after task input.",
      "Running 24/7 on a $10/month Hostinger KVM2 VPS, zero downtime since launch.",
      "Replaces what would otherwise be a 5–7 person team for a side project.",
      "No SaaS subscriptions stacking up, no vendor lock-in, no data leaving the box. Fully customisable agency structure — fork it, rewire it, add your own CEOs.",
    ],
    lessons: [
      "Specialisation beats generalisation. Narrow-scope agents with clear boundaries fail less than one big \"do everything\" model.",
      "Shared state > prompt-passing. The moment agents share a store, hallucinations drop sharply.",
      "One COO > round-robin routing. A single agent deciding who-does-what prevents infinite loops between peer agents.",
      "Brand-check is mandatory — Maya (Creative) has a brand-checker built in so every output passes a visual style filter before shipping.",
      "Persistent context files (SOUL / USER / MEMORY) beat re-prompting every turn. The agent stays itself across days, not just turns.",
    ],
    diagram: `flowchart TD
  User[User]
  TG[Telegram Bot]

  subgraph L1[Layer 1 · COO]
    Jarvis[Jarvis · ReAct]
    Context[(SOUL.md · USER.md · MEMORY.md)]
    Groq[[Groq · routing, free tier]]
  end

  subgraph L2[Layer 2 · Agency CEOs]
    Shuri[Shuri · Dev]
    Maya[Maya · Creative]
    Natasha[Natasha · LinkedIn]
  end

  subgraph DevAgents[Dev specialists]
    DevPipe[Coder GLM-5 · UI Gemini 2.5 + Stitch · Research Tavily · Git · Deploy · QA]
  end

  subgraph CreativeAgents[Creative specialists]
    CreativePipe[Hero images · Short-form video · Voiceover · brand check]
  end

  subgraph LIAgents[LinkedIn specialists]
    LIPipe[Research · Content · PDF Carousel headless Chromium 1080×1350 · Auto-post]
  end

  subgraph Out[External]
    Vercel[[Vercel]]
    Firebase[[Firebase]]
    LinkedIn[[LinkedIn API]]
  end

  User --message--> TG
  TG --command--> Jarvis
  Jarvis --persistent context--> Context
  Jarvis --route--> Groq
  Jarvis --dev task--> Shuri
  Jarvis --creative task--> Maya
  Jarvis --LI task--> Natasha
  Shuri --dispatch--> DevAgents
  Maya --dispatch--> CreativeAgents
  Natasha --dispatch--> LIAgents
  DevAgents --deploy--> Vercel
  DevAgents --shared state--> Firebase
  LIAgents --carousel PDF--> Firebase
  LIAgents --auto-post--> LinkedIn`,
    diagramCaption:
      "Three-layer agency hierarchy on a $10/month Hostinger VPS. A single Telegram message reaches Jarvis (Layer 1 COO running a ReAct loop with persistent context in SOUL.md / USER.md / MEMORY.md). Jarvis routes through Groq's free tier to one of three agency CEOs — Shuri (Dev), Maya (Creative), Natasha (LinkedIn) — each owning a narrow pipeline of specialists. Heavy models (GLM-5, Gemini 2.5 Flash) are invoked only when needed; image and video agents always confirm with the user before firing. Shared Firebase state, not prompt-passing, is what keeps the whole agency coherent — and what makes a $10/month VPS replace a 5–7 person team.",
  },
  {
    slug: "claratto",
    number: "P-002",
    title: "claratto — AI tutoring platform",
    oneLiner:
      "Users learn any topic through a multi-turn Socratic AI tutor, get tested, and watch a persistent 3D brain visualization grow as topics are proven — not just marked complete. Live and monetised — Razorpay subscriptions, credit-based usage tiers, Firebase auth, syllabus-to-curriculum AI generation, voice-based mock interviews.",
    role: "Founder · solo engineer",
    year: "2025",
    stack: ["Next.js 16", "Firebase", "Gemini", "Three.js", "Razorpay"],
    metric: "Live · claratto.com",
    href: "https://claratto.com",
    featured: true,
    problem:
      "Most AI tutors just answer questions or dump information — they don't verify you actually learned anything, and there's no persistent sense of progress beyond a checklist. I wanted a tutor that teaches in a genuinely Socratic, multi-turn way, tests comprehension before marking anything \"done,\" and gives the learner something tangible to watch grow as proof of mastery — not just another progress bar.",
    approach: [
      "Multi-turn Socratic AI tutor built on a TEACHING_STYLE protocol: real depth delivered in chunks, with a genuine comprehension check between each chunk before the tutor moves on.",
      "A cognitive-science reinforcement loop layered on top of that — recall checkpoints, spaced repetition, and teach-back — so understanding is revisited, not just delivered once.",
      "Syllabus-to-curriculum generation: users upload a syllabus (PDF/DOCX/TXT), Gemini parses it into subjects → topics → difficulty → prerequisites, each with its own AI-generated teacher persona.",
      "Persistent 3D brain visualization in Three.js: proven topics render as glowing nodes, positioned by an AI-classified domain taxonomy (mechanism / conceptual / factual / skill / emotional) — a node only lights up after passing a test, never just from reading.",
      "Voice-based mock interviews via Sarvam's voice models as a separate assessment surface, deliberately not wired into the core brain/learning loop.",
      "Razorpay subscriptions with credit-based usage tiers (lib/plans.ts, lib/credits.ts) gate usage throughout, on top of Firebase auth.",
    ],
    outcome: [
      "Live and monetised at claratto.com.",
      "Real users proving topics through multi-turn Socratic sessions, not just marking lessons complete.",
      "Working credit-based subscription billing via Razorpay, with Firebase auth end to end.",
    ],
    lessons: [
      "Comprehension checks between chunks — not just at the end — is what makes a tutor feel Socratic instead of a lecture with a pop quiz bolted on.",
      "Growth has to be provable, not just visual. Gating the brain's growth on passing a test (never on reading) is what keeps the visualization honest as a signal of mastery instead of decoration.",
      "Splitting assessment (voice mock interviews) from the core learning loop kept both systems simpler than trying to unify them into one flow.",
    ],
    diagram: `flowchart TD
  User[User]
  Auth[[Firebase Auth]]

  subgraph Onboard[Syllabus to curriculum]
    Upload[Upload syllabus · PDF/DOCX/TXT]
    Parse[[Gemini · parse]]
    Curriculum[(Subjects to Topics · difficulty · prerequisites)]
    Persona[AI teacher persona per topic]
  end

  subgraph Learn[Socratic learning loop]
    Tutor[Multi-turn tutor · TEACHING_STYLE protocol]
    Chunk[Depth delivered in chunks]
    Check[Comprehension check]
    Reinforce[Recall checkpoints · spaced repetition · teach-back]
  end

  subgraph Proof[Proof of mastery]
    Test[Test]
    Classify[[AI domain classifier]]
    Brain[(3D Brain · Three.js)]
  end

  subgraph Assess[Separate assessment]
    Voice[[Sarvam voice models]]
    Interview[Voice-based mock interview]
  end

  subgraph Billing[Billing]
    Razorpay[[Razorpay]]
    Credits[(Credit-based usage tiers)]
  end

  User --auth--> Auth
  User --upload--> Upload
  Upload --> Parse --> Curriculum --> Persona --> Tutor
  Tutor --> Chunk --> Check
  Check -->|pass| Reinforce
  Check -->|retry| Chunk
  Reinforce --> Test
  Test -->|pass| Classify --> Brain
  User --> Interview --> Voice
  User --subscribe--> Razorpay --> Credits
  Credits --gate usage--> Tutor`,
    diagramCaption:
      "The keystone is that growth is earned, not given — the 3D brain only lights up a node after a topic passes its test, never just from being read or chunked through. Gemini turns an uploaded syllabus into a full curriculum tree with per-topic teacher personas; the Socratic tutor then delivers each topic in comprehension-gated chunks (the TEACHING_STYLE protocol) before a topic is even eligible for testing. A pass routes through an AI domain classifier that positions the new node in the brain by cognitive type — mechanism, conceptual, factual, skill, or emotional — so the visualization reads as an actual map of what's been mastered, not a progress bar. Voice-based mock interviews (Sarvam) sit alongside as a separate assessment surface, and Razorpay-backed credit tiers gate usage throughout.",
  },
  {
    slug: "cinematictale",
    number: "P-003",
    title: "CinematicTale — AI storytelling SaaS",
    oneLiner:
      "Users create characters, generate narratives, produce AI images via PuLID face-swap. Live and monetised — Razorpay subscriptions, Firebase auth, 7-phase launch playbook.",
    role: "Founder · solo engineer",
    year: "2025",
    stack: ["Next.js 16", "Firebase", "Gemini", "fal.ai", "Razorpay"],
    metric: "Live · cinematictale.com",
    href: "https://cinematictale.com",
    featured: true,
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
      "Real users generating real stories with consistent characters.",
    ],
    lessons: [
      "Character consistency is the leap from \"AI image generator\" to \"AI storytelling.\" It's the entire product.",
      "Subscription requires bulletproof auth. Razorpay integration is straightforward; the hard part is handling the edge cases (cancellation mid-cycle, plan changes, payment failures).",
      "Marketing is a system, not an afterthought. The 7-phase playbook turned launch from \"hit publish and pray\" into a deliberate sequence.",
    ],
    diagram: `flowchart TD
  subgraph Client
    User[User Browser]
    UI[Next.js App Router]
  end

  subgraph Server
    API[API Routes]
    Adapter[AI Adapter + Circuit Breaker]
    RWH[Razorpay webhook]
    KWH[Kie Veo webhook]
  end

  subgraph External
    Auth[[Firebase Auth]]
    Upstash[[Upstash Redis]]
    Gemini[[Gemini Nano Banana / Imagen / Text]]
    Kie[[Kie.AI Veo / Flux]]
    Razorpay[[Razorpay Checkout]]
  end

  subgraph Data
    CS[(Cloud Storage)]
    FS[(Firestore)]
  end

  User --prompt + reference photo--> UI
  UI --story request--> API
  API --verify session--> Auth
  API --quota check--> Upstash
  API --dispatch generate--> Adapter
  Adapter --primary--> Gemini
  Adapter --fallback on 5xx / 429 / circuit open--> Kie
  Gemini --story + image bytes--> API
  Kie --async task id--> API
  API --image bytes--> CS
  API --story doc + pages + credit debit--> FS
  Razorpay --HMAC payment.captured--> RWH
  Kie --HMAC task.success--> KWH
  RWH --grant credits--> FS
  KWH --video URL or credit refund--> FS
  UI --read story--> FS
  UI --render image / video--> CS`,
    diagramCaption:
      "The AI Adapter is the architectural keystone — every storybook page, comic panel, and video clip flows through a Gemini-primary, Kie.AI-fallback chain guarded by a circuit breaker, so a Gemini rate-limit, content-block, or outage transparently retries on Kie's Veo/Flux without the user seeing failover. Async paths (Video Tale generation, Razorpay subscriptions) close the loop via HMAC-signed webhooks that grant credits and stitch video URLs back into the same Firestore documents the UI is already reading — so the page just re-renders when the work finishes, no polling protocol needed.",
  },
  {
    slug: "elite-mindset-forge",
    number: "P-004",
    title: "Elite Mindset Forge — autonomous content platform",
    oneLiner:
      "A read-only website fed by a separate Agent Portal: scheduled triggers spin up AI agents that generate every quote, image, and video; Firestore fans them out to Instagram, Facebook, push subscribers, and the site. Multilingual (English / Hindi / Marathi). Zero human in the loop.",
    role: "Founder · solo engineer",
    year: "2025",
    stack: [
      "Next.js 16",
      "Gemini Pro",
      "Imagen",
      "Veo",
      "Firebase",
      "Instagram API",
      "PWA",
    ],
    metric: "AI-agent driven · runs itself · @elitemindset.forge",
    href: "https://www.elitemindsetforge.com/",
    featured: true,
    problem:
      "Running a content-driven Instagram brand solo means daily posting becomes the founder's second full-time job — there's no slot in the daily routine to manage multiple pages manually. I wanted the brand to run itself: content generated, expanded, published, and notified without a human in the loop.",
    approach: [
      "Two-system split: elitemindsetforge.com is purely read-only — it doesn't generate anything. All content generation lives in a separate Agent Portal backend that I run.",
      "Scheduled Firebase Cloud Functions fire at specific times of day to kick off the Agent Portal's content engine — no human pressing a button.",
      "Inside the engine: Gemini Pro + RAG writes the motivational quote in three languages (English / Hindi / Marathi); Google Imagen generates the static visual; Google Veo and Kling AI cover short-form video.",
      "Output lands once in a shared Cloud Firestore (doc + metadata) and Cloud Storage (media bytes). Firestore is the single source of truth for every consumer downstream.",
      "Fan-out from Firestore happens in parallel: Autogram Poster (my custom auto-publisher) reads the new doc and posts to Instagram + Facebook via their Graph APIs; a Firestore trigger fires a Cloud Function that multicasts FCM push notifications to subscribers; the website renders the same doc as soon as it lands.",
      "AI-expansion: short Instagram quotes get expanded into longer-form blog posts by AI and surfaced on the site with categories, SEO, and favourites.",
      "Website stack: Firebase Auth (Email + Google OAuth), AdSense + GA4 monetisation, swipe-based quote gallery, PWA (installable + offline), branch-based CI/CD (GitHub Actions → Vercel).",
    ],
    outcome: [
      "Live at elitemindsetforge.com — every quote, image, and video on the page is AI-generated.",
      "Daily auto-posting to [@elitemindset.forge](https://www.instagram.com/elitemindset.forge/) on Instagram + Facebook via the Autogram Poster pipeline.",
      "Three-language reach (English / Hindi / Marathi) on every quote, direct from Gemini.",
      "PWA installable and offline-capable; FCM keeps returning users in the loop the moment new content drops.",
    ],
    lessons: [
      "The real product isn't the website — it's the pipeline. The site is just one of three surfaces where the same AI-generated content lands; Autogram Poster is the connective tissue.",
      "Instagram's Graph API rate limits look scary on paper but are easy to respect once you batch and queue. Auto-publishing only needs OAuth wired once.",
      "Multi-language AI translation is table-stakes for India now. Gemini handles Indian languages well enough to ship short content without human review.",
      "AdSense + GA4 is a 30-minute setup that pays for the VPS forever. No reason to skip it.",
    ],
    diagram: `flowchart TD
  subgraph Portal[Agent Portal · backend]
    Cron[Scheduled trigger · daily times]
    Engine[Content engine]
    Cron --invoke--> Engine
  end

  subgraph AI[AI Models]
    GeminiText[[Gemini Pro + RAG]]
    Imagen[[Google Imagen]]
    Veo[[Google Veo]]
    Kling[[Kling AI]]
  end

  subgraph Data[Shared Data]
    FS[(Cloud Firestore)]
    Storage[(Cloud Storage)]
  end

  subgraph Pub[Fan-out Surfaces]
    Poster[Autogram Poster]
    IG[[Instagram Graph API]]
    FB[[Facebook Graph API]]
    Func[Firestore trigger]
    FCM[[FCM push]]
  end

  subgraph Web[elitemindsetforge.com · read-only]
    Site[Next.js · swipe gallery · PWA]
    Auth[[Firebase Auth]]
  end

  Engine --text prompt--> GeminiText
  GeminiText --quote · 3 languages--> Engine
  Engine --media prompt--> Imagen
  Engine --media prompt--> Veo
  Engine --media prompt--> Kling
  Imagen --image--> Engine
  Veo --video--> Engine
  Kling --image / video--> Engine
  Engine --doc + metadata--> FS
  Engine --media bytes--> Storage
  FS --new doc--> Poster
  Poster --post + media--> IG
  Poster --post + media--> FB
  FS --new doc--> Func
  Func --multicast--> FCM
  Site --read quotes--> FS
  Site --render media--> Storage
  Site --session--> Auth`,
    diagramCaption:
      "The website is a pure read-only consumer — content originates in a separate Agent Portal backend, kicked off by scheduled Firebase triggers at specific times of day. The Engine calls the AI models (Gemini Pro + RAG for trilingual text; Imagen / Veo / Kling for visuals) and writes the result to a shared Firestore. From there it fans out in parallel: Autogram Poster auto-posts to Instagram + Facebook, a Firestore trigger multicasts FCM push notifications to subscribers, and elitemindsetforge.com just renders whatever's already in the database. Nothing is generated on the website itself.",
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
