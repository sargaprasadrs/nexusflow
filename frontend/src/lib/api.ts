// Minimal REST client for the backend API (Week 1: graph save/load).
// Dev proxy forwards /api to the backend (see vite.config.ts).
import type { ApiGraph } from '../types/graph';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // non-JSON error body - keep the generic message
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface SavedGraph extends ApiGraph {
  _id: string;
  version: number;
  updatedAt: string;
}

export interface CompileResult {
  ok: boolean;
  graphId: string;
  name: string;
  stageCount: number;
  stages: Array<{ nodeId: string; type: string; config: Record<string, unknown> }>;
  compiledAt: string;
}

export interface HealthResult {
  status: 'ok' | 'degraded';
  db: { ready: boolean; state: string };
  uptime: number;
}

export interface RunningRule {
  graphId: string;
  name: string;
  stageCount: number;
  startedAt: string;
}

export interface ExecuteResult {
  ok: boolean;
  graphId: string;
  name: string;
  stageCount: number;
  startedAt: string;
}

export interface StopResult {
  ok: boolean;
  graphId: string;
  stoppedAt: string;
  durationMs: number;
}

export const api = {
  health: () => request<HealthResult>('/health'),

  compileGraph: (id: string) =>
    request<CompileResult>(`/graphs/${id}/compile`, { method: 'POST' }),

  listGraphs: () => request<SavedGraph[]>('/graphs'),

  getGraph: (id: string) => request<SavedGraph>(`/graphs/${id}`),

  createGraph: (graph: ApiGraph) =>
    request<SavedGraph>('/graphs', { method: 'POST', body: JSON.stringify(graph) }),

  updateGraph: (id: string, graph: ApiGraph) =>
    request<SavedGraph>(`/graphs/${id}`, { method: 'PUT', body: JSON.stringify(graph) }),

  executeGraph: (id: string) =>
    request<ExecuteResult>(`/graphs/${id}/execute`, { method: 'POST' }),

  stopGraph: (id: string) =>
    request<StopResult>(`/graphs/${id}/stop`, { method: 'POST' }),

  runningRules: () => request<RunningRule[]>('/graphs/running'),
};
