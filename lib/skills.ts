export type Skill = {
  name: string;
  summary: string;
  projectSlugs: string[];
};

export type SkillGroup = {
  id: string;
  label: string;
  title: string;
  description: string;
  skills: Skill[];
};

// This is intentionally a small, curated layer over PROJECTS rather than a
// second resume. Every project reference below points back to a shipped system
// in lib/projects.ts, so the landing page stays honest as the portfolio grows.
export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "product",
    label: "Product surfaces",
    title: "Interfaces that make complex systems feel obvious.",
    description:
      "I build the surface people actually use: fast product flows, spatial interfaces, learning tools, and documents that turn infrastructure into a clear next step.",
    skills: [
      {
        name: "Next.js + React",
        summary: "Product foundations for authenticated, content-heavy, and AI-native web apps.",
        projectSlugs: ["knownin", "claratto", "cinematictale", "elite-mindset-forge", "prpilot"],
      },
      {
        name: "3D product UI",
        summary: "React Three Fiber and Three.js used when spatial feedback is part of the product, not decoration.",
        projectSlugs: ["cubicle", "claratto"],
      },
      {
        name: "PDF + document systems",
        summary: "Structured data turned into useful, exportable documents and tailored work artifacts.",
        projectSlugs: ["knownin", "openclaw", "prpilot"],
      },
      {
        name: "Responsive product design",
        summary: "Layouts that keep their hierarchy on a phone, laptop, and large screen instead of shrinking one desktop view.",
        projectSlugs: ["knownin", "cubicle", "claratto", "elite-mindset-forge"],
      },
    ],
  },
  {
    id: "intelligence",
    label: "AI systems",
    title: "Models with boundaries, memory, and a job to do.",
    description:
      "The interesting part is rarely the model call. It is the routing, verification, fallback, and state around it that turns an impressive demo into a dependable product.",
    skills: [
      {
        name: "Gemini + multimodal AI",
        summary: "Text, image, video, parsing, tutoring, and fit analysis wired into real product workflows.",
        projectSlugs: ["knownin", "cubicle", "openclaw", "claratto", "cinematictale", "elite-mindset-forge"],
      },
      {
        name: "MCP + agent tools",
        summary: "Scoped tools and specialised agents that let AI act through explicit product boundaries.",
        projectSlugs: ["knownin", "openclaw"],
      },
      {
        name: "AI orchestration",
        summary: "Routing, delegation, durable context, circuit breakers, and human confirmation around model work.",
        projectSlugs: ["cubicle", "openclaw", "cinematictale", "prpilot"],
      },
      {
        name: "Generative media",
        summary: "Character-consistent imagery, short-form video, voice, and brand-aware creative pipelines.",
        projectSlugs: ["cubicle", "openclaw", "cinematictale", "elite-mindset-forge"],
      },
    ],
  },
  {
    id: "backend",
    label: "Backend + data",
    title: "A durable spine under every polished screen.",
    description:
      "The front end can be expressive because the underlying system is explicit about auth, queues, persistence, realtime events, billing, and the shape of truth.",
    skills: [
      {
        name: "Firebase + Firestore",
        summary: "Auth, tenant-scoped data, shared state, storage, and event-driven product backends.",
        projectSlugs: ["knownin", "openclaw", "claratto", "cinematictale", "elite-mindset-forge"],
      },
      {
        name: "FastAPI + async workers",
        summary: "Protected control planes, queues, scheduled work, and long-running tasks that do not block the UI.",
        projectSlugs: ["cubicle", "prpilot"],
      },
      {
        name: "PostgreSQL + pgvector",
        summary: "Durable records and searchable agent memory underneath a realtime experience.",
        projectSlugs: ["cubicle", "prpilot"],
      },
      {
        name: "Realtime + voice",
        summary: "Socket events, WebRTC paths, push notifications, and webhook loops that close the product loop.",
        projectSlugs: ["cubicle", "claratto", "elite-mindset-forge", "cinematictale", "prpilot"],
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping systems",
    title: "From first commit to a product people can rely on.",
    description:
      "I care about the operational edge cases too: self-hosting, billing verification, provider fallbacks, CI/CD, publishing, and keeping a system legible after launch.",
    skills: [
      {
        name: "Docker + self-hosting",
        summary: "Composable infrastructure with ownership over data, services, files, and deployment boundaries.",
        projectSlugs: ["cubicle", "openclaw", "prpilot"],
      },
      {
        name: "Billing + access control",
        summary: "Subscriptions, credits, verified webhooks, scopes, and usage limits enforced at the server boundary.",
        projectSlugs: ["knownin", "claratto", "cinematictale"],
      },
      {
        name: "Automation + publishing",
        summary: "Scheduled generation, content fan-out, social APIs, and deployment flows that keep moving without a manual checklist.",
        projectSlugs: ["openclaw", "elite-mindset-forge"],
      },
      {
        name: "Vercel + production delivery",
        summary: "A clean path from a tested branch to a public product, with the boring operational details handled deliberately.",
        projectSlugs: ["knownin", "openclaw", "elite-mindset-forge", "prpilot"],
      },
    ],
  },
];
