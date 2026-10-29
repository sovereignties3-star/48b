import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  KROGER_MASTER_CATALOG,
  KROGER_CHAINS,
  KROGER_DEPARTMENTS,
  KROGER_LOCATIONS,
  KROGER_DELETED_ITEMS,
  KrogerProductItem
} from './kroger-catalog-data';

export const krogerRouter = Router();

// In-memory token cache & state
let cachedToken: {
  access_token: string;
  token_type: string;
  expires_in: number;
  obtained_at: number;
} | null = null;

// Locker Order Tracking Store
const lockerOrdersStore: Record<string, any> = {
  '1030421485034392200': {
    orderId: '1030421485034392200',
    orderStatus: 'LOADED',
    locationId: '70400399',
    lockerDetails: {
      lockerId: 399,
      lockerAddress: { street: '6895 E Florence Ave', city: 'Bell Gardens', state: 'CA', zip: '90201' },
      assignedLockerDoors: ['L-101', 'L-102', 'L-103'],
      ambient: 1,
      chilled: 1,
      frozen: 2,
      deepFrozen: 0
    },
    orderAttributes: {
      hasAgeControlledItems: false,
      isManualDelivery: false,
      pickupByDateTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    },
    events: [
      { eventType: 'loadingStartTime', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { eventType: 'loadingEndTime', timestamp: new Date(Date.now() - 3000000).toISOString() }
    ]
  }
};

// Corporate Cart Store
let corporateCart: Array<{
  upc: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  size?: string;
  image?: string;
}> = [
  {
    upc: '0001111041700',
    description: 'Kroger 2% Reduced Fat Milk Jug',
    quantity: 2,
    price: 3.49,
    category: 'Dairy & Eggs',
    size: '1 gal',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500'
  },
  {
    upc: '0001111082697',
    description: 'Simple Truth Organic Cage-Free Grade A Large Brown Eggs',
    quantity: 2,
    price: 3.99,
    category: 'Dairy & Eggs',
    size: '12 ct carton',
    image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=500'
  },
  {
    upc: '0001111030001',
    description: 'Simple Truth Organic Honeycrisp Apples',
    quantity: 3,
    price: 3.99,
    category: 'Produce',
    size: '2 lb bag',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500'
  },
  {
    productId: '0001111091234',
    upc: '0001111091234',
    description: 'Private Selection Fresh Artisan Sourdough Loaf',
    quantity: 1,
    price: 4.00,
    category: 'Bakery',
    size: '24 oz loaf',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500'
  }
];

// Helper to get Kroger API credentials
const getKrogerCredentials = () => {
  const clientId = process.env.KROGER_CLIENT_ID || 'kronos-apex-retail-client-2026';
  const clientSecret = process.env.KROGER_CLIENT_SECRET || 'kroger-secret-key-998877';
  const baseUrl = process.env.KROGER_API_BASE_URL || 'https://api.kroger.com/v1';
  const base64Auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  return { clientId, clientSecret, baseUrl, base64Auth };
};

// ============================================================================
// 1. OAUTH2 TOKEN & TEST CALLS
// ============================================================================
krogerRouter.post('/oauth2/token', async (req: Request, res: Response) => {
  const { base64Auth } = getKrogerCredentials();
  const tokenPayload = {
    access_token: `kroger_live_${Buffer.from(Date.now().toString()).toString('base64')}_${Math.random().toString(36).substring(2, 10)}`,
    token_type: 'bearer',
    expires_in: 1800,
    scope: 'product.compact cart.basic:write profile.compact delivery:slots'
  };
  cachedToken = { ...tokenPayload, obtained_at: Date.now() };

  return res.json({
    success: true,
    mode: 'simulated_live_gateway',
    ...tokenPayload,
    meta: {
      authorization_scheme: `Basic ${base64Auth.substring(0, 10)}...`,
      endpoint: 'https://api.kroger.com/v1/connect/oauth2/token',
      grant_type: 'client_credentials',
      server_timestamp: new Date().toISOString()
    }
  });
});

krogerRouter.post('/test-call', async (req: Request, res: Response) => {
  const { base64Auth } = getKrogerCredentials();
  const token = cachedToken?.access_token || `kroger_tok_${Math.random().toString(36).substring(2, 12)}`;
  res.json({
    success: true,
    status: 'CONNECTED',
    message: 'Kroger API Authorization test call verified successfully.',
    curlCommand: `curl -X POST 'https://api.kroger.com/v1/connect/oauth2/token' \\\n  -H 'Content-Type: application/x-www-form-urlencoded' \\\n  -H 'Authorization: Basic ${base64Auth}' \\\n  -d 'grant_type=client_credentials'`,
    authHeader: `Basic ${base64Auth}`,
    tokenSample: { access_token: token, token_type: 'bearer', expires_in: 1800 },
    verifiedAt: new Date().toISOString()
  });
});

// ============================================================================
// 2. MASTER PRODUCTS CATALOG (Pulls ALL Items or Filters by Term/Dept)
// ============================================================================
const filterProducts = (query: any) => {
  const rawTerm = query.term || query['filter.term'] || '';
  const term = typeof rawTerm === 'string' ? rawTerm.trim().toLowerCase() : '';
  const brand = (query.brand || query['filter.brand'] || '').toString().toLowerCase();
  const department = (query.department || query['filter.department'] || '').toString().toLowerCase();
  const fulfillment = (query.fulfillment || query['filter.locations.fulfillment.eq'] || '').toString().toUpperCase();
  const upcsIn = (query['filter.upc.in'] || '').toString();
  const upcList = upcsIn ? upcsIn.split(',').map((u: string) => u.trim()) : [];

  let list = KROGER_MASTER_CATALOG;

  if (upcList.length > 0) {
    list = list.filter(p => upcList.includes(p.upc));
  }

  if (term) {
    list = list.filter(p =>
      p.description.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.categories.some(c => c.toLowerCase().includes(term)) ||
      p.department.toLowerCase().includes(term)
    );
  }

  if (brand) {
    list = list.filter(p => p.brand.toLowerCase().includes(brand));
  }

  if (department && department !== 'all') {
    list = list.filter(p =>
      p.department.toLowerCase().includes(department) ||
      p.categories.some(c => c.toLowerCase().includes(department))
    );
  }

  if (fulfillment) {
    if (fulfillment === 'DELIVERY') list = list.filter(p => p.fulfillment.delivery);
    else if (fulfillment === 'SHIP') list = list.filter(p => p.fulfillment.shiptohome);
    else if (fulfillment === 'PICKUP') list = list.filter(p => p.fulfillment.curbside);
    else if (fulfillment === 'INSTORE') list = list.filter(p => p.fulfillment.instore);
  }

  return list;
};

// GET /api/kroger/products and GET /products
krogerRouter.get(['/products', '/products/products'], (req: Request, res: Response) => {
  const filtered = filterProducts(req.query);
  const offset = parseInt((req.query['page.offset'] || req.query.start || '0') as string, 10);
  const size = parseInt((req.query['page.size'] || req.query.limit || '100') as string, 10);
  const paginated = filtered.slice(offset, offset + size);

  const formatted = paginated.map((p: any) => ({
    ...p,
    items: p.items || [{
      itemId: p.productId,
      price: p.price,
      size: p.size,
      soldBy: p.soldBy || 'Unit',
      fulfillment: p.fulfillment || { instore: true, delivery: true, curbside: true, shiptohome: false },
      inventory: p.inventory || { stockLevel: 'HIGH', quantityOnHand: 50 }
    }]
  }));

  res.json({
    data: formatted,
    meta: {
      pagination: {
        total: filtered.length,
        size,
        offset,
        catalogTotal: KROGER_MASTER_CATALOG.length
      },
      filter: {
        term: req.query.term || req.query['filter.term'] || 'ALL',
        department: req.query.department || req.query['filter.department'] || 'ALL',
        locationId: req.query.locationId || req.query['filter.locationId'] || '01400943'
      }
    }
  });
});

krogerRouter.get('/products/:id', (req: Request, res: Response) => {
  const product = KROGER_MASTER_CATALOG.find(p => p.productId === req.params.id || p.upc === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found', productId: req.params.id });
  }
  const formatted = {
    ...product,
    items: (product as any).items || [{
      itemId: product.productId,
      price: product.price,
      size: product.size,
      soldBy: product.soldBy || 'Unit',
      fulfillment: product.fulfillment || { instore: true, delivery: true, curbside: true, shiptohome: false },
      inventory: product.inventory || { stockLevel: 'HIGH', quantityOnHand: 50 }
    }]
  };
  res.json({ data: formatted });
});

// ============================================================================
// 3. CATALOG API V2 (1.5.5) - Catalog Search, Inventory & Deleted Items
// ============================================================================
// GET /catalog/v2/products
krogerRouter.get('/catalog/v2/products', (req: Request, res: Response) => {
  const filtered = filterProducts(req.query);
  const offset = parseInt((req.query['page.offset'] || '0') as string, 10);
  const size = Math.min(parseInt((req.query['page.size'] || '20') as string, 10), 50);
  const paginated = filtered.slice(offset, offset + size);

  res.json({
    data: paginated,
    meta: {
      page: {
        total: filtered.length,
        offset,
        size
      }
    }
  });
});

// GET /catalog/v2/products-inventory
krogerRouter.get('/catalog/v2/products-inventory', (req: Request, res: Response) => {
  const filtered = filterProducts(req.query);
  const offset = parseInt((req.query['page.offset'] || '0') as string, 10);
  const size = Math.min(parseInt((req.query['page.size'] || '20') as string, 10), 50);
  const paginated = filtered.slice(offset, offset + size);

  const inventoryData = paginated.map(p => ({
    productId: p.productId,
    upc: p.upc,
    description: p.description,
    brand: p.brand,
    inventory: {
      stockLevel: p.inventory.stockLevel,
      quantityOnHand: p.inventory.quantityOnHand,
      aisle: p.inventory.aisle,
      bay: p.inventory.bay,
      stockLevelUpdatedAt: p.inventory.stockLevelUpdatedAt,
      fulfillmentUpdatedAt: new Date().toISOString()
    },
    fulfillment: p.fulfillment,
    price: p.price,
    activePromotions: p.price.promo < p.price.regular ? [{
      promoType: 'Kroger Digital Coupon / Savings',
      discountAmount: +(p.price.regular - p.price.promo).toFixed(2),
      effectiveUntil: '2026-12-31T23:59:59Z'
    }] : []
  }));

  res.json({
    data: inventoryData,
    meta: {
      page: {
        total: filtered.length,
        offset,
        size
      }
    }
  });
});

// GET /catalog/v2/deleted-items
krogerRouter.get('/catalog/v2/deleted-items', (req: Request, res: Response) => {
  res.json({
    data: KROGER_DELETED_ITEMS
  });
});

// ============================================================================
// 4. LOCKER INTEGRATION APIS - PARTNER FACING (0.2.0)
// ============================================================================
// POST /unattended-pickup/v1/locker/order-events
krogerRouter.post('/unattended-pickup/v1/locker/order-events', (req: Request, res: Response) => {
  const correlationId = req.headers['x-correlation-id'] || `corr_${uuidv4()}`;
  const idempotencyKey = req.headers['idempotency-key'] || uuidv4();
  const { orderId, orderStatus, locationId, events = [], details = [] } = req.body;

  if (!orderId || !orderStatus) {
    return res.status(400).json({ error: 'orderId and orderStatus (LOADED, COLLECTION, REMOVED) are required' });
  }

  if (!lockerOrdersStore[orderId]) {
    lockerOrdersStore[orderId] = {
      orderId,
      orderStatus,
      locationId: locationId || '70400399',
      events: [],
      details: []
    };
  }

  lockerOrdersStore[orderId].orderStatus = orderStatus;
  if (!lockerOrdersStore[orderId].events) lockerOrdersStore[orderId].events = [];
  if (!lockerOrdersStore[orderId].details) lockerOrdersStore[orderId].details = [];
  if (Array.isArray(events) && events.length > 0) lockerOrdersStore[orderId].events.push(...events);
  if (Array.isArray(details) && details.length > 0) lockerOrdersStore[orderId].details.push(...details);
  lockerOrdersStore[orderId].lastUpdated = new Date().toISOString();

  res.status(201).json({
    data: {
      message: 'Success',
      orderId,
      orderStatus,
      correlationId,
      idempotencyKey,
      timestamp: new Date().toISOString()
    }
  });
});

// POST /unattended-pickup/v1/locker/order-details
krogerRouter.post('/unattended-pickup/v1/locker/order-details', (req: Request, res: Response) => {
  const correlationId = req.headers['x-correlation-id'] || `corr_${uuidv4()}`;
  const { orderId, orderAttributes, lockerDetails } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  if (!lockerOrdersStore[orderId]) {
    lockerOrdersStore[orderId] = { orderId, events: [], details: [] };
  }

  if (orderAttributes) lockerOrdersStore[orderId].orderAttributes = orderAttributes;
  if (lockerDetails) lockerOrdersStore[orderId].lockerDetails = lockerDetails;

  res.status(201).json({
    data: {
      message: 'Success',
      orderId,
      correlationId,
      lockerConfirmed: true,
      timestamp: new Date().toISOString()
    }
  });
});

// GET /unattended-pickup/v1/locker/orders (helper to inspect locker orders in console)
krogerRouter.get('/unattended-pickup/v1/locker/orders', (req: Request, res: Response) => {
  res.json({ data: Object.values(lockerOrdersStore) });
});

// ============================================================================
// 5. IDENTITY API (1.2.3) - Profile & Customer Data
// ============================================================================
krogerRouter.get(['/v1/identity/profile', '/identity/profile'], (req: Request, res: Response) => {
  res.json({
    data: {
      id: '53990804-cfd1-43f3-8256-bdc9817a4fd0',
      fullName: "James Burvelo O'Callaghan III",
      email: 'sovereignties3@gmail.com',
      loyaltyCardNumber: '4291882001928',
      preferredStoreLocationId: '01400943',
      tier: 'Citibank Sovereign Platinum Rewards',
      fuelPoints: 1250,
      digitalCouponsClipped: 24,
      accountStatus: 'ACTIVE_VERIFIED'
    },
    meta: {
      pagination: {},
      warnings: []
    }
  });
});

// ============================================================================
// 6. LOCATION API (1.2.3) - Locations, Chains & Departments
// ============================================================================
// GET /v1/locations
krogerRouter.get(['/v1/locations', '/locations'], (req: Request, res: Response) => {
  const chainFilter = (req.query['filter.chain'] || req.query.chain || '').toString().toUpperCase();
  const zipFilter = (req.query['filter.zipCode.near'] || req.query.zipCode || '').toString();
  const limit = parseInt((req.query['filter.limit'] || req.query.limit || '10') as string, 10);

  let results = KROGER_LOCATIONS;
  if (chainFilter) {
    results = results.filter(l => l.chain.toUpperCase().includes(chainFilter));
  }
  if (zipFilter) {
    results = results.filter(l => l.address.zipCode.startsWith(zipFilter.substring(0, 3)));
  }

  res.json({
    data: results.slice(0, limit),
    meta: {
      pagination: { total: results.length, limit },
      warnings: []
    }
  });
});

// GET & HEAD /v1/locations/:locationId
krogerRouter.get(['/v1/locations/:locationId', '/locations/:locationId'], (req: Request, res: Response) => {
  const loc = KROGER_LOCATIONS.find(l => l.locationId === req.params.locationId);
  if (!loc) {
    return res.status(404).json({ error: 'Location not found', locationId: req.params.locationId });
  }
  res.json({ data: loc, meta: { pagination: {}, warnings: [] } });
});

krogerRouter.head(['/v1/locations/:locationId', '/locations/:locationId'], (req: Request, res: Response) => {
  const loc = KROGER_LOCATIONS.find(l => l.locationId === req.params.locationId);
  if (!loc) return res.status(404).end();
  res.status(204).end();
});

// GET /v1/chains & /v1/chains/:name
krogerRouter.get(['/v1/chains', '/chains'], (req: Request, res: Response) => {
  res.json({ data: KROGER_CHAINS, meta: { total: KROGER_CHAINS.length, warnings: [] } });
});

krogerRouter.get(['/v1/chains/:name', '/chains/:name'], (req: Request, res: Response) => {
  const chainName = req.params.name.toUpperCase();
  const chain = KROGER_CHAINS.find(c => c.name === chainName || c.friendlyBannerName.toUpperCase() === chainName);
  if (!chain) {
    return res.status(404).json({ error: 'Chain not found', name: req.params.name });
  }
  res.json({
    data: {
      ...chain,
      defaultTitle: chain.friendlyBannerName,
      titleExtension: 'Fresh Food. Low Prices. | Shop Groceries Online',
      appleAppId: 'app-id=584405207',
      googleAppId: 'app-id=com.kroger.mobile',
      description: `Shop low prices on groceries & choose pickup or delivery at ${chain.friendlyBannerName}.`
    },
    meta: {}
  });
});

krogerRouter.head(['/v1/chains/:name', '/chains/:name'], (req: Request, res: Response) => {
  const chainName = req.params.name.toUpperCase();
  const chain = KROGER_CHAINS.find(c => c.name === chainName || c.friendlyBannerName.toUpperCase() === chainName);
  if (!chain) return res.status(404).end();
  res.status(204).end();
});

// GET /v1/departments & /v1/departments/:id
krogerRouter.get(['/v1/departments', '/departments'], (req: Request, res: Response) => {
  res.json({ data: KROGER_DEPARTMENTS, meta: { total: KROGER_DEPARTMENTS.length, warnings: [] } });
});

krogerRouter.get(['/v1/departments/:id', '/departments/:id'], (req: Request, res: Response) => {
  const dept = KROGER_DEPARTMENTS.find(d => d.departmentId === req.params.id);
  if (!dept) {
    return res.status(404).json({ error: 'Department not found', id: req.params.id });
  }
  res.json({ data: dept, meta: {} });
});

krogerRouter.head(['/v1/departments/:id', '/departments/:id'], (req: Request, res: Response) => {
  const dept = KROGER_DEPARTMENTS.find(d => d.departmentId === req.params.id);
  if (!dept) return res.status(404).end();
  res.status(204).end();
});

// ============================================================================
// 7. SEAMLESS DELIVERY API (1.2.1) - Eligibilities, Slots, Reservations, Orders
// ============================================================================
// POST /v1/eligibilities
krogerRouter.post(['/v1/eligibilities', '/eligibilities'], (req: Request, res: Response) => {
  const { modality = 'DELIVERY', location } = req.body;
  res.status(200).json({
    data: {
      eligibilities: [
        {
          storeId: '01400943',
          banner: 'KROGER',
          modality,
          isEligible: true,
          distanceMiles: 1.4,
          estimatedTransitMinutes: 18,
          carrier: 'Kroger Delivery Fleet / Ocado CFC'
        },
        {
          storeId: '01400812',
          banner: 'KROGER',
          modality,
          isEligible: true,
          distanceMiles: 3.8,
          estimatedTransitMinutes: 28,
          carrier: 'Instacart Partner Delivery'
        }
      ]
    }
  });
});

// POST /v1/slots
krogerRouter.post(['/v1/slots', '/slots'], (req: Request, res: Response) => {
  const today = new Date();
  const generateSlots = () => {
    const slots = [];
    for (let day = 0; day < 3; day++) {
      const d = new Date(today);
      d.setDate(d.getDate() + day);
      const dateStr = d.toISOString().split('T')[0];
      slots.push({
        slotId: `slot_${dateStr}_0911`,
        date: dateStr,
        startTime: `${dateStr}T09:00:00Z`,
        endTime: `${dateStr}T11:00:00Z`,
        windowDisplay: `${day === 0 ? 'Today' : day === 1 ? 'Tomorrow' : dateStr} 9:00 AM - 11:00 AM`,
        fee: day === 0 ? 9.95 : 6.95,
        available: true,
        cutoffTime: `${dateStr}T07:00:00Z`
      });
      slots.push({
        slotId: `slot_${dateStr}_1416`,
        date: dateStr,
        startTime: `${dateStr}T14:00:00Z`,
        endTime: `${dateStr}T16:00:00Z`,
        windowDisplay: `${day === 0 ? 'Today' : day === 1 ? 'Tomorrow' : dateStr} 2:00 PM - 4:00 PM`,
        fee: 6.95,
        available: true,
        cutoffTime: `${dateStr}T12:00:00Z`
      });
      slots.push({
        slotId: `slot_${dateStr}_1820`,
        date: dateStr,
        startTime: `${dateStr}T18:00:00Z`,
        endTime: `${dateStr}T20:00:00Z`,
        windowDisplay: `${day === 0 ? 'Today' : day === 1 ? 'Tomorrow' : dateStr} 6:00 PM - 8:00 PM`,
        fee: 7.95,
        available: true,
        cutoffTime: `${dateStr}T16:00:00Z`
      });
    }
    return slots;
  };

  res.status(200).json({
    data: {
      slots: generateSlots()
    }
  });
});

// POST /v1/reservations
krogerRouter.post(['/v1/reservations', '/reservations'], (req: Request, res: Response) => {
  const { slot, storeId = '01400943', modality = 'DELIVERY' } = req.body;
  const reservationId = `res_${uuidv4().substring(0, 8)}`;
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  res.status(200).json({
    data: {
      reservations: {
        reservationId,
        storeId,
        modality,
        slot: slot || { slotId: 'slot_selected_01', windowDisplay: 'Today 2:00 PM - 4:00 PM' },
        expiresAt,
        status: 'CONFIRMED'
      }
    }
  });
});

// POST /v1/order-update-validation
krogerRouter.post(['/v1/order-update-validation', '/order-update-validation'], (req: Request, res: Response) => {
  const { cart, storeId = '01400943', modality = 'DELIVERY' } = req.body;
  res.status(201).json({
    data: {
      orderUpdateValidation: {
        isValid: true,
        storeId,
        modality,
        itemsCount: cart?.count || corporateCart.length,
        estimatedTotal: cart?.total || corporateCart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2),
        validationTimestamp: new Date().toISOString(),
        message: 'Order update validated successfully against store stock.'
      }
    }
  });
});

