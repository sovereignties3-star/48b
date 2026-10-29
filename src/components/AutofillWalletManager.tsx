import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  Layers,
  ArrowRight,
  Shield,
  RefreshCw,
  ExternalLink,
  Code2,
  Sparkles,
  SlidersHorizontal,
  Plus,
  Zap,
  Terminal,
  FileCode
} from 'lucide-react';

export interface MaskedCardData {
  billing_address_id?: string;
  card_art_url?: string;
  card_benefit_source?: string;
  card_creation_source?: string;
  card_info_retrieval_enrollment_state?: string;
  card_issuer?: {
    issuer: string;
    issuer_id: string;
  };
  exp_month: string;
  exp_year: string;
  id: string;
  instrument_id: string;
  last_four: string;
  name_on_card: string;
  product_description: string;
  type: string;
  virtual_card_enrollment_state?: string;
}

export interface BNPLOptionData {
  id: string;
  buy_now_pay_later_option: {
    issuer_id: string;
    eligible_price_range: Array<{
      currency: string;
      min_price_in_micros: string;
      max_price_in_micros: string;
    }>;
  };
}

export interface AutofillWalletItem {
  id: string;
  name: string;
  nonUniqueName?: string;
  title: string;
  type: string;
  dataType: string;
  clientTagHash: string;
  ctime: string;
  mtime: string;
  originatorCacheGuid?: string;
  originatorClientItemId?: string;
  parentId?: string;
  recipientPublicKey?: Record<string, any>;
  serverDefinedUniqueTag?: string;
  specifics: {
    autofill_wallet: {
      type: string;
      payment_instrument_creation_option?: BNPLOptionData;
      masked_card?: MaskedCardData;
    };
  };
  metadata: {
    acked_sequence_number: string;
    client_tag_hash: string;
    creation_time: string;
    is_deleted: boolean;
    modification_time: string;
    sequence_number: string;
    server_id: string;
    server_version: string;
    specifics_hash: string;
  };
}

interface AutofillWalletManagerProps {
  onCardIssued?: () => void;
  onNavigateToCards?: () => void;
}

