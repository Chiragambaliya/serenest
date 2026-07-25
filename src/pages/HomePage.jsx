import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import ImagePlaceholder from '../components/ImagePlaceholder';

const OUR_SERVICES = [
  {
    title: 'Psychiatry',
    meta: 'Assessment · medication',
    body: 'Assessment, diagnosis, and medication management from a licensed psychiatrist.',
    href: '/services/psychiatry',
  },
  {
    title: 'Therapy and Counselling',
    meta: 'Talk therapy',
    body: 'Structured talk therapy for individuals, couples, and families.',
    href: '/services/therapy',
  },
  {
    title: 'Addiction and Recovery',
    meta: 'Substance use',
    body: 'Assessment, counselling, and relapse-prevention support for substance use.',
    href: '/services/addiction-care',
  },
  {
    title: 'Digital Mental Health',
    meta: 'Teleconsultation',
    body: 'Secure video, audio, and chat consultations, wherever you are in India.',
    href: '/services/digital-consultations',
  },
];

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });

  return (
    <div className="home">
      {/* Hero */}
      <section className="hp-hero" aria-labelledby="home-hero-title">
        <div className="ed-shell ed-facing">
          <div className="hp-hero__copy">
            <p className="hp-brand-mark">
              <span className="hp-brand-mark__meta ed-mono">
                Mental health · Clinical practice · Academy
              </span>
            </p>
            <h1 id="home-hero-title" className="hp-hero__title">
              Care for the mind, grounded in clinical practice.
            </h1>
            <p className="hp-hero__body ed-measure">
              Psychiatry, therapy, addiction support, and professional mental-health
              education — brought together with clinical responsibility and human
              understanding.
            </p>
            <div className="hp-hero__actions">
              <Link className="btn btn-primary btn-lg" to="/services">
                Find the right service
              </Link>
              <Link className="btn btn-ghost btn-lg" to="/book">
                Book an appointment
              </Link>
            </div>
            <p className="hp-hero__note">
              Not for emergencies. If you or someone else is at immediate risk, contact local
              emergency services or a crisis helpline.
            </p>
          </div>

          <figure className="hp-hero__visual">
            <ImagePlaceholder
              asset="home-hero-patient-consultation.jpg"
              direction="Quiet consulting room in warm daylight — empty chairs, a side table, a window. No people."
              src="/images/editorial/home-consultation-room-v1.jpg"
              alt="A quiet consultation room with two chairs and a notebook in warm daylight"
              loading="eager"
            />
            <figcaption className="ed-mono">Consulting room · Rajkot practice context</figcaption>
          </figure>
        </div>
      </section>

      {/* Care — primary conversion path */}
      <section className="ed-pace" aria-labelledby="home-services-title">
        <div className="ed-shell">
          <header className="ed-head">
            <span className="ed-head__label">Care</span>
            <h2 id="home-services-title">Four kinds of support, one clinical team.</h2>
            <p>Choose a starting point. Your clinician can help redirect if another service fits better.</p>
          </header>
          <div className="ed-index">
            {OUR_SERVICES.map((item, i) => (
              <Link key={item.title} to={item.href} className="ed-index__row">
                <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{item.title}</h3>
                  <span className="ed-index__meta">{item.meta}</span>
                </span>
                <p className="ed-index__body">{item.body}</p>
                <span className="ed-index__go">View →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Academy — one quiet professional path, not a second site map */}
      <section className="ed-pace ed-band-soft" aria-labelledby="home-academy-title">
        <div className="ed-shell ed-facing">
          <header className="ed-head" style={{ marginBottom: 0 }}>
            <span className="ed-head__label">For professionals</span>
            <h2 id="home-academy-title">Learning beside a working clinical service.</h2>
            <p>
              Practical education for psychiatrists, therapists, counsellors, and trainees —
              designed where care actually happens.
            </p>
            <p style={{ marginTop: '1.5rem' }}>
              <Link className="btn btn-primary" to="/academy">Visit the Academy</Link>
              <Link className="ed-link" to="/professionals" style={{ marginLeft: '1.25rem' }}>
                Clinician overview
              </Link>
            </p>
          </header>
          <aside>
            <blockquote className="ed-pull">
              <p>“Education is not just information. It is transformation in practice.”</p>
              <cite>Serenest Academy</cite>
            </blockquote>
          </aside>
        </div>
      </section>

      {/* Closing CTA — one job */}
      <section className="ed-band" aria-labelledby="home-cta-title">
        <div className="ed-shell">
          <h2 id="home-cta-title" style={{ maxWidth: '18ch' }}>
            Start with the kind of support you need.
          </h2>
          <p className="hp-cta__contact" style={{ marginTop: '1rem' }}>
            <a href="mailto:support@serenest.in">support@serenest.in</a>
            <span aria-hidden="true"> · </span>
            <a href="tel:7777936367">7777936367</a>
          </p>
          <div className="hp-hero__actions" style={{ marginTop: '1.75rem' }}>
            <Link className="btn btn-ghost-dark btn-lg" to="/services">
              Explore services
            </Link>
            <Link className="btn btn-ghost-dark btn-lg" to="/book">
              Book an appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
