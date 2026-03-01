(function() {
  try {
    if (typeof sessionStorage === 'undefined') return;
    if (sessionStorage.getItem('serenest_visit_sent')) return;
    var base = typeof window.API_BASE !== 'undefined' ? window.API_BASE : '';
    var url = (base || '') + '/api/visit';
    var payload = {
      page: window.location.pathname || '/',
      referrer: document.referrer || ''
    };
    sessionStorage.setItem('serenest_visit_sent', '1');
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(function() {});
  } catch (e) {}
})();
