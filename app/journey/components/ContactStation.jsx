'use client';

import ResumeForm from '@/components/forms/resume-form';

// Final-stop overlay for the Contact station. Fixed-position card
// above the Canvas (z=10) so the train + route-map stay obscured
// while the contact panel is in focus. Designed to fit the available
// `100vh - var(--routemap-h)` window without internal scrolling on
// any laptop-class viewport (~720px+ usable height).
//
// Theme-aware: uses the app's design tokens (foreground / muted /
// card / border / primary) so it matches light + dark like the rest
// of the site. Brand colours (LinkedIn blue, etc.) stay as accents.
//
// Visibility crossfades via `1 - |scrollT - index|` so the panel
// fades in over the last viewport of scroll.
export default function ContactStation({ scrollT, index }) {
  const opacity = Math.max(0, 1 - Math.abs(scrollT - index));

  return (
    <section
      className="overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 'calc(var(--routemap-h, 96px) + 110px)',
        zIndex: 10,
        opacity,
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
      aria-hidden={opacity < 0.5}
    >
      <div className="relative z-10 h-full w-full flex items-center justify-center px-4 sm:px-6 py-6">
        <div className="w-full max-w-3xl mx-auto">

          {/* Header — compact, centered */}
          <div className="text-center mb-5">
            <p className="text-primary text-[11px] tracking-[0.3em] uppercase font-medium mb-2">
              संपर्क · Contact
            </p>
            <h2 className="text-foreground text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight mb-2">
              Let&apos;s build something together.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Saurabh — Frontend &amp; AI Engineer. Open to opportunities
              anywhere — remote, hybrid, or on-site.
            </p>
          </div>

          {/* Status pill */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-emerald-700 dark:text-emerald-300 text-xs font-medium tracking-wide">
                Open to opportunities · Available anywhere
              </span>
            </div>
          </div>

          {/* Primary contact methods — Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">

            {/* Email */}
            <a
              href="mailto:saurabhjadhav.cse@gmail.com"
              className="group flex items-center gap-3 p-3 rounded-xl bg-muted border border-border hover:bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Email</p>
                <p className="text-foreground text-sm font-medium truncate">
                  saurabhjadhav.cse@gmail.com
                </p>
              </div>
              <svg className="flex-shrink-0 w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

            {/* Phone */}
            <a
              href="tel:+919021337133"
              className="group flex items-center gap-3 p-3 rounded-xl bg-muted border border-border hover:bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Phone</p>
                <p className="text-foreground text-sm font-medium">
                  +91 90213 37133
                </p>
              </div>
              <svg className="flex-shrink-0 w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

          </div>

          {/* Social / professional row */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-4">

            <a
              href="https://www.linkedin.com/in/saurabhjadhav-cse/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group flex items-center justify-center gap-2 p-2.5 rounded-lg bg-muted border border-border hover:bg-card hover:border-[#0A66C2]/50 hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-[#0A66C2] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="hidden sm:inline text-foreground text-xs font-medium">LinkedIn</span>
            </a>

            <a
              href="https://github.com/saurabhrjadhavcse"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="group flex items-center justify-center gap-2 p-2.5 rounded-lg bg-muted border border-border hover:bg-card hover:border-foreground/50 hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="hidden sm:inline text-foreground text-xs font-medium">GitHub</span>
            </a>

            <a
              href="https://x.com/saurabhjadhvcse"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="group flex items-center justify-center gap-2 p-2.5 rounded-lg bg-muted border border-border hover:bg-card hover:border-foreground/50 hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="hidden sm:inline text-foreground text-xs font-medium">X</span>
            </a>

            <a
              href="https://www.youtube.com/@Saurabhjadhav.cse11"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="group flex items-center justify-center gap-2 p-2.5 rounded-lg bg-muted border border-border hover:bg-card hover:border-[#FF0000]/50 hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-[#FF0000] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="hidden sm:inline text-foreground text-xs font-medium">YouTube</span>
            </a>

            <a
              href="https://www.instagram.com/saurabhjadhav.cse"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group flex items-center justify-center gap-2 p-2.5 rounded-lg bg-muted border border-border hover:bg-card hover:border-[#E1306C]/50 hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-[#E1306C] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
              <span className="hidden sm:inline text-foreground text-xs font-medium">Instagram</span>
            </a>

          </div>

          {/* Resume — same gated intro form as the landing page
              (captures name/email/role/company, then serves the PDF). */}
          <div className="flex justify-center mb-4">
            <ResumeForm />
          </div>

          {/* Footer */}
          <p className="text-center text-muted-foreground text-[11px] tracking-wide">
            Open to roles anywhere · Remote or relocation
          </p>

        </div>
      </div>
    </section>
  );
}
