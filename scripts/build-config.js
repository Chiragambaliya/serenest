const fs = require('fs');
const path = require('path');
// No trailing slash (e.g. https://serenest-xxx.onrender.com)
const apiUrl = (process.env.API_URL || '').replace(/\/+$/, '');
const out = path.join(__dirname, '..', 'config.js');
const content = "// Auto-generated at build. API_BASE = backend URL when frontend is on a different host.\nwindow.API_BASE = " + JSON.stringify(apiUrl) + ";\n";
fs.writeFileSync(out, content);
console.log("Wrote config.js with API_BASE =", apiUrl || "(same-origin)");
