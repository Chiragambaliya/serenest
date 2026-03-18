import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="kicker">Clinical telepsychiatry for India</p>
            <h1 className="hero-title">
              Mental health care that feels <span className="gradient-text">calm</span>, private, and clinical‑grade.
            </h1>
            <p className="hero-lead">
              Secure video, audio, or chat consultations with a structured intake, assessments, and
              follow‑ups—built for continuity of care.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/book">
                Book an appointment →
              </Link>
              <Link className="btn btn-ghost" to="/services">
                View services
              </Link>
              <Link className="btn btn-ghost" to="/professionals">
                For professionals
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <h2>Services</h2>
            <p>Choose the care format that fits you. We keep it structured and clinically grounded.</p>
          </div>
          <div className="grid-3">
            <article className="tile">
              <h3>Consultations</h3>
              <p>Psychiatry consults and follow‑ups over secure telemedicine sessions.</p>
            </article>
            <article className="tile">
              <h3>Assessments</h3>
              <p>PHQ‑9, GAD‑7 and intake to guide care planning and track progress.</p>
            </article>
            <article className="tile">
              <h3>Continuity</h3>
              <p>Care plans, reminders, and re‑booking that help patients stay consistent.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt" id="how">
        <div className="container">
          <div className="section-head">
            <h2>How it works</h2>
            <p>A calm flow from first step to follow‑ups.</p>
          </div>
          <ol className="steps">
            <li className="step">
              <strong>Screen</strong> — Answer quick questions to find the right path.
            </li>
            <li className="step">
              <strong>Book</strong> — Choose a doctor and a time slot.
            </li>
            <li className="step">
              <strong>Consult</strong> — Video/audio/chat session with clinical notes.
            </li>
            <li className="step">
              <strong>Follow‑up</strong> — Track symptoms and keep continuity.
            </li>
          </ol>
        </div>
      </section>

      <section className="section" id="trust">
        <div className="container">
          <div className="section-head">
            <h2>Safety & privacy</h2>
            <p>Designed to protect patient data and reduce unnecessary access.</p>
          </div>
          <div className="grid-2">
            <div className="tile">
              <h3>Secure sessions</h3>
              <p>Consult modes built for confidentiality and patient comfort.</p>
            </div>
            <div className="tile">
              <h3>Least-access approach</h3>
              <p>Data access is restricted to care teams and authorized admins per policy.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-label="Testimonials">
        <div className="container">
          <div className="section-head">
            <h2>Designed for real clinical practice</h2>
            <p>Premium UX for patients, clinician-first workflows for doctors.</p>
          </div>
          <div className="grid-3">
            <div className="quote">
              <p>
                “A clean flow from intake to follow‑up. It feels structured, not like a chat app.”
              </p>
              <div className="quote-by">Psychiatrist · India</div>
            </div>
            <div className="quote">
              <p>
                “The experience is calm. Less friction, more clarity. That matters for mental health.”
              </p>
              <div className="quote-by">Patient</div>
            </div>
            <div className="quote">
              <p>
                “Assessments + notes + continuity in one place—built with the right intent.”
              </p>
              <div className="quote-by">Clinic admin</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" id="contact">
        <div className="container">
          <div className="cta">
            <div>
              <h2>Talk to us</h2>
              <p>Questions about services or professional onboarding? Reach out.</p>
              <p className="muted">
                Email: <a href="mailto:support@serenest.fit">support@serenest.fit</a>
              </p>
            </div>
            <div className="stack">
              <a className="btn btn-primary" href="mailto:support@serenest.fit">
                Email support
              </a>
              <a className="btn btn-ghost" href="#services">
                Services
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

