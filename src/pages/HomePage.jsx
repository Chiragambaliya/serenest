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

const ARRIVE_PATHS = [
  {
    num: '01',
    title: 'I need care',
    body: 'Psychiatry, therapy, or addiction support — find the right clinical starting point.',
    href: '/services',
    cta: 'Explore services',
  },
  {
    num: '02',
    title: 'I am a clinician',
    body: 'Learn beside a working practice. Academy programmes for psychiatrists, therapists, and trainees.',
    href: '/academy',
    cta: 'Visit the Academy',
  },
  {
    num: '03',
    title: 'I represent a team',
    body: 'Corporate EAP and organisational mental-health support, designed with clinical responsibility.',
    href: '/corporate',
    cta: 'Corporate care',
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
      <section className="hp-hero hp-hero--bleed" aria-labelledby="home-hero-title">
        <div className="hp-hero__media" aria-hidden="true">
          <ImagePlaceholder
            asset="home-hero-patient-consultation.jpg"
            direction="Quiet consulting room in warm daylight — empty chairs, a side table, a window. No people."
            src="/images/editorial/home-consultation-room-v1.jpg"
            alt=""
            loading="eager"
          />
        </div>
        <div className="hp-hero__veil" aria-hidden="true" />
        <div className="hp-hero__content">
          <p className="hp-hero__brand">Serenest</p>
          <h1 id="home-hero-title" className="hp-hero__title">
            Care for the mind, grounded in clinical practice.
          </h1>
          <p className="hp-hero__body">
            Psychiatry, therapy, addiction support, and professional learning —
            brought together with clinical responsibility.
          </p>
          <div className="hp-hero__actions">
            <HpBtn to="/services" variant="solid-light">Find the right service</HpBtn>
            <HpBtn to="/book" variant="ghost-dark">Book an appointment</HpBtn>
          </div>
        </div>
        <p className="hp-hero__note">
          Not for emergencies. If you or someone else is at immediate risk, contact local
          emergency services or a crisis helpline.
        </p>
      </section>

      <section className="ed-pace hp-arrive" aria-labelledby="home-arrive-title">
        <div className="ed-shell">
          <header className="ed-head hp-arrive__head">
            <span className="ed-head__label">Begin</span>
            <h2 id="home-arrive-title">Tell us how you arrive.</h2>
            <p>Three doors into Serenest. Choose the one that fits today.</p>
          </header>
          <div className="hp-arrive__paths" role="list">
            {ARRIVE_PATHS.map((path) => (
              <Link
                key={path.num}
                to={path.href}
                className="hp-arrive__path"
                role="listitem"
              >
                <span className="hp-arrive__num ed-mono">{path.num}</span>
                <span className="hp-arrive__copy">
                  <span className="hp-arrive__title">{path.title}</span>
                  <span className="hp-arrive__body">{path.body}</span>
                </span>
                <span className="hp-arrive__cta">
                  {path.cta}
                  <span aria-hidden="true"> →</span>
                </span>
              </Link>
            ))}
          </div>
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
        <div className="ed-shell hp-academy__grid">
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
          <aside className="hp-academy__aside">
            <figure className="hp-academy__visual">
              <ImagePlaceholder
                asset="academy-teaching-room.jpg"
                direction="Quiet teaching room with books and notes — warm daylight, no people."
                src="/images/editorial/academy-teaching-room-v1.png"
                alt="A quiet teaching room with books and notes in warm daylight"
                loading="lazy"
              />
            </figure>
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
