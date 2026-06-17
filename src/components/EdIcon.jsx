import React from 'react';

/** Minimal stroke icons (currentColor) for Academy. 24x24 viewBox. */
const PATHS = {
  cap: (
    <>
      <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
      <path d="M7 10.5V15c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4.5" />
      <path d="M21 8.5V14" />
    </>
  ),
  certificate: (
    <>
      <rect x="4" y="3.5" width="16" height="13" rx="2" />
      <path d="M7.5 8h9M7.5 11h6" />
      <circle cx="12" cy="18.5" r="2.2" />
      <path d="M10.6 20.2 10 23l2-1.2 2 1.2-.6-2.8" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M6 3.5v4a4 4 0 0 0 8 0v-4" />
      <path d="M10 15.5a5 5 0 0 0 10 0v-2" />
      <circle cx="20" cy="11" r="1.8" />
      <path d="M10 11.5v0" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15.5H5.5A1.5 1.5 0 0 1 4 18Z" />
      <path d="M20 5.5C20 4.7 19.3 4 18.5 4H13v15.5h5.5a1.5 1.5 0 0 0 1.5-1.5Z" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12h18" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.5 8 21l4-2.2L16 21l-1-7.5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M16 6.5a3 3 0 0 1 0 5.5" />
      <path d="M17 14c2.3.5 4 2.4 4 5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 5 6v5c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6Z" />
      <path d="M12 9v5M9.5 11.5h5" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4.5" width="18" height="12" rx="2" />
      <path d="M8.5 20h7M12 16.5V20" />
    </>
  ),
  microscope: (
    <>
      <path d="M9 4.5l3.5 3.5-3 3L6 7.5Z" />
      <path d="M11 9.5 14 12.5" />
      <path d="M7 14a5 5 0 0 0 9 3" />
      <path d="M5 20.5h14" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function EdIcon({ name, size = 22 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.cap}
    </svg>
  );
}
