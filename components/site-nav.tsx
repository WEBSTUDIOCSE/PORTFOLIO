"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";

// Global sticky nav. On the homepage we hide the nav while the hero
// is in view (the hero has its own TL;DR + theme toggle), then fade
// in once the user scrolls past it. On all other pages the nav is
// always visible.

type NavLink = { label: string; href: string };

const LINKS: NavLink[] = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "/#contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // On home, fade in after the user scrolls ~half a viewport (past
  // the hero TL;DR). On other pages, always visible.
  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Close mobile menu on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const visible = !isHome || scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md transition-all duration-300 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-10">
          {/* Brand */}
          <Link
            href="/"
            className="font-display text-base font-medium leading-none tracking-tight text-foreground hover:text-primary sm:text-lg"
          >
            Saurabh Jadhav
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side: toggle + mobile menu button */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40 md:hidden"
            >
              {mobileOpen ? (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path
                    d="M2 2 L12 12 M12 2 L2 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path
                    d="M2 4 L12 4 M2 10 L12 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-background transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="pt-20" />
        <nav className="flex flex-col items-center justify-center gap-6 px-6 py-16">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-display text-3xl font-light tracking-tight text-foreground hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          <p className="mt-8 font-hand text-2xl text-primary">— Saurabh</p>
        </nav>
      </div>
    </>
  );
}
