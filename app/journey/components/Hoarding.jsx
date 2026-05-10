'use client';

import PanelIntro from './panels/PanelIntro.jsx';
import PanelJourney from './panels/PanelJourney.jsx';
import PanelHobbies from './panels/PanelHobbies.jsx';
import PanelProjects from './panels/PanelProjects.jsx';
import PanelTerminus from './panels/PanelTerminus.jsx';

const PANEL_BY_TYPE = {
  intro: PanelIntro,
  journey: PanelJourney,
  hobbies: PanelHobbies,
  // 'skills' reuses the hobbies grid layout — same data shape
  // (icon + name + note), different semantic label.
  skills: PanelHobbies,
  projects: PanelProjects,
  terminus: PanelTerminus,
};

// Top hoarding overlay — fixed-position DOM band over the Canvas.
// Left: maroon enamel station sign. Right: swappable content panel
// driven by the active station's `panel.type`.
export default function Hoarding({ stations, activeIdx }) {
  const station = stations[activeIdx] ?? stations[0];

  return (
    <div className="journey-hoarding" aria-live="polite">
      <header className="journey-brandbar">
        <span className="journey-brandbar__left">
          <span className="journey-brandbar__pulse" aria-hidden="true" />
          <span>SJ-01 Portfolio Express · WAP-7</span>
        </span>
        <span className="journey-brandbar__center">
          <span className="journey-brandbar__deva">सौरभ जाधव</span>
          <span className="journey-brandbar__sep">·</span>
          <span>SAURABH JADHAV</span>
        </span>
        <span className="journey-brandbar__right">/journey</span>
      </header>

      <section className="journey-hoarding-row">
        {/* Maroon enamel station sign */}
        <div className="journey-station-sign">
          <span className="journey-station-sign__bolt journey-station-sign__bolt--tl" aria-hidden="true" />
          <span className="journey-station-sign__bolt journey-station-sign__bolt--tr" aria-hidden="true" />
          <span className="journey-station-sign__bolt journey-station-sign__bolt--bl" aria-hidden="true" />
          <span className="journey-station-sign__bolt journey-station-sign__bolt--br" aria-hidden="true" />
          <div className="journey-station-sign__stop">
            HALT {String(station.stop).padStart(2, '0')} OF{' '}
            {String(stations.length).padStart(2, '0')}
          </div>
          <div className="journey-station-sign__deva">{station.deva}</div>
          <h1 className="journey-station-sign__name">{station.name}</h1>
          <div className="journey-station-sign__km-row">
            <span className="journey-station-sign__km">{station.km} KM</span>
            <span className="journey-station-sign__plat">{station.plat}</span>
          </div>
        </div>

        {/* Cream content panel — renders one panel per station */}
        <div className="journey-hoarding-panel">
          {stations.map((s, i) => {
            const Panel = PANEL_BY_TYPE[s.panel?.type] ?? PanelIntro;
            const isActive = i === activeIdx;
            return (
              <div
                key={s.id}
                className={`journey-panel${isActive ? ' is-active' : ''}`}
                aria-hidden={!isActive}
              >
                <Panel panel={s.panel} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
