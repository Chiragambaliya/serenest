import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { SCREENING_TOOLS } from '../lib/screeningTools';

export default function ScreeningPage() {
  useSEO({ path: '/screening', ...ROUTE_SEO['/screening'] });
  return (
    <div className="care-shell">
      <section className="care-section">
        <p className="care-kicker">Screening · not a diagnosis</p>
        <h2>A private check before you book.</h2>
        <p>
          These checks run in your browser. They do not replace a clinician. If you are in immediate danger, call 112.
        </p>
      </section>
      <div className="care-index">
        {SCREENING_TOOLS.map((tool, i) => (
          <Link key={tool.id} to={`/screening/tool/${tool.slug}`}>
            <span className="care-index__num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{tool.title}</h3>
            <p>{tool.blurb}</p>
            <span className="care-index__go">Start →</span>
          </Link>
        ))}
      </div>
      <div className="care-actions">
        <Link className="care-btn care-btn--primary" to="/book">Skip this — book care</Link>
      </div>
    </div>
  );
}
