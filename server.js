// Vetta Voice — server
//
// Two jobs:
// 1. Serve the Vetta frontend (public/index.html)
// 2. Mint short-lived AssemblyAI voice agent tokens on request, so the
//    real API key never reaches the browser.
//
// Setup:
//   npm install
//   Create a .env file with:
//     ASSEMBLYAI_API_KEY=your_key_here
//     AGENT_ID=your_agent_id_here   <-- from when you ran `npm run publish`
//   npm start
//   Open http://localhost:3000 in Chrome

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const AGENT_ID = process.env.AGENT_ID;

if (!ASSEMBLYAI_API_KEY) {
  console.error('Missing ASSEMBLYAI_API_KEY in .env');
  process.exit(1);
}
if (!AGENT_ID) {
  console.error('Missing AGENT_ID in .env — this is the id printed when you ran `npm run publish` on the agent.');
  process.exit(1);
}

app.use(express.static(path.join(__dirname, 'public')));

// The frontend asks this endpoint for a token; it never sees the real API key.
app.get('/api/voice-token', async (_req, res) => {
  try {
    const url = new URL('https://agents.assemblyai.com/v1/token');
    url.searchParams.set('expires_in_seconds', '300');
    url.searchParams.set('max_session_duration_seconds', '8640');

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${ASSEMBLYAI_API_KEY}` },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Token request failed:', response.status, text);
      return res.status(response.status).send(text);
    }

    const { token } = await response.json();
    res.json({ token, agentId: AGENT_ID });
  } catch (err) {
    console.error('Token generation error:', err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.listen(PORT, () => {
  console.log(`Vetta Voice server running at http://localhost:${PORT}`);
});
