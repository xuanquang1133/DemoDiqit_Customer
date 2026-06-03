'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import CartTable from '@/components/cart/CartTable';
import CouponSection from '@/components/cart/CouponSection';
import OrderSummary from '@/components/cart/OrderSummary';

export default function CartPage() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.itemCount());

  const handleContinueShopping = () => {
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-[80px] max-w-7xl mx-auto px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Giỏ hàng
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({itemCount} {itemCount === 1 ? 'sản phẩm' : 'sản phẩm'})
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <CartTable onContinueShopping={handleContinueShopping} />
            <CouponSection />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-[80px]">
              <OrderSummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
