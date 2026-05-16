/** Shared copy for patient booking + professional “modes offered”. */
export const CONSULTATION_MODES = [
  { id: 'video', label: 'Video', hint: 'See each other on a live call', icon: '📹' },
  { id: 'audio', label: 'Audio', hint: 'Voice only — no camera needed', icon: '🎙️' },
  { id: 'chat', label: 'Chat', hint: 'Typed messages in a secure thread', icon: '💬' },
];

/** Normalise API / URL values to `video` | `audio` | `chat`. */
export function normalizeSessionMode(mode) {
  const m = String(mode ?? 'video').toLowerCase().trim();
  if (m === 'audio') return 'audio';
  if (m === 'chat') return 'chat';
  return 'video';
}
