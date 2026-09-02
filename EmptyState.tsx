import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  selectedCategory: string;
  selectedTag: string | null;
  showOnlyBookmarks: boolean;
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  selectedCategory,
  selectedTag,
  showOnlyBookmarks,
  onResetFilters,
}) => {
  return (
    <div
      id="empty-state-view"
      className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-14 text-center max-w-xl mx-auto my-12 shadow-2xs"
    >
      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
        <SearchX className="w-7 h-7 text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        No matching articles found
      </h3>

      <p className="text-slate-500 text-sm leading-relaxed mb-6">
        {showOnlyBookmarks ? (
          "You haven't saved any articles matching these criteria yet. Try removing some filters or saving posts from the feed."
        ) : (
          <>
            We couldn't find any articles matching{' '}
            {searchQuery && <span className="font-semibold text-slate-900">"{searchQuery}"</span>}
            {selectedCategory !== 'All' && (
              <span> in category <span className="font-semibold text-slate-900">{selectedCategory}</span></span>
            )}
            {selectedTag && (
              <span> with tag <span className="font-semibold text-blue-600">#{selectedTag}</span></span>
            )}.
          </>
        )}
      </p>

      <button
        id="empty-state-reset-btn"
        onClick={onResetFilters}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset all filters</span>
      </button>
    </div>
  );
};
