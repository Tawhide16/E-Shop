import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SectionConfig, 
  Product, 
  Order, 
  Customer, 
  MenuItem, 
  Coupon, 
  MediaAsset, 
  SEOSettings, 
  GlobalThemeSettings,
  AdminUser,
  VersionSnapshot
} from '../types/cms';
import { ShopFilterState, DEFAULT_SHOP_FILTERS } from '../types/shop';
import { 
  INITIAL_SECTIONS, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_COUPONS, 
  INITIAL_MEDIA, 
  INITIAL_SEO, 
  INITIAL_THEME,
  INITIAL_ADMIN_USERS
} from '../data/initialData';
import {
  fetchHealth,
  fetchProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  fetchOrders,
  createOrderApi,
  updateOrderStatusApi,
  fetchSections,
  saveSectionsApi,
  fetchCustomers,
  fetchCoupons,
  fetchSettings,
  saveSettingsApi
} from '../services/api';

export interface CartItem {
  product: Product;
  color: string;
  size: string;
  quantity: number;
}

interface StoreContextType {
  // Live Storefront State
  sections: SectionConfig[];
  draftSections: SectionConfig[];
  isDraftModified: boolean;
  versionHistory: VersionSnapshot[];
  
  // Navigation & View State
  activeView: 'storefront' | 'admin';
  activeStorefrontPage: 'home' | 'shop' | 'product-detail' | 'category' | 'cart' | 'checkout';
  selectedProductId: string;
  activeAdminTab: string;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  
  // Catalog & Ecommerce Data
  products: Product[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  mediaAssets: MediaAsset[];
  menuItems: MenuItem[];
  seoSettings: SEOSettings;
  themeSettings: GlobalThemeSettings;
  adminUsers: AdminUser[];
  addAdminUser: (user: Omit<AdminUser, 'id'>) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  dbStatus: 'connected' | 'disconnected' | 'checking';
  
  // Admin Authentication
  currentAdminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  
  // Cart & Wishlist
  cart: CartItem[];
  isCartOpen: boolean;
  wishlist: string[];

  // Shop Page Filters State
  shopFilters: ShopFilterState;
  setShopFilters: React.Dispatch<React.SetStateAction<ShopFilterState>>;
  navigateToShop: (filters?: Partial<ShopFilterState>) => void;
  
  // Functions & Actions
  setActiveView: (view: 'storefront' | 'admin') => void;
  setActiveStorefrontPage: (page: 'home' | 'shop' | 'product-detail' | 'category' | 'cart' | 'checkout') => void;
  setSelectedProductId: (id: string) => void;
  navigateToProduct: (productId: string) => void;
  setActiveAdminTab: (tab: string) => void;
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  
  // CMS Section Builders
  updateDraftSections: (newSections: SectionConfig[]) => void;
  updateSection: (sectionId: string, updatedFields: Partial<SectionConfig>) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: 'up' | 'down') => void;
  addSection: (type: SectionConfig['type']) => void;
  deleteSection: (sectionId: string) => void;
  publishHomepage: (note?: string) => void;
  discardDraftChanges: () => void;
  restoreVersion: (versionId: string) => void;
  
  // Ecommerce Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkUpdateProducts: (ids: string[], updates: Partial<Product> | ((p: Product) => Partial<Product>)) => void;
  bulkDeleteProducts: (ids: string[]) => void;
  updateOrderStatus: (orderId: string, status: Order['fulfillmentStatus']) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateSEOSettings: (settings: Partial<SEOSettings>) => void;
  updateThemeSettings: (settings: Partial<GlobalThemeSettings>) => void;
  updateMenuItems: (items: MenuItem[]) => void;
  
  // Categories Management
  categories: string[];
  addCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;

  // Media Asset Actions
  addMediaAsset: (asset: { filename: string; url: string; category?: MediaAsset['category']; fileSize?: string; dimensions?: string }) => void;
  deleteMediaAsset: (id: string) => void;

