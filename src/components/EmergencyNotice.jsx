import React from 'react';

export default function EmergencyNotice({ className = '' }) {
  return (
    <div className={`emergency-notice ${className}`} role="note">
      <strong>Not for emergencies.</strong> If you or someone else is at immediate risk of harm,
      contact local emergency services or a crisis helpline right away — do not wait for an
      online appointment. Call{' '}
      <a href="tel:7777936367">7777936367</a> for Serenest support during working hours.
    </div>
  );
}
