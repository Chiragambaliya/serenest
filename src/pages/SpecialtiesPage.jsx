import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { SPECIALTY_GROUPS } from '../lib/specialties';
import FaqAccordion from '../components/FaqAccordion';
import EmergencyNotice from '../components/EmergencyNotice';
import '../styles/service-detail.css';

const FAQS = [
  {
    question: 'Can every branch of medicine be fully treated online?',
    answer: 'No. A teleconsultation can cover history, reports you already have, counselling, and many follow-ups. Examination, procedures, emergencies, and some first prescriptions still need a clinic or hospital. Each specialty page says which is which.',
  },
  {
    question: 'How do I request a specialist?',
    answer: 'Choose the branch, send your name, phone, and a preferred time. Serenest confirms by phone or WhatsApp. You pay after the slot is locked, not when you send the request.',
  },
  {
    question: 'What if no clinician is listed for that specialty yet?',
    answer: 'Send the request anyway. The team matches you with the next verified clinician for that branch, or tells you if the concern needs an in-person visit.',
  },
  {
    question: 'Is this an emergency service?',
    answer: 'No. If you or someone else is at immediate risk, contact local emergency services. Do not wait for an online appointment.',
  },
];

export default function SpecialtiesPage() {
  useSEO({ path: '/specialties', ...ROUTE_SEO['/specialties'] });

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Teleconsultation</p>
          <h1>Every clinical branch, from home</h1>
          <p className="svd-hero__lead">
            Request a video, audio, or chat consult with a verified specialist.
            Mental health, medicine, and surgical follow-up use the same private booking path.
            You pay after we confirm the time.
          </p>
          <div className="svd-hero__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Request an appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/services/digital-consultations">How a session works</Link>
          </div>
        </div>
      </section>

      {SPECIALTY_GROUPS.map((group) => (
        <section className="svd-section" id={group.id} key={group.id} aria-labelledby={`branch-${group.id}`}>
          <div className="container">
            <p className="svd-sidelabel">{group.label}</p>
            <h2 id={`branch-${group.id}`}>{group.label}</h2>
            <p className="svd-section-lead">{group.blurb}</p>
            <div className="ed-index">
              {group.specialties.map((specialty, index) => (
                <Link key={specialty.id} className="ed-index__row" to={`/specialties/${specialty.id}`}>
                  <span className="ed-index__num">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <h3 className="ed-index__title">{specialty.label}</h3>
                    <span className="ed-index__meta">Online consult</span>
                  </span>
                  <p className="ed-index__body">{specialty.summary}</p>
                  <span className="ed-index__go" aria-hidden="true">View →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="svd-section svd-section--soft">
        <div className="container svd-split svd-split--aside">
          <div>
            <p className="svd-sidelabel">Limits</p>
          </div>
          <div>
            <h2>What stays the same on every branch</h2>
            <p className="svd-section-lead">
              Indian telemedicine rules apply to every specialty. A clinician can take a history,
              review reports, and plan follow-up. They cannot examine you through a screen,
              do a procedure, or replace emergency care.
            </p>
            <EmergencyNotice />
          </div>
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <p className="svd-sidelabel">Questions</p>
          <h2>Before you request a slot</h2>
          <FaqAccordion items={FAQS} />
        </div>
      </section>
    </div>
  );
}
