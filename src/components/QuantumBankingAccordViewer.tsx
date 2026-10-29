import React, { useState } from 'react';
import {
  Cpu,
  Shield,
  Layers,
  Sparkles,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Network,
  Scale,
  Zap,
  Globe2,
  Users,
  Terminal,
  Activity,
  ArrowRight,
  BookOpen,
  Copy,
  Check
} from 'lucide-react';

interface QuantumNode {
  id: string;
  code: string;
  name: string;
  category: 'CORE' | 'ETHICS' | 'EXECUTION' | 'QUANTUM' | 'GOVERNANCE';
  description: string;
  inputs: string[];
  outputs: string[];
  status: 'ACTIVE_SUPERPOSITION' | 'LOCKED_ENTANGLED' | 'RESONATING';
  frequency?: string;
}

const QUANTUM_NODES: QuantumNode[] = [
  {
    id: 'qc',
    code: 'QC',
    name: 'Quantum Computing',
    category: 'QUANTUM',
    description: 'Central non-deterministic processing fabric delivering qubit entanglement topologies and matrix optimization.',
    inputs: ['T369 (Mathematical Framework)'],
    outputs: ['QBAI (Quantum Capabilities)', 'QPPU (Optimised Processing)', 'T369 (Algorithmic Principles)'],
    status: 'ACTIVE_SUPERPOSITION'
  },
  {
    id: 'ei',
    code: 'EI',
    name: 'Ethics & Intentionality',
    category: 'ETHICS',
    description: 'Hard moral constraints compiled into deterministic validation gates. Precludes predatory leverage and ensures equitable liquidity distribution.',
    inputs: ['Sovereign Oath Directives'],
    outputs: ['PBDMS (Moral Guidelines)', 'TAE (Ethical Bounds)'],
    status: 'LOCKED_ENTANGLED'
  },
  {
    id: 'ddm',
    code: 'DDM',
    name: 'Data-Driven Modeling',
    category: 'EXECUTION',
    description: 'Empirical data foundation consuming tick-level order books, liquidity metrics, and macroeconomic telemetry.',
    inputs: ['TAE (Transaction Data)', 'QWEM (Predictive Market Modeling)'],
    outputs: ['RMA (Analytical Insights)', 'QBAI (Data Foundation)'],
    status: 'ACTIVE_SUPERPOSITION'
  },
  {
    id: 'tae',
    code: 'TAE',
    name: 'Transaction Processing Engine',
    category: 'EXECUTION',
    description: 'Ultra-low latency execution kernel executing atomic cross-border settlements, smart-contract clearing, and ISO 20022 wire generation.',
    inputs: ['EI (Ethical Bounds)', 'QBAI (Automated Decisions)', 'PBDMS (Policy Directives)', 'QPPU (High-Speed Computation)', 'IONI (Decentralised Ledger)'],
    outputs: ['IONI (Real-Time Execution)', 'DDM (Transaction Data)'],
    status: 'ACTIVE_SUPERPOSITION'
  },
  {
    id: 'rma',
    code: 'RMA',
    name: 'Risk Management & Analytics Engine',
    category: 'CORE',
    description: 'Pre-trade systemic invariant verification, continuous Groth16 zero-knowledge solvency auditing, and capital-at-risk stress testing.',
    inputs: ['DDM (Analytical Insights)', 'QBAI (Predictive Intelligence)', 'PBDMS (Governance Models)'],
    outputs: ['IONI (Risk Mitigation)', 'PBDMS (Risk Profiles)'],
    status: 'LOCKED_ENTANGLED'
  },
  {
    id: 'qbai',
    code: 'QBAI',
    name: 'Quantum-Based AI Modeling',
    category: 'QUANTUM',
    description: 'Autonomous cognitive intelligence executing dynamic liquidity balancing, market trend foresight, and multi-asset routing.',
    inputs: ['QC (Quantum Capabilities)', 'DDM (Data Foundation)'],
    outputs: ['RMA (Predictive Intelligence)', 'TAE (Automated Decisions)'],
    status: 'ACTIVE_SUPERPOSITION'
  },
  {
    id: 'ioni',
    code: 'IONI',
    name: 'Inter-Organisational Network Infrastructure',
    category: 'CORE',
    description: 'Decentralized multi-bank consensus mesh replacing legacy SWIFT correspondent banking chokepoints with zero-latency settlement.',
    inputs: ['TAE (Real-Time Execution)', 'RMA (Risk Mitigation)', 'QPPU (Cryptographic Verification)', 'NPQEB (Asset Backing Validation)'],
    outputs: ['PBDMS (Consensus Mechanism)', 'TAE (Decentralised Ledger)'],
    status: 'ACTIVE_SUPERPOSITION'
  },
  {
    id: 'pbdms',
    code: 'PBDMS',
    name: 'Participant-Based Decision-Making System',
    category: 'GOVERNANCE',
    description: 'Decentralized stakeholder quorum governance utilizing cryptographic zero-knowledge voting without central bank coercion.',
    inputs: ['EI (Moral Guidelines)', 'RMA (Risk Profiles)', 'IONI (Consensus Mechanism)', 'NPQEB (Resource Allocation Rules)'],
    outputs: ['TAE (Policy Directives)', 'RMA (Governance Models)'],
    status: 'LOCKED_ENTANGLED'
  },
  {
    id: 'qppu',
    code: 'QPPU',
    name: 'Quantum-Powered Processing Units',
    category: 'QUANTUM',
    description: 'Specialized hardware cryptoprocessors executing post-quantum lattice-based cryptography (Kyber/Dilithium) and sub-microsecond proof hashing.',
    inputs: ['QC (Optimised Processing)'],
    outputs: ['TAE (High-Speed Computation)', 'IONI (Cryptographic Verification)'],
    status: 'RESONATING'
  },
  {
    id: 't369',
    code: 'T369',
    name: 'Tesla 369 Code Alignment',
    category: 'CORE',
    description: 'Harmonic mathematical frequency matrix (3, 6, 9 nodal resonance) governing node state replication and cyclic liquidity rebalancing.',
    inputs: ['QC (Algorithmic Principles)'],
    outputs: ['QWEM (Harmonic Resonance Data)', 'QC (Mathematical Framework)'],
    status: 'RESONATING',
    frequency: '432 Hz / 369 Nodal Cycle'
  },
  {
    id: 'qwem',
    code: 'QWEM',
    name: 'Quantum Wave-Enabled Modeling',
    category: 'QUANTUM',
    description: 'Wavefunction probability mechanics calculating real-time equilibrium pricing and counterparty risk distributions.',
    inputs: ['T369 (Harmonic Resonance Data)'],
    outputs: ['NPQEB (Energy Field Calculations)', 'DDM (Predictive Market Modeling)'],
    status: 'ACTIVE_SUPERPOSITION'
  },
  {
    id: 'npqeb',
    code: 'NPQEB',
    name: 'Non-Physical Quantum Energy Backing',
    category: 'CORE',
    description: 'Value baseline anchoring institutional ledger units to productive thermodynamic energy output rather than fiat debt creation.',
    inputs: ['QWEM (Energy Field Calculations)'],
    outputs: ['IONI (Asset Backing Validation)', 'PBDMS (Resource Allocation Rules)'],
    status: 'RESONATING'
  }
];

