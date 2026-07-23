import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { signOut } from '../lib/useAuth';
import { useProfessionalAccess } from '../lib/useProfessionalAccess';
import {
  ACADEMY_PROGRAMS,
  ACADEMY_CATEGORIES,
  ACADEMY_JOURNEY,
  ACADEMY_PATHS,
  ACADEMY_WHY,
  ACADEMY_FAQ,
  FEATURED_PROGRAMS,
} from '../lib/academyPrograms';
import EdIcon from '../components/EdIcon';
import AcademyGuide from '../components/AcademyGuide';
import { academyContent } from '../lib/api';
import '../styles/academy.css';

const HERO_IMG = '/images/editorial/serenest-academy-books.webp';
const HERO_IMG_FALLBACK = '/images/editorial/serenest-academy-books.jpg';

const INSTRUCTOR_MAILTO =
  'mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20Become%20an%20Instructor';

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`eda-faq-item${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="eda-faq-q"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="eda-faq-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="eda-faq-a">{a}</p>}
    </div>
  );
}

const TYPE_COLORS = {
  announcement: { bg: '#e8f2ef', text: '#1a4d42', dot: '#2f7d6a' },
  program_update: { bg: '#eef4e8', text: '#3c4a2c', dot: '#5a6b4a' },
  event: { bg: '#f3eee6', text: '#5c4a32', dot: '#8a6d45' },
};

export default function AcademyPage() {
  useSEO({ path: '/academy', ...ROUTE_SEO['/academy'] });
  const { user, professional, isProfessional } = useProfessionalAccess();
  const firstName = (
    professional?.full_name
    || user?.user_metadata?.full_name
    || user?.email
    || ''
  ).split(/[\s@]/)[0];

  const [liveContent, setLiveContent] = useState([]);
  useEffect(() => {
    academyContent.list().then((r) => setLiveContent(r.content ?? [])).catch(() => {});
  }, []);

  const pinnedItems = liveContent.filter((c) => c.pinned);
  const regularItems = liveContent.filter((c) => !c.pinned);
  const flagship = FEATURED_PROGRAMS[0];

  return (
    <div className="eda-page">

      {/* ══ HERO — one composition: brand, headline, lead, CTAs, full-bleed image */}
      <section className="eda-hero" aria-label="Serenest Academy">
        <div className="eda-hero__media" aria-hidden="true">
          <picture>
            <source srcSet={HERO_IMG} type="image/webp" />
            <img src={HERO_IMG_FALLBACK} alt="" />
          </picture>
          <div className="eda-hero__veil" />
        </div>

        <div className="container eda-hero__inner">
          <nav className="eda-hero-topbar" aria-label="Academy header">
            <Link to="/academy" className="eda-brand">
              <span className="eda-brand-mark" aria-hidden="true" />
              <span className="eda-brand-name">Serenest Academy</span>
            </Link>
            <div className="eda-hero-auth">
              <Link className="eda-btn eda-btn-ghost" to="/">Serenest care</Link>
              {user ? (
                <>
                  <span className="eda-hero-greeting">Hi, {firstName}</span>
                  <button type="button" className="eda-btn eda-btn-ghost" onClick={() => signOut()}>
                    Log out
                  </button>
                </>
              ) : (
                <Link className="eda-btn eda-btn-ghost" to="/academy/login">Log in / Sign up</Link>
              )}
            </div>
          </nav>

          <div className="eda-hero__copy eda-reveal">
            <p className="eda-brand-hero">Serenest Academy</p>
            <h1 className="eda-hero-h1">
              Clinical learning for mind <em>&amp; practice</em>
            </h1>
            <p className="eda-hero-lead">
              Flagship training for mental health professionals — plus pathways for students,
              CPD, and organisations. Evidence-led. India-ready.
            </p>
            {isProfessional ? (
              <p className="eda-pro-free-banner" role="status">
                <strong>Free for Serenest professionals.</strong>{' '}
                Your approved practice account includes Academy at no charge.
              </p>
            ) : null}
            <div className="eda-hero-actions">
              <Link
                className="eda-btn eda-btn-primary eda-btn-lg"
                to="/academy/program/clinical-excellence"
              >
                Clinical Excellence
              </Link>
              <a className="eda-btn eda-btn-outline eda-btn-lg" href="#programs">
                All programmes
              </a>
            </div>
            <p className="eda-hero-note">
              Education only — not emergency care. In crisis, dial 112 / 108.
            </p>
          </div>
        </div>
      </section>

      {/* ══ INNER NAV */}
      <nav className="eda-inner-nav" aria-label="Jump to section">
        <div className="container">
          <div className="eda-inner-nav-links">
            {[
              ['#flagship', 'Flagship'],
              ['#paths', 'Paths'],
              ['#programs', 'Programmes'],
              ['#guide', 'Guide'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="eda-inner-nav-link">{label}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* ══ LIVE UPDATES */}
      {liveContent.length > 0 && (
        <section className="eda-updates" aria-label="Latest updates">
          <div className="container">
            {pinnedItems.length > 0 && (
              <div className="eda-pinned-banner">
                <span className="eda-pinned-tag">Pinned</span>
                <div className="eda-pinned-body">
                  <strong>{pinnedItems[0].title}</strong>
                  {pinnedItems[0].body && (
                    <span className="eda-pinned-text"> — {pinnedItems[0].body}</span>
                  )}
                  {pinnedItems[0].link && (
                    <a href={pinnedItems[0].link} className="eda-pinned-link">
                      {pinnedItems[0].link_label || 'Learn more'} →
                    </a>
                  )}
                </div>
              </div>
            )}
            {regularItems.length > 0 && (
              <div className="eda-updates-grid">
                <h2 className="eda-updates-heading">Latest from the Academy</h2>
                <div className="eda-updates-list">
                  {regularItems.map((item) => {
                    const colors = TYPE_COLORS[item.type] ?? TYPE_COLORS.announcement;
                    return (
                      <div
                        key={item.id}
                        className="eda-update-card"
                        style={{
                          '--uda-bg': colors.bg,
                          '--uda-text': colors.text,
                          '--uda-dot': colors.dot,
                        }}
                      >
                        <span className="eda-update-dot" aria-hidden="true" />
                        <div className="eda-update-body">
                          <p className="eda-update-title">{item.title}</p>
                          {item.body && <p className="eda-update-desc">{item.body}</p>}
                          {item.link && (
                            <a href={item.link} className="eda-update-link">
                              {item.link_label || 'Learn more'} →
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══ FLAGSHIP */}
      {flagship && (
        <section id="flagship" className="eda-section">
          <div className="container">
            <article className="eda-flagship eda-reveal">
              <div className="eda-flagship-copy">
                <p className="eda-flagship-kicker">Best for practicing professionals</p>
                <h2 className="eda-flagship-title">{flagship.title}</h2>
                <p className="eda-flagship-lead">{flagship.overview}</p>
                <ul className="eda-flagship-points">
                  {(flagship.highlights || []).map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <div className="eda-flagship-actions">
                  <Link className="eda-btn eda-btn-primary" to={`/academy/program/${flagship.slug}`}>
                    {flagship.ctaLabel} →
                  </Link>
                  <span className="eda-flagship-meta">{flagship.format}</span>
                </div>
              </div>
              <div className="eda-flagship-side" aria-label="Course snapshot">
                {flagship.metrics.map((m) => (
                  <div key={m.sub} className="eda-flagship-metric">
                    <span className="eda-flagship-metric-top">{m.top}</span>
                    <span className="eda-flagship-metric-sub">{m.sub}</span>
                  </div>
                ))}
                <p className="eda-flagship-free">Free for approved Serenest professionals</p>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* ══ PATHS */}
      <section id="paths" className="eda-section eda-section-alt">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">Who we serve</p>
            <h2 className="eda-section-h2">One academy. Three clear paths.</h2>
            <p className="eda-section-sub">
              Choose the path that matches your role — then dive into programmes built for that stage.
            </p>
          </div>
          <div className="eda-path-grid">
            {ACADEMY_PATHS.map((p) => (
              <article key={p.title} className="eda-path">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                {p.href.startsWith('#') || p.href.startsWith('http') || p.href.startsWith('mailto') ? (
                  <a href={p.href}>{p.cta} →</a>
                ) : (
                  <Link to={p.href}>{p.cta} →</Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY */}
      <section className="eda-section">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">Why Serenest Academy</p>
            <h2 className="eda-section-h2">Competence that scales beyond the clinic</h2>
          </div>
          <div className="eda-why-grid">
            {ACADEMY_WHY.map((w) => (
              <div key={w.title} className="eda-why-item">
                <h3 className="eda-why-title">{w.title}</h3>
                <p className="eda-why-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROGRAMMES */}
      <section id="programs" className="eda-section eda-section-alt">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">Programmes</p>
            <h2 className="eda-section-h2">Build your mental health career</h2>
            <p className="eda-section-sub">
              From student to specialist — structured programmes at every stage of your journey.
            </p>
          </div>

          <div className="eda-roadmap" role="list" aria-label="Learning journey">
            {ACADEMY_JOURNEY.map((step, i) => (
              <div key={step.title} className="eda-roadmap-step" role="listitem">
                <div className="eda-roadmap-ico">
                  <EdIcon name={step.icon} size={22} />
                </div>
                <p className="eda-roadmap-title">{step.title}</p>
                <p className="eda-roadmap-sub">{step.sub}</p>
                {i < ACADEMY_JOURNEY.length - 1 && (
                  <span className="eda-roadmap-arrow" aria-hidden="true">›</span>
                )}
              </div>
            ))}
          </div>

          {ACADEMY_CATEGORIES.map((cat, ci) => (
            <div key={cat.label} className="eda-cat-group">
              <div className="eda-cat-head">
                <span className="eda-cat-num" aria-hidden="true">{String(ci + 1).padStart(2, '0')}</span>
                <div>
                  <p className="eda-cat-label">{cat.label}</p>
                  <p className="eda-cat-tagline">{cat.tagline}</p>
                </div>
              </div>
              <div className="eda-pcard-grid">
                {ACADEMY_PROGRAMS.filter((p) => p.category === cat.label).map((p) => (
                  <article key={p.slug} className={`eda-pcard eda-pcard--${p.accent}`}>
                    {p.featured && <span className="eda-pcard-badge">Flagship</span>}
                    <div className="eda-pcard-header">
                      <div className="eda-pcard-ico">
                        <EdIcon name={p.iconName} size={22} />
                      </div>
                      <div>
                        <h3 className="eda-pcard-title">{p.title}</h3>
                        <p className="eda-pcard-sub">{p.subtitle}</p>
                      </div>
                    </div>
                    <p className="eda-pcard-body">{p.body}</p>
                    <div className="eda-pcard-metrics" aria-label="Program metrics">
                      {p.metrics.map((m) => (
                        <div key={m.sub} className="eda-metric">
                          <span className="eda-metric-val">{m.top}</span>
                          <span className="eda-metric-lbl">{m.sub}</span>
                        </div>
                      ))}
                    </div>
                    <Link className="eda-pcard-cta" to={`/academy/program/${p.slug}`}>
                      {p.ctaLabel} <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ GUIDE */}
      <AcademyGuide />

      {/* ══ FACULTY / INSTRUCTOR CTA — founder only, no fabricated peers */}
      <section id="faculty" className="eda-section">
        <div className="container eda-faculty-band">
          <div>
            <p className="eda-section-kicker">Faculty</p>
            <h2 className="eda-section-h2" style={{ textAlign: 'left', marginBottom: 12 }}>
              Led by practicing clinicians
            </h2>
            <p className="eda-faculty-lead">
              Serenest Academy is directed by{' '}
              <strong>Dr. Chirag Ambaliya</strong>, psychiatrist and founder — with programmes
              shaped by active clinical practice on Serenest, not generic courseware.
            </p>
          </div>
          <a href={INSTRUCTOR_MAILTO} className="eda-btn eda-btn-outline">
            Become an instructor →
          </a>
        </div>
      </section>

      {/* ══ FAQ */}
      <section id="faq" className="eda-section eda-section-alt">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">FAQ</p>
            <h2 className="eda-section-h2">Frequently asked questions</h2>
          </div>
          <div className="eda-faq">
            {ACADEMY_FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
          <p className="eda-faq-footer">
            Still have questions?{' '}
            <a
              href="mailto:support@serenest.in?subject=Serenest%20Academy%20Query"
              className="eda-link"
            >
              Email us
            </a>
            .
          </p>
        </div>
      </section>

      {/* ══ FINAL CTA */}
      <section className="eda-section eda-section-cta">
        <div className="container">
          <div className="eda-cta-block">
            <div>
              <h2 className="eda-cta-h2">Ready to grow your clinical practice?</h2>
              <p className="eda-cta-sub">
                Start with Clinical Excellence — or browse every programme and claim your seat.
              </p>
            </div>
            <div className="eda-cta-actions">
              <Link
                className="eda-btn eda-btn-primary eda-btn-lg"
                to="/academy/program/clinical-excellence"
              >
                Start Clinical Excellence →
              </Link>
              <a href="#programs" className="eda-btn eda-btn-outline eda-btn-lg">
                Browse programmes
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
