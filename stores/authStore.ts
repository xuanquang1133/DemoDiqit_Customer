'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, UserInfo } from '@/api/auth';
import { cartApi } from '@/api/cart';
import { useCartStore } from './cartStore';

interface AuthStore {
  user: UserInfo | null;
  token: string | null;
  isLoading: boolean;
  _hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      login: (token: string, user: UserInfo) => {
        localStorage.setItem('access_token', token);
        set({ token, user });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('cart-storage');
        useCartStore.getState().clearCart();
        useCartStore.setState({ _serverLoaded: false });
        set({ user: null, token: null });
      },

      fetchUser: async () => {
        const token = get().token;
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await authApi.getUserInfo();
          set({ user: response.data, isLoading: false });

          const serverCart = await cartApi.getCart();
          const serverItems = serverCart.cart_items;
          if (serverItems && serverItems.length > 0) {
            useCartStore.getState().loadFromServer(serverItems);
          }
        } catch {
          set({ isLoading: false });
        }
      },

      isAuthenticated: () => {
        return !!get().token && !!get().user;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
