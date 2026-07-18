import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { BLOG_POSTS } from '../lib/blogPosts';
import EmailCapture from '../components/EmailCapture';

const IMG = {
  hero: {
    webp: '/images/editorial/serenest-hero-editorial.webp',
    jpg: '/images/editorial/serenest-hero-editorial.jpg',
  },
  academy: {
    webp: '/images/editorial/serenest-academy-books.webp',
    jpg: '/images/editorial/serenest-academy-books.jpg',
  },
  cta: {
    webp: '/images/editorial/serenest-cta-branch.webp',
    jpg: '/images/editorial/serenest-cta-branch.jpg',
  },
};

const TRUST = [
  { icon: 'stethoscope', title: 'Doctor-led', body: 'Built by a practising psychiatrist' },
  { icon: 'shield', title: 'Evidence-based', body: 'Structured clinical workflows' },
  { icon: 'lock', title: 'Private & secure', body: 'Encrypted sessions, careful records' },
  { icon: 'video', title: 'Teleconsultation', body: 'Video, audio, and chat' },
  { icon: 'person', title: 'For individuals', body: 'Care from home, across India' },
  { icon: 'people', title: 'For professionals', body: 'Practice tools and Academy' },
];

const PATHS = [
  {
    key: 'individuals',
    title: 'Individuals',
    body: 'Find the right support for your mind and emotional wellbeing.',
    cta: 'Explore care',
    to: '/book',
    icon: 'person',
  },
  {
    key: 'professionals',
    title: 'Professionals',
    body: 'Grow your practice with clinical tools, learning, and community.',
    cta: 'Explore for professionals',
    to: '/professionals',
    icon: 'briefcase',
  },
  {
    key: 'learners',
    title: 'Students & learners',
    body: 'Learn, upskill, and advance your career in mental health.',
    cta: 'Explore Academy',
    to: '/academy',
    icon: 'cap',
  },
];

const SERVICES = [
  { title: 'Psychiatry consultation', icon: 'stethoscope', to: '/services' },
  { title: 'Therapy & counselling', icon: 'chat', to: '/services' },
  { title: 'De-addiction support', icon: 'heart', to: '/services' },
  { title: 'Child & adolescent mental health', icon: 'person', to: '/services' },
  { title: 'Couples & relationship therapy', icon: 'people', to: '/services' },
  { title: 'Mental wellness programs', icon: 'leaf', to: '/corporate' },
];

const STEPS = [
  { title: 'Book', body: 'Choose a time that works for you.', icon: 'calendar' },
  { title: 'Connect', body: 'Meet your clinician by video, audio, or chat.', icon: 'video' },
  { title: 'Care plan', body: 'Leave with a clear next step.', icon: 'doc' },
  { title: 'Follow-up', body: 'Continue care without starting from zero.', icon: 'heart' },
];

const STORIES = BLOG_POSTS.slice(0, 4);

function Icon({ name }) {
  const p = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.7',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  const glyphs = {
    stethoscope: <><path d="M6 3.5v4a4 4 0 0 0 8 0v-4" /><path d="M10 15.5a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="11" r="1.8" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9.5 12 1.8 1.8L15 10" /></>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 1 1 8 0v3" /></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></>,
    person: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" /></>,
    people: <><circle cx="9" cy="8" r="2.8" /><circle cx="16" cy="9" r="2.3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M13 19a4.5 4.5 0 0 1 7.5-3.2" /></>,
    briefcase: <><rect x="3" y="7.5" width="18" height="12" rx="2" /><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3 12h18" /></>,
    cap: <><path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" /><path d="M7 11.5V15c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-3.5" /></>,
    chat: <><path d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" /></>,
    heart: <><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10Z" /></>,
    leaf: <><path d="M5 14c6-1 10-6 12-12-6 2-11 6-12 12Z" /><path d="M5 14c2 4 6 6 10 6" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M8 3.5V7M16 3.5V7M3.5 10h17" /></>,
    doc: <><path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z" /><path d="M14 3.5V8h4.5M9 12h6M9 15.5h4" /></>,
  };
  return <svg className="hp-icon" {...p}>{glyphs[name]}</svg>;
}

function Picture({ src, alt = '', className, width, height }) {
  return (
    <picture className={className}>
      <source srcSet={src.webp} type="image/webp" />
      <img src={src.jpg} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </picture>
  );
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
        <span>Live site unchanged →</span>
        <Link to="/">/</Link>
      </div>

      <section className="hp-hero" aria-labelledby="hp-hero-title">
        <div className="hp-hero__media" aria-hidden="true">
          <picture>
            <source srcSet={IMG.hero.webp} type="image/webp" />
            <img
              src={IMG.hero.jpg}
              alt=""
              width={1600}
              height={900}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
        <div className="hp-shell hp-hero__content">
          <p className="hp-brand">
            <span className="hp-brand__name">Serenest</span>
          </p>
          <h1 id="hp-hero-title" className="hp-hero__title">
            Mental healthcare, thoughtfully connected.
          </h1>
          <p className="hp-hero__lead">
            Care for your mind. Support for your journey. Better practice for professionals.
          </p>
          <div className="hp-hero__actions">
            <Link className="ds-btn ds-btn--primary" to="/book">
              Find your starting point
            </Link>
            <Link className="ds-btn ds-btn--ghost" to="/academy">
              Explore Serenest Academy
            </Link>
          </div>
        </div>
      </section>

      <section className="hp-trust" aria-label="Why Serenest">
        <div className="hp-shell">
          <ul className="hp-trust__grid">
            {TRUST.map((item) => (
              <li key={item.title} className="hp-trust__item">
                <span className="hp-trust__icon"><Icon name={item.icon} /></span>
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
                <span className="hp-path__icon"><Icon name={p.icon} /></span>
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
                  <Link to={s.to}>
                    <Icon name={s.icon} />
                    <span>{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="hp-text-link" to="/services">View all services</Link>
          </div>

          <aside className="hp-academy-card" aria-labelledby="hp-academy-title">
            <Picture src={IMG.academy} className="hp-academy-card__art" width={720} height={720} />
            <div className="hp-academy-card__body">
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
              <Link className="ds-btn ds-btn--teal" to="/academy">
                Explore Serenest Academy
              </Link>
            </div>
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
                <span className="hp-step__icon"><Icon name={step.icon} /></span>
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
            {STORIES.map((post, i) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className={`hp-story hp-story--${(i % 4) + 1}`}>
                <div className="hp-story__media" aria-hidden="true">
                  <Icon name={i % 2 === 0 ? 'leaf' : 'heart'} />
                </div>
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
        <div className="hp-cta__art" aria-hidden="true">
          <picture>
            <source srcSet={IMG.cta.webp} type="image/webp" />
            <img src={IMG.cta.jpg} alt="" width={1400} height={788} loading="lazy" decoding="async" />
          </picture>
        </div>
        <div className="hp-shell hp-cta__inner">
          <p className="hp-brand hp-brand--on-dark">
            <span className="hp-brand__name">Serenest</span>
          </p>
          <h2 id="hp-cta-title">
            You don&apos;t have to navigate this alone.
          </h2>
          <div className="hp-cta__actions">
            <Link className="ds-btn ds-btn--primary" to="/book">
              Book a consultation
            </Link>
            <a
              className="ds-btn ds-btn--ghost-dark"
              href="https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session%20with%20Serenest"
              target="_blank"
              rel="noreferrer"
            >
              Talk on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
