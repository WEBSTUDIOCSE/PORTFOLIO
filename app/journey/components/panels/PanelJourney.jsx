'use client';

// Hoarding panel — career timeline. Horizontal scroll-snap row of cards.
export default function PanelJourney({ panel }) {
  const cards = panel.cards ?? [];
  return (
    <div className="panel-journey-strip">
      {cards.map((c, i) => (
        <article className="tl-card" key={`${c.year}-${i}`}>
          <div className="tl-card__year">{c.year}</div>
          <div className="tl-card__role">{c.role}</div>
          <div className="tl-card__org">{c.org}</div>
          {c.notes?.length > 0 && (
            <ul className="tl-card__notes">
              {c.notes.map((n, j) => (
                <li key={j}>{n}</li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}
