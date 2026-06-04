'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import SearchIcon from '@/components/icons/CustomerSearchIcon';
import { useCartStore } from '@/stores/cartStore';
import { useFlyToCart } from '@/contexts/FlyToCartContext';
import FlyingImageLayer from '@/components/cart/FlyingImageLayer';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useAuthStore } from '@/stores/authStore';
import { categoryApi } from '@/api/category/index';
import toast from 'react-hot-toast';

const subscribeMounted = (onStoreChange: () => void) => {
  onStoreChange();
  return () => {};
};
const getSnapshotMounted = () => true;
const getServerSnapshotMounted = () => false;

export default function Header() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [isHoveringTopZone, setIsHoveringTopZone] = useState(false);
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);
  const mounted = useSyncExternalStore(subscribeMounted, getSnapshotMounted, getServerSnapshotMounted);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemCount = useCartStore((state) => state.itemCount());
  const { cartButtonRef } = useFlyToCart();
  const scrollDirection = useScrollDirection(10);
  const { user, token, logout, fetchUser } = useAuthStore();
  const [hasScrolled, setHasScrolled] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [shouldAutoHide, setShouldAutoHide] = useState(false);

  useEffect(() => {
    if (scrollDirection !== null) {
      flushSync(() => setHasScrolled(true));
    }
  }, [scrollDirection]);

  // Auto-hide after 3 seconds of inactivity
  useEffect(() => {
    const shouldShow = (scrollDirection === 'up' && hasScrolled) || isHoveringTopZone || isHoveringHeader;

    if (shouldShow && !isHoveringHeader) {
      hideTimerRef.current = setTimeout(() => {
        flushSync(() => setShouldAutoHide(true));
      }, 3000);
    } else {
      flushSync(() => setShouldAutoHide(false));
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    }

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [scrollDirection, hasScrolled, isHoveringTopZone, isHoveringHeader]);

  const isVisible = ((scrollDirection === 'up' && hasScrolled) || isHoveringTopZone || isHoveringHeader) && !shouldAutoHide;

  const { data: categoriesData } = useQuery({
    queryKey: ['header-categories'],
    queryFn: () => categoryApi.getCategories(true),
    staleTime: 5 * 60 * 1000,
  });

  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

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
      {/* Top trigger zone - invisible hover area to reveal header */}
      <div
        className="fixed top-0 left-0 right-0 h-12 z-[60] pointer-events-none"
        onMouseEnter={() => setIsHoveringTopZone(true)}
        onMouseLeave={() => setIsHoveringTopZone(false)}
      />
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => setIsHoveringHeader(true)}
        onMouseLeave={() => setIsHoveringHeader(false)}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-black tracking-tight">
                Intern<span className="text-red-600">Shop</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
                Trang chủ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
              </Link>
              {/* Products Menu - Hover Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setProductsMenuOpen(true)}
                onMouseLeave={() => setProductsMenuOpen(false)}
              >
                <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group flex items-center gap-1">
                  Sản phẩm
                  <svg
                    className={`w-3 h-3 text-gray-400 transition-transform ${productsMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
                </Link>

                {/* Mega Menu */}
                <AnimatePresence>
                  {productsMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[600px] bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                    >
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <Link
                          href="/products"
                          onClick={() => setProductsMenuOpen(false)}
                          className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-red-600 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                          </svg>
                          Xem tất cả sản phẩm
                        </Link>
                        <span className="text-xs text-gray-400">{categories.length} danh mục</span>
                      </div>

                      {/* Category Grid */}
                      <div className="p-4 grid grid-cols-3 gap-2">
                        {categories.map((cat: { id: number; name: string; code?: string }) => (
                          <Link
                            key={cat.id}
                            href={`/products?category=${cat.id}`}
                            onClick={() => setProductsMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-600">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                              </svg>
                            </span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                              {cat.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link href="/products?category=1" className="text-sm font-medium text-gray-600 hover:text-black transition-colors relative group">
                Khuyến mãi
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative w-64">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:border-red-300 focus:bg-white transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search - Mobile */}
              <button
                onClick={() => router.push('/products')}
                className="lg:hidden p-2 text-gray-600 hover:text-black transition-colors"
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              {/* Cart Button */}
              <button
                ref={cartButtonRef}
                onClick={() => router.push('/cart')}
                className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
                aria-label={`Giỏ hàng (${itemCount} sản phẩm)`}
                suppressHydrationWarning
              >
                <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {mounted && itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </button>

              {/* User Menu */}
              {isLoggedIn ? (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-full px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                      {user!.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm text-gray-700 max-w-[100px] truncate hidden lg:block">
                      {user!.username}
                    </span>
                    <svg
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                          <p className="font-semibold text-sm text-gray-900 truncate">
                            {user!.full_name || user!.username}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{user!.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.896 7.896 0 01-1.643-4.41A7.952 7.952 0 019.99 8c0-1.105-.224-2.155-.629-3.116a7.95 7.95 0 01-4.662-5.104A7.951 7.951 0 0111.99 0a7.952 7.952 0 017.282 3.78a7.95 7.95 0 01-.629 3.116 7.95 7.95 0 01-4.662 5.104 7.896 7.896 0 01-1.643 4.41" />
                            </svg>
                            Tài khoản của tôi
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            Lịch sử đơn hàng
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            Đăng xuất
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block px-5 py-2.5 bg-black text-white rounded-full hover:bg-red-600 transition-colors font-medium text-sm"
                >
                  Đăng nhập
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-black transition-colors"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="container-custom py-4 space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-colors"
                >
                  Trang chủ
                </Link>
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-colors"
                >
                  Sản phẩm
                </Link>
                <Link
                  href="/products?category=1"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Khuyến mãi
                </Link>
                {!isLoggedIn && (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium bg-black text-white rounded-xl text-center mt-4"
                  >
                    Đăng nhập
                  </Link>
                )}
                {isLoggedIn && (
                  <>
                    <div className="border-t border-gray-100 my-2 pt-2">
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        Tài khoản của tôi
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        Lịch sử đơn hàng
                      </Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full block px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      Đăng xuất
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
