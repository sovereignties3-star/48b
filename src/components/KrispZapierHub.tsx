import React, { useState, useEffect } from 'react';
import { KrispLogo } from './KrispLogo';
import {
  Mic,
  Zap,
  FileText,
  CheckCircle2,
  Share2,
  Calendar,
  Slack,
  Mail,
  FolderTree,
  Send,
  Sparkles,
  Bot,
  Building,
  RefreshCw,
  ArrowRight,
  Layers,
  ShieldCheck,
  Cpu,
  Languages,
  Volume2,
  Sliders,
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  Play,
  Settings,
  BookOpen,
  Search,
  Scale
} from 'lucide-react';

interface ZapIntegrationItem {
  id: string;
  category: string;
  title: string;
  description: string;
  trigger: string;
  action: string;
  icon: string;
  featured?: boolean;
}

const ZAPIER_INTEGRATIONS: ZapIntegrationItem[] = [
  { id: 'z-1', category: 'Productivity & Task Management', title: 'Krisp + Zoom / Google Meet', description: 'Automatically share meeting transcripts with your team or store them in Google Drive.', trigger: 'Meeting transcript generated in Krisp', action: 'Upload transcript to Google Drive & notify team', icon: 'mic', featured: true },
  { id: 'z-2', category: 'Productivity & Task Management', title: 'Slack + Google Calendar', description: 'Send reminders or event notifications directly to your Slack channels.', trigger: 'Upcoming event in Google Calendar', action: 'Send reminder message to Slack channel', icon: 'calendar', featured: false },
  { id: 'z-3', category: 'Productivity & Task Management', title: 'Trello + Gmail', description: 'Turn incoming emails with specific keywords into Trello cards automatically.', trigger: 'New email received matching filter', action: 'Create Trello card in board', icon: 'mail', featured: false },
  { id: 'z-4', category: 'Customer Support & Communication', title: 'Krisp + Slack / Email', description: 'Automatically share important meeting summaries through Slack or email.', trigger: 'Krisp meeting summary finalized', action: 'Post summary to Slack / Email channel', icon: 'slack', featured: true },
  { id: 'z-5', category: 'Customer Support & Communication', title: 'Salesforce + Slack', description: 'Notify your sales team in real-time when Salesforce records are updated.', trigger: 'Salesforce lead or deal updated', action: 'Send instant notification to Slack', icon: 'share', featured: false },
  { id: 'z-6', category: 'Customer Support & Communication', title: 'Zendesk + Google Sheets', description: 'Log new customer support tickets and updates into a spreadsheet for tracking.', trigger: 'New Zendesk ticket created', action: 'Append row to Google Sheets tracker', icon: 'file', featured: false },
  { id: 'z-7', category: 'Customer Support & Communication', title: 'Zoom + Typeform', description: 'Generate Zoom meeting links automatically from Typeform submissions.', trigger: 'Typeform survey submitted', action: 'Create Zoom meeting & email link', icon: 'calendar', featured: false },
  { id: 'z-8', category: 'Project Management & Collaboration', title: 'Krisp + Jira / Asana', description: 'Automatically create tasks in Jira or Asana from meeting action items.', trigger: 'Action item identified by Krisp AI', action: 'Create task card in Jira / Asana', icon: 'bot', featured: true },
  { id: 'z-9', category: 'Project Management & Collaboration', title: 'Asana + Google Drive', description: 'Attach new files from Google Drive folders to relevant tasks in Asana.', trigger: 'File added to Google Drive folder', action: 'Attach file to Asana task', icon: 'folder', featured: false },
  { id: 'z-10', category: 'Project Management & Collaboration', title: 'Trello + Dropbox', description: 'Sync Dropbox files directly to Trello cards.', trigger: 'File uploaded to Dropbox folder', action: 'Attach resource to Trello card', icon: 'share', featured: false },
  { id: 'z-11', category: 'Project Management & Collaboration', title: 'Monday.com + Google Calendar', description: 'Schedule Google Calendar events from Monday.com task deadlines.', trigger: 'Due date set on Monday.com', action: 'Create Google Calendar event', icon: 'calendar', featured: false },
  { id: 'z-12', category: 'Marketing & Sales Automation', title: 'Krisp + HubSpot', description: 'Log post-meeting summaries automatically in HubSpot CRM.', trigger: 'Sales call summary generated in Krisp', action: 'Log note in HubSpot contact record', icon: 'sparkles', featured: true },
  { id: 'z-13', category: 'Marketing & Sales Automation', title: 'HubSpot + Google Sheets', description: 'Keep lead data in sync between HubSpot and Google Sheets.', trigger: 'Contact added or modified in HubSpot', action: 'Update row in Google Sheets', icon: 'file', featured: false },
  { id: 'z-14', category: 'Marketing & Sales Automation', title: 'Mailchimp + Facebook Lead Ads', description: 'Add new ad leads instantly to Mailchimp audience lists.', trigger: 'New lead submitted on Facebook Ad', action: 'Add subscriber to Mailchimp list', icon: 'mail', featured: false },
  { id: 'z-15', category: 'Marketing & Sales Automation', title: 'QuickBooks + Stripe', description: 'Create QuickBooks invoices automatically from Stripe payments.', trigger: 'Payment processed successfully in Stripe', action: 'Create invoice in QuickBooks', icon: 'building', featured: false },
  { id: 'z-16', category: 'E-commerce & Inventory Management', title: 'Shopify + Google Sheets', description: 'Log new online store orders into spreadsheets for inventory tracking.', trigger: 'New order placed on Shopify', action: 'Record order details in Google Sheets', icon: 'file', featured: false },
  { id: 'z-17', category: 'E-commerce & Inventory Management', title: 'WooCommerce + QuickBooks', description: 'Sync WooCommerce sales data with QuickBooks for bookkeeping.', trigger: 'Customer order placed in WooCommerce', action: 'Create sales receipt in QuickBooks', icon: 'building', featured: false },
  { id: 'z-18', category: 'E-commerce & Inventory Management', title: 'ShipStation + Trello', description: 'Track shipping tasks by creating Trello cards upon order fulfillment.', trigger: 'Order fulfilled in ShipStation', action: 'Create tracking task in Trello', icon: 'share', featured: false },
  { id: 'z-19', category: 'HR & Recruitment', title: 'BambooHR + Slack', description: 'Notify Slack channels when employees submit time off requests.', trigger: 'Time off request submitted in BambooHR', action: 'Post alert to HR Slack channel', icon: 'slack', featured: false },
  { id: 'z-20', category: 'HR & Recruitment', title: 'Greenhouse + Google Sheets', description: 'Log new candidates entering the hiring pipeline into Google Sheets.', trigger: 'New candidate added in Greenhouse', action: 'Append candidate row to Google Sheet', icon: 'file', featured: false },
  { id: 'z-21', category: 'HR & Recruitment', title: 'Workable + Trello', description: 'Create Trello cards for new candidates added to Workable.', trigger: 'Candidate added to Workable stage', action: 'Create Trello hiring card', icon: 'share', featured: false },
  { id: 'z-22', category: 'Event Management & Scheduling', title: 'Krisp + Eventbrite', description: 'Distribute event summaries and post-event notes automatically.', trigger: 'Event concluded & Krisp notes generated', action: 'Share summary with team via Google Drive / Slack', icon: 'mic', featured: true },
  { id: 'z-23', category: 'Event Management & Scheduling', title: 'Eventbrite + Google Calendar', description: 'Generate Google Calendar events from Eventbrite listings.', trigger: 'New event created in Eventbrite', action: 'Create Google Calendar entry', icon: 'calendar', featured: false },
  { id: 'z-24', category: 'Event Management & Scheduling', title: 'Acuity Scheduling + Google Sheets', description: 'Log client appointment bookings in real-time spreadsheets.', trigger: 'New appointment booked in Acuity', action: 'Log booking details in Google Sheets', icon: 'file', featured: false },
  { id: 'z-25', category: 'Event Management & Scheduling', title: 'Calendly + Zoom', description: 'Generate Zoom meeting links automatically from Calendly bookings.', trigger: 'Meeting scheduled in Calendly', action: 'Create Zoom meeting and share link', icon: 'calendar', featured: false }
];

