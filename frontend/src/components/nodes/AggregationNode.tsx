import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../types/graph';

// Aggregation node (Week 2) - moving average, sum, count, min, max over a window.
export default function AggregationNode({ data, selected, isConnectable }: NodeProps<GraphNode>) {
  return (
    <div className={`nexus-node nexus-node--aggregation ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        isConnectable={isConnectable}
        style={{ background: '#9b59b6' }}
      />
      <div className="nexus-node__header">📊 {data.label ?? 'Aggregation'}</div>
      <div className="nexus-node__body">
        {data.windowMs ? `Window: ${data.windowMs}ms` : 'Configure window'}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        isConnectable={isConnectable}
        style={{ background: '#9b59b6' }}
      />
    </div>
  );
}


