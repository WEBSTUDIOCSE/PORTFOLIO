// Story — long-form origin narrative as a "scrollytelling" section:
// a sticky video on the left holds while the eight beats scroll past
// on the right (desktop). On mobile the video pins to the top and the
// beats stack beneath it.
//
// VIDEO: drop your file in /public/assets (e.g. story.mp4) and set
// STORY_VIDEO below. Until then a placeholder card renders so nothing
// looks broken. The <video> is muted + loop + playsInline so it can
// autoplay quietly alongside the scroll; preload="metadata" keeps it
// from eating bandwidth before it's needed.

import { STORY_BEATS } from "@/lib/story";

// Set to your video path once uploaded, e.g. "/assets/story.mp4".
// Leave "" to show the placeholder.
const STORY_VIDEO = "";
// Optional poster frame shown before play, e.g. "/assets/story-poster.jpg".
const STORY_POSTER = "";

export default function Story() {
  return (
    <section
      id="story"
      className="border-t border-border bg-background px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-2xl">
          <p className="font-hand text-2xl text-primary">my story</p>
          <h2 className="mt-1 font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
            The long way to the keyboard.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            From a 99-in-1 cartridge to shipping AI systems — the honest,
            non-linear version.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-14">
          {/* Sticky video */}
          <div className="md:col-span-2">
            <div className="md:sticky md:top-24">
              {STORY_VIDEO ? (
                <video
                  className="w-full rounded-xl border border-border bg-card"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={STORY_POSTER || undefined}
                >
                  <source src={STORY_VIDEO} type="video/mp4" />
                </video>
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 text-center">
                  <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.25em] text-muted-foreground">
                    Story video
                    <br />
                    coming soon
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Beats */}
          <div className="md:col-span-3">
            <ol className="space-y-12 sm:space-y-16">
              {STORY_BEATS.map((b) => (
                <li key={b.n}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
                    {b.n}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-light tracking-tight text-foreground sm:text-2xl">
                    {b.title}
                  </h3>
                  <div className="mt-3 space-y-3 text-base leading-relaxed">
                    {b.body.map((p, i) => (
                      <p
                        key={i}
                        className={i === 0 ? "text-foreground" : "text-muted-foreground"}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
