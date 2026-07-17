import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

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
          <nav className="pr-hero__nav" aria-label="On this page">
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

          <div className="pr-plans">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`pr-plan${plan.featured ? ' pr-plan--featured' : ''}`}
              >
                {plan.featured && <span className="pr-plan__badge">Most popular</span>}
                <span className="pr-plan__tag">{plan.tag}</span>
                <h3 className="pr-plan__name">{plan.name}</h3>
                <div className="pr-plan__price">
                  <span className="pr-plan__price-from">From</span>
                  <span className="pr-plan__price-amt">{plan.price}</span>
                </div>
                <p className="pr-plan__range">{plan.range}</p>
                <p className="pr-plan__note">{plan.note}</p>
                <div className="pr-plan__divider" />
                <ul className="pr-plan__features">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="pr-plan__actions">
                  <Link className="btn btn-primary btn-sm" to="/book">Book now</Link>
                  <a
                    className="btn btn-ghost btn-sm"
                    href={`mailto:support@serenest.in?subject=${encodeURIComponent(`Pricing: ${plan.name}`)}`}
                  >
                    Ask a question
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="pr-note">
            <strong>How fees work.</strong> Psychiatrist fees vary by experience, appointment
            duration, and specialty focus. Counselling and therapy fees may vary by clinician
            type, duration, and programme structure. The exact fee is shown before you confirm
            so there are no surprises.
          </div>
          <div className="pr-note">
            <strong>About prescriptions.</strong> When clinically appropriate, a registered
            doctor may issue a digital prescription after consultation. Some medicines or
            conditions may require in-person evaluation. Clinical judgment comes first.
          </div>
          <p className="pr-fineprint">All prices are inclusive of GST.</p>
        </div>
      </section>

      <section className="pr-section pr-section--cream" id="included">
        <div className="container">
          <header className="pr-section__head">
            <p className="pr-eyebrow">Always included</p>
            <h2>Everything that comes with every session</h2>
            <p>No matter which clinician you book, these are included at no extra cost.</p>
          </header>
          <div className="pr-included">
            {INCLUDED.map((item) => (
              <article key={item.label} className="pr-included__item">
                <div className="pr-included__label">{item.label}</div>
                <div className="pr-included__note">{item.note}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pr-section" id="organisations">
        <div className="container">
          <header className="pr-section__head">
            <p className="pr-eyebrow">For organisations</p>
            <h2>Custom plans for corporates, schools &amp; colleges</h2>
            <p>Monthly programme packages tailored to your size and needs.</p>
          </header>
          <div className="pr-orgs">
            {ORGS.map((org) => (
              <article key={org.title} className="pr-org">
                <span className="pr-org__tag">{org.tag}</span>
                <h3>{org.title}</h3>
                <p>{org.body}</p>
                <a
                  className="btn btn-ghost btn-sm"
                  href={`mailto:support@serenest.in?subject=${org.subject}%20Enquiry`}
                >
                  Get a quote
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pr-section pr-section--cream">
        <div className="container">
          <header className="pr-section__head">
            <p className="pr-eyebrow">Payment</p>
            <h2>Secure, flexible payments</h2>
            <p>Powered by Razorpay with 256-bit encryption. Pay however you like.</p>
          </header>
          <div className="pr-payments">
            {PAYMENTS.map((m) => (
              <span key={m} className="pr-payment">{m}</span>
            ))}
          </div>
          <p className="pr-payment-note">
            All transactions are secured and encrypted. Serenest never stores your card details.
          </p>
        </div>
      </section>

      <section className="pr-section" id="faq">
        <div className="container">
          <header className="pr-section__head">
            <p className="pr-eyebrow">FAQ</p>
            <h2>Common pricing questions</h2>
          </header>
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
