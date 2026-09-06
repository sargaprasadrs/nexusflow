import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type NodeTypes,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useGraphStore } from '../../store/graphStore';
import type { NodeType } from '../../types/graph';
import DataSourceNode from '../nodes/DataSourceNode';
import MathOpNode from '../nodes/MathOpNode';
import FilterNode from '../nodes/FilterNode';
import ConditionalNode from '../nodes/ConditionalNode';
import AggregationNode from '../nodes/AggregationNode';
import ActionNode from '../nodes/ActionNode';

// Custom node types - keep in sync with backend compiler nodeRegistry.
const nodeTypes: NodeTypes = {
  dataSource: DataSourceNode,
  mathOp: MathOpNode,
  filter: FilterNode,
  conditional: ConditionalNode,
  aggregation: AggregationNode,
  action: ActionNode,
};

function GraphCanvasInner() {
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const setNodes = useGraphStore((s) => s.setNodes);
  const setEdges = useGraphStore((s) => s.setEdges);
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes(applyNodeChanges(changes, nodes)),
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges(applyEdgeChanges(changes, edges)),
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges(addEdge({ ...connection, animated: true }, edges)),
    [edges, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: type },
      };

      setNodes([...nodes, newNode]);
    },
    [nodes, setNodes, screenToFlowPosition]
  );

  return (
    <div
      className="graph-canvas"
      style={{ flex: 1, position: 'relative' }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onSelectionChange={({ nodes: selected }) =>
          setSelectedNodeId(selected[0]?.id ?? null)
        }
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default function GraphCanvas() {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner />
    </ReactFlowProvider>
  );
}
