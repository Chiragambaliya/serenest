import React, { useEffect, useState } from 'react';
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
    <span style={{
      background: s.bg,
      color: s.color,
      borderRadius: 99,
      padding: '2px 10px',
      fontSize: '0.78rem',
      fontWeight: 700,
      textTransform: 'capitalize',
    }}>
      {status}
    </span>
  );
}

function fmtDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function MetaCell({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>{value || '—'}</div>
    </div>
  );
}

export default function PatientDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/patient/login', { replace: true, state: { from: '/patient/dashboard' } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !supabase) return;

    setLoading(true);
    setError('');

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const token = session?.access_token;
      if (!token) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${BASE}/api/patient/bookings`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || 'Failed to load bookings');
        setBookings(json.bookings ?? []);
      } catch (e) {
        setError(e.message || 'Could not load your bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    });
  }, [user]);

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" aria-hidden="true" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  const firstName   = displayName.includes('@') ? displayName : displayName.split(' ')[0];

  return (
    <div className="page">
      <section className="section" style={{ paddingBottom: '2.5rem' }}>
        <div className="container">

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: '2rem' }}>
            <div>
              <p className="kicker">Patient portal</p>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>
                Hello, {firstName}
              </h1>
              <p className="muted" style={{ fontSize: '0.88rem' }}>{user.email}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/book" className="btn btn-primary btn-sm">+ Book appointment</Link>
              <button type="button" onClick={handleSignOut} className="btn btn-ghost btn-sm">
                Sign out
              </button>
            </div>
          </div>

          {/* Section heading */}
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>
            Your appointments
            {!loading && (
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.88rem', marginLeft: 8 }}>
                ({bookings.length})
              </span>
            )}
          </h2>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="spinner" aria-hidden="true" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: '#fdecea', border: '1px solid #f5c2c0', color: '#a02622', borderRadius: 10, padding: '12px 16px', marginBottom: '1rem', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && bookings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📅</div>
              <p style={{ fontWeight: 700, marginBottom: 8 }}>No appointments yet</p>
              <p className="muted" style={{ marginBottom: 20, fontSize: '0.9rem', maxWidth: 360, margin: '0 auto 20px' }}>
                If you booked before signing up, make sure the email or phone number you used to book matches this account.
              </p>
              <Link to="/book" className="btn btn-primary">Book an appointment</Link>
            </div>
          )}

          {/* Booking cards */}
          {!loading && bookings.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {bookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: '1.25rem 1.5rem',
                  }}
                >
                  {/* Top row: status + date booked */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <StatusBadge status={b.status} />
                      {b.payment_status === 'paid' && (
                        <span style={{ background: '#d1e7dd', color: '#0a3622', borderRadius: 99, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>
                          ✓ Paid{b.amount_paid ? ` ₹${b.amount_paid}` : ''}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Booked {fmtDate(b.created_at)}
                    </span>
                  </div>

                  {/* Detail grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem 1.25rem', marginBottom: 14 }}>
                    <MetaCell label="Practitioner" value={b.practitioner_type} />
                    <MetaCell label="Mode"         value={b.mode} />
                    <MetaCell label="Date"         value={fmtDate(b.preferred_date)} />
                    <MetaCell label="Time"         value={b.preferred_time} />
                  </div>

                  {b.notes && (
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 14, paddingLeft: 2 }}>
                      "{b.notes}"
                    </p>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {b.status === 'confirmed' && (
                      <Link
                        to={`/consultation/${b.id}?mode=${b.mode}`}
                        className="btn btn-primary btn-sm"
                      >
                        🎥 Join consultation
                      </Link>
                    )}
                    {(b.status === 'confirmed' || b.status === 'completed') && (
                      <Link
                        to={`/consultation/${b.id}/prescription`}
                        className="btn btn-ghost btn-sm"
                      >
                        📋 View prescription
                      </Link>
                    )}
                    {b.status === 'pending' && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                        Awaiting confirmation from our team
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer help text */}
          <p className="muted" style={{ marginTop: '2rem', fontSize: '0.82rem', textAlign: 'center' }}>
            Need help? Contact us at{' '}
            <a href="mailto:support@serenest.in" style={{ color: 'var(--brand-600, #3c4a2c)' }}>
              support@serenest.in
            </a>
            {' '}or{' '}
            <a href="https://wa.me/917777936367" target="_blank" rel="noreferrer" style={{ color: 'var(--brand-600, #3c4a2c)' }}>
              WhatsApp
            </a>.
          </p>
        </div>
      </section>
    </div>
  );
}
