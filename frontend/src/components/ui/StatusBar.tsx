import { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { api } from '../../lib/api';

// Bottom status bar - shows WebSocket connection, database state, and execution state.
export default function StatusBar() {
  const { connected } = useWebSocket('/telemetry');
  const [dbReady, setDbReady] = useState<boolean | null>(null);

  // Poll the backend health endpoint so the DB state stays current even when
  // MongoDB drops or comes back while the app is open.
  useEffect(() => {
    let active = true;
    const check = () => {
      api
        .health()
        .then((h) => active && setDbReady(h.db.ready))
        .catch(() => active && setDbReady(false));
    };
    check();
    const timer = setInterval(check, 10000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const dbLabel = dbReady === null ? '…' : dbReady ? 'connected' : 'disconnected';

  return (
    <footer className="statusbar">
      <span>Telemetry stream: {connected ? 'connected' : 'disconnected'}</span>
      <span>Database: {dbLabel}</span>
      <span>Execution: idle</span>
      <span>v0.1.0</span>
    </footer>
  );
}
