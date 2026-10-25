import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { bookings, professionals as professionalsApi, payments, health, assistant } from '../lib/api';
import { CONSULTATION_MODES } from '../lib/consultationModes';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useAuth } from '../lib/useAuth';
import { trackEvent } from '../lib/analytics';
import { screeningNote, suggestRoleFromScreening } from '../lib/bookingHandoff';
import DpdpConsentNotice from '../components/DpdpConsentNotice';
import {
  BOOKING_STEPS,
  CARE_PHONE_DISPLAY,
  CARE_TEL_HREF,
  canContinueContactStep,
  careWaHref,
  indiaMobileDigits,
  isIndiaMobile,
} from '../lib/patientReach';

const DEFAULT_FEE_INR = 499;

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

const PRACTITIONER_TYPES = [
  { id: 'psychiatrist', label: 'Psychiatrist', sub: 'MD · Diagnosis & medication' },
  { id: 'psychologist', label: 'Psychologist', sub: 'Clinical assessment & CBT' },
  { id: 'therapist', label: 'Therapist', sub: 'Ongoing talk therapy' },
  { id: 'counsellor', label: 'Counsellor', sub: 'Stress, burnout & clarity' },
];

const AI_QUICK_PROMPTS = [
  {
    label: 'Sleep trouble or medication check',
    text: 'I have been having trouble sleeping for the past few weeks with racing thoughts, and I want to know if medication or therapy would help.',
    duration: '2–4 weeks',
  },
  {
    label: 'Work burnout & exhaustion',
    text: 'I feel completely drained, detached from my work, and overwhelmed by daily tasks. I need a structured space to recover and cope.',
    duration: '1–3 months',
  },
  {
    label: 'Persistent anxiety or panic',
    text: 'I experience constant worry, overthinking, and moments where my heart races. I want practical tools to manage anxiety.',
    duration: '1–3 months',
  },
  {
    label: 'Low mood & loss of energy',
    text: 'My mood has been persistently low for weeks, with very little energy or motivation to get through the day.',
    duration: 'Several months',
  },
  {
    label: 'ADHD / focus or OCD patterns',
    text: 'I struggle with attention, restlessness, or repetitive intrusive thoughts and want a proper clinical evaluation.',
    duration: 'Several months',
  },
  {
    label: 'Relationships, family, or grief',
    text: 'I am going through relationship and family stress and want a private space for ongoing talk therapy.',
    duration: '2–4 weeks',
  },
];

const DURATION_OPTIONS = [
  'Past few days',
  '2–4 weeks',
  '1–3 months',
  'Several months',
];

function pad2(n) {
  return String(n).padStart(2, '0');
}

const SLOT_TIMES = ['10:00', '11:30', '13:00', '15:30', '17:00', '19:00'];

