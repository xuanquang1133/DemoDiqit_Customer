'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/product/index';
import CartIcon from '@/components/icons/CartIcon';
import PaperPlaneIcon from '@/components/icons/CustomerPaperPlaneIcon';
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

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getProductBySlug(slug) as Promise<ProductDetail>,
    enabled: !!slug,
  });

  const product = productData;

  const formattedPrice = product?.price
    ? new Intl.NumberFormat('vi-VN').format(product.price)
    : '0';

  const handleAddToCart = () => {
    if (!product) return;

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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-[60px] max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div className="space-y-5">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-10 bg-gray-200 rounded w-3/4" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="pt-[60px] text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-[60px] max-w-5xl mx-auto px-6 py-4">
        <nav className="text-sm text-gray-500">
          <span
            className="hover:text-gray-700 cursor-pointer"
            onClick={() => router.push('/')}
          >
            Trang chủ
          </span>
          <span className="mx-2">/</span>
          <span>{product.category?.name || 'Sản phẩm'}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div
            ref={imageContainerRef}
            className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg"
          >
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Không có ảnh</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {product.category?.name && (
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full w-fit mb-3">
                {product.category.name}
              </span>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {product.sku && (
              <div className="text-sm text-gray-400 mb-4">
                Mã sản phẩm: <span className="font-medium">{product.sku}</span>
              </div>
            )}

            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-6">
              <span className="text-4xl font-bold text-red-600">{formattedPrice}</span>
              <span className="text-lg text-red-600 ml-1">đ</span>
            </div>

            <div className="border-t border-gray-200 pt-6 flex-grow">
              <h2 className="font-semibold text-gray-900 text-lg mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Mô tả sản phẩm
              </h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap bg-white rounded-xl p-4 border">
                {product.description || 'Sản phẩm chưa có mô tả chi tiết.'}
              </div>
            </div>

            <div className="flex gap-4 pt-6 mt-6">
              <button className="flex-1 bg-black text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-lg flex items-center justify-center gap-2">
                <PaperPlaneIcon className="h-5 w-5" />
                Mua ngay
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-lg flex items-center justify-center gap-2"
              >
                <CartIcon className="h-5 w-5" />
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
