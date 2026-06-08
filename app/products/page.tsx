'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productApi, SortOption } from '@/api/product/index';
import { categoryApi } from '@/api/category/index';
import ProductCard from '@/components/common/ProductCard';
import Pagination from '@/components/common/Pagination';
import Banner from '@/components/layouts/Banner';
import ProductSkeleton from '@/components/common/ProductSkeleton';

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  category?: { id?: number; name?: string };
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'name_asc', label: 'Tên: A → Z' },
  { value: 'name_desc', label: 'Tên: Z → A' },
];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';
  const priceMinParam = searchParams.get('price_min') || '';
  const priceMaxParam = searchParams.get('price_max') || '';
  const sortParam = (searchParams.get('sort') || 'newest') as SortOption;

  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));

  // Sidebar filter states
  const [sidebarKeyword, setSidebarKeyword] = useState(keywordParam);
  const [priceMin, setPriceMin] = useState(priceMinParam);
  const [priceMax, setPriceMax] = useState(priceMaxParam);
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);
  const [sidebarCategory, setSidebarCategory] = useState(categoryParam);
  const productGridRef = useRef<HTMLDivElement>(null);
  const prevCategoryRef = useRef(categoryParam);
  const prevPageRef = useRef(Number(searchParams.get('page') || '1'));
  const isInitialMount = useRef(true);

  const scrollToProductGrid = () => {
    if (productGridRef.current) {
      const offset = 120;
      const elementTop = productGridRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementTop - offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const categoryChanged = prevCategoryRef.current !== sidebarCategory;
    const pageChanged = prevPageRef.current !== page;
    if (categoryChanged || pageChanged) {
      prevCategoryRef.current = sidebarCategory;
      prevPageRef.current = page;
      setTimeout(scrollToProductGrid, 200);
    }
  }, [sidebarCategory, page]);

  // Sync state when URL params change (from header navigation)
  useEffect(() => {
    const newKeyword = searchParams.get('keyword') || '';
    const newCategory = searchParams.get('category') || '';
    const newPage = Number(searchParams.get('page') || '1');
    const newPriceMin = searchParams.get('price_min') || '';
    const newPriceMax = searchParams.get('price_max') || '';
    const newSort = (searchParams.get('sort') || 'newest') as SortOption;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarKeyword(newKeyword);
    setSidebarCategory(newCategory);
    setPage(newPage);
    setPriceMin(newPriceMin);
    setPriceMax(newPriceMax);
    setSortBy(newSort);
  }, [searchParams]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(true),
    refetchOnWindowFocus: true,
  });

  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data as Array<{ id: number; name: string; code: string }>
    : [];

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', sidebarCategory, page, sidebarKeyword, sortBy, priceMin, priceMax],
    queryFn: () => productApi.getProducts({
      page,
      limit: 12,
      keyword: sidebarKeyword || undefined,
      category_ids: sidebarCategory ? [sidebarCategory] : undefined,
      price_min: priceMin ? Number(priceMin) : undefined,
      price_max: priceMax ? Number(priceMax) : undefined,
      sort: sortBy,
    }),
  });


  const handleSidebarCategoryChange = (catId: string) => {
    setSidebarCategory(catId);
    setPage(1);
    const params = new URLSearchParams();
    if (sidebarKeyword) params.set('keyword', sidebarKeyword);
    if (catId) params.set('category', catId);
    router.push(`/products${params.toString() ? `?${params}` : ''}`, { scroll: false });
  };

  const handleApplySidebarFilters = () => {
    setPage(1);
    const params = new URLSearchParams();
    if (sidebarKeyword) params.set('keyword', sidebarKeyword);
    if (sidebarCategory) params.set('category', sidebarCategory);
    if (priceMin) params.set('price_min', priceMin);
    if (priceMax) params.set('price_max', priceMax);
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);
    router.push(`/products${params.toString() ? `?${params}` : ''}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClear = () => {
    setSidebarKeyword('');
    setSidebarCategory('');
    setPriceMin('');
    setPriceMax('');
    setSortBy('newest');
    setPage(1);
    router.push('/products', { scroll: false });
  };

  const products = data?.items || [];
  const totalPages = data?.total_pages || 1;
  const totalItems = data?.total || products.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Section */}
      <Banner />

      <div className="container-custom py-4 sm:py-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => {
              const sidebar = document.getElementById('mobile-filter-sidebar');
              if (sidebar) {
                sidebar.classList.toggle('hidden');
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ lọc & Sắp xếp
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Desktop: sticky; Mobile: collapsible */}
          <aside id="mobile-filter-sidebar" className="hidden lg:block lg:w-72 lg:flex-shrink-0">
            <div className="sticky top-24">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Bộ lọc</h2>
                {(sidebarKeyword || sidebarCategory || priceMin || priceMax || sortBy !== 'newest') && (
                  <button
                    onClick={handleClear}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Search by Name */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Tìm theo tên</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    value={sidebarKeyword}
                    onChange={(e) => setSidebarKeyword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
              </div>

              {/* Filter by Category */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Danh mục</h3>
                <div className="relative">
                  <select
                    value={sidebarCategory}
                    onChange={(e) => handleSidebarCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Tất cả</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Filter by Price */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Khoảng giá</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all"
                  />
                </div>
                <button
                  onClick={handleApplySidebarFilters}
                  className="w-full mt-3 px-4 py-2 sm:py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Áp dụng
                </button>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Sắp xếp</h3>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Panel - shown when toggled */}
          <aside id="mobile-filter-sidebar-panel" className="lg:hidden hidden">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
                <button
                  onClick={() => {
                    const el = document.getElementById('mobile-filter-sidebar-panel');
                    if (el) el.classList.add('hidden');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Mobile filter content mirrors desktop sidebar */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Tìm theo tên</h3>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  value={sidebarKeyword}
                  onChange={(e) => setSidebarKeyword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Danh mục</h3>
                <select
                  value={sidebarCategory}
                  onChange={(e) => handleSidebarCategoryChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 appearance-none"
                >
                  <option value="">Tất cả</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Khoảng giá</h3>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Từ" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Đến" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Sắp xếp</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 appearance-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handleClear} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Xóa</button>
                <button onClick={handleApplySidebarFilters} className="flex-1 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800">Áp dụng</button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0" ref={productGridRef}>
            {/* Products Grid */}
            <section className="section !py-4 sm:!py-6">
              <div>
                {/* Results Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                  <p className="text-sm text-gray-500">
                    {isLoading ? (
                      'Đang tải...'
                    ) : (
                      <>
                        Hiển thị <span className="font-semibold text-gray-900">{products.length}</span> trong{' '}
                        <span className="font-semibold text-gray-900">{totalItems}</span> sản phẩm
                      </>
                    )}
                  </p>
                  {/* Sort Dropdown - Mobile */}
                  <div className="lg:hidden w-full sm:w-auto">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 transition-all appearance-none cursor-pointer"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Products */}
                {isLoading ? (
                  <ProductSkeleton count={12} />
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 sm:py-20"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-base sm:text-lg mb-4">Đã xảy ra lỗi khi tải sản phẩm</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2.5 sm:py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors text-sm"
                    >
                      Thử lại
                    </button>
                  </motion.div>
                ) : products.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 sm:py-16 md:py-20"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-base sm:text-lg mb-2">Không tìm thấy sản phẩm nào</p>
                    <p className="text-gray-400 text-sm mb-6">Thử tìm kiếm với từ khóa khác</p>
                    <button
                      onClick={handleClear}
                      className="px-6 py-2.5 sm:py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors text-sm"
                    >
                      Xem tất cả sản phẩm
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
                  >
                    {products.map((product: Product, index: number) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </motion.div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 sm:mt-12 flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" /></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
