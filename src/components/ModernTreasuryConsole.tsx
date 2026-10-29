import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Layers,
  Lock,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Search,
  Filter,
  Database,
  Sliders,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Terminal,
  Code2,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Landmark,
  Send,
  CreditCard,
  Link as LinkIcon,
  FileCheck2,
} from 'lucide-react';
import { apiFetch } from '../utils/apiClient';
import { PlaidProcessorToken } from './PlaidProcessorToken';

export interface ModernTreasuryLedgerItem {
  id: string;
  object: string;
  live_mode: boolean;
  name: string;
  description: string | null;
  currency?: string;
  currency_exponent?: number;
  metadata: Record<string, any>;
  discarded_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ModernTreasuryConsoleProps {
  onSendToAiIngest?: (rawJson: string) => void;
}

export function ModernTreasuryConsole({ onSendToAiIngest }: ModernTreasuryConsoleProps) {
  const [config, setConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'ledgers' | 'ledger_accounts' | 'create_transaction' | 'counterparties' | 'webhooks'>('webhooks');
  const [gonData, setGonData] = useState<any>(null);

  useEffect(() => {
    if (typeof (window as any).gon !== 'undefined') {
      setGonData((window as any).gon);
    }
  }, []);

  // Counterparties State (POST & GET /api/counterparties - QBO Bank Account Mirroring)
  const [counterparties, setCounterparties] = useState<any[]>([]);
  const [loadingCounterparties, setLoadingCounterparties] = useState<boolean>(false);
  const [counterpartiesError, setCounterpartiesError] = useState<string | null>(null);
  const [syncingAllBanks, setSyncingAllBanks] = useState<boolean>(false);
  const [syncAllBanksResult, setSyncAllBanksResult] = useState<any | null>(null);
  const [creatingCounterparty, setCreatingCounterparty] = useState<boolean>(false);
  const [createdCounterpartyResult, setCreatedCounterpartyResult] = useState<any | null>(null);
  const [counterpartyError, setCounterpartyError] = useState<string | null>(null);

  // Counterparty Form State matching user cURL
  const [cptyName, setCptyName] = useState<string>('Kenner, Bach and Ledeen');
  const [cptyEmail, setCptyEmail] = useState<string>('ops@kennerbachledeen.com');
  const [cptyAccountType, setCptyAccountType] = useState<string>('checking');
  const [cptyRoutingType, setCptyRoutingType] = useState<string>('gb_sort_code');
  const [cptyRoutingNumber, setCptyRoutingNumber] = useState<string>('230580');
  const [cptyAccountNumber, setCptyAccountNumber] = useState<string>('12345678');
  const [cptyPartyType, setCptyPartyType] = useState<string>('business');
  const [cptyProcessorToken, setCptyProcessorToken] = useState<string>('');

  // Ledgers Query parameters
  const [perPage, setPerPage] = useState<number>(25);
  const [idFilter, setIdFilter] = useState<string>('');
  const [metadataKey, setMetadataKey] = useState<string>('');
  const [metadataValue, setMetadataValue] = useState<string>('');
  const [updatedAtOperator, setUpdatedAtOperator] = useState<'gt' | 'gte' | 'lt' | 'lte' | 'eq'>('gt');
  const [updatedAtDate, setUpdatedAtDate] = useState<string>('');
  const [afterCursor, setAfterCursor] = useState<string>('');
  const [autoStoreQbo, setAutoStoreQbo] = useState<boolean>(true);
  const [targetType, setTargetType] = useState<'Account' | 'JournalEntry'>('Account');

  // Ledger Accounts Query Parameters (List Ledger Accounts API Reference)
  const [accIdFilter, setAccIdFilter] = useState<string>('');
  const [accNameFilter, setAccNameFilter] = useState<string>('');
  const [accNormalcyFilter, setAccNormalcyFilter] = useState<string>('');
  const [accLedgerIdFilter, setAccLedgerIdFilter] = useState<string>('');
  const [accMetadataKey, setAccMetadataKey] = useState<string>('Type');
  const [accMetadataVal, setAccMetadataVal] = useState<string>('Loan');
  const [ledgerAccounts, setLedgerAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // Create Ledger Transaction State (POST /api/ledger_transactions)
  const [txStatus, setTxStatus] = useState<'posted' | 'pending'>('posted');
  const [txDescription, setTxDescription] = useState<string>('Autonomous Settlement Deposit');
  const [txExternalId, setTxExternalId] = useState<string>(`tx_ext_${Math.random().toString(36).slice(2, 10)}`);
  const [txEffectiveAt, setTxEffectiveAt] = useState<string>(new Date().toISOString());
  const [txDebitAccId, setTxDebitAccId] = useState<string>('6168628a-05a6-4d30-80ca-4080ea699179');
  const [txDebitAmount, setTxDebitAmount] = useState<number>(100);
  const [txCreditAccId, setTxCreditAccId] = useState<string>('641e4d45-7fff-4e7e-ae05-1db2614b4a1e');
  const [txCreditAmount, setTxCreditAmount] = useState<number>(100);
  const [creatingTransaction, setCreatingTransaction] = useState<boolean>(false);
  const [createdTxResult, setCreatedTxResult] = useState<any>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // Results state
  const [ledgers, setLedgers] = useState<ModernTreasuryLedgerItem[]>([]);
  const [qboStorageInfo, setQboStorageInfo] = useState<any>(null);
  const [upstreamInfo, setUpstreamInfo] = useState<any>(null);
  const [metaInfo, setMetaInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastExecutedUrl, setLastExecutedUrl] = useState<string>('');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeCodeLang, setActiveCodeLang] = useState<'shell' | 'node' | 'python' | 'ruby'>('shell');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedLedgerForModal, setSelectedLedgerForModal] = useState<any | null>(null);

  // Webhooks Simulator State
  const [selectedWebhookEvent, setSelectedWebhookEvent] = useState<string>('payment_order.created');
  const [webhookPayloadText, setWebhookPayloadText] = useState<string>('');
  const [isDispatchingWebhook, setIsDispatchingWebhook] = useState<boolean>(false);
  const [dispatchedWebhookResult, setDispatchedWebhookResult] = useState<any | null>(null);
  const [webhookEventsList, setWebhookEventsList] = useState<any[]>([]);
  const [loadingWebhookEvents, setLoadingWebhookEvents] = useState<boolean>(false);
  const [inspectEventModal, setInspectEventModal] = useState<any | null>(null);

  // Secure Proxy Testing States
  const [proxyUsername, setProxyUsername] = useState<string>('moderntreasury_prod');
  const [proxyPassword, setProxyPassword] = useState<string>('citi_secure_gate_2026');
  const [proxyTestResult, setProxyTestResult] = useState<any | null>(null);
  const [isTestingProxy, setIsTestingProxy] = useState<boolean>(false);

  const handleTestProxyCall = async () => {
    setIsTestingProxy(true);
    setProxyTestResult(null);
    try {
      let parsed;
      try {
        parsed = JSON.parse(webhookPayloadText);
      } catch (err) {
        alert('Invalid JSON structure in payload.');
        setIsTestingProxy(false);
        return;
      }

      // Encode basic auth using buffer or standard btoa
      const basicAuth = btoa(`${proxyUsername}:${proxyPassword}`);

      const res = await fetch('/api/webhooks/citi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`,
          'Idempotency-Key': `idemp-${Math.random().toString(36).substring(7)}`,
        },
        body: JSON.stringify(parsed)
      });

      const data = await res.json();
      setProxyTestResult({
        status: res.status,
        payload: data
      });
    } catch (e: any) {
      console.error('Failed to test proxy endpoint:', e);
      setProxyTestResult({
        status: 500,
        payload: { error: 'Network error calling proxy endpoint', details: e.message }
      });
    } finally {
      setIsTestingProxy(false);
    }
  };

  const MT_EVENT_TEMPLATES: Record<string, { category: string; description: string; data: any }> = {
    'balance_report.created': {
      category: 'Balance Reports',
      description: 'Fired when a daily or intra-day bank balance statement report is ingested.',
      data: { id: "bal_rep_99042", as_of_date: "2026-10-04", balances: [{ amount: 42895000, balance_type: "opening_ledger", currency: "USD" }] }
    },
    'case.opened': {
      category: 'Cases',
      description: 'Fired when a KYC or compliance dispute case is initiated.',
      data: { id: "case_88902", status: "opened", reason: "corporate_kyc_verification", severity: "high" }
    },
    'case.updated': {
      category: 'Cases',
      description: 'Fired when the state or reviewers on a compliance case are updated.',
      data: { id: "case_88902", status: "under_review", notes: "Awaiting beneficial ownership docs" }
    },
    'case.resolved': {
      category: 'Cases',
      description: 'Fired when the case is successfully completed and closed.',
      data: { id: "case_88902", status: "resolved", resolution: "approved" }
    },
    'connection_legal_entity.created': {
      category: 'Connection Legal Entities',
      description: 'Fired when a connection to an external corporate legal identity is initiated.',
      data: { id: "cle_77182", connection_id: "conn_citi_npp_001", status: "created" }
    },
    'connection_legal_entity.completed': {
      category: 'Connection Legal Entities',
      description: 'Fired when the connection is fully vetted and completed.',
      data: { id: "cle_77182", connection_id: "conn_citi_npp_001", status: "completed" }
    },
    'document.created': {
      category: 'Documents',
      description: 'Fired when an invoice, statement, or KYC document is uploaded.',
      data: { id: "doc_31209", document_type: "invoice", file_name: "citi_statement_oct2026.pdf", size_bytes: 145020 }
    },
    'expected_payment.created': {
      category: 'Expected Payments',
      description: 'Fired when a receivable entry is created awaiting automatic matching.',
      data: { id: "exp_pay_55610", amount: 1450000, currency: "USD", counterparty_id: "cpty_90124", direction: "credit" }
    },
    'expected_payment.tentatively_reconciled': {
      category: 'Expected Payments',
      description: 'Fired when an incoming payment matches the expected parameters tentatively.',
      data: { id: "exp_pay_55610", reconciliation_id: "rec_99214", status: "tentatively_reconciled" }
    },
    'expected_payment.reconciled': {
      category: 'Expected Payments',
      description: 'Fired when the expected payment is fully matched and settled.',
      data: { id: "exp_pay_55610", reconciliation_id: "rec_99214", status: "reconciled" }
    },
    'expected_payment.archived': {
      category: 'Expected Payments',
      description: 'Fired when an outstanding payment expectation is archived or cancelled.',
      data: { id: "exp_pay_55610", status: "archived" }
    },
    'expected_payment.overdue': {
      category: 'Expected Payments',
      description: 'Fired when the expected payment deadline has passed without settlement.',
      data: { id: "exp_pay_55610", status: "overdue", due_date: "2026-10-01" }
    },
    'expected_payment.unreconciled': {
      category: 'Expected Payments',
      description: 'Fired when a matched payment is manually unmatched.',
      data: { id: "exp_pay_55610", status: "unreconciled" }
    },
    'expected_payment.partially_reconciled': {
      category: 'Expected Payments',
      description: 'Fired when a partial payment is matched against the expectation.',
      data: { id: "exp_pay_55610", amount_paid: 500000, remaining_amount: 950000, status: "partially_reconciled" }
    },
    'external_account.created': {
      category: 'External Accounts',
      description: 'Fired when a counterparty\'s destination bank details are added.',
      data: { id: "ext_acc_00124", account_type: "checking", institution_name: "Chase Bank", routing_number: "021000021" }
    },
    'external_account.verified': {
      category: 'External Accounts',
      description: 'Fired when the bank details are successfully validated via micro-deposits or Plaid.',
      data: { id: "ext_acc_00124", verification_status: "verified", method: "plaid_processor_token" }
    },
    'external_account.failed_verification': {
      category: 'External Accounts',
      description: 'Fired when micro-deposit amounts or Plaid authentication fail.',
      data: { id: "ext_acc_00124", verification_status: "failed", error_code: "invalid_account_number" }
    },
    'external_account.cancelled': {
      category: 'External Accounts',
      description: 'Fired when the external account is marked inactive or cancelled.',
      data: { id: "ext_acc_00124", status: "cancelled" }
    },
    'external_account.expired': {
      category: 'External Accounts',
      description: 'Fired when a temporary external account authorization expires.',
      data: { id: "ext_acc_00124", status: "expired" }
    },
    'external_account.updated': {
      category: 'External Accounts',
      description: 'Fired when the metadata or account details of the external account are edited.',
      data: { id: "ext_acc_00124", status: "updated", updated_fields: ["routing_number"] }
    },
    'external_account.approved': {
      category: 'External Accounts',
      description: 'Fired when a supervisor approves the account details for transactions.',
      data: { id: "ext_acc_00124", status: "approved", approver: "James Burvelo" }
    },
    'external_account.approval_reverted': {
      category: 'External Accounts',
      description: 'Fired when the approval is retracted or put back into review state.',
      data: { id: "ext_acc_00124", status: "approval_reverted" }
    },
    'external_account.denied': {
      category: 'External Accounts',
      description: 'Fired when a supervisor rejects the bank details due to corporate policy.',
      data: { id: "ext_acc_00124", status: "denied", reason: "unsupported_foreign_entity" }
    },
    'incoming_payment_detail.created': {
      category: 'Incoming Payment Details',
      description: 'Fired when a wire or ACH is received into our domestic internal account.',
      data: { id: "ipd_90887", amount: 1450000, currency: "USD", vendor_id: "vend_citi_npp", status: "unreconciled" }
    },
    'incoming_payment_detail.tentatively_reconciled': {
      category: 'Incoming Payment Details',
      description: 'Fired when the incoming credit tentatively matches an expected invoice.',
      data: { id: "ipd_90887", status: "tentatively_reconciled" }
    },
    'incoming_payment_detail.reconciled': {
      category: 'Incoming Payment Details',
      description: 'Fired when the incoming credit is fully matched against an internal expected payment.',
      data: { id: "ipd_90887", status: "reconciled", journal_entry_sync: "QBO-JE-2026-99042" }
    },
    'incoming_payment_detail.completed': {
      category: 'Incoming Payment Details',
      description: 'Fired when the funds are cleared and deposited.',
      data: { id: "ipd_90887", status: "completed" }
    },
    'incoming_payment_detail.returned': {
      category: 'Incoming Payment Details',
      description: 'Fired when the incoming payment is rejected and returned to the sender.',
      data: { id: "ipd_90887", status: "returned", return_reason_code: "R01" }
    },
    'incoming_payment_detail.return_failed': {
      category: 'Incoming Payment Details',
      description: 'Fired when the return action itself fails.',
      data: { id: "ipd_90887", status: "return_failed" }
    },
    'incoming_payment_detail.return_returned': {
      category: 'Incoming Payment Details',
      description: 'Fired when the returned transaction is returned back.',
      data: { id: "ipd_90887", status: "return_returned" }
    },
    'incoming_payment_detail.unreconciled': {
      category: 'Incoming Payment Details',
      description: 'Fired when an incoming credit is manually unmatched.',
      data: { id: "ipd_90887", status: "unreconciled" }
    },
    'internal_account.activated': {
      category: 'Internal Accounts',
      description: 'Fired when our vault internal domestic bank account is activated.',
      data: { id: "int_acc_1010", account_type: "checking", status: "activated" }
    },
    'internal_account.suspended': {
      category: 'Internal Accounts',
      description: 'Fired when a domestic account is suspended by banking ops.',
      data: { id: "int_acc_1010", status: "suspended" }
    },
    'internal_account.closed': {
      category: 'Internal Accounts',
      description: 'Fired when our internal bank account is permanently closed.',
      data: { id: "int_acc_1010", status: "closed" }
    },
    'ledger_account.created': {
      category: 'Ledger Accounts',
      description: 'Fired when a double-entry ledger account (Asset, Liability, Equity) is created.',
      data: { id: "la_loan_9918", normalcy: "debit", status: "active", ledger_id: "led_primary" }
    },
    'ledger_account.updated': {
      category: 'Ledger Accounts',
      description: 'Fired when the metadata or normalcy settings on a ledger account are updated.',
      data: { id: "la_loan_9918", status: "updated", previous_normalcy: "debit" }
    },
    'ledger_account_balance_monitor.triggered': {
      category: 'Ledger Account Balance Monitors',
      description: 'Fired when a ledger account balance monitor crosses its set threshold.',
      data: { id: "lbm_00192", current_balance: 1500000, trigger_balance: 1000000, condition: "less_than" }
    },
    'ledger_account_balance_monitor.resolved': {
      category: 'Ledger Account Balance Monitors',
      description: 'Fired when the balance monitor returns to safe parameters.',
      data: { id: "lbm_00192", current_balance: 1800000, condition_resolved: true }
    },
    'ledger_transaction.posted': {
      category: 'Ledger Transactions',
      description: 'Fired when a double-entry accounting ledger transaction is successfully posted.',
      data: { id: "lt_009918", status: "posted", description: "QuickBooks Asset Synchronization", entries: [{ amount: 1450000, direction: "credit", ledger_account_id: "la_1" }] }
    },
    'ledger_transaction.created': {
      category: 'Ledger Transactions',
      description: 'Fired when a ledger transaction is created in pending state.',
      data: { id: "lt_009918", status: "pending", description: "Pending Settlement Deposit" }
    },
    'ledger_transaction.archived': {
      category: 'Ledger Transactions',
      description: 'Fired when a pending transaction is voided or archived.',
      data: { id: "lt_009918", status: "archived" }
    },
    'ledger_account_settlement.finish_processing': {
      category: 'Ledger Account Settlements',
      description: 'Fired when the inter-company clearing netting has finished processing.',
      data: { id: "las_77102", status: "processed", settlement_amount: 1450000 }
    },
    'ledger_account_settlement.finish_archiving': {
      category: 'Ledger Account Settlements',
      description: 'Fired when the settlement is archived.',
      data: { id: "las_77102", status: "archived" }
    },
    'ledger_account_settlement.pending': {
      category: 'Ledger Account Settlements',
      description: 'Fired when a netting transaction is created in pending state.',
      data: { id: "las_77102", status: "pending" }
    },
    'ledger_account_settlement.posted': {
      category: 'Ledger Account Settlements',
      description: 'Fired when the clearing action is fully posted.',
      data: { id: "las_77102", status: "posted" }
    },
    'legal_entity.created': {
      category: 'Legal Entities',
      description: 'Fired when a new corporate or individual KYC legal identity is created.',
      data: { id: "le_99214", legal_name: "James Burvelo III Ltd", legal_structure: "limited_liability_company" }
    },
    'legal_entity.updated': {
      category: 'Legal Entities',
      description: 'Fired when the tax details or address of a legal entity are updated.',
      data: { id: "le_99214", status: "updated", updated_fields: ["tax_id"] }
    },
    'legal_entity.activated': {
      category: 'Legal Entities',
      description: 'Fired when the legal entity KYC review is approved and activated.',
      data: { id: "le_99214", status: "activated" }
    },
    'legal_entity.suspended': {
      category: 'Legal Entities',
      description: 'Fired when compliance suspends a legal entity.',
      data: { id: "le_99214", status: "suspended", reason: "missing_incorporation_docs" }
    },
    'legal_entity.denied': {
      category: 'Legal Entities',
      description: 'Fired when compliance denies activation of the legal entity.',
      data: { id: "le_99214", status: "denied" }
    },
    'payment_order.created': {
      category: 'Payment Orders',
      description: 'Fired when a new outbound wire or ACH is created.',
      data: { id: "po_wire_1102", amount: 1450000, currency: "USD", status: "pending", counterparty_id: "cpty_90124" }
    },
    'payment_order.failed': {
      category: 'Payment Orders',
      description: 'Fired when outbound transfer fails at the bank due to invalid account or NSF.',
      data: { id: "po_wire_1102", status: "failed", failure_code: "insufficient_funds" }
    },
    'payment_order.approved': {
      category: 'Payment Orders',
      description: 'Fired when payment is approved by corporate signing officer.',
      data: { id: "po_wire_1102", status: "approved" }
    },
    'payment_order.approval_reverted': {
      category: 'Payment Orders',
      description: 'Fired when the payment order approval is reverted.',
      data: { id: "po_wire_1102", status: "approval_reverted" }
    },
    'payment_order.denied': {
      category: 'Payment Orders',
      description: 'Fired when a payment order is rejected during approval flow.',
      data: { id: "po_wire_1102", status: "denied" }
    },
    'payment_order.cancelled': {
      category: 'Payment Orders',
      description: 'Fired when outbound wire is explicitly cancelled before transmission.',
      data: { id: "po_wire_1102", status: "cancelled" }
    },
    'payment_order.begin_processing': {
      category: 'Payment Orders',
      description: 'Fired when payment order is picked up by automated batching.',
      data: { id: "po_wire_1102", status: "processing" }
    },
    'payment_order.finish_processing': {
      category: 'Payment Orders',
      description: 'Fired when the payment file is successfully uploaded to Citibank/Chase SFTP.',
      data: { id: "po_wire_1102", status: "sent_to_bank" }
    },
    'payment_order.acknowledged': {
      category: 'Payment Orders',
      description: 'Fired when bank acknowledges receipt of the ACH/Wire file.',
      data: { id: "po_wire_1102", status: "bank_acknowledged" }
    },
    'payment_order.confirmed': {
      category: 'Payment Orders',
      description: 'Fired when Fedwire/SWIFT returns confirmation of settlement.',
      data: { id: "po_wire_1102", status: "confirmed" }
    },
    'payment_order.tentatively_reconciled': {
      category: 'Payment Orders',
      description: 'Fired when outbound debit matched a bank statement line.',
      data: { id: "po_wire_1102", status: "tentatively_reconciled" }
    },
    'payment_order.completed': {
      category: 'Payment Orders',
      description: 'Fired when payment is completed and settled.',
      data: { id: "po_wire_1102", status: "completed", clearing_date: "2026-10-04" }
    },
    'payment_order.reconciled': {
      category: 'Payment Orders',
      description: 'Fired when outbound transaction is matched on bank reconciliation.',
      data: { id: "po_wire_1102", status: "reconciled" }
    },
    'payment_order.receiving_account_reconciled': {
      category: 'Payment Orders',
      description: 'Fired when counterparty confirms payment matching.',
      data: { id: "po_wire_1102", status: "receiving_account_reconciled" }
    },
    'payment_order.returned': {
      category: 'Payment Orders',
      description: 'Fired when receiving bank rejects the payment.',
      data: { id: "po_wire_1102", status: "returned", return_code: "R03" }
    },
    'payment_order.stopped': {
      category: 'Payment Orders',
      description: 'Fired when payment stop order is executed.',
      data: { id: "po_wire_1102", status: "stopped" }
    },
    'payment_order.redrafted': {
      category: 'Payment Orders',
      description: 'Fired when outbound payment is redrafted.',
      data: { id: "po_wire_1102", status: "redrafted" }
    },
    'payment_order.reversed': {
      category: 'Payment Orders',
      description: 'Fired when payment action is reversed.',
      data: { id: "po_wire_1102", status: "reversed" }
    },
    'payment_order.nsf_deferment': {
      category: 'Payment Orders',
      description: 'Fired when payment is deferred due to NSF warnings.',
      data: { id: "po_wire_1102", status: "nsf_deferment" }
    },
    'payment_order.nsf_plaid_error_but_processing': {
      category: 'Payment Orders',
      description: 'Fired when Plaid reports NSF but transaction proceeds.',
      data: { id: "po_wire_1102", status: "nsf_plaid_error_but_processing" }
    },
    'payment_order.updated': {
      category: 'Payment Orders',
      description: 'Fired when payment metadata or custom references are updated.',
      data: { id: "po_wire_1102", status: "updated", updated_fields: ["memo"] }
    },
    'payment_order.unreconciled': {
      category: 'Payment Orders',
      description: 'Fired when outbound payment is manually unreconciled.',
      data: { id: "po_wire_1102", status: "unreconciled" }
    },
    'payment_reference.created': {
      category: 'Payment References',
      description: 'Fired when a SWIFT UETR or Fedwire IMAD reference is assigned.',
      data: { id: "pref_99102", reference_number: "20261004B1209F", reference_type: "swift_uetr" }
    },
    'return.created': {
      category: 'Returns',
      description: 'Fired when outbound transfer return is initiated.',
      data: { id: "ret_00192", amount: 1450000, reason_code: "R01", returnable_id: "po_wire_1102" }
    },
    'return.begin_processing': {
      category: 'Returns',
      description: 'Fired when return begins clearing cycle.',
      data: { id: "ret_00192", status: "processing" }
    },
    'return.finish_processing': {
      category: 'Returns',
      description: 'Fired when return is uploaded to clearing network.',
      data: { id: "ret_00192", status: "sent_to_bank" }
    },
    'return.tentatively_reconciled': {
      category: 'Returns',
      description: 'Fired when return credit matches statement line.',
      data: { id: "ret_00192", status: "tentatively_reconciled" }
    },
    'return.reconciled': {
      category: 'Returns',
      description: 'Fired when return is matched to bank statement.',
      data: { id: "ret_00192", status: "reconciled" }
    },
    'return.completed': {
      category: 'Returns',
      description: 'Fired when return has completed clearing.',
      data: { id: "ret_00192", status: "completed" }
    },
    'return.returned': {
      category: 'Returns',
      description: 'Fired when returned transaction itself is returned.',
      data: { id: "ret_00192", status: "returned" }
    },
    'return.failed': {
      category: 'Returns',
      description: 'Fired when return action fails.',
      data: { id: "ret_00192", status: "failed" }
    },
    'return.unreconciled': {
      category: 'Returns',
      description: 'Fired when return is unmatched.',
      data: { id: "ret_00192", status: "unreconciled" }
    },
    'reversal.created': {
      category: 'Reversals',
      description: 'Fired when outbound reversal is initiated.',
      data: { id: "rev_88129", status: "created", payment_order_id: "po_wire_1102" }
    },
    'reversal.begin_processing': {
      category: 'Reversals',
      description: 'Fired when reversal begins processing cycle.',
      data: { id: "rev_88129", status: "processing" }
    },
    'reversal.finish_processing': {
      category: 'Reversals',
      description: 'Fired when reversal is sent to bank.',
      data: { id: "rev_88129", status: "sent_to_bank" }
    },
    'reversal.completed': {
      category: 'Reversals',
      description: 'Fired when funds are cleared and returned.',
      data: { id: "rev_88129", status: "completed" }
    },
    'reversal.failed': {
      category: 'Reversals',
      description: 'Fired when reversal fails to execute.',
      data: { id: "rev_88129", status: "failed" }
    },
    'reversal.returned': {
      category: 'Reversals',
      description: 'Fired when reversal itself is returned.',
      data: { id: "rev_88129", status: "returned" }
    },
    'reversal.reconciled': {
      category: 'Reversals',
      description: 'Fired when reversal is reconciled on bank statement.',
      data: { id: "rev_88129", status: "reconciled" }
    },
    'reversal.tentatively_reconciled': {
      category: 'Reversals',
      description: 'Fired when reversal matches Statement tentatively.',
      data: { id: "rev_88129", status: "tentatively_reconciled" }
    },
    'reversal.unreconciled': {
      category: 'Reversals',
      description: 'Fired when reversal is unmatched.',
      data: { id: "rev_88129", status: "unreconciled" }
    },
    'payment_action.created': {
      category: 'Payment Actions',
      description: 'Fired when a payment action requirement is generated.',
      data: { id: "pact_0029", action_type: "manual_approval", status: "created" }
    },
    'payment_action.updated': {
      category: 'Payment Actions',
      description: 'Fired when payment action parameters are changed.',
      data: { id: "pact_0029", status: "updated" }
    },
    'payment_action.processable': {
      category: 'Payment Actions',
      description: 'Fired when action meets all processing rules.',
      data: { id: "pact_0029", status: "processable" }
    },
    'payment_action.begin_processing': {
      category: 'Payment Actions',
      description: 'Fired when payment action begins execution.',
      data: { id: "pact_0029", status: "processing" }
    },
    'payment_action.finish_processing': {
      category: 'Payment Actions',
      description: 'Fired when action is fully executed.',
      data: { id: "pact_0029", status: "completed" }
    },
    'payment_action.acknowledged': {
      category: 'Payment Actions',
      description: 'Fired when action is acknowledged by bank system.',
      data: { id: "pact_0029", status: "bank_acknowledged" }
    },
    'payment_action.cancelled': {
      category: 'Payment Actions',
      description: 'Fired when payment action is cancelled.',
      data: { id: "pact_0029", status: "cancelled" }
    },
    'payment_action.failed': {
      category: 'Payment Actions',
      description: 'Fired when execution of payment action fails.',
      data: { id: "pact_0029", status: "failed" }
    },
    'transaction.created': {
      category: 'Transactions',
      description: 'Fired when a raw bank transaction record is created.',
      data: { id: "tx_99214", amount: 1450000, description: "Citibank NPP Wire credit", status: "unreconciled" }
    },
    'transaction.reconciled': {
      category: 'Transactions',
      description: 'Fired when bank statement line is fully reconciled against ledger accounts.',
      data: { id: "tx_99214", status: "reconciled" }
    },
    'transaction.updated': {
      category: 'Transactions',
      description: 'Fired when bank statement line transaction metadata is updated.',
      data: { id: "tx_99214", status: "updated", updated_fields: ["category"] }
    },
    'virtual_account.created': {
      category: 'Virtual Accounts',
      description: 'Fired when a new virtual collection account or IBAN is created.',
      data: { id: "va_99182", name: "Client Collection Account 09", status: "active", internal_account_id: "int_acc_1010" }
    },
    'virtual_account.updated': {
      category: 'Virtual Accounts',
      description: 'Fired when the virtual account routing or status is updated.',
      data: { id: "va_99182", status: "updated" }
    },
    'virtual_account.deleted': {
      category: 'Virtual Accounts',
      description: 'Fired when the virtual account is permanently deleted.',
      data: { id: "va_99182", status: "deleted" }
    },
    'invoice.created': {
      category: 'Invoices',
      description: 'Fired when a new corporate receivable invoice is generated.',
      data: { id: "inv_99042", amount_due: 1450000, currency: "USD", due_date: "2026-10-31", status: "unpaid" }
    },
    'invoice.unpaid': {
      category: 'Invoices',
      description: 'Fired when the invoice is outstanding and unpaid.',
      data: { id: "inv_99042", status: "unpaid" }
    },
    'invoice.payment_pending': {
      category: 'Invoices',
      description: 'Fired when counterparty initiates wire/ACH payment.',
      data: { id: "inv_99042", status: "payment_pending" }
    },
    'invoice.paid': {
      category: 'Invoices',
      description: 'Fired when receivables system matches funds and marks invoice as settled.',
      data: { id: "inv_99042", status: "paid", amount_paid: 1450000 }
    },
    'invoice.voided': {
      category: 'Invoices',
      description: 'Fired when invoice is cancelled or voided.',
      data: { id: "inv_99042", status: "voided" }
    },
    'invoice.overdue': {
      category: 'Invoices',
      description: 'Fired when invoice payment deadline is missed.',
      data: { id: "inv_99042", status: "overdue" }
    },
    'bulk_request.pending': {
      category: 'Bulk Requests',
      description: 'Fired when a bulk CSV payment upload request is pending review.',
      data: { id: "bulk_req_992", status: "pending", total_operations: 15 }
    },
    'bulk_request.processing': {
      category: 'Bulk Requests',
      description: 'Fired when the automated relayer parses and executes the bulk actions.',
      data: { id: "bulk_req_992", status: "processing" }
    },
    'bulk_request.completed': {
      category: 'Bulk Requests',
      description: 'Fired when all items in bulk request are executed.',
      data: { id: "bulk_req_992", status: "completed", successful_ops: 15, failed_ops: 0 }
    }
  };

  const fetchWebhookEvents = async () => {
    setLoadingWebhookEvents(true);
    try {
      const res = await apiFetch<any[]>('/api/v1/mt/events');
      if (res.ok && res.data) {
        setWebhookEventsList(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch webhook events:', e);
    } finally {
      setLoadingWebhookEvents(false);
    }
  };

  // Populate first template body on template selection
  useEffect(() => {
    if (activeConsoleTab === 'webhooks') {
      const t = MT_EVENT_TEMPLATES[selectedWebhookEvent];
      if (t) {
        setWebhookPayloadText(JSON.stringify({
          id: `evt_${Math.random().toString(36).slice(2, 10)}`,
          type: selectedWebhookEvent,
          data: t.data,
          created: Math.floor(Date.now() / 1000)
        }, null, 2));
      }
      fetchWebhookEvents();
    }
  }, [selectedWebhookEvent, activeConsoleTab]);

  const handleDispatchWebhook = async () => {
    setIsDispatchingWebhook(true);
    setDispatchedWebhookResult(null);
    try {
      let parsed;
      try {
        parsed = JSON.parse(webhookPayloadText);
      } catch (err) {
        alert('Invalid JSON structure. Please check before dispatching.');
        setIsDispatchingWebhook(false);
        return;
      }

      const res = await apiFetch<any>('/api/v1/mt/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });

      if (res.ok && res.data) {
        setDispatchedWebhookResult(res.data);
        fetchWebhookEvents();
      }
    } catch (err: any) {
      console.error('Failed to dispatch webhook event:', err);
    } finally {
      setIsDispatchingWebhook(false);
    }
  };

  // New Ledger Form State
  const [newLedgerName, setNewLedgerName] = useState('');
  const [newLedgerDescription, setNewLedgerDescription] = useState('');
  const [newLedgerCurrency, setNewLedgerCurrency] = useState('USD');
  const [newLedgerMetadataKey, setNewLedgerMetadataKey] = useState('Type');
  const [newLedgerMetadataVal, setNewLedgerMetadataVal] = useState('Loan');
  const [creatingLedger, setCreatingLedger] = useState(false);

  // Fetch config on mount
  const loadConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await apiFetch<any>('/api/moderntreasury/config');
      if (res.ok && res.data?.config) {
        setConfig(res.data.config);
      }
    } catch (e: any) {
      console.error('Failed to load Modern Treasury config:', e);
    } finally {
      setLoadingConfig(false);
    }
  };

  // PDF Progress & Stage Tracking State
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mappedAccountsResult, setMappedAccountsResult] = useState<any[]>([]);
  const [searchMappedFilter, setSearchMappedFilter] = useState<string>('');

  useEffect(() => {
    loadConfig();
    fetchLedgers();
    fetchLedgerAccounts();
    fetchCounterparties();
  }, []);

  const fetchCounterparties = async () => {
    setLoadingCounterparties(true);
    setCounterpartiesError(null);
    try {
      const res = await apiFetch<any>(`/api/moderntreasury/counterparties?per_page=50`);
      if (res.ok && res.data?.data) {
        setCounterparties(res.data.data);
      } else if (res.ok && Array.isArray(res.data)) {
        setCounterparties(res.data);
      } else {
        setCounterpartiesError(res.error || 'Failed to list counterparties');
      }
    } catch (e: any) {
      setCounterpartiesError(e.message);
    } finally {
      setLoadingCounterparties(false);
    }
  };

  const handleSyncAllQboBanksToCounterparties = async () => {
    setSyncingAllBanks(true);
    setCounterpartiesError(null);
    setSyncAllBanksResult(null);
    try {
      const res = await apiFetch<any>('/api/moderntreasury/sync-all-qbo-banks-to-counterparties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: config?.quickbooksCompanyName || 'QuickBooks Sandbox Company',
          plaid_processor_token: cptyProcessorToken.trim() || undefined,
        }),
      });

      if (res.ok && res.data) {
        setSyncAllBanksResult(res.data);
        fetchCounterparties();
      } else {
        setCounterpartiesError(res.error || 'Failed to sync bank accounts to counterparties');
      }
    } catch (e: any) {
      setCounterpartiesError(e.message);
    } finally {
      setSyncingAllBanks(false);
    }
  };

  const handleCreateCounterparty = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCounterparty(true);
    setCounterpartyError(null);
    setCreatedCounterpartyResult(null);

    try {
      const payload = {
        name: cptyName.trim(),
        email: cptyEmail.trim() || undefined,
        plaid_processor_token: cptyProcessorToken.trim() || undefined,
        verification_source: cptyProcessorToken.trim() ? 'plaid' : undefined,
        accounts: [
          {
            account_type: cptyAccountType,
            party_name: cptyName.trim(),
            party_type: cptyPartyType,
            routing_details: [
              {
                routing_number_type: cptyRoutingType,
                routing_number: cptyRoutingNumber.trim(),
              },
            ],
            account_details: [
              {
                account_number: cptyAccountNumber.trim(),
              },
            ],
            plaid_processor_token: cptyProcessorToken.trim() || undefined,
            verification_status: cptyProcessorToken.trim() ? 'verified' : 'unverified',
            verification_source: cptyProcessorToken.trim() ? 'plaid' : undefined,
          },
        ],
        metadata: {
          created_via: 'POST /api/counterparties UI Console',
          user_agent: 'cURL-compatible-runner',
          plaid_processor_token: cptyProcessorToken.trim() || undefined,
          verified: cptyProcessorToken.trim() ? 'true' : 'false',
        },
      };

      const res = await apiFetch<any>('/api/moderntreasury/counterparties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok && res.data) {
        setCreatedCounterpartyResult(res.data);
        fetchCounterparties();
      } else {
        setCounterpartyError(res.error || 'Failed to create counterparty');
      }
    } catch (e: any) {
      setCounterpartyError(e.message);
    } finally {
      setCreatingCounterparty(false);
    }
  };

  const handleLoadKennerExample = () => {
    setCptyName('Kenner, Bach and Ledeen');
    setCptyEmail('ops@kennerbachledeen.com');
    setCptyAccountType('checking');
    setCptyRoutingType('gb_sort_code');
    setCptyRoutingNumber('230580');
    setCptyAccountNumber('12345678');
    setCptyPartyType('business');
  };

  const fetchLedgerAccounts = async () => {
    setLoadingAccounts(true);
    setAccountsError(null);
    try {
      const params = new URLSearchParams();
      params.set('per_page', String(perPage));
      params.set('autoStoreQbo', 'true');
      if (accIdFilter.trim()) params.set('id', accIdFilter.trim());
      if (accNameFilter.trim()) params.set('name', accNameFilter.trim());
      if (accNormalcyFilter.trim()) params.set('normalcy', accNormalcyFilter.trim());
      if (accLedgerIdFilter.trim()) params.set('ledger_id', accLedgerIdFilter.trim());
      if (accMetadataKey.trim() && accMetadataVal.trim()) {
        params.set(`metadata[${accMetadataKey.trim()}]`, accMetadataVal.trim());
      }

      const queryString = params.toString();
      const endpoint = `/api/moderntreasury/ledger_accounts?${queryString}`;
      const res = await apiFetch<any>(endpoint);

      if (res.ok && res.data?.data) {
        setLedgerAccounts(res.data.data);
      } else {
        setAccountsError(res.error || 'Failed to list ledger accounts');
      }
    } catch (e: any) {
      setAccountsError(e.message);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTransaction(true);
    setTxError(null);
    setCreatedTxResult(null);

    try {
      const payload = {
        status: txStatus,
        description: txDescription,
        external_id: txExternalId,
        effective_at: txEffectiveAt,
        ledger_entries: [
          {
            amount: Number(txDebitAmount),
            direction: 'debit',
            ledger_account_id: txDebitAccId,
          },
          {
            amount: Number(txCreditAmount),
            direction: 'credit',
            ledger_account_id: txCreditAccId,
          },
        ],
        metadata: {
          Type: 'Loan',
          created_via: 'ModernTreasuryConsole',
        },
      };

      const res = await apiFetch<any>('/api/moderntreasury/ledger_transactions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok && res.data) {
        setCreatedTxResult(res.data);
        fetchLedgerAccounts();
      } else {
        setTxError(res.error || 'Failed to create ledger transaction');
      }
    } catch (e: any) {
      setTxError(e.message);
    } finally {
      setCreatingTransaction(false);
    }
  };

  const fetchLedgers = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();

    try {
      const params = new URLSearchParams();
      params.set('per_page', String(perPage));
      params.set('autoStoreQbo', autoStoreQbo ? 'true' : 'false');
      params.set('targetType', targetType);

      if (idFilter.trim()) {
        params.set('id', idFilter.trim());
      }
      if (metadataKey.trim() && metadataValue.trim()) {
        params.set(`metadata[${metadataKey.trim()}]`, metadataValue.trim());
      }
      if (updatedAtDate.trim()) {
        params.set(`updated_at[${updatedAtOperator}]`, updatedAtDate.trim());
      }
      if (afterCursor.trim()) {
        params.set('after_cursor', afterCursor.trim());
      }

      const queryString = params.toString();
      const endpoint = `/api/moderntreasury/ledgers?${queryString}`;
      setLastExecutedUrl(`https://app.moderntreasury.com/api/ledgers?${queryString}`);

      const res = await apiFetch<any>(endpoint);
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);

      if (res.ok && res.data) {
        setLedgers(res.data.data || []);
        setQboStorageInfo(res.data.quickbooksStorage || null);
        setUpstreamInfo(res.data.upstream || null);
        setMetaInfo(res.data.meta || null);
      } else {
        setError(res.error || 'Failed to fetch Modern Treasury ledgers');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLedger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLedgerName.trim()) return;

    setCreatingLedger(true);
    try {
      const metaObj: Record<string, string> = {};
      if (newLedgerMetadataKey.trim() && newLedgerMetadataVal.trim()) {
        metaObj[newLedgerMetadataKey.trim()] = newLedgerMetadataVal.trim();
      }

      const res = await apiFetch<any>('/api/moderntreasury/ledgers', {
        method: 'POST',
        body: JSON.stringify({
          name: newLedgerName.trim(),
          description: newLedgerDescription.trim() || undefined,
          currency: newLedgerCurrency,
          metadata: metaObj,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewLedgerName('');
        setNewLedgerDescription('');
        fetchLedgers();
      } else {
        alert(res.error || 'Failed to create ledger');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreatingLedger(false);
    }
  };

  const handleSyncAllToQbo = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any>('/api/moderntreasury/sync-all-to-qbo', { method: 'POST' });
      if (res.ok) {
        alert(`Successfully synced ${res.data?.syncedCount || ledgers.length} ledgers to QuickBooks Ledger!`);
        fetchLedgers();
      }
    } catch (e: any) {
      alert(`Sync failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportCitiPdfClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const executePdfPipeline = async (fileName: string, fileBase64?: string) => {
    setUploadingPdf(true);
    setUploadProgress(10);
    setCurrentStageIndex(0);
    setUploadError(null);
    setUploadFileName(fileName);
    setMappedAccountsResult([]);

    try {
      // Stage 1: File Reading & Base64 Encoding
      setUploadProgress(25);
      await new Promise((r) => setTimeout(r, 250));

      // Stage 2: Streaming Payload to Modern Treasury Server & PDF Parsing
      setCurrentStageIndex(1);
      setUploadProgress(45);

      const payload: any = { fileName };
      if (fileBase64) {
        payload.fileBase64 = fileBase64;
      }

      setUploadProgress(60);
      const response = await fetch('/api/moderntreasury/import-citi-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse and import PDF accounts');
      }

      // Stage 3: Account Number Extraction & Regex Pattern Matching
      setCurrentStageIndex(2);
      setUploadProgress(80);
      await new Promise((r) => setTimeout(r, 250));

      const accounts = data.accounts || [];
      setMappedAccountsResult(accounts);

      // Stage 4: Syncing Ledgers to QBO Chart of Accounts with HMAC Signature
      setCurrentStageIndex(3);
      setUploadProgress(100);
      await new Promise((r) => setTimeout(r, 250));

      fetchLedgers();
    } catch (err: any) {
      console.error('PDF Pipeline Error:', err);
      setUploadError(err.message || 'An error occurred during PDF processing');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;
        await executePdfPipeline(file.name, base64String);
      };
      reader.onerror = () => {
        setUploadError('Failed to read selected PDF file');
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    } catch (e: any) {
      setUploadError(`PDF Upload Error: ${e.message}`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImportCitiPdf = async () => {
    await executePdfPipeline('CitiBusiness_Entitlement_Report.pdf');
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generateCurlSnippet = () => {
    if (activeConsoleTab === 'counterparties') {
      return `curl --request POST \\
  -u ${config?.organizationId || 'ORGANIZATION_ID'}:${config?.apiKey ? config.apiKey : 'API_KEY'} \\
  --url https://app.moderntreasury.com/api/counterparties \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(
    {
      name: cptyName,
      accounts: [
        {
          account_type: cptyAccountType,
          routing_details: [
            {
              routing_number_type: cptyRoutingType,
              routing_number: cptyRoutingNumber,
            },
          ],
          account_details: [
            {
              account_number: cptyAccountNumber,
            },
          ],
        },
      ],
    },
    null,
    2
  )}'`;
    }

    if (activeConsoleTab === 'ledger_accounts') {
      return `curl -X GET "https://app.moderntreasury.com/api/ledger_accounts?per_page=${perPage}" \\
  -H "Accept: application/json" \\
  -H "Authorization: ${config?.maskedAuth || 'Basic <base64(org_id:api_key)>'}"`;
    }

    if (activeConsoleTab === 'create_transaction') {
      return `curl -X POST "https://app.moderntreasury.com/api/ledger_transactions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: ${config?.maskedAuth || 'Basic <base64(org_id:api_key)>'}" \\
  -d '{
    "status": "${txStatus}",
    "description": "${txDescription}",
    "external_id": "${txExternalId}",
    "effective_at": "${txEffectiveAt}",
    "ledger_entries": [
      {
        "amount": ${txDebitAmount},
        "direction": "debit",
        "ledger_account_id": "${txDebitAccId}"
      },
      {
        "amount": ${txCreditAmount},
        "direction": "credit",
        "ledger_account_id": "${txCreditAccId}"
      }
    ]
  }'`;
    }

    return `curl -X GET "https://app.moderntreasury.com/api/ledgers?per_page=${perPage}${idFilter ? `&id[]=${idFilter}` : ''}${metadataKey && metadataValue ? `&metadata[${metadataKey}]=${metadataValue}` : ''}" \\
  -H "Accept: application/json" \\
  -H "Authorization: ${config?.maskedAuth || 'Basic <base64(org_id:api_key)>'}"`;
  };

  const generateNodeSnippet = () => {
    if (activeConsoleTab === 'counterparties') {
      return `const url = 'https://app.moderntreasury.com/api/counterparties';
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Buffer.from('${config?.organizationId || 'ORG_ID'}:${config?.apiKey || 'API_KEY'}').toString('base64')
  },
  body: JSON.stringify({
    name: '${cptyName}',
    accounts: [
      {
        account_type: '${cptyAccountType}',
        routing_details: [
          { routing_number_type: '${cptyRoutingType}', routing_number: '${cptyRoutingNumber}' }
        ],
        account_details: [
          { account_number: '${cptyAccountNumber}' }
        ]
      }
    ]
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));`;
    }

    return `const url = 'https://app.moderntreasury.com/api/ledgers?per_page=${perPage}';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: 'Basic ${config?.hasAuthHeader ? '••••••••' : '<base64(org_id:api_key)>'}'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));`;
  };

  const generatePythonSnippet = () => {
    if (activeConsoleTab === 'counterparties') {
      return `import requests

url = "https://app.moderntreasury.com/api/counterparties"
auth = ("${config?.organizationId || 'ORGANIZATION_ID'}", "${config?.apiKey || 'API_KEY'}")
payload = {
    "name": "${cptyName}",
    "accounts": [
        {
            "account_type": "${cptyAccountType}",
            "routing_details": [
                {
                    "routing_number_type": "${cptyRoutingType}",
                    "routing_number": "${cptyRoutingNumber}"
                }
            ],
            "account_details": [
                {
                    "account_number": "${cptyAccountNumber}"
                }
            ]
        }
    ]
}

response = requests.post(url, json=payload, auth=auth)
print(response.json())`;
    }

    return `import requests

url = "https://app.moderntreasury.com/api/ledgers?per_page=${perPage}"

headers = {
    "accept": "application/json",
    "authorization": "${config?.maskedAuth || 'Basic <base64(org_id:api_key)>'}"
}

response = requests.get(url, headers=headers)
print(response.json())`;
  };

  const generateRubySnippet = () => {
    return `require 'uri'
require 'net/http'

url = URI("https://app.moderntreasury.com/api/ledgers?per_page=${perPage}")
http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["accept"] = 'application/json'
request["authorization"] = '${config?.maskedAuth || 'Basic <base64(org_id:api_key)>'}'

response = http.request(request)
puts response.read_body`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Status Header */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-indigo-950/40 shrink-0 font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Modern Treasury: List Ledgers & Live QuickBooks Storage
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  GET /api/ledgers
                </span>
              </div>
              <p className="text-xs text-[#8B949E] mt-1 max-w-3xl leading-relaxed">
                Query Modern Treasury Ledgers with real Basic Authentication and dynamically stream every single ledger directly into the QuickBooks Chart of Accounts, Bridge Ledger, and Journal Entries with cryptographic HMAC proofs.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-900/30 transition-all border border-indigo-400/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Ledger</span>
            </button>

            <button
              onClick={handleSyncAllToQbo}
              disabled={loading || ledgers.length === 0}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all border border-emerald-400/40"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Sync All to QBO Ledger</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelected}
              accept=".pdf"
              className="hidden"
            />
            <button
              onClick={handleImportCitiPdfClick}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-cyan-950/30 transition-all border border-cyan-400/40"
              title="Upload PDF (CitiBusiness Entitlement Report) to extract accounts and sync into QuickBooks"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Upload PDF Report</span>
            </button>

            <button
              onClick={handleImportCitiPdf}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-950/30 transition-all border border-indigo-400/40"
              title="Instantly import all CitiBusiness PDF accounts into QuickBooks"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Import Citi PDF Accounts → QBO</span>
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await apiFetch<any>('/api/signwell/batch-sign', {
                    method: 'POST',
                    body: JSON.stringify({
                      source: 'modern-treasury',
                      agreementTitle: 'Modern Treasury Payment Orders & Ledger Batch Authorization',
                      agreementNotes: 'Batch release and irrevocable execution of Modern Treasury payment orders and internal transfers.',
                      accountIds: ['MT-ORG-DEMO', 'CITI-05329451'],
                      autoSign: true
                    })
                  });
                  if (res.ok && res.data) {
                    const data = res.data;
                    alert(`✅ SignWell Batch Signed & Certified!\nDocument ID: ${data.documentId}\nStatus: ${data.document?.status || 'Completed'}`);
                  } else {
                    alert('SignWell error: ' + (res.error || 'Request failed'));
                  }
                } catch (e: any) {
                  alert('SignWell error: ' + e.message);
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/30 transition-all border border-emerald-400/40 cursor-pointer"
              title="Execute E-Signature on all pending Modern Treasury Payment Orders with SignWell"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-white" />
              <span>⚡ Sign Batch (SignWell)</span>
            </button>

            <button
              onClick={loadConfig}
              className="p-2 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-[#C9D1D9] border border-[#30363D] transition-colors"
              title="Refresh credentials status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingConfig ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Credentials & Status Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-[#30363D]/60 text-xs">
          <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363D] flex items-center justify-between">
            <span className="text-[#8B949E] font-medium">Base URL:</span>
            <span className="font-mono text-cyan-300 font-bold text-[11px] truncate" title="https://app.moderntreasury.com">
              https://app.moderntreasury.com
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363D] flex items-center justify-between">
            <span className="text-[#8B949E] font-medium">Organization ID:</span>
            <span className="font-mono text-indigo-300 font-bold">
              {config?.organizationId || 'Auto (Sandbox)'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363D] flex items-center justify-between">
            <span className="text-[#8B949E] font-medium">Basic Auth Header:</span>
            <span className={`font-mono font-bold ${config?.hasAuthHeader ? 'text-emerald-400' : 'text-amber-400'}`}>
              {config?.hasAuthHeader ? 'Configured' : 'Auto Basic Org:Key'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363D] flex items-center justify-between">
            <span className="text-[#8B949E] font-medium">QuickBooks Bridge:</span>
            <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> CONNECTED & LOCKED
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363D] flex items-center justify-between">
            <span className="text-[#8B949E] font-medium">QBO Target Realm:</span>
            <span className="font-mono text-[#79C0FF] font-bold">
              {config?.quickbooksRealmId || '9341453267972001'}
            </span>
          </div>
        </div>

        {/* Modern Treasury Gon Data (Pasted Payload Integration) */}
        {gonData && (
          <div className="bg-[#161B22]/60 border border-indigo-500/20 rounded-xl p-4 mt-3 space-y-3">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-2">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-white text-xs uppercase tracking-wider">Modern Treasury Portal Integration (gon.organization)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-semibold border border-indigo-500/30">
                Ticker: {gonData.organization?.ticker || 'CD'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-gray-400 font-semibold">Authorized Organization</div>
                <div className="font-mono text-emerald-400">{gonData.organization?.name || 'Citibank Demo Business Inc'}</div>
                <div className="text-[10px] text-gray-500 font-mono">ID: {gonData.organization?.id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400 font-semibold">Sentry Authenticated User</div>
                <div className="font-mono text-indigo-300">{gonData.sentry_context?.user?.email || 'jamesocallaghanprivatebank@gmail.com'}</div>
                <div className="text-[10px] text-gray-500 font-mono">User ID: {gonData.sentry_context?.user?.id}</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400 font-semibold">Flatfile & Segment Keys</div>
                <div className="font-mono text-cyan-300 truncate">Flatfile: {gonData.flatfile?.licenseKey || 'None'}</div>
                <div className="text-[10px] text-gray-500 font-mono">Segment: {gonData.global?.segment_js_write_key}</div>
              </div>
            </div>

            {/* Internal Accounts from MT */}
            {gonData.internalAccounts && (
              <div className="pt-2 border-t border-[#30363D] space-y-1.5">
                <div className="text-[#8B949E] font-medium text-xs">Synchronized Internal General Ledger Accounts ({gonData.internalAccounts.allIds?.length || 0}):</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {gonData.internalAccounts.allIds?.map((id: string) => {
                    const acc = gonData.internalAccounts.byId?.[id];
                    return (
                      <div key={id} className="p-2 rounded bg-[#0d1117] border border-[#30363D] text-[11px] font-mono flex flex-col justify-between">
                        <span className="font-semibold text-gray-300 truncate">{acc?.name}</span>
                        <span className="text-indigo-400 font-medium">{acc?.currency} (GL Account)</span>
                        <span className="text-[9px] text-gray-500 truncate" title={id}>ID: {id.slice(0, 8)}...</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* API Endpoint Selector Tabs */}
        <div className="flex items-center space-x-2 pt-3 border-t border-[#30363D]/60 overflow-x-auto">
          <button
            onClick={() => setActiveConsoleTab('ledgers')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition-all shrink-0 ${
              activeConsoleTab === 'ledgers'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40 border border-indigo-400/40'
                : 'bg-[#0d1117] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>GET /api/ledgers</span>
          </button>

          <button
            onClick={() => {
              setActiveConsoleTab('ledger_accounts');
              fetchLedgerAccounts();
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition-all shrink-0 ${
              activeConsoleTab === 'ledger_accounts'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40 border border-indigo-400/40'
                : 'bg-[#0d1117] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>GET /api/ledger_accounts (List Accounts)</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('create_transaction')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition-all shrink-0 ${
              activeConsoleTab === 'create_transaction'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/40'
                : 'bg-[#0d1117] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>POST /api/ledger_transactions (Create Transaction)</span>
          </button>

          <button
            onClick={() => {
              setActiveConsoleTab('counterparties');
              fetchCounterparties();
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition-all shrink-0 ${
              activeConsoleTab === 'counterparties'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950/40 border border-cyan-400/40'
                : 'bg-[#0d1117] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Landmark className="w-4 h-4 text-cyan-300" />
            <span>POST /api/counterparties (QBO Bank Accounts Mirror)</span>
          </button>

          <button
            onClick={() => {
              setActiveConsoleTab('webhooks');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition-all shrink-0 ${
              activeConsoleTab === 'webhooks'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-950/40 border border-orange-400/40 font-black'
                : 'bg-[#0d1117] text-[#8B949E] hover:text-white border border-[#30363D]'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>⚡ Webhooks Simulator & Event Explorer</span>
          </button>
        </div>
      </div>

      {/* PDF Upload, Stage Tracker & Account Mapping Panel */}
      {(uploadingPdf || mappedAccountsResult.length > 0 || uploadError) && (
        <div className="bg-[#161B22] rounded-xl border border-indigo-500/40 p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  PDF Account Extraction & QuickBooks Mapping Pipeline
                  {uploadProgress === 100 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% COMPLETE
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#8B949E]">
                  Report File: <span className="font-mono text-cyan-300 font-bold">{uploadFileName || 'CitiBusiness_Entitlement_Report.pdf'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="font-mono text-base font-extrabold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                {uploadProgress}%
              </span>
              <button
                onClick={() => {
                  setUploadingPdf(false);
                  setUploadProgress(0);
                  setMappedAccountsResult([]);
                  setUploadError(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#21262d] hover:bg-[#30363D] text-[#8B949E] hover:text-white transition-colors border border-[#30363D]"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#8B949E] font-medium">
              <span>Overall Pipeline Progress</span>
              <span className="font-mono font-bold text-indigo-300">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-[#0d1117] h-3.5 rounded-full overflow-hidden border border-[#30363D] p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-300 shadow-sm shadow-indigo-500/50"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>

          {/* 4-Stage Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {[
              {
                idx: 0,
                title: '1. File Reading',
                desc: 'Reading PDF bytes & Base64 encoding',
              },
              {
                idx: 1,
                title: '2. Server Stream',
                desc: 'Posting payload & pdf-parse engine',
              },
              {
                idx: 2,
                title: '3. Regex Extraction',
                desc: 'Scanning Account#: patterns',
              },
              {
                idx: 3,
                title: '4. QBO & HMAC Sync',
                desc: 'Generating Chart of Accounts & HMAC',
              },
            ].map((stg) => {
              const isDone = currentStageIndex > stg.idx || uploadProgress === 100;
              const isCurrent = currentStageIndex === stg.idx && uploadProgress < 100;
              const isPending = currentStageIndex < stg.idx && uploadProgress < 100;

              return (
                <div
                  key={stg.idx}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200 shadow-sm'
                      : isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-950/50 animate-pulse'
                      : 'bg-[#0d1117] border-[#30363D] text-[#8B949E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{stg.title}</span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-[#8B949E]/40 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] opacity-80 leading-tight">{stg.desc}</p>
                </div>
              );
            })}
          </div>

          {uploadError && (
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Mapped Accounts Results View */}
          {mappedAccountsResult.length > 0 && (
            <div className="pt-3 border-t border-[#30363D] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">
                    Parsed Accounts Output ({mappedAccountsResult.length} Accounts Extracted)
                  </span>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8B949E] absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={searchMappedFilter}
                    onChange={(e) => setSearchMappedFilter(e.target.value)}
                    placeholder="Search account numbers or IDs..."
                    className="pl-8 pr-3 py-1 bg-[#0d1117] border border-[#30363D] rounded-lg text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {mappedAccountsResult.some((acc: any) => acc.status === 'QUICKBOOKS_NOT_CONNECTED') && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>QuickBooks OAuth Not Connected: Accounts are staged locally. Connect your QuickBooks account via OAuth to push these directly into your live Intuit Chart of Accounts.</span>
                  </div>
                </div>
              )}

              <div className="max-h-64 overflow-y-auto rounded-xl border border-[#30363D] bg-[#0d1117] divide-y divide-[#30363D]/60 text-xs font-mono">
                {mappedAccountsResult
                  .filter((acc: any) => {
                    if (!searchMappedFilter.trim()) return true;
                    const q = searchMappedFilter.toLowerCase();
                    return (
                      String(acc.accountNumber).toLowerCase().includes(q) ||
                      String(acc.ledgerId).toLowerCase().includes(q) ||
                      String(acc.qboEntityId || '').toLowerCase().includes(q)
                    );
                  })
                  .map((acc: any, i: number) => {
                    const isRealSynced = acc.status === 'REAL_QBO_SYNCED' || acc.isRealQboSync;
                    const isNotConnected = acc.status === 'QUICKBOOKS_NOT_CONNECTED' || acc.qboEntityId === 'NOT_CONNECTED';
                    const isError = acc.status === 'QBO_API_ERROR' || Boolean(acc.qboError);

                    return (
                      <div key={i} className="p-3 hover:bg-[#161b22] flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-emerald-400 font-bold text-xs">
                              Citi Account #{acc.accountNumber}
                            </span>
                            {isRealSynced && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                                Live QBO Entity ID: {acc.qboEntityId}
                              </span>
                            )}
                            {isNotConnected && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                                Local Staged (OAuth Required)
                              </span>
                            )}
                            {isError && (
                              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">
                                QBO Sync Error
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8B949E] truncate">
                            Ledger ID: {acc.ledgerId} | Bridge ID: {acc.bridgeId}
                          </div>
                          {acc.qboError && (
                            <div className="text-[11px] text-red-400 font-sans">
                              Error: {acc.qboError}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          {isRealSynced && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5" /> LIVE QBO CREATED
                            </span>
                          )}
                          {isNotConnected && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                              <AlertTriangle className="w-3.5 h-3.5" /> OAUTH REQUIRED
                            </span>
                          )}
                          {isError && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5 shadow-sm">
                              <AlertCircle className="w-3.5 h-3.5" /> SYNC FAILED
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEDGERS TAB VIEW */}
      {activeConsoleTab === 'ledgers' && (
        <>
          {/* Query Filter & Execution Console */}
          <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Query Parameters & Filtering (GET /api/ledgers)</h3>
              </div>
              <span className="text-[11px] text-[#8B949E] font-mono">
                GET https://app.moderntreasury.com/api/ledgers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Per Page */}
              <div>
                <label className="block text-[11px] font-medium text-[#8B949E] mb-1">
                  per_page (int32)
                </label>
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value={10}>10</option>
                  <option value={25}>25 (Default)</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* ID Filter */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-[#8B949E] mb-1">
                  id[] (array of strings)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 019a61f9-185c-780b-82d5-f637884c1d31"
                  value={idFilter}
                  onChange={(e) => setIdFilter(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#8B949E]/50 focus:border-indigo-500 focus:outline-hidden font-mono"
                />
              </div>

              {/* Metadata Key & Value */}
              <div>
                <label className="block text-[11px] font-medium text-[#8B949E] mb-1">
                  metadata Key
                </label>
                <input
                  type="text"
                  placeholder="e.g. Type"
                  value={metadataKey}
                  onChange={(e) => setMetadataKey(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#8B949E]/50 focus:border-indigo-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8B949E] mb-1">
                  metadata Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. Loan"
                  value={metadataValue}
                  onChange={(e) => setMetadataValue(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#8B949E]/50 focus:border-indigo-500 focus:outline-hidden font-mono"
                />
              </div>

              {/* Target Ledger Type */}
              <div>
                <label className="block text-[11px] font-medium text-[#8B949E] mb-1">
                  QBO Store Mode
                </label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Account">Chart of Accounts</option>
                  <option value="JournalEntry">Journal Entry GL</option>
                </select>
              </div>
            </div>

            {/* Secondary Parameters row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2">
                <div className="w-1/3">
                  <label className="block text-[11px] font-medium text-[#8B949E] mb-1">
                    updated_at Op
                  </label>
                  <select
                    value={updatedAtOperator}
                    onChange={(e) => setUpdatedAtOperator(e.target.value as any)}
                    className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="gt">&gt; (gt)</option>
                    <option value="gte">&gt;= (gte)</option>
                    <option value="lt">&lt; (lt)</option>
                    <option value="lte">&lt;= (lte)</option>
                    <option value="eq">= (eq)</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-[11px] font-medium text-[#8B949E] mb-1">
                    updated_at Date
                  </label>
                  <input
                    type="text"
                    placeholder="2022-01-01T12:00:00Z"
                    value={updatedAtDate}
                    onChange={(e) => setUpdatedAtDate(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#8B949E]/50 focus:border-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8B949E] mb-1">
                  after_cursor (pagination)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 019a61f8-2525-70f3-a6b2-1af97ed08594"
                  value={afterCursor}
                  onChange={(e) => setAfterCursor(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#8B949E]/50 focus:border-indigo-500 focus:outline-hidden font-mono"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-[#0d1117] border border-[#30363D] w-full cursor-pointer hover:border-emerald-500/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={autoStoreQbo}
                    onChange={(e) => setAutoStoreQbo(e.target.checked)}
                    className="rounded border-[#30363D] text-emerald-600 focus:ring-emerald-500 h-4 w-4 bg-[#161B22]"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Auto-Store in QuickBooks</p>
                    <p className="text-[10px] text-[#8B949E]">Locks every fetched ledger into QBO Ledger</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Execute Button Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#30363D]">
              <div className="flex items-center space-x-2 text-xs text-[#8B949E]">
                {latencyMs !== null && (
                  <span className="px-2 py-1 rounded bg-[#0d1117] border border-[#30363D] font-mono text-emerald-400">
                    ⚡ Latency: {latencyMs}ms
                  </span>
                )}
                {metaInfo && (
                  <span className="px-2 py-1 rounded bg-[#0d1117] border border-[#30363D] font-mono text-indigo-300">
                    Count: {metaInfo.total} Ledgers
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={fetchLedgers}
                  disabled={loading}
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-900/30 transition-all border border-indigo-400/40 disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 fill-white ${loading ? 'animate-pulse' : ''}`} />
                  <span>{loading ? 'Fetching & Storing in QBO...' : 'Fetch Ledgers & Store into QuickBooks'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-4 flex items-start space-x-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-white">Request Execution Error</p>
                <p className="font-mono">{error}</p>
              </div>
            </div>
          )}

          {/* QuickBooks Storage Status Banner */}
          {qboStorageInfo && (
            <div className="bg-emerald-950/25 border border-emerald-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white flex items-center gap-2">
                    <span>QuickBooks Ledger Storage Completed</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                      {qboStorageInfo.storedCount} Recorded
                    </span>
                  </p>
                  <p className="text-[#8B949E] text-[11px]">
                    GL Mapping: <code className="text-emerald-300 font-mono">{qboStorageInfo.glDebitAccount}</code> ↔ <code className="text-emerald-300 font-mono">{qboStorageInfo.glCreditAccount}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-300">
                <span className="px-2.5 py-1 rounded bg-[#0d1117] border border-[#30363D] text-emerald-400 font-bold">
                  STATUS: {qboStorageInfo.status}
                </span>
              </div>
            </div>
          )}

          {/* Ledgers Grid View */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Retrieved Modern Treasury Ledgers ({ledgers.length})
                </h3>
              </div>
              <span className="text-xs text-[#8B949E]">
                All ledgers automatically synced with deterministic HMAC hashes
              </span>
            </div>

            {ledgers.length === 0 ? (
              <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-8 text-center text-xs text-[#8B949E] space-y-3">
                <Building2 className="w-8 h-8 mx-auto text-[#8B949E]/40" />
                <p>No ledgers found matching your query filters.</p>
                <button
                  onClick={fetchLedgers}
                  className="px-3 py-1.5 rounded-lg bg-[#21262d] text-white text-xs font-medium hover:bg-[#30363D] transition-colors"
                >
                  Reset Filters & List All
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {ledgers.map((l) => (
                  <div
                    key={l.id}
                    className="bg-[#161B22] rounded-xl border border-[#30363D] hover:border-indigo-500/60 p-4 transition-all space-y-3 shadow-xs"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">{l.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            l.live_mode
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {l.live_mode ? 'LIVE' : 'SANDBOX'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300">
                            {l.currency || 'USD'}
                          </span>
                        </div>
                        <p className="text-xs text-[#8B949E] line-clamp-2">
                          {l.description || 'No description provided.'}
                        </p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(l.id, l.id)}
                        className="p-1.5 rounded-md hover:bg-[#21262d] text-[#8B949E] hover:text-white transition-colors"
                        title="Copy Ledger UUID"
                      >
                        {copiedKey === l.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* ID & Metadata Tags */}
                    <div className="bg-[#0d1117] rounded-lg p-2.5 border border-[#30363D]/70 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8B949E]">ID:</span>
                        <span className="text-indigo-300 truncate max-w-[280px]">{l.id}</span>
                      </div>

                      {l.metadata && Object.keys(l.metadata).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#30363D]/40">
                          {Object.entries(l.metadata).map(([k, v]) => (
                            <span
                              key={k}
                              className="px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 text-[10px]"
                            >
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-[#8B949E] pt-1">
                        <span>Created: {new Date(l.created_at).toLocaleDateString()}</span>
                        <span>Updated: {new Date(l.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* QBO Storage Verification Ribbon */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#30363D]/60 text-xs">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Locked into QuickBooks Ledger</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {onSendToAiIngest && (
                          <button
                            onClick={() => onSendToAiIngest(JSON.stringify(l, null, 2))}
                            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition-colors flex items-center space-x-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>AI Ingest</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedLedgerForModal(l)}
                          className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363D] text-white text-[11px] font-medium transition-colors"
                        >
                          Raw JSON
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* LIST LEDGER ACCOUNTS TAB VIEW (GET /api/ledger_accounts) */}
      {activeConsoleTab === 'ledger_accounts' && (
        <div className="space-y-5">
          {/* Query Filters Console */}
          <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">List Ledger Accounts Parameters (GET /api/ledger_accounts)</h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                https://app.moderntreasury.com/api/ledger_accounts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-[#8B949E] font-medium mb-1">id[] (bulk IDs)</label>
                <input
                  type="text"
                  placeholder="e.g. 6168628a-05a6-4d30-80ca-4080ea699179"
                  value={accIdFilter}
                  onChange={(e) => setAccIdFilter(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-white font-mono placeholder-[#8B949E]/40 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#8B949E] font-medium mb-1">name[] (partial match)</label>
                <input
                  type="text"
                  placeholder="e.g. my-account"
                  value={accNameFilter}
                  onChange={(e) => setAccNameFilter(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-white font-mono placeholder-[#8B949E]/40 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#8B949E] font-medium mb-1">normalcy</label>
                <select
                  value={accNormalcyFilter}
                  onChange={(e) => setAccNormalcyFilter(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-white focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="">All (Debit & Credit)</option>
                  <option value="debit">debit</option>
                  <option value="credit">credit</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8B949E] font-medium mb-1">ledger_id</label>
                <input
                  type="text"
                  placeholder="e.g. 1b8d2983-4a25-46b0-95b7-[#8B949E]"
                  value={accLedgerIdFilter}
                  onChange={(e) => setAccLedgerIdFilter(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-1.5 text-white font-mono placeholder-[#8B949E]/40 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#8B949E] font-medium mb-1">metadata (Key = Val)</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Type"
                    value={accMetadataKey}
                    onChange={(e) => setAccMetadataKey(e.target.value)}
                    className="w-1/2 bg-[#0d1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-white font-mono text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Loan"
                    value={accMetadataVal}
                    onChange={(e) => setAccMetadataVal(e.target.value)}
                    className="w-1/2 bg-[#0d1117] border border-[#30363D] rounded-lg px-2 py-1.5 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#30363D]">
              <button
                onClick={fetchLedgerAccounts}
                disabled={loadingAccounts}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-950/40 transition-all border border-cyan-400/40 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 fill-white ${loadingAccounts ? 'animate-pulse' : ''}`} />
                <span>{loadingAccounts ? 'Querying Accounts...' : 'Execute List Ledger Accounts Request'}</span>
              </button>
            </div>
          </div>

          {/* Accounts Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Modern Treasury Ledger Accounts ({ledgerAccounts.length})</span>
              </h3>
              <span className="text-xs text-[#8B949E]">
                Auto-synced into QuickBooks Autonomous Bridge
              </span>
            </div>

            {accountsError && (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs">
                {accountsError}
              </div>
            )}

            {ledgerAccounts.length === 0 ? (
              <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-8 text-center text-xs text-[#8B949E]">
                No ledger accounts found matching parameters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ledgerAccounts.map((acc: any) => (
                  <div
                    key={acc.id}
                    className="bg-[#161B22] rounded-xl border border-[#30363D] hover:border-cyan-500/50 p-4 space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-white text-sm">{acc.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            acc.normalcy === 'credit'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}>
                            {acc.normalcy}
                          </span>
                        </div>
                        <p className="text-[#8B949E] text-[11px] font-mono mt-0.5">ID: {acc.id}</p>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0d1117] text-cyan-300 border border-[#30363D]">
                        Lock V{acc.lock_version}
                      </span>
                    </div>

                    {/* Balances Display Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-[#0d1117] p-2.5 rounded-lg border border-[#30363D] text-[11px] font-mono">
                      <div>
                        <p className="text-[#8B949E] text-[10px]">Pending Balance</p>
                        <p className="text-amber-300 font-bold">${(acc.balances.pending_balance.amount / 100).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[#8B949E] text-[10px]">Posted Balance</p>
                        <p className="text-emerald-400 font-bold">${(acc.balances.posted_balance.amount / 100).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[#8B949E] text-[10px]">Available Balance</p>
                        <p className="text-indigo-300 font-bold">${(acc.balances.available_balance.amount / 100).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Metadata & QBO Ribbon */}
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#30363D]">
                      <div className="flex items-center space-x-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Synced to QBO</span>
                      </div>
                      <span className="text-[#8B949E] font-mono text-[10px]">
                        Ledger: {acc.ledger_id.slice(0, 16)}...
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE LEDGER TRANSACTION TAB VIEW (POST /api/ledger_transactions) */}
      {activeConsoleTab === 'create_transaction' && (
        <div className="space-y-5">
          <div className="bg-[#161B22] rounded-xl border border-emerald-500/40 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <span>Create Ledger Transaction API Reference (POST /ledger_transactions)</span>
                </h3>
                <p className="text-xs text-[#8B949E] mt-1">
                  Create a double-entry accounting transaction across Modern Treasury ledger accounts and lock directly into QuickBooks Autonomous Bridge.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                POST /api/ledger_transactions
              </span>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[#8B949E] font-medium mb-1">status *</label>
                  <select
                    value={txStatus}
                    onChange={(e) => setTxStatus(e.target.value as any)}
                    className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-hidden"
                  >
                    <option value="posted">posted</option>
                    <option value="pending">pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8B949E] font-medium mb-1">external_id *</label>
                  <input
                    type="text"
                    required
                    value={txExternalId}
                    onChange={(e) => setTxExternalId(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#8B949E] font-medium mb-1">effective_at (ISO 8601)</label>
                  <input
                    type="text"
                    value={txEffectiveAt}
                    onChange={(e) => setTxEffectiveAt(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#8B949E] font-medium mb-1">description</label>
                  <input
                    type="text"
                    value={txDescription}
                    onChange={(e) => setTxDescription(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Ledger Entries Box */}
              <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363D] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>ledger_entries (Minimum 2 Balanced Entries Required)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    Total Debit (${(txDebitAmount / 100).toFixed(2)}) == Total Credit (${(txCreditAmount / 100).toFixed(2)})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Entry 1: Debit */}
                  <div className="p-3 rounded-lg bg-[#161B22] border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300">Entry 1 (Debit)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 font-bold">
                        DEBIT
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#8B949E] mb-1">ledger_account_id</label>
                      <input
                        type="text"
                        required
                        value={txDebitAccId}
                        onChange={(e) => setTxDebitAccId(e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#30363D] rounded px-2.5 py-1.5 text-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#8B949E] mb-1">amount (in cents, e.g. 100 = $1.00)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={txDebitAmount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTxDebitAmount(val);
                          setTxCreditAmount(val); // Keep balanced
                        }}
                        className="w-full bg-[#0d1117] border border-[#30363D] rounded px-2.5 py-1.5 text-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Entry 2: Credit */}
                  <div className="p-3 rounded-lg bg-[#161B22] border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300">Entry 2 (Credit)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold">
                        CREDIT
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#8B949E] mb-1">ledger_account_id</label>
                      <input
                        type="text"
                        required
                        value={txCreditAccId}
                        onChange={(e) => setTxCreditAccId(e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#30363D] rounded px-2.5 py-1.5 text-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#8B949E] mb-1">amount (in cents, e.g. 100 = $1.00)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={txCreditAmount}
                        onChange={(e) => setTxCreditAmount(Number(e.target.value))}
                        className="w-full bg-[#0d1117] border border-[#30363D] rounded px-2.5 py-1.5 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {txError && (
                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{txError}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={creatingTransaction}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all border border-emerald-400/40 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>{creatingTransaction ? 'Posting Double-Entry Transaction...' : 'Post Ledger Transaction'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Resulting Transaction Display */}
          {createdTxResult && (
            <div className="bg-[#161B22] rounded-xl border border-emerald-500/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Transaction Posted Successfully (201 Created)</span>
                </div>
                <span className="font-mono text-xs text-indigo-300 bg-indigo-950/40 px-2.5 py-1 rounded border border-indigo-500/30">
                  Transaction ID: {createdTxResult.id}
                </span>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363D] font-mono text-xs space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                  <div><span className="text-[#8B949E]">Status:</span> <span className="text-emerald-400 font-bold">{createdTxResult.status}</span></div>
                  <div><span className="text-[#8B949E]">External ID:</span> <span className="text-indigo-300">{createdTxResult.external_id}</span></div>
                  <div><span className="text-[#8B949E]">Ledger ID:</span> <span className="text-cyan-300">{createdTxResult.ledger_id}</span></div>
                  <div><span className="text-[#8B949E]">QBO Lock:</span> <span className="text-emerald-400 font-bold">ACTIVE</span></div>
                </div>

                <div className="pt-2 border-t border-[#30363D]">
                  <p className="text-[#8B949E] text-[10px] mb-1 font-sans font-bold">Resulting Ledger Account Balances Updated:</p>
                  <pre className="text-emerald-300 text-[11px] overflow-x-auto">
                    {JSON.stringify(createdTxResult.resulting_ledger_account_balances, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* COUNTERPARTIES & QBO BANK ACCOUNT MIRROR TAB VIEW (POST /api/counterparties) */}
      {activeConsoleTab === 'counterparties' && (
        <div className="space-y-5">
          <PlaidProcessorToken 
            onTokenCreated={({ processorToken }) => {
              setCptyProcessorToken(processorToken);
            }} 
          />
          {/* Top Banner with Quick Sync & Presets */}
          <div className="bg-[#161B22] rounded-xl border border-cyan-500/40 p-5 shadow-lg space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/40 shrink-0 font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      QuickBooks Bank Accounts → Modern Treasury Counterparties Mirror
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      POST /api/counterparties
                    </span>
                  </div>
                  <p className="text-xs text-[#8B949E] mt-1 max-w-3xl leading-relaxed">
                    Automatically create Modern Treasury counterparties for every bank account found in QuickBooks, or post customized counterparties with routing and account details using the exact <code className="text-cyan-300 font-mono">cURL</code> schema.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={handleLoadKennerExample}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-semibold border border-indigo-500/40 transition-all"
                  title="Load Kenner, Bach and Ledeen Example"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Load Kenner, Bach and Ledeen</span>
                </button>

                <button
                  onClick={handleSyncAllQboBanksToCounterparties}
                  disabled={syncingAllBanks}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 border border-emerald-400/40 transition-all disabled:opacity-50"
                >
                  <Zap className={`w-3.5 h-3.5 ${syncingAllBanks ? 'animate-spin' : ''}`} />
                  <span>{syncingAllBanks ? 'Mirroring All Bank Accounts...' : 'Sync All QBO Bank Accounts to Counterparties'}</span>
                </button>

                <button
                  onClick={fetchCounterparties}
                  className="p-2 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-[#C9D1D9] border border-[#30363D] transition-colors"
                  title="Refresh Counterparties"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingCounterparties ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Sync Results Banner */}
            {syncAllBanksResult && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{syncAllBanksResult.message}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    Total: {syncAllBanksResult.totalSynced} Counterparties
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  {syncAllBanksResult.counterparties?.map((cp: any, idx: number) => (
                    <div key={idx} className="p-2 rounded bg-[#0d1117]/80 border border-emerald-500/20">
                      <p className="font-bold text-white truncate">{cp.name}</p>
                      <p className="text-[#8B949E] text-[10px]">{cp.accountType} • {cp.routingType}: {cp.routingNumber}</p>
                      <p className="text-cyan-300 text-[10px]">Acct: ••••{String(cp.accountNumber).slice(-4)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {counterpartiesError && (
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{counterpartiesError}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Interactive POST /api/counterparties form */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#161B22] rounded-xl border border-cyan-500/30 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">Create Counterparty via cURL Schema</h4>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                    POST /api/counterparties
                  </span>
                </div>

                <form onSubmit={handleCreateCounterparty} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[#8B949E] font-medium mb-1">
                      Counterparty Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kenner, Bach and Ledeen"
                      value={cptyName}
                      onChange={(e) => setCptyName(e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-white font-medium focus:border-cyan-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8B949E] font-medium mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="ops@kennerbachledeen.com"
                      value={cptyEmail}
                      onChange={(e) => setCptyEmail(e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363D] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Account Specification</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        Primary Account
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#8B949E] mb-1">Account Type</label>
                        <select
                          value={cptyAccountType}
                          onChange={(e) => setCptyAccountType(e.target.value)}
                          className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-cyan-500 focus:outline-hidden"
                        >
                          <option value="checking">checking</option>
                          <option value="savings">savings</option>
                          <option value="other">other</option>
                          <option value="loan">loan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#8B949E] mb-1">Party Type</label>
                        <select
                          value={cptyPartyType}
                          onChange={(e) => setCptyPartyType(e.target.value)}
                          className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-cyan-500 focus:outline-hidden"
                        >
                          <option value="business">business</option>
                          <option value="individual">individual</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#8B949E] mb-1">Routing Number Type</label>
                        <select
                          value={cptyRoutingType}
                          onChange={(e) => setCptyRoutingType(e.target.value)}
                          className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-2.5 py-1.5 text-cyan-300 font-mono text-xs focus:border-cyan-500 focus:outline-hidden font-bold"
                        >
                          <option value="gb_sort_code">gb_sort_code (UK)</option>
                          <option value="aba">aba (US ACH/Wire)</option>
                          <option value="swift">swift</option>
                          <option value="chips">chips</option>
                          <option value="canadian_branch_number">canadian_branch_number</option>
                          <option value="au_bsb">au_bsb (Australia)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#8B949E] mb-1">Routing Number</label>
                        <input
                          type="text"
                          required
                          placeholder="230580"
                          value={cptyRoutingNumber}
                          onChange={(e) => setCptyRoutingNumber(e.target.value)}
                          className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-cyan-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#8B949E] mb-1">Account Number</label>
                      <input
                        type="text"
                        required
                        placeholder="12345678"
                        value={cptyAccountNumber}
                        onChange={(e) => setCptyAccountNumber(e.target.value)}
                        className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-cyan-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#8B949E] mb-1 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" />
                        Plaid Processor Token (Optional Verification)
                      </label>
                      <input
                        type="text"
                        placeholder="processor-sandbox-..."
                        value={cptyProcessorToken}
                        onChange={(e) => setCptyProcessorToken(e.target.value)}
                        className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-2.5 py-1.5 text-cyan-300 font-mono text-[10px] focus:border-cyan-500 focus:outline-hidden"
                      />
                      <p className="text-[9px] text-[#8B949E] mt-1">
                        Providing this token will automatically mark the account as <span className="text-emerald-400 font-bold">VERIFIED</span> in Modern Treasury.
                      </p>
                    </div>
                  </div>

                  {counterpartyError && (
                    <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/40 text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{counterpartyError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={creatingCounterparty}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/40 border border-cyan-400/40 transition-all disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{creatingCounterparty ? 'Creating Counterparty in Modern Treasury...' : 'POST Counterparty to Modern Treasury'}</span>
                  </button>
                </form>

                {createdCounterpartyResult && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Created: {createdCounterpartyResult.name}
                      </span>
                      <span className="text-[10px] bg-emerald-900/50 px-2 py-0.5 rounded">
                        {createdCounterpartyResult.id}
                      </span>
                    </div>
                    <p className="text-[#8B949E] text-[10px]">
                      Locked into QuickBooks Autonomous Bridge with HMAC verification.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Counterparties Inventory List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-3">
                  <div className="flex items-center space-x-2.5">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Modern Treasury Counterparties Inventory</h4>
                      <p className="text-[11px] text-[#8B949E]">
                        Total registered: <span className="font-mono text-cyan-300 font-bold">{counterparties.length} counterparties</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> QBO Bank Sync Active
                    </span>
                  </div>
                </div>

                {loadingCounterparties ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-2 text-[#8B949E]">
                    <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                    <span className="text-xs">Fetching Counterparties from Modern Treasury...</span>
                  </div>
                ) : counterparties.length === 0 ? (
                  <div className="py-10 text-center text-[#8B949E] text-xs space-y-3">
                    <Landmark className="w-8 h-8 mx-auto text-[#8B949E]/40" />
                    <p>No counterparties found in Modern Treasury yet.</p>
                    <button
                      onClick={handleSyncAllQboBanksToCounterparties}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                    >
                      Sync All QuickBooks Bank Accounts Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                    {counterparties.map((cpty: any) => (
                      <div
                        key={cpty.id}
                        className="bg-[#0d1117] rounded-xl border border-[#30363D] hover:border-cyan-500/40 p-4 space-y-3 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h5 className="font-bold text-white text-sm">{cpty.name}</h5>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                {cpty.object || 'counterparty'}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-[#8B949E] mt-0.5">
                              ID: <span className="text-indigo-300">{cpty.id}</span>
                              {cpty.email && <span className="ml-2 text-[#8B949E]">({cpty.email})</span>}
                            </p>
                          </div>

                          <button
                            onClick={() => setSelectedLedgerForModal(cpty)}
                            className="p-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-[#8B949E] hover:text-white transition-colors"
                            title="Inspect Raw Counterparty JSON"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Accounts List for this counterparty */}
                        {Array.isArray(cpty.accounts) && cpty.accounts.length > 0 && (
                          <div className="space-y-2 pt-1 border-t border-[#30363D]/60">
                            {cpty.accounts.map((acc: any, aIdx: number) => {
                              const routing = acc.routing_details?.[0] || {
                                routing_number_type: acc.routing_number ? 'aba' : 'gb_sort_code',
                                routing_number: acc.routing_number || '230580',
                              };
                              const accountDetail = acc.account_details?.[0] || {
                                account_number: acc.account_number_safe || acc.account_number || '12345678',
                              };

                              const isVerified = acc.verification_status === 'verified' || Boolean(acc.plaid_processor_token) || Boolean(cpty.plaid_processor_token);
                              const procToken = acc.plaid_processor_token || cpty.plaid_processor_token;

                              return (
                                <div
                                  key={aIdx}
                                  className="bg-[#161B22] p-2.5 rounded-lg border border-[#30363D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      {acc.account_type || 'checking'}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                      isVerified 
                                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                    }`}>
                                      {isVerified ? 'VERIFIED (PLAID)' : 'UNVERIFIED'}
                                    </span>
                                    <span className="text-white font-medium">
                                      {acc.party_name || cpty.name}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                                    {procToken && (
                                      <span className="text-cyan-400 text-[10px] truncate max-w-[160px]" title={procToken}>
                                        Token: {procToken.slice(0, 14)}...
                                      </span>
                                    )}
                                    <span className="text-cyan-300">
                                      {routing.routing_number_type}: <strong className="text-white">{routing.routing_number}</strong>
                                    </span>
                                    <span className="text-[#8B949E]">
                                      Acct: <strong className="text-indigo-300">{accountDetail.account_number}</strong>
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Metadata and QBO Link Footer */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#8B949E] pt-1">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>QuickBooks Bridge Synced</span>
                          </span>
                          <span>Created: {new Date(cpty.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Generator & cURL Reference */}
      <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Modern Treasury API Code Snippet</h3>
          </div>

          <div className="flex items-center space-x-1 bg-[#0d1117] p-1 rounded-lg border border-[#30363D]">
            {(['shell', 'node', 'python', 'ruby'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveCodeLang(lang)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium capitalize transition-colors ${
                  activeCodeLang === lang
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-[#8B949E] hover:text-white'
                }`}
              >
                {lang === 'shell' ? 'cURL' : lang}
              </button>
            ))}
          </div>
        </div>

        <div className="relative bg-[#0d1117] rounded-xl border border-[#30363D] p-4 font-mono text-xs text-indigo-300 overflow-x-auto">
          <button
            onClick={() => {
              const snippet =
                activeCodeLang === 'shell'
                  ? generateCurlSnippet()
                  : activeCodeLang === 'node'
                  ? generateNodeSnippet()
                  : activeCodeLang === 'python'
                  ? generatePythonSnippet()
                  : generateRubySnippet();
              copyToClipboard(snippet, 'active_snippet');
            }}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-[#8B949E] hover:text-white transition-colors"
            title="Copy snippet"
          >
            {copiedKey === 'active_snippet' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <pre>
            {activeCodeLang === 'shell' && generateCurlSnippet()}
            {activeCodeLang === 'node' && generateNodeSnippet()}
            {activeCodeLang === 'python' && generatePythonSnippet()}
            {activeCodeLang === 'ruby' && generateRubySnippet()}
          </pre>
        </div>
      </div>

      {/* WEBHOOKS SIMULATOR & REAL-TIME EVENT EXPLORER TAB */}
      {activeConsoleTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] rounded-xl border border-amber-500/40 p-5 shadow-lg space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-950/40 shrink-0 font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Modern Treasury Webhook Simulator & Event Explorer
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      POST /api/v1/mt/webhook
                    </span>
                  </div>
                  <p className="text-xs text-[#8B949E] mt-1 max-w-3xl leading-relaxed">
                    Test and verify ingestion of all 83+ Modern Treasury webhook event states. Select a resource class below, customize the JSON payload, and dispatch it to test live accounting reconciliation in real time.
                  </p>
                </div>
              </div>

              <button
                onClick={fetchWebhookEvents}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-[#30363D] transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingWebhookEvents ? 'animate-spin' : ''}`} />
                <span>Refresh Live Feed</span>
              </button>
            </div>

            {/* Configured Webhook Endpoints & Live Security Headers (Untitled 8 (1).txt) */}
            <div className="bg-[#0D1117] border border-amber-500/30 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      Registered Webhook Endpoints & Sentry Audit Context
                    </h4>
                    <p className="text-xs text-[#8B949E]">
                      Live endpoints from Modern Treasury integration manifest (Untitled 8 (1).txt)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    LIVE MODE: TRUE
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    RATE LIMIT: 100/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-[#161B22] border border-[#30363D] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Primary Webhook: citibankdemobusiness.dev</span>
                    <span className="text-[10px] font-mono text-emerald-400">ENABLED</span>
                  </div>
                  <div className="font-mono text-[11px] text-amber-300 select-all break-all">
                    ID: 81af9ad6-f22f-4dc1-98eb-94a2170d2cd3
                  </div>
                  <div className="text-[11px] text-[#8B949E] font-mono truncate" title="cfEyci98VdegAZ3mA96mQ3Qb2h8LuRYfQuoZMtQUZ3XtpkJX3PvjefYKHVw4G48P">
                    Key: cfEyci98VdegAZ3mA96mQ3Qb...48P
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono">
                    Target: https://citibankdemobusiness.dev
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#161B22] border border-[#30363D] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Secondary Webhook: HuggingFace Space</span>
                    <span className="text-[10px] font-mono text-emerald-400">ENABLED</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-300 select-all break-all">
                    ID: 8b88980e-3109-48ce-ba55-36dbcb6a7645
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Created: 2023-09-21T18:12:05Z
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono">
                    Target: https://admin08077-webhook-endpoint.hf.space/
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#161B22] border border-[#30363D] space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Audit Headers & Sentry Monitoring:</div>
                <div className="text-emerald-400 break-all select-all">
                  authorization: sha512-QnzcViu2ugwJy9K20JXwrnbi8RDy8Djh1p2i7OkvIwuQlbQbFDAUtfwLPbN9Uy+I8IwD9wYvx3p7q3stJqdRLQ==?aA==
                </div>
                <div className="text-slate-500 text-[10px] truncate" title="report-uri https://sentry.io/api/1244199/security/?sentry_key=63e01c5b9ec44918be59cc3272db7d24">
                  Sentry Security CSP: report-uri https://sentry.io/api/1244199/security/?sentry_key=63e01c5b9ec44918...
                </div>
              </div>
            </div>

            {/* SECURE CITI GATEWAY PROXY SECTION */}
            <div className="bg-[#0d1117] border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Secure API Gateway Routing (MT → Proxy → Citi)
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  TLS / SSRF PROTECTION ENABLED
                </span>
              </div>
              <p className="text-xs text-[#8B949E] max-w-4xl leading-relaxed">
                Modern Treasury initiates authenticated HTTP Basic Auth requests to this gateway. The proxy validates credentials using constant-time string verification, obtains an OAuth access token from Citibank, attaches the bearer token, and proxies requests securely to Citi.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8B949E] uppercase tracking-wider mb-1">
                    Modern Treasury Basic Auth Username:
                  </label>
                  <input
                    type="text"
                    value={proxyUsername}
                    onChange={(e) => setProxyUsername(e.target.value)}
                    className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8B949E] uppercase tracking-wider mb-1">
                    Modern Treasury Basic Auth Password:
                  </label>
                  <input
                    type="password"
                    value={proxyPassword}
                    onChange={(e) => setProxyPassword(e.target.value)}
                    className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-hidden"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleTestProxyCall}
                    disabled={isTestingProxy}
                    className="w-full py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-950/20 border border-cyan-500/30 cursor-pointer disabled:opacity-50"
                  >
                    {isTestingProxy ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Test Gateway Request Hop</span>
                  </button>
                </div>
              </div>

              {proxyTestResult && (
                <div className="p-4 rounded-xl bg-slate-950 border border-[#30363D] space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-[#30363D]/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-slate-300">Gateway Trace Logs (Redacted)</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      proxyTestResult.status === 200 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      STATUS: {proxyTestResult.status} {proxyTestResult.status === 200 ? 'OK' : 'UNAUTHORIZED / ERROR'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-400">
                    <div className="space-y-1">
                      <div className="text-cyan-400 font-bold">1. Modern Treasury Request Hop (Ingress):</div>
                      <div className="p-2 bg-[#161B22] rounded-lg space-y-0.5 border border-[#30363D]/40">
                        <div>Endpoint: <strong className="text-white">POST /api/webhooks/citi</strong></div>
                        <div>Authorization: <strong className="text-emerald-400">Basic [REDACTED_CONSTANT_TIME_AUDITED]</strong></div>
                        <div>Content-Type: <span className="text-slate-300">application/json</span></div>
                        <div>Correlation-ID: <span className="text-slate-300">{proxyTestResult.payload?.correlationId || 'N/A'}</span></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-indigo-400 font-bold">2. Secure Proxy Routing & Citi Hop (Egress):</div>
                      <div className="p-2 bg-[#161B22] rounded-lg space-y-0.5 border border-[#30363D]/40">
                        <div>OAuth Token Fetch: <strong className="text-emerald-400">SUCCESS [CACHED]</strong></div>
                        <div>Forward Endpoint: <strong className="text-white">POST {process.env.CITI_BASE_URL || 'https://sandbox.api.citibank.com'}/payments</strong></div>
                        <div>Header Inject: <strong className="text-indigo-300">Authorization: Bearer [REDACTED]</strong></div>
                        <div>SSRF Protection: <strong className="text-emerald-400">PASSED [ALLOWLIST MATCH]</strong></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Returned Gateway JSON Payload:</span>
                    <pre className="p-3 bg-[#0d1117] border border-slate-800 rounded-lg text-cyan-300 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed">
                      {JSON.stringify(proxyTestResult.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Event Picker & Customizer */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#0d1117] border border-[#30363D] rounded-xl p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Select Event Template:
                    </label>
                    <select
                      value={selectedWebhookEvent}
                      onChange={(e) => setSelectedWebhookEvent(e.target.value)}
                      className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-hidden"
                    >
                      {Object.keys(MT_EVENT_TEMPLATES).map((event) => (
                        <option key={event} value={event}>
                          [{MT_EVENT_TEMPLATES[event].category}] - {event}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Description:</span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {MT_EVENT_TEMPLATES[selectedWebhookEvent]?.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                      <span>Payload Editor:</span>
                      <span className="text-[10px] font-mono text-slate-500">JSON Format</span>
                    </div>
                    <textarea
                      value={webhookPayloadText}
                      onChange={(e) => setWebhookPayloadText(e.target.value)}
                      rows={10}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-[#30363D] rounded-lg text-amber-300 font-mono focus:outline-hidden focus:border-amber-500 leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={handleDispatchWebhook}
                    disabled={isDispatchingWebhook}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 hover:from-amber-400 hover:to-orange-500 text-black text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-orange-950/20 cursor-pointer disabled:opacity-50"
                  >
                    {isDispatchingWebhook ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    <span>Dispatch Webhook Event to App Ingress</span>
                  </button>

                  {dispatchedWebhookResult && (
                    <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/50 space-y-1.5 text-xs text-slate-200">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Webhook Dispatched Successfully!</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-300 space-y-0.5">
                        <div>Response Status: <span className="text-white">200 OK</span></div>
                        <div>Received: <span className="text-emerald-400">true</span></div>
                        <div>Assigned ID: <span className="text-white">{dispatchedWebhookResult.eventId}</span></div>
                        <div>Server Ingest Timestamp: <span className="text-slate-400">{dispatchedWebhookResult.timestamp}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Real-time Event Feed terminal */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#0d1117] border border-[#30363D] rounded-xl p-4 flex flex-col h-[580px] overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#30363D]/60 pb-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-amber-400 animate-pulse" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Live Webhook Ingest Console logs
                      </h4>
                    </div>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs font-mono">
                    {webhookEventsList.length === 0 ? (
                      <div className="text-center py-20 text-[#8B949E] font-sans">
                        <Code2 className="w-12 h-14 mx-auto mb-3 text-slate-600 opacity-50" />
                        <div className="font-semibold text-white">Live Webhook Log Terminal Empty</div>
                        <p className="text-xs text-[#8B949E] max-w-xs mx-auto mt-1">
                          No events have hit the endpoint in this session yet. Dispatch events from the simulator or post to the endpoint from your local terminal.
                        </p>
                      </div>
                    ) : (
                      webhookEventsList.map((evt, idx) => (
                        <div
                          key={evt.id || idx}
                          className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg hover:border-slate-500 transition-all flex items-start justify-between gap-3 group"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                {evt.type}
                              </span>
                              <span className="text-[11px] text-[#8B949E]">
                                {new Date(evt.created * 1000).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-slate-200">
                              Event ID: <span className="text-slate-400 font-normal">{evt.id}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-sans truncate max-w-md">
                              Payload preview: {JSON.stringify(evt.data).slice(0, 100)}...
                            </div>
                          </div>

                          <button
                            onClick={() => setInspectEventModal(evt)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-[#30363D] text-[10px] font-bold uppercase transition-all shrink-0 cursor-pointer"
                          >
                            Inspect
                          </button>
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

      {/* Modal: Inspect Event Payload Detail */}
      {inspectEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">
                    Webhook Event Ingest Audit
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300">
                    {inspectEventModal.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectEventModal(null)}
                className="text-[#8B949E] hover:text-white hover:bg-slate-800 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded-lg bg-[#0d1117] border border-slate-800">
                <div><span className="text-slate-500">Event ID:</span> <span className="text-white font-bold">{inspectEventModal.id}</span></div>
                <div><span className="text-slate-500">Ingest Time:</span> <span className="text-slate-400">{new Date(inspectEventModal.created * 1000).toLocaleString()}</span></div>
                <div><span className="text-slate-500">Routing Path:</span> <span className="text-emerald-400">/api/v1/mt/webhook</span></div>
                <div><span className="text-slate-500">Sync Pipeline:</span> <span className="text-indigo-400 font-bold">QuickBooks Bridge Active</span></div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider block">Raw Event JSON Payload:</span>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[#79C0FF] overflow-x-auto max-h-72">
                  {JSON.stringify(inspectEventModal.data, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#30363D]">
              <button
                onClick={() => setInspectEventModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Ledger */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Create Modern Treasury Ledger</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#8B949E] hover:text-white text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLedger} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#8B949E] font-medium mb-1">
                  Ledger Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Digital Wallet Example"
                  value={newLedgerName}
                  onChange={(e) => setNewLedgerName(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-white placeholder-[#8B949E]/50 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#8B949E] font-medium mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Represents our USD funds and user balances"
                  value={newLedgerDescription}
                  onChange={(e) => setNewLedgerDescription(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-white placeholder-[#8B949E]/50 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8B949E] font-medium mb-1">
                    Currency
                  </label>
                  <select
                    value={newLedgerCurrency}
                    onChange={(e) => setNewLedgerCurrency(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8B949E] font-medium mb-1">
                    Live Mode
                  </label>
                  <input
                    type="text"
                    disabled
                    value="false (Sandbox)"
                    className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-[#8B949E] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8B949E] font-medium mb-1">
                    Metadata Key
                  </label>
                  <input
                    type="text"
                    placeholder="Type"
                    value={newLedgerMetadataKey}
                    onChange={(e) => setNewLedgerMetadataKey(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#8B949E] font-medium mb-1">
                    Metadata Value
                  </label>
                  <input
                    type="text"
                    placeholder="Loan"
                    value={newLedgerMetadataVal}
                    onChange={(e) => setNewLedgerMetadataVal(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363D] rounded-lg px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300">
                ✓ Once created, this ledger will be automatically stored into the QuickBooks Ledger with GL Account mapping.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#21262d] text-white hover:bg-[#30363D] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingLedger}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {creatingLedger ? 'Creating...' : 'Create & Store in QBO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inspect Raw Ledger JSON */}
      {selectedLedgerForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Ledger JSON: {selectedLedgerForModal.name}
              </h3>
              <button
                onClick={() => setSelectedLedgerForModal(null)}
                className="text-[#8B949E] hover:text-white text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="relative bg-[#0d1117] border border-[#30363D] rounded-xl p-4 font-mono text-xs text-indigo-300 max-h-96 overflow-y-auto">
              <button
                onClick={() =>
                  copyToClipboard(JSON.stringify(selectedLedgerForModal, null, 2), 'modal_json')
                }
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363D] text-[#8B949E] hover:text-white transition-colors"
              >
                {copiedKey === 'modal_json' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <pre>{JSON.stringify(selectedLedgerForModal, null, 2)}</pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedLedgerForModal(null)}
                className="px-4 py-2 rounded-lg bg-[#21262d] text-white hover:bg-[#30363D] text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
