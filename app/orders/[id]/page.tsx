'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import { orderApi, OrderResponse } from '@/api/order';
import toast from 'react-hot-toast';

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

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params.id);
  const { token, user, fetchUser, _hasHydrated } = useAuthStore();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!token) {
      router.push('/login?redirect=/orders');
      return;
    }
    if (!user) {
      fetchUser();
    }
  }, [_hasHydrated, token, user, fetchUser, router]);

  useEffect(() => {
    if (!_hasHydrated || !token || isNaN(orderId)) return;
    orderApi
      .getMyOrderDetail(orderId)
      .then((res) => setOrder(res))
      .catch(() => {
        toast.error('Không tìm thấy đơn hàng');
        router.push('/orders');
      })
      .finally(() => setLoading(false));
  }, [_hasHydrated, token, orderId, router]);

  const handleCancel = async () => {
    if (!order) return;
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

    setCancelling(true);
    try {
      const res = await orderApi.cancelMyOrder(order.id);
      setOrder(res);
      toast.success('Đơn hàng đã được hủy');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  if (!_hasHydrated || !token || !user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const canCancel = order.status === 'pending';

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => router.push('/orders')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Quay lịch sử đơn hàng
        </button>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{order.order_number}</h1>
                <p className="text-sm text-gray-400 mt-1">{formatDate(order.created_at)}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Sản phẩm</h2>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  {item.product_thumbnail ? (
                    <Image
                      src={item.product_thumbnail}
                      alt={item.product_name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-xl border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      KP
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.product_name}</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tổng phụ</span>
              <span className="text-gray-700">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phí ship</span>
              <span className="text-gray-700">{formatPrice(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t">
              <span className="text-gray-900">Tổng cộng</span>
              <span className="text-gray-900">{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          <div className="border-t p-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Địa chỉ giao hàng</h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">{order.customer_name}</p>
              <p className="text-gray-500">{order.customer_phone}</p>
              <p className="text-gray-500">{order.customer_email}</p>
              <p className="text-gray-500 mt-2">{order.shipping_address}</p>
              {order.notes && (
                <p className="text-gray-400 italic mt-2">Ghi chú: {order.notes}</p>
              )}
            </div>
          </div>

          {canCancel && (
            <div className="border-t p-6 bg-red-50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-red-700">Bạn có thể hủy đơn này</p>
                  <p className="text-xs text-red-500 mt-0.5">Đơn hàng chưa được xử lý, bạn có thể hủy ngay</p>
                </div>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                </button>
              </div>
            </div>
          )}

          {order.status === 'cancelled' && (
            <div className="border-t p-6 bg-red-50">
              <p className="text-sm font-medium text-red-600">
                Đơn hàng này đã bị hủy vào lúc {formatDate(order.updated_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
