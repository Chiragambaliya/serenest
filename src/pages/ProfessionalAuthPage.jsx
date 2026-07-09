import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';

/**
 * Professional login — passwordless magic link.
 *
 * A professional signs in with the same email she used to apply. We email a
 * secure sign-in link (works with Supabase's default email template, so no
 * extra configuration is needed). Being a Supabase auth user grants nothing on
 * its own — the server only returns a profile if that email matches an
 * *approved* professional_applications row.
 */
export default function ProfessionalAuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? '/professionals/portal';
  const academyFree = typeof from === 'string' && from.startsWith('/academy');

  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [user, authLoading, from, navigate]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function sendLink(e) {
    e.preventDefault();
    setError('');
    if (!supabase) { setError('Login is not available right now.'); return; }
    if (!emailValid) { setError('Enter a valid email address.'); return; }
    setBusy(true);
    try {
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}${academyFree ? from : '/professionals/portal'}`
          : undefined;
      const { error: e1 } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true, emailRedirectTo: redirectTo },
      });
      if (e1) throw e1;
      setSent(true);
    } catch (err) {
      setError(err.message || 'Could not send the sign-in link. Please try again.');
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

            {!sent ? (
              <>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>
                  {academyFree ? 'Free Academy access' : 'Sign in to your profile'}
                </h1>
                <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 20 }}>
                  {academyFree
                    ? 'Approved Serenest professionals get Serenest Academy free. Use the email you applied with — we\'ll send a secure sign-in link.'
                    : 'Use the email you applied with. We\'ll email you a secure sign-in link — no password needed.'}
                </p>

                <form onSubmit={sendLink} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
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
                    {busy ? 'Sending…' : 'Email me a sign-in link →'}
                  </button>
                </form>

                <p className="muted" style={{ marginTop: 18, fontSize: '0.9rem', textAlign: 'center' }}>
                  Not a Serenest professional yet?{' '}
                  <Link to="/professionals/apply" style={{ color: 'var(--brand-600, #3c4a2c)', fontWeight: 700 }}>
                    Apply to join
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '2.4rem', marginBottom: 10 }} aria-hidden>✉️</div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Check your inbox</h1>
                <p className="muted" style={{ fontSize: '0.92rem', marginBottom: 18, lineHeight: 1.55 }}>
                  We sent a sign-in link to <strong style={{ color: 'var(--text)' }}>{email.trim()}</strong>.
                  Open the email and tap the link to access your profile. The link expires shortly, so use it soon.
                </p>
                <AlertBox type="info">
                  Didn&rsquo;t get it? Check spam, make sure this is the email you applied with, then try again.
                </AlertBox>
                <button
                  type="button"
                  onClick={() => { setSent(false); setError(''); }}
                  className="btn btn-ghost btn-full"
                  style={{ marginTop: 14 }}
                >
                  ← Use a different email
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function AlertBox({ type, children }) {
  const styles = {
    error: { background: '#fdecea', border: '1px solid #f5c2c0', color: '#a02622' },
    info:  { background: '#eef4fb', border: '1px solid #cfe0f2', color: '#234a72' },
  };
  return (
    <div style={{ ...styles[type], borderRadius: 10, padding: '10px 12px', fontSize: '0.88rem' }}>
      {children}
    </div>
  );
}
