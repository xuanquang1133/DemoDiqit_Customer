import axiosClient from '../axiosClient';

export interface ProductListResponse {
  items: Array<{
    id: number;
    name: string;
    price: number;
    thumbnail: string;
    category?: { id?: number; name?: string };
    slug?: string;
  }>;
  total_pages: number;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

export const productApi = {
  getProducts(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    category_ids?: string[];
    price_min?: number;
    price_max?: number;
    sort?: SortOption;
  }) {
    const query: Record<string, string | number | boolean> = { is_public: true };

    if (params?.page) query.page = params.page;
    if (params?.limit) query.limit = params.limit;
    if (params?.keyword) query.keyword = params.keyword;
    if (params?.category_ids?.length) query.category_ids = params.category_ids.join(',');
    if (params?.price_min !== undefined && params.price_min !== null && params.price_min !== '') {
      query.price_min = params.price_min;
    }
    if (params?.price_max !== undefined && params.price_max !== null && params.price_max !== '') {
      query.price_max = params.price_max;
    }
    if (params?.sort) query.sort = params.sort;

    return axiosClient.get<unknown, ProductListResponse>('/products', { params: query });
  },

  getProduct(id: string) {
    return axiosClient.get<unknown, ProductListResponse['items'][0]>(`/products/${id}`);
  },

  getProductBySlug(slug: string) {
    return axiosClient.get<unknown, ProductListResponse['items'][0]>(`/products/slug/${slug}`);
  },

  getFeaturedProducts() {
    return axiosClient.get<unknown, ProductListResponse>('/products/featured');
  },
};
