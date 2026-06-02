'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';

export default function OrderSummary() {
  const router = useRouter();
  const { subtotal, shipping, discount, total, couponCode, items } = useCartStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN').format(price);

  const discountAmount = Math.round(subtotal() * discount / 100);

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="bg-black text-white px-6 py-4">
        <h2 className="font-semibold text-sm">Tóm tắt đơn hàng</h2>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
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

        <button
          className="w-full mt-4 bg-red-500 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors shadow-md"
        >
          Tiến hành thanh toán
        </button>

        <button
          onClick={() => router.push('/products')}
          className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors text-center"
        >
          ← Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
}
