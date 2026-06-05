'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
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

export default function ProductsPage() {
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

      <div className="container-custom py-6">
        <div className="flex gap-8">
          {/* Left Sidebar - Sticky Filter */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
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
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Tìm theo tên</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    value={sidebarKeyword}
                    onChange={(e) => setSidebarKeyword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all"
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
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Danh mục</h3>
                <div className="relative">
                  <select
                    value={sidebarCategory}
                    onChange={(e) => handleSidebarCategoryChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all appearance-none cursor-pointer"
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
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Khoảng giá</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all"
                  />
                </div>
                <button
                  onClick={handleApplySidebarFilters}
                  className="w-full mt-3 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Áp dụng
                </button>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Sắp xếp</h3>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all appearance-none cursor-pointer"
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

          {/* Main Content */}
          <div className="flex-1 min-w-0" ref={productGridRef}>
            {/* Products Grid */}
            <section className="section">
              <div>
                {/* Results Info */}
                <div className="flex items-center justify-between mb-6">
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
                  <div className="hidden lg:flex items-center gap-4">
                    {/* Sort Dropdown - Desktop */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 transition-all appearance-none cursor-pointer"
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
                    className="text-center py-20"
                  >
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-lg mb-4">Đã xảy ra lỗi khi tải sản phẩm</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                      Thử lại
                    </button>
                  </motion.div>
                ) : products.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-lg mb-2">Không tìm thấy sản phẩm nào</p>
                    <p className="text-gray-400 text-sm mb-6">Thử tìm kiếm với từ khóa khác</p>
                    <button
                      onClick={handleClear}
                      className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                      Xem tất cả sản phẩm
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid-products"
                  >
                    {products.map((product: Product, index: number) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </motion.div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
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
