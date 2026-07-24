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

// "Our Services" — links point at /services until dedicated
// /services/psychiatry etc. pages exist.
const OUR_SERVICES = [
  { icon: 'stethoscope', title: 'Psychiatry', body: 'Assessment, diagnosis, and medication management from a licensed psychiatrist.', href: '/services' },
  { icon: 'chat', title: 'Therapy and Counselling', body: 'Structured talk therapy for individuals, couples, and families.', href: '/services' },
  { icon: 'pill', title: 'Addiction and Recovery', body: 'Assessment, counselling, and relapse-prevention support for substance use.', href: '/services' },
  { icon: 'monitor', title: 'Digital Mental Health', body: 'Secure video, audio, and chat consultations, wherever you are in India.', href: '/services' },
];

// "How Serenest Helps" — the care journey.
const HOW_WE_HELP = [
  { title: 'Understand your need', body: 'Start with a short self-screening or simply describe what you’re going through.' },
  { title: 'Choose the right professional', body: 'We match you with a psychiatrist, therapist, or counsellor suited to your situation.' },
  { title: 'Book your consultation', body: 'Pick a time that works. We confirm by phone or WhatsApp.' },
  { title: 'Receive ongoing care and guidance', body: 'Follow-ups, notes, and care plans stay connected after your first session.' },
];

// "Why Serenest" — grounded claims only, no unverifiable numbers.
const WHY_SERENEST = [
  { icon: 'stethoscope', title: 'Doctor-led clinical oversight', body: 'Founded and clinically overseen by a practising psychiatrist.' },
  { icon: 'lock', title: 'Ethical and confidential care', body: 'Careful handling of your health information, at every step.' },
  { icon: 'check', title: 'Clear professional boundaries', body: 'Consultations follow defined clinical and ethical limits.' },
  { icon: 'monitor', title: 'A thoughtful digital experience', body: 'Built to feel calm and unhurried, not transactional.' },
  { icon: 'follow', title: 'Coordinated psychiatry and therapy', body: 'Your psychiatrist and therapist can work from the same picture.' },
  { icon: 'heart', title: 'Responsible addiction care', body: 'Recovery support that accounts for medical and family context.' },
];

// Serenest Academy — subjects taught (preview of the full curriculum).
const ACADEMY_PREVIEW = [
  { icon: 'stethoscope', title: 'Clinical Psychiatry' },
  { icon: 'pill', title: 'Psychopharmacology' },
  { icon: 'chat', title: 'Psychotherapy' },
  { icon: 'heart', title: 'Addiction and Recovery' },
];

