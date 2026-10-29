import React, { useState, useEffect } from 'react';
import { Navbar, MainTabType } from './components/Navbar';
import { Step1Auth } from './components/Step1Auth';
import { Step2Tokens } from './components/Step2Tokens';
import { Step3Apis } from './components/Step3Apis';
import { Step4Refresh } from './components/Step4Refresh';
import { AutonomousSync } from './components/AutonomousSync';
import { CodeGenerator } from './components/CodeGenerator';
import { ScopeReference } from './components/ScopeReference';
import { VercelGuideModal } from './components/VercelGuideModal';
import { AiBankingIngest } from './components/AiBankingIngest';
import QuickBooksCommandBridge from './components/QuickBooksCommandBridge';
import { QuickBooksFormBuilder } from './components/QuickBooksFormBuilder';
import DeveloperPortal from './components/DeveloperPortal';
import DocumentationHub from './components/DocumentationHub';
import { CustomCurlExecutor } from './components/CustomCurlExecutor';
import ChaseLoyaltyConsole from './components/ChaseLoyaltyConsole';
import { FinicityConsole } from './components/FinicityConsole';
import { ModernTreasuryConsole } from './components/ModernTreasuryConsole';
import { AutonomousBridgeLedger } from './components/AutonomousBridgeLedger';
import { AccountingCategoriesHub } from './components/AccountingCategoriesHub';
import PayPalConsole from './components/PayPalConsole';
import { AiBuyerConsole } from './components/AiBuyerConsole';
import { WesternUnionPsd2Console } from './components/WesternUnionPsd2Console';
import { AzureDeploymentsHub } from './components/AzureDeploymentsHub';
import { AzureMasterDeployer } from './components/AzureMasterDeployer';
import { EnterpriseCredentialsHub } from './components/EnterpriseCredentialsHub';
import { ExpansionPipelineUI } from './components/ExpansionPipelineUI';
import { EnvManager } from './components/EnvManager';
import { MarqetaConsole } from './components/MarqetaConsole';
import { NewRelicConsole } from './components/NewRelicConsole';
import { CitiOpenBankingConsole } from './components/CitiOpenBankingConsole';
import { CitiOpenApiWorkbench } from './components/CitiOpenApiWorkbench';
import { SignWellConsole } from './components/SignWellConsole';
import { AdobeCommerceConsole } from './components/AdobeCommerceConsole';
import { AuthorizeNetConsole } from './components/AuthorizeNetConsole';
import { ApiCakeStudio } from './components/ApiCakeStudio';
import { GitHubDeployerConsole } from './components/GitHubDeployerConsole';
import { AzureDeploymentVault } from './components/AzureDeploymentVault';
import { OCallaghanConsole } from './components/OCallaghanConsole';
import { AmazonApsConsole } from './components/AmazonApsConsole';
import { MetaMaskEthereumConsole } from './components/MetaMaskEthereumConsole';
import { IntegratedAppsHub } from './components/IntegratedAppsHub';
import { CardCatalogVault } from './components/CardCatalogVault';
import { McpServerHub } from './components/McpServerHub';
import { KrispZapierHub } from './components/KrispZapierHub';
import { ExtractedAppsHub } from './components/ExtractedAppsHub';
import { StreamOpenApiHub } from './components/StreamOpenApiHub';
import { TreasuryXsdConsole } from './components/TreasuryXsdConsole';
import { StripeAnalyticsDashboard } from './components/StripeAnalyticsDashboard';
import { HousePdfAcquisitionHub } from './components/HousePdfAcquisitionHub';
import { ConfluentKafkaHub } from './components/ConfluentKafkaHub';
import { HundredModulesHub } from './components/HundredModulesHub';
import { ModernTreasuryGraphqlHub } from './components/ModernTreasuryGraphqlHub';
import { OrchestratorHub } from './components/OrchestratorHub';
import { GoogleAttributesHub } from './components/GoogleAttributesHub';
import { GcpBlockchainViewer } from './components/GcpBlockchainViewer';
import { AzureCsvInspector } from './components/AzureCsvInspector';
const Jocall3PortfolioApp = React.lazy(() => import('../packages/jocall3-portfolio-explorer/App'));
import { UserProfilePage } from './components/UserProfilePage';
import { ZipAppRendererAiPilot } from './components/ZipAppRendererAiPilot';
import { VisaSuiteConsole } from './components/VisaSuiteConsole';
import { CitiPartnerLoginConsole } from './components/CitiPartnerLoginConsole';
import { Web3Browser } from './components/Web3Browser';
import { GoogleDriveBrowser } from './components/GoogleDriveBrowser';
import { GoogleWorkspaceHub } from './components/GoogleWorkspaceHub';
import { GoogleSheetsWorkspace } from './components/google/GoogleSheetsWorkspace';
import { GoogleDocsWorkspace } from './components/google/GoogleDocsWorkspace';
import { GoogleSlidesWorkspace } from './components/google/GoogleSlidesWorkspace';
import { GoogleMailWorkspace } from './components/google/GoogleMailWorkspace';
import { GoogleDriveWorkspace } from './components/google/GoogleDriveWorkspace';
import { GoogleVideoWorkspace } from './components/google/GoogleVideoWorkspace';
import { GoogleKeepWorkspace } from './components/google/GoogleKeepWorkspace';
import { GoogleTasksWorkspace } from './components/google/GoogleTasksWorkspace';
import { GoogleCalendarWorkspace } from './components/google/GoogleCalendarWorkspace';
import { GoogleFormsWorkspace } from './components/google/GoogleFormsWorkspace';
import { GoogleClassroomWorkspace } from './components/google/GoogleClassroomWorkspace';
import { GoogleMapsWorkspace } from './components/google/GoogleMapsWorkspace';
import { GoogleCloudSqlWorkspace } from './components/google/GoogleCloudSqlWorkspace';
import { GoogleColabWorkspace } from './components/GoogleColabWorkspace';
import { WorkbenchGenerator } from './components/WorkbenchGenerator';
import { SovereignSingularityConsole } from './components/SovereignSingularityConsole';
import { VsCodeConsole } from './components/VsCodeConsole';
import { CoinbaseCdpConsole } from './components/CoinbaseCdpConsole';
import { CoinbaseCdpDocs } from './components/CoinbaseCdpDocs';
import { JamesBurveloConsortiumHub } from './components/JamesBurveloConsortiumHub';
import { KronosFoundationModelHub } from './components/KronosFoundationModelHub';
import { JesterMode2Console } from './components/JesterMode2Console';
import { LegalCompliancePortal, CompliancePageType } from './components/LegalCompliancePortal';
import { OAuthLifecyclePages } from './components/OAuthLifecyclePages';
import { CsvDataStudio } from './components/CsvDataStudio';
import { ArticlesVaultHub } from './components/ArticlesVaultHub';
import { SalesforceConsole } from './components/SalesforceConsole';
import { KrogerCitibankConsole } from './components/KrogerCitibankConsole';
import { AstraDbConsole } from './components/AstraDbConsole';
import { FullViewCustomerStateHub } from './components/FullViewCustomerStateHub';
import { GoogleSamlHub } from './components/GoogleSamlHub';
import { UberIntegrationConsole } from './components/UberIntegrationConsole';
import { AiDataPlatformConsole } from './components/AiDataPlatformConsole';
import { DashboardSlideGrid } from './components/DashboardSlideGrid';
import { EpicStoriesModule } from './components/EpicStoriesModule';
import { ExpertModeConsole } from './components/ExpertModeConsole';
import { sovereignRamEnclave } from './utils/sovereignRamEnclave';
import { IntuitConfig, TokenResponse } from './types';
import { apiFetch } from './utils/apiClient';
import { sanitizeRealmId } from './utils/realmSanitizer';
import { CheckCircle2, ChevronRight, RefreshCw, Trash2, Shield, PlayCircle, Code2, BookOpen, Layers, Zap, Sparkles, Plus, Terminal, Key, ShoppingCart, Globe, Activity, Wallet, Coins, User, Bot, CreditCard, UploadCloud, Compass, FolderGit2, Mail, FileSpreadsheet, FileText, FolderOpen, Video, Presentation, Bookmark, CheckSquare, Calendar, FormInput, GraduationCap, MapPin, Database, FileCheck2, FileCode, Building2, Scale, Cloud, Car, Search } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  tabName?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[AppErrorBoundary] Caught render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-[#161B22] border border-rose-500/40 rounded-2xl text-center space-y-4 my-6 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl">
            ⚠️
          </div>
          <h3 className="text-base font-bold text-white">
            Component Error in {this.props.tabName || 'Module'}
          </h3>
          <p className="text-xs text-rose-300 font-mono bg-rose-950/40 p-3 rounded-xl border border-rose-500/30 max-w-xl mx-auto break-words">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReset) this.props.onReset();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Recover & Reload Component
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-gray-300 text-xs font-medium rounded-xl border border-[#30363d] transition cursor-pointer"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTabType>('sovereign-singularity');
  const [config, setConfig] = useState<IntuitConfig | null>(null);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
  
  // Direct Public URL routing for Compliance & Lifecycle Pages
  const [directRoute, setDirectRoute] = useState<'terms' | 'privacy' | 'eula' | 'smart-contract' | 'compliance' | 'launch' | 'disconnect' | 'connect' | null>(null);

  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/terms')) setDirectRoute('terms');
      else if (path.includes('/privacy')) setDirectRoute('privacy');
      else if (path.includes('/eula')) setDirectRoute('eula');
      else if (path.includes('/smart-contract')) setDirectRoute('smart-contract');
      else if (path.includes('/compliance') || path.includes('/answers')) setDirectRoute('compliance');
      else if (path.includes('/launch')) setDirectRoute('launch');
      else if (path.includes('/disconnect')) setDirectRoute('disconnect');
      else if (path.includes('/connect') || path.includes('/reconnect')) setDirectRoute('connect');
      else setDirectRoute(null);
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);
  
  // Workflow States
  const [authCode, setAuthCode] = useState('');
  const [realmId, setRealmId] = useState('');
  const [csrfState, setCsrfState] = useState('');
  const [tokens, setTokens] = useState<TokenResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [ingestPayload, setIngestPayload] = useState<string | null>(null);

  // Restore stored tokens on initial client load from Sovereign RAM Enclave
  useEffect(() => {
    try {
      const saved = sovereignRamEnclave.getItem('qbo_active_session_tokens');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.access_token) {
          setTokens(parsed);
          if (parsed.realmId) setRealmId(sanitizeRealmId(parsed.realmId));
          setCurrentStep(3);
        }
      }
    } catch (e) {}
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await apiFetch<IntuitConfig>('/api/intuit/config');
      if (res.ok && res.data) {
        setConfig(res.data);
        if (res.data.activeTokens?.realmId) {
          setRealmId(sanitizeRealmId(res.data.activeTokens.realmId));
        }
      }
      // If tokens are still not set in client state, pull server active session tokens
      if (!tokens) {
        const tokRes = await apiFetch<{ success: boolean; tokens: TokenResponse }>('/api/intuit/session-tokens');
        if (tokRes.ok && tokRes.data?.tokens) {
          setTokens(tokRes.data.tokens);
          if (tokRes.data.tokens.realmId) {
            setRealmId(sanitizeRealmId(tokRes.data.tokens.realmId));
          }
          try {
            sovereignRamEnclave.setItem('qbo_active_session_tokens', JSON.stringify(tokRes.data.tokens));
          } catch (e) {}
        }
      }
    } catch (e) {
      console.error('Error fetching config:', e);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleCodeAcquired = (code: string, parsedRealm: string, state?: string) => {
    setAuthCode(code);
    const cleanRealm = sanitizeRealmId(parsedRealm);
    if (cleanRealm) setRealmId(cleanRealm);
    if (state) setCsrfState(state);
    setCurrentStep(2);
  };

  const handleTokensAcquired = (tokenData: TokenResponse) => {
    setTokens(tokenData);
    const cleanRealm = sanitizeRealmId(tokenData.realmId);
    if (cleanRealm) setRealmId(cleanRealm);
    setCurrentStep(3);
    try {
      sovereignRamEnclave.setItem('qbo_active_session_tokens', JSON.stringify(tokenData));
    } catch (e) {}
    fetchConfig();
  };

  const handleTokensRefreshed = (newTokens: TokenResponse) => {
    setTokens((prev) => {
      const merged = prev ? { ...prev, ...newTokens } : newTokens;
      try {
        sovereignRamEnclave.setItem('qbo_active_session_tokens', JSON.stringify(merged));
      } catch (e) {}
      return merged;
    });
    fetchConfig();
  };

  const handleClearSession = async () => {
    try {
      await apiFetch('/api/intuit/clear-session', { method: 'POST' });
      setAuthCode('');
      setTokens(null);
      setCurrentStep(1);
      try {
        sovereignRamEnclave.removeItem('qbo_active_session_tokens');
        sovereignRamEnclave.removeItem('qbo_last_autonomous_sync');
      } catch (e) {}
      fetchConfig();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#C9D1D9] flex flex-col font-sans selection:bg-[#238636]/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        onRefreshConfig={fetchConfig}
        onOpenVercelGuide={() => setIsVercelModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {directRoute ? (
          <div className="space-y-6">
            <div className="bg-[#161B22] rounded-xl border border-purple-500/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Scale className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    Viewing Public Endpoint: <span className="font-mono text-purple-300">/{directRoute}</span>
                  </p>
                  <p className="text-[11px] text-[#8B949E]">
                    Publicly accessible URL for Intuit App Store review, partner compliance audit, and end-user rights.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/');
                  setDirectRoute(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-bold border border-[#30363D] transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <span>Enter Main Console</span>
              </button>
            </div>

            {directRoute === 'launch' && (
              <OAuthLifecyclePages 
                mode="launch" 
                onNavigateHome={() => {
                  window.history.pushState({}, '', '/');
                  setDirectRoute(null);
                }}
                onNavigateToTab={(t) => {
                  window.history.pushState({}, '', '/');
                  setDirectRoute(null);
                  setActiveTab(t as MainTabType);
                }}
              />
            )}

            {directRoute === 'disconnect' && (
              <OAuthLifecyclePages 
                mode="disconnect" 
                onNavigateHome={() => {
                  window.history.pushState({}, '', '/');
                  setDirectRoute(null);
                }}
                onNavigateToTab={(t) => {
                  window.history.pushState({}, '', '/');
                  setDirectRoute(null);
                  setActiveTab(t as MainTabType);
                }}
              />
            )}

            {directRoute === 'connect' && (
              <OAuthLifecyclePages 
                mode="connect" 
                onNavigateHome={() => {
                  window.history.pushState({}, '', '/');
                  setDirectRoute(null);
                }}
                onNavigateToTab={(t) => {
                  window.history.pushState({}, '', '/');
                  setDirectRoute(null);
                  setActiveTab(t as MainTabType);
                }}
              />
            )}

            {(directRoute === 'terms' || directRoute === 'privacy' || directRoute === 'eula' || directRoute === 'smart-contract' || directRoute === 'compliance') && (
              <LegalCompliancePortal 
                initialPage={directRoute === 'compliance' ? 'submission-answers' : directRoute}
                onNavigateTab={(t) => {
                  window.history.pushState({}, '', '/');
                  setDirectRoute(null);
                  setActiveTab(t as MainTabType);
                }}
              />
            )}
          </div>
        ) : (
          <>
        {/* Banner / Overview */}
        <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-white tracking-tight">
                QuickBooks Full-Spectrum API & AI Banking Hub
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#238636]/15 text-[#3FB950] border border-[#238636]/30">
                SANDBOX READY
              </span>
            </div>
            <p className="text-xs text-[#8B949E] max-w-3xl leading-relaxed">
              Create accounts, run cURLs, parse bank statement JSON with Gemini AI into QuickBooks Chart of Accounts, manage customers & ACH bank accounts, and execute sandbox transactions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('compliance')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-950/40 transition-all border border-purple-400/40 cursor-pointer"
            >
              <Scale className="w-4 h-4 text-purple-200" />
              <span>Compliance & App Store URLs</span>
            </button>
            <button
              onClick={() => setActiveTab('mcp-hub')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-950/40 transition-all border border-purple-400/40 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-purple-200" />
              <span>MCP Server Hub</span>
            </button>
            <button
              onClick={() => setActiveTab('packages-hub')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all border border-emerald-400/40 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-emerald-200" />
              <span>Standalone Packages (10)</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-buyer')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all border border-emerald-400/40 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-200" />
              <span>AI Autonomous Buyer</span>
            </button>
            <button
              onClick={() => setActiveTab('portal')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-900/30 transition-all border border-purple-400/40"
            >
              <Key className="w-4 h-4 text-purple-200" />
              <span>Developer Portal & Token Mint</span>
            </button>
            <button
              onClick={() => setIsVercelModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-[#30363D] bg-[#000000] hover:bg-[#21262d] text-white text-xs font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 1155 1000">
                <path d="m577.3 0 577.4 1000H0z" />
              </svg>
              <span>Vercel Fix Guide</span>
            </button>
            {tokens && (
              <button
                id="clear-session-btn"
                onClick={handleClearSession}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-[#30363D] hover:border-rose-500/50 bg-[#21262d] hover:bg-rose-950/40 text-[#C9D1D9] hover:text-rose-300 text-xs font-medium transition-colors"
                title="Clear current session tokens"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Tokens</span>
              </button>
            )}
          </div>
        </div>

        {/* Dedicated Rectangle Grid for Every Slide in the Top Navbar */}
        <DashboardSlideGrid
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
          }}
        />

        {/* Quick Launch Control Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          <button
            onClick={() => setActiveTab('epic-stories')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'epic-stories'
                ? 'bg-amber-950/80 border-amber-300 text-white shadow-lg ring-2 ring-amber-400'
                : 'bg-gradient-to-br from-[#161B22] to-amber-950/20 border-amber-500/50 hover:border-amber-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/30">
                GEMINI 3.8
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">⚡ Epic Stories & AI</p>
              <p className="text-[11px] text-amber-300/80">Bordered Reports & Chat</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('expertmode')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'expertmode'
                ? 'bg-emerald-950/80 border-emerald-300 text-white shadow-lg ring-2 ring-emerald-400'
                : 'bg-gradient-to-br from-[#161B22] to-emerald-950/20 border-emerald-500/50 hover:border-emerald-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 animate-pulse">
                <Terminal className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/30">
                PUBLISHED
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">📦 NPM Expert Mode</p>
              <p className="text-[11px] text-emerald-300/80">CLI, SDK & Docs</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('salesforce')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'salesforce'
                ? 'bg-amber-950/60 border-amber-400 text-white shadow-sm ring-2 ring-amber-400'
                : 'bg-[#161B22] border-amber-500/40 hover:border-amber-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 animate-pulse">
                <Cloud className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/20">
                EINSTEIN
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">☁️ Salesforce</p>
              <p className="text-[11px] text-[#8B949E]">Models & Trust Layer</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('kroger')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'kroger'
                ? 'bg-blue-950/60 border-blue-400 text-white shadow-sm ring-2 ring-blue-400'
                : 'bg-[#161B22] border-blue-500/40 hover:border-blue-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 animate-pulse">
                <ShoppingCart className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-300 px-1.5 py-0.5 rounded bg-blue-500/20">
                CITIBANK
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">🛒 Kroger Portal</p>
              <p className="text-[11px] text-[#8B949E]">Products & Ledger</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('astra-db')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'astra-db'
                ? 'bg-purple-950/60 border-purple-400 text-white shadow-sm ring-2 ring-purple-400'
                : 'bg-[#161B22] border-purple-500/40 hover:border-purple-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 animate-pulse">
                <Database className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/20">
                ASTRADB
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">⚛️ Astra DB</p>
              <p className="text-[11px] text-[#8B949E]">NoSQL Cloud Ledger</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('uber')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'uber'
                ? 'bg-slate-900 border-slate-200 text-white shadow-sm ring-2 ring-slate-200'
                : 'bg-[#161B22] border-slate-500/40 hover:border-slate-200 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-slate-500/20 text-slate-200 animate-pulse">
                <Car className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-300 px-1.5 py-0.5 rounded bg-slate-500/20">
                UBER
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">🚗 Uber Logistics</p>
              <p className="text-[11px] text-[#8B949E]">Kroger Dispatch Hub</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('csv-studio')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'csv-studio'
                ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-sm ring-2 ring-cyan-400'
                : 'bg-[#161B22] border-cyan-500/40 hover:border-cyan-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 animate-pulse">
                <FileSpreadsheet className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-500/20">
                31 CSVS
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">📊 CSV Studio</p>
              <p className="text-[11px] text-[#8B949E]">Dynamic UI & Grids</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('articles-vault')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'articles-vault'
                ? 'bg-purple-950/60 border-purple-400 text-white shadow-sm ring-2 ring-purple-400'
                : 'bg-[#161B22] border-purple-500/40 hover:border-purple-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 animate-pulse">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/20">
                169 ESSAYS
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">📚 Articles Vault</p>
              <p className="text-[11px] text-[#8B949E]">Blueprints & Manifestos</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('coinbase-cdp')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'coinbase-cdp'
                ? 'bg-blue-950/60 border-blue-400 text-white shadow-sm ring-2 ring-blue-400'
                : 'bg-[#161B22] border-blue-500/40 hover:border-blue-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 animate-pulse">
                <Wallet className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-300 px-1.5 py-0.5 rounded bg-blue-500/20">
                BASE-SEPOLIA
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">🪙 Coinbase CDP</p>
              <p className="text-[11px] text-[#8B949E]">Wallets & Faucet</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('coinbase-docs')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'coinbase-docs'
                ? 'bg-indigo-950/60 border-indigo-400 text-white shadow-sm ring-2 ring-indigo-400'
                : 'bg-[#161B22] border-indigo-500/40 hover:border-indigo-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 animate-pulse">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-500/20">
                LLMS.TXT
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">📖 CDP Wallet MCP</p>
              <p className="text-[11px] text-[#8B949E]">Agentic Tools & Plugins</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('vscode')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'vscode'
                ? 'bg-blue-950/60 border-blue-400 text-white shadow-sm ring-2 ring-blue-400'
                : 'bg-[#161B22] border-blue-500/40 hover:border-blue-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 animate-pulse">
                <FileCode className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-300 px-1.5 py-0.5 rounded bg-blue-500/20">
                IDE ACTIVE
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">🖥️ VS Code IDE</p>
              <p className="text-[11px] text-[#8B949E]">Direct Workspace Editor</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('jester-mode')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'jester-mode'
                ? 'bg-purple-950/60 border-purple-400 text-white shadow-sm ring-2 ring-purple-400'
                : 'bg-[#161B22] border-purple-500/40 hover:border-purple-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/20">
                100 REASONS
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">🎭 Jester Mode 2.0</p>
              <p className="text-[11px] text-purple-300">Mirrored Runtime</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('jamesburvelo-consortium')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'jamesburvelo-consortium'
                ? 'bg-indigo-950/60 border-indigo-400 text-white shadow-sm ring-2 ring-indigo-400'
                : 'bg-[#161B22] border-indigo-500/40 hover:border-indigo-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Building2 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-500/20">
                75 APPS
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">James Burvelo III</p>
              <p className="text-[11px] text-[#8B949E]">DonOne AI & ISO 20022</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('kronos-model')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'kronos-model'
                ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-sm ring-2 ring-emerald-400'
                : 'bg-[#161B22] border-emerald-500/40 hover:border-emerald-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Activity className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/20">
                AAAI '26
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Kronos Foundation</p>
              <p className="text-[11px] text-[#8B949E]">K-Line Foundation Model</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('google-colab')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'google-colab'
                ? 'bg-amber-950/60 border-amber-400 text-white shadow-sm ring-2 ring-amber-400'
                : 'bg-[#161B22] border-amber-500/40 hover:border-amber-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <span className="text-sm">♾️</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/20">
                GCE VM
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">Google Colab</p>
              <p className="text-[11px] text-[#8B949E]">Kernel & Environment</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('sovereign-singularity')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'sovereign-singularity'
                ? 'bg-amber-950/60 border-amber-400 text-white shadow-sm ring-2 ring-amber-400'
                : 'bg-[#161B22] border-amber-500/40 hover:border-amber-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4 animate-bounce" />
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/20">
                $5.6T CAP
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Sovereign Singularity</p>
              <p className="text-[11px] text-[#8B949E]">SBA Moat, Math, RWA & ZKP</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('google-gmail')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'google-gmail'
                ? 'bg-rose-950/60 border-rose-400 text-white shadow-sm ring-1 ring-rose-400'
                : 'bg-[#161B22] border-rose-500/30 hover:border-rose-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <Mail className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-rose-300 px-1.5 py-0.5 rounded bg-rose-500/20">
                GMAIL API
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Gmail Workspace</p>
              <p className="text-[11px] text-[#8B949E]">Live Inbox & Sending</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('google-sheets')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'google-sheets'
                ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-[#161B22] border-emerald-500/30 hover:border-emerald-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <FileSpreadsheet className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/20">
                SHEETS V4
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Google Sheets</p>
              <p className="text-[11px] text-[#8B949E]">Formulas & Drive Sync</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('google-docs')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'google-docs'
                ? 'bg-blue-950/60 border-blue-400 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-[#161B22] border-blue-500/30 hover:border-blue-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <FileText className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-300 px-1.5 py-0.5 rounded bg-blue-500/20">
                DOCS V1
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Google Docs</p>
              <p className="text-[11px] text-[#8B949E]">Rich Editor & Briefings</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('google-drive-app')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'google-drive-app'
                ? 'bg-amber-950/60 border-amber-400 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-[#161B22] border-amber-500/30 hover:border-amber-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <FolderOpen className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/20">
                DRIVE V3
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Google Drive</p>
              <p className="text-[11px] text-[#8B949E]">All Files & Storage</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('google-video')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'google-video'
                ? 'bg-red-950/60 border-red-400 text-white shadow-sm ring-1 ring-red-400'
                : 'bg-[#161B22] border-red-500/30 hover:border-red-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                <Video className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-red-300 px-1.5 py-0.5 rounded bg-red-500/20">
                VIDEO STUDIO
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Video Studio & Messenger</p>
              <p className="text-[11px] text-[#8B949E]">Record & Send Messages</p>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('google-drive')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'google-drive'
                ? 'bg-amber-950/60 border-amber-400 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-[#161B22] border-amber-500/30 hover:border-amber-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <FolderGit2 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/20">
                WORKSPACE
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Google Drive Browser</p>
              <p className="text-[11px] text-[#8B949E]">Upload, view & sync files</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('web3-browser')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'web3-browser'
                ? 'bg-blue-950/60 border-blue-400 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-[#161B22] border-blue-500/30 hover:border-blue-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <Globe className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-300 px-1.5 py-0.5 rounded bg-blue-500/20">
                LIVE WEB3
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Web3 Browser & Auth</p>
              <p className="text-[11px] text-[#8B949E]">Google, Wallets & Proxy</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('api-workbench')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'api-workbench'
                ? 'bg-indigo-950/60 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400'
                : 'bg-[#161B22] border-indigo-500/30 hover:border-indigo-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Compass className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-500/20">
                MULTI-SPEC
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">API & XSD Workbench</p>
              <p className="text-[11px] text-[#8B949E]">Auto-scan, tester & codegen</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-[#161B22] border-emerald-500/30 hover:border-emerald-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <User className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/20">
                GOOGLE AUTH
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Profile & App Data</p>
              <p className="text-[11px] text-[#8B949E]">User apps, tokens & accounts</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('zip-pilot')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'zip-pilot'
                ? 'bg-purple-950/60 border-purple-400 text-white shadow-sm ring-1 ring-purple-400'
                : 'bg-[#161B22] border-purple-500/30 hover:border-purple-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <Bot className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/20">
                AI APP PILOT
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">ZIP App & AI Pilot</p>
              <p className="text-[11px] text-[#8B949E]">Render app & AI voice testing</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('visa-suite')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'visa-suite'
                ? 'bg-blue-950/60 border-blue-400 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-[#161B22] border-blue-500/30 hover:border-blue-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <CreditCard className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-300 px-1.5 py-0.5 rounded bg-blue-500/20">
                LIVE 10 SERVICES
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Visa Live Suite</p>
              <p className="text-[11px] text-[#8B949E]">Direct payouts, SUA & Gemini</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('ai-buyer')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'ai-buyer'
                ? 'bg-emerald-950/50 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-[#161B22] border-emerald-500/30 hover:border-emerald-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <ShoppingCart className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/20">
                BUY WITH AI
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">AI Buyer & Procure</p>
              <p className="text-[11px] text-[#8B949E]">Autonomous Purchases & Ledger</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('wu-psd2')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'wu-psd2'
                ? 'bg-amber-950/50 border-amber-400 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-[#161B22] border-amber-500/30 hover:border-amber-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Globe className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/20">
                BERLIN GROUP
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">WU PSD2 Portal</p>
              <p className="text-[11px] text-[#8B949E]">eIDAS QSEAL & Signatures</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
              activeTab === 'portal'
                ? 'bg-purple-950/40 border-purple-500 text-white shadow-sm'
                : 'bg-[#161B22] border-[#30363D] hover:border-purple-500/50 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <Key className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/20">
                MINT TOKENS
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Developer Portal</p>
              <p className="text-[11px] text-[#8B949E]">Upload SA JSON & ya29... tokens</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('ethereum')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'ethereum'
                ? 'bg-sky-950/50 border-sky-400 text-white shadow-sm ring-1 ring-sky-400'
                : 'bg-[#161B22] border-sky-500/30 hover:border-sky-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                <Wallet className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-sky-300 px-1.5 py-0.5 rounded bg-sky-500/20">
                METAMASK • ETH
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">MetaMask & Ethereum</p>
              <p className="text-[11px] text-[#8B949E]">Buy ETH & Log to Chain</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('amazon')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'amazon'
                ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                : 'bg-[#161B22] border-amber-500/30 hover:border-amber-500 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <ShoppingCart className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/20">
                APS • CITI
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Amazon APS & AI Buyer</p>
              <p className="text-[11px] text-[#8B949E]">Autonomous Buy with Citi</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
              activeTab === 'bridge'
                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm'
                : 'bg-[#161B22] border-[#30363D] hover:border-emerald-500/50 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Zap className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/20">
                LEDGER
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Command Bridge</p>
              <p className="text-[11px] text-[#8B949E]">Execute Intuit & GCP Actions</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('citi')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'citi'
                ? 'bg-[#0072CE]/20 border-[#0072CE] text-white shadow-sm ring-1 ring-[#0072CE]'
                : 'bg-[#161B22] border-[#0072CE]/30 hover:border-[#0072CE] text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-[#0072CE]/20 text-[#58A6FF]">
                <Globe className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-[#58A6FF] px-1.5 py-0.5 rounded bg-[#0072CE]/20">
                AU GCB
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Citi Open Banking</p>
              <p className="text-[11px] text-[#8B949E]">Client Credentials & PayID</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('citi-openapi')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'citi-openapi'
                ? 'bg-gradient-to-br from-cyan-600/30 to-blue-700/30 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400'
                : 'bg-[#161B22] border-cyan-500/30 hover:border-cyan-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <FileCode className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-500/20">
                12 SPECS
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Citi OpenAPI Suite</p>
              <p className="text-[11px] text-[#8B949E]">12 Specs, DCR & Transfers</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('signwell')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'signwell'
                ? 'bg-gradient-to-br from-emerald-600/30 via-teal-600/30 to-cyan-700/30 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-[#161B22] border-emerald-500/30 hover:border-emerald-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <FileCheck2 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/20">
                BATCH SIGN
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">SignWell E-Sign Suite</p>
              <p className="text-[11px] text-[#8B949E]">Batch Sign, PDF & Drive</p>
            </div>
          </button>

          <button
            id="quick-tab-github-deployer-btn"
            onClick={() => setActiveTab('github-deployer')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'github-deployer'
                ? 'bg-gradient-to-br from-purple-600/30 via-indigo-600/30 to-cyan-700/30 border-purple-400 text-white shadow-sm ring-1 ring-purple-400'
                : 'bg-[#161B22] border-purple-500/30 hover:border-purple-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <FolderGit2 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/20">
                REXMUNDI
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">GitHub Deploy & AI Copilot</p>
              <p className="text-[11px] text-[#8B949E]">PAT Push to jocall3/Rexmundi</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('citi-partner')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'citi-partner'
                ? 'bg-gradient-to-br from-blue-600/30 to-sky-700/30 border-sky-400 text-white shadow-sm ring-1 ring-sky-400'
                : 'bg-[#161B22] border-sky-500/30 hover:border-sky-400 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                <Shield className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-sky-300 px-1.5 py-0.5 rounded bg-sky-500/20">
                E2E SSO
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Citi Partner Login</p>
              <p className="text-[11px] text-[#8B949E]">E2E Crypto & Live Token</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('newrelic')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
              activeTab === 'newrelic'
                ? 'bg-[#00AC69]/20 border-[#00AC69] text-white shadow-sm ring-1 ring-[#00AC69]'
                : 'bg-[#161B22] border-[#00AC69]/30 hover:border-[#00AC69] text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-[#00AC69]/20 text-[#00AC69]">
                <Activity className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-[#00AC69] px-1.5 py-0.5 rounded bg-[#00AC69]/20">
                APM CLI
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">New Relic Observability</p>
              <p className="text-[11px] text-[#8B949E]">APM Ingest & Guided Install</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('runner')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
              activeTab === 'runner'
                ? 'bg-blue-950/40 border-blue-500 text-white shadow-sm'
                : 'bg-[#161B22] border-[#30363D] hover:border-blue-500/50 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <PlayCircle className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-300 px-1.5 py-0.5 rounded bg-blue-500/20">
                STEP-BY-STEP
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">OAuth 2.0 Runner</p>
              <p className="text-[11px] text-[#8B949E]">Intuit Connect & Exchange</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('ai-ingest')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
              activeTab === 'ai-ingest'
                ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm'
                : 'bg-[#161B22] border-[#30363D] hover:border-amber-500/50 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/20">
                GEMINI AI
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">AI Banking Ingest</p>
              <p className="text-[11px] text-[#8B949E]">Raw Banking JSON to Ledger</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('authorizenet')}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
              activeTab === 'authorizenet'
                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500'
                : 'bg-[#161B22] border-[#30363D] hover:border-emerald-500/50 text-[#C9D1D9]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Shield className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-500/20">
                VISA / AUTHNET
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Authorize.Net Gateway</p>
              <p className="text-[11px] text-[#8B949E]">Prior Auth, Reports & CIM</p>
            </div>
          </button>
        </div>

        {/* Tab: Epic Stories & Professional Bank Reports (Gemini 3.8 Flash) */}
        {activeTab === 'epic-stories' && (
          <div id="section-epic-stories" className="w-full">
            <AppErrorBoundary tabName="Epic Stories & Bank Report Module">
              <EpicStoriesModule onNavigateTab={(t) => setActiveTab(t as any)} />
            </AppErrorBoundary>
          </div>
        )}

        {/* Tab: NPM Package & Expert Mode Guide */}
        {activeTab === 'expertmode' && (
          <div id="section-expertmode" className="w-full">
            <AppErrorBoundary tabName="NPM Package Expert Mode">
              <ExpertModeConsole onNavigateTab={(t) => setActiveTab(t as any)} />
            </AppErrorBoundary>
          </div>
        )}

        {/* Tab: Salesforce Einstein Platform Models & LLM Hub */}
        {activeTab === 'salesforce' && (
          <div id="section-salesforce" className="w-full">
            <SalesforceConsole />
          </div>
        )}

        {/* Tab: Kroger Citibank Partnership Portal */}
        {activeTab === 'kroger' && (
          <div id="section-kroger" className="w-full">
            <AppErrorBoundary tabName="Kroger Citibank Portal">
              <KrogerCitibankConsole />
            </AppErrorBoundary>
          </div>
        )}

        {/* Tab: DataStax Astra DB Cloud Explorer */}
        {activeTab === 'astra-db' && (
          <div id="section-astra-db" className="w-full">
            <AstraDbConsole />
          </div>
        )}

        {/* Tab: Uber Logistics Integration */}
        {activeTab === 'uber' && (
          <div id="section-uber" className="w-full">
            <UberIntegrationConsole />
          </div>
        )}

        {/* Tab: Universal CSV Data Studio & Intelligence UI */}
        {activeTab === 'csv-studio' && (
          <div id="section-csv-studio" className="w-full">
            <CsvDataStudio />
          </div>
        )}

        {/* Tab: Articles, Manifestos & Blueprints Vault */}
        {activeTab === 'articles-vault' && (
          <div id="section-articles-vault" className="w-full">
            <ArticlesVaultHub />
          </div>
        )}

        {/* Tab: Coinbase Developer Platform (CDP) Hub */}
        {activeTab === 'coinbase-cdp' && (
          <div id="section-coinbase-cdp">
            <CoinbaseCdpConsole />
          </div>
        )}

        {/* Tab: Coinbase CDP Wallet MCP Documentation */}
        {activeTab === 'coinbase-docs' && (
          <div id="section-coinbase-docs">
            <CoinbaseCdpDocs />
          </div>
        )}

        {/* Tab: VS Code Cloud IDE & Direct Filesystem Workbench */}
        {activeTab === 'vscode' && (
          <div id="section-vscode">
            <VsCodeConsole />
          </div>
        )}

        {/* Tab: Authorize.Net Payment Gateway & Reporting Suite */}
        {activeTab === 'authorizenet' && (
          <div id="section-authorizenet">
            <AuthorizeNetConsole />
          </div>
        )}

        {/* Tab: Adobe Commerce 2.4.6 Enterprise REST Gateway */}
        {activeTab === 'adobe-commerce' && (
          <div id="section-adobe-commerce">
            <AdobeCommerceConsole />
          </div>
        )}

        {/* Tab: Jester Mode 2.0 (The Chronicle of the Mirrored Runtime) */}
        {activeTab === 'jester-mode' && (
          <div id="section-jester-mode">
            <JesterMode2Console onNavigateToSovereign={() => setActiveTab('sovereign-singularity')} />
          </div>
        )}

        {/* Tab: Kronos Foundation Model (AAAI 2026 / NeoQuasar) */}
        {activeTab === 'kronos-model' && (
          <div id="section-kronos-model">
            <KronosFoundationModelHub />
          </div>
        )}

        {/* Tab: James Burvelo O'Callaghan III Banking Consortium & Aether Mesh */}
        {activeTab === 'jamesburvelo-consortium' && (
          <div id="section-jamesburvelo-consortium">
            <JamesBurveloConsortiumHub />
          </div>
        )}

        {/* Tab: Sovereign Singularity Console */}
        {activeTab === 'sovereign-singularity' && (
          <div id="section-sovereign-singularity">
            <SovereignSingularityConsole />
          </div>
        )}

        {/* Tab: Google Sheets Workspace */}
        {activeTab === 'google-sheets' && (
          <div id="section-google-sheets">
            <GoogleSheetsWorkspace />
          </div>
        )}

        {/* Tab: Google Docs Workspace */}
        {activeTab === 'google-docs' && (
          <div id="section-google-docs">
            <GoogleDocsWorkspace />
          </div>
        )}

        {/* Tab: Google Slides Workspace */}
        {activeTab === 'google-slides' && (
          <div id="section-google-slides">
            <GoogleSlidesWorkspace />
          </div>
        )}

        {/* Tab: Google Gmail Workspace */}
        {activeTab === 'google-gmail' && (
          <div id="section-google-gmail">
            <GoogleMailWorkspace />
          </div>
        )}

        {/* Tab: Google Drive Application */}
        {activeTab === 'google-drive-app' && (
          <div id="section-google-drive-app">
            <GoogleDriveWorkspace />
          </div>
        )}

        {/* Tab: Google Video Studio & Messaging */}
        {activeTab === 'google-video' && (
          <div id="section-google-video">
            <GoogleVideoWorkspace />
          </div>
        )}

        {/* Tab: Google Keep Workspace */}
        {activeTab === 'google-keep' && (
          <div id="section-google-keep">
            <GoogleKeepWorkspace />
          </div>
        )}

        {/* Tab: Google Tasks Workspace */}
        {activeTab === 'google-tasks' && (
          <div id="section-google-tasks">
            <GoogleTasksWorkspace />
          </div>
        )}

        {/* Tab: Google Calendar & Meet Workspace */}
        {activeTab === 'google-calendar' && (
          <div id="section-google-calendar">
            <GoogleCalendarWorkspace />
          </div>
        )}

        {/* Tab: Google Forms Workspace */}
        {activeTab === 'google-forms' && (
          <div id="section-google-forms">
            <GoogleFormsWorkspace />
          </div>
        )}

        {/* Tab: Google Classroom Workspace */}
        {activeTab === 'google-classroom' && (
          <div id="section-google-classroom">
            <GoogleClassroomWorkspace />
          </div>
        )}

        {/* Tab: Google Maps Workspace */}
        {activeTab === 'google-maps' && (
          <div id="section-google-maps">
            <GoogleMapsWorkspace />
          </div>
        )}

        {/* Tab: Google Cloud SQL Workspace */}
        {activeTab === 'google-cloudsql' && (
          <div id="section-google-cloudsql">
            <GoogleCloudSqlWorkspace />
          </div>
        )}

        {/* Tab: Google Colaboratory Interactive Kernel & Environment Workspace */}
        {activeTab === 'google-colab' && (
          <div id="section-google-colab">
            <GoogleColabWorkspace />
          </div>
        )}

        {/* Tab: Google Workspace Suite Hub */}
        {activeTab === 'google-workspace' && (
          <div id="section-google-workspace">
            <GoogleWorkspaceHub />
          </div>
        )}

        {/* Tab: Multi-Spec API & XSD Documentation Workbench */}
        {activeTab === 'api-workbench' && (
          <div id="section-api-workbench">
            <WorkbenchGenerator />
          </div>
        )}

        {/* Tab: Google Drive Cloud Browser */}
        {activeTab === 'google-drive' && (
          <div id="section-google-drive" className="rounded-xl overflow-hidden border border-[#30363D] shadow-2xl">
            <GoogleDriveBrowser />
          </div>
        )}

        {/* Tab: Web3 Live Browser & AI Inspector */}
        {activeTab === 'web3-browser' && (
          <div id="section-web3-browser" className="rounded-xl overflow-hidden border border-[#30363D] shadow-2xl">
            <Web3Browser onNavigateToDrive={() => setActiveTab('google-drive')} />
          </div>
        )}

        {/* Tab: User Profile & App Data */}
        {activeTab === 'profile' && (
          <div id="section-user-profile">
            <UserProfilePage
              onNavigateToZipHub={() => setActiveTab('zip-pilot')}
              onNavigateToVisa={() => setActiveTab('visa-suite')}
            />
          </div>
        )}

        {/* Tab: ZIP App Sandbox Renderer & Autonomous AI App Pilot */}
        {activeTab === 'zip-pilot' && (
          <div id="section-zip-pilot">
            <ZipAppRendererAiPilot />
          </div>
        )}

        {/* Tab: Visa Live Enterprise Suite */}
        {activeTab === 'visa-suite' && (
          <div id="section-visa-suite">
            <VisaSuiteConsole />
          </div>
        )}

        {/* Tab: MetaMask & Ethereum Blockchain Notary & On-Ramp */}
        {activeTab === 'ethereum' && (
          <div id="section-metamask-ethereum">
            <MetaMaskEthereumConsole
              tokens={tokens}
              realmId={realmId || config?.activeTokens.realmId || undefined}
              onNavigateToBridge={() => setActiveTab('bridge')}
              onNavigateToCiti={() => setActiveTab('citi')}
              onNavigateToAmazon={() => setActiveTab('amazon')}
            />
          </div>
        )}

        {/* Tab: Amazon Payment Services (APS / PayFort) & Citibank AI Autonomous Buyer */}
        {activeTab === 'amazon' && (
          <div id="section-amazon-aps-buyer">
            <AmazonApsConsole
              tokens={tokens}
              realmId={realmId || config?.activeTokens.realmId || undefined}
              onNavigateToBridge={() => setActiveTab('bridge')}
              onNavigateToCiti={() => setActiveTab('citi')}
            />
          </div>
        )}

        {/* Tab: AI Autonomous Procurement Buyer */}
        {activeTab === 'ai-buyer' && (
          <div id="section-ai-procure-buyer">
            <AiBuyerConsole
              tokens={tokens}
              realmId={realmId || config?.activeTokens.realmId || undefined}
              onNavigateToBridge={() => setActiveTab('bridge')}
            />
          </div>
        )}

        {/* Tab: Western Union PSD2 Developer Portal & Open Banking Gateway */}
        {activeTab === 'wu-psd2' && (
          <div id="section-wu-psd2-portal">
            <WesternUnionPsd2Console
              tokens={tokens}
              realmId={realmId || config?.activeTokens.realmId || undefined}
              onNavigateToBridge={() => setActiveTab('bridge')}
            />
          </div>
        )}

        {/* Tab: Azure Deployment & Credentials Vault */}
        {activeTab === 'vault' && (
          <div id="section-vault">
            <AzureDeploymentVault />
          </div>
        )}

        {/* Tab: O'Callaghan Algorithm */}
        {activeTab === 'ocallaghan' && (
          <div id="section-ocallaghan">
            <OCallaghanConsole />
          </div>
        )}

        {/* Tab: Master Azure Redeploy & Synthesis */}
        {activeTab === 'azure-master' && (
          <div id="section-azure-master">
            <AzureMasterDeployer />
          </div>
        )}

        {/* Tab: Enterprise & Azure App Keys */}
        {activeTab === 'credentials' && (
          <div id="section-credentials">
            <EnterpriseCredentialsHub />
          </div>
        )}

        {/* Tab: Citi Global Consumer Banking (GCB) API Hub */}
        {activeTab === 'citi' && (
          <div id="section-citi">
            <CitiOpenBankingConsole
              tokens={tokens}
              realmId={realmId}
              onNavigateToBridge={() => setActiveTab('auto-bridge')}
              onNavigateToPartnerLogin={() => setActiveTab('citi-partner')}
            />
          </div>
        )}

        {/* Tab: Master API Cake & Unified Bundle Studio */}
        {activeTab === 'api-cake' && (
          <div id="section-api-cake">
            <ApiCakeStudio />
          </div>
        )}

        {/* Tab: Citi OpenAPI 3.0.1 Full Specification Suite Workbench */}
        {activeTab === 'citi-openapi' && (
          <div id="section-citi-openapi">
            <CitiOpenApiWorkbench />
          </div>
        )}

        {/* Tab: SignWell E-Signature Suite & Multi-Account Batch Signer */}
        {activeTab === 'signwell' && (
          <div id="section-signwell">
            <SignWellConsole />
          </div>
        )}

        {/* Tab: GitHub Sovereign Deployer & AI Copilot */}
        {activeTab === 'github-deployer' && (
          <div id="section-github-deployer">
            <GitHubDeployerConsole />
          </div>
        )}

        {/* Tab: Citi Partner Portal & E2E Login Console */}
        {activeTab === 'citi-partner' && (
          <div id="section-citi-partner">
            <CitiPartnerLoginConsole />
          </div>
        )}

        {/* Tab: New Relic Full-Stack Observability & APM Hub */}
        {activeTab === 'newrelic' && (
          <div id="section-newrelic">
            <NewRelicConsole />
          </div>
        )}

        {/* Tab: Environment Manager */}
        {activeTab === 'env-manager' && (
          <div id="section-env-manager">
            <EnvManager />
          </div>
        )}

        {/* Tab: Marqeta Card Issuing & Digital Banking */}
        {activeTab === 'marqeta' && (
          <div id="section-marqeta">
            <MarqetaConsole />
          </div>
        )}

        {/* Tab: App Expansion & Deployment Pipeline */}
        {activeTab === 'expansion' && (
          <div id="section-expansion">
            <ExpansionPipelineUI />
          </div>
        )}

        {/* Tab: Automated QBO-Banking Bridge & Technical Linking Ledger */}
        {activeTab === 'auto-bridge' && (
          <div id="section-auto-bridge-ledger">
            <AutonomousBridgeLedger
              realmId={realmId || config?.activeTokens.realmId || undefined}
              hasTokens={Boolean(config?.activeTokens.hasAccessToken || tokens?.access_token)}
            />
          </div>
        )}

        {/* Tab: Accounting Categories Master Registry & 154 Category UUIDs */}
        {activeTab === 'accounting-categories' && (
          <div id="section-accounting-categories">
            <AccountingCategoriesHub />
          </div>
        )}

        {/* Tab 0: Autonomous Ledger Command Bridge */}
        {activeTab === 'bridge' && (
          <div id="section-command-bridge">
            <QuickBooksCommandBridge
              tokens={tokens ? { accessToken: (tokens as any).accessToken || tokens.access_token, realmId: realmId || tokens.realmId || null } : undefined}
            />
          </div>
        )}

        {/* Tab 1: Interactive Runner */}
        {activeTab === 'runner' && (
          <div className="space-y-6">
            {/* Step Progression Ribbon */}
            <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-2 shadow-xs overflow-x-auto">
              <div className="flex items-center min-w-[600px] justify-between gap-2">
                {[
                  { num: 1, label: 'Get Auth Code', active: currentStep === 1, done: Boolean(authCode) },
                  { num: 2, label: 'Exchange Tokens', active: currentStep === 2, done: Boolean(tokens?.access_token) },
                  { num: 3, label: 'Call Sandbox APIs', active: currentStep === 3, done: Boolean(tokens?.access_token) },
                  { num: 4, label: 'Refresh Token', active: currentStep === 4, done: false },
                ].map((s) => (
                  <button
                    key={s.num}
                    id={`step-nav-btn-${s.num}`}
                    onClick={() => setCurrentStep(s.num as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      currentStep === s.num
                        ? 'bg-[#238636] text-white font-semibold shadow-xs border border-[#3FB950]/30'
                        : s.done
                        ? 'text-[#3FB950] bg-[#238636]/15 hover:bg-[#238636]/25 border border-[#238636]/30'
                        : 'text-[#8B949E] hover:bg-[#21262d] border border-transparent'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      currentStep === s.num
                        ? 'bg-white text-[#161B22]'
                        : s.done
                        ? 'bg-[#238636] text-white'
                        : 'bg-[#21262d] text-[#8B949E] border border-[#30363D]'
                    }`}>
                      {s.done ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : s.num}
                    </span>
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1: Authorization Code */}
            <div id="section-step-1">
              <Step1Auth
                clientId={config?.clientId || 'ABySM9kH7sQ0wfw8Mb3SB30DqWCRQNG6cDQMQVf5gSMvugU5n8'}
                redirectUri={config?.redirectUri || 'https://developer.intuit.com/app/developer/quickstart'}
                onCodeAcquired={handleCodeAcquired}
              />
            </div>

            {/* Step 2: Token Exchange */}
            <div id="section-step-2">
              <Step2Tokens
                code={authCode}
                realmId={realmId}
                clientId={config?.clientId || 'ABySM9kH7sQ0wfw8Mb3SB30DqWCRQNG6cDQMQVf5gSMvugU5n8'}
                redirectUri={config?.redirectUri || 'https://developer.intuit.com/app/developer/quickstart'}
                hasEnvSecret={Boolean(config?.hasClientSecret)}
                onTokensAcquired={handleTokensAcquired}
                onNavigateToPortal={() => setActiveTab('portal')}
              />
            </div>

            {/* Step 3: Sandbox APIs */}
            <div id="section-step-3">
              <Step3Apis tokens={tokens} />
            </div>

            {/* Step 4: Refresh Token */}
            <div id="section-step-4">
              <Step4Refresh
                tokens={tokens}
                clientId={config?.clientId || 'ABySM9kH7sQ0wfw8Mb3SB30DqWCRQNG6cDQMQVf5gSMvugU5n8'}
                hasEnvSecret={Boolean(config?.hasClientSecret)}
                onTokensRefreshed={handleTokensRefreshed}
              />
            </div>
          </div>
        )}

        {/* Tab: PayPal Sandbox & Credentials Hub */}
        {activeTab === 'paypal' && (
          <div id="section-paypal-credentials-hub">
            <PayPalConsole />
          </div>
        )}

        {/* Tab: Chase Pay With Points & Loyalty */}
        {activeTab === 'chase' && (
          <div id="section-chase-loyalty">
            <ChaseLoyaltyConsole />
          </div>
        )}

        {/* Tab: Mastercard Open Finance & Finicity */}
        {activeTab === 'finicity' && (
          <div id="section-finicity-open-finance">
            <FinicityConsole
              onSendToAiIngest={(rawJson) => {
                setIngestPayload(rawJson);
                setActiveTab('ai-ingest');
              }}
            />
          </div>
        )}

        {/* Tab: Modern Treasury Ledgers & Live QBO Storage */}
        {activeTab === 'moderntreasury' && (
          <div id="section-modern-treasury-ledgers">
            <ModernTreasuryConsole
              onSendToAiIngest={(rawJson) => {
                setIngestPayload(rawJson);
                setActiveTab('ai-ingest');
              }}
            />
          </div>
        )}

        {/* Tab 2: AI Banking Ingest */}
        {activeTab === 'ai-ingest' && (
          <div id="section-ai-banking-ingest">
            <AiBankingIngest 
              tokens={tokens} 
              initialPayload={ingestPayload || undefined} 
            />
          </div>
        )}

        {/* Tab 3: Form Creator */}
        {activeTab === 'forms' && (
          <div id="section-form-builder">
            <QuickBooksFormBuilder tokens={tokens} />
          </div>
        )}

        {/* Tab 4: cURL Runner */}
        {activeTab === 'curl' && (
          <div id="section-curl-runner">
            <CustomCurlExecutor
              tokens={tokens}
              onSendToAiIngest={(rawJson) => {
                setIngestPayload(rawJson);
                setActiveTab('ai-ingest');
              }}
            />
          </div>
        )}

        {/* Tab 5: Autonomous Sync */}
        {activeTab === 'autonomous' && (
          <div id="section-autonomous-sync">
            <AutonomousSync
              tokens={tokens}
              realmId={realmId}
              onTokensUpdated={handleTokensAcquired}
            />
          </div>
        )}

        {/* Tab 6: Code Scaffolder */}
        {activeTab === 'scaffolder' && (
          <div id="section-code-scaffolder">
            <CodeGenerator />
          </div>
        )}

        {/* Tab 7: Scopes & Matrix */}
        {activeTab === 'scopes' && (
          <div id="section-scopes-reference">
            <ScopeReference />
          </div>
        )}

        {/* Tab: Extracted ZIP Apps Hub */}
        {activeTab === 'extracted-apps' && (
          <div id="section-extracted-apps">
            <ExtractedAppsHub />
          </div>
        )}

        {/* Tab: Stream OpenAPI Live Gateway */}
        {activeTab === 'stream-openapi' && (
          <div id="section-stream-openapi">
            <StreamOpenApiHub />
          </div>
        )}

        {/* Tab: US Treasury BFS XML Schema Console */}
        {activeTab === 'treasury-xsd' && (
          <div id="section-treasury-xsd">
            <TreasuryXsdConsole />
          </div>
        )}

        {/* Tab: Stripe Analytics & Issuing Dashboard */}
        {activeTab === 'stripe-dashboard' && (
          <div id="section-stripe-dashboard">
            <StripeAnalyticsDashboard />
          </div>
        )}

        {/* Tab: Jocall3 Portfolio Explorer */}
        {activeTab === 'jocall3-portfolio' && (
          <div id="section-jocall3-portfolio" className="rounded-2xl overflow-hidden border border-[#30363D] min-h-[85vh]">
            <React.Suspense fallback={<div className="p-12 text-center text-slate-400 font-mono text-sm">Loading Portfolio Explorer...</div>}>
              <Jocall3PortfolioApp />
            </React.Suspense>
          </div>
        )}

        {/* Tab: Krisp & Zapier Integrations Hub */}
        {activeTab === 'krisp-zapier' && (
          <div id="section-krisp-zapier">
            <KrispZapierHub />
          </div>
        )}

        {/* Tab: Multi-Company MCP Server Hub */}
        {activeTab === 'mcp-hub' && (
          <div id="section-mcp-hub">
            <McpServerHub />
          </div>
        )}

        {/* Tab: Card Vault & Catalog */}
        {activeTab === 'card-catalog' && (
          <div id="section-card-catalog">
            <CardCatalogVault />
          </div>
        )}

        {/* Tab: Standalone Integrated Packages */}
        {activeTab === 'packages-hub' && (
          <div id="section-packages-hub">
            <IntegratedAppsHub />
          </div>
        )}

        {/* Tab 8: Developer Portal */}
        {activeTab === 'portal' && (
          <div id="section-developer-portal">
            <DeveloperPortal />
          </div>
        )}

        {/* Tab 9: API Documentation Hub */}
        {activeTab === 'docs-hub' && (
          <div id="section-documentation-hub">
            <DocumentationHub />
          </div>
        )}

        {/* Tab 10: Legal Compliance Portal */}
        {activeTab === 'compliance' && (
          <div id="section-legal-compliance">
            <LegalCompliancePortal 
              initialPage="submission-answers"
              onNavigateTab={(tab) => setActiveTab(tab as MainTabType)}
            />
          </div>
        )}

        {/* Tab VS Code: Full Workspace IDE & Workbench */}
        {activeTab === 'vscode' && (
          <div id="section-vscode-workbench" className="space-y-6">
            <VsCodeConsole />
          </div>
        )}

        {/* Tab: AI Data Platform 2026-04-30 API Suite */}
        {activeTab === 'ai-data-platform' && (
          <div id="section-ai-data-platform">
            <AiDataPlatformConsole />
          </div>
        )}

        {/* Tab: House PDF Acquisition & Paperwork Suite */}
        {activeTab === 'house-acquisition' && (
          <div id="section-house-acquisition">
            <HousePdfAcquisitionHub />
          </div>
        )}

        {/* Tab: Confluent Cloud Kafka Integration */}
        {activeTab === 'confluent-kafka' && (
          <div id="section-confluent-kafka">
            <ConfluentKafkaHub />
          </div>
        )}

        {/* Tab: 100 Autonomous Modules Hub */}
        {activeTab === '100-modules' && (
          <div id="section-100-modules">
            <HundredModulesHub />
          </div>
        )}

        {/* Tab: Modern Treasury GraphQL Persistent Queries */}
        {activeTab === 'modern-treasury-gql' && (
          <div id="section-modern-treasury-gql">
            <ModernTreasuryGraphqlHub />
          </div>
        )}

        {/* Tab: Enterprise Workflow Orchestrator */}
        {activeTab === 'orchestrator-hub' && (
          <div id="section-orchestrator-hub">
            <OrchestratorHub />
          </div>
        )}

        {/* Tab: Google Cloud/Workspace Infrastructure */}
        {activeTab === 'google-attributes' && (
          <div id="section-google-attributes">
            <GoogleAttributesHub />
          </div>
        )}

        {/* Tab: GCP Blockchain Engine */}
        {activeTab === 'gcp-blockchain' && (
          <div id="section-gcp-blockchain">
            <GcpBlockchainViewer />
          </div>
        )}

        {/* Tab: Azure CSV Inspector */}
        {activeTab === 'azure-csv' && (
          <div id="section-azure-csv">
            <AzureCsvInspector />
          </div>
        )}

        {/* Tab: FullView Customer State WebSocket Hub */}
        {activeTab === 'fullview' && (
          <div id="section-fullview">
            <FullViewCustomerStateHub />
          </div>
        )}

        {/* Tab: Google Workspace SAML 2.0 IdP Hub */}
        {activeTab === 'google-saml' && (
          <div id="section-google-saml">
            <GoogleSamlHub />
          </div>
        )}
          </>
        )}

      </main>

      {/* Vercel Deployment Guide Modal */}
      <VercelGuideModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
      />

      {/* Comprehensive Compliance & App Store Legal Footer */}
      <footer className="border-t border-[#30363D] bg-[#0d1117] py-6 mt-12 space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8B949E]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-semibold text-white">Kronos Apex OS</span>
            <span>•</span>
            <span>Intuit QuickBooks Online Production-Ready Integration</span>
            <span>•</span>
            <span>Client ID: <code className="font-mono text-[#79C0FF]">{config?.clientId || 'ABySM9k...'}</code></span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <button
              onClick={() => setActiveTab('compliance')}
              className="text-purple-300 hover:text-white font-medium flex items-center space-x-1"
            >
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              <span>App Store Submission Hub</span>
            </button>
            <a
              href="https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B949E] hover:text-white font-medium"
            >
              Intuit Docs ↗
            </a>
          </div>
        </div>

        {/* Direct Legal & Lifecycle Public Links for Customers & Compliance Teams */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 border-t border-[#21262D] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#8B949E]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-[#6E7681] uppercase tracking-wider font-mono font-bold text-[10px]">
              Public Compliance URLs:
            </span>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/terms');
                setDirectRoute('terms');
              }}
              className="text-[#C9D1D9] hover:text-white underline hover:no-underline"
            >
              Terms of Service (/terms)
            </button>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/privacy');
                setDirectRoute('privacy');
              }}
              className="text-[#C9D1D9] hover:text-white underline hover:no-underline"
            >
              Privacy Policy (/privacy)
            </button>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/eula');
                setDirectRoute('eula');
              }}
              className="text-[#C9D1D9] hover:text-white underline hover:no-underline"
            >
              EULA (/eula)
            </button>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/smart-contract');
                setDirectRoute('smart-contract');
              }}
              className="text-[#C9D1D9] hover:text-white underline hover:no-underline"
            >
              Collateralized Credit Agreement (/smart-contract)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-[#6E7681] uppercase tracking-wider font-mono font-bold text-[10px]">
              OAuth Lifecycle:
            </span>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/launch');
                setDirectRoute('launch');
              }}
              className="text-emerald-400 hover:text-emerald-300 underline hover:no-underline"
            >
              Launch URL (/launch)
            </button>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/disconnect');
                setDirectRoute('disconnect');
              }}
              className="text-rose-400 hover:text-rose-300 underline hover:no-underline"
            >
              Disconnect URL (/disconnect)
            </button>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/connect');
                setDirectRoute('connect');
              }}
              className="text-indigo-400 hover:text-indigo-300 underline hover:no-underline"
            >
              Connect URL (/connect)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
