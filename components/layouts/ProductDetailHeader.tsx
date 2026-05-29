'use client';

import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@/components/icons/CustomerChevronLeftIcon';
import InternshopLogo from '@/components/common/InternshopLogo';

export default function ProductDetailHeader() {
  const router = useRouter();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <InternshopLogo size="md" />
      </div>
    </header>
  );
}
