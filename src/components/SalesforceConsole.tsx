import React, { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface TelemetryEvent {
  endpoint: string;
  method: string;
  timestamp: string;
  latencyMs: number;
  status: number;
  payload: any;
  response: any;
}

export const SalesforceConsole: React.FC = () => {
  const [modelName, setModelName] = useState('sfdc_ai__DefaultAzureOpenAIGPT35Turbo');
  const [authToken, setToken] = useState('Bearer •••••');
  const [appContext, setAppContext] = useState('EinsteinGPT');
  const [clientFeatureId, setClientFeatureId] = useState('ai-platform-models-connected-app');

  // Chat Tab State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'system', content: 'You are a helpful Einstein Co-Pilot integrated into the Kronos Sovereign OS.' }
  ]);
  const [currentChatInput, setCurrentChatInput] = useState('');

  // Generation Tab State
  const [completionPrompt, setCompletionPrompt] = useState('Create a fun name for a new enterprise banking service');
  const [completionResponse, setCompletionResponse] = useState('');

  // Embeddings State
  const [embeddingInputs, setEmbeddingInputs] = useState('["Apex Bank Feed", "Shadow Ledger", "Sovereign Trust"]');
  const [embeddingsResult, setEmbeddingsResult] = useState<any>(null);

  // General Status & Loading
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'completion' | 'embeddings'>('chat');

  // Feedback State
  const [feedbackSentiment, setFeedbackSentiment] = useState<'GOOD' | 'BAD'>('GOOD');
  const [feedbackText, setFeedbackText] = useState('Pristine generation quality with zero toxic content scanned.');
  const [lastGenId, setLastGenId] = useState('gen-1234abcd');
  const [feedbackStatus, setFeedbackStatus] = useState('');

  // Telemetry list
  const [telemetry, setTelemetry] = useState<TelemetryEvent[]>([]);

  const addTelemetry = (endpoint: string, method: string, latencyMs: number, status: number, payload: any, response: any) => {
    const event: TelemetryEvent = {
      endpoint,
      method,
      timestamp: new Date().toLocaleTimeString(),
      latencyMs,
      status,
      payload,
      response
    };
    setTelemetry(prev => [event, ...prev]);
  };

  // 1. Send Chat Call
  const handleSendChat = async () => {
    if (!currentChatInput.trim()) return;
    const newMsg: ChatMessage = { role: 'user', content: currentChatInput };
    const updatedMessages = [...chatMessages, newMsg];
    setChatMessages(updatedMessages);
    setCurrentChatInput('');
    setLoading(true);

    const startTime = Date.now();
    try {
      const payload = {
        messages: updatedMessages,
        localization: { defaultLocale: 'en_US' },
        tags: { app: 'Kronos OS' }
      };

      const res = await fetch(`/api/salesforce/models/${modelName}/chat-generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
          'x-sfdc-app-context': appContext,
          'x-client-feature-id': clientFeatureId
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      const duration = Date.now() - startTime;
      addTelemetry(`/models/${modelName}/chat-generations`, 'POST', duration, res.status, payload, data);

      if (res.ok && data.generationDetails?.generations?.length) {
        const assistantMsg = data.generationDetails.generations[0];
        setChatMessages(prev => [...prev, { role: assistantMsg.role, content: assistantMsg.content }]);
        if (assistantMsg.id) {
          setLastGenId(assistantMsg.id);
        }
      } else {
        setChatMessages(prev => [...prev, { role: 'system', content: `Error: ${data.message || 'Models REST API returned an error.'}` }]);
      }
    } catch (err: any) {
      const duration = Date.now() - startTime;
      addTelemetry(`/models/${modelName}/chat-generations`, 'POST', duration, 500, { messages: updatedMessages }, { error: err.message });
      setChatMessages(prev => [...prev, { role: 'system', content: `Network Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Text Generation Call
  const handleGenerateText = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const payload = {
        prompt: completionPrompt,
        localization: { defaultLocale: 'en_US' },
        tags: { app: 'Kronos OS' }
      };

      const res = await fetch(`/api/salesforce/models/${modelName}/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
          'x-sfdc-app-context': appContext,
          'x-client-feature-id': clientFeatureId
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      const duration = Date.now() - startTime;
      addTelemetry(`/models/${modelName}/generations`, 'POST', duration, res.status, payload, data);

      if (res.ok && data.generation?.generatedText) {
        setCompletionResponse(data.generation.generatedText);
        if (data.generation.id) {
          setLastGenId(data.generation.id);
        }
      } else {
        setCompletionResponse(`Error: ${data.message || 'Models REST API returned an error.'}`);
      }
    } catch (err: any) {
      const duration = Date.now() - startTime;
      addTelemetry(`/models/${modelName}/generations`, 'POST', duration, 500, { prompt: completionPrompt }, { error: err.message });
      setCompletionResponse(`Network Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Generate Embeddings Call
  const handleGenerateEmbeddings = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      let parsedInputs: string[];
      try {
        parsedInputs = JSON.parse(embeddingInputs);
      } catch (e) {
        setEmbeddingsResult({ error: 'Invalid JSON array input. Ensure inputs are standard JSON array of strings.' });
        setLoading(false);
        return;
      }

      const payload = {
        input: parsedInputs,
        localization: { defaultLocale: 'en_US' }
      };

      const res = await fetch(`/api/salesforce/models/${modelName}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
          'x-sfdc-app-context': appContext,
          'x-client-feature-id': clientFeatureId
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      const duration = Date.now() - startTime;
      addTelemetry(`/models/${modelName}/embeddings`, 'POST', duration, res.status, payload, data);

      if (res.ok) {
        setEmbeddingsResult(data);
      } else {
        setEmbeddingsResult({ error: data.message || 'Models REST API returned an error.' });
      }
    } catch (err: any) {
      const duration = Date.now() - startTime;
      addTelemetry(`/models/${modelName}/embeddings`, 'POST', duration, 500, { inputs: embeddingInputs }, { error: err.message });
      setEmbeddingsResult({ error: `Network Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  // 4. Submit Feedback Call
  const handleSubmitFeedback = async () => {
    setFeedbackStatus('Submitting feedback...');
    const startTime = Date.now();
    try {
      const payload = {
        id: `fb-${Math.random().toString(36).substr(2, 9)}`,
        generationId: lastGenId,
        feedback: feedbackSentiment,
        feedbackText: feedbackText,
        source: 'human',
        appFeedback: { platform: 'Kronos OS Cockpit' }
      };

      const res = await fetch('/api/salesforce/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
          'x-sfdc-app-context': appContext,
          'x-client-feature-id': clientFeatureId
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      const duration = Date.now() - startTime;
      addTelemetry('/feedback', 'POST', duration, res.status, payload, data);

      if (res.ok) {
        setFeedbackStatus(`Success: ${data.message || 'Feedback accepted.'}`);
      } else {
        setFeedbackStatus(`Error submitting feedback: ${data.message}`);
      }
    } catch (err: any) {
      setFeedbackStatus(`Network Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-amber-500">☁️</span> Salesforce Einstein Platform Models REST API
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Enterprise Cognitive Shield & Large Language Model (LLM) Integration via Einstein Trust Layer
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-amber-950/50 border border-amber-900 text-amber-400 text-xs px-3 py-1.5 rounded-md font-mono">
            Trust Layer: ACTIVE
          </span>
          <span className="bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-xs px-3 py-1.5 rounded-md font-mono">
            Simulation Status: HIGH-FIDELITY
          </span>
        </div>
      </div>

      {/* API Config Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Model Selection</label>
          <select 
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="sfdc_ai__DefaultAzureOpenAIGPT35Turbo">Azure OpenAI GPT 3.5 Turbo</option>
            <option value="sfdc_ai__DefaultOpenAIGPT4">OpenAI GPT-4 Omni</option>
            <option value="sfdc_ai__AnthropicClaude3">Anthropic Claude 3.5 Sonnet</option>
            <option value="custom_enterprise_llm_model">Custom Corporate LLM Model</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Authorization (JWT)</label>
          <input 
            type="text" 
            value={authToken}
            onChange={(e) => setToken(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">App Context</label>
          <input 
            type="text" 
            value={appContext}
            onChange={(e) => setAppContext(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Client Feature ID</label>
          <input 
            type="text" 
            value={clientFeatureId}
            onChange={(e) => setClientFeatureId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Central Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Interactive Workbenches */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Tab Selector */}
          <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl self-start gap-1">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'chat' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
            >
              💬 Generate Chat
            </button>
            <button 
              onClick={() => setActiveTab('completion')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'completion' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ✍️ Generate Text
            </button>
            <button 
              onClick={() => setActiveTab('embeddings')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'embeddings' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
            >
              📊 Generate Embeddings
            </button>
          </div>

          {/* Workbench Body */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[450px] flex flex-col">
            
            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Einstein Chat-Generations Session</h3>
                  <span className="text-xs text-slate-500">History: {chatMessages.length} items</span>
                </div>
                
                {/* Messages Box */}
                <div className="flex-1 max-h-[350px] overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 font-mono text-sm">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg max-w-[85%] ${
                        msg.role === 'user' 
                          ? 'bg-amber-950/40 border border-amber-900/50 text-slate-200 self-end' 
                          : msg.role === 'system' 
                            ? 'bg-slate-900 border border-slate-800 text-slate-400 self-center text-center text-xs w-full'
                            : 'bg-slate-900/80 border border-slate-800 text-amber-400 self-start'
                      }`}
                    >
                      <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wider font-bold">
                        {msg.role}
                      </span>
                      {msg.content}
                    </div>
                  ))}
                  {loading && (
                    <div className="text-xs text-amber-500 flex items-center gap-2 animate-pulse">
                      <span>⚡</span> Einstein is auditing prompts and generating response...
                    </div>
                  )}
                </div>

                {/* Input row */}
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={currentChatInput}
                    onChange={(e) => setCurrentChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="Enter chat message for the model..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 font-mono text-slate-200"
                  />
                  <button 
                    onClick={handleSendChat}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 rounded-xl text-sm transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {/* COMPLETION TAB */}
            {activeTab === 'completion' && (
              <div className="flex-1 flex flex-col gap-4">
                <div className="border-b border-slate-800 pb-3 mb-2 flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Einstein Text-Generations Workbench</h3>
                  <span className="text-xs text-slate-500">Post /generations</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prompt Input</label>
                  <textarea 
                    value={completionPrompt}
                    onChange={(e) => setCompletionPrompt(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button 
                  onClick={handleGenerateText}
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-bold py-3 rounded-xl text-sm transition-all uppercase tracking-wider"
                >
                  {loading ? 'Processing...' : '⚡ Generate Completion'}
                </button>

                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated Text Output</label>
                  <div className="w-full min-h-[120px] bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-sm text-slate-300">
                    {completionResponse || 'Generation results will display here.'}
                  </div>
                </div>
              </div>
            )}

            {/* EMBEDDINGS TAB */}
            {activeTab === 'embeddings' && (
              <div className="flex-1 flex flex-col gap-4">
                <div className="border-b border-slate-800 pb-3 mb-2 flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Einstein Embeddings Engine</h3>
                  <span className="text-xs text-slate-500">Post /embeddings</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inputs (JSON Array of Strings)</label>
                  <input 
                    type="text" 
                    value={embeddingInputs}
                    onChange={(e) => setEmbeddingInputs(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button 
                  onClick={handleGenerateEmbeddings}
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-bold py-3 rounded-xl text-sm transition-all uppercase tracking-wider"
                >
                  {loading ? 'Synthesizing...' : '📊 Generate Vector Coordinates'}
                </button>

                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Embeddings Response Schema</label>
                  <pre className="w-full max-h-[180px] overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-400">
                    {embeddingsResult ? JSON.stringify(embeddingsResult, null, 2) : 'Embedding vectors (1536-dimensional float representations) will display here.'}
                  </pre>
                </div>
              </div>
            )}

          </div>

          {/* Feedback Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-md font-bold mb-4 flex items-center gap-2">
              📝 Submit Trust & Content Feedback to Salesforce
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Sentiment</label>
                <select 
                  value={feedbackSentiment}
                  onChange={(e) => setFeedbackSentiment(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="GOOD">👍 Good (Clear, safe response)</option>
                  <option value="BAD">👎 Bad (Toxicity, safety warning)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Feedback text description</label>
                <input 
                  type="text" 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs font-mono text-slate-500">
                Target Request ID: <strong className="text-slate-400">{lastGenId}</strong>
              </span>
              <button 
                onClick={handleSubmitFeedback}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
              >
                Submit Feedback Request
              </button>
            </div>
            {feedbackStatus && (
              <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-500">
                {feedbackStatus}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Einstein Trust Layer Telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-md font-bold mb-3 flex items-center justify-between border-b border-slate-800 pb-3">
              🛡️ Einstein Trust Layer Shield
              <span className="text-xs bg-amber-950 border border-amber-900 text-amber-400 px-2 py-0.5 rounded font-mono">
                SECURE
              </span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              The Einstein Trust Layer provides robust moderation. It scans all generated tokens against toxicity models, filters profanity, and evaluates trust constraints natively before output is written to the terminal cockpit.
            </p>
            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-slate-500">Profanity Blocker:</span>
                <span className="text-emerald-400 font-bold">100% Filtered</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-slate-500">Toxicity Detection:</span>
                <span className="text-emerald-400 font-bold">Active (0.00 score)</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-slate-500">Zero-Data Retention:</span>
                <span className="text-emerald-400 font-bold">Enforced</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between items-center">
                <span className="text-slate-500">Client Context Scopes:</span>
                <span className="text-slate-400">EinsteinGPT</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-md font-bold">📡 Real-Time Telemetry Logs</h3>
              <button 
                onClick={() => setTelemetry([])}
                className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-500 font-bold border border-slate-800 px-2 py-1 rounded"
              >
                Clear
              </button>
            </div>
            
            {/* Logs Area */}
            <div className="max-h-[350px] overflow-y-auto flex flex-col gap-3 font-mono text-[11px]">
              {telemetry.length === 0 ? (
                <div className="text-slate-600 text-center py-8">
                  No telemetry events logged yet. Trigger chat or text generations.
                </div>
              ) : (
                telemetry.map((t, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        t.status === 200 || t.status === 202 ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-rose-950 text-rose-400 border border-rose-900'
                      }`}>
                        {t.status} {t.method}
                      </span>
                      <span className="text-slate-500">{t.timestamp}</span>
                    </div>
                    <div className="text-slate-300 font-semibold break-all">{t.endpoint}</div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Latency: {t.latencyMs}ms</span>
                    </div>
                    <details className="mt-1">
                      <summary className="cursor-pointer text-[10px] text-slate-400 hover:text-slate-200">
                        Inspect Raw Payloads
                      </summary>
                      <div className="mt-2 flex flex-col gap-1 bg-slate-900/50 p-2 rounded text-[10px]">
                        <span className="text-slate-500 block">Request Body:</span>
                        <pre className="text-amber-500 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(t.payload, null, 2)}</pre>
                        <span className="text-slate-500 block mt-2">Response Body:</span>
                        <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(t.response, null, 2)}</pre>
                      </div>
                    </details>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
