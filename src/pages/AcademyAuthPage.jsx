import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ROLES = [
  'Psychology student',
  'Fresh graduate',
  'Counsellor',
  'Psychologist',
  'Psychiatry resident',
  'Mental health professional',
  'Researcher',
  'Other',
];

export default function AcademyAuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signup'); // signup | login
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const isSignup = mode === 'signup';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!supabase) {
      setError('Accounts are not available right now. Please try again later.');
      return;
    }
    if (isSignup && fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      if (isSignup) {
        const { data, error: e1 } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim(), role } },
        });
        if (e1) throw e1;
        if (data.session) {
          navigate('/academy');
        } else {
          setNotice('Account created. Please check your email to confirm, then log in.');
          setMode('login');
        }
      } else {
        const { error: e2 } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (e2) throw e2;
        navigate('/academy');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <section className="section">
        <div className="container" style={{ maxWidth: 460 }}>
          <div className="tile" style={{ padding: '2rem' }}>
            <p className="kicker" style={{ marginBottom: 6 }}>Serenest Academy</p>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>
              {isSignup ? 'Create your learner account' : 'Welcome back'}
            </h1>
            <p className="muted" style={{ marginBottom: 20, fontSize: '0.92rem' }}>
              {isSignup
                ? 'Join Serenest Academy to register for programs and updates.'
                : 'Log in to your Serenest Academy account.'}
            </p>

            <form onSubmit={handleSubmit} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
              {isSignup && (
                <>
                  <label className="field">
                    <span className="field-label">Full name</span>
                    <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" autoComplete="name" />
                  </label>
                  <label className="field">
                    <span className="field-label">I am a…</span>
                    <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                      {ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </label>
                </>
              )}
              <label className="field">
                <span className="field-label">Email</span>
                <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
              </label>
              <label className="field">
                <span className="field-label">Password</span>
                <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={isSignup ? 'new-password' : 'current-password'} />
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
                onClick={() => { setMode(isSignup ? 'login' : 'signup'); setError(''); setNotice(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--brand-600, #3c4a2c)', fontWeight: 700, cursor: 'pointer' }}
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>

            <p style={{ textAlign: 'center', marginTop: 8 }}>
              <Link className="muted" to="/" style={{ fontSize: '0.85rem' }}>← Back to home</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
