import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { openPrivacyChoices } from '../lib/privacyConsent';

const PRINCIPLES = [
  {
    title: 'No sale of your data',
    body: 'We do not sell personal or health information, and we do not use advertising trackers.',
  },
  {
    title: 'Least-access care',
    body: 'Access is limited to you, your treating professional, and authorised staff who need it to operate the service.',
  },
  {
    title: 'Choice before analytics',
    body: 'Optional analytics remain off unless you allow them. You can change that choice at any time.',
  },
];

const DATA_USES = [
  {
    title: 'Account and contact',
    body: 'Name, phone, optional email, login details, and communication preferences. Used to create your account, verify access, and contact you about care.',
  },
  {
    title: 'Appointments and care',
    body: 'Bookings, assessment responses, clinical notes, and prescriptions where applicable. Used to deliver care and maintain clinical continuity.',
  },
  {
    title: 'Payments and support',
    body: 'Transaction references, invoices, and messages you send to support. Used for billing, assistance, and dispute resolution.',
  },
  {
    title: 'Security and optional usage',
    body: 'Basic device and access logs protect the service. Page and referral analytics are collected only if you opt in; they must not include clinical answers.',
  },
];

const RIGHTS = [
  { title: 'Access', body: 'Ask what personal data we hold about you.' },
  { title: 'Correction', body: 'Ask us to correct incomplete or inaccurate details.' },
  { title: 'Deletion', body: 'Request deletion, subject to medical and financial record duties.' },
  { title: 'Grievance', body: 'Raise a privacy concern and receive a clear response.' },
];

export default function PrivacyPolicyPage() {
  useSEO({ path: '/privacy', ...ROUTE_SEO['/privacy'] });
  return (
    <div className="page privacy-page">
      <section className="privacy-page__hero">
        <div className="container privacy-page__hero-grid">
          <div>
            <p className="kicker">Privacy at Serenest</p>
            <h1 className="privacy-page__title">Your health information is yours.</h1>
            <p className="privacy-page__lede">
              Mental healthcare requires trust. This notice explains, in plain language, what Serenest
              collects, why we need it, who can see it, and the choices you control.
            </p>
            <p className="privacy-page__meta">
              Effective 7 August 2026 · Data controller: Serenest Education Pvt Ltd, India
            </p>
          </div>
          <aside className="privacy-promise" aria-label="Our privacy promise">
            <span className="privacy-promise__label">Our promise</span>
            <p>Care first. Collect less. Never turn sensitive information into advertising.</p>
            <small>Questions? support@serenest.in</small>
          </aside>
        </div>
      </section>

      <section className="privacy-section" aria-labelledby="privacy-principles-title">
        <div className="container">
          <header className="privacy-section__head">
            <span className="privacy-section__label">01 · Commitments</span>
            <h2 id="privacy-principles-title">Privacy principles you can hold us to.</h2>
          </header>
          <div className="privacy-principles">
            {PRINCIPLES.map((item, index) => (
              <article className="privacy-card" key={item.title}>
                <span className="privacy-card__number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="privacy-section privacy-section--dark" aria-labelledby="privacy-data-title">
        <div className="container">
          <header className="privacy-section__head">
            <span className="privacy-section__label">02 · Data map</span>
            <h2 id="privacy-data-title">What we use, and what it is for.</h2>
          </header>
          <div className="privacy-data-grid">
            {DATA_USES.map((item) => (
              <article className="privacy-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="privacy-page__actions">
            <Link className="btn btn-ghost" to="/data-retention">See retention periods →</Link>
            <Link className="btn btn-ghost" to="/cookie-policy">Read cookie details →</Link>
          </div>
        </div>
      </section>

      <section className="privacy-section" aria-labelledby="privacy-rights-title">
        <div className="container">
          <header className="privacy-section__head">
            <span className="privacy-section__label">03 · Your rights</span>
            <h2 id="privacy-rights-title">You stay in control.</h2>
          </header>
          <div className="privacy-rights">
            {RIGHTS.map((item, index) => (
              <article className="privacy-card" key={item.title}>
                <span className="privacy-card__number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="privacy-page__actions">
            <button className="btn btn-primary" type="button" onClick={openPrivacyChoices}>
              Manage privacy choices
            </button>
            <a className="btn btn-ghost" href="mailto:support@serenest.in?subject=Privacy%20request">
              Make a privacy request
            </a>
            <Link className="btn btn-ghost" to="/grievance-policy">Grievance process</Link>
          </div>
          <div className="callout" style={{ marginTop: 40 }}>
            <div className="callout-title">Security and necessary disclosure</div>
            <p className="muted" style={{ margin: 0 }}>
              We use encryption in transit, access controls, and audit logs. No system is risk-free.
              We may disclose data when required by law, to protect someone from serious harm, or to
              providers that process data for us under appropriate safeguards. If you believe your account
              is compromised, email <a href="mailto:support@serenest.in">support@serenest.in</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

