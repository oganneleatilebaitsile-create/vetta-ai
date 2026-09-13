// server/routes/voice-token.js
import express from "express";

const router = express.Router();

router.get("/voice-token", async (_req, res) => {
  const url = new URL("https://agents.assemblyai.com/v1/token");
  url.searchParams.set("expires_in_seconds", "300");
  url.searchParams.set("max_session_duration_seconds", "8640");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.ASSEMBLYAI_API_KEY}` },
  });

  if (!response.ok) {
    return res.status(response.status).send(await response.text());
  }

  const { token } = await response.json();
  res.json({ token });
});

export default router;