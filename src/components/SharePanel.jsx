import React, { useState } from 'react';

const BASE = 'https://www.serenest.in';

const SHARE_TEXT =
  'I use Serenest for mental health care — verified psychiatrists, private video consultations, and structured care across India.';

function utmUrl(medium) {
  return `${BASE}/?utm_source=share&utm_medium=${medium}&utm_campaign=referral`;
}

export default function SharePanel({ className = '' }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(utmUrl('copy')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + ' ' + utmUrl('whatsapp'))}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(utmUrl('twitter'))}`;

  return (
    <div className={`share-panel ${className}`}>
      <p className="share-panel-label">Share Serenest</p>
      <div className="share-panel-btns">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn share-btn--wa"
          aria-label="Share on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.537 4.07 1.482 5.79L0 24l6.374-1.467A11.941 11.941 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.805 9.805 0 0 1-5.027-1.384l-.36-.214-3.732.858.886-3.636-.235-.373A9.793 9.793 0 0 1 2.182 12C2.182 6.578 6.578 2.182 12 2.182c5.422 0 9.818 4.396 9.818 9.818 0 5.422-4.396 9.818-9.818 9.818z" />
          </svg>
          WhatsApp
        </a>
        <a
          href={twitterHref}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn share-btn--tw"
          aria-label="Share on X (Twitter)"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Post on X
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="share-btn share-btn--copy"
          aria-label="Copy link"
        >
          {copied ? (
            <>✓ Copied!</>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" width="16" height="16">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
