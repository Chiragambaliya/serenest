import React from 'react';

const UPDATED = 'June 2026';

const CRISIS_LINES = [
  { name: 'Emergency Services', number: '112', desc: 'Police, ambulance, fire — India' },
  { name: 'iCall (TISS)', number: '9152987821', desc: 'Mon–Sat, 8am–10pm' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 mental health helpline' },
  { name: 'NIMHANS Helpline', number: '080-46110007', desc: 'National Institute of Mental Health' },
  { name: 'Snehi', number: '044-24640050', desc: 'Emotional support & suicide prevention' },
  { name: 'Aasra', number: '9820466627', desc: '24/7 crisis support' },
];

export default function EmergencyDisclaimerPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Safety</p>
            <h1 className="page-title">Emergency Disclaimer</h1>
            <p className="about-subtext">
              Serenest is a scheduled teleconsultation platform — not a crisis or emergency service.
              If you or someone you know is in immediate danger, please use the resources below.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: 14, padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991b1b', marginBottom: 10 }}>In an emergency, do not use Serenest</h2>
              <p style={{ color: '#7f1d1d', lineHeight: 1.65, margin: 0 }}>
                If you or someone else is at immediate risk of harm — through suicide, self-harm, a medical emergency, or violence —
                call <strong>112</strong> immediately or go to the nearest hospital emergency department.
                Serenest professionals cannot dispatch emergency services or provide real-time crisis intervention.
              </p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 14 }}>Crisis Helplines — India</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                {CRISIS_LINES.map((c) => (
                  <div key={c.name} style={{ background: 'var(--bg-subtle)', borderRadius: 12, padding: '1rem 1.1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{c.name}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-500)', marginBottom: 2 }}>{c.number}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>What Serenest Is and Is Not</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '1rem' }}>
                  <div style={{ fontWeight: 800, color: '#065f46', marginBottom: 6, fontSize: '0.85rem' }}>Serenest IS</div>
                  <ul style={{ margin: 0, paddingLeft: 16, color: '#064e3b', fontSize: '0.85rem', lineHeight: 1.7 }}>
                    <li>Scheduled teleconsultations</li>
                    <li>Ongoing mental health support</li>
                    <li>Medication management (psychiatrists)</li>
                    <li>Assessments and therapy</li>
                    <li>Second opinions</li>
                  </ul>
                </div>
                <div style={{ background: '#fff1f2', borderRadius: 10, padding: '1rem' }}>
                  <div style={{ fontWeight: 800, color: '#9f1239', marginBottom: 6, fontSize: '0.85rem' }}>Serenest IS NOT</div>
                  <ul style={{ margin: 0, paddingLeft: 16, color: '#881337', fontSize: '0.85rem', lineHeight: 1.7 }}>
                    <li>An emergency or crisis service</li>
                    <li>A substitute for 112 or A&E</li>
                    <li>A 24/7 helpline</li>
                    <li>A same-day walk-in clinic</li>
                    <li>An inpatient or detox facility</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Signs That Require Immediate Help</h2>
              <ul className="list">
                <li>Active thoughts of suicide or self-harm with intent or a plan</li>
                <li>Harming or threatening to harm yourself or others</li>
                <li>Severe confusion, disorientation, or psychosis with safety risk</li>
                <li>Medical emergency alongside a mental health crisis</li>
                <li>Unconsciousness or overdose</li>
              </ul>
              <p className="muted" style={{ marginTop: 10 }}>For any of the above, call <strong>112</strong> or go to your nearest hospital immediately. Do not wait for an online appointment.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
