import React, { useState, useEffect } from 'react';
import {
  Cpu, Database, GitBranch, Terminal, Shield, Play, Pause, RefreshCw,
  FolderTree, Share2, Layers, Activity, FileText, CheckCircle2,
  AlertCircle, ChevronRight, Send, Download, Upload, Copy, Search,
  Box, Code, HardDrive, Settings, Users, Workflow, Sparkles, Plus, Trash2, Eye
} from 'lucide-react';

interface EndpointDef {
  category: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
  path: string;
  defaultBody?: any;
}

const ENDPOINTS: EndpointDef[] = [
  // Agent
  { category: 'Agent', name: 'Get agents in schema', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/agents' },
  { category: 'Agent', name: 'Create an agent', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/agents', defaultBody: { name: 'Sovereign ETL Assistant', model: 'meta.llama-3.3-70b-instruct', systemPrompt: 'Autonomous Spark agent' } },
  { category: 'Agent', name: 'Get agent details', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/agents/{agentKey}' },
  { category: 'Agent', name: 'Deploy an agent', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/agents/{agentKey}/deployments/actions/deploy', defaultBody: { replicaCount: 2 } },
  { category: 'Agent', name: 'List agent deployments', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/agents/{agentKey}/deployments' },
  { category: 'Agent', name: 'List all test sessions of an agent', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/agents/{agentKey}/sessions' },
  { category: 'Agent', name: 'Validate agent diagram', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/agents/{agentKey}/actions/validate', defaultBody: { strictMode: true } },
  { category: 'Agent', name: 'Preview agent card', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/agents/actions/previewAgentCard', defaultBody: { title: 'Enterprise Model Copilot' } },
  
  // AsyncOperations
  { category: 'AsyncOperations', name: 'List all async operations', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/asyncOperations' },
  { category: 'AsyncOperations', name: 'Get information about an async operation', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/asyncOperations/{asyncOperationKey}' },
  
  // Audit
  { category: 'Audit', name: 'Search audit logs', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/actions/searchAuditLogs', defaultBody: { limit: 50 } },
  { category: 'Audit', name: 'Manage audit logs', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/actions/manageAuditLogs', defaultBody: { retentionDays: 90 } },
  
  // Bundle
  { category: 'Bundle', name: 'Publish all bundle resources', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/actions/publishBundle', defaultBody: { version: '1.0.0' } },
  { category: 'Bundle', name: 'Returns bundle publish status', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/actions/getBundlePublishStatus', defaultBody: {} },
  
  // Catalog
  { category: 'Catalog', name: 'Get a list of catalogs', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/catalogs' },
  { category: 'Catalog', name: 'Create a catalog', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/catalogs', defaultBody: { name: 'Enterprise Data Lake Catalog', type: 'DELTA_LAKE' } },
  { category: 'Catalog', name: 'Test external catalog connection', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/actions/testConnection', defaultBody: { host: 'deltalake.internal' } },

  // Cluster
  { category: 'Cluster', name: 'Get clusters in a workspace', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/clusters' },
  { category: 'Cluster', name: 'Get default cluster', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/defaultCluster' },
  { category: 'Cluster', name: 'Start a cluster', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/clusters/{clusterKey}/actions/start', defaultBody: {} },
  { category: 'Cluster', name: 'Stop a cluster', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/clusters/{clusterKey}/actions/stop', defaultBody: {} },
  { category: 'Cluster', name: 'Restart running cluster', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/clusters/{clusterKey}/actions/restart', defaultBody: {} },
  { category: 'Cluster', name: 'Summarize compute metrics data', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/clusters/{clusterKey}/actions/summarizeMetricsData', defaultBody: {} },

  // Credentials
  { category: 'Credentials', name: 'Get list of credentials', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/credentials' },
  { category: 'Credentials', name: 'Create new credential', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/credentials', defaultBody: { name: 'AWS S3 Access Key', type: 'ACCESS_KEY' } },

  // DataLineage
  { category: 'DataLineage', name: 'Return lineage for a given entity object', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/actions/fetchLineage', defaultBody: { entity: 'gold_daily_settlements' } },
  { category: 'DataLineage', name: 'Export lineage as CSV', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/actions/exportLineage', defaultBody: {} },

  // DeltaShare
  { category: 'DeltaShare', name: 'Get a list of Delta Shares', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/shares' },
  { category: 'DeltaShare', name: 'Get a list of Delta Share recipients', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/recipients' },
  { category: 'DeltaShare', name: 'Create a Delta Share', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/shares', defaultBody: { name: 'Global Liquidity Share', description: 'Institutional data sharing' } },

  // Git
  { category: 'Git', name: 'Get connected Git repository', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/gitRepositories/{gitRepositoryKey}' },
  { category: 'Git', name: 'Get a list of Git branches', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/gitRepositories/{gitRepositoryKey}/gitBranches' },
  { category: 'Git', name: 'Pull Git changes', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/gitRepositories/{gitRepositoryKey}/actions/pull', defaultBody: {} },
  { category: 'Git', name: 'Commit and push Git changes', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/gitRepositories/{gitRepositoryKey}/actions/commitPush', defaultBody: { message: 'Update models' } },

  // MLOps
  { category: 'MLOps', name: 'List experiments', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/mlops/api/2.0/mlflow/experiments/search', defaultBody: {} },
  { category: 'MLOps', name: 'List experiment runs', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/mlops/api/2.0/mlflow/runs/search', defaultBody: {} },
  { category: 'MLOps', name: 'List registered models', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/mlops/api/2.0/mlflow/registered-models/search' },
  { category: 'MLOps', name: 'Search model deployments', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/mlops/api/2.0/model-deployments/search', defaultBody: {} },
  { category: 'MLOps', name: 'Get a registered-model summary', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/mlops/api/2.0/registered-models/summary' },

  // Notebook
  { category: 'Notebook', name: 'Get available sessions', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/notebook/api/sessions' },
  { category: 'Notebook', name: 'Create a new session', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/notebook/api/sessions', defaultBody: { kernelName: 'python3-spark' } },

  // Role
  { category: 'Role', name: 'Get list of roles', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/roles' },
  { category: 'Role', name: 'Create a role', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/roles', defaultBody: { name: 'Lead ML Engineer', permissions: ['DEPLOY_MODELS', 'READ_DELTA'] } },

  // Schema
  { category: 'Schema', name: 'Get schemas', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/schemas' },
  { category: 'Schema', name: 'Get tables in schema', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/tables' },
  { category: 'Schema', name: 'Get schema views', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/views' },
  { category: 'Schema', name: 'Get table schema and data', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/schemas/{schemaKey}/actions/inferSchemaWithPreview', defaultBody: {} },

  // UserSetting
  { category: 'UserSetting', name: 'Get list of user settings', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/userSettings' },

  // Volume
  { category: 'Volume', name: 'Get volumes', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/volumes' },
  { category: 'Volume', name: 'Get files in volume', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/volumes/{volumeKey}/files' },
  { category: 'Volume', name: 'Upload file by generating PAR', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/volumes/{volumeKey}/actions/uploadFileMeta', defaultBody: { fileName: 'data.parquet' } },

  // Workflow
  { category: 'Workflow', name: 'Get list of jobs', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/jobs' },
  { category: 'Workflow', name: 'Get latest job runs', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/recentJobRuns' },
  { category: 'Workflow', name: 'Create a job run', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/jobRuns', defaultBody: { jobKey: 'job-settlement' } },

  // Workspace
  { category: 'Workspace', name: 'Get a list of workspaces', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces' },
  { category: 'Workspace', name: 'Get workspace details', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}' },
  { category: 'Workspace', name: 'Get a list of create workspace permissions', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/createWorkspacePermissions' },

  // WorkspaceObject
  { category: 'WorkspaceObject', name: 'Get a list of objects in the workspace', method: 'GET', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/objects' },
  { category: 'WorkspaceObject', name: 'Create a workspace object', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/objects', defaultBody: { objectPath: 'notebooks/AutonomousTradeAnalysis.py', content: '# Trade analytics code\\nprint("Running")' } },
  { category: 'WorkspaceObject', name: 'Download a workspace file by generating PAR', method: 'POST', path: '/20260430/aiDataPlatforms/{aiDataPlatformId}/workspaces/{workspaceKey}/actions/downloadFileMeta', defaultBody: {} }
];

export const AiDataPlatformConsole: React.FC = () => {
  const [platformId, setPlatformId] = useState('adp-default-corp');
  const [workspaceKey, setWorkspaceKey] = useState('ws-master-01');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  
  // Execution State
  const [requestBody, setRequestBody] = useState('{}');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<any>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentAudits, setRecentAudits] = useState<any[]>([]);

  // Category summary counts
  const categories = ['All', ...Array.from(new Set(ENDPOINTS.map(e => e.category)))];

  useEffect(() => {
    if (selectedEndpoint) {
      setRequestBody(selectedEndpoint.defaultBody ? JSON.stringify(selectedEndpoint.defaultBody, null, 2) : '{}');
    }
  }, [selectedEndpoint]);

  // Load initial audit log
  useEffect(() => {
    fetchAuditLogs();
  }, [platformId]);

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch(`/20260430/aiDataPlatforms/${platformId}/actions/searchAuditLogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 10 })
      });
      if (res.ok) {
        const data = await res.json();
        setRecentAudits(data.items || []);
      }
    } catch (e) {
      // quiet fail
    }
  };

  const resolvePath = (template: string) => {
    return template
      .replace('{aiDataPlatformId}', platformId)
      .replace('{workspaceKey}', workspaceKey)
      .replace('{agentKey}', 'agent-autonomous-copilot-01')
      .replace('{agentDeploymentKey}', 'dep-01')
      .replace('{sessionId}', 'sess-01')
      .replace('{traceKey}', 'trace-01')
      .replace('{asyncOperationKey}', 'async-op-01')
      .replace('{catalogKey}', 'cat-01')
      .replace('{clusterKey}', 'cluster-spark-gpu-01')
      .replace('{credentialKey}', 'cred-01')
      .replace('{shareKey}', 'sovereign_banking_federated_share')
      .replace('{recipientKey}', 'citibank_global_consumer_bank')
      .replace('{gitRepositoryKey}', 'git-repo-01')
      .replace('{roleKey}', 'role-01')
      .replace('{schemaKey}', 'fintech_analytics_gold')
      .replace('{tableKey}', 'gold_daily_settlements')
      .replace('{viewKey}', 'view-01')
      .replace('{settingKey}', 'setting-01')
      .replace('{volumeKey}', 'vol-enterprise-parquet-lake')
      .replace('{jobKey}', 'job-settlement')
      .replace('{jobRunKey}', 'run-01')
      .replace('{taskRunKey}', 'task-01')
      .replace('{taskRunOutputKey}', 'out-01')
      .replace('{objectKey}', 'obj-01')
      .replace('{objectPath}', 'notebooks/FintechPipeline.ipynb');
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseData(null);
    const start = performance.now();
    const finalUrl = resolvePath(selectedEndpoint.path);

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && requestBody.trim()) {
        try {
          options.body = JSON.stringify(JSON.parse(requestBody));
        } catch {
          options.body = requestBody;
        }
      }

      const res = await fetch(finalUrl, options);
      const end = performance.now();
      setExecutionTimeMs(Math.round(end - start));
      setResponseStatus(res.status);

      const headerObj: any = {};
      res.headers.forEach((val, key) => { headerObj[key] = val; });
      setResponseHeaders(headerObj);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setResponseData(json);
      } else {
        const text = await res.text();
        setResponseData({ raw: text });
      }

      fetchAuditLogs();
    } catch (err: any) {
      setResponseStatus(500);
      setResponseData({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const filteredEndpoints = ENDPOINTS.filter(e => {
    const matchesCat = activeCategory === 'All' || e.category === activeCategory;
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.path.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-[#c9d1d9] p-4 md:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#21262d] pb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl shadow-indigo-900/30 border border-indigo-400/30">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                AI Data Platform 2026-04-30 API Suite
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono font-bold">
                19 Categories • 286 Endpoints
              </span>
            </div>
            <p className="text-sm text-[#8b949e] mt-1">
              Oracle Autonomous AI Data Platform & Databricks Enterprise Runtime Engine
            </p>
          </div>
        </div>

        {/* Global Context Selector */}
        <div className="flex flex-wrap items-center gap-3 bg-[#131926] p-2.5 rounded-xl border border-[#30363d]">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#8b949e] block ml-1">Platform ID</span>
            <input
              type="text"
              value={platformId}
              onChange={e => setPlatformId(e.target.value)}
              className="bg-[#090d16] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#8b949e] block ml-1">Workspace Key</span>
            <input
              type="text"
              value={workspaceKey}
              onChange={e => setWorkspaceKey(e.target.value)}
              className="bg-[#090d16] border border-[#30363d] rounded-lg px-2.5 py-1 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchAuditLogs}
              className="p-1.5 hover:bg-[#21262d] text-[#8b949e] hover:text-white rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-900/30'
                : 'bg-[#131926] text-[#8b949e] border-[#21262d] hover:border-[#384252] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Endpoint Explorer | Right Live Execution Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint List */}
        <div className="lg:col-span-5 bg-[#131926] border border-[#21262d] rounded-2xl p-4 flex flex-col h-[760px]">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-[#8b949e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filter endpoints by name or path..."
              className="w-full bg-[#090d16] border border-[#30363d] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
            />
          </div>

          <div className="text-[11px] font-mono text-[#8b949e] mb-2 px-1 flex justify-between">
            <span>Showing {filteredEndpoints.length} endpoints</span>
            <span>Category: {activeCategory}</span>
          </div>

          <div className="overflow-y-auto space-y-2 flex-1 pr-1">
            {filteredEndpoints.map((ep, idx) => {
              const isSelected = selectedEndpoint.name === ep.name && selectedEndpoint.path === ep.path;
              const methodColor =
                ep.method === 'GET' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                ep.method === 'POST' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
                ep.method === 'PUT' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                ep.method === 'PATCH' ? 'text-purple-400 bg-purple-500/10 border-purple-500/30' :
                'text-red-400 bg-red-500/10 border-red-500/30';

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50'
                      : 'bg-[#090d16] border-[#21262d] hover:border-[#384252]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${methodColor}`}>
                      {ep.method}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded">
                      {ep.category}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate">{ep.name}</div>
                  <div className="text-[10px] font-mono text-[#8b949e] truncate mt-1">{ep.path}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Interactive Dispatcher */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#131926] border border-[#21262d] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  {selectedEndpoint.category}
                </span>
                <h2 className="text-lg font-bold text-white">{selectedEndpoint.name}</h2>
              </div>
              <button
                onClick={handleExecute}
                disabled={loading}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/30 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                Execute Call
              </button>
            </div>

            {/* Resolved URL Preview */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#8b949e]">Target Live Endpoint URL</span>
              <div className="p-2.5 bg-[#090d16] border border-[#30363d] rounded-xl font-mono text-xs text-emerald-400 break-all flex items-center justify-between">
                <span>{selectedEndpoint.method} {resolvePath(selectedEndpoint.path)}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(`curl -X ${selectedEndpoint.method} "${window.location.origin}${resolvePath(selectedEndpoint.path)}"`)}
                  className="p-1 hover:text-white text-[#8b949e] ml-2 shrink-0"
                  title="Copy cURL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Request Body Editor */}
            {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#8b949e]">JSON Payload</span>
                <textarea
                  value={requestBody}
                  onChange={e => setRequestBody(e.target.value)}
                  rows={4}
                  className="w-full bg-[#090d16] border border-[#30363d] rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Response Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-[#8b949e]">API Execution Response</span>
                {responseStatus && (
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className={`px-2 py-0.5 rounded font-bold ${responseStatus < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Status: {responseStatus}
                    </span>
                    {executionTimeMs !== null && (
                      <span className="text-[#8b949e]">{executionTimeMs} ms</span>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-[#090d16] border border-[#30363d] rounded-xl p-4 h-64 overflow-y-auto font-mono text-xs">
                {loading ? (
                  <div className="h-full flex items-center justify-center text-[#8b949e] gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                    Executing live against OCI AI Data Platform runtime...
                  </div>
                ) : responseData ? (
                  <pre className="text-emerald-400">{JSON.stringify(responseData, null, 2)}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-[#484f58]">
                    Click "Execute Call" to test this endpoint live against the local & remote state engine.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Audit Trail Card */}
          <div className="bg-[#131926] border border-[#21262d] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#21262d] pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Audit Event Stream</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SOC2 AUDIT ACTIVE
              </span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {recentAudits.length === 0 ? (
                <div className="text-xs text-[#8b949e] py-3 text-center">No audit records logged yet.</div>
              ) : (
                recentAudits.slice(0, 5).map(aud => (
                  <div key={aud.id} className="p-2 bg-[#090d16] rounded-lg border border-[#21262d] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300">
                        {aud.action}
                      </span>
                      <span className="text-white">{aud.resourceType}: {aud.resourceKey}</span>
                    </div>
                    <span className="text-[10px] text-[#8b949e]">
                      {new Date(aud.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
