export interface KrogerProductItem {
  productId: string;
  upc: string;
  brand: string;
  categories: string[];
  description: string;
  department: string;
  price: {
    regular: number;
    promo: number;
  };
  size: string;
  soldBy: string;
  images: {
    perspective: string;
    sizes: {
      size: string;
      url: string;
    }[];
  }[];
  fulfillment: {
    curbside: boolean;
    delivery: boolean;
    instore: boolean;
    shiptohome: boolean;
  };
  inventory: {
    stockLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'OUT_OF_STOCK';
    aisle?: string;
    bay?: string;
    quantityOnHand: number;
    stockLevelUpdatedAt: string;
  };
  nutrition?: {
    calories?: number;
    fat?: string;
    carbs?: string;
    protein?: string;
  };
}

export const KROGER_MASTER_CATALOG: KrogerProductItem[] = [
  // --- PRODUCE ---
  {
    productId: '0001111030001',
    upc: '0001111030001',
    brand: 'Simple Truth Organic',
    categories: ['Produce', 'Fruit', 'Apples'],
    department: 'Produce',
    description: 'Simple Truth Organic Honeycrisp Apples',
    price: { regular: 4.99, promo: 3.99 },
    size: '2 lb bag',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [
        { size: 'medium', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500' },
        { size: 'large', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800' }
      ]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Produce Aisle 1', bay: 'A-12', quantityOnHand: 48, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111030002',
    upc: '0001111030002',
    brand: 'Kroger',
    categories: ['Produce', 'Fruit', 'Bananas'],
    department: 'Produce',
    description: 'Fresh Organic Yellow Bananas Bunch',
    price: { regular: 1.99, promo: 1.69 },
    size: '1 bunch (~3 lb)',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Produce Center', bay: 'B-04', quantityOnHand: 110, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111030003',
    upc: '0001111030003',
    brand: 'Kroger',
    categories: ['Produce', 'Fruit', 'Avocados'],
    department: 'Produce',
    description: 'Fresh Hass Avocados 4-Pack Bag',
    price: { regular: 3.99, promo: 3.49 },
    size: '4 ct bag',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Produce Aisle 2', bay: 'A-08', quantityOnHand: 65, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111030004',
    upc: '0001111030004',
    brand: 'Simple Truth Organic',
    categories: ['Produce', 'Packaged Salad', 'Spinach'],
    department: 'Produce',
    description: 'Simple Truth Organic Baby Spinach Washed & Ready',
    price: { regular: 3.49, promo: 2.99 },
    size: '5 oz tub',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Produce Chilled Wall', bay: 'C-02', quantityOnHand: 34, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111030005',
    upc: '0001111030005',
    brand: 'Kroger',
    categories: ['Produce', 'Vegetables', 'Tomatoes'],
    department: 'Produce',
    description: 'Fresh Roma Tomatoes Vine Ripe',
    price: { regular: 2.49, promo: 1.99 },
    size: '1.5 lb bag',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Produce Aisle 2', bay: 'B-03', quantityOnHand: 80, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111030006',
    upc: '0001111030006',
    brand: 'Driscoll\'s',
    categories: ['Produce', 'Fruit', 'Berries', 'Strawberries'],
    department: 'Produce',
    description: 'Driscoll\'s Fresh Sweet Strawberries Clamshell',
    price: { regular: 4.49, promo: 3.49 },
    size: '16 oz (1 lb)',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Produce Berry Island', bay: 'D-01', quantityOnHand: 52, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111030007',
    upc: '0001111030007',
    brand: 'Kroger',
    categories: ['Produce', 'Fruit', 'Citrus', 'Oranges'],
    department: 'Produce',
    description: 'Kroger California Seedless Navel Oranges',
    price: { regular: 5.99, promo: 4.99 },
    size: '4 lb bag',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Produce Aisle 1', bay: 'A-04', quantityOnHand: 40, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111030008',
    upc: '0001111030008',
    brand: 'Simple Truth Organic',
    categories: ['Produce', 'Fruit', 'Berries', 'Blueberries'],
    department: 'Produce',
    description: 'Simple Truth Organic Fresh Blueberries',
    price: { regular: 4.99, promo: 3.99 },
    size: '1 pt (11 oz)',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Produce Berry Island', bay: 'D-02', quantityOnHand: 38, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111030009',
    upc: '0001111030009',
    brand: 'Kroger',
    categories: ['Produce', 'Vegetables', 'Carrots'],
    department: 'Produce',
    description: 'Kroger Peeled Baby Cut Carrots Bag',
    price: { regular: 1.79, promo: 1.49 },
    size: '16 oz (1 lb)',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Produce Aisle 3', bay: 'C-08', quantityOnHand: 90, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111030010',
    upc: '0001111030010',
    brand: 'Kroger',
    categories: ['Produce', 'Vegetables', 'Broccoli'],
    department: 'Produce',
    description: 'Fresh Crisp Broccoli Crowns',
    price: { regular: 2.29, promo: 1.99 },
    size: '1 bunch (~1.5 lb)',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Produce Aisle 3', bay: 'C-04', quantityOnHand: 44, stockLevelUpdatedAt: new Date().toISOString() }
  },

  // --- DAIRY & EGGS ---
  {
    productId: '0001111041700',
    upc: '0001111041700',
    brand: 'Kroger',
    categories: ['Dairy & Eggs', 'Milk'],
    department: 'Dairy',
    description: 'Kroger 2% Reduced Fat Milk Jug (Grade A Vitamin A & D)',
    price: { regular: 3.99, promo: 3.49 },
    size: '1 gal',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Dairy Wall', bay: 'D-01', quantityOnHand: 140, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050888',
    upc: '0001111050888',
    brand: 'Simple Truth Organic',
    categories: ['Dairy & Eggs', 'Milk'],
    department: 'Dairy',
    description: 'Simple Truth Organic Whole Milk Vitamin D Jug',
    price: { regular: 4.89, promo: 4.39 },
    size: '1 gal',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Dairy Wall', bay: 'D-02', quantityOnHand: 72, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111082697',
    upc: '0001111082697',
    brand: 'Simple Truth Organic',
    categories: ['Dairy & Eggs', 'Eggs'],
    department: 'Dairy',
    description: 'Simple Truth Organic Cage-Free Grade A Large Brown Eggs',
    price: { regular: 4.29, promo: 3.99 },
    size: '12 ct carton',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Dairy Wall', bay: 'D-05', quantityOnHand: 95, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111082698',
    upc: '0001111082698',
    brand: 'Kroger',
    categories: ['Dairy & Eggs', 'Eggs'],
    department: 'Dairy',
    description: 'Kroger Grade A Large White Eggs 18 Count',
    price: { regular: 4.99, promo: 4.49 },
    size: '18 ct carton',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Dairy Wall', bay: 'D-06', quantityOnHand: 84, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050889',
    upc: '0001111050889',
    brand: 'Kroger',
    categories: ['Dairy & Eggs', 'Butter'],
    department: 'Dairy',
    description: 'Kroger Sweet Cream Salted Butter 4 Quarters',
    price: { regular: 4.49, promo: 3.99 },
    size: '16 oz (1 lb)',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Dairy Aisle 1', bay: 'B-02', quantityOnHand: 60, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050890',
    upc: '0001111050890',
    brand: 'Kroger',
    categories: ['Dairy & Eggs', 'Cheese', 'Shredded Cheese'],
    department: 'Dairy',
    description: 'Kroger Finely Shredded Sharp Cheddar Cheese',
    price: { regular: 2.99, promo: 2.49 },
    size: '8 oz bag',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Dairy Aisle 2', bay: 'C-01', quantityOnHand: 78, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050891',
    upc: '0001111050891',
    brand: 'Chobani',
    categories: ['Dairy & Eggs', 'Yogurt', 'Greek Yogurt'],
    department: 'Dairy',
    description: 'Chobani Plain Non-Fat Greek Yogurt Tub',
    price: { regular: 5.99, promo: 5.29 },
    size: '32 oz tub',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Dairy Aisle 2', bay: 'D-04', quantityOnHand: 42, stockLevelUpdatedAt: new Date().toISOString() }
  },

  // --- BAKERY ---
  {
    productId: '0001111091234',
    upc: '0001111091234',
    brand: 'Private Selection',
    categories: ['Bakery', 'Bread', 'Artisan Bread'],
    department: 'Bakery',
    description: 'Private Selection Fresh Artisan Sourdough Loaf',
    price: { regular: 4.50, promo: 4.00 },
    size: '24 oz loaf',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Bakery Counter', bay: 'BK-01', quantityOnHand: 25, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111091235',
    upc: '0001111091235',
    brand: 'Private Selection',
    categories: ['Bakery', 'Pastries', 'Croissants'],
    department: 'Bakery',
    description: 'Private Selection All Butter Flaky French Croissants',
    price: { regular: 4.99, promo: 4.49 },
    size: '4 ct box',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Bakery Table', bay: 'BK-04', quantityOnHand: 30, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111091236',
    upc: '0001111091236',
    brand: 'Kroger',
    categories: ['Bakery', 'Bread', 'Sandwich Bread'],
    department: 'Bakery',
    description: 'Kroger 100% Whole Wheat Sliced Sandwich Bread',
    price: { regular: 2.29, promo: 1.89 },
    size: '20 oz loaf',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Bread Aisle 7', bay: 'A-01', quantityOnHand: 85, stockLevelUpdatedAt: new Date().toISOString() }
  },

  // --- MEAT & SEAFOOD ---
  {
    productId: '0001111077771',
    upc: '0001111077771',
    brand: 'Kroger',
    categories: ['Meat & Seafood', 'Poultry', 'Chicken'],
    department: 'Meat',
    description: 'Boneless Skinless Chicken Breasts Value Pack (All Natural)',
    price: { regular: 9.99, promo: 8.99 },
    size: '2.5 lb pack (~$3.60/lb)',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Meat Case 1', bay: 'M-02', quantityOnHand: 45, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111077772',
    upc: '0001111077772',
    brand: 'Kroger',
    categories: ['Meat & Seafood', 'Seafood', 'Salmon'],
    department: 'Meat',
    description: 'Fresh Wild-Caught Atlantic Salmon Fillet Portion',
    price: { regular: 12.99, promo: 11.49 },
    size: '1 lb fillet',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'MEDIUM', aisle: 'Seafood Counter', bay: 'SF-01', quantityOnHand: 18, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111077777',
    upc: '0001111077777',
    brand: 'Kroger',
    categories: ['Meat & Seafood', 'Beef', 'Steak'],
    department: 'Meat',
    description: 'Choice Beef Hand-Cut Ribeye Steak USDA Inspected',
    price: { regular: 18.99, promo: 15.99 },
    size: '1 lb cut (~16 oz)',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Meat Case 2', bay: 'M-05', quantityOnHand: 22, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111077778',
    upc: '0001111077778',
    brand: 'Kroger',
    categories: ['Meat & Seafood', 'Beef', 'Ground Beef'],
    department: 'Meat',
    description: 'Ground Beef 80% Lean 20% Fat Fresh Roll',
    price: { regular: 5.49, promo: 4.79 },
    size: '1 lb roll',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Meat Case 2', bay: 'M-08', quantityOnHand: 55, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111077779',
    upc: '0001111077779',
    brand: 'Private Selection',
    categories: ['Meat & Seafood', 'Pork', 'Bacon'],
    department: 'Meat',
    description: 'Private Selection Thick Cut Applewood Smoked Bacon',
    price: { regular: 6.99, promo: 5.99 },
    size: '16 oz (1 lb)',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Meat Case 3', bay: 'M-12', quantityOnHand: 40, stockLevelUpdatedAt: new Date().toISOString() }
  },

  // --- PANTRY & STAPLES ---
  {
    productId: '0001111050011',
    upc: '0001111050011',
    brand: 'Simple Truth Organic',
    categories: ['Pantry', 'Pasta', 'Italian'],
    department: 'Grocery',
    description: 'Simple Truth Organic Spaghetti Pasta Italian Semolina',
    price: { regular: 1.99, promo: 1.79 },
    size: '16 oz box',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Aisle 4', bay: 'P-03', quantityOnHand: 120, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050012',
    upc: '0001111050012',
    brand: 'Private Selection',
    categories: ['Pantry', 'Pasta Sauce', 'Sauces'],
    department: 'Grocery',
    description: 'Private Selection Sweet Basil Marinara Pasta Sauce',
    price: { regular: 3.49, promo: 2.99 },
    size: '24 oz jar',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1621961404018-8199024bd104?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Aisle 4', bay: 'P-05', quantityOnHand: 65, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050013',
    upc: '0001111050013',
    brand: 'Private Selection',
    categories: ['Pantry', 'Oils & Vinegars', 'Olive Oil'],
    department: 'Grocery',
    description: 'Private Selection Cold Pressed Extra Virgin Olive Oil',
    price: { regular: 9.99, promo: 8.99 },
    size: '16.9 fl oz glass bottle',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Aisle 4', bay: 'P-12', quantityOnHand: 48, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050014',
    upc: '0001111050014',
    brand: 'Kroger',
    categories: ['Pantry', 'Grains & Rice', 'Rice'],
    department: 'Grocery',
    description: 'Kroger Enriched Long Grain White Rice Bag',
    price: { regular: 2.79, promo: 2.29 },
    size: '32 oz (2 lb)',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Aisle 5', bay: 'R-01', quantityOnHand: 75, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050015',
    upc: '0001111050015',
    brand: 'Kroger',
    categories: ['Pantry', 'Canned Goods', 'Beans'],
    department: 'Grocery',
    description: 'Kroger Black Beans in Water (Low Sodium)',
    price: { regular: 0.99, promo: 0.85 },
    size: '15 oz can',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Aisle 5', bay: 'B-04', quantityOnHand: 200, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050016',
    upc: '0001111050016',
    brand: 'Jif',
    categories: ['Pantry', 'Spreads', 'Peanut Butter'],
    department: 'Grocery',
    description: 'Jif Creamy Peanut Butter Jar',
    price: { regular: 3.49, promo: 2.99 },
    size: '16 oz jar',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1568283096533-078a24930eb8?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Aisle 6', bay: 'PB-02', quantityOnHand: 80, stockLevelUpdatedAt: new Date().toISOString() }
  },

  // --- COFFEE & TEA ---
  {
    productId: '0001111050214',
    upc: '0001111050214',
    brand: 'Kroger',
    categories: ['Coffee & Tea', 'Ground Coffee', 'Breakfast'],
    department: 'Grocery',
    description: 'Kroger 100% Arabica Breakfast Blend Medium Roast Ground Coffee',
    price: { regular: 6.99, promo: 5.49 },
    size: '12 oz bag',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Coffee Aisle 8', bay: 'CF-02', quantityOnHand: 65, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050215',
    upc: '0001111050215',
    brand: 'Private Selection',
    categories: ['Coffee & Tea', 'Whole Bean Coffee'],
    department: 'Grocery',
    description: 'Private Selection Colombian Supremo Dark Roast Whole Bean Coffee',
    price: { regular: 7.99, promo: 6.99 },
    size: '12 oz bag',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Coffee Aisle 8', bay: 'CF-06', quantityOnHand: 42, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050216',
    upc: '0001111050216',
    brand: 'Twinings',
    categories: ['Coffee & Tea', 'Tea Bags', 'Black Tea'],
    department: 'Grocery',
    description: 'Twinings of London Earl Grey Black Tea Bags',
    price: { regular: 4.49, promo: 3.79 },
    size: '20 ct box',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Coffee & Tea Aisle 8', bay: 'T-01', quantityOnHand: 55, stockLevelUpdatedAt: new Date().toISOString() }
  },

  // --- CEREAL & BREAKFAST ---
  {
    productId: '0001111050017',
    upc: '0001111050017',
    brand: 'Kroger',
    categories: ['Breakfast & Cereal', 'Cereal', 'Oats'],
    department: 'Grocery',
    description: 'Kroger Honey Nut Toasted Oats Whole Grain Cereal',
    price: { regular: 3.29, promo: 2.79 },
    size: '12.25 oz box',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Cereal Aisle 6', bay: 'CR-04', quantityOnHand: 70, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111050018',
    upc: '0001111050018',
    brand: 'Quaker',
    categories: ['Breakfast & Cereal', 'Hot Cereal', 'Oatmeal'],
    department: 'Grocery',
    description: 'Quaker Old Fashioned 100% Whole Grain Rolled Oats',
    price: { regular: 4.99, promo: 4.29 },
    size: '42 oz tub',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Cereal Aisle 6', bay: 'CR-08', quantityOnHand: 50, stockLevelUpdatedAt: new Date().toISOString() }
  },

  // --- BEVERAGES ---
  {
    productId: '0001111041701',
    upc: '0001111041701',
    brand: 'Kroger',
    categories: ['Beverages', 'Juice', 'Orange Juice'],
    department: 'Beverages',
    description: 'Kroger 100% Pure Squeezed Orange Juice No Pulp',
    price: { regular: 3.49, promo: 2.99 },
    size: '52 fl oz bottle',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Beverages Cooler', bay: 'BV-02', quantityOnHand: 60, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111041702',
    upc: '0001111041702',
    brand: 'Kroger',
    categories: ['Beverages', 'Sparkling Water', 'Water'],
    department: 'Beverages',
    description: 'Kroger Lemon Lime Purified Sparkling Water Cans 8-Pack',
    price: { regular: 3.99, promo: 3.49 },
    size: '8 ct / 12 fl oz cans',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Water Aisle 9', bay: 'SP-01', quantityOnHand: 88, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111041703',
    upc: '0001111041703',
    brand: 'Kroger',
    categories: ['Beverages', 'Water', 'Bottled Water'],
    department: 'Beverages',
    description: 'Kroger Purified Bottled Drinking Water 24-Pack',
    price: { regular: 4.29, promo: 3.79 },
    size: '24 ct / 16.9 fl oz bottles',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Water Aisle 9', bay: 'W-03', quantityOnHand: 180, stockLevelUpdatedAt: new Date().toISOString() }
  },

  // --- FROZEN FOODS ---
  {
    productId: '0001111060904',
    upc: '0001111060904',
    brand: 'Private Selection',
    categories: ['Frozen', 'Pizza', 'Italian'],
    department: 'Frozen',
    description: 'Private Selection Three Cheese Artisan Crust Frozen Pizza',
    price: { regular: 6.49, promo: 5.49 },
    size: '15.5 oz',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Frozen Aisle 11', bay: 'FZ-03', quantityOnHand: 45, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111060905',
    upc: '0001111060905',
    brand: 'Private Selection',
    categories: ['Frozen', 'Ice Cream', 'Desserts'],
    department: 'Frozen',
    description: 'Private Selection Wild Maine Blueberry Premium Ice Cream',
    price: { regular: 4.29, promo: 3.99 },
    size: '48 fl oz tub',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Frozen Aisle 12', bay: 'FZ-10', quantityOnHand: 35, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111060906',
    upc: '0001111060906',
    brand: 'Ore-Ida',
    categories: ['Frozen', 'Potatoes & Fries', 'Sides'],
    department: 'Frozen',
    description: 'Ore-Ida Golden Crinkle Cut French Fried Potatoes',
    price: { regular: 4.49, promo: 3.79 },
    size: '32 oz bag',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: false },
    inventory: { stockLevel: 'HIGH', aisle: 'Frozen Aisle 11', bay: 'FZ-06', quantityOnHand: 50, stockLevelUpdatedAt: new Date().toISOString() }
  },

  // --- SNACKS & CANDY ---
  {
    productId: '0001111099231',
    upc: '0001111099231',
    brand: 'Private Selection',
    categories: ['Snacks & Candy', 'Chocolate', 'Gourmet'],
    department: 'Grocery',
    description: 'Private Selection Sea Salt Dark Chocolate Caramels Box',
    price: { regular: 5.99, promo: 4.99 },
    size: '8 oz box',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Candy Aisle 3', bay: 'CN-01', quantityOnHand: 40, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111099233',
    upc: '0001111099233',
    brand: 'Simple Truth Organic',
    categories: ['Snacks & Candy', 'Cookies', 'Organic'],
    department: 'Grocery',
    description: 'Simple Truth Organic Crispy Chocolate Chip Cookies',
    price: { regular: 3.99, promo: 3.49 },
    size: '7 oz bag',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Cookie Aisle 3', bay: 'CK-04', quantityOnHand: 55, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111099234',
    upc: '0001111099234',
    brand: 'Lay\'s',
    categories: ['Snacks & Candy', 'Chips', 'Potato Chips'],
    department: 'Grocery',
    description: 'Lay\'s Classic Salted Potato Chips Party Size',
    price: { regular: 4.79, promo: 3.99 },
    size: '13 oz bag',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Snack Aisle 2', bay: 'SN-08', quantityOnHand: 68, stockLevelUpdatedAt: new Date().toISOString() }
  },

  // --- HOUSEHOLD & CLEANING ---
  {
    productId: '0001111012341',
    upc: '0001111012341',
    brand: 'Kroger',
    categories: ['Household', 'Paper Towels', 'Cleaning'],
    department: 'Household',
    description: 'Kroger Ultra Strong Paper Towels Double Rolls 6-Pack',
    price: { regular: 8.99, promo: 7.99 },
    size: '6 double rolls',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Paper Aisle 14', bay: 'PP-01', quantityOnHand: 90, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111012342',
    upc: '0001111012342',
    brand: 'Charmin',
    categories: ['Household', 'Bath Tissue', 'Paper Products'],
    department: 'Household',
    description: 'Charmin Ultra Soft Bath Tissue Mega Rolls 12-Pack',
    price: { regular: 15.99, promo: 13.99 },
    size: '12 mega rolls',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Paper Aisle 14', bay: 'PP-05', quantityOnHand: 70, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111012343',
    upc: '0001111012343',
    brand: 'Tide',
    categories: ['Household', 'Laundry Detergent', 'Cleaning'],
    department: 'Household',
    description: 'Tide Original Liquid Laundry Detergent 64 Loads',
    price: { regular: 12.99, promo: 11.49 },
    size: '92 fl oz bottle',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Laundry Aisle 13', bay: 'LD-02', quantityOnHand: 60, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111012344',
    upc: '0001111012344',
    brand: 'Dawn',
    categories: ['Household', 'Dish Soap', 'Cleaning'],
    department: 'Household',
    description: 'Dawn Platinum Antibacterial Dishwashing Liquid Original Scent',
    price: { regular: 3.99, promo: 3.49 },
    size: '24 fl oz bottle',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Cleaning Aisle 13', bay: 'DS-01', quantityOnHand: 85, stockLevelUpdatedAt: new Date().toISOString() }
  },

  // --- PERSONAL CARE ---
  {
    productId: '0001111012345',
    upc: '0001111012345',
    brand: 'Dove',
    categories: ['Personal Care', 'Body Wash', 'Bath'],
    department: 'Health & Beauty',
    description: 'Dove Deep Moisture Nourishing Body Wash Pump',
    price: { regular: 7.49, promo: 6.79 },
    size: '30.6 fl oz pump',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Personal Care Aisle 15', bay: 'BW-03', quantityOnHand: 45, stockLevelUpdatedAt: new Date().toISOString() }
  },
  {
    productId: '0001111012346',
    upc: '0001111012346',
    brand: 'Colgate',
    categories: ['Personal Care', 'Oral Care', 'Toothpaste'],
    department: 'Health & Beauty',
    description: 'Colgate Total Whitening Gel Toothpaste 2-Pack',
    price: { regular: 5.99, promo: 4.99 },
    size: '2 x 4.8 oz tubes',
    soldBy: 'unit',
    images: [{
      perspective: 'front',
      sizes: [{ size: 'medium', url: 'https://images.unsplash.com/photo-1559650656-5d1d3b999084?w=500' }]
    }],
    fulfillment: { curbside: true, delivery: true, instore: true, shiptohome: true },
    inventory: { stockLevel: 'HIGH', aisle: 'Personal Care Aisle 15', bay: 'OC-02', quantityOnHand: 55, stockLevelUpdatedAt: new Date().toISOString() }
  }
];

// --- KROGER CHAINS & SUBSIDIARIES ---
export const KROGER_CHAINS = [
  { name: 'KROGER', friendlyBannerName: 'Kroger', domain: 'kroger.com', divisionNumbers: ['014', '021', '024', '029'], themeColor: '#00539b' },
  { name: 'BAKERS', friendlyBannerName: "Baker's", domain: 'bakersplus.com', divisionNumbers: ['035'], themeColor: '#ef3e42' },
  { name: 'CITY_MARKET', friendlyBannerName: 'City Market', domain: 'citymarket.com', divisionNumbers: ['620'], themeColor: '#d6222b' },
  { name: 'DILLONS', friendlyBannerName: 'Dillons', domain: 'dillons.com', divisionNumbers: ['035'], themeColor: '#c8102e' },
  { name: 'FOOD_4_LESS', friendlyBannerName: 'Food 4 Less', domain: 'food4less.com', divisionNumbers: ['703', '704'], themeColor: '#e31b23' },
  { name: 'FOODS_CO', friendlyBannerName: 'Foods Co', domain: 'foodsco.net', divisionNumbers: ['706'], themeColor: '#e31b23' },
  { name: 'FRED_MEYER', friendlyBannerName: 'Fred Meyer', domain: 'fredmeyer.com', divisionNumbers: ['701'], themeColor: '#003366' },
  { name: 'FRYS', friendlyBannerName: "Fry's", domain: 'frysfood.com', divisionNumbers: ['660'], themeColor: '#00539b' },
  { name: 'GERBES', friendlyBannerName: 'Gerbes', domain: 'gerbes.com', divisionNumbers: ['035'], themeColor: '#c8102e' },
  { name: 'JAYC', friendlyBannerName: 'JayC Food Stores', domain: 'jaycfoods.com', divisionNumbers: ['014'], themeColor: '#00539b' },
  { name: 'KING_SOOPERS', friendlyBannerName: 'King Soopers', domain: 'kingsoopers.com', divisionNumbers: ['620'], themeColor: '#c8102e' },
  { name: 'METRO_MARKET', friendlyBannerName: 'Metro Market', domain: 'metromarket.net', divisionNumbers: ['534'], themeColor: '#00539b' },
  { name: 'OWENS', friendlyBannerName: "Owen's Market", domain: 'owensmarket.com', divisionNumbers: ['014'], themeColor: '#00539b' },
  { name: 'PAY_LESS', friendlyBannerName: 'Pay Less Super Markets', domain: 'pay-less.com', divisionNumbers: ['014'], themeColor: '#00539b' },
  { name: 'PICK_N_SAVE', friendlyBannerName: "Pick 'n Save", domain: 'picknsave.com', divisionNumbers: ['534'], themeColor: '#004c87' },
  { name: 'QFC', friendlyBannerName: 'QFC (Quality Food Centers)', domain: 'qfc.com', divisionNumbers: ['705'], themeColor: '#006272' },
  { name: 'RALPHS', friendlyBannerName: 'Ralphs', domain: 'ralphs.com', divisionNumbers: ['703'], themeColor: '#e31b23' },
  { name: 'SMITHS', friendlyBannerName: "Smith's Food and Drug", domain: 'smithsfoodanddrug.com', divisionNumbers: ['706'], themeColor: '#00539b' }
];

// --- KROGER DEPARTMENTS ---
export const KROGER_DEPARTMENTS = [
  { departmentId: '01', name: 'Grocery & Dry Goods' },
  { departmentId: '02', name: 'Pharmacy & Health' },
  { departmentId: '03', name: 'Produce & Fresh Fruits' },
  { departmentId: '04', name: 'Meat & Poultry' },
  { departmentId: '05', name: 'Deli & Prepared Foods' },
  { departmentId: '06', name: 'Bakery & Artisan Bread' },
  { departmentId: '07', name: 'Seafood & Fresh Catch' },
  { departmentId: '08', name: 'Dairy & Refrigerated' },
  { departmentId: '09', name: 'Fuel & Convenience' },
  { departmentId: '10', name: 'Floral & Gifts' },
  { departmentId: '11', name: 'Frozen Foods' },
  { departmentId: '12', name: 'Beer, Wine & Spirits' },
  { departmentId: '13', name: 'Baby Care & Essentials' },
  { departmentId: '14', name: 'Starbucks Kiosk' },
  { departmentId: '15', name: 'Beauty & Cosmetics' },
  { departmentId: '16', name: 'Household & Cleaning' },
  { departmentId: '17', name: 'Pet Care & Food' },
  { departmentId: '18', name: 'Unattended Pickup Lockers' }
];

// --- KROGER LOCATIONS ---
export const KROGER_LOCATIONS = [
  {
    locationId: '01400943',
    chain: 'KROGER',
    name: 'Downtown Cincinnati Kroger Marketplace',
    storeNumber: '00943',
    divisionNumber: '014',
    address: {
      addressLine1: '100 E Court St',
      city: 'Cincinnati',
      state: 'OH',
      zipCode: '45202',
      county: 'Hamilton'
    },
    geolocation: { latitude: 39.1068, longitude: -84.5133 },
    phone: '513-381-4214',
    departments: KROGER_DEPARTMENTS.slice(0, 10),
    hours: {
      open24: false,
      monday: { open: '06:00', close: '23:00' },
      tuesday: { open: '06:00', close: '23:00' },
      wednesday: { open: '06:00', close: '23:00' },
      thursday: { open: '06:00', close: '23:00' },
      friday: { open: '06:00', close: '23:00' },
      saturday: { open: '07:00', close: '23:00' },
      sunday: { open: '07:00', close: '22:00' }
    }
  },
  {
    locationId: '01400812',
    chain: 'KROGER',
    name: 'Hyde Park Plaza Kroger Marketplace',
    storeNumber: '00812',
    divisionNumber: '014',
    address: {
      addressLine1: '3760 Paxton Ave',
      city: 'Cincinnati',
      state: 'OH',
      zipCode: '45209',
      county: 'Hamilton'
    },
    geolocation: { latitude: 39.1472, longitude: -84.4328 },
    phone: '513-871-6145',
    departments: KROGER_DEPARTMENTS,
    hours: { open24: true }
  },
  {
    locationId: '70400399',
    chain: 'FOOD_4_LESS',
    name: 'Food 4 Less Bell Gardens (Locker Partner Pilot #399)',
    storeNumber: '00399',
    divisionNumber: '704',
    address: {
      addressLine1: '6895 E Florence Ave',
      city: 'Bell Gardens',
      state: 'CA',
      zipCode: '90201',
      county: 'Los Angeles'
    },
    geolocation: { latitude: 33.9682, longitude: -118.1476 },
    phone: '562-927-1811',
    departments: KROGER_DEPARTMENTS,
    hours: { open24: false, monday: { open: '06:00', close: '00:00' } }
  }
];

// --- DISABLED / DISCONTINUED ITEMS FOR CATALOG V2 ---
export const KROGER_DELETED_ITEMS = [
  '0081801301354',
  '0081801301355',
  '8244452001046',
  '8244452001048',
  '8244453001046',
  '0081801301359',
  '0081801301456'
];
