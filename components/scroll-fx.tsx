"use client";

import { useEffect } from "react";

// ScrollFX — the home page's single GSAP entry point.
//
// Design constraints (Lighthouse is load-bearing):
//   1. GSAP + ScrollTrigger are dynamically imported INSIDE useEffect,
//      so they never enter the critical JS bundle. First paint, LCP and
//      hydration cost are identical to the pre-GSAP site.
//   2. No content is hidden by CSS. Pre-hydration (and for crawlers /
//      no-JS users) every section renders fully visible; GSAP applies
//      the "from" states only once it boots. Zero CLS, zero SEO risk.
//   3. prefers-reduced-motion: the effect bails before importing
//      anything — reduced-motion users never even download GSAP.
//
// Sections opt in via data attributes (they stay server components):
//   data-reveal            fade-up on enter (="fade" for opacity-only)
//   data-reveal-stagger    stagger the element's direct children
//   data-fx-line           horizontal rule draws in (scaleX 0 → 1)
//   data-fx-rail           vertical rail draws with scroll (scrub)
//   data-parallax="0.2"    gentle y-parallax, scrubbed (watermarks)
//   data-fx-progress       the fixed top scroll-progress bar (below)
export default function ScrollFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    let refresh: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const from =
            el.dataset.reveal === "fade"
              ? { opacity: 0 }
              : { opacity: 0, y: 28 };
          gsap.from(el, {
            ...from,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        gsap.utils
          .toArray<HTMLElement>("[data-reveal-stagger]")
          .forEach((el) => {
            const children = Array.from(el.children);
            if (children.length === 0) return;
            gsap.from(children, {
              opacity: 0,
              y: 24,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: "top 86%", once: true },
            });
          });

        gsap.utils.toArray<HTMLElement>("[data-fx-line]").forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.1,
            ease: "power2.inOut",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // Experience timeline rail — draws downward in lockstep with
        // scroll (scrubbed, not one-shot) so the line's tip tracks the
        // reader's position through the roles.
        gsap.utils.toArray<HTMLElement>("[data-fx-rail]").forEach((el) => {
          gsap.from(el, {
            scaleY: 0,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top 75%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = parseFloat(el.dataset.parallax || "0.15");
          const travel = 160 * speed;
          gsap.fromTo(
            el,
            { y: travel },
            {
              y: -travel,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });

        const bar = document.querySelector<HTMLElement>("[data-fx-progress]");
        if (bar) {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              ease: "none",
              scrollTrigger: { start: 0, end: "max", scrub: 0.4 },
            },
          );
        }
      });

      // Trigger positions shift as hero frames / fonts finish loading —
      // recompute once the page settles.
      refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh, { once: true });
    })();

    return () => {
      cancelled = true;
      if (refresh) window.removeEventListener("load", refresh);
      ctx?.revert();
    };
  }, []);

  // Scroll-progress hairline. scale-x-0 at rest; GSAP drives it. For
  // no-JS / reduced-motion it simply stays invisible.
  return (
    <div
      aria-hidden
      data-fx-progress
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary via-accent to-primary"
    />
  );
}
