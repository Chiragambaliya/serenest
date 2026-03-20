import React from 'react';
import { Link } from 'react-router-dom';

export default function ServicesPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Our Services</p>
            <h1 className="page-title">Everything you need for mental health care — in one place.</h1>
            <p className="about-subtext">
              From your first consultation to ongoing treatment, medication management, and mental health
              tracking — Serenest is a complete clinical platform, not just a booking app.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Services Overview">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Services overview</p>
            <h2>Six core services, built for clinical care.</h2>
          </div>

          <div className="service-grid">
            <article className="tile service-card">
              <div className="service-head">
                <h3>Online Mental Health Consultation</h3>
                <span className="service-badge">Most Popular</span>
              </div>
              <p className="service-lead">Talk to a verified mental health practitioner from home.</p>
              <p className="muted">
                Book a 45-minute video consultation with a verified practitioner — psychiatrist, psychologist,
                therapist, or counsellor — from anywhere in India. No waiting rooms. No travel. No stigma.
                Just a private, encrypted video call with a qualified professional who listens, assesses, and
                guides your care.
              </p>

              <details className="service-more">
                <summary className="service-summary">See what&apos;s included &amp; who it&apos;s for</summary>
                <div className="service-split">
                  <div>
                    <div className="service-subhead">What&apos;s included</div>
                    <ul className="list">
                      <li>45-minute encrypted video session</li>
                      <li>Clinical assessment (as appropriate to the practitioner)</li>
                      <li>Clinical SOAP documentation</li>
                      <li>Diagnosis and treatment plan</li>
                      <li>Follow-up recommendation</li>
                      <li>Digital prescription (if required)</li>
                    </ul>
                  </div>
                  <div>
                    <div className="service-subhead">Who it&apos;s for</div>
                    <p className="muted">
                      Anxiety, Depression, OCD, PTSD, Bipolar Disorder, Schizophrenia, Sleep disorders,
                      Stress, Burnout, Relationship issues, Medication review
                    </p>
                    <div className="price-row">
                      <span className="price">Starting at: ₹499 per session</span>
                    </div>
                  </div>
                </div>
              </details>
            </article>

            <article className="tile service-card">
              <h3>Digital Prescription</h3>
              <p className="service-lead">Valid prescriptions. Delivered digitally.</p>
              <p className="muted">
                Every prescription issued on Serenest is MCI-compliant, digitally signed with the
                doctor&apos;s registration number, and accepted at pharmacies across India. No paper. No
                ambiguity. Just a clean, verifiable PDF you can download instantly.
              </p>
              <details className="service-more">
                <summary className="service-summary">What&apos;s included</summary>
                <ul className="list">
                  <li>Digital PDF prescription</li>
                  <li>Doctor&apos;s MCI registration number</li>
                  <li>Drug name, dose, frequency, duration</li>
                  <li>Patient details and consultation date</li>
                  <li>QR-verifiable digital signature</li>
                  <li>Valid under MCI Telemedicine Guidelines 2020</li>
                </ul>
              </details>
              <div className="callout">
                <div className="callout-title">Important note</div>
                <p className="muted" style={{ margin: 0 }}>
                  Prescriptions are issued only after a proper video consultation. No prescription without a
                  session — ever. Schedule H medications follow all regulatory requirements.
                </p>
              </div>
            </article>

            <article className="tile service-card">
              <h3>Mental Health Assessments</h3>
              <p className="service-lead">Know where you stand, clinically.</p>
              <p className="muted">
                Serenest uses validated clinical tools — PHQ-9 for depression and GAD-7 for anxiety — to
                track your mental health over time. Every score is logged, charted, and visible to your
                treating practitioner, giving them objective data to guide your care.
              </p>
              <details className="service-more">
                <summary className="service-summary">Assessments available</summary>
                <ul className="list">
                  <li>PHQ-9 — Patient Health Questionnaire (Depression screening)</li>
                  <li>GAD-7 — Generalised Anxiety Disorder scale</li>
                  <li>Mood check-ins — Daily emotional wellbeing log</li>
                </ul>
                <div className="service-subhead">How it works</div>
                <p className="muted">
                  Complete an assessment before your first session. Retake it over time. Your practitioner
                  sees the trend — not just a snapshot — and adjusts care accordingly.
                </p>
              </details>
              <div className="price-row">
                <span className="price">Cost: Included free with every consultation</span>
              </div>
            </article>

            <article className="tile service-card">
              <h3>Quick Screening</h3>
              <p className="service-lead">Answer a few questions to get directed support.</p>
              <p className="muted">
                Choose your reason, relevant conditions, and preferred engagement style. This helps you get matched to the right care path.
              </p>
              <div className="booking-actions" style={{ marginTop: 12 }}>
                <Link className="btn btn-primary" to="/screening">
                  Start screening →
                </Link>
                <Link className="btn btn-ghost" to="/book">
                  Book directly →
                </Link>
              </div>
            </article>

            <article className="tile service-card">
              <h3>Medication Management</h3>
              <p className="service-lead">Your medications, tracked and managed.</p>
              <p className="muted">
                Treatment doesn&apos;t end when the session does. Serenest helps you stay on track
                — with your active medications displayed clearly, dosage schedules, and optional reminders so
                you never miss a dose.
              </p>
              <details className="service-more">
                <summary className="service-summary">What&apos;s included</summary>
                <ul className="list">
                  <li>Active prescription dashboard</li>
                  <li>Morning / afternoon / night dosage schedule</li>
                  <li>WhatsApp or push notification reminders</li>
                  <li>Full medication history from all past sessions</li>
                  <li>Refill reminder alerts</li>
                  <li>Read-only — only your doctor can change prescriptions</li>
                </ul>
              </details>
            </article>

            <article className="tile service-card">
              <h3>Session History &amp; Records</h3>
              <p className="service-lead">Your clinical records. Always available. Always locked.</p>
              <p className="muted">
                Every consultation on Serenest generates a permanent, locked clinical record. Session
                summaries, SOAP notes (Plan section), and prescriptions are stored securely — accessible to
                you anytime, sharable with other doctors if needed.
              </p>
              <details className="service-more">
                <summary className="service-summary">What&apos;s included</summary>
                <ul className="list">
                  <li>Complete session history</li>
                  <li>Session summary (doctor&apos;s treatment plan)</li>
                  <li>All prescriptions — past and current</li>
                  <li>PHQ-9 / GAD-7 score history</li>
                  <li>Downloadable PDF records</li>
                  <li>Permanently locked — no retroactive editing</li>
                </ul>
              </details>
              <div className="callout">
                <div className="callout-title">Why locked records matter</div>
                <p className="muted" style={{ margin: 0 }}>
                  Immutable records protect both patient and doctor. Medico-legally sound. Audit-trail
                  compliant. Built for India&apos;s healthcare documentation standards.
                </p>
              </div>
            </article>

            <article className="tile service-card">
              <h3>Mental Health Practitioner Network</h3>
              <p className="service-lead">Verified professionals across India.</p>
              <p className="muted">
                Serenest brings together verified psychiatrists, psychologists, therapists, and counsellors.
                We verify credentials before any professional goes live. Patients can filter by language
                (English, Hindi, Gujarati), fee, and availability.
              </p>
              <details className="service-more">
                <summary className="service-summary">See details</summary>
                <div className="service-split">
                  <div>
                    <div className="service-subhead">What patients see</div>
                    <ul className="list">
                      <li>Practitioner name, photo, credentials</li>
                      <li>Languages spoken</li>
                      <li>Years of experience</li>
                      <li>Consultation fee</li>
                      <li>Star rating and review count</li>
                      <li>Next available slot (real-time)</li>
                    </ul>
                  </div>
                  <div>
                    <div className="service-subhead">For professionals</div>
                    <p className="muted">
                      Serenest offers a complete practice management system — appointments, notes,
                      prescriptions (where applicable), patient history, schedule management, and earnings
                      dashboard — built for mental health practitioners.
                    </p>
                  </div>
                </div>
              </details>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt" aria-label="Coming Soon">
        <div className="container">
          <div className="section-head">
            <p className="section-label">On the roadmap</p>
            <h2>What&apos;s coming to Serenest</h2>
          </div>

          <div className="grid-3">
            <article className="tile">
              <h3>🤖 AI-Assisted Session Analysis</h3>
              <p className="muted">
                Clinical NLP that analyses session patterns, flags risk indicators, and generates draft SOAP
                notes — helping psychiatrists document faster and focus more on patients.
              </p>
            </article>
            <article className="tile">
              <h3>👨‍👩‍👧 Family Consultation Mode</h3>
              <p className="muted">
                Bring a family member into the session as a support observer — with patient consent. Built
                for Indian family-centred mental healthcare.
              </p>
            </article>
            <article className="tile">
              <h3>🗣️ Therapy Integration</h3>
              <p className="muted">
                Connect with trained psychologists and therapists for CBT, DBT, and supportive therapy —
                alongside your psychiatrist for combined care.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Who Serenest Is For">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Made for</p>
            <h2>Who uses Serenest</h2>
          </div>

          <div className="grid-2">
            <article className="tile">
              <h3>😟 First-time patients</h3>
              <p className="muted">
                Never seen a psychiatrist before? Don&apos;t know where to start? Serenest makes your first
                step easy — private, judgement-free, and from home.
              </p>
            </article>
            <article className="tile">
              <h3>💊 Patients on long-term medication</h3>
              <p className="muted">
                Need regular follow-ups and prescription refills for ongoing psychiatric conditions? Skip
                the clinic visit — consult online and get your Rx digitally.
              </p>
            </article>
            <article className="tile">
              <h3>🏘️ Patients in smaller cities &amp; towns</h3>
              <p className="muted">
                No psychiatrist nearby? Serenest gives you access to verified specialists from Deesa to
                Delhi — without travelling.
              </p>
            </article>
            <article className="tile">
              <h3>👨‍⚕️ Psychiatrists expanding their practice</h3>
              <p className="muted">
                Want to reach patients beyond your clinic&apos;s geography? Serenest gives you a complete
                digital practice — scheduling, documentation, prescriptions, and payments in one platform.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt" aria-label="How a Session Works">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Step by step</p>
            <h2>From booking to prescription in under an hour.</h2>
          </div>
          <ol className="steps">
            <li className="step">
              <strong>Create your account</strong> — Register with your phone number. Complete a quick PHQ-9
              intake. 5 minutes.
            </li>
            <li className="step">
              <strong>Find your psychiatrist</strong> — Browse verified MDs. Filter by language, availability,
              and fee. Pick your slot.
            </li>
            <li className="step">
              <strong>Pay securely</strong> — Razorpay-powered payment. UPI, cards, net banking accepted.
              Instant confirmation.
            </li>
            <li className="step">
              <strong>Join your session</strong> — Click &quot;Join Consultation&quot; at your appointment time.
              Encrypted video call. 45 minutes.
            </li>
            <li className="step">
              <strong>Get your prescription</strong> — Your doctor issues a digital Rx immediately after the
              session. Download as PDF.
            </li>
          </ol>
        </div>
      </section>

      <section className="section" aria-label="Conditions We Address">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Clinical areas</p>
            <h2>What our psychiatrists treat</h2>
          </div>

          <div className="conditions-table" role="table" aria-label="Conditions grid">
            <div className="conditions-row conditions-head" role="row">
              <div className="conditions-cell" role="columnheader">
                Condition
              </div>
              <div className="conditions-cell" role="columnheader">
                Common symptoms
              </div>
            </div>

            <div className="conditions-row" role="row">
              <div className="conditions-cell" role="cell">
                Depression
              </div>
              <div className="conditions-cell" role="cell">
                Persistent sadness, loss of interest, fatigue, hopelessness
              </div>
            </div>
            <div className="conditions-row" role="row">
              <div className="conditions-cell" role="cell">
                Anxiety Disorders
              </div>
              <div className="conditions-cell" role="cell">
                Excessive worry, panic attacks, social anxiety, phobias
              </div>
            </div>
            <div className="conditions-row" role="row">
              <div className="conditions-cell" role="cell">
                OCD
              </div>
              <div className="conditions-cell" role="cell">
                Intrusive thoughts, compulsive behaviours, rituals
              </div>
            </div>
            <div className="conditions-row" role="row">
              <div className="conditions-cell" role="cell">
                Bipolar Disorder
              </div>
              <div className="conditions-cell" role="cell">
                Mood swings between mania and depression
              </div>
            </div>
            <div className="conditions-row" role="row">
              <div className="conditions-cell" role="cell">
                Schizophrenia
              </div>
              <div className="conditions-cell" role="cell">
                Hallucinations, delusions, disorganised thinking
              </div>
            </div>
            <div className="conditions-row" role="row">
              <div className="conditions-cell" role="cell">
                PTSD
              </div>
              <div className="conditions-cell" role="cell">
                Flashbacks, nightmares, emotional numbness after trauma
              </div>
            </div>
            <div className="conditions-row" role="row">
              <div className="conditions-cell" role="cell">
                ADHD (Adults)
              </div>
              <div className="conditions-cell" role="cell">
                Inattention, impulsivity, difficulty organising tasks
              </div>
            </div>
            <div className="conditions-row" role="row">
              <div className="conditions-cell" role="cell">
                Sleep Disorders
              </div>
              <div className="conditions-cell" role="cell">
                Insomnia, hypersomnia, disrupted sleep patterns
              </div>
            </div>
            <div className="conditions-row" role="row">
              <div className="conditions-cell" role="cell">
                Addiction / De-addiction
              </div>
              <div className="conditions-cell" role="cell">
                Alcohol, substance use, behavioural addictions
              </div>
            </div>
            <div className="conditions-row" role="row">
              <div className="conditions-cell" role="cell">
                Stress &amp; Burnout
              </div>
              <div className="conditions-cell" role="cell">
                Work stress, emotional exhaustion, caregiver fatigue
              </div>
            </div>
          </div>

          <div className="callout" style={{ marginTop: 14 }}>
            <div className="callout-title">Disclaimer</div>
            <p className="muted" style={{ margin: 0 }}>
              Serenest is not for psychiatric emergencies. If you or someone you know is in immediate
              danger, call iCall: <a href="tel:9152987821">9152987821</a> or your nearest emergency service.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

