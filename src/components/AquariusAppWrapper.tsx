import React from 'react';
import { Layers, Shield, Sparkles, Activity } from 'lucide-react';

export const AquariusAppWrapper: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-100">
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-900/30 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Aquarius Institutional Banking Suite</h1>
            <p className="text-xs text-gray-400 font-mono">Autonomous Yield, Liquidity Pools & Multi-Agent Mesh</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full text-xs font-mono font-bold">
          v1.0 ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-2">
          <span className="text-gray-400 text-xs block">Consortium Vault Liquidity</span>
          <span className="text-2xl font-black text-white font-mono">$142,850,000</span>
          <span className="text-[10px] text-emerald-400 block font-mono">▲ 4.8% APY Autonomous Rebalance</span>
        </div>
        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-2">
          <span className="text-gray-400 text-xs block">Active Agent Mesh</span>
          <span className="text-2xl font-black text-cyan-400 font-mono">100 Agents</span>
          <span className="text-[10px] text-gray-400 block font-mono">Consensus: Synchronized</span>
        </div>
        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-2">
          <span className="text-gray-400 text-xs block">Institutional Security</span>
          <span className="text-2xl font-black text-purple-400 font-mono">Zero-Knowledge</span>
          <span className="text-[10px] text-purple-300 block font-mono">snarkjs / Groth16 Prover</span>
        </div>
      </div>
    </div>
  );
};

export default AquariusAppWrapper;
