import React from 'react';
import { MainTabType } from './Navbar';
import { Shield, Cloud, ShoppingCart, Database, Radio, Terminal, Key, Cpu, Sparkles, Building2, Globe, Layers } from 'lucide-react';

interface DashboardSlideGridProps {
  activeTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
}

export const DashboardSlideGrid: React.FC<DashboardSlideGridProps> = ({ activeTab, onSelectTab }) => {
  const slides: { id: MainTabType; title: string; category: string; icon: React.ComponentType<{ className?: string }>; badge: string }[] = [
    { id: 'epic-stories', title: 'Epic Stories & AI', category: 'Gemini Reports', icon: Sparkles, badge: 'BORDERED' },
    { id: 'expertmode', title: 'NPM Expert Mode', category: 'NPM & CLI SDK', icon: Terminal, badge: 'PUBLISHED' },
    { id: 'google-saml', title: 'Google SAML 2.0', category: 'Identity & IdP', icon: Shield, badge: 'C00puqgbe' },
    { id: 'fullview', title: 'FullView Stream', category: 'Live WebSocket', icon: Radio, badge: 'WSS HUB' },
    { id: 'salesforce', title: 'Salesforce Einstein', category: 'CRM & Data Cloud', icon: Cloud, badge: 'LLM' },
    { id: 'kroger', title: 'Kroger Citibank', category: 'Retail API Suite', icon: ShoppingCart, badge: 'PORTAL' },
    { id: 'astra-db', title: 'Astra DB', category: 'NoSQL Vector DB', icon: Database, badge: 'CASSANDRA' },
    { id: 'confluent-kafka', title: 'Confluent Kafka', category: 'Event Streaming', icon: Radio, badge: 'LKC' },
    { id: '100-modules', title: '100 Modules', category: 'Offline Vault', icon: Layers, badge: 'SYSTEM' },
    { id: 'accounting-categories', title: 'Accounting Categories', category: 'General Ledger', icon: Database, badge: '154 UUIDs' },
    { id: 'sovereign-singularity', title: 'Sovereign Nexus', category: 'Autonomous AI', icon: Sparkles, badge: 'ACTIVE' },
  ];

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Operational Console Deck</h2>
        </div>
        <span className="text-[10px] text-gray-400 font-mono">Select active console workspace</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {slides.map((s) => {
          const Icon = s.icon;
          const isActive = activeTab === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectTab(s.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                isActive
                  ? 'bg-blue-600/20 border-blue-400 text-white shadow-md ring-1 ring-blue-400/50'
                  : 'bg-[#0d1117] border-[#30363D] hover:border-gray-500 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'bg-[#21262d] text-gray-300'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#21262d] text-gray-300 font-bold">
                  {s.badge}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold truncate text-white">{s.title}</p>
                <p className="text-[10px] text-gray-500 truncate">{s.category}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardSlideGrid;
