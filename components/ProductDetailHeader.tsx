'use client';

import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@/components/icons/CustomerChevronLeftIcon';

interface ProductDetailHeaderProps {
  title?: string;
}

export default function ProductDetailHeader({ title = 'INTERNSHOP' }: ProductDetailHeaderProps) {
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
        <span className="text-xl font-bold">{title}</span>
      </div>
    </header>
  );
}
