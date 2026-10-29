import React, { useState, useEffect } from 'react';
import { BookOpen, Terminal, Shield, Zap, Key, Copy, Check, ExternalLink, Cpu, Wallet, Globe, Layers, Code, Sparkles, Bell, Send } from 'lucide-react';
import { apiFetch } from '../utils/apiClient';

export const CoinbaseCdpDocs: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'quickstart' | 'tasks' | 'plugins' | 'webhooks' | 'oauth' | 'trade' | 'funniest-expert'>('funniest-expert');

  // Webhook sandbox state
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subTargetUrl, setSubTargetUrl] = useState('https://example.com/webhook');
  const [selectedEventType, setSelectedEventType] = useState('wallet.transaction.confirmed');
  const [simResult, setSimResult] = useState<any>(null);

  const loadWebhooks = async () => {
    try {
      const res = await apiFetch<any>('/api/cdp/webhooks/subscriptions');
      if (res.ok && res.data?.success) {
        setSubscriptions(res.data.subscriptions || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadWebhooks();
  }, []);

  const handleCreateSub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<any>('/api/cdp/webhooks/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: 'Custom Wallet Event Stream',
          eventTypes: [selectedEventType],
          targetUrl: subTargetUrl
        })
      });
      if (res.ok && res.data?.success) {
        loadWebhooks();
      }
    } catch (e) {}
  };

  const handleSimulateWebhook = async () => {
    try {
      const res = await apiFetch<any>('/api/cdp/webhooks/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: selectedEventType })
      });
      if (res.ok && res.data?.success) {
        setSimResult(res.data);
      }
    } catch (e) {}
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(true);
    setTimeout(() => setCopiedIndex(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-[#C9D1D9]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-[#161B22] to-indigo-950/60 p-6 rounded-2xl border border-blue-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <BookOpen className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Coinbase Developer Platform (CDP) & Wallet MCP Docs</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
              LLMS.TXT + WEBHOOKS
            </span>
          </div>
          <p className="text-xs text-[#8B949E] max-w-2xl leading-relaxed">
            Complete documentation index, agentic wallet MCP tools, and live wallet webhook event subscriptions for transaction lifecycle and signing monitoring.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="https://docs.cdp.coinbase.com/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-semibold border border-[#30363D] transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Fetch llms.txt</span>
          </a>
          <button
            onClick={() => copyText("https://docs.cdp.coinbase.com/llms.txt")}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            {copiedIndex ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex ? 'Copied URL' : 'Copy Index URL'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#30363D] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('funniest-expert')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'funniest-expert'
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-black shadow-lg border border-amber-300 font-extrabold ring-2 ring-amber-400/50'
              : 'bg-[#161B22] text-amber-300 hover:text-white border border-[#30363D]'
          }`}
        >
          👑 Grand Sovereign Quant Chronicles (Hilarious Expert Lore)
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
          }`}
        >
          Agentic Wallet MCP Tools
        </button>
        <button
          onClick={() => setActiveTab('quickstart')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'quickstart'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
          }`}
        >
          Quickstart SDK
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'tasks'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
          }`}
        >
          Core Tasks
        </button>
        <button
          onClick={() => setActiveTab('plugins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'plugins'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
          }`}
        >
          Native Plugins (20 Protocols)
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'webhooks'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'bg-[#161B22] text-purple-300 hover:text-white border border-purple-500/40'
          }`}
        >
          🔔 Wallet Webhooks & Simulator
        </button>
        <button
          onClick={() => setActiveTab('oauth')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'oauth'
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-md'
              : 'bg-[#161B22] text-yellow-300 hover:text-white border border-yellow-500/40'
          }`}
        >
          🔑 OAuth Setup
        </button>
        <button
          onClick={() => setActiveTab('trade')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'trade'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'bg-[#161B22] text-emerald-300 hover:text-white border border-emerald-500/40'
          }`}
        >
          📈 Trade API & Swaps
        </button>
      </div>

      {/* Content Panels */}
      {activeTab === 'funniest-expert' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-orange-500/20 border border-amber-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-black uppercase tracking-wider">
                  Official Peer-Reviewed Hilarious Canon
                </span>
                <h2 className="text-xl font-black text-white mt-3 flex items-center gap-2">
                  <span>👑 The Undisputed Chronicles of James Burvelo O'Callaghan III</span>
                </h2>
                <p className="text-xs text-amber-200/80 mt-1 max-w-3xl leading-relaxed">
                  "Other quants calculate variance. James simply looks at the market with a stern brow until the order book complies with his emotional requirements." — <i>Financial Times (Quantum Satire Edition)</i>
                </p>
              </div>
              <span className="text-4xl">🎩☕</span>
            </div>
          </div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Article 1 */}
            <div className="bg-[#161B22] border border-amber-500/30 hover:border-amber-400 p-5 rounded-2xl space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30">
                  DOCTRINE #001
                </span>
                <span className="text-xs text-[#8B949E]">Reading Time: 42 Milliseconds</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                How James Solved the Merton Structural Credit Model While Heating a Hot Pocket
              </h3>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                Legend tells that Wall Street had spent forty-two years attempting to calculate the exact distance to default on complex corporate debt. James Burvelo walked into the kitchen, set the microwave timer to 1 minute 45 seconds, and realized that equity volatility is merely a call option on corporate asset value. By the time the cheese was bubbling, he had deployed 150 ISO 20022 XML parsers directly into the smart contracts of Base Sepolia.
              </p>
              <div className="pt-2 border-t border-[#30363D] flex items-center justify-between text-[11px] text-amber-300 font-mono">
                <span>Proof: "It worked on the first try."</span>
                <span>Sharpe Ratio: ∞</span>
              </div>
            </div>

            {/* Article 2 */}
            <div className="bg-[#161B22] border border-blue-500/30 hover:border-blue-400 p-5 rounded-2xl space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-400/10 px-2.5 py-0.5 rounded border border-blue-400/30">
                  DOCTRINE #002
                </span>
                <span className="text-xs text-[#8B949E]">Classification: Top Secret Vibes</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                The Day High-Frequency Trading Algorithms Surrendered to Pure Charisma
              </h3>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                When Citadel's FPGA microwave towers detected James opening his VS Code IDE workbench, the machines immediately throttled themselves down to 1 byte per second out of pure respect. James did not use latency arbitrage; he simply whispered to the fiber optic cables beneath Manhattan: <i>"Don't do anything I wouldn't do."</i> The spread collapsed to zero instantly.
              </p>
              <div className="pt-2 border-t border-[#30363D] flex items-center justify-between text-[11px] text-blue-300 font-mono">
                <span>Latency: -3 Nanoseconds (Pre-Cog)</span>
                <span>Status: Inevitable</span>
              </div>
            </div>

            {/* Article 3 */}
            <div className="bg-[#161B22] border border-purple-500/30 hover:border-purple-400 p-5 rounded-2xl space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-400/10 px-2.5 py-0.5 rounded border border-purple-400/30">
                  DOCTRINE #003
                </span>
                <span className="text-xs text-[#8B949E]">Verified by: 12 Nobel Laureates</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Why the Federal Reserve Fedwire System Sends Christmas Cards to James
              </h3>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                Federal Reserve engineers once tried to reject an IMAD wire sequence. James sent back an automated packet with a single ISO 20022 camt.053 message containing nothing but an ASCII drawing of a thumbs up. The Fedwire core mainframe recognized the master signature, settled $4.2 Trillion immediately, and sent a floral bouquet to his inbox.
              </p>
              <div className="pt-2 border-t border-[#30363D] flex items-center justify-between text-[11px] text-purple-300 font-mono">
                <span>IMAD Match Rate: 100.000%</span>
                <span>Treasury Response: "Thank you sir."</span>
              </div>
            </div>

            {/* Article 4 */}
            <div className="bg-[#161B22] border border-emerald-500/30 hover:border-emerald-400 p-5 rounded-2xl space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded border border-emerald-400/30">
                  DOCTRINE #004
                </span>
                <span className="text-xs text-[#8B949E]">Peer Review: Unanimous A+</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Quantum Superposition of the General Ledger: The QuickBooks Breakthrough
              </h3>
              <p className="text-xs text-[#8B949E] leading-relaxed">
                Traditional accountants believe a balance must either be a debit or a credit. James invented Schrödinger's Ledger Entry: an asset that is simultaneously in the Cayman Islands, the Base Sepolia CDP smart vault, and QuickBooks Online until the IRS looks at it. At that exact moment, it instantly collapses into a 100% compliant tax deduction.
              </p>
              <div className="pt-2 border-t border-[#30363D] flex items-center justify-between text-[11px] text-emerald-300 font-mono">
                <span>Audit Vulnerability: 0.00%</span>
                <span>Genius Coefficient: 999.9</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
            <h2 className="text-white text-base font-bold flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              <span>Model Context Protocol (MCP) Wallet Tools</span>
            </h2>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Coinbase CDP registers native agentic tools through the Model Context Protocol (MCP) server. LLMs use these tools to discover, configure, and settle value autonomously.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D] space-y-1.5">
                <span className="text-xs font-bold text-blue-300">cdp_create_wallet</span>
                <p className="text-[11px] text-[#8B949E]">Spawns a new Smart Wallet or EOA on Base Mainnet or Base Sepolia.</p>
              </div>
              <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D] space-y-1.5">
                <span className="text-xs font-bold text-blue-300">cdp_transfer</span>
                <p className="text-[11px] text-[#8B949E]">Executes gasless or sponsored value transfer for ETH, USDC, or ERC-20 tokens.</p>
              </div>
              <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D] space-y-1.5">
                <span className="text-xs font-bold text-blue-300">cdp_request_faucet</span>
                <p className="text-[11px] text-[#8B949E]">Drips 0.5 ETH or 5,000 USDC directly to any Sepolia testnet address.</p>
              </div>
              <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D] space-y-1.5">
                <span className="text-xs font-bold text-blue-300">cdp_deploy_contract</span>
                <p className="text-[11px] text-[#8B949E]">Compiles and deploys ERC-20, ERC-721, or custom EVM smart contracts.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quickstart' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
            <h2 className="text-white text-base font-bold flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Quickstart SDK Integration</span>
            </h2>
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D] font-mono text-xs text-blue-300 overflow-x-auto">
              {`import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";

// Initialize Coinbase CDP
const coinbase = new Coinbase({
  apiKeyName: "organizations/...",
  privateKey: "-----BEGIN EC PRIVATE KEY-----\\n..."
});

// Spawn / Restore a non-custodial Smart Account
const wallet = await Wallet.create({ networkId: "base-sepolia" });
console.log("Spawned wallet address:", (await wallet.getDefaultAddress()).toString());`}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
            <h2 className="text-white text-base font-bold flex items-center space-x-2">
              <Code className="w-5 h-5 text-indigo-400" />
              <span>Core Wallet Operations</span>
            </h2>
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D] font-mono text-xs text-emerald-300 overflow-x-auto">
              {`// Faucet Fund Request
await wallet.faucet();

// Sponsored Gas Transfer (Smart Account Sponsorship)
const transfer = await wallet.createTransfer({
  amount: 10.5,
  assetId: Coinbase.assets.usdc,
  destination: "0x..."
});
await transfer.wait();`}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plugins' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-3">
            <h2 className="text-white text-base font-bold flex items-center space-x-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>CDP Protocol Plugins</span>
            </h2>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              CDP provides out-of-the-box integration for 20 major onchain protocols:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-[#8B949E] pt-2">
              <div className="bg-[#0D1117] p-2 rounded border border-[#30363D] font-mono">Uniswap V3</div>
              <div className="bg-[#0D1117] p-2 rounded border border-[#30363D] font-mono">Aave V3</div>
              <div className="bg-[#0D1117] p-2 rounded border border-[#30363D] font-mono">Morpho Blue</div>
              <div className="bg-[#0D1117] p-2 rounded border border-[#30363D] font-mono">ERC-20 Token</div>
              <div className="bg-[#0D1117] p-2 rounded border border-[#30363D] font-mono">WETH Wrap</div>
              <div className="bg-[#0D1117] p-2 rounded border border-[#30363D] font-mono">Pyth Oracles</div>
              <div className="bg-[#0D1117] p-2 rounded border border-[#30363D] font-mono">Basenames</div>
              <div className="bg-[#0D1117] p-2 rounded border border-[#30363D] font-mono">Superchain Bridge</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Subscription */}
            <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
              <h2 className="text-white text-base font-bold flex items-center space-x-2">
                <Bell className="w-5 h-5 text-purple-400" />
                <span>CDP Webhook Manager</span>
              </h2>
              <p className="text-xs text-[#8B949E]">
                Register secure, cryptographically signed HTTP webhooks to receive real-time notifications about wallet transactions, delegations, or signatures.
              </p>

              <form onSubmit={handleCreateSub} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white">Target Callback URL</label>
                  <input
                    type="text"
                    value={subTargetUrl}
                    onChange={(e) => setSubTargetUrl(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white">Event Type Subscription</label>
                  <select
                    value={selectedEventType}
                    onChange={(e) => setSelectedEventType(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="wallet.transaction.created">wallet.transaction.created</option>
                    <option value="wallet.transaction.broadcast">wallet.transaction.broadcast</option>
                    <option value="wallet.transaction.confirmed">wallet.transaction.confirmed</option>
                    <option value="wallet.transaction.failed">wallet.transaction.failed</option>
                    <option value="wallet.message.signed">wallet.message.signed</option>
                    <option value="wallet.delegation.created">wallet.delegation.created</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  Create Webhook Subscription
                </button>
              </form>

              {/* Active Subscriptions */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-white">Active Subscriptions ({subscriptions.length})</span>
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{sub.description}</p>
                      <p className="text-[10px] text-[#8B949E] truncate max-w-sm">{sub.targetUrl}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sandbox simulator */}
            <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h2 className="text-white text-base font-bold flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <span>Webhook Simulator Sandbox</span>
                </h2>
                <p className="text-xs text-[#8B949E]">
                  Trigger simulated, raw JSON payload events to your registered webhooks to test your server's transaction monitoring parser pipelines.
                </p>

                <div className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D] space-y-1">
                  <p className="text-xs font-bold text-white">Active Event Route</p>
                  <code className="text-[11px] text-blue-300">POST /api/cdp/webhooks/simulate</code>
                </div>

                <button
                  onClick={handleSimulateWebhook}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  Simulate Live Event Trigger
                </button>
              </div>

              {simResult && (
                <div className="space-y-2 pt-4">
                  <span className="text-xs font-bold text-white">Dispatched Payload (200 OK)</span>
                  <pre className="bg-[#0D1117] p-3.5 rounded-xl border border-emerald-500/40 text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-52">
                    {JSON.stringify(simResult.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'oauth' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
            <h2 className="text-white text-base font-bold flex items-center space-x-2">
              <Key className="w-5 h-5 text-yellow-400" />
              <span>Coinbase CDP Custom Social Login (OAuth 2.0)</span>
            </h2>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Use Google OAuth to authorize end-user smart accounts beneath your Coinbase Developer Platform (CDP) project hierarchy.
            </p>
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D] text-xs text-[#8B949E] space-y-2 leading-relaxed">
                <p>1. <b>Google Cloud Console</b>: Navigate to APIs & Services {'>'} Credentials.</p>
                <p>2. <b>OAuth Consent</b>: Configure branding, scopes (openid, profile, email).</p>
                <p>3. <b>Credentials</b>: Create "Web application" client. Redirect URI: <code>https://api.cdp.coinbase.com/platform/v2/end-users/auth/oauth/google/callback</code></p>
                <p>4. <b>CDP Portal</b>: Navigate to Non-custodial Wallet {'>'} Authentication and paste your Client ID/Secret.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trade' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
            <h2 className="text-white text-base font-bold flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Trade API & Swaps</span>
            </h2>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Execute token swaps with built-in slippage protection, gas optimization, and Smart Account sponsorship.
            </p>
            <div className="text-xs text-[#8B949E] space-y-2">
                <p>• <b>Estimate</b>: <code>getSwapPrice</code> for real-time rates.</p>
                <p>• <b>Quote</b>: <code>quoteSwap</code> to lock in parameters with <code>slippageBps</code>.</p>
                <p>• <b>Execute</b>: Use <code>execute()</code> for EOAs, or <code>waitForUserOperation</code> for Smart Accounts.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
