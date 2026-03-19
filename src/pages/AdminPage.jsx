import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const LS_APPS = 'serenest_professional_applications_v1';
const LS_ADMIN = 'serenest_admin_authed_v1';

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadAppsFromLS() {
  const data = safeJsonParse(localStorage.getItem(LS_APPS) ?? '[]', []);
  return Array.isArray(data) ? data : [];
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(LS_ADMIN) === 'true');
  const [pin, setPin] = useState('');
  const [tab, setTab] = useState('applications');
  const [apps, setApps] = useState(() => (supabase ? [] : loadAppsFromLS()));
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    for (const a of apps) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [apps]);

  async function fetchApps() {
    setLoading(true);
    if (supabase) {
      const { data, error } = await supabase
        .from('professional_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setApps(data);
    } else {
      setApps(loadAppsFromLS());
    }
    setLoading(false);
  }

  useEffect(() => {
    if (authed) fetchApps();
  }, [authed]);

  function signIn() {
    if (pin.trim() !== '1234') return;
    localStorage.setItem(LS_ADMIN, 'true');
    setAuthed(true);
  }

  function signOut() {
    localStorage.removeItem(LS_ADMIN);
    setAuthed(false);
    setPin('');
    setApps([]);
  }

  async function setStatus(id, status) {
    setActionError(null);
    if (supabase) {
      const { error } = await supabase
        .from('professional_applications')
        .update({ status })
        .eq('id', id);
      if (error) {
        setActionError(error.message);
        return;
      }
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } else {
      const next = apps.map((a) => (a.id === id ? { ...a, status } : a));
      setApps(next);
      localStorage.setItem(LS_APPS, JSON.stringify(next));
    }
  }

  async function removeApp(id) {
    setActionError(null);
    if (supabase) {
      const { error } = await supabase
        .from('professional_applications')
        .delete()
        .eq('id', id);
      if (error) {
        setActionError(error.message);
        return;
      }
      setApps((prev) => prev.filter((a) => a.id !== id));
    } else {
      const next = apps.filter((a) => a.id !== id);
      setApps(next);
      localStorage.setItem(LS_APPS, JSON.stringify(next));
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(apps, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'serenest-professional-applications.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <div className="page">
        <main className="container" style={{ maxWidth: 400, paddingBlock: '4rem' }}>
          <p className="label">Admin</p>
          <h1>Admin panel</h1>
          <p>Enter the admin PIN to continue.</p>
          <label>
            Admin PIN
            <input className="input" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Default: 1234" inputMode="numeric" />
          </label>
          <div className="btn-row" style={{ marginTop: '1rem' }}>
            <Link to="/" className="btn btn-ghost">
              Back to home
            </Link>
            <button className="btn" onClick={signIn}>
              Sign in
            </button>
          </div>
          <p className="hint" style={{ marginTop: '1rem' }}>
            This is a local-only gate for now (not real security).
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="container" style={{ paddingBlock: '2rem' }}>
        <p className="label">Admin</p>
        <h1>Dashboard</h1>
        <p>Manage applications and review activity.</p>

        <div className="tabs">
          <button className={`tab${tab === 'applications' ? ' active' : ''}`} onClick={() => setTab('applications')}>
            Applications <span className="badge">{counts.pending}</span>
          </button>
          <button className={`tab${tab === 'bookings' ? ' active' : ''}`} onClick={() => setTab('bookings')}>
            Bookings
          </button>
          <button className={`tab${tab === 'content' ? ' active' : ''}`} onClick={() => setTab('content')}>
            Content
          </button>
          <button className={`tab${tab === 'settings' ? ' active' : ''}`} onClick={() => setTab('settings')}>
            Settings
          </button>
        </div>

        <div className="admin-actions">
          <button className="btn btn-ghost" onClick={fetchApps} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="btn btn-ghost" onClick={exportJson}>
            Export JSON
          </button>
          <button className="btn btn-ghost" onClick={signOut}>
            Sign out
          </button>
        </div>

        {actionError && (
          <p className="error" style={{ marginBottom: '1rem' }}>
            {actionError}
          </p>
        )}

        {tab === 'applications' && (
          <section>
            <div className="table-header">
              <h2>Professional applications</h2>
              <p>
                Pending: {counts.pending} · Approved: {counts.approved} · Rejected: {counts.rejected}
              </p>
            </div>
            <Link to="/professionals/apply" className="btn" style={{ marginBottom: '1rem', display: 'inline-block' }}>
              + New application
            </Link>

            {apps.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No applications yet</p>
                <p>Applications will appear here after submission from /professionals/apply.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Role</th>
                      <th>City</th>
                      <th>Fee</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <strong>{a.full_name}</strong>
                          <br />
                          <span>
                            {a.phone}
                            {a.email ? ` · ${a.email}` : ''}
                          </span>
                          <br />
                          <small>Applied: {new Date(a.created_at).toLocaleString()}</small>
                        </td>
                        <td>{a.role_label ?? a.role}</td>
                        <td>{a.city || '-'}</td>
                        <td>
                          Rs.{a.fee_inr || '-'} · {a.duration_min || '-'}m
                        </td>
                        <td>
                          <span className={`status-badge status-${a.status}`}>{a.status}</span>
                        </td>
                        <td>
                          <button className="btn btn-sm" onClick={() => setStatus(a.id, 'approved')}>
                            Approve
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => setStatus(a.id, 'rejected')}>
                            Reject
                          </button>
                          <button className="btn btn-sm btn-ghost" onClick={() => removeApp(a.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tab !== 'applications' && (
          <section className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p className="label">Admin</p>
            <h2>Coming soon</h2>
            <p>This section is a UI placeholder.</p>
          </section>
        )}
      </main>
    </div>
  );
}
