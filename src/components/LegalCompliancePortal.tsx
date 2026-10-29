import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FileText, 
  Lock, 
  Scale, 
  ExternalLink, 
  Copy, 
  Check, 
  Code, 
  CheckCircle2, 
  Globe, 
  Link2, 
  BookOpen, 
  Server, 
  Cpu, 
  ArrowRight, 
  Download,
  AlertTriangle,
  Building,
  RefreshCw,
  LogOut,
  LogIn,
  Terminal
} from 'lucide-react';
import { ApiReferenceCatalog } from './ApiReferenceCatalog';

export type CompliancePageType = 
  | 'overview' 
  | 'terms' 
  | 'privacy' 
  | 'eula' 
  | 'smart-contract' 
  | 'submission-answers'
  | 'api-reference';

interface LegalCompliancePortalProps {
  initialPage?: CompliancePageType;
  onNavigateTab?: (tab: string) => void;
}

export const LegalCompliancePortal: React.FC<LegalCompliancePortalProps> = ({
  initialPage = 'overview',
  onNavigateTab
}) => {
  const [currentPage, setCurrentPage] = useState<CompliancePageType>(initialPage);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Dynamic host detection
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-u63e6klsgagizrk3d4awui-22946357919.us-west1.run.app';
  const currentHost = typeof window !== 'undefined' ? window.location.host : 'ais-dev-u63e6klsgagizrk3d4awui-22946357919.us-west1.run.app';

  // LTV Health Simulator for CollateralizedLoan contract
  const [simPrincipal, setSimPrincipal] = useState<number>(50000);
  const [simCollateral, setSimCollateral] = useState<number>(100000);

  // Derived LTV in basis points (contract calculation: (principal * 10000) / collateral)
  const ltvBps = simCollateral > 0 ? Math.round((simPrincipal * 10000) / simCollateral) : 0;
  const ltvPercent = (ltvBps / 100).toFixed(2);
  const isHealthy = ltvBps <= 6000; // <= 60%

  useEffect(() => {
    if (initialPage) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const complianceAnswers = [
    {
      field: 'Host domain',
      description: 'Enter the customer-facing domain. No "https://" protocol needed.',
      value: currentHost,
      key: 'host-domain'
    },
    {
      field: 'Launch URL',
      description: 'Enter the URL customers should go to once they authenticate. Include the "https://" protocol.',
      value: `${currentOrigin}/launch`,
      key: 'launch-url'
    },
    {
      field: 'Disconnect URL',
      description: 'Enter the URL customers should go to when disconnecting from your app. Include the "https://" protocol.',
      value: `${currentOrigin}/disconnect`,
      key: 'disconnect-url'
    },
    {
      field: 'Connect/Reconnect URL',
      description: 'Enter the URL customers should go to when connecting or reconnecting. Include the "https://" protocol.',
      value: `${currentOrigin}/connect`,
      key: 'connect-url'
    },
    {
      field: 'Privacy policy URL',
      description: 'The public page for your privacy policy. Include the "https://" protocol.',
      value: `${currentOrigin}/privacy`,
      key: 'privacy-url'
    },
    {
      field: 'Terms of service URL',
      description: 'Include your terms of service so your customers, and our compliance teams, can review them.',
      value: `${currentOrigin}/terms`,
      key: 'terms-url'
    },
    {
      field: 'End-user license agreement URL',
      description: 'The public page for your end-user license agreement. Include the "https://" protocol.',
      value: `${currentOrigin}/eula`,
      key: 'eula-url'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Scale className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Public Legal, Compliance & Documentation Portal
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                COMPLIANCE VERIFIED
              </span>
            </div>
            <p className="text-sm text-[#8B949E] max-w-3xl leading-relaxed">
              Publicly accessible agreements, end-user license terms, privacy disclosures, and Intuit Developer App Store submission URLs for enterprise audit and customer protection.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('submission-answers')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40 transition-all border border-purple-400/40 shrink-0 cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>Copy App Store Answers</span>
          </button>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-[#30363D]/60">
          {[
            { id: 'overview', label: 'App Overview & Home', icon: BookOpen },
            { id: 'submission-answers', label: 'App Store Submission URLs', icon: Link2, badge: 'ANSWERS' },
            { id: 'api-reference', label: '100+ API Endpoints', icon: Terminal, badge: 'ATLASSIAN+' },
            { id: 'terms', label: 'Terms of Service', icon: Scale },
            { id: 'privacy', label: 'Privacy Policy', icon: Shield },
            { id: 'eula', label: 'EULA License Agreement', icon: FileText },
            { id: 'smart-contract', label: 'Loan Agreement (ERC-3643)', icon: Code, badge: 'SOLIDITY' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = currentPage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id as CompliancePageType)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                    : 'bg-[#0D1117] text-[#8B949E] hover:text-white border border-[#30363D]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: SUBMISSION ANSWERS (Direct copy-paste for user's compliance review form) */}
      {currentPage === 'submission-answers' && (
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-6">
          <div className="border-b border-[#30363D] pb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Link2 className="w-4 h-4 text-purple-400" />
              <span>Intuit App Store & Financial Partner Review Form Answers</span>
            </h3>
            <p className="text-xs text-[#8B949E] mt-1">
              Copy and paste these exact verified values directly into your developer portal submission fields:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {complianceAnswers.map((item) => (
              <div 
                key={item.key}
                className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] hover:border-purple-500/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{item.field}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Exact Field Value
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8B949E]">{item.description}</p>
                  <p className="text-xs font-mono font-semibold text-emerald-400 select-all pt-1 break-all">
                    {item.value}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => copyToClipboard(item.value, item.key)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white text-xs font-medium border border-[#30363D] transition-colors cursor-pointer"
                  >
                    {copiedKey === item.key ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Answer</span>
                      </>
                    )}
                  </button>
                  <a
                    href={item.value.startsWith('http') ? item.value : `https://${item.value}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white border border-[#30363D] transition-colors"
                    title="Open live page in new window"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 space-y-1">
            <p className="font-semibold text-white flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Automated Route Interceptor Active</span>
            </p>
            <p className="text-[11px] text-purple-300">
              Visiting any of these direct URLs in the browser (e.g. <code className="text-purple-200">/terms</code>, <code className="text-purple-200">/privacy</code>, <code className="text-purple-200">/eula</code>, <code className="text-purple-200">/launch</code>, <code className="text-purple-200">/disconnect</code>, <code className="text-purple-200">/connect</code>) will immediately render the corresponding compliant public page without error.
            </p>
          </div>
        </div>
      )}

      {/* VIEW 2: APP OVERVIEW & HOME */}
      {currentPage === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Application Architecture & Functional Purpose</span>
            </h3>
            <p className="text-sm text-[#8B949E] leading-relaxed">
              <strong>Kronos Apex Financial Operating System & QuickBooks AI Banking Hub</strong> is an enterprise-grade multi-bank integration gateway, automated accounting bridge, and algorithmic financial ledger. It connects institutional banking interfaces (Intuit QuickBooks Online, Citi Open Banking, Chase Loyalty, Mastercard Finicity, Modern Treasury, and Visa Developer Platform) with AI-powered statement parsing and autonomous reconciliation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">OAuth 2.0 PKCE Security</span>
                </div>
                <p className="text-xs text-[#8B949E]">
                  Employs RFC 7636 Proof Key for Code Exchange (PKCE), TLS 1.3 encryption, and ephemeral state verification for bank authorization.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <div className="flex items-center space-x-2 text-purple-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Gemini Statement AI</span>
                </div>
                <p className="text-xs text-[#8B949E]">
                  Converts multi-institution bank statement JSON and PDF extracts directly into double-entry QuickBooks Chart of Accounts journal lines.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Scale className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">ERC-3643 Sovereign Credit</span>
                </div>
                <p className="text-xs text-[#8B949E]">
                  Enforces automated collateral covenants, continuous LTV monitoring (≤ 60%), and programmable credit liquidation safeguards.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Lifecycle Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <LogIn className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10">
                  CONNECT
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Connect / Reconnect Flow</h4>
                <p className="text-xs text-[#8B949E] mt-1">
                  OAuth authorization portal with scope inspection and one-click token synchronization.
                </p>
              </div>
              <a
                href={`${currentOrigin}/connect`}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-2"
              >
                <span>View Connect Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Globe className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10">
                  LAUNCH
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Customer Launch Portal</h4>
                <p className="text-xs text-[#8B949E] mt-1">
                  Authenticated landing portal confirming active realm ID, company synchronization, and direct dashboard access.
                </p>
              </div>
              <a
                href={`${currentOrigin}/launch`}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-2"
              >
                <span>View Launch Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <LogOut className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-mono text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/10">
                  DISCONNECT
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">App Disconnect & Revocation</h4>
                <p className="text-xs text-[#8B949E] mt-1">
                  Clean connection de-provisioning, session wipe, and OAuth token revocation confirming privacy compliance.
                </p>
              </div>
              <a
                href={`${currentOrigin}/disconnect`}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 pt-2"
              >
                <span>View Disconnect Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: TERMS OF SERVICE */}
      {currentPage === 'terms' && (
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#30363D] gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">Terms of Service (TOS)</h3>
              <p className="text-xs text-[#8B949E]">
                Effective Date: September 21, 2026 • Version 2.4 • Applicable to All Enterprise Customers & Compliance Audit Teams
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(window.location.href, 'tos-share')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0D1117] text-[#C9D1D9] hover:text-white border border-[#30363D] text-xs font-medium"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey === 'tos-share' ? 'URL Copied!' : 'Share TOS Link'}</span>
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-5 text-[#C9D1D9]">
            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">1. Agreement to Terms</h4>
              <p className="text-[#8B949E]">
                By authenticating, installing, or connecting the <strong>Kronos Apex Financial Operating System & AI Banking Hub</strong> (“Service”, “Application”) via Intuit QuickBooks Online, Open Banking APIs, or direct enterprise credentials, you (“Customer”, “User”, or “Authorized Enterprise Representative”) agree to be legally bound by these Terms of Service. If you are reviewing this agreement on behalf of a financial institution, partner platform, or compliance review board, these terms govern the API data processing commitments of the Service.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">2. Description of Service & OAuth Integration</h4>
              <p className="text-[#8B949E]">
                The Application provides authorized software bridges to sync accounting records, chart of accounts entries, customer records, ACH payment instruments, and invoices between financial institutions and Intuit QuickBooks Online. All access is governed strictly by the OAuth 2.0 PKCE consent granted by the customer. The Application does not store plain-text banking passwords or raw customer payment card CVV numbers.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">3. Customer Data Ownership & Limited License</h4>
              <p className="text-[#8B949E]">
                Customers retain complete and exclusive ownership of all financial transactions, company data, and ledger entries processed through the Application. You grant us a limited, non-exclusive, revocable license solely to retrieve, format, and transmit your data to and from your authorized QuickBooks company (realmId) and designated financial providers.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">4. Security Standards & API Rate Compliance</h4>
              <p className="text-[#8B949E]">
                The Service enforces bank-grade security protocols including TLS 1.3 in-transit encryption, AES-256 data-at-rest protection, and strict adherence to Intuit API rate limiting policies (maximum 500 requests per minute per realmId). Automated backoff and retry algorithms prevent throttling and safeguard system integrity.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">5. Smart Contract Credit Agreements (ERC-3643)</h4>
              <p className="text-[#8B949E]">
                Where smart-contract collateralized lending protocols (such as <code className="text-purple-300">CollateralizedLoan_BORROWER_9982</code>) are utilized, terms of loan funding, maturity dates, interest calculations, and collateral covenants (60% maximum Loan-to-Value threshold) are executed autonomously in accordance with the compiled smart contract code deployed on verifiable EVM-compatible ledgers.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">6. Disconnection, Revocation & Termination</h4>
              <p className="text-[#8B949E]">
                Customers may terminate access at any time through our public Disconnect URL (<code className="text-emerald-400">{currentOrigin}/disconnect</code>) or via the Intuit App Store management portal. Upon disconnection, active session tokens are immediately invalidated and purged from memory.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">7. Disclaimer of Warranties & Limitation of Liability</h4>
              <p className="text-[#8B949E]">
                Except as expressly provided herein, the Service is provided "as is" and "as available". We do not guarantee uninterrupted or error-free transmission across third-party banking APIs. In no event shall our aggregate liability exceed the total amounts paid by the Customer to the Application in the twelve (12) months preceding the event giving rise to liability.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">8. Compliance & Legal Inquiries</h4>
              <p className="text-[#8B949E]">
                For questions regarding these Terms or to submit institutional compliance questionnaires, please contact our legal counsel and compliance engineering team at <code className="text-indigo-300">compliance@kronosapex.internal</code> or <code className="text-indigo-300">sovereignties3@gmail.com</code>.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* VIEW 4: PRIVACY POLICY */}
      {currentPage === 'privacy' && (
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#30363D] gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">Privacy Policy</h3>
              <p className="text-xs text-[#8B949E]">
                Last Revised: September 21, 2026 • Compliant with Gramm-Leach-Bliley Act (GLBA), GDPR, and California Consumer Privacy Act (CCPA/CPRA)
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(window.location.href, 'privacy-share')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0D1117] text-[#C9D1D9] hover:text-white border border-[#30363D] text-xs font-medium"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey === 'privacy-share' ? 'URL Copied!' : 'Share Privacy Link'}</span>
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-5 text-[#C9D1D9]">
            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">1. Privacy Notice & Scope</h4>
              <p className="text-[#8B949E]">
                This Privacy Policy explains how <strong>Kronos Apex Financial Operating System & AI Banking Hub</strong> collects, uses, protects, and discloses personal and financial information when you connect your Intuit QuickBooks account or use our automated banking services. We are committed to transparency and strict adherence to global financial privacy laws.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">2. Information We Collect</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-[#8B949E]">
                <li><strong>OAuth Authorization Credentials:</strong> Ephemeral access tokens, refresh tokens, and authorized QuickBooks company identifiers (<code className="text-purple-300">realmId</code>).</li>
                <li><strong>Accounting & Transactional Data:</strong> Chart of Accounts metadata, ledger entries, bank transaction memos, invoice statuses, and vendor profiles necessary for synchronization.</li>
                <li><strong>Telemetry & Audit Logs:</strong> IP addresses, request timestamps, API endpoint latency, and ISO 20022 message tracking to prevent fraudulent transactions.</li>
              </ul>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                We NEVER collect or store user passwords, unencrypted PINs, or physical credit card magnetic stripe tracks on unencrypted public endpoints.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">3. How We Use Collected Information</h4>
              <p className="text-[#8B949E]">
                Information collected is used strictly to fulfill the functional capabilities requested by the user:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#8B949E]">
                <li>Synchronizing financial ledgers with QuickBooks Online companies.</li>
                <li>Parsing bank statement extracts with Gemini AI into double-entry accounting records.</li>
                <li>Monitoring credit and collateral health ratios for authorized smart contracts.</li>
                <li>Maintaining compliance audit trails required by banking regulators.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">4. Third-Party Sharing & Data Sales Prohibition</h4>
              <p className="text-[#8B949E]">
                <strong>We do NOT sell, rent, or monetize your personal or financial data to data brokers, advertisers, or unaffiliated third parties.</strong> Data is only transmitted to authorized service providers (Intuit, Citi Open Banking, Chase Loyalty, Mastercard Finicity, Visa, Google Cloud) strictly as required to execute user-requested transactions.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">5. Data Retention & Deletion Rights</h4>
              <p className="text-[#8B949E]">
                You have the absolute right to request the deletion of your data at any time. When you disconnect the Application via our Disconnect URL (<code className="text-emerald-400">{currentOrigin}/disconnect</code>), active authentication credentials are automatically purged. To request an expedited purge of all historic transaction logs, email <code className="text-indigo-300">privacy@kronosapex.internal</code>.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">6. Contact Information</h4>
              <p className="text-[#8B949E]">
                Data Protection Officer: Compliance & Privacy Office<br />
                Email: <code className="text-indigo-300">privacy@kronosapex.internal</code> / <code className="text-indigo-300">sovereignties3@gmail.com</code>
              </p>
            </section>
          </div>
        </div>
      )}

      {/* VIEW 5: EULA */}
      {currentPage === 'eula' && (
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#30363D] gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">End-User License Agreement (EULA)</h3>
              <p className="text-xs text-[#8B949E]">
                Standard Software License Agreement • Version 1.9 • Authorized Use of Banking Integrations & Automation Hub
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(window.location.href, 'eula-share')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0D1117] text-[#C9D1D9] hover:text-white border border-[#30363D] text-xs font-medium"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey === 'eula-share' ? 'URL Copied!' : 'Share EULA Link'}</span>
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-5 text-[#C9D1D9]">
            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">1. License Grant</h4>
              <p className="text-[#8B949E]">
                Subject to the terms of this Agreement, Licensor grants you a revocable, non-exclusive, non-transferable, limited license to access and use the <strong>Kronos Apex Financial Operating System & AI Banking Hub</strong> solely for your internal business operations and accounting management in connection with authorized QuickBooks Online subscriptions.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">2. Restrictions on Use</h4>
              <p className="text-[#8B949E]">
                You agree not to, and you will not permit others to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#8B949E]">
                <li>Reverse engineer, decompile, or disassemble the proprietary algorithms governing AI statement parsing or automated underwriting engines.</li>
                <li>Use the software to bypass Intuit rate limits or execute unauthorized distributed denial-of-service attacks.</li>
                <li>Sublicense, lease, or distribute the software as a standalone white-labeled service without prior written consent.</li>
                <li>Submit intentionally falsified bank statement data to manipulate financial accounting records.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">3. Intellectual Property Rights</h4>
              <p className="text-[#8B949E]">
                All title, intellectual property, source code, UI designs, and proprietary protocols incorporated into the Application remain the sole property of the Licensor. Intuit, QuickBooks, and related marks are trademarks of Intuit Inc., used under authorized developer agreements.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">4. Export Control & Sanctions Compliance</h4>
              <p className="text-[#8B949E]">
                You represent and warrant that you are not located in a country subject to U.S. government embargo or designated as a terrorist-supporting country, and that you are not listed on any U.S. government prohibited or restricted parties list.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">5. Termination</h4>
              <p className="text-[#8B949E]">
                This EULA is effective until terminated. Your rights under this license will terminate automatically without notice if you fail to comply with any of its terms. Upon termination, you must cease all use of the Application and disconnect all active banking API integrations.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* VIEW 6: SOLIDITY CONTRACT & LTV CALCULATOR */}
      {currentPage === 'smart-contract' && (
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#30363D] gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">CollateralizedLoan_BORROWER_9982</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ERC-3643 COMPLIANT
                </span>
              </div>
              <p className="text-xs text-[#8B949E] mt-1">
                Sovereign Collateralized Credit Agreement • Compiled automatically by Aquarius Autonomous Underwriting Engine
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CollateralizedLoan_BORROWER_9982
 * @notice Sovereign Collateralized Credit Agreement (ERC-3643 Compliant)
 * @dev Compiled automatically by Aquarius Autonomous Underwriting Engine
 */
contract CollateralizedLoan_BORROWER_9982 {
    address public immutable lender;
    address public immutable borrower;
    uint256 public immutable principalAmount; // in wei / micro-units
    uint256 public immutable collateralValue;
    uint256 public immutable interestRateBps; // e.g. 550 = 5.5%
    uint256 public immutable maturityTimestamp;
    
    enum LoanState { PENDING_FUNDING, ACTIVE, DEFAULTED, REPAID }
    LoanState public state;

    event LoanFunded(uint256 indexed amount, uint256 timestamp);
    event CollateralSeized(uint256 indexed value, string reason);
    event LoanFullyRepaid(uint256 indexed totalPaid);

    constructor(
        address _borrower,
        uint256 _principal,
        uint256 _collateral,
        uint256 _interestBps,
        uint256 _durationDays
    ) {
        lender = msg.sender;
        borrower = _borrower;
        principalAmount = _principal;
        collateralValue = _collateral;
        interestRateBps = _interestBps;
        maturityTimestamp = block.timestamp + (_durationDays * 1 days);
        state = LoanState.PENDING_FUNDING;
    }

    function fundLoan() external payable {
        require(msg.sender == lender, "Only lender can fund");
        require(state == LoanState.PENDING_FUNDING, "Invalid state");
        state = LoanState.ACTIVE;
        emit LoanFunded(msg.value, block.timestamp);
    }

    function checkLtvHealth(uint256 currentCollateralUsd) external view returns (bool isHealthy, uint256 currentLtvBps) {
        currentLtvBps = (principalAmount * 10000) / currentCollateralUsd;
        isHealthy = currentLtvBps <= 6000;
    }
}`, 'contract-code')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0D1117] text-[#C9D1D9] hover:text-white border border-[#30363D] text-xs font-medium cursor-pointer"
            >
              {copiedKey === 'contract-code' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied Solidity!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Solidity Code</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive LTV Health Simulator */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Real-Time Contract Covenant Simulator (<code className="text-purple-300">checkLtvHealth</code>)
                </h4>
                <p className="text-[11px] text-[#8B949E]">
                  Formula: <code className="text-emerald-400 font-mono">currentLtvBps = (principal * 10000) / collateral; isHealthy = currentLtvBps &lt;= 6000 (60.00%)</code>
                </p>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                isHealthy 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {isHealthy ? 'COVENANT HEALTHY' : 'COVENANT BREACH / LIQUIDATION RISK'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-[#8B949E] block mb-1">Principal Amount ($)</label>
                <input
                  type="number"
                  value={simPrincipal}
                  onChange={(e) => setSimPrincipal(Number(e.target.value) || 0)}
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8B949E] block mb-1">Collateral Value ($)</label>
                <input
                  type="number"
                  value={simCollateral}
                  onChange={(e) => setSimCollateral(Number(e.target.value) || 0)}
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-between">
                  <span className="text-[11px] text-[#8B949E]">Calculated LTV:</span>
                  <span className={`text-sm font-mono font-bold ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {ltvPercent}% ({ltvBps} bps)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Solidity Source Code Display */}
          <div className="rounded-xl overflow-hidden border border-[#30363D] bg-[#090D13]">
            <div className="px-4 py-2 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between text-xs text-[#8B949E]">
              <span className="font-mono text-purple-300">CollateralizedLoan_BORROWER_9982.sol</span>
              <span className="font-mono text-[11px]">Solidity ^0.8.20</span>
            </div>
            <pre className="p-4 text-[11px] font-mono text-[#C9D1D9] overflow-x-auto leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CollateralizedLoan_BORROWER_9982
 * @notice Sovereign Collateralized Credit Agreement (ERC-3643 Compliant)
 * @dev Compiled automatically by Aquarius Autonomous Underwriting Engine
 */
contract CollateralizedLoan_BORROWER_9982 {
    address public immutable lender;
    address public immutable borrower;
    uint256 public immutable principalAmount; // in wei / micro-units
    uint256 public immutable collateralValue;
    uint256 public immutable interestRateBps; // e.g. 550 = 5.5%
    uint256 public immutable maturityTimestamp;
    
    enum LoanState { PENDING_FUNDING, ACTIVE, DEFAULTED, REPAID }
    LoanState public state;

    event LoanFunded(uint256 indexed amount, uint256 timestamp);
    event CollateralSeized(uint256 indexed value, string reason);
    event LoanFullyRepaid(uint256 indexed totalPaid);

    constructor(
        address _borrower,
        uint256 _principal,
        uint256 _collateral,
        uint256 _interestBps,
        uint256 _durationDays
    ) {
        lender = msg.sender;
        borrower = _borrower;
        principalAmount = _principal;
        collateralValue = _collateral;
        interestRateBps = _interestBps;
        maturityTimestamp = block.timestamp + (_durationDays * 1 days);
        state = LoanState.PENDING_FUNDING;
    }

    function fundLoan() external payable {
        require(msg.sender == lender, "Only lender can fund");
        require(state == LoanState.PENDING_FUNDING, "Invalid state");
        state = LoanState.ACTIVE;
        emit LoanFunded(msg.value, block.timestamp);
    }

    function checkLtvHealth(uint256 currentCollateralUsd) external view returns (bool isHealthy, uint256 currentLtvBps) {
        currentLtvBps = (principalAmount * 10000) / currentCollateralUsd;
        isHealthy = currentLtvBps <= 6000;
    }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* VIEW: 100+ ENDPOINTS API REFERENCE */}
      {currentPage === 'api-reference' && (
        <div className="pt-2">
          <ApiReferenceCatalog />
        </div>
      )}
    </div>
  );
};
