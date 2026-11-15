import path from 'path';
import express from 'express';
import { citiApiRouter } from './citi-api.ts';
import { citiOpenApiSuiteRouter } from './citi-openapi-suite.ts';
import { citiAccountsApiRouter } from './citi-accounts-api.ts';
import { intuitRouter } from './intuit/intuit-router.ts';
import { bridgeRouter } from './intuit/bridge-router.ts';
import { universalIngestRouter } from './intuit/universal-ingest.ts';
import { qboFullSuiteRouter } from './intuit/qbo-full-suite.ts';
import { mcpRouter } from './mcp-server-api.ts';
import { chaseApiRouter } from './chase-api.ts';
import { finicityApiRouter } from './finicity-api.ts';
import { marqetaApiRouter } from './marqeta-api.ts';
import { modernTreasuryApiRouter } from './modern-treasury-api.ts';
import { newRelicRouter } from './newrelic-api.ts';
import { dynatraceRouter } from './dynatrace-api.ts';
import { paypalApiRouter } from './paypal-api.ts';
import { plaidApiRouter } from './plaid-api.ts';
import { westernUnionPsd2Router } from './western-union-psd2.ts';
import { visaUnifiedRouter } from './visa-unified-router.ts';
import { ethereumApiRouter } from './ethereum-api.ts';
import { amazonApsRouter } from './amazon-aps-api.ts';
import { aiProcureRouter } from './ai-procure-api.ts';
import { aiAppPilotRouter } from './ai-app-pilot.ts';
import { cardCatalogRouter } from './card-catalog-api.ts';
import { credentialsRouter } from './credentials-api.ts';
import { envManagerRouter } from './env-manager.ts';
import { expansionRouter } from './expansion-pipeline.ts';
import { extractedAppsRouter } from './extracted-apps-api.ts';
import { integratedPackagesRouter } from './integrated-packages-api.ts';
import { streamOpenApiRouter } from './stream-openapi-api.ts';
import { stripeAnalyticsRouter } from './stripe-analytics-api.ts';
import { treasuryXsdRouter } from './treasury-xsd-api.ts';
import { azureDeploymentsRouter } from './azure-deployments-api.ts';
import { azureMasterRouter } from './azure-master-deploy.ts';
import { ocallaghanRouter } from './ocallaghan-algorithm.ts';
import { googleServiceKeyRouter } from './google-service-key.ts';
import { authKeysRouter } from './auth-keys.ts';
import { azureArcRouter } from './azure-arc-onboarding.ts';
import { azureAuthRouter } from './azure-auth.ts';
import { web3BrowserRouter } from './web3-browser-proxy.ts';
import { workbenchRouter } from './workbench-api.ts';
import { sovereignSingularityRouter } from './sovereign-singularity-api.ts';
import { signwellRouter } from './signwell-api.ts';
import { jamesburveloRouter } from './jamesburvelo-api.ts';
import { kronosApiRouter } from './kronos-api.ts';
import { githubDeployRouter } from './github-deploy-api.ts';
import { coinbaseCdpRouter } from './coinbase-cdp-api.ts';
import { salesforceRouter } from './salesforce-api.ts';
import { tableauRouter } from './tableau-api.ts';
import { krogerRouter } from './kroger-api.ts';
import { krogerCitibankProductRouter } from './kroger-citibank-products.ts';
import { krogerCartRouter } from './kroger-cart-api.ts';
import { astraDbRouter } from './astra-db.ts';
import { uberRouter } from './uber-api.ts';
import { aiDataPlatformRouter } from './ai-data-platform-api.ts';
import { houseAcquisitionRouter } from './house-acquisition-api.ts';
import { confluentKafkaRouter } from './confluent-kafka-api.ts';
import { modernTreasuryGraphqlRouter } from './modern-treasury-graphql-api.ts';
import { orchestratorRouter } from './orchestrator-api.ts';
import { googleAttributesRouter } from './google-attributes-api.ts';
import { spacecraftsRouter } from './spacecrafts-api.ts';
import { csvAnalyticsRouter } from './csv-analytics-api.ts';
import { articlesVaultRouter } from './articles-vault-api.ts';
import { aquariusV1Router } from './aquarius-v1-api.ts';
import { citiWebhookProxyRouter } from './citi-webhook-proxy.ts';
import { googleSamlRouter } from './google-saml-api.ts';
import { metamaskApiRouter } from './metamask-api.ts';
import { aiBuyerRouter } from './ai-buyer-api.ts';
import { accountingCategoriesRouter } from './accounting-categories-api.ts';
import { epicStoriesRouter } from './epic-stories-api.ts';
import { kronosCliRouter } from './kronos-cli-api.ts';

