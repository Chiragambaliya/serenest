import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const UPDATED = 'June 2026';

export default function ProfessionalTermsPage() {
  useSEO({ path: '/professionals/terms', ...ROUTE_SEO['/professionals/terms'] });
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">For Professionals</p>
            <h1 className="page-title">Professional Terms &amp; Conditions</h1>
            <p className="about-subtext">
              These terms apply to all mental health professionals — psychiatrists, psychologists, therapists, and counsellors —
              who join and practise on the Serenest platform.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>1. Relationship</h2>
              <p className="muted">Professionals on Serenest are independent practitioners, not employees or agents of Serenest Education Pvt Ltd. Serenest provides a technology platform and operational infrastructure; you provide clinical services. Nothing in these Terms creates an employment, partnership, or joint venture relationship.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>2. Eligibility &amp; Verification</h2>
              <ul className="list">
                <li><strong>Psychiatrists:</strong> Valid MCI / State Medical Council registration; MBBS + MD Psychiatry or equivalent.</li>
                <li><strong>Psychologists:</strong> RCI registration; minimum M.Phil (Clinical Psychology) or equivalent Ph.D.</li>
                <li><strong>Therapists &amp; Counsellors:</strong> Recognised Masters degree (MA Psychology, MSW, or equivalent) and professional registration where applicable.</li>
                <li>You must not be under suspension, investigation, or disqualification by any regulatory body.</li>
                <li>You must hold valid professional indemnity insurance if required by your regulatory body.</li>
              </ul>
              <p className="muted" style={{ marginTop: 8 }}>Serenest reserves the right to verify credentials at any time and suspend or remove any professional whose credentials cannot be confirmed.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>3. Fees &amp; Payouts</h2>
              <ul className="list">
                <li>You set your own consultation fee within platform-defined ranges.</li>
                <li>Serenest deducts a platform service fee (communicated at onboarding and subject to change with 30 days' notice).</li>
                <li>Payouts are processed within 48 hours of a session being marked complete, via bank transfer to the account you register.</li>
                <li>GST obligations on your income are your sole responsibility. Serenest will provide session-level earning records for your tax filings.</li>
                <li>Sessions interrupted due to patient technical issues are handled per our Refund &amp; Cancellation Policy; sessions interrupted due to your technical issues will not be credited to you.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>4. Clinical Obligations</h2>
              <ul className="list">
                <li>You must conduct consultations in compliance with the MCI Telemedicine Practice Guidelines 2020.</li>
                <li>Prescriptions may only be issued by registered MD Psychiatrists, and must comply with Schedule H regulations.</li>
                <li>You must complete session documentation (SOAP notes or equivalent) within 24 hours of the session.</li>
                <li>You must not provide clinical services outside your scope of qualification or registration.</li>
                <li>You are responsible for your clinical decisions. Serenest does not supervise or direct clinical judgment.</li>
                <li>You must follow our <Link to="/professionals/code-of-conduct" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Professional Code of Conduct</Link> at all times.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>5. Availability &amp; Scheduling</h2>
              <p className="muted">You are expected to honour all confirmed appointments. Repeated cancellations or no-shows may result in suspension. You must update your availability calendar promptly to avoid patient-facing booking errors. Minimum notice for cancelling a confirmed appointment is 4 hours.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>6. Confidentiality</h2>
              <p className="muted">All patient information accessed through the platform is strictly confidential. You must not disclose patient data to any third party except as required by law, with patient consent, or in a genuine emergency to prevent harm. Your confidentiality obligations survive termination of this agreement.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>7. Non-Solicitation</h2>
              <p className="muted">During your time on the platform and for 12 months after termination, you must not solicit or accept direct bookings from patients you first met through Serenest for the purpose of bypassing the platform. This does not restrict your independent practice with patients who approached you through other channels.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>8. Intellectual Property</h2>
              <p className="muted">Clinical templates, documentation tools, and platform features remain the property of Serenest. Educational content you create and upload to the platform grants Serenest a non-exclusive licence to display it on the platform. You retain ownership of your original work.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>9. Termination</h2>
              <p className="muted">Either party may terminate this agreement with 14 days' written notice. Serenest may terminate immediately for: credential fraud, patient harm, regulatory action, serious breach of these terms, or criminal conviction. Upon termination, access to patient records is removed; you may request a clinical summary for continuity of care purposes.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>10. Contact</h2>
              <p className="muted">For professional-specific queries, contact <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a>. For disputes, see our <Link to="/grievance-policy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Grievance Policy</Link>.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
