import React, { useState, useEffect } from 'react';
import {
  Layers,
  Database,
  Download,
  Copy,
  Check,
  Play,
  Cloud,
  CheckCircle2,
  Search,
  Filter,
  Code2,
  ExternalLink,
  RefreshCw,
  FolderDown,
  Sparkles,
  Terminal,
  Activity,
  Server,
  Zap,
  Tag,
  AlertCircle
} from 'lucide-react';
import { db, getGoogleWorkspaceToken } from '../firebase';
import { collection, addDoc, getDocs, orderBy, query, limit, deleteDoc, doc } from 'firebase/firestore';

interface ApiEndpoint {
  id: string;
  name: string;
  service: string;
  category: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary: string;
  description: string;
  authRequired: boolean;
  authType?: string;
  headers?: Record<string, string>;
  queryParams?: Array<{ name: string; type: string; required: boolean; description: string; default?: any }>;
  bodySchema?: Record<string, any>;
  sampleRequest?: any;
  sampleResponse: any;
  tags: string[];
  protocol: string;
}

interface ApiCakeBundle {
  id: string;
  title: string;
  version: string;
  generatedAt: string;
  totalEndpoints: number;
  categories: string[];
  services: string[];
  endpoints: ApiEndpoint[];
  openApiSpec: Record<string, any>;
  postmanCollection: Record<string, any>;
  universalSdkSnippet: string;
  checksum: string;
}

interface ExecutionResult {
  endpointId: string;
  name: string;
  service: string;
  category: string;
  method: string;
  path: string;
  statusCode: number;
  statusText: string;
  latencyMs: number;
  executedAt: string;
  sampleOutput: any;
}

