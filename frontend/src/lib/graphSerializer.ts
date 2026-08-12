// Graph <-> JSON serialization (Praveen, Day 4).
// Produces the exact JSON shape the backend compiler consumes
// (see backend/src/models/Graph.js).
import type { Edge, Node } from '@xyflow/react';
import type { SerializedGraph } from '../types/graph';

export function serializeGraph(
  name: string,
  nodes: Node[],
  edges: Edge[]
): SerializedGraph {
  return {
    name,
    nodes,
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
export function toApiGraph(name: string, nodes: Node[], edges: Edge[]) {
  return {
    name,
    nodes: nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
    edges: edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
      id,
      source,
      target,
      sourceHandle,
      targetHandle,
    })),
  };
}
