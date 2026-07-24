import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useProfessionalAccess } from '../lib/useProfessionalAccess';
import {
  ACADEMY_PROGRAMS, ACADEMY_CATEGORIES, FEATURED_PROGRAMS,
} from '../lib/academyPrograms';
import { ACADEMY_FAQS } from '../lib/academyFaqs';
import EdIcon from '../components/EdIcon';
import AcademyGuide from '../components/AcademyGuide';
import FaqAccordion from '../components/FaqAccordion';
import { academyContent } from '../lib/api';
import '../styles/academy.css';

/* ── Static data ─────────────────────────────────────────────────── */
const WHAT_WE_TEACH = [
  { icon: 'stethoscope', title: 'Clinical Psychiatry', body: 'Assessment, diagnosis and evidence-based management.' },
  { icon: 'pill', title: 'Psychopharmacology', body: 'Practical prescribing principles and medication management.' },
  { icon: 'chat', title: 'Psychotherapy', body: 'Major therapy approaches, techniques and clinical application.' },
  { icon: 'heart', title: 'Addiction and Recovery', body: 'Counselling, relapse prevention and recovery-oriented care.' },
  { icon: 'shield', title: 'Crisis and Risk Management', body: 'Suicide-risk assessment, crisis intervention and safety planning.' },
  { icon: 'monitor', title: 'Digital Mental Health', body: 'Technology, ethics and digital practice in mental healthcare.' },
  { icon: 'book', title: 'Research and Professional Growth', body: 'Research methods, clinical documentation and career development.' },
];

const WHY_LEARN = [
  'Courses designed and taught by experienced clinicians',
  'Practical learning with real-life cases and examples',
  'Small cohorts and personalised attention',
  'Ethical, evidence-informed and application-focused teaching',
  'Supportive learning community and mentorship',
];

const LEARNING_EXPERIENCE = [
  { icon: 'book', title: 'Learn', body: 'Concepts that matter' },
  { icon: 'search', title: 'Observe', body: 'Real-world cases and demonstrations' },
  { icon: 'people', title: 'Practise', body: 'Role-plays and skill exercises' },
  { icon: 'chat', title: 'Receive Feedback', body: 'Guided supervision and reflection' },
  { icon: 'target', title: 'Apply', body: 'Use skills in real clinical practice' },
];

/* Hand-drawn illustrations standing in for photography that doesn't exist
   yet (see the asset checklist) — styled to match the homepage hero rather
   than left as empty placeholder boxes. */
function BooksIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="eda-illustration" role="img" aria-label="Illustration of a stack of books, a notebook, and a cup of tea on a desk">
      <rect x="0" y="0" width="400" height="300" fill="var(--bg-2)" />
      <path d="M40 260 L360 260" stroke="#2a241f" strokeWidth="3" opacity="0.25" />
      <g>
        <rect x="120" y="205" width="150" height="26" rx="3" fill="#c1572d" stroke="#2a241f" strokeWidth="3" />
        <rect x="128" y="176" width="140" height="26" rx="3" fill="#5a6b4a" stroke="#2a241f" strokeWidth="3" />
        <rect x="118" y="147" width="146" height="26" rx="3" fill="#f4ddd0" stroke="#2a241f" strokeWidth="3" />
        <rect x="124" y="118" width="138" height="26" rx="3" fill="#3c4a2c" stroke="#2a241f" strokeWidth="3" />
      </g>
      <path d="M255 118 C240 90 245 60 225 40" fill="none" stroke="#3d6b5e" strokeWidth="6" strokeLinecap="round" />
      <path d="M225 40 C215 46 200 44 190 56 C204 58 216 56 226 50 Z" fill="#5a6b4a" stroke="#2a241f" strokeWidth="2.5" />
      <path d="M238 72 C224 76 210 72 200 82 C214 86 228 84 240 78 Z" fill="#5a6b4a" stroke="#2a241f" strokeWidth="2.5" />
      <path d="M248 96 C234 98 222 94 212 104 C224 108 238 106 250 100 Z" fill="#3d6b5e" stroke="#2a241f" strokeWidth="2.5" />
      <g>
        <path d="M70 236 C70 226 79 218 90 218 C101 218 110 226 110 236 L106 256 C104 264 98 268 90 268 C82 268 76 264 74 256 Z" fill="#eecfae" stroke="#2a241f" strokeWidth="3" />
        <path d="M110 224 C122 222 130 230 127 240 C125 247 116 250 109 246" fill="none" stroke="#2a241f" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <g opacity="0.7" stroke="#6a5f6e" strokeWidth="2.4" strokeLinecap="round">
        <path d="M80 202 C76 192 84 186 80 176" fill="none" />
        <path d="M94 198 C90 188 98 182 94 172" fill="none" />
      </g>
      <path d="M295 250 C295 236 310 225 335 225 C345 225 353 232 351 240 L347 265 C345 272 337 277 328 277 L305 277 C297 277 292 271 291 264 Z" fill="#f7f2ea" stroke="#2a241f" strokeWidth="3" />
      <g stroke="#c9beac" strokeWidth="2" opacity="0.8">
        <line x1="303" y1="240" x2="337" y2="236" />
        <line x1="301" y1="250" x2="339" y2="246" />
        <line x1="300" y1="260" x2="335" y2="256" />
      </g>
    </svg>
  );
}

