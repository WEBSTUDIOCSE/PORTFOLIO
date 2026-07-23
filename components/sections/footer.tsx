"use client";

// Site footer — a deliberate exact match of a reference agency site's
// closing panel (D:\DEVSTUDIO\WEBSTUDIO\DEVELOPMENT\DEVSTUDIOLABS
// FooterSection.tsx): full h-screen brand-yellow (#fde047) dotted-grid
// panel, a huge faint wordmark, a "let's build something" headline,
// and a social-icon row that collapses away as an expandable
// copy-to-clipboard email button slides open. Colors, layout, and the
// interaction are copied 1:1; only content is Saurabh's own.
//
// That reference footer has no in-site nav — but this site's footer
// is the only place linking to /journey, plus copyright/back-to-top.
// Per explicit direction, those are folded in as a small, unobtrusive
// strip rather than dropped, so nothing on the site becomes harder to
// reach.

import { useCallback, useState } from "react";
import Link from "next/link";
import { SOCIAL_ICONS, type SocialIconName } from "@/components/social-icons";
import ScrollToTop from "@/components/scroll-to-top";
import { downloadFile } from "@/lib/download-file";

const EMAIL = "saurabhjadhav.cse@gmail.com";
const [EMAIL_USER, EMAIL_DOMAIN] = EMAIL.split("@");

// Direct download — no gated lead-capture form anymore. Same fallback
// path the old ResumeForm used.
const RESUME_URL = process.env.NEXT_PUBLIC_RESUME_URL ?? "/resume.pdf";

const NAV: { label: string; href: string }[] = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Writing", href: "/writing" },
  { label: "Journey", href: "/journey" },
];