export const activeTokens = {
  accessToken: '',
  refreshToken: '',
  realmId: '9341453267972001',
  tokenType: 'bearer',
  expiresIn: 3600,
  updatedAt: Date.now(),
};

export const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Intuit / QuickBooks Routes (Mounted at both /api/intuit and /intuit for maximum resilience)
app.use('/api/intuit', intuitRouter);
app.use('/intuit', intuitRouter);

// Universal Ingest & Full Suite Routes
app.use('/api/intuit/universal', universalIngestRouter);
app.use('/api/intuit/suite', qboFullSuiteRouter);

// QuickBooks Autonomous Quantum Bridge
app.use('/api/bridge', bridgeRouter);
app.use('/api/intuit/bridge', bridgeRouter);

// Accounting Categories Master Registry & Auto-Classification
app.use('/api/accounting/categories', accountingCategoriesRouter);
app.use('/api/accounting', accountingCategoriesRouter);
app.use('/api/categories', accountingCategoriesRouter);
app.use('/categories', accountingCategoriesRouter);

// Model Context Protocol (MCP) Multi-Company Unified Server
app.use('/api/mcp', mcpRouter);
app.use('/api', mcpRouter); // Also mounts /api/mcp/execute, /api/mcp/tools etc.
app.use('/mcp', mcpRouter);

// Institutional Banking & Fintech Ecosystem Routers
app.use('/api/citi/openapi', citiOpenApiSuiteRouter);
app.use('/api/citi/accounts', citiAccountsApiRouter);
app.use('/openapi', citiOpenApiSuiteRouter);
app.use('/foundations', citiOpenApiSuiteRouter);
app.use('/api/citi', citiApiRouter);
app.use('/webhooks/citi', citiWebhookProxyRouter);
app.use('/api/webhooks/citi', citiWebhookProxyRouter);
app.use('/api/chase', chaseApiRouter);
app.use('/api/finicity', finicityApiRouter);
app.use('/api/marqeta', marqetaApiRouter);
app.use('/api/moderntreasury', modernTreasuryApiRouter);
app.use('/api/v1', aquariusV1Router);
app.use('/v1', aquariusV1Router);
app.use('/api/newrelic', newRelicRouter);
app.use('/api/paypal', paypalApiRouter);
app.use('/api/plaid', plaidApiRouter);
app.use('/api/wu-psd2', westernUnionPsd2Router);
app.use('/api/visa', visaUnifiedRouter);
app.use('/api/ethereum', ethereumApiRouter);
app.use('/api/amazon', amazonApsRouter);

// Auxiliary & Management Routers
app.use('/api/procure', aiProcureRouter);
app.use('/api/pilot', aiAppPilotRouter);
app.use('/api/card-catalog', cardCatalogRouter);
app.use('/api/credentials', credentialsRouter);
app.use('/api/env-manager', envManagerRouter);
app.use('/api/env', envManagerRouter);
app.use('/env', envManagerRouter);
app.use('/api/csv', csvAnalyticsRouter);
app.use('/api/articles', articlesVaultRouter);
app.use('/api/expansion', expansionRouter);
app.use('/api/extracted-apps', extractedAppsRouter);
app.use('/api', extractedAppsRouter);
app.use('/api/jamesburvelo', jamesburveloRouter);
app.use('/api/consortium', jamesburveloRouter);
app.use('/api/integrated-packages', integratedPackagesRouter);
app.use('/api/packages', integratedPackagesRouter);
app.use('/api/stream-openapi', streamOpenApiRouter);
app.use('/api/dynatrace', dynatraceRouter);
app.use('/dynatrace', dynatraceRouter);
app.use('/api/stripe', stripeAnalyticsRouter);
app.use('/api/treasury-xsd', treasuryXsdRouter);
app.use('/api/azure', azureDeploymentsRouter);
app.use('/api/azure-master', azureMasterRouter);
app.use('/api/azure-arc', azureArcRouter);
app.use('/api/azure-auth', azureAuthRouter);
app.use('/api/ocallaghan', ocallaghanRouter);
app.use('/api/google-service-key', googleServiceKeyRouter);
app.use('/api/saml', googleSamlRouter);
app.use('/saml', googleSamlRouter);
app.use('/api/metamask', metamaskApiRouter);
app.use('/api/ai-buyer', aiBuyerRouter);
app.use('/api/auth-keys', authKeysRouter);
app.use('/api/web3-browser', web3BrowserRouter);
app.use('/api/workbench', workbenchRouter);
app.use('/v1/sovereign', sovereignSingularityRouter);
app.use('/api/v1/sovereign', sovereignSingularityRouter);
app.use('/api/sovereign', sovereignSingularityRouter);
app.use('/sovereign', sovereignSingularityRouter);
app.use('/api/singularity', sovereignSingularityRouter);
app.use('/singularity', sovereignSingularityRouter);
app.use('/api/signwell', signwellRouter);
app.use('/api/kronos', kronosApiRouter);
app.use('/kronos', kronosApiRouter);
app.use('/api/github', githubDeployRouter);
app.use('/github', githubDeployRouter);
app.use('/api/cdp', coinbaseCdpRouter);

