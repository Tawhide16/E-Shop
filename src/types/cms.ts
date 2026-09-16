export type SectionType = 
  | 'announcement'
  | 'header'
  | 'hero'
  | 'product_grid'
  | 'promo_banner'
  | 'category_grid'
  | 'category_directory'
  | 'editorial'
  | 'newsletter'
  | 'footer'
  | 'testimonials'
  | 'faq'
  | 'custom_html';

export interface SectionStyle {
  backgroundColor?: string;
  textColor?: string;
  paddingY?: 'none' | 'small' | 'medium' | 'large';
  containerWidth?: 'full' | 'boxed';
  textAlign?: 'left' | 'center' | 'right';
  overlayDarkness?: number; // 0 to 100
  fontSize?: string;
  fontWeight?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  desktopImage: string;
  mobileImage?: string;
  backgroundVideo?: string;
  button1Text: string;
  button1Url: string;
  button2Text?: string;
  button2Url?: string;
}

export interface ProductCardSettings {
  showImage: boolean;
  showName: boolean;
  showPrice: boolean;
  showComparePrice: boolean;
  showDiscount: boolean;
  showRating: boolean;
  showWishlist: boolean;
  showQuickAdd: boolean;
  showColorVariants: boolean;
  showProductBadge: boolean;
}

export interface SectionConfig {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  settings: {
    productSource?: 'manual' | 'collection' | 'category' | 'bestselling' | 'newest' | 'discounted';
    productCount?: number;
    columnsDesktop?: number;
    columnsTablet?: number;
    columnsMobile?: number;
    viewAllText?: string;
    viewAllUrl?: string;
    filterTabs?: string[];
    selectedCategory?: string;
    heroSlides?: HeroSlide[];
    heroHeight?: 'small' | 'medium' | 'large' | 'fullscreen';
    bannerImage?: string;
    bannerMobileImage?: string;
    primaryBtnText?: string;
    primaryBtnUrl?: string;
    secondaryBtnText?: string;
    secondaryBtnUrl?: string;
    contentHtml?: string;
    announcementMessages?: string[];
    autoRotateAnnouncements?: boolean;
    showCloseAnnouncement?: boolean;
    productCardSettings?: ProductCardSettings;
  };
  styles: SectionStyle;
  metrics?: {
    views: number;
    clicks: number;
    ctr: number;
  };
}

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  verified: boolean;
  rating: number;
  title: string;
  comment: string;
  date: string;
  height?: string;
  bodyType?: string;
  activity?: string;
  workoutFrequency?: string;
  usualSize?: string;
  helpfulCount: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  stock: number;
  category: string; // e.g. 'Leggings', 'Sports Bras', 'Hoodies', 'Pants', 'Shorts', 'Tops'
  gender: 'women' | 'men' | 'unisex';
  collection?: string; // e.g. 'Whitney x Adapt', 'Bratz', 'Seamless', 'Power'
  fit?: string; // e.g. 'Regular', 'Oversized', 'Slim'
  badge?: 'NEW' | 'BESTSELLER' | 'SALE' | 'LIMITED' | 'TRENDING';
  rating: number;
  reviewCount: number;
  viewCount24h?: number;
  description: string;
  features?: string[];
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  status: 'active' | 'draft' | 'archived';
  tags: string[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'vip' | 'inactive';
  favoriteCategory?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  isMegaMenu?: boolean;
  children?: {
    title?: string;
    items: { label: string; url: string; badge?: string }[];
  }[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  timesUsed: number;
  status: 'active' | 'expired' | 'disabled';
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  category: 'hero' | 'products' | 'banners' | 'collections' | 'logos' | 'videos';
  fileSize: string;
  dimensions: string;
  uploadedAt: string;
}

export interface VersionSnapshot {
  id: string;
  timestamp: string;
  author: string;
  note: string;
  sections: SectionConfig[];
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
  allowIndexing: boolean;
}

export interface GlobalThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  borderRadius: 'none' | 'small' | 'medium' | 'rounded';
  fontHeading: string;
  fontBody: string;
  logoUrl?: string;
  logoHeight?: number;
  accentColor?: string;
  fontFamily?: string;
  buttonRadius?: 'none' | 'rounded' | 'pill' | 'small' | 'medium';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Editor' | 'Product Manager' | 'Order Manager' | 'Marketing Manager';
  avatar?: string;
}
