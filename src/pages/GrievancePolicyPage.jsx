import React from 'react';

const UPDATED = 'June 2026';

const STEPS = [
  { n: '1', title: 'Submit your grievance', desc: 'Email support@serenest.in with your name, booking reference (if applicable), and a clear description of the issue. You will receive an acknowledgement within 24 hours on business days.' },
  { n: '2', title: 'Review', desc: 'Our team reviews your complaint and may reach out for additional information. We aim to resolve most grievances within 7 working days.' },
  { n: '3', title: 'Resolution', desc: 'You receive a written response with our finding and, where applicable, the action taken. This may include a refund, an apology, removal of a professional, or another appropriate remedy.' },
  { n: '4', title: 'Escalation', desc: 'If you are unsatisfied with the resolution, you may escalate to our Grievance Officer (details below) within 15 days of receiving our response.' },
];

export default function GrievancePolicyPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Legal</p>
            <h1 className="page-title">Grievance Policy</h1>
            <p className="about-subtext">
              We take all complaints seriously. This policy explains how to raise a grievance, what to expect, and how we resolve complaints —
              in compliance with the IT (Intermediary Guidelines) Rules 2021.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 14 }}>How to raise a grievance</h2>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: 0, padding: 0, listStyle: 'none' }}>
                {STEPS.map((s) => (
                  <li key={s.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ display: 'inline-flex', width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-500)', color: '#fff', fontWeight: 800, fontSize: '0.9rem', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{s.n}</span>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>{s.title}</div>
                      <p className="muted" style={{ margin: 0 }}>{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Types of grievances we handle</h2>
              <ul className="list">
                <li>Complaints about professional conduct or behaviour during a session</li>
                <li>Billing errors or refund disputes</li>
                <li>Privacy or data handling concerns</li>
                <li>Technical failures that affected your session</li>
                <li>Inappropriate content or communications</li>
                <li>Accessibility issues or discrimination</li>
                <li>Requests to remove content or data</li>
              </ul>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Response timelines</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {[
                  { label: 'Acknowledgement', time: 'Within 24 hrs (business days)' },
                  { label: 'Standard resolution', time: 'Within 7 working days' },
                  { label: 'Complex cases', time: 'Within 30 days' },
                  { label: 'Escalation response', time: 'Within 15 days' },
                ].map((t) => (
                  <div key={t.label} style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: '0.9rem 1rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 3 }}>{t.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Grievance Officer</h2>
              <p className="muted">As required by the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, we designate a Grievance Officer:</p>
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 12, padding: '1rem 1.25rem', marginTop: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>Dr. Chirag Aambalia</div>
                <div className="muted" style={{ fontSize: '0.88rem' }}>Founder, Serenest Education Pvt Ltd</div>
                <div style={{ marginTop: 8, fontSize: '0.88rem' }}>
                  <span className="muted">Email: </span>
                  <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a>
                </div>
                <div style={{ marginTop: 4, fontSize: '0.88rem' }}>
                  <span className="muted">Subject line: </span>
                  <span style={{ fontWeight: 600 }}>GRIEVANCE — [your name]</span>
                </div>
              </div>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Further escalation</h2>
              <p className="muted">If your grievance relates to data protection and is not resolved to your satisfaction, you may approach the Data Protection Board of India once operational under the DPDP Act 2023. For consumer disputes, the National Consumer Disputes Redressal Commission (NCDRC) is available under the Consumer Protection Act 2019.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
