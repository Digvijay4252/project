export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'BLOCKED';
  seller_approval?: 'PENDING' | 'APPROVED' | 'BLOCKED' | null;
}

export interface Food {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  image_url: string;
  is_available: boolean;
  store_id: number;
  store_name?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  distance_km?: number;
}

export interface Store {
  id: number;
  seller_id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string;
}

export interface Order {
  id: number;
  user_id: number;
  store_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  store_name?: string;
}
