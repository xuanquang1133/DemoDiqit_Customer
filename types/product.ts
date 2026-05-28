export interface ProductCategoryInfo {
  id: number;
  name: string;
  code: string;
}

export interface Product {
  id: number;
  category_id: number | null;
  category?: ProductCategoryInfo;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  thumbnail: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
