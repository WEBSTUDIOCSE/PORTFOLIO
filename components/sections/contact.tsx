// Contact — final beat of the homepage. Third and last greeting
// moment (Hola). The form is the primary action; secondary channels
// (GitHub / LinkedIn / Resume) sit below.
//
// Resume is the only one that's interactive — clicking it opens an
// inline form that captures recruiter intent before serving the PDF.

import Link from "next/link";
import ContactForm from "@/components/forms/contact-form";
import ResumeForm from "@/components/forms/resume-form";

type Channel = {
  label: string;
  href: string;
  external?: boolean;
};

const SECONDARY_CHANNELS: Channel[] = [
  {
    label: "GitHub",
    href: "https://github.com/saurabhrjadhavcse",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/saurabhjadhav-cse",
    external: true,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-3xl">
        {/* Greeting */}
        <div className="text-center">
          <p className="font-greet text-5xl text-primary sm:text-6xl md:text-7xl">
            Hola.
          </p>
          <h2 className="mt-4 font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Let&rsquo;s build something.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Available for senior product-engineer roles, technical
            co-founding, and design-engineering work. The form below
            lands in my inbox directly — fastest way to reach me.
          </p>
        </div>

        {/* Primary: contact form */}
        <div className="mt-10">
          <ContactForm />
        </div>

        {/* Secondary: alternative channels */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            or reach me at
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            {SECONDARY_CHANNELS.map((c) => (
              <ChannelLink key={c.label} channel={c} />
            ))}
            <ResumeForm />
          </div>
        </div>

        {/* Meta */}
        <p className="mt-12 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Mumbai · India · GMT +5:30
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
  return (
    <Link
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-card-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      {channel.label}
    </Link>
  );
}
