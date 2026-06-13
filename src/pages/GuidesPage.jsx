import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { guidesGroupedByCategory } from '../lib/guides';

export default function GuidesPage() {
  useSEO({ path: '/guides', ...ROUTE_SEO['/guides'] });

  const groups = guidesGroupedByCategory();

  return (
    <div className="guides">
      <section className="guides__hero">
        <div className="guides__shell">
          <p className="guides__eyebrow">Guides</p>
          <h1 className="guides__title">Clear answers for common mental health questions</h1>
          <p className="guides__lead">
            In-depth pages on conditions, screening tools, and online care in India — written in plain
            language, grounded in clinical practice.
          </p>
          <div className="guides__actions">
            <Link className="btn btn-primary btn-lg" to="/book">
              Book now
            </Link>
            <Link className="btn btn-ghost btn-lg" to="/screening">
              Take screening
            </Link>
          </div>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.key} className="guides__section" aria-labelledby={`guides-${group.key}`}>
          <div className="guides__shell">
            <h2 id={`guides-${group.key}`} className="guides__section-title">
              {group.label}
            </h2>
            <ul className="guides__list">
              {group.guides.map((guide) => (
                <li key={guide.path}>
                  <Link className="guides__card" to={guide.path}>
                    <div>
                      <h3>{guide.title}</h3>
                      <p>{guide.description}</p>
                    </div>
                    <span className="guides__card-arrow" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="guides__cta">
        <div className="guides__shell guides__cta-inner">
          <div>
            <h2>Not sure where to start?</h2>
            <p>
              Try a free PHQ-9 or GAD-7 screening, or book a consultation and we will match you with
              the right clinician.
            </p>
          </div>
          <div className="guides__cta-actions">
            <Link className="btn btn-primary btn-lg" to="/screening">
              Start screening
            </Link>
            <Link className="btn btn-ghost btn-lg" to="/faq">
              Read FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
