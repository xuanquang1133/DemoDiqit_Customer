import axiosClient from '../axiosClient';

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  thumbnail: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface GetCartResponse {
  id: number;
  cart_items: CartItem[];
  total_items: number;
}

export interface SaveCartItem {
  product_id: number;
  product_name: string;
  thumbnail: string;
  price: number;
  quantity: number;
  description?: string;
}

export const cartApi = {
  getCart(): Promise<{ cart_items: CartItem[]; total_items: number }> {
    return axiosClient.get<GetCartResponse>('/cart').then((res) => res.data);
  },

  saveCart(items: SaveCartItem[]): Promise<unknown> {
    return axiosClient.post('/cart', { cart_items: items });
  },
};
