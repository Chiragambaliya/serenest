import React from 'react';
import { Link } from 'react-router-dom';
import EdIcon from './EdIcon';
import SectionHeading from './SectionHeading';

/** Academy visual preview — four learning areas only. */
export default function AcademyPreview({ areas, primary, secondary }) {
  return (
    <section className="ed-academy" aria-labelledby="ed-academy-title">
      <div className="ds-shell ds-shell--wide">
        <SectionHeading
          eyebrow="Serenest Academy"
          title="Learning that strengthens practice."
          description="Short, clinically grounded programmes for people shaping mental healthcare."
          titleId="ed-academy-title"
          align="center"
        />

        <ul className="ed-academy__grid">
          {areas.map((area) => (
            <li key={area.title}>
              <Link to={area.to} className="ed-academy__item">
                <span className="ds-icon" aria-hidden="true">
                  <EdIcon name={area.icon} size={20} />
                </span>
                <h3>{area.title}</h3>
              </Link>
            </li>
          ))}
        </ul>

        <div className="ds-actions ed-academy__actions">
          <Link className="ds-btn ds-btn--primary" to={primary.to}>{primary.label}</Link>
          <Link className="ds-btn ds-btn--secondary" to={secondary.to}>{secondary.label}</Link>
        </div>
      </div>
    </section>
  );
}
