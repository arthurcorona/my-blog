import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { supabase } from '@/integrations/supabase/client';
import type { CommentWithAuthor, Profile } from '@/types/database';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch profiles separately for comments with user_id
      const userIds = [...new Set((data || []).filter(c => c.user_id).map(c => c.user_id))];
      const { data: profiles } = userIds.length > 0 
        ? await supabase.from('profiles').select('*').in('id', userIds)
        : { data: [] };

      const profilesMap = new Map((profiles || []).map((p: Profile) => [p.id, p]));

      // Organize comments into threads
      const commentsMap = new Map<string, CommentWithAuthor>();
      const rootComments: CommentWithAuthor[] = [];

      (data || []).forEach((comment) => {
        const commentWithReplies: CommentWithAuthor = {
          ...comment,
          author: comment.user_id ? profilesMap.get(comment.user_id) || null : null,
          replies: []
        };
        commentsMap.set(comment.id, commentWithReplies);
      });

      commentsMap.forEach((comment) => {
        if (comment.parent_id) {
          const parent = commentsMap.get(comment.parent_id);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(comment);
          }
        } else {
          rootComments.push(comment);
        }
      });

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

  const totalComments = comments.reduce((acc, comment) => {
    return acc + 1 + (comment.replies?.length || 0);
  }, 0);

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
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-16 bg-muted rounded" />
              </div>
            </div>
          ))}
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
