'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';

const VALID_COUPONS: Record<string, number> = {
  'GIAM10': 10,
  'GIAM20': 20,
  'SALE50': 50,
};

export default function CouponSection() {
  const { couponCode, discount, setCoupon, removeCoupon } = useCartStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleApply = () => {
    const code = input.trim().toUpperCase();
    if (!code) {
      setError('Vui lòng nhập mã giảm giá');
      return;
    }

    const percentage = VALID_COUPONS[code];
    if (percentage) {
      setCoupon(code, percentage);
      setInput('');
      setError('');
    } else {
      setError('Mã giảm giá không hợp lệ');
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setInput('');
    setError('');
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <h3 className="font-semibold text-gray-700 text-sm mb-3">Mã giảm giá</h3>
      {couponCode ? (
        <div className="flex items-center gap-3">
          <div className="flex-1 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
            <span className="mr-2">🎉</span>
            {couponCode} — Giảm {discount}%
          </div>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Xóa mã"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              placeholder="Nhập mã giảm giá..."
              className="flex-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Áp dụng
            </button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}
