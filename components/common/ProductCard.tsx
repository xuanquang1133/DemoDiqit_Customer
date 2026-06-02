'use client';

import Image from 'next/image';
import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import EyeIcon from '@/components/icons/CustomerEyeIcon';
import CartIcon from '@/components/icons/CartIcon';
import PaperPlaneIcon from '@/components/icons/CustomerPaperPlaneIcon';
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
}

export interface ProductCardHandle {
  getImageRect: () => DOMRect | null;
}

const ProductCard = forwardRef<ProductCardHandle, ProductCardProps>(
  ({ product }, ref) => {
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

    const handleAddToCart = useCallback(() => {
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
        style: { background: '#16a34a', color: '#fff', fontSize: '14px' },
      });
    }, [product, addItem, triggerFly, cartButtonRef]);

    return (
      <div className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
        <div
          ref={imageContainerRef}
          className="relative h-48 bg-gray-100 cursor-pointer"
          onClick={handleViewDetail}
        >
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            onClick={handleViewDetail}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <EyeIcon className="h-6 w-6 text-gray-700" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500">{product.category?.name}</p>
          <h3 className="font-medium text-sm line-clamp-2 mt-1">{product.name}</h3>
          <p className="text-red-600 font-semibold mt-2">{formattedPrice}đ</p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              className="w-28 h-10 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              title="Mua ngay"
            >
              <PaperPlaneIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-28 h-10 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              title="Thêm vào giỏ hàng"
            >
              <CartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
