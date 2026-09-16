import { Product, Order, SectionConfig, Customer, Coupon, SEOSettings, GlobalThemeSettings } from '../types/cms';

const BASE_URL = '/api';

export async function fetchHealth(): Promise<{ status: string; database: string; message: string }> {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}

export async function fetchProducts(): Promise<Product[] | null> {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function createProductApi(product: Omit<Product, 'id'> | Product): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateProductApi(id: string, product: Partial<Product>): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function deleteProductApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchOrders(): Promise<Order[] | null> {
  try {
    const res = await fetch(`${BASE_URL}/orders`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function createOrderApi(order: Omit<Order, 'id' | 'orderNumber' | 'date'> & { id?: string; orderNumber?: string; date?: string }): Promise<Order | null> {
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateOrderStatusApi(orderId: string, fulfillmentStatus: Order['fulfillmentStatus']): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fulfillmentStatus }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchSections(): Promise<SectionConfig[] | null> {
  try {
    const res = await fetch(`${BASE_URL}/sections`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveSectionsApi(sections: SectionConfig[]): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/sections`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sections),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchCustomers(): Promise<Customer[] | null> {
  try {
    const res = await fetch(`${BASE_URL}/customers`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchCoupons(): Promise<Coupon[] | null> {
  try {
    const res = await fetch(`${BASE_URL}/coupons`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchSettings(): Promise<{ seo: SEOSettings; theme: GlobalThemeSettings } | null> {
  try {
    const res = await fetch(`${BASE_URL}/settings`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveSettingsApi(settings: { seo?: Partial<SEOSettings>; theme?: Partial<GlobalThemeSettings> }): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.ok;
  } catch {
    return false;
  }
}
