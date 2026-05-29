'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SearchIcon from '@/components/icons/CustomerSearchIcon';
import InternshopLogo from '@/components/common/InternshopLogo';

export default function Header() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

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
            <span className="cursor-pointer hover:text-blue-600">Cart (0)</span>
            <span className="cursor-pointer hover:text-blue-600">Login</span>
          </nav>
        </div>
      </div>
    </header>
  );
}
