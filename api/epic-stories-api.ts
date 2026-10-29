import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

export const epicStoriesRouter = express.Router();

// Initialize Google GenAI SDK according to system skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Sample curated bank transaction feeds for instant one-click analysis
export const DEFAULT_BANK_FEEDS = [
  {
    id: 'citi-treasury-wire',
    name: 'Citi Institutional Global Wire & Treasury Feed',
    institution: 'Citibank N.A. London & New York',
    currency: 'USD',
    period: 'October 2026',
    transactions: [
      { id: 'TX-9011', date: '2026-10-18', description: 'Fedwire Outbound - Alpha Centauri Quantum Hardware Settlement', amount: -4250000.00, type: 'WIRE_OUT', counterparty: 'Aether Mesh Tech Corp', status: 'SETTLED', account: 'Citi Global Treasury #4492-91' },
      { id: 'TX-9012', date: '2026-10-19', description: 'SWIFT MT103 Inbound - Institutional Sovereign Bond Coupon Payout', amount: 1875000.00, type: 'SWIFT_IN', counterparty: 'Bank of England Custody', status: 'SETTLED', account: 'Citi Global Treasury #4492-91' },
      { id: 'TX-9013', date: '2026-10-20', description: 'CHIPS Clearing - Liquidity Pool Rebalancing & Yield Capture', amount: -650000.00, type: 'CLEARING', counterparty: 'Modern Treasury Smart Reserve', status: 'CONFIRMED', account: 'Citi Clearing #1102-45' },
      { id: 'TX-9014', date: '2026-10-21', description: 'Automated FX Hedge - EUR/USD Forward Arbitrage Execution', amount: 320400.50, type: 'FX_ARB', counterparty: 'Barclays Capital FX', status: 'SETTLED', account: 'Citi Currency Vault #7789-01' },
      { id: 'TX-9015', date: '2026-10-22', description: 'High-Value Escrow Release - Autonomous AI Buyer Acquisition Tranche', amount: -2100000.00, type: 'ESCROW', counterparty: 'James Burvelo Consortium Trust', status: 'PENDING_FINALITY', account: 'Citi Escrow #9901-22' }
    ]
  },
  {
    id: 'qbo-sandbox-ledger',
    name: 'QuickBooks Sandbox Chart of Accounts & General Ledger',
    institution: 'Intuit QuickBooks Online (Sandbox 9341453267972001)',
    currency: 'USD',
    period: 'Q3-Q4 2026',
    transactions: [
      { id: 'QBO-1001', date: '2026-10-10', description: 'Invoice #INV-2026-884 - Enterprise Cognitive Engine Licensing', amount: 840000.00, type: 'INVOICE_RECEIPT', counterparty: 'Meridian Global Enterprises', status: 'PAID', account: '10000 Undeposited Funds' },
      { id: 'QBO-1002', date: '2026-10-12', description: 'Bill Payment #BP-449 - NVIDIA H200 Cloud GPU Cluster Compute', amount: -312450.00, type: 'EXPENSE_BILL', counterparty: 'Lambda Labs HyperScale', status: 'CLEARED', account: '50000 Cost of Goods Sold' },
      { id: 'QBO-1003', date: '2026-10-14', description: 'Direct Deposit Payroll - Core Engineering & Algorithmic Quants', amount: -198500.00, type: 'PAYROLL', counterparty: 'Kronos Apex Staffing Trust', status: 'CLEARED', account: '60000 Payroll Expenses' },
      { id: 'QBO-1004', date: '2026-10-17', description: 'Vendor Credit - AWS Sovereign Cloud Infrastructure Rebate', amount: 45200.00, type: 'CREDIT', counterparty: 'Amazon Web Services', status: 'APPLIED', account: '12000 Accounts Receivable' },
      { id: 'QBO-1005', date: '2026-10-21', description: 'Journal Entry #JE-901 - Depreciation & Amortization of AI Models', amount: -85000.00, type: 'JOURNAL_ADJ', counterparty: 'Internal Amortization Schedule', status: 'POSTED', account: '17000 Intangible Model Assets' }
    ]
  },
  {
    id: 'kroger-pos-settlement',
    name: 'Kroger Citibank Retail POS & Supply Chain Flow',
    institution: 'Citibank Commercial Merchant Settlement Services',
    currency: 'USD',
    period: 'Weekly Batch 42-2026',
    transactions: [
      { id: 'KRG-501', date: '2026-10-16', description: 'Store Network Automated Settlement - 1,420 POS Terminals Batch', amount: 14250890.35, type: 'BATCH_DEPOSIT', counterparty: 'Citibank Merchant Acquirer', status: 'SETTLED', account: 'Kroger Master Operating #0012' },
      { id: 'KRG-502', date: '2026-10-17', description: 'Uber Freight Logistics Dispatch - Cold Chain Perishables Fuel & Freight', amount: -482100.00, type: 'LOGISTICS_PAY', counterparty: 'Uber Freight Logistics LLC', status: 'PAID', account: 'Kroger Logistics Ledger #0088' },
      { id: 'KRG-503', date: '2026-10-19', description: 'Loyalty Rewards Redemptions - 2.8M Boost Fuel Points Conversion', amount: -135400.00, type: 'REWARDS_DEBIT', counterparty: 'Citibank Rewards Ledger', status: 'RECONCILED', account: 'Kroger Customer Loyalty #0045' },
      { id: 'KRG-504', date: '2026-10-21', description: 'Chargeback & Fraud Mitigation Reversal - AI Zero-Trust Shield', amount: 28940.10, type: 'RECOVERY', counterparty: 'Visa Risk Operations', status: 'RECOVERED', account: 'Kroger Merchant Operating #0012' }
    ]
  }
];

