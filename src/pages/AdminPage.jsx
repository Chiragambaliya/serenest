import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ── API helper ──────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL ?? '';

async function adminFetch(path, secret, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': secret,
      ...(opts.headers ?? {}),
    },
  });
  const json = await res.json().catch(() => ({ ok: false, error: 'Invalid response' }));
  if (!json.ok) throw new Error(json.error ?? 'Request failed');
  return json;
}

// ── Small components ────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = 'var(--brand-500)' }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{value ?? '—'}</span>
      {sub && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub}</span>}
    </div>
  );
}

function Badge({ status }) {
  const map = {
    pending:   { bg: '#fff3cd', color: '#856404' },
    confirmed: { bg: '#d1e7dd', color: '#0a3622' },
    completed: { bg: '#cfe2ff', color: '#084298' },
    cancelled: { bg: '#f8d7da', color: '#842029' },
    approved:  { bg: '#d1e7dd', color: '#0a3622' },
    rejected:  { bg: '#f8d7da', color: '#842029' },
  };
  const s = map[status] ?? { bg: '#e9ecef', color: '#495057' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 99,
      fontSize: '0.72rem',
      fontWeight: 700,
      textTransform: 'capitalize',
      background: s.bg,
      color: s.color,
    }}>{status}</span>
  );
}

function Pill({ n, color = '#dc3545' }) {
  return (
    <span style={{ marginLeft: 6, background: color, color: '#fff', borderRadius: 99, padding: '1px 6px', fontSize: '0.7rem', fontWeight: 700 }}>{n}</span>
  );
}

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',      label: 'Overview' },
  { id: 'bookings',      label: 'Bookings' },
  { id: 'professionals', label: 'Professionals' },
  { id: 'applications',  label: 'Applications' },
  { id: 'hr',            label: 'HR / Hiring' },
  { id: 'messages',      label: 'Messages' },
  { id: 'screenings',    label: 'Screenings' },
  { id: 'signups',       label: 'Signups' },
];

const ROLE_LABELS = {
  psychiatrist: 'Psychiatrist',
  psychologist: 'Psychologist',
  therapist:    'Therapist',
  counsellor:   'Counsellor',
};

const ROLE_COLORS = {
  psychiatrist: '#6f42c1',
  psychologist: '#0d6efd',
  therapist:    '#198754',
  counsellor:   '#e67e22',
};

