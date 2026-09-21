import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TEAM_MEMBERS } from '../lib/team';
import { professionals as professionalsApi } from '../lib/api';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import ImagePlaceholder from '../components/ImagePlaceholder';
import '../styles/editorial-structures.css';
import '../styles/service-detail.css';

const ROLE_ORDER = ['psychiatrist', 'psychologist', 'therapist', 'counsellor'];

const ROLE_LABELS = {
  psychiatrist: 'Psychiatrists',
  psychologist: 'Psychologists',
  therapist: 'Therapists',
  counsellor: 'Counsellors',
};

const NETWORK = [
  {
    tag: 'Verification',
    title: 'Verification-first onboarding',
    body: 'Clinicians join only after credential and registration checks aligned with how we advertise care.',
  },
  {
    tag: 'Coordination',
    title: 'Hands-on care coordination',
    body: 'Our team handles bookings, confirmations, and hand-offs so clinicians focus on sessions.',
  },
  {
    tag: 'Partners',
    title: 'Aligned partnerships',
    body: 'We collaborate with universities, workplaces, and health teams scaling access responsibly.',
  },
];

function initials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

/** Founder also appears in the approved directory — keep them in the Founder block only. */
function isFounderDuplicate(fullName) {
  const n = String(fullName || '').toLowerCase().replace(/[^a-z]/g, '');
  return n.includes('chirag') && (n.includes('ambal') || n.includes('aambal'));
}

