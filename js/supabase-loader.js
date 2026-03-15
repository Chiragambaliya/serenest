/**
 * Loads Supabase client when config is present. Sets window.__supabase when ready.
 * Load this before main.js. Uses dynamic import (works in modern browsers).
 */
(function () {
  var url = window.SERENEST_SUPABASE_URL;
  var key = window.SERENEST_SUPABASE_ANON_KEY;
  if (!url || !key) return;
  var s = document.createElement('script');
  s.type = 'module';
  s.textContent = [
    "import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';",
    "window.__supabase = createClient(window.SERENEST_SUPABASE_URL, window.SERENEST_SUPABASE_ANON_KEY);"
  ].join('\n');
  document.head.appendChild(s);
})();
