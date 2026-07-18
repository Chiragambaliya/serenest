import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { BLOG_POSTS } from '../lib/blogPosts';
import EmailCapture from '../components/EmailCapture';
import EdIcon from '../components/EdIcon';

const IMG = {
  hero: {
    webp: '/images/serenest-hero-editorial.webp',
    jpg: '/images/serenest-hero-editorial.jpg',
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

const HOME_NAV = [
  { label: 'Services', to: '/services' },
  { label: 'For Professionals', to: '/professionals' },
  { label: 'Academy', to: '/academy' },
  { label: 'Insights', to: '/blog' },
  { label: 'About', to: '/about' },
];

const TRUST = [
  { icon: 'stethoscope', title: 'Doctor-led', body: 'Built by a practising psychiatrist' },
  { icon: 'target', title: 'Evidence-based', body: 'Structured clinical workflows' },
  { icon: 'shield', title: 'Private & secure', body: 'Encrypted sessions, careful records' },
  { icon: 'monitor', title: 'Teleconsultation', body: 'Video, audio, and chat care' },
  { icon: 'heart', title: 'For individuals', body: 'Support from home across India' },
  { icon: 'people', title: 'For professionals', body: 'Practice tools and Academy' },
];

const PATHS = [
  {
    key: 'individuals',
    title: 'Individuals',
    body: 'Find the right support for your mind and emotional wellbeing.',
    cta: 'Explore care',
    to: '/book',
    icon: 'heart',
  },
  {
    key: 'professionals',
    title: 'Professionals',
    body: 'Grow your practice with resources, supervision and community.',
    cta: 'Explore for professionals',
    to: '/professionals',
    icon: 'briefcase',
  },
  {
    key: 'learners',
    title: 'Students & learners',
    body: 'Learn, upskill and advance your career in mental health.',
    cta: 'Explore Academy',
    to: '/academy',
    icon: 'cap',
  },
];

const SERVICES = [
  { title: 'Psychiatry consultation', icon: 'stethoscope', to: '/services' },
  { title: 'Therapy & counselling', icon: 'chat', to: '/services' },
  { title: 'De-addiction support', icon: 'pill', to: '/services' },
  { title: 'Child & adolescent mental health', icon: 'heart', to: '/services' },
  { title: 'Couples & relationship therapy', icon: 'people', to: '/services' },
  { title: 'Mental wellness programs', icon: 'globe', to: '/corporate' },
];

const STEPS = [
  { title: 'Book', body: 'Choose a time that works for you.', icon: 'clipboard' },
  { title: 'Connect', body: 'Meet your clinician by video, audio, or chat.', icon: 'monitor' },
  { title: 'Care plan', body: 'Leave with a clear next step.', icon: 'folder' },
  { title: 'Follow-up', body: 'Continue care without starting from zero.', icon: 'heart' },
];

const STORIES = BLOG_POSTS.slice(0, 4);
const STORY_ICONS = ['book', 'chat', 'heart', 'globe'];

function Picture({ src, alt = '', className, width, height }) {
  return (
    <picture className={className}>
      <source srcSet={src.webp} type="image/webp" />
      <img src={src.jpg} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </picture>
  );
}

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const seo = ROUTE_SEO['/'];

  useSEO({
    path: '/',
    title: seo.title,
    description: seo.description,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
  });

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  return (
    <div className="home-preview">
      <header className="hp-nav">
        <div className="hp-shell hp-nav__inner">
          <Link to="/" className="hp-nav__brand" aria-label="Serenest — Home">
            <img src="/favicon.svg" alt="" width="32" height="32" className="hp-nav__logo" />
            <span className="hp-nav__wordmark">Serenest</span>
          </Link>

          <nav className="hp-nav__links" aria-label="Main navigation">
            {HOME_NAV.map((item) => (
              <Link key={item.to} to={item.to}>{item.label}</Link>
            ))}
          </nav>

          <Link className="hp-nav__cta" to="/book">Book Consultation</Link>

          <button
            type="button"
            className={`hp-nav__menu-btn${navOpen ? ' is-open' : ''}`}
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="hp-mobile-nav"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span />
          </button>
        </div>

        {navOpen && (
          <div
            id="hp-mobile-nav"
            className="hp-nav__drawer"
            role="dialog"
            aria-label="Mobile navigation"
          >
            {HOME_NAV.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setNavOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link className="hp-nav__cta hp-nav__cta--drawer" to="/book" onClick={() => setNavOpen(false)}>
              Book Consultation
            </Link>
          </div>
        )}
      </header>

      <section className="hp-hero" aria-labelledby="hp-hero-title">
        <div className="hp-shell hp-hero__grid">
          <div className="hp-hero__copy">
            <h1 id="hp-hero-title" className="hp-hero__title">
              <span>Mental healthcare,</span>
              <span>thoughtfully</span>
              <span>connected.</span>
            </h1>
            <p className="hp-hero__support">
              Care for your mind. Support for your journey.<br />
              Better practice for professionals.
            </p>
            <p className="hp-hero__body">
              Serenest brings clinical care, professional learning and thoughtful mental health
              resources into one connected platform.
            </p>
            <div className="hp-hero__actions">
              <Link className="hp-btn hp-btn--primary" to="/book">
                Find your starting point
              </Link>
              <Link className="hp-btn hp-btn--secondary" to="/academy">
                Explore Serenest Academy
              </Link>
            </div>
            <p className="hp-hero__note">
              Serenest is not an emergency service. If there is an immediate risk of harm, contact
              local emergency services or a crisis helpline.
            </p>
          </div>

          <div className="hp-hero__visual">
            <div className="hp-hero__frame">
              <picture>
                <source srcSet={IMG.hero.webp} type="image/webp" />
                <img
                  src={IMG.hero.jpg}
                  alt="Serenest editorial illustration — abstract profile, botanical forms, and a path of progress"
                  width={960}
                  height={1080}
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      <section className="hp-trust" aria-label="Why Serenest">
        <div className="hp-shell">
          <ul className="hp-trust__grid">
            {TRUST.map((item) => (
              <li key={item.title} className="hp-trust__item">
                <span className="hp-trust__icon" aria-hidden="true">
                  <EdIcon name={item.icon} size={22} />
                </span>
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
            <p>Whether you are seeking care, building a practice, or learning — start where you are.</p>
          </header>
          <div className="hp-paths">
            {PATHS.map((p) => (
              <Link key={p.key} to={p.to} className={`hp-path hp-path--${p.key}`}>
                <span className="hp-path__icon" aria-hidden="true">
                  <EdIcon name={p.icon} size={22} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <span className="hp-path__cta">{p.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-section hp-section--soft" aria-labelledby="hp-services-title">
        <div className="hp-shell hp-split">
          <div className="hp-services-block">
            <header className="hp-section__head hp-section__head--left">
              <p className="hp-eyebrow">Care</p>
              <h2 id="hp-services-title">Our services</h2>
              <p>Clinical care pathways for individuals, families, and organisations.</p>
            </header>
            <ul className="hp-services">
              {SERVICES.map((s) => (
                <li key={s.title}>
                  <Link to={s.to}>
                    <span className="hp-services__icon" aria-hidden="true">
                      <EdIcon name={s.icon} size={20} />
                    </span>
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
              <Link className="hp-btn hp-btn--teal" to="/academy">
                Explore Serenest Academy
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="hp-section" aria-labelledby="hp-how-title">
        <div className="hp-shell">
          <header className="hp-section__head">
            <p className="hp-eyebrow">Journey</p>
            <h2 id="hp-how-title">How care works</h2>
            <p>A simple path from first booking to ongoing support.</p>
          </header>
          <ol className="hp-steps">
            {STEPS.map((step, i) => (
              <li key={step.title} className="hp-step">
                <span className="hp-step__icon" aria-hidden="true">
                  <EdIcon name={step.icon} size={20} />
                </span>
                <span className="hp-step__num">0{i + 1}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hp-section hp-section--soft" aria-labelledby="hp-stories-title">
        <div className="hp-shell">
          <header className="hp-section__head hp-section__head--row">
            <div>
              <p className="hp-eyebrow">From Serenest</p>
              <h2 id="hp-stories-title">Stories &amp; insights</h2>
            </div>
            <Link className="hp-text-link hp-text-link--inline" to="/blog">Visit all articles</Link>
          </header>
          <div className="hp-stories">
            {STORIES.map((post, i) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className={`hp-story hp-story--${(i % 4) + 1}`}>
                <div className="hp-story__media" aria-hidden="true">
                  <EdIcon name={STORY_ICONS[i % STORY_ICONS.length]} size={28} />
                </div>
                <div className="hp-story__body">
                  <span className="hp-story__tag">{post.tag}</span>
                  <h3>{post.title}</h3>
                  <p className="hp-story__excerpt">{post.excerpt}</p>
                  <p className="hp-story__meta">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-section" aria-labelledby="hp-news-title">
        <div className="hp-shell hp-newsletter">
          <div>
            <p className="hp-eyebrow">Stay informed</p>
            <h2 id="hp-news-title">Useful updates, not noise</h2>
            <p>Occasional mental-health tips and Serenest news. Unsubscribe anytime.</p>
          </div>
          <EmailCapture source="homepage_newsletter" variant="light" />
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
      </section>
    </div>
  );
}
