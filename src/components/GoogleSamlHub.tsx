import React, { useState, useEffect } from 'react';
import { Shield, Key, CheckCircle2, Copy, ExternalLink, RefreshCw, Terminal, Globe, Lock, Play, Layers, UserCheck, FileCode, AlertCircle, ArrowUpRight } from 'lucide-react';

interface SamlSession {
  sessionId: string;
  nameId: string;
  email: string;
  displayName: string;
  issuer: string;
  authnInstant: string;
  sessionIndex: string;
  attributes: Record<string, any>;
  createdAt: string;
}

export const GoogleSamlHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'authn' | 'sp-meta' | 'xml' | 'test'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [authnData, setAuthnData] = useState<any>(null);
  const [sessions, setSessions] = useState<SamlSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [simEmail, setSimEmail] = useState('sovereignties3@gmail.com');
  const [simName, setSimName] = useState('Sovereign Ties');
  const [simResult, setSimResult] = useState<any>(null);

  const entityID = "https://accounts.google.com/o/saml2?idpid=C00puqgbe";
  const idpid = "C00puqgbe";
  const validUntil = "2027-04-26T00:46:51.000Z";
  const ssoLocation = "https://accounts.google.com/o/saml2/idp?idpid=C00puqgbe";
  const nameIdFormat = "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress";

  const certPrimary = `MIIDdDCCAlygAwIBAgIGAYBofDL1MA0GCSqGSIb3DQEBCwUAMHsxFDASBgNVBAoTC0dvb2dsZSBJ
bmMuMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MQ8wDQYDVQQDEwZHb29nbGUxGDAWBgNVBAsTD0dv
b2dsZSBGb3IgV29yazELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWEwHhcNMjIwNDI3
MDA0NjUxWhcNMjcwNDI2MDA0NjUxWjB7MRQwEgYDVQQKEwtHb29nbGUgSW5jLjEWMBQGA1UEBxMN
TW91bnRhaW4gVmlldzEPMA0GA1UEAxMGR29vZ2xlMRgwFgYDVQQLEw9Hb29nbGUgRm9yIFdvcmsx
CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAvzwRY6FJv5jxSI9BAmaw2jYmPtbmT7Lvg2k2C5iSa9a8FdEqDaC3FUBqG9oDmPb8
1I1w7yqLi85bX31hkE+Mf0ovRWiCKK6hINolpvkL1xecQqvJ5defKJ043DstcNcxv6SxpSTJPbTh
V16NSCbC0oAlAhMNaCFGvUoj+lMFfimaRa6sri7kibcAuslithLCXc4J4E9rfJrKI2svEBoohCRh
4XDnTx9MAfvtMio89H6QtP9d2/Ufl+5slfB1uMzmOWDVq5s8A1dNIQ/lGaKDYdpYptoWH+MVn0zy
8p8FEYg0tGvOJ8t7ltUQD4xRCEOjItGIGeF+EXMoZjtB3N5qtQIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQCN7fwpRfalhEuKOmgsokaNjN0eYpFYj7fUvvDRjH7KKlUPjMC9NQXh6O169gl79nkgY2Z3
KFJmiEm8mo8B+TcOq0SwZshLIydszY4lDQvxb84jrQSgTIF6LFUNEXoa3vEt18ta3nKobYGjfCa0
dihbIP6Xkwah1c+WfuT4w3wi/kPjiY34pPmRItsDaYAtshOwM9/v8nRqwZSy2fEfpeDZSyiMVg9K
8VeLLIP2Cwhqp2KIU/LBtGjtMz0Z2LVDjbx6/C566uobNDWtOGFQp1H2FjQBeULO4z0yL7bltURl
gCRSudVNdtF3wgBRvvnOuZSGY2r0YhTSCDNnXELvqYW7`;

  const certSecondary = `MIIDdDCCAlygAwIBAgIGAYb1YCo9MA0GCSqGSIb3DQEBCwUAMHsxFDASBgNVBAoTC0dvb2dsZSBJ
bmMuMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MQ8wDQYDVQQDEwZHb29nbGUxGDAWBgNVBAsTD0dv
b2dsZSBGb3IgV29yazELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWEwHhcNMjMwMzE4
MTUzOTI1WhcNMjgwMzE2MTUzOTI1WjB7MRQwEgYDVQQKEwtHb29nbGUgSW5jLjEWMBQGA1UEBxMN
TW91bnRhaW4gVmlldzEPMA0GA1UEAxMGR29vZ2xlMRgwFgYDVQQLEw9Hb29nbGUgRm9yIFdvcmsx
CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAosmN+nfOWnihaedStMmgYom7ks2IwQLRQ60DohyjSlJUcZoaEx2cSnrDmCnQqdGl
jK6fjzCLyuJGJM7ZD+L8nwM5hKY6iSa1vzXlJI8hvoXypkiZ760IukbDtZ9u6ASBdZbJrmIfisGJ
Lgj1rtYuKkCR5EtkDiB7XtkMYY9Cg9O8cM8VNx7yEJTK9oPh4QvGgvZ4m1LO6jHV0+4YDLUztAt2
1A09NhR4udgJu/sD9cN39AMVYdZJSst5/YmXt3IT5O6qzoMHQHhZy9ZdXSDjyzZuQEyizrNcH7l
3Nc4/P/gRE+rLgJspQCiN30EU5wzVWvdyJtAcldan6ztL0/zpwIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQBSbTRmUybmFpyNi5ZOK9qeB87zWmcDugoVr4387qVmeMjvtZfnkNw15JpqgmjJ65atH7Nd
SWD0/vlgwROj37O7JcLyOx4vqqUMkAbO2lTxxxcUvGr+x+yTNTaWqWCrJ/7gMbVYISsAxNN+fdzn
XCtwvFiLNPzS66CkBiWQrK2kpgkKBoNP+Hs/wH/LzKg0fv3ZM4JdBffGiRYWeuy8hlJ5XcO0uUHK
iWJ+fIyW5hLCgv7wjG8fTL0kuBkPmksc6VPmyxtCVOkqIGKDO0OB4It4wiGqjdSSSVs6Bjetrb3A
2GoNWYcOdyrnytYKnwBkqCo6Q//4ndKjdTPgQ87qwFNA`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fetchAuthnRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/saml/google/authn-request');
      const data = await res.json();
      setAuthnData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/saml/google/sessions');
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/saml/google/simulate-assertion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: simEmail, displayName: simName, role: 'Enterprise Architect' })
      });
      const data = await res.json();
      setSimResult(data);
      fetchSessions();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthnRequest();
    fetchSessions();
  }, []);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const spEntityId = `${origin}/api/saml/google/sp-metadata`;
  const acsUrl = `${origin}/api/saml/google/acs`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-gray-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black text-white tracking-tight">Google Workspace SAML 2.0 IdP Hub</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    IDPID: C00puqgbe
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  EntityID: https://accounts.google.com/o/saml2?idpid=C00puqgbe
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/public/google-idp-metadata.xml"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 px-3 py-2 bg-[#21262d] hover:bg-[#30363d] text-gray-300 rounded-xl text-xs font-semibold border border-[#30363d] transition cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>Raw IdP XML</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={authnData?.redirectUrl || ssoLocation}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Launch Google SSO</span>
            </a>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-[#30363D]/60 overflow-x-auto">
          {[
            { id: 'overview', label: 'IdP & Certificates', icon: Key },
            { id: 'authn', label: 'AuthnRequest & SSO', icon: Play },
            { id: 'sp-meta', label: 'SP Metadata & ACS', icon: Globe },
            { id: 'test', label: 'Live Assertion Simulator', icon: UserCheck },
            { id: 'xml', label: 'EntityDescriptor XML', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-md border border-blue-400/60'
                    : 'text-gray-400 hover:text-white bg-[#0d1117]/80 hover:bg-[#161B22] border border-[#30363D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SubTab 1: Overview & Certificates */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* IdP Parameters */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Google IdP Configuration</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D] space-y-1">
                <span className="text-gray-500 block text-[10px] uppercase">Entity ID:</span>
                <span className="text-blue-300 break-all select-all">{entityID}</span>
              </div>

              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D] space-y-1">
                <span className="text-gray-500 block text-[10px] uppercase">Google IdP ID:</span>
                <span className="text-emerald-400 font-bold">{idpid}</span>
              </div>

              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D] space-y-1">
                <span className="text-gray-500 block text-[10px] uppercase">Valid Until:</span>
                <span className="text-amber-300">{validUntil}</span>
              </div>

              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D] space-y-1">
                <span className="text-gray-500 block text-[10px] uppercase">SingleSignOn URL:</span>
                <span className="text-purple-300 break-all">{ssoLocation}</span>
              </div>

              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D] space-y-1">
                <span className="text-gray-500 block text-[10px] uppercase">NameID Format:</span>
                <span className="text-gray-300 break-all">{nameIdFormat}</span>
              </div>
            </div>
          </div>

          {/* Certificate 1 */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>Primary X.509 Signing Cert (2022-2027)</span>
              </h3>
              <button
                onClick={() => copyToClipboard(certPrimary, 'cert1')}
                className="text-xs text-gray-400 hover:text-white p-1 rounded hover:bg-[#30363D] transition cursor-pointer"
                title="Copy Certificate Base64"
              >
                {copiedKey === 'cert1' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-xs space-y-2 text-gray-300">
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D] space-y-1 font-mono text-[11px]">
                <p><span className="text-gray-500">Subject:</span> CN=Google, OU=Google For Work, O=Google Inc.</p>
                <p><span className="text-gray-500">Valid:</span> 2022-04-27 to 2027-04-26</p>
                <p><span className="text-gray-500">Algorithm:</span> RSA 2048 with SHA-256</p>
                <p><span className="text-gray-500">Serial:</span> 601332882236371804</p>
              </div>

              <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#30363D] font-mono text-[10px] text-gray-400 max-h-36 overflow-y-auto break-all">
                {certPrimary}
              </div>
            </div>
          </div>

          {/* Certificate 2 */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Secondary X.509 Signing Cert (2023-2028)</span>
              </h3>
              <button
                onClick={() => copyToClipboard(certSecondary, 'cert2')}
                className="text-xs text-gray-400 hover:text-white p-1 rounded hover:bg-[#30363D] transition cursor-pointer"
                title="Copy Certificate Base64"
              >
                {copiedKey === 'cert2' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-xs space-y-2 text-gray-300">
              <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D] space-y-1 font-mono text-[11px]">
                <p><span className="text-gray-500">Subject:</span> CN=Google, OU=Google For Work, O=Google Inc.</p>
                <p><span className="text-gray-500">Valid:</span> 2023-03-18 to 2028-03-16</p>
                <p><span className="text-gray-500">Algorithm:</span> RSA 2048 with SHA-256</p>
                <p><span className="text-gray-500">Status:</span> Active Backup Signer</p>
              </div>

              <div className="bg-[#0d1117] p-2.5 rounded-xl border border-[#30363D] font-mono text-[10px] text-gray-400 max-h-36 overflow-y-auto break-all">
                {certSecondary}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: AuthnRequest & SSO */}
      {activeSubTab === 'authn' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <span>SAML 2.0 AuthnRequest Protocol Pipeline</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Generates RFC-compliant AuthnRequest to initiate SAML authentication against Google IdP <code className="text-blue-300">C00puqgbe</code>.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={fetchAuthnRequest}
                disabled={loading}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-bold rounded-xl border border-[#30363d] transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerate AuthnRequest</span>
              </button>
              {authnData?.redirectUrl && (
                <a
                  href={authnData.redirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Execute HTTP-Redirect SSO</span>
                </a>
              )}
            </div>
          </div>

          {authnData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D]">
                  <span className="text-gray-500 block text-[10px]">Request ID:</span>
                  <span className="text-white truncate block">{authnData.requestId}</span>
                </div>
                <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D]">
                  <span className="text-gray-500 block text-[10px]">Destination:</span>
                  <span className="text-purple-300 truncate block">{authnData.destination}</span>
                </div>
                <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D]">
                  <span className="text-gray-500 block text-[10px]">ACS Target:</span>
                  <span className="text-emerald-300 truncate block">{authnData.acsUrl}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Generated AuthnRequest XML:</span>
                  <button
                    onClick={() => copyToClipboard(authnData.authnXml, 'authnXml')}
                    className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    {copiedKey === 'authnXml' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy XML</span>
                  </button>
                </div>
                <pre className="bg-[#0d1117] p-4 rounded-xl border border-[#30363D] text-[11px] font-mono text-gray-200 overflow-x-auto">
                  {authnData.authnXml}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Deflated Base64 SAMLRequest Parameter:</span>
                  <button
                    onClick={() => copyToClipboard(authnData.samlRequestBase64, 'b64')}
                    className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    {copiedKey === 'b64' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Base64</span>
                  </button>
                </div>
                <div className="bg-[#0d1117] p-3 rounded-xl border border-[#30363D] text-[10px] font-mono text-amber-300 break-all max-h-24 overflow-y-auto">
                  {authnData.samlRequestBase64}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SubTab 3: Service Provider Metadata & ACS */}
      {activeSubTab === 'sp-meta' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <span>Service Provider (SP) Endpoints for Google Admin Console</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Use these values when creating a custom SAML App under <strong className="text-gray-300">Google Workspace Admin &gt; Apps &gt; SAML apps</strong>.
              </p>
            </div>

            <a
              href="/api/saml/google/sp-metadata"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              <span>Download SP Metadata XML</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363D] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-bold">ACS URL (Assertion Consumer Service):</span>
                <button
                  onClick={() => copyToClipboard(acsUrl, 'acsUrl')}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  {copiedKey === 'acsUrl' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-emerald-400 break-all select-all">{acsUrl}</p>
              <p className="text-[10px] text-gray-500">Google Admin: &quot;ACS URL&quot; field</p>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363D] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-bold">Entity ID / Audience URI:</span>
                <button
                  onClick={() => copyToClipboard(spEntityId, 'spEntityId')}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  {copiedKey === 'spEntityId' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-blue-400 break-all select-all">{spEntityId}</p>
              <p className="text-[10px] text-gray-500">Google Admin: &quot;Entity ID&quot; field</p>
            </div>
          </div>

          <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363D] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Required Attribute Mapping</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#161B22] rounded-lg border border-[#30363D]">
                <span className="text-gray-500 block text-[10px]">Google Directory Field:</span>
                <span className="text-white font-bold">Primary email</span>
                <span className="text-blue-300 block text-[11px] mt-1 font-mono">&rarr; App Attribute: Email</span>
              </div>
              <div className="p-3 bg-[#161B22] rounded-lg border border-[#30363D]">
                <span className="text-gray-500 block text-[10px]">Google Directory Field:</span>
                <span className="text-white font-bold">First name</span>
                <span className="text-blue-300 block text-[11px] mt-1 font-mono">&rarr; App Attribute: FirstName</span>
              </div>
              <div className="p-3 bg-[#161B22] rounded-lg border border-[#30363D]">
                <span className="text-gray-500 block text-[10px]">Google Directory Field:</span>
                <span className="text-white font-bold">Last name</span>
                <span className="text-blue-300 block text-[11px] mt-1 font-mono">&rarr; App Attribute: LastName</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 4: Live Assertion Simulator & Session History */}
      {activeSubTab === 'test' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>Simulate Google SAML 2.0 Response / Assertion</span>
            </h3>
            <p className="text-xs text-gray-400">
              Generate an RFC 2.0 test assertion containing the user identity, verify digital signature alignment with Google certs, and establish an active authenticated session.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold">User Email (NameID):</label>
                <input
                  type="text"
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold">Display Name:</label>
                <input
                  type="text"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSimulate}
                  disabled={loading}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md"
                >
                  {loading ? 'Processing...' : 'Generate & Validate Assertion'}
                </button>
              </div>
            </div>

            {simResult && (
              <div className="p-4 bg-[#0d1117] border border-emerald-500/40 rounded-xl space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Assertion Processed Successfully</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Session ID: {simResult.session?.sessionId}</span>
                </div>
                <div className="text-xs font-mono text-gray-300 space-y-1">
                  <p><span className="text-gray-500">NameID:</span> {simResult.session?.nameId}</p>
                  <p><span className="text-gray-500">Issuer:</span> {simResult.session?.issuer}</p>
                  <p><span className="text-gray-500">Timestamp:</span> {simResult.session?.authnInstant}</p>
                </div>
              </div>
            )}
          </div>

          {/* Active Sessions List */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>Active SAML Authenticated Sessions ({sessions.length})</span>
              </h3>
              <button
                onClick={fetchSessions}
                className="text-xs text-gray-400 hover:text-white p-1 rounded hover:bg-[#30363D] transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {sessions.map((sess) => (
                <div key={sess.sessionId} className="p-4 bg-[#0d1117] border border-[#30363D] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold">{sess.displayName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {sess.email}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Session ID: {sess.sessionId} • Created: {new Date(sess.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
                      GOOGLE IDP C00puqgbe
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 5: Raw EntityDescriptor XML */}
      {activeSubTab === 'xml' && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Google Workspace IdP EntityDescriptor XML</h3>
              <p className="text-xs text-gray-400">Exact XML schema parsed and loaded from metadata configuration.</p>
            </div>
            <button
              onClick={() => {
                const raw = document.getElementById('raw-saml-xml')?.innerText || '';
                copyToClipboard(raw, 'xmlRaw');
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-bold rounded-lg border border-[#30363d] cursor-pointer"
            >
              {copiedKey === 'xmlRaw' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Raw XML</span>
            </button>
          </div>

          <pre
            id="raw-saml-xml"
            className="bg-[#0d1117] p-4 rounded-xl border border-[#30363D] text-[11px] font-mono text-emerald-300/90 overflow-x-auto whitespace-pre max-h-[500px]"
          >
{`<?xml version="1.0" encoding="UTF-8"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://accounts.google.com/o/saml2?idpid=C00puqgbe" validUntil="2027-04-26T00:46:51.000Z">
  <md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>${certPrimary}</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>${certSecondary}</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://accounts.google.com/o/saml2/idp?idpid=C00puqgbe"/>
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://accounts.google.com/o/saml2/idp?idpid=C00puqgbe"/>
  </md:IDPSSODescriptor>
</md:EntityDescriptor>`}
          </pre>
        </div>
      )}
    </div>
  );
};
