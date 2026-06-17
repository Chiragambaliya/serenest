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
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="4.5" width="12" height="16" rx="2" />
      <path d="M9 4.5V3.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 10h6M9 13.5h4" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
      <path d="M5 20.5h14" />
    </>
  ),
  folder: (
    <>
      <path d="M3.5 7a2 2 0 0 1 2-2h3l2 2.2h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2Z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.5 2.4 3.8 5.4 3.8 8.5S14.5 18.1 12 20.5C9.5 18.1 8.2 15.1 8.2 12S9.5 5.9 12 3.5Z" />
    </>
  ),
  pill: (
    <>
      <rect x="3.5" y="8" width="17" height="8" rx="4" transform="rotate(-45 12 12)" />
      <path d="M9 9l6 6" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20s-7-4.3-7-9.3A3.7 3.7 0 0 1 12 7a3.7 3.7 0 0 1 7 3.7C19 15.7 12 20 12 20Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4.5 7l7.5 5.5L19.5 7" />
    </>
  ),
  phone: (
    <>
      <path d="M6.5 4h3l1.5 4-2 1.3a11 11 0 0 0 4.7 4.7L15 16l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C9.7 21.4 3.6 15.3 3 7.6A1.5 1.5 0 0 1 4.5 6Z" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-4 3.5.3-3.5H5.5A1.5 1.5 0 0 1 4 13.5Z" />
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
