import type { NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../types/graph';

// Action Trigger node (Week 2) - alert + webhook actions (e.g. "SMS Alert").
export default function ActionNode({ data, selected }: NodeProps<GraphNode>) {
  return (
    <div className={`nexus-node nexus-node--action ${selected ? 'selected' : ''}`}>
      <div className="nexus-node__header">🚨 {data.label ?? 'Action'}</div>
      <div className="nexus-node__body">{data.actionType ?? 'alert'}</div>
    </div>
  );
}