function RoomIllustration() {
  return (
    <svg viewBox="0 0 400 320" className="eda-illustration" role="img" aria-label="Illustration of a quiet consultation room with a chair, bookshelf, and plant">
      <rect x="0" y="0" width="400" height="320" fill="var(--bg-2)" />
      <line x1="0" y1="240" x2="400" y2="240" stroke="#2a241f" strokeWidth="3" opacity="0.25" />
      <rect x="30" y="90" width="110" height="150" rx="4" fill="#f7f2ea" stroke="#2a241f" strokeWidth="3" />
      <line x1="30" y1="140" x2="140" y2="140" stroke="#2a241f" strokeWidth="2.4" opacity="0.6" />
      <line x1="30" y1="190" x2="140" y2="190" stroke="#2a241f" strokeWidth="2.4" opacity="0.6" />
      <rect x="40" y="100" width="20" height="34" fill="#a84622" opacity="0.85" />
      <rect x="65" y="100" width="14" height="34" fill="#5a6b4a" opacity="0.85" />
      <rect x="84" y="150" width="22" height="34" fill="#3c4a2c" opacity="0.85" />
      <rect x="112" y="150" width="16" height="34" fill="#6a5f6e" opacity="0.85" />
      <path d="M230 240 C222 240 218 232 220 222 L228 176 C230 168 238 163 248 163 L288 163 C298 163 306 168 308 176 L316 222 C318 232 314 240 306 240 Z"
        fill="#6d7f5c" stroke="#2a241f" strokeWidth="3" />
      <rect x="234" y="240" width="80" height="14" rx="4" fill="#3c4a2c" stroke="#2a241f" strokeWidth="3" />
      <path d="M228 176 C232 190 234 206 232 222" fill="none" stroke="#2a241f" strokeWidth="2" opacity="0.5" />
      <g>
        <path d="M330 240 C326 200 340 170 328 130" fill="none" stroke="#6b5344" strokeWidth="5" strokeLinecap="round" />
        <path d="M328 130 C316 134 306 128 296 138 C308 142 320 140 330 134 Z" fill="#3d6b5e" stroke="#2a241f" strokeWidth="2.4" />
        <path d="M334 158 C322 160 312 154 302 162 C314 168 326 166 336 160 Z" fill="#5a6b4a" stroke="#2a241f" strokeWidth="2.4" />
        <path d="M326 186 C314 188 304 182 294 190 C306 196 318 194 328 188 Z" fill="#3d6b5e" stroke="#2a241f" strokeWidth="2.4" />
      </g>
      <rect x="170" y="70" width="46" height="60" rx="3" fill="#f4ddd0" stroke="#2a241f" strokeWidth="3" transform="rotate(-4 193 100)" />
    </svg>
  );
}

const INSTRUCTOR_MAILTO =
  'mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20Become%20an%20Instructor';

