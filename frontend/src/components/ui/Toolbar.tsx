import { useEffect, useState } from 'react';
import type { Edge, Node } from '@xyflow/react';
import { useGraphStore } from '../../store/graphStore';
import { toast } from '../../store/toastStore';
import { api, type SavedGraph } from '../../lib/api';
import { toApiGraph } from '../../lib/graphSerializer';

// Top toolbar (Week 1-2) - graph name, new / save / load actions wired to
// /api/graphs. Compile lands in Week 2 once the RxJS compiler is in.
export default function Toolbar() {
  const graphName = useGraphStore((s) => s.graphName);
  const setGraphName = useGraphStore((s) => s.setGraphName);
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const currentGraphId = useGraphStore((s) => s.currentGraphId);
  const setCurrentGraphId = useGraphStore((s) => s.setCurrentGraphId);
  const loadGraph = useGraphStore((s) => s.loadGraph);
  const resetGraph = useGraphStore((s) => s.resetGraph);

  const [savedGraphs, setSavedGraphs] = useState<SavedGraph[]>([]);
  const [selectedGraphId, setSelectedGraphId] = useState('');
  const [saving, setSaving] = useState(false);

  // Load the dropdown once on mount.
  useEffect(() => {
    api
      .listGraphs()
      .then(setSavedGraphs)
      .catch(() => {
        // Backend may not be running during dev - Load retries on click.
      });
  }, []);

  const handleNew = () => {
    resetGraph();
    setSelectedGraphId('');
    toast.info('Started a new graph');
  };

  const handleSave = async () => {
    if (!graphName.trim()) {
      toast.error('Give the graph a name before saving');
      return;
    }
    setSaving(true);
    try {
      const payload = toApiGraph(graphName.trim(), nodes, edges);
      if (currentGraphId) {
        const saved = await api.updateGraph(currentGraphId, payload);
        setCurrentGraphId(saved._id);
        toast.success(`Saved "${saved.name}"`);
      } else {
        const saved = await api.createGraph(payload);
        setCurrentGraphId(saved._id);
        setSelectedGraphId(saved._id);
        setSavedGraphs((prev) => [...prev, saved]);
        toast.success(`Created "${saved.name}"`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async () => {
    if (!selectedGraphId) {
      toast.info('Pick a saved graph from the dropdown, or save this one first');
      return;
    }
    try {
      const graph = await api.getGraph(selectedGraphId);
      loadGraph({
        id: graph._id,
        name: graph.name,
        nodes: graph.nodes as unknown as Node[],
        edges: graph.edges as unknown as Edge[],
      });
      toast.success(`Loaded "${graph.name}"`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Load failed');
    }
  };

  return (
    <header className="toolbar">
      <span className="toolbar__logo">NexusFlow</span>
      <input
        value={graphName}
        onChange={(e) => setGraphName(e.target.value)}
        placeholder="Graph name"
      />
      <button onClick={handleNew}>New</button>
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save'}
      </button>
      <select
        value={selectedGraphId}
        onChange={(e) => setSelectedGraphId(e.target.value)}
        className="toolbar__select"
        aria-label="Saved graphs"
      >
        <option value="">Load…</option>
        {savedGraphs.map((g) => (
          <option key={g._id} value={g._id}>
            {g.name}
          </option>
        ))}
      </select>
      <button onClick={handleLoad}>Load</button>
      <button title="Compile graph to RxJS pipeline (Week 2)" disabled>
        Compile
      </button>
    </header>
  );
}
