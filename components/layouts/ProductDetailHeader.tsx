'use client';

import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@/components/icons/CustomerChevronLeftIcon';
import InternshopLogo from '@/components/common/InternshopLogo';
import { useCartStore } from '@/stores/cartStore';
import CartIcon from '@/components/icons/CartIcon';

export default function ProductDetailHeader() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.itemCount());

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <InternshopLogo size="md" />
        </div>
        <div className="flex items-center gap-6 text-sm">
          <button
            onClick={() => router.push('/cart')}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CartIcon className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
