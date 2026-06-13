import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { HOME_FEATURED_GUIDES } from '../lib/guides';

function HomeIcon({ name }) {
  const icons = {
    consult: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M17 9h2.5a1.5 1.5 0 0 1 1.5 1.5V16l-4-3h-4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
    screen: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    follow: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12a7 7 0 0 1 12.9-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M19 7v4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 12a7 7 0 0 1-12.9 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M5 17v-4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 12.5 10 16.5 18 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return <span className="home__icon">{icons[name]}</span>;
}

const PILLARS = [
  {
    icon: 'lock',
    title: 'Private by design',
    body: 'Encrypted sessions and careful handling of your health information.',
  },
  {
    icon: 'check',
    title: 'Verified clinicians',
    body: 'Psychiatrists and psychologists reviewed before they join Serenest.',
  },
  {
    icon: 'follow',
    title: 'Continuity of care',
    body: 'Notes, follow-ups, and re-booking stay connected after your first visit.',
  },
];

const CARE = [
  {
    icon: 'consult',
    title: 'Book a consultation',
    body: 'Secure video, audio, or chat with a verified clinician. Structured intake included.',
    href: '/book',
    cta: 'Book now',
  },
  {
    icon: 'screen',
    title: 'Start with screening',
    body: 'PHQ-9 and GAD-7 help you understand symptoms before you book. Not a diagnosis on its own.',
    href: '/screening',
    cta: 'Take screening',
  },
  {
    icon: 'follow',
    title: 'Continue your care',
    body: 'Follow-ups and care plans in one place so treatment does not stop after one session.',
    href: '/services',
    cta: 'View services',
  },
];

const STEPS = [
  { title: 'Choose your format', body: 'Video, audio, or chat — or begin with screening if you are unsure.' },
  { title: 'Pick a time', body: 'Share your details. We confirm your clinician and next steps with you.' },
  { title: 'Meet your clinician', body: 'Assessment, guidance, and a clear plan for follow-up where needed.' },
];

const LINKS = [
  { label: 'Serenest Academy', to: '/academy' },
  { label: 'Find a professional', to: '/patient/find-professional' },
  { label: 'For professionals', to: '/professionals' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Privacy', to: '/privacy' },
];

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });

  return (
    <div className="home">
      <section className="home__hero" aria-labelledby="home-hero-title">
        <div className="home__shell">
          <div className="home__hero-grid">
            <div className="home__hero-copy">
              <p className="home__eyebrow">
                <span>Serenest</span>
                <span className="home__eyebrow-dot" aria-hidden="true">·</span>
                <span>Pan-India telepsychiatry</span>
              </p>
              <h1 id="home-hero-title" className="home__title">
                Private, clinical mental health care — wherever you are in India.
              </h1>
              <p className="home__lead">
                Speak with verified psychiatrists and psychologists from home. Structured intake,
                evidence-based screening, and care that continues beyond a single session.
              </p>
              <div className="home__actions">
                <Link className="btn btn-primary btn-lg" to="/book">
                  Book now
                </Link>
                <Link className="btn btn-ghost btn-lg" to="/screening">
                  Take screening
                </Link>
              </div>
              <p className="home__note">
                Not for emergencies. If you or someone else is at immediate risk, contact local
                emergency services or a crisis helpline.
              </p>
            </div>

            <aside className="home__hero-card" aria-label="What Serenest includes">
              <p className="home__hero-card-title">What you get on Serenest</p>
              <ul className="home__hero-card-list">
                <li><HomeIcon name="check" />Verified psychiatrists and psychologists</li>
                <li><HomeIcon name="check" />Video, audio, and chat consultations</li>
                <li><HomeIcon name="check" />PHQ-9 / GAD-7 screening tools</li>
                <li><HomeIcon name="check" />Structured intake and follow-up care</li>
                <li><HomeIcon name="lock" />Encrypted sessions and privacy-first records</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="home__strip" aria-label="Consultation formats">
        <div className="home__shell">
          <ul className="home__modes">
            <li>Video consultations</li>
            <li>Audio sessions</li>
            <li>Secure chat</li>
            <li>Pan-India access</li>
          </ul>
        </div>
      </section>

      <section className="home__pillars" aria-label="Why Serenest">
        <div className="home__shell">
          <ul className="home__pillar-list">
            {PILLARS.map((item) => (
              <li key={item.title} className="home__pillar">
                <HomeIcon name={item.icon} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home__section" id="care">
        <div className="home__shell">
          <header className="home__header home__header--center">
            <p className="home__eyebrow">Start here</p>
            <h2>Three clear paths into care</h2>
            <p>Built for privacy and continuity — not anonymous one-off chats.</p>
          </header>
          <div className="home__cards">
            {CARE.map((item) => (
              <Link key={item.title} className="home__card" to={item.href}>
                <HomeIcon name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="home__card-link">{item.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home__section home__section--muted" id="how">
        <div className="home__shell">
          <div className="home__split">
            <header className="home__header home__header--center home__header--split">
              <p className="home__eyebrow">How it works</p>
              <h2>Simple to start. Serious about follow-through.</h2>
              <p>We keep the first step light and confirm everything with you before your session.</p>
            </header>
            <ol className="home__steps">
              {STEPS.map((step, i) => (
                <li key={step.title}>
                  <span className="home__step-num">{i + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="home__section" id="topics">
        <div className="home__shell">
          <header className="home__header home__header--center">
            <p className="home__eyebrow">Guides</p>
            <h2>Common reasons people come to Serenest</h2>
            <p>
              <Link className="home__guides-all" to="/guides">
                View all guides
              </Link>
              {' · '}
              <Link className="home__guides-all" to="/academy">
                Serenest Academy
              </Link>
            </p>
          </header>
          <div className="home__topics">
            {HOME_FEATURED_GUIDES.map((t) => (
              <Link key={t.path} className="home__topic" to={t.path}>
                {t.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home__cta">
        <div className="home__shell">
          <div className="home__cta-inner">
            <div className="home__cta-copy">
              <h2>Ready when you are</h2>
              <p>
                Book a consultation or reach out with questions. We respond on email and WhatsApp
                during working hours.
              </p>
              <p className="home__contact">
                <a href="mailto:support@serenest.in">support@serenest.in</a>
                <span aria-hidden="true"> · </span>
                <a href="tel:7777936367">7777936367</a>
              </p>
            </div>
            <div className="home__cta-actions">
              <Link className="btn btn-primary btn-lg" to="/book">
                Book now
              </Link>
              <Link className="btn btn-ghost btn-lg" to="/faq">
                Read FAQ
              </Link>
            </div>
          </div>
          <nav className="home__nav" aria-label="More on Serenest">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </div>
  );
}
