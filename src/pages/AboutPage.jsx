import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const HERO_NAV = [
  { label: 'The gap', href: '#problem' },
  { label: 'Founder', href: '#founder' },
  { label: 'Platform', href: '#platform' },
  { label: 'Trust', href: '#trust' },
  { label: 'Team', href: '/team', route: true },
];

const PILLARS = [
  {
    title: 'An access problem',
    body: 'India’s psychiatrist shortage leaves most people without care.',
    href: '#problem',
  },
  {
    title: 'Built by a clinician',
    body: 'Designed in a real clinic — not by a team guessing at healthcare.',
    href: '#founder',
  },
  {
    title: 'A full platform',
    body: 'Scheduling, sessions, notes, prescriptions, and follow-up in one place.',
    href: '#platform',
  },
];

const STATS = [
  { value: '0.75', label: 'Psychiatrists per 1 lakh population' },
  { value: '80%', label: 'Of people with mental illness receive no treatment' },
  { value: '42 yrs', label: 'To fill India’s psychiatrist shortage at the current rate' },
];

const DIFFERENCE = [
  {
    tag: 'Clinical',
    title: 'Built by a psychiatrist',
    body: 'Every workflow, safety rule, and feature comes from daily practice — not product guesswork.',
  },
  {
    tag: 'Compliance',
    title: 'MCI telemedicine aligned',
    body: 'Consultations follow India’s telemedicine practice guidelines. Prescriptions and records are documented correctly.',
  },
  {
    tag: 'Privacy',
    title: 'Privacy by design',
    body: 'Encrypted sessions. No sharing with insurers or employers. Protected under India’s DPDP Act 2023.',
  },
];

const PLATFORM = [
  {
    tag: 'Scheduling',
    title: 'Smart scheduling',
    body: 'Book verified psychiatrists across India with real-time slot availability.',
  },
  {
    tag: 'Sessions',
    title: 'Encrypted video consultations',
    body: 'Secure video, audio, or chat — with structured intake and session documentation.',
  },
  {
    tag: 'Notes',
    title: 'SOAP clinical notes',
    body: 'Subjective, Objective, Assessment, Plan — locked after each session.',
  },
  {
    tag: 'Rx',
    title: 'Digital prescriptions',
    body: 'Telemedicine-compliant Rx with registration details, valid at pharmacies nationwide.',
  },
  {
    tag: 'Tracking',
    title: 'PHQ-9 & GAD-7',
    body: 'Validated scales tracked over time so every clinician sees your history.',
  },
  {
    tag: 'Academy',
    title: 'Serenest Academy',
    body: 'Patient guides and clinician learning on the same site — literacy alongside care.',
  },
];

const TRUST = [
  {
    title: 'MCI Telemedicine Practice Guidelines 2020',
    body: 'Prescription, documentation, and consent follow the national telemedicine standard.',
  },
  {
    title: 'DPDP Act 2023',
    body: 'You can access, correct, and delete your personal health data at any time.',
  },
  {
    title: 'DPIIT recognised startup',
    body: 'Serenest Education Pvt Ltd is recognised under Startup India.',
  },
  {
    title: 'Schedule H compliance',
    body: 'Psychiatric medications follow Schedule H rules. Only verified MD psychiatrists prescribe controlled substances.',
  },
];

