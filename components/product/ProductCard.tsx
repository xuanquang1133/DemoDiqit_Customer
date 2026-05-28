'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: {
    id: number;
    slug?: string;
    name: string;
    price: number;
    thumbnail: string;
    category?: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price);

  const handleViewDetail = () => {
    const url = product.slug ? `/products/${product.slug}` : `/products/${product.id}`;
    router.push(url);
  };

  return (
    <div className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className="relative h-48 bg-gray-100 cursor-pointer group"
        onClick={handleViewDetail}
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        {/* Search icon overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500">{product.category?.name}</p>
        <h3 className="font-medium text-sm line-clamp-2 mt-1">{product.name}</h3>
        <p className="text-red-600 font-semibold mt-2">{formattedPrice}đ</p>
        <div className="flex justify-center gap-3 mt-4">
          {/* Mua - Cart Icon */}
          <button
            className="w-28 h-10 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            title="Mua ngay"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
          {/* Thêm vào giỏ hàng - Shopping Bag Icon */}
          <button
            className="w-28 h-10 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            title="Thêm vào giỏ hàng"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
