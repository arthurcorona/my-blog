export type AppRole = 'admin' | 'reader';
export type PostStatus = 'draft' | 'published';
export type SuggestionStatus = 'pending' | 'reviewed';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  role: AppRole;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  status: PostStatus;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface PostWithAuthor extends Post {
  author: Profile;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string | null;
  guest_name: string | null;
  content: string;
  is_approved: boolean;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommentWithAuthor extends Comment {
  author: Profile | null;
  replies?: CommentWithAuthor[];
}

export interface Suggestion {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: SuggestionStatus;
  upvotes_count: number;
  created_at: string;
  updated_at: string;
}

export interface SuggestionWithAuthor extends Suggestion {
  author: Profile;
  has_voted?: boolean;
}

export interface SuggestionVote {
  suggestion_id: string;
  user_id: string;
  created_at: string;
}
