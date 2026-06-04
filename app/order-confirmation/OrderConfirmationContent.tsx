'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/api/order/index';

interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  product_thumbnail: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderData {
  id: number;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes: string;
  items_count: number;
  order_items: OrderItem[];
  created_at: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

function OrderConfirmationView({ orderId }: { orderId: number }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['order-confirmation', orderId],
    queryFn: () => orderApi.getMyOrderDetail(orderId),
    enabled: !!orderId,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN').format(price);

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-[80px]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-[80px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy đơn hàng</h3>
          <p className="text-gray-400 mb-6">Vui lòng kiểm tra lại mã đơn hàng</p>
        </div>
      </div>
    );
  }

  const order: OrderData = data;
  const items = order.order_items || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-[80px] max-w-3xl mx-auto px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Đặt hàng thành công!</h1>
          <p className="text-gray-500 text-sm">
            Cảm ơn bạn đã đặt hàng. Đơn hàng đang được xử lý.
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-5">
          <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-sm">Thông tin đơn hàng</h2>
            <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">
              {statusLabels[order.status] || order.status}
            </span>
          </div>

          <div className="p-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mã đơn hàng</span>
              <span className="font-bold text-gray-800">{order.order_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ngày đặt</span>
              <span className="font-medium text-gray-700">{formatDate(order.created_at)}</span>
            </div>
            {order.customer_name && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Người nhận</span>
                <span className="font-medium text-gray-700">{order.customer_name}</span>
              </div>
            )}
            {order.customer_phone && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Số điện thoại</span>
                <span className="font-medium text-gray-700">{order.customer_phone}</span>
              </div>
            )}
            {order.shipping_address && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Địa chỉ giao hàng</span>
                <span className="font-medium text-gray-700 text-right max-w-[60%]">{order.shipping_address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Product List */}
        {items.length > 0 && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-5">
            <div className="bg-gray-50 px-6 py-4">
              <h2 className="font-semibold text-sm text-gray-700">
                Sản phẩm đã đặt ({items.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product_thumbnail ? (
                      <Image
                        src={item.product_thumbnail}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm line-clamp-2">
                      {item.product_name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>x{item.quantity}</span>
                      <span>{formatPrice(item.price)}đ / sản phẩm</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-red-600 text-sm">
                      {formatPrice(item.subtotal)}đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Summary */}
        {items.length > 0 && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-6">
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-medium text-gray-700">{formatPrice(order.subtotal)}đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="font-medium text-gray-700">{formatPrice(order.shipping_fee)}đ</span>
              </div>
              <div className="border-t border-dashed pt-3 flex justify-between">
                <span className="font-semibold text-gray-800">Tổng cộng</span>
                <span className="font-bold text-red-600 text-lg">
                  {formatPrice(order.total_amount)}đ
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href={`/orders/${orderId}`}
            className="flex-1 bg-black text-white py-4 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Theo dõi đơn hàng
          </Link>
          <Link
            href="/products"
            className="flex-1 py-4 rounded-xl font-semibold text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Tiếp tục mua sắm
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-[80px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy đơn hàng</h3>
          <p className="text-gray-400 mb-6">Vui lòng kiểm tra lại mã đơn hàng</p>
        </div>
      </div>
    );
  }

  const id = parseInt(orderId, 10);
  if (isNaN(id)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-[80px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Mã đơn hàng không hợp lệ</h3>
          <p className="text-gray-400 mb-6">Vui lòng kiểm tra lại đường link</p>
        </div>
      </div>
    );
  }

  return <OrderConfirmationView orderId={id} />;
}
