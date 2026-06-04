'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useFlyToCart } from '@/contexts/FlyToCartContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { motion } from 'framer-motion';

export default function ProductDetailHeader() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.itemCount());
  const { cartButtonRef } = useFlyToCart();
  const isVisible = useScrollDirection(10);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back Button & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button onClick={() => router.push('/')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-black hidden sm:block">
                Intern<span className="text-red-600">Shop</span>
              </span>
            </button>
          </div>

          {/* Right: Cart Button */}
          <button
            ref={cartButtonRef}
            onClick={() => router.push('/cart')}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={`Giỏ hàng (${itemCount} sản phẩm)`}
          >
            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
