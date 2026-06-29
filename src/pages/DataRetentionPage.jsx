import React from 'react';
import { Link } from 'react-router-dom';

const UPDATED = 'June 2026';

const RETENTION = [
  { category: 'Account & profile data', period: 'Duration of account + 3 years', reason: 'Legal and contractual obligation' },
  { category: 'Session records (notes, prescriptions)', period: '7 years from session date', reason: 'Medical records requirement (MCI Guidelines)' },
  { category: 'Payment & billing records', period: '8 years', reason: 'GST and income tax compliance' },
  { category: 'Communication logs (support emails)', period: '3 years', reason: 'Grievance and dispute resolution' },
  { category: 'Audit & access logs', period: '2 years', reason: 'Security and fraud detection' },
  { category: 'Marketing preferences', period: 'Until opt-out or account deletion', reason: 'Consent-based communication' },
  { category: 'Anonymised usage analytics', period: 'Indefinite', reason: 'Aggregated, non-identifiable data only' },
];

export default function DataRetentionPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Legal</p>
            <h1 className="page-title">Data Retention Policy</h1>
            <p className="about-subtext">
              We keep your data only as long as necessary — and no longer. This policy explains what we retain,
              for how long, and how you can request deletion.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Our Approach</h2>
              <p className="muted">Serenest retains personal data only for as long as it is required to fulfil the purpose for which it was collected, to comply with legal obligations (including medical record-keeping requirements), or to resolve disputes. Once the retention period expires, data is securely deleted or irreversibly anonymised.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 14 }}>Retention Schedule</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {RETENTION.map((r) => (
                  <div key={r.category} style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{r.category}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.reason}</div>
                      </div>
                      <span style={{ display: 'inline-block', flexShrink: 0, padding: '3px 10px', borderRadius: 99, background: 'var(--brand-100)', color: 'var(--brand-700)', fontSize: '0.75rem', fontWeight: 700, marginTop: 2 }}>{r.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Medical Records</h2>
              <p className="muted">Session notes, prescriptions, and clinical documentation are subject to a 7-year minimum retention requirement under MCI Telemedicine Practice Guidelines 2020 and general medical ethics. These records cannot be deleted on request during the retention window, but access is restricted to the professional and, where required by law, regulatory authorities.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Account Deletion</h2>
              <p className="muted">You may request deletion of your Serenest account at any time by emailing <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a>. Upon deletion:</p>
              <ul className="list" style={{ marginTop: 8 }}>
                <li>Your profile, preferences, and marketing data are deleted immediately.</li>
                <li>Session records and billing data are retained for the legally required periods above.</li>
                <li>Retained data is held in a restricted archive — it is not used for any commercial purpose.</li>
                <li>You will receive confirmation of deletion within 30 days as required under the DPDP Act 2023.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Data Security During Retention</h2>
              <ul className="list">
                <li>All retained data is encrypted at rest and in transit.</li>
                <li>Access is limited to authorised personnel with a legitimate need.</li>
                <li>Backups are subject to the same retention limits and are purged on schedule.</li>
                <li>We conduct annual reviews of data holdings to identify and delete data beyond its retention window.</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Your Rights</h2>
              <p className="muted">Under the Digital Personal Data Protection Act 2023, you have the right to request access to your data, correction of inaccuracies, and deletion (subject to legal retention obligations). To exercise these rights, see our <Link to="/privacy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Privacy Policy</Link> or email <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a>.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
