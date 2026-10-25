import React from 'react';
import { Link } from 'react-router-dom';
import { DPDP_NOTICE_VERSION } from '../lib/dpdp';

/**
 * Reusable DPDP Act, 2023 (Sections 5, 6 & 9) Itemized Notice & Consent Line
 * for patient intake, booking, screening, and callback forms.
 */
export default function DpdpConsentNotice({ compact = false }) {
  return (
    <div className="dpdp-inline-notice">
      <div className="dpdp-inline-notice__summary">
        <span>
          <strong>DPDP Act 2023 Notice ({DPDP_NOTICE_VERSION}):</strong> By submitting, you confirm you are 18+ (or a lawful guardian under Sec 9) and consent to Serenest processing your contact &amp; intake details to match a clinician and confirm your slot on phone/WhatsApp.{' '}
          <Link to="/privacy#dpdp-rights-portal">Withdraw consent or exercise rights anytime →</Link>
        </span>
      </div>
      {!compact && (
        <details className="dpdp-inline-notice__details">
          <summary>View Section 5 itemized data &amp; purpose notice</summary>
          <div className="dpdp-inline-notice__box">
            <p>
              <strong>Data Fiduciary:</strong> Serenest Education Pvt Ltd (Grievance Officer: Dr. Chirag Aambalia ·{' '}
              <a href="mailto:support@serenest.in">support@serenest.in</a>)
            </p>
            <p>
              <strong>Itemized personal data:</strong> Full name, 10-digit Indian mobile number, optional email, and voluntary symptom/screening notes.
            </p>
            <p>
              <strong>Specified purpose:</strong> Non-diagnostic specialist matching, preparing your clinician intake brief, and contacting you on phone/WhatsApp to confirm your teleconsultation slot. Never sold or used for advertising.
            </p>
            <p>
              <strong>Data Principal rights (Sec 6(4), 11–14):</strong> You may withdraw consent, request a summary of your data &amp; processors, correct or erase data, nominate a representative, or file a grievance via our{' '}
              <Link to="/privacy#dpdp-rights-portal">Self-Service DPDP Rights Portal</Link> before approaching the Data Protection Board of India.
            </p>
          </div>
        </details>
      )}
    </div>
  );
}