  // Cart & Wishlist Actions
  addToCart: (product: Product, color: string, size: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;
  setIsCartOpen: (open: boolean) => void;
  toggleWishlist: (productId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ensureFavoritesBanner = (secList: SectionConfig[]): SectionConfig[] => {
  if (secList.some(s => s.id === 'sec-banner-favorites')) {
    return secList;
  }
  const favIndex = secList.findIndex(s => s.id === 'sec-favorites-categories' || s.title === 'FAVORITES');
  const bannerSection: SectionConfig = {
    id: 'sec-banner-favorites',
    type: 'promo_banner',
    title: 'FEATURED FAVORITES COLLECTION',
    subtitle: 'Engineered for comfort and unmatched performance. Shop our top-rated styles.',
    enabled: true,
    order: favIndex !== -1 ? secList[favIndex].order + 0.5 : 6.5,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=1600',
      primaryBtnText: 'Shop Favorites',
      primaryBtnUrl: '/collections/favorites',
      secondaryBtnText: 'View All',
      secondaryBtnUrl: '/collections/all'
    },
    styles: {
      overlayDarkness: 35,
      textAlign: 'left'
    },
    metrics: { views: 42100, clicks: 3890, ctr: 9.24 }
  };

  if (favIndex === -1) {
    return [...secList, bannerSection];
  }
  const updated = [...secList];
  updated.splice(favIndex + 1, 0, bannerSection);
  return updated.map((s, idx) => ({ ...s, order: idx + 1 }));
};

export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (err: any) {
    console.warn(`[Storage Warning] Storage limit reached for ${key}:`, err?.name || err);
    try {
      localStorage.removeItem('gymshark_cms_versions');
      localStorage.removeItem('gymshark_media_assets');
      if (key !== 'gymshark_cms_draft_sections') {
        localStorage.removeItem('gymshark_cms_draft_sections');
      }
      localStorage.setItem(key, value);
    } catch {
      try {
        if (key !== 'gymshark_cms_sections') {
          localStorage.removeItem('gymshark_cms_sections');
        }
        localStorage.setItem(key, value);
      } catch {
        // Fallback to memory state; NEVER crash React!
      }
    }
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with localStorage fallbacks
  const [sections, setSections] = useState<SectionConfig[]>(() => {
    try {
      const saved = localStorage.getItem('gymshark_cms_sections');
      if (saved) {
        return ensureFavoritesBanner(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error parsing saved sections:', e);
    }
    return ensureFavoritesBanner(INITIAL_SECTIONS);
  });

  const [draftSections, setDraftSections] = useState<SectionConfig[]>(() => {
    try {
      const saved = localStorage.getItem('gymshark_cms_draft_sections');
      if (saved) {
        return ensureFavoritesBanner(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error parsing saved draft sections:', e);
    }
    return ensureFavoritesBanner(INITIAL_SECTIONS);
  });

  const [versionHistory, setVersionHistory] = useState<VersionSnapshot[]>(() => {
    const saved = localStorage.getItem('gymshark_cms_versions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ver-initial',
        timestamp: new Date().toLocaleString(),
        author: 'System Admin',
        note: 'Initial Gymshark Layout Baseline',
        sections: INITIAL_SECTIONS
      }
    ];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gymshark_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gymshark_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Exclude any template dummy orders
          return parsed.filter((o: any) => 
            !['ORD-10284', 'ORD-10283', 'ORD-10282'].includes(o.id) &&
            !['sarah.j@example.com', 'marcus.v@example.com', 'elena.r@example.com'].includes(o.customerEmail)
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('gymshark_customers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((c: any) => 
            !['cust-1', 'cust-2', 'cust-3'].includes(c.id) &&
            !['sarah.j@example.com', 'marcus.v@example.com', 'elena.r@example.com'].includes(c.email)
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('gymshark_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return ['Leggings', 'Shorts', 'Hoodies', 'Sports Bras', 'Tops', 'Joggers'];
  });

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    const saved = localStorage.getItem('gymshark_media_assets');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('gymshark_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(INITIAL_SEO);
  const [themeSettings, setThemeSettings] = useState<GlobalThemeSettings>(() => {
    const saved = localStorage.getItem('gymshark_theme_settings');
    return saved ? JSON.parse(saved) : INITIAL_THEME;
  });
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('gymshark_admin_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved admin users:', e);
      }
    }
    return INITIAL_ADMIN_USERS;
  });
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Admin authentication state
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('gymshark_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  const isAdminAuthenticated = !!currentAdminUser;

  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Match existing admin accounts or default master admin credentials
    const foundUser = adminUsers.find(u => u.email.toLowerCase() === cleanEmail);

    const isPasswordValid = foundUser?.password
      ? (cleanPassword === foundUser.password || cleanPassword === 'admin123')
      : (cleanPassword === 'admin123' || cleanPassword === '123456' || cleanPassword === 'admin');

    if (
      (cleanEmail === 'admin@eshop.com' || cleanEmail === 'lox.bd0.1@gmail.com' || foundUser) &&
      isPasswordValid
    ) {
      const userToLogin: AdminUser = foundUser || {
        id: 'user-admin',
        name: 'Administrator',
        email: cleanEmail,
        role: 'Super Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      };

      setCurrentAdminUser(userToLogin);
      safeSetItem('gymshark_admin_session', JSON.stringify(userToLogin));
      return { success: true };
    }

    return { success: false, message: 'Invalid email or password. (Default password: admin123)' };
  };

  const logoutAdmin = () => {
    setCurrentAdminUser(null);
    try {
      localStorage.removeItem('gymshark_admin_session');
    } catch {}
  };

  const addAdminUser = (userData: Omit<AdminUser, 'id'>) => {
    const newUser: AdminUser = {
      ...userData,
      id: `admin-${Date.now()}`,
      status: userData.status || 'active',
      lastActive: 'Just now',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`
    };
    setAdminUsers(prev => {
      const updated = [...prev, newUser];
      safeSetItem('gymshark_admin_users', JSON.stringify(updated));
      return updated;
    });
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers(prev => {
      const updated = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      safeSetItem('gymshark_admin_users', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers(prev => {
      const target = prev.find(u => u.id === id);
      if (target?.email.toLowerCase() === 'lox.bd0.1@gmail.com') {
        alert('Primary Super Admin (lox.bd0.1@gmail.com) cannot be deleted!');
        return prev;
      }
      const updated = prev.filter(u => u.id !== id);
      safeSetItem('gymshark_admin_users', JSON.stringify(updated));
      return updated;
    });
  };

  // Initial load from MongoDB API
  useEffect(() => {
    let isMounted = true;
    async function loadDataFromBackend() {
      try {
        const health = await fetchHealth().catch(() => null);
        if (isMounted) {
          setDbStatus(health?.database === 'connected' ? 'connected' : 'disconnected');
        }

        const remoteProducts = await fetchProducts().catch(() => null);
        if (isMounted && remoteProducts && remoteProducts.length > 0) {
          const savedLocal = localStorage.getItem('gymshark_products');
          if (savedLocal) {
            try {
              const localList: Product[] = JSON.parse(savedLocal);
              const remoteIds = new Set(remoteProducts.map(p => p.id));
              const missingLocals = localList.filter(p => !remoteIds.has(p.id));
              if (missingLocals.length > 0) {
                missingLocals.forEach(p => createProductApi(p).catch(() => {}));
                setProducts([...remoteProducts, ...missingLocals]);
              } else {
                setProducts(remoteProducts);
              }
            } catch {
              setProducts(remoteProducts);
            }
          } else {
            setProducts(remoteProducts);
          }
        }

        const remoteSections = await fetchSections().catch(() => null);
        if (isMounted && remoteSections && remoteSections.length > 0) {
          const localSaved = localStorage.getItem('gymshark_cms_sections');
          let resolvedSections = remoteSections;
          if (localSaved) {
            try {
              const localSections: SectionConfig[] = JSON.parse(localSaved);
              const localHasCustomBanner = localSections.some(s => 
                (s.settings?.bannerImage && !s.settings.bannerImage.includes('unsplash.com')) ||
                (s.settings?.heroSlides?.[0]?.desktopImage && !s.settings.heroSlides[0].desktopImage.includes('unsplash.com'))
              );
              const remoteHasCustomBanner = remoteSections.some(s => 
                (s.settings?.bannerImage && !s.settings.bannerImage.includes('unsplash.com')) ||
                (s.settings?.heroSlides?.[0]?.desktopImage && !s.settings.heroSlides[0].desktopImage.includes('unsplash.com'))
              );

              if (localHasCustomBanner && !remoteHasCustomBanner) {
                resolvedSections = localSections;
                saveSectionsApi(localSections).catch(() => {});
              }
            } catch {}
          }

          setSections(ensureFavoritesBanner(resolvedSections));
          setDraftSections(ensureFavoritesBanner(resolvedSections));
        }

        const remoteOrders = await fetchOrders().catch(() => null);
        if (isMounted && remoteOrders) {
          const savedLocal = localStorage.getItem('gymshark_orders');
          if (savedLocal) {
            try {
              const localList: Order[] = JSON.parse(savedLocal);
              const remoteIds = new Set(remoteOrders.map(o => o.id));
              const missingLocals = localList.filter(o => !remoteIds.has(o.id));
              if (missingLocals.length > 0) {
                missingLocals.forEach(o => createOrderApi(o).catch(() => {}));
                setOrders([...remoteOrders, ...missingLocals]);
              } else if (remoteOrders.length > 0) {
                setOrders(remoteOrders);
              }
            } catch {
              if (remoteOrders.length > 0) setOrders(remoteOrders);
            }
          } else if (remoteOrders.length > 0) {
            setOrders(remoteOrders);
          }
        }

        const remoteCustomers = await fetchCustomers().catch(() => null);
        if (isMounted && remoteCustomers && remoteCustomers.length > 0) {
          setCustomers(remoteCustomers);
        }

        const remoteCoupons = await fetchCoupons().catch(() => null);
        if (isMounted && remoteCoupons && remoteCoupons.length > 0) {
          setCoupons(remoteCoupons);
        }

        const remoteSettings = await fetchSettings().catch(() => null);
        if (isMounted && remoteSettings) {
          if (remoteSettings.seo) setSeoSettings(remoteSettings.seo);
          if (remoteSettings.theme) setThemeSettings(remoteSettings.theme);
        }
      } catch (err) {
        console.warn('Backend connection note:', err);
        if (isMounted) setDbStatus('disconnected');
      }
    }
    loadDataFromBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  // View state
  const [activeView, setActiveView] = useState<'storefront' | 'admin'>('storefront');
  const [activeStorefrontPage, setActiveStorefrontPage] = useState<'home' | 'shop' | 'product-detail' | 'category' | 'cart' | 'checkout'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-1'); // Default Whitney leggings
  const [activeAdminTab, setActiveAdminTab] = useState<string>('overview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Shop filter state
  const [shopFilters, setShopFilters] = useState<ShopFilterState>(DEFAULT_SHOP_FILTERS);

  // E-commerce state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Check if draft has uncommitted changes
  const isDraftModified = JSON.stringify(sections) !== JSON.stringify(draftSections);

  // Sync to localStorage safely
  useEffect(() => {
    safeSetItem('gymshark_cms_sections', JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    safeSetItem('gymshark_cms_draft_sections', JSON.stringify(draftSections));
  }, [draftSections]);

  useEffect(() => {
    safeSetItem('gymshark_cms_versions', JSON.stringify(versionHistory));
  }, [versionHistory]);

  useEffect(() => {
    safeSetItem('gymshark_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    safeSetItem('gymshark_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    safeSetItem('gymshark_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    safeSetItem('gymshark_theme_settings', JSON.stringify(themeSettings));
  }, [themeSettings]);

  // Actions
  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveStorefrontPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToShop = (filters?: Partial<ShopFilterState>) => {
    if (filters) {
      setShopFilters(prev => ({
        ...DEFAULT_SHOP_FILTERS,
        ...filters
      }));
    }
    setActiveStorefrontPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateDraftSections = (newSections: SectionConfig[]) => {
    setDraftSections(newSections);
  };

  const updateSection = (sectionId: string, updatedFields: Partial<SectionConfig>) => {
    setDraftSections(prev => 
      prev.map(sec => sec.id === sectionId ? { ...sec, ...updatedFields } : sec)
    );
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setDraftSections(prev =>
      prev.map(sec => sec.id === sectionId ? { ...sec, enabled: !sec.enabled } : sec)
    );
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    setDraftSections(prev => {
      const index = prev.findIndex(s => s.id === sectionId);
      if (index < 0) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const newArr = [...prev];
      const temp = newArr[index];
      newArr[index] = newArr[targetIndex];
      newArr[targetIndex] = temp;

      // Re-assign order numbers
      return newArr.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    });
  };

  const addSection = (type: SectionConfig['type']) => {
    const id = `sec-${type}-${Date.now()}`;
    const newSection: SectionConfig = {
      id,
      type,
      title: type.toUpperCase().replace('_', ' '),
      enabled: true,
      order: draftSections.length + 1,
      settings: {
        productCount: 4,
        columnsDesktop: 4
      },
      styles: {
        paddingY: 'medium'
      }
    };
    setDraftSections(prev => [...prev, newSection]);
  };

  const deleteSection = (sectionId: string) => {
    setDraftSections(prev => prev.filter(s => s.id !== sectionId));
  };

  const publishHomepage = (note: string = 'Published changes from Admin') => {
    setSections(draftSections);
    const newSnapshot: VersionSnapshot = {
      id: `ver-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      author: 'Admin User',
      note,
      sections: draftSections
    };
    setVersionHistory(prev => [newSnapshot, ...prev]);
    saveSectionsApi(draftSections).catch(console.error);
  };

  const discardDraftChanges = () => {
    setDraftSections(sections);
  };

  const restoreVersion = (versionId: string) => {
    const snapshot = versionHistory.find(v => v.id === versionId);
    if (snapshot) {
      setSections(snapshot.sections);
      setDraftSections(snapshot.sections);
      saveSectionsApi(snapshot.sections).catch(console.error);
    }
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      status: 'active'
    };
    setProducts(prev => [newProd, ...prev]);
    createProductApi(newProd).catch(console.error);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    updateProductApi(id, updatedFields).catch(console.error);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      safeSetItem('gymshark_products', JSON.stringify(updated));
      return updated;
    });
    deleteProductApi(id).catch(console.error);
  };

  const bulkUpdateProducts = (ids: string[], updates: Partial<Product> | ((p: Product) => Partial<Product>)) => {
    setProducts(prev => {
      const updated = prev.map(p => {
        if (ids.includes(p.id)) {
          const patch = typeof updates === 'function' ? updates(p) : updates;
          return { ...p, ...patch };
        }
        return p;
      });
      safeSetItem('gymshark_products', JSON.stringify(updated));
      return updated;
    });

    ids.forEach(id => {
      const p = products.find(prod => prod.id === id);
      const patch = typeof updates === 'function' ? (p ? updates(p) : {}) : updates;
      updateProductApi(id, patch).catch(() => {});
    });
  };

  const bulkDeleteProducts = (ids: string[]) => {
    setProducts(prev => {
      const updated = prev.filter(p => !ids.includes(p.id));
      safeSetItem('gymshark_products', JSON.stringify(updated));
      return updated;
    });
    ids.forEach(id => {
      deleteProductApi(id).catch(() => {});
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['fulfillmentStatus']) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, fulfillmentStatus: status } : o);
      safeSetItem('gymshark_orders', JSON.stringify(updated));
      return updated;
    });
    updateOrderStatusApi(orderId, status).catch(console.error);
  };

