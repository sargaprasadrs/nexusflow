import test from 'node:test';
import assert from 'node:assert/strict';
import { toCsv } from './csv.js';

test('toCsv: renders header and rows', () => {
  const csv = toCsv([
    { deviceId: 'turbine-001', temperature: 85.2 },
    { deviceId: 'turbine-002', temperature: 90.1 },
  ]);
  assert.equal(csv, 'deviceId,temperature\nturbine-001,85.2\nturbine-002,90.1');
});

test('toCsv: escapes commas, quotes and newlines', () => {
  const csv = toCsv([{ note: 'a,b' }, { note: 'say "hi"' }, { note: 'line1\nline2' }]);
  assert.equal(csv, 'note\n"a,b"\n"say ""hi"""\n"line1\nline2"');
});

test('toCsv: empty input returns empty string', () => {
  assert.equal(toCsv([]), '');
});

test('toCsv: null values become empty cells', () => {
  const csv = toCsv([{ a: null, b: undefined, c: 1 }]);
  assert.equal(csv, 'a,b,c\n,,1');
});
