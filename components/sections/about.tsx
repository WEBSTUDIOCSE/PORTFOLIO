// About — short bio with the "why". Comes AFTER Selected Work
// because the research-backed psychology is "show the work first,
// then the person" — recruiters who reached this point already
// like what they saw and now want context.
//
// Uses an existing PNG frame as a placeholder portrait. Swap to a
// proper headshot later by replacing the src path.

/* eslint-disable @next/next/no-img-element */
export default function About() {
  return (
    <section
      id="about"
      className="border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-16">
          {/* Portrait */}
          <div className="flex flex-col items-center md:col-span-2 md:items-start">
            <div className="relative h-56 w-56 overflow-hidden rounded-full border border-border bg-muted sm:h-64 sm:w-64">
              <img
                src="/assets/saurabh/ezgif-frame-120.png"
                alt="Saurabh Jadhav"
                className="h-full w-full object-cover"
                style={{ objectPosition: "center 18%" }}
              />
            </div>
            <p className="font-hand mt-4 text-3xl text-primary">
              — Saurabh
            </p>
          </div>

          {/* Bio */}
          <div className="md:col-span-3">
            <p className="flex items-baseline gap-2 text-primary">
              <span className="font-deva text-base sm:text-lg">नमस्कार</span>
              <span className="text-muted-foreground">·</span>
              <span className="font-greet text-3xl sm:text-4xl">About</span>
            </p>
            <h2 className="mt-2 font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
              I&rsquo;m a Frontend &amp; AI Engineer.
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground sm:text-lg">
              <p>
                Three years deep in production frontend at Livlong 365,
                where I led the migration of livlong.com to Next.js 16
                (~45% LCP improvement) and shipped 60+ reusable components
                across the insurance and wellness verticals.
              </p>
              <p>
                Outside work, the systems I build go further. OpenClaw is
                a 15-agent autonomous operations pipeline running on my
                VPS &mdash; zero human intervention after task input.
                CinematicTale is a live AI storytelling SaaS with face-swap
                and Razorpay subscriptions. Elite Mindset Forge writes,
                illustrates, and auto-publishes multilingual content
                across Instagram and Facebook, all of it AI-driven.
              </p>
              <p className="font-display text-lg text-primary sm:text-xl md:text-2xl">
                I build systems that replace headcount. One developer.
                Infinite leverage.
              </p>
            </div>

            {/* Meta row */}
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-6 sm:grid-cols-3">
              <MetaItem label="Based" value="Mumbai · Thane" />
              <MetaItem label="Timezone" value="GMT +5:30" />
              <MetaItem label="Open to" value="Senior FE + AI roles" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}
