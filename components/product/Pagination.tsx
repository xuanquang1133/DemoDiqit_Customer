'use client';

import ChevronLeftIcon from '@/components/icons/CustomerChevronLeftIcon';
import ChevronRightIcon from '@/components/icons/CustomerChevronRightIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) {
      if (onPageChange) {
        onPageChange(currentPage - 1);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      if (onPageChange) {
        onPageChange(currentPage + 1);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePage = (pageNum: number) => {
    if (onPageChange) {
      onPageChange(pageNum);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-1 mt-6">
      <button
        onClick={handlePrev}
        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => handlePage(p)}
          className={`px-3 py-1 border rounded ${
            p === currentPage
              ? 'bg-black text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={handleNext}
        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
