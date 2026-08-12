import { useGraphStore } from '../../store/graphStore';
import { toApiGraph } from '../../lib/graphSerializer';

// Top toolbar (Week 1-2) - graph name, save / load / compile actions.
// TODO: wire Save/Load to the /api/graphs endpoints and Compile to /compile.
export default function Toolbar() {
  const graphName = useGraphStore((s) => s.graphName);
  const setGraphName = useGraphStore((s) => s.setGraphName);
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);

  const handleSave = () => {
    const payload = toApiGraph(graphName, nodes, edges);
    console.log('[toolbar] save graph:', payload);
    // TODO: POST /api/graphs
  };

  return (
    <header className="toolbar">
      <span className="toolbar__logo">NexusFlow</span>
      <input
        value={graphName}
        onChange={(e) => setGraphName(e.target.value)}
        placeholder="Graph name"
      />
      <button onClick={handleSave}>Save</button>
      <button>Load</button>
      <button>Compile</button>
    </header>
  );
}
