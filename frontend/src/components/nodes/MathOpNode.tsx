import type { NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../types/graph';

// Math Operation node (Week 2, Praveen) - add/subtract/multiply/divide on a field.
export default function MathOpNode({ data, selected }: NodeProps<GraphNode>) {
  return (
    <div className={`nexus-node nexus-node--math ${selected ? 'selected' : ''}`}>
      <div className="nexus-node__header">🧮 {data.label ?? 'Math Op'}</div>
      <div className="nexus-node__body">
        {data.field ? `${data.op ?? '+'} on ${data.field}` : 'Configure operation'}
      </div>
    </div>
  );
}
