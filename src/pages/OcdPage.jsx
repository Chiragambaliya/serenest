import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO, OCD_FAQS } from '../lib/seo';
import {
  PageHero, EmergencyCallout, FAQSection, TrustGrid, CTA, RelatedTopics, References,
} from '../components/SeoTopicPage';

const PATH = '/ocd-treatment-online-india';

export default function OcdPage() {
  useSEO({ path: PATH, ...ROUTE_SEO[PATH] });

  return (
    <div>
      <PageHero
        kicker="OCD treatment online"
        title={<>OCD treatment online in India — <span className="gradient-text">evidence-based care, verified clinicians.</span></>}
        lead={
          <>Online assessment and treatment for obsessive-compulsive disorder with verified Indian psychiatrists and psychologists. Structured clinical evaluation, exposure and response prevention (ERP) where appropriate, and medication review when clinically indicated — across India.</>
        }
        primaryHref="/book"
        primaryLabel="Book an OCD consultation"
        secondaryHref="/screening"
        secondaryLabel="Take PHQ-9 / GAD-7 screening"
        language="Sessions in English, Hindi, and Gujarati where the treating clinician supports the language."
      />

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Understanding OCD</div>
            <h2>When intrusive thoughts and repetitive behaviours take over daily life</h2>
            <p>
              Obsessive-compulsive disorder (OCD) involves unwanted, persistent thoughts, images, or urges (obsessions) and repetitive behaviours or mental acts (compulsions) done to reduce distress. Common themes include contamination, checking, symmetry, harm-related fears, and religious or moral scrupulosity. OCD is a recognised clinical condition — not a personality quirk or a lack of willpower — and responds well to structured treatment when assessed properly.
            </p>
          </div>
          <TrustGrid items={[
            { icon: '🧠', title: 'Obsessions and compulsions', body: 'A clinician distinguishes OCD from everyday worry, perfectionism, or habits by looking at time spent, distress caused, and impact on work, relationships, and daily function.' },
            { icon: '📋', title: 'Structured assessment', body: 'Assessment includes detailed history, symptom mapping, and validated clinician-rated scales (such as Y-BOCS) where appropriate. Self-screening tools on Serenest (PHQ-9, GAD-7) help flag co-existing depression or anxiety — not OCD itself.' },
            { icon: '🎯', title: 'ERP and medication', body: 'Exposure and response prevention (ERP), a form of CBT, is a first-line psychological treatment for OCD. Some people also benefit from SSRI medication under psychiatric supervision. Your clinician recommends what fits your presentation.' },
          ]} />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">How online OCD care works on Serenest</div>
            <h2>From booking to a structured treatment plan</h2>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <ol className="steps">
              {[
                ['Book with the right clinician', 'Psychiatrist for medical evaluation and medication; psychologist or counsellor for ERP-focused therapy. Many people need both over time.', '/book'],
                ['Complete structured intake', 'Share symptom history, triggers, compulsions, and how long symptoms have affected your life. Prior reports help if you have them.', null],
                ['Join your online session', 'Encrypted video, audio, or chat with a verified clinician. First sessions focus on assessment and safety planning.', null],
                ['Receive a care plan', 'Your clinician outlines ERP homework, session frequency, medication options if appropriate, and follow-up cadence.', null],
                ['Follow-up and continuity', 'OCD treatment often improves with consistent sessions and between-session practice. Same clinician, same records.', null],
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
            <h2>What online OCD care can — and cannot — do</h2>
          </div>
          <EmergencyCallout note={
            <>If you have thoughts of harming yourself or others and feel unable to stay safe, call 112 or go to the nearest emergency department, or call Tele-MANAS at 14416 or 1800-891-4416. Harm-related obsessions in OCD are common and distressing — a clinician helps distinguish them from imminent risk and plans safe care. Serenest is not an emergency service.</>
          } />
          <div className="grid-2" style={{ marginTop: 24 }}>
            <article className="tile">
              <h3>ERP needs commitment between sessions</h3>
              <p>Exposure and response prevention works best when practised consistently between appointments. Online therapy can deliver ERP effectively when you have a private space and reliable connectivity.</p>
            </article>
            <article className="tile">
              <h3>Medication is clinician-led</h3>
              <p>SSRIs are commonly used for OCD at doses that may differ from depression treatment. Prescribing follows India&apos;s Telemedicine Practice Guidelines and your psychiatrist&apos;s clinical judgment — not patient request alone.</p>
            </article>
            <article className="tile">
              <h3>OCD is not the same as OCPD</h3>
              <p>Obsessive-compulsive personality disorder (OCPD) is a different condition. Accurate assessment matters for the right treatment approach.</p>
            </article>
            <article className="tile">
              <h3>Co-existing conditions are common</h3>
              <p>Depression, anxiety, ADHD, and tic disorders often occur alongside OCD. A thorough assessment looks at the full picture, not isolated symptoms.</p>
            </article>
          </div>
        </div>
      </section>

      <FAQSection title="OCD treatment online — common questions" faqs={OCD_FAQS} />

      <RelatedTopics items={[
        { to: '/anxiety-counselling-online-india', title: 'Anxiety counselling online', body: 'Anxiety and OCD often overlap. Read about GAD-7 screening and stepped care.' },
        { to: '/online-psychiatrist-for-depression-india', title: 'Online psychiatrist for depression', body: 'Depression frequently co-occurs with OCD. Structured online depression care.' },
        { to: '/online-psychiatrist-prescription-india', title: 'Online prescription validity', body: 'How psychiatric prescriptions work online in India under the Telemedicine Practice Guidelines, 2020.' },
      ]} />

      <References items={[
        { href: 'https://www.mohfw.gov.in/pdf/Telemedicine.pdf', label: 'Telemedicine Practice Guidelines (2020), Government of India' },
        { href: 'https://www.nimh.nih.gov/health/topics/obsessive-compulsive-disorder-ocd', label: 'NIMH — Obsessive-Compulsive Disorder' },
        { href: 'https://nimhans.ac.in/', label: 'NIMHANS, Bengaluru' },
      ]} />

      <CTA
        heading="Ready to start online OCD care?"
        body="Book a consultation with a verified clinician, or begin with PHQ-9 / GAD-7 screening if you are unsure where to start."
        primaryHref="/book"
        primaryLabel="Book a consultation"
      />
    </div>
  );
}
