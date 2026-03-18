import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const LS_APPS = 'serenest_professional_applications_v1';
const LS_ADMIN = 'serenest_admin_authed_v1';

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadApps() {
  const data = safeJsonParse(localStorage.getItem(LS_APPS) ?? '[]', []);
  return Array.isArray(data) ? data : [];
}

function saveApps(apps) {
  localStorage.setItem(LS_APPS, JSON.stringify(apps));
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(LS_ADMIN) === 'true');
  const [pin, setPin] = useState('');

  const [tab, setTab] = useState('applications');
  const [apps, setApps] = useState(() => loadApps());

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    for (const a of apps) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [apps]);

  function signIn() {
    // Local-only guard (not security). Replace with real auth later.
    if (pin.trim() !== '1234') return;
    localStorage.setItem(LS_ADMIN, 'true');
    setAuthed(true);
  }

  function signOut() {
    localStorage.removeItem(LS_ADMIN);
    setAuthed(false);
    setPin('');
  }

  function setStatus(id, status) {
    const next = apps.map((a) => (a.id === id ? { ...a, status } : a));
    setApps(next);
    saveApps(next);
  }

  function removeApp(id) {
    const next = apps.filter((a) => a.id !== id);
    setApps(next);
    saveApps(next);
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
        <section className="section about-hero">
          <div className="container">
            <div className="section-head about-hero-head">
              <p className="kicker">Admin</p>
              <h1 className="page-title">Admin panel</h1>
              <p className="about-subtext">Enter the admin PIN to continue.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="tile admin-auth">
              <label className="field" style={{ margin: 0 }}>
                <span className="field-label">Admin PIN</span>
                <input
                  className="input"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Default: 1234"
                  inputMode="numeric"
                />
              </label>
              <div className="booking-actions">
                <Link className="btn btn-ghost" to="/">
                  Back to home
                </Link>
                <button className="btn btn-primary" type="button" onClick={signIn}>
                  Sign in →
                </button>
              </div>
              <p className="fineprint" style={{ marginTop: 12 }}>
                This is a local-only gate for now (not real security). We’ll replace it with proper auth when
                backend is connected.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Admin</p>
            <h1 className="page-title">Dashboard</h1>
            <p className="about-subtext">Manage applications and review activity.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-shell">
            <aside className="admin-sidebar tile">
              <div className="admin-nav">
                <button
                  type="button"
                  className={`admin-link ${tab === 'applications' ? 'is-active' : ''}`}
                  onClick={() => setTab('applications')}
                >
                  Applications
                  <span className="admin-count">{counts.pending}</span>
                </button>
                <button
                  type="button"
                  className={`admin-link ${tab === 'bookings' ? 'is-active' : ''}`}
                  onClick={() => setTab('bookings')}
                >
                  Bookings <span className="admin-count">—</span>
                </button>
                <button
                  type="button"
                  className={`admin-link ${tab === 'content' ? 'is-active' : ''}`}
                  onClick={() => setTab('content')}
                >
                  Content <span className="admin-count">—</span>
                </button>
                <button
                  type="button"
                  className={`admin-link ${tab === 'settings' ? 'is-active' : ''}`}
                  onClick={() => setTab('settings')}
                >
                  Settings
                </button>
              </div>

              <div className="admin-side-actions">
                <button type="button" className="btn btn-ghost btn-full" onClick={() => setApps(loadApps())}>
                  Refresh
                </button>
                <button type="button" className="btn btn-ghost btn-full" onClick={exportJson}>
                  Export JSON
                </button>
                <button type="button" className="btn btn-ghost btn-full" onClick={signOut}>
                  Sign out
                </button>
              </div>
            </aside>

            <div className="admin-main">
              {tab === 'applications' && (
                <div className="tile admin-panel">
                  <div className="admin-panel-head">
                    <div>
                      <div className="footer-title2">Professional applications</div>
                      <div className="muted" style={{ marginTop: 6 }}>
                        Pending: {counts.pending} · Approved: {counts.approved} · Rejected: {counts.rejected}
                      </div>
                    </div>
                    <Link className="btn btn-primary" to="/professionals/apply">
                      New application
                    </Link>
                  </div>

                  {apps.length === 0 ? (
                    <div className="callout" style={{ marginTop: 14 }}>
                      <div className="callout-title">No applications yet</div>
                      <p className="muted" style={{ margin: 0 }}>
                        Applications will appear here after submission from{' '}
                        <Link to="/professionals/apply">/professionals/apply</Link>.
                      </p>
                    </div>
                  ) : (
                    <div className="admin-table-wrap">
                      <div className="admin-table" role="table" aria-label="Applications table">
                        <div className="admin-row admin-head" role="row">
                          <div className="admin-cell" role="columnheader">
                            Applicant
                          </div>
                          <div className="admin-cell" role="columnheader">
                            Role
                          </div>
                          <div className="admin-cell" role="columnheader">
                            City
                          </div>
                          <div className="admin-cell" role="columnheader">
                            Fee
                          </div>
                          <div className="admin-cell" role="columnheader">
                            Status
                          </div>
                          <div className="admin-cell" role="columnheader">
                            Actions
                          </div>
                        </div>

                        {apps.map((a) => (
                          <div key={a.id} className="admin-row" role="row">
                            <div className="admin-cell" role="cell">
                              <div className="admin-strong">{a.full_name}</div>
                              <div className="admin-sub">
                                {a.phone}
                                {a.email ? ` · ${a.email}` : ''}
                              </div>
                              <div className="admin-sub">Applied: {new Date(a.created_at).toLocaleString()}</div>
                            </div>
                            <div className="admin-cell" role="cell">
                              {a.role_label ?? a.role}
                            </div>
                            <div className="admin-cell" role="cell">
                              {a.city || '—'}
                            </div>
                            <div className="admin-cell" role="cell">
                              ₹{a.fee_inr || '—'} · {a.duration_min || '—'}m
                            </div>
                            <div className="admin-cell" role="cell">
                              <div className={`status-chip is-${a.status}`}>{a.status}</div>
                            </div>
                            <div className="admin-cell" role="cell">
                              <div className="admin-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setStatus(a.id, 'approved')}>
                                  Approve
                                </button>
                                <button type="button" className="btn btn-ghost" onClick={() => setStatus(a.id, 'rejected')}>
                                  Reject
                                </button>
                                <button type="button" className="btn btn-ghost" onClick={() => removeApp(a.id)}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab !== 'applications' && (
                <div className="tile admin-panel">
                  <div className="section-head" style={{ marginBottom: 10 }}>
                    <p className="section-label">Admin</p>
                    <h2>Coming soon</h2>
                    <p>
                      This section is a UI placeholder. We’ll connect real data when Supabase (or another backend)
                      is enabled.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