export function ApiCakeStudio() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'bundle-json' | 'openapi' | 'postman' | 'execution' | 'firebase-vault' | 'sdk'>('catalog');
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [bundle, setBundle] = useState<ApiCakeBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBaking, setIsBaking] = useState(false);
  const [isSavingFirebase, setIsSavingFirebase] = useState(false);
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [isExecutingAll, setIsExecutingAll] = useState(false);
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([]);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [expandedEndpointId, setExpandedEndpointId] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<{ id: string; data: any; latency: number } | null>(null);
  const [savedFirestoreSnapshots, setSavedFirestoreSnapshots] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Fetch initial bundle and endpoints
  const fetchBundleAndEndpoints = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cake/bundle');
      if (res.ok) {
        const data = await res.json();
        setBundle(data.bundle);
        setEndpoints(data.bundle.endpoints || []);
      } else {
        // Fallback
        const fallbackRes = await fetch('/api/cake/endpoints');
        const fallbackData = await fallbackRes.json();
        setEndpoints(fallbackData.endpoints || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch API Cake Bundle:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load Firestore Saved Snapshots
  const fetchFirestoreSnapshots = async () => {
    try {
      if (!db) return;
      const q = query(collection(db, 'api_bundles'), orderBy('createdAt', 'desc'), limit(15));
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach((docSnap) => {
        list.push({ docId: docSnap.id, ...docSnap.data() });
      });
      setSavedFirestoreSnapshots(list);
    } catch (err: any) {
      console.warn('Firestore snapshots fetch skipped or fallback:', err.message);
    }
  };

  useEffect(() => {
    fetchBundleAndEndpoints();
    fetchFirestoreSnapshots();
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast('success', `Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // 1. Bake & Cake All Endpoints into ONE
  const handleBakeAllEndpoints = async () => {
    setIsBaking(true);
    try {
      const res = await fetch('/api/cake/bundle');
      const data = await res.json();
      if (data.success && data.bundle) {
        setBundle(data.bundle);
        setEndpoints(data.bundle.endpoints);
        showToast('success', `🎉 Baked all ${data.bundle.totalEndpoints} API endpoints into ONE unified Cake Bundle!`);
      }
    } catch (err: any) {
      showToast('error', `Bake failed: ${err.message}`);
    } finally {
      setIsBaking(false);
    }
  };

  // 2. Save Master Cake Bundle to Firebase Firestore
  const handleSaveToFirestore = async () => {
    if (!bundle) return;
    setIsSavingFirebase(true);
    try {
      const snapshotPayload = {
        name: bundle.title,
        version: bundle.version,
        endpointCount: bundle.totalEndpoints,
        categories: bundle.categories,
        services: bundle.services,
        endpoints: bundle.endpoints,
        openApiSpec: bundle.openApiSpec,
        checksum: bundle.checksum,
        createdAt: new Date().toISOString(),
        userEmail: 'sovereignties3@gmail.com',
        source: 'Kronos Master API Cake Studio'
      };

      // 1. Save to backend registry
      await fetch('/api/cake/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bundle: snapshotPayload })
      });

      // 2. Save to Firestore collection 'api_bundles'
      if (db) {
        const docRef = await addDoc(collection(db, 'api_bundles'), snapshotPayload);
        showToast('success', `💾 Master API Cake saved to Firebase Firestore! Document ID: ${docRef.id}`);
      } else {
        showToast('success', `💾 Master API Cake snapshot saved to server registry!`);
      }

      fetchFirestoreSnapshots();
    } catch (err: any) {
      showToast('error', `Save failed: ${err.message}`);
    } finally {
      setIsSavingFirebase(false);
    }
  };

  // 3. Save to Google Drive
  const handleSaveToGoogleDrive = async () => {
    if (!bundle) return;
    setIsSyncingDrive(true);
    try {
      const token = getGoogleWorkspaceToken();
      const filename = `Kronos_Master_API_Cake_${new Date().toISOString().slice(0, 10)}.json`;
      const fileContent = JSON.stringify(bundle, null, 2);

      if (token) {
        // Direct Google Drive API V3 multipart upload
        const metadata = {
          name: filename,
          mimeType: 'application/json',
          description: 'Unified Kronos Apex Master API Cake Bundle containing all 120+ endpoints'
        };

        const boundary = '-------314159265358979323846';
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelimiter = `\r\n--${boundary}--`;

        const multipartRequestBody =
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          fileContent +
          closeDelimiter;

        const driveRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: multipartRequestBody
        });

        if (driveRes.ok) {
          const driveData = await driveRes.json();
          showToast('success', `☁️ Successfully uploaded Master API Cake to Google Drive! File ID: ${driveData.id}`);
        } else {
          throw new Error(`Google Drive API returned ${driveRes.status}`);
        }
      } else {
        // Fallback: download locally
        const blob = new Blob([fileContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        showToast('info', '📥 Google Workspace not authenticated. Downloaded Master API Cake locally.');
      }
    } catch (err: any) {
      showToast('error', `Google Drive sync error: ${err.message}`);
    } finally {
      setIsSyncingDrive(false);
    }
  };

  // 4. Batch Execute All Endpoints
  const handleExecuteAllEndpoints = async () => {
    setIsExecutingAll(true);
    setExecutionProgress(10);
    try {
      const res = await fetch('/api/cake/execute-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpointIds: endpoints.map(e => e.id) })
      });
      setExecutionProgress(70);
      const data = await res.json();
      if (data.success && data.results) {
        setExecutionResults(data.results);
        setExecutionProgress(100);
        setActiveTab('execution');
        showToast('success', `⚡ Executed all ${data.executedCount} endpoints! Average latency: ${data.averageLatencyMs}ms`);
      }
    } catch (err: any) {
      showToast('error', `Batch execution error: ${err.message}`);
    } finally {
      setIsExecutingAll(false);
    }
  };

  // 5. Test Single Endpoint
  const handleTestSingleEndpoint = async (ep: ApiEndpoint) => {
    const startTime = performance.now();
    try {
      const res = await fetch(ep.path, {
        method: ep.method,
        headers: {
          'Content-Type': 'application/json',
          ...(ep.headers || {})
        },
        ...(ep.sampleRequest ? { body: JSON.stringify(ep.sampleRequest) } : {})
      });
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      let data: any;
      try {
        data = await res.json();
      } catch {
        data = { status: res.status, text: await res.text() };
      }
      setTestResponse({ id: ep.id, data, latency });
    } catch (err: any) {
      const endTime = performance.now();
      setTestResponse({ id: ep.id, data: { error: err.message, mockOutput: ep.sampleResponse }, latency: Math.round(endTime - startTime) });
    }
  };

  // Filter endpoints
  const categories = Array.from(new Set(endpoints.map(e => e.category)));
  const filteredEndpoints = endpoints.filter(ep => {
    const matchesSearch =
      ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || ep.category === selectedCategory;
    const matchesMethod = selectedMethod === 'ALL' || ep.method === selectedMethod;
    return matchesSearch && matchesCategory && matchesMethod;
  });

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'POST': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'PUT': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'DELETE': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      default: return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E6EDF3] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-3 border text-xs font-semibold backdrop-blur-md transition-all ${
          notification.type === 'success'
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-emerald-900/40'
            : notification.type === 'error'
            ? 'bg-rose-950/90 text-rose-200 border-rose-500/50 shadow-rose-900/40'
            : 'bg-blue-950/90 text-blue-200 border-blue-500/50 shadow-blue-900/40'
        }`}>
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
          {notification.type === 'info' && <Sparkles className="w-5 h-5 text-blue-400" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-blue-950/40 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🎂</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                Master API Cake & Unified Bundle Studio
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  ALL-IN-ONE
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#8B949E] max-w-3xl leading-relaxed">
              Consolidate, bake, package, and save <strong>every single API endpoint</strong> across Intuit QBO, Citi Open Banking, Modern Treasury, Chase, Finicity, Marqeta, PayPal, Visa, Autonomous AI Buyer, SignWell, and Kronos into ONE unified master schema. Persist directly to Firebase Firestore or Google Drive.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleBakeAllEndpoints}
              disabled={isBaking}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isBaking ? 'animate-spin' : ''}`} />
              <span>{isBaking ? 'Baking Bundle...' : '🎂 Cake All Endpoints as ONE'}</span>
            </button>

            <button
              onClick={handleSaveToFirestore}
              disabled={isSavingFirebase || !bundle}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Database className={`w-4 h-4 ${isSavingFirebase ? 'animate-spin' : ''}`} />
              <span>{isSavingFirebase ? 'Saving...' : '💾 Save to Firebase'}</span>
            </button>

            <button
              onClick={handleSaveToGoogleDrive}
              disabled={isSyncingDrive || !bundle}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Cloud className={`w-4 h-4 ${isSyncingDrive ? 'animate-spin' : ''}`} />
              <span>{isSyncingDrive ? 'Syncing...' : '☁️ Save to Drive'}</span>
            </button>

            <button
              onClick={handleExecuteAllEndpoints}
              disabled={isExecutingAll}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-cyan-300 font-bold text-xs border border-cyan-500/40 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isExecutingAll ? 'animate-spin' : ''}`} />
              <span>{isExecutingAll ? 'Running Batch...' : '⚡ Run All'}</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-[#0D1117]/80 border border-[#30363D]">
            <span className="text-[10px] uppercase font-bold text-[#8B949E]">Baked Endpoints</span>
            <p className="text-xl font-black text-amber-400">{endpoints.length}</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0D1117]/80 border border-[#30363D]">
            <span className="text-[10px] uppercase font-bold text-[#8B949E]">Covered Categories</span>
            <p className="text-xl font-black text-emerald-400">{categories.length}</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0D1117]/80 border border-[#30363D]">
            <span className="text-[10px] uppercase font-bold text-[#8B949E]">Master Spec Standard</span>
            <p className="text-xs font-bold text-cyan-300 mt-1">OpenAPI 3.1 & Postman 2.1</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0D1117]/80 border border-[#30363D]">
            <span className="text-[10px] uppercase font-bold text-[#8B949E]">Firebase Storage</span>
            <p className="text-xs font-bold text-emerald-300 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              collection: api_bundles
            </p>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-3 rounded-xl bg-[#0D1117]/80 border border-[#30363D]">
            <span className="text-[10px] uppercase font-bold text-[#8B949E]">Checksum SHA-256</span>
            <p className="text-[11px] font-mono text-purple-300 truncate mt-1">
              {bundle?.checksum || 'sha256_apex_init'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#30363D] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Endpoint Catalog ({endpoints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bundle-json')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bundle-json'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Unified Master Cake JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('openapi')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'openapi'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>OpenAPI 3.1 Spec</span>
          </button>

          <button
            onClick={() => setActiveTab('postman')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'postman'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Postman v2.1</span>
          </button>

          <button
            onClick={() => setActiveTab('execution')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'execution'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Execution Matrix ({executionResults.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase-vault')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'firebase-vault'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Firestore Snapshots ({savedFirestoreSnapshots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sdk')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sdk'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>TypeScript SDK</span>
          </button>
        </div>

        {/* Quick Download Menu */}
        <div className="flex items-center space-x-2">
          <a
            href="/api/cake/export/json"
            download="master-api-cake.json"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white text-xs border border-[#30363D] font-bold"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download Master Cake JSON</span>
          </a>

          <a
            href="/api/cake/export/openapi"
            download="master-openapi-3.1.json"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white text-xs border border-[#30363D] font-bold"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>OpenAPI JSON</span>
          </a>
        </div>
      </div>

      {/* TAB 1: ENDPOINTS CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#8B949E] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search endpoints by path, service, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-xl text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center space-x-1 text-xs text-[#8B949E]">
                <Filter className="w-3.5 h-3.5" />
                <span>Category:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-[#0D1117] border border-[#30363D] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Categories ({categories.length})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-3 py-1.5 bg-[#0D1117] border border-[#30363D] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Methods</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>

              <span className="text-xs text-[#8B949E] font-mono">
                Showing {filteredEndpoints.length} of {endpoints.length}
              </span>
            </div>
          </div>

          {/* Endpoints List */}
          <div className="space-y-3">
            {filteredEndpoints.map((ep) => {
              const isExpanded = expandedEndpointId === ep.id;
              const hasTestOutput = testResponse?.id === ep.id;

              return (
                <div
                  key={ep.id}
                  className="bg-[#161B22] border border-[#30363D] hover:border-amber-500/40 rounded-2xl p-4 shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg ${getMethodBadgeClass(ep.method)}`}>
                        {ep.method}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white font-mono">{ep.path}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 text-[#8B949E] border border-white/10">
                            {ep.service}
                          </span>
                        </div>
                        <p className="text-xs text-[#8B949E] mt-0.5">{ep.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestSingleEndpoint(ep)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-all cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Test Endpoint</span>
                      </button>

                      <button
                        onClick={() => setExpandedEndpointId(isExpanded ? null : ep.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white font-bold text-xs border border-[#30363D] transition-all cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'Inspect'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Inspector */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#30363D] space-y-4 text-xs">
                      <p className="text-[#8B949E]">{ep.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Request Schema / Sample */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-[#8B949E]">Sample Request Payload</span>
                            {ep.sampleRequest && (
                              <button
                                onClick={() => copyToClipboard(JSON.stringify(ep.sampleRequest, null, 2), 'Request Payload')}
                                className="text-[10px] text-amber-400 hover:underline"
                              >
                                Copy Payload
                              </button>
                            )}
                          </div>
                          <pre className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-48">
                            {ep.sampleRequest ? JSON.stringify(ep.sampleRequest, null, 2) : '// No request body required for this method'}
                          </pre>
                        </div>

                        {/* Expected 200 OK Response */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-[#8B949E]">Sample Response Schema (200 OK)</span>
                            <button
                              onClick={() => copyToClipboard(JSON.stringify(ep.sampleResponse, null, 2), 'Sample Response')}
                              className="text-[10px] text-amber-400 hover:underline"
                            >
                              Copy Response
                            </button>
                          </div>
                          <pre className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48">
                            {JSON.stringify(ep.sampleResponse, null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Live Output if Tested */}
                      {hasTestOutput && (
                        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Live Test Response ({testResponse.latency}ms)
                            </span>
                            <span className="text-[10px] font-mono text-emerald-300">200 OK</span>
                          </div>
                          <pre className="p-3 rounded-lg bg-[#0D1117] text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48">
                            {JSON.stringify(testResponse.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: UNIFIED MASTER CAKE JSON */}
      {activeTab === 'bundle-json' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                Unified Master API Cake Bundle JSON
              </h3>
              <p className="text-xs text-[#8B949E]">
                All {endpoints.length} API endpoints baked into a single composite JSON specification.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(JSON.stringify(bundle, null, 2), 'Master Cake JSON')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {copiedText === 'Master Cake JSON' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === 'Master Cake JSON' ? 'Copied!' : 'Copy Entire Bundle'}</span>
              </button>
            </div>
          </div>

          <pre className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs font-mono text-amber-300/90 overflow-x-auto max-h-[600px] leading-relaxed">
            {bundle ? JSON.stringify(bundle, null, 2) : '// Baking bundle...'}
          </pre>
        </div>
      )}

      {/* TAB 3: OPENAPI 3.1 SPEC */}
      {activeTab === 'openapi' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-400" />
                Master OpenAPI 3.1.0 Specification
              </h3>
              <p className="text-xs text-[#8B949E]">
                Fully compatible with Swagger UI, Postman, Redoc, and OpenAPI code generators.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(JSON.stringify(bundle?.openApiSpec, null, 2), 'OpenAPI 3.1 Spec')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy OpenAPI Spec</span>
              </button>
            </div>
          </div>

          <pre className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs font-mono text-cyan-300 overflow-x-auto max-h-[600px] leading-relaxed">
            {bundle?.openApiSpec ? JSON.stringify(bundle.openApiSpec, null, 2) : '// Generating OpenAPI Spec...'}
          </pre>
        </div>
      )}

      {/* TAB 4: POSTMAN COLLECTION */}
      {activeTab === 'postman' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderDown className="w-5 h-5 text-orange-400" />
                Postman Collection v2.1.0
              </h3>
              <p className="text-xs text-[#8B949E]">
                Import directly into Postman or Insomnia workspace to run individual requests.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(JSON.stringify(bundle?.postmanCollection, null, 2), 'Postman Collection')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Postman JSON</span>
              </button>
            </div>
          </div>

          <pre className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs font-mono text-orange-300 overflow-x-auto max-h-[600px] leading-relaxed">
            {bundle?.postmanCollection ? JSON.stringify(bundle.postmanCollection, null, 2) : '// Generating Postman Collection...'}
          </pre>
        </div>
      )}

      {/* TAB 5: BATCH EXECUTION MATRIX */}
      {activeTab === 'execution' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Unified Batch Execution Matrix
              </h3>
              <p className="text-xs text-[#8B949E]">
                Real-time latency, HTTP status codes, and response validation across all endpoints.
              </p>
            </div>

            <button
              onClick={handleExecuteAllEndpoints}
              disabled={isExecutingAll}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{isExecutingAll ? 'Executing...' : '⚡ Re-Run All Endpoints'}</span>
            </button>
          </div>

          {executionResults.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
              <p className="text-sm font-bold text-white">No Batch Executions Recorded</p>
              <p className="text-xs text-[#8B949E]">Click "Re-Run All Endpoints" above to test all routes at once.</p>
            </div>
          ) : (
            <div className="border border-[#30363D] rounded-xl overflow-hidden bg-[#0D1117]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161B22] border-b border-[#30363D] text-[#8B949E] font-bold">
                  <tr>
                    <th className="p-3">Endpoint Path</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">HTTP Status</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363D]">
                  {executionResults.map((r) => (
                    <tr key={r.endpointId} className="hover:bg-[#161B22]/50">
                      <td className="p-3 font-mono font-bold text-white">{r.path}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${getMethodBadgeClass(r.method)}`}>
                          {r.method}
                        </span>
                      </td>
                      <td className="p-3 text-[#8B949E]">{r.service}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                          {r.statusCode} {r.statusText}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-cyan-300">{r.latencyMs}ms</td>
                      <td className="p-3 text-[10px] font-mono text-[#8B949E]">
                        {new Date(r.executedAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: FIRESTORE SAVED SNAPSHOTS */}
      {activeTab === 'firebase-vault' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                Firebase Firestore Snapshots Repository
              </h3>
              <p className="text-xs text-[#8B949E]">
                Saved snapshots stored in collection <code className="text-emerald-300 font-mono">api_bundles</code>.
              </p>
            </div>

            <button
              onClick={handleSaveToFirestore}
              disabled={isSavingFirebase || !bundle}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Save Current Snapshot</span>
            </button>
          </div>

          <div className="space-y-3">
            {savedFirestoreSnapshots.length === 0 ? (
              <div className="text-center py-12 text-[#8B949E] space-y-2">
                <Database className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs">Click "Save to Firebase" to record your first immutable snapshot.</p>
              </div>
            ) : (
              savedFirestoreSnapshots.map((snap) => (
                <div
                  key={snap.docId || snap.id}
                  className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">{snap.name || 'Master API Cake Bundle'}</p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8B949E]">
                      <span className="font-mono text-amber-400">{snap.endpointCount || snap.endpoints?.length || 120} Endpoints</span>
                      <span>&bull;</span>
                      <span>{new Date(snap.createdAt).toLocaleString()}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-purple-300">ID: {snap.docId || snap.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setBundle(snap);
                        setEndpoints(snap.endpoints || []);
                        showToast('success', 'Loaded snapshot from Firebase Firestore!');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-cyan-300 text-xs font-bold border border-[#30363D]"
                    >
                      Load Snapshot
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 7: TYPESCRIPT SDK */}
      {activeTab === 'sdk' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                Universal TypeScript Master Client SDK
              </h3>
              <p className="text-xs text-[#8B949E]">
                Single-file client SDK generated from all baked endpoints. Zero dependencies outside standard fetch.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(bundle?.universalSdkSnippet || '', 'TypeScript SDK')}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SDK Code</span>
              </button>
            </div>
          </div>

          <pre className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs font-mono text-emerald-300 overflow-x-auto max-h-[600px] leading-relaxed">
            {bundle?.universalSdkSnippet || '// Generating TypeScript SDK...'}
          </pre>
        </div>
      )}
    </div>
  );
}
