import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import axios from 'axios';
import { parseSpecFile, WorkbenchCatalog, ParsedSpec } from '../api-workbench/scripts/parser.js';
import { generateAllArtifacts, buildOpenApi310Document } from '../api-workbench/scripts/codegen.js';

export const workbenchRouter = Router();

const sourceSpecsDir = path.join(process.cwd(), 'api-workbench', 'source_specs');
const generatedDir = path.join(process.cwd(), 'api-workbench', 'generated');
const catalogFile = path.join(generatedDir, 'data', 'workbench-catalog.json');
const manifestFile = path.join(generatedDir, 'data', 'workbench-manifest.json');
const summaryFile = path.join(generatedDir, 'data', 'specs-summary.json');
const perSpecComponentsDir = path.join(generatedDir, 'components', 'specs');

// In-memory compiled catalog fallback/cache loaded lazily
let inMemoryCatalog: any = null;
function getInitialCatalog() {
  if (!inMemoryCatalog && fs.existsSync(catalogFile)) {
    try {
      inMemoryCatalog = JSON.parse(fs.readFileSync(catalogFile, 'utf-8'));
    } catch {
      inMemoryCatalog = { paths: {} };
    }
  }
  return inMemoryCatalog || { paths: {} };
}
let inMemoryManifest: WorkbenchCatalog | null = null;

// Helper to run scan and regeneration
function runScanAndRegenerate(): WorkbenchCatalog {
  if (!fs.existsSync(sourceSpecsDir)) {
    fs.mkdirSync(sourceSpecsDir, { recursive: true });
  }

  const files = fs.readdirSync(sourceSpecsDir);
  const parsedSpecs: ParsedSpec[] = [];
  let totalEndpoints = 0;
  let totalXsdTypes = 0;
  let totalServers = 0;

  for (const file of files) {
    const filePath = path.join(sourceSpecsDir, file);
    try {
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) continue;

      const parsed = parseSpecFile(filePath);
      if (parsed) {
        parsedSpecs.push(parsed);
        const epCount = parsed.endpoints.length;
        const srvCount = parsed.servers.length;
        const xsdCount = parsed.xsdDetails
          ? (parsed.xsdDetails.complexTypes.length +
             parsed.xsdDetails.simpleTypes.length +
             parsed.xsdDetails.elements.length +
             parsed.xsdDetails.groups.length +
             (parsed.xsdDetails.attributeGroups?.length || 0))
          : 0;

        totalEndpoints += epCount;
        totalServers += srvCount;
        totalXsdTypes += xsdCount;
      }
    } catch (err: any) {
      console.error(`Error parsing ${file}:`, err.message);
    }
  }

  const catalog: WorkbenchCatalog = {
    generatedAt: new Date().toISOString(),
    totalSpecs: parsedSpecs.length,
    totalEndpoints,
    totalXsdTypes,
    totalServers,
    specs: parsedSpecs,
  };

  generateAllArtifacts(catalog, generatedDir);
  inMemoryCatalog = catalog;
  return catalog;
}

