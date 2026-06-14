import React from 'react';
import { Link } from 'react-router-dom';
import { TEAM_MEMBERS } from '../lib/team';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

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

  return (
    <div className="team-page">
      <section className="tm-hero">
        <div className="container tm-hero__inner">
          <p className="tm-eyebrow">Our team</p>
          <h1 className="tm-hero__title">
            The clinicians and operators behind Serenest.
          </h1>
          <p className="tm-hero__lead">
            A carefully verified network of psychiatrists, psychologists, and counsellors —
            each profile lists qualifications, focus areas, languages, and registration details.
          </p>
        </div>
      </section>

      <section className="tm-section">
        <div className="container">
          <header className="tm-section__head">
            <p className="tm-eyebrow">People</p>
            <h2>Leadership &amp; core team</h2>
            <p>
              We expand this roster as advisors and core collaborators come on board. Every clinician
              listed has completed verification.
            </p>
          </header>

          <div className="tm-members">
            {TEAM_MEMBERS.map((m) => (
              <article key={m.name} className="tm-member">
                <div className="tm-member__head">
                  <div className="tm-member__avatar" aria-hidden="true">
                    {m.initials}
                  </div>
                  <div>
                    <h3 className="tm-member__name">{m.name}</h3>
                    {m.role && <p className="tm-member__role">{m.role}</p>}
                    {m.subtitle && <p className="tm-member__sub">{m.subtitle}</p>}
                  </div>
                </div>

                <div className="tm-member__bio">
                  {(Array.isArray(m.bio) ? m.bio : [m.bio]).map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>

                {m.credentials?.length ? (
                  <div className="tm-creds" aria-label="Credentials">
                    {m.credentials.map((c) => (
                      <span key={c} className="tm-cred">{c}</span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <p className="tm-apply">
            Are you a verified psychiatrist, psychologist, or counsellor?{' '}
            <Link to="/professionals/apply">Apply to join Serenest</Link>{' '}
            or <a href="mailto:support@serenest.in">email us</a>.
          </p>
        </div>
      </section>

      <section className="tm-section tm-section--cream" aria-label="Extended network">
        <div className="container">
          <header className="tm-section__head">
            <p className="tm-eyebrow">Beyond HQ</p>
            <h2>A verified clinician network across India</h2>
          </header>

          <div className="tm-grid tm-grid--3">
            {NETWORK.map((item) => (
              <article key={item.tag} className="tm-card">
                <span className="tm-card__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>

          <p className="tm-links">
            Read the fuller story on{' '}
            <Link to="/about">About Serenest</Link>{' '}— or browse{' '}
            <Link to="/patient/find-professional">verified professionals</Link>.
            To book, see our{' '}
            <Link to="/services">services overview</Link>.
          </p>
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
