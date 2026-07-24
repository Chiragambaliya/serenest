import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { HOME_FEATURED_GUIDES } from '../lib/guides';
import { BLOG_POSTS } from '../lib/blogPosts';
import EdIcon from '../components/EdIcon';
import { useAuth } from '../lib/useAuth';
import EmailCapture from '../components/EmailCapture';
import SharePanel from '../components/SharePanel';
import InstagramFeed from '../components/InstagramFeed';

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

const STATS = [
  { value: '10,000+', label: 'Community followers' },
  { value: '500+', label: 'Sessions completed' },
  { value: '4.9 ★', label: 'Average rating' },
  { value: '15+', label: 'Verified professionals' },
];

const TRUST = [
  { icon: 'check', title: 'Verified clinicians', body: 'Psychiatrists & psychologists reviewed before joining' },
  { icon: 'monitor', title: 'Video, audio, chat', body: 'Consult in whichever format works for you' },
  { icon: 'clipboard', title: 'PHQ-9 / GAD-7', body: 'Structured screening tools before you book' },
  { icon: 'follow', title: 'Continuity of care', body: 'Notes and follow-ups stay connected' },
  { icon: 'lock', title: 'Private by design', body: 'Encrypted sessions, careful records' },
  { icon: 'people', title: 'For professionals', body: 'Practice tools and free Academy access' },
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

const ECOSYSTEM = [
  {
    icon: 'stethoscope',
    title: 'Mental Healthcare Services',
    body: 'Verified psychiatrists and psychologists for video, audio, and chat consultations.',
    href: '/services',
  },
  {
    icon: 'cap',
    title: 'Serenest Academy',
    body: 'Clinically oriented education and certificate programs for the mental health workforce.',
    href: '/academy',
  },
  {
    icon: 'building',
    title: 'Corporate Mental Wellness',
    body: 'Workplace programmes and EAP-style support for organisations.',
    href: '/corporate',
  },
  {
    icon: 'pill',
    title: 'De-addiction & Rehabilitation',
    body: 'Structured recovery support and continuity of care.',
    href: '/services',
  },
  {
    icon: 'globe',
    title: 'Digital Mental Health Solutions',
    body: 'Telepsychiatry infrastructure and tools built for Indian care delivery.',
    href: '/services',
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
  { title: 'Choose your format', body: 'Video, audio, or chat — or begin with screening if you are unsure.', icon: 'clipboard' },
  { title: 'Pick a time', body: 'Share your details. We confirm your clinician and next steps with you.', icon: 'monitor' },
  { title: 'Meet your clinician', body: 'Assessment, guidance, and a clear plan for follow-up where needed.', icon: 'folder' },
  { title: 'Continue your care', body: 'Follow-ups and care plans in one place so treatment does not stop.', icon: 'heart' },
];

const STORIES = BLOG_POSTS.slice(0, 4);
const STORY_ICONS = ['book', 'chat', 'heart', 'globe'];

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });

  const { user, loading: authLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (authLoading || user) return;
    if (localStorage.getItem('serenest_portal_seen')) return;
    // Don't interrupt first paint — wait longer so Book CTAs stay tappable.
    const t = setTimeout(() => setModalOpen(true), 4500);
    return () => clearTimeout(t);
  }, [authLoading, user]);

  function closeModal() {
    localStorage.setItem('serenest_portal_seen', '1');
    setModalOpen(false);
  }

  return (
    <div className="home">

      {/* ── First-visit welcome modal ──────────────────────────── */}
      {modalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(28,26,23,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={closeModal}
        >
          <div
            style={{ background: 'var(--surface)', borderRadius: 18, padding: '2rem', maxWidth: 420, width: '100%', position: 'relative', boxShadow: 'var(--shadow-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', fontSize: '1.15rem', cursor: 'pointer', color: 'var(--muted)', lineHeight: 1 }}
            >
              ✕
            </button>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--teal-600)', marginBottom: 8 }}>
              Patient portal
            </p>
            <h2 style={{ fontWeight: 700, fontSize: '1.45rem', marginBottom: 8, lineHeight: 1.25, fontFamily: 'var(--font-heading)' }}>
              Track your care journey
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '0.92rem', lineHeight: 1.6 }}>
              Create a free account to view your appointments, access prescriptions, and manage your mental health care — all in one place.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/book" onClick={closeModal} className="btn btn-primary btn-full">
                Book an appointment →
              </Link>
              <Link to="/patient/login" state={{ mode: 'signup' }} onClick={closeModal} className="btn btn-ghost btn-full">
                Create a free account
              </Link>
              <Link to="/patient/login" state={{ mode: 'login' }} onClick={closeModal} className="btn btn-ghost btn-full">
                Sign in to my account
              </Link>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.86rem', padding: '6px 0' }}
              >
                Continue browsing →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="hp-hero" aria-labelledby="home-hero-title">
        <div className="hp-shell hp-hero__grid">
          <div className="hp-hero__copy">
            <p className="hp-eyebrow">Serenest · Pan-India telepsychiatry</p>
            <h1 id="home-hero-title" className="hp-hero__title">
              <span>Private, clinical</span>
              <span>mental health care —</span>
              <span>wherever you are.</span>
            </h1>
            <p className="hp-hero__body">
              Speak with verified psychiatrists and psychologists from home. Structured intake,
              evidence-based screening, and care that continues beyond a single session.
            </p>
            <div className="hp-hero__actions">
              <Link className="hp-btn hp-btn--primary" to="/book">
                Book now
              </Link>
              <Link className="hp-btn hp-btn--secondary" to="/screening">
                Take screening
              </Link>
            </div>
            <p className="hp-hero__note">
              Not for emergencies. If you or someone else is at immediate risk, contact local
              emergency services or a crisis helpline.
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
                  fetchpriority="high"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof stats ──────────────────────────────────── */}
      <section className="hp-stats" aria-label="Serenest by the numbers">
        <div className="hp-shell hp-stats__grid">
          {STATS.map((s) => (
            <div key={s.label} className="hp-stats__item">
              <div className="hp-stats__value">{s.value}</div>
              <div className="hp-stats__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust / what you get ───────────────────────────────── */}
      <section className="hp-trust" aria-label="What Serenest includes">
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

      {/* ── Choose your path ────────────────────────────────────── */}
      <section className="hp-section" aria-labelledby="home-paths-title">
        <div className="hp-shell">
          <header className="hp-section__head">
            <p className="hp-eyebrow">Start here</p>
            <h2 id="home-paths-title">Choose your path</h2>
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

      {/* ── Ecosystem ───────────────────────────────────────────── */}
      <section className="hp-section hp-section--soft" id="ecosystem">
        <div className="hp-shell">
          <header className="hp-section__head">
            <p className="hp-eyebrow">Serenest Ecosystem</p>
            <h2>One brand. Care, education, and wellness together.</h2>
            <p>Mental healthcare services, professional education, corporate wellness, de-addiction
              support, and digital health infrastructure — all under Serenest.</p>
          </header>
          <div className="hp-ecosystem">
            {ECOSYSTEM.map((item) => (
              <Link key={item.title} className="hp-ecosystem__card" to={item.href}>
                <span className="hp-services__icon" aria-hidden="true"><EdIcon name={item.icon} size={22} /></span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services + Academy ─────────────────────────────────── */}
      <section className="hp-section" aria-labelledby="home-services-title">
        <div className="hp-shell hp-split">
          <div className="hp-services-block">
            <header className="hp-section__head hp-section__head--left">
              <p className="hp-eyebrow">Care</p>
              <h2 id="home-services-title">Our services</h2>
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

          <aside className="hp-academy-card" aria-labelledby="home-academy-title">
            <picture className="hp-academy-card__art">
              <source srcSet={IMG.academy.webp} type="image/webp" />
              <img src={IMG.academy.jpg} alt="" width={720} height={720} loading="lazy" decoding="async" />
            </picture>
            <div className="hp-academy-card__body">
              <p className="hp-eyebrow">Education</p>
              <h2 id="home-academy-title">Serenest Academy</h2>
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

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="hp-section hp-section--soft" aria-labelledby="home-how-title">
        <div className="hp-shell">
          <header className="hp-section__head">
            <p className="hp-eyebrow">Journey</p>
            <h2 id="home-how-title">How care works</h2>
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

      {/* ── Patient portal strip ────────────────────────────────── */}
      <section className="hp-portal" aria-label="Patient portal">
        <div className="hp-shell hp-portal__inner">
          <div>
            <p className="hp-eyebrow">Patient portal</p>
            <h2>Your care, all in one place</h2>
            <p>View your appointments, access prescriptions, and manage your mental health journey after every session.</p>
          </div>
          <div className="hp-portal__actions">
            {user ? (
              <Link className="btn btn-primary btn-lg" to="/patient/dashboard">
                View my bookings
              </Link>
            ) : (
              <>
                <Link className="btn btn-primary btn-lg" to="/patient/login" state={{ mode: 'signup' }}>
                  Create free account
                </Link>
                <Link className="btn btn-ghost btn-lg" to="/patient/login" state={{ mode: 'login' }}>
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Stories & insights ──────────────────────────────────── */}
      <section className="hp-section hp-section--soft" aria-labelledby="home-stories-title">
        <div className="hp-shell">
          <header className="hp-section__head hp-section__head--row">
            <div>
              <p className="hp-eyebrow">From Serenest</p>
              <h2 id="home-stories-title">Stories &amp; insights</h2>
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

      {/* ── Guides ──────────────────────────────────────────────── */}
      <section className="hp-section" id="topics">
        <div className="hp-shell">
          <header className="hp-section__head">
            <p className="hp-eyebrow">Guides</p>
            <h2>Common reasons people come to Serenest</h2>
            <p>
              <Link className="hp-text-link" to="/guides">View all guides</Link>
            </p>
          </header>
          <div className="hp-topics">
            {HOME_FEATURED_GUIDES.map((t) => (
              <Link key={t.path} className="hp-topic" to={t.path}>
                {t.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ──────────────────────────────────────────── */}
      <section className="hp-section" aria-labelledby="home-news-title">
        <div className="hp-shell hp-newsletter">
          <div>
            <p className="hp-eyebrow">Stay informed</p>
            <h2 id="home-news-title">Useful updates, not noise</h2>
            <p>Occasional mental-health tips and Serenest news. Unsubscribe anytime.</p>
          </div>
          <EmailCapture source="homepage_newsletter" variant="light" />
        </div>
      </section>

      <InstagramFeed />

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className="hp-cta" aria-labelledby="home-cta-title">
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
          <h2 id="home-cta-title">
            You don&apos;t have to navigate this alone. We&apos;re here to walk alongside you.
          </h2>
          <p className="hp-cta__contact">
            <a href="mailto:support@serenest.in">support@serenest.in</a>
            <span aria-hidden="true"> · </span>
            <a href="tel:7777936367">7777936367</a>
          </p>
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
          <SharePanel className="hp-cta__share" />
        </div>
      </section>
    </div>
  );
}
