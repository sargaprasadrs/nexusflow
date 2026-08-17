import { create } from 'zustand';
import type { Edge, Node } from '@xyflow/react';

interface GraphState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  graphName: string;
  // Set once the current graph has been saved to the backend (POST /api/graphs).
  currentGraphId: string | null;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setGraphName: (name: string) => void;
  setCurrentGraphId: (id: string | null) => void;
  /** Replace the whole canvas with a saved graph (Load / New). */
  loadGraph: (graph: { name: string; nodes: Node[]; edges: Edge[]; id?: string | null }) => void;
  resetGraph: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  graphName: 'Untitled graph',
  currentGraphId: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  setGraphName: (graphName) => set({ graphName }),
  setCurrentGraphId: (currentGraphId) => set({ currentGraphId }),
  loadGraph: ({ name, nodes, edges, id = null }) =>
    set({ graphName: name, nodes, edges, selectedNodeId: null, currentGraphId: id }),
  resetGraph: () =>
    set({ nodes: [], edges: [], selectedNodeId: null, graphName: 'Untitled graph', currentGraphId: null }),
}));
