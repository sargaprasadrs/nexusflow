import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { connectWebSocket, type WsMessage } from './ws';

describe('connectWebSocket', () => {
  let originalWebSocket: typeof globalThis.WebSocket;
  let mockSockets: any[] = [];

  beforeEach(() => {
    originalWebSocket = globalThis.WebSocket;
    mockSockets = [];

    // Mock WebSocket implementation
    globalThis.WebSocket = vi.fn().mockImplementation((url: string) => {
      const socket = {
        url,
        readyState: 0, // CONNECTING
        send: vi.fn(),
        close: vi.fn(function () {
          socket.readyState = 3; // CLOSED
          if (socket.onclose) socket.onclose(new Event('close') as CloseEvent);
        }),
        onopen: null as any,
        onclose: null as any,
        onerror: null as any,
        onmessage: null as any,
      };
      mockSockets.push(socket);
      return socket;
    }) as any;
  });

  afterEach(() => {
    globalThis.WebSocket = originalWebSocket;
    vi.clearAllTimers();
  });

  it('formats channel endpoint URL correctly', () => {
    connectWebSocket('/telemetry');
    expect(globalThis.WebSocket).toHaveBeenCalledWith('ws://localhost:4000/ws/telemetry');
  });

  it('dispatches parsed JSON messages to listener', () => {
    const onMessage = vi.fn();
    connectWebSocket('alerts', onMessage);

    const socket = mockSockets[0];
    const testMsg: WsMessage = {
      type: 'rule.result',
      payload: { temperature: 42 },
      at: new Date().toISOString(),
    };

    socket.onmessage({ data: JSON.stringify(testMsg) });
    expect(onMessage).toHaveBeenCalledWith(testMsg);
  });

  it('handles non-JSON messages without crashing', () => {
    const onMessage = vi.fn();
    connectWebSocket('alerts', onMessage);

    const socket = mockSockets[0];
    expect(() => {
      socket.onmessage({ data: 'raw plain string' });
    }).not.toThrow();
    expect(onMessage).not.toHaveBeenCalled();
  });

  it('cleans up and stops reconnecting on manual close', () => {
    const socketWrapper = connectWebSocket('alerts');
    const socket = mockSockets[0];

    socketWrapper.close();
    expect(socket.close).toHaveBeenCalled();
  });
});
