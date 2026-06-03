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
  total: number;
  page: number;
  limit: number;
}

export const productApi = {
  getProducts(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    category_ids?: string[];
  }) {
    return axiosClient.get<unknown, ProductListResponse>('/products', { params: { ...params, is_public: '1' } }).then(res => res.data.data);
  },

  getProduct(id: string) {
    return axiosClient.get<unknown, ProductListResponse['items'][0]>(`/products/${id}`).then(res => res.data.data);
  },

  getProductBySlug(slug: string) {
    return axiosClient.get<unknown, ProductListResponse['items'][0]>(`/products/slug/${slug}`).then(res => res.data.data);
  },

  getFeaturedProducts() {
    return axiosClient.get<unknown, ProductListResponse>('/products/featured').then(res => res.data.data);
  },
};
