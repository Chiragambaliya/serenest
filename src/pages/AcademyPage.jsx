import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useProfessionalAccess } from '../lib/useProfessionalAccess';
import {
  ACADEMY_PROGRAMS,
  FEATURED_PROGRAMS,
  PROGRAMS_BY_SLUG,
} from '../lib/academyPrograms';
import { ACADEMY_FAQS } from '../lib/academyFaqs';
import AcademyGuide from '../components/AcademyGuide';
import FaqAccordion from '../components/FaqAccordion';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { academyContent } from '../lib/api';
import '../styles/academy.css';
import '../styles/academy-world.css';

const FLAGSHIP = PROGRAMS_BY_SLUG['clinical-excellence'];

const WHAT_WE_TEACH = [
  {
    title: 'Clinical Psychiatry',
    body: 'Assessment, diagnosis, and evidence-based management for common and complex presentations — framed for Indian practice settings.',
    touch: 'Clinical Excellence · Psychiatry Training',
  },
  {
    title: 'Psychopharmacology',
    body: 'Practical prescribing principles, safety conversations, and medication management that respect scope and telemedicine norms.',
    touch: 'Psychiatry Training · Clinical Excellence',
  },
  {
    title: 'Psychotherapy',
    body: 'Major therapy approaches with technique, formulation, and supervision pathways — not theory left floating above the session.',
    touch: 'Counselling Skills · Clinical Excellence',
  },
  {
    title: 'Addiction and Recovery',
    body: 'Counselling, relapse prevention, and recovery-oriented care for substance use, with clear boundaries and referral judgment.',
    touch: 'Clinical Practice tracks',
  },
  {
    title: 'Crisis and Risk Management',
    body: 'Suicide-risk assessment, crisis intervention, safety planning, and knowing when remote care must escalate.',
    touch: 'Clinical Excellence · Psychiatry Training',
  },
  {
    title: 'Digital Mental Health',
    body: 'Technology, ethics, documentation, and continuity when care moves to video, audio, or chat.',
    touch: 'Digital Mental Health · Clinical Excellence',
  },
  {
    title: 'Research and Professional Growth',
    body: 'Clinical writing, reflective practice, CPD, and the habits that keep a career sharp after the certificate ends.',
    touch: 'Research · CPD · Mentorship',
  },
];

const WHY_LEARN = [
  {
    title: 'Taught from practice',
    body: 'Curriculum oversight sits beside an active clinical service — cases, constraints, and judgment from real work.',
  },
  {
    title: 'Case before syllabus padding',
    body: 'Modules favour clinical usefulness: formulation, documentation, risk, and conversations you can use the same week.',
  },
  {
    title: 'Small cohorts, clear feedback',
    body: 'Live rounds and supervised exercises where programs include them — not anonymous slide decks alone.',
  },
  {
    title: 'India-context care',
    body: 'Telemedicine norms, DPDP-aware privacy, and practice realities that match how care actually runs here.',
  },
  {
    title: 'Scope stated plainly',
    body: 'Certificates mark completion of study. They do not invent registration, degrees, or legal authority to practise.',
  },
];

const LEARNING_EXPERIENCE = [
  {
    stage: '01 · Learn',
    title: 'Concepts that matter',
    body: 'Core ideas selected for clinical usefulness — assessment frames, formulations, and decision points.',
  },
  {
    stage: '02 · Observe',
    title: 'Cases and demonstrations',
    body: 'Real-world case material and supervised demonstration before you are asked to perform.',
  },
  {
    stage: '03 · Practise',
    title: 'Skill exercises',
    body: 'Role-plays, documentation drills, and structured practice with room to get it wrong safely.',
  },
  {
    stage: '04 · Feedback',
    title: 'Guided supervision',
    body: 'Reflection with faculty who still see patients — judgment sharpened, not just content delivered.',
  },
  {
    stage: '05 · Apply',
    title: 'Return to practice',
    body: 'Take the skill into clinical work with clearer boundaries, notes, and next steps.',
  },
];

