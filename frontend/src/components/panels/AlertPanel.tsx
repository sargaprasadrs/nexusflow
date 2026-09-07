import { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { api } from '../../lib/api';
import { toast } from '../../store/toastStore';

interface AlertItem {
  id: string;
  ruleId?: string;
  ruleName?: string;
  deviceId?: string;
  message?: string;
  value?: Record<string, unknown>;
  status?: string;
  at: string;
}

// Live alert feed (subscribes to /ws/alerts & renders live feed cards).
export default function AlertPanel() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
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
              ruleId: (a.ruleId as string) ?? undefined,
              ruleName: (a.ruleId as string) ?? 'Telemetry Rule',
              deviceId: (a.deviceId as string) ?? 'unknown',
              message: (meta.message as string) ?? 'Alert triggered',
              value: a.value as Record<string, unknown>,
              status: (a.status as string) ?? 'open',
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

  // Notify the user when the alert WebSocket connects/disconnects.
  useEffect(() => {
    if (connected) {
      toast.info('Alert feed connected');
    }
  }, [connected]);

  // Listen for live WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;
    const payload = (lastMessage.payload ?? {}) as Record<string, unknown>;
    const point = (payload.point ?? {}) as Record<string, unknown>;
    const meta = (point.meta ?? {}) as Record<string, unknown>;
    const fields = (point.fields ?? {}) as Record<string, unknown>;
    const deviceId =
      (meta.deviceId as string) ?? (point.deviceId as string) ?? 'sensor-temp-101';

    const fieldsStr = Object.entries(fields)
      .map(([k, v]) => `${k}: ${typeof v === 'number' ? v.toFixed(1) : v}`)
      .join(', ');

    const newAlert: AlertItem = {
      id: `${Date.now()}-${Math.random()}`,
      ruleId: (payload.graphId as string) ?? undefined,
      ruleName: (payload.name as string) ?? 'Live Rule',
      deviceId,
      message: fieldsStr || 'Threshold condition met',
      value: fields,
      status: 'open',
      at: new Date().toLocaleTimeString(),
    };

    setAlerts((prev) => [newAlert, ...prev.slice(0, 29)]);

    // Push a toast for every new live alert so the user sees it even when
    // the AlertPanel isn't the focused panel.
    toast.info(`🚨 ${newAlert.ruleName}: ${newAlert.deviceId} — ${newAlert.message}`);
  }, [lastMessage]);

  // Acknowledge (dismiss) an alert from the live feed.
  const acknowledge = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setPinnedId(null);
  };

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
                background: pinnedId === item.id ? 'rgba(79, 140, 255, 0.12)' : 'rgba(255, 90, 110, 0.12)',
                borderLeft: `3px solid ${pinnedId === item.id ? '#4f8cff' : '#ff5a6e'}`,
                borderRadius: 6,
                padding: '8px 10px',
                fontSize: 11,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#ff5a6e' }}>
                <span>🚨 {item.ruleName}</span>
                <span style={{ color: 'var(--color-muted)', fontWeight: 400, fontSize: 10 }}>{item.at}</span>
              </div>
              <div style={{ color: 'var(--color-text)', marginTop: 4 }}>
                Device: <strong>{item.deviceId}</strong>
              </div>
              <div style={{ color: 'var(--color-muted)', marginTop: 3, fontFamily: 'monospace', fontSize: 10 }}>
                {item.message}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                {item.status === 'open' && (
                  <button
                    className="danger-btn"
                    style={{ fontSize: 10, padding: '2px 8px', margin: 0 }}
                    onClick={() => acknowledge(item.id)}
                  >
                    Acknowledge
                  </button>
                )}
                <button
                  style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    margin: 0,
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-muted)',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                  onClick={() => setPinnedId(pinnedId === item.id ? null : item.id)}
                >
                  {pinnedId === item.id ? 'Unpin' : 'Details'}
                </button>
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

