import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Plus, Table, Search, ShieldCheck, AlertCircle, HardDrive, Zap } from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

interface AstraStatus {
  success: boolean;
  status: string;
  endpoint: string;
  collections: string[];
}

export const AstraDbConsole: React.FC = () => {
  const [status, setStatus] = useState<AstraStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [creating, setCreating] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<AstraStatus>('/api/astra/status');
      if (res.ok && res.data) {
        setStatus(res.data);
      } else {
        setError(res.data?.error || 'Failed to connect to Astra DB');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;
    setCreating(true);
    try {
      const res = await apiFetch<any>('/api/astra/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCollectionName })
      });
      if (res.ok) {
        setNewCollectionName('');
        fetchStatus();
      } else {
        alert(res.data?.error || 'Failed to create collection');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const loadCollectionData = async (name: string) => {
    setActiveCollection(name);
    setDataLoading(true);
    try {
      const res = await apiFetch<any>(`/api/astra/data/${name}`);
      if (res.ok && res.data) {
        setCollectionData(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-600 rounded-xl shadow-lg shadow-purple-900/20 text-white">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
              DataStax Astra DB Explorer
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono">
                NoSQL
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Sovereign Persistent Ledger & Cloud-Native Data Fabric
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStatus}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Connection
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl text-rose-400 text-sm flex items-center gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <p className="font-bold">Configuration Error</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Status & Collections */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Connection Status Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Instance Status
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                <span className="text-slate-500">Connection:</span>
                <span className={status?.success ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {status?.status || 'UNKNOWN'}
                </span>
              </div>
              <div className="flex flex-col gap-1 py-2 border-b border-slate-800/50">
                <span className="text-slate-500">API Endpoint:</span>
                <span className="text-slate-300 truncate text-[10px]">{status?.endpoint || 'NOT_CONFIGURED'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">Storage Engine:</span>
                <span className="text-purple-400">Cassandra Vector</span>
              </div>
            </div>
          </div>

          {/* Collections List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Table className="w-4 h-4 text-purple-400" />
                Collections ({status?.collections.length || 0})
              </h3>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px] pr-1">
              {status?.collections.map(name => (
                <button
                  key={name}
                  onClick={() => loadCollectionData(name)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${activeCollection === name ? 'bg-purple-600/10 border-purple-500 text-white' : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
                >
                  <span className="text-xs font-mono font-semibold">{name}</span>
                  <Table className={`w-3.5 h-3.5 ${activeCollection === name ? 'text-purple-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                </button>
              ))}
              {status?.collections.length === 0 && (
                <div className="text-center py-10 text-slate-600 italic text-xs">
                  No collections found.
                </div>
              )}
            </div>

            {/* Create Collection */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
              <input 
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="New collection name..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-purple-500"
              />
              <button 
                onClick={createCollection}
                disabled={creating || !newCollectionName}
                className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Data View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl min-h-[500px] flex flex-col overflow-hidden">
            
            {/* Toolbar */}
            <div className="bg-slate-900/80 backdrop-blur p-4 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-purple-400" />
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    {activeCollection ? `Collection: ${activeCollection}` : 'Select a Collection'}
                  </h2>
                  {activeCollection && <p className="text-[10px] text-slate-500 font-mono">Row Count: {collectionData.length}</p>}
                </div>
              </div>
              
              <div className="relative flex-1 max-w-xs hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  type="text"
                  placeholder="Filter data..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="flex-1 overflow-auto bg-slate-950/20 p-4">
              {dataLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
                  <span className="text-xs font-mono">Quering DataStax Cloud...</span>
                </div>
              ) : activeCollection ? (
                collectionData.length > 0 ? (
                  <div className="space-y-4">
                    {collectionData.map((doc, idx) => (
                      <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 font-mono text-[11px] hover:border-purple-500/50 transition-all">
                        <div className="flex justify-between items-start mb-2 border-b border-slate-800 pb-2">
                          <span className="text-purple-400 font-bold"># Document {idx + 1}</span>
                          <span className="text-slate-600 uppercase">JSON OBJECT</span>
                        </div>
                        <pre className="text-emerald-300 whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(doc, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 py-20">
                    <Table className="w-12 h-12 opacity-20" />
                    <p className="text-sm italic">This collection is currently empty.</p>
                  </div>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 py-20">
                  <Database className="w-16 h-12 opacity-10" />
                  <p className="text-sm">Select a collection from the sidebar to visualize the data fabric.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 shrink-0 mt-1">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-tight">Cassandra Vector Injected</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                This instance is optimized for AI agentic retrieval. Your sovereign banking data can be indexed as vector embeddings for sub-second semantic search and intelligent ledger reconciliation.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
