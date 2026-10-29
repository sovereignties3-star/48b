import React from 'react';
import { Mail, Calendar, FileText, FileSpreadsheet, Presentation, FolderOpen, Video, Shield, CheckSquare, Bookmark } from 'lucide-react';

export const GoogleWorkspaceHub: React.FC = () => {
  const apps = [
    { title: 'Google Mail', icon: Mail, desc: 'Enterprise communications & financial notices' },
    { title: 'Google Drive', icon: FolderOpen, desc: 'Cryptographic document repository & backups' },
    { title: 'Google Sheets', icon: FileSpreadsheet, desc: 'Real-time ledger and transaction sheets' },
    { title: 'Google Docs', icon: FileText, desc: 'Contracts, compliance, and legal monographs' },
    { title: 'Google Slides', icon: Presentation, desc: 'Executive consortium briefing slides' },
    { title: 'Google Calendar', icon: Calendar, desc: 'Scheduled treasury settlements & callbacks' },
    { title: 'Google Tasks', icon: CheckSquare, desc: 'Multi-jurisdictional compliance checklists' },
    { title: 'Google Meet', icon: Video, desc: 'Encrypted sovereign audio/video conference' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-100">
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Google Workspace Institutional Hub</h1>
            <p className="text-xs text-gray-400 font-mono">OAuth 2.0 & SAML 2.0 Identity Unified Suite</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <div key={app.title} className="bg-[#161B22] p-5 rounded-2xl border border-[#30363D] hover:border-blue-500 transition space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">{app.title}</h3>
              <p className="text-xs text-gray-400">{app.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoogleWorkspaceHub;
