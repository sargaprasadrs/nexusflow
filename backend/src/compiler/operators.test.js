import test from 'node:test';
import assert from 'node:assert/strict';
import { TestScheduler } from 'rxjs/testing';
import { operators } from './operators.js';

// Deterministic marble-based tests: run the operator pipeline on a virtual
// clock and compare emissions to an expected marble diagram.
function run(work) {
  const scheduler = new TestScheduler((actual, expected) => assert.deepStrictEqual(actual, expected));
  scheduler.run(work);
}

test('math: add increases the field', () => {
  run(({ cold, expectObservable }) => {
    const src = cold('a|', { a: { fields: { temperature: 10 } } });
    const out = src.pipe(operators.math({ op: 'add', field: 'temperature', value: 5 }));
    expectObservable(out).toBe('a|', { a: { fields: { temperature: 15 } } });
  });
});

test('math: subtract, multiply, divide', () => {
  run(({ cold, expectObservable }) => {
    const src = cold('a|', { a: { fields: { temperature: 10 } } });
    expectObservable(src.pipe(operators.math({ op: 'subtract', field: 'temperature', value: 3 }))).toBe('a|', {
      a: { fields: { temperature: 7 } },
    });
    expectObservable(src.pipe(operators.math({ op: 'multiply', field: 'temperature', value: 2 }))).toBe('a|', {
      a: { fields: { temperature: 20 } },
    });
    expectObservable(src.pipe(operators.math({ op: 'divide', field: 'temperature', value: 4 }))).toBe('a|', {
      a: { fields: { temperature: 2.5 } },
    });
  });
});

test('math: divide by zero yields 0 instead of Infinity', () => {
  run(({ cold, expectObservable }) => {
    const src = cold('a|', { a: { fields: { temperature: 10 } } });
    expectObservable(src.pipe(operators.math({ op: 'divide', field: 'temperature', value: 0 }))).toBe('a|', {
      a: { fields: { temperature: 0 } },
    });
  });
});

test('filter: keeps only points matching the condition', () => {
  run(({ cold, expectObservable }) => {
    const src = cold('a-b|', {
      a: { fields: { temperature: 10 } },
      b: { fields: { temperature: 20 } },
    });
    const out = src.pipe(operators.filterCondition({ field: 'temperature', operator: 'gt', value: 15 }));
    expectObservable(out).toBe('--b|', { b: { fields: { temperature: 20 } } });
  });
});

test('filter: eq matches exact values only', () => {
  run(({ cold, expectObservable }) => {
    const src = cold('a-b|', {
      a: { fields: { temperature: 20 } },
      b: { fields: { temperature: 21 } },
    });
    const out = src.pipe(operators.filterCondition({ field: 'temperature', operator: 'eq', value: 20 }));
    expectObservable(out).toBe('a--|', { a: { fields: { temperature: 20 } } });
  });
});

test('aggregation: averages the field over the window and tags the last timestamp', () => {
  run(({ cold, expectObservable }) => {
    // a@0, b@4, c@8, complete@12; window closes at t=10 -> [a, b, c]
    const src = cold('a---b---c---|', {
      a: { ts: 0, fields: { temperature: 1 } },
      b: { ts: 4, fields: { temperature: 2 } },
      c: { ts: 8, fields: { temperature: 3 } },
    });
    const out = src.pipe(operators.aggregation({ field: 'temperature', windowMs: 10, aggregate: 'avg' }));
    expectObservable(out).toBe('----------d-|', {
      d: { ts: 8, fields: { temperature: 2 } },
    });
  });
});

test('aggregation: count and max aggregates', () => {
  run(({ cold, expectObservable }) => {
    const src = cold('a---b---c---|', {
      a: { ts: 0, fields: { temperature: 1 } },
      b: { ts: 4, fields: { temperature: 9 } },
      c: { ts: 8, fields: { temperature: 4 } },
    });
    const count = src.pipe(operators.aggregation({ field: 'temperature', windowMs: 10, aggregate: 'count' }));
    const max = src.pipe(operators.aggregation({ field: 'temperature', windowMs: 10, aggregate: 'max' }));
    expectObservable(count).toBe('----------d-|', { d: { ts: 8, fields: { temperature: 3 } } });
    expectObservable(max).toBe('----------d-|', { d: { ts: 8, fields: { temperature: 9 } } });
  });
});
