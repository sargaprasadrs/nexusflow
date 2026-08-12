import { useEffect, useRef, useState } from 'react';
import { connectWebSocket, type WsMessage } from '../lib/ws';

// React hook around the WebSocket client. Returns the latest message so
// components can render live telemetry / alerts.
export function useWebSocket<T = unknown>(channel: string) {
  const [lastMessage, setLastMessage] = useState<WsMessage<T> | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = connectWebSocket(channel, (msg) => {
      setLastMessage(msg as WsMessage<T>);
    });
    socketRef.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);

    return () => socket.close();
  }, [channel]);

  return { lastMessage, connected, socket: socketRef.current };
}
