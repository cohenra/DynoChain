import { Product, InventoryItem, Location, InboundOrder, BillingRule, Invoice } from '../types';

// Mock Database
export const PRODUCTS: Product[] = [
  { id: 'p1', sku: 'LGS-001', name: 'Wireless Headphones', barcode: '8809981', dimensions: '10x5x5', custom_attributes: { 'color': 'black', 'battery_life': '24h' } },
  { id: 'p2', sku: 'LGS-002', name: 'Smart Watch Gen 4', barcode: '8809982', dimensions: '5x5x2', custom_attributes: { 'color': 'silver', 'waterproof': true } },
  { id: 'p3', sku: 'LGS-003', name: 'Mechanical Keyboard', barcode: '8809983', dimensions: '40x15x4', custom_attributes: { 'switch_type': 'blue', 'layout': 'HE' } },
  { id: 'p4', sku: 'LGS-004', name: 'Gaming Mouse', barcode: '8809984', dimensions: '12x7x4', custom_attributes: { 'dpi': 16000 } },
];

export const LOCATIONS: Location[] = [
  { id: 'l1', name: 'A-01-01', type: 'pick', max_volume: 100 },
  { id: 'l2', name: 'A-01-02', type: 'pick', max_volume: 100 },
  { id: 'l3', name: 'B-STORAGE', type: 'storage', max_volume: 1000 },
  { id: 'l4', name: 'R-DOCK', type: 'receiving', max_volume: 5000 },
];

export const INVENTORY: InventoryItem[] = [
  { id: 'inv1', product_id: 'p1', location_id: 'l1', quantity: 50, batch_number: 'B001', expiry_date: '2025-12-31', status: 'active' },
  { id: 'inv2', product_id: 'p2', location_id: 'l1', quantity: 30, batch_number: 'B002', expiry_date: '2026-06-30', status: 'active' },
  { id: 'inv3', product_id: 'p3', location_id: 'l3', quantity: 150, batch_number: 'B003', expiry_date: '2099-01-01', status: 'quarantine' },
  { id: 'inv4', product_id: 'p1', location_id: 'l3', quantity: 200, batch_number: 'B004', expiry_date: '2025-11-15', status: 'active' },
];

export const INBOUND_ORDERS: InboundOrder[] = [
  { 
    id: 'ord-101', 
    supplier_name: 'TechGiant Ltd', 
    status: 'pending', 
    expected_date: '2024-05-20',
    items: [
      { id: 'oi-1', product_id: 'p1', product_name: 'Wireless Headphones', expected_qty: 100, received_qty: 0 },
      { id: 'oi-2', product_id: 'p4', product_name: 'Gaming Mouse', expected_qty: 50, received_qty: 0 }
    ]
  },
  { 
    id: 'ord-102', 
    supplier_name: 'Global Imports', 
    status: 'received', 
    expected_date: '2024-05-15',
    items: [
      { id: 'oi-3', product_id: 'p2', product_name: 'Smart Watch Gen 4', expected_qty: 200, received_qty: 200 }
    ]
  },
];

export const BILLING_RULES: BillingRule[] = [
  { id: 'br-1', name: 'Pallet Storage Fee', trigger_event: 'storage_daily', condition: 'location_type == "storage"', fee_amount: 2.50, currency: 'ILS' },
  { id: 'br-2', name: 'Pick Fee (Standard)', trigger_event: 'picking_order', condition: 'items_count <= 10', fee_amount: 1.50, currency: 'ILS' },
  { id: 'br-3', name: 'Inbound Handling', trigger_event: 'inbound_item', condition: 'all', fee_amount: 0.50, currency: 'ILS' },
];

export const INVOICES: Invoice[] = [
  { id: 'inv-2024-04', customer_name: 'GadgetStore IL', period: 'Apr 2024', amount: 4500.00, status: 'paid' },
  { id: 'inv-2024-05', customer_name: 'GadgetStore IL', period: 'May 2024', amount: 1250.50, status: 'open' },
];

// Helper to hydrate inventory with details
export const getInventoryWithDetails = () => {
  return INVENTORY.map(item => ({
    ...item,
    product: PRODUCTS.find(p => p.id === item.product_id),
    location: LOCATIONS.find(l => l.id === item.location_id)
  }));
};