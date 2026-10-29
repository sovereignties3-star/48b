import React, { useState } from 'react';
import { Layers, X, Search, Globe, Database, Building, Radio, Cloud, Cpu, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { MainTabType } from './Navbar';

interface ModuleDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: MainTabType) => void;
}

const ALL_MODULES_CATALOG: { tab: MainTabType; title: string; category: string; icon: string; description: string }[] = [
  { tab: 'gcp-blockchain', title: '🌐 GCP Blockchain Engine', category: 'Cloud Infrastructure', icon: 'Globe', description: 'Unedited blockchain-204577f9.html.txt GCP console render.' },
  { tab: 'azure-csv', title: '📊 Azure Resource Vaults CSV', category: 'Cloud Infrastructure', icon: 'Database', description: 'Inspect all 6 Azure Resource Graph & Key Vault CSV datasets.' },
  { tab: 'house-acquisition', title: '🏠 House PDF Buy Hub', category: 'Real Estate & Escrow', icon: 'Building', description: 'Parse 1,250 houses from pdf/houses.pdf and generate ISO 20022 pac.008 XML.' },
  { tab: 'confluent-kafka', title: '⚡ Confluent Kafka (lkc-o3xxyy)', category: 'Streaming & Events', icon: 'Radio', description: 'Live Confluent Cloud Kafka stream and topic publisher.' },
  { tab: '100-modules', title: '🚀 100 Enterprise Modules Hub', category: 'Enterprise Core', icon: 'Layers', description: '100 fully operational offline enterprise modules with diagnostics.' },
  { tab: 'modern-treasury-gql', title: '🏦 Modern Treasury GraphQL GQL', category: 'Banking & Payments', icon: 'Database', description: '23 SHA-256 persisted query aliases and execution engine.' },
  { tab: 'orchestrator-hub', title: '⚙️ Enterprise Workflow Orchestrator', category: 'Core Engine', icon: 'Cpu', description: 'Data storage timelines, blockchain consensus, and security file signing.' },
  { tab: 'google-attributes', title: '☁️ Google Cloud Infrastructure', category: 'Cloud Infrastructure', icon: 'Cloud', description: 'Project attributes, IAM service accounts, and enabled APIs.' },
  { tab: 'epic-stories', title: '⚡ Epic Stories & Professional Bank Reports', category: 'AI & Banking', icon: 'Sparkles', description: 'Gemini 3.8 Flash forensic financial auditing, bespoke border panels, and narrative sagas for bank feeds.' },
  { tab: 'expertmode', title: '📦 NPM Registry Package (kronos-apex-financial-os)', category: 'Developer Tools', icon: 'Terminal', description: 'Published NPM package documentation, CLI runner, programmatic Node.js SDK, and expertmode.md.' },
  { tab: 'sovereign-singularity', title: '🌟 Sovereign Singularity Hub', category: 'AI & ML', icon: 'Sparkles', description: 'Autonomous wealth and multi-agent coordination nexus.' },
  { tab: 'ai-data-platform', title: '🧠 AI Data Platform (20260430)', category: 'AI & ML', icon: 'Cpu', description: '19 categories and 286 operations for enterprise data intelligence.' },
  { tab: 'salesforce', title: '☁️ Salesforce CRM Data Cloud', category: 'ERP & CRM', icon: 'Cloud', description: 'Einstein AI lead scoring and data cloud pipeline sync.' },
  { tab: 'kroger', title: '🛒 Kroger Developer APIs', category: 'Retail & Commerce', icon: 'Building', description: 'Catalog V2, locker pickup, delivery, and cart management.' },
  { tab: 'stripe-dashboard', title: '💳 Stripe Analytics Dashboard', category: 'Payments', icon: 'Database', description: 'Live subscription metrics, payout logs, and webhook event stream.' },
  { tab: 'fullview', title: '📡 FullView Customer State Hub (WSS)', category: 'Telemetry & Stream', icon: 'Radio', description: 'Real-time WebSocket customer state connection and JWT claims inspector.' },
  { tab: 'google-saml', title: '🛡️ Google Workspace SAML 2.0 Hub', category: 'Identity & Security', icon: 'Shield', description: 'Google IdP C00puqgbe metadata, X.509 certificates, AuthnRequest generator & SSO.' },
  { tab: 'accounting-categories', title: '📊 Accounting Category IDs (154 UUIDs)', category: 'Banking & Ledgers', icon: 'Database', description: 'Complete general ledger master catalog of 154 category UUIDs and QBO Chart of Accounts.' },
  { tab: 'vscode', title: '💻 VS Code Cloud Workspace IDE', category: 'Developer Tools', icon: 'Terminal', description: 'Full-stack file browser, editor, and terminal runner.' }
];

export const ModuleDirectoryModal: React.FC<ModuleDirectoryModalProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [search, setSearch] = useState<string>('');

  if (!isOpen) return null;

  const filtered = ALL_MODULES_CATALOG.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) || 
    m.description.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#161B22] border border-[#30363D] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#30363D] bg-gradient-to-r from-slate-900 to-indigo-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Complete Modules & Vaults Directory</h2>
              <p className="text-xs text-gray-400">Access every module, cloud engine, CSV vault, and integration instantly.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-gray-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-[#0D1117] border-b border-[#30363D]">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search across all platform modules, GCP blockchain, Azure CSVs, 100 modules..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#161B22] border border-[#30363D] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Modules Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {filtered.map(mod => (
            <div
              key={mod.tab}
              onClick={() => {
                onSelectTab(mod.tab);
                onClose();
              }}
              className="bg-[#0D1117] hover:bg-indigo-950/30 p-4 rounded-xl border border-[#30363D] hover:border-indigo-500 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                    {mod.category}
                  </span>
                  <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Launch →
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{mod.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{mod.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0D1117] border-t border-[#30363D] flex items-center justify-between text-xs text-gray-400">
          <span>Showing {filtered.length} modules</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-white rounded-xl transition cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleDirectoryModal;
