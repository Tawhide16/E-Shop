import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { OverviewTab } from './OverviewTab';
import { HomepageBuilderTab } from './HomepageBuilderTab';
import { ProductsTab } from './ProductsTab';
import { OrdersTab } from './OrdersTab';
import { MarketingTab } from './MarketingTab';
import { MediaLibraryTab } from './MediaLibraryTab';
import { SEOTab } from './SEOTab';
import { ThemeTab } from './ThemeTab';
import { AdminUsersTab } from './AdminUsersTab';
import gsap from 'gsap';
import { 
  LayoutDashboard, 
  Layers, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Image as ImageIcon, 
  Search, 
  BarChart3, 
  Globe, 
  Palette, 
  ShieldCheck, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  UserCircle,
  Sparkles,
  Home,
  Database,
  LogOut
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { 
    activeAdminTab, 
    setActiveAdminTab, 
    setActiveView, 
    setActiveStorefrontPage, 
    themeSettings, 
    dbStatus,
    currentAdminUser,
    logoutAdmin
  } = useStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainContentRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeAdminTab]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'homepage-builder', label: 'Homepage Builder', icon: Layers, badge: 'CMS' },
    { id: 'products', label: 'Product Catalog', icon: Package },
    { id: 'orders', label: 'Orders & Shipping', icon: ShoppingBag },
    { id: 'marketing', label: 'Marketing & Coupons', icon: Tag },
    { id: 'media', label: 'Media Assets', icon: ImageIcon },
    { id: 'seo', label: 'SEO Config', icon: Globe, badge: 'SEO' },
    { id: 'theme', label: 'Theme Customizer', icon: Palette },
    { id: 'users', label: 'Admin Users & Roles', icon: ShieldCheck }
  ];

  const handleGoToHomePage = () => {
    setActiveView('storefront');
    setActiveStorefrontPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans select-none text-gray-900">
      {/* Left Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`bg-black text-white transition-all duration-300 flex flex-col z-30 shrink-0 shadow-2xl ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Brand Header / Clickable Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {!sidebarCollapsed ? (
            <button
              onClick={handleGoToHomePage}
              className="flex items-center gap-2 cursor-pointer group text-left hover:opacity-90 transition-opacity"
              title="Click logo to go to Home Page"
            >
              {themeSettings?.logoUrl ? (
                <img 
                  src={themeSettings.logoUrl} 
                  alt="Store Logo" 
                  className="h-7 max-w-[130px] object-contain group-hover:scale-105 transition-transform" 
                />
              ) : (
                <div className="bg-white text-black p-1 rounded font-black text-xs shadow-sm group-hover:scale-105 transition-transform">
                  GS
                </div>
              )}
              <span className="font-extrabold uppercase text-sm font-mono tracking-tight text-white flex items-center gap-1.5 group-hover:underline">
                ADMIN CMS <Sparkles size={12} className="text-pink-500 animate-pulse" />
              </span>
            </button>
          ) : (
            <button
              onClick={handleGoToHomePage}
              className="bg-white text-black p-1 rounded font-black text-xs shadow-sm mx-auto cursor-pointer hover:scale-110 transition-transform"
              title="Click logo to go to Home Page"
            >
              GS
            </button>
          )}

          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800 cursor-pointer mx-auto transition-colors"
            title="Toggle Sidebar"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveAdminTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-white text-black font-extrabold shadow-md scale-[1.02]' 
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
                title={item.label}
              >
                <Icon size={18} className={`shrink-0 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                {!sidebarCollapsed && (
                  <div className="flex-1 flex justify-between items-center">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                        item.badge === 'SEO' ? 'bg-emerald-500 text-white' : 'bg-pink-600 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-3 border-t border-gray-800 space-y-1.5">
          <button 
            onClick={logoutAdmin}
            className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-200 p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-red-800/40"
            title="Sign Out of Admin"
          >
            <LogOut size={15} className="text-red-400" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>

          <button 
            onClick={handleGoToHomePage}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm hover:shadow-md active:scale-95"
            title="Go to Storefront Home Page"
          >
            <Home size={15} className="text-pink-400" />
            {!sidebarCollapsed && <span>Go to Home Page</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-100 h-16 px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <button 
              onClick={handleGoToHomePage}
              className="hover:text-black cursor-pointer underline decoration-dotted flex items-center gap-1 font-extrabold text-black"
              title="Go to Home Page"
            >
              <Home size={14} className="text-black" />
              <span>Gymshark Storefront</span>
            </button>
            <span>/</span>
            <span className="text-black uppercase font-black tracking-wide font-mono bg-gray-100 px-2 py-0.5 rounded">
              {activeAdminTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* MongoDB Connection Status Indicator */}
            <div 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                dbStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                  : 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
              }`}
              title={dbStatus === 'connected' ? 'Connected to MongoDB' : 'Running in Offline / LocalStorage Mode'}
            >
              <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <Database size={13} className={dbStatus === 'connected' ? 'text-emerald-600' : 'text-amber-600'} />
              <span>{dbStatus === 'connected' ? 'MongoDB: Connected' : 'DB: Offline Mode'}</span>
            </div>

            {/* Primary "Go to Home Page" Button */}
            <button 
              onClick={handleGoToHomePage}
              className="bg-black text-white hover:bg-gray-800 text-xs font-extrabold px-3.5 py-2 rounded-lg cursor-pointer flex items-center gap-2 shadow-sm transition-all active:scale-95"
              title="Go to Storefront Home Page"
            >
              <Home size={14} className="text-pink-400" />
              <span>Go to Home Page</span>
            </button>

            {/* User Profile & Logout Action */}
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              {currentAdminUser?.avatar ? (
                <img 
                  src={currentAdminUser.avatar} 
                  alt={currentAdminUser.name} 
                  className="w-8 h-8 rounded-full object-cover shadow-xs border border-gray-200" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black shadow-xs">
                  {currentAdminUser?.name ? currentAdminUser.name.substring(0, 2).toUpperCase() : 'AD'}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-extrabold text-black leading-none">{currentAdminUser?.name || 'Administrator'}</p>
                <p className="text-[10px] text-gray-400 leading-tight">{currentAdminUser?.role || 'Super Admin'}</p>
              </div>

              <button
                onClick={logoutAdmin}
                className="ml-1 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                title="Sign Out of Admin"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Render Tab Content with GSAP Animation */}
        <main ref={mainContentRef} className="p-6 flex-1 overflow-y-auto">
          {activeAdminTab === 'overview' && <OverviewTab />}
          {activeAdminTab === 'homepage-builder' && <HomepageBuilderTab />}
          {activeAdminTab === 'products' && <ProductsTab />}
          {activeAdminTab === 'orders' && <OrdersTab />}
          {activeAdminTab === 'marketing' && <MarketingTab />}
          {activeAdminTab === 'media' && <MediaLibraryTab />}
          {activeAdminTab === 'seo' && <SEOTab />}
          {activeAdminTab === 'theme' && <ThemeTab />}
          {activeAdminTab === 'users' && <AdminUsersTab />}
        </main>
      </div>
    </div>
  );
};
