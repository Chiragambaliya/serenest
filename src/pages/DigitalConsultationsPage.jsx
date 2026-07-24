import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import FaqAccordion from '../components/FaqAccordion';
import EmergencyNotice from '../components/EmergencyNotice';
import '../styles/service-detail.css';

const CAN_MANAGE = [
  { title: 'Assessment and diagnosis discussion', body: 'Structured intake and clinical assessment.' },
  { title: 'Ongoing therapy', body: 'Regular talk-therapy sessions.' },
  { title: 'Medication follow-up', body: 'Reviewing how a treatment plan is working.' },
  { title: 'Screening and psychoeducation', body: 'Understanding symptoms and next steps.' },
];

const NEEDS_IN_PERSON = [
  { title: 'Physical examination', body: 'When a clinician needs to examine you directly.' },
  { title: 'Medical emergencies', body: 'Any situation involving immediate risk to health or safety.' },
  { title: 'Certain first-time prescriptions', body: 'Some medications require in-person evaluation under telemedicine rules.' },
];

const FAQS = [
  { question: 'How does a teleconsultation actually work?', answer: 'You book a slot, choose video, audio, or chat, and join at the scheduled time from a phone, tablet, or computer. Your clinician runs the session much like an in-person appointment, just over a secure connection.' },
  { question: 'Is my information kept confidential?', answer: 'Sessions and records are handled with the same confidentiality standards as in-person care. You consent to teleconsultation before your first session, and can ask any questions about how your data is handled.' },
  { question: 'Can every medication be prescribed online?', answer: 'No. Indian telemedicine guidelines restrict certain categories of medication from being prescribed without an in-person evaluation. Your clinician will tell you if that applies to your situation.' },
  { question: 'What do I need on my end?', answer: 'A phone or computer with a camera and microphone (for video) or just audio, and a stable internet connection. We\'ll send you a link ahead of your session.' },
  { question: 'What if my connection drops during a session?', answer: 'Try rejoining with the same link — most sessions can also continue over audio or phone if video isn\'t working. If you\'re unable to reconnect, contact support and we\'ll help you reschedule.' },
];

export default function DigitalConsultationsPage() {
  useSEO({
    path: '/services/digital-consultations',
    title: 'Digital Mental Health Consultations | Serenest',
    description: 'How teleconsultation works on Serenest — what can be managed online, what needs in-person care, and the technology you need.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Services · Digital Consultations</p>
          <h1>Secure care, over video, audio, or chat</h1>
          <p className="svd-hero__lead">
            Teleconsultation built around India's telemedicine guidelines — with clear, upfront
            boundaries on what it can and can't do.
          </p>
          <div className="svd-hero__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book an Appointment</Link>
          </div>
        </div>
      </section>

      {/* The defining idea of this page: two honest facing columns. */}
      <section className="svd-section">
        <div className="container">
          <p className="svd-sidelabel">Scope and limits</p>
          <h2>What teleconsultation can and can't do</h2>
          <p className="svd-section-lead">
            Being upfront about the boundaries is part of practising responsibly — here's the
            honest split.
          </p>
          <div className="svd-compare">
            <div className="svd-compare__col">
              <h3>Manageable online</h3>
              <ul className="svd-list">
                {CAN_MANAGE.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.body}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="svd-compare__col svd-compare__col--limits">
              <h3>Needs in-person assessment</h3>
              <ul className="svd-list">
                {NEEDS_IN_PERSON.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="svd-section svd-section--soft">
        <div className="container svd-split svd-split--aside">
          <div>
            <p className="svd-sidelabel">Consent &amp; compliance</p>
          </div>
          <div>
            <h2>Consent, confidentiality, and prescription limits</h2>
            <p className="svd-section-lead" style={{ marginBottom: '1.5rem' }}>
              You'll be asked to consent to teleconsultation before your first session. Prescriptions
              follow India's telemedicine rules, which restrict some medications from being issued
              without an in-person evaluation — your clinician will be upfront if that applies to you.
            </p>
            <EmergencyNotice />
          </div>
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <p className="svd-sidelabel">Questions</p>
          <h2>Frequently asked questions</h2>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <section className="svd-cta">
        <div className="container">
          <h2>Ready to book a consultation?</h2>
          <p>Choose video, audio, or chat — whatever works best for you.</p>
          <div className="svd-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book an Appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/services">Compare services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
