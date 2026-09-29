import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

export const SEOMeta: React.FC = () => {
  const { 
    activeView, 
    activeStorefrontPage, 
    selectedProductId, 
    products, 
    seoSettings 
  } = useStore();

  useEffect(() => {
    let title = 'lox.bd | Official Store';
    let description = seoSettings?.metaDescription || 'Shop lox.bd workout clothing, gym wear & fitness apparel. Fast delivery across Bangladesh with bKash, Nagad, and Cash on Delivery.';
    let keywords = Array.isArray(seoSettings?.keywords) 
      ? seoSettings.keywords.join(', ') 
      : typeof seoSettings?.keywords === 'string'
      ? seoSettings.keywords
      : 'lox.bd, gymwear, activewear, fitness apparel, bangladesh, workout clothes, sports bra, gym leggings';
    let ogImage = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80';
    let pageType = 'website';
    let jsonLdData: any = null;

    if (activeView === 'admin') {
      title = 'lox.bd - Admin CMS Dashboard';
      description = 'Manage lox.bd products, orders, homepage CMS blocks, marketing coupons, and SEO settings.';
    } else {
      if (activeStorefrontPage === 'product-detail') {
        const product = products.find(p => p.id === selectedProductId) || products[0];
        if (product) {
          title = `${product.name} | lox.bd`;
          description = `${product.description || 'Elevate your workout with lox.bd fitness gear.'} Price: $${product.price} USD (৳${Math.round(product.price * 120)} BDT). Available with fast shipping.`;
          if (product.images && product.images[0]) {
            ogImage = product.images[0];
          }
          pageType = 'product';

          // Product Schema.org JSON-LD
          jsonLdData = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.images || [ogImage],
            "description": product.description || description,
            "sku": product.sku || product.id,
            "brand": {
              "@type": "Brand",
              "name": "lox.bd"
            },
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "BDT",
              "price": Math.round(product.price * 120),
              "priceValidUntil": "2027-12-31",
              "itemCondition": "https://schema.org/NewCondition",
              "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "lox.bd"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating || "4.9",
              "reviewCount": product.reviewCount || "128"
            }
          };
        }
      } else if (activeStorefrontPage === 'checkout') {
        title = 'Fast & Secure Checkout | lox.bd';
        description = 'Complete your lox.bd workout wear order with instant bKash, Nagad, Rocket, Cards, or Cash on Delivery.';
      } else if (activeStorefrontPage === 'category') {
        title = 'Collection | lox.bd';
        description = 'Browse high-performance workout leggings, sports bras, hoodies, shorts and training t-shirts.';
      } else if (activeStorefrontPage === 'shop') {
        title = 'All Products | lox.bd';
      } else {
        title = seoSettings?.metaTitle && !seoSettings.metaTitle.includes('Gymshark')
          ? seoSettings.metaTitle
          : 'lox.bd | Official Store';
      }
    }

    // Update document title
    document.title = title;

    // Ensure favicon is lox.bd
    let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.setAttribute('rel', 'icon');
      document.head.appendChild(faviconLink);
    }
    faviconLink.setAttribute('type', 'image/svg+xml');
    faviconLink.setAttribute('href', '/favicon.svg');

    // Helper to set or create meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow');
    setMetaTag('meta[name="author"]', 'name', 'author', 'lox.bd');

    // Open Graph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', pageType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', window.location.href);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'lox.bd');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_US');

    // Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.href);

    // Dynamic JSON-LD Structured Data
    let jsonLdScript = document.getElementById('json-ld-seo-script');
    if (jsonLdData) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'json-ld-seo-script';
        jsonLdScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(jsonLdData);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }
  }, [activeView, activeStorefrontPage, selectedProductId, products, seoSettings]);

  return null;
};
