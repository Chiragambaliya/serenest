import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useAuth, signOut } from '../lib/useAuth';
import {
  ACADEMY_PROGRAMS, ACADEMY_CATEGORIES, ACADEMY_JOURNEY, ACADEMY_STATS,
} from '../lib/academyPrograms';
import EdIcon from '../components/EdIcon';
import AcademyGuide from '../components/AcademyGuide';
import { academyContent } from '../lib/api';
import '../styles/academy.css';

/* ── Static data ─────────────────────────────────────────────────── */
const FACULTY = [
  { name: 'Dr. Chirag Ambaliya', role: 'Psychiatrist & Founder', specialty: 'Telepsychiatry · Mood Disorders', avatar: '🧠' },
  { name: 'Dr. Priya Sharma', role: 'Clinical Psychologist', specialty: 'CBT · Anxiety Disorders', avatar: '💚' },
  { name: 'Dr. Rohan Mehta', role: 'Psychiatry Researcher', specialty: 'Child Psychiatry · ADHD', avatar: '🔬' },
];

const CERTIFICATIONS = [
  { title: 'Certificate in Counselling Skills', duration: '6 weeks', level: 'Foundation', modules: 12, accent: 'purple', icon: '🎓' },
  { title: 'Certificate in Clinical Psychology', duration: '8 weeks', level: 'Intermediate', modules: 16, accent: 'green', icon: '🧠' },
  { title: 'Certificate in Digital Mental Health', duration: '4 weeks', level: 'Foundation', modules: 8, accent: 'teal', icon: '💻' },
  { title: 'Fellowship in Telepsychiatry', duration: '12 weeks', level: 'Advanced', modules: 24, accent: 'blue', icon: '🏅' },
];

const TESTIMONIALS = [
  {
    name: 'Ananya Desai',
    role: 'Psychology Graduate',
    text: 'The student training track gave me the clinical confidence I needed for my first placement. The case discussions were invaluable.',
    stars: 5,
  },
  {
    name: 'Dr. Vikram Rao',
    role: 'Psychiatry Resident',
    text: 'The telepsychiatry modules are incredibly practical. I started applying the frameworks from day one of my online consultations.',
    stars: 5,
  },
  {
    name: 'Meera Pillai',
    role: 'Counsellor, Mumbai',
    text: 'Serenest Academy helped me transition from classroom theory to real clinical work. The mentorship was exactly what I needed.',
    stars: 5,
  },
];

const CAREER_SUPPORT = [
  { icon: '🎯', title: 'Placement Guidance', desc: 'Connect with mental health organizations through our growing professional network.' },
  { icon: '🤝', title: '1:1 Mentorship', desc: 'Personalized guidance from experienced clinicians to shape your career path.' },
  { icon: '📋', title: 'CV & Portfolio Review', desc: 'Expert clinician feedback on your professional materials before you apply.' },
  { icon: '🌐', title: 'Professional Network', desc: 'Join India\'s growing community of mental health professionals.' },
  { icon: '🎓', title: 'Credential Support', desc: 'Certificates recognized by peers and employers across the mental health sector.' },
  { icon: '💼', title: 'Interview Readiness', desc: 'Case discussion skills and practical tools to succeed in your first role.' },
];

const FAQ = [
  {
    q: 'Who are Serenest Academy courses designed for?',
    a: 'Our programs serve psychology students, fresh graduates, practicing counsellors, psychiatry residents, and licensed professionals seeking continuous development.',
  },
  {
    q: 'Are the certificates recognized?',
    a: 'Serenest Academy certificates are issued by Serenest Education Pvt Ltd. They are recognized by peers, employers, and professional networks across India\'s mental health sector.',
  },
  {
    q: 'How are the courses delivered?',
    a: 'All courses are delivered online — self-paced modules with live case discussion sessions. Learn at your own pace while engaging with peers and faculty.',
  },
  {
    q: 'Can I get a mentor as part of my program?',
    a: 'Yes. The Mentorship track offers 1:1 clinical supervision and career guidance. Mentorship can also be added alongside any other program.',
  },
  {
    q: 'What is the duration of programs?',
    a: 'Certificate programs run 4–12 weeks. Fellowship tracks are longer-form (3–6 months). CPD activities are modular and can be completed in days.',
  },
  {
    q: 'How do I enrol?',
    a: 'Create a Serenest Academy account, choose your program, and follow the enrollment steps. Some programs have specific entry requirements listed on their detail page.',
  },
];

const WHY_ITEMS = [
  { icon: '🩺', title: 'Clinician-Led', desc: 'Every program is designed and delivered by practicing mental health professionals.' },
  { icon: '📚', title: 'Case-Based Learning', desc: 'Learn from real clinical scenarios, not just textbooks and theory.' },
  { icon: '🏆', title: 'Verified Certificates', desc: 'Earn credentials recognized across the mental health sector.' },
  { icon: '🕐', title: 'Flexible & Online', desc: 'Self-paced learning that fits your schedule, anywhere in India.' },
  { icon: '👥', title: 'Mentorship & Community', desc: 'Connect with experts and peers throughout your journey.' },
  { icon: '🌱', title: 'Career-Focused', desc: 'From student to specialist — every program builds real-world skills.' },
];

