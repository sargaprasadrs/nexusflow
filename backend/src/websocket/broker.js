// Minimal channel-based WebSocket broker (Week 3).
// Channels: '/ws/telemetry', '/ws/alerts'.
import { WebSocket } from 'ws';

const channels = new Map(); // channel -> Set<socket>

export const broker = {
  subscribe(channel, socket) {
    if (!channels.has(channel)) channels.set(channel, new Set());
    channels.get(channel).add(socket);
  },

  unsubscribe(channel, socket) {
    channels.get(channel)?.delete(socket);
  },

  // Broadcast a JSON payload to every client subscribed to the channel.
  publish(channel, payload) {
    const message = JSON.stringify(payload);
    for (const socket of channels.get(channel) ?? []) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    }
  },

  broadcast(payload) {
    for (const channel of channels.keys()) this.publish(channel, payload);
  },

  subscriberCount(channel) {
    return channels.get(channel)?.size ?? 0;
  },
};
