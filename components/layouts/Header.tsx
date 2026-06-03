'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import SearchIcon from '@/components/icons/CustomerSearchIcon';
import InternshopLogo from '@/components/common/InternshopLogo';
import { useCartStore } from '@/stores/cartStore';
import CartIcon from '@/components/icons/CartIcon';
import { useFlyToCart } from '@/contexts/FlyToCartContext';
import FlyingImageLayer from '@/components/cart/FlyingImageLayer';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export default function Header() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemCount = useCartStore((state) => state.itemCount());
  const { cartButtonRef } = useFlyToCart();
  const isVisible = useScrollDirection(10);
  const { user, token, logout, fetchUser } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.success('Đã đăng xuất');
    router.push('/');
  };

  const isLoggedIn = !!token && !!user;

  return (
    <>
      <FlyingImageLayer />
      <header
        className="border-b bg-white z-40 transition-transform duration-300 ease-in-out"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            <InternshopLogo size="lg" />
          </Link>
          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-64 px-4 py-2 border rounded-lg text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </form>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-orange-500 transition-colors">
                Trang chủ
              </Link>
              <Link href="/products" className="hover:text-orange-500 transition-colors font-medium">
                Tất cả sản phẩm
              </Link>
              <button
                ref={cartButtonRef}
                onClick={() => router.push('/cart')}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={`Giỏ hàng (${itemCount} sản phẩm)`}
                suppressHydrationWarning
              >
                <CartIcon className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-in">
                    {itemCount}
                  </span>
                )}
              </button>

              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                      {user!.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-700 max-w-[100px] truncate">
                      {user!.username}
                    </span>
                    <svg
                      className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border rounded-xl shadow-lg py-1 z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-sm text-gray-800 truncate">
                          {user!.full_name || user!.username}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user!.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.896 7.896 0 01-1.643-4.41A7.952 7.952 0 019.99 8c0-1.105-.224-2.155-.629-3.116a7.95 7.95 0 01-4.662-5.104A7.951 7.951 0 0111.99 0a7.952 7.952 0 017.282 3.78a7.95 7.95 0 01-.629 3.116 7.95 7.95 0 01-4.662 5.104 7.896 7.896 0 01-1.643 4.41" />
                        </svg>
                        Tài khoản của tôi
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                        Lịch sử đơn hàng
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  Đăng nhập
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      <style jsx global>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.2); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
