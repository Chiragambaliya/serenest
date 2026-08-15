/**
 * Supabase admin client (service role — server only).
 * `supabase` is null when the database env vars are missing; every caller
 * must handle that (requireDb sends a 503, lead routes fall back to JSONL).
 */
import { createClient } from '@supabase/supabase-js';

export const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

/**
 * Insert a row, dropping columns the live schema does not yet have.
 * Keeps bookings/screenings working across partially-migrated production DBs
 * (consent timestamps, age attestation, etc.).
 */
export async function insertDroppingUnknownColumns(table, row, optionalCols = []) {
  if (!supabase) return { data: null, error: { message: 'database not configured' } };

  let attempt = { ...row };
  let data = null;
  let error = null;

  for (let i = 0; i < optionalCols.length + 1; i += 1) {
    ({ data, error } = await supabase.from(table).insert(attempt).select().single());
    if (!error) break;

    const msg = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`;
    const missingCol = optionalCols.find(
      (col) => attempt[col] !== undefined && new RegExp(col, 'i').test(msg),
    );
    if (missingCol) {
      const { [missingCol]: _omit, ...rest } = attempt;
      attempt = rest;
      continue;
    }
    break;
  }

  return { data, error };
}