const DIALOGUE_EXCERPTS = [
  {
    speaker: "James O'Callaghan",
    role: "Architect & Sovereign Strategist",
    statement: "Compounding interest on non-existent baseline capital is a mathematical entropy trap. The current architecture requires infinite debt expansion to service past obligations, ensuring systemic collapse across the $330 Trillion global debt overhang.",
    category: "Diagnosis"
  },
  {
    speaker: "The Negotiator",
    role: "Institutional Intermediary",
    statement: "Sovereign institutions and central banks require certainty of orderly transition without systemic liquidity panic or immediate counterparty insolvency.",
    category: "Constraint"
  },
  {
    speaker: "James O'Callaghan",
    role: "Architect & Sovereign Strategist",
    statement: "The resolution is not unilateral default—it is cryptographic debt neutralization through bilateral offset matrices, transitioning balance sheets from fiat debt instruments into positive-sum energy-backed liquidity reserves.",
    category: "Resolution"
  },
  {
    speaker: "Global Financial Leaders",
    role: "Consortium Delegation",
    statement: "If the mathematical invariant ensures aggregate solvency (Assets >= Liabilities) through zero-knowledge proofs while preserving depositor protection, the transition to the Quantum AI Banking system becomes an imperative.",
    category: "Consensus"
  }
];

