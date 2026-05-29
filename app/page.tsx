'use client';

import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/product/index';
import Header from '@/components/layouts/Header';
import Banner from '@/components/layouts/Banner';
import ProductSkeleton from '@/components/common/ProductSkeleton';
import ProductCard from '@/components/common/ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  category?: { name: string };
}

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getProducts({ page: 1, limit: 8 }),
  });

  const products = data?.items || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Banner />
        <div className="max-w-7xl mx-auto px-8 py-8">
          <ProductSkeleton count={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Banner */}
      <Banner />

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-xl font-bold mb-6">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Chưa có sản phẩm nào
          </div>
        )}
      </div>
    </div>
  );
}
