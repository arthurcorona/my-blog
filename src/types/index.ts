export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  role: 'admin' | 'reader';
  created_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  author_id: string;
  //join
  author: User; 
  tags: Tag[];
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  // comment pode ser de user logado OU anônimo
  user?: User; 
  guest_name?: string;
  parent_id?: string | null; //threads
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'reviewed' | 'completed';
  upvotes_count: number;
  created_at: string;
  user: User;
}