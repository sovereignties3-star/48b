import React, { useState, useEffect } from 'react';
import { Cloud, Server, Database, Key, ShieldCheck, Terminal } from 'lucide-react';

export const GoogleAttributesHub: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/google/attributes')
      .then(res => res.json())
      .then(data => setData(data.metadata))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white p-6">Loading Google Infrastructure...</div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Cloud className="text-blue-400" /> Google Cloud/Workspace Infrastructure Metadata
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-3">Project Info</h3>
          <pre className="text-xs font-mono text-gray-300">{JSON.stringify(data.projectInfo, null, 2)}</pre>
        </div>
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-3">Enabled Services</h3>
          <ul className="text-xs text-gray-300 space-y-1">
            {data.services.map((s: string) => <li key={s} className="font-mono">{s}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoogleAttributesHub;
