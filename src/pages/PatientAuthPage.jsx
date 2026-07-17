import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';

export default function PatientAuthPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [searchParams] = useSearchParams();
  const fromQuery = searchParams.get('from');
  const from      = fromQuery || location.state?.from || '/patient/dashboard';

  const { user, loading: authLoading } = useAuth();

  // auth method: 'email' | 'phone'
  const [authMethod, setAuthMethod] = useState('phone');
  const [mode, setMode]             = useState(location.state?.mode ?? 'login'); // login | signup
  const [fullName, setFullName]     = useState('');
  const [phone, setPhone]           = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');

  // OTP state
  const [otpSent, setOtpSent]   = useState(false);
  const [otp, setOtp]           = useState('');

  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [user, authLoading, from, navigate]);

  const isSignup    = mode === 'signup';
  const phoneClean  = phone.replace(/[^\d]/g, '');
  const phoneValid  = phoneClean.length === 10 && /^[6-9]/.test(phoneClean);

  function switchMode(next) { setMode(next); setError(''); setNotice(''); setOtpSent(false); setOtp(''); }
  function switchMethod(m) { setAuthMethod(m); setError(''); setNotice(''); setOtpSent(false); setOtp(''); }

  async function markPatientRole() {
    if (!supabase) return;
    try {
      await supabase.auth.updateUser({ data: { role: 'patient' } });
    } catch {
      // non-fatal — session still works
    }
  }

  // ── Phone OTP: step 1 — send OTP ──────────────────────────────
  async function sendOtp(e) {
    e.preventDefault();
    setError('');
    if (!supabase) { setError('Auth is not available right now.'); return; }
    if (!phoneValid) { setError('Enter a valid 10-digit Indian mobile number.'); return; }
    setBusy(true);
    try {
      const { error: e1 } = await supabase.auth.signInWithOtp({
        phone: `+91${phoneClean}`,
      });
      if (e1) throw e1;
      setOtpSent(true);
      setNotice(`OTP sent to +91 ${phoneClean.replace(/(\d{5})(\d{5})/, '$1 $2')}`);
    } catch (err) {
      setError(err.message || 'Could not send OTP. Try again.');
    } finally {
      setBusy(false);
    }
  }

  // ── Phone OTP: step 2 — verify OTP ────────────────────────────
  async function verifyOtp(e) {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) { setError('Enter the 6-digit code.'); return; }
    setBusy(true);
    try {
      const { error: e2 } = await supabase.auth.verifyOtp({
        phone: `+91${phoneClean}`,
        token: otp,
        type: 'sms',
      });
      if (e2) throw e2;
      await markPatientRole();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  // ── Email + password ──────────────────────────────────────────
  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError('');
    if (!supabase) { setError('Accounts are not available right now.'); return; }
    if (isSignup && fullName.trim().length < 2) { setError('Please enter your full name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setBusy(true);
    try {
      if (isSignup) {
        const { data, error: e1 } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim(), name: fullName.trim(), role: 'patient' } },
        });
        if (e1) throw e1;
        if (data.session) {
          navigate(from, { replace: true });
        } else {
          setNotice('Account created! Check your email to confirm, then log in.');
          switchMode('login');
        }
      } else {
        const { error: e2 } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (e2) throw e2;
        await markPatientRole();
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
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 16 }}>
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>

            {/* ── Method toggle ── */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: '#f4eee4', borderRadius: 12, padding: 4 }}>
              {[
                { id: 'phone', label: '📱 Mobile OTP' },
                { id: 'email', label: '✉️ Email' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => switchMethod(m.id)}
                  style={{
                    flex: 1, padding: '9px 0', border: 'none', borderRadius: 9,
                    fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                    background: authMethod === m.id ? '#fff' : 'transparent',
                    color: authMethod === m.id ? 'var(--text)' : 'var(--text-muted)',
                    boxShadow: authMethod === m.id ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* ── Phone OTP flow ── */}
            {authMethod === 'phone' && (
              <>
                {!otpSent ? (
                  <form onSubmit={sendOtp} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <label className="field">
                      <span className="field-label">Mobile number *</span>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: '#fafafa' }}>
                        <span style={{ padding: '0 12px', fontSize: '0.9rem', color: 'var(--text-muted)', borderRight: '1px solid var(--border)', height: '100%', display: 'flex', alignItems: 'center', background: '#f0f0f0', minHeight: 44 }}>+91</span>
                        <input
                          style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 12px', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }}
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={10}
                          autoComplete="tel"
                          inputMode="numeric"
                        />
                      </div>
                    </label>
                    {error && <AlertBox type="error">{error}</AlertBox>}
                    <button type="submit" className="btn btn-primary btn-full" disabled={busy || !phoneValid}>
                      {busy ? 'Sending…' : 'Send OTP →'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={verifyOtp} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                    {notice && <AlertBox type="success">{notice}</AlertBox>}
                    <label className="field">
                      <span className="field-label">Enter 6-digit OTP *</span>
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
                      {busy ? 'Verifying…' : 'Verify & log in'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtp(''); setNotice(''); setError(''); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'center' }}
                    >
                      ← Change number
                    </button>
                  </form>
                )}
              </>
            )}

            {/* ── Email + password flow ── */}
            {authMethod === 'email' && (
              <form onSubmit={handleEmailSubmit} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                {isSignup && (
                  <label className="field">
                    <span className="field-label">Full name *</span>
                    <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" autoComplete="name" required />
                  </label>
                )}
                <label className="field">
                  <span className="field-label">Email *</span>
                  <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
                </label>
                <label className="field">
                  <span className="field-label">Password *</span>
                  <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={isSignup ? 'new-password' : 'current-password'} />
                </label>
                {error  && <AlertBox type="error">{error}</AlertBox>}
                {notice && <AlertBox type="success">{notice}</AlertBox>}
                <button type="submit" className="btn btn-primary btn-full" disabled={busy}>
                  {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
                </button>
              </form>
            )}

            <p className="muted" style={{ marginTop: 18, fontSize: '0.9rem', textAlign: 'center' }}>
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              <button type="button" onClick={() => switchMode(isSignup ? 'login' : 'signup')}
                style={{ background: 'none', border: 'none', color: 'var(--brand-600, #3c4a2c)', fontWeight: 700, cursor: 'pointer', fontSize: 'inherit' }}>
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>

            <p style={{ textAlign: 'center', marginTop: 8 }}>
              <Link className="muted" to="/book" style={{ fontSize: '0.85rem' }}>Book without an account →</Link>
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
