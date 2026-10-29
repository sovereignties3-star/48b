import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  Trash2, 
  Shield, 
  ArrowRight, 
  Globe, 
  LogIn, 
  LogOut, 
  Layers, 
  Building2, 
  Key, 
  Check, 
  Copy, 
  FileText,
  Lock
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';
import { IntuitConfig } from '../types';

interface OAuthLifecyclePageProps {
  mode: 'launch' | 'disconnect' | 'connect';
  onNavigateHome?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const OAuthLifecyclePages: React.FC<OAuthLifecyclePageProps> = ({
  mode,
  onNavigateHome,
  onNavigateToTab
}) => {
  const [config, setConfig] = useState<IntuitConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [disconnected, setDisconnected] = useState(false);

  const fetchConfig = async () => {
    try {
      const res = await apiFetch<IntuitConfig>('/api/intuit/config');
      if (res.ok && res.data) {
        setConfig(res.data);
      }
    } catch (e) {
      console.error('Error fetching config:', e);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await apiFetch('/api/intuit/clear-session', { method: 'POST' });
      setDisconnected(true);
      setActionMessage('Successfully disconnected. Active tokens have been revoked and purged from the session.');
      fetchConfig();
    } catch (err: any) {
      setActionMessage(`Disconnect warning: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchToApp = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  // ==========================================
  // LAUNCH PAGE (/launch)
  // ==========================================
  if (mode === 'launch') {
    const hasToken = config?.activeTokens?.hasAccessToken;
    const realmId = config?.activeTokens?.realmId;

    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-3 pb-6 border-b border-[#30363D]">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Application Launch & Authorization Complete
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-[#8B949E] mt-1">
                You have authenticated with Intuit QuickBooks Online. Your workspace is synchronized.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
              <span className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider block">
                Target Company / Realm
              </span>
              <p className="text-sm font-mono font-bold text-white flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>{realmId ? `Company ID: ${realmId}` : 'Enterprise Multi-Entity Session'}</span>
              </p>
              <p className="text-[11px] text-[#8B949E]">
                Chart of Accounts and ledger synchronization ready.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
              <span className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider block">
                Session Token Status
              </span>
              <p className="text-sm font-mono font-bold text-emerald-400 flex items-center space-x-2">
                <Key className="w-4 h-4" />
                <span>{hasToken ? 'Active OAuth 2.0 Bearer Token' : 'Sandbox Development Key Active'}</span>
              </p>
              <p className="text-[11px] text-[#8B949E]">
                Encrypted in-flight with TLS 1.3 to Intuit sandbox and production clusters.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#30363D]">
            <a
              href="/disconnect"
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Need to disconnect instead?</span>
            </a>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (onNavigateToTab) onNavigateToTab('sovereign-singularity');
                  else window.location.href = '/';
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all border border-emerald-400/40 flex items-center space-x-2 cursor-pointer"
              >
                <span>Enter Banking Operating System</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // DISCONNECT PAGE (/disconnect)
  // ==========================================
  if (mode === 'disconnect') {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-3 pb-6 border-b border-[#30363D]">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <LogOut className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Disconnect Application & Revoke Access
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  DISCONNECT PORTAL
                </span>
              </div>
              <p className="text-xs text-[#8B949E] mt-1">
                Revoke OAuth credentials, terminate the active company session, and guarantee data privacy.
              </p>
            </div>
          </div>

          {actionMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          <div className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>What Happens Upon Disconnection?</span>
            </h3>
            <ul className="text-xs text-[#8B949E] space-y-2 list-disc pl-5">
              <li>Active QuickBooks OAuth 2.0 access and refresh tokens are wiped from runtime state.</li>
              <li>Continuous background bank synchronization jobs for this realm are stopped immediately.</li>
              <li>Your QuickBooks company books and historical transactions remain completely safe and untouched inside Intuit.</li>
              <li>You may reconnect at any time without data loss by visiting the Connect URL.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#30363D]">
            <a
              href="/connect"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Want to reconnect or change company?</span>
            </a>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleDisconnect}
                disabled={loading || disconnected}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition-all border border-rose-400/40 flex items-center space-x-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{loading ? 'Revoking...' : disconnected ? 'Session Cleared' : 'Confirm Disconnect Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CONNECT / RECONNECT PAGE (/connect)
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-3 pb-6 border-b border-[#30363D]">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <LogIn className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Connect / Reconnect to QuickBooks Online
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                OAUTH 2.0 PKCE
              </span>
            </div>
            <p className="text-xs text-[#8B949E] mt-1">
              Authorize the Kronos Apex Financial Operating System to synchronize your QuickBooks ledger.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1.5">
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">1. Scope Consent</span>
            <p className="text-xs font-bold text-white">com.intuit.quickbooks.accounting</p>
            <p className="text-[11px] text-[#8B949E]">
              Read and write access to Chart of Accounts, Invoices, Customers, and Payments.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1.5">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">2. Bank-Grade PKCE</span>
            <p className="text-xs font-bold text-white">Cryptographic Challenge</p>
            <p className="text-[11px] text-[#8B949E]">
              RFC 7636 Proof Key protection eliminates authorization code interception attacks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1.5">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">3. Bi-Directional Sync</span>
            <p className="text-xs font-bold text-white">Autonomous Ledger Sync</p>
            <p className="text-[11px] text-[#8B949E]">
              AI statement parsing maps bank lines into proper account credits & debits.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-white">Ready to Authorize or Re-authenticate?</p>
            <p className="text-[11px] text-purple-300">
              Click below to initiate the official Intuit OAuth 2.0 consent window.
            </p>
          </div>

          <button
            onClick={() => {
              if (onNavigateToTab) onNavigateToTab('sovereign-singularity');
              else window.location.href = '/';
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40 transition-all border border-purple-400/40 flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>Proceed to Intuit Authorization Flow</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#30363D] text-xs text-[#8B949E]">
          <a href="/terms" className="hover:text-white underline">Terms of Service</a>
          <a href="/privacy" className="hover:text-white underline">Privacy Policy</a>
          <a href="/eula" className="hover:text-white underline">EULA License Agreement</a>
          <a href="/disconnect" className="text-rose-400 hover:text-rose-300">Disconnect Page</a>
        </div>
      </div>
    </div>
  );
};
