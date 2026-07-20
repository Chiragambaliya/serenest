// Translate raw Supabase auth errors into messages users can act on.
// Supabase surfaces terse API strings like "email rate limit exceeded" or
// "For security purposes, you can only request this after 54 seconds." —
// we never want to show those verbatim.

export function friendlyAuthError(err, fallback) {
  const raw = (err && err.message) || '';
  const msg = raw.toLowerCase();

  if (msg.includes('rate limit') || msg.includes('you can only request this after')) {
    return 'Too many attempts right now. Please wait a few minutes and try again.';
  }
  if (msg.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please confirm your email first — check your inbox for the confirmation link.';
  }
  if (msg.includes('user already registered') || msg.includes('already been registered')) {
    return 'An account with this email already exists. Try logging in instead.';
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Could not reach the server. Check your connection and try again.';
  }
  return raw || fallback;
}
