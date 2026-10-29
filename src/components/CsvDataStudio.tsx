import React, { useState, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
  Table as TableIcon,
  Sparkles,
  Users,
  Briefcase,
  GraduationCap,
  Target,
  MessageSquare,
  Shield,
  Layers,
  Database,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Eye,
  Sliders,
  Code,
  Tag,
  Calendar,
  Mail,
  Phone,
  Building,
  UserCheck,
  Send,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

export interface ColumnSchema {
  name: string;
  type: 'string' | 'number' | 'date' | 'email' | 'url' | 'boolean' | 'array';
  sampleValues: any[];
  uniqueCount: number;
  nullCount: number;
}

export interface DatasetMeta {
  id: string;
  name: string;
  filename: string;
  relativePath: string;
  fullPath: string;
  sizeBytes: number;
  rowCount: number;
  columnCount: number;
  columns: ColumnSchema[];
  category: string;
  previewRows: Record<string, any>[];
  lastModified: string;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6366f1',
  '#84cc16', '#a855f7', '#d946ef', '#0ea5e9', '#eab308',
];

export const CsvDataStudio: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');

  // Active Dataset Data & State
  const [datasetDetails, setDatasetDetails] = useState<any>(null);
  const [rowsLoading, setRowsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [tableSearch, setTableSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'charts' | 'schema' | 'chat'>('table');

  // Editing state
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editedRowData, setEditedRowData] = useState<Record<string, any>>({});
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // AI Query state
  const [nlQuery, setNlQuery] = useState('');
  const [nlResults, setNlResults] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  // Selected row for details modal
  const [selectedRowDetail, setSelectedRowDetail] = useState<Record<string, any> | null>(null);

  // Fetch all datasets on mount
  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/csv/datasets');
      const data = await res.json();
      if (data.success) {
        setDatasets(data.datasets);
        if (data.datasets.length > 0 && !selectedDatasetId) {
          setSelectedDatasetId(data.datasets[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  // Fetch specific dataset data when selectedDatasetId or query params change
  useEffect(() => {
    if (!selectedDatasetId) return;
    const loadDataset = async () => {
      setRowsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: String(currentPage),
          limit: String(pageSize),
          search: tableSearch,
          sortBy: sortColumn,
          sortDir: sortDirection,
        });
        const res = await fetch(`/api/csv/dataset/${selectedDatasetId}?${queryParams}`);
        const data = await res.json();
        if (data.success) {
          setDatasetDetails(data);
        }
      } catch (err) {
        console.error('Error fetching dataset details:', err);
      } finally {
        setRowsLoading(false);
      }
    };
    loadDataset();
  }, [selectedDatasetId, currentPage, pageSize, tableSearch, sortColumn, sortDirection]);

  const activeDatasetMeta = useMemo(() => {
    return datasets.find(d => d.id === selectedDatasetId);
  }, [datasets, selectedDatasetId]);

  const categories = useMemo(() => {
    const cats = new Set(datasets.map(d => d.category));
    return ['All', ...Array.from(cats)];
  }, [datasets]);

  const filteredDatasets = useMemo(() => {
    return datasets.filter(d => {
      const matchCat = activeCategory === 'All' || d.category === activeCategory;
      const matchSearch =
        d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.filename.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.category.toLowerCase().includes(searchFilter.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [datasets, activeCategory, searchFilter]);

  const handleSort = (colName: string) => {
    if (sortColumn === colName) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colName);
      setSortDirection('asc');
    }
  };

  const handleExportCsv = () => {
    if (!datasetDetails || !datasetDetails.rows) return;
    const headers = datasetDetails.columns.join(',');
    const rows = datasetDetails.rows.map((r: any) => {
      return datasetDetails.columns
        .map((col: string) => {
          const val = r[col] !== undefined ? String(r[col]).replace(/"/g, '""') : '';
          return `"${val}"`;
        })
        .join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeDatasetMeta?.name || 'dataset'}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    if (!datasetDetails || !datasetDetails.rows) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(datasetDetails.rows, null, 2)
    )}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `${activeDatasetMeta?.name || 'dataset'}_export.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveRow = async (rowIndex: number) => {
    if (!datasetDetails) return;
    setIsSaving(true);
    try {
      const updatedRows = [...datasetDetails.rows];
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...editedRowData };
      
      const res = await fetch(`/api/csv/save/${selectedDatasetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: updatedRows }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus({ type: 'success', message: 'Row updated & saved to CSV!' });
        setDatasetDetails((prev: any) => ({ ...prev, rows: updatedRows }));
        setEditingRowIndex(null);
        setEditedRowData({});
      } else {
        setSaveStatus({ type: 'error', message: data.error || 'Failed to save' });
      }
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleAddNewRow = async () => {
    if (!datasetDetails) return;
    setIsSaving(true);
    try {
      const updatedRows = [newRowData, ...datasetDetails.rows];
      const res = await fetch(`/api/csv/save/${selectedDatasetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: updatedRows }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus({ type: 'success', message: 'New row added & saved!' });
        setDatasetDetails((prev: any) => ({ ...prev, rows: updatedRows, totalRows: prev.totalRows + 1 }));
        setIsAddingRow(false);
        setNewRowData({});
      } else {
        setSaveStatus({ type: 'error', message: data.error || 'Failed to add row' });
      }
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleDeleteRow = async (rowIndex: number) => {
    if (!datasetDetails || !window.confirm('Delete this row from the CSV dataset?')) return;
    setIsSaving(true);
    try {
      const updatedRows = datasetDetails.rows.filter((_: any, idx: number) => idx !== rowIndex);
      const res = await fetch(`/api/csv/save/${selectedDatasetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: updatedRows }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus({ type: 'success', message: 'Row deleted and updated!' });
        setDatasetDetails((prev: any) => ({ ...prev, rows: updatedRows, totalRows: Math.max(0, prev.totalRows - 1) }));
      }
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: err.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleNlQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;
    setIsQuerying(true);
    try {
      const res = await fetch('/api/csv/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: nlQuery }),
      });
      const data = await res.json();
      setNlResults(data);
    } catch (err) {
      console.error('Query failed:', err);
    } finally {
      setIsQuerying(false);
    }
  };

  // Helper to render special persona badges/icons based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Network & Connections': return <Users className="w-4 h-4 text-blue-400" />;
      case 'Jobs & Career': return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'Learning & Skills': return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'Marketing & Demographics': return <Target className="w-4 h-4 text-amber-400" />;
      case 'Services Marketplace': return <Building className="w-4 h-4 text-cyan-400" />;
      case 'Profile & Identity': return <Shield className="w-4 h-4 text-rose-400" />;
      case 'Messages & AI': return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      default: return <FileSpreadsheet className="w-4 h-4 text-slate-400" />;
    }
  };

  // Format bytes helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-800/40 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/40 rounded-xl text-indigo-400 shadow-inner">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Universal CSV Data Studio & Intelligence UI
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-medium">
                    {datasets.length} Datasets Loaded
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Autonomous parsing, dynamic interface generation, charts, schema inspection & natural language search across all CSVs
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchDatasets}
              className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Rescan CSV files in workspace"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Rescan Workspace
            </button>
            <button
              onClick={handleExportCsv}
              disabled={!datasetDetails?.rows?.length}
              className="px-3.5 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg border border-indigo-500 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={handleExportJson}
              disabled={!datasetDetails?.rows?.length}
              className="px-3.5 py-2 text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg border border-purple-500 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <Code className="w-3.5 h-3.5" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Global Dataset Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-3 border-t border-slate-800/80">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <Database className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Datasets</div>
              <div className="text-sm font-bold text-white">{datasets.length} CSV Files</div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Total Records</div>
              <div className="text-sm font-bold text-emerald-400">
                {datasets.reduce((acc, d) => acc + d.rowCount, 0).toLocaleString()} Rows
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Total Size</div>
              <div className="text-sm font-bold text-purple-300">
                {formatBytes(datasets.reduce((acc, d) => acc + d.sizeBytes, 0))}
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <Users className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Network Records</div>
              <div className="text-sm font-bold text-cyan-300">
                {datasets.filter(d => d.category === 'Network & Connections').reduce((acc, d) => acc + d.rowCount, 0).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Learning & Skills</div>
              <div className="text-sm font-bold text-amber-300">
                {datasets.filter(d => d.category === 'Learning & Skills').reduce((acc, d) => acc + d.rowCount, 0).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Career / Jobs</div>
              <div className="text-sm font-bold text-rose-300">
                {datasets.filter(d => d.category === 'Jobs & Career').reduce((acc, d) => acc + d.rowCount, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Dataset Selector & Categories */}
        <div className="w-full lg:w-80 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0">
          {/* Category Filter Tabs */}
          <div className="p-3 border-b border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2 px-1">
              Dataset Categories
            </div>
            <div className="flex flex-wrap gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dataset Search Box */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter CSV datasets..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Dataset List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredDatasets.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No CSV datasets match filter.
              </div>
            ) : (
              filteredDatasets.map(d => {
                const isSelected = d.id === selectedDatasetId;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDatasetId(d.id);
                      setCurrentPage(1);
                      setTableSearch('');
                      setSortColumn('');
                      setEditingRowIndex(null);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start justify-between gap-2 border ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500/80 text-white shadow-sm'
                        : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 overflow-hidden">
                      <div className="mt-0.5 shrink-0">{getCategoryIcon(d.category)}</div>
                      <div className="truncate">
                        <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                          {d.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {d.filename}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span className="text-emerald-400 font-medium">{d.rowCount} rows</span>
                          <span>•</span>
                          <span>{d.columnCount} cols</span>
                          <span>•</span>
                          <span>{formatBytes(d.sizeBytes)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Content Area: Multi-Mode Dynamic UI & Studio */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          {/* Active Dataset Control Bar */}
          <div className="bg-slate-900/80 border-b border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400">
                {activeDatasetMeta ? getCategoryIcon(activeDatasetMeta.category) : <FileSpreadsheet className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  {activeDatasetMeta?.name || 'Select a Dataset'}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {activeDatasetMeta?.relativePath}
                  </span>
                </h2>
                <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                  <span>Category: <strong className="text-indigo-300">{activeDatasetMeta?.category}</strong></span>
                  <span>•</span>
                  <span>Total Records: <strong className="text-emerald-400">{datasetDetails?.totalRows ?? activeDatasetMeta?.rowCount ?? 0}</strong></span>
                  <span>•</span>
                  <span>Columns: <strong className="text-purple-300">{activeDatasetMeta?.columnCount ?? 0}</strong></span>
                </div>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                Data Grid
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                  viewMode === 'cards'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Smart Cards
              </button>
              <button
                onClick={() => setViewMode('charts')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                  viewMode === 'charts'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Analytics & Charts
              </button>
              <button
                onClick={() => setViewMode('schema')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                  viewMode === 'schema'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Schema & Types
              </button>
              <button
                onClick={() => setViewMode('chat')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                  viewMode === 'chat'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                AI Query Studio
              </button>
            </div>
          </div>

          {/* Feedback message banner */}
          {saveStatus && (
            <div
              className={`px-4 py-2 text-xs flex items-center gap-2 border-b ${
                saveStatus.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-800 text-rose-300'
              }`}
            >
              {saveStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{saveStatus.message}</span>
            </div>
          )}

          {/* Dynamic Content Views */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* 1. DATA GRID VIEW */}
            {viewMode === 'table' && (
              <div className="space-y-3">
                {/* Search & Actions toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search within this dataset..."
                      value={tableSearch}
                      onChange={e => {
                        setTableSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setIsAddingRow(true)}
                      className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg border border-emerald-500 flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Record
                    </button>
                    <select
                      value={pageSize}
                      onChange={e => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-slate-950 border border-slate-700/80 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                    >
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                      <option value={200}>200 per page</option>
                    </select>
                  </div>
                </div>

                {/* Add Row Inline Form */}
                {isAddingRow && (
                  <div className="bg-emerald-950/40 border border-emerald-700/60 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add New Record to {activeDatasetMeta?.name}
                      </h4>
                      <button
                        onClick={() => setIsAddingRow(false)}
                        className="text-slate-400 hover:text-slate-200 text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {datasetDetails?.columns.map((col: string) => (
                        <div key={col} className="space-y-1">
                          <label className="text-[10px] uppercase font-semibold text-slate-300 truncate block">
                            {col}
                          </label>
                          <input
                            type="text"
                            placeholder={`Enter ${col}...`}
                            value={newRowData[col] || ''}
                            onChange={e => setNewRowData({ ...newRowData, [col]: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setIsAddingRow(false)}
                        className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddNewRow}
                        disabled={isSaving}
                        className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {isSaving ? 'Saving...' : 'Save to CSV'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Table Container */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                  <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold sticky top-0 border-b border-slate-800 z-10">
                        <tr>
                          <th className="px-3 py-2.5 w-12 text-center">#</th>
                          {datasetDetails?.columns.map((col: string) => (
                            <th
                              key={col}
                              onClick={() => handleSort(col)}
                              className="px-3 py-2.5 cursor-pointer hover:bg-slate-800/80 transition-colors select-none"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="truncate">{col}</span>
                                {sortColumn === col && (
                                  <span className="text-indigo-400 font-bold">
                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                  </span>
                                )}
                              </div>
                            </th>
                          ))}
                          <th className="px-3 py-2.5 w-24 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                        {rowsLoading ? (
                          <tr>
                            <td colSpan={(datasetDetails?.columns?.length || 1) + 2} className="py-12 text-center text-slate-500">
                              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                              Loading dataset records...
                            </td>
                          </tr>
                        ) : datasetDetails?.rows?.length === 0 ? (
                          <tr>
                            <td colSpan={(datasetDetails?.columns?.length || 1) + 2} className="py-12 text-center text-slate-500">
                              No records found matching criteria.
                            </td>
                          </tr>
                        ) : (
                          datasetDetails?.rows.map((row: any, idx: number) => {
                            const isEditing = editingRowIndex === idx;
                            return (
                              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                <td className="px-3 py-2 text-center text-slate-500 font-sans text-xs">
                                  {(currentPage - 1) * pageSize + idx + 1}
                                </td>
                                {datasetDetails.columns.map((col: string) => (
                                  <td key={col} className="px-3 py-2 max-w-xs truncate">
                                    {isEditing ? (
                                      <input
                                        type="text"
                                        value={editedRowData[col] !== undefined ? editedRowData[col] : (row[col] ?? '')}
                                        onChange={e => setEditedRowData({ ...editedRowData, [col]: e.target.value })}
                                        className="w-full px-2 py-1 bg-slate-950 border border-indigo-500 rounded text-slate-200 text-xs focus:outline-none"
                                      />
                                    ) : (
                                      <span
                                        onClick={() => setSelectedRowDetail(row)}
                                        className="cursor-pointer hover:text-indigo-300 transition-colors"
                                      >
                                        {String(row[col] ?? '')}
                                      </span>
                                    )}
                                  </td>
                                ))}
                                <td className="px-3 py-2 text-center font-sans">
                                  {isEditing ? (
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        onClick={() => handleSaveRow(idx)}
                                        className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                                        title="Save row"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingRowIndex(null);
                                          setEditedRowData({});
                                        }}
                                        className="p-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
                                        title="Cancel"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center gap-1.5 text-slate-400">
                                      <button
                                        onClick={() => {
                                          setEditingRowIndex(idx);
                                          setEditedRowData({ ...row });
                                        }}
                                        className="hover:text-indigo-400 transition-colors p-1"
                                        title="Edit row"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteRow(idx)}
                                        className="hover:text-rose-400 transition-colors p-1"
                                        title="Delete row"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  {datasetDetails && datasetDetails.totalPages > 1 && (
                    <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div>
                        Showing <strong>{((currentPage - 1) * pageSize) + 1}</strong> to{' '}
                        <strong>{Math.min(currentPage * pageSize, datasetDetails.filteredRows)}</strong> of{' '}
                        <strong>{datasetDetails.filteredRows}</strong> records
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 font-medium text-slate-200">
                          Page {currentPage} of {datasetDetails.totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(datasetDetails.totalPages, p + 1))}
                          disabled={currentPage >= datasetDetails.totalPages}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. SMART CARDS VIEW */}
            {viewMode === 'cards' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {datasetDetails?.rows?.map((row: any, idx: number) => {
                    const keys = datasetDetails.columns || [];
                    const titleKey = keys.find((k: string) => /name|title|company|position|course|subject/i.test(k)) || keys[0];
                    const subtitleKey = keys.find((k: string) => /email|company|organization|date|direction|status/i.test(k) && k !== titleKey) || keys[1];

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedRowDetail(row)}
                        className="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 space-y-2.5 cursor-pointer transition-all hover:shadow-lg group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
                              {String(row[titleKey] || '#')[0]?.toUpperCase()}
                            </div>
                            <div className="truncate">
                              <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                                {String(row[titleKey] || `Record #${idx + 1}`)}
                              </h4>
                              {subtitleKey && (
                                <p className="text-[11px] text-slate-400 truncate">
                                  {String(row[subtitleKey] || '')}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Card metadata pills */}
                        <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                          {keys.slice(0, 5).map((k: string) => {
                            if (k === titleKey || k === subtitleKey) return null;
                            const val = row[k];
                            if (val === undefined || val === '') return null;
                            return (
                              <div key={k} className="flex justify-between items-center text-slate-400 gap-2">
                                <span className="text-[10px] uppercase text-slate-500 truncate">{k}:</span>
                                <span className="text-slate-300 font-mono truncate max-w-[160px]">{String(val)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. CHARTS & ANALYTICS VIEW */}
            {viewMode === 'charts' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Categorical Distribution Chart */}
                  {datasetDetails?.columns && datasetDetails.columns.length > 0 && (
                    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                        Top Category Frequency ({datasetDetails.columns[0]})
                      </h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={
                              datasetDetails?.analytics?.[datasetDetails.columns[0]]?.topValues || [
                                { value: 'Item A', count: 12 },
                                { value: 'Item B', count: 8 },
                                { value: 'Item C', count: 5 },
                              ]
                            }
                            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                              dataKey="value"
                              stroke="#94a3b8"
                              fontSize={10}
                              interval={0}
                              angle={-20}
                              textAnchor="end"
                            />
                            <YAxis stroke="#94a3b8" fontSize={10} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                            />
                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Secondary Distribution / Proportion Chart */}
                  {datasetDetails?.columns && datasetDetails.columns.length > 1 && (
                    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-emerald-400" />
                        Distribution Breakdown ({datasetDetails.columns[1]})
                      </h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={
                                datasetDetails?.analytics?.[datasetDetails.columns[1]]?.topValues?.slice(0, 6) || [
                                  { value: 'Type 1', count: 10 },
                                  { value: 'Type 2', count: 6 },
                                ]
                              }
                              dataKey="count"
                              nameKey="value"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              labelLine={false}
                            >
                              {(datasetDetails?.analytics?.[datasetDetails.columns[1]]?.topValues || []).map(
                                (_: any, idx: number) => (
                                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                )
                              )}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column Stat Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {datasetDetails?.columns?.map((col: string) => {
                    const stats = datasetDetails.analytics?.[col];
                    return (
                      <div key={col} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{col}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 font-mono uppercase">
                            {stats?.type || 'string'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 space-y-1">
                          <div className="flex justify-between">
                            <span>Populated Count:</span>
                            <strong className="text-slate-200">{stats?.count ?? 0}</strong>
                          </div>
                          {stats?.type === 'number' && (
                            <>
                              <div className="flex justify-between">
                                <span>Average:</span>
                                <strong className="text-emerald-400">{stats.avg?.toFixed(2)}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Range:</span>
                                <strong className="text-purple-300">
                                  {stats.min} - {stats.max}
                                </strong>
                              </div>
                            </>
                          )}
                          {stats?.topValues && stats.topValues.length > 0 && (
                            <div className="flex justify-between">
                              <span>Top Value:</span>
                              <strong className="text-indigo-300 truncate max-w-[100px]" title={stats.topValues[0].value}>
                                {stats.topValues[0].value} ({stats.topValues[0].count})
                              </strong>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. SCHEMA & TYPE INSPECTOR */}
            {viewMode === 'schema' && (
              <div className="space-y-4">
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-400" />
                      Dataset Schema & Type Inference
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Detailed column specifications, null rates, and unique frequencies inferred from the raw CSV data.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                        <tr>
                          <th className="px-3 py-2.5">Column Name</th>
                          <th className="px-3 py-2.5">Inferred Type</th>
                          <th className="px-3 py-2.5">Unique Values</th>
                          <th className="px-3 py-2.5">Null / Empty Count</th>
                          <th className="px-3 py-2.5">Sample Values</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                        {activeDatasetMeta?.columns.map(col => (
                          <tr key={col.name} className="hover:bg-slate-800/40">
                            <td className="px-3 py-2.5 font-bold text-white font-sans">{col.name}</td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  col.type === 'number'
                                    ? 'bg-blue-900/60 text-blue-300'
                                    : col.type === 'date'
                                    ? 'bg-emerald-900/60 text-emerald-300'
                                    : col.type === 'email'
                                    ? 'bg-purple-900/60 text-purple-300'
                                    : col.type === 'url'
                                    ? 'bg-cyan-900/60 text-cyan-300'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {col.type}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-slate-300">{col.uniqueCount}</td>
                            <td className="px-3 py-2.5 text-rose-400">{col.nullCount}</td>
                            <td className="px-3 py-2.5 text-slate-400 truncate max-w-xs">
                              {col.sampleValues.join(', ') || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. AI QUERY STUDIO */}
            {viewMode === 'chat' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-700/40 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600/30 border border-indigo-400/40 rounded-lg text-indigo-300">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Universal CSV Natural Language Query Studio</h3>
                      <p className="text-xs text-slate-400">
                        Query across all 31+ CSV datasets simultaneously using natural keywords, questions, or entity names.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleNlQuery} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g., 'Google', 'Python', 'Senior Engineer', 'Crypto', 'Sent invitation'..."
                        value={nlQuery}
                        onChange={e => setNlQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isQuerying}
                      className="px-5 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isQuerying ? 'Searching...' : 'Search All CSVs'}
                    </button>
                  </form>
                </div>

                {/* Query Results */}
                {nlResults && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>
                        Found matches in <strong>{nlResults.totalDatasetsWithMatches}</strong> datasets for "{nlResults.query}":
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {nlResults.matches.map((m: any, idx: number) => (
                        <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                              {m.filename}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                              {m.matchCount} Matches
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 max-h-48 overflow-y-auto">
                            {m.sampleMatches.map((matchRow: any, rIdx: number) => (
                              <div key={rIdx} className="pb-1 border-b border-slate-900 last:border-none">
                                {Object.entries(matchRow)
                                  .filter(([k]) => k !== '_id')
                                  .slice(0, 3)
                                  .map(([k, v]) => (
                                    <span key={k} className="mr-2">
                                      <span className="text-slate-500">{k}:</span> {String(v)}
                                    </span>
                                  ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row Detail Drawer / Modal */}
      {selectedRowDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                Record Inspector & Attributes
              </h3>
              <button
                onClick={() => setSelectedRowDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(selectedRowDetail)
                  .filter(([k]) => k !== '_id')
                  .map(([k, v]) => (
                    <div key={k} className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">{k}</div>
                      <div className="text-xs font-mono text-slate-200 break-words">{String(v || '—')}</div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedRowDetail(null)}
                className="px-4 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
