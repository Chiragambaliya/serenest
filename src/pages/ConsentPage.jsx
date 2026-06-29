import React from 'react';
import { Link } from 'react-router-dom';

const UPDATED = 'June 2026';

export default function ConsentPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Clinical</p>
            <h1 className="page-title">Teleconsultation Consent</h1>
            <p className="about-subtext">
              This document explains what you are consenting to when you book and attend a teleconsultation on Serenest.
              Booking a session constitutes your informed consent to the terms below.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>1. What is Teleconsultation?</h2>
              <p className="muted">Teleconsultation is the delivery of healthcare services — including psychiatric evaluation, psychological counselling, and therapy — through electronic means (video, audio, or text). It is conducted in compliance with the MCI Telemedicine Practice Guidelines 2020 issued by the Ministry of Health and Family Welfare, Government of India.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>2. Benefits of Teleconsultation</h2>
              <ul className="list">
                <li>Access to verified mental health professionals without geographical barriers</li>
                <li>Flexible scheduling including evenings and weekends</li>
                <li>Continuity of care from the safety and privacy of your home</li>
                <li>Structured documentation and digital records accessible to you</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>3. Limitations &amp; Risks</h2>
              <p className="muted">You understand and accept that teleconsultation has inherent limitations:</p>
              <ul className="list">
                <li>Physical examination is not possible through teleconsultation. Your professional may refer you for in-person assessment if clinically necessary.</li>
                <li>Technical issues (connectivity, audio/video quality) may affect the quality of the session.</li>
                <li>Emergency situations cannot be managed remotely. If you are in crisis, you must contact emergency services (112) immediately.</li>
                <li>The professional may determine that teleconsultation is not appropriate for your condition and recommend in-person care.</li>
                <li>Digital prescriptions are subject to verification by pharmacies and may not be accepted in all cases.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>4. Privacy &amp; Confidentiality</h2>
              <p className="muted">Your session is private and confidential. Serenest employs encryption for all communication. No session is recorded by the platform without your explicit written consent. Your treating professional is bound by confidentiality obligations.</p>
              <p className="muted" style={{ marginTop: 8 }}>Confidentiality may be overridden only in the following situations required by law or clinical duty: imminent risk of harm to yourself or others, child abuse disclosure, or a court order.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>5. Consent to Treatment</h2>
              <p className="muted">By proceeding with a booking, you consent to:</p>
              <ul className="list">
                <li>Receiving mental health care via teleconsultation from the professional you select</li>
                <li>The professional reviewing any prior clinical records you share on the platform</li>
                <li>Receiving a digital prescription where clinically appropriate and issued by a verified MD Psychiatrist</li>
                <li>Your session notes being stored securely and accessible to you</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>6. Minors</h2>
              <p className="muted">Teleconsultations for patients under 18 years require the presence and consent of a parent or legal guardian. The guardian is responsible for ensuring the minor's participation and for decisions about treatment.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>7. Withdrawal of Consent</h2>
              <p className="muted">You may withdraw your consent to teleconsultation at any time by not booking further sessions. Withdrawal does not affect the lawfulness of care already provided. For data deletion, refer to our <Link to="/privacy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Privacy Policy</Link>.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>8. Emergency Contacts</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 8 }}>
                {[
                  { name: 'Emergency Services', number: '112' },
                  { name: 'iCall (TISS)', number: '9152987821' },
                  { name: 'Vandrevala Foundation', number: '1860-2662-345' },
                  { name: 'NIMHANS', number: '080-46110007' },
                ].map((c) => (
                  <div key={c.name} style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{c.name}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-500)', marginTop: 2 }}>{c.number}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
