import type { NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../types/graph';

// Filter node (Week 2) - keep points matching a condition.
export default function FilterNode({ data, selected }: NodeProps<GraphNode>) {
  return (
    <div className={`nexus-node nexus-node--filter ${selected ? 'selected' : ''}`}>
      <div className="nexus-node__header">🔍 {data.label ?? 'Filter'}</div>
      <div className="nexus-node__body">
        {data.field && data.threshold !== undefined
          ? `${data.field} ${data.operator ?? '>'} ${data.threshold}`
          : 'Configure condition'}
      </div>
    </div>
  );
}
