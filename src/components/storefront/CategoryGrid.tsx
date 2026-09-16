import React, { useState, useEffect, useRef } from 'react';
import { SectionConfig } from '../../types/cms';
import { useStore } from '../../context/StoreContext';
import gsap from 'gsap';

export const CategoryGridSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
  const { navigateToProduct, navigateToShop } = useStore();
  const [activeTab, setActiveTab] = useState<'WOMEN' | 'MEN'>('WOMEN');
  const catGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (catGridRef.current) {
      gsap.fromTo(
        catGridRef.current.children,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [activeTab, section.id]);

  const isFavorites = section.title.includes('FAVORITES');

  const favoritesWomen = [
    { title: 'LEGGINGS', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800', category: 'Leggings', gender: 'women' as const },
    { title: 'SPORTS BRAS', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800', category: 'Sports Bras', gender: 'women' as const },
    { title: 'SHORTS', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800', category: 'Shorts', gender: 'women' as const },
    { title: 'T-SHIRTS & TOPS', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800', category: 'Tops', gender: 'women' as const }
  ];

  const favoritesMen = [
    { title: 'HOODIES & SWEATS', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800', category: 'Hoodies', gender: 'men' as const },
    { title: 'JOGGERS & PANTS', image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=800', category: 'Pants', gender: 'men' as const },
    { title: 'CREST SWEATPANTS', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', collection: 'Crest', gender: 'men' as const },
    { title: 'CAMPUS PANTS', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800', collection: 'Campus', gender: 'men' as const }
  ];

  const popularRightNow = [
    { 
      title: 'SUMMER BESTSELLERS', 
      desc: 'Bestselling styles you\'ll reach for every single session.', 
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
      filters: { badge: 'BESTSELLER' }
    },
    { 
      title: 'FOR EVERY RUN', 
      desc: 'Comfy, breathable kit that keeps your focus where you need it.', 
      image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
      filters: { collection: 'Apex Performance' }
    },
    { 
      title: 'GET \'EM IN PINK', 
      desc: 'The sets you love. Even more loveable in pink.', 
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      filters: { color: 'Pink' }
    },
    { 
      title: 'EVERYDAY SEAMLESS RESTOCK', 
      desc: 'These are your soft, second-skin, seamless sets that keep you comfy and confident.', 
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800',
      filters: { collection: 'Vital Seamless' }
    }
  ];

  const handleItemClick = (item: any) => {
    if ('category' in item) {
      navigateToShop({ category: item.category, gender: item.gender });
    } else if ('collection' in item) {
      navigateToShop({ collection: item.collection, gender: item.gender });
    } else if ('filters' in item) {
      navigateToShop(item.filters);
    } else {
      navigateToShop({});
    }
  };

  const items = isFavorites 
    ? (activeTab === 'WOMEN' ? favoritesWomen : favoritesMen)
    : popularRightNow;

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 py-10 font-sans">
      {/* Title & Tabs */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-mono">
          {section.title}
        </h2>
        {section.subtitle && (
          <p className="text-xs font-semibold text-gray-500 mt-0.5">{section.subtitle}</p>
        )}

        {/* Tab Switcher Buttons */}
        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => setActiveTab('WOMEN')}
            className={`px-5 py-2 text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-colors ${
              activeTab === 'WOMEN' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            WOMEN
          </button>
          <button 
            onClick={() => setActiveTab('MEN')}
            className={`px-5 py-2 text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-colors ${
              activeTab === 'MEN' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            MEN
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div ref={catGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item, idx) => (
          <div 
            key={idx}
            onClick={() => handleItemClick(item)}
            className="group cursor-pointer flex flex-col"
          >
            <div className="relative aspect-3/4 w-full bg-gray-100 overflow-hidden mb-3">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="font-extrabold text-xs text-black uppercase tracking-tight group-hover:underline">
              {item.title}
            </h3>
            {'desc' in item && (
              <p className="text-[11px] font-medium text-gray-500 mt-1 line-clamp-2">
                {item.desc}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
