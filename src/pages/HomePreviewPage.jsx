import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { BLOG_POSTS } from '../lib/blogPosts';
import EmailCapture from '../components/EmailCapture';

const TRUST = [
  { title: 'Doctor-led', body: 'Built by a practising psychiatrist' },
  { title: 'Evidence-based', body: 'Structured clinical workflows' },
  { title: 'Private & secure', body: 'Encrypted sessions, careful records' },
  { title: 'Teleconsultation', body: 'Video, audio, and chat' },
  { title: 'For individuals', body: 'Care from home, across India' },
  { title: 'For professionals', body: 'Practice tools and Academy' },
];

const PATHS = [
  {
    key: 'individuals',
    title: 'Individuals',
    body: 'Find the right support for your mind and emotional wellbeing.',
    cta: 'Explore care',
    to: '/book',
  },
  {
    key: 'professionals',
    title: 'Professionals',
    body: 'Grow your practice with clinical tools, learning, and community.',
    cta: 'Explore for professionals',
    to: '/professionals',
  },
  {
    key: 'learners',
    title: 'Students & learners',
    body: 'Learn, upskill, and advance your career in mental health.',
    cta: 'Explore Academy',
    to: '/academy',
  },
];

const SERVICES = [
  { title: 'Psychiatry consultation', to: '/services' },
  { title: 'Therapy & counselling', to: '/services' },
  { title: 'De-addiction support', to: '/services' },
  { title: 'Child & adolescent mental health', to: '/services' },
  { title: 'Couples & relationship therapy', to: '/services' },
  { title: 'Mental wellness programs', to: '/corporate' },
];

const STEPS = [
  { title: 'Book', body: 'Choose a time that works for you.' },
  { title: 'Connect', body: 'Meet your clinician by video, audio, or chat.' },
  { title: 'Care plan', body: 'Leave with a clear next step.' },
  { title: 'Follow-up', body: 'Continue care without starting from zero.' },
];

const STORIES = BLOG_POSTS.slice(0, 4);

function TrustIcon({ name }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.6',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  const paths = {
    doctor: <><circle cx="12" cy="7" r="3" /><path d="M6 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" /><path d="M12 11v3M10.5 12.5h3" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9.5 12 1.8 1.8L15 10" /></>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 1 1 8 0v3" /></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></>,
    person: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" /></>,
    people: <><circle cx="9" cy="8" r="2.8" /><circle cx="16" cy="9" r="2.3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M13 19a4.5 4.5 0 0 1 7.5-3.2" /></>,
  };
  const map = ['doctor', 'shield', 'lock', 'video', 'person', 'people'];
  return <svg {...common}>{paths[map[name]] || paths.doctor}</svg>;
}