const TYPE_COLORS = {
  announcement:   { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  program_update: { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
  event:          { bg: '#fef9c3', text: '#854d0e', dot: '#eab308' },
};

/* ── Page ────────────────────────────────────────────────────────── */
export default function AcademyPage() {
  useSEO({ path: '/academy', ...ROUTE_SEO['/academy'] });
  const { isProfessional } = useProfessionalAccess();

  const [liveContent, setLiveContent] = useState([]);
  useEffect(() => {
    academyContent.list().then((r) => setLiveContent(r.content ?? [])).catch(() => {});
  }, []);

  const pinnedItems   = liveContent.filter((c) => c.pinned);
  const regularItems  = liveContent.filter((c) => !c.pinned);

  return (
    <div className="eda-page">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="eda-hero eda-hero--simple">
        <div className="container">
          <div className="eda-hero-body">
            <div className="eda-hero-text">
              <p className="eda-kicker">Serenest Academy</p>
              <h1 className="eda-hero-h1">Learning that strengthens practice.</h1>
              <p className="eda-hero-lead">
                Practical, clinically grounded education for mental health professionals.
                Learn. Apply. Grow.
              </p>
              {isProfessional ? (
                <div className="eda-pro-free-banner" role="status">
                  <strong>Free for Serenest professionals.</strong>{' '}
                  Your approved practice account includes Academy at no charge.
                </div>
              ) : null}
              <div className="eda-hero-actions">
                <a className="eda-btn eda-btn-primary eda-btn-lg" href="#programs">
                  Explore Programs
                </a>
                <Link className="eda-btn eda-btn-outline eda-btn-lg" to="/academy/programs">
                  View all courses
                </Link>
              </div>
            </div>

            <div className="eda-hero-photo">
              <BooksIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ══ INNER STICKY NAV ══════════════════════════════════════ */}
      <nav className="eda-inner-nav" aria-label="Jump to section">
        <div className="container">
          <div className="eda-inner-nav-links">
            {[
              ['#teach', 'What We Teach'],
              ['#why', 'Why Serenest Academy'],
              ['#programs', 'Featured Programs'],
              ['#experience', 'Learning Experience'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="eda-inner-nav-link">{label}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* ══ ACADEMY GUIDE ═════════════════════════════════════════ */}
      <AcademyGuide />

      {/* ══ LIVE ANNOUNCEMENTS / UPDATES ══════════════════════════ */}
      {liveContent.length > 0 && (
        <section className="eda-updates" aria-label="Latest updates">
          <div className="container">
            {pinnedItems.length > 0 && (
              <div className="eda-pinned-banner">
                <span className="eda-pinned-tag" aria-label="Pinned">📌</span>
                <div className="eda-pinned-body">
                  <strong>{pinnedItems[0].title}</strong>
                  {pinnedItems[0].body && <span className="eda-pinned-text"> — {pinnedItems[0].body}</span>}
                  {pinnedItems[0].link && (
                    <a href={pinnedItems[0].link} className="eda-pinned-link">{pinnedItems[0].link_label || 'Learn more'} →</a>
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
                      <div key={item.id} className="eda-update-card" style={{ '--uda-bg': colors.bg, '--uda-text': colors.text, '--uda-dot': colors.dot }}>
                        <span className="eda-update-dot" aria-hidden="true" />
                        <div className="eda-update-body">
                          <p className="eda-update-title">{item.title}</p>
                          {item.body && <p className="eda-update-desc">{item.body}</p>}
                          {item.link && (
                            <a href={item.link} className="eda-update-link">{item.link_label || 'Learn more'} →</a>
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

      {/* ══ WHAT WE TEACH ═════════════════════════════════════════ */}
      <section id="teach" className="eda-section eda-section-alt">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">What We Teach</p>
          </div>
          <div className="eda-teach-grid">
            {WHAT_WE_TEACH.map((item) => (
              <div key={item.title} className="eda-teach-card">
                <span className="eda-teach-icon" aria-hidden="true"><EdIcon name={item.icon} size={26} /></span>
                <h3 className="eda-teach-title">{item.title}</h3>
                <p className="eda-teach-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY LEARN ═════════════════════════════════════════════ */}
      <section id="why" className="eda-section">
        <div className="container eda-why-split">
          <div>
            <p className="eda-section-kicker">Why Learn With Serenest Academy</p>
            <ul className="eda-why-list">
              {WHY_LEARN.map((item) => (
                <li key={item}>
                  <EdIcon name="award" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a href={INSTRUCTOR_MAILTO} className="eda-link">More about our approach →</a>
          </div>
          <div className="eda-why-photo">
            <RoomIllustration />
            <blockquote className="eda-quote">
              “Education is not just information. It is transformation in practice.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* ══ FEATURED PROGRAMS ═════════════════════════════════════ */}
      <section id="programs" className="eda-section eda-section-alt">
        <div className="container">
          <div className="eda-section-head eda-section-head--row">
            <p className="eda-section-kicker">Featured Programs</p>
            <Link to="/academy/programs" className="eda-link">View all programs →</Link>
          </div>
          <div className="eda-pcard-grid">
            {(FEATURED_PROGRAMS.length ? FEATURED_PROGRAMS : ACADEMY_PROGRAMS.slice(0, 4)).map((p) => (
              <article key={p.slug} className={`eda-pcard eda-pcard--${p.accent}`}>
                {p.popular && <span className="eda-pcard-badge">POPULAR</span>}
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
                <Link className="eda-pcard-cta" to={`/academy/programs/${p.slug}`}>
                  View Program <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>

          {ACADEMY_CATEGORIES.map((cat, ci) => (
            <div key={cat.label} className="eda-cat-group">
              <div className="eda-cat-head">
                <span className="eda-cat-num" aria-hidden="true">{ci + 1}</span>
                <div>
                  <p className="eda-cat-label">{cat.label}</p>
                  <p className="eda-cat-tagline">{cat.tagline}</p>
                </div>
              </div>
              <div className="eda-pcard-grid">
                {ACADEMY_PROGRAMS.filter((p) => p.category === cat.label).map((p) => (
                  <article key={p.slug} className={`eda-pcard eda-pcard--${p.accent}`}>
                    {p.popular && <span className="eda-pcard-badge">POPULAR</span>}
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
                    <Link className="eda-pcard-cta" to={`/academy/programs/${p.slug}`}>
                      {p.ctaLabel} <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ LEARNING EXPERIENCE ═══════════════════════════════════ */}
      <section id="experience" className="eda-section">
        <div className="container eda-experience-row">
          <div className="eda-roadmap" role="list" aria-label="Learning experience">
            {LEARNING_EXPERIENCE.map((step, i) => (
              <div key={step.title} className="eda-roadmap-step" role="listitem">
                <div className="eda-roadmap-ico">
                  <EdIcon name={step.icon} size={22} />
                </div>
                <p className="eda-roadmap-title">{step.title}</p>
                <p className="eda-roadmap-sub">{step.body}</p>
                {i < LEARNING_EXPERIENCE.length - 1 && (
                  <span className="eda-roadmap-arrow" aria-hidden="true">›</span>
                )}
              </div>
            ))}
          </div>
          <aside className="eda-experience-callout">
            <p>For professionals who want to make a real difference.</p>
          </aside>
        </div>
      </section>

      {/* ══ FACULTY ═══════════════════════════════════════════════ */}
      <section id="faculty" className="eda-section eda-section-alt">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">Faculty</p>
            <h2 className="eda-section-h2">Learn from practising clinicians</h2>
          </div>
          <div className="eda-faculty-grid">
            <div className="eda-faculty-card">
              <div className="eda-faculty-avatar" aria-hidden="true">
                <EdIcon name="stethoscope" size={28} />
              </div>
              <h3 className="eda-faculty-name">Dr. Chirag Aambalia</h3>
              <p className="eda-faculty-role">Psychiatrist &amp; Founder</p>
            </div>
            <div className="eda-faculty-card eda-faculty-join">
              <div className="eda-faculty-avatar" aria-hidden="true"><EdIcon name="cap" size={28} /></div>
              <h3 className="eda-faculty-name">Faculty roster is growing</h3>
              <p className="eda-faculty-role">We're adding clinician faculty as programs expand.</p>
              <a href={INSTRUCTOR_MAILTO} className="eda-btn eda-btn-primary" style={{ marginTop: '1rem' }}>
                Apply to teach →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ════════════════════════════════════════════════════ */}
      <section id="faq" className="eda-section">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">FAQ</p>
            <h2 className="eda-section-h2">Frequently asked questions</h2>
          </div>
          <FaqAccordion items={ACADEMY_FAQS} />
          <p className="eda-faq-footer">
            Still have questions?{' '}
            <a
              href="mailto:support@serenest.in?subject=Serenest%20Academy%20Query"
              className="eda-link"
            >
              Email us
            </a>{' '}
            and we'll get back to you.
          </p>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════════ */}
      <section className="eda-section eda-section-cta">
        <div className="container">
          <div className="eda-cta-block">
            <div>
              <h2 className="eda-cta-h2">Ready to strengthen your practice?</h2>
              <p className="eda-cta-sub">
                Explore our programs and find the right learning path for you.
              </p>
            </div>
            <div className="eda-cta-actions">
              <a href="#programs" className="eda-btn eda-btn-outline eda-btn-lg">
                Explore Programs
              </a>
            </div>
          </div>
          <p className="eda-disclaimer">
            Serenest Academy programs support professional learning and skill development.
            They do not replace a recognised degree, professional registration, supervised
            clinical requirements, or legal scope of practice.
          </p>
        </div>
      </section>

    </div>
  );
}
