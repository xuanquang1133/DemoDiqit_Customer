'use client';

import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';

export default function CheckoutSummary() {
  const { items, subtotal, shipping, discount, total, couponCode } = useCartStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN').format(price);

  const discountAmount = Math.round(subtotal() * discount / 100);

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden sticky top-[80px]">
      <div className="bg-black text-white px-6 py-4">
        <h2 className="font-semibold text-sm">Thông tin đơn hàng</h2>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 items-start">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">
                    x{item.quantity}
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatPrice(item.price * item.quantity)}đ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tạm tính</span>
            <span className="font-medium text-gray-700">{formatPrice(subtotal())}đ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Phí vận chuyển</span>
            <span className="font-medium text-gray-700">{formatPrice(shipping())}đ</span>
          </div>
          {couponCode && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Giảm giá ({couponCode} — {discount}%)</span>
              <span className="font-medium text-green-600">-{formatPrice(discountAmount)}đ</span>
            </div>
          )}
          <div className="border-t border-dashed pt-3 flex justify-between">
            <span className="font-semibold text-gray-800">Tổng cộng</span>
            <span className="font-bold text-red-600 text-lg">{formatPrice(total())}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
