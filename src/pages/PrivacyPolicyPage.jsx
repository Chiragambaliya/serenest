import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Privacy Policy</p>
            <h1 className="page-title">Your health information is yours.</h1>
            <p className="about-subtext">
              We built Serenest with a privacy-first mindset and a least-access approach. This page explains
              what we collect, why we collect it, and your choices.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-grid">
            <article className="tile legal-card">
              <h3>What we collect</h3>
              <ul className="list">
                <li>Account details: name, phone, optional email</li>
                <li>Appointment details and communication preferences</li>
                <li>Clinical inputs: assessments (PHQ-9/GAD-7), notes you submit</li>
                <li>Consultation records: session notes and prescriptions (where applicable)</li>
                <li>Technical data: basic device/log data to keep the service secure</li>
              </ul>
            </article>

            <article className="tile legal-card">
              <h3>Why we collect it</h3>
              <ul className="list">
                <li>To provide care and enable continuity across sessions</li>
                <li>To schedule appointments and share confirmations</li>
                <li>To meet clinical documentation expectations</li>
                <li>To prevent fraud, abuse, and protect account security</li>
                <li>To improve product reliability and safety</li>
              </ul>
            </article>

            <article className="tile legal-card">
              <h3>Who can see your data</h3>
              <p className="muted">
                We follow a least-access approach. Access is limited to you, your treating practitioner(s),
                and authorized administrators as required for operations and compliance.
              </p>
              <div className="callout">
                <div className="callout-title">We do not sell data</div>
                <p className="muted" style={{ margin: 0 }}>
                  We do not sell your personal or health information to advertisers.
                </p>
              </div>
            </article>

            <article className="tile legal-card">
              <h3>Security</h3>
              <p className="muted">
                We use industry-standard controls (encryption in transit, access controls, auditability)
                and design workflows to avoid unnecessary access.
              </p>
              <p className="muted" style={{ marginTop: 10 }}>
                No system can be 100% secure. If you believe your account is compromised, contact us
                immediately at{' '}
                <a href="mailto:support@serenest.fit">support@serenest.fit</a>.
              </p>
            </article>
          </div>

          <div className="callout" style={{ marginTop: 16 }}>
            <div className="callout-title">Emergency disclaimer</div>
            <p className="muted" style={{ margin: 0 }}>
              Serenest is not for psychiatric emergencies. If you or someone you know is in immediate danger,
              call iCall: <a href="tel:9152987821">9152987821</a> or your nearest emergency service.
            </p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="cta about-cta">
            <div>
              <h2 className="h2" style={{ margin: 0 }}>
                Questions about privacy?
              </h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                Email us and we’ll help.
              </p>
            </div>
            <div className="stack about-cta-actions">
              <a className="btn btn-primary btn-full" href="mailto:support@serenest.fit?subject=Privacy%20Question">
                Contact support →
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

