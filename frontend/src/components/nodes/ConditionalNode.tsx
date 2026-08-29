import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../types/graph';

// Conditional / branch node (Week 2).
export default function ConditionalNode({ data, selected, isConnectable }: NodeProps<GraphNode>) {
  return (
    <div className={`nexus-node nexus-node--conditional ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        isConnectable={isConnectable}
        style={{ background: '#2ecc71' }}
      />
      <div className="nexus-node__header">🔀 {data.label ?? 'Conditional'}</div>
      <div className="nexus-node__body">Branch on a condition</div>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        isConnectable={isConnectable}
        style={{ background: '#2ecc71' }}
      />
    </div>
  );
}


