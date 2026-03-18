import React from 'react';
import { Link } from 'react-router-dom';

const TIERS = [
  {
    name: 'Single Consult',
    price: '₹499–999',
    note: 'One session',
    features: [
      'Video / audio / chat (as available)',
      'Structured intake + assessment context',
      'Clinical documentation',
      'Digital Rx (where applicable)',
    ],
  },
  {
    name: '3-Session Pack',
    price: 'Best value',
    note: 'Care continuity',
    popular: true,
    features: [
      '3 sessions (flexible scheduling)',
      'Progress tracking (PHQ-9 / GAD-7)',
      'Session history + locked records',
      'Follow-up recommendations',
    ],
  },
  {
    name: 'Monthly Care Plan',
    price: 'Custom',
    note: 'Ongoing support',
    features: [
      'Monthly follow-ups',
      'Medication management support',
      'Reminders + continuity features',
      'Priority scheduling (where available)',
    ],
  },
];

const FAQ = [
  {
    q: 'Are prescriptions valid at pharmacies?',
    a: 'Prescriptions issued after a consultation include the practitioner’s registration details and are designed to be verifiable and clinically documented.',
  },
  {
    q: 'Can I reschedule my appointment?',
    a: 'Yes — if you need to reschedule, contact support with your preferred alternate slot and we’ll help coordinate.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Refund and cancellation rules depend on booking status and timing. Email support and we’ll assist based on your case.',
  },
];

export default function PricingPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Pricing</p>
            <h1 className="page-title">Affordable mental health care. No surprises.</h1>
            <p className="about-subtext">
              Choose a plan that fits your needs — from a single consult to ongoing continuity-focused care.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pricing-grid">
            {TIERS.map((t) => (
              <article key={t.name} className={`tile pricing-card ${t.popular ? 'is-popular' : ''}`}>
                <div className="pricing-head">
                  <h3>{t.name}</h3>
                  {t.popular && <span className="service-badge">Most popular</span>}
                </div>
                <div className="pricing-price">{t.price}</div>
                <div className="pricing-note">{t.note}</div>
                <ul className="list" style={{ marginTop: 12 }}>
                  {t.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                <div className="pricing-actions">
                  <Link className="btn btn-primary btn-full" to="/book">
                    Book now →
                  </Link>
                  <a
                    className="btn btn-ghost btn-full"
                    href={`mailto:support@serenest.fit?subject=${encodeURIComponent(`Pricing: ${t.name}`)}`}
                  >
                    Ask a question
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <p className="section-label">FAQ</p>
            <h2>Common pricing questions</h2>
          </div>

          <div className="faq-list">
            {FAQ.map((f) => (
              <details key={f.q} className="faq-item">
                <summary className="faq-q">{f.q}</summary>
                <div className="faq-a muted">{f.a}</div>
              </details>
            ))}
          </div>

          <div className="cta about-cta" style={{ marginTop: 16 }}>
            <div>
              <h2 className="h2" style={{ margin: 0 }}>
                Ready to book?
              </h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                No referral needed · Fully confidential · Available across India
              </p>
            </div>
            <div className="stack about-cta-actions">
              <Link className="btn btn-primary btn-full" to="/book">
                Book a consultation →
              </Link>
              <Link className="btn btn-ghost btn-full" to="/faq">
                View all FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