export default function AboutPage() {
  useSEO({ path: '/about', ...ROUTE_SEO['/about'] });

  return (
    <div className="about-page">
      <section className="abt-hero">
        <div className="container abt-hero__inner">
          <p className="abt-eyebrow">About Serenest</p>
          <h1 className="abt-hero__title">Built by a psychiatrist who saw the gap firsthand.</h1>
          <p className="abt-hero__lead">
            Serenest started in a clinic in Rajkot, Gujarat — where patients drove hours for a
            fifteen-minute consultation. We built the platform we wish had existed.
          </p>
          <div className="abt-hero__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book a consultation</Link>
            <Link className="btn btn-ghost btn-lg" to="/team">Meet the team</Link>
          </div>
          <nav className="abt-hero__nav" aria-label="On this page">
            {HERO_NAV.map((item) =>
              item.route ? (
                <Link key={item.label} to={item.href}>{item.label}</Link>
              ) : (
                <a key={item.label} href={item.href}>{item.label}</a>
              ),
            )}
          </nav>
        </div>
      </section>

      <section className="abt-pillars" aria-label="About Serenest">
        <div className="container">
          <div className="abt-pillars__grid">
            {PILLARS.map((item) => (
              <a key={item.title} className="abt-pillar" href={item.href}>
                <h2 className="abt-pillar__title">{item.title}</h2>
                <p className="abt-pillar__body">{item.body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="abt-section" id="problem">
        <div className="container">
          <header className="abt-section__head">
            <p className="abt-eyebrow">The reality in India</p>
            <h2>800 million Indians have no access to a psychiatrist.</h2>
            <p>Stigma, distance, and waitlists keep people from the care they need.</p>
          </header>

          <div className="abt-stats">
            {STATS.map((stat) => (
              <article key={stat.label} className="abt-stat">
                <div className="abt-stat__value">{stat.value}</div>
                <div className="abt-stat__label">{stat.label}</div>
              </article>
            ))}
          </div>

          <div className="abt-prose">
            <p>
              India carries one of the world&apos;s largest mental health burdens — yet infrastructure
              remains critically underfunded. When people do seek help, waitlists stretch for weeks.
            </p>
            <p>
              This is not a technology problem. It is an access problem. Technology is how we close it.
            </p>
          </div>
        </div>
      </section>

      <section className="abt-section abt-section--cream" id="founder">
        <div className="container">
          <header className="abt-section__head">
            <p className="abt-eyebrow">From the founder</p>
            <h2>Why I built Serenest</h2>
          </header>

          <div className="abt-founder">
            <div className="abt-founder__card">
              <div className="abt-founder__avatar" aria-hidden="true">CA</div>
              <div>
                <div className="abt-founder__name">Dr. Chirag Aambalia</div>
                <div className="abt-founder__role">
                  Consultant Psychiatrist · Rajkot, Gujarat
                </div>
              </div>
            </div>

            <div className="abt-founder__story">
              <p className="abt-founder__quote">
                I&apos;m Dr. Chirag Aambalia — Consultant Psychiatrist at Rudra Neuropsychiatry and
                De-addiction Hospital in Rajkot, Gujarat.
              </p>

              <details className="abt-founder__toggle">
                <summary>Read the founder story</summary>
                <p>
                  Every week I meet patients who waited months — or never saw a psychiatrist because
                  the nearest one was a hundred kilometres away. Families suffer in silence, afraid of
                  what people will say.
                </p>
                <p>
                  I built Serenest because every Indian deserves the same quality of psychiatric care —
                  whether they live in Mumbai or a small town in North Gujarat. Clinical-grade. Private.
                  Affordable. From home.
                </p>
                <p>
                  This is not just an app. It is a clinical platform built by someone who sits across
                  from patients every day and knows exactly what they need.
                </p>
              </details>

              <div className="abt-creds" aria-label="Credentials">
                <span className="abt-cred">MBBS · MD Psychiatry</span>
                <span className="abt-cred">Rudra Neuropsychiatry, Rajkot</span>
                <span className="abt-cred">Founder, Serenest Education Pvt Ltd</span>
                <span className="abt-cred">DPIIT recognised</span>
              </div>
              <p className="abt-founder__link">
                <Link to="/team">Meet our team →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="abt-section">
        <div className="container">
          <header className="abt-section__head">
            <p className="abt-eyebrow">Our difference</p>
            <h2>Not just another app. A clinical platform.</h2>
          </header>
          <div className="abt-grid abt-grid--3">
            {DIFFERENCE.map((item) => (
              <article key={item.tag} className="abt-card">
                <span className="abt-card__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="abt-section abt-section--cream">
        <div className="container">
          <header className="abt-section__head">
            <p className="abt-eyebrow">Mission</p>
            <h2>Make psychiatric care as accessible as a phone call.</h2>
          </header>
          <div className="abt-mission">
            <p>
              Mental health is health — not a luxury, not something to travel hours for.
            </p>
            <p>
              Serenest connects every Indian with a qualified psychiatrist — in English, Hindi, or
              Gujarati — from anywhere, in minutes.
            </p>
          </div>
        </div>
      </section>

      <section className="abt-section" id="platform">
        <div className="container">
          <header className="abt-section__head">
            <p className="abt-eyebrow">What we&apos;ve built</p>
            <h2>A complete clinical ecosystem</h2>
            <p>Scheduling, sessions, documentation, prescriptions, and Academy learning — together.</p>
          </header>
          <div className="abt-grid abt-grid--6">
            {PLATFORM.map((item) => (
              <article key={item.tag} className="abt-card">
                <span className="abt-card__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="abt-section abt-section--cream" id="trust">
        <div className="container">
          <header className="abt-section__head">
            <p className="abt-eyebrow">Trust &amp; safety</p>
            <h2>Built on India&apos;s regulatory framework</h2>
          </header>
          <div className="abt-grid abt-grid--2">
            {TRUST.map((item) => (
              <article key={item.title} className="abt-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="abt-section">
        <div className="container">
          <header className="abt-section__head">
            <p className="abt-eyebrow">Where we&apos;re going</p>
            <h2>Objective, accessible, clinician-led psychiatry for India</h2>
          </header>
          <div className="abt-prose">
            <p>
              Our vision goes beyond video calls — toward tools that help psychiatrists make better
              clinical decisions faster, while keeping the human relationship at the centre.
            </p>
            <p>
              This is how we close India&apos;s mental health gap — one consultation at a time.
            </p>
          </div>
        </div>
      </section>

      <section className="abt-cta">
        <div className="container abt-cta__inner">
          <div>
            <h2>Ready to take the first step?</h2>
            <p>Book a confidential consultation with a verified psychiatrist — anywhere in India.</p>
            <p className="abt-cta__fine">No referral needed · From ₹800 · Fully confidential</p>
          </div>
          <div className="abt-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book now</Link>
            <Link className="btn btn-ghost btn-lg" to="/professionals/apply">Join as a doctor</Link>
            <Link className="btn btn-ghost btn-lg" to="/services">View services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
