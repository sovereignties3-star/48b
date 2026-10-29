import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Copy,
  Check,
  FileText,
  BarChart3,
  Building,
  Key,
  Database,
  ArrowRight,
  Clock,
  Layers,
  Search,
  ExternalLink,
  DollarSign,
  Activity,
  Terminal,
  Zap,
  Globe,
  Settings
} from 'lucide-react';

interface BatchItem {
  batchId: string;
  settlementTimeUTC: string;
  settlementTimeLocal?: string;
  settlementState: string;
  paymentMethod: string;
  marketType: string;
  product: string;
  statistics?: Array<{
    accountType: string;
    chargeAmount: number;
    chargeCount: number;
    refundAmount: number;
    refundCount: number;
    voidCount?: number;
    declineCount?: number;
    errorCount?: number;
  }>;
}

interface TransactionItem {
  transId: string;
  submitTimeUTC: string;
  submitTimeLocal?: string;
  status: string;
  responseCode: string;
  accountType: string;
  accountNumber: string;
  settleAmount: number;
  marketType?: string;
  product?: string;
}

export function AuthorizeNetConsole() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'batches' | 'transList' | 'unsettled' | 'merchant' | 'cim' | 'env'>('terminal');
  const [selectedTxType, setSelectedTxType] = useState<string>('priorAuthCaptureTransaction');
  const [codeLanguage, setCodeLanguage] = useState<'NODE' | 'JSON' | 'PHP' | 'CS' | 'JAVA' | 'PYTHON' | 'RUBY'>('JSON');
  const [executing, setExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Credentials
  const [apiLoginId, setApiLoginId] = useState('5KP3u95bQpv');
  const [transactionKey, setTransactionKey] = useState('346HZ32z3fP4hTG2');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');

  // Request & Response state
  const [requestPayload, setRequestPayload] = useState<string>('');
  const [responsePayload, setResponsePayload] = useState<any>(null);
  const [executionDurationMs, setExecutionDurationMs] = useState<number | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  // Reports data
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('984210');
  const [batchTransactions, setBatchTransactions] = useState<TransactionItem[]>([]);
  const [unsettledTransactions, setUnsettledTransactions] = useState<TransactionItem[]>([]);
  const [selectedTransDetails, setSelectedTransDetails] = useState<any>(null);
  const [merchantDetails, setMerchantDetails] = useState<any>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [closeBatchMsg, setCloseBatchMsg] = useState<string | null>(null);

  // Pre-configured Templates
  const templates: Record<string, any> = {
    priorAuthCaptureTransaction: {
      createTransactionRequest: {
        merchantAuthentication: {
          name: apiLoginId,
          transactionKey: transactionKey
        },
        transactionRequest: {
          transactionType: 'priorAuthCaptureTransaction',
          refTransId: '128'
        }
      }
    },
    authCaptureContinueTransaction: {
      createTransactionRequest: {
        merchantAuthentication: {
          name: apiLoginId,
          transactionKey: transactionKey
        },
        transactionRequest: {
          transactionType: 'authCaptureContinueTransaction',
          payment: {
            payPal: {
              payerID: 'S6D5ETGSVYX94'
            }
          },
          refTransId: '139'
        }
      }
    },
    authCaptureTransaction: {
      createTransactionRequest: {
        merchantAuthentication: {
          name: apiLoginId,
          transactionKey: transactionKey
        },
        transactionRequest: {
          transactionType: 'authCaptureTransaction',
          amount: '185.00',
          payment: {
            creditCard: {
              cardNumber: '4007000000027',
              expirationDate: '1228',
              cardCode: '900'
            }
          },
          order: {
            invoiceNumber: 'INV-2026-904',
            description: 'Apex Cloud Terminal Services'
          },
          billTo: {
            firstName: 'David',
            lastName: 'Holloway',
            company: 'Sovereign Core Systems LLC',
            address: '100 Financial Center Blvd',
            city: 'New York',
            state: 'NY',
            zip: '10004',
            country: 'USA'
          }
        }
      }
    },
    authOnlyTransaction: {
      createTransactionRequest: {
        merchantAuthentication: {
          name: apiLoginId,
          transactionKey: transactionKey
        },
        transactionRequest: {
          transactionType: 'authOnlyTransaction',
          amount: '750.00',
          payment: {
            creditCard: {
              cardNumber: '4007000000027',
              expirationDate: '1228',
              cardCode: '900'
            }
          },
          order: {
            invoiceNumber: 'INV-AUTH-ONLY-01',
            description: 'Security Deposit Pre-Authorization Hold'
          }
        }
      }
    },
    refundTransaction: {
      createTransactionRequest: {
        merchantAuthentication: {
          name: apiLoginId,
          transactionKey: transactionKey
        },
        transactionRequest: {
          transactionType: 'refundTransaction',
          amount: '50.00',
          payment: {
            creditCard: {
              cardNumber: 'XXXX0015',
              expirationDate: 'XXXX'
            }
          },
          refTransId: '128'
        }
      }
    }
  };

  // Sync template on transaction type change
  useEffect(() => {
    const tmpl = templates[selectedTxType] || templates.priorAuthCaptureTransaction;
    // update auth in template
    tmpl.createTransactionRequest.merchantAuthentication.name = apiLoginId;
    tmpl.createTransactionRequest.merchantAuthentication.transactionKey = transactionKey;
    setRequestPayload(JSON.stringify(tmpl, null, 2));
  }, [selectedTxType, apiLoginId, transactionKey]);

  // Load initial reports data on mount
  useEffect(() => {
    fetchBatches();
    fetchUnsettled();
    fetchMerchantDetails();
  }, []);

  const fetchBatches = async () => {
    setBatchLoading(true);
    try {
      const res = await fetch('/api/authorizenet/getSettledBatchListRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          getSettledBatchListRequest: {
            merchantAuthentication: { name: apiLoginId, transactionKey: transactionKey },
            includeStatistics: true
          }
        })
      });
      const data = await res.json();
      if (data.batchList) {
        setBatches(data.batchList);
        if (data.batchList[0]) {
          setSelectedBatchId(data.batchList[0].batchId);
          fetchBatchTransactions(data.batchList[0].batchId);
        }
      }
    } catch (e) {
      console.error('Failed to fetch settled batches:', e);
    } finally {
      setBatchLoading(false);
    }
  };

  const fetchBatchTransactions = async (batchId: string) => {
    try {
      const res = await fetch('/api/authorizenet/getTransactionListRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          getTransactionListRequest: {
            merchantAuthentication: { name: apiLoginId, transactionKey: transactionKey },
            batchId
          }
        })
      });
      const data = await res.json();
      if (data.transactions) {
        setBatchTransactions(data.transactions);
      }
    } catch (e) {
      console.error('Failed to fetch transactions for batch:', e);
    }
  };

  const fetchUnsettled = async () => {
    try {
      const res = await fetch('/api/authorizenet/getUnsettledTransactionListRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          getUnsettledTransactionListRequest: {
            merchantAuthentication: { name: apiLoginId, transactionKey: transactionKey }
          }
        })
      });
      const data = await res.json();
      if (data.transactions) {
        setUnsettledTransactions(data.transactions);
      }
    } catch (e) {
      console.error('Failed to fetch unsettled transactions:', e);
    }
  };

  const fetchTransDetails = async (transId: string) => {
    try {
      const res = await fetch('/api/authorizenet/getTransactionDetailsRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          getTransactionDetailsRequest: {
            merchantAuthentication: { name: apiLoginId, transactionKey: transactionKey },
            transId
          }
        })
      });
      const data = await res.json();
      if (data.transaction) {
        setSelectedTransDetails(data.transaction);
      }
    } catch (e) {
      console.error('Failed to fetch transaction details:', e);
    }
  };

  const fetchMerchantDetails = async () => {
    try {
      const res = await fetch('/api/authorizenet/getMerchantDetailsRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          getMerchantDetailsRequest: {
            merchantAuthentication: { name: apiLoginId, transactionKey: transactionKey }
          }
        })
      });
      const data = await res.json();
      setMerchantDetails(data);
    } catch (e) {
      console.error('Failed to fetch merchant details:', e);
    }
  };

  const handleCloseBatch = async () => {
    try {
      const res = await fetch('/api/authorizenet/closeCurrentBatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setCloseBatchMsg(data.message);
      fetchBatches();
      fetchUnsettled();
      setTimeout(() => setCloseBatchMsg(null), 4000);
    } catch (e: any) {
      setCloseBatchMsg('Error closing batch: ' + e.message);
    }
  };

  const handleExecute = async () => {
    setExecuting(true);
    setResponsePayload(null);
    setExecutionDurationMs(null);
    setResponseStatus(null);
    const start = performance.now();

    try {
      let parsedBody: any;
      try {
        parsedBody = JSON.parse(requestPayload);
      } catch (err: any) {
        setResponsePayload({
          error: 'Invalid JSON request format',
          syntaxError: err.message
        });
        setResponseStatus(400);
        setExecuting(false);
        return;
      }

      const res = await fetch('/api/authorizenet/createTransactionRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(parsedBody)
      });

      const end = performance.now();
      setExecutionDurationMs(Math.round(end - start));
      setResponseStatus(res.status);

      const contentType = res.headers.get('content-type') || '';
      let data: any;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { rawResponse: text };
        }
      }

      setResponsePayload(data);
      // Refresh unsettled list and batches
      fetchUnsettled();
      fetchBatches();
    } catch (err: any) {
      const end = performance.now();
      setExecutionDurationMs(Math.round(end - start));
      setResponseStatus(500);
      setResponsePayload({
        error: err.message || 'Gateway connection failed',
        hint: 'Verify API credentials and network connectivity.'
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleCopy = (text: string, isResponse = false) => {
    navigator.clipboard.writeText(text);
    if (isResponse) {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate code snippet based on selected language
  const getCodeSnippet = () => {
    if (codeLanguage === 'NODE') {
      return `const axios = require('axios');

const endpoint = '${environment === 'production' ? 'https://api.authorize.net/xml/v1/request.api' : 'https://apitest.authorize.net/xml/v1/request.api'}';

const payload = ${requestPayload};

async function executeTransaction() {
  try {
    const response = await axios.post(endpoint, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Authorize.Net Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

executeTransaction();`;
    }

    if (codeLanguage === 'PHP') {
      return `<?php
require 'vendor/autoload.php';
use net\\authorize\\api\\contract\\v1 as AnetAPI;
use net\\authorize\\api\\controller as AnetController;

define("AUTHORIZENET_LOG_FILE", "phplog");

$merchantAuthentication = new AnetAPI\\MerchantAuthenticationType();
$merchantAuthentication->setName("${apiLoginId}");
$merchantAuthentication->setTransactionKey("${transactionKey}");

$transactionRequestType = new AnetAPI\\TransactionRequestType();
$transactionRequestType->setTransactionType("${selectedTxType}");
$transactionRequestType->setRefTransId("128");

$request = new AnetAPI\\CreateTransactionRequest();
$request->setMerchantAuthentication($merchantAuthentication);
$request->setTransactionRequest($transactionRequestType);

$controller = new AnetController\\CreateTransactionController($request);
$response = $controller->executeWithApiResponse(\\net\\authorize\\api\\constants\\ANetEnvironment::SANDBOX);
print_r($response);
?>`;
    }

    if (codeLanguage === 'PYTHON') {
      return `import requests
import json

url = "${environment === 'production' ? 'https://api.authorize.net/xml/v1/request.api' : 'https://apitest.authorize.net/xml/v1/request.api'}"
payload = ${requestPayload}

headers = {"Content-Type": "application/json"}
response = requests.post(url, json=payload, headers=headers)
print("Status:", response.status_code)
print("Response:", json.dumps(response.json(), indent=2))`;
    }

    return requestPayload;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0d1f18] via-[#122820] to-[#0d1f18] rounded-2xl border border-emerald-500/30 p-6 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Authorize.Net</h1>
                <span className="text-xs font-mono uppercase bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                  Enterprise Gateway & Reports
                </span>
                <span className="text-xs font-mono uppercase bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                  XML/JSON v1.0
                </span>
                <span className="text-xs font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  Visa Solution
                </span>
              </div>
              <p className="text-sm text-gray-300">
                Payment Gateway, Prior Auth Captures, PayPal Continued Flows, Settled Batch Forensics, and CIM Profiles
              </p>
            </div>
          </div>
        </div>

        {/* Quick Credentials Summary Card */}
        <div className="z-10 bg-black/40 backdrop-blur border border-emerald-500/20 rounded-xl p-3 text-xs space-y-1.5 min-w-[260px]">
          <div className="flex items-center justify-between text-gray-400">
            <span>API Login ID:</span>
            <span className="font-mono text-emerald-400 font-semibold">{apiLoginId}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Transaction Key:</span>
            <span className="font-mono text-emerald-400">{transactionKey.slice(0, 4)}••••{transactionKey.slice(-4)}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Environment:</span>
            <span className={`font-mono font-semibold uppercase ${environment === 'production' ? 'text-rose-400' : 'text-cyan-400'}`}>
              {environment}
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-400 pt-1 border-t border-emerald-500/20">
            <span>Unsettled Queue:</span>
            <span className="font-mono text-amber-400 font-bold">{unsettledTransactions.length} items</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-800 space-x-1 sm:space-x-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: 'terminal', label: 'API Live Console', icon: Terminal },
          { id: 'batches', label: 'Settled Batches Report', icon: BarChart3 },
          { id: 'transList', label: 'Transactions Forensics', icon: Layers },
          { id: 'unsettled', label: `Unsettled Queue (${unsettledTransactions.length})`, icon: Clock },
          { id: 'merchant', label: 'Merchant Details', icon: Building },
          { id: 'cim', label: 'Customer Profiles (CIM)', icon: Database },
          { id: 'env', label: 'API Keys & Configuration', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: API Live Console & Terminal */}
      {activeTab === 'terminal' && (
        <div className="space-y-6">
          {/* Transaction Type Selector Bar */}
          <div className="bg-[#12161f] border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 uppercase font-semibold">Transaction Type:</span>
              {[
                { id: 'priorAuthCaptureTransaction', label: 'Prior Auth Capture (#128)' },
                { id: 'authCaptureContinueTransaction', label: 'Auth & Capture Continued (PayPal #139)' },
                { id: 'authCaptureTransaction', label: 'Authorize & Capture (Card)' },
                { id: 'authOnlyTransaction', label: 'Authorize Only' },
                { id: 'refundTransaction', label: 'Refund Transaction' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTxType(t.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                    selectedTxType === t.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                      : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-gray-800">
              {(['JSON', 'NODE', 'PHP', 'PYTHON'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setCodeLanguage(lang)}
                  className={`px-2.5 py-1 text-xs font-mono rounded ${
                    codeLanguage === lang
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Workbench Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Request Console */}
            <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 space-y-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">Request:</span>
                  <span className="text-xs text-gray-400 font-mono">POST /xml/v1/request.api</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(getCodeSnippet())}
                    className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded border border-gray-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Code/Payload Editor */}
              <div className="flex-1">
                <textarea
                  value={codeLanguage === 'JSON' ? requestPayload : getCodeSnippet()}
                  onChange={e => {
                    if (codeLanguage === 'JSON') setRequestPayload(e.target.value);
                  }}
                  readOnly={codeLanguage !== 'JSON'}
                  className="w-full h-96 bg-black/60 border border-gray-800 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500/60 leading-relaxed resize-none shadow-inner"
                  spellCheck={false}
                />
              </div>

              {/* Action Trigger Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Target Gateway: <span className="text-gray-300 font-mono">{environment === 'production' ? 'api.authorize.net' : 'apitest.authorize.net'}</span>
                </span>
                <button
                  onClick={handleExecute}
                  disabled={executing}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                  {executing ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-black" />
                      <span>Execute Transaction</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Response Console */}
            <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 space-y-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-white">Response:</span>
                  {responseStatus && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${
                        responseStatus === 200
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      HTTP {responseStatus}
                    </span>
                  )}
                  {executionDurationMs !== null && (
                    <span className="text-xs text-gray-400 font-mono">
                      ⏱️ {executionDurationMs}ms
                    </span>
                  )}
                </div>
                {responsePayload && (
                  <button
                    onClick={() => handleCopy(JSON.stringify(responsePayload, null, 2), true)}
                    className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded border border-gray-700 transition-colors"
                  >
                    {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {/* Status Badge when response arrives */}
              {responsePayload?.transactionResponse && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    responsePayload.transactionResponse.responseCode === '1'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {responsePayload.transactionResponse.responseCode === '1' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>
                      {responsePayload.transactionResponse.responseCode === '1'
                        ? `Approved (Auth: ${responsePayload.transactionResponse.authCode || 'AUTH01'}) - TransId: ${responsePayload.transactionResponse.transId}`
                        : `Declined / Error (${responsePayload.messages?.message?.[0]?.text || 'Unsuccessful'})`}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] space-x-2">
                    {responsePayload.transactionResponse.avsResultCode && (
                      <span className="bg-black/40 px-1.5 py-0.5 rounded">AVS: {responsePayload.transactionResponse.avsResultCode}</span>
                    )}
                    {responsePayload.transactionResponse.cvvResultCode && (
                      <span className="bg-black/40 px-1.5 py-0.5 rounded">CVV: {responsePayload.transactionResponse.cvvResultCode}</span>
                    )}
                  </div>
                </div>
              )}

              {/* JSON Viewer */}
              <div className="flex-1">
                <pre className="w-full h-96 bg-black/60 border border-gray-800 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-auto leading-relaxed shadow-inner">
                  {responsePayload
                    ? JSON.stringify(responsePayload, null, 2)
                    : '// Execute a transaction from the left panel to inspect the Authorize.Net response payload...'}
                </pre>
              </div>

              {/* Diagnostic Hint */}
              <div className="text-[11px] text-gray-500 flex items-center justify-between">
                <span>Protocol: Authorize.Net JSON API Specification</span>
                <span>Hash: SHA512 transHash</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Settled Batches Report (`getSettledBatchListRequest`) */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <span>Settled Batch List Report</span>
              </h2>
              <p className="text-xs text-gray-400">
                Endpoint: <code className="text-emerald-400 font-mono">POST /getSettledBatchListRequest</code> with settlement statistics breakdown
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchBatches}
                disabled={batchLoading}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-gray-200 rounded-lg transition-colors border border-gray-700"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${batchLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Batches</span>
              </button>
            </div>
          </div>

          {/* Batches Table & Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {batches.map(batch => (
              <div
                key={batch.batchId}
                className={`bg-[#12161f] border rounded-2xl p-5 space-y-4 transition-all cursor-pointer ${
                  selectedBatchId === batch.batchId
                    ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
                onClick={() => {
                  setSelectedBatchId(batch.batchId);
                  fetchBatchTransactions(batch.batchId);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg font-mono font-bold text-sm">
                      #{batch.batchId}
                    </span>
                    <div>
                      <span className="text-xs text-gray-400">Settlement State:</span>
                      <div className="text-xs font-semibold text-emerald-400">{batch.settlementState}</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    {new Date(batch.settlementTimeUTC).toLocaleDateString()}
                  </span>
                </div>

                {/* Statistics Cards */}
                {batch.statistics && (
                  <div className="space-y-2 pt-2 border-t border-gray-800">
                    <div className="text-xs font-semibold text-gray-300">Volume by Account Type:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {batch.statistics.map((stat, i) => (
                        <div key={i} className="bg-black/40 p-2.5 rounded-xl border border-gray-800/80 text-xs space-y-1">
                          <div className="text-gray-400 font-medium">{stat.accountType}</div>
                          <div className="font-mono text-emerald-300 font-bold">
                            ${stat.chargeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {stat.chargeCount} charges ({stat.refundCount} refunds)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800/60">
                  <span>Product: {batch.product}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBatchId(batch.batchId);
                      fetchBatchTransactions(batch.batchId);
                      setActiveTab('transList');
                    }}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    <span>Inspect Transactions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Transactions Forensics (`getTransactionListRequest` & `getTransactionDetailsRequest`) */}
      {activeTab === 'transList' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>Transaction Forensic Report (Batch #{selectedBatchId})</span>
              </h2>
              <p className="text-xs text-gray-400">
                Endpoints: <code className="text-emerald-400 font-mono">POST /getTransactionListRequest</code> & <code className="text-emerald-400 font-mono">POST /getTransactionDetailsRequest</code>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Switch Batch:</span>
              <select
                value={selectedBatchId}
                onChange={e => {
                  setSelectedBatchId(e.target.value);
                  fetchBatchTransactions(e.target.value);
                }}
                className="bg-black/60 border border-gray-800 text-xs text-gray-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {batches.map(b => (
                  <option key={b.batchId} value={b.batchId}>Batch #{b.batchId}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List Column */}
            <div className="lg:col-span-2 bg-[#12161f] border border-gray-800 rounded-2xl p-5 space-y-4">
              <div className="text-sm font-semibold text-white flex items-center justify-between">
                <span>Transactions in Batch ({batchTransactions.length})</span>
                <span className="text-xs text-gray-400">Click row for full forensics</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-gray-400 border-b border-gray-800 pb-2">
                    <tr>
                      <th className="py-2.5 px-3">Trans ID</th>
                      <th className="py-2.5 px-3">Type / Card</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-mono">
                    {batchTransactions.map(tx => (
                      <tr
                        key={tx.transId}
                        onClick={() => fetchTransDetails(tx.transId)}
                        className={`hover:bg-gray-800/40 cursor-pointer transition-colors ${
                          selectedTransDetails?.transId === tx.transId ? 'bg-emerald-500/10' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-emerald-400 font-bold">{tx.transId}</td>
                        <td className="py-3 px-3 text-gray-300">
                          {tx.accountType} {tx.accountNumber}
                        </td>
                        <td className="py-3 px-3 text-white font-bold">
                          ${tx.settleAmount.toFixed(2)}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchTransDetails(tx.transId);
                            }}
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Deep Forensic Card */}
            <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-sm font-semibold text-white">Forensic Telemetry</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>

              {selectedTransDetails ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-gray-400">Transaction ID:</span>
                    <div className="font-mono text-emerald-400 font-bold">{selectedTransDetails.transId}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 p-2 rounded-lg border border-gray-800">
                      <span className="text-[10px] text-gray-500">AVS Match:</span>
                      <div className="font-mono text-emerald-300 font-bold">{selectedTransDetails.AVSResponse || 'Y (Street & Zip)'}</div>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg border border-gray-800">
                      <span className="text-[10px] text-gray-500">CVV Result:</span>
                      <div className="font-mono text-emerald-300 font-bold">{selectedTransDetails.cardCodeResponse || 'M (Matched)'}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Order Invoice:</span>
                    <div className="font-mono text-white">{selectedTransDetails.order?.invoiceNumber || 'INV-2026-901'}</div>
                    <div className="text-[11px] text-gray-400">{selectedTransDetails.order?.description}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Billing Entity:</span>
                    <div className="text-white font-medium">
                      {selectedTransDetails.billTo?.firstName} {selectedTransDetails.billTo?.lastName}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {selectedTransDetails.billTo?.company} - {selectedTransDetails.billTo?.city}, {selectedTransDetails.billTo?.country}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-gray-400">Settle Amount:</span>
                    <span className="font-mono text-base font-bold text-emerald-400">
                      ${selectedTransDetails.settleAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 py-12 text-center">
                  Select any transaction from the list on the left to inspect its deep verification telemetry.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Unsettled Queue (`getUnsettledTransactionListRequest`) */}
      {activeTab === 'unsettled' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Unsettled Transactions Queue (Open Batch)</span>
              </h2>
              <p className="text-xs text-gray-400">
                Endpoint: <code className="text-emerald-400 font-mono">POST /getUnsettledTransactionListRequest</code> (Transactions authorized or captured pending settlement)
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCloseBatch}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-xs font-semibold text-black rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>Settle & Close Current Batch</span>
              </button>
            </div>
          </div>

          {closeBatchMsg && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{closeBatchMsg}</span>
            </div>
          )}

          <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 space-y-4">
            {unsettledTransactions.length === 0 ? (
              <div className="text-center py-12 text-gray-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="text-sm font-semibold text-white">All Transactions Settled</div>
                <p className="text-xs text-gray-500">There are no pending authorizations or unsettled transactions in the open batch.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-gray-400 border-b border-gray-800 pb-2">
                    <tr>
                      <th className="py-2.5 px-3">Trans ID</th>
                      <th className="py-2.5 px-3">Submitted</th>
                      <th className="py-2.5 px-3">Account</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {unsettledTransactions.map(tx => (
                      <tr key={tx.transId} className="hover:bg-gray-800/30">
                        <td className="py-3 px-3 text-amber-400 font-bold">{tx.transId}</td>
                        <td className="py-3 px-3 text-gray-400">{new Date(tx.submitTimeUTC).toLocaleTimeString()}</td>
                        <td className="py-3 px-3 text-gray-300">{tx.accountType} {tx.accountNumber}</td>
                        <td className="py-3 px-3 text-white font-bold">${tx.settleAmount.toFixed(2)}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => {
                              setSelectedTxType('priorAuthCaptureTransaction');
                              setActiveTab('terminal');
                            }}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            Prior Capture
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Merchant Details (`getMerchantDetailsRequest`) */}
      {activeTab === 'merchant' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Building className="w-5 h-5 text-emerald-400" />
                <span>Merchant Account Configuration & Capabilities</span>
              </h2>
              <p className="text-xs text-gray-400">
                Endpoint: <code className="text-emerald-400 font-mono">POST /getMerchantDetailsRequest</code>
              </p>
            </div>
            <button
              onClick={fetchMerchantDetails}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 text-xs text-gray-300 rounded-lg hover:bg-gray-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs text-gray-400 uppercase font-semibold">Account Identity</span>
              <div className="text-base font-bold text-white">{merchantDetails?.merchantName || 'Burvelo Sovereign Treasury & Merchant Services LLC'}</div>
              <div className="text-xs text-gray-400">
                Gateway ID: <span className="font-mono text-emerald-400">{merchantDetails?.gatewayId || 'APEX-AUTHNET-GATEWAY-2026'}</span>
              </div>
              <div className="text-xs text-gray-400">
                Test Mode: <span className="font-mono text-cyan-400">{merchantDetails?.isTestMode ? 'Active (Sandbox)' : 'Inactive (Live)'}</span>
              </div>
            </div>

            <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs text-gray-400 uppercase font-semibold">Connected Processors</span>
              <div className="space-y-1.5">
                {(merchantDetails?.processors || [
                  { name: 'Visa Commercial Direct Processing' },
                  { name: 'MasterCard World Wide Platform' },
                  { name: 'American Express OptBlue' },
                  { name: 'Discover Network' },
                  { name: 'PayPal Express Checkout' }
                ]).map((proc: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{proc.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs text-gray-400 uppercase font-semibold">Currencies & Rails</span>
              <div className="flex flex-wrap gap-1.5">
                {['USD', 'EUR', 'GBP', 'CAD'].map(c => (
                  <span key={c} className="px-2 py-1 rounded bg-black/40 border border-gray-800 font-mono text-xs text-emerald-300">
                    {c}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-400 uppercase font-semibold block pt-2">Market Types</span>
              <div className="flex flex-wrap gap-1.5">
                {['eCommerce', 'MOTO', 'Retail Card Present'].map(m => (
                  <span key={m} className="px-2 py-1 rounded bg-black/40 border border-gray-800 text-xs text-cyan-300">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Customer Information Manager (CIM) */}
      {activeTab === 'cim' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>Customer Information Manager (CIM)</span>
              </h2>
              <p className="text-xs text-gray-400">
                Securely store sensitive payment information on Authorize.Net's PCI-DSS compliant servers
              </p>
            </div>
            <button
              onClick={async () => {
                const res = await fetch('/api/authorizenet/createCustomerProfileRequest', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    createCustomerProfileRequest: {
                      merchantAuthentication: { name: apiLoginId, transactionKey },
                      profile: {
                        merchantCustomerId: 'CUST-APEX-0091',
                        description: 'Institutional Sovereign Treasury Account',
                        email: 'treasury@burvelo.financial'
                      }
                    }
                  })
                });
                const data = await res.json();
                setResponsePayload(data);
                setActiveTab('terminal');
              }}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-xl transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Create New Customer Profile</span>
            </button>
          </div>

          <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-6 space-y-4 text-xs text-gray-300">
            <h3 className="text-sm font-semibold text-white">How Customer Information Manager Works</h3>
            <p>
              CIM allows you to tokenize cardholder data and store it securely on Authorize.Net's PCI-DSS Level 1 certified vault. Subsequent transactions only pass the <code className="text-emerald-400">customerProfileId</code> and <code className="text-emerald-400">customerPaymentProfileId</code>, eliminating raw PAN exposure in your application server.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-black/40 p-4 rounded-xl border border-gray-800 space-y-1">
                <span className="font-semibold text-white block">1. Profile Creation</span>
                <p className="text-gray-400">Generates unique customer ID with zero stored credit card numbers.</p>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-gray-800 space-y-1">
                <span className="font-semibold text-white block">2. Payment Profiles</span>
                <p className="text-gray-400">Attaches multiple cards or eChecks with zero charge validation.</p>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-gray-800 space-y-1">
                <span className="font-semibold text-white block">3. One-Click Recurring</span>
                <p className="text-gray-400">Binds directly into Automated Recurring Billing (ARB) subscriptions.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Environment & Configuration */}
      {activeTab === 'env' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Key className="w-5 h-5 text-emerald-400" />
              <span>Authorize.Net API Credentials & Environment Variables</span>
            </h2>
            <p className="text-xs text-gray-400">
              Configure credentials matching your Authorize.Net Merchant Interface (Account &gt; Security Settings &gt; API Credentials &amp; Keys)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 space-y-4">
              <span className="text-sm font-semibold text-white">Live Console Credentials</span>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">API Login ID:</label>
                <input
                  type="text"
                  value={apiLoginId}
                  onChange={e => setApiLoginId(e.target.value)}
                  className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. 5KP3u95bQpv"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">Transaction Key:</label>
                <input
                  type="password"
                  value={transactionKey}
                  onChange={e => setTransactionKey(e.target.value)}
                  className="w-full bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. 346HZ32z3fP4hTG2"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400">Target Gateway Environment:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEnvironment('sandbox')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      environment === 'sandbox'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-black/40 text-gray-400 border-gray-800'
                    }`}
                  >
                    Sandbox (apitest.authorize.net)
                  </button>
                  <button
                    onClick={() => setEnvironment('production')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      environment === 'production'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        : 'bg-black/40 text-gray-400 border-gray-800'
                    }`}
                  >
                    Production (api.authorize.net)
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#12161f] border border-gray-800 rounded-2xl p-5 space-y-4">
              <span className="text-sm font-semibold text-white">System Environment Variables (.env)</span>
              <p className="text-xs text-gray-400">
                To persist credentials across server restarts, specify them in your root <code className="text-emerald-400">.env</code> file:
              </p>
              <pre className="p-4 bg-black/60 border border-gray-800 rounded-xl text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto">
{`# Authorize.Net API Login ID & Key
AUTHORIZENET_API_LOGIN_ID="${apiLoginId}"
AUTHORIZENET_TRANSACTION_KEY="${transactionKey}"

# Environment ('sandbox' or 'production')
AUTHORIZENET_ENVIRONMENT="${environment}"

# Optional Webhook & Signature Key
AUTHORIZENET_SIGNATURE_KEY="your_signature_key_here"`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
