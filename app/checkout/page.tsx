'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { orderApi } from '@/api/order/index';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
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
  const { items, shipping, clearCart } = useCartStore();
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
      const shippingFee = shipping();

      const orderData = await orderApi.createOrder({
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim(),
        customer_phone: formData.customer_phone.trim().replace(/\s+/g, ''),
        shipping_address: formData.shipping_address.trim(),
        shipping_fee: shippingFee,
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="pt-[80px] max-w-7xl mx-auto px-8 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Giỏ hàng trống</h3>
          <p className="text-gray-400 mb-6">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Tiếp tục mua sắm
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-[80px] max-w-7xl mx-auto px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-sm text-gray-500 mt-1">
            Vui lòng điền thông tin giao hàng để hoàn tất đơn hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Shipping Form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-black text-white px-6 py-4">
                <h2 className="font-semibold text-sm">Thông tin giao hàng</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      placeholder="Nhập họ tên của bạn"
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                        errors.customer_name
                          ? 'border-red-400 focus:ring-red-200 bg-red-50'
                          : 'border-gray-200 focus:ring-orange-200 focus:border-orange-400'
                      }`}
                    />
                    {errors.customer_name && (
                      <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                        errors.customer_email
                          ? 'border-red-400 focus:ring-red-200 bg-red-50'
                          : 'border-gray-200 focus:ring-orange-200 focus:border-orange-400'
                      }`}
                    />
                    {errors.customer_email && (
                      <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      placeholder="0xxxxxxxxx"
                      className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                        errors.customer_phone
                          ? 'border-red-400 focus:ring-red-200 bg-red-50'
                          : 'border-gray-200 focus:ring-orange-200 focus:border-orange-400'
                      }`}
                    />
                    {errors.customer_phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                      errors.shipping_address
                        ? 'border-red-400 focus:ring-red-200 bg-red-50'
                        : 'border-gray-200 focus:ring-orange-200 focus:border-orange-400'
                    }`}
                  />
                  {errors.shipping_address && (
                    <p className="text-red-500 text-xs mt-1">{errors.shipping_address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ghi chú cho đơn hàng (ví dụ: giao giờ hành chính, gọi trước khi giao...)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary Mobile */}
            <div className="lg:hidden">
              <CheckoutSummary />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/cart')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại giỏ hàng
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-red-500 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Đặt hàng
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Order Summary Desktop */}
          <div className="hidden lg:block">
            <CheckoutSummary />
          </div>
        </div>
      </main>
    </div>
  );
}
