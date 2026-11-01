import { useId } from 'react'

export function Logo({ size = 40 }) {
  const gid = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden className="logo-svg">
      <rect width="40" height="40" rx="12" fill={`url(#se-${gid})`} />
      <path
        d="M12.5 27V13h6.1c3.2 0 5.2 1.7 5.2 4.3 0 2.7-2.1 4.4-5.3 4.4H16.5V27H12.5zm5-7.8c1.45 0 2.25-.7 2.25-1.85S18.95 15.5 17.5 15.5H16.5v3.7H17.5z"
        fill="#f3f7f4"
      />
      <circle cx="28.2" cy="14.2" r="2.2" fill="#c4783a" />
      <defs>
        <linearGradient id={`se-${gid}`} x1="6" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#245a48" />
          <stop offset="1" stopColor="#1a3d32" />
        </linearGradient>
      </defs>
    </svg>
  )
}