  const addCoupon = (couponData: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      timesUsed: 0,
      status: 'active'
    };
    setCoupons(prev => [newCoupon, ...prev]);
  };

  const updateSEOSettings = (settings: Partial<SEOSettings>) => {
    setSeoSettings(prev => {
      const updated = { ...prev, ...settings };
      saveSettingsApi({ seo: updated }).catch(console.error);
      return updated;
    });
  };

  const updateThemeSettings = (settings: Partial<GlobalThemeSettings>) => {
    setThemeSettings(prev => {
      const updated = { ...prev, ...settings };
      saveSettingsApi({ theme: updated }).catch(console.error);
      return updated;
    });
  };

  const updateMenuItems = (items: MenuItem[]) => {
    setMenuItems(items);
    safeSetItem('gymshark_menu_items', JSON.stringify(items));
  };

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) return;
    const updated = [...categories, trimmed];
    setCategories(updated);
    safeSetItem('gymshark_categories', JSON.stringify(updated));
  };

  const updateCategory = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName.toLowerCase() === trimmed.toLowerCase()) return;
    const updated = categories.map(c => c === oldName ? trimmed : c);
    setCategories(updated);
    safeSetItem('gymshark_categories', JSON.stringify(updated));

    // Update all matching products in memory and localStorage
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(p => {
        if (p.category === oldName) {
          return { ...p, category: trimmed };
        }
        return p;
      });
      safeSetItem('gymshark_products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    // Also update any matching product on backend API
    products.filter(p => p.category === oldName).forEach(p => {
      updateProductApi(p.id, { category: trimmed }).catch(() => {});
    });
  };

  const deleteCategory = (categoryName: string) => {
    const updated = categories.filter(c => c !== categoryName);
    setCategories(updated);
    safeSetItem('gymshark_categories', JSON.stringify(updated));

    const fallback = updated[0] || 'Uncategorized';
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(p => {
        if (p.category === categoryName) {
          return { ...p, category: fallback };
        }
        return p;
      });
      safeSetItem('gymshark_products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  const addMediaAsset = (asset: { filename: string; url: string; category?: MediaAsset['category']; fileSize?: string; dimensions?: string }) => {
    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      filename: asset.filename || 'uploaded_image.png',
      url: asset.url,
      category: asset.category || 'banners',
      fileSize: asset.fileSize || '320 KB',
      dimensions: asset.dimensions || '1200x800',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newAsset, ...mediaAssets];
    setMediaAssets(updated);
    safeSetItem('gymshark_media_assets', JSON.stringify(updated));
  };

  const deleteMediaAsset = (id: string) => {
    const updated = mediaAssets.filter(m => m.id !== id);
    setMediaAssets(updated);
    safeSetItem('gymshark_media_assets', JSON.stringify(updated));
  };

  const addToCart = (product: Product, color: string, size: string, quantity: number = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id && item.color === color && item.size === size);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, color, size, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => prev.map((item, idx) => idx === index ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => {
    const newOrderNumber = `LOX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    
    // Save order in state and localStorage
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      safeSetItem('gymshark_orders', JSON.stringify(updated));
      return updated;
    });

    // Update real-time customer analytics
    setCustomers(prev => {
      const cleanEmail = (newOrder.customerEmail || '').toLowerCase().trim();
      const existing = prev.find(c => c.email.toLowerCase().trim() === cleanEmail);
      let updatedCust: Customer[];
      if (existing) {
        updatedCust = prev.map(c => c.id === existing.id ? {
          ...c,
          totalOrders: (c.totalOrders || 0) + 1,
          totalSpent: (c.totalSpent || 0) + newOrder.totalAmount,
          lastOrderDate: new Date().toISOString().split('T')[0]
        } : c);
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: newOrder.customerName || 'Customer',
          email: newOrder.customerEmail || 'guest@eshop.com',
          totalOrders: 1,
          totalSpent: newOrder.totalAmount,
          lastOrderDate: new Date().toISOString().split('T')[0],
          status: 'active'
        };
        updatedCust = [newCust, ...prev];
      }
      safeSetItem('gymshark_customers', JSON.stringify(updatedCust));
      return updatedCust;
    });

    clearCart();
    createOrderApi(newOrder).catch(console.error);
    return newOrder;
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  return (
    <StoreContext.Provider value={{
      sections,
      draftSections,
      isDraftModified,
      versionHistory,
      activeView,
      activeStorefrontPage,
      selectedProductId,
      activeAdminTab,
      previewDevice,
      products,
      orders,
      customers,
      coupons,
      categories,
      mediaAssets,
      menuItems,
      seoSettings,
      themeSettings,
      adminUsers,
      addAdminUser,
      updateAdminUser,
      deleteAdminUser,
      dbStatus,
      currentAdminUser,
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin,
      cart,
      isCartOpen,
      wishlist,
      shopFilters,
      setShopFilters,
      navigateToShop,
      setActiveView,
      setActiveStorefrontPage,
      setSelectedProductId,
      navigateToProduct,
      setActiveAdminTab,
      setPreviewDevice,
      updateDraftSections,
      updateSection,
      toggleSectionVisibility,
      moveSection,
      addSection,
      deleteSection,
      publishHomepage,
      discardDraftChanges,
      restoreVersion,
      addProduct,
      updateProduct,
      deleteProduct,
      bulkUpdateProducts,
      bulkDeleteProducts,
      updateOrderStatus,
      addCoupon,
      updateSEOSettings,
      updateThemeSettings,
      updateMenuItems,
      addCategory,
      updateCategory,
      deleteCategory,
      addMediaAsset,
      deleteMediaAsset,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      setIsCartOpen,
      toggleWishlist
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
