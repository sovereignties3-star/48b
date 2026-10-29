import React, { useState, useEffect } from 'react';
import { Building, FileText, Printer, CheckCircle2, Bot, Play, DollarSign, MapPin, ShieldCheck, Download, Sparkles, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface HouseListing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  seller: string;
  status: string;
  paperworkGenerated: boolean;
}

export const HousePdfAcquisitionHub: React.FC = () => {
  const [listings, setListings] = useState<HouseListing[]>([]);
  const [totalProperties, setTotalProperties] = useState<number>(0);
  const [totalValuation, setTotalValuation] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isAutonomousBuying, setIsAutonomousBuying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'paperwork'>('listings');
  const [selectedHouseForDoc, setSelectedHouseForDoc] = useState<HouseListing | null>(null);
  const [purchaseLogs, setPurchaseLogs] = useState<string[]>([]);
  const [bulkResult, setBulkResult] = useState<any>(null);

  useEffect(() => {
    fetchListings(page, searchQuery);
  }, [page]);

  const fetchListings = async (pageNum: number, search: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/houses/listings?page=${pageNum}&limit=30&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setListings(data.listings);
        setTotalProperties(data.totalProperties);
        setTotalValuation(data.totalValuationUsd);
        setTotalPages(data.totalPages);
        setPurchaseLogs(prev => [`[PDF Parser] Loaded ${data.totalProperties} properties from pdf/houses.pdf (Page ${pageNum}/${data.totalPages})`, ...prev]);
      }
    } catch (e) {
      console.error('Failed to fetch listings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchListings(1, searchQuery);
  };

  const handleBuyAll = async () => {
    setIsAutonomousBuying(true);
    setPurchaseLogs(prev => ['[AI Autonomous Agent] Initiating bulk Fedwire settlement for ALL 1,250 houses from pdf/houses.pdf...', ...prev]);

    try {
      const res = await fetch('/api/houses/acquire-all', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBulkResult(data);
        setListings(prev => prev.map(h => ({ ...h, status: 'Acquired', paperworkGenerated: true })));
        setPurchaseLogs(prev => [
          `[SUCCESS] All 1,250 properties successfully acquired! Total valuation: $${data.portfolioSummary.totalAmountPaidUsd.toLocaleString()}`,
          `[ISO 20022] Generated master pac.008.001.10 XML payment file with Fedwire Sovereign Escrow instructions.`,
          ...prev
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAutonomousBuying(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Building className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Massive Real Estate Portfolio Acquisition Engine (1,250 Estates)</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>pdf/houses.pdf (1,250 Houses Catalog)</span>
              <span className="text-xs font-mono px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                ISO 20022 PAC.008 READY
              </span>
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Parsing all 1,250 residential & commercial properties from <code className="text-indigo-300 font-mono">pdf/houses.pdf</code>, executing autonomous bulk acquisition, and generating institutional ISO 20022 wire transfer files.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchListings(page, searchQuery)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-gray-200 text-xs font-semibold border border-[#30363d] transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              <span>Refresh Catalog</span>
            </button>
            <button
              onClick={handleBuyAll}
              disabled={isAutonomousBuying}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>{isAutonomousBuying ? 'Buying 1,250 Houses...' : '🤖 AI: Buy All 1,250 Houses & Generate pac.008'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-indigo-500/20">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-indigo-500/20">
            <p className="text-xs text-gray-400 font-mono">Total Properties in PDF</p>
            <p className="text-xl font-bold text-white mt-1">1,250 Estates</p>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-indigo-500/20">
            <p className="text-xs text-gray-400 font-mono">Total Portfolio Valuation</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">${totalValuation.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-indigo-500/20">
            <p className="text-xs text-gray-400 font-mono">Acquisition Status</p>
            <p className="text-xl font-bold text-indigo-400 mt-1">{bulkResult ? '1,250 Acquired' : 'Ready to Buy'}</p>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-indigo-500/20">
            <p className="text-xs text-gray-400 font-mono">ISO 20022 Status</p>
            <p className="text-xl font-bold text-amber-400 mt-1">pac.008.001.10</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by address, city, ID, seller..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer">
            Search
          </button>
        </form>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'listings' ? 'bg-indigo-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:text-white'
            }`}
          >
            Properties Catalog
          </button>
          <button
            onClick={() => setActiveTab('paperwork')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'paperwork' ? 'bg-indigo-600 text-white' : 'bg-[#0D1117] text-gray-400 hover:text-white'
            }`}
          >
            ISO 20022 pac.008 XML & Deeds
          </button>
        </div>
      </div>

      {/* Content Tab 1: Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-3 text-center py-12 text-gray-400 font-mono text-xs">
                Loading 1,250 properties from pdf/houses.pdf...
              </div>
            ) : (
              listings.map(house => (
                <div key={house.id} className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-lg flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                        {house.id} • {house.propertyType}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        bulkResult || house.status === 'Acquired'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-gray-300 border border-slate-700'
                      }`}>
                        {bulkResult ? 'Acquired' : house.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{house.address}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{house.city}, {house.state} {house.zip}</span>
                    </p>

                    <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-xl bg-[#0D1117] border border-[#21262d] text-center">
                      <div>
                        <p className="text-[10px] text-gray-400 font-mono">Beds</p>
                        <p className="text-sm font-bold text-white">{house.bedrooms}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-mono">Baths</p>
                        <p className="text-sm font-bold text-white">{house.bathrooms}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-mono">SqFt</p>
                        <p className="text-sm font-bold text-white">{house.sqft.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-300">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Asking Price:</span>
                        <span className="font-bold text-emerald-400 text-sm">${house.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Seller Entity:</span>
                        <span className="text-gray-200 truncate max-w-[180px]">{house.seller}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
            <p className="text-xs text-gray-400">
              Showing page <span className="font-bold text-white">{page}</span> of <span className="font-bold text-white">{totalPages}</span> ({totalProperties} total estates)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-white text-xs rounded-lg disabled:opacity-40 transition cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-white text-xs rounded-lg disabled:opacity-40 transition cursor-pointer flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Tab 2: ISO 20022 XML & Paperwork */}
      {activeTab === 'paperwork' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#30363D]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>ISO 20022 pac.008.001.10 Bulk Wire Settlement XML</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Institutional Fedwire settlement message generated for all 1,250 houses acquired from pdf/houses.pdf.
                </p>
              </div>
              <button
                onClick={() => {
                  if (bulkResult?.iso20022_pac008_xml) {
                    const blob = new Blob([bulkResult.iso20022_pac008_xml], { type: 'application/xml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'pacs.008.bulk.acquisition.xml';
                    a.click();
                  } else {
                    alert('Please click "🤖 AI: Buy All 1,250 Houses" first to generate the settlement XML.');
                  }
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download pac.008 XML</span>
              </button>
            </div>

            <div className="bg-[#0D1117] rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-96 overflow-y-auto border border-[#21262d]">
              {bulkResult ? (
                <pre>{bulkResult.iso20022_pac008_xml}</pre>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  [Click "🤖 AI: Buy All 1,250 Houses & Generate pac.008" above to generate and inspect the full ISO 20022 XML payment payload for all 1,250 properties.]
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Acquisition Logs */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span>AI Bulk Acquisition & PDF Parsing Logs</span>
        </h3>
        <div className="bg-[#0D1117] rounded-xl p-4 font-mono text-xs text-gray-300 space-y-1.5 max-h-48 overflow-y-auto border border-[#21262d]">
          {purchaseLogs.map((log, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <span className="text-indigo-400 shrink-0">›</span>
              <span className={log.includes('SUCCESS') || log.includes('Acquired') ? 'text-emerald-400 font-semibold' : ''}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HousePdfAcquisitionHub;
