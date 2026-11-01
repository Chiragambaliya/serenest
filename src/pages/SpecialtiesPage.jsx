import React from 'react';
import { Link } from 'react-router-dom';

import { SPECIALTIES, specialtyPath } from '../lib/specialties.js';
import { ROUTE_SEO } from '../lib/seo';
import { useSEO } from '../lib/useSEO';

export default function SpecialtiesPage() {
  useSEO({ path: '/specialties', ...ROUTE_SEO['/specialties'] });

  return (
    <div className="page sp">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Specialties</p>
            <h1 className="page-title">Consult a specialist online</h1>
            <p className="about-subtext">
              Verified doctors across {SPECIALTIES.length} specialties, by video, audio or chat. Request a slot — we confirm
              by phone or WhatsApp, and you pay only once it is booked.
            </p>
            <div className="hero-actions" style={{ marginTop: 20 }}>
              <Link className="btn btn-primary" to="/book">
                Request an appointment →
              </Link>
              <Link className="btn btn-ghost" to="/patient/find-professional">
                Browse doctors
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="All specialties">
        <div className="container">
          <ul className="sp-grid">
            {SPECIALTIES.map((s) => (
              <li key={s.slug}>
                <Link className="sp-card" to={specialtyPath(s.slug)}>
                  <span className="sp-card__name">{s.name}</span>
                  <span className="sp-card__summary">{s.summary}</span>
                  <span className="sp-card__conds">{s.conditions.slice(0, 3).join(' · ')}</span>
                  <span className="sp-card__cta">
                    Learn more <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="callout">
            <div className="callout-title">Not sure which specialty?</div>
            <p className="muted" style={{ margin: 0 }}>
              Choose General Medicine and a physician will advise you or refer you to the right specialist. In an
              emergency, call 112 or go to the nearest hospital — online consultation is not for emergencies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
