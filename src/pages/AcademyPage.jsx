import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useProfessionalAccess } from '../lib/useProfessionalAccess';
import {
  ACADEMY_PROGRAMS, ACADEMY_CATEGORIES,
} from '../lib/academyPrograms';
import { ACADEMY_FAQS } from '../lib/academyFaqs';
import AcademyGuide from '../components/AcademyGuide';
import FaqAccordion from '../components/FaqAccordion';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { academyContent } from '../lib/api';
import '../styles/academy.css';

const WHAT_WE_TEACH = [
  { title: 'Clinical Psychiatry', body: 'Assessment, diagnosis and evidence-based management.' },
  { title: 'Psychopharmacology', body: 'Practical prescribing principles and medication management.' },
  { title: 'Psychotherapy', body: 'Major therapy approaches, techniques and clinical application.' },
  { title: 'Addiction and Recovery', body: 'Counselling, relapse prevention and recovery-oriented care.' },
  { title: 'Crisis and Risk Management', body: 'Suicide-risk assessment, crisis intervention and safety planning.' },
  { title: 'Digital Mental Health', body: 'Technology, ethics and digital practice in mental healthcare.' },
  { title: 'Research and Professional Growth', body: 'Research methods, clinical documentation and career development.' },
];

const WHY_LEARN = [
  'Courses designed and taught by experienced clinicians',
  'Practical learning with real-life cases and examples',
  'Small cohorts and personalised attention',
  'Ethical, evidence-informed and application-focused teaching',
  'Supportive learning community and mentorship',
];

const LEARNING_EXPERIENCE = [
  { stage: '01 · Learn', title: 'Concepts that matter', body: 'Core ideas selected for clinical usefulness, not syllabus padding.' },
  { stage: '02 · Observe', title: 'Cases and demonstrations', body: 'Real-world case material and supervised demonstration.' },
  { stage: '03 · Practise', title: 'Skill exercises', body: 'Role-plays and structured practice before application.' },
  { stage: '04 · Feedback', title: 'Guided supervision', body: 'Reflection with faculty who still see patients.' },
  { stage: '05 · Apply', title: 'Return to practice', body: 'Take the skill into real clinical work with clearer judgment.' },
];

const INSTRUCTOR_MAILTO =
  'mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20Become%20an%20Instructor';

const ACADEMY_DESTINATIONS = [
  { title: 'All programs', body: 'The full numbered catalogue across career stages.', href: '/academy/programs' },
  { title: 'Learning paths', body: 'Sequences that group programs by where you are in practice.', href: '/academy/learning-paths' },
  { title: 'Workshops', body: 'Shorter intensives — dates published when scheduled.', href: '/academy/workshops' },
  { title: 'Faculty', body: 'Who teaches, and how to apply to teach.', href: '/academy/faculty' },
  { title: 'FAQs', body: 'Scope, enrolment, and what Academy does not replace.', href: '/academy/faqs' },
];