export function KrispZapierHub() {
  const [activeTab, setActiveTab] = useState<'voice-translation' | 'zapier-mesh' | 'govinfo-congress'>('voice-translation');
  const [copied, setCopied] = useState(false);

  // --- Voice Translation Engine States ---
  const [languages, setLanguages] = useState<Array<{ name: string; language_code: string }>>([]);
  const [voices, setVoices] = useState<Array<{ id: string; name: string; language: string; sampleRate: number }>>([]);
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('fr-FR');
  const [selectedVoice, setSelectedVoice] = useState('aura-asteria-fr');
  const [audioFormat, setAudioFormat] = useState<'pcm_s16le' | 'opus'>('pcm_s16le');
  const [sampleRate] = useState(16000);
  const [channels] = useState(1);
  const [interimTranscripts, setInterimTranscripts] = useState(true);
  const [finalTranscripts, setFinalTranscripts] = useState(true);
  const [translateTranscripts, setTranslateTranscripts] = useState(true);
  const [vocabularyText, setVocabularyText] = useState('QuickBooks, Sovereign Mesh, Ethereum, Finicity, Jose JWE');
  const [customUtterance, setCustomUtterance] = useState('Welcome to the executive meeting. Krisp AI voice translation is streaming 16kHz audio.');
  const [translating, setTranslating] = useState(false);
  const [sessionEvents, setSessionEvents] = useState<any[]>([]);
  const [simulatedError, setSimulatedError] = useState<number | null>(null);

  // --- Zapier Hub States ---
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [runningZap, setRunningZap] = useState<string | null>(null);
  const [zapLogs, setZapLogs] = useState<any[]>([]);
  const [meetingTitle, setMeetingTitle] = useState('Q3 Executive Strategy & Enterprise Expansion');
  const [noiseRemovalActive, setNoiseRemovalActive] = useState(true);
  const [simulatedTranscript, setSimulatedTranscript] = useState(
    'John Doe: Welcome everyone to the executive sync. Krisp noise cancellation is active, filtering 99.4% background keyboard and fan sounds.\nJane Smith: We reviewed the Citibank and FDX banking integrations, plus the new card vault catalog.\nAlex Wu: Action item: Set up Zapier webhooks to auto-post meeting summaries to HubSpot and Slack.'
  );
  const [executingSimulation, setExecutingSimulation] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // --- GovInfo / Congress.gov States ---
  const [govQuery, setGovQuery] = useState('collection:(BILLS) and banking');
  const [govCollection, setGovCollection] = useState('BILLS');
  const [govResults, setGovResults] = useState<any[]>([]);
  const [searchingGov, setSearchingGov] = useState(false);
  const [congressBills, setCongressBills] = useState<any[]>([]);

  // Fetch supported languages & voices on mount
  useEffect(() => {
    fetch('/voice-translation/languages')
      .then((r) => r.json())
      .then((d) => {
        if (d?.data) setLanguages(d.data);
      })
      .catch(() => {});

    fetch('/api/krisp/voices')
      .then((r) => r.json())
      .then((d) => {
        if (d?.voices) setVoices(d.voices);
      })
      .catch(() => {});

    fetch('/api/congress/bills')
      .then((r) => r.json())
      .then((d) => {
        if (d?.bills) setCongressBills(d.bills);
      })
      .catch(() => {});
  }, []);

  const handleExecuteVoiceTranslation = async () => {
    setTranslating(true);
    try {
      const vocabList = vocabularyText.split(',').map((v) => v.trim()).filter(Boolean);
      const res = await fetch('/api/krisp/voice-translation/translate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: customUtterance,
          source_language: sourceLang,
          target_language: targetLang,
          voice: selectedVoice,
          audio: { format: audioFormat, sample_rate: sampleRate, channels },
          vocabulary: vocabList,
          transcript: { interim: interimTranscripts, final: finalTranscripts, translate: translateTranscripts }
        })
      });

      const data = await res.json();
      if (data?.events) {
        setSessionEvents((prev) => [...data.events, ...prev]);
      }
    } catch (err: any) {
      console.error('Translation error:', err);
    } finally {
      setTranslating(false);
    }
  };

  const handleSimulateError = async (code: number) => {
    setSimulatedError(code);
    try {
      const res = await fetch('/api/krisp/simulate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'error', code, reference_id: `ref_err_${Date.now()}` })
      });
      const data = await res.json();
      setSessionEvents((prev) => [data, ...prev]);
    } catch (e) {
    } finally {
      setTimeout(() => setSimulatedError(null), 1000);
    }
  };

  const handleGovSearch = async () => {
    setSearchingGov(true);
    try {
      const res = await fetch('/api/govinfo/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: govQuery, pageSize: '10' })
      });
      const data = await res.json();
      setGovResults(data.results || data.packages || []);
    } catch (err) {
      console.error('GovInfo search error:', err);
    } finally {
      setSearchingGov(false);
    }
  };

  const handleRunZap = async (zap: ZapIntegrationItem) => {
    setRunningZap(zap.id);
    try {
      const res = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'krisp_meeting_automation',
          arguments: {
            action: 'trigger_zap',
            payload: { zapTitle: zap.title, trigger: zap.trigger, action: zap.action }
          }
        })
      });
      const data = await res.json();
      setZapLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          title: zap.title,
          status: 'SUCCESS',
          timestamp: new Date().toLocaleTimeString(),
          details: data.result || data
        },
        ...prev
      ]);
    } catch (err: any) {
      setZapLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          title: zap.title,
          status: 'ERROR',
          timestamp: new Date().toLocaleTimeString(),
          details: err.message
        },
        ...prev
      ]);
    } finally {
      setRunningZap(null);
    }
  };

  const handleSimulateMeeting = async () => {
    setExecutingSimulation(true);
    try {
      const res = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'krisp_meeting_automation',
          arguments: {
            action: 'generate_summary_and_zap',
            payload: {
              meetingTitle,
              noiseCancellation: noiseRemovalActive ? '99.4% Active' : 'Disabled',
              transcript: simulatedTranscript,
              zapTitle: 'Krisp + HubSpot / Slack Enterprise Sync'
            }
          }
        })
      });
      const data = await res.json();
      setSimulationResult(data.result || data);
    } catch (err: any) {
      setSimulationResult({ error: err.message });
    } finally {
      setExecutingSimulation(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = ['ALL', ...Array.from(new Set(ZAPIER_INTEGRATIONS.map((z) => z.category)))];
  const filteredZaps =
    selectedCategory === 'ALL'
      ? ZAPIER_INTEGRATIONS
      : ZAPIER_INTEGRATIONS.filter((z) => z.category === selectedCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#161B22] via-[#0D1117] to-[#1F1429] border border-[#30363D] p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-lg shadow-pink-500/20">
              <div className="w-full h-full bg-[#0D1117] rounded-2xl flex items-center justify-center p-2.5">
                <KrispLogo className="w-10 h-10" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Krisp AI Voice/Video Translation & GovInfo Open Mesh
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  v2.4 REAL-TIME WSS
                </span>
              </div>
              <p className="text-sm text-[#8B949E] max-w-2xl">
                Real-time 16kHz binary PCM voice translation streaming, BCP-47 dynamic language routing, 25 Zapier automations, and GovInfo / Congress.gov federal open legislative APIs.
              </p>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex items-center p-1 bg-[#0D1117] rounded-xl border border-[#30363D] space-x-1">
            <button
              onClick={() => setActiveTab('voice-translation')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'voice-translation'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-[#8B949E] hover:text-white'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Voice Translation Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('zapier-mesh')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'zapier-mesh'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-[#8B949E] hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>25 Zapier Automations</span>
            </button>
            <button
              onClick={() => setActiveTab('govinfo-congress')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'govinfo-congress'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-[#8B949E] hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>GovInfo & Congress.gov</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: REAL-TIME VOICE TRANSLATION ENGINE */}
      {activeTab === 'voice-translation' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Stream Configuration */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                  <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-pink-400" />
                    <span>Session Configuration Parameters</span>
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    PCM_S16LE 16kHz
                  </span>
                </div>

                {/* Source & Target Language Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#8B949E] uppercase mb-1">
                      source_language (BCP-47)
                    </label>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                    >
                      {languages.map((l) => (
                        <option key={`src-${l.language_code}`} value={l.language_code}>
                          {l.name} ({l.language_code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8B949E] uppercase mb-1">
                      target_language (BCP-47)
                    </label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                    >
                      {languages.map((l) => (
                        <option key={`tgt-${l.language_code}`} value={l.language_code}>
                          {l.name} ({l.language_code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Synthetic Voice Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#8B949E] uppercase mb-1 flex items-center justify-between">
                    <span>voice ID (Translated Output)</span>
                    <span className="text-pink-400 font-mono text-[10px]">REQUIRED</span>
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                  >
                    {voices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Audio Format & Protocol Specs */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D]">
                    <div className="text-[#8B949E] text-[10px]">audio.format</div>
                    <select
                      value={audioFormat}
                      onChange={(e) => setAudioFormat(e.target.value as any)}
                      className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="pcm_s16le">pcm_s16le</option>
                      <option value="opus">opus</option>
                    </select>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D]">
                    <div className="text-[#8B949E] text-[10px]">audio.sample_rate</div>
                    <div className="text-white font-bold">16000 Hz</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#30363D]">
                    <div className="text-[#8B949E] text-[10px]">audio.channels</div>
                    <div className="text-white font-bold">1 (Mono)</div>
                  </div>
                </div>

                {/* Vocabulary & Terminology Recognition */}
                <div>
                  <label className="block text-xs font-bold text-[#8B949E] uppercase mb-1">
                    vocabulary (Domain-Specific Terms)
                  </label>
                  <input
                    type="text"
                    value={vocabularyText}
                    onChange={(e) => setVocabularyText(e.target.value)}
                    placeholder="Comma-separated terminology"
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Transcript Event Emission Switches */}
                <div className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2 text-xs">
                  <div className="text-[#8B949E] font-bold text-[10px] uppercase">
                    Transcript Event Flags
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex items-center space-x-1.5 cursor-pointer text-[#C9D1D9]">
                      <input
                        type="checkbox"
                        checked={interimTranscripts}
                        onChange={(e) => setInterimTranscripts(e.target.checked)}
                        className="rounded border-[#30363D] text-pink-500 focus:ring-0"
                      />
                      <span>transcript.interim</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer text-[#C9D1D9]">
                      <input
                        type="checkbox"
                        checked={finalTranscripts}
                        onChange={(e) => setFinalTranscripts(e.target.checked)}
                        className="rounded border-[#30363D] text-pink-500 focus:ring-0"
                      />
                      <span>transcript.final</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer text-[#C9D1D9]">
                      <input
                        type="checkbox"
                        checked={translateTranscripts}
                        onChange={(e) => setTranslateTranscripts(e.target.checked)}
                        className="rounded border-[#30363D] text-pink-500 focus:ring-0"
                      />
                      <span>transcript.translate</span>
                    </label>
                  </div>
                </div>

                {/* Error Simulator Buttons (400, 401, 402, 403, 429, 500) */}
                <div className="pt-2 border-t border-[#30363D]">
                  <div className="text-[#8B949E] text-[10px] font-bold uppercase mb-2">
                    Simulate Server Error Codes:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[400, 401, 402, 403, 429, 500].map((code) => (
                      <button
                        key={code}
                        onClick={() => handleSimulateError(code)}
                        disabled={simulatedError === code}
                        className="px-2.5 py-1 rounded bg-[#0D1117] hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold transition-all cursor-pointer"
                      >
                        HTTP {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Audio Stream & Event Frame Console */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-pink-400" />
                    <h2 className="text-sm font-bold text-white">Live Utterance & Binary Frame Simulator</h2>
                  </div>
                  <span className="text-[10px] font-mono text-[#8B949E]">
                    Opcode 0x2 (Audio) / 0x1 (JSON Events)
                  </span>
                </div>

                {/* Input Speech Utterance */}
                <div>
                  <label className="block text-xs font-bold text-[#8B949E] uppercase mb-1">
                    Input Speech Audio Utterance (Raw 16kHz Simulation)
                  </label>
                  <textarea
                    rows={3}
                    value={customUtterance}
                    onChange={(e) => setCustomUtterance(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleExecuteVoiceTranslation}
                    disabled={translating || !customUtterance.trim()}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Play className={`w-4 h-4 ${translating ? 'animate-spin' : ''}`} />
                    <span>{translating ? 'Synthesizing Stream...' : 'Stream Binary Audio & Translate'}</span>
                  </button>
                  <button
                    onClick={() => setSessionEvents([])}
                    className="px-4 py-3 rounded-xl bg-[#0D1117] hover:bg-[#21262d] text-[#8B949E] hover:text-white border border-[#30363D] text-xs font-bold transition-all cursor-pointer"
                  >
                    Clear Stream
                  </button>
                </div>

                {/* Live WebSocket Event Stream Frames */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#8B949E] uppercase">
                    <span>Emitted WebSocket JSON Frames ({sessionEvents.length})</span>
                    <span className="text-[10px] font-mono text-pink-400">Server -&gt; Client (0x1)</span>
                  </div>

                  <div className="h-80 overflow-y-auto space-y-3 p-3 bg-[#0D1117] rounded-xl border border-[#30363D] font-mono text-xs">
                    {sessionEvents.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-[#8B949E] space-y-2">
                        <Terminal className="w-8 h-8 text-[#30363D]" />
                        <p>No WebSocket frames received yet. Click "Stream Binary Audio" to initiate translation.</p>
                      </div>
                    ) : (
                      sessionEvents.map((evt, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border transition-all ${
                            evt.error
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                              : evt.translate
                              ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold mb-1 opacity-75">
                            <span>
                              {evt.error ? 'SERVER_EVENT: ERROR' : evt.translate ? 'SERVER_EVENT: TRANSLATE' : 'SERVER_EVENT: TRANSCRIPT'}
                            </span>
                            <span>{new Date().toLocaleTimeString()}</span>
                          </div>
                          <pre className="text-[11px] overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(evt, null, 2)}
                          </pre>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ZAPIER 25 AUTOMATION MESH */}
      {activeTab === 'zapier-mesh' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Krisp Noise Removal & Meeting Simulator */}
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div className="flex items-center space-x-3">
                <Mic className="w-5 h-5 text-pink-400" />
                <h3 className="text-sm font-bold text-white">Krisp Meeting Audio AI Simulator</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#8B949E] font-mono">Noise Cancellation:</span>
                <button
                  onClick={() => setNoiseRemovalActive(!noiseRemovalActive)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    noiseRemovalActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {noiseRemovalActive ? '99.4% Active' : 'Off'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8B949E] uppercase mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSimulateMeeting}
                  disabled={executingSimulation}
                  className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{executingSimulation ? 'Analyzing...' : 'Generate AI Summary & Trigger Zap'}</span>
                </button>
              </div>
            </div>

            {simulationResult && (
              <div className="p-4 rounded-xl bg-[#0D1117] border border-pink-500/30 text-xs font-mono space-y-2">
                <div className="text-pink-400 font-bold">Meeting Assistant Summary Generated:</div>
                <pre className="text-[#C9D1D9] whitespace-pre-wrap">
                  {JSON.stringify(simulationResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* 25 Zapier Integrations Grid */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>25 Pre-Configured Enterprise Zapier Automations</span>
              </h3>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredZaps.map((zap) => (
                <div
                  key={zap.id}
                  className="bg-[#161B22] rounded-2xl border border-[#30363D] hover:border-purple-500/50 p-5 space-y-4 shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                        {zap.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{zap.title}</h4>
                    <p className="text-xs text-[#8B949E] line-clamp-2">{zap.description}</p>
                  </div>

                  <button
                    onClick={() => handleRunZap(zap)}
                    disabled={runningZap === zap.id}
                    className="w-full py-2 rounded-xl bg-[#0D1117] hover:bg-purple-600/20 hover:border-purple-500/40 text-white text-xs font-bold border border-[#30363D] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${runningZap === zap.id ? 'animate-spin' : ''}`} />
                    <span>{runningZap === zap.id ? 'Executing...' : 'Trigger Zap'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GOVINFO & CONGRESS.GOV OPEN LEGISLATIVE DATA */}
      {activeTab === 'govinfo-congress' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* GovInfo Search Panel */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>GovInfo Federal Documents Search</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                    api.govinfo.gov
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#8B949E] uppercase mb-1">
                      Search Query String
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={govQuery}
                        onChange={(e) => setGovQuery(e.target.value)}
                        placeholder="e.g. collection:(BILLS) and banking"
                        className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleGovSearch}
                        disabled={searchingGov}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Search</span>
                      </button>
                    </div>
                  </div>

                  <div className="h-64 overflow-y-auto space-y-2 p-3 bg-[#0D1117] rounded-xl border border-[#30363D] text-xs font-mono">
                    {govResults.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[#8B949E]">
                        Enter query and click search to query GovInfo packages.
                      </div>
                    ) : (
                      govResults.map((r, i) => (
                        <div key={i} className="p-2.5 rounded bg-[#161B22] border border-[#30363D] space-y-1">
                          <div className="text-blue-300 font-bold">{r.title || r.packageId}</div>
                          <div className="text-[#8B949E] text-[10px] flex justify-between">
                            <span>ID: {r.packageId}</span>
                            <span>Issued: {r.dateIssued || r.lastModified}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Congress.gov Active Bills Panel */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>Congress.gov REST API v3 Active Legislation</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    api.congress.gov
                  </span>
                </div>

                <div className="h-80 overflow-y-auto space-y-3 p-3 bg-[#0D1117] rounded-xl border border-[#30363D] text-xs font-mono">
                  {congressBills.map((b, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#161B22] border border-[#30363D] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                          {b.originChamber?.toUpperCase()} {b.type?.toUpperCase()} {b.number}
                        </span>
                        <span className="text-[#8B949E] text-[10px]">118th Congress</span>
                      </div>
                      <div className="text-white font-bold">{b.title}</div>
                      <div className="text-[#8B949E] text-[11px]">
                        Latest Action: {b.latestAction?.text || 'Introduced in Congress'}
                      </div>
                      {b.sponsors && (
                        <div className="text-purple-300 text-[10px]">
                          Sponsor: {b.sponsors[0]?.fullName || 'Congressional Sponsor'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KrispZapierHub;