const INSTRUCTOR_MAILTO =
  'mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20Become%20an%20Instructor';

/* ── FAQ accordion item ──────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="eda-faq-item">
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
  announcement:   { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  program_update: { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
  event:          { bg: '#fef9c3', text: '#854d0e', dot: '#eab308' },
};

/* ── Page ────────────────────────────────────────────────────────── */
export default function AcademyPage() {
  useSEO({ path: '/academy', ...ROUTE_SEO['/academy'] });
  const { user } = useAuth();
  const firstName = (user?.user_metadata?.full_name || user?.email || '').split(/[\s@]/)[0];

  const [liveContent, setLiveContent] = useState([]);
  useEffect(() => {
    academyContent.list().then((r) => setLiveContent(r.content ?? [])).catch(() => {});
  }, []);

  const pinnedItems   = liveContent.filter((c) => c.pinned);
  const regularItems  = liveContent.filter((c) => !c.pinned);

  return (
    <div className="eda-page">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="eda-hero">
        <div className="container">

          {/* Top bar */}
          <nav className="eda-hero-topbar" aria-label="Academy header">
            <div className="eda-brand">
              <span className="eda-brand-mark" aria-hidden="true">✦</span>
              <span className="eda-brand-name">Serenest Academy</span>
              <span className="eda-brand-divider" aria-hidden="true">·</span>
              <span className="eda-brand-sub">Education · Part of Serenest</span>
            </div>
            <div className="eda-hero-auth">
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

          {/* Two-column hero body */}
          <div className="eda-hero-body">

            {/* Text */}
            <div className="eda-hero-text">
              <p className="eda-kicker">India's Premier Mental Health Education Platform</p>
              <h1 className="eda-hero-h1">
                Train the next generation of{' '}
                <span className="eda-h1-accent">mental health professionals</span>
              </h1>
              <p className="eda-hero-lead">
                Clinician-led programs in psychology, psychiatry, counselling, and digital mental
                health — from foundational certificates to advanced fellowships.
              </p>
              <div className="eda-hero-actions">
                <a className="eda-btn eda-btn-primary eda-btn-lg" href="#programs">
                  Explore Programs
                </a>
                <a className="eda-btn eda-btn-outline eda-btn-lg" href={INSTRUCTOR_MAILTO}>
                  Become an Instructor
                </a>
              </div>
              <div className="eda-hero-stats" aria-label="Academy at a glance">
                {ACADEMY_STATS.map((s) => (
                  <div key={s.label} className="eda-hero-stat">
                    <span className="eda-stat-val">{s.value}</span>
                    <span className="eda-stat-lbl">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating card */}
            <aside className="eda-hero-card" aria-label="Live programs preview">
              <div className="eda-hcard-badge">Live Programs</div>
              <div className="eda-hcard-list">
                {ACADEMY_PROGRAMS.slice(0, 4).map((p) => (
                  <div key={p.slug} className="eda-hcard-item">
                    <span className={`eda-hcard-dot eda-acc-${p.accent}`} aria-hidden="true" />
                    <span className="eda-hcard-title">{p.title}</span>
                    <span className="eda-hcard-level">{p.category}</span>
                  </div>
                ))}
                <div className="eda-hcard-more" aria-hidden="true">
                  +{ACADEMY_PROGRAMS.length - 4} more programs →
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* ══ INNER STICKY NAV ══════════════════════════════════════ */}
      <nav className="eda-inner-nav" aria-label="Jump to section">
        <div className="container">
          <div className="eda-inner-nav-links">
            {[
              ['#programs', 'Programs'],
              ['#certifications', 'Certifications'],
              ['#faculty', 'Faculty'],
              ['#career', 'Career Support'],
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

            {/* Pinned banner (one at a time — latest pinned item) */}
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

            {/* Regular updates grid */}
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

      {/* ══ PROGRAMS ══════════════════════════════════════════════ */}
      <section id="programs" className="eda-section">
        <div className="container">

          <div className="eda-section-head">
            <p className="eda-section-kicker">Career Pathways</p>
            <h2 className="eda-section-h2">Build your mental health career</h2>
            <p className="eda-section-sub">
              From student to specialist — structured programs at every stage of your journey.
            </p>
          </div>

          {/* Learning journey roadmap */}
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

          {/* Program cards grouped by category */}
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
                    <Link className="eda-pcard-cta" to={`/academy/program/${p.slug}`}>
                      {p.ctaLabel} <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ))}

          {/* Workforce vision banner */}
          <div className="eda-workforce">
            <div className="eda-workforce-text">
              <h3>Building India's Mental Health Workforce for 2047</h3>
              <p>
                Structured education pathways from classroom to clinical practice — preparing
                psychologists, counsellors, psychiatrists, and researchers.
              </p>
            </div>
            <ul className="eda-workforce-stats" aria-label="Workforce statistics">
              {ACADEMY_STATS.map((s) => (
                <li key={s.label}>
                  <span className="eda-wf-val">{s.value}</span>
                  <span className="eda-wf-lbl">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ══ CERTIFICATIONS ════════════════════════════════════════ */}
      <section id="certifications" className="eda-section eda-section-alt">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">Credentials</p>
            <h2 className="eda-section-h2">Earn recognized certifications</h2>
            <p className="eda-section-sub">
              Clinically reviewed, competency-based credentials you can share with confidence.
            </p>
          </div>
          <div className="eda-cert-grid">
            {CERTIFICATIONS.map((c) => (
              <div key={c.title} className={`eda-cert-card eda-cert--${c.accent}`}>
                <div className="eda-cert-icon" aria-hidden="true">{c.icon}</div>
                <p className="eda-cert-level">{c.level}</p>
                <h3 className="eda-cert-title">{c.title}</h3>
                <div className="eda-cert-meta">
                  <span>⏱ {c.duration}</span>
                  <span>📖 {c.modules} modules</span>
                </div>
                <a href="#programs" className="eda-cert-cta">View program →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FACULTY ═══════════════════════════════════════════════ */}
      <section id="faculty" className="eda-section">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">Expert Faculty</p>
            <h2 className="eda-section-h2">Learn from practicing clinicians</h2>
            <p className="eda-section-sub">
              Our faculty are active mental health professionals who bring real clinical experience
              to every lesson.
            </p>
          </div>
          <div className="eda-faculty-grid">
            {FACULTY.map((f) => (
              <div key={f.name} className="eda-faculty-card">
                <div className="eda-faculty-avatar" aria-hidden="true">{f.avatar}</div>
                <h3 className="eda-faculty-name">{f.name}</h3>
                <p className="eda-faculty-role">{f.role}</p>
                <p className="eda-faculty-specialty">{f.specialty}</p>
              </div>
            ))}
            <div className="eda-faculty-card eda-faculty-join">
              <div className="eda-faculty-avatar" aria-hidden="true">🎓</div>
              <h3 className="eda-faculty-name">Become an Instructor</h3>
              <p className="eda-faculty-role">Share your clinical expertise</p>
              <p className="eda-faculty-specialty">We read every application and reply when there's a fit.</p>
              <a
                href={INSTRUCTOR_MAILTO}
                className="eda-btn eda-btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Apply Now →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHY LEARN ═════════════════════════════════════════════ */}
      <section className="eda-section eda-section-teal">
        <div className="container">
          <div className="eda-section-head eda-section-head--light">
            <p className="eda-section-kicker eda-kicker-light">Why Choose Us</p>
            <h2 className="eda-section-h2">Why learn with Serenest Academy?</h2>
          </div>
          <div className="eda-why-grid">
            {WHY_ITEMS.map((w) => (
              <div key={w.title} className="eda-why-card">
                <span className="eda-why-icon" aria-hidden="true">{w.icon}</span>
                <h3 className="eda-why-title">{w.title}</h3>
                <p className="eda-why-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════ */}
      <section className="eda-section">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">Student Success</p>
            <h2 className="eda-section-h2">What our learners say</h2>
          </div>
          <div className="eda-testimonial-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="eda-testimonial">
                <div className="eda-testimonial-stars" aria-label={`${t.stars} out of 5 stars`}>
                  {'★'.repeat(t.stars)}
                </div>
                <p className="eda-testimonial-text">"{t.text}"</p>
                <div className="eda-testimonial-author">
                  <span className="eda-testimonial-name">{t.name}</span>
                  <span className="eda-testimonial-role">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CAREER SUPPORT ════════════════════════════════════════ */}
      <section id="career" className="eda-section eda-section-alt">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">Career Support</p>
            <h2 className="eda-section-h2">We're with you beyond the course</h2>
            <p className="eda-section-sub">
              Graduation is just the beginning. Serenest Academy supports your career from your
              first program to senior practice.
            </p>
          </div>
          <div className="eda-career-grid">
            {CAREER_SUPPORT.map((c) => (
              <div key={c.title} className="eda-career-card">
                <span className="eda-career-icon" aria-hidden="true">{c.icon}</span>
                <h3 className="eda-career-title">{c.title}</h3>
                <p className="eda-career-desc">{c.desc}</p>
              </div>
            ))}
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
          <div className="eda-faq">
            {FAQ.map((item) => (
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
              <h2 className="eda-cta-h2">Ready to grow your clinical career?</h2>
              <p className="eda-cta-sub">
                Join thousands of mental health professionals learning with Serenest Academy.
              </p>
            </div>
            <div className="eda-cta-actions">
              <a href="#programs" className="eda-btn eda-btn-primary eda-btn-lg">
                Start Learning →
              </a>
              <Link to="/book" className="eda-btn eda-btn-outline eda-btn-lg">
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
