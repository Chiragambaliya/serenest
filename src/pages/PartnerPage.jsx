import React, { useState } from 'react';
import { useSEO } from '../lib/useSEO';

const PARTNER_TYPES = [
  {
    id: 'influencer',
    icon: '📱',
    title: 'Content Creator / Influencer',
    desc: 'You create mental health content. Your audience trusts you. We pay you for every booking you drive.',
    earn: 'Earn 15% per booking',
    color: '#e91e8c',
  },
  {
    id: 'university',
    icon: '🎓',
    title: 'University / College',
    desc: 'Subsidised mental health support for your students. MoU-based partnership with dedicated student portal.',
    earn: 'Flat annual rate',
    color: '#7c3aed',
  },
  {
    id: 'clinic',
    icon: '🏥',
    title: 'Clinic / Hospital',
    desc: 'Refer overflow patients to us for online follow-up. We refer back for in-person care. Mutual growth.',
    earn: 'Referral agreement',
    color: '#0d6efd',
  },
  {
    id: 'platform',
    icon: '📲',
    title: 'App / Platform',
    desc: 'Fitness apps, meditation apps, HR tools — add mental health to your offering via our API or co-marketing.',
    earn: 'Revenue share',
    color: '#059669',
  },
];

const CREATOR_PERKS = [
  { icon: '💸', title: '15% per booking', desc: 'Every patient who books using your code earns you 15% of the session fee — automatically tracked.' },
  { icon: '🎁', title: 'Free sessions', desc: '2 complimentary sessions per month to experience Serenest yourself and speak authentically.' },
  { icon: '📊', title: 'Real-time dashboard', desc: 'See your clicks, signups, bookings, and earnings in one place — no guessing.' },
  { icon: '🤝', title: 'Co-created content', desc: 'We collaborate on Reels, carousels, and Live sessions with our doctors — adds credibility to your page.' },
  { icon: '🏷', title: 'Custom discount code', desc: 'Your audience gets 10% off their first session. You get 15% commission. Everyone wins.' },
  { icon: '📣', title: 'Featured on Serenest', desc: 'Your profile featured on our site and social as a trusted mental health advocate.' },
];

export default function PartnerPage() {
  useSEO({
    path: '/partner',
    title: 'Partner with Serenest — Creators, Universities & Clinics',
    description: 'Collaborate with Serenest. Earn commissions as a mental health content creator, or partner as a university, clinic, or platform.',
  });

  const [type, setType]     = useState('influencer');
  const [form, setForm]     = useState({ name: '', email: '', phone: '', handle: '', audience_size: '', message: '', partner_type: 'influencer' });
  const [busy, setBusy]     = useState(false);
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');

  function setF(f) { return (e) => setForm((p) => ({ ...p, [f]: e.target.value })); }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/partner/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, partner_type: type }),
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
      <section style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1e3a5f 100%)', color: '#fff', padding: '5rem 1.5rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', background: 'rgba(99,179,237,0.2)', color: '#90cdf4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '5px 14px', borderRadius: 99, marginBottom: 20, border: '1px solid rgba(144,205,244,0.3)' }}>
            Partnerships
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Grow together with Serenest
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Whether you're a creator, university, clinic, or app — there's a partnership model built for you.
          </p>
          <a href="#apply" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>Apply to partner →</a>
        </div>
      </section>

      {/* ── Partner type cards ── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2.5rem' }}>Who we partner with</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
            {PARTNER_TYPES.map((pt) => (
              <div key={pt.id} style={{ background: '#fff', border: `1px solid ${pt.color}22`, borderRadius: 16, padding: '1.5rem', boxShadow: `0 4px 16px ${pt.color}10` }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{pt.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6, color: pt.color }}>{pt.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>{pt.desc}</p>
                <span style={{ display: 'inline-block', background: pt.color + '15', color: pt.color, fontSize: '0.78rem', fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>{pt.earn}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Creator perks ── */}
      <section style={{ background: 'linear-gradient(135deg, #fff8f0, #fdf4ff)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Creator programme perks</h2>
            <p style={{ color: 'var(--text-muted)' }}>For mental health content creators with 5,000+ followers.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {CREATOR_PERKS.map((p) => (
              <div key={p.title} style={{ background: '#fff', borderRadius: 14, padding: '1.25rem', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: 8 }}>{p.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Apply form ── */}
      <section id="apply" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Apply to partner</h2>
            <p style={{ color: 'var(--text-muted)' }}>We review every application and respond within 48 hours.</p>
          </div>

          {sent ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: 8 }}>Application received!</h3>
              <p style={{ color: 'var(--text-muted)' }}>We'll review and respond to <strong>{form.email}</strong> within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

              {/* Partner type selector */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>I am a…</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {PARTNER_TYPES.map((pt) => (
                    <button key={pt.id} type="button" onClick={() => setType(pt.id)} style={{
                      padding: '10px 12px', border: `1.5px solid ${type === pt.id ? pt.color : 'var(--border)'}`,
                      borderRadius: 10, background: type === pt.id ? pt.color + '10' : '#fafafa',
                      color: type === pt.id ? pt.color : 'var(--text-muted)',
                      fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span>{pt.icon}</span> {pt.title.split('/')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <F label="Full name *"><input style={inp} required value={form.name} onChange={setF('name')} placeholder="Priya Sharma" /></F>
                <F label="Email *"><input style={inp} type="email" required value={form.email} onChange={setF('email')} placeholder="priya@example.com" /></F>
              </div>

              {(type === 'influencer') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <F label="Instagram / YouTube handle"><input style={inp} value={form.handle} onChange={setF('handle')} placeholder="@yourhandle" /></F>
                  <F label="Audience size">
                    <select style={inp} value={form.audience_size} onChange={setF('audience_size')}>
                      <option value="">Select…</option>
                      <option>5k – 10k</option>
                      <option>10k – 50k</option>
                      <option>50k – 200k</option>
                      <option>200k+</option>
                    </select>
                  </F>
                </div>
              )}

              <F label="Phone"><input style={inp} type="tel" value={form.phone} onChange={setF('phone')} placeholder="98765 43210" /></F>

              <F label="Tell us about yourself / your organisation *">
                <textarea style={{ ...inp, resize: 'vertical', minHeight: 90 }} required value={form.message} onChange={setF('message')} placeholder={type === 'influencer' ? "What mental health topics do you cover? What's your audience like?" : "Tell us about your organisation and what you're looking for…"} />
              </F>

              {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: 0 }}>⚠ {error}</p>}

              <button type="submit" disabled={busy} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: '1rem' }}>
                {busy ? 'Sending…' : 'Submit application →'}
              </button>
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