// Salesforce Enterprise, Data Cloud & Einstein Platform
app.use('/api/salesforce', salesforceRouter);
app.use('/salesforce', salesforceRouter);

// Tableau Server & Cloud REST API v3.29
app.use('/api/tableau', tableauRouter);
app.use('/tableau', tableauRouter);

// Kroger Developer APIs (Catalog V2, Locker Pickup, Locations, Delivery, Cart, Identity)
app.use('/api/kroger', krogerRouter);
app.use('/kroger', krogerRouter);
app.use('/', krogerRouter);
app.use('/api/kroger/products', krogerCitibankProductRouter);
app.use('/api/kroger/cart', krogerCartRouter);
app.use('/api/astra', astraDbRouter);
app.use('/api/uber', uberRouter);

// AI Data Platform 20260430 API Suite (All 19 Categories & 286 Operations)
app.use('/20260430/aiDataPlatforms', aiDataPlatformRouter);
app.use('/api/20260430/aiDataPlatforms', aiDataPlatformRouter);
app.use('/api/aiDataPlatforms', aiDataPlatformRouter);
app.use('/aiDataPlatforms', aiDataPlatformRouter);

// House PDF Acquisition & ISO 20022 Settlement API
app.use('/api/houses', houseAcquisitionRouter);
app.use('/houses', houseAcquisitionRouter);
app.use('/pdf/houses', houseAcquisitionRouter);

// Confluent Cloud Kafka Integration (lkc-o3xxyy)
app.use('/api/confluent', confluentKafkaRouter);
app.use('/confluent', confluentKafkaRouter);

// Modern Treasury GraphQL Persistent Queries API
app.use('/api/mt', modernTreasuryGraphqlRouter);
app.use('/mt', modernTreasuryGraphqlRouter);

// Enterprise Workflow Orchestrator (Data Storage, Consensus, ML, Signing, Tokenization)
app.use('/api/orchestrator', orchestratorRouter);
app.use('/orchestrator', orchestratorRouter);

// Epic Stories & Professional Bank Report Engine (Gemini 3.8 Flash)
app.use('/api/epic-stories', epicStoriesRouter);
app.use('/epic-stories', epicStoriesRouter);

// Kronos Apex CLI & Terminal Execution Engine
app.use('/api/kronos/cli', kronosCliRouter);
app.use('/api/cli', kronosCliRouter);
app.use('/kronos/cli', kronosCliRouter);

// Spacecrafts Live REST API & OpenAPI 3.1.0 Endpoint
app.use('/spacecrafts', spacecraftsRouter);
app.use('/api/spacecrafts', spacecraftsRouter);

// Serve OpenAPI 3.1.0 JSON format directly
app.get(['/openapi.json', '/openapi/spacecrafts.json', '/api/openapi.json'], (req, res) => {
  res.sendFile(path.join(process.cwd(), 'openapi', 'spacecrafts.openapi.json'));
});

// Quantum telemetry endpoint
app.all('/api/quantum', async (req, res) => {
  try {
    res.json({ success: true, counts: { '00': 512, '11': 512 }, status: 'ONLINE', timestamp: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
