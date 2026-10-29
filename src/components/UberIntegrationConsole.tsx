import React, { useState, useEffect } from 'react';
import { Car, Clock, MapPin, Shield, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, ShoppingBag, Key } from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

export const UberIntegrationConsole: React.FC = () => {
  const [tokens, setTokens] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any>('/api/uber/tokens');
      if (res.ok && res.data?.tokens) {
        setTokens(res.data.tokens);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async () => {
    try {
      const res = await apiFetch<any>('/api/uber/auth-url');
      if (res.ok && res.data?.authUrl) {
        window.location.href = res.data.authUrl;
      }
    } catch (err: any) {
      setError(`Failed to initiate Uber OAuth: ${err.message}`);
    }
  };

  const handleClientCredentials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/api/uber/client-credentials-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'places' })
      });
      if (res.ok && res.data?.tokens) {
        setTokens(res.data.tokens);
      } else {
        setError(res.data?.error || 'Failed to generate client credentials token');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJwtAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/api/uber/jwt-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'places' })
      });
      if (res.ok && res.data?.tokens) {
        setTokens(res.data.tokens);
      } else {
        setError(res.data?.error || 'Failed to generate JWT token');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUberData = async () => {
    if (!tokens) return;
    setLoading(true);
    try {
      // Mock latitude/longitude for demo
      const lat = '37.7759';
      const lng = '-122.4182';
      
      const [prodRes, histRes] = await Promise.all([
        apiFetch<any>(`/api/uber/products?latitude=${lat}&longitude=${lng}`),
        apiFetch<any>('/api/uber/history')
      ]);

      if (prodRes.ok) setProducts(prodRes.data?.products || []);
      if (histRes.ok) setHistory(histRes.data?.history || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Check URL params for success
    const params = new URLSearchParams(window.location.search);
    if (params.get('uber_auth') === 'success') {
      // Logic would be here if tokens were stored in session
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#30363d] pb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-black rounded-xl shadow-lg shadow-black/20 text-white">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
              Uber Multi-Service Gateway
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-[#f6f8fa] border border-[#30363d] font-mono">
                CONNECTED
              </span>
            </h1>
            <p className="text-sm text-[#8b949e] mt-1">
              Autonomous Logistics & Delivery Ingestion for Kroger Shipments
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!tokens ? (
            <>
              <button 
                onClick={handleJwtAuth}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all border border-indigo-500 shadow-lg disabled:opacity-50"
              >
                <Key className="w-4 h-4" />
                {loading ? 'Signing...' : 'JWT Auth Flow'}
              </button>
              <button 
                onClick={handleClientCredentials}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-[#1f2937] text-white rounded-lg text-xs font-bold transition-all border border-[#30363d] disabled:opacity-50"
              >
                <Key className="w-4 h-4" />
                Client Credentials
              </button>
              <button 
                onClick={handleAuthorize}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all border border-blue-500 shadow-lg"
              >
                <Shield className="w-4 h-4" />
                OAuth 2.0 Auth
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                UBER AUTH ACTIVE
              </span>
              <button 
                onClick={fetchUberData}
                className="p-2 bg-[#21262d] hover:bg-[#30363d] rounded-lg transition-all border border-[#30363d]"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl text-rose-400 text-sm flex items-center gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Workflow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Kroger Order Detected */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">Step 1: Ledger Ingestion</h3>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="p-4 bg-[#0d1117] rounded-xl border border-blue-500/30">
            <p className="text-xs font-bold text-blue-400 mb-1">KROGER ORDER: #SOV-99281</p>
            <p className="text-[10px] text-[#8b949e]">Status: Awaiting Dispatch</p>
            <p className="text-[10px] text-[#8b949e]">Origin: Cincinnati Hub</p>
          </div>
          <p className="text-xs text-[#8b949e] leading-relaxed">
            The sovereign ledger automatically detects Kroger purchase events and initiates a logistics quote request via the Uber API.
          </p>
        </div>

        {/* Step 2: Uber Logistics Match */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">Step 2: Uber Dispatch</h3>
            {tokens ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500 animate-pulse" />}
          </div>
          <div className="space-y-2">
            {products.length > 0 ? (
              products.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#0d1117] rounded-lg border border-[#30363d]">
                  <span className="text-[10px] font-bold text-white">{p.display_name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">READY</span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-[#30363d] rounded-xl">
                <Car className="w-6 h-6 text-[#30363d] mx-auto mb-2" />
                <p className="text-[10px] text-[#8b949e]">Awaiting Uber OAuth...</p>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Real-Time Delivery */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">Step 3: Settlement</h3>
            <Clock className="w-4 h-4 text-[#30363d]" />
          </div>
          <div className="aspect-video bg-[#0d1117] rounded-xl border border-[#30363d] flex items-center justify-center relative overflow-hidden">
            <MapPin className="w-8 h-8 text-rose-500 absolute animate-bounce" />
            <div className="w-full h-full opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_marker_icon_%E2%80%93_Road_Map.png')] bg-cover"></div>
          </div>
          <p className="text-xs text-[#8b949e]">
            Logistics costs are debited from the Citibank Corporate Treasury sub-ledger and reconciled in QuickBooks automatically.
          </p>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Autonomous Logistics Event Stream
        </h3>
        <div className="space-y-3 font-mono text-[11px]">
          {history.length > 0 ? (
            history.map((h, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-[#30363d]">
                <span className="text-[#8b949e] shrink-0">{new Date(h.request_time * 1000).toLocaleTimeString()}</span>
                <span className="text-blue-400 font-bold">[{h.status.toUpperCase()}]</span>
                <span className="text-[#c9d1d9]">{h.start_city.display_name} ➔ {h.end_city.display_name}</span>
              </div>
            ))
          ) : (
            <div className="text-[#8b949e] italic">No recent logistics events detected.</div>
          )}
        </div>
      </div>
    </div>
  );
};
