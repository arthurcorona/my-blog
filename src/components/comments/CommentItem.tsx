import { useState } from 'react';
import { User as UserIcon, Mail, Lock, Reply } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommentForm } from './CommentForm';
import { Post, User, Tag, Comment } from "@/types";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Definindo o tipo recursivo (Comentário que tem lista de Comentários dentro)
interface CommentWithAuthor extends Comment {
  replies?: CommentWithAuthor[];
}

interface CommentItemProps {
  comment: CommentWithAuthor;
  postId: string;
  onReplyAdded?: () => void;
  depth?: number;
}

export function CommentItem({ comment, postId, onReplyAdded, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  const displayName = comment.user?.username || comment.guest_name || 'Anônimo';
  const avatarUrl = comment.user?.avatar_url;
  
  const isNested = depth > 0;

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onReplyAdded?.();
  };

  return (
    <div className={`${isNested ? 'ml-8 pl-4 border-l-2 border-border/50' : ''}`}>
      <div className="flex gap-3 py-4">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={avatarUrl || ''} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-mono">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{displayName}</span>
            
            {/* Verifica se tem user (logado) */}
            {comment.user && (
              <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                <UserIcon className="h-3 w-3 inline mr-0.5" />
                Usuário
              </span>
            )}
            
            <span className="text-xs text-muted-foreground">
              {format(new Date(comment.created_at), "d MMM 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed">
            {comment.content}
          </p>

          {depth < 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5 -ml-2"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <Reply className="h-3.5 w-3.5" />
              Responder
            </Button>
          )}

          {showReplyForm && (
            <div className="mt-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* render*/}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReplyAdded={onReplyAdded}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}