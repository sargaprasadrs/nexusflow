import { createServer } from 'http';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { setupWebSocket } from './src/websocket/index.js';
import { PORT } from './src/config/env.js';

const server = createServer(app);

// Attach the WebSocket broker (Week 1: /ws/telemetry, /ws/alerts)
setupWebSocket(server);

// Listen immediately so /api/health (and the UI) stay reachable while MongoDB
// comes up; DB-backed routes report errors until the connection succeeds.
server.listen(PORT, () => {
  console.log(`[server] NexusFlow API listening on http://localhost:${PORT}`);
  console.log(`[server] WebSocket endpoints: /ws/telemetry, /ws/alerts`);
});

const DB_RETRY_MS = 10000;

async function startDb() {
  try {
    await connectDB();
  } catch (err) {
    console.error(
      `[server] MongoDB connection failed (${err.message}); retrying in ${DB_RETRY_MS / 1000}s`
    );
    setTimeout(startDb, DB_RETRY_MS);
  }
}

startDb();
