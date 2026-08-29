import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../types/graph';

// Math Operation node (Week 2, Praveen) - add/subtract/multiply/divide on a field.
export default function MathOpNode({ data, selected, isConnectable }: NodeProps<GraphNode>) {
  return (
    <div className={`nexus-node nexus-node--math ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        isConnectable={isConnectable}
        style={{ background: '#ffb347' }}
      />
      <div className="nexus-node__header">🧮 {data.label ?? 'Math Op'}</div>
      <div className="nexus-node__body">
        {data.field ? `${data.op ?? '+'} on ${data.field}` : 'Configure operation'}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        isConnectable={isConnectable}
        style={{ background: '#ffb347' }}
      />
    </div>
  );
}


