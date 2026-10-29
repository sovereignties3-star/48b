import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, Terminal, Globe, Send, RefreshCw, Compass, Search } from 'lucide-react';

const DEFAULT_SAMPLE_OPERATIONS = [
  { path: '/v1/accounts', method: 'GET', summary: 'List customer deposit and loan accounts', parameters: [{ name: 'limit', in: 'query', default: '25' }] },
  { path: '/v1/accounts/{accountId}', method: 'GET', summary: 'Retrieve account details and current ledger balance', parameters: [{ name: 'accountId', in: 'path', default: 'act_1001' }] },
  { path: '/v1/transfers', method: 'POST', summary: 'Initiate domestic ACH or wire transfer', parameters: [], requestBody: { content: { 'application/json': { schema: { example: { amount: 1500, currency: 'USD', destination: 'act_2002' } } } } } },
  { path: '/v1/statements', method: 'GET', summary: 'Query monthly bank statements and retrieval hashes', parameters: [{ name: 'year', in: 'query', default: '2024' }] },
  { path: '/v1/webhooks', method: 'POST', summary: 'Register webhook endpoint for real-time ledger events', parameters: [], requestBody: { content: { 'application/json': { schema: { example: { url: 'https://citibankdemobusiness.dev', events: ['transfer.created'] } } } } } },
  { path: '/api/v2/apiTokens', method: 'POST', summary: 'Create Dynatrace API v2 token with scope permissions', parameters: [], requestBody: { content: { 'application/json': { schema: { example: { name: 'gcp', scopes: ['activeGates.read', 'apiTokens.read'] } } } } } }
];

export interface EndpointRunnerProps {
  specTitle: string;
  baseUrl: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  summary?: string;
  parameters?: Array<{ name: string; in: string; required?: boolean; type?: string; default?: any }>;
  defaultBody?: any;
  onExecute?: (options: any) => Promise<any>;
}

