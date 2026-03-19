import React from 'react';
import { Link } from 'react-router-dom';

const THERAPIES = [
  {
    name: 'Psychiatrist',
    price: '₹699–1,499',
    note: 'Per session',
    duration: '45–60 min',
    popular: true,
    features: [
      'Video / audio / chat (as available)',
      'Clinical assessment & diagnosis',
      'Digital prescription (where applicable)',
      'SOAP notes & clinical documentation',
      'Medication management support',
    ],
  },
  {
    name: 'Psychologist',
    price: '₹599–999',
    note: 'Per session',
    duration: '45–60 min',
    features: [
      'Video / audio / chat (as available)',
      'Psychological assessment',
      'Evidence-based therapy (CBT, etc.)',
      'SOAP notes & clinical documentation',
      'No prescriptions (referral if needed)',
    ],
  },
  {
    name: 'Therapist',
    price: '₹499–899',
    note: 'Per session',
    duration: '45–60 min',
    features: [
      'Video / audio / chat (as available)',
      'Structured therapy sessions',
      'CBT, DBT, trauma-informed care',
      'SOAP notes & clinical documentation',
      'Progress tracking',
    ],
  },
  {
    name: 'Counsellor',
    price: '₹399–699',
    note: 'Per session',
    duration: '45–60 min',
    features: [
      'Video / audio / chat (as available)',
      'Supportive counselling',
      'Crisis support & coping strategies',
      'Clinical documentation',
      'Referral to specialist if needed',
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
              Transparent pricing by therapy type — choose the right professional for your needs.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 20 }}>
            <p className="section-label">By therapy type</p>
            <h2>Pricing per session</h2>
          </div>
          <div className="pricing-grid pricing-grid-therapies">
            {THERAPIES.map((t) => (
              <article key={t.name} className={`tile pricing-card ${t.popular ? 'is-popular' : ''}`}>
                <div className="pricing-head">
                  <h3>{t.name}</h3>
                  {t.popular && <span className="service-badge">Most popular</span>}
                </div>
                <div className="pricing-price">{t.price}</div>
                <div className="pricing-note">{t.note} · {t.duration}</div>
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
            <p className="section-label">Payment</p>
            <h2>Secure payment methods</h2>
            <p className="muted" style={{ marginTop: 8, maxWidth: 520 }}>
              Pay safely with Razorpay. We accept UPI, credit/debit cards, net banking, and wallets.
            </p>
          </div>
          <div className="payment-methods">
            <span className="payment-badge">Razorpay</span>
            <span className="payment-badge">UPI</span>
            <span className="payment-badge">Cards</span>
            <span className="payment-badge">Net Banking</span>
            <span className="payment-badge">Wallets</span>
          </div>
        </div>
      </section>

      <section className="section">
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
