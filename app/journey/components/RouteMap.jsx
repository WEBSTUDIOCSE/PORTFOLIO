'use client';

import { TOTAL_KM } from './scenes.js';

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (x) => Math.max(0, Math.min(1, x));

function jumpToStation(idx) {
  if (typeof window === 'undefined') return;
  window.scrollTo({
    top: idx * window.innerHeight,
    behavior: 'smooth',
  });
}

// Bottom route-map — minimal version. Just the track + medallions
// + prev/play/next + a small KM readout. No engraved header, no
// status chips, no speed readout, no per-medallion time labels.
// One job: show progression along the line and let users jump.
export default function RouteMap({ stations, activeIdx, progress, scrollT }) {
  const fromKm = parseInt(stations[activeIdx]?.km ?? '0', 10);
  const toKm = parseInt(
    stations[Math.min(stations.length - 1, activeIdx + 1)]?.km ??
      `${TOTAL_KM}`,
    10
  );
  const inSceneT = clamp01(scrollT - activeIdx);
  const currentKm = Math.round(lerp(fromKm, toKm, inSceneT));

  const canPrev = activeIdx > 0;
  const canNext = activeIdx < stations.length - 1;
  const active = stations[activeIdx];

  return (
    <div
      className="journey-routemap"
      role="navigation"
      aria-label="Journey route map"
    >
      <div className="journey-plate">
        <div className="journey-track-row">
          <div className="journey-sleepers" aria-hidden="true" />
          <div className="journey-rails" aria-hidden="true">
            <div className="journey-rail" />
            <div className="journey-rail" />
          </div>
          <div className="journey-medallions">
            {stations.map((s, i) => {
              const isActive = i === activeIdx;
              const isPast = i < activeIdx;
              const cls = [
                'journey-medallion',
                isActive && 'is-active',
                isPast && 'is-past',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <button
                  key={s.id}
                  type="button"
                  className={cls}
                  style={{ left: `${s.p * 100}%` }}
                  aria-label={`Go to ${s.name}, kilometre ${s.km}`}
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => jumpToStation(i)}
                >
                  <span className="journey-medallion__circle">
                    {String(s.stop).padStart(2, '0')}
                  </span>
                  <span className="journey-medallion__name">{s.name}</span>
                </button>
              );
            })}
          </div>
          <div
            className="journey-route-train"
            style={{ left: `${progress * 100}%` }}
            aria-hidden="true"
          />
        </div>

        <div className="journey-plate-bar">
          <div className="journey-dock">
            <button
              type="button"
              aria-label="Previous station"
              disabled={!canPrev}
              onClick={() => canPrev && jumpToStation(activeIdx - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="journey-dock__play"
              aria-label="Auto-play (coming soon)"
              disabled
            >
              ▶
            </button>
            <button
              type="button"
              aria-label="Next station"
              disabled={!canNext}
              onClick={() => canNext && jumpToStation(activeIdx + 1)}
            >
              ›
            </button>
          </div>

          <div className="journey-readout" aria-live="polite">
            <span className="journey-readout__deva">{active?.deva}</span>
            <span className="journey-readout__sep">·</span>
            <span className="journey-readout__km">
              {String(currentKm).padStart(3, '0')} / {TOTAL_KM} KM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
