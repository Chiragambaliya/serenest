import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const HERO_NAV = [
  { label: 'Hub', href: '#hub' },
  { label: 'Why Serenest', href: '#why' },
  { label: 'Onboarding', href: '#onboarding' },
  { label: 'Compliance', href: '#compliance' },
];

const HUB = [
  {
    tag: 'Learning',
    title: 'Learning hub',
    body: 'Articles, clinical framing, and platform training requests for clinicians and trainees.',
    href: '/professionals/learning',
    cta: 'Explore learning',
  },
  {
    tag: 'Resources',
    title: 'Resources',
    body: 'Handouts, template requests, ops checklists, and partnership decks ready to share.',
    href: '/professionals/resources',
    cta: 'Browse resources',
  },
  {
    tag: 'Guidelines',
    title: 'Guidelines',
    body: 'Telemedicine, privacy, and prescribing — orientation, not legal advice.',
    href: '/professionals/guidelines',
    cta: 'Read guidelines',
  },
  {
    tag: 'Apply',
    title: 'Apply to join',
    body: 'Structured onboarding: credentials, fees, modes, and verification before you go live.',
    href: '/professionals/apply',
    cta: 'Start application',
  },
];

const FEATURES = [
  {
    tag: 'Scheduling',
    title: 'Smart scheduling',
    body: 'Availability, slot visibility, follow-ups, and reminders — built in.',
  },
  {
    tag: 'Documentation',
    title: 'SOAP notes',
    body: 'Structured documentation with post-session locking for auditability.',
  },
  {
    tag: 'Prescriptions',
    title: 'Digital Rx',
    body: 'MCI-aligned prescriptions with doctor registration details on every script.',
  },
  {
    tag: 'Assessments',
    title: 'PHQ-9 / GAD-7',
    body: 'Score trends and mood logs for measurement-based care across visits.',
  },
  {
    tag: 'Privacy',
    title: 'Privacy-first',
    body: 'Least-access design aligned to DPDP expectations. Records visible only to the clinician.',
  },
  {
    tag: 'Payments',
    title: 'Payments and receipts',
    body: 'Razorpay-ready billing, receipts, and a basic earnings view.',
  },
];

const STEPS = [
  ['Apply', 'Submit credentials and registration. Psychiatrists need MCI/SMC; psychologists, therapists, and counsellors need RCI or equivalent.'],
  ['Set consultation', 'Configure fee, duration, and languages — English, Hindi, or Gujarati.'],
  ['Schedule', 'Add weekly availability and slots that fit your practice.'],
  ['Verification', 'Credentials reviewed before you go live on Serenest.'],
  ['Go live', 'Start accepting bookings with the structured Serenest workflow.'],
];

const COMPLIANCE = [
  {
    title: 'MCI Telemedicine Practice Guidelines 2020',
    body: 'Consult flow, consent, documentation, and prescription format align with the national telemedicine guidelines.',
  },
  {
    title: 'DPDP Act 2023 — privacy-first',
    body: 'Least-access approach with clear boundaries on visibility of patient records and clinician data.',
  },
];

