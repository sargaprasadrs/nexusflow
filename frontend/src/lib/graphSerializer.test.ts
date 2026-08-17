import { describe, expect, it } from 'vitest';
import { deserializeGraph, serializeGraphToJson, toApiGraph } from './graphSerializer';

const node = (overrides: Record<string, unknown> = {}) => ({
  id: 'n1',
  type: 'mathOp',
  position: { x: 10, y: 20 },
  data: { op: 'add', field: 'temperature', value: 1 },
  ...overrides,
});

describe('toApiGraph', () => {
  it('keeps only the fields the backend model stores', () => {
    const api = toApiGraph('Test', [
      node({ measured: { width: 100, height: 50 }, selected: true, dragging: false }),
    ], []);
    expect(api).toEqual({
      name: 'Test',
      nodes: [
        {
          id: 'n1',
          type: 'mathOp',
          position: { x: 10, y: 20 },
          data: { op: 'add', field: 'temperature', value: 1 },
        },
      ],
      edges: [],
    });
  });

  it('defaults a missing node type to dataSource', () => {
    const api = toApiGraph('Test', [node({ type: undefined })], []);
    expect(api.nodes[0].type).toBe('dataSource');
  });
});

describe('serialize / deserialize', () => {
  it('round-trips a graph through JSON', () => {
    const json = serializeGraphToJson('Roundtrip', [node()], [
      { id: 'e1', source: 'n1', target: 'n2' },
    ]);
    const parsed = JSON.parse(json);
    expect(parsed.name).toBe('Roundtrip');
    expect(parsed.nodes[0].id).toBe('n1');

    const { nodes, edges } = deserializeGraph(json);
    expect(nodes).toHaveLength(1);
    expect(edges).toHaveLength(1);
  });

  it('throws on malformed graph JSON', () => {
    expect(() => deserializeGraph('{"nodes":[]}')).toThrow(/expected \{ name, nodes, edges \}/);
    expect(() => deserializeGraph('not json')).toThrow();
  });
});