// ============================================================================
// 8. CART APIS
// ============================================================================
krogerRouter.get('/cart', (req: Request, res: Response) => {
  const subtotal = corporateCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  res.json({
    data: {
      cartId: 'corp_cart_kroger_8829',
      itemCount: corporateCart.reduce((sum, item) => sum + item.quantity, 0),
      items: corporateCart,
      subtotal: +subtotal.toFixed(2),
      estimatedTax: tax,
      estimatedTotal: total,
      currency: 'USD',
      status: 'OPEN'
    }
  });
});

krogerRouter.put(['/cart/add', '/cart'], (req: Request, res: Response) => {
  const { upc, description, quantity = 1, price, category = 'General', size, image } = req.body;
  if (!upc) {
    return res.status(400).json({ error: 'UPC code is required' });
  }

  const existing = corporateCart.find(i => i.upc === upc);
  if (existing) {
    existing.quantity += quantity;
  } else {
    const catalogItem = KROGER_MASTER_CATALOG.find(p => p.upc === upc);
    corporateCart.push({
      upc,
      description: description || catalogItem?.description || `Product ${upc}`,
      quantity,
      price: price || catalogItem?.price?.promo || catalogItem?.price?.regular || 3.99,
      category: category || catalogItem?.categories?.[0] || 'Grocery',
      size: size || catalogItem?.size || '1 unit',
      image: image || catalogItem?.images?.[0]?.sizes?.[0]?.url || 'https://via.placeholder.com/150'
    });
  }

  const subtotal = corporateCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({
    success: true,
    message: `Item added to Kroger cart`,
    cart: {
      items: corporateCart,
      itemCount: corporateCart.reduce((s, i) => s + i.quantity, 0),
      subtotal: +subtotal.toFixed(2)
    }
  });
});

krogerRouter.delete('/cart/clear', (req: Request, res: Response) => {
  corporateCart = [];
  res.json({ success: true, message: 'Cart cleared' });
});
