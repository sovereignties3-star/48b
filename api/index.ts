import path from 'path';
import express from 'express';
import { citiApiRouter } from './citi-api';
import { citiOpenApiSuiteRouter } from './citi-openapi-suite';
import { citiAccountsApiRouter } from './citi-accounts-api';
import { intuitRouter } from './intuit/intuit-router';
import { bridgeRouter } from './intuit/bridge-router';
import { universalIngestRouter } from './intuit/universal-ingest';
import { qboFullSuiteRouter } from './intuit/qbo-full-suite';
import { mcpRouter } from './mcp-server-api';
import { chaseApiRouter } from './chase-api';
import { finicityApiRouter } from './finicity-api';
import { marqetaApiRouter } from './marqeta-api';
import { modernTreasuryApiRouter } from './modern-treasury-api';
import { newRelicRouter } from './newrelic-api';
import { dynatraceRouter } from './dynatrace-api';
import { paypalApiRouter } from './paypal-api';
import { plaidApiRouter } from './plaid-api';
import { westernUnionPsd2Router } from './western-union-psd2';
import { visaUnifiedRouter } from './visa-unified-router';
import { ethereumApiRouter } from './ethereum-api';
import { amazonApsRouter } from './amazon-aps-api';
import { aiProcureRouter } from './ai-procure-api';
import { aiAppPilotRouter } from './ai-app-pilot';
import { cardCatalogRouter } from './card-catalog-api';
import { credentialsRouter } from './credentials-api';
import { envManagerRouter } from './env-manager';
import { expansionRouter } from './expansion-pipeline';
import { extractedAppsRouter } from './extracted-apps-api';
import { integratedPackagesRouter } from './integrated-packages-api';
import { streamOpenApiRouter } from './stream-openapi-api';
import { stripeAnalyticsRouter } from './stripe-analytics-api';
import { treasuryXsdRouter } from './treasury-xsd-api';
import { azureDeploymentsRouter } from './azure-deployments-api';
import { azureMasterRouter } from './azure-master-deploy';
import { ocallaghanRouter } from './ocallaghan-algorithm';
import { googleServiceKeyRouter } from './google-service-key';
import { authKeysRouter } from './auth-keys';
import { azureArcRouter } from './azure-arc-onboarding';
import { azureAuthRouter } from './azure-auth';
import { web3BrowserRouter } from './web3-browser-proxy';
import { workbenchRouter } from './workbench-api';
import { sovereignSingularityRouter } from './sovereign-singularity-api';
import { signwellRouter } from './signwell-api';
import { jamesburveloRouter } from './jamesburvelo-api';
import { kronosApiRouter } from './kronos-api';
import { githubDeployRouter } from './github-deploy-api';
import { coinbaseCdpRouter } from './coinbase-cdp-api';
import { salesforceRouter } from './salesforce-api';
import { tableauRouter } from './tableau-api';
import { krogerRouter } from './kroger-api';
import { krogerCitibankProductRouter } from './kroger-citibank-products';
import { krogerCartRouter } from './kroger-cart-api';
import { astraDbRouter } from './astra-db';
import { uberRouter } from './uber-api';
import { aiDataPlatformRouter } from './ai-data-platform-api';
import { houseAcquisitionRouter } from './house-acquisition-api';
import { confluentKafkaRouter } from './confluent-kafka-api';
import { modernTreasuryGraphqlRouter } from './modern-treasury-graphql-api';
import { orchestratorRouter } from './orchestrator-api';
import { googleAttributesRouter } from './google-attributes-api';
import { spacecraftsRouter } from './spacecrafts-api';
import { csvAnalyticsRouter } from './csv-analytics-api';
import { articlesVaultRouter } from './articles-vault-api';
import { aquariusV1Router } from './aquarius-v1-api';
import { citiWebhookProxyRouter } from './citi-webhook-proxy';
import { googleSamlRouter } from './google-saml-api';
import { metamaskApiRouter } from './metamask-api';
import { aiBuyerRouter } from './ai-buyer-api';
import { accountingCategoriesRouter } from './accounting-categories-api';
import { epicStoriesRouter } from './epic-stories-api';
import { kronosCliRouter } from './kronos-cli-api';

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
