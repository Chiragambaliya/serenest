import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import FaqAccordion from '../components/FaqAccordion';
import EmergencyNotice from '../components/EmergencyNotice';
import '../styles/service-detail.css';

const JOURNEY = [
  { title: 'Assessment', body: 'Understanding substance use history, patterns, and any medical risk.' },
  { title: 'Withdrawal and medical-risk recognition', body: 'Identifying when withdrawal needs in-person or emergency medical care.' },
  { title: 'Motivation and counselling', body: 'Working through ambivalence and building a plan for change.' },
  { title: 'Relapse prevention', body: 'Identifying triggers and building coping strategies.' },
  { title: 'Family involvement', body: 'Involving family where appropriate and helpful.' },
  { title: 'Medication support where clinically appropriate', body: 'Some situations benefit from medication as part of recovery.' },
];

const FAQS = [
  { question: 'Can addiction be treated entirely online?', answer: 'Assessment, counselling, motivation-building, and relapse prevention can happen online. Withdrawal management, medical detox, and situations with significant health risk usually need in-person or inpatient care — your clinician will tell you if that applies to you.' },
  { question: 'Is this confidential?', answer: 'Yes, within the same clinical and legal confidentiality boundaries as any other consultation on Serenest, which your clinician will explain.' },
  { question: 'Do you involve family members?', answer: 'Only with your consent, and only where it\'s clinically useful — family involvement is discussed and agreed with you, not assumed.' },
  { question: 'What if there\'s a medical emergency during withdrawal?', answer: 'Withdrawal from some substances can be medically dangerous. If you or someone else is showing signs of a medical emergency, go to an emergency room or call local emergency services immediately — do not wait for an online appointment.' },
];

export default function AddictionCarePage() {
  useSEO({
    path: '/services/addiction-care',
    title: 'Online Addiction & Recovery Support | Serenest',
    description: 'Assessment, counselling, and relapse-prevention support for substance use, with clear guidance on when in-person or emergency care is needed.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Services · Addiction and Recovery</p>
          <h1>Recovery support, without judgement</h1>
          <p className="svd-hero__lead">
            Assessment, counselling, and relapse-prevention support for substance use — with
            honest guidance on when in-person or emergency care is what you actually need.
          </p>
          <div className="svd-hero__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book an Appointment</Link>
          </div>
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <h2>What recovery support on Serenest covers</h2>
          <ul className="svd-list">
            {JOURNEY.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="svd-section svd-section--soft">
        <div className="container">
          <h2>Rehabilitation and recovery planning</h2>
          <p className="svd-section-lead" style={{ marginBottom: '1.5rem' }}>
            Recovery isn't a single appointment. Where useful, your clinician will help build a
            longer-term plan — counselling, relapse-prevention strategies, and coordination with
            in-person rehabilitation services where that's the right level of care.
          </p>
          <EmergencyNotice />
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <h2>Frequently asked questions</h2>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <section className="svd-cta">
        <div className="container">
          <h2>Take the first step</h2>
          <p>A confidential conversation, at your pace.</p>
          <div className="svd-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book an Appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/services">Compare services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
