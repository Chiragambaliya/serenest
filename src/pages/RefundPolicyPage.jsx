import React from 'react';
import { Link } from 'react-router-dom';

const UPDATED = 'June 2026';

export default function RefundPolicyPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Legal</p>
            <h1 className="page-title">Refund &amp; Cancellation Policy</h1>
            <p className="about-subtext">
              We aim to be fair to both patients and professionals. This policy explains what happens when a session is cancelled, missed, or disrupted.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>Patient Cancellations</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {[
                  { when: 'More than 24 hours before', refund: '100% refund', color: '#d1fae5', text: '#065f46' },
                  { when: 'Within 24 hours', refund: '50% refund', color: '#fef9c3', text: '#713f12' },
                  { when: 'No-show / not joined', refund: 'No refund', color: '#fee2e2', text: '#7f1d1d' },
                ].map((r) => (
                  <div key={r.when} style={{ background: r.color, borderRadius: 12, padding: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: r.text, marginBottom: 4 }}>{r.when}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: r.text }}>{r.refund}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Professional Cancellations</h2>
              <p className="muted">If your professional cancels a confirmed appointment:</p>
              <ul className="list">
                <li>You receive a full refund within 5–7 business days, or</li>
                <li>You may choose to reschedule with the same or a different professional at no additional charge.</li>
              </ul>
              <p className="muted" style={{ marginTop: 8 }}>Repeated professional cancellations are escalated internally and may result in the professional being removed from the platform.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Technical Failures</h2>
              <ul className="list">
                <li><strong>Platform failure (our end):</strong> Full refund or free reschedule, at your choice.</li>
                <li><strong>Patient technical issues:</strong> No refund unless the session was entirely unusable (assessed on a case-by-case basis).</li>
                <li><strong>Professional technical issues:</strong> Full refund or free reschedule.</li>
              </ul>
              <p className="muted" style={{ marginTop: 8 }}>To raise a technical failure claim, contact us within 24 hours of the session at <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a>.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Refund Processing</h2>
              <ul className="list">
                <li>Refunds are credited to the original payment method.</li>
                <li>Processing time: 5–7 business days for cards and net banking; 1–2 days for UPI.</li>
                <li>If the original payment method is unavailable, we will issue a platform credit or NEFT transfer.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Non-Refundable Situations</h2>
              <ul className="list">
                <li>Sessions where the patient joined late and the full session was conducted</li>
                <li>Sessions cancelled due to violation of our <Link to="/patient/terms" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Patient Terms of Use</Link> or abusive conduct</li>
                <li>Prescription fees once a prescription has been issued</li>
                <li>Platform subscription fees (if applicable)</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>How to Request a Refund</h2>
              <p className="muted">Email <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a> with your booking reference and reason. We respond within 2 business days. For disputes not resolved by support, see our <Link to="/grievance-policy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Grievance Policy</Link>.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
