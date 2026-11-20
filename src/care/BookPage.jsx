import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { bookings, professionals as professionalsApi, payments, health } from '../lib/api';
import { CONSULTATION_MODES } from '../lib/consultationModes';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useAuth } from '../lib/useAuth';
import { trackEvent } from '../lib/analytics';
import { suggestRoleFromScreening } from '../lib/bookingHandoff';
import {
  CARE_PHONE_DISPLAY,
  CARE_TEL_HREF,
  canContinueContactStep,
  careWaHref,
  indiaMobileDigits,
  isIndiaMobile,
} from '../lib/patientReach';
import { SPECIALTY_GROUPS, isSpecialty, specialtyLabel } from './specialties';

function makeSlots() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }),
    };
  });
  return { days, times: ['10:00', '11:30', '13:00', '15:30', '17:00', '19:00'] };
}

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BookPage() {
  useSEO({ path: '/book', ...ROUTE_SEO['/book'] });
  const { user } = useAuth();
  const [params] = useSearchParams();
  const preRole = params.get('prole') || '';
  const suggested = params.get('phq') || params.get('gad')
    ? suggestRoleFromScreening(params.get('phq'), params.get('gad'))
    : '';
  const { days, times } = useMemo(() => makeSlots(), []);

  const [step, setStep] = useState(1);
  const [name, setName] = useState(params.get('name') || '');
  const [phone, setPhone] = useState(params.get('phone') || '');
  const [email, setEmail] = useState(params.get('email') || '');
  const [consent, setConsent] = useState(false);
  const [specialty, setSpecialty] = useState(isSpecialty(preRole) ? preRole : (isSpecialty(suggested) ? suggested : 'general-physician'));
  const [mode, setMode] = useState(['video', 'audio', 'chat'].includes(params.get('mode')) ? params.get('mode') : 'video');
  const [dayKey, setDayKey] = useState(days[0].key);
  const [time, setTime] = useState(times[0]);
  const [proId, setProId] = useState(params.get('pid') || '');
  const [directory, setDirectory] = useState([]);
  const [paymentsOn, setPaymentsOn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    health().then((h) => setPaymentsOn(h.payments === 'enabled')).catch(() => setPaymentsOn(false));
    professionalsApi.directory().then((json) => setDirectory(json.professionals ?? [])).catch(() => setDirectory([]));
  }, []);

  useEffect(() => {
    const digits = indiaMobileDigits(user?.phone || user?.user_metadata?.phone || '');
    if (digits.length === 10) setPhone((prev) => prev || digits);
    const known = user?.user_metadata?.full_name || user?.user_metadata?.name;
    if (known) setName((prev) => prev || known);
  }, [user]);

  const phoneClean = indiaMobileDigits(phone);
  const ready = canContinueContactStep({ name, phone, consent });
  const matches = directory.filter((person) => person.role === specialty);
  const label = specialtyLabel(specialty);

  async function submit(event) {
    event.preventDefault();
    if (!ready || !isSpecialty(specialty)) return;
    setSubmitting(true);
    setError('');
    const bookingData = {
      patient_name: name.trim(),
      patient_phone: phoneClean,
      patient_email: email.trim() || undefined,
      practitioner_type: specialty,
      professional_id: proId || undefined,
      mode,
      preferred_date: dayKey,
      preferred_time: time,
      language: 'English',
      notes: '',
    };
    try {
      if (!paymentsOn) {
        const res = await bookings.create(bookingData);
        setConfirmation(res.booking);
        trackEvent('book_request_submitted', { practitioner_type: specialty, mode, paid: false });
        return;
      }
      const readyPay = await loadRazorpay();
      if (!readyPay) throw new Error('Could not load the payment gateway. Please try again.');
      const order = await payments.order({ professional_id: proId || undefined });
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.key_id,
          amount: order.amount * 100,
          currency: order.currency,
          order_id: order.order_id,
          name: 'Serenest',
          description: `${label} consultation`,
          prefill: { name: name.trim(), contact: phoneClean, email: email.trim() || undefined },
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
              trackEvent('book_request_submitted', { practitioner_type: specialty, mode, paid: true });
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled — you have not been charged.')) },
        });
        rzp.open();
      });
    } catch (err) {
      setError(err.message || 'Could not send your request.');
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div className="care-shell care-ok">
        <p className="care-kicker">Request received</p>
        <h1>We will confirm your {label.toLowerCase()} appointment.</h1>
        <p>Reference {String(confirmation.id || '').slice(0, 8).toUpperCase()}. You have not been charged.</p>
        <div className="care-actions">
          <a className="care-btn care-btn--primary" href={careWaHref(`Hi, I requested a ${label} appointment.`)}>WhatsApp us</a>
          <Link className="care-btn care-btn--ghost" to="/">Back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="care-shell">
      <section className="care-section">
        <p className="care-kicker">Book · step {step} of 2</p>
        <h2>{step === 1 ? 'How can we reach you?' : 'Choose the specialist and a time.'}</h2>
        <p>
          <a href={CARE_TEL_HREF}>Call {CARE_PHONE_DISPLAY}</a>
          {' · '}
          <a href={careWaHref()} target="_blank" rel="noreferrer">WhatsApp</a>
        </p>
      </section>
      <form className="care-form" onSubmit={submit}>
        {step === 1 && (
          <>
            <label className="care-field">
              <span>Full name</span>
              <input className="care-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>
            <label className="care-field">
              <span>Phone (India)</span>
              <input className="care-input" value={phone} inputMode="numeric" onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" />
            </label>
            {!isIndiaMobile(phone) && phone.length > 0 && <p className="care-error">Enter a 10-digit Indian mobile number.</p>}
            <label className="care-field">
              <span>Email (optional)</span>
              <input className="care-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="care-field">
              <span>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> I agree to be contacted about this appointment. This is not for emergencies.
              </span>
            </label>
            <button className="care-btn care-btn--primary" type="button" disabled={!ready} onClick={() => setStep(2)}>Continue</button>
          </>
        )}
        {step === 2 && (
          <>
            <label className="care-field">
              <span>Specialist</span>
              <select className="care-select" value={specialty} onChange={(e) => { setSpecialty(e.target.value); setProId(''); }}>
                {SPECIALTY_GROUPS.map((group) => (
                  <optgroup key={group.id} label={group.label}>
                    {group.specialties.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            {matches.length > 0 && (
              <label className="care-field">
                <span>Clinician (optional)</span>
                <select className="care-select" value={proId} onChange={(e) => setProId(e.target.value)}>
                  <option value="">Match me with whoever is available</option>
                  {matches.map((person) => (
                    <option key={person.id} value={person.id}>{person.full_name}{person.fee_inr ? ` · ₹${person.fee_inr}` : ''}</option>
                  ))}
                </select>
              </label>
            )}
            <div className="care-field">
              <span>Mode</span>
              <div className="care-choice">
                {CONSULTATION_MODES.map((item) => (
                  <button type="button" key={item.id} className={mode === item.id ? 'is-on' : ''} onClick={() => setMode(item.id)}>{item.label}</button>
                ))}
              </div>
            </div>
            <div className="care-field">
              <span>Day</span>
              <div className="care-choice">
                {days.map((day) => (
                  <button type="button" key={day.key} className={dayKey === day.key ? 'is-on' : ''} onClick={() => setDayKey(day.key)}>{day.label}</button>
                ))}
              </div>
            </div>
            <div className="care-field">
              <span>Time</span>
              <div className="care-choice">
                {times.map((slot) => (
                  <button type="button" key={slot} className={time === slot ? 'is-on' : ''} onClick={() => setTime(slot)}>{slot}</button>
                ))}
              </div>
            </div>
            {error && <p className="care-error">{error}</p>}
            <div className="care-actions">
              <button className="care-btn care-btn--ghost" type="button" onClick={() => setStep(1)}>Back</button>
              <button className="care-btn care-btn--primary" type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send request'}</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
