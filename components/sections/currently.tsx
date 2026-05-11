// Currently — short, scannable, "what I'm using / reading / listening
// to right now". Per research these are "soft signals" of engagement
// that move the needle when candidates look similar on paper.
//
// TODO(saurabh): refresh the Listening / Reading lines every
// fortnight so the site reads as alive, not abandoned.

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
        <header className="mb-10 max-w-2xl">
          <p className="font-hand text-2xl text-primary">currently</p>
          <h2 className="mt-1 font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            What I&rsquo;m reaching for.
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {/* Building */}
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

          {/* Listening */}
          <div>
            <Label>Listening to</Label>
            <p className="mt-4 text-base leading-relaxed text-foreground">
              The Bear OST, on loop.{" "}
              <span className="text-muted-foreground">
                And whatever Shilpa Rao puts out.
              </span>
            </p>
          </div>

          {/* Reading */}
          <div>
            <Label>Reading</Label>
            <p className="mt-4 text-base leading-relaxed text-foreground">
              <span className="italic">A Pattern Language</span> &mdash;
              Christopher Alexander.{" "}
              <span className="text-muted-foreground">
                Slowly. It rewards slow.
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
