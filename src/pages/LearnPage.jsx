import React from 'react';
import { Link } from 'react-router-dom';

import { LEARN_SECTIONS } from '../lib/learnHub';
import { ROUTE_SEO } from '../lib/seo';
import { useSEO } from '../lib/useSEO';

function CardBody({ item }) {
  return (
    <>
      <span className="learn-card__top">
        {item.meta ? <span className="learn-card__meta">{item.meta}</span> : <span />}
        {item.status === 'soon' ? <span className="learn-card__soon">Coming soon</span> : null}
      </span>
      <span className="learn-card__title">{item.title}</span>
      <span className="learn-card__summary">{item.summary}</span>
      {item.status === 'live' ? (
        <span className="learn-card__cta">
          Open <span aria-hidden="true">→</span>
        </span>
      ) : null}
    </>
  );
}

function LearnCard({ item }) {
  if (item.status === 'live' && item.to) {
    return (
      <Link className="learn-card" to={item.to}>
        <CardBody item={item} />
      </Link>
    );
  }
  if (item.status === 'live' && item.href) {
    return (
      <a className="learn-card" href={item.href} target="_blank" rel="noreferrer">
        <CardBody item={item} />
      </a>
    );
  }
  return (
    <div className="learn-card is-soon" aria-disabled="true">
      <CardBody item={item} />
    </div>
  );
}

export default function LearnPage() {
  useSEO({ path: '/learn', ...ROUTE_SEO['/learn'] });

  return (
    <div className="page learn">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Learn</p>
            <h1 className="page-title">Learn with Serenest</h1>
            <p className="about-subtext">
              Doctor-led learning in two tracks: clinical references and teaching for professionals, and clear,
              trustworthy reading for patients and families.
            </p>
            <nav className="learn-jump" aria-label="Sections">
              {LEARN_SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="btn btn-ghost">
                  {s.kicker}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {LEARN_SECTIONS.map((section, i) => (
        <section
          key={section.id}
          id={section.id}
          className={`section learn-section${i % 2 ? ' alt' : ''}`}
          aria-labelledby={`${section.id}-title`}
        >
          <div className="container">
            <div className="section-head">
              <p className="section-label">{section.kicker}</p>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              <p>{section.intro}</p>
            </div>
            <ul className="learn-grid">
              {section.items.map((item) => (
                <li key={item.id}>
                  <LearnCard item={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container">
          <div className="callout">
            <div className="callout-title">Suggest a topic</div>
            <p className="muted" style={{ margin: 0 }}>
              Want a drug guide, scale or topic covered? Email{' '}
              <a href="mailto:support@serenest.in?subject=Learn%20topic%20request">support@serenest.in</a>. Educational
              content does not replace a consultation — for personal advice,{' '}
              <Link to="/book">book an appointment</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
