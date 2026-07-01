import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const UPDATED = 'June 2026';

export default function PatientTermsPage() {
  useSEO({ path: '/patient/terms', ...ROUTE_SEO['/patient/terms'] });
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">For Patients</p>
            <h1 className="page-title">Patient Terms of Use</h1>
            <p className="about-subtext">
              These terms apply specifically to patients using Serenest to book and attend consultations with mental health professionals.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="callout" style={{ borderRadius: 12, padding: '1rem 1.25rem', marginBottom: 0 }}>
              <strong>Not an emergency service.</strong> Serenest is not equipped to handle psychiatric emergencies. If you or someone you know is in immediate danger, call <strong>112</strong> or go to the nearest hospital emergency department. For crisis support, contact iCall at <strong>9152987821</strong> or Vandrevala Foundation at <strong>1860-2662-345</strong>.
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>1. Nature of the Service</h2>
              <p className="muted">Serenest connects you with independent, verified mental health professionals for teleconsultations. Serenest is a technology intermediary — we do not diagnose, treat, or prescribe. All clinical decisions are made by your chosen professional.</p>
              <p className="muted" style={{ marginTop: 8 }}>Teleconsultation is not a substitute for in-person care in all situations. Your professional will advise you if in-person assessment or emergency care is required.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>2. Booking &amp; Scheduling</h2>
              <ul className="list">
                <li>You book appointments directly through the platform and pay at the time of booking.</li>
                <li>Appointment confirmation is sent to your registered phone number.</li>
                <li>You are responsible for attending at the confirmed time. Technical preparation (stable internet, device check) is your responsibility.</li>
                <li>Consultations begin and end at the scheduled time regardless of late joining.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>3. Cancellation &amp; Refunds</h2>
              <p className="muted">Please read our <Link to="/refund-policy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Refund &amp; Cancellation Policy</Link> carefully. In summary:</p>
              <ul className="list">
                <li>Cancellations made more than 24 hours before the appointment: full refund.</li>
                <li>Cancellations within 24 hours: 50% refund.</li>
                <li>No-shows: no refund.</li>
                <li>Technical failure on our end: full refund or reschedule.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>4. Your Responsibilities During a Session</h2>
              <ul className="list">
                <li>Provide accurate and complete health information to your professional.</li>
                <li>Treat your professional with respect. Abusive or threatening behaviour will result in session termination and account suspension.</li>
                <li>Do not record sessions without the explicit consent of your professional.</li>
                <li>Ensure you are in a private, quiet space during the consultation.</li>
                <li>Do not join a session while operating a vehicle or in a public space where your privacy cannot be maintained.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>5. Consent to Teleconsultation</h2>
              <p className="muted">By booking a consultation, you acknowledge that you have read and accept our <Link to="/consent" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Teleconsultation Consent</Link>. You understand the limitations of remote care and that your professional may refer you for in-person assessment if clinically necessary.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>6. Prescriptions</h2>
              <p className="muted">Digital prescriptions are issued only by verified MD Psychiatrists and are compliant with MCI Telemedicine Guidelines and Schedule H regulations. Prescriptions are valid at pharmacies. Serenest does not supply medicines. You are responsible for safe medication use as directed by your psychiatrist.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>7. Privacy</h2>
              <p className="muted">Your health information is handled in accordance with our <Link to="/privacy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Privacy Policy</Link> and the Digital Personal Data Protection Act 2023. Your session notes and clinical records are accessible only to you and your treating professional.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>8. Complaints</h2>
              <p className="muted">If you have a complaint about a professional or the service, please use our <Link to="/grievance-policy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Grievance Policy</Link>. All complaints are taken seriously and reviewed within 7 working days.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
