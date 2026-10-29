import React from 'react';
import { Building2, CreditCard, RefreshCw, Key, Activity, Send } from 'lucide-react';
import { OBPBank, OBPAccount, OBPTransaction, OBPCustomer, OBPBranch, OBPProduct } from '../types';

interface OpenBankProjectTabProps {
  banks: OBPBank[];
  accounts: OBPAccount[];
  transactions: OBPTransaction[];
  customers: OBPCustomer[];
  branches: OBPBranch[];
  products: OBPProduct[];
  onOpenTransferModal: (accountId?: string) => void;
  onOpenCredentialsModal: () => void;
  onOpenTelemetryModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const OpenBankProjectTab: React.FC<OpenBankProjectTabProps> = ({
  banks,
  accounts,
  transactions,
  customers,
  branches,
  products,
  onOpenTransferModal,
  onOpenCredentialsModal,
  onOpenTelemetryModal,
  onRefresh,
  isRefreshing
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>Open Bank Project (OBP) Core Engine</span>
          </h2>
          <p className="text-xs text-slate-400">Citibank Demo Business Institutional Direct API Bridge</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCredentialsModal}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-white/10 flex items-center gap-1.5 transition"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Credentials</span>
          </button>
          <button
            onClick={onOpenTelemetryModal}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-white/10 flex items-center gap-1.5 transition"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Telemetry</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white rounded-xl shadow-md flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block">Connected Banks</span>
          <span className="text-2xl font-bold text-white font-mono">{banks.length || 1}</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block">Active Accounts</span>
          <span className="text-2xl font-bold text-cyan-400 font-mono">{accounts.length}</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block">Ledger Transactions</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">{transactions.length}</span>
        </div>
      </div>
    </div>
  );
};

export default OpenBankProjectTab;
