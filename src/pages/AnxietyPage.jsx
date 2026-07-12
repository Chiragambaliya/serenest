import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO, ANXIETY_FAQS } from '../lib/seo';
import {
  PageHero, EmergencyCallout, FAQSection, TrustGrid, CTA, RelatedTopics, References,
} from '../components/SeoTopicPage';

const PATH = '/anxiety-counselling-online-india';

export default function AnxietyPage() {
  useSEO({ path: PATH, ...ROUTE_SEO[PATH] });

  return (
    <div>
      <PageHero
        kicker="Anxiety counselling online"
        title={<>Anxiety counselling online in India — <span className="gradient-text">structured care, verified clinicians.</span></>}
        lead={
          <>Online anxiety counselling and psychiatrist support with verified Indian clinicians. GAD-7 screening, structured assessment, and a stepped-care plan — therapy, lifestyle support, or medication review where clinically appropriate.</>
        }
        primaryHref="/book"
        primaryLabel="Book an anxiety consultation"
        secondaryHref="/gad-7-anxiety-screening"
        secondaryLabel="Take the GAD-7 screening"
        language="Sessions in English, Hindi, and Gujarati where the treating clinician supports the language."
      />

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">What anxiety looks like</div>
            <h2>When everyday worry starts to feel like more than that</h2>
            <p>
              Anxiety can look like constant worry that is hard to control, restlessness, racing thoughts, sleep disturbance, irritability, difficulty concentrating, muscle tension, fatigue, or physical symptoms such as a racing heart, breathlessness, or stomach upset. Panic attacks, social anxiety, and health anxiety are all included. If anxiety is affecting your work, relationships, or daily function, online care is a reasonable step.
            </p>
          </div>
          <TrustGrid items={[
            { icon: '📊', title: 'GAD-7, properly used', body: 'GAD-7 is a 7-item screening tool used to gauge anxiety severity. It is not a diagnosis. Your clinician interprets it alongside history and clinical assessment.' },
            { icon: '🧭', title: 'Stepped care', body: 'Mild anxiety often responds to therapy alone (CBT, mindfulness-based approaches). Moderate-to-severe anxiety may benefit from psychiatry input. Your clinician helps you choose.' },
            { icon: '👥', title: 'Counsellor or psychiatrist', body: 'Counsellors, psychologists, and psychiatrists are different roles. For medication, you need a psychiatrist. For talking therapy, a counsellor or psychologist is often the right starting point.' },
          ]} />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">How online anxiety care works on Serenest</div>
            <h2>From screening to your first session</h2>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <ol className="steps">
              {[
                ['Take a confidential GAD-7 screening', 'A 7-item self-check to help gauge anxiety severity. Screening is not a diagnosis.', '/gad-7-anxiety-screening'],
                ['Choose your care path', 'A counsellor or psychologist for therapy; a psychiatrist for medical evaluation. Book the slot that fits.', '/services'],
                ['Join your online session', 'Encrypted video, audio, or chat with a verified clinician. Typically 30–45 minutes.', null],
                ['Receive a care plan', 'Your clinician shares a summary and next steps — therapy plan, follow-up cadence, and a prescription where clinically appropriate.', null],
                ['Follow-up and continuity', 'Same clinician, same records. Anxiety care often improves with consistent follow-up.', null],
              ].map(([title, desc, href], i) => (
                <li key={title} className="step">
                  <div className="step-num">{i + 1}</div>
                  <div className="step-body">
                    <strong>{title}</strong>
                    <p>
                      {desc}
                      {href ? <> <Link to={href}>Go →</Link></> : null}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Important safety information</div>
            <h2>What online anxiety care can — and cannot — do</h2>
          </div>
          <EmergencyCallout note={
            <>If you are experiencing severe panic, dissociation, suicidal thoughts, or you cannot keep yourself safe, please call 112 or go to the nearest emergency department, or call Tele-MANAS at 14416 or 1800-891-4416. Online booking is not a substitute for emergency care.</>
          } />
          <div className="grid-2" style={{ marginTop: 24 }}>
            <article className="tile">
              <h3>Anxiety medication is regulated</h3>
              <p>Certain anti-anxiety medications, including benzodiazepines and other controlled substances, have specific limits under the Telemedicine Practice Guidelines, 2020. Your clinician decides what is appropriate and may recommend in-person evaluation for some situations.</p>
            </article>
            <article className="tile">
              <h3>Therapy is often the first line</h3>
              <p>Evidence supports CBT and other structured therapies as effective for many anxiety presentations. A psychologist or counsellor can be a strong first step.</p>
            </article>
            <article className="tile">
              <h3>No promised cure or outcome</h3>
              <p>Serenest does not promise a diagnosis, cure, or any specific outcome. Care quality comes from structured assessment, documentation, and continuity.</p>
            </article>
            <article className="tile">
              <h3>Co-existing conditions matter</h3>
              <p>Anxiety often co-occurs with depression, sleep problems, ADHD, or substance use. A proper assessment looks at the full picture.</p>
            </article>
          </div>
        </div>
      </section>

      <FAQSection title="Anxiety counselling online — common questions" faqs={ANXIETY_FAQS} />

      <RelatedTopics items={[
        { to: '/gad-7-anxiety-screening', title: 'GAD-7 anxiety screening', body: 'A validated 7-item self-screening. Screening is not a diagnosis.' },
        { to: '/online-psychiatrist-for-depression-india', title: 'Online psychiatrist for depression', body: 'Depression and anxiety often co-occur. Read about online depression care.' },
        { to: '/ocd-treatment-online-india', title: 'OCD treatment online', body: 'Structured assessment, ERP-focused therapy, and psychiatric follow-up for OCD.' },
        { to: '/online-psychiatrist-prescription-india', title: 'Online prescription validity', body: 'How psychiatric prescriptions work online in India under the Telemedicine Practice Guidelines, 2020.' },
      ]} />

      <References items={[
        { href: 'https://www.mohfw.gov.in/pdf/Telemedicine.pdf', label: 'Telemedicine Practice Guidelines (2020), Government of India' },
        { href: 'https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders', label: 'WHO — Anxiety disorders fact sheet' },
        { href: 'https://nimhans.ac.in/', label: 'NIMHANS, Bengaluru' },
      ]} />

      <CTA
        heading="Ready to start online anxiety care?"
        body="Take 3 minutes of GAD-7 screening, or go straight to booking with a verified clinician."
        primaryHref="/book"
        primaryLabel="Book a consultation"
      />
    </div>
  );
}
