/**
 * UTM tracking — capture social/campaign source on first page load.
 * Stored in sessionStorage so it survives navigation but resets each session.
 * Call captureUtm() once at app root; getUtm() anywhere to read back.
 */

const KEY = 'sn_utm';

export function captureUtm() {
  const params = new URLSearchParams(window.location.search);
  const source   = params.get('utm_source');
  const medium   = params.get('utm_medium');
  const campaign = params.get('utm_campaign');
  const content  = params.get('utm_content');

  if (source || medium || campaign) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ source, medium, campaign, content }));
    } catch {}
  }
}

/** Returns { source, medium, campaign, content } or null */
export function getUtm() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
