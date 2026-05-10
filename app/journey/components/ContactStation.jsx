'use client';

// Final-stop overlay for the Contact station. Fixed-position card
// above the Canvas (z=10) so the train + route-map stay obscured
// while the contact panel is in focus. Designed to fit the available
// `100vh - var(--routemap-h)` window without internal scrolling on
// any laptop-class viewport (~720px+ usable height).
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
        bottom: 'var(--routemap-h, 96px)',
        zIndex: 10,
        opacity,
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
        background: '#fafafa',
      }}
      aria-hidden={opacity < 0.5}
    >
      {/* Layer 1 — dotted grid backdrop. Subtle slate dots at 22px
          spacing — the same trick Linear / Vercel / Resend use to
          add texture without noise. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: '22px 22px',
          backgroundPosition: '0 0',
        }}
      />

      {/* Layer 2 — radial vignette: fades dots toward white at the
          edges so the eye lands on the centred content card. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 70%, #fafafa 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Layer 3 — soft amber wash at the top, tying back to the
          journey's brass / golden-hour palette. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(251,191,36,0.10), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 h-full w-full flex items-center justify-center px-4 sm:px-6 py-6">
        <div className="w-full max-w-3xl mx-auto">

          {/* Header — compact, centered */}
          <div className="text-center mb-5">
            <p className="text-amber-700 text-[11px] tracking-[0.3em] uppercase font-medium mb-2">
              संपर्क · Contact
            </p>
            <h2 className="text-slate-900 text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight mb-2">
              Let&apos;s build something together.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Saurabh — frontend developer in Maharashtra. Available for
              opportunities, collaborations, or a quick chat.
            </p>
          </div>

          {/* Status pill */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-emerald-800 text-xs font-medium tracking-wide">
                Open to opportunities · Mumbai · Pune · Remote · International
              </span>
            </div>
          </div>

          {/* Primary contact methods — Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">

            {/* Email */}
            <a
              href="mailto:saurabhjadhav.cse@gmail.com"
              className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">Email</p>
                <p className="text-slate-900 text-sm font-medium truncate">
                  saurabhjadhav.cse@gmail.com
                </p>
              </div>
              <svg className="flex-shrink-0 w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

            {/* Phone */}
            <a
              href="tel:+917410140535"
              className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">Phone</p>
                <p className="text-slate-900 text-sm font-medium">
                  +91 74101 40535
                </p>
              </div>
              <svg className="flex-shrink-0 w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

          </div>

          {/* Social / professional row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">

            <a
              href="https://www.linkedin.com/in/saurabhjadhav-cse/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-white hover:border-[#0A66C2]/50 hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-4 h-4 text-slate-600 group-hover:text-[#0A66C2] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="hidden sm:inline text-slate-700 text-xs font-medium">LinkedIn</span>
            </a>

            <a
              href="https://github.com/saurabhjadhav"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="group flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-700/50 hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="hidden sm:inline text-slate-700 text-xs font-medium">GitHub</span>
            </a>

            <a
              href="https://twitter.com/saurabhjadhav"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="group flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-700/50 hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="hidden sm:inline text-slate-700 text-xs font-medium">X / Twitter</span>
            </a>

            <a
              href="/resume.pdf"
              download
              aria-label="Download resume"
              className="group flex items-center justify-center gap-2 p-2.5 rounded-lg bg-amber-100 border border-amber-300 hover:bg-amber-200 hover:border-amber-500 hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-4 h-4 text-amber-800" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="hidden sm:inline text-amber-900 text-xs font-medium">Resume</span>
            </a>

          </div>

          {/* Footer */}
          <p className="text-center text-slate-400 text-[11px] tracking-wide">
            Based in Maharashtra · Available worldwide
          </p>

        </div>
      </div>
    </section>
  );
}
