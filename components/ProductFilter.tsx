'use client';

import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  code: string;
}

interface ProductFilterProps {
  keyword: string;
  selectedCategory: string;
  categories: Category[];
  onKeywordChange: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onClear: () => void;
}

export default function ProductFilter({
  keyword,
  selectedCategory,
  categories,
  onKeywordChange,
  onCategoryChange,
  onSearch,
  onClear,
}: ProductFilterProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search Form */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch(e)}
          className="w-64 px-4 py-2 border rounded-lg text-sm"
        />
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          Tìm kiếm
        </button>
        {(keyword || selectedCategory) && (
          <button
            onClick={onClear}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Xóa
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Danh mục:</label>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none px-4 py-2 pr-10 border rounded-lg text-sm bg-white cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="">Tất cả sản phẩm</option>
            {categories.map((category: Category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onCategoryChange('')}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Xóa lọc
          </button>
        )}
      </div>
    </div>
  );
}
