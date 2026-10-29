import React, { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Radio, RefreshCw, Terminal, CheckCircle2, AlertTriangle, Globe, User, Server, Play, StopCircle, Send } from 'lucide-react';

export const FullViewCustomerStateHub: React.FC = () => {
  const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJjdXN0b21lciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiNDM0N2RlY2UtNTBmYy00MGVmLWFiMTUtNTk2ZmJjNzk5YTU4Iiwib3JnYW5pc2F0aW9uX2lkIjoiM2FkYzhkNDEtYWRiNC00ZTNjLWE0NGUtNDI1NWI2ZTkxZTNlIiwiZXh0ZXJuYWxfaWQiOiI2YWNlZGI0ZThhOWJiZDAwMGM1MmQ3NTUiLCJ0YWJfaWQiOiIwNmUxYTFjZi1mYjY0LTRjOWMtYmIyMC00MGY4NzljODUwMjAiLCJ0YWJfY3VycmVudF91cmwiOiJodHRwczovL2FwcC5hcG9sbG8uaW8vIy9wZW9wbGU_cGFnZT04JnBlcnNvblRpdGxlc1tdPWNoaWVmJTIwdGVjaG5vbG9neSUyMG9mZmljZXImcGVyc29uVGl0bGVzW109dmljZSUyMHByZXNpZGVudCUyMG9mJTIwZW5naW5lZXJpbmcmcGVyc29uVGl0bGVzW109aGVhZCUyMG9mJTIwZmluYW5jaWFsJTIwaW5mcmFzdHJ1Y3R1cmUmcGVyc29uVGl0bGVzW109bGVhZCUyMHBheW1lbnQlMjBhcmNoaXRlY3QmcGVyc29uVGl0bGVzW109ZW50ZXJwcmlzZSUyMGFwaSUyMGludGVncmF0aW9uJTIwbWFuYWdlciZwZXJzb25UaXRsZXNbXT1sZWFkJTIwYWklMjBzeXN0ZW1zJTIwZW5naW5lZXImb3JnYW5pemF0aW9uTG9jYXRpb25zW109bm9ydGglMjBhbWVyaWNhJm9yZ2FuaXphdGlvbk51bUVtcGxveWVlc1Jhbmdlc1tdPTUwJTJDNTAwMCZvcmdhbml6YXRpb25JbmR1c3RyeVRhZ0lkc1tdPTU1NjdjZTIzNzM2OTY0NGVlNTQ5MDAwMCZvcmdhbml6YXRpb25JbmR1c3RyeVRhZ0lkc1tdPTU1NjdjZGQ2NzM2OTY0M2U2NDAyMDAwMCZxT3JnYW5pemF0aW9uS2V5d29yZFRhZ3NbXT1wYXltZW50JTIwcHJvY2Vzc2luZyZxT3JnYW5pemF0aW9uS2V5d29yZFRhZ3NbXT1wYXltZW50JTIwcHJvY2Vzc29yJnFPcmdhbml6YXRpb25LZXl3b3JkVGFnc1tdPXBheW1lbnQlMjBwcm9jZXNzaW5nJTIwc2VydmljZXMmcU9yZ2FuaXphdGlvbktleXdvcmRUYWdzW109d2VhbHRoJTIwbWFuYWdlbWVudCUyMHRlY2hub2xvZ3kmcU9yZ2FuaXphdGlvbktleXdvcmRUYWdzW109d2VhbHRodGVjaCZxT3JnYW5pemF0aW9uS2V5d29yZFRhZ3NbXT1kaWdpdGFsJTIwd2VhbHRoJTIwbWFuYWdlbWVudCZtYXJrZXRTZWdtZW50c1tdPWZpbnRlY2gmc29ydEJ5RmllbGQ9JTVCbm9uZSU1RCZzb3J0QXNjZW5kaW5nPWZhbHNlJnJlY29tbWVuZGF0aW9uQ29uZmlnSWQ9c2NvcmUiLCJzZGtfcGxhdGZvcm0iOiJ3ZWIiLCJzZGtfdmVyc2lvbiI6IjIuMjI4LjAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiU292ZXJlaWduIFRpZXMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzb3ZlcmVpZ250aWVzM0BnbWFpbC5jb20iLCJkZXZpY2VfaWQiOiJmNjNhYzBiYy1iYjgwLTRjYjEtYjk2ZC01MjNkYTY4NDc2MzAiLCJleHAiOjE3OTIwMjg1Mjl9.ihNpJ9mMYxVzi3sMwtfON7S8vGEYljPCFmRDXfiJFAwOQdluARIOBdbn_y4zdRgjx-5U8cimWH5DA1NRIa-TaA";

  const wsUrl = `wss://api.us1.fullview.io/access/hubs/customerState?access_token=${token}`;

  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [logs, setLogs] = useState<{ timestamp: string; type: 'info' | 'error' | 'success' | 'message'; text: string }[]>([]);
  const [messageInput, setMessageInput] = useState('{"action": "ping", "timestamp": ' + Date.now() + '}');
  const wsRef = useRef<WebSocket | null>(null);

  // Decode JWT payload for UI display
  const jwtPayload = React.useMemo(() => {
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const decoded = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return decoded;
      }
    } catch {
      return null;
    }
  }, [token]);

  const addLog = (text: string, type: 'info' | 'error' | 'success' | 'message' = 'info') => {
    setLogs((prev) => [
      { timestamp: new Date().toLocaleTimeString(), type, text },
      ...prev,
    ]);
  };

  const connectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    setConnectionStatus('connecting');
    addLog(`Initiating WebSocket connection to FullView Hub...`, 'info');

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        addLog(`Successfully connected to FullView customerState WebSocket hub!`, 'success');
      };

      ws.onmessage = (event) => {
        addLog(`Received message: ${event.data}`, 'message');
      };

      ws.onerror = (error) => {
        setConnectionStatus('error');
        addLog(`WebSocket connection error encountered (CORS/Network/WSS constraint).`, 'error');
        console.error('FullView WS Error:', error);
      };

      ws.onclose = (event) => {
        setConnectionStatus('disconnected');
        addLog(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason || 'None'}`, 'info');
      };
    } catch (err: any) {
      setConnectionStatus('error');
      addLog(`Failed to construct WebSocket: ${err.message}`, 'error');
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus('disconnected');
    addLog(`Disconnected by user.`, 'info');
  };

  const sendMessage = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addLog(`Cannot send message: WebSocket is not open.`, 'error');
      return;
    }
    try {
      wsRef.current.send(messageInput);
      addLog(`Sent payload: ${messageInput}`, 'success');
    } catch (err: any) {
      addLog(`Failed to send message: ${err.message}`, 'error');
    }
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-gray-100 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/60 border border-blue-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">FullView Customer State WebSocket Hub</h1>
              <p className="text-xs text-gray-400 font-mono">wss://api.us1.fullview.io/access/hubs/customerState</p>
            </div>
          </div>
          <p className="text-xs text-gray-300 max-w-2xl">
            Note: Standard browser <code className="text-blue-300 bg-blue-950 px-1 py-0.5 rounded">fetch()</code> cannot initiate WebSocket connections (<code className="text-rose-300">wss://</code>). This console provides the correct native <code className="text-emerald-300">WebSocket</code> client wrapper with real-time telemetry streaming and JWT session decoding.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {connectionStatus !== 'connected' ? (
            <button
              onClick={connectWebSocket}
              className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Connect WebSocket</span>
            </button>
          ) : (
            <button
              onClick={disconnectWebSocket}
              className="flex items-center space-x-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
            >
              <StopCircle className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: JWT Claims & Connection Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Status Card */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Connection Status</span>
            </h3>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono uppercase border ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : connectionStatus === 'connecting'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                  : connectionStatus === 'error'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}
            >
              {connectionStatus}
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono bg-[#0d1117] p-3.5 rounded-xl border border-[#30363D]">
            <div>
              <span className="text-gray-500 block">Protocol:</span>
              <span className="text-blue-300">WSS (Secure WebSocket)</span>
            </div>
            <div>
              <span className="text-gray-500 block">Endpoint Host:</span>
              <span className="text-gray-300">api.us1.fullview.io</span>
            </div>
            <div>
              <span className="text-gray-500 block">Hub Path:</span>
              <span className="text-gray-300">/access/hubs/customerState</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300">Send Test Frame / Ping</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-[#0d1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={connectionStatus !== 'connected'}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decoded JWT Session & Context */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Decoded JWT Session Claims & Context</span>
            </h3>
            <span className="text-[10px] text-gray-400 font-mono bg-[#0d1117] px-2 py-1 rounded border border-[#30363D]">
              HS512 Signed Token
            </span>
          </div>

          {jwtPayload ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-[#0d1117] p-4 rounded-xl border border-[#30363D]">
              <div className="space-y-2">
                <div>
                  <span className="text-gray-500 text-[10px] uppercase">User Name:</span>
                  <p className="text-white font-bold">{jwtPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase">Email Address:</span>
                  <p className="text-emerald-400 font-bold">{jwtPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase">Role:</span>
                  <p className="text-amber-400 font-bold">{jwtPayload["http://schemas.xmlsoap.org/ws/2008/06/identity/claims/role"] || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase">Organization ID:</span>
                  <p className="text-gray-300">{jwtPayload.organisation_id || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-gray-500 text-[10px] uppercase">Device ID:</span>
                  <p className="text-gray-300">{jwtPayload.device_id || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase">Tab ID:</span>
                  <p className="text-gray-300">{jwtPayload.tab_id || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase">Current Active URL:</span>
                  <p className="text-blue-300 truncate max-w-xs" title={jwtPayload.tab_current_url}>
                    {jwtPayload.tab_current_url || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase">Token Expiry:</span>
                  <p className="text-gray-300">{new Date(jwtPayload.exp * 1000).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-rose-400">Failed to decode JWT token payload.</p>
          )}
        </div>
      </div>

      {/* Real-time Telemetry & WebSocket Logs */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Real-time WebSocket Stream & Event Logs</span>
          </h3>
          <button
            onClick={() => setLogs([])}
            className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] text-gray-300 text-xs rounded-lg border border-[#30363d] transition cursor-pointer"
          >
            Clear Logs
          </button>
        </div>

        <div className="bg-[#0d1117] border border-[#30363D] rounded-xl p-4 h-72 overflow-y-auto font-mono text-xs space-y-2 shadow-inner">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-20">
              No events recorded yet. Click &quot;Connect WebSocket&quot; above to establish the stream.
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 border-b border-[#21262d] pb-1.5">
                <span className="text-gray-500 shrink-0">{log.timestamp}</span>
                <span
                  className={`shrink-0 uppercase font-bold text-[10px] px-1.5 py-0.5 rounded ${
                    log.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : log.type === 'error'
                      ? 'bg-rose-500/20 text-rose-400'
                      : log.type === 'message'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {log.type}
                </span>
                <span className="text-gray-200 break-all">{log.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
