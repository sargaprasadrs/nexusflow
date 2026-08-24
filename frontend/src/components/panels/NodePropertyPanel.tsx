import type { ChangeEvent } from 'react';
import { useGraphStore } from '../../store/graphStore';
import { toast } from '../../store/toastStore';

// Node property panel (Week 2) - per-node-type editing forms.
// Selecting a node renders the appropriate form; changes flow into the graph
// store so the canvas and compiled pipeline stay in sync.

export default function NodePropertyPanel() {
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const setNodes = useGraphStore((s) => s.setNodes);
  const setEdges = useGraphStore((s) => s.setEdges);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);
  const selected = nodes.find((n) => n.id === selectedNodeId);

  /** Patch a single key in the selected node's data object. */
  const updateField = (key: string, value: unknown) => {
    if (!selected) return;
    setNodes(
      nodes.map((n) =>
        n.id === selected.id
          ? { ...n, data: { ...(n.data ?? {}), [key]: value } }
          : n,
      ),
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    setNodes(nodes.filter((n) => n.id !== selected.id));
    setEdges(
      edges.filter((e) => e.source !== selected.id && e.target !== selected.id),
    );
    setSelectedNodeId(null);
    toast.info(`Deleted node "${selected.id}"`);
  };

  // ── Reusable form controls ────────────────────────────────────────────────

  const text = (label: string, key: string, placeholder?: string) => (
    <label className="prop-label">
      {label}
      <input
        className="prop-input"
        type="text"
        placeholder={placeholder}
        value={String((selected?.data as Record<string, unknown>)?.[key] ?? '')}
        onChange={(e: ChangeEvent<HTMLInputElement>) => updateField(key, e.target.value)}
      />
    </label>
  );

  const number = (label: string, key: string, step?: number) => (
    <label className="prop-label">
      {label}
      <input
        className="prop-input"
        type="number"
        step={step}
        value={String((selected?.data as Record<string, unknown>)?.[key] ?? '')}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const v = e.target.value === '' ? undefined : Number(e.target.value);
          updateField(key, v);
        }}
      />
    </label>
  );

  const select = (label: string, key: string, options: Array<{ value: string; label: string }>) => (
    <label className="prop-label">
      {label}
      <select
        className="prop-input"
        value={String((selected?.data as Record<string, unknown>)?.[key] ?? options[0]?.value ?? '')}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => updateField(key, e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );

  // ── Per-node-type editors ──────────────────────────────────────────────────

  const dataSourceEditor = (
    <>
      {text('Device ID', 'deviceId', 'e.g. turbine-001')}
      {text('Device Type', 'deviceType', 'e.g. turbine')}
    </>
  );

  const mathOpEditor = (
    <>
      {select('Operation', 'op', [
        { value: 'add', label: 'Add (+)' },
        { value: 'subtract', label: 'Subtract (−)' },
        { value: 'multiply', label: 'Multiply (×)' },
        { value: 'divide', label: 'Divide (÷)' },
      ])}
      {text('Field', 'field', 'e.g. temperature')}
      {number('Value', 'value', 0.1)}
    </>
  );

  const filterEditor = (
    <>
      {text('Field', 'field', 'e.g. temperature')}
      {select('Operator', 'operator', [
        { value: 'gt', label: '> greater than' },
        { value: 'gte', label: '≥ greater or equal' },
        { value: 'lt', label: '< less than' },
        { value: 'lte', label: '≤ less or equal' },
        { value: 'eq', label: '= equal to' },
      ])}
      {number('Threshold', 'threshold', 0.1)}
    </>
  );

  const conditionalEditor = (
    <>
      {text('Field', 'field', 'e.g. temperature')}
      {select('Operator', 'operator', [
        { value: 'gt', label: '> greater than' },
        { value: 'gte', label: '≥ greater or equal' },
        { value: 'lt', label: '< less than' },
        { value: 'lte', label: '≤ less or equal' },
        { value: 'eq', label: '= equal to' },
      ])}
      {number('Threshold', 'threshold', 0.1)}
    </>
  );

  const aggregationEditor = (
    <>
      {text('Field', 'field', 'e.g. temperature')}
      {number('Window (ms)', 'windowMs', 1000)}
      {select('Aggregate', 'aggregate', [
        { value: 'avg', label: 'Average' },
        { value: 'sum', label: 'Sum' },
        { value: 'count', label: 'Count' },
        { value: 'min', label: 'Min' },
        { value: 'max', label: 'Max' },
      ])}
    </>
  );

  const actionEditor = (
    <>
      {select('Action Type', 'actionType', [
        { value: 'alert', label: 'Alert' },
        { value: 'webhook', label: 'Webhook' },
      ])}
      {text('Message', 'message', 'e.g. High temperature detected')}
    </>
  );

  const editors: Record<string, JSX.Element> = {
    dataSource: dataSourceEditor,
    mathOp: mathOpEditor,
    filter: filterEditor,
    conditional: conditionalEditor,
    aggregation: aggregationEditor,
    action: actionEditor,
  };

  return (
    <aside className="panel panel--properties" style={{ width: 260 }}>
      <h3>Properties</h3>
      {selected ? (
        <div>
          <p>
            <strong>{selected.type}</strong> — {selected.id}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {editors[selected.type as string] ?? (
              <p style={{ color: 'var(--color-muted)' }}>No editor for this node type</p>
            )}
          </div>
          <button className="danger-btn" onClick={handleDelete}>
            Delete node
          </button>
        </div>
      ) : (
        <p style={{ color: 'var(--color-muted)' }}>Select a node to edit its properties</p>
      )}
    </aside>
  );
}
