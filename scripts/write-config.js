/**
 * Writes js/config.js from environment variables (for Render, Vercel, etc.).
 * Set SUPABASE_URL and SUPABASE_ANON_KEY in your host's environment.
 */
const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || process.env.SERENEST_SUPABASE_URL || '';
const key = process.env.SUPABASE_ANON_KEY || process.env.SERENEST_SUPABASE_ANON_KEY || '';

const content = `// Generated at build time from environment variables. Do not edit.
window.SERENEST_SUPABASE_URL = ${JSON.stringify(url)};
window.SERENEST_SUPABASE_ANON_KEY = ${JSON.stringify(key)};
`;

const outDir = path.join(__dirname, '..', 'js');
const outPath = path.join(outDir, 'config.js');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log('Wrote js/config.js from env (Supabase ' + (url ? 'configured' : 'not set') + ')');
