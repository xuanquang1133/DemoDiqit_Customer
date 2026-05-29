'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SearchIcon from '@/components/icons/CustomerSearchIcon';
import InternshopLogo from '@/components/common/InternshopLogo';
import { useCartStore } from '@/stores/cartStore';
import CartIcon from '@/components/icons/CartIcon';

export default function Header() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const itemCount = useCartStore((state) => state.itemCount());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <header className="border-b">
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
              className="w-64 px-4 py-2 border rounded-lg text-sm pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <Link href="/products" className="hover:text-blue-600 transition-colors font-medium">
              All Product
            </Link>
            <button
              onClick={() => router.push('/cart')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CartIcon className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
            <span className="cursor-pointer hover:text-blue-600">Login</span>
          </nav>
        </div>
      </div>
    </header>
  );
}