// Helper to load sample files from workspace if present
function getSystemDataSummary(): string {
  try {
    const rootDir = process.cwd();
    const files = ['story.md', 'what_the_fuck_I_built.md', 'Citi.md', 'mcp.md'];
    const snippets: string[] = [];
    for (const file of files) {
      const p = path.join(rootDir, file);
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf-8');
        snippets.push(`### Source File: ${file}\n${content.slice(0, 1500)}...\n`);
      }
    }
    return snippets.join('\n\n');
  } catch (e) {
    return 'Default Kronos Financial OS Foundation Architecture.';
  }
}

// 1. GET /api/epic-stories/data-sources
// Returns all available bank data feeds and system metrics
epicStoriesRouter.get('/data-sources', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      feeds: DEFAULT_BANK_FEEDS,
      systemDataAvailable: true,
      styles: [
        { id: 'professional', name: 'Professional Audit & Financial Report', description: 'C-Suite certified forensic audit, EBITDA variance, risk matrices, and GAAP/IFRS ledger trail' },
        { id: 'narrative', name: 'Epic Financial Saga & Mythic Chronicle', description: 'Grand narrative odyssey with high-stakes Wall Street drama, chapter arcs, character tensions, and market mythos' },
        { id: 'all', name: 'Dual Omnibus (Professional Report + Epic Narrative)', description: 'Complete side-by-side executive forensic documentation paired with high-concept narrative literature' }
      ],
      borderThemes: [
        { id: 'gilded-gold', name: 'Gilded Executive Gold', borderClass: 'border-amber-500/70 shadow-amber-950/50' },
        { id: 'emerald-terminal', name: 'Emerald Cyber-Ledger', borderClass: 'border-emerald-500/70 shadow-emerald-950/50' },
        { id: 'imperial-obsidian', name: 'Imperial Obsidian & Indigo', borderClass: 'border-indigo-500/70 shadow-indigo-950/50' },
        { id: 'cyber-neon', name: 'Cyberpunk Multi-Bank Blue', borderClass: 'border-cyan-500/70 shadow-cyan-950/50' },
        { id: 'sovereign-platinum', name: 'Sovereign Platinum & Rose', borderClass: 'border-rose-500/70 shadow-rose-950/50' }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST /api/epic-stories/generate
// Generates the comprehensive report or narrative using Gemini 3.8 Flash
epicStoriesRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const {
      feedId,
      customData,
      mode = 'all', // 'professional' | 'narrative' | 'all'
      borderStyle = 'gilded-gold',
      customPrompt = '',
      focusEntity = 'Kronos Apex Financial OS & Global Banking Network'
    } = req.body;

    // Resolve transactions data
    let selectedFeed = DEFAULT_BANK_FEEDS.find(f => f.id === feedId);
    let transactionsToAnalyze = selectedFeed ? selectedFeed.transactions : null;

    if (customData) {
      if (Array.isArray(customData)) {
        transactionsToAnalyze = customData;
      } else if (typeof customData === 'string') {
        try {
          const parsed = JSON.parse(customData);
          transactionsToAnalyze = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          transactionsToAnalyze = [{ rawText: customData }];
        }
      }
    }

    if (!transactionsToAnalyze && DEFAULT_BANK_FEEDS[0]) {
      selectedFeed = DEFAULT_BANK_FEEDS[0];
      transactionsToAnalyze = selectedFeed.transactions;
    }

    const dataPayloadString = JSON.stringify(transactionsToAnalyze, null, 2);
    const systemContext = getSystemDataSummary();

    let systemInstruction = `You are the Principal Chief Financial Officer, Lead Forensic Ledger Auditor, and Grand Mythic Financial Chronicler of the Kronos Apex Financial Operating System.
You possess profound mastery of international banking (Fedwire, CHIPS, SWIFT MT103, ISO 20022 camt.053/pacs.008), corporate accounting (GAAP/IFRS, Chart of Accounts, Double-Entry Reconciliations), and high-literature prose storytelling.`;

    let userPrompt = '';

    if (mode === 'professional') {
      userPrompt = `Generate a rigorous, C-Suite Professional Forensic Audit & Financial Report for the provided bank transaction dataset.
Structure the report strictly with the following sections in pristine Markdown with structured tables and bold callouts:

# 🏛️ EXECUTIVE FORENSIC AUDIT & TREASURY REPORT
**Target Entity:** ${focusEntity}
**Audit Date:** ${new Date().toISOString().split('T')[0]}
**Standards:** ISO 20022 Compliance, GAAP / IFRS Section 404 Certification

---

## 1. Executive Summary & Liquidity Overview
- Detailed analysis of cash flow velocity, total debits, total credits, and net liquidity movement.
- High-level risk assessment and regulatory posture.

## 2. Forensic Transaction Ledger Breakdown
Provide a structured Markdown table summarizing every transaction:
| Reference ID | Timestamp | Counterparty & Route | Type | Nominal Value | Audit Status | Forensic Notes |

## 3. Variance & Counterparty Risk Matrix
- Assessment of each counterparty (e.g., clearing houses, custodial trusts, cloud infrastructure providers).
- Operational risk flags, settlement latency, and fee slippage analysis.

## 4. Chart of Accounts & General Ledger Impact
- Specific ledger journal entry recommendations (Debits vs Credits).
- EBITDA and Balance Sheet working capital implications.

## 5. Compliance, AML / Sanctions & Final Certification
- Formal certification statement from the Treasury & Risk Committee.

User customization notes: ${customPrompt || 'None provided.'}

TRANSACTION DATASET:
${dataPayloadString}
`;
    } else if (mode === 'narrative') {
      userPrompt = `Compose an Epic, Sweeping Financial Saga and High-Stakes Narrative Chronicle based on the provided bank transactions.
Transform the cold ledger numbers into a cinematic, grand literary odyssey—capturing the suspense of multi-million dollar wires, the sovereign stakes of liquidity clearing, the clash of institutional titans, and the subterranean algorithmic architectures.

Structure the story into:
# ⚡ THE CHRONICLES OF LIQUIDITY: AN EPIC FINANCIAL SAGA
*A Narrative Opus on the Sovereign Movement of Capital*

---

## Prologue: The Whisper in the Wire
Set the grand stage: the server racks humming in Canary Wharf, Wall Street, and the cloud data vaults, where algorithms breathe in microseconds.

## Chapter I: The Outbound Titan ($4.2M Odyssey)
Detail the dramatic journey of the largest outbound movement. Paint the tension of treasury officers, cryptographic keys, and the weight of sovereign settlement.

## Chapter II: The Confluence of Shadows & Counterparties
Introduce the rival networks, the clearing mechanisms, the unexpected credits, and the tactical chess game between banks, escrow custodians, and AI agents.

## Chapter III: The Ledger of Destiny
How every cent reconciled, the final stroke of the double-entry book, and what this financial passage means for the destiny of the enterprise.

## Epilogue: The Immutable Horizon
A stirring, poetic reflection on money, code, and sovereign trust.

User customization notes: ${customPrompt || 'None provided.'}

TRANSACTION DATASET:
${dataPayloadString}
`;
    } else {
      // mode === 'all'
      userPrompt = `Create a DUAL COMPREHENSIVE OMNIBUS: A full C-Suite Professional Audit Report followed by an Epic High-Fantasy Financial Narrative Chronicle based on the provided bank transaction data.

Include both complete perspectives:

PART I: 🏛️ EXECUTIVE FORENSIC AUDIT & TREASURY REPORT
(With formal Executive Summary, Structured Markdown Transaction Ledger Table, Risk Matrix, Chart of Accounts Journal Entries, and C-Suite Certification)

---
***

PART II: ⚡ THE CHRONICLES OF LIQUIDITY: AN EPIC FINANCIAL SAGA
(With dramatic literary chapters, high-tension wire transfers, institutional character drama, and sweeping prose capturing the soul of sovereign money and algorithmic capital)

User customization notes: ${customPrompt || 'None provided.'}

TRANSACTION DATASET:
${dataPayloadString}

SYSTEM CONTEXT:
${systemContext.slice(0, 1000)}
`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: mode === 'narrative' ? 0.85 : 0.4,
      },
    });

    const generatedText = response.text || 'Failed to generate report.';

    res.json({
      success: true,
      mode,
      borderStyle,
      report: generatedText,
      feedId: selectedFeed?.id || 'custom',
      feedName: selectedFeed?.name || 'Custom Ingested Transaction Batch',
      transactionCount: Array.isArray(transactionsToAnalyze) ? transactionsToAnalyze.length : 1,
      generatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error generating epic story:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Gemini API call failed',
      fallbackReport: `# 🏛️ Executive Fallback Report\nAn error occurred while generating via Gemini API: ${err.message}. Please check your GEMINI_API_KEY.`
    });
  }
});

