'use client';

import { usePathname } from 'next/navigation';
import FlyToCartProvider from '@/contexts/FlyToCartContext';
import Header from '@/components/layouts/Header';
import ProductDetailHeader from '@/components/layouts/ProductDetailHeader';

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProductDetail = pathname?.startsWith('/products/') && pathname !== '/products';

  return (
    <FlyToCartProvider>
      {isProductDetail ? <ProductDetailHeader /> : <Header />}
      <main style={{ paddingTop: '72px' }}>
        {children}
      </main>
    </FlyToCartProvider>
  );
}
