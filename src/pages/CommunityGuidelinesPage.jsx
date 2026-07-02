import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const UPDATED = 'June 2026';

const DOS = [
  'Treat every person on the platform — patient, professional, or staff — with dignity and respect.',
  'Be honest about your qualifications, experience, and the nature of your concerns.',
  'Attend or cancel sessions with reasonable notice so professionals and patients can plan their time.',
  'Keep your account credentials confidential and notify us immediately if you suspect unauthorised access.',
  'Provide feedback constructively — whether a review, a complaint, or a suggestion.',
  'Follow your professional’s clinical recommendations or ask questions if you disagree.',
];

const DONTS = [
  'Use the platform to harass, threaten, intimidate, or discriminate against anyone.',
  'Share another user’s personal information without their consent (doxxing).',
  'Impersonate a licensed professional, Serenest staff, or any other person.',
  'Upload or transmit malware, spam, or any content designed to disrupt the platform.',
  'Attempt to contact professionals or patients outside the platform to circumvent our booking system.',
  'Use session recordings (if permitted technically) without the explicit consent of all parties.',
  'Post false or misleading reviews about professionals.',
  'Use the platform for purposes other than legitimate mental health or wellness consultations.',
];

export default function CommunityGuidelinesPage() {
  useSEO({ path: '/community-guidelines', ...ROUTE_SEO['/community-guidelines'] });
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Community</p>
            <h1 className="page-title">Community Guidelines</h1>
            <p className="about-subtext">
              Serenest is a space built on trust, safety, and care. These guidelines apply to everyone —
              patients, professionals, and anyone else who interacts with our platform.
            </p>
            <p className="fineprint" style={{ marginTop: 10 }}>Last updated: {UPDATED} · Serenest Education Pvt Ltd</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Our Core Principle</h2>
              <p className="muted">Mental health is deeply personal. Everyone who comes to Serenest deserves to feel safe, heard, and respected — regardless of their diagnosis, background, beliefs, gender, sexuality, religion, or socioeconomic status. Conduct that undermines this principle has no place here.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 14 }}>What We Expect</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '1rem' }}>
                  <div style={{ fontWeight: 800, color: '#065f46', marginBottom: 8, fontSize: '0.85rem' }}>Do</div>
                  <ul style={{ margin: 0, paddingLeft: 16, color: '#064e3b', fontSize: '0.82rem', lineHeight: 1.75 }}>
                    {DOS.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
                <div style={{ background: '#fff1f2', borderRadius: 10, padding: '1rem' }}>
                  <div style={{ fontWeight: 800, color: '#9f1239', marginBottom: 8, fontSize: '0.85rem' }}>Don't</div>
                  <ul style={{ margin: 0, paddingLeft: 16, color: '#881337', fontSize: '0.82rem', lineHeight: 1.75 }}>
                    {DONTS.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Safe Messaging Around Self-Harm &amp; Suicide</h2>
              <p className="muted">Serenest follows safe messaging guidelines endorsed by mental health organisations. If you or someone you know is in immediate danger, do not use this platform — call <strong>112</strong> or a crisis helpline immediately. See our <Link to="/emergency-disclaimer" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Emergency Disclaimer</Link> for crisis resources.</p>
              <p className="muted" style={{ marginTop: 8 }}>Content that glorifies, instructs on, or encourages self-harm or suicide is strictly prohibited and will be removed immediately. We will also notify relevant authorities where required by law.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>For Professionals</h2>
              <p className="muted">Professionals are additionally bound by the <Link to="/professionals/code-of-conduct" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Professional Code of Conduct</Link> and their respective regulatory bodies' ethical guidelines. These Community Guidelines set the minimum standard for everyone; the Code of Conduct sets higher standards for professionals.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Enforcement</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { level: 'Warning', desc: 'For first-time or minor violations, we issue a written warning and explain what went wrong.' },
                  { level: 'Temporary suspension', desc: 'Repeated or more serious violations may result in a temporary suspension pending review.' },
                  { level: 'Permanent removal', desc: 'Severe violations — including harassment, fraud, abuse, or endangering patient safety — result in immediate permanent removal from the platform.' },
                  { level: 'Legal action', desc: 'Where conduct constitutes a criminal offence under Indian law, we will report it to the appropriate authorities.' },
                ].map((e) => (
                  <div key={e.level} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--bg-subtle)', borderRadius: 10, padding: '0.85rem 1rem' }}>
                    <span style={{ display: 'inline-block', flexShrink: 0, padding: '2px 10px', borderRadius: 99, background: 'var(--brand-500)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, marginTop: 2 }}>{e.level}</span>
                    <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Reporting a Violation</h2>
              <p className="muted">If you witness or experience conduct that violates these guidelines, report it to <a href="mailto:support@serenest.in" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>support@serenest.in</a> with as much detail as possible. All reports are treated confidentially. We do not tolerate retaliation against good-faith reporters.</p>
              <p className="muted" style={{ marginTop: 8 }}>If you are not satisfied with how your report was handled, you may escalate through our <Link to="/grievance-policy" style={{ color: 'var(--teal-700)', fontWeight: 600 }}>Grievance Policy</Link>.</p>
            </div>

            <div className="tile" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>Changes to These Guidelines</h2>
              <p className="muted">We may update these guidelines from time to time. Significant changes will be communicated by email or in-app notification. Continued use of the platform after the effective date of any update constitutes your acceptance of the revised guidelines.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
