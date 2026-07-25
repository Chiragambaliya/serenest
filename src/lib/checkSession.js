/**
 * Browser-session persistence for Mental Health Checks (privacy-first).
 * Answers stay on-device; not uploaded by the check runner itself.
 */

const prefix = 'serenest_check_draft_v1_';

export function loadCheckDraft(toolId) {
  if (!toolId || typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(prefix + toolId);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data?.answers)) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveCheckDraft(toolId, { answers, submitted = false }) {
  if (!toolId || typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(
      prefix + toolId,
      JSON.stringify({ answers, submitted, updatedAt: new Date().toISOString() }),
    );
  } catch {
    /* quota / private mode */
  }
}

export function clearCheckDraft(toolId) {
  if (!toolId || typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.removeItem(prefix + toolId);
  } catch {
    /* ignore */
  }
}
