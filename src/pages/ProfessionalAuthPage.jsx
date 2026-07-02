import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';

/**
 * Professional login — email OTP.
 *
 * A professional signs in with the same email she used to apply. Being a
 * Supabase auth user grants nothing on its own; the server only returns a
 * profile if that email matches an *approved* professional_applications row.
 */
export default function ProfessionalAuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? '/professionals/portal';

  const { user, loading: authLoading } = useAuth();

  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState('');
  const [notice, setNotice]   = useState('');

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [user, authLoading, from, navigate]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function sendOtp(e) {
    e.preventDefault();
    setError('');
    if (!supabase) { setError('Login is not available right now.'); return; }
    if (!emailValid) { setError('Enter a valid email address.'); return; }
    setBusy(true);
    try {
      const { error: e1 } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      });
      if (e1) throw e1;
      setOtpSent(true);
      setNotice(`We sent a 6-digit code to ${email.trim()}`);
    } catch (err) {
      setError(err.message || 'Could not send the code. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) { setError('Enter the 6-digit code.'); return; }
    setBusy(true);
    try {
      const { error: e2 } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp,
        type: 'email',
      });
      if (e2) throw e2;
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please try again.');
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
            <p className="kicker" style={{ marginBottom: 6 }}>Professional portal</p>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>
              Sign in to your profile
            </h1>
            <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 20 }}>
              Use the email address you applied with. We&rsquo;ll email you a one-time code.
            </p>

            {!otpSent ? (
              <form onSubmit={sendOtp} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <label className="field">
                  <span className="field-label">Email *</span>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>
                {error && <AlertBox type="error">{error}</AlertBox>}
                <button type="submit" className="btn btn-primary btn-full" disabled={busy || !emailValid}>
                  {busy ? 'Sending…' : 'Send code →'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                {notice && <AlertBox type="success">{notice}</AlertBox>}
                <label className="field">
                  <span className="field-label">Enter 6-digit code *</span>
                  <input
                    className="input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="_ _ _ _ _ _"
                    autoFocus
                    style={{ fontSize: '1.4rem', letterSpacing: '0.3em', textAlign: 'center' }}
                  />
                </label>
                {error && <AlertBox type="error">{error}</AlertBox>}
                <button type="submit" className="btn btn-primary btn-full" disabled={busy || otp.length !== 6}>
                  {busy ? 'Verifying…' : 'Verify & sign in'}
                </button>
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(''); setNotice(''); setError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'center' }}
                >
                  ← Change email
                </button>
              </form>
            )}

            <p className="muted" style={{ marginTop: 18, fontSize: '0.9rem', textAlign: 'center' }}>
              Not a Serenest professional yet?{' '}
              <Link to="/professionals/apply" style={{ color: 'var(--brand-600, #3c4a2c)', fontWeight: 700 }}>
                Apply to join
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AlertBox({ type, children }) {
  const styles = {
    error:   { background: '#fdecea', border: '1px solid #f5c2c0', color: '#a02622' },
    success: { background: '#e7f4ec', border: '1px solid #b6dcc4', color: '#1d6b3f' },
  };
  return (
    <div style={{ ...styles[type], borderRadius: 10, padding: '10px 12px', fontSize: '0.88rem' }}>
      {children}
    </div>
  );
}
