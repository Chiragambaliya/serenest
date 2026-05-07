import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    icon: '🧑‍⚕️',
    name: 'Counsellor',
    price: '₹399',
    range: '₹399–699',
    note: 'per session · 45–60 min',
    popular: false,
    features: [
      'Video / audio / chat session',
      'Supportive counselling',
      'Crisis support & coping strategies',
      'Clinical documentation',
      'Referral to specialist if needed',
    ],
  },
  {
    icon: '🧠',
    name: 'Therapist',
    price: '₹499',
    range: '₹499–899',
    note: 'per session · 45–60 min',
    popular: false,
    features: [
      'Video / audio / chat session',
      'Structured therapy sessions',
      'CBT, DBT, trauma-informed care',
      'SOAP notes & documentation',
      'Progress tracking over time',
    ],
  },
  {
    icon: '🔬',
    name: 'Psychologist',
    price: '₹599',
    range: '₹599–999',
    note: 'per session · 45–60 min',
    popular: false,
    features: [
      'Video / audio / chat session',
      'Psychological assessment',
      'Evidence-based therapy (CBT etc.)',
      'SOAP notes & documentation',
      'No prescriptions (referral if needed)',
    ],
  },
  {
    icon: '👨‍⚕️',
    name: 'Psychiatrist',
    price: '₹699',
    range: '₹699–1,499',
    note: 'per session · 45–60 min',
    popular: true,
    features: [
      'Video / audio / chat session',
      'Clinical assessment & diagnosis',
      'Digital prescription (where applicable)',
      'SOAP notes & clinical documentation',
      'Medication management support',
      'Follow-up care planning',
    ],
  },
];

const INCLUDED = [
  { icon: '📊', label: 'PHQ-9 / GAD-7 assessments', note: 'Every session' },
  { icon: '🔒', label: 'End-to-end encrypted sessions', note: 'Always' },
  { icon: '📄', label: 'Clinical SOAP notes', note: 'Every session' },
  { icon: '📂', label: 'Permanent session records', note: 'Lifetime access' },
  { icon: '💊', label: 'Medication tracking dashboard', note: 'Free' },
  { icon: '🔁', label: 'Easy re-booking & follow-ups', note: 'Anytime' },
];

