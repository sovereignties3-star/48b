import React, { useState } from 'react';
import { Terminal, Shield, Key, Code2, BookOpen, ExternalLink, Copy, CheckCircle2, RefreshCw } from 'lucide-react';

export const DeveloperPortal: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-100">
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/60 border border-blue-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Developer Portal & Sandbox SDK</h1>
              <p className="text-xs text-gray-400">Institutional APIs, OAuth2 credentials, and enterprise SDK guides.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Sandbox Client ID</span>
          </h3>
          <p className="text-xs text-gray-400">Production & Sandbox App credentials for Intuit QBO, Citi, and Google.</p>
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D] font-mono text-xs text-emerald-300 break-all select-all flex items-center justify-between">
            <span>ABySM9k249a1z9r8w...</span>
            <button onClick={() => copyToClipboard('ABySM9k249a1z9r8w...', 'cid')} className="text-gray-400 hover:text-white">
              {copiedKey === 'cid' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>API Environments</span>
          </h3>
          <p className="text-xs text-gray-400">Sandbox Base URL and dynamic mock gateway endpoints.</p>
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D] font-mono text-xs text-purple-300 break-all">
            https://sandbox-quickbooks.api.intuit.com
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Security Specifications</span>
          </h3>
          <p className="text-xs text-gray-400">OAuth 2.0 PKCE, SAML 2.0 Identity, and ISO 20022 schemas.</p>
          <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D] font-mono text-xs text-blue-300 break-all">
            TLS 1.3 / SHA-256 / AES-GCM
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPortal;
