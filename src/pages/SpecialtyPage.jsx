import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { DRUG_GUIDES_BASE, guideCountFor } from '../lib/drugGuides/index.js';
import { getSpecialty, practitionersFor, specialtyPath, SPECIALTIES } from '../lib/specialties.js';
import { ROUTE_SEO } from '../lib/seo';
import { useSEO } from '../lib/useSEO';

const STEPS = [
  ['Request a slot', 'Tell us what you need and pick a preferred time. No payment yet.'],
  ['We confirm', 'Our team calls or WhatsApps you to confirm the doctor and time.'],
  ['Consult online', 'Meet by video, audio or chat. Share reports beforehand if you have them.'],
  ['Prescription & follow-up', 'Where clinically appropriate, receive a digital prescription and a follow-up plan.'],
];

export default function SpecialtyPage() {
  const { slug } = useParams();
  const sp = getSpecialty(slug);
  const path = specialtyPath(slug);

  useSEO(sp ? { path, ...ROUTE_SEO[path] } : { path, title: 'Specialty not found | Serenest', noindex: true });

  if (!sp) {
    return (
      <div className="page">
        <section className="section about-hero">
          <div className="container">
            <div className="section-head about-hero-head">
              <p className="kicker">Specialties</p>
              <h1 className="page-title">Specialty not found.</h1>
              <div className="hero-actions" style={{ marginTop: 14 }}>
                <Link className="btn btn-primary" to="/specialties">
                  All specialties
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const practitioners = practitionersFor(sp.slug);
  const guides = guideCountFor(sp.slug);
  const others = SPECIALTIES.filter((s) => s.slug !== sp.slug).slice(0, 6);

  return (
    <div className="page sp">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <nav className="dg-crumbs" aria-label="Breadcrumb">
              <Link to="/specialties">Specialties</Link>
            </nav>
            <p className="kicker">Online consultation</p>
            <h1 className="page-title">{sp.name}</h1>
            <p className="about-subtext">{sp.summary}</p>
            <div className="hero-actions" style={{ marginTop: 20 }}>
              <Link className="btn btn-primary" to={`/book?specialty=${sp.slug}`}>
                Request a consultation →
              </Link>
              <Link className="btn btn-ghost" to={`/patient/find-professional?specialty=${sp.slug}`}>
                See doctors
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container sp-layout">
          <div>
            <h2 className="sp-h2">What we help with</h2>
            <ul className="sp-conds">
              {sp.conditions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="muted sp-note">
              Online consultations work well for many first visits, follow-ups, second opinions and review of reports.
              If your doctor needs to examine you in person or arrange tests, they will tell you and help you plan the
              next step.
            </p>

            {sp.servicePages ? (
              <>
                <h2 className="sp-h2">Services in this specialty</h2>
                <div className="sp-links">
                  {sp.servicePages.map((l) => (
                    <Link key={l.to} className="btn btn-ghost" to={l.to}>
                      {l.label} →
                    </Link>
                  ))}
                </div>
              </>
            ) : null}

            <h2 className="sp-h2">How it works</h2>
            <ol className="sp-steps">
              {STEPS.map(([t, d], i) => (
                <li key={t}>
                  <span className="sp-steps__n">{i + 1}</span>
                  <span>
                    <strong>{t}</strong>
                    <br />
                    <span className="muted">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <aside className="sp-aside">
            <div className="sp-panel">
              <h3>Who you can see</h3>
              <ul>
                {practitioners.map((p) => (
                  <li key={p.id}>{sp.slug === 'psychiatry' ? p.label : `${sp.name} specialist`}</li>
                ))}
              </ul>
              <p className="muted">Every clinician is verified against their council registration before listing.</p>
              <Link className="btn btn-primary btn-full" to={`/book?specialty=${sp.slug}`}>
                Request a consultation
              </Link>
            </div>
            <div className="sp-panel sp-panel--warn">
              <h3>Emergencies</h3>
              <p className="muted" style={{ margin: 0 }}>
                Chest pain, difficulty breathing, severe bleeding, stroke symptoms or thoughts of self-harm need
                immediate care — call 112 or go to the nearest hospital.
              </p>
            </div>
            {guides > 0 ? (
              <div className="sp-panel">
                <h3>For doctors</h3>
                <p className="muted">
                  {guides} {sp.name} drug {guides === 1 ? 'guide' : 'guides'} in the Serenest Learn library.
                </p>
                <Link to={`${DRUG_GUIDES_BASE}?specialty=${sp.slug}`}>Open drug guides →</Link>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="sp-h2">Other specialties</h2>
          <div className="sp-links">
            {others.map((o) => (
              <Link key={o.slug} className="btn btn-ghost" to={specialtyPath(o.slug)}>
                {o.name}
              </Link>
            ))}
            <Link className="btn btn-ghost" to="/specialties">
              All specialties →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
