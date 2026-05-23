// Experience — work history + education + certifications. Sits
// between About and Currently. Vertical timeline (most recent first)
// because that's the format recruiters scan fastest on a portfolio.
//
// Education + certs are rendered smaller below the roles — they
// shouldn't compete with the role bullets for attention.

type Role = {
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

const ROLES: Role[] = [
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

type Education = {
  institution: string;
  degree: string;
  dates: string;
  grade: string;
};

const EDUCATION: Education[] = [
  {
    institution: "Gharda Institute of Technology, Ratnagiri",
    degree: "B.Tech · Computer Engineering",
    dates: "Jun 2019 — May 2023",
    grade: "Grade A",
  },
  {
    institution: "Gogate Joglekar College",
    degree: "High School Diploma · Science",
    dates: "Jul 2017 — May 2019",
    grade: "Grade A",
  },
];

type Certification = {
  name: string;
  issuer: string;
  issued: string;
};

const CERTIFICATIONS: Certification[] = [
  {
    name: "Embedded Systems & Robotics (MOOC)",
    issuer: "IIT Bombay · e-Yantra",
    issued: "Nov 2021",
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <header className="mb-12 max-w-2xl">
          <p className="font-hand text-2xl text-primary">experience</p>
          <h2 className="mt-1 font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Where I&rsquo;ve worked.
          </h2>
        </header>

        {/* Roles — vertical timeline */}
        <div className="space-y-10 sm:space-y-12">
          {ROLES.map((role, i) => (
            <RoleCard key={`${role.company}-${i}`} role={role} />
          ))}
        </div>

        {/* Education + Certifications — sub-section */}
        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-border pt-12 md:grid-cols-2 md:gap-16">
          <div>
            <Subheading>Education</Subheading>
            <div className="mt-6 space-y-5">
              {EDUCATION.map((e) => (
                <EducationRow key={e.institution} education={e} />
              ))}
            </div>
          </div>
          <div>
            <Subheading>Certifications</Subheading>
            <div className="mt-6 space-y-5">
              {CERTIFICATIONS.map((c) => (
                <CertificationRow key={c.name} cert={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleCard({ role }: { role: Role }) {
  return (
    <article className="grid grid-cols-1 gap-6 md:grid-cols-12">
      {/* Dates column */}
      <aside className="md:col-span-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {role.dates}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {role.duration}
        </p>
        {role.current && (
          <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Current
          </span>
        )}
      </aside>

      {/* Content column */}
      <div className="md:col-span-9">
        <header className="flex items-start gap-4">
          <Logo company={role.company} src={role.logo} bg={role.logoBg} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-2xl font-light tracking-tight text-foreground sm:text-3xl">
                {role.company}
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                · {role.type}
              </span>
            </div>
            {role.companyTagline && (
              <p className="mt-0.5 text-xs italic text-muted-foreground">
                {role.companyTagline}
              </p>
            )}
            <p className="mt-1 text-base text-foreground">
              {role.role}
              {role.subRole && (
                <span className="text-muted-foreground"> · {role.subRole}</span>
              )}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              {role.location}
            </p>
          </div>
        </header>

        {/* Bullets */}
        <ul className="mt-5 space-y-3">
          {role.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm leading-relaxed text-foreground sm:text-base"
            >
              <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Stack chips */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {role.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function Logo({
  company,
  src,
  bg,
}: {
  company: string;
  src?: string;
  bg?: string;
}) {
  // Monogram always renders underneath. If `src` is provided, the
  // image overlays via background-image — and if the file 404s, the
  // overlay is invisible (CSS bg-image fails silently, unlike <img>
  // which shows a broken icon). So broken logo paths fall back
  // gracefully to the monogram without any runtime check.
  return (
    <div
      role="img"
      className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:h-14 sm:w-14"
      style={bg ? { backgroundColor: bg } : undefined}
      aria-label={company}
    >
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center font-display text-xl font-medium text-muted-foreground sm:text-2xl"
      >
        {company[0]}
      </span>
      {src && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${src})` }}
        />
      )}
    </div>
  );
}

function Subheading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
      {children}
    </p>
  );
}

function EducationRow({ education }: { education: Education }) {
  return (
    <div>
      <p className="font-display text-lg text-foreground">
        {education.institution}
      </p>
      <p className="mt-0.5 text-sm text-foreground">{education.degree}</p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        {education.dates} · {education.grade}
      </p>
    </div>
  );
}

function CertificationRow({ cert }: { cert: Certification }) {
  return (
    <div>
      <p className="font-display text-lg text-foreground">{cert.name}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{cert.issuer}</p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        Issued {cert.issued}
      </p>
    </div>
  );
}
