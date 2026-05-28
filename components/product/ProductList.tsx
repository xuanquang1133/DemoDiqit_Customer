'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api/product';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

interface ProductListProps {
  keyword?: string;
  categoryIds?: string[];
  page?: number;
}

export default function ProductList({ keyword, categoryIds, page = 1 }: ProductListProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', keyword, categoryIds, page],
    queryFn: () => getProducts({ page, limit: 12, keyword, category_ids: categoryIds }),
  });

  if (isLoading) return (
    <div className="text-center py-8">
      <span className="text-gray-500">Loading...</span>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-8 text-red-500">
      Error loading products
    </div>
  );

  const products = data?.items || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Showing {products.length} products
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No products found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {data?.total_pages > 1 && (
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
