// Work history — single source of truth, shared by the landing
// <Experience /> section and the /journey Experience station.
// (Education + certifications stay local to the landing section;
// only the roles are reused on the journey.)

export type Role = {
  company: string;
  type: "Full-time" | "Internship";
  role: string;
  subRole?: string;
  dates: string;
  duration: string;
  location: string;
  bullets: string[];
  stack: string[];
  current?: boolean;
  /** Path under public/. e.g. "/logos/livlong.jpg". If omitted, a
   *  monogram of the first letter renders in its place. */
  logo?: string;
  /** Hex bg for the logo cell — used when a logo image has padding
   *  or you want a brand-color square instead of the default card. */
  logoBg?: string;
  /** Small italic line below the company name. Used for ownership /
   *  parent-company context ("Backed by IIFL Group"). */
  companyTagline?: string;
};

export const ROLES: Role[] = [
  {
    company: "Livlong 365",
    type: "Full-time",
    role: "Software Developer",
    subRole: "Frontend Developer",
    dates: "Jul 2023 — Present",
    duration: "2 yrs 11 mos",
    location: "Thane, Maharashtra · On-site",
    current: true,
    logo: "/logos/livlong.jpg",
    companyTagline: "Backed by the IIFL Group",
    bullets: [
      "Strategic UI overhaul: Spearheaded the complete revamp of livlong.com, migrating the platform to Next.js 16. Improved Core Web Vitals (~45% LCP win) and user interactivity.",
      "Architectural migrations: Led the migration of complex legacy modules from Remix and Svelte to React Router v7, establishing a unified, maintainable code structure.",
      "Product engineering: Developed scalable component-driven UI for Insurance and Wellness verticals using Tailwind CSS + shadcn/ui — pixel-perfect responsiveness across three product lines.",
    ],
    stack: ["Next.js 16", "React", "TypeScript", "Tailwind", "shadcn/ui", "Node.js"],
  },
  {
    company: "Hapinee Solutions",
    type: "Internship",
    role: "Android Developer",
    dates: "Jan 2021 — Jun 2021",
    duration: "6 mos",
    location: "Remote",
    // Hapinee's LinkedIn logo is a low-quality placeholder, not a
    // brand mark. Monogram fallback ("H") reads cleaner. Drop a
    // proper logo at public/logos/hapinee.jpg to enable it.
    bullets: [
      "Led a team of 6 developers to design and build a custom CRM-based Android application from scratch.",
      "Built with Java + Firebase — real-time database integration and user authentication.",
      "Revamped an existing user-facing service application — significantly improved UI/UX and reduced reported user complaints by ~40%.",
      "Owned full development lifecycle: code reviews, task delegation, architectural planning.",
    ],
    stack: ["Java", "Firebase", "Android Studio", "XML"],
  },
];
