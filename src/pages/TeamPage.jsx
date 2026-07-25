import React from 'react';
import { Link } from 'react-router-dom';
import { TEAM_MEMBERS } from '../lib/team';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import ImagePlaceholder from '../components/ImagePlaceholder';
import '../styles/editorial-structures.css';
import '../styles/service-detail.css';

/* How the network is run. Presented as an annotated set rather than
   three equal cards — each point is a different kind of commitment. */
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

export default function TeamPage() {
  useSEO({ path: '/team', ...ROUTE_SEO['/team'] });

  const [lead, ...rest] = TEAM_MEMBERS;

  return (
    <div className="team-page">
      {/* Opener: title left, portrait right — the page's one real
          human asset gets the entry position. */}
      <section className="tm-hero ed-pace">
        <div className="container svd-split">
          <div>
            <p className="tm-eyebrow">Our team</p>
            <h1 className="tm-hero__title">The clinicians and operators behind Serenest.</h1>
            <p className="ed-lede" style={{ marginTop: '1.1rem' }}>
              A verified network of psychiatrists, psychologists, and counsellors — every
              profile carries qualifications, focus areas, languages, and registration details.
            </p>
          </div>
          <div className="svd-split__media">
            <ImagePlaceholder
              asset="team-founder-portrait.jpg"
              direction="Environmental portrait of Dr. Aambalia in his consulting room, seated, natural light, looking to camera. Not a studio headshot."
            />
          </div>
        </div>
      </section>

      {/* The founder gets a full editorial profile, not a card. */}
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

      {/* Any additional members listed after the founder. */}
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

      {/* An honest note about roster size, set as a marginal aside
          rather than dressed up as a card. */}
      <section className="svd-section ed-pace-tight">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Joining</p>
          </div>
          <p className="ed-measure" style={{ margin: 0, lineHeight: 1.7, color: 'var(--ink-2)' }}>
            The roster grows as advisors and collaborators come on board, and every clinician
            listed has completed verification. If you're a verified psychiatrist, psychologist,
            or counsellor,{' '}
            <Link to="/professionals/apply" className="ed-link">apply to join Serenest</Link>{' '}
            or <a href="mailto:support@serenest.in" className="ed-link">email us</a>.
          </p>
        </div>
      </section>

      {/* How the network runs — a timeline, since these are stages of
          the same commitment rather than parallel features. */}
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
