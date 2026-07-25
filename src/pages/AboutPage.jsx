import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import ImagePlaceholder from '../components/ImagePlaceholder';
import '../styles/editorial-structures.css';

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
      {/* Opener: a single strong statement, no jump-nav strip. */}
      <section className="abt-hero ed-pace-open">
        <div className="container">
          <p className="abt-eyebrow">About Serenest</p>
          <h1 className="abt-hero__title" style={{ maxWidth: '16ch' }}>
            Built by a psychiatrist who saw the gap firsthand.
          </h1>
          <p className="ed-lede" style={{ marginTop: '1.25rem' }}>
            Serenest started in a clinic in Rajkot, Gujarat — where patients drove hours for a
            fifteen-minute consultation. We built the platform we wish had existed.
          </p>
          <div className="abt-hero__actions" style={{ marginTop: '2rem' }}>
            <Link className="btn btn-primary btn-lg" to="/book">Book a consultation</Link>
            <Link className="btn btn-ghost btn-lg" to="/team">Meet the team</Link>
          </div>
        </div>
      </section>

      {/* The scale of the gap, as a figure with the numbers annotated
          beside it rather than three equal stat boxes. */}
      <section className="abt-section ed-pace" id="problem">
        <div className="container">
          <div className="ed-head ed-measure-wide">
            <span className="ed-head__label">The reality in India</span>
            <h2>800 million Indians have no access to a psychiatrist.</h2>
            <p>Stigma, distance, and waitlists keep people from the care they need.</p>
          </div>

          <figure className="ed-figure ed-figure--annotated" style={{ marginBottom: '2.5rem' }}>
            <div className="ed-figure__media">
              <ImagePlaceholder
                asset="about-rural-clinic-waiting.jpg"
                direction="A district clinic waiting area in daylight — chairs, a corridor, distance implied. Documentary, unposed, no identifiable faces."
                src="/images/editorial/about-clinic-waiting-room-v1.png"
                alt="A quiet clinic waiting area in daylight"
              />
            </div>
            <figcaption>
              Patients across North Gujarat routinely travel several hours to reach the nearest
              psychiatrist.
            </figcaption>
          </figure>

          <table className="ed-table ed-measure-wide">
            <caption>Publicly reported figures on psychiatric access in India.</caption>
            <thead>
              <tr>
                <th scope="col">Measure</th>
                <th scope="col">Figure</th>
              </tr>
            </thead>
            <tbody>
              {STATS.map((stat) => (
                <tr key={stat.label}>
                  <th scope="row" style={{ whiteSpace: 'normal' }}>{stat.label}</th>
                  <td className="ed-table__num" data-label="Figure">{stat.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ed-measure" style={{ marginTop: '2.5rem' }}>
            <p style={{ marginBottom: '1rem', lineHeight: 1.75, color: 'var(--ink-2)' }}>
              India carries one of the world&apos;s largest mental health burdens — yet infrastructure
              remains critically underfunded. When people do seek help, waitlists stretch for weeks.
            </p>
            <p style={{ margin: 0, lineHeight: 1.75, color: 'var(--ink-2)' }}>
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

      {/* Three principles, set against a heading held in the margin —
          not a third equal-column grid. */}
      <section className="abt-section ed-pace">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Our difference</p>
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 600, lineHeight: 1.2, maxWidth: '16ch', marginBottom: '2rem' }}>
              Not just another app. A clinical platform.
            </h2>
            <dl className="ed-index" style={{ margin: 0 }}>
              {DIFFERENCE.map((item) => (
                <div key={item.tag} className="ed-index__row">
                  <span />
                  <dt>
                    <span className="ed-index__title" style={{ display: 'block' }}>{item.title}</span>
                    <span className="ed-index__meta">{item.tag}</span>
                  </dt>
                  <dd className="ed-index__body" style={{ margin: 0 }}>{item.body}</dd>
                  <span />
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Mission as a full-width band — the page's one raised voice,
          and the break that stops the column rhythm. */}
      <section className="ed-band">
        <div className="container">
          <p className="ed-band__quote">
            Make psychiatric care as accessible as a phone call.
          </p>
          <p style={{ maxWidth: '42ch', marginTop: '1.5rem', lineHeight: 1.7 }}>
            Mental health is health — not a luxury, and not something to travel hours for.
            Serenest connects every Indian with a qualified psychiatrist, in English, Hindi, or
            Gujarati, from anywhere.
          </p>
        </div>
      </section>

      {/* What we've built — a numbered index, since it is a set of
          discrete capabilities rather than six equal features. */}
      <section className="abt-section ed-pace" id="platform">
        <div className="container">
          <div className="ed-head ed-measure-wide">
            <span className="ed-head__label">What we&apos;ve built</span>
            <h2>A complete clinical ecosystem</h2>
            <p>Scheduling, sessions, documentation, prescriptions, and Academy learning — together.</p>
          </div>
          <div className="ed-index">
            {PLATFORM.map((item, i) => (
              <div key={item.tag} className="ed-index__row">
                <span className="ed-index__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <h3 className="ed-index__title">{item.title}</h3>
                  <span className="ed-index__meta">{item.tag}</span>
                </span>
                <p className="ed-index__body">{item.body}</p>
                <span />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory framework — genuinely tabular, so a table. */}
      <section className="abt-section abt-section--cream ed-pace" id="trust">
        <div className="container">
          <div className="ed-head ed-measure-wide">
            <span className="ed-head__label">Trust &amp; safety</span>
            <h2>Built on India&apos;s regulatory framework</h2>
          </div>
          <table className="ed-table ed-measure-wide">
            <thead>
              <tr>
                <th scope="col">Framework</th>
                <th scope="col">What it means here</th>
              </tr>
            </thead>
            <tbody>
              {TRUST.map((item) => (
                <tr key={item.title}>
                  <th scope="row" style={{ whiteSpace: 'normal', maxWidth: '18rem' }}>{item.title}</th>
                  <td data-label="What it means here">{item.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Closing note — narrow measure, marginal label, plenty of air. */}
      <section className="abt-section ed-pace-open">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Where we&apos;re going</p>
          </div>
          <div className="ed-measure">
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)', fontWeight: 600, marginBottom: '1.25rem', lineHeight: 1.25 }}>
              Objective, accessible, clinician-led psychiatry for India
            </h2>
            <p style={{ marginBottom: '1rem', lineHeight: 1.75, color: 'var(--ink-2)' }}>
              Our vision goes beyond video calls — toward tools that help psychiatrists make better
              clinical decisions faster, while keeping the human relationship at the centre.
            </p>
            <p style={{ margin: 0, lineHeight: 1.75, color: 'var(--ink-2)' }}>
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
