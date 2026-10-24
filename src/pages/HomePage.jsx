import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useSectionReveal } from '../hooks/useReveal';
import ImagePlaceholder from '../components/ImagePlaceholder';
import {
  CARE_PHONE_DISPLAY,
  CARE_TEL_HREF,
  TRUST_POINTS,
  careWaHref,
} from '../lib/patientReach';

const REQUEST_STEPS = [
  {
    num: '01',
    title: 'Request a time',
    body: 'Your name, a phone number, and a preferred slot. Nothing is charged on the form.',
  },
  {
    num: '02',
    title: 'We confirm',
    body: 'A coordinator calls or WhatsApps to lock the clinician and the time.',
  },
  {
    num: '03',
    title: 'Then you pay',
    body: 'UPI, card, or net banking only after the appointment is locked.',
  },
];

const ARRIVE_PATHS = [
  {
    num: '01',
    title: 'I need to talk to someone',
    body: 'Request a psychiatrist or therapist. We confirm by phone or WhatsApp.',
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

const CARE_SERVICES = [
  {
    title: 'Psychiatry',
    meta: 'From ₹1,200',
    body: 'Assessment, diagnosis, and medication management with a licensed psychiatrist.',
    href: '/services/psychiatry',
  },
  {
    title: 'Therapy and counselling',
    meta: 'From ₹800',
    body: 'Structured talk therapy for individuals, couples, and families.',
    href: '/services/therapy',
  },
  {
    title: 'Addiction and recovery',
    meta: 'Substance use',
    body: 'Assessment, counselling, and relapse-prevention support.',
    href: '/services/addiction-care',
  },
  {
    title: 'Digital consultations',
    meta: 'Video · audio · chat',
    body: 'See a clinician from anywhere in India. No clinic wait.',
    href: '/services/digital-consultations',
  },
];

const CONCERNS = [
  { label: 'Low mood', href: '/online-psychiatrist-for-depression-india' },
  { label: 'Anxiety', href: '/anxiety-counselling-online-india' },
  { label: 'ADHD', href: '/adhd-assessment-online-india' },
  { label: 'OCD', href: '/ocd-treatment-online-india' },
  { label: 'Addiction', href: '/services/addiction-care' },
  { label: 'Sleep and stress', href: '/book' },
];

function CareBtn({ to, variant = 'solid', children }) {
  return (
    <Link className={`care-btn care-btn--${variant}`} to={to}>
      <span>{children}</span>
      <span className="care-btn__arrow" aria-hidden="true">→</span>
    </Link>
  );
}

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });
  const rootRef = useSectionReveal();

  return (
    <div className="home home--care" ref={rootRef}>
      <section className="care-hero" aria-labelledby="home-hero-title">
        <div className="care-hero__copy">
          <p className="care-kicker">Care across India</p>
          <h1 id="home-hero-title">
            Talk to a psychiatrist or therapist — privately, from home.
          </h1>
          <p className="care-hero__lead">
            Request a slot in a few minutes. We confirm by phone or WhatsApp.
            You pay after the appointment is locked, not when you ask.
          </p>
          <div className="care-hero__actions">
            <CareBtn to="/book">Request an appointment</CareBtn>
            <CareBtn to="/screening" variant="ghost">Start a free check</CareBtn>
          </div>
          <p className="care-hero__reach">
            <a href={CARE_TEL_HREF}>Call {CARE_PHONE_DISPLAY}</a>
            <span aria-hidden="true">·</span>
            <a href={careWaHref()} target="_blank" rel="noreferrer">WhatsApp us</a>
            <span aria-hidden="true">·</span>
            <Link to="/pricing">Fees from ₹800</Link>
          </p>
          <p className="care-hero__note">
            Not for emergencies. If you or someone else is at immediate risk, contact local
            emergency services or a crisis helpline.
          </p>
        </div>

        <div className="care-hero__stage">
          <figure className="care-hero__photo">
            <ImagePlaceholder
              asset="home-hero-patient-consultation.jpg"
              direction="Quiet consulting room in warm daylight — empty chairs, a side table, a window. No people."
              src="/images/editorial/home-consultation-room-v1.jpg"
              alt="A quiet consulting room in warm daylight"
              loading="eager"
            />
          </figure>
          <ol className="care-hero__steps" aria-label="How a request works">
            {REQUEST_STEPS.map((step) => (
              <li key={step.num}>
                <span className="care-hero__step-num">{step.num}</span>
                <span>
                  <strong>{step.title}</strong>
                  <span>{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="care-trust" aria-label="How Serenest care works">
        <ul>
          {TRUST_POINTS.map((point) => (
            <li key={point.id}>{point.label}</li>
          ))}
        </ul>
      </section>

      <section className="care-band" aria-labelledby="home-arrive-title">
        <div className="care-shell">
          <header className="care-head">
            <p className="care-kicker">Begin</p>
            <h2 id="home-arrive-title">How can we help today?</h2>
            <p>Start with a conversation, a private check-in, or a clinician you choose.</p>
          </header>
          <div className="care-paths">
            {ARRIVE_PATHS.map((path) => (
              <Link key={path.num} to={path.href} className="care-path">
                <span className="care-path__num">{path.num}</span>
                <span className="care-path__title">{path.title}</span>
                <span className="care-path__body">{path.body}</span>
                <span className="care-path__cta">
                  {path.cta}
                  <span aria-hidden="true"> →</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="care-band care-band--paper" aria-labelledby="home-services-title">
        <div className="care-shell">
          <header className="care-head care-head--split">
            <div>
              <p className="care-kicker">Care</p>
              <h2 id="home-services-title">Start with what you are going through.</h2>
            </div>
            <p>
              Psychiatry, therapy, addiction support, or a digital consult.
              Your clinician can redirect you if another fit is better.
              <Link to="/pricing"> See fees</Link>.
            </p>
          </header>
          <div className="care-services">
            {CARE_SERVICES.map((item) => (
              <Link key={item.title} to={item.href} className="care-service">
                <span className="care-service__meta">{item.meta}</span>
                <span className="care-service__title">{item.title}</span>
                <span className="care-service__body">{item.body}</span>
                <span className="care-service__go">View <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="care-band" aria-labelledby="home-check-title">
        <div className="care-shell care-check">
          <figure className="care-check__photo">
            <ImagePlaceholder
              asset="home-screening-desk.jpg"
              direction="Quiet desk in warm daylight — notebook, window, empty chair. No people."
              src="/images/editorial/psychiatry-consultation-desk-v1.jpg"
              alt="A quiet desk beside a window"
              loading="eager"
            />
          </figure>
          <div className="care-check__copy">
            <p className="care-kicker">Private check-in</p>
            <h2 id="home-check-title">Not sure if you need an appointment yet?</h2>
            <p>
              A short check-in for mood, anxiety, stress, or burnout.
              Results stay on this device. They are not a diagnosis, and you can skip straight to a request.
            </p>
            <div className="care-hero__actions">
              <CareBtn to="/screening">Start a free check</CareBtn>
              <CareBtn to="/book" variant="ghost">Request a slot instead</CareBtn>
            </div>
          </div>
        </div>
      </section>

      <section className="care-band care-band--paper" aria-labelledby="home-concerns-title">
        <div className="care-shell">
          <header className="care-head care-head--split">
            <div>
              <p className="care-kicker">Common reasons</p>
              <h2 id="home-concerns-title">You do not need the perfect words.</h2>
            </div>
            <p>Pick a starting point. Each page explains what a clinician can and cannot do online.</p>
          </header>
          <ul className="care-concerns">
            {CONCERNS.map((item) => (
              <li key={item.label}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="care-close" aria-labelledby="home-cta-title">
        <div className="care-shell">
          <p className="care-kicker care-kicker--light">When you are ready</p>
          <h2 id="home-cta-title">Request a slot. We will take it from there.</h2>
          <p className="care-close__contact">
            <a href="mailto:support@serenest.in">support@serenest.in</a>
            <span aria-hidden="true"> · </span>
            <a href={CARE_TEL_HREF}>{CARE_PHONE_DISPLAY}</a>
            <span aria-hidden="true"> · </span>
            <a href={careWaHref()} target="_blank" rel="noreferrer">WhatsApp</a>
          </p>
          <div className="care-hero__actions care-close__actions">
            <CareBtn to="/book" variant="light">Request an appointment</CareBtn>
            <CareBtn to="/screening" variant="line">Start a free check</CareBtn>
          </div>
        </div>
      </section>
    </div>
  );
}
