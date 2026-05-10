'use client';

// Hoarding panel — 4-col hobbies grid (collapses to 2-col under 800px).
export default function PanelHobbies({ panel }) {
  const items = panel.items ?? [];
  return (
    <div className="panel-hobbies-grid">
      {items.map((it) => (
        <article className="hobby-card" key={it.name}>
          <span className="hobby-card__icon" aria-hidden="true">
            {it.icon}
          </span>
          <div className="hobby-card__name">{it.name}</div>
          {it.note && <div className="hobby-card__note">{it.note}</div>}
        </article>
      ))}
    </div>
  );
}
