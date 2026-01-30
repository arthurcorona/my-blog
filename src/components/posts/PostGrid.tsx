import { Link } from "react-router-dom";
import { PostCard } from './PostCard';
import type { PostWithAuthor } from '@/types/database';
import { FileText } from 'lucide-react';

interface PostGridProps {
  posts: PostWithAuthor[];
  isLoading?: boolean;
  isAdmin?: boolean;
  onPublishPost?: (id: string) => void; //teste function;
}

export const PostGrid = ({ posts, isLoading, isAdmin, onPublishPost }: PostGridProps) => {
  if (isLoading) {
    return <p>Carregando posts...</p>;
  }

  if (posts.length === 0) {
    return <p className="text-muted-foreground">Nenhum post encontrado.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {posts.map((post) => (
        <Link to={`/posts/${post.slug}`} key={post.id} className="block">
          <article key={post.id} className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{post.title}</h3>

              {isAdmin && post.status === 'draft' && onPublishPost && (
                <button
                  onClick={() => onPublishPost(post.id)}
                  className="text-xs px-2 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Publicar
                </button>
              )}
            </div>

            {post.status === 'draft' && isAdmin && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                RASCUNHO
              </span>
            )}

            <p className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString('pt-BR')} • {post.author.username}
            </p>

            {post.excerpt && (
              <p className="text-sm text-muted-foreground mt-1">
                {post.excerpt}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </article>
        </Link>
      ))}
    </div>
  );
};