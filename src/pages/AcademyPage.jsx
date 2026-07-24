import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useProfessionalAccess } from '../lib/useProfessionalAccess';
import {
  ACADEMY_PROGRAMS, FEATURED_PROGRAMS,
} from '../lib/academyPrograms';
import { ACADEMY_FAQS } from '../lib/academyFaqs';
import EdIcon from '../components/EdIcon';
import AcademyGuide from '../components/AcademyGuide';
import FaqAccordion from '../components/FaqAccordion';
import ImagePlaceholder from '../components/ImagePlaceholder';
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
              <ImagePlaceholder asset="academy-hero-desk-books.jpg" />
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
            <ImagePlaceholder asset="academy-consultation-room.jpg" />
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
