// backend/scripts/env.cjs
// CJS preloader — guarantees env is loaded before ANY ESM import runs.
// Invoked by:  node -r ./scripts/env.cjs src/server.js
const dotenv = require('dotenv');
const { resolve } = require('node:path');

// Resolve .env: try relative to this file first (…/backend/.env)
const candidates = [
  resolve(__dirname, '..', '.env'),           // …/backend/.env
  resolve(process.cwd(), '.env'),             // CWD/.env  (covers `npm run dev`)
];

let loaded = 0;
for (const p of candidates) {
  const result = dotenv.config({ path: p, override: true });
  if (result.parsed && Object.keys(result.parsed).length > 0) {
    loaded = Object.keys(result.parsed).length;
    console.log(`✅ Loaded ${loaded} env vars from ${p}`);
    break;
  }
}

// Bare `require('dotenv')` loaded → process.env is set → return silently
// server.js (ESM) will now see correct env when it parses its imports.
