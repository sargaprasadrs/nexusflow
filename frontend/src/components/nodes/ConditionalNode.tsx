import type { NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../types/graph';

// Conditional / branch node (Week 2).
export default function ConditionalNode({ data, selected }: NodeProps<GraphNode>) {
  return (
    <div className={`nexus-node nexus-node--conditional ${selected ? 'selected' : ''}`}>
      <div className="nexus-node__header">🔀 {data.label ?? 'Conditional'}</div>
      <div className="nexus-node__body">Branch on a condition</div>
    </div>
  );
}
