import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Tag,
  MapPin,
  Info,
  RefreshCw,
  Layers,
  Box,
  Truck,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  DollarSign,
  ChevronRight,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Store,
  Calendar,
  X
} from 'lucide-react';

interface KrogerProduct {
  productId: string;
  upc: string;
  brand: string;
  categories: string[];
  department?: string;
  description: string;
  images: {
    perspective: string;
    sizes: {
      size: string;
      url: string;
    }[];
  }[];
  items: {
    itemId: string;
    price: {
      regular: number;
      promo: number;
    };
    size: string;
    soldBy: string;
    fulfillment: {
      curbside: boolean;
      delivery: boolean;
      instore: boolean;
      shiptohome: boolean;
    };
    inventory: {
      stockLevel: string;
      aisle?: string;
      bay?: string;
      quantityOnHand?: number;
      stockLevelUpdatedAt?: string;
    };
  }[];
}

interface CartItem {
  upc: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  size?: string;
  image?: string;
}

export const KrogerCitibankConsole: React.FC = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'catalog' | 'catalogV2' | 'lockers' | 'locations' | 'delivery' | 'identity'>('catalog');

  // Products & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedFulfillment, setSelectedFulfillment] = useState('ALL');
  const [locationId, setLocationId] = useState('01400943');
  const [products, setProducts] = useState<KrogerProduct[]>([]);
  const [totalCatalogCount, setTotalCatalogCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<KrogerProduct | null>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartSubtotal, setCartSubtotal] = useState(0);

  // Catalog V2 State
  const [v2SubTab, setV2SubTab] = useState<'search' | 'inventory' | 'deleted'>('search');
  const [v2Results, setV2Results] = useState<any>(null);
  const [v2Loading, setV2Loading] = useState(false);

  // Locker State (0.2.0)
  const [lockerOrderId, setLockerOrderId] = useState('1030421485034392200');
  const [lockerStatus, setLockerStatus] = useState<'LOADED' | 'COLLECTION' | 'REMOVED'>('LOADED');
  const [lockerLocationId, setLockerLocationId] = useState('70400399');
  const [lockerEventTimeType, setLockerEventTimeType] = useState('loadingStartTime');
  const [lockerOrders, setLockerOrders] = useState<any[]>([]);
  const [lockerLogs, setLockerLogs] = useState<string[]>([]);

  // Locations & Chains State
  const [zipCodeQuery, setZipCodeQuery] = useState('45202');
  const [chainQuery, setChainQuery] = useState('KROGER');
  const [locationsList, setLocationsList] = useState<any[]>([]);
  const [chainsList, setChainsList] = useState<any[]>([]);
  const [departmentsList, setDepartmentsList] = useState<any[]>([]);

  // Delivery & Slots State (1.2.1)
  const [deliverySlots, setDeliverySlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [reservationResult, setReservationResult] = useState<any>(null);
  const [eligibilityResult, setEligibilityResult] = useState<any>(null);

  // Identity State
  const [profileData, setProfileData] = useState<any>(null);

  const departments = [
    { id: 'ALL', label: 'All Items' },
    { id: 'Produce', label: 'Produce & Fruits' },
    { id: 'Dairy', label: 'Dairy & Eggs' },
    { id: 'Bakery', label: 'Fresh Bakery' },
    { id: 'Meat', label: 'Meat & Seafood' },
    { id: 'Grocery', label: 'Pantry & Coffee' },
    { id: 'Beverages', label: 'Beverages' },
    { id: 'Frozen', label: 'Frozen Foods' },
    { id: 'Household', label: 'Cleaning & Home' },
    { id: 'Health & Beauty', label: 'Personal Care' }
  ];

  // Load products on mount
  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchChainsAndDepts();
    fetchIdentity();
    fetchLockerOrders();
  }, []);

  const fetchProducts = async (term = searchTerm, dept = selectedDepartment, fulfill = selectedFulfillment) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL('/api/kroger/products/products', window.location.origin);
      if (term.trim()) url.searchParams.append('filter.term', term.trim());
      if (dept !== 'ALL') url.searchParams.append('filter.department', dept);
      if (fulfill !== 'ALL') url.searchParams.append('filter.locations.fulfillment.eq', fulfill);
      if (locationId) url.searchParams.append('filter.locationId', locationId);
      url.searchParams.append('filter.limit', '100');

      const res = await fetch(url.toString());
      const data = await res.json();

      if (res.ok && data) {
        const productList = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
        setProducts(productList);
        if (data.meta?.pagination?.catalogTotal) {
          setTotalCatalogCount(data.meta.pagination.catalogTotal);
        } else {
          setTotalCatalogCount(productList.length);
        }
      } else {
        setError(data?.error || 'Failed to fetch items from Kroger catalog');
      }
    } catch (err: any) {
      setError(`Network Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/kroger/cart');
      const data = await res.json();
      if (data?.data?.items && Array.isArray(data.data.items)) {
        setCartItems(data.data.items);
        setCartSubtotal(data.data.subtotal || 0);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  };

  const fetchChainsAndDepts = async () => {
    try {
      const [resChains, resDepts, resLocs] = await Promise.all([
        fetch('/api/kroger/v1/chains'),
        fetch('/api/kroger/v1/departments'),
        fetch(`/api/kroger/v1/locations?filter.zipCode.near=${zipCodeQuery}&filter.chain=${chainQuery}`)
      ]);
      const dataChains = await resChains.json();
      const dataDepts = await resDepts.json();
      const dataLocs = await resLocs.json();

      if (Array.isArray(dataChains?.data)) setChainsList(dataChains.data);
      if (Array.isArray(dataDepts?.data)) setDepartmentsList(dataDepts.data);
      if (Array.isArray(dataLocs?.data)) setLocationsList(dataLocs.data);
    } catch (err) {
      console.error('Failed to load chains/departments', err);
    }
  };

  const fetchIdentity = async () => {
    try {
      const res = await fetch('/api/kroger/v1/identity/profile');
      const data = await res.json();
      if (data?.data) setProfileData(data.data);
    } catch (err) {
      console.error('Failed to load identity', err);
    }
  };

  const fetchLockerOrders = async () => {
    try {
      const res = await fetch('/api/kroger/unattended-pickup/v1/locker/orders');
      const data = await res.json();
      if (Array.isArray(data?.data)) setLockerOrders(data.data);
    } catch (err) {
      console.error('Failed to load locker orders', err);
    }
  };

  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartment(deptId);
    fetchProducts(searchTerm, deptId, selectedFulfillment);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchProducts(searchTerm, selectedDepartment, selectedFulfillment);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('ALL');
    setSelectedFulfillment('ALL');
    fetchProducts('', 'ALL', 'ALL');
  };

  const handleAddToCart = async (product: KrogerProduct) => {
    if (!product) return;
    try {
      const item = (product.items && Array.isArray(product.items) && product.items.length > 0) ? product.items[0] : (product as any);
      const itemPrice = item?.price?.promo || item?.price?.regular || (product as any)?.price?.promo || (product as any)?.price?.regular || 3.99;
      const imageUrl = getProductImage(product);
      const res = await fetch('/api/kroger/cart/add', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upc: product.upc,
          description: product.description,
          price: itemPrice,
          category: (Array.isArray(product.categories) && product.categories.length > 0) ? product.categories[0] : ((product as any)?.category || 'Grocery'),
          size: item?.size || (product as any)?.size || '1 unit',
          image: imageUrl,
          quantity: 1
        })
      });

      if (res.ok) {
        setSuccessMsg(`Added ${product.description} to Kroger cart!`);
        setTimeout(() => setSuccessMsg(null), 3000);
        fetchCart();
      }
    } catch (err: any) {
      setError(`Failed to add to cart: ${err.message}`);
    }
  };

  const handleClearCart = async () => {
    try {
      await fetch('/api/kroger/cart/clear', { method: 'DELETE' });
      fetchCart();
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  // Catalog V2 Actions
  const runCatalogV2Test = async (type: 'search' | 'inventory' | 'deleted') => {
    setV2SubTab(type);
    setV2Loading(true);
    setV2Results(null);
    try {
      let endpoint = '/api/kroger/catalog/v2/products';
      if (type === 'inventory') endpoint = '/api/kroger/catalog/v2/products-inventory';
      if (type === 'deleted') endpoint = '/api/kroger/catalog/v2/deleted-items';

      const res = await fetch(endpoint);
      const data = await res.json();
      setV2Results(data);
    } catch (err: any) {
      setV2Results({ error: err.message });
    } finally {
      setV2Loading(false);
    }
  };

  // Locker Actions
  const handleSendLockerEvent = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const res = await fetch('/api/kroger/unattended-pickup/v1/locker/order-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': `corr_${Date.now()}`,
          'Idempotency-Key': `idemp_${Date.now()}`
        },
        body: JSON.stringify({
          orderId: lockerOrderId,
          orderStatus: lockerStatus,
          locationId: lockerLocationId,
          events: [{ [lockerEventTimeType]: now }],
          details: [{ attendantId: 'STORE_EMP_8842', stationId: 'LOCKER_STN_01' }]
        })
      });
      const data = await res.json();
      setLockerLogs(prev => [`[${new Date().toLocaleTimeString()}] Sent ${lockerStatus} (${lockerEventTimeType}): Success`, ...prev]);
      setSuccessMsg(`Locker event recorded for Order #${lockerOrderId}`);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchLockerOrders();
    } catch (err: any) {
      setError(`Locker event error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendLockerDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kroger/unattended-pickup/v1/locker/order-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': `corr_${Date.now()}`,
          'Idempotency-Key': `idemp_${Date.now()}`
        },
        body: JSON.stringify({
          orderId: lockerOrderId,
          orderAttributes: {
            hasAgeControlledItems: false,
            ageConfirmedBy: 'F4L#399 (F4L399)',
            hasAdditionalItems: false,
            isManualDelivery: false,
            pickupByDateTime: new Date(Date.now() + 86400000).toISOString()
          },
          lockerDetails: {
            lockerId: 399,
            lockerAddress: { street: '6895 E Florence Ave', city: 'Bell Gardens', state: 'CA' },
            assignedLockerDoors: ['DOOR_01', 'DOOR_02', 'DOOR_04'],
            ambient: 1,
            chilled: 1,
            frozen: 2,
            deepFrozen: 0
          }
        })
      });
      const data = await res.json();
      setLockerLogs(prev => [`[${new Date().toLocaleTimeString()}] Assigned 4 Locker Doors for Order #${lockerOrderId}`, ...prev]);
      setSuccessMsg(`Locker details confirmed for Order #${lockerOrderId}`);
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchLockerOrders();
    } catch (err: any) {
      setError(`Locker details error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delivery Slots Actions
  const handleCheckEligibilityAndSlots = async () => {
    setLoading(true);
    try {
      const [resElig, resSlots] = await Promise.all([
        fetch('/api/kroger/v1/eligibilities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modality: 'DELIVERY', location: { lat: 39.1068, lng: -84.5133 } })
        }),
        fetch('/api/kroger/v1/slots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modality: 'DELIVERY', partner: 'OCADO_DELIVERY_FLEET' })
        })
      ]);
      const dataElig = await resElig.json();
      const dataSlots = await resSlots.json();
      setEligibilityResult(dataElig.data);
      if (dataSlots.data?.slots) setDeliverySlots(dataSlots.data.slots);
    } catch (err: any) {
      setError(`Delivery API Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReserveSlot = async (slot: any) => {
    setSelectedSlot(slot);
    try {
      const res = await fetch('/api/kroger/v1/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot, storeId: '01400943', modality: 'DELIVERY' })
      });
      const data = await res.json();
      setReservationResult(data.data?.reservations);
      setSuccessMsg(`Reserved window: ${slot.windowDisplay}!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(`Reservation failed: ${err.message}`);
    }
  };

  const getProductImage = (product: any) => {
    if (!product) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
    if (product.image) return product.image;
    if (Array.isArray(product.images) && product.images.length > 0) {
      const frontImage = product.images.find((img: any) => img && img.perspective === 'front') || product.images[0];
      if (frontImage?.sizes && Array.isArray(frontImage.sizes) && frontImage.sizes.length > 0) {
        const mediumSize = frontImage.sizes.find((s: any) => s && s.size === 'medium') || frontImage.sizes[0];
        if (mediumSize?.url) return mediumSize.url;
      }
    }
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-[#c9d1d9] p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#21262d] pb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl shadow-blue-900/30 border border-blue-400/20">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-tight">
                Kroger Enterprise Developer Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono font-semibold">
                APIs v1.5.5
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                Catalog: {totalCatalogCount > 0 ? `${totalCatalogCount} Items` : '70+ Items'}
              </span>
            </div>
            <p className="text-sm text-[#8b949e] mt-1">
              Full Grocery Department Catalog, Catalog V2 APIs, Unattended Locker Pickup (0.2.0), Store Finder & Seamless Delivery
            </p>
          </div>
        </div>

        {/* Global Quick Action & Cart Indicator */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="flex items-center space-x-2.5 px-4 py-2 bg-[#161b22] hover:bg-[#21262d] text-white rounded-xl border border-[#30363d] transition relative shadow-lg"
          >
            <ShoppingCart className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold">Corporate Cart</span>
            {cartItems.length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
            <span className="text-xs text-emerald-400 font-mono font-bold">${cartSubtotal.toFixed(2)}</span>
          </button>

          <button
            onClick={() => fetchProducts()}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-2 bg-[#21262d] hover:bg-[#30363d] text-xs font-medium text-gray-200 rounded-xl border border-[#30363d] transition"
            title="Refresh All Catalog Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center justify-between p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Suite Tab Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[#21262d]">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'catalog'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d]'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Grocery Catalog (All Items)</span>
          <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">{products.length}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('catalogV2');
            runCatalogV2Test('search');
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'catalogV2'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Catalog API V2 (Inventory & Deleted)</span>
        </button>

        <button
          onClick={() => setActiveTab('lockers')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'lockers'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d]'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Unattended Locker Pickup (0.2.0)</span>
          <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">{lockerOrders.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'locations'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d]'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Locations & 18 Chains</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('delivery');
            handleCheckEligibilityAndSlots();
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'delivery'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d]'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Seamless Delivery & Slots (1.2.1)</span>
        </button>

        <button
          onClick={() => setActiveTab('identity')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'identity'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Identity API (1.2.3)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ALL ITEMS GROCERY CATALOG                                          */}
      {/* ========================================================================= */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search, Store, & Filter Bar */}
          <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-4 md:p-5 shadow-xl space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search over 70+ grocery items (apples, coffee, steaks, bread, milk, paper towels...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500 outline-none transition"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      fetchProducts('', selectedDepartment, selectedFulfillment);
                    }}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 mr-2 shrink-0" />
                  <span className="text-gray-400 mr-1">Store:</span>
                  <select
                    value={locationId}
                    onChange={(e) => {
                      setLocationId(e.target.value);
                      fetchProducts(searchTerm, selectedDepartment, selectedFulfillment);
                    }}
                    className="bg-transparent text-white font-mono outline-none cursor-pointer"
                  >
                    <option value="01400943">01400943 (Cincinnati Mkt)</option>
                    <option value="01400812">01400812 (Hyde Park)</option>
                    <option value="70400399">70400399 (Food 4 Less Bell Gardens)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-900/30 transition flex items-center space-x-1.5"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Search</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2.5 bg-[#161b22] hover:bg-[#21262d] text-gray-300 text-xs font-medium rounded-xl border border-[#30363d] transition"
                  title="Pull All 70+ Items"
                >
                  Show All Items
                </button>
              </div>
            </form>

            {/* Department Quick Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pt-2 pb-1 scrollbar-thin">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
                Departments:
              </span>
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => handleDepartmentChange(dept.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    selectedDepartment === dept.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                      : 'bg-[#161b22] text-gray-400 hover:text-white hover:bg-[#21262d] border border-[#30363d]'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>

            {/* Filter Status Bar */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-[#21262d]">
              <div className="flex items-center space-x-2">
                <span>Displaying <strong>{products.length}</strong> products</span>
                {selectedDepartment !== 'ALL' && (
                  <span className="bg-[#21262d] text-blue-400 px-2 py-0.5 rounded-md text-[11px]">
                    Department: {selectedDepartment}
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-[#21262d] text-amber-400 px-2 py-0.5 rounded-md text-[11px]">
                    Query: "{searchTerm}"
                  </span>
                )}
              </div>
              <span className="text-gray-500 font-mono text-[11px]">
                Kroger Partner Protocol • Real-time Store Inventory
              </span>
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-12 text-center space-y-4">
              <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto" />
              <div className="text-white font-bold text-lg">No Products Found for this Filter</div>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                No items matched "{searchTerm}". Try clearing your search or selecting "Show All Items" to browse the full grocery catalog.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition"
              >
                Reset & Pull All Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => {
                if (!product) return null;
                const item = (product.items && Array.isArray(product.items) && product.items.length > 0) ? product.items[0] : (product as any);
                const price = item?.price?.promo || item?.price?.regular || (product as any)?.price?.promo || (product as any)?.price?.regular || 0;
                const regPrice = item?.price?.regular || (product as any)?.price?.regular || price;
                const hasDiscount = Boolean(item?.price?.promo && item?.price?.promo < regPrice);
                const imageUrl = getProductImage(product);
                const stock = item?.inventory?.stockLevel || (product as any)?.inventory?.stockLevel || 'HIGH';

                return (
                  <div
                    key={product.productId || product.upc}
                    className="bg-[#111622] border border-[#21262d] hover:border-blue-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 group hover:shadow-xl hover:shadow-blue-950/20"
                  >
                    <div>
                      {/* Image & Stock Badge */}
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#0d1117] mb-3 border border-[#21262d]">
                        <img
                          src={imageUrl}
                          alt={product.description}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {hasDiscount && (
                          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                            Save ${(regPrice - price).toFixed(2)}
                          </div>
                        )}
                        <div
                          className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-md ${
                            stock === 'HIGH'
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                              : stock === 'MEDIUM'
                              ? 'bg-amber-950/80 text-amber-400 border-amber-500/30'
                              : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {stock} Stock
                        </div>
                      </div>

                      {/* Brand & Category */}
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                        <span className="font-semibold text-blue-400 truncate">{product.brand}</span>
                        <span className="text-[10px] font-mono text-gray-500 truncate">{item?.size}</span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="text-sm font-bold text-white line-clamp-2 hover:text-blue-400 cursor-pointer transition mb-2"
                        title={product.description}
                      >
                        {product.description}
                      </h3>

                      {/* Aisle & Fulfillment Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {item?.inventory?.aisle && (
                          <span className="text-[10px] bg-[#1a2333] text-gray-300 px-2 py-0.5 rounded font-mono">
                            {item.inventory.aisle}
                          </span>
                        )}
                        {item?.fulfillment?.delivery && (
                          <span className="text-[10px] bg-blue-950/50 text-blue-300 px-1.5 py-0.5 rounded">
                            Delivery
                          </span>
                        )}
                        {item?.fulfillment?.curbside && (
                          <span className="text-[10px] bg-purple-950/50 text-purple-300 px-1.5 py-0.5 rounded">
                            Curbside
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="pt-3 border-t border-[#21262d] flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-lg font-black text-white font-mono">
                            ${price.toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-gray-500 line-through font-mono">
                              ${regPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500">UPC: {product.upc ? product.upc.slice(-6) : '000000'}</span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-900/30 transition transform active:scale-95 flex items-center space-x-1 text-xs font-semibold"
                        title="Add to Kroger Cart"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CATALOG API V2 (1.5.5) - LIVE TESTER                              */}
      {/* ========================================================================= */}
      {activeTab === 'catalogV2' && (
        <div className="space-y-6">
          <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#21262d] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  Kroger Catalog API V2 Endpoint Tester (v1.5.5)
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Official partner endpoints: Catalog Search, Inventory Stock Levels, and Deleted/Disabled Items
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => runCatalogV2Test('search')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    v2SubTab === 'search'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#161b22] text-gray-300 hover:bg-[#21262d] border border-[#30363d]'
                  }`}
                >
                  GET /catalog/v2/products
                </button>
                <button
                  onClick={() => runCatalogV2Test('inventory')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    v2SubTab === 'inventory'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#161b22] text-gray-300 hover:bg-[#21262d] border border-[#30363d]'
                  }`}
                >
                  GET /catalog/v2/products-inventory
                </button>
                <button
                  onClick={() => runCatalogV2Test('deleted')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    v2SubTab === 'deleted'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#161b22] text-gray-300 hover:bg-[#21262d] border border-[#30363d]'
                  }`}
                >
                  GET /catalog/v2/deleted-items
                </button>
              </div>
            </div>

            {/* Response Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-mono">Status: 200 OK • Content-Type: application/json</span>
                <span>Format: Kroger Catalog V2 Specification</span>
              </div>

              {v2Loading ? (
                <div className="p-12 text-center bg-[#0d1117] rounded-xl border border-[#21262d]">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
                  <span className="text-xs text-gray-400">Executing Catalog V2 API request...</span>
                </div>
              ) : (
                <pre className="p-4 bg-[#0d1117] border border-[#21262d] rounded-xl text-[11px] font-mono text-emerald-400 max-h-96 overflow-auto scrollbar-thin">
                  {JSON.stringify(v2Results, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: UNATTENDED LOCKER PICKUP (0.2.0)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'lockers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 bg-[#111622] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-purple-400" />
                Locker Integration APIs (0.2.0)
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                For partner locker vendors to pass unattended pickup order status & details to Kroger.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Kroger Order ID</label>
                <input
                  type="text"
                  value={lockerOrderId}
                  onChange={(e) => setLockerOrderId(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Store / Location ID</label>
                <input
                  type="text"
                  value={lockerLocationId}
                  onChange={(e) => setLockerLocationId(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Order Status Enum</label>
                <select
                  value={lockerStatus}
                  onChange={(e: any) => {
                    const st = e.target.value;
                    setLockerStatus(st);
                    if (st === 'LOADED') setLockerEventTimeType('loadingStartTime');
                    else if (st === 'COLLECTION') setLockerEventTimeType('collectionStartTime');
                    else if (st === 'REMOVED') setLockerEventTimeType('removalStartTime');
                  }}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none cursor-pointer"
                >
                  <option value="LOADED">LOADED (Items placed in locker)</option>
                  <option value="COLLECTION">COLLECTION (Customer collects)</option>
                  <option value="REMOVED">REMOVED (Expired / Attendant unloaded)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Timestamp Event Type</label>
                <select
                  value={lockerEventTimeType}
                  onChange={(e) => setLockerEventTimeType(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none cursor-pointer"
                >
                  {lockerStatus === 'LOADED' && (
                    <>
                      <option value="loadingStartTime">loadingStartTime (Attendant begins loading)</option>
                      <option value="loadingEndTime">loadingEndTime (Loading completed)</option>
                    </>
                  )}
                  {lockerStatus === 'COLLECTION' && (
                    <>
                      <option value="collectionStartTime">collectionStartTime (Customer opens box)</option>
                      <option value="collectionEndTime">collectionEndTime (Customer completes collection)</option>
                    </>
                  )}
                  {lockerStatus === 'REMOVED' && (
                    <>
                      <option value="removalStartTime">removalStartTime (Attendant begins unloading)</option>
                      <option value="removalEndTime">removalEndTime (Unloading completed)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSendLockerEvent}
                  disabled={loading}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-900/30 transition flex items-center justify-center space-x-1.5"
                >
                  <span>POST /unattended-pickup/v1/locker/order-events</span>
                </button>

                <button
                  onClick={handleSendLockerDetails}
                  disabled={loading}
                  className="w-full py-2.5 bg-[#161b22] hover:bg-[#21262d] text-gray-200 text-xs font-semibold rounded-xl border border-[#30363d] transition flex items-center justify-center space-x-1.5"
                >
                  <span>POST /unattended-pickup/v1/locker/order-details</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Orders & Event Logs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Active Locker Orders In System ({lockerOrders.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lockerOrders.map((ord: any) => (
                  <div key={ord.orderId} className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-purple-400 font-bold">#{ord.orderId}</span>
                      <span className="bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded font-mono text-[10px]">
                        {ord.orderStatus}
                      </span>
                    </div>

                    <div className="text-gray-400">
                      <div>Store Location: <strong className="text-white">{ord.locationId}</strong></div>
                      <div>Assigned Doors: <strong className="text-white">{ord.lockerDetails?.assignedLockerDoors?.join(', ') || 'L-101'}</strong></div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded">Ambient: {ord.lockerDetails?.ambient || 1}</span>
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">Chilled: {ord.lockerDetails?.chilled || 1}</span>
                        <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded">Frozen: {ord.lockerDetails?.frozen || 2}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Audit Trail */}
            <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Locker Webhook Transmission Stream
              </h3>

              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] max-h-48 overflow-y-auto space-y-1.5 font-mono text-xs">
                {lockerLogs.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">No events triggered in this session yet.</div>
                ) : (
                  lockerLogs.map((log, idx) => (
                    <div key={idx} className="text-emerald-400">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LOCATIONS & 18 CHAINS                                              */}
      {/* ========================================================================= */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          {/* Chains Banner */}
          <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-400" />
                The Kroger Co. 18 Retail Subsidiaries & Chains
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Kroger Partner APIs provide standardized catalog & inventory access across all 18 enterprise banners.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {chainsList.map((ch) => (
                <div
                  key={ch.name}
                  onClick={() => {
                    setChainQuery(ch.name);
                    fetchChainsAndDepts();
                  }}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition ${
                    chainQuery === ch.name
                      ? 'bg-blue-950/60 border-blue-500/60 text-white'
                      : 'bg-[#0d1117] border-[#21262d] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{ch.friendlyBannerName}</div>
                  <div className="text-[10px] text-gray-500 truncate">{ch.domain}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Locations Finder */}
          <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  Store Finder (GET /v1/locations)
                </h3>
                <p className="text-xs text-gray-400">Search stores by zip code or selected chain banner</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Zip code (45202, 90201...)"
                  value={zipCodeQuery}
                  onChange={(e) => setZipCodeQuery(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-1.5 text-xs text-white font-mono outline-none"
                />
                <button
                  onClick={fetchChainsAndDepts}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition"
                >
                  Locate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locationsList.map((loc) => (
                <div key={loc.locationId} className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{loc.name}</span>
                    <span className="bg-blue-950 text-blue-400 px-2 py-0.5 rounded font-mono text-[10px]">
                      {loc.locationId}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1">
                    <div>{loc.address?.addressLine1}, {loc.address?.city}, {loc.address?.state} {loc.address?.zipCode}</div>
                    <div className="font-mono text-gray-500">Phone: {loc.phone}</div>
                    <div className="text-[11px] text-emerald-400">
                      {loc.hours?.open24 ? 'Open 24 Hours' : 'Open: 6:00 AM - 11:00 PM'}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#21262d] flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Departments: {loc.departments?.length || 12}</span>
                    <button
                      onClick={() => {
                        setLocationId(loc.locationId);
                        setActiveTab('catalog');
                        fetchProducts();
                      }}
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      Shop Store <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SEAMLESS DELIVERY & SLOTS (1.2.1)                                 */}
      {/* ========================================================================= */}
      {activeTab === 'delivery' && (
        <div className="space-y-6">
          <div className="bg-[#111622] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#21262d] pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  Seamless Delivery API Suite (v1.2.1)
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Check Serviceable Area Eligibility (Ocado & Fleet), Browse Available Time Slots & Reserve Windows
                </p>
              </div>

              <button
                onClick={handleCheckEligibilityAndSlots}
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center space-x-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Re-query Partner Slots</span>
              </button>
            </div>

            {/* Delivery Slots Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Available Partner Delivery Slots (POST /v1/slots)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {deliverySlots.map((slot) => (
                  <div
                    key={slot.slotId}
                    className={`p-4 rounded-xl border transition ${
                      selectedSlot?.slotId === slot.slotId
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg'
                        : 'bg-[#0d1117] border-[#21262d] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{slot.windowDisplay}</span>
                      <span className="text-emerald-400 font-mono font-bold text-xs">${slot.fee.toFixed(2)}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mb-3">Order cutoff: {slot.cutoffTime ? (slot.cutoffTime.includes('T') ? slot.cutoffTime.split('T')?.[1]?.substring(0, 5) || '18:00' : slot.cutoffTime) : '18:00'} GMT</div>

                    <button
                      onClick={() => handleReserveSlot(slot)}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
                    >
                      Reserve Window
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reservation Output */}
            {reservationResult && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-300">Reservation Confirmed (POST /v1/reservations)</span>
                  <span className="font-mono text-emerald-400">ID: {reservationResult.reservationId}</span>
                </div>
                <div className="text-xs text-gray-300">
                  Window: <strong>{reservationResult.slot?.windowDisplay}</strong> | Expires At: {new Date(reservationResult.expiresAt).toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: IDENTITY API (1.2.3)                                               */}
      {/* ========================================================================= */}
      {activeTab === 'identity' && (
        <div className="max-w-2xl bg-[#111622] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center space-x-4 border-b border-[#21262d] pb-5">
            <div className="p-3 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-2xl">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Authenticated Customer Profile (v1.2.3)</h2>
              <p className="text-xs text-gray-400">Kroger OAuth2 Customer Context & Loyalty Account</p>
            </div>
          </div>

          {profileData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-1">
                <span className="text-gray-500">Profile Identifier</span>
                <div className="font-mono text-white font-bold">{profileData.id}</div>
              </div>
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-1">
                <span className="text-gray-500">Customer Name</span>
                <div className="text-white font-bold">{profileData.fullName}</div>
              </div>
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-1">
                <span className="text-gray-500">Loyalty Card Number</span>
                <div className="font-mono text-emerald-400 font-bold">{profileData.loyaltyCardNumber}</div>
              </div>
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-1">
                <span className="text-gray-500">Fuel Points Balance</span>
                <div className="text-amber-400 font-bold font-mono">{profileData.fuelPoints} pts ($1.25/gal discount)</div>
              </div>
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-1">
                <span className="text-gray-500">Digital Coupons Clipped</span>
                <div className="text-blue-400 font-bold font-mono">{profileData.digitalCouponsClipped} coupons</div>
              </div>
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#21262d] space-y-1">
                <span className="text-gray-500">Primary Store Location</span>
                <div className="font-mono text-white font-bold">{profileData.preferredStoreLocationId}</div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500">Loading user profile...</div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CORPORATE CART DRAWER                                                     */}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#111622] border-l border-[#21262d] shadow-2xl z-50 flex flex-col justify-between p-6 animate-slideLeft">
          <div>
            <div className="flex items-center justify-between border-b border-[#21262d] pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">Kroger Corporate Cart</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  Your corporate cart is empty. Add grocery items from the catalog.
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.description}
                      className="w-12 h-12 object-cover rounded-lg shrink-0 bg-black/40"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{item.description}</div>
                      <div className="text-[11px] text-gray-500">Qty: {item.quantity} • {item.size || 'Unit'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-[#21262d] pt-4 space-y-3">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Subtotal</span>
              <span className="font-mono text-white font-bold">${cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Estimated Tax (7%)</span>
              <span className="font-mono text-white font-bold">${(cartSubtotal * 0.07).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-white font-bold pt-2 border-t border-[#21262d]">
              <span>Estimated Total</span>
              <span className="font-mono text-emerald-400 font-extrabold">
                ${(cartSubtotal * 1.07).toFixed(2)}
              </span>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleClearCart}
                className="px-3 py-2 bg-[#161b22] hover:bg-[#21262d] text-gray-400 hover:text-rose-400 rounded-xl border border-[#30363d] text-xs font-medium transition"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  alert('Order dispatched via Seamless Delivery API to store #01400943!');
                  setIsCartOpen(false);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 text-xs transition"
              >
                Checkout & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRODUCT DETAIL MODAL                                                      */}
      {/* ========================================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-[#21262d] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
              <span className="text-xs font-bold text-blue-400">{selectedProduct.brand}</span>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4">
              <img
                src={getProductImage(selectedProduct)}
                alt={selectedProduct?.description || 'Product'}
                className="w-28 h-28 object-cover rounded-xl border border-[#21262d] bg-[#0d1117]"
              />
              <div className="space-y-1 text-xs">
                <h3 className="font-bold text-white text-sm">{selectedProduct?.description}</h3>
                <div className="text-gray-400">UPC: <span className="font-mono text-gray-300">{selectedProduct?.upc}</span></div>
                <div className="text-gray-400">Category: <span className="text-gray-300">{Array.isArray(selectedProduct?.categories) ? selectedProduct.categories.join(' > ') : (selectedProduct as any)?.category || 'Grocery'}</span></div>
                <div className="text-emerald-400 font-bold font-mono text-base pt-1">
                  ${(selectedProduct?.items?.[0]?.price?.promo || selectedProduct?.items?.[0]?.price?.regular || (selectedProduct as any)?.price?.promo || (selectedProduct as any)?.price?.regular || 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-[#0d1117] p-3 rounded-xl border border-[#21262d] text-xs space-y-1.5">
              <div className="font-bold text-white">Store Inventory Details</div>
              <div className="grid grid-cols-2 gap-2 text-gray-400">
                <div>Stock Status: <strong className="text-emerald-400">{selectedProduct?.items?.[0]?.inventory?.stockLevel || (selectedProduct as any)?.inventory?.stockLevel || 'HIGH'}</strong></div>
                <div>Aisle Location: <strong className="text-white">{selectedProduct?.items?.[0]?.inventory?.aisle || (selectedProduct as any)?.inventory?.aisle || 'Grocery 01'}</strong></div>
                <div>Bay: <strong className="text-white">{selectedProduct?.items?.[0]?.inventory?.bay || (selectedProduct as any)?.inventory?.bay || 'A-01'}</strong></div>
                <div>Quantity on Hand: <strong className="text-white">{selectedProduct?.items?.[0]?.inventory?.quantityOnHand || (selectedProduct as any)?.inventory?.quantityOnHand || 50}</strong></div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-2 bg-[#161b22] hover:bg-[#21262d] text-gray-300 rounded-xl border border-[#30363d] text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-900/30"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
