import React from 'react';
import { Link } from 'react-router-dom';
import { TEAM_MEMBERS } from '../lib/team';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

export default function TeamPage() {
  useSEO({ path: '/team', ...ROUTE_SEO['/team'] });
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Our team</p>
            <h1 className="page-title">
              Meet the clinicians and mental health professionals behind Serenest
            </h1>
            <p className="about-subtext">
              Serenest is building a carefully verified network of psychiatrists,
              psychologists, and counsellors for online mental health care in India.
              Each profile will include qualifications, areas of focus, consultation
              modes, languages, and registration details where applicable, so you can
              make an informed choice before booking.
            </p>
            <p className="about-subtext" style={{ marginTop: 12 }}>
              Our public clinician directory is being expanded in phases. Until every
              profile is verified and ready, we show only professionals whose details
              are complete. More profiles will be added as credential checks and
              onboarding are completed.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Leadership and team">
        <div className="container">
          <div className="section-head">
            <p className="section-label">People</p>
            <h2>Who you&apos;ll read about here</h2>
            <p className="muted" style={{ maxWidth: '62ch', marginTop: 8 }}>
              We&apos;ll expand this roster as advisors and core collaborators come on board. Have something to contribute?{' '}
              <Link to="/professionals/apply">Apply as a professional</Link>
              {' '}or{' '}
              <a href="mailto:support@serenest.in">email us</a>.
            </p>
          </div>

          <div className="team-members-grid">
            {TEAM_MEMBERS.map((m) => (
              <article key={m.name} className="tile team-member-card">
                <div className="team-member-top">
                  <div className="team-member-avatar" aria-hidden="true">
                    {m.initials}
                  </div>
                  <div>
                    <h3 className="team-member-name">{m.name}</h3>
                    <p className="team-member-role">{m.role}</p>
                    {m.subtitle ? (
                      <p className="team-member-sub muted" style={{ margin: '6px 0 0', fontSize: 14 }}>
                        {m.subtitle}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="team-member-bios">
                  {(Array.isArray(m.bio) ? m.bio : [m.bio]).map((para) => (
                    <p key={para} className="muted" style={{ margin: 0, lineHeight: 1.65, fontSize: 15 }}>
                      {para}
                    </p>
                  ))}
                </div>

                {m.credentials?.length ? (
                  <div className="team-member-creds" aria-label="Credentials">
                    {m.credentials.map((c) => (
                      <span key={c} className="cred-pill">{c}</span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" aria-label="Extended network">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Beyond HQ</p>
            <h2>A verified clinician network across India</h2>
          </div>
          <div className="grid-3">
            <article className="tile">
              <div className="feature-icon" aria-hidden="true">✅</div>
              <h3>Verification-first</h3>
              <p className="muted">
                Psychiatrists and psychologists onboard only after credential checks —
                registrations, licences, and practice norms aligned with how we advertise care.
              </p>
            </article>
            <article className="tile">
              <div className="feature-icon" aria-hidden="true">📞</div>
              <h3>Care coordination</h3>
              <p className="muted">
                Our team guides bookings, confirmations, and hand-offs so clinicians can focus on sessions —
                not admin ping-pong.
              </p>
            </article>
            <article className="tile">
              <div className="feature-icon" aria-hidden="true">🔗</div>
              <h3>For partners</h3>
              <p className="muted">
                From universities to workplaces, we collaborate with aligned teams scaling access responsibly.
              </p>
            </article>
          </div>

          <p className="about-body" style={{ marginBottom: 0 }}>
            Read the fuller story on{' '}
            <Link to="/about">About Serenest</Link>
            {' '}— or browse{' '}
            <Link to="/patient/find-professional">verified professionals</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
