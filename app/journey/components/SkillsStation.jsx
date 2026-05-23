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
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: accent }}
        />
        <h3 className="text-foreground text-xs font-semibold tracking-[0.2em] uppercase">
          {title}
        </h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <span
            key={s}
            className="px-2.5 py-1 rounded-full bg-card border border-border text-foreground text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors cursor-default"
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
        bottom: 'calc(var(--routemap-h, 96px) + 110px)',
        zIndex: 10,
        opacity,
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
      aria-hidden={opacity < 0.5}
    >

      <div className="relative z-10 h-full w-full flex items-center justify-center px-4 sm:px-6 py-6">
        <div className="w-full max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-primary text-[11px] tracking-[0.3em] uppercase font-medium mb-2">
              कौशल्ये · Skills
            </p>
            <h2 className="text-foreground text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight mb-2">
              The toolbox I reach for.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Languages, frameworks, and tools I use to ship — grouped
              by where they live in the stack.
            </p>
          </div>

          {/* 3-column skill grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
          <p className="text-center text-muted-foreground text-[11px] tracking-wide mt-6">
            Always learning · Open to picking up whatever the project needs
          </p>

        </div>
      </div>
    </section>
  );
}
