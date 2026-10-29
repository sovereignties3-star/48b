import React, { useState, useEffect } from 'react';
import { 
  Terminal, Cpu, CheckCircle2, Copy, Play, Globe, Shield, 
  Layers, Server, Activity, Database, RefreshCw, Code2, 
  Sparkles, Check, AlertCircle, Zap, FileJson, ArrowRight, Settings2
} from 'lucide-react';

interface ToolPreset {
  name: string;
  label: string;
  args: Record<string, any>;
}

interface ToolDefinition {
  id: string;
  name: string;
  company: string;
  badgeColor: string;
  description: string;
  defaultArgs: Record<string, any>;
  presets: ToolPreset[];
}

const MCP_TOOLS: ToolDefinition[] = [
  {
    id: 'get_all_companies_status',
    name: 'get_all_companies_status',
    company: 'Consortium Hub (All 11 Companies)',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Returns connection status, telemetry, and live endpoint catalogs across all 11 banking and fintech providers.',
    defaultArgs: {
      scope: 'all_integrated_institutions',
      includeTelemetry: true,
      checkLatency: true
    },
    presets: [
      {
        name: 'Full Health Check',
        label: 'Full Health Check',
        args: { scope: 'all_integrated_institutions', includeTelemetry: true, checkLatency: true }
      },
      {
        name: 'Active Endpoints Catalog',
        label: 'Active Endpoints Only',
        args: { scope: 'active_endpoints', verbose: true }
      }
    ]
  },
  {
    id: 'citi_banking_action',
    name: 'citi_banking_action',
    company: 'Citibank N.A. & OBP',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Execute Citi Open Banking operations: accounts, UAE lending, DCR sandbox, HK cards, insurance booking, and JWT decryption.',
    defaultArgs: {
      action: 'get_accounts',
      payload: {
        accountId: 'CITI_GLOBAL_CHECKING_9921',
        currency: 'USD',
        includePending: true,
        region: 'US_NORTH_AMERICA'
      }
    },
    presets: [
      {
        name: 'Get Accounts & Balances',
        label: 'Get Accounts',
        args: {
          action: 'get_accounts',
          payload: { accountId: 'CITI_GLOBAL_CHECKING_9921', currency: 'USD', includePending: true }
        }
      },
      {
        name: 'UAE Lending Offer',
        label: 'UAE / Dubai Lending',
        args: {
          action: 'uae_lending',
          payload: { loanType: 'COMMERCIAL_CREDIT_LINE', amountAED: 2500000, tenureMonths: 36, emirate: 'DUBAI_DIFC' }
        }
      },
      {
        name: 'DCR Sandbox Register',
        label: 'DCR Registration',
        args: {
          action: 'dcr_register',
          payload: { clientName: 'Kronos Apex Client v2', redirectUris: ['https://ais-dev-u63e6klsgagizrk3d4awui-22946357919.us-west1.run.app/callback'], tokenEndpointAuthMethod: 'private_key_jwt' }
        }
      },
      {
        name: 'Book Insurance Policy',
        label: 'Book Insurance',
        args: {
          action: 'book_insurance',
          payload: { policyType: 'TREASURY_SWAP_DEFAULT_HEDGE', notionalAmountUSD: 50000000, underwriter: 'CITI_ASSURANCE_LTD' }
        }
      },
      {
        name: 'Hong Kong Cards Suite',
        label: 'HK Cards Module',
        args: {
          action: 'hk_cards',
          payload: { cardType: 'CITI_PREMIERMILES_HKD', creditLimitHKD: 800000, currency: 'HKD' }
        }
      },
      {
        name: 'JWT Decryption',
        label: 'JWT / JWE Decrypt',
        args: {
          action: 'jwt_decrypt',
          payload: { token: 'eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0...', keyId: 'citi-master-2026' }
        }
      }
    ]
  },
  {
    id: 'chase_rewards_action',
    name: 'chase_rewards_action',
    company: 'Chase Bank USA, N.A.',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    description: 'Execute Chase Pay with Points validations, merchant program enrollment, and reward point burn simulation.',
    defaultArgs: {
      action: 'get_points',
      payload: {
        memberId: 'CHASE_UR_99182301',
        cardProduct: 'SAPPHIRE_RESERVE_EXECUTIVE',
        currency: 'POINTS'
      }
    },
    presets: [
      {
        name: 'Check Ultimate Rewards Points',
        label: 'Check Points',
        args: { action: 'get_points', payload: { memberId: 'CHASE_UR_99182301', cardProduct: 'SAPPHIRE_RESERVE_EXECUTIVE' } }
      },
      {
        name: 'Enroll Merchant Program',
        label: 'Enroll Merchant',
        args: { action: 'enroll_merchant', payload: { merchantId: 'MERC_CHASE_8849', category: 'FINTECH_SERVICES', enablePayWithPoints: true } }
      },
      {
        name: 'Simulate Transaction',
        label: 'Simulate Tx',
        args: { action: 'simulate_transaction', payload: { purchaseAmountUSD: 450.00, pointsRedeemed: 45000, statementCredit: 450.00 } }
      }
    ]
  },
  {
    id: 'fdx_open_finance_action',
    name: 'fdx_open_finance_action',
    company: 'Financial Data Exchange (FDX v6)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'FDX v6 Open Finance bill pay gateway operations, payee directory inspection, and settlement scheduling.',
    defaultArgs: {
      action: 'list_payees',
      payload: {
        protocolVersion: 'FDX_6.0',
        billerCategory: 'UTILITIES_AND_FINANCE',
        limit: 25
      }
    },
    presets: [
      {
        name: 'List Certified Payees',
        label: 'List Payees',
        args: { action: 'list_payees', payload: { protocolVersion: 'FDX_6.0', billerCategory: 'UTILITIES_AND_FINANCE', limit: 25 } }
      },
      {
        name: 'Schedule Bill Disbursement',
        label: 'Schedule Bill',
        args: { action: 'schedule_bill', payload: { payeeId: 'FDX_PAYEE_CONED_01', amountUSD: 1850.50, paymentDate: '2026-10-01', memo: 'Data Center Settlement' } }
      },
      {
        name: 'Fetch Telemetry Metrics',
        label: 'Get Telemetry',
        args: { action: 'get_metrics', payload: { timeframe: 'LAST_24_HOURS', protocol: 'REST_MUTUAL_TLS' } }
      }
    ]
  },
  {
    id: 'moderntreasury_ledger_action',
    name: 'moderntreasury_ledger_action',
    company: 'Modern Treasury',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Programmatic money movement, double-entry ledger postings, and automated counterparty disbursements.',
    defaultArgs: {
      action: 'create_payment_order',
      payload: {
        type: 'ach',
        amount: 25000000,
        currency: 'USD',
        direction: 'credit',
        originatingAccountId: 'mt_acc_us_treasury_01',
        receivingCounterpartyId: 'mt_cp_sovereignty_corp_88',
        description: 'Settlement disbursement batch #4409'
      }
    },
    presets: [
      {
        name: 'Create Payment Order',
        label: 'Payment Order',
        args: {
          action: 'create_payment_order',
          payload: { type: 'ach', amount: 25000000, currency: 'USD', direction: 'credit', originatingAccountId: 'mt_acc_us_treasury_01', receivingCounterpartyId: 'mt_cp_sovereignty_corp_88', description: 'Settlement disbursement' }
        }
      },
      {
        name: 'List General Ledgers',
        label: 'List Ledgers',
        args: { action: 'list_ledgers', payload: { status: 'POSTED', limit: 20 } }
      },
      {
        name: 'Add Counterparty',
        label: 'Add Counterparty',
        args: { action: 'add_counterparty', payload: { name: 'Burvelo Consortium LLC', routingNumber: '021000021', accountNumber: '9928172635', accountType: 'checking' } }
      }
    ]
  },
  {
    id: 'paypal_braintree_action',
    name: 'paypal_braintree_action',
    company: 'PayPal & Braintree',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'Execute digital wallet checkouts, subscription billing lifecycle, and multi-currency mass disbursements.',
    defaultArgs: {
      action: 'create_order',
      payload: {
        intent: 'CAPTURE',
        purchaseUnits: [
          {
            referenceId: 'PU_KRONOS_9941',
            amount: { currencyCode: 'USD', value: '1450.00' },
            description: 'Kronos Sovereign Financial OS License'
          }
        ]
      }
    },
    presets: [
      {
        name: 'Create Checkout Order',
        label: 'Create Order',
        args: { action: 'create_order', payload: { intent: 'CAPTURE', purchaseUnits: [{ referenceId: 'PU_KRONOS_9941', amount: { currencyCode: 'USD', value: '1450.00' }, description: 'OS License' }] } }
      },
      {
        name: 'Create Subscription Plan',
        label: 'Create Subscription',
        args: { action: 'create_subscription', payload: { planId: 'PLAN_ENTERPRISE_MONTHLY', subscriberEmail: 'treasury@apex.org', autoRenew: true } }
      },
      {
        name: 'Execute Mass Payout',
        label: 'Execute Payout',
        args: { action: 'execute_payout', payload: { senderBatchId: 'PAYOUT_BATCH_001', recipientType: 'EMAIL', amount: '8200.00', currency: 'USD', receiver: 'partner@consortium.org' } }
      }
    ]
  },
  {
    id: 'marqeta_issuing_action',
    name: 'marqeta_issuing_action',
    company: 'Marqeta Card Issuing',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description: 'Just-in-Time (JIT) virtual and physical payment card issuing, user creation, and webhook authorization simulation.',
    defaultArgs: {
      action: 'create_card',
      payload: {
        cardProductToken: 'cp_kronos_corporate_visa',
        userToken: 'usr_james_burvelo_01',
        isPersonalized: true,
        spendingLimit: { amount: 50000, currency: 'USD', period: 'MONTHLY' },
        formFactor: 'VIRTUAL'
      }
    },
    presets: [
      {
        name: 'Issue Virtual Visa Card',
        label: 'Issue Virtual Card',
        args: { action: 'create_card', payload: { cardProductToken: 'cp_kronos_corporate_visa', userToken: 'usr_james_burvelo_01', isPersonalized: true, spendingLimit: { amount: 50000, currency: 'USD', period: 'MONTHLY' }, formFactor: 'VIRTUAL' } }
      },
      {
        name: 'List Cardholders',
        label: 'List Cardholders',
        args: { action: 'list_holders', payload: { status: 'ACTIVE', count: 10 } }
      },
      {
        name: 'Simulate JIT Webhook',
        label: 'Simulate JIT Auth',
        args: { action: 'simulate_webhook', payload: { amount: 489.20, merchantName: 'AWS Cloud Services', cardToken: 'marq_card_9931', acceptDecision: 'APPROVE' } }
      }
    ]
  },
  {
    id: 'newrelic_telemetry_action',
    name: 'newrelic_telemetry_action',
    company: 'New Relic APM',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    description: 'Fetch New Relic APM golden metrics, error traces, distributed transactions, and synthetic monitor uptime.',
    defaultArgs: {
      action: 'get_metrics',
      payload: {
        appName: 'Kronos-Apex-Financial-Gateway',
        metricNames: ['Apdex', 'HttpDispatcher', 'Errors/all', 'Memory/Physical'],
        timeWindow: 'LAST_60_MINUTES'
      }
    },
    presets: [
      {
        name: 'Get APM Performance Metrics',
        label: 'Get Metrics',
        args: { action: 'get_metrics', payload: { appName: 'Kronos-Apex-Financial-Gateway', metricNames: ['Apdex', 'HttpDispatcher', 'Errors/all', 'Memory/Physical'], timeWindow: 'LAST_60_MINUTES' } }
      },
      {
        name: 'Inspect Error Traces',
        label: 'Get Error Logs',
        args: { action: 'get_errors', payload: { appName: 'Kronos-Apex-Financial-Gateway', minSeverity: 'WARNING', limit: 15 } }
      },
      {
        name: 'Distributed Trace Analysis',
        label: 'Get Traces',
        args: { action: 'get_traces', payload: { traceId: 'nr_trace_990141', durationThresholdMs: 200 } }
      }
    ]
  },
  {
    id: 'amazon_aps_action',
    name: 'amazon_aps_action',
    company: 'Amazon Payment Services (APS)',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    description: 'Execute Amazon Payment Services checkout sessions, cryptographic signature verification, and automated refund pipelines.',
    defaultArgs: {
      action: 'create_session',
      payload: {
        command: 'PURCHASE',
        merchantReference: 'AMZN_REF_KRONOS_8819',
        amount: 89000,
        currency: 'USD',
        customerEmail: 'checkout@apexbanking.org',
        language: 'en'
      }
    },
    presets: [
      {
        name: 'Create Checkout Session',
        label: 'Create Session',
        args: { action: 'create_session', payload: { command: 'PURCHASE', merchantReference: 'AMZN_REF_KRONOS_8819', amount: 89000, currency: 'USD', customerEmail: 'checkout@apexbanking.org', language: 'en' } }
      },
      {
        name: 'Verify SHA256 Signature',
        label: 'Verify Signature',
        args: { action: 'verify_signature', payload: { calculatedHash: '8f7a8b9c...', serverSignature: '8f7a8b9c...', matched: true } }
      },
      {
        name: 'Process Refund',
        label: 'Process Refund',
        args: { action: 'process_refund', payload: { fortId: 'AMZN_FORT_11094', refundAmount: 89000, currency: 'USD', reason: 'Customer requested refund' } }
      }
    ]
  },
  {
    id: 'ethereum_blockchain_action',
    name: 'ethereum_blockchain_action',
    company: 'Ethereum / Web3 Notary',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    description: 'Execute Ethereum Web3 smart contract notarization, wallet RPC balances, and fiat-to-crypto liquidity on-ramps.',
    defaultArgs: {
      action: 'notarize_hash',
      payload: {
        documentHash: '0x9e107d9d372bb6826bd81d3542a419d6dae079712a4c7f078a9c80521e1bc63c',
        contractAddress: '0x71C8FB9613765e9A4B8b0eB8dE9979bA4F56E7B0',
        network: 'MAINNET',
        notaryTag: 'KRONOS_ACCORD_SEAL'
      }
    },
    presets: [
      {
        name: 'Notarize Document Hash',
        label: 'Notarize Hash',
        args: { action: 'notarize_hash', payload: { documentHash: '0x9e107d9d372bb6826bd81d3542a419d6dae079712a4c7f078a9c80521e1bc63c', contractAddress: '0x71C8FB9613765e9A4B8b0eB8dE9979bA4F56E7B0', network: 'MAINNET', notaryTag: 'KRONOS_ACCORD_SEAL' } }
      },
      {
        name: 'Get Wallet Balance',
        label: 'Get ETH Balance',
        args: { action: 'get_balance', payload: { address: '0xJamesBurveloTreasuryVault7721', unit: 'ether' } }
      },
      {
        name: 'Bank On-Ramp Liquidity',
        label: 'Bank On-Ramp',
        args: { action: 'buy_eth_bank', payload: { fiatAmountUSD: 25000, depositBank: 'Citibank N.A.', targetWallet: '0x71C8FB9613765e9A4B8b0eB8dE9979bA4F56E7B0' } }
      }
    ]
  },
  {
    id: 'krisp_meeting_automation',
    name: 'krisp_meeting_automation',
    company: 'Krisp AI & 25 Zapier Automations',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    description: 'AI Meeting Assistant operations: background noise cancellation, transcript summarization, and triggering 25 Zapier automations.',
    defaultArgs: {
      action: 'generate_summary_and_zap',
      payload: {
        meetingTitle: 'Burvelo Consortium Q3 Financial Accord',
        durationMinutes: 45,
        noiseFiltered: true,
        zapTitle: 'Krisp + QuickBooks & Slack Executive Sync',
        autoTriggerZap: true,
        summaryPoints: [
          'Approved $50M Treasury Reserve Allocation',
          'Completed Citibank DCR Integration Check',
          'Synced 25 Zapier Automation Webhooks'
        ]
      }
    },
    presets: [
      {
        name: 'Summarize & Trigger Zapier',
        label: 'Summary + Zap',
        args: { action: 'generate_summary_and_zap', payload: { meetingTitle: 'Consortium Q3 Review', durationMinutes: 45, noiseFiltered: true, zapTitle: 'Krisp + QuickBooks & Slack Executive Sync', autoTriggerZap: true } }
      },
      {
        name: 'Trigger Specific Zapier Webhook',
        label: 'Trigger Zap',
        args: { action: 'trigger_zap', payload: { zapIntegration: 'Slack_Notification_And_HubSpot_Lead', status: 'EXECUTED', executionMode: 'INSTANT' } }
      },
      {
        name: 'Process Audio Transcript',
        label: 'Process Audio',
        args: { action: 'process_transcript', payload: { audioFormat: 'WAV_16KHZ', sampleRate: 16000, enableNoiseSuppression: true } }
      }
    ]
  },
  {
    id: 'card_vault_catalog_action',
    name: 'card_vault_catalog_action',
    company: 'Card Vault & USB Encoder (0x0801:0x0003)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'ISO magnetic stripe track 1/2/3 parser with LRC verification, USB hardware encoder simulation, and catalog export.',
    defaultArgs: {
      action: 'list_catalog',
      payload: {
        catalogScope: 'ENTERPRISE_VAULT',
        includeIsoTracks: true,
        sortBy: 'ISSUER_BANK',
        limit: 50
      }
    },
    presets: [
      {
        name: 'List Card Vault Catalog',
        label: 'List Catalog',
        args: { action: 'list_catalog', payload: { catalogScope: 'ENTERPRISE_VAULT', includeIsoTracks: true, sortBy: 'ISSUER_BANK', limit: 50 } }
      },
      {
        name: 'Encode USB Magstripe Track',
        label: 'Encode Magstripe',
        args: { action: 'encode_usb', payload: { vendorId: '0x0801', productId: '0x0003', track1: '%B4000123456789010^BURVELO/JAMES^29121010000000000000?', track2: ';4000123456789010=2912101000000?', lrcChecksum: 'VALID' } }
      },
      {
        name: 'Export Secure Vault Backup',
        label: 'Export Backup',
        args: { action: 'download_catalog', payload: { format: 'JSON_AND_CSV_ENCRYPTED', checksumAlgorithm: 'SHA256' } }
      }
    ]
  },
  {
    id: 'adobe_commerce_action',
    name: 'adobe_commerce_action',
    company: 'Adobe Commerce (Magento 2.4.6 Enterprise)',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    description: 'Execute Adobe Commerce enterprise operations: B2B company credits, negotiable quotes, products, carts, orders, MSI inventory sources, and Adobe Stock assets.',
    defaultArgs: {
      action: 'get_company_credit',
      payload: {
        companyId: 1,
        includeHistory: true,
        currency: 'USD'
      }
    },
    presets: [
      {
        name: 'Get Company Credit Balance',
        label: 'Company Credit Line',
        args: { action: 'get_company_credit', payload: { companyId: 1, includeHistory: true } }
      },
      {
        name: 'Increase Credit Limit',
        label: 'Extend Credit ($500k)',
        args: { action: 'increase_credit_limit', payload: { creditId: 1, value: 500000, comment: 'Consortium Expansion Accord' } }
      },
      {
        name: 'Submit B2B Negotiable Quote',
        label: 'Submit B2B Quote',
        args: { action: 'submit_negotiable_quote', payload: { quoteId: 4002, quoteName: 'Consortium Global License', originalTotal: 125000, requestedDiscountPercent: 24 } }
      },
      {
        name: 'List MSI Inventory Warehouses',
        label: 'MSI Sources',
        args: { action: 'list_inventory_sources', payload: { checkSalability: true, sku: 'ADOBE-CC-ENTERPRISE-01' } }
      },
      {
        name: 'Search Adobe Stock Assets',
        label: 'Search Stock',
        args: { action: 'search_adobe_stock', payload: { query: 'Fintech Quantum Neural Banking', limit: 10 } }
      }
    ]
  },
  {
    id: 'authorizenet_action',
    name: 'authorizenet_action',
    company: 'Authorize.Net (Visa Merchant Services Gateway)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Execute Authorize.Net transactions and reporting: Prior Auth Capture, Auth & Capture Continued, Settled Batch Reports, Transaction Forensics, and Customer Profiles.',
    defaultArgs: {
      action: 'prior_auth_capture',
      payload: {
        merchantAuthentication: {
          name: '5KP3u95bQpv',
          transactionKey: '346HZ32z3fP4hTG2'
        },
        refTransId: '128'
      }
    },
    presets: [
      {
        name: 'Prior Authorization Capture',
        label: 'Prior Auth Capture (#128)',
        args: {
          action: 'prior_auth_capture',
          payload: {
            merchantAuthentication: {
              name: '5KP3u95bQpv',
              transactionKey: '346HZ32z3fP4hTG2'
            },
            refTransId: '128'
          }
        }
      },
      {
        name: 'Authorization and Capture, Continued',
        label: 'Auth & Capture Continued (#139)',
        args: {
          action: 'auth_capture_continue',
          payload: {
            merchantAuthentication: {
              name: '5KP3u95bQpv',
              transactionKey: '346HZ32z3fP4hTG2'
            },
            payment: {
              payPal: {
                payerID: 'S6D5ETGSVYX94'
              }
            },
            refTransId: '139'
          }
        }
      },
      {
        name: 'Settled Batch List Report',
        label: 'Settled Batches Report',
        args: {
          action: 'get_settled_batch_list',
          payload: {
            includeStatistics: true,
            firstSettlementDate: '2026-09-01T00:00:00Z',
            lastSettlementDate: '2026-09-30T23:59:59Z'
          }
        }
      },
      {
        name: 'Transaction Forensic Details',
        label: 'Transaction Details',
        args: {
          action: 'get_transaction_details',
          payload: { transId: '60183921029' }
        }
      },
      {
        name: 'Unsettled Transactions Report',
        label: 'Unsettled Queue',
        args: { action: 'get_unsettled_transaction_list', payload: {} }
      },
      {
        name: 'Merchant Processing Details',
        label: 'Merchant Details',
        args: { action: 'get_merchant_details', payload: {} }
      }
    ]
  }
];

