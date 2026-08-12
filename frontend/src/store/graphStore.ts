import { create } from 'zustand';
import type { Edge, Node } from '@xyflow/react';

interface GraphState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  graphName: string;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setGraphName: (name: string) => void;
  resetGraph: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  graphName: 'Untitled graph',

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  setGraphName: (graphName) => set({ graphName }),
  resetGraph: () => set({ nodes: [], edges: [], selectedNodeId: null }),
}));
