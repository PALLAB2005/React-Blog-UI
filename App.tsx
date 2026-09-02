import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, Layers, Tag, X } from 'lucide-react';
import rawPostsData from './data/posts.json';
import { BlogPost, SortOption, ViewMode } from './types';
import { Navbar } from './components/Navbar';
import { FeaturedPost } from './components/FeaturedPost';
import { SearchAndFilter } from './components/SearchAndFilter';
import { PostCard } from './components/PostCard';
import { PostDetailModal } from './components/PostDetailModal';
import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';

export default function App() {
  const allPosts: BlogPost[] = rawPostsData as BlogPost[];

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false);
  const [activeNavTab, setActiveNavTab] = useState<string>('Articles');

  // Active modal post
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  // Bookmarks & Likes persistent state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chronicle_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chronicle_likes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chronicle_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('chronicle_likes', JSON.stringify(likedIds));
    } catch (e) {
      console.error(e);
    }
  }, [likedIds]);

  // Handlers for likes and bookmarks
  const handleToggleBookmark = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleToggleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  // Derive categories list & counts
  const { categories, categoryCounts } = useMemo(() => {
    const cats = ['All'];
    const counts: Record<string, number> = { All: allPosts.length };

    allPosts.forEach((post) => {
      if (!cats.includes(post.category)) {
        cats.push(post.category);
      }
      counts[post.category] = (counts[post.category] || 0) + 1;
    });

    return { categories: cats, categoryCounts: counts };
  }, [allPosts]);

  // Derive all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allPosts.forEach((post) => {
      post.tags.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [allPosts]);

  // Filter and sort the posts
  const filteredAndSortedPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = allPosts.filter((post) => {
      // Nav tab filters
      if (activeNavTab === 'Case Studies' && post.category !== 'Engineering' && post.category !== 'AI & Data') {
        // Spotlight technical architecture case studies
        if (!post.tags.includes('architecture') && !post.tags.includes('database') && !post.tags.includes('performance')) {
          return false;
        }
      } else if (activeNavTab === 'Resources' && post.category !== 'Design' && post.category !== 'Productivity') {
        if (!post.tags.includes('design-systems') && !post.tags.includes('ui-ux') && !post.tags.includes('workflow')) {
          return false;
        }
      }

      // Bookmark filter
      if (showOnlyBookmarks && !bookmarkedIds.includes(post.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && post.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag && !post.tags.includes(selectedTag)) {
        return false;
      }

      // Search query filter (matches title, excerpt, content, tags, category, or author)
      if (query) {
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(query);
        const matchesAuthor = post.author.name.toLowerCase().includes(query);
        const matchesCategory = post.category.toLowerCase().includes(query);
        const matchesTags = post.tags.some((t) => t.toLowerCase().includes(query));
        const matchesContent = post.content.some((c) => c.toLowerCase().includes(query));

        if (
          !matchesTitle &&
          !matchesExcerpt &&
          !matchesAuthor &&
          !matchesCategory &&
          !matchesTags &&
          !matchesContent
        ) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      }
      if (sortBy === 'popular') {
        const aLikes = a.likes + (likedIds.includes(a.id) ? 1 : 0);
        const bLikes = b.likes + (likedIds.includes(b.id) ? 1 : 0);
        return bLikes - aLikes;
      }
      if (sortBy === 'readTime') {
        const aMinutes = parseInt(a.readTime, 10) || 0;
        const bMinutes = parseInt(b.readTime, 10) || 0;
        return aMinutes - bMinutes;
      }
      return 0;
    });
  }, [
    allPosts,
    searchQuery,
    selectedCategory,
    selectedTag,
    showOnlyBookmarks,
    activeNavTab,
    bookmarkedIds,
    sortBy,
    likedIds,
  ]);

  const hasActiveFilters = Boolean(
    searchQuery || selectedCategory !== 'All' || selectedTag || showOnlyBookmarks || activeNavTab !== 'Articles'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTag(null);
    setShowOnlyBookmarks(false);
    setActiveNavTab('Articles');
  };

  // Find spotlight featured post (only show if no specific search/filter query is active and category is 'All')
  const featuredPost = useMemo(() => {
    if (hasActiveFilters) return null;
    return allPosts.find((p) => p.featured) || allPosts[0];
  }, [allPosts, hasActiveFilters]);

  // Posts to render in the grid
  const gridPosts = useMemo(() => {
    if (featuredPost && !hasActiveFilters) {
      return filteredAndSortedPosts.filter((p) => p.id !== featuredPost.id);
    }
    return filteredAndSortedPosts;
  }, [filteredAndSortedPosts, featuredPost, hasActiveFilters]);

  // Header Title derivation
  const sectionTitle = useMemo(() => {
    if (showOnlyBookmarks) return 'Saved Articles';
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (selectedCategory !== 'All') return `${selectedCategory} Articles`;
    if (selectedTag) return `Topic: #${selectedTag}`;
    if (activeNavTab === 'Case Studies') return 'Engineering Case Studies';
    if (activeNavTab === 'Resources') return 'Design & System Resources';
    return 'Latest Articles';
  }, [showOnlyBookmarks, searchQuery, selectedCategory, selectedTag, activeNavTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header Navbar */}
      <Navbar
        bookmarksCount={bookmarkedIds.length}
        showOnlyBookmarks={showOnlyBookmarks}
        onToggleBookmarksOnly={() => setShowOnlyBookmarks((prev) => !prev)}
        onResetFilters={handleResetFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNavTab={activeNavTab}
        onNavTabChange={(tab) => {
          setActiveNavTab(tab);
          if (showOnlyBookmarks) setShowOnlyBookmarks(false);
        }}
      />

      {/* Main Two-Column Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar (Desktop) */}
          <aside className="w-full lg:w-72 shrink-0 hidden lg:block">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs sticky top-24 space-y-6">
              {/* Category Filter Section */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Filter by Category
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    const count = categoryCounts[cat] || 0;

                    return (
                      <button
                        key={cat}
                        id={`sidebar-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                        }`}
                      >
                        <span>{cat}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
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
              </div>

              {/* Popular Tags Section */}
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Popular Tags
                  </h3>
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 font-semibold"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((tag) => {
                    const isTagSelected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        id={`sidebar-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedTag(isTagSelected ? null : tag)}
                        className={`px-2.5 py-1 rounded-md text-xs transition-colors border cursor-pointer ${
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
              </div>

              {/* Pro Tip Card */}
              <div className="p-4 bg-slate-900 rounded-xl text-white shadow-2xs">
                <p className="text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Pro Tip
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-white font-mono">/</kbd> anywhere to search articles instantly.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Main Content Feed */}
          <main className="flex-1 min-w-0 w-full space-y-8">
            {/* Feed Header / Headline */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {sectionTitle}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Showing {filteredAndSortedPosts.length} posts in {selectedCategory === 'All' ? 'all categories' : selectedCategory}
                </p>
              </div>
            </div>

            {/* Editor's Featured Spotlight Header (when unfiltered) */}
            {featuredPost && (
              <FeaturedPost
                post={featuredPost}
                isBookmarked={bookmarkedIds.includes(featuredPost.id)}
                isLiked={likedIds.includes(featuredPost.id)}
                onToggleBookmark={handleToggleBookmark}
                onToggleLike={handleToggleLike}
                onSelectPost={(post) => setActivePost(post)}
                onSelectTag={(tag, e) => {
                  e.stopPropagation();
                  setSelectedTag(tag);
                }}
              />
            )}

            {/* Search, Filter, Sort, View Controls */}
            <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
              <SearchAndFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                categoryCounts={categoryCounts}
                allTags={allTags}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalFilteredResults={filteredAndSortedPosts.length}
                totalPosts={allPosts.length}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </section>

            {/* Post Grid / List or Empty State */}
            {gridPosts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : 'space-y-4'
                }
              >
                {gridPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    viewMode={viewMode}
                    isBookmarked={bookmarkedIds.includes(post.id)}
                    isLiked={likedIds.includes(post.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onToggleLike={handleToggleLike}
                    onSelectPost={(p) => setActivePost(p)}
                    onSelectTag={(tag, e) => {
                      e.stopPropagation();
                      setSelectedTag(tag);
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                selectedTag={selectedTag}
                showOnlyBookmarks={showOnlyBookmarks}
                onResetFilters={handleResetFilters}
              />
            )}
          </main>
        </div>
      </div>

      {/* Full Post Reader Modal */}
      <PostDetailModal
        post={activePost}
        onClose={() => setActivePost(null)}
        isBookmarked={activePost ? bookmarkedIds.includes(activePost.id) : false}
        isLiked={activePost ? likedIds.includes(activePost.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onToggleLike={handleToggleLike}
        onSelectTag={(tag) => setSelectedTag(tag)}
        allPosts={allPosts}
        onSelectPost={(post) => setActivePost(post)}
      />

      {/* Footer */}
      <Footer
        categories={categories}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

