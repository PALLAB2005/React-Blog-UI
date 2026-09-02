import React, { useRef, useEffect } from 'react';
import { Search, X, ArrowUpDown, LayoutGrid, List, Tag } from 'lucide-react';
import { SortOption, ViewMode } from '../types';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categoryCounts: Record<string, number>;
  allTags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFilteredResults: number;
  totalPosts: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  allTags,
  selectedTag,
  onSelectTag,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFilteredResults,
  totalPosts,
  onResetFilters,
  hasActiveFilters,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to quickly focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Top row: Search input + Sort dropdown + View Mode */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input container */}
        <div className="relative flex-1 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="blog-search-input"
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search articles by title, excerpt, topic, author..."
            className="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                id="search-clear-btn"
                onClick={() => onSearchChange('')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Controls: Sort and Layout View Switcher */}
        <div className="flex items-center gap-2.5 justify-between md:justify-end">
          {/* Sort selector */}
          <div className="relative flex items-center">
            <label htmlFor="sort-dropdown" className="sr-only">Sort posts</label>
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 hidden sm:inline">Sort:</span>
              <select
                id="sort-dropdown"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="readTime">Shortest Read</option>
              </select>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              id="view-mode-grid"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-mode-list"
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Pills (Mobile / Responsive Horizontal) */}
      <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              id={`filter-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectCategory(cat)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0 ${
                isSelected
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Popular Tags Quick Filter Row (Mobile / Responsive) */}
      {allTags.length > 0 && (
        <div className="flex lg:hidden items-center gap-1.5 flex-wrap pt-1 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-medium mr-1">
            <Tag className="w-3 h-3" />
            <span>Tags:</span>
          </div>
          {allTags.map((tag) => {
            const isTagSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                id={`filter-tag-mobile-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectTag(isTagSelected ? null : tag)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
                  isTagSelected
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Results indicator & active filter reset strip */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/80">
        <div>
          Showing <span className="font-semibold text-slate-800">{totalFilteredResults}</span> of{' '}
          <span className="font-semibold text-slate-800">{totalPosts}</span> posts
          {selectedCategory !== 'All' && (
            <span className="ml-1 text-slate-600">
              in <span className="font-semibold text-blue-700">"{selectedCategory}"</span>
            </span>
          )}
          {selectedTag && (
            <span className="ml-1 text-slate-600">
              tagged <span className="font-semibold text-blue-700">#{selectedTag}</span>
            </span>
          )}
          {searchQuery && (
            <span className="ml-1 text-slate-600">
              matching <span className="font-semibold text-slate-900">"{searchQuery}"</span>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            id="reset-all-filters-btn"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold hover:underline cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
