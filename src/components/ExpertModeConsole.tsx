import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Package, ExternalLink, Copy, Check, Layers, Code2,
  Server, Cpu, Shield, Sparkles, BookOpen, Download, FileText, CheckCircle2,
  Play, RefreshCw, Trash2, Send, CornerDownLeft, ChevronRight, HardDrive, Flame
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ExpertModeConsoleProps {
  onNavigateTab?: (tab: string) => void;
}

interface TerminalLogLine {
  id: string;
  type: 'cmd' | 'output' | 'error' | 'success';
  text: string;
  timestamp: string;
}

export const ExpertModeConsole: React.FC<ExpertModeConsoleProps> = ({ onNavigateTab }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'terminal' | 'docs' | 'sdk' | 'docker'>('terminal');

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<TerminalLogLine[]>([
    {
      id: 'init-1',
      type: 'output',
      text: '🏛️ KRONOS APEX FINANCIAL OPERATING SYSTEM • INTERACTIVE PACKAGE TERMINAL\nNPM Package: kronos-apex-financial-os@1.0.0 (Production ESM & CJS Dual Target)\nType a command below or click any of the pre-coded action buttons to test the package.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [isRunningCommand, setIsRunningCommand] = useState(false);
  const [commandHistoryStack, setCommandHistoryStack] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Execute terminal command via backend API
  const runCommand = async (cmdToRun: string) => {
    const trimmed = cmdToRun.trim();
    if (!trimmed || isRunningCommand) return;

    // Add user command to terminal logs
    const userLine: TerminalLogLine = {
      id: Date.now().toString(),
      type: 'cmd',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setTerminalHistory(prev => [...prev, userLine]);
    setCommandHistoryStack(prev => [trimmed, ...prev.filter(c => c !== trimmed)]);
    setHistoryIndex(-1);
    setCommandInput('');
    setIsRunningCommand(true);

    if (trimmed.toLowerCase() === 'clear') {
      setTerminalHistory([]);
      setIsRunningCommand(false);
      return;
    }

    try {
      const res = await fetch('/api/kronos/cli/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmed })
      });
      const data = await res.json();

      if (data.success && data.output) {
        // Strip ANSI codes if needed or format cleanly
        const cleanOutput = data.output.replace(/\x1b\[[0-9;]*m/g, '');
        const outputLine: TerminalLogLine = {
          id: (Date.now() + 1).toString(),
          type: 'output',
          text: cleanOutput,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setTerminalHistory(prev => [...prev, outputLine]);
      } else {
        const errorLine: TerminalLogLine = {
          id: (Date.now() + 1).toString(),
          type: 'error',
          text: `Command error: ${data.error || 'Execution failed'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setTerminalHistory(prev => [...prev, errorLine]);
      }
    } catch (err: any) {
      const errorLine: TerminalLogLine = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        text: `Network error connecting to Kronos CLI Kernel: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setTerminalHistory(prev => [...prev, errorLine]);
    } finally {
      setIsRunningCommand(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistoryStack.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, commandHistoryStack.length - 1);
        setHistoryIndex(nextIdx);
        setCommandInput(commandHistoryStack[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setCommandInput(commandHistoryStack[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    }
  };

  const PRECODED_COMMANDS = [
    { label: '🚀 Serve Headless', cmd: 'npx kronos-apex-financial-os serve --port 3000 --headless', desc: 'Start headless multi-bank daemon' },
    { label: '🔍 Forensic Audit', cmd: 'npx kronos-apex-financial-os audit --input citi_statement.xml --mode professional', desc: 'Gemini GAAP/IFRS audit' },
    { label: '📜 Epic Narrative', cmd: 'npx kronos-apex-financial-os story --feed citi-treasury-wire --theme gilded-gold', desc: 'Wall Street saga chronicle' },
    { label: '🤖 Launch MCP', cmd: 'npx kronos-apex-financial-os mcp --transport stdio', desc: 'Start Model Context Protocol server' },
    { label: '🌉 Reconcile QBO', cmd: 'npx kronos-apex-financial-os bridge --reconcile --realm 9341453267972001', desc: 'Double-entry Chart of Accounts sync' },
    { label: '🧪 Run Test Suite', cmd: 'npx kronos-apex-financial-os test', desc: 'Verify package contracts & health' },
    { label: 'ℹ️ Show Help', cmd: 'npx kronos-apex-financial-os help', desc: 'Display all syntax & options' }
  ];

  const sdkCode = `// 1. Install via NPM
// npm install kronos-apex-financial-os

import { 
  KronosEngine, 
  QboQuantumBridge, 
  EpicStoriesEngine, 
  McpUnifiedServer,
  DEFAULT_BANK_FEEDS
} from 'kronos-apex-financial-os';

// Initialize the Sovereign Financial Engine in your Node.js backend
const kronos = new KronosEngine({
  apiKey: process.env.GEMINI_API_KEY,
  environment: 'sandbox',
  realmId: '9341453267972001'
});

// Generate an Executive Forensic Audit or Epic Narrative on live transaction data
const auditReport = await kronos.epicStories.generateReport({
  mode: 'all', // 'professional' | 'narrative' | 'all'
  feedId: 'citi-treasury-wire',
  borderStyle: 'gilded-gold'
});

console.log(auditReport.markdown);`;

  const dockerCode = `# Multi-Stage Production Dockerfile for kronos-apex-financial-os
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install the globally published package from npmjs.com
RUN npm install -g kronos-apex-financial-os

EXPOSE 3000
CMD ["kronos-apex-financial-os", "serve", "--port", "3000", "--headless"]`;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#161B22] rounded-2xl border border-emerald-500/40 p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-lg">
              <Package className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  NPM Registry Package & Interactive Terminal
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  v1.0.0 PUBLISHED
                </span>
              </div>
              <p className="text-xs text-[#8B949E]">
                Official Package: <span className="text-emerald-300 font-mono font-bold">kronos-apex-financial-os</span> • Distributed Multi-Bank Engine & CLI Runner
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
            Execute the actual package via the live interactive terminal below. Click any pre-coded button to run package routines or type custom commands to interact directly with the financial kernel.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
          <a
            href="https://www.npmjs.com/package/kronos-apex-financial-os"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg transition cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View on npmjs.com</span>
          </a>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('epic-stories')}
              className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Epic Stories Panel</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-[#0D1117] border-b border-[#30363D] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveSubTab('terminal')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'terminal'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/30'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#21262D]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Live Package Terminal</span>
            </button>
            <button
              onClick={() => setActiveSubTab('docs')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'docs'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/30'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#21262D]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>expert.md Master Spec</span>
            </button>
            <button
              onClick={() => setActiveSubTab('sdk')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'sdk'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/30'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#21262D]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Node.js / TS SDK</span>
            </button>
            <button
              onClick={() => setActiveSubTab('docker')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'docker'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/30'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#21262D]'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Docker & Multi-Cloud</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            CLI Daemon: READY
          </span>
        </div>

        {/* Tab 1: Live Interactive Terminal */}
        {activeSubTab === 'terminal' && (
          <div className="p-6 space-y-4">
            {/* Pre-coded Action Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pre-Coded Package Runner Buttons (Click to Execute)</span>
                </span>
                <span className="text-[10px] text-[#8B949E] font-mono">
                  Instant One-Click Shell Execution
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {PRECODED_COMMANDS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => runCommand(item.cmd)}
                    disabled={isRunningCommand}
                    title={item.desc}
                    className="p-2.5 rounded-xl bg-[#0D1117] hover:bg-[#21262D] border border-[#30363D] hover:border-emerald-500/50 text-left transition flex flex-col justify-between gap-1 group cursor-pointer disabled:opacity-50"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                      {item.label}
                    </span>
                    <span className="text-[9px] text-[#8B949E] truncate font-mono">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Window */}
            <div className="rounded-2xl border-2 border-[#30363D] bg-[#07090E] shadow-2xl overflow-hidden font-mono">
              {/* Window Header */}
              <div className="px-4 py-2.5 bg-[#0D1117] border-b border-[#30363D] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-gray-400 text-[11px] ml-2">kronos@apex-financial-os: ~</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const text = terminalHistory.map(l => l.text).join('\n');
                      copyToClipboard(text, 'terminal');
                    }}
                    className="text-[11px] text-gray-400 hover:text-white px-2 py-0.5 rounded bg-[#21262D] border border-[#30363D] transition cursor-pointer flex items-center gap-1"
                  >
                    {copiedSection === 'terminal' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'terminal' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setTerminalHistory([])}
                    className="text-[11px] text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded bg-[#21262D] border border-[#30363D] transition cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Logs Screen */}
              <div className="p-4 h-[380px] overflow-y-auto space-y-2 text-xs leading-relaxed select-text scrollbar-thin">
                {terminalHistory.map((item) => (
                  <div key={item.id} className="space-y-0.5">
                    {item.type === 'cmd' ? (
                      <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                        <span className="text-cyan-400">kronos@apex-os:~$</span>
                        <span>{item.text}</span>
                        <span className="text-[10px] text-gray-500 ml-auto font-normal">{item.timestamp}</span>
                      </div>
                    ) : item.type === 'error' ? (
                      <div className="text-rose-400 bg-rose-950/30 p-2 rounded border border-rose-500/30">
                        {item.text}
                      </div>
                    ) : (
                      <div className="text-gray-300 whitespace-pre-wrap pl-2 border-l border-emerald-500/20 py-0.5">
                        {item.text}
                      </div>
                    )}
                  </div>
                ))}

                {isRunningCommand && (
                  <div className="flex items-center space-x-2 text-amber-400 py-1 pl-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing package routine in Kronos Kernel...</span>
                  </div>
                )}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Text Input ("and then text it") */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runCommand(commandInput);
                }}
                className="p-3 bg-[#0D1117] border-t border-[#30363D] flex items-center gap-2"
              >
                <div className="flex items-center space-x-2 text-cyan-400 shrink-0 font-bold text-xs pl-1">
                  <span>kronos@apex-os:~$</span>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isRunningCommand}
                  placeholder="Type any command (e.g. audit, story, serve, mcp, test, help)..."
                  className="flex-1 bg-transparent border-none text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  disabled={!commandInput.trim() || isRunningCommand}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition disabled:opacity-40 cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Execute</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Full Rendered expert.md */}
        {activeSubTab === 'docs' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <span className="text-xs font-mono text-[#8B949E]">
                Rendered from: <span className="text-emerald-400 font-bold">/expert.md</span>
              </span>
              <button
                onClick={() => copyToClipboard(expertMarkdownDoc, 'docs')}
                className="flex items-center space-x-1.5 text-xs text-gray-300 hover:text-white bg-[#21262D] px-3 py-1.5 rounded-lg border border-[#30363D] cursor-pointer"
              >
                {copiedSection === 'docs' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'docs' ? 'Copied' : 'Copy Full expert.md'}</span>
              </button>
            </div>

            <div className="prose prose-invert max-w-none text-xs leading-relaxed font-sans space-y-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {expertMarkdownDoc}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Tab 3: Node.js / TS SDK */}
        {activeSubTab === 'sdk' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#8B949E]">
                Import the package into external Node.js, Express, Next.js, or backend services:
              </p>
              <button
                onClick={() => copyToClipboard(sdkCode, 'sdk')}
                className="flex items-center space-x-1.5 text-xs text-emerald-300 bg-[#21262D] px-3 py-1.5 rounded-lg border border-[#30363D] cursor-pointer"
              >
                {copiedSection === 'sdk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'sdk' ? 'Copied' : 'Copy SDK Snippet'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {sdkCode}
            </pre>
          </div>
        )}

        {/* Tab 4: Docker & Multi-Cloud */}
        {activeSubTab === 'docker' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#8B949E]">
                Production Multi-Stage Dockerfile for cloud container platforms (AWS ECS, Cloud Run, Azure Container Apps):
              </p>
              <button
                onClick={() => copyToClipboard(dockerCode, 'docker')}
                className="flex items-center space-x-1.5 text-xs text-emerald-300 bg-[#21262D] px-3 py-1.5 rounded-lg border border-[#30363D] cursor-pointer"
              >
                {copiedSection === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'docker' ? 'Copied' : 'Copy Dockerfile'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed">
              {dockerCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const expertMarkdownDoc = `# 🏛️ KRONOS APEX FINANCIAL OPERATING SYSTEM — MASTER SPECIFICATION
**NPM Package:** https://www.npmjs.com/package/kronos-apex-financial-os  
**Classification:** Enterprise Multi-Bank Gateway, Autonomous Cognitive Treasury Engine & AAAI '26 Foundation Model  

### Key Transformation Dimensions:
1. **Decoupled Architecture**: From single browser tab to distributed Node.js engine and headless microservice.
2. **Programmatic SDK Surface**: Allows algorithmic trading desks and quant teams to import \`KronosEngine\` directly.
3. **Headless CLI**: Run commands like \`npx kronos-apex-financial-os audit\` or \`npx kronos-apex-financial-os serve\` without a browser.
4. **Model Context Protocol (MCP)**: AI agents connect natively over stdio to query Chart of Accounts and execute financial wires.
5. **Gemini 3.8 Flash Epic Stories**: Dual-spectrum C-Suite Forensic Auditing and High-Literature Narrative Chronicles.`;
