import { Router, Request, Response } from 'express';
import { ACCOUNTING_CATEGORIES, AccountingCategory } from '../src/data/accountingCategories';
import { mockStore } from './intuit/qbo-full-suite';
import { recordBridgeEvent } from './intuit/quickbooks-bridge';

export const accountingCategoriesRouter = Router();

// In-memory store initialized with all standard Accounting Categories
let categoryStore: AccountingCategory[] = [...ACCOUNTING_CATEGORIES];

// 1. GET /api/accounting/categories - List & filter
accountingCategoriesRouter.get('/', (req: Request, res: Response) => {
  const { query, classification, parent, limit, offset } = req.query;

  let results = [...categoryStore];

  if (query && typeof query === 'string') {
    const q = query.toLowerCase().trim();
    results = results.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      (c.code && c.code.includes(q)) ||
      c.description.toLowerCase().includes(q)
    );
  }

  if (classification && typeof classification === 'string') {
    results = results.filter(c => c.classification.toLowerCase() === classification.toLowerCase());
  }

  if (parent && typeof parent === 'string') {
    results = results.filter(c => c.parentCategory && c.parentCategory.toLowerCase() === parent.toLowerCase());
  }

  const total = results.length;
  const start = offset ? parseInt(offset as string, 10) : 0;
  const count = limit ? parseInt(limit as string, 10) : total;
  const paginated = results.slice(start, start + count);

  res.json({
    total,
    count: paginated.length,
    offset: start,
    categories: paginated,
  });
});

// 2. GET /api/accounting/categories/:id - Lookup by ID or Code
accountingCategoriesRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const found = categoryStore.find(c => c.id === id || c.code === id || c.name.toLowerCase() === id.toLowerCase());

  if (!found) {
    return res.status(404).json({ error: 'Category not found', id });
  }

  res.json({ category: found });
});

// 3. POST /api/accounting/categories - Add or update a custom category
accountingCategoriesRouter.post('/', (req: Request, res: Response) => {
  const { id, name, classification, accountType, accountSubType, parentCategory, isSubCategory, description, code } = req.body;

  if (!name || !classification) {
    return res.status(400).json({ error: 'Name and classification are required' });
  }

  const newCategory: AccountingCategory = {
    id: id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name,
    code: code || undefined,
    classification: classification || 'Expense',
    accountType: accountType || 'Expense',
    accountSubType: accountSubType || 'OtherBusinessExpenses',
    parentCategory: parentCategory || undefined,
    isSubCategory: Boolean(isSubCategory),
    description: description || `Custom category for ${name}`,
  };

  const existingIndex = categoryStore.findIndex(c => c.id === newCategory.id);
  if (existingIndex >= 0) {
    categoryStore[existingIndex] = newCategory;
  } else {
    categoryStore.push(newCategory);
  }

  res.status(201).json({
    message: 'Accounting category saved successfully',
    category: newCategory,
    totalCategories: categoryStore.length,
  });
});

