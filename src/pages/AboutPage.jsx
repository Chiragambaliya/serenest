import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">About Serenest</p>
            <h1 className="page-title">Built by a psychiatrist who saw the gap firsthand.</h1>
            <p className="about-subtext">
              Serenest was born in a clinic in Deesa, Gujarat — where patients drove hours for a 15-minute
              consultation, and entire districts had no psychiatrist at all. We built the platform we wish
              had existed.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-label="The Problem We're Solving">
        <div className="container">
          <div className="section-head">
            <p className="section-label">The reality in India</p>
            <h2>800 million Indians have no access to a psychiatrist.</h2>
          </div>

          <div className="stat-grid">
            <article className="tile stat-card">
              <div className="stat-value">0.75</div>
              <div className="stat-label">Psychiatrists per 1 lakh population</div>
            </article>
            <article className="tile stat-card">
              <div className="stat-value">80%</div>
              <div className="stat-label">Of people with mental illness receive no treatment</div>
            </article>
            <article className="tile stat-card">
              <div className="stat-value">42 years</div>
              <div className="stat-label">
                Time needed to fill India&apos;s psychiatrist shortage at current rate
              </div>
            </article>
          </div>

          <p className="about-body">
            India has one of the world&apos;s largest mental health burdens — yet our mental health
            infrastructure remains critically underfunded. Stigma keeps patients silent. Distance keeps
            them away from care. And when they do seek help, waitlists stretch for weeks.
          </p>
          <p className="about-body">
            This is not a technology problem. It is an access problem. And technology is how we solve it.
          </p>
        </div>
      </section>

      <section className="section alt" aria-label="Founder Story">
        <div className="container">
          <div className="section-head">
            <p className="section-label">From the founder</p>
            <h2>Why I built Serenest</h2>
          </div>

          <div className="founder-grid">
            <div className="tile founder-card">
              <div className="founder-avatar" aria-hidden="true">
                CA
              </div>
              <div>
                <div className="founder-name">Dr. Chirag Aambalia</div>
                <div className="founder-role">Consultant Psychiatrist · Deesa, Gujarat</div>
              </div>
            </div>

            <div className="tile founder-story">
              <p className="quote-text">
                I&apos;m Dr. Chirag Aambalia — Consultant Psychiatrist at Rudra Neuropsychiatry and
                De-addiction Hospital in Deesa, Gujarat.
              </p>

              <details className="service-more">
                <summary className="service-summary">Read the founder story</summary>
                <p className="quote-text">
                  Every week in my clinic, I meet patients who&apos;ve waited months for an appointment — or
                  who&apos;ve never seen a psychiatrist at all because the nearest one is 100 kilometres
                  away. I meet families who are suffering in silence because they don&apos;t know help is
                  available, or because they&apos;re afraid of what people will say.
                </p>
                <p className="quote-text">
                  I built Serenest because I believe every Indian deserves the same quality of psychiatric
                  care — whether they live in Mumbai or a small town in North Gujarat. Clinical-grade.
                  Private. Affordable. From home.
                </p>
                <p className="quote-text">
                  This isn&apos;t just an app. It&apos;s a clinical platform built by someone who has sat across
                  from patients every single day and understood exactly what they need.
                </p>
              </details>

              <div className="cred-row" aria-label="Credentials">
                <span className="cred-pill">MBBS · MD Psychiatry</span>
                <span className="cred-pill">
                  Consultant Psychiatrist, Rudra Neuropsychiatry &amp; De-addiction Hospital, Deesa, Gujarat
                </span>
                <span className="cred-pill">Founder, Serenest Private Limited</span>
                <span className="cred-pill">DPIIT Recognised Startup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="What Makes Serenest Different">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Our difference</p>
            <h2>Not just another app. A clinical platform.</h2>
          </div>
          <div className="grid-3">
            <article className="tile">
              <h3>🩺 Built by a clinician</h3>
              <p className="muted">
                Serenest is designed by a practicing psychiatrist — not a tech team guessing at healthcare.
                Every workflow, every feature, and every safety rule comes from real clinical experience.
              </p>
            </article>
            <article className="tile">
              <h3>📋 MCI Telemedicine Compliant</h3>
              <p className="muted">
                We follow India&apos;s MCI Telemedicine Practice Guidelines 2020 to the letter. Every
                prescription is legally valid. Every session is documented correctly. Every record is
                permanently locked after consultation.
              </p>
            </article>
            <article className="tile">
              <h3>🔒 Privacy by design</h3>
              <p className="muted">
                Your health information is yours. We never share it with insurers, employers, or third
                parties. Sessions are end-to-end encrypted. Records are locked and protected under
                India&apos;s DPDP Act 2023.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt" aria-label="Our Mission">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Mission</p>
            <h2>Make psychiatric care as accessible as a phone call.</h2>
          </div>
          <p className="about-body">
            We believe mental health is health. Not a luxury. Not something to be ashamed of. Not something
            you should have to travel hours to access.
          </p>
          <p className="about-body">
            Serenest&apos;s mission is to connect every Indian — regardless of location, language, or income —
            with a qualified, verified psychiatrist. In English, Hindi, or Gujarati. From anywhere. In
            minutes.
          </p>
        </div>
      </section>

      <section className="section" aria-label="The Platform">
        <div className="container">
          <div className="section-head">
            <p className="section-label">What we&apos;ve built</p>
            <h2>A complete clinical ecosystem — not just video calls.</h2>
          </div>

          <div className="feature-grid">
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                📅
              </div>
              <h3>Smart Scheduling</h3>
              <p className="muted">
                Book appointments with verified psychiatrists across India. Real-time slot availability.
              </p>
            </article>
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                🎥
              </div>
              <h3>Encrypted Video Consultations</h3>
              <p className="muted">
                End-to-end encrypted video sessions. No data stored on third-party servers.
              </p>
            </article>
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                📋
              </div>
              <h3>SOAP Clinical Notes</h3>
              <p className="muted">
                Structured session documentation — Subjective, Objective, Assessment, Plan. Permanently
                locked post-session.
              </p>
            </article>
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                💊
              </div>
              <h3>Digital Prescriptions</h3>
              <p className="muted">
                MCI-compliant digital Rx with doctor&apos;s registration number. Valid at pharmacies across
                India.
              </p>
            </article>
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                📊
              </div>
              <h3>PHQ-9 &amp; GAD-7 Tracking</h3>
              <p className="muted">
                Validated clinical assessment tools tracked over time. Every doctor sees your full history.
              </p>
            </article>
            <article className="tile feature-card">
              <div className="feature-icon" aria-hidden="true">
                🤖
              </div>
              <h3>AI-Assisted Analysis (coming soon)</h3>
              <p className="muted">
                Session summaries and clinical NLP — helping psychiatrists focus on patients, not paperwork.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt" aria-label="Compliance & Trust">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Trust &amp; Safety</p>
            <h2>Built on India&apos;s regulatory framework. From day one.</h2>
          </div>

          <div className="grid-2 compliance-grid">
            <article className="tile">
              <h3>MCI Telemedicine Practice Guidelines 2020</h3>
              <p className="muted">
                Every consultation on Serenest follows the national standard for telemedicine in India.
                Prescription, documentation, and consent — all compliant.
              </p>
            </article>
            <article className="tile">
              <h3>DPDP Act 2023</h3>
              <p className="muted">
                Your personal health information is protected under India&apos;s Digital Personal Data
                Protection Act. You have the right to access, correct, and delete your data at any time.
              </p>
            </article>
            <article className="tile">
              <h3>DPIIT Recognised Startup</h3>
              <p className="muted">
                Serenest Private Limited is a DPIIT recognised startup under the Government of India&apos;s
                Startup India initiative.
              </p>
            </article>
            <article className="tile">
              <h3>Schedule H Compliance</h3>
              <p className="muted">
                Psychiatric medications prescribed on Serenest follow Schedule H regulations. Only verified
                MD psychiatrists can prescribe controlled substances.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Vision">
        <div className="container">
          <div className="section-head">
            <p className="section-label">Where we&apos;re going</p>
            <h2>The future of psychiatry in India is objective, accessible, and AI-assisted.</h2>
          </div>
          <p className="about-body">
            Our long-term vision goes beyond scheduling and video calls. We&apos;re building an Objective
            Psychiatry Engine — AI-powered session analysis, clinical NLP, risk detection, and treatment
            optimisation tools that help psychiatrists make better clinical decisions faster.
          </p>
          <p className="about-body">
            This is the platform that will close India&apos;s mental health gap — one consultation at a time.
          </p>
        </div>
      </section>

      <section className="section alt" aria-label="CTA">
        <div className="container">
          <div className="cta about-cta">
            <div>
              <h2 className="h2" style={{ margin: 0 }}>
                Ready to take the first step?
              </h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                Book a confidential consultation with a verified psychiatrist — from anywhere in India, in
                minutes.
              </p>
              <p className="fineprint" style={{ marginBottom: 0 }}>
                No referral needed · Consultations from ₹499 · Fully confidential
              </p>
            </div>
            <div className="stack about-cta-actions">
              <a
                className="btn btn-primary btn-full"
                href="mailto:support@serenest.fit?subject=Book%20a%20Consultation"
              >
                Book a Consultation →
              </a>
              <Link
                className="btn btn-ghost btn-full"
                to="/professionals/apply"
              >
                Join as a Doctor
              </Link>
              <Link className="btn btn-ghost btn-full" to="/">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