const TEACHING_STANDARDS = [
  'Curriculum reviewed against current clinical usefulness, not trend cycles',
  'Faculty drawn from practising clinicians and verified educators',
  'Case material anonymised; patient dignity is non-negotiable',
  'Scope of practice stated on every program page',
  'No invented credentials, fake testimonials, or padded faculty grids',
];

const FEATURED_ON_HOME = (FEATURED_PROGRAMS.length >= 4
  ? FEATURED_PROGRAMS
  : [...FEATURED_PROGRAMS, ...ACADEMY_PROGRAMS.filter((p) => !p.featured)]
).slice(0, 4);

const INSTRUCTOR_MAILTO =
  'mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20Become%20an%20Instructor';

const ACADEMY_DESTINATIONS = [
  { title: 'All programs', body: 'The full numbered catalogue across career stages.', href: '/academy/programs' },
  { title: 'Learning paths', body: 'Sequences that group programs by where you are in practice.', href: '/academy/learning-paths' },
  { title: 'Workshops', body: 'Shorter intensives — dates published when scheduled.', href: '/academy/workshops' },
  { title: 'Faculty', body: 'Who teaches, teaching standards, and how to apply.', href: '/academy/faculty' },
  { title: 'FAQs', body: 'Scope, enrolment, certificates, and professional access.', href: '/academy/faqs' },
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
    <div className="eda-page academy-world">

      {/* Hero — institutional, brand-first */}
      <section className="aw-hero" aria-labelledby="academy-hero-title">
        <div className="ed-shell ed-facing">
          <div className="aw-hero__copy">
            <p className="aw-hero__brand">Serenest Academy</p>
            <p className="ed-mono aw-hero__meta">
              Clinical education beside a working practice
            </p>
            <h1 id="academy-hero-title" className="aw-hero__title">
              Learning that strengthens clinical judgment.
            </h1>
            <p className="aw-hero__lede">
              Case-based programs for psychiatrists, psychologists, therapists, counsellors,
              and trainees — designed where care actually happens, not in abstraction.
            </p>
            {isProfessional ? (
              <p className="aw-hero__note" role="status">
                <strong>Free for Serenest professionals.</strong>{' '}
                Your approved practice account includes Academy at no charge.
              </p>
            ) : (
              <p className="aw-hero__note">
                Approved Serenest clinicians receive Academy access free.
                External learners enrol per program.
              </p>
            )}
            <div className="hp-hero__actions aw-hero__actions">
              <Link className="btn btn-primary btn-lg" to="/academy/programs/clinical-excellence">
                Start Clinical Excellence
              </Link>
              <Link className="btn btn-ghost btn-lg" to="/academy/programs">
                View all programs
              </Link>
            </div>
          </div>
          <figure className="ed-figure aw-hero__figure">
            <div className="ed-figure__media">
              <ImagePlaceholder
                asset="academy-hero-desk-books.jpg"
                src="/images/editorial/academy-study-desk-v1.jpg"
                alt="A study desk with books, notes, reading glasses, and a fountain pen"
                loading="eager"
              />
            </div>
            <figcaption className="ed-mono">Study desk · materials for clinical learning</figcaption>
          </figure>
        </div>
      </section>

      <nav className="aw-toc" aria-label="On this page">
        <div className="ed-shell aw-toc__inner">
          {[
            ['#flagship', 'Flagship'],
            ['#teach', 'What we teach'],
            ['#why', 'Approach'],
            ['#programs', 'Programs'],
            ['#experience', 'Experience'],
            ['#faculty', 'Faculty'],
            ['#faq', 'FAQ'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="ed-mono aw-toc__link">
              {label}
            </a>
          ))}
        </div>
      </nav>

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
                        {item.type && (
                          <span className="ed-index__meta">{String(item.type).replace('_', ' ')}</span>
                        )}
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

      {/* Flagship prospectus — the strength of the school */}
      {FLAGSHIP && (
        <section id="flagship" className="ed-pace aw-flagship" aria-labelledby="flagship-title">
          <div className="ed-shell">
            <header className="ed-head ed-head--wide">
              <span className="ed-head__label">Flagship program</span>
              <h2 id="flagship-title">{FLAGSHIP.title}</h2>
              <p>{FLAGSHIP.subtitle}</p>
            </header>

            <div className="aw-flagship__grid">
              <div className="aw-flagship__main">
                <p className="aw-flagship__overview">{FLAGSHIP.overview}</p>
                <h3 className="aw-flagship__subhead">What you work through</h3>
                <ol className="aw-flagship__learn">
                  {FLAGSHIP.learn.slice(0, 6).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
                <div className="aw-flagship__actions">
                  <Link
                    className="btn btn-primary btn-lg"
                    to={`/academy/programs/${FLAGSHIP.slug}`}
                  >
                    {FLAGSHIP.ctaLabel || 'Open Clinical Excellence'}
                  </Link>
                  <Link className="btn btn-ghost btn-lg" to="/academy/learning-paths">
                    Find a learning path
                  </Link>
                </div>
              </div>

              <aside className="aw-flagship__aside" aria-label="Program at a glance">
                <p className="ed-mono">At a glance</p>
                <dl className="aw-glance">
                  {FLAGSHIP.metrics.map((m) => (
                    <div key={m.sub} className="aw-glance__row">
                      <dt>{m.sub}</dt>
                      <dd>{m.top}</dd>
                    </div>
                  ))}
                  <div className="aw-glance__row">
                    <dt>Format</dt>
                    <dd>{FLAGSHIP.format}</dd>
                  </div>
                </dl>
                <p className="ed-mono" style={{ marginTop: '1.75rem' }}>For</p>
                <ul className="aw-flagship__who">
                  {FLAGSHIP.forWho.map((who) => (
                    <li key={who}>{who}</li>
                  ))}
                </ul>
                {FLAGSHIP.highlights?.length ? (
                  <>
                    <p className="ed-mono" style={{ marginTop: '1.75rem' }}>Includes</p>
                    <ul className="aw-flagship__who">
                      {FLAGSHIP.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* Curriculum domains — deeper */}
      <section id="teach" className="ed-pace ed-band-soft" aria-labelledby="teach-title">
        <div className="ed-shell">
          <header className="ed-head">
            <span className="ed-head__label">Curriculum domains</span>
            <h2 id="teach-title">What we teach</h2>
            <p>
              Seven domains that recur across programs — assessment through professional growth.
              Each maps into one or more tracks in the catalogue.
            </p>
          </header>
          <div className="ed-index">
            {WHAT_WE_TEACH.map((item, i) => (
              <div key={item.title} className="ed-index__row">
                <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{item.title}</h3>
                  <span className="ed-index__meta">{item.touch}</span>
                </span>
                <p className="ed-index__body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section id="why" className="ed-pace" aria-labelledby="why-title">
        <div className="ed-shell ed-facing">
          <div>
            <header className="ed-head">
              <span className="ed-head__label">Approach</span>
              <h2 id="why-title">Why Serenest Academy</h2>
              <p>Education built beside a clinical service — responsible, applied, and honest about scope.</p>
            </header>
            <ol className="ed-timeline">
              {WHY_LEARN.map((item, i) => (
                <li key={item.title}>
                  <span className="ed-timeline__stage">0{i + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
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
              <figcaption className="ed-mono">Teaching room · quiet materials, no people</figcaption>
            </figure>
            <blockquote className="ed-pull aw-pull" style={{ marginTop: '1.5rem' }}>
              <p>“Education is not just information. It is transformation in practice.”</p>
              <cite>Serenest Academy</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Featured programs */}
      <section id="programs" className="ed-pace ed-band-soft" aria-labelledby="programs-title">
        <div className="ed-shell">
          <header className="ed-head ed-head--wide">
            <span className="ed-head__label">Programs</span>
            <h2 id="programs-title">Start with a clear entry point</h2>
            <p>
              Four openings from the fuller catalogue.{' '}
              <Link className="ed-link" to="/academy/programs">View all programs</Link>
            </p>
          </header>
          <div className="ed-index">
            {FEATURED_ON_HOME.map((p, i) => (
              <Link key={p.slug} to={`/academy/programs/${p.slug}`} className="ed-index__row">
                <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{p.title}</h3>
                  <span className="ed-index__meta">{p.category || p.subtitle || 'Program'}</span>
                </span>
                <p className="ed-index__body">{p.body}</p>
                <span className="ed-index__go">View →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Learning experience */}
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

      {/* Faculty + standards */}
      <section id="faculty" className="ed-pace ed-band-soft" aria-labelledby="faculty-title">
        <div className="ed-shell">
          <header className="ed-head">
            <span className="ed-head__label">Faculty</span>
            <h2 id="faculty-title">Practising clinicians. Honest roster.</h2>
            <p>
              We list only people who teach with us. The page grows as programs expand —
              we do not invent names to fill a grid.
            </p>
          </header>

          <div className="aw-faculty">
            <div className="aw-faculty__profile">
              <p className="ed-mono">Director</p>
              <h3>Dr. Chirag Aambalia</h3>
              <p className="aw-faculty__role">Psychiatrist &amp; Founder</p>
              <p className="aw-faculty__bio">
                Clinical oversight of Academy curriculum sits beside an active psychiatry practice —
                teaching informed by current care, not abstracted theory alone.
              </p>
              <div className="aw-faculty__actions">
                <a href={INSTRUCTOR_MAILTO} className="btn btn-primary">Apply to teach</a>
                <Link to="/academy/faculty" className="btn btn-ghost">Faculty page</Link>
              </div>
            </div>
            <aside className="aw-faculty__standards" aria-label="Teaching standards">
              <p className="ed-mono">Teaching standards</p>
              <ol className="ed-timeline">
                {TEACHING_STANDARDS.map((item, i) => (
                  <li key={item}>
                    <span className="ed-timeline__stage">0{i + 1}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </div>
      </section>

      {/* Destinations */}
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
            <h2 id="faq-title">Questions before you enrol</h2>
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

      {/* Closing band */}
      <section className="ed-band aw-close" aria-labelledby="academy-cta-title">
        <div className="ed-shell ed-facing">
          <div>
            <p className="ed-mono" style={{ color: 'rgba(255,255,255,0.65)' }}>Serenest Academy</p>
            <h2 id="academy-cta-title" style={{ marginTop: '0.75rem', maxWidth: '18ch' }}>
              Begin with the flagship — or find your path.
            </h2>
            <p style={{ marginTop: '0.75rem', maxWidth: '38ch' }}>
              Clinical Excellence for practising clinicians, or a learning path matched to where you are.
            </p>
          </div>
          <div className="aw-close__actions">
            <Link
              to="/academy/programs/clinical-excellence"
              className="btn btn-solid-light btn-lg"
              style={{
                background: '#fffdf8',
                color: '#3c4a2c',
                borderColor: '#fffdf8',
              }}
            >
              Clinical Excellence
            </Link>
            <Link to="/academy/programs" className="btn btn-ghost-dark btn-lg">
              All programs
            </Link>
          </div>
        </div>
        <div className="ed-shell" style={{ marginTop: '2rem' }}>
          <p
            className="ed-mono"
            style={{
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'none',
              letterSpacing: 0,
              fontWeight: 400,
              lineHeight: 1.55,
            }}
          >
            Serenest Academy programs support professional learning and skill development.
            They do not replace a recognised degree, professional registration, supervised
            clinical requirements, or legal scope of practice.
          </p>
        </div>
      </section>
    </div>
  );
}