export const GeneratedApiEndpointTester: React.FC<EndpointRunnerProps> = ({
  specTitle,
  baseUrl,
  path,
  method,
  summary,
  parameters = [],
  defaultBody,
  onExecute,
}) => {
  const [targetUrl, setTargetUrl] = useState(baseUrl);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyText, setBodyText] = useState(defaultBody ? JSON.stringify(defaultBody, null, 2) : '');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleParamChange = (name: string, val: string) => {
    setParamValues(prev => ({ ...prev, [name]: val }));
  };

  const handleRun = async () => {
    setLoading(true);
    setResponse(null);

    const queryParams: Record<string, string> = {};
    const pathParams: Record<string, string> = {};
    const headers: Record<string, string> = {};

    parameters.forEach(p => {
      const val = paramValues[p.name];
      if (val !== undefined && val !== '') {
        if (p.in === 'path') pathParams[p.name] = val;
        else if (p.in === 'query') queryParams[p.name] = val;
        else if (p.in === 'header') headers[p.name] = val;
      }
    });

    let bodyPayload: any = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method) && bodyText) {
      try {
        bodyPayload = JSON.parse(bodyText);
      } catch {
        bodyPayload = bodyText;
      }
    }

    if (onExecute) {
      try {
        const res = await onExecute({
          baseUrl: targetUrl,
          path,
          method,
          queryParams,
          pathParams,
          headers,
          body: bodyPayload,
        });
        setResponse(res);
      } catch (err: any) {
        setResponse({ ok: false, error: err.message });
      }
    } else {
      setTimeout(() => {
        setResponse({
          ok: true,
          status: 200,
          statusText: 'OK (Mock)',
          data: {
            message: 'Endpoint executed successfully in mock preview environment',
            endpoint: path,
            method,
            timestamp: new Date().toISOString(),
          },
          durationMs: 42,
        });
        setLoading(false);
      }, 500);
      return;
    }

    setLoading(false);
  };

  const copyCurl = () => {
    const curl = 'curl -X ' + method + ' "' + targetUrl + path + '" -H "Content-Type: application/json"';
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadgeClass = () => {
    if (method === 'GET') return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    if (method === 'POST') return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    if (method === 'PUT') return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
  };

  const getStatusClass = () => {
    if (!response) return '';
    return 'font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ' + (response.ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400');
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4 text-white">
      <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
        <div className="flex items-center space-x-3">
          <span className={'px-2.5 py-1 rounded text-xs font-bold ' + getMethodBadgeClass()}>
            {method}
          </span>
          <span className="font-mono text-sm text-gray-200">{path}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyCurl}
            className="flex items-center space-x-1 px-2.5 py-1 bg-[#21262D] hover:bg-[#30363D] text-xs text-gray-300 rounded border border-[#30363D]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>cURL</span>
          </button>
          <button
            onClick={handleRun}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-1 bg-[#238636] hover:bg-[#2ea043] text-xs font-medium text-white rounded transition"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>Run Test</span>
          </button>
        </div>
      </div>

      {summary && <p className="text-xs text-gray-400">{summary}</p>}

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Target Base URL</label>
        <input
          type="text"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-1.5 text-xs text-gray-200 font-mono focus:border-blue-500 outline-none"
        />
      </div>

      {parameters.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300">Parameters ({parameters.length})</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {parameters.map((p) => (
              <div key={p.name} className="bg-[#0D1117] p-2 rounded border border-[#30363D]">
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="font-mono text-blue-400">{p.name}</span>
                  <span className="text-gray-500 text-[10px] uppercase">{p.in}</span>
                </div>
                <input
                  type="text"
                  placeholder={p.default || ('value for ' + p.name)}
                  value={paramValues[p.name] || ''}
                  onChange={(e) => handleParamChange(p.name, e.target.value)}
                  className="w-full bg-[#161B22] border border-[#30363D] rounded px-2 py-1 text-xs text-gray-200 font-mono outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {['POST', 'PUT', 'PATCH'].includes(method) && (
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Request Body (JSON)</label>
          <textarea
            rows={4}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded p-2 text-xs font-mono text-emerald-300 outline-none"
          />
        </div>
      )}

      {response && (
        <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs border-b border-[#30363D] pb-1.5">
            <span className="font-medium text-gray-400">Response</span>
            <div className="flex items-center space-x-2">
              <span className={getStatusClass()}>
                {response.status || (response.ok ? '200 OK' : 'FAILED')}
              </span>
              {response.durationMs !== undefined && (
                <span className="text-gray-500 text-[11px]">{response.durationMs}ms</span>
              )}
            </div>
          </div>
          <pre className="text-[11px] font-mono text-gray-300 max-h-60 overflow-auto whitespace-pre-wrap">
            {JSON.stringify(response.data || response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export const GeneratedApiExplorer: React.FC = () => {
  const [selectedSpecId, setSelectedSpecId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [operations, setOperations] = useState<Array<{ path: string; method: string; summary?: string; parameters?: any[]; requestBody?: any }>>(DEFAULT_SAMPLE_OPERATIONS);

  useEffect(() => {
    fetch('/api/workbench/catalog')
      .then(res => res.ok ? res.json() : null)
      .then(catalog => {
        if (!catalog || !catalog.paths) return;
        const loadedOps: Array<{ path: string; method: string; summary?: string; parameters?: any[]; requestBody?: any }> = [];
        for (const [pathKey, pathItem] of Object.entries(catalog.paths)) {
          for (const [mKey, opObj] of Object.entries(pathItem as Record<string, any>)) {
            if (typeof opObj === 'object' && opObj !== null) {
              loadedOps.push({
                path: pathKey,
                method: mKey.toUpperCase(),
                summary: (opObj as any).summary,
                parameters: (opObj as any).parameters,
                requestBody: (opObj as any).requestBody,
              });
            }
          }
        }
        if (loadedOps.length > 0) {
          setOperations(loadedOps);
        }
      })
      .catch(() => {
        // Fallback to sample operations
      });
  }, []);

  const filteredOps = operations.filter(op => 
    op.path.toLowerCase().includes(search.toLowerCase()) || 
    op.method.toLowerCase().includes(search.toLowerCase()) ||
    (op.summary && op.summary.toLowerCase().includes(search.toLowerCase()))
  );

  const [activeOp, setActiveOp] = useState<any>(operations[0] || null);

  const handleExecute = async (options: any) => {
    const response = await fetch('/api/workbench/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: options.baseUrl + options.path,
        method: options.method,
        headers: options.headers,
        queryParams: options.queryParams,
        body: options.body
      })
    });
    return response.json();
  };

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden text-white flex flex-col md:flex-row h-[600px]">
      <div className="w-full md:w-80 border-r border-[#30363D] flex flex-col h-full bg-[#0D1117]">
        <div className="p-3 border-b border-[#30363D]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter 620+ endpoints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#161B22] border border-[#30363D] rounded px-8 py-1.5 text-xs text-gray-200 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[#30363D]">
          {filteredOps.map((op, idx) => (
            <button
              key={op.path + '-' + op.method + '-' + idx}
              onClick={() => setActiveOp(op)}
              className={'w-full text-left p-3 text-xs transition flex flex-col space-y-1.5 ' + (activeOp === op ? 'bg-[#21262D]' : 'hover:bg-[#161B22]/50')}
            >
              <div className="flex items-center space-x-2">
                <span className={'px-1.5 py-0.5 rounded text-[10px] font-bold ' + (
                  op.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                  op.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                  op.method === 'PUT' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-rose-500/20 text-rose-400'
                )}>
                  {op.method}
                </span>
                <span className="font-mono text-gray-300 truncate flex-1">{op.path}</span>
              </div>
              {op.summary && <span className="text-gray-400 text-[10px] truncate">{op.summary}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 bg-[#0D1117]/40 h-full">
        {activeOp ? (
          <GeneratedApiEndpointTester
            specTitle="Consolidated Sovereign Workbench"
            baseUrl="http://localhost:3000"
            path={activeOp.path}
            method={activeOp.method}
            summary={activeOp.summary}
            parameters={activeOp.parameters}
            defaultBody={activeOp.requestBody?.content?.['application/json']?.schema?.example || {}}
            onExecute={handleExecute}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-2">
            <Compass className="w-8 h-8 text-gray-600 animate-pulse" />
            <p className="text-xs">Select an endpoint to execute live API test requests against the database.</p>
          </div>
        )}
      </div>
    </div>
  );
};
