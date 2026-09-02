export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string; // e.g. "5 min read"
  coverImage: string;
  author: Author;
  featured?: boolean;
  likes: number;
}

export type SortOption = 'newest' | 'oldest' | 'popular' | 'readTime';

export type ViewMode = 'grid' | 'list';
