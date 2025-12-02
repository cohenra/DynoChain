export type Status = 'active' | 'quarantine' | 'pending' | 'shipped';

export interface Product {
  id: string;
  sku: string;
  name: string;
  barcode: string;
  dimensions: string; // LxWxH
  custom_attributes: Record<string, string | number | boolean>;
}

export interface Location {
  id: string;
  name: string;
  type: 'pick' | 'storage' | 'receiving';
  max_volume: number;
}

export interface InventoryItem {
  id: string;
  product_id: string;
  location_id: string;
  quantity: number;
  batch_number: string;
  expiry_date: string;
  status: Status;
  product?: Product; // Joined for UI convenience
  location?: Location;
}

export interface InboundOrder {
  id: string;
  supplier_name: string;
  status: 'draft' | 'pending' | 'received' | 'putaway';
  expected_date: string;
  items: InboundItem[];
}

export interface InboundItem {
  id: string;
  product_id: string;
  product_name: string;
  expected_qty: number;
  received_qty: number;
}

export interface BillingRule {
  id: string;
  name: string;
  trigger_event: 'storage_daily' | 'inbound_item' | 'picking_order';
  condition: string;
  fee_amount: number;
  currency: 'ILS' | 'USD';
}

export interface Invoice {
  id: string;
  customer_name: string;
  period: string;
  amount: number;
  status: 'paid' | 'open';
}

// Chat Types
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}