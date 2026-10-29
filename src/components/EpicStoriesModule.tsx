import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Sparkles, FileText, Send, Maximize2, Minimize2, Download, Copy, Check,
  RefreshCw, Shield, AlertCircle, ArrowUpRight, ArrowDownLeft, Database, Building2,
  Layers, Terminal, Sliders, Eye, FileCode, CheckCircle2, MessageSquare, Flame
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type ReportMode = 'professional' | 'narrative' | 'all';
export type BorderTheme = 'gilded-gold' | 'emerald-terminal' | 'imperial-obsidian' | 'cyber-neon' | 'sovereign-platinum';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  counterparty: string;
  status: string;
  account: string;
}

interface BankFeed {
  id: string;
  name: string;
  institution: string;
  currency: string;
  period: string;
  transactions: Transaction[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface EpicStoriesModuleProps {
  onNavigateTab?: (tab: string) => void;
  fullScreenDefault?: boolean;
}

export const EpicStoriesModule: React.FC<EpicStoriesModuleProps> = ({
  onNavigateTab,
  fullScreenDefault = false
}) => {
  const [isFullScreen, setIsFullScreen] = useState(fullScreenDefault);
  const [mode, setMode] = useState<ReportMode>('all');
  const [borderTheme, setBorderTheme] = useState<BorderTheme>('gilded-gold');
  const [feeds, setFeeds] = useState<BankFeed[]>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<string>('citi-treasury-wire');
  const [customDataInput, setCustomDataInput] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [activeTransactions, setActiveTransactions] = useState<Transaction[]>([]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [reportMetadata, setReportMetadata] = useState<{ feedName?: string; generatedAt?: string; transactionCount?: number } | null>(null);
  const [copied, setCopied] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Load available bank feeds
  useEffect(() => {
    fetch('/api/epic-stories/data-sources')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.feeds) {
          setFeeds(data.feeds);
          const initialFeed = data.feeds.find((f: BankFeed) => f.id === selectedFeedId) || data.feeds[0];
          if (initialFeed) {
            setSelectedFeedId(initialFeed.id);
            setActiveTransactions(initialFeed.transactions);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load bank feeds:', err);
      });
  }, []);

  // Update active transactions when feed changes
  const handleFeedChange = (feedId: string) => {
    setSelectedFeedId(feedId);
    setIsCustomMode(false);
    const feed = feeds.find(f => f.id === feedId);
    if (feed) {
      setActiveTransactions(feed.transactions);
    }
  };

  // Run initial generation if report is empty
  useEffect(() => {
    if (feeds.length > 0 && !generatedReport && !isGenerating) {
      handleGenerate();
    }
  }, [feeds]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatSending]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const payload: any = {
        mode,
        borderStyle: borderTheme,
        feedId: isCustomMode ? undefined : selectedFeedId,
        customData: isCustomMode ? customDataInput : undefined
      };

      const res = await fetch('/api/epic-stories/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.report) {
        setGeneratedReport(data.report);
        setReportMetadata({
          feedName: data.feedName,
          generatedAt: data.generatedAt,
          transactionCount: data.transactionCount
        });
      } else {
        setGeneratedReport(data.fallbackReport || `Error: ${data.error || 'Failed to generate report'}`);
      }
    } catch (err: any) {
      setGeneratedReport(`System error connecting to Gemini API: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatSending) return;

    const userText = chatInput.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatSending(true);

    try {
      const historyPayload = chatMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.content
      }));

      const res = await fetch('/api/epic-stories/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          currentData: activeTransactions,
          mode
        })
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || data.error || 'No response returned from Gemini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message}. Please check connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleCopy = () => {
    if (!generatedReport) return;
    navigator.clipboard.writeText(generatedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!generatedReport) return;
    const blob = new Blob([generatedReport], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kronos-Epic-Stories-${mode}-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Border theme CSS mappings
  const getBorderThemeClasses = (theme: BorderTheme) => {
    switch (theme) {
      case 'gilded-gold':
        return {
          panel: 'border-2 border-amber-500/60 bg-gradient-to-b from-[#16140d] via-[#0e0d0a] to-[#080806] shadow-[0_0_35px_rgba(245,158,11,0.18)]',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          accent: 'text-amber-400',
          seal: 'border-amber-400/50 bg-amber-500/10 text-amber-300'
        };
      case 'emerald-terminal':
        return {
          panel: 'border-2 border-emerald-500/60 bg-gradient-to-b from-[#091510] via-[#050d0a] to-[#020504] shadow-[0_0_35px_rgba(16,185,129,0.18)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          accent: 'text-emerald-400',
          seal: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-300'
        };
      case 'imperial-obsidian':
        return {
          panel: 'border-2 border-indigo-500/60 bg-gradient-to-b from-[#0f101f] via-[#090a14] to-[#04040a] shadow-[0_0_35px_rgba(99,102,241,0.22)]',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          accent: 'text-indigo-400',
          seal: 'border-indigo-400/50 bg-indigo-500/10 text-indigo-300'
        };
      case 'cyber-neon':
        return {
          panel: 'border-2 border-cyan-500/60 bg-gradient-to-b from-[#08151f] via-[#040c14] to-[#020508] shadow-[0_0_35px_rgba(6,182,212,0.25)]',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          accent: 'text-cyan-400',
          seal: 'border-cyan-400/50 bg-cyan-500/10 text-cyan-300'
        };
      case 'sovereign-platinum':
      default:
        return {
          panel: 'border-2 border-rose-500/60 bg-gradient-to-b from-[#180e12] via-[#0e070a] to-[#050304] shadow-[0_0_35px_rgba(244,63,94,0.18)]',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          accent: 'text-rose-400',
          seal: 'border-rose-400/50 bg-rose-500/10 text-rose-300'
        };
    }
  };

  const themeStyles = getBorderThemeClasses(borderTheme);

  return (
    <div className={`space-y-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-[#0A0C10] p-4 sm:p-6 overflow-y-auto' : ''}`}>
      {/* Header Banner */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-500 text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Epic Stories & Professional Bank Reports
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Gemini 3.8 Flash
                </span>
              </h2>
              <p className="text-xs text-[#8B949E]">
                Autonomous Forensic Financial Auditing & High-Literature Narrative Chronicles for Intuit QBO, Citi SWIFT, and Multi-Bank Feeds.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#30363D] bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-semibold transition cursor-pointer"
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Dedicated Fullscreen View</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            disabled={!generatedReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#30363D] bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .MD</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!generatedReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#30363D] bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Control Strip: Mode Toggle + Border Theme Selector + Bank Feed Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Mode Toggle */}
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] space-y-2">
          <label className="text-xs font-bold text-white flex items-center justify-between">
            <span>STORYTELLING / AUDIT MODE</span>
            <span className="text-[10px] text-[#8B949E] uppercase font-mono">{mode}</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-[#0D1117] p-1 rounded-lg border border-[#30363D]">
            <button
              onClick={() => { setMode('professional'); }}
              className={`py-2 px-2 rounded text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                mode === 'professional'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#21262D]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Professional</span>
            </button>
            <button
              onClick={() => { setMode('narrative'); }}
              className={`py-2 px-2 rounded text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                mode === 'narrative'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#21262D]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Narrative</span>
            </button>
            <button
              onClick={() => { setMode('all'); }}
              className={`py-2 px-2 rounded text-center text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                mode === 'all'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-black shadow-md font-extrabold'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#21262D]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Omnibus (All)</span>
            </button>
          </div>
          <p className="text-[11px] text-[#8B949E]">
            {mode === 'professional' && 'C-Suite certified forensic audit, EBITDA analysis, and GAAP/IFRS ledger trail.'}
            {mode === 'narrative' && 'Cinematic Wall Street drama, mythic chapters, and high-tension wire adventures.'}
            {mode === 'all' && 'Full dual-spectrum: Complete Executive Audit followed by the Epic Narrative Saga.'}
          </p>
        </div>

        {/* 2. Border Styling Frame */}
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] space-y-2">
          <label className="text-xs font-bold text-white flex items-center justify-between">
            <span>BESPOKE BORDER STYLING</span>
            <span className="text-[10px] text-[#8B949E] font-mono">{borderTheme}</span>
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            <button
              onClick={() => setBorderTheme('gilded-gold')}
              title="Gilded Executive Gold"
              className={`h-9 rounded-lg border-2 transition flex items-center justify-center text-xs font-bold cursor-pointer ${
                borderTheme === 'gilded-gold'
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/40'
                  : 'border-amber-500/30 bg-[#0D1117] text-amber-400/60 hover:border-amber-400'
              }`}
            >
              🥇 Gold
            </button>
            <button
              onClick={() => setBorderTheme('emerald-terminal')}
              title="Emerald Cyber-Ledger"
              className={`h-9 rounded-lg border-2 transition flex items-center justify-center text-xs font-bold cursor-pointer ${
                borderTheme === 'emerald-terminal'
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/40'
                  : 'border-emerald-500/30 bg-[#0D1117] text-emerald-400/60 hover:border-emerald-400'
              }`}
            >
              ❇️ Jade
            </button>
            <button
              onClick={() => setBorderTheme('imperial-obsidian')}
              title="Imperial Obsidian & Indigo"
              className={`h-9 rounded-lg border-2 transition flex items-center justify-center text-xs font-bold cursor-pointer ${
                borderTheme === 'imperial-obsidian'
                  ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300 ring-2 ring-indigo-400/40'
                  : 'border-indigo-500/30 bg-[#0D1117] text-indigo-400/60 hover:border-indigo-400'
              }`}
            >
              🔮 Royal
            </button>
            <button
              onClick={() => setBorderTheme('cyber-neon')}
              title="Cyberpunk Multi-Bank Blue"
              className={`h-9 rounded-lg border-2 transition flex items-center justify-center text-xs font-bold cursor-pointer ${
                borderTheme === 'cyber-neon'
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/40'
                  : 'border-cyan-500/30 bg-[#0D1117] text-cyan-400/60 hover:border-cyan-400'
              }`}
            >
              ⚡ Cyan
            </button>
            <button
              onClick={() => setBorderTheme('sovereign-platinum')}
              title="Sovereign Platinum & Rose"
              className={`h-9 rounded-lg border-2 transition flex items-center justify-center text-xs font-bold cursor-pointer ${
                borderTheme === 'sovereign-platinum'
                  ? 'border-rose-400 bg-rose-500/20 text-rose-300 ring-2 ring-rose-400/40'
                  : 'border-rose-500/30 bg-[#0D1117] text-rose-400/60 hover:border-rose-400'
              }`}
            >
              👑 Rose
            </button>
          </div>
          <p className="text-[11px] text-[#8B949E]">
            Applies sovereign architectural borders, shadow diffusion, and embossed seals to the rendered document.
          </p>
        </div>

        {/* 3. Bank Feed Data Selector */}
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#30363D] space-y-2">
          <label className="text-xs font-bold text-white flex items-center justify-between">
            <span>BANK DATA SOURCE</span>
            <span className="text-[10px] text-emerald-400 font-mono">
              {activeTransactions.length} TXs Loaded
            </span>
          </label>
          <div className="space-y-1.5">
            <select
              value={isCustomMode ? 'custom' : selectedFeedId}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setIsCustomMode(true);
                } else {
                  handleFeedChange(e.target.value);
                }
              }}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {feeds.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.institution})</option>
              ))}
              <option value="custom">✍️ Custom Ingest (Paste JSON / CSV / XML)</option>
            </select>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black text-xs font-extrabold shadow-md transition flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Chronicle with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Report & Epic Story</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Raw Data Ingest Drawer if Selected */}
      {isCustomMode && (
        <div className="bg-[#161B22] p-4 rounded-xl border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              <span>Custom Bank Statement or Transaction Batch JSON</span>
            </span>
            <button
              onClick={() => {
                setCustomDataInput(JSON.stringify(activeTransactions, null, 2));
              }}
              className="text-[11px] text-blue-400 hover:underline cursor-pointer"
            >
              Load Current Feed as JSON Template
            </button>
          </div>
          <textarea
            value={customDataInput}
            onChange={(e) => setCustomDataInput(e.target.value)}
            placeholder="Paste raw bank transactions JSON, CSV rows, or wire confirmations..."
            className="w-full h-28 bg-[#0D1117] border border-[#30363D] rounded-lg p-2.5 text-xs font-mono text-emerald-300 focus:outline-none focus:border-amber-500"
          />
        </div>
      )}

      {/* Transaction Feed Ledger Mini Table */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] overflow-hidden">
        <div className="px-4 py-3 bg-[#0D1117] border-b border-[#30363D] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Underlying Transaction Ledger ({activeTransactions.length} Items)
            </span>
          </div>
          <span className="text-[11px] text-[#8B949E] font-mono">
            {feeds.find(f => f.id === selectedFeedId)?.institution || 'Direct Institutional Gateway'}
          </span>
        </div>
        <div className="overflow-x-auto max-h-48 overflow-y-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161B22] text-[#8B949E] uppercase font-mono text-[10px] border-b border-[#30363D] sticky top-0">
              <tr>
                <th className="py-2 px-3">TX ID</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Counterparty</th>
                <th className="py-2 px-3 text-right">Amount (USD)</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]/50 font-mono text-[11px]">
              {activeTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#21262D]/40 transition">
                  <td className="py-2 px-3 text-indigo-400 font-bold">{tx.id}</td>
                  <td className="py-2 px-3 text-[#8B949E]">{tx.date}</td>
                  <td className="py-2 px-3 text-white max-w-xs truncate">{tx.description}</td>
                  <td className="py-2 px-3 text-gray-300 truncate">{tx.counterparty}</td>
                  <td className={`py-2 px-3 text-right font-bold ${tx.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#21262D] text-gray-300 border border-[#30363D]">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Dual Workspace: Rendered Bordered Report Panel (Left) & Dedicated AI Chronicler Chat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Styled Bordered Report Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`rounded-2xl p-6 sm:p-8 transition-all ${themeStyles.panel}`}>
            {/* Header Ornament & Seal */}
            <div className="border-b border-[#30363D]/60 pb-5 mb-6 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${themeStyles.badge}`}>
                    {borderTheme.replace('-', ' ')}
                  </span>
                  <span className="text-[11px] text-[#8B949E]">
                    {reportMetadata?.generatedAt ? new Date(reportMetadata.generatedAt).toLocaleString() : 'Live Sovereign Session'}
                  </span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${themeStyles.accent}`}>
                  {mode === 'professional' && 'Forensic Financial & Regulatory Audit'}
                  {mode === 'narrative' && 'The Chronicles of Liquidity: Epic Financial Saga'}
                  {mode === 'all' && 'The Sovereign Banking Omnibus: Forensic Audit & Mythic Chronicle'}
                </h3>
                <p className="text-xs text-[#8B949E]">
                  Target Asset: {reportMetadata?.feedName || 'Active Intuit & Citi Banking Pipeline'} • {reportMetadata?.transactionCount || activeTransactions.length} Transactions
                </p>
              </div>

              {/* Medallion Seal */}
              <div className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center p-1 text-center shrink-0 shadow-lg ${themeStyles.seal}`}>
                <Building2 className="w-5 h-5 mb-0.5" />
                <span className="text-[8px] font-mono font-extrabold tracking-tighter leading-none uppercase">KRONOS</span>
                <span className="text-[7px] text-[#8B949E] leading-none">SEALED</span>
              </div>
            </div>

            {/* Markdown Report Body */}
            {isGenerating ? (
              <div className="py-20 text-center space-y-4">
                <RefreshCw className={`w-10 h-10 animate-spin mx-auto ${themeStyles.accent}`} />
                <div className="space-y-1">
                  <p className="text-base font-bold text-white">Synthesizing High-Aesthetic Report & Narrative...</p>
                  <p className="text-xs text-[#8B949E] max-w-md mx-auto">
                    Gemini 3.8 Flash is cross-referencing ledger entries, calculating EBITDA impacts, and scripting epic financial literature.
                  </p>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-[#C9D1D9] text-xs leading-relaxed space-y-4 font-sans">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-white border-b border-[#30363D] pb-2 mt-6 mb-3" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-base font-bold text-amber-300 mt-5 mb-2 flex items-center gap-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-sm font-semibold text-emerald-300 mt-4 mb-1" {...props} />,
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-3 border border-[#30363D] rounded-xl bg-[#0D1117]/80">
                        <table className="w-full text-left text-xs divide-y divide-[#30363D]" {...props} />
                      </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-[#161B22] text-[#8B949E] uppercase font-mono text-[10px]" {...props} />,
                    th: ({ node, ...props }) => <th className="p-2.5 font-bold" {...props} />,
                    td: ({ node, ...props }) => <td className="p-2.5 border-t border-[#30363D]/40 font-mono text-[11px]" {...props} />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-amber-500 pl-4 py-1 italic bg-[#161B22]/60 rounded-r-lg my-3 text-amber-200" {...props} />
                    ),
                    code: ({ node, className, children, ...props }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="px-1.5 py-0.5 rounded bg-[#21262D] font-mono text-[11px] text-amber-300" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className="block p-3 rounded-xl bg-[#0D1117] font-mono text-[11px] text-emerald-300 border border-[#30363D] overflow-x-auto my-2" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {generatedReport || 'No report generated yet. Click "Generate Report & Epic Story" above.'}
                </ReactMarkdown>
              </div>
            )}

            {/* Bottom Certification Footer */}
            <div className="mt-8 pt-4 border-t border-[#30363D]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-[#8B949E] font-mono">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Digitally Verified: Kronos Apex Financial OS / RFC-3161 Timestamp Protocol</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#21262D] text-gray-300">ISO 20022</span>
                <span className="px-2 py-0.5 rounded bg-[#21262D] text-gray-300">GAAP SEC-404</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dedicated Full-Height Chatbot (5 Cols) */}
        <div className="lg:col-span-5 bg-[#161B22] rounded-2xl border border-[#30363D] flex flex-col h-[750px] shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-[#0D1117] border-b border-[#30363D] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Financial Storyteller & Forensic Bot
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-[10px] text-[#8B949E]">
                  Inquires deeply into all bank data & weaves personalized tales
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#21262D] text-gray-300">
              Live Engine
            </span>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="p-3 bg-[#161B22] border-b border-[#30363D]/60 flex items-center gap-1.5 overflow-x-auto scrollbar-thin text-[11px]">
            <button
              onClick={() => setChatInput("Tell me the epic story of the $4.25M Alpha Centauri wire transfer and the race against clearing settlement")}
              className="px-2.5 py-1 rounded-full bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white shrink-0 border border-[#30363D] transition cursor-pointer"
            >
              📜 $4.25M Wire Saga
            </button>
            <button
              onClick={() => setChatInput("Give me a forensic audit of the largest debits with risk flags")}
              className="px-2.5 py-1 rounded-full bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white shrink-0 border border-[#30363D] transition cursor-pointer"
            >
              🔍 Debit Forensic Audit
            </button>
            <button
              onClick={() => setChatInput("Turn our QuickBooks Chart of Accounts into a high-fantasy council of sovereign treasurers")}
              className="px-2.5 py-1 rounded-full bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white shrink-0 border border-[#30363D] transition cursor-pointer"
            >
              ⚔️ High Fantasy QBO Council
            </button>
          </div>

          {/* Chat Messages Body */}
          <div ref={chatScrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center text-xl">
                  🏛️
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Ask the Grand Chronicler</p>
                  <p className="text-xs text-[#8B949E] max-w-xs mx-auto">
                    Ask for epic long stories with borders and professional C-Suite audit reports across any of the {activeTransactions.length} loaded bank transactions.
                  </p>
                </div>
              </div>
            ) : (
              chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                        : 'bg-[#0D1117] text-[#C9D1D9] border border-[#30363D] rounded-tl-none shadow-md'
                    }`}
                  >
                    <div className="prose prose-invert max-w-none text-xs">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#8B949E] px-1 mt-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ))
            )}

            {isChatSending && (
              <div className="flex items-center space-x-2 text-xs text-[#8B949E] bg-[#0D1117] p-3 rounded-xl border border-[#30363D] w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>The Sovereign Chronicler is writing your saga...</span>
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#0D1117] border-t border-[#30363D] flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask for an epic story, audit trail, or specific transaction tale..."
              className="flex-1 bg-[#161B22] border border-[#30363D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-amber-500 transition"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatSending}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold disabled:opacity-40 transition shadow-md cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
