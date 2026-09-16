import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  Heart, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  Pause, 
  Play, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Lock
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    sections, 
    menuItems, 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    wishlist, 
    activeStorefrontPage,
    setActiveStorefrontPage,
    setActiveView,
    activeView,
    products,
    navigateToProduct,
    navigateToShop,
    themeSettings,
    isAdminAuthenticated
  } = useStore();

  const [activeAnnouncementIdx, setActiveAnnouncementIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle header navigation
  const handleNavClick = (item: { label: string; url: string }) => {
    const label = item.label.toUpperCase();
    if (label.includes('WOMEN')) {
      navigateToShop({ gender: 'women', category: 'all', collection: 'all' });
    } else if (label.includes('MEN')) {
      navigateToShop({ gender: 'men', category: 'all', collection: 'all' });
    } else if (label.includes('COLLECTION')) {
      navigateToShop({ collection: 'all' });
    } else if (label.includes('SALE') || label.includes('OUTLET')) {
      navigateToShop({ onSaleOnly: true });
    } else if (label.includes('SHOP') || label.includes('CATALOG') || label.includes('PRODUCT')) {
      navigateToShop({});
    } else {
      navigateToShop({});
    }
  };

  const handleSubItemClick = (sub: { label: string; url: string }) => {
    setHoveredMenuId(null);
    setMobileMenuOpen(false);
    const label = sub.label.toLowerCase();

    if (label.includes('legging')) {
      navigateToShop({ category: 'Leggings' });
    } else if (label.includes('bra') || label.includes('crop top')) {
      navigateToShop({ category: 'Sports Bras' });
    } else if (label.includes('hoodie') || label.includes('sweat')) {
      navigateToShop({ category: 'Hoodies' });
    } else if (label.includes('pant') || label.includes('jogger')) {
      navigateToShop({ category: 'Pants' });
    } else if (label.includes('short')) {
      navigateToShop({ category: 'Shorts' });
    } else if (label.includes('top') || label.includes('t-shirt') || label.includes('tee')) {
      navigateToShop({ category: 'Tops' });
    } else if (label.includes('whitney')) {
      navigateToShop({ collection: 'Whitney x Adapt' });
    } else if (label.includes('bratz')) {
      navigateToShop({ collection: 'Bratz' });
    } else if (label.includes('power')) {
      navigateToShop({ collection: 'Power' });
    } else if (label.includes('vital') || label.includes('seamless')) {
      navigateToShop({ collection: 'Vital Seamless' });
    } else if (label.includes('crest')) {
      navigateToShop({ collection: 'Crest' });
    } else if (label.includes('campus')) {
      navigateToShop({ collection: 'Campus' });
    } else if (label.includes('apex')) {
      navigateToShop({ collection: 'Apex Performance' });
    } else if (label.includes('sale') || label.includes('discount')) {
      navigateToShop({ onSaleOnly: true });
    } else {
      navigateToShop({ search: sub.label });
    }
  };

  // Find announcement config from sections
  const announcementSec = sections.find(s => s.type === 'announcement' && s.enabled);
  const messages = announcementSec?.settings.productCardSettings ? [] : (announcementSec?.settings.announcementMessages || [
    'Get $10 off when you refer a friend',
    'Students get an extra 15% off',
    'Free Shipping on orders over $100'
  ]);

  // Rotate announcement messages
  useEffect(() => {
    if (!announcementSec || isPaused || messages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveAnnouncementIdx(prev => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcementSec, isPaused, messages.length]);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = searchQuery.trim() 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs select-none">
      {/* Top Announcement Bar */}
      {announcementSec && isAnnouncementVisible && messages.length > 0 && (
        <div 
          className="relative px-4 py-1.5 text-xs font-semibold text-center transition-colors flex items-center justify-between"
          style={{ 
            backgroundColor: announcementSec.styles.backgroundColor || '#000000', 
            color: announcementSec.styles.textColor || '#FFFFFF' 
          }}
        >
          <div className="flex-1 flex justify-center items-center gap-2">
            <span className="truncate tracking-wide uppercase">{messages[activeAnnouncementIdx]}</span>
            {messages.length > 1 && (
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="opacity-70 hover:opacity-100 text-[10px] ml-1 p-0.5 rounded cursor-pointer"
                title={isPaused ? "Play slide" : "Pause slide"}
              >
                {isPaused ? <Play size={10} /> : <Pause size={10} />}
              </button>
            )}
          </div>

          {announcementSec.settings.showCloseAnnouncement && (
            <button 
              onClick={() => setIsAnnouncementVisible(false)}
              className="opacity-70 hover:opacity-100 cursor-pointer p-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Mobile Hamburger Button */}
        <div className="flex items-center lg:hidden">
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="p-2 -ml-2 text-gray-800 hover:text-black cursor-pointer"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => { setActiveStorefrontPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-1.5 cursor-pointer text-left group"
          >
            {themeSettings?.logoUrl ? (
              <img 
                src={themeSettings.logoUrl} 
                alt="Storefront Logo" 
                style={{ height: themeSettings.logoHeight ? `${themeSettings.logoHeight}px` : '32px' }}
                className="max-w-[180px] w-auto object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <>
                <div className="bg-black text-white p-1 rounded-sm font-black tracking-tighter text-lg leading-none">
                  GS
                </div>
                <span className="font-extrabold tracking-tighter text-xl text-black uppercase font-mono">
                  GYMSHARK
                </span>
              </>
            )}
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wider">
            {/* Direct Shop All Button */}
            <button
              onClick={() => navigateToShop({})}
              className={`flex items-center gap-1 cursor-pointer uppercase py-1 border-b-2 transition-all font-black ${
                activeStorefrontPage === 'shop'
                  ? 'text-black border-black font-extrabold'
                  : 'text-gray-900 hover:text-black border-transparent hover:border-black'
              }`}
            >
              SHOP ALL
            </button>

            {menuItems.map(item => (
              <div 
                key={item.id}
                className="relative py-5"
                onMouseEnter={() => setHoveredMenuId(item.id)}
                onMouseLeave={() => setHoveredMenuId(null)}
              >
                <button 
                  onClick={() => handleNavClick(item)}
                  className="flex items-center gap-1 text-gray-900 hover:text-black cursor-pointer uppercase py-1 border-b-2 border-transparent hover:border-black transition-all font-semibold"
                >
                  {item.label}
                  {item.isMegaMenu && <ChevronDown size={12} />}
                </button>

                {/* Mega Menu Dropdown */}
                {item.isMegaMenu && hoveredMenuId === item.id && item.children && (
                  <div className="absolute top-full left-0 w-[520px] bg-white border border-gray-100 shadow-2xl p-6 rounded-b-lg grid grid-cols-2 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {item.children.map((child, idx) => (
                      <div key={idx}>
                        <h4 className="text-[11px] font-black tracking-wider text-gray-400 mb-3 uppercase">
                          {child.title}
                        </h4>
                        <ul className="space-y-2">
                          {child.items.map((sub, subIdx) => (
                            <li key={subIdx}>
                              <button 
                                onClick={() => handleSubItemClick(sub)}
                                className="flex items-center justify-between w-full text-xs font-medium text-gray-700 hover:text-black hover:font-bold transition-all py-0.5 text-left cursor-pointer"
                              >
                                <span>{sub.label}</span>
                                {sub.badge && (
                                  <span className="bg-pink-100 text-pink-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-xs uppercase">
                                    {sub.badge}
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Utility Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Admin Login / Dashboard Button */}
          {activeView === 'storefront' && (
            <button
              onClick={() => setActiveView('admin')}
              className="hidden sm:flex items-center gap-1.5 bg-black text-white hover:bg-gray-800 text-xs font-bold px-3.5 py-1.5 rounded-full cursor-pointer transition-transform active:scale-95 shadow-xs"
              title={isAdminAuthenticated ? "Go to Admin Dashboard" : "Admin Login"}
            >
              {isAdminAuthenticated ? <SlidersHorizontal size={13} /> : <Lock size={13} />}
              <span>{isAdminAuthenticated ? 'Admin Dashboard' : 'Login'}</span>
            </button>
          )}

          {/* Search Trigger */}
          <button 
            onClick={() => setSearchOpen(true)}
            className="p-2 text-gray-700 hover:text-black cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
            title="Search products"
          >
            <Search size={20} />
          </button>

          {/* Wishlist */}
          <button 
            onClick={() => setActiveStorefrontPage('home')}
            className="relative p-2 text-gray-700 hover:text-black cursor-pointer rounded-full hover:bg-gray-100 transition-colors hidden sm:block"
            title="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-pink-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User Account */}
          <button 
            onClick={() => setActiveView('admin')}
            className="p-2 text-gray-700 hover:text-black cursor-pointer rounded-full hover:bg-gray-100 transition-colors hidden sm:block"
            title="Admin Login / Account"
          >
            <User size={20} />
          </button>

          {/* Bag / Cart Icon */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:text-black cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
            title="Shopping Bag"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-black text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative bg-white w-4/5 max-w-sm h-full flex flex-col z-10 shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="font-extrabold text-lg uppercase tracking-tight">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <nav className="py-6 space-y-4 font-bold text-sm">
              {/* Mobile Direct Shop All */}
              <div className="border-b border-gray-100 pb-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigateToShop({}); }}
                  className="block text-left w-full uppercase py-1 text-pink-600 hover:text-pink-700 font-black text-base flex items-center justify-between"
                >
                  <span>SHOP ALL PRODUCTS</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {menuItems.map(item => (
                <div key={item.id} className="border-b border-gray-50 pb-3">
                  <button 
                    onClick={() => { setMobileMenuOpen(false); handleNavClick(item); }}
                    className="block text-left w-full uppercase py-1 text-gray-900 hover:text-black font-extrabold text-base"
                  >
                    {item.label}
                  </button>
                  {item.children && (
                    <div className="pl-3 mt-2 space-y-2 border-l-2 border-gray-100">
                      {item.children.map((c, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase">{c.title}</p>
                          {c.items.map((sub, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSubItemClick(sub)}
                              className="block text-left text-xs font-medium text-gray-600 hover:text-black py-0.5"
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
              <button 
                onClick={() => { setMobileMenuOpen(false); setActiveView('admin'); }}
                className="w-full bg-black text-white font-bold text-xs py-3 rounded-none uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                {isAdminAuthenticated ? <SlidersHorizontal size={14} /> : <Lock size={14} />}
                <span>{isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <Search size={20} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search leggings, hoodies, sports bras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 text-base focus:outline-none font-medium text-gray-900"
              />
              <button onClick={() => setSearchOpen(false)} className="p-1 cursor-pointer text-gray-500 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Leggings', 'Whitney Collection', 'Hoodies', 'Sports Bras', 'Joggers', 'Pink'].map(term => (
                      <button 
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="bg-gray-100 hover:bg-gray-200 text-xs font-semibold px-3 py-1.5 rounded-full text-gray-800 cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase">{filteredProducts.length} Results</span>
                    <button
                      onClick={() => {
                        navigateToShop({ search: searchQuery });
                        setSearchOpen(false);
                      }}
                      className="text-xs font-black text-pink-600 hover:text-black flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore all in Shop</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredProducts.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => { navigateToProduct(p.id); setSearchOpen(false); }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                      >
                        <img src={p.images[0]} alt={p.name} className="w-14 h-16 object-cover rounded-md" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs font-semibold text-gray-500">${p.price}</p>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono mt-1 inline-block uppercase">
                            {p.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 py-8">No products found matching "{searchQuery}"</p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
