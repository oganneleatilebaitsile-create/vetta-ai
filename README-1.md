# Vetta Voice — Live (server + frontend, ready to run)

This is the finished last piece: a real Express server that talks to AssemblyAI,
plus Vetta's actual branded frontend wired to a live voice conversation —
no more plain AssemblyAI test page.

## Setup

```
npm install
```

Create a `.env` file in this folder:

```
ASSEMBLYAI_API_KEY=your_key_here
AGENT_ID=your_agent_id_here
PORT=3000
```

`AGENT_ID` is printed in your terminal when you ran `npm run publish` on the
agent earlier (also visible in your AssemblyAI dashboard under Agents).

## Run it

```
npm start
```

Open **http://localhost:3000** in **Chrome**. Tap the mic button, allow
microphone access, and talk. You'll see the conversation appear as text
bubbles as you go, and hear Vetta's spoken replies.

## What's actually happening

- `server.js` serves the frontend and has one API route, `/api/voice-token`,
  that asks AssemblyAI for a short-lived token using your real API key.
  The key itself never reaches the browser — only the temporary token does.
- `public/index.html` is Vetta's actual design (same dark theme as the rest
  of the project) with real microphone capture, a live WebSocket connection
  to AssemblyAI's voice agent, and playback of the agent's spoken replies —
  all in one file, no build step.

## If something goes wrong

- **"Missing ASSEMBLYAI_API_KEY" / "Missing AGENT_ID" on startup** — check your `.env` file has both, no quotes needed around the values.
- **Red error box in the browser** — usually means the server isn't running, or the token request failed. Check the terminal running `npm start` for the actual error.
- **No sound / agent doesn't respond** — make sure you allowed microphone access when Chrome asked, and that you're using Chrome specifically (Firefox and Safari have known quirks with this audio setup).
- **Mic button stays disabled** — the token/connection step failed before it could finish; check the terminal for the error AssemblyAI sent back.
