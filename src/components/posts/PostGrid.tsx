import { PostCard } from './PostCard';
import type { PostWithAuthor } from '@/types/database';
import { FileText } from 'lucide-react';

interface PostGridProps {
  posts: PostWithAuthor[];
  isLoading?: boolean;
}

export function PostGrid({ posts, isLoading }: PostGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="h-80 rounded-lg bg-card/50 animate-pulse border border-border/50"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 rounded-full bg-muted/50 mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Nenhum post encontrado</h3>
        <p className="text-muted-foreground text-sm">
          Volte mais tarde para conferir novos conteúdos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}
