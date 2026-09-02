import React from 'react';
import { Calendar, Clock, Bookmark, Heart, ArrowUpRight } from 'lucide-react';
import { BlogPost, ViewMode } from '../types';

interface PostCardProps {
  post: BlogPost;
  viewMode: ViewMode;
  isBookmarked: boolean;
  isLiked: boolean;
  onToggleBookmark: (postId: string, e: React.MouseEvent) => void;
  onToggleLike: (postId: string, e: React.MouseEvent) => void;
  onSelectPost: (post: BlogPost) => void;
  onSelectTag: (tag: string, e: React.MouseEvent) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  viewMode,
  isBookmarked,
  isLiked,
  onToggleBookmark,
  onToggleLike,
  onSelectPost,
  onSelectTag,
}) => {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const categoryColorMap: Record<string, string> = {
    Engineering: 'bg-blue-100 text-blue-700',
    Design: 'bg-emerald-100 text-emerald-700',
    'AI & Data': 'bg-purple-100 text-purple-700',
    Leadership: 'bg-amber-100 text-amber-700',
    Productivity: 'bg-sky-100 text-sky-700',
  };

  const categoryBadgeClass =
    categoryColorMap[post.category] || 'bg-slate-100 text-slate-700';

  if (viewMode === 'list') {
    return (
      <article
        id={`post-card-${post.id}`}
        onClick={() => onSelectPost(post)}
        className="group relative bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-5 cursor-pointer"
      >
        {/* Thumbnail */}
        <div className="sm:w-56 h-48 sm:h-auto shrink-0 rounded-xl overflow-hidden bg-slate-100 relative">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <span
            className={`absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${categoryBadgeClass} shadow-2xs`}
          >
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Meta info */}
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-2 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="mt-2 text-slate-500 text-sm line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Bottom row */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <div className="text-xs">
                <p className="font-bold text-slate-900">{post.author.name}</p>
                <p className="text-[10px] text-slate-400">{post.author.role}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                id={`like-btn-${post.id}`}
                onClick={(e) => onToggleLike(post.id, e)}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
                  isLiked
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={isLiked ? 'Unlike post' : 'Like post'}
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`}
                />
                <span className="tabular-nums">{post.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <button
                id={`bookmark-btn-${post.id}`}
                onClick={(e) => onToggleBookmark(post.id, e)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid View (Default)
  return (
    <article
      id={`post-card-${post.id}`}
      onClick={() => onSelectPost(post)}
      className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Cover Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Top floating badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span
              className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${categoryBadgeClass} shadow-2xs`}
            >
              {post.category}
            </span>

            <button
              id={`bookmark-btn-grid-${post.id}`}
              onClick={(e) => onToggleBookmark(post.id, e)}
              className={`p-1.5 rounded-lg backdrop-blur-md border shadow-2xs transition-transform active:scale-95 ${
                isBookmarked
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white/90 text-slate-600 border-white/60 hover:bg-white hover:text-slate-900'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Metadata */}
          <div className="flex items-center gap-2.5 text-xs text-slate-400 mb-2 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-2 text-slate-500 text-sm line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="mt-4 flex items-center gap-1.5 flex-wrap">
            {post.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={(e) => onSelectTag(tag, e)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                #{tag}
              </button>
            ))}
            {post.tags.length > 3 && (
              <span className="text-[11px] text-slate-400">+{post.tags.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        {/* Author */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {post.author.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{post.author.role}</p>
          </div>
        </div>

        {/* Like & Read indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id={`like-btn-grid-${post.id}`}
            onClick={(e) => onToggleLike(post.id, e)}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
              isLiked
                ? 'text-rose-600 bg-rose-50'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isLiked ? 'Unlike post' : 'Like post'}
          >
            <Heart
              className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`}
            />
            <span className="tabular-nums text-xs">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>

          <span className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all p-1">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </article>
  );
};
