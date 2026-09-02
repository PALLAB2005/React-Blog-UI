import React from 'react';
import { Bookmark, Search, X } from 'lucide-react';

interface NavbarProps {
  bookmarksCount: number;
  showOnlyBookmarks: boolean;
  onToggleBookmarksOnly: () => void;
  onResetFilters: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeNavTab: string;
  onNavTabChange: (tab: string) => void;
  onOpenSubscribe?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  bookmarksCount,
  showOnlyBookmarks,
  onToggleBookmarksOnly,
  onResetFilters,
  searchQuery,
  onSearchChange,
  activeNavTab,
  onNavTabChange,
  onOpenSubscribe,
}) => {
  return (
    <header className="h-16 sm:h-18 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs sticky top-0 z-30 transition-all">
      {/* Left: Brand & Navigation Links */}
      <div className="flex items-center gap-6 lg:gap-8">
        <button
          id="nav-brand-logo"
          onClick={() => {
            onResetFilters();
            onNavTabChange('Articles');
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-0.5"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
            <div className="w-3.5 h-3.5 bg-white rounded-xs"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 italic">
            DevJournal
          </span>
        </button>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
          <button
            id="nav-tab-articles"
            onClick={() => {
              onNavTabChange('Articles');
              if (showOnlyBookmarks) onToggleBookmarksOnly();
            }}
            className={`py-5 transition-colors ${
              activeNavTab === 'Articles' && !showOnlyBookmarks
                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-800'
            }`}
          >
            Articles
          </button>
          <button
            id="nav-tab-case-studies"
            onClick={() => {
              onNavTabChange('Case Studies');
            }}
            className={`py-5 transition-colors ${
              activeNavTab === 'Case Studies'
                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-800'
            }`}
          >
            Case Studies
          </button>
          <button
            id="nav-tab-resources"
            onClick={() => {
              onNavTabChange('Resources');
            }}
            className={`py-5 transition-colors ${
              activeNavTab === 'Resources'
                ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                : 'hover:text-slate-800'
            }`}
          >
            Resources
          </button>
        </nav>
      </div>

      {/* Right: Search + Saved Articles + Subscribe Button */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search in Navbar */}
        <div className="relative hidden sm:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="nav-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search posts..."
            className="pl-9 pr-8 py-1.5 sm:py-2 bg-slate-100 border-transparent rounded-full text-xs sm:text-sm w-48 sm:w-64 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-2.5 flex items-center text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Saved Articles Toggle Button */}
        <button
          id="nav-bookmarks-toggle"
          onClick={onToggleBookmarksOnly}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 border ${
            showOnlyBookmarks
              ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
          title="Filter saved posts"
        >
          <Bookmark
            className={`w-3.5 h-3.5 ${
              showOnlyBookmarks ? 'fill-blue-600 text-blue-600' : 'text-slate-400'
            }`}
          />
          <span className="hidden lg:inline">Saved</span>
          {bookmarksCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                showOnlyBookmarks ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {bookmarksCount}
            </span>
          )}
        </button>

        {/* Subscribe Button */}
        <button
          id="nav-subscribe-btn"
          onClick={() => {
            if (onOpenSubscribe) {
              onOpenSubscribe();
            } else {
              const el = document.getElementById('footer-subscribe-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="bg-slate-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs shrink-0"
        >
          Subscribe
        </button>
      </div>
    </header>
  );
};
