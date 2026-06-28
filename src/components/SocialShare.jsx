import React, { useState } from 'react';

/**
 * Social share bar for blog posts.
 * Props: url (string), title (string), excerpt (string)
 */
export default function SocialShare({ url, title, excerpt = '' }) {
  const [copied, setCopied] = useState(false);

  const encoded   = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const waText    = encodeURIComponent(`${title}\n\n${url}`);

  const liHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
  const waHref = `https://wa.me/?text=${waText}`;

  function handleCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => flash());
    } else {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      flash();
    }
  }

  function flash() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, text: excerpt, url });
    } catch {}
  }

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="ss-bar" aria-label="Share this article">
      <span className="ss-label">Share</span>

      <a
        className="ss-btn ss-btn--li"
        href={liHref}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Share on LinkedIn"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM9 17H6.5v-7H9v7ZM7.75 8.8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM18 17h-2.5v-3.5c0-1-.75-1.5-1.5-1.5s-1.5.5-1.5 1.5V17H10v-7h2.5v1.1A3.3 3.3 0 0 1 15 9.5c1.9 0 3 1.3 3 3.2V17Z"/>
        </svg>
        LinkedIn
      </a>

      <a
        className="ss-btn ss-btn--wa"
        href={waHref}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Share on WhatsApp"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.09-1.35A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm5.1 14.1c-.22.6-1.28 1.15-1.77 1.2-.44.05-.97.07-1.56-.1a14.3 14.3 0 0 1-1.42-.52C10.24 15.9 8.6 13.9 8.47 13.74c-.14-.17-1.1-1.46-1.1-2.79 0-1.33.7-1.98 1-2.27.27-.27.6-.34.8-.34l.56.01c.18 0 .43-.07.67.51.25.6.85 2.08.93 2.23.08.15.13.33.03.53-.1.2-.15.32-.3.5-.14.17-.3.38-.43.51-.14.14-.3.3-.13.58.17.29.77 1.27 1.65 2.06 1.14 1.01 2.1 1.33 2.39 1.48.3.15.47.13.64-.08.18-.2.76-.9.96-1.2.2-.3.4-.25.67-.15.27.1 1.7.8 2 .95.3.14.5.21.57.33.07.12.07.7-.15 1.3Z"/>
        </svg>
        WhatsApp
      </a>

      {canNativeShare ? (
        <button className="ss-btn ss-btn--share" onClick={handleNativeShare} aria-label="Share">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share
        </button>
      ) : (
        <button className="ss-btn ss-btn--copy" onClick={handleCopy} aria-label="Copy link">
          {copied ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy link
            </>
          )}
        </button>
      )}
    </div>
  );
}
