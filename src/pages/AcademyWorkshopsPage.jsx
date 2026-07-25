import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import '../styles/service-detail.css';
import '../styles/editorial-structures.css';

/* How a workshop runs. Real structural information, so the empty
   state still tells a prospective attendee something useful rather
   than only apologising for having no dates. */
const FORMAT = [
  {
    tag: 'Live',
    title: 'Two to three hours, online',
    body: 'Small cohorts so there is room to ask questions and work through material together.',
  },
  {
    tag: 'Case-led',
    title: 'Built on real presentations',
    body: 'Anonymised case material rather than abstract theory, with time set aside for discussion.',
  },
  {
    tag: 'Recorded',
    title: 'Available afterwards',
    body: 'Registered attendees keep access to the recording where the faculty member permits it.',
  },
];

export default function AcademyWorkshopsPage() {
  useSEO({
    path: '/academy/workshops',
    title: 'Serenest Academy — Workshops',
    description: 'Live and recorded workshops from Serenest Academy for mental health professionals.',
  });

  // No workshops are scheduled. Nothing is invented to fill the page.
  const upcoming = [];

  return (
    <div className="svd-page">
      <section className="svd-hero ed-pace-open">
        <div className="container">
          <p className="svd-eyebrow">Serenest Academy · Workshops</p>
          <h1 style={{ maxWidth: '15ch' }}>Short, focused sessions on one clinical topic</h1>
          <p className="ed-lede" style={{ marginTop: '1.25rem' }}>
            Live and recorded workshops, taught by practising professionals — narrower than a
            program, and shorter.
          </p>
        </div>
      </section>

      <section className="svd-section ed-pace">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Scheduled</p>
            <p className="ed-aside__note">
              Dates are published here once faculty and cohort are confirmed.
            </p>
          </div>
          <div>
            {upcoming.length > 0 ? (
              <div className="ed-index">
                {upcoming.map((w, i) => (
                  <Link key={w.slug} to={w.href} className="ed-index__row">
                    <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <h2 className="ed-index__title">{w.title}</h2>
                      <span className="ed-index__meta">{w.date}</span>
                    </span>
                    <p className="ed-index__body">{w.body}</p>
                    <span className="ed-index__go">Register →</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--ink)', paddingTop: '1.75rem' }}>
                <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 600, marginBottom: '0.75rem', maxWidth: '22ch' }}>
                  No workshops are scheduled at the moment.
                </h2>
                <p className="ed-measure" style={{ margin: '0 0 1.5rem', lineHeight: 1.7, color: 'var(--ink-2)' }}>
                  Rather than list dates we can&apos;t honour, this page stays empty until a
                  session is confirmed. The self-paced programs run continuously in the meantime.
                </p>
                <div className="svd-cta__actions">
                  <Link className="btn btn-primary" to="/academy/programs">Explore programs</Link>
                  <Link className="btn btn-ghost" to="/academy/learning-paths">See learning paths</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="svd-section svd-section--soft ed-pace">
        <div className="container">
          <div className="ed-head ed-measure-wide">
            <span className="ed-head__label">Format</span>
            <h2>How a Serenest workshop runs</h2>
          </div>
          <ol className="ed-timeline">
            {FORMAT.map((item) => (
              <li key={item.tag}>
                <span className="ed-timeline__stage">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="svd-section ed-pace-tight">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Stay informed</p>
          </div>
          <p className="ed-measure" style={{ margin: 0, lineHeight: 1.7, color: 'var(--ink-2)' }}>
            To hear when a workshop opens,{' '}
            <a href="mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20Workshop%20notifications" className="ed-link">
              write to us
            </a>{' '}
            and we&apos;ll add you to the list for the topics you name.
          </p>
        </div>
      </section>
    </div>
  );
}
