import { WebSocketServer } from 'ws';
import { broker } from './broker.js';

// Attach the WebSocket broker to the HTTP server.
// Paths: /ws/telemetry (live telemetry), /ws/alerts (rule results / alerts).
// TODO (Week 1-3, Chandra): authenticate clients, handle reconnects.
export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (socket, req) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const channel = url.pathname; // e.g. /ws/telemetry or /ws/alerts
    broker.subscribe(channel, socket);
    console.log(`[ws] client connected to ${channel}`);

    socket.on('close', () => broker.unsubscribe(channel, socket));
    socket.on('error', (err) => console.error('[ws] socket error:', err.message));
  });

  console.log('[ws] WebSocket broker attached');
  return wss;
}