// GET /api/workbench/catalog
workbenchRouter.get(['/catalog', '/openapi.json'], (req: Request, res: Response) => {
  try {
    if (fs.existsSync(catalogFile)) {
      const data = fs.readFileSync(catalogFile, 'utf-8');
      return res.json(JSON.parse(data));
    }
    runScanAndRegenerate();
    if (fs.existsSync(catalogFile)) {
      const data = fs.readFileSync(catalogFile, 'utf-8');
      return res.json(JSON.parse(data));
    }
    return res.json(inMemoryCatalog || getInitialCatalog());
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/workbench/manifest
workbenchRouter.get('/manifest', (req: Request, res: Response) => {
  try {
    if (fs.existsSync(manifestFile)) {
      return res.json(JSON.parse(fs.readFileSync(manifestFile, 'utf-8')));
    }
    const catalog = runScanAndRegenerate();
    return res.json(catalog);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/workbench/summary
workbenchRouter.get('/summary', (req: Request, res: Response) => {
  try {
    if (fs.existsSync(summaryFile)) {
      const data = fs.readFileSync(summaryFile, 'utf-8');
      return res.json(JSON.parse(data));
    }
    const catalog = runScanAndRegenerate();
    return res.json({
      generatedAt: catalog.generatedAt,
      totalSpecs: catalog.totalSpecs,
      totalEndpoints: catalog.totalEndpoints,
      totalXsdTypes: catalog.totalXsdTypes,
      totalServers: catalog.totalServers,
      specs: catalog.specs.map(s => ({
        id: s.id,
        fileName: s.fileName,
        format: s.format,
        title: s.title,
        version: s.version,
        endpointCount: s.endpoints.length,
        serverCount: s.servers.length,
        schemasCount: s.schemasCount,
        tags: s.tags,
      })),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/workbench/specs
workbenchRouter.get('/specs', (req: Request, res: Response) => {
  try {
    let manifest: WorkbenchCatalog;
    if (fs.existsSync(manifestFile)) {
      manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
    } else {
      manifest = runScanAndRegenerate();
    }
    res.json({
      total: manifest.totalSpecs,
      specs: manifest.specs,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/workbench/spec/:id
workbenchRouter.get('/spec/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let manifest: WorkbenchCatalog;
    if (fs.existsSync(manifestFile)) {
      manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
    } else {
      manifest = runScanAndRegenerate();
    }

    const spec = manifest.specs.find(s => s.id === id || s.fileName === id);
    if (!spec) {
      return res.status(404).json({ error: `Spec not found: ${id}` });
    }
    return res.json(spec);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/workbench/scan (force rescan and regeneration)
workbenchRouter.post('/scan', (req: Request, res: Response) => {
  try {
    const catalog = runScanAndRegenerate();
    res.json({
      success: true,
      message: 'Scanned and regenerated all artifacts successfully',
      totalSpecs: catalog.totalSpecs,
      totalEndpoints: catalog.totalEndpoints,
      totalXsdTypes: catalog.totalXsdTypes,
      totalServers: catalog.totalServers,
      generatedAt: catalog.generatedAt,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/workbench/upload (upload new spec directly)
workbenchRouter.post('/upload', (req: Request, res: Response) => {
  try {
    const { fileName, content } = req.body;
    if (!fileName || !content) {
      return res.status(400).json({ error: 'fileName and content are required' });
    }

    const cleanName = path.basename(fileName);
    const destPath = path.join(sourceSpecsDir, cleanName);
    fs.writeFileSync(destPath, content, 'utf-8');

    // Rescan
    const catalog = runScanAndRegenerate();

    return res.json({
      success: true,
      message: `File ${cleanName} uploaded and workbench regenerated`,
      totalSpecs: catalog.totalSpecs,
      totalEndpoints: catalog.totalEndpoints,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/workbench/execute (live API proxy execution tester)
workbenchRouter.post('/execute', async (req: Request, res: Response) => {
  try {
    const { url, method = 'GET', headers = {}, queryParams = {}, body } = req.body;

    if (!url) {
      return res.status(400).json({ ok: false, error: 'Target URL is required' });
    }

    const startTime = performance.now();

    // Prepare target URL with query params
    const targetUrlObj = new URL(url);
    if (queryParams && typeof queryParams === 'object') {
      for (const [k, v] of Object.entries(queryParams)) {
        if (v !== undefined && v !== null && v !== '') {
          targetUrlObj.searchParams.append(k, String(v));
        }
      }
    }

    const cleanedHeaders: Record<string, string> = {
      'User-Agent': 'Workbench-API-Explorer/2.0',
      'Accept': 'application/json, text/plain, */*',
      ...headers,
    };
    delete cleanedHeaders['host'];

    try {
      const response = await axios({
        method: method.toLowerCase(),
        url: targetUrlObj.toString(),
        headers: cleanedHeaders,
        data: ['post', 'put', 'patch'].includes(method.toLowerCase()) ? body : undefined,
        timeout: 15000,
        validateStatus: () => true, // don't throw on 4xx/5xx so user sees real API error codes
      });

      const durationMs = Math.round(performance.now() - startTime);

      return res.json({
        ok: response.status >= 200 && response.status < 400,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
        durationMs,
        targetUrl: targetUrlObj.toString(),
      });
    } catch (reqErr: any) {
      const durationMs = Math.round(performance.now() - startTime);
      return res.json({
        ok: false,
        status: reqErr.response?.status || 0,
        statusText: reqErr.response?.statusText || reqErr.code || 'Request Failed',
        data: reqErr.response?.data || { error: reqErr.message },
        headers: reqErr.response?.headers || {},
        durationMs,
        targetUrl: targetUrlObj.toString(),
      });
    }
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/workbench/export-zip (download all generated artifacts in a zip)
workbenchRouter.get('/export-zip', async (req: Request, res: Response) => {
  try {
    const zip = new JSZip();

    // Recursively add generated files
    const addDirToZip = (currentDir: string, zipFolder: JSZip) => {
      if (!fs.existsSync(currentDir)) return;
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          addDirToZip(fullPath, zipFolder.folder(entry.name)!);
        } else if (entry.isFile()) {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(entry.name, content);
        }
      }
    };

    addDirToZip(generatedDir, zip);

    const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="workbench-generated.zip"');
    return res.send(buffer);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Helper to generate Postman collection v2.1 with pre-request and test scripts connected to mock DB
function generatePostmanCollectionFromOpenApi(openApiDoc: any) {
  const collection = {
    info: {
      name: openApiDoc.info?.title || "Enterprise Sovereign Mock Collection",
      description: openApiDoc.info?.description || "Auto-generated Postman Collection with Pre-Request & Test Scripts for Live Database Mocking",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    variable: [
      { key: "baseUrl", value: "http://localhost:3000", type: "string" },
      { key: "apiKey", value: "dev-key-12345", type: "string" },
      { key: "bearerToken", value: "mock-bearer-token-live-db", type: "string" }
    ],
    item: [] as any[]
  };

  const tagFolders: Record<string, any[]> = {};

  for (const [pathKey, pathObj] of Object.entries<any>(openApiDoc.paths || {})) {
    for (const [method, operation] of Object.entries<any>(pathObj)) {
      if (!operation || typeof operation !== 'object') continue;

      const tag = operation.tags?.[0] || "General";
      if (!tagFolders[tag]) {
        tagFolders[tag] = [];
      }

      const postmanPath = pathKey.replace(/\{([^}]+)\}/g, ':$1');

      const requestItem = {
        name: operation.summary || operation.operationId || `${method.toUpperCase()} ${pathKey}`,
        request: {
          method: method.toUpperCase(),
          header: [
            { key: "X-Api-Key", value: "{{apiKey}}", type: "text" },
            { key: "Authorization", value: "Bearer {{bearerToken}}", type: "text" },
            { key: "Content-Type", value: "application/json", type: "text" }
          ],
          url: {
            raw: "{{baseUrl}}" + postmanPath,
            host: ["{{baseUrl}}"],
            path: postmanPath.split('/').filter(Boolean),
            query: (operation.parameters || [])
              .filter((p: any) => p.in === 'query')
              .map((p: any) => ({ key: p.name, value: "", description: p.description || "", disabled: false }))
          },
          description: operation.description || operation.summary || ""
        },
        event: [
          {
            listen: "prerequest",
            script: {
              type: "text/javascript",
              exec: [
                "// Sovereign OS Mock Database Pre-request Script",
                "pm.environment.set('baseUrl', pm.environment.get('baseUrl') || 'http://localhost:3000');",
                "pm.request.headers.add({ key: 'uuid', value: 'req-' + Math.random().toString(36).substring(2, 15) });",
                "console.log('Executing request against live DB mock server: ' + pm.request.url.toString());"
              ]
            }
          },
          {
            listen: "test",
            script: {
              type: "text/javascript",
              exec: [
                "// Sovereign OS Mock Database Post-response Test & State Sync Script",
                "pm.test('Response status is successful (2xx/3xx)', function () {",
                "    pm.expect(pm.response.code).to.be.oneOf([200, 201, 202, 204]);",
                "});",
                "try {",
                "    var resJson = pm.response.json();",
                "    if (resJson) {",
                "        if (resJson.id) pm.environment.set('lastId', resJson.id);",
                "        if (resJson.account_id) pm.environment.set('accountId', resJson.account_id);",
                "        if (resJson.transfer_id) pm.environment.set('transferId', resJson.transfer_id);",
                "        if (resJson.access_token) pm.environment.set('bearerToken', resJson.access_token);",
                "    }",
                "} catch (e) {",
                "    // Not JSON or empty body",
                "}"
              ]
            }
          }
        ]
      };

      tagFolders[tag].push(requestItem);
    }
  }

  for (const [folderName, requests] of Object.entries(tagFolders)) {
    collection.item.push({
      name: folderName,
      item: requests
    });
  }

  return collection;
}

// GET /api/workbench/postman-collection.json
workbenchRouter.get('/postman-collection.json', (req: Request, res: Response) => {
  try {
    let openApiDoc: any;
    if (fs.existsSync(catalogFile)) {
      openApiDoc = JSON.parse(fs.readFileSync(catalogFile, 'utf-8'));
    } else {
      const catalog = runScanAndRegenerate();
      openApiDoc = buildOpenApi310Document(catalog);
    }
    const collection = generatePostmanCollectionFromOpenApi(openApiDoc);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="sovereign-mock-database.postman_collection.json"');
    return res.json(collection);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
