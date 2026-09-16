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
  AdminUser
} from '../types/cms';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Adapt Animal X Whitney Leggings',
    sku: 'GS-W-LEG-001',
    price: 70,
    comparePrice: 85,
    stock: 28,
    category: 'Leggings',
    gender: 'women',
    collection: 'Whitney x Adapt',
    fit: 'Regular',
    badge: 'BESTSELLER',
    rating: 4.8,
    reviewCount: 159,
    viewCount24h: 826,
    description: 'Designed for lifting. These leggings are high-waisted and made from durable, supportive, stretchy seamless fabric.',
    features: [
      'New More Supportive Waistband - Extra ribbing on the lower stomach gives you even more support',
      'Breathable - Air and moisture flow through the fabric, allowing your body to breathe',
      'Sweat-wicking - Sweat-wicking tech moves sweat away from your body, keeping you cool, dry and focused.'
    ],
    images: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Electric Pink / Sorbet Yellow', hex: '#FF3399' },
      { name: 'Sunset Orange', hex: '#FF6600' },
      { name: 'Calm Pink', hex: '#FFB6C1' },
      { name: 'Black', hex: '#111111' }
    ],
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
    status: 'active',
    tags: ['whitney', 'seamless', 'high-waisted', 'lifting']
  },
  {
    id: 'prod-2',
    name: 'Gymshark x Bratz Leggings',
    sku: 'GS-W-LEG-002',
    price: 72,
    comparePrice: 90,
    stock: 14,
    category: 'Leggings',
    gender: 'women',
    collection: 'Bratz',
    fit: 'Regular',
    badge: 'LIMITED',
    rating: 4.8,
    reviewCount: 124,
    viewCount24h: 610,
    description: 'Iconic Y2K Gymshark x Bratz collaboration activewear with premium soft sculpt contouring.',
    images: [
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Super-Set Pink/Wash', hex: '#E0115F' },
      { name: 'Black/Asphalt Grey', hex: '#222222' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'active',
    tags: ['bratz', 'pink', 'collaboration']
  },
  {
    id: 'prod-3',
    name: 'Lift Seamless High-Rise Leggings',
    sku: 'GS-W-LEG-003',
    price: 74,
    stock: 45,
    category: 'Leggings',
    gender: 'women',
    collection: 'Lift Seamless',
    fit: 'High-Rise',
    badge: 'TRENDING',
    rating: 4.6,
    reviewCount: 88,
    description: 'Ultra contouring body-sculpting seamless leggings engineered for maximum squat-proof support.',
    images: [
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Calm Pink', hex: '#D8A7B1' },
      { name: 'Charcoal Grey', hex: '#333333' },
      { name: 'Teal Blue', hex: '#008080' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    status: 'active',
    tags: ['lift', 'high-rise', 'squatproof']
  },
  {
    id: 'prod-4',
    name: 'Vital Sweetheart Neck Crop Top',
    sku: 'GS-W-TOP-001',
    price: 35,
    comparePrice: 50,
    stock: 8,
    category: 'Sports Bras',
    gender: 'women',
    collection: 'Vital Seamless',
    fit: 'Focus Fit',
    badge: 'SALE',
    rating: 4.5,
    reviewCount: 42,
    description: 'Flattering sweetheart neckline long sleeve crop top crafted in sweat-wicking knit texture.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Focus Pink', hex: '#FF69B4' },
      { name: 'Black Marl', hex: '#1C1C1C' },
      { name: 'Pure White', hex: '#FFFFFF' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    status: 'active',
    tags: ['sweetheart', 'crop top', 'sale']
  },
  {
    id: 'prod-5',
    name: 'Power Oversized Hoodie',
    sku: 'GS-M-HOOD-001',
    price: 75,
    stock: 32,
    category: 'Hoodies',
    gender: 'men',
    collection: 'Power',
    fit: 'Oversized Fit',
    badge: 'BESTSELLER',
    rating: 4.9,
    reviewCount: 96,
    description: 'Heavyweight fleece hoodie designed for warmups, pump covers, and post-gym recovery comfort.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Black/Asphalt Grey', hex: '#1A1A1A' },
      { name: 'Grey Marl', hex: '#888888' },
      { name: 'Army Green', hex: '#4B5320' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    status: 'active',
    tags: ['power', 'hoodie', 'oversized']
  },
  {
    id: 'prod-6',
    name: 'Pumper Heavyweight Pants',
    sku: 'GS-M-PNT-001',
    price: 60,
    stock: 19,
    category: 'Pants',
    gender: 'men',
    collection: 'Power',
    fit: 'Oversized Fit',
    rating: 4.4,
    reviewCount: 22,
    description: 'Relaxed fit training pants engineered with thick durable cotton blend and deep secure zip pockets.',
    images: [
      'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Charcoal Grey', hex: '#333333' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    status: 'active',
    tags: ['pumper', 'pants', 'oversized']
  },
  {
    id: 'prod-7',
    name: 'Crest Straight Leg Joggers',
    sku: 'GS-M-PNT-002',
    price: 55,
    comparePrice: 65,
    stock: 25,
    category: 'Pants',
    gender: 'men',
    collection: 'Crest',
    fit: 'Regular Fit',
    badge: 'TRENDING',
    rating: 4.7,
    reviewCount: 51,
    description: 'Essential straight-leg fleece sweatpants with embroidered Gymshark crest logo.',
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Light Grey Marl', hex: '#CCCCCC' },
      { name: 'Black', hex: '#111111' },
      { name: 'Navy Blue', hex: '#000080' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    status: 'active',
    tags: ['crest', 'joggers', 'sweatpants']
  },
  {
    id: 'prod-8',
    name: 'Campus Crest Oversized Pants',
    sku: 'GS-M-PNT-003',
    price: 60,
    stock: 50,
    category: 'Pants',
    gender: 'men',
    collection: 'Campus',
    fit: 'Oversized Fit',
    badge: 'NEW',
    rating: 4.6,
    reviewCount: 38,
    description: 'Retro varsity-styled fleece pants with relaxed hem drape and cozy soft-brushed lining.',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Varsity Green', hex: '#1B4D3E' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    status: 'active',
    tags: ['campus', 'new', 'oversized']
  },
  {
    id: 'prod-9',
    name: 'Whitney x Adapt Strappy Sports Bra',
    sku: 'GS-W-BRA-002',
    price: 45,
    comparePrice: 55,
    stock: 36,
    category: 'Sports Bras',
    gender: 'women',
    collection: 'Whitney x Adapt',
    fit: 'Medium Support',
    badge: 'BESTSELLER',
    rating: 4.9,
    reviewCount: 112,
    description: 'Criss-cross back straps with buttery-soft ribbing and removable foam padding.',
    images: [
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Electric Pink', hex: '#FF3399' },
      { name: 'Sunset Orange', hex: '#FF6600' },
      { name: 'Black', hex: '#111111' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'active',
    tags: ['whitney', 'sports-bra', 'strappy']
  },
  {
    id: 'prod-10',
    name: 'Vital Seamless 2.0 High-Waisted Shorts',
    sku: 'GS-W-SHO-001',
    price: 40,
    stock: 42,
    category: 'Shorts',
    gender: 'women',
    collection: 'Vital Seamless',
    fit: 'High-Rise',
    badge: 'NEW',
    rating: 4.7,
    reviewCount: 65,
    description: 'Lightweight sweat-wicking knit shorts designed for high-intensity training and summer gym sessions.',
    images: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Calm Pink', hex: '#FFB6C1' },
      { name: 'Black Marl', hex: '#1A1A1A' },
      { name: 'Sage Green', hex: '#9CAF88' }
    ],
    sizes: ['XXS', 'XS', 'S', 'M', 'L'],
    status: 'active',
    tags: ['vital', 'shorts', 'seamless']
  },
  {
    id: 'prod-11',
    name: 'Apex Performance Training T-Shirt',
    sku: 'GS-M-TEE-001',
    price: 42,
    comparePrice: 50,
    stock: 30,
    category: 'Tops',
    gender: 'men',
    collection: 'Apex Performance',
    fit: 'Slim Fit',
    badge: 'SALE',
    rating: 4.8,
    reviewCount: 77,
    description: 'Heat-mapping ventilation zones and ergonomic flatlock seam construction for peak conditioning.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Stealth Black', hex: '#111111' },
      { name: 'Electric Cobalt', hex: '#0047AB' },
      { name: 'Optic White', hex: '#FFFFFF' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    status: 'active',
    tags: ['apex', 't-shirt', 'performance']
  },
  {
    id: 'prod-12',
    name: 'Apex 5" Lightweight Running Shorts',
    sku: 'GS-M-SHO-002',
    price: 48,
    stock: 22,
    category: 'Shorts',
    gender: 'men',
    collection: 'Apex Performance',
    fit: 'Regular Fit',
    badge: 'BESTSELLER',
    rating: 4.9,
    reviewCount: 94,
    description: 'Split hem side vents, built-in compression liner, and phone pocket engineered for sprint intervals.',
    images: [
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Black', hex: '#111111' },
      { name: 'Storm Grey', hex: '#708090' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    status: 'active',
    tags: ['apex', 'shorts', 'running']
  },
  {
    id: 'prod-13',
    name: 'Minimalist Rest Day Crop Hoodie',
    sku: 'GS-W-HOOD-002',
    price: 68,
    stock: 18,
    category: 'Hoodies',
    gender: 'women',
    collection: 'Minimalist',
    fit: 'Relaxed Fit',
    badge: 'NEW',
    rating: 4.7,
    reviewCount: 29,
    description: 'Ultra-plush French terry cropped hoodie with raw cut hem and minimalist silicone logo.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Oatmeal Marl', hex: '#E3DAC9' },
      { name: 'Calm Pink', hex: '#FFB6C1' },
      { name: 'Black', hex: '#111111' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    status: 'active',
    tags: ['minimalist', 'crop-hoodie', 'rest-day']
  },
  {
    id: 'prod-14',
    name: 'Power Zip-Up Windbreaker Jacket',
    sku: 'GS-U-JAC-001',
    price: 85,
    comparePrice: 105,
    stock: 12,
    category: 'Jackets',
    gender: 'unisex',
    collection: 'Power',
    fit: 'Oversized Fit',
    badge: 'SALE',
    rating: 4.8,
    reviewCount: 45,
    description: 'Water-repellent ripstop shell with toggle-cinch hem and packable hood for all-weather warmup sessions.',
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Matte Black', hex: '#1A1A1A' },
      { name: 'Cement Grey', hex: '#9E9E9E' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    status: 'active',
    tags: ['jacket', 'windbreaker', 'water-repellent']
  },
  {
    id: 'prod-15',
    name: 'Gymshark Everyday Heavyweight Duffle 45L',
    sku: 'GS-ACC-BAG-001',
    price: 58,
    stock: 40,
    category: 'Accessories',
    gender: 'unisex',
    collection: 'Power',
    fit: '45 Liters',
    badge: 'BESTSELLER',
    rating: 4.9,
    reviewCount: 180,
    description: 'Dedicated wet-shoe compartment, padded shoulder strap, and waterproof heavy-gauge canvas fabric.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Black / White Logo', hex: '#000000' },
      { name: 'Olive Green', hex: '#556B2F' }
    ],
    sizes: ['One Size'],
    status: 'active',
    tags: ['duffle-bag', 'accessories', 'gym-bag']
  },
  {
    id: 'prod-16',
    name: 'Gymshark Padded Lifting Straps (Pair)',
    sku: 'GS-ACC-STR-001',
    price: 18,
    comparePrice: 22,
    stock: 65,
    category: 'Accessories',
    gender: 'unisex',
    collection: 'Power',
    fit: 'Standard Length',
    badge: 'SALE',
    rating: 4.9,
    reviewCount: 310,
    description: 'Heavy duty reinforced cotton webbing with neoprene wrist padding for heavy deadlifts and barbell pulls.',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'
    ],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Pink', hex: '#FF69B4' }
    ],
    sizes: ['One Size'],
    status: 'active',
    tags: ['straps', 'lifting', 'deadlift']
  }
];

export const INITIAL_SECTIONS: SectionConfig[] = [
  {
    id: 'sec-announcement',
    type: 'announcement',
    title: 'Announcement Bar',
    enabled: true,
    order: 1,
    settings: {
      announcementMessages: [
        'Get $10 off when you refer a friend',
        'Students get an extra 15% off',
        'Free Shipping on orders over $100'
      ],
      autoRotateAnnouncements: true,
      showCloseAnnouncement: true
    },
    styles: {
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      fontSize: '12px',
      fontWeight: '600'
    },
    metrics: { views: 24800, clicks: 1240, ctr: 5.0 }
  },
  {
    id: 'sec-hero',
    type: 'hero',
    title: 'Hero Banner',
    subtitle: 'Primary Homepage Billboard',
    enabled: true,
    order: 2,
    settings: {
      heroSlides: [
        {
          id: 'slide-1',
          title: 'OUR BESTSELLERS',
          subtitle: 'Everyone loves them, and so will you.',
          desktopImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1600',
          button1Text: 'Bestsellers',
          button1Url: '/collection/bestsellers',
          button2Text: 'Shop Pink',
          button2Url: '/collection/pink'
        }
      ],
      heroHeight: 'large'
    },
    styles: {
      overlayDarkness: 35,
      textAlign: 'left'
    },
    metrics: { views: 124820, clicks: 8420, ctr: 6.74 }
  },
  {
    id: 'sec-bestsellers-women',
    type: 'product_grid',
    title: 'BESTSELLERS',
    subtitle: 'Women\'s Top Rated Essentials',
    enabled: true,
    order: 3,
    settings: {
      productSource: 'bestselling',
      productCount: 4,
      columnsDesktop: 4,
      columnsTablet: 2,
      columnsMobile: 2,
      viewAllText: 'View All',
      viewAllUrl: '/collections/women-bestsellers',
      productCardSettings: {
        showImage: true,
        showName: true,
        showPrice: true,
        showComparePrice: true,
        showDiscount: true,
        showRating: true,
        showWishlist: true,
        showQuickAdd: true,
        showColorVariants: true,
        showProductBadge: true
      }
    },
    styles: {
      paddingY: 'medium'
    },
    metrics: { views: 98200, clicks: 14200, ctr: 14.46 }
  },
  {
    id: 'sec-promo-men',
    type: 'promo_banner',
    title: 'BESTSELLING LOOKS',
    subtitle: 'These are the popular styles everyone loves.',
    enabled: true,
    order: 4,
    settings: {
      bannerImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=1600',
      primaryBtnText: 'Bestsellers',
      primaryBtnUrl: '/collections/bestsellers',
      secondaryBtnText: 'New In',
      secondaryBtnUrl: '/collections/new-in'
    },
    styles: {
      overlayDarkness: 40,
      textAlign: 'left'
    },
    metrics: { views: 76500, clicks: 4320, ctr: 5.65 }
  },
  {
    id: 'sec-bestsellers-men',
    type: 'product_grid',
    title: 'BESTSELLERS - MEN',
    subtitle: 'Top Performers For Men',
    enabled: true,
    order: 5,
    settings: {
      productSource: 'manual',
      productCount: 4,
      columnsDesktop: 4,
      columnsTablet: 2,
      columnsMobile: 2,
      viewAllText: 'View All',
      viewAllUrl: '/collections/men-bestsellers'
    },
    styles: {
      paddingY: 'medium'
    },
    metrics: { views: 64100, clicks: 8120, ctr: 12.66 }
  },
  {
    id: 'sec-favorites-categories',
    type: 'category_grid',
    title: 'FAVORITES',
    subtitle: 'Explore core activewear styles',
    enabled: true,
    order: 6,
    settings: {
      filterTabs: ['WOMEN', 'MEN']
    },
    styles: {
      paddingY: 'medium'
    },
    metrics: { views: 52100, clicks: 5890, ctr: 11.3 }
  },
  {
    id: 'sec-banner-favorites',
    type: 'promo_banner',
    title: 'FEATURED FAVORITES COLLECTION',
    subtitle: 'Engineered for comfort and unmatched performance. Shop our top-rated styles.',
    enabled: true,
    order: 7,
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
  },
  {
    id: 'sec-popular-now',
    type: 'category_grid',
    title: 'POPULAR RIGHT NOW',
    subtitle: 'Bestselling styles you\'ll reach for every single session.',
    enabled: true,
    order: 8,
    settings: {
      filterTabs: ['WOMEN', 'MEN']
    },
    styles: {
      paddingY: 'medium'
    },
    metrics: { views: 48900, clicks: 4910, ctr: 10.04 }
  },
  {
    id: 'sec-category-directory',
    type: 'category_directory',
    title: 'Category Directory',
    enabled: true,
    order: 8,
    settings: {},
    styles: {
      paddingY: 'small'
    }
  },
  {
    id: 'sec-editorial',
    type: 'editorial',
    title: 'WORKOUT CLOTHES & GYM CLOTHES',
    subtitle: 'Built In The Weight Room',
    enabled: false,
    order: 9,
    settings: {
      contentHtml: `
        <h3>GYM CLOTHES BUILT IN THE WEIGHT ROOM</h3>
        <p>Workout Clothes designed to help you become your personal best. Because when it comes to performing at your max, there should be no obstacles – least of all your workout clothes. Functional and comfortable, we create workout clothing you'll sweat in. Since 2012, we've designed and created the workout clothes we want to wear, because training and its people are what we know best.</p>
        
        <h3>ACTIVEWEAR & ATHLEISURE</h3>
        <p>Our <strong>Men's Workout Clothes</strong> feature sweat-wicking <strong>workout shirts</strong> and <strong>tank tops</strong>, <strong>gym shorts</strong>, <strong>sweatpants</strong> and more. Whilst our <strong>Women's Workout Clothes</strong> are designed for a range of movements and feature sophisticated seamless technology, clever contouring and durable, quick-dry sweat-wicking fabrics on <strong>leggings</strong>, <strong>sports bras</strong> and more.</p>
        
        <h3>MORE THAN YOUR BEST WORKOUT CLOTHING</h3>
        <p>An obsession with lifting is what started this brand, and we haven't forgotten our roots. Our <strong>Women's</strong> and <strong>Men's Bodybuilding clothes</strong> feature classic styles, with modern cuts and innovative fabrics to help you raise the bar.</p>
      `
    },
    styles: {
      paddingY: 'medium'
    }
  },
  {
    id: 'sec-newsletter',
    type: 'newsletter',
    title: 'GET 10% OFF YOUR FIRST ORDER',
    subtitle: 'Sign up for exclusive drops, training tips and offers.',
    enabled: true,
    order: 10,
    settings: {
      primaryBtnText: 'SIGN UP'
    },
    styles: {
      backgroundColor: '#F4F4F5',
      textColor: '#111111',
      paddingY: 'medium'
    }
  },
  {
    id: 'sec-footer',
    type: 'footer',
    title: 'Footer',
    enabled: true,
    order: 11,
    settings: {},
    styles: {
      backgroundColor: '#FFFFFF',
      textColor: '#111111'
    }
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'menu-women',
    label: 'WOMEN',
    url: '/category/women',
    isMegaMenu: true,
    children: [
      {
        title: 'CATEGORY',
        items: [
          { label: 'Leggings', url: '/category/women-leggings' },
          { label: 'Sports Bras', url: '/category/women-sports-bras' },
          { label: 'Shorts', url: '/category/women-shorts' },
          { label: 'Tops & T-Shirts', url: '/category/women-tops' },
          { label: 'Hoodies & Sweatshirts', url: '/category/women-hoodies' },
          { label: 'Matching Sets', url: '/category/women-sets' }
        ]
      },
      {
        title: 'COLLECTIONS',
        items: [
          { label: 'Whitney x Adapt', url: '/collection/whitney', badge: 'HOT' },
          { label: 'Gymshark x Bratz', url: '/collection/bratz', badge: 'NEW' },
          { label: 'Vital Seamless', url: '/collection/vital' },
          { label: 'Lift Seamless', url: '/collection/lift' }
        ]
      }
    ]
  },
  {
    id: 'menu-men',
    label: 'MEN',
    url: '/category/men',
    isMegaMenu: true,
    children: [
      {
        title: 'CATEGORY',
        items: [
          { label: 'T-Shirts & Tops', url: '/category/men-tops' },
          { label: 'Shorts', url: '/category/men-shorts' },
          { label: 'Hoodies & Sweatshirts', url: '/category/men-hoodies' },
          { label: 'Joggers & Pants', url: '/category/men-pants' },
          { label: 'Stringers & Tanks', url: '/category/men-stringers' }
        ]
      },
      {
        title: 'COLLECTIONS',
        items: [
          { label: 'Power Collection', url: '/collection/power' },
          { label: 'Campus Collection', url: '/collection/campus', badge: 'NEW' },
          { label: 'Crest Collection', url: '/collection/crest' }
        ]
      }
    ]
  },
  { id: 'menu-accessories', label: 'ACCESSORIES', url: '/category/accessories' },
  { id: 'menu-new', label: 'NEW ARRIVALS', url: '/collections/new' },
  { id: 'menu-sale', label: 'SALE', url: '/collections/sale' }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-10284',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    date: '2026-08-11 10:14 AM',
    items: [
      {
        productId: 'prod-1',
        productName: 'Adapt Animal X Whitney Leggings',
        productImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
        color: 'Electric Pink / Sorbet Yellow',
        size: 'M',
        price: 70,
        quantity: 1
      }
    ],
    totalAmount: 70,
    paymentStatus: 'paid',
    fulfillmentStatus: 'processing',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR'
  },
  {
    id: 'ORD-10283',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.v@example.com',
    date: '2026-08-10 03:45 PM',
    items: [
      {
        productId: 'prod-5',
        productName: 'Power Oversized Hoodie',
        productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
        color: 'Black/Asphalt Grey',
        size: 'XL',
        price: 75,
        quantity: 1
      },
      {
        productId: 'prod-6',
        productName: 'Pumper Pants',
        productImage: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=800',
        color: 'Black',
        size: 'L',
        price: 60,
        quantity: 1
      }
    ],
    totalAmount: 135,
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
    shippingAddress: '10880 Wilshire Blvd, Los Angeles, CA'
  },
  {
    id: 'ORD-10282',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@example.com',
    date: '2026-08-09 06:20 PM',
    items: [
      {
        productId: 'prod-4',
        productName: 'Vital Sweetheart Neck Crop Top',
        productImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
        color: 'Focus Pink',
        size: 'S',
        price: 35,
        quantity: 2
      }
    ],
    totalAmount: 70,
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    shippingAddress: '42 Wallaby Way, Sydney'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    totalOrders: 4,
    totalSpent: 340,
    lastOrderDate: '2026-08-11',
    status: 'vip',
    favoriteCategory: 'Leggings'
  },
  {
    id: 'cust-2',
    name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    totalOrders: 2,
    totalSpent: 215,
    lastOrderDate: '2026-08-10',
    status: 'active',
    favoriteCategory: 'Hoodies'
  },
  {
    id: 'cust-3',
    name: 'Elena Rostova',
    email: 'elena.r@example.com',
    totalOrders: 3,
    totalSpent: 180,
    lastOrderDate: '2026-08-09',
    status: 'active',
    favoriteCategory: 'Sports Bras'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 50,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 1000,
    timesUsed: 248,
    status: 'active'
  },
  {
    id: 'coup-2',
    code: 'STUDENT15',
    discountType: 'percentage',
    discountValue: 15,
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    usageLimit: 500,
    timesUsed: 112,
    status: 'active'
  }
];

export const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: 'media-1',
    filename: 'hero_bestsellers_desktop.jpg',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1600',
    category: 'hero',
    fileSize: '1.4 MB',
    dimensions: '1920x1080',
    uploadedAt: '2026-08-01'
  },
  {
    id: 'media-2',
    filename: 'whitney_adapt_leggings_pink.jpg',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    category: 'products',
    fileSize: '680 KB',
    dimensions: '800x1200',
    uploadedAt: '2026-08-05'
  },
  {
    id: 'media-3',
    filename: 'bestselling_looks_banner.jpg',
    url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=1600',
    category: 'banners',
    fileSize: '1.1 MB',
    dimensions: '1920x800',
    uploadedAt: '2026-08-08'
  }
];

export const INITIAL_SEO: SEOSettings = {
  metaTitle: 'Gym Clothing & Activewear | Gymshark Official Store',
  metaDescription: 'Shop Gymshark gym clothing and activewear. High performance leggings, sports bras, workout tops, hoodies and joggers engineered for your best lifting session.',
  keywords: 'gym clothing, activewear, leggings, sports bras, workout shirts, gymshark, gymwear',
  ogImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
  canonicalUrl: 'https://mygymwear.ai.studio',
  allowIndexing: true
};

export const INITIAL_THEME: GlobalThemeSettings = {
  primaryColor: '#000000',
  secondaryColor: '#FF3399',
  backgroundColor: '#FFFFFF',
  textColor: '#111111',
  buttonColor: '#000000',
  buttonTextColor: '#FFFFFF',
  borderRadius: 'none',
  fontHeading: 'system-ui, sans-serif',
  fontBody: 'system-ui, sans-serif'
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-1',
    name: 'Tawhid Ehsan',
    email: 'tawhideh.b10@gmail.com',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'user-2',
    name: 'Content Editor',
    email: 'editor@gymwear.com',
    role: 'Editor'
  }
];
