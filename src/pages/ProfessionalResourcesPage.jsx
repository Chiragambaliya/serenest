import React from 'react';
import { Link } from 'react-router-dom';

import ProfessionalHubCard from '../components/ProfessionalHubCard';
import { PROFESSIONAL_RESOURCES } from '../lib/professionalResources';

export default function ProfessionalResourcesPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">For Professionals</p>
            <h1 className="page-title">Resources — templates, handouts, and ops</h1>
            <p className="about-subtext">
              Shareables and checklists for day-to-day practice on Serenest. Many items link to our blog until
              dedicated PDFs or in-app downloads are published.
            </p>
            <div className="hero-actions" style={{ marginTop: 20 }}>
              <Link className="btn btn-primary" to="/professionals/apply">
                Apply to join →
              </Link>
              <Link className="btn btn-ghost" to="/professionals/learning">
                Learning hub →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Resource library">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Library</p>
            <h2>Tools you can use with patients and admin</h2>
            <p>
              Need a custom item? Email <a href="mailto:support@serenest.in">support@serenest.in</a> with your
              speciality and format preference.
            </p>
          </div>

          <div className="feature-grid">
            {PROFESSIONAL_RESOURCES.map((m) => (
              <ProfessionalHubCard key={m.id} module={m} />
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="cta about-cta">
            <div>
              <h2 className="h2" style={{ margin: 0 }}>
                Looking for CME-style deep dives?
              </h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                Start with the learning hub for curated clinical reads aligned with Serenest workflows.
              </p>
            </div>
            <div className="stack about-cta-actions">
              <Link className="btn btn-primary btn-full" to="/professionals/learning">
                Open learning hub →
              </Link>
              <Link className="btn btn-ghost btn-full" to="/professionals/guidelines">
                Compliance guidelines →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