export function AutofillWalletManager({ onCardIssued, onNavigateToCards }: AutofillWalletManagerProps) {
  const [walletItems, setWalletItems] = useState<AutofillWalletItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [purchaseAmount, setPurchaseAmount] = useState<string>('850.00');
  const [eligibility, setEligibility] = useState<any>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-4x');
  const [issuing, setIssuing] = useState(false);
  const [issueResult, setIssueResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showRawJsonModal, setShowRawJsonModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customJsonInput, setCustomJsonInput] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  const fetchWalletItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/card-catalog/autofill-wallet');
      const data = await res.json();
      if (data.success && data.items.length > 0) {
        setWalletItems(data.items);
        if (!selectedItemId) {
          setSelectedItemId(data.items[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch autofill wallet items:', err);
    } finally {
      setLoading(false);
    }
  };

  const evaluateEligibility = async (amt: string) => {
    try {
      const val = parseFloat(amt) || 0;
      const res = await fetch('/api/card-catalog/autofill-wallet/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUSD: val, issuerId: 'affirm' })
      });
      const data = await res.json();
      if (data.success) {
        setEligibility(data);
        if (data.plans && data.plans.length > 0 && !data.plans.find((p: any) => p.planId === selectedPlanId)) {
          setSelectedPlanId(data.plans[0].planId);
        }
      }
    } catch (err) {
      console.error('Error evaluating BNPL eligibility:', err);
    }
  };

  useEffect(() => {
    fetchWalletItems();
  }, []);

  useEffect(() => {
    evaluateEligibility(purchaseAmount);
  }, [purchaseAmount]);

  const selectedItem = walletItems.find((item) => item.id === selectedItemId) || walletItems[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleIssueVirtualCard = async () => {
    setIssuing(true);
    setIssueResult(null);
    try {
      const val = parseFloat(purchaseAmount) || 850;
      const res = await fetch('/api/card-catalog/autofill-wallet/issue-virtual-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountUSD: val,
          planId: selectedPlanId,
          merchant: 'Kronos E-Commerce & Merchant Terminal'
        })
      });
      const data = await res.json();
      if (data.success) {
        setIssueResult(data.card);
        if (onCardIssued) onCardIssued();
      }
    } catch (err: any) {
      console.error('Failed to issue virtual card:', err);
    } finally {
      setIssuing(false);
    }
  };

  const handleAddCustomItem = async () => {
    setAddError(null);
    try {
      const parsed = JSON.parse(customJsonInput);
      const res = await fetch('/api/card-catalog/autofill-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setCustomJsonInput('');
        await fetchWalletItems();
        if (parsed.ID || parsed.id) {
          setSelectedItemId(parsed.ID || parsed.id);
        }
      } else {
        setAddError(data.error || 'Failed to save item');
      }
    } catch (err: any) {
      setAddError(err.message || 'Invalid JSON syntax');
    }
  };

  // Decode base64 title helper
  const decodeBase64Title = (rawTitle: string) => {
    const match = rawTitle.match(/([A-Za-z0-9+/=]{20,})/);
    if (match) {
      try {
        return atob(match[1]);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const presets = ['35.00', '150.00', '500.00', '1200.00', '4500.00', '28000.00', '35000.00'];

  const isMaskedCard = selectedItem?.specifics?.autofill_wallet?.type === 'MASKED_CREDIT_CARD';
  const maskedCard = selectedItem?.specifics?.autofill_wallet?.masked_card;
  const isBNPL = selectedItem?.specifics?.autofill_wallet?.type === 'PAYMENT_INSTRUMENT_CREATION_OPTION';
  const bnplData = selectedItem?.specifics?.autofill_wallet?.payment_instrument_creation_option;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#161B22] rounded-2xl border border-purple-500/30 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Wallet className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Google Chrome & Android Autofill Wallet Sync
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {walletItems.length} SYNCHRONIZED ENTITIES
                </span>
              </div>
              <p className="text-xs text-[#8B949E] mt-1">
                Decentralized payment instruments synched via Chrome Sync client tag hashes. Supports Server Cards (Cash App Card) and BNPL Financing Options (Affirm).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-semibold border border-[#30363D] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-purple-400" />
              <span>Import Sync Entity</span>
            </button>
            <button
              onClick={fetchWalletItems}
              disabled={loading}
              className="p-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white border border-[#30363D] transition-colors cursor-pointer"
              title="Refresh Sync State"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Entity Selector Ribbon */}
      <div className="bg-[#161B22] p-3 rounded-2xl border border-[#30363D] flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-[#8B949E] px-2 font-bold uppercase">
          Synced Items:
        </span>
        {walletItems.map((item) => {
          const isSelected = item.id === (selectedItem?.id || '');
          const isCardType = item.specifics?.autofill_wallet?.type === 'MASKED_CREDIT_CARD';
          const cardObj = item.specifics?.autofill_wallet?.masked_card;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedItemId(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50 font-bold'
                  : 'bg-[#0D1117] text-[#8B949E] hover:text-white border border-[#30363D]'
              }`}
            >
              {isCardType ? (
                <CreditCard className="w-3.5 h-3.5 text-sky-400" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
              )}
              <span>
                {isCardType
                  ? `${cardObj?.product_description || 'Card'} •••• ${cardObj?.last_four || '2300'}`
                  : 'Affirm BNPL Instrument'}
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isSelected ? 'bg-purple-800 text-purple-200' : 'bg-[#161B22] text-[#8B949E]'
              }`}>
                {isCardType ? 'SERVER CARD' : 'CREATION OPTION'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Synced Entity Card + Interactive Inspector / Action Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Synced Entity Card Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Payment Instrument Entity
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                STATE: SYNCHRONIZED
              </span>
            </div>

            {selectedItem && (
              <div className="space-y-4 text-xs">
                {/* Visual Identity Card Display */}
                {isMaskedCard && maskedCard ? (
                  /* Server Masked Card Art */
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0b0e14] via-[#161B22] to-[#1c1917] border border-sky-500/40 shadow-xl space-y-4 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          {maskedCard.product_description.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded">
                          {maskedCard.type}
                        </span>
                      </div>
                      <span className="text-sm font-black italic tracking-widest text-white">
                        VISA
                      </span>
                    </div>

                    {/* Chip and Art */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="w-10 h-8 rounded-md bg-gradient-to-tr from-amber-400 to-amber-200 border border-amber-500/50 shadow-inner flex items-center justify-center">
                        <div className="w-7 h-5 border border-amber-600/40 rounded-[2px]" />
                      </div>
                      {maskedCard.card_art_url && (
                        <img
                          src={maskedCard.card_art_url}
                          alt="Card Art"
                          className="h-9 w-auto object-contain rounded drop-shadow"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // Hide image if blocked in sandboxed frame
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>

                    {/* Account Number */}
                    <div>
                      <p className="text-lg font-mono font-bold tracking-widest text-white">
                        •••• •••• •••• {maskedCard.last_four}
                      </p>
                    </div>

                    {/* Cardholder & Expiry */}
                    <div className="flex items-end justify-between pt-2 border-t border-[#30363D]/60 text-[11px]">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#8B949E] block">
                          Cardholder
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide">
                          {maskedCard.name_on_card}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-[#8B949E] block">
                          Expires
                        </span>
                        <span className="font-mono font-bold text-white">
                          0{maskedCard.exp_month}/{maskedCard.exp_year.slice(-2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* BNPL Affirm Card Art */
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#1C1827] via-[#161B22] to-[#0D1117] border border-purple-500/40 space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">
                        {selectedItem.specifics?.autofill_wallet?.type || 'PAYMENT_INSTRUMENT_CREATION_OPTION'}
                      </span>
                      <span className="text-xs font-black text-white uppercase tracking-widest px-2 py-0.5 bg-blue-600 rounded">
                        AFFIRM
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white break-all">
                        {selectedItem.name}
                      </h4>
                      {decodeBase64Title(selectedItem.name) && (
                        <p className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          Decoded: <span className="bg-[#0D1117] px-1.5 py-0.5 rounded">{decodeBase64Title(selectedItem.name)}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-500/20 text-[11px]">
                      <div>
                        <span className="text-[#8B949E] block text-[10px]">ELIGIBLE MINIMUM:</span>
                        <span className="font-mono font-bold text-white">$35.00 USD</span>
                        <span className="text-[9px] text-[#8B949E] block font-mono">35,000,000 micros</span>
                      </div>
                      <div>
                        <span className="text-[#8B949E] block text-[10px]">ELIGIBLE MAXIMUM:</span>
                        <span className="font-mono font-bold text-white">$30,000.00 USD</span>
                        <span className="text-[9px] text-[#8B949E] block font-mono">30,000,000,000 micros</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Technical Metadata Fields */}
                <div className="space-y-2 bg-[#0D1117] p-3.5 rounded-xl border border-[#30363D] font-mono">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[#8B949E] text-[10px] shrink-0">ENTITY ID:</span>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-purple-300 text-[11px] truncate max-w-[200px]" title={selectedItem.id}>
                        {selectedItem.id}
                      </span>
                      <button
                        onClick={() => handleCopy(selectedItem.id, 'id')}
                        className="text-[#8B949E] hover:text-white shrink-0 cursor-pointer"
                      >
                        {copiedKey === 'id' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[#8B949E] text-[10px] shrink-0">CLIENT TAG HASH:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-300 text-[11px]">{selectedItem.clientTagHash}</span>
                      <button
                        onClick={() => handleCopy(selectedItem.clientTagHash, 'tag')}
                        className="text-[#8B949E] hover:text-white shrink-0 cursor-pointer"
                      >
                        {copiedKey === 'tag' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[#8B949E] text-[10px] shrink-0">SPECIFICS HASH:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-300 text-[11px]">{selectedItem.metadata?.specifics_hash}</span>
                      <button
                        onClick={() => handleCopy(selectedItem.metadata?.specifics_hash, 'spec')}
                        className="text-[#8B949E] hover:text-white shrink-0 cursor-pointer"
                      >
                        {copiedKey === 'spec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[#8B949E] text-[10px] shrink-0">SERVER VERSION:</span>
                    <span className="text-amber-400 text-[11px]">{selectedItem.metadata?.server_version}</span>
                  </div>

                  {isMaskedCard && maskedCard && (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[#8B949E] text-[10px] shrink-0">INSTRUMENT ID:</span>
                        <span className="text-sky-300 text-[11px]">{maskedCard.instrument_id}</span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[#8B949E] text-[10px] shrink-0">CREATION SOURCE:</span>
                        <span className="text-zinc-400 text-[10px]">{maskedCard.card_creation_source}</span>
                      </div>
                    </>
                  )}

                  {isBNPL && bnplData && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#8B949E] text-[10px] shrink-0">INSTRUMENT ID:</span>
                      <span className="text-cyan-400 text-[11px]">{bnplData.id}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={() => setShowRawJsonModal(true)}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>View Raw Sync JSON Payload</span>
                  </button>
                  <span className="text-[10px] text-[#8B949E]">
                    Type: {selectedItem.specifics?.autofill_wallet?.type}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Action Engine (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {isMaskedCard && maskedCard ? (
            /* Server Card (Cash App Card) Operational Center */
            <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Server Card Details & ISO Magstripe Integration
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  READY FOR VAULT & POS ENCODING
                </span>
              </div>

              {/* Card Profile Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D] space-y-1">
                  <span className="text-[10px] text-[#8B949E] font-mono">PRODUCT</span>
                  <p className="text-sm font-bold text-white">{maskedCard.product_description}</p>
                  <span className="text-[10px] text-sky-400 font-mono">VISA Debit</span>
                </div>
                <div className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D] space-y-1">
                  <span className="text-[10px] text-[#8B949E] font-mono">CARDHOLDER</span>
                  <p className="text-sm font-bold text-white uppercase">{maskedCard.name_on_card}</p>
                  <span className="text-[10px] text-zinc-400 font-mono">Verified Signer</span>
                </div>
                <div className="bg-[#0D1117] p-3 rounded-xl border border-[#30363D] space-y-1">
                  <span className="text-[10px] text-[#8B949E] font-mono">EXPIRATION</span>
                  <p className="text-sm font-bold text-emerald-400 font-mono">
                    0{maskedCard.exp_month} / {maskedCard.exp_year}
                  </p>
                  <span className="text-[10px] text-[#8B949E] font-mono">Active Valid</span>
                </div>
              </div>

              {/* ISO 7813 Track 1/2/3 Stream Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-sky-400" />
                    Encoded ISO 7813 Magnetic Stripe Simulation
                  </h4>
                  <span className="text-[10px] font-mono text-[#8B949E]">
                    Track 1 & Track 2 Pre-Formatted
                  </span>
                </div>

                <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D] font-mono text-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sky-400 text-[11px] shrink-0 font-bold">TRACK 1:</span>
                    <span className="text-zinc-300 break-all text-[11px]">
                      %B4242389102832300^{maskedCard.name_on_card.toUpperCase()}^29072010000000000?
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 pt-2 border-t border-[#30363D]/60">
                    <span className="text-sky-400 text-[11px] shrink-0 font-bold">TRACK 2:</span>
                    <span className="text-zinc-300 break-all text-[11px]">
                      ;4242389102832300290720100000?
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 pt-2 border-t border-[#30363D]/60">
                    <span className="text-sky-400 text-[11px] shrink-0 font-bold">TRACK 3:</span>
                    <span className="text-zinc-500 break-all text-[11px]">
                      ;00000000000000000000?
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions for Server Card */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {onNavigateToCards && (
                  <button
                    onClick={onNavigateToCards}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-sky-950/40"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>View in Primary Card Catalog Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleCopy(
                    `%B4242389102832300^${maskedCard.name_on_card.toUpperCase()}^29072010000000000?\n;4242389102832300290720100000?`,
                    'magstripe'
                  )}
                  className="py-3 px-4 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-semibold border border-[#30363D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedKey === 'magstripe' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'magstripe' ? 'Copied Tracks!' : 'Copy Tracks 1 & 2'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* BNPL Affirm Financing Simulator & Card Issuer */
            <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Affirm BNPL Financing Simulator & Virtual Card Issuer
                  </h3>
                </div>
                <span className="text-xs font-mono text-purple-400 font-bold">
                  $35 – $30,000 USD
                </span>
              </div>

              {/* Input Amount Section */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-[#8B949E] block">
                  Simulated Transaction Checkout Amount (USD):
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#8B949E]">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="100000"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-8 pr-4 py-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-purple-500 shadow-inner"
                    placeholder="0.00"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-[#8B949E] mr-1">Presets:</span>
                  {presets.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPurchaseAmount(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        purchaseAmount === p
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-[#0D1117] hover:bg-[#21262D] text-[#8B949E] hover:text-white border border-[#30363D]'
                      }`}
                    >
                      ${parseFloat(p).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eligibility Banner */}
              {eligibility && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    eligibility.isEligible
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/20 border-red-500/40 text-red-300'
                  }`}
                >
                  {eligibility.isEligible ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs">
                    <p className="font-bold">
                      {eligibility.isEligible
                        ? 'Approved for Affirm Payment Instrument Creation'
                        : 'Outside Eligible Financing Range'}
                    </p>
                    <p className="text-[11px] opacity-90">{eligibility.reason}</p>
                  </div>
                </div>
              )}

              {/* Repayment Schedules */}
              {eligibility?.isEligible && eligibility.plans && eligibility.plans.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                    Select Financing Plan
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {eligibility.plans.map((plan: any) => {
                      const isSelected = selectedPlanId === plan.planId;
                      return (
                        <div
                          key={plan.planId}
                          onClick={() => setSelectedPlanId(plan.planId)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-950/30 border-purple-500 shadow-md shadow-purple-950/50'
                              : 'bg-[#0D1117] border-[#30363D] hover:border-zinc-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{plan.title}</span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                plan.apr === 0
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {plan.apr === 0 ? '0% APR' : `${plan.apr}% APR`}
                            </span>
                          </div>

                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-lg font-bold font-mono text-white">
                              ${plan.perPayment.toFixed(2)}
                            </span>
                            <span className="text-[11px] text-[#8B949E]">
                              / {plan.interval}
                            </span>
                          </div>

                          <div className="mt-2 pt-2 border-t border-[#30363D]/60 flex items-center justify-between text-[10px] text-[#8B949E] font-mono">
                            <span>Total: ${plan.totalRepayment.toFixed(2)}</span>
                            <span>Interest: ${plan.totalInterest.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Issue One-Time Virtual Card Action Button */}
              <div className="pt-3 border-t border-[#30363D] space-y-3">
                <button
                  onClick={handleIssueVirtualCard}
                  disabled={!eligibility?.isEligible || issuing}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                    eligibility?.isEligible && !issuing
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/40'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                  }`}
                >
                  {issuing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Minting Affirm Virtual Card & Track Data...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-purple-200" />
                      <span>
                        Issue Affirm Virtual Card (${parseFloat(purchaseAmount || '0').toFixed(2)} USD) to Vault
                      </span>
                    </>
                  )}
                </button>

                {issueResult && (
                  <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Affirm Virtual Mastercard Minted Successfully!
                      </span>
                      {onNavigateToCards && (
                        <button
                          onClick={onNavigateToCards}
                          className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-semibold cursor-pointer underline"
                        >
                          <span>View in Card Vault</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="bg-[#0D1117] p-3 rounded-lg border border-[#30363D] font-mono text-xs flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold">{issueResult.name}</p>
                        <p className="text-[#8B949E] text-[11px]">{issueResult.accountNumberMasked} | Exp {issueResult.expiryDate}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-bold">${issueResult.creditLimit?.toLocaleString()} USD</span>
                        <span className="block text-[10px] text-[#8B949E]">LIMIT</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Raw Sync JSON Modal */}
      {showRawJsonModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161B22] rounded-2xl border border-purple-500/50 max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">
                  Chrome Autofill Wallet Sync Entity (Protobuf / JSON)
                </h3>
              </div>
              <button
                onClick={() => setShowRawJsonModal(false)}
                className="text-[#8B949E] hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-[#0D1117] rounded-xl p-4 border border-[#30363D]">
              <pre className="font-mono text-xs text-purple-300 whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(selectedItem, null, 2)}
              </pre>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handleCopy(JSON.stringify(selectedItem, null, 2), 'rawJson')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                {copiedKey === 'rawJson' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'rawJson' ? 'Copied JSON!' : 'Copy Full JSON'}</span>
              </button>

              <button
                onClick={() => setShowRawJsonModal(false)}
                className="px-4 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Custom Sync Entity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Import Autofill Wallet Sync Entity
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8B949E] hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#8B949E]">
              Paste the JSON payload representing the Chrome/Android Autofill Wallet payment instrument creation option or masked card.
            </p>

            <textarea
              rows={8}
              value={customJsonInput}
              onChange={(e) => setCustomJsonInput(e.target.value)}
              placeholder="Paste JSON entity here..."
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-purple-500"
            />

            {addError && (
              <p className="text-xs text-red-400 font-mono flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {addError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#30363D]">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomItem}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
              >
                Save & Synchronize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutofillWalletManager;
