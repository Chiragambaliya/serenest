import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { bookings, professionals as professionalsApi, payments, health } from '../lib/api';
import { CONSULTATION_MODES } from '../lib/consultationModes';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useAuth } from '../lib/useAuth';
import { trackEvent } from '../lib/analytics';
import { screeningNote, suggestRoleFromScreening } from '../lib/bookingHandoff';
import {
  CARE_PHONE_DISPLAY,
  CARE_TEL_HREF,
  canContinueContactStep,
  careWaHref,
  formatSlotTime,
  indiaMobileDigits,
  isIndiaMobile,
  isPatientNameValid,
  patientReasonById,
  upcomingSlots,
} from '../lib/patientReach';

const DEFAULT_FEE_INR = 499;

const PRACTITIONER_TYPES = [
  { id: 'psychiatrist', label: 'Psychiatrist' },
  { id: 'psychologist', label: 'Psychologist' },
  { id: 'therapist', label: 'Therapist' },
  { id: 'counsellor', label: 'Counsellor' },
];

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/** Keep a pasted +91 or leading 0 down to the 10 digits the patient is typing. */
function phoneInputDigits(value) {
  const d = String(value || '').replace(/\D/g, '');
  if (d.length > 10 && d.startsWith('91')) return d.slice(2, 12);
  if (d.startsWith('0')) return d.replace(/^0+/, '').slice(0, 10);
  return d.slice(0, 10);
}

