import axiosClient from '../axiosClient';

export const categoryApi = {
  getCategories(isActive?: boolean) {
    return axiosClient.get('/categories/list-common', {
      params: isActive !== undefined ? { is_active: isActive } : {},
    });
  },
};
