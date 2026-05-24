import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const CONDITIONS = [
  { name: 'Depression',              symptoms: 'Persistent sadness, loss of interest, fatigue, hopelessness' },
  { name: 'Anxiety Disorders',       symptoms: 'Excessive worry, panic attacks, social anxiety, phobias' },
  { name: 'OCD',                     symptoms: 'Intrusive thoughts, compulsive behaviours, rituals' },
  { name: 'Bipolar Disorder',        symptoms: 'Mood swings between mania and depression' },
  { name: 'Schizophrenia',           symptoms: 'Hallucinations, delusions, disorganised thinking' },
  { name: 'PTSD',                    symptoms: 'Flashbacks, nightmares, emotional numbness after trauma' },
  { name: 'ADHD (Adults)',           symptoms: 'Inattention, impulsivity, difficulty organising tasks' },
  { name: 'Sleep Disorders',         symptoms: 'Insomnia, hypersomnia, disrupted sleep patterns' },
  { name: 'Addiction / De-addiction',symptoms: 'Alcohol, substance use, behavioural addictions' },
  { name: 'Stress & Burnout',        symptoms: 'Work stress, emotional exhaustion, caregiver fatigue' },
];

function ServiceCard({ icon, title, badge, lead, description, included, forWho, price, cta }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="svc-card">
      <div className="svc-card-top">
        <div className="svc-icon">{icon}</div>
        {badge && <span className="svc-badge">{badge}</span>}
      </div>
      <h3 className="svc-title">{title}</h3>
      <p className="svc-lead">{lead}</p>
      <p className="svc-desc">{description}</p>

      {(included || forWho) && (
        <button
          className="svc-toggle"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
        >
          {open ? 'Hide details ↑' : 'See what\'s included ↓'}
        </button>
      )}

      {open && (
        <div className="svc-details">
          {included && (
            <div>
              <div className="svc-subhead">What's included</div>
              <ul className="svc-list">
                {included.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}
          {forWho && (
            <div>
              <div className="svc-subhead">Who it's for</div>
              <p className="svc-for-who">{forWho}</p>
            </div>
          )}
        </div>
      )}

      {price && <div className="svc-price">{price}</div>}
      {cta && (
        <div className="svc-cta-row">
          <Link className="btn btn-primary btn-sm" to="/book">Book now →</Link>
          {cta}
        </div>
      )}
    </article>
  );
}

export default function ServicesPage() {
  useSEO({ path: '/services', ...ROUTE_SEO['/services'] });
  return (
    <div>

      {/* ── Page Hero ──────────────────────────────────────── */}
      <section className="page-hero">
        <div className="page-hero-bg" aria-hidden="true" />
        <div className="container">
          <div className="page-hero-inner">
            <div className="section-kicker">Our Services</div>
            <h1 className="page-hero-title">
              Everything you need for mental health care —{' '}
              <span className="gradient-text">in one place.</span>
            </h1>
            <p className="page-hero-lead">
              From your first consultation to ongoing treatment, medication
              management, and mental health tracking — Serenest is a complete
              clinical platform, not just a booking app.
            </p>
            <div className="page-hero-actions">
              <Link className="btn btn-primary btn-lg" to="/book">Book an appointment →</Link>
              <Link className="btn btn-ghost btn-lg" to="/screening">Self-screening</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Services ──────────────────────────────────── */}
      <section className="section" id="core-services">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Core services</div>
            <h2>Six services, built for clinical care</h2>
            <p>Clinically grounded. Designed for continuity. Available from anywhere in India.</p>
          </div>

          <div className="svc-grid">
            <ServiceCard
              icon="🎥"
              title="Online Mental Health Consultation"
              badge="Most Popular"
              lead="Talk to a verified psychiatrist or psychologist from home."
              description="Book a 45-minute video, audio, or chat session with a verified psychiatrist or clinical psychologist anywhere in India. No waiting rooms. No travel. No stigma — private, encrypted care with clinicians who assess, diagnose (where licensed), recommend therapy or medication appropriately, and follow your progress."
              included={[
                '45-minute encrypted video session',
                'Clinical assessment (PHQ-9 / GAD-7)',
                'Clinical SOAP documentation',
                'Diagnosis and treatment plan',
                'Follow-up recommendation',
                'Digital prescription (if required)',
              ]}
              forWho="Anxiety, Depression, OCD, PTSD, Bipolar Disorder, Schizophrenia, Sleep disorders, Stress, Burnout, Relationship issues, Medication review"
              price="Starting at ₹499 per session"
            />

            <ServiceCard
              icon="📄"
              title="Digital Prescription"
              lead="Issued by a qualified doctor, when clinically appropriate."
              description="When clinically appropriate, a qualified doctor may issue a digital prescription after consultation, following applicable telemedicine guidelines. Some medicines, conditions, or situations may require in-person evaluation. Serenest does not guarantee prescriptions on request; clinical judgment comes first."
              included={[
                'Digital PDF prescription where appropriate',
                "Issued by a registered medical practitioner",
                'Drug name, dose, frequency, and duration',
                'Patient details and consultation date',
                'Digitally signed by the prescribing doctor',
                'Subject to applicable telemedicine guidelines',
              ]}
            />

            <ServiceCard
              icon="📊"
              title="Mental Health Assessments"
              lead="Know where you stand, clinically."
              description="Serenest uses validated clinical tools — PHQ-9 for depression and GAD-7 for anxiety — to track your mental health over time. Every score is logged, charted, and visible to your treating doctor, giving objective data to guide your care."
              included={[
                'PHQ-9 — Depression screening',
                'GAD-7 — Generalised Anxiety Disorder scale',
                'Mood check-ins — Daily emotional wellbeing log',
                'Trend charts visible to your doctor',
                'Retake over time to track progress',
              ]}
              price="Included free with every consultation"
            />

            <ServiceCard
              icon="🧪"
              title="Quick Self-Screening"
              lead="Not sure where to start? Answer a few questions."
              description="Choose your reason, relevant conditions, and preferred engagement style. This helps you get matched to the right care path — and understand your own mental health better before your first session."
              cta={<Link className="btn btn-ghost btn-sm" to="/screening">Start screening →</Link>}
            />

            <ServiceCard
              icon="💊"
              title="Medication Management"
              lead="Your medications, tracked and managed."
              description="Treatment doesn't end when the session does. Serenest helps you stay on track — with your active medications displayed clearly, dosage schedules, and optional reminders so you never miss a dose."
              included={[
                'Active prescription dashboard',
                'Morning / afternoon / night dosage schedule',
                'WhatsApp or push notification reminders',
                'Full medication history from all past sessions',
                'Refill reminder alerts',
                'Read-only — only your doctor can change prescriptions',
              ]}
            />

            <ServiceCard
              icon="🗂️"
              title="Session History & Records"
              lead="Your clinical records. Always available. Always locked."
              description="Every consultation generates a permanent, locked clinical record. Session summaries, SOAP notes, and prescriptions are stored securely — accessible to you anytime, sharable with other doctors if needed."
              included={[
                'Complete session history',
                "Session summary (doctor's treatment plan)",
                'All prescriptions — past and current',
                'PHQ-9 / GAD-7 score history',
                'Downloadable PDF records',
                'Permanently locked — no retroactive editing',
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Organisation Services ──────────────────────────── */}
      <section className="section alt" id="organisations">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Beyond individual care</div>
            <h2>Mental health programmes for organisations</h2>
            <p>
              We partner with corporates, schools, and colleges to bring
              structured, stigma-free mental health support to entire communities.
            </p>
          </div>

          <div className="org-cards">
            <div className="org-card org-card-corporate">
              <div className="org-card-top">
                <div className="org-icon">🏢</div>
                <div className="org-tag">Corporate</div>
              </div>
              <h3>Workplace Mental Health</h3>
              <p>Burnout, anxiety, and stress cost organisations billions each year. We offer confidential telepsychiatry, EAP-style counselling, and group wellness workshops tailored to your workforce.</p>
              <ul className="org-features">
                <li>Confidential 1-on-1 sessions for employees</li>
                <li>Manager mental health training</li>
                <li>Anonymous team wellbeing assessments</li>
                <li>Dedicated psychiatry hours per month</li>
              </ul>
              <a className="btn btn-ghost btn-sm org-cta" href="mailto:support@serenest.in?subject=Corporate%20Enquiry">
                Enquire for your company →
              </a>
            </div>

            <div className="org-card org-card-school">
              <div className="org-card-top">
                <div className="org-icon">🏫</div>
                <div className="org-tag">Schools</div>
              </div>
              <h3>Student &amp; Staff Wellbeing</h3>
              <p>Young students face academic pressure, social anxiety, and developmental challenges. Our school programme provides accessible, age-appropriate psychiatric care and counselling for teaching staff.</p>
              <ul className="org-features">
                <li>Child &amp; adolescent psychiatry specialists</li>
                <li>Parental guidance sessions</li>
                <li>Learning disability &amp; ADHD assessments</li>
                <li>Staff mental wellness support</li>
              </ul>
              <a className="btn btn-ghost btn-sm org-cta" href="mailto:support@serenest.in?subject=School%20Enquiry">
                Enquire for your school →
              </a>
            </div>

            <div className="org-card org-card-college">
              <div className="org-card-top">
                <div className="org-icon">🎓</div>
                <div className="org-tag">Colleges &amp; Universities</div>
              </div>
              <h3>Campus Mental Health</h3>
              <p>College is when many mental health conditions first emerge. We embed telepsychiatry into campus life — providing students on-demand consultations and structured follow-ups, without waitlists.</p>
              <ul className="org-features">
                <li>On-demand appointments for students</li>
                <li>Depression, anxiety &amp; substance use support</li>
                <li>Crisis triage &amp; referral pathways</li>
                <li>Anonymous mental health pulse surveys</li>
              </ul>
              <a className="btn btn-ghost btn-sm org-cta" href="mailto:support@serenest.in?subject=College%20Enquiry">
                Enquire for your institution →
              </a>
            </div>
          </div>

          <div className="org-bottom-cta">
            <p>Want a custom programme? Every organisation is different — we'll build a plan that fits your size, budget, and goals.</p>
            <a className="btn btn-primary" href="mailto:support@serenest.in?subject=Organisation%20Partnership">
              Request a partnership consultation →
            </a>
          </div>
        </div>
      </section>

      {/* ── How a Session Works ────────────────────────────── */}
      <section className="section" id="how">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Step by step</div>
            <h2>From booking to your first session</h2>
          </div>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <ol className="steps">
              {[
                ['Create your account', 'Register with your phone number. Complete a quick PHQ-9 intake. 5 minutes.'],
                ['Find your clinician', 'Browse verified psychiatrists and psychologists. Filter by language, fee, and more. Pick your slot.'],
                ['Pay securely', 'Razorpay-powered payment. UPI, cards, net banking accepted. Instant confirmation.'],
                ['Join your session', 'Click Join at appointment time — encrypted video, voice, or chat. Typical session ~45 minutes.'],
                ['Receive your care plan', 'Your doctor shares a clinical summary and, where appropriate, a digital prescription. Some medicines or situations may need in-person evaluation.'],
              ].map(([title, desc], i) => (
                <li key={title} className="step">
                  <div className="step-num">{i + 1}</div>
                  <div className="step-body">
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Who Uses Serenest ──────────────────────────────── */}
      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Made for</div>
            <h2>Who uses Serenest</h2>
          </div>
          <div className="grid-2">
            {[
              ['😟', 'First-time patients', 'Never booked mental health care before? Serenest makes your first step easy — private, judgement-free, and from home with a clinician who fits your needs.'],
              ['💊', 'Patients on long-term medication', "Need regular follow-ups and prescription refills? Skip the clinic visit — consult online and get your Rx digitally."],
              ['🏘️', 'Patients in smaller cities & towns', "No psychiatrist nearby? Serenest gives you access to verified specialists from Deesa to Delhi — without travelling."],
              ['👨‍⚕️', 'Professionals expanding their practice', 'Psychiatrist or psychologist — reach patients statewide with scheduling, SOAP notes, encrypted sessions, and payments in one dashboard.'],
            ].map(([icon, title, desc]) => (
              <article key={title} className="tile" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{icon}</span>
                <div>
                  <h3 style={{ marginBottom: 8 }}>{title}</h3>
                  <p>{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Conditions We Treat ────────────────────────────── */}
      <section className="section" id="conditions">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Clinical areas</div>
            <h2>Conditions our psychiatrists &amp; psychologists support</h2>
          </div>

          <div className="conditions-table">
            <div className="conditions-head-row">
              <span>Condition</span>
              <span>Common symptoms</span>
            </div>
            {CONDITIONS.map(({ name, symptoms }) => (
              <div key={name} className="conditions-row">
                <span className="conditions-name">{name}</span>
                <span className="conditions-symptoms">{symptoms}</span>
              </div>
            ))}
          </div>

          <div className="callout-box" style={{ marginTop: 20 }}>
            <span className="callout-box-icon">⚠️</span>
            <div>
              <div className="callout-box-title">Disclaimer</div>
              <p className="callout-box-text">
                Serenest is not for psychiatric emergencies. If you or someone you know is in
                immediate danger, call iCall:{' '}
                <a href="tel:7777936367" style={{ color: 'var(--teal-700)', fontWeight: 700 }}>7777936367</a>
                {' '}or your nearest emergency service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Coming Soon ────────────────────────────────────── */}
      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">On the roadmap</div>
            <h2>What's coming to Serenest</h2>
          </div>
          <div className="grid-3">
            {[
              ['🤖', 'AI-Assisted Session Analysis', 'Clinical NLP that analyses session patterns, flags risk indicators, and generates draft SOAP notes — helping psychiatrists document faster and focus more on patients.'],
              ['👨‍👩‍👧', 'Family Consultation Mode', 'Bring a family member into the session as a support observer — with patient consent. Built for Indian family-centred mental healthcare.'],
              ['🗣️', 'Therapy Integration', 'Connect with trained psychologists and therapists for CBT, DBT, and supportive therapy — alongside your psychiatrist for combined care.'],
            ].map(([icon, title, desc]) => (
              <article key={title} className="tile">
                <div className="tile-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-body">
              <h2>Ready to start your care journey?</h2>
              <p>Same-day appointments are often available. Book in under 2 minutes.</p>
            </div>
            <div className="cta-banner-actions">
              <Link className="btn btn-primary btn-lg" to="/book">Book an appointment →</Link>
              <a className="btn btn-outline btn-lg" href="mailto:support@serenest.in">Email us</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
