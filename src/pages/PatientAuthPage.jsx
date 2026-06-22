import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';

export default function PatientAuthPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from ?? '/patient/dashboard';

  const { user, loading: authLoading } = useAuth();

  const [mode, setMode]         = useState(location.state?.mode ?? 'login'); // login | signup
  const [fullName, setFullName] = useState('');
  const [phone, setPhone]       = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState('');
  const [notice, setNotice]     = useState('');

  // Already logged in — go straight to dashboard.
  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [user, authLoading, from, navigate]);

  const isSignup     = mode === 'signup';
  const phoneClean   = phone.replace(/[^\d]/g, '');
  const phoneValid   = !phone || (phoneClean.length === 10 && /^[6-9]/.test(phoneClean));

  function switchMode(next) {
    setMode(next);
    setError('');
    setNotice('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!supabase) {
      setError('Accounts are not available right now. Please try again later.');
      return;
    }
    if (isSignup) {
      if (fullName.trim().length < 2) { setError('Please enter your full name.'); return; }
      if (phone && !phoneValid)       { setError('Enter a valid 10-digit Indian mobile number.'); return; }
    }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setBusy(true);
    try {
      if (isSignup) {
        const { data, error: e1 } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              name:      fullName.trim(), // used by DB trigger → patients.name
              phone:     phoneClean || undefined,
              role:      'patient',
            },
          },
        });
        if (e1) throw e1;
        if (data.session) {
          navigate(from, { replace: true });
        } else {
          setNotice('Account created! Check your email to confirm, then log in.');
          switchMode('login');
        }
      } else {
        const { error: e2 } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (e2) throw e2;
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section">
        <div className="container" style={{ maxWidth: 460 }}>
          <div className="tile" style={{ padding: '2rem' }}>
            <p className="kicker" style={{ marginBottom: 6 }}>Patient portal</p>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="muted" style={{ marginBottom: 20, fontSize: '0.92rem' }}>
              {isSignup
                ? 'Sign up to track your appointments and view prescriptions.'
                : 'Log in to view your bookings and health records.'}
            </p>

            <form onSubmit={handleSubmit} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
              {isSignup && (
                <>
                  <label className="field">
                    <span className="field-label">Full name *</span>
                    <input
                      className="input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="field">
                    <span className="field-label">Mobile number <span className="muted">(optional)</span></span>
                    <input
                      className="input"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit Indian mobile"
                      autoComplete="tel"
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Helps match bookings you made before signing up.
                    </span>
                  </label>
                </>
              )}

              <label className="field">
                <span className="field-label">Email *</span>
                <input
                  className="input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
              <label className="field">
                <span className="field-label">Password *</span>
                <input
                  className="input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
              </label>

              {error && (
                <div style={{ background: '#fdecea', border: '1px solid #f5c2c0', color: '#a02622', borderRadius: 10, padding: '10px 12px', fontSize: '0.88rem' }}>
                  {error}
                </div>
              )}
              {notice && (
                <div style={{ background: '#e7f4ec', border: '1px solid #b6dcc4', color: '#1d6b3f', borderRadius: 10, padding: '10px 12px', fontSize: '0.88rem' }}>
                  {notice}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full" disabled={busy}>
                {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
              </button>
            </form>

            <p className="muted" style={{ marginTop: 18, fontSize: '0.9rem', textAlign: 'center' }}>
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => switchMode(isSignup ? 'login' : 'signup')}
                style={{ background: 'none', border: 'none', color: 'var(--brand-600, #3c4a2c)', fontWeight: 700, cursor: 'pointer', fontSize: 'inherit' }}
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>

            <p style={{ textAlign: 'center', marginTop: 8 }}>
              <Link className="muted" to="/book" style={{ fontSize: '0.85rem' }}>
                Book without an account →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