// ── Main page ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [secret, setSecret]   = useState(() => sessionStorage.getItem('adm_s') ?? '');
  const [input, setInput]     = useState('');
  const [authErr, setAuthErr] = useState('');
  const [tab, setTab]         = useState('overview');

  const [stats, setStats]             = useState(null);
  const [bookings, setBookings]       = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [apps, setApps]               = useState([]);
  const [jobs, setJobs]               = useState([]);
  const [messages, setMessages]       = useState([]);
  const [screenings, setScreenings]   = useState([]);
  const [signups, setSignups]         = useState([]);
  const [noteEdit, setNoteEdit]       = useState({});
  const [proFilter, setProFilter]     = useState('all');
  const [editPro, setEditPro]         = useState(null);
  const [editProData, setEditProData] = useState({});
  const [assignBooking, setAssignBooking] = useState(null);

  // HR sub-state
  const [hrTab, setHrTab]               = useState('applications');
  const [jobPostings, setJobPostings]   = useState([]);
  const [interviews, setInterviews]     = useState([]);
  const [showNewJob, setShowNewJob]     = useState(false);
  const [newJob, setNewJob]             = useState({ title:'', department:'', location:'Remote', type:'full_time', description:'', requirements:'', salary_range:'' });
  const [editJob, setEditJob]           = useState(null);
  const [editJobData, setEditJobData]   = useState({});
  const [scheduleFor, setScheduleFor]   = useState(null);
  const [newInterview, setNewInterview] = useState({ round:1, interview_type:'video', scheduled_at:'', duration_min:45, interviewer_name:'', meeting_link:'', notes:'' });
  const [offerFor, setOfferFor]         = useState(null);
  const [offerData, setOfferData]       = useState({ offer_salary:'', offer_date:'', offer_deadline:'', joining_date:'' });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const authed = Boolean(secret);

  // ── fetch helpers ──────────────────────────────────────────
  const load = useCallback(async (which = 'all') => {
    if (!secret) return;
    setLoading(true);
    setError(null);
    try {
      if (which === 'all' || which === 'stats') {
        const r = await adminFetch('/api/admin/stats', secret);
        setStats(r.stats);
      }
      if (which === 'all' || which === 'bookings') {
        const r = await adminFetch('/api/bookings', secret);
        setBookings(r.bookings ?? []);
      }
      if (which === 'all' || which === 'applications') {
        const r = await adminFetch('/api/professionals/applications', secret);
        setApps(r.applications ?? []);
      }
      if (which === 'all' || which === 'professionals') {
        const r = await adminFetch('/api/professionals/list', secret);
        setProfessionals(r.professionals ?? []);
      }
      if (which === 'all' || which === 'hr') {
        const [rApps, rPostings, rInterviews] = await Promise.all([
          adminFetch('/api/jobs/applications', secret),
          adminFetch('/api/jobs/all', secret),
          adminFetch('/api/hiring/interviews', secret),
        ]);
        setJobs(rApps.applications ?? []);
        setJobPostings(rPostings.jobs ?? []);
        setInterviews(rInterviews.interviews ?? []);
      }
      if (which === 'all' || which === 'messages') {
        const r = await adminFetch('/api/contacts', secret);
        setMessages(r.messages ?? []);
      }
      if (which === 'all' || which === 'signups') {
        const r = await adminFetch('/api/signups', secret);
        setSignups(r.signups ?? []);
      }
      if (which === 'all' || which === 'screenings') {
        const r = await adminFetch('/api/screening', secret);
        setScreenings(r.screenings ?? []);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [secret]);

  useEffect(() => {
    if (authed) load('all');
  }, [authed, load]);

  // ── auth ───────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    setAuthErr('');
    try {
      await adminFetch('/api/admin/stats', input.trim());
      sessionStorage.setItem('adm_s', input.trim());
      setSecret(input.trim());
    } catch {
      setAuthErr('Wrong admin secret. Check your .env ADMIN_SECRET.');
    }
  }

  function signOut() {
    sessionStorage.removeItem('adm_s');
    setSecret('');
    setInput('');
    setStats(null);
    setBookings([]);
    setApps([]);
    setProfessionals([]);
    setJobs([]);
    setMessages([]);
    setScreenings([]);
    setSignups([]);
  }

  // ── job status + notes update ──────────────────────────────
  async function updateJobStatus(id, status) {
    try {
      await adminFetch(`/api/jobs/applications/${id}`, secret, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status } : j));
      load('stats');
    } catch (e) { setError(e.message); }
  }

  async function saveJobNote(id) {
    const hr_notes = noteEdit[id] ?? '';
    try {
      await adminFetch(`/api/jobs/applications/${id}`, secret, {
        method: 'PATCH',
        body: JSON.stringify({ hr_notes }),
      });
      setJobs((prev) => prev.map((j) => j.id === id ? { ...j, hr_notes } : j));
      setNoteEdit((prev) => { const n = { ...prev }; delete n[id]; return n; });
    } catch (e) { setError(e.message); }
  }

  // ── HR: job postings ──────────────────────────────────────
  async function createJobPosting() {
    try {
      const r = await adminFetch('/api/jobs', secret, { method: 'POST', body: JSON.stringify(newJob) });
      setJobPostings((p) => [r.job, ...p]);
      setShowNewJob(false);
      setNewJob({ title:'', department:'', location:'Remote', type:'full_time', description:'', requirements:'', salary_range:'' });
    } catch (e) { setError(e.message); }
  }

  async function saveJobPosting(id) {
    try {
      const r = await adminFetch(`/api/jobs/${id}`, secret, { method: 'PATCH', body: JSON.stringify(editJobData) });
      setJobPostings((p) => p.map((j) => j.id === id ? r.job : j));
      setEditJob(null); setEditJobData({});
    } catch (e) { setError(e.message); }
  }

  async function toggleJobOpen(id, is_open) {
    try {
      const r = await adminFetch(`/api/jobs/${id}`, secret, { method: 'PATCH', body: JSON.stringify({ is_open }) });
      setJobPostings((p) => p.map((j) => j.id === id ? r.job : j));
    } catch (e) { setError(e.message); }
  }

  async function deleteJobPosting(id) {
    try {
      await adminFetch(`/api/jobs/${id}`, secret, { method: 'DELETE' });
      setJobPostings((p) => p.filter((j) => j.id !== id));
    } catch (e) { setError(e.message); }
  }

  // ── HR: interviews ─────────────────────────────────────────
  async function scheduleInterview(applicationId) {
    try {
      const r = await adminFetch('/api/hiring/interviews', secret, {
        method: 'POST',
        body: JSON.stringify({ ...newInterview, application_id: applicationId }),
      });
      setInterviews((p) => [...p, r.interview]);
      setJobs((p) => p.map((j) => j.id === applicationId ? { ...j, status: 'interviewing' } : j));
      setScheduleFor(null);
      setNewInterview({ round:1, interview_type:'video', scheduled_at:'', duration_min:45, interviewer_name:'', meeting_link:'', notes:'' });
    } catch (e) { setError(e.message); }
  }

  async function setInterviewOutcome(id, outcome) {
    try {
      const r = await adminFetch(`/api/hiring/interviews/${id}`, secret, {
        method: 'PATCH', body: JSON.stringify({ outcome }),
      });
      setInterviews((p) => p.map((i) => i.id === id ? r.interview : i));
    } catch (e) { setError(e.message); }
  }

  // ── HR: offers ─────────────────────────────────────────────
  async function extendOffer(applicationId) {
    try {
      const r = await adminFetch(`/api/hiring/offer/${applicationId}`, secret, {
        method: 'POST', body: JSON.stringify(offerData),
      });
      setJobs((p) => p.map((j) => j.id === applicationId ? r.application : j));
      setOfferFor(null);
      setOfferData({ offer_salary:'', offer_date:'', offer_deadline:'', joining_date:'' });
    } catch (e) { setError(e.message); }
  }

  async function rejectWithReason(applicationId, reason) {
    try {
      await adminFetch(`/api/hiring/reject/${applicationId}`, secret, {
        method: 'POST', body: JSON.stringify({ rejection_reason: reason }),
      });
      setJobs((p) => p.map((j) => j.id === applicationId ? { ...j, status: 'rejected', rejection_reason: reason } : j));
    } catch (e) { setError(e.message); }
  }

  // ── professionals management ───────────────────────────────
  async function saveProfessional(id) {
    try {
      await adminFetch(`/api/professionals/${id}`, secret, {
        method: 'PATCH',
        body: JSON.stringify(editProData),
      });
      setProfessionals((prev) => prev.map((p) => p.id === id ? { ...p, ...editProData } : p));
      setEditPro(null);
      setEditProData({});
    } catch (e) { setError(e.message); }
  }

  async function deactivateProfessional(id) {
    try {
      await adminFetch(`/api/professionals/${id}`, secret, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'rejected' }),
      });
      setProfessionals((prev) => prev.filter((p) => p.id !== id));
      load('stats');
    } catch (e) { setError(e.message); }
  }

  async function assignProfessional(bookingId, professionalId) {
    try {
      await adminFetch(`/api/bookings/${bookingId}/assign`, secret, {
        method: 'POST',
        body: JSON.stringify({ professional_id: professionalId }),
      });
      setBookings((prev) => prev.map((b) => b.id === bookingId
        ? { ...b, professional_id: professionalId, status: 'confirmed' } : b));
      setAssignBooking(null);
    } catch (e) { setError(e.message); }
  }

  // ── booking status update ──────────────────────────────────
  async function updateBookingStatus(id, status) {
    try {
      await adminFetch(`/api/bookings/${id}/status`, secret, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      load('stats');
    } catch (e) {
      setError(e.message);
    }
  }

  // ── application status update ──────────────────────────────
  async function updateAppStatus(id, status) {
    try {
      await adminFetch(`/api/professionals/applications/${id}`, secret, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
      load('stats');
    } catch (e) {
      setError(e.message);
    }
  }

  // ── login screen ───────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12, margin: '0 auto 1rem',
              background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem',
            }}>🛡</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Admin Panel</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter your admin secret to continue</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 6 }}>Admin Secret</label>
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Your ADMIN_SECRET from .env"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '0.75rem 1rem',
                  border: `1px solid ${authErr ? '#dc3545' : 'var(--border)'}`,
                  borderRadius: 8, fontSize: '1rem',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  boxSizing: 'border-box',
                }}
              />
              {authErr && <p style={{ color: '#dc3545', fontSize: '0.82rem', marginTop: 6 }}>{authErr}</p>}
            </div>
            <button type="submit" className="btn btn-primary btn-full">Sign in</button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'var(--brand-600)' }}>← Back to website</Link>
          </p>
        </div>
      </div>
    );
  }

  // ── dashboard ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-subtle, #f8f9fa)' }}>
      {/* Top bar */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.1rem' }}>🛡</span>
          <strong style={{ fontSize: '1rem' }}>Serenest Admin</strong>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => load(tab === 'overview' ? 'all' : tab)}
            disabled={loading}
            className="btn btn-ghost btn-sm"
          >
            {loading ? '↻ Loading…' : '↻ Refresh'}
          </button>
          <button onClick={signOut} className="btn btn-ghost btn-sm">Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem' }}>
        {error && (
          <div style={{
            background: '#fff3cd', border: '1px solid #ffc107',
            borderRadius: 8, padding: '0.75rem 1rem',
            marginBottom: '1rem', fontSize: '0.88rem', color: '#856404',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: 4 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); if (t.id !== 'overview') load(t.id); }}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 8,
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: tab === t.id ? 700 : 500,
                cursor: 'pointer',
                background: tab === t.id ? 'var(--brand-500)' : 'var(--surface)',
                color: tab === t.id ? '#fff' : 'var(--text)',
                boxShadow: tab === t.id ? '0 2px 8px rgba(0,128,128,0.3)' : 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
              {t.id === 'bookings'      && stats?.pending_bookings     > 0 && <Pill n={stats.pending_bookings} />}
              {t.id === 'professionals' && stats?.active_professionals > 0 && <Pill n={stats.active_professionals} color="#198754" />}
              {t.id === 'applications'  && stats?.pending_applications > 0 && <Pill n={stats.pending_applications} />}
              {t.id === 'hr'            && stats?.new_jobs             > 0 && <Pill n={stats.new_jobs} />}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '1rem' }}>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <StatCard label="Total Bookings"      value={stats?.bookings}           sub={`${stats?.pending_bookings ?? 0} pending`} />
              <StatCard label="Active Professionals" value={stats?.active_professionals} sub="approved & onboarded" color="var(--brand-600)" />
              <StatCard label="Prof. Applications" value={stats?.applications}  sub={`${stats?.pending_applications ?? 0} pending`} color="var(--brand-700)" />
              <StatCard label="Job Applications"   value={stats?.jobs}          sub={`${stats?.new_jobs ?? 0} new`} color="#e67e22" />
              <StatCard label="Contact Messages"   value={stats?.messages}      color="#6f42c1" />
              <StatCard label="Waitlist Signups"   value={stats?.signups}       color="#0d6efd" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {[
                { id: 'bookings',      icon: '📅', label: 'Manage Bookings',        desc: 'View, confirm & assign appointments' },
                { id: 'professionals', icon: '🩺', label: 'Professionals',          desc: 'Manage psychiatrists, psychologists & therapists' },
                { id: 'applications',  icon: '👩‍⚕️', label: 'Applications',          desc: 'Approve or reject professional sign-ups' },
                { id: 'hr',            icon: '🧑‍💼', label: 'HR / Hiring',           desc: 'Review and manage job applications' },
                { id: 'messages',      icon: '💬', label: 'Contact Messages',       desc: 'Read enquiries from patients & orgs' },
                { id: 'signups',       icon: '📋', label: 'Waitlist',               desc: 'People who signed up before launch' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setTab(item.id); load(item.id); }}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '1.25rem 1.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.15s',
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {tab === 'bookings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>Bookings <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({bookings.length})</span></h2>
              <Link to="/book" className="btn btn-primary btn-sm">+ New booking</Link>
            </div>

            {bookings.length === 0 ? (
              <EmptyState icon="📅" text="No bookings yet" />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {['Patient', 'Type', 'Mode', 'Date', 'Status', 'Actions'].map((h) => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={tdStyle}>
                          <strong>{b.patient_name}</strong><br />
                          <small style={{ color: 'var(--text-muted)' }}>{b.patient_phone}{b.patient_email ? ` · ${b.patient_email}` : ''}</small><br />
                          <small style={{ color: 'var(--text-muted)' }}>{fmt(b.created_at)}</small>
                        </td>
                        <td style={tdStyle}>{b.practitioner_type}</td>
                        <td style={tdStyle}>{b.mode}</td>
                        <td style={tdStyle}>{fmtDate(b.preferred_date)}<br /><small>{b.preferred_time}</small></td>
                        <td style={tdStyle}><Badge status={b.status} /></td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {b.status === 'pending'   && <ActionBtn label="Confirm"  onClick={() => updateBookingStatus(b.id, 'confirmed')}  color="#198754" />}
                            {b.status !== 'completed' && b.status !== 'cancelled' && <ActionBtn label="Complete" onClick={() => updateBookingStatus(b.id, 'completed')} color="#0d6efd" />}
                            {b.status !== 'cancelled' && <ActionBtn label="Cancel"   onClick={() => updateBookingStatus(b.id, 'cancelled')}  color="#dc3545" />}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── PROFESSIONALS ── */}
        {tab === 'professionals' && (() => {
          const filtered = proFilter === 'all'
            ? professionals
            : professionals.filter((p) => p.role === proFilter);

          return (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: '1rem' }}>
                <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                  Active Professionals <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({filtered.length})</span>
                </h2>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['all', 'psychiatrist', 'psychologist', 'therapist', 'counsellor'].map((r) => (
                    <button key={r} onClick={() => setProFilter(r)}
                      style={{
                        padding: '4px 12px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                        background: proFilter === r ? (ROLE_COLORS[r] ?? 'var(--brand-500)') : 'var(--surface)',
                        color: proFilter === r ? '#fff' : 'var(--text)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      }}
                    >
                      {r === 'all' ? 'All' : ROLE_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role breakdown pills */}
              {professionals.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {Object.entries(ROLE_LABELS).map(([role, label]) => {
                    const count = professionals.filter((p) => p.role === role).length;
                    if (!count) return null;
                    return (
                      <span key={role} style={{ padding: '4px 12px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700, background: (ROLE_COLORS[role] ?? '#888') + '18', color: ROLE_COLORS[role] ?? '#888' }}>
                        {label}: {count}
                      </span>
                    );
                  })}
                </div>
              )}

              {filtered.length === 0 ? (
                <EmptyState icon="🩺" text={professionals.length === 0 ? 'No approved professionals yet — approve applications first' : `No ${proFilter}s found`} />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                  {filtered.map((p) => {
                    const isEditing = editPro === p.id;
                    const bookingList = Array.isArray(p.appointments) ? p.appointments : [];
                    const activeCount = bookingList.filter((b) => b.status === 'confirmed').length;
                    const totalCount  = bookingList.length;

                    return (
                      <div key={p.id} style={{
                        background: 'var(--surface)',
                        border: `1px solid ${isEditing ? 'var(--brand-500)' : 'var(--border)'}`,
                        borderRadius: 12,
                        padding: '1.25rem',
                        display: 'flex', flexDirection: 'column', gap: 10,
                        transition: 'border-color 0.2s',
                      }}>
                        {/* Name + role */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{p.full_name}</div>
                            <span style={{
                              display: 'inline-block', marginTop: 3,
                              padding: '2px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700,
                              background: (ROLE_COLORS[p.role] ?? '#888') + '18',
                              color: ROLE_COLORS[p.role] ?? '#888',
                            }}>{ROLE_LABELS[p.role] ?? p.role}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{activeCount} active · {totalCount} total sessions</span>
                          </div>
                        </div>

                        {/* Contact + location */}
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                          {p.phone && <span>📞 {p.phone}</span>}
                          {p.email && <span>✉ {p.email}</span>}
                          {p.city  && <span>📍 {p.city}</span>}
                          {p.clinic && <span>🏥 {p.clinic}</span>}
                        </div>

                        {/* Details grid */}
                        {!isEditing ? (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: '0.82rem' }}>
                            <InfoRow label="Fee"          value={p.fee_inr ? `₹${p.fee_inr} / ${p.duration_min ?? 50} min` : '—'} />
                            <InfoRow label="Languages"    value={p.languages || '—'} />
                            <InfoRow label="Modes"        value={p.modes || '—'} />
                            <InfoRow label="Availability" value={p.availability || '—'} />
                            {p.specialities && <InfoRow label="Specialities" value={p.specialities} style={{ gridColumn: '1/-1' }} />}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                              { key: 'fee_inr',      label: 'Fee (INR)',    placeholder: '1500' },
                              { key: 'duration_min', label: 'Session (min)', placeholder: '50' },
                              { key: 'languages',    label: 'Languages',   placeholder: 'English, Hindi' },
                              { key: 'modes',        label: 'Modes',       placeholder: 'video, audio, chat' },
                              { key: 'availability', label: 'Availability', placeholder: 'Mon-Fri 9am-6pm' },
                              { key: 'specialities', label: 'Specialities', placeholder: 'Anxiety, Depression' },
                              { key: 'city',         label: 'City',        placeholder: 'Mumbai' },
                              { key: 'clinic',       label: 'Clinic',      placeholder: 'Clinic name' },
                            ].map(({ key, label, placeholder }) => (
                              <div key={key}>
                                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 3 }}>{label}</label>
                                <input
                                  value={editProData[key] !== undefined ? editProData[key] : (p[key] ?? '')}
                                  onChange={(e) => setEditProData((prev) => ({ ...prev, [key]: e.target.value }))}
                                  placeholder={placeholder}
                                  style={{ width: '100%', padding: '5px 8px', fontSize: '0.85rem', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg)', color: 'var(--text)', boxSizing: 'border-box' }}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                          {!isEditing ? (
                            <>
                              <ActionBtn label="Edit Profile" onClick={() => { setEditPro(p.id); setEditProData({}); }} color="var(--brand-600)" />
                              <ActionBtn label="Assign to Booking" onClick={() => setAssignBooking(p)} color="#0d6efd" />
                              <ActionBtn label="Deactivate" onClick={() => { if (window.confirm(`Deactivate ${p.full_name}?`)) deactivateProfessional(p.id); }} color="#dc3545" />
                            </>
                          ) : (
                            <>
                              <button onClick={() => saveProfessional(p.id)} className="btn btn-primary btn-sm">Save changes</button>
                              <button onClick={() => { setEditPro(null); setEditProData({}); }} className="btn btn-ghost btn-sm">Cancel</button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Assign to booking modal */}
              {assignBooking && (
                <div style={{
                  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
                }}>
                  <div style={{ background: 'var(--surface)', borderRadius: 14, padding: '1.5rem', maxWidth: 480, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                    <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Assign {assignBooking.full_name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Select a pending booking to assign this professional to:</p>
                    {bookings.filter((b) => b.status === 'pending').length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No pending bookings to assign.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {bookings.filter((b) => b.status === 'pending').map((b) => (
                          <button key={b.id} onClick={() => assignProfessional(b.id, assignBooking.id)} style={{
                            background: 'var(--bg)', border: '1px solid var(--border)',
                            borderRadius: 8, padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                            transition: 'border-color 0.15s',
                          }}>
                            <strong>{b.patient_name}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>{b.practitioner_type} · {b.mode} · {fmtDate(b.preferred_date)} {b.preferred_time}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setAssignBooking(null)} className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }}>Close</button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ── APPLICATIONS ── */}
        {tab === 'applications' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>Professional Applications <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({apps.length})</span></h2>
              <Link to="/professionals/apply" className="btn btn-primary btn-sm">+ Add application</Link>
            </div>

            {apps.length === 0 ? (
              <EmptyState icon="👩‍⚕️" text="No applications yet" />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {['Applicant', 'Role', 'City', 'Fee', 'Languages', 'Status', 'Actions'].map((h) => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map((a) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={tdStyle}>
                          <strong>{a.full_name}</strong><br />
                          <small style={{ color: 'var(--text-muted)' }}>{a.phone}{a.email ? ` · ${a.email}` : ''}</small><br />
                          <small style={{ color: 'var(--text-muted)' }}>{fmt(a.created_at)}</small>
                        </td>
                        <td style={tdStyle}>{a.role_label ?? a.role}</td>
                        <td style={tdStyle}>{a.city || '—'}</td>
                        <td style={tdStyle}>₹{a.fee_inr || '—'}<br /><small>{a.duration_min ? `${a.duration_min} min` : ''}</small></td>
                        <td style={tdStyle}>{a.languages || '—'}</td>
                        <td style={tdStyle}><Badge status={a.status} /></td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {a.status !== 'approved' && <ActionBtn label="Approve" onClick={() => updateAppStatus(a.id, 'approved')} color="#198754" />}
                            {a.status !== 'rejected' && <ActionBtn label="Reject"  onClick={() => updateAppStatus(a.id, 'rejected')} color="#dc3545" />}
                            {a.status !== 'pending'  && <ActionBtn label="Reset"   onClick={() => updateAppStatus(a.id, 'pending')}  color="#6c757d" />}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── HR / HIRING ── */}
        {tab === 'hr' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '1rem' }}>HR / Hiring</h2>

            {/* HR sub-tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: 0 }}>
              {[
                { id: 'applications', label: `Applications (${jobs.length})` },
                { id: 'postings',     label: `Job Postings (${jobPostings.length})` },
                { id: 'interviews',   label: `Interviews (${interviews.length})` },
              ].map((st) => (
                <button key={st.id} onClick={() => setHrTab(st.id)} style={{
                  padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.88rem', fontWeight: hrTab === st.id ? 700 : 500,
                  color: hrTab === st.id ? 'var(--brand-600)' : 'var(--text-muted)',
                  borderBottom: hrTab === st.id ? '2px solid var(--brand-500)' : '2px solid transparent',
                  marginBottom: -2, transition: 'all 0.15s',
                }}>{st.label}</button>
              ))}
            </div>

            {/* ── SUB: APPLICATIONS ── */}
            {hrTab === 'applications' && (
              <div>
                {/* Pipeline funnel */}
                {jobs.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {[
                      { s:'new', c:'#0d6efd' }, { s:'reviewing', c:'#6f42c1' },
                      { s:'shortlisted', c:'#e67e22' }, { s:'interviewing', c:'#fd7e14' },
                      { s:'hired', c:'#198754' }, { s:'rejected', c:'#dc3545' },
                    ].map(({ s, c }) => {
                      const count = jobs.filter((j) => j.status === s).length;
                      if (!count) return null;
                      return (
                        <span key={s} style={{ padding: '4px 14px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700, background: c + '18', color: c }}>
                          {s}: {count}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                  <button onClick={() => {
                    const csv = ['Name,Email,Phone,Department,Role,Status,Applied', ...jobs.map((j) => `"${j.full_name}","${j.email}","${j.phone ?? ''}","${j.department}","${j.role}","${j.status}","${fmtDate(j.created_at)}"`)] .join('\n');
                    const a = document.createElement('a'); a.href = 'data:text/csv,' + encodeURIComponent(csv); a.download = 'applications.csv'; a.click();
                  }} className="btn btn-ghost btn-sm">Export CSV</button>
                </div>

                {jobs.length === 0 ? <EmptyState icon="🧑‍💼" text="No job applications yet" /> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {jobs.map((j) => {
                      const appInterviews = interviews.filter((i) => i.application_id === j.id);
                      return (
                        <div key={j.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'1.25rem 1.5rem' }}>
                          {/* Header */}
                          <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:8 }}>
                            <div>
                              <strong style={{ fontSize:'1rem' }}>{j.full_name}</strong>
                              <span style={{ marginLeft:10, fontSize:'0.82rem', color:'var(--text-muted)' }}>{j.email}</span>
                              {j.phone && <span style={{ marginLeft:8, fontSize:'0.82rem', color:'var(--text-muted)' }}>{j.phone}</span>}
                              {j.city  && <span style={{ marginLeft:8, fontSize:'0.82rem', color:'var(--text-muted)' }}>📍 {j.city}</span>}
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <Badge status={j.status} />
                              <small style={{ color:'var(--text-muted)' }}>{fmt(j.created_at)}</small>
                            </div>
                          </div>

                          {/* Role + links */}
                          <div style={{ marginBottom:8, fontSize:'0.88rem' }}>
                            <span style={{ fontWeight:700, color:'var(--brand-600)' }}>{j.department}</span>
                            <span style={{ color:'var(--text-muted)', margin:'0 6px' }}>›</span>
                            <span>{j.role}</span>
                            {j.linkedin_url  && <a href={j.linkedin_url}  target="_blank" rel="noreferrer" style={{ marginLeft:12, color:'#0077b5', fontSize:'0.82rem' }}>LinkedIn ↗</a>}
                            {j.portfolio_url && <a href={j.portfolio_url} target="_blank" rel="noreferrer" style={{ marginLeft:8, color:'var(--brand-600)', fontSize:'0.82rem' }}>Portfolio ↗</a>}
                            {j.resume_url    && <a href={j.resume_url}    target="_blank" rel="noreferrer" style={{ marginLeft:8, color:'#6f42c1', fontSize:'0.82rem' }}>Resume ↗</a>}
                          </div>

                          {j.cover_note && <p style={{ margin:'0 0 10px', fontSize:'0.85rem', lineHeight:1.6, background:'var(--bg-subtle,#f8f9fa)', borderRadius:6, padding:'8px 10px' }}>{j.cover_note}</p>}

                          {/* Interviews for this applicant */}
                          {appInterviews.length > 0 && (
                            <div style={{ margin:'8px 0', padding:'8px 12px', background:'var(--bg-subtle,#f8f9fa)', borderRadius:8 }}>
                              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:6 }}>Interviews</div>
                              {appInterviews.map((iv) => (
                                <div key={iv.id} style={{ fontSize:'0.82rem', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginBottom:4 }}>
                                  <span>Round {iv.round} · {iv.interview_type}</span>
                                  <span style={{ color:'var(--text-muted)' }}>{fmt(iv.scheduled_at)}</span>
                                  {iv.interviewer_name && <span>👤 {iv.interviewer_name}</span>}
                                  {iv.meeting_link && <a href={iv.meeting_link} target="_blank" rel="noreferrer" style={{ color:'var(--brand-600)', fontSize:'0.8rem' }}>Join ↗</a>}
                                  <Badge status={iv.outcome} />
                                  {iv.outcome === 'pending' && (
                                    <div style={{ display:'flex', gap:4 }}>
                                      <ActionBtn label="Pass"    onClick={() => setInterviewOutcome(iv.id, 'pass')}    color="#198754" />
                                      <ActionBtn label="Fail"    onClick={() => setInterviewOutcome(iv.id, 'fail')}    color="#dc3545" />
                                      <ActionBtn label="No-show" onClick={() => setInterviewOutcome(iv.id, 'no_show')} color="#6c757d" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Offer details */}
                          {j.offer_salary && (
                            <div style={{ margin:'8px 0', padding:'8px 12px', background:'#d1e7dd', borderRadius:8, fontSize:'0.85rem' }}>
                              💼 Offer: <strong>{j.offer_salary}</strong>
                              {j.offer_deadline && <span style={{ marginLeft:8, color:'#0a3622' }}>Deadline: {fmtDate(j.offer_deadline)}</span>}
                              {j.joining_date   && <span style={{ marginLeft:8, color:'#0a3622' }}>Joining: {fmtDate(j.joining_date)}</span>}
                              {j.offer_accepted === true  && <span style={{ marginLeft:8, fontWeight:700, color:'#198754' }}>✓ Accepted</span>}
                              {j.offer_accepted === false && <span style={{ marginLeft:8, fontWeight:700, color:'#dc3545' }}>✗ Declined</span>}
                            </div>
                          )}

                          {/* HR notes */}
                          <div style={{ marginBottom:10, marginTop:8 }}>
                            <div style={{ display:'flex', gap:6 }}>
                              <input
                                value={noteEdit[j.id] !== undefined ? noteEdit[j.id] : (j.hr_notes ?? '')}
                                onChange={(e) => setNoteEdit((p) => ({ ...p, [j.id]: e.target.value }))}
                                placeholder="HR notes…"
                                style={{ flex:1, padding:'6px 10px', fontSize:'0.85rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)' }}
                              />
                              {noteEdit[j.id] !== undefined && <button onClick={() => saveJobNote(j.id)} className="btn btn-sm btn-primary">Save</button>}
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                            {j.status !== 'reviewing'   && <ActionBtn label="Reviewing"   onClick={() => updateJobStatus(j.id,'reviewing')}   color="#6f42c1" />}
                            {j.status !== 'shortlisted' && <ActionBtn label="Shortlist"   onClick={() => updateJobStatus(j.id,'shortlisted')} color="#e67e22" />}
                            <ActionBtn label="+ Interview" onClick={() => setScheduleFor(j)} color="#fd7e14" />
                            {j.status !== 'hired' && !j.offer_salary && <ActionBtn label="Extend Offer" onClick={() => setOfferFor(j)} color="#198754" />}
                            {j.status !== 'rejected' && <ActionBtn label="Reject" onClick={() => { const r = prompt('Rejection reason (optional):'); rejectWithReason(j.id, r ?? ''); }} color="#dc3545" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── SUB: JOB POSTINGS ── */}
            {hrTab === 'postings' && (
              <div>
                <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1rem' }}>
                  <button onClick={() => setShowNewJob(true)} className="btn btn-primary btn-sm">+ New Job Posting</button>
                </div>

                {/* Create form */}
                {showNewJob && (
                  <div style={{ background:'var(--surface)', border:'2px solid var(--brand-500)', borderRadius:12, padding:'1.5rem', marginBottom:'1.5rem' }}>
                    <h3 style={{ fontWeight:800, marginBottom:'1rem' }}>Create Job Posting</h3>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                      {[
                        { k:'title',        label:'Job Title *',     ph:'e.g. Frontend Engineer' },
                        { k:'department',   label:'Department *',    ph:'e.g. Technology' },
                        { k:'location',     label:'Location',        ph:'Remote / Mumbai / Hybrid' },
                        { k:'salary_range', label:'Salary Range',    ph:'e.g. ₹8–12 LPA' },
                      ].map(({ k, label, ph }) => (
                        <div key={k}>
                          <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>{label}</label>
                          <input value={newJob[k]} onChange={(e) => setNewJob((p) => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                            style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' }} />
                        </div>
                      ))}
                      <div>
                        <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>Type</label>
                        <select value={newJob.type} onChange={(e) => setNewJob((p) => ({ ...p, type: e.target.value }))}
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)' }}>
                          <option value="full_time">Full-time</option>
                          <option value="part_time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>
                      <div style={{ gridColumn:'1/-1' }}>
                        <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>Description</label>
                        <textarea value={newJob.description} onChange={(e) => setNewJob((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Role overview…"
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)', resize:'vertical', boxSizing:'border-box' }} />
                      </div>
                      <div style={{ gridColumn:'1/-1' }}>
                        <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>Requirements</label>
                        <textarea value={newJob.requirements} onChange={(e) => setNewJob((p) => ({ ...p, requirements: e.target.value }))} rows={3} placeholder="Skills and experience needed…"
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)', resize:'vertical', boxSizing:'border-box' }} />
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, marginTop:'1rem' }}>
                      <button onClick={createJobPosting} className="btn btn-primary btn-sm">Publish</button>
                      <button onClick={() => setShowNewJob(false)} className="btn btn-ghost btn-sm">Cancel</button>
                    </div>
                  </div>
                )}

                {jobPostings.length === 0 ? <EmptyState icon="📋" text="No job postings yet" /> : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                    {jobPostings.map((jp) => (
                      <div key={jp.id} style={{ background:'var(--surface)', border:`1px solid ${jp.is_open ? 'var(--border)' : '#dee2e6'}`, borderRadius:10, padding:'1rem 1.25rem', opacity: jp.is_open ? 1 : 0.65 }}>
                        {editJob === jp.id ? (
                          <div>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.75rem' }}>
                              {[
                                { k:'title', label:'Title' }, { k:'department', label:'Department' },
                                { k:'location', label:'Location' }, { k:'salary_range', label:'Salary Range' },
                              ].map(({ k, label }) => (
                                <div key={k}>
                                  <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:2 }}>{label}</label>
                                  <input value={editJobData[k] !== undefined ? editJobData[k] : (jp[k] ?? '')}
                                    onChange={(e) => setEditJobData((p) => ({ ...p, [k]: e.target.value }))}
                                    style={{ width:'100%', padding:'5px 8px', fontSize:'0.85rem', border:'1px solid var(--border)', borderRadius:5, background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' }} />
                                </div>
                              ))}
                              {['description','requirements'].map((k) => (
                                <div key={k} style={{ gridColumn:'1/-1' }}>
                                  <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:2 }}>{k}</label>
                                  <textarea value={editJobData[k] !== undefined ? editJobData[k] : (jp[k] ?? '')}
                                    onChange={(e) => setEditJobData((p) => ({ ...p, [k]: e.target.value }))} rows={3}
                                    style={{ width:'100%', padding:'5px 8px', fontSize:'0.85rem', border:'1px solid var(--border)', borderRadius:5, background:'var(--bg)', color:'var(--text)', resize:'vertical', boxSizing:'border-box' }} />
                                </div>
                              ))}
                            </div>
                            <div style={{ display:'flex', gap:6 }}>
                              <button onClick={() => saveJobPosting(jp.id)} className="btn btn-primary btn-sm">Save</button>
                              <button onClick={() => { setEditJob(null); setEditJobData({}); }} className="btn btn-ghost btn-sm">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:6 }}>
                              <div>
                                <strong style={{ fontSize:'1rem' }}>{jp.title}</strong>
                                <span style={{ marginLeft:10, fontSize:'0.82rem', background: jp.is_open ? '#d1e7dd' : '#e9ecef', color: jp.is_open ? '#0a3622' : '#6c757d', padding:'2px 8px', borderRadius:99, fontWeight:700 }}>
                                  {jp.is_open ? 'Open' : 'Closed'}
                                </span>
                              </div>
                              <small style={{ color:'var(--text-muted)' }}>{fmt(jp.created_at)}</small>
                            </div>
                            <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', display:'flex', flexWrap:'wrap', gap:'4px 12px', marginBottom:8 }}>
                              <span>🏢 {jp.department}</span>
                              <span>📍 {jp.location}</span>
                              <span>⏰ {jp.type.replace('_',' ')}</span>
                              {jp.salary_range && <span>💰 {jp.salary_range}</span>}
                            </div>
                            {jp.description && <p style={{ fontSize:'0.85rem', margin:'0 0 8px', lineHeight:1.6 }}>{jp.description}</p>}
                            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                              <ActionBtn label="Edit" onClick={() => { setEditJob(jp.id); setEditJobData({}); }} color="var(--brand-600)" />
                              <ActionBtn label={jp.is_open ? 'Close Posting' : 'Re-open'} onClick={() => toggleJobOpen(jp.id, !jp.is_open)} color={jp.is_open ? '#6c757d' : '#198754'} />
                              <ActionBtn label="Delete" onClick={() => { if (window.confirm('Delete this posting?')) deleteJobPosting(jp.id); }} color="#dc3545" />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SUB: INTERVIEWS ── */}
            {hrTab === 'interviews' && (
              <div>
                {interviews.length === 0 ? <EmptyState icon="🎙" text="No interviews scheduled yet" /> : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                    {interviews.map((iv) => (
                      <div key={iv.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'1rem 1.25rem' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:6 }}>
                          <div>
                            <strong>{iv.job_applications?.full_name ?? '—'}</strong>
                            <span style={{ marginLeft:8, fontSize:'0.82rem', color:'var(--text-muted)' }}>{iv.job_applications?.department} › {iv.job_applications?.role}</span>
                          </div>
                          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                            <Badge status={iv.outcome} />
                            <small style={{ color:'var(--text-muted)' }}>Round {iv.round}</small>
                          </div>
                        </div>
                        <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', display:'flex', flexWrap:'wrap', gap:'4px 12px', marginBottom:8 }}>
                          <span>📅 {fmt(iv.scheduled_at)}</span>
                          <span>⏱ {iv.duration_min} min</span>
                          <span>📱 {iv.interview_type}</span>
                          {iv.interviewer_name && <span>👤 {iv.interviewer_name}</span>}
                        </div>
                        {iv.meeting_link && <a href={iv.meeting_link} target="_blank" rel="noreferrer" style={{ fontSize:'0.82rem', color:'var(--brand-600)', display:'block', marginBottom:8 }}>🔗 {iv.meeting_link}</a>}
                        {iv.notes && <p style={{ fontSize:'0.82rem', margin:'0 0 8px', color:'var(--text)' }}>{iv.notes}</p>}
                        {iv.outcome_notes && <p style={{ fontSize:'0.82rem', margin:'0 0 8px', background:'var(--bg-subtle,#f8f9fa)', padding:'6px 10px', borderRadius:6 }}>Outcome note: {iv.outcome_notes}</p>}
                        {iv.outcome === 'pending' && (
                          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                            <ActionBtn label="Pass"    onClick={() => setInterviewOutcome(iv.id,'pass')}    color="#198754" />
                            <ActionBtn label="Fail"    onClick={() => setInterviewOutcome(iv.id,'fail')}    color="#dc3545" />
                            <ActionBtn label="No-show" onClick={() => setInterviewOutcome(iv.id,'no_show')} color="#6c757d" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Schedule Interview Modal ── */}
            {scheduleFor && (
              <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
                <div style={{ background:'var(--surface)', borderRadius:14, padding:'1.5rem', maxWidth:460, width:'100%', overflowY:'auto', maxHeight:'90vh' }}>
                  <h3 style={{ fontWeight:800, marginBottom:4 }}>Schedule Interview</h3>
                  <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'1rem' }}>For: <strong>{scheduleFor.full_name}</strong> — {scheduleFor.department} › {scheduleFor.role}</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                    {[
                      { k:'scheduled_at',     label:'Date & Time *',     type:'datetime-local' },
                      { k:'interviewer_name', label:'Interviewer Name',   type:'text', ph:'e.g. Dr. Priya Sharma' },
                      { k:'meeting_link',     label:'Meeting Link',       type:'url',  ph:'https://meet.google.com/...' },
                      { k:'notes',            label:'Notes',              type:'text', ph:'Preparation instructions…' },
                    ].map(({ k, label, type, ph }) => (
                      <div key={k}>
                        <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>{label}</label>
                        <input type={type} value={newInterview[k]} onChange={(e) => setNewInterview((p) => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' }} />
                      </div>
                    ))}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
                      <div>
                        <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>Round</label>
                        <input type="number" min={1} max={5} value={newInterview.round} onChange={(e) => setNewInterview((p) => ({ ...p, round: +e.target.value }))}
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)' }} />
                      </div>
                      <div>
                        <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>Type</label>
                        <select value={newInterview.interview_type} onChange={(e) => setNewInterview((p) => ({ ...p, interview_type: e.target.value }))}
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)' }}>
                          <option value="video">Video</option>
                          <option value="phone">Phone</option>
                          <option value="in_person">In Person</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:'1rem' }}>
                    <button onClick={() => scheduleInterview(scheduleFor.id)} className="btn btn-primary btn-sm">Schedule</button>
                    <button onClick={() => setScheduleFor(null)} className="btn btn-ghost btn-sm">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Extend Offer Modal ── */}
            {offerFor && (
              <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
                <div style={{ background:'var(--surface)', borderRadius:14, padding:'1.5rem', maxWidth:400, width:'100%' }}>
                  <h3 style={{ fontWeight:800, marginBottom:4 }}>Extend Offer</h3>
                  <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'1rem' }}>For: <strong>{offerFor.full_name}</strong></p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                    {[
                      { k:'offer_salary',   label:'Salary / CTC *',  type:'text',  ph:'e.g. ₹12 LPA' },
                      { k:'offer_date',     label:'Offer Date',       type:'date' },
                      { k:'offer_deadline', label:'Response Deadline', type:'date' },
                      { k:'joining_date',   label:'Joining Date',     type:'date' },
                    ].map(({ k, label, type, ph }) => (
                      <div key={k}>
                        <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:3 }}>{label}</label>
                        <input type={type} value={offerData[k]} onChange={(e) => setOfferData((p) => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                          style={{ width:'100%', padding:'7px 10px', fontSize:'0.88rem', border:'1px solid var(--border)', borderRadius:6, background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:'1rem' }}>
                    <button onClick={() => extendOffer(offerFor.id)} className="btn btn-primary btn-sm">Send Offer</button>
                    <button onClick={() => setOfferFor(null)} className="btn btn-ghost btn-sm">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MESSAGES ── */}
        {tab === 'messages' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '1rem' }}>
              Contact Messages <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({messages.length})</span>
            </h2>
            {messages.length === 0 ? (
              <EmptyState icon="💬" text="No messages yet" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {messages.map((m) => (
                  <div key={m.id} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '1rem 1.25rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                      <div>
                        <strong>{m.name}</strong>
                        {m.email && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 8 }}>{m.email}</span>}
                        {m.phone && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 8 }}>{m.phone}</span>}
                      </div>
                      <small style={{ color: 'var(--text-muted)' }}>{fmt(m.created_at)}</small>
                    </div>
                    {m.subject && <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.9rem' }}>{m.subject}</div>}
                    <p style={{ margin: 0, color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.6 }}>{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SCREENINGS ── */}
        {tab === 'screenings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                Self-screenings <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({screenings.length})</span>
              </h2>
              <button
                onClick={() => {
                  const csv = [
                    'Name,Phone,Email,PHQ-9,PHQ Severity,GAD-7,GAD Severity,Wants Callback,Submitted',
                    ...screenings.map((s) => [
                      s.name ?? '',
                      s.phone ?? '',
                      s.email ?? '',
                      s.phq9_score ?? '',
                      s.phq9_severity ?? '',
                      s.gad7_score ?? '',
                      s.gad7_severity ?? '',
                      s.wants_callback ? 'yes' : 'no',
                      fmt(s.created_at),
                    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')),
                  ].join('\n');
                  const a = document.createElement('a');
                  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                  a.download = 'serenest-screenings.csv';
                  a.click();
                }}
                className="btn btn-ghost btn-sm"
              >
                Export CSV
              </button>
            </div>

            {screenings.length === 0 ? (
              <EmptyState icon="🧠" text="No screenings yet" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {screenings.map((s) => {
                  const sev = (label) => {
                    const map = {
                      Minimal:              { bg: '#d1e7dd', color: '#0a3622' },
                      Mild:                 { bg: '#cfe2ff', color: '#084298' },
                      Moderate:             { bg: '#ffe5d0', color: '#8a4a00' },
                      'Moderately Severe':  { bg: '#ffd8c2', color: '#9a3b00' },
                      Severe:               { bg: '#f8d7da', color: '#842029' },
                    };
                    return map[label] ?? { bg: '#e9ecef', color: '#495057' };
                  };
                  const phqStyle = sev(s.phq9_severity);
                  const gadStyle = sev(s.gad7_severity);
                  const safety = (Array.isArray(s.phq9_answers) ? s.phq9_answers[8] : 0) > 0;

                  return (
                    <div key={s.id} style={{
                      background: 'var(--surface)',
                      border: `1px solid ${safety ? '#dc3545' : 'var(--border)'}`,
                      borderRadius: 12,
                      padding: '1rem 1.25rem',
                      display: 'grid',
                      gridTemplateColumns: 'minmax(180px, 1.4fr) repeat(2, minmax(160px, 1fr)) auto',
                      gap: '1rem',
                      alignItems: 'center',
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {s.name ?? <em style={{ color: 'var(--text-muted)' }}>Anonymous</em>}
                          {safety && <span title="Safety flag — Q9 indicated self-harm" style={{ background: '#dc3545', color: '#fff', padding: '1px 7px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 800 }}>⚠ SAFETY</span>}
                          {s.wants_callback && <span style={{ background: '#fff3cd', color: '#856404', padding: '1px 7px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 700 }}>Wants callback</span>}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {s.phone && <span>📞 {s.phone}</span>}
                          {s.email && <span>✉ {s.email}</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{fmt(s.created_at)}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>PHQ-9 (Depression)</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{s.phq9_score ?? '—'}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}> / 27</span></div>
                        {s.phq9_severity && <span style={{ display: 'inline-block', marginTop: 4, background: phqStyle.bg, color: phqStyle.color, padding: '1px 8px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700 }}>{s.phq9_severity}</span>}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>GAD-7 (Anxiety)</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{s.gad7_score ?? '—'}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}> / 21</span></div>
                        {s.gad7_severity && <span style={{ display: 'inline-block', marginTop: 4, background: gadStyle.bg, color: gadStyle.color, padding: '1px 8px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700 }}>{s.gad7_severity}</span>}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {s.phone && (
                          <a
                            href={`https://wa.me/91${s.phone}?text=${encodeURIComponent(`Hi ${s.name ? s.name.split(' ')[0] : 'there'}, this is Serenest reaching out about your recent self-screening. Would you like to talk to one of our professionals?`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm"
                            style={{ background: '#25D366', color: '#fff', borderColor: '#25D366', fontSize: '0.8rem' }}
                          >
                            💬 WhatsApp
                          </a>
                        )}
                        {s.phone && (
                          <a href={`tel:${s.phone}`} className="btn btn-sm btn-ghost" style={{ fontSize: '0.8rem' }}>📞 Call</a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SIGNUPS ── */}
        {tab === 'signups' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                Waitlist Signups <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({signups.length})</span>
              </h2>
              <button
                onClick={() => {
                  const csv = ['Email,Mobile,Date', ...signups.map((s) => `${s.email},${s.mobile},${fmtDate(s.created_at)}`)].join('\n');
                  const a = document.createElement('a');
                  a.href = 'data:text/csv,' + encodeURIComponent(csv);
                  a.download = 'serenest-signups.csv';
                  a.click();
                }}
                className="btn btn-ghost btn-sm"
              >
                Export CSV
              </button>
            </div>

            {signups.length === 0 ? (
              <EmptyState icon="📋" text="No signups yet" />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {['Email', 'Mobile', 'Signed up'].map((h) => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {signups.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={tdStyle}>{s.email}</td>
                        <td style={tdStyle}>{s.mobile}</td>
                        <td style={tdStyle}>{fmt(s.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared style constants ──────────────────────────────────────────────────
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'var(--surface)',
  borderRadius: 10,
  overflow: 'hidden',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  fontSize: '0.88rem',
};

const thStyle = {
  background: 'var(--bg-subtle, #f5f5f5)',
  padding: '0.7rem 1rem',
  textAlign: 'left',
  fontWeight: 700,
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)',
  borderBottom: '1px solid var(--border)',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '0.75rem 1rem',
  verticalAlign: 'top',
  lineHeight: 1.5,
};

function EmptyState({ icon, text }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '3rem',
      textAlign: 'center',
      color: 'var(--text-muted)',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <p style={{ margin: 0, fontWeight: 500 }}>{text}</p>
    </div>
  );
}

function InfoRow({ label, value, style = {} }) {
  return (
    <div style={style}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{value}</div>
    </div>
  );
}

function ActionBtn({ label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '3px 10px',
        borderRadius: 6,
        border: `1px solid ${color}`,
        background: 'transparent',
        color,
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => { e.target.style.background = color; e.target.style.color = '#fff'; }}
      onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = color; }}
    >
      {label}
    </button>
  );
}
