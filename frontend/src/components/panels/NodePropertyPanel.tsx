import { useGraphStore } from '../../store/graphStore';

// Node property panel (Week 2) - edit the selected node's data.
// TODO: render a form per node type (device picker, math ops, thresholds, actions).
export default function NodePropertyPanel() {
  const nodes = useGraphStore((s) => s.nodes);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const selected = nodes.find((n) => n.id === selectedNodeId);

  return (
    <aside className="panel panel--properties" style={{ width: 260 }}>
      <h3>Properties</h3>
      {selected ? (
        <div>
          <p>
            <strong>{selected.type}</strong> — {selected.id}
          </p>
          <pre>{JSON.stringify(selected.data ?? {}, null, 2)}</pre>
          {/* Edit form comes in Week 2 */}
        </div>
      ) : (
        <p style={{ color: 'var(--color-muted)' }}>Select a node to edit its properties</p>
      )}
    </aside>
  );
}
