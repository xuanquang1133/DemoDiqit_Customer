'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/product/index';
import { categoryApi } from '@/api/category/index';
import Banner from '@/components/layouts/Banner';
import ProductCard from '@/components/common/ProductCard';
import Pagination from '@/components/common/Pagination';
import ProductFilter from '@/components/common/ProductFilter';
import ProductSkeleton from '@/components/common/ProductSkeleton';

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';

  const [keyword, setKeyword] = useState(keywordParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(true),
    refetchOnWindowFocus: true,
  });

  const categories = Array.isArray(categoriesData)
    ? categoriesData as Array<{ id: number; name: string; code: string }>
    : [];

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory, page, keyword],
    queryFn: () => productApi.getProducts({
      page,
      limit: 8,
      keyword: keyword || undefined,
      category_ids: selectedCategory ? [selectedCategory] : undefined,
    }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (selectedCategory) params.set('category', selectedCategory);
    router.push(`/products${params.toString() ? `?${params}` : ''}`);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const products = data?.items || [];
  const totalPages = data?.total_pages || 1;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="pt-[60px]">
        <Banner />
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h1>

        {/* Search & Filter */}
        <ProductFilter
          keyword={keyword}
          selectedCategory={selectedCategory}
          categories={categories}
          onKeywordChange={setKeyword}
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
          onClear={() => {
            setKeyword('');
            setSelectedCategory('');
            setPage(1);
          }}
        />

        {/* Products Grid */}
        {isLoading ? (
          <ProductSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            Đã xảy ra lỗi khi tải sản phẩm
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy sản phẩm nào
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Hiển thị {products.length} sản phẩm
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
