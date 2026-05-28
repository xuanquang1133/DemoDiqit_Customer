import axiosClient from '@/lib/axios-client';

export const getCategories = async (isActive?: boolean) => {
  return axiosClient.get('/categories/list-common', {
    params: isActive !== undefined ? { is_active: isActive } : {},
  });
};