export default function HomePreviewPage() {
  useSEO({
    path: '/preview',
    title: 'Homepage preview (test) | Serenest',
    description: 'Internal test preview of the editorial Serenest homepage. Not the live site.',
    noindex: true,
  });

  return (
    <div className="home-preview">
      <div className="hp-banner" role="status">
        <strong>Test homepage</strong>
        <span>Live site is unchanged at</span>
        <Link to="/">serenest.in/</Link>
        <span aria-hidden="true">·</span>
        <span>This page is noindex</span>
      </div>

      <section className="hp-hero" aria-labelledby="hp-hero-title">
        <div className="hp-shell hp-hero__grid">
          <div className="hp-hero__copy">
            <p className="hp-brand">
              <span className="hp-brand__name">Serenest</span>
              <span className="hp-brand__dot" aria-hidden="true">·</span>
              <span>Mental healthcare</span>
            </p>
            <h1 id="hp-hero-title" className="hp-hero__title">
              Mental healthcare, thoughtfully connected.
            </h1>
            <p className="hp-hero__sub">
              Care for your mind. Support for your journey. Better practice for professionals.
            </p>
            <p className="hp-hero__lead">
              Serenest brings verified clinicians, structured teleconsultation, and professional
              education into one calm clinical platform for India.
            </p>
            <div className="hp-hero__actions">
              <Link className="hp-btn hp-btn--primary" to="/book">
                Find your starting point
              </Link>
              <Link className="hp-btn hp-btn--ghost" to="/academy">
                Explore Serenest Academy
              </Link>
            </div>
            <p className="hp-hero__note">
              Not for emergencies. If you or someone else is at immediate risk, contact local
              emergency services or a crisis helpline.
            </p>
          </div>

          <div className="hp-hero__visual" aria-hidden="true">
            <div className="hp-collage">
              <span className="hp-collage__blob hp-collage__blob--a" />
              <span className="hp-collage__blob hp-collage__blob--b" />
              <span className="hp-collage__blob hp-collage__blob--c" />
              <span className="hp-collage__leaf" />
              <span className="hp-collage__portrait" />
              <span className="hp-collage__arc" />
            </div>
          </div>
        </div>
      </section>

      <section className="hp-trust" aria-label="Why Serenest">
        <div className="hp-shell">
          <ul className="hp-trust__grid">
            {TRUST.map((item, i) => (
              <li key={item.title} className="hp-trust__item">
                <span className="hp-trust__icon"><TrustIcon name={i} /></span>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hp-section" aria-labelledby="hp-paths-title">
        <div className="hp-shell">
          <header className="hp-section__head">
            <p className="hp-eyebrow">Start here</p>
            <h2 id="hp-paths-title">Choose your path</h2>
          </header>
          <div className="hp-paths">
            {PATHS.map((p) => (
              <Link key={p.key} to={p.to} className={`hp-path hp-path--${p.key}`}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <span className="hp-path__cta">{p.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-section hp-section--split" aria-labelledby="hp-services-title">
        <div className="hp-shell hp-split">
          <div>
            <header className="hp-section__head hp-section__head--left">
              <p className="hp-eyebrow">Care</p>
              <h2 id="hp-services-title">Our services</h2>
            </header>
            <ul className="hp-services">
              {SERVICES.map((s) => (
                <li key={s.title}>
                  <Link to={s.to}>{s.title}</Link>
                </li>
              ))}
            </ul>
            <Link className="hp-text-link" to="/services">View all services</Link>
          </div>

          <aside className="hp-academy-card" aria-labelledby="hp-academy-title">
            <p className="hp-eyebrow">Education</p>
            <h2 id="hp-academy-title">Serenest Academy</h2>
            <p>
              Short courses, case discussions, and clinician learning — free for approved
              Serenest professionals.
            </p>
            <ul className="hp-academy-list">
              <li>Certificate programs &amp; CPD</li>
              <li>Clinical framing and pharmacology tracks</li>
              <li>Resources for practice readiness</li>
            </ul>
            <Link className="hp-btn hp-btn--teal" to="/academy">
              Explore Serenest Academy
            </Link>
          </aside>
        </div>
      </section>

      <section className="hp-section hp-section--soft" aria-labelledby="hp-how-title">
        <div className="hp-shell">
          <header className="hp-section__head">
            <p className="hp-eyebrow">Journey</p>
            <h2 id="hp-how-title">How care works</h2>
          </header>
          <ol className="hp-steps">
            {STEPS.map((step, i) => (
              <li key={step.title} className="hp-step">
                <span className="hp-step__num">{i + 1}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hp-section" aria-labelledby="hp-stories-title">
        <div className="hp-shell">
          <header className="hp-section__head hp-section__head--row">
            <div>
              <p className="hp-eyebrow">From Serenest</p>
              <h2 id="hp-stories-title">Stories &amp; insights</h2>
            </div>
            <Link className="hp-text-link" to="/blog">Visit all articles</Link>
          </header>
          <div className="hp-stories">
            {STORIES.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="hp-story">
                <div className="hp-story__media" aria-hidden="true" />
                <span className="hp-story__tag">{post.tag}</span>
                <h3>{post.title}</h3>
                <p className="hp-story__meta">{post.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-section hp-section--soft" aria-labelledby="hp-news-title">
        <div className="hp-shell hp-newsletter">
          <div>
            <p className="hp-eyebrow">Stay informed</p>
            <h2 id="hp-news-title">Useful updates, not noise</h2>
            <p>Occasional mental-health tips and Serenest news. Unsubscribe anytime.</p>
          </div>
          <EmailCapture source="homepage_preview_newsletter" variant="light" />
        </div>
      </section>

      <section className="hp-cta" aria-labelledby="hp-cta-title">
        <div className="hp-shell hp-cta__inner">
          <div className="hp-cta__copy">
            <p className="hp-brand hp-brand--on-dark">
              <span className="hp-brand__name">Serenest</span>
            </p>
            <h2 id="hp-cta-title">
              You don&apos;t have to navigate this alone. We&apos;re here to walk alongside you.
            </h2>
            <div className="hp-cta__actions">
              <Link className="hp-btn hp-btn--primary" to="/book">
                Book a consultation
              </Link>
              <a
                className="hp-btn hp-btn--ghost-dark"
                href="https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session%20with%20Serenest"
                target="_blank"
                rel="noreferrer"
              >
                Talk to our team on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