function localDateKey(dt) {
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

function makeSlots() {
  const now = new Date();
  const day0 = new Date(now);
  day0.setHours(0, 0, 0, 0);

  // Skip today once its last slot (with a 1-hour confirmation buffer) has
  // passed — otherwise patients request times that are already gone.
  const lastSlotMinutes = 19 * 60;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startOffset = nowMinutes + 60 > lastSlotMinutes ? 1 : 0;

  const days = [];
  for (let d = startOffset; d < 7 + startOffset; d += 1) {
    const dt = new Date(day0);
    dt.setDate(day0.getDate() + d);
    const label = dt.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' });
    days.push({ key: localDateKey(dt), label, date: dt });
  }

  return { days, times: SLOT_TIMES };
}

/** Times still requestable for the selected day (all, unless it is today). */
function timesForDay(dayKey) {
  const now = new Date();
  if (dayKey !== localDateKey(now)) return SLOT_TIMES;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return SLOT_TIMES.filter((t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m > nowMinutes + 60;
  });
}

export default function BookingPage() {
  useSEO({ path: '/book', ...ROUTE_SEO['/book'] });
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preProId    = searchParams.get('pid') ?? '';
  const preProName  = searchParams.get('pname') ?? '';
  const preProRole  = searchParams.get('prole') ?? '';
  const preProLabel = searchParams.get('prolabel') ?? '';
  const preProFee   = searchParams.get('pfee') ?? '';
  const preProDur   = searchParams.get('pduration') ?? '';
  const preMode     = searchParams.get('mode') ?? '';
  const preLang     = searchParams.get('lang') ?? '';
  const preName     = searchParams.get('name') ?? '';
  const prePhone    = searchParams.get('phone') ?? '';
  const preEmail    = searchParams.get('email') ?? '';
  const prePhq      = searchParams.get('phq') ?? '';
  const preGad      = searchParams.get('gad') ?? '';
  const prePhqSev   = searchParams.get('phqsev') ?? '';
  const preGadSev   = searchParams.get('gadsev') ?? '';
  const preTool     = searchParams.get('tool') ?? '';
  const preScore    = searchParams.get('score') ?? '';
  const preBand     = searchParams.get('band') ?? '';
  const preNote     = searchParams.get('note') ?? '';
  const hasPro = Boolean(preProName);

  const suggestedRole = preProRole
    || (prePhq || preGad ? suggestRoleFromScreening(prePhq, preGad) : '')
    || '';

  const handoffNote = useMemo(
    () => screeningNote({
      phq: prePhq, gad: preGad, phqSev: prePhqSev, gadSev: preGadSev,
      tool: preTool, score: preScore, band: preBand,
    }),
    [prePhq, preGad, prePhqSev, preGadSev, preTool, preScore, preBand],
  );

  const { days, times } = useMemo(() => makeSlots(), []);
  const [step, setStep] = useState(1);
  const shellRef = useRef(null);

  // Tapping Continue/Back at the bottom of a long step leaves the viewport
  // scrolled past the next step's heading — bring the wizard back into view.
  function goToStep(n) {
    setStep(n);
    requestAnimationFrame(() => {
      shellRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const [practitionerType, setPractitionerType] = useState(suggestedRole || 'psychiatrist');
  const [mode, setMode] = useState(
    ['video', 'audio', 'chat'].includes(preMode) ? preMode : 'video',
  );

  // ── AI Care Match & Intake state ──────────────────────────────
  const [aiOpen, setAiOpen] = useState(!hasPro);
  const [aiConcern, setAiConcern] = useState('');
  const [aiDuration, setAiDuration] = useState('2–4 weeks');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiApplied, setAiApplied] = useState(false);
  const [noteStructuring, setNoteStructuring] = useState(false);

  // ── Counsellor picker (only when no professional was preselected via deep link) ──
  const [directory, setDirectory] = useState([]);
  const [directoryLoading, setDirectoryLoading] = useState(false);
  const [selectedProId, setSelectedProId] = useState('');

  useEffect(() => {
    if (hasPro) return;
    setDirectoryLoading(true);
    professionalsApi
      .directory()
      .then((json) => setDirectory(json.professionals ?? []))
      .catch(() => setDirectory([]))
      .finally(() => setDirectoryLoading(false));
  }, [hasPro]);

  const directoryForType = useMemo(
    () => directory.filter((p) => p.role === practitionerType),
    [directory, practitionerType],
  );

  const selectedPro = useMemo(
    () => directoryForType.find((p) => p.id === selectedProId) ?? null,
    [directoryForType, selectedProId],
  );

  // Reset the picked counsellor whenever the practitioner type changes —
  // a previously selected id may not belong to the new type's list.
  useEffect(() => {
    setSelectedProId('');
  }, [practitionerType]);
  const [dayKey, setDayKey] = useState(days[0]?.key ?? '');
  const availableTimes = useMemo(() => timesForDay(dayKey), [dayKey]);
  const [time, setTime] = useState(() => timesForDay(days[0]?.key ?? '')[0] ?? times[0] ?? '');

  // Keep the picked time valid when switching to a day with fewer open slots.
  useEffect(() => {
    if (!availableTimes.includes(time)) setTime(availableTimes[0] ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTimes]);

  const [name, setName] = useState(preName);
  const [phone, setPhone] = useState(prePhone);
  const [email, setEmail] = useState(preEmail);
  const [language, setLanguage] = useState(preLang || 'English');
  const [note, setNote] = useState(preNote || handoffNote);
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [paymentsOn, setPaymentsOn] = useState(false);
  const [patientEmailOn, setPatientEmailOn] = useState(false);

  // Prefill from signed-in patient when query params didn't already set fields.
  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata || {};
    const full = meta.full_name || meta.name || '';
    setName((prev) => prev || full);
    setEmail((prev) => prev || user.email || '');
    const phoneMeta = meta.phone || user.phone || '';
    const digits = String(phoneMeta).replace(/\D/g, '').slice(-10);
    if (digits.length === 10) setPhone((prev) => prev || digits);
  }, [user]);

  // Detect pay-at-booking vs request-first, and whether confirmations email.
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

  async function runAiMatch(customConcern, customDuration) {
    const text = (customConcern ?? aiConcern).trim();
    const dur = customDuration ?? aiDuration;
    if (!text) {
      setAiError('Share a few words or tap one of the prompts above so AI can match your care.');
      return;
    }
    setAiError('');
    setAiLoading(true);
    setAiApplied(false);
    try {
      const res = await assistant.triage({
        concern: text,
        duration: dur,
        screening: handoffNote || undefined,
      });
      if (res?.triage) {
        setAiResult(res.triage);
        if (!hasPro && res.triage.practitioner_type) {
          setPractitionerType(res.triage.practitioner_type);
        }
        if (res.triage.mode) {
          setMode(res.triage.mode);
        }
        if (res.triage.structured_note) {
          setNote(res.triage.structured_note);
        }
        setAiApplied(true);
        trackEvent('ai_care_match_completed', {
          practitioner_type: res.triage.practitioner_type,
          mode: res.triage.mode,
        });
      }
    } catch (e) {
      setAiError(e?.message || 'Could not run AI care match right now. You can still select your preferences below.');
    } finally {
      setAiLoading(false);
    }
  }

  function applyTriageResult(result = aiResult) {
    if (!result) return;
    if (!hasPro && result.practitioner_type) {
      setPractitionerType(result.practitioner_type);
    }
    if (result.mode) {
      setMode(result.mode);
    }
    if (result.structured_note) {
      setNote(result.structured_note);
    }
    setAiApplied(true);
  }

  async function handleStructureNoteWithAi() {
    const sourceText = note.trim() || aiConcern.trim();
    if (!sourceText || noteStructuring) return;
    setNoteStructuring(true);
    try {
      const res = await assistant.triage({
        concern: sourceText,
        duration: aiDuration,
        preferredMode: mode,
        screening: handoffNote || undefined,
      });
      if (res?.triage?.structured_note) {
        setNote(res.triage.structured_note);
        setAiResult(res.triage);
        setAiApplied(true);
      }
    } catch {
      // Keep the patient's existing note untouched on error
    } finally {
      setNoteStructuring(false);
    }
  }

  const payAmount = hasPro
    ? (Number(preProFee) || DEFAULT_FEE_INR)
    : (Number(selectedPro?.fee_inr) || DEFAULT_FEE_INR);

  async function handleSubmit() {
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
      // No payment required — create the booking directly.
      if (!paymentsOn) {
        const res = await bookings.create(bookingData);
        setConfirmation(res.booking);
        trackEvent('book_request_submitted', { practitioner_type: practitionerType, mode, paid: false, ai_matched: Boolean(aiResult) });
        requestAnimationFrame(() => {
          shellRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }

      // Payment required — pay first, then create the booking on success.
      const ready = await loadRazorpay();
      if (!ready) throw new Error('Could not load the payment gateway. Please try again.');

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
              trackEvent('book_request_submitted', { practitioner_type: practitionerType, mode, paid: true, ai_matched: Boolean(aiResult) });
              requestAnimationFrame(() => {
                shellRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              });
              resolve();
            } catch (e) {
              reject(e);
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

  const dayLabel = useMemo(() => days.find((d) => d.key === dayKey)?.label ?? '', [days, dayKey]);
  const selectedTypeLabel = useMemo(
    () => PRACTITIONER_TYPES.find((t) => t.id === practitionerType)?.label ?? 'Practitioner',
    [practitionerType],
  );
  const selectedModeLabel = useMemo(
    () => CONSULTATION_MODES.find((m) => m.id === mode)?.label ?? 'Video',
    [mode],
  );

  const phoneClean = indiaMobileDigits(phone);
  const isPhoneValid = isIndiaMobile(phone);
  const canContinueYou = canContinueContactStep({ name, phone, consent });

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">AI-Guided Care Booking</p>
            <h1 className="page-title">
              {hasPro ? `Request a session with ${preProName}` : 'Request an appointment in minutes.'}
            </h1>
            <p className="about-subtext">
              {hasPro
                ? `${preProLabel}${preProFee ? ` · ₹${preProFee}` : ''}${preProDur ? ` · ${preProDur} min` : ''}. Start with your name and number — we'll confirm the slot by phone or WhatsApp. You do not pay until then.`
                : 'Describe what you are going through for an instant AI specialist match, or pick your own preferences. We confirm by phone or WhatsApp — you do not pay until the slot is locked.'}
            </p>
            <p className="booking-reach">
              <a href={CARE_TEL_HREF}>Call {CARE_PHONE_DISPLAY}</a>
              <a href={careWaHref()} target="_blank" rel="noreferrer">WhatsApp us now</a>
            </p>
          </div>
          {hasPro && (
            <div className="pro-booking-banner">
              <div className="pro-booking-avatar">{preProName.charAt(0).toUpperCase()}</div>
              <div>
                <div className="pro-booking-name">{preProName}</div>
                <div className="pro-booking-meta">
                  {preProLabel}
                  {preProFee ? ` · ₹${preProFee}` : ''}
                  {preProDur ? ` · ${preProDur} min session` : ''}
                </div>
              </div>
              <Link to="/patient/find-professional" className="btn btn-ghost" style={{ marginLeft: 'auto' }}>
                Change
              </Link>
            </div>
          )}
          {handoffNote && (
            <div className="callout" style={{ marginTop: 16, maxWidth: 720 }}>
              <div className="callout-title">Screening carried forward</div>
              <p className="muted" style={{ margin: 0 }}>{handoffNote}</p>
            </div>
          )}
        </div>
      </section>

      {/* Optional account — never blocks the booking form */}
      {!user && (
        <div style={{ background: 'var(--brand-50, #f4f6f0)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
            <p style={{ flex: 1, minWidth: 200, margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Booking as guest. Optional:{' '}
              <Link
                to={`/patient/login?from=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/book'}`)}`}
                state={{ mode: 'login', from: typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/book' }}
                style={{ color: 'var(--brand-700)', fontWeight: 700 }}
              >
                Sign in
              </Link>
              {' '}to save appointments later.
            </p>
          </div>
        </div>
      )}

      <section className="section">
        <div className="container">
          {/* ── AI Care Match & Intake Co-pilot ─────────────────────── */}
          {!confirmation && (
            <div className="ai-triage-card" aria-labelledby="ai-triage-heading">
              <div className="ai-triage-head">
                <div className="ai-triage-head__copy">
                  <span className="ai-triage-eyebrow">
                    <span className="ai-triage-spark" aria-hidden="true">✦</span>
                    Serenest Care AI · Clinical Intake Match
                  </span>
                  <h2 id="ai-triage-heading" className="ai-triage-title">
                    Not sure whether you need a psychiatrist or therapist?
                  </h2>
                  <p className="ai-triage-sub">
                    Share what you are experiencing in plain words. Our intake model matches the right clinician type, consultation format, and prepares a structured brief for your session.
                  </p>
                </div>
                <button
                  type="button"
                  className="ai-triage-toggle"
                  aria-expanded={aiOpen}
                  onClick={() => setAiOpen((v) => !v)}
                >
                  {aiOpen ? 'Hide AI matcher' : 'Open AI matcher'}
                </button>
              </div>

              {aiOpen && (
                <div className="ai-triage-body">
                  <div className="ai-triage-prompts" role="group" aria-label="Common care concerns">
                    {AI_QUICK_PROMPTS.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className={`ai-prompt-chip ${aiConcern === item.text ? 'is-active' : ''}`}
                        onClick={() => {
                          setAiConcern(item.text);
                          setAiDuration(item.duration);
                          runAiMatch(item.text, item.duration);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="ai-triage-controls">
                    <label className="ai-triage-field">
                      <span className="sr-only">Describe what you would like help with</span>
                      <textarea
                        className="input textarea ai-triage-textarea"
                        rows={2}
                        value={aiConcern}
                        onChange={(e) => {
                          setAiConcern(e.target.value);
                          setAiApplied(false);
                        }}
                        placeholder="Or type in your own words — e.g. I haven't been sleeping well for 3 weeks, constant overthinking at work, wondering if I need medication or talk therapy…"
                      />
                    </label>

                    <div className="ai-triage-bar">
                      <label className="ai-duration-select">
                        <span>How long:</span>
                        <select
                          className="input"
                          value={aiDuration}
                          onChange={(e) => setAiDuration(e.target.value)}
                        >
                          {DURATION_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </label>

                      <button
                        type="button"
                        className="btn btn-primary ai-match-btn"
                        disabled={aiLoading || !aiConcern.trim()}
                        onClick={() => runAiMatch()}
                      >
                        {aiLoading ? 'Matching care…' : '✦ Match my care & draft note'}
                      </button>
                    </div>
                  </div>

                  {aiError && (
                    <p className="ai-triage-error" role="alert">{aiError}</p>
                  )}

                  {aiResult && (
                    <div className="ai-triage-result" role="region" aria-label="AI care recommendation">
                      {aiResult.crisis && aiResult.crisis_notice && (
                        <div className="ai-crisis-banner" role="alert">
                          <strong>Immediate support first:</strong> {aiResult.crisis_notice}
                        </div>
                      )}

                      <div className="ai-triage-result__top">
                        <div>
                          <div className="ai-triage-badges">
                            <span className="ai-badge ai-badge--primary">
                              ✦ Recommended: {aiResult.practitioner_label}
                            </span>
                            <span className="ai-badge">
                              {aiResult.practitioner_badge}
                            </span>
                            <span className="ai-badge">
                              Format: {aiResult.mode?.toUpperCase()}
                            </span>
                          </div>
                          <p className="ai-triage-rationale">{aiResult.rationale}</p>
                        </div>

                        <div className="ai-triage-apply">
                          {aiApplied ? (
                            <span className="ai-applied-pill" role="status">
                              ✓ Applied to your booking
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => applyTriageResult(aiResult)}
                            >
                              Apply to booking
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="ai-triage-brief">
                        <div className="ai-triage-brief__head">
                          <span>Clinician intake brief (pre-filled into your booking note)</span>
                          {aiResult.suggested_screening && (
                            <Link to={aiResult.suggested_screening.path} className="ai-screening-link">
                              Optional: {aiResult.suggested_screening.label} →
                            </Link>
                          )}
                        </div>
                        <pre className="ai-triage-brief__text">{aiResult.structured_note}</pre>
                      </div>

                      <p className="ai-triage-disclaimer">{aiResult.disclaimer}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="booking-shell tile" ref={shellRef}>
            <div className="booking-top">
              <div className="booking-steps" aria-label="Booking steps">
                {BOOKING_STEPS.map((s) => {
                  const isDone = confirmation ? true : s.id < step;
                  const canJump = !confirmation && s.id < step;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`step-chip ${step === s.id && !confirmation ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                      disabled={!canJump}
                      onClick={() => goToStep(s.id)}
                      aria-current={step === s.id && !confirmation ? 'step' : undefined}
                      title={canJump ? `Back to “${s.label}”` : undefined}
                    >
                      <span className="step-dot" aria-hidden="true">{isDone ? '✓' : ''}</span>
                      {s.label}
                    </button>
                  );
                })}
              </div>

              <div className="booking-summary" aria-label="Selection summary">
                {aiResult && (
                  <div className="summary-pill summary-pill--ai" title="Matched by Serenest Care AI">
                    ✦ AI Matched
                  </div>
                )}
                <div className="summary-pill">{selectedTypeLabel}</div>
                <div className="summary-pill">{selectedModeLabel}</div>
                <div className="summary-pill">
                  {dayLabel} · {time}
                </div>
              </div>
            </div>

            {step === 1 && (
              <form
                className="booking-body"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (canContinueYou) goToStep(2);
                }}
              >
                <div className="section-head" style={{ marginBottom: 10 }}>
                  <p className="section-label">Step 1 of 3</p>
                  <h2>How can we reach you?</h2>
                  <p>We confirm by phone or WhatsApp. Share a number we can use — you do not pay on this form.</p>
                </div>

                <div className="form-grid">
                  <label className="field">
                    <span className="field-label">Full name</span>
                    <input
                      className="input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Phone (India)</span>
                    <div className="input-row">
                      <span className="input-prefix">+91</span>
                      <input
                        className="input"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit number"
                        inputMode="numeric"
                        maxLength={10}
                        autoComplete="tel-national"
                        aria-invalid={phone.length > 0 && !isPhoneValid}
                      />
                    </div>
                    {phone.length > 0 && !isPhoneValid && (
                      <span className="field-hint">Enter a valid 10-digit number starting with 6–9.</span>
                    )}
                  </label>

                  <label className="field">
                    <span className="field-label">Email (optional)</span>
                    <input
                      className="input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    <span className="field-hint">
                      {patientEmailOn
                        ? "If provided, we'll send a short booking confirmation."
                        : "Optional. We'll confirm this request on WhatsApp or phone."}
                    </span>
                  </label>

                  <label className="field">
                    <span className="field-label">Preferred language</span>
                    <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Gujarati</option>
                    </select>
                  </label>

                  <label className="consent">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                    <span>
                      I confirm I am 18+ (or a lawful guardian under DPDP Act Sec 9), consent to Serenest processing my contact &amp; intake details to arrange this teleconsultation (<Link to="/consent">Teleconsultation Consent</Link>), and acknowledge this is not for emergencies.
                    </span>
                  </label>

                  <div className="field-wide">
                    <DpdpConsentNotice />
                  </div>
                </div>

                <div className="booking-actions">
                  <Link className="btn btn-ghost" to="/services">
                    View services
                  </Link>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={!canContinueYou}
                  >
                    Continue to care →
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 10 }}>
                  <p className="section-label">Step 2 of 3</p>
                  <h2>{hasPro ? `Care with ${preProName}` : 'Choose care and a preferred time.'}</h2>
                  {hasPro && <p className="muted">{preProLabel}{preProFee ? ` · ₹${preProFee}` : ''}{preProDur ? ` · ${preProDur} min` : ''}</p>}
                  {!hasPro && <p>Pick who you want to see and a preferred slot. We will confirm or suggest the next available time when we reach out.</p>}
                </div>

                <div className="form-grid">
                  <div className="field-wide">
                    <div className="field-label">
                      Practitioner
                      {hasPro && <span className="summary-pill" style={{ marginLeft: 6 }}>{preProLabel}</span>}
                      {!hasPro && aiResult && (
                        <span className="ai-inline-hint">
                          ✦ AI suggested <strong>{aiResult.practitioner_label}</strong>
                        </span>
                      )}
                    </div>
                    <div className="choice-grid">
                      {PRACTITIONER_TYPES.map((t) => {
                        const isAiPick = !hasPro && aiResult?.practitioner_type === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            disabled={hasPro}
                            className={`choice-card choice-card--stacked ${practitionerType === t.id ? 'is-selected' : ''}`}
                            onClick={() => setPractitionerType(t.id)}
                          >
                            <span className="choice-card-title">
                              {t.label}
                              {isAiPick && <span className="choice-ai-pill">✦ AI match</span>}
                            </span>
                            <span className="choice-card-hint">{t.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {!hasPro && (
                    <div className="field-wide">
                      <div className="field-label">
                        Choose your counsellor <span className="muted" style={{ fontWeight: 400 }}>(optional)</span>
                      </div>
                      {directoryLoading ? (
                        <p className="muted" style={{ marginTop: 8 }}>Loading available professionals…</p>
                      ) : directoryForType.length === 0 ? (
                        <p className="muted" style={{ marginTop: 8 }}>
                          No verified {selectedTypeLabel.toLowerCase()}s listed yet — we'll match you with the next available one.
                        </p>
                      ) : (
                        <div className="choice-grid choice-grid--modes">
                          <button
                            type="button"
                            className={`choice-card choice-card--stacked ${selectedProId === '' ? 'is-selected' : ''}`}
                            onClick={() => setSelectedProId('')}
                          >
                            <span className="choice-card-icon" aria-hidden="true">✨</span>
                            <span className="choice-card-title">Any available</span>
                            <span className="choice-card-hint">We'll match you with a verified professional</span>
                          </button>
                          {directoryForType.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              className={`choice-card choice-card--stacked ${selectedProId === p.id ? 'is-selected' : ''}`}
                              onClick={() => setSelectedProId(p.id)}
                            >
                              <span className="choice-card-icon" aria-hidden="true">🧑‍⚕️</span>
                              <span className="choice-card-title">{p.full_name}</span>
                              <span className="choice-card-hint">
                                {p.fee_inr ? `₹${p.fee_inr}` : ''}{p.duration_min ? ` · ${p.duration_min} min` : ''}{p.city ? ` · ${p.city}` : ''}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="field-wide">
                    <div className="field-label">Consultation mode</div>
                    <div className="choice-grid choice-grid--modes">
                      {CONSULTATION_MODES.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className={`choice-card choice-card--stacked ${mode === m.id ? 'is-selected' : ''}`}
                          onClick={() => setMode(m.id)}
                        >
                          <span className="choice-card-icon" aria-hidden="true">{m.icon}</span>
                          <span className="choice-card-title">{m.label}</span>
                          <span className="choice-card-hint">{m.hint}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="slot-grid" style={{ marginTop: 18 }}>
                  <div>
                    <div className="field-label">Preferred day</div>
                    <div className="slot-days">
                      {days.map((d) => (
                        <button
                          key={d.key}
                          type="button"
                          className={`slot-chip ${dayKey === d.key ? 'is-selected' : ''}`}
                          onClick={() => setDayKey(d.key)}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="field-label">Preferred time</div>
                    <div className="slot-times">
                      {availableTimes.map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`slot-chip ${time === t ? 'is-selected' : ''}`}
                          onClick={() => setTime(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="field field-wide" style={{ marginTop: 16 }}>
                  <div className="ai-note-label-row">
                    <label htmlFor="booking-note-input" className="field-label" style={{ marginBottom: 0 }}>
                      Brief reason / clinician intake note (optional)
                    </label>
                    <button
                      type="button"
                      className="ai-structure-btn"
                      disabled={noteStructuring || (!note.trim() && !aiConcern.trim())}
                      onClick={handleStructureNoteWithAi}
                    >
                      {noteStructuring ? 'Structuring…' : '✦ Structure note with AI'}
                    </button>
                  </div>
                  <textarea
                    id="booking-note-input"
                    className="input textarea"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What would you like help with? Type a few rough words and click 'Structure note with AI' to prepare a clear clinician brief."
                    rows={3}
                  />
                </div>

                <div className="booking-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => goToStep(1)}>
                    ← Back
                  </button>
                  <button className="btn btn-primary" type="button" onClick={() => goToStep(3)}>
                    Review request →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && !confirmation && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 10 }}>
                  <p className="section-label">Step 3 of 3</p>
                  <h2>Confirm your request.</h2>
                </div>

                <div className="confirm-grid">
                  <div className="confirm-card">
                    <div className="confirm-row">
                      <span className="confirm-k">Practitioner</span>
                      <span className="confirm-v">
                        {selectedTypeLabel}
                        {aiResult?.practitioner_type === practitionerType && (
                          <span className="choice-ai-pill" style={{ marginLeft: 6 }}>✦ AI matched</span>
                        )}
                      </span>
                    </div>
                    <div className="confirm-row">
                      <span className="confirm-k">Counsellor</span>
                      <span className="confirm-v">
                        {hasPro ? preProName : (selectedPro?.full_name ?? 'Any available')}
                      </span>
                    </div>
                    <div className="confirm-row">
                      <span className="confirm-k">Mode</span>
                      <span className="confirm-v">{selectedModeLabel}</span>
                    </div>
                    <div className="confirm-row">
                      <span className="confirm-k">Slot</span>
                      <span className="confirm-v">
                        {dayLabel} {time}
                      </span>
                    </div>
                    {paymentsOn && (
                      <div className="confirm-row">
                        <span className="confirm-k">Amount</span>
                        <span className="confirm-v"><strong>₹{payAmount}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="confirm-card">
                    <div className="confirm-row">
                      <span className="confirm-k">Name</span>
                      <span className="confirm-v">{name}</span>
                    </div>
                    <div className="confirm-row">
                      <span className="confirm-k">Phone</span>
                      <span className="confirm-v">+91 {phoneClean}</span>
                    </div>
                    <div className="confirm-row">
                      <span className="confirm-k">Email</span>
                      <span className="confirm-v">{email || '—'}</span>
                    </div>
                    <div className="confirm-row">
                      <span className="confirm-k">Language</span>
                      <span className="confirm-v">{language}</span>
                    </div>
                  </div>
                </div>

                {note && (
                  <div className="callout">
                    <div className="callout-title">
                      {aiResult ? '✦ Clinician intake brief (AI-prepared)' : 'Your note'}
                    </div>
                    <p className="muted" style={{ margin: 0, whiteSpace: 'pre-line' }}>
                      {note}
                    </p>
                  </div>
                )}

                {submitError && (
                  <div style={{
                    background: '#fdecea', border: '1px solid #f5c2c0',
                    color: '#a02622', borderRadius: 10,
                    padding: '12px 14px', margin: '12px 0',
                    fontSize: '0.9rem', fontWeight: 500,
                  }}>
                    ⚠ {submitError}
                  </div>
                )}

                <div className="booking-actions">
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => goToStep(2)}
                    disabled={submitting}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting
                      ? (paymentsOn ? 'Opening payment…' : 'Submitting…')
                      : (paymentsOn ? `Pay ₹${payAmount} & confirm →` : 'Request appointment →')}
                  </button>
                </div>

                <p className="fineprint" style={{ marginTop: 12 }}>
                  {paymentsOn
                    ? 'Secure payment via Razorpay. You are only charged once you complete payment, and your slot is confirmed instantly after.'
                    : "This is a request, not a charge. We'll reach out on WhatsApp or phone to confirm the clinician and slot, then share payment steps."}
                  {' '}
                  If urgent or in danger, contact emergency services.
                </p>
              </div>
            )}

            {/* ── Success screen ───────────────────────────── */}
            {confirmation && (
              <div className="booking-body" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9bb481, #46552f)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.4rem', color: '#fff', marginBottom: '1.25rem',
                  boxShadow: '0 8px 24px rgba(70, 85, 47, 0.35)',
                }}>✓</div>

                <h2 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: 8 }}>
                  Booking received!
                </h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto 1.5rem' }}>
                  Thank you, <strong>{name.split(' ')[0]}</strong>. We've received your request for a{' '}
                  <strong>{selectedTypeLabel.toLowerCase()}</strong> {selectedModeLabel.toLowerCase()} session
                  on <strong>{dayLabel}</strong> at <strong>{time}</strong>.
                </p>

                <div style={{
                  display: 'inline-block', textAlign: 'left',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '1rem 1.25rem',
                  marginBottom: '1.5rem', minWidth: 280,
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Booking reference
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--brand-700)', fontWeight: 700 }}>
                    {confirmation.id?.slice(0, 8).toUpperCase()}
                  </div>
                </div>

                <p style={{ fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                  {confirmation.status === 'confirmed'
                    ? <>Your session is confirmed. Join from your patient dashboard or the consultation room at the booked time.</>
                    : <>Status: <strong>awaiting confirmation</strong>. Our team will contact you on <strong>+91 {phoneClean}</strong> shortly to confirm your professional and timing.</>}
                </p>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    className="btn btn-primary"
                    href={careWaHref(`Hi, I just booked a ${selectedTypeLabel} session (Ref: ${confirmation.id?.slice(0, 8).toUpperCase()})`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    💬 Chat on WhatsApp
                  </a>
                  {confirmation.status === 'confirmed' && (
                    <Link className="btn btn-ghost" to={`/consultation/${confirmation.id}?mode=${mode}`}>
                      🎥 Open consultation room
                    </Link>
                  )}
                  <Link className="btn btn-ghost" to="/patient/dashboard">
                    My appointments
                  </Link>
                  <Link className="btn btn-ghost" to="/">
                    Back to home
                  </Link>
                </div>
                <p className="fineprint" style={{ marginTop: 12 }}>
                  {confirmation.status === 'confirmed'
                    ? 'Join a few minutes early to test your camera and mic.'
                    : 'You will get the consultation room link once your booking is confirmed.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
