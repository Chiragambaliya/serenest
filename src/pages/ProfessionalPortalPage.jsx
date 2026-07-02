import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth, signOut } from '../lib/useAuth';

const BASE = import.meta.env.VITE_API_URL ?? '';

const STATUS_STYLE = {
  pending:   { bg: '#fff3cd', color: '#856404' },
  confirmed: { bg: '#d1e7dd', color: '#0a3622' },
  completed: { bg: '#cce5ff', color: '#004085' },
  cancelled: { bg: '#f8d7da', color: '#721c24' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] ?? { bg: '#e9ecef', color: '#495057' };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 99, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize' }}>
      {status}
    </span>
  );
}

function fmtDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? str : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Fields the professional may edit herself. Identity/verification fields
// (email, phone, registration, role, status) are intentionally read-only.
const EDITABLE = [
  { key: 'full_name',    label: 'Full name',        type: 'text' },
  { key: 'degree',       label: 'Qualifications',   type: 'text',     ph: 'e.g. MD Psychiatry, MBBS' },
  { key: 'city',         label: 'City',             type: 'text' },
  { key: 'clinic',       label: 'Clinic / practice',type: 'text' },
  { key: 'languages',    label: 'Languages',        type: 'text',     ph: 'English, Hindi, Gujarati' },
  { key: 'specialities', label: 'Specialities',     type: 'text',     ph: 'Anxiety, Depression, ADHD' },
  { key: 'fee_inr',      label: 'Fee (₹)',          type: 'text',     ph: 'e.g. 800' },
  { key: 'duration_min', label: 'Session length (min)', type: 'number', ph: 'e.g. 30' },
  { key: 'availability', label: 'Availability',     type: 'textarea', ph: 'e.g. Mon–Fri evenings, weekends 10am–2pm' },
  { key: 'social_handle',label: 'Social handle',    type: 'text',     ph: '@yourhandle' },
];

const MODE_OPTIONS = [
  { id: 'video', label: 'Video' },
  { id: 'audio', label: 'Audio' },
  { id: 'chat',  label: 'Chat'  },
];

