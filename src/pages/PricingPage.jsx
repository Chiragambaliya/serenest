import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import '../styles/editorial-structures.css';

const HERO_NAV = [
  { label: 'Sessions', href: '#plans' },
  { label: 'Always included', href: '#included' },
  { label: 'Organisations', href: '#organisations' },
  { label: 'FAQ', href: '#faq' },
];

const PLANS = [
  {
    tag: 'Counsellor',
    name: 'Counsellor',
    price: '₹800',
    range: '₹800 – ₹1,200',
    note: 'per session · 45–60 min',
    features: [
      'Video, audio, or chat session',
      'Supportive counselling',
      'Coping strategies and crisis support',
      'Clinical documentation',
      'Referral to specialist if needed',
    ],
  },
  {
    tag: 'Therapist',
    name: 'Therapist',
    price: '₹900',
    range: '₹900 – ₹1,500',
    note: 'per session · 45–60 min',
    features: [
      'Video, audio, or chat session',
      'Structured therapy (CBT, DBT, trauma-informed)',
      'SOAP notes and documentation',
      'Progress tracking over time',
    ],
  },
  {
    tag: 'Psychologist',
    name: 'Psychologist',
    price: '₹1,000',
    range: '₹1,000 – ₹1,800',
    note: 'per session · 45–60 min',
    features: [
      'Video, audio, or chat session',
      'Psychological assessment',
      'Evidence-based therapy',
      'SOAP notes and documentation',
      'Referral if medication is needed',
    ],
  },
  {
    tag: 'Psychiatrist',
    name: 'Psychiatrist',
    price: '₹1,200',
    range: '₹1,200 – ₹2,500',
    note: 'per session · 45–60 min',
    featured: true,
    features: [
      'Video, audio, or chat session',
      'Clinical assessment and diagnosis',
      'Digital prescription where applicable',
      'SOAP notes and documentation',
      'Medication management support',
      'Follow-up care planning',
    ],
  },
];

const INCLUDED = [
  { label: 'PHQ-9 / GAD-7 assessments', note: 'Every session' },
  { label: 'End-to-end encrypted sessions', note: 'Always' },
  { label: 'Clinical SOAP notes', note: 'Every session' },
  { label: 'Permanent session records', note: 'Lifetime access' },
  { label: 'Medication tracking dashboard', note: 'Free' },
  { label: 'Easy re-booking and follow-ups', note: 'Anytime' },
];

const ORGS = [
  {
    tag: 'Corporate',
    title: 'Corporate',
    body: 'Employee wellness programmes, EAP counselling, and manager mental-health training. Volume-based pricing.',
    subject: 'Corporate%20Pricing',
  },
  {
    tag: 'Schools',
    title: 'Schools',
    body: 'Age-appropriate psychiatric care for students, ADHD and learning assessments, staff wellbeing support.',
    subject: 'School%20Pricing',
  },
  {
    tag: 'Colleges',
    title: 'Colleges & universities',
    body: 'Student appointments on demand, crisis triage pathways, and anonymous campus mental-health surveys.',
    subject: 'College%20Pricing',
  },
];

const PAYMENTS = ['Razorpay', 'UPI', 'Credit card', 'Debit card', 'Net banking', 'Wallets'];

const FAQ = [
  {
    q: 'Are the prices fixed or can they vary?',
    a: 'Each clinician sets their own fee within the range shown. The exact fee is shown before you confirm — there are no surprises at checkout.',
  },
  {
    q: 'Are prescriptions valid at pharmacies?',
    a: 'When clinically appropriate, a registered doctor may issue a digital prescription after the consultation, following telemedicine guidelines. Some medicines or conditions may require in-person evaluation. Serenest does not guarantee prescriptions on request — clinical judgment comes first.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'UPI, credit and debit cards, net banking, and popular wallets — all powered by Razorpay with 256-bit encryption.',
  },
  {
    q: 'Can I reschedule my appointment?',
    a: 'Yes — contact support with a preferred alternate slot and we will help coordinate within the platform.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Refund and cancellation terms depend on timing and booking status. Email support@serenest.in and we will assist based on your situation.',
  },
  {
    q: 'Is there a subscription or membership?',
    a: 'No subscription required. You pay per session. Organisations (corporates, schools, colleges) can request monthly programme packages.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pr-faq__item">
      <button
        type="button"
        className="pr-faq__q"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className={`pr-faq__chev ${open ? 'is-open' : ''}`} aria-hidden="true">›</span>
      </button>
      {open && <p className="pr-faq__a">{a}</p>}
    </div>
  );
}