export default function TeamPage() {
  useSEO({ path: '/team', ...ROUTE_SEO['/team'] });

  const [lead, ...rest] = TEAM_MEMBERS;
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await professionalsApi.directory();
        if (cancelled) return;
        const list = (r.professionals ?? []).filter((p) => !isFounderDuplicate(p.full_name));
        setRoster(list);
        setError(null);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load team roster');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const grouped = useMemo(() => {
    const byRole = Object.fromEntries(ROLE_ORDER.map((r) => [r, []]));
    for (const p of roster) {
      const key = ROLE_ORDER.includes(p.role) ? p.role : 'counsellor';
      byRole[key].push(p);
    }
    return ROLE_ORDER
      .map((role) => ({ role, label: ROLE_LABELS[role], members: byRole[role] }))
      .filter((g) => g.members.length > 0);
  }, [roster]);

  const rosterCount = roster.length + (lead ? 1 : 0);

  return (
    <div className="team-page">
      <section className="tm-hero ed-pace">
        <div className="container svd-split">
          <div>
            <p className="tm-eyebrow">Our team</p>
            <h1 className="tm-hero__title">The clinicians and operators behind Serenest.</h1>
            <p className="ed-lede" style={{ marginTop: '1.1rem' }}>
              {loading
                ? 'Loading our verified psychiatrists, psychologists, therapists, and counsellors…'
                : `${rosterCount} verified clinicians — psychiatrists and psychologists together with therapists and counsellors. Every profile carries qualifications, languages, and focus areas.`}
            </p>
            <div className="tm-hero__actions" style={{ marginTop: '1.25rem' }}>
              <Link className="btn btn-primary" to="/patient/find-professional">
                Browse clinicians
              </Link>
              <Link className="btn btn-ghost" to="/book">
                Book a consultation
              </Link>
            </div>
          </div>
          <div className="svd-split__media">
            <ImagePlaceholder
              asset="team-founder-portrait.jpg"
              direction="A thoughtful, unoccupied consulting room. A real founder portrait can replace this image when available."
              src="/images/editorial/team-consulting-room-v1.png"
              alt="A calm consulting room with a desk, visitor chair, and books"
            />
          </div>
        </div>
      </section>

      {lead && (
        <section className="svd-section ed-pace">
          <div className="container ed-aside">
            <div>
              <p className="ed-aside__label">Founder</p>
              <p className="ed-aside__note">
                {lead.credentials?.join(' · ')}
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 600, marginBottom: '0.3rem' }}>
                {lead.name}
              </h2>
              {lead.role && (
                <p className="ed-index__meta" style={{ marginBottom: '0.2rem' }}>{lead.role}</p>
              )}
              {lead.subtitle && (
                <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  {lead.subtitle}
                </p>
              )}
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

      {rest.length > 0 && (
        <section className="svd-section ed-pace-tight">
          <div className="container">
            <div className="ed-index">
              {rest.map((m) => (
                <div key={m.name} className="ed-index__row">
                  <span className="ed-index__num" aria-hidden="true">{m.initials}</span>
                  <span>
                    <h3 className="ed-index__title">{m.name}</h3>
                    {m.role && <span className="ed-index__meta">{m.role}</span>}
                  </span>
                  <p className="ed-index__body">
                    {Array.isArray(m.bio) ? m.bio[0] : m.bio}
                  </p>
                  <span />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="svd-section ed-pace-tight">
        <div className="container">
          <div className="ed-head ed-measure-wide" style={{ marginBottom: '1.5rem' }}>
            <span className="ed-head__label">Clinical network</span>
            <h2>Psychiatrists, psychologists, and allied clinicians</h2>
            <p style={{ margin: '0.5rem 0 0', color: 'var(--muted)', maxWidth: '52ch' }}>
              Live roster of approved Serenest clinicians. Book any of them from Find a professional.
            </p>
          </div>

          {error && (
            <p style={{ color: '#b45309', marginBottom: '1rem' }}>
              {error} — you can still{' '}
              <Link to="/patient/find-professional" className="ed-link">browse clinicians</Link>.
            </p>
          )}

          {loading && (
            <p style={{ color: 'var(--muted)' }}>Loading clinicians…</p>
          )}

          {!loading && !error && roster.length === 0 && (
            <p style={{ color: 'var(--muted)' }}>
              Clinicians appear here after verification.{' '}
              <Link to="/professionals/apply" className="ed-link">Apply to join</Link>.
            </p>
          )}

          {grouped.map((g) => (
            <div key={g.role} className="tm-role-block">
              <h3 className="tm-role-heading">
                {g.label} <span className="tm-role-count">({g.members.length})</span>
              </h3>
              <div className="tm-roster">
                {g.members.map((p) => (
                  <article key={p.id} className="tm-roster-card">
                    <div className="tm-roster-card__head">
                      <span className="tm-roster-card__avatar" aria-hidden="true">
                        {initials(p.full_name)}
                      </span>
                      <div>
                        <h4 className="tm-roster-card__name">{p.full_name}</h4>
                        <p className="tm-roster-card__meta">
                          {p.role_label || ROLE_LABELS[p.role]?.replace(/s$/, '') || p.role}
                          {p.city ? ` · ${p.city}` : ''}
                        </p>
                      </div>
                    </div>
                    {p.degree && (
                      <p className="tm-roster-card__detail">{p.degree}</p>
                    )}
                    {p.specialities && (
                      <p className="tm-roster-card__detail">{p.specialities}</p>
                    )}
                    {p.languages && (
                      <p className="tm-roster-card__langs">{p.languages}</p>
                    )}
                    <Link
                      className="tm-roster-card__link"
                      to={`/patient/find-professional?role=${encodeURIComponent(p.role || '')}`}
                    >
                      View in directory →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="svd-section ed-pace-tight">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Joining</p>
          </div>
          <p className="ed-measure" style={{ margin: 0, lineHeight: 1.7, color: 'var(--ink-2)' }}>
            The roster updates as clinicians are verified. If you&apos;re a psychiatrist, psychologist,
            therapist, or counsellor,{' '}
            <Link to="/professionals/apply" className="ed-link">apply to join Serenest</Link>{' '}
            or <a href="mailto:support@serenest.in" className="ed-link">email us</a>.
          </p>
        </div>
      </section>

      <section className="svd-section svd-section--soft ed-pace">
        <div className="container">
          <div className="ed-head ed-measure-wide">
            <span className="ed-head__label">Beyond HQ</span>
            <h2>A verified clinician network across India</h2>
          </div>
          <ol className="ed-timeline">
            {NETWORK.map((item) => (
              <li key={item.tag}>
                <span className="ed-timeline__stage">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="tm-cta">
        <div className="container tm-cta__inner">
          <div>
            <h2>Want to work with us?</h2>
            <p>
              Clinicians can apply to join Serenest. Patients can book a verified clinician
              in minutes.
            </p>
          </div>
          <div className="tm-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/professionals/apply">
              Apply as a professional
            </Link>
            <Link className="btn btn-ghost btn-lg" to="/book">
              Book a consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
