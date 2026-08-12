import type { Node } from '@xyflow/react';
import { useGraphStore } from '../../store/graphStore';
import type { NodeType } from '../../types/graph';

// Node palette (Week 1-2) - click (or drag, TODO) a node type to add it to the canvas.
const PALETTE: Array<{ type: NodeType; label: string }> = [
  { type: 'dataSource', label: 'Data Source' },
  { type: 'mathOp', label: 'Math Operation' },
  { type: 'filter', label: 'Filter' },
  { type: 'conditional', label: 'Conditional' },
  { type: 'aggregation', label: 'Aggregation' },
  { type: 'action', label: 'Action Trigger' },
];

export default function Sidebar() {
  const nodes = useGraphStore((s) => s.nodes);
  const setNodes = useGraphStore((s) => s.setNodes);

  const addNode = (type: NodeType) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 },
      data: { label: type },
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <aside className="panel panel--palette" style={{ width: 200 }}>
      <h3>Node Library</h3>
      {PALETTE.map((item) => (
        <button
          key={item.type}
          className="palette-item"
          onClick={() => addNode(item.type)}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}
