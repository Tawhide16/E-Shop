import React, { useEffect, useRef } from 'react';
import { SectionConfig } from '../../types/cms';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Play } from 'lucide-react';
import gsap from 'gsap';

export const HeroBannerSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
  const { navigateToProduct, navigateToShop } = useStore();
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroContentRef.current) {
      gsap.fromTo(
        heroContentRef.current.children,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }
  }, []);
  const rawSlide = section.settings.heroSlides?.[0];
  const slide = {
    title: section.title || rawSlide?.title || 'OUR BESTSELLERS',
    subtitle: section.subtitle || rawSlide?.subtitle || 'Everyone loves them, and so will you.',
    desktopImage: section.settings.bannerImage || rawSlide?.desktopImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1600',
    button1Text: section.settings.primaryBtnText || rawSlide?.button1Text || 'Bestsellers',
    button1Url: section.settings.primaryBtnUrl || rawSlide?.button1Url || '/bestsellers',
    button2Text: section.settings.secondaryBtnText || rawSlide?.button2Text || 'Shop Pink',
    button2Url: section.settings.secondaryBtnUrl || rawSlide?.button2Url || '/pink',
    backgroundVideo: rawSlide?.backgroundVideo
  };

  const overlayOpacity = (section.styles.overlayDarkness ?? 30) / 100;

  return (
    <section className="relative w-full bg-black text-white overflow-hidden select-none">
      {/* Background Media */}
      <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[720px]">
        {slide.backgroundVideo ? (
          <video 
            src={slide.backgroundVideo} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={slide.desktopImage} 
            alt={slide.title}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
        )}

        {/* Dynamic Dark Overlay */}
        <div 
          className="absolute inset-0 bg-black" 
          style={{ opacity: overlayOpacity }}
        />

        {/* Content Box Positioned Bottom Left (matching Gymshark exact design) */}
        <div className="absolute inset-0 w-full px-6 sm:px-12 flex items-end pb-16 sm:pb-24">
          <div ref={heroContentRef} className="max-w-xl space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-white font-mono drop-shadow-md">
              {slide.title}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-gray-200 drop-shadow-xs max-w-md">
              {slide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap gap-3">
              {slide.button1Text && (
                <button 
                  onClick={() => navigateToShop({ badge: 'BESTSELLER' })}
                  className="bg-white text-black font-extrabold text-xs uppercase px-6 py-3.5 tracking-wider hover:bg-gray-200 transition-transform active:scale-95 cursor-pointer shadow-lg"
                >
                  {slide.button1Text}
                </button>
              )}
              {slide.button2Text && (
                <button 
                  onClick={() => navigateToShop({ color: 'Pink' })}
                  className="bg-transparent border-2 border-white text-white font-extrabold text-xs uppercase px-6 py-3.5 tracking-wider hover:bg-white hover:text-black transition-all cursor-pointer"
                >
                  {slide.button2Text}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
