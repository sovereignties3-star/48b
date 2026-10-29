import React from 'react';
import { GraduationCap, BookOpen, Users, Award, Shield } from 'lucide-react';

export const GoogleClassroomWorkspace: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-100">
      <div className="bg-gradient-to-r from-emerald-950/40 via-teal-900/30 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Google Classroom & Executive Education</h1>
            <p className="text-xs text-gray-400 font-mono">Consortium Training & Financial Certification Track</p>
          </div>
        </div>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Active Courses & Modules</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363D]">
            <h4 className="text-xs font-bold text-white">ISO 20022 Financial Standards Masterclass</h4>
            <p className="text-[11px] text-gray-400 mt-1">150 message types, pacs.008 credit transfers, and pain.001 initiation.</p>
          </div>
          <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363D]">
            <h4 className="text-xs font-bold text-white">SAML 2.0 & Zero-Knowledge Architecture</h4>
            <p className="text-[11px] text-gray-400 mt-1">Google Identity Provider metadata, cryptographic verification, and SSO.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleClassroomWorkspace;