// 4. POST /api/accounting/categories/classify - Intelligent transaction memo classifier
accountingCategoriesRouter.post('/classify', (req: Request, res: Response) => {
  const { memo, vendor, amount } = req.body;
  const input = `${memo || ''} ${vendor || ''}`.toLowerCase().trim();

  if (!input) {
    return res.status(400).json({ error: 'Memo or vendor string required for classification' });
  }

  // Heuristic rule-based matching with fallback to keyword scoring
  const keywordsToCategory: Record<string, string> = {
    'uber': 'bfb9de41-beb2-4327-896a-fc98fd505810', // Taxis or shared rides
    'lyft': 'bfb9de41-beb2-4327-896a-fc98fd505810',
    'taxi': 'bfb9de41-beb2-4327-896a-fc98fd505810',
    'flight': '69aeb025-c3b7-4bed-9242-9dc8b18ad3d2', // Airfare
    'delta': '69aeb025-c3b7-4bed-9242-9dc8b18ad3d2',
    'american air': '69aeb025-c3b7-4bed-9242-9dc8b18ad3d2',
    'united air': '69aeb025-c3b7-4bed-9242-9dc8b18ad3d2',
    'hotel': 'c7a968e4-e55f-4309-ad08-2db6f7a94503', // Hotels
    'marriott': 'c7a968e4-e55f-4309-ad08-2db6f7a94503',
    'hilton': 'c7a968e4-e55f-4309-ad08-2db6f7a94503',
    'airbnb': 'c7a968e4-e55f-4309-ad08-2db6f7a94503',
    'aws': '476ac78f-29a2-4db6-bedc-ae7f3f6b5453', // Software & apps
    'github': '476ac78f-29a2-4db6-bedc-ae7f3f6b5453',
    'google cloud': '476ac78f-29a2-4db6-bedc-ae7f3f6b5453',
    'openai': '476ac78f-29a2-4db6-bedc-ae7f3f6b5453',
    'software': '476ac78f-29a2-4db6-bedc-ae7f3f6b5453',
    'gas': '8ad47174-591b-41c6-a5c6-be002d6e5081', // Vehicle gas & fuel
    'shell': '8ad47174-591b-41c6-a5c6-be002d6e5081',
    'chevron': '8ad47174-591b-41c6-a5c6-be002d6e5081',
    'exxon': '8ad47174-591b-41c6-a5c6-be002d6e5081',
    'dining': '7899a73a-7862-44dd-8830-bdafbe0df6f6', // Meals with clients
    'restaurant': '7899a73a-7862-44dd-8830-bdafbe0df6f6',
    'lunch': '7899a73a-7862-44dd-8830-bdafbe0df6f6',
    'dinner': '7899a73a-7862-44dd-8830-bdafbe0df6f6',
    'starbucks': '1240f2bc-e64b-437b-9338-ca7f2bcf3510', // Meals
    'office supplies': '1c0a473c-134f-426a-a14b-9871b4b3c2d7', // Office supplies
    'staples': '1c0a473c-134f-426a-a14b-9871b4b3c2d7',
    'fedex': '7cc85385-a5d5-41d0-8ca2-7f7886c2b7af', // Shipping & postage
    'ups': '7cc85385-a5d5-41d0-8ca2-7f7886c2b7af',
    'usps': '7cc85385-a5d5-41d0-8ca2-7f7886c2b7af',
    'postage': '7cc85385-a5d5-41d0-8ca2-7f7886c2b7af',
    'rent': 'e4683ef1-60fd-4b26-a63c-0f80617c2700', // Building & property rent
    'law': '58c9873c-2427-405e-972f-4c87546469a0', // Legal fees
    'legal': '58c9873c-2427-405e-972f-4c87546469a0',
    'attorney': '58c9873c-2427-405e-972f-4c87546469a0',
    'cpa': 'b9a58a87-2752-4e89-a0a1-941955c83495', // Accounting fees
    'accounting': 'b9a58a87-2752-4e89-a0a1-941955c83495',
    'audit': 'b9a58a87-2752-4e89-a0a1-941955c83495',
    'stripe fee': '8cb94739-14f1-43fc-8afa-fa5b1ba1703d', // Merchant account fees
    'paypal fee': '8cb94739-14f1-43fc-8afa-fa5b1ba1703d',
    'merchant fee': '8cb94739-14f1-43fc-8afa-fa5b1ba1703d',
    'advertising': '8dd7fe50-7e8f-466c-b414-75250f335d1d', // Advertising & marketing
    'facebook ads': '924af953-495d-4c86-8492-a79eba4ec990', // Social media
    'google ads': '8ba865a1-3525-4113-8a39-6336d819796d', // Website ads
    'insurance': 'd8b20c3a-53ca-443f-8b4a-a86553520a57', // Insurance
    'salary': '80b63e0a-2417-4e3b-9991-0822952269d7', // Wages
    'payroll': '59367170-7f90-402e-b9ce-81984a58416b', // Payroll expenses
  };

  let matchedCategoryId: string | null = null;
  let matchReason = '';

  for (const [kw, catId] of Object.entries(keywordsToCategory)) {
    if (input.includes(kw)) {
      matchedCategoryId = catId;
      matchReason = `Keyword match on "${kw}"`;
      break;
    }
  }

  // Fallback: search category names directly
  if (!matchedCategoryId) {
    const directMatch = categoryStore.find(c => input.includes(c.name.toLowerCase()));
    if (directMatch) {
      matchedCategoryId = directMatch.id;
      matchReason = `Direct name match on "${directMatch.name}"`;
    }
  }

  const defaultCategory = categoryStore.find(c => c.id === 'da4c7fbe-f702-4f29-95c2-9f4b8742b4c6')!; // Uncategorized Expense
  const finalCategory = (matchedCategoryId ? categoryStore.find(c => c.id === matchedCategoryId) : null) || defaultCategory;

  res.json({
    classified: true,
    category: finalCategory,
    confidence: matchedCategoryId ? 0.94 : 0.35,
    matchReason: matchReason || 'Defaulted to Uncategorized Expense',
    suggestedQboSyncPayload: {
      accountRef: {
        id: finalCategory.id,
        name: finalCategory.name,
        classification: finalCategory.classification,
        accountType: finalCategory.accountType,
      },
      amount: amount || 0,
      description: input,
    },
  });
});

