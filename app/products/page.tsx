'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api/product';
import { getCategories } from '@/api/category';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import ProductCard from '@/components/product/ProductCard';
import Pagination from '@/components/product/Pagination';
import ProductFilter from '@/components/ProductFilter';
import ProductSkeleton from '@/components/ProductSkeleton';

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  category?: { id: number; name: string };
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';

  const [keyword, setKeyword] = useState(keywordParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(true),
    refetchOnWindowFocus: true,
  });

  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : Array.isArray(categoriesData?.items)
    ? categoriesData.items
    : [];

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory, page, keyword],
    queryFn: () => getProducts({
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
      <Header />

      {/* Hero Banner */}
      <Banner />

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
              {products.map((product: Product) => (
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
