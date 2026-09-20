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
    body: 'See a clinician on video, audio, or chat from anywhere in India — no clinic wait.',
    href: '/services/digital-consultations',
  },
];

const ARRIVE_PATHS = [
  {
    num: '01',
    title: 'I need to talk to someone',
    body: 'Request a psychiatrist or therapist slot. We confirm by phone or WhatsApp — you pay after the time is locked.',
    href: '/book',
    cta: 'Request an appointment',
  },
  {
    num: '02',
    title: 'I want a private check-in first',
    body: 'Free mood, anxiety, and stress checks. Results stay on your device and are not a diagnosis.',
    href: '/screening',
    cta: 'Start a free check',
  },
  {
    num: '03',
    title: 'I want to choose who I see',
    body: 'Browse verified clinicians by language, city, and fee, then request a slot.',
    href: '/patient/find-professional',
    cta: 'Browse clinicians',
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
            Talk to a psychiatrist or therapist — privately, from home.
          </h1>
          <p className="hp-hero__body">
            Request a slot in minutes. We confirm by phone or WhatsApp.
            You pay after the appointment is locked, not when you ask.
          </p>
          <div className="hp-hero__actions">
            <HpBtn to="/book" variant="solid-light">Request an appointment</HpBtn>
            <HpBtn to="/screening" variant="ghost-dark">Start a free check</HpBtn>
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
            <h2 id="home-arrive-title">How can we help today?</h2>
            <p>Start with a conversation, a private check-in, or a clinician you choose.</p>
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
            <h2 id="home-services-title">Start with what you are going through.</h2>
            <p>Psychiatry, therapy, addiction support, or a digital consult — your clinician can redirect if another fit is better.</p>
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

      <section className="ed-pace ed-band-soft hp-academy" aria-labelledby="home-check-title">
        <div className="ed-shell hp-academy__grid">
          <header className="ed-head" style={{ marginBottom: 0 }}>
            <span className="ed-head__label">Check in</span>
            <h2 id="home-check-title">Not sure if you need an appointment yet?</h2>
            <p>
              A short, private check-in for mood, anxiety, stress, or burnout.
              Results stay on this device and are not a diagnosis.
            </p>
            <div className="hp-academy__actions">
              <HpBtn to="/screening" variant="solid">Start a free check</HpBtn>
              <Link className="hp-text-link" to="/book">
                Skip this — request a slot
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          </header>
          <aside className="hp-academy__aside">
            <figure className="hp-academy__visual">
              <ImagePlaceholder
                asset="home-screening-desk.jpg"
                direction="Quiet desk in warm daylight — notebook, window, empty chair. No people."
                src="/images/editorial/psychiatry-consultation-desk-v1.jpg"
                alt="A quiet consultation desk in warm daylight"
                loading="lazy"
              />
            </figure>
            <blockquote className="ed-pull hp-pull">
              <p>“A short check-in can make the next conversation with a clinician clearer.”</p>
              <cite>Serenest Care</cite>
            </blockquote>
          </aside>
        </div>
      </section>

      <section className="ed-band hp-close" aria-labelledby="home-cta-title">
        <div className="ed-shell">
          <h2 id="home-cta-title" style={{ maxWidth: '22ch' }}>
            When you are ready, request a slot. We will take it from there.
          </h2>
          <p className="hp-cta__contact">
            <a href="mailto:support@serenest.in">support@serenest.in</a>
            <span aria-hidden="true"> · </span>
            <a href="tel:7777936367">7777936367</a>
          </p>
          <div className="hp-hero__actions hp-close__actions">
            <HpBtn to="/book" variant="solid-light">Request an appointment</HpBtn>
            <HpBtn to="/screening" variant="ghost-dark">Start a free check</HpBtn>
          </div>
        </div>
      </section>
    </div>
  );
}
