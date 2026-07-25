import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import '../styles/service-detail.css';

const REASONS = [
  {
    key: 'patient',
    label: 'Patient support',
    body: 'Questions about an existing consultation, prescription, or account.',
    subject: 'Patient%20Support',
  },
  {
    key: 'appointment',
    label: 'Appointment help',
    body: 'Need help booking, rescheduling, or choosing a service.',
    subject: 'Appointment%20Help',
    extra: { to: '/book', label: 'Or book directly' },
  },
  {
    key: 'professional',
    label: 'Professional collaboration',
    body: 'Partnering with Serenest as a clinician, clinic, or platform.',
    subject: 'Professional%20Collaboration',
    extra: { to: '/partner', label: 'Or see partner options' },
  },
  {
    key: 'academy',
    label: 'Academy questions',
    body: 'Programs, enrolment, or general questions about Serenest Academy.',
    subject: 'Academy%20Question',
    extra: { to: '/academy', label: 'Or visit the Academy' },
  },
  {
    key: 'faculty',
    label: 'Faculty applications',
    body: 'Interested in teaching or contributing to Serenest Academy.',
    subject: 'Faculty%20Application',
  },
  {
    key: 'general',
    label: 'General enquiries',
    body: 'Anything else — we\'ll route it to the right person.',
    subject: 'General%20Enquiry',
  },
];

export default function ContactPage() {
  useSEO({
    path: '/contact',
    title: 'Contact Serenest',
    description: 'Get in touch with Serenest for patient support, appointment help, professional collaboration, or Academy questions.',
  });

  const [selected, setSelected] = useState(REASONS[0].key);
  const reason = REASONS.find((r) => r.key === selected);

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Contact</p>
          <h1>What can we help with?</h1>
          <p className="svd-hero__lead">
            Choose the reason you're reaching out and we'll make sure it gets to the right
            person. For urgent clinical concerns, this page is not for emergencies —
            contact local emergency services if you or someone else is at risk.
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
              <a
                className="btn btn-primary"
                href={`mailto:support@serenest.in?subject=${reason.subject}`}
              >
                Email us
              </a>
              {reason.extra && (
                <Link className="btn btn-ghost" to={reason.extra.to}>{reason.extra.label}</Link>
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
              <a className="ed-index__row" href="tel:917777936367">
                <span className="ed-index__num">02</span>
                <span>
                  <h3 className="ed-index__title">Phone / WhatsApp</h3>
                </span>
                <p className="ed-index__body">+91 77779 36367</p>
                <span className="ed-index__go" aria-hidden="true">Call →</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