// 5. POST /api/accounting/categories/sync-qbo - Synchronize all categories into QuickBooks chart of accounts
accountingCategoriesRouter.post('/sync-qbo', (req: Request, res: Response) => {
  const synced: any[] = [];

  categoryStore.forEach(cat => {
    const existing = mockStore.accounts.find((a: any) => a.Id === cat.id || a.Name === cat.name);
    if (!existing) {
      const qboAccount = {
        Id: cat.id,
        Name: cat.name,
        AccountType: cat.accountType,
        AccountSubType: cat.accountSubType,
        Classification: cat.classification,
        AcctNum: cat.code || '',
        Description: cat.description,
        Active: true,
        MetaData: {
          CreateTime: new Date().toISOString(),
          LastUpdatedTime: new Date().toISOString(),
        },
      };
      mockStore.accounts.push(qboAccount);
      synced.push(qboAccount);
    }
  });

  // Also log into bridge ledger
  recordBridgeEvent({
    source: 'UNIVERSAL_INGEST',
    action: 'BATCH_IMPORT',
    realmId: '9341453267972001',
    externalEntityId: `CATEGORIES_SYNC_${Date.now()}`,
    qboLinkedEntityType: 'Account',
    amount: categoryStore.length,
    currency: 'USD',
    summary: `Synchronized ${synced.length} Accounting Category IDs into QuickBooks Chart of Accounts`,
    rawPayload: { syncedCount: synced.length, totalCategories: categoryStore.length },
  });

  res.json({
    message: `Successfully synchronized ${synced.length} accounting categories into QuickBooks Chart of Accounts`,
    syncedCount: synced.length,
    totalQboAccounts: mockStore.accounts.length,
    sampleAccount: synced[0] || mockStore.accounts[0],
  });
});

// 6. GET /api/accounting/categories/export - Export format
accountingCategoriesRouter.get('/export/csv', (req: Request, res: Response) => {
  const headers = ['Category ID', 'Account Code', 'Category Name', 'Classification', 'Account Type', 'Account SubType', 'Parent Category', 'Is SubCategory', 'Description'];
  const rows = categoryStore.map(c => [
    `"${c.id}"`,
    `"${c.code || ''}"`,
    `"${c.name}"`,
    `"${c.classification}"`,
    `"${c.accountType}"`,
    `"${c.accountSubType || ''}"`,
    `"${c.parentCategory || ''}"`,
    c.isSubCategory ? 'TRUE' : 'FALSE',
    `"${c.description.replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="accounting_category_ids.csv"');
  res.send(csv);
});
