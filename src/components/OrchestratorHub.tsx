import React, { useState, useEffect } from 'react';
import { Database, Play, Terminal, Layers, FileText, CheckCircle2, ShieldCheck, Cpu, Zap, Radio } from 'lucide-react';

export const OrchestratorHub: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/orchestrator/status')
      .then(res => res.json())
      .then(data => {
        setStatus(data.state);
        setLogs(prev => [`[System] Orchestrator initialized. Storage: ${data.state.storageStatus}`, ...prev]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const executeModule = async (type: string, payload: any) => {
    setLogs(prev => [`[Action] Executing ${type}...`, ...prev]);
    try {
      const res = await fetch('/api/orchestrator/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleType: type, payload })
      });
      const data = await res.json();
      setLogs(prev => [`[Result] ${data.detail}`, ...prev]);
    } catch (err) {
      setLogs(prev => [`[Error] Execution failed: ${err}`, ...prev]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Layers className="text-indigo-400" /> Enterprise Workflow Orchestrator
        </h1>
        <p className="text-gray-400 text-sm mt-2">Central hub for data storage, consensus, ML models, and file signing operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button onClick={() => executeModule('data-storage', { timeline: 'PAST' })} className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] hover:border-indigo-500 transition">
          <Database className="text-blue-400 mb-2" />
          <h3 className="text-sm font-bold text-white">Store Data (Past Timeline)</h3>
        </button>
        <button onClick={() => executeModule('consensus', {})} className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] hover:border-indigo-500 transition">
          <CheckCircle2 className="text-green-400 mb-2" />
          <h3 className="text-sm font-bold text-white">Run Blockchain Consensus</h3>
        </button>
        <button onClick={() => executeModule('file-signing', { filePaths: ['/tmp/doc1.txt'] })} className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] hover:border-indigo-500 transition">
          <ShieldCheck className="text-emerald-400 mb-2" />
          <h3 className="text-sm font-bold text-white">Sign Security Files</h3>
        </button>
      </div>

      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>Execution Telemetry Logs</span>
        </h3>
        <div className="bg-[#0D1117] rounded-xl p-4 font-mono text-xs text-gray-300 space-y-1.5 max-h-48 overflow-y-auto border border-[#21262d]">
          {logs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrchestratorHub;
