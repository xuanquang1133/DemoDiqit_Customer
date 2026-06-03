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
    return axiosClient.post<unknown, ApiSuccessResponse<LoginResponse>>('/auth/login', data).then(res => res.data.data);
  },

  register(data: RegisterRequest) {
    return axiosClient.post<unknown, ApiSuccessResponse<{ id: number; username: string; email: string; full_name: string }>>('/auth/register', data).then(res => res.data.data);
  },

  getUserInfo(): Promise<UserInfo> {
    return axiosClient.get<unknown, ApiSuccessResponse<UserInfo>>('/user-info-by-token').then(res => res.data.data);
  },

  changePassword(data: ChangePasswordRequest) {
    return axiosClient.put<unknown, ApiSuccessResponse<null>>('/auth/change-password', data).then(res => res.data.data);
  },
};
