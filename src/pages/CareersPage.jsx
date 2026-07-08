import React, { useState } from 'react';
import { useSEO } from '../lib/useSEO';

const ROLES = [
  { id: 'Clinical Psychologist', label: 'Clinical Psychologist' },
  { id: 'Counselling Psychologist', label: 'Counselling Psychologist' },
  { id: 'Psychotherapist', label: 'Psychotherapist' },
  { id: 'Psychiatrist', label: 'Psychiatrist' },
  { id: 'Mental Health Counsellor', label: 'Mental Health Counsellor' },
];

const PERKS = [
  { icon: '🏠', title: 'Fully remote', desc: 'Work from anywhere in India. All sessions are online.' },
  { icon: '📅', title: 'Flexible hours', desc: 'Set your own schedule. Morning, evening, weekend — your call.' },
  { icon: '💰', title: 'Competitive pay', desc: 'Earn ₹800–₹1,500 per session based on role and experience.' },
  { icon: '📈', title: 'Grow your practice', desc: 'We handle marketing, bookings, and payments — you focus on patients.' },
  { icon: '🤝', title: 'Clinical community', desc: 'Peer supervision, case discussions, and continuing education.' },
  { icon: '📋', title: 'Admin-free', desc: 'No invoicing, no chasing payments. We handle all of it.' },
];

export default function CareersPage() {
  useSEO({
    path: '/careers',
    title: 'Join Serenest — Careers for Mental Health Professionals',
    description: 'Apply to join Serenest as a psychologist, therapist, or psychiatrist. Flexible online sessions across India.',
  });

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', city: '',
    role: '', experience: '', linkedin_url: '', cover_note: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  const isValid =
    form.full_name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.role &&
    form.cover_note.trim().length >= 20;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          department: 'Clinical',
          cover_note: `Experience: ${form.experience} years\n\n${form.cover_note}`,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ background: 'linear-gradient(180deg, #f4eee4 0%, #faf7f1 400px)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '4rem 1.5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            We're hiring
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Join Serenest as a<br />
            <span style={{ background: 'linear-gradient(135deg, #7a9a5a, #46552f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              mental health professional
            </span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 2rem' }}>
            We're building India's most trusted online mental health platform.
            We need great psychologists, therapists, and psychiatrists to make it happen.
          </p>
          <a href="#apply" className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
            Apply now →
          </a>
        </div>
      </section>

      {/* ── Perks ── */}
      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>
            Why join Serenest?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {PERKS.map((p) => (
              <div key={p.title} style={{
                background: '#fff', borderRadius: 14, padding: '1.25rem 1.25rem',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 8px rgba(70, 85, 47, 0.05)',
              }}>
                <div style={{ fontSize: '1.75rem', marginBottom: 8 }}>{p.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application form ── */}
      <section id="apply" style={{ padding: '3rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Apply to join</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Fill this in and we'll get back to you within 48 hours.</p>
          </div>

          {submitted ? (
            <div style={{
              background: '#fff', borderRadius: 20, padding: '3rem 2rem', textAlign: 'center',
              border: '1px solid #bbf7d0', boxShadow: '0 4px 24px rgba(34,197,94,0.08)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Application received!</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Thank you, <strong>{form.full_name.split(' ')[0]}</strong>. Our team will review your application and reach out within 48 hours on <strong>{form.email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              background: '#fff', borderRadius: 20, padding: '2rem',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 24px rgba(70, 85, 47, 0.07)',
              display: 'flex', flexDirection: 'column', gap: 18,
            }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Full name *">
                  <input type="text" value={form.full_name} onChange={set('full_name')} placeholder="Dr. Priya Sharma" required style={inputStyle} />
                </Field>
                <Field label="Email *">
                  <input type="email" value={form.email} onChange={set('email')} placeholder="priya@example.com" required style={inputStyle} />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Phone">
                  <input type="tel" value={form.phone} onChange={set('phone')} placeholder="98765 43210" style={inputStyle} />
                </Field>
                <Field label="City">
                  <input type="text" value={form.city} onChange={set('city')} placeholder="Mumbai" style={inputStyle} />
                </Field>
              </div>

              <Field label="Role applying for *">
                <select aria-label="Role applying for" value={form.role} onChange={set('role')} required style={inputStyle}>
                  <option value="">Select a role…</option>
                  {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </Field>

              <Field label="Years of experience">
                <select aria-label="Years of experience" value={form.experience} onChange={set('experience')} style={inputStyle}>
                  <option value="">Select…</option>
                  <option>0–1</option>
                  <option>1–3</option>
                  <option>3–5</option>
                  <option>5–10</option>
                  <option>10+</option>
                </select>
              </Field>

              <Field label="LinkedIn profile URL">
                <input type="url" value={form.linkedin_url} onChange={set('linkedin_url')} placeholder="https://linkedin.com/in/your-profile" style={inputStyle} />
              </Field>

              <Field label="Tell us about yourself & why Serenest *">
                <textarea
                  value={form.cover_note}
                  onChange={set('cover_note')}
                  placeholder="Share your background, what you specialise in, and what excites you about joining Serenest…"
                  rows={5}
                  required
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Min 20 characters</span>
              </Field>

              {error && (
                <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0 }}>⚠ {error}</p>
              )}

              <button
                type="submit"
                disabled={!isValid || submitting}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', display: 'flex', padding: '14px', fontSize: '1rem', opacity: (!isValid || submitting) ? 0.55 : 1 }}
              >
                {submitting ? 'Submitting…' : 'Submit application →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                By submitting you agree to us contacting you about this role. We don't spam.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '0.95rem',
  border: '1px solid var(--border)',
  borderRadius: 10,
  background: '#fafafa',
  color: 'var(--text)',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};
