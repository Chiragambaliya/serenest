/**
 * Professional learning “done” state — phase 1: browser-only (localStorage).
 *
 * Phase 2 (when pros sign in with Supabase Auth): upsert into
 * `public.pro_learning_progress` (see supabase migration) so progress follows the user.
 */

const STORAGE_KEY = 'serenest_pro_learning_v1';

export function loadProgressIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function saveProgressIds(ids) {
  const unique = [...new Set(ids)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
  return unique;
}

/** @returns {string[]} updated id list */
export function toggleProgressId(moduleId) {
  const cur = new Set(loadProgressIds());
  if (cur.has(moduleId)) cur.delete(moduleId);
  else cur.add(moduleId);
  return saveProgressIds([...cur]);
}
