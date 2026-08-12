import { useWebSocket } from '../../hooks/useWebSocket';

// Bottom status bar - shows WebSocket connection and execution state.
export default function StatusBar() {
  const { connected } = useWebSocket('/telemetry');

  return (
    <footer className="statusbar">
      <span>Telemetry stream: {connected ? 'connected' : 'disconnected'}</span>
      <span>Execution: idle</span>
      <span>v0.1.0</span>
    </footer>
  );
}
