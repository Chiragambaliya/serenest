import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

import AcademyGuide from '../components/AcademyGuide';

const PROGRAMMES = [
  {
    label: 'Guides',
    title: 'Articles & guides',
    body: 'Plain-language explainers on conditions, coping skills, and help-seeking — aligned with Indian contexts where we work.',
    href: '/guides',
    cta: 'View all guides',
  },
  {
    label: 'Pharmacology',
    title: 'Pharmacology learning',
    body: 'For prescribers and trainees: telemedicine norms, prescribing conversations, SOAP and Rx workflow, continuity between visits, and safety documentation.',
    href: '/professionals/learning#learning-pharmacology',
    cta: 'Open pharmacology track',
  },
  {
    label: 'Psychology',
    title: 'Psychology learning',
    body: 'Assessment tools (PHQ-9 / GAD-7), psychoeducation, behavioural topics, stigma-aware language, and carer skills — curated modules on the learning hub.',
    href: '/professionals/learning#learning-psychology',
    cta: 'Open psychology track',
  },
  {
    label: 'Partnerships',
    title: 'Schools & workplaces',
    body: 'Talks, workshops, and collaborations that prioritise psychological safety and verified information.',
    href: 'mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20partnership',
    cta: 'Start a conversation',
    external: true,
  },
];

export default function AcademyPage() {
  useSEO({ path: '/academy', ...ROUTE_SEO['/academy'] });

  return (
    <div className="ed-page">
      <section className="ed-hero">
        <div className="container">
          <div className="ed-hero-brandline">
            <div className="ed-hero-brandstack">
              <span className="ed-brand-name">Serenest Academy</span>
              <span className="ed-brand-tag">Literacy &amp; learning · part of Serenest</span>
            </div>
          </div>

          <p className="ed-kicker">Serenest Academy · Serenest Education Pvt Ltd</p>
          <h1 className="ed-hero-title">
            Mental health learning — clear, respectful, and grounded in care.
          </h1>
          <p className="ed-hero-lead">
            Serenest Academy is the literacy and learning side of Serenest: explainers, learning tracks
            (pharmacology and psychology), partnerships, and outreach. It lives on the same site as our
            clinical telepsychiatry — so understanding and care are one click apart.
          </p>
          <div className="ed-hero-actions">
            <a className="btn btn-primary btn-lg" href="#guide">
              Ask Academy Guide
            </a>
            <a className="btn btn-ghost btn-lg" href="#learn">
              Explore programmes
            </a>
            <Link className="btn btn-ghost btn-lg" to="/book">
              Book a consultation
            </Link>
          </div>
        </div>
      </section>

      <AcademyGuide />

      <section id="learn" className="ed-section">
        <div className="container">
          <div className="ed-section-head">
            <p className="ed-section-label">What we publish</p>
            <h2>Built for understanding — not as a substitute for assessment</h2>
            <p className="ed-muted">
              Serenest Academy helps people recognise symptoms, reduce stigma, and take the next step.
              Diagnosis and treatment belong with licensed clinicians on Serenest. For clinicians,
              structured learning is split into pharmacology and psychology tracks.
            </p>
          </div>

          <div id="tracks" className="ed-anchor-target" />

          <div className="ed-grid">
            {PROGRAMMES.map((item) => (
              <article key={item.title} className="ed-card">
                <p className="ed-card-label">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <p className="ed-card-cta">
                  {item.external ? (
                    <a className="ed-link" href={item.href}>
                      {item.cta}
                    </a>
                  ) : (
                    <Link className="ed-link" to={item.href}>
                      {item.cta}
                    </Link>
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="audiences" className="ed-section ed-section-alt">
        <div className="container">
          <div className="ed-section-head">
            <p className="ed-section-label">Who it&apos;s for</p>
            <h2>Three doors into the same mission</h2>
          </div>
          <ul className="ed-list">
            <li>
              <strong>Public readers</strong> — reduce stigma, learn vocabulary, know when to seek care.
            </li>
            <li>
              <strong>Clinicians &amp; educators</strong> — follow{' '}
              <Link to="/professionals/learning#learning-pharmacology">pharmacology</Link> or{' '}
              <Link to="/professionals/learning#learning-psychology">psychology</Link> tracks on the
              clinician learning hub.
            </li>
            <li>
              <strong>Organisations</strong> — partner with us on stigma-aware programmes tailored to your
              team.
            </li>
          </ul>
          <p className="ed-muted ed-note">
            Clinical workflows (booking, screening, video consultations) live under the same Serenest roof.
            Privacy and regulation stay sharp because those routes are protected — not because they are on
            a different domain.
          </p>
        </div>
      </section>

      <section id="clinical" className="ed-section">
        <div className="container">
          <div className="ed-split">
            <div>
              <p className="ed-section-label">Clinical care</p>
              <h2>Same Serenest — bookings, screening &amp; consultations</h2>
              <p>
                Bookings, screening, video consultations, and continuity of care all run inside Serenest.
                Academy and clinical share the same brand, the same team, and the same site.
              </p>
              <p className="ed-muted">
                Serenest Education Pvt Ltd publishes Serenest Academy and operates Serenest clinical care
                at serenest.in.
              </p>
              <div className="ed-split-actions">
                <Link className="btn btn-primary" to="/book">
                  Book an appointment
                </Link>
                <Link className="btn btn-ghost" to="/screening">
                  Self-screening (PHQ-9 / GAD-7)
                </Link>
              </div>
            </div>
            <div className="ed-callout" aria-label="Reminder">
              <p className="ed-callout-title">Not sure where to start?</p>
              <p>
                If you want an appointment or clinical intake, head to{' '}
                <Link to="/book">Book</Link> or{' '}
                <Link to="/patient/find-professional">Find a professional</Link>. If you want literacy
                content or to talk about a partnership, you&apos;re in the right place.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="ed-section ed-section-alt">
        <div className="container ed-cta">
          <div>
            <h2 className="ed-cta-title">Partner or collaborate</h2>
            <p className="ed-muted">
              Share goals, audience, and timelines — we read every message and reply when there&apos;s a
              fit.
            </p>
          </div>
          <div className="ed-cta-actions">
            <a
              className="btn btn-primary btn-lg btn-full"
              href="mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20partnership"
            >
              Email Serenest Academy
            </a>
            <Link className="btn btn-ghost btn-lg btn-full" to="/professionals">
              Clinical / professional enquiries
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
