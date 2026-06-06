// Site footer — the last thing a visitor sees before they leave or
// act, so it doubles as a backup menu + contact hub (not just a
// colophon). Three columns: brand/colophon, in-site nav, and
// elsewhere (social + email). Bottom bar carries the copyright,
// the logo legal disclaimer, and a back-to-top.
//
// Location line nods to the /journey Konkan-Railway theme:
// Ratnagiri (roots) → Mumbai (base) is literally the diorama route.

import Link from "next/link";
import { SOCIAL_ICONS, type SocialIconName } from "@/components/social-icons";
import ScrollToTop from "@/components/scroll-to-top";

const NAV: { label: string; href: string }[] = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Writing", href: "/writing" },
  { label: "Journey", href: "/journey" },
  { label: "Contact", href: "/#contact" },
];

const ELSEWHERE: { label: string; href: string; icon: SocialIconName }[] = [
  { label: "GitHub", href: "https://github.com/saurabhrjadhavcse", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/saurabhjadhav-cse", icon: "linkedin" },
  { label: "X / Twitter", href: "https://x.com/saurabhjadhvcse", icon: "x" },
  { label: "YouTube", href: "https://www.youtube.com/@Saurabhjadhav.cse11", icon: "youtube" },
  { label: "Instagram", href: "https://www.instagram.com/saurabhjadhav.cse", icon: "instagram" },
  { label: "Email", href: "mailto:saurabhjadhav.cse@gmail.com", icon: "email" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-8">
          {/* Brand + colophon */}
          <div className="col-span-2">
            <p className="font-display text-lg font-medium tracking-tight text-foreground">
              Saurabh Jadhav
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Frontend &amp; AI Engineer
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              I build systems that replace headcount — multi-agent AI
              pipelines and production Next.js apps.
            </p>
          </div>

          {/* In-site nav (backup menu) */}
          <nav aria-label="Footer">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Elsewhere — social + email */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2.5">
              {ELSEWHERE.map((l) => {
                const Icon = SOCIAL_ICONS[l.icon];
                return (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        l.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="group inline-flex items-center gap-2.5 text-sm text-foreground transition-colors hover:text-primary"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-border pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            © {year} Saurabh Jadhav · Made on the Konkan line —
            Ratnagiri&nbsp;→&nbsp;Mumbai
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              All company logos are property of their respective owners.
            </p>
            <ScrollToTop className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary">
              Back to top ↑
            </ScrollToTop>
          </div>
        </div>
      </div>
    </footer>
  );
}
