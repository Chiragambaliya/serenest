import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import ImagePlaceholder from '../components/ImagePlaceholder';
import {
  CARE_PHONE_DISPLAY,
  CARE_TEL_HREF,
  careWaHref,
} from '../lib/patientReach';

const PAGE_LINKS = [
  ['#start', 'How to start'],
  ['#care', 'Care'],
  ['#check', 'Private check-in'],
];

const ARRIVE_PATHS = [
  {
    title: 'I need to talk to someone',
    body: 'Request a specialist. We confirm by phone or WhatsApp — you pay after the time is locked.',
    href: '/book',
    cta: 'Request an appointment',
  },
  {
    title: 'I want a private check-in first',
    body: 'Free mood, anxiety, and stress checks. Results stay on your device and are not a diagnosis.',
    href: '/screening',
    cta: 'Start a free check',
  },
  {
    title: 'I want to choose who I see',
    body: 'Browse verified clinicians by language, city, and fee, then request a slot.',
    href: '/patient/find-professional',
    cta: 'Browse clinicians',
  },
];

const OUR_SERVICES = [
  {
    title: 'Psychiatry',
    meta: 'Assessment · medication',
    body: 'Assessment, diagnosis, and medication management from a licensed psychiatrist.',
    href: '/services/psychiatry',
  },
  {
    title: 'Therapy and counselling',
    meta: 'Talk therapy',
    body: 'Structured talk therapy for individuals, couples, and families.',
    href: '/services/therapy',
  },
  {
    title: 'Addiction and recovery',
    meta: 'Substance use',
    body: 'Assessment, counselling, and relapse-prevention support for substance use.',
    href: '/services/addiction-care',
  },
  {
    title: 'Digital consultations',
    meta: 'Video · audio · chat',
    body: 'See a clinician from home. Your clinician can redirect you if another specialty is a better fit.',
    href: '/services/digital-consultations',
  },
];

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });

  return (
    <div className="care-academy">
      <section className="ed-pace-open" aria-labelledby="home-hero-title">
        <div className="ed-shell ed-facing">
          <div>
            <p className="hp-brand-mark">
              <span className="hp-brand-mark__name">Serenest</span>
              <span className="hp-brand-mark__meta ed-mono">Clinical care · Specialists</span>
            </p>
            <h1 id="home-hero-title">
              Care from the specialist you need.
            </h1>
            <p className="ed-lede">
              Request a psychiatrist, therapist, or the clinician who fits.
              We confirm by phone or WhatsApp. You pay after the appointment is locked, not when you ask.
            </p>
            <div className="care-academy__actions">
              <Link className="btn btn-primary btn-lg" to="/book">Request an appointment</Link>
              <Link className="btn btn-ghost btn-lg" to="/services">View care</Link>
            </div>
            <p className="care-academy__note">
              Not for emergencies. If you or someone else is at immediate risk, contact local
              emergency services or a crisis helpline.
            </p>
          </div>
          <figure className="ed-figure">
            <div className="ed-figure__media">
              <ImagePlaceholder
                asset="home-hero-patient-consultation.jpg"
                direction="Quiet consulting room in warm daylight — empty chairs, a side table, a window. No people."
                src="/images/editorial/home-consultation-room-v1.jpg"
                alt="A quiet consulting room in warm daylight"
                loading="eager"
              />
            </div>
            <figcaption className="ed-mono">Consulting room · no people</figcaption>
          </figure>
        </div>
      </section>

      <nav className="ed-pace-tight care-academy__pagenav" aria-label="On this page">
        <div className="ed-shell">
          {PAGE_LINKS.map(([href, label]) => (
            <a key={href} href={href} className="ed-mono">{label}</a>
          ))}
        </div>
      </nav>

      <section id="start" className="ed-pace" aria-labelledby="home-arrive-title">
        <div className="ed-shell">
          <header className="ed-head">
            <span className="ed-head__label">Begin</span>
            <h2 id="home-arrive-title">How can we help today?</h2>
            <p>Start with a conversation, a private check-in, or a clinician you choose.</p>
          </header>
          <div className="ed-index">
            {ARRIVE_PATHS.map((path, i) => (
              <Link key={path.href} to={path.href} className="ed-index__row">
                <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{path.title}</h3>
                </span>
                <p className="ed-index__body">{path.body}</p>
                <span className="ed-index__go">{path.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="care" className="ed-pace ed-band-soft" aria-labelledby="home-services-title">
        <div className="ed-shell">
          <header className="ed-head">
            <span className="ed-head__label">Care</span>
            <h2 id="home-services-title">Start with the kind of care you need.</h2>
            <p>Psychiatry, therapy, addiction support, or a digital consult. Your clinician can redirect you if another fit is better.</p>
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

      <section id="check" className="ed-pace" aria-labelledby="home-check-title">
        <div className="ed-shell ed-facing ed-facing--flip">
          <header className="ed-head">
            <span className="ed-head__label">Check in</span>
            <h2 id="home-check-title">Not sure if you need an appointment yet?</h2>
            <p>
              A short, private check-in for mood, anxiety, stress, or burnout.
              Results stay on this device and are not a diagnosis.
            </p>
            <div className="care-academy__actions">
              <Link className="btn btn-primary btn-lg" to="/screening">Start a free check</Link>
              <Link className="btn btn-ghost btn-lg" to="/book">Request a slot</Link>
            </div>
          </header>
          <figure className="ed-figure">
            <div className="ed-figure__media">
              <ImagePlaceholder
                asset="home-screening-desk.jpg"
                direction="Quiet desk in warm daylight — notebook, window, empty chair. No people."
                src="/images/editorial/psychiatry-consultation-desk-v1.jpg"
                alt="A quiet consultation desk in warm daylight"
                loading="lazy"
              />
            </div>
            <figcaption className="ed-mono">Desk still life · no people</figcaption>
          </figure>
        </div>
      </section>

      <section className="ed-pace ed-band-soft" aria-labelledby="home-cta-title">
        <div className="ed-shell">
          <h2 id="home-cta-title">When you are ready, request a slot. We will take it from there.</h2>
          <p className="care-academy__contact">
            <a href="mailto:support@serenest.in">support@serenest.in</a>
            <span aria-hidden="true"> · </span>
            <a href={CARE_TEL_HREF}>{CARE_PHONE_DISPLAY}</a>
            <span aria-hidden="true"> · </span>
            <a href={careWaHref()} target="_blank" rel="noreferrer">WhatsApp</a>
          </p>
          <div className="care-academy__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Request an appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/patient/find-professional">Choose a clinician</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
