// Contact — final beat of the homepage. Third and last greeting
// moment (Hola). Multiple channels per research consensus — never
// rely on a single contact path.
//
// TODO(saurabh): drop /resume.pdf into public/ before going live.

import Link from "next/link";

type ChannelKind = "primary" | "secondary";

type Channel = {
  label: string;
  href: string;
  kind: ChannelKind;
  external?: boolean;
};

const CHANNELS: Channel[] = [
  {
    label: "Email",
    href: "mailto:saurabhjadhav.cse@gmail.com",
    kind: "primary",
  },
  {
    label: "GitHub",
    href: "https://github.com/SAURABHRJADHAVCSE",
    kind: "secondary",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/saurabhjadhav-cse",
    kind: "secondary",
    external: true,
  },
  {
    label: "Resume PDF",
    href: "/resume.pdf",
    kind: "secondary",
    external: true,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-3xl text-center">
        {/* Greeting */}
        <p className="font-greet text-5xl text-primary sm:text-6xl md:text-7xl">
          Hola.
        </p>

        {/* Headline */}
        <h2 className="mt-4 font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Let&rsquo;s build something.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Open to senior frontend and AI engineering roles, technical
          co-founding, and design-engineering work. Direct messages get
          fastest replies.
        </p>

        {/* CTAs */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
          {CHANNELS.map((c) => (
            <ChannelButton key={c.label} channel={c} />
          ))}
        </div>

        {/* Meta */}
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Mumbai · India · GMT +5:30
        </p>

        {/* Signature */}
        <p className="font-hand mt-8 text-3xl text-primary">
          — Saurabh
        </p>
      </div>
    </section>
  );
}

function ChannelButton({ channel }: { channel: Channel }) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors";
  const cls =
    channel.kind === "primary"
      ? `${base} bg-primary text-primary-foreground hover:bg-primary/90`
      : `${base} border border-border bg-card text-card-foreground hover:border-primary/40 hover:text-primary`;

  return (
    <Link
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noopener noreferrer" : undefined}
      className={cls}
    >
      {channel.label}
    </Link>
  );
}
