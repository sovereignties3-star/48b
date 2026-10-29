import React, { useState, useEffect } from 'react';
import { Server, Cpu, RefreshCw, Send, CheckCircle2, Shield, Radio, Database, Terminal, Layers } from 'lucide-react';

interface KafkaMessage {
  offset: number;
  partition: number;
  timestamp: string;
  key: string;
  value: any;
}

export const ConfluentKafkaHub: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [messages, setMessages] = useState<KafkaMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [publishResult, setPublishResult] = useState<any>(null);

  const fetchConfluentData = async () => {
    setLoading(true);
    try {
      const statusRes = await fetch('/api/confluent/status');
      const statusData = await statusRes.json();
      if (statusData.success) setStatus(statusData);

      const msgRes = await fetch('/api/confluent/messages');
      const msgData = await msgRes.json();
      if (msgData.success) setMessages(msgData.messages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfluentData();
  }, []);

  const handlePublishEvent = async () => {
    setPublishing(true);
    try {
      const res = await fetch('/api/confluent/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: `HOUSE-${Math.floor(Math.random() * 8999 + 1000)}`,
          address: 'Confluent Stream Verified Asset, US',
          valuationUsd: 1450000,
          seller: 'Confluent Real Estate Syndicate'
        })
      });
      const data = await res.json();
      if (data.success) {
        setPublishResult(data);
        fetchConfluentData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-neutral-950 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Confluent Cloud Enterprise Kafka Integration</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>Cluster: lkc-o3xxyy</span>
              <span className="text-xs font-mono px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                CONNECTED
              </span>
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl font-mono">
              Bootstrap Server: <span className="text-amber-300">pkc-4yyd6.us-east1.gcp.confluent.cloud:9092</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchConfluentData}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-gray-200 text-xs font-semibold border border-[#30363d] transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>Refresh Metrics</span>
            </button>
            <button
              onClick={handlePublishEvent}
              disabled={publishing}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-white" />
              <span>{publishing ? 'Publishing Event...' : '⚡ Produce Kafka Event'}</span>
            </button>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-amber-500/20 text-xs font-mono">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-amber-500/20">
            <p className="text-gray-400">API Key</p>
            <p className="text-amber-300 font-bold mt-1 tracking-wider">IMSHS5A3FDMMNM2U</p>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-amber-500/20">
            <p className="text-gray-400">API Secret</p>
            <p className="text-gray-200 font-bold mt-1 truncate">KLJ03hPo5j8djXqkTVOeNYD/lSPeoag3PPSqibuqI0uoeQxrpX1SjCsa/yvmpztT</p>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-amber-500/20">
            <p className="text-gray-400">Active Topic</p>
            <p className="text-emerald-400 font-bold mt-1">house-acquisitions-stream</p>
          </div>
        </div>
      </div>

      {/* Live Stream Messages Table */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#30363D]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              <span>Live Kafka Stream Messages (Topic: house-acquisitions-stream)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Real-time message ingestion and partition logging from Confluent Cloud cluster lkc-o3xxyy.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
            {messages.length} Messages Buffered
          </span>
        </div>

        <div className="space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className="bg-[#0D1117] rounded-xl p-4 border border-[#30363D] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-gray-400 text-[11px] border-b border-[#21262d] pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-bold">Partition: {msg.partition}</span>
                  <span>Offset: {msg.offset}</span>
                  <span className="text-indigo-400">Key: {msg.key}</span>
                </div>
                <span>{msg.timestamp}</span>
              </div>
              <pre className="text-emerald-400 text-[11px] overflow-x-auto">{JSON.stringify(msg.value, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfluentKafkaHub;
