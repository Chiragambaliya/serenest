import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO, PHQ9_FAQS } from '../lib/seo';
import {
  PageHero, EmergencyCallout, FAQSection, CTA, RelatedTopics, References,
} from '../components/SeoTopicPage';

const PATH = '/phq-9-depression-screening';

const SEVERITY_BANDS = [
  ['0 – 4', 'Minimal symptoms', 'Your score falls in the minimal symptom range. This does not rule out difficulties that are not captured by the questionnaire. If symptoms persist or worsen, speak with a clinician.'],
  ['5 – 9', 'Mild', 'Mild symptoms. Self-care, structured routines, social support, and possibly counselling may help. Recheck in 2 weeks.'],
  ['10 – 14', 'Moderate', 'Moderate symptoms. It is reasonable to book a clinician — psychologist, counsellor, or psychiatrist — for an evaluation.'],
  ['15 – 19', 'Moderately severe', 'A clinical assessment is recommended. Depending on your symptoms, history, functioning and preferences, a clinician may discuss psychological therapy, medication, monitoring, lifestyle changes or a combination of approaches.'],
  ['20 – 27', 'Severe', 'Please speak to a clinician promptly. If safety is a concern, call 112, go to the nearest emergency department, or call Tele-MANAS at 14416 or 1800-891-4416.'],
];

export default function Phq9Page() {
  useSEO({ path: PATH, ...ROUTE_SEO[PATH] });

  return (
    <div>
      <PageHero
        kicker="PHQ-9 depression screening"
        title={<>PHQ-9 depression screening online (India) — <span className="gradient-text">screening, not a diagnosis.</span></>}
        lead={
          <>The Patient Health Questionnaire-9 (PHQ-9) is a validated 9-item self-report tool used by clinicians around the world to screen for depression and to monitor severity. Take the screening privately on Serenest — your result is not a diagnosis and does not replace clinical evaluation.</>
        }
        primaryHref="/screening"
        primaryLabel="Take the screening now"
        secondaryHref="/online-psychiatrist-for-depression-india"
        secondaryLabel="Read about depression care"
      />

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">About the PHQ-9</div>
            <h2>What the PHQ-9 is — and what it is not</h2>
            <p>
              The PHQ-9 is a 9-item self-report scale developed by Drs. Spitzer, Williams, and Kroenke, mapping to the nine symptoms of major depressive disorder. It is widely used in primary care, mental health services, and research worldwide, and is in the public domain. The PHQ-9 is a <strong>screening and severity-tracking tool</strong>; it is not a diagnostic test. Only a qualified clinician can diagnose depression based on a full clinical evaluation.
            </p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">How to interpret your PHQ-9 score</div>
            <h2>Severity bands (general guide only)</h2>
            <p>These bands are commonly cited in the literature and are intended for orientation. They do not replace clinical judgment.</p>
          </div>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: 'rgba(11,36,32,0.05)' }}>
                  <th style={{ textAlign: 'left', padding: 12 }}>Score</th>
                  <th style={{ textAlign: 'left', padding: 12 }}>Band</th>
                  <th style={{ textAlign: 'left', padding: 12 }}>General orientation</th>
                </tr>
              </thead>
              <tbody>
                {SEVERITY_BANDS.map(([score, band, note]) => (
                  <tr key={score} style={{ borderTop: '1px solid rgba(11,36,32,0.08)' }}>
                    <td style={{ padding: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{score}</td>
                    <td style={{ padding: 12, whiteSpace: 'nowrap' }}>{band}</td>
                    <td style={{ padding: 12, fontSize: 14 }}>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <p style={{ marginTop: 12, fontSize: 13, color: 'rgba(11,36,32,0.65)' }}>
              Note: PHQ-9 item 9 asks about thoughts of self-harm. If you answered “several days” or higher on item 9, please speak to a clinician promptly. In an emergency, call 112 or go to the nearest emergency department; for free mental-health support in India, call Tele-MANAS at 14416 or 1800-891-4416.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Important safety information</div>
            <h2>PHQ-9 is a guide — not a diagnosis</h2>
          </div>
          <EmergencyCallout note={
            <>The PHQ-9 includes a question on self-harm thoughts. A positive answer or any current crisis means online booking is not the right pathway right now. Please call 112 or go to the nearest emergency department; for free mental-health support in India, call Tele-MANAS at 14416 or 1800-891-4416.</>
          } />
          <div className="grid-2" style={{ marginTop: 24 }}>
            <article className="tile">
              <h3>Diagnosis needs a clinician</h3>
              <p>A diagnosis of depression requires evaluation by a qualified clinician who considers duration, context, function, and other possibilities — not a score alone.</p>
            </article>
            <article className="tile">
              <h3>Track change over time</h3>
              <p>Clinicians often re-administer PHQ-9 every 2–4 weeks to track response. Self-monitoring is fine; interpretation should be done with your clinician.</p>
            </article>
            <article className="tile">
              <h3>Other conditions look similar</h3>
              <p>Thyroid problems, vitamin deficiencies, side-effects of other medications, grief, and major stressors can look like depression on a self-rating scale. A clinical evaluation rules these in or out.</p>
            </article>
            <article className="tile">
              <h3>Privacy</h3>
              <p>Your responses are private and handled under Serenest’s privacy-first workflows. See our <Link to="/privacy">Privacy Policy</Link>.</p>
            </article>
          </div>
        </div>
      </section>

      <FAQSection title="PHQ-9 — common questions" faqs={PHQ9_FAQS} />

      <RelatedTopics items={[
        { to: '/online-psychiatrist-for-depression-india', title: 'Online psychiatrist for depression', body: 'When PHQ-9 suggests it may help, this page explains how online depression care works.' },
        { to: '/gad-7-anxiety-screening', title: 'GAD-7 anxiety screening', body: 'Depression and anxiety often overlap. GAD-7 is a parallel screening tool for anxiety.' },
        { to: '/screening', title: 'Full PHQ-9 + GAD-7 screening', body: 'Take a combined PHQ-9 and GAD-7 self-screening on Serenest.' },
      ]} />

      <References items={[
        { href: 'https://www.mohfw.gov.in/pdf/Telemedicine.pdf', label: 'Telemedicine Practice Guidelines (2020), Government of India' },
        { href: 'https://www.who.int/news-room/fact-sheets/detail/depression', label: 'WHO — Depression fact sheet' },
        { href: 'https://www.phqscreeners.com/', label: 'PHQ Screeners — official resource', note: 'PHQ-9 was developed by Drs. Spitzer, Williams, and Kroenke and is in the public domain.' },
      ]} />

      <CTA
        heading="Take a confidential PHQ-9 screening on Serenest"
        body="A 3-minute self-screening. Screening is not a diagnosis."
        primaryHref="/screening"
        primaryLabel="Start PHQ-9 / GAD-7 screening"
        secondaryHref="/book"
        secondaryLabel="Book a consultation"
      />
    </div>
  );
}