// 3. POST /api/epic-stories/chat
// Dedicated interactive chatbot endpoint that knows the entire dataset and story context
epicStoriesRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], currentData, mode = 'all' } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const systemInstruction = `You are the Kronos Sovereign Financial Chatbot and Epic Financial Chronicler.
You have access to all bank transactions, QuickBooks General Ledger accounts, Citi Open Banking APIs, ISO 20022 payment specifications, and the entire Kronos Apex architecture.
When the user asks for financial audits, provide crisp tables, numbers, and forensic precision.
When the user asks for stories, tales, legends, or narratives, weave glorious, epic, long-form high-drama tales with rich vocabulary and heroic metaphors.
Always maintain the sovereign, ultra-competent aesthetic of a Wall Street Managing Director paired with a master storyteller.`;

    // Format conversation history for Gemini
    const contents: any[] = [];

    // Add context about active bank data if provided
    if (currentData) {
      contents.push({
        role: 'user',
        parts: [{ text: `[SYSTEM CONTEXT: Active Bank Dataset Loaded]\n${JSON.stringify(currentData, null, 2)}` }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: `Understood. I have fully ingested the active bank transactions and ledger data. I am ready to conduct forensic auditing or tell epic chronicles.` }]
      });
    }

    // Add recent dialogue history
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        if (turn.role && turn.text) {
          contents.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.text }]
          });
        }
      }
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'No response generated.';

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error in epic stories chat:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      reply: `Sovereign Engine Error: ${err.message}. Please verify the Gemini API key.`
    });
  }
});
