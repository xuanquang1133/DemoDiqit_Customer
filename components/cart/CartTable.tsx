'use client';

import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';

interface CartTableProps {
  onContinueShopping: () => void;
}

export default function CartTable({ onContinueShopping }: CartTableProps) {
  const { items, updateQuantity, removeItem } = useCartStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN').format(price);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Giỏ hàng trống</h3>
        <p className="text-gray-400 mb-6">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
        <button
          onClick={onContinueShopping}
          className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 border-b">
        <div className="col-span-5">Sản phẩm</div>
        <div className="col-span-2 text-center">Đơn giá</div>
        <div className="col-span-2 text-center">Số lượng</div>
        <div className="col-span-2 text-center">Thành tiền</div>
        <div className="col-span-1 text-center">Xóa</div>
      </div>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors"
          >
            <div className="col-span-5 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-gray-800 text-sm line-clamp-2">{item.name}</h4>
                {item.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {item.description.length > 80 ? `${item.description.slice(0, 80)}...` : item.description}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-2 text-center">
              <span className="text-red-600 font-semibold text-sm">
                {formatPrice(item.price)}đ
              </span>
            </div>

            <div className="col-span-2 flex items-center justify-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-lg border hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600 font-bold"
              >
                −
              </button>
              <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg border hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600 font-bold"
              >
                +
              </button>
            </div>

            <div className="col-span-2 text-center">
              <span className="text-red-600 font-bold text-sm">
                {formatPrice(item.price * item.quantity)}đ
              </span>
            </div>

            <div className="col-span-1 flex justify-center">
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa sản phẩm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
