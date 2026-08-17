import GraphCanvas from './components/canvas/GraphCanvas';
import Toolbar from './components/ui/Toolbar';
import Sidebar from './components/ui/Sidebar';
import StatusBar from './components/ui/StatusBar';
import NodePropertyPanel from './components/panels/NodePropertyPanel';
import AlertPanel from './components/panels/AlertPanel';
import Toasts from './components/ui/Toasts';

export default function App() {
  return (
    <div className="app-shell">
      <Toolbar />
      <div className="app-main">
        <Sidebar />
        <GraphCanvas />
        <NodePropertyPanel />
        <AlertPanel />
      </div>
      <StatusBar />
      <Toasts />
    </div>
  );
}
