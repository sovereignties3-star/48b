import React, { useState, useEffect } from 'react';
import { FileText, Database, Table, RefreshCw, Layers } from 'lucide-react';

const AZURE_FILES = [
  { name: 'AzureResourceGraphFormattedResults-Query 1 (2).csv.txt', label: 'Azure Resource Graph Query 1 (Formatted)' },
  { name: 'AzureResourceGraphFormattedResults-Query 1 6.csv.txt', label: 'Azure Resource Graph Query 16 (Formatted)' },
  { name: 'AzureResourceGraphFormattedResults-Query 2.csv.txt', label: 'Azure Resource Graph Query 2' },
  { name: 'AzureResourceGraphResults-Query 16.csv.txt', label: 'Azure Resource Graph Results Q16' },
  { name: 'AzureResourceGraphResults-Query 8.csv.txt', label: 'Azure Resource Graph Results Q8 (Massive)' },
  { name: 'Azurevaults 7.csv.txt', label: 'Azure Vaults Q7' }
];

export const AzureCsvInspector: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>(AZURE_FILES[0].name);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rawText, setRawText] = useState<string>('');

  useEffect(() => {
    loadCsvFile(activeFile);
  }, [activeFile]);

  const loadCsvFile = (filename: string) => {
    setLoading(true);
    fetch(`/${encodeURIComponent(filename)}`)
      .then(res => res.text())
      .then(text => {
        setRawText(text);
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        if (lines.length > 0) {
          const parsedHeaders = lines[0].split(',').map(h => h.replace(/(^"|"$)/g, '').trim());
          setHeaders(parsedHeaders);
          const parsedRows = lines.slice(1, 100).map(line => line.split(',').map(val => val.replace(/(^"|"$)/g, '').trim()));
          setCsvData(parsedRows);
        }
      })
      .catch(err => {
        console.error('Failed to load CSV:', err);
        setRawText('Error loading file.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-500/30 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Database className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>Azure Resource Graph & Key Vaults Inspector</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Azure CSV & Resource Graph Data Vault</h1>
          <p className="text-xs text-gray-300 mt-1">
            Inspecting and rendering all Azure resource graph exports and vault logs found in the workspace.
          </p>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#161B22] p-4 rounded-xl border border-[#30363D]">
        {AZURE_FILES.map(file => (
          <button
            key={file.name}
            onClick={() => setActiveFile(file.name)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeFile === file.name
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-[#0D1117] text-gray-300 hover:text-white border border-[#30363D]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-300" />
            <span>{file.label}</span>
          </button>
        ))}
      </div>

      {/* Table Data View */}
      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-sky-400" />
            <span>Parsed Table Preview ({activeFile})</span>
          </h3>
          <span className="text-xs font-mono text-gray-400">Showing first 100 rows</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 font-mono text-xs">Loading Azure CSV data...</div>
        ) : headers.length === 0 ? (
          <div className="bg-[#0D1117] p-4 rounded-xl font-mono text-xs text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
            {rawText}
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[500px] rounded-xl border border-[#21262d]">
            <table className="w-full text-left text-xs font-mono text-gray-300">
              <thead className="bg-[#0D1117] text-sky-400 uppercase tracking-wider sticky top-0 border-b border-[#21262d]">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="p-3 font-semibold">{h || `Col ${i+1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d] bg-[#161B22]">
                {csvData.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-sky-950/20">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 truncate max-w-xs">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AzureCsvInspector;
