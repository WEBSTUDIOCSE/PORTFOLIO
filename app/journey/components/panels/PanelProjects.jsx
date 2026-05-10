'use client';

// Hoarding panel — projects strip. Horizontal scroll-snap row of cards.
export default function PanelProjects({ panel }) {
  const cards = panel.cards ?? [];
  return (
    <div className="panel-projects-strip">
      {cards.map((p) => (
        <article className="proj-card" key={p.num}>
          <div className="proj-card__num">{p.num}</div>
          <div className="proj-card__title">{p.title}</div>
          {p.meta && <div className="proj-card__meta">{p.meta}</div>}
          {p.stack?.length > 0 && (
            <div className="proj-card__stack">
              {p.stack.map((tag) => (
                <span className="proj-card__tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
