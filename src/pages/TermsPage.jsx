import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const UPDATED = 'June 2026';

export default function TermsPage() {
  useSEO({ path: '/terms', ...ROUTE_SEO['/terms'] });
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Legal</p>
            <h1 className="page-title">Terms &amp; Conditions</h1>
            <p className="about-subtext">
              These terms govern your use of Serenest — the platform, its content, and all services offered through serenest.in.
              Please read them carefully before using the platform.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>1. Acceptance of Terms</h2>
              <p className="muted">By accessing or using Serenest, you agree to be bound by these Terms and Conditions and all applicable laws of India. If you do not agree, you must not use the platform. These terms apply to all users — patients, professionals, visitors, and administrators.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>2. About Serenest</h2>
              <p className="muted">Serenest is a digital telepsychiatry and mental health platform operated by Serenest Education Pvt Ltd, a DPIIT-recognised startup registered in India. We facilitate online consultations between patients and verified mental health professionals — psychiatrists, psychologists, therapists, and counsellors.</p>
              <p className="muted" style={{ marginTop: 8 }}>Serenest is not a hospital, clinic, emergency service, or crisis helpline. We are a technology platform that connects patients with independent professionals who provide care in compliance with the MCI Telemedicine Practice Guidelines 2020.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>3. Eligibility</h2>
              <ul className="list">
                <li>You must be at least 18 years of age to use the platform independently. Minors may use the platform only with verifiable parental or guardian consent.</li>
                <li>You must be located in India or be a person of Indian origin accessing the platform from abroad.</li>
                <li>You must provide accurate, current, and complete information during registration.</li>
                <li>You must not be prohibited by applicable law from using the platform.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>4. User Accounts</h2>
              <p className="muted">You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately at support@serenest.in if you suspect unauthorised access to your account. Serenest is not liable for losses resulting from unauthorised use of your account where you have failed to notify us promptly.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>5. Services</h2>
              <p className="muted">Serenest provides the following services, subject to professional availability and applicable law:</p>
              <ul className="list">
                <li>Online consultations via video, audio, and text chat</li>
                <li>Digital prescriptions issued by verified MD Psychiatrists (Schedule H compliant)</li>
                <li>Mental health assessments (PHQ-9, GAD-7, and others)</li>
                <li>Clinical documentation and session notes</li>
                <li>Professional education content and clinical resources</li>
              </ul>
              <p className="muted" style={{ marginTop: 8 }}>All clinical decisions are made by the treating professional, not by Serenest. Serenest does not provide medical advice directly.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>6. Prohibited Conduct</h2>
              <p className="muted">You agree not to:</p>
              <ul className="list">
                <li>Provide false information or impersonate any person</li>
                <li>Attempt to gain unauthorised access to any part of the platform</li>
                <li>Use the platform for any unlawful purpose</li>
                <li>Harass, threaten, or harm any professional or other user</li>
                <li>Share, reproduce, or commercially exploit any platform content without permission</li>
                <li>Interfere with or disrupt the platform's operation</li>
                <li>Upload harmful, defamatory, obscene, or inappropriate content</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>7. Intellectual Property</h2>
              <p className="muted">All content on the platform — including text, design, logos, software, and clinical tools — is owned by or licensed to Serenest Education Pvt Ltd. You may not reproduce, distribute, or create derivative works without express written permission. See our <Link to="/intellectual-property" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Copyright &amp; IP Policy</Link> for details.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>8. Payment</h2>
              <p className="muted">Consultation fees are charged at the time of booking and are subject to our <Link to="/payment-policy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Payment &amp; Billing Policy</Link> and <Link to="/refund-policy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Refund &amp; Cancellation Policy</Link>. Applicable GST is charged at the prevailing rate.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>9. Disclaimer of Warranties</h2>
              <p className="muted">The platform is provided on an "as is" and "as available" basis. Serenest makes no warranties, express or implied, regarding the reliability, accuracy, or completeness of any content. Professional services are provided by independent clinicians and Serenest does not warrant clinical outcomes.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>10. Limitation of Liability</h2>
              <p className="muted">To the maximum extent permitted under applicable Indian law, Serenest Education Pvt Ltd shall not be liable for any indirect, incidental, special, or consequential damages. Our total liability to you for any claim shall not exceed the amount you paid for the session giving rise to the claim.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>11. Governing Law &amp; Disputes</h2>
              <p className="muted">These Terms are governed by the laws of India. Any dispute arising from or relating to these Terms shall first be subject to good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to arbitration in Rajkot, Gujarat under the Arbitration and Conciliation Act 1996. The courts of Rajkot, Gujarat shall have exclusive jurisdiction for matters not subject to arbitration.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>12. Changes to These Terms</h2>
              <p className="muted">We may update these Terms from time to time. We will notify you of material changes via the email or phone number on your account. Continued use of the platform after the effective date of updated terms constitutes acceptance.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>13. Contact</h2>
              <p className="muted">For questions about these Terms, contact us at <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a> or visit our <Link to="/grievance-policy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Grievance Policy</Link> page.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
