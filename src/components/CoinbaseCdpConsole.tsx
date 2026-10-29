import React, { useState } from 'react';
import { Coins, Wallet, Shield, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';

export const CoinbaseCdpConsole: React.FC = () => {
  const [wallet, setWallet] = useState({
    address: '0x3adC8D41Adb44E3cA44E4255b6E91E3E2026',
    network: 'base-mainnet',
    balanceUsdc: 2500000.00,
    status: 'ACTIVE_MPC'
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-100">
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Coinbase Developer Platform (CDP) Console</h1>
            <p className="text-xs text-gray-400 font-mono">MPC Wallets, Smart Contracts & Server-Side Signer</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-2">
          <span className="text-gray-400 text-xs block">Active MPC Wallet</span>
          <span className="text-xs font-mono text-blue-300 break-all select-all">{wallet.address}</span>
        </div>
        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-2">
          <span className="text-gray-400 text-xs block">Network</span>
          <span className="text-base font-bold text-emerald-400 font-mono uppercase">{wallet.network}</span>
        </div>
        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-2">
          <span className="text-gray-400 text-xs block">Treasury Reserves</span>
          <span className="text-xl font-black text-white font-mono">${wallet.balanceUsdc.toLocaleString()} USDC</span>
        </div>
      </div>
    </div>
  );
};

export default CoinbaseCdpConsole;
