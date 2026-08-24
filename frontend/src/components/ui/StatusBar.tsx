import { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { api, type RunningRule } from '../../lib/api';

// Bottom status bar - shows WebSocket connection, database state, and running rules.
export default function StatusBar() {
  const { connected } = useWebSocket('/telemetry');
  const [dbReady, setDbReady] = useState<boolean | null>(null);
  const [runningRules, setRunningRules] = useState<RunningRule[]>([]);

  // Poll the backend health endpoint so the DB state stays current even when
  // MongoDB drops or comes back while the app is open.
  useEffect(() => {
    let active = true;
    const check = () => {
      api
        .health()
        .then((h) => active && setDbReady(h.db.ready))
        .catch(() => active && setDbReady(false));
      api
        .runningRules()
        .then((rules) => active && setRunningRules(rules))
        .catch(() => active && setRunningRules([]));
    };
    check();
    const timer = setInterval(check, 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const dbLabel = dbReady === null ? '…' : dbReady ? 'connected' : 'disconnected';
  const execLabel =
    runningRules.length === 0
      ? 'idle'
      : runningRules.length === 1
        ? `1 rule active (${runningRules[0].name})`
        : `${runningRules.length} rules active`;

  return (
    <footer className="statusbar">
      <span>Telemetry stream: {connected ? 'connected' : 'disconnected'}</span>
      <span>Database: {dbLabel}</span>
      <span>Execution: {execLabel}</span>
      <span>v0.1.0</span>
    </footer>
  );
}
