import { useGraphStore } from '../../store/graphStore';
import { toast } from '../../store/toastStore';

// Node property panel (Week 2) - edit the selected node's data.
// Week 1: shows the node's config JSON and lets you delete the node.
// TODO: render a form per node type (device picker, math ops, thresholds, actions).
export default function NodePropertyPanel() {
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const setNodes = useGraphStore((s) => s.setNodes);
  const setEdges = useGraphStore((s) => s.setEdges);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);
  const selected = nodes.find((n) => n.id === selectedNodeId);

  const handleDelete = () => {
    if (!selected) return;
    setNodes(nodes.filter((n) => n.id !== selected.id));
    // Remove any edges connected to the deleted node.
    setEdges(
      edges.filter((e) => e.source !== selected.id && e.target !== selected.id)
    );
    setSelectedNodeId(null);
    toast.info(`Deleted node "${selected.id}"`);
  };

  return (
    <aside className="panel panel--properties" style={{ width: 260 }}>
      <h3>Properties</h3>
      {selected ? (
        <div>
          <p>
            <strong>{selected.type}</strong> — {selected.id}
          </p>
          <pre>{JSON.stringify(selected.data ?? {}, null, 2)}</pre>
          <button className="danger-btn" onClick={handleDelete}>
            Delete node
          </button>
          {/* Edit form comes in Week 2 */}
        </div>
      ) : (
        <p style={{ color: 'var(--color-muted)' }}>Select a node to edit its properties</p>
      )}
    </aside>
  );
}
