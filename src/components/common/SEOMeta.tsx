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
    let title = 'Gymshark Official Store | Premium Activewear & Gym Clothing';
    let description = seoSettings?.metaDescription || 'Shop Gymshark workout clothing, gym wear & fitness apparel. Fast delivery across Bangladesh with bKash, Nagad, and Cash on Delivery.';
    let keywords = Array.isArray(seoSettings?.keywords) 
      ? seoSettings.keywords.join(', ') 
      : typeof seoSettings?.keywords === 'string'
      ? seoSettings.keywords
      : 'gymshark, gymwear, activewear, fitness apparel, bangladesh, workout clothes, sports bra, gym leggings';
    let ogImage = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80';
    let pageType = 'website';
    let jsonLdData: any = null;

    if (activeView === 'admin') {
      title = 'Admin CMS Dashboard | Gymshark E-Commerce';
      description = 'Manage Gymshark products, orders, homepage CMS blocks, marketing coupons, and SEO settings.';
    } else {
      if (activeStorefrontPage === 'product-detail') {
        const product = products.find(p => p.id === selectedProductId) || products[0];
        if (product) {
          title = `${product.name} - Gymshark Official Bangladesh`;
          description = `${product.description || 'Elevate your workout with Gymshark fitness gear.'} Price: $${product.price} USD (৳${Math.round(product.price * 120)} BDT). Available with fast shipping.`;
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
              "name": "Gymshark"
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
                "name": "Gymshark Bangladesh"
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
        title = 'Fast & Secure Checkout | Gymshark Bangladesh';
        description = 'Complete your Gymshark workout wear order with instant bKash, Nagad, Rocket, Cards, or Cash on Delivery.';
      } else if (activeStorefrontPage === 'category') {
        title = 'Gymwear & Activewear Collection | Gymshark Bangladesh';
        description = 'Browse high-performance workout leggings, sports bras, hoodies, shorts and training t-shirts.';
      } else {
        // Home page WebSite + Organization schema
        jsonLdData = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://gymshark.com/#organization",
              "name": "Gymshark Bangladesh",
              "url": window.location.origin,
              "logo": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
              "description": "Official Gymshark store servicing Bangladesh with high performance activewear.",
              "sameAs": [
                "https://facebook.com/gymshark",
                "https://instagram.com/gymshark"
              ]
            },
            {
              "@type": "WebSite",
              "@id": "https://gymshark.com/#website",
              "url": window.location.origin,
              "name": "Gymshark Official Store",
              "publisher": {
                "@id": "https://gymshark.com/#organization"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${window.location.origin}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            }
          ]
        };
      }
    }

    // Update document title
    document.title = title;

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
    setMetaTag('meta[name="author"]', 'name', 'author', 'Gymshark Ltd.');

    // Open Graph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', pageType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', window.location.href);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Gymshark Bangladesh');
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
