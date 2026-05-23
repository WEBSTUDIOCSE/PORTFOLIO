// Currently — "soft signals" of engagement that move the needle when
// candidates look similar on paper. The highest-signal line here is
// "Open to" (availability) — recruiters scan for it. "Now, building"
// keeps the site feeling alive; the rest (stack + off-screen) is
// personality / culture-fit.
//
// FRESHNESS IS LOAD-BEARING: a stale "currently" reads as an
// abandoned site, which is worse than not having one. The UPDATED
// stamp below is shown to the visitor as proof of life — bump it
// (and the Now / Listening / Reading lines) whenever you touch them.
// TODO(saurabh): refresh UPDATED + the lines below every fortnight.

const UPDATED = "May 2026";

const BUILDING_WITH = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind v4",
  "shadcn/ui",
  "Firebase",
  "Supabase · pgvector",
  "Gemini Pro",
  "Claude API",
  "Multi-agent AI",
];

export default function Currently() {
  return (
    <section
      id="currently"
      className="border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-hand text-2xl text-primary">currently</p>
            <h2 className="mt-1 font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl">
              What I&rsquo;m reaching for.
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Updated {UPDATED}
          </p>
        </header>

        {/* Open to — the highest-signal line for recruiters. Pulled
            out as a banner above the soft-signal grid. */}
        <div className="mb-10 rounded-xl border border-primary/30 bg-primary/[0.06] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2">
            <span aria-hidden className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
              Open to
            </p>
          </div>
          <p className="mt-3 text-base leading-relaxed text-foreground sm:text-lg">
            Senior Frontend / AI Engineer roles · technical co-founding ·
            freelance AI builds.{" "}
            <span className="text-muted-foreground">
              Available anywhere — remote, hybrid, or on-site. Usually
              reply within a day or two.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {/* Now, building */}
          <div>
            <Label>Now, building</Label>
            <p className="mt-4 text-base leading-relaxed text-foreground">
              This site&rsquo;s <span className="italic">/journey</span> 3D
              diorama.{" "}
              <span className="text-muted-foreground">
                And the next iteration of OpenClaw&rsquo;s agent stack.
              </span>
            </p>
          </div>

          {/* Building with */}
          <div>
            <Label>Building with</Label>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {BUILDING_WITH.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Off-screen — listening + reading merged into one warm,
              personal cell. */}
          <div>
            <Label>Away from the keyboard</Label>
            <p className="mt-4 text-base leading-relaxed text-foreground">
              Hooked on horror stories &mdash; and I narrate my own.{" "}
              <span className="text-muted-foreground">
                A channel&rsquo;s in the works; reveal soon.
              </span>
            </p>
            <p className="mt-3 text-base leading-relaxed text-foreground">
              Football and cricket off the clock.{" "}
              <span className="text-muted-foreground">
                And a guitar for the quiet hours.
              </span>
            </p>
            <p className="mt-3 text-base leading-relaxed text-foreground">
              On the PS5 &mdash; <span className="italic">Assassin&rsquo;s
              Creed</span> (every chapter) and <span className="italic">Minecraft</span>.{" "}
              <span className="text-muted-foreground">
                Still loyal to <span className="italic">Prince of Persia: The
                Sands of Time</span> and <span className="italic">The Two
                Thrones</span>.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
      {children}
    </p>
  );
}
