import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/cms';
import { ShopFilterState, DEFAULT_SHOP_FILTERS } from '../../types/shop';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Heart, 
  Plus, 
  Star, 
  Grid3X3, 
  Grid2X2, 
  LayoutGrid, 
  Sparkles,
  ArrowRight,
  Flame,
  Tag,
  CheckCircle2,
  Layers,
  ShoppingBag
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { 
    products, 
    shopFilters, 
    setShopFilters, 
    navigateToProduct, 
    addToCart, 
    toggleWishlist, 
    wishlist,
    setActiveStorefrontPage
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<{ [productId: string]: string }>({});

  // Accordion state for filter groups
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    gender: true,
    category: true,
    collection: true,
    fit: false,
    size: true,
    color: true,
    price: true,
    badge: false
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Derive unique lists from product catalog for dynamic filtering
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.category) set.add(p.category); });
    return Array.from(set).sort();
  }, [products]);

  const allCollections = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.collection) set.add(p.collection); });
    return Array.from(set).sort();
  }, [products]);

  const allFits = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.fit) set.add(p.fit); });
    return Array.from(set).sort();
  }, [products]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      p.sizes?.forEach(s => set.add(s));
    });
    const order = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
    return Array.from(set).sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [products]);

  const allColors = useMemo(() => {
    const colorMap = new Map<string, string>();
    products.forEach(p => {
      p.colors?.forEach(c => {
        if (!colorMap.has(c.name)) {
          colorMap.set(c.name, c.hex);
        }
      });
    });
    return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const allBadges = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.badge) set.add(p.badge); });
    return Array.from(set);
  }, [products]);

  // Handle filter changes
  const updateFilter = <K extends keyof ShopFilterState>(key: K, value: ShopFilterState[K]) => {
    setShopFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setShopFilters(DEFAULT_SHOP_FILTERS);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search filter
      if (shopFilters.search.trim()) {
        const query = shopFilters.search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesCol = p.collection?.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesTags = p.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesCat && !matchesCol && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // Gender filter
      if (shopFilters.gender !== 'all' && p.gender !== shopFilters.gender) {
        if (shopFilters.gender !== 'unisex' || p.gender !== 'unisex') {
          return false;
        }
      }

      // Category filter
      if (shopFilters.category !== 'all' && p.category !== shopFilters.category) {
        return false;
      }

      // Collection filter
      if (shopFilters.collection !== 'all' && p.collection !== shopFilters.collection) {
        return false;
      }

      // Fit filter
      if (shopFilters.fit !== 'all' && p.fit !== shopFilters.fit) {
        return false;
      }

      // Size filter
      if (shopFilters.size !== 'all' && (!p.sizes || !p.sizes.includes(shopFilters.size))) {
        return false;
      }

      // Color filter
      if (shopFilters.color !== 'all') {
        const hasColor = p.colors?.some(c => 
          c.name.toLowerCase().includes(shopFilters.color.toLowerCase())
        );
        if (!hasColor) return false;
      }

      // Badge filter
      if (shopFilters.badge !== 'all' && p.badge !== shopFilters.badge) {
        return false;
      }

      // Price range
      if (p.price < shopFilters.priceRange[0] || p.price > shopFilters.priceRange[1]) {
        return false;
      }

      // In stock only
      if (shopFilters.inStockOnly && p.stock <= 0) {
        return false;
      }

      // On sale only
      if (shopFilters.onSaleOnly && (!p.comparePrice || p.comparePrice <= p.price)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (shopFilters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0);
        case 'discount':
          const discountA = a.comparePrice ? (a.comparePrice - a.price) / a.comparePrice : 0;
          const discountB = b.comparePrice ? (b.comparePrice - b.price) / b.comparePrice : 0;
          return discountB - discountA;
        case 'featured':
        default:
          // Bestsellers & Featured first
          const rankA = a.badge === 'BESTSELLER' ? 3 : a.badge === 'TRENDING' ? 2 : 1;
          const rankB = b.badge === 'BESTSELLER' ? 3 : b.badge === 'TRENDING' ? 2 : 1;
          return rankB - rankA;
      }
    });
  }, [products, shopFilters]);

  // Quick Add Handler
  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const size = selectedSizes[product.id] || product.sizes[0] || 'M';
    const color = hoveredColor[product.id] || product.colors[0]?.name || 'Default';
    addToCart(product, color, size, 1);
    setAddedSuccessId(product.id);
    setTimeout(() => setAddedSuccessId(null), 1500);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (shopFilters.search) count++;
    if (shopFilters.gender !== 'all') count++;
    if (shopFilters.category !== 'all') count++;
    if (shopFilters.collection !== 'all') count++;
    if (shopFilters.fit !== 'all') count++;
    if (shopFilters.size !== 'all') count++;
    if (shopFilters.color !== 'all') count++;
    if (shopFilters.badge !== 'all') count++;
    if (shopFilters.priceRange[0] > 0 || shopFilters.priceRange[1] < 150) count++;
    if (shopFilters.inStockOnly) count++;
    if (shopFilters.onSaleOnly) count++;
    return count;
  }, [shopFilters]);

  // Collection metadata cards
  const collectionDescriptions: { [key: string]: { title: string; subtitle: string; bg: string } } = {
    'Whitney x Adapt': {
      title: 'WHITNEY X ADAPT COLLECTION',
      subtitle: 'Sculpted for lifting elegance and power with Whitney Simmons.',
      bg: 'from-amber-900/20 to-stone-900/40'
    },
    'Bratz': {
      title: 'GYMSHARK X BRATZ',
      subtitle: 'Bold Y2K attitude meets performance conditioning.',
      bg: 'from-pink-900/30 to-purple-900/40'
    },
    'Lift Seamless': {
      title: 'LIFT SEAMLESS',
      subtitle: 'Squat-proof contours engineered for heavyweight training.',
      bg: 'from-blue-900/20 to-zinc-900/40'
    },
    'Vital Seamless': {
      title: 'VITAL SEAMLESS 2.0',
      subtitle: 'The essential second-skin fit for every single workout.',
      bg: 'from-emerald-900/20 to-teal-900/40'
    },
    'Power': {
      title: 'POWER COLLECTION',
      subtitle: 'Heavyweight pump covers and rugged lifting essentials.',
      bg: 'from-neutral-900/40 to-black/60'
    },
    'Crest': {
      title: 'CREST ESSENTIALS',
      subtitle: 'Classic embroidered heritage loungewear and fleece.',
      bg: 'from-slate-900/30 to-zinc-900/50'
    },
    'Campus': {
      title: 'CAMPUS VARSITY',
      subtitle: 'Retro varsity-inspired oversized sweats and comfort.',
      bg: 'from-emerald-950/40 to-slate-900/40'
    },
    'Apex Performance': {
      title: 'APEX RUNNING & CONDITIONING',
      subtitle: 'Ultralight heat-mapping performance gear built for high speeds.',
      bg: 'from-cyan-900/30 to-blue-950/50'
    },
    'Minimalist': {
      title: 'MINIMALIST REST DAY',
      subtitle: 'Ultra-soft French terry fabric crafted for off-duty days.',
      bg: 'from-stone-800/30 to-neutral-900/40'
    }
  };

  const activeCollectionInfo = shopFilters.collection !== 'all' 
    ? collectionDescriptions[shopFilters.collection] || {
        title: `${shopFilters.collection.toUpperCase()} COLLECTION`,
        subtitle: `Explore premium styles from our ${shopFilters.collection} range.`,
        bg: 'from-zinc-900/40 to-black/60'
      }
    : null;

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 font-sans pb-16">
      {/* Dynamic Collection / Shop Header Banner */}
      <div className="relative bg-black text-white px-4 sm:px-8 lg:px-12 py-10 overflow-hidden border-b border-gray-800">
        {/* Subtle geometric background grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black tracking-widest text-pink-500 uppercase">
                {shopFilters.collection !== 'all' ? 'Featured Collection' : 'Gymshark Catalog'}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white font-mono">
              {activeCollectionInfo ? activeCollectionInfo.title : 'SHOP ALL PRODUCTS'}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-gray-300 max-w-2xl mt-2 leading-relaxed">
              {activeCollectionInfo 
                ? activeCollectionInfo.subtitle 
                : 'Engineered for conditioning, bodybuilding, lifting, and rest days. Discover high-performance activewear crafted to move with you.'}
            </p>
          </div>

          {/* Quick Collection Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            <button
              onClick={() => updateFilter('collection', 'all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                shopFilters.collection === 'all'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              All Collections
            </button>
            {allCollections.map(col => (
              <button
                key={col}
                onClick={() => updateFilter('collection', col)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  shopFilters.collection === col
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-6">
        {/* Category & Gender Quick Filter Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          {/* Gender Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-md">
            {(['all', 'women', 'men', 'unisex'] as const).map(g => (
              <button
                key={g}
                onClick={() => updateFilter('gender', g)}
                className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
                  shopFilters.gender === g
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
                }`}
              >
                {g === 'all' ? 'All Genders' : g}
              </button>
            ))}
          </div>

          {/* Category Pills Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 scrollbar-none">
            <button
              onClick={() => updateFilter('category', 'all')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-tight rounded border transition-all cursor-pointer whitespace-nowrap ${
                shopFilters.category === 'all'
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              All Categories
            </button>
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => updateFilter('category', cat)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-tight rounded border transition-all cursor-pointer whitespace-nowrap ${
                  shopFilters.category === cat
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar & Controls Bar */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Mobile Filter Button & Search Input */}
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            {/* Filter Drawer Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black text-xs font-black uppercase tracking-wider rounded-md cursor-pointer transition-colors"
            >
              <Filter size={15} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-black text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Live Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by keyword, fit, color, or style..."
                value={shopFilters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-black transition-colors"
              />
              {shopFilters.search && (
                <button
                  onClick={() => updateFilter('search', '')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Quick Toggles, Sorting, and View Switcher */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Quick Toggle: Sale Only */}
            <button
              onClick={() => updateFilter('onSaleOnly', !shopFilters.onSaleOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-tight border transition-colors cursor-pointer ${
                shopFilters.onSaleOnly
                  ? 'bg-red-50 border-red-500 text-red-600'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <Tag size={13} />
              <span>Sale Only</span>
            </button>

            {/* Quick Toggle: In Stock */}
            <button
              onClick={() => updateFilter('inStockOnly', !shopFilters.inStockOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-tight border transition-colors cursor-pointer ${
                shopFilters.inStockOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <CheckCircle2 size={13} />
              <span>In Stock</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-500 hidden sm:inline">Sort:</span>
              <select
                value={shopFilters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as ShopFilterState['sortBy'])}
                className="bg-white border border-gray-200 text-xs font-bold text-gray-900 py-1.5 px-2.5 rounded-md focus:outline-none focus:border-black cursor-pointer uppercase tracking-tight"
              >
                <option value="featured">Featured / Bestselling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {/* View Mode Grid Switcher (Desktop only) */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-md">
              <button
                onClick={() => updateFilter('viewMode', 'grid-4')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  shopFilters.viewMode === 'grid-4' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
                }`}
                title="4 Column Grid"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => updateFilter('viewMode', 'grid-3')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  shopFilters.viewMode === 'grid-3' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
                }`}
                title="3 Column Grid"
              >
                <Grid3X3 size={15} />
              </button>
              <button
                onClick={() => updateFilter('viewMode', 'grid-2')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  shopFilters.viewMode === 'grid-2' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
                }`}
                title="2 Column Dense Grid"
              >
                <Grid2X2 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100 mb-6">
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
              Active Filters:
            </span>

            {shopFilters.search && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full text-black">
                Search: "{shopFilters.search}"
                <button onClick={() => updateFilter('search', '')} className="hover:text-red-500 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {shopFilters.gender !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full text-black uppercase">
                Gender: {shopFilters.gender}
                <button onClick={() => updateFilter('gender', 'all')} className="hover:text-red-500 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {shopFilters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full text-black">
                Category: {shopFilters.category}
                <button onClick={() => updateFilter('category', 'all')} className="hover:text-red-500 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {shopFilters.collection !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full text-black">
                Collection: {shopFilters.collection}
                <button onClick={() => updateFilter('collection', 'all')} className="hover:text-red-500 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {shopFilters.fit !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full text-black">
                Fit: {shopFilters.fit}
                <button onClick={() => updateFilter('fit', 'all')} className="hover:text-red-500 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {shopFilters.size !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full text-black">
                Size: {shopFilters.size}
                <button onClick={() => updateFilter('size', 'all')} className="hover:text-red-500 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {shopFilters.color !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full text-black">
                Color: {shopFilters.color}
                <button onClick={() => updateFilter('color', 'all')} className="hover:text-red-500 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {shopFilters.badge !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full text-black">
                Badge: {shopFilters.badge}
                <button onClick={() => updateFilter('badge', 'all')} className="hover:text-red-500 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {(shopFilters.priceRange[0] > 0 || shopFilters.priceRange[1] < 150) && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full text-black">
                Price: ${shopFilters.priceRange[0]} - ${shopFilters.priceRange[1]}
                <button onClick={() => updateFilter('priceRange', [0, 150])} className="hover:text-red-500 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {shopFilters.onSaleOnly && (
              <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full text-red-600">
                On Sale
                <button onClick={() => updateFilter('onSaleOnly', false)} className="hover:text-red-800 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {shopFilters.inStockOnly && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full text-emerald-700">
                In Stock Only
                <button onClick={() => updateFilter('inStockOnly', false)} className="hover:text-emerald-900 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="ml-auto text-xs font-extrabold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer underline pl-2"
            >
              <RotateCcw size={12} />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Content Layout: Sidebar + Product Grid */}
        <div className="flex gap-8 items-start mt-2">
          {/* Desktop Left Filter Sidebar */}
          <aside className={`w-64 shrink-0 space-y-6 hidden lg:block ${mobileFilterOpen ? '!block' : ''}`}>
            <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-6 sticky top-24 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-black" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-black">Filters</h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-bold text-gray-400 hover:text-black cursor-pointer underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Filter Group: Collections */}
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleSection('collection')}
                  className="flex items-center justify-between w-full text-xs font-black uppercase tracking-wider text-gray-900 hover:text-black py-1 cursor-pointer"
                >
                  <span>Collections</span>
                  {openSections.collection ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openSections.collection && (
                  <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    <label className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-black cursor-pointer py-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="collection-radio"
                          checked={shopFilters.collection === 'all'}
                          onChange={() => updateFilter('collection', 'all')}
                          className="accent-black"
                        />
                        <span>All Collections</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono font-bold">{products.length}</span>
                    </label>
                    {allCollections.map(col => {
                      const count = products.filter(p => p.collection === col).length;
                      return (
                        <label key={col} className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-black cursor-pointer py-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="collection-radio"
                              checked={shopFilters.collection === col}
                              onChange={() => updateFilter('collection', col)}
                              className="accent-black"
                            />
                            <span className="line-clamp-1">{col}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono font-bold">{count}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Filter Group: Categories */}
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between w-full text-xs font-black uppercase tracking-wider text-gray-900 hover:text-black py-1 cursor-pointer"
                >
                  <span>Product Category</span>
                  {openSections.category ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openSections.category && (
                  <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    <label className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-black cursor-pointer py-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category-radio"
                          checked={shopFilters.category === 'all'}
                          onChange={() => updateFilter('category', 'all')}
                          className="accent-black"
                        />
                        <span>All Categories</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono font-bold">{products.length}</span>
                    </label>
                    {allCategories.map(cat => {
                      const count = products.filter(p => p.category === cat).length;
                      return (
                        <label key={cat} className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-black cursor-pointer py-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="category-radio"
                              checked={shopFilters.category === cat}
                              onChange={() => updateFilter('category', cat)}
                              className="accent-black"
                            />
                            <span>{cat}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono font-bold">{count}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Filter Group: Sizes */}
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleSection('size')}
                  className="flex items-center justify-between w-full text-xs font-black uppercase tracking-wider text-gray-900 hover:text-black py-1 cursor-pointer"
                >
                  <span>Size</span>
                  {openSections.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openSections.size && (
                  <div className="mt-3 grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => updateFilter('size', 'all')}
                      className={`py-1.5 text-xs font-black rounded border transition-all cursor-pointer ${
                        shopFilters.size === 'all'
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      ALL
                    </button>
                    {allSizes.map(s => (
                      <button
                        key={s}
                        onClick={() => updateFilter('size', shopFilters.size === s ? 'all' : s)}
                        className={`py-1.5 text-xs font-black rounded border transition-all cursor-pointer ${
                          shopFilters.size === s
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter Group: Colors */}
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleSection('color')}
                  className="flex items-center justify-between w-full text-xs font-black uppercase tracking-wider text-gray-900 hover:text-black py-1 cursor-pointer"
                >
                  <span>Color</span>
                  {openSections.color ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openSections.color && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => updateFilter('color', 'all')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-full border transition-all cursor-pointer ${
                        shopFilters.color === 'all'
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      All Colors
                    </button>
                    {allColors.map(c => {
                      const isSelected = shopFilters.color.toLowerCase() === c.name.toLowerCase();
                      return (
                        <button
                          key={c.name}
                          onClick={() => updateFilter('color', isSelected ? 'all' : c.name)}
                          className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-black bg-gray-100 text-black font-black ring-1 ring-black'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                          title={c.name}
                        >
                          <span 
                            className="w-3 h-3 rounded-full border border-gray-300 shrink-0" 
                            style={{ backgroundColor: c.hex }} 
                          />
                          <span className="max-w-[70px] truncate">{c.name.split('/')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Filter Group: Price Range */}
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full text-xs font-black uppercase tracking-wider text-gray-900 hover:text-black py-1 cursor-pointer"
                >
                  <span>Price Range</span>
                  {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openSections.price && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-900 font-mono">
                      <span>${shopFilters.priceRange[0]}</span>
                      <span>${shopFilters.priceRange[1]}</span>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={150}
                      step={5}
                      value={shopFilters.priceRange[1]}
                      onChange={(e) => updateFilter('priceRange', [shopFilters.priceRange[0], Number(e.target.value)])}
                      className="w-full accent-black cursor-pointer"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateFilter('priceRange', [0, 50])}
                        className="flex-1 py-1 text-[10px] font-bold border border-gray-200 rounded hover:border-black cursor-pointer"
                      >
                        Under $50
                      </button>
                      <button
                        onClick={() => updateFilter('priceRange', [50, 80])}
                        className="flex-1 py-1 text-[10px] font-bold border border-gray-200 rounded hover:border-black cursor-pointer"
                      >
                        $50 - $80
                      </button>
                      <button
                        onClick={() => updateFilter('priceRange', [80, 150])}
                        className="flex-1 py-1 text-[10px] font-bold border border-gray-200 rounded hover:border-black cursor-pointer"
                      >
                        $80+
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Group: Fits */}
              {allFits.length > 0 && (
                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleSection('fit')}
                    className="flex items-center justify-between w-full text-xs font-black uppercase tracking-wider text-gray-900 hover:text-black py-1 cursor-pointer"
                  >
                    <span>Fit Type</span>
                    {openSections.fit ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {openSections.fit && (
                    <div className="mt-3 space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black cursor-pointer py-1">
                        <input
                          type="radio"
                          name="fit-radio"
                          checked={shopFilters.fit === 'all'}
                          onChange={() => updateFilter('fit', 'all')}
                          className="accent-black"
                        />
                        <span>All Fits</span>
                      </label>
                      {allFits.map(fit => (
                        <label key={fit} className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black cursor-pointer py-1">
                          <input
                            type="radio"
                            name="fit-radio"
                            checked={shopFilters.fit === fit}
                            onChange={() => updateFilter('fit', fit)}
                            className="accent-black"
                          />
                          <span>{fit}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Filter Group: Badges & Specials */}
              <div>
                <button
                  onClick={() => toggleSection('badge')}
                  className="flex items-center justify-between w-full text-xs font-black uppercase tracking-wider text-gray-900 hover:text-black py-1 cursor-pointer"
                >
                  <span>Badge & Status</span>
                  {openSections.badge ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openSections.badge && (
                  <div className="mt-3 space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black cursor-pointer py-1">
                      <input
                        type="radio"
                        name="badge-radio"
                        checked={shopFilters.badge === 'all'}
                        onChange={() => updateFilter('badge', 'all')}
                        className="accent-black"
                      />
                      <span>All Items</span>
                    </label>
                    {allBadges.map(b => (
                      <label key={b} className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black cursor-pointer py-1">
                        <input
                          type="radio"
                          name="badge-radio"
                          checked={shopFilters.badge === b}
                          onChange={() => updateFilter('badge', b)}
                          className="accent-black"
                        />
                        <span>{b}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              /* No Products Matching State */
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center my-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mx-auto">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-black">
                  No Products Found
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                  We couldn't find any products matching your selected filters. Try broadening your filter selections or clearing your search.
                </p>
                <div className="pt-2">
                  <button
                    onClick={resetFilters}
                    className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              /* Product Grid */
              <div
                className={`grid gap-4 sm:gap-6 ${
                  shopFilters.viewMode === 'grid-2'
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : shopFilters.viewMode === 'grid-3'
                    ? 'grid-cols-2 md:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {filteredProducts.map((product) => {
                  const isWishlisted = wishlist.includes(product.id);
                  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
                  const discountPercent = hasDiscount 
                    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
                    : 0;

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigateToProduct(product.id)}
                      className="group relative bg-white flex flex-col cursor-pointer transition-all duration-200 rounded-lg p-2 hover:shadow-xl hover:border-gray-200 border border-transparent"
                    >
                      {/* Product Image Container */}
                      <div className="relative aspect-3/4 w-full bg-gray-100 overflow-hidden rounded-md mb-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />

                        {product.images[1] && (
                          <img
                            src={product.images[1]}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        )}

                        {/* Top Left Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                          {product.badge && (
                            <span className="bg-black text-white text-[9px] font-black px-2 py-0.5 tracking-wider uppercase rounded-xs">
                              {product.badge}
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 tracking-wider uppercase rounded-xs">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Top Right Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-black cursor-pointer shadow-xs transition-transform active:scale-90"
                          title="Wishlist"
                        >
                          <Heart
                            size={16}
                            className={isWishlisted ? 'fill-pink-600 text-pink-600' : ''}
                          />
                        </button>

                        {/* Quick Add Button */}
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="absolute bottom-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all cursor-pointer shadow-md group-hover:scale-110"
                          title="Quick Add to Bag"
                        >
                          {addedSuccessId === product.id ? (
                            <Check size={16} className="text-emerald-400" />
                          ) : (
                            <Plus size={18} />
                          )}
                        </button>
                      </div>

                      {/* Color Swatches */}
                      {product.colors && product.colors.length > 1 && (
                        <div className="flex items-center gap-1 mb-1.5 px-0.5">
                          {product.colors.slice(0, 5).map((color, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setHoveredColor(prev => ({ ...prev, [product.id]: color.name }));
                              }}
                              className="w-3.5 h-3.5 rounded-full border border-gray-300 hover:scale-125 transition-transform cursor-pointer"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                          {product.colors.length > 5 && (
                            <span className="text-[9px] font-bold text-gray-400">
                              +{product.colors.length - 5}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="space-y-1 px-0.5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-extrabold text-xs text-gray-900 group-hover:underline line-clamp-1">
                              {product.name}
                            </h3>
                            {product.rating > 0 && (
                              <div className="flex items-center gap-0.5 text-[10px] font-bold text-gray-700 shrink-0">
                                <Star size={10} className="fill-black text-black" />
                                <span>{product.rating}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-[11px] font-medium text-gray-500 line-clamp-1">
                            {product.collection ? `${product.collection} • ` : ''}
                            {product.fit || 'Regular'}
                          </p>
                        </div>

                        {/* Price Display */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="font-black text-xs text-black font-mono">
                            US${product.price}
                          </span>
                          {hasDiscount && (
                            <span className="line-through text-gray-400 text-[11px] font-semibold font-mono">
                              US${product.comparePrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
