import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Bookmark,
  Heart,
  Share2,
  Check,
  ArrowLeft,
  Tag,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import { BlogPost } from '../types';

interface PostDetailModalProps {
  post: BlogPost | null;
  onClose: () => void;
  isBookmarked: boolean;
  isLiked: boolean;
  onToggleBookmark: (postId: string, e: React.MouseEvent) => void;
  onToggleLike: (postId: string, e: React.MouseEvent) => void;
  onSelectTag: (tag: string) => void;
  allPosts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  isBookmarked,
  isLiked,
  onToggleBookmark,
  onToggleLike,
  onSelectTag,
  allPosts,
  onSelectPost,
}) => {
  const [copied, setCopied] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (post) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [post]);

  if (!post) return null;

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find 2 related posts from same category or tags
  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.id !== post.id &&
        (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
    )
    .slice(0, 2);

  return (
    <div
      id="post-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky top action header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            id="modal-back-btn"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to articles</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="modal-share-btn"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Share article link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied link</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              id={`modal-like-btn-${post.id}`}
              onClick={(e) => onToggleLike(post.id, e)}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-semibold ${
                isLiked
                  ? 'text-rose-600 bg-rose-50 border-rose-200'
                  : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`}
              />
              <span className="tabular-nums">{post.likes + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              id={`modal-bookmark-btn-${post.id}`}
              onClick={(e) => onToggleBookmark(post.id, e)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'text-blue-600 bg-blue-50 border-blue-200'
                  : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
              title={isBookmarked ? 'Saved' : 'Save article'}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`}
              />
            </button>

            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-5 sm:p-8 md:p-12 space-y-8">
          {/* Article Header */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-3 py-1 rounded-md font-bold bg-blue-600 text-white">
                {post.category}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedDate}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed border-l-2 border-blue-600 pl-4 py-1 italic">
              {post.excerpt}
            </p>

            {/* Author Profile Card */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-2xs"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{post.author.name}</p>
                <p className="text-xs text-slate-400">{post.author.role}</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden max-h-[420px] bg-slate-100 border border-slate-200">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Post Content Paragraphs */}
          <div className="max-w-3xl mx-auto space-y-6 text-slate-800 text-base sm:text-lg leading-relaxed font-sans">
            {post.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed text-slate-700">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="max-w-3xl mx-auto pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Tag className="w-3.5 h-3.5" />
                Topics:
              </span>
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    onSelectTag(tag);
                    onClose();
                  }}
                  className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="max-w-3xl mx-auto pt-8 border-t border-slate-200">
              <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Related Articles
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((related) => (
                  <div
                    key={related.id}
                    onClick={() => onSelectPost(related)}
                    className="group bg-slate-50 border border-slate-200 p-4 rounded-xl hover:border-slate-300 hover:bg-white transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                        {related.category}
                      </span>
                      <h5 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 line-clamp-2 mt-1">
                        {related.title}
                      </h5>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{related.readTime}</span>
                      <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Read <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
