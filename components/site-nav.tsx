"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Floating-pill nav. Sits with breathing room from the top edge
// (not pinned), fully rounded, generous interior padding. Pattern
// borrowed from Linear / Anthropic / Resend — feels considered
// rather than utilitarian. Inner links get pill-shaped hover
// backgrounds so the hover state echoes the outer shape.
//
// On /: hidden while the hero is on screen, fades + slides down once
// the user scrolls past ~285vh (mid-morph, see character-scroll.tsx).
// On all other routes: always visible.

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
  // /journey is a full-bleed 3D experience — the floating nav pill
  // breaks the immersion and competes with the diorama's framing.
  // Browser back / the in-page UI handle navigation off the page.
  const isJourney = pathname === "/journey";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Refs for focus management on the mobile dialog.
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    // Hero section is 400vh tall, sticky child 100vh. Sticky
    // unsticks at scrollY = 300vh, so the morph for Beat 5
    // ("I'm Saurabh.") runs ENTIRELY inside the locked range —
    // 276vh → 300vh — to avoid the sticky's natural upward drift
    // adding to the morph translation (see character-scroll.tsx).
    //
    // We bring the nav in at 285.6vh — exitP ≈ 0.4, the same
    // moment the H2's dockFade kicks in. The two crossfade: the
    // H2 shrinks + dissolves toward the nav while the pill slides
    // down with "I'm Saurabh" materializing where the H2 is
    // heading. The eye reads one continuous motion.
    // rAF-guarded so the layout read (scrollY/innerHeight) runs at most
    // once per frame instead of on every scroll tick (mirrors tc-invite).
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > window.innerHeight * 2.85);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHome]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Mobile dialog a11y: focus into the dialog on open, trap Tab within
  // it, close on Escape, and restore focus to the trigger on close.
  useEffect(() => {
    if (!mobileOpen) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusables = () =>
      Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobile();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [mobileOpen, closeMobile]);

  const visible = !isHome || scrolled;

  // Hard-hide on /journey — the page is its own immersive context.
  if (isJourney) return null;

  return (
    <>
      {/* Outer wrapper — fixed, full width so the pill can be
          horizontally centered with mx-auto. Pointer-events handed
          off to inner so the page beneath stays interactive in the
          empty side regions. */}
      <div
        className={`pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-all duration-300 sm:top-5 sm:px-6 ${
          visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0"
        }`}
      >
        <nav
          aria-label="Primary"
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-card/80 p-1.5 shadow-lg shadow-foreground/[0.04] backdrop-blur-xl sm:gap-2 sm:p-2"
        >
          {/* Brand chip — visible on every page. The "I'm" prefix
              matches the hero's Beat 5 H2 ("I'm Saurabh.") so the
              morph reads as the same string shrinking down into
              this slot (see character-scroll.tsx). */}
          <Link
            href="/"
            aria-label="Saurabh Jadhav — home"
            className="group flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-foreground/5 sm:px-4"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-primary transition-transform group-hover:scale-110" />
            <span className="font-display text-sm font-medium leading-none tracking-tight text-foreground sm:text-base">
              I&apos;m Saurabh
            </span>
          </Link>

          {/* Vertical divider — desktop only */}
          <span aria-hidden className="hidden h-5 w-px bg-border md:block" />

          {/* Desktop links — pill-style on hover */}
          <ul className="hidden items-center md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger — visible only when desktop links hide */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="site-mobile-menu"
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 md:hidden"
          >
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </nav>
      </div>

      {/* Mobile overlay — a modal dialog. `inert` when closed removes
          its links from the tab order + a11y tree (so invisible links
          aren't keyboard-reachable) while preserving the fade. */}
      <div
        ref={overlayRef}
        id="site-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!mobileOpen ? true : undefined}
        className={`fixed inset-0 z-40 flex flex-col bg-background/95 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="pt-24" />
        <nav className="flex flex-col items-center justify-center gap-5 px-6 py-12">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeMobile}
              className="font-display text-3xl font-light tracking-tight text-foreground transition-colors hover:text-primary"
              style={{
                transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms",
              }}
            >
              {l.label}
            </Link>
          ))}
          <span aria-hidden className="mt-4 h-px w-12 bg-border" />
          <p className="font-hand text-2xl text-primary">— Saurabh</p>
        </nav>
      </div>
    </>
  );
}

function IconMenu() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M2 4 L12 4 M2 10 L12 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M2 2 L12 12 M12 2 L2 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
