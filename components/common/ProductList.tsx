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
      <span className="text-gray-500">Đang tải...</span>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-8 text-red-500">
      Lỗi khi tải sản phẩm
    </div>
  );

  const products = data?.items || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Hiển thị {products.length} sản phẩm
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy sản phẩm nào
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
