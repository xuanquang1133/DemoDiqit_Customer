'use client';

import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@/components/icons/CustomerChevronLeftIcon';
import InternshopLogo from '@/components/common/InternshopLogo';
import { useCartStore } from '@/stores/cartStore';
import CartIcon from '@/components/icons/CartIcon';
import FlyingImageLayer from '@/components/cart/FlyingImageLayer';
import { useFlyToCart } from '@/contexts/FlyToCartContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';

export default function ProductDetailHeader() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.itemCount());
  const { cartButtonRef } = useFlyToCart();
  const isVisible = useScrollDirection(10);

  return (
    <>
      <FlyingImageLayer />
      <header
        className="bg-white border-b shadow-sm z-40 transition-transform duration-300 ease-in-out"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
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
              ref={cartButtonRef}
              onClick={() => router.push('/cart')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CartIcon className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-in">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <style jsx global>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.2); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
