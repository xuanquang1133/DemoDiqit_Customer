import axiosClient from '../axiosClient';

export interface CategoryListResponse {
  data: Array<{
    id: number;
    name: string;
    code?: string;
  }>;
}

export const categoryApi = {
  getCategories(isActive?: boolean) {
    return axiosClient.get<unknown, CategoryListResponse>('/categories/list-common', {
      params: isActive !== undefined ? { is_active: isActive } : {},
    }).then(res => res.data.data);
  },
};
