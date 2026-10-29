import React, { useState, useEffect } from 'react';
import { Terminal, Shield, RefreshCw, Cpu, Database, Globe } from 'lucide-react';

export const GcpBlockchainViewer: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/blockchain-204577f9.html.txt')
      .then(res => res.text())
      .then(text => {
        setHtmlContent(text);
      })
      .catch(err => {
        console.error('Failed to load blockchain HTML:', err);
        setHtmlContent('<html><body><h3>Error loading GCP Blockchain Console HTML</h3></body></html>');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 pb-12">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>Google Cloud Console • Blockchain Node Engine</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">blockchain-204577f9.html.txt (Original Unedited Render)</h1>
          <p className="text-xs text-gray-300 mt-1">
            Rendering the exact GCP Blockchain Node Engine console HTML source file provided in the workspace without any modifications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
            100% UNMODIFIED SOURCE
          </span>
        </div>
      </div>

      <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-4 shadow-xl overflow-hidden h-[750px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 font-mono text-sm">
            Loading GCP Blockchain Console...
          </div>
        ) : (
          <iframe
            srcDoc={htmlContent}
            title="GCP Blockchain Engine Console"
            className="w-full h-full rounded-xl bg-white border border-gray-700"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>
    </div>
  );
};

export default GcpBlockchainViewer;
