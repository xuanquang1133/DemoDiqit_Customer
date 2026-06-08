'use client';

import Image from 'next/image';
import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import { useFlyToCart } from '@/contexts/FlyToCartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    id: number;
    slug?: string;
    name: string;
    price: number;
    thumbnail: string;
    category?: { id?: number; name?: string };
    description?: string;
  };
  index?: number;
}

export interface ProductCardHandle {
  getImageRect: () => DOMRect | null;
}

const ProductCard = forwardRef<ProductCardHandle, ProductCardProps>(
  ({ product, index = 0 }, ref) => {
    const router = useRouter();
    const addItem = useCartStore((s) => s.addItem);
    const { triggerFly, cartButtonRef } = useFlyToCart();
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price);

    useImperativeHandle(ref, () => ({
      getImageRect: () => {
        if (!imageContainerRef.current) return null;
        return imageContainerRef.current.getBoundingClientRect();
      },
    }));

    const handleViewDetail = () => {
      const url = product.slug
        ? `/products/${product.slug}`
        : `/products/${product.id}`;
      router.push(url);
    };

    const handleBuyNow = useCallback(() => {
      const { items } = useCartStore.getState();
      const alreadyInCart = items.some((i) => i.id === product.id);

      if (!alreadyInCart) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          thumbnail: product.thumbnail,
          description: product.description,
        });
      }

      router.push('/checkout');
    }, [product, addItem, router]);

    const handleAddToCart = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();

      if (imageContainerRef.current && cartButtonRef.current) {
        const startRect = imageContainerRef.current.getBoundingClientRect();
        const endRect = cartButtonRef.current.getBoundingClientRect();
        triggerFly(product.thumbnail, startRect, endRect, product.name);
      }

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        description: product.description,
      });

      toast.success(`Đã thêm "${product.name}" vào giỏ hàng`, {
        duration: 2000,
        className: 'toast-success',
      });
    }, [product, addItem, triggerFly, cartButtonRef]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
        className="group cursor-pointer"
        onClick={handleViewDetail}
      >
        <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:border-gray-200 hover:-translate-y-1">
          {/* Image Container */}
          <div
            ref={imageContainerRef}
            className="relative aspect-[4/5] overflow-hidden bg-gray-50"
          >
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Quick actions on hover - visible on hover for desktop, always on mobile */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 sm:opacity-0 sm:translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full py-2 sm:py-3 bg-white text-black font-semibold rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-xs sm:text-sm"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Thêm vào giỏ
              </button>
            </div>

            {/* Category badge */}
            {product.category?.name && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full">
                  {product.category.name}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 md:p-5">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors duration-300 text-xs sm:text-sm md:text-base leading-snug mb-2 sm:mb-3 min-h-[2.5rem]">
              {product.name}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div className="flex flex-col">
                <span className="text-sm sm:text-base md:text-xl font-bold text-red-600 whitespace-nowrap">
                  {formattedPrice}
                  <span className="text-[10px] sm:text-xs md:text-sm font-medium ml-0.5">đ</span>
                </span>
              </div>
              <button
                onClick={handleBuyNow}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-[10px] sm:text-xs md:text-sm font-medium rounded-full hover:bg-red-600 transition-colors duration-300 opacity-0 sm:group-hover:opacity-100 w-fit sm:ml-auto"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
