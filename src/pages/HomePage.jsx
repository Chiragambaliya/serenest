import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { HOME_FEATURED_GUIDES } from '../lib/guides';
import { BLOG_POSTS } from '../lib/blogPosts';
import { useAuth } from '../lib/useAuth';
import EmailCapture from '../components/EmailCapture';
import SharePanel from '../components/SharePanel';
import InstagramFeed from '../components/InstagramFeed';
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
    body: 'Secure video, audio, and chat consultations, wherever you are in India.',
    href: '/services/digital-consultations',
  },
];

const HOW_WE_HELP = [
  {
    stage: '01 · Begin',
    title: 'Understand your need',
    body: 'Start with a short self-screening or simply describe what you’re going through.',
  },
  {
    stage: '02 · Match',
    title: 'Choose the right professional',
    body: 'We match you with a psychiatrist, therapist, or counsellor suited to your situation.',
  },
  {
    stage: '03 · Book',
    title: 'Book your consultation',
    body: 'Pick a time that works. We confirm by phone or WhatsApp.',
  },
  {
    stage: '04 · Continue',
    title: 'Receive ongoing care and guidance',
    body: 'Follow-ups, notes, and care plans stay connected after your first session.',
  },
];

const WHY_SERENEST = [
  { title: 'Doctor-led clinical oversight', body: 'Founded and clinically overseen by a practising psychiatrist.' },
  { title: 'Ethical and confidential care', body: 'Careful handling of your health information, at every step.' },
  { title: 'Clear professional boundaries', body: 'Consultations follow defined clinical and ethical limits.' },
  { title: 'A thoughtful digital experience', body: 'Built to feel calm and unhurried, not transactional.' },
  { title: 'Coordinated psychiatry and therapy', body: 'Your psychiatrist and therapist can work from the same picture.' },
  { title: 'Responsible addiction care', body: 'Recovery support that accounts for medical and family context.' },
];

const PRO_DESTINATIONS = [
  { title: 'Serenest Academy', body: 'Practical, clinically grounded education for mental health professionals.', href: '/academy' },
  { title: 'Clinical resources', body: 'Guidelines, documentation patterns, and practice references.', href: '/professionals/resources' },
  { title: 'Professional collaboration', body: 'Join the clinical network or partner as a clinic.', href: '/partner' },
  { title: 'Faculty opportunities', body: 'Teach where clinical practice and education meet.', href: '/professionals/apply' },
];

