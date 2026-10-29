import React, { useState, useEffect } from 'react';
import { Zap, Download, RefreshCw, CheckCircle2, AlertCircle, Building2, Users, CreditCard, FileText, Database, Shield, Landmark, Sparkles, User, Copy, Check, FileCode, ArrowDownToLine } from 'lucide-react';
import { TokenResponse } from '../types';
import { apiFetch } from '../utils/apiClient';
import { sanitizeRealmId } from '../utils/realmSanitizer';

interface AutonomousSyncProps {
  tokens: TokenResponse | null;
  realmId: string;
  onTokensUpdated?: (tokens: TokenResponse) => void;
}

export const AutonomousSync: React.FC<AutonomousSyncProps> = ({ tokens, realmId, onTokensUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<any | null>(null);
  const [customToken, setCustomToken] = useState(tokens?.access_token || '');
  const [customRealm, setCustomRealm] = useState(sanitizeRealmId(realmId || tokens?.realmId || ''));
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [autoSyncActive, setAutoSyncActive] = useState(false);
  const [syncStatusNote, setSyncStatusNote] = useState<string | null>(null);

  // Restore cached sync payload if present
  useEffect(() => {
    try {
      const cached = localStorage.getItem('qbo_last_autonomous_sync');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.summary) {
          setSyncResult(parsed);
        }
      }
    } catch (e) {}
  }, []);

  // Synchronize state when tokens or realmId props change
  useEffect(() => {
    if (realmId) {
      setCustomRealm(sanitizeRealmId(realmId));
    } else if (tokens?.realmId) {
      setCustomRealm(sanitizeRealmId(tokens.realmId));
    }
  }, [realmId, tokens?.realmId]);

  useEffect(() => {
    if (tokens?.access_token) {
      setCustomToken(tokens.access_token);
    }
  }, [tokens?.access_token]);

  const tokenToUse = customToken.trim() || tokens?.access_token || '';
  const cleanRealm = sanitizeRealmId(customRealm) || sanitizeRealmId(realmId) || sanitizeRealmId(tokens?.realmId) || '9341457771341574';

  const handleAutoConnectAndSync = async () => {
    setLoading(true);
    setError(null);
    setSyncStatusNote('Establishing active QuickBooks sandbox session...');
    try {
      const connRes = await apiFetch<{ success: boolean; tokens: TokenResponse }>('/api/intuit/auto-connect', {
        method: 'POST',
        body: JSON.stringify({ realmId: cleanRealm }),
      });

      if (connRes.ok && connRes.data?.tokens) {
        const newTokens = connRes.data.tokens;
        setCustomToken(newTokens.access_token);
        if (onTokensUpdated) {
          onTokensUpdated(newTokens);
        }
        try {
          localStorage.setItem('qbo_active_session_tokens', JSON.stringify(newTokens));
        } catch (e) {}
      }

      await executeSync(connRes.data?.tokens?.access_token || tokenToUse || `eyQBO_${Date.now()}`);
    } catch (e: any) {
      setError(e.message || 'Error during auto-connect and sync');
    } finally {
      setLoading(false);
      setSyncStatusNote(null);
    }
  };

  const executeSync = async (overrideToken?: string) => {
    const effectiveToken = overrideToken || tokenToUse || `eyQBO_${Date.now()}`;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/api/intuit/pull-all', {
        method: 'POST',
        body: JSON.stringify({
          accessToken: effectiveToken,
          realmId: cleanRealm,
          realmid: cleanRealm,
        }),
      });

      if (!res.ok || !res.data) {
        setError(res.error || 'Failed to pull QuickBooks data. Check that your token is active and the Realm ID matches your Sandbox company.');
      } else {
        setSyncResult(res.data);
        try {
          localStorage.setItem('qbo_last_autonomous_sync', JSON.stringify(res.data));
        } catch (e) {}
      }
    } catch (e: any) {
      setError(e.message || 'Network error during autonomous sync');
    } finally {
      setLoading(false);
    }
  };

  const handlePullAll = async () => {
    if (!tokenToUse) {
      // Auto-provision token and sync seamlessly
      await handleAutoConnectAndSync();
      return;
    }
    await executeSync();
  };

  const handlePushTestRecordAndSync = async (type: 'invoice' | 'customer' | 'account') => {
    setLoading(true);
    setError(null);
    setSyncStatusNote(`Pushing test ${type} to QuickBooks...`);
    try {
      if (type === 'invoice') {
        await apiFetch('/api/intuit/invoices/create', {
          method: 'POST',
          body: JSON.stringify({
            amount: 3500.00,
            CustomerRef: { value: '101', name: 'Acme Global Ventures LLC' },
            description: 'Automated Cloud Infrastructure Settlement',
          }),
        });
      } else if (type === 'customer') {
        await apiFetch('/api/intuit/customers/create', {
          method: 'POST',
          body: JSON.stringify({
            DisplayName: `Enterprise Client ${Date.now().toString().slice(-4)}`,
            email: `client_${Date.now().toString().slice(-4)}@fintechvault.com`,
          }),
        });
      } else if (type === 'account') {
        await apiFetch('/api/intuit/accounts/create', {
          method: 'POST',
          body: JSON.stringify({
            Name: `Treasury Vault Account ${Date.now().toString().slice(-3)}`,
            AccountType: 'Bank',
            AccountSubType: 'Checking',
            CurrentBalance: 250000.00,
          }),
        });
      }

      await executeSync();
    } catch (e: any) {
      setError(e.message || `Failed to push test ${type}`);
    } finally {
      setLoading(false);
      setSyncStatusNote(null);
    }
  };

  // Auto-sync interval
  useEffect(() => {
    let timer: any;
    if (autoSyncActive) {
      timer = setInterval(() => {
        executeSync();
      }, 15000);
    }
    return () => clearInterval(timer);
  }, [autoSyncActive, tokenToUse, cleanRealm]);

  const getFilteredData = () => {
    if (!syncResult?.data) return null;
    const d = syncResult.data;
    switch (activeCategoryTab) {
      case 'companyInfo': return d.companyInfo;
      case 'accounts': return d.accounts;
      case 'modernTreasuryAccounts': return d.modernTreasuryAccounts;
      case 'bankAccounts': return d.bankAccounts;
      case 'cards': return d.cards;
      case 'customers': return d.customers;
      case 'invoices': return d.invoices;
      case 'payments': return d.payments;
      case 'salesReceipts': return d.salesReceipts;
      case 'userProfile': return d.userProfile;
      case 'all': default: return syncResult;
    }
  };

  const handleDownload = (format: 'json' | 'txt', fullPayload: boolean = true) => {
    if (!syncResult) return;
    const payload = fullPayload || activeCategoryTab === 'all' ? syncResult : getFilteredData();
    const jsonString = JSON.stringify(payload, null, 2);
    const mimeType = format === 'txt' ? 'text/plain;charset=utf-8' : 'application/json;charset=utf-8';
    const blob = new Blob([jsonString], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const company = (syncResult.summary?.companyName || 'quickbooks_sync').replace(/[^a-zA-Z0-9_-]/g, '_');
    const scopeTag = fullPayload || activeCategoryTab === 'all' ? 'full_spectrum' : activeCategoryTab;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    link.href = url;
    link.download = `qbo_sync_${scopeTag}_${company}_${timestamp}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = async () => {
    if (!syncResult) return;
    const payload = activeCategoryTab === 'all' ? syncResult : getFilteredData();
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="bg-[#161B22] rounded-xl border border-[#30363D] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#30363D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-[#161B22] via-[#1f242c] to-[#161B22]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#238636] to-[#2ea043] text-white shadow-md">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <span>Autonomous Data Pull & Full Sync Engine</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-[#238636]/20 text-[#3FB950] border border-[#238636]/30">
                Full Spectrum Sync
              </span>
            </h2>
            <p className="text-xs text-[#8B949E]">
              Autonomously pull and aggregate every single record from your QuickBooks Sandbox (Company Info, Accounts, Bank Accounts, Cards, Customers, Invoices, Payments, Receipts, OpenID Profile).
            </p>
          </div>
        </div>

        <button
          id="autonomous-pull-all-btn"
          onClick={handlePullAll}
          disabled={loading}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white text-xs font-bold shadow-lg transition-all transform hover:scale-[1.02] border border-[#3FB950]/40 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Pulling Everything...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Pull All QuickBooks Data Now</span>
            </>
          )}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Credentials Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0d1117] p-4 rounded-xl border border-[#30363D]">
          <div>
            <label className="block text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-1.5">
              Access Token (Bearer)
            </label>
            <input
              type="text"
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
              placeholder={tokens?.access_token ? 'Using active session token (or paste override)...' : 'Paste access token...'}
              className="w-full px-3 py-2 text-xs font-mono bg-[#010409] border border-[#30363D] rounded-lg text-[#C9D1D9] focus:outline-none focus:border-[#79C0FF]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-1.5">
              Company / Realm ID
            </label>
            <input
              type="text"
              id="autonomous-custom-realm-input"
              value={customRealm}
              onChange={(e) => setCustomRealm(sanitizeRealmId(e.target.value))}
              onBlur={() => setCustomRealm(sanitizeRealmId(customRealm))}
              placeholder="e.g. 9341457771341574"
              className="w-full px-3 py-2 text-xs font-mono bg-[#010409] border border-[#30363D] rounded-lg text-[#C9D1D9] focus:outline-none focus:border-[#79C0FF]"
            />
          </div>
        </div>

        {/* Action & Sync Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#0d1117] rounded-xl border border-[#30363D]">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAutoConnectAndSync}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ 1-Click Auto-Connect & Full Sync</span>
            </button>

            <button
              onClick={() => handlePushTestRecordAndSync('invoice')}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white text-xs font-medium border border-[#30363D] transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ Push Test Invoice</span>
            </button>

            <button
              onClick={() => handlePushTestRecordAndSync('customer')}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white text-xs font-medium border border-[#30363D] transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Push Customer</span>
            </button>

            <button
              onClick={() => handlePushTestRecordAndSync('account')}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white text-xs font-medium border border-[#30363D] transition-colors cursor-pointer"
            >
              <Landmark className="w-3.5 h-3.5 text-[#79C0FF]" />
              <span>+ Push Account</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-xs text-[#8B949E] cursor-pointer">
              <input
                type="checkbox"
                checked={autoSyncActive}
                onChange={(e) => setAutoSyncActive(e.target.checked)}
                className="rounded border-[#30363D] bg-[#010409] text-emerald-500 focus:ring-0"
              />
              <span className="flex items-center space-x-1">
                <RefreshCw className={`w-3 h-3 ${autoSyncActive ? 'animate-spin text-emerald-400' : ''}`} />
                <span>Auto-Sync (15s)</span>
              </span>
            </label>

            <span className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-full border ${
              syncResult?.isLiveSync
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}>
              {syncResult?.isLiveSync ? '🟢 Live Intuit Sandbox API' : '⚡ Autonomous Bridge Engine'}
            </span>
          </div>
        </div>

        {syncStatusNote && (
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-300 text-xs flex items-center space-x-2 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
            <span>{syncStatusNote}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sync Result Dashboard */}
        {syncResult && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#30363D]">
              <div className="flex items-center space-x-2 text-white font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#3FB950]" />
                <span>Autonomous Sync Successful — Company: <span className="text-[#79C0FF]">{syncResult.summary?.companyName}</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs font-mono text-[#8B949E] mr-2">
                  Pulled at: {new Date(syncResult.pulledAt).toLocaleTimeString()}
                </div>
                {/* Header Direct Download Buttons */}
                <button
                  id="btn-download-full-txt"
                  onClick={() => handleDownload('txt', true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-medium border border-[#30363D] transition-colors cursor-pointer"
                  title="Download complete payload as a plain text file"
                >
                  <FileText className="w-3.5 h-3.5 text-[#79C0FF]" />
                  <span>Download .txt</span>
                </button>
                <button
                  id="btn-download-full-json"
                  onClick={() => handleDownload('json', true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold shadow-xs border border-[#3FB950]/30 transition-colors cursor-pointer"
                  title="Download complete payload as a JSON file"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>

            {/* Metrics Grid across all primary entity categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363D] text-center space-y-0.5">
                <div className="text-[10px] font-semibold text-[#8B949E] uppercase">Company Profile</div>
                <div className="text-base font-bold text-[#3FB950]">1</div>
                <div className="text-[10px] text-[#8B949E] truncate">QBO CompanyInfo</div>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363D] text-center space-y-0.5">
                <div className="text-[10px] font-semibold text-[#8B949E] uppercase">QBO Accounts</div>
                <div className="text-base font-bold text-[#79C0FF]">{syncResult.summary?.accountsCount || 0}</div>
                <div className="text-[10px] text-[#8B949E] truncate">Chart of Accounts</div>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#238636]/60 bg-[#238636]/10 text-center space-y-0.5">
                <div className="text-[10px] font-semibold text-[#3FB950] uppercase">Modern Treasury</div>
                <div className="text-base font-bold text-[#3FB950]">{syncResult.summary?.modernTreasuryAccountsSynced || syncResult.data?.modernTreasuryAccounts?.length || 0}</div>
                <div className="text-[10px] text-[#3FB950] truncate font-medium">Auto-Created Accounts</div>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363D] text-center space-y-0.5">
                <div className="text-[10px] font-semibold text-[#8B949E] uppercase">Bank Accounts</div>
                <div className="text-base font-bold text-[#D29922]">{syncResult.summary?.bankAccountsCount || 0}</div>
                <div className="text-[10px] text-[#8B949E] truncate">Customer Banks</div>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363D] text-center space-y-0.5">
                <div className="text-[10px] font-semibold text-[#8B949E] uppercase">Credit Cards</div>
                <div className="text-base font-bold text-purple-400">{syncResult.summary?.cardsCount || 0}</div>
                <div className="text-[10px] text-[#8B949E] truncate">Payments Card Entity</div>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363D] text-center space-y-0.5">
                <div className="text-[10px] font-semibold text-[#8B949E] uppercase">Customers</div>
                <div className="text-base font-bold text-emerald-400">{syncResult.summary?.customersCount || 0}</div>
                <div className="text-[10px] text-[#8B949E] truncate">Client Records</div>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363D] text-center space-y-0.5">
                <div className="text-[10px] font-semibold text-[#8B949E] uppercase">Invoices</div>
                <div className="text-base font-bold text-indigo-400">{syncResult.summary?.invoicesCount || 0}</div>
                <div className="text-[10px] text-[#8B949E] truncate">Receivables</div>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363D] text-center space-y-0.5">
                <div className="text-[10px] font-semibold text-[#8B949E] uppercase">Payments</div>
                <div className="text-base font-bold text-blue-400">{syncResult.summary?.paymentsCount || 0}</div>
                <div className="text-[10px] text-[#8B949E] truncate">Collected Charges</div>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363D] text-center space-y-0.5">
                <div className="text-[10px] font-semibold text-[#8B949E] uppercase">Sales Receipts</div>
                <div className="text-base font-bold text-teal-400">{syncResult.summary?.salesReceiptsCount || 0}</div>
                <div className="text-[10px] text-[#8B949E] truncate">Receipt Entries</div>
              </div>

              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363D] text-center space-y-0.5">
                <div className="text-[10px] font-semibold text-[#8B949E] uppercase">User Profile</div>
                <div className="text-base font-bold text-amber-400">{syncResult.summary?.userProfileStatus || 'OK'}</div>
                <div className="text-[10px] text-[#8B949E] truncate">OpenID Connect</div>
              </div>
            </div>

            {/* Entity Category Filter Tabs & Download Controls */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider">
                  Inspect Pulled Category Payload
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs text-[#C9D1D9] border border-[#30363D] transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy View'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload('txt', false)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs text-[#79C0FF] border border-[#30363D] transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Download View (.txt)</span>
                  </button>
                  <button
                    onClick={() => handleDownload('json', false)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs text-[#3FB950] border border-[#30363D] transition-colors cursor-pointer font-medium"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Download View (.json)</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 p-1 bg-[#0d1117] rounded-xl border border-[#30363D]">
                {[
                  { id: 'all', label: 'Full Aggregated JSON' },
                  { id: 'companyInfo', label: `Company Info` },
                  { id: 'accounts', label: `QBO Accounts (${syncResult.summary?.accountsCount || 0})` },
                  { id: 'modernTreasuryAccounts', label: `Modern Treasury (${syncResult.summary?.modernTreasuryAccountsSynced || syncResult.data?.modernTreasuryAccounts?.length || 0})` },
                  { id: 'bankAccounts', label: `Bank Accounts (${syncResult.summary?.bankAccountsCount || 0})` },
                  { id: 'cards', label: `Credit Cards (${syncResult.summary?.cardsCount || 0})` },
                  { id: 'customers', label: `Customers (${syncResult.summary?.customersCount || 0})` },
                  { id: 'invoices', label: `Invoices (${syncResult.summary?.invoicesCount || 0})` },
                  { id: 'payments', label: `Payments (${syncResult.summary?.paymentsCount || 0})` },
                  { id: 'salesReceipts', label: `Sales Receipts (${syncResult.summary?.salesReceiptsCount || 0})` },
                  { id: 'userProfile', label: 'OpenID Profile' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveCategoryTab(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeCategoryTab === t.id
                        ? 'bg-[#238636] text-white font-semibold'
                        : 'text-[#8B949E] hover:text-white hover:bg-[#21262d]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Detailed Payload Viewer */}
              <pre className="p-4 rounded-xl bg-[#010409] border border-[#30363D] text-[#79C0FF] font-mono text-xs overflow-x-auto max-h-96 selection:bg-[#238636]/30">
                {JSON.stringify(getFilteredData(), null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

