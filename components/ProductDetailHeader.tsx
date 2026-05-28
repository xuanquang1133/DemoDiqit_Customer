'use client';

import { useRouter } from 'next/navigation';

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xl font-bold">{title}</span>
      </div>
    </header>
  );
}