export function QuantumBankingAccordViewer() {
  const [selectedNode, setSelectedNode] = useState<QuantumNode>(QUANTUM_NODES[0]);
  const [dialogueFilter, setDialogueFilter] = useState('ALL');
  const [copiedOath, setCopiedOath] = useState(false);

  const handleCopyOath = () => {
    const oathText = `We pledge our lives, our intellect, and our architectural code to the unwavering preservation of public liquidity, the total eradication of fraudulent balance-sheet inflation, and the continuous stewardship of an equitable, transparent, and sovereign global financial commons. — Chapter 17, Sovereign Oath of Accountability`;
    navigator.clipboard.writeText(oathText);
    setCopiedOath(true);
    setTimeout(() => setCopiedOath(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#161B22] p-6 rounded-2xl border border-purple-500/40 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-purple-500/15 border border-purple-500/30 rounded-xl text-purple-400">
              <Cpu className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Quantum AI Banking System Architecture & GFL Accord
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/40">
                  NOV 7, 2023 ACCORD
                </span>
              </div>
              <p className="text-xs text-[#8B949E] mt-1">
                Unified Quantum Computing, Ethics & Intentionality, Tesla 369 Harmonic Code, and Non-Physical Quantum Energy Backing for Global Financial Sovereignty.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-[#0D1117] text-emerald-400 border border-[#30363D]">
              SOLVENCY: A ≥ L (PROVEN)
            </span>
          </div>
        </div>
      </div>

      {/* Infinite Directed Execution Flow Topology */}
      <div className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-3">
        <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-purple-400" />
            Directed Continuous Settlement Execution Topology
          </h4>
          <span className="text-[10px] font-mono text-[#8B949E]">
            digraph LR rankdir=LR
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-mono">
          {[
            { label: 'Classical Rails', desc: 'Ingestion Layer' },
            { label: 'Hybrid Ingestion', desc: 'Protocol Translation' },
            { label: 'Deterministic Mesh', desc: 'ZeroMQ / mTLS' },
            { label: 'Quantum Core', desc: 'QC & QPPU Compute' },
            { label: 'Infinite Possibility Space', desc: 'QWEM Simulation' },
            { label: 'Consensus Ledger', desc: 'IONI Multi-Bank' },
            { label: 'Continuous Loop', desc: 'Atomic Settlement' }
          ].map((step, idx, arr) => (
            <React.Fragment key={step.label}>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-purple-500/30 shrink-0 min-w-[140px] text-center hover:border-purple-400 transition-colors">
                <span className="text-[10px] text-purple-400 font-bold block">STEP 0{idx + 1}</span>
                <span className="text-xs font-bold text-white block mt-0.5">{step.label}</span>
                <span className="text-[10px] text-[#8B949E] block mt-0.5">{step.desc}</span>
              </div>
              {idx < arr.length - 1 && (
                <ArrowRight className="w-4 h-4 text-purple-400/60 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Interactive 12-Node Quantum Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Node Matrix List (7 cols) */}
        <div className="lg:col-span-7 bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-400" />
              Unified Architecture Nodal Matrix (12 Primary Sub-Systems)
            </h4>
            <span className="text-[10px] text-[#8B949E] font-mono">Select a node to inspect</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {QUANTUM_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/50'
                      : 'bg-[#0D1117] border-[#30363D] hover:border-zinc-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-300 px-1.5 py-0.5 bg-purple-500/20 rounded">
                      {node.code}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-xs font-bold text-white mt-1.5 truncate" title={node.name}>
                    {node.name}
                  </p>
                  <span className="text-[10px] font-mono text-[#8B949E] block mt-0.5">
                    {node.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#161B22] p-5 rounded-2xl border border-[#30363D] space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
            <span className="text-xs font-mono font-bold text-purple-400 px-2 py-0.5 bg-purple-500/20 rounded border border-purple-500/40">
              {selectedNode.code} :: {selectedNode.category}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/30">
              {selectedNode.status}
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-white">{selectedNode.name}</h4>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              {selectedNode.description}
            </p>

            {selectedNode.frequency && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
                <span className="text-[#8B949E] block text-[10px]">HARMONIC ALIGNMENT:</span>
                <span className="font-bold">{selectedNode.frequency}</span>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-[#30363D]">
              <div className="text-xs font-mono">
                <span className="text-[#8B949E] text-[10px] block font-bold uppercase">Incoming Ingest Rails:</span>
                <ul className="mt-1 space-y-1">
                  {selectedNode.inputs.map((inp, idx) => (
                    <li key={idx} className="text-cyan-300 text-[11px] flex items-center gap-1.5">
                      <span className="text-purple-400">←</span> {inp}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs font-mono pt-2">
                <span className="text-[#8B949E] text-[10px] block font-bold uppercase">Emitted Outputs & Directives:</span>
                <ul className="mt-1 space-y-1">
                  {selectedNode.outputs.map((out, idx) => (
                    <li key={idx} className="text-emerald-300 text-[11px] flex items-center gap-1.5">
                      <span className="text-emerald-400">→</span> {out}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Financial Leaders Accord Dialogue */}
      <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#30363D] pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Dialogue: The Negotiator, GFL, and James O'Callaghan
            </h4>
          </div>
          <span className="text-xs font-mono text-[#8B949E]">
            TOPIC: $330T Global Debt Overhang Resolution
          </span>
        </div>

        <div className="space-y-3">
          {DIALOGUE_EXCERPTS.map((d, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{d.speaker}</span>
                  <span className="text-[10px] text-[#8B949E] font-mono">({d.role})</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  d.category === 'Diagnosis' ? 'bg-red-500/20 text-red-300' :
                  d.category === 'Constraint' ? 'bg-amber-500/20 text-amber-300' :
                  d.category === 'Resolution' ? 'bg-emerald-500/20 text-emerald-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {d.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#8B949E] leading-relaxed italic">
                "{d.statement}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Point Strategic Framework */}
      <div className="bg-[#161B22] p-6 rounded-2xl border border-[#30363D] space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#30363D] pb-3">
          <Layers className="w-4 h-4 text-purple-400" />
          The 4 Pillars of Global Financial Transition
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 inline-block">
              <Zap className="w-4 h-4" />
            </span>
            <h5 className="text-xs font-bold text-white">1. Sustainability</h5>
            <p className="text-[11px] text-[#8B949E] leading-relaxed">
              Replacing fiat debt expansion with thermodynamic proof-of-utility and productive energy backing (NPQEB).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 inline-block">
              <Scale className="w-4 h-4" />
            </span>
            <h5 className="text-xs font-bold text-white">2. Governance</h5>
            <p className="text-[11px] text-[#8B949E] leading-relaxed">
              Decentralized participant-based consensus (PBDMS) eliminating unilateral sovereign coercion and sanction chokepoints.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 inline-block">
              <Cpu className="w-4 h-4" />
            </span>
            <h5 className="text-xs font-bold text-white">3. Infrastructure</h5>
            <p className="text-[11px] text-[#8B949E] leading-relaxed">
              Active-Active multi-cloud mesh with post-quantum lattice cryptography (QPPU) operating at sub-millisecond settlement.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 inline-block">
              <Users className="w-4 h-4" />
            </span>
            <h5 className="text-xs font-bold text-white">4. Societal Buy-In</h5>
            <p className="text-[11px] text-[#8B949E] leading-relaxed">
              Verifiable zero-knowledge solvency preserving depositor savings while neutralizing unserviceable institutional debt.
            </p>
          </div>
        </div>
      </div>

      {/* Chapter 17 Sovereign Oath */}
      <div className="bg-gradient-to-br from-[#1C1827] via-[#161B22] to-[#0D1117] p-6 rounded-2xl border border-purple-500/50 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-bold text-white tracking-wide">
              Chapter 17: Sovereign Oath of Accountability and Stewardship
            </h4>
          </div>
          <button
            onClick={handleCopyOath}
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-white font-mono cursor-pointer"
          >
            {copiedOath ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedOath ? 'Copied Oath' : 'Copy Oath'}</span>
          </button>
        </div>

        <blockquote className="text-xs text-purple-200/90 leading-relaxed italic border-l-2 border-purple-500 pl-4 py-1">
          "We pledge our lives, our intellect, and our architectural code to the unwavering preservation of public liquidity, the total eradication of fraudulent balance-sheet inflation, and the continuous stewardship of an equitable, transparent, and sovereign global financial commons."
        </blockquote>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#8B949E] pt-2 border-t border-purple-500/20">
          <span>RATIFIED: NOVEMBER 7, 2023</span>
          <span className="text-purple-400">SIGNATURE: JAMES BURVELO O'CALLAGHAN</span>
        </div>
      </div>
    </div>
  );
}

export default QuantumBankingAccordViewer;