const RESOURCES = BLOG_POSTS.slice(0, 3);

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });

  const { user, loading: authLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (authLoading || user) return;
    if (localStorage.getItem('serenest_portal_seen')) return;
    const t = setTimeout(() => setModalOpen(true), 4500);
    return () => clearTimeout(t);
  }, [authLoading, user]);

  function closeModal() {
    localStorage.setItem('serenest_portal_seen', '1');
    setModalOpen(false);
  }

  return (
    <div className="home">

      {modalOpen && (
        <div
          className="hp-modal-backdrop"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="hp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portal-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="hp-modal__close"
            >
              ✕
            </button>
            <p className="ed-mono">Patient portal</p>
            <h2 id="portal-modal-title">Track your care journey</h2>
            <p>
              Create a free account to view your appointments, access prescriptions, and manage your mental health care — all in one place.
            </p>
            <div className="hp-modal__actions">
              <Link to="/book" onClick={closeModal} className="btn btn-primary btn-full">
                Book an appointment →
              </Link>
              <Link to="/patient/login" state={{ mode: 'signup' }} onClick={closeModal} className="btn btn-ghost btn-full">
                Create a free account
              </Link>
              <Link to="/patient/login" state={{ mode: 'login' }} onClick={closeModal} className="btn btn-ghost btn-full">
                Sign in to my account
              </Link>
              <button type="button" onClick={closeModal} className="hp-modal__dismiss">
                Continue browsing →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero — brand-first, one composition, full-bleed media plane */}
      <section className="hp-hero" aria-labelledby="home-hero-title">
        <div className="ed-shell ed-facing">
          <div className="hp-hero__copy">
            <p className="hp-brand-mark">
              <span className="hp-brand-mark__name">Serenest</span>
              <span className="hp-brand-mark__meta ed-mono">Mental health · Clinical practice · Academy</span>
            </p>
            <h1 id="home-hero-title" className="hp-hero__title">
              Care for the mind, grounded in clinical practice.
            </h1>
            <p className="hp-hero__body ed-measure">
              Psychiatry, therapy, addiction support, and professional mental-health
              education — brought together with clinical responsibility and human
              understanding.
            </p>
            <div className="hp-hero__actions">
              <Link className="btn btn-primary btn-lg" to="/services">
                Find the right service
              </Link>
              <Link className="btn btn-ghost btn-lg" to="/book">
                Book an appointment
              </Link>
            </div>
            <p className="hp-hero__note">
              Not for emergencies. If you or someone else is at immediate risk, contact local
              emergency services or a crisis helpline.
            </p>
          </div>

          <figure className="hp-hero__visual">
            <ImagePlaceholder
              asset="home-hero-patient-consultation.jpg"
              direction="Quiet consulting room in warm daylight — empty chairs, a side table, a window. No people."
            />
            <figcaption className="ed-mono">Consulting room · Rajkot practice context</figcaption>
          </figure>
        </div>
      </section>

      {/* Services — numbered editorial index, not icon rows */}
      <section className="ed-pace" aria-labelledby="home-services-title">
        <div className="ed-shell">
          <header className="ed-head">
            <span className="ed-head__label">Care</span>
            <h2 id="home-services-title">Four kinds of support, one clinical team.</h2>
            <p>Choose a starting point. Your clinician can help redirect if another service fits better.</p>
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

      {/* Journey — timeline on a soft band */}
      <section className="ed-pace ed-band-soft" aria-labelledby="home-how-title">
        <div className="ed-shell ed-facing">
          <header className="ed-head">
            <span className="ed-head__label">How care begins</span>
            <h2 id="home-how-title">A care journey, not a one-off appointment.</h2>
            <p>From first contact to ongoing follow-up — the same clinical thread.</p>
          </header>
          <ol className="ed-timeline">
            {HOW_WE_HELP.map((step) => (
              <li key={step.title}>
                <span className="ed-timeline__stage">{step.stage}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why — ruled comparison table, no icon circles */}
      <section className="ed-pace" aria-labelledby="home-why-title">
        <div className="ed-shell">
          <div className="ed-aside">
            <p className="ed-aside__label">Why Serenest</p>
            <div>
              <h2 id="home-why-title" className="ed-measure" style={{ marginBottom: '1.5rem' }}>
                Clinical standards first. Interface second.
              </h2>
              <table className="ed-table">
                <caption className="ed-mono" style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>
                  Commitments that shape every consultation
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Principle</th>
                    <th scope="col">What it means in practice</th>
                  </tr>
                </thead>
                <tbody>
                  {WHY_SERENEST.map((item) => (
                    <tr key={item.title}>
                      <th scope="row">{item.title}</th>
                      <td>{item.body}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Professionals + Academy — facing columns, pull quote, not a rounded promo card */}
      <section className="ed-pace ed-band-soft" aria-labelledby="home-professionals-title">
        <div className="ed-shell ed-facing">
          <div>
            <header className="ed-head">
              <span className="ed-head__label">For professionals</span>
              <h2 id="home-professionals-title">Learning and resources for people shaping mental healthcare.</h2>
            </header>
            <div className="ed-index">
              {PRO_DESTINATIONS.map((item, i) => (
                <Link key={item.title} to={item.href} className="ed-index__row">
                  <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <h3 className="ed-index__title">{item.title}</h3>
                  </span>
                  <p className="ed-index__body">{item.body}</p>
                  <span className="ed-index__go">Open →</span>
                </Link>
              ))}
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link className="ed-link" to="/professionals">Overview for clinicians</Link>
            </p>
          </div>
          <aside>
            <blockquote className="ed-pull">
              <p>“Education is not just information. It is transformation in practice.”</p>
              <cite>Serenest Academy</cite>
            </blockquote>
            <p className="ed-aside__note" style={{ marginTop: '1.5rem' }}>
              Practical courses for psychiatrists, therapists, counsellors, and trainees —
              designed beside a working clinical service, not apart from it.
            </p>
            <p style={{ marginTop: '1.25rem' }}>
              <Link className="btn btn-primary" to="/academy">Visit the Academy</Link>
            </p>
          </aside>
        </div>
      </section>

      {/* Patient portal — quiet full-width band, one job */}
      <section className="ed-band" aria-label="Patient portal">
        <div className="ed-shell ed-facing">
          <div>
            <p className="ed-mono" style={{ color: 'rgba(255,255,255,0.65)' }}>Patient portal</p>
            <h2 style={{ marginTop: '0.75rem', maxWidth: '16ch' }}>Your care, all in one place</h2>
            <p style={{ maxWidth: '36ch', marginTop: '0.75rem' }}>
              View appointments, access prescriptions, and manage your mental health journey after every session.
            </p>
          </div>
          <div className="hp-hero__actions" style={{ alignSelf: 'end' }}>
            {user ? (
              <Link className="btn btn-ghost-dark btn-lg" to="/patient/dashboard">
                View my bookings
              </Link>
            ) : (
              <>
                <Link className="btn btn-ghost-dark btn-lg" to="/patient/login" state={{ mode: 'signup' }}>
                  Create free account
                </Link>
                <Link className="btn btn-ghost-dark btn-lg" to="/patient/login" state={{ mode: 'login' }}>
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Resources — index rows, not pastel cards */}
      <section className="ed-pace" aria-labelledby="home-resources-title">
        <div className="ed-shell">
          <header className="ed-head ed-head--wide">
            <span className="ed-head__label">Reading</span>
            <h2 id="home-resources-title">A few things worth reading</h2>
            <p>
              <Link className="ed-link" to="/blog">Visit all articles</Link>
            </p>
          </header>
          <div className="ed-index">
            {RESOURCES.map((post, i) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="ed-index__row">
                <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{post.title}</h3>
                  <span className="ed-index__meta">{post.tag} · {post.date}</span>
                </span>
                <p className="ed-index__body">{post.excerpt}</p>
                <span className="ed-index__go">Read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guides — ruled list, not pills */}
      <section className="ed-pace ed-band-soft" id="topics" aria-labelledby="home-guides-title">
        <div className="ed-shell ed-facing--narrow-wide ed-facing">
          <div>
            <p className="ed-aside__label">Guides</p>
            <h2 id="home-guides-title" style={{ marginTop: '0.75rem' }}>
              Common reasons people come to Serenest
            </h2>
            <p style={{ marginTop: '0.75rem' }}>
              <Link className="ed-link" to="/guides">View all guides</Link>
            </p>
          </div>
          <div className="ed-index">
            {HOME_FEATURED_GUIDES.map((t, i) => (
              <Link key={t.path} className="ed-index__row" to={t.path}>
                <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{t.title}</h3>
                </span>
                <span className="ed-index__go">Open →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="ed-pace-tight" aria-labelledby="home-news-title">
        <div className="ed-shell ed-facing">
          <div>
            <p className="ed-mono">Stay informed</p>
            <h2 id="home-news-title" style={{ marginTop: '0.5rem' }}>Useful updates, not noise</h2>
            <p className="ed-measure" style={{ marginTop: '0.5rem', color: 'var(--muted)' }}>
              Occasional mental-health tips and Serenest news. Unsubscribe anytime.
            </p>
          </div>
          <EmailCapture source="homepage_newsletter" variant="light" />
        </div>
      </section>

      <InstagramFeed />

      {/* Final action */}
      <section className="ed-band" aria-labelledby="home-cta-title">
        <div className="ed-shell">
          <p className="hp-brand-mark hp-brand-mark--on-dark">
            <span className="hp-brand-mark__name">Serenest</span>
          </p>
          <h2 id="home-cta-title" style={{ maxWidth: '18ch', marginTop: '1rem' }}>
            Start with the kind of support you need.
          </h2>
          <p className="hp-cta__contact" style={{ marginTop: '1rem' }}>
            <a href="mailto:support@serenest.in">support@serenest.in</a>
            <span aria-hidden="true"> · </span>
            <a href="tel:7777936367">7777936367</a>
          </p>
          <div className="hp-hero__actions" style={{ marginTop: '1.75rem' }}>
            <Link className="btn btn-ghost-dark btn-lg" to="/services">
              Explore services
            </Link>
            <Link className="btn btn-ghost-dark btn-lg" to="/book">
              Book an appointment
            </Link>
          </div>
          <SharePanel className="hp-cta__share" />
        </div>
      </section>
    </div>
  );
}
