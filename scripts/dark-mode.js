(function() {
  var KEY = 'serenest_dark';
  function isDark() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function applyTheme(on) {
    try { if (on) localStorage.setItem(KEY, '1'); else localStorage.setItem(KEY, '0'); } catch (e) {}
    if (document.documentElement) document.documentElement.setAttribute('data-theme', on ? 'dark' : '');
  }
  applyTheme(isDark());

  function addToggle() {
    if (!document.body) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dark-mode-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.textContent = isDark() ? 'Light' : 'Dark';
    btn.addEventListener('click', function() {
      var on = !isDark();
      applyTheme(on);
      btn.textContent = on ? 'Light' : 'Dark';
    });
    var nav = document.querySelector('nav');
    var ul = nav ? nav.querySelector('ul') : null;
    if (ul) {
      var li = document.createElement('li');
      li.style.listStyle = 'none';
      li.appendChild(btn);
      ul.appendChild(li);
    } else if (document.body) {
      btn.style.position = 'fixed';
      btn.style.top = '16px';
      btn.style.right = '16px';
      btn.style.zIndex = '9999';
      document.body.appendChild(btn);
    }
  }
  if (document.body) addToggle();
  else document.addEventListener('DOMContentLoaded', addToggle);
})();
