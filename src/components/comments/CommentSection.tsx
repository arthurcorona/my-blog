import { useEffect, useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem'; // Certifique-se que o CommentItem aceita o tipo abaixo
import { api } from "@/lib/api"; 
import { Comment } from "@/types";


export interface CommentWithAuthor extends Comment {
  replies?: CommentWithAuthor[];
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    try {
      // O backend deve retornar: Comment[] (já com o objeto 'user' preenchido)
      const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
      const rawComments = response.data;

      // Threads
      const commentsMap = new Map<string, CommentWithAuthor>();
      const rootComments: CommentWithAuthor[] = [];

      // mapear o commentWithAuthor
      rawComments.forEach((c) => {
        commentsMap.set(c.id, { ...c, replies: [] });
      });

      // associar
      commentsMap.forEach((comment) => {
        if (comment.parent_id) {
          const parent = commentsMap.get(comment.parent_id);
          if (parent) {
            parent.replies?.push(comment);
          }
        } else {
          // se não tem pai, é um comentário raiz
          rootComments.push(comment);
        }
      });

      // Ordenar: Mais antigos primeiro (comportamento padrão de fórum) ou novos primeiro
      
      setComments(rootComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const countTotalComments = (list: CommentWithAuthor[]): number => {
    return list.reduce((acc, comment) => {
      return acc + 1 + (comment.replies ? countTotalComments(comment.replies) : 0);
    }, 0);
  };
  
  const totalComments = countTotalComments(comments);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">
          Comentários
          {totalComments > 0 && (
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              ({totalComments})
            </span>
          )}
        </h2>
      </div>

      <div className="p-4 rounded-lg bg-card/50 border border-border/50">
        <CommentForm postId={postId} onSuccess={fetchComments} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Seja o primeiro a comentar!</p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReplyAdded={fetchComments}
            />
          ))}
        </div>
      )}
    </section>
  );
}