import React from 'react';
import { Link } from 'react-router-dom';

const UPDATED = 'June 2026';

export default function PaymentPolicyPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Legal</p>
            <h1 className="page-title">Payment &amp; Billing Policy</h1>
            <p className="about-subtext">
              This policy explains how payments are collected, processed, and handled on the Serenest platform,
              including fees, taxes, and professional payouts.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Accepted Payment Methods</h2>
              <ul className="list">
                <li>UPI (Google Pay, PhonePe, Paytm, BHIM, and all UPI-enabled apps)</li>
                <li>Credit and debit cards (Visa, Mastercard, RuPay)</li>
                <li>Net banking (major Indian banks)</li>
                <li>Platform credits issued as refunds or promotional awards</li>
              </ul>
              <p className="muted" style={{ marginTop: 8 }}>All payments are processed through PCI-DSS compliant payment gateways. Serenest does not store your card or bank details.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>Session Fees</h2>
              <p className="muted">Consultation fees are set by each professional and displayed clearly on their profile before you book. The fee shown is the total amount you pay — there are no hidden platform charges added at checkout.</p>
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: '1rem', marginTop: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>When is payment taken?</div>
                <p className="muted" style={{ margin: 0 }}>Full payment is collected at the time of booking. Your booking is confirmed only once payment is successful.</p>
              </div>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Taxes</h2>
              <p className="muted">GST (Goods and Services Tax) may be applicable on certain services as per Indian tax law. Where applicable, GST is included in the displayed fee. A tax invoice will be generated and made available in your account after payment. Professionals are responsible for their own income tax obligations.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Professional Payouts</h2>
              <ul className="list">
                <li>Professionals receive their earnings after deduction of the Serenest platform fee (agreed separately in the Professional Agreement).</li>
                <li>Payouts are processed within 7 business days of a completed session.</li>
                <li>Payment is made via NEFT/RTGS to the bank account registered in your professional profile.</li>
                <li>Payouts are withheld for sessions under dispute until the dispute is resolved.</li>
                <li>A payout statement is provided monthly for tax purposes.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Failed Payments</h2>
              <p className="muted">If your payment fails, your booking will not be confirmed. Common reasons include insufficient funds, bank-side declines, or network issues. Please try a different payment method or contact your bank. Serenest is not responsible for charges levied by your bank for failed transactions.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Refunds</h2>
              <p className="muted">Refund eligibility depends on when and why a session is cancelled. For full details, see our <Link to="/refund-policy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Refund &amp; Cancellation Policy</Link>. Approved refunds are returned to the original payment method within 5–7 business days (UPI refunds typically within 1–2 days).</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Billing Disputes</h2>
              <p className="muted">If you believe you have been charged incorrectly, contact us at <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a> within 30 days of the charge with your booking reference and payment details. We will investigate and respond within 5 business days. If you are not satisfied with our resolution, you may escalate under our <Link to="/grievance-policy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Grievance Policy</Link>.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Currency</h2>
              <p className="muted">All transactions on Serenest are in Indian Rupees (INR). International cards may be subject to foreign transaction fees charged by your card issuer — Serenest has no control over these charges.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
