import type { Node } from '@xyflow/react';
import { useGraphStore } from '../../store/graphStore';
import type { NodeType } from '../../types/graph';

// Node palette - click or drag a node type to add it to the canvas.
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

  const onDragStart = (event: React.DragEvent, type: NodeType) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="panel panel--palette" style={{ width: 200 }}>
      <h3>Node Library</h3>
      {PALETTE.map((item) => (
        <button
          key={item.type}
          className="palette-item"
          draggable
          onDragStart={(e) => onDragStart(e, item.type)}
          onClick={() => addNode(item.type)}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}
