import type { NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../types/graph';

// Aggregation node (Week 2) - moving average, sum, count, min, max over a window.
export default function AggregationNode({ data, selected }: NodeProps<GraphNode>) {
  return (
    <div className={`nexus-node nexus-node--aggregation ${selected ? 'selected' : ''}`}>
      <div className="nexus-node__header">📊 {data.label ?? 'Aggregation'}</div>
      <div className="nexus-node__body">
        {data.windowMs ? `Window: ${data.windowMs}ms` : 'Configure window'}
      </div>
    </div>
  );
}
