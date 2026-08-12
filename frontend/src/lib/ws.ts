// WebSocket client helper (Week 3, live streams).
// Channels: /ws/telemetry, /ws/alerts (proxied by Vite to the backend).

const DEFAULT_WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:4000/ws';

export interface WsMessage<T = unknown> {
  type: string;
  payload: T;
  at: string;
}

export function connectWebSocket(channel: string, onMessage: (msg: WsMessage) => void) {
  const url = `${DEFAULT_WS_URL}${channel.startsWith('/') ? channel : `/${channel}`}`;
  const socket = new WebSocket(url);

  socket.onmessage = (event) => {
    try {
      onMessage(JSON.parse(event.data as string) as WsMessage);
    } catch {
      // ignore non-JSON frames
    }
  };

  // TODO (Praveen/Sarga, Week 3): automatic reconnect with exponential backoff.

  return socket;
}
