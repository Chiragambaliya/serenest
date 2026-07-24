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
        <div className="container">
          <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '2rem' }}>
            {REASONS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setSelected(r.key)}
                className={`svd-reason-btn${selected === r.key ? ' is-active' : ''}`}
                aria-pressed={selected === r.key}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="svd-list" style={{ gridTemplateColumns: '1fr', maxWidth: '36rem' }}>
            <li>
              <strong>{reason.label}</strong>
              <span>{reason.body}</span>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
            </li>
          </div>
        </div>
      </section>

      <section className="svd-section svd-section--soft">
        <div className="container">
          <h2>Other ways to reach us</h2>
          <ul className="svd-list">
            <li>
              <strong>Email</strong>
              <span><a href="mailto:support@serenest.in">support@serenest.in</a></span>
            </li>
            <li>
              <strong>Phone / WhatsApp</strong>
              <span><a href="tel:917777936367">+91 77779 36367</a></span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
