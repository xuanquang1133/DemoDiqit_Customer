import axios, { type AxiosRequestConfig } from 'axios';

export interface ApiResponse<T> {
  message: string;
  data: T;
}

type AxiosConfig = AxiosRequestConfig;

interface AxiosClient extends Omit<typeof axios, 'get' | 'post' | 'put' | 'patch' | 'delete'> {
  get<T>(url: string, config?: AxiosConfig): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown, config?: AxiosConfig): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown, config?: AxiosConfig): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: unknown, config?: AxiosConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: AxiosConfig): Promise<ApiResponse<T>>;
}

const _axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

_axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

_axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
    }
    return Promise.reject(error);
  }
);

const axiosClient: AxiosClient = _axiosClient as unknown as AxiosClient;

export default axiosClient;
