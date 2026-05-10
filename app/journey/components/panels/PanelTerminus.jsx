'use client';

// Hoarding panel — Mumbai Central / hire CTA.
export default function PanelTerminus({ panel }) {
  const links = panel.links ?? [];
  return (
    <div className="panel-terminus">
      {panel.heading && <h3 className="panel-terminus__heading">{panel.heading}</h3>}
      {panel.body && <p className="panel-terminus__body">{panel.body}</p>}
      {links.length > 0 && (
        <div className="panel-terminus__links">
          {links.map((l) => (
            <a className="panel-terminus__link" href={l.href} key={l.label}>
              {l.label}
              <span className="panel-terminus__arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
