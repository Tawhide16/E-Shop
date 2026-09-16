import React, { useState, useEffect, useRef } from 'react';
import { SectionConfig, Product } from '../../types/cms';
import { useStore } from '../../context/StoreContext';
import { Heart, Plus, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import gsap from 'gsap';

export const ProductGridSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
  const { products, navigateToProduct, navigateToShop, addToCart, toggleWishlist, wishlist } = useStore();
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({});
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [section.id, section.title]);

  // Filter products based on section productSource
  let displayProducts: Product[] = products;
  if (section.title.includes('MEN')) {
    displayProducts = products.filter(p => p.gender === 'men');
  } else if (section.settings.productSource === 'bestselling') {
    displayProducts = products.filter(p => p.badge === 'BESTSELLER' || p.rating >= 4.0);
  }

  const limit = section.settings.productCount || 4;
  displayProducts = displayProducts.slice(0, limit);

  const handleViewAll = () => {
    if (section.title.includes('MEN')) {
      navigateToShop({ gender: 'men' });
    } else if (section.settings.productSource === 'bestselling' || section.title.includes('BESTSELLER')) {
      navigateToShop({ badge: 'BESTSELLER' });
    } else {
      navigateToShop({});
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const size = selectedSizes[product.id] || product.sizes[0] || 'M';
    const color = product.colors[0]?.name || 'Standard';
    addToCart(product, color, size, 1);
    setAddedSuccessId(product.id);
    setTimeout(() => setAddedSuccessId(null), 1500);
  };

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 py-10 font-sans">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-mono">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-xs font-semibold text-gray-500 mt-0.5">{section.subtitle}</p>
          )}
        </div>

        {section.settings.viewAllText && (
          <button 
            onClick={handleViewAll}
            className="text-xs font-extrabold uppercase tracking-wider text-black hover:underline flex items-center gap-1 cursor-pointer"
          >
            {section.settings.viewAllText}
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((product) => {
          const isWishlisted = wishlist.includes(product.id);
          const hasDiscount = product.comparePrice && product.comparePrice > product.price;

          return (
            <div 
              key={product.id}
              onClick={() => navigateToProduct(product.id)}
              className="group relative bg-white flex flex-col cursor-pointer transition-all duration-200"
            >
              {/* Product Image & Badges Container */}
              <div className="relative aspect-3/4 w-full bg-gray-100 overflow-hidden mb-3">
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
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  {product.badge && (
                    <span className="bg-black text-white text-[9px] font-black px-1.5 py-0.5 tracking-wider uppercase">
                      {product.badge}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 tracking-wider uppercase">
                      {Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Top Right Wishlist Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-black cursor-pointer shadow-xs transition-transform active:scale-90"
                  title="Add to Wishlist"
                >
                  <Heart size={16} className={isWishlisted ? "fill-pink-600 text-pink-600" : ""} />
                </button>

                {/* Quick Add Button (+) top or hover bottom */}
                <button 
                  onClick={(e) => handleQuickAdd(e, product)}
                  className="absolute bottom-2 right-2 z-10 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all cursor-pointer shadow-md group-hover:scale-110"
                  title="Quick Add to Bag"
                >
                  {addedSuccessId === product.id ? <Check size={16} className="text-emerald-400" /> : <Plus size={18} />}
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-1">
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

                <p className="text-[11px] font-medium text-gray-500">
                  {product.fit || 'Regular'} • {product.colors[0]?.name || 'Pink'}
                </p>

                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-extrabold text-xs text-black">
                    US${product.price}
                  </span>
                  {hasDiscount && (
                    <span className="line-through text-gray-400 text-[11px] font-semibold">
                      US${product.comparePrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
