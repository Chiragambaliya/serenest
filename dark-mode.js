(function() {
  var KEY = 'serenest_dark';
  function isDark() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function applyTheme(on) {
    try { if (on) localStorage.setItem(KEY, '1'); else localStorage.setItem(KEY, '0'); } catch (e) {}
    if (document.documentElement) document.documentElement.setAttribute('data-theme', on ? 'dark' : '');
  }
  applyTheme(isDark());

  function addToggle() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dark-mode-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.textContent = isDark() ? '\u2600\uFE0F' : '\uD83C\uDF19';
    btn.addEventListener('click', function() {
      var on = !isDark();
      applyTheme(on);
      btn.textContent = on ? '\u2600\uFE0F' : '\uD83C\uDF19';
    });
    // Insert into .nav-actions wrapper (right side of nav), not inside the <ul>
    var actions = document.querySelector('.nav-actions');
    if (actions) {
      actions.insertBefore(btn, actions.firstChild);
    } else {
      var nav = document.querySelector('nav');
      if (nav) {
        var inner = nav.querySelector('.nav-inner');
        var target = inner || nav;
        target.appendChild(btn);
      } else {
        btn.style.position = 'fixed';
        btn.style.top = '16px';
        btn.style.right = '16px';
        btn.style.zIndex = '9999';
        document.body.appendChild(btn);
      }
    }
  }
  if (document.body) addToggle();
  else document.addEventListener('DOMContentLoaded', addToggle);
})();
