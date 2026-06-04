'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi, CartItem } from '@/api/cart';

interface LocalCartItem {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  quantity: number;
  description?: string;
}

interface CartStore {
  items: LocalCartItem[];
  couponCode: string;
  discount: number;
  _serverLoaded: boolean;
  addItem: (item: Omit<LocalCartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  itemCount: () => number;
  subtotal: () => number;
  shipping: () => number;
  total: () => number;
  loadFromServer: (items: CartItem[]) => void;
}

const SHIPPING_FEE = 30000;

function syncToServer(items: LocalCartItem[]) {
  const token = localStorage.getItem('access_token');
  if (!token) return;
  if (items.length === 0) {
    cartApi.saveCart([]).catch(() => {});
    return;
  }
  cartApi
    .saveCart(
      items.map((i) => ({
        product_id: i.id,
        product_name: i.name,
        thumbnail: i.thumbnail,
        price: i.price,
        quantity: i.quantity,
        description: i.description,
      }))
    )
    .catch(() => {});
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      discount: 0,
      _serverLoaded: false,

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);

        let newItems: LocalCartItem[];
        if (existing) {
          newItems = items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...items, { ...item, quantity: 1 }];
        }

        set({ items: newItems });
        syncToServer(newItems);
      },

      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        set({ items: newItems });
        syncToServer(newItems);
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        const newItems = get().items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        );
        set({ items: newItems });
        syncToServer(newItems);
      },

      clearCart: () => {
        set({ items: [], couponCode: '', discount: 0 });
        cartApi.saveCart([]).catch(() => {});
      },

      setCoupon: (code, discount) => set({ couponCode: code, discount }),

      removeCoupon: () => set({ couponCode: '', discount: 0 }),

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      shipping: () => {
        const sub = get().subtotal();
        return sub === 0 ? 0 : SHIPPING_FEE;
      },

      total: () => {
        const sub = get().subtotal();
        const ship = get().shipping();
        const disc = get().discount;
        return sub + ship - disc;
      },

      loadFromServer: (serverItems) => {
        set({
          items: serverItems.map((i) => ({
            id: i.product_id,
            name: i.product_name,
            price: i.price,
            thumbnail: i.thumbnail,
            quantity: i.quantity,
            description: i.description,
          })),
          _serverLoaded: true,
        });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discount: state.discount,
      }),
    }
  )
);
