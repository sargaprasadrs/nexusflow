import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../types/graph';

// Data Source node (Week 2, Praveen) - e.g. "Turbine Sensor".
export default function DataSourceNode({ data, selected, isConnectable }: NodeProps<GraphNode>) {
  return (
    <div className={`nexus-node nexus-node--source ${selected ? 'selected' : ''}`}>
      <div className="nexus-node__header">📡 {data.label ?? 'Data Source'}</div>
      <div className="nexus-node__body">
        {data.deviceId ? `Device: ${data.deviceId}` : 'Pick a device'}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        isConnectable={isConnectable}
        style={{ background: '#4f8cff' }}
      />
    </div>
  );
}


