// WebSocket client helper (Week 3, live streams).
// Channels: /ws/telemetry, /ws/alerts (proxied by Vite to the backend).

const DEFAULT_WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:4000/ws';

export interface WsMessage<T = unknown> {
  type: string;
  payload: T;
  at: string;
}

export interface ManagedWebSocket {
  close: () => void;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  onopen: ((ev: Event) => void) | null;
  onclose: ((ev: CloseEvent) => void) | null;
  onerror: ((ev: Event) => void) | null;
  onmessage: ((ev: MessageEvent) => void) | null;
  readonly readyState: number;
}

export function connectWebSocket(
  channel: string,
  onMessage?: (msg: WsMessage) => void,
  options: { maxRetries?: number; baseDelayMs?: number; maxDelayMs?: number } = {}
) {
  const url = `${DEFAULT_WS_URL}${channel.startsWith('/') ? channel : `/${channel}`}`;
  const maxRetries = options.maxRetries ?? 10;
  const baseDelayMs = options.baseDelayMs ?? 1000;
  const maxDelayMs = options.maxDelayMs ?? 30000;

  let ws: WebSocket | null = null;
  let retryCount = 0;
  let isClosedManually = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  const wrapper: ManagedWebSocket = {
    onopen: null,
    onclose: null,
    onerror: null,
    onmessage: null,
    get readyState() {
      return ws ? ws.readyState : 3; // 3 = CLOSED
    },
    send(data) {
      if (ws && ws.readyState === 1) { // 1 = OPEN
        ws.send(data);
      }
    },
    close() {
      isClosedManually = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close();
    },
  };

  function connect() {
    if (isClosedManually) return;

    try {
      ws = new WebSocket(url);
    } catch {
      scheduleReconnect();
      return;
    }

    ws.onopen = (event) => {
      retryCount = 0;
      wrapper.onopen?.(event);
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data as string) as WsMessage;
        onMessage?.(parsed);
      } catch {
        // ignore non-JSON frames
      }
      wrapper.onmessage?.(event);
    };

    ws.onerror = (event) => {
      wrapper.onerror?.(event);
    };

    ws.onclose = (event) => {
      wrapper.onclose?.(event);
      if (!isClosedManually) {
        scheduleReconnect();
      }
    };
  }

  function scheduleReconnect() {
    if (isClosedManually || retryCount >= maxRetries) return;
    const delay = Math.min(baseDelayMs * Math.pow(2, retryCount), maxDelayMs);
    retryCount++;
    reconnectTimer = setTimeout(connect, delay);
  }

  connect();

  return wrapper as unknown as WebSocket;
}
