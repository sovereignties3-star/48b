import React, { useState } from 'react';
import { Activity, Server, Radio, Shield, RefreshCw } from 'lucide-react';

export const NewRelicConsole: React.FC = () => {
  const [metrics, setMetrics] = useState({
    apdexScore: 0.98,
    responseTimeMs: 42,
    throughputRpm: 1240,
    errorRatePercent: 0.02,
    status: 'OPTIMAL'
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-100">
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">New Relic One APM & Telemetry</h1>
            <p className="text-xs text-gray-400 font-mono">Entity: kronos-apex-financial-os // US1 Region</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-mono font-bold">
          LIVE APM STREAM
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
          <span className="text-gray-400 text-xs block">Apdex Score</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">{metrics.apdexScore}</span>
        </div>
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
          <span className="text-gray-400 text-xs block">Avg Response Time</span>
          <span className="text-2xl font-bold text-blue-400 font-mono">{metrics.responseTimeMs} ms</span>
        </div>
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
          <span className="text-gray-400 text-xs block">Throughput</span>
          <span className="text-2xl font-bold text-purple-400 font-mono">{metrics.throughputRpm} rpm</span>
        </div>
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
          <span className="text-gray-400 text-xs block">Error Rate</span>
          <span className="text-2xl font-bold text-gray-200 font-mono">{metrics.errorRatePercent}%</span>
        </div>
      </div>
    </div>
  );
};

export default NewRelicConsole;
