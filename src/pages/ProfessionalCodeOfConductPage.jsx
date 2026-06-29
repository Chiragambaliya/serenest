import React from 'react';
import { Link } from 'react-router-dom';

const UPDATED = 'June 2026';

export default function ProfessionalCodeOfConductPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">For Professionals</p>
            <h1 className="page-title">Professional Code of Conduct</h1>
            <p className="about-subtext">
              All professionals on Serenest are expected to uphold the highest standards of clinical ethics,
              patient safety, and professional conduct. This Code supplements your regulatory body's own ethical requirements.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>1. Patient Safety &amp; Welfare</h2>
              <ul className="list">
                <li>The welfare and safety of the patient is your first and non-negotiable obligation.</li>
                <li>You must immediately refer or escalate when a patient presents with risk of harm to themselves or others, including providing emergency contacts.</li>
                <li>You must not provide care beyond your scope of qualification or registration.</li>
                <li>You must not prescribe controlled substances or drugs of abuse via teleconsultation in violation of applicable law.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>2. Informed Consent</h2>
              <ul className="list">
                <li>You must ensure the patient understands the nature, purpose, and limitations of teleconsultation before proceeding.</li>
                <li>You must obtain verbal or documented consent at the start of each initial consultation.</li>
                <li>Patients must be informed of their right to withdraw consent at any time without penalty.</li>
                <li>Consent for minors must be obtained from a parent or legal guardian.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>3. Confidentiality</h2>
              <ul className="list">
                <li>All patient information is strictly confidential and must not be disclosed to third parties without consent.</li>
                <li>Exceptions apply where disclosure is required by law, by court order, or to prevent imminent harm.</li>
                <li>You must not discuss patient cases in identifiable form on social media or public forums.</li>
                <li>Confidentiality obligations survive the end of the professional relationship.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>4. Professional Boundaries</h2>
              <ul className="list">
                <li>You must maintain clear professional boundaries with all patients at all times.</li>
                <li>Romantic, sexual, or exploitative relationships with current or recent patients are strictly prohibited.</li>
                <li>Dual relationships (e.g., treating a family member or close acquaintance) should be avoided where they create a conflict of interest.</li>
                <li>You must not solicit gifts, loans, or personal favours from patients.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>5. Clinical Standards</h2>
              <ul className="list">
                <li>You must conduct consultations in accordance with current evidence-based clinical guidelines.</li>
                <li>Session documentation must be completed within 24 hours of each session.</li>
                <li>You must comply with MCI Telemedicine Practice Guidelines 2020 and all applicable regulatory standards for your role.</li>
                <li>Prescriptions must comply with Schedule H regulations and must include all required information.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>6. Conflict of Interest</h2>
              <ul className="list">
                <li>Disclose any financial or personal relationship with a patient that could compromise clinical judgment.</li>
                <li>Do not recommend products, services, or referrals where you have an undisclosed financial interest.</li>
                <li>Do not provide clinical services to patients of a competitor platform using information or contacts gained through Serenest.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>7. Conduct on the Platform</h2>
              <ul className="list">
                <li>Treat all patients and Serenest staff with respect. Discriminatory, abusive, or threatening conduct will result in immediate suspension.</li>
                <li>Be punctual for all confirmed sessions. Notify patients and the platform as early as possible if you must cancel.</li>
                <li>Do not misrepresent your qualifications, registration, or experience.</li>
                <li>Engage constructively with feedback from patients and the Serenest team.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>8. Reporting &amp; Accountability</h2>
              <p className="muted">If you become aware of conduct by another professional that poses a risk to patient safety, you have an obligation to report it to Serenest at <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a> and, where required, to your regulatory body. Serenest treats all such reports with confidentiality and protects reporters in good faith from retaliation.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>9. Consequences of Breach</h2>
              <p className="muted">Breaches of this Code may result in: a formal warning, suspension pending investigation, permanent removal from the platform, and/or referral to your regulatory body. Serious breaches involving patient harm will be reported to the relevant regulatory authority.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
