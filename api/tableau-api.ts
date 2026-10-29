import { Router } from 'express';

export const tableauRouter = Router();

// In-memory Tableau Server / Cloud state
let currentSession: {
  token: string;
  siteId: string;
  siteName: string;
  userId: string;
  username: string;
  role: string;
  expiresInMinutes: number;
} | null = {
  token: 'tb_session_live_99812_kronos',
  siteId: '1edc53ac-e247-4870-9fd3-6fad0ce5f84d',
  siteName: 'KronosInstitutionalAnalytics',
  userId: '9f9e9d9c-8b8a-8f8e-7d7c-7b7a6f6d6e6d',
  username: 'james.burvelo@kronos-apex.com',
  role: 'ServerAdministrator',
  expiresInMinutes: 240
};

let connectedApps = [
  {
    id: 'ca_9921_tableau_salesforce',
    name: 'Salesforce_DataCloud_Bridge_App',
    clientId: 'ac95d175-c844-4779-9d58-415e01fe7dab',
    enabled: true,
    unrestrictedEmbedding: true,
    createdAt: '2026-01-15T18:46:30Z',
    domainSafelist: ['https://login.salesforce.com', 'https://kronos-apex.my.salesforce.com']
  }
];

let mcpSettings = {
  INCLUDE_TOOLS: 'datasource,search-content,query-datasource',
  INCLUDE_TAGS: 'sales,treasury,institutional,quantum-bridge',
  MAX_RESULT_LIMIT: '50',
  MAX_RESULT_LIMITS: 'query-datasource:1000'
};

/**
 * @summary Tableau Server Info
 * @endpoint GET /api/tableau/serverinfo
 */
tableauRouter.get('/serverinfo', (req, res) => {
  res.json({
    productVersion: {
      build: '2026.2.0.4812',
      version: '2026.2 (Tableau Cloud / Server)'
    },
    restApiVersion: '3.29',
    protocol: 'REST / XML / JSON',
    capabilities: [
      'Connected Apps Direct Trust',
      'Unified Access Tokens (UAT)',
      'Tableau Model Context Protocol (MCP)',
      'Data Freshness Policy',
      'Validate Workbook XSD'
    ]
  });
});

/**
 * @summary Sign In (Supports PAT, Username/Password, and Connected Apps JWT)
 * @endpoint POST /api/tableau/auth/signin
 */
tableauRouter.post('/auth/signin', (req, res) => {
  const { credentials } = req.body || {};
  const token = `X-Tableau-Auth_${Buffer.from(Date.now().toString()).toString('base64')}|${Math.random().toString(36).substring(2, 10)}`;

  currentSession = {
    token,
    siteId: credentials?.site?.contentUrl || '1edc53ac-e247-4870-9fd3-6fad0ce5f84d',
    siteName: credentials?.site?.contentUrl || 'KronosInstitutionalAnalytics',
    userId: '9f9e9d9c-8b8a-8f8e-7d7c-7b7a6f6d6e6d',
    username: credentials?.name || credentials?.personalAccessTokenName || 'admin',
    role: 'ServerAdministrator',
    expiresInMinutes: 240
  };

  res.status(200).json({
    tsResponse: {
      credentials: {
        token: currentSession.token,
        estimatedTimeToExpiration: '04:00',
        site: {
          id: currentSession.siteId,
          contentUrl: currentSession.siteName
        },
        user: {
          id: currentSession.userId,
          name: currentSession.username,
          siteRole: currentSession.role
        }
      }
    }
  });
});

/**
 * @summary Sign Out
 * @endpoint POST /api/tableau/auth/signout
 */
tableauRouter.post('/auth/signout', (req, res) => {
  currentSession = null;
  res.status(204).send();
});

/**
 * @summary Query Sites
 * @endpoint GET /api/tableau/sites
 */
tableauRouter.get('/sites', (req, res) => {
  res.json({
    pagination: { pageNumber: 1, pageSize: 100, totalAvailable: 2 },
    sites: [
      {
        id: '1edc53ac-e247-4870-9fd3-6fad0ce5f84d',
        name: 'Kronos Institutional Analytics',
        contentUrl: 'kronos-institutional',
        state: 'Active',
        adminMode: 'ContentAndUsers',
        storageQuota: 50000,
        tierCreatorCapacity: 50,
        tierExplorerCapacity: 150,
        tierViewerCapacity: 500
      },
      {
        id: '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d',
        name: 'Default',
        contentUrl: '',
        state: 'Active',
        adminMode: 'ContentAndUsers'
      }
    ]
  });
});

/**
 * @summary Query Workbooks
 * @endpoint GET /api/tableau/sites/:siteId/workbooks
 */
