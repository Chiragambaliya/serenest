(function() {
  var KEY = 'serenest_cookie_consent';
  if (localStorage.getItem(KEY)) return;

  var wrap = document.createElement('div');
  wrap.id = 'cookie-consent-banner';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-label', 'Cookie consent');
  wrap.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9999;padding:16px 24px;background:var(--dark,#1C2420);color:rgba(247,245,240,0.9);font-family:inherit;font-size:0.9rem;line-height:1.5;box-shadow:0 -4px 20px rgba(0,0,0,0.15);display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px 20px;';
  wrap.innerHTML =
    '<span style="flex:1;min-width:200px;">We use cookies to improve your experience and analyse site use. By continuing you agree to our <a href="privacy.html" style="color:var(--sage,#7D9B76);text-decoration:underline;">Privacy Policy</a>.</span>' +
    '<button type="button" id="cookie-consent-accept" style="padding:10px 20px;background:var(--sage,#7D9B76);color:#fff;border:none;border-radius:40px;font-family:inherit;font-size:0.9rem;font-weight:500;cursor:pointer;white-space:nowrap;">Accept</button>';

  document.body.appendChild(wrap);

  document.getElementById('cookie-consent-accept').addEventListener('click', function() {
    try { localStorage.setItem(KEY, 'accepted'); } catch (e) {}
    wrap.remove();
  });
})();
