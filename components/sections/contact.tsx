// Contact — final beat of the homepage. Third and last greeting
// moment (Hola). Email-first: the primary action is a single
// mailto CTA showing the actual address (high trust, scannable).
// Secondary channels (GitHub / LinkedIn / Resume) sit alongside.
//
// Editorial rationale: a long structured form felt UI-utilitarian
// next to the rest of the site's editorial voice, and it added
// ~600px of vertical real estate that pushed the footer past the
// fold. Portfolio contact is almost always email anyway — recruiters
// and clients reach out by inbox, not by submitting a form. The
// ContactForm component is kept in the repo (components/forms/
// contact-form.tsx) in case it's needed for a dedicated /contact
// route later; its Firestore rules + server action remain wired.
//
// Resume is the only one still interactive — clicking opens an
// inline form that captures recruiter intent before serving the
// PDF. That gate stays because recruiter-lead capture is the one
// piece of intake that actually delivers value here.

import Link from "next/link";
import ResumeForm from "@/components/forms/resume-form";
import { SOCIAL_ICONS, type SocialIconName } from "@/components/social-icons";

const EMAIL = "saurabhjadhav.cse@gmail.com";

type Channel = {
  label: string;
  href: string;
  icon: SocialIconName;
  external?: boolean;
};

const SECONDARY_CHANNELS: Channel[] = [
  {
    label: "GitHub",
    href: "https://github.com/saurabhrjadhavcse",
    icon: "github",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/saurabhjadhav-cse",
    icon: "linkedin",
    external: true,
  },
  {
    label: "X / Twitter",
    href: "https://x.com/saurabhjadhvcse",
    icon: "x",
    external: true,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@Saurabhjadhav.cse11",
    icon: "youtube",
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/saurabhjadhav.cse",
    icon: "instagram",
    external: true,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-2xl">
        {/* Greeting */}
        <div className="text-center" data-reveal>
          <p className="font-greet text-5xl text-primary sm:text-6xl md:text-7xl">
            Hola.
          </p>
          <h2 className="mt-4 font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Let&rsquo;s build something.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Available for senior product-engineer roles, technical
            co-founding, and design-engineering work — anywhere, remote
            or on-site. Email is the fastest way to reach me — I usually
            reply within a day or two.
          </p>
        </div>

        {/* Primary CTA — surface the real address so the reader
            doesn't have to wonder where the button leads. */}
        <div className="mt-10 flex justify-center" data-reveal>
          <a
            href={`mailto:${EMAIL}`}
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground shadow-sm transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:px-8 sm:py-4 sm:text-lg"
          >
            <IconMail />
            <span className="font-mono text-sm tracking-tight sm:text-base">
              {EMAIL}
            </span>
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>

        {/* Secondary channels — typographic rule above sets them
            apart as "or, alternatively". */}
        <div className="mt-14 flex items-center justify-center gap-4">
          <span aria-hidden className="h-px w-10 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            or
          </span>
          <span aria-hidden className="h-px w-10 bg-border" />
        </div>
        <div
          className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
          data-reveal-stagger
        >
          {SECONDARY_CHANNELS.map((c) => (
            <ChannelLink key={c.label} channel={c} />
          ))}
          <ResumeForm />
        </div>

        {/* Meta */}
        <p className="mt-14 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Mumbai, India · GMT +5:30 · Available anywhere
        </p>

        {/* Signature */}
        <p className="mt-6 text-center font-hand text-3xl text-primary">
          — Saurabh
        </p>
      </div>
    </section>
  );
}

function ChannelLink({ channel }: { channel: Channel }) {
  const Icon = SOCIAL_ICONS[channel.icon];
  return (
    <Link
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noopener noreferrer" : undefined}
      className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-card-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
      {channel.label}
    </Link>
  );
}

function IconMail() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.25" y="3.75" width="13.5" height="10.5" rx="1.5" />
      <path d="M2.5 4.5 L9 9.75 L15.5 4.5" />
    </svg>
  );
}