tableauRouter.get('/sites/:siteId/workbooks', (req, res) => {
  res.json({
    pagination: { pageNumber: 1, pageSize: 100, totalAvailable: 3 },
    workbooks: [
      {
        id: 'wb_01_treasury_liquidity',
        name: 'OmniGrid Enterprise Cash & Bond Yield Shocks',
        contentUrl: 'omnigrid-cash-yields',
        showTabs: true,
        size: 14,
        createdAt: '2026-02-10T12:00:00Z',
        updatedAt: '2026-03-01T15:30:00Z',
        project: { id: 'proj_01', name: 'Treasury & Risk' },
        owner: { id: '9f9e9d9c-8b8a-8f8e-7d7c-7b7a6f6d6e6d', name: 'james.burvelo' }
      },
      {
        id: 'wb_02_citi_chase_reconciliation',
        name: 'Citi OBP & Chase Open Banking Unified Ingest',
        contentUrl: 'citi-chase-reconciliation',
        showTabs: true,
        size: 9,
        createdAt: '2026-02-18T10:15:00Z',
        updatedAt: '2026-03-02T09:20:00Z',
        project: { id: 'proj_01', name: 'Treasury & Risk' },
        owner: { id: '9f9e9d9c-8b8a-8f8e-7d7c-7b7a6f6d6e6d', name: 'james.burvelo' }
      },
      {
        id: 'wb_03_kroger_procurement',
        name: 'Kroger Retail & Corporate Pantry Supply Chain',
        contentUrl: 'kroger-pantry-supply-chain',
        showTabs: false,
        size: 6,
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-02T11:00:00Z',
        project: { id: 'proj_02', name: 'Retail & Commercial Operations' },
        owner: { id: '9f9e9d9c-8b8a-8f8e-7d7c-7b7a6f6d6e6d', name: 'james.burvelo' }
      }
    ]
  });
});

/**
 * @summary Query Data Sources
 * @endpoint GET /api/tableau/sites/:siteId/datasources
 */
tableauRouter.get('/sites/:siteId/datasources', (req, res) => {
  res.json({
    pagination: { pageNumber: 1, pageSize: 100, totalAvailable: 3 },
    datasources: [
      {
        id: 'ds_citi_open_banking',
        name: 'Citibank FDX & Accounts Ledger Hyper Live',
        type: 'hyper',
        isCertified: true,
        certificationNote: 'Audited ISO 20022 Financial Data Exchange 6.0 feed',
        project: { id: 'proj_01', name: 'Treasury & Risk' }
      },
      {
        id: 'ds_modern_treasury',
        name: 'Modern Treasury General Ledger Mirror',
        type: 'sqlserver',
        isCertified: true,
        certificationNote: 'Continuous double-entry balanced mirror',
        project: { id: 'proj_01', name: 'Treasury & Risk' }
      },
      {
        id: 'ds_kroger_catalog',
        name: 'Kroger Retail Catalog & Inventory Realtime',
        type: 'hyper',
        isCertified: true,
        certificationNote: 'Verified Kroger Developer API v1 feed',
        project: { id: 'proj_02', name: 'Retail & Commercial Operations' }
      }
    ]
  });
});

/**
 * @summary Tableau MCP Settings for Site (v3.29)
 * @endpoint GET /api/tableau/sites/:siteId/settings/mcp
 */
tableauRouter.get('/sites/:siteId/settings/mcp', (req, res) => {
  res.json({
    mcpSiteSettings: {
      settings: Object.entries(mcpSettings).map(([key, value]) => ({ key, value }))
    }
  });
});

/**
 * @summary Update Tableau MCP Settings for Site
 * @endpoint PUT /api/tableau/sites/:siteId/settings/mcp
 */
tableauRouter.put('/sites/:siteId/settings/mcp', (req, res) => {
  const { mcpSiteSettings } = req.body || {};
  if (mcpSiteSettings?.settings) {
    mcpSiteSettings.settings.forEach((s: { key: string; value?: string }) => {
      if (s.value !== undefined) {
        (mcpSettings as any)[s.key] = s.value;
      } else {
        delete (mcpSettings as any)[s.key];
      }
    });
  }
  res.json({
    success: true,
    mcpSiteSettings: {
      settings: Object.entries(mcpSettings).map(([key, value]) => ({ key, value }))
    }
  });
});

/**
 * @summary Connected Apps Direct Trust
 * @endpoint POST /api/tableau/sites/:siteId/connected-apps/direct-trust
 */
tableauRouter.post('/sites/:siteId/connected-apps/direct-trust', (req, res) => {
  const { name, domainSafelist, unrestrictedEmbedding } = req.body || {};
  const newApp = {
    id: `ca_${Date.now()}`,
    name: name || 'Salesforce_Tableau_Connected_App',
    clientId: `client_${Math.random().toString(36).substring(2, 12)}`,
    enabled: true,
    unrestrictedEmbedding: unrestrictedEmbedding ?? true,
    createdAt: new Date().toISOString(),
    domainSafelist: domainSafelist || ['https://login.salesforce.com']
  };
  connectedApps.push(newApp);
  res.status(201).json({
    connectedApplication: newApp
  });
});

/**
 * @summary Validate Workbook (TWB XSD validation)
 * @endpoint POST /api/tableau/sites/:siteId/workbooks/validateWorkbook
 */
tableauRouter.post('/sites/:siteId/workbooks/validateWorkbook', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    status: 'VALID',
    message: 'TWB document conforms to Tableau Document Schema (TWB XSD 3.29)',
    errors: [],
    warnings: [
      {
        severity: 'INFO',
        message: 'Hyper connection upgraded to native live-to-hyper v2 acceleration.',
        line: 14,
        elementName: 'connection'
      }
    ]
  });
});
