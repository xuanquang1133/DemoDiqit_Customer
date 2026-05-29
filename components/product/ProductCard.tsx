'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EyeIcon from '@/components/icons/CustomerEyeIcon';
import ShoppingBagIcon from '@/components/icons/CustomerShoppingBagIcon';
import PaperPlaneIcon from '@/components/icons/CustomerPaperPlaneIcon';

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
          <EyeIcon className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500">{product.category?.name}</p>
        <h3 className="font-medium text-sm line-clamp-2 mt-1">{product.name}</h3>
        <p className="text-red-600 font-semibold mt-2">{formattedPrice}đ</p>
        <div className="flex justify-center gap-3 mt-4">
          {/* Mua ngay - Paper Plane Icon */}
          <button
            className="w-28 h-10 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            title="Mua ngay"
          >
          <PaperPlaneIcon className="h-5 w-5" />
          </button>
          {/* Thêm vào giỏ hàng - Shopping Bag Icon */}
          <button
            className="w-28 h-10 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            title="Thêm vào giỏ hàng"
          >
          <ShoppingBagIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