export default function PricingPage() {
  useSEO({ path: '/pricing', ...ROUTE_SEO['/pricing'] });

  return (
    <div className="pricing-page">
      <section className="pr-hero">
        <div className="container pr-hero__inner">
          <p className="pr-eyebrow">Pricing · Pan-India</p>
          <h1 className="pr-hero__title">Affordable mental health care. No surprises.</h1>
          <p className="pr-hero__lead">
            Transparent, pay-per-session pricing. Pick the right clinician for your needs —
            no subscriptions and no hidden fees.
          </p>
          <div className="pr-hero__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book a session</Link>
            <Link className="btn btn-ghost btn-lg" to="/patient/find-professional">Meet our clinicians</Link>
          </div>
          <nav className="pr-hero__nav pr-hero__nav--quiet" aria-label="On this page">
            {HERO_NAV.map((item) => (
              <a key={item.label} href={item.href}>{item.label}</a>
            ))}
          </nav>
        </div>
      </section>

      <section className="pr-section" id="plans">
        <div className="container">
          <header className="pr-section__head">
            <p className="pr-eyebrow">Per session</p>
            <h2>Choose your care type</h2>
            <p>Every session includes encrypted video, audio, or chat, clinical notes, and permanent records.</p>
          </header>

          <table className="ed-table pr-plan-table">
            <thead>
              <tr>
                <th scope="col">Clinician type</th>
                <th scope="col">From</th>
                <th scope="col">Range</th>
                <th scope="col">Note</th>
                <th scope="col">Key inclusions</th>
                <th scope="col">Next step</th>
              </tr>
            </thead>
            <tbody>
              {PLANS.map((plan) => (
                <tr key={plan.name} className={plan.featured ? 'pr-plan-table__featured' : undefined}>
                  <th scope="row">
                    {plan.name}
                    {plan.featured && <span className="ed-index__meta">Most popular</span>}
                  </th>
                  <td data-label="From" className="ed-table__num">{plan.price}</td>
                  <td data-label="Range" className="ed-table__num">{plan.range}</td>
                  <td data-label="Note">{plan.note}</td>
                  <td data-label="Key inclusions">{plan.features.join(' · ')}</td>
                  <td data-label="Next step">
                    <Link className="ed-link" to="/book">Book now</Link>
                    <br />
                    <a
                      className="ed-link"
                      href={`mailto:support@serenest.in?subject=${encodeURIComponent(`Pricing: ${plan.name}`)}`}
                    >
                      Ask a question
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ed-aside pr-fee-notes">
            <div>
              <p className="ed-aside__label">Fee notes</p>
              <p className="ed-aside__note">All prices are inclusive of GST.</p>
            </div>
            <div>
              <p className="pr-note">
                <strong>How fees work.</strong> Psychiatrist fees vary by experience, appointment
                duration, and specialty focus. Counselling and therapy fees may vary by clinician
                type, duration, and programme structure. The exact fee is shown before you confirm
                so there are no surprises.
              </p>
              <p className="pr-note">
                <strong>About prescriptions.</strong> When clinically appropriate, a registered
                doctor may issue a digital prescription after consultation. Some medicines or
                conditions may require in-person evaluation. Clinical judgment comes first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's included — a specification table, since it is a
          uniform list of entitlements against a condition. */}
      <section className="pr-section pr-section--cream ed-pace" id="included">
        <div className="container">
          <div className="ed-head ed-measure-wide">
            <span className="ed-head__label">Always included</span>
            <h2>Everything that comes with every session</h2>
            <p>No matter which clinician you book, these are included at no extra cost.</p>
          </div>
          <table className="ed-table ed-measure-wide">
            <thead>
              <tr>
                <th scope="col">Included</th>
                <th scope="col">Applies</th>
              </tr>
            </thead>
            <tbody>
              {INCLUDED.map((item) => (
                <tr key={item.label}>
                  <th scope="row" style={{ whiteSpace: 'normal' }}>{item.label}</th>
                  <td data-label="Applies">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Organisations — an index, each row leading to its own quote. */}
      <section className="pr-section ed-pace" id="organisations">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">For organisations</p>
            <p className="ed-aside__note">
              Monthly programme packages tailored to your size and needs.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)', fontWeight: 600, lineHeight: 1.2, maxWidth: '18ch', marginBottom: '1.5rem' }}>
              Custom plans for corporates, schools &amp; colleges
            </h2>
            <div className="ed-index">
              {ORGS.map((org) => (
                <a
                  key={org.title}
                  className="ed-index__row"
                  href={`mailto:support@serenest.in?subject=${org.subject}%20Enquiry`}
                >
                  <span />
                  <span>
                    <h3 className="ed-index__title">{org.title}</h3>
                    <span className="ed-index__meta">{org.tag}</span>
                  </span>
                  <p className="ed-index__body">{org.body}</p>
                  <span className="ed-index__go" aria-hidden="true">Get a quote →</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pr-section pr-section--cream ed-pace-tight">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Payment</p>
            <p className="ed-aside__note">
              Powered by Razorpay with 256-bit encryption.
            </p>
          </div>
          <div>
            <p className="pr-payment-methods">{PAYMENTS.join(' · ')}</p>
            <p className="pr-payment-note" style={{ marginTop: '1rem' }}>
              All transactions are secured and encrypted. Serenest never stores your card details.
            </p>
          </div>
        </div>
      </section>

      <section className="pr-section ed-pace" id="faq">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">FAQ</p>
            <p className="ed-aside__note">Common questions about fees and payment.</p>
          </div>
          <div className="pr-faq">
            {FAQ.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="pr-cta">
        <div className="container pr-cta__inner">
          <div>
            <h2>Ready to book your first session?</h2>
            <p>
              No referral needed · Confidential · Available across India.{' '}
              <Link to="/services">See our services</Link>.
            </p>
          </div>
          <div className="pr-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book a consultation</Link>
            <Link className="btn btn-ghost btn-lg" to="/faq">View all FAQs</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