const RESOURCES = BLOG_POSTS.slice(0, 3);
const RESOURCE_ICONS = ['book', 'chat', 'heart'];

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
            <p className="hp-eyebrow">Doctor-led mental healthcare</p>
            <h1 id="home-hero-title" className="hp-hero__title">
              <span>Care for the mind,</span>
              <span>grounded in</span>
              <span>clinical practice.</span>
            </h1>
            <p className="hp-hero__body">
              Psychiatry, therapy, addiction support, and professional mental-health
              education — brought together with clinical responsibility and human
              understanding.
            </p>
            <div className="hp-hero__actions">
              <Link className="hp-btn hp-btn--primary" to="/services">
                Find the Right Service
              </Link>
              <Link className="hp-btn hp-btn--secondary" to="/book">
                Book an Appointment
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
                  alt="A quiet illustrated scene of someone reading by a window, a plant and a cup of tea nearby"
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

      {/* ── Our Services ─────────────────────────────────────────── */}
      <section className="hp-section" aria-labelledby="home-services-title">
        <div className="hp-shell">
          <header className="hp-section__head">
            <p className="hp-eyebrow">Our Services</p>
            <h2 id="home-services-title">Four kinds of support, one clinical team.</h2>
          </header>
          <div className="hp-ecosystem">
            {OUR_SERVICES.map((item) => (
              <Link key={item.title} className="hp-ecosystem__card" to={item.href}>
                <span className="hp-services__icon" aria-hidden="true"><EdIcon name={item.icon} size={22} /></span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Serenest Helps ──────────────────────────────────── */}
      <section className="hp-section hp-section--soft" aria-labelledby="home-how-title">
        <div className="hp-shell">
          <header className="hp-section__head">
            <p className="hp-eyebrow">How Serenest Helps</p>
            <h2 id="home-how-title">A care journey, not a one-off appointment.</h2>
          </header>
          <ol className="hp-steps">
            {HOW_WE_HELP.map((step, i) => (
              <li key={step.title} className="hp-step">
                <span className="hp-step__num">0{i + 1}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Why Serenest ─────────────────────────────────────────── */}
      <section className="hp-trust" aria-label="Why Serenest">
        <div className="hp-shell">
          <ul className="hp-trust__grid">
            {WHY_SERENEST.map((item) => (
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

      {/* ── For Professionals ────────────────────────────────────── */}
      <section className="hp-section" aria-labelledby="home-professionals-title">
        <div className="hp-shell hp-split">
          <div className="hp-services-block">
            <header className="hp-section__head hp-section__head--left">
              <p className="hp-eyebrow">For Professionals</p>
              <h2 id="home-professionals-title">Learning and resources for people shaping mental healthcare.</h2>
            </header>
            <ul className="hp-services">
              <li>
                <Link to="/academy">
                  <span className="hp-services__icon" aria-hidden="true"><EdIcon name="cap" size={20} /></span>
                  <span>Serenest Academy</span>
                </Link>
              </li>
              <li>
                <Link to="/professionals/resources">
                  <span className="hp-services__icon" aria-hidden="true"><EdIcon name="folder" size={20} /></span>
                  <span>Clinical resources</span>
                </Link>
              </li>
              <li>
                <Link to="/partner">
                  <span className="hp-services__icon" aria-hidden="true"><EdIcon name="people" size={20} /></span>
                  <span>Professional collaboration</span>
                </Link>
              </li>
              <li>
                <Link to="/professionals/apply">
                  <span className="hp-services__icon" aria-hidden="true"><EdIcon name="briefcase" size={20} /></span>
                  <span>Faculty opportunities</span>
                </Link>
              </li>
            </ul>
            <Link className="hp-text-link" to="/professionals">For Professionals</Link>
          </div>

          <aside className="hp-academy-card" aria-labelledby="home-academy-title">
            <picture className="hp-academy-card__art">
              <source srcSet={IMG.academy.webp} type="image/webp" />
              <img src={IMG.academy.jpg} alt="" width={720} height={720} loading="lazy" decoding="async" />
            </picture>
            <div className="hp-academy-card__body">
              <p className="hp-eyebrow">Serenest Academy</p>
              <h2 id="home-academy-title">Learning that strengthens practice.</h2>
              <p>Practical, clinically grounded education for mental health professionals.</p>
              <ul className="hp-academy-list">
                {ACADEMY_PREVIEW.map((a) => (
                  <li key={a.title}>{a.title}</li>
                ))}
              </ul>
              <div className="hp-hero__actions">
                <Link className="hp-btn hp-btn--teal" to="/academy">Explore Academy</Link>
                <Link className="hp-text-link" to="/academy">View Programs</Link>
              </div>
            </div>
          </aside>
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

      {/* ── Resources ────────────────────────────────────────────── */}
      <section className="hp-section hp-section--soft" aria-labelledby="home-resources-title">
        <div className="hp-shell">
          <header className="hp-section__head hp-section__head--row">
            <div>
              <p className="hp-eyebrow">Resources</p>
              <h2 id="home-resources-title">A few things worth reading</h2>
            </div>
            <Link className="hp-text-link hp-text-link--inline" to="/blog">Visit all articles</Link>
          </header>
          <div className="hp-stories">
            {RESOURCES.map((post, i) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className={`hp-story hp-story--${(i % 4) + 1}`}>
                <div className="hp-story__media" aria-hidden="true">
                  <EdIcon name={RESOURCE_ICONS[i % RESOURCE_ICONS.length]} size={28} />
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

      {/* ── Final action ────────────────────────────────────────── */}
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
            Start with the kind of support you need.
          </h2>
          <p className="hp-cta__contact">
            <a href="mailto:support@serenest.in">support@serenest.in</a>
            <span aria-hidden="true"> · </span>
            <a href="tel:7777936367">7777936367</a>
          </p>
          <div className="hp-cta__actions">
            <Link className="hp-btn hp-btn--primary" to="/services">
              Explore Services
            </Link>
            <Link className="hp-btn hp-btn--ghost-dark" to="/book">
              Book an Appointment
            </Link>
          </div>
          <SharePanel className="hp-cta__share" />
        </div>
      </section>
    </div>
  );
}
