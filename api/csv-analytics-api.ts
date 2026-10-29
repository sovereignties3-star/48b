import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export const csvAnalyticsRouter = Router();

export interface ColumnSchema {
  name: string;
  type: 'string' | 'number' | 'date' | 'email' | 'url' | 'boolean' | 'array';
  sampleValues: any[];
  uniqueCount: number;
  nullCount: number;
}

export interface DatasetMeta {
  id: string;
  name: string;
  filename: string;
  relativePath: string;
  fullPath: string;
  sizeBytes: number;
  rowCount: number;
  columnCount: number;
  columns: ColumnSchema[];
  category: 'Network & Connections' | 'Jobs & Career' | 'Learning & Skills' | 'Marketing & Demographics' | 'Services Marketplace' | 'Profile & Identity' | 'Messages & AI' | 'System & Other';
  previewRows: Record<string, any>[];
  lastModified: string;
}

function categorizeFilename(filename: string): DatasetMeta['category'] {
  const f = filename.toLowerCase();
  if (f.includes('connection') || f.includes('invitation') || f.includes('company follow')) return 'Network & Connections';
  if (f.includes('job') || f.includes('online job') || f.includes('saved job')) return 'Jobs & Career';
  if (f.includes('learn') || f.includes('skill') || f.includes('education')) return 'Learning & Skills';
  if (f.includes('target') || f.includes('ad_') || f.includes('marketing') || f.includes('media')) return 'Marketing & Demographics';
  if (f.includes('service') || f.includes('provider') || f.includes('engagement') || f.includes('opprtunities') || f.includes('opportunity')) return 'Services Marketplace';
  if (f.includes('profile') || f.includes('registration') || f.includes('email') || f.includes('phone') || f.includes('receipt') || f.includes('event')) return 'Profile & Identity';
  if (f.includes('message') || f.includes('coach') || f.includes('role_play') || f.includes('guide')) return 'Messages & AI';
  return 'System & Other';
}

function inferColumnType(values: any[]): ColumnSchema['type'] {
  const nonNulls = values.filter(v => v !== null && v !== undefined && String(v).trim() !== '');
  if (nonNulls.length === 0) return 'string';

  let isNum = true;
  let isDate = true;
  let isEmail = true;
  let isUrl = true;
  let isBool = true;

  for (const val of nonNulls.slice(0, 50)) {
    const s = String(val).trim();
    if (isNaN(Number(s))) isNum = false;
    if (isNaN(Date.parse(s)) || s.length < 5) isDate = false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) isEmail = false;
    if (!/^https?:\/\//i.test(s)) isUrl = false;
    if (!['true', 'false', '0', '1', 'yes', 'no'].includes(s.toLowerCase())) isBool = false;
  }

  if (isNum) return 'number';
  if (isDate) return 'date';
  if (isEmail) return 'email';
  if (isUrl) return 'url';
  if (isBool) return 'boolean';
  return 'string';
}

function scanCsvFiles(baseDir: string = process.cwd()): string[] {
  const results: string[] = [];

  function walk(current: string) {
    if (!fs.existsSync(current)) return;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.csv')) {
        results.push(full);
      }
    }
  }

  walk(baseDir);
  return results;
}

function parseCsvFile(filePath: string): { data: Record<string, any>[]; columns: string[] } {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse(content, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: true,
    });
    const headers = (parsed.meta.fields || []).filter(h => h && h.trim() !== '');
    const data = (parsed.data as Record<string, any>[]).map((row, idx) => {
      const cleanRow: Record<string, any> = { _id: idx + 1 };
      for (const h of headers) {
        cleanRow[h] = row[h] !== undefined ? row[h] : '';
      }
      return cleanRow;
    });
    return { data, columns: headers };
  } catch (err: any) {
    console.error(`Error parsing CSV ${filePath}:`, err);
    return { data: [], columns: [] };
  }
}

/**
 * GET /api/csv/datasets
 * Returns metadata and previews for all discovered CSV files
 */
