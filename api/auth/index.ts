import axiosClient from '../axiosClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  full_name: string;
  roles: string[];
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  full_name: string;
  roles: string[];
  access_token: string;
}

export interface ApiSuccessResponse<T> {
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      code?: string;
    };
  };
}

export const authApi = {
  login(data: LoginRequest): Promise<LoginResponse> {
    return axiosClient.post<LoginResponse>('/auth/login', data).then((res) => res.data);
  },

  register(data: RegisterRequest) {
    return axiosClient.post<{ id: number; username: string; email: string; full_name: string }>('/auth/register', data).then((res) => res.data);
  },

  getUserInfo(): Promise<UserInfo> {
    return axiosClient.get<UserInfo>('/user-info-by-token').then((res) => res.data);
  },

  changePassword(data: ChangePasswordRequest) {
    return axiosClient.put<null>('/auth/change-password', data).then((res) => res.data);
  },
};
