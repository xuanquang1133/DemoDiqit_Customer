import axiosClient from '../axiosClient';

export interface CreateOrderItem {
  product_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_fee: number;
  notes?: string;
  items: CreateOrderItem[];
}

export interface OrderItemResponse {
  id: number;
  product_id: number | null;
  product_name: string;
  product_thumbnail: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes: string;
  items_count: number;
  order_items: OrderItemResponse[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedOrders {
  items: OrderResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export const orderApi = {
  createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
    return axiosClient.post<{ message: string; data: OrderResponse }>('/orders', data).then(res => res.data.data);
  },

  getMyOrders(page = 1, limit = 10): Promise<PaginatedOrders> {
    return axiosClient.get<{ message: string; data: PaginatedOrders }>(`/my-orders?page=${page}&limit=${limit}`).then(res => res.data.data);
  },

  getMyOrderDetail(id: number): Promise<OrderResponse> {
    return axiosClient.get<{ message: string; data: OrderResponse }>(`/my-orders/${id}`).then(res => res.data.data);
  },

  cancelMyOrder(id: number): Promise<OrderResponse> {
    return axiosClient.post<{ message: string; data: OrderResponse }>(`/my-orders/${id}/cancel`).then(res => res.data.data);
  },
};
