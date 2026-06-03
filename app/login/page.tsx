'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { authApi } from '@/api/auth';
import { cartApi } from '@/api/cart';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import toast from 'react-hot-toast';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email hoặc tài khoản';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await authApi.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      login(res.data.access_token, {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        full_name: res.data.full_name,
        roles: res.data.roles,
      });

      // Load server cart after login
      try {
        console.log('[LOGIN] Fetching cart from server...');
        const serverCart = await cartApi.getCart();
        console.log('[LOGIN] Server cart response:', JSON.stringify(serverCart, null, 2));
        if (serverCart.cart_items && serverCart.cart_items.length > 0) {
          console.log('[LOGIN] Loading server cart into local store, items:', serverCart.cart_items.length);
          useCartStore.getState().loadFromServer(serverCart.cart_items);
        } else {
          console.log('[LOGIN] Server cart is empty');
        }
      } catch (err) {
        console.error('[LOGIN] Failed to load server cart:', err);
      }

      toast.success('Đăng nhập thành công!');
      router.push(redirect);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? 'border-red-400 focus:ring-red-200 bg-red-50'
        : 'border-gray-200 focus:ring-orange-200 focus:border-orange-400'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="bg-black text-white px-8 py-5 text-center">
            <h1 className="text-xl font-bold">Đăng nhập</h1>
            <p className="text-gray-400 text-sm mt-1">Chào mừng bạn quay trở lại</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email / Tài khoản <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email hoặc tài khoản"
                className={inputClass('email')}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className={inputClass('password')}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-black text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>

            <p className="text-center text-sm text-gray-500 pt-2">
              Chưa có tài khoản?{' '}
              <Link
                href={`/register${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                className="text-orange-500 font-medium hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
