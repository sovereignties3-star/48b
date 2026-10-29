import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Settings,
  Save,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  EyeOff,
  ShieldCheck,
  Plus,
  FileCode,
  Copy,
  Lock,
  HardDrive,
  Database,
  ArrowUpCircle,
  FileText,
  Trash2,
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

interface EnvItem {
  key: string;
  category: string;
  categoryLabel: string;
  description: string;
  value: string;
  isSecret: boolean;
  isSet: boolean;
  status: 'configured' | 'missing' | 'expired_notice';
  isExpiredNotice?: boolean;
  requiredFor?: string;
  maskedValue: string;
  defaultValue?: string;
}

const LOCAL_STORAGE_VAULT_KEY = 'SOVEREIGN_ENV_VAULT_SNAPSHOT_V2';

export const EnvManager: React.FC = () => {
  const [items, setItems] = useState<EnvItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'missing' | 'expired' | 'configured'>('all');
  const [unmaskedKeys, setUnmaskedKeys] = useState<Record<string, boolean>>({});
  
  // Custom Key Modal & Raw Import State
  const [showRawImport, setShowRawImport] = useState(false);
  const [rawTextToImport, setRawTextToImport] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [lastUploadedFileName, setLastUploadedFileName] = useState<string | null>(null);
  const [localBackupCount, setLocalBackupCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync to browser localStorage for bulletproof client-side redundancy
  const syncToLocalVault = (envItems: EnvItem[]) => {
    try {
      const snapshot: Record<string, string> = {};
      for (const item of envItems) {
        if (item.value) {
          snapshot[item.key] = item.value;
        }
      }
      localStorage.setItem(LOCAL_STORAGE_VAULT_KEY, JSON.stringify(snapshot));
      setLocalBackupCount(Object.keys(snapshot).length);
    } catch (e) {
      console.warn('Failed to sync to local storage:', e);
    }
  };

  const getLocalVaultSnapshot = (): Record<string, string> | null => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_VAULT_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse local vault:', e);
    }
    return null;
  };

  const fetchEnv = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/api/env/all');
      if (res.ok && res.data) {
        const fetchedItems: EnvItem[] = res.data.items || [];
        setItems(fetchedItems);
        setEdits({});
        syncToLocalVault(fetchedItems);
      } else {
        setError('Failed to load environment variables');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnv();
    const snap = getLocalVaultSnapshot();
    if (snap) {
      setLocalBackupCount(Object.keys(snap).length);
    }
  }, []);

  const handleSave = async () => {
    if (Object.keys(edits).length === 0) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await apiFetch<any>('/api/env/update', {
        method: 'POST',
        body: JSON.stringify({ updates: edits }),
      });
      if (res.ok && res.data) {
        setSuccess(res.data.message || 'Variables updated and permanently saved to .env vault!');
        const updatedItems = res.data.items || [];
        setItems(updatedItems);
        setEdits({});
        syncToLocalVault(updatedItems);
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError('Failed to update variables');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Upload environment file processor
  const processUploadedFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setSuccess(null);
    setLastUploadedFileName(file.name);

    try {
      const text = await file.text();
      const res = await apiFetch<any>('/api/env/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          rawText: text,
        }),
      });

      if (res.ok && res.data) {
        setSuccess(`🎉 File "${file.name}" uploaded! Saved & locked ${res.data.importedCount} variables to .env disk vault!`);
        const updatedItems = res.data.items || [];
        setItems(updatedItems);
        setEdits({});
        syncToLocalVault(updatedItems);
        setTimeout(() => setSuccess(null), 7000);
      } else {
        setError(res.data?.error || `Failed to process uploaded file "${file.name}"`);
      }
    } catch (err: any) {
      setError(`Error reading file: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleRawImport = async () => {
    if (!rawTextToImport.trim()) return;
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await apiFetch<any>('/api/env/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: rawTextToImport,
          fileName: 'pasted-raw.env',
        }),
      });

      if (res.ok && res.data) {
        setSuccess(`🎉 Imported & locked ${res.data.importedCount} variables into disk .env!`);
        const updatedItems = res.data.items || [];
        setItems(updatedItems);
        setRawTextToImport('');
        setShowRawImport(false);
        syncToLocalVault(updatedItems);
        setTimeout(() => setSuccess(null), 6000);
      } else {
        setError(res.data?.error || 'Failed to import raw text');
      }
    } catch (err: any) {
      setError(`Import error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddCustomVariable = async () => {
    if (!customKey.trim()) return;
    const cleanKey = customKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    setSaving(true);
    setError(null);

    try {
      const res = await apiFetch<any>('/api/env/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: {
            [cleanKey]: customValue.trim(),
          },
        }),
      });

      if (res.ok && res.data) {
        setSuccess(`✅ Added and saved "${cleanKey}" to .env!`);
        const updatedItems = res.data.items || [];
        setItems(updatedItems);
        setCustomKey('');
        setCustomValue('');
        setCustomDesc('');
        setShowAddCustom(false);
        syncToLocalVault(updatedItems);
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(res.data?.error || 'Failed to add custom variable');
      }
    } catch (err: any) {
      setError(`Error adding variable: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreFromLocalVault = async () => {
    const snap = getLocalVaultSnapshot();
    if (!snap || Object.keys(snap).length === 0) {
      setError('No client-side backup snapshot found in this browser.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch<any>('/api/env/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: snap,
          fileName: 'localstorage-vault-restore',
        }),
      });

      if (res.ok && res.data) {
        setSuccess(`✅ Restored and locked ${res.data.importedCount} variables from browser storage backup!`);
        const updatedItems = res.data.items || [];
        setItems(updatedItems);
        setTimeout(() => setSuccess(null), 6000);
      } else {
        setError('Failed to restore from browser storage.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    window.location.href = '/api/env/download';
  };

  const toggleReveal = (key: string) => {
    setUnmaskedKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Metrics
  const totalCount = items.length;
  const missingCount = items.filter(i => i.status === 'missing').length;
  const expiredCount = items.filter(i => i.status === 'expired_notice' || i.isExpiredNotice).length;
  const configuredCount = items.filter(i => i.status === 'configured' && !i.isExpiredNotice).length;

  const categories = useMemo(() => {
    return Array.from(new Set(items.map(i => i.categoryLabel))).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryLabel !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === 'missing' && item.status !== 'missing') {
        return false;
      }
      if (statusFilter === 'expired' && item.status !== 'expired_notice' && !item.isExpiredNotice) {
        return false;
      }
      if (statusFilter === 'configured' && (item.status !== 'configured' || item.isExpiredNotice)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchKey = item.key.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCat = item.categoryLabel.toLowerCase().includes(q);
        return matchKey || matchDesc || matchCat;
      }

      return true;
    });
  }, [items, selectedCategory, statusFilter, searchQuery]);

  const filteredCategories = useMemo(() => {
    return Array.from(new Set(filteredItems.map(i => i.categoryLabel)));
  }, [filteredItems]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Environment & Vault Manager
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-emerald-400" />
                  Auto-Persist Locked
                </span>
              </h1>
            </div>
          </div>
          <p className="text-xs text-[#8B949E] max-w-3xl leading-relaxed">
            Upload, audit, and permanently persist API keys and credentials across Citi, Visa, Intuit, Mastercard Finicity, Stripe, and custom services. Saved to disk (<code className="text-cyan-300 font-mono">.env</code>, <code className="text-cyan-300 font-mono">.env.local</code>, <code className="text-cyan-300 font-mono">.env-vault.json</code>) and client browser cache.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".env,.env.*,.txt,.json,text/plain"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Upload className={`w-3.5 h-3.5 ${uploading ? 'animate-bounce' : ''}`} />
            <span>{uploading ? 'Uploading...' : '📁 Upload .env File'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRawImport(!showRawImport)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-yellow-400" />
            <span>Paste .env Text</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddCustom(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-pink-400" />
            <span>Add Key</span>
          </button>

          <button
            type="button"
            onClick={fetchEnv}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors"
            title="Reload all from disk vault"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-medium border border-[#30363D] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || Object.keys(edits).length === 0}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              Object.keys(edits).length > 0 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 shadow-emerald-600/30' 
                : 'bg-emerald-950/30 text-emerald-500/40 border border-emerald-900/50 cursor-not-allowed'
            }`}
          >
            <Save className={`w-3.5 h-3.5 ${saving ? 'animate-pulse' : ''}`} />
            <span>{saving ? 'Saving...' : `Save (${Object.keys(edits).length})`}</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop File Upload Dropzone Banner */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-[#58A6FF] bg-blue-950/30 shadow-lg scale-[1.01]'
            : 'border-[#30363D] bg-[#161B22]/60 hover:bg-[#161B22] hover:border-[#58A6FF]/60'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span>Drop your <code className="text-cyan-300 font-mono">.env</code>, <code className="text-cyan-300 font-mono">.env.local</code>, or secret config file here</span>
              <span className="text-[10px] text-[#8B949E] font-normal">(or click to browse)</span>
            </h3>
            <p className="text-[11px] text-[#8B949E] mt-0.5">
              Supports raw Key=Value syntax, exported format, and JSON dictionaries. All uploaded variables are instantly parsed, saved to disk files, and locked into the runtime vault.
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Raw Text Import Panel */}
      {showRawImport && (
        <div className="bg-[#161B22] border border-yellow-500/40 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-yellow-400" />
              <h3 className="text-xs font-bold text-white">Paste Raw Environment Configuration (.env syntax)</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowRawImport(false)}
              className="text-xs text-[#8B949E] hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          <textarea
            rows={5}
            value={rawTextToImport}
            onChange={(e) => setRawTextToImport(e.target.value)}
            placeholder={`# Paste any environment variables below:\nOBP_CONSUMER_KEY=your_key_here\nCITI_BEARER_TOKEN=eyJhbGciOi...\nCUSTOM_API_SECRET=sec_12345`}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl p-3 text-xs font-mono text-cyan-300 placeholder-[#484F58] outline-none focus:border-yellow-400 resize-y"
          />

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8B949E]">
              {rawTextToImport.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).length} variable lines detected
            </span>
            <button
              type="button"
              onClick={handleRawImport}
              disabled={uploading || !rawTextToImport.trim()}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Import & Save to Vault</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Variable Modal / Row */}
      {showAddCustom && (
        <div className="bg-[#161B22] border border-pink-500/40 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4 text-pink-400" />
              <h3 className="text-xs font-bold text-white">Add Custom Environment Variable</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="text-xs text-[#8B949E] hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#8B949E] uppercase tracking-wider mb-1">
                Variable Key (e.g. MY_CUSTOM_API_KEY)
              </label>
              <input
                type="text"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="MY_NEW_TOKEN"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-pink-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#8B949E] uppercase tracking-wider mb-1">
                Variable Value
              </label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="secret_or_token_value_here"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:border-pink-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-[#8B949E] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddCustomVariable}
              disabled={saving || !customKey.trim()}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Custom Variable</span>
            </button>
          </div>
        </div>
      )}

      {/* Audit Stats & Diagnostic Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-[#1F242C] border-[#58A6FF] shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
          }`}
        >
          <div className="text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider">Total Active Vars</div>
          <div className="text-xl font-extrabold text-white mt-0.5">{totalCount}</div>
          <div className="text-[10px] text-[#58A6FF] mt-1">Full System Vault</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('missing')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'missing'
              ? 'bg-amber-950/30 border-amber-500 shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
          }`}
        >
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Missing Vars</span>
          </div>
          <div className="text-xl font-extrabold text-amber-300 mt-0.5">{missingCount}</div>
          <div className="text-[10px] text-amber-400/80 mt-1">Pending setup</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('expired')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'expired'
              ? 'bg-rose-950/30 border-rose-500 shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
          }`}
        >
          <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Expired Tokens</span>
          </div>
          <div className="text-xl font-extrabold text-rose-300 mt-0.5">{expiredCount}</div>
          <div className="text-[10px] text-rose-400/80 mt-1">Needs renewal</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('configured')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'configured'
              ? 'bg-emerald-950/30 border-emerald-500 shadow-sm'
              : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
          }`}
        >
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Configured</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-300 mt-0.5">{configuredCount}</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Live active</div>
        </button>
      </div>

      {/* Browser LocalStorage Backup Quick Restore Banner */}
      {localBackupCount > 0 && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-[#8B949E]">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Browser Cache Backup: <strong className="text-white">{localBackupCount} variables</strong> safely preserved in client storage.</span>
          </div>
          <button
            type="button"
            onClick={handleRestoreFromLocalVault}
            className="px-2.5 py-1 bg-[#21262D] hover:bg-[#30363D] text-purple-300 hover:text-white border border-purple-500/30 rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
          >
            <ArrowUpCircle className="w-3.5 h-3.5" />
            <span>Restore From Browser</span>
          </button>
        </div>
      )}

      {/* Success / Error Feedback Toast */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4 flex items-center space-x-3 text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <p className="text-xs font-medium leading-relaxed">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/30 border border-emerald-500/50 rounded-xl p-4 flex items-center space-x-3 text-emerald-300 shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <p className="text-xs font-medium leading-relaxed">{success}</p>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8B949E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by variable name, provider, or description..."
            className="w-full bg-[#0D1117] border border-[#30363D] focus:border-[#58A6FF] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8B949E] outline-none font-mono"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-[#8B949E]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0D1117] border border-[#30363D] text-xs text-[#C9D1D9] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#58A6FF]"
          >
            <option value="all">All Categories ({totalCount})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c} ({items.filter(i => i.categoryLabel === c).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Variables Render By Category */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-8 text-center text-[#8B949E]">
            <p className="text-sm font-semibold">No environment variables match the current filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setStatusFilter('all');
              }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-[#21262D] text-xs text-white font-medium hover:bg-[#30363D]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredCategories.map((catLabel) => {
            const catItems = filteredItems.filter(i => i.categoryLabel === catLabel);
            return (
              <div key={catLabel} className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-2">
                  <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>{catLabel}</span>
                    <span className="text-xs font-normal text-[#8B949E]">({catItems.length})</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {catItems.map((item) => {
                    const isEdited = item.key in edits;
                    const currentValue = isEdited
                      ? edits[item.key]
                      : (unmaskedKeys[item.key] ? item.value : (item.isSet ? item.maskedValue : ''));
                    const isExpired = item.status === 'expired_notice' || item.isExpiredNotice;
                    const isMissing = item.status === 'missing' && !isEdited;

                    return (
                      <div
                        key={item.key}
                        className={`bg-[#161B22] border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all ${
                          isExpired
                            ? 'border-amber-500/50 bg-amber-950/10'
                            : isMissing
                            ? 'border-[#30363D] hover:border-[#484F58]'
                            : 'border-[#30363D]'
                        }`}
                      >
                        <div className="md:w-2/5 space-y-1 shrink-0">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="text-xs font-mono font-bold text-sky-300">{item.key}</span>
                            
                            {item.isSecret && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                SECRET
                              </span>
                            )}

                            {isExpired ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                EXPIRED TOKEN
                              </span>
                            ) : item.isSet || isEdited ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {isEdited ? 'EDITED' : 'CONFIGURED'}
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#30363D] text-[#8B949E] border border-[#484F58]">
                                MISSING
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#8B949E] leading-relaxed">{item.description}</p>
                        </div>
                        
                        <div className="flex-1 min-w-0 flex items-center space-x-2">
                          <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => setEdits(prev => ({ ...prev, [item.key]: e.target.value }))}
                            placeholder={item.defaultValue ? `Default: ${item.defaultValue}` : 'Enter new value...'}
                            className={`w-full bg-[#0d1117] border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-mono transition-colors ${
                              isEdited
                                ? 'border-pink-500/50 bg-pink-500/5'
                                : isExpired
                                ? 'border-amber-500/40 bg-amber-950/20'
                                : 'border-[#30363D]'
                            }`}
                          />

                          {item.isSecret && item.isSet && !isEdited && (
                            <button
                              type="button"
                              onClick={() => toggleReveal(item.key)}
                              title={unmaskedKeys[item.key] ? 'Mask secret' : 'Reveal secret'}
                              className="p-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white border border-[#30363D] transition-colors"
                            >
                              {unmaskedKeys[item.key] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

