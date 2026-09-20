import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { CARE_PHONE_DISPLAY, CARE_TEL_HREF, careWaHref } from '../lib/patientReach';
import '../styles/service-detail.css';

const REASONS = [
  {
    key: 'appointment',
    label: 'I want an appointment',
    body: 'Need help requesting, rescheduling, or choosing a clinician.',
    subject: 'Appointment%20Help',
    extra: { to: '/book', label: 'Or request a slot now' },
  },
  {
    key: 'patient',
    label: 'I am already a patient',
    body: 'Questions about an existing consultation, prescription, or account.',
    subject: 'Patient%20Support',
  },
  {
    key: 'general',
    label: 'Something else',
    body: 'Anything else — we will route it to the right person.',
    subject: 'General%20Enquiry',
  },
  {
    key: 'professional',
    label: 'I am a clinician or partner',
    body: 'Joining Serenest as a clinician, clinic, or organisation.',
    subject: 'Professional%20Collaboration',
    extra: { to: '/professionals', label: 'Or see the clinician page' },
  },
];

export default function ContactPage() {
  useSEO({ path: '/contact', ...ROUTE_SEO['/contact'] });

  const [selected, setSelected] = useState(REASONS[0].key);
  const reason = REASONS.find((r) => r.key === selected);

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Contact</p>
          <h1>What can we help with?</h1>
          <p className="svd-hero__lead">
            Most people write because they want an appointment. Choose a reason and we will
            route it. This page is not for emergencies — contact local emergency services if
            you or someone else is at immediate risk.
          </p>
        </div>
      </section>

      <section className="svd-section">
        <div className="ed-shell ed-facing">
          <div>
            <p className="ed-mono">Reasons</p>
            <div className="ed-index contact-reason-index" role="list" aria-label="Contact reasons">
              {REASONS.map((r, i) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setSelected(r.key)}
                  className={`ed-index__row contact-reason-index__row${selected === r.key ? ' is-active' : ''}`}
                  aria-pressed={selected === r.key}
                >
                  <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="ed-index__title">{r.label}</span>
                    <span className="ed-index__meta">{selected === r.key ? 'Selected' : 'Choose'}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="contact-reason-detail">
            <p className="ed-aside__label">Selected route</p>
            <h2>{reason.label}</h2>
            <p className="ed-lede">{reason.body}</p>
            <div className="contact-reason-detail__actions">
              {reason.extra?.to === '/book' ? (
                <>
                  <Link className="btn btn-primary" to="/book">Request an appointment</Link>
                  <a
                    className="btn btn-whatsapp"
                    href={careWaHref()}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                  <a
                    className="btn btn-ghost"
                    href={`mailto:support@serenest.in?subject=${reason.subject}`}
                  >
                    Email us
                  </a>
                </>
              ) : (
                <>
                  <a
                    className="btn btn-primary"
                    href={`mailto:support@serenest.in?subject=${reason.subject}`}
                  >
                    Email us
                  </a>
                  {reason.extra && (
                    <Link className="btn btn-ghost" to={reason.extra.to}>{reason.extra.label}</Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="svd-section svd-section--soft">
        <div className="ed-shell ed-aside">
          <div>
            <p className="ed-aside__label">Direct contact</p>
            <p className="ed-aside__note">Email and Phone / WhatsApp.</p>
          </div>
          <div>
            <h2>Other ways to reach us</h2>
            <div className="ed-index">
              <a className="ed-index__row" href="mailto:support@serenest.in">
                <span className="ed-index__num">01</span>
                <span>
                  <h3 className="ed-index__title">Email</h3>
                </span>
                <p className="ed-index__body">support@serenest.in</p>
                <span className="ed-index__go" aria-hidden="true">Write →</span>
              </a>
              <a className="ed-index__row" href={CARE_TEL_HREF}>
                <span className="ed-index__num">02</span>
                <span>
                  <h3 className="ed-index__title">Call</h3>
                </span>
                <p className="ed-index__body">{CARE_PHONE_DISPLAY}</p>
                <span className="ed-index__go" aria-hidden="true">Call →</span>
              </a>
              <a className="ed-index__row" href={careWaHref()} target="_blank" rel="noreferrer">
                <span className="ed-index__num">03</span>
                <span>
                  <h3 className="ed-index__title">WhatsApp</h3>
                </span>
                <p className="ed-index__body">{CARE_PHONE_DISPLAY}</p>
                <span className="ed-index__go" aria-hidden="true">Chat →</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
