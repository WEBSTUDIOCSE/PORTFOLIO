'use client';

// Hoarding panel — Origin / lede paragraph + meta footer.
export default function PanelIntro({ panel }) {
  return (
    <div className="panel-intro">
      <p className="panel-intro__lede">{panel.lede}</p>
      {panel.meta && <div className="panel-intro__meta">{panel.meta}</div>}
    </div>
  );
}