export function McpServerHub() {
  const [selectedToolId, setSelectedToolId] = useState<string>('get_all_companies_status');
  const [toolArguments, setToolArguments] = useState<string>('');
  const [executing, setExecuting] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [executionStats, setExecutionStats] = useState<{ status: number; durationMs: number; time: string } | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'manifest' | 'docs'>('editor');

  const currentTool = MCP_TOOLS.find(t => t.id === selectedToolId) || MCP_TOOLS[0];
  const mcpEndpointUrl = `${window.location.origin}/api/mcp/execute`;
  const mcpToolsUrl = `${window.location.origin}/api/mcp/tools`;
  const mcpSseUrl = `${window.location.origin}/api/mcp/sse`;

  // Auto-fill pre-coded arguments whenever selected tool changes or on mount
  useEffect(() => {
    const formattedJson = JSON.stringify(currentTool.defaultArgs, null, 2);
    setToolArguments(formattedJson);
    setJsonError(null);
  }, [selectedToolId]);

  const handleApplyPreset = (preset: ToolPreset) => {
    const formatted = JSON.stringify(preset.args, null, 2);
    setToolArguments(formatted);
    setJsonError(null);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(toolArguments);
      setToolArguments(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(`JSON Syntax Error: ${e.message}`);
    }
  };

  const handleResetDefault = () => {
    setToolArguments(JSON.stringify(currentTool.defaultArgs, null, 2));
    setJsonError(null);
  };

  const handleExecuteTool = async (overrideArgs?: Record<string, any>) => {
    setExecuting(true);
    setResult(null);
    setJsonError(null);
    const startTime = performance.now();

    let parsedArgs: any = {};
    if (overrideArgs) {
      parsedArgs = overrideArgs;
    } else {
      try {
        parsedArgs = JSON.parse(toolArguments || '{}');
      } catch (e: any) {
        setJsonError(`Cannot execute: Invalid JSON syntax (${e.message})`);
        setExecuting(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          tool: selectedToolId,
          arguments: parsedArgs
        })
      });

      const endTime = performance.now();
      const durationMs = Math.round(endTime - startTime);

      const data = await res.json();
      setExecutionStats({
        status: res.status,
        durationMs,
        time: new Date().toLocaleTimeString()
      });
      setResult(data);
    } catch (err: any) {
      const endTime = performance.now();
      setExecutionStats({
        status: 500,
        durationMs: Math.round(endTime - startTime),
        time: new Date().toLocaleTimeString()
      });
      setResult({
        success: false,
        error: err.message || 'Failed to connect to MCP execute endpoint.',
        hint: 'Ensure server is active and arguments are valid JSON.'
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#161B22] via-[#1c2333] to-[#161B22] rounded-2xl border border-purple-500/30 p-6 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-inner">
              <Server className="w-7 h-7 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Multi-Company Model Context Protocol (MCP) Server
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE • ALL 11 COMPANIES
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#8B949E] mt-1 max-w-3xl leading-relaxed">
                Universal JSON-RPC 2.0 & SSE gateway that orchestrates all 11 banking and fintech institutions. All arguments in the workbench are <span className="text-purple-300 font-semibold">100% pre-coded and ready to execute</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3 z-10 w-full lg:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={() => handleExecuteTool()}
            disabled={executing}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {executing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{executing ? 'Executing MCP Tool...' : 'Run Pre-Coded Tool'}</span>
          </button>

          <button
            onClick={() => window.open(mcpToolsUrl, '_blank')}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-[#21262d] hover:bg-[#30363D] text-[#C9D1D9] hover:text-white text-xs font-bold border border-[#30363D] transition-all cursor-pointer whitespace-nowrap"
          >
            <Globe className="w-4 h-4 text-purple-400" />
            <span>MCP Manifest</span>
          </button>
        </div>
      </div>

      {/* Universal Endpoint Connection Card */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Universal MCP Endpoint URL (AI Client Connection)</span>
            </h3>
            <p className="text-xs text-[#8B949E]">
              Connect Claude Desktop, Cursor, Gemini, or any MCP client directly to this URL to command all 11 financial modules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-1 rounded bg-[#0D1117] text-[#79C0FF] border border-[#30363D]">
              Protocol: MCP v2024-11-05
            </span>
            <span className="text-[11px] font-mono px-2 py-1 rounded bg-[#0D1117] text-emerald-400 border border-[#30363D]">
              SSE Streaming Active
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-3">
          <div className="w-full bg-[#0D1117] border border-purple-500/30 rounded-lg px-3.5 py-2.5 text-xs font-mono text-purple-200 truncate select-all">
            {mcpEndpointUrl}
          </div>
          <button
            onClick={() => handleCopy(mcpEndpointUrl)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-[#21262d] hover:bg-purple-600 text-white text-xs font-semibold border border-[#30363D] transition-all cursor-pointer whitespace-nowrap shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
            <span>{copied ? 'Copied URL!' : 'Copy Endpoint'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive MCP Tool Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tool Selector & Pre-Coded Arguments (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 space-y-4 shadow-xl">
            
            {/* Tool Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Select Pre-Configured MCP Tool</span>
                </label>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${currentTool.badgeColor}`}>
                  {currentTool.company}
                </span>
              </div>

              <select
                value={selectedToolId}
                onChange={(e) => setSelectedToolId(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] hover:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all cursor-pointer"
              >
                {MCP_TOOLS.map((tool) => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name} — ({tool.company})
                  </option>
                ))}
              </select>

              <p className="text-xs text-[#8B949E] mt-2 bg-[#0D1117]/80 p-2.5 rounded-lg border border-[#30363D]/60 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>{currentTool.description}</span>
              </p>
            </div>

            {/* Quick Action Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant Pre-Coded Action Presets</span>
                </span>
                <span className="text-[10px] text-[#8B949E]">Click any button to populate payload</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentTool.presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0D1117] hover:bg-purple-950/40 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-purple-400" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Arguments Editor Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-purple-400" />
                  <span>Pre-Coded Tool Arguments (JSON)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFormatJson}
                    className="px-2 py-1 text-[11px] font-medium rounded bg-[#21262d] hover:bg-[#30363D] text-[#C9D1D9] border border-[#30363D] cursor-pointer"
                  >
                    Format JSON
                  </button>
                  <button
                    onClick={handleResetDefault}
                    className="px-2 py-1 text-[11px] font-medium rounded bg-[#21262d] hover:bg-[#30363D] text-[#C9D1D9] border border-[#30363D] cursor-pointer"
                  >
                    Reset Pre-Coded
                  </button>
                  <button
                    onClick={() => handleCopy(toolArguments)}
                    className="px-2 py-1 text-[11px] font-medium rounded bg-[#21262d] hover:bg-[#30363D] text-purple-300 border border-[#30363D] cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={toolArguments}
                  onChange={(e) => {
                    setToolArguments(e.target.value);
                    if (jsonError) setJsonError(null);
                  }}
                  rows={12}
                  spellCheck={false}
                  className={`w-full bg-[#0D1117] rounded-xl p-3.5 text-xs font-mono text-[#79C0FF] leading-relaxed border ${
                    jsonError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#30363D] focus:border-purple-500'
                  } focus:outline-none transition-all shadow-inner`}
                  placeholder='{"action": "get_accounts", "payload": {}}'
                />
              </div>

              {jsonError && (
                <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{jsonError}</span>
                </div>
              )}
            </div>

            {/* Execute Button */}
            <div className="pt-2">
              <button
                onClick={() => handleExecuteTool()}
                disabled={executing}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {executing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching MCP JSON-RPC Request...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Execute {currentTool.name}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Response & Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 space-y-4 shadow-xl flex flex-col h-full min-h-[520px]">
            
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>MCP Execution Output</span>
              </h3>

              {executionStats && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    HTTP {executionStats.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {executionStats.durationMs}ms
                  </span>
                </div>
              )}
            </div>

            {/* Response Box */}
            <div className="flex-1 bg-[#0D1117] rounded-xl border border-[#30363D] p-4 font-mono text-xs text-[#79C0FF] overflow-auto max-h-[480px] shadow-inner flex flex-col justify-between">
              {result ? (
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8B949E] space-y-3 my-auto">
                  <div className="p-3 rounded-full bg-[#161B22] border border-[#30363D]">
                    <Terminal className="w-8 h-8 text-purple-400/60" />
                  </div>
                  <p className="text-xs max-w-xs leading-relaxed">
                    Ready to execute. Arguments are already pre-coded. Click <span className="text-purple-300 font-semibold">"Run Pre-Coded Tool"</span> or an action preset to execute.
                  </p>
                </div>
              )}
            </div>

            {/* Response Quick Actions */}
            {result && (
              <div className="flex items-center justify-between pt-2 border-t border-[#30363D]/60">
                <span className="text-[11px] text-[#8B949E] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Success payload received</span>
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                  className="px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-white text-xs font-semibold border border-[#30363D] cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-purple-400" />
                  <span>Copy Response</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Complete Tools & Modules Matrix */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Integrated MCP Tools Catalog (All 11 Institutions)</span>
          </span>
          <span className="text-xs text-[#8B949E]">12 Unified Tools Active</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MCP_TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => {
                setSelectedToolId(tool.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedToolId === tool.id
                  ? 'bg-purple-950/30 border-purple-500 shadow-md shadow-purple-500/10'
                  : 'bg-[#0D1117] border-[#30363D] hover:border-purple-500/50 hover:bg-[#161B22]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white font-mono">{tool.name}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${tool.badgeColor}`}>
                  {tool.company.split(' ')[0]}
                </span>
              </div>
              <p className="text-[11px] text-[#8B949E] line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-2 pt-2 border-t border-[#30363D]/40 flex items-center justify-between text-[10px] text-purple-300">
                <span>{tool.presets.length} Presets Available</span>
                <span className="flex items-center gap-1 font-semibold">
                  Load & Run <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default McpServerHub;
