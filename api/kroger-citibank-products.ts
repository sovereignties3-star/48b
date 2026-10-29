import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { KROGER_MASTER_CATALOG } from './kroger-catalog-data';

export const krogerCitibankProductRouter = Router();

/**
 * GET /api/kroger/products or /api/kroger/products/products
 * Pulls all products or filters by term/brand/department/location
 */
krogerCitibankProductRouter.get(['/', '/products'], (req: Request, res: Response) => {
  const correlationId = `kroger-proxy-${uuidv4()}`;
  const rawTerm = req.query['filter.term'] || req.query.term || '';
  const term = typeof rawTerm === 'string' ? rawTerm.trim().toLowerCase() : '';
  const brand = (req.query['filter.brand'] || req.query.brand || '').toString().toLowerCase();
  const department = (req.query['filter.department'] || req.query.department || '').toString().toLowerCase();
  const locationId = (req.query['filter.locationId'] || req.query.locationId || '01400943').toString();
  const limit = parseInt((req.query['filter.limit'] || req.query.limit || '100') as string, 10);
  const start = parseInt((req.query['filter.start'] || req.query.start || '0') as string, 10);

  let filtered = KROGER_MASTER_CATALOG;

  if (term) {
    filtered = filtered.filter(p =>
      p.description.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.categories.some(c => c.toLowerCase().includes(term)) ||
      p.department.toLowerCase().includes(term)
    );
  }

  if (brand) {
    filtered = filtered.filter(p => p.brand.toLowerCase().includes(brand));
  }

  if (department && department !== 'all') {
    filtered = filtered.filter(p =>
      p.department.toLowerCase().includes(department) ||
      p.categories.some(c => c.toLowerCase().includes(department))
    );
  }

  const paginated = filtered.slice(start, start + limit);

  // Map to Kroger API schema items
  const responseData = paginated.map(p => ({
    productId: p.productId,
    upc: p.upc,
    brand: p.brand,
    categories: p.categories,
    department: p.department,
    description: p.description,
    images: p.images,
    items: [{
      itemId: p.productId,
      price: p.price,
      size: p.size,
      soldBy: p.soldBy,
      fulfillment: p.fulfillment,
      inventory: p.inventory
    }]
  }));

  return res.status(200).json({
    data: responseData,
    meta: {
      pagination: {
        total: filtered.length,
        limit,
        start,
        catalogTotal: KROGER_MASTER_CATALOG.length
      },
      filter: {
        term: term || 'ALL',
        department: department || 'ALL',
        locationId
      },
      correlationId
    }
  });
});

/**
 * GET /api/kroger/products/:id or /products/products/:id
 */
krogerCitibankProductRouter.get(['/:id', '/products/:id'], (req: Request, res: Response) => {
  const correlationId = `kroger-proxy-${uuidv4()}`;
  const productId = req.params.id;
  const p = KROGER_MASTER_CATALOG.find(item => item.productId === productId || item.upc === productId);

  if (!p) {
    return res.status(404).json({ error: 'Product not found', productId, correlationId });
  }

  return res.status(200).json({
    data: {
      productId: p.productId,
      upc: p.upc,
      brand: p.brand,
      categories: p.categories,
      department: p.department,
      description: p.description,
      images: p.images,
      items: [{
        itemId: p.productId,
        price: p.price,
        size: p.size,
        soldBy: p.soldBy,
        fulfillment: p.fulfillment,
        inventory: p.inventory
      }]
    },
    meta: { correlationId }
  });
});
