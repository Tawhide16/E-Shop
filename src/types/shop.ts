export interface ShopFilterState {
  search: string;
  gender: 'all' | 'women' | 'men' | 'unisex';
  category: string; // 'all' or specific category name
  collection: string; // 'all' or specific collection name
  fit: string; // 'all' or specific fit name
  size: string; // 'all' or specific size e.g. 'S', 'M'
  color: string; // 'all' or specific color name/family
  badge: string; // 'all' or 'SALE' | 'NEW' | 'BESTSELLER' | 'LIMITED' | 'TRENDING'
  priceRange: [number, number];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'discount';
  viewMode: 'grid-4' | 'grid-3' | 'grid-2';
}

export const DEFAULT_SHOP_FILTERS: ShopFilterState = {
  search: '',
  gender: 'all',
  category: 'all',
  collection: 'all',
  fit: 'all',
  size: 'all',
  color: 'all',
  badge: 'all',
  priceRange: [0, 150],
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'featured',
  viewMode: 'grid-4'
};
