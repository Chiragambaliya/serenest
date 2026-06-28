import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';

const STATS = [
  { value: '1 in 5', label: 'employees face mental health issues annually' },
  { value: '₹2,900 Cr', label: 'lost to absenteeism & presenteeism in India yearly' },
  { value: '4.2×', label: 'ROI on every rupee spent on employee mental health' },
  { value: '68%', label: 'employees more loyal when employer supports wellbeing' },
];

const PLANS = [
  {
    name: 'Starter',
    price: '₹499',
    per: 'per employee / year',
    min: 'Min. 25 employees',
    color: '#0d6efd',
    features: [
      '4 sessions per employee per year',
      'Access to all therapists & counsellors',
      'Confidential — HR never sees content',
      'Usage dashboard for HR',
      'Onboarding webinar',
    ],
  },
  {
    name: 'Growth',
    price: '₹899',
    per: 'per employee / year',
    min: 'Min. 50 employees',
    color: '#7a9a5a',
    popular: true,
    features: [
      '8 sessions per employee per year',
      'Psychiatrists included',
      'Manager mental health training',
      'Monthly wellbeing workshops',
      'Dedicated account manager',
      'Custom onboarding',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    per: 'tailored to your needs',
    min: '200+ employees',
    color: '#6f42c1',
    features: [
      'Unlimited sessions',
      'On-site & online hybrid',
      'White-label employee portal',
      'EAP crisis line (24×7)',
      'CHRO-level reporting',
      'SLA guarantee',
    ],
  },
];

const PROCESS = [
  { step: '01', title: 'Discovery call', desc: 'We understand your workforce size, locations, and specific challenges. 30-minute call.' },
  { step: '02', title: 'Proposal & sign', desc: 'Custom pricing, contract signed. No per-session billing surprises — flat annual fee.' },
  { step: '03', title: 'Employee onboarding', desc: 'We send personalised invite emails to all employees. They book directly — HR is never in the loop.' },
  { step: '04', title: 'Ongoing reporting', desc: 'Monthly dashboard: utilisation rate, NPS, team-level (not individual) trends.' },
];

const TRUSTS = [
  'HIPAA-aligned data handling',
  'Confidentiality guaranteed by law',
  'All professionals RCI / MCI registered',
  'ISO 27001-compliant infrastructure',
];

export default function CorporatePage() {
  useSEO({
    path: '/corporate',
    title: 'Employee Mental Health — Corporate EAP | Serenest',
    description: 'Mental health benefits for your team. Confidential therapy, psychiatry and counselling for employees across India. Starting ₹499/employee/year.',
  });

  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', size: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function set(f) { return (e) => setForm((p) => ({ ...p, [f]: e.target.value })); }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/corporate/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ background: '#fff' }}>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 100%)', color: '#fff', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'rgba(122,154,90,0.25)', color: '#a8d08d', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '5px 14px', borderRadius: 99, marginBottom: 20, border: '1px solid rgba(168,208,141,0.3)' }}>
            Corporate EAP
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
            Mental health benefits<br />your employees will actually use
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Doctor-led, fully confidential therapy and psychiatry for your entire team. Flat annual pricing. No surprise costs.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#contact" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>Get a quote →</a>
            <a href="#plans" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 24px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>View plans</a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: '#f8fdf4', borderBottom: '1px solid #e8f0e0', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, textAlign: 'center' }}>
          {STATS.map((s) => (
            <div key={s.value}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2d4a2d', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#5a7a5a', marginTop: 6, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Plans ── */}
      <section id="plans" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Simple, transparent pricing</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Annual per-employee pricing. No per-session billing. No hidden fees.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {PLANS.map((plan) => (
              <div key={plan.name} style={{
                border: plan.popular ? `2px solid ${plan.color}` : '1px solid var(--border)',
                borderRadius: 18, padding: '2rem', position: 'relative',
                background: plan.popular ? '#fafff6' : '#fff',
                boxShadow: plan.popular ? `0 8px 32px ${plan.color}18` : 'none',
              }}>
                {plan.popular && (
                  <span style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 14px', borderRadius: 99 }}>
                    Most popular
                  </span>
                )}
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: plan.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{plan.price}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>{plan.per}</div>
                <div style={{ fontSize: '0.75rem', color: plan.color, fontWeight: 600, marginBottom: '1.5rem' }}>{plan.min}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 8, fontSize: '0.88rem', alignItems: 'flex-start' }}>
                      <span style={{ color: plan.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" style={{
                  display: 'block', textAlign: 'center', padding: '11px',
                  background: plan.popular ? plan.color : 'transparent',
                  color: plan.popular ? '#fff' : plan.color,
                  border: `1.5px solid ${plan.color}`,
                  borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
                }}>
                  Get started →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: '#f4eee4', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '3rem' }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
            {PROCESS.map((p) => (
              <div key={p.step} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, background: '#2d4a2d', color: '#a8d08d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', margin: '0 auto 1rem' }}>{p.step}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section style={{ padding: '3rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {TRUSTS.map((t) => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 99, padding: '7px 16px', fontSize: '0.85rem', fontWeight: 600, color: '#15803d' }}>
              <span>✓</span> {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Contact form ── */}
      <section id="contact" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Talk to our team</h2>
            <p style={{ color: 'var(--text-muted)' }}>We'll send a proposal within 24 hours. No pushy sales calls.</p>
          </div>
          {sent ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: 8 }}>We'll be in touch within 24 hours</h3>
              <p style={{ color: 'var(--text-muted)' }}>Expect an email from our team at <strong>{form.email}</strong> with a tailored proposal for {form.company}.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 4px 24px rgba(70,85,47,0.07)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <F label="Your name *"><input style={inp} required value={form.name} onChange={set('name')} placeholder="Rahul Mehta" /></F>
                <F label="Work email *"><input style={inp} type="email" required value={form.email} onChange={set('email')} placeholder="rahul@company.com" /></F>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <F label="Company name *"><input style={inp} required value={form.company} onChange={set('company')} placeholder="Acme Corp" /></F>
                <F label="Phone"><input style={inp} type="tel" value={form.phone} onChange={set('phone')} placeholder="98765 43210" /></F>
              </div>
              <F label="Team size *">
                <select style={inp} required value={form.size} onChange={set('size')}>
                  <option value="">Select…</option>
                  <option>25–50</option>
                  <option>50–200</option>
                  <option>200–500</option>
                  <option>500–2000</option>
                  <option>2000+</option>
                </select>
              </F>
              <F label="Anything specific you want to address?">
                <textarea style={{ ...inp, resize: 'vertical', minHeight: 90 }} value={form.message} onChange={set('message')} placeholder="E.g. burnout, post-layoff anxiety, leadership coaching…" />
              </F>
              {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0 }}>⚠ {error}</p>}
              <button type="submit" disabled={busy} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: '1rem' }}>
                {busy ? 'Sending…' : 'Request proposal →'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                No commitment. We'll send a proposal — you decide.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function F({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      {children}
    </div>
  );
}

const inp = { width: '100%', padding: '10px 12px', fontSize: '0.95rem', border: '1px solid var(--border)', borderRadius: 10, background: '#fafafa', color: 'var(--text)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
