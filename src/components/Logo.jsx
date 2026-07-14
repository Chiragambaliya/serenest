import React from 'react';

/**
 * Serenest brand mark — leaf + serif wordmark (per the approved redesign
 * mockup). Inline SVG so it inherits color and needs no asset pipeline.
 * variant: 'dark' (default, ink-on-cream surfaces) | 'light' (on dark green).
 */
export default function Logo({ variant = 'dark', size = 30, withWordmark = true }) {
  const leaf = variant === 'light' ? '#f2eddf' : '#2e4a38';
  const vein = variant === 'light' ? '#2e4a38' : '#f2eddf';
  return (
    <span className={`logo logo--${variant}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M16 28C16 18 10 14 4 13c7-2 11-6 12-11 1 5 5 9 12 11-6 1-12 5-12 15Z"
          fill={leaf}
        />
        <path
          d="M16 28C16 20 13 16.5 9 15"
          stroke={vein}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
      {withWordmark && <span className="logo-wordmark">Serenest</span>}
    </span>
  );
}