const FAQ = [
  {
    q: 'Are the prices fixed or can they vary?',
    a: 'Each professional sets their own fee within the range shown. You\'ll see the exact fee before booking — no surprises at checkout.',
  },
  {
    q: 'Are prescriptions valid at pharmacies?',
    a: 'Yes. Prescriptions issued after a consultation include the doctor\'s MCI registration number, are digitally signed, and are valid under the MCI Telemedicine Guidelines 2020. Accepted at pharmacies across India.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept UPI, credit/debit cards, net banking, and popular wallets — all powered by Razorpay with 256-bit encryption.',
  },
  {
    q: 'Can I reschedule my appointment?',
    a: 'Yes — contact support with your preferred alternate slot and we\'ll help coordinate within the platform.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Refund and cancellation terms depend on timing and booking status. Email support@serenest.fit and we\'ll assist based on your situation.',
  },
  {
    q: 'Is there a subscription or membership?',
    a: 'No subscription required. You pay per session. For organisations (corporates, schools, colleges) we offer monthly packages — contact us for a quote.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pricing-faq-item">
      <button
        className="pricing-faq-q"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className={`pricing-faq-chevron ${open ? 'is-open' : ''}`}>›</span>
      </button>
      {open && <p className="pricing-faq-a">{a}</p>}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div>

      {/* ── Page Hero ───────────────────────────────────────── */}
      <section className="page-hero">
        <div className="page-hero-bg" aria-hidden="true" />
        <div className="container">
          <div className="page-hero-inner">
            <div className="section-kicker">Pricing</div>
            <h1 className="page-hero-title">
              Affordable mental health care.{' '}
              <span className="gradient-text">No surprises.</span>
            </h1>
            <p className="page-hero-lead">
              Transparent, pay-per-session pricing. Choose the right professional
              for your needs — no subscriptions, no hidden fees.
            </p>
            <div className="page-hero-actions">
              <Link className="btn btn-primary btn-lg" to="/book">Book a session →</Link>
              <Link className="btn btn-ghost btn-lg" to="/professionals">Meet our professionals</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ───────────────────────────────────── */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Per session</div>
            <h2>Choose your care type</h2>
            <p>All sessions include encrypted video/audio/chat, clinical notes, and permanent records.</p>
          </div>

          <div className="pricing-cards-grid">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`pricing-plan-card ${plan.popular ? 'pricing-plan-featured' : ''}`}
              >
                {plan.popular && (
                  <div className="pricing-featured-label">Most Popular</div>
                )}

                <div className="pricing-plan-icon">{plan.icon}</div>
                <div className="pricing-plan-name">{plan.name}</div>

                <div className="pricing-plan-price">
                  <span className="pricing-currency">from</span>
                  {plan.price}
                </div>
                <div className="pricing-plan-range">{plan.range}</div>
                <div className="pricing-plan-note">{plan.note}</div>

                <div className="pricing-plan-divider" />

                <ul className="pricing-plan-features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <span className="pricing-check" aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="pricing-plan-actions">
                  <Link
                    className={`btn btn-full ${plan.popular ? 'btn-outline' : 'btn-primary'}`}
                    to="/book"
                  >
                    Book now →
                  </Link>
                  <a
                    className={`btn btn-full ${plan.popular ? 'btn-outline' : 'btn-ghost'}`}
                    href={`mailto:support@serenest.fit?subject=${encodeURIComponent(`Pricing: ${plan.name}`)}`}
                  >
                    Ask a question
                  </a>
                </div>
              </article>
            ))}
          </div>

          <p className="pricing-disclaimer">
            * Exact fee is shown before you confirm your booking. All prices are inclusive of GST.
          </p>
        </div>
      </section>

      {/* ── Always Included ─────────────────────────────────── */}
      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Always included</div>
            <h2>Everything that comes with every session</h2>
            <p>No matter which professional you book, these are included at no extra cost.</p>
          </div>

          <div className="pricing-included-grid">
            {INCLUDED.map(({ icon, label, note }) => (
              <div key={label} className="pricing-included-item">
                <div className="pricing-included-icon">{icon}</div>
                <div>
                  <div className="pricing-included-label">{label}</div>
                  <div className="pricing-included-note">{note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Organisation Pricing ────────────────────────────── */}
      <section className="section" id="organisations">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">For organisations</div>
            <h2>Custom plans for corporates, schools & colleges</h2>
            <p>We offer monthly programme packages for organisations — tailored to your size and needs.</p>
          </div>

          <div className="org-pricing-cards">
            {[
              { icon: '🏢', label: 'Corporate', desc: 'Employee wellness programmes, EAP counselling, and manager mental health training. Volume-based pricing.', subject: 'Corporate%20Pricing' },
              { icon: '🏫', label: 'Schools', desc: 'Age-appropriate psychiatric care for students, ADHD/LD assessments, and staff wellbeing support.', subject: 'School%20Pricing' },
              { icon: '🎓', label: 'Colleges & Universities', desc: 'On-demand student appointments, crisis triage pathways, and anonymous campus mental health surveys.', subject: 'College%20Pricing' },
            ].map(({ icon, label, desc, subject }) => (
              <div key={label} className="org-pricing-card">
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <h3>{label}</h3>
                <p>{desc}</p>
                <a
                  className="btn btn-ghost btn-sm"
                  href={`mailto:support@serenest.fit?subject=${subject}%20Enquiry`}
                  style={{ marginTop: 'auto' }}
                >
                  Get a quote →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment Methods ─────────────────────────────────── */}
      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Payment</div>
            <h2>Secure, flexible payments</h2>
            <p>Powered by Razorpay with 256-bit encryption. Pay however you like.</p>
          </div>
          <div className="payment-badges">
            {['Razorpay', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallets'].map(m => (
              <span key={m} className="payment-badge">{m}</span>
            ))}
          </div>
          <div className="payment-note">
            <span>🔒</span>
            All transactions are secured and encrypted. Serenest never stores your card details.
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">FAQ</div>
            <h2>Common pricing questions</h2>
          </div>
          <div className="pricing-faq-list" style={{ maxWidth: 700, margin: '0 auto' }}>
            {FAQ.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="section alt">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-body">
              <h2>Ready to book your first session?</h2>
              <p>No referral needed · Fully confidential · Available across India</p>
            </div>
            <div className="cta-banner-actions">
              <Link className="btn btn-primary btn-lg" to="/book">Book a consultation →</Link>
              <Link className="btn btn-outline btn-lg" to="/faq">View all FAQs</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
