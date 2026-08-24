import { WebSocketServer } from 'ws';
import { broker } from './broker.js';
import { CLIENT_ORIGIN } from '../config/env.js';

// Attach the WebSocket broker to the HTTP server.
// Paths: /ws/telemetry (live telemetry), /ws/alerts (rule results / alerts).
// Validates Origin header to prevent cross-site WebSocket hijacking.

const ALLOWED_CHANNELS = new Set(['/ws/telemetry', '/ws/alerts']);

export function setupWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    // Verify the Origin header on upgrade. In production this prevents
    // rogue pages from opening WebSocket connections to our server.
    verifyClient: (info, callback) => {
      const origin = info.origin ?? info.req.headers.origin;
      // Allow connections with no Origin (e.g. server-to-server, curl).
      if (!origin) return callback(true);

      try {
        const originUrl = new URL(origin);
        const allowedUrl = new URL(CLIENT_ORIGIN);
        if (originUrl.hostname === allowedUrl.hostname && originUrl.port === allowedUrl.port) {
          return callback(true);
        }
      } catch {
        // Malformed origin — reject.
      }

      console.warn(`[ws] rejected connection from origin: ${origin}`);
      callback(false, 403, 'Forbidden origin');
    },
  });

  wss.on('connection', (socket, req) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const channel = url.pathname;

    if (!ALLOWED_CHANNELS.has(channel)) {
      socket.close(1003, `Unknown channel: ${channel}`);
      return;
    }

    broker.subscribe(channel, socket);
    console.log(`[ws] client connected to ${channel}`);

    // Heartbeat: detect dead connections every 30s.
    socket.isAlive = true;
    socket.on('pong', () => { socket.isAlive = true; });

    socket.on('close', () => broker.unsubscribe(channel, socket));
    socket.on('error', (err) => console.error('[ws] socket error:', err.message));
  });

  // Periodic heartbeat to clean up stale connections.
  const heartbeat = setInterval(() => {
    wss.clients.forEach((socket) => {
      if (!socket.isAlive) return socket.terminate();
      socket.isAlive = false;
      socket.ping();
    });
  }, 30_000);

  wss.on('close', () => clearInterval(heartbeat));

  console.log('[ws] WebSocket broker attached (origin-validated)');
  return wss;
}
