import { useWebSocket } from '../../hooks/useWebSocket';
import type { AlertEvent } from '../../types/telemetry';

// Live alert feed (Week 3, Praveen/Sowmya) - subscribes to /ws/alerts.
export default function AlertPanel() {
  const { lastMessage, connected } = useWebSocket<AlertEvent>('/alerts');

  return (
    <aside className="panel panel--alerts" style={{ width: 260 }}>
      <h3>Alerts {connected ? '🟢' : '⚪'}</h3>
      {lastMessage ? (
        <pre>{JSON.stringify(lastMessage, null, 2)}</pre>
      ) : (
        <p style={{ color: 'var(--color-muted)' }}>No alerts yet</p>
      )}
    </aside>
  );
}
