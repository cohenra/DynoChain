import { Product, InventoryItem, InboundOrder } from '../types';

// The Vite proxy redirects /api to http://localhost:8000
const API_BASE = '/api';

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
};

export const fetchInventory = async (): Promise<InventoryItem[]> => {
  const res = await fetch(`${API_BASE}/inventory`);
  if (!res.ok) throw new Error('Failed to fetch inventory');
  return res.json();
};

export const fetchInboundOrders = async (): Promise<InboundOrder[]> => {
  const res = await fetch(`${API_BASE}/inbound-orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const fetchInboundOrderDetails = async (id: string): Promise<InboundOrder> => {
    const res = await fetch(`${API_BASE}/inbound-orders/${id}`);
    if (!res.ok) throw new Error('Failed to fetch order details');
    return res.json();
}
