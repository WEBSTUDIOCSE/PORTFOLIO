'use client';

// Skills station overlay — fixed-position card above the Canvas
// (z=10) listing the stack across three columns: Frontend, Backend
// & Tools, and Also In The Toolbox. Theme-aware via design tokens
// (foreground / muted / card / border / primary) so it matches the
// app's light + dark themes. Same crossfade behaviour as the other
// station overlays.
//
// Designed to fit `100vh - var(--routemap-h)` without scrolling on
// any laptop-class viewport.

const FRONTEND = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Framer Motion',
  'shadcn/ui',
  'HTML5 / CSS3',
  'Responsive Design',
];

const BACKEND = [
  'Node.js',
  'Express',
  'Firebase',
  'MongoDB',
  'REST APIs',
  'Git / GitHub',
  'Vercel',
  'Resend',
];

const TOOLBOX = [
  'Android (Java)',
  'Java',
  'C++',
  'Figma',
  'UI / UX Design',
  'Android Studio',
];

function SkillColumn({ title, accent, skills }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/30 hover:bg-black/60 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 h-1 w-full opacity-50" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <span
          className="inline-block w-2.5 h-2.5"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
        />
        <h3 className="text-white text-[11px] font-mono tracking-[0.3em] uppercase">
          {title}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2 relative z-10">
        {skills.map((s) => (
          <span
            key={s}
            className="px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-white/80 text-[11px] font-mono tracking-wider hover:border-white/30 hover:text-white hover:bg-white/10 transition-colors cursor-default"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsStation({ scrollT, index }) {
  const opacity = Math.max(0, 1 - Math.abs(scrollT - index));

  return (
    <section
      className="overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 'calc(var(--routemap-h, 96px))',
        zIndex: 10,
        opacity,
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
      aria-hidden={opacity < 0.5}
    >

      <div className="relative z-10 h-full w-full flex items-start justify-center overflow-y-auto px-4 pt-16 pb-32 sm:px-6 sm:pt-24 sm:pb-40">
        <div className="w-full max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
                SYSTEM LOG · 03
              </p>
              <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
                Technical <span className="font-medium italic">Arsenal</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/60 text-center sm:text-right font-mono text-[11px] uppercase tracking-wider">
              Languages, frameworks, and tools I use to ship.
            </p>
          </div>

          {/* 3-column skill grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkillColumn
              title="Frontend"
              accent="#3b82f6"
              skills={FRONTEND}
            />
            <SkillColumn
              title="Backend & Tools"
              accent="#10b981"
              skills={BACKEND}
            />
            <SkillColumn
              title="Also in the Toolbox"
              accent="#f59e0b"
              skills={TOOLBOX}
            />
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
             <p className="text-center text-white/50 font-mono text-[10px] uppercase tracking-[0.3em]">
              Always learning · Adapting to project needs
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
