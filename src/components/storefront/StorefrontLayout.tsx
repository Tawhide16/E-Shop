import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { HeroBannerSection } from './HeroBanner';
import { ProductGridSection } from './ProductGridSection';
import { PromoBannerSection } from './PromoBanner';
import { CategoryGridSection } from './CategoryGrid';
import { CategoryDirectorySection } from './CategoryDirectory';
import { EditorialSection } from './EditorialSection';
import { NewsletterSection } from './NewsletterSection';
import { ProductDetailPage } from './ProductDetailPage';
import { CheckoutPage } from './CheckoutPage';
import { ShopPage } from './ShopPage';
import { CartDrawer } from './CartDrawer';

export const StorefrontLayout: React.FC = () => {
  const { sections, activeStorefrontPage } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Header />

      <main className="flex-1">
        {activeStorefrontPage === 'checkout' ? (
          <CheckoutPage />
        ) : activeStorefrontPage === 'product-detail' ? (
          <ProductDetailPage />
        ) : activeStorefrontPage === 'shop' ? (
          <ShopPage />
        ) : (
          /* Dynamic Homepage Render */
          <div className="space-y-0">
            {sections.filter(sec => sec.enabled && sec.id !== 'sec-editorial').map((sec) => {
              switch (sec.type) {
                case 'hero':
                  return <HeroBannerSection key={sec.id} section={sec} />;
                case 'product_grid':
                  return <ProductGridSection key={sec.id} section={sec} />;
                case 'promo_banner':
                  return <PromoBannerSection key={sec.id} section={sec} />;
                case 'category_grid':
                  return <CategoryGridSection key={sec.id} section={sec} />;
                case 'category_directory':
                  return <CategoryDirectorySection key={sec.id} />;
                case 'editorial':
                  return <EditorialSection key={sec.id} section={sec} />;
                case 'newsletter':
                  return <NewsletterSection key={sec.id} section={sec} />;
                default:
                  return null;
              }
            })}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};
