import React, { useState } from 'react';
import { subscribers } from '../lib/api';

/**
 * Opt-in email capture. Stores the email in `subscribers` so the team has
 * a contact to reach out to. Honest, consented — not visitor "harvesting".
 */
export default function EmailCapture({ source = 'footer' }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | saving | done | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (state === 'saving') return;
    setState('saving');
    setMessage('');
    try {
      await subscribers.add({ email: email.trim(), source });
      setState('done');
      setMessage('Thanks — you’re on the list.');
      setEmail('');
    } catch (err) {
      setState('error');
      setMessage(err.message || 'Could not subscribe. Please try again.');
    }
  }

  return (
    <form className="email-capture" onSubmit={handleSubmit}>
      <div className="email-capture-title">Get mental-health tips &amp; updates</div>
      <p className="email-capture-sub">
        Occasional, useful emails from Serenest. No spam — unsubscribe anytime.
      </p>
      {state === 'done' ? (
        <p className="email-capture-done">✓ {message}</p>
      ) : (
        <div className="email-capture-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Your email"
            className="email-capture-input"
          />
          <button type="submit" className="btn btn-primary" disabled={state === 'saving'}>
            {state === 'saving' ? 'Saving…' : 'Subscribe'}
          </button>
        </div>
      )}
      {state === 'error' && <p className="email-capture-error">{message}</p>}
    </form>
  );
}
