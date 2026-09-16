import React from 'react';
import { SectionConfig } from '../../types/cms';
import { useStore } from '../../context/StoreContext';

export const PromoBannerSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
  const { navigateToProduct, navigateToShop } = useStore();

  const title = section.title || 'BESTSELLING LOOKS';
  const subtitle = section.subtitle || 'These are the popular styles everyone loves.';
  const bgImg = section.settings.bannerImage || 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=1600';
  const primaryBtnText = section.settings.primaryBtnText || 'Bestsellers';
  const secondaryBtnText = section.settings.secondaryBtnText;
  const overlayDarkness = section.styles?.overlayDarkness ?? 35;

  return (
    <section className="relative w-full bg-black text-white overflow-hidden select-none font-sans my-0">
      <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[600px] bg-black overflow-hidden group">
        <img 
          src={bgImg} 
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black transition-opacity" 
          style={{ opacity: overlayDarkness / 100 }} 
        />

        {/* Text Container */}
        <div className="absolute inset-0 w-full px-6 sm:px-12 py-10 flex flex-col justify-end items-start max-w-2xl space-y-3 z-10">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-mono leading-tight drop-shadow-md">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-200 drop-shadow-xs max-w-lg">
              {subtitle}
            </p>
          )}

          <div className="pt-2 flex flex-wrap gap-3">
            <button 
              onClick={() => navigateToShop({ badge: 'BESTSELLER' })}
              className="bg-white text-black font-extrabold text-xs uppercase px-6 py-3.5 tracking-wider hover:bg-gray-200 transition-transform active:scale-95 cursor-pointer shadow-md"
            >
              {primaryBtnText}
            </button>
            {secondaryBtnText && (
              <button 
                onClick={() => navigateToShop({ gender: 'men' })}
                className="bg-transparent border-2 border-white text-white font-extrabold text-xs uppercase px-6 py-3.5 tracking-wider hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                {secondaryBtnText}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
