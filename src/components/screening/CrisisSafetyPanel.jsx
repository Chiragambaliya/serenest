import React from 'react';
import { Link } from 'react-router-dom';
import { CRISIS_RESOURCES, CRISIS_STATEMENT } from '../../lib/mentalHealthCenter';

/**
 * Immediate safety guidance — interrupts routine care funnels.
 * Nothing here is sent anywhere; Serenest does not monitor answers.
 * Tele-MANAS is the primary national mental-health support line;
 * iCALL stays available as an additional support option.
 */
export default function CrisisSafetyPanel({
  variant = 'full',
  onAcknowledge,
  acknowledgeLabel = 'I understand — show my results',
}) {
  return (
    <aside className="mhc-crisis" role="alert" aria-live="assertive">
      <h2>Please get support now</h2>
      <p>{CRISIS_STATEMENT}</p>
      <div className="mhc-crisis-actions">
        <a className="mhc-crisis-btn" href={CRISIS_RESOURCES.emergency.href}>
          Call {CRISIS_RESOURCES.emergency.number} (Emergency)
        </a>
        <a className="mhc-crisis-btn" href={CRISIS_RESOURCES.telemanas.href}>
          {CRISIS_RESOURCES.telemanas.label}: {CRISIS_RESOURCES.telemanas.number}
        </a>
        <a className="mhc-crisis-btn mhc-crisis-btn-ghost" href={CRISIS_RESOURCES.telemanasAlt.href}>
          Tele-MANAS toll-free: {CRISIS_RESOURCES.telemanasAlt.number}
        </a>
        <a className="mhc-crisis-btn mhc-crisis-btn-ghost" href={CRISIS_RESOURCES.icall.href}>
          {CRISIS_RESOURCES.icall.label} (additional support): {CRISIS_RESOURCES.icall.number}
        </a>
        <Link className="mhc-crisis-btn mhc-crisis-btn-ghost" to={CRISIS_RESOURCES.emergencyPage}>
          More crisis resources
        </Link>
      </div>
      <p style={{ marginTop: '0.85rem', marginBottom: 0, fontSize: '0.85rem' }}>
        Online appointments are not emergency services. Your answers stay in this browser — Serenest does not
        monitor them or send them anywhere.
      </p>
      {variant === 'full' && onAcknowledge ? (
        <p style={{ marginTop: '1rem', marginBottom: 0 }}>
          <button type="button" className="btn btn-ghost" onClick={onAcknowledge}>
            {acknowledgeLabel}
          </button>
        </p>
      ) : null}
    </aside>
  );
}