export default function AcademyPage() {
  useSEO({ path: '/academy', ...ROUTE_SEO['/academy'] });
  const { isProfessional } = useProfessionalAccess();

  const [liveContent, setLiveContent] = useState([]);
  useEffect(() => {
    academyContent.list().then((r) => setLiveContent(r.content ?? [])).catch(() => {});
  }, []);

  const pinnedItems = liveContent.filter((c) => c.pinned);
  const regularItems = liveContent.filter((c) => !c.pinned);

  return (
    <div className="eda-page">

      {/* Hero — brand-first academy opener */}
      <section className="ed-pace-open" aria-labelledby="academy-hero-title">
        <div className="ed-shell ed-facing">
          <div>
            <p className="hp-brand-mark" style={{ marginBottom: '1.25rem' }}>
              <span className="hp-brand-mark__name" style={{ color: 'var(--teal-600)' }}>Serenest Academy</span>
              <span className="ed-mono" style={{ display: 'block', marginTop: '0.5rem', color: 'var(--brown)' }}>
                Clinical education · Professional practice
              </span>
            </p>
            <h1 id="academy-hero-title" style={{ maxWidth: '14ch' }}>
              Learning that strengthens practice.
            </h1>
            <p className="ed-lede" style={{ marginTop: '1.25rem' }}>
              Practical, clinically grounded education for mental health professionals.
              Learn. Apply. Grow.
            </p>
            {isProfessional ? (
              <p className="ed-aside__note" role="status" style={{ marginTop: '1.25rem', maxWidth: '36rem' }}>
                <strong>Free for Serenest professionals.</strong>{' '}
                Your approved practice account includes Academy at no charge.
              </p>
            ) : null}
            <div className="hp-hero__actions" style={{ marginTop: '1.75rem' }}>
              <a className="btn btn-primary btn-lg" href="#programs">Explore programs</a>
              <Link className="btn btn-ghost btn-lg" to="/academy/programs">View all courses</Link>
            </div>
          </div>
          <figure className="ed-figure" style={{ margin: 0 }}>
            <div className="ed-figure__media">
              <ImagePlaceholder
                asset="academy-hero-desk-books.jpg"
                src="/images/editorial/academy-study-desk-v1.jpg"
                alt="A study desk with books, notes, reading glasses, and a fountain pen"
                loading="eager"
              />
            </div>
            <figcaption className="ed-mono">Desk still life · study materials, no people</figcaption>
          </figure>
        </div>
      </section>

      {/* Quiet text index instead of sticky pill nav */}
      <nav className="ed-pace-tight" aria-label="On this page" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="ed-shell" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem' }}>
          {[
            ['#teach', 'What we teach'],
            ['#why', 'Why Academy'],
            ['#programs', 'Featured programs'],
            ['#experience', 'Learning experience'],
            ['#faculty', 'Faculty'],
            ['#faq', 'FAQ'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="ed-mono" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* Live updates — ruled index, no pastel chips */}
      {liveContent.length > 0 && (
        <section className="ed-pace-tight" aria-label="Latest updates">
          <div className="ed-shell">
            {pinnedItems.length > 0 && (
              <div className="ed-aside" style={{ marginBottom: '2rem' }}>
                <p className="ed-aside__label">Pinned</p>
                <div>
                  <h2 style={{ fontSize: '1.45rem', marginBottom: '0.5rem' }}>{pinnedItems[0].title}</h2>
                  {pinnedItems[0].body && <p style={{ color: 'var(--muted)' }}>{pinnedItems[0].body}</p>}
                  {pinnedItems[0].link && (
                    <p style={{ marginTop: '0.75rem' }}>
                      <a className="ed-link" href={pinnedItems[0].link}>
                        {pinnedItems[0].link_label || 'Learn more'}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}
            {regularItems.length > 0 && (
              <>
                <header className="ed-head">
                  <span className="ed-head__label">Updates</span>
                  <h2>Latest from the Academy</h2>
                </header>
                <div className="ed-index">
                  {regularItems.map((item, i) => (
                    <div key={item.id} className="ed-index__row">
                      <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                      <span>
                        <h3 className="ed-index__title">{item.title}</h3>
                        {item.type && <span className="ed-index__meta">{String(item.type).replace('_', ' ')}</span>}
                      </span>
                      <p className="ed-index__body">{item.body}</p>
                      {item.link ? (
                        <a className="ed-index__go" href={item.link}>{item.link_label || 'Open'} →</a>
                      ) : (
                        <span className="ed-index__go" aria-hidden="true" />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* What we teach — numbered index, no icons */}
      <section id="teach" className="ed-pace ed-band-soft" aria-labelledby="teach-title">
        <div className="ed-shell">
          <header className="ed-head">
            <span className="ed-head__label">Curriculum domains</span>
            <h2 id="teach-title">What we teach</h2>
            <p>Seven domains that recur across programs — from assessment to professional growth.</p>
          </header>
          <div className="ed-index">
            {WHAT_WE_TEACH.map((item, i) => (
              <div key={item.title} className="ed-index__row">
                <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{item.title}</h3>
                </span>
                <p className="ed-index__body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why + pull quote */}
      <section id="why" className="ed-pace" aria-labelledby="why-title">
        <div className="ed-shell ed-facing">
          <div>
            <header className="ed-head">
              <span className="ed-head__label">Approach</span>
              <h2 id="why-title">Why learn with Serenest Academy</h2>
            </header>
            <ol className="ed-timeline">
              {WHY_LEARN.map((item, i) => (
                <li key={item}>
                  <span className="ed-timeline__stage">0{i + 1}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
            <p style={{ marginTop: '1.5rem' }}>
              <a href={INSTRUCTOR_MAILTO} className="ed-link">Ask about teaching with us</a>
            </p>
          </div>
          <div>
            <figure className="ed-figure" style={{ margin: 0 }}>
              <div className="ed-figure__media">
                <ImagePlaceholder
                  asset="academy-consultation-room.jpg"
                  src="/images/editorial/academy-teaching-room-v1.png"
                  alt="An intimate teaching room with notebooks and a whiteboard"
                />
              </div>
            </figure>
            <blockquote className="ed-pull" style={{ marginTop: '1.5rem' }}>
              <p>“Education is not just information. It is transformation in practice.”</p>
              <cite>Serenest Academy</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Full program catalogue — same completeness as /academy/programs */}
      <section id="programs" className="ed-pace ed-band-soft" aria-labelledby="programs-title">
        <div className="ed-shell">
          <header className="ed-head ed-head--wide">
            <span className="ed-head__label">Programs</span>
            <h2 id="programs-title">Full Academy catalogue</h2>
            <p>
              All {ACADEMY_PROGRAMS.length} programs — Career Entry, Clinical Practice, and Professional Growth.
              Open any row for the full synopsis (what you&apos;ll learn, who it&apos;s for, format).
            </p>
          </header>

          {(() => {
            let n = 0;
            return ACADEMY_CATEGORIES.map((cat) => (
              <div key={cat.label} style={{ marginTop: '2rem' }}>
                <div className="ed-aside" style={{ marginBottom: '0.75rem' }}>
                  <div>
                    <p className="ed-aside__label">{cat.label}</p>
                    <p className="ed-aside__note">{cat.tagline}</p>
                  </div>
                  <div />
                </div>
                <div className="ed-index">
                  {ACADEMY_PROGRAMS.filter((p) => p.category === cat.label).map((p) => {
                    n += 1;
                    const duration = p.metrics?.[0];
                    return (
                      <Link key={p.slug} to={`/academy/programs/${p.slug}`} className="ed-index__row">
                        <span className="ed-index__num">{String(n).padStart(2, '0')}</span>
                        <span>
                          <h3 className="ed-index__title">{p.title}</h3>
                          <span className="ed-index__meta">
                            {p.subtitle}
                            {duration ? ` · ${duration.top} ${duration.sub}` : ''}
                          </span>
                        </span>
                        <p className="ed-index__body">{p.body}</p>
                        <span className="ed-index__go">Synopsis →</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ));
          })()}

          <p style={{ marginTop: '1.5rem' }}>
            Prefer a guided sequence?{' '}
            <Link className="ed-link" to="/academy/learning-paths">View learning paths</Link>
            {' · '}
            <Link className="ed-link" to="/academy/programs">Programs page</Link>
          </p>
        </div>
      </section>

      {/* Learning experience — timeline */}
      <section id="experience" className="ed-pace" aria-labelledby="experience-title">
        <div className="ed-shell ed-facing">
          <header className="ed-head">
            <span className="ed-head__label">Learning experience</span>
            <h2 id="experience-title">How a program typically moves</h2>
            <p>A deliberate sequence from concept to supervised application.</p>
          </header>
          <ol className="ed-timeline">
            {LEARNING_EXPERIENCE.map((step) => (
              <li key={step.title}>
                <span className="ed-timeline__stage">{step.stage}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Faculty — one real person + honest roster note */}
      <section id="faculty" className="ed-pace ed-band-soft" aria-labelledby="faculty-title">
        <div className="ed-shell ed-aside">
          <div>
            <p className="ed-aside__label">Faculty</p>
            <p className="ed-aside__note" style={{ marginTop: '1rem' }}>
              The roster lists only people who teach with us. It grows as programs expand —
              we do not invent names to fill a page.
            </p>
          </div>
          <div>
            <h2 id="faculty-title" style={{ marginBottom: '1.25rem' }}>Learn from practising clinicians</h2>
            <div className="ed-facing">
              <div>
                <p className="ed-mono">Director</p>
                <h3 style={{ marginTop: '0.35rem' }}>Dr. Chirag Aambalia</h3>
                <p style={{ color: 'var(--muted)', marginTop: '0.35rem' }}>Psychiatrist &amp; Founder</p>
                <p style={{ marginTop: '1rem', maxWidth: '36ch', color: 'var(--muted)' }}>
                  Clinical oversight of Academy curriculum sits beside an active psychiatry practice —
                  teaching informed by current care, not abstracted theory alone.
                </p>
              </div>
              <div>
                <p className="ed-mono">Growing roster</p>
                <h3 style={{ marginTop: '0.35rem' }}>Apply to teach</h3>
                <p style={{ color: 'var(--muted)', marginTop: '0.5rem', maxWidth: '34ch' }}>
                  Clinician faculty are added as programs need them. If you teach from practice, write to us.
                </p>
                <p style={{ marginTop: '1.25rem' }}>
                  <a href={INSTRUCTOR_MAILTO} className="btn btn-primary">Apply to teach</a>
                  {' '}
                  <Link to="/academy/faculty" className="btn btn-ghost" style={{ marginLeft: '0.5rem' }}>Faculty page</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations index */}
      <section className="ed-pace" aria-labelledby="destinations-title">
        <div className="ed-shell">
          <header className="ed-head">
            <span className="ed-head__label">Navigate</span>
            <h2 id="destinations-title">Academy sections</h2>
          </header>
          <div className="ed-index">
            {ACADEMY_DESTINATIONS.map((item, i) => (
              <Link key={item.href} to={item.href} className="ed-index__row">
                <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{item.title}</h3>
                </span>
                <p className="ed-index__body">{item.body}</p>
                <span className="ed-index__go">Open →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="ed-pace ed-band-soft" aria-labelledby="faq-title">
        <div className="ed-shell ed-shell--narrow">
          <header className="ed-head">
            <span className="ed-head__label">FAQ</span>
            <h2 id="faq-title">Frequently asked questions</h2>
          </header>
          <FaqAccordion items={ACADEMY_FAQS} />
          <p style={{ marginTop: '1.5rem', color: 'var(--muted)' }}>
            Still have questions?{' '}
            <a
              href="mailto:support@serenest.in?subject=Serenest%20Academy%20Query"
              className="ed-link"
            >
              Email us
            </a>
            .
          </p>
        </div>
      </section>

      <AcademyGuide />

      {/* One full-width band */}
      <section className="ed-band" aria-labelledby="academy-cta-title">
        <div className="ed-shell ed-facing">
          <div>
            <p className="ed-mono" style={{ color: 'rgba(255,255,255,0.65)' }}>Serenest Academy</p>
            <h2 id="academy-cta-title" style={{ marginTop: '0.75rem', maxWidth: '16ch' }}>
              Ready to strengthen your practice?
            </h2>
            <p style={{ marginTop: '0.75rem', maxWidth: '36ch' }}>
              Explore programs and find the learning path that matches where you are.
            </p>
          </div>
          <div style={{ alignSelf: 'end' }}>
            <a href="#programs" className="btn btn-ghost-dark btn-lg">Explore programs</a>
          </div>
        </div>
        <div className="ed-shell" style={{ marginTop: '2rem' }}>
          <p className="ed-mono" style={{ color: 'rgba(255,255,255,0.55)', textTransform: 'none', letterSpacing: 0, fontWeight: 400, lineHeight: 1.55 }}>
            Serenest Academy programs support professional learning and skill development.
            They do not replace a recognised degree, professional registration, supervised
            clinical requirements, or legal scope of practice.
          </p>
        </div>
      </section>

    </div>
  );
}