csvAnalyticsRouter.get('/datasets', (req: Request, res: Response) => {
  try {
    const files = scanCsvFiles(process.cwd());
    const datasets: DatasetMeta[] = [];

    for (const fullPath of files) {
      const relPath = path.relative(process.cwd(), fullPath);
      const filename = path.basename(fullPath);
      const stat = fs.statSync(fullPath);
      const { data, columns } = parseCsvFile(fullPath);

      const columnSchemas: ColumnSchema[] = columns.map(col => {
        const values = data.map(r => r[col]);
        const nonNulls = values.filter(v => v !== null && v !== undefined && String(v).trim() !== '');
        const uniques = new Set(nonNulls.map(v => String(v).trim()));
        return {
          name: col,
          type: inferColumnType(values),
          sampleValues: nonNulls.slice(0, 5),
          uniqueCount: uniques.size,
          nullCount: values.length - nonNulls.length,
        };
      });

      const id = relPath.replace(/[^a-zA-Z0-9_-]/g, '_');
      const name = filename.replace(/\.csv$/i, '');

      datasets.push({
        id,
        name,
        filename,
        relativePath: relPath,
        fullPath,
        sizeBytes: stat.size,
        rowCount: data.length,
        columnCount: columns.length,
        columns: columnSchemas,
        category: categorizeFilename(filename),
        previewRows: data.slice(0, 5),
        lastModified: stat.mtime.toISOString(),
      });
    }

    // Sort by row count descending
    datasets.sort((a, b) => b.rowCount - a.rowCount);

    const totalRows = datasets.reduce((acc, d) => acc + d.rowCount, 0);
    const totalFiles = datasets.length;
    const totalBytes = datasets.reduce((acc, d) => acc + d.sizeBytes, 0);

    res.json({
      success: true,
      totalFiles,
      totalRows,
      totalBytes,
      datasets,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/csv/dataset/:id
 * Returns full rows and metadata for a specific dataset
 */
csvAnalyticsRouter.get('/dataset/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '100', search = '', sortBy = '', sortDir = 'asc' } = req.query;

    const files = scanCsvFiles(process.cwd());
    let targetPath: string | null = null;

    for (const fullPath of files) {
      const relPath = path.relative(process.cwd(), fullPath);
      const curId = relPath.replace(/[^a-zA-Z0-9_-]/g, '_');
      if (curId === id || relPath === id || path.basename(fullPath, '.csv') === id) {
        targetPath = fullPath;
        break;
      }
    }

    if (!targetPath) {
      return res.status(404).json({ success: false, error: `Dataset ${id} not found` });
    }

    const { data, columns } = parseCsvFile(targetPath);
    let filtered = [...data];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(row => {
        return Object.values(row).some(v => String(v).toLowerCase().includes(q));
      });
    }

    if (sortBy && typeof sortBy === 'string' && columns.includes(sortBy)) {
      filtered.sort((a, b) => {
        const va = a[sortBy];
        const vb = b[sortBy];
        if (va === vb) return 0;
        if (va === null || va === undefined) return 1;
        if (vb === null || vb === undefined) return -1;
        if (typeof va === 'number' && typeof vb === 'number') {
          return sortDir === 'desc' ? vb - va : va - vb;
        }
        return sortDir === 'desc' ? String(vb).localeCompare(String(va)) : String(va).localeCompare(String(vb));
      });
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit as string, 10) || 100);
    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / pageSize);
    const paginated = filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize);

    // Compute column summaries / analytics
    const columnAnalytics: Record<string, any> = {};
    for (const col of columns) {
      const vals = data.map(r => r[col]).filter(v => v !== null && v !== undefined && String(v).trim() !== '');
      const type = inferColumnType(vals);
      if (type === 'number') {
        const numVals = vals.map(Number).filter(n => !isNaN(n));
        const sum = numVals.reduce((a, b) => a + b, 0);
        const avg = numVals.length ? sum / numVals.length : 0;
        const min = numVals.length ? Math.min(...numVals) : 0;
        const max = numVals.length ? Math.max(...numVals) : 0;
        columnAnalytics[col] = { type, count: numVals.length, sum, avg, min, max };
      } else {
        const freq: Record<string, number> = {};
        for (const v of vals) {
          const s = String(v).trim();
          freq[s] = (freq[s] || 0) + 1;
        }
        const topValues = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([value, count]) => ({ value, count }));
        columnAnalytics[col] = { type, count: vals.length, topValues };
      }
    }

    res.json({
      success: true,
      id,
      filename: path.basename(targetPath),
      relativePath: path.relative(process.cwd(), targetPath),
      columns,
      totalRows: data.length,
      filteredRows: totalFiltered,
      page: pageNum,
      limit: pageSize,
      totalPages,
      rows: paginated,
      analytics: columnAnalytics,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/csv/save/:id
 * Saves updated rows back into the CSV file
 */
csvAnalyticsRouter.post('/save/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = req.body;

    if (!Array.isArray(rows)) {
      return res.status(400).json({ success: false, error: 'Expected rows array' });
    }

    const files = scanCsvFiles(process.cwd());
    let targetPath: string | null = null;

    for (const fullPath of files) {
      const relPath = path.relative(process.cwd(), fullPath);
      const curId = relPath.replace(/[^a-zA-Z0-9_-]/g, '_');
      if (curId === id || relPath === id || path.basename(fullPath, '.csv') === id) {
        targetPath = fullPath;
        break;
      }
    }

    if (!targetPath) {
      return res.status(404).json({ success: false, error: `Dataset ${id} not found` });
    }

    // Clean internal properties before unparsing
    const cleanRows = rows.map(r => {
      const copy = { ...r };
      delete copy._id;
      return copy;
    });

    const csvContent = Papa.unparse(cleanRows);
    fs.writeFileSync(targetPath, csvContent, 'utf8');

    res.json({
      success: true,
      message: `Successfully saved ${cleanRows.length} rows to ${path.basename(targetPath)}`,
      rowCount: cleanRows.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/csv/query
 * AI-assisted or Rule-assisted querying across all datasets
 */
csvAnalyticsRouter.post('/query', (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'Query string required' });
    }

    const files = scanCsvFiles(process.cwd());
    const matches: any[] = [];
    const q = query.toLowerCase();

    for (const fullPath of files) {
      const { data, columns } = parseCsvFile(fullPath);
      const filename = path.basename(fullPath);

      const matchingRows = data.filter(row => {
        return Object.values(row).some(v => String(v).toLowerCase().includes(q));
      });

      if (matchingRows.length > 0) {
        matches.push({
          filename,
          relativePath: path.relative(process.cwd(), fullPath),
          matchCount: matchingRows.length,
          columns,
          sampleMatches: matchingRows.slice(0, 10),
        });
      }
    }

    res.json({
      success: true,
      query,
      totalDatasetsWithMatches: matches.length,
      matches,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
