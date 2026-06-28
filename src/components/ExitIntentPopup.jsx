import React, { useEffect, useState, useRef } from 'react';
import { subscribers } from '../lib/api';

const SESSION_KEY = 'serenest_exit_shown';
const STORAGE_KEY = 'serenest_exit_ts';
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function shouldShow() {
  if (sessionStorage.getItem(SESSION_KEY)) return false;
  const last = localStorage.getItem(STORAGE_KEY);
  if (last && Date.now() - Number(last) < COOLDOWN_MS) return false;
  return true;
}

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('idle'); // idle | saving | done | error
  const [errorMsg, setErrorMsg] = useState('');
  const fired = useRef(false);

  function open() {
    if (fired.current || !shouldShow()) return;
    fired.current = true;
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, '1');
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }

  function close() {
    setVisible(false);
  }

  useEffect(() => {
    if (!shouldShow()) return;

    // Desktop: mouse leaving toward browser chrome
    function onMouseLeave(e) {
      if (e.clientY <= 8) open();
    }
    document.addEventListener('mouseleave', onMouseLeave);

    // Mobile / fallback: 30s idle
    const fallback = setTimeout(open, 30_000);

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      clearTimeout(fallback);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (phase === 'saving') return;
    setPhase('saving');
    setErrorMsg('');
    try {
      await subscribers.add({ email: email.trim(), source: 'exit_intent' });
      setPhase('done');
    } catch (err) {
      setPhase('error');
      setErrorMsg(err.message || 'Could not save. Please try again.');
    }
  }

  if (!visible) return null;

  return (
    <div className="eip-backdrop" role="dialog" aria-modal="true" aria-label="Before you go" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="eip-card">
        <button className="eip-close" onClick={close} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <div className="eip-icon" aria-hidden="true">
          <svg viewBox="0 0 56 56" fill="none" width="56" height="56">
            <circle cx="28" cy="28" r="28" fill="#f0fdf4" />
            <path d="M28 16c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z" fill="#bbf7d0" />
            <path d="M28 20v8l5 3" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {phase === 'done' ? (
          <div className="eip-success">
            <div className="eip-success-icon" aria-hidden="true">✓</div>
            <h2 className="eip-title">You're on the list</h2>
            <p className="eip-sub">We'll send you occasional mental health insights — no spam, unsubscribe anytime.</p>
            <button className="eip-btn" onClick={close}>Close</button>
          </div>
        ) : (
          <>
            <p className="eip-eyebrow">Before you go</p>
            <h2 className="eip-title">Get our free mental wellness guide</h2>
            <p className="eip-sub">
              Practical strategies for anxiety, sleep, and mood — written by Serenest's clinical team and sent straight to your inbox.
            </p>
            <form className="eip-form" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                className="eip-input"
                placeholder="your@email.com"
                aria-label="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="eip-btn" disabled={phase === 'saving'}>
                {phase === 'saving' ? 'Sending…' : 'Send me the guide'}
              </button>
            </form>
            {phase === 'error' && <p className="eip-error">{errorMsg}</p>}
            <button className="eip-skip" onClick={close}>No thanks, I'll skip</button>
          </>
        )}
      </div>
    </div>
  );
}
