'use client';

import { Suspense } from 'react';
import OrderConfirmationContent from './OrderConfirmationContent';

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-[80px]">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Đang tải...</p>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
