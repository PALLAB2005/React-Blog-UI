import React from 'react';
import { Calendar, Clock, Bookmark, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';

interface FeaturedPostProps {
  post: BlogPost;
  isBookmarked: boolean;
  isLiked: boolean;
  onToggleBookmark: (postId: string, e: React.MouseEvent) => void;
  onToggleLike: (postId: string, e: React.MouseEvent) => void;
  onSelectPost: (post: BlogPost) => void;
  onSelectTag: (tag: string, e: React.MouseEvent) => void;
}

export const FeaturedPost: React.FC<FeaturedPostProps> = ({
  post,
  isBookmarked,
  isLiked,
  onToggleBookmark,
  onToggleLike,
  onSelectPost,
  onSelectTag,
}) => {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section className="mb-8 sm:mb-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-md shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Editor's Spotlight
        </span>
      </div>

      <div
        id={`featured-post-${post.id}`}
        onClick={() => onSelectPost(post)}
        className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 cursor-pointer"
      >
        {/* Visual Cover */}
        <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[360px] overflow-hidden bg-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
          <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-lg bg-slate-900/90 text-white backdrop-blur-md shadow-2xs">
            {post.category}
          </span>
        </div>

        {/* Content Box */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5 font-medium">
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

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
              {post.title}
            </h2>

            <p className="mt-3 text-slate-600 text-sm leading-relaxed line-clamp-4">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="mt-4 flex items-center gap-1.5 flex-wrap">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={(e) => onSelectTag(tag, e)}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom actions & Author */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">{post.author.name}</p>
                <p className="text-[10px] text-slate-400">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id={`featured-like-btn-${post.id}`}
                onClick={(e) => onToggleLike(post.id, e)}
                className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs font-semibold ${
                  isLiked
                    ? 'text-rose-600 bg-rose-50 border-rose-200'
                    : 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`}
                />
                <span className="tabular-nums">{post.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <button
                id={`featured-bookmark-btn-${post.id}`}
                onClick={(e) => onToggleBookmark(post.id, e)}
                className={`p-2 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'text-blue-600 bg-blue-50 border-blue-200'
                    : 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
                title={isBookmarked ? 'Saved' : 'Save article'}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`}
                />
              </button>

              <span className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold group-hover:bg-blue-600 transition-colors shadow-2xs">
                Read Article
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
