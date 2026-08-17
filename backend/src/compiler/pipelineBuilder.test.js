import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPipeline, topologicalSort } from './pipelineBuilder.js';

const node = (id, type, data = {}) => ({ id, type, data });
const edge = (id, source, target) => ({ id, source, target });

test('topologicalSort: orders a linear chain source -> action', () => {
  const nodes = [node('c', 'action'), node('a', 'dataSource'), node('b', 'filter')];
  const edges = [edge('e1', 'a', 'b'), edge('e2', 'b', 'c')];
  const order = topologicalSort(nodes, edges).map((n) => n.id);
  assert.deepStrictEqual(order, ['a', 'b', 'c']);
});

test('topologicalSort: respects every edge (source before target) in a diamond', () => {
  const nodes = [node('a', 'dataSource'), node('b', 'filter'), node('c', 'mathOp'), node('d', 'action')];
  const edges = [edge('e1', 'a', 'b'), edge('e2', 'a', 'c'), edge('e3', 'b', 'd'), edge('e4', 'c', 'd')];
  const order = topologicalSort(nodes, edges).map((n) => n.id);
  assert.equal(order.length, 4);
  for (const e of edges) {
    assert.ok(order.indexOf(e.source) < order.indexOf(e.target), `${e.source} must run before ${e.target}`);
  }
});

test('topologicalSort: throws 400 on a cycle', () => {
  const nodes = [node('a', 'dataSource'), node('b', 'filter')];
  const edges = [edge('e1', 'a', 'b'), edge('e2', 'b', 'a')];
  assert.throws(() => topologicalSort(nodes, edges), (err) => {
    assert.equal(err.message, 'Graph contains a cycle and cannot be compiled');
    assert.equal(err.status, 400);
    return true;
  });
});

test('buildPipeline: maps nodes to stages in topological order', () => {
  const graph = {
    name: 'Test',
    nodes: [
      node('n1', 'dataSource', { deviceId: 'turbine-001' }),
      node('n2', 'mathOp', { op: 'add', field: 'temperature', value: 1 }),
      node('n3', 'action', { actionType: 'alert' }),
    ],
    edges: [edge('e1', 'n1', 'n2'), edge('e2', 'n2', 'n3')],
  };
  const stages = buildPipeline(graph);
  assert.deepStrictEqual(
    stages.map((s) => s.nodeId),
    ['n1', 'n2', 'n3']
  );
  assert.equal(typeof stages[0].operator, 'function');
  assert.deepStrictEqual(stages[1].config, { op: 'add', field: 'temperature', value: 1 });
});

test('buildPipeline: throws for an unregistered node type', () => {
  const graph = {
    name: 'Broken',
    nodes: [node('n1', 'totallyUnknown')],
    edges: [],
  };
  assert.throws(() => buildPipeline(graph), /No operator registered for node type "totallyUnknown"/);
});
