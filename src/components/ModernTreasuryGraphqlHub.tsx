import React, { useState, useEffect } from 'react';
import { Database, Terminal, Code2, Play, CheckCircle2, Shield, RefreshCw, Layers } from 'lucide-react';

export const ModernTreasuryGraphqlHub: React.FC = () => {
  const [queries, setQueries] = useState<Record<string, string>>({});
  const [selectedQuery, setSelectedQuery] = useState<string>('CreateOrganization');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/mt/queries')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQueries(data.queries);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleExecute = async (opName: string) => {
    setExecuting(true);
    setSelectedQuery(opName);
    try {
      const res = await fetch('/api/mt/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName: opName, variables: { timestamp: new Date().toISOString() } })
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Database className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Modern Treasury GraphQL Persistent Queries Hub</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>SHA-256 Persisted Query Aliases</span>
              <span className="text-xs font-mono px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                {Object.keys(queries).length} OPERATIONS REGISTERED
              </span>
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl font-mono">
              Client: <span className="text-emerald-300">admin_super_app_client</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Operations List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Registered GraphQL Persistent Query Hashes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {Object.entries(queries).map(([name, hash]) => (
                <div
                  key={name}
                  onClick={() => handleExecute(name)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    selectedQuery === name
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-md'
                      : 'bg-[#0D1117] border-[#30363D] hover:border-gray-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        HASHED
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-gray-400 truncate">{hash}</p>
                  </div>
                  <div className="flex justify-end pt-2 mt-2 border-t border-[#21262d]">
                    <button className="text-[11px] font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                      <Play className="w-3 h-3" /> Execute Query
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Execution Result Inspector */}
        <div className="space-y-6">
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Query Execution Response</span>
            </h3>
            <div className="bg-[#0D1117] rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-96 overflow-y-auto border border-[#21262d]">
              {executing ? (
                <p className="text-gray-400 animate-pulse">Executing persisted query via Apollo GraphQL link...</p>
              ) : executionResult ? (
                <pre>{JSON.stringify(executionResult, null, 2)}</pre>
              ) : (
                <p className="text-gray-400">Click any persisted query on the left to execute it.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTreasuryGraphqlHub;
