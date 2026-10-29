import { Router, Request, Response } from 'express';
import { platformEngine } from './ai-data-platform-engine';
import { v4 as uuidv4 } from 'uuid';

export const aiDataPlatformRouter = Router();

// Middleware: extract platform and ensure state
aiDataPlatformRouter.use('/:aiDataPlatformId', (req, res, next) => {
  const { aiDataPlatformId } = req.params;
  platformEngine.getPlatform(aiDataPlatformId);
  next();
});

// Helper for quick responses and audit
const auditAndSend = (req: Request, res: Response, action: string, type: string, key: string, data: any, status = 200) => {
  const { aiDataPlatformId, workspaceKey } = req.params;
  platformEngine.recordAudit(aiDataPlatformId, action, type, key, { body: req.body, query: req.query }, workspaceKey);
  return res.status(status).json(data);
};

// ==========================================
// 1. AGENT OPERATIONS
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/agents', (req, res) => {
  const agents = Object.values(platformEngine.state.agents);
  res.json({ items: agents, count: agents.length });
});

aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/agents', (req, res) => {
  const { aiDataPlatformId, workspaceKey } = req.params;
  const agentKey = req.body.agentKey || 'agent-' + uuidv4().slice(0, 8);
  const newAgent = {
    agentKey,
    name: req.body.name || 'Autonomous Agent ' + agentKey,
    description: req.body.description || 'Enterprise Agent',
    model: req.body.model || 'meta.llama-3.3-70b-instruct',
    systemPrompt: req.body.systemPrompt || 'System orchestrator',
    status: 'READY',
    lifecycleState: 'ACTIVE',
    diagram: req.body.diagram || { nodes: [], edges: [] },
    permissions: ['EXECUTE', 'READ', 'MODIFY', 'DEPLOY'],
    timeCreated: new Date().toISOString(),
    timeUpdated: new Date().toISOString(),
  };
  platformEngine.state.agents[agentKey] = newAgent;
  auditAndSend(req, res, 'CREATE_AGENT', 'Agent', agentKey, newAgent, 201);
});

aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey', (req, res) => {
  const agent = platformEngine.state.agents[req.params.agentKey];
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json(agent);
});

aiDataPlatformRouter.put('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey', (req, res) => {
  const { agentKey } = req.params;
  const existing = platformEngine.state.agents[agentKey] || { agentKey };
  const updated = { ...existing, ...req.body, timeUpdated: new Date().toISOString() };
  platformEngine.state.agents[agentKey] = updated;
  auditAndSend(req, res, 'UPDATE_AGENT', 'Agent', agentKey, updated);
});

aiDataPlatformRouter.delete('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey', (req, res) => {
  const { agentKey } = req.params;
  delete platformEngine.state.agents[agentKey];
  auditAndSend(req, res, 'DELETE_AGENT', 'Agent', agentKey, { success: true, message: 'Agent deleted' });
});

aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/actions/copy', (req, res) => {
  const source = platformEngine.state.agents[req.params.agentKey];
  if (!source) return res.status(404).json({ error: 'Source agent not found' });
  const copyKey = 'agent-' + uuidv4().slice(0, 8);
  const copy = { ...source, agentKey: copyKey, name: (req.body.name || source.name) + ' (Copy)' };
  platformEngine.state.agents[copyKey] = copy;
  auditAndSend(req, res, 'COPY_AGENT', 'Agent', copyKey, copy, 201);
});

aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/permissions', (req, res) => {
  const agent = platformEngine.state.agents[req.params.agentKey];
  res.json({ permissions: agent?.permissions || ['EXECUTE', 'READ'] });
});

aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/actions/managePermission', (req, res) => {
  const { agentKey } = req.params;
  if (platformEngine.state.agents[agentKey]) {
    platformEngine.state.agents[agentKey].permissions = req.body.permissions || [];
  }
  auditAndSend(req, res, 'UPDATE_AGENT_PERMISSIONS', 'Agent', agentKey, { permissions: req.body.permissions });
});

aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/actions/validate', (req, res) => {
  res.json({ isValid: true, validationTime: new Date().toISOString(), warnings: [], syntaxCheck: 'PASSED' });
});

aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/agents/actions/previewAgentCard', (req, res) => {
  res.json({
    cardTitle: req.body.title || 'Enterprise Autonomous Agent',
    badge: 'ACTIVE_DEPLOYED',
    latencyP99Ms: 310,
    tags: ['OCI', 'Spark', 'Delta'],
    previewGeneratedAt: new Date().toISOString()
  });
});

// Deployments
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/deployments', (req, res) => {
  const deps = Object.values(platformEngine.state.agentDeployments).filter((d: any) => d.agentKey === req.params.agentKey);
  res.json({ items: deps, count: deps.length });
});

aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/deployments/actions/deploy', (req, res) => {
  const depKey = 'dep-' + uuidv4().slice(0, 8);
  const dep = {
    agentDeploymentKey: depKey,
    agentKey: req.params.agentKey,
    status: 'RUNNING',
    endpoint: `https://${req.params.aiDataPlatformId}.oci.oraclecloud.com/agents/${req.params.agentKey}/endpoint`,
    replicaCount: req.body.replicaCount || 2,
    timeDeployed: new Date().toISOString()
  };
  platformEngine.state.agentDeployments[depKey] = dep;
  auditAndSend(req, res, 'DEPLOY_AGENT', 'AgentDeployment', depKey, dep, 201);
});

aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/deployments/actions/redeploy', (req, res) => {
  res.json({ status: 'REDEPLOYED', timestamp: new Date().toISOString() });
});

aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/deployments/:agentDeploymentKey', (req, res) => {
  const dep = platformEngine.state.agentDeployments[req.params.agentDeploymentKey];
  if (!dep) return res.status(404).json({ error: 'Deployment not found' });
  res.json(dep);
});

aiDataPlatformRouter.delete('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/deployments/:agentDeploymentKey', (req, res) => {
  delete platformEngine.state.agentDeployments[req.params.agentDeploymentKey];
  auditAndSend(req, res, 'DELETE_AGENT_DEPLOYMENT', 'AgentDeployment', req.params.agentDeploymentKey, { success: true });
});

aiDataPlatformRouter.put('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/actions/updateDeploymentMetadata', (req, res) => {
  res.json({ success: true, updatedMetadata: req.body });
});

// Sessions
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/sessions', (req, res) => {
  const sessions = Object.values(platformEngine.state.agentSessions).filter((s: any) => s.agentKey === req.params.agentKey);
  res.json({ items: sessions, count: sessions.length });
});

aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/sessions/:sessionId', (req, res) => {
  const sess = platformEngine.state.agentSessions[req.params.sessionId];
  if (!sess) return res.status(404).json({ error: 'Session not found' });
  res.json(sess);
});

aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/sessions/:sessionId/chatHistory', (req, res) => {
  const sess = platformEngine.state.agentSessions[req.params.sessionId];
  res.json({ chatHistory: sess?.chatHistory || [] });
});

aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/sessions/:sessionId/traces/:traceKey', (req, res) => {
  const sess = platformEngine.state.agentSessions[req.params.sessionId];
  const trace = sess?.traces?.[req.params.traceKey] || { traceKey: req.params.traceKey, steps: ['Initialized'], durationMs: 120 };
  res.json(trace);
});

aiDataPlatformRouter.delete('/:aiDataPlatformId/workspaces/:workspaceKey/agents/:agentKey/sessions/:sessionId', (req, res) => {
  delete platformEngine.state.agentSessions[req.params.sessionId];
  res.json({ success: true });
});

// ==========================================
// 2. ASYNC OPERATIONS
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/asyncOperations', (req, res) => {
  res.json({ items: Object.values(platformEngine.state.asyncOperations) });
});

aiDataPlatformRouter.get('/:aiDataPlatformId/asyncOperations/:asyncOperationKey', (req, res) => {
  const op = platformEngine.state.asyncOperations[req.params.asyncOperationKey];
  if (!op) return res.status(404).json({ error: 'Async operation not found' });
  res.json(op);
});

aiDataPlatformRouter.post('/:aiDataPlatformId/asyncOperations/:asyncOperationKey/actions/cancel', (req, res) => {
  const op = platformEngine.state.asyncOperations[req.params.asyncOperationKey];
  if (op) {
    op.status = 'CANCELLED';
  }
  res.json({ success: true, status: 'CANCELLED' });
});

// ==========================================
// 3. AUDIT
// ==========================================
aiDataPlatformRouter.post('/:aiDataPlatformId/actions/manageAuditLogs', (req, res) => {
  res.json({ retentionDays: req.body.retentionDays || 90, status: 'CONFIGURED' });
});

aiDataPlatformRouter.post('/:aiDataPlatformId/actions/searchAuditLogs', (req, res) => {
  const logs = platformEngine.state.auditLogs.filter(l => l.platformId === req.params.aiDataPlatformId);
  res.json({ items: logs, count: logs.length });
});

// ==========================================
// 4. BUNDLE
// ==========================================
const handleBundleDeploy = (req: Request, res: Response) => {
  const op = platformEngine.createAsyncOp(req.params.aiDataPlatformId, 'Bundle', req.body.bundleKey || 'bundle-main');
  res.json({ status: 'DEPLOYED', asyncOperationKey: op.asyncOperationKey });
};

aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/bundles', handleBundleDeploy);
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/bundles/actions/deploy', handleBundleDeploy);
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/deployBundle', handleBundleDeploy);
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/bundles/actions/purge', (req, res) => res.json({ status: 'PURGED' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/bundles/actions/getDeploymentStatus', (req, res) => res.json({ status: 'ACTIVE', healthy: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/bundles/actions/sync', (req, res) => res.json({ status: 'SYNCED', syncedAt: new Date().toISOString() }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/getBundleDeploymentStatus', (req, res) => res.json({ status: 'ACTIVE' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/createBundle', (req, res) => res.json({ bundleKey: 'bnd-' + uuidv4().slice(0, 8), status: 'CREATED' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/purgeBundle', (req, res) => res.json({ status: 'PURGED' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/publishBundle', (req, res) => res.json({ status: 'PUBLISHED', version: '1.0.0' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/getBundlePublishStatus', (req, res) => res.json({ publishStatus: 'SUCCEEDED' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/syncBundle', (req, res) => res.json({ status: 'SYNC_COMPLETE' }));

// ==========================================
// 5. CATALOG
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/catalogs', (req, res) => {
  res.json({ items: Object.values(platformEngine.state.catalogs) });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/catalogs', (req, res) => {
  const catalogKey = req.body.catalogKey || 'cat-' + uuidv4().slice(0, 8);
  const cat = { catalogKey, name: req.body.name, ...req.body, timeCreated: new Date().toISOString() };
  platformEngine.state.catalogs[catalogKey] = cat;
  auditAndSend(req, res, 'CREATE_CATALOG', 'Catalog', catalogKey, cat, 201);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/catalogs/:catalogKey', (req, res) => {
  res.json(platformEngine.state.catalogs[req.params.catalogKey] || { catalogKey: req.params.catalogKey, name: 'Default Enterprise Catalog' });
});
aiDataPlatformRouter.put('/:aiDataPlatformId/catalogs/:catalogKey', (req, res) => {
  platformEngine.state.catalogs[req.params.catalogKey] = { ...platformEngine.state.catalogs[req.params.catalogKey], ...req.body };
  res.json(platformEngine.state.catalogs[req.params.catalogKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/catalogs/:catalogKey', (req, res) => {
  delete platformEngine.state.catalogs[req.params.catalogKey];
  res.json({ success: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/catalogs/:catalogKey/permissions', (req, res) => res.json({ permissions: ['READ', 'REFRESH', 'MANAGE'] }));
aiDataPlatformRouter.post('/:aiDataPlatformId/catalogs/:catalogKey/actions/refresh', (req, res) => res.json({ status: 'CRAWLING_REFRESHED' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/actions/testConnection', (req, res) => res.json({ connectionSuccess: true, latencyMs: 42 }));
aiDataPlatformRouter.post('/:aiDataPlatformId/catalogs/:catalogKey/actions/managePermission', (req, res) => res.json({ success: true, permissions: req.body.permissions }));

// ==========================================
// 6. CLUSTER (SPARK COMPUTE)
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/clusters', (req, res) => {
  res.json({ items: Object.values(platformEngine.state.clusters) });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/defaultCluster', (req, res) => {
  const first = Object.values(platformEngine.state.clusters)[0] || { clusterKey: 'default', state: 'RUNNING' };
  res.json(first);
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters', (req, res) => {
  const clusterKey = req.body.clusterKey || 'cluster-' + uuidv4().slice(0, 8);
  const cluster = {
    clusterKey,
    name: req.body.name || 'Spark Cluster ' + clusterKey,
    sparkVersion: req.body.sparkVersion || '3.5.0',
    nodeType: req.body.nodeType || 'VM.Standard.E4.Flex',
    numWorkers: req.body.numWorkers || 2,
    state: 'RUNNING',
    libraries: req.body.libraries || ['pyspark==3.5.0'],
    logs: [`[${new Date().toISOString()}] Cluster initiated successfully`],
    metrics: { cpuUtilization: 12.5, memoryUsageGb: 16.0 },
    permissions: ['RESTART', 'STOP', 'MANAGE_LIBRARIES']
  };
  platformEngine.state.clusters[clusterKey] = cluster;
  auditAndSend(req, res, 'CREATE_CLUSTER', 'Cluster', clusterKey, cluster, 201);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey', (req, res) => {
  res.json(platformEngine.state.clusters[req.params.clusterKey] || { error: 'Not found' });
});
aiDataPlatformRouter.put('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey', (req, res) => {
  platformEngine.state.clusters[req.params.clusterKey] = { ...platformEngine.state.clusters[req.params.clusterKey], ...req.body };
  res.json(platformEngine.state.clusters[req.params.clusterKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey', (req, res) => {
  delete platformEngine.state.clusters[req.params.clusterKey];
  res.json({ success: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/start', (req, res) => {
  if (platformEngine.state.clusters[req.params.clusterKey]) platformEngine.state.clusters[req.params.clusterKey].state = 'RUNNING';
  res.json({ state: 'RUNNING' });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/stop', (req, res) => {
  if (platformEngine.state.clusters[req.params.clusterKey]) platformEngine.state.clusters[req.params.clusterKey].state = 'STOPPED';
  res.json({ state: 'STOPPED' });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/restart', (req, res) => {
  if (platformEngine.state.clusters[req.params.clusterKey]) platformEngine.state.clusters[req.params.clusterKey].state = 'RUNNING';
  res.json({ state: 'RUNNING' });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/cloneCompute', (req, res) => {
  const orig = platformEngine.state.clusters[req.params.clusterKey];
  const newKey = 'cluster-' + uuidv4().slice(0, 8);
  const cloned = { ...orig, clusterKey: newKey, name: (orig?.name || 'Compute') + ' (Cloned)' };
  platformEngine.state.clusters[newKey] = cloned;
  res.status(201).json(cloned);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/libraries', (req, res) => {
  res.json({ libraries: platformEngine.state.clusters[req.params.clusterKey]?.libraries || [] });
});
aiDataPlatformRouter.patch('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/libraries', (req, res) => {
  if (platformEngine.state.clusters[req.params.clusterKey]) {
    platformEngine.state.clusters[req.params.clusterKey].libraries = req.body.libraries || [];
  }
  res.json({ success: true, libraries: req.body.libraries });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/downloadLogs', (req, res) => {
  res.json({ downloadUrl: `/logs/${req.params.clusterKey}.log`, linesCount: 140 });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/searchLogs', (req, res) => {
  res.json({ matches: platformEngine.state.clusters[req.params.clusterKey]?.logs || [] });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/mavenPackages', (req, res) => {
  res.json({ packages: [{ groupId: 'org.apache.spark', artifactId: 'spark-sql-kafka', version: '3.5.0' }] });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/summarizeMetricsData', (req, res) => {
  res.json({ metrics: platformEngine.state.clusters[req.params.clusterKey]?.metrics || { cpuUtilization: 20 } });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/queryReplicaIds', (req, res) => {
  res.json({ replicaIds: ['worker-01', 'worker-02', 'worker-03'] });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/getComputeConfiguration', (req, res) => {
  res.json({ driverMemory: '16g', executorMemory: '32g', sparkConf: { 'spark.sql.adaptive.enabled': 'true' } });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/exportComputeConfiguration', (req, res) => {
  res.json({ exportedAt: new Date().toISOString(), config: { sparkVersion: '3.5.0' } });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/importComputeConfiguration', (req, res) => {
  res.json({ success: true, importedConfig: req.body });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/permissions', (req, res) => {
  res.json({ permissions: platformEngine.state.clusters[req.params.clusterKey]?.permissions || ['ALL'] });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/clusters/:clusterKey/actions/managePermission', (req, res) => {
  res.json({ success: true, updatedPermissions: req.body.permissions });
});

// ==========================================
// 7. CREDENTIALS
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/credentials', (req, res) => res.json({ items: Object.values(platformEngine.state.credentials) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/credentials', (req, res) => {
  const credentialKey = req.body.credentialKey || 'cred-' + uuidv4().slice(0, 8);
  const cred = { credentialKey, ...req.body, timeCreated: new Date().toISOString() };
  platformEngine.state.credentials[credentialKey] = cred;
  auditAndSend(req, res, 'CREATE_CREDENTIAL', 'Credential', credentialKey, cred, 201);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/credentials/:credentialKey', (req, res) => {
  res.json(platformEngine.state.credentials[req.params.credentialKey] || { credentialKey: req.params.credentialKey });
});
aiDataPlatformRouter.put('/:aiDataPlatformId/credentials/:credentialKey', (req, res) => {
  platformEngine.state.credentials[req.params.credentialKey] = { ...platformEngine.state.credentials[req.params.credentialKey], ...req.body };
  res.json(platformEngine.state.credentials[req.params.credentialKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/credentials/:credentialKey', (req, res) => {
  delete platformEngine.state.credentials[req.params.credentialKey];
  res.json({ success: true });
});

// ==========================================
// 8. DATA LINEAGE
// ==========================================
aiDataPlatformRouter.post('/:aiDataPlatformId/actions/fetchLineage', (req, res) => {
  res.json({
    entity: req.body.entity || 'gold_daily_settlements',
    upstream: [
      { entity: 'raw_kafka_trades', type: 'STREAM', latency: '2s' },
      { entity: 'citi_wire_ledger', type: 'API', status: 'SYNCHRONIZED' }
    ],
    downstream: [
      { entity: 'executive_balance_report', type: 'DASHBOARD' },
      { entity: 'regulatory_capital_compliance', type: 'EXPORT_TABLE' }
    ]
  });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/actions/exportLineage', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.send('source,target,type,timestamp\nraw_kafka_trades,gold_daily_settlements,ETL,2026-10-04\ngold_daily_settlements,executive_report,ANALYTICS,2026-10-04');
});

// ==========================================
// 9. DELTA SHARE
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/shares', (req, res) => res.json({ items: Object.values(platformEngine.state.deltaShares) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/shares', (req, res) => {
  const shareKey = req.body.shareKey || 'share-' + uuidv4().slice(0, 8);
  const share = { shareKey, ...req.body, timeCreated: new Date().toISOString() };
  platformEngine.state.deltaShares[shareKey] = share;
  auditAndSend(req, res, 'CREATE_DELTA_SHARE', 'DeltaShare', shareKey, share, 201);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/shares/:shareKey', (req, res) => res.json(platformEngine.state.deltaShares[req.params.shareKey] || {}));
aiDataPlatformRouter.put('/:aiDataPlatformId/shares/:shareKey', (req, res) => {
  platformEngine.state.deltaShares[req.params.shareKey] = { ...platformEngine.state.deltaShares[req.params.shareKey], ...req.body };
  res.json(platformEngine.state.deltaShares[req.params.shareKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/shares/:shareKey', (req, res) => {
  delete platformEngine.state.deltaShares[req.params.shareKey];
  res.json({ success: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/shares/:shareKey/permissions', (req, res) => res.json({ permissions: ['SELECT'] }));
aiDataPlatformRouter.get('/:aiDataPlatformId/shares/:shareKey/dataAssets', (req, res) => res.json({ assets: platformEngine.state.deltaShares[req.params.shareKey]?.dataAssets || [] }));
aiDataPlatformRouter.get('/:aiDataPlatformId/shares/:shareKey/recipients', (req, res) => res.json({ recipients: Object.keys(platformEngine.state.deltaRecipients) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/shares/:shareKey/actions/managePermission', (req, res) => res.json({ success: true, permissions: req.body.permissions }));
aiDataPlatformRouter.post('/:aiDataPlatformId/shares/:shareKey/actions/manageDataAsset', (req, res) => res.json({ success: true, updatedAssets: req.body }));
aiDataPlatformRouter.post('/:aiDataPlatformId/shares/:shareKey/actions/manageAccess', (req, res) => res.json({ success: true, access: req.body }));

// Delta Recipients
aiDataPlatformRouter.get('/:aiDataPlatformId/recipients', (req, res) => res.json({ items: Object.values(platformEngine.state.deltaRecipients) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/recipients', (req, res) => {
  const recipientKey = req.body.recipientKey || 'recip-' + uuidv4().slice(0, 8);
  const recip = { recipientKey, ...req.body, timeCreated: new Date().toISOString() };
  platformEngine.state.deltaRecipients[recipientKey] = recip;
  auditAndSend(req, res, 'CREATE_DELTA_RECIPIENT', 'DeltaRecipient', recipientKey, recip, 201);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/recipients/:recipientKey', (req, res) => res.json(platformEngine.state.deltaRecipients[req.params.recipientKey] || {}));
aiDataPlatformRouter.put('/:aiDataPlatformId/recipients/:recipientKey', (req, res) => {
  platformEngine.state.deltaRecipients[req.params.recipientKey] = { ...platformEngine.state.deltaRecipients[req.params.recipientKey], ...req.body };
  res.json(platformEngine.state.deltaRecipients[req.params.recipientKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/recipients/:recipientKey', (req, res) => {
  delete platformEngine.state.deltaRecipients[req.params.recipientKey];
  res.json({ success: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/recipients/:recipientKey/shares', (req, res) => res.json({ shares: platformEngine.state.deltaRecipients[req.params.recipientKey]?.shares || [] }));
aiDataPlatformRouter.get('/:aiDataPlatformId/recipients/:recipientKey/permissions', (req, res) => res.json({ permissions: ['READ_SHARE'] }));
aiDataPlatformRouter.post('/:aiDataPlatformId/recipients/:recipientKey/actions/managePermission', (req, res) => res.json({ success: true }));

// ==========================================
// 10. GIT OPERATIONS
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey', (req, res) => {
  res.json({
    gitRepositoryKey: req.params.gitRepositoryKey,
    url: 'https://github.com/oracle-autonomous/ai-data-platform-core.git',
    currentBranch: 'main',
    branches: ['main', 'feature/autonomous-agents', 'staging/spark-3.5']
  });
});
aiDataPlatformRouter.put('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey', (req, res) => res.json({ success: true, metadata: req.body }));
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/gitBranches', (req, res) => {
  res.json({ branches: ['main', 'release-20260430', 'dev'] });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/gitBranches', (req, res) => {
  res.status(201).json({ branch: req.body.branchName, created: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/actions/checkOutBranch', (req, res) => {
  res.json({ activeBranch: req.body.branchName, checkedOut: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/actions/commitPush', (req, res) => {
  res.json({ commitHash: 'commit-' + uuidv4().slice(0, 7), pushed: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/actions/gitDiff', (req, res) => {
  res.json({ changedFiles: ['notebooks/analysis.ipynb', 'models/risk_model.py'] });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/actions/gitDiffDetails', (req, res) => {
  res.json({ file: req.query.file || 'models/risk_model.py', diff: '+ import delta\\n- import legacy_db' });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/actions/gitOperationState', (req, res) => {
  res.json({ state: 'CLEAN', ahead: 0, behind: 0 });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/actions/merge', (req, res) => res.json({ merged: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/actions/pull', (req, res) => res.json({ pulled: true, commitsUpdated: 1 }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/actions/rebase', (req, res) => res.json({ rebased: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/actions/reset', (req, res) => res.json({ reset: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/actions/resetState', (req, res) => res.json({ state: 'RESET' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/gitRepositories/:gitRepositoryKey/actions/resolveConflicts', (req, res) => res.json({ resolved: true }));

// ==========================================
// 11. MLOPS (MLFLOW)
// ==========================================
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/experiments/create', (req, res) => {
  const experimentId = 'exp-' + uuidv4().slice(0, 8);
  const exp = { experimentId, name: req.body.name, ...req.body };
  platformEngine.state.experiments[experimentId] = exp;
  res.status(201).json({ experiment_id: experimentId });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/experiments/search', (req, res) => {
  res.json({ experiments: Object.values(platformEngine.state.experiments) });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/experiments/get', (req, res) => {
  const exp = platformEngine.state.experiments[req.query.experiment_id as string];
  res.json({ experiment: exp || {} });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/experiments/get-by-name', (req, res) => {
  const exp = Object.values(platformEngine.state.experiments).find((e: any) => e.name === req.query.experiment_name);
  res.json({ experiment: exp || {} });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/experiments/update', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/experiments/delete', (req, res) => {
  delete platformEngine.state.experiments[req.body.experiment_id];
  res.json({ success: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/experiments/restore', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/experiments/set-experiment-tag', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/experiments/delete-experiment-tag', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/internal/experiments/update-experiment-tags', (req, res) => res.json({ success: true }));

// Runs
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/create', (req, res) => {
  const runId = 'run-' + uuidv4().slice(0, 8);
  const run = { runId, experimentId: req.body.experiment_id, status: 'RUNNING', metrics: {}, params: {}, tags: {}, timeStarted: new Date().toISOString() };
  platformEngine.state.experimentRuns[runId] = run;
  res.status(201).json({ run: { info: { run_id: runId, status: 'RUNNING' } } });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/search', (req, res) => {
  res.json({ runs: Object.values(platformEngine.state.experimentRuns) });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/get', (req, res) => {
  const run = platformEngine.state.experimentRuns[req.query.run_id as string];
  res.json({ run: run || {} });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/update', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/delete', (req, res) => {
  delete platformEngine.state.experimentRuns[req.body.run_id];
  res.json({ success: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/restore', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/log-metric', (req, res) => {
  const run = platformEngine.state.experimentRuns[req.body.run_id];
  if (run) run.metrics[req.body.key] = req.body.value;
  res.json({ success: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/log-parameter', (req, res) => {
  const run = platformEngine.state.experimentRuns[req.body.run_id];
  if (run) run.params[req.body.key] = req.body.value;
  res.json({ success: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/log-batch', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/log-model', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/log-inputs', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/set-tag', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/runs/delete-tag', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/internal/runs/update-tags', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/metrics/get-history', (req, res) => res.json({ metrics: [{ key: req.query.metric_key, value: 0.94, step: 100 }] }));
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/artifacts/list', (req, res) => res.json({ files: [{ path: 'model/model.pkl', is_dir: false, file_size: 4096 }] }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/logged-models/search', (req, res) => res.json({ models: [] }));

// Model Registry & Deployments
aiDataPlatformRouter.post(['/:aiDataPlatformId/mlops/api/2.0/mlflow/registered-models/create', '/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/registered-models/create'], (req, res) => {
  platformEngine.state.registeredModels[req.body.name] = { name: req.body.name, versions: [], ...req.body };
  res.status(201).json({ registered_model: platformEngine.state.registeredModels[req.body.name] });
});
aiDataPlatformRouter.get(['/:aiDataPlatformId/mlops/api/2.0/mlflow/registered-models/search', '/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/registered-models/search'], (req, res) => {
  res.json({ registered_models: Object.values(platformEngine.state.registeredModels) });
});
aiDataPlatformRouter.get(['/:aiDataPlatformId/mlops/api/2.0/mlflow/registered-models/get'], (req, res) => {
  res.json({ registered_model: platformEngine.state.registeredModels[req.query.name as string] || {} });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/mlops/api/2.0/registered-models/summary', (req, res) => res.json({ totalModels: Object.keys(platformEngine.state.registeredModels).length }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/registered-models/update', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/registered-models/rename', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/registered-models/delete', (req, res) => {
  delete platformEngine.state.registeredModels[req.body.name];
  res.json({ success: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/registered-models/set-tag', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/registered-models/delete-tag', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/internal/registered-models/update-tags', (req, res) => res.json({ success: true }));

// Model Versions
aiDataPlatformRouter.post(['/:aiDataPlatformId/mlops/api/2.0/mlflow/model-versions/create', '/:aiDataPlatformId/workspaces/:workspaceKey/mlops/api/2.0/mlflow/model-versions/create'], (req, res) => {
  res.status(201).json({ model_version: { name: req.body.name, version: '1.0.0', status: 'READY' } });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/mlops/api/2.0/mlflow/model-versions/search', (req, res) => res.json({ model_versions: [] }));
aiDataPlatformRouter.get('/:aiDataPlatformId/mlops/api/2.0/mlflow/model-versions/get', (req, res) => res.json({ model_version: { name: req.query.name, version: req.query.version, status: 'READY' } }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/model-versions/update', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/model-versions/delete', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/model-versions/transition-stage', (req, res) => res.json({ success: true, stage: req.body.stage }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/model-versions/set-tag', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/model-versions/delete-tag', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/mlflow/internal/model-versions/update-tags', (req, res) => res.json({ success: true }));

// Model Deployments (Serving)
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/model-deployments/create', (req, res) => {
  const id = 'mdep-' + uuidv4().slice(0, 8);
  const dep = { deploymentId: id, status: 'ACTIVE', ...req.body };
  platformEngine.state.modelDeployments[id] = dep;
  res.status(201).json(dep);
});
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/model-deployments/search', (req, res) => res.json({ deployments: Object.values(platformEngine.state.modelDeployments) }));
aiDataPlatformRouter.get('/:aiDataPlatformId/mlops/api/2.0/model-deployments/get', (req, res) => res.json(platformEngine.state.modelDeployments[req.query.id as string] || {}));
aiDataPlatformRouter.get('/:aiDataPlatformId/mlops/api/2.0/model-deployments/contract', (req, res) => res.json({ schema: { inputs: ['features'], outputs: ['prediction'] } }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/model-deployments/activate', (req, res) => res.json({ status: 'ACTIVE' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/model-deployments/deactivate', (req, res) => res.json({ status: 'INACTIVE' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/model-deployments/update', (req, res) => res.json({ status: 'UPDATED' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/model-deployments/delete', (req, res) => {
  delete platformEngine.state.modelDeployments[req.body.id];
  res.json({ success: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/model-deployments/roll-back', (req, res) => res.json({ status: 'ROLLED_BACK' }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/model-deployments/roll-forward', (req, res) => res.json({ status: 'ROLLED_FORWARD' }));
aiDataPlatformRouter.get('/:aiDataPlatformId/mlops/api/2.0/model-deployments/activities/get', (req, res) => res.json({ activities: [{ action: 'DEPLOY', timestamp: new Date().toISOString() }] }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/model-deployments/activities/search', (req, res) => res.json({ activities: [] }));
aiDataPlatformRouter.post('/:aiDataPlatformId/mlops/api/2.0/model-deployments/update-tags', (req, res) => res.json({ success: true }));

// ==========================================
// 12. NOTEBOOK
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/notebook/api/sessions', (req, res) => res.json({ sessions: Object.values(platformEngine.state.notebookSessions) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/notebook/api/sessions', (req, res) => {
  const sessionId = 'nb-sess-' + uuidv4().slice(0, 8);
  const sess = { sessionId, kernel: 'python3-spark', status: 'IDLE', timeCreated: new Date().toISOString() };
  platformEngine.state.notebookSessions[sessionId] = sess;
  res.status(201).json(sess);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/notebook/api/sessions/:sessionId', (req, res) => res.json(platformEngine.state.notebookSessions[req.params.sessionId] || {}));
aiDataPlatformRouter.patch('/:aiDataPlatformId/workspaces/:workspaceKey/notebook/api/sessions/:sessionId', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.delete('/:aiDataPlatformId/workspaces/:workspaceKey/notebook/api/sessions/:sessionId', (req, res) => {
  delete platformEngine.state.notebookSessions[req.params.sessionId];
  res.json({ success: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/notebook/api/contents/*', (req, res) => {
  const contentPath = (req.params as any)[0] || '';
  res.json({ name: contentPath, path: contentPath, type: 'notebook', content: { cells: [] } });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/notebook/api/contents/*', (req, res) => res.status(201).json({ created: true }));
aiDataPlatformRouter.put('/:aiDataPlatformId/workspaces/:workspaceKey/notebook/api/contents/*', (req, res) => res.json({ updated: true }));
aiDataPlatformRouter.patch('/:aiDataPlatformId/workspaces/:workspaceKey/notebook/api/contents/*', (req, res) => res.json({ renamed: true }));
aiDataPlatformRouter.delete('/:aiDataPlatformId/workspaces/:workspaceKey/notebook/api/contents/*', (req, res) => res.json({ deleted: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/notebook/api/actions/export/contents/*', (req, res) => res.json({ exportedContent: '# Notebook export', format: 'python' }));

// ==========================================
// 13. ROLE
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/roles', (req, res) => res.json({ items: Object.values(platformEngine.state.roles) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/roles', (req, res) => {
  const roleKey = req.body.roleKey || 'role-' + uuidv4().slice(0, 8);
  const role = { roleKey, name: req.body.name, permissions: req.body.permissions || [], members: [] };
  platformEngine.state.roles[roleKey] = role;
  auditAndSend(req, res, 'CREATE_ROLE', 'Role', roleKey, role, 201);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/roles/:roleKey', (req, res) => res.json(platformEngine.state.roles[req.params.roleKey] || {}));
aiDataPlatformRouter.put('/:aiDataPlatformId/roles/:roleKey', (req, res) => {
  platformEngine.state.roles[req.params.roleKey] = { ...platformEngine.state.roles[req.params.roleKey], ...req.body };
  res.json(platformEngine.state.roles[req.params.roleKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/roles/:roleKey', (req, res) => {
  delete platformEngine.state.roles[req.params.roleKey];
  res.json({ success: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/roles/:roleKey/permissions', (req, res) => res.json({ permissions: platformEngine.state.roles[req.params.roleKey]?.permissions || [] }));
aiDataPlatformRouter.post('/:aiDataPlatformId/roles/:roleKey/actions/addMember', (req, res) => {
  const role = platformEngine.state.roles[req.params.roleKey];
  if (role) role.members.push(req.body.memberId);
  res.json({ success: true, members: role?.members });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/roles/:roleKey/actions/removeMember', (req, res) => {
  const role = platformEngine.state.roles[req.params.roleKey];
  if (role) role.members = role.members.filter((m: string) => m !== req.body.memberId);
  res.json({ success: true, members: role?.members });
});

// ==========================================
// 14. SCHEMA & TABLES
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/schemas', (req, res) => res.json({ items: Object.values(platformEngine.state.schemas) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/schemas', (req, res) => {
  const schemaKey = req.body.schemaKey || 'sch-' + uuidv4().slice(0, 8);
  const sch = { schemaKey, name: req.body.name, ...req.body, timeCreated: new Date().toISOString() };
  platformEngine.state.schemas[schemaKey] = sch;
  auditAndSend(req, res, 'CREATE_SCHEMA', 'Schema', schemaKey, sch, 201);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/schemas/:schemaKey', (req, res) => res.json(platformEngine.state.schemas[req.params.schemaKey] || {}));
aiDataPlatformRouter.put('/:aiDataPlatformId/schemas/:schemaKey', (req, res) => {
  platformEngine.state.schemas[req.params.schemaKey] = { ...platformEngine.state.schemas[req.params.schemaKey], ...req.body };
  res.json(platformEngine.state.schemas[req.params.schemaKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/schemas/:schemaKey', (req, res) => {
  delete platformEngine.state.schemas[req.params.schemaKey];
  res.json({ success: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/schemas/:schemaKey/permissions', (req, res) => res.json({ permissions: ['SELECT', 'CREATE_TABLE', 'MANAGE'] }));
aiDataPlatformRouter.post('/:aiDataPlatformId/schemas/:schemaKey/actions/managePermission', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/schemas/:schemaKey/actions/refresh', (req, res) => res.json({ refreshed: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/schemas/:schemaKey/actions/generateTempFileUploadTarget', (req, res) => {
  res.json({ uploadUri: `/upload-target/temp_${uuidv4()}.parquet`, validMinutes: 60 });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/schemas/:schemaKey/actions/inferSchema', (req, res) => {
  res.json({ columns: [{ name: 'id', type: 'BIGINT' }, { name: 'value', type: 'DOUBLE' }, { name: 'timestamp', type: 'TIMESTAMP' }] });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/schemas/:schemaKey/actions/inferSchemaWithPreview', (req, res) => {
  res.json({
    columns: [{ name: 'account_id', type: 'STRING' }, { name: 'balance', type: 'DECIMAL(18,2)' }],
    previewRows: [{ account_id: 'CITI-9921', balance: '124000.50' }, { account_id: 'CITI-9922', balance: '8900.20' }]
  });
});

// Tables & Views
aiDataPlatformRouter.get('/:aiDataPlatformId/tables', (req, res) => res.json({ items: Object.values(platformEngine.state.tables) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/tables', (req, res) => {
  const tableKey = req.body.tableKey || 'tbl-' + uuidv4().slice(0, 8);
  const tbl = { tableKey, ...req.body, timeCreated: new Date().toISOString() };
  platformEngine.state.tables[tableKey] = tbl;
  auditAndSend(req, res, 'CREATE_TABLE', 'Table', tableKey, tbl, 201);
});
aiDataPlatformRouter.post('/:aiDataPlatformId/dataTables', (req, res) => {
  const tableKey = 'tbl-' + uuidv4().slice(0, 8);
  const tbl = { tableKey, ...req.body, managed: true, timeCreated: new Date().toISOString() };
  platformEngine.state.tables[tableKey] = tbl;
  res.status(201).json(tbl);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/tables/:tableKey', (req, res) => res.json(platformEngine.state.tables[req.params.tableKey] || {}));
aiDataPlatformRouter.put('/:aiDataPlatformId/tables/:tableKey', (req, res) => {
  platformEngine.state.tables[req.params.tableKey] = { ...platformEngine.state.tables[req.params.tableKey], ...req.body };
  res.json(platformEngine.state.tables[req.params.tableKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/tables/:tableKey', (req, res) => {
  delete platformEngine.state.tables[req.params.tableKey];
  res.json({ success: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/tables/:tableKey/permissions', (req, res) => res.json({ permissions: ['SELECT', 'INSERT', 'UPDATE'] }));
aiDataPlatformRouter.post('/:aiDataPlatformId/tables/:tableKey/actions/managePermission', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/tables/:tableKey/actions/refresh', (req, res) => res.json({ refreshed: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/tables/:tableKey/actions/getPar', (req, res) => {
  const par = platformEngine.generatePar(req.params.aiDataPlatformId, 'Table', req.params.tableKey);
  res.json(par);
});

// Views
aiDataPlatformRouter.get('/:aiDataPlatformId/views', (req, res) => res.json({ items: Object.values(platformEngine.state.views) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/views', (req, res) => {
  const viewKey = req.body.viewKey || 'view-' + uuidv4().slice(0, 8);
  const view = { viewKey, ...req.body, timeCreated: new Date().toISOString() };
  platformEngine.state.views[viewKey] = view;
  res.status(201).json(view);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/views/:viewKey', (req, res) => res.json(platformEngine.state.views[req.params.viewKey] || {}));
aiDataPlatformRouter.put('/:aiDataPlatformId/views/:viewKey', (req, res) => {
  platformEngine.state.views[req.params.viewKey] = { ...platformEngine.state.views[req.params.viewKey], ...req.body };
  res.json(platformEngine.state.views[req.params.viewKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/views/:viewKey', (req, res) => {
  delete platformEngine.state.views[req.params.viewKey];
  res.json({ success: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/views/:viewKey/permissions', (req, res) => res.json({ permissions: ['SELECT'] }));
aiDataPlatformRouter.post('/:aiDataPlatformId/views/:viewKey/actions/managePermission', (req, res) => res.json({ success: true }));

// ==========================================
// 15. USER SETTING
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/userSettings', (req, res) => res.json({ items: Object.values(platformEngine.state.userSettings) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/userSettings', (req, res) => {
  const settingKey = req.body.settingKey || 'set-' + uuidv4().slice(0, 8);
  platformEngine.state.userSettings[settingKey] = { settingKey, ...req.body };
  res.json(platformEngine.state.userSettings[settingKey]);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/userSettings/:settingKey', (req, res) => res.json(platformEngine.state.userSettings[req.params.settingKey] || {}));
aiDataPlatformRouter.put('/:aiDataPlatformId/userSettings/:settingKey', (req, res) => {
  platformEngine.state.userSettings[req.params.settingKey] = { ...platformEngine.state.userSettings[req.params.settingKey], ...req.body };
  res.json(platformEngine.state.userSettings[req.params.settingKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/userSettings/:settingKey', (req, res) => {
  delete platformEngine.state.userSettings[req.params.settingKey];
  res.json({ success: true });
});

// ==========================================
// 16. VOLUME
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/volumes', (req, res) => res.json({ items: Object.values(platformEngine.state.volumes) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/volumes', (req, res) => {
  const volumeKey = req.body.volumeKey || 'vol-' + uuidv4().slice(0, 8);
  const vol = { volumeKey, name: req.body.name, files: [], directories: ['/'], permissions: ['ALL'], ...req.body };
  platformEngine.state.volumes[volumeKey] = vol;
  auditAndSend(req, res, 'CREATE_VOLUME', 'Volume', volumeKey, vol, 201);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/volumes/:volumeKey', (req, res) => res.json(platformEngine.state.volumes[req.params.volumeKey] || {}));
aiDataPlatformRouter.put('/:aiDataPlatformId/volumes/:volumeKey', (req, res) => {
  platformEngine.state.volumes[req.params.volumeKey] = { ...platformEngine.state.volumes[req.params.volumeKey], ...req.body };
  res.json(platformEngine.state.volumes[req.params.volumeKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/volumes/:volumeKey', (req, res) => {
  delete platformEngine.state.volumes[req.params.volumeKey];
  res.json({ success: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/volumes/:volumeKey/files', (req, res) => res.json({ files: platformEngine.state.volumes[req.params.volumeKey]?.files || [] }));
aiDataPlatformRouter.get('/:aiDataPlatformId/volumes/:volumeKey/permissions', (req, res) => res.json({ permissions: platformEngine.state.volumes[req.params.volumeKey]?.permissions || ['ALL'] }));
aiDataPlatformRouter.put('/:aiDataPlatformId/volumes/:volumeKey/actions/managePermission', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/volumes/:volumeKey/actions/mkdir', (req, res) => {
  const vol = platformEngine.state.volumes[req.params.volumeKey];
  if (vol) vol.directories.push(req.body.path);
  res.json({ success: true, directories: vol?.directories });
});
aiDataPlatformRouter.put('/:aiDataPlatformId/volumes/:volumeKey/actions/updateDir', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.delete('/:aiDataPlatformId/volumes/:volumeKey/actions/deleteDir', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.delete('/:aiDataPlatformId/volumes/:volumeKey/actions/deleteFile', (req, res) => {
  const vol = platformEngine.state.volumes[req.params.volumeKey];
  if (vol) vol.files = vol.files.filter((f: any) => f.path !== req.body.path);
  res.json({ success: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/volumes/:volumeKey/actions/uploadFile', (req, res) => {
  const vol = platformEngine.state.volumes[req.params.volumeKey];
  if (vol) {
    vol.files.push({ path: req.body.path || '/new_file.dat', name: req.body.name || 'new_file.dat', type: 'file', size: 1024, timeCreated: new Date().toISOString() });
  }
  res.json({ success: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/volumes/:volumeKey/actions/uploadFileMeta', (req, res) => {
  const par = platformEngine.generatePar(req.params.aiDataPlatformId, 'Volume', req.params.volumeKey);
  res.json(par);
});
aiDataPlatformRouter.post('/:aiDataPlatformId/volumes/:volumeKey/actions/downloadFile', (req, res) => res.json({ downloadUrl: '/download/volume_file', size: 4096 }));
aiDataPlatformRouter.post('/:aiDataPlatformId/volumes/:volumeKey/actions/downloadFileMeta', (req, res) => {
  const par = platformEngine.generatePar(req.params.aiDataPlatformId, 'VolumeDownload', req.params.volumeKey);
  res.json(par);
});
aiDataPlatformRouter.post('/:aiDataPlatformId/volumes/:volumeKey/actions/uploadAndExtractZip', (req, res) => res.json({ success: true, extractedFilesCount: 5 }));
aiDataPlatformRouter.post('/:aiDataPlatformId/volumes/:volumeKey/actions/zipAndDownloadFolder', async (req, res) => {
  const buf = await platformEngine.zipVolumeFolder(req.params.volumeKey);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.volumeKey}.zip"`);
  res.send(buf);
});

// ==========================================
// 17. WORKFLOW (JOBS & RUNS)
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/jobs', (req, res) => res.json({ items: Object.values(platformEngine.state.jobs) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/jobs', (req, res) => {
  const jobKey = req.body.jobKey || 'job-' + uuidv4().slice(0, 8);
  const job = { jobKey, name: req.body.name, schedule: req.body.schedule || '0 0 * * *', status: 'SCHEDULED', ...req.body };
  platformEngine.state.jobs[jobKey] = job;
  auditAndSend(req, res, 'CREATE_JOB', 'Job', jobKey, job, 201);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/jobs/:jobKey', (req, res) => res.json(platformEngine.state.jobs[req.params.jobKey] || {}));
aiDataPlatformRouter.put('/:aiDataPlatformId/workspaces/:workspaceKey/jobs/:jobKey', (req, res) => {
  platformEngine.state.jobs[req.params.jobKey] = { ...platformEngine.state.jobs[req.params.jobKey], ...req.body };
  res.json(platformEngine.state.jobs[req.params.jobKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/workspaces/:workspaceKey/jobs/:jobKey', (req, res) => {
  delete platformEngine.state.jobs[req.params.jobKey];
  res.json({ success: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/jobs/:jobKey/permissions', (req, res) => res.json({ permissions: ['RUN', 'CANCEL', 'MODIFY'] }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/jobs/:jobKey/actions/managePermission', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/jobs/:jobKey/actions/cancelJobRuns', (req, res) => res.json({ success: true }));

// Job Runs
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/jobRuns', (req, res) => res.json({ items: Object.values(platformEngine.state.jobRuns) }));
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/recentJobRuns', (req, res) => res.json({ items: Object.values(platformEngine.state.jobRuns).slice(0, 10) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/jobRuns', (req, res) => {
  const jobRunKey = 'run-' + uuidv4().slice(0, 8);
  const run = { jobRunKey, jobKey: req.body.jobKey, status: 'RUNNING', timeStarted: new Date().toISOString() };
  platformEngine.state.jobRuns[jobRunKey] = run;
  res.status(201).json(run);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/jobRuns/:jobRunKey', (req, res) => res.json(platformEngine.state.jobRuns[req.params.jobRunKey] || {}));
aiDataPlatformRouter.delete('/:aiDataPlatformId/workspaces/:workspaceKey/jobRuns/:jobRunKey', (req, res) => {
  delete platformEngine.state.jobRuns[req.params.jobRunKey];
  res.json({ success: true });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/jobRuns/:jobRunKey/actions/cancel', (req, res) => {
  if (platformEngine.state.jobRuns[req.params.jobRunKey]) platformEngine.state.jobRuns[req.params.jobRunKey].status = 'CANCELLED';
  res.json({ status: 'CANCELLED' });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/jobRuns/:jobRunKey/actions/repair', (req, res) => res.json({ status: 'REPAIRED' }));

// Task Runs
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/taskRuns', (req, res) => res.json({ items: [] }));
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/taskRuns/:taskRunKey', (req, res) => res.json({ taskRunKey: req.params.taskRunKey, status: 'SUCCEEDED' }));
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/taskRuns/:taskRunKey/retries', (req, res) => res.json({ retries: 0 }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/taskRuns/:taskRunKey/actions/fetchOutput', (req, res) => res.json({ stdout: 'Job completed successfully', returnCode: 0 }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/taskRuns/:taskRunKey/outputs/:taskRunOutputKey/actions/export', (req, res) => res.json({ exportUri: '/task-output/data.json' }));

// ==========================================
// 18. WORKSPACE
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces', (req, res) => res.json({ items: Object.values(platformEngine.state.workspaces) }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces', (req, res) => {
  const workspaceKey = req.body.workspaceKey || 'ws-' + uuidv4().slice(0, 8);
  const ws = {
    workspaceKey,
    displayName: req.body.displayName || 'Workspace ' + workspaceKey,
    description: req.body.description || 'Enterprise analytics workspace',
    status: 'ACTIVE',
    lifecycleState: 'ACTIVE',
    timeCreated: new Date().toISOString(),
    timeUpdated: new Date().toISOString(),
    permissions: ['WORKSPACE_ADMIN'],
    gitFolders: []
  };
  platformEngine.state.workspaces[workspaceKey] = ws;
  auditAndSend(req, res, 'CREATE_WORKSPACE', 'Workspace', workspaceKey, ws, 201);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey', (req, res) => res.json(platformEngine.getWorkspace(req.params.workspaceKey)));
aiDataPlatformRouter.put('/:aiDataPlatformId/workspaces/:workspaceKey', (req, res) => {
  platformEngine.state.workspaces[req.params.workspaceKey] = { ...platformEngine.getWorkspace(req.params.workspaceKey), ...req.body, timeUpdated: new Date().toISOString() };
  res.json(platformEngine.state.workspaces[req.params.workspaceKey]);
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/workspaces/:workspaceKey', (req, res) => {
  delete platformEngine.state.workspaces[req.params.workspaceKey];
  res.json({ success: true });
});
aiDataPlatformRouter.get('/:aiDataPlatformId/createWorkspacePermissions', (req, res) => res.json({ canCreate: true, quotaAvailable: 10 }));
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/permissions', (req, res) => res.json({ permissions: platformEngine.getWorkspace(req.params.workspaceKey).permissions }));
aiDataPlatformRouter.post('/:aiDataPlatformId/actions/manageCreateWorkspacePermission', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/managePermission', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/gitFolders', (req, res) => {
  const ws = platformEngine.getWorkspace(req.params.workspaceKey);
  ws.gitFolders = ws.gitFolders || [];
  ws.gitFolders.push(req.body.folderPath || '/git/repo');
  res.json({ success: true, gitFolders: ws.gitFolders });
});
aiDataPlatformRouter.put('/:aiDataPlatformId/workspaces/:workspaceKey/asyncOperations/:asyncOperationKey/status', (req, res) => res.json({ success: true, status: req.body.status }));

// ==========================================
// 19. WORKSPACE OBJECT
// ==========================================
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/objects', (req, res) => {
  const objs = platformEngine.state.workspaceObjects[req.params.workspaceKey] || {};
  res.json({ items: Object.values(objs) });
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/objects', (req, res) => {
  const { workspaceKey } = req.params;
  if (!platformEngine.state.workspaceObjects[workspaceKey]) platformEngine.state.workspaceObjects[workspaceKey] = {};
  const objPath = req.body.objectPath || 'file_' + uuidv4().slice(0, 6) + '.txt';
  const newObj = {
    objectPath: objPath,
    objectKey: 'obj-' + uuidv4().slice(0, 8),
    type: req.body.type || 'file',
    size: (req.body.content || '').length,
    content: req.body.content || '',
    timeCreated: new Date().toISOString(),
    timeUpdated: new Date().toISOString(),
    permissions: ['READ', 'WRITE', 'DELETE']
  };
  platformEngine.state.workspaceObjects[workspaceKey][objPath] = newObj;
  auditAndSend(req, res, 'CREATE_WORKSPACE_OBJECT', 'WorkspaceObject', objPath, newObj, 201);
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/objects/:objectKey/permissions', (req, res) => res.json({ permissions: ['READ', 'WRITE', 'DELETE'] }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/objects/:objectKey/actions/managePermission', (req, res) => res.json({ success: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/copyObject', (req, res) => res.json({ success: true, newPath: req.body.targetPath }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/moveObject', (req, res) => res.json({ success: true, moved: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/renameObject', (req, res) => res.json({ success: true, renamed: true }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/uploadFileMeta', (req, res) => {
  const par = platformEngine.generatePar(req.params.aiDataPlatformId, 'WorkspaceObject', req.params.workspaceKey);
  res.json(par);
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/downloadFileMeta', (req, res) => {
  const par = platformEngine.generatePar(req.params.aiDataPlatformId, 'WorkspaceDownload', req.params.workspaceKey);
  res.json(par);
});
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/uploadAndExtractZip', (req, res) => res.json({ success: true, extractedCount: 8 }));
aiDataPlatformRouter.post('/:aiDataPlatformId/workspaces/:workspaceKey/actions/zipAndDownloadFolder', async (req, res) => {
  const buf = await platformEngine.zipWorkspaceFolder(req.params.workspaceKey);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.workspaceKey}.zip"`);
  res.send(buf);
});

// Wildcard object path handlers (GET, HEAD, PUT, DELETE)
aiDataPlatformRouter.head('/:aiDataPlatformId/workspaces/:workspaceKey/objects/*', (req, res) => {
  res.setHeader('X-Workspace-Object-Type', 'file');
  res.status(200).end();
});
aiDataPlatformRouter.get('/:aiDataPlatformId/workspaces/:workspaceKey/objects/*', (req, res) => {
  const objPath = (req.params as any)[0] || '';
  const obj = platformEngine.state.workspaceObjects[req.params.workspaceKey]?.[objPath];
  res.json(obj || { objectPath: objPath, content: '# File content', size: 1024 });
});
aiDataPlatformRouter.put('/:aiDataPlatformId/workspaces/:workspaceKey/objects/*', (req, res) => {
  const objPath = (req.params as any)[0] || '';
  res.json({ success: true, objectPath: objPath, updated: true });
});
aiDataPlatformRouter.delete('/:aiDataPlatformId/workspaces/:workspaceKey/objects/*', (req, res) => {
  const objPath = (req.params as any)[0] || '';
  if (platformEngine.state.workspaceObjects[req.params.workspaceKey]) {
    delete platformEngine.state.workspaceObjects[req.params.workspaceKey][objPath];
  }
  res.json({ success: true, deletedPath: objPath });
});
