import { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { api } from '../../lib/api';

interface AlertItem {
  id: string;
  ruleName?: string;
  deviceId?: string;
  message?: string;
  value?: Record<string, unknown>;
  at: string;
}

// Live alert feed (subscribes to /ws/alerts & renders live feed cards).
export default function AlertPanel() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const { lastMessage, connected } = useWebSocket<unknown>('/alerts');

  // Fetch initial alerts from DB on mount
  useEffect(() => {
    api
      .listAlerts()
      .then((data) => {
        if (Array.isArray(data)) {
          const initial: AlertItem[] = data.map((a: Record<string, unknown>) => {
            const meta = (a.meta ?? {}) as Record<string, unknown>;
            return {
              id: (a._id as string) ?? String(Math.random()),
              ruleName: (a.ruleId as string) ?? 'Telemetry Rule',
              deviceId: (a.deviceId as string) ?? 'unknown',
              message: (meta.message as string) ?? 'Alert triggered',
              value: a.value as Record<string, unknown>,
              at: a.createdAt
                ? new Date(a.createdAt as string).toLocaleTimeString()
                : new Date().toLocaleTimeString(),
            };
          });
          setAlerts(initial.slice(0, 30));
        }
      })
      .catch(() => {});
  }, []);

  // Listen for live WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;
    const payload = (lastMessage.payload ?? {}) as Record<string, unknown>;
    const point = (payload.point ?? {}) as Record<string, unknown>;
    const meta = (point.meta ?? {}) as Record<string, unknown>;
    const fields = (point.fields ?? {}) as Record<string, unknown>;
    const deviceId = (meta.deviceId as string) ?? (point.deviceId as string) ?? 'sensor-temp-101';
    
    const fieldsStr = Object.entries(fields)
      .map(([k, v]) => `${k}: ${typeof v === 'number' ? v.toFixed(1) : v}`)
      .join(', ');

    const newAlert: AlertItem = {
      id: `${Date.now()}-${Math.random()}`,
      ruleName: (payload.name as string) ?? 'Live Rule',
      deviceId,
      message: fieldsStr || 'Threshold condition met',
      value: fields,
      at: new Date().toLocaleTimeString(),
    };

    setAlerts((prev) => [newAlert, ...prev.slice(0, 29)]);
  }, [lastMessage]);

  return (
    <aside className="panel panel--alerts" style={{ width: 280, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>Alerts {connected ? '🟢' : '⚪'}</h3>
        <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>{alerts.length} live</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alerts.length > 0 ? (
          alerts.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'rgba(255, 90, 110, 0.12)',
                borderLeft: '3px solid #ff5a6e',
                borderRadius: 6,
                padding: '8px 10px',
                fontSize: 11,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#ff5a6e' }}>
                <span>🚨 {item.ruleName}</span>
                <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>{item.at}</span>
              </div>
              <div style={{ color: 'var(--color-text)', marginTop: 4 }}>
                Device: <strong>{item.deviceId}</strong>
              </div>
              <div style={{ color: 'var(--color-muted)', marginTop: 3, fontFamily: 'monospace', fontSize: 10 }}>
                {item.message}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--color-muted)', fontSize: 12 }}>No alerts triggered yet</p>
        )}
      </div>
    </aside>
  );
}

