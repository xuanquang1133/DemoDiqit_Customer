'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SearchIcon from '@/components/icons/CustomerSearchIcon';
import InternshopLogo from '@/components/common/InternshopLogo';
import { useCartStore } from '@/stores/cartStore';
import CartIcon from '@/components/icons/CartIcon';
import { useFlyToCart } from '@/contexts/FlyToCartContext';
import FlyingImageLayer from '@/components/cart/FlyingImageLayer';
import { useScrollDirection } from '@/hooks/useScrollDirection';

export default function Header() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const itemCount = useCartStore((state) => state.itemCount());
  const { cartButtonRef } = useFlyToCart();
  const isVisible = useScrollDirection(10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

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
                All Product
              </Link>
              <button
                ref={cartButtonRef}
                onClick={() => router.push('/cart')}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={`Giỏ hàng (${itemCount} sản phẩm)`}
              >
                <CartIcon className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-in">
                    {itemCount}
                  </span>
                )}
              </button>
              <span className="cursor-pointer hover:text-orange-500">Login</span>
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
