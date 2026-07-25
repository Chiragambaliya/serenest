import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { TEAM_MEMBERS } from '../lib/team';
import ImagePlaceholder from '../components/ImagePlaceholder';
import '../styles/service-detail.css';
import '../styles/editorial-structures.css';

const INSTRUCTOR_MAILTO =
  'mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20Become%20an%20Instructor';

/* What we ask of faculty. Stated plainly rather than dressed up as
   selling points — this page is read by prospective teachers. */
const EXPECTATIONS = [
  {
    tag: 'Practising',
    title: 'Active clinical practice',
    body: 'Faculty teach from current casework, not from memory of it.',
  },
  {
    tag: 'Case-based',
    title: 'Real material, anonymised',
    body: 'Sessions are built on real presentations, with identifying detail removed.',
  },
  {
    tag: 'Scope',
    title: 'Teaching within scope',
    body: 'Faculty teach what they are qualified and registered to practise — nothing beyond it.',
  },
];

export default function AcademyFacultyPage() {
  useSEO({
    path: '/academy/faculty',
    title: 'Serenest Academy — Faculty',
    description: 'Meet the clinicians teaching Serenest Academy programs, and how to apply to teach.',
  });

  const lead = TEAM_MEMBERS[0];

  return (
    <div className="svd-page">
      <section className="svd-hero ed-pace">
        <div className="container svd-split">
          <div>
            <p className="svd-eyebrow">Serenest Academy · Faculty</p>
            <h1>Learn from practising clinicians</h1>
            <p className="ed-lede" style={{ marginTop: '1.1rem' }}>
              Every Academy program is taught by someone who still sees patients. The roster is
              small and growing deliberately.
            </p>
          </div>
          <div className="svd-split__media">
            <ImagePlaceholder
              asset="academy-faculty-teaching.jpg"
              direction="A clinician mid-teaching beside a whiteboard with a case formulation sketched out. Room, not studio. No identifiable patient material."
            />
          </div>
        </div>
      </section>

      {/* The one real faculty member gets a full profile. */}
      {lead && (
        <section className="svd-section ed-pace">
          <div className="container ed-aside">
            <div>
              <p className="ed-aside__label">Faculty</p>
              <p className="ed-aside__note">{lead.credentials?.join(' · ')}</p>
            </div>
            <div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 600, marginBottom: '0.3rem' }}>
                {lead.name}
              </h2>
              <p className="ed-index__meta" style={{ marginBottom: '1.5rem' }}>{lead.role}</p>
              <div className="ed-measure">
                {(Array.isArray(lead.bio) ? lead.bio : [lead.bio]).map((para) => (
                  <p key={para} style={{ marginBottom: '1rem', lineHeight: 1.7, color: 'var(--ink-2)' }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Honest note on roster size, held in the margin. */}
      <section className="svd-section ed-pace-tight">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Roster</p>
          </div>
          <p className="ed-measure" style={{ margin: 0, lineHeight: 1.7, color: 'var(--ink-2)' }}>
            We list faculty only once they are teaching a live program, so this page grows as
            programs do. We would rather show one real name than a page of placeholders.
          </p>
        </div>
      </section>

      <section className="svd-section svd-section--soft ed-pace">
        <div className="container">
          <div className="ed-head ed-measure-wide">
            <span className="ed-head__label">What we ask</span>
            <h2>How Serenest Academy faculty teach</h2>
          </div>
          <ol className="ed-timeline">
            {EXPECTATIONS.map((item) => (
              <li key={item.tag}>
                <span className="ed-timeline__stage">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ed-band">
        <div className="container">
          <p className="ed-band__quote">Interested in teaching with us?</p>
          <p style={{ maxWidth: '42ch', marginTop: '1.25rem', lineHeight: 1.7 }}>
            We read every application and reply when there is a fit. Tell us what you practise,
            where you are registered, and what you would want to teach.
          </p>
          <p style={{ marginTop: '1.75rem' }}>
            <a href={INSTRUCTOR_MAILTO} className="btn btn-lg" style={{ background: 'var(--bg)', color: 'var(--teal-600)', borderColor: 'var(--bg)' }}>
              Apply to teach
            </a>
          </p>
        </div>
      </section>

      <section className="svd-section ed-pace-tight">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Elsewhere</p>
          </div>
          <p className="ed-measure" style={{ margin: 0, lineHeight: 1.7, color: 'var(--ink-2)' }}>
            Faculty listed here teach Academy programs. For the clinicians who see patients on
            Serenest, see{' '}
            <Link to="/team" className="ed-link">our team</Link>, or browse{' '}
            <Link to="/academy/programs" className="ed-link">all programs</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
