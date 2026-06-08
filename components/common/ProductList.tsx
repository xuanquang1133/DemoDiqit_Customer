'use client';

import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/product/index';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

interface ProductListProps {
  keyword?: string;
  categoryIds?: string[];
  page?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  category?: { id?: number; name?: string };
}

export default function ProductList({ keyword, categoryIds, page = 1 }: ProductListProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', keyword, categoryIds, page],
    queryFn: () => productApi.getProducts({ page, limit: 12, keyword, category_ids: categoryIds }),
  });

  if (isLoading) return (
    <div className="text-center py-8">
      <span className="text-gray-400 text-sm">Đang tải sản phẩm...</span>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-400 text-sm">Đã xảy ra lỗi khi tải sản phẩm</p>
    </div>
  );

  const products = data?.items || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-sm text-gray-500">
          Hiển thị {products.length} sản phẩm
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm sm:text-base">Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {data && data.total_pages > 1 && (
            <Pagination
              currentPage={data.page}
              totalPages={data.total_pages}
            />
          )}
        </>
      )}
    </div>
  );
}
