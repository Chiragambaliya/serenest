import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const HERO_NAV = [
  { label: 'Why Serenest', href: '#why' },
  { label: 'How it works', href: '#onboarding' },
  { label: 'Compliance', href: '#compliance' },
  { label: 'Hub', href: '#hub' },
];

const ROLES = [
  { role: 'Clinical Psychologist', note: 'Priority openings' },
  { role: 'Psychotherapist / CBT', note: 'Priority openings' },
  { role: 'Counsellor', note: 'Accepting applications' },
  { role: 'Psychiatrist (MD)', note: 'Accepting applications' },
];

const PRACTICE = [
  'Set your own rates and availability',
  'SOAP notes and digital prescriptions',
  'PHQ-9 / GAD-7 trends across visits',
  'Privacy-first records under DPDP',
  'Academy access free for approved clinicians',
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
    body: 'MCI-aligned prescriptions with registration details on every script.',
  },
  {
    tag: 'Assessments',
    title: 'PHQ-9 / GAD-7',
    body: 'Score trends and mood logs for measurement-based care across visits.',
  },
  {
    tag: 'Privacy',
    title: 'Privacy-first',
    body: 'Least-access design aligned to DPDP. Records visible only to you.',
  },
  {
    tag: 'Payments',
    title: 'Earnings dashboard',
    body: 'Session earnings, payout history, and tax-ready summaries in one place.',
  },
];

const STEPS = [
  ['Apply', 'Submit your details and registration number. Takes about five minutes.'],
  ['Set your rates', 'Configure consultation fee, session length, and preferred languages.'],
  ['Add availability', 'Open the slots that fit your week — mornings, evenings, or weekends.'],
  ['Verification', 'We review your credentials. Usually done within 48 hours.'],
  ['Go live', 'Start accepting bookings. First patients typically arrive within a week.'],
];

const COMPLIANCE = [
  {
    title: 'MCI Telemedicine Practice Guidelines 2020',
    body: 'Consult flow, consent, documentation, and prescription format align with the national telemedicine guidelines.',
  },
  {
    title: 'DPDP Act 2023 — privacy-first',
    body: 'Least-access approach with clear visibility boundaries on patient records and clinician data.',
  },
];

const HUB = [
  {
    tag: 'Academy',
    title: 'Serenest Academy · Free',
    body: 'Approved professionals get Academy programs at no charge — certificates, CPD, and fellowships included.',
    href: '/academy',
    cta: 'Open Academy',
  },
  {
    tag: 'Learning',
    title: 'Learning hub',
    body: 'Clinical framing, pharmacology, and platform training for clinicians and trainees.',
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
];

export default function ProfessionalsPage() {
  useSEO({ path: '/professionals', ...ROUTE_SEO['/professionals'] });

  return (
    <div className="pros-page">
      <section className="pros-hero" aria-labelledby="pros-hero-title">
        <div className="container">
          <div className="pros-hero__grid">
            <div className="pros-hero__copy">
              <p className="pros-eyebrow pros-eyebrow--hero">
                <span className="pros-brand">Serenest</span>
                <span className="pros-eyebrow-dot" aria-hidden="true">·</span>
                <span>For mental health professionals</span>
              </p>
              <h1 id="pros-hero-title" className="pros-hero__title">
                Practice on your terms — structured, compliant, focused on care.
              </h1>
              <p className="pros-hero__lead">
                A clinical telepsychiatry workflow for psychiatrists, psychologists, therapists,
                and counsellors — so you spend time with patients, not admin.
              </p>
              <div className="pros-hero__actions">
                <Link className="btn btn-primary btn-lg" to="/professionals/apply">
                  Apply to join
                </Link>
                <Link className="btn btn-ghost btn-lg" to="/professionals/portal">
                  Clinician portal
                </Link>
              </div>
              <nav className="pros-hero__nav" aria-label="On this page">
                {HERO_NAV.map((item) => (
                  <a key={item.label} href={item.href}>{item.label}</a>
                ))}
              </nav>
            </div>

            <aside className="pros-hero__panel" aria-label="What you get on Serenest">
              <p className="pros-hero__panel-label">What you practice with</p>
              <ul className="pros-hero__panel-list">
                {PRACTICE.map((item) => (
                  <li key={item}>
                    <span className="pros-check" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="pros-hero__panel-note">
                Already verified?{' '}
                <Link to="/professionals/login">Sign in</Link>
                {' '}·{' '}
                <Link to="/academy">Academy free</Link>
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="pros-roles" aria-labelledby="pros-roles-title">
        <div className="container">
          <header className="pros-section__head pros-section__head--tight">
            <p className="pros-eyebrow">Open roles</p>
            <h2 id="pros-roles-title">We are expanding the clinical network</h2>
            <p>Patient demand is growing. Qualified clinicians can apply in about five minutes.</p>
          </header>
          <ul className="pros-roles__grid">
            {ROLES.map((r) => (
              <li key={r.role} className="pros-role">
                <strong>{r.role}</strong>
                <span>{r.note}</span>
              </li>
            ))}
          </ul>
          <div className="pros-roles__cta">
            <Link className="btn btn-primary" to="/professionals/apply">
              Apply in 5 minutes
            </Link>
          </div>
        </div>
      </section>

      <section className="pros-section pros-section--cream" id="why">
        <div className="container">
          <header className="pros-section__head">
            <p className="pros-eyebrow">Built for clinical practice</p>
            <h2>Everything you need, end-to-end</h2>
            <p>Reduce admin load, keep documentation consistent, and support continuity across sessions.</p>
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
            <h2>Go live in less than a week</h2>
            <p>Structured, verified onboarding so patients trust who they book with.</p>
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
          <div className="pros-mid-cta">
            <Link className="btn btn-primary btn-lg" to="/professionals/apply">
              Start your application
            </Link>
          </div>
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

      <section className="pros-section" id="hub">
        <div className="container">
          <header className="pros-section__head">
            <p className="pros-eyebrow">Professional hub</p>
            <h2>Everything for your ongoing practice</h2>
            <p>Learning, resources, and guidelines stay with you after you join.</p>
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

      <section className="pros-cta">
        <div className="container pros-cta__inner">
          <div>
            <p className="pros-cta__brand">Serenest</p>
            <h2>Ready to join?</h2>
            <p>Apply in five minutes. Verified onboarding · Clinical-first · Privacy-first</p>
            <p className="pros-cta__fine">Psychiatrists · Psychologists · Therapists · Counsellors</p>
          </div>
          <div className="pros-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/professionals/apply">
              Apply now
            </Link>
            <a
              className="btn btn-ghost btn-lg"
              href="mailto:support@serenest.in?subject=Professional%20Query"
            >
              Have a question?
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
