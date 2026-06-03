'use client';

import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';
import ProductSkeleton from '@/components/common/ProductSkeleton';

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageLoading />}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-[60px] h-[200px] bg-gray-100" />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h1>
        <ProductSkeleton count={8} />
      </div>
    </div>
  );
}
