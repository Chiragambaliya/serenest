import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfessionalsPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">For Professionals</p>
            <h1 className="page-title">A clinical platform for psychiatrists — not a generic telehealth app.</h1>
            <p className="about-subtext">
              Serenest helps psychiatrists deliver structured, compliant telepsychiatry: scheduling, intake,
              assessments, SOAP notes, prescriptions, and continuity — in one calm workflow.
            </p>
            <div className="hero-actions" style={{ marginTop: 14 }}>
              <Link className="btn btn-primary" to="/professionals/apply">
                Apply to join →
              </Link>
              <a className="btn btn-ghost" href="mailto:support@serenest.fit?subject=Clinic%20Partnership">
                Clinic partnership
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Why Serenest">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Built for clinical practice</p>
            <h2>Everything you need to run telepsychiatry, end-to-end.</h2>
            <p>
              Designed with a clinician-first mindset: reduce admin load, keep documentation consistent, and
              support continuity across sessions.
            </p>
          </div>

          <div className="feature-grid">
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                📅
              </div>
              <h3>Smart scheduling</h3>
              <p className="muted">Availability, slot visibility, follow-ups and reminders built-in.</p>
            </article>
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                📋
              </div>
              <h3>SOAP notes</h3>
              <p className="muted">Structured documentation with post-session locking for auditability.</p>
            </article>
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                💊
              </div>
              <h3>Digital Rx</h3>
              <p className="muted">MCI-aligned prescriptions with doctor registration details.</p>
            </article>
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                📊
              </div>
              <h3>Assessments</h3>
              <p className="muted">PHQ-9 / GAD-7 trends and mood logs for measurement-based care.</p>
            </article>
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                🔒
              </div>
              <h3>Privacy-first</h3>
              <p className="muted">Least-access design aligned to DPDP expectations.</p>
            </article>
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                💳
              </div>
              <h3>Payments & receipts</h3>
              <p className="muted">Razorpay-ready billing, receipts, and basic earnings views.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt" aria-label="How onboarding works">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Step by step</p>
            <h2>Go live in a structured, verified flow.</h2>
          </div>

          <ol className="steps">
            <li className="step">
              <strong>Apply</strong> — submit your credentials (MBBS + MD Psychiatry) and registration number.
            </li>
            <li className="step">
              <strong>Set consultation</strong> — fee, duration, and languages (English/Hindi/Gujarati).
            </li>
            <li className="step">
              <strong>Schedule</strong> — weekly availability and slots.
            </li>
            <li className="step">
              <strong>Verification</strong> — credentials reviewed before you go live.
            </li>
          </ol>
        </div>
      </section>

      <section className="section" aria-label="Compliance and trust">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Trust &amp; Compliance</p>
            <h2>Designed around India&apos;s telemedicine and privacy expectations.</h2>
          </div>

          <div className="grid-2 compliance-grid">
            <article className="tile">
              <h3>MCI Telemedicine Practice Guidelines 2020</h3>
              <p className="muted">
                Consult flow, consent, documentation and prescription format are designed to align with the
                national telemedicine guidelines.
              </p>
            </article>
            <article className="tile">
              <h3>DPDP Act 2023 (privacy-first)</h3>
              <p className="muted">
                Least-access approach and clear boundaries on visibility of patient records and data.
              </p>
            </article>
          </div>

          <div className="callout">
            <div className="callout-title">Note</div>
            <p className="muted" style={{ margin: 0 }}>
              Serenest is a clinical platform and does not support prescriptions without a consultation.
              Schedule H regulations are respected and restricted to verified MD psychiatrists.
            </p>
          </div>
        </div>
      </section>

      <section className="section alt" aria-label="CTA">
        <div className="container">
          <div className="cta about-cta">
            <div>
              <h2 className="h2" style={{ margin: 0 }}>
                Interested in joining Serenest?
              </h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                Tell us your city, languages, and consultation setup — we’ll share the next steps.
              </p>
              <p className="fineprint" style={{ marginBottom: 0 }}>
                Verified onboarding · Clinical-first workflows · Privacy-first
              </p>
            </div>
            <div className="stack about-cta-actions">
              <a
                className="btn btn-primary btn-full"
                href="mailto:support@serenest.fit?subject=Doctor%20Onboarding%20Request"
              >
                Join as a Doctor →
              </a>
              <a
                className="btn btn-ghost btn-full"
                href="mailto:support@serenest.fit?subject=Clinic%20Partnership%20Request"
              >
                Clinic partnership
              </a>
              <Link className="btn btn-ghost btn-full" to="/">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

