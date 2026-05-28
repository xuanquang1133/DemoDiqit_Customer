import axiosClient from '@/lib/axios-client';

export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  keyword?: string;
  category_ids?: string[];
}) => {
  return axiosClient.get('/products', { params: { ...params, is_public: '1' } });
};

export const getProduct = async (id: string) => {
  const response = await axiosClient.get(`/products/${id}`);
  return response;
};

export const getProductBySlug = async (slug: string) => {
  const response = await axiosClient.get(`/products/slug/${slug}`);
  return response;
};

export const getFeaturedProducts = async () => {
  return axiosClient.get('/products/featured');
};
