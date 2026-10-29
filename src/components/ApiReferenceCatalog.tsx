import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Zap, 
  ChevronRight, 
  Globe, 
  Layers, 
  Code2, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  Server,
  Database,
  Lock,
  ArrowRight
} from 'lucide-react';
import { ENDPOINTS_CATALOG, ApiEndpoint } from '../data/endpointsCatalog';

export const ApiReferenceCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMethod, setSelectedMethod] = useState<string>('All');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(ENDPOINTS_CATALOG[0].id);
  const [activeSnippetLang, setActiveSnippetLang] = useState<'curl' | 'typescript' | 'python' | 'go'>('curl');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Try it live state
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simResponse, setSimResponse] = useState<any | null>(null);
  const [simLatency, setSimLatency] = useState<number | null>(null);
  const [simStatusCode, setSimStatusCode] = useState<number | null>(null);

  const categories = useMemo(() => {
    const set = new Set(ENDPOINTS_CATALOG.map(e => e.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredEndpoints = useMemo(() => {
    return ENDPOINTS_CATALOG.filter(ep => {
      const matchCategory = selectedCategory === 'All' || ep.category === selectedCategory;
      const matchMethod = selectedMethod === 'All' || ep.method === selectedMethod;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || 
        ep.name.toLowerCase().includes(q) || 
        ep.path.toLowerCase().includes(q) || 
        ep.summary.toLowerCase().includes(q) ||
        ep.category.toLowerCase().includes(q) ||
        ep.complianceTags.some(t => t.toLowerCase().includes(q));
      return matchCategory && matchMethod && matchSearch;
    });
  }, [searchQuery, selectedCategory, selectedMethod]);

  const activeEndpoint = useMemo(() => {
    return ENDPOINTS_CATALOG.find(e => e.id === selectedEndpointId) || filteredEndpoints[0] || ENDPOINTS_CATALOG[0];
  }, [selectedEndpointId, filteredEndpoints]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runLiveSimulation = () => {
    setIsRunningSim(true);
    setSimResponse(null);
    setSimLatency(null);
    setSimStatusCode(null);

    const randomLatency = Math.floor(Math.random() * 45) + 12;
    setTimeout(() => {
      setIsRunningSim(false);
      setSimLatency(randomLatency);
      setSimStatusCode(activeEndpoint.method === 'POST' ? 201 : 200);
      setSimResponse(activeEndpoint.responseBody);
    }, 450);
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800';
      case 'POST': return 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800';
      case 'PUT': return 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800';
      case 'DELETE': return 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800';
      case 'PATCH': return 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-300';
    }
  };

  const generateSnippet = (endpoint: ApiEndpoint, lang: 'curl' | 'typescript' | 'python' | 'go') => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://api.kronos.fin';
    const fullUrl = `${origin}${endpoint.path}`;
    const headerLines = Object.entries(endpoint.headers).map(([k, v]) => `  -H "${k}: ${v}"`).join(' \\\n');
    const bodyStr = endpoint.requestBody ? JSON.stringify(endpoint.requestBody, null, 2) : '';

    if (lang === 'curl') {
      if (endpoint.method === 'GET' || !endpoint.requestBody) {
        return `curl -X ${endpoint.method} "${fullUrl}" \\\n${headerLines}`;
      }
      return `curl -X ${endpoint.method} "${fullUrl}" \\\n${headerLines} \\\n  -d '${JSON.stringify(endpoint.requestBody)}'`;
    }

    if (lang === 'typescript') {
      return `import axios from 'axios';

const response = await axios({
  method: '${endpoint.method}',
  url: '${fullUrl}',
  headers: ${JSON.stringify(endpoint.headers, null, 4)},${endpoint.requestBody ? `\n  data: ${JSON.stringify(endpoint.requestBody, null, 4)}` : ''}
});

console.log(response.data);`;
    }

    if (lang === 'python') {
      return `import requests

url = "${fullUrl}"
headers = ${JSON.stringify(endpoint.headers, null, 4)}
${endpoint.requestBody ? `payload = ${JSON.stringify(endpoint.requestBody, null, 4)}\n\nresponse = requests.${endpoint.method.toLowerCase()}(url, headers=headers, json=payload)` : `response = requests.${endpoint.method.toLowerCase()}(url, headers=headers)`}

print(response.json())`;
    }

    if (lang === 'go') {
      return `package main

import (
\t"fmt"
\t"net/http"
\t"io/ioutil"
)

func main() {
\treq, _ := http.NewRequest("${endpoint.method}", "${fullUrl}", nil)
\t// Add configured headers
\tresp, err := http.DefaultClient.Do(req)
\tif err != nil { panic(err) }
\tdefer resp.Body.Close()
\tbody, _ := ioutil.ReadAll(resp.Body)
\tfmt.Println(string(body))
}`;
    }

    return '';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-slate-900 to-zinc-900 text-white rounded-2xl p-8 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              100+ Enterprise Banking & Accounting Endpoints
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Institutional API Reference & Interactive Console
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Exceeding Atlassian & Stripe developer standard: Full multi-bank REST, GraphQL, ISO 20022 messaging, and smart contract endpoints with sub-millisecond execution simulations and live code generation.
            </p>
          </div>
          <div className="flex flex-row md:flex-col gap-3 shrink-0">
            <div className="px-4 py-3 bg-zinc-800/80 rounded-xl border border-zinc-700/60 text-center">
              <div className="text-2xl font-bold font-mono text-cyan-400">{ENDPOINTS_CATALOG.length}</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Endpoints</div>
            </div>
            <div className="px-4 py-3 bg-zinc-800/80 rounded-xl border border-zinc-700/60 text-center">
              <div className="text-2xl font-bold font-mono text-emerald-400">99.999%</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Gateway Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 100+ endpoints by path, name, ISO standard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Method Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {['All', 'GET', 'POST', 'PUT', 'DELETE'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMethod(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                selectedMethod === m
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Catalog & Interactive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Endpoint Directory */}
        <div className="lg:col-span-5 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[720px] overflow-y-auto shadow-sm">
            {filteredEndpoints.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                No endpoints found matching your query.
              </div>
            ) : (
              filteredEndpoints.map((ep) => {
                const isSelected = activeEndpoint.id === ep.id;
                return (
                  <div
                    key={ep.id}
                    onClick={() => {
                      setSelectedEndpointId(ep.id);
                      setSimResponse(null);
                      setSimLatency(null);
                      setSimStatusCode(null);
                    }}
                    className={`p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-50/70 dark:bg-cyan-950/30 border-l-4 border-cyan-500'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getMethodBadgeColor(ep.method)}`}>
                        {ep.method}
                      </span>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {ep.name}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate mb-1.5">
                      {ep.path}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="truncate max-w-[200px]">{ep.category}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">{ep.latencySla}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Endpoint Detailed Documentation & Live Runner */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-6">
            {/* Endpoint Title & Path */}
            <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-mono">
                  {activeEndpoint.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {activeEndpoint.auth}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                    <Clock className="w-3 h-3" />
                    {activeEndpoint.latencySla}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {activeEndpoint.name}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {activeEndpoint.description}
              </p>

              {/* Path bar with click-to-copy */}
              <div className="flex items-center justify-between bg-zinc-900 text-zinc-100 rounded-lg px-4 py-2.5 font-mono text-xs overflow-x-auto">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getMethodBadgeColor(activeEndpoint.method)}`}>
                    {activeEndpoint.method}
                  </span>
                  <span className="text-zinc-200">{activeEndpoint.path}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(activeEndpoint.path, 'active-path')}
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 transition-colors ml-2"
                  title="Copy Path"
                >
                  {copiedKey === 'active-path' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Compliance & Standards Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Compliance Enforced:</span>
              {activeEndpoint.complianceTags.map(tag => (
                <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  {tag}
                </span>
              ))}
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Limit: {activeEndpoint.rateLimit}
              </span>
            </div>

            {/* Headers & Parameters */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
                Required HTTP Headers
              </h3>
              <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-lg p-3 text-xs font-mono space-y-1.5 border border-zinc-200 dark:border-zinc-700">
                {Object.entries(activeEndpoint.headers).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center text-zinc-700 dark:text-zinc-300">
                    <span className="font-semibold text-cyan-700 dark:text-cyan-400">{k}:</span>
                    <span className="text-zinc-500 dark:text-zinc-400 truncate max-w-[280px]">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Body if applicable */}
            {activeEndpoint.requestBody && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
                    Sample Request Body (application/json)
                  </h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(activeEndpoint.requestBody, null, 2), 'req-body')}
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    {copiedKey === 'req-body' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy JSON
                  </button>
                </div>
                <pre className="bg-zinc-900 text-emerald-400 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-56">
                  {typeof activeEndpoint.requestBody === 'string'
                    ? activeEndpoint.requestBody
                    : JSON.stringify(activeEndpoint.requestBody, null, 2)}
                </pre>
              </div>
            )}

            {/* Multi-Language Code Snippets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                  {(['curl', 'typescript', 'python', 'go'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setActiveSnippetLang(lang)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                        activeSnippetLang === lang
                          ? 'bg-white dark:bg-zinc-900 text-cyan-600 dark:text-cyan-400 shadow-sm font-bold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(generateSnippet(activeEndpoint, activeSnippetLang), 'code-snippet')}
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'code-snippet' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Snippet
                </button>
              </div>
              <pre className="bg-zinc-950 text-cyan-300 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-zinc-800 max-h-64">
                {generateSnippet(activeEndpoint, activeSnippetLang)}
              </pre>
            </div>

            {/* Try It Live Execution Console */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-500" />
                    Live Sandbox Runner
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Dispatch live simulated request to the Kronos Banking Gateway proxy.
                  </p>
                </div>
                <button
                  onClick={runLiveSimulation}
                  disabled={isRunningSim}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-2 transition-all shadow-md hover:shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isRunningSim ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Send Test Request
                    </>
                  )}
                </button>
              </div>

              {/* Response output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500 dark:text-zinc-400 font-semibold">Response Payload:</span>
                  {simStatusCode && (
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500 font-bold">Status: {simStatusCode} OK</span>
                      <span className="text-cyan-400 font-bold">Latency: {simLatency}ms</span>
                    </div>
                  )}
                </div>
                <pre className="bg-zinc-900 text-emerald-400 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-64 border border-zinc-800">
                  {simResponse
                    ? JSON.stringify(simResponse, null, 2)
                    : JSON.stringify(activeEndpoint.responseBody, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
