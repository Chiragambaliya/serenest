import React from 'react';
import { Link } from 'react-router-dom';
import { CRISIS_RESOURCES } from '../../lib/mentalHealthCenter';

/**
 * Immediate safety guidance — interrupts routine care funnels.
 */
export default function CrisisSafetyPanel({
  variant = 'full',
  onAcknowledge,
  acknowledgeLabel = 'I understand — show my results',
}) {
  return (
    <aside className="mhc-crisis" role="alert" aria-live="assertive">
      <h2>Please get support now</h2>
      <p>
        Your answers suggest you may need help right away. You do not have to wait for an online
        appointment. If you are in immediate danger, call emergency services.
      </p>
      <div className="mhc-crisis-actions">
        <a className="mhc-crisis-btn" href={CRISIS_RESOURCES.emergency.href}>
          Call {CRISIS_RESOURCES.emergency.number} (Emergency)
        </a>
        <a className="mhc-crisis-btn mhc-crisis-btn-ghost" href={CRISIS_RESOURCES.icall.href}>
          {CRISIS_RESOURCES.icall.label}: {CRISIS_RESOURCES.icall.number}
        </a>
        <Link className="mhc-crisis-btn mhc-crisis-btn-ghost" to={CRISIS_RESOURCES.emergencyPage}>
          More crisis resources
        </Link>
      </div>
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
