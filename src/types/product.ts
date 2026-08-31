export interface ProductRecord {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price_in_cents: number;
  stock_quantity: number;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string | null;
  priceInCents: number;
  stockQuantity: number;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  name: string;
  description?: string | null;
  priceInCents: number;
  stockQuantity?: number;
  images?: string[];
}

export interface UpdateProductInput {
  name?: string;
  description?: string | null;
  priceInCents?: number;
  stockQuantity?: number;
  images?: string[];
}
