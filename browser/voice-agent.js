// browser/voice-agent.js
const AGENT_ID = "agent_5d52d489ce164a41814464e7ca236644"; // from POST /v1/agents

const { token } = await fetch("/api/voice-token").then((r) => r.json());

const wsUrl = new URL("wss://agents.assemblyai.com/v1/ws");
wsUrl.searchParams.set("token", token);
const ws = new WebSocket(wsUrl);

ws.addEventListener("open", () => {
  ws.send(
    JSON.stringify({
      type: "session.update",
      session: { agent_id: AGENT_ID },
    }),
  );
});

ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  // Handle session.ready, reply.audio, transcript.*, tool.call, etc.
  console.log(message);
});