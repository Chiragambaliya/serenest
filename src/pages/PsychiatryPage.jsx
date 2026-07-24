import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import FaqAccordion from '../components/FaqAccordion';
import EmergencyNotice from '../components/EmergencyNotice';
import '../styles/service-detail.css';

const ASSESSED = [
  { title: 'Depression', body: 'Low mood, loss of interest, fatigue, and related symptoms.' },
  { title: 'Anxiety disorders', body: 'Generalised anxiety, panic, and social anxiety.' },
  { title: 'OCD', body: 'Intrusive thoughts and compulsive behaviours.' },
  { title: 'Bipolar disorder', body: 'Mood episodes requiring ongoing psychiatric management.' },
  { title: 'ADHD (adults)', body: 'Attention, focus, and impulsivity assessment.' },
  { title: 'Sleep disorders', body: 'Insomnia and disrupted sleep patterns.' },
];

const FAQS = [
  { question: 'Is an online psychiatry consultation as effective as an in-person one?', answer: 'For assessment, follow-up, and medication management, telepsychiatry is a recognised model of care under Indian telemedicine guidelines. Some situations — for example, when a physical examination or urgent in-person evaluation is needed — require in-person care instead, and your psychiatrist will tell you if that applies.' },
  { question: 'Can I get a prescription after an online consultation?', answer: 'A registered psychiatrist can issue a prescription when clinically appropriate and permitted under India\'s telemedicine rules. This depends on your specific situation and is decided during the consultation, not guaranteed in advance.' },
  { question: 'What happens in the first session?', answer: 'Your psychiatrist takes a structured history, discusses your symptoms and context, and may use standard screening tools. You\'ll leave with a clear sense of next steps, whether that\'s a treatment plan, further assessment, or a referral.' },
  { question: 'What if I need urgent help?', answer: 'Online psychiatry is not an emergency service. If you or someone else is at immediate risk, contact local emergency services or a crisis helpline directly.' },
];

export default function PsychiatryPage() {
  useSEO({
    path: '/services/psychiatry',
    title: 'Online Psychiatry Consultation | Serenest',
    description: 'Psychiatric assessment, diagnosis, and medication management from a licensed psychiatrist, over secure video, audio, or chat.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Services · Psychiatry</p>
          <h1>What psychiatric care on Serenest involves</h1>
          <p className="svd-hero__lead">
            Assessment, diagnosis, and medication planning from a licensed psychiatrist —
            delivered over secure video, audio, or chat, with a clear plan for follow-up.
          </p>
          <div className="svd-hero__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book an Appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/screening">Start with screening</Link>
          </div>
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <h2>Conditions commonly assessed</h2>
          <p className="svd-section-lead">
            This is not a diagnostic tool — it's a guide to when psychiatric assessment is often
            appropriate. Your psychiatrist will make the actual clinical assessment.
          </p>
          <ul className="svd-list">
            {ASSESSED.map((item) => (
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
          <h2>What happens in the first consultation</h2>
          <p className="svd-section-lead">
            A structured intake, a discussion of your history and current symptoms, and — where
            useful — standard screening tools like the PHQ-9 or GAD-7. You leave with a clear
            next step, not just a conversation.
          </p>
          <h2 style={{ fontSize: '1.3rem', marginTop: '2.5rem' }}>Medication and non-medication planning</h2>
          <p className="svd-section-lead" style={{ marginTop: 0 }}>
            Some conditions respond well to medication, others to therapy, and many benefit from
            both. Your psychiatrist will discuss the options relevant to your situation — Serenest
            does not promise a specific treatment outcome in advance.
          </p>
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <h2>Follow-up care</h2>
          <p className="svd-section-lead">
            Psychiatric care is rarely a single session. Follow-ups let your psychiatrist track
            how a treatment plan is working and adjust it — session notes and history stay
            connected on Serenest so you don't have to repeat your story each time.
          </p>
          <h2 style={{ fontSize: '1.3rem', marginTop: '2.5rem' }}>Online consultation boundaries</h2>
          <p className="svd-section-lead" style={{ marginTop: 0, marginBottom: '1.5rem' }}>
            Telepsychiatry works well for assessment, therapy, and medication follow-up. It is not
            a substitute for emergency or in-person care when that's what's clinically needed —
            your psychiatrist will tell you if your situation requires it.
          </p>
          <EmergencyNotice />
        </div>
      </section>

      <section className="svd-section svd-section--soft">
        <div className="container">
          <h2>Frequently asked questions</h2>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <section className="svd-cta">
        <div className="container">
          <h2>Ready to speak with a psychiatrist?</h2>
          <p>Book a time that works for you — we confirm by phone or WhatsApp.</p>
          <div className="svd-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book an Appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/services">Compare services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
