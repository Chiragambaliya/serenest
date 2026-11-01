import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useSectionReveal } from '../hooks/useReveal';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { SPECIALTIES, getSpecialty, specialtyPath } from '../lib/specialties.js';
import {
  CARE_PHONE_DISPLAY,
  CARE_TEL_HREF,
  TRUST_POINTS,
  careWaHref,
} from '../lib/patientReach';

// Specialties featured on the homepage; the full list lives on /specialties.
const FEATURED_SPECIALTIES = [
  'general-medicine',
  'psychiatry',
  'endocrinology',
  'cardiology',
  'dermatology',
  'obstetrics-gynaecology',
  'paediatrics',
  'orthopaedics',
];

const ARRIVE_PATHS = [
  {
    num: '01',
    title: 'I need to see a doctor',
    body: 'Tell us what is going on and pick a time. We match you with a verified doctor and confirm by phone or WhatsApp.',
    href: '/book',
    cta: 'Request an appointment',
  },
  {
    num: '02',
    title: 'I know which specialist I need',
    body: `Choose from ${SPECIALTIES.length} specialties — from general medicine and diabetes to skin, women's health and mental health.`,
    href: '/specialties',
    cta: 'Browse specialties',
  },
  {
    num: '03',
    title: 'I want to choose who I see',
    body: 'Browse verified doctors and clinicians by specialty, language, city and fee, then request a slot.',
    href: '/patient/find-professional',
    cta: 'Browse doctors',
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
            See a verified doctor in any specialty — from home.
          </h1>
          <p className="hp-hero__body">
            General medicine to cardiology, skin to mental health. Request a slot in minutes — we confirm by
            phone or WhatsApp, and you pay only after the appointment is locked.
          </p>
          <div className="hp-hero__actions">
            <HpBtn to="/book" variant="solid-light">Request an appointment</HpBtn>
            <HpBtn to="/specialties" variant="ghost-dark">Browse specialties</HpBtn>
          </div>
          <p className="hp-hero__reach">
            <a href={CARE_TEL_HREF}>Call {CARE_PHONE_DISPLAY}</a>
            <span aria-hidden="true">·</span>
            <a href={careWaHref()} target="_blank" rel="noreferrer">WhatsApp us</a>
          </p>
        </div>
        <p className="hp-hero__note">
          Not for emergencies. For chest pain, breathing difficulty, severe injury or immediate risk to
          life, call 112 or go to the nearest hospital.
        </p>
      </section>

      <section className="hp-trust" aria-label="How Serenest care works">
        <ul className="hp-trust__list">
          {TRUST_POINTS.map((point) => (
            <li key={point.id} className="hp-trust__item">
              <span className="hp-trust__mark" aria-hidden="true" />
              {point.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="ed-pace hp-arrive" aria-labelledby="home-arrive-title">
        <div className="ed-shell">
          <header className="ed-head hp-arrive__head">
            <span className="ed-head__label">Begin</span>
            <h2 id="home-arrive-title">How can we help today?</h2>
            <p>Start with an appointment, a specialist you have in mind, or a doctor you choose.</p>
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
            <span className="ed-head__label">Specialties</span>
            <h2 id="home-services-title">Care across specialties.</h2>
            <p>
              Not sure where to start? Choose General Medicine — a physician will advise you or refer you to the right
              specialist.
            </p>
          </header>
          <div className="ed-index hp-index">
            {FEATURED_SPECIALTIES.map(getSpecialty).filter(Boolean).map((sp, i) => (
              <Link key={sp.slug} to={specialtyPath(sp.slug)} className="ed-index__row">
                <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{sp.name}</h3>
                  <span className="ed-index__meta">{sp.conditions.slice(0, 2).join(' · ')}</span>
                </span>
                <p className="ed-index__body">{sp.summary}</p>
                <span className="ed-index__go">
                  <span>View</span>
                  <span className="hp-index__arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 24 }}>
            <Link className="hp-text-link" to="/specialties">
              See all {SPECIALTIES.length} specialties
              <span aria-hidden="true"> →</span>
            </Link>
          </p>
        </div>
      </section>

      <section className="ed-pace ed-band-soft hp-academy" aria-labelledby="home-check-title">
        <div className="ed-shell hp-academy__grid">
          <header className="ed-head" style={{ marginBottom: 0 }}>
            <span className="ed-head__label">Mental health check-in</span>
            <h2 id="home-check-title">Not sure if you need to talk to someone?</h2>
            <p>
              A short, private check-in for mood, anxiety, stress or burnout.
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
              <p>“A short check-in can make the next conversation with a doctor clearer.”</p>
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
            <a href={CARE_TEL_HREF}>{CARE_PHONE_DISPLAY}</a>
            <span aria-hidden="true"> · </span>
            <a href={careWaHref()} target="_blank" rel="noreferrer">WhatsApp</a>
          </p>
          <div className="hp-hero__actions hp-close__actions">
            <HpBtn to="/book" variant="solid-light">Request an appointment</HpBtn>
            <HpBtn to="/specialties" variant="ghost-dark">Browse specialties</HpBtn>
          </div>
        </div>
      </section>
    </div>
  );
}