export default function ProfessionalPortalPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile]   = useState(null);
  const [form, setForm]         = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [notice, setNotice]     = useState('');
  const [forbidden, setForbidden] = useState(false);

  // Redirect to login if not signed in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/professionals/login', { replace: true, state: { from: '/professionals/portal' } });
    }
  }, [user, authLoading, navigate]);

  const authedFetch = useCallback(async (path, opts = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw Object.assign(new Error('Session expired. Please sign in again.'), { status: 401 });
    const res = await fetch(`${BASE}${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
    });
    const json = await res.json().catch(() => ({ ok: false, error: 'Unexpected server response.' }));
    if (!json.ok) throw Object.assign(new Error(json.error || 'Request failed'), { status: res.status });
    return json;
  }, []);

  const loadAll = useCallback(async () => {
    if (!user || !supabase) return;
    setLoading(true);
    setError('');
    setForbidden(false);
    try {
      const me = await authedFetch('/api/professional/me');
      setProfile(me.professional);
      setForm(seedForm(me.professional));
      // Bookings are non-critical; don't fail the whole page if they error.
      try {
        const b = await authedFetch('/api/professional/bookings');
        setBookings(b.bookings ?? []);
      } catch { /* ignore */ }
    } catch (e) {
      if (e.status === 403) setForbidden(true);
      else setError(e.message || 'Could not load your profile.');
    } finally {
      setLoading(false);
    }
  }, [user, authedFetch]);

  useEffect(() => { loadAll(); }, [loadAll]);

  function seedForm(p) {
    const f = {};
    for (const { key } of EDITABLE) f[key] = p[key] ?? '';
    f.modes = Array.isArray(p.modes) ? p.modes : (p.modes ? String(p.modes).split(',').map((s) => s.trim()).filter(Boolean) : []);
    return f;
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setNotice('');
  }

  function toggleMode(id) {
    setForm((prev) => {
      const has = prev.modes.includes(id);
      return { ...prev, modes: has ? prev.modes.filter((m) => m !== id) : [...prev.modes, id] };
    });
    setNotice('');
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const payload = {};
      for (const { key } of EDITABLE) payload[key] = form[key] === '' ? null : form[key];
      payload.modes = form.modes;
      const res = await authedFetch('/api/professional/me', { method: 'PATCH', body: JSON.stringify(payload) });
      setProfile(res.professional);
      setForm(seedForm(res.professional));
      setNotice('Profile saved.');
    } catch (e2) {
      setError(e2.message || 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  if (authLoading || (loading && !forbidden)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" aria-hidden="true" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="page">
      <section className="section" style={{ paddingBottom: '2.5rem' }}>
        <div className="container" style={{ maxWidth: 820 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: '1.75rem' }}>
            <div>
              <p className="kicker">Professional portal</p>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>
                {profile?.full_name ? `Hello, ${profile.full_name.split(' ')[0]}` : 'Your portal'}
              </h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>{user.email}</p>
            </div>
            <button type="button" onClick={handleSignOut} className="btn btn-ghost btn-sm">Sign out</button>
          </div>

          {forbidden && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⏳</div>
              <p style={{ fontWeight: 700, marginBottom: 8 }}>No approved profile linked to this email</p>
              <p className="muted" style={{ maxWidth: 420, margin: '0 auto 20px', fontSize: '0.9rem' }}>
                If you applied recently, your application may still be under review. Make sure you signed in with the
                same email you applied with. Questions? Email <a href="mailto:support@serenest.in" style={{ color: 'var(--brand-600, #3c4a2c)' }}>support@serenest.in</a>.
              </p>
              <Link to="/professionals/apply" className="btn btn-primary">Apply to join</Link>
            </div>
          )}

          {error && !forbidden && (
            <div style={{ background: '#fdecea', border: '1px solid #f5c2c0', color: '#a02622', borderRadius: 10, padding: '12px 16px', marginBottom: '1rem', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          {profile && !forbidden && (
            <>
              {/* Verification card (read-only) */}
              <div className="tile" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ background: '#d1e7dd', color: '#0a3622', borderRadius: 99, padding: '3px 12px', fontSize: '0.78rem', fontWeight: 700 }}>
                    ✓ Approved {profile.role_label || profile.role}
                  </span>
                  {profile.registration && (
                    <span className="muted" style={{ fontSize: '0.82rem' }}>Reg. no. {profile.registration}</span>
                  )}
                </div>
                <p className="muted" style={{ fontSize: '0.82rem', marginTop: 10, marginBottom: 0 }}>
                  Your name on record, registration number, email and phone are managed by our team for verification.
                  To change them, email <a href="mailto:support@serenest.in" style={{ color: 'var(--brand-600, #3c4a2c)' }}>support@serenest.in</a>.
                </p>
              </div>

              {/* Editable profile */}
              <form onSubmit={save} className="tile" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: 4 }}>Your public profile</h2>
                <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 18 }}>
                  This is what patients see in the directory when they choose a professional.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {EDITABLE.map(({ key, label, type, ph }) => (
                    <label key={key} className="field" style={type === 'textarea' ? { gridColumn: '1 / -1' } : undefined}>
                      <span className="field-label">{label}</span>
                      {type === 'textarea' ? (
                        <textarea className="input" rows={2} value={form[key] ?? ''} placeholder={ph} onChange={(e) => setField(key, e.target.value)} style={{ resize: 'vertical' }} />
                      ) : (
                        <input className="input" type={type} inputMode={type === 'number' ? 'numeric' : undefined} value={form[key] ?? ''} placeholder={ph} onChange={(e) => setField(key, e.target.value)} />
                      )}
                    </label>
                  ))}
                </div>

                {/* Consultation modes */}
                <div style={{ marginTop: '1rem' }}>
                  <span className="field-label" style={{ display: 'block', marginBottom: 8 }}>Consultation modes</span>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {MODE_OPTIONS.map((m) => {
                      const on = form.modes?.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleMode(m.id)}
                          style={{
                            border: `1px solid ${on ? 'var(--brand-600, #3c4a2c)' : 'var(--border)'}`,
                            background: on ? 'var(--brand-600, #3c4a2c)' : 'var(--surface)',
                            color: on ? '#fff' : 'var(--text)',
                            borderRadius: 99, padding: '6px 16px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                          }}
                          aria-pressed={on}
                        >
                          {on ? '✓ ' : ''}{m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                  {notice && <span style={{ color: '#1d6b3f', fontSize: '0.88rem', fontWeight: 600 }}>{notice}</span>}
                  {error && <span style={{ color: '#a02622', fontSize: '0.88rem' }}>{error}</span>}
                </div>
              </form>

              {/* Assigned appointments */}
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>
                Your appointments
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.88rem', marginLeft: 8 }}>({bookings.length})</span>
              </h2>

              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>📅</div>
                  <p style={{ fontWeight: 700, marginBottom: 6 }}>No appointments assigned yet</p>
                  <p className="muted" style={{ fontSize: '0.9rem', maxWidth: 380, margin: '0 auto' }}>
                    When our team assigns a patient booking to you, it will appear here with a link to join.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {bookings.map((b) => (
                    <div key={b.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                        <StatusBadge status={b.status} />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Booked {fmtDate(b.created_at)}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.6rem 1.25rem', marginBottom: 12 }}>
                        <Meta label="Patient" value={b.patient_name} />
                        <Meta label="Mode"    value={b.mode} />
                        <Meta label="Date"    value={fmtDate(b.preferred_date)} />
                        <Meta label="Time"    value={b.preferred_time} />
                      </div>
                      {b.notes && (
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 12 }}>&ldquo;{b.notes}&rdquo;</p>
                      )}
                      {b.status === 'confirmed' && (
                        <Link to={`/consultation/${b.appointment_id || b.id}?mode=${b.mode}`} className="btn btn-primary btn-sm">
                          🎥 Join consultation
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <p className="muted" style={{ marginTop: '2rem', fontSize: '0.82rem', textAlign: 'center' }}>
            Need help? Email <a href="mailto:support@serenest.in" style={{ color: 'var(--brand-600, #3c4a2c)' }}>support@serenest.in</a>.
          </p>
        </div>
      </section>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>{value || '—'}</div>
    </div>
  );
}
