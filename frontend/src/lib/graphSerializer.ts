// Graph <-> JSON serialization (Praveen, Day 4).
// Produces the exact JSON shape the backend compiler consumes
// (see backend/src/models/Graph.js).
import type { Edge, Node } from '@xyflow/react';
import type { ApiGraph, GraphNode, SerializedGraph } from '../types/graph';

export function serializeGraph(
  name: string,
  nodes: Node[],
  edges: Edge[]
): SerializedGraph {
  return {
    name,
    // React Flow nodes may carry extra props; the backend Graph model only
    // needs { id, type, position, data } - see toApiGraph below.
    nodes: nodes as GraphNode[],
    edges,
  };
}

export function serializeGraphToJson(name: string, nodes: Node[], edges: Edge[]): string {
  return JSON.stringify(serializeGraph(name, nodes, edges), null, 2);
}

export function deserializeGraph(input: string | SerializedGraph): {
  nodes: Node[];
  edges: Edge[];
} {
  const graph = typeof input === 'string' ? (JSON.parse(input) as SerializedGraph) : input;
  if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
    throw new Error('Invalid graph JSON: expected { name, nodes, edges }');
  }
  return { nodes: graph.nodes, edges: graph.edges };
}

// Serialize to the backend API shape (used by save/load).
export function toApiGraph(name: string, nodes: Node[], edges: Edge[]): ApiGraph {
  return {
    name,
    nodes: nodes.map(({ id, type, position, data }) => ({
      id,
      type: type ?? 'dataSource',
      position: { x: position.x, y: position.y },
      data: (data ?? {}) as Record<string, unknown>,
    })),
    edges: edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
      id,
      source,
      target,
      sourceHandle,
      targetHandle,
    })),
  };
}
