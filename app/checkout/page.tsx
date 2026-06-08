'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { orderApi } from '@/api/order/index';
import toast from 'react-hot-toast';

interface FormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes: string;
}

interface FormErrors {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const subtotal = useCartStore((s) => s.subtotal);
  const shipping = useCartStore((s) => s.shipping);
  const total = useCartStore((s) => s.total);
  const { items, clearCart } = useCartStore();
  const { token, user, _hasHydrated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!token) {
      router.push('/login?redirect=/checkout');
    }
  }, [_hasHydrated, token, router]);

  const [formData, setFormData] = useState<FormData>({
    customer_name: user?.full_name ?? '',
    customer_email: user?.email ?? '',
    customer_phone: '',
    shipping_address: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Vui lòng nhập họ tên';
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Email không hợp lệ';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0[0-9]{9,10})$/.test(formData.customer_phone.replace(/\s+/g, ''))) {
      newErrors.customer_phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Vui lòng nhập địa chỉ giao hàng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (items.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = await orderApi.createOrder({
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim(),
        customer_phone: formData.customer_phone.trim().replace(/\s+/g, ''),
        shipping_address: formData.shipping_address.trim(),
        shipping_fee: shipping(),
        notes: formData.notes.trim(),
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
      toast.success('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
      router.push(`/order-confirmation?id=${orderData.id}&orderNumber=${encodeURIComponent(orderData.order_number)}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedTotal = new Intl.NumberFormat('vi-VN').format(subtotal());
  const shippingFee = shipping();
  const grandTotal = total();
  const formattedGrandTotal = new Intl.NumberFormat('vi-VN').format(grandTotal);
  const formattedShippingFee = new Intl.NumberFormat('vi-VN').format(shippingFee);

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
          <p className="text-gray-500 mb-8">Hãy thêm sản phẩm vào giỏ hàng của bạn để tiếp tục thanh toán.</p>
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm">Vui lòng điền thông tin giao hàng để hoàn tất đơn hàng</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left: Shipping Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-black to-gray-800 px-6 py-4">
                <h2 className="font-semibold text-sm text-white">Thông tin giao hàng</h2>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      placeholder="Nhập họ tên của bạn"
                      className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-sm focus:outline-none transition-all ${
                        errors.customer_name
                          ? 'border-red-300 bg-red-50 focus:border-red-400'
                          : 'border-gray-100 focus:border-red-400 focus:bg-white'
                      }`}
                    />
                    {errors.customer_name && (
                      <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-sm focus:outline-none transition-all ${
                        errors.customer_email
                          ? 'border-red-300 bg-red-50 focus:border-red-400'
                          : 'border-gray-100 focus:border-red-400 focus:bg-white'
                      }`}
                    />
                    {errors.customer_email && (
                      <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    placeholder="0xxxxxxxxx"
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-sm focus:outline-none transition-all ${
                      errors.customer_phone
                        ? 'border-red-300 bg-red-50 focus:border-red-400'
                        : 'border-gray-100 focus:border-red-400 focus:bg-white'
                    }`}
                  />
                  {errors.customer_phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-sm focus:outline-none transition-all ${
                      errors.shipping_address
                        ? 'border-red-300 bg-red-50 focus:border-red-400'
                        : 'border-gray-100 focus:border-red-400 focus:bg-white'
                    }`}
                  />
                  {errors.shipping_address && (
                    <p className="text-red-500 text-xs mt-1">{errors.shipping_address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ghi chú cho đơn hàng (ví dụ: giao giờ hành chính, gọi trước khi giao...)"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                href="/cart"
                className="px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Quay lại giỏ hàng
              </Link>
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-red-600 text-white py-4 rounded-xl font-semibold text-sm hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Đặt hàng ngay
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

              {/* Order Items */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-300">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">{formattedTotal}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-900">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${formattedShippingFee}đ`
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-red-600">{formattedGrandTotal}đ</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  Thanh toán an toàn 100%
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Hỗ trợ 24/7
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
