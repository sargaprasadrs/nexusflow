import type { NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../types/graph';

// Data Source node (Week 2, Praveen) - e.g. "Turbine Sensor".
// TODO: node header + icon, device selector, live preview.
export default function DataSourceNode({ data, selected }: NodeProps<GraphNode>) {
  return (
    <div className={`nexus-node nexus-node--source ${selected ? 'selected' : ''}`}>
      <div className="nexus-node__header">📡 {data.label ?? 'Data Source'}</div>
      <div className="nexus-node__body">
        {data.deviceId ? `Device: ${data.deviceId}` : 'Pick a device'}
      </div>
    </div>
  );
}
