import axiosClient from '../axiosClient';

export const productApi = {
  getProducts(params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    category_ids?: string[];
  }) {
    return axiosClient.get('/products', { params: { ...params, is_public: '1' } });
  },

  getProduct(id: string) {
    return axiosClient.get(`/products/${id}`);
  },

  getProductBySlug(slug: string) {
    return axiosClient.get(`/products/slug/${slug}`);
  },

  getFeaturedProducts() {
    return axiosClient.get('/products/featured');
  },
};
