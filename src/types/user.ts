export interface UserRecord {
  id: string;
  full_name: string;
  store_id: string;
  email: string;
  password: string;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id?: string;
  password?: string;
  fullName: string;
  storeId: string;
  email: string;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserFull {
  id?: string;
  password?: string;
  storeName?: string;
  fullName: string;
  storeId: string;
  email: string;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserActivationToken {
  id: string;
  userId: string;
  usedAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
