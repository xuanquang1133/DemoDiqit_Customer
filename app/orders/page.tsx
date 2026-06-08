'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import { orderApi, OrderResponse } from '@/api/order';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: {
    label: 'Đang chờ xử lý',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500',
  },
  processing: {
    label: 'Đang giao hàng',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  completed: {
    label: 'Đã hoàn thành',
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  cancelled: {
    label: 'Đã hủy',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrdersPage() {
  const router = useRouter();
  const { token, user, fetchUser, _hasHydrated } = useAuthStore();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!token) {
      router.push('/login?redirect=/orders');
    } else if (!user) {
      fetchUser();
    }
  }, [_hasHydrated, token, user, fetchUser, router]);

  useEffect(() => {
    if (!_hasHydrated || !token || !user) return;
    orderApi
      .getMyOrders(page, 10)
      .then((res) => {
        setOrders(res.items);
        setTotalPages(res.total_pages);
        setTotal(res.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [_hasHydrated, token, user, page]);

  if (!_hasHydrated || !token || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Tổng cộng {total} đơn hàng</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center">
            <div className="text-5xl mb-4">&#128722;</div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-sm text-gray-400 mb-6">Bạn chưa đặt mua sản phẩm nào</p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-2.5 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors"
            >
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-5 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{order.order_number}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">{formatDate(order.created_at)}</span>
                    <span className="font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
                  </div>

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="mt-2.5 sm:mt-3 flex gap-2 overflow-hidden">
                      {order.order_items.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex-shrink-0">
                          {item.product_thumbnail ? (
                            <Image
                              src={item.product_thumbnail}
                              alt={item.product_name}
                              width={40}
                              height={40}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border bg-gray-100 flex items-center justify-center text-[10px] sm:text-xs text-gray-400 font-medium">
                              KP
                            </div>
                          )}
                        </div>
                      ))}
                      {order.order_items.length > 4 && (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border bg-gray-50 flex items-center justify-center text-[10px] sm:text-xs text-gray-500 font-medium">
                          +{order.order_items.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-400">
                    {order.items_count} sản phẩm
                    {order.customer_name && ` — ${order.customer_name}`}
                  </div>
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                <span className="text-sm text-gray-500 px-2">
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Tiếp
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
