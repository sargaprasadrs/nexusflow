import test from 'node:test';
import assert from 'node:assert/strict';
import { parseGraph } from './graphParser.js';

const validGraph = {
  nodes: [{ id: 'a', type: 'dataSource' }],
  edges: [],
};

test('parseGraph: accepts a valid graph', () => {
  const result = parseGraph(validGraph);
  assert.deepStrictEqual(result, validGraph);
});

test('parseGraph: rejects a graph without nodes', () => {
  assert.throws(() => parseGraph({ edges: [] }), /nodes must be an array/);
});

test('parseGraph: rejects a graph without edges', () => {
  assert.throws(() => parseGraph({ nodes: [] }), /edges must be an array/);
});

test('parseGraph: rejects an edge referencing a missing node', () => {
  const graph = {
    nodes: [{ id: 'a', type: 'dataSource' }],
    edges: [{ id: 'e1', source: 'a', target: 'ghost' }],
  };
  assert.throws(() => parseGraph(graph), /missing target node ghost/);
});
