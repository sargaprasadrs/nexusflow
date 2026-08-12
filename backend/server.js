import { createServer } from 'http';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { setupWebSocket } from './src/websocket/index.js';
import { PORT } from './src/config/env.js';

const server = createServer(app);

// Attach the WebSocket broker (Week 1: /ws/telemetry, /ws/alerts)
setupWebSocket(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`[server] NexusFlow API listening on http://localhost:${PORT}`);
      console.log(`[server] WebSocket endpoints: /ws/telemetry, /ws/alerts`);
    });
  })
  .catch((err) => {
    console.error('[server] Failed to start:', err.message);
    process.exit(1);
  });
