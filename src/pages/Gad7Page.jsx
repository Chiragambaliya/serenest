import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO, GAD7_FAQS } from '../lib/seo';
import {
  PageHero, EmergencyCallout, FAQSection, CTA, RelatedTopics, References,
} from '../components/SeoTopicPage';

const PATH = '/gad-7-anxiety-screening';

const SEVERITY_BANDS = [
  ['0 – 4', 'Minimal', 'Symptoms are minimal. Continue with healthy routines; recheck if things change.'],
  ['5 – 9', 'Mild', 'Mild symptoms. Self-care, social support, and possibly counselling may help. Recheck in 2 weeks.'],
  ['10 – 14', 'Moderate', 'Moderate symptoms. A clinician evaluation — psychologist, counsellor, or psychiatrist — is reasonable.'],
  ['15 – 21', 'Severe', 'Severe symptoms. A clinician evaluation is recommended. Treatment options may include therapy, medication, or a combination, decided clinically.'],
];

export default function Gad7Page() {
  useSEO({ path: PATH, ...ROUTE_SEO[PATH] });

  return (
    <div>
      <PageHero
        kicker="GAD-7 anxiety screening"
        title={<>GAD-7 anxiety screening online (India) — <span className="gradient-text">screening, not a diagnosis.</span></>}
        lead={
          <>The Generalized Anxiety Disorder-7 (GAD-7) is a validated 7-item self-report scale used by clinicians worldwide to screen for anxiety severity. Take the screening privately on Serenest — your result is not a diagnosis and does not replace clinical evaluation.</>
        }
        primaryHref="/screening"
        primaryLabel="Take the screening now"
        secondaryHref="/anxiety-counselling-online-india"
        secondaryLabel="Read about anxiety care"
      />

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">About the GAD-7</div>
            <h2>What the GAD-7 is — and what it is not</h2>
            <p>
              The GAD-7 is a 7-item self-report scale developed by Spitzer and colleagues to screen for generalized anxiety and to track severity over time. It is widely used in primary care and mental health services. The GAD-7 is a <strong>screening and severity-tracking tool</strong>; it is not a diagnostic test. Only a qualified clinician can diagnose a specific anxiety disorder based on full clinical evaluation.
            </p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">How to interpret your GAD-7 score</div>
            <h2>Severity bands (general guide only)</h2>
            <p>These bands are commonly cited in the literature for orientation only. They do not replace clinical judgment.</p>
          </div>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Important safety information</div>
            <h2>GAD-7 is a guide — not a diagnosis</h2>
          </div>
          <EmergencyCallout />
          <div className="grid-2" style={{ marginTop: 24 }}>
            <article className="tile">
              <h3>Specific disorders need clinical evaluation</h3>
              <p>GAD-7 was developed to screen for generalized anxiety. Panic disorder, social anxiety, OCD, PTSD, and health anxiety can have overlapping scores but need different treatment approaches — a clinician helps distinguish them.</p>
            </article>
            <article className="tile">
              <h3>Other conditions can mimic anxiety</h3>
              <p>Thyroid problems, caffeine intake, certain medications, and sleep deprivation can present as anxiety on a self-rating scale. Clinical evaluation rules these in or out.</p>
            </article>
            <article className="tile">
              <h3>Track change over time</h3>
              <p>Clinicians often re-administer GAD-7 every 2–4 weeks to monitor response. Self-monitoring is fine; interpretation should be done with your clinician.</p>
            </article>
            <article className="tile">
              <h3>Privacy</h3>
              <p>Your responses are private and handled under Serenest’s privacy-first workflows. See our <Link to="/privacy">Privacy Policy</Link>.</p>
            </article>
          </div>
        </div>
      </section>

      <FAQSection title="GAD-7 — common questions" faqs={GAD7_FAQS} />

      <RelatedTopics items={[
        { to: '/anxiety-counselling-online-india', title: 'Anxiety counselling online', body: 'When GAD-7 suggests it may help, this page explains how online anxiety care works.' },
        { to: '/phq-9-depression-screening', title: 'PHQ-9 depression screening', body: 'Depression and anxiety often overlap. PHQ-9 is a parallel screening tool for depression.' },
        { to: '/screening', title: 'Full PHQ-9 + GAD-7 screening', body: 'Take a combined PHQ-9 and GAD-7 self-screening on Serenest.' },
      ]} />

      <References items={[
        { href: 'https://www.mohfw.gov.in/pdf/Telemedicine.pdf', label: 'Telemedicine Practice Guidelines (2020), Government of India' },
        { href: 'https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders', label: 'WHO — Anxiety disorders fact sheet' },
        { href: 'https://www.phqscreeners.com/', label: 'PHQ Screeners — official resource', note: 'GAD-7 was developed by Drs. Spitzer, Kroenke, Williams, and Löwe and is in the public domain.' },
      ]} />

      <CTA
        heading="Take a confidential GAD-7 screening on Serenest"
        body="A 3-minute self-screening. Screening is not a diagnosis."
        primaryHref="/screening"
        primaryLabel="Start PHQ-9 / GAD-7 screening"
        secondaryHref="/book"
        secondaryLabel="Book a consultation"
      />
    </div>
  );
}