const SOCIALS: { label: string; href: string; icon: SocialIconName }[] = [
  { label: "GitHub", href: "https://github.com/saurabhrjadhavcse", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/saurabhjadhav-cse", icon: "linkedin" },
  { label: "X / Twitter", href: "https://x.com/saurabhjadhvcse", icon: "x" },
  { label: "YouTube", href: "https://www.youtube.com/@Saurabhjadhav.cse11", icon: "youtube" },
  { label: "Instagram", href: "https://www.instagram.com/saurabhjadhav.cse", icon: "instagram" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [isEmailHovered, setIsEmailHovered] = useState(false);

  return (
    <footer id="site-footer" className="dotted-grid relative flex h-screen w-full flex-col justify-end overflow-hidden bg-[#fde047] px-6 pb-6 text-[#1a1a1a] sm:px-10 md:pb-8">
      {/* Huge faint wordmark — decorative, so plain <p>s (not headings)
          even though the reference used <h1>. */}
      <div
        aria-hidden
        className="relative z-0 flex w-full flex-1 select-none flex-col items-center justify-center gap-2 overflow-hidden md:gap-4"
      >
        <p className="m-0 cursor-default whitespace-nowrap p-0 text-center font-display text-[13vw] font-bold leading-[0.85] tracking-tight text-black/[0.12] transition-all duration-500 hover:scale-105 hover:text-black/[0.25]">
          SAURABH
        </p>
        <p className="m-0 cursor-default whitespace-nowrap p-0 text-center font-display text-[13vw] font-bold leading-[0.85] tracking-tight text-black/[0.12] transition-all duration-500 hover:scale-105 hover:text-black/[0.25]">
          JADHAV
        </p>
      </div>

      {/* Footer content */}
      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col">
        <div className="mb-8 h-px w-full bg-black/10" />

        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          {/* Left side */}
          <div className="flex flex-col">
            <p className="mb-2 text-xl font-medium md:text-2xl">
              Let&rsquo;s build something
            </p>
            <h2 className="mb-6 text-3xl font-bold leading-none tracking-tight md:text-5xl">
              MEANINGFUL <br />
              AND MEMORABLE
            </h2>

            {/* Backup nav — small and tucked under the headline so
                /journey and the rest of the site stay reachable. */}
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {NAV.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs font-medium uppercase tracking-[0.1em] text-black/60 underline-offset-4 transition-colors hover:text-black hover:underline focus-visible:text-black focus-visible:underline focus-visible:outline-none"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex flex-col items-start md:items-end">
            <p className="mb-4 text-xl font-normal md:text-2xl">Reach out</p>

            <div className="mb-6 flex h-11 items-center justify-end sm:h-[52px]">
              {/* Social icons — collapse away while the email button
                  is hovered/focused, exactly like the reference. */}
              <ul
                aria-label="Social links"
                className={`flex list-none items-center overflow-hidden py-0 pl-0 pr-5 transition-all duration-500 ease-out ${
                  isEmailHovered
                    ? "max-w-0 opacity-0"
                    : "max-w-[240px] opacity-100"
                }`}
              >
                {SOCIALS.map((s, i) => {
                  const Icon = SOCIAL_ICONS[s.icon];
                  return (
                    <li key={s.label} className={i > 0 ? "ml-3" : ""}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex items-center justify-center transition-opacity hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-none"
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    </li>
                  );
                })}
                {/* Resume — same icon-row treatment as the socials,
                    direct download instead of the old gated form.
                    RESUME_URL is cross-origin (Firebase Storage), so
                    the plain `download` attribute is silently ignored
                    by the browser and just navigates instead of
                    downloading — fetch-and-blob forces a real
                    download; target="_blank" + the href stay as a
                    graceful no-JS fallback (opens in a new tab rather
                    than leaving the page). */}
                <li className="ml-3">
                  <a
                    href={RESUME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download resume PDF"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadFile(RESUME_URL, "saurabh-jadhav-resume.pdf");
                    }}
                    className="flex items-center justify-center transition-opacity hover:opacity-70 focus-visible:opacity-70 focus-visible:outline-none"
                  >
                    <SOCIAL_ICONS.resume className="h-6 w-6" />
                  </a>
                </li>
              </ul>

              {/* Expandable email button */}
              <EmailButton onHoverChange={setIsEmailHovered} />
            </div>

            {/* Colophon / legal / back-to-top — folded into the slot
                the reference uses for "Created by ...". */}
            <div className="flex flex-col items-start gap-1 md:items-end">
              <p className="text-sm font-normal opacity-70 md:text-[15px]">
                <span className="font-bold text-black opacity-100">
                  Saurabh Jadhav
                </span>{" "}
                · Full Stack &amp; AI Engineer
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                © {year} · Ratnagiri&nbsp;→&nbsp;Mumbai
              </p>
              <ScrollToTop className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/70 transition-colors hover:text-black focus-visible:text-black focus-visible:outline-none">
                Back to top ↑
              </ScrollToTop>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Expandable email button — icon-first; hovering (or focusing, for
// keyboard users) slides "hello"-style user/domain text open from
// both sides and collapses the social row out of the way. Clicking
// copies the address. 1:1 interaction match with the reference's
// At-icon button; the "@" glyph is rendered as text rather than
// pulling in a new icon library for one symbol.
function EmailButton({
  onHoverChange,
}: {
  onHoverChange: (hovered: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button
      type="button"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
      onClick={handleCopy}
      aria-label={copied ? "Email copied" : `Copy email address ${EMAIL}`}
      className="group relative flex shrink-0 cursor-pointer items-center focus-visible:outline-none"
    >
      {/* Left text — user part of the address */}
      <span
        aria-hidden
        className="flex max-w-0 items-center justify-end overflow-hidden whitespace-nowrap transition-all duration-500 ease-out group-hover:max-w-[200px] group-focus-visible:max-w-[200px]"
      >
        <span className="pr-1.5 text-base font-normal tracking-tight sm:text-lg">
          {EMAIL_USER}
        </span>
      </span>

      {/* "@" — rendered as text at icon-scale */}
      <span className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-black/70 text-2xl font-bold transition-colors group-hover:border-black group-hover:bg-black group-hover:text-[#f5e05b] group-focus-visible:border-black group-focus-visible:bg-black group-focus-visible:text-[#f5e05b] sm:h-[52px] sm:w-[52px] sm:text-3xl">
        @
      </span>

      {/* Right text — domain part of the address */}
      <span
        aria-hidden
        className="flex max-w-0 items-center justify-start overflow-hidden whitespace-nowrap transition-all duration-500 ease-out group-hover:max-w-[220px] group-focus-visible:max-w-[220px]"
      >
        <span className="pl-1.5 text-base font-normal tracking-tight sm:text-lg">
          {EMAIL_DOMAIN}
        </span>
      </span>

      {/* Tooltip */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-[110%] mt-2 flex items-center gap-2 whitespace-nowrap rounded-full bg-[#1a1a1a] px-4 py-2 text-[#F4F1EA] opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <CopyIcon className="h-4 w-4" />
        <span className="text-sm font-medium">
          {copied ? "Copied!" : "Copy email"}
        </span>
      </span>

      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M4 16V5a1 1 0 0 1 1-1h11" />
    </svg>
  );
}
