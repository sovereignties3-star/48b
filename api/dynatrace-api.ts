import { Router, Request, Response } from 'express';

export const dynatraceRouter = Router();

const DYNATRACE_API_TOKEN = process.env.DYNATRACE_API_TOKEN || '';
const DYNATRACE_BASE_URL = process.env.DYNATRACE_BASE_URL || 'https://nob29948.live.dynatrace.com';
const DYNATRACE_TENANT_ID = process.env.DYNATRACE_TENANT_ID || 'nob29948';

export const DYNATRACE_CONFIG = {
  baseUrl: DYNATRACE_BASE_URL,
  tenantId: DYNATRACE_TENANT_ID,
  masterToken: DYNATRACE_API_TOKEN,
  currentToken: {
    id: 'dt0c01.CONFIGURED_ID',
    token: DYNATRACE_API_TOKEN,
    name: 'gcp',
    status: DYNATRACE_API_TOKEN ? 'ACTIVE' : 'NOT_CONFIGURED',
    createdAt: new Date().toISOString(),
    scopes: [
      'activeGates.read',
      'activeGates.write',
      'activeGateTokenManagement.create',
      'activeGateTokenManagement.read',
      'activeGateTokenManagement.write',
      'analyzers.read',
      'analyzers.write',
      'apiTokens.read',
      'apiTokens.write',
      'attacks.read',
      'attacks.write',
      'auditLogs.read',
      'entities.read',
      'entities.write',
      'events.ingest',
      'events.read',
      'extensionConfigurations.read',
      'extensionConfigurations.write',
      'extensionEnvironment.read',
      'extensionEnvironment.write',
      'extensions.read',
      'extensions.write',
      'geographicRegions.read',
      'hub.install',
      'hub.read',
      'hub.write',
      'javaScriptMappingFiles.read',
      'javaScriptMappingFiles.write',
      'logs.ingest',
      'logs.read',
      'metrics.ingest',
      'metrics.read',
      'metrics.write',
      'networkZones.read',
      'networkZones.write',
      'oneAgents.read',
      'oneAgents.write',
      'openTelemetryTrace.ingest',
      'problems.read',
      'problems.write',
      'releases.read',
      'securityProblems.read',
      'securityProblems.write',
      'settings.read',
      'settings.write',
      'slo.read',
      'slo.write',
      'syntheticExecutions.read',
      'syntheticExecutions.write',
      'syntheticLocations.read',
      'syntheticLocations.write',
      'tenantTokenRotation.write',
      'traces.lookup',
      'ActiveGateCertManagement',
      'CaptureRequestData',
      'credentialVault.read',
      'credentialVault.write',
      'DataExport',
      'DataPrivacy',
      'DssFileManagement',
      'DTAQLAccess',
      'ExternalSyntheticIntegration',
      'ReadConfig',
      'ReadSyntheticData',
      'RestRequestForwarding',
      'RumBrowserExtension',
      'RumJavaScriptTagManagement',
      'UserSessionAnonymization',
      'WriteConfig',
      'AdvancedSyntheticIntegration',
      'InstallerDownload',
      'SupportAlert'
    ]
  },
  curlCommand: `curl -X POST "${DYNATRACE_BASE_URL}/api/v2/apiTokens" -H "accept: application/json; charset=utf-8" -H "Content-Type: application/json; charset=utf-8" -d '{"name":"gcp","scopes":["activeGates.read","activeGates.write","activeGateTokenManagement.create","activeGateTokenManagement.read","activeGateTokenManagement.write","analyzers.read","analyzers.write","apiTokens.read","apiTokens.write","attacks.read","attacks.write","auditLogs.read","entities.read","entities.write","events.ingest","events.read","extensionConfigurations.read","extensionConfigurations.write","extensionEnvironment.read","extensionEnvironment.write","extensions.read","extensions.write","geographicRegions.read","hub.install","hub.read","hub.write","javaScriptMappingFiles.read","javaScriptMappingFiles.write","logs.ingest","logs.read","metrics.ingest","metrics.read","metrics.write","networkZones.read","networkZones.write","oneAgents.read","oneAgents.write","openTelemetryTrace.ingest","problems.read","problems.write","releases.read","securityProblems.read","securityProblems.write","settings.read","settings.write","slo.read","slo.write","syntheticExecutions.read","syntheticExecutions.write","syntheticLocations.read","syntheticLocations.write","tenantTokenRotation.write","traces.lookup","ActiveGateCertManagement","CaptureRequestData","credentialVault.read","credentialVault.write","DataExport","DataPrivacy","DssFileManagement","DTAQLAccess","ExternalSyntheticIntegration","ReadConfig","ReadSyntheticData","RestRequestForwarding","RumBrowserExtension","RumJavaScriptTagManagement","UserSessionAnonymization","WriteConfig","AdvancedSyntheticIntegration","InstallerDownload","SupportAlert"]}' -H "Authorization: Api-Token ${DYNATRACE_API_TOKEN || 'YOUR_DYNATRACE_API_TOKEN'}"`
};

// In-memory token management
const dynatraceTokens = [
  { ...DYNATRACE_CONFIG.currentToken },
  {
    id: 'dt0c01.MASTER_PROV_KEY',
    token: DYNATRACE_API_TOKEN,
    name: 'master-cluster-admin',
    status: DYNATRACE_API_TOKEN ? 'ACTIVE' : 'NOT_CONFIGURED',
    createdAt: '2026-10-10T12:00:00Z',
    scopes: ['* (All Cluster Administrative Scopes)']
  }
];

/**
 * GET /api/dynatrace/config
 */
dynatraceRouter.get('/config', (req: Request, res: Response) => {
  res.json({
    success: true,
    platform: 'Dynatrace Software Intelligence Platform',
    version: 'v2',
    tenant: DYNATRACE_CONFIG.tenantId,
    endpoint: `${DYNATRACE_CONFIG.baseUrl}/api/v2`,
    currentToken: DYNATRACE_CONFIG.currentToken,
    curlCommand: DYNATRACE_CONFIG.curlCommand
  });
});

/**
 * GET /api/dynatrace/tokens
 */
dynatraceRouter.get('/tokens', (req: Request, res: Response) => {
  res.json({
    success: true,
    totalCount: dynatraceTokens.length,
    tokens: dynatraceTokens
  });
});

/**
 * POST /api/dynatrace/tokens
 * Simulates POST https://nob29948.live.dynatrace.com/api/v2/apiTokens
 */
dynatraceRouter.post('/tokens', (req: Request, res: Response) => {
  const { name = 'gcp', scopes = DYNATRACE_CONFIG.currentToken.scopes } = req.body;
  const newToken = {
    id: `dt0c01.${Math.random().toString(36).substring(2, 10).toUpperCase()}${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    token: `dt0c01.${Math.random().toString(36).substring(2, 10).toUpperCase()}.${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
    name,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    scopes
  };
  dynatraceTokens.unshift(newToken);
  res.status(201).json(newToken);
});

/**
 * GET /api/dynatrace/health
 */
dynatraceRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    connection: 'ONLINE',
    tenant: DYNATRACE_CONFIG.tenantId,
    oneAgentsConnected: 48,
    activeGates: 4,
    syntheticMonitors: 16,
    activeProblems: 0,
    timestamp: new Date().toISOString()
  });
});
