'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, subtotal, total } = useCartStore();
  const token = useAuthStore((s) => s.token);

  const formattedSubtotal = new Intl.NumberFormat('vi-VN').format(subtotal());
  const formattedTotal = new Intl.NumberFormat('vi-VN').format(total());
  const itemCount = items.length;

  const handleCheckout = () => {
    if (!token) {
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-16 md:pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy tiếp tục mua sắm!</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Khám phá sản phẩm
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 sm:pb-0">
      <div className="container-custom py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Giỏ hàng</h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">{itemCount} sản phẩm trong giỏ hàng</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const formattedPrice = new Intl.NumberFormat('vi-VN').format(item.price);
                const formattedSubtotal = new Intl.NumberFormat('vi-VN').format(item.price * item.quantity);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-3 sm:gap-4 md:gap-6">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-50 rounded-xl sm:rounded-xl overflow-hidden">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-500 text-xs sm:text-sm">Đơn giá: <span className="font-medium text-gray-900">{formattedPrice}đ</span></p>
                          <p className="font-bold text-red-600 text-sm sm:text-lg">{formattedSubtotal}đ</p>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex items-center justify-between mt-2 sm:mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border-2 border-gray-100 rounded-lg sm:rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-8 h-8 sm:w-12 sm:h-10 flex items-center justify-center font-semibold border-x-2 border-gray-100 text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Xóa sản phẩm"
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Clear Cart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end pt-2 sm:pt-4"
            >
              <button
                onClick={clearCart}
                className="text-xs sm:text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1.5 sm:gap-2"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Xóa tất cả
              </button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 sticky top-24"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Tạm tính ({itemCount} sản phẩm)</span>
                  <span className="font-medium text-gray-900">{formattedSubtotal}đ</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Giảm giá</span>
                  <span className="font-medium text-green-600">-0đ</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-900">
                    {subtotal() >= 500000 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      '30.000đ'
                    )}
                  </span>
                </div>
              </div>

              <div className="py-4 sm:py-6">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold text-gray-900">Tổng cộng</span>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">{formattedTotal}đ</span>
                    {subtotal() < 500000 && (
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Đã bao gồm VAT</p>
                    )}
                  </div>
                </div>
                {subtotal() < 500000 && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 p-2.5 sm:p-3 bg-gray-50 rounded-xl">
                      <span className="text-red-500 font-medium">Mua thêm {(500000 - subtotal()).toLocaleString('vi-VN')}đ</span> để được miễn phí vận chuyển
                    </p>
                  )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 sm:py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <span>{token ? 'Tiến hành thanh toán' : 'Đăng nhập để thanh toán'}</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="w-full mt-2 sm:mt-4 py-2.5 sm:py-3 text-center text-gray-600 hover:text-black font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Tiếp tục mua sắm
              </Link>

              {/* Trust Badges */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-500">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  Thanh toán an toàn 100%
                </div>
                <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-500">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Hỗ trợ 24/7
                </div>
                <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-500">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Đổi trả trong 30 ngày
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