export default function ProfessionalsPage() {
  useSEO({ path: '/professionals', ...ROUTE_SEO['/professionals'] });

  return (
    <div className="pros-page">
      <section className="pros-hero">
        <div className="container pros-hero__inner">
          <p className="pros-eyebrow">For professionals</p>
          <h1 className="pros-hero__title">
            A clinical platform for mental health practitioners — not a generic telehealth app.
          </h1>
          <p className="pros-hero__lead">
            Serenest helps psychiatrists, psychologists, therapists, and counsellors deliver
            structured, compliant telepsychiatry — scheduling, intake, assessments, SOAP notes,
            prescriptions, and continuity in one calm workflow.
          </p>
          <p className="pros-hero__roles">
            Psychiatrist · Psychologist · Therapist · Counsellor
          </p>
          <div className="pros-hero__actions">
            <Link className="btn btn-primary btn-lg" to="/professionals/apply">Apply to join</Link>
            <Link className="btn btn-ghost btn-lg" to="/professionals/learning">Learning hub</Link>
            <a className="btn btn-ghost btn-lg" href="mailto:support@serenest.in?subject=Clinic%20Partnership">
              Clinic partnership
            </a>
          </div>
          <nav className="pros-hero__nav" aria-label="On this page">
            {HERO_NAV.map((item) => (
              <a key={item.label} href={item.href}>{item.label}</a>
            ))}
          </nav>
          <p className="pros-hero__sub">
            Public literacy programmes and school or workplace collaborations are branded as{' '}
            <strong>Serenest Academy</strong> at <Link to="/academy">/academy</Link> — literacy and
            learning live on the same site as clinical care.
          </p>
        </div>
      </section>

      <section className="pros-section" id="hub">
        <div className="container">
          <header className="pros-section__head">
            <p className="pros-eyebrow">Professional hub</p>
            <h2>Learning, resources, and compliance — together</h2>
            <p>
              Curated areas for clinicians who want structured telepsychiatry workflows, shareable
              patient education, and India-aligned compliance context.
            </p>
          </header>
          <div className="pros-hub">
            {HUB.map((item) => (
              <Link key={item.title} to={item.href} className="pros-hub__card">
                <span className="pros-hub__tag">{item.tag}</span>
                <h3 className="pros-hub__title">{item.title}</h3>
                <p className="pros-hub__body">{item.body}</p>
                <span className="pros-hub__cta">{item.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pros-section pros-section--cream" id="why">
        <div className="container">
          <header className="pros-section__head">
            <p className="pros-eyebrow">Built for clinical practice</p>
            <h2>Everything you need to run telepsychiatry, end-to-end</h2>
            <p>
              Designed with a clinician-first mindset — reduce admin load, keep documentation
              consistent, and support continuity across sessions.
            </p>
          </header>
          <div className="pros-features">
            {FEATURES.map((item) => (
              <article key={item.title} className="pros-feature">
                <span className="pros-feature__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pros-section" id="onboarding">
        <div className="container">
          <header className="pros-section__head">
            <p className="pros-eyebrow">Step by step</p>
            <h2>Go live with a structured, verified flow</h2>
          </header>
          <ol className="pros-steps">
            {STEPS.map(([title, desc], i) => (
              <li key={title} className="pros-step">
                <span className="pros-step__num">{i + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pros-section pros-section--cream" id="compliance">
        <div className="container">
          <header className="pros-section__head">
            <p className="pros-eyebrow">Trust &amp; compliance</p>
            <h2>Designed around India&apos;s telemedicine and privacy expectations</h2>
          </header>
          <div className="pros-compliance">
            {COMPLIANCE.map((item) => (
              <article key={item.title} className="pros-compliance__item">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="pros-note">
            <strong>Note.</strong> Serenest is a clinical platform and does not support
            prescriptions without a consultation. Schedule H regulations are respected and
            restricted to verified MD psychiatrists.
          </div>
        </div>
      </section>

      <section className="pros-section">
        <div className="container">
          <blockquote className="pros-quote">
            <p>
              &ldquo;The experience is calm. Less friction, more clarity. That matters for mental
              health.&rdquo;
            </p>
            <cite>— Psychiatrist · India</cite>
          </blockquote>
        </div>
      </section>

      <section className="pros-cta">
        <div className="container pros-cta__inner">
          <div>
            <h2>Ready to join Serenest?</h2>
            <p>
              Apply in minutes. We verify credentials and get you live with a structured,
              clinical workflow.
            </p>
            <p className="pros-cta__fine">Verified onboarding · Clinical-first · Privacy-first</p>
          </div>
          <div className="pros-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/professionals/apply">Apply now</Link>
            <Link className="btn btn-ghost btn-lg" to="/professionals/learning">Learning hub</Link>
            <a className="btn btn-ghost btn-lg" href="mailto:support@serenest.in?subject=Clinic%20Partnership%20Request">
              Clinic partnership
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