export default function BookingPage() {
  useSEO({ path: '/book', ...ROUTE_SEO['/book'] });
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preProId = searchParams.get('pid') ?? '';
  const preProName = searchParams.get('pname') ?? '';
  const preProRole = searchParams.get('prole') ?? '';
  const preProLabel = searchParams.get('prolabel') ?? '';
  const preProFee = searchParams.get('pfee') ?? '';
  const preProDur = searchParams.get('pduration') ?? '';
  const preMode = searchParams.get('mode') ?? '';
  const preLang = searchParams.get('lang') ?? '';
  const preName = searchParams.get('name') ?? '';
  const prePhone = searchParams.get('phone') ?? '';
  const preEmail = searchParams.get('email') ?? '';
  const prePhq = searchParams.get('phq') ?? '';
  const preGad = searchParams.get('gad') ?? '';
  const prePhqSev = searchParams.get('phqsev') ?? '';
  const preGadSev = searchParams.get('gadsev') ?? '';
  const preTool = searchParams.get('tool') ?? '';
  const preScore = searchParams.get('score') ?? '';
  const preBand = searchParams.get('band') ?? '';
  const hasPro = Boolean(preProName);
  const visitReason = patientReasonById(searchParams.get('reason'));

  const suggestedRole = preProRole
    || (prePhq || preGad ? suggestRoleFromScreening(prePhq, preGad) : '')
    || visitReason?.practitioner
    || '';

  const handoffNote = useMemo(
    () => screeningNote({
      phq: prePhq, gad: preGad, phqSev: prePhqSev, gadSev: preGadSev,
      tool: preTool, score: preScore, band: preBand,
    }),
    [prePhq, preGad, prePhqSev, preGadSev, preTool, preScore, preBand],
  );

  const startingNote = [visitReason?.note, handoffNote].filter(Boolean).join(' ');

  const slots = useMemo(() => upcomingSlots(new Date()), []);
  const [practitionerType, setPractitionerType] = useState(
    PRACTITIONER_TYPES.some((t) => t.id === suggestedRole) ? suggestedRole : 'psychiatrist',
  );
  const [mode, setMode] = useState(
    ['video', 'audio', 'chat'].includes(preMode) ? preMode : 'video',
  );
  const [dayKey, setDayKey] = useState(slots[0]?.key ?? '');
  const [time, setTime] = useState(slots[0]?.times[0] ?? '10:00');

  const [directory, setDirectory] = useState([]);
  const [selectedProId, setSelectedProId] = useState('');

  const [name, setName] = useState(preName);
  const [phone, setPhone] = useState(phoneInputDigits(prePhone));
  const [email, setEmail] = useState(preEmail);
  const [language, setLanguage] = useState(preLang || 'English');
  const [note, setNote] = useState(startingNote);
  const [consent, setConsent] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(Boolean(preEmail));

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [contactHint, setContactHint] = useState('');
  const [paymentsOn, setPaymentsOn] = useState(false);
  const [patientEmailOn, setPatientEmailOn] = useState(false);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const consentRef = useRef(null);

  useEffect(() => {
    if (hasPro) return undefined;
    let cancelled = false;
    professionalsApi
      .directory()
      .then((json) => {
        if (!cancelled) setDirectory(json.professionals ?? []);
      })
      .catch(() => {
        if (!cancelled) setDirectory([]);
      });
    return () => { cancelled = true; };
  }, [hasPro]);

  const directoryForType = useMemo(
    () => directory.filter((p) => p.role === practitionerType),
    [directory, practitionerType],
  );

  const selectedPro = useMemo(
    () => directoryForType.find((p) => p.id === selectedProId) ?? null,
    [directoryForType, selectedProId],
  );

  useEffect(() => {
    setSelectedProId('');
  }, [practitionerType]);

  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata || {};
    const full = meta.full_name || meta.name || '';
    setName((prev) => prev || full);
    setEmail((prev) => prev || user.email || '');
    const digits = phoneInputDigits(meta.phone || user.phone || '');
    if (digits.length === 10) setPhone((prev) => prev || digits);
  }, [user]);

  useEffect(() => {
    health()
      .then((h) => {
        setPaymentsOn(h.payments === 'enabled');
        setPatientEmailOn(h.patient_email === 'enabled');
      })
      .catch(() => {
        setPaymentsOn(false);
        setPatientEmailOn(false);
      });
  }, []);

  const activeDay = slots.find((day) => day.key === dayKey) ?? slots[0];
  const dayLabel = activeDay?.label ?? '';
  const selectedTypeLabel = PRACTITIONER_TYPES.find((t) => t.id === practitionerType)?.label ?? 'Psychiatrist';
  const selectedModeLabel = CONSULTATION_MODES.find((m) => m.id === mode)?.label ?? 'Video';
  const phoneClean = indiaMobileDigits(phone);
  const isPhoneValid = isIndiaMobile(phone);
  const nameMissing = !isPatientNameValid(name);
  const ready = canContinueContactStep({ name, phone, consent });
  const showNameError = Boolean(contactHint) && nameMissing;
  const showPhoneError = Boolean(contactHint) && !isPhoneValid;
  const showConsentError = Boolean(contactHint) && !consent;
  const timeLabel = formatSlotTime(time);

  const payAmount = hasPro
    ? (Number(preProFee) || DEFAULT_FEE_INR)
    : (Number(selectedPro?.fee_inr) || DEFAULT_FEE_INR);

  const clinicianName = hasPro ? preProName : (selectedPro?.full_name ?? '');

  function chooseDay(key) {
    const day = slots.find((item) => item.key === key);
    setDayKey(key);
    if (day && !day.times.includes(time)) setTime(day.times[0]);
  }

  function explainGap() {
    if (nameMissing) {
      setContactHint('Add your name so we know who to call.');
      nameRef.current?.focus();
      return false;
    }
    if (!isPhoneValid) {
      setContactHint('Enter a 10-digit mobile number starting with 6–9.');
      phoneRef.current?.focus();
      return false;
    }
    if (!consent) {
      setContactHint('Tick the box so we can contact you about this appointment.');
      consentRef.current?.focus();
      return false;
    }
    setContactHint('');
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    if (!explainGap()) return;

    setSubmitError(null);
    setSubmitting(true);

    const bookingData = {
      patient_name: name.trim(),
      patient_phone: phoneClean,
      patient_email: email.trim() || undefined,
      practitioner_type: practitionerType,
      ...(hasPro && { professional_id: preProId, professional_name: preProName }),
      ...(!hasPro && selectedProId && { professional_id: selectedProId, professional_name: selectedPro?.full_name }),
      mode,
      preferred_date: dayKey,
      preferred_time: time,
      language,
      notes: note.trim(),
    };

    try {
      if (!paymentsOn) {
        const res = await bookings.create(bookingData);
        setConfirmation(res.booking);
        trackEvent('book_request_submitted', { practitioner_type: practitionerType, mode, paid: false });
        return;
      }

      const razorpayReady = await loadRazorpay();
      if (!razorpayReady) throw new Error('Could not load the payment gateway. Please try again.');

      const proId = hasPro ? preProId : (selectedProId || undefined);
      const order = await payments.order({ professional_id: proId });

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.key_id,
          amount: order.amount * 100,
          currency: order.currency,
          order_id: order.order_id,
          name: 'Serenest',
          description: `${selectedTypeLabel} consultation`,
          prefill: {
            name: name.trim(),
            contact: phoneClean,
            email: email.trim() || undefined,
          },
          theme: { color: '#3c4a2c' },
          handler: async (resp) => {
            try {
              const res = await bookings.create({
                ...bookingData,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              });
              setConfirmation(res.booking);
              trackEvent('book_request_submitted', { practitioner_type: practitionerType, mode, paid: true });
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled — you have not been charged.')),
          },
        });
        rzp.on('payment.failed', (e) => {
          reject(new Error(e?.error?.description || 'Payment failed. Please try again — you have not been charged.'));
        });
        rzp.open();
      });
    } catch (err) {
      setSubmitError(err.message || 'Could not complete your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const whenPhrase = dayLabel === 'Today' || dayLabel === 'Tomorrow' ? dayLabel.toLowerCase() : dayLabel;
  const waText = clinicianName
    ? `Hi, I'd like a session with ${clinicianName} ${whenPhrase} at ${timeLabel}.`
    : `Hi, I'd like a ${selectedTypeLabel.toLowerCase()} session ${whenPhrase} at ${timeLabel}.`;

  return (
    <div className="book-easy">
      <div className="book-easy__card">
        {confirmation ? (
          <div className="booking-success">
            <div className="booking-success__mark" aria-hidden="true">✓</div>
            <h1>Request received</h1>
            <p className="booking-success__lead">
              Thank you, <strong>{name.split(' ')[0]}</strong>. We have your request for a{' '}
              <strong>{selectedTypeLabel.toLowerCase()}</strong> {selectedModeLabel.toLowerCase()} session
              {clinicianName ? <> with <strong>{clinicianName}</strong></> : null}
              {' '}
              {dayLabel === 'Today' || dayLabel === 'Tomorrow'
                ? <strong>{dayLabel.toLowerCase()}</strong>
                : <>on <strong>{dayLabel}</strong></>}
              {' '}at <strong>{timeLabel}</strong>.
            </p>
            <div className="booking-success__ref">
              <span>Booking reference</span>
              <strong>{confirmation.id?.slice(0, 8).toUpperCase()}</strong>
            </div>
            <p className="booking-success__lead">
              {confirmation.status === 'confirmed'
                ? 'Your session is confirmed. Join from your patient dashboard at the booked time.'
                : <>We will call or WhatsApp <strong>+91 {phoneClean}</strong> to lock the time. You do not pay until then.</>}
            </p>
            <div className="booking-success__actions">
              <a className="btn btn-primary" href={careWaHref(`Hi, I just requested a session (Ref: ${confirmation.id?.slice(0, 8).toUpperCase()})`)} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
              {confirmation.status === 'confirmed' && (
                <Link className="btn btn-ghost" to={`/consultation/${confirmation.id}?mode=${mode}`}>
                  Open consultation room
                </Link>
              )}
              <Link className="btn btn-ghost" to="/">Back to home</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="book-easy__kicker">No payment on this form</p>
            <h1>{hasPro ? `Request ${preProName}` : 'Request an appointment'}</h1>
            <p className="book-easy__lead">
              {hasPro
                ? `${preProLabel || selectedTypeLabel}${preProFee ? ` · ₹${preProFee}` : ''}${preProDur ? ` · ${preProDur} min` : ''}. Add your name and number. We confirm by phone or WhatsApp.`
                : 'Your name and mobile number are enough. The next open time is already chosen.'}
            </p>

            {visitReason && (
              <p className="book-easy__reason">
                You are requesting care for <strong>{visitReason.label}</strong>.
                The clinician type is already set — change it if you want someone else.
              </p>
            )}

            {handoffNote && (
              <div className="callout book-easy__note">
                <div className="callout-title">From your check-in</div>
                <p>{handoffNote}</p>
              </div>
            )}

            <form className="book-easy__form" onSubmit={handleSubmit} noValidate>
              <div className="book-easy__identity">
                <label className={`field ${showNameError ? 'booking-field--invalid' : ''}`}>
                  <span className="field-label">Your name</span>
                  <input
                    ref={nameRef}
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    autoComplete="name"
                    autoFocus
                    aria-invalid={showNameError}
                  />
                </label>
                <label className={`field ${showPhoneError ? 'booking-field--invalid' : ''}`}>
                  <span className="field-label">Mobile number</span>
                  <div className="input-row">
                    <span className="input-prefix">+91</span>
                    <input
                      ref={phoneRef}
                      className="input"
                      value={phone}
                      onChange={(e) => setPhone(phoneInputDigits(e.target.value))}
                      placeholder="10-digit number"
                      inputMode="numeric"
                      autoComplete="tel"
                      aria-invalid={showPhoneError}
                    />
                  </div>
                </label>
              </div>

              <p className="book-easy__recap">
                {selectedTypeLabel}
                {clinicianName ? ` · ${clinicianName}` : ''}
                {` · ${selectedModeLabel} · ${dayLabel} · ${timeLabel}`}
                {paymentsOn ? '' : '. You pay after we confirm.'}
              </p>

              <details
                className="book-easy__more"
                open={changeOpen}
                onToggle={(event) => setChangeOpen(event.currentTarget.open)}
              >
                <summary>Change time or clinician</summary>
                <div className="book-easy__more-body">
                  {!hasPro && (
                    <fieldset className="book-easy__set">
                      <legend>Who</legend>
                      <div className="book-easy__chips">
                        {PRACTITIONER_TYPES.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            className={`book-chip ${practitionerType === type.id ? 'is-selected' : ''}`}
                            aria-pressed={practitionerType === type.id}
                            onClick={() => setPractitionerType(type.id)}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  <fieldset className="book-easy__set">
                    <legend>How</legend>
                    <div className="book-easy__chips">
                      {CONSULTATION_MODES.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`book-chip ${mode === item.id ? 'is-selected' : ''}`}
                          aria-pressed={mode === item.id}
                          onClick={() => setMode(item.id)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="book-easy__set">
                    <legend>When</legend>
                    <div className="book-easy__days" role="listbox" aria-label="Day">
                      {slots.map((day) => (
                        <button
                          key={day.key}
                          type="button"
                          className={`book-chip book-chip--day ${dayKey === day.key ? 'is-selected' : ''}`}
                          aria-pressed={dayKey === day.key}
                          onClick={() => chooseDay(day.key)}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    <div className="book-easy__chips" role="listbox" aria-label="Time">
                      {(activeDay?.times ?? []).map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`book-chip ${time === slot ? 'is-selected' : ''}`}
                          aria-pressed={time === slot}
                          onClick={() => setTime(slot)}
                        >
                          {formatSlotTime(slot)}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </details>

              <details
                className="book-easy__more"
                open={moreOpen}
                onToggle={(event) => setMoreOpen(event.currentTarget.open)}
              >
                <summary>Email, language, or a note</summary>
                <div className="book-easy__more-body">
                  <label className="field">
                    <span className="field-label">Email (optional)</span>
                    <input
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                    <span className="field-hint">
                      {patientEmailOn
                        ? 'If you add one, we can email a short confirmation.'
                        : 'Optional. We confirm on WhatsApp or phone.'}
                    </span>
                  </label>
                  <label className="field">
                    <span className="field-label">Language</span>
                    <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Gujarati</option>
                    </select>
                  </label>
                  {!hasPro && directoryForType.length > 0 && (
                    <label className="field">
                      <span className="field-label">A specific clinician (optional)</span>
                      <select
                        className="input"
                        value={selectedProId}
                        onChange={(e) => setSelectedProId(e.target.value)}
                      >
                        <option value="">Any available</option>
                        {directoryForType.map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.full_name}
                            {person.fee_inr ? ` · ₹${person.fee_inr}` : ''}
                            {person.city ? ` · ${person.city}` : ''}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="field">
                    <span className="field-label">Note (optional)</span>
                    <textarea
                      className="input textarea"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What would you like help with?"
                      rows={3}
                    />
                  </label>
                </div>
              </details>

              <label className={`book-easy__consent ${showConsentError ? 'booking-field--invalid' : ''}`}>
                <input
                  ref={consentRef}
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>I agree to be contacted about this appointment. This is not for emergencies.</span>
              </label>

              {contactHint && !ready && (
                <p className="booking-gate" role="alert">{contactHint}</p>
              )}
              {submitError && (
                <p className="booking-gate" role="alert">{submitError}</p>
              )}

              <button className="book-easy__submit" type="submit" disabled={submitting}>
                {submitting
                  ? (paymentsOn ? 'Opening payment…' : 'Sending…')
                  : (paymentsOn ? `Pay ₹${payAmount} and confirm` : 'Request appointment')}
              </button>
            </form>

            <p className="book-easy__alt">
              Rather talk now?{' '}
              <a href={CARE_TEL_HREF}>Call {CARE_PHONE_DISPLAY}</a>
              {' · '}
              <a href={careWaHref(waText)} target="_blank" rel="noreferrer">WhatsApp</a>
              {!user && (
                <>
                  {' · '}
                  <Link to="/patient/login?from=%2Fbook">Sign in</Link>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
