'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productApi } from '@/api/product/index';
import { useCartStore } from '@/stores/cartStore';
import { useFlyToCart } from '@/contexts/FlyToCartContext';
import toast from 'react-hot-toast';

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  category?: { id?: number; name?: string };
  slug?: string;
  sku?: string;
  description?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const addItem = useCartStore((s) => s.addItem);
  const { triggerFly, cartButtonRef } = useFlyToCart();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getProductBySlug(slug) as Promise<ProductDetail>,
    enabled: !!slug,
  });

  const product = productData;
  const formattedPrice = product?.price
    ? new Intl.NumberFormat('vi-VN').format(product.price)
    : '0';

  const totalPrice = product?.price ? product.price * quantity : 0;
  const formattedTotalPrice = new Intl.NumberFormat('vi-VN').format(totalPrice);

  const handleAddToCart = () => {
    if (!product) return;

    if (imageContainerRef.current && cartButtonRef.current) {
      const startRect = imageContainerRef.current.getBoundingClientRect();
      const endRect = cartButtonRef.current.getBoundingClientRect();
      triggerFly(product.thumbnail, startRect, endRect, product.name);
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        description: product.description,
      });
    }

    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`, {
      duration: 2000,
      className: 'toast-success',
    });
  };

  const handleBuyNow = () => {
    const { items } = useCartStore.getState();
    const alreadyInCart = items.some((i) => i.id === product!.id);

    if (!alreadyInCart && product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          thumbnail: product.thumbnail,
          description: product.description,
        });
      }
    }

    router.push('/checkout');
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-16 md:pt-20">
        <div className="container-custom py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-8 w-1/3 bg-gray-100 rounded animate-pulse" />
              <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-500 mb-6">Sản phẩm bạn đang tìm kiếm không tồn tại</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-sm mb-8"
        >
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-black transition-colors"
          >
            Trang chủ
          </button>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <button
            onClick={() => router.push('/products')}
            className="text-gray-500 hover:text-black transition-colors"
          >
            Sản phẩm
          </button>
          {product.category?.name && (
            <>
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-gray-500">{product.category.name}</span>
            </>
          )}
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </motion.nav>

        {/* Product Info */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            ref={imageContainerRef}
            className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden sticky top-24"
          >
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Không có ảnh</span>
              </div>
            )}

            {/* Category Badge */}
            {product.category?.name && (
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-sm font-semibold text-gray-700 rounded-full shadow-lg">
                  {product.category.name}
                </span>
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Title & SKU */}
            <div>
              {product.sku && (
                <p className="text-sm text-gray-400 mb-2">SKU: {product.sku}</p>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold text-red-600">
                  {formattedPrice}
                </span>
                <span className="text-2xl text-red-600 font-medium">đ</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Giá đã bao gồm VAT</p>
            </div>

            {/* Quantity Selector */}
            <div className="border-t border-b border-gray-100 py-6">
              <label className="text-sm font-semibold text-gray-700 mb-4 block">
                Số lượng
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center font-semibold text-lg border-x-2 border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Còn hàng
                </span>
              </div>
            </div>

            {/* Total Price */}
            {quantity > 1 && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Tổng cộng ({quantity} sản phẩm):</span>
                <span className="text-xl font-bold text-red-600">
                  {formattedTotalPrice}
                  <span className="text-base ml-0.5">đ</span>
                </span>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Mô tả sản phẩm
                </h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 sticky bottom-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-lg">
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                Mua ngay
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Thêm vào giỏ hàng
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
