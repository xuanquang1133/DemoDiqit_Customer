'use client';

import { useState, useRef, useEffect } from 'react';

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
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCat = categories.find((c) => String(c.id) === selectedCategory);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="appearance-none px-4 py-2 pr-10 border rounded-lg text-sm bg-white cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-black/10 min-w-[180px] text-left flex items-center justify-between"
          >
            <span className={selectedCat ? 'text-gray-900' : 'text-gray-400'}>
              {selectedCat ? selectedCat.name : 'Tất cả sản phẩm'}
            </span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  onCategoryChange('');
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors text-gray-400"
              >
                Tất cả sản phẩm
              </button>
              {categories.map((category: Category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    onCategoryChange(String(category.id));
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    String(category.id) === selectedCategory
                      ? 'bg-black text-white'
                      : 'text-gray-900'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
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
