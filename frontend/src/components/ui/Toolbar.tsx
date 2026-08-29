import { useEffect, useState } from 'react';
import type { Edge, Node } from '@xyflow/react';
import { useGraphStore } from '../../store/graphStore';
import { toast } from '../../store/toastStore';
import { api, type SavedGraph } from '../../lib/api';
import { toApiGraph } from '../../lib/graphSerializer';

// Top toolbar — graph name, new / save / load / compile / execute actions.
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
  const [executing, setExecuting] = useState(false);

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

  const ensureSaved = async (): Promise<string | null> => {
    if (currentGraphId) {
      const payload = toApiGraph(graphName.trim() || 'Untitled graph', nodes, edges);
      const saved = await api.updateGraph(currentGraphId, payload);
      return saved._id;
    }
    const nameToSave = graphName.trim() || `Graph ${new Date().toLocaleTimeString()}`;
    setGraphName(nameToSave);
    const payload = toApiGraph(nameToSave, nodes, edges);
    const saved = await api.createGraph(payload);
    setCurrentGraphId(saved._id);
    setSelectedGraphId(saved._id);
    setSavedGraphs((prev) => [...prev, saved]);
    toast.success(`Saved "${saved.name}"`);
    return saved._id;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await ensureSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCompile = async () => {
    try {
      const targetId = currentGraphId ?? (await ensureSaved());
      if (!targetId) return;
      const result = await api.compileGraph(targetId);
      toast.success(
        `Compiled "${graphName}" into ${result.stageCount} stage${result.stageCount === 1 ? '' : 's'}`
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Compile failed');
    }
  };

  const handleLoad = async () => {
    if (!selectedGraphId) {
      toast.info('Pick a saved graph from the dropdown first');
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

  const handleExecute = async () => {
    if (nodes.length === 0) {
      toast.info('Add at least one node to the canvas before executing');
      return;
    }
    setExecuting(true);
    try {
      const targetId = currentGraphId ?? (await ensureSaved());
      if (!targetId) {
        setExecuting(false);
        return;
      }
      const result = await api.executeGraph(targetId);
      toast.success(`Executing "${result.name}" (${result.stageCount} stages)`);
    } catch (err) {
      setExecuting(false);
      toast.error(err instanceof Error ? err.message : 'Execute failed');
    }
  };

  const handleStop = async () => {
    setExecuting(false);
    if (!currentGraphId) {
      toast.info('No running graph to stop');
      return;
    }
    try {
      await api.stopGraph(currentGraphId);
      toast.info('Execution stopped');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Stop failed');
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
      <button onClick={handleCompile} title="Compile graph to RxJS pipeline">
        Compile
      </button>
      <button
        onClick={handleExecute}
        disabled={nodes.length === 0}
        title="Start live execution against telemetry stream"
      >
        {executing ? 'Restarting…' : 'Execute'}
      </button>
      <button
        onClick={handleStop}
        title="Stop live execution"
        style={{ background: '#ff5a6e' }}
      >
        Stop
      </button>
    </header>
  );

}
