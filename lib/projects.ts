// Single source of truth for project metadata.
// Used by <SelectedWork /> on the homepage today; will feed
// /work/[slug] detail pages in a follow-up.

export type Project = {
  /** URL slug — future /work/[slug] route. */
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
  /** LinkedIn post URN for embedding in /work/[slug] later.
   *  Format: "urn:li:ugcPost:<id>" or "urn:li:share:<id>" — full embed
   *  URL constructed as https://www.linkedin.com/embed/feed/update/<urn> */
  linkedinPostUrn?: string;
  /** Reach metric for the LinkedIn launch post — shown in the Press
   *  section. Separated from `metric` because that's the project's
   *  primary recruiter-bait, not the social-proof number. */
  linkedinImpressions?: string;
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
    // TODO(saurabh): verify URN mapping — assumed OpenClaw based on
    // newest-post ordering. Swap if it's actually a Mindset Forge post.
    linkedinPostUrn: "urn:li:ugcPost:7450077524145078272",
    linkedinImpressions: "841 launch-day impressions",
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
    // TODO(saurabh): verify URN mapping — assumed Mindset Forge.
    linkedinPostUrn: "urn:li:ugcPost:7449521566910062592",
    linkedinImpressions: "856 launch-day impressions",
  },
  {
    slug: "livlong-migration",
    number: "P-004",
    title: "Livlong 365 — Next.js 16 migration",
    oneLiner:
      "Led end-to-end migration of livlong.com to Next.js 16. Consolidated four Remix and Svelte modules under React Router v7, shipped 60+ reusable UI components across insurance and wellness verticals.",
    role: "Lead frontend engineer",
    year: "2024",
    stack: ["Next.js 16", "React Router v7", "TypeScript", "Tailwind", "shadcn/ui"],
    metric: "~45% LCP improvement · green Core Web Vitals",
    featured: true,
    // Third LinkedIn post the user shared — likely Livlong-related
    // (older URN). TODO(saurabh): verify and swap if unrelated.
    linkedinPostUrn: "urn:li:share:7436138816458973184",
  },
  {
    slug: "konkan-diorama",
    number: "P-005",
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
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
