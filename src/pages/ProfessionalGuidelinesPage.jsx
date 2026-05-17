import React from 'react';
import { Link } from 'react-router-dom';

import { PROFESSIONAL_GUIDELINE_TOPICS } from '../lib/professionalGuidelines';

export default function ProfessionalGuidelinesPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">For Professionals</p>
            <h1 className="page-title">Guidelines &amp; compliance orientation</h1>
            <p className="about-subtext">
              High-level orientation for Indian telepsychiatry and privacy expectations. This is not legal advice;
              maintain your own registration, insurance, and counsel as appropriate.
            </p>
            <div className="hero-actions" style={{ marginTop: 20 }}>
              <Link className="btn btn-primary" to="/professionals/apply">
                Apply to join →
              </Link>
              <Link className="btn btn-ghost" to="/professionals/resources">
                Resources →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Guideline topics">
        <div className="container">
          <div className="guidelines-stack">
            {PROFESSIONAL_GUIDELINE_TOPICS.map((t) => (
              <article key={t.id} className="tile guideline-topic">
                <div className="blog-meta" style={{ marginBottom: 12 }}>
                  <span className="faq-pill">{t.pill}</span>
                </div>
                <h2 className="h2" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', marginBottom: 12 }}>
                  {t.title}
                </h2>
                <ul className="guideline-bullets">
                  {t.bullets.map((b, i) => (
                    <li key={`${t.id}-${i}`}>{b}</li>
                  ))}
                </ul>
                {t.to && t.linkLabel ? (
                  <Link className="learning-card-aux" style={{ display: 'inline-block', marginTop: 14 }} to={t.to}>
                    {t.linkLabel}
                  </Link>
                ) : null}
                {t.href && t.linkLabel ? (
                  <a
                    className="learning-card-aux"
                    style={{ display: 'inline-block', marginTop: 14 }}
                    href={t.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.linkLabel}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="callout">
            <div className="callout-title">Disclaimer</div>
            <p className="muted" style={{ margin: 0 }}>
              Serenest provides software workflows; regulatory compliance remains your responsibility. Verify all
              prescribing, documentation, and data practices against current law and your professional body’s
              standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
