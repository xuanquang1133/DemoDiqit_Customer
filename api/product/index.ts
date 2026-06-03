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

export const productApi = {
  getProducts(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    category_ids?: string[];
  }) {
    return axiosClient.get<unknown, ProductListResponse>('/products', { params: { ...params, is_public: '1' } });
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
