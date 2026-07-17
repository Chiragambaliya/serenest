/**
 * Build /book query strings so screening and directory handoffs
 * carry context into the booking form.
 */

function enc(v) {
  if (v === null || v === undefined || v === '') return '';
  return encodeURIComponent(String(v));
}

/**
 * @param {Record<string, string | number | boolean | undefined | null>} params
 * @returns {string} path including query, e.g. `/book?phq=12&…`
 */
export function buildBookPath(params = {}) {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue;
    q.set(key, String(value));
  }
  const qs = q.toString();
  return qs ? `/book?${qs}` : '/book';
}

/** Suggest practitioner type from PHQ-9 / GAD-7 severity. */
export function suggestRoleFromScreening(phqScore, gadScore) {
  const phq = Number(phqScore) || 0;
  const gad = Number(gadScore) || 0;
  if (phq >= 15 || gad >= 15) return 'psychiatrist';
  if (phq >= 10 || gad >= 10) return 'psychologist';
  if (Math.max(phq, gad) >= 5) return 'counsellor';
  return 'therapist';
}

export function screeningNote({ phq, gad, phqSev, gadSev, tool, score, band }) {
  if (tool) {
    return `Self-screening (${tool}): ${score ?? '—'}${band ? ` · ${band}` : ''}. Shared from Serenest screening.`;
  }
  const parts = [];
  if (phq !== undefined && phq !== null && phq !== '') {
    parts.push(`PHQ-9 ${phq}${phqSev ? ` (${phqSev})` : ''}`);
  }
  if (gad !== undefined && gad !== null && gad !== '') {
    parts.push(`GAD-7 ${gad}${gadSev ? ` (${gadSev})` : ''}`);
  }
  if (!parts.length) return '';
  return `Self-screening: ${parts.join(' · ')}. Shared from Serenest screening.`;
}

/** First consultation mode id from a modes array/string (video preferred). */
export function preferModeFromPro(modes) {
  const list = Array.isArray(modes)
    ? modes.map((m) => String(m).toLowerCase())
    : String(modes || '').toLowerCase().split(/[,/|]/).map((s) => s.trim()).filter(Boolean);
  if (list.some((m) => m.includes('video'))) return 'video';
  if (list.some((m) => m.includes('audio'))) return 'audio';
  if (list.some((m) => m.includes('chat'))) return 'chat';
  return '';
}

export function encodeBookQuery(params) {
  return Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, enc(v) ? String(v) : '']),
  );
}
