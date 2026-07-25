import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useSectionReveal } from '../hooks/useReveal';
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

function HpBtn({ to, variant = 'solid', children, arrow = true }) {
  return (
    <Link className={`hp-btn hp-btn--${variant}`} to={to}>
      <span className="hp-btn__label">{children}</span>
      {arrow ? <span className="hp-btn__arrow" aria-hidden="true">→</span> : null}
    </Link>
  );
}

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });
  const rootRef = useSectionReveal();

  return (
    <div className="home home--lean" ref={rootRef}>
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
              <HpBtn to="/services" variant="solid">Find the right service</HpBtn>
              <HpBtn to="/book" variant="ghost">Book an appointment</HpBtn>
            </div>
            <p className="hp-hero__note">
              Not for emergencies. If you or someone else is at immediate risk, contact local
              emergency services or a crisis helpline.
            </p>
          </div>

          <figure className="hp-hero__visual">
            <div className="hp-hero__frame">
              <ImagePlaceholder
                asset="home-hero-patient-consultation.jpg"
                direction="Quiet consulting room in warm daylight — empty chairs, a side table, a window. No people."
                src="/images/editorial/home-consultation-room-v1.jpg"
                alt="A quiet consultation room with two chairs and a notebook in warm daylight"
                loading="eager"
              />
            </div>
            <figcaption className="ed-mono">Consulting room · Rajkot practice context</figcaption>
          </figure>
        </div>
      </section>

      <section className="ed-pace hp-care" aria-labelledby="home-services-title">
        <div className="ed-shell">
          <header className="ed-head">
            <span className="ed-head__label">Care</span>
            <h2 id="home-services-title">Four kinds of support, one clinical team.</h2>
            <p>Choose a starting point. Your clinician can help redirect if another service fits better.</p>
          </header>
          <div className="ed-index hp-index">
            {OUR_SERVICES.map((item, i) => (
              <Link key={item.title} to={item.href} className="ed-index__row">
                <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{item.title}</h3>
                  <span className="ed-index__meta">{item.meta}</span>
                </span>
                <p className="ed-index__body">{item.body}</p>
                <span className="ed-index__go">
                  <span>View</span>
                  <span className="hp-index__arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ed-pace ed-band-soft hp-academy" aria-labelledby="home-academy-title">
        <div className="ed-shell ed-facing">
          <header className="ed-head" style={{ marginBottom: 0 }}>
            <span className="ed-head__label">For professionals</span>
            <h2 id="home-academy-title">Learning beside a working clinical service.</h2>
            <p>
              Practical education for psychiatrists, therapists, counsellors, and trainees —
              designed where care actually happens.
            </p>
            <div className="hp-academy__actions">
              <HpBtn to="/academy" variant="solid">Visit the Academy</HpBtn>
              <Link className="hp-text-link" to="/professionals">
                Clinician overview
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          </header>
          <aside>
            <blockquote className="ed-pull hp-pull">
              <p>“Education is not just information. It is transformation in practice.”</p>
              <cite>Serenest Academy</cite>
            </blockquote>
          </aside>
        </div>
      </section>

      <section className="ed-band hp-close" aria-labelledby="home-cta-title">
        <div className="ed-shell">
          <h2 id="home-cta-title" style={{ maxWidth: '18ch' }}>
            Start with the kind of support you need.
          </h2>
          <p className="hp-cta__contact">
            <a href="mailto:support@serenest.in">support@serenest.in</a>
            <span aria-hidden="true"> · </span>
            <a href="tel:7777936367">7777936367</a>
          </p>
          <div className="hp-hero__actions hp-close__actions">
            <HpBtn to="/services" variant="ghost-dark">Explore services</HpBtn>
            <HpBtn to="/book" variant="solid-light">Book an appointment</HpBtn>
          </div>
        </div>
      </section>
    </div>
  );
}
