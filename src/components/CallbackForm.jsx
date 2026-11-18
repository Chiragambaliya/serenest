import React, { useState } from 'react';
import { contact } from '../lib/api';
import { trackEvent } from '../lib/analytics';
import {
  canSubmitCallback,
  buildCallbackPayload,
  isIndiaMobile,
  CARE_PHONE_DISPLAY,
  CARE_TEL_HREF,
  careWaHref,
} from '../lib/patientReach';

/**
 * Name + phone callback — the shortest path to a callable patient lead.
 * Does not charge. Does not require finishing /book.
 */
export default function CallbackForm({
  source = 'callback',
  variant = 'light',
  heading = 'Leave your number. We will call you.',
  sub = 'A request, not a charge. We confirm by phone or WhatsApp — you pay after the slot is locked.',
  cta = 'Call me back',
  note,
  id,
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const canSubmit = canSubmitCallback({ name, phone, consent });
  const phoneInvalid = phone.length > 0 && !isIndiaMobile(phone);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || phase === 'saving') return;
    setPhase('saving');
    setErrorMsg('');
    try {
      await contact.send(buildCallbackPayload({
        name,
        phone,
        source,
        note,
      }));
      trackEvent('callback_submitted', { source });
      setPhase('done');
    } catch (err) {
      setPhase('error');
      setErrorMsg(err.message || 'Could not send. Call or WhatsApp us instead.');
    }
  }

  return (
    <div className={`lead-capture lead-capture--${variant}`} id={id}>
      {phase === 'done' ? (
        <div className="lead-capture__done">
          <p className="lead-capture__kicker">Request received</p>
          <h2 className="lead-capture__title">We will call you shortly.</h2>
          <p className="lead-capture__sub">
            Watch WhatsApp and your phone. Prefer not to wait?{' '}
            <a href={CARE_TEL_HREF}>Call {CARE_PHONE_DISPLAY}</a>
            {' · '}
            <a href={careWaHref()} target="_blank" rel="noreferrer">WhatsApp us</a>
          </p>
        </div>
      ) : (
        <>
          <p className="lead-capture__kicker">Callback</p>
          <h2 className="lead-capture__title">{heading}</h2>
          <p className="lead-capture__sub">{sub}</p>
          <form className="lead-capture__form" onSubmit={handleSubmit}>
            <label className="lead-capture__field">
              <span>Full name</span>
              <input
                className="lead-capture__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </label>
            <label className="lead-capture__field">
              <span>Phone (India)</span>
              <span className="lead-capture__phone">
                <span aria-hidden="true">+91</span>
                <input
                  className="lead-capture__input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit number"
                  aria-invalid={phoneInvalid}
                  required
                />
              </span>
              {phoneInvalid ? (
                <span className="lead-capture__hint">Enter a valid 10-digit number starting with 6–9.</span>
              ) : null}
            </label>
            <label className="lead-capture__consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>I consent to being contacted about care. This is not for emergencies.</span>
            </label>
            <button className="lead-capture__submit" type="submit" disabled={!canSubmit || phase === 'saving'}>
              {phase === 'saving' ? 'Sending…' : cta}
            </button>
            {phase === 'error' ? <p className="lead-capture__error">{errorMsg}</p> : null}
          </form>
        </>
      )}
    </div>
  );
}
